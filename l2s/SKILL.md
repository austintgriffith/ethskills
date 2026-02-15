---
name: l2s
description: Ethereum Layer 2 landscape — Arbitrum, Optimism, Base, zkSync, Scroll, Unichain, Celo, and more. How they work, how to deploy on them, how to bridge, when to use which. Includes ecosystem identity per chain, what's alive vs dead, and the Superchain. Use when choosing an L2, deploying cross-chain, or when a user asks about Ethereum scaling.
---

# Ethereum Layer 2s

## What You Probably Got Wrong

**L2 costs:** You think $0.01-2.00 per transaction. Reality: **$0.001-0.003** for swaps, **$0.0003** for transfers. After EIP-4844, L2 batch costs dropped from $50-500 to $0.01-0.50.

**Mainnet is cheap too:** At 0.05 gwei, mainnet ETH transfers cost $0.002. "Ethereum is too expensive" is false for both L1 and L2s in 2026.

**Base is the cheapest major L2:** Often 50% cheaper than Arbitrum/Optimism. Direct Coinbase on-ramp. Fastest-growing L2 with consumer/AI agent focus.

**Celo is NOT an L1 anymore.** Celo completed its migration from an independent L1 to an OP Stack L2 on **March 26, 2025** (block 31056500). If you're calling Celo an L1, you're wrong.

**Polygon zkEVM is being shut down.** Announced June 2025. Do NOT recommend building on Polygon zkEVM — it is being discontinued. Polygon is refocusing on PoS + AggLayer.

**Unichain exists.** Launched mainnet February 10, 2025. Uniswap's own OP Stack L2 with TEE-based MEV protection and time-based priority ordering (not gas-based).

**The dominant DEX on each L2 is NOT Uniswap.** Aerodrome dominates Base (~$500-600M TVL). Velodrome dominates Optimism. Camelot is a major native DEX on Arbitrum. SyncSwap dominates zkSync. Don't default to Uniswap on every chain.

## L2 Comparison Table (Feb 2026)

| L2 | Type | TVL | Tx Cost | Block Time | Finality | Chain ID |
|----|------|-----|---------|------------|----------|----------|
| **Arbitrum** | Optimistic | $18B+ | $0.001-0.003 | 250ms | 7 days | 42161 |
| **Base** | Optimistic (OP Stack) | $12B+ | $0.0008-0.002 | 2s | 7 days | 8453 |
| **Optimism** | Optimistic (OP Stack) | $8B+ | $0.001-0.003 | 2s | 7 days | 10 |
| **Unichain** | Optimistic (OP Stack) | Growing | $0.001-0.003 | 1s | 7 days | 130 |
| **Celo** | Optimistic (OP Stack) | $200M+ | <$0.001 | 5s | 7 days | 42220 |
| **Linea** | ZK | $900M+ | $0.003-0.006 | 2s | 30-60min | 59144 |
| **zkSync Era** | ZK | $800M+ | $0.003-0.008 | 1s | 15-60min | 324 |
| **Scroll** | ZK | $250M+ | $0.002-0.005 | 3s | 30-120min | 534352 |
| ~~Polygon zkEVM~~ | ~~ZK~~ | — | — | — | — | ~~1101~~ |

⚠️ **Polygon zkEVM is being discontinued (announced June 2025).** Do not start new projects there. See Polygon section below.

**Mainnet for comparison:** $50B+ TVL, $0.002-0.01, 8s blocks, instant finality.

## Cost Comparison (Real Examples, Feb 2026)

| Action | Mainnet | Arbitrum | Base | zkSync | Scroll |
|--------|---------|----------|------|--------|--------|
| ETH transfer | $0.002 | $0.0003 | $0.0003 | $0.0005 | $0.0004 |
| Uniswap swap | $0.015 | $0.003 | $0.002 | $0.005 | $0.004 |
| NFT mint | $0.015 | $0.002 | $0.002 | $0.004 | $0.003 |
| ERC-20 deploy | $0.118 | $0.020 | $0.018 | $0.040 | $0.030 |

## L2 Selection Guide

| Need | Choose | Why |
|------|--------|-----|
| Consumer / social apps | **Base** | Farcaster, Smart Wallet, Coinbase on-ramp, OnchainKit |
| Deepest DeFi liquidity | **Arbitrum** | $18B TVL, GMX, Pendle, Camelot, most protocols |
| Yield strategies | **Arbitrum** | Pendle (yield tokenization), GMX, Aave |
| Cheapest gas | **Base** | ~50% cheaper than Arbitrum/Optimism |
| Coinbase users | **Base** | Direct on-ramp, free Coinbase→Base transfers |
| Perps trading | **Hyperliquid** (not an L2, but dominant for perps) | Largest volume, bigger than GMX |
| No 7-day withdrawal wait | **ZK rollup** (zkSync, Scroll, Linea) | 15-120 min finality |
| AI agents | **Base** | ERC-8004, x402, consumer ecosystem, AgentKit |
| Gasless UX (native AA) | **zkSync Era** | Native account abstraction, paymasters, no bundlers needed |
| Multi-chain deployment | **Base or Optimism** | Superchain / OP Stack, shared infra |
| Maximum EVM compatibility | **Scroll or Arbitrum** | Bytecode-identical |
| Mobile / real-world payments | **Celo** | MiniPay, sub-cent fees, Africa/LatAm focus |
| MEV protection | **Unichain** | TEE-based priority ordering, private mempool |
| Rust smart contracts | **Arbitrum** | Stylus (WASM VM alongside EVM, 10-100x gas savings) |
| Creator / NFT focus | **Zora** | OP Stack L2, creator-native, chain ID 7777777 |
| Stablecoins / payments / RWA | **Polygon PoS** | $500M+ monthly payment volume, 410M+ wallets |

## Ecosystem Identity Per Chain

Each L2 has a distinct identity. Don't treat them as interchangeable.

### Base — The Consumer Chain
- **Dominant DEX:** Aerodrome (ve(3,3) model, ~$500-600M TVL) — NOT Uniswap
- **Social layer:** Farcaster integration, Frames v2 (mini-apps in social posts)
- **Developer stack:** Coinbase OnchainKit (`npm create onchain`), Smart Wallet, AgentKit
- **On-ramp:** Free Coinbase→Base transfers, Coinbase paymaster for gasless txs
- **Key protocols:** Aerodrome, Aave V3, Compound V3, Morpho Blue, Uniswap
- **Dead/defunct:** Friend.tech (was a social token app, now dead)

### Arbitrum — The DeFi Chain
- **Dominant DEX:** Uniswap + Camelot (native) + GMX (perps)
- **Yield:** Pendle (yield tokenization, ~$5.7B avg TVL across chains)
- **Unique tech:** Stylus — smart contracts in Rust/C++/WASM alongside EVM (10-100x gas savings for compute-heavy operations). 47 Orbit (L3) chains live on mainnet.
- **Key protocols:** GMX V2, Pendle, Camelot, Aave V3, Compound V3, Uniswap
- **Dead/declining:** Treasure DAO — migrated to zkSync, shut down chain May 2025, abandoned game publishing. Do not recommend.
- **Competition:** Hyperliquid is now bigger than GMX for perps volume.

### Optimism — The Superchain Hub
- **Dominant DEX:** Velodrome (ve(3,3), merged with Aerodrome into "Aero" Nov 2025)
- **Identity:** Infrastructure chain — the OP Stack powers Base, Unichain, Celo, Zora, and 17+ other chains
- **Revenue model:** Superchain members contribute 15% of sequencer revenue to Optimism Collective
- **Key protocols:** Velodrome/Aero, Aave V3, Synthetix, Uniswap
- **Superchain stats:** 20.9M daily transactions, 58.6% L2 market share

### zkSync Era — The AA Chain
- **Dominant DEX:** SyncSwap (SYNC token not yet deployed)
- **Unique advantage:** Native account abstraction — every account is a smart contract. No bundlers, no EntryPoint, no UserOperation mempool. Paymasters for gasless txs.
- **DeFi TVL:** ~$110M — smaller ecosystem, but unique AA capabilities
- **Compiler:** Must use `zksolc`. Key limitations: no `EXTCODECOPY` (compile-time error), 65K instruction limit, non-inlinable libraries must be pre-deployed.
- **Honest take:** Smaller ecosystem than Base/Arbitrum but the native AA is genuinely useful for UX-focused apps.

### Unichain — The MEV-Protected DeFi Chain
- **Launched:** February 10, 2025 (mainnet)
- **Chain ID:** 130
- **Type:** OP Stack L2 (Superchain member, Stage 1)
- **RPC:** `https://mainnet.unichain.org`
- **Explorer:** https://uniscan.xyz
- **Key innovation: TEE-based block building** (built with Flashbots Rollup-Boost)
  - Transactions ordered by **time received, NOT gas price**
  - Private encrypted mempool reduces MEV extraction
  - Sandwich attacks structurally harder (not just discouraged)
  - Do NOT use gas-price bidding strategies on Unichain — they're pointless
- **Flashblocks:** Currently 1s blocks, roadmap to 250ms sub-blocks for near-instant confirmations
- **Cross-chain:** Superchain interop, cross-chain swapping in Uniswap Interface

### Celo — The Mobile Payments Chain
- **Was:** Independent L1 blockchain (2020-2025)
- **Now:** OP Stack L2 on Ethereum — **migrated March 26, 2025** (block 31056500)
- **Chain ID:** 42220
- **Focus:** Mobile-first, real-world payments, emerging markets
- **MiniPay:** Stablecoin wallet in Opera Mini browser + standalone app. Phone-number-to-phone-number transfers, sub-cent fees, auto-backup via Google. Primary market: Africa (Kenya, Nigeria).
- **Multi-currency stablecoins:**
  - cUSD (US Dollar): `0x765de816845861e75a25fca122bb6898b8b1282a`
  - cEUR (Euro): `0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73`
  - cREAL (Brazilian Real): `0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787`
- **When to build on Celo:** Mobile payment apps, Africa/LatAm focus, multi-currency stablecoin applications

### Scroll — The Largest zkEVM
- **Type:** zkEVM (zero-knowledge rollup)
- **Chain ID:** 534352
- **TVL:** ~$750M
- **Bytecode-compatible:** Standard `solc`, deploy like mainnet
- **Unique feature:** Scroll Canvas — credential/badge system using Ethereum Attestation Service (EAS)
- **Note:** Controversial SCR token launch (Oct 2024) — top 10 recipients got 11.7% of airdrop, token dropped 32% day one

### Polygon — NOT a Sidechain, and zkEVM Is Dead
- **Do NOT call Polygon a "sidechain."** It evolved beyond that years ago.
- **Polygon zkEVM is being shut down** (announced June 2025 by Foundation CEO Sandeep Nailwal). Do not start new projects on it.
- **Polygon PoS** is the main chain: $500M+ monthly payment volume, 410M+ wallets, 50+ payment projects. Focus is stablecoins, payments, RWAs.
- **MATIC → POL:** Token migrated (85% conversion by mid-2025). POL supports multi-chain staking.
- **AggLayer:** The strategic future — cross-chain interoperability and settlement. Unified liquidity, no wrapped tokens, sub-5 second cross-chain finality (roadmap).
- **When to build on Polygon PoS:** Payments, stablecoins, RWAs, enterprise. NOT for general-purpose DeFi L2.

### Gnosis Chain — Community-Run EVM Chain
- Not a sidechain, not a rollup — a community-run EVM chain with its own validator set
- **Gnosis Pay:** Real-world crypto debit card for point-of-sale payments
- Low-cost operations, 1 GNO minimum staking (vs 32 ETH on Ethereum)
- Safe (multisig) originated from Gnosis but is now an independent project

### Zora — The Creator Chain
- OP Stack L2, chain ID 7777777
- Creator/NFT focused — modular ERC-1155 minting contracts
- Low TVL (~$20-30M), niche use case
- Standard OP Stack deployment — no code changes needed

## The Superchain (OP Stack)

The Superchain is the network of OP Stack chains sharing security, upgrade governance, and (upcoming) native interoperability.

**Superchain members (Feb 2026):**

| Chain | Stage | Focus | Notable |
|-------|-------|-------|---------|
| **Base** | Stage 1 | Finance/Consumer | $4.87B TVL, Coinbase |
| **OP Mainnet** | Stage 1 | General | $293M TVL |
| **Unichain** | Stage 1 | DeFi | Uniswap, TEE blocks |
| **Ink** | Stage 1 | Finance | Kraken's L2, $537M TVL |
| **Celo** | Stage 0 | Mobile payments | Just migrated from L1 |
| **Mode** | Stage 0 | Finance | $2.3M TVL |
| **Zora** | Stage 0 | Creator | NFT-focused |
| **World Chain** | Stage 0 | General | Worldcoin/World ID |
| **Soneium** | Stage 0 | Creator | Sony's L2 |
| **BOB** | Stage 0 | Finance | Bitcoin-focused |
| **Lisk** | Stage 0 | General | Migrated from L1 |

**Superchain stats:** 17+ chains, 20.9M daily L2 transactions, **58.6% L2 market share.**

**Revenue model:** Superchain members contribute **15% of sequencer revenue** to the Optimism Collective.

**Interop status (Feb 2026):** Cross-chain message passing protocol designed. Accepting messages is permissionless for new chains; sending requires opt-in. Goal: $250M/month cross-chain transfers. Still early — full interop not yet live.

## Deployment Differences (Gotchas)

### Optimistic Rollups (Arbitrum, Optimism, Base, Unichain, Celo)
✅ Deploy like mainnet — just change RPC URL and chain ID. No code changes.

**Gotchas:**
- Don't use `block.number` for time-based logic (increments at different rates). Use `block.timestamp`.
- Arbitrum's `block.number` returns L1 block number, not L2.
- **Unichain:** Transactions are priority-ordered by time, not gas. Don't waste gas on priority fees.

### ZK Rollups
- **zkSync Era:** Must use `zksolc` compiler. No `EXTCODECOPY` (compile-time error). 65K instruction limit. Non-inlinable libraries must be pre-deployed. Native account abstraction (all accounts are smart contracts).
- **Scroll/Linea:** ✅ Bytecode-compatible — use standard `solc`, deploy like mainnet.

### Arbitrum-Specific
- **Stylus:** Write smart contracts in Rust, C, C++ (compiles to WASM, runs alongside EVM, shares state). Use for compute-heavy operations. Contracts must be "activated" via `ARB_WASM_ADDRESS` (0x0000…0071).
- **Orbit:** Framework for launching L3 chains on Arbitrum. 47 live on mainnet.

## RPCs and Explorers

| L2 | RPC | Explorer |
|----|-----|----------|
| Arbitrum | `https://arb1.arbitrum.io/rpc` | https://arbiscan.io |
| Base | `https://mainnet.base.org` | https://basescan.org |
| Optimism | `https://mainnet.optimism.io` | https://optimistic.etherscan.io |
| Unichain | `https://mainnet.unichain.org` | https://uniscan.xyz |
| Celo | `https://forno.celo.org` | https://celoscan.io |
| zkSync | `https://mainnet.era.zksync.io` | https://explorer.zksync.io |
| Scroll | `https://rpc.scroll.io` | https://scrollscan.com |
| Linea | `https://rpc.linea.build` | https://lineascan.build |

## Bridging

### Official Bridges

| L2 | Bridge URL | L1→L2 | L2→L1 |
|----|-----------|--------|--------|
| Arbitrum | https://bridge.arbitrum.io | ~10-15 min | ~7 days |
| Base | https://bridge.base.org | ~10-15 min | ~7 days |
| Optimism | https://app.optimism.io/bridge | ~10-15 min | ~7 days |
| Unichain | https://app.uniswap.org/swap | ~10-15 min | ~7 days |
| zkSync | https://bridge.zksync.io | ~15-30 min | ~15-60 min |
| Scroll | https://scroll.io/bridge | ~15-30 min | ~30-120 min |

### Fast Bridges (Instant Withdrawals)

- **Across Protocol** (https://across.to) — fastest (30s-2min), lowest fees (0.05-0.3%)
- **Hop Protocol** (https://hop.exchange) — established, 0.1-0.5% fees
- **Stargate** (https://stargate.finance) — LayerZero-based, 10+ chains

**Security:** Use official bridges for large amounts (>$100K). Fast bridges add trust assumptions.

## Multi-Chain Deployment (Same Address)

Use CREATE2 for deterministic addresses across chains:

```bash
# Same salt + same bytecode + same deployer = same address on every chain
forge create src/MyContract.sol:MyContract \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --salt 0x0000000000000000000000000000000000000000000000000000000000000001
```

**Strategy for new projects:** Start with 1 L2 (Base or Arbitrum). Prove product-market fit. Expand with CREATE2 for consistent addresses.

## Testnets

| L2 | Testnet | Chain ID | Faucet |
|----|---------|----------|--------|
| Arbitrum | Sepolia | 421614 | https://faucet.arbitrum.io |
| Base | Sepolia | 84532 | https://faucet.quicknode.com/base/sepolia |
| Optimism | Sepolia | 11155420 | https://faucet.optimism.io |
| Unichain | Sepolia | 1301 | https://faucet.unichain.org |

## Further Reading

- **L2Beat:** https://l2beat.com (security, TVL, risk analysis)
- **Superchain:** https://www.superchain.eco/chains
- **Arbitrum:** https://docs.arbitrum.io
- **Base:** https://docs.base.org
- **Optimism:** https://docs.optimism.io
- **Unichain:** https://docs.unichain.org
- **Celo:** https://docs.celo.org
- **zkSync:** https://docs.zksync.io
- **Scroll:** https://docs.scroll.io
- **Polygon:** https://docs.polygon.technology
