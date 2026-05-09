---
name: batch-payments
description: Multi-recipient token transfers on Ethereum and L2s — batch contracts, gas optimization, payroll, airdrops, and x402-gated batch APIs. LLMs default to looping transfer() calls. This skill teaches the efficient patterns that exist onchain today. Use when building airdrops, payroll systems, tipping, revenue sharing, or any multi-recipient distribution.
---

# Batch Payments

## What You Probably Got Wrong

**Don't loop `transfer()`.** Stock LLMs generate N separate `transfer()` calls for N recipients. Each costs ~21,000 base gas + ERC-20 overhead. A batch contract wraps N transfers in a single transaction — one base fee, one signature, one confirmation. 100 recipients: ~2.1M gas looped vs ~800K batched. That's 60% cheaper and 100x faster to confirm.

**Batch contracts exist and are deployed.** You don't need to write one from scratch. Multiple production implementations exist on Base, Ethereum, and other EVM chains. The pattern is standardized: approve tokens to the batch contract, call a single function with arrays of recipients and amounts.

**`transferFrom` inside a loop is the right pattern — inside the contract.** The batch contract calls `transferFrom(sender, recipient, amount)` for each entry. The sender approves the batch contract once for the total amount. This is safe, gas-efficient, and standard. Don't confuse this with the antipattern of looping `transfer()` from an EOA.

**x402 works for batch payment APIs.** An agent can pay $0.01-0.25 via x402 to trigger a batch distribution through a gateway — the gateway holds the batch contract interaction logic, the agent just sends the recipient list and pays for the service.

## Batch Contract Pattern

### Solidity (Minimal Production Implementation)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BatchPayment {
    using SafeERC20 for IERC20;

    /// @notice Send tokens to multiple recipients in one transaction
    /// @param token ERC-20 token address
    /// @param recipients Array of recipient addresses
    /// @param amounts Array of amounts (must match recipients length)
    function batchTransfer(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        require(recipients.length == amounts.length, "Length mismatch");
        IERC20 t = IERC20(token);
        for (uint256 i = 0; i < recipients.length; i++) {
            t.safeTransferFrom(msg.sender, recipients[i], amounts[i]);
        }
    }

    /// @notice Send ETH to multiple recipients
    function batchTransferETH(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable {
        require(recipients.length == amounts.length, "Length mismatch");
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool ok, ) = recipients[i].call{value: amounts[i]}("");
            require(ok, "ETH transfer failed");
            total += amounts[i];
        }
        require(total == msg.value, "Incorrect ETH amount");
    }
}
```

### Client-Side (viem)

```typescript
import { parseAbi, parseUnits } from "viem";

const BATCH_ABI = parseAbi([
  "function batchTransfer(address token, address[] recipients, uint256[] amounts)",
]);

// 1. Approve the batch contract for the total amount
const total = amounts.reduce((a, b) => a + b, 0n);
await walletClient.writeContract({
  address: TOKEN_ADDRESS,
  abi: parseAbi(["function approve(address,uint256) returns (bool)"]),
  functionName: "approve",
  args: [BATCH_CONTRACT, total],
});

// 2. Execute batch — one transaction for all recipients
await walletClient.writeContract({
  address: BATCH_CONTRACT,
  abi: BATCH_ABI,
  functionName: "batchTransfer",
  args: [TOKEN_ADDRESS, recipients, amounts],
});
```

## Gas Comparison (Base, March 2026)

| Method | 10 recipients | 100 recipients | 500 recipients |
|--------|--------------|----------------|----------------|
| Loop `transfer()` | ~210K gas (~$0.004) | ~2.1M gas (~$0.04) | ~10.5M gas (~$0.20) |
| Batch contract | ~95K gas (~$0.002) | ~800K gas (~$0.015) | ~3.8M gas (~$0.07) |
| Savings | ~55% | ~62% | ~64% |

On Base with gas under 0.05 gwei, both are cheap. But batch is still meaningfully better for large distributions, and it's a single transaction to track and confirm.

## Multi-Chain Batch Infrastructure

Production batch payment infrastructure exists on multiple chains. The pattern is the same everywhere — deploy the batch contract, approve, call:

| Chain | Gas per batch (100 recipients) | Notes |
|-------|-------------------------------|-------|
| Base | ~$0.015 | Cheapest for USDC distributions |
| Arbitrum | ~$0.02-0.05 | Good for DeFi-heavy distributions |
| Polygon | ~$0.01-0.03 | Low cost, high throughput |
| Ethereum L1 | ~$0.30-2.00 | Only for high-value distributions |

## x402-Gated Batch Payment APIs

An agent doesn't need to deploy its own batch contract. x402-gated batch payment gateways handle the contract interaction:

```
1. Agent → POST /batch with {token, recipients[], amounts[]}
2. Gateway → 402 Payment Required ($0.05 USDC service fee)
3. Agent signs x402 payment
4. Gateway executes batch onchain
5. Agent receives tx hash confirmation
```

This is the pattern for agent-to-agent payroll, revenue sharing, and automated distributions. The agent pays a small service fee; the gateway handles gas, contract calls, and confirmation.

### Gateway Discovery via ERC-8004

Batch payment gateways can register as ERC-8004 agents with service tags:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "BatchPaymentGateway",
  "description": "Multi-chain batch token distributions via x402",
  "services": [
    { "name": "x402", "endpoint": "https://gateway.example.com/batch" }
  ],
  "x402Support": true,
  "active": true
}
```

Agents discover batch payment services the same way they discover any other ERC-8004 service — query the IdentityRegistry, check reputation, pay via x402.

## Common Use Cases

**Payroll:** Distribute USDC to team members monthly. One transaction instead of N.

**Airdrops:** Send tokens to hundreds of wallets. Batch contracts handle the loop.

**Revenue sharing:** Protocol fees split across stakeholders automatically.

**Bounty payouts:** Agent bounty boards (like the ClawdBot Agent Bounty Board on Base) can batch-settle multiple completed jobs in one transaction.

**Tipping:** Social apps distributing tips to multiple creators per round.

## Safety Notes

- Always use `SafeERC20` — some tokens don't return `bool` from `transfer`.
- Set a reasonable upper bound on array length to avoid out-of-gas reverts (500-1000 recipients per batch is practical).
- Approve only the exact total needed, not `type(uint256).max`, for batch contracts you don't fully trust.
- For ETH batches, use the `call` pattern (not `transfer` — 2300 gas limit breaks with contract recipients).