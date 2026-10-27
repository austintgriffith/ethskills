---
name: verify
description: Verify changed Ethereum contract and dApp behavior using the project's installed test stack and actual browser journeys, including disposable browser/wallet setup for local tests and UI, wallet, receipt and state evidence. Use after a change or when asked to prove a flow; this is not explorer source-code verification or a security audit.
---

# Prove the changed behavior

Run relevant contract checks and drive affected user paths. A build, HTTP response, screenshot without interaction, or successful contract suite cannot establish a working dApp. Keep contract correctness, browser behavior, wallet integration and onchain effects as separate assertions.

This skill supplies an execution procedure, not a universal dApp driver. Discover the target's actual commands, controls and capabilities; never invent a completed run. This repository is a skill collection, so it does not itself provide a dApp on which to prove the procedure.

## Discover and doctor

Read the canonical [project discovery](../tools/references/project-discovery.md) and [runtime rules](../tools/references/runtime.md), then [verification discovery](references/discovery.md). Use the shared [tool adapter contract](../tools/references/tool-adapters.md). Read only relevant adapters:

- [Foundry](references/foundry.md): installed forge, effective profiles and pinned forks.
- [Hardhat](references/hardhat.md): separate v2/v3, runner, plugins and client versions.
- [Browser and wallet](references/browser-wallet.md): observed URL, semantic interactions and signing boundaries.

For a local Scaffold-ETH 2 wallet journey, try its built-in burner wallet on the owned local chain before installing an extension. The burner can prove the app's local transaction path, but it cannot prove extension prompts or wallet-provider behavior. Prepare an extension-capable Chrome/Chromium session with a disposable wallet when those behaviors are in scope and host rules permit. A walletless preview is a capability discovery result, not the end of the attempt. Follow the reference's setup and fallback procedure without waiting for the user to repeat the request.

Reuse the task's evidence root when one exists, with a distinct verification run beneath it. Otherwise use `.audit/eth-verify/<run-id>/` in the target project. Do not overwrite a prior run. Record source, dependencies, target identity and permitted writes before testing. Review project commands before execution: a script named `test` may deploy or use shared state.

Select the user's target and browser according to host rules. Preserve the observed scheme, port and path. Never guess `localhost:3000`. Establish hosted deployment/source parity when claiming that a hosted run verifies changed source; unknown parity permits a hosted observation report but blocks that claim.

## Execute

1. Define affected assertions and all relevant user entry points using the project's feature map, routes and changed behavior. [Feature template](templates/feature.md) is optional scaffolding for a run; populate it with discovered selectors and commands. Mark inapplicable checks with a reason.
2. Reuse a positively identified safe instance or launch the project's documented commands with isolated ports and state. Record owned process/session handles. Wait for usable UI, required seed state and chain readiness. Run doctor again after a redirect, reconnect or unexpected result.
3. Run existing targeted contract tests, then required project gates relevant to the change. Use [testing](../testing/SKILL.md) for techniques appropriate to the discovered framework. Exercise relevant unauthorized/revert, amount/decimal and economic roundtrip cases; math and stateful protocols may require fuzz/invariant coverage. Missing runner or RPC prerequisites are blockers, not passing skips.
4. Actually navigate and click each affected browser journey. Capture before/action/pending/after observations, assertions, screenshots and available console/network evidence. Cover wallet/network transitions, rejection/retry, errors, refresh and changed responsive behavior as applicable. Respect the [browser/wallet boundary](references/browser-wallet.md).
5. For authorized isolated writes, correlate the UI result to the receipt and independent before/after reads on the same chain and contract. A hash or wallet signature is not confirmation. Report mock-provider coverage separately from a real wallet connection.
6. Save the report and manifest using [evidence rules](references/evidence.md). Stop only owned processes; remove only scratch state created by this run. Verify proof artifacts survive cleanup and record cleanup failures.

Report defects without scope-expanding fixes, dependency upgrades, deployment, publication, issue filing or external messages. The browser/wallet setup described above is permitted test preparation, subject to host rules and existing session constraints. Ordinary verification may use disposable accounts in verified isolated test state, but does not authorize public-network transactions, approvals or arbitrary signatures. Continue independent safe checks when another check is blocked; state the exact prerequisite needed.

## Decide the result

Every assertion is `PASS`, `FAIL`, `BLOCKED` or `NOT_APPLICABLE`. Missing evidence is `BLOCKED`; contradictory observed behavior is `FAIL`. Overall `PASS` requires every required applicable assertion to pass, plus proven identity for the scope claimed. Any required failure produces `FAIL`; otherwise any required blocker produces `BLOCKED`. Include partial results, optional gaps and the precise verified scope.

Use the [report template](templates/report.md). Do not collapse a mock wallet, unsupported popup, unproven hosted revision, absent browser or missing receipt into a pass. [QA](../qa/SKILL.md) remains an independent applicable pre-ship review; executing this skill does not satisfy that separate review.

For work that will recur or continue across sessions, retain the discovered verification command, required inputs and its exact claim. Reuse existing project scripts before creating a driver. If a driver is useful or requested, place it in the established project location and populate launch/doctor/drive/evidence/cleanup operations from observed behavior. Run the command or mapped feature in a fresh process and confirm evidence survives cleanup before calling it reusable. Otherwise label it draft. A changed source, target or unavailable input requires rechecking the affected claim. Do not generate a `.claude` path for a different host.
