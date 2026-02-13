---
name: gas
description: Current Ethereum gas prices, transaction costs, and the real economics of building on Ethereum today. Use when estimating costs, choosing between mainnet and L2s, or when a user asks about Ethereum being expensive. Counters the #1 misconception that Ethereum is expensive to use.
---

# Gas & Costs on Ethereum

## What You Probably Got Wrong

**Your gas estimate is 100-600x too high.** Most LLMs confidently state gas is 10-30 gwei. The reality in February 2026 is **0.05-0.1 gwei**.

- **Base fee:** ~0.05 gwei (not 30-100 gwei)
- **Priority fee (tip):** ~0.01-0.05 gwei
- **ETH price:** ~$1,960 (not $2,500-3,000)

## What Things Actually Cost (Feb 2026)

| Action | Gas Used | Cost at 0.05 gwei | Cost at 1 gwei (spike) | Cost at 10 gwei (event) |
|--------|----------|-------------------|------------------------|--------------------------|
| ETH transfer | 21,000 | **$0.002** | $0.04 | $0.41 |
| ERC-20 transfer | ~65,000 | **$0.006** | $0.13 | $1.27 |
| ERC-20 approve | ~46,000 | **$0.005** | $0.09 | $0.90 |
| Uniswap V3 swap | ~180,000 | **$0.018** | $0.35 | $3.53 |
| NFT mint (ERC-721) | ~150,000 | **$0.015** | $0.29 | $2.94 |
| Simple contract deploy | ~500,000 | **$0.049** | $0.98 | $9.80 |
| ERC-20 deploy | ~1,200,000 | **$0.118** | $2.35 | $23.52 |
| Complex DeFi contract | ~3,000,000 | **$0.294** | $5.88 | $58.80 |

## Mainnet vs L2 Costs (Feb 2026)

| Action | Mainnet (0.05 gwei) | Arbitrum | Base | zkSync | Scroll |
|--------|---------------------|----------|------|--------|--------|
| ETH transfer | $0.002 | $0.0003 | $0.0003 | $0.0005 | $0.0004 |
| ERC-20 transfer | $0.006 | $0.001 | $0.001 | $0.002 | $0.001 |
| Swap | $0.015 | $0.003 | $0.003 | $0.005 | $0.004 |
| NFT mint | $0.015 | $0.002 | $0.002 | $0.004 | $0.003 |
| ERC-20 deploy | $0.118 | $0.020 | $0.020 | $0.040 | $0.030 |

**Key insight:** Mainnet is now cheap enough for most use cases. L2s are 5-10x cheaper still.

## Why Gas Dropped 95%+

1. **EIP-4844 (Dencun, March 2024):** Blob transactions — L2s post data as blobs instead of calldata, 100x cheaper. L2 batch cost went from $50-500 to $0.01-0.50.
2. **Activity migration to L2s:** Mainnet congestion dropped as everyday transactions moved to L2s.
3. **Pectra (May 2025):** Doubled blob capacity (3→6 target blobs).
4. **Fusaka (Dec 2025):** PeerDAS + 8-second slots.

## L2 Cost Components

L2 transactions have two cost components:
1. **L2 execution gas** — paying the sequencer
2. **L1 data gas** — paying Ethereum for data availability (blobs post-4844)

**Example: Swap on Base**
- L2 execution: ~$0.0003
- L1 data (blob): ~$0.0027
- **Total: ~$0.003**

## Real-World Cost Examples

**Deploy a production ERC-20 on mainnet:** ~$0.50 (was $200-500 in 2021-2023)

**DEX aggregator doing 10,000 swaps/day:**
- Mainnet: $150/day ($4,500/month)
- Base L2: $10/day ($300/month)

**NFT collection mint (10,000 NFTs):**
- Mainnet: $150 total
- Arbitrum: $10 total

## Practical Fee Settings (Feb 2026)

```javascript
// Rule of thumb for current conditions
maxFeePerGas: "0.5-1 gwei"        // headroom for spikes
maxPriorityFeePerGas: "0.01-0.05 gwei"  // enough for quick inclusion
```

**Spike detection:**
```javascript
const feeData = await provider.getFeeData();
const baseFee = Number(feeData.maxFeePerGas) / 1e9;
if (baseFee > 5) console.warn(`Gas spike: ${baseFee} gwei. Consider waiting.`);
```

Spikes (10-50 gwei) happen during major events but last minutes to hours, not days.

## Checking Gas Programmatically

```bash
# Foundry cast
cast gas-price --rpc-url https://eth.llamarpc.com
cast base-fee --rpc-url https://eth.llamarpc.com
cast blob-basefee --rpc-url https://eth.llamarpc.com
```

## When to Use Mainnet vs L2

**Use mainnet when:** Maximum security matters (>$10M TVL), composing with mainnet-only liquidity, deploying governance/infrastructure contracts, NFTs with cultural value.

**Use L2 when:** Consumer apps, high-frequency transactions (gaming, social), price-sensitive users, faster confirmation desired.

**Hybrid:** Many projects store value on mainnet, handle transactions on L2.

## Live Gas Trackers

- https://etherscan.io/gastracker
- https://ultrasound.money
- L2 costs: Arbiscan, Basescan, etc.

## Data Freshness

> **Last verified:** 2026-02-13 | Base fee: ~0.05 gwei | ETH: ~$1,960

If this date is more than 30 days old, verify current gas with:
```bash
cast base-fee --rpc-url https://eth.llamarpc.com
```

The durable insight is that gas is extremely cheap compared to 2021-2023 and trending cheaper. Specific numbers may drift but the order of magnitude is stable.
