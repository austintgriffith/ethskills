# Review and prepare a release

Review and verification have different jobs. [Verify](../../eth-verify/SKILL.md) executes checks. Reviewers assess the change, risks and evidence.

## Choose the review scope

| Skill | Responsibility |
|---|---|
| [Review](../../eth-review/SKILL.md) | General engineering review of a design or change. |
| [Security](../../security/SKILL.md) | Defensive implementation guidance. |
| [Audit](../../audit/SKILL.md) | Specialist contract-security investigation. |
| [QA](../../qa/SKILL.md) | Independent assessment of applicable finished-app behavior. |
| [CROPS](../../crops/SKILL.md) | Trust, permissions, privacy, freedom and user exit. |

```text
ethskills:review review this change for behavior regressions and
integration risks. Cite reproducible findings. Do not modify code
or publish the findings.
```

A finding should connect affected code to an actual consequence. Version-sensitive advice must match the installed dependency. Dismiss unsupported or irrelevant concerns with a reason rather than applying every suggestion.

## Prepare the release

```text
/ethskills:pilot prepare this app for production. Check contracts,
permissions, frontend configuration and wallet journeys.
Report remaining blockers. Stop before deployment.
```

The agent checks the actual configured deployment path and host. A static export and an SSR deployment have different requirements. [Wallets](../../wallets/SKILL.md), [Gas](../../gas/SKILL.md) and [Frontend Playbook](../../frontend-playbook/SKILL.md) provide relevant guidance, scoped to the detected stack.

When deployment is explicitly requested and its target and scope are established, that authorization covers the necessary deployment actions. It does not cover unrelated transfers, arbitrary signatures or public disclosure.

## Know what review does not establish

If independent review is required, the author's self-review cannot replace it. Missing reviewer capacity is a blocker for that gate. An agent audit report is not a security certification. Public issue filing requires authorized disclosure, even when a vulnerability was found.

The toolkit does not automatically create or merge a PR, broadcast a transaction or publish a website merely because implementation is complete.

Next: [Work with multiple agents](08-parallel-work.md).
