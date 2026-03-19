---
name: safety
description: DeFi safety checks for AI agents. LLMs approve transactions to honeypots, interact with malicious contracts, and skip basic safety verification. Aegis MCP server provides automated contract scanning, transaction simulation, token analysis, and risk assessment before any DeFi interaction. Use before swapping, approving, or interacting with any DeFi protocol.
---

# DeFi Safety for AI Agents

## What You Probably Got Wrong

**You will approve transactions to honeypot contracts.** Stock LLMs do not check whether a token contract allows selling, whether an approval target is a known scam, or whether a transaction will revert and drain gas. They see a swap request, build the calldata, and send it.

**"I checked the contract on Etherscan" is not a safety check.** Verified source code does not mean safe. Malicious contracts get verified. Proxy implementations get swapped. Approval targets get spoofed. You need runtime analysis, not source reading.

**Simulating a transaction is not optional.** If you build a swap or approval transaction without simulating it first, you are gambling with user funds. Simulation catches reverts, unexpected token transfers, approval hijacking, and sandwich-vulnerable slippage before anything hits the mempool.

**Token reputation matters.** Not every ERC-20 that returns `name()` and `symbol()` is legitimate. Honeypot tokens, fee-on-transfer traps, and rebasing tokens with malicious logic exist on every chain. Check before you interact.

## Aegis MCP Server

Aegis is an MCP server that gives AI agents DeFi safety tools. It runs contract scans, transaction simulations, token checks, and risk assessments before any onchain interaction.

**Quick start:**
```bash
claude mcp add aegis npx aegis-defi
```

Or run standalone:
```bash
npx aegis-defi
```

**Source:** [github.com/StanleytheGoat/aegis](https://github.com/StanleytheGoat/aegis)
**Docs:** [aegis-defi.netlify.app](https://aegis-defi.netlify.app)

## MCP Tools

### scan_contract

Scans a contract address for known exploit patterns, proxy risks, and red flags.

```
scan_contract({ address: "0x...", chain: "base" })
```

What it checks:
- Verified vs unverified source
- Proxy pattern detection (transparent, UUPS, custom)
- Owner privileges and centralization risks (mint, pause, blacklist)
- Known exploit signatures and bytecode patterns
- Whether the contract is a token, a router, or something else

Use this before approving any contract to spend tokens.

### simulate_transaction

Dry-runs a transaction and reports what would happen without broadcasting.

```
simulate_transaction({
  from: "0xYourWallet",
  to: "0xRouterOrContract",
  data: "0xCalldata",
  value: "0",
  chain: "base"
})
```

What it reports:
- Revert or success
- Token transfers (in and out, with USD values)
- Approval changes
- Gas estimate
- State changes to watched addresses

Use this on every swap, deposit, or approval before sending.

### check_token

Analyzes a token contract for honeypot behavior, fee-on-transfer mechanics, and liquidity.

```
check_token({ address: "0xTokenAddress", chain: "base" })
```

What it checks:
- Can holders sell (honeypot detection)
- Buy/sell tax percentage
- Fee-on-transfer detection
- Liquidity depth across DEXs
- Holder concentration (whale risk)
- Whether the token is a known scam

Use this before swapping into any token you have not verified manually.

### assess_risk

Runs a composite risk score across a DeFi interaction - contract scan, token check, and simulation combined into a single risk rating.

```
assess_risk({
  action: "swap",
  target: "0xContractAddress",
  token_in: "0xUSDC",
  token_out: "0xUnknownToken",
  amount: "1000000",
  chain: "base"
})
```

Returns:
- Risk level: LOW, MEDIUM, HIGH, or CRITICAL
- Individual findings from scan, token check, and simulation
- Recommended action (proceed, proceed with caution, or abort)

Use this as a single-call safety gate before any DeFi interaction.

## When to Use Each Tool

| Situation | Tool |
|-----------|------|
| About to approve a contract to spend tokens | `scan_contract` |
| About to send a swap or deposit transaction | `simulate_transaction` |
| User asks to buy an unknown token | `check_token` |
| Any DeFi interaction (default) | `assess_risk` |

**The default workflow:** Call `assess_risk` before every DeFi interaction. If you need more detail on a specific finding, follow up with the individual tools.

## Onchain Enforcement

Aegis also provides onchain safety infrastructure on Base:

**AegisGateway contract** - a smart contract that enforces safety checks onchain. Transactions routed through the gateway are validated against Aegis risk scores before execution. High-risk transactions revert automatically.

**Uniswap v4 hook** - a hook contract on Base that integrates Aegis risk checks directly into Uniswap v4 pool operations. Swaps through hooked pools get automatic honeypot and risk screening at the protocol level.

These are complementary to the MCP tools. The MCP server catches problems before you submit a transaction. The onchain contracts catch problems even if an agent skips the MCP check.

## What LLMs Get Wrong Without This

1. **Approve-and-drain:** Agent approves a malicious contract for unlimited token spending. Contract drains the wallet later.
2. **Honeypot swaps:** Agent swaps ETH for a token that cannot be sold. Funds are stuck permanently.
3. **Fee-on-transfer surprise:** Agent calculates slippage based on input amount, but 20% disappears to transfer fees. Transaction reverts or user gets far less than expected.
4. **Unverified contract interaction:** Agent calls a function on an unverified contract based on a user-provided ABI. The actual bytecode does something different.
5. **Stale router address:** Agent uses a cached or hallucinated router address. The real router is at a different address, and the old one is a phishing contract.

Every one of these is preventable with a single `assess_risk` call before the transaction.
