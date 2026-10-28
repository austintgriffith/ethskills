# Improve the next run

A useful toolkit learns from evidence without accumulating a rule for every unusual session.

## Reflect on a completed task

[Reflect](../../eth-reflect/SKILL.md) proposes lessons from the task's actual decisions, versions, failures and proof.

```text
ethskills:reflect identify what this task taught us.
Distinguish reusable lessons from version-specific issues and
unsupported guesses. Propose changes before editing the skills.
```

One incident can suggest a hypothesis. It does not establish a universal policy. A library-version issue belongs in its relevant adapter rather than every skill.

## Enforce a recurring correction

[Correct](../../eth-correct/SKILL.md) looks for distinct occurrences with the same mechanism, then chooses an appropriate structural fix.

```text
ethskills:correct agents repeatedly edit generated contract bindings.
Find distinct examples and, within this task's scope, add the
smallest reliable check using our existing tools.
```

Prefer making the mistake impossible through structure or types where practical. Otherwise use an existing lint or a meaningful test. A check should reject a real historical defect and accept its correction. Documentation is appropriate when the rule requires judgment and cannot be enforced directly.

Several failed patches to one bug do not establish separate recurring incidents. Continue diagnosis before designing permanent enforcement.

## Keep the evidence useful

[Trace](../../eth-trace/SKILL.md) keeps a local task decision/evidence log when substantial work warrants it. Record source, affected workspace, tool versions, relevant environment, decisions and actual results. Keep credentials, private links, signatures and proof witnesses out of shareable records.

Before claiming a skill improvement, compare current and proposed instructions on the same realistic task. [Contributing](../../CONTRIBUTING.md) describes factual triage and workflow evaluation. Structural validation alone does not establish better agent behavior.

**Pitfall:** reflection does not independently authorize editing unrelated skills or sending feedback externally.

Next: [Recipes and pitfalls](10-recipes.md).
