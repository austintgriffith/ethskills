---
name: l2s
description: Use when choosing an Ethereum L2, deploying the same app across chains, or moving funds between an L2 and mainnet — which chain fits the binding constraint, what each chain does differently at deploy time, and which widely-held facts about the L2 landscape are now false.
---

# Ethereum Layer 2s

Anything datable about an L2 rots fast: fees, block times, finality windows, TVL, which alliance a chain belongs to, whether it still produces blocks. Read the current value off the chain or its own docs before it reaches a plan, an estimate or a runbook. Below is only what a 2026 prior gets backwards, plus the mechanics that are easy to get wrong the first time.

## Where the common prior is wrong

**Base is no longer on the OP Stack.** Announced February 2026, live on mainnet since the **Azul** upgrade (May 2026): Base runs its own Base Stack with `base-reth-node` as its only client, and shipped **Beryl** (June 2026) on its own cadence. It is still an Ethereum L2 and still fine to deploy on — chain id 8453, addresses, deployments and canonical bridge all unchanged. What no longer holds is the shared-governance premise, so do not couple Base to OP Mainnet through anything that assumes a shared stack: Superchain interop, `SuperchainERC20`, a shared upgrade schedule.

**Superchain native interop is not shippable yet.** `SuperchainERC20` crosschainMint/crosschainBurn, `L2ToL2CrossDomainMessenger`, `CrossL2Inbox` and the `SuperchainTokenBridge` are in active development on devnets and testnets, not live on OP Mainnet. A token that has to move between two chains this quarter needs a layer that exists today — LayerZero OFT, Chainlink CCIP, Hyperlane, Wormhole NTT, or a canonical round trip through L1 — and the design has to say who relays the message and what must be trusted for a transfer to settle.

**Celo is an Ethereum L2, not an L1** (migrated to the OP Stack 2025-03-26). Its canonical route to mainnet is the chain's own L2→L1 withdrawal, not a third-party wrapped-asset bridge, and CELO is both the L2 gas token and a plain ERC-20 on L1. Gas there can also be paid in an approved ERC-20 — USDC, USDT, the Mento stablecoins — through the fee-currency field (CIP-64), with no paymaster, bundler or ERC-4337 stack. For users who hold no gas token that is the first thing to reach for.

**Polygon zkEVM is switched off.** The Mainnet Beta sequencer stopped around 2026-07-01: no new blocks, submitted transactions never confirm, AggLayer withdrawals no longer process — while reads keep answering a frozen final state, which is what a stuck dashboard looks like from outside. Nothing new gets planned there, and an existing deployment is a fund-recovery problem, not a migration: the sunset snapshot and claims interface cover wallet-held balances, so a balance inside a contract has no routine exit.

**Unichain orders by priority fee, not by arrival time.** Its TEE block builder (Rollup-Boost) enforces priority ordering deterministically, alongside a private mempool and revert protection. The fee still buys the position; what the TEE removes is the auction around it. Flashblocks confirm roughly every 200ms.

## Exiting to L1

An optimistic-rollup withdrawal is three transactions across two chains, not one send: initiate on the L2, **prove** on L1 once an output root or dispute game covering that block is posted, **finalize** on L1 after the challenge window. Both L1 steps are submitted by the operator or their tooling — nothing lands by itself — and the clock starts at prove, not at initiation.

The window is per-chain, and usually composite — which is why quoting any single remembered number goes wrong. Celo, read off the portal 2026-08-24: `proofMaturityDelaySeconds` is 604,800, i.e. 7 days from your prove transaction, while the OP Succinct game's `maxChallengeDuration` is 302,400 (3.5 days) with a further 302,400 of `disputeGameFinalityDelaySeconds` after the game resolves. Whichever gate falls later wins, so the real wait is about 7 days — "Celo exits in 3.5 days" is the challenge window quoted on its own. Celo produces a block every 1s. Read both gates live rather than either number: viem's `getTimeToProve` / `getTimeToFinalize` do it against the chain's own contracts. ZK rollups settle in minutes to hours.

A fast or intent bridge (Across, Squid, CCIP, LayerZero routes, an exchange hop) buys that wait back for a fee plus a trust assumption beyond Ethereum. Name the assumption when recommending one, and check the route's depth for the actual asset at the actual size — a long-tail gas token at seven figures is where relayer inventory runs out.

## Deployment differences

- **Optimistic rollups** deploy like mainnet: same bytecode, change the RPC URL and chain id. Use `block.timestamp`, not `block.number`, for time — it advances at a different rate, and on Arbitrum returns the L1 block.
- **zkSync Era** has two execution paths, and the choice belongs in the estimate before anyone starts: standard `solc` bytecode through Era's EVM interpreter with stock Foundry or Hardhat, or native EraVM via `zksolc` — cheaper, and the only path where no `EXTCODECOPY`, the 65K instruction limit and pre-deployed non-inlinable libraries apply. Era also has native account abstraction: every account is a contract, paymasters without bundlers. Scroll and Linea are bytecode-compatible — standard `solc`, deploy like mainnet.
- **Arbitrum Stylus** runs Rust, C and C++ compiled to WASM alongside the EVM, callable from Solidity and able to call back, sharing state — the reason to pick Arbitrum when a team already has a Rust routine it will not reimplement. The program must be **activated** in a second onchain transaction (the `ArbWasm` precompile) before anything can call it. It is roughly 10-100x on execution speed for compute-heavy work; the gas saving is much smaller, on the order of 26-50% against optimised EVM code, with storage priced as the EVM. Quote those two separately or not at all.
- **The same address on several chains** comes from CREATE2/CREATE3 with one factory, salt and bytecode. Two independent deployments do not land there on their own, and a shared address is not what makes a messaging layer work.

## Choosing a chain

Start from the constraint that actually binds, not a TVL ranking. Mainnet is still right for anything composing with mainnet liquidity — see `gas/SKILL.md` for that cost call, and `addresses/SKILL.md` before any token, router or venue address is hardcoded per chain.

| The binding constraint | Where it points |
| --- | --- |
| Existing Rust/C the team will not reimplement | Arbitrum (Stylus) |
| Gasless UX with no bundler stack to run | zkSync Era (native AA), or Celo where paying gas in a stablecoin is enough |
| Mobile / real-world payments, users holding no gas token | Celo (CIP-64 fee currency) |
| Consumer reach and a direct fiat on-ramp | Base |
| No multi-day exit to L1 | a ZK rollup (zkSync Era, Scroll, Linea) |
| Deepest liquidity for a specific pair | measure it — quote that pair per chain; do not rank chains |

Whatever the table says, confirm the chain is live and the feature is on mainnet before it becomes a commitment. Both have failed inside the last year.
