# Recipes and pitfalls

Adapt the outcome and constraints to your project. You do not need to list the supporting skills when using Pilot.

## Explain a failed transaction

```text
/ethskills:pilot explain why this transaction reverted using the target
chain, implementation and transaction evidence. Do not change code
or send another transaction. Separate confirmed facts from guesses.
```

## Add an integration

```text
/ethskills:pilot add this protocol integration using the project's
existing SDK and client libraries. Verify the deployed interface
and test relevant success and failure paths on an isolated fork.
```

## Test a hosted dApp

```text
ethskills:verify test the app in the project's identified preview.
Check connection, wrong-network handling, approval and deposit.
Capture screenshots and explain any wallet or receipt coverage gaps.
```

## Compare an architecture

```text
/ethskills:pilot compare permission models for this app.
Show who can act, upgrade or recover funds and how users exit.
Recommend an approach before implementation.
```

## Review a change

```text
ethskills:review review this change against the installed dependencies
and affected consumers. Report actual bugs and integration risks.
Do not edit code or publish findings.
```

## Prepare a release

```text
/ethskills:pilot check production readiness and list the remaining
blockers with evidence. Preserve the configured host and network.
Stop before deployment.
```

## Avoid the common traps

- A vague finish condition makes verification ambiguous. Name the behavior or artifact you need.
- A guessed cause can narrow the investigation too soon. Share symptoms and evidence first.
- A listed skill is not an executed skill. Expect the agent to read and perform the relevant procedure.
- A green build is not a working wallet flow. Ask for the relevant UI, receipt and state evidence.
- A screenshot is not a transaction receipt. Keep each proof scoped.
- An installed package does not establish deployed capability or runtime access.
- Missing browser, signer, RPC or required reviewer access is a gap, not a pass.
- Repeated corrections in chat help one run. A tested structural fix can help later runs.

For direct commands see [the skill reference](capabilities.md), or return to [the guide](README.md).
