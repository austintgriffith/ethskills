# Ethereum paths to inspect

Read only the relevant rows. These are investigation hints, not claims of tested support for every version combination. Apply the shared [tool selection rules](../../tools/references/tool-adapters.md).

| Path | What to trace |
|---|---|
| Foundry | Relevant profile in `foundry.toml`, remappings, configured source/artifact paths, imported artifact and any broadcast/deployment record. Connect the record's chain/address to the consumer; a local artifact does not prove deployed identity. |
| Hardhat | Resolved Hardhat 2/3 version, registered plugins and configured artifact paths. Follow the actual deployment mechanism: Ignition, a deployment plugin or custom scripts. Trace generated bindings to the plugin/script that owns them; do not assume ethers or a default directory from the config filename. |
| ethers | Actual v5/v6 provider, signer and `Contract` imports or wrappers; ABI/address construction; contract call; transaction response; `wait` or another receipt consumer; state refresh. Inspect version-matched numeric conversions and error/replacement handling rather than translating one major's API into the other. |
| viem | Imported ABI and arguments, chain/account configuration, wallet client used for submission and public client used for reads or receipts. Follow `writeContract` through `waitForTransactionReceipt` or the implementation's equivalent, including simulation if present. Simulation is not execution. |
| wagmi | Installed v1/v2 hook implementations, configured clients/connectors, mutation state and actual receipt hook/API. Follow query keys and invalidation/refetch. For Scaffold-ETH wrappers, inspect the imported wrapper implementation; do not assume the wrapper waits for confirmation. |
| Wallet or smart account | Connector, signing account, chain checks, bundler/relayer/paymaster and Safe or account SDK when imported. Distinguish signing, proposal/submission, outer receipt and inner action outcome. Explain existing session permissions and rejection/sponsorship paths where implemented. |
| Indexer | Manifest/configuration, contract events, ABI/codegen, schema/mapping or ingestion handler, query client and UI cache. Separate chain receipt/block, indexer ingestion position and displayed data; show where lag or reorg handling is implemented rather than assuming immediate consistency. |

When a live address matters, distinguish the proxy from its implementation, and local source from verified deployed source or bytecode evidence. Record the observed chain and block when making runtime claims. Read-only RPC or explorer evidence can narrow uncertainty; absent access leaves deployed parity unverified. Do not install tools, generate bindings, sign messages or submit transactions for this explanation.
