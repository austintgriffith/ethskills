---
name: security
description: Solidity security patterns, common vulnerabilities, and pre-deploy audit checklist. The specific code patterns that prevent real losses — not just warnings, but defensive implementations. Use before deploying any contract, when reviewing code, or when building anything that holds or moves value.
---

# Smart Contract Security

## What You Probably Got Wrong

**"Solidity 0.8+ prevents overflows, so I'm safe."** Overflow is one of dozens of attack vectors. The big ones today: reentrancy, oracle manipulation, approval exploits, and decimal mishandling.

**"I tested it and it works."** Working correctly is not the same as being secure. Most exploits call functions in orders or with values the developer never considered.

**"It's a small contract, it doesn't need an audit."** The DAO hack was a simple reentrancy bug. The Euler exploit was a single missing check. Size doesn't correlate with safety.

## Critical Vulnerabilities (With Defensive Code)

### 1. Token Decimals Vary

**USDC has 6 decimals, not 18.** This is the #1 source of "where did my money go?" bugs.

```solidity
// ❌ WRONG — assumes 18 decimals. Transfers 1 TRILLION USDC.
uint256 oneToken = 1e18;

// ✅ CORRECT — check decimals
uint256 oneToken = 10 ** IERC20Metadata(token).decimals();
```

Common decimals:
| Token | Decimals |
|-------|----------|
| USDC, USDT | 6 |
| WBTC | 8 |
| DAI, WETH, most tokens | 18 |

**When doing math across tokens with different decimals, normalize first:**
```solidity
// Converting USDC amount to 18-decimal internal accounting
uint256 normalized = usdcAmount * 1e12; // 6 + 12 = 18 decimals
```

### 2. No Floating Point in Solidity

Solidity has no `float` or `double`. Division truncates to zero.

```solidity
// ❌ WRONG — this equals 0
uint256 fivePercent = 5 / 100;

// ✅ CORRECT — basis points (1 bp = 0.01%)
uint256 FEE_BPS = 500; // 5% = 500 basis points
uint256 fee = (amount * FEE_BPS) / 10_000;
```

**Always multiply before dividing.** Division first = precision loss.

```solidity
// ❌ WRONG — loses precision
uint256 result = a / b * c;

// ✅ CORRECT — multiply first
uint256 result = (a * c) / b;
```

For complex math, use fixed-point libraries like `PRBMath` or `ABDKMath64x64`.

### 3. Reentrancy

An external call can call back into your contract before the first call finishes. If you update state AFTER the external call, the attacker re-enters with stale state.

```solidity
// ❌ VULNERABLE — state updated after external call
function withdraw() external {
    uint256 bal = balances[msg.sender];
    (bool success,) = msg.sender.call{value: bal}(""); // ← attacker re-enters here
    require(success);
    balances[msg.sender] = 0; // Too late — attacker already withdrew again
}

// ✅ SAFE — Checks-Effects-Interactions pattern + reentrancy guard
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

function withdraw() external nonReentrant {
    uint256 bal = balances[msg.sender];
    require(bal > 0, "Nothing to withdraw");
    
    balances[msg.sender] = 0;  // Effect BEFORE interaction
    
    (bool success,) = msg.sender.call{value: bal}("");
    require(success, "Transfer failed");
}
```

**The pattern: Checks → Effects → Interactions (CEI)**
1. **Checks** — validate inputs and conditions
2. **Effects** — update all state
3. **Interactions** — external calls last

Always use OpenZeppelin's `ReentrancyGuard` as a safety net on top of CEI.

### 4. SafeERC20

Some tokens (notably USDT) don't return `bool` on `transfer()` and `approve()`. Standard calls will revert even on success.

```solidity
// ❌ WRONG — breaks with USDT and other non-standard tokens
token.transfer(to, amount);
token.approve(spender, amount);

// ✅ CORRECT — handles all token implementations
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
using SafeERC20 for IERC20;

token.safeTransfer(to, amount);
token.safeApprove(spender, amount);
```

**Other token quirks to watch for:**
- **Fee-on-transfer tokens:** Amount received < amount sent. Always check balance before and after.
- **Rebasing tokens (stETH):** Balance changes without transfers. Use wrapped versions (wstETH).
- **Pausable tokens (USDC):** Transfers can revert if the token is paused.
- **Blocklist tokens (USDC, USDT):** Specific addresses can be blocked from transacting.

### 5. Never Use DEX Spot Prices as Oracles

A flash loan can manipulate any pool's spot price within a single transaction. This has caused hundreds of millions in losses.

```solidity
// ❌ DANGEROUS — manipulable in one transaction
function getPrice() internal view returns (uint256) {
    (uint112 reserve0, uint112 reserve1,) = uniswapPair.getReserves();
    return (reserve1 * 1e18) / reserve0; // Spot price — easily manipulated
}

// ✅ SAFE — Chainlink with staleness + sanity checks
function getPrice() internal view returns (uint256) {
    (, int256 price,, uint256 updatedAt,) = priceFeed.latestRoundData();
    require(block.timestamp - updatedAt < 3600, "Stale price");
    require(price > 0, "Invalid price");
    return uint256(price);
}
```

**If you must use onchain price data:**
- Use **TWAP** (Time-Weighted Average Price) over 30+ minutes — resistant to single-block manipulation
- Uniswap V3 has built-in TWAP oracles via `observe()`
- Still less safe than Chainlink for high-value decisions

### 6. Vault Inflation Attack

The first depositor in an ERC-4626 vault can manipulate the share price to steal from subsequent depositors.

**The attack:**
1. Attacker deposits 1 wei → gets 1 share
2. Attacker donates 1000 tokens directly to the vault (not via deposit)
3. Now 1 share = 1001 tokens
4. Victim deposits 1999 tokens → gets `1999 * 1 / 2000 = 0 shares` (rounds down)
5. Attacker redeems 1 share → gets all 3000 tokens

**The fix — use OpenZeppelin v5's built-in virtual offset:**
```solidity
// Override _decimalsOffset() to increase the virtual offset (default is 0).
// An offset of 3 means 1000 virtual shares per virtual asset — makes the attack
// cost the attacker ~1000x what they'd steal.
function _decimalsOffset() internal view virtual override returns (uint8) {
    return 3;
}
```

The virtual offset makes the attack uneconomical — the attacker would need to donate enormous amounts to manipulate the ratio. OpenZeppelin's ERC4626 includes this mechanism since v5; you just need to override `_decimalsOffset()` to strengthen it beyond the default.

**OpenZeppelin v5 ERC4626 notes:**
- OZ v5 includes virtual offset mitigation by default (offset 0). Override `_decimalsOffset()` returning 3 for stronger protection.
- `deposit(0)` is a valid no-op in OZ v5 — it mints 0 shares and does NOT revert. Don't write `test_RevertWhen_DepositZero` for a v5 vault; test `test_DepositZero_MintsNoShares` instead.
- A decimal offset of N means up to `10^N` wei of rounding dust per user on full withdrawal. For offset=3, expect up to 1000 wei dust — account for this in fuzz test tolerances.

### Simulated Yield Pattern

The most common ERC-4626 test pattern — inject yield into the vault without minting new shares:

```solidity
/// @notice Owner injects yield into the vault (simulates real yield for testing)
function addYield(uint256 amount) external onlyOwner {
    IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
    emit YieldAdded(amount);
}
```

The owner approves the vault, then calls `addYield`. This increases `totalAssets()` which raises the share price for all existing holders. Use this for testing yield distribution, share price appreciation, and proportional withdrawal.

### Testing the Inflation Attack
Don't just log the attacker's outcome — assert it. The test must prove the attack is unprofitable:
```solidity
function test_InflationAttackIsUnprofitable() public {
    uint256 attackCost = 1_000 ether;

    // Attacker: deposit 1 wei, donate attackCost directly to vault
    vm.startPrank(attacker);
    token.approve(address(vault), 1);
    vault.deposit(1, attacker);
    token.transfer(address(vault), attackCost); // direct donation
    vm.stopPrank();

    // Victim deposits
    vm.startPrank(victim);
    token.approve(address(vault), attackCost);
    vault.deposit(attackCost, victim);
    vm.stopPrank();

    // Attacker redeems everything
    vm.startPrank(attacker);
    uint256 attackerShares = vault.balanceOf(attacker);
    uint256 attackerAssets = vault.redeem(attackerShares, attacker, attacker);
    vm.stopPrank();

    // KEY ASSERTION: attacker must lose money
    assertLt(attackerAssets, attackCost, "Attacker must not profit from inflation attack");
}
```

### 7. Prediction Market Patterns

Prediction markets have unique security patterns that differ from token/vault contracts:

**Resolver trust:** The resolver is typically a trusted EOA or multisig — not a separate oracle contract for MVP. If the resolver disappears, user funds are locked forever. Always include a `cancel` escape hatch that the resolver (or a timelock fallback) can trigger:
```solidity
// Allow resolver to cancel and refund all bettors
function cancel(uint256 marketId) external {
    require(msg.sender == markets[marketId].resolver, "Only resolver");
    markets[marketId].outcome = Outcome.CANCELLED;
    // Users call claimRefund() to get their ETH back
}
```

**One-sided market:** If nobody bet on the winning side (`winningPool == 0`), there are no claimants — the losing pool is stuck. If nobody bet on the losing side (`losingPool == 0`), winners just get their stake back with no bonus. Guard against division-by-zero:
```solidity
uint256 bonus = losingPool > 0
    ? (userBet * losingPool) / winningPool
    : 0;
uint256 payout = userBet + bonus;
```

**Fee accumulation:** Accumulate fees per claim rather than per resolution. Users claim at different times, so the creator sweeps incrementally. Track `creatorFeeAccumulated` and let the creator call `claimCreatorFee()` at any time.

**Pure-ETH contracts don't need `SafeERC20`.** Agents trained on ERC-20 patterns may import SafeERC20 even when the contract only handles ETH. If all value transfer is via `msg.value` and `call{value:}`, skip the SafeERC20 import entirely.

### 8. EIP-7702 and Safe Transfers

EIP-7702 went live on Ethereum mainnet in May 2025. Any EOA with a 7702 delegation has bytecode (`0xef01...`), which means OpenZeppelin's `_safeMint` and `safeTransferFrom` treat it as a contract and call `onERC721Received`. If the delegation target doesn't implement `IERC721Receiver`, the transfer reverts with `ERC721InvalidReceiver`.

**Impact:** This affects any contract that uses `_safeMint` or `safeTransferFrom` — NFT collections, marketplaces, airdrops, and any system that mints or transfers NFTs to user addresses. On a mainnet fork, many common addresses (Anvil defaults, `makeAddr()` derivations) already have delegation code.

**In production code:** No fix needed — users with 7702 delegations are responsible for ensuring their delegate handles ERC-721 callbacks. But be aware: your contract may "silently" reject transfers to 7702-enabled addresses if their delegate doesn't implement `onERC721Received`.

**In tests on mainnet fork:** Use explicitly constructed private keys to get fresh addresses without delegation code. See `testing/SKILL.md` Fork Testing section for the workaround.

### 9. Infinite Approvals

**Never use `type(uint256).max` as approval amount.**

```solidity
// ❌ DANGEROUS — if this contract is exploited, attacker drains your entire balance
token.approve(someContract, type(uint256).max);

// ✅ SAFE — approve only what's needed
token.approve(someContract, exactAmountNeeded);

// ✅ ACCEPTABLE — approve a small multiple for repeated interactions
token.approve(someContract, amountPerTx * 5); // 5 transactions worth
```

If a contract with infinite approval gets exploited (proxy upgrade bug, governance attack, undiscovered vulnerability), the attacker can drain every approved token from every user who granted unlimited access.

### 10. Access Control

Every state-changing function needs explicit access control. "Who should be able to call this?" is the first question.

```solidity
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// ❌ WRONG — anyone can drain the contract
function emergencyWithdraw() external {
    token.transfer(msg.sender, token.balanceOf(address(this)));
}

// ✅ CORRECT — only owner
function emergencyWithdraw() external onlyOwner {
    token.transfer(owner(), token.balanceOf(address(this)));
}
```

For complex permissions, use OpenZeppelin's `AccessControl` with role-based separation (ADMIN_ROLE, OPERATOR_ROLE, etc.).

### 11. Input Validation

Never trust inputs. Validate everything.

```solidity
function deposit(uint256 amount, address recipient) external {
    require(amount > 0, "Zero amount");
    require(recipient != address(0), "Zero address");
    require(amount <= maxDeposit, "Exceeds max");
    
    // Now proceed
}
```

Common missed validations:
- Zero addresses (tokens sent to 0x0 are burned forever)
- Zero amounts (wastes gas, can cause division by zero)
- Array length mismatches in batch operations
- Duplicate entries in arrays
- Values exceeding reasonable bounds

## Pre-Deploy Security Checklist

Run through this for EVERY contract before deploying to production. No exceptions.

- [ ] **Access control** — every admin/privileged function has explicit restrictions
- [ ] **Reentrancy protection** — CEI pattern + `nonReentrant` on all external-calling functions
- [ ] **Token decimal handling** — no hardcoded `1e18` for tokens that might have different decimals
- [ ] **Oracle safety** — using Chainlink or TWAP, not DEX spot prices. Staleness checks present
- [ ] **Integer math** — multiply before divide. No precision loss in critical calculations
- [ ] **Return values checked** — using SafeERC20 for all token operations
- [ ] **Input validation** — zero address, zero amount, bounds checks on all public functions
- [ ] **Events emitted** — every state change emits an event for offchain tracking
- [ ] **Incentive design** — for every external function, answer: "Who profits from calling this, and could they profit in unintended ways?" Maintenance functions callable by anyone with sufficient incentive
- [ ] **No infinite approvals** — approve exact amounts or small bounded multiples
- [ ] **Fee-on-transfer safe** — if accepting arbitrary tokens, measure actual received amount
- [ ] **Tested edge cases** — zero values, max values, unauthorized callers, reentrancy attempts

## MEV & Sandwich Attacks

**MEV (Maximal Extractable Value):** Validators and searchers can reorder, insert, or censor transactions within a block. They profit by frontrunning your transaction, backrunning it, or both.

### Sandwich Attacks

The most common MEV attack on DeFi users:

```
1. You submit: swap 10 ETH → USDC on Uniswap (slippage 1%)
2. Attacker sees your tx in the mempool
3. Attacker frontruns: buys USDC before you → price rises
4. Your swap executes at a worse price (but within your 1% slippage)
5. Attacker backruns: sells USDC after you → profits from the price difference
6. You got fewer USDC than the true market price
```

### Protection

```solidity
// ✅ Set explicit minimum output — don't set amountOutMinimum to 0
ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
    .ExactInputSingleParams({
        tokenIn: WETH,
        tokenOut: USDC,
        fee: 3000,
        recipient: msg.sender,
        amountIn: 1 ether,
        amountOutMinimum: 1900e6, // ← Minimum acceptable USDC (protects against sandwich)
        sqrtPriceLimitX96: 0
    });
```

**For users/frontends:**
- Use **Flashbots Protect RPC** (`https://rpc.flashbots.net`) — sends transactions to a private mempool, invisible to sandwich bots
- Set tight slippage limits (0.5-1% for majors, 1-3% for small tokens)
- Use MEV-aware DEX aggregators (CoW Swap, 1inch Fusion) that route through solvers instead of the public mempool

**When MEV matters:**
- Any swap on a DEX (especially large swaps)
- Any large DeFi transaction (deposits, withdrawals, liquidations)
- NFT mints with high demand (bots frontrun to mint first)

**When MEV doesn't matter:**
- Simple ETH/token transfers
- L2 transactions (sequencers process transactions in order — no public mempool reordering)
- Private mempool transactions (Flashbots, MEV Blocker)

---

## Proxy Patterns & Upgradeability

Smart contracts are immutable by default. Proxies let you upgrade the logic while keeping the same address and state.

### When to Use Proxies

- **Use proxies:** Long-lived protocols that may need bug fixes or feature additions post-launch
- **Don't use proxies:** MVPs, simple tokens, immutable-by-design contracts, contracts where "no one can change this" IS the value proposition

**Proxies add complexity, attack surface, and trust assumptions.** Users must trust that the admin won't upgrade to a malicious implementation. Don't use proxies just because you can.

### UUPS vs Transparent Proxy

| | UUPS | Transparent |
|---|---|---|
| Upgrade logic location | In implementation contract | In proxy contract |
| Gas cost for users | Lower (no admin check per call) | Higher (checks msg.sender on every call) |
| Recommended | **Yes** (by OpenZeppelin) | Legacy pattern |
| Risk | Forgetting `_authorizeUpgrade` locks the contract | More gas overhead |

**Use UUPS.** It's cheaper, simpler, and what OpenZeppelin recommends.

### UUPS Implementation

```solidity
// Implementation contract (the logic)
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyContractV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // Prevent implementation from being initialized
    }

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
        __UUPSUpgradeable_init();
        value = 42;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
```

### Critical Rules

1. **Use `initializer` instead of `constructor`** — proxies don't run constructors
2. **Never change storage layout** — only append new variables at the end, never delete or reorder
3. **Use OpenZeppelin's upgradeable contracts** — `@openzeppelin/contracts-upgradeable`, not `@openzeppelin/contracts`
4. **Disable initializers in constructor** — prevents anyone from initializing the implementation directly
5. **Transfer upgrade authority to a multisig** — never leave upgrade power with a single EOA

```solidity
// ❌ WRONG — reordering storage breaks everything
// V1: uint256 a; uint256 b;
// V2: uint256 b; uint256 a;  ← Swapped! 'a' now reads 'b's value

// ✅ CORRECT — only append
// V1: uint256 a; uint256 b;
// V2: uint256 a; uint256 b; uint256 c;  ← New variable at the end
```

---

## EIP-712 Signatures & Delegatecall

### EIP-712: Typed Structured Data Signing

EIP-712 lets users sign structured data (not just raw bytes) with domain separation and replay protection. Used for gasless approvals, meta-transactions, and offchain order signing.

**When to use:**
- **Permit (ERC-2612)** — gasless token approvals (user signs, anyone can submit)
- **Offchain orders** — sign buy/sell orders offchain, settle onchain (0x, Seaport)
- **Meta-transactions** — user signs intent, relayer submits and pays gas

```solidity
// EIP-712 domain separator — prevents replay across contracts and chains
bytes32 public constant DOMAIN_TYPEHASH = keccak256(
    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
);

bytes32 public constant PERMIT_TYPEHASH = keccak256(
    "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
);

function permit(
    address owner, address spender, uint256 value,
    uint256 deadline, uint8 v, bytes32 r, bytes32 s
) external {
    require(block.timestamp <= deadline, "Permit expired");

    bytes32 structHash = keccak256(abi.encode(
        PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline
    ));
    bytes32 digest = keccak256(abi.encodePacked(
        "\x19\x01", DOMAIN_SEPARATOR(), structHash
    ));

    address recovered = ecrecover(digest, v, r, s);
    require(recovered == owner, "Invalid signature");

    _approve(owner, spender, value);
}
```

**Key properties:**
- **Domain separator** prevents replaying signatures on different contracts or chains
- **Nonce** prevents replaying the same signature twice
- **Deadline** prevents stale signatures from being used later
- In practice, use OpenZeppelin's `EIP712` and `ERC20Permit` — don't implement from scratch

### Delegatecall

`delegatecall` executes another contract's code in the caller's storage context. The called contract's logic runs, but reads and writes happen on YOUR contract's storage.

**This is extremely dangerous if the target is untrusted.**

```solidity
// ❌ CRITICAL VULNERABILITY — delegatecall to user-supplied address
function execute(address target, bytes calldata data) external {
    target.delegatecall(data); // Attacker can overwrite ANY storage slot
}

// ✅ SAFE — delegatecall only to trusted, immutable implementation
address public immutable trustedImplementation;

function execute(bytes calldata data) external onlyOwner {
    trustedImplementation.delegatecall(data);
}
```

**Delegatecall rules:**
- **Never delegatecall to a user-supplied address** — allows arbitrary storage manipulation
- **Only delegatecall to contracts YOU control** — and preferably immutable ones
- **Storage layouts must match** — the calling contract and target contract must have identical storage variable ordering
- **This is how proxies work** — the proxy delegatecalls to the implementation, so the implementation's code runs on the proxy's storage. That's why storage layout matters so much for upgradeable contracts.

---

## Automated Security Tools

Run these before deployment:

```bash
# Static analysis
slither .                     # Detects common vulnerabilities
mythril analyze Contract.sol  # Symbolic execution

# Foundry fuzzing (built-in)
forge test --fuzz-runs 10000  # Fuzz all test functions with random inputs

# Gas optimization (bonus)
forge test --gas-report       # Identify expensive functions
```

**Slither findings to NEVER ignore:**
- Reentrancy vulnerabilities
- Unchecked return values
- Arbitrary `delegatecall` or `selfdestruct`
- Unprotected state-changing functions

## Further Reading

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts) — audited, battle-tested implementations
- [SWC Registry](https://swcregistry.io) — comprehensive vulnerability catalog
- [Rekt News](https://rekt.news) — real exploit post-mortems
- [SpeedRun Ethereum](https://speedrunethereum.com) — hands-on challenges for learning Solidity security patterns
