---
name: blast-radius
description: Trace what an Ethereum code, dependency, ABI, event or deployment change can break beyond its diff. Use for impact analysis and compatibility questions across contracts, indexers and clients; use Review for a general change review.
---

# Blast Radius

Trace a change to the consumers and assumptions it can invalidate. Identify the decisive safety fact and distinguish source evidence from behavior actually exercised. This is an impact analysis, not a complete audit or an exhaustive census of deployed consumers.

## Establish the comparison

Use [project discovery](../tools/references/project-discovery.md) to identify the affected workspace, resolved dependencies and tools. Pin the requested base and head, including relevant dirty changes. For a proposed change without a diff, state the proposed behavior and current baseline. Do not silently use a convenient branch or current artifact as the old deployment baseline.

Read changed code, imports, compiler settings, relevant lockfile entries and deployment metadata before selecting a framework adapter. Read [impact tracing](references/impact-checklist.md) for the affected surfaces only. Follow existing [tool adapters](../tools/references/tool-adapters.md); do not install a framework, migrate the project or invent a code generation command.

## Follow the compatibility boundary

1. Explain the behavioral delta, including dependency and compiler changes that leave the public ABI unchanged.
2. Follow concrete edges from the changed producer to consumers: storage to proxy implementation, ABI to generated bindings and calls, event encoding to ingestion and queries, signatures to signers/verifiers, chain/address/admin records to deployments and clients. Cite files and lines for each material edge. Search aliases, selectors, ABI fragments, configuration and generated outputs as appropriate; a symbol search alone is insufficient.
3. Identify the one or two facts on which compatibility depends. Try the credible failure path against the actual implementation and resolved library version. Separate a confirmed incompatibility, a plausible unresolved risk and a path cleared within the inspected scope. A negative repository search is scoped evidence, not proof that external consumers do not exist.
4. Report the cheapest decisive check and its permitted environment. Execute it only when the task authorizes execution and the environment is suitable. Reuse existing focused checks; use [Verify](../verify/SKILL.md) for an authorized execution workflow. Code inspection, static artifact comparison, a local test and a deployed observation prove different things.

## Respect inspection scope

An explanation or read-only impact request authorizes reading source, configuration and existing artifacts. Compilation, code generation, test execution and importing project code may execute hooks or write outputs; these require execution scope even if called “validation.” Missing or stale artifacts leave the corresponding check unproven. Do not generate them implicitly for a read-only request.

Use [runtime guidance](../tools/references/runtime.md) before invoking commands or connected tools. Do not deploy, upgrade, sign, broadcast, reset an indexer or contact live systems implicitly. Existing authorization applies; ask only for a missing action or target that the next required check actually needs.

## Return a bounded conclusion

Lead with what can break and the decisive safety fact: proven to a named scope or **unproven**. Include:

- Comparison baseline, workspace, relevant versions and artifact/deployment provenance.
- Material producer → consumer paths with source locations, failure mechanism and impact.
- Confirmed risks, unresolved assumptions and cleared paths, each with its evidence.
- Actual checks and results, plus unrun checks, the reason and the cheapest next verification.
- Coverage limits, including unknown external consumers and unestablished source/deployment parity.

Follow [evidence conventions](../tools/references/evidence.md). Do not label a proposed test as run or use an unchanged ABI to certify storage, signature or semantic compatibility. Route design alternatives to [Architect](../architect/SKILL.md) and a broader review to [Review](../review/SKILL.md) only when the task needs them.
