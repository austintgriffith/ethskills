---
name: pilot
description: Execute Ethereum development goals through one integrated engineering workflow and relevant Ethereum knowledge. Use for building, debugging, continuing or verifying Ethereum projects, or when ethskills:pilot is requested. Ordinary factual questions use the relevant topic directly.
---

# Ethskills Pilot

Choose the smallest workflow that reaches the requested outcome. A question stays read-only; an implementation request permits scoped implementation and Verify's disposable test transactions on a positively identified owned isolated local node. It does not authorize public-network signing or broadcasts, publication, disclosure, PR creation, or messages. Reuse explicit authorization already given for those actions; ask only at a concrete uncovered boundary.

Ethskills Pilot owns execution. Supporting skills supply a technique or domain knowledge inside this loop, not a second task plan. No separate Poteto installation is required.

## One execution loop

1. State what the user will be able to do and what observable result would establish it. Discover the actual project and authority once; refresh only facts affected by a change.
2. Name the affected state, data shape and callers. Settle consequential uncertainty before implementation. Keep straightforward work straightforward; no mandatory panel, task log or new framework.
3. For substantial work, choose a small unit with a decisive check and identify what depends on it. Load only the Ethereum guidance that can change that unit's decisions. Preserve the installed stack.
4. Make the change, run the check, and inspect the actual result before starting dependent work. Diagnose or revert a failed hypothesis. A blocked check blocks its dependent claim; continue independent authorized work.
5. Verify the delivered user path through [Verify](../verify/SKILL.md) as part of the build, without waiting for a separate invocation. For wallet dApps, read and execute its [browser/wallet procedure](../verify/references/browser-wallet.md), including disposable wallet setup and real prompts on the isolated local chain. Honor the user's saved browser preference. A walletless shared preview requires permitted capability discovery and fallback before reporting a blocker. Simulated approvals cannot complete the real wallet assertion. For recurring or multi-session work, retain the actual working verification command or project driver, its inputs and limits. Run it from a fresh process before calling it reusable. More output or tests alone do not establish better coverage.
6. For long or interrupted work, preserve the goal, next action, authorization limits and evidence through [Trace pickup](../trace/references/pickup.md). On continuation read that record and inspect source/target changes before reusing earlier results. Finish with the outcome, proof and remaining limits.

This loop scales down to inspect and answer for a question. The playbooks below add task-specific detail only where needed.

## Orient, then act

1. Read applicable project instructions and the task's success condition. Resolve conflicting scope before dependent work; continue independent useful work.
2. For repository work, use [project discovery](../tools/references/project-discovery.md). Record the affected workspace, dependency resolution and executable versions, native commands, target environment, and missing capabilities. Preserve Foundry/Hardhat, client libraries, wallet and indexer choices. Do not migrate or install dependencies just to fit a workflow.
3. Read only the matching playbook below. Use [tool adapters](../tools/references/tool-adapters.md) for stack-specific operations and [runtime guidance](../tools/references/runtime.md) when selecting host tools. No model vendor, browser driver, port, or RPC endpoint is a default.
4. Before using a supporting skill, read its `SKILL.md` and applicable references, then perform its procedure. Naming a skill in a plan is not executing it. Execute through the requested stopping point. Use [evidence guidance](../tools/references/evidence.md) to tie conclusions to the actual revision and target. Report observed results and unverified boundaries; do not turn missing prerequisites into a pass.

| Request | Read | Useful direct skills, only when needed |
| --- | --- | --- |
| Understand behavior or choose a recommendation | [Investigate](playbooks/investigate.md) | [How](../how/SKILL.md), [Project Why](../why-project/SKILL.md), [Teach](../teach/SKILL.md) |
| Decide architecture or explore alternatives | [Design](playbooks/design.md) | [Architect](../architect/SKILL.md), [Arena](../arena/SKILL.md), [crops](../crops/SKILL.md) |
| Add behavior or refactor | [Build](playbooks/build.md) | [ship](../ship/SKILL.md), [TDD](../tdd/SKILL.md), [Blast Radius](../blast-radius/SKILL.md) |
| Reproduce and fix a defect | [Debug](playbooks/debug.md) | [How](../how/SKILL.md), [Project Why](../why-project/SKILL.md), [TDD](../tdd/SKILL.md) |
| Assess code, security, or readiness | [Review](playbooks/review.md) | [Review](../review/SKILL.md), [audit](../audit/SKILL.md), [qa](../qa/SKILL.md) |
| Prove behavior in a target environment | [Verify](playbooks/verify.md) | [Verify](../verify/SKILL.md), [testing](../testing/SKILL.md) |
| Prepare or perform an authorized release | [Deploy](playbooks/deploy.md) | [wallets](../wallets/SKILL.md), [frontend-playbook](../frontend-playbook/SKILL.md) |
| Improve these instructions after a failure | [Skill improvement](playbooks/skill-improvement.md) | [Reflect](../reflect/SKILL.md) |

Use [Help](../help/SKILL.md) for skill discovery. Use [Swarm](../swarm/SKILL.md) when parallel work is authorized and useful; ordinary tasks need no panel. A required independent review remains blocked if no independent reviewer is available.

## Scope topic guidance

Read Ethereum topic skills for the contracts, networks, and integrations the task actually touches. For example, contract changes use [security](../security/SKILL.md) and [testing](../testing/SKILL.md); protocol integrations also use [addresses](../addresses/SKILL.md) and [building-blocks](../building-blocks/SKILL.md). Verify unstable chain facts and deployment addresses against current primary evidence.

[Ship](../ship/SKILL.md) supplies dApp architecture and phase coverage inside this loop. Verify each dependent unit before moving on rather than building all contracts, tests and UI as separate unverified batches. [Orchestration](../orchestration/SKILL.md) and Scaffold-specific hooks/components apply only to Scaffold-ETH projects. Scope QA and frontend guidance the same way, retaining applicable behavioral checks.

Close with the outcome, material decisions, checks and their results, evidence locations, and remaining limits. Scale the report to the task; a short explanation needs no ceremony or generated artifacts.
