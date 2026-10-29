---
name: help
description: Answer questions about Ethskills Pilot setup, available capabilities, and which ethskills workflow to use, with source links and a ready-to-send prompt. Use for help choosing or invoking skills; direct requests to perform work belong to the relevant skill or ethskills:pilot.
---

# Ethskills Pilot help

Answer the capability or setup question, cite the source that owns the answer, and give one prompt the user can send. Do not run that prompt. “Which skill audits this contract?” is help; “audit this contract” requests work and belongs to [audit](../audit/SKILL.md) or [Ethskills Pilot](../pilot/SKILL.md).

## Find the answer

Infer the need from the message and session context. Ask one focused question only when the missing distinction changes the answer. A help question does not authorize a full repository scan.

Read the relevant owning skill before recommending it. Start with the [root index](https://ethskills.com/SKILL.md) for Ethereum topics and the routing table below for engineering workflows. The installed source and applicable workspace instructions determine what this installation can do; an upstream description alone does not establish availability.

For setup, invocation syntax, model selection, agents, or browser/tool access, read [runtime guidance](../tools/references/runtime.md) and, when needed, [tool adapters](../tools/references/tool-adapters.md). Inspect only the runtime metadata or configuration that changes the answer. Do not invent slash commands, routing hooks, supported model overrides, or automatic skill loading. If the runtime cannot invoke a named skill directly, give a natural-language prompt naming its installed path.

When project facts matter, follow [project discovery](../tools/references/project-discovery.md) selectively: identify the relevant workspace, package manager, resolved dependencies, plugins, configuration, and executable versions. For example, testing advice for Hardhat 2 with ethers v5 must use that combination's sources and scripts, not a Hardhat 3 or ethers v6 recipe. Consult matching installed help/source or official versioned documentation when details remain uncertain. Do not install or migrate to make a recipe fit. For hosted-app questions, discover the requested target from the user or project evidence; never assume localhost or a port.

## Say what is actually available

Use these distinctions when they affect the answer:

| State | What establishes it |
|---|---|
| Documented | A source describes the capability. This may describe another version or runtime. |
| Installed | The skill, dependency, or integration exists in this environment. |
| Callable | The current runtime exposes a usable invocation or tool. |
| Authenticated | Evidence shows the integration has access to the required account or resource. Configuration alone is insufficient. |
| Authorized | The user's request or existing session permission covers the specific action and target. Authentication alone is insufficient. |

A configured explorer does not prove a callable, authenticated explorer tool. A browser does not prove wallet signing works. Report unknown states as unknown; do not probe accounts, sign, or make chain calls merely to answer help. Explain verification limits using the scopes in [evidence guidance](../tools/references/evidence.md): a green build, browser observation, wallet interaction, and confirmed onchain state prove different things.

## Choose the owner

This table locates sources; read the chosen source for its actual behavior and boundaries. If a listed source is absent, say it is unavailable in this installation rather than promising its behavior.

| Question or desired next task | Source to read |
|---|---|
| Route an implementation or other engineering task | [Ethskills Pilot](../pilot/SKILL.md) |
| Explain current code or find where behavior lives | [How](../how/SKILL.md) |
| Explain a design decision or value's origin | [Project Why](../why-project/SKILL.md) |
| Teach a subsystem or change in plain language | [Teach](../teach/SKILL.md) |
| Settle interfaces and architecture | [Architect](../architect/SKILL.md) |
| Compare independent attempts at the same brief | [Arena](../arena/SKILL.md) |
| Split independent work among agents | [Swarm](../swarm/SKILL.md) |
| Review an engineering change | [Review](../review/SKILL.md) |
| Fix a behavior with a failing test first | [TDD](../tdd/SKILL.md) |
| Execute checks and collect evidence | [Verify](../verify/SKILL.md) |
| Investigate consequences outside a diff | [Blast Radius](../blast-radius/SKILL.md) |
| Turn a completed run's lessons into improvements | [Reflect](../reflect/SKILL.md) |
| Correct a recurring agent mistake | [Correct](../correct/SKILL.md) |
| Keep a reviewable task decision and evidence log | [Trace](../trace/SKILL.md) |
| Build a dApp through deployment phases | [Ethskills Pilot](../pilot/SKILL.md), using [ship](../ship/SKILL.md) for phase coverage |
| Assess censorship resistance, freedom, privacy, and security | [crops](../crops/SKILL.md) |
| Audit EVM contracts for vulnerabilities | [audit](../audit/SKILL.md) |
| Learn defensive Solidity patterns | [security](../security/SKILL.md) |
| Choose contract-test techniques or framework adapters | [testing](../testing/SKILL.md) |
| Independently assess a finished dApp | [qa](../qa/SKILL.md) |
| Find chain, protocol, wallet, frontend, or indexing guidance | [root topic index](https://ethskills.com/SKILL.md) |

Keep close calls explicit: `how` explains present behavior; `why-project` investigates reasons. `review` reviews a change; `audit` supplies specialized EVM security methodology; `security` teaches defensive construction. `verify` executes checks; `testing` supplies testing techniques; `qa` independently assesses applicable behavior. Ethereum's [why](../why/SKILL.md) topic explains the choice of Ethereum, not a repository's design history.

## Reply and stop

Lead with the answer and cite the exact installed file or section supporting it. Link a public counterpart only when it is known to exist and matches the relevant version; do not imply new local skills are already published. For changed or uncertain APIs, cite the matching authoritative documentation and identify any unresolved version limits.

Give at most one ready-to-send prompt in a code block. Adapt it to the user's goal, known target and runtime. Include an observable acceptance condition and material scope constraints. Preserve unknown targets as explicit placeholders; do not fill in invented addresses, networks, URLs, or versions. For example, after reading the audit source, a help answer might prepare:

```text
Use audit to assess <contract path or verified deployment> on <network, if applicable>. Report reproducible findings with affected code and impact, and distinguish confirmed issues from unverified hypotheses. Keep the review read-only; do not file issues or send transactions.
```

Do not audit, run tests, edit files, install packages, call chains, sign, deploy, create issues, or publish during help. If the user requests execution, hand the request to the relevant owning skill under the user's existing authorization; help itself adds no execution permission.
