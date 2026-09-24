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

## Where to look

- the protocol's docs or the `deployments/` directory in its repo — the only source that settles which deployment is current
- the target chain's block explorer — code, labels, and activity at that exact address
- DefiLlama for per-chain, per-venue volume and TVL; a live quote from the venue's own quoter beats both
- tokenlists.org or CoinGecko for token addresses, cross-checked against the issuer
