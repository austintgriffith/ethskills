---
name: how
description: Explain how existing Ethereum code works, including subsystem ownership, dependencies and transaction flows, with cited source evidence. Use for code walkthroughs and placement or layering questions; use why-project for historical rationale.
---

# How

Build a working mental model of the requested code. Keep questions read-only: explanation does not authorize edits, installs, builds, signatures, transactions, deployment or external writes. A narrow question needs a direct investigation and answer, not mandatory agents or tests.

## Find the actual path

Use [project discovery](../tools/references/project-discovery.md) to identify the relevant workspace, revision, imports, dependency resolutions and configuration. Scope discovery to the question. Do not select a framework from an unrelated package or infer Scaffold-ETH from wagmi alone.

Start at the user's symbol, route, action or contract, then follow its real callers and dependencies. For workspace exports, aliases, ABI generation or unresolved imports, read [dependency tracing](references/dependency-tracing.md). For contract artifacts, client versions, wallets or indexers, read [Ethereum paths](references/adapters.md). Follow installed implementations and types before assuming API behavior; use matching official version documentation when needed. Unknown versions remain unknown.

For a transaction journey, trace only the relevant implemented stages:

`UI action → wallet/signature request → submission identifier → receipt/outcome → events or indexed data → cache/UI refresh`

Identify where network/address selection, authorization, pending state, rejection, revert, replacement and refresh are handled. A hash is submission evidence; a signature, Safe proposal or UserOperation identifier does not establish execution. State when a stage is missing or delegated to a dependency.

## Explain with scoped evidence

Separate what source code implements, what a generated artifact represents and what has actually been observed deployed. Local source alone cannot prove hosted build parity, proxy implementation identity or live execution. Runtime inspection is optional for a source question. If needed and available, use read-only observation under the [runtime rules](../tools/references/runtime.md) and [evidence rules](../tools/references/evidence.md); record chain, address/implementation and block for chain-dependent claims. Do not perform a transaction to make an explanation complete.

Lead with the answer, then use only the useful parts of this shape:

- **Overview:** what the subsystem does and its boundary.
- **Key concepts:** concepts needed to understand this implementation.
- **How it works:** the concrete call/data/transaction path, with evidence at each important transition.
- **Where things live:** which module owns each responsibility; distinguish current ownership from a suggested placement.
- **Gotchas:** consequential behavior, unresolved edges and limits of the evidence.

Cite repository paths and line numbers with relevant symbols. Record the revision and relevant dirty changes for a substantial walkthrough; label inference and unavailable evidence. Avoid line-by-line narration or unsupported architectural intent. If deployed behavior is unobserved, say so and name the smallest optional read-only check that would resolve the gap.

For a request centered on motivation or history, use [Project Why](../why-project/SKILL.md). For a guided learning exercise, use [Teach](../teach/SKILL.md). Do not turn an ordinary walkthrough into an audit or verification run.
