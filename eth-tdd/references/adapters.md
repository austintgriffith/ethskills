# Preserve the regression environment

Read only the relevant adapter. These selection procedures do not claim every tool/version combination has been tested. Resolve commands from the target project's scripts, installed help and existing tests; do not download or migrate tools to fit an example.

## Foundry

Keep the relevant workspace's `foundry.toml`, effective `FOUNDRY_PROFILE`, remappings, compiler/EVM settings and test paths. Add the behavioral case beside the affected tests and select it using supported path/contract/test filters on the existing command. Confirm the selection executes a test.

Retain fuzz seed, counterexample and configured run count; keep invariant handler, runs and depth when the bug needs stateful reproduction. Replaying one counterexample proves that case, not the whole input space. Do not silently switch to the default profile or reduce fuzz/invariant settings for green.

## Hardhat 2 and 3

Inspect the package-local resolved major, registered plugins, actual script and test files. Distinguish Solidity tests, Mocha and Node's test runner separately from ethers or viem. Use the existing fixture/reset mechanism and supported test-file/name selector; do not assume a Mocha `--grep` option applies to every runner or that Solidity tests require Forge.

Hardhat 2 projects may use ethers v5 or v6; preserve their provider, numeric and assertion conventions (`BigNumber` versus `bigint`) and existing matcher plugins. Hardhat 3 projects may use Solidity tests, Mocha or Node's runner with ethers or viem; preserve the configured task, network connection and fixture APIs. Do not rewrite allowance or revert tests into another client's syntax as part of a behavioral fix. Check installed task help/types for unsupported variants and report limits instead of inventing flags.

## Frontend and browser

Use the affected workspace's existing Vitest, Jest, component, Playwright or Cypress command and configuration. Preserve connector/client bindings, test environment, base URL, browser project and wallet fixtures. Do not substitute a contract unit test for a UI submission/race defect.

For an approval double-submit regression, drive the actual affected controls, hold the established test provider/transaction in its pending state, repeat the action and assert the expected submission count and disabled/loading behavior. Synchronize on observable events or existing fixture controls rather than fixed sleeps. Confirm red reaches that interaction and fails on the predicted duplicate submission or missing guard. Label provider mocks: this proves the UI behavior under that fixture, not extension signing or public-network execution.

## Fork-dependent behavior

Use the existing authorized fork adapter with a pinned chain ID, block number and preferably block hash, deployed contract/implementation identity, ABI and fixture provenance. Keep the same state/reset boundary in red and green. A changing latest block can invalidate the comparison. Never guess protocol addresses or replace a real integration with mocks just to get a passing result.

Inspect setup for accidental broadcasts or shared services before running it; read-only fork data access and isolated simulated transactions have different effects from live writes. Redact RPC credentials in commands/output. If required data or access is missing, record the blocker and run independent local checks without claiming fork coverage.
