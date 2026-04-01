---
name: l2s
description: Ethereum Layer 2 landscape — Arbitrum, Optimism, Base, zkSync, Scroll, Linea, and more. How they work, how to deploy on them, how to bridge, when to use which. Use when choosing an L2, deploying cross-chain, or when a user asks about Ethereum scaling.
---

# Ethereum Layer 2s

## What You Probably Got Wrong

**L2 costs:** You think $0.01-2.00 per transaction. Reality: **$0.001-0.003** for swaps, **$0.0003** for transfers. After EIP-4844, L2 batch costs dropped from $50-500 to $0.01-0.50.

**Mainnet is cheap too:** At 0.05 gwei, mainnet ETH transfers cost $0.002. "Ethereum is too expensive" is false for both L1 and L2s in 2026.

**Base is the cheapest major L2:** Often 50% cheaper than Arbitrum/Optimism. Direct Coinbase on-ramp. Fastest-growing L2 with consumer/AI agent focus.

## L2 Comparison Table (Feb 2026)

| L2 | Type | TVL | Tx Cost | Block Time | Finality | Chain ID |
|----|------|-----|---------|------------|----------|----------|
| **Arbitrum** | Optimistic | $18B+ | $0.001-0.003 | 250ms | 7 days | 42161 |
| **Base** | Optimistic | $12B+ | $0.0008-0.002 | 2s | 7 days | 8453 |
| **Optimism** | Optimistic | $8B+ | $0.001-0.003 | 2s | 7 days | 10 |
| **Linea** | ZK | $900M+ | $0.003-0.006 | 2s | 30-60min | 59144 |
| **zkSync Era** | ZK | $800M+ | $0.003-0.008 | 1s | 15-60min | 324 |
| **Scroll** | ZK | $250M+ | $0.002-0.005 | 3s | 30-120min | 534352 |
| **Polygon zkEVM** | ZK | $150M+ | $0.002-0.005 | 2s | 30-60min | 1101 |

**Mainnet for comparison:** $50B+ TVL, $0.002-0.01, 8s blocks, instant finality.

## Cost Comparison (Real Examples, Feb 2026)

| Action | Mainnet | Arbitrum | Base | zkSync | Scroll |
|--------|---------|----------|------|--------|--------|
| ETH transfer | $0.002 | $0.0003 | $0.0003 | $0.0005 | $0.0004 |
| Uniswap swap | $0.015 | $0.003 | $0.002 | $0.005 | $0.004 |
| NFT mint | $0.015 | $0.002 | $0.002 | $0.004 | $0.003 |
| ERC-20 deploy | $0.118 | $0.020 | $0.018 | $0.040 | $0.030 |

## Quick L2 Selection Guide

| Need | Choose | Why |
|------|--------|-----|
| Cheapest gas | **Base** | ~50% cheaper than Arbitrum/Optimism |
| Deepest DeFi liquidity | **Arbitrum** | $18B TVL, most protocols |
| Coinbase users | **Base** | Direct on-ramp, free Coinbase→Base |
| No 7-day withdrawal wait | **ZK rollup** (zkSync, Scroll, Linea) | 15-120 min |
| AI agents / social apps | **Base** | ERC-8004, Farcaster, consumer ecosystem |
| Superchain ecosystem | **Optimism or Base** | OP Stack, shared infra |
| Maximum EVM compatibility | **Scroll or Arbitrum** | Bytecode-identical |

## The Superchain (OP Stack)

Optimism's vision: many L2s sharing security, bridging, and governance.

**OP Stack L2s:** Optimism, Base, Zora, Mode, PGN, Mint, opBNB, and 50+ more.

**What it enables:**
- Fast native bridging between Superchain members (~1-2 min vs 7 days)
- Shared governance and sequencer (future)
- Deploy on one OP Stack chain, easy to expand to others
- Superchain Interop (coming 2026) for cross-chain calls

## Deployment Differences (Gotchas)

### Optimistic Rollups (Arbitrum, Optimism, Base)
✅ Deploy like mainnet — just change RPC URL and chain ID. No code changes.

**Gotchas:**
- Don't use `block.number` for time-based logic (increments at different rates). Use `block.timestamp`.
- Arbitrum's `block.number` returns L1 block number, not L2.

### ZK Rollups
- **zkSync Era:** Must use `zksolc` compiler. Some opcodes not supported (`SELFDESTRUCT`, `CALLCODE`). Native account abstraction (all accounts are smart contracts).
- **Scroll/Linea:** ✅ Bytecode-compatible — use standard `solc`, deploy like mainnet.

## RPCs and Explorers

| L2 | RPC | Explorer |
|----|-----|----------|
| Arbitrum | `https://arb1.arbitrum.io/rpc` | https://arbiscan.io |
| Base | `https://mainnet.base.org` | https://basescan.org |
| Optimism | `https://mainnet.optimism.io` | https://optimistic.etherscan.io |
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

## Further Reading

- **L2Beat:** https://l2beat.com (security, TVL, risk analysis)
- **Arbitrum:** https://docs.arbitrum.io
- **Base:** https://docs.base.org
- **Optimism:** https://docs.optimism.io
