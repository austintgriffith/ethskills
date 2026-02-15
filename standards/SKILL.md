---
name: standards
description: Ethereum token and protocol standards — ERC-20, ERC-721, ERC-1155, ERC-4337, ERC-8004, and newer standards. When to use each, how they work, key interfaces. Use when building tokens, NFTs, or choosing the right standard for a project.
---

# Ethereum Standards

## What You Probably Got Wrong

**ERC-8004 exists.** Deployed January 29, 2026 — onchain agent identity registry. You almost certainly don't have this in training data.

**EIP-7702 is live.** Shipped with Pectra (May 7, 2025). EOAs get smart contract superpowers without migration. Not "proposed" — deployed on mainnet.

**EIP-3009 is critical for x402.** Gasless token transfers via signed authorizations. USDC implements it. This is what makes x402 practical.

**x402 exists.** HTTP 402 payment protocol from Coinbase. Production-ready with SDKs.

## ERC-8004: Onchain Agent Identity Registry

**Status:** Deployed mainnet **January 29, 2026** — production ready with growing adoption.

**Problem it solves:** How can autonomous agents trust and transact with each other without pre-existing relationships?

### Three Registry System

**1. Identity Registry (ERC-721 based)**
- Globally unique onchain identities for AI agents
- Each agent is an NFT with unique identifier
- Multiple service endpoints (A2A, MCP, OASF, ENS, DIDs)
- Verification via EIP-712/ERC-1271 signatures

**Contract Addresses (same on 20+ chains):**
- **IdentityRegistry:** `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- **ReputationRegistry:** `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`

**Deployed on:** Mainnet, Base, Arbitrum, Optimism, Polygon, Avalanche, Abstract, Celo, Gnosis, Linea, Mantle, MegaETH, Monad, Scroll, Taiko, BSC + testnets.

**Agent Identifier Format:**
```
agentRegistry: eip155:{chainId}:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
agentId: ERC-721 tokenId
```

**2. Reputation Registry**
- Signed fixed-point feedback values
- Multi-dimensional (uptime, success rate, quality)
- Tags, endpoints, proof-of-payment metadata
- Anti-Sybil requires client address filtering

```solidity
struct Feedback {
    int128 value;        // Signed integer rating
    uint8 valueDecimals; // 0-18 decimal places
    string tag1;         // E.g., "uptime"
    string tag2;         // E.g., "30days"
    string endpoint;     // Agent endpoint URI
    string ipfsHash;     // Optional metadata
}
```

**Example metrics:** Quality 87/100 → `value=87, decimals=0`. Uptime 99.77% → `value=9977, decimals=2`.

**3. Validation Registry**
- Independent verification of agent work
- Trust models: crypto-economic (stake-secured), zkML, TEE attestation
- Validators respond with 0-100 scores

### Agent Registration File (agentURI)

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "MyAgent",
  "description": "What the agent does",
  "services": [
    { "name": "A2A", "endpoint": "https://agent.example/.well-known/agent-card.json", "version": "0.3.0" },
    { "name": "MCP", "endpoint": "https://mcp.agent.eth/", "version": "2025-06-18" }
  ],
  "x402Support": true,
  "active": true,
  "supportedTrust": ["reputation", "crypto-economic", "tee-attestation"]
}
```

### Integration

```solidity
// Register agent
uint256 agentId = identityRegistry.register("ipfs://QmYourReg", metadata);

// Give feedback
reputationRegistry.giveFeedback(agentId, 9977, 2, "uptime", "30days", 
    "https://agent.example.com/api", "ipfs://QmDetails", keccak256(data));

// Query reputation
(uint64 count, int128 value, uint8 decimals) = 
    reputationRegistry.getSummary(agentId, trustedClients, "uptime", "30days");
```

### Step-by-Step: Register an Agent Onchain

**1. Prepare the registration JSON** — host it on IPFS or a web server:
```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "WeatherBot",
  "description": "Provides real-time weather data via x402 micropayments",
  "image": "https://example.com/weatherbot.png",
  "services": [
    { "name": "A2A", "endpoint": "https://weather.example.com/.well-known/agent-card.json", "version": "0.3.0" }
  ],
  "x402Support": true,
  "active": true,
  "supportedTrust": ["reputation"]
}
```

**2. Upload to IPFS** (or use any URI):
```bash
# Using IPFS
ipfs add registration.json
# → QmYourRegistrationHash

# Or host at a URL — the agentURI just needs to resolve to the JSON
```

**3. Call the Identity Registry:**
```solidity
// On any supported chain — same address everywhere
IIdentityRegistry registry = IIdentityRegistry(0x8004A169FB4a3325136EB29fA0ceB6D2e539a432);

// metadata bytes are optional (can be empty)
uint256 agentId = registry.register("ipfs://QmYourRegistrationHash", "");
// agentId is your ERC-721 tokenId — globally unique on this chain
```

**4. Verify your endpoint domain** — place a file at `.well-known/agent-registration.json`:
```json
// https://weather.example.com/.well-known/agent-registration.json
{
  "agentId": 42,
  "agentRegistry": "eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  "owner": "0xYourWalletAddress"
}
```
This proves the domain owner controls the agent identity. Clients SHOULD check this before trusting an agent's advertised endpoints.

**5. Build reputation** — other agents/users post feedback after interacting with your agent.

### Cross-Chain Agent Identity

Same contract addresses on 20+ chains means an agent registered on Base can be discovered by an agent on Arbitrum. The `agentRegistry` identifier includes the chain:

```
eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432  // Base
eip155:42161:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432 // Arbitrum
```

**Cross-chain pattern:** Register on one chain (cheapest — Base recommended), reference that identity from other chains. Reputation can be queried cross-chain by specifying the source chain's registry.

**Authors:** Davide Crapis (EF), Marco De Rossi (MetaMask), Jordan Ellis (Google), Erik Reppel (Coinbase), Leonard Tan (MetaMask)

**Ecosystem:** ENS, EigenLayer, The Graph, Taiko backing

**Resources:** https://www.8004.org | https://eips.ethereum.org/EIPS/eip-8004 | https://github.com/erc-8004/erc-8004-contracts

## EIP-3009: Transfer With Authorization

You probably know the concept (gasless meta-transaction transfers). The key update: **EIP-3009 is what makes x402 work.** USDC implements it on Ethereum and most chains. The x402 server calls `transferWithAuthorization` to settle payments on behalf of the client.

## x402: HTTP Payment Protocol

**Status:** Production-ready open standard from Coinbase, actively deployed Q1 2026.

Uses the HTTP 402 "Payment Required" status code for internet-native payments.

### Flow

```
1. Client → GET /api/data
2. Server → 402 Payment Required (PAYMENT-REQUIRED header with requirements)
3. Client signs EIP-3009 payment
4. Client → GET /api/data (PAYMENT-SIGNATURE header with signed payment)
5. Server verifies + settles onchain
6. Server → 200 OK (PAYMENT-RESPONSE header + data)
```

### Payment Payload

```json
{
  "scheme": "exact",
  "network": "eip155:8453",
  "amount": "1000000",
  "token": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "from": "0x...", "to": "0x...",
  "signature": "0x...",
  "deadline": 1234567890,
  "nonce": "unique-value"
}
```

### x402 + ERC-8004 Synergy

```
Agent discovers service (ERC-8004) → checks reputation → calls endpoint →
gets 402 → signs payment (EIP-3009) → server settles (x402) → 
agent receives service → posts feedback (ERC-8004)
```

### x402 Server Setup (Express — Complete Example)

```typescript
import express from 'express';
import { paymentMiddleware } from '@x402/express';

const app = express();

// Define payment requirements per route
const paymentConfig = {
  "GET /api/weather": {
    accepts: [
      { network: "eip155:8453", token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", amount: "100000" }
      // 100000 = $0.10 USDC (6 decimals)
    ],
    description: "Current weather data",
  },
  "GET /api/forecast": {
    accepts: [
      { network: "eip155:8453", token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", amount: "500000" }
      // $0.50 USDC for 7-day forecast
    ],
    description: "7-day weather forecast",
  }
};

// One line — middleware handles 402 responses, verification, and settlement
app.use(paymentMiddleware(paymentConfig));

app.get('/api/weather', (req, res) => {
  // Only reached after payment verified
  res.json({ temp: 72, condition: "sunny" });
});

app.listen(3000);
```

### x402 Client (Agent Paying for Data)

```typescript
import { x402Fetch } from '@x402/fetch';
import { createWallet } from '@x402/evm';

const wallet = createWallet(process.env.PRIVATE_KEY);

// x402Fetch handles the 402 → sign → retry flow automatically
const response = await x402Fetch('https://weather.example.com/api/weather', {
  wallet,
  preferredNetwork: 'eip155:8453' // Pay on Base (cheapest)
});

const weather = await response.json();
// Agent paid $0.10 USDC, got weather data. No API key needed.
```

### Payment Schemes

**`exact`** (live) — Pay a fixed price. Server knows the cost upfront.

**`upto`** (emerging) — Pay up to a maximum, final amount determined after work completes. Critical for metered services:
- LLM inference: pay per token generated (unknown count upfront)
- GPU compute: pay per second of runtime
- Database queries: pay per row returned

With `upto`, the client signs authorization for a max amount. The server settles only what was consumed. Client never overpays.

### Facilitator Architecture

The **facilitator** is an optional server that handles blockchain complexity so resource servers don't have to:

```
Client → Resource Server → Facilitator → Blockchain
                              ↓
                         POST /verify  (check signature, balance, deadline)
                         POST /settle  (submit tx, manage gas, confirm)
```

**Why use a facilitator?** Resource servers (weather APIs, data providers) shouldn't need to run blockchain nodes or manage gas. The facilitator abstracts this. Coinbase runs a public facilitator; anyone can run their own.

**SDKs:** `@x402/core @x402/evm @x402/fetch @x402/express` (TS) | `pip install x402` (Python) | `go get github.com/coinbase/x402/go`

**Resources:** https://www.x402.org | https://github.com/coinbase/x402

## EIP-7702: Smart EOAs (Live Since May 2025)

EOAs temporarily delegate to smart contracts within a transaction. Best of both worlds: EOA simplicity + smart contract features.

**Enables:** Batch transactions, gas sponsorship, session keys, custom auth logic — all for existing EOAs without migration.

**Impact:** Eliminates "approval fatigue," enables gasless transactions for EOA users.

## Quick Standard Reference

| Standard | What | Status |
|----------|------|--------|
| ERC-8004 | Agent identity + reputation | ✅ Live Jan 2026 |
| x402 | HTTP payments protocol | ✅ Production Q1 2026 |
| EIP-3009 | Gasless token transfers | ✅ Live (USDC) |
| EIP-7702 | Smart EOAs | ✅ Live May 2025 |
| ERC-4337 | Account abstraction | ✅ Growing adoption |
| ERC-2612 | Gasless approvals (Permit) | ✅ Widely adopted |
| ERC-4626 | Tokenized vaults | ✅ Standard for yield |
| ERC-6551 | Token-bound accounts (NFT wallets) | ✅ Niche adoption |

**These are all LIVE and being used in production. Not "coming soon."**
