---
name: frontend-ux
description: Frontend UX rules for Ethereum dApps that prevent the most common AI agent UI bugs. Mandatory patterns for onchain buttons, approval flows, address UX, USD context, RPC reliability, theming, and pre-publish metadata. Use whenever you are building a frontend for an Ethereum dApp.
---

# Frontend UX Rules

## What You Probably Got Wrong

**"The button works."** A clickable button is not enough. It must disable immediately, show a clear pending state, and stay locked until onchain confirmation.

**"Addresses are just strings."** Address UX needs validation, safe formatting, copy support, explorer linking, and ENS/name handling where available.

**"Token amounts are clear."** Raw token values without USD context force users to guess risk and value. Show dollar context anywhere amounts matter.

---

## Rule 1: Every Button Interacting Onchain Needs Its Own Pending State

Any button that triggers an onchain transaction must:
1. Disable immediately on click
2. Show spinner + action text (`Approving...`, `Staking...`)
3. Stay disabled until chain state confirms completion
4. Show success/error feedback when done

```typescript
// Separate loading state per action
const [isApproving, setIsApproving] = useState(false);
const [isStaking, setIsStaking] = useState(false);

<button
  disabled={isApproving}
  onClick={async () => {
    setIsApproving(true);
    try {
      await sendApproveTx();
    } catch (e) {
      notifyError("Approval failed");
    } finally {
      setIsApproving(false);
    }
  }}
>
  {isApproving ? "Approving..." : "Approve"}
</button>
```

Never use one shared `isLoading` state for multiple buttons. It causes wrong labels, wrong disabled states, and duplicate submissions.

---

## Rule 2: Four-State Action Flow

Show one primary action at a time:

```
1. Not connected  -> Connect Wallet
2. Wrong network  -> Switch Network
3. Needs approval -> Approve
4. Ready          -> Execute action (Stake/Deposit/Swap/etc.)
```

Critical details:
- Wrong-network check must happen before approval/action checks
- Never show Approve and Execute simultaneously
- Approval status must come from fresh onchain state (not stale local state only)
- Connection state must render a clickable action, not passive text

---

## Rule 3: UX Standards for Addresses

Every displayed address should support:
- ENS/name resolution (where applicable)
- Explorer linking
- Copy-to-clipboard
- Safe truncation + visual identity (avatar/blockie optional)

Every address input should support:
- Validation
- Paste normalization
- ENS/name resolution where available

If your UI kit includes dedicated address components, use them. Do not use a raw free-text field for critical address entry.

---

## Rule 4: Show USD Context for Token Values

Every token/ETH amount shown to users should include USD context:
- Balances
- Inputs (live preview)
- Confirmation text
- Position/portfolio summaries

```typescript
<span>0.5 ETH (~$1,250.00)</span>
<span>1,000 TOKEN (~$4.20)</span>
```

Do not show only token units without value context.

---

## Rule 5: RPC Reliability and Polling

- Use a dedicated RPC provider for production (not accidental public fallback only)
- Keep polling interval in a responsive range (typically ~2-5s for interactive apps)
- Ensure fallback transports are intentional and rate-limit aware
- Watch for runaway request patterns (render loops, duplicate watchers, unbounded polling)

Healthy baseline: low, steady request volume. Spiky or sustained high QPS usually indicates frontend hook/config bugs.

---

## Rule 6: Theme Semantics, Not Hardcoded Dark Wrappers

Do not hardcode full-page dark backgrounds that ignore theme/system preference.

Use semantic theme tokens/classes so light/dark mode stays coherent across:
- Page background
- Surface layers
- Primary/secondary text
- Component states

If you intentionally ship dark-only, remove or disable theme controls that no longer apply.

---

## Rule 7: Contract Error Translation

Users should never see raw revert selectors or silent failures.

Implement:
1. Error extraction from ABI/custom errors
2. Mapping to human-readable messages
3. Wallet-level error handling (reject, gas issues)
4. Safe fallback message
5. Inline persistent error UI near the triggering action

```tsx
try {
  await sendTx();
} catch (e) {
  setTxError(parseContractError(e));
}
```

---

## Rule 8: Pre-Publish Metadata and Product Identity

Before production release:
- Open Graph image URL is absolute and reachable on live domain (`https://...`)
- OG/Twitter title + description are set correctly
- Social preview image is valid and not local/relative
- Template/default branding is removed or replaced with project identity
- Favicon and tab title reflect the app

---

## Rule 9: Human-Readable Amounts and Decimals

Always convert between contract units and display units:

```typescript
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";

formatEther(weiAmount);
formatUnits(tokenAmount, tokenDecimals);

parseEther("1.5");
parseUnits("100", 6); // USDC-style 6 decimals
```

Never show raw base units like `1500000000000000000`.
