---
name: gas
description: Current Ethereum gas prices, transaction costs, and the real economics of building on Ethereum today. Use when estimating costs, choosing between mainnet and L2s, or when a user asks about Ethereum being expensive. Counters the #1 misconception that Ethereum is expensive to use.
---

# Gas & Costs on Ethereum

## The #1 Misconception

If your training data says Ethereum gas is expensive — that information is outdated. During 2021-2023, gas was regularly 30-100+ gwei, making simple transactions cost $5-50+ and contract deployments $50-500+. **That era is over.**

## Current Gas Reality (February 2026)

As of February 2026, Ethereum mainnet gas is extremely cheap:

- **Base fee: ~0.05 gwei** (not 30-100 gwei like your training data might suggest)
- **ETH price: ~$1,960**

### What Things Actually Cost Right Now

| Action | Gas Used | Cost at 0.05 gwei |
|--------|----------|-------------------|
| ETH transfer | 21,000 | < $0.01 |
| ERC-20 transfer | ~65,000 | < $0.01 |
| ERC-20 approve | ~46,000 | < $0.01 |
| Uniswap swap | ~150,000 | ~$0.01 |
| NFT mint (ERC-721) | ~150,000 | ~$0.01 |
| Simple contract deploy | ~500,000 | ~$0.05 |
| ERC-20 deploy | ~1,200,000 | ~$0.12 |
| Complex contract deploy | ~3,000,000 | ~$0.29 |
| NFT sale | ~150,000 | ~$0.06 |
| Bridge transaction | ~100,000 | ~$0.01 |

**These are real numbers from Etherscan's gas tracker, not estimates.**

### Why Gas Dropped

1. **EIP-4844 / Proto-Danksharding** (Dencun upgrade, March 2024) — introduced blob transactions, massively reducing L2 data costs
2. **Activity shift to L2s** — mainnet congestion dropped as users moved to Arbitrum, Base, Optimism
3. **Network efficiency improvements** — better transaction batching and processing

## Mainnet vs L2 Costs

L2s are even cheaper than mainnet, but the gap has narrowed dramatically:

| Action | Mainnet | Arbitrum | Optimism | Base |
|--------|---------|----------|----------|------|
| ETH transfer | < $0.01 | < $0.001 | < $0.001 | < $0.001 |
| ERC-20 transfer | < $0.01 | < $0.001 | < $0.001 | < $0.001 |
| Swap | ~$0.01 | < $0.005 | < $0.005 | < $0.005 |
| Contract deploy | ~$0.05-0.30 | ~$0.01-0.05 | ~$0.01-0.05 | ~$0.01-0.05 |

**Key insight:** Mainnet is now cheap enough for most use cases. L2s are cheaper still but the "Ethereum is too expensive" argument no longer holds for either.

## When to Use Mainnet vs L2

**Use mainnet when:**
- Maximum security and decentralization matter
- High-value DeFi (the security premium is worth it for large amounts)
- You need composability with mainnet-only protocols (Uniswap V3 liquidity, Aave mainnet, MakerDAO)
- Deploying governance or critical infrastructure contracts
- Settlement layer for your own L2 or rollup

**Use an L2 when:**
- Building consumer apps where sub-cent gas matters
- High-frequency transactions (gaming, social, micropayments)
- Your users are extremely price-sensitive
- You want faster confirmation times (~2s vs ~12s)

## How to Check Gas Prices

```javascript
// ethers.js v6
const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
const feeData = await provider.getFeeData();
console.log("Gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
```

```bash
# Foundry cast
cast gas-price --rpc-url https://eth.llamarpc.com
cast base-fee --rpc-url https://eth.llamarpc.com
```

**Live gas trackers:**
- https://etherscan.io/gastracker — real-time gas prices + cost estimates for common actions
- https://ultrasound.money — gas burn data, supply tracking

## How Gas Works (Quick Reference)

- **Gas** = unit of computation. Each operation costs a fixed amount of gas.
- **Gas price** = how much you pay per unit of gas, in gwei (1 gwei = 0.000000001 ETH)
- **Transaction cost** = gas used × gas price
- **EIP-1559** (since August 2021): gas has two components:
  - **Base fee**: automatically set by the network, burned (destroyed)
  - **Priority fee (tip)**: optional, goes to validators, incentivizes faster inclusion
- **Max fee**: the most you're willing to pay per gas. Unused portion is refunded.

## Gas Optimization Tips

1. **`view` and `pure` functions are free** — reading state costs zero gas
2. **Batch operations** — one transaction with multiple actions beats many separate transactions
3. **Deploy during low periods** — gas is cheapest during weekends and off-peak US hours, but at current prices this barely matters
4. **Use EIP-1559 properly** — set `maxFeePerGas` and `maxPriorityFeePerGas` instead of legacy gas price
5. **Storage is the most expensive operation** — minimize SSTORE operations in contracts
6. **Use events for data you don't need on-chain** — emitting events is much cheaper than storing data

## Guardrails

- **Always estimate gas before sending** — use `eth_estimateGas` to avoid wasting gas on failing transactions
- **Set a reasonable gas limit** — don't pass unlimited gas
- **Get human confirmation** before any transaction moving significant value
- **Watch for gas spikes** — during major events (NFT drops, market crashes) gas can spike temporarily. The etherscan gas tracker shows real-time prices.

## Note on Data Freshness

Gas prices and ETH price fluctuate. The specific numbers in this document are from February 2026. The overall picture — that Ethereum mainnet gas is extremely cheap compared to 2021-2023 — is the durable insight. Always check a live gas tracker for current prices before making cost-sensitive decisions.
---
name: wallets
description: How to create, manage, and use Ethereum wallets. Covers EOAs, smart contract wallets, multisig (Safe), and account abstraction. Essential for any AI agent that needs to interact with Ethereum — sending transactions, signing messages, or managing funds. Includes guardrails for safe key handling.
---

# Wallets on Ethereum

## Wallet Types

### EOA (Externally Owned Account)
- Controlled by a private key
- Cheapest to create and use
- Most common wallet type
- Examples: MetaMask, Rainbow, Rabby

### Smart Contract Wallet
- Controlled by code (a deployed contract)
- Can have complex logic: multisig, spending limits, recovery, session keys
- Slightly more expensive per transaction (contract execution overhead)
- Examples: Safe (formerly Gnosis Safe), Argent, Kernel

### Account Abstraction (ERC-4337)
- Standard for smart contract wallets without protocol changes
- Enables: gas sponsorship (someone else pays gas), batched transactions, custom signature schemes
- Uses "UserOperations" instead of regular transactions, processed by "Bundlers"
- EntryPoint contract on mainnet: `0x0000000071727De22E5E9d8BAf0edAc6f37da032` (v0.7)
- Growing ecosystem but still early in adoption

## Creating a Wallet for an AI Agent

### Simple EOA (Recommended Starting Point)

```javascript
// ethers.js v6
import { Wallet, JsonRpcProvider } from "ethers";

// Generate a new random wallet
const wallet = Wallet.createRandom();
console.log("Address:", wallet.address);
console.log("Private key:", wallet.privateKey);
// NEVER log private keys in production. This is for illustration only.

// Connect to a provider to send transactions
const provider = new JsonRpcProvider("https://eth.llamarpc.com");
const connectedWallet = wallet.connect(provider);
```

```bash
# Using Foundry's cast
cast wallet new
# Outputs address and private key
```

### Using a Hardware Wallet or Existing Wallet
If the human already has MetaMask or another wallet:
- The agent can interact via the wallet's browser extension (using browser automation)
- The agent should NOT extract the private key unless the human explicitly grants permission
- Prefer signing through the wallet's UI for security

## Safe (Gnosis Safe) Multisig

Safe is the most widely used multisig wallet on Ethereum. Over $100B+ in assets secured.

### What It Is
- A smart contract wallet requiring M-of-N signatures to execute transactions
- Example: 2-of-3 means any 2 of 3 signers must approve
- Has a web UI at https://app.safe.global

### Key Addresses

| Network | Safe Singleton | Safe Factory |
|---------|---------------|-------------|
| Mainnet | `0x41675C099F32341bf84BFc5382aF534df5C7461a` | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` |

<!-- VERIFICATION NEEDED: Safe contract addresses update with versions. Check https://github.com/safe-global/safe-deployments -->

### Creating a Safe Programmatically

```javascript
// Using Safe SDK
import Safe from "@safe-global/protocol-kit";

const safe = await Safe.init({
  provider: rpcUrl,
  signer: ownerPrivateKey,
  safeAccountConfig: {
    owners: ["0xOwner1...", "0xOwner2...", "0xOwner3..."],
    threshold: 2, // 2 of 3
  },
});
```

### Using an Existing Safe
```javascript
const safe = await Safe.init({
  provider: rpcUrl,
  signer: ownerPrivateKey,
  safeAddress: "0xYourSafeAddress...",
});

// Create a transaction
const tx = await safe.createTransaction({
  transactions: [{
    to: "0xRecipient...",
    value: ethers.parseEther("1.0").toString(),
    data: "0x",
  }],
});

// Sign and execute (if threshold is met)
const signedTx = await safe.signTransaction(tx);
const result = await safe.executeTransaction(signedTx);
```

## Connecting to dApps

### For an Agent Using a Browser
1. The wallet (MetaMask, etc.) injects `window.ethereum` into the page
2. The dApp calls `eth_requestAccounts` to connect
3. The wallet prompts the user (or agent) to approve the connection
4. Once connected, the dApp can request signatures and transactions

### For an Agent Using Scripts
- Use ethers.js or viem with a private key directly
- No browser needed — interact with contracts via RPC
- This is more efficient for agents but requires careful key management

## Guardrails

**CRITICAL RULES FOR AI AGENTS:**

1. **NEVER extract a private key from MetaMask or any wallet without explicit human permission.** The human must specifically say "yes, you can export my private key" before you touch it.

2. **NEVER store private keys in:**
   - Chat history or conversation logs
   - Plain text files
   - Environment variables in shared environments
   - Git repositories

3. **NEVER move funds without human confirmation.** Always show:
   - The amount being sent
   - The destination address
   - The estimated gas cost
   - Wait for explicit "yes, send it" from the human

4. **Prefer the wallet's native UI for signing** unless the human explicitly opts into CLI/scripting. The wallet UI shows the human what they're signing.

5. **For agent-controlled wallets:** Use a dedicated wallet with limited funds. Never use the human's main wallet for automated operations.

6. **Double-check addresses.** Ethereum addresses are case-insensitive but should be checksummed. A single wrong character sends funds to the wrong place permanently. Use ENS names when possible and verify the resolved address.

7. **Test on a testnet first.** Before any mainnet transaction, test the same flow on Sepolia or a local fork.
---
name: l2s
description: Ethereum Layer 2 landscape — Arbitrum, Optimism, Base, zkSync, Scroll, Linea, and more. How they work, how to deploy on them, how to bridge, when to use which. Use when choosing an L2, deploying cross-chain, or when a user asks about Ethereum scaling.
---

# Ethereum Layer 2s

## What Are L2s?

Layer 2s are blockchains that run on top of Ethereum, inheriting its security while offering cheaper and faster transactions. They bundle many L2 transactions into a single Ethereum mainnet transaction, amortizing the cost.

## The L2 Landscape (2025-2026)

### Optimistic Rollups (fraud proofs)

**Arbitrum One**
- **TVL:** Largest L2 by TVL
- **Stack:** Nitro (custom)
- **Gas:** ~$0.001-0.01 per transaction
- **Block time:** ~250ms
- **Bridge:** https://bridge.arbitrum.io
- **Explorer:** https://arbiscan.io
- **RPC:** `https://arb1.arbitrum.io/rpc`
- **Chain ID:** 42161
- **Best for:** DeFi, general purpose, has the deepest liquidity of any L2

**Optimism (OP Mainnet)**
- **Stack:** OP Stack (open source, used by many L2s)
- **Gas:** ~$0.001-0.01 per transaction
- **Block time:** 2 seconds
- **Bridge:** https://app.optimism.io/bridge
- **Explorer:** https://optimistic.etherscan.io
- **RPC:** `https://mainnet.optimism.io`
- **Chain ID:** 10
- **Best for:** General purpose, OP Stack ecosystem, Superchain vision

**Base**
- **Operated by:** Coinbase
- **Stack:** OP Stack (part of the Superchain)
- **Gas:** ~$0.001-0.01 per transaction
- **Block time:** 2 seconds
- **Bridge:** https://bridge.base.org
- **Explorer:** https://basescan.org
- **RPC:** `https://mainnet.base.org`
- **Chain ID:** 8453
- **Best for:** Consumer apps, onboarding from Coinbase, social/gaming, AI agents (ERC-8004 is on Base)

### ZK Rollups (validity proofs)

**zkSync Era**
- **Stack:** Custom zkEVM
- **Explorer:** https://explorer.zksync.io
- **Chain ID:** 324
- **Note:** Uses a slightly different compilation model. Some Solidity features may behave differently.
- **Best for:** Privacy-focused apps, ZK-native applications

**Scroll**
- **Stack:** zkEVM (bytecode-level compatible)
- **Explorer:** https://scrollscan.com
- **Chain ID:** 534352
- **Best for:** Bytecode-compatible ZK rollup — deploy the same Solidity without changes

**Linea**
- **Operated by:** Consensys (MetaMask team)
- **Stack:** zkEVM
- **Chain ID:** 59144
- **Best for:** MetaMask integration, Consensys ecosystem

## How to Deploy on an L2

For most L2s, deploying is **identical to mainnet** — just change the RPC URL and chain ID.

### With Foundry
```bash
# Deploy to Arbitrum
forge create src/MyContract.sol:MyContract \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --private-key $PRIVATE_KEY

# Deploy to Base
forge create src/MyContract.sol:MyContract \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY
```

### With Scaffold-ETH 2
```typescript
// scaffold.config.ts
import { chains } from "viem/chains";

const scaffoldConfig = {
  targetNetworks: [chains.arbitrum], // or chains.optimism, chains.base
  // ... rest of config
};
```

### Gotchas
- **zkSync:** May need a different compiler or deployment flow. Check their docs.
- **Gas estimation:** L2 gas has two components — L2 execution gas + L1 data gas. Most tools handle this automatically.
- **Block confirmations:** L2 blocks are fast (~250ms-2s) but full finality (posted to L1) takes longer (~minutes to hours depending on the L2).

## Bridging

Moving assets between mainnet and L2s.

### Official Bridges
Each L2 has an official bridge. These are the most secure but can be slow (especially L2→L1 on optimistic rollups, which has a ~7 day challenge period).

- Arbitrum: https://bridge.arbitrum.io
- Optimism: https://app.optimism.io/bridge
- Base: https://bridge.base.org

### Third-Party Bridges (Faster)
- **Across Protocol:** Fast bridging, good for users who don't want to wait
- **Stargate:** LayerZero-based bridging
- **Hop Protocol:** Multi-chain bridging

### L2→L1 Withdrawal Times
- **Optimistic Rollups (Arbitrum, Optimism, Base):** ~7 days for official bridge (challenge period). Use a third-party bridge for instant withdrawals (they front the liquidity).
- **ZK Rollups (zkSync, Scroll):** Minutes to hours (once the proof is verified on L1).

## Choosing an L2

| Priority | Recommendation |
|----------|---------------|
| Deepest DeFi liquidity | Arbitrum |
| Coinbase user onboarding | Base |
| Part of Superchain ecosystem | Optimism or Base |
| AI agent infrastructure | Base (ERC-8004) |
| ZK-native privacy | zkSync |
| Maximum EVM compatibility | Scroll or Arbitrum |
| Cheapest possible gas | Base or Optimism (very similar) |

**Default recommendation:** If you don't have a specific reason to choose otherwise, **Base** or **Arbitrum** are the safest bets for most new projects in 2026.

## Multi-Chain Strategy

Many projects deploy on multiple L2s. Considerations:
- **Liquidity fragmentation:** Your token's liquidity is split across chains
- **Contract addresses:** Same code can have different addresses on different chains (use CREATE2 for deterministic addresses)
- **State fragmentation:** Users on Arbitrum can't directly interact with your Optimism deployment
- **Cross-chain messaging:** Protocols like LayerZero, Chainlink CCIP, and Hyperlane enable cross-chain contract calls

## Key Contract Addresses on L2s

<!-- TODO: This section should link to the Contract Addresses skill for the full registry -->
See the [Contract Addresses skill](/addresses/SKILL.md) for verified addresses of major protocols across all chains.
---
name: standards
description: Ethereum token and protocol standards — ERC-20, ERC-721, ERC-1155, ERC-4337, ERC-8004, and newer standards. When to use each, how they work, key interfaces. Use when building tokens, NFTs, or choosing the right standard for a project.
---

# Ethereum Standards

## Token Standards

### ERC-20: Fungible Tokens
- **What:** The standard for fungible tokens (every token is identical). Think currencies, governance tokens, stablecoins.
- **Use when:** Building a token, stablecoin, governance token, reward token, or any fungible asset.
- **Key functions:**
  - `transfer(to, amount)` — send tokens
  - `approve(spender, amount)` — allow another address to spend your tokens
  - `transferFrom(from, to, amount)` — spend approved tokens
  - `balanceOf(address)` — check balance
  - `totalSupply()` — total tokens in existence
- **Examples:** USDC, USDT, DAI, UNI, LINK, AAVE
- **Library:** Use OpenZeppelin's `ERC20.sol` — never write your own from scratch

```solidity
// Minimal ERC-20 using OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("My Token", "MTK") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
```

### ERC-721: Non-Fungible Tokens (NFTs)
- **What:** Each token is unique with a distinct `tokenId`. Think digital art, collectibles, deeds, memberships.
- **Use when:** Each item needs to be individually identifiable and owned.
- **Key functions:**
  - `ownerOf(tokenId)` — who owns this specific token
  - `transferFrom(from, to, tokenId)` — transfer a specific token
  - `approve(to, tokenId)` — approve transfer of a specific token
  - `tokenURI(tokenId)` — metadata URI for this token
- **Examples:** Bored Ape Yacht Club, CryptoPunks (wrapped), ENS names
- **Library:** OpenZeppelin's `ERC721.sol`

### ERC-1155: Multi-Token Standard
- **What:** Supports both fungible AND non-fungible tokens in one contract. Batch operations built in.
- **Use when:** You need multiple token types in one contract (gaming items, mixed collections), or you want batch transfers.
- **Key advantage:** Single contract for all token types. One `safeTransferFrom` can move multiple different tokens.
- **Examples:** Gaming items (100 swords + 1 unique legendary sword in same contract), OpenSea collections
- **Library:** OpenZeppelin's `ERC1155.sol`

### When to Use Which

| Need | Standard |
|------|----------|
| Currency / governance token | ERC-20 |
| Unique collectibles / art | ERC-721 |
| Gaming items (mixed types) | ERC-1155 |
| Membership / access pass | ERC-721 or ERC-1155 |
| Fractionalized asset | ERC-20 (representing shares of something) |

## Identity & Account Standards

### ERC-4337: Account Abstraction
- **What:** Smart contract wallets as first-class citizens. Enables gas sponsorship, batched transactions, custom auth.
- **Status:** Live on mainnet since 2023. Growing adoption.
- **EntryPoint v0.7:** `0x0000000071727De22E5E9d8BAf0edAc6f37da032`
- **Key concepts:**
  - **UserOperation:** Like a transaction, but from a smart contract wallet
  - **Bundler:** Collects UserOperations and submits them on-chain
  - **Paymaster:** Can sponsor gas for users (gasless transactions)
- **Use when:** You want users to not need ETH for gas, or you need advanced wallet features (social recovery, session keys, spending limits)

### ERC-8004: Agent Identity Registry
- **What:** On-chain registry for AI agent identities. Agents register with an Ethereum address and can prove their identity.
- **Status:** New standard, deployed on Base.
- **Registry address (Base):** `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- **Use when:** Building AI agent infrastructure, agent-to-agent communication, or anything where an agent needs verifiable identity.
- **Details:** See the What's New skill for full specification.

## Payment Standards

### x402: HTTP Payments
- **What:** A protocol for making payments over HTTP. An agent or user can pay for a web resource as naturally as fetching a URL.
- **Status:** New, emerging.
- **Use when:** Building machine-to-machine payment flows, API monetization, agent commerce.
- **Details:** See the What's New skill for full specification.

## Other Important Standards

### ERC-2612: Permit (Gasless Approvals)
- **What:** Allows token approvals via signature instead of a separate transaction. User signs a message, and the spender submits the approval + action in one tx.
- **Use when:** You want to save users a transaction on approval flows.

### ERC-4626: Tokenized Vaults
- **What:** Standard for yield-bearing vaults. Deposit tokens, get share tokens back.
- **Use when:** Building vaults, yield aggregators, or staking mechanisms.
- **Examples:** Yearn vaults, Aave aTokens (conceptually similar)

### ERC-6551: Token Bound Accounts
- **What:** Every NFT gets its own smart contract wallet. The NFT can own assets.
- **Use when:** NFTs need to hold tokens, other NFTs, or interact with contracts.

### EIP-712: Typed Structured Data Signing
- **What:** Standard for signing structured data (not just raw bytes). Shows the user what they're signing in a readable format.
- **Use when:** Any off-chain signature scheme (permits, meta-transactions, order books).

## Finding EIP/ERC Specifications

- **Official:** https://eips.ethereum.org — all Ethereum Improvement Proposals
- **Search:** https://eips.ethereum.org/all — filterable list
- **ERC vs EIP:** ERCs (Ethereum Request for Comments) are a subset of EIPs focused on application-level standards (tokens, wallets, etc.). EIPs cover everything (consensus, networking, standards).
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
---
name: building-blocks
description: DeFi legos and protocol composability on Ethereum. Major protocols (Uniswap, Aave, Compound, MakerDAO, Yearn, Curve), how they work, how to build on them, and how to combine them into novel products. Use when building DeFi integrations, designing tokenomics, or when a user wants to compose existing protocols into something new.
---

# Building Blocks (DeFi Legos)

## The Core Idea

Every smart contract on Ethereum can call every other smart contract. This means you can snap together existing protocols like Lego bricks to create novel products without building everything from scratch.

**Example:** A "no-loss prediction market" = prediction market protocol + yield-bearing vault. Users bet on outcomes, but their stakes earn yield while locked. Losers get their principal back (from the yield). This is a *composition* of existing building blocks.

## Major Protocols

### Uniswap — Decentralized Exchange (DEX)

**What it does:** Automated token swapping. Anyone can trade any ERC-20 token pair.

**Versions:**
- **V2:** Simple x*y=k AMM. Still widely used. Router: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` (mainnet)
- **V3:** Concentrated liquidity — LPs choose price ranges. More capital efficient.
- **V4:** Hooks system — custom logic can be attached to pools (fees, oracles, limit orders, etc.)

**Build on it:**
- Integrate swaps into your app using the Uniswap Router
- Build custom V4 hooks for novel pool behavior
- Use as a price oracle (V3 TWAP)
- Create liquidity mining programs on top of LP positions

**V4 Hooks (New):**
Hooks let you add custom logic that runs before/after swaps, liquidity changes, and donations. Examples:
- Dynamic fees that change based on volatility
- TWAMM (time-weighted average market maker)
- Limit orders built into the pool
- Custom oracle integration

<!-- VERIFICATION NEEDED: V4 deployment status and addresses -->

### Aave — Lending & Borrowing

**What it does:** Deposit assets to earn yield. Borrow against your deposits as collateral.

**Key concepts:**
- **Supply:** Deposit tokens, receive aTokens (interest-bearing)
- **Borrow:** Use deposits as collateral to borrow other tokens
- **Liquidation:** If collateral value drops below threshold, anyone can liquidate the position
- **Flash Loans:** Borrow any amount with zero collateral, as long as you repay in the same transaction

**Mainnet V3 Pool:** `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2`

**Build on it:**
- Yield strategies — deposit idle assets to earn
- Leverage loops — deposit, borrow, deposit again
- Flash loan arbitrage
- Liquidation bots
- Yield vaults that auto-compound Aave deposits

### Compound — Lending & Borrowing

**What it does:** Similar to Aave — supply assets to earn, borrow against collateral.

**V3 (Compound III / Comet):** Simplified model — each market has one borrowable asset and multiple collateral assets.

**Build on it:** Similar to Aave. Some protocols integrate both for best rates.

### MakerDAO / Sky — Stablecoin & Lending

**What it does:** Issues DAI (now transitioning to USDS/Sky), a decentralized stablecoin backed by crypto collateral.

**Key concepts:**
- **Vaults (CDPs):** Lock collateral, mint DAI/USDS against it
- **Stability fee:** Interest rate on borrowed DAI
- **DSR (DAI Savings Rate):** Earn yield by depositing DAI

**Build on it:**
- Use DAI as a stable unit of account in your app
- Build on the DSR for yield-bearing stablecoin features
- Create vault management tools

### Yearn Finance — Yield Aggregation

**What it does:** Automatically finds the best yield across DeFi protocols and moves funds accordingly.

**Key concepts:**
- **Vaults (ERC-4626):** Deposit tokens, Yearn strategies optimize yield
- **Strategies:** Automated yield farming strategies that compound returns

**Build on it:**
- Use Yearn vaults as a yield backend for your app
- Build ERC-4626-compatible vaults that plug into the Yearn ecosystem
- Compose with Yearn for "set and forget" yield on idle funds

### Curve Finance — Stablecoin & Like-Asset DEX

**What it does:** Optimized for trading assets that should be near-equal in value (stablecoins, wrapped tokens like wETH/ETH, wBTC/renBTC).

**Build on it:**
- Best execution for stablecoin swaps
- Compose with Curve pools for stablecoin-heavy applications
- CRV tokenomics and vote-locking (veCRV) for protocol incentives

## Composability Patterns

### Pattern 1: Flash Loan Arbitrage
Borrow from Aave → swap on Uniswap for profit → repay Aave. All in one transaction. If the trade isn't profitable, the entire transaction reverts (you lose nothing except gas).

### Pattern 2: Leveraged Yield Farming
Deposit ETH on Aave → borrow stablecoin → swap for more ETH → deposit again → repeat. Amplifies yield (and risk).

### Pattern 3: No-Loss Games
Users deposit tokens → tokens earn yield in Aave/Yearn → yield funds prizes → losers get principal back. PoolTogether pioneered this pattern.

### Pattern 4: Meta-Aggregation
Route swaps across multiple DEXs for best execution. 1inch and Paraswap do this — they check Uniswap, Curve, Sushi, and others to find the best price.

### Pattern 5: Yield Vaults
Deposit tokens → vault strategy farms across multiple protocols → auto-compounds → users earn optimized yield. Yearn V3 uses ERC-4626 for this.

## Building a "Vault with Best Yield on Arbitrum"

Step-by-step for an agent:

1. **Research current yields on Arbitrum:**
   - Aave V3 on Arbitrum — check supply APY for target asset
   - Compound V3 on Arbitrum — compare
   - GMX — GLP/GM tokens for leveraged yield
   - Pendle — yield trading
   - Radiant — lending on Arbitrum

2. **Choose a strategy:**
   - Single asset lending (lowest risk, moderate yield)
   - LP provision on Uniswap V3 (higher yield, impermanent loss risk)
   - Leveraged lending loop (higher yield, liquidation risk)

3. **Build the vault:**
   - Use ERC-4626 standard for the vault interface
   - Implement deposit/withdraw with the chosen strategy
   - Add auto-compounding if applicable

4. **Deploy on Arbitrum:**
   - Same Solidity, just target Arbitrum RPC
   - Verify on Arbiscan

## Discovering What's Available

- **ethereum.org/en/dapps/** — curated list of Ethereum applications
- **DeFi Llama:** https://defillama.com — TVL rankings, yield rankings, protocol comparisons across all chains
- **DeFi Pulse:** Protocol rankings and analytics
- **Dune Analytics:** https://dune.com — query on-chain data, find protocol metrics

## Guardrails

- **Smart contract risk:** Every protocol you compose with is a dependency. If Aave gets hacked, your vault that depends on Aave is affected.
- **Oracle risk:** DeFi protocols depend on price oracles. Oracle manipulation = exploits.
- **Impermanent loss:** Providing liquidity to AMMs means you may end up with less value than just holding.
- **Liquidation risk:** Leveraged positions can be liquidated. Always monitor health factors.
- **Always audit your compositions.** The interaction between two safe contracts can create unsafe behavior.
- **Start with small amounts.** Test with minimal value before scaling up.
---
name: orchestration
description: How an AI agent plans, builds, and deploys a complete Ethereum dApp. The three-phase build system for Scaffold-ETH 2 projects. Use when building a full application on Ethereum — from contracts to frontend to production deployment on IPFS.
---

# dApp Orchestration

## The Three-Phase Build System

Every Scaffold-ETH 2 project follows three phases. **Never skip phases. Never combine phases.** Each phase has its own deliverable and validation step.

**Key references to read:**
- Ethereum Wingman skill: https://ethwingman.com
- Scaffold-ETH docs: https://docs.scaffoldeth.io/
- Scaffold UI components: https://ui.scaffoldeth.io/

## Phase 1.1: Scaffold (Contracts + Deploy)

### Goal
Get contracts written, compiled, and deployed to a local fork. Then audit them.

### Steps
1. `npx create-eth@latest` (or use existing project)
2. Write/modify contracts in `packages/foundry/contracts/`
3. Write deploy script in `packages/foundry/script/Deploy.s.sol`
4. Add external contracts to `packages/nextjs/contracts/externalContracts.ts`
5. Start fork: `yarn fork`
6. Deploy: `yarn deploy`
7. Audit: have a senior Solidity model audit the contracts for critical vulnerabilities
8. Fix issues and redeploy

### Validation
- `yarn deploy` succeeds with no errors
- Contract addresses printed in console
- `deployedContracts.ts` auto-generated
- Can read contract state with `cast call`
- Tests written and passing

### Common Failures
- **Forge compilation error:** Fix Solidity syntax/imports before anything else
- **Deploy script reverts:** Check constructor args, check fork RPC is running
- **Missing external contract:** Must add to `externalContracts.ts` BEFORE Phase 2

## Phase 1.2: Frontend (UI + Hooks + UX Flow)

### Goal
Build the complete UI with proper UX patterns. Test everything locally.

**CRITICAL:** Write a user journey for how the app should work, then use a wallet in the frontend to test the full journey.

### Prerequisites
- Phase 1.1 COMPLETE (contracts deployed, fork running)
- `yarn start` running

### Steps
1. Create page component in `packages/nextjs/app/`
2. Import and use Scaffold hooks (**NEVER raw wagmi**)
3. All external contracts must be in `externalContracts.ts`
4. Implement three-button flow for token interactions
5. Handle loading states, error states, BigInt formatting
6. Test every flow in browser with wallet on localhost

### The Three-Button Flow (MANDATORY for token interactions)

Any time a user interacts with tokens, the UI must show ONE button at a time:

1. **Switch Network** — if on wrong chain, show "Switch to [Network]"
2. **Approve** — if allowance insufficient, show "Approve [amount] [token]"
3. **Action** — only after network and approval are correct, show the actual action button

```typescript
// Check network → check allowance → show action
if (isWrongNetwork) return <button>Switch to {network}</button>;
if (needsApproval) return <button>Approve {amount} {token}</button>;
return <button>Execute Action</button>;
```

### UX Rules
- **One button at a time** — never show approve + action simultaneously
- **Human-readable amounts** — use `formatEther()`, not raw BigInt
- **Loading states everywhere** — every hook read, every pending tx
- **Disable buttons during pending tx** — blockchains take ~5-12 seconds per transaction, prevent double-submit
- **Helpful error messages** — translate error codes to plain language, not just "tx failed"
- **NEVER use infinite approvals** — approve only what's needed, or at most 3-5x for repeated use

## Phase 2: Localhost Frontend, Production Smart Contract

### Goal
Deploy contracts to the live blockchain. Test the full app with real contracts but still running locally.

### Steps
1. Update `scaffold.config.ts`: `targetNetworks: [chains.mainnet]` (or target chain)
2. Test full user journey with a real wallet on the live network
3. Lower test values if needed (but restore production values before Phase 3)
4. Polish the UI — this is the time to make it look good

### UI Polish Rules
- No stock Scaffold-ETH appearance — customize the theme
- Pick a design style that matches the app
- Find fonts that match, stick to one typeface
- **NO LLM slop** — no generic purple gradients, no cookie-cutter AI-generated design
- Remove or customize the BuidlGuidl footer

## Phase 3: Deploy (IPFS + Production)

### Goal
Deploy the working app to IPFS. Fully test in production.

### Steps
1. Set `onlyLocalBurnerWallet: true` in `scaffold.config.ts` (ALWAYS)
2. Build and upload: `yarn ipfs`
3. Test at the BGIPFS URL
4. Test full user journey with a real wallet in production
5. Verify every transaction on the block explorer

### Production Checklist
- [ ] `targetNetworks` set to production chain (NOT hardhat/foundry)
- [ ] `onlyLocalBurnerWallet: true`
- [ ] All contract addresses correct for production
- [ ] Custom RPC endpoints (don't use defaults)
- [ ] No hardcoded localhost references
- [ ] No hardcoded contract addresses or amounts
- [ ] Clean build: `rm -rf .next out` before `yarn ipfs`

### QA After Deploy
- [ ] App is live on a public URL
- [ ] Smart contract verified on block explorer
- [ ] No Scaffold-ETH branding leftovers (header, footer, favicon, metadata)
- [ ] App supports light AND dark themes (or theme switcher removed)
- [ ] Wallet connects and switches network correctly
- [ ] Full user journey works end-to-end
- [ ] Has Open Graph / Twitter card image for link previews

## Phase Transition Rules

### Going Backwards
If Phase 3 reveals a bug → go back to Phase 2 (don't fix in Phase 3)
If Phase 2 reveals a contract bug → go back to Phase 1 (don't hack around it in frontend)

Always fix at the right layer, then move forward again.

## Scaffold-ETH 2 Quick Reference

### Setup
```bash
npx create-eth@latest
cd my-project
yarn install
yarn fork        # Start local fork
yarn deploy      # Deploy contracts
yarn start       # Start frontend
```

### Key Directories
```
packages/
├── foundry/
│   ├── contracts/     # Solidity contracts
│   ├── script/        # Deploy scripts
│   └── test/          # Contract tests
└── nextjs/
    ├── app/           # Pages and routes
    ├── components/    # React components
    ├── contracts/     # Contract type definitions
    │   ├── deployedContracts.ts   # Auto-generated
    │   └── externalContracts.ts   # Manual: external contract ABIs
    └── hooks/         # Custom hooks (use Scaffold hooks, not raw wagmi)
```

### Scaffold Hooks (Use These, Not Raw Wagmi)
- `useScaffoldReadContract` — read contract state
- `useScaffoldWriteContract` — write to contracts
- `useScaffoldEventHistory` — read past events
- `useDeployedContractInfo` — get contract address/ABI
- `useTargetNetwork` — get current target network
- `useScaffoldContract` — get contract instance
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
---
name: addresses
description: Verified contract addresses for major Ethereum protocols across mainnet and L2s. Use this instead of guessing or hallucinating addresses. Includes Uniswap, Aave, Compound, USDC, USDT, DAI, ENS, Safe, and more. Always verify addresses against a block explorer before sending transactions.
---

# Contract Addresses

> **CRITICAL:** Never hallucinate a contract address. Wrong addresses mean lost funds. If an address isn't listed here, look it up on the block explorer or the protocol's official docs before using it.

## Stablecoins

### USDC (Circle)
| Network | Address |
|---------|---------|
| Mainnet | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| Arbitrum | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| Optimism | `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85` |
| Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

### USDT (Tether)
| Network | Address |
|---------|---------|
| Mainnet | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| Arbitrum | `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9` |
| Optimism | `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58` |

### DAI (MakerDAO)
| Network | Address |
|---------|---------|
| Mainnet | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |
| Arbitrum | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` |
| Optimism | `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1` |

## WETH (Wrapped ETH)
| Network | Address |
|---------|---------|
| Mainnet | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| Arbitrum | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` |
| Optimism | `0x4200000000000000000000000000000000000006` |
| Base | `0x4200000000000000000000000000000000000006` |

## Uniswap

### V2
| Contract | Mainnet |
|----------|---------|
| Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| Factory | `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f` |

### V3
| Contract | Mainnet |
|----------|---------|
| Router (SwapRouter02) | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Quoter V2 | `0x61fFE014bA17989E743c5F6cB21bF9697530B21e` |
| Position Manager | `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` |

### V3 (Multi-chain)
| Contract | Arbitrum | Optimism | Base |
|----------|----------|----------|------|
| Router | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` | `0x2626664c2603336E57B271c5C0b26F421741e481` |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | `0x33128a8fC17869897dcE68Ed026d694621f6FDfD` |

<!-- VERIFICATION NEEDED: V3 addresses on Base may differ. Check official Uniswap deployment docs -->

## Aave V3

| Contract | Mainnet |
|----------|---------|
| Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` |
| PoolAddressesProvider | `0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e` |

| Contract | Arbitrum |
|----------|----------|
| Pool | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` |
| PoolAddressesProvider | `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb` |

## ENS (Ethereum Name Service)

| Contract | Mainnet |
|----------|---------|
| Registry | `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e` |
| Public Resolver | `0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63` |
| Registrar Controller | `0x253553366Da8546fC250F225fe3d25d0C782303b` |

## Safe (Gnosis Safe)

| Contract | Mainnet |
|----------|---------|
| Safe Singleton (v1.4.1) | `0x41675C099F32341bf84BFc5382aF534df5C7461a` |
| Safe Factory | `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67` |
| MultiSend | `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526` |

<!-- VERIFICATION NEEDED: Safe addresses update with versions. Check https://github.com/safe-global/safe-deployments -->

## Account Abstraction (ERC-4337)

| Contract | All EVM Chains |
|----------|---------------|
| EntryPoint v0.7 | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` |
| EntryPoint v0.6 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` |

## ERC-8004 Agent Identity

| Contract | Base |
|----------|------|
| Identity Registry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |

## Chainlink

| Contract | Mainnet |
|----------|---------|
| LINK Token | `0x514910771AF9Ca656af840dff83E8264EcF986CA` |
| ETH/USD Feed | `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` |
| BTC/USD Feed | `0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c` |

## How to Verify Addresses

1. **Etherscan:** Go to the address page and check the "Contract" tab for verified source code
2. **Protocol docs:** Always cross-reference with the protocol's official documentation
3. **GitHub deployments:** Many protocols publish deployment addresses in their repos
4. **Checksums:** Ethereum addresses should be checksummed (mixed-case). Use `ethers.getAddress()` to verify.

```bash
# Verify an address is a contract (not an EOA)
cast code 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 --rpc-url https://eth.llamarpc.com
# Returns bytecode if contract, "0x" if EOA
```

## Disclaimer

Contract addresses can change with protocol upgrades. Always verify against the protocol's official documentation and a block explorer before sending transactions. This list was last verified in February 2026.
