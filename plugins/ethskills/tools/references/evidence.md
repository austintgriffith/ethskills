# Record what was actually verified

Keep evidence proportional to the task. A source explanation needs file references. A changed transaction journey needs observations of that journey. Do not create a large report for a trivial question.

Each material assertion records expected behavior, observed result, scope and evidence. Use these statuses:

- **PASS** means the asserted behavior was observed in the identified environment.
- **FAIL** means the observation contradicts the assertion.
- **BLOCKED** means a required observation could not run, with the missing capability or fact named.
- **NOT APPLICABLE** means the assertion does not apply, with a reason.

Do not convert a missing browser, signer, fork RPC, test runner or independent reviewer into a pass. Optional unavailable checks can remain limitations; required unavailable checks prevent the corresponding completion claim.

## Bind evidence to its scope

Record source revision and relevant dirty changes, workspace, command and tool version, target environment, and time or block where it affects reproduction. Keep source revision, hosted build revision and contract deployment identity separate unless evidence connects them.

For contract tests preserve the actual command, exit status, discovered/executed tests and meaningful assertions or counterexamples. Zero selected tests and infrastructure errors are not successful behavior checks. Pin forks when reproduction depends on historical state.

For browser checks preserve the observed URL, actions, relevant screenshots and console/network errors. A screenshot proves appearance at that moment, not a successful transaction or backend state transition. Link the screenshot to the specific assertion. Video or a trace is useful when sequence matters and the driver supports it.

For transaction checks record chain, contract/implementation, action, receipt outcome and relevant state or event changes. Distinguish wallet signature, transaction submission, receipt confirmation and application refresh. A successful outer receipt does not prove every inner smart-account action succeeded.

Label mocked wallets, simulated transactions and emulated devices. They cannot establish real signing, public-network execution or real-device deep-link behavior. Never include private keys, signatures that grant authority, proof witnesses, authenticated URLs or unrelated user data in reports/screenshots.

## Report the result

Lead with what works, what fails and what remains unverified. Link actual artifacts and source locations. State the exact environment and important limits. Do not claim deployment parity, security certification or improved agent performance from structural validation alone.

When [Eth Trace](../../trace/SKILL.md) is appropriate, reuse its task log rather than copying full raw output into several reports. Evidence gathering does not independently authorize publication, issue disclosure or sharing private artifacts.
