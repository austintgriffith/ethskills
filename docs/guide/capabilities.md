# Choose a capability directly

You can invoke these skills without Pilot. Each reads shared discovery only when project facts affect the task.

| Goal | Skill |
|---|---|
| Find a workflow without executing it | [help](../../eth-help/SKILL.md) |
| Explain how code works | [how](../../eth-how/SKILL.md) |
| Investigate why it changed or failed | [why-project](../../eth-why/SKILL.md) |
| Learn the system step by step | [teach](../../eth-teach/SKILL.md) |
| Settle an interface or design | [architect](../../eth-architect/SKILL.md) |
| Compare solutions to the same task | [arena](../../eth-arena/SKILL.md) |
| Partition independent tasks | [swarm](../../eth-swarm/SKILL.md) |
| Review a design or change | [review](../../eth-review/SKILL.md) |
| Reproduce a bug in a failing test | [tdd](../../eth-tdd/SKILL.md) |
| Run contract and browser verification | [verify](../../eth-verify/SKILL.md) |
| Trace affected contracts and consumers | [blast-radius](../../eth-blast-radius/SKILL.md) |
| Propose lessons from a task | [reflect](../../eth-reflect/SKILL.md) |
| Enforce a recurring correction | [correct](../../eth-correct/SKILL.md) |
| Keep a decision/evidence trail | [trace](../../eth-trace/SKILL.md) |

`why-project` investigates a project's history and causes. The existing [Why Ethereum](../../why/SKILL.md) explains Ethereum's suitability and tradeoffs. `trace` records task decisions; it is not an EVM execution-trace debugger.

## Recipes

```text
ethskills:how follow the withdrawal from the button to the contract
and back to the displayed balance. Cite the actual source.
```

```text
ethskills:review review this change for behavior regressions and
integration risks. Do not modify files or publish findings.
```

```text
ethskills:blast-radius identify consumers affected by this event change,
including generated bindings and indexer mappings.
```

```text
ethskills:reflect identify what this task taught us. Propose a reusable
correction only where the evidence supports it.
```

Arena compares attempts at one problem. Swarm divides different slices. Neither requires a fixed model vendor or agent count. Parallel work needs exclusive writable ownership and isolated mutable state; required independent review cannot be replaced by self-review.

Return to [the guide](README.md).
