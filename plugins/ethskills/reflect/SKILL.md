---
name: reflect
description: Turn completed Ethereum engineering task evidence into scoped lesson proposals and evaluate proposed skill changes. Use when asked to reflect on a task; reflection alone does not authorize edits or feedback submission.
---

# Reflect

Find lessons that would change a future agent's decisions. Start with a digest of the completed task, not a search through private conversation history. Skip trivial work and guidance already covered and followed correctly.

## Ground the lesson

Use the current task context or a user-supplied digest: request, corrections, actions, observations and files touched. Consult only evidence needed to resolve a candidate lesson. Do not scan other sessions or projects for transcripts. Redact credentials, private proof inputs, signatures granting authority and unrelated personal data before recording or sharing evidence.

Reuse the relevant [project profile](../tools/references/project-discovery.md); refresh only facts implicated by the lesson. Select operations with [tool adapters](../tools/references/tool-adapters.md) and the available [runtime](../tools/references/runtime.md). Record actual source revision and dirty changes, resolved dependencies, executable versions, configuration and command results. Missing evidence stays unknown.

Bind claims to [their observed scope](../tools/references/evidence.md). Tests, browser actions, wallet signing, receipts and state changes establish different things. A mocked wallet cannot demonstrate real signing; a local fix cannot establish hosted-build parity. Reuse an existing [Trace](../trace/SKILL.md) task record when available.

## Decide what deserves a proposal

For each candidate, locate the owning instruction and compare it with the evidence. Read [lesson-evidence.md](references/lesson-evidence.md) when preparing a proposed patch or evaluation.

- **General lesson:** evidence supports behavior beyond one adapter. State the demonstrated scope rather than assuming universality.
- **Version or adapter issue:** attach the resolved tool/plugin/client combination and relevant configuration. Prefer a narrow correction in the owning reference; do not prescribe migration to another stack.
- **Human teaching:** retain material needed to explain the task accurately, using the bar in [CONTRIBUTING.md](../CONTRIBUTING.md).
- **Already covered:** distinguish a missed trigger or skipped instruction from incorrect content. Improve routing or compress a reminder only when evidence supports it.
- **Unsupported:** keep a single anecdote as a hypothesis pending reproduction. Reject claims contradicted by evidence; do not manufacture a rule to fill the report.

A lint rule, test, configuration constraint or runtime check may prevent a recurring mistake better than another paragraph. Route that proposal to [Correct](../correct/SKILL.md), preserving the evidence and the task's authorization.

## Test the proposed instruction

Follow [CONTRIBUTING.md](../CONTRIBUTING.md): use the same realistic, non-leading task for a fresh stock-model baseline with no tools/skills/web, the current instructions and the proposed patch. Give current/proposed runs equivalent tools and isolated starting state. Keep the proposed patch outside active skills until an edit is authorized. Inspect outputs, loaded references and observable behavior rather than accepting self-reports.

Record model and harness when known, input/source versions, repetitions, failures and evidence paths. Repeat enough to distinguish an anecdote from a consistent failure; disclose the actual counts. Use targeted version/configuration cases before widening a claim. An unavailable evaluation remains unexecuted, and packaging checks do not prove improvement.

Apply the contribution triage: verified blind spot → keep; necessary human teaching → keep; knows but skips → compress; does naturally without teaching value → cut. Do not claim improvement without a measured current/proposed comparison.

## Return a reviewable result

Present only material candidates:

- **Accepted proposals:** exact target and proposed diff, demonstrated scope, evidence, evaluation result and remaining limits.
- **Rejected:** candidate and the evidence or existing coverage that makes it unnecessary.
- **Backlog:** unresolved hypothesis, missing reproduction/evaluation or a structural fix, with the next useful check.

Reflection does not silently edit skills, file backlog issues or send feedback. Apply edits already explicitly requested within their authorized scope; do not ask again for existing authorization. Otherwise present the proposal for selection before editing. External submission needs its own authorization; use the [feedback workflow](../feedback/SKILL.md) only when submission is requested or authorized.

After authorized edits, validate metadata and local links, run applicable targeted checks and report what was actually tested. Separate “proposal drafted,” “edit applied” and “behavioral improvement demonstrated.”
