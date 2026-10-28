# Ethereum verification: se2-burner-metamask-20261028

Skill revision: Verify at commit `83dd9db`, run by a fresh agent given only the skill.

Overall: PASS. Every required assertion passed. One optional check failed: the Send button is not disabled while the transaction is being mined (see Defects).

Verified scope: a fresh Scaffold-ETH 2 app (Foundry flavor), running against its own local Anvil chain. On the Debug Contracts page, `YourContract.setGreeting` was written once through the burner wallet and once through a real MetaMask extension. Each write is backed by a successful receipt, the expected `GreetingChange` event, independent `cast` reads before and after the transaction, and the app's UI checked both before and after a reload. The MetaMask leg also covered connecting, the wrong-network warning, add/switch network, rejecting a transaction and retrying, and the pending state under controlled mining.

Source/workspaces: `/tmp/se2-verify`, created by `npx create-eth@latest se2-verify -s foundry`, commit `4dbcfae` ("Initial commit with create-eth @ 2.0.23"). The only uncommitted change is `packages/nextjs/contracts/deployedContracts.ts`, which `yarn deploy` regenerates. Workspaces: `packages/foundry` and `packages/nextjs`. No project-local verification skill or driver exists. `AGENTS.md` was read.
Target: the dev server's launch output URL was `http://localhost:3000`. The journey used `http://localhost:3000/debug`, and the final URL matched with no redirect. Local source only, so no hosted parity question arises.
Network/contracts: chain ID 31337 on the frontend (`targetNetworks: [chains.foundry]`), the wallet and the RPC. RPC: `http://127.0.0.1:8545`, client `anvil/v1.5.1`, owned process started by `yarn chain`, loopback bind. `YourContract` is at `0x700b6a60ce7eaaea56f065753d8dcb9653dbad35`, deployed in block 1 with 1930 bytes of code. Owner is `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`. Not a fork.
Tools: Node 22.18.0, Yarn 4.13.0, create-eth 2.0.23, forge/anvil/cast 1.5.1-stable (b0a9dd9), solc 0.8.37 (EVM prague, optimizer on), Next.js 16.2.12 (Turbopack dev), wagmi 2.19.5, viem 2.53.1, RainbowKit 2.2.11, burner-connector 0.0.21, @scaffold-ui/debug-contracts 0.1.11, Playwright 1.64.1, Chromium 156.0.8078.4.
Wallet setup:
- Burner leg: headless Playwright Chromium in a fresh non-persistent context. The burner connected automatically, because `burnerWalletMode: "localNetworksOnly"` and the target is local.
- MetaMask leg: the bundled helper ran `selftest` first (5/5 PASS). It then installed MetaMask 13.54.0 from a pinned GitHub release with sha256 verification and launched headed Chromium. The profile was a fresh, temporary, persistent Playwright profile; extension ID `gakakpflblmakpoohigneodgdcleddeh`. Prompts were read through `notification.html`, as the helper does. The password was generated in memory and never printed, and the recovery phrase was never displayed or stored.
- Config: no app config was changed. The burner connected automatically in the MetaMask profile too, so it was disconnected through the app's own Disconnect control.
Authorization: disposable writes only, on the owned local Anvil chain. Both test accounts were funded only from Anvil account 0.

| Assertion | Required? | Scope | Expected | Observed | Status | Evidence / blocker |
|---|---|---|---|---|---|---|
| C1 contract suite | yes | contract | Existing forge tests pass | 1 selected, 1 passed (`testMessageOnDeployment`) | PASS | [forge-test.log](forge-test.log) |
| B1 burner connect | yes | browser | Burner account on Foundry network | `0xEA36…0d90`, header "Foundry", no Connect button | PASS | [burner/journey.json](burner/journey.json) |
| B2 burner write via UI | yes | browser | Send triggers setGreeting, success shown | Toast "Transaction completed successfully!" | PASS | [burner/journey.json](burner/journey.json) |
| B3 burner receipt | yes | receipt | status 1, `GreetingChange` from burner | tx `0xba259a1d24e5bd2984e90d684227f42f700f69b757f47c256abd411438cb1059`, block 3, status 1, event (setter=burner, "Hello from burner 1793189247866", false, 0) | PASS | [receipt](burner/receipt-setGreeting.json) |
| B4 burner independent reads | yes | state | greeting changed, counters +1 | Block 1 to block 3: greeting "Building Unstoppable Apps!!!" to "Hello from burner 1793189247866"; totalCounter 0 to 1; userGreetingCounter(burner) 0 to 1 | PASS | [burner/state-reads.txt](burner/state-reads.txt) |
| B5 burner UI refresh | yes | browser | New greeting shown live and after reload | Shown live and after reload; totalCounter 1 | PASS | [burner-after-tx.png](burner-after-tx.png) |
| M0 helper selftest | yes | wallet | All lines PASS | 5/5 PASS: onboard, connect, add chain, EIP-712, tx | PASS | [selftest.log](selftest.log) |
| M1 MetaMask connect | yes | wallet | Real connect prompt from localhost:3000 | Prompt approved; provider account `0x56d2a0db6be745e49c53e28bfb0737d81d445555` | PASS | [metamask/journey.json](metamask/journey.json) |
| M2 wrong network then switch | yes | wallet | App flags chain 1, switches to 31337 via prompt | "Wrong network", then "Switch to Foundry", then MetaMask "Add Foundry, RPC 127.0.0.1:8545, from localhost:3000" approved; provider `0x7a69`, header "Foundry" | PASS | [metamask/journey.json](metamask/journey.json) |
| M3 reject then recover | yes | wallet | No tx, no state change, app usable | Rejected; block stayed 4, sender nonce later 1 (only the approved tx); readable UserRejectedRequestError; Send enabled | PASS | [metamask/state-reads.txt](metamask/state-reads.txt) |
| M4 confirmation prompt matches action | yes | wallet | Origin, network, target match | "Network Foundry, Request from localhost:3000, Interacting with 0x700b6…bAD35". Method and arguments were not shown on the prompt and were checked from the submitted calldata (see Limits) | PASS | [metamask-confirm-prompt.png](metamask-confirm-prompt.png) |
| M5 pending state | optional | browser | Pending feedback until mined | Automine off: tx in mempool, toast "Waiting for transaction to complete." | PASS | [metamask-pending.png](metamask-pending.png) |
| M6 duplicate prevention while mining | optional | browser | Send disabled until receipt | Send enabled while tx pending | FAIL | [metamask/journey.json](metamask/journey.json) (`sendDisabled: false`) |
| M7 MetaMask receipt | yes | receipt | status 1, event from MetaMask account | tx `0x0f8a6ff7b427b980c2e197ce4d1fc9a578c05389f83d1768396f14c8aa93245a`, block 5, chainId 31337, to YourContract, value 0, calldata `setGreeting("Hello from MetaMask 1793189403332")`, status 1, matching event | PASS | [receipt](metamask/receipt-setGreeting.json) |
| M8 MetaMask independent reads | yes | state | greeting changed, counters +1 | Block 4 to block 5: greeting changed to "Hello from MetaMask 1793189403332"; totalCounter 1 to 2; userGreetingCounter(MetaMask acct) 0 to 1 | PASS | [metamask/state-reads.txt](metamask/state-reads.txt) |
| M9 MetaMask UI refresh | yes | browser | New greeting shown live and after reload | Shown live and after reload; totalCounter 2; balance 9.9998 ETH | PASS | [metamask-after-reload.png](metamask-after-reload.png) |
| Console errors | optional | browser | None unexpected | Burner: 0. MetaMask: 2, both the expected user-rejection logs from M3 | PASS | journey files |

Commands and interactions (cwd `/tmp/se2-verify` unless noted):
- Setup: `yarn test` (exit 0), `yarn chain` (owned anvil), `yarn deploy` (exit 0), `yarn start` (owned Next dev server).
- Browser journeys: Playwright drivers [drivers/burner.mjs](drivers/burner.mjs) and [drivers/metamask-leg.mjs](drivers/metamask-leg.mjs). The MetaMask driver uses only the helper exports `installMetaMask`, `launchWallet`, `onboardWallet`, `openPrompt`, `approve` and `reject`.
- Raw RPC calls: funding transactions from Anvil account 0, plus `evm_setAutomine false`/`evm_mine` to observe the pending state.
- Every write to `YourContract` was made through the app's Send button.
- Funding txs: burner `0x40ad62c1db33d62e2e955b1e455c611cd22c7b99f001a4ea1a385dd541ca5879` (app faucet button, 1 ETH) and MetaMask `0x85768938db2458ff90913b4507959481cdcec370a8994c45d2f5603ce67e7477` (10 ETH).

Defects: optional M6 only. On `/debug`, the `setGreeting` Send button stays enabled after the wallet returns the hash and before the receipt arrives. In the installed `@scaffold-ui/debug-contracts` 0.1.11, `disabled` is bound to wagmi's `isPending`, which clears when the hash returns. So a second click can submit a duplicate transaction while the first one is being mined. This is the stock template's debug UI behavior and does not affect the required journey.

Limits:
- The MetaMask 13.54.0 transaction prompt showed origin, network and target contract, but no method name or arguments. Method and arguments were therefore confirmed from the submitted calldata after approval, not on the prompt.
- MetaMask showed a fiat network fee ($0.40) on the local chain. This is cosmetic.
- The pending state was not observed in the burner leg (automine). Burner signing has no prompt.
- The Next dev server listens on `*:3000`, not loopback only.
- `yarn chain` re-imports the well-known Anvil deployer key into `~/.foundry/keystores/scaffold-eth-default`. That file already existed.
- Desktop viewport only; no mobile or device checks.
- Separate pre-ship QA was not performed.

Next prerequisite: none for the required scope.

Cleanup:
- Stopped the owned process trees by PID: yarn, make and anvil for the chain; yarn and next for the dev server. Ports 3000 and 8545 are free.
- MetaMask browser contexts were closed by the drivers. The selftest removed its own anvil and temp dir.
- Removed `/tmp/se2-mm-work` (profile and extension download).
- Left in place: `/tmp/se2-verify` (as permitted).
- Not created by this run and therefore not removed: an older `$TMPDIR/eth-verify-metamask-*` dir (timestamped 10:45Z, before this run started).
- The chain log was not retained; its printed Anvil test keys were redacted before review.
- All evidence files were confirmed present after cleanup.

Artifacts:
- Logs: [selftest.log](selftest.log), [create-eth.log](create-eth.log), [forge-test.log](forge-test.log), [deploy.log](deploy.log).
- Journey records, receipts and state reads: under [burner/](burner/) and [metamask/](metamask/).
