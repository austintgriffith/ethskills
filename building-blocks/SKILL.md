---
name: building-blocks
description: DeFi legos and protocol composability on Ethereum and L2s. Major protocols per chain — Aerodrome on Base, GMX/Pendle on Arbitrum, Velodrome on Optimism — plus mainnet primitives (Uniswap, Aave, Compound, Curve). How they work, how to build on them, and how to combine them. Use when building DeFi integrations, choosing protocols on a specific L2, designing yield strategies, or composing existing protocols into something new.
---

# Building Blocks (DeFi Legos)

## What You Probably Got Wrong

**DeFi TVL:** Ethereum DeFi TVL is **$50B+** (Feb 2026). If you're quoting numbers from 2023-2024, they're stale.

**Uniswap V4 is live.** Launched mainnet **January 31, 2025** on 10+ chains. V4 introduced a **hooks system** — custom logic attached to pools (dynamic fees, TWAMM, limit orders, custom oracles). This is the biggest composability upgrade since flash loans. PoolManager addresses are different per chain (NOT deterministic like V3).

**Costs changed everything:** A flash loan arbitrage on mainnet costs ~$0.05-0.50 in gas now (was $5-50). This opens composability patterns that were previously uneconomical.

**The dominant DEX on each L2 is NOT Uniswap.** Aerodrome and Velodrome merged into **Aero** (November 2025, Dromos Labs) — the unified DEX dominates both Base and Optimism. Camelot is a major native DEX on Arbitrum. Don't default to Uniswap on every chain.

## Key Protocol Addresses (Verified Feb 2026)

| Protocol | Contract | Mainnet Address |
|----------|----------|-----------------|
| Uniswap V2 Router | Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| Uniswap V2 Factory | Factory | `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f` |
| Uniswap V3 Factory | Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Uniswap V3 SwapRouter02 | Router | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` |
| Uniswap V4 PoolManager | PoolManager | `0x000000000004444c5dc75cB358380D2e3dE08A90` |
| Uniswap Universal Router (V4) | Router | `0x66a9893cc07d91d95644aedd05d03f95e1dba8af` |
| Aave V3 Pool | Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` |

See `addresses/SKILL.md` for complete multi-chain address list including L2-native protocols (Aerodrome, GMX, Pendle, Velodrome, Camelot, SyncSwap, Morpho).

## Uniswap V4 Hooks (New)

Hooks let you add custom logic that runs before/after swaps, liquidity changes, and donations. This is the biggest composability upgrade since flash loans.

### Hook Interface (Solidity)

```solidity
import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/types/BeforeSwapDelta.sol";

contract DynamicFeeHook is BaseHook {
    constructor(IPoolManager _manager) BaseHook(_manager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,           // ← We hook here
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    // Dynamic fee: higher fee during high-volume periods
    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        // Return dynamic fee override (e.g., 0.05% normally, 0.30% during volatility)
        uint24 fee = _isHighVolatility() ? 3000 : 500;
        return (this.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, fee | 0x800000);
    }
}
```

**Hook use cases with real code patterns:**
- **Dynamic fees** — adjust based on volatility, time-of-day, or oracle data
- **TWAMM** — split large orders over time to reduce price impact
- **Limit orders** — execute when price crosses a threshold
- **MEV protection** — auction swap ordering rights to searchers
- **Custom oracles** — TWAP updated on every swap

## Composability Patterns (Updated for 2026 Gas)

These patterns are now **economically viable** even for small amounts due to sub-dollar gas:

### Flash Loan Arbitrage
Borrow from Aave → swap on Uniswap for profit → repay Aave. All in one transaction. If unprofitable, reverts (lose only gas: ~$0.05-0.50).

### Leveraged Yield Farming
Deposit ETH on Aave → borrow stablecoin → swap for more ETH → deposit again → repeat. Gas cost per loop: ~$0.02 on mainnet, negligible on L2.

### Meta-Aggregation
Route swaps across multiple DEXs for best execution. 1inch and Paraswap check Uniswap, Curve, Sushi simultaneously.

### ERC-4626 Yield Vaults

Standard vault interface — the "ERC-20 of yield." Every vault exposes the same functions regardless of strategy.

```solidity
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleYieldVault is ERC4626 {
    constructor(IERC20 asset_) 
        ERC4626(asset_) 
        ERC20("Vault Shares", "vSHARE") 
    {}

    // totalAssets() drives the share price
    // As yield accrues, totalAssets grows → shares worth more
    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) + _getAccruedYield();
    }
}

// Usage: deposit/withdraw are standardized
// vault.deposit(1000e6, msg.sender);  // deposit 1000 USDC, get shares
// vault.redeem(shares, msg.sender, msg.sender);  // burn shares, get USDC back
// vault.convertToAssets(shares);  // how much USDC are my shares worth?
```

**Why ERC-4626 matters:** Composability. Any protocol can integrate any vault without custom adapters. Yearn V3, Aave's wrapped tokens, Morpho vaults, Pendle yield tokens — all ERC-4626.

### Flash Loan (Aave V3 — Complete Pattern)

```solidity
import {FlashLoanSimpleReceiverBase} from 
    "@aave/v3-core/contracts/flashloan-v3/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from 
    "@aave/v3-core/contracts/interfaces/IPoolAddressesProvider.sol";

contract FlashLoanArb is FlashLoanSimpleReceiverBase {
    constructor(IPoolAddressesProvider provider) 
        FlashLoanSimpleReceiverBase(provider) {}

    function executeArb(address token, uint256 amount) external {
        // Borrow `amount` of `token` — must repay + 0.05% fee in same tx
        POOL.flashLoanSimple(address(this), token, amount, "", 0);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,  // 0.05% fee
        address,
        bytes calldata
    ) external override returns (bool) {
        // --- Your arbitrage logic here ---
        // Buy cheap on DEX A, sell expensive on DEX B
        // Must end with at least `amount + premium` of `asset`
        
        uint256 owed = amount + premium;
        IERC20(asset).approve(address(POOL), owed);
        return true;  // If unprofitable, revert here — lose only gas (~$0.05-0.50)
    }
}
```

**Aave V3 Pool (mainnet):** `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2`
**Flash loan fee:** 0.05% (5 basis points). Free if you repay to an Aave debt position.

## Building on Base

**Dominant DEX: Aero** (formerly Aerodrome, ~$500-600M TVL) — NOT Uniswap. In November 2025, Dromos Labs merged Aerodrome (Base) and Velodrome (Optimism) into a unified cross-chain DEX called **Aero**. Same contracts, same ve(3,3) model, new brand.

### How Aero Works (Critical Difference from Uniswap)
- **LPs deposit tokens** into pools → earn **AERO emissions** (not trading fees!)
- **veAERO voters** lock AERO → vote on which pools get emissions → earn **100% of trading fees + bribes**
- This is the opposite of Uniswap where LPs earn fees directly
- **Flywheel:** Pools generating most fees → attract most votes → get most emissions → attract more LPs → deeper liquidity → more fees

### Aerodrome Swap (Router Interface)
```solidity
// Aerodrome Router: 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43 (Base)
struct Route {
    address from;
    address to;
    bool stable;       // true = stable pair (like Curve), false = volatile (like Uni V2)
    address factory;   // 0x420DD381b31aEf6683db6B902084cB0FFECe40Da
}

// Swap via Router
function swapExactTokensForTokens(
    uint256 amountIn,
    uint256 amountOutMin,
    Route[] calldata routes,
    address to,
    uint256 deadline
) external returns (uint256[] memory amounts);
```

### Base-Specific Patterns
- **Coinbase Smart Wallet** — ERC-4337 wallet, passkey auth, gasless txs via Coinbase paymaster
- **OnchainKit** — `npm create onchain` to bootstrap a Base app with React components
- **Farcaster Frames v2** — mini-apps embedded in social posts that trigger onchain actions
- **AgentKit** — Coinbase's framework for AI agents to interact onchain

## Building on Arbitrum (Highest DeFi Liquidity)

### GMX V2 — How GM Pools Work
- **Each market has its own isolated pool** (unlike V1's single GLP pool)
- LPs deposit into GM (liquidity) pools → receive GM tokens
- **Fully Backed markets:** ETH/USD backed by ETH + USDC. Backing tokens match the traded asset.
- **Synthetic markets:** DOGE/USD backed by ETH + USDC. Uses ADL (Auto-Deleveraging) when thresholds are reached.
- LPs earn: trading fees, liquidation fees, borrowing fees, swap fees. But bear risk from trader PnL.

### Pendle — Yield Tokenization
Pendle splits yield-bearing assets into principal and yield components:

1. **SY (Standardized Yield):** Wraps any yield-bearing asset. E.g., wstETH → SY-wstETH.
2. **PT (Principal Token):** The principal. Redeemable 1:1 at maturity. Trades at a discount (discount = implied yield).
3. **YT (Yield Token):** All yield until maturity. Value decays to 0 at maturity.
4. **Core invariant:** `SY_value = PT_value + YT_value`

**Use cases:**
- Buy PT at discount = **lock in fixed yield** (like a zero-coupon bond)
- Buy YT = **leverage your yield exposure** (bet yield goes up)
- LP in Pendle pools = earn trading fees + PENDLE incentives

### Arbitrum-Specific Tech
- **Stylus:** Write smart contracts in Rust/C++/WASM alongside EVM (10-100x gas savings for compute-heavy operations)
- **Orbit:** Launch custom L3 chains (47 live on mainnet)

See `addresses/SKILL.md` for all verified protocol addresses (GMX, Pendle, Camelot, Aerodrome, Velodrome, SyncSwap, Morpho).

## Discovery Resources

- **DeFi Llama:** https://defillama.com — TVL rankings, yield rankings, all chains
- **Dune Analytics:** https://dune.com — query onchain data
- **ethereum.org/en/dapps/** — curated list

## Guardrails for Composability

- **Every protocol you compose with is a dependency.** If Aave gets hacked, your vault depending on Aave is affected.
- **Oracle manipulation = exploits.** Verify oracle sources.
- **Impermanent loss** is real for AMM LPs. Quantify it before providing liquidity.
- **The interaction between two safe contracts can create unsafe behavior.** Audit compositions.
- **Start with small amounts.** Test with minimal value before scaling.
- **Flash loan attacks** can manipulate prices within a single transaction. Design for this.
