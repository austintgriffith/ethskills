# Discover the relevant project

Use this procedure when the task depends on a repository or running application. A general Ethereum question does not need a repository scan. Directly invoked skills use the same procedure as Ethskills Pilot.

## Scope the evidence

Read the task, project instructions and relevant workspace entry points. Find the affected package before selecting a command. Inspect package manifests, lockfiles, `packageManager`, workspace configuration, scripts and CI. A tool in another package is not automatically the tool for this task.

Record declared dependency ranges separately from lockfile resolutions and installed executable versions. If they disagree, inspect the actual command resolution before execution. Missing evidence stays unknown. Do not install or upgrade a tool merely to match a skill example.

For contract work inspect `foundry.toml`, remappings and profiles, or `hardhat.config.*`, the resolved Hardhat version and registered plugins. Include the compiler, optimizer and EVM target where they affect behavior. A Hardhat filename does not identify its test runner, ethers version or viem plugin.

For frontend work follow imports, generated ABI/types and configuration to the actual client, connector and framework. Inspect only implicated wallet, smart-account, protocol, indexer or proving dependencies. Activate Scaffold-ETH guidance from actual project structure and imports, not from the presence of wagmi alone.

## Find the application target

Respect the user's selected target. Otherwise inspect existing project verification instructions, deployment metadata, hosting read tools, a project-associated browser tab, and documented launch configuration. Corroborate candidates with observed identity and reachability. An old README URL, environment variable name or open tab alone is a candidate, not proof.

If starting a local service is within scope, use the existing command and observe its announced URL. Do not assume a port, scheme or base path. Do not stop or reuse an unrelated process. When multiple plausible targets remain, ask which environment to test before dependent work.

Record requested and final URL, redirects, environment, relevant chain IDs and contract addresses. Record source revision and dirty changes separately from the hosted build revision. Unknown source-to-host parity limits the claim to observed hosted behavior.

## Keep a small working profile

Capture these facts in the task context or the project's established verification record. A new profile file or discovery program is optional, not a prerequisite.

| Field | Evidence |
|---|---|
| Relevant workspace and source | Package path, revision and relevant uncommitted changes. |
| Dependency versions | Config paths, lockfile resolutions and executable versions. |
| Commands | Existing script, working directory, profile, runner and plugins. |
| Runtime capabilities | Callable CLI, browser, RPC and connected tools; note access limits. |
| Application target | Observed URL, identity, environment and build revision if established. |
| Chain target | Chain ID, deployment/implementation address and fork block/provenance where relevant. |
| Permissions and gaps | Authorized actions, unavailable capabilities and unresolved conflicts. |

Reuse the profile while its evidence remains valid. Recheck affected facts after changes to dependencies, configuration, deployments, accounts, networks or the target URL. Do not print secret values while inspecting configuration. Redact authenticated RPC URLs and private deployment links in shareable evidence.

For operation selection read [tool-adapters.md](tool-adapters.md). For scoped proof read [evidence.md](evidence.md).
