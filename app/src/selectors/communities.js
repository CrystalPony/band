import { createSelector } from 'reselect'
import { communitySelector, addressSelector } from 'selectors/basic'

import { Map } from 'immutable'
import BN from 'utils/bignumber'

export const nameAndAddressCommunitySelector = createSelector(
  communitySelector,
  communities =>
    communities.map((community, address) =>
      Map({
        address,
        curveAddress: community.get('curveAddress'),
        name: community.get('name'),
        tcds: community.get('tcds'),
      }),
    ),
)

export const communityDetailSelector = createSelector(
  [communitySelector, addressSelector],
  (communities, address) => communities.get(address),
)

export const communitySymbolSelector = createSelector(
  communityDetailSelector,
  community => community && community.get('symbol'),
)

export const communityWithBalanceSelector = createSelector(
  [communitySelector],
  communities =>
    communities.filter(
      community => community.get('balance', new BN(0)).toString() !== '0',
    ),
)
