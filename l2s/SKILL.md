---
name: l2s
description: Ethereum Layer 2 landscape — Arbitrum, Optimism, Base, zkSync, Scroll, Linea, and more. How they work, how to deploy on them, how to bridge, when to use which. Use when choosing an L2, deploying cross-chain, or when a user asks about Ethereum scaling.
---

# Ethereum Layer 2s

## What Are L2s?

Layer 2s are blockchains that run on top of Ethereum, inheriting its security while offering cheaper and faster transactions. They bundle many L2 transactions into a single Ethereum mainnet transaction, amortizing the cost.

## The L2 Landscape (2025-2026)

### Optimistic Rollups (fraud proofs)

**Arbitrum One**
- **TVL:** Largest L2 by TVL
- **Stack:** Nitro (custom)
- **Gas:** ~$0.001-0.01 per transaction
- **Block time:** ~250ms
- **Bridge:** https://bridge.arbitrum.io
- **Explorer:** https://arbiscan.io
- **RPC:** `https://arb1.arbitrum.io/rpc`
- **Chain ID:** 42161
- **Best for:** DeFi, general purpose, has the deepest liquidity of any L2

**Optimism (OP Mainnet)**
- **Stack:** OP Stack (open source, used by many L2s)
- **Gas:** ~$0.001-0.01 per transaction
- **Block time:** 2 seconds
- **Bridge:** https://app.optimism.io/bridge
- **Explorer:** https://optimistic.etherscan.io
- **RPC:** `https://mainnet.optimism.io`
- **Chain ID:** 10
- **Best for:** General purpose, OP Stack ecosystem, Superchain vision

**Base**
- **Operated by:** Coinbase
- **Stack:** OP Stack (part of the Superchain)
- **Gas:** ~$0.001-0.01 per transaction
- **Block time:** 2 seconds
- **Bridge:** https://bridge.base.org
- **Explorer:** https://basescan.org
- **RPC:** `https://mainnet.base.org`
- **Chain ID:** 8453
- **Best for:** Consumer apps, onboarding from Coinbase, social/gaming, AI agents (ERC-8004 is on Base)

### ZK Rollups (validity proofs)

**zkSync Era**
- **Stack:** Custom zkEVM
- **Explorer:** https://explorer.zksync.io
- **Chain ID:** 324
- **Note:** Uses a slightly different compilation model. Some Solidity features may behave differently.
- **Best for:** Privacy-focused apps, ZK-native applications

**Scroll**
- **Stack:** zkEVM (bytecode-level compatible)
- **Explorer:** https://scrollscan.com
- **Chain ID:** 534352
- **Best for:** Bytecode-compatible ZK rollup — deploy the same Solidity without changes

**Linea**
- **Operated by:** Consensys (MetaMask team)
- **Stack:** zkEVM
- **Chain ID:** 59144
- **Best for:** MetaMask integration, Consensys ecosystem

## How to Deploy on an L2

For most L2s, deploying is **identical to mainnet** — just change the RPC URL and chain ID.

### With Foundry
```bash
# Deploy to Arbitrum
forge create src/MyContract.sol:MyContract \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --private-key $PRIVATE_KEY

# Deploy to Base
forge create src/MyContract.sol:MyContract \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY
```

### With Scaffold-ETH 2
```typescript
// scaffold.config.ts
import { chains } from "viem/chains";

const scaffoldConfig = {
  targetNetworks: [chains.arbitrum], // or chains.optimism, chains.base
  // ... rest of config
};
```

### Gotchas
- **zkSync:** May need a different compiler or deployment flow. Check their docs.
- **Gas estimation:** L2 gas has two components — L2 execution gas + L1 data gas. Most tools handle this automatically.
- **Block confirmations:** L2 blocks are fast (~250ms-2s) but full finality (posted to L1) takes longer (~minutes to hours depending on the L2).

## Bridging

Moving assets between mainnet and L2s.

### Official Bridges
Each L2 has an official bridge. These are the most secure but can be slow (especially L2→L1 on optimistic rollups, which has a ~7 day challenge period).

- Arbitrum: https://bridge.arbitrum.io
- Optimism: https://app.optimism.io/bridge
- Base: https://bridge.base.org

### Third-Party Bridges (Faster)
- **Across Protocol:** Fast bridging, good for users who don't want to wait
- **Stargate:** LayerZero-based bridging
- **Hop Protocol:** Multi-chain bridging

### L2→L1 Withdrawal Times
- **Optimistic Rollups (Arbitrum, Optimism, Base):** ~7 days for official bridge (challenge period). Use a third-party bridge for instant withdrawals (they front the liquidity).
- **ZK Rollups (zkSync, Scroll):** Minutes to hours (once the proof is verified on L1).

## Choosing an L2

| Priority | Recommendation |
|----------|---------------|
| Deepest DeFi liquidity | Arbitrum |
| Coinbase user onboarding | Base |
| Part of Superchain ecosystem | Optimism or Base |
| AI agent infrastructure | Base (ERC-8004) |
| ZK-native privacy | zkSync |
| Maximum EVM compatibility | Scroll or Arbitrum |
| Cheapest possible gas | Base or Optimism (very similar) |

**Default recommendation:** If you don't have a specific reason to choose otherwise, **Base** or **Arbitrum** are the safest bets for most new projects in 2026.

## Multi-Chain Strategy

Many projects deploy on multiple L2s. Considerations:
- **Liquidity fragmentation:** Your token's liquidity is split across chains
- **Contract addresses:** Same code can have different addresses on different chains (use CREATE2 for deterministic addresses)
- **State fragmentation:** Users on Arbitrum can't directly interact with your Optimism deployment
- **Cross-chain messaging:** Protocols like LayerZero, Chainlink CCIP, and Hyperlane enable cross-chain contract calls

## Key Contract Addresses on L2s

<!-- TODO: This section should link to the Contract Addresses skill for the full registry -->
See the [Contract Addresses skill](/addresses/SKILL.md) for verified addresses of major protocols across all chains.
