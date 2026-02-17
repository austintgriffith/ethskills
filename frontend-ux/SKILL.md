---
name: frontend-ux
description: Frontend UX rules for Ethereum dApps that prevent the most common AI agent UI bugs. Mandatory patterns for onchain buttons, token approval flows, address display, USD values, RPC configuration, and pre-publish metadata. Built around Scaffold-ETH 2 but the patterns apply to any Ethereum frontend. Use when building any dApp frontend.
---

# Frontend UX Rules

## What You Probably Got Wrong

**"The button works."** Working is not the standard. Does it disable during the transaction? Does it show a spinner? Does it stay disabled until the chain confirms? Does it show an error if the user rejects? AI agents skip all of this, every time.

**"I used wagmi hooks."** Wrong hooks. Scaffold-ETH 2 wraps wagmi with `useTransactor` which **waits for transaction confirmation** — not just wallet signing. Raw wagmi's `writeContractAsync` resolves the moment the user clicks Confirm in MetaMask, BEFORE the tx is mined. Your button re-enables while the transaction is still pending.

**"I showed the address."** As raw hex? That's not showing it. `<Address/>` gives you ENS resolution, blockie avatars, copy-to-clipboard, and block explorer links. Raw `0x1234...5678` is unacceptable.

---

## Rule 1: Every Onchain Button — Loader + Disable

> ⚠️ **THIS IS THE #1 BUG AI AGENTS SHIP.** The user clicks Approve, signs in their wallet, comes back to the app, and the Approve button is clickable again — so they click it again, send a duplicate transaction, and now two approvals are pending. **The button MUST be disabled and show a spinner from the moment they click until the transaction confirms onchain.** Not until the wallet closes. Not until the signature is sent. Until the BLOCK CONFIRMS.

ANY button that triggers a blockchain transaction MUST:
1. **Disable immediately** on click
2. **Show a spinner** ("Approving...", "Staking...", etc.)
3. **Stay disabled** until the state update confirms the action completed
4. **Show success/error feedback** when done

```typescript
// ✅ CORRECT: Separate loading state PER ACTION
const [isApproving, setIsApproving] = useState(false);
const [isStaking, setIsStaking] = useState(false);

<button
  disabled={isApproving}
  onClick={async () => {
    setIsApproving(true);
    try {
      await writeContractAsync({ functionName: "approve", args: [...] });
    } catch (e) {
      console.error(e);
      notification.error("Approval failed");
    } finally {
      setIsApproving(false);
    }
  }}
>
  {isApproving ? "Approving..." : "Approve"}
</button>
```

**❌ NEVER use a single shared `isLoading` for multiple buttons.** Each button gets its own loading state. A shared state causes the WRONG loading text to appear when UI conditionally switches between buttons.

### Scaffold Hooks Only — Never Raw Wagmi

```typescript
// ❌ WRONG: Raw wagmi — resolves after signing, not confirmation
const { writeContractAsync } = useWriteContract();
await writeContractAsync({...}); // Returns immediately after MetaMask signs!

// ✅ CORRECT: Scaffold hooks — waits for tx to be mined
const { writeContractAsync } = useScaffoldWriteContract("MyContract");
await writeContractAsync({...}); // Waits for actual onchain confirmation
```

**Why:** `useScaffoldWriteContract` uses `useTransactor` internally, which waits for block confirmation. Raw wagmi doesn't — your UI will show "success" while the transaction is still in the mempool.

---

## Rule 2: Four-State Flow — Connect → Network → Approve → Action

When a user needs to interact with the app, there are FOUR states. Show exactly ONE big, obvious button at a time:

```
1. Not connected?       → Big "Connect Wallet" button (NOT text saying "connect your wallet to play")
2. Wrong network?       → Big "Switch to Base" button
3. Not enough approved? → "Approve" button (with loader per Rule 1)
4. Enough approved?     → "Stake" / "Deposit" / action button
```

> **NEVER show a text prompt like "Connect your wallet to play" or "Please connect to continue."** Show a button. The user should always have exactly one thing to click.

```typescript
const { data: allowance } = useScaffoldReadContract({
  contractName: "Token",
  functionName: "allowance",
  args: [address, contractAddress],
});

const needsApproval = !allowance || allowance < amount;
const wrongNetwork = chain?.id !== targetChainId;
const notConnected = !address;

{notConnected ? (
  <RainbowKitCustomConnectButton />  // Big connect button — NOT text
) : wrongNetwork ? (
  <button onClick={switchNetwork} disabled={isSwitching}>
    {isSwitching ? "Switching..." : "Switch to Base"}
  </button>
) : needsApproval ? (
  <button onClick={handleApprove} disabled={isApproving}>
    {isApproving ? "Approving..." : "Approve $TOKEN"}
  </button>
) : (
  <button onClick={handleStake} disabled={isStaking}>
    {isStaking ? "Staking..." : "Stake"}
  </button>
)}
```

**Critical details:**
- Always read allowance via a hook so the UI updates automatically when the approval tx confirms
- Never rely on local state alone for allowance tracking
- Wrong network check comes FIRST — if the user clicks Approve while on the wrong network, everything breaks
- **Never show Approve and Action simultaneously** — one button at a time

---

## Rule 3: Address Display — Always `<Address/>`

**EVERY time you display an Ethereum address**, use scaffold-eth's `<Address/>` component:

```typescript
import { Address } from "~~/components/scaffold-eth";

// ✅ CORRECT
<Address address={userAddress} />

// ❌ WRONG — never render raw hex
<span>{userAddress}</span>
<p>0x1234...5678</p>
```

`<Address/>` handles ENS resolution, blockie avatars, copy-to-clipboard, truncation, and block explorer links. Raw hex is unacceptable.

### Address Input — Always `<AddressInput/>`

**EVERY time the user needs to enter an Ethereum address**, use `<AddressInput/>`:

```typescript
import { AddressInput } from "~~/components/scaffold-eth";

// ✅ CORRECT
<AddressInput value={recipient} onChange={setRecipient} placeholder="Recipient address" />

// ❌ WRONG — never use a raw text input for addresses
<input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} />
```

`<AddressInput/>` provides ENS resolution (type "vitalik.eth" → resolves to address), blockie avatar preview, validation, and paste handling.

**The pair: `<Address/>` for DISPLAY, `<AddressInput/>` for INPUT. Always.**

### Show Your Contract Address

**Every dApp should display its deployed contract address** at the bottom of the main page using `<Address/>`. Users want to verify the contract on a block explorer. This builds trust and is standard practice.

```typescript
<div className="text-center mt-8 text-sm opacity-70">
  <p>Contract:</p>
  <Address address={deployedContractAddress} />
</div>
```

---

## Rule 4: USD Values Everywhere

**EVERY token or ETH amount displayed should include its USD value.**
**EVERY token or ETH input should show a live USD preview.**

```typescript
// ✅ CORRECT — Display with USD
<span>1,000 TOKEN (~$4.20)</span>
<span>0.5 ETH (~$1,250.00)</span>

// ✅ CORRECT — Input with live USD preview
<input value={amount} onChange={...} />
<span className="text-sm text-gray-500">
  ≈ ${(parseFloat(amount || "0") * tokenPrice).toFixed(2)} USD
</span>

// ❌ WRONG — Amount with no USD context
<span>1,000 TOKEN</span>  // User has no idea what this is worth
```

**Where to get prices:**
- **ETH price:** SE2 built-in hook — `useNativeCurrencyPrice()`
- **Custom tokens:** DexScreener API (`https://api.dexscreener.com/latest/dex/tokens/TOKEN_ADDRESS`), onchain Uniswap quoter, or Chainlink oracle

**This applies to both display AND input:**
- Displaying a balance? Show USD next to it.
- User entering an amount to send/stake/swap? Show live USD preview below the input.
- Transaction confirmation? Show USD value of what they're about to do.

---

## Rule 5: No Duplicate Titles

**DO NOT put the app name as an `<h1>` at the top of the page body.** The SE2 header already displays the app name. Repeating it wastes space and looks amateur.

```typescript
// ❌ WRONG — AI agents ALWAYS do this
<Header />  {/* Already shows "🦞 My dApp" */}
<main>
  <h1>🦞 My dApp</h1>  {/* DUPLICATE! Delete this. */}
  <p>Description of the app</p>
  ...
</main>

// ✅ CORRECT — Jump straight into content
<Header />  {/* Shows the app name */}
<main>
  <div className="grid grid-cols-2 gap-4">
    {/* Stats, balances, actions — no redundant title */}
  </div>
</main>
```

---

## Rule 6: RPC Configuration

**NEVER use public RPCs** (`mainnet.base.org`, etc.) — they rate-limit and cause random failures in production.

In `scaffold.config.ts`, ALWAYS set:
```typescript
rpcOverrides: {
  [chains.base.id]: process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org",
},
pollingInterval: 3000,  // 3 seconds, not the default 30000
```

**Keep the API key in `.env.local`** — never hardcode it in config files that get committed to Git.

**Monitor RPC usage:** Sensible = 1 request every 3 seconds. If you see 15+ requests/second, you have a bug:
- Hooks re-rendering in loops
- Duplicate hook calls
- Missing dependency arrays
- `watch: true` on hooks that don't need it

---

## Rule 7: Pre-Publish Checklist

**BEFORE deploying frontend to production, EVERY item must pass:**

**Open Graph / Twitter Cards (REQUIRED):**
```typescript
// In app/layout.tsx or getMetadata.ts
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Description of the app",
  openGraph: {
    title: "Your App Name",
    description: "Description of the app",
    images: [{ url: "https://YOUR-LIVE-DOMAIN.com/thumbnail.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your App Name",
    description: "Description of the app",
    images: ["https://YOUR-LIVE-DOMAIN.com/thumbnail.png"],
  },
};
```

**⚠️ The OG image URL MUST be:**
- Absolute URL starting with `https://`
- The LIVE production domain (NOT `localhost`, NOT relative path)
- NOT an environment variable that could be unset
- Actually reachable (test by visiting the URL in a browser)

**Remove ALL Scaffold-ETH 2 default identity:**
- [ ] README rewritten — not the SE2 template README
- [ ] Footer cleaned — remove BuidlGuidl links, "Fork me" link, support links, any SE2 branding. Replace with your project's repo link
- [ ] Favicon updated — not the SE2 default
- [ ] Tab title is your app name — not "Scaffold-ETH 2"

**Full checklist:**
- [ ] OG image URL is absolute, live production domain
- [ ] OG title and description set (not default SE2 text)
- [ ] Twitter card type set (`summary_large_image`)
- [ ] All SE2 default branding removed (README, footer, favicon, tab title)
- [ ] Browser tab title is correct
- [ ] RPC overrides set (not public RPCs)
- [ ] `pollingInterval` is 3000
- [ ] All contract addresses match what's deployed
- [ ] No hardcoded testnet/localhost values in production code
- [ ] Every address display uses `<Address/>`
- [ ] Every address input uses `<AddressInput/>`
- [ ] Every onchain button has its own loader + disabled state
- [ ] Approve flow has network check → approve → action pattern
- [ ] No duplicate h1 title matching header

---

## externalContracts.ts — Before You Build

**ALL external contracts** (tokens, protocols, anything you didn't deploy) MUST be added to `packages/nextjs/contracts/externalContracts.ts` with address and ABI BEFORE building the frontend.

```typescript
// packages/nextjs/contracts/externalContracts.ts
export default {
  8453: {  // Base chain ID
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      abi: [...],  // ERC-20 ABI
    },
  },
} as const;
```

**Why BEFORE:** Scaffold hooks (`useScaffoldReadContract`, `useScaffoldWriteContract`) only work with contracts registered in `deployedContracts.ts` (auto-generated) or `externalContracts.ts` (manual). If you write frontend code referencing a contract that isn't registered, it silently fails.

**Never edit `deployedContracts.ts`** — it's auto-generated by `yarn deploy`. Put your external contracts in `externalContracts.ts`.

---

## Human-Readable Amounts

Always convert between contract units and display units:

```typescript
// Contract → Display
import { formatEther, formatUnits } from "viem";
formatEther(weiAmount);           // 18 decimals (ETH, DAI, most tokens)
formatUnits(usdcAmount, 6);       // 6 decimals (USDC, USDT)

// Display → Contract
import { parseEther, parseUnits } from "viem";
parseEther("1.5");                // → 1500000000000000000n
parseUnits("100", 6);             // → 100000000n (USDC)
```

**Never show raw wei/units to users.** `1500000000000000000` means nothing. `1.5 ETH (~$3,750)` means everything.

---

## Resources

- **SE2 Docs:** https://docs.scaffoldeth.io/
- **UI Components:** https://ui.scaffoldeth.io/
- **SpeedRun Ethereum:** https://speedrunethereum.com/
