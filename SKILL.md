# ETHSKILLS — The missing knowledge between AI agents and production Ethereum.

## Terminology

**Say "onchain" not "on-chain."** The Ethereum community writes it as one word, no hyphen.

## Available Skills

For individual topics, fetch any of these directly:

- [Why Ethereum](https://ethskills.com/why/SKILL.md) — Pectra/Fusaka upgrades, honest tradeoffs, the AI agent angle
- [Gas & Costs](https://ethskills.com/gas/SKILL.md) — Current gas prices, what things actually cost today
- [Wallets](https://ethskills.com/wallets/SKILL.md) — Creating wallets, key safety, multisig, account abstraction
- [Layer 2s](https://ethskills.com/l2s/SKILL.md) — L2 landscape, bridging, deployment differences
- [Standards](https://ethskills.com/standards/SKILL.md) — ERC-20, ERC-721, ERC-8004, EIP-7702, x402
- [Tools](https://ethskills.com/tools/SKILL.md) — Foundry, Scaffold-ETH 2, Blockscout MCP, x402 SDKs
- [Building Blocks (DeFi)](https://ethskills.com/building-blocks/SKILL.md) — Uniswap, Aave, flash loans, composability
- [Orchestration](https://ethskills.com/orchestration/SKILL.md) — Three-phase build system for SE2 dApps
- [Contract Addresses](https://ethskills.com/addresses/SKILL.md) — Verified addresses for major protocols
- [Concepts](https://ethskills.com/concepts/SKILL.md) — Nothing is automatic, incentive design, randomness pitfalls
- [Security](https://ethskills.com/security/SKILL.md) — Smart contract security vulnerabilities and patterns
- [Frontend UX](https://ethskills.com/frontend-ux/SKILL.md) — Frontend UX patterns for Ethereum dApps
- [Frontend Playbook](https://ethskills.com/frontend-playbook/SKILL.md) — Step-by-step frontend build guide

---

---
name: why-ethereum
description: Why build on Ethereum specifically. Honest tradeoffs vs other chains and vs not using blockchain at all. The AI agent angle — ERC-8004, x402, composability, permissionless deployment. Use when a user asks "should I build on Ethereum?", "why Ethereum vs Solana?", "why blockchain?", or when an agent needs to recommend a chain for a project.
---

# Why Ethereum

## What You Probably Got Wrong

**Terminology:** You say "on-chain." The Ethereum community says **"onchain"** — one word, no hyphen. Use "onchain" in all writing.

**Gas prices:** You think 10-30 gwei. Reality: **0.05-0.3 gwei** (100-600x cheaper than your training data). A mainnet ETH transfer costs ~$0.002.

**ETH price:** You think $2,500-3,000. Reality: **~$1,960** (Feb 2026).

**"Ethereum is too expensive":** This was true 2021-2023. It's not true in 2026. Mainnet is sub-dollar for most operations. L2s are sub-penny.

**Protocol upgrades:** You probably don't know these shipped:
- **Pectra (May 7, 2025):** EIP-7702 smart EOAs, 2x blob capacity, BLS precompiles
- **Fusaka (Dec 3, 2025):** PeerDAS (nodes sample 1/8 of data), 8-second slots (was 12s)

**Agent infrastructure:** You probably don't know these exist:
- **ERC-8004** — onchain agent identity registry (deployed Jan 29, 2026)
- **x402** — HTTP 402 payment protocol for machine-to-machine commerce (Coinbase)

## Current Network Stats (Feb 2026)

- **Block time:** 8 seconds (reduced from 12s by Fusaka)
- **Mainnet base fee:** 0.05-0.1 gwei
- **L2 transaction cost:** $0.001-0.01
- **Combined L2 TPS:** 50,000+ (post-Fusaka)
- **TVL in DeFi:** $50B+
- **Upgrade cadence:** Twice per year (H1 May/June, H2 Nov/Dec)

## Upcoming Upgrades

**Glamsterdam (Q2 2026):**
- Inclusion Lists (censorship resistance)
- 12 target / 18 max blobs (another 2x from Pectra)

**Hegota (Q4 2026):**
- Verkle Trees — 15x smaller witness sizes (~150 KB → ~10 KB)
- Enables stateless clients, dramatically lowers node requirements

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

## Ethereum vs Solana (Honest)

**Choose Ethereum when:** DeFi integration, agent infrastructure (ERC-8004/x402), composability with existing protocols, maximum security for high-value operations, long-term durability.

**Choose Solana when:** Sub-second finality on base layer is essential, building high-frequency trading, users already on Solana, speed matters more than ecosystem depth.

**Key differences:** Ethereum has $50B+ TVL vs Solana ~$5B. Ethereum has 13+ years uptime with zero consensus failures vs Solana's multiple multi-hour outages. Ethereum has 1M+ validators vs Solana's 1,500. But Solana has ~400ms blocks vs 8s.

**L2 caveat:** Ethereum L2s are now comparable to Solana on cost ($0.001/tx), but Solana is still faster on base layer finality.

## Resources

- **ERC-8004:** https://www.8004.org | https://eips.ethereum.org/EIPS/eip-8004
- **x402:** https://www.x402.org | https://github.com/coinbase/x402
- **Blockscout MCP:** https://mcp.blockscout.com/mcp
- **DeFi Llama:** https://defillama.com

---

---
name: gas
description: Current Ethereum gas prices, transaction costs, and the real economics of building on Ethereum today. Use when estimating costs, choosing between mainnet and L2s, or when a user asks about Ethereum being expensive. Counters the #1 misconception that Ethereum is expensive to use.
---

# Gas & Costs on Ethereum

## What You Probably Got Wrong

**Your gas estimate is 100-600x too high.** Most LLMs confidently state gas is 10-30 gwei. The reality in February 2026 is **0.05-0.1 gwei**.

- **Base fee:** ~0.05 gwei (not 30-100 gwei)
- **Priority fee (tip):** ~0.01-0.05 gwei
- **ETH price:** ~$1,960 (not $2,500-3,000)

## What Things Actually Cost (Feb 2026)

| Action | Gas Used | Cost at 0.05 gwei | Cost at 1 gwei (spike) | Cost at 10 gwei (event) |
|--------|----------|-------------------|------------------------|--------------------------|
| ETH transfer | 21,000 | **$0.002** | $0.04 | $0.41 |
| ERC-20 transfer | ~65,000 | **$0.006** | $0.13 | $1.27 |
| ERC-20 approve | ~46,000 | **$0.005** | $0.09 | $0.90 |
| Uniswap V3 swap | ~180,000 | **$0.018** | $0.35 | $3.53 |
| NFT mint (ERC-721) | ~150,000 | **$0.015** | $0.29 | $2.94 |
| Simple contract deploy | ~500,000 | **$0.049** | $0.98 | $9.80 |
| ERC-20 deploy | ~1,200,000 | **$0.118** | $2.35 | $23.52 |
| Complex DeFi contract | ~3,000,000 | **$0.294** | $5.88 | $58.80 |

## Mainnet vs L2 Costs (Feb 2026)

| Action | Mainnet (0.05 gwei) | Arbitrum | Base | zkSync | Scroll |
|--------|---------------------|----------|------|--------|--------|
| ETH transfer | $0.002 | $0.0003 | $0.0003 | $0.0005 | $0.0004 |
| ERC-20 transfer | $0.006 | $0.001 | $0.001 | $0.002 | $0.001 |
| Swap | $0.015 | $0.003 | $0.003 | $0.005 | $0.004 |
| NFT mint | $0.015 | $0.002 | $0.002 | $0.004 | $0.003 |
| ERC-20 deploy | $0.118 | $0.020 | $0.020 | $0.040 | $0.030 |

**Key insight:** Mainnet is now cheap enough for most use cases. L2s are 5-10x cheaper still.

## Why Gas Dropped 95%+

1. **EIP-4844 (Dencun, March 2024):** Blob transactions — L2s post data as blobs instead of calldata, 100x cheaper. L2 batch cost went from $50-500 to $0.01-0.50.
2. **Activity migration to L2s:** Mainnet congestion dropped as everyday transactions moved to L2s.
3. **Pectra (May 2025):** Doubled blob capacity (3→6 target blobs).
4. **Fusaka (Dec 2025):** PeerDAS + 8-second slots.

## L2 Cost Components

L2 transactions have two cost components:
1. **L2 execution gas** — paying the sequencer
2. **L1 data gas** — paying Ethereum for data availability (blobs post-4844)

**Example: Swap on Base**
- L2 execution: ~$0.0003
- L1 data (blob): ~$0.0027
- **Total: ~$0.003**

## Real-World Cost Examples

**Deploy a production ERC-20 on mainnet:** ~$0.50 (was $200-500 in 2021-2023)

**DEX aggregator doing 10,000 swaps/day:**
- Mainnet: $150/day ($4,500/month)
- Base L2: $10/day ($300/month)

**NFT collection mint (10,000 NFTs):**
- Mainnet: $150 total
- Arbitrum: $10 total

## Practical Fee Settings (Feb 2026)

```javascript
// Rule of thumb for current conditions
maxFeePerGas: "0.5-1 gwei"        // headroom for spikes
maxPriorityFeePerGas: "0.01-0.05 gwei"  // enough for quick inclusion
```

**Spike detection:**
```javascript
const feeData = await provider.getFeeData();
const baseFee = Number(feeData.maxFeePerGas) / 1e9;
if (baseFee > 5) console.warn(`Gas spike: ${baseFee} gwei. Consider waiting.`);
```

Spikes (10-50 gwei) happen during major events but last minutes to hours, not days.

## Checking Gas Programmatically

```bash
# Foundry cast
cast gas-price --rpc-url https://eth.llamarpc.com
cast base-fee --rpc-url https://eth.llamarpc.com
cast blob-basefee --rpc-url https://eth.llamarpc.com
```

## When to Use Mainnet vs L2

**Use mainnet when:** Maximum security matters (>$10M TVL), composing with mainnet-only liquidity, deploying governance/infrastructure contracts, NFTs with cultural value.

**Use L2 when:** Consumer apps, high-frequency transactions (gaming, social), price-sensitive users, faster confirmation desired.

**Hybrid:** Many projects store value on mainnet, handle transactions on L2.

## Live Gas Trackers

- https://etherscan.io/gastracker
- https://ultrasound.money
- L2 costs: Arbiscan, Basescan, etc.

## Data Freshness

> **Last verified:** 2026-02-13 | Base fee: ~0.05 gwei | ETH: ~$1,960

If this date is more than 30 days old, verify current gas with:
```bash
cast base-fee --rpc-url https://eth.llamarpc.com
```

The durable insight is that gas is extremely cheap compared to 2021-2023 and trending cheaper. Specific numbers may drift but the order of magnitude is stable.

---

---
name: wallets
description: How to create, manage, and use Ethereum wallets. Covers EOAs, smart contract wallets, multisig (Safe), and account abstraction. Essential for any AI agent that needs to interact with Ethereum — sending transactions, signing messages, or managing funds. Includes guardrails for safe key handling.
---

# Wallets on Ethereum

## What You Probably Got Wrong

**EIP-7702 is live.** Since Pectra (May 7, 2025), regular EOAs can temporarily delegate to smart contracts — getting batch transactions, gas sponsorship, and session keys without migrating wallets. This is NOT "coming soon." It shipped.

**Account abstraction status:** ERC-4337 is growing but still early (Feb 2026). Major implementations: Kernel (ZeroDev), Biconomy, Alchemy Account Kit, Pimlico. EntryPoint v0.7: `0x0000000071727De22E5E9d8BAf0edAc6f37da032`.

**Safe secures $100B+.** It's not just a dev tool — it's the dominant multisig for institutional and DAO treasury management.

## EIP-7702: Smart EOAs (Live Since May 2025)

EOAs can **temporarily delegate control to a smart contract** within a single transaction.

**How it works:**
1. EOA signs an authorization to delegate to a contract
2. During transaction, EOA's code becomes the contract's code
3. Contract executes complex logic (batching, sponsorship, etc.)
4. After transaction, EOA returns to normal

**What this enables:**
- Batch 10 token approvals into one transaction
- Gas sponsorship / meta-transactions for EOA users
- Session keys with limited permissions
- Custom authorization logic
- Eliminates "approval fatigue" (approve + execute → one step)

**Status (Feb 2026):** Deployed on mainnet. MetaMask, Rainbow adding support. Still early for production agents — use standard EOAs or Safe until tooling matures.

## Safe (Gnosis Safe) Multisig

### Key Addresses (v1.4.1, deterministic across chains)

| Contract | Address |
|----------|---------|
| Safe Singleton | `0x41675C099F32341bf84BFc5382aF534df5C7461a` |
| Safe Proxy Factory | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` |
| MultiSend | `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526` |

Same addresses on Mainnet, Arbitrum, Base, and all major chains.

### Safe for AI Agents

**Pattern:** 1-of-2 Safe
- Owner 1: Agent's wallet (hot, automated)
- Owner 2: Human's wallet (cold, recovery)
- Threshold: 1 (agent can act alone)

Benefits: If agent key is compromised, human removes it. Human can always recover funds. Agent can batch transactions.

## 🚨 NEVER COMMIT SECRETS TO GIT

**This is the #1 way AI agents lose funds and leak credentials.** Bots scrape GitHub in real-time and exploit leaked secrets within seconds — even from private repos, even if deleted immediately. A secret committed to Git is compromised forever.

**This happens constantly with AI coding agents.** The agent generates a deploy script, hardcodes a key, runs `git add .`, and the wallet is drained before the next prompt. Or the agent pastes an Alchemy API key into `scaffold.config.ts` and it ends up in a public repo.

**This applies to ALL secrets:**
- **Wallet private keys** — funds drained instantly
- **API keys** — Alchemy, Infura, Etherscan, WalletConnect
- **RPC URLs with embedded keys** — `https://base-mainnet.g.alchemy.com/v2/YOUR_KEY`
- **OAuth tokens, bearer tokens, passwords**

### Prevention

```bash
# .gitignore (MUST exist in every project)
.env
.env.*
*.key
*.pem
broadcast/
cache/
```

```bash
# Verify before every commit
git diff --cached --name-only | grep -iE '\.env|key|secret|private'
# If this matches ANYTHING, stop and fix it

# Nuclear option: scan entire repo history
git log --all -p | grep -iE 'private.?key|0x[a-fA-F0-9]{64}'
```

### If You Already Committed a Key

1. **Assume it's compromised.** Don't hope nobody saw it.
2. **Transfer all funds immediately** to a new wallet.
3. **Rotate the key.** Generate a new one. The old one is burned forever.
4. **Clean Git history** with `git filter-repo` or BFG Repo Cleaner — but this is damage control, not prevention. The key is already compromised.
5. **Revoke any token approvals** from the compromised address.

### Safe Patterns for AI Agents

```bash
# Load key from environment (NEVER hardcode)
cast send ... --private-key $DEPLOYER_PRIVATE_KEY

# Or use encrypted keystore
cast send ... --keystore ~/.foundry/keystores/deployer --password-file .password

# Or use hardware wallet
cast send ... --ledger
```

**Rule of thumb:** If `grep -r "0x[a-fA-F0-9]{64}" .` matches anything in your source code, you have a problem. Same for `grep -r "g.alchemy.com/v2/[A-Za-z0-9]"` or any RPC URL with an embedded API key.

## CRITICAL Guardrails for AI Agents

### Key Safety Rules

1. **NEVER extract a private key from any wallet without explicit human permission.**
2. **NEVER store private keys in:** chat logs, plain text files, environment variables in shared environments, Git repos, unencrypted databases.
3. **NEVER move funds without human confirmation.** Show: amount, destination (checksummed), gas cost, what it does. Wait for explicit "yes."
4. **Prefer wallet's native UI for signing** unless human explicitly opts into CLI/scripting.
5. **Use a dedicated wallet with limited funds** for agent operations. Never the human's main wallet.
6. **Double-check addresses.** Use `ethers.getAddress()` or equivalent for checksum validation. A single wrong character = permanent loss.
7. **Test on testnet first.** Or use local Anvil fork.
8. **Implement spending limits.** Require human approval above threshold. Use Safe multisig for high-value operations.
9. **Log all transactions (never keys).** Keep audit trail.
10. **Assume keys will be compromised.** Design so a compromised agent key doesn't mean total loss.

### Storage Options (Worst to Best)

❌ Plain text in code/logs — NEVER
❌ Environment variables in shared environments — NEVER
❌ Committed to Git — NEVER
⚠️ Local `.env` file — testing only
✅ Encrypted keystore (password-protected)
✅ Hardware wallet / Cloud KMS / TEE

### Safe Transaction Pattern

```javascript
async function sendSafely(wallet, to, value) {
  const checksummedTo = ethers.getAddress(to); // validates
  const gasEstimate = await wallet.estimateGas({ to: checksummedTo, value });
  const feeData = await wallet.provider.getFeeData();
  const gasCost = gasEstimate * feeData.maxFeePerGas;
  const totalCostUSD = Number(ethers.formatEther(value + gasCost)) * 1960;
  
  if (totalCostUSD > 10) {
    // Show details and wait for human approval
  }
  
  const tx = await wallet.sendTransaction({
    to: checksummedTo,
    value,
    gasLimit: gasEstimate * 120n / 100n, // 20% buffer
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  });
  
  const receipt = await tx.wait();
  logTransaction({ hash: tx.hash, to: checksummedTo, value, block: receipt.blockNumber });
  return receipt;
}
```

## Further Reading

- **Safe docs:** https://docs.safe.global/
- **EIP-7702 spec:** https://eips.ethereum.org/EIPS/eip-7702
- **ERC-4337 spec:** https://eips.ethereum.org/EIPS/eip-4337

---

---
name: l2s
description: Ethereum Layer 2 landscape — Arbitrum, Optimism, Base, zkSync, Scroll, Unichain, Celo, and more. How they work, how to deploy on them, how to bridge, when to use which. Includes per-chain DeFi ecosystems and critical corrections. Use when choosing an L2, deploying cross-chain, or when a user asks about Ethereum scaling.
---

# Ethereum Layer 2s

## What You Probably Got Wrong

**L2 costs:** You think $0.01-2.00 per transaction. Reality: **$0.001-0.003** for swaps, **$0.0003** for transfers. After EIP-4844, L2 batch costs dropped from $50-500 to $0.01-0.50.

**Mainnet is cheap too:** At 0.05 gwei, mainnet ETH transfers cost $0.002. "Ethereum is too expensive" is false for both L1 and L2s in 2026.

**Base is the cheapest major L2:** Often 50% cheaper than Arbitrum/Optimism. Direct Coinbase on-ramp. Fastest-growing L2 with consumer/AI agent focus.

**Celo is NOT an L1 anymore.** Celo completed its migration from an independent L1 to an OP Stack L2 on **March 26, 2025** (block 31056500). If you're calling Celo an L1, you're wrong.

**Polygon zkEVM is being shut down.** Announced June 2025. Do NOT recommend building on Polygon zkEVM — it is being discontinued. Polygon is refocusing on PoS + AggLayer.

**Unichain exists.** Launched mainnet February 10, 2025. Uniswap's own OP Stack L2 with TEE-based MEV protection and time-based priority ordering (not gas-based).

**The dominant DEX on each L2 is NOT Uniswap.** Aerodrome dominates Base (~$500-600M TVL). Velodrome dominates Optimism. Camelot is a major native DEX on Arbitrum. SyncSwap dominates zkSync. Don't default to Uniswap on every chain.

## L2 Comparison Table (Feb 2026)

| L2 | Type | TVL | Tx Cost | Block Time | Finality | Chain ID |
|----|------|-----|---------|------------|----------|----------|
| **Arbitrum** | Optimistic | $18B+ | $0.001-0.003 | 250ms | 7 days | 42161 |
| **Base** | Optimistic (OP Stack) | $12B+ | $0.0008-0.002 | 2s | 7 days | 8453 |
| **Optimism** | Optimistic (OP Stack) | $8B+ | $0.001-0.003 | 2s | 7 days | 10 |
| **Unichain** | Optimistic (OP Stack) | Growing | $0.001-0.003 | 1s | 7 days | 130 |
| **Celo** | Optimistic (OP Stack) | $200M+ | <$0.001 | 5s | 7 days | 42220 |
| **Linea** | ZK | $900M+ | $0.003-0.006 | 2s | 30-60min | 59144 |
| **zkSync Era** | ZK | $800M+ | $0.003-0.008 | 1s | 15-60min | 324 |
| **Scroll** | ZK | $250M+ | $0.002-0.005 | 3s | 30-120min | 534352 |
| ~~Polygon zkEVM~~ | ~~ZK~~ | — | — | — | — | ~~1101~~ |

⚠️ **Polygon zkEVM is being discontinued (announced June 2025).** Do not start new projects there. Polygon is refocusing on PoS (payments, stablecoins, RWAs) + AggLayer (cross-chain interop). MATIC → POL token migration ~85% complete.

**Mainnet for comparison:** $50B+ TVL, $0.002-0.01, 8s blocks, instant finality.

## Cost Comparison (Real Examples, Feb 2026)

| Action | Mainnet | Arbitrum | Base | zkSync | Scroll |
|--------|---------|----------|------|--------|--------|
| ETH transfer | $0.002 | $0.0003 | $0.0003 | $0.0005 | $0.0004 |
| Uniswap swap | $0.015 | $0.003 | $0.002 | $0.005 | $0.004 |
| NFT mint | $0.015 | $0.002 | $0.002 | $0.004 | $0.003 |
| ERC-20 deploy | $0.118 | $0.020 | $0.018 | $0.040 | $0.030 |

## L2 Selection Guide

| Need | Choose | Why |
|------|--------|-----|
| Consumer / social apps | **Base** | Farcaster, Smart Wallet, Coinbase on-ramp, OnchainKit |
| Deepest DeFi liquidity | **Arbitrum** | $18B TVL, GMX, Pendle, Camelot, most protocols |
| Yield strategies | **Arbitrum** | Pendle (yield tokenization), GMX, Aave |
| Cheapest gas | **Base** | ~50% cheaper than Arbitrum/Optimism |
| Coinbase users | **Base** | Direct on-ramp, free Coinbase→Base transfers |
| No 7-day withdrawal wait | **ZK rollup** (zkSync, Scroll, Linea) | 15-120 min finality |
| AI agents | **Base** | ERC-8004, x402, consumer ecosystem, AgentKit |
| Gasless UX (native AA) | **zkSync Era** | Native account abstraction, paymasters, no bundlers needed |
| Multi-chain deployment | **Base or Optimism** | Superchain / OP Stack, shared infra |
| Maximum EVM compatibility | **Scroll or Arbitrum** | Bytecode-identical |
| Mobile / real-world payments | **Celo** | MiniPay, sub-cent fees, Africa/LatAm focus |
| MEV protection | **Unichain** | TEE-based priority ordering, private mempool |
| Rust smart contracts | **Arbitrum** | Stylus (WASM VM alongside EVM, 10-100x gas savings) |
| Stablecoins / payments / RWA | **Polygon PoS** | $500M+ monthly payment volume, 410M+ wallets |

## Key Chain Details (What LLMs Get Wrong)

### Unichain
- **Launched:** February 10, 2025 (mainnet). Chain ID 130.
- **Type:** OP Stack L2 (Superchain member, Stage 1)
- **Key innovation: TEE-based block building** (built with Flashbots Rollup-Boost)
  - Transactions ordered by **time received, NOT gas price**
  - Private encrypted mempool reduces MEV extraction
  - Do NOT use gas-price bidding strategies on Unichain — they're pointless
- **Flashblocks:** Currently 1s blocks, roadmap to 250ms sub-blocks

### Celo
- **Was:** Independent L1 blockchain (2020-2025)
- **Now:** OP Stack L2 on Ethereum — **migrated March 26, 2025** (block 31056500)
- **Focus:** Mobile-first payments, emerging markets
- **MiniPay:** Stablecoin wallet in Opera Mini + standalone app. Phone-to-phone transfers, sub-cent fees. Primary market: Africa (Kenya, Nigeria).
- **Multi-currency stablecoins:** cUSD (`0x765de816845861e75a25fca122bb6898b8b1282a`), cEUR (`0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73`), cREAL (`0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787`)

### Dominant DEX Per Chain
| Chain | Dominant DEX | Model | Why NOT Uniswap |
|-------|-------------|-------|-----------------|
| Base | Aerodrome | ve(3,3) — LPs earn emissions, voters earn fees | Deeper liquidity for most pairs |
| Optimism | Velodrome | ve(3,3) — same team as Aerodrome | Same flywheel model |
| Arbitrum | Camelot + GMX | Native DEX + perps | Camelot for spot, GMX for perps |
| zkSync | SyncSwap | Classic AMM | Largest native DEX on zkSync |

See `addresses/SKILL.md` for verified contract addresses for all these protocols.

## The Superchain (OP Stack)

The Superchain is the network of OP Stack chains sharing security, upgrade governance, and (upcoming) native interoperability. Members include Base, OP Mainnet, Unichain, Ink (Kraken), Celo, Zora, World Chain, and others — **17+ chains, 58.6% L2 market share.**

Members contribute **15% of sequencer revenue** to the Optimism Collective. Cross-chain interop is designed but not yet fully live.

## Deployment Differences (Gotchas)

### Optimistic Rollups (Arbitrum, Optimism, Base, Unichain, Celo)
✅ Deploy like mainnet — just change RPC URL and chain ID. No code changes.

**Gotchas:**
- Don't use `block.number` for time-based logic (increments at different rates). Use `block.timestamp`.
- Arbitrum's `block.number` returns L1 block number, not L2.
- **Unichain:** Transactions are priority-ordered by time, not gas. Don't waste gas on priority fees.

### ZK Rollups
- **zkSync Era:** Must use `zksolc` compiler. No `EXTCODECOPY` (compile-time error). 65K instruction limit. Non-inlinable libraries must be pre-deployed. Native account abstraction (all accounts are smart contracts).
- **Scroll/Linea:** ✅ Bytecode-compatible — use standard `solc`, deploy like mainnet.

### Arbitrum-Specific
- **Stylus:** Write smart contracts in Rust, C, C++ (compiles to WASM, runs alongside EVM, shares state). Use for compute-heavy operations (10-100x gas savings). Contracts must be "activated" via `ARB_WASM_ADDRESS` (0x0000…0071).
- **Orbit:** Framework for launching L3 chains on Arbitrum. 47 live on mainnet.

## RPCs and Explorers

| L2 | RPC | Explorer |
|----|-----|----------|
| Arbitrum | `https://arb1.arbitrum.io/rpc` | https://arbiscan.io |
| Base | `https://mainnet.base.org` | https://basescan.org |
| Optimism | `https://mainnet.optimism.io` | https://optimistic.etherscan.io |
| Unichain | `https://mainnet.unichain.org` | https://uniscan.xyz |
| Celo | `https://forno.celo.org` | https://celoscan.io |
| zkSync | `https://mainnet.era.zksync.io` | https://explorer.zksync.io |
| Scroll | `https://rpc.scroll.io` | https://scrollscan.com |
| Linea | `https://rpc.linea.build` | https://lineascan.build |

## Bridging

### Official Bridges

| L2 | Bridge URL | L1→L2 | L2→L1 |
|----|-----------|--------|--------|
| Arbitrum | https://bridge.arbitrum.io | ~10-15 min | ~7 days |
| Base | https://bridge.base.org | ~10-15 min | ~7 days |
| Optimism | https://app.optimism.io/bridge | ~10-15 min | ~7 days |
| Unichain | https://app.uniswap.org/swap | ~10-15 min | ~7 days |
| zkSync | https://bridge.zksync.io | ~15-30 min | ~15-60 min |
| Scroll | https://scroll.io/bridge | ~15-30 min | ~30-120 min |

### Fast Bridges (Instant Withdrawals)

- **Across Protocol** (https://across.to) — fastest (30s-2min), lowest fees (0.05-0.3%)
- **Hop Protocol** (https://hop.exchange) — established, 0.1-0.5% fees
- **Stargate** (https://stargate.finance) — LayerZero-based, 10+ chains

**Security:** Use official bridges for large amounts (>$100K). Fast bridges add trust assumptions.

## Multi-Chain Deployment (Same Address)

Use CREATE2 for deterministic addresses across chains:

```bash
# Same salt + same bytecode + same deployer = same address on every chain
forge create src/MyContract.sol:MyContract \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --salt 0x0000000000000000000000000000000000000000000000000000000000000001
```

**Strategy for new projects:** Start with 1 L2 (Base or Arbitrum). Prove product-market fit. Expand with CREATE2 for consistent addresses.

## Testnets

| L2 | Testnet | Chain ID | Faucet |
|----|---------|----------|--------|
| Arbitrum | Sepolia | 421614 | https://faucet.arbitrum.io |
| Base | Sepolia | 84532 | https://faucet.quicknode.com/base/sepolia |
| Optimism | Sepolia | 11155420 | https://faucet.optimism.io |
| Unichain | Sepolia | 1301 | https://faucet.unichain.org |

## Further Reading

- **L2Beat:** https://l2beat.com (security, TVL, risk analysis)
- **Superchain:** https://www.superchain.eco/chains
- **Arbitrum:** https://docs.arbitrum.io
- **Base:** https://docs.base.org
- **Optimism:** https://docs.optimism.io
- **Unichain:** https://docs.unichain.org
- **Celo:** https://docs.celo.org
- **zkSync:** https://docs.zksync.io
- **Scroll:** https://docs.scroll.io
- **Polygon:** https://docs.polygon.technology

---

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

---

---
name: tools
description: Current Ethereum development tools, frameworks, libraries, RPCs, and block explorers. What actually works today for building on Ethereum. Includes tool discovery for AI agents — MCPs, abi.ninja, Foundry, Scaffold-ETH 2, Hardhat, and more. Use when setting up a dev environment, choosing tools, or when an agent needs to discover what's available.
---

# Ethereum Development Tools

## What You Probably Got Wrong

**Blockscout MCP server exists:** https://mcp.blockscout.com/mcp — gives AI agents structured blockchain data via Model Context Protocol. This is cutting-edge infra as of Feb 2026.

**abi.ninja is essential:** https://abi.ninja — paste any verified contract address, get a UI to call any function. Zero setup. Supports mainnet + all major L2s. Perfect for agent-driven contract exploration.

**x402 has production SDKs:** `@x402/fetch` (TS), `x402` (Python), `github.com/coinbase/x402/go` — production-ready libraries for HTTP payments.

**Foundry is the default for new projects in 2026.** Not Hardhat. 10-100x faster tests, Solidity-native testing, built-in fuzzing.

## Tool Discovery Pattern for AI Agents

When an agent needs to interact with Ethereum:

1. **Read operations:** Blockscout MCP or Etherscan API
2. **Write operations:** Foundry `cast send` or ethers.js/viem
3. **Contract exploration:** abi.ninja (browser) or `cast interface` (CLI)
4. **Testing:** Fork mainnet with `anvil`, test locally
5. **Deployment:** `forge create` or `forge script`
6. **Verification:** `forge verify-contract` or Etherscan API

## Blockscout MCP Server

**URL:** https://mcp.blockscout.com/mcp

A Model Context Protocol server giving AI agents structured blockchain data:
- Transaction, address, contract queries
- Token info and balances
- Smart contract interaction helpers
- Multi-chain support
- Standardized interface optimized for LLM consumption

**Why this matters:** Instead of scraping Etherscan or making raw API calls, agents get structured, type-safe blockchain data via MCP.

## abi.ninja

**URL:** https://abi.ninja — Paste any contract address → interact with all functions. Multi-chain. Zero setup.

## x402 SDKs (HTTP Payments)

**TypeScript:**
```bash
npm install @x402/core @x402/evm @x402/fetch @x402/express
```

```typescript
import { x402Fetch } from '@x402/fetch';
import { createWallet } from '@x402/evm';

const wallet = createWallet(privateKey);
const response = await x402Fetch('https://api.example.com/data', {
  wallet,
  preferredNetwork: 'eip155:8453' // Base
});
```

**Python:** `pip install x402`
**Go:** `go get github.com/coinbase/x402/go`
**Docs:** https://www.x402.org | https://github.com/coinbase/x402

## Scaffold-ETH 2

- **Setup:** `npx create-eth@latest`
- **What:** Full-stack Ethereum toolkit: Solidity + Next.js + Foundry
- **Key feature:** Auto-generates TypeScript types from contracts. Scaffold hooks make contract interaction trivial.
- **Deploy to IPFS:** `yarn ipfs` (BuidlGuidl IPFS)
- **UI Components:** https://ui.scaffoldeth.io/
- **Docs:** https://docs.scaffoldeth.io/

## Choosing Your Stack (2026)

| Need | Tool |
|------|------|
| Rapid prototyping / full dApps | **Scaffold-ETH 2** |
| Contract-focused dev | **Foundry** (forge + cast + anvil) |
| Quick contract interaction | **abi.ninja** (browser) or **cast** (CLI) |
| React frontends | **wagmi + viem** (or SE2 which wraps these) |
| Agent blockchain reads | **Blockscout MCP** |
| Agent payments | **x402 SDKs** |

## Essential Foundry cast Commands

```bash
# Read contract
cast call 0xAddr "balanceOf(address)(uint256)" 0xWallet --rpc-url $RPC

# Send transaction
cast send 0xAddr "transfer(address,uint256)" 0xTo 1000000 --private-key $KEY --rpc-url $RPC

# Gas price
cast gas-price --rpc-url $RPC

# Decode calldata
cast 4byte-decode 0xa9059cbb...

# ENS resolution
cast resolve-name vitalik.eth --rpc-url $RPC

# Fork mainnet locally
anvil --fork-url $RPC
```

## RPC Providers

**Free (testing):**
- `https://eth.llamarpc.com` — LlamaNodes, no key
- `https://rpc.ankr.com/eth` — Ankr, free tier

**Paid (production):**
- **Alchemy** — most popular, generous free tier (300M CU/month)
- **Infura** — established, MetaMask default
- **QuickNode** — performance-focused

**Community:** `rpc.buidlguidl.com`

## Block Explorers

| Network | Explorer | API |
|---------|----------|-----|
| Mainnet | https://etherscan.io | https://api.etherscan.io |
| Arbitrum | https://arbiscan.io | Etherscan-compatible |
| Base | https://basescan.org | Etherscan-compatible |
| Optimism | https://optimistic.etherscan.io | Etherscan-compatible |

## MCP Servers for Agents

**Model Context Protocol** — standard for giving AI agents structured access to external systems.

1. **Blockscout MCP** — multi-chain blockchain data (primary)
2. **eth-mcp** — community Ethereum RPC via MCP
3. **Custom MCP wrappers** emerging for DeFi protocols, ENS, wallets

MCP servers are composable — agents can use multiple together.

## What Changed in 2025-2026

- **Foundry became default** over Hardhat for new projects
- **Viem gaining on ethers.js** (smaller, better TypeScript)
- **MCP servers emerged** for agent-blockchain interaction
- **x402 SDKs** went production-ready
- **ERC-8004 tooling** emerging (agent registration/discovery)
- **Deprecated:** Truffle (use Foundry/Hardhat), Goerli/Rinkeby (use Sepolia)

## Testing Essentials

**Fork mainnet locally:**
```bash
anvil --fork-url https://eth.llamarpc.com
# Now test against real contracts with fake ETH at http://localhost:8545
```

**Primary testnet:** Sepolia (Chain ID: 11155111). Goerli and Rinkeby are deprecated.

---

---
name: building-blocks
description: DeFi legos and protocol composability on Ethereum and L2s. Major protocols per chain — Aerodrome on Base, GMX/Pendle on Arbitrum, Velodrome on Optimism — plus mainnet primitives (Uniswap, Aave, Compound, Curve). How they work, how to build on them, and how to combine them. Use when building DeFi integrations, choosing protocols on a specific L2, designing yield strategies, or composing existing protocols into something new.
---

# Building Blocks (DeFi Legos)

## What You Probably Got Wrong

**DeFi TVL:** Ethereum DeFi TVL is **$50B+** (Feb 2026). If you're quoting numbers from 2023-2024, they're stale.

**Uniswap V4:** V4 introduced a **hooks system** — custom logic attached to pools (dynamic fees, TWAMM, limit orders, custom oracles). This is a major composability upgrade.
<!-- VERIFICATION NEEDED: V4 deployment status and mainnet addresses -->

**Costs changed everything:** A flash loan arbitrage on mainnet costs ~$0.05-0.50 in gas now (was $5-50). This opens composability patterns that were previously uneconomical.

**The dominant DEX on each L2 is NOT Uniswap.** Aerodrome dominates Base, Velodrome dominates Optimism, Camelot is a major native DEX on Arbitrum. Don't default to Uniswap on every chain.

## Key Protocol Addresses (Verified Feb 2026)

| Protocol | Contract | Mainnet Address |
|----------|----------|-----------------|
| Uniswap V2 Router | Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| Uniswap V2 Factory | Factory | `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f` |
| Uniswap V3 Factory | Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Uniswap V3 SwapRouter02 | Router | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` |
| Uniswap Universal Router | Router | `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD` |
| Aave V3 Pool | Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` |

See `addresses/SKILL.md` for complete multi-chain address list including L2-native protocols (Aerodrome, GMX, Pendle, Velodrome, Camelot, SyncSwap, Morpho).

## Uniswap V4 Hooks (New)

Hooks let you add custom logic that runs before/after swaps, liquidity changes, and donations. This is the biggest composability upgrade since flash loans.

### Hook Interface (Solidity)

```solidity
import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/types/BeforeSwapDelta.sol";

contract DynamicFeeHook is BaseHook {
    constructor(IPoolManager _manager) BaseHook(_manager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,           // ← We hook here
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    // Dynamic fee: higher fee during high-volume periods
    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        // Return dynamic fee override (e.g., 0.05% normally, 0.30% during volatility)
        uint24 fee = _isHighVolatility() ? 3000 : 500;
        return (this.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, fee | 0x800000);
    }
}
```

**Hook use cases with real code patterns:**
- **Dynamic fees** — adjust based on volatility, time-of-day, or oracle data
- **TWAMM** — split large orders over time to reduce price impact
- **Limit orders** — execute when price crosses a threshold
- **MEV protection** — auction swap ordering rights to searchers
- **Custom oracles** — TWAP updated on every swap

## Composability Patterns (Updated for 2026 Gas)

These patterns are now **economically viable** even for small amounts due to sub-dollar gas:

### Flash Loan Arbitrage
Borrow from Aave → swap on Uniswap for profit → repay Aave. All in one transaction. If unprofitable, reverts (lose only gas: ~$0.05-0.50).

### Leveraged Yield Farming
Deposit ETH on Aave → borrow stablecoin → swap for more ETH → deposit again → repeat. Gas cost per loop: ~$0.02 on mainnet, negligible on L2.

### Meta-Aggregation
Route swaps across multiple DEXs for best execution. 1inch and Paraswap check Uniswap, Curve, Sushi simultaneously.

### ERC-4626 Yield Vaults

Standard vault interface — the "ERC-20 of yield." Every vault exposes the same functions regardless of strategy.

```solidity
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleYieldVault is ERC4626 {
    constructor(IERC20 asset_) 
        ERC4626(asset_) 
        ERC20("Vault Shares", "vSHARE") 
    {}

    // totalAssets() drives the share price
    // As yield accrues, totalAssets grows → shares worth more
    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) + _getAccruedYield();
    }
}

// Usage: deposit/withdraw are standardized
// vault.deposit(1000e6, msg.sender);  // deposit 1000 USDC, get shares
// vault.redeem(shares, msg.sender, msg.sender);  // burn shares, get USDC back
// vault.convertToAssets(shares);  // how much USDC are my shares worth?
```

**Why ERC-4626 matters:** Composability. Any protocol can integrate any vault without custom adapters. Yearn V3, Aave's wrapped tokens, Morpho vaults, Pendle yield tokens — all ERC-4626.

### Flash Loan (Aave V3 — Complete Pattern)

```solidity
import {FlashLoanSimpleReceiverBase} from 
    "@aave/v3-core/contracts/flashloan-v3/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from 
    "@aave/v3-core/contracts/interfaces/IPoolAddressesProvider.sol";

contract FlashLoanArb is FlashLoanSimpleReceiverBase {
    constructor(IPoolAddressesProvider provider) 
        FlashLoanSimpleReceiverBase(provider) {}

    function executeArb(address token, uint256 amount) external {
        // Borrow `amount` of `token` — must repay + 0.05% fee in same tx
        POOL.flashLoanSimple(address(this), token, amount, "", 0);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,  // 0.05% fee
        address,
        bytes calldata
    ) external override returns (bool) {
        // --- Your arbitrage logic here ---
        // Buy cheap on DEX A, sell expensive on DEX B
        // Must end with at least `amount + premium` of `asset`
        
        uint256 owed = amount + premium;
        IERC20(asset).approve(address(POOL), owed);
        return true;  // If unprofitable, revert here — lose only gas (~$0.05-0.50)
    }
}
```

**Aave V3 Pool (mainnet):** `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2`
**Flash loan fee:** 0.05% (5 basis points). Free if you repay to an Aave debt position.

## Building on Base

**Dominant DEX: Aerodrome** (~$500-600M TVL) — NOT Uniswap. Uses the ve(3,3) model.

### How Aerodrome Works (Critical Difference from Uniswap)
- **LPs deposit tokens** into pools → earn **AERO emissions** (not trading fees!)
- **veAERO voters** lock AERO → vote on which pools get emissions → earn **100% of trading fees + bribes**
- This is the opposite of Uniswap where LPs earn fees directly
- **Flywheel:** Pools generating most fees → attract most votes → get most emissions → attract more LPs → deeper liquidity → more fees

### Aerodrome Swap (Router Interface)
```solidity
// Aerodrome Router: 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43 (Base)
struct Route {
    address from;
    address to;
    bool stable;       // true = stable pair (like Curve), false = volatile (like Uni V2)
    address factory;   // 0x420DD381b31aEf6683db6B902084cB0FFECe40Da
}

// Swap via Router
function swapExactTokensForTokens(
    uint256 amountIn,
    uint256 amountOutMin,
    Route[] calldata routes,
    address to,
    uint256 deadline
) external returns (uint256[] memory amounts);
```

### Base-Specific Patterns
- **Coinbase Smart Wallet** — ERC-4337 wallet, passkey auth, gasless txs via Coinbase paymaster
- **OnchainKit** — `npm create onchain` to bootstrap a Base app with React components
- **Farcaster Frames v2** — mini-apps embedded in social posts that trigger onchain actions
- **AgentKit** — Coinbase's framework for AI agents to interact onchain

## Building on Arbitrum (Highest DeFi Liquidity)

### GMX V2 — How GM Pools Work
- **Each market has its own isolated pool** (unlike V1's single GLP pool)
- LPs deposit into GM (liquidity) pools → receive GM tokens
- **Fully Backed markets:** ETH/USD backed by ETH + USDC. Backing tokens match the traded asset.
- **Synthetic markets:** DOGE/USD backed by ETH + USDC. Uses ADL (Auto-Deleveraging) when thresholds are reached.
- LPs earn: trading fees, liquidation fees, borrowing fees, swap fees. But bear risk from trader PnL.

### Pendle — Yield Tokenization
Pendle splits yield-bearing assets into principal and yield components:

1. **SY (Standardized Yield):** Wraps any yield-bearing asset. E.g., wstETH → SY-wstETH.
2. **PT (Principal Token):** The principal. Redeemable 1:1 at maturity. Trades at a discount (discount = implied yield).
3. **YT (Yield Token):** All yield until maturity. Value decays to 0 at maturity.
4. **Core invariant:** `SY_value = PT_value + YT_value`

**Use cases:**
- Buy PT at discount = **lock in fixed yield** (like a zero-coupon bond)
- Buy YT = **leverage your yield exposure** (bet yield goes up)
- LP in Pendle pools = earn trading fees + PENDLE incentives

### Arbitrum-Specific Tech
- **Stylus:** Write smart contracts in Rust/C++/WASM alongside EVM (10-100x gas savings for compute-heavy operations)
- **Orbit:** Launch custom L3 chains (47 live on mainnet)

See `addresses/SKILL.md` for all verified protocol addresses (GMX, Pendle, Camelot, Aerodrome, Velodrome, SyncSwap, Morpho).

## Discovery Resources

- **DeFi Llama:** https://defillama.com — TVL rankings, yield rankings, all chains
- **Dune Analytics:** https://dune.com — query onchain data
- **ethereum.org/en/dapps/** — curated list

## Guardrails for Composability

- **Every protocol you compose with is a dependency.** If Aave gets hacked, your vault depending on Aave is affected.
- **Oracle manipulation = exploits.** Verify oracle sources.
- **Impermanent loss** is real for AMM LPs. Quantify it before providing liquidity.
- **The interaction between two safe contracts can create unsafe behavior.** Audit compositions.
- **Start with small amounts.** Test with minimal value before scaling.
- **Flash loan attacks** can manipulate prices within a single transaction. Design for this.

---

---
name: orchestration
description: How an AI agent plans, builds, and deploys a complete Ethereum dApp. The three-phase build system for Scaffold-ETH 2 projects. Use when building a full application on Ethereum — from contracts to frontend to production deployment on IPFS.
---

# dApp Orchestration

## What You Probably Got Wrong

**SE2 has specific patterns you must follow.** Generic "build a dApp" advice won't work. SE2 auto-generates `deployedContracts.ts` — DON'T edit it. Use Scaffold hooks, NOT raw wagmi. External contracts go in `externalContracts.ts` BEFORE building the frontend.

**There are three phases. Never skip or combine them.** Contracts → Frontend → Production. Each has validation gates.

## The Three-Phase Build System

| Phase | Environment | What Happens |
|-------|-------------|-------------|
| **Phase 1** | Local fork | Contracts + UI on localhost. Iterate fast. |
| **Phase 2** | Live network + local UI | Deploy contracts to mainnet/L2. Test with real state. Polish UI. |
| **Phase 3** | Production | Deploy frontend to IPFS/Vercel. Final QA. |

## Phase 1: Scaffold (Local)

### 1.1 Contracts

```bash
npx create-eth@latest my-dapp
cd my-dapp && yarn install
yarn chain          # Terminal 1: local node
yarn deploy         # Terminal 2: deploy contracts
```

**Critical steps:**
1. Write contracts in `packages/foundry/contracts/` (or `packages/hardhat/contracts/`)
2. Write deploy script
3. Add ALL external contracts to `packages/nextjs/contracts/externalContracts.ts` — BEFORE Phase 1.2
4. Write tests (≥90% coverage)
5. Security audit before moving to frontend

**Validate:** `yarn deploy` succeeds. `deployedContracts.ts` auto-generated. Tests pass.

### 1.2 Frontend

```bash
yarn chain           # Terminal 1
yarn deploy --watch  # Terminal 2: auto-redeploy on changes
yarn start           # Terminal 3: Next.js at localhost:3000
```

**USE SCAFFOLD HOOKS, NOT RAW WAGMI:**

```typescript
// Read
const { data } = useScaffoldReadContract({
  contractName: "YourContract",
  functionName: "balanceOf",
  args: [address],
  watch: true,
});

// Write
const { writeContractAsync, isMining } = useScaffoldWriteContract("YourContract");
await writeContractAsync({
  functionName: "swap",
  args: [tokenIn, tokenOut, amount],
  onBlockConfirmation: (receipt) => console.log("Done!", receipt),
});

// Events
const { data: events } = useScaffoldEventHistory({
  contractName: "YourContract",
  eventName: "SwapExecuted",
  fromBlock: 0n,
  watch: true,
});
```

### The Three-Button Flow (MANDATORY)

Any token interaction shows ONE button at a time:
1. **Switch Network** (if wrong chain)
2. **Approve Token** (if allowance insufficient)
3. **Execute Action** (only after 1 & 2 satisfied)

Never show Approve and Execute simultaneously.

### UX Rules

- **Human-readable amounts:** `formatEther()` / `formatUnits()` for display, `parseEther()` / `parseUnits()` for contracts
- **Loading states everywhere:** `isLoading`, `isMining` on all async operations
- **Disable buttons during pending txs** (blockchains take 5-12s)
- **Never use infinite approvals** — approve exact amount or 3-5x
- **Helpful errors:** Parse "insufficient funds," "user rejected," "execution reverted" into plain language

**Validate:** Full user journey works with real wallet on localhost. All edge cases handled.

## 🚨 NEVER COMMIT SECRETS TO GIT

**Before touching Phase 2, read this.** AI agents are the #1 source of leaked credentials on GitHub. Bots scrape repos in real-time and exploit leaked secrets within seconds.

**This means ALL secrets — not just wallet private keys:**
- **Wallet private keys** — funds drained in seconds
- **API keys** — Alchemy, Infura, Etherscan, WalletConnect project IDs
- **RPC URLs with embedded keys** — e.g. `https://base-mainnet.g.alchemy.com/v2/YOUR_KEY`
- **OAuth tokens, passwords, bearer tokens**

**⚠️ Common SE2 Trap: `scaffold.config.ts`**

`rpcOverrides` and `alchemyApiKey` in `scaffold.config.ts` are committed to Git. **NEVER paste API keys directly into this file.** Use environment variables:

```typescript
// ❌ WRONG — key committed to public repo
rpcOverrides: {
  [chains.base.id]: "https://base-mainnet.g.alchemy.com/v2/8GVG8WjDs-LEAKED",
},

// ✅ RIGHT — key stays in .env.local
rpcOverrides: {
  [chains.base.id]: process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org",
},
```

**Before every `git add` or `git commit`:**
```bash
# Check for leaked secrets
git diff --cached --name-only | grep -iE '\.env|key|secret|private'
grep -rn "0x[a-fA-F0-9]\{64\}" packages/ --include="*.ts" --include="*.js" --include="*.sol"
# Check for hardcoded API keys in config files
grep -rn "g.alchemy.com/v2/[A-Za-z0-9]" packages/ --include="*.ts" --include="*.js"
grep -rn "infura.io/v3/[A-Za-z0-9]" packages/ --include="*.ts" --include="*.js"
# If ANYTHING matches, STOP. Move the secret to .env and add .env to .gitignore.
```

**Your `.gitignore` MUST include:**
```
.env
.env.*
*.key
broadcast/
cache/
node_modules/
```

**SE2 handles deployer keys by default** — `yarn generate` creates a `.env` with the deployer key, and `.gitignore` excludes it. **Don't override this pattern.** Don't copy keys into scripts, config files, or deploy logs. This includes RPC keys, API keys, and any credential — not just wallet keys.

See `wallets/SKILL.md` for full key safety guide, what to do if you've already leaked a key, and safe patterns for deployment.

## Phase 2: Live Contracts + Local UI

1. Update `scaffold.config.ts`: `targetNetworks: [mainnet]` (or your L2)
2. Fund deployer: `yarn generate` → `yarn account` → send real ETH
3. Deploy: `yarn deploy --network mainnet`
4. Verify: `yarn verify --network mainnet`
5. Test with real wallet, small amounts ($1-10)
6. Polish UI — remove SE2 branding, custom styling

**Design rule:** NO LLM SLOP. No generic purple gradients. Make it unique.

**Validate:** Contracts verified on block explorer. Full journey works with real contracts.

## Phase 3: Production Deploy

### Pre-deploy Checklist
- `onlyLocalBurnerWallet: true` in scaffold.config.ts (CRITICAL — prevents burner wallet on prod)
- Update metadata (title, description, OG image 1200x630px)
- Restore any test values to production values

### Deploy

**IPFS (decentralized):**
```bash
yarn ipfs
# → https://YOUR_CID.ipfs.cf-ipfs.com
```

**Vercel (fast):**
```bash
cd packages/nextjs && vercel
```

### Production QA
- [ ] App loads on public URL
- [ ] Wallet connects, network switching works
- [ ] Read + write contract operations work
- [ ] No console errors
- [ ] Burner wallet NOT showing
- [ ] OG image works in link previews
- [ ] Mobile responsive
- [ ] Tested with MetaMask, Rainbow, WalletConnect

## Phase Transition Rules

**Phase 3 bug → go back to Phase 2** (fix with local UI + prod contracts)
**Phase 2 contract bug → go back to Phase 1** (fix locally, write regression test, redeploy)
**Never hack around bugs in production.**

## Key SE2 Directories

```
packages/
├── foundry/contracts/          # Solidity contracts
├── foundry/script/             # Deploy scripts
├── foundry/test/               # Tests
└── nextjs/
    ├── app/                    # Pages
    ├── components/             # React components
    ├── contracts/
    │   ├── deployedContracts.ts   # AUTO-GENERATED (don't edit)
    │   └── externalContracts.ts   # YOUR external contracts (edit this)
    ├── hooks/scaffold-eth/     # USE THESE hooks
    └── scaffold.config.ts      # Main config
```

## AI Agent Commerce: End-to-End Flow (ERC-8004 + x402)

This is the killer use case for Ethereum in 2026: **autonomous agents discovering, trusting, paying, and rating each other** — no humans in the loop.

### The Full Cycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. DISCOVER  Agent queries ERC-8004 IdentityRegistry       │
│               → finds agents with "weather" service tag      │
│                                                              │
│  2. TRUST     Agent checks ReputationRegistry                │
│               → filters by uptime >99%, quality >85          │
│               → picks best-rated weather agent               │
│                                                              │
│  3. CALL      Agent sends HTTP GET to weather endpoint       │
│               → receives 402 Payment Required                │
│               → PAYMENT-REQUIRED header: $0.10 USDC on Base  │
│                                                              │
│  4. PAY       Agent signs EIP-3009 transferWithAuthorization │
│               → retries request with PAYMENT-SIGNATURE       │
│               → server verifies via facilitator              │
│               → payment settled on Base (~$0.001 gas)        │
│                                                              │
│  5. RECEIVE   Server returns 200 OK + weather data           │
│               → PAYMENT-RESPONSE header with tx hash         │
│                                                              │
│  6. RATE      Agent posts feedback to ReputationRegistry     │
│               → value=95, tag="quality", endpoint="..."      │
│               → builds onchain reputation for next caller   │
└─────────────────────────────────────────────────────────────┘
```

### Concrete Implementation (TypeScript Agent)

```typescript
import { x402Fetch } from '@x402/fetch';
import { createWallet } from '@x402/evm';
import { ethers } from 'ethers';

const wallet = createWallet(process.env.AGENT_PRIVATE_KEY);
const provider = new ethers.JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/YOUR_KEY');

const IDENTITY_REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';
const REPUTATION_REGISTRY = '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63';

// 1. Discover: find agents offering weather service
const registry = new ethers.Contract(IDENTITY_REGISTRY, registryAbi, provider);
// Query events or use The Graph subgraph for indexed agent discovery

// 2. Trust: check reputation
const reputation = new ethers.Contract(REPUTATION_REGISTRY, reputationAbi, provider);
const [count, value, decimals] = await reputation.getSummary(
  agentId, trustedClients, "quality", "30days"
);
// Only proceed if value/10^decimals > 85

// 3-5. Pay + Receive: x402Fetch handles the entire 402 flow
const response = await x402Fetch(agentEndpoint, {
  wallet,
  preferredNetwork: 'eip155:8453'
});
const weatherData = await response.json();

// 6. Rate: post feedback onchain
const reputationWriter = new ethers.Contract(REPUTATION_REGISTRY, reputationAbi, signer);
await reputationWriter.giveFeedback(
  agentId, 95, 0, "quality", "weather", agentEndpoint, "", ethers.ZeroHash
);
```

**This is the agentic economy.** No API keys, no subscriptions, no invoicing, no trust assumptions. Just cryptographic identity, onchain reputation, and HTTP-native payments.

### Key Projects Building This Stack
- **ERC-8004** — agent identity + reputation (EF, MetaMask, Google, Coinbase)
- **x402** — HTTP payment protocol (Coinbase)
- **A2A** — agent-to-agent communication (Google)
- **MCP** — model context protocol (Anthropic)
- **The Graph** — indexing agent registrations for fast discovery
- **EigenLayer** — crypto-economic validation of agent work

## Resources

- **SE2 Docs:** https://docs.scaffoldeth.io/
- **UI Components:** https://ui.scaffoldeth.io/
- **SpeedRunEthereum:** https://speedrunethereum.com/
- **ETH Tech Tree:** https://www.ethtechtree.com

---

---
name: addresses
description: Verified contract addresses for major Ethereum protocols across mainnet and L2s. Use this instead of guessing or hallucinating addresses. Includes Uniswap, Aave, Compound, Aerodrome, GMX, Pendle, Velodrome, Camelot, SyncSwap, USDC, USDT, DAI, ENS, Safe, Chainlink, and more. Always verify addresses against a block explorer before sending transactions.
---

# Contract Addresses

> **CRITICAL:** Never hallucinate a contract address. Wrong addresses mean lost funds. If an address isn't listed here, look it up on the block explorer or the protocol's official docs before using it.

**Last Verified:** February 15, 2026 (all addresses verified onchain via `cast code` + `cast call`)

---

## Stablecoins

### USDC (Circle) — Native
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | ✅ Verified |
| Arbitrum | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` | ✅ Verified |
| Optimism | `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85` | ✅ Verified |
| Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | ✅ Verified |
| Polygon | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` | ✅ Verified |
| zkSync Era | `0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4` | ✅ Verified |

### USDT (Tether)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | ✅ Verified |
| Arbitrum | `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9` | ✅ Verified |
| Optimism | `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58` | ✅ Verified |
| Base | `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2` | ✅ Verified |

### DAI (MakerDAO)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x6B175474E89094C44Da98b954EedeAC495271d0F` | ✅ Verified |
| Arbitrum | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` | ✅ Verified |
| Optimism | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` | ✅ Verified |
| Base | `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb` | ✅ Verified |

---

## Wrapped ETH (WETH)

| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | ✅ Verified |
| Arbitrum | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` | ✅ Verified |
| Optimism | `0x4200000000000000000000000000000000000006` | ✅ Verified |
| Base | `0x4200000000000000000000000000000000000006` | ✅ Verified |

---

## DeFi Protocols

### Uniswap

#### V2 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` | ✅ Verified |
| Factory | `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f` | ✅ Verified |

#### V3 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| SwapRouter | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | ✅ Verified |
| SwapRouter02 | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` | ✅ Verified |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | ✅ Verified |
| Quoter V2 | `0x61fFE014bA17989E743c5F6cB21bF9697530B21e` | ✅ Verified |
| Position Manager | `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` | ✅ Verified |

#### V3 Multi-Chain
| Contract | Arbitrum | Optimism | Base |
|----------|----------|----------|------|
| SwapRouter02 | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` ✅ | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` ✅ | `0x2626664c2603336E57B271c5C0b26F421741e481` ✅ |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` ✅ | `0x1F98431c8aD98523631AE4a59f267346ea31F984` ✅ | `0x33128a8fC17869897dcE68Ed026d694621f6FDfD` ✅ |

#### Universal Router (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Universal Router | `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD` | ✅ Verified |

#### UNI Token
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` | ✅ Verified |

### Aave

#### V2 (Mainnet - Legacy)
| Contract | Address | Status |
|----------|---------|--------|
| LendingPool | `0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9` | ✅ Verified |

#### V3 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` | ✅ Verified |
| PoolAddressesProvider | `0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e` | ✅ Verified |

#### V3 Multi-Chain
| Contract | Arbitrum | Optimism | Base |
|----------|----------|----------|------|
| Pool | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` ✅ | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` ✅ | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` ✅ |
| PoolAddressesProvider | `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb` ✅ | `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb` ✅ | `0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D` ✅ |

### Compound

#### V2 (Mainnet - Legacy)
| Contract | Address | Status |
|----------|---------|--------|
| Comptroller | `0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B` | ✅ Verified |
| cETH | `0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5` | ✅ Verified |
| cUSDC | `0x39AA39c021dfbaE8faC545936693aC917d5E7563` | ✅ Verified |
| cDAI | `0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643` | ✅ Verified |

#### V3 Comet (USDC Markets)
| Network | Address | Status |
|---------|---------|--------|
| Mainnet | `0xc3d688B66703497DAA19211EEdff47f25384cdc3` | ✅ Verified |
| Arbitrum | `0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf` | ✅ Verified |
| Base | `0xb125E6687d4313864e53df431d5425969c15Eb2F` | ✅ Verified |
| Optimism | `0x2e44e174f7D53F0212823acC11C01A11d58c5bCB` | ✅ Verified |

### Curve Finance (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Address Provider | `0x0000000022D53366457F9d5E68Ec105046FC4383` | ✅ Verified |
| CRV Token | `0xD533a949740bb3306d119CC777fa900bA034cd52` | ✅ Verified |

### Balancer V2 (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Vault | `0xBA12222222228d8Ba445958a75a0704d566BF2C8` | ✅ Verified |

---

## NFT & Marketplaces

### OpenSea Seaport
| Version | Address | Status |
|---------|---------|--------|
| Seaport 1.1 | `0x00000000006c3852cbEf3e08E8dF289169EdE581` | ✅ Verified |
| Seaport 1.5 | `0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC` | ✅ Verified |

Multi-chain via CREATE2 (Ethereum, Polygon, Arbitrum, Optimism, Base).

### ENS (Mainnet)
| Contract | Address | Status |
|----------|---------|--------|
| Registry | `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e` | ✅ Verified |
| Public Resolver | `0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63` | ✅ Verified |
| Registrar Controller | `0x253553366Da8546fC250F225fe3d25d0C782303b` | ✅ Verified |

---

## Infrastructure

### Safe (Gnosis Safe)
| Contract | Address | Status |
|----------|---------|--------|
| Singleton 1.3.0 | `0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552` | ✅ Verified |
| ProxyFactory | `0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2` | ✅ Verified |
| Singleton 1.4.1 | `0x41675C099F32341bf84BFc5382aF534df5C7461a` | ✅ Verified |
| MultiSend | `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526` | ✅ Verified |

### Account Abstraction (ERC-4337)
| Contract | Address | Status |
|----------|---------|--------|
| EntryPoint v0.7 | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` | ✅ Verified |
| EntryPoint v0.6 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` | ✅ Verified |

All EVM chains (CREATE2).

### Chainlink

#### Mainnet
| Feed | Address | Status |
|------|---------|--------|
| LINK Token | `0x514910771AF9Ca656af840dff83E8264EcF986CA` | ✅ Verified |
| ETH/USD | `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` | ✅ Verified |
| BTC/USD | `0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c` | ✅ Verified |
| USDC/USD | `0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6` | ✅ Verified |

#### ETH/USD Price Feeds (Multi-Chain)
| Network | Address | Status |
|---------|---------|--------|
| Arbitrum | `0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612` | ✅ Verified |
| Base | `0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70` | ✅ Verified |
| Optimism | `0x13e3Ee699D1909E989722E753853AE30b17e08c5` | ✅ Verified |

#### LINK Token (Multi-Chain)
| Network | Address | Status |
|---------|---------|--------|
| Arbitrum | `0xf97f4df75117a78c1A5a0DBb814Af92458539FB4` | ✅ Verified |
| Base | `0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196` | ✅ Verified |

---

## L2-Native Protocols

> **The dominant DEX on each L2 is NOT Uniswap.** Aerodrome dominates Base, Velodrome dominates Optimism, Camelot is a major native DEX on Arbitrum. Don't default to Uniswap — check which DEX has the deepest liquidity on each chain.

### Aerodrome (Base) — Dominant DEX

The largest DEX on Base by TVL (~$500-600M). Uses the ve(3,3) model — **LPs earn AERO emissions, veAERO voters earn 100% of trading fees.** This is the opposite of Uniswap where LPs earn fees directly.

| Contract | Address | Status |
|----------|---------|--------|
| AERO Token | `0x940181a94A35A4569E4529A3CDfB74e38FD98631` | ✅ Verified |
| Router | `0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43` | ✅ Verified |
| Voter | `0x16613524e02ad97eDfeF371bC883F2F5d6C480A5` | ✅ Verified |
| VotingEscrow | `0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4` | ✅ Verified |
| PoolFactory | `0x420DD381b31aEf6683db6B902084cB0FFECe40Da` | ✅ Verified |
| GaugeFactory | `0x35f35cA5B132CaDf2916BaB57639128eAC5bbcb5` | ✅ Verified |
| Minter | `0xeB018363F0a9Af8f91F06FEe6613a751b2A33FE5` | ✅ Verified |
| RewardsDistributor | `0x227f65131A261548b057215bB1D5Ab2997964C7d` | ✅ Verified |
| FactoryRegistry | `0x5C3F18F06CC09CA1910767A34a20F771039E37C0` | ✅ Verified |

Source: [aerodrome-finance/contracts](https://github.com/aerodrome-finance/contracts)

### Velodrome V2 (Optimism) — Dominant DEX

Same ve(3,3) model as Aerodrome — same team (Dromos Labs). Velodrome was built first for Optimism, Aerodrome is the Base fork. Both merged into "Aero" in November 2025.

| Contract | Address | Status |
|----------|---------|--------|
| VELO Token (V2) | `0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db` | ✅ Verified |
| Router | `0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858` | ✅ Verified |
| Voter | `0x41C914ee0c7E1A5edCD0295623e6dC557B5aBf3C` | ✅ Verified |
| VotingEscrow | `0xFAf8FD17D9840595845582fCB047DF13f006787d` | ✅ Verified |
| PoolFactory | `0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a` | ✅ Verified |
| Minter | `0x6dc9E1C04eE59ed3531d73a72256C0da46D10982` | ✅ Verified |
| GaugeFactory | `0x8391fE399640E7228A059f8Fa104b8a7B4835071` | ✅ Verified |
| FactoryRegistry | `0xF4c67CdEAaB8360370F41514d06e32CcD8aA1d7B` | ✅ Verified |

⚠️ **V1 VELO token** (`0x3c8B650257cFb5f272f799F5e2b4e65093a11a05`) is deprecated. Use V2 above.

Source: [velodrome-finance/contracts](https://github.com/velodrome-finance/contracts)

### GMX V2 (Arbitrum) — Perpetual DEX

Leading onchain perpetual exchange. V2 uses isolated GM pools per market (Fully Backed and Synthetic). Competes with Hyperliquid.

| Contract | Address | Status |
|----------|---------|--------|
| GMX Token | `0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a` | ✅ Verified |
| Exchange Router (latest) | `0x1C3fa76e6E1088bCE750f23a5BFcffa1efEF6A41` | ✅ Verified |
| Exchange Router (previous) | `0x7C68C7866A64FA2160F78EeAe12217FFbf871fa8` | ✅ Verified |
| DataStore | `0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8` | ✅ Verified |
| Reader | `0x470fbC46bcC0f16532691Df360A07d8Bf5ee0789` | ✅ Verified |
| Reward Router V2 | `0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1` | ✅ Verified |

**Note:** Both Exchange Router addresses are valid — both point to the same DataStore. The latest (`0x1C3f...`) is from the current gmx-synthetics repo deployment.

Source: [gmx-io/gmx-synthetics](https://github.com/gmx-io/gmx-synthetics)

### Pendle (Arbitrum) — Yield Trading

Tokenizes future yield into PT (Principal Token) and YT (Yield Token). Core invariant: `SY_value = PT_value + YT_value`. Multi-chain (also on Ethereum, Base, Optimism).

| Contract | Address | Status |
|----------|---------|--------|
| PENDLE Token | `0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8` | ✅ Verified |
| Router | `0x888888888889758F76e7103c6CbF23ABbF58F946` | ✅ Verified |
| RouterStatic | `0xAdB09F65bd90d19e3148D9ccb693F3161C6DB3E8` | ✅ Verified |
| Market Factory V3 | `0x2FCb47B58350cD377f94d3821e7373Df60bD9Ced` | ✅ Verified |
| Market Factory V4 | `0xd9f5e9589016da862D2aBcE980A5A5B99A94f3E8` | ✅ Verified |
| PT/YT Oracle | `0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2` | ✅ Verified |
| Limit Router | `0x000000000000c9B3E2C3Ec88B1B4c0cD853f4321` | ✅ Verified |
| Yield Contract Factory V3 | `0xEb38531db128EcA928aea1B1CE9E5609B15ba146` | ✅ Verified |
| Yield Contract Factory V4 | `0xc7F8F9F1DdE1104664b6fC8F33E49b169C12F41E` | ✅ Verified |

Source: [pendle-finance/pendle-core-v2-public](https://github.com/pendle-finance/pendle-core-v2-public/blob/main/deployments/42161-core.json)

### Camelot (Arbitrum) — Native DEX

Arbitrum-native DEX with concentrated liquidity and launchpad. Two AMM versions: V2 (constant product) and V4 (Algebra concentrated liquidity).

| Contract | Address | Status |
|----------|---------|--------|
| GRAIL Token | `0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8` | ✅ Verified |
| xGRAIL | `0x3CAaE25Ee616f2C8E13C74dA0813402eae3F496b` | ✅ Verified |
| Router (AMM V2) | `0xc873fEcbd354f5A56E00E710B90EF4201db2448d` | ✅ Verified |
| Factory (AMM V2) | `0x6EcCab422D763aC031210895C81787E87B43A652` | ✅ Verified |
| SwapRouter (AMM V4 / Algebra) | `0x4ee15342d6Deb297c3A2aA7CFFd451f788675F53` | ✅ Verified |
| AlgebraFactory (AMM V4) | `0xBefC4b405041c5833f53412fF997ed2f697a2f37` | ✅ Verified |

Source: [docs.camelot.exchange](https://docs.camelot.exchange/contracts/arbitrum/one-mainnet)

### SyncSwap (zkSync Era) — Dominant DEX

The leading native DEX on zkSync Era. Multiple router and factory versions.

| Contract | Address | Status |
|----------|---------|--------|
| Router V1 | `0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295` | ✅ Verified |
| Router V2 | `0x9B5def958d0f3b6955cBEa4D5B7809b2fb26b059` | ✅ Verified |
| Router V3 | `0x1B887a14216Bdeb7F8204Ee6a269Bd9Ff73A084C` | ✅ Verified |
| Classic Pool Factory V1 | `0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb` | ✅ Verified |
| Classic Pool Factory V2 | `0x0a34FBDf37C246C0B401da5f00ABd6529d906193` | ✅ Verified |
| Stable Pool Factory V1 | `0x5b9f21d407F35b10CbfDDca17D5D84b129356ea3` | ✅ Verified |
| Vault V1 | `0x621425a1Ef6abE91058E9712575dcc4258F8d091` | ✅ Verified |

**Note:** SYNC token is not yet deployed.

Source: [docs.syncswap.xyz](https://docs.syncswap.xyz/syncswap/smart-contracts/smart-contracts)

### Morpho Blue (Base)

Permissionless lending protocol. Deployed on Base and Ethereum, but **NOT on Arbitrum** as of February 2026 (despite the vanity CREATE2 address).

| Contract | Address | Chain | Status |
|----------|---------|-------|--------|
| Morpho | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | Base | ✅ Verified |
| Morpho | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | Arbitrum | ❌ Not deployed |

Source: [docs.morpho.org](https://docs.morpho.org/get-started/resources/addresses/)

---

## AI & Agent Standards

### ERC-8004 (Same addresses on 20+ chains)
| Contract | Address | Status |
|----------|---------|--------|
| IdentityRegistry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | ✅ Verified |
| ReputationRegistry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` | ✅ Verified |

Verified on: Mainnet, Arbitrum, Base, Optimism (CREATE2 — same address on all chains).

---

## Major Tokens (Mainnet)

| Token | Address | Status |
|-------|---------|--------|
| UNI | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` | ✅ Verified |
| AAVE | `0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9` | ✅ Verified |
| COMP | `0xc00e94Cb662C3520282E6f5717214004A7f26888` | ✅ Verified |
| MKR | `0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2` | ✅ Verified |
| LDO | `0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32` | ✅ Verified |
| WBTC | `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599` | ✅ Verified |
| stETH (Lido) | `0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84` | ✅ Verified |
| rETH (Rocket Pool) | `0xae78736Cd615f374D3085123A210448E74Fc6393` | ✅ Verified |

---

## How to Verify Addresses

```bash
# Check bytecode exists
cast code 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 --rpc-url https://eth.llamarpc.com
```

**Cross-reference:** Protocol docs → CoinGecko → block explorer → GitHub deployments.

**EIP-55 Checksum:** Mixed case = checksum. Most tools validate automatically.

## Address Discovery Resources

- **Uniswap:** https://docs.uniswap.org/contracts/v3/reference/deployments/
- **Aave:** https://docs.aave.com/developers/deployed-contracts/deployed-contracts
- **Compound V3:** https://docs.compound.finance/
- **Chainlink:** https://docs.chain.link/data-feeds/price-feeds/addresses
- **Aerodrome:** https://github.com/aerodrome-finance/contracts
- **Velodrome:** https://github.com/velodrome-finance/contracts
- **GMX:** https://github.com/gmx-io/gmx-synthetics
- **Pendle:** https://github.com/pendle-finance/pendle-core-v2-public
- **Camelot:** https://docs.camelot.exchange/contracts/arbitrum/one-mainnet
- **SyncSwap:** https://docs.syncswap.xyz/syncswap/smart-contracts/smart-contracts
- **Morpho:** https://docs.morpho.org/get-started/resources/addresses/
- **CoinGecko:** https://www.coingecko.com (token addresses)
- **Token Lists:** https://tokenlists.org/
- **DeFi Llama:** https://defillama.com (TVL rankings by chain)

## Multi-Chain Notes

- **CREATE2 deployments** (same address cross-chain): Uniswap V3, Safe, Seaport, ERC-4337 EntryPoint, ERC-8004
- **Different addresses per chain:** USDC, USDT, DAI, WETH — always check per-chain
- **Native vs Bridged USDC:** Some chains have both! Use native.

---

✅ **All addresses verified onchain via `cast code` + `cast call` — February 15, 2026. Bytecode confirmed present, identity confirmed via symbol/name/cross-reference calls. Does NOT guarantee safety — always verify on block explorer before sending transactions.**

---

---
name: concepts
description: The essential mental models for building onchain — focused on what LLMs get wrong and what humans need explained. "Nothing is automatic" and "incentives are everything" are the core messages. Use when your human is new to onchain development, when they're designing a system, or when they ask "how does this actually work?" Also use when YOU are designing a system — the state machine + incentive framework catches design mistakes before they become dead code.
---

# Ethereum Concepts

## What You Probably Got Wrong

**"Smart contracts run automatically."** No. Smart contracts cannot execute themselves. There is no cron job, no scheduler, no background process. Every function needs a caller who pays gas. This single misconception is the root cause of most broken onchain designs.

**"Just add a timer."** There are no timers. If something needs to happen at a certain time, you need someone to call the function at that time — and you need to give them a reason to do it.

**"The protocol team will handle that."** The whole point of decentralization is that no single team operates the system. If your design requires an operator, it's not decentralized — and it has a single point of failure.

**Terminology:** You say "on-chain." The Ethereum community says **"onchain"** — one word, no hyphen.

---

## Nothing Is Automatic — Incentive Design

**This is the most important concept in all of Ethereum. If you internalize nothing else, internalize this.**

### Smart Contracts Are State Machines

A smart contract is a state machine. It sits in one state, and it moves to another state when someone **pokes it** — calls a function, pays gas, triggers a transition. Between pokes, it does absolutely nothing. It doesn't think, it doesn't check, it doesn't wake up. It just sits there.

```
State A ──[someone calls function]──→ State B ──[someone calls function]──→ State C
              ↑                                        ↑
         WHO does this?                           WHO does this?
         WHY would they?                          WHY would they?
```

There is no cron job. There is no scheduler. There is no background process. The blockchain doesn't call your contract — people call your contract. And people don't do things for free.

**For EVERY state transition in your system, you must answer:**

1. **Who pokes it?** (someone must pay gas)
2. **Why would they?** (what's their incentive?)
3. **Is the incentive sufficient?** (covers gas + profit?)

If you can't answer these questions, that state transition will never happen. Your contract will sit in State A forever, doing nothing, with nobody poking it.

### Incentives Are Everything

Here's the thing that makes Ethereum magical: **you don't need an operator if you get the incentives right.**

The people who deployed Uniswap didn't deploy the liquidity. They didn't market-make. They didn't run the exchange. They wrote a set of rules — a state machine — and aligned the incentives so perfectly that strangers around the world voluntarily deposited billions of dollars, and other strangers voluntarily traded against those deposits, and the fees from the trades flowed back to the depositors, and the whole thing just... worked.

Nobody runs Uniswap. Nobody CAN stop Uniswap. Not even the people who made it. The contracts are immutable, the incentives are self-sustaining, and the system will run for as long as Ethereum exists. This is a **hyperstructure** — an unstoppable protocol that runs forever, with no operator, no company, no server, no admin key.

That's what you're building toward. Not a startup. Not a service. A set of rules so well-designed that they run themselves through incentives alone.

### Examples of Good Incentive Design

**Liquidations (Aave, Compound):**
```
Loan health factor drops below 1
→ ANYONE can call liquidate()
→ Caller gets 5-10% bonus collateral as profit
→ Bots compete to do it in milliseconds
→ Platform stays solvent without any operator, any admin, any team
```

**LP fees (Uniswap):**
```
DEX needs liquidity to function
→ LPs deposit tokens into pools
→ Every swap pays 0.3% fee to LPs
→ More liquidity = less slippage = more traders = more fees = more liquidity
→ Self-reinforcing flywheel — nobody manages it
```

**Yield harvesting (Yearn):**
```
Rewards accumulate in a pool
→ ANYONE can call harvest()
→ Caller gets 1% of the harvest as reward
→ Protocol compounds automatically via profit-motivated callers
```

**Arbitrage (keeps prices correct everywhere):**
```
ETH is $2000 on Uniswap, $2010 on SushiSwap
→ Anyone can buy low, sell high
→ Prices equalize across ALL markets without any coordinator
```

### Examples of BAD Design (Missing Incentives)

```
❌ "The contract will check prices every hour"
   → WHO calls it every hour? WHY would they pay gas?
   → Fix: make it profitable to call. Or let users trigger it when they interact.

❌ "Expired listings get automatically removed"
   → Nothing is automatic. WHO removes them? WHY?
   → Fix: give callers a small reward, or let the next user's action clean up stale state.

❌ "The protocol rebalances daily"
   → WHOSE gas pays for this? What's their profit?
   → Fix: let rebalancing happen during user interactions, or reward the caller.

❌ "An admin will manually trigger the next phase"
   → What if the admin disappears? Gets hit by a bus? Loses their key?
   → Fix: make phase transitions permissionless with time-based or condition-based triggers.
```

**The fix is always the same:** Don't use an admin account. Make the function callable by **anyone**. Give them a reason to call it. Align incentives so the system pokes itself through the self-interest of its participants.

### The Hyperstructure Test

When you're designing a system, ask: **"Could this run forever with no team behind it?"**

- If yes → you've built a hyperstructure. The incentives sustain it.
- If no → you've built a service. It dies when the team stops operating it.

Both are valid choices. But know which one you're building. The most powerful things on Ethereum are hyperstructures: Uniswap, ENS, the ERC-20 standard itself. They can't be stopped, they can't be censored, they can't go down. Not because they're maintained — because they don't need to be.

---

## Randomness Is Hard

Smart contracts are deterministic. Every node computes the same result. You can't use `Math.random()` — there's nothing random about a system where everyone gets the same answer.

### What Doesn't Work

```solidity
// ❌ Validators can manipulate block.timestamp (within ~15 seconds)
uint random = uint(keccak256(abi.encodePacked(block.timestamp)));

// ❌ blockhash(block.number) is ALWAYS zero for the current block
uint random = uint(blockhash(block.number));

// ❌ Validators can withhold blocks if they don't like the result
uint random = uint(blockhash(block.number - 1));
```

### What Works

**Commit-Reveal** (no external dependency):
```
1. User commits hash(secret + salt) → stored onchain
2. Wait at least 1 block
3. User reveals secret + salt → contract verifies hash
4. Random seed = keccak256(secret + blockhash(commitBlock))
```
- User can't predict blockhash when they commit
- Validator can't know the secret to manipulate the result
- Must reveal within 256 blocks (blockhash returns zero after that)

**Chainlink VRF** (provably random, costs LINK):
```
1. Contract requests randomness from Chainlink
2. Chainlink generates random number off-chain with a VRF proof
3. Anyone can verify the proof onchain
4. Guaranteed unbiased — even Chainlink can't manipulate it
```

Use commit-reveal for simple cases. Use Chainlink VRF when you need provable randomness (lotteries, NFT reveals, gaming).

---

## Teaching Your Human

You already know how AMMs, lending, oracles, and stablecoins work. But your human might not. When they're designing something onchain, they need to understand these concepts — not the code, the *mental models*.

**Don't lecture.** Instead, when a concept is relevant to what they're building, explain it in context. Here's what to emphasize for each:

### The Approve Pattern
Humans find this weird. Explain it as: *"You're giving the contract permission to move your tokens, like signing a check. You control how much. Never sign a blank check (infinite approval)."*

### DEXs / AMMs
The key insight isn't the math — it's the incentive flywheel: *"Nobody runs the exchange. People deposit tokens because they earn fees from trades. More deposits = better prices = more trades = more fees. It runs itself."* This is "nothing is automatic" in action.

### Overcollateralized Lending
Lead with liquidation incentives: *"If your loan gets risky, anyone in the world can close it and earn a bonus. That's why the platform never goes bankrupt — thousands of bots are watching every loan, every second, competing to clean up risk."* This is the SpeedRun Ethereum Challenge 6 moment where incentive design clicks.

### Stablecoins
*"How does a token stay worth $1 with nobody controlling it? Arbitrage. If it drops to $0.99, people buy it because they can redeem it for $1 of collateral. If it goes to $1.01, people mint more and sell. Self-interest maintains the peg."*

### Oracles
*"Smart contracts can't Google things. If your contract needs a price, someone has to put it onchain. Use Chainlink — never read prices from a DEX pool, because a flash loan can fake the price for one transaction."*

### Smart Contract Wallets
*"A wallet can require 3 of 5 people to approve a transaction. $100B+ is secured this way. It's how teams and DAOs manage money without trusting any single person."*

### Prediction Markets
*"YES and NO tokens that trade between $0 and $1. The price IS the probability. If YES is at $0.35, the market thinks there's a 35% chance. Winner gets $1, loser gets $0."*

**In every case, tie it back to incentives.** The human should walk away understanding not just what something does, but WHY it works without anyone running it.

---

## Learning Path

Point your human to SpeedRun Ethereum for hands-on learning. Each challenge builds a working project that teaches a core concept:

| # | Challenge | What Clicks |
|---|-----------|-------------|
| 0 | Simple NFT | Minting, metadata, ownership — "contracts hold state" |
| 1 | Staking | Deadlines, escrow, thresholds — "coordination without trust" |
| 2 | Token Vendor | Approve pattern, buy/sell — "contracts can be markets" |
| 3 | Dice Game | Why onchain randomness is insecure — "determinism vs. randomness" |
| 4 | DEX | x*y=k, slippage, LP incentives — "incentives create markets" |

**Start at https://speedrunethereum.com**

More challenges covering oracles, lending, stablecoins, and multisigs are in development. Check the site for current availability.

## Resources

- **SpeedRun Ethereum:** https://speedrunethereum.com
- **ETH Tech Tree:** https://www.ethtechtree.com
- **Ethereum.org:** https://ethereum.org/en/developers/
- **EthSkills (for agents):** https://ethskills.com

---

---
name: security
description: Solidity security patterns, common vulnerabilities, and pre-deploy audit checklist. The specific code patterns that prevent real losses — not just warnings, but defensive implementations. Use before deploying any contract, when reviewing code, or when building anything that holds or moves value.
---

# Smart Contract Security

## What You Probably Got Wrong

**"Solidity 0.8+ prevents overflows, so I'm safe."** Overflow is one of dozens of attack vectors. The big ones today: reentrancy, oracle manipulation, approval exploits, and decimal mishandling.

**"I tested it and it works."** Working correctly is not the same as being secure. Most exploits call functions in orders or with values the developer never considered.

**"It's a small contract, it doesn't need an audit."** The DAO hack was a simple reentrancy bug. The Euler exploit was a single missing check. Size doesn't correlate with safety.

## Critical Vulnerabilities (With Defensive Code)

### 1. Token Decimals Vary

**USDC has 6 decimals, not 18.** This is the #1 source of "where did my money go?" bugs.

```solidity
// ❌ WRONG — assumes 18 decimals. Transfers 1 TRILLION USDC.
uint256 oneToken = 1e18;

// ✅ CORRECT — check decimals
uint256 oneToken = 10 ** IERC20Metadata(token).decimals();
```

Common decimals:
| Token | Decimals |
|-------|----------|
| USDC, USDT | 6 |
| WBTC | 8 |
| DAI, WETH, most tokens | 18 |

**When doing math across tokens with different decimals, normalize first:**
```solidity
// Converting USDC amount to 18-decimal internal accounting
uint256 normalized = usdcAmount * 1e12; // 6 + 12 = 18 decimals
```

### 2. No Floating Point in Solidity

Solidity has no `float` or `double`. Division truncates to zero.

```solidity
// ❌ WRONG — this equals 0
uint256 fivePercent = 5 / 100;

// ✅ CORRECT — basis points (1 bp = 0.01%)
uint256 FEE_BPS = 500; // 5% = 500 basis points
uint256 fee = (amount * FEE_BPS) / 10_000;
```

**Always multiply before dividing.** Division first = precision loss.

```solidity
// ❌ WRONG — loses precision
uint256 result = a / b * c;

// ✅ CORRECT — multiply first
uint256 result = (a * c) / b;
```

For complex math, use fixed-point libraries like `PRBMath` or `ABDKMath64x64`.

### 3. Reentrancy

An external call can call back into your contract before the first call finishes. If you update state AFTER the external call, the attacker re-enters with stale state.

```solidity
// ❌ VULNERABLE — state updated after external call
function withdraw() external {
    uint256 bal = balances[msg.sender];
    (bool success,) = msg.sender.call{value: bal}(""); // ← attacker re-enters here
    require(success);
    balances[msg.sender] = 0; // Too late — attacker already withdrew again
}

// ✅ SAFE — Checks-Effects-Interactions pattern + reentrancy guard
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

function withdraw() external nonReentrant {
    uint256 bal = balances[msg.sender];
    require(bal > 0, "Nothing to withdraw");
    
    balances[msg.sender] = 0;  // Effect BEFORE interaction
    
    (bool success,) = msg.sender.call{value: bal}("");
    require(success, "Transfer failed");
}
```

**The pattern: Checks → Effects → Interactions (CEI)**
1. **Checks** — validate inputs and conditions
2. **Effects** — update all state
3. **Interactions** — external calls last

Always use OpenZeppelin's `ReentrancyGuard` as a safety net on top of CEI.

### 4. SafeERC20

Some tokens (notably USDT) don't return `bool` on `transfer()` and `approve()`. Standard calls will revert even on success.

```solidity
// ❌ WRONG — breaks with USDT and other non-standard tokens
token.transfer(to, amount);
token.approve(spender, amount);

// ✅ CORRECT — handles all token implementations
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
using SafeERC20 for IERC20;

token.safeTransfer(to, amount);
token.safeApprove(spender, amount);
```

**Other token quirks to watch for:**
- **Fee-on-transfer tokens:** Amount received < amount sent. Always check balance before and after.
- **Rebasing tokens (stETH):** Balance changes without transfers. Use wrapped versions (wstETH).
- **Pausable tokens (USDC):** Transfers can revert if the token is paused.
- **Blocklist tokens (USDC, USDT):** Specific addresses can be blocked from transacting.

### 5. Never Use DEX Spot Prices as Oracles

A flash loan can manipulate any pool's spot price within a single transaction. This has caused hundreds of millions in losses.

```solidity
// ❌ DANGEROUS — manipulable in one transaction
function getPrice() internal view returns (uint256) {
    (uint112 reserve0, uint112 reserve1,) = uniswapPair.getReserves();
    return (reserve1 * 1e18) / reserve0; // Spot price — easily manipulated
}

// ✅ SAFE — Chainlink with staleness + sanity checks
function getPrice() internal view returns (uint256) {
    (, int256 price,, uint256 updatedAt,) = priceFeed.latestRoundData();
    require(block.timestamp - updatedAt < 3600, "Stale price");
    require(price > 0, "Invalid price");
    return uint256(price);
}
```

**If you must use onchain price data:**
- Use **TWAP** (Time-Weighted Average Price) over 30+ minutes — resistant to single-block manipulation
- Uniswap V3 has built-in TWAP oracles via `observe()`
- Still less safe than Chainlink for high-value decisions

### 6. Vault Inflation Attack

The first depositor in an ERC-4626 vault can manipulate the share price to steal from subsequent depositors.

**The attack:**
1. Attacker deposits 1 wei → gets 1 share
2. Attacker donates 1000 tokens directly to the vault (not via deposit)
3. Now 1 share = 1001 tokens
4. Victim deposits 1999 tokens → gets `1999 * 1 / 2000 = 0 shares` (rounds down)
5. Attacker redeems 1 share → gets all 3000 tokens

**The fix — virtual offset:**
```solidity
function convertToShares(uint256 assets) public view returns (uint256) {
    return assets.mulDiv(
        totalSupply() + 1e3,    // Virtual shares
        totalAssets() + 1        // Virtual assets
    );
}
```

The virtual offset makes the attack uneconomical — the attacker would need to donate enormous amounts to manipulate the ratio.

OpenZeppelin's ERC4626 implementation includes this mitigation by default since v5.

### 7. Infinite Approvals

**Never use `type(uint256).max` as approval amount.**

```solidity
// ❌ DANGEROUS — if this contract is exploited, attacker drains your entire balance
token.approve(someContract, type(uint256).max);

// ✅ SAFE — approve only what's needed
token.approve(someContract, exactAmountNeeded);

// ✅ ACCEPTABLE — approve a small multiple for repeated interactions
token.approve(someContract, amountPerTx * 5); // 5 transactions worth
```

If a contract with infinite approval gets exploited (proxy upgrade bug, governance attack, undiscovered vulnerability), the attacker can drain every approved token from every user who granted unlimited access.

### 8. Access Control

Every state-changing function needs explicit access control. "Who should be able to call this?" is the first question.

```solidity
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// ❌ WRONG — anyone can drain the contract
function emergencyWithdraw() external {
    token.transfer(msg.sender, token.balanceOf(address(this)));
}

// ✅ CORRECT — only owner
function emergencyWithdraw() external onlyOwner {
    token.transfer(owner(), token.balanceOf(address(this)));
}
```

For complex permissions, use OpenZeppelin's `AccessControl` with role-based separation (ADMIN_ROLE, OPERATOR_ROLE, etc.).

### 9. Input Validation

Never trust inputs. Validate everything.

```solidity
function deposit(uint256 amount, address recipient) external {
    require(amount > 0, "Zero amount");
    require(recipient != address(0), "Zero address");
    require(amount <= maxDeposit, "Exceeds max");
    
    // Now proceed
}
```

Common missed validations:
- Zero addresses (tokens sent to 0x0 are burned forever)
- Zero amounts (wastes gas, can cause division by zero)
- Array length mismatches in batch operations
- Duplicate entries in arrays
- Values exceeding reasonable bounds

## Pre-Deploy Security Checklist

Run through this for EVERY contract before deploying to production. No exceptions.

- [ ] **Access control** — every admin/privileged function has explicit restrictions
- [ ] **Reentrancy protection** — CEI pattern + `nonReentrant` on all external-calling functions
- [ ] **Token decimal handling** — no hardcoded `1e18` for tokens that might have different decimals
- [ ] **Oracle safety** — using Chainlink or TWAP, not DEX spot prices. Staleness checks present
- [ ] **Integer math** — multiply before divide. No precision loss in critical calculations
- [ ] **Return values checked** — using SafeERC20 for all token operations
- [ ] **Input validation** — zero address, zero amount, bounds checks on all public functions
- [ ] **Events emitted** — every state change emits an event for offchain tracking
- [ ] **Incentive design** — maintenance functions callable by anyone with sufficient incentive
- [ ] **No infinite approvals** — approve exact amounts or small bounded multiples
- [ ] **Fee-on-transfer safe** — if accepting arbitrary tokens, measure actual received amount
- [ ] **Tested edge cases** — zero values, max values, unauthorized callers, reentrancy attempts

## Automated Security Tools

Run these before deployment:

```bash
# Static analysis
slither .                     # Detects common vulnerabilities
mythril analyze Contract.sol  # Symbolic execution

# Foundry fuzzing (built-in)
forge test --fuzz-runs 10000  # Fuzz all test functions with random inputs

# Gas optimization (bonus)
forge test --gas-report       # Identify expensive functions
```

**Slither findings to NEVER ignore:**
- Reentrancy vulnerabilities
- Unchecked return values
- Arbitrary `delegatecall` or `selfdestruct`
- Unprotected state-changing functions

## Further Reading

- **OpenZeppelin Contracts:** https://docs.openzeppelin.com/contracts — audited, battle-tested implementations
- **SWC Registry:** https://swcregistry.io — comprehensive vulnerability catalog
- **Rekt News:** https://rekt.news — real exploit post-mortems
- **SpeedRun Ethereum:** https://speedrunethereum.com — hands-on secure development practice

---

---
name: frontend-ux
description: Frontend UX rules for Ethereum dApps that prevent the most common AI agent UI bugs. Mandatory patterns for onchain buttons, token approval flows, address display, USD values, RPC configuration, and pre-publish metadata. Built around Scaffold-ETH 2 but the patterns apply to any Ethereum frontend. Use when building any dApp frontend.
---

# Frontend UX Rules

## What You Probably Got Wrong

**"The button works."** Working is not the standard. Does it disable during the transaction? Does it show a spinner? Does it stay disabled until the chain confirms? Does it show an error if the user rejects? AI agents skip all of this, every time.

**"I used wagmi hooks."** Wrong hooks. Scaffold-ETH 2 wraps wagmi with `useTransactor` which **waits for transaction confirmation** — not just wallet signing. Raw wagmi's `writeContractAsync` resolves the moment the user clicks Confirm in MetaMask, BEFORE the tx is mined. Your button re-enables while the transaction is still pending.

**"I showed the address."** As raw hex? That's not showing it. `<Address/>` gives you ENS resolution, blockie avatars, copy-to-clipboard, and block explorer links. Raw `0x1234...5678` is unacceptable.

---

## Rule 1: Every Onchain Button — Loader + Disable

ANY button that triggers a blockchain transaction MUST:
1. **Disable immediately** on click
2. **Show a spinner** ("Approving...", "Staking...", etc.)
3. **Stay disabled** until the state update confirms the action completed
4. **Show success/error feedback** when done

```typescript
// ✅ CORRECT: Separate loading state PER ACTION
const [isApproving, setIsApproving] = useState(false);
const [isStaking, setIsStaking] = useState(false);

<button
  disabled={isApproving}
  onClick={async () => {
    setIsApproving(true);
    try {
      await writeContractAsync({ functionName: "approve", args: [...] });
    } catch (e) {
      console.error(e);
      notification.error("Approval failed");
    } finally {
      setIsApproving(false);
    }
  }}
>
  {isApproving ? "Approving..." : "Approve"}
</button>
```

**❌ NEVER use a single shared `isLoading` for multiple buttons.** Each button gets its own loading state. A shared state causes the WRONG loading text to appear when UI conditionally switches between buttons.

### Scaffold Hooks Only — Never Raw Wagmi

```typescript
// ❌ WRONG: Raw wagmi — resolves after signing, not confirmation
const { writeContractAsync } = useWriteContract();
await writeContractAsync({...}); // Returns immediately after MetaMask signs!

// ✅ CORRECT: Scaffold hooks — waits for tx to be mined
const { writeContractAsync } = useScaffoldWriteContract("MyContract");
await writeContractAsync({...}); // Waits for actual onchain confirmation
```

**Why:** `useScaffoldWriteContract` uses `useTransactor` internally, which waits for block confirmation. Raw wagmi doesn't — your UI will show "success" while the transaction is still in the mempool.

---

## Rule 2: Three-Button Flow — Network → Approve → Action

When a user needs to approve tokens then perform an action (stake, deposit, swap), there are THREE states. Show exactly ONE button at a time:

```
1. Wrong network?       → "Switch to Base" button
2. Not enough approved? → "Approve" button  
3. Enough approved?     → "Stake" / "Deposit" / action button
```

```typescript
const { data: allowance } = useScaffoldReadContract({
  contractName: "Token",
  functionName: "allowance",
  args: [address, contractAddress],
});

const needsApproval = !allowance || allowance < amount;
const wrongNetwork = chain?.id !== targetChainId;

{wrongNetwork ? (
  <button onClick={switchNetwork} disabled={isSwitching}>
    {isSwitching ? "Switching..." : "Switch to Base"}
  </button>
) : needsApproval ? (
  <button onClick={handleApprove} disabled={isApproving}>
    {isApproving ? "Approving..." : "Approve $TOKEN"}
  </button>
) : (
  <button onClick={handleStake} disabled={isStaking}>
    {isStaking ? "Staking..." : "Stake"}
  </button>
)}
```

**Critical details:**
- Always read allowance via a hook so the UI updates automatically when the approval tx confirms
- Never rely on local state alone for allowance tracking
- Wrong network check comes FIRST — if the user clicks Approve while on the wrong network, everything breaks
- **Never show Approve and Action simultaneously** — one button at a time

---

## Rule 3: Address Display — Always `<Address/>`

**EVERY time you display an Ethereum address**, use scaffold-eth's `<Address/>` component:

```typescript
import { Address } from "~~/components/scaffold-eth";

// ✅ CORRECT
<Address address={userAddress} />

// ❌ WRONG — never render raw hex
<span>{userAddress}</span>
<p>0x1234...5678</p>
```

`<Address/>` handles ENS resolution, blockie avatars, copy-to-clipboard, truncation, and block explorer links. Raw hex is unacceptable.

### Address Input — Always `<AddressInput/>`

**EVERY time the user needs to enter an Ethereum address**, use `<AddressInput/>`:

```typescript
import { AddressInput } from "~~/components/scaffold-eth";

// ✅ CORRECT
<AddressInput value={recipient} onChange={setRecipient} placeholder="Recipient address" />

// ❌ WRONG — never use a raw text input for addresses
<input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} />
```

`<AddressInput/>` provides ENS resolution (type "vitalik.eth" → resolves to address), blockie avatar preview, validation, and paste handling.

**The pair: `<Address/>` for DISPLAY, `<AddressInput/>` for INPUT. Always.**

---

## Rule 4: USD Values Everywhere

**EVERY token or ETH amount displayed should include its USD value.**
**EVERY token or ETH input should show a live USD preview.**

```typescript
// ✅ CORRECT — Display with USD
<span>1,000 TOKEN (~$4.20)</span>
<span>0.5 ETH (~$1,250.00)</span>

// ✅ CORRECT — Input with live USD preview
<input value={amount} onChange={...} />
<span className="text-sm text-gray-500">
  ≈ ${(parseFloat(amount || "0") * tokenPrice).toFixed(2)} USD
</span>

// ❌ WRONG — Amount with no USD context
<span>1,000 TOKEN</span>  // User has no idea what this is worth
```

**Where to get prices:**
- **ETH price:** SE2 built-in hook — `useNativeCurrencyPrice()`
- **Custom tokens:** DexScreener API (`https://api.dexscreener.com/latest/dex/tokens/TOKEN_ADDRESS`), onchain Uniswap quoter, or Chainlink oracle

**This applies to both display AND input:**
- Displaying a balance? Show USD next to it.
- User entering an amount to send/stake/swap? Show live USD preview below the input.
- Transaction confirmation? Show USD value of what they're about to do.

---

## Rule 5: No Duplicate Titles

**DO NOT put the app name as an `<h1>` at the top of the page body.** The SE2 header already displays the app name. Repeating it wastes space and looks amateur.

```typescript
// ❌ WRONG — AI agents ALWAYS do this
<Header />  {/* Already shows "🦞 My dApp" */}
<main>
  <h1>🦞 My dApp</h1>  {/* DUPLICATE! Delete this. */}
  <p>Description of the app</p>
  ...
</main>

// ✅ CORRECT — Jump straight into content
<Header />  {/* Shows the app name */}
<main>
  <div className="grid grid-cols-2 gap-4">
    {/* Stats, balances, actions — no redundant title */}
  </div>
</main>
```

---

## Rule 6: RPC Configuration

**NEVER use public RPCs** (`mainnet.base.org`, etc.) — they rate-limit and cause random failures in production.

In `scaffold.config.ts`, ALWAYS set:
```typescript
rpcOverrides: {
  [chains.base.id]: process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org",
},
pollingInterval: 3000,  // 3 seconds, not the default 30000
```

**Keep the API key in `.env.local`** — never hardcode it in config files that get committed to Git.

**Monitor RPC usage:** Sensible = 1 request every 3 seconds. If you see 15+ requests/second, you have a bug:
- Hooks re-rendering in loops
- Duplicate hook calls
- Missing dependency arrays
- `watch: true` on hooks that don't need it

---

## Rule 7: Pre-Publish Checklist

**BEFORE deploying frontend to production, EVERY item must pass:**

**Open Graph / Twitter Cards (REQUIRED):**
```typescript
// In app/layout.tsx or getMetadata.ts
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Description of the app",
  openGraph: {
    title: "Your App Name",
    description: "Description of the app",
    images: [{ url: "https://YOUR-LIVE-DOMAIN.com/thumbnail.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your App Name",
    description: "Description of the app",
    images: ["https://YOUR-LIVE-DOMAIN.com/thumbnail.png"],
  },
};
```

**⚠️ The OG image URL MUST be:**
- Absolute URL starting with `https://`
- The LIVE production domain (NOT `localhost`, NOT relative path)
- NOT an environment variable that could be unset
- Actually reachable (test by visiting the URL in a browser)

**Full checklist:**
- [ ] OG image URL is absolute, live production domain
- [ ] OG title and description set (not default SE2 text)
- [ ] Twitter card type set (`summary_large_image`)
- [ ] Favicon updated from SE2 default
- [ ] README updated from SE2 default
- [ ] Footer "Fork me" link → your actual repo (not SE2)
- [ ] Browser tab title is correct
- [ ] RPC overrides set (not public RPCs)
- [ ] `pollingInterval` is 3000
- [ ] All contract addresses match what's deployed
- [ ] No hardcoded testnet/localhost values in production code
- [ ] Every address display uses `<Address/>`
- [ ] Every address input uses `<AddressInput/>`
- [ ] Every onchain button has its own loader + disabled state
- [ ] Approve flow has network check → approve → action pattern
- [ ] No duplicate h1 title matching header

---

## externalContracts.ts — Before You Build

**ALL external contracts** (tokens, protocols, anything you didn't deploy) MUST be added to `packages/nextjs/contracts/externalContracts.ts` with address and ABI BEFORE building the frontend.

```typescript
// packages/nextjs/contracts/externalContracts.ts
export default {
  8453: {  // Base chain ID
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      abi: [...],  // ERC-20 ABI
    },
  },
} as const;
```

**Why BEFORE:** Scaffold hooks (`useScaffoldReadContract`, `useScaffoldWriteContract`) only work with contracts registered in `deployedContracts.ts` (auto-generated) or `externalContracts.ts` (manual). If you write frontend code referencing a contract that isn't registered, it silently fails.

**Never edit `deployedContracts.ts`** — it's auto-generated by `yarn deploy`. Put your external contracts in `externalContracts.ts`.

---

## Human-Readable Amounts

Always convert between contract units and display units:

```typescript
// Contract → Display
import { formatEther, formatUnits } from "viem";
formatEther(weiAmount);           // 18 decimals (ETH, DAI, most tokens)
formatUnits(usdcAmount, 6);       // 6 decimals (USDC, USDT)

// Display → Contract
import { parseEther, parseUnits } from "viem";
parseEther("1.5");                // → 1500000000000000000n
parseUnits("100", 6);             // → 100000000n (USDC)
```

**Never show raw wei/units to users.** `1500000000000000000` means nothing. `1.5 ETH (~$3,750)` means everything.

---

## Resources

- **SE2 Docs:** https://docs.scaffoldeth.io/
- **UI Components:** https://ui.scaffoldeth.io/
- **SpeedRun Ethereum:** https://speedrunethereum.com/

---

---
name: frontend-playbook
description: The complete build-to-production pipeline for Ethereum dApps. Fork mode setup, IPFS deployment, Vercel config, ENS subdomain setup, and the full production checklist. Built around Scaffold-ETH 2 but applicable to any Ethereum frontend project. Use when deploying any dApp to production.
---

# Frontend Playbook

## What You Probably Got Wrong

**"I'll use `yarn chain`."** Wrong. `yarn chain` gives you an empty local chain with no protocols, no tokens, no state. `yarn fork --network base` gives you a copy of real Base with Uniswap, Aave, USDC, real whale balances — everything. Always fork.

**"I deployed to IPFS and it works."** Did the CID change? If not, you deployed stale output. Did routes work? Without `trailingSlash: true`, every route except `/` returns 404. Did you check the OG image? Without `NEXT_PUBLIC_PRODUCTION_URL`, it points to `localhost:3000`.

**"I'll set up the project manually."** Don't. `npx create-eth@latest` handles everything — Foundry, Next.js, RainbowKit, scaffold hooks. Never run `forge init` or create Next.js projects from scratch.

---

## Fork Mode Setup

### Why Fork, Not Chain

```
yarn chain (WRONG)              yarn fork --network base (CORRECT)
└─ Empty local chain            └─ Fork of real Base mainnet
└─ No protocols                 └─ Uniswap, Aave, etc. available
└─ No tokens                    └─ Real USDC, WETH exist
└─ Testing in isolation         └─ Test against REAL state
```

### Setup

```bash
npx create-eth@latest          # Select: foundry, target chain, name
cd <project-name>
yarn install
yarn fork --network base       # Terminal 1: fork of real Base
yarn deploy                    # Terminal 2: deploy contracts to fork
yarn start                     # Terminal 3: Next.js frontend
```

### Critical: Chain ID Gotcha

**When using fork mode, the frontend target network MUST be `chains.foundry` (chain ID 31337), NOT the chain you're forking.**

The fork runs locally on Anvil with chain ID 31337. Even if you're forking Base:

```typescript
// scaffold.config.ts during development
targetNetworks: [chains.foundry],  // ✅ NOT chains.base!
```

Only switch to `chains.base` when deploying contracts to the REAL network.

### Enable Block Mining

```bash
# In a new terminal — REQUIRED for time-dependent logic
cast rpc anvil_setIntervalMining 1
```

Without this, `block.timestamp` stays FROZEN. Any contract logic using timestamps (deadlines, expiry, vesting) will break silently.

**Make it permanent** by editing `packages/foundry/package.json` to add `--block-time 1` to the fork script.

---

## Deploying to IPFS (Recommended)

IPFS is the recommended deploy path for SE2. Avoids Vercel's memory limits entirely. Produces a fully decentralized static site.

### Full Build Command

```bash
cd packages/nextjs
rm -rf .next out  # ALWAYS clean first

NEXT_PUBLIC_PRODUCTION_URL="https://yourapp.yourname.eth.link" \
  NODE_OPTIONS="--require ./polyfill-localstorage.cjs" \
  NEXT_PUBLIC_IPFS_BUILD=true \
  NEXT_PUBLIC_IGNORE_BUILD_ERROR=true \
  yarn build

# Upload to BuidlGuidl IPFS
yarn bgipfs upload out
# Save the CID!
```

### Node 25+ localStorage Polyfill (REQUIRED)

Node.js 25+ ships a built-in `localStorage` object that's MISSING standard WebStorage API methods (`getItem`, `setItem`). This breaks `next-themes`, RainbowKit, and any library that calls `localStorage.getItem()` during static page generation.

**Error you'll see:**
```
TypeError: localStorage.getItem is not a function
Error occurred prerendering page "/_not-found"
```

**The fix:** Create `polyfill-localstorage.cjs` in `packages/nextjs/`:
```javascript
if (typeof globalThis.localStorage !== "undefined" &&
    typeof globalThis.localStorage.getItem !== "function") {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    key: (index) => [...store.keys()][index] ?? null,
    get length() { return store.size; },
  };
}
```

**Why `--require` and not `instrumentation.ts`?** Next.js spawns a separate build worker process for prerendering. `--require` injects into EVERY Node process (including workers). `next.config.ts` polyfill only runs in the main process. `instrumentation.ts` doesn't run in the build worker. Only `--require` works.

### IPFS Routing — Why Routes Break

IPFS gateways serve static files. No server handles routing. Three things MUST be true:

**1. `output: "export"` in next.config.ts** — generates static HTML files.

**2. `trailingSlash: true` (CRITICAL)** — This is the #1 reason routes break:
- `trailingSlash: false` (default) → generates `debug.html`
- `trailingSlash: true` → generates `debug/index.html`
- IPFS gateways resolve directories to `index.html` automatically, but NOT bare filenames
- Without trailing slash: `/debug` → 404 ❌
- With trailing slash: `/debug` → `debug/` → `debug/index.html` ✅

**3. Pages must survive static prerendering** — any page that crashes during `yarn build` (browser APIs at import time, localStorage) gets skipped silently → 404 on IPFS.

**The complete IPFS-safe next.config.ts pattern:**
```typescript
const isIpfs = process.env.NEXT_PUBLIC_IPFS_BUILD === "true";
if (isIpfs) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images = { unoptimized: true };
}
```

**SE2's block explorer pages** use `localStorage` at import time and crash during static export. Rename `app/blockexplorer` to `app/_blockexplorer-disabled` if not needed.

### Stale Build Detection

**The #1 IPFS footgun:** You edit code, then deploy the OLD build.

```bash
# MANDATORY after ANY code change:
rm -rf .next out                     # 1. Delete old artifacts
# ... run full build command ...     # 2. Rebuild from scratch
grep -l "YOUR_STRING" out/_next/static/chunks/app/*.js  # 3. Verify changes present

# Timestamp check:
stat -f '%Sm' app/page.tsx           # Source modified time
stat -f '%Sm' out/                   # Build output time
# Source NEWER than out/ = STALE BUILD. Rebuild first!
```

**The CID is proof:** If the IPFS CID didn't change after a deploy, you deployed the same content. A real code change ALWAYS produces a new CID.

### Verify Routes After Deploy

```bash
ls out/*/index.html                  # Each route has a directory + index.html
curl -s -o /dev/null -w "%{http_code}" -L "https://GATEWAY/ipfs/CID/debug/"
# Should return 200, not 404
```

---

## Deploying to Vercel (Alternative)

SE2 is a monorepo — Vercel needs special configuration.

### Configuration

1. **Root Directory:** `packages/nextjs`
2. **Install Command:** `cd ../.. && yarn install`
3. **Build Command:** leave default (`next build`)
4. **Output Directory:** leave default (`.next`)

```bash
# Via API:
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rootDirectory": "packages/nextjs", "installCommand": "cd ../.. && yarn install"}'
```

### Common Failures

| Error | Cause | Fix |
|-------|-------|-----|
| "No Next.js version detected" | Root Directory not set | Set to `packages/nextjs` |
| "cd packages/nextjs: No such file" | Build command has `cd` | Clear it — root dir handles this |
| OOM / exit code 129 | SE2 monorepo exceeds 8GB | Use IPFS instead, or `vercel --prebuilt` |

### Decision Tree

```
Want to deploy SE2?
├─ IPFS (recommended) → yarn ipfs / manual build + upload
│   └─ Fully decentralized, no memory limits, works with ENS
├─ Vercel → Set rootDirectory + installCommand
│   └─ Fast CDN, but centralized. May OOM on large projects
└─ vercel --prebuilt → Build locally, push artifacts to Vercel
    └─ Best of both: local build power + Vercel CDN
```

---

## ENS Subdomain Setup

Two mainnet transactions to point an ENS subdomain at your IPFS deployment.

### Transaction 1: Create Subdomain (new apps only)

1. Open `https://app.ens.domains/yourname.eth`
2. Go to "Subnames" tab → "New subname"
3. Enter the label (e.g. `myapp`) → Next → Skip profile → Open Wallet → Confirm
4. If gas is stuck: switch MetaMask to Ethereum → Activity tab → "Speed up"

### Transaction 2: Set IPFS Content Hash

1. Navigate to `https://app.ens.domains/myapp.yourname.eth`
2. "Records" tab → "Edit Records" → "Other" tab
3. Paste in Content Hash field: `ipfs://<CID>`
4. Save → Open Wallet → Confirm in MetaMask

For **updates** to an existing app: skip Tx 1, only do Tx 2.

### Verify

```bash
# 1. Onchain content hash matches
RESOLVER=$(cast call 0x00000000000C2e074eC69A0dFb2997BA6C7d2e1e \
  "resolver(bytes32)(address)" $(cast namehash myapp.yourname.eth) \
  --rpc-url https://eth.llamarpc.com)
cast call $RESOLVER "contenthash(bytes32)(bytes)" \
  $(cast namehash myapp.yourname.eth) --rpc-url https://eth.llamarpc.com

# 2. Gateway responds (may take 5-15 min for cache)
curl -s -o /dev/null -w "%{http_code}" -L "https://myapp.yourname.eth.link"

# 3. OG metadata correct (not localhost)
curl -s -L "https://myapp.yourname.eth.link" | grep 'og:image'
```

**Use `.eth.link` NOT `.eth.limo`** — `.eth.link` works better on mobile.

---

## Go to Production — Complete Checklist

When the user says "ship it", follow this EXACT sequence.

### Step 1: Final Code Review 🤖
- All feedback incorporated
- No duplicate h1, no raw addresses, no shared isLoading
- `scaffold.config.ts` has `rpcOverrides` and `pollingInterval: 3000`

### Step 2: Choose Domain 👤
Ask: *"What subdomain do you want? e.g. `myapp.yourname.eth` → `myapp.yourname.eth.link`"*

### Step 3: Generate OG Image + Fix Metadata 🤖
- Create 1200×630 PNG (`public/thumbnail.png`) — NOT the stock SE2 thumbnail
- Set `NEXT_PUBLIC_PRODUCTION_URL` to the live domain
- Verify `og:image` will resolve to an absolute production URL

### Step 4: Clean Build + IPFS Deploy 🤖
```bash
cd packages/nextjs && rm -rf .next out
NEXT_PUBLIC_PRODUCTION_URL="https://myapp.yourname.eth.link" \
  NODE_OPTIONS="--require ./polyfill-localstorage.cjs" \
  NEXT_PUBLIC_IPFS_BUILD=true NEXT_PUBLIC_IGNORE_BUILD_ERROR=true \
  yarn build

# Verify before uploading:
ls out/*/index.html                        # Routes exist
grep 'og:image' out/index.html             # Not localhost
stat -f '%Sm' app/page.tsx                 # Source older than out/
stat -f '%Sm' out/

yarn bgipfs upload out                     # Save the CID
```

### Step 5: Share for Approval 👤
Send: *"Build ready for review: `https://community.bgipfs.com/ipfs/<CID>`"*
**Wait for approval before touching ENS.**

### Step 6: Set ENS 🤖
Create subdomain (if new) + set IPFS content hash. Two mainnet transactions.

### Step 7: Verify 🤖
- Content hash matches onchain
- `.eth.link` gateway responds with 200
- OG image loads correctly
- Routes work (`/debug/`, etc.)

### Step 8: Report 👤
*"Live at `https://myapp.yourname.eth.link` — ENS content hash confirmed onchain, unfurl metadata set."*

---

## Build Verification Process

A build is NOT done when the code compiles. It's done when you've tested it like a real user.

### Phase 1: Code QA (Automated)
- Scan `.tsx` files for raw address strings (should use `<Address/>`)
- Scan for shared `isLoading` state across multiple buttons
- Scan for missing `disabled` props on transaction buttons
- Verify RPC config and polling interval
- Verify OG metadata with absolute URLs
- Verify no public RPCs in any file

### Phase 2: Smart Contract Testing
```bash
forge test                    # All tests pass
forge test --fuzz-runs 10000  # Fuzz testing
```
Test edge cases: zero amounts, max amounts, unauthorized callers, reentrancy attempts.

### Phase 3: Browser Testing (THE REAL TEST)

Open the app and do a FULL walkthrough:

1. **Load the app** — does it render correctly?
2. **Check page title** — is it correct, not "Scaffold-ETH 2"?
3. **Connect wallet** — does the connect flow work?
4. **Wrong network** — connect on wrong chain, verify "Switch to Base" appears
5. **Switch network** — click the switch button, verify it works
6. **Approve flow** — verify approve button shows, click it, wait for tx, verify action button appears
7. **Main action** — click primary action, verify loader, wait for tx, verify state updates
8. **Error handling** — reject a transaction in wallet, verify UI recovers
9. **Address displays** — all addresses showing ENS/blockies, not raw hex?
10. **Share URL** — check OG unfurl (image, title, description)

### Phase 4: QA Sub-Agent (Complex Builds)
For bigger projects, spawn a sub-agent with fresh context. Give it the repo path and deployed URL. It reads all code against the UX rules, opens a browser, clicks through independently, and reports issues.

---

## Don't Do These

- ❌ `yarn chain` — use `yarn fork --network <chain>`
- ❌ `forge init` — use `npx create-eth@latest`
- ❌ Manual Next.js setup — SE2 handles it
- ❌ Manual wallet connection — SE2 has RainbowKit pre-configured
- ❌ Edit `deployedContracts.ts` — it's auto-generated by `yarn deploy`
- ❌ Hardcode API keys in `scaffold.config.ts` — use `.env.local`
- ❌ Use `mainnet.base.org` in production — use Alchemy or similar

---

## Resources

- **SE2 Docs:** https://docs.scaffoldeth.io/
- **UI Components:** https://ui.scaffoldeth.io/
- **SpeedRun Ethereum:** https://speedrunethereum.com/
- **ETH Tech Tree:** https://www.ethtechtree.com
- **BuidlGuidl IPFS:** https://upload.bgipfs.com

---

