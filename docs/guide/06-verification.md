# Verify with evidence

[Verify](../../eth-verify/SKILL.md) runs the relevant contract checks and operates the application in a browser. It discovers the actual target and tools before selecting the procedure.

```text
ethskills:verify check the deposit and withdrawal journeys.
Use this project's configured tools. Click through the app and
capture screenshots, test output and relevant transaction evidence.
```

## Discover the target

The user-selected environment takes priority. Otherwise the agent checks project verification instructions, corroborated deployment records, hosting read tools, an associated browser tab and documented launch output.

It preserves scheme, path, redirects and nondefault ports. It does not assume localhost:3000. If the target remains ambiguous, it asks which environment matters.

Source revision, hosted build revision and deployed contract identity are separate observations. A hosted run can show behavior even when its build revision is unknown, but it cannot prove that a local fix was deployed.

## Run the appropriate checks

Use the detected Foundry or Hardhat setup, configured test runner and existing scripts. Inspect effects before running scripts that might deploy or mutate shared state. Fork checks record their chain and block; missing RPC access is a gap.

For the browser, the agent uses available native tools, computer use or a supported project harness such as Playwright. It navigates, clicks actual controls and checks the resulting state. Host browser rules and existing project configuration determine the driver.

## Connect a wallet

Wallet journeys run only against a disposable account on a local chain that the run owns. The agent never imports an existing wallet, key or recovery phrase.

1. **MetaMask always.** Every wallet journey runs with a real extension wallet. The agent uses the requested wallet, or MetaMask if none was requested, because that is closest to how users reach the app. It creates a fresh wallet in a temporary Playwright browser profile.
2. **App development wallet as an extra.** If the app also ships its own development wallet, such as the Scaffold-ETH 2 burner, the agent can run the journey with it first. This is a fast check of the app's local transaction path. It does not prove extension prompts, network-switch prompts or extension signing, so it never replaces the MetaMask run. If MetaMask setup fails, the development-wallet result still counts, and the MetaMask checks are reported as BLOCKED with the reason.
3. **Selftest before the app.** The bundled [MetaMask helper](../../eth-verify/scripts/metamask.mjs) pins a MetaMask release by version and sha256. Before it drives the app, the agent runs the helper's selftest. The selftest starts its own Anvil node and proves onboarding, connection, adding a chain, an EIP-712 signature and a mined transaction. If a line fails, the agent fixes the setup before it trusts any app result.

To run the selftest yourself, install Node.js, Foundry and `unzip`. The helper loads Playwright from the directory where you run it, so run it in a directory that has Playwright installed:

```text
mkdir metamask-selftest && cd metamask-selftest
npm install playwright
npx playwright install chromium
curl -fsSLO https://ethskills.com/eth-verify/scripts/metamask.mjs
node metamask.mjs selftest
```

Each passing check prints a `PASS` line. A `FAIL` line names the step that failed.

Before it approves a prompt, the agent compares the origin, chain, account, target and amount with the planned action. It stops if they differ.

For a complete run, see the [Scaffold-ETH 2 example report](../../eth-verify/evals/scaffold-eth-2-2026-10-28/report.md). It shows a burner leg and a MetaMask leg, each with receipts, independent state reads and screenshots.

## Keep proof in separate scopes

| Evidence | Establishes |
|---|---|
| Contract tests | Behavior of the tested source and configuration. |
| Clicks and screenshots | Observed UI behavior at the identified URL. |
| Wallet interaction | Connection and signing steps actually covered. |
| Receipt and independent state reads | Execution and relevant effects on the identified chain. |
| Build/deployment provenance | Whether the artifacts can be connected to the source change. |

A mock provider can test UI branching. It does not prove real wallet signing. Mobile emulation does not prove a real-device deep link. A successful outer receipt does not establish every smart-account inner action.

## Read the verdict

Each assertion is **PASS**, **FAIL**, **BLOCKED** or **NOT APPLICABLE**. Required blocked checks prevent the corresponding verified claim. Reports should link real artifacts, name the tested environment and explain missing coverage.

Live approvals, signatures, transfers and deployment actions follow the user's established authorization. Discovering a hosted URL is not permission to spend or test with real funds.

**Pitfall:** a screenshot of a success toast proves neither a successful receipt nor a correct balance update.

Next: [Review and prepare a release](07-review-ship.md).
