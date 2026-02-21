---
name: testing
description: Smart contract testing with Foundry — unit tests, fuzz testing, fork testing, invariant testing. What to test, what not to test, and what LLMs get wrong.
---

# Smart Contract Testing

## What You Probably Got Wrong

**You test getters and trivial functions.** Testing that `name()` returns the name is worthless. Test edge cases, failure modes, and economic invariants — the things that lose money when they break.

**You don't fuzz.** `forge test` finds the bugs you thought of. Fuzzing finds the ones you didn't. If your contract does math, fuzz it. If it handles user input, fuzz it. If it moves value, definitely fuzz it.

**You don't fork-test.** If your contract calls Uniswap, Aave, or any external protocol, test against their real deployed contracts on a fork. Mocking them hides integration bugs that only appear with real state.

**You write tests that mirror the implementation.** Testing that `deposit(100)` sets `balance[user] = 100` is tautological — you're testing that Solidity assignments work. Test properties: "after deposit and withdraw, user gets their tokens back." Test invariants: "total deposits always equals contract balance."

**You skip invariant testing for stateful protocols.** If your contract has multiple interacting functions that change state over time (vaults, AMMs, lending), you need invariant tests. Unit tests check one path; invariant tests check that properties hold across thousands of random sequences.

---

## Unit Testing with Foundry

### Test File Structure

```solidity
// test/MyContract.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        token = new MyToken("Test", "TST", 1_000_000e18);
        // Give alice some tokens for testing
        token.transfer(alice, 10_000e18);
    }

    function test_TransferUpdatesBalances() public {
        vm.prank(alice);
        token.transfer(bob, 1_000e18);

        assertEq(token.balanceOf(alice), 9_000e18);
        assertEq(token.balanceOf(bob), 1_000e18);
    }

    function test_TransferEmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit Transfer(alice, bob, 500e18);

        vm.prank(alice);
        token.transfer(bob, 500e18);
    }

    function test_RevertWhen_TransferExceedsBalance() public {
        vm.prank(alice);
        vm.expectRevert();
        token.transfer(bob, 999_999e18); // More than alice has
    }

    function test_RevertWhen_TransferToZeroAddress() public {
        vm.prank(alice);
        vm.expectRevert();
        token.transfer(address(0), 100e18);
    }
}
```

### Key Assertion Patterns

```solidity
// Equality
assertEq(actual, expected);
assertEq(actual, expected, "descriptive error message");

// Comparisons
assertGt(a, b);   // a > b
assertGe(a, b);   // a >= b
assertLt(a, b);   // a < b
assertLe(a, b);   // a <= b

// Approximate equality (for math with rounding)
assertApproxEqAbs(actual, expected, maxDelta);
assertApproxEqRel(actual, expected, maxPercentDelta); // in WAD (1e18 = 100%)

// Revert expectations
vm.expectRevert();                           // Any revert
vm.expectRevert("Insufficient balance");     // Specific message
vm.expectRevert(MyContract.CustomError.selector); // Custom error

// Event expectations
vm.expectEmit(true, true, false, true);      // (topic1, topic2, topic3, data)
emit MyEvent(expectedArg1, expectedArg2);
```

### What to Actually Test

```solidity
// ✅ TEST: Edge cases that lose money
function test_TransferZeroAmount() public { /* ... */ }
function test_TransferEntireBalance() public { /* ... */ }
function test_TransferToSelf() public { /* ... */ }
function test_ApproveOverwrite() public { /* ... */ }
function test_TransferFromWithExactAllowance() public { /* ... */ }

// ✅ TEST: Access control
function test_RevertWhen_NonOwnerCallsAdminFunction() public { /* ... */ }
function test_OwnerCanPause() public { /* ... */ }

// ✅ TEST: Failure modes
function test_RevertWhen_DepositZero() public { /* ... */ }
function test_RevertWhen_WithdrawMoreThanDeposited() public { /* ... */ }
function test_RevertWhen_ContractPaused() public { /* ... */ }

// ❌ DON'T TEST: OpenZeppelin internals
// function test_NameReturnsName() — they already tested this
// function test_SymbolReturnsSymbol() — waste of time
// function test_DecimalsReturns18() — it does, trust it
```

---

## Fuzz Testing

Foundry automatically fuzzes any test function with parameters. Instead of testing one value, it tests hundreds of random values.

### Basic Fuzz Test

```solidity
// Foundry calls this with random amounts
function testFuzz_DepositWithdrawRoundtrip(uint256 amount) public {
    // Bound input to valid range
    amount = bound(amount, 1, token.balanceOf(alice));

    uint256 balanceBefore = token.balanceOf(alice);

    vm.startPrank(alice);
    token.approve(address(vault), amount);
    vault.deposit(amount, alice);
    vault.withdraw(vault.balanceOf(alice), alice, alice);
    vm.stopPrank();

    // Property: user gets back what they deposited (minus any fees/rounding)
    assertGe(token.balanceOf(alice), balanceBefore - 1); // Allow 1 wei rounding
}

// ERC-4626 with _decimalsOffset() = N: rounding dust can be up to 10^N wei per user.
// For offset=3: use assertApproxEqAbs(out, in, 1000) instead of allowing only 1 wei.
```

### Bounding Inputs

```solidity
// bound() is preferred over vm.assume() — bound reshapes, assume discards
function testFuzz_Fee(uint256 amount, uint256 feeBps) public {
    amount = bound(amount, 1e6, 1e30);       // Reasonable token amounts
    feeBps = bound(feeBps, 1, 10_000);       // 0.01% to 100%

    uint256 fee = (amount * feeBps) / 10_000;
    uint256 afterFee = amount - fee;

    // Property: fee + remainder always equals original
    assertEq(fee + afterFee, amount);
}

// vm.assume() discards inputs — use sparingly
function testFuzz_Division(uint256 a, uint256 b) public {
    vm.assume(b > 0); // Skip zero (would revert)
    // ...
}
```

### Run with More Iterations

```bash
# Default: 256 runs
forge test

# More thorough: 10,000 runs
forge test --fuzz-runs 10000

# Set in foundry.toml for CI
# [fuzz]
# runs = 1000
```

---

## Fork Testing

Test your contract against real deployed protocols on a mainnet fork. This catches integration bugs that mocks can't.

### Basic Fork Test

```solidity
contract SwapTest is Test {
    // Real mainnet addresses
    address constant UNISWAP_ROUTER = 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;
    address constant WETH = 0xC02aaA39b223FE8D0A0e5d4F533d69895b411153;
    address constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    function setUp() public {
        // Fork mainnet at a specific block for reproducibility
        vm.createSelectFork("mainnet", 19_000_000);
    }

    function test_SwapETHForUSDC() public {
        address user = makeAddr("user");
        vm.deal(user, 1 ether);

        vm.startPrank(user);

        // Build swap path
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: USDC,
                fee: 3000,
                recipient: user,
                amountIn: 0.1 ether,
                amountOutMinimum: 0, // In production, NEVER set to 0
                sqrtPriceLimitX96: 0
            });

        // Execute swap
        uint256 amountOut = ISwapRouter(UNISWAP_ROUTER).exactInputSingle{value: 0.1 ether}(params);

        vm.stopPrank();

        // Verify we got USDC back
        assertGt(amountOut, 0, "Should receive USDC");
        assertGt(IERC20(USDC).balanceOf(user), 0);
    }
}
```

### When to Fork-Test

- **Always:** Any contract that calls an external protocol (Uniswap, Aave, Chainlink)
- **Always:** Any contract that handles tokens with quirks (USDT, fee-on-transfer, rebasing)
- **Always:** Any contract that reads oracle prices
- **Never:** Pure logic contracts with no external calls — use unit tests

### EIP-7702 Warning (Mainnet Fork)

On a mainnet fork, Anvil default accounts and `makeAddr()`-generated addresses may have **EIP-7702 delegation code** (`0xef01...`). This affects **all safe transfer acceptance checks**, not just ERC-721:

- **ERC-721**: `_safeMint` / `safeTransferFrom` → calls `onERC721Received` → reverts with `ERC721InvalidReceiver`
- **ERC-1155**: `_mint` / `_mintBatch` / `safeTransferFrom` → calls `onERC1155Received` → reverts with `ERC1155InvalidReceiver`

Any function that mints or transfers tokens to a 7702-enabled address will revert — this includes `createMarket`, `buyYes`, `buyNo`, `deposit`, or any function that mints tokens to `msg.sender`.

**This breaks any forge script or fork-mode test that mints tokens to derived addresses.**

```solidity
// ❌ BREAKS on mainnet fork — alice may have EIP-7702 delegation code
address alice = makeAddr("alice");
nft.mint(alice, tokenId); // _safeMint → onERC721Received → revert
// Also breaks: market.buyYes{value: 1 ether}(id, 0); // ERC-1155 _mint → revert

// ❌ ALSO BREAKS — small "cute" PKs derive known addresses that are often delegated
uint256 constant ALICE_PK = 0xA11CE;
address alice = vm.addr(ALICE_PK); // 0x3e6E...  — may have delegation code

// ✅ SAFE — high-entropy PK derives an address nobody has touched
uint256 constant ALICE_PK = uint256(keccak256("alice"));
address alice = vm.addr(ALICE_PK); // Random-looking address, no onchain code
```

**The private key needs sufficient entropy.** Small integers (`0xA11CE`, `0xB0B`, `0xC0C`) derive specific, well-known addresses that security researchers and automated wallets have delegated post-EIP-7702. Use `uint256(keccak256("label"))` to get a high-entropy PK that maps to an untouched address.

For forge scripts that broadcast, use `vm.addr(pk)` with high-entropy private keys. For tests that don't need fork state, run without `--fork-url` to avoid the issue entirely.

### Running Fork Tests

```bash
# Fork from RPC URL
forge test --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Fork at specific block (reproducible)
forge test --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY --fork-block-number 19000000

# Set in foundry.toml to avoid CLI flags
# [rpc_endpoints]
# mainnet = "${MAINNET_RPC_URL}"
```

---

## Invariant Testing

Invariant tests verify that properties hold across thousands of random function call sequences. Essential for stateful protocols.

### What Are Invariants?

Invariants are properties that must ALWAYS be true, no matter what sequence of actions users take:

- "Total supply equals sum of all balances" (ERC-20)
- "Total deposits equals total shares times share price" (vault)
- "x * y >= k after every swap" (AMM)
- "User can always withdraw what they deposited" (escrow)

### Basic Invariant Test

```solidity
contract VaultInvariantTest is Test {
    MyVault public vault;
    IERC20 public token;
    VaultHandler public handler;

    function setUp() public {
        token = new MockERC20("Test", "TST", 18);
        vault = new MyVault(token);
        handler = new VaultHandler(vault, token);

        // Tell Foundry which contract to call randomly
        targetContract(address(handler));
    }

    // This runs after every random sequence
    function invariant_TotalAssetsMatchesBalance() public view {
        assertEq(
            vault.totalAssets(),
            token.balanceOf(address(vault)),
            "Total assets must equal actual balance"
        );
    }

    function invariant_SharePriceNeverZero() public view {
        if (vault.totalSupply() > 0) {
            assertGt(vault.convertToAssets(1e18), 0, "Share price must never be zero");
        }
    }

    // Solvency: vault can always honor all redemptions
    function invariant_VaultIsSolvent() public view {
        uint256 totalShares = vault.totalSupply();
        if (totalShares > 0) {
            uint256 redeemable = vault.convertToAssets(totalShares);
            assertGe(
                vault.totalAssets(),
                redeemable,
                "Vault must always be able to honor all redemptions"
            );
        }
    }
}

// Handler: guided random actions
contract VaultHandler is Test {
    MyVault public vault;
    IERC20 public token;

    constructor(MyVault _vault, IERC20 _token) {
        vault = _vault;
        token = _token;
    }

    function deposit(uint256 amount) public {
        amount = bound(amount, 1, 1e24);
        deal(address(token), msg.sender, amount);

        vm.startPrank(msg.sender);
        token.approve(address(vault), amount);
        vault.deposit(amount, msg.sender);
        vm.stopPrank();
    }

    function withdraw(uint256 shares) public {
        uint256 maxShares = vault.balanceOf(msg.sender);
        if (maxShares == 0) return;
        shares = bound(shares, 1, maxShares);

        vm.prank(msg.sender);
        vault.redeem(shares, msg.sender, msg.sender);
    }
}
```

### Running Invariant Tests

```bash
# Default depth (15 calls per sequence, 256 sequences)
forge test

# Deeper exploration
forge test --fuzz-runs 1000

# Configure in foundry.toml
# [invariant]
# runs = 512
# depth = 50
```

---

## What NOT to Test

- **OpenZeppelin internals.** Don't test that `ERC20.transfer` works. It's been audited by dozens of firms and used by thousands of contracts. Test YOUR logic on top of it.
- **Solidity language features.** Don't test that `require` reverts or that `mapping` stores values. The compiler works.
- **Every getter.** If `name()` returns the name you passed to the constructor, that's not a test — it's a tautology.
- **Happy path only.** The happy path probably works. Test the unhappy paths: what happens with zero? Max uint? Unauthorized callers? Reentrancy?

**Focus your testing effort on:** Custom business logic, mathematical operations, integration points with external protocols, access control boundaries, and economic edge cases.

**Guard function check order matters.** When a function has multiple `require` checks that can all be violated simultaneously, the first check that fires determines the error message. Prefer semantic checks (state: `outcome != NONE`) before timing checks (`block.timestamp < deadline`) — it produces clearer UX. For example, if a market is both resolved AND past deadline, "Market already resolved" is more helpful than "Betting period closed."

**For security property tests, always assert economic outcomes.** Don't just test that a function doesn't revert — test that the attacker loses money. For example, an inflation attack test must assert `attackerFinalBalance < attackerCost`, not just that the victim received some shares.

---

## Test Hygiene

Tests are code too. Sloppy tests leak into production habits and create noise that hides real issues.

- **Remove unused imports.** `forge build` emits `unused-import` notes — fix them before finalizing. Leftover imports signal copy-paste and make tests harder to read.
- **Use `SafeERC20` in test helpers too.** Even though your MockToken's `transfer` won't fail, using `token.transfer()` instead of `token.safeTransfer()` triggers `erc20-unchecked-transfer` warnings from forge. More importantly, if you copy test patterns into production code, the unsafe habit follows. Use `SafeERC20` everywhere:
  ```solidity
  // In setUp(): fund test accounts safely
  using SafeERC20 for IERC20;

  IERC20(address(token)).safeTransfer(alice, 10_000e18);  // ✅
  // NOT: token.transfer(alice, 10_000e18);               // ❌ triggers warning
  ```
- **Ignore acronym casing notes.** Foundry's linter flags acronyms like NFT, DAO, ERC, and ABI as non-`mixedCase` (e.g., suggests `listNft` instead of `listNFT`). These are style notes, not errors — do NOT rename public contract functions based on them. Renaming breaks the ABI and any frontend code that calls the function by name.
- **Use `uint256` for all fee/basis-point constants.** Declaring `uint16 constant FEE_BPS = 200;` then using it in `uint256` arithmetic (`grossBonus * FEE_BPS / 10_000`) fails in compile-time expressions unless explicitly cast: `uint256(FEE_BPS)`. Avoid the gotcha entirely by declaring `uint256 constant FEE_BPS = 200;`.
- **Clean up before committing.** Run `forge build` one final time and resolve all warnings and notes. A clean build output means nothing is hiding. Acronym casing notes are the one exception — leave those alone.

---

## Pre-Deploy Test Checklist

- [ ] All custom logic has unit tests with edge cases
- [ ] Zero amounts, max uint, empty arrays, self-transfers tested
- [ ] Access control verified — unauthorized calls revert
- [ ] Fuzz tests on all mathematical operations (minimum 1000 runs)
- [ ] Fork tests for every external protocol integration
- [ ] Invariant tests for stateful protocols (vaults, AMMs, lending)
- [ ] Events verified with `expectEmit`
- [ ] Gas snapshots taken with `forge snapshot` to catch regressions
- [ ] Static analysis with `slither .` — no high/medium findings unaddressed
- [ ] Playwright E2E tests pass (page load, wallet connect, read display, write tx)
- [ ] All tests pass: `forge test -vvv`

---

## Frontend E2E Testing with Playwright

Foundry tests verify contracts. Playwright tests verify the frontend actually works — buttons call the right functions, amounts parse correctly, pages don't crash on load.

### SE2 Burner Wallet Auto-Connect

Scaffold-ETH 2 auto-connects a burner wallet when `targetNetworks` includes `chains.foundry`. No RainbowKit modal clicking needed. Tests just wait for the ETH balance to appear in the header:

```typescript
// Wait for wallet connection — balance appears in header
await expect(page.getByText(/ETH/)).toBeVisible({ timeout: 15_000 });
```

**Fragile balance regex warning:** The balance text format varies by SE2 version and locale — `"0 ETH"` vs `"0.00 ETH"` vs `"10000.00 ETH"`. If `/\d+\.?\d*\s*ETH/` proves flaky, fall back to just `/ETH/` (checks that the balance component rendered at all) or target the header element by role:

```typescript
// More resilient — just checks ETH text exists anywhere in the header
await expect(page.locator("header").getByText(/ETH/)).toBeVisible({ timeout: 15_000 });
```

### What to Test

- **Page loads without errors** — no hydration errors, no missing providers
- **Wallet connects** — burner wallet auto-connects, balance visible in header
- **Read data displays** — contract state renders (balances, lists, statuses)
- **Write transaction completes** — submit a form, confirm tx succeeds, verify UI updates

### Playwright Config

```typescript
// packages/nextjs/playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "yarn start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
```

### Test Template

```typescript
// packages/nextjs/e2e/app.spec.ts
import { test, expect } from "@playwright/test";

test.describe("dApp E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for burner wallet auto-connect (SE2 + chains.foundry)
    await expect(page.getByText(/ETH/)).toBeVisible({ timeout: 15_000 });
    // If your page shows contract data, also wait for it before each test:
    // await expect(page.getByText(/Total Supply|Active Markets|No Markets/i)).toBeVisible({ timeout: 15_000 });
  });

  test("page loads without errors", async ({ page }) => {
    // No error overlay
    await expect(page.locator("#__next")).toBeVisible();
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("read data displays", async ({ page }) => {
    // Replace with your contract's read data
    // Example: await expect(page.getByText("Total Supply")).toBeVisible({ timeout: 10_000 });
  });

  test("write transaction completes", async ({ page }) => {
    // Replace with your contract's write interaction
    // Example:
    // await page.getByPlaceholder("Enter amount").fill("1.0");
    // await page.getByRole("button", { name: /stake/i }).click();
    // Verify the UI updates after tx — use watch:true on read hooks so
    // polling picks up new state, and assert the changed value appears:
    // await expect(page.getByText(/success|confirmed/i)).toBeVisible({ timeout: 30_000 });
  });
});
```

### Selector Strategy

SE2 doesn't use `data-testid` attributes. Use semantic selectors:

```typescript
// ✅ Semantic — resilient to markup changes
page.getByRole("button", { name: /stake/i })
page.getByText("Total Staked")
page.getByPlaceholder("Enter amount")
page.getByRole("heading", { name: /dashboard/i })

// ❌ Fragile — breaks on CSS/class changes
page.locator(".btn-primary")
page.locator("[data-testid='stake-btn']")  // SE2 doesn't add these
```

### Timeout Guidelines

| Action | Timeout | Why |
|--------|---------|-----|
| Wallet connect (burner) | 15s | Page + hydration + auto-connect |
| Contract read display | 10s | RPC fetch + React re-render |
| Contract write tx | 30s | Submit + Anvil mine + UI update |
| Page navigation | 10s | Next.js client-side routing |

**Never use `waitForTimeout()`.** Always use assertion timeouts. This rule is non-negotiable — `waitForTimeout` creates tests that pass in warm environments and fail in cold replays:

```typescript
// ❌ Flaky — might be too slow or too fast
await page.waitForTimeout(5000);
await expect(page.getByText("Done")).toBeVisible();

// ✅ Resilient — polls until visible or timeout
await expect(page.getByText("Done")).toBeVisible({ timeout: 10_000 });
```

**Write transaction tests must assert a UI state change**, not just that the page didn't crash. After a buy/stake/mint, assert the new balance, updated price, or success indicator:

```typescript
// ❌ Weak — only checks page is still alive
await page.getByRole("button", { name: /buy/i }).click();
await page.waitForTimeout(3000); // hoping tx completed

// ✅ Strong — asserts economic outcome in the UI
await page.getByRole("button", { name: /buy/i }).click();
await expect(page.getByText(/balance: [1-9]/i)).toBeVisible({ timeout: 30_000 });
```

**Pre-seed chain state for complex write tests.** When the write function under test requires complex UI inputs (datetime pickers, multi-step forms), use `cast send` in `beforeAll` to set up the state, then test simpler write functions in E2E:

```typescript
test.beforeAll(async () => {
  // Pre-create a market via cast so E2E tests can focus on buy/sell
  const { execSync } = require("child_process");
  execSync(`cast send ${CONTRACT} "createMarket(string,address,uint256)" "Test" ${RESOLVER} ${DEADLINE} --value 1ether --rpc-url http://127.0.0.1:8545 --private-key ${DEPLOYER_PK}`);
});
```

### Native Input Gotchas

**`datetime-local` inputs:** `page.fill()` does NOT fire React's synthetic `onChange` on `<input type="datetime-local">` in headless Chromium. The input value updates in the DOM but React state stays empty. Use `page.evaluate()` to set the value and dispatch events:

```typescript
// ❌ BROKEN — React state never updates
await page.locator('input[type="datetime-local"]').fill("2026-03-01T12:00");

// ✅ WORKS — dispatches events React can see
await page.evaluate((val) => {
  const el = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, "value"
  )!.set!;
  nativeInputValueSetter.call(el, val);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}, "2026-03-01T12:00");
```

This also affects `date`, `time`, and `color` input types. Regular text inputs work fine with `page.fill()`.

### Contract Address in E2E Tests

**Never hardcode deployed contract addresses in E2E tests.** When Anvil restarts and `yarn deploy` reruns, the address changes. Import from SE2's generated file:

```typescript
import deployedContracts from "../contracts/deployedContracts";

const chainId = 31337; // foundry
const CONTRACT = deployedContracts[chainId].PredictionMarket.address;
```

If the import doesn't work in Playwright's test context (different tsconfig), use `cast` to read it:

```typescript
const { execSync } = require("child_process");
const address = execSync(`jq -r '.["31337"].PredictionMarket.address' packages/nextjs/contracts/deployedContracts.ts`).toString().trim();
```

### E2E State Isolation

`beforeAll` contract setup (e.g., `cast send createMarket`) is sensitive to accumulated Anvil state from previous test runs. If your contract accumulates state (markets, auctions, positions), subsequent runs may fail because selectors match multiple elements or setup transactions revert silently.

**Design `beforeAll` to be resilient:**
- Wrap `execSync` cast commands in try-catch and log failures explicitly — silent `cast send` failures with `{ stdio: "pipe" }` are hard to debug
- Use unique identifiers (timestamps, random strings) in created entities so tests don't collide with leftover state
- If using `{ stdio: "pipe" }` on `execSync`, check the result or catch errors:

```typescript
function castSend(cmd: string): string {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (e: any) {
    console.error("cast send failed:", e.stderr?.toString());
    throw e;
  }
}
```

### Multi-Entity Selector Strategy

In contracts that hold multiple instances (markets, auctions, NFT listings), accumulated state from previous test runs causes `getByText()` to match multiple elements. Playwright strict mode throws when more than one match exists.

**Always use `.first()` on selectors that may match multiple cards:**
```typescript
// ✅ Handles accumulated state from previous runs
await expect(page.getByText(/my market question/i).first()).toBeVisible();

// ❌ Fails if multiple markets contain similar text
await expect(page.getByText(/my market question/i)).toBeVisible();
```
