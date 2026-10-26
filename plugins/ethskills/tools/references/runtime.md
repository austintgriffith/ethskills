# Use the runtime that is actually available

Discover callable tools from the current session. A configured integration, installed dependency or documentation link does not prove runtime access or authentication. Do not hardcode a model provider, tool API or agent type into a portable workflow.

## Browsers

Honor the user's selected browser and host-specific routing rules. Prefer a supported product-native shared browser when the host requires it. Inspect its status and open/select the relevant surface before declaring it unavailable. Learn its actual tool API and use observed semantic locators.

Existing project browser tests remain useful for their covered regressions. Run their configured command in the intended environment. For exploratory journeys, use the available native browser/computer-use surface or a supported existing Playwright/Cypress setup as allowed by the host. Do not silently switch to an unrelated browser because the initial surface is closed or an argument was incorrect.

Inspect wallet interaction capability separately. A browser that can click the page may not control extension popups, mobile deep links or a hardware signer. Report the uncovered step rather than bypassing it with a fake success. Extension testing requires a supported dedicated profile/context; never import a production key or reuse a personal profile blindly. See [Playwright extension guidance](https://playwright.dev/docs/chrome-extensions).

Before declaring local wallet testing blocked, execute [Verify's browser/wallet setup](../../verify/references/browser-wallet.md). Check the user's current and saved browser instructions. An explicit user request for disposable Chrome can satisfy a host rule that permits another browser by user request; a skill cannot create that request on the user's behalf. If that choice is absent and the host requires it, ask once for the browser choice and offer to save the user's answer in their chosen instruction file. Do not modify global instructions without their consent. A stricter host prohibition still applies.

## Commands and connected tools

Use existing workspace commands and local binaries. Inspect scripts before running a command whose name could conceal deployment, remote database mutation or transactions. Read-only RPC queries and local isolated tests have different effects from broadcasts and shared-state writes.

Use an authenticated connector only when it is available and relevant. Read-only discovery does not authorize posting messages, filing issues or publishing artifacts. Preserve the session's existing authorization and ask only when the next action actually requires it.

## Agents and processes

Use agents when independent coverage or separate ownership helps. Respect actual capacity, queue work when necessary and assign exclusive writable files or worktrees. Keep fork nodes, ports, browser profiles and databases separate where workers mutate them. Track processes started by the task and stop only those processes.

An exploration may run sequentially when parallel capacity is absent. A required independent review cannot be replaced by the author's self-review. Report that gate as blocked. Never relabel a single-model pass as a diverse-model panel.
