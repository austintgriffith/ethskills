# Select operations from installed tools

Use the [project profile](project-discovery.md), existing project scripts and installed help/types first. Consult official documentation for the detected version when behavior remains unclear. These are selection rules, not a claim that every version combination has been exercised.

## Contract work

**Foundry.** Activate from the relevant configuration, source and tests. Preserve profiles, remappings, compiler and configured paths. Check installed `forge`, `cast` and `anvil` versions before selecting flags. Run the existing targeted test command before broadening. Fuzz runs and stateful invariant runs/depth are different controls. Capture failure traces, seeds and fork block/provenance for reproduction. A local chain ID does not establish isolation from shared state.

**Hardhat.** Resolve the package-local version and actual registered plugins. Inspect scripts and local task help rather than using a package runner that downloads a missing tool. Distinguish Hardhat 2 and 3, then identify Solidity versus TypeScript tests, Mocha versus Node's test runner, and ethers versus viem independently. Deployment may use Ignition, another plugin or custom scripts. Use the project's path; do not translate a Forge command into an unsupported Hardhat capability.

Read [Foundry configuration](https://www.getfoundry.sh/config/index.html) and the matching installed release's help. For Hardhat use the [v2 documentation](https://v2.hardhat.org/hardhat-runner/docs/getting-started) or [v3 testing guide](https://hardhat.org/docs/guides/testing) as applicable. If a current page differs from the installed release, use matching source/types or release documentation.

## Clients, wallets and contracts

**ethers and viem.** Follow actual imports and resolved versions. ethers v5/v6 differ in numeric and provider APIs. viem separates wallet and public clients. A submitted transaction hash does not prove successful execution; inspect the receipt and relevant state. Preserve the client's error, replacement and confirmation semantics. See the [ethers migration reference](https://docs.ethers.org/v6/migrating/) and [viem documentation](https://viem.sh/docs/getting-started).

**wagmi and Scaffold-ETH.** Resolve hook and wrapper implementations from the project. Verify which state covers wallet submission, receipt confirmation and cache refresh. Only detected Scaffold-ETH projects load [its orchestration adapter](../../orchestration/SKILL.md). A standalone wagmi app does not need Scaffold components.

**OpenZeppelin and upgrade tools.** Match installed contract major, imports, initialization and authorization model. Inspect actual proxy implementation and upgrade authority when relevant. Do not choose a new proxy pattern during an unrelated fix. Use the installed upgrade plugin and compiler-compatible storage checks where present.

**Smart wallets and protocol SDKs.** Activate only implicated packages and configuration. Record SDK version, protocol/deployment version, chain and ABI separately. A Safe proposal or UserOperation identifier is not an execution receipt. Check the inner action outcome, session limits and sponsorship failures where applicable. Missing tooling does not justify substituting an unrelated wallet or protocol.

## Indexers, proofs and hosting

**Indexers.** Detect Graph manifests, Ponder/Envio configuration or custom ingestion from real files/imports. Preserve code generation and schema ownership. Distinguish chain state, ingested block and frontend cache. Test restart/reorg/backfill behavior only against an authorized isolated database. Do not reset a shared service to create a clean fixture.

**Noir.** Inspect `Nargo.toml`, compiler/backend versions, NoirJS and proving dependencies. Read version-matched CLI help before proof generation. Establish compatibility through circuit, verification key, Solidity verifier and proof serialization provenance; installed binaries alone do not establish compatibility. See [the Noir skill](../../noir/SKILL.md).

**Frontend and hosting.** Inspect build mode, framework, base paths, configured host and deployment revision. Static export rules do not automatically apply to SSR. Use the discovered URL and existing build scripts. Verification does not authorize redeployment or replacement of the configured host.

For browser and connected-tool selection read [runtime.md](runtime.md). When a relevant adapter is unknown, inspect the existing implementation and authoritative version-matched material, state the limit, and continue independent checks. Do not claim unsupported coverage.
