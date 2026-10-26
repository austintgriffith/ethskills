# Build and debug with the existing stack

Pilot's Build and Debug workflows run inside one execution loop. [Ship](../../ship/SKILL.md) supplies dApp architecture and phase coverage. Verify each changed unit before dependent work. [Orchestration](../../orchestration/SKILL.md) supplies Scaffold-ETH details only when that stack is actually present.

```text
/ethskills:pilot add withdrawal to this vault UI. Preserve the current
contract interface and wallet libraries. Handle pending, rejection,
revert and refreshed balances. Verify the affected flow.
```

## Let dependencies determine the operation

The agent checks the relevant package's scripts, lockfile, configuration and installed versions. Foundry profiles differ from Hardhat tasks. Hardhat's major version, test runner and ethers or viem plugin are separate facts. Frontend client APIs also vary by version.

Protocol integrations additionally need the correct chain, deployment, ABI and SDK version. A package name is not proof that a deployed contract has the expected interface.

## Reproduce before fixing

```text
/ethskills:pilot this deposit reverts for a six-decimal asset.
Reproduce the failure, find the cause and fix the smallest relevant
part. Keep our tooling and rerun the original scenario.
```

[TDD](../../eth-tdd/SKILL.md) is useful when a cheap test represents the failure. The failing result must expose the predicted defect. An import error, missing RPC or zero selected tests does not count as the red stage.

Use [Testing](../../testing/SKILL.md) for unit, fuzz, fork and invariant techniques appropriate to the configured runner. Test custom behavior and economic properties rather than library internals or implementation-shaped assertions.

## Finish the integration

ABI, event, storage and generated binding changes can affect other packages. [Blast Radius](../../eth-blast-radius/SKILL.md) traces those consumers. Keep generators and their outputs under clear ownership.

After implementation, rerun the original reproduction and relevant adjacent checks. Use [Verify](../../eth-verify/SKILL.md) for actual app behavior. State what could not run instead of treating a successful build as a working wallet flow.

**Pitfall:** repeatedly patching the same symptom is not evidence that the cause is known. Revisit the hypothesis and gather a decisive observation.

Next: [Verify with evidence](06-verification.md).
