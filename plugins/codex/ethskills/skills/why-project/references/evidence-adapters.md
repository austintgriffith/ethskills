# Historical evidence adapters

Use only the adapter implicated by the question. These checks establish identity and narrow explanations; they do not mandate a build, test run or network request.

## Client and SDK regressions

Compare the affected imports and call sites alongside the relevant manifest and lockfile at the good and bad revisions. Separate the declared range, resolved package version and installed runtime; include the package-local plugin or wrapper when it changes semantics. A monorepo may resolve multiple versions of the same SDK.

Read the matching installed source/types or official documentation for those releases. For example, an ethers v5-to-v6 change can affect numeric values and provider APIs, but identify the actual changed call and error before attributing a failure to that migration. Current documentation cannot establish historical behavior. Preserve contrary evidence such as an unchanged resolution, a wrapper normalizing the result, or a different deployed frontend release.

## Compiler, configuration and deployments

Trace relevant Foundry/Hardhat configuration, compiler version, optimizer/via-IR settings, EVM target, remappings, linked libraries and artifact provenance across the relevant revisions. Use lockfile/plugin evidence to identify the actual Hardhat runner or deployment system; the config filename alone is insufficient. Compare existing build-info, deployment manifests and CI/release records before considering a new build.

For a deployed failure, establish chain ID, contract address, incident transaction/block and implementation identity at that block. For proxies, trace the proxy pattern and historical upgrades using existing records, events and applicable storage reads. The current implementation is not proof of the implementation at the incident. Minimal proxies, beacons and custom proxies need their actual resolution mechanism; do not assume a single implementation slot.

Use read-only RPC only when it resolves a material question and the endpoint is authorized. Verify historical-state/archive capability; errors or unavailable old state leave the claim unknown. Match historical bytecode and relevant compiler/link/metadata evidence before asserting source parity. A matching address on another chain, a repository ABI or a successful getter alone cannot establish that parity.

## Incident and decision records

Query a relevant available source with the repository, symbol, PR/ticket ID or incident time window. Attribute a stated reason to its author/source and date; later summaries may reinterpret the original decision. Compare telemetry, receipts, traces or errors with the alleged change boundary when present. Missing logs or connector access cannot rule out a competing explanation.

Prefer stable commit and review links, file locations at a revision, or identified chain/block evidence. Keep private record contents and authenticated RPC URLs out of shareable citations. Record conflicting evidence explicitly instead of choosing the most recent source automatically.
