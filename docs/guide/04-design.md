# Design within the real system

[Architect](../../eth-architect/SKILL.md) helps settle interfaces, responsibilities and state transitions before a consequential change. It begins with the system you have: compiler, contracts, storage, dependencies, clients and deployment constraints.

```text
/ethskills:pilot compare ways to add recurring USDC payments to this app.
Show who initiates each payment, what permission they need, and how
users cancel or exit. Return a recommendation before implementing.
```

## Make the decisions explicit

The design should explain what belongs onchain, which existing protocols can be reused, and which responsibilities need custom contracts. For every transition, identify who calls it, why they would, and what happens if nobody does.

[CROPS](../../crops/SKILL.md) examines censorship resistance, open source and freedom, privacy, and security. The review should name actual operators, permissions, dependencies, accepted compromises and user escape paths.

Contract counts are a prompt to simplify, not a reason to remove a necessary responsibility. An existing stack should not be replaced just to match an example.

## Compare uncertainty when it matters

Use [Arena](../../eth-arena/SKILL.md) when competing designs or implementations would make the decision clearer.

```text
ethskills:arena compare two approaches to this permission model.
Keep the same dependencies and acceptance criteria. Explain the
security and user-experience differences before choosing.
```

Arena compares attempts at the same task. [Swarm](../../eth-swarm/SKILL.md) divides independent tasks. Small decisions need neither a mandatory contest nor a large panel.

## Define the check before the implementation

Record observable acceptance behavior. For an upgrade, include affected storage and consumers. For an integration, include deployed identity, failure behavior and compatible interfaces. For a frontend, include the wallet and refresh states users will encounter.

**Pitfall:** an architecture diagram is not proof that a protocol integration or escape path works. Mark assumptions and test the decisive ones.

Next: [Build and debug](05-build-debug.md).
