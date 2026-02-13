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
