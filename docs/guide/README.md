# The Ethskills Pilot guide

Ethskills combines Ethereum knowledge with engineering workflows. Give [Ethskills Pilot](../../eth-pilot/SKILL.md) a goal and a way to check the outcome. It discovers the project, selects a workflow, reads the needed skills, executes the work and reports evidence or blockers.

You do not need to manage the skill sequence. This guide walks through real prompts, expected results and the limits to watch.

## Work through the guide

1. [Set up your first project](01-setup.md). Install the skills and let your existing stack lead.
2. [Give Pilot a goal](02-eth-pilot.md). Write a useful prompt and understand the route.
3. [Understand before editing](03-understand.md). Follow the code, decisions and actual dependencies.
4. [Design within the real system](04-design.md). Compare interfaces and trust assumptions.
5. [Build and debug](05-build-debug.md). Reproduce, implement and preserve the project stack.
6. [Verify with evidence](06-verification.md). Run contract checks and actual browser journeys.
7. [Review and prepare a release](07-review-ship.md). Choose the review and deployment scope.
8. [Work with multiple agents](08-parallel-work.md). Separate ownership and mutable state.
9. [Improve the next run](09-improve.md). Turn supported lessons into better checks.
10. [Recipes and pitfalls](10-recipes.md). Copy prompts and avoid common mistakes.

Read in order for your first project, then use each chapter on its own. The [skill reference](capabilities.md) lists direct capabilities. The same Markdown chapters power the website guide and remain readable on GitHub.

## Start with one task

```text
/ethskills:pilot the deposit button can submit twice while a transaction
is pending. Reproduce it, keep our existing stack, fix the cause,
and verify the contract and browser behavior with evidence.
```

The agent should choose a debugging workflow, inspect the actual libraries, perform the relevant skills and show what it tested. Missing browser, wallet or RPC access should appear as an explicit gap.

For an explanation without changes:

```text
/ethskills:pilot explain this app's architecture and trust assumptions.
Cite the code and do not edit files.
```

## Find help without starting work

```text
ethskills:help which workflow should I use to review this integration?
```

[Help](../../eth-help/SKILL.md) explains the capability and offers a prompt. It does not start the integration review.

## Know what is installed

The toolkit consists of agent instructions and supporting references. It uses tools supplied by the agent environment; it does not install a browser, wallet or contract toolchain. Slash-command syntax varies by host. For unpublished changes, read the local skills rather than assuming the live website has the same revision.

Browser screenshots, wallet interaction, contract tests and onchain receipts establish different things. Review [verification](06-verification.md) before relying on a completion claim.

Next: [Set up your first project](01-setup.md).
