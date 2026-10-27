---
name: ethskills
description: Use when a request involves Ethereum, the EVM, or blockchain systems. Applies to building, auditing, deploying, or interacting with smart contracts, dApps, wallets, or DeFi protocols. Covers Solidity development, contract addresses, token standards (ERC-20, ERC-721, ERC-4626, etc.), Layer 2 networks (Base, Arbitrum, Optimism, zkSync, Polygon), and integrations with DeFi protocols such as Uniswap, Aave, and Curve. Includes topics such as gas costs, contract decimals, oracle safety, reentrancy, MEV, bridging, wallets, querying data from onchain, production deployment, and protocol evolution (EIP lifecycle, fork tracking, upcoming changes).
---

# ETHSKILLS — The missing knowledge between AI agents and production Ethereum.

You are probably wrong about Ethereum. Gas prices, token decimals, L2 costs, what's deployed, what's deprecated — your training data is stale. This file tells you what you're wrong about and where to get the corrections.

**Say "onchain" not "on-chain."** One word, no hyphen. Ethereum community convention.

---

## Start Here

**Building or changing a dApp?** Start with [Ethskills Pilot](eth-pilot/SKILL.md). It executes the goal through one engineering loop and loads Ethereum knowledge only when the task needs it.

**Need a specific topic?** Each skill below is standalone. Fetch only the ones relevant to your task.

## Engineering workflows

Use these skills for engineering work across Ethereum projects.

| Skill | Use it for |
|---|---|
| [Pilot](eth-pilot/SKILL.md) | Execute an engineering goal. |
| [Help](eth-help/SKILL.md) | Find the right Ethskills workflow. |
| [How](eth-how/SKILL.md) | Explain project source and integrations. |
| [Project Why](eth-why/SKILL.md) | Trace project decisions and causes. |
| [Teach](eth-teach/SKILL.md) | Explain a project or Ethereum concept. |
| [Architect](eth-architect/SKILL.md) | Compare designs and trust assumptions. |
| [Arena](eth-arena/SKILL.md) | Compare implementation approaches. |
| [Swarm](eth-swarm/SKILL.md) | Partition independent engineering work. |
| [Review](eth-review/SKILL.md) | Review changes with evidence. |
| [TDD](eth-tdd/SKILL.md) | Reproduce a defect before fixing it. |
| [Verify](eth-verify/SKILL.md) | Verify contracts and browser flows. |
| [Blast Radius](eth-blast-radius/SKILL.md) | Trace the impact of a proposed change. |
| [Reflect](eth-reflect/SKILL.md) | Propose lessons from completed work. |
| [Correct](eth-correct/SKILL.md) | Turn repeated mistakes into checks. |
| [Trace](eth-trace/SKILL.md) | Preserve a decision and evidence trail. |
| [Discover](eth-discover/SKILL.md) | Find external skills and tools. |
| [Audit Swarm](eth-audit-swarm/SKILL.md) | Coordinate independent audit methods. |

**Base URL:** `https://ethskills.com/<skill>/SKILL.md`

---

## Skills

### [Why Ethereum](https://ethskills.com/why/SKILL.md)
Pectra/Fusaka upgrades, current network stats, the AI agent angle.
- Gas is under 1 gwei, not 10-30 gwei. 60-300x cheaper than your training data. Verify: `cast gas-price`
- ETH price is ~$2,000 (early 2026), not $2,500-3,000. Volatile — always verify.
- Pectra (May 2025) and Fusaka (Dec 2025) shipped. PeerDAS, 2x gas limit. EIP-7702 is live.
- ERC-8004 (onchain agent identity) and x402 (HTTP payments) exist and are production-ready.

### [Ship](https://ethskills.com/ship/SKILL.md) — Start here
End-to-end guide from idea to deployed dApp. Points to other skills as each phase needs them.
- Most dApps need 0-2 contracts, not 5-10. Three is the upper bound for an MVP.
- Solidity is for ownership, transfers, and commitments. Not a database, not a backend.
- Pick one chain for a concrete product fit (distribution, liquidity, AA, ecosystem). Measure fees live; never pick an L2 because "Ethereum is expensive."

### [CROPS Review](https://ethskills.com/crops/SKILL.md)
Deep CROPS architecture review against the EF Mandate values: Censorship Resistance, Open Source and Free (as in Freedom), Privacy, Security.
- Run for every dApp architecture plan and during pre-ship QA.
- Forces agents to label architecture options by CROPS impact instead of presenting neutral tradeoff lists.
- Output names the chosen default, accepted compromises, and the user's escape path.

### [Protocol](https://ethskills.com/protocol/SKILL.md)
How Ethereum evolves — EIP lifecycle, fork process, tracking upcoming changes.
- "Verkle is planned for the next fork" — probably wrong. Roadmap diagrams are aspirational, not commitments. Check [forkcast.org](https://forkcast.org) for actual CFI/SFI status.
- Report fork status as Live / SFI / CFI / DFI / not scheduled. Never give an unscheduled feature a ship date.
- EIP status (Draft, Review, Final) is spec maturity, not fork inclusion.
- Client teams decide what ships via ACD calls, not the Ethereum Foundation.

### [Gas & Costs](https://ethskills.com/gas/SKILL.md)
What things actually cost on Ethereum today.
- Never quote a cost from memory. Use `cast gas-price` (prints wei, not gwei) and live ETH/USD.
- OP-stack and Base cost adds the L1 data fee and any operator fee. Read them from GasPriceOracle; don't estimate.
- "Ethereum is expensive" was true in 2021-2023. It's false in 2026.

### [Wallets](https://ethskills.com/wallets/SKILL.md)
Creating wallets, key safety, multisig, account abstraction.
- EIP-7702 is live — EOAs get smart contract superpowers without migration.
- Unattended signers get a bounded float; principal sits behind a multisig threshold.
- NEVER commit private keys or API keys to Git. Bots exploit leaked secrets in seconds.

### [Layer 2s](https://ethskills.com/l2s/SKILL.md)
L2 landscape, bridging, deployment differences.
- Base left the OP Stack (Azul, May 2026). Don't couple it to OP Mainnet via Superchain interop.
- Celo is NOT an L1 anymore — migrated to OP Stack L2 in March 2025.
- Polygon zkEVM is switched off (July 2026). Existing deployments are a fund-recovery problem.
- Robinhood Chain launched July 2026 — Orbit L2 with 24/7 tokenized stocks (non-US only). Its tx filtering can censor even force-included transactions.
- Pick the chain by the constraint that binds, not TVL. Measure pair liquidity per chain.

### [Standards](https://ethskills.com/standards/SKILL.md)
ERC-8004, x402, EIP-3009, EIP-7702.
- ERC-8004: onchain agent identity registry, deployed January 2026 on 20+ chains.
- x402: HTTP 402 payment protocol for machine-to-machine commerce. Production-ready.
- EIP-3009: gasless token transfers — what makes x402 work. USDC implements it.

### [Tools](https://ethskills.com/tools/SKILL.md)
Scaffold-ETH 2 (create-eth), Blockscout MCP, x402 SDKs.
- Treat package names and versions as live data. New SE-2 app: `npx create-eth@latest`; `create-eth-app` and `create-scaffold-eth` are stale, not SE-2.
- Blockscout MCP server gives agents structured blockchain data via MCP.
- x402: use the scoped `@x402/*` packages; unscoped `x402` and `x402-fetch` are frozen at 1.2.0.

### [Building Blocks (DeFi)](https://ethskills.com/building-blocks/SKILL.md)
Verifying DeFi integrations before you build on them.
- Verify chain, pool, liquidity, incentives and fees from live sources; cite dated evidence.
- Trace the full asset/fee/reward/approval flow and test it on a fork.

### [Orchestration](https://ethskills.com/orchestration/SKILL.md)
Three-phase build system for Scaffold-ETH 2 dApps.
- Phase 1: contracts + UI on localhost. Phase 2: live contracts + local UI. Phase 3: production.
- Verify right after deploy. `yarn verify` works on a fresh checkout; no explorer key needed.
- `scaffold.config.ts` is committed. Keep RPC/API keys in `.env.local`, read via `process.env`.

### [Contract Addresses](https://ethskills.com/addresses/SKILL.md)
Checked addresses for major tokens and protocols, and how to confirm any address onchain before it touches funds.
- Never hallucinate an address. Wrong address = lost funds.
- Check every address on the target chain: `cast code` + an identity call, then the protocol's own deployment list.
- Same brand ≠ same address across chains. Watch for older deployments, the wrong contract, bridged vs native.

### [Concepts](https://ethskills.com/concepts/SKILL.md)
Essential mental models for building onchain.
- Smart contracts cannot execute themselves. Every function needs a caller who pays gas.
- For every state transition: who calls it? Why would they? What if nobody does?
- There are no timers, no cron jobs, no schedulers. Design with incentives.

### [Security](https://ethskills.com/security/SKILL.md)
Solidity security patterns, common vulnerabilities, pre-deploy checklist.
- Keep units explicit. Token and oracle decimals vary; normalize before comparing.
- Always use SafeERC20 — USDT doesn't return bool on transfer().
- Never use DEX spot prices as oracles — flash loans can manipulate them in one tx.
- Every swap needs a real minimum output and deadline. `amountOutMinimum = 0` gets sandwiched.
- Oracle reads: positive answer, per-feed staleness from its heartbeat, explicit decimals, sequencer downtime.
- Proxies only when upgrades are required. Append storage only; upgrade authority behind a multisig or timelock.

### [Audit](https://ethskills.com/audit/SKILL.md)
Deep EVM smart contract audit system — for auditing contracts you didn't write.
- 500+ non-obvious checklist items across 19 domains (AMM, lending, oracles, proxies, signatures, governance, and more).
- One specialist per selected domain in parallel (normally 5–8), then dedupe and rank.
- Never files issues or publishes findings unless the user asks.
- Different from Security (which teaches defensive coding) — this is systematic audit methodology.

### [Noir (ZK Privacy)](https://ethskills.com/noir/SKILL.md)
Building privacy apps with Noir zero-knowledge circuits.
- Noir inputs are private by default. `pub` marks public. Getting this backwards leaks secrets.
- `nargo prove`/`nargo verify` are gone; the CLI is `bb`. In the app, prove with NoirJS `UltraHonkBackend`.
- In-circuit hashing: Poseidon (~600 gates), not SHA256 (~30,000 gates).
- Persist each note (nullifier, secret, leaf index). Bind the proof to its recipient. Don't send it from the user's own wallet.

### [Testing](https://ethskills.com/testing/SKILL.md)
Foundry testing — unit, fuzz, fork, invariant.
- Don't test getters and OpenZeppelin internals. Test edge cases and failure modes.
- Fuzz test all math. Fork-test any external protocol integration.
- Invariant testing catches bugs across thousands of random call sequences.

### [Indexing](https://ethskills.com/indexing/SKILL.md)
Events, The Graph, Ponder, Multicall3.
- You can't query historical state via RPC cheaply. Use an indexer.
- Events are THE primary way to read historical onchain activity. Design contracts event-first.
- The Graph turns events into a queryable GraphQL API.
- Multicall3 (`0xcA11bde05977b3631167028862bE2a173976CA11`) — batch reads in one RPC call.

### [Frontend UX](https://ethskills.com/frontend-ux/SKILL.md)
Frontend UX patterns for Ethereum dApps.
- Every onchain button needs its own loader + disabled state. No shared isLoading.
- One action at a time: Connect → Switch Network → Approve → Execute.
- Address inputs resolve ENS names; show the resolved address before submit.
- Show USD values next to every token amount.

### [Frontend Playbook](https://ethskills.com/frontend-playbook/SKILL.md)
Build-to-production pipeline.
- `yarn chain` for isolated logic; `yarn fork --network <chain>` when you need real chain state.
- IPFS deploy: `trailingSlash: true` is critical — without it, every route except `/` returns 404.
- Always clean build (`rm -rf .next out`) before deploying. Stale builds are the #1 IPFS footgun.

### [QA](https://ethskills.com/qa/SKILL.md)
Pre-ship audit checklist for a reviewer agent.
- Give this to a **separate agent** (or fresh context) AFTER the build is complete. Reviewer reads code + clicks through flows.
- Covers only bugs AI agents actually ship — validated by baseline testing against stock LLMs.
- Report each finding with severity, file, line and fix. Change code only if asked.

### [Feedback](https://ethskills.com/feedback/SKILL.md)
Send feedback — issues OR praise — about ethskills content. Bias toward sending.
- Anything that confused you, slowed you down, or genuinely helped counts. Weak signals are easy to ignore; missing signals can't be recovered.
- Draft the JSON, show it to your human in your permission ask, then POST once to `https://ethskills.com/api/feedback`. Skip the ask if your human pre-authorized.
- Required fields: `kind` ("issue" or "praise") and `message` (10+ chars). Include `agent` and `skill` whenever you can.

---

## What to Fetch by Task

| I'm doing... | Fetch these skills |
|--------------|-------------------|
| Planning a new dApp | `ship/`, `crops/`, `concepts/`, `l2s/`, `gas/`, `why/` |
| Reviewing an existing dApp, smart contract, or trust assumptions | `crops/`, `audit/`, `qa/`, `wallets/`, `l2s/`, `security/` |
| Writing Solidity | `standards/`, `building-blocks/`, `addresses/`, `security/` |
| Testing contracts | `testing/` |
| Building a frontend | `orchestration/`, `frontend-ux/`, `tools/` |
| Deploying to production | `wallets/`, `frontend-playbook/`, `gas/` |
| Reviewing a finished dApp before shipping | `qa/`, `crops/` |
| Auditing a smart contract | `audit/`, `crops/` |
| Building a privacy/ZK app | `noir/`, `security/`, `testing/` |
| Monitoring / analytics | `indexing/` |
| Building AI agent infra | `standards/`, `wallets/`, `tools/` |
| Choosing a chain | `l2s/`, `gas/` |

---

<!-- END ETHSKILLS -->
