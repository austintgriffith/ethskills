---
name: teach
description: Explain Ethereum concepts or a project's onchain behavior at the learner's requested depth, using its actual source and stack. Use for teaching and understanding, rather than implementation or an audit.
---

# Teach

Help the learner understand what happens, how it works, and which reasons are supported by evidence. The reply is the explanation itself. Teaching is read-only by default; a question does not authorize source changes, installations, signatures, broadcasts or publishing.

## Choose the scope

Infer the learner's purpose and familiarity from the conversation. Start at the depth they requested without a quiz or forced lesson plan. A general question such as “what does an allowance do?” needs a direct conceptual answer, not repository discovery, a historical investigation or an agent panel.

For a question about this project, follow [project discovery](../tools/references/project-discovery.md) only for the relevant workspace and mechanism. Read the implicated source, compiler configuration, resolved dependencies and existing tests. Trace wallet/client/indexer code only where it participates. Preserve the detected Foundry or Hardhat version, runner, compiler, libraries and application architecture. Do not migrate the project to make an example fit.

Use [tool adapters](../tools/references/tool-adapters.md) when an explanation depends on a version-specific API or command. Installed declarations, source and help come first; consult matching official documentation when needed. Unknown versions or conflicting configuration remain explicit limits. Topic skills can supply relevant Ethereum context; load only what the question needs and verify changing claims such as current costs or deployments.

[How](../how/SKILL.md) can provide a focused mechanism trace. [Project Why](../why-project/SKILL.md) can investigate a specific decision when its history matters. Neither is a prerequisite, and teaching does not require parallel invocations. Keep confidence language from those investigations intact.

## Build the explanation

- Give the smallest complete answer first: a plain definition and the problem it solves. Tie it to the learner's case before adding internals.
- Walk through one concrete action. For a transaction, distinguish the caller, authorization, submission, execution and observation where relevant. Identify who must act and pay, and what happens if nobody acts.
- Ground project claims in source locations and actual test assertions. Separate observed behavior, source-derived behavior, documented intent and inferred rationale. A design's apparent benefit does not prove why its author chose it.
- Add a useful failure case or boundary when it changes understanding. For example, transaction submission does not establish execution, and an event does not establish that an indexer has caught up.
- Use a short diagram when it reduces explanation. Add wallet, receipt, indexer or cache stages only when they matter and are evidenced. For a complicated flow, build up the picture rather than starting with every component. Read [flow diagrams](references/flow-diagrams.md) for examples.

Keep the answer conversational and proportional. Do not enumerate functions in place of explaining the mechanism, demand that the learner repeat it back, or stop after two sentences when they asked for a complete walkthrough. Offer a deeper layer only when useful.

## Examples and observations

Label examples by what supports them:

| Label | Meaning |
|---|---|
| Teaching sketch | Illustrates an idea; may omit setup, error handling or production safeguards. Not a project integration. |
| Runnable, unverified | Matches inspected project dependencies/configuration and has the needed setup described, but has not been executed here. |
| Observed example | Executed in an identified environment; name the command/action and actual result, with its limits. |

Read [stack examples](references/stack-examples.md) when showing test or client code. Do not call an unresolved-version snippet runnable or invent receipts, successful tests or wallet behavior. Source inspection can establish what code does without establishing that its deployed instance matches.

Executing a local demonstration can help when the task authorizes it. Inspect the command's effects first and use the existing isolated project setup. Follow [runtime boundaries](../tools/references/runtime.md); teaching is not permission to use live funds or mutate a shared service. Record proportionate [evidence](../tools/references/evidence.md) when executing. Missing runtime access need not block a conceptual explanation; state exactly which demonstration remains unverified.
