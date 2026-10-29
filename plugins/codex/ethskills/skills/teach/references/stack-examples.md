# Teach with the project's stack

Use this reference when a learner needs code or an executable demonstration. These are selection patterns, not tested compatibility claims or commands to copy blindly. The shared [tool adapters](../../tools/references/tool-adapters.md) own operation selection.

## Contract tests

For Foundry, locate the relevant test and `foundry.toml` profile, remappings and Solidity compiler. Explain the test's arrangement, action and assertion before selecting the existing targeted command. Verify selection ran the intended test; zero matches prove nothing.

For Hardhat, locate the relevant workspace script, resolved Hardhat version, registered runner/plugin and compiler configuration. Hardhat 2 plus ethers v5 does not imply the same API as Hardhat 3 plus viem. Follow the existing test style. Do not replace it with a Forge example or select a new runner for teaching convenience.

When showing either framework's example, identify the compiler and existing test by source location. Say which cases the assertion covers and which remain unknown. If no authorized isolated execution is available, explain the test from source and label the command unverified. Do not download a missing runner through a package command.

## Client transaction lifecycle

Read the installed API and actual call site before adapting these teaching sketches:

```ts
// Teaching sketch: ethers transaction response, not a complete integration.
const transaction = await contract.someWrite(...args);
const receipt = await transaction.wait();
```

ethers v5 and v6 both have transaction response waiting APIs, but numeric values, providers, imports and receipt types differ. Preserve the detected version and the project's replacement/error handling. Explain the signer and network from actual configuration; the sketch alone establishes neither.

```ts
// Teaching sketch: viem clients, omitting setup and receipt validation.
const hash = await walletClient.writeContract(request);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
```

Check the receipt outcome and relevant state/event before claiming the action succeeded. These sketches do not show a real wallet connection, guarantee success, or handle every failure. For wagmi or a project wrapper, inspect which hook/state covers submission, receipt and refresh. Use existing Scaffold hooks only when the project actually uses them. Do not teach a hash as a confirmed transaction.

## Wallet and indexed data

Show the detected connector, account and chain boundary when it explains the learner's flow. A wallet signature, smart-account operation identifier and executed contract action are different observations. Missing access to the wallet leaves its interaction unverified even when the application code is readable.

For an indexer, connect the actual event to its handler, schema and query. Explain chain state, ingestion progress and UI cache separately. Do not infer indexer freshness from a receipt or suggest resetting a shared database as a teaching exercise. When a stage is absent from the source or runtime evidence, describe it as a possible architecture rather than this project's behavior.
