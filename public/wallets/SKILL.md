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
