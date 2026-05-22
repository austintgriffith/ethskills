---
name: crops
description: "Use for every Ethereum dApp architecture plan and for reviews of existing systems, trust assumptions, custody, admin keys, pause or upgrade powers, hosted infra (RPC, indexer, paymaster, bundler, frontend host, oracle, sequencer), privacy, identity flows, agent permissions, stablecoin issuer risk, censorship resistance, user exit, and restrictive licenses (BUSL, SSPL). CROPS means Censorship Resistance, Open Source and Free, Privacy, Security."
---

# CROPS Review

CROPS is the Ethereum Foundation's shorthand for the properties Ethereum must preserve: **Censorship Resistance, Open Source and Free (as in Freedom), Privacy, Security**. This skill turns those values into concrete dApp and smart contract architecture checks.

Source context: [The Promise of Ethereum: Introducing the EF Mandate](https://blog.ethereum.org/2026/03/13/ef-mandate) and the [EF Mandate PDF](https://ethereum.foundation/ef-mandate.pdf).

---

## What You Probably Got Wrong

**"It works" is not enough.** A dApp or smart contract can compile, pass tests, and demo cleanly while handing users to a censorable frontend, a closed indexer, an invisible RPC dependency, a custodial wallet, or an admin key with total control.

**You treat decentralization as only a contract property.** The contract may be permissionless while the app depends on a single hosted frontend, API, relayer, paymaster, sequencer, bridge, or wallet vendor. Users experience the whole stack.

**You treat verified contracts as an open dApp.** Etherscan verification ties bytecode to source for that contract only; *Open* needs the whole stack public, and *Free* needs a license the Mandate counts as actually free, not merely source-available (EF Mandate p.13). OSI-permissive or copyleft is the practical bar.

**You check privacy after the architecture already leaks data.** Before choosing contracts, wallets, RPCs, analytics, indexers, or identity flows, tell the builder which addresses, balances, counterparties, timing data, IP metadata, wallet fingerprints, analytics events, and identity links could be exposed.

**You treat security as only code bugs.** Reentrancy and oracle manipulation matter, but so do custody, upgrades, admin keys, recovery, emergency powers, approvals, and whether the app still works if the team or vendor disappears.

**You list architecture options without their trust tradeoffs.** Choices like embedded wallet vs Safe vs EOA, or Vercel vs IPFS, change who can control access, custody, privacy, and user exit. Label each option’s CROPS impact and recommend the most CROPS-aligned default.

---

## When To Fetch This Skill

CROPS applies to every dApp.

For new dApp planning, start with `ship/SKILL.md`; it runs the short CROPS Gate. Then fetch this skill before finalizing architecture to turn the gate into the full CROPS record.

During the deep review, focus especially on non-trivial answers on any pillar:

- **C** — someone (admin, sequencer, host, relayer, bundler, paymaster, indexer, oracle, OFAC list) can block users.
- **O** — part of the stack is closed, opaquely hosted, source-available-only licensed, or not reproducible from a public commit.
- **P** — addresses, balances, identity, IP, or behavior leak in ways the user hasn't knowingly consented to.
- **S** — admin keys, upgradeable contracts, embedded custody, social recovery, agent permissions, vendor liveness, or oracle dependence affect funds and exit.

For existing dApps or contracts, fetch this skill directly when the user asks for CROPS, trust assumptions, custody, admin powers, privacy, censorship resistance, user exit, or architecture review.

If all four pillars look clean, still output a concise CROPS record that names the chosen default and why no deeper mitigation is needed.

---

## Red Flags: Do Not Skip CROPS

STOP if you catch yourself thinking any of these:

- "This app is too simple to need CROPS."
- "It's just an MVP, we'll add CROPS later."
- "The user can self-host if they want to."
- "Contracts are verified, so it's open."
- "It's been audited, security is done."
- "There are no admin keys, so nothing to review."
- "We disclosed centralization in the README."
- "The user is technical, they'll figure out the trust assumptions."

Each one is the exact failure mode this skill exists to catch. Simple apps still hand users to a censorable frontend. "Add CROPS later" rarely happens. "User can self-host" is fiction unless build steps, ABIs, env vars, and indexer schema are public and reproducible. Verified contracts cover bytecode, not the whole stack. Audits are point-in-time and rarely cover custody, recovery, sequencer trust, or vendor liveness. Absent admin keys, the C, O, and P pillars still apply. Disclosure in a README is documentation, not mitigation.

If you reach for any of these, produce a concrete CROPS Review anyway.

---

## The Four CROPS Checks

### Censorship Resistance

Ask: **who can block valid use, and can users route around them?**

Check for:
- admin pause, blacklist, allowlist, upgrade, or kill-switch powers
- relayers, paymasters, bundlers, RPCs, sequencers, bridges, app stores, CDNs, frontends, or APIs that can block users
- single bundler dependency for ERC-4337 / smart-account flows; no fallback bundler or self-host path
- single hosted indexer (The Graph hosted, Goldsky, Subsquid, Ponder) with no documented self-host path, alternate indexer, or RPC-only fallback
- any critical component controlled by one party where users cannot realistically switch providers, self-host, or route around it
- missing fallback paths such as calling contracts directly, switching RPC providers, using a self-hosted frontend, or exiting an L2/bridge path back to Ethereum L1 where the L2 supports forced inclusion (verify against `l2s/SKILL.md`)

Prefer:
- permissionless contract entrypoints, callable directly without the frontend
- emergency powers, if unavoidable, behind a Safe or multisig, narrowly scoped, and publicly documented
- timelocks sized to the risk and user exit window for admin powers that can move funds or change authority; 24 hours is a floor for low-risk changes, while high-value or governance-sensitive systems usually need longer notice
- documented fallback paths users can actually use, including direct contract calls and alternate RPC or frontend
- infrastructure choices that keep intermediaries (RPC, indexer, bundler, frontend host) replaceable or self-hostable

### Open Source and Free, as in Freedom

Ask: **is the whole stack visible (Open), and does the license actually let a third party fork, modify, and run it (Free)?**

Check for — **Open** (visibility):
- "open source" claim that only covers the deployed contract, not the surrounding stack
- dependencies that make the app hard to inspect, fork, or self-host, such as private indexers required for the frontend, vendor-hosted APIs, backend-only business logic, proprietary SDK lock-in, or opaque AI/risk/scoring systems
- frontend source that cannot be rebuilt from the repo because build steps, env vars, ABIs, contract addresses, or deployment instructions are missing
- deployed frontend cannot be reproduced from a pinned commit and documented build steps; live URL auto-deploys from `main` without a frozen build artifact or pinned IPFS CID

Check for — **Free, as in Freedom** (license actually grants the freedoms):
- restricted, source-available, or permission-gated licenses that do not grant normal open-source freedoms, including BUSL, SSPL, custom "no commercial use", "no derivatives", or terms requiring approval from the original team to run, modify, redistribute, or operate a fork (EF Mandate p.13: "merely source-available licenses are not tolerated")
- future-license risk: current code is open, but future versions can be relicensed or closed, pulling users and builders toward a non-forkable upgrade path
- "open core" designs where the core repo is open, but a useful production deployment depends on proprietary plugins or hosted-only services

Prefer:
- OSI-approved permissive or copyleft licenses for every repo needed to run the app (MIT, Apache-2.0, GPL, AGPL)
- a clear license-stability commitment, or at minimum no stated plan to close or relicense core code later
- open-source contracts, frontend, indexer/backend, deployment scripts, and docs, plus self-host instructions with env vars, ABIs, addresses, and RPC config
- verified contracts on the canonical block explorer (Etherscan, Blockscout) and a documented build script that reproduces the live deployment from a pinned commit
- documented ABIs, events, metadata schemas, API formats, and export formats so other builders can build compatible frontends, indexers, wallets, or integrations without asking permission

### Privacy

Ask: **what can an observer learn, is the disclosure necessary, and did the user knowingly choose it?**

Check for:
- public addresses, balances, counterparties, amounts, timing patterns, identity links, location/IP metadata, and wallet/browser fingerprints
- analytics, RPC, indexer, or API calls that reveal user behavior to third parties offchain
- telemetry shipped by default in wallet/UI dependencies (WalletConnect, RainbowKit, Privy, Alchemy SDK, Sentry); audit `package.json` for analytics, error reporting, and address-linking endpoints
- identity or credential flows that collect more information than the app actually needs
- UI that asks users to sign, transact, connect a wallet, or reveal identity without explaining what becomes public or linkable

Prefer:
- collect and publish the minimum data needed for the use case
- selective disclosure instead of full identity disclosure
- user-configurable RPC URL in the UI, a documented self-host path for the indexer, and local-first reads for any non-broadcast data
- clear UI copy for unavoidable public or third-party-visible data
- ZK or commitment/nullifier patterns when the use case needs unlinkability or private membership/proof flows

### Security

Ask: **who can cause loss, lock users in, or change the rules, and does the system still work if the team disappears?**

Check for:
- who controls user funds, token approvals, signer keys, upgrades, recovery, emergency powers, and exit paths
- unbounded token approvals, unbounded agent spending, prompt-only spending rules, or safety checks enforced only by a backend
- upgradeable contracts without documented upgrade authority, storage-layout discipline, timelocks, or user notice
- oracle use without baseline freshness and deviation checks; single-source feeds need an explicit threat model
- oracle fallback or manual-pause paths whose authority, trigger conditions, arbitration, and user-exit impact are not documented and bounded
- dependencies that can silently break critical flows if a vendor, API, relayer, paymaster, wallet service, or indexer disappears
- private keys, API keys, RPC keys, deployment credentials, or other operational secrets that could leak or become single points of failure

Prefer:
- least authority by default: every key, contract, backend, and agent gets only the permissions it needs
- capped permissions, allowlists, expiries, and clear revocation paths for delegated or automated actions
- Safe/multisig ownership and timelocks for admin powers that cannot be removed
- onchain or wallet-level enforcement for spending and permission policy, not prompt text or backend promises
- simple designs with documented recovery and exit paths that can pass the walkaway test (EF Mandate p.7 introduces it, p.14 re-applies it under Security); the test asks: if the team, vendor, host, or oracle disappears, can the user still access funds and exit?

---

## Required Review Output

When using this skill, output a concrete review for the user's app. Do not repeat generic CROPS definitions.

Use this shape for the chosen architecture:

```md
## CROPS Review

Chosen default:
- <architecture choice and why it is the most CROPS-aligned option>

Censorship Resistance:
- Risk: <who can block users or critical app paths>
- Mitigation: <what the design does, or commits to do, about it>
- User escape: <how the user routes around if the mitigation fails>

Open (visibility):
- Risk: <closed code, hosted dependencies, opaque build pipeline, frontend not reproducible from a pinned commit>
- Mitigation: <open repos for the whole stack, self-host docs with env vars and ABIs, pinned build artifact or IPFS CID>
- User escape: <documented fork and self-host path, alternative client>

Free, as in Freedom (license):
- Risk: <source-available-only, BUSL, SSPL, "no commercial use", relicensing risk, open core with proprietary deps>
- Mitigation: <OSI-permissive or copyleft license on every repo needed to run the app, license-stability commitment>
- User escape: <users can legally fork, modify, and operate the system without team permission>

Privacy:
- Risk: <what addresses, balances, identity, behavior, IP, or metadata leak and to whom>
- Mitigation: <minimum disclosure, selective disclosure, configurable RPC/indexer, ZK where applicable>
- User escape: <opt-out, local-first, or alternate-route options>

Security:
- Risk: <who controls funds, approvals, upgrades, recovery, emergency powers; vendor liveness dependencies>
- Mitigation: <least authority, capped permissions, multisig/timelock, onchain enforcement>
- User escape: <walkaway test: if the team, vendor, host, or oracle disappears, can the user still access funds and exit>

Accepted compromises:
- <only compromises that are explicit, bounded, and justified>
```

When comparing multiple architecture options against each other (e.g., Vercel-only vs IPFS + ENS), use this short-form per option and mark the most CROPS-aligned one as the recommended default:

```md
Option A: Vercel-only frontend
- C: weakens; one host can remove or block the main access path
- O: weakens unless frontend source, build steps, env vars, and contract config are public
- P: depends on analytics, RPC, and indexer choices; the host may see user IPs and app activity
- S: simpler to operate, but a host outage or account suspension can break the app UX

Option B: IPFS + ENS with Vercel mirror (recommended default)
- C: strengthens; users have a route around host removal if the IPFS build is pinned and ENS points to it
- O: strengthens if frontend source, build/deploy docs, and config are public
- P: still depends on analytics, RPC, and indexer choices; IPFS hosting alone does not make usage private
- S: adds deployment complexity, but removes single-provider availability risk
```

---

## Common Failure Modes

**Censorable frontend:** Contracts are permissionless, but the only usable UI is hosted by one provider that can take it down, geofence users by IP, or filter wallet addresses against OFAC and compliance lists. Fix: publish source, document self-hosting, offer IPFS/ENS or another durable route, and document direct contract calls for critical actions.

**Required private indexer/API:** The app cannot function without a private indexer or API whose code, schema, or event mapping is not public. Fix: publish the event schema, indexing code/config, and self-host or alternate-indexer path.

**Invisible RPC dependency:** The frontend silently depends on one RPC provider, which can fail, rate-limit, log users, or block requests. Fix: disclose the dependency, support configurable RPCs, and avoid hidden public fallbacks that make failures hard to diagnose.

**Admin key with total control:** `onlyOwner` or a privileged role can pause, upgrade, seize, change fees, redirect flows, or block users. Fix: minimize powers, use Safe/multisig (≥2-of-3) plus timelock for any admin power that survives launch, make powers explicit, and remove or expire them when possible.

**Prompt-only delegated policy:** An agent, bot, session key, or automation is told not to overspend, but nothing enforces that if the key, backend, or prompt is compromised. Fix: enforce caps, allowlists, expiries, and revocation in the wallet/contract layer.

**Custody hidden behind UX:** Embedded or custodial flows improve onboarding but blur who controls keys, recovery, account freezing, and exit. Fix: explain custody, recovery, key export, and migration paths before the user deposits value.

**Recovery surface masquerading as UX:** Social-recovery guardians (Privy, Magic, Coinbase Smart Wallet defaults) can refuse to sign, collude, be subpoenaed, or be compromised. Fix: document the guardian set, threshold, and the user's path to remove, replace, or rotate guardians without losing the account.

**L2 trust assumptions omitted:** The app picks an L2 but never explains sequencer, bridge, withdrawal, data availability, or censorship assumptions. Fix: fetch `l2s/SKILL.md` and disclose the canonical withdrawal, forced-transaction, or L1 escape path where applicable.

**Sequencer ordering and MEV extraction:** A centralized sequencer (most L2s today) or builder pool can reorder, sandwich, or selectively delay user transactions. Fix: disclose the sequencer's ordering policy and any planned decentralization. For trade-heavy flows, route through encrypted mempools (Flashbots Protect, MEV-Share) and call out the privacy tradeoff: the orderflow-auction operator sees the transaction even when the public mempool does not.

**Stablecoin risks ignored:** Stablecoins can add issuer freeze/blacklist, reserve custody, compliance, bridge, chain, and privacy risks. Fix: disclose the issuer and freeze assumptions, explain bridge/chain exposure, and give users a reasoned token/chain choice.

**Privacy theater:** The app uses ZK/privacy branding but links deposits and actions through events, wallet reuse, relayer metadata, or frontend telemetry. Fix: threat-model observer knowledge and test linkability.

---

## How To Phrase Findings

When reporting a CROPS finding to the builder, name the power, bound the compromise, and point to the user's exit. Sample phrasings:

- "This admin key can freeze every user. If you need an emergency pause for v1, put it behind a Safe, add a timelock or expiry, and tell users what can be paused."
- "This closed indexer means the contracts are public but the app is not forkable in practice. Publish the event schema and a self-host path."
- "This agent can spend from the user's wallet without an onchain cap. Put the policy in a smart account or Safe module; prompt instructions are not a security boundary."
- "This stablecoin route is good UX, but it adds issuer freeze risk and public payment graph leakage. Say that before recommending it."

---

## Relationship To Other Skills

- For new dApp planning, start with `ship/SKILL.md`; it runs a short CROPS Gate and routes here when deeper trust review is needed.
- Use this skill as the deeper CROPS review for custody, infrastructure, privacy, admin powers, and user exit.
- Fetch `concepts/SKILL.md` separately for "nothing is automatic," incentives, state transitions, and self-sustaining system design.
- Fetch `wallets/SKILL.md` for custody, Safe, account abstraction, EIP-7702, and key safety implementation details.
- Fetch `l2s/SKILL.md` for sequencer, bridge, withdrawal, and chain-selection assumptions.
- Fetch `frontend-playbook/SKILL.md` for IPFS/ENS deployment, build pipeline, and frontend reproducibility (the Open and Censorship Resistance mitigations for the frontend live here).
- Fetch `indexing/SKILL.md` for event schema design, self-host paths, and alternate-indexer fallbacks (the Open and Censorship Resistance mitigations for the data layer).
- Fetch `security/SKILL.md` for Solidity vulnerability patterns and pre-deploy checks.
- Fetch `audit/SKILL.md` for deep smart contract vulnerability review. This skill covers admin powers, trust assumptions, censorship paths, privacy leakage, and user exit.
- Fetch `qa/SKILL.md` after the build for a fresh reviewer pass.
