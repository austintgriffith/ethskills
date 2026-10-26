# Follow dependencies from the entry point

Read this when the explanation crosses package boundaries or relies on generated ABI/types. Reuse the [project profile](../../tools/references/project-discovery.md); do not inventory every package.

1. Find the requested route, hook, script or contract and its callers. Follow imports through workspace `exports`, TypeScript aliases, bundler configuration, Solidity remappings and linked packages. An import name alone does not establish which source or dependency version runs.
2. For each consequential dependency, distinguish the manifest range, lockfile resolution and installed implementation/types. Trace from the consuming workspace. Multiple versions may coexist; a root dependency is not necessarily the consumer's version.
3. For generated ABI, bindings or deployment maps, identify the imported file, its producer script/plugin, input contracts/artifacts and configured output path. Check whether it is committed output, freshly evidenced generation or output of unknown provenance. Do not regenerate files just to explain them.
4. Follow environment and configuration selection to the chain, address, transport and connector without printing secrets or authenticated URLs. Cite where values are selected; a variable name does not prove its live value.
5. Stop at a boundary once its contract with the caller answers the question. If an import, generated producer or deployed identity cannot be resolved, state the missing edge instead of filling it with a likely framework convention.

For a broad walkthrough, a compact evidence chain is useful:

| Edge | Useful evidence |
|---|---|
| UI → client | Imported hook/wrapper, consuming package and resolved version |
| client → contract | ABI import, chain/address selector and method arguments |
| contract → generated API | Solidity source, artifact producer and generation configuration |
| receipt → UI | Receipt consumer, cache invalidation/refetch or indexed query |

Do not conflate TypeScript types with runtime validation, an ABI with deployed bytecode, or a deployment record with proof that its address still runs the same implementation.
