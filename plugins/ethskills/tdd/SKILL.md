---
name: tdd
description: Reproduce a bug with a meaningful failing check, make a small fix, and rerun the same check. Use for explicit TDD or regression requests, or a bug with a cheap established test path; do not force new test infrastructure for every fix.
---

# Make the bug executable

Prove the predicted behavioral failure before changing implementation, then prove the same check passes after the fix. A compilation error, missing import, broken RPC or zero selected tests is not a red test of the bug.

An explanation or read-only investigation does not authorize test or implementation edits. Use existing session authorization for the requested fix; this workflow grants no deployment, live signing, public-network transaction, shared-state mutation or external publication permission.

## Select the reproduction

Use [project discovery](../tools/references/project-discovery.md) and [tool selection](../tools/references/tool-adapters.md) to resolve the affected workspace, existing commands, installed versions, runner, plugins and relevant configuration. Inspect scripts before execution and preserve the project's stack. Read the relevant [regression adapter](references/adapters.md); for test-design techniques use [testing](../testing/SKILL.md).

State the intended behavior and the observed defect. Derive the expectation independently of the implementation: a requirement, explicit amount, protocol rule or economic bound. Name the exact mismatch expected from the broken path. Choose the nearest established unit, component, integration or browser check that actually exercises that path.

Prefer a real behavior check over a new test dominated by mocks or fixture churn. Do not add getter tests, re-test OpenZeppelin internals, or reproduce production calculations in the assertion. A roundtrip bound must express the intended loss/rounding tolerance, not simply compare two calls to the same faulty conversion.

## Red → small fix → same green check

1. Add the smallest useful regression to the existing harness, or prepare the closest executable reproduction. Keep source unchanged until the failure is observed. Fix unrelated setup problems separately; they do not establish the bug.
2. Run the focused check and inspect actual failure output, exit status and executed test count. Quote the observed mismatch or unexpected outcome, not just the assertion source. Confirm execution reached the affected behavior. For an expected-revert defect, prove the intended call and relevant error; an unrelated exception is insufficient. If the check passes, correct the hypothesis or reproduction before editing implementation.
3. Make the smallest authorized implementation change. Keep the independent expectation intact. Do not weaken assertions, broaden tolerances or change fixtures merely to make the result green. A discovered requirement change needs an explicit explanation and a new valid red run if it changes the check.
4. Rerun the **same** selection, configuration and fixture state. Preserve profile, runner, seed, fork block and environment; record any unavoidable difference and re-establish the comparison when it could explain the result. Require the expected tests and assertions to execute successfully.
5. Run relevant nearby checks and required project gates. If they expose another in-scope defect, repeat the focused cycle. Broaden only when changed behavior or unresolved failures justify it.

For fuzz failures retain the counterexample and seed; replay that failure before relying on a fresh passing campaign. A deterministic regression for the counterexample can accompany the existing fuzz property.

## When a test is impractical

Do not create a new framework or extensive mock system solely to produce red/green evidence. Use a targeted command, existing integration script, or actual browser journey when it measures the defect better. For browser/runtime execution follow [Verify](../verify/SKILL.md) and [runtime rules](../tools/references/runtime.md), respecting the selected browser and wallet capabilities.

If no safe executable reproduction is available, say why, continue useful independent investigation, and distinguish an implementation supported by inspection from a demonstrated regression fix. Missing browser, runner or pinned fork data is a coverage gap, never successful verification. A reproduction failure caused by unavailable infrastructure remains blocked.

## Report the proof

Use [scoped evidence](../tools/references/evidence.md). Keep a compact record of:

- Intended behavior, predicted defect and the check that measures it.
- Source revision and relevant dirty changes, workspace, redacted commands, tool/plugin versions and relevant configuration; pinned fork provenance or test seed when applicable.
- Actual red failure excerpt and test count; the same green run's outcome and count, plus relevant nearby validation.
- Changed behavior, remaining failures, unavailable checks and any difference between simulated/local evidence and a real wallet or hosted deployment.

Label absent failing-before evidence explicitly. Structural validation of this skill does not establish that its procedures or version combinations have been exercised.
