---
name: ship
description: End-to-end guide for AI agents — from a dApp idea to deployed production app. Fetch this FIRST, it routes you through all other skills.
---

# Ship a dApp

## What You Probably Got Wrong

**You jump to code without a plan.** Before writing a single line of Solidity, you need to know: what goes onchain, what stays offchain, which chain, how many contracts, and who calls every function. Skip this and you'll rewrite everything.

**You over-engineer.** Most dApps need 0-2 contracts. A token launch is 1 contract. An NFT collection is 1 contract. A marketplace that uses existing DEX liquidity needs 0 contracts. Three contracts is the upper bound for an MVP. If you're writing more, you're building too much.

**You put too much onchain.** Solidity is for ownership, transfers, and commitments. It's not a database. It's not an API. It's not a backend. If it doesn't involve trustless value transfer or a permanent commitment, it doesn't belong in a smart contract.

**You skip chain selection.** The 2026 answer is almost always an L2. Base for consumer apps. Arbitrum for DeFi. Optimism for public goods. Mainnet only if you need maximum security or composability with mainnet-only protocols. Fetch `l2s/SKILL.md` for the full decision matrix.

**You forget nothing is automatic.** Smart contracts don't run themselves. Every state transition needs a caller who pays gas and a reason to do it. If you can't answer "who calls this and why?" for every function, your contract has dead code. Fetch `concepts/SKILL.md` for the full mental model.

---

## Phase 0 — Plan the Architecture

Do this BEFORE writing any code. Every hour spent here saves ten hours of rewrites.

### Clarify Before You Build

Users give you a vague idea, not a spec. Before planning architecture, ask about anything that would change your design:

- **Scope** — How many features for the MVP? What's out of scope?
- **Users & roles** — Who interacts with this? Just end users, or also admins/operators/liquidators?
- **Key business rules** — Fee structure? Thresholds? Limits? Token choice?
- **Trust assumptions** — What should be owner-controlled vs permissionless? Upgradeable or immutable?
- **Integrations** — Does it need to work with existing protocols (Uniswap, Chainlink, Aave)?

Don't ask about implementation details (which ERC standard, which library, how to structure tests) — that's what the skills are for. Ask about **what the user wants**, not **how to build it**.

### The Onchain Litmus Test

Put it onchain if it involves:
- **Trustless ownership** — who owns this token/NFT/position?
- **Trustless exchange** — swapping, trading, lending, borrowing
- **Composability** — other contracts need to call it
- **Censorship resistance** — must work even if your team disappears
- **Permanent commitments** — votes, attestations, proofs

Keep it offchain if it involves:
- User profiles, preferences, settings
- Search, filtering, sorting
- Images, videos, metadata (store on IPFS, reference onchain)
- Business logic that changes frequently
- Anything that doesn't involve value transfer or trust

**Judgment calls:**
- Reputation scores → offchain compute, onchain commitments (hashes or attestations)
- Activity feeds → offchain indexing of onchain events (fetch `indexing/SKILL.md`)
- Price data → offchain oracles writing onchain (Chainlink)
- Game state → depends on stakes. Poker with real money? Onchain. Leaderboard? Offchain.

### MVP Contract Count

| What you're building | Contracts | Pattern |
|---------------------|-----------|---------|
| Token launch | 1 | ERC-20 with custom logic |
| NFT collection | 1 | ERC-721 with mint/metadata |
| NFT marketplace | 2 | ERC-721 + marketplace (approve-based listing) |
| Token marketplace | 0-1 | Use existing DEX; maybe a listing contract |
| Vault / yield | 1 | ERC-4626 vault |
| Lending protocol | 1-2 | Pool + oracle integration |
| DAO / governance | 1-3 | Governor + token + timelock |
| AI agent service | 0-1 | Maybe an ERC-8004 registration |
| Prediction market | 1-2 | Pool-based MVP (1 contract); add ERC-1155 position tokens for trading (2). Fetch `prediction-market/SKILL.md` |

**If you need more than 3 contracts for an MVP, you're over-building.** Ship the simplest version that works, then iterate.

### State Transition Audit

For EVERY function in your contract, fill in this worksheet:

```
Function: ____________
Who calls it? ____________
Why would they? ____________
What if nobody calls it? ____________
Does it need gas incentives? ____________
```

If "what if nobody calls it?" breaks your system, you have a design problem. Fix it before writing code. See `concepts/SKILL.md` for incentive design patterns.

### Chain Selection (Quick Version)

| Priority | Chain | Why |
|----------|-------|-----|
| Consumer app, low fees | **Base** | Cheapest L2, Coinbase distribution, strong ecosystem |
| DeFi, complex protocols | **Arbitrum** | Deepest DeFi liquidity on any L2, mature tooling |
| Public goods, governance | **Optimism** | Retroactive public goods funding, OP Stack ecosystem |
| Maximum security | **Ethereum mainnet** | Only if you need mainnet composability or $100M+ TVL |
| Privacy features | **zkSync / Scroll** | ZK rollups with potential privacy extensions |

Fetch `l2s/SKILL.md` for the complete comparison with gas costs, bridging, and deployment differences.

---

## dApp Archetype Templates

Find your archetype below. Each tells you exactly how many contracts you need, what they do, common mistakes, and which skills to fetch.

### 1. Token Launch (1-2 contracts)

**Architecture:** One ERC-20 contract. Add a vesting contract if you have team/investor allocations.

**Contracts:**
- `MyToken.sol` — ERC-20 with initial supply, maybe mint/burn
- `TokenVesting.sol` (optional) — time-locked releases for team tokens

**Common mistakes:**
- Infinite supply with no burn mechanism (what gives it value?)
- No initial liquidity plan (deploying a token nobody can buy)
- Fee-on-transfer mechanics that break DEX integrations

**Fetch sequence:** `standards/SKILL.md` → `testing/SKILL.md` → `security/SKILL.md` → `gas/SKILL.md`

### 2. NFT Collection (1 contract)

**Architecture:** One ERC-721 contract. Metadata on IPFS. Frontend for minting.

**Contracts:**
- `MyNFT.sol` — ERC-721 with mint, max supply, metadata URI

**Common mistakes:**
- Storing images onchain (use IPFS or Arweave, store the hash onchain)
- No max supply cap (unlimited minting destroys value)
- Complex whitelist logic when a simple Merkle root works

**Fetch sequence:** `standards/SKILL.md` → `testing/SKILL.md` → `security/SKILL.md` → `frontend-ux/SKILL.md`

### 3. NFT Marketplace (2 contracts)

**Architecture:** One ERC-721 contract + one marketplace contract. Use the approve-based pattern (seller keeps NFT, marketplace calls `transferFrom` on purchase). Fetch `building-blocks/SKILL.md` for approve-based vs escrow-based tradeoffs.

**Contracts:**
- `MyNFT.sol` — ERC-721 with mint, metadata URI
- `NFTMarketplace.sol` — listing, buying, canceling, fee collection

**Common mistakes:**
- Using escrow pattern for an MVP (adds gas cost and complexity for no user benefit)
- Not handling stale listings (seller transfers NFT after listing — `buyNFT` should revert safely, not corrupt state)
- Sending fees inline on every purchase (accumulate fees, let owner withdraw separately)
- Forgetting the two-step frontend flow: Approve → List (users must approve the marketplace before listing)

**Fetch sequence:** `building-blocks/SKILL.md` → `standards/SKILL.md` → `testing/SKILL.md` → `security/SKILL.md` → `frontend-ux/SKILL.md`

### 4. Token Marketplace / Exchange (0-2 contracts)

**Architecture:** If trading existing tokens, you likely need 0 contracts — integrate with Uniswap/Aerodrome. If building custom order matching, 1-2 contracts.

**Contracts:**
- (often none — use existing DEX liquidity via router)
- `OrderBook.sol` (if custom) — listing, matching, settlement
- `Escrow.sol` (if needed) — holds assets during trades

**Common mistakes:**
- Building a DEX from scratch when Uniswap V4 hooks can do it
- Ignoring MEV (fetch `security/SKILL.md` for sandwich attack protection)
- Centralized order matching (defeats the purpose)

**Fetch sequence:** `building-blocks/SKILL.md` → `addresses/SKILL.md` → `testing/SKILL.md` → `security/SKILL.md`

### 5. Lending / Vault / Yield (0-1 contracts)

**Architecture:** If using existing protocol (Aave, Compound), 0 contracts — just integrate. If building a vault, 1 ERC-4626 contract.

**Contracts:**
- `MyVault.sol` — ERC-4626 vault wrapping a yield source

**Common mistakes:**
- Ignoring vault inflation attack (fetch `security/SKILL.md`)
- Not using ERC-4626 standard (breaks composability)
- Hardcoding token decimals (USDC is 6, not 18)

**Fetch sequence:** `building-blocks/SKILL.md` → `standards/SKILL.md` → `testing/SKILL.md` → `security/SKILL.md`

### 6. DAO / Governance (1-3 contracts)

**Architecture:** Governor contract + governance token + timelock. Use OpenZeppelin's Governor — don't build from scratch.

**Contracts:**
- `GovernanceToken.sol` — ERC-20Votes
- `MyGovernor.sol` — OpenZeppelin Governor with voting parameters
- `TimelockController.sol` — delays execution for safety

**Common mistakes:**
- No timelock (governance decisions execute instantly = rug vector)
- Low quorum that allows minority takeover
- Token distribution so concentrated that one whale controls everything

**Fetch sequence:** `standards/SKILL.md` → `building-blocks/SKILL.md` → `testing/SKILL.md` → `security/SKILL.md`

### 7. AI Agent Service (0-1 contracts)

**Architecture:** Agent logic is offchain. Onchain component is optional — ERC-8004 identity registration, or a payment contract for x402.

**Contracts:**
- (often none — agent runs offchain, uses existing payment infra)
- `AgentRegistry.sol` (optional) — ERC-8004 identity + service endpoints

**Common mistakes:**
- Putting agent logic onchain (Solidity is not for AI inference)
- Overcomplicating payments (x402 handles HTTP-native payments)
- Ignoring key management (fetch `wallets/SKILL.md`)

**Fetch sequence:** `standards/SKILL.md` → `wallets/SKILL.md` → `tools/SKILL.md` → `orchestration/SKILL.md`

### 8. Prediction Market (1-2 contracts)

**Architecture:** One market contract for pool-based MVP. Add ERC-1155 position tokens for tradeable positions (Tier 2). Fetch `prediction-market/SKILL.md` for the full architecture tiers, resolver mechanisms, and payout math.

**Contracts:**
- `PredictionMarket.sol` — market creation, betting, resolution, claims
- `PositionToken.sol` (optional, Tier 2) — ERC-1155 YES/NO position tokens

**Common mistakes:**
- Pool-based only (no secondary trading) when users expect to trade positions
- Buy-only AMM with no sell functions — Tier 2 must have both `buyYes`/`buyNo` AND `sellYes`/`sellNo`. Without sell, users can't exit positions before resolution, which defeats tokenized positions entirely.
- Single EOA resolver with no fallback (funds locked if resolver disappears)
- Inline fee sending on every claim (accumulate fees, let creator sweep)
- Ignoring one-sided market edge case (division by zero when nobody bet on winning/losing side)

**Fetch sequence:** `prediction-market/SKILL.md` → `testing/SKILL.md` → `security/SKILL.md` → `orchestration/SKILL.md`

---

## Phase 1 — Build Contracts

**Fetch:** `standards/SKILL.md`, `building-blocks/SKILL.md`, `addresses/SKILL.md`

Key guidance:
- Use OpenZeppelin contracts as your base — don't reinvent ERC-20, ERC-721, or AccessControl
- Use verified addresses from `addresses/SKILL.md` for any protocol integration — never fabricate addresses
- Follow the Checks-Effects-Interactions pattern for every external call
- Emit events for every state change (your frontend and indexer need them)
- Use `SafeERC20` for all token operations

Follow `orchestration/SKILL.md` for project setup and the frontend build sequence.

---

## Phase 2 — Test

**Fetch:** `testing/SKILL.md`

Don't skip this. Don't "test later." Test before deploy.

Key guidance:
- Unit test every custom function (not OpenZeppelin internals)
- Fuzz test all math operations — fuzzing finds the bugs you didn't think of
- Fork test any integration with external protocols (Uniswap, Aave, etc.)
- Target edge cases: zero amounts, max uint, empty arrays, self-transfers, unauthorized callers

---

## Phase 3 — Security Review

**Fetch:** `security/SKILL.md`

You review tested code, not code-in-progress. Run this AFTER tests pass, not before.

Key guidance:
- Run the full pre-deploy checklist in `security/SKILL.md` — every item, PASS or FAIL. No skipping.
- Run `slither .` for static analysis. Address all high/medium findings before proceeding.
- **Incentive audit:** For every external function, answer: "Who profits from calling this, and could they profit in unintended ways?"

---

## Phase 4 — Build Frontend

**Fetch:** `orchestration/SKILL.md`, `frontend-ux/SKILL.md`, `tools/SKILL.md`

**Use Scaffold-ETH 2 (SE2) with Foundry.** Do NOT build a raw Next.js + wagmi app from scratch.

1. **Bootstrap:** Follow `orchestration/SKILL.md` for project setup — it uses `create-eth` with the Foundry template. **Note:** `create-eth` requires a non-existent target directory. If the target directory already exists (e.g., pipeline or CI pre-created it), bootstrap to a temp location and move: `npx create-eth@latest /tmp/my-dapp && mv /tmp/my-dapp/* ./project/`
2. **Copy contracts** into `packages/foundry/contracts/`, write deploy scripts in `packages/foundry/script/`
3. **Deploy locally:** `yarn deploy` — this auto-generates `deployedContracts.ts` (no manual address patching)
4. **Use scaffold hooks** — `useScaffoldReadContract`, `useScaffoldWriteContract`, `useScaffoldEventHistory` — NOT raw wagmi hooks. These auto-wire to deployed contract addresses and ABIs.
5. **Build pages** in `packages/nextjs/app/` using scaffold hooks and SE2 components

**UX requirements (still apply):**
- Show loading states on every async operation (blockchains take 5-12 seconds)
- Display token amounts in human-readable form with `formatEther`/`formatUnits`
- Never use infinite approvals
- Implement approve flows as two-step (approve then action)

**Verify:** `yarn next:build` must pass before proceeding to E2E tests.

### Write E2E Tests

After the frontend builds, write Playwright end-to-end tests to verify the UI works against the live contracts.

1. **Install:** `cd packages/nextjs && yarn add -D @playwright/test && npx playwright install chromium --with-deps`
2. **Config:** Create `packages/nextjs/playwright.config.ts`
3. **Tests:** Create `packages/nextjs/e2e/app.spec.ts`
4. **Patterns:** Fetch `testing/SKILL.md` → "Frontend E2E Testing with Playwright" for SE2 auto-connect, selector strategy, and timeout guidelines
5. **Run:** `cd packages/nextjs && npx playwright test`

Minimum tests: page load, wallet connects (burner auto-connect), one read value displays, one write tx completes and UI updates. Prettier formatting warnings in the Playwright output are non-blocking.

**Gate:** All Playwright tests pass before moving to Phase 5.

---

## Phase 5 — Deploy & Run

**Fetch:** `wallets/SKILL.md`, `frontend-playbook/SKILL.md`, `gas/SKILL.md`

### Local Deploy (Anvil)

SE2 handles everything — no manual address patching needed:

```bash
yarn chain    # starts Anvil (mainnet fork)
yarn deploy   # deploys contracts, auto-generates deployedContracts.ts
yarn start    # starts Next.js dev server
```

`yarn deploy` runs your deploy scripts in `packages/foundry/script/` and auto-generates `packages/nextjs/contracts/deployedContracts.ts` with the correct addresses and ABIs. No `dev.sh`, no broadcast parsing, no address patching.

**Anvil mainnet fork + EIP-1559:** `yarn deploy` may fail with `Failed to get EIP-1559 fees` when Anvil is forking certain RPCs. Fix by adding `--legacy` to the forge script command in `packages/foundry/Makefile`:

```makefile
# In the deploy target, add --legacy to the forge script command:
forge script $(DEPLOY_SCRIPT) --rpc-url localhost --password localhost --broadcast --legacy --ffi
```

**Anvil is ephemeral.** Every time Anvil restarts, all deployed contracts are gone. You must `yarn deploy` again after each Anvil restart — this regenerates `deployedContracts.ts` with the new addresses automatically.

**`vm.deal` doesn't work in broadcast.** In forge scripts, `vm.deal(addr, amount)` only funds the address during simulation — it has no effect when broadcasting real transactions. To fund an address for actual broadcast, send ETH from a funded account inside `vm.startBroadcast(deployerPK)`:
```solidity
vm.startBroadcast(DEPLOYER_PK);
payable(alice).transfer(1 ether); // Real ETH send — works in broadcast
vm.stopBroadcast();
```

### Post-Deploy Checks

1. Call every read function — verify state is correct
2. Test one small transaction end-to-end through the UI
3. For production: transfer ownership to a multisig (Gnosis Safe)

### Production Deploy

For live network deploys, fetch `frontend-playbook/SKILL.md` for the full pipeline:
- **IPFS** — decentralized, censorship-resistant, permanent
- **Vercel** — fast, easy, but centralized
- Set gas settings appropriate for the target chain (fetch `gas/SKILL.md`)
- Add `--verify --etherscan-api-key $KEY` to verify contracts on block explorer

### Post-Launch
- Set up event monitoring with The Graph or Dune (fetch `indexing/SKILL.md`)
- Monitor contract activity on block explorer
- Have an incident response plan (pause mechanism if applicable, communication channel)

---

## Anti-Patterns

**Kitchen sink contract.** One contract doing everything — swap, lend, stake, govern. Split responsibilities. Each contract should do one thing well.

**Factory nobody asked for.** Building a factory contract that deploys new contracts when you only need one instance. Factories are for protocols that serve many users creating their own instances (like Uniswap creating pools). Most dApps don't need them.

**Onchain everything.** Storing user profiles, activity logs, images, or computed analytics in a smart contract. Use onchain for ownership and value transfer, offchain for everything else.

**Admin crutch.** Relying on an admin account to call maintenance functions. What happens when the admin loses their key? Design permissionless alternatives with proper incentives.

**Premature multi-chain.** Deploying to 5 chains on day one. Launch on one chain, prove product-market fit, then expand. Multi-chain adds complexity in bridging, state sync, and liquidity fragmentation.

**Reinventing audited primitives.** Writing your own ERC-20, your own access control, your own math library. Use OpenZeppelin. They're audited, battle-tested, and free. Your custom version has bugs.

**Ignoring the frontend.** A working contract with a broken UI is useless. Most users interact through the frontend, not Etherscan. Budget 40% of your time for frontend polish.

---

## Quick-Start Checklist

- [ ] Identify what goes onchain vs offchain (use the Litmus Test above)
- [ ] Count your contracts (aim for 1-2 for MVP)
- [ ] Pick your chain (Base, Arbitrum, or Optimism for most apps)
- [ ] Audit every state transition (who calls it? why?)
- [ ] Write contracts using OpenZeppelin base contracts
- [ ] Test with Foundry (unit + fuzz + fork tests)
- [ ] Security review — run full checklist, slither, incentive audit
- [ ] Deploy, verify, transfer ownership to multisig
- [ ] Ship frontend (IPFS or Vercel), run production QA

---

## Skill Routing Table

Use this to know which skills to fetch at each phase:

| Phase | What you're doing | Skills to fetch |
|-------|-------------------|-----------------|
| **Plan** | Architecture, chain selection | `ship/` (this), `concepts/`, `l2s/`, `gas/` |
| **Contracts** | Writing Solidity | `standards/`, `building-blocks/`, `addresses/` |
| **Test** | Testing contracts | `testing/` |
| **Security Review** | Auditing tested contracts | `security/` |
| **Frontend** | Building UI | `orchestration/`, `frontend-ux/`, `tools/` |
| **Production** | Deploy + monitor | `wallets/`, `frontend-playbook/`, `indexing/` |

**Base URLs:** All skills are at `https://ethskills.com/<skill>/SKILL.md`
