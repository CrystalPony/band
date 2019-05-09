pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "../CommunityToken.sol";
import "../Parameters.sol";
import "../token/ERC20Acceptor.sol";
import "../feeless/Feeless.sol";
import "../utils/Expression.sol";
import "../utils/Fractional.sol";
import "../utils/KeyUtils.sol";


/**
 * @title TCR
 *
 * @dev TCR contract implements Token Curated Registry logic, with reward
 * distribution allocated equally to both winning and losing sides.
 */
contract TCR is Feeless, ERC20Acceptor {
  using Fractional for uint256;
  using SafeMath for uint256;
  using KeyUtils for bytes8;

  event ApplicationSubmitted(  // A new entry is submitted to the TCR.
    bytes32 data,
    address indexed proposer,
    uint256 listAt,
    uint256 deposit
  );

  event EntryDeposited(  // Someone deposits token to an entry
    bytes32 indexed data,
    uint256 value
  );

  event EntryWithdrawn(  // Someone withdraws token from an entry
    bytes32 indexed data,
    uint256 value
  );

  event EntryExited(  // An entry is exited
    bytes32 indexed data
  );

  event ChallengeInitiated(  // An new challenge is initiated.
    bytes32 indexed data,
    uint256 indexed challengeId,
    address indexed challenger,
    uint256 stake,
    bytes32 reasonData,
    uint256 proposerVote,
    uint256 challengeVote
  );

  event ChallengeVoteCommitted(  // A challenge vote is committed by voter
    uint256 indexed challengeId,
    address indexed voter,
    bytes32 commitValue
  );

  event ChallengeVoteRevealed(   // A challenge vote is revealed
    uint256 indexed challengeId,
    address indexed voter,
    bool voteKeep,
    uint256 weight
  );

  event ChallengeSuccess(  // A challenge is successful.
    bytes32 indexed data,
    uint256 indexed challengeId,
    uint256 voterRewardPool,
    uint256 challengerReward
  );

  event ChallengeFailed(  // A challenge has failed.
    bytes32 indexed data,
    uint256 indexed challengeId,
    uint256 voterRewardPool,
    uint256 proposerReward
  );

  event ChallengeInconclusive(  // A challenge is not conclusive
    bytes32 indexed data,
    uint256 indexed challengeId
  );

  event ChallengeRewardClaimed(  // A reward is claimed by a user.
    uint256 indexed challengeId,
    address indexed voter,
    uint256 reward
  );

  ExpressionInterface public depositDecayFunction;

  CommunityToken public token;
  Parameters public params;

  // Namespace prefix for all Parameters (See Parameters.sol) in this TCR
  bytes8 public prefix;

  // A TCR entry is considered to exist in 'entries' map iff its
  // 'listedAt' is nonzero.
  struct Entry {
    address proposer;        // The entry proposer
    uint256 deposit;         // Amount token that is not on challenge stake
    uint256 listedAt;        // Expiration time of entry's 'pending' status
    uint256 challengeId;     // Id of challenge, applicable if not zero
  }
  enum ChallengeState { Invalid, Open, Kept, Removed, Inconclusive }

  enum VoteStatus { Nothing, Committed, VoteKeep, VoteRemove, Claimed }
  // A challenge represent a challenge for a TCR entry. All challenges ever
  // existed are stored in 'challenges' map below.
  struct Challenge {
    bytes32 entryData;            // The hash of data that is in question
    bytes32 reasonData;           // The hash of reason for this challenge
    address challenger;           // The challenger
    uint256 rewardPool;           // Remaining reward pool. Relevant after resolved.
    uint256 remainingRewardVotes; // Remaining voting power to claim rewards.

    uint256 commitEndTime;
    uint256 revealEndTime;
    uint256 snapshotNonce;

    uint256 voteRemoveRequiredPct;
    uint256 voteMinParticipation;

    uint256 keepCount;
    uint256 removeCount;
    uint256 totalCommitCount;

    mapping (address => bytes32) voteCommits;
    mapping (address => VoteStatus) voteStatuses;
    ChallengeState state;
  }

  // Mapping of entry to its metadata. An entry is considered exist if its
  // 'listedAt' is nonzero.
  mapping (bytes32 => Entry) public entries;

  // Mapping of all changes ever exist in this contract.
  mapping (uint256 => Challenge) public challenges;

  // The Id of the next challenge.
  uint256 nextChallengeNonce = 1;

  constructor(
    bytes8 _prefix,
    CommunityToken _token,
    Parameters _params,
    ExpressionInterface decayFunction
  )
    public
  {
    prefix = _prefix;
    token = _token;
    params = _params;
    setExecDelegator(token.execDelegator());
    depositDecayFunction = decayFunction;
  }

  modifier entryMustExist(bytes32 data) {
    require(entries[data].listedAt > 0);
    _;
  }

  modifier entryMustNotExist(bytes32 data) {
    require(entries[data].listedAt == 0);
    _;
  }

  modifier challengeMustExist(uint256 challengeId) {
    require(challengeId > 0 && challengeId < nextChallengeNonce);
    _;
  }

  /**
   * @dev Return true iff the given entry is considered active in TCR at the
   * moment.
   */
  function isEntryActive(bytes32 data) public view returns (bool) {
    uint256 listedAt = entries[data].listedAt;
    return listedAt > 0 && now >= listedAt;
  }

  function getVoteStatus(uint256 challengeId, address voter) public view returns (VoteStatus) {
    return challenges[challengeId].voteStatuses[voter];
  }

  /**
   * @dev Get parameter config on the given key. Note that it prepend the key
   * with this contract's prefix to get the absolute key.
   */
  function get(bytes24 key) public view returns (uint256) {
    return params.get(prefix.append(key));
  }

  /**
   * @dev Get current min_deposit of the entry
   */
  function currentMinDeposit(bytes32 entryData)
    public
    view
    entryMustExist(entryData)
    returns (uint256)
  {
    Entry storage entry = entries[entryData];
    uint256 minDeposit = get("min_deposit");
    if (now < entry.listedAt) {
      return minDeposit;
    } else {
      return depositDecayFunction.evaluate(now.sub(entry.listedAt)).mulFrac(minDeposit);
    }
  }

  /**
   * @dev Apply a new entry to the TCR. The applicant must stake token at least
   * 'min_deposit'. Application will get auto-approved if no challenge happens
   * during the first 'apply_stage_length' seconds.
   */
  function applyEntry(address proposer, uint256 stake, bytes32 data)
    external
    requireToken(ERC20Interface(address(token)), proposer, stake)
    entryMustNotExist(data)
  {
    require(stake >= get("min_deposit"));
    Entry storage entry = entries[data];
    entry.proposer = proposer;
    entry.deposit = stake;
    entry.listedAt = now.add(get("apply_stage_length"));
    emit ApplicationSubmitted(data, proposer, entry.listedAt, stake);
  }

  /**
   * @dev Deposit more token to the given existing entry. The depositor must
   * be the entry applicant.
   */
  function deposit(address depositor, uint256 amount, bytes32 data)
    external
    requireToken(ERC20Interface(address(token)), depositor, amount)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == depositor);
    entry.deposit = entry.deposit.add(amount);
    emit EntryDeposited(data, amount);
  }

  /**
   * @dev Withdraw token from the given existing entry to the applicant.
   */
  function withdraw(address sender, bytes32 data, uint256 amount) public
    feeless(sender)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == sender);
    if (entry.challengeId == 0) {
      require(entry.deposit >= amount.add(currentMinDeposit(data)));
    } else {
      require(entry.deposit >= amount);
    }
    entry.deposit = entry.deposit.sub(amount);
    require(token.transfer(sender, amount));
    emit EntryWithdrawn(data, amount);
  }

  /**
   * @dev Delete the entry and refund everything to entry applicant. The entry
   * must not have an ongoing challenge.
   */
  function exit(address sender, bytes32 data) public
    feeless(sender)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == sender);
    require(entry.challengeId == 0);
    deleteEntry(data);
    emit EntryExited(data);
  }

  /**
   * @dev Initiate a new challenge to the given existing entry. The entry must
   * not already have ongoing challenge. If entry's deposit is less than
   * 'min_deposit', it is automatically deleted.
   */
  function initiateChallenge(
    address challenger,
    uint256 challengeDeposit,
    bytes32 data,
    bytes32 reasonData
  )
    public
    requireToken(ERC20Interface(address(token)), challenger, challengeDeposit)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.challengeId == 0 && entry.proposer != challenger);
    uint256 stake = Math.min(entry.deposit, currentMinDeposit(data));
    require(challengeDeposit >= stake);

    if (challengeDeposit != stake) {
      require(token.transfer(challenger, challengeDeposit.sub(stake)));
    }

    entry.deposit = entry.deposit.sub(stake);
    uint256 challengeId = nextChallengeNonce;
    uint256 proposerVote = token.historicalVotingPowerAtNonce(entry.proposer, token.votingPowerChangeNonce());
    uint256 challengerVote = token.historicalVotingPowerAtNonce(challenger, token.votingPowerChangeNonce());
    nextChallengeNonce = challengeId.add(1);
    challenges[challengeId] = Challenge({
      entryData: data,
      reasonData: reasonData,
      challenger: challenger,
      rewardPool: stake,
      remainingRewardVotes: 0,
      commitEndTime: now.add(get("commit_time")),
      revealEndTime: now.add(get("commit_time")).add(get("reveal_time")),
      snapshotNonce: token.votingPowerChangeNonce(),
      voteRemoveRequiredPct: get("support_required_pct"),
      voteMinParticipation: get("min_participation_pct").mulFrac(token.totalSupply()),
      keepCount: proposerVote,
      removeCount: challengerVote,
      totalCommitCount: proposerVote.add(challengerVote),
      state: ChallengeState.Open
    });
    entry.challengeId = challengeId;
    challenges[challengeId].voteStatuses[entry.proposer] = VoteStatus.VoteKeep;
    challenges[challengeId].voteStatuses[challenger] = VoteStatus.VoteRemove;
    emit ChallengeInitiated(data, challengeId, challenger, stake, reasonData, proposerVote, challengerVote);
  }

  function commitVote(address voter, uint256 challengeId, bytes32 commitValue)
    public
    feeless(voter)
  {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.state == ChallengeState.Open && now < challenge.commitEndTime);
    require(challenge.voteStatuses[voter] == VoteStatus.Nothing);
    challenge.voteCommits[voter] = commitValue;
    challenge.voteStatuses[voter] = VoteStatus.Committed;
    uint256 weight = token.historicalVotingPowerAtNonce(voter, challenge.snapshotNonce);
    challenge.totalCommitCount = challenge.totalCommitCount.add(weight);
    emit ChallengeVoteCommitted(challengeId, voter, commitValue);
  }

  function revealVote(address voter, uint256 challengeId, bool voteKeep, uint256 salt)
    public
  {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.state == ChallengeState.Open);
    require(now >= challenge.commitEndTime && now < challenge.revealEndTime);
    require(challenge.voteStatuses[voter] == VoteStatus.Committed);
    require(challenge.voteCommits[voter] == keccak256(abi.encodePacked(voteKeep, salt)));
    uint256 weight = token.historicalVotingPowerAtNonce(voter, challenge.snapshotNonce);
    if (voteKeep) {
      challenge.keepCount = challenge.keepCount.add(weight);
      challenge.voteStatuses[voter] = VoteStatus.VoteKeep;
    } else {
      challenge.removeCount = challenge.removeCount.add(weight);
      challenge.voteStatuses[voter] = VoteStatus.VoteRemove;
    }
    emit ChallengeVoteRevealed(challengeId, voter, voteKeep, weight);
  }

  /**
   * @dev Resolve TCR challenge. If the challenge succeeds, the entry will be
   * removed and the challenger gets the reward. Otherwise, the entry's
   * 'withdrawableDeposit' gets bumped by the reward.
   */
  function resolveChallenge(uint256 challengeId) public {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.state == ChallengeState.Open);
    ChallengeState result = _getChallengeResult(challenge);
    challenge.state = result;
    bytes32 data = challenge.entryData;
    Entry storage entry = entries[data];
    assert(entry.challengeId == challengeId);
    entry.challengeId = 0;
    uint256 challengerStake = challenge.rewardPool;
    uint256 winnerExtraReward = get("dispensation_percentage").mulFrac(challengerStake);
    uint256 winnerTotalReward = challengerStake.add(winnerExtraReward);
    uint256 rewardPool = challengerStake.sub(winnerExtraReward);
    if (result == ChallengeState.Kept) {
      // Get reward from voting
      uint256 proposerVote = token.historicalVotingPowerAtNonce(entry.proposer, challenge.snapshotNonce);
      uint256 proposerVoteReward = rewardPool.mul(proposerVote).div(challenge.keepCount);
      winnerTotalReward = winnerTotalReward.add(proposerVoteReward);
      entry.deposit = entry.deposit.add(winnerTotalReward);
      challenge.rewardPool = rewardPool.sub(proposerVoteReward);
      challenge.remainingRewardVotes = challenge.keepCount.sub(proposerVote);
      challenge.voteStatuses[entry.proposer] = VoteStatus.Claimed;
      emit ChallengeFailed(data, challengeId, challenge.rewardPool, winnerTotalReward);
    } else if (result == ChallengeState.Removed) {
      uint256 challengeVote = token.historicalVotingPowerAtNonce(challenge.challenger, challenge.snapshotNonce);
      uint256 challengeVoteReward = rewardPool.mul(challengeVote).div(challenge.removeCount);
      winnerTotalReward = winnerTotalReward.add(challengeVoteReward);
      require(token.transfer(challenge.challenger, winnerTotalReward));
      challenge.rewardPool = rewardPool.sub(challengeVoteReward);
      challenge.remainingRewardVotes = challenge.removeCount.sub(challengeVote);
      deleteEntry(data);
      challenge.voteStatuses[challenge.challenger] = VoteStatus.Claimed;
      emit ChallengeSuccess(data, challengeId, challenge.rewardPool, winnerTotalReward);
    } else if (result == ChallengeState.Inconclusive) {
      entry.deposit = entry.deposit.add(challengerStake);
      require(token.transfer(challenge.challenger, challengerStake));
      challenge.rewardPool = 0;
      emit ChallengeInconclusive(data, challengeId);
    } else {
      assert(false);
    }
  }

  /**
   * @dev Claim reward for the given challenge. The claimer must already reveal
   * the vote that is consistent with vote result.
   */
  function claimReward(address voter, uint256 challengeId) public {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.remainingRewardVotes > 0);
    if (challenge.state == ChallengeState.Kept) {
      require(challenge.voteStatuses[voter] == VoteStatus.VoteKeep);
    } else if (challenge.state == ChallengeState.Removed) {
      require(challenge.voteStatuses[voter] == VoteStatus.VoteRemove);
    } else {
      revert();
    }
    challenge.voteStatuses[voter] = VoteStatus.Claimed;
    uint256 weight = token.historicalVotingPowerAtNonce(voter, challenge.snapshotNonce);
    if (weight > 0) {
      uint256 remainingRewardPool = challenge.rewardPool;
      uint256 remainingRewardVotes = challenge.remainingRewardVotes;
      uint256 reward = remainingRewardPool.mul(weight).div(remainingRewardVotes);
      challenge.remainingRewardVotes = remainingRewardVotes.sub(weight);
      challenge.rewardPool = remainingRewardPool.sub(reward);
      require(token.transfer(voter, reward));
      emit ChallengeRewardClaimed(challengeId, voter, reward);
    }
  }

  function _getChallengeResult(Challenge storage challenge)
    internal
    view
    returns (ChallengeState)
  {
    assert(challenge.state == ChallengeState.Open);
    require(now >= challenge.commitEndTime);
    if (challenge.totalCommitCount < challenge.voteMinParticipation) {
      return ChallengeState.Inconclusive;
    }
    uint256 keepCount = challenge.keepCount;
    uint256 removeCount = challenge.removeCount;
    if (keepCount == 0 && removeCount == 0) {
      return ChallengeState.Inconclusive;
    }
    if (removeCount.mul(Fractional.getDenominator()) >= challenge.voteRemoveRequiredPct.mul(keepCount.add(removeCount))) {
      return ChallengeState.Removed;
    } else {
      return ChallengeState.Kept;
    }
  }

  /**
   * @dev Delete the given TCR entry and refund the token to entry owner
   */
  function deleteEntry(bytes32 data) internal {
    uint256 entryDeposit = entries[data].deposit;
    address proposer = entries[data].proposer;
    if (entryDeposit > 0) {
      require(token.transfer(proposer, entryDeposit));
    }
    delete entries[data];
  }
}