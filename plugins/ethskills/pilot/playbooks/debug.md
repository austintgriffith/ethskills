# Debug

Use for a defect the user wants fixed. A request for diagnosis only remains in Investigate.

1. Reproduce on the surface where the defect occurs. Record input, expected/actual behavior, revision and target. For contract failures capture chain ID, address/implementation, block or transaction, revert and relevant state; for UI failures capture the actual URL and wallet/network state.
2. If unavailable, construct the closest permitted local reproduction and label its limits. Do not say the original bug is reproduced when only a different mock or fork exhibits similar symptoms. Continue read-only diagnosis when writes or live actions are outside scope.
3. Form competing causes and choose checks that eliminate them. Trace caller to execution to receipt/state to displayed result. Use `why-project` for regression history and `trace` only when a task decision/evidence log is useful. Instrument narrowly when needed, redacting credentials and private data.
4. Confirm the mechanism before patching. If several failed fixes share a premise, reconsider that premise and run a decisive check. Use `correct` only for a recurring defect class supported by distinct occurrences, rather than multiple attempts at one incident. Revert speculative fixes whose hypotheses failed. Do not retry transactions with uncertain outcomes; first reconcile pending nonce, receipt and state.
5. Make the smallest fix the evidence supports using Build. Add a behavioral regression test when it can represent the failure meaningfully. Re-run the original reproduction and appropriate adjacent cases through Verify.
6. Report cause, changed behavior, decisive before/after observations and any mismatch between reproduction and target. If reproduction or verification is blocked, name the missing prerequisite and the remaining uncertainty rather than claiming a fix is proven.
