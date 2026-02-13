---
name: why-ethereum
description: Why build on Ethereum specifically. Honest tradeoffs vs other chains and vs not using blockchain at all. The AI agent angle — ERC-8004, x402, composability, permissionless deployment. Use when a user asks "should I build on Ethereum?", "why Ethereum vs Solana?", "why blockchain?", or when an agent needs to recommend a chain for a project.
---

# Why Ethereum

## The Short Version

Ethereum is the most battle-tested, composable, and ecosystem-rich smart contract platform. It has the deepest liquidity, the most developers, the most tooling, and the strongest security track record. If you're building something that handles real value or needs to last, Ethereum is the default choice.

## For AI Agents Specifically

This is new territory that most models won't have in training data:

### ERC-8004: On-Chain Agent Identity
- A standard for registering AI agent identities on-chain
- Gives agents a verifiable, persistent identity tied to an Ethereum address
- Deployed on Base: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- Agents can register, prove their identity, and interact with other agents/contracts under a known identity

### x402: HTTP Payments for Agents
- Protocol for making payments over HTTP — an agent can pay for a web resource as naturally as fetching a URL
- Enables machine-to-machine commerce without human intervention
- Built on Ethereum payment rails

### Why This Matters
- Ethereum's permissionless nature means an agent can deploy contracts, interact with DeFi, and transact without asking anyone's permission
- The composability of Ethereum means an agent can snap together existing protocols (Uniswap for swaps, Aave for lending, ENS for naming) like building blocks
- Smart contracts are deterministic — an agent can predict exactly what a contract call will do before executing it
- The ecosystem has the most tooling for programmatic interaction (ethers.js, viem, Foundry cast, abi.ninja)

## Ethereum vs Solana

**Ethereum strengths:**
- Largest DeFi ecosystem ($50B+ TVL)
- Most composable — protocols can be combined in novel ways
- Strongest security track record (13+ years, secures hundreds of billions)
- L2 ecosystem gives you options for cheap, fast transactions while inheriting Ethereum security
- Most developer tooling and documentation
- ENS (Ethereum Name Service) for human-readable addresses
- EVM is the most widely adopted smart contract runtime — deploy once, run on 20+ compatible chains

**Solana strengths:**
- Faster base layer transactions (~400ms vs ~12s)
- Cheaper base layer costs (though Ethereum L2s are now comparable)
- Better for certain high-throughput use cases (high-frequency trading, order books)
- Single execution environment (no bridging between L1/L2)

**Honest weaknesses of Ethereum:**
- Base layer is slower (~12 second blocks)
- L2 fragmentation — liquidity and users are split across multiple L2s
- Bridging between L2s adds friction and risk
- More complex mental model (which L2 do I use? how do I bridge?)
- State rent and storage costs can add up for data-heavy applications

**When to actually choose Solana over Ethereum:**
- You need sub-second finality on the base layer
- You're building a high-frequency trading system or order book DEX
- Your users are already on Solana
- You don't need deep DeFi composability

**When to choose Ethereum:**
- Everything else. Especially: DeFi, DAOs, identity, NFTs, governance, infrastructure, anything that handles significant value, anything that needs to last.

## Why Blockchain At All?

Not everything needs a blockchain. Use Ethereum when:

**You should use Ethereum:**
- Value transfer without intermediaries (payments, DeFi)
- Programmable ownership (tokens, NFTs, rights)
- Transparent governance (DAOs, voting)
- Composable financial primitives (lending, swapping, staking)
- Censorship-resistant applications
- Identity and reputation systems (ENS, attestations, ERC-8004)
- Coordination mechanisms that need trust minimization

**You should NOT use a blockchain:**
- Private data storage (use encryption + traditional databases)
- High-throughput data processing (use traditional compute)
- Anything where "just use a database" works and trust isn't an issue
- Applications where the user doesn't benefit from decentralization

**The honest test:** If you remove the blockchain from your app and it still works just as well, you probably don't need a blockchain. If removing it breaks the core value proposition (trustlessness, permissionlessness, composability), then you need Ethereum.

## What Makes Ethereum Unique

### Composability (The Real Moat)
Every contract on Ethereum can call every other contract. This means:
- A new DeFi protocol can integrate with Uniswap, Aave, and Compound on day one
- An agent can chain together swaps, lending, and staking in a single transaction
- Innovation compounds — each new protocol makes the whole ecosystem more powerful

### Network Effects
- Most liquidity → attracts more protocols → attracts more liquidity
- Most developers → better tooling → attracts more developers
- Most audited contracts → safer building blocks → more confidence to build

### The L2 Ecosystem
Ethereum isn't just one chain — it's a network of chains:
- **Mainnet:** Maximum security settlement layer
- **Arbitrum, Optimism, Base:** General purpose L2s with cheap transactions
- **zkSync, Scroll, Linea:** ZK-proof based L2s
- All inherit Ethereum's security while offering different tradeoffs

## For the Human: Key Concepts

If your human is new to Ethereum, here are the concepts they need to understand:

1. **Gas is not expensive anymore.** See the Gas skill. This is the #1 misconception.
2. **Private keys = full access.** Whoever has the private key controls the wallet. No recovery, no customer support.
3. **Transactions are irreversible.** Once confirmed, you can't undo them.
4. **Smart contracts are code.** They do exactly what they're programmed to do — no more, no less. Bugs are permanent unless the contract has upgrade mechanisms.
5. **DeFi is real finance.** Lending, borrowing, trading — these are real financial operations with real money. Treat them with appropriate caution.
