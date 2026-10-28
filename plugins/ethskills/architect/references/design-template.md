# Design handoff

Use only the sections needed for this change. A response is sufficient unless the user requested a saved artifact or the project already has one.

## Outcome and grounding

- Requested behavior and non-goals.
- Affected workspace, source revision/dirty scope and relevant files or observations.
- Existing tools/dependency resolutions, compatibility constraints and unknowns.

## Caller usage and interface

Show the caller journey, then the proposed signatures/types, units, errors and events. Mark these as sketches. Identify the owners of contract state, UI state, derived data and generated interfaces.

| Transition | Preconditions/caller | Inputs/units | State/event result | Invariant | Incentive, failure and recovery |
|---|---|---|---|---|---|
| Actual changed transition | Authority and starting state | Typed values | Observable result | Property that must hold | Who pays/calls; nobody acts; retry/exit |

## Decision and trust

Record meaningful alternatives if any, the selected default and decisive tradeoff. For dApp architecture include the concrete CROPS record from the CROPS skill, scaled to the change. State accepted compromises and the user's escape path. Identify ABI, storage, initializer, event, wallet, indexer and host compatibility consequences that actually apply.

## Verification and open facts

| Hypothesis | Observable falsifier | Cheapest authorized check/environment | Evidence or pending limitation |
|---|---|---|---|
| Concrete compatibility or behavior assumption | Result that disproves it | Existing command, read-only query or scoped journey | Actual source/observation, or clearly proposed check |

State blockers separately from optional checks. Name what the implementation handoff authorizes under the existing request. During authorized implementation, update this design for accepted behavior/interface changes and record their acceptance source; keep unresolved deviations visible.
