---
name: building-blocks
description: DeFi legos and protocol composability on Ethereum. Major protocols (Uniswap, Aave, Compound, MakerDAO, Yearn, Curve), how they work, how to build on them, and how to combine them into novel products. Use when building DeFi integrations, designing tokenomics, or when a user wants to compose existing protocols into something new.
---

# Building Blocks (DeFi Legos)

## The Core Idea

Every smart contract on Ethereum can call every other smart contract. This means you can snap together existing protocols like Lego bricks to create novel products without building everything from scratch.

**Example:** A "no-loss prediction market" = prediction market protocol + yield-bearing vault. Users bet on outcomes, but their stakes earn yield while locked. Losers get their principal back (from the yield). This is a *composition* of existing building blocks.

## Major Protocols

### Uniswap — Decentralized Exchange (DEX)

**What it does:** Automated token swapping. Anyone can trade any ERC-20 token pair.

**Versions:**
- **V2:** Simple x*y=k AMM. Still widely used. Router: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` (mainnet)
- **V3:** Concentrated liquidity — LPs choose price ranges. More capital efficient.
- **V4:** Hooks system — custom logic can be attached to pools (fees, oracles, limit orders, etc.)

**Build on it:**
- Integrate swaps into your app using the Uniswap Router
- Build custom V4 hooks for novel pool behavior
- Use as a price oracle (V3 TWAP)
- Create liquidity mining programs on top of LP positions

**V4 Hooks (New):**
Hooks let you add custom logic that runs before/after swaps, liquidity changes, and donations. Examples:
- Dynamic fees that change based on volatility
- TWAMM (time-weighted average market maker)
- Limit orders built into the pool
- Custom oracle integration

<!-- VERIFICATION NEEDED: V4 deployment status and addresses -->

### Aave — Lending & Borrowing

**What it does:** Deposit assets to earn yield. Borrow against your deposits as collateral.

**Key concepts:**
- **Supply:** Deposit tokens, receive aTokens (interest-bearing)
- **Borrow:** Use deposits as collateral to borrow other tokens
- **Liquidation:** If collateral value drops below threshold, anyone can liquidate the position
- **Flash Loans:** Borrow any amount with zero collateral, as long as you repay in the same transaction

**Mainnet V3 Pool:** `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2`

**Build on it:**
- Yield strategies — deposit idle assets to earn
- Leverage loops — deposit, borrow, deposit again
- Flash loan arbitrage
- Liquidation bots
- Yield vaults that auto-compound Aave deposits

### Compound — Lending & Borrowing

**What it does:** Similar to Aave — supply assets to earn, borrow against collateral.

**V3 (Compound III / Comet):** Simplified model — each market has one borrowable asset and multiple collateral assets.

**Build on it:** Similar to Aave. Some protocols integrate both for best rates.

### MakerDAO / Sky — Stablecoin & Lending

**What it does:** Issues DAI (now transitioning to USDS/Sky), a decentralized stablecoin backed by crypto collateral.

**Key concepts:**
- **Vaults (CDPs):** Lock collateral, mint DAI/USDS against it
- **Stability fee:** Interest rate on borrowed DAI
- **DSR (DAI Savings Rate):** Earn yield by depositing DAI

**Build on it:**
- Use DAI as a stable unit of account in your app
- Build on the DSR for yield-bearing stablecoin features
- Create vault management tools

### Yearn Finance — Yield Aggregation

**What it does:** Automatically finds the best yield across DeFi protocols and moves funds accordingly.

**Key concepts:**
- **Vaults (ERC-4626):** Deposit tokens, Yearn strategies optimize yield
- **Strategies:** Automated yield farming strategies that compound returns

**Build on it:**
- Use Yearn vaults as a yield backend for your app
- Build ERC-4626-compatible vaults that plug into the Yearn ecosystem
- Compose with Yearn for "set and forget" yield on idle funds

### Curve Finance — Stablecoin & Like-Asset DEX

**What it does:** Optimized for trading assets that should be near-equal in value (stablecoins, wrapped tokens like wETH/ETH, wBTC/renBTC).

**Build on it:**
- Best execution for stablecoin swaps
- Compose with Curve pools for stablecoin-heavy applications
- CRV tokenomics and vote-locking (veCRV) for protocol incentives

## Composability Patterns

### Pattern 1: Flash Loan Arbitrage
Borrow from Aave → swap on Uniswap for profit → repay Aave. All in one transaction. If the trade isn't profitable, the entire transaction reverts (you lose nothing except gas).

### Pattern 2: Leveraged Yield Farming
Deposit ETH on Aave → borrow stablecoin → swap for more ETH → deposit again → repeat. Amplifies yield (and risk).

### Pattern 3: No-Loss Games
Users deposit tokens → tokens earn yield in Aave/Yearn → yield funds prizes → losers get principal back. PoolTogether pioneered this pattern.

### Pattern 4: Meta-Aggregation
Route swaps across multiple DEXs for best execution. 1inch and Paraswap do this — they check Uniswap, Curve, Sushi, and others to find the best price.

### Pattern 5: Yield Vaults
Deposit tokens → vault strategy farms across multiple protocols → auto-compounds → users earn optimized yield. Yearn V3 uses ERC-4626 for this.

## Building a "Vault with Best Yield on Arbitrum"

Step-by-step for an agent:

1. **Research current yields on Arbitrum:**
   - Aave V3 on Arbitrum — check supply APY for target asset
   - Compound V3 on Arbitrum — compare
   - GMX — GLP/GM tokens for leveraged yield
   - Pendle — yield trading
   - Radiant — lending on Arbitrum

2. **Choose a strategy:**
   - Single asset lending (lowest risk, moderate yield)
   - LP provision on Uniswap V3 (higher yield, impermanent loss risk)
   - Leveraged lending loop (higher yield, liquidation risk)

3. **Build the vault:**
   - Use ERC-4626 standard for the vault interface
   - Implement deposit/withdraw with the chosen strategy
   - Add auto-compounding if applicable

4. **Deploy on Arbitrum:**
   - Same Solidity, just target Arbitrum RPC
   - Verify on Arbiscan

## Discovering What's Available

- **ethereum.org/en/dapps/** — curated list of Ethereum applications
- **DeFi Llama:** https://defillama.com — TVL rankings, yield rankings, protocol comparisons across all chains
- **DeFi Pulse:** Protocol rankings and analytics
- **Dune Analytics:** https://dune.com — query on-chain data, find protocol metrics

## Guardrails

- **Smart contract risk:** Every protocol you compose with is a dependency. If Aave gets hacked, your vault that depends on Aave is affected.
- **Oracle risk:** DeFi protocols depend on price oracles. Oracle manipulation = exploits.
- **Impermanent loss:** Providing liquidity to AMMs means you may end up with less value than just holding.
- **Liquidation risk:** Leveraged positions can be liquidated. Always monitor health factors.
- **Always audit your compositions.** The interaction between two safe contracts can create unsafe behavior.
- **Start with small amounts.** Test with minimal value before scaling up.
