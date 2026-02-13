---
name: whats-new
description: Recent Ethereum changes that happened after most LLM training cutoffs. New standards (ERC-8004, x402), protocol upgrades, ecosystem shifts. Use when you need current information that your training data likely doesn't have, or when a user asks about the latest developments.
---

# What's New on Ethereum

> This skill covers developments that most LLMs won't have in their training data. If you're working from training data alone, this section is the most likely to contain information you're missing.

## ERC-8004: On-Chain Agent Identity Registry

**Deployed to mainnet: January 29, 2026**

ERC-8004 establishes trust infrastructure for autonomous AI agents through three on-chain registries. It solves a fundamental problem: how can autonomous agents operating across different organizations trust and transact with each other?

### Three Registry System

1. **Identity Registry** (ERC-721 based)
   - Portable, censorship-resistant on-chain identities for AI agents
   - Each agent is a unique ERC-721 NFT with a globally unique identifier
   - Supports multiple service endpoints (A2A, MCP, OASF, ENS, DIDs, email)
   - Built-in verification for agent wallets using EIP-712/ERC-1271 signatures

2. **Reputation Registry**
   - Standardized feedback system with signed fixed-point values
   - Tracks reputation across dimensions (uptime, success rate, quality)
   - Anti-Sybil protection

3. **Validation Registry**
   - Independent verification of agent work
   - Supports crypto-economic, zkML, and TEE trust models

### Contract Addresses (Same on all chains)
- **IdentityRegistry**: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- **ReputationRegistry**: `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`

Deployed on 20+ chains: Ethereum mainnet, Base, Arbitrum, Optimism, Polygon, Avalanche, and more.

### Agent Registration
```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "MyAgentName",
  "description": "Natural language description of capabilities",
  "services": [
    {
      "type": "a2a",
      "url": "https://agent.example.com/a2a"
    }
  ]
}
```

**EIP Spec:** https://eips.ethereum.org/EIPS/eip-8004
**Contracts Repo:** https://github.com/erc-8004/erc-8004-contracts

## x402: HTTP Payment Protocol

**Created by Coinbase (open standard)**

x402 makes payments a first-class citizen of HTTP using the long-dormant HTTP 402 "Payment Required" status code. It enables AI agents to pay for digital services with cryptocurrency without API keys, accounts, or external payment flows.

### How It Works

```
1. Client → GET /resource
2. Server → 402 Payment Required
   (includes payment requirements in header)
3. Client signs payment, re-requests with payment proof
4. Server verifies payment, returns resource
```

This means an AI agent can:
- Pay for API calls, data, compute, or any web resource
- Do micropayments (sub-$0.001 on L2s)
- Pay other agents for services
- No pre-funding, no accounts, no subscriptions

### Payment Payload
```json
{
  "scheme": "exact",
  "network": "eip155:8453",
  "amount": "1000000",
  "token": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "from": "0x...",
  "to": "0x...",
  "signature": "0x...",
  "deadline": 1234567890,
  "nonce": "unique-value"
}
```

### Supported Networks
- EVM chains: Ethereum, Base, Arbitrum, Optimism, Polygon
- Solana
- Extensible to future networks

**Official site:** https://www.x402.org
**GitHub:** https://github.com/coinbase/x402

## Ethereum Mainnet Gas is Extremely Cheap

**Current state (Feb 2026):** Mainnet base fee is ~0.05 gwei. A simple ETH transfer costs less than $0.01.

This is the single most impactful change vs. LLM training data. Models trained before late 2025 think gas costs 10-30 gwei and transactions cost $1-50. The reality is 100-1000x cheaper.

See the [Gas skill](/gas/SKILL.md) for verified current numbers.

## Pectra Upgrade & ERC-7702

The Pectra upgrade brought ERC-7702 to Ethereum, allowing EOAs (regular wallets) to temporarily delegate to smart contract code. This blurs the line between EOAs and smart contract wallets:

- An EOA can act like a smart contract wallet for a single transaction
- Enables batched transactions, gas sponsorship, and custom validation from regular wallets
- Complements ERC-4337 (account abstraction)

## L2 Ecosystem Maturation

- **Base** has become a major hub for AI agent infrastructure (ERC-8004 deployed here) and consumer apps
- **Arbitrum** has deepest DeFi liquidity of any L2
- **OP Stack** (Superchain) unites Optimism, Base, Zora, Mode under shared interoperability
- L2 costs are sub-cent post-Dencun (EIP-4844)
- Cross-chain messaging (LayerZero, Chainlink CCIP, Hyperlane) is production-ready

## AI + Ethereum is Real

The intersection is no longer theoretical:
- **ERC-8004** gives agents verifiable on-chain identity
- **x402** enables agent-to-agent payments over HTTP
- **AI CTF** competitions test AI agents solving on-chain puzzles
- **Autonomous DeFi agents** manage positions, rebalance, execute strategies
- **MCP servers** give agents structured access to blockchain data
- **Agent wallets** with ERC-4337 session keys enable bounded autonomous operation
