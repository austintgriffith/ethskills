---
name: architect
description: Design Ethereum contract and dApp changes before implementation, grounding caller usage, interfaces, state transitions, incentives and trust assumptions in the existing project. Use for architecture choices and design requests; planning alone does not authorize implementation.
---

# Architect

Produce the smallest viable design that satisfies the requested behavior and integrates with the actual system. A small change may need only a caller example, changed signature and rationale. Do not require competing prototypes, multiple agents or a new architecture document for trivial work.

## Ground the change

Use [project discovery](../tools/references/project-discovery.md) for affected workspaces and [tool adapters](../tools/references/tool-adapters.md) for installed tooling. Follow actual call sites, contract interfaces, generated bindings, events and data consumers. Use [How](../how/SKILL.md) when the surrounding flow needs explanation; do not repeat a completed investigation.

Identify the requested outcome, non-goals and compatibility constraints. Preserve the installed compiler, EVM target, contract libraries, proxy/storage model, framework, client, wallet, indexer and protocol SDK unless changing one is explicitly part of the task. Read [compatibility checks](references/adapters.md) only for implicated boundaries. Unknown versions, authority or deployment identity remain unknown; they block dependent compatibility claims, not independent read-only design.

## Write usage before interfaces

Show the caller's successful journey and meaningful failures before choosing module boundaries. Derive Solidity or TypeScript signatures, units, errors and events from that usage. Keep sketches in the response or an existing authorized design artifact; do not put stub implementations into production files for a planning request.

For each changed state transition identify:

- Starting state, preconditions, caller and required authority.
- Inputs and units, resulting state, emitted evidence and invariant.
- Who submits and pays, why they act, and what happens if nobody acts or a provider disappears.
- Retry, expiry, duplicate and partial-failure behavior where relevant. Distinguish submission, receipt, inner action success, indexer ingestion and UI refresh.

A timestamp is a condition, not an executor. Name the caller or permissionless incentive behind timed work. Make custody, approvals, upgrades, oracle inputs and offchain dependencies explicit where they affect the design.

## Choose a shape

Compare a few structurally meaningful options only when a real tradeoff exists. Include reusing existing contracts or keeping data offchain when that meets the requirements. Do not invent alternatives to satisfy a quota. [Arena](../arena/SKILL.md) can help with a requested or genuinely useful broader comparison; it is not a prerequisite.

Apply [CROPS](../crops/SKILL.md) to dApp architecture and relevant trust choices: name each option's censorship, source/license, privacy and security effects. Select a default, explain accepted compromises and give a usable user escape path. A low-risk change can use the concise CROPS record; missing owner, license or exit evidence is an unresolved fact, not a clean result.

Select the smallest public surface that hides the necessary complexity. Explain the decisive tradeoff using the actual caller and constraints, rather than listing technologies. Do not claim current costs, deployed addresses, chain capabilities or SDK behavior from memory; establish relevant facts from installed sources, read-only observations or matching authoritative documentation.

## Reconcile and hand off

Deliver one coherent design: usage, interfaces, responsibilities, transitions/invariants, compatibility, chosen option/CROPS compromises, unresolved facts and verification plan. Use the [design template](references/design-template.md) when it helps; omit irrelevant sections.

For each material uncertainty name a hypothesis, an observable falsifier and the cheapest authorized check. Identify the command or observation, environment and expected result. Apply [evidence rules](../tools/references/evidence.md): a proposed check is not a passing check. [Verify](../verify/SKILL.md) can execute scoped checks when requested or already authorized. Use [runtime guidance](../tools/references/runtime.md) for available tools and mutation boundaries.

Planning does not authorize source changes, installation, prototypes, database migrations, signing, deployment or publishing. Continue implementation only within the user's existing authorized scope. Preserve the design as the shared contract during authorized implementation: reconcile accepted interface and behavior deviations in that same artifact, with their acceptance source. Repeated independent workarounds around the same boundary are a signal to revisit the shape. A local naming change is not.

Stop short of declaring the design ready for implementation when a missing fact could change funds authority, storage compatibility or a required interface. Name that dependency and continue unaffected work. Report what was designed, what evidence supports it and what remains unverified; architecture is not an audit or deployment proof.
