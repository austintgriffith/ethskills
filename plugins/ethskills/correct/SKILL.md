---
name: correct
description: Turn demonstrated recurring project mistakes into enforced architecture, types, actionable checks or behavioral tests, and prove the protection rejects a real past defect. Use for preventing repeated mistakes; a single bug or investigation alone does not establish a recurring rule.
---

# Make recurring mistakes harder to repeat

Find the causal mistake class, choose the strongest practical enforcement, and demonstrate that it catches an actual occurrence. A larger instruction file is not the default fix.

An investigation stays read-only. A request to implement a correction authorizes scoped project changes; reuse that authorization without another approval gate. This skill does not authorize dependency migrations, deployment, live transactions, PR creation, issue disclosure or external posting.

## Establish recurrence

Use [project discovery](../tools/references/project-discovery.md) to identify the affected workspace, source revision, relevant dirty changes, instructions and existing checks. Inspect relevant commits, reverts, supplied reviews and code. Read only history needed for this task; do not mine private transcripts or secrets.

For each candidate class, identify **two distinct occurrences** with revision or review references, paths, symptoms and the same causal mechanism. Two comments about one incident count once. Similar symptoms with different causes do not establish recurrence. Rank by observed frequency and consequence, then select the classes within the requested scope.

If only one occurrence is evidenced, address an authorized individual bug through [TDD](../tdd/SKILL.md), or report a prevention proposal. Do not claim recurrence or create a universal rule from a suspicion. [Reflect](../reflect/SKILL.md) can help develop lessons when the causal explanation remains uncertain.

## Choose effective enforcement

Prefer the highest level that prevents the demonstrated class without disproportionate complexity. Explain why any higher level is unsuitable for this case.

| Level | Choose it when | Useful evidence |
|---|---|---|
| Architecture | One owner or supported path removes the opportunity for divergence. | Historical duplicate state, stale generated data or unsafe access can no longer enter through the supported path. |
| Types or compiler constraints | Invalid units, states or interfaces can be rejected before execution. | A real mistaken call or state fails with the intended diagnostic. |
| Existing lint, analyzer or targeted check | A structural pattern is detectable but cannot reasonably be eliminated. | The check identifies the offending location and tells the contributor which supported API or pattern to use. |
| Behavioral regression | The defect depends on runtime values, sequence or external behavior. | The observed bad outcome fails an independent expectation, then the correction passes it. |
| Documentation | The remaining decision needs human judgment and cannot be reliably encoded. | State the judgment and its limits; do not call it enforced. |

Do not force architecture changes that expand the task, nominal types that leave the actual unsafe boundary open, or pattern checks that reject valid alternatives. Scope any baseline or suppression to the demonstrated problem and document its rationale using existing project conventions. A suppression must not make the historical defect pass unnoticed.

Prefer installed tools and existing test suites. Do not add dependencies, a new CI framework, blanket lint rules or a rule table solely to satisfy this workflow. Avoid redundant tests for getters or third-party internals. Keep documentation focused on the supported path and genuinely unresolved judgment calls.

## Preserve the actual toolchain

Use [tool adapters](../tools/references/tool-adapters.md) for the detected stack and [runtime boundaries](../tools/references/runtime.md) before executing commands. Record command, working directory, resolved version, relevant configuration, expected result, required capabilities and state-changing boundary. If behavior is unclear, inspect installed help/types or matching official documentation and record the source consulted.

- **Foundry:** preserve compiler, optimizer/EVM settings, profiles, remappings, dependency revisions and existing Forge scripts. Use the affected test selection; retain seeds or fork provenance when material.
- **Hardhat:** distinguish the resolved Hardhat 2/3 version, plugins, test runner and ethers/viem client independently. Use the existing package manager and local scripts; never download a missing runner or migrate client APIs to make an example work.
- **Contracts and clients:** preserve installed OpenZeppelin major, initialization/storage assumptions, generated bindings and client numeric/receipt semantics. Enforce constraints at the actual boundary used by callers.
- **Types and analyzers:** activate only the relevant existing TypeScript, ESLint, Slither or other configured tool. Inspect its version and configuration before selecting a rule; a tool name alone is not support evidence.

Unknown versions or unavailable tools limit the proposal and proof. Continue independent investigation, but do not silently install, upgrade or assert compatibility.

## Prove the protection

1. Select a real historical occurrence and retain its provenance. Prepare an isolated local fixture or temporary worktree with the relevant original path; keep unrelated working changes intact. Inspect historical scripts before running them. Do not execute the reproduction against a live contract or shared service.
2. Apply the proposed protection to that defective case. For a new architecture/API, replay the original mistaken operation through the proposed boundary. For a behavior check, derive the expected result independently from the faulty implementation. Preserve the relevant compiler, dependencies, runner and configuration; if the historical toolchain cannot be reproduced, record that limit rather than upgrading it silently.
3. Run the focused check and inspect the failure. Require the **intended** rejection: a diagnostic at the unsafe boundary, an analyzer finding for the offending pattern, or the observed behavioral mismatch. A missing import, unavailable RPC, setup failure or zero selected tests does not prove protection. A deleted file or API is insufficient unless the demonstrated unsafe operation is rejected and the supported replacement works.
4. Correct the defect or use the supported path, then rerun the same command with the same configuration and fixture inputs. Require the expected assertions to execute and pass. Keep expectations intact; do not weaken the check merely to turn it green. Use [TDD](../tdd/SKILL.md) for the behavioral red/green procedure.
5. Make the authorized scoped correction and enforcement change. Reuse the proven command in existing project checks or CI when applicable and authorized. Run relevant neighboring checks; broaden only when changed behavior or unresolved failures justify it. For runtime or browser assertions use [Verify](../verify/SKILL.md).

A historical fixture can establish that the protection catches that occurrence; it does not prove every variant is impossible. State what remains reachable, false positives and known bypasses. If no faithful safe reproduction is available, label the protection unproven and explain what evidence is missing. Do not present a proposal or inspection-only conclusion as a passing regression check.

## Report the result

Use [scoped evidence](../tools/references/evidence.md). For each class give:

- The two distinct occurrences, causal mechanism and observed frequency.
- Chosen enforcement, why higher levels were unsuitable, and changed files.
- Historical fixture provenance, source revision/dirty changes, versions, configuration and redacted command.
- Actual rejection or behavioral failure, exit status and executed checks; the same corrected run's result and relevant nearby checks.
- Remaining bypasses, unavailable capabilities and unproven claims.

Keep the record in the project's established location or the task response. Do not grow agent instructions automatically, create commits or open a PR as a side effect. Structural validation of this skill does not establish exercised Foundry, Hardhat, client or analyzer compatibility.
