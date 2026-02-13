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
