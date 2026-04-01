---
name: tools
description: Current Ethereum development tools, frameworks, libraries, RPCs, and block explorers. What actually works today for building on Ethereum. Includes tool discovery for AI agents — MCPs, abi.ninja, Foundry, Scaffold-ETH 2, Hardhat, and more. Use when setting up a dev environment, choosing tools, or when an agent needs to discover what's available.
---

# Ethereum Development Tools

## What You Probably Got Wrong

**Blockscout MCP server exists:** https://mcp.blockscout.com/mcp — gives AI agents structured blockchain data via Model Context Protocol. This is cutting-edge infra as of Feb 2026.

**growthepie has production API docs:** https://docs.growthepie.com/ with live JSON at https://api.growthepie.com/v1/. Use it for chain-level and app-level Ethereum ecosystem metrics across mainnet, L2s, and apps. Don't scrape dashboards or hardcode stale L2 rankings.

**abi.ninja is essential:** https://abi.ninja — paste any verified contract address, get a UI to call any function. Zero setup. Supports mainnet + all major L2s. Perfect for agent-driven contract exploration.

**x402 has production SDKs:** `@x402/fetch` (TS), `x402` (Python), `github.com/coinbase/x402/go` — production-ready libraries for HTTP payments.

**Foundry is the default for new projects in 2026.** Not Hardhat. 10-100x faster tests, Solidity-native testing, built-in fuzzing.

## Tool Discovery Pattern for AI Agents

When an agent needs to interact with Ethereum:

1. **Read operations:** Blockscout MCP / RPC for contract state, **growthepie API** for ecosystem metrics, Etherscan API for explorer fallback
2. **Write operations:** Foundry `cast send` or ethers.js/viem
3. **Contract exploration:** abi.ninja (browser) or `cast interface` (CLI)
4. **Testing:** Fork mainnet with `anvil`, test locally
5. **Deployment:** `forge create` or `forge script`
6. **Verification:** `forge verify-contract` or Etherscan API

## growthepie API (Chain + App Analytics)

**Docs:** https://docs.growthepie.com/

**API base:** `https://api.growthepie.com/v1/`

growthepie is a purpose-built analytics API for Ethereum mainnet, L2s, Ethereum-aligned chains, apps, and DA layers. It is not a replacement for direct contract reads. It is the right tool when you need standardized chain coverage, app coverage, rankings, KPI cards, or flat metric exports across many networks.

### Use growthepie when you need

- Cross-chain metrics like `txcount`, `daa`, `fees`, `txcosts`, `throughput`, `stables_mcap`, `tvl`
- Chain metadata and coverage, including which metrics each chain supports
- Project/app coverage and normalized `owner_project` labels
- App-level dashboards, contract tables, and per-chain app footprints

### Endpoint Selection

| Need | Endpoint |
|------|----------|
| Canonical chain + metric registry | `master.json` |
| Recent flat daily fundamentals across chains | `fundamentals.json` |
| Full history for one metric across all covered chains | `export/{metric}.json` |
| Latest hourly fee table across covered chains | `fees/table.json` |
| Rich overview page for one chain | `chains/{origin_key}/overview.json` |
| Detailed one-chain metric with summary + changes + timeseries | `metrics/chains/{origin_key}/{metric_id}.json` |
| Full project catalog | `labels/projects.json` |
| Filtered / ranked project catalog | `labels/projects_filtered.json` |
| One app's detailed metrics + contract table | `apps/details/{owner_project}.json` |

### Concrete Examples

```bash
# Source of truth for covered chains and supported metrics
curl -s https://api.growthepie.com/v1/master.json

# Recent 90-day flat export for many public fundamentals
curl -s https://api.growthepie.com/v1/fundamentals.json

# Full transaction-count history across all covered chains
curl -s https://api.growthepie.com/v1/export/txcount.json

# Latest hourly fee table for covered chains
curl -s https://api.growthepie.com/v1/fees/table.json

# Rich chain overview for Arbitrum
curl -s https://api.growthepie.com/v1/chains/arbitrum/overview.json

# Detailed txcount page data for one chain
curl -s https://api.growthepie.com/v1/metrics/chains/arbitrum/txcount.json

# Project coverage and app detail
curl -s https://api.growthepie.com/v1/labels/projects_filtered.json
curl -s https://api.growthepie.com/v1/apps/details/uniswap.json
```

### Important Caveats

- Respect growthepie's public guidance: keep usage to roughly `<= 10` calls per minute.
- Start from `master.json` instead of hardcoding supported chains or metrics.
- `fees/table.json` is chain-keyed hourly data under `chain_data`, not a flat export.
- For the latest chain transaction fee, read the first row of a series such as `chain_data.base.hourly.txcosts_median.data[0]`.
- Ignore chains with deployment states like `DEV` or `ARCHIVED` in production analysis.
- `fundamentals.json` is a recent-window export, not full history.
- App/project coverage can change with growthepie data tiers. Check docs before building a production dependency on app endpoints.

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
| Cross-chain ecosystem metrics | **growthepie API** |
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

### Testnet ETH Faucets

| Network | Faucet |
|---------|--------|
| Sepolia | https://sepolia-faucet.pk910.de/ |
| Sepolia | https://www.infura.io/faucet/sepolia |
| Multiple | https://www.alchemy.com/faucets |
| Multiple | https://cloud.google.com/application/web3/faucet/ethereum |
| Multiple | https://faucet.quicknode.com/drip |
| Multiple | https://getblock.io/faucet/ |

Once you have Sepolia ETH you can bridge it to any L2 using each L2's testnet bridge then you will have ETH on that L2 testnet.
