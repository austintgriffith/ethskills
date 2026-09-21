---
name: tools
description: Current Ethereum development tools, frameworks, libraries, RPCs, and block explorers. What actually works today for building on Ethereum. Includes tool discovery for AI agents — MCPs, abi.ninja, Foundry, Scaffold-ETH 2, Hardhat, and more. Use when setting up a dev environment, choosing tools, or when an agent needs to discover what's available.
---

# Ethereum Development Tools

## What You Probably Got Wrong

**Blockscout MCP server exists:** https://mcp.blockscout.com/mcp — gives AI agents structured blockchain data via Model Context Protocol. This is cutting-edge infra as of Feb 2026.

**abi.ninja is essential:** https://abi.ninja — paste any verified contract address, get a UI to call any function. Zero setup. Supports mainnet + all major L2s. Perfect for agent-driven contract exploration.

**x402 has production SDKs:** `@x402/fetch` (TS), `x402` (Python), `github.com/coinbase/x402/go` — production-ready libraries for HTTP payments.

**Foundry and Hardhat 3 are both legitimate choices in 2026.** Foundry: faster, Solidity-native. Hardhat 3: TypeScript-first, mature plugin ecosystem.

**Token price data can be fetched directly from the RPC:** `eth-prices` (TS/Rust) routes Uniswap V2/V3, Chainlink, ERC-4626, and ECB quotes at a pinned block and prices any asset against any other, so the display currency is a parameter. No price-API key.

**Avatars and logos are not plain image URLs:** ENS `avatar` records are frequently `ipfs://`, `ar://`, or `eip155:` NFT pointers. `eth-avatars` (TS/Rust) resolves them to image bytes usable in `<img src>`, `eth-icons` (TS/Rust) does the same for token and network logos, and `blo` (TS) draws an identicon for any address.

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

## Prices: Fetch Price Data Directly From the RPC

The pools and feeds are already onchain, so price data can be read from the RPC you are already connected to — no key, no rate limit, and a number you can reproduce at a block.

**`eth-prices`** (TS/Rust) — https://github.com/v3xlabs/eth-prices

Routes over Uniswap V2/V3 pools, ERC-4626 vaults, Chainlink feeds, fixed pegs, and ECB fiat rates to quote any asset against any other at a pinned block. The display currency is a parameter, not a hardcoded USD. Its autorouter discovers pools and vaults when you do not know the addresses.

## Icons and Avatars

Neither token logos nor avatar hosting is part of any standard.

**`eth-icons`** (TS/Rust) — https://github.com/v3xlabs/eth-icons

Fetches network, native asset, and ERC-20 logos, returning every icon it finds so the caller can choose.

**`eth-avatars`** (TS/Rust) — https://github.com/v3xlabs/eth-avatars

Resolves `ipfs://`, `ar://`, `bzz://`, and `eip155:` avatar records — NFT metadata included — into image bytes.

**`blo`** (TS) — https://github.com/bpierre/blo

Deterministic identicon for any address, no network call.

## Choosing Your Stack (2026)

| Need | Tool |
|------|------|
| Rapid prototyping / full dApps | **Scaffold-ETH 2** |
| Contract-focused dev | **Foundry** (forge + cast + anvil) · or **Hardhat 3** if TypeScript-first |
| Quick contract interaction | **abi.ninja** (browser) or **cast** (CLI) |
| React frontends | **wagmi + viem** (or SE2 which wraps these) |
| Agent blockchain reads | **Blockscout MCP** |
| Agent payments | **x402 SDKs** |
| Token prices from RPC | **eth-prices** |
| Token and network icons | **eth-icons** |
| ENS avatar URI resolution | **eth-avatars** |
| Identicon for any address | **blo** |

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

- **Foundry became the default** over Hardhat for new projects — then Hardhat 3 (Aug 2025) shipped Solidity testing, fuzzing, and Rust internals, making it a legitimate choice again.
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
