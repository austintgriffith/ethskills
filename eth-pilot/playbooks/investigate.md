# Investigate

Use for a cited answer, diagnosis, or recommendation. Do not edit source or create task artifacts merely because the investigation has multiple steps.

1. Identify the question that evidence can settle. Trace the relevant entrypoint through state changes, external calls, events, and consumers. Read configuration and resolved dependency versions before inferring library behavior.
2. Use `how` for execution flow and `why-project` for documented motivation/history or regression causes. Analyze a captured EVM execution trace with the detected contract toolchain and relevant transaction/block evidence. `trace` is an optional task decision log, not a trace debugger. Distinguish the code's observed behavior from an inferred rationale. A commit message is evidence of intent, not proof of current behavior.
3. Check the narrowest decisive source: callers and tests for code behavior; receipts, logs, state and block context for onchain claims; matching official documentation for version-sensitive APIs. Prefer read-only commands. Do not run scripts whose side effects are unclear.
4. For competing explanations, state what observation would distinguish them and obtain it within authorized resources. Report missing RPC, archive state, browser access, or credentials as a limit. Do not silently substitute a different chain or deployment.
5. Answer with evidence pointers and consequences for the user's decision. If asked whether a change is advisable, give a recommendation and its tradeoff without implementing it. Route to Build only after a request to change behavior.
