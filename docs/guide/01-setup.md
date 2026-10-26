# Set up your first project

Start in the repository you want the agent to work on. Ethskills supplies the instructions; your agent environment supplies file access, commands, browser automation and any connected services.

## Install the skills

For Claude Code, add the marketplace once and install the unified plugin:

```text
/plugin marketplace add austintgriffith/ethskills
/plugin install ethskills@ethskills
```

The Ethskills plugin contains 22 Ethereum topic skills and 17 engineering workflows in separate sections. Its main workflow entry point is `ethskills:pilot`; supporting skills also use the `ethskills` namespace.

For another host, use its supported skill or plugin installation flow. Slash commands in this guide show intent; your host may use a skill picker or a different prefix. You can also ask a URL-capable agent to read the entry point:

```text
Read https://ethskills.com/eth-pilot/SKILL.md.
Then explain the architecture of this project. Do not edit files.
```

When trying unpublished changes, point the agent at the local `eth-pilot/SKILL.md` in this checkout. The live website and installed plugin may contain a different revision.

## Let the project choose the tools

Pilot inspects relevant workspace scripts, configuration, resolved dependencies and installed executables. It should identify your contract runner, client library, frontend, wallet integration and target network before choosing commands.

A Foundry project keeps its profiles and remappings. A Hardhat project keeps its version, plugins and test runner. A standalone frontend keeps its framework. Mixed monorepos get workspace-specific discovery.

You do not need to install every tool named by ethskills. Missing tools limit the checks an agent can perform; they are not a reason to silently replace your stack.

## Choose real wallet testing for local dApps

Pilot runs Verify during a build; you do not need to invoke it separately. Local wallet journeys include a disposable wallet and real extension prompts when the host supports them. Simulated approvals do not establish MetaMask integration.

Some hosts, including T3 versions with a shared-preview-first policy, require an explicit user request before the agent can use a separate browser. To choose that browser once, add this preference to your project `AGENTS.md` or your agent's global instruction file:

```text
When building or verifying a local Ethereum dApp, I explicitly request a
separate disposable Chrome/Chromium session with MetaMask for real wallet
testing. Install official MetaMask in a temporary profile, create a disposable
wallet, and fund and sign only the intended test transactions on an owned
isolated local development node. Run this automatically through Ethskills
Pilot's verification step. Never use my personal browser profile, wallet,
production keys, or real funds. Respect host restrictions and report the exact
restriction if this browser choice cannot be honored. Remove the disposable
profile after retaining non-secret verification evidence.
```

You can ask your agent to save this preference for you. Choose project scope for one repository or global scope for future projects. Start a fresh session so the host loads the instruction. This expresses your browser choice; it does not override stricter host restrictions or guarantee installed browser tooling. If a host requires a choice during setup, Pilot asks once rather than substituting simulated wallet evidence.

## Run a bounded first task

```text
ethskills:pilot explain the deposit flow from the button to the contract
and back to the displayed balance. Cite the source. Do not edit files.
```

Expect an explanation grounded in your actual code and dependencies, with unknown deployment details stated explicitly. If you need help choosing a task, use [Help](../../eth-help/SKILL.md).

**Pitfall:** installing a skill does not install a browser, wallet, contract toolchain or RPC subscription.

Next: [Give Ethskills Pilot a goal](02-eth-pilot.md).
