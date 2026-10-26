---
name: arena
description: Compare competing approaches to the same Ethereum task, choose a base, combine justified improvements and verify the result. Use for an implementation bakeoff or alternative solutions; use Architect for design advice without competing artifacts.
---

# Compare approaches to one task

Produce a coherent result from competing solutions, with evidence for the choice. Candidates solve the same task; splitting different features among workers belongs to [Swarm](../swarm/SKILL.md). For architecture comparison without implementations, use [Architect](../architect/SKILL.md).

Scale the exercise to the decision. Compare only meaningful alternatives, with a time/cost budget appropriate to the task. There is no fixed candidate count or required model fanout. A request to compare or explain alone does not authorize editing production source.

## Frame the comparison

Use [project discovery](../tools/references/project-discovery.md), the shared [tool adapters](../tools/references/tool-adapters.md) and [runtime rules](../tools/references/runtime.md). Discover callable agent capacity; do not infer it from installed packages or require a particular vendor/model. Preserve user-selected runners and existing dependencies.

State the common task, artifact, permitted changes, acceptance criteria and budget. Give candidates the same baseline and requirements. Name the meaningful difference between approaches, rather than producing cosmetic variants. Fix the rubric before seeing results:

- Required behavior and meaningful failure paths.
- Security, authorization and economic invariants relevant to the task.
- CROPS impact: censorship resistance, open source and freedom, privacy, security. Load [CROPS](../crops/SKILL.md) for dApp architecture or trust-boundary decisions.
- Maintainability and fit with the existing stack.
- Gas or performance only when relevant and measured under matched conditions.

Freeze a small environment manifest: source revision plus relevant dirty changes, workspace, dependency resolutions, executable/compiler versions, optimizer/EVM settings, fork provenance/block hash, fixtures, seed and input data. Do not silently upgrade a candidate's stack to make it work. A deliberate configuration change is a separate experimental variable and cannot support an implementation-only performance claim.

## Explore in isolation

Read [isolation and adapters](references/adapters.md) before running candidates. Allocate exclusive writable paths, preferably separate worktrees. Preserve the same starting changes in every candidate without altering the user's original worktree. Use distinct nodes, ports, temporary wallets, browser profiles, databases and indexer namespaces wherever candidates mutate state. Pin the same fork block and initial data; never share a live signer or reset a shared service.

Dispatch only available, authorized agents. Each receives the task, baseline manifest, owned paths/state, permitted commands and a request for an artifact plus rationale. Track ownership and process handles. A failed runner is a recorded dropout; do not disguise missing work as another candidate. Avoid nested fanout without need and authorization.

When agents are unavailable or disproportionate, explore sequentially in separate snapshots. Label this **sequential exploration by one agent**. It supplies alternatives, not independent review or model diversity. If only one viable artifact remains, report the reduced comparison.

## Judge, choose and combine

Freeze candidate artifacts before judging. Read every viable candidate and assess each rubric criterion using [evaluation rules](references/evaluation.md) and [evidence rules](../tools/references/evidence.md). Keep baseline defects distinct from candidate regressions. Where an independent judge is available and useful, give it frozen candidates, the common task, manifest and rubric with read-only access. Resolve disagreements against evidence; do not average scores to hide a failed invariant.

Choose the base that meets required behavior/security gates and supports the task with the least unnecessary complexity. Gas savings never redeem broken authorization, unsafe pricing, lost privacy or incorrect behavior. If all candidates fail, there is no passing winner: correct or reframe the relevant approach within scope and verify it.

Inspect other candidates for specific improvements worth adapting. Record the source and reason for each graft, and rejected alternatives. Integrate deliberately into one model; no graft is required when candidates converge or additions do not help. State accepted CROPS compromises, the chosen default and the user's escape path where applicable.

## Verify the synthesis

Use [Verify](../verify/SKILL.md) for relevant checks against the combined artifact. Reusing passing candidate results is insufficient after integration. Rerun affected behavior/security checks, and any claimed gas/performance comparison, on the final source and matched baseline. Capture browser journeys for changed UX when supported; missing browser coverage stays unverified.

A required independent security/release review remains blocked without an independent reviewer. Self-review, sequential alternatives and ordinary candidate judging do not automatically satisfy it. Continue safe checks and report the missing gate.

Deliver the artifact or recommendation with a concise synthesis note: candidate identities/revisions, execution mode, rubric results and evidence, chosen base, graft provenance, rejected tradeoffs, dropouts, final verification and limits. Include actual commands and environment evidence for measurements. Do not imply an audit or exercised adapter support from a written procedure alone.

Stop only owned processes and clean only disposable state created by this run, preserving evidence. Comparison does not authorize live transactions, dependency installs/upgrades, deployments, PRs, issue disclosure or publication; use existing session authorization for any such next action.
