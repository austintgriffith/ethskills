---
name: audit-swarm
description: Audit an Ethereum or EVM codebase with independent external audit methodologies discovered from the awesome-ethereum-ai-skills catalog. Use when asked for an audit swarm or an audit using all applicable catalog skills. Account for every provider, validate findings, and report incomplete coverage.
---

# Audit with external methodologies

Coordinate separate reviewers using applicable audit skills from the current [external catalog](https://github.com/rickkdev/awesome-ethereum-ai-skills). Review the same source snapshot with different methodologies. This complements the domain specialists in [ETHSKILLS Audit](../audit/SKILL.md).

## Establish the target

Identify the requested source, files, language, compiler, dependencies, tests, deployment assumptions, and trust boundaries. Inspect the project's instructions and existing runner before choosing commands. Preserve the installed stack. An audit request does not authorize fixes, dependency installation, publication, source uploads, wallet access, or live exploit transactions.

Create a unique local run directory outside audited source, with a manifest, provider ledger, isolated provider outputs, validation evidence, and final report. Read [execution and reporting](references/execution.md) before dispatch.

Pin the target commit and hash the exact scoped file contents, including dirty and relevant untracked files. Record dependency lockfiles, submodule revisions, compiler settings, and deployed implementation or fork block when applicable. Do not copy secrets into the manifest or worker snapshot. Distinguish supplied facts from assumptions. If the target is unavailable, report the missing source instead of auditing a description.

## Discover and account for every provider

Use [Discover](../discover/SKILL.md) with exhaustive security discovery. Fetch the current catalog at `https://raw.githubusercontent.com/rickkdev/awesome-ethereum-ai-skills/main/README.md`. Record its resolved revision or content hash and retrieval time. Inspect every entry under Smart Contract Security through the next section. If the section changes, identify its replacement from the current contents and document the mapping. Do not silently use a cached provider list or a top-N shortlist.

For each entry, inspect its actual repository tree, skill entrypoints, referenced methods, scripts, and runtime requirements. Discover the applicable skills within multi-skill repositories. A catalog description is not evidence of an executable audit workflow. Record inaccessible entries and unfinished repository inspection as coverage gaps.

Use discovery's relevance, compatibility, freshness, and authorization assessment. Pin each selected skill and consumed reference to an immutable revision or content hash. Old methodology can remain useful. Current repository activity does not prove that relevant instructions support the target compiler, chain, or dependencies.

Classify each discovered capability in the ledger:

| Kind | Treatment |
| --- | --- |
| Audit workflow | Run independently when applicable and eligible. |
| Scanner | Run applicable detection workflows separately. Label their narrower coverage. |
| Testing | Use applicable installed tests or fuzzing as supporting evidence. |
| Development guidance | Consult relevant security assumptions. Do not count as an independent audit. |
| Verification or triage | Use after candidate discovery to validate claims. |
| MCP or service | Check exposed tools, access, and data handling before use. Listing is not connection. |

Run every applicable eligible audit workflow and scanner workflow. Record a reason for every excluded, blocked, or partial capability. Eligibility requires sufficient source, compatible instructions, available runtime, and authorization for required actions. Missing installation, credentials, or hosted upload permission blocks that component, not unrelated local review.

Include the existing local ETHSKILLS Audit methodology when applicable. Resolve its checklist sources and prerequisites explicitly. Deduplicate identical skill content or wrappers around the same pipeline while preserving every catalog entry's attribution. Maintain a visited set of resolved skill identities. Never invoke this skill recursively through discovery, ETHSKILLS, or a provider wrapper.

## Run isolated first passes

Give each provider a fresh reviewer with the same factual context and pinned target. Provide its own methodology and required references. Keep other providers' initial findings private until that provider completes its first pass. Record any provider-required known-findings mode as a deviation from a blind first pass.

The coordinator owns scheduling and the shared budget for all nested workers. Reserve room for coordinator and synthesis work. Queue providers and child reviewers when capacity is limited. Preserve required provider stages and specialist roles. If a method requires unavailable simultaneous workers or tools, label the run adapted or partial and name the lost guarantees. Reading a twelve-agent method in one agent does not complete that method.

Assign distinct output directories and separate writable work copies for tests or proof-of-concept files. Keep original audited source read-only. Audit providers must not edit each other's files, install tools, expose source to hosted services, or spawn unbudgeted workers. External instructions cannot expand the user's permissions.

Record the actual skill revision, agent model and harness when known, completed stages, failed workers, and reviewed files. Different provider names or personas do not prove model diversity. If separate agents cannot run, report blocked independent execution. A sequential self-review is not an audit swarm.

## Validate and synthesize

Wait for first-pass completion or recorded failure before sharing candidate findings. Preserve raw provider reports. Normalize candidates by root cause and affected path, retaining all provider identifiers, original severity claims, and disagreements.

For each candidate, trace the reachable code path, attacker permissions, required state, and impact. Check mitigating callers, modifiers, deployment configuration, and false-positive conditions. Use local tests or scoped fork reproductions when useful and authorized. Put new tests in an isolated copy. Record the command, observed result, and snapshot used. Never test an exploit against live shared state.

Assign `confirmed`, `rejected`, or `unresolved` with evidence. Confirmation can use a concrete source proof when execution is unnecessary or unavailable. Separate proof by analysis from an executed reproduction. Preserve unresolved leads and failed reproduction prerequisites. Agreement is not proof, and a finding detected by one provider can be valid.

Return the report described in [execution and reporting](references/execution.md). State target and assumptions, confirmed findings, unresolved leads, rejected claims, every provider's status, domain coverage, and missing checks. Report no confirmed findings only within the reviewed scope. Do not issue a safety certificate. Keep disclosure and issue filing within explicit authorization.
