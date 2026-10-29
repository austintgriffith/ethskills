# Design

Use for a design deliverable or a consequential choice before authorized implementation. A design request alone does not authorize production edits or deploys.

1. Establish the user outcome, trust boundaries, assets, actors and state transitions. For each onchain transition identify its caller, incentive, authorization, and behavior when nobody calls it. Read concepts and relevant domain skills as needed.
2. Inspect the existing architecture and integration constraints. Use `architect` for architecture exploration and crops for dApp trust choices. Compare plausible options by complexity, user control, upgrade/admin powers, privacy, failure recovery and operating costs. Recommend a default and name accepted compromises and exit paths.
3. Resolve empirical uncertainty with the smallest authorized experiment. Keep prototypes separate from production source, use the detected stack when compatibility is the question, and observe the relevant behavior. A read-only recommendation can instead rely on existing evidence. Do not build a prototype without permission to write.
4. For substantial UI changes, present distinct labeled alternatives when practical before rewriting production components. Use actual observations or screenshots to explain the choice. Do not claim visual verification from source inspection.
5. Define implementation seams and acceptance checks, including unit/fuzz/fork checks, wallet behavior, independent review, or rollback where the design requires them. Hand the chosen design to Build only within the implementation scope already authorized.

Use arena for a useful comparison and swarm for independent breadth only when delegation is authorized. Missing a required independent verdict is a gate, not an invitation to relabel self-review.
