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
