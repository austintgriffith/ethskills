---
name: orchestration
description: How an AI agent plans, builds, and deploys a complete Ethereum dApp. The three-phase build system for Scaffold-ETH 2 projects. Use when building a full application on Ethereum — from contracts to frontend to production deployment on IPFS.
---

# dApp Orchestration

## The Three-Phase Build System

Every Scaffold-ETH 2 project follows three phases. **Never skip phases. Never combine phases.** Each phase has its own deliverable and validation step.

**Key references to read:**
- Ethereum Wingman skill: https://ethwingman.com
- Scaffold-ETH docs: https://docs.scaffoldeth.io/
- Scaffold UI components: https://ui.scaffoldeth.io/

## Phase 1.1: Scaffold (Contracts + Deploy)

### Goal
Get contracts written, compiled, and deployed to a local fork. Then audit them.

### Steps
1. `npx create-eth@latest` (or use existing project)
2. Write/modify contracts in `packages/foundry/contracts/`
3. Write deploy script in `packages/foundry/script/Deploy.s.sol`
4. Add external contracts to `packages/nextjs/contracts/externalContracts.ts`
5. Start fork: `yarn fork`
6. Deploy: `yarn deploy`
7. Audit: have a senior Solidity model audit the contracts for critical vulnerabilities
8. Fix issues and redeploy

### Validation
- `yarn deploy` succeeds with no errors
- Contract addresses printed in console
- `deployedContracts.ts` auto-generated
- Can read contract state with `cast call`
- Tests written and passing

### Common Failures
- **Forge compilation error:** Fix Solidity syntax/imports before anything else
- **Deploy script reverts:** Check constructor args, check fork RPC is running
- **Missing external contract:** Must add to `externalContracts.ts` BEFORE Phase 2

## Phase 1.2: Frontend (UI + Hooks + UX Flow)

### Goal
Build the complete UI with proper UX patterns. Test everything locally.

**CRITICAL:** Write a user journey for how the app should work, then use a wallet in the frontend to test the full journey.

### Prerequisites
- Phase 1.1 COMPLETE (contracts deployed, fork running)
- `yarn start` running

### Steps
1. Create page component in `packages/nextjs/app/`
2. Import and use Scaffold hooks (**NEVER raw wagmi**)
3. All external contracts must be in `externalContracts.ts`
4. Implement three-button flow for token interactions
5. Handle loading states, error states, BigInt formatting
6. Test every flow in browser with wallet on localhost

### The Three-Button Flow (MANDATORY for token interactions)

Any time a user interacts with tokens, the UI must show ONE button at a time:

1. **Switch Network** — if on wrong chain, show "Switch to [Network]"
2. **Approve** — if allowance insufficient, show "Approve [amount] [token]"
3. **Action** — only after network and approval are correct, show the actual action button

```typescript
// Check network → check allowance → show action
if (isWrongNetwork) return <button>Switch to {network}</button>;
if (needsApproval) return <button>Approve {amount} {token}</button>;
return <button>Execute Action</button>;
```

### UX Rules
- **One button at a time** — never show approve + action simultaneously
- **Human-readable amounts** — use `formatEther()`, not raw BigInt
- **Loading states everywhere** — every hook read, every pending tx
- **Disable buttons during pending tx** — blockchains take ~5-12 seconds per transaction, prevent double-submit
- **Helpful error messages** — translate error codes to plain language, not just "tx failed"
- **NEVER use infinite approvals** — approve only what's needed, or at most 3-5x for repeated use

## Phase 2: Localhost Frontend, Production Smart Contract

### Goal
Deploy contracts to the live blockchain. Test the full app with real contracts but still running locally.

### Steps
1. Update `scaffold.config.ts`: `targetNetworks: [chains.mainnet]` (or target chain)
2. Test full user journey with a real wallet on the live network
3. Lower test values if needed (but restore production values before Phase 3)
4. Polish the UI — this is the time to make it look good

### UI Polish Rules
- No stock Scaffold-ETH appearance — customize the theme
- Pick a design style that matches the app
- Find fonts that match, stick to one typeface
- **NO LLM slop** — no generic purple gradients, no cookie-cutter AI-generated design
- Remove or customize the BuidlGuidl footer

## Phase 3: Deploy (IPFS + Production)

### Goal
Deploy the working app to IPFS. Fully test in production.

### Steps
1. Set `onlyLocalBurnerWallet: true` in `scaffold.config.ts` (ALWAYS)
2. Build and upload: `yarn ipfs`
3. Test at the BGIPFS URL
4. Test full user journey with a real wallet in production
5. Verify every transaction on the block explorer

### Production Checklist
- [ ] `targetNetworks` set to production chain (NOT hardhat/foundry)
- [ ] `onlyLocalBurnerWallet: true`
- [ ] All contract addresses correct for production
- [ ] Custom RPC endpoints (don't use defaults)
- [ ] No hardcoded localhost references
- [ ] No hardcoded contract addresses or amounts
- [ ] Clean build: `rm -rf .next out` before `yarn ipfs`

### QA After Deploy
- [ ] App is live on a public URL
- [ ] Smart contract verified on block explorer
- [ ] No Scaffold-ETH branding leftovers (header, footer, favicon, metadata)
- [ ] App supports light AND dark themes (or theme switcher removed)
- [ ] Wallet connects and switches network correctly
- [ ] Full user journey works end-to-end
- [ ] Has Open Graph / Twitter card image for link previews

## Phase Transition Rules

### Going Backwards
If Phase 3 reveals a bug → go back to Phase 2 (don't fix in Phase 3)
If Phase 2 reveals a contract bug → go back to Phase 1 (don't hack around it in frontend)

Always fix at the right layer, then move forward again.

## Scaffold-ETH 2 Quick Reference

### Setup
```bash
npx create-eth@latest
cd my-project
yarn install
yarn fork        # Start local fork
yarn deploy      # Deploy contracts
yarn start       # Start frontend
```

### Key Directories
```
packages/
├── foundry/
│   ├── contracts/     # Solidity contracts
│   ├── script/        # Deploy scripts
│   └── test/          # Contract tests
└── nextjs/
    ├── app/           # Pages and routes
    ├── components/    # React components
    ├── contracts/     # Contract type definitions
    │   ├── deployedContracts.ts   # Auto-generated
    │   └── externalContracts.ts   # Manual: external contract ABIs
    └── hooks/         # Custom hooks (use Scaffold hooks, not raw wagmi)
```

### Scaffold Hooks (Use These, Not Raw Wagmi)
- `useScaffoldReadContract` — read contract state
- `useScaffoldWriteContract` — write to contracts
- `useScaffoldEventHistory` — read past events
- `useDeployedContractInfo` — get contract address/ABI
- `useTargetNetwork` — get current target network
- `useScaffoldContract` — get contract instance
