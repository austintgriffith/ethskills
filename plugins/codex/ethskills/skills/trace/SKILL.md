---
name: trace
description: Keep a reviewable local decision and evidence trail for substantial or unattended Ethereum engineering work, or when explicitly requested. Trace here means task decisions and verification provenance, not EVM execution debugging; trivial questions need no log.
---

# Trace

Keep one small task record that lets a reviewer distinguish what was proposed, authorized, attempted and observed. Reuse an established task log instead of creating a second one. Logging does not authorize new work, signing, broadcasting, publishing or disclosure.

## Start with the existing task

Use the current request and relevant task context; do not search unrelated conversations or private history. For repository-dependent work reuse [project discovery](../tools/references/project-discovery.md), [tool adapters](../tools/references/tool-adapters.md) and [runtime capabilities](../tools/references/runtime.md). Do not build another scanner or install tools for logging.

Default to local `.audit/<task-slug>/` with `context.json`, `decisions.tsv` and `evidence/`. Keep these uncommitted and unpublished unless already authorized; use an approved local artifact location when repository writes are outside scope. A read-only explanation can cite existing source directly without creating files. Do not alter ignore rules or introduce a logging service just to keep the trail.

Copy [the TSV header](references/decision-log-template.tsv) to start a log. The [context schema](references/context.schema.json) is an optional shape for a machine-readable snapshot, not a prerequisite to doing the task. Record only relevant facts; use `null` plus a gap explanation for unknowns, and omit inapplicable fields.

For substantial work that will continue across sessions, use [durable pickup](references/pickup.md). Its small helper preserves a goal and next action with selected source/evidence hashes. On continuation, inspect that record before reconstructing the task. A matching checkpoint is not a passing application check or renewed authority for external actions.

Bind each evidence-producing checkpoint to:

- **Source:** revision, relevant workspace and dirty state; fingerprint relevant staged, unstaged and untracked source contents, with the included paths and hashing method. A SHA alone does not identify dirty work. Exclude the task log itself and secret files from the fingerprint; declare exclusions and the resulting limit. Record relevant configuration and lockfile fingerprints, resolved dependencies, executable versions and unresolved conflicts separately from declared ranges.
- **Target:** requested and observed sanitized app URL, discovery source and observation time; hosted build revision only when deployment evidence establishes it. Record relevant chain ID, contract and implementation addresses, fork source category and actual block number/hash. Do not infer upstream fork identity from a local node's chain ID.
- **Authority:** allowed operations and their scope from the existing session, plus actual signer/browser/RPC capabilities and missing access. Record a reference to the authorization or a minimal summary, not private conversation history or signing material.

Preserve earlier snapshots as `evidence/context-<checkpoint>.json` when source, dependencies, configuration, network or target changes. `context.json` may hold the latest snapshot; evidence records point to the snapshot they used. Never relabel old checks as verification of a newer target.

## Log decisions and checkpoints

The canonical TSV columns are `ts`, `phase`, `decision`, `why`, `evidence`, `result`. Use an ISO8601 timestamp, concrete choice/action and plain reason. Evidence cells contain resolving paths, source locations or safe links rather than copied output. Keep cells single-line without embedded tabs. Prefix cells beginning with `=`, `+`, `-`, `@` or `"` with an apostrophe when exporting potentially untrusted text to TSV.

Append a row for a meaningful choice, completed unit and verification result, pivot, revert, authorization boundary or blocker. Skip routine tool calls. Label unexecuted choices **PROPOSED** and attempted work **ATTEMPTED**; do not write either as an observed success. For verification results use the [shared assertion statuses](../tools/references/evidence.md): **PASS**, **FAIL**, **BLOCKED**, **NOT APPLICABLE**, with the assertion scope and reason in the linked evidence.

Keep the trail append-only. Correct a bad claim with a new row naming the superseded row by timestamp and decision; preserve the correction's evidence. On pickup, read the recent rows and append a `start` checkpoint identifying the run and prior checkpoint being resumed. Do not claim authorship of earlier observations. No transcript archive is required.

## Attach evidence already produced by the work

Capture existing execution results once; do not rerun checks solely to populate a log. Each operation record links its context snapshot and states the sanitized command/API action, working directory, tool/version, start/end time, exit code or API outcome, expected behavior, actual observation, assertion status, artifact pointers and limits. Record activation/configuration, runner/plugins/client versions and the local or official source used to choose an adapter when that choice matters. Missing capabilities remain explicit.

- For contract tests, retain selected/executed test counts and meaningful assertions, failure seeds or counterexamples. Record actual fork block and provenance. Zero tests or an infrastructure failure cannot establish a passing assertion.
- For browser work, retain observed target, scoped actions and relevant sanitized screenshots/errors. Unknown hosted revision stays unknown; source checks cannot prove hosted parity. Label wallet mocks and simulations.
- For onchain actions already authorized and executed, record chain/address, action, receipt outcome and relevant state/events. Wallet approval, submission, confirmation and application refresh are separate observations; an outer smart-account receipt may conceal an inner failure. A hash alone proves no success.

Use [Verify](../verify/SKILL.md) for actual checks and link its outcomes here. This skill records work; it does not duplicate verification or claim a particular framework combination has been tested.

## Sanitize before persistence

Never capture credentials, private keys, authority-granting signatures, authenticated RPC/hosting URLs, private proof witnesses or unrelated personal data in the record. Replace sensitive URL components with a safe environment label; include only a public URL when known to be safe. Do not dump environment variables, full configuration or wallet payloads. Inspect screenshot content before saving to the trail; omit or redact sensitive areas first. If safe capture is unavailable, record the evidence gap instead. Keep content hashes and minimal provenance rather than secret input bytes.

## Close the trail honestly

Resolve this run's evidence pointers, check that observations support their claims and add corrections for material gaps. Compare with available task outputs and context only; do not crawl user history. Recheck source/target identity before claiming the final result applies to them. Summarize what works, fails or remains unverified and link the local log. Retain unknown revisions, unavailable signers and unrun checks as limits. [Reflect](../reflect/SKILL.md) can consume these pointers later without promoting proposals into facts. Do not automatically commit, upload or publish the trail.
