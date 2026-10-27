# Verification evidence

Use the shared [evidence contract](../../tools/references/evidence.md). The records below are the dApp-specific minimum. Use the target project's established audit location or `.audit/eth-verify/<run-id>/`. Create a unique run ID, retain evidence after cleanup and do not commit artifacts automatically.

## Run record

Save `manifest.json` containing these fields, adapted to the shared schema if present:

- `run`: ID, start/end timestamps, requested task, verified scope and authorizing context for writes.
- `project`: root and relevant workspaces, HEAD/dirty fingerprint, manifest/lockfile provenance, installed tool/plugin/client/browser versions, effective configuration/profile and selected test runners.
- `target`: requested/final URL, release revision or explicit unknown, source parity conclusion, frontend/wallet/RPC chain IDs, contract addresses/code or implementation identity, fork upstream/block/hash, isolation evidence. Store redacted endpoint identity only.
- `operations`: command or documented tool action, cwd, nonsecret relevant environment/config, start/end, exit/result, log/artifact paths and process/session ownership when applicable.
- `assertions`: ID, required/optional, scope (`contract`, `browser`, `wallet`, `receipt`, `state`), expected, observed, status, evidence paths and blocking prerequisite or inapplicability reason.
- `limits`: mocks, missing capabilities, unproven identities and unobserved flows.
- `cleanup`: owned resources, teardown outcome, remaining resources and confirmation that evidence survived.

Use explicit null/unknown values for unavailable identity, never guessed values. Do not save a full environment dump, seed, private key, authenticated RPC URL or unreviewed browser storage. Inspect screenshots, traces and console logs for private data before sharing. Keep sensitive originals private or replace them with redacted evidence; record the redaction and any resulting limitation. Evidence creation does not authorize external upload or publication.

## Per-journey record

A JSON or Markdown action/assertion record should give: timestamp, entry point, start state, semantic control/action, expected transition, actual result and screenshot/log paths. Name artifacts consistently, for example `journey-deposit/01-before.png`, `02-pending.png`, `03-after.png`. Missing capture is a stated limitation; do not create a screenshot-shaped placeholder.

Store command logs, relevant traces, available console/network errors and receipts/state read results next to the journey record. Capture unsuccessful attempts too. For state assertions record block/context, raw amounts and decimals; formatted UI values alone can hide scale errors. Store receipt confirmations and UI refresh as separate assertions with separate observations. Include actual selected test names/count and fork metadata; a successful exit from an empty test selection proves nothing.

## Verdict and handoff

Use [the report template](../templates/report.md). State what actually ran, what failed and what was blocked. Report `NOT_APPLICABLE` only with a concrete reason, not for unavailable tools or absent preconditions. Missing seed data for a required journey is a blocker, not permission to weaken its expected behavior.

Any required failure makes the overall verdict `FAIL`; otherwise a required blocker makes it `BLOCKED`; only all required applicable passes yield `PASS`. A failing optional check remains visible even when outside the overall required scope. Distinguish source verification from hosted observations when revision parity is unknown. List exact prerequisites and independent safe checks completed.

Stop owned processes using recorded handles, not broad process-name kills. Remove only run-created scratch data; preserve all proof. Record teardown failure and remaining handles for follow-up. Never reset a reused shared instance during cleanup. Finish by confirming evidence files still exist, then link the report and key proof in the final response.
