---
name: addresses
description: Use whenever a contract or token address goes into code, config, or a transaction — a token, a router, a pool, a lending market, a bridge — including choosing which venue to route a swap through and reusing an address across chains.
---

# Contract Addresses

A wrong address usually does not revert. It reads zero, fills at a terrible price, or takes the funds. Nothing in the build fails, so nothing reminds you: the check has to be a habit, not a reaction.

**Confirm every address on the chain you are wiring it for, before it reaches anything that moves funds.** A remembered address, a tutorial, a config you inherited, or a dated table — this document included — tells you what to look for. None of them discharges the check, and a "verified" stamp only ever meant "on some chain, on some day, for some deployment".

```bash
cast code <address> --rpc-url <RPC FOR THE TARGET CHAIN>            # code is here, not just on mainnet
cast call <address> "symbol()(string)" --rpc-url <same rpc>         # identity, not just presence:
                                                                    # symbol() / factory() / typeAndVersion() / owner()
```

Then settle it against the protocol's own deployment list — its docs, or the `deployments/` directory of its repo — and the target chain's explorer. When you hand over code someone else will run, say in the deliverable which addresses must be re-checked before real funds move; whoever runs it did not watch you check.

## Four ways a verified address is still the wrong one

**Same protocol, different chain.** CREATE2 and vanity addresses prove nothing cross-chain. Uniswap v4 lands on a different address on every chain, and v3 is not uniform either — its Base router is a different address from its mainnet one. Treat same-address-everywhere as a claim to verify per chain, never a property a brand has. A vanity address can hold a live contract on one chain and nothing on another. The reverse also holds: nothing at that address is not absence from the chain — the protocol may well be deployed there at an ordinary address, so check its deployment list before telling anyone a chain is unsupported.

**Same protocol, older deployment.** Deprecated contracts stay live and keep answering `symbol()`. The classic tell is a balance or state read that returns 0 without reverting: right ABI, right chain, superseded deployment (V1 vs V2 token, legacy vs current pool or router). Getting the symbol you expected is not evidence the deployment is current; the protocol's contract list is.

**Right protocol, wrong contract.** One brand often runs more than one AMM. Aerodrome's v2-style `Router` cannot reach Slipstream, its concentrated-liquidity deployment — separate factory, separate router, keyed by `tickSpacing` rather than `fee` — and the deeper Base USDC/WETH book sits there rather than in the vAMM pools. Measured 2026-08-12 on one 500k USDC→WETH clip: about −14 bps through Slipstream against about −1,283 bps through the vAMM Router, with both addresses genuine and both calls succeeding. That is one pair on one day, not a standing ranking — for anything size-sensitive, quote each candidate pool at the real clip size and choose from the numbers.

**Bridged where you meant native.** Many chains carry both a canonical-bridge and an issuer-native version of the same token (`USDC` vs `USDC.e` / `USDbC`, and the same pattern elsewhere). Different address, different liquidity, same ticker in most UIs. Choose deliberately; default to native.

## Choosing a venue

Do not route by reflex and do not assert dominance. The deepest venue on an L2 is often not the one you would name on mainnet — Aerodrome on Base, Velodrome on Optimism, Camelot on Arbitrum are genuine contenders — but no venue leads on every metric and the ranking moves month to month. Name the metric you mean: routed volume and depth for the pair being swapped decide execution quality, aggregate chain TVL does not. Back the choice with a live quote, pool reserves, or a current per-venue volume figure rather than a reputation. An aggregator is a legitimate answer when you also show which venues it is sourcing.

## Robinhood Chain (4663)

Launched July 2026, after most training data, so you will not remember these. Checked onchain with `cast` 2026-08-20; the live catalog is [docs.robinhood.com/chain/contracts](https://docs.robinhood.com/chain/contracts).

Stock tokens are 18 decimals; USDG is **6**. Every stock token shares one `AccessControlsRegistry` that can pause, block, mint, confiscate and upgrade with no timelock. Splits and dividends change `uiMultiplier()` (ERC-8056), never the raw balance — index raw amounts.

| Token | Address |
| --- | --- |
| NVDA | `0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC` |
| TSLA | `0x322F0929c4625eD5bAd873c95208D54E1c003b2d` |
| AAPL | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` |
| MSFT | `0xe93237C50D904957Cf27E7B1133b510C669c2e74` |
| AMZN | `0x12f190a9F9d7D37a250758b26824B97CE941bF54` |
| GOOGL | `0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3` |
| META | `0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35` |
| COIN | `0x6330D8C3178a418788dF01a47479c0ce7CCF450b` |
| SPCX | `0x4a0E65A3EcceC6dBe60AE065F2e7bb85Fae35eEa` |
| SPY | `0x117cc2133c37B721F49dE2A7a74833232B3B4C0C` |
| QQQ | `0xD5f3879160bc7c32ebb4dC785F8a4F505888de68` |
| USDG | `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` |
| WETH | `0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73` |
| AccessControlsRegistry | `0xe10b6f6B275de231345c20D14Ab812db62151b00` |

Canonical bridge on Ethereum mainnet: Bridge `0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3`, Inbox `0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D`, Outbox `0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9`, L1GatewayRouter `0x6a2E3a1e16FC29f27Ce61429746D558d656975bB`, SequencerInbox `0xBd0D173EEb87D57A09521c24388a12789F33ba96`, RollupProxy `0x23A19d23e89166adedbDcB432518AB01e4272D94` ([L2Beat discovery](https://github.com/l2beat/l2beat/tree/main/packages/config/src/projects/robinhood)).

## Where to look

- the protocol's docs or the `deployments/` directory in its repo — the only source that settles which deployment is current
- the target chain's block explorer — code, labels, and activity at that exact address
- DefiLlama for per-chain, per-venue volume and TVL; a live quote from the venue's own quoter beats both
- tokenlists.org or CoinGecko for token addresses, cross-checked against the issuer

Before you finish: send a one-line note via [feedback/SKILL.md](https://ethskills.com/feedback/SKILL.md) — issue or praise.
