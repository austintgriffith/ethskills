# Evidence for a lesson

Use this compact record for a material candidate. Keep it in the task response or established task log; a new file is optional. Reference scoped artifacts instead of copying a raw transcript.

| Field | What to preserve |
|---|---|
| Task and correction | Original outcome sought; observed mistake or user correction in context. |
| Project | Relevant workspace, source revision and dirty-change fingerprint. |
| Adapter | Resolved dependencies, executable versions, plugins, runner and configuration paths implicated by the claim. |
| Observation | Expected/actual behavior, redacted command and working directory, exit result, meaningful assertions and evidence paths. |
| Browser/chain | When relevant: requested/observed URL, action and screenshot; chain, address/implementation, receipt/state and fork provenance. Keep hosted and source revisions separate. |
| Candidate | Hypothesis, general versus adapter/version scope, owning reference and smallest useful diff. |
| Evaluation | Model/harness, identical organic task, conditions, repetitions, observed failures and limits for stock/current/proposed runs. |
| Disposition | Accepted proposal, rejected or backlog; contribution triage and next check. |

## Make the comparison informative

An organic prompt asks for the user's outcome without naming the suspected mistake. For example, ask to repair a failing withdrawal journey in the supplied project, rather than “remember to wait for a receipt.” Decide observable success criteria from the task before comparing outputs.

The stock run measures training-data behavior without tools, skills or web access. Supply the same task and relevant raw inputs it can read; record what it cannot execute. Current/proposed runs measure the instruction change with equal tool access, matching source and dependency state, and isolated artifacts. Do not treat lack of stock tool access as a skill improvement. Compare generated decisions separately from execution results.

Preserve raw results sufficient to audit the conclusion. Record failed runs as well as successful ones. Avoid tuning only to one leading fixture: exercise a nearby case where the proposed rule should not apply. If reproductions, model access or runtime capabilities are absent, report the missing comparison and leave improvement unproven.

## Scope examples

These are illustrative decision checks, not executed evaluations:

**Hardhat 2 with ethers v5.** A test fails after an agent uses a v6-only numeric API. Confirm package resolution, registered plugin, test command, failure and corrected result. Propose an ethers-version selection correction in the owning adapter. That result does not justify a universal Foundry migration or establish Hardhat 3 support.

**wagmi confirmation.** A user reports a success message before confirmation. Without source and runtime evidence this is a hypothesis. Inspect the resolved hook/wrapper implementation, reproduce the transition, then compare current/proposed instructions on organic transaction journeys. Distinguish submission, confirmation and refresh; do not infer Scaffold-ETH from wagmi alone.

**Noir plus browser.** A local proof check and mocked-wallet UI action can support narrow compiler/proof or UI observations. Preserve tool/backend versions and verifier provenance without retaining private witnesses. Real signing, hosted parity and public execution remain unproven unless observed. Route a justified correction to the existing Noir or browser reference; reflection alone authorizes neither that edit nor a feedback POST.
