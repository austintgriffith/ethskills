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
- ✅ **PASS:** `rpcOverrides` uses `process.env.NEXT_PUBLIC_*` variables

---

## Important: Phantom Wallet in RainbowKit

Phantom is NOT in the SE2 default wallet list. A lot of users have Phantom — if it's missing, they can't connect.

- ❌ **FAIL:** Phantom wallet not in the RainbowKit wallet list
- ✅ **PASS:** `phantomWallet` is in `wagmiConnectors.tsx`

---

## Important: Mobile Deep Linking

On mobile, when a user taps a button that needs a signature, it must open their wallet app. Test this: open the app on a phone, connect a wallet, tap an action button that triggers a transaction — does the wallet app open?

- ❌ **FAIL:** Nothing happens, user has to manually switch to their wallet app
- ❌ **FAIL:** It opens the wrong wallet (e.g. opens MetaMask when user connected with Rainbow)
- ✅ **PASS:** Tapping any transaction button deep links to the connected wallet app for signing

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
- [ ] RPC overrides set (not default SE2 key)
- [ ] Favicon updated from SE2 default
- [ ] Phantom wallet in RainbowKit wallet list
- [ ] Mobile: tapping a transaction button opens the connected wallet app
