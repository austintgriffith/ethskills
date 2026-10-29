# Trace the affected surface

Use only the sections implicated by the change. Build evidence paths from actual project files; the consumers below are search targets, not claims that a particular project has them.

## Compiler, dependencies and proxy state

Compare the resolved compiler, optimizer, EVM target, remappings, dependency versions and local patches across the baseline and candidate. Follow changed imports and inheritance into the version actually used. An unchanged contract source or ABI does not clear a compiler or OpenZeppelin upgrade.

For proxies, identify proxy kind, deployed implementation baseline, storage model, initializer/reinitializer lifecycle and actual upgrade authority from evidence. Trace inherited storage, packed slots, type/struct changes, gaps and namespaced storage according to the installed version. Include initializer ordering, implementation locking, authorization and admin/ProxyAdmin or beacon consumers where applicable. Do not infer the proxy kind from a contract name or prescribe a replacement pattern.

Use existing Foundry `out`/build-info or Hardhat artifacts/build-info only when detected. Locate configured output paths. Compare compiler storage layouts only when both sides have matching source/configuration provenance; ABI-only artifacts cannot establish layout compatibility. Inspect existing upgrade manifests and installed upgrade tooling when present. A manifest is deployment evidence, not by itself a successful storage validation. A stale or absent baseline prevents a storage-safety verdict. Running an upgrade validator or rebuilding artifacts is a separate execution step.

## ABI and generated bindings

Compare canonical input types/selectors, overloads, output and tuple shapes, mutability/payability and custom errors. A return-type change can leave a selector unchanged while breaking decoding. An unchanged interface can hide changed units, rounding, access control, revert conditions or callback behavior.

Trace ABI export/copy scripts, code generation configuration and committed/generated bindings into actual ethers, viem, wagmi, Scaffold or other client imports. Resolve versions independently; Hardhat 2 with ethers v5 does not justify Foundry or ethers v6 examples. Check raw ABI fragments, selector constants, multicall encoders, scripts, bots and backend services, not only typed imports. Generated files may be stale: record their provenance and the existing generation command without running it during inspection. A typecheck alone cannot establish deployed ABI compatibility.

## Events, ingestion and query consumers

Compare canonical event signatures/topics, parameter order/types and indexed flags. Changing `indexed` can preserve the event signature topic while changing the split between topics and data and breaking decoders. Include anonymous events and overloaded event handlers if present.

Trace actual Graph manifests/mappings, Ponder/Envio configuration or custom log decoders through handlers, entity/schema writes, stored identifiers and frontend/backend queries. Follow ABI source, chain/address filters, deployment start blocks and release ordering. Schema compatibility does not prove historical backfill or reorg correctness; flag whether a migration/reindex would be needed and whether the old history can still decode. Do not reset a service or database to investigate it.

## Signatures and permits

Trace the exact signing format and verification path: typehash and ordered field types, domain name/version, chain ID, verifying contract, nonce source, deadline and replay rules. For proxies, distinguish signing for the proxy from implementation addresses and inspect domain caching/recomputation in the installed implementation. Inspect EIP-1271 or other account paths only if implicated.

Follow token/permit variant and client API from resolved dependencies into generated bindings, typed-data builders, relayers and verification calls. Do not assume every permit uses the same struct or nonce behavior. Determine whether an upgrade or address/domain change invalidates pending signatures or accepts an unintended replay. Source agreement leaves signature validity unproven until the relevant authorized check runs; never request or expose a live authority-bearing signature as report evidence.

## Deployment and downstream consumers

Follow chain ID, address, implementation, ABI and admin/role configuration into deployment scripts/manifests, address registries, frontend configuration, indexers, keepers and integration packages. Check whether a change requires consumer updates or an ordered rollout. Include authorization changes that invalidate the current operator or widen authority, even with an unchanged ABI.

Keep repository deployment records separate from observed chain state. Read-only live observations require a relevant authorized target; record chain, block and implementation identity when available. Source references and local manifests cannot enumerate external contracts, integrators, cached ABIs, outstanding signatures or users of an old deployment. State that limit, name any known external integration from evidence and explain which compatibility claim remains unresolved.
