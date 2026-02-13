---
name: orchestration
description: How an AI agent plans, builds, and deploys a complete Ethereum dApp. The three-phase build system for Scaffold-ETH 2 projects. Use when building a full application on Ethereum — from contracts to frontend to production deployment on IPFS.
---

# dApp Orchestration

## What You Probably Got Wrong

**SE2 has specific patterns you must follow.** Generic "build a dApp" advice won't work. SE2 auto-generates `deployedContracts.ts` — DON'T edit it. Use Scaffold hooks, NOT raw wagmi. External contracts go in `externalContracts.ts` BEFORE building the frontend.

**There are three phases. Never skip or combine them.** Contracts → Frontend → Production. Each has validation gates.

## The Three-Phase Build System

| Phase | Environment | What Happens |
|-------|-------------|-------------|
| **Phase 1** | Local fork | Contracts + UI on localhost. Iterate fast. |
| **Phase 2** | Live network + local UI | Deploy contracts to mainnet/L2. Test with real state. Polish UI. |
| **Phase 3** | Production | Deploy frontend to IPFS/Vercel. Final QA. |

## Phase 1: Scaffold (Local)

### 1.1 Contracts

```bash
npx create-eth@latest my-dapp
cd my-dapp && yarn install
yarn chain          # Terminal 1: local node
yarn deploy         # Terminal 2: deploy contracts
```

**Critical steps:**
1. Write contracts in `packages/foundry/contracts/` (or `packages/hardhat/contracts/`)
2. Write deploy script
3. Add ALL external contracts to `packages/nextjs/contracts/externalContracts.ts` — BEFORE Phase 1.2
4. Write tests (≥90% coverage)
5. Security audit before moving to frontend

**Validate:** `yarn deploy` succeeds. `deployedContracts.ts` auto-generated. Tests pass.

### 1.2 Frontend

```bash
yarn chain           # Terminal 1
yarn deploy --watch  # Terminal 2: auto-redeploy on changes
yarn start           # Terminal 3: Next.js at localhost:3000
```

**USE SCAFFOLD HOOKS, NOT RAW WAGMI:**

```typescript
// Read
const { data } = useScaffoldReadContract({
  contractName: "YourContract",
  functionName: "balanceOf",
  args: [address],
  watch: true,
});

// Write
const { writeContractAsync, isMining } = useScaffoldWriteContract("YourContract");
await writeContractAsync({
  functionName: "swap",
  args: [tokenIn, tokenOut, amount],
  onBlockConfirmation: (receipt) => console.log("Done!", receipt),
});

// Events
const { data: events } = useScaffoldEventHistory({
  contractName: "YourContract",
  eventName: "SwapExecuted",
  fromBlock: 0n,
  watch: true,
});
```

### The Three-Button Flow (MANDATORY)

Any token interaction shows ONE button at a time:
1. **Switch Network** (if wrong chain)
2. **Approve Token** (if allowance insufficient)
3. **Execute Action** (only after 1 & 2 satisfied)

Never show Approve and Execute simultaneously.

### UX Rules

- **Human-readable amounts:** `formatEther()` / `formatUnits()` for display, `parseEther()` / `parseUnits()` for contracts
- **Loading states everywhere:** `isLoading`, `isMining` on all async operations
- **Disable buttons during pending txs** (blockchains take 5-12s)
- **Never use infinite approvals** — approve exact amount or 3-5x
- **Helpful errors:** Parse "insufficient funds," "user rejected," "execution reverted" into plain language

**Validate:** Full user journey works with real wallet on localhost. All edge cases handled.

## Phase 2: Live Contracts + Local UI

1. Update `scaffold.config.ts`: `targetNetworks: [mainnet]` (or your L2)
2. Fund deployer: `yarn generate` → `yarn account` → send real ETH
3. Deploy: `yarn deploy --network mainnet`
4. Verify: `yarn verify --network mainnet`
5. Test with real wallet, small amounts ($1-10)
6. Polish UI — remove SE2 branding, custom styling

**Design rule:** NO LLM SLOP. No generic purple gradients. Make it unique.

**Validate:** Contracts verified on block explorer. Full journey works with real contracts.

## Phase 3: Production Deploy

### Pre-deploy Checklist
- `onlyLocalBurnerWallet: true` in scaffold.config.ts (CRITICAL — prevents burner wallet on prod)
- Update metadata (title, description, OG image 1200x630px)
- Restore any test values to production values

### Deploy

**IPFS (decentralized):**
```bash
yarn ipfs
# → https://YOUR_CID.ipfs.cf-ipfs.com
```

**Vercel (fast):**
```bash
cd packages/nextjs && vercel
```

### Production QA
- [ ] App loads on public URL
- [ ] Wallet connects, network switching works
- [ ] Read + write contract operations work
- [ ] No console errors
- [ ] Burner wallet NOT showing
- [ ] OG image works in link previews
- [ ] Mobile responsive
- [ ] Tested with MetaMask, Rainbow, WalletConnect

## Phase Transition Rules

**Phase 3 bug → go back to Phase 2** (fix with local UI + prod contracts)
**Phase 2 contract bug → go back to Phase 1** (fix locally, write regression test, redeploy)
**Never hack around bugs in production.**

## Key SE2 Directories

```
packages/
├── foundry/contracts/          # Solidity contracts
├── foundry/script/             # Deploy scripts
├── foundry/test/               # Tests
└── nextjs/
    ├── app/                    # Pages
    ├── components/             # React components
    ├── contracts/
    │   ├── deployedContracts.ts   # AUTO-GENERATED (don't edit)
    │   └── externalContracts.ts   # YOUR external contracts (edit this)
    ├── hooks/scaffold-eth/     # USE THESE hooks
    └── scaffold.config.ts      # Main config
```

## AI Agent Commerce: End-to-End Flow (ERC-8004 + x402)

This is the killer use case for Ethereum in 2026: **autonomous agents discovering, trusting, paying, and rating each other** — no humans in the loop.

### The Full Cycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. DISCOVER  Agent queries ERC-8004 IdentityRegistry       │
│               → finds agents with "weather" service tag      │
│                                                              │
│  2. TRUST     Agent checks ReputationRegistry                │
│               → filters by uptime >99%, quality >85          │
│               → picks best-rated weather agent               │
│                                                              │
│  3. CALL      Agent sends HTTP GET to weather endpoint       │
│               → receives 402 Payment Required                │
│               → PAYMENT-REQUIRED header: $0.10 USDC on Base  │
│                                                              │
│  4. PAY       Agent signs EIP-3009 transferWithAuthorization │
│               → retries request with PAYMENT-SIGNATURE       │
│               → server verifies via facilitator              │
│               → payment settled on Base (~$0.001 gas)        │
│                                                              │
│  5. RECEIVE   Server returns 200 OK + weather data           │
│               → PAYMENT-RESPONSE header with tx hash         │
│                                                              │
│  6. RATE      Agent posts feedback to ReputationRegistry     │
│               → value=95, tag="quality", endpoint="..."      │
│               → builds on-chain reputation for next caller   │
└─────────────────────────────────────────────────────────────┘
```

### Concrete Implementation (TypeScript Agent)

```typescript
import { x402Fetch } from '@x402/fetch';
import { createWallet } from '@x402/evm';
import { ethers } from 'ethers';

const wallet = createWallet(process.env.AGENT_PRIVATE_KEY);
const provider = new ethers.JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/YOUR_KEY');

const IDENTITY_REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';
const REPUTATION_REGISTRY = '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63';

// 1. Discover: find agents offering weather service
const registry = new ethers.Contract(IDENTITY_REGISTRY, registryAbi, provider);
// Query events or use The Graph subgraph for indexed agent discovery

// 2. Trust: check reputation
const reputation = new ethers.Contract(REPUTATION_REGISTRY, reputationAbi, provider);
const [count, value, decimals] = await reputation.getSummary(
  agentId, trustedClients, "quality", "30days"
);
// Only proceed if value/10^decimals > 85

// 3-5. Pay + Receive: x402Fetch handles the entire 402 flow
const response = await x402Fetch(agentEndpoint, {
  wallet,
  preferredNetwork: 'eip155:8453'
});
const weatherData = await response.json();

// 6. Rate: post feedback on-chain
const reputationWriter = new ethers.Contract(REPUTATION_REGISTRY, reputationAbi, signer);
await reputationWriter.giveFeedback(
  agentId, 95, 0, "quality", "weather", agentEndpoint, "", ethers.ZeroHash
);
```

**This is the agentic economy.** No API keys, no subscriptions, no invoicing, no trust assumptions. Just cryptographic identity, on-chain reputation, and HTTP-native payments.

### Key Projects Building This Stack
- **ERC-8004** — agent identity + reputation (EF, MetaMask, Google, Coinbase)
- **x402** — HTTP payment protocol (Coinbase)
- **A2A** — agent-to-agent communication (Google)
- **MCP** — model context protocol (Anthropic)
- **The Graph** — indexing agent registrations for fast discovery
- **EigenLayer** — crypto-economic validation of agent work

## Resources

- **SE2 Docs:** https://docs.scaffoldeth.io/
- **UI Components:** https://ui.scaffoldeth.io/
- **SpeedRunEthereum:** https://speedrunethereum.com/
- **ETH Tech Tree:** https://www.ethtechtree.com
