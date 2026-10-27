# Browser journeys and wallet operations

## Choose a supported surface

Honor the user's browser/tab selection and host-native routing requirements before choosing a driver. Read the exposed browser/computer-use tool documentation first. Inspect or open the native browser as required by the host. Reuse the project's existing test harness for its own tests. For real wallet journeys, establish an extension-capable Chrome/Chromium session with observable wallet windows. Page automation alone is insufficient.

Record tool/browser versions and the profile/context type. An isolated Playwright context normally does not contain the user's extension wallet. [Playwright extension support](https://playwright.dev/docs/chrome-extensions) has browser/context constraints; verify the installed version and available extension surface. Do not claim wallet support because page automation works. Never copy a personal browser profile or import a production seed to make a test work.

Read-only navigation may be possible without a wallet. If native tools cannot expose console/network logs or extension popups, record that capability as unavailable; do not invent logs. Discover permitted alternatives before blocking wallet assertions. A missing extension does not override a host restriction on separate browsers. Missing browser blocks interactive assertions even if HTTP probes and contract tests succeed.

### Scaffold-ETH 2 burner wallet runs

For a local Scaffold-ETH 2 app, inspect its wallet configuration and try the built-in burner before installing an extension. Connect through the app's visible controls and use only the run's owned local development chain. Confirm the displayed account and network, then exercise the requested transaction through the app. Correlate any write with its receipt, independent state reads and refreshed UI as described below. Keep the burner account disposable and do not export or record its key.

The burner can prove the local app's transaction path. It does not prove an extension popup, a real wallet-provider connection, network-switch prompt, or extension signing behavior. If those behaviors are part of the claim, continue with the extension procedure below. If the project does not expose a burner wallet, record that and proceed to the required wallet path.

### MetaMask extension runs

When extension behavior is in scope, prepare the real wallet session as part of the task. For Scaffold-ETH 2, try the burner procedure first, then use the requested wallet or MetaMask when the app supports it and no wallet was specified. Do not stop after contract tests or ask the user to separately request installation, wallet creation or a permitted isolated browser.

1. Inspect the required native session for an isolated profile, extension support and observable wallet windows. If the extension installer says "Switch to Chrome" or disables installation, record that the current surface cannot install extensions. Repeating the installer there will not prepare a wallet.
2. When host rules and the user's browser selection permit it, launch a separate isolated Chrome/Chromium session through a documented available driver. Prefer an installed browser and automation tools. Use a new temporary profile, never a personal profile. Record its process handle, profile location and driver. If host rules restrict fallback, follow their required capability checks and stop at that boundary.
3. If MetaMask is absent, install it in that disposable profile using the official MetaMask distribution and a supported extension installation/loading method. Consult matching official browser/driver documentation for version-specific extension support. Record the source and resolved wallet/browser versions. Discover the installed extension ID and windows from the running browser. Do not guess IDs, popup URLs or host-specific APIs. Do not modify project dependencies or install unrelated tools. If a required browser or driver is absent, use an authorized temporary installation only when host rules permit it; otherwise report the exact missing prerequisite.
4. Open MetaMask and create a fresh disposable wallet through its UI. Keep onboarding secrets out of screenshots, recordings, logs and reports. Capture evidence only after secret screens are dismissed. Establish control of the extension UI, then observe and operate each connection, network and transaction window as the dApp journey triggers it. An unpacked extension or `window.ethereum` alone does not prove this.
5. Record each attempted surface, its capability result and any host restriction. Mark wallet assertions `BLOCKED` only after permitted setup paths fail or an explicit restriction prevents them. Continue safe contract and disconnected UI checks. Never substitute a personal profile, mock provider or undocumented extension connection for real MetaMask evidence.

Do not import a production seed or copy keys from another profile. Use only a local development chain for signing. A local Anvil or Hardhat chain is eligible only when the run owns the node process, has confirmed its loopback bind and configured chain ID, and has identified the RPC client as the expected local node. Record the launch command, process/session handle, RPC host and port, chain ID, and client version. Add or switch MetaMask to that actual RPC URL and chain ID through the wallet UI or the dApp's observed network request. Do not assume Foundry uses port 8545 or a particular chain ID. Check the wallet's displayed network and the transaction prompt against that identity before signing. A chain ID by itself does not prove that an endpoint is local or isolated. A local fork is eligible only when writes remain in the owned local fork process; never sign a fork transaction through a hosted or public RPC.

Fund the disposable account only from the owned local node's test accounts. Do not use a real faucet or bridge. Do not print, record, or commit any seed or private key. If the wallet cannot be connected to the positively identified local chain without using a personal key or public network, mark signing `BLOCKED`.

Connect from the dApp and approve the real MetaMask connection prompt. Execute the requested state-changing action through the app controls and wallet confirmation. Independently check the affected raw state before and after, including any promised return or cleared position. Account for gas separately when comparing the wallet's native balance. CLI transactions may fund test state or support independent assertions, but cannot replace the UI action.

Before approving each prompt, compare its origin and requested action with the dApp control just clicked and independently established contract deployment. For a transaction, check chain, sender, recipient, decoded method and arguments, native value, and token allowance or spender where applicable. For a message or typed-data prompt, inspect the full domain and payload and verify that the task specifically calls for that signature. Connecting does not authorize signing. Stop without approving a prompt with a different origin, chain, target, method, amount, spender, or unexplained data.

For an app that supports network switching, observe the actual switch request and prompt. Confirm the destination is the owned local development chain before accepting. If the app only documents manual network setup, use that setup and record switching as `NOT_APPLICABLE`. Exercise cancellation only when the app offers a safe retry path. A rejected connection or transaction must leave the app in a recoverable state, with no successful receipt or changed contract state; then retry only the intended action.

For a submitted transaction, record the wallet's pending state and hash, wait for its receipt, and check the receipt status and expected event. Read the affected contract state independently from the same local RPC, then refresh or reload the dApp and confirm its displayed state matches. A wallet toast, signature, transaction hash, or successful receipt alone does not prove the full flow. If mining is too fast to observe pending state, report that assertion `BLOCKED` unless controlled mining is supported by the owned local node.

Use these statuses for wallet assertions:

- `BLOCKED` means a required capability or safe precondition is unavailable, including extension/popup access, isolated profile, a disposable account, or positive local-chain identity. Name the missing prerequisite.
- `FAIL` means observed behavior contradicts the expected result, including an out-of-scope prompt, failed receipt, state mismatch, stale UI after refresh, or state change after a rejected transaction. Stop before approving an unexpected prompt.
- `NOT_APPLICABLE` means the dApp has no such transition, such as switching when the app is already configured to the owned local chain. Give the reason.
- `PASS` requires the observed prompt to match the intended action, the expected wallet result, a successful receipt where submitted, independent state reads, and the refreshed UI result. Keep each of those as separate assertions when the evidence contract requires it.

If any required wallet capability is blocked, the wallet flow and overall run cannot be reported as `PASS`. A mock provider may verify UI request/response handling, but report it separately and do not reuse its evidence to claim MetaMask signing. Reuse environment discovery such as tool versions and launch commands only while the browser context, node process, configuration, and source revision remain the same. Never carry a prior run's prompt, signature, receipt, or state result forward as evidence for a new run.

After saving evidence, close only the browser processes launched by this run and remove their disposable profiles and downloaded wallet artifacts. Keep secrets out of retained artifacts. Record cleanup failures and any owned processes still running.

## Drive observed controls

Use the discovered final URL and base path; preserve redirects, nondefault ports and auth requirements. In a project Playwright harness, [webServer configuration](https://playwright.dev/docs/test-webserver) must refer to the discovered command/URL. Do not enable reuse of an unrelated server. Current docs can differ from installed Playwright: consult installed types/help for exact options.

Map the actual entry points from routes, menus, buttons and existing features. Prefer semantic role/name/label locators or existing stable test IDs. Native tools may require visually grounded clicks: capture current state before using coordinates and re-observe after navigation. Do not fabricate selectors from generic examples. Use [web-first assertions](https://playwright.dev/docs/test-assertions) where the installed harness supports them; wait for observable conditions with a bounded timeout instead of fixed sleeps.

For each affected path:

1. Open its real user entry point and capture preconditions, expected control and starting screen.
2. Navigate/click/type as a user. Record the action and resulting state. Do not call component setters or contract APIs as a substitute for a UI journey.
3. Assert the intended behavior and capture before/pending/after screenshots where relevant. Screenshots document observed states; [visual snapshot comparisons](https://playwright.dev/docs/test-snapshots) alone do not prove interaction or side effects.
4. Capture available console errors, page failures and failed network requests, correlating them with actions. Investigate relevant new errors; redact sensitive payloads and authenticated URLs.
5. Reload/navigate back to test persistence and refreshed state where relevant. Exercise all affected entry points, changed responsive layouts and accessibility controls within scope. Device emulation does not prove mobile wallet deep-link or real-device behavior.

## Wallet state matrix

Apply only states the product supports; explain every exclusion. Cover disconnected Connect, wrong-network Switch, required allowance Approve, then Execute. Use the actual application behavior and transaction library; Scaffold-ETH-specific hooks in older guidance are not requirements for every dApp.

Check rejection/cancellation and retry, readable reverts, per-action pending/disabled states, duplicate prevention through mining, and state refresh after confirmation. A pending transaction may mine too fast to observe: report that pending-state assertion blocked, or use supported controlled mining on the isolated owned node. Never slow/reset a shared node. An approval transaction requires its own receipt and allowance assertion before Execute.

Distinguish:

| Surface | What it can prove |
|---|---|
| Mock/injected test provider | UI branching and simulated requests/responses only; record what is stubbed |
| Real disposable wallet extension | Actual connection, chain-switch prompts, rejection, signing and receipt flow that were observed |
| API/contract-only test | Contract/provider behavior; no browser or extension integration claim |

A mock can exist in a test boundary, but do not insert a provider into production code merely to claim wallet integration. If no safe wallet is available, complete disconnected/read-only checks and mark wallet assertions `BLOCKED` with the required capability.

## Write boundary and confirmation

Verification authorization permits ordinary disposable writes only in positively verified isolated local/fork test state within the task's scope. Before confirming a wallet prompt, recheck origin, chain, account, recipient/spender, method, amount, allowance and any signature contents against the planned action. Stop when the prompt differs or its implications are unknown. Connecting to a site does not authorize arbitrary messages, permits, approvals or transactions. A verification or build request alone does not authorize public-network writes. A deployment request can authorize its necessary transactions when the target and scope are established; it does not authorize unrelated transfers or testing with real funds. Reuse existing session authorization without repeating permission requests.

Never import production keys. Test funding, impersonation, time travel and resets must stay on the owned isolated node. Do not request real faucets or bridge value as an unannounced prerequisite. Hosted targets are read-only unless writes are explicitly authorized and their target is established; a preview hostname does not prove its backend chain is isolated.

For each allowed write, save chain ID, from/to, method, raw token amount/decimals, transaction hash, receipt status/block, confirmation depth/policy and expected event fields. Independently read affected state before/after on the same target. Handle replacements/reverts with the actual client rather than treating the original hash as success. Then verify the UI updates correctly. For smart accounts, correlate a UserOperation or Safe proposal with actual execution and inner call outcomes; an outer successful receipt does not prove each requested action succeeded. A toast and successful receipt cannot excuse a stale displayed balance.
