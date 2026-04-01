---
name: building-blocks
description: DeFi legos and protocol composability on Ethereum. Major protocols (Uniswap, Aave, Compound, MakerDAO, Yearn, Curve), how they work, how to build on them, and how to combine them into novel products. Use when building DeFi integrations, designing tokenomics, or when a user wants to compose existing protocols into something new.
---

# Building Blocks (DeFi Legos)

## What You Probably Got Wrong

**DeFi TVL:** Ethereum DeFi TVL is **$50B+** (Feb 2026). If you're quoting numbers from 2023-2024, they're stale.

**Uniswap V4:** V4 introduced a **hooks system** — custom logic attached to pools (dynamic fees, TWAMM, limit orders, custom oracles). This is a major composability upgrade.
<!-- VERIFICATION NEEDED: V4 deployment status and mainnet addresses -->

**Costs changed everything:** A flash loan arbitrage on mainnet costs ~$0.05-0.50 in gas now (was $5-50). This opens composability patterns that were previously uneconomical.

## Key Protocol Addresses (Verified Feb 2026)

| Protocol | Contract | Mainnet Address |
|----------|----------|-----------------|
| Uniswap V2 Router | Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| Uniswap V2 Factory | Factory | `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f` |
| Uniswap V3 Factory | Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Uniswap V3 SwapRouter02 | Router | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` |
| Uniswap Universal Router | Router | `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD` |
| Aave V3 Pool | Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` |

See `addresses/SKILL.md` for complete multi-chain address list.

## Uniswap V4 Hooks (New)

Hooks let you add custom logic that runs before/after swaps, liquidity changes, and donations:

- **Dynamic fees** that adjust based on volatility
- **TWAMM** (time-weighted average market maker)
- **Limit orders** built into the pool
- **Custom oracle** integration
- **MEV protection** hooks

This is the biggest composability upgrade since flash loans.

## Composability Patterns (Updated for 2026 Gas)

These patterns are now **economically viable** even for small amounts due to sub-dollar gas:

### Flash Loan Arbitrage
Borrow from Aave → swap on Uniswap for profit → repay Aave. All in one transaction. If unprofitable, reverts (lose only gas: ~$0.05-0.50).

### Leveraged Yield Farming
Deposit ETH on Aave → borrow stablecoin → swap for more ETH → deposit again → repeat. Gas cost per loop: ~$0.02 on mainnet, negligible on L2.

### Meta-Aggregation
Route swaps across multiple DEXs for best execution. 1inch and Paraswap check Uniswap, Curve, Sushi simultaneously.

### ERC-4626 Yield Vaults
Standard vault interface for yield strategies. Deposit tokens → vault farms across protocols → auto-compounds. Yearn V3, most modern vaults use ERC-4626.

## Building on Arbitrum (Highest DeFi Liquidity L2)

Key protocols on Arbitrum:
- **GMX** — perps DEX, $500M+ TVL
- **Uniswap, Curve, Balancer** — DEXs
- **Radiant, Aave** — lending
- **Pendle** — yield trading

## Discovery Resources

- **DeFi Llama:** https://defillama.com — TVL rankings, yield rankings, all chains
- **Dune Analytics:** https://dune.com — query on-chain data
- **ethereum.org/en/dapps/** — curated list

## Guardrails for Composability

- **Every protocol you compose with is a dependency.** If Aave gets hacked, your vault depending on Aave is affected.
- **Oracle manipulation = exploits.** Verify oracle sources.
- **Impermanent loss** is real for AMM LPs. Quantify it before providing liquidity.
- **The interaction between two safe contracts can create unsafe behavior.** Audit compositions.
- **Start with small amounts.** Test with minimal value before scaling.
- **Flash loan attacks** can manipulate prices within a single transaction. Design for this.
