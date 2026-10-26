# Verification target discovery

Use the canonical [workspace discovery procedure](../../tools/references/project-discovery.md). This reference adds the identity checks required before driving a dApp.

## Source and tools

Read nearest project instructions, any existing verification driver and feature map, workspace manifests, package scripts, lockfiles, CI and current configuration. Enumerate contract and frontend workspaces with their working directories; do not assume a framework or `packages/nextjs`. Record source HEAD and dirty-file fingerprint, including relevant untracked changes without storing secret contents. A git diff alone omits untracked work.

Record declared ranges and resolved installed versions separately: package manager/Node, contract runner, Solidity compiler, client library, wallet connector, browser harness and relevant plugins. A lockfile is not proof that an executable is installed. Prefer workspace scripts and local executables. Do not run `npx`, `dlx` or an equivalent fallback that may download a tool; resolve the existing executable and use local help. Config filenames do not prove capabilities. Inspect config imports, test imports and script bodies for active plugins, runner, profile, remappings, networks and custom tasks. Reconcile stale documentation with actual installed/configured behavior; report ambiguity that affects execution.

## Choose and identify the target

Use the first supported target source:

1. User-selected URL or existing project driver target, with an explicit user URL taking precedence.
2. Deployment metadata corroborated by available hosting read tools.
3. Current application tab demonstrably associated with this project.
4. Documented configuration and the actual launch-output URL of an instance you start.

An unrelated current tab or listening port is not evidence. Record requested URL, observed final URL and redirect chain when available, retaining scheme, path and nondefault port. Unknown target is `BLOCKED_TARGET`; never probe a guessed localhost default as the application.

Doctor checks:

| Identity | Evidence to obtain |
|---|---|
| App | Expected title/routes and project-specific visible behavior; auth ready without exposing credentials |
| Source to host | Source HEAD/dirty fingerprint; deployed build/release revision from trusted metadata when available; whether this exact change is present |
| Frontend | Effective chain configuration and contract address source, including runtime overrides |
| Wallet | Connected account type and chain, only when connected through authorized flow |
| RPC | Chain ID and observed head; provider identity in redacted form |
| Contracts | Address and deployed code; implementation identity for proxies where relevant; ABI/source match limitations |
| Isolation | Owned node process/session or verified test infrastructure, unique data/ports, upstream fork network and pinned block |

Chain ID alone proves neither contract identity nor fork isolation. A mainnet fork can share its upstream chain ID. An RPC hostname containing `test` is not proof of isolation. Read-only chain probes may use the installed client's equivalent of `eth_chainId`, `eth_getCode` and `eth_getBlockByNumber`; capture results with a timestamp and redacted endpoint identity.

For hosted source mismatch, report observed hosted behavior separately and block changed-source certification. Frontend/wallet/RPC chain mismatch blocks writes; it can still be a deliberately tested wrong-network UI state. Missing addresses or code cannot be filled from memory.

## Launch and ownership

Before reusing an instance, establish its app identity, ownership and whether driving it could disturb a shared session. Do not reset a user's node, database or wallet. If reuse is unsafe, start an isolated instance only within authorized scope. Discover actual flags in project scripts/help; do not force a port flag through an unsupported wrapper. Track the process handle/session and descendants you own. A server accepting connections is insufficient: confirm the expected route, seeded preconditions and chain are ready. Record startup failures; clean up the owned attempt before retrying.
