# Lottery Results (Kovan)

This dataset provides up-to-date lottery results from worldwide lottery authorities. Decentralized applications can consume this data to help with their decision. Example applications include, decentralized betting, shared lottery pools, insurance, etc.

| Contract              | Address                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dataset Token         | [0x815CcAEa74C689E980E78eCc95A88CeD77CB0DBd](https://kovan.etherscan.io/address/0x815CcAEa74C689E980E78eCc95A88CeD77CB0DBd) |
| Dataset Oracle        | [0x7b09c1255b27fCcFf18ecC0B357ac5fFf5f5cb31](https://kovan.etherscan.io/address/0x7b09c1255b27fCcFf18ecC0B357ac5fFf5f5cb31) |
| Governance Parameters | [0x88be588852474e3a194deb44D30150a58a627d2b](https://kovan.etherscan.io/address/0x88be588852474e3a194deb44D30150a58a627d2b) |

## Key-Value Format

Similar to other datasets on Band Protocol, data consumers query for lottery data by providing an _input key_ in return for an _output value_. We cover the specification in this subsection.

### Input Key

An input key consists of two parts, concatnated with `/` as the delimiter.

- The first part, [Lottery Type](#supported-lottery-types), is a unique identifier that identifies lottery type.
- The remaining part will depend on lottery type.

### Output Value

An output needs to be parsed differently depending on the input key. Consult each lottery type below for more details.

## Supported Lottery Types

Below is the list of lottery types currently supported. Each type comes with its unique _keyword_ to use as the first part of query keys.

### US Multi-State Powerball - `PWB`

Query-specific input part is the date of the lottery (US time) in the format of `YYYYMMDD`. The 32-byte output can be parsed as follows:

- Each of the first five bytes represents a number of a non-special white ball. Each byte must be parsed to a `uint8`. For instance, hex `0x12` represents number 18.
- The next byte represents the value of the red Powerball.
- The next byte represents the multipler value.

| Input Key (hex)            | Input Key (ascii) | Output Value (hex)   |
| -------------------------- | ----------------- | -------------------- |
| `5057422f3230313930383137` | `PWB/20190817`    | `1215181e3c1403....` |

### US Multi-State MegaMillions - `MMN`

Query-specific input part is the date of the lottery (US time) in the format of `YYYYMMDD`. The 32-byte output can be parsed as follows:

- Each of the first five bytes represents a number of a non-special white ball. Each byte must be parsed to a `uint8`. For instance, hex `0x12` represents number 18.
- The next byte represents the value of the golden Megaball.
- The next byte represents the multipler value.

| Input Key (hex)            | Input Key (ascii) | Output Value (hex)   |
| -------------------------- | ----------------- | -------------------- |
| `4d4d4e2f3230313930383136` | `MMN/20190816`    | `040e181a2e0e02....` |
