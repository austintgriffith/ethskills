# Hardhat verification adapter

Resolve the workspace-local Hardhat version before choosing commands or APIs. Read project scripts, config imports, test files and installed dependencies; record runner, network helpers, client and matcher/plugin versions. Prefer the existing script with its selected network/profile. Inspect local help for supported test selectors and runner tasks. No silent install, upgrade, new toolbox or conversion to Foundry.

## Hardhat 2

The [v2 contract testing guide](https://v2.hardhat.org/hardhat-runner/docs/guides/test-contracts) describes a Mocha/Chai/ethers setup; it does not establish that this project's plugins or ethers major match the examples. Older projects may use `@nomiclabs/hardhat-ethers` and ethers 5; others use `@nomicfoundation/hardhat-ethers` and ethers 6, Viem or custom tasks. Inspect actual imports and resolved peer dependencies.

Select a test file using the configured test task's supported syntax; use Mocha filtering only if Mocha is active. Use installed helper APIs for fixtures, time and mining rather than copying Foundry cheatcodes. If using Viem, consult [the v2 Viem integration](https://v2.hardhat.org/hardhat-runner/docs/advanced/using-viem) and installed plugin sources. Do not assume that importing ethers or Chai activates Hardhat matchers.

## Hardhat 3

Use the [Hardhat 3 testing overview](https://hardhat.org/docs/guides/testing) and the installed runner/plugin documentation. Solidity tests and TypeScript tests are different paths; discover which are configured and required. Inspect the config's plugins and existing tests for Mocha, Node test runner, ethers or Viem. A v2-style `hre.ethers` example is not a universal v3 interface. For example, the [Node test runner plugin](https://hardhat.org/docs/plugins/hardhat-node-test-runner) applies only when installed/configured; a different runner's flags and assertions cannot be assumed.

Run targeted files/tasks using local help, then relevant configured suite gates. Record each runner's selected test count and outcome; an absent TypeScript runner cannot be reported as successful TypeScript coverage. Preserve network type, chain simulation/fork configuration and active build profile. For unsupported combinations, inspect installed types/sources and the matching [Hardhat release](https://github.com/NomicFoundation/hardhat/releases); report the limitation if a safe invocation cannot be established.

## Receipt and state checks

A submitted transaction and a successful receipt are distinct. Ethers 5 uses its own BigNumber and transaction/receipt interfaces; ethers 6 uses bigint in many places. Viem writes commonly return a hash requiring a separate public-client receipt wait. Match the installed client's receipt status/replacement semantics, confirmation policy and read APIs. Independently read relevant balances, allowance, ownership or positions after confirmation and compare with expected raw-unit amounts and rounding tolerances. UI cache refresh is a separate assertion.

Sources: [ethers 5 receipt](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionReceipt), [ethers 6 receipt](https://docs.ethers.org/v6/api/providers/#TransactionReceipt), [Viem receipt wait](https://viem.sh/docs/actions/public/waitForTransactionReceipt). Current client docs must be checked against installed versions; never paste their latest API into an older workspace blindly.

For both majors, establish ephemeral test-node/fork isolation before running helpers that impersonate accounts, change balances, reset state or mine. Pin fork network/block for integrations and report RPC prerequisites. Config loading or a test script can execute code: inspect custom tasks for deploy/broadcast/shared-state side effects before invoking them. Preserve evidence of meaningful unauthorized, amount-boundary, economic and integration assertions; no selected tests is not a pass.
