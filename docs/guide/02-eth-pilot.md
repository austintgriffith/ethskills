# Give Pilot a goal

[Ethskills Pilot](../../eth-pilot/SKILL.md) is the main entry point. It owns one execution loop. It defines an observable outcome, inspects the project, changes and checks small units, and verifies the delivered behavior. Supporting workflows and Ethereum topics load only when they affect the current step. No separate Poteto installation is required.

## Describe the outcome

A useful prompt names the goal, a way to tell whether it is done, and any constraints that matter.

```text
ethskills:pilot users can click Approve twice while the first transaction
is pending. Reproduce it, fix it using our current stack, and show
that a second transaction cannot be submitted before confirmation.
```

The agent should investigate the actual transaction lifecycle, choose an appropriate reproduction, make the scoped change and verify the original flow. Naming a skill in a plan is not enough; Pilot must read and perform its procedure.

## Follow the route

| Your intent | Workflow | Typical supporting skills |
|---|---|---|
| Explain or diagnose | Investigate | How, Project Why, Ethereum topics |
| Choose an approach | Design | Architect, CROPS, optional Arena |
| Add or refactor behavior | Build | Ship, TDD, relevant topics |
| Fix a defect | Debug | How, Project Why, TDD |
| Assess a change | Review | Review, applicable Audit or QA |
| Prove behavior | Verify | Verify, Testing |
| Prepare or perform an authorized release | Deploy | Wallets, deployment references, Verify |
| Improve the instructions | Skill improvement | Reflect, Correct |

The actual skills depend on the task. A question needs no mandatory panel, browser run or generated report.

## Steer in plain language

```text
Explain only. Do not change files.
```

```text
Compare the options before writing a contract.
```

```text
Keep our existing dependencies. Stop at deployment preparation.
```

Existing context carries forward. A short follow-up can continue the task; say that you are changing tasks when the intended outcome changes.

For longer work, [Trace pickup](../../eth-trace/references/pickup.md) preserves the goal, next action, scope and selected source/evidence fingerprints. A fresh session can inspect the local record and identify changed or missing files before reusing earlier checks. This does not resume the agent automatically or prove that a remote deployment still matches. Keep the current target and verification commands in the task's existing evidence record.

**Pitfall:** listing a sequence of skills in every prompt makes you manage the workflow. Name a skill directly when you deliberately want that capability.

Next: [Understand before editing](03-understand.md).
