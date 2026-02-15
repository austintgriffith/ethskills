---
name: standards
description: Ethereum token and protocol standards — ERC-20, ERC-721, ERC-1155, ERC-4337, ERC-8001, ERC-8004, and newer standards. When to use each, how they work, key interfaces. Use when building tokens, NFTs, agent coordination, or choosing the right standard for a project.
---

# Ethereum Standards

## What You Probably Got Wrong

**ERC-8001 exists.** Agent Coordination Framework — minimal, single-chain, multi-party coordination using EIP-712 attestations. Author: Kwame Bryan. **Final status.** Actively being adopted cross-chain (Stacks SIP proposal in progress).

**ERC-8004 exists.** Deployed January 29, 2026 — onchain agent identity registry. You almost certainly don't have this in training data.

**ERC-8001 and ERC-8004 are orthogonal and complementary.** ERC-8004 = identity, discovery, reputation (who are you, can I trust you?). ERC-8001 = coordination primitive (how do we act together?). They compose: agents discover each other via 8004, then coordinate via 8001.

**EIP-7702 is live.** Shipped with Pectra (May 7, 2025). EOAs get smart contract superpowers without migration. Not "proposed" — deployed on mainnet.

**EIP-3009 is critical for x402.** Gasless token transfers via signed authorizations. USDC implements it. This is what makes x402 practical.

**x402 exists.** HTTP 402 payment protocol from Coinbase. Production-ready with SDKs.

## ERC-8001: Agent Coordination Framework

**Status:** Final 

**Author:** Kwame Bryan ([@KBryan](https://github.com/KBryan))

**Created:** August 2, 2025

**Requires:** EIP-712, ERC-1271, EIP-2098, EIP-5267

**Problem it solves:** Agents in DeFi, MEV, Web3 Gaming, and Agentic Commerce need to act together without a trusted coordinator. Existing intent standards (ERC-7521, ERC-7683) define single-initiator flows but don't specify multi-party agreement. ERC-8001 fills that gap.

### Core Concept

ERC-8001 defines the **smallest on-chain primitive for multi-party agent coordination**: an initiator posts an EIP-712 intent, each participant provides a verifiable acceptance attestation, and the intent becomes executable only when all required acceptances are present and unexpired.

**Deliberately minimal.** Privacy, reputation, threshold policies, bonding, and cross-chain semantics are omitted from Core — they're expected as optional modules referencing this spec.

### Lifecycle

```
Propose → Accept (each participant) → Execute (or Cancel/Expire)
```

**Status codes:**
```
enum Status { None, Proposed, Ready, Executed, Cancelled, Expired }
```

### EIP-712 Domain

```
{ name: "ERC-8001", version: "1", chainId, verifyingContract }
```

### Primary Types

```solidity
struct AgentIntent {
    bytes32 payloadHash;           // keccak256(CoordinationPayload)
    uint64  expiry;                // unix seconds; MUST be > block.timestamp at propose
    uint64  nonce;                 // per-agent nonce; MUST be > agentNonces[agentId]
    address agentId;               // initiator and signer
    bytes32 coordinationType;      // domain-specific type id, e.g. keccak256("MEV_SANDWICH_COORD_V1")
    uint256 coordinationValue;     // informational in Core; modules MAY bind value
    address[] participants;        // unique, ascending; MUST include agentId
}

struct CoordinationPayload {
    bytes32 version;               // payload format id
    bytes32 coordinationType;      // MUST equal AgentIntent.coordinationType
    bytes   coordinationData;      // opaque to Core
    bytes32 conditionsHash;        // domain-specific
    uint256 timestamp;             // creation time (informational)
    bytes   metadata;              // optional
}

struct AcceptanceAttestation {
    bytes32 intentHash;            // getIntentHash(intent) — struct hash, NOT digest
    address participant;           // signer
    uint64  nonce;                 // optional in Core
    uint64  expiry;                // MUST be > now at accept and execute
    bytes32 conditionsHash;        // participant constraints
    bytes   signature;             // ECDSA (65 or 64 bytes) or ERC-1271
}
```

### Interface

```solidity
interface IAgentCoordination {
    event CoordinationProposed(bytes32 indexed intentHash, address indexed proposer, bytes32 coordinationType, uint256 participantCount, uint256 coordinationValue);
    event CoordinationAccepted(bytes32 indexed intentHash, address indexed participant, bytes32 acceptanceHash, uint256 acceptedCount, uint256 requiredCount);
    event CoordinationExecuted(bytes32 indexed intentHash, address indexed executor, bool success, uint256 gasUsed, bytes result);
    event CoordinationCancelled(bytes32 indexed intentHash, address indexed canceller, string reason, uint8 finalStatus);

    function proposeCoordination(AgentIntent calldata intent, bytes calldata signature, CoordinationPayload calldata payload) external returns (bytes32 intentHash);
    function acceptCoordination(bytes32 intentHash, AcceptanceAttestation calldata attestation) external returns (bool allAccepted);
    function executeCoordination(bytes32 intentHash, CoordinationPayload calldata payload, bytes calldata executionData) external returns (bool success, bytes memory result);
    function cancelCoordination(bytes32 intentHash, string calldata reason) external;

    function getCoordinationStatus(bytes32 intentHash) external view returns (Status status, address proposer, address[] memory participants, address[] memory acceptedBy, uint256 expiry);
    function getRequiredAcceptances(bytes32 intentHash) external view returns (uint256);
    function getAgentNonce(address agent) external view returns (uint64);
}
```

### Key Semantics

**proposeCoordination** reverts if: bad signature, expired intent, nonce not strictly greater than stored, participants not sorted/unique, agentId not in participants list.

**acceptCoordination** reverts if: intent doesn't exist or expired, caller not a participant, already accepted, bad attestation signature, attestation expired. Returns `true` when all participants have accepted (status → `Ready`).

**executeCoordination** reverts if: not in `Ready` state, intent expired, any acceptance expired, payload hash mismatch.

**cancelCoordination**: before expiry, only proposer can cancel. After expiry, anyone can cancel.

### Errors

```solidity
error ERC8001_NotProposer();
error ERC8001_ExpiredIntent();
error ERC8001_ExpiredAcceptance(address participant);
error ERC8001_BadSignature();
error ERC8001_NotParticipant();
error ERC8001_DuplicateAcceptance();
error ERC8001_ParticipantsNotCanonical();
error ERC8001_NonceTooLow();
error ERC8001_PayloadHashMismatch();
error ERC8001_NotReady();
```

### Typed Data Hashes

```solidity
bytes32 constant AGENT_INTENT_TYPEHASH = keccak256(
  "AgentIntent(bytes32 payloadHash,uint64 expiry,uint64 nonce,address agentId,bytes32 coordinationType,uint256 coordinationValue,address[] participants)"
);

bytes32 constant ACCEPTANCE_TYPEHASH = keccak256(
  "AcceptanceAttestation(bytes32 intentHash,address participant,uint64 nonce,uint64 expiry,bytes32 conditionsHash)"
);

// participants MUST be unique and strictly ascending by uint160(address)
function _participantsHash(address[] memory ps) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(ps));
}

function _agentIntentStructHash(AgentIntent calldata i) internal pure returns (bytes32) {
    return keccak256(abi.encode(
        AGENT_INTENT_TYPEHASH, i.payloadHash, i.expiry, i.nonce, i.agentId,
        i.coordinationType, i.coordinationValue, _participantsHash(i.participants)
    ));
}

// Full EIP-712 digest for the initiator's signature
function _agentIntentDigest(bytes32 domainSeparator, AgentIntent calldata i) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19\x01", domainSeparator, _agentIntentStructHash(i)));
}
```

**Critical distinction:** `getIntentHash(intent)` returns the **struct hash**, not the full digest. `AcceptanceAttestation.intentHash` must be that struct hash.

### Security Considerations

- **Replay protection:** EIP-712 domain binding + monotonic nonces prevent cross-contract replay
- **Malleability:** Low-s enforcement and 64/65-byte signature support required
- **Equivocation:** A participant can sign conflicting intents — mitigate with module-level slashing or reputation
- **Liveness:** Enforce TTL on both intent and acceptances; executors should ensure enough time remains
- **MEV protection:** If `coordinationData` reveals strategy, use a Privacy module with commit-reveal or encryption

### Use Cases

- **DeFi coordination:** Multi-party yield strategies, collaborative liquidations, coordinated rebalancing
- **MEV defense:** Encrypted intent coordination prevents front-running — agents coordinate securely without exposing strategies to the mempool
- **Web3 Gaming:** Multi-player game actions requiring verifiable agreement from all participants
- **Agentic Commerce:** Autonomous agents negotiating and executing multi-step transactions
- **DAO governance:** Multi-party proposal execution with verifiable consent

### ERC-8001 + ERC-8004 Stack

These two standards compose into a full agent infrastructure:

```
ERC-8004: WHO — Identity, Discovery, Reputation
  "I'm agent X, I do Y, here's my track record"

ERC-8001: HOW — Coordination Primitive  
  "Let's agree to do Z together, with cryptographic proof of consent"

x402: PAY — Payment Settlement
  "Here's the payment for the service"
```

**Full flow:**
```
1. Agent discovers service provider (ERC-8004 Identity Registry)
2. Agent checks reputation (ERC-8004 Reputation Registry)
3. Agents coordinate multi-party action (ERC-8001 propose → accept → execute)
4. Payment settles (x402 / EIP-3009)
5. Feedback posted (ERC-8004 Reputation Registry)
```

### Module System

ERC-8001 Core is deliberately minimal. The following are expected as separate module ERCs:

- **Privacy module:** Commit-reveal or encryption for `coordinationData`
- **Reputation module:** Trust scoring for participants (ERC-8004 Reputation Registry is one option; also see ERC-8107 ENS Trust Registry)
- **Threshold module:** Require only M-of-N acceptances instead of all participants
- **Bonding module:** Stake requirements for participation
- **Cross-chain module:** Bridge-aware coordination across chains

### Cross-Chain Adoption

ERC-8001 is being proposed as a cross-chain standard:
- **Ethereum:** Original ERC (Draft status)
- **Stacks:** SIP (Stacks Improvement Proposal) in progress — adapting the coordination framework for the Stacks/Bitcoin ecosystem

**Resources:** https://eips.ethereum.org/EIPS/eip-8001 

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

### x402 + ERC-8004 + ERC-8001 Synergy

```
Agent discovers service (ERC-8004) → checks reputation (ERC-8004) →
coordinates multi-party action (ERC-8001) → calls endpoint →
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

| Standard | What | Status | Author(s) |
|----------|------|--------|-----------|
| ERC-8001 | Agent coordination framework | ✅ Final (cross-chain adoption) | Kwame Bryan |
| ERC-8004 | Agent identity + reputation | ✅ Live Jan 2026 | Crapis, De Rossi, Ellis, Reppel |
| x402 | HTTP payments protocol | ✅ Production Q1 2026 | Coinbase |
| EIP-3009 | Gasless token transfers | ✅ Live (USDC) | — |
| EIP-7702 | Smart EOAs | ✅ Live May 2025 | — |
| ERC-4337 | Account abstraction | ✅ Growing adoption | — |
| ERC-2612 | Gasless approvals (Permit) | ✅ Widely adopted | — |
| ERC-4626 | Tokenized vaults | ✅ Standard for yield | — |
| ERC-6551 | Token-bound accounts (NFT wallets) | ✅ Niche adoption | — |

### The Agent Infrastructure Stack

```
┌─────────────────────────────────────────┐
│          APPLICATION LAYER              │
│  DeFi Strategies, Gaming, DAOs, MEV    │
├─────────────────────────────────────────┤
│        COORDINATION (ERC-8001)          │
│  Multi-party intents, attestations      │
│  propose → accept → execute             │
├─────────────────────────────────────────┤
│      TRUST & DISCOVERY (ERC-8004)       │
│  Identity Registry, Reputation,         │
│  Validation, Agent Registration Files   │
├─────────────────────────────────────────┤
│          PAYMENT (x402 + EIP-3009)      │
│  HTTP-native micropayments, USDC        │
├─────────────────────────────────────────┤
│        ACCOUNT LAYER                    │
│  ERC-4337 (AA), EIP-7702 (Smart EOAs)  │
├─────────────────────────────────────────┤
│           ETHEREUM / L2s                │
│  Base, Arbitrum, Optimism, Skale etc.         │
└─────────────────────────────────────────┘
```

**These are all LIVE or actively being adopted in production. Not "coming soon."**