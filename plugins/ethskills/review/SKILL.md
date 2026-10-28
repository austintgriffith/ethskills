---
name: review
description: Review engineering designs and code changes for correctness, integration risks, and maintainability using actual source, dependency versions, and deployment scope. Use for a review or adversarial challenge; a specialist contract audit and finished-app browser QA have separate scopes.
---

# Review

Produce a read-only, evidence-backed judgment about a design or change. Review questions do not authorize fixes. If fixes are explicitly requested, keep review findings separate from the resulting edits and verify the changed revision before concluding.

## Establish the review target

Use [project discovery](../tools/references/project-discovery.md) for each affected workspace. State the intended behavior from the request and available specification, then identify the actual scope:

- For a diff, record the base and head revisions, the merge base when relevant, and the fingerprint of relevant staged, unstaged and untracked source changes. Do not assume `main` is the base or omit dirty changes. Treat binary/generated artifacts according to their provenance rather than silently dropping them.
- For a design, identify its version or content fingerprint, assumptions, constraints and interfaces. Separate defects in the proposed design from unknown implementation details.
- For deployed behavior, identify the target chain, address, implementation and release/build revision where evidence establishes them. Source, hosted application and deployed bytecode identities are separate claims. Unproven parity stays unknown.

Proceed with an explicitly bounded interpretation when intent is recoverable; clarify a material ambiguity before judging dependent behavior. A full repository scan or panel is unnecessary for a narrow change.

## Ground the analysis

Read the changed source with its callers, implementations and relevant tests. Trace behavior across the boundaries the change actually crosses: ABI and storage, authorization, events, generated bindings, SDK calls, wallet receipt handling, indexer ingestion and frontend cache state. Consider failure paths and the actors needed to trigger state transitions. Do not infer end-to-end correctness from one layer's success.

Select tools through [tool adapters](../tools/references/tool-adapters.md). Establish resolved dependencies and installed APIs before recommending code: Solidity compiler/EVM settings, OpenZeppelin imports, Foundry version or Hardhat major and registered plugins, relevant client/wallet/indexer versions. Inspect installed sources/types or version-matched official documentation when an API is uncertain. Missing version evidence limits confidence; it is not permission to assume the newest release or propose a migration.

Use relevant topic skills for changed behavior, not an automatic checklist dump. Ethereum security concerns can require [Security](../security/SKILL.md) guidance or a scoped [Audit](../audit/SKILL.md). Architecture and trust compromises can call for [CROPS](../crops/SKILL.md). Keep these scopes distinct:

| Workflow | Establishes |
|---|---|
| This review | Findings about the identified design/change and its affected integrations. |
| Specialist audit | Deeper domain-specific investigation of contracts and exploit assumptions; a review does not substitute for it. |
| Security guidance | Defensive patterns applied to the actual compiler, dependencies and trust model. |
| [Verify](../verify/SKILL.md) | Executed checks with scoped evidence. |
| [QA](../qa/SKILL.md) | Independent assessment of applicable finished-app behavior; code review alone does not establish it. |

## Reproduce and challenge

Inspect scripts and use [runtime boundaries](../tools/references/runtime.md) before executing checks. Prefer existing targeted tests, typechecks and compatible installed analyzers in an isolated local environment. Preserve compiler, runner, profiles and dependency resolutions. No silent installs, upgrades, broadcasts, shared database resets, deployments, issue filing or external disclosure.

A useful finding identifies a concrete failure path, impact and preconditions. Reproduce it with an existing test or a temporary isolated harness where practical; read-only review does not authorize modifying the project's tests or source. Record the command, version, selected tests, actual result and limitations using [evidence rules](../tools/references/evidence.md). For fork-dependent claims, capture chain, block and RPC provenance without secrets. A failing tool invocation or zero selected tests proves no behavioral result. An incompatible analyzer is unavailable evidence.

Scale challenge to risk and actual authorized capacity. A single reviewer can complete an ordinary review. For a broad, security-sensitive or explicitly adversarial review, independent reviewers can examine correctness, security or integration assumptions, with the same pinned target and intent. Use available authorized models/tools; no fixed vendor or panel count. Assign read-only scope, preserve independent initial judgments and reconcile disagreements against source and reproductions. Do not count votes as proof or present assigned personas as model diversity. If independent review is required by the request or a release gate and unavailable, mark that gate **BLOCKED**; the author's self-review cannot substitute.

## Deliver a judgment

Use [the report guidance](references/report.md) to filter and prioritize findings. Include precise source locations, impact-based severity, preconditions, evidence and a minimal remedy. Clearly label unconfirmed hypotheses and material coverage gaps. Dismiss incorrect or version-inapplicable advice with reasons instead of padding the report with noise.

Before the verdict, recheck the relevant source revision and dirty fingerprint, design version, and any deployment identity that supports conclusions. Changes invalidate affected findings or checks: rerun/review them, or explicitly withhold a current-target verdict. Report what was actually reviewed and executed; no findings is a bounded result, not a safety certification.
