---
name: crops
description: "CROPS architecture review for Ethereum apps and smart contract systems: Censorship Resistance, Open Source and Free (as in Freedom), Privacy, and Security. Use when planning or reviewing dApps or contracts where custody, wallets, L2s, bridges, RPC/indexers, relayers, paymasters, frontend hosting, admin keys, upgrades, privacy, identity, stablecoins, agent permissions, or vendor dependencies affect user self-sovereignty and exit. Also use before shipping any app or contract that handles user funds or permissions."
---

# CROPS Review

CROPS is the Ethereum Foundation's shorthand for the properties Ethereum must preserve: **Censorship Resistance, Open Source and Free (as in Freedom), Privacy, Security**. This skill turns those values into concrete dApp and smart contract architecture checks.

Source context: [The Promise of Ethereum: Introducing the EF Mandate](https://blog.ethereum.org/2026/03/13/ef-mandate) and the [EF Mandate PDF](https://ethereum.foundation/ef-mandate.pdf).

---

## What You Probably Got Wrong

**"It works" is not enough.** A dApp or smart contract can compile, pass tests, and demo cleanly while handing users to a censorable frontend, a closed indexer, an invisible RPC dependency, a custodial wallet, or an admin key with total control.

**You treat decentralization as only a contract property.** The contract may be permissionless while the app depends on a single hosted frontend, API, relayer, paymaster, sequencer, bridge, or wallet vendor. Users experience the whole stack.

**You treat verified contracts as an open dApp.** Etherscan verification makes deployed contract source inspectable and tied to bytecode, which is good. But *Open* requires the whole stack (frontend, indexer, backend, configs, deployment docs) to be public, not just the deployed contract. And *Free, as in Freedom* requires a real OSI-permissive or copyleft license — source-available-only licenses (BUSL, SSPL, custom "no commercial use") do not pass.

**You check privacy after the architecture already leaks data.** Before choosing contracts, wallets, RPCs, analytics, indexers, or identity flows, tell the builder which addresses, balances, counterparties, timing data, IP metadata, wallet fingerprints, analytics events, and identity links could be exposed.

**You treat security as only code bugs.** Reentrancy and oracle manipulation matter, but so do custody, upgrades, admin keys, recovery, emergency powers, approvals, and whether the app still works if the team or vendor disappears.

**You list architecture options without their trust tradeoffs.** Choices like embedded wallet vs Safe vs EOA, or Vercel vs IPFS, change who can control access, custody, privacy, and user exit. Label each option’s CROPS impact and recommend the most CROPS-aligned default.

---

## When To Fetch This Skill

Fetch this skill before finalizing architecture, or when reviewing an existing dApp or smart contract, if the system involves:

- user funds, custody, approvals, permissions, or spending limits
- wallets, embedded wallets, account abstraction, session keys, or agent wallets
- L2s, bridges, sequencers, data availability, or withdrawal paths
- RPC providers, indexers, relayers, paymasters, or commercial APIs
- admin keys, upgradeability, pausing, blacklists, allowlists, or emergency controls
- identity, credentials, stablecoins, compliance surfaces, or privacy-sensitive data
- frontend hosting, ENS/IPFS deployment, app stores, analytics, or closed backend services

If none of those apply, keep the short CROPS Gate from `ship/SKILL.md` and avoid loading extra context.

---

## The Four CROPS Checks

### Censorship Resistance

Ask: **who can block valid use, and can users route around them?**

Check for:
- admin pause, blacklist, allowlist, upgrade, or kill-switch powers
- relayers, paymasters, RPCs, sequencers, bridges, app stores, CDNs, frontends, or APIs that can block users
- any critical component controlled by one party where users cannot realistically switch providers, self-host, or route around it
- missing fallback paths such as calling contracts directly, switching RPC providers, using a self-hosted frontend, or exiting an L2/bridge path back to Ethereum L1

Prefer:
- permissionless contract entrypoints where possible
- emergency powers, if unavoidable, that are narrow in scope, controlled by a multisig, time-limited or removable, delayed by a timelock where practical, and publicly explained
- documented fallback paths users can actually use
- infrastructure choices that keep intermediaries replaceable

### Open Source and Free, as in Freedom

Ask: **is the whole stack visible (Open), and does the license actually let a third party fork, modify, and run it (Free)?**

Check for — **Open** (visibility):
- "open source" claim that only covers the deployed contract, not the surrounding stack
- dependencies that make the app hard to inspect, fork, or self-host, such as private indexers required for the frontend, vendor-hosted APIs, backend-only business logic, proprietary SDK lock-in, or opaque AI/risk/scoring systems
- frontend source that cannot be rebuilt from the repo because build steps, env vars, ABIs, contract addresses, or deployment instructions are missing

Check for — **Free, as in Freedom** (license actually grants the freedoms):
- source-available-only licenses: BUSL, SSPL, custom "no commercial use", "no derivatives"
- license terms that still require special permission from the original team or block useful independent forks
- no pledge that the license will stay open — projects that reserve the right to change the license later
- copyleft license paired with proprietary plugins or hosted-only dependencies that defeat the freedom in practice

Prefer:
- permissive (MIT, Apache 2.0) or copyleft (GPL, AGPL) licenses across the whole stack
- explicit commitment not to relicense in the future
- open-source contracts, frontend, indexer, deployment scripts, and docs
- reproducible builds and verified contracts
- self-host instructions for the full stack
- standards and data formats other builders can integrate without permission

### Privacy

Ask: **what can an observer learn, and did the user choose that disclosure?**

Check for:
- public addresses, balances, counterparties, amounts, timing, identity links, location/IP metadata, and wallet fingerprints
- analytics, RPC, indexer, or API calls that leak user behavior offchain
- identity or credential systems collecting more than the app actually needs
- UI that hides the privacy cost of public onchain actions

Prefer:
- data minimization
- selective disclosure instead of full identity disclosure
- local-first reads and privacy-preserving RPC/indexing where practical
- clear UI copy for unavoidable public data
- ZK or commitment/nullifier patterns when the use case genuinely needs privacy

### Security

Ask: **does the system do what it claims, no more and no less, even if the team disappears?**

Check for:
- who controls funds, approvals, keys, upgrades, recovery, emergency powers, and user exit
- unbounded approvals, unbounded agent spending, prompt-only policy, or backend-only enforcement
- upgradeable contracts without storage discipline, timelocks, or clear governance
- dependencies that silently break the app if a vendor disappears
- operational secrets, private keys, API keys, and deployment credentials

Prefer:
- least authority by default
- capped permissions, allowlists, expiries, and revocation for agents or automation
- Safe/multisig and timelocks for real admin powers
- onchain or wallet-level enforcement for spending policy, not prompt text
- simple designs that can pass the walkaway test

---

## Required Review Output

When using this skill, output a concrete review for the user's app. Do not repeat generic CROPS definitions.

Use this shape:

```md
## CROPS Review

Chosen default:
- <architecture choice and why>

Censorship Resistance:
- Strengthens:
- Weakens:
- Required fallback:

Open Source and Free, as in Freedom:
- Open (visibility): <whole stack public, no black boxes>
- Free (license): <OSI-permissive or copyleft, no source-available-only, no future relicensing>
- Required docs/source:

Privacy:
- Leaks:
- Avoidable leaks:
- User disclosure:

Security:
- Controls:
- Failure mode:
- Walkaway test:

Accepted compromises:
- <only compromises that are explicit and justified>

User escape path:
- <how the user exits, revokes, self-hosts, withdraws, or routes around failure>
```

When presenting options, label each option with its CROPS impact and mark the most CROPS-aligned default. Example:

```md
Option A: Vercel-only frontend
- C: weakens; host can remove access
- O: neutral if source is open, weakens if no self-host docs
- P: depends on analytics/RPC behavior
- S: simple ops, but vendor outage breaks app UX

Option B: IPFS + ENS with Vercel mirror (recommended default)
- C: strengthens; users have a route around host removal
- O: strengthens if build and deploy docs are public
- P: depends on RPC/indexer choices
- S: adds deploy complexity but improves walkaway path
```

---

## Common Failure Modes

**Censorable frontend:** Contracts are permissionless, but the only usable UI is a hosted frontend. Fix: publish source, document self-hosting, and offer IPFS/ENS or another durable route.

**Closed indexer:** The app cannot function without a proprietary API. Fix: make event schema public, document indexing, and allow alternate indexers.

**Invisible RPC dependency:** The frontend silently depends on one RPC provider. Fix: disclose the dependency, support configurable RPCs, and avoid hardcoded public fallbacks that rate-limit users.

**Admin key with total control:** `onlyOwner` can pause, upgrade, seize, change fees, or redirect flows. Fix: minimize powers, use Safe + timelock, make powers explicit, and remove them when possible.

**Prompt-only agent policy:** An AI agent is told not to overspend, but nothing enforces that if the key or prompt is compromised. Fix: enforce caps, allowlists, expiries, and revocation in the wallet/contract layer.

**Custody hidden behind UX:** Embedded or custodial flows improve onboarding but blur who controls keys, recovery, and exit. Fix: explain custody, recovery, export, and migration paths before the user deposits value.

**L2 trust assumptions omitted:** The app picks an L2 but never explains sequencer, bridge, withdrawal, DA, or censorship assumptions. Fix: fetch `l2s/SKILL.md` and disclose the real exit path.

**Stablecoin risks ignored:** Stablecoins can add issuer, freeze, compliance, bridge, and privacy risks. Fix: disclose freeze/custody assumptions and give users a reasoned token/chain choice.

**Privacy theater:** The app uses ZK branding but links deposits and actions through events, relayers, wallets, or frontend telemetry. Fix: threat-model observer knowledge and test linkability.

---

## Teaching Your Human

Your job is not to make the builder recite values. Your job is to make hidden power visible.

When a builder picks a convenient default, explain four things:

1. **Who gets power** because of this design.
2. **What they can do** if they are pressured, hacked, captured, negligent, or gone.
3. **What the user can do** to exit, revoke, self-host, withdraw, or route around failure.
4. **What default you recommend** if the builder wants the most CROPS-aligned version.

Use concrete language:

- "This admin key can freeze every user. If you need an emergency pause for v1, put it behind a Safe, add a timelock or expiry, and tell users what can be paused."
- "This closed indexer means the contracts are public but the app is not forkable in practice. Publish the event schema and a self-host path."
- "This agent can spend from the user's wallet without an onchain cap. Put the policy in a smart account or Safe module; prompt instructions are not a security boundary."
- "This stablecoin route is good UX, but it adds issuer freeze risk and public payment graph leakage. Say that before recommending it."

Do not shame the builder for pragmatic compromises. Name the compromise, bound it, and preserve the user's exit path.

---

## Relationship To Other Skills

- Fetch `ship/SKILL.md` first for full dApp planning. `ship` runs the short CROPS Gate; this skill is the deeper review.
- Fetch `concepts/SKILL.md` for "nothing is automatic," incentives, state transitions, and the mental model behind self-sustaining systems.
- Fetch `wallets/SKILL.md` for custody, Safe, account abstraction, EIP-7702, and key safety implementation details.
- Fetch `l2s/SKILL.md` for sequencer, bridge, withdrawal, and chain-selection assumptions.
- Fetch `security/SKILL.md` for Solidity vulnerability patterns and pre-deploy checks.
- Fetch `audit/SKILL.md` for deep smart contract vulnerability review. This skill covers admin powers, trust assumptions, censorship paths, privacy leakage, and user exit.
- Fetch `qa/SKILL.md` after the build for a fresh reviewer pass.
