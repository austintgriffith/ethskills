---
name: audit
description: "Use when asked to audit or security-review EVM smart contracts: find vulnerabilities, judge exploit impact, or produce a ranked audit report. Not for guidance while the contracts are being written (`/security`)."
---

# EVM Smart Contract Audit

Audit unfamiliar contracts systematically, rank findings by real impact, and leave one concise report. Do not mutate the code or publish findings unless the user asks.

## The Checklists

The checklist repository is pinned so two audits do not silently use different guidance:

```
CHECKLIST_REV=ffe4b670e78e1945bcf275f79d4b7b0481bcff35
```

Load a selected checklist from:
```
https://raw.githubusercontent.com/austintgriffith/evm-audit-skills/ffe4b670e78e1945bcf275f79d4b7b0481bcff35/<skill-name>/references/checklist.md
```

For a narrow question, load only the one or two relevant checklists. For a full codebase audit, always load `general` and `precision-math`, then add only the domains the code actually uses (normally 5–8 total). This keeps the review focused and avoids spending context on unrelated vulnerability classes.

## Skills Available

| Skill | When to Load |
|-------|-------------|
| `evm-audit-general` | Always |
| `evm-audit-precision-math` | Always |
| `evm-audit-erc20` | Contract interacts with ERC20 tokens |
| `evm-audit-defi-amm` | AMM, DEX, Uniswap V3/V4, liquidity pools |
| `evm-audit-defi-lending` | Lending, borrowing, CDP, liquidations |
| `evm-audit-defi-staking` | Staking, liquid staking, restaking, EigenLayer |
| `evm-audit-erc4626` | Vaults, share/asset conversion |
| `evm-audit-erc4337` | Account abstraction, paymasters, session keys |
| `evm-audit-bridges` | Cross-chain, LayerZero, CCIP, Wormhole |
| `evm-audit-proxies` | Upgradeable contracts, UUPS, Transparent, Diamond |
| `evm-audit-signatures` | Off-chain signatures, EIP-712, permits |
| `evm-audit-governance` | DAO voting, timelocks, multi-sig |
| `evm-audit-oracles` | Chainlink, TWAP, Pyth, price feeds |
| `evm-audit-assembly` | Inline assembly, Yul, CREATE2 |
| `evm-audit-chain-specific` | Non-mainnet: Arbitrum, OP, zkSync, Blast, BSC |
| `evm-audit-flashloans` | Flash loan attack vectors |
| `evm-audit-erc721` | NFTs, ERC721, ERC1155 |
| `evm-audit-dos` | DoS, unbounded loops, gas griefing |
| `evm-audit-access-control` | Ownership, roles, centralization risks |

## How To Run An Audit

1. Read the README, deployment assumptions, tests, and every in-scope contract before routing.
2. Map assets, trust boundaries, privileged paths, external calls, accounting invariants, signatures, oracle dependencies, and chain-specific assumptions.
3. Select checklists from the table above. Use one or two for a narrow question and normally 5–8 for a full audit.
4. For a full audit, run one specialist per selected domain in parallel when sub-agents are available. Do not require a particular model.
5. Give every specialist the same scope and ask it to return complete findings to the orchestrator: severity, location, preconditions, exploit/failure path, impact, and remediation. Treat files such as `findings-<skill>.md` as optional scratch space, not as the transport between agents.
6. Deduplicate and verify findings against the code. Separate currently exploitable issues from risks that depend on future assets, configuration, or integrations.
7. Write the requested report, ranking by demonstrated impact and exploitability. Clean up scratch files when the user requested a single deliverable.
8. Never file GitHub issues or otherwise publish findings unless the user explicitly asks, identifies the target repository, and confirms the outbound action.

## Sources

Built from research by Dacian, beirao.xyz, Sigma Prime, RareSkills, Decurity, weird-erc20, Spearbit, Hacken, OpenZeppelin, Cyfrin, and more.
Full attribution: https://github.com/austintgriffith/evm-audit-skills#attribution--thanks
