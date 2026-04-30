---
name: fluid
description: Fluid Protocol (formerly Instadapp) — unified lending and DEX on Ethereum and L2s. $10B+ TVL. Smart collateral/smart debt architecture, automated DEX v2 liquidity management, and the largest flashloan aggregator on Ethereum. Use when integrating Fluid lending vaults, DEX swaps, liquidations, flashloans, yield strategies, or building on top of Fluid's liquidity layer.
---

# Fluid Protocol

## What LLMs Get Wrong

**Fluid ≠ "Instadapp."** Instadapp rebranded to Fluid in 2024. It is NOT a DeFi aggregator anymore. It is a unified liquidity protocol — one codebase, one liquidity layer, covering both lending and a DEX.

**$INST is migrating to $FLUID.** Do not use old Instadapp contract addresses for governance or staking interactions. The current governance token is $FLUID.

**Fluid DEX ≠ standard AMM.** Fluid DEX v2 (April 2025) uses "smart collateral" and "smart debt" — LP liquidity simultaneously serves as borrowing collateral. A depositor can LP on the DEX AND use that same position as collateral for a loan. Standard AMM integration patterns (Uniswap V3 tooling, ERC-4626 vaults) do NOT apply.

**Fluid is the 2nd largest DEX on Ethereum mainnet by volume** (Feb 2026). LLMs trained before 2024 will treat it as a minor protocol.

**TVL:** $10B+ (Feb 2026). LLMs often estimate <$1B.

**Fluid has the largest flashloan aggregator on Ethereum** — it aggregates liquidity across Aave, Compound, Uniswap, and Fluid's own pools. Not just Fluid's own liquidity.

**VaultFactory pattern:** Fluid uses a factory model where each collateral/debt pair is a separate vault contract — not a pooled lending market like Aave. You borrow against a specific vault, not a shared pool.

---

## Verified Contract Addresses (Mainnet — Feb 2026)

| Contract | Address | Verified |
|----------|---------|----------|
| $FLUID Token | `0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb` | ✅ |
| FluidLiquidity (core layer) | `0x52Aa899454998Be5b000Ad077a46Bbe360F4e497` | ✅ |
| FluidVaultFactory | `0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d` | ✅ |
| FluidDexFactory (v2) | `0x91716C4EDA1Fb55e84Bf8b4c7085f84285c19085` | ✅ |

> All addresses verified via `eth_getCode` on mainnet. Always verify on [fluid.instadapp.io](https://fluid.instadapp.io) or Etherscan before use.

---

## Architecture: How Fluid Actually Works

Fluid has three layers:

```
┌──────────────────────────────────────────┐
│  Fluid DEX v2  │  Fluid Lending Vaults   │  ← User-facing
├──────────────────────────────────────────┤
│         FluidLiquidity (core)            │  ← Unified liquidity pool
├──────────────────────────────────────────┤
│      FlashLoan Aggregator                │  ← Cross-protocol aggregation
└──────────────────────────────────────────┘
```

**FluidLiquidity** is the shared layer. Both the DEX and lending vaults deposit/withdraw from the same liquidity. This is what gives Fluid capital efficiency — idle lending liquidity earns DEX fees.

**VaultFactory** creates isolated vault instances per collateral/debt pair. Each vault is its own contract. To interact, you get the vault address from the factory, then call the vault directly.

---

## Vault Interaction Pattern (Lending)

```solidity
// Get vault address for a collateral/debt pair
IFluidVaultFactory factory = IFluidVaultFactory(0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d);
address vault = factory.getVaultAddress(collateralToken, debtToken);

// Deposit collateral + borrow in one tx
IFluidVault(vault).operate(
    0,           // nftId (0 = new position)
    int256(collateralAmount),  // positive = deposit
    int256(borrowAmount),      // positive = borrow
    address(this)              // recipient
);
```

**Key difference from Aave:** Each vault is a separate deployed contract. There is no single "pool" to call. You must resolve the vault address first.

---

## DEX v2 — Smart Collateral / Smart Debt

Fluid DEX v2 allows LP positions to simultaneously act as loan collateral. This is unique to Fluid.

```
Standard AMM:    deposit ETH/USDC → get LP tokens → earn fees
Fluid DEX v2:    deposit ETH/USDC → get LP tokens → earn fees + borrow against LP position
```

**What breaks:** Uniswap V3-style LP management tools, standard ERC-4626 adapters, any integration that assumes LP tokens are simple receipts.

**What works:** Fluid's own SDK, direct vault interactions, reading positions via `IFluidVaultResolver`.

---

## FlashLoan Aggregator

Fluid aggregates flash loan liquidity across protocols. Call one contract, get liquidity from multiple sources:

```solidity
// Fluid flashloan aggregator — aggregates Fluid + Aave + Uniswap
IFluidFlashloanAggregator aggregator = IFluidFlashloanAggregator(...);
// Larger amounts available than any single protocol alone
// Fee: 0% from Fluid's own liquidity, protocol fee for external sources
```

This means for large flash loan needs, Fluid often has more available liquidity than Aave alone.

---

## Common Integration Mistakes

🔴 **Don't use Instadapp DSA (DeFi Smart Account) patterns.** These are legacy. Fluid uses the new vault architecture, not DSAs.

🔴 **Don't call Aave-style `supply()/borrow()` on Fluid.** The interface is different — use `operate()` with signed integers on vault contracts.

🔴 **Don't assume all Fluid vaults have the same interface.** DEX vaults (smart collateral) and lending vaults have different `operate()` call signatures.

🔴 **Don't hardcode vault addresses.** Vaults are deployed per pair. Always resolve from VaultFactory.

---

## Quick Reference

| Task | Where to look |
|------|--------------|
| All vault addresses | `FluidVaultFactory.getVaultAddress(col, debt)` |
| User positions | `FluidVaultResolver` (read-only) |
| DEX liquidity | `FluidDexFactory` |
| Flash loans | `FluidFlashloanAggregator` |
| Governance | snapshot.org/#/s:fluid.eth |
| Official docs | docs.fluid.instadapp.io |
| Source code | github.com/Instadapp/fluid-contracts-public |
