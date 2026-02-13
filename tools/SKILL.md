---
name: tools
description: Current Ethereum development tools, frameworks, libraries, RPCs, and block explorers. What actually works today for building on Ethereum. Includes tool discovery for AI agents — MCPs, abi.ninja, Foundry, Scaffold-ETH 2, Hardhat, and more. Use when setting up a dev environment, choosing tools, or when an agent needs to discover what's available.
---

# Ethereum Development Tools

## Frameworks

### Scaffold-ETH 2
- **What:** Full-stack Ethereum development toolkit. Solidity + Next.js + Foundry.
- **Best for:** Rapid prototyping, building full dApps with UI, deploying to IPFS
- **Setup:** `npx create-eth@latest`
- **Docs:** https://docs.scaffoldeth.io/
- **UI Components:** https://ui.scaffoldeth.io/
- **Key feature:** Auto-generates TypeScript types from your contracts. Scaffold hooks make contract interaction trivial.
- **Deploy:** `yarn ipfs` deploys to BuidlGuidl IPFS

### Foundry
- **What:** Blazing fast Solidity toolkit. Compile, test, deploy, interact — all from CLI.
- **Tools:** `forge` (build/test), `cast` (interact), `anvil` (local node), `chisel` (Solidity REPL)
- **Best for:** Contract development, testing, scripting, CI/CD
- **Install:** `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- **Docs:** https://book.getfoundry.sh/

### Hardhat
- **What:** Established JavaScript/TypeScript Ethereum development environment
- **Best for:** Teams coming from JavaScript, extensive plugin ecosystem
- **Setup:** `npx hardhat init`
- **Docs:** https://hardhat.org/docs
- **Note:** Foundry is generally preferred for new projects due to speed and Solidity-native testing, but Hardhat has a larger plugin ecosystem

## Libraries

### ethers.js (v6)
- **What:** The most widely used Ethereum JavaScript library
- **Install:** `npm install ethers`
- **Docs:** https://docs.ethers.org/v6/
- **Use for:** Wallet creation, contract interaction, transaction building, ENS resolution
```javascript
import { ethers } from "ethers";
const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
const balance = await provider.getBalance("vitalik.eth");
```

### viem
- **What:** Modern, lightweight alternative to ethers.js. TypeScript-first.
- **Install:** `npm install viem`
- **Docs:** https://viem.sh
- **Use for:** Same as ethers.js but with better TypeScript support and smaller bundle
```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
const client = createPublicClient({ chain: mainnet, transport: http() });
const balance = await client.getBalance({ address: "0x..." });
```

### wagmi
- **What:** React hooks for Ethereum. Built on viem.
- **Best for:** React frontends that need wallet connection and contract interaction
- **Docs:** https://wagmi.sh
- **Note:** Scaffold-ETH 2 wraps wagmi with its own hooks — use those instead of raw wagmi when using SE2

### OpenZeppelin Contracts
- **What:** Battle-tested smart contract library. ERC-20, ERC-721, access control, upgrades, etc.
- **Install:** `forge install OpenZeppelin/openzeppelin-contracts`
- **Docs:** https://docs.openzeppelin.com/contracts
- **Use for:** Don't write your own token contracts from scratch. Use OpenZeppelin.

## Interaction Tools

### abi.ninja
- **URL:** https://abi.ninja
- **What:** Interact with any verified smart contract directly in the browser. No code needed.
- **How:** Paste a contract address → it fetches the ABI from Etherscan → gives you a UI to call any function
- **Great for:** Quick contract exploration, testing, debugging. An agent can use this via browser to interact with contracts without writing scripts.

### Foundry cast
- **What:** CLI tool for interacting with Ethereum from the command line
- **Examples:**
```bash
# Read contract state
cast call 0xContractAddress "balanceOf(address)" 0xWalletAddress --rpc-url https://eth.llamarpc.com

# Send a transaction
cast send 0xContractAddress "transfer(address,uint256)" 0xRecipient 1000000000000000000 --private-key $PRIVATE_KEY --rpc-url https://eth.llamarpc.com

# Get current gas price
cast gas-price --rpc-url https://eth.llamarpc.com

# Decode calldata
cast 4byte-decode 0xa9059cbb...

# Get contract storage
cast storage 0xContractAddress 0 --rpc-url https://eth.llamarpc.com
```

## Block Explorers

### Etherscan
- **Mainnet:** https://etherscan.io
- **Sepolia testnet:** https://sepolia.etherscan.io
- **API:** https://api.etherscan.io (requires free API key)
- **What you can do:** View transactions, read/write contracts, verify source code, check token balances, view events/logs
- **For agents:** The Etherscan API is the best way to programmatically look up contract ABIs, transaction history, and token balances

### L2 Explorers
- **Arbitrum:** https://arbiscan.io
- **Optimism:** https://optimistic.etherscan.io
- **Base:** https://basescan.org
- **zkSync:** https://explorer.zksync.io

## RPC Providers

### Free / Public RPCs
- `https://eth.llamarpc.com` — LlamaNodes, free, no key needed
- `https://cloudflare-eth.com` — Cloudflare, free
- `https://rpc.ankr.com/eth` — Ankr, free tier

### Paid RPCs (More Reliable)
- **Alchemy:** https://alchemy.com — most popular, generous free tier
- **Infura:** https://infura.io — oldest provider, MetaMask default
- **QuickNode:** https://quicknode.com — fast, multi-chain

### Running Your Own
- **Geth + Lighthouse:** Full Ethereum node. Requires ~2TB SSD, good internet.
- **BuidlGuidl RPC:** Community-run RPCs at rpc.buidlguidl.com

## MCP Servers (for AI Agents)

MCP (Model Context Protocol) servers give AI agents structured access to Ethereum:
- **eth-mcp:** Ethereum MCP server for reading chain state, contract interaction
- **Block explorer MCPs:** Structured access to Etherscan data
- These are emerging tools — check for the latest implementations

## Testing Tools

### Local Forks
```bash
# Anvil (Foundry) — fork mainnet locally
anvil --fork-url https://eth.llamarpc.com

# This gives you a local copy of mainnet state
# You can test against real contracts with fake ETH
# Default RPC: http://localhost:8545
```

### Testnets
- **Sepolia:** Main Ethereum testnet. Get test ETH from faucets.
- **Faucets:** https://sepoliafaucet.com, https://faucet.sepolia.dev

## Choosing Your Stack

**For rapid prototyping / full dApps:**
→ Scaffold-ETH 2 (Foundry + Next.js + Scaffold hooks)

**For contract-focused development:**
→ Foundry (forge + cast + anvil)

**For JavaScript-heavy teams:**
→ Hardhat + ethers.js or viem

**For quick contract interaction (no code):**
→ abi.ninja (browser) or cast (CLI)

**For React frontends:**
→ wagmi + viem (or Scaffold-ETH 2 which wraps these)
