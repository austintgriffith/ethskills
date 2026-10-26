# Keep candidate state separate and measurements comparable

Use the shared [tool adapters](../../tools/references/tool-adapters.md) for operation selection. This reference supplies comparison-specific constraints, not portable command promises. Inspect installed help/types and matching official documentation when command semantics are uncertain.

## Candidate allocation

Record one allocation per candidate:

| Resource | Required property |
|---|---|
| Source | Same starting revision and relevant uncommitted changes, exclusive worktree/output directory, frozen final diff. |
| Dependencies | Same lockfile resolutions and tool versions; reuse immutable caches only when safe, with separate writable outputs. |
| Configuration | Same effective compiler, optimizer, EVM/hardfork, test profile and environment inputs. |
| Chain | Separate local node or verified independent in-process state, same upstream chain/block/hash and fixtures. |
| Accounts | Disposable local-only identities and equivalent balances/roles; fresh nonce/allowance state. |
| App/browser | Distinct service ports, build/cache outputs and supported browser profiles/contexts. |
| Data | Separate database/schema/indexer namespace; same seed dataset and ingestion block. |
| Lifecycle | Owned process/session identifiers and exact disposable paths; evidence location survives cleanup. |

Check effective endpoints before writes. A chain ID, localhost hostname or wallet label alone does not prove isolation: a script can still use a remote signer or database. Inspect configured destinations without printing credentials. Do not copy production secrets into worktrees. If the environment cannot be isolated, restrict the comparison to read-only artifacts and report blocked execution.

A clean worktree from HEAD omits the user's dirty changes. Preserve the relevant baseline through a scoped patch/copy or another project-supported method, without committing or discarding their work. Exclude unrelated data and secrets. Verify candidate baseline equality before edits. Avoid writable symlinked build directories that reconnect otherwise isolated candidates.

## Foundry

Use existing targeted Forge commands with the discovered profile/remappings/compiler and installed version. Pin the fork block and record its hash; retain RPC provenance privately with secrets redacted in reports. Give persistent Anvil instances distinct ports and state paths, and verify which instance each command targets. In-process tests also require independent fixtures and deterministic setup.

Use the same fuzz seed, cases and invariant run/depth settings for reproduction. A useful broader fuzz run may follow, but results from a different workload are not a matched gas comparison. Use existing snapshot/report facilities only when present and supported. Capture test discovery, exit status, failure traces and actual measurement scope, rather than treating command success alone as proof.

## Hardhat

Preserve the relevant package's resolved Hardhat version, plugins, client and runner. Hardhat 2 with ethers v5 and Hardhat 3 with viem are distinct environments; do not translate both into the same assumed command/API. Use existing scripts or installed local tasks. Never let a package runner download a missing binary silently.

Allocate distinct persistent node endpoints or independent configured in-process networks. Preserve compiler/hardfork and fixture/reset behavior. Gas evidence needs an existing compatible reporter or receipt harness; without it, report the gas criterion unmeasured. A receipt measures the specified transaction, not a whole user journey. Do not install a reporter simply to fill the rubric.

## Frontend and indexers

Follow the actual ethers/viem/wagmi or Scaffold bindings and existing browser harness. Honor host-native browser routing and the selected browser. Use disposable local wallets where authorized, report mocks, and distinguish submission, receipt success, state/indexer update and UI refresh. An available browser does not prove extension-signing capability.

Use separate indexer databases and namespaces with matched start blocks and seed data. Wait for comparable ingestion before comparing UI latency or query behavior. Do not reset a shared indexer to manufacture a benchmark. Missing browser, signer, RPC or indexer access blocks the corresponding assertion; contract tests cannot stand in for it.
