<img width="759" height="198" alt="image" src="https://github.com/user-attachments/assets/19afbd29-29cd-4b9a-bb67-c914cc5d9576" />

LLMs think gas is 30 gwei. It's far lower — and they quote it from memory. They've never heard of ERC-8004 or x402. They hallucinate contract addresses. This site fixes that.

## Ethskills Pilot

Give your agent a goal through **Ethskills Pilot**. One integrated workflow combines small verified changes with the Ethereum knowledge needed at each step. It preserves your project's stack, reports what actually worked and leaves a usable handoff for longer tasks. It does not require a separate Poteto installation.

```text
/ethskills:pilot reproduce the failed deposit, fix it using our existing
stack, and verify the contract and browser flow with evidence.
```

The Markdown skills work directly in Codex, Claude Code, and other agents that can read them. Plugin installation is optional. Host-specific Codex and Claude Code packages each offer one **Ethskills** plugin with 22 Ethereum topic skills and 17 engineering workflows in separate sections. Its main entry point is `ethskills:pilot`; supporting workflows use the same `ethskills` namespace. These are agent instructions; your host must provide the required tools. Installing a skill does not install a wallet, browser or contract toolchain.

Read the [Ethskills Pilot guide](docs/guide/README.md), use [Help](eth-help/SKILL.md) for a suggested prompt, or inspect the [complete skill index](SKILL.md). The website's `/guide/` reader renders the same Markdown chapters with navigation, search and copyable prompts. Host invocation syntax varies; URL-based agents can read `https://ethskills.com/eth-pilot/SKILL.md` directly. Local unreleased changes must be read from the checkout.

Existing topic skills remain directly usable.

## How It Works

Each skill is a Markdown file. Give its URL or local path to Codex or Claude Code so the agent can read it directly.

```
https://ethskills.com/SKILL.md          ← table of contents
https://ethskills.com/gas/SKILL.md      ← just gas & costs
https://ethskills.com/why/SKILL.md      ← why ethereum
https://ethskills.com/crops/SKILL.md    ← CROPS architecture review
```

### Add the top-level SKILL.md to your agent's context
The agent will look up the specific skills when needed.

Just prompt your agent with this:

```
Install the https://github.com/austintgriffith/ethskills/blob/master/SKILL.md skill
```

### Optional Codex plugins

Add the [Codex marketplace](.agents/plugins/marketplace.json) with the Codex CLI, then install the `ethskills` plugin from the Plugins Directory or CLI. It keeps topic and workflow skills in separate sections under one namespace.

```bash
codex plugin marketplace add austintgriffith/ethskills
codex plugin add ethskills@ethskills
```

### Optional Claude Code plugins

Add the marketplace once, then install the package you need:

```bash
/plugin marketplace add austintgriffith/ethskills
/plugin install ethskills@ethskills
```

One plugin provides all 39 skills. The standalone Markdown files remain usable without plugin installation.

## Terminology

**Say "onchain" not "on-chain."** The Ethereum community writes it as one word — no hyphen. LLMs default to "on-chain" but that's not how builders talk. Use "onchain" in all writing, documentation, and generated content.

## External skills and audit methods

Use [Discover](eth-discover/SKILL.md) when a task needs outside skills, MCP servers, or tools. It checks the external catalog, source revisions, compatibility, and freshness before recommending or using a capability. Ethskills Pilot can use it for a missing capability without handing over the task workflow.

Use [Audit Swarm](eth-audit-swarm/SKILL.md) for independent audit methods from the catalog. It evaluates every security entry, runs applicable workflows, and reports findings with provider status and coverage gaps. The existing Audit skill supplies domain-specific review within that process.

## Skills

| Skill | What LLMs Get Wrong |
|-------|-------------------|
| [Why Ethereum](why/SKILL.md) | Pectra/Fusaka shipped, gas is cheap now, AI agent angle |
| [Ship](ship/SKILL.md) | Start coding before planning architecture, over-engineer with 5+ contracts when 1-2 will do, skip chain selection and the CROPS gate |
| [CROPS Review](crops/SKILL.md) | Miss custody, privacy, exit paths, censorship resistance, and centralization risks in otherwise working apps/contracts |
| [Protocol](protocol/SKILL.md) | Answer fork status from memory, read EIP status as fork inclusion, give unscheduled features ship dates |
| [Gas & Costs](gas/SKILL.md) | Quote gas costs from memory, mix up wei and gwei, forget the L1 data fee on L2s |
| [Wallets](wallets/SKILL.md) | EIP-7702 is live, signer authority limits, burned keys |
| [Layer 2s](l2s/SKILL.md) | Think Base is still OP Stack, Polygon zkEVM still runs, Superchain interop is live |
| [Standards](standards/SKILL.md) | Don't know ERC-8004, EIP-7702 status, EIP-3009 for x402 |
| [Tools](tools/SKILL.md) | Don't know x402, Blockscout MCP, current tool landscape |
| [Money Legos](building-blocks/SKILL.md) | Assume a protocol is live or dominant from headlines, skip fork-testing the composed flow |
| [Orchestration](orchestration/SKILL.md) | Don't know SE2 three-phase build system |
| [Contract Addresses](addresses/SKILL.md) | Hallucinate addresses — these are checked onchain. Assume the same address across chains, pick bridged over native |
| [Concepts](concepts/SKILL.md) | Nothing is automatic, incentive design, randomness pitfalls |
| [Security](security/SKILL.md) | Token decimals, reentrancy, oracle manipulation, vault inflation, pre-deploy checklist |
| [Testing](testing/SKILL.md) | Test getters and OpenZeppelin internals, skip fuzz and fork tests on integrations, mock external protocols instead of forking |
| [Indexing](indexing/SKILL.md) | Loop over blocks to read history, try to query historical state via raw RPC, ignore events as the primary read API |
| [Frontend UX](frontend-ux/SKILL.md) | Onchain button rules, one-action-at-a-time approval flow, Address components, USD values |
| [Frontend Playbook](frontend-playbook/SKILL.md) | Fork mode, fork demos, IPFS static export, ENS content hash |
| [QA](qa/SKILL.md) | Treat "deploys without errors" as shipping, leave SE2 default branding, miss approve-button double-fire, mobile deep links |
| [Audit](audit/SKILL.md) | Call one generic review pass an audit, miss systematic checklist coverage across AMM/lending/oracle/proxy/governance domains |

## Security Guardrails

Skills teach restraint, not just capability. Every skill that touches keys, credentials, or funds includes explicit safety rules — because LLMs optimize for speed and will hardcode a private key into `git add .` if you let them. Coverage includes wallet keys, API keys, RPC URLs, and the common SE2 `scaffold.config.ts` trap.

## Methodology

We test stock LLMs, find what they get wrong, and write corrections. Content is verified against onchain reality. If an LLM already knows something, we don't include it.

**Every proposed change goes through [triage](https://github.com/austintgriffith/ethskills-research/blob/master/research/triage-methodology.md):** spawn a stock LLM, give it a realistic task, see what it gets wrong. Only verified blind spots survive.

See the [research repo](https://github.com/austintgriffith/ethskills-research) for baseline audits, gap analysis, and full methodology.

## Contributing

Something wrong or missing? Humans and agents are welcome to [open a PR](https://github.com/austintgriffith/ethskills/pulls). Read [CONTRIBUTING.md](CONTRIBUTING.md) first — the bar is "would a stock LLM get this wrong?"

## License

MIT
