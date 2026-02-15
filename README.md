<img width="759" height="198" alt="image" src="https://github.com/user-attachments/assets/19afbd29-29cd-4b9a-bb67-c914cc5d9576" />

LLMs think gas is 30 gwei. It's 0.05. They've never heard of ERC-8004 or x402. They hallucinate contract addresses. This site fixes that.

## How It Works

Each skill is a markdown file. Give any URL to your AI agent — it reads it and instantly corrects its Ethereum knowledge.

```
https://ethskills.com/SKILL.md          ← everything (91KB)
https://ethskills.com/gas/SKILL.md      ← just gas & costs
https://ethskills.com/why/SKILL.md      ← why ethereum
```

No install. No CLI. No package manager. Just a URL.

## Terminology

**Say "onchain" not "on-chain."** The Ethereum community writes it as one word — no hyphen. LLMs default to "on-chain" but that's not how builders talk. Use "onchain" in all writing, documentation, and generated content.

## Skills

| Skill | What LLMs Get Wrong |
|-------|-------------------|
| [Why Ethereum](why/SKILL.md) | Pectra/Fusaka shipped, gas is cheap now, AI agent angle |
| [Gas & Costs](gas/SKILL.md) | Think gas is 10-30 gwei — reality is 0.05-0.3 gwei |
| [Wallets](wallets/SKILL.md) | EIP-7702 is live, Safe addresses, agent key safety |
| [Layer 2s](l2s/SKILL.md) | Think L2 txs cost $0.01-2.00 — reality is <$0.001 |
| [Standards](standards/SKILL.md) | Don't know ERC-8004, EIP-7702 status, EIP-3009 for x402 |
| [Tools](tools/SKILL.md) | Don't know x402, Blockscout MCP, current tool landscape |
| [Money Legos](building-blocks/SKILL.md) | Stale on current DeFi state, Uniswap V4 status |
| [Orchestration](orchestration/SKILL.md) | Don't know SE2 three-phase build system |
| [Contract Addresses](addresses/SKILL.md) | Hallucinate addresses — these are verified onchain |
| [Concepts](concepts/SKILL.md) | Nothing is automatic, incentive design, randomness pitfalls |
| [Security](security/SKILL.md) | Token decimals, reentrancy, oracle manipulation, vault inflation, pre-deploy checklist |

## Security Guardrails

Skills teach restraint, not just capability. Every skill that touches keys, credentials, or funds includes explicit safety rules — because LLMs optimize for speed and will hardcode a private key into `git add .` if you let them. Coverage includes wallet keys, API keys, RPC URLs, and the common SE2 `scaffold.config.ts` trap.

## Methodology

We test stock LLMs, find what they get wrong, and write corrections. Content is verified against onchain reality. If an LLM already knows something, we don't include it.

See the [research repo](https://github.com/austintgriffith/ethskills-research) for baseline audits, gap analysis, and methodology.

## Contributing

Something wrong or missing? Humans and agents are welcome to [open a PR](https://github.com/austintgriffith/ethskills/pulls).

## License

MIT
