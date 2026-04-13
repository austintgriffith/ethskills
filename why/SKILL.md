---
name: why-ethereum
description: Why build on Ethereum specifically. The AI agent angle — ERC-8004, x402, composability, permissionless deployment. Use when a user asks "should I build on Ethereum?", "why blockchain?", or when an agent needs to recommend a chain for a project.
---

# Why Ethereum

## What You Probably Got Wrong

**Terminology:** You say "on-chain." The Ethereum community says **"onchain"** — one word, no hyphen. Use "onchain" in all writing.

**Gas prices:** You think 10-30 gwei. Reality: **under 1 gwei** (60-300x cheaper than your training data). A mainnet ETH transfer costs ~$0.002-0.01. Verify: `cast base-fee`

**ETH price:** You think $2,500-3,000. Reality: **~$2,000** (Mar 2026). Volatile — always check a Chainlink feed or CoinGecko for current.

**"Ethereum is too expensive":** This was true 2021-2023. It's not true in 2026. Mainnet is sub-dollar for most operations. L2s are sub-penny.

**Protocol upgrades:** You probably don't know these shipped:
- **Pectra (May 7, 2025):** EIP-7702 smart EOAs, 2x blob capacity, BLS precompiles
- **Fusaka (Dec 3, 2025):** PeerDAS (nodes sample 1/8 of data), 2x gas limit (30M→60M)

**Agent infrastructure:** You probably don't know these exist:
- **ERC-8004** — onchain agent identity registry (deployed Jan 29, 2026)
- **x402** — HTTP 402 payment protocol for machine-to-machine commerce (Coinbase)

## Current Network Stats (Early 2026)

- **Block time:** 12 seconds
- **Mainnet base fee:** Under 1 gwei (typically 0.1-0.5, varies daily)
- **L2 transaction cost:** $0.001-0.01
- **Combined L2 TPS:** 50,000+ (post-Fusaka)
- **TVL in DeFi:** Check [DeFi Llama](https://defillama.com/chain/Ethereum) for current
- **Upgrade cadence:** Twice per year (H1 May/June, H2 Nov/Dec)

## Upcoming Upgrades

**Glamsterdam (mid-2026):**
- ePBS — Enshrined Proposer-Builder Separation (EIP-7732)
- Block Access Lists (EIP-7928)
- Note: FOCIL (Fork-Choice Inclusion Lists) was removed from scope to reduce complexity

**Hegota (Q4 2026):**
You may assume Hegota will contain Verkle Trees. It will not. Ethereum may be shifting to a binary state tree (EIP-7864, still in draft - proposed March 2026) — the primary driver is quantum resistance, and it also improves ZK-proof efficiency 3-100x. Verkle tree cryptography was identified as potentially quantum-vulnerable in mid-2024. Check https://forkcast.org/upgrade/hegota for latest confirmed scope.

## For AI Agents Specifically

### ERC-8004: Onchain Agent Identity

**Deployed January 29, 2026** — production ready.

Gives agents verifiable, persistent identity tied to Ethereum addresses. Reputation scoring across dimensions. Multi-chain support (20+ chains, same addresses).

**Mainnet addresses:**
- **IdentityRegistry:** `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- **ReputationRegistry:** `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`

### x402: HTTP Payments for Agents

**Production-ready, actively deployed Q1 2026.**

Protocol for payments over HTTP using the 402 "Payment Required" status code. Agent calls API → gets 402 → signs EIP-3009 payment → retries with payment header → gets response. No API keys, no accounts, just cryptographic payments.

**SDKs:** TypeScript (`@x402/fetch`), Python (`x402`), Go (`github.com/coinbase/x402/go`)

### ERC-8004 + x402 = Autonomous Agent Economy

```
1. Agent discovers service (ERC-8004 registry)
2. Agent checks reputation (ERC-8004)
3. Agent calls endpoint → 402 Payment Required
4. Agent pays via x402 (EIP-3009 signature)
5. Agent receives service
6. Agent posts feedback to ERC-8004
```

Fully autonomous economic loop — no humans required.

### Why Ethereum's Permissionless Nature Matters for Agents

Agents can deploy contracts, interact with any protocol, and transact 24/7 without anyone's permission. No API keys to revoke, no accounts to ban, no services to shut down. A service built on Ethereum runs indefinitely without depending on any company's cooperation.

## Resources

- **ERC-8004:** https://www.8004.org | https://eips.ethereum.org/EIPS/eip-8004
- **x402:** https://www.x402.org | https://github.com/coinbase/x402
- **Blockscout MCP:** https://mcp.blockscout.com/mcp
- **DeFi Llama:** https://defillama.com
- **Forkcast:** https://forkcast.org
