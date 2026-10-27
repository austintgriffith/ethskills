# Isolate mutable Ethereum state

Read before workers run tests, nodes, generators or application journeys. Resource isolation is part of each assignment, not an assumption derived from a worktree.

## Reserve resources before launch

Keep a small coordinator ledger: slice, workspace/worktree, writable paths, output/cache directories, RPC/app ports, local account role, browser context, database namespace and process IDs. Inspect availability before allocating ports; do not kill the process occupying a desired port. Record secrets only as redacted aliases, never keys or authenticated URLs.

Use separate source worktrees when simultaneous edits, checkout operations or build outputs could conflict. Otherwise exclusive writable paths can suffice. Generated artifacts and caches must not overwrite another worker's output. Avoid concurrent dependency installs in a shared workspace; the integrator owns dependency and lockfile changes.

## Contract runners and forks

| Environment | Required separation and evidence |
|---|---|
| Foundry tests | Preserve each workspace's installed version, configured profile/remappings and existing command. Use separate processes and writable artifact/cache paths or worktrees. Pin the upstream fork block when reproducibility matters; record upstream chain ID, block number/hash and redacted RPC alias. |
| Anvil or another persistent fork node | Give mutating consumers distinct owned nodes and RPC ports. Record upstream provenance separately from local chain ID. Snapshots and impersonation are local to the assigned node; a snapshot does not make concurrent resets safe. |
| Hardhat 2 or 3 | Detect the package-local major/version, runner and registered plugins independently. Preserve the actual ethers-v5/v6 or viem path rather than translating commands between fixtures. Use separate test processes with isolated in-memory state, or dedicated node/configuration/ports when tests attach to a persistent network. |

A fork block pins an upstream view; it does not isolate local nonces, balances, time, mining or resets. Never reset, snapshot/revert, impersonate or alter time on a shared RPC node. If isolated execution cannot be configured with installed tools, queue the mutable checks or report the capability gap. A private node URL alone does not establish permission to mutate it.

## Consumers and services

- **Wallets/accounts:** assign local fixture accounts separately on isolated nodes. Never share a live signing account across workers to solve nonce contention. Browser access and page clicks do not establish extension, hardware or mobile signing support. Live signatures/transactions require existing explicit authorization for that action and environment.
- **Frontend/browser:** allocate distinct app ports and observed URLs. Follow user-selected and host-native browser routing. Use supported independent contexts/profiles where available; do not share mutable local storage, wallet state or extension profiles blindly. If contexts cannot be isolated, serialize browser journeys. Record actual URL, app revision when known and wallet/mock limitations.
- **Indexers/databases:** retain the installed Graph, Ponder, Envio or custom ingestion commands and schema/codegen ownership. Give each writer a separate authorized database/schema, storage namespace and service port. Record source chain/block and ingested block separately. Reset, reorg and backfill checks require an isolated target; no shared or hosted database cleanup is implied.
- **Services and configuration:** use task-scoped configuration through supported project mechanisms without exposing secrets. Inspect scripts before execution for broadcasts, deployments or remote mutations. Merely assigning a new port does not redirect a script's database or RPC target.

When one service is intentionally shared for read-only consumption, name its owner and prohibit worker resets or writes. Serialize any necessary owner-managed mutation and invalidate observations taken against the prior state.

## Close the loop

Workers report started process IDs, owned resources and logs. The coordinator stops only task-owned processes and cleans only task-owned temporary state after retaining needed evidence. Do not remove user worktrees, unrelated databases or pre-existing browser profiles as cleanup. If a resource was reused by explicit agreement, preserve its agreed lifecycle.
