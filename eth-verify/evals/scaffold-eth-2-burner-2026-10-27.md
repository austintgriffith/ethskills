# Scaffold-ETH 2 real app verification

**Run:** 2026-10-27
**Result:** PASS for the local burner transaction path; MetaMask extension assertions were not exercised.

## Target

- Fresh Scaffold-ETH 2 app generated with `npx --yes create-eth@latest --skip-install --solidity-framework hardhat`.
- Dependencies installed from the generated lockfile with `yarn install`.
- Started the project's own Hardhat node (`yarn chain`), deployed with `yarn deploy`, and served with `yarn start` at `http://localhost:3000`.
- The app's target network was Hardhat (chain ID `31337`). `cast chain-id` confirmed `31337`; `cast client` identified HardhatNetwork 3.20.0 / EDR 0.3.8. The node was observed listening on loopback at `127.0.0.1:8545`; no fork flag or external RPC was configured.

## Journey and evidence

1. Opened the running app and confirmed it connected to its local burner account.
2. Used the app's local faucet to fund the burner on the owned development chain.
3. Opened `/debug` and called `YourContract.setGreeting` through the app UI with `verify burner run 20261027`.
4. The app displayed a successful transaction receipt on chain 31337. The contract address was `0x5fbdb2315678afecb367f032d93f642f64180aa3`; the transaction was `0x101eaed46fb84ec9c0199787aac608a517fb6d7895733fc5e4986968b34a5278`.
5. Independently read `greeting()`, `totalCounter()`, and `userGreetingCounter(burner)` over JSON-RPC. The greeting matched, and both counters were `1`. Reloading `/debug` showed the persisted greeting and counter.

Screenshot: [post-transaction app state](scaffold-eth-2-burner-2026-10-27.png).

## Wallet extension status

The burner run verified the local app transaction path; it does not establish extension-provider behavior. A separate disposable Chrome profile and the official MetaMask Chrome Web Store package were used for an extension setup attempt. The host blocked the native extension confirmation/accessibility path (`osascript is not allowed assistive access`), so wallet creation and extension signing were not completed. No recovery phrase or password was captured. MetaMask-specific assertions remain unverified.

## Tool note

`cast call` against this Hardhat 3 EDR node returned `duplicate field data`; the independent reads above used direct JSON-RPC `eth_call` instead. This did not affect the app transaction or state assertions.
