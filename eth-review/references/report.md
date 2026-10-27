# Review findings and judgment

Lead with the actionable conclusion for the pinned target. Scale the report to the work: a small review may need only findings and a coverage sentence. An adversarial review can include reviewer identities, disagreements and disposition reasons. Do not require empty sections or a separate report file.

## Finding evidence

For each actionable finding, provide:

- A concise title and impact-based severity, with the source file and narrow line location or design section.
- The triggering conditions and affected user/system outcome. Distinguish practical impact from a hypothetical worst case whose prerequisites are unproven.
- A traceable path from input/caller to failure, supported by source and, where available, the reproducing command/test, trace or counterexample. Identify the exact revision, dirty fingerprint, dependency/compiler versions and fork block in the shared review scope rather than repeating them in every item.
- The smallest remedy that addresses the failure within the requested design. Avoid unrelated refactors or toolchain migration advice.
- Confidence and unverified prerequisites when reproduction is incomplete. A plausible concern remains a hypothesis until its key assumptions are supported.

Use the project's severity definitions when present. Otherwise use **critical** for demonstrated catastrophic compromise under credible conditions, **high** for substantial loss or core-function failure, **medium** for bounded correctness/integration failures, and **low** for limited-impact defects. Do not label formatting preferences or unsupported speculation as vulnerabilities. Severity describes impact and prerequisites; confidence describes evidence strength.

## Disposition

Deduplicate by root cause and consequence, preserving distinct affected paths where they need separate remedies. Weigh a lone finding on its evidence; agreement between reviewers is useful corroboration, not a substitute for proof.

- **Act on:** Supported defects worth correcting within this change; explain whether they block the scoped approval.
- **Consider:** A supported tradeoff or concern whose cost/benefit depends on an unresolved product decision; state that decision.
- **Noted:** Relevant context or limitations without an actionable defect in this scope.
- **Dismissed:** Incorrect, duplicate, out-of-scope or version-inapplicable suggestions, with a brief concrete reason. Summarize material dismissals; do not publish every speculative thought.

Keep the verdict separate from check statuses. A reproduced defect can have a **FAIL** assertion while unrelated checks **PASS**. An optional unavailable check is a limitation. A required missing check or independent reviewer is **BLOCKED** and prevents the corresponding approval claim. Explain what would resolve it.

## Coverage statement

Identify the base/head or design version, relevant dirty fingerprint, inspected boundaries, executed checks and their outcomes, plus checks that did not run. Separate source review, isolated local tests, browser observations and deployed-state evidence. State unknown deployment parity explicitly when deployment conclusions matter. Never turn static checks or a clean report into a claim that a contract is audited, safe, or equivalent to a hosted release.
