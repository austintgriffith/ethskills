---
name: frontend-ux
description: "Use when building, fixing, or reviewing how an Ethereum dApp frontend behaves for its users: product identity, address inputs that resolve names, token amounts and decimals, approve-then-act flows, fiat context, the target chain. The completeness steps agents skip unprompted. Not for the Scaffold-ETH 2 pre-ship checklist (`/qa`)."
---

# Frontend UX

Working transaction code is not a finished product. Check these product-completeness surfaces before calling an onchain frontend finished.

**Product identity.** Replace every framework default: tab title, favicon, OG/Twitter title, description and image, and visible "built with" branding. Nothing in the build fails when `Create Next App` or `Scaffold-ETH 2 App` ships to production, so nothing reminds you.

**Address inputs.** A recipient field gated on `isAddress()` silently rejects `vitalik.eth` and leaves the button dead with no explanation. Resolve names onchain, show the resolved address before submit, submit that address, and give a reason whenever input is rejected. Use your UI kit's address component if it has one.

**Fiat context.** Every token or ETH amount you show — balances, inputs, confirmations, position summaries — carries a value from a real price source. Label a stale or unavailable price rather than silently dropping it.

**Target chain.** Point the app at the chain the brief names; scaffold defaults sit on local/hardhat. Use a dedicated RPC for production rather than the accidental public fallback, and don't slow the template's polling interval.

Also required, and usually already habit — confirm rather than rebuild:

- One pending state per button, held from click through the receipt *and* the authoritative state refetch (`isPending` clears when the wallet returns the hash, not at confirmation), released in `finally` so a rejection can't lock it.
- One primary action at a time: connect → switch network → approve → execute. Approval status comes from a fresh onchain read, never a local flag.
- Token math in the token's real decimals (`parseUnits`/`formatUnits`; USDC is 6). Never render base units.
- Reverts and wallet errors translated to human text, shown near the action that failed.
- Semantic theme tokens, not a hardcoded dark wrapper. If dark-only is deliberate, remove the theme toggle.

Finish by running the project's build or typecheck, and confirming the configured target chain matches the brief.
