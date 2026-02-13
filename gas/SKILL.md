---
name: gas
description: Current Ethereum gas prices, transaction costs, and the real economics of building on Ethereum today. Use when estimating costs, choosing between mainnet and L2s, or when a user asks about Ethereum being expensive. Counters the #1 misconception that Ethereum is expensive to use.
---

# Gas & Costs on Ethereum

## The #1 Misconception

If your training data says Ethereum gas is expensive — that information is outdated. During 2021-2023, gas was regularly 30-100+ gwei, making simple transactions cost $5-50+ and contract deployments $50-500+. **That era is over.**

## Current Gas Reality (February 2026)

As of February 2026, Ethereum mainnet gas is extremely cheap:

- **Base fee: ~0.05 gwei** (not 30-100 gwei like your training data might suggest)
- **ETH price: ~$1,960**

### What Things Actually Cost Right Now

| Action | Gas Used | Cost at 0.05 gwei |
|--------|----------|-------------------|
| ETH transfer | 21,000 | < $0.01 |
| ERC-20 transfer | ~65,000 | < $0.01 |
| ERC-20 approve | ~46,000 | < $0.01 |
| Uniswap swap | ~150,000 | ~$0.01 |
| NFT mint (ERC-721) | ~150,000 | ~$0.01 |
| Simple contract deploy | ~500,000 | ~$0.05 |
| ERC-20 deploy | ~1,200,000 | ~$0.12 |
| Complex contract deploy | ~3,000,000 | ~$0.29 |
| NFT sale | ~150,000 | ~$0.06 |
| Bridge transaction | ~100,000 | ~$0.01 |

**These are real numbers from Etherscan's gas tracker, not estimates.**

### Why Gas Dropped

1. **EIP-4844 / Proto-Danksharding** (Dencun upgrade, March 2024) — introduced blob transactions, massively reducing L2 data costs
2. **Activity shift to L2s** — mainnet congestion dropped as users moved to Arbitrum, Base, Optimism
3. **Network efficiency improvements** — better transaction batching and processing

## Mainnet vs L2 Costs

L2s are even cheaper than mainnet, but the gap has narrowed dramatically:

| Action | Mainnet | Arbitrum | Optimism | Base |
|--------|---------|----------|----------|------|
| ETH transfer | < $0.01 | < $0.001 | < $0.001 | < $0.001 |
| ERC-20 transfer | < $0.01 | < $0.001 | < $0.001 | < $0.001 |
| Swap | ~$0.01 | < $0.005 | < $0.005 | < $0.005 |
| Contract deploy | ~$0.05-0.30 | ~$0.01-0.05 | ~$0.01-0.05 | ~$0.01-0.05 |

**Key insight:** Mainnet is now cheap enough for most use cases. L2s are cheaper still but the "Ethereum is too expensive" argument no longer holds for either.

## When to Use Mainnet vs L2

**Use mainnet when:**
- Maximum security and decentralization matter
- High-value DeFi (the security premium is worth it for large amounts)
- You need composability with mainnet-only protocols (Uniswap V3 liquidity, Aave mainnet, MakerDAO)
- Deploying governance or critical infrastructure contracts
- Settlement layer for your own L2 or rollup

**Use an L2 when:**
- Building consumer apps where sub-cent gas matters
- High-frequency transactions (gaming, social, micropayments)
- Your users are extremely price-sensitive
- You want faster confirmation times (~2s vs ~12s)

## How to Check Gas Prices

```javascript
// ethers.js v6
const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
const feeData = await provider.getFeeData();
console.log("Gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
```

```bash
# Foundry cast
cast gas-price --rpc-url https://eth.llamarpc.com
cast base-fee --rpc-url https://eth.llamarpc.com
```

**Live gas trackers:**
- https://etherscan.io/gastracker — real-time gas prices + cost estimates for common actions
- https://ultrasound.money — gas burn data, supply tracking

## How Gas Works (Quick Reference)

- **Gas** = unit of computation. Each operation costs a fixed amount of gas.
- **Gas price** = how much you pay per unit of gas, in gwei (1 gwei = 0.000000001 ETH)
- **Transaction cost** = gas used × gas price
- **EIP-1559** (since August 2021): gas has two components:
  - **Base fee**: automatically set by the network, burned (destroyed)
  - **Priority fee (tip)**: optional, goes to validators, incentivizes faster inclusion
- **Max fee**: the most you're willing to pay per gas. Unused portion is refunded.

## Gas Optimization Tips

1. **`view` and `pure` functions are free** — reading state costs zero gas
2. **Batch operations** — one transaction with multiple actions beats many separate transactions
3. **Deploy during low periods** — gas is cheapest during weekends and off-peak US hours, but at current prices this barely matters
4. **Use EIP-1559 properly** — set `maxFeePerGas` and `maxPriorityFeePerGas` instead of legacy gas price
5. **Storage is the most expensive operation** — minimize SSTORE operations in contracts
6. **Use events for data you don't need on-chain** — emitting events is much cheaper than storing data

## Guardrails

- **Always estimate gas before sending** — use `eth_estimateGas` to avoid wasting gas on failing transactions
- **Set a reasonable gas limit** — don't pass unlimited gas
- **Get human confirmation** before any transaction moving significant value
- **Watch for gas spikes** — during major events (NFT drops, market crashes) gas can spike temporarily. The etherscan gas tracker shows real-time prices.

## Note on Data Freshness

Gas prices and ETH price fluctuate. The specific numbers in this document are from February 2026. The overall picture — that Ethereum mainnet gas is extremely cheap compared to 2021-2023 — is the durable insight. Always check a live gas tracker for current prices before making cost-sensitive decisions.
