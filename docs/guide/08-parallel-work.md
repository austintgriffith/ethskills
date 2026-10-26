# Work with multiple agents

Use more agents when independent coverage or separate ownership helps. One straightforward change may be easier to complete in one pass.

## Divide independent tasks with Swarm

[Swarm](../../eth-swarm/SKILL.md) partitions different slices and aggregates their results.

```text
ethskills:swarm inspect the contract, frontend and indexer impacts of
this event change. Give each reviewer a distinct scope and return
one report. Keep the investigation read-only.
```

For writable work, assign exclusive files or separate worktrees before edits. Generated ABIs and bindings have an owner and dependency order. A frontend consumer should not claim verification against an ABI that another worker later changes.

## Compare alternatives with Arena

[Arena](../../eth-arena/SKILL.md) gives competing attempts the same brief and acceptance criteria.

```text
ethskills:arena compare approaches to this withdrawal interface.
Keep the same dependencies, chain state and acceptance criteria.
Show the differences before selecting the implementation.
```

For gas or performance comparisons, match compiler settings, data, fork block and measurement conditions. Different workloads cannot establish a meaningful speedup.

## Isolate mutable state

Separate fork nodes, ports, wallets, browser profiles and indexer databases when workers can change them. A chain ID alone does not establish that a node is an isolated fork. Do not reset shared state for a convenient test.

Use the models and agent capacity actually available. The toolkit does not impose a vendor or fixed panel. Queue tasks when capacity is limited. Sequential exploration is valid when labelled; it cannot replace a required independent verdict.

For work you will inspect later, ask for a bounded outcome and [Trace](../../eth-trace/SKILL.md) evidence. The toolkit does not supply an autonomous scheduling service.

**Pitfall:** several agents writing one generated file or using one mutable fork can invalidate one another's results.

Next: [Improve the next run](09-improve.md).
