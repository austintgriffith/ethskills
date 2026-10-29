---
name: why-project
description: Explain an Ethereum project's design decisions, change history, or regression causes from code, version history, and deployment evidence. Use for why this implementation exists or broke; use why for choosing Ethereum itself.
---

# Project Why

Answer the user's question from the relevant historical and runtime evidence. A current implementation establishes behavior; it does not establish the author's motive. Keep this investigation read-only. Do not edit code, install dependencies, run transactions, or create issues to answer a question.

## Establish the question and identity

Anchor the question to the relevant symbol, behavior, incident or decision, then identify its workspace and revision using [project discovery](../tools/references/project-discovery.md). Inspect only evidence that can affect the answer. For a small rationale question, an introducing diff and its linked review may be sufficient; no panel or broad connector survey is required.

Keep source revision and dirty changes, resolved dependency versions, configuration, hosted release, chain ID, contract/implementation address and incident block separate. Record only the identities relevant to the question. A local artifact, current deployment or current lockfile cannot establish what ran during an earlier incident.

## Follow the lineage

Use blame to locate last-touch commits, then follow introduction and substantive changes with `git log --follow -p -- <path>`, `git show <revision> -- <path>` and focused before/after diffs. Follow renamed files and linked symbols when the change moved. Last touch is a lead, not necessarily the origin or cause.

Read relevant commit messages and referenced PR/issue discussions when accessible. Search connected documents or incident records when a link, identifier, time window or concrete hypothesis makes them relevant. Use [runtime guidance](../tools/references/runtime.md) for tool access; unavailable access is a gap, not evidence that no rationale exists. Never send messages or publish findings as part of this investigation.

For SDK changes, compiler/config changes or deployed-contract failures, read the relevant section of [evidence adapters](references/evidence-adapters.md). Use [tool adapters](../tools/references/tool-adapters.md) for the detected toolchain rather than assuming current examples match historical versions.

## Explain what the evidence supports

Distinguish these claims in ordinary prose:

- **Observed fact:** the cited diff, configuration, log or chain read shows it.
- **Documented rationale:** a contemporaneous source explicitly gives the reason; attribute it to that source.
- **Inference:** evidence suggests a mechanism or motivation; say why and identify material alternatives.
- **Unknown:** the necessary history, deployment identity or observation is missing or contradictory.

For a regression, connect the changed behavior to the failure evidence and consider plausible competing causes. Temporal coincidence or a plausible SDK migration trap alone does not prove root cause. Do not claim reproduction from source inspection. Tests, builds, local services and new artifact files are unnecessary for an explanation unless the requested investigation needs them and they are within scope; otherwise state the remaining evidence needed.

Lead with the answer and cite the decisive commit/path/lines, review or incident evidence inline. Give confidence and limitations where they affect the conclusion. Scale the response to the question; do not require a report template or list every unused evidence source. Follow [evidence scope](../tools/references/evidence.md) when reporting observations, without turning historical inferences into verified behavior.

If this explanation informs a requested change, state the useful constraints: what to preserve, what may change, what to avoid repeating and what risk remains. Hand off to [How](../how/SKILL.md) for a runtime walkthrough, [Teach](../teach/SKILL.md) for a guided lesson, or [Ethskills Pilot](../pilot/SKILL.md) for an authorized implementation workflow; this question alone does not authorize a fix.
