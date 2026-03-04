# ethskills.com Full Site Review — 2026-03-03

**Reviewer:** clawd (Claude Opus 4.6 via OpenClaw)
**Requested by:** Austin Griffith
**Date:** March 3, 2026
**Scope:** All 16 SKILL.md files on ethskills.com — address verification, fact-checking, consistency, and content relevance review.

**Methodology:**
- Every contract address verified onchain via `cast code` + `cast call` (symbol/name checks)
- RPCs used: local Ethereum node (192.168.68.62:8545), Alchemy endpoints for L2s
- Factual claims researched via web search and official docs
- Content reviewed for: things LLMs already know (remove), things LLMs get wrong (keep), consistency across skills

---

## 1. Contract Address Verification

### Summary: 182+ addresses verified across 7 networks. ZERO incorrect addresses found.

All addresses return deployed bytecode on their claimed chains. All token symbols match. All Chainlink price feeds return live, reasonable prices.

### Batch 1: Stablecoins, WETH, Liquid Staking, Uniswap, 1inch — 60/60 ✅

| Section | Count | Result |
|---------|-------|--------|
| Stablecoins (6 chains) | 14 | ✅ All verified |
| WETH (4 chains) | 4 | ✅ All verified |
| Liquid Staking | 8 | ✅ All verified |
| Uniswap V2/V3/V4 | 30 | ✅ All verified |
| 1inch V5/V6 | 4 | ✅ All verified |

**Minor note:** USDT on Arbitrum returns onchain symbol "USD₮0" (Tether rebrand) — address correct.

### Batch 2: DeFi Protocols, Infrastructure, Chainlink, Cross-chain — 62/62 ✅

| Section | Count | Result |
|---------|-------|--------|
| MakerDAO/sDAI | 2 | ✅ |
| Aave V2/V3 (4 chains) | 9 | ✅ |
| Compound V2/V3 (4 chains) | 8 | ✅ |
| Curve | 2 | ✅ |
| Balancer | 1 | ✅ |
| Seaport 1.1/1.5 | 2 | ✅ |
| ENS | 3 | ✅ |
| Safe (3 versions) | 4 | ✅ |
| ERC-4337 EntryPoints | 2 | ✅ |
| Chainlink Mainnet feeds | 7 | ✅ (all returning live prices) |
| Chainlink L2 feeds | 5 | ✅ |
| EigenLayer | 2 | ✅ |
| CCIP Routers | 3 | ✅ |
| Across SpokePools | 4 | ✅ |
| Yearn V3 | 3 | ✅ |
| CREATE2 Deployer | 1 | ✅ |
| Major tokens (AAVE, COMP, MKR, LDO, WBTC) | 5 | ✅ |

**Chainlink prices at verification time:** ETH/USD $2,010, BTC/USD $68,256, LINK/USD $8.88, AAVE/USD $119.73, stETH/USD $2,008, USDC/USD $1.00. L2 feeds consistent.

### Batch 3: L2-Native Protocols — All verified ✅

| Section | Chain | Count | Result |
|---------|-------|-------|--------|
| Aerodrome | Base | 9 | ✅ (symbol=AERO) |
| Velodrome | Optimism | 8 | ✅ (symbol=VELO) |
| GMX | Arbitrum | 6 | ✅ (symbol=GMX) |
| Pendle | Arbitrum | 9 | ✅ (symbol=PENDLE) |
| Camelot | Arbitrum | 6 | ✅ (symbol=GRAIL) |
| SyncSwap | zkSync | 7 | ✅ |
| Morpho | Base | 1 | ✅ |
| ERC-8004 | Mainnet + Base | 4 | ✅ |
| Celo stablecoins | Celo | 3 | ✅ (symbols: USDm, EURm, BRLm — rebranded!) |
| Multicall3 | All chains | 4 | ✅ |

---

## 2. Fact-Checking Results

### ✅ Confirmed Correct

| Claim | Source | Verified |
|-------|--------|----------|
| Pectra shipped May 7, 2025 | EF blog, CryptoAPIs | ✅ |
| Fusaka shipped Dec 3, 2025 | EF blog, Consensys, CoinGecko | ✅ |
| ERC-8004 deployed January 29, 2026 | Eco.com, EIPs.ethereum.org | ✅ |
| Celo migrated March 26, 2025, block 31056500 | Celo docs, cLabs Twitter | ✅ |
| Uniswap V4 launched January 31, 2025 | CoinMarketCap, Uniswap blog | ✅ |
| Aerodrome/Velodrome merged Nov 2025 → Aero | CoinDesk, ForkLog, The Defiant | ✅ |
| Polygon zkEVM shutdown (June 2025) | CryptoRank, blocmates, AInvest | ✅ |
| Aave V3 flash loan fee = 0.05% | Aave official docs | ✅ |
| Multicall3 = 0xcA11bde05977b3631167028862bE2a173976CA11 all chains | Verified on 4 chains | ✅ |
| Gas limit 60M (post-Fusaka) | Verified via `cast block` | ✅ |
| Glamsterdam planned H1 2026 | CoinPedia, MEXC blog | ✅ |

### ❌ Corrections Made

| Claim | Was | Should Be | Source |
|-------|-----|-----------|--------|
| Gas base fee | 0.05-0.1 gwei | Under 1 gwei (typically 0.1-0.5) | `cast base-fee` = 0.29 gwei on 2026-03-03 |
| ETH price | ~$1,960 | ~$2,000 | Chainlink ETH/USD = $1,988 on 2026-03-03 |
| L2 TVLs | Specific $ amounts | Removed — link to DeFi Llama instead | TVLs were 5-21x wrong (see below) |
| Mainnet TVL | $50B+ | Removed — link to DeFi Llama | Was approximately correct but will drift |
| Safe value secured | $100B+ | $60B+ assets ($1.4T+ processed) | GlobeNewsWire, Invezz (Feb 2026) |
| Celo stablecoins | cUSD, cEUR, cREAL | USDm, EURm, BRLm | Mento forum (Dec 2025), verified onchain |
| Unichain launch date | February 10, 2025 | February 11, 2025 | Uniswap blog, Nansen |

**TVL staleness problem:** The original $18B/$12B/$8B figures for Arbitrum/Base/Optimism were likely L2Beat's TVS (Total Value Secured), which includes all bridged + natively minted assets. DeFi Llama's DeFi TVL shows Arbitrum ~$2B, Base ~$3.9B, Optimism ~$213M (as of Mar 3, 2026). Rather than replacing with new point-in-time numbers that will also go stale, we removed specific TVL figures and linked to live sources. See GitHub issue for automated freshness proposal.

---

## 3. Consistency Review

### Cross-Skill Consistency Issues Found & Fixed

Gas and price references updated consistently across:
- `gas/SKILL.md` — primary source of truth for gas numbers
- `why/SKILL.md` — overview references
- `l2s/SKILL.md` — comparison table and chain details
- `wallets/SKILL.md` — Safe TVL figure
- `addresses/SKILL.md` — verification timestamps

### Consistent Across Skills (No Issues)
- "onchain" (one word) used consistently ✅
- scaffold-eth references consistent ✅
- SpeedRunEthereum URL consistent ✅
- "Foundry is the default" consistent ✅
- Chainlink oracle usage advice consistent ✅
- CEI pattern advice consistent ✅

---

## 4. Content Relevance Review

### Content That SHOULD Stay (LLMs get these wrong)
- ✅ Gas prices (LLMs consistently hallucinate 10-30 gwei)
- ✅ Token decimals (USDC=6 is the #1 bug LLMs cause)
- ✅ "Nothing is automatic" / incentive design
- ✅ SafeERC20 for USDT
- ✅ Contract addresses (LLMs hallucinate addresses)
- ✅ DEX spot price oracle danger
- ✅ Dominant DEX per chain (LLMs default to Uniswap everywhere)
- ✅ Celo is an L2 now (LLMs say L1)
- ✅ Polygon zkEVM shutdown
- ✅ Fork mode (yarn fork not yarn chain)
- ✅ IPFS trailingSlash requirement
- ✅ ERC-8004, x402 (too new for training data)

### Content That LLMs Generally Know (Could Consider Removing)
These are areas where a well-trained LLM already knows the basics. However, each section contains ethskills-specific corrections that justify keeping them:
- ERC-20 basics → BUT the decimals/SafeERC20 corrections are critical, keep
- Reentrancy basics → BUT the CEI + nonReentrant combo advice is precise, keep
- Proxy patterns → BUT the "use UUPS not Transparent" advice is specific, keep
- Foundry testing basics → BUT the "don't test getters" and invariant testing emphasis is valuable, keep

**Verdict:** Nothing should be removed. Every section exists because it corrects a specific LLM mistake.

---

## 5. Design Decision: Option A for Volatile Data

TVLs, gas prices, and ETH price go stale within days. Rather than maintaining point-in-time snapshots that inevitably become wrong, this review adopted **Option A: ranges + live source links**.

- TVL column removed from L2 comparison table; replaced with callout noting rankings + link to DeFi Llama / L2Beat
- Gas prices expressed as "under 1 gwei" with `cast base-fee` verification command
- ETH price expressed as approximate with "always verify" caveat

A complementary **Option B** (automated freshness script) is tracked as a separate GitHub issue.

---

*Review complete. 182+ addresses verified. 7 factual corrections applied. Zero hallucinated addresses found.*
