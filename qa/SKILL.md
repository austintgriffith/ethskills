---
name: qa
description: Pre-ship audit checklist for Ethereum dApps built with Scaffold-ETH 2. Give this to a separate reviewer agent (or fresh context) AFTER the build is complete. Covers only the bugs AI agents actually ship — validated by baseline testing against stock LLMs.
---

# dApp QA — Pre-Ship Audit

This skill is for **review, not building.** Give it to a fresh agent after the dApp is built. The reviewer should:

1. Read the source code (`app/`, `components/`, `contracts/`)
2. Open the app in a browser and click through every flow
3. Check every item below — report PASS/FAIL, don't fix

---

## 🚨 Critical: Wallet Flow — Button Not Text

Open the app with NO wallet connected.

- ❌ **FAIL:** Text saying "Connect your wallet to play" / "Please connect to continue" / any paragraph telling the user to connect
- ✅ **PASS:** A big, obvious Connect Wallet **button** is the primary UI element

**This is the most common AI agent mistake.** Every stock LLM writes a `<p>Please connect your wallet</p>` instead of rendering `<RainbowKitCustomConnectButton />`.

---

## 🚨 Critical: Four-State Button Flow

The app must show exactly ONE primary button at a time, progressing through:

```
1. Not connected  → Connect Wallet button
2. Wrong network  → Switch to [Chain] button
3. Needs approval → Approve button
4. Ready          → Action button (Stake/Deposit/Swap)
```

Check specifically:
- ❌ **FAIL:** Approve and Action buttons both visible simultaneously
- ❌ **FAIL:** No network check — app tries to work on wrong chain and fails silently
- ❌ **FAIL:** User can click Approve, sign in wallet, come back, and click Approve again while tx is pending
- ✅ **PASS:** One button at a time. Approve button shows spinner, stays disabled until block confirms onchain. Then switches to the action button.

**In the code:** the button's `disabled` prop must be tied to `isPending` from `useScaffoldWriteContract`. Verify it uses `useScaffoldWriteContract` (waits for block confirmation), NOT raw wagmi `useWriteContract` (resolves on wallet signature):

```
grep -rn "useWriteContract" packages/nextjs/
```
Any match outside scaffold-eth internals → bug.

---

## 🚨 Critical: SE2 Branding Removal

AI agents treat the scaffold as sacred and leave all default branding in place.

- [ ] **Footer:** Remove BuidlGuidl links, "Built with 🏗️ SE2", "Fork me" link, support links. Replace with project's own repo link or clean it out
- [ ] **Tab title:** Must be the app name, NOT "Scaffold-ETH 2" or "SE-2 App" or "App Name | Scaffold-ETH 2"
- [ ] **README:** Must describe THIS project. Not the SE2 template README. Remove "Built with Scaffold-ETH 2" sections and SE2 doc links
- [ ] **Favicon:** Must not be the SE2 default

---

## Important: Contract Address Display

- ❌ **FAIL:** The deployed contract address appears nowhere on the page
- ✅ **PASS:** Contract address displayed using `<Address/>` component (blockie, ENS, copy, explorer link)

Agents display the connected wallet address but forget to show the contract the user is interacting with.

---

## Important: USD Values

- ❌ **FAIL:** Token amounts shown as "1,000 TOKEN" or "0.5 ETH" with no dollar value
- ✅ **PASS:** "0.5 ETH (~$1,250)" with USD conversion

Agents never add USD values unprompted. Check every place a token or ETH amount is displayed, including inputs.

---

## Important: OG Image Must Be Absolute URL

- ❌ **FAIL:** `images: ["/thumbnail.jpg"]` — relative path, breaks unfurling everywhere
- ✅ **PASS:** `images: ["https://yourdomain.com/thumbnail.jpg"]` — absolute production URL

Quick check:
```
grep -n "og:image\|images:" packages/nextjs/app/layout.tsx
```

---

## Important: RPC & Polling Config

Open `packages/nextjs/scaffold.config.ts`:

- ❌ **FAIL:** `pollingInterval: 30000` (default — makes the UI feel broken, 30 second update lag)
- ✅ **PASS:** `pollingInterval: 3000`
- ❌ **FAIL:** Using default Alchemy API key that ships with SE2
- ❌ **FAIL:** Code references `process.env.NEXT_PUBLIC_*` but the variable isn't actually set in the deployment environment (Vercel/hosting). Falls back to public RPC like `mainnet.base.org` which is rate-limited
- ✅ **PASS:** `rpcOverrides` uses `process.env.NEXT_PUBLIC_*` variables AND the env var is confirmed set on the hosting platform

**Verify the env var is set, not just referenced.** AI agents will change the code to use `process.env`, see the pattern matches PASS, and move on — without ever setting the actual variable on Vercel/hosting. Check:
```bash
vercel env ls | grep RPC
```

---

## Important: Dark Mode — No Hardcoded Dark Backgrounds

AI agents love the aesthetic of a dark UI and will hardcode it directly on the page wrapper:

```tsx
// ❌ FAIL — hardcoded black background, ignores system preference AND DaisyUI theme
<div className="min-h-screen bg-[#0a0a0a] text-white">
```

This bypasses the entire DaisyUI theme system. Light-mode users get a black page. The `SwitchTheme` toggle in the SE2 header stops working. `prefers-color-scheme` is ignored.

**Check for this pattern:**
```bash
grep -rn 'bg-\[#0\|bg-black\|bg-gray-9\|bg-zinc-9\|bg-neutral-9\|bg-slate-9' packages/nextjs/app/
```
Any match on a root layout div or page wrapper → **FAIL**.

- ❌ **FAIL:** Root page wrapper uses a hardcoded hex color or Tailwind dark bg class (`bg-[#0a0a0a]`, `bg-black`, `bg-zinc-900`, etc.)
- ❌ **FAIL:** `SwitchTheme` toggle is present in the header but the page ignores `data-theme` entirely
- ✅ **PASS:** All backgrounds use DaisyUI semantic variables — `bg-base-100`, `bg-base-200`, `text-base-content`
- ✅ **PASS (dark-only exception):** Theme is explicitly forced via `data-theme="dark"` on `<html>` **AND** the `<SwitchTheme/>` component is removed from the header

**The fix:**
```tsx
// ✅ CORRECT — responds to light/dark toggle and prefers-color-scheme
<div className="min-h-screen bg-base-200 text-base-content">
```

---

## Important: Phantom Wallet in RainbowKit

Phantom is NOT in the SE2 default wallet list. A lot of users have Phantom — if it's missing, they can't connect.

- ❌ **FAIL:** Phantom wallet not in the RainbowKit wallet list
- ✅ **PASS:** `phantomWallet` is in `wagmiConnectors.tsx`

---

## Important: Mobile Deep Linking

**RainbowKit v2 / WalletConnect v2 does NOT auto-deep-link to the wallet app.** It relies on push notifications instead, which are slow and unreliable. You must implement deep linking yourself.

On mobile, when a user taps a button that needs a signature, it must open their wallet app. Test this: open the app on a phone, connect a wallet via WalletConnect, tap an action button — does the wallet app open with the transaction ready to sign?

- ❌ **FAIL:** Nothing happens, user has to manually switch to their wallet app
- ❌ **FAIL:** Deep link fires BEFORE the transaction — user arrives at wallet with nothing to sign
- ❌ **FAIL:** `window.location.href = "rainbow://"` called before `writeContractAsync()` — navigates away and the TX never fires
- ❌ **FAIL:** It opens the wrong wallet (e.g. opens MetaMask when user connected with Rainbow)
- ❌ **FAIL:** Deep links inside a wallet's in-app browser (unnecessary — you're already in the wallet)
- ✅ **PASS:** Every transaction button fires the TX first, then deep links to the correct wallet app after a delay

### How to implement it

**Pattern: `writeAndOpen` helper.** Fire the write call first (sends the TX request over WalletConnect), then deep link after a delay to switch the user to their wallet:

```typescript
const writeAndOpen = useCallback(
  <T,>(writeFn: () => Promise<T>): Promise<T> => {
    const promise = writeFn(); // Fire TX — does gas estimation + WC relay
    setTimeout(openWallet, 2000); // Switch to wallet AFTER request is relayed
    return promise;
  },
  [openWallet],
);

// Usage — wraps every write call:
await writeAndOpen(() => gameWrite({ functionName: "click", args: [...] }));
```

**Why 2 seconds?** `writeContractAsync` must estimate gas, encode calldata, and relay the signing request through WalletConnect's servers. 300ms is too fast — the wallet won't have received the request yet.

**Detecting the wallet:** `connector.id` from wagmi says `"walletConnect"`, NOT `"rainbow"` or `"metamask"`. You must check multiple sources:

```typescript
const openWallet = useCallback(() => {
  if (typeof window === "undefined") return;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile || window.ethereum) return; // Skip if desktop or in-app browser

  // Check connector, wagmi storage, AND WalletConnect session data
  const allIds = [connector?.id, connector?.name,
    localStorage.getItem("wagmi.recentConnectorId")]
    .filter(Boolean).join(" ").toLowerCase();

  let wcWallet = "";
  try {
    const wcKey = Object.keys(localStorage).find(k => k.startsWith("wc@2:client"));
    if (wcKey) wcWallet = (localStorage.getItem(wcKey) || "").toLowerCase();
  } catch {}
  const search = `${allIds} ${wcWallet}`;

  const schemes: [string[], string][] = [
    [["rainbow"], "rainbow://"],
    [["metamask"], "metamask://"],
    [["coinbase", "cbwallet"], "cbwallet://"],
    [["trust"], "trust://"],
    [["phantom"], "phantom://"],
  ];

  for (const [keywords, scheme] of schemes) {
    if (keywords.some(k => search.includes(k))) {
      window.location.href = scheme;
      return;
    }
  }
}, [connector]);
```

**Key rules:**
1. **Fire TX first, deep link second.** Never `window.location.href` before the write call
2. **Skip deep link if `window.ethereum` exists** — means you're already in the wallet's in-app browser
3. **Check WalletConnect session data** in localStorage — `connector.id` alone won't tell you which wallet
4. **Use simple scheme URLs** like `rainbow://` — not `rainbow://dapp/...` which reloads the page
5. **Wrap EVERY write call** — approve, action, claim, batch — not just the main one

---

## Audit Summary

Report each as PASS or FAIL:

### Ship-Blocking
- [ ] Wallet connection shows a BUTTON, not text
- [ ] Wrong network shows a Switch button
- [ ] One button at a time (Connect → Network → Approve → Action)
- [ ] Approve button disabled with spinner through block confirmation
- [ ] SE2 footer branding removed
- [ ] SE2 tab title removed
- [ ] SE2 README replaced

### Should Fix
- [ ] Contract address displayed with `<Address/>`
- [ ] USD values next to all token/ETH amounts
- [ ] OG image is absolute production URL
- [ ] pollingInterval is 3000
- [ ] RPC overrides set (not default SE2 key) AND env var confirmed set on hosting platform
- [ ] Favicon updated from SE2 default
- [ ] No hardcoded dark backgrounds — page wrapper uses `bg-base-200 text-base-content` (or `data-theme="dark"` forced + `<SwitchTheme/>` removed)
- [ ] Phantom wallet in RainbowKit wallet list
- [ ] Mobile: ALL transaction buttons deep link to wallet (fire TX first, then `setTimeout(openWallet, 2000)`)
- [ ] Mobile: wallet detection checks WC session data, not just `connector.id`
- [ ] Mobile: no deep link when `window.ethereum` exists (in-app browser)
