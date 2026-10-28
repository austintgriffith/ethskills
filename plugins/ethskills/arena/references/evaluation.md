# Evaluate evidence before choosing a base

Use a small criterion table: criterion, required/optional, candidate result, evidence and limitation. Apply the shared [evidence statuses](../../tools/references/evidence.md): `PASS`, `FAIL`, `BLOCKED`, `NOT APPLICABLE`. Separate observed results from source-level reasoning and untested predictions. A candidate's rationale is not verification evidence.

Behavior/security failures disqualify a candidate from a passing recommendation. A required blocked check prevents a completion claim. Optional missing measurements remain limitations rather than invented scores. Do not rank by line count, confidence of prose, benchmark cherry-picking or an aggregate score that masks failed requirements.

## What changes the choice

- **Behavior:** common acceptance paths, boundaries and failure/recovery behavior. Exercise the same workload across candidates; extra candidate-specific tests may expose useful differences.
- **Security/economics:** task-relevant access control, asset conservation, decimals/rounding, oracle assumptions, signature/replay or upgrade boundaries. Use existing security/testing guidance as relevant, without claiming an audit from a bakeoff.
- **CROPS:** compare actual dependencies and trust boundaries. Name operators who can censor, privileged powers, source/license restrictions, private data exposure and failure/exit paths. An accepted compromise is an explicit decision, not a hidden numerical penalty.
- **Maintainability:** coherent interfaces, existing dependency fit and complexity needed to preserve invariants. Prefer a simpler passing approach when additional machinery buys no demonstrated requirement.
- **Cost/performance:** use the comparability gate below before any numerical ranking.

## Comparability gate

For gas, match source-independent compiler version, optimizer settings, EVM target/hardfork, chain and pinned block/hash, transaction calldata/value, caller role and balance, initial storage/allowances/nonces, fixture, seed, and measurement method. Distinguish cold/warm storage, deployment gas, execution gas, receipt gas used and fee paid. Gas units do not establish a USD cost; network fees and token prices require separately verified inputs.

For runtime/UX performance, also match machine/runtime, data volume, service/indexer readiness, workload, cache/warmup policy and sampling method. Record sample counts and variation where timing noise affects the choice. Avoid running competing benchmarks simultaneously on shared constrained hardware when contention distorts the comparison.

If inputs differ, rerun with matched conditions or label results non-comparable and withhold the numerical winner. If configuration itself is the experiment, identify every varied factor and narrow the claim accordingly. Do not combine isolated microbenchmarks into an unsupported end-to-end speedup claim.

## Synthesis record

Keep the note proportional to the task. Include the common baseline/manifest, candidate artifacts, mode and actual runner identities where known, criterion results, base choice and judge disagreement if any. Name each graft's source and purpose, rejected ideas, convergence/dropouts and accepted trust compromises. Bind final verification to the combined source, not a former candidate. Preserve links to commands/results without credentials or sensitive wallet material.
