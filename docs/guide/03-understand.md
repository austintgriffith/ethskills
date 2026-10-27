# Understand before editing

Use an explanation to establish how the system behaves before choosing a fix. The explanation should follow your source and installed libraries, not a generic dApp template.

## Follow the execution path

[How](../../eth-how/SKILL.md) traces entry points, callers, contract interfaces, events and consumers.

```text
ethskills:how follow withdrawal from the UI to the contract and back.
Explain where signature, submission, confirmation and refresh happen.
Cite the actual source and identify missing deployment information.
```

Expect the affected workspace, relevant library versions and source references. Generated ABI/types, deployment records and runtime configuration matter when they connect the frontend to the contract.

## Find the reason

[Project Why](../../eth-why/SKILL.md) investigates decisions, history and regressions.

```text
ethskills:why-project why did this approval flow change last week?
Inspect the code and dependency changes. Separate documented intent
from inference. Do not change files.
```

A nearby commit or plausible SDK migration does not prove a cause. The answer should distinguish evidence, explanation and remaining uncertainty. Project Why is separate from [Why Ethereum](../../why/SKILL.md), which discusses Ethereum's suitability.

## Learn the system

[Teach](../../eth-teach/SKILL.md) adapts the explanation to the learner.

```text
ethskills:teach explain how our vault converts assets to shares.
Use our actual implementation and a worked example. Label any
example that has not been run.
```

A diagram is useful when it clarifies the flow. It does not replace the source or a test.

For a captured EVM trace, use the project’s actual contract tooling and transaction/block evidence. [Trace](../../eth-trace/SKILL.md) keeps a task decision log; it is not a transaction debugger.

**Pitfall:** a correct explanation of local code does not prove that the hosted frontend or deployed contract uses that revision.

Next: [Design within the real system](04-design.md).
