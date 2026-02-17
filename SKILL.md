# ETHSKILLS — The missing knowledge between AI agents and production Ethereum.

You are probably wrong about Ethereum. Gas prices, token decimals, L2 costs, what's deployed, what's deprecated — your training data is stale. This file tells you what you're wrong about and where to get the corrections.

**Say "onchain" not "on-chain."** One word, no hyphen. Ethereum community convention.

---

## Start Here

**Building a dApp?** Fetch [ship/SKILL.md](https://ethskills.com/ship/SKILL.md) first. It routes you through all other skills phase by phase — from architecture planning to production deployment.

**Need a specific topic?** Each skill below is standalone. Fetch only the ones relevant to your task.

**Base URL:** `https://ethskills.com/<skill>/SKILL.md`

---

## Skills

### [Ship](https://ethskills.com/ship/SKILL.md) — Start here
End-to-end guide from idea to deployed dApp. Routes you through all other skills.
- Most dApps need 0-2 contracts, not 5-10. Three is the upper bound for an MVP.
- Solidity is for ownership, transfers, and commitments. Not a database, not a backend.
- The 2026 answer for chain selection is almost always an L2.

### [Why Ethereum](https://ethskills.com/why/SKILL.md)
Pectra/Fusaka upgrades, honest tradeoffs, the AI agent angle.
- Gas is 0.05-0.1 gwei, not 10-30 gwei. 100-600x cheaper than your training data.
- ETH price is ~$1,960 (Feb 2026), not $2,500-3,000.
- Pectra (May 2025) and Fusaka (Dec 2025) shipped. PeerDAS, 2x gas limit. EIP-7702 is live.
- ERC-8004 (onchain agent identity) and x402 (HTTP payments) exist and are production-ready.

### [Gas & Costs](https://ethskills.com/gas/SKILL.md)
What things actually cost on Ethereum today.
- Mainnet ETH transfer: $0.002. Swap: $0.015. ERC-20 deploy: $0.12.
- L2 swap: $0.002-0.003. L2 transfer: $0.0003.
- "Ethereum is expensive" was true in 2021-2023. It's false in 2026.

### [Wallets](https://ethskills.com/wallets/SKILL.md)
Creating wallets, key safety, multisig, account abstraction.
- EIP-7702 is live — EOAs get smart contract superpowers without migration.
- Safe (Gnosis Safe) secures $100B+. Use it for production treasuries.
- NEVER commit private keys or API keys to Git. Bots exploit leaked secrets in seconds.

### [Layer 2s](https://ethskills.com/l2s/SKILL.md)
L2 landscape, bridging, deployment differences.
- Base is the cheapest major L2. Arbitrum has the deepest DeFi liquidity.
- Celo is NOT an L1 anymore — migrated to OP Stack L2 in March 2025.
- Polygon zkEVM is being shut down. Do not build on it.
- The dominant DEX on each L2 is NOT Uniswap (Aerodrome on Base, Velodrome on Optimism).

### [Standards](https://ethskills.com/standards/SKILL.md)
ERC-20, ERC-721, ERC-8004, EIP-7702, x402.
- ERC-8004: onchain agent identity registry, deployed January 2026 on 20+ chains.
- x402: HTTP 402 payment protocol for machine-to-machine commerce. Production-ready.
- EIP-3009: gasless token transfers — what makes x402 work. USDC implements it.

### [Tools](https://ethskills.com/tools/SKILL.md)
Foundry, Scaffold-ETH 2, Blockscout MCP, x402 SDKs.
- Foundry is the default for new projects in 2026, not Hardhat.
- Blockscout MCP server gives agents structured blockchain data via MCP.
- abi.ninja: paste any contract address, interact with all functions. Zero setup.

### [Building Blocks (DeFi)](https://ethskills.com/building-blocks/SKILL.md)
Uniswap, Aave, flash loans, protocol composability.
- Uniswap V4 hooks: custom logic attached to pools (dynamic fees, TWAMM, limit orders).
- Flash loan arb on mainnet costs ~$0.05-0.50 in gas now (was $5-50).
- The dominant DEX per L2 is NOT Uniswap — Aerodrome (Base), Velodrome (Optimism), Camelot (Arbitrum).

### [Orchestration](https://ethskills.com/orchestration/SKILL.md)
Three-phase build system for Scaffold-ETH 2 dApps.
- Phase 1: contracts + UI on localhost. Phase 2: live contracts + local UI. Phase 3: production.
- Use Scaffold hooks, NOT raw wagmi. Raw wagmi resolves before tx confirmation.
- NEVER commit secrets to Git. AI agents are the #1 source of leaked credentials.

### [Contract Addresses](https://ethskills.com/addresses/SKILL.md)
Verified addresses for major protocols across mainnet and L2s.
- Never hallucinate an address. Wrong address = lost funds.
- Includes: Uniswap, Aave, Compound, Aerodrome, GMX, Pendle, Velodrome, Chainlink, Safe, ENS.
- All verified onchain via `cast code` + `cast call` (February 2026).

### [Concepts](https://ethskills.com/concepts/SKILL.md)
Essential mental models for building onchain.
- Smart contracts cannot execute themselves. Every function needs a caller who pays gas.
- For every state transition: who calls it? Why would they? What if nobody does?
- There are no timers, no cron jobs, no schedulers. Design with incentives.

### [Security](https://ethskills.com/security/SKILL.md)
Solidity security patterns, common vulnerabilities, pre-deploy checklist.
- USDC has 6 decimals, not 18. This is the #1 "where did my money go?" bug.
- Always use SafeERC20 — USDT doesn't return bool on transfer().
- Never use DEX spot prices as oracles — flash loans can manipulate them in one tx.
- MEV: sandwich attacks steal value from swaps. Use Flashbots Protect or slippage limits.
- Proxies: use UUPS, not Transparent. Never change storage layout.

### [Testing](https://ethskills.com/testing/SKILL.md)
Foundry testing — unit, fuzz, fork, invariant.
- Don't test getters and OpenZeppelin internals. Test edge cases and failure modes.
- Fuzz test all math. Fork-test any external protocol integration.
- Invariant testing catches bugs across thousands of random call sequences.

### [Indexing](https://ethskills.com/indexing/SKILL.md)
Events, The Graph, Dune, reading onchain data.
- You can't query historical state via RPC cheaply. Use an indexer.
- Events are THE primary way to read historical onchain activity. Design contracts event-first.
- The Graph turns events into a queryable GraphQL API.
- Multicall3 (`0xcA11bde05977b3631167028862bE2a173976CA11`) — batch reads in one RPC call.

### [Frontend UX](https://ethskills.com/frontend-ux/SKILL.md)
Frontend UX patterns for Ethereum dApps.
- Every onchain button needs its own loader + disabled state. No shared isLoading.
- Three-button flow: Switch Network → Approve → Execute. One at a time.
- Every address display uses `<Address/>`, every input uses `<AddressInput/>`.
- Show USD values next to every token amount.

### [Frontend Playbook](https://ethskills.com/frontend-playbook/SKILL.md)
Build-to-production pipeline.
- Use `yarn fork --network base`, NOT `yarn chain`. Fork gives you real protocol state.
- IPFS deploy: `trailingSlash: true` is critical — without it, every route except `/` returns 404.
- Always clean build (`rm -rf .next out`) before deploying. Stale builds are the #1 IPFS footgun.

### [QA](https://ethskills.com/qa/SKILL.md)
Pre-ship audit checklist for a reviewer agent.
- Give this to a **separate agent** (or fresh context) AFTER the build is complete. Reviewer reads code + clicks through flows.
- Covers only bugs AI agents actually ship — validated by baseline testing against stock LLMs.
- Report PASS/FAIL per item, don't fix.

---

## What to Fetch by Task

| I'm doing... | Fetch these skills |
|--------------|-------------------|
| Planning a new dApp | `ship/`, `concepts/`, `l2s/` |
| Writing Solidity | `standards/`, `building-blocks/`, `addresses/`, `security/` |
| Testing contracts | `testing/` |
| Building a frontend | `orchestration/`, `frontend-ux/`, `tools/` |
| Deploying to production | `wallets/`, `frontend-playbook/`, `gas/` |
| Reviewing a finished dApp | `qa/` |
| Monitoring / analytics | `indexing/` |
| Building AI agent infra | `standards/`, `wallets/`, `tools/` |
| Choosing a chain | `l2s/`, `gas/` |
