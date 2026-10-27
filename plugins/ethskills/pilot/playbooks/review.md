# Review

Use for an assessment. Keep source unchanged unless fixes were also requested.

1. Pin the review revision, diff and affected workspace. Identify trust/asset boundaries and dependent contracts, clients, indexers and deployment configurations. Record whether the review covers source, local execution, or a particular deployment.
2. Use `review` for general engineering review; add audit for a requested contract security audit and crops for dApp trust assumptions. Use qa for applicable finished-app behavior. Do not silently expand an ordinary review into a full audit or run irrelevant Scaffold checks.
3. Trace proposed failure paths through reachable inputs, authorization, state and external behavior. Validate a finding with a focused test, trace, primary source or demonstrable code path. Separate confirmed defects, plausible risks and questions; avoid styling preferences presented as bugs.
4. Report actionable findings with impact, triggering conditions, location and evidence. Include the limits of coverage and relevant checks that passed. No findings means none found within the stated scope, not proof of safety.
5. If a release requires independent review, identify who reviewed which revision. Self-review, multiple passes by the author and passing CI do not supply that verdict. Keep the gate blocked if the required reviewer cannot run.

Audit or feedback instructions may suggest issue creation or submission. Assess locally first; public disclosure, issue creation and messages need authorization covering that action. Preserve prior authorization and avoid repetitive confirmation.
