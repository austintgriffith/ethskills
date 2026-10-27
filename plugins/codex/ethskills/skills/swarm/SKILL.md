---
name: swarm
description: Partition independent Ethereum engineering work across available agents with exclusive ownership, dependency gates, isolated state and consolidated evidence. Use for parallel slices; use Arena to compare competing approaches to the same task.
---

# Swarm

Divide an authorized goal into independently owned slices and return one integrated result. Parallelism is useful only where the dependency graph permits it; a small task can stay with one agent. Competing implementations of one brief belong in [Arena](../arena/SKILL.md).

## Frame the work

1. State the requested outcome, acceptance criteria and authorized write scope. A read-only inquiry remains read-only. Building locally does not authorize live signing, broadcasting, deploying, shared database writes, publishing, issue disclosure or PR actions. Reuse explicit session authorization when it already covers an operation.
2. Use [project discovery](../tools/references/project-discovery.md) to identify each affected workspace, source revision and relevant dirty changes. Preserve existing commands and dependencies. Apply [tool adapters](../tools/references/tool-adapters.md) per workspace: record resolved Foundry or Hardhat version, runner/plugins, compiler/profile, actual client and indexer versions, generators and relevant configuration. A monorepo can require different adapters in different packages.
3. Draw the smallest useful dependency graph. For each slice name its inputs, exclusive writable paths or worktree, forbidden paths, outputs, acceptance checks and dependencies. Assign one integrator to shared configuration, lockfiles and overlapping changes. Workers request a handoff for shared edits rather than editing the same files concurrently.

A useful Ethereum split is contract/interface generation → frontend and indexer integration → cross-layer verification. An independent behavioral-test slice can prepare cases earlier, but execution against changed artifacts waits for those artifacts. Do not enforce this shape on projects with different dependencies.

## Gate interface consumers

Give one owner authority over the contract interface and generated ABI/types. Before consumers start, record the agreed ABI or interface snapshot, event signatures, source revision/dirty fingerprint, generator command/version and artifact hash. Include chain, deployment address and implementation identity where relevant; an interface snapshot alone does not prove deployment parity.

Frontend and indexer workers may prototype against the agreed snapshot and label that evidence provisional. Contract checks and canonical generation must complete before real integration uses their output. Publish one artifact set, then let consumers generate their own explicitly owned bindings or schemas in dependency order. Do not let several workers regenerate shared outputs or rewrite a shared lockfile.

An ABI, event, deployment or generator change invalidates affected consumer evidence. Notify dependents, publish the replacement fingerprint, rebuild affected bindings/mappings and rerun the impacted checks. Source-only contracts and hosted contracts remain distinct until their identity is established.

## Dispatch within actual capacity

Discover agent availability and host rules through the [runtime reference](../tools/references/runtime.md). Inherit configured models and runtime defaults unless the user or applicable project instructions select them. Do not hardcode a vendor, model, worker count or mandatory fanout.

Queue dependency-ready slices within the currently available capacity. Each worker brief must stand alone:

- Goal and acceptance criteria; exact workspace, revision/dirty baseline and input artifact fingerprints.
- Exclusive file/worktree ownership, allowed operations and explicit dependency gates.
- Existing commands, detected versions/configuration, assigned state resources and verification expectations.
- Required result: changes or findings, assertion evidence, unresolved gaps and resources/processes started.

Workers return ownership conflicts and changed assumptions to the coordinator; they do not recursively delegate. If dispatch is rejected, stop further dispatch until capacity is re-established instead of retrying in a loop. Queue work or perform eligible slices sequentially and disclose that fallback. A required independent review stays blocked without an independent reviewer; self-review does not satisfy it.

Before running mutable checks, apply [state isolation](references/isolation.md). Worktrees isolate files, not nodes, wallets, browser sessions or databases.

## Integrate and report

Read each terminal result and inspect the actual artifacts or diff before integration. Accept a worker result only within its recorded source, version, interface and environment scope. Missing fingerprints, commands or observations require a targeted follow-up; if unresolved, record a gap rather than accepting an unsupported pass. A dropped worker leaves its required slice uncovered until reassigned and verified.

Integrate in dependency order using the project's existing workflow. Preserve unrelated dirty work. Recheck affected acceptance criteria on the final combined source; isolated worker passes do not prove the combined application works. Use [Verify](../verify/SKILL.md) for applicable contract/integration/browser execution and [Review](../review/SKILL.md) when a change review is requested or required. Neither adds permission for external writes.

Use the shared [evidence contract](../tools/references/evidence.md). Worker summaries may say PASS, ISSUES or BLOCKED, but each material assertion uses PASS, FAIL, BLOCKED or NOT APPLICABLE with actual observations. Consolidate into one concise result:

| Slice / owner | Final source and interface | Checks and evidence | Status / gaps |
|---|---|---|---|
| Actual slice | Revision plus dirty fingerprint; relevant artifact hash | Working directory, redacted command/tool version, observed outcome and artifact path | Applicable assertion status and missing proof |

Explain proven issues, incomplete slices and stale evidence. Name unavailable browser, signer, archive RPC or database capabilities; distinguish optional limitations from required blocked gates. Record observed URL/build identity, chain/block and receipt/state evidence when applicable. Label mocked wallets, simulated transactions and unproven local-to-host parity. Finish with the integrated outcome and remaining work, not raw worker transcripts. Reuse an existing [Trace](../trace/SKILL.md) log when present.
