# Execute and report an audit swarm

## Record one shared manifest

Use one run identifier and one frozen source snapshot for every provider. Store these fields in a local manifest:

| Field | Required content |
| --- | --- |
| Target | Repository or supplied source identity, base commit, scope paths, per-file hashes, dirty diff fingerprint, relevant untracked hashes. |
| Dependencies | Lockfile hashes, installed versions, submodule revisions, compiler and build settings. |
| Environment | Local runner, available analyzers, actual subagent capacity, host and model information when known. |
| Assumptions | Roles, privileged actors, external protocols, chain, implementation address, fork block, and unknowns. |
| Authorization | Permitted local writes, commands, network reads, disclosures, installations, and live actions. |
| Discovery | Catalog URL, revision or hash, retrieval time, discovered security section, provider inspection failures. |

Hash exact file bytes. A commit SHA alone does not identify dirty source. A normal git worktree from the base commit omits dirty and untracked changes. Materialize those scoped changes into each isolated copy without changing the user's checkout, then compare its manifest hashes. If files change during review, retain the pinned copy or start a separately identified run. Never silently combine revisions.

## Maintain a complete provider ledger

Create a row for every catalog security entry. Add child rows for its discovered applicable skill capabilities. Record parent entry, repository, resolved skill path, kind, source revision, consumed reference hashes, freshness evidence, target applicability, required actions, status, and reason. An entry with no audit workflow still needs a row. Record whether tree inspection was complete.

Use these execution states:

| State | Meaning |
| --- | --- |
| Queued | Eligible work has not started. |
| Running | A reviewer has started identifiable stages. |
| Complete | All required stages for the stated workflow finished against the pinned target. |
| Partial | Useful stages finished, but named required checks or workers did not. |
| Blocked | Required source, tools, access, authorization, or independent agents are unavailable. |
| Excluded | Evidence shows the capability is inapplicable, incompatible, or duplicates a recorded pipeline. |

Record adaptations separately from status. An adapted method is complete only for its stated adapted scope. Do not describe it as full upstream execution. Interrupted or failed work remains visible. Before reporting, reconcile ledger parent rows against the fetched security section and child rows against inspected skill trees. No queued or running row may disappear into a complete summary. If a time or user budget ends, report remaining eligible work as incomplete with the stopping reason.

## Dispatch a provider

Give each reviewer a prompt with these concrete values:

```text
Audit the pinned source snapshot at <read-only snapshot path>.
Read <manifest path> for scope, dependency versions, and factual assumptions.
Follow <pinned provider skill path> and its resolved required references.
Write only within <provider-specific artifact directory>.
Use <isolated work copy> for authorized test or proof-of-concept writes.
Do not change the original target or other reviewers' artifacts.
Do not consult other providers' first-pass findings.
Request nested worker allocations from the coordinator before dispatch.
Do not install software, disclose source, access signers, or execute live exploits.
Return candidates with affected locations, root cause, attacker preconditions,
impact, evidence, and severity rationale. Preserve uncertain leads separately.
Report actual stages, reviewed files, worker losses, deviations, and blocked checks.
```

Read provider source before dispatch. Some methods are nested orchestration, others are single-reviewer workflows. Determine worker demand from the pinned instructions. Allocate child roles in waves if their independence does not depend on simultaneity. If upstream requires simultaneous dispatch, document the departure and its impact. Never let every provider assume it owns the runtime's full capacity.

Map host-specific tool names to actual available capabilities. Do not execute fetched scripts until their commands and side effects have been inspected. Build commands can execute repository hooks too. Keep new dependency acquisition or hosted analysis outside authorization unless already permitted.

For an installed local ETHSKILLS Audit, inspect its actual instructions and resolve its external master and domain checklists. If a referenced shared-discovery file is absent, discover compiler, dependencies, runner, and deployment directly and record that adaptation. The local methodology does not require installing an unrelated orchestration skill.

## Validate a candidate

Use a new reviewer for disputed or complex claims when capacity allows. Provide raw claims after initial independent discovery has ended. Record these fields for every normalized finding:

| Field | Required content |
| --- | --- |
| Identity | Stable finding ID, root cause, affected files and line locations at the target snapshot. |
| Attribution | Provider finding IDs, skill revisions, original claims, and disagreements. |
| Preconditions | Attacker role, reachable entrypoint, required state, external behavior, and trust assumptions. |
| Impact | Concrete violated property and affected assets or operations. |
| Evidence | Call path, source proof, executed commands and results, reproduction artifacts, or missing prerequisites. |
| Verdict | Confirmed, rejected, or unresolved with rationale. |
| Severity | Evidence-based impact and likelihood, distinct from each provider's original severity. |
| Remediation | Suggested fix and useful verification, without modifying the target. |

Do not merge findings solely because their titles match. One root cause can affect several functions. Similar symptoms can have different causes. Retain rejected claims with the protection that invalidated them. Inspect possible exploit chains before rejecting interacting leads independently.

## Return a bounded report

Include the target snapshot and scope first. Then present confirmed findings ordered by severity, unresolved leads, rejected claims, and links to local evidence. Include the provider ledger with stage counts and reasons for incomplete work.

Map relevant security domains to actual reviewed files, methods, and supporting checks. Do not infer domain coverage from a provider's reputation or name. Separate audit review, scanner output, testing, and claim validation. State model diversity only from observed model assignments. State limitations caused by unknown deployment facts, unavailable tools, failed workers, or excluded methods.

End with the reviewed scope's result and remaining checks. Zero findings does not establish that contracts are safe. A clean scanner result does not replace an independent review. Keep reports private unless disclosure is authorized.
