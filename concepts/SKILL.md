---
name: concepts
description: The essential mental models for building onchain. Not a Solidity tutorial — the "aha moments" that change how someone thinks about Ethereum. Use when your human is new to onchain development, when they're designing a system and need to understand incentive design, or when they ask "how does DeFi actually work?" Start here before building.
---

# Ethereum Concepts — The Speedrun

## What You Probably Got Wrong

**"Smart contracts run automatically."** No. Smart contracts cannot execute themselves. There is no cron job, no scheduler, no background process. Every function needs a caller who pays gas. This single misconception is the root cause of most broken onchain designs.

**"Just add a timer."** There are no timers. If something needs to happen at a certain time, you need someone to call the function at that time — and you need to give them a reason to do it.

**"The protocol team will handle that."** The whole point of decentralization is that no single team operates the system. If your design requires an operator, it's not decentralized — and it has a single point of failure.

## 1. Smart Contracts Are Programs With Addresses

A smart contract is code deployed to an Ethereum address. Just like a wallet address can hold ETH, a contract address can hold ETH — but it also runs logic.

```
Regular wallet:     0xAlice... → holds 5 ETH
Smart contract:     0xVault... → holds 500 ETH + rules about who can withdraw
```

**Key properties:**
- **Immutable** — once deployed, nobody can change the code. Not the developer, not Ethereum, nobody. (Upgradeable patterns exist but add trust assumptions.)
- **Deterministic** — same inputs always produce the same outputs. No randomness, no external calls, no "it depends."
- **Always available** — runs 24/7/365. No downtime, no maintenance windows, no server to restart.
- **Permissionless** — anyone can deploy one, anyone can call one (unless the code restricts it).

Think of it as a vending machine: it has rules, it holds assets, it executes predictably, and nobody needs to operate it.

## 2. Contracts Talk To Contracts (Composability)

A contract can call any other contract's public functions. This is why Ethereum is called "money legos" — you stack protocols on top of each other.

```
Your contract → calls Uniswap → which moves USDC → which calls the USDC contract
```

**This is the superpower.** You don't need Uniswap's permission to build on Uniswap. You don't need Aave's API key to use Aave. You just call their contracts.

### Atomicity — All or Nothing

If you call 5 contracts in one transaction and the 5th one fails, ALL of them revert. Nothing happened. This is incredibly powerful:

```
1. Borrow 1M USDC from Aave (flash loan)
2. Buy ETH on Uniswap
3. Sell ETH on SushiSwap for more USDC
4. Repay Aave + fee
5. Keep the profit
```

If step 3 doesn't produce enough USDC to repay step 4, the ENTIRE transaction reverts. You lose only the gas fee (~$0.05-0.50). You never lose the borrowed million.

This is a **flash loan** — you borrow any amount, do whatever you want, and repay in the same transaction. If you can't repay, it never happened.

## 3. The Approve Pattern

Contracts can't just take your tokens. You have to explicitly grant permission.

```
Step 1: You call USDC.approve(VaultContract, 1000)
        "I allow VaultContract to move up to 1000 of my USDC"

Step 2: You call Vault.deposit(1000)
        Vault internally calls USDC.transferFrom(you, vault, 1000)
```

**Why it exists:** Security. Every token movement requires explicit consent. A contract can only move your tokens if you approved it first, and only up to the amount you approved.

**Why it feels weird:** It's two transactions instead of one. Users must approve before they can interact. Good UIs handle this with a smooth flow: check allowance → show "Approve" button if needed → then show the action button.

**⚠️ Never approve unlimited amounts.** Some dApps ask for `type(uint256).max` approval (infinite). If that contract gets hacked, the attacker can drain every approved token from your wallet. Approve only what you need.

## 4. Nothing Is Automatic — Incentive Design

**This is the most important concept in all of Ethereum.**

Smart contracts cannot execute themselves. There is no scheduler. For EVERY function that "needs to happen," you must answer three questions:

1. **Who calls this function?** (someone must pay gas)
2. **Why would they do it?** (what's their incentive?)
3. **Is the incentive sufficient?** (covers gas + makes it worth their time?)

If you can't answer these questions, your function won't get called. Your protocol will sit there, dead, with nobody pressing the button.

### Examples That Work

**Liquidations (Aave, Compound):**
```
Health factor drops below 1 → anyone can call liquidate()
→ Caller gets 5-10% bonus collateral
→ Profitable, so bots compete to do it instantly
→ Platform stays solvent without any operator
```

**Yield harvesting (Yearn, yield aggregators):**
```
Rewards accumulate in a pool → anyone can call harvest()
→ Caller gets 1% of the harvested yield as a reward
→ Worth it once yield > gas cost
→ Protocol compounds automatically via profit-motivated callers
```

**DEX arbitrage:**
```
ETH is $2000 on Uniswap, $2010 on SushiSwap
→ Anyone can buy low, sell high
→ Profit = $10 minus gas
→ Prices equalize across markets without any operator
```

**Claims (user-motivated):**
```
User has pending rewards → calls claimRewards()
→ They want their own tokens
→ Self-interest is the incentive
→ No protocol intervention needed
```

### Examples That DON'T Work

```
❌ "The contract will check prices every hour"
   → WHO calls it every hour? WHY would they pay gas?

❌ "Expired listings get automatically removed"
   → Nothing is automatic. WHO removes them?

❌ "The protocol rebalances daily"
   → WHOSE gas pays for this? What's their profit?
```

**The fix is always the same:** Make the function callable by anyone and give them a reason to call it.

## 5. DEXs and Liquidity (How Swaps Actually Work)

A decentralized exchange is a contract holding reserves of two tokens. When you swap, you're trading against this pool — not against another person.

### The Constant Product Formula

```
x * y = k

x = amount of Token A in the pool
y = amount of Token B in the pool
k = constant (stays the same after every swap)
```

If the pool has 100 ETH and 200,000 USDC:
- `k = 100 × 200,000 = 20,000,000`
- You put in 1 ETH → pool now has 101 ETH
- To maintain k: `101 × y = 20,000,000` → `y = 198,019`
- Pool sends you `200,000 - 198,019 = 1,981 USDC`
- Price was effectively $1,981 per ETH (not $2,000) — that's **slippage**

### The Liquidity Flywheel

This is incentive design in action:

```
LPs deposit tokens into the pool → pool has more reserves
→ More reserves = less slippage for traders
→ Less slippage = more traders use this pool
→ More trades = more fees (0.3% per swap)
→ More fees = more LPs want to provide liquidity
→ Cycle repeats
```

**LPs (Liquidity Providers)** earn fees from every swap proportional to their share of the pool. The risk is **impermanent loss** — if token prices diverge, LPs would have been better off just holding.

## 6. Overcollateralized Lending

Lending onchain works differently than lending in a bank. There's no credit score, no identity, no legal enforcement. Instead: **overcollateralization.**

```
Deposit $1,500 worth of ETH as collateral
→ Borrow up to $1,000 USDC (66% loan-to-value)
→ Health factor = collateral value / debt value = 1.5
```

### Liquidations — Incentive Design at Its Best

```
ETH price drops → your collateral is now worth $1,100
→ Health factor = 1.1 (approaching danger zone)

ETH drops more → collateral = $1,000
→ Health factor = 1.0 → LIQUIDATION THRESHOLD

→ Anyone can call liquidate(yourPosition)
→ Liquidator repays part of your debt
→ Liquidator receives your collateral + 5-10% bonus
→ Protocol stays solvent
→ No admin had to do anything
```

**Why this works:** Liquidators are profit-motivated bots running 24/7. The bonus makes it profitable to watch positions and liquidate instantly. The protocol never becomes insolvent because the incentive to liquidate is always greater than the cost.

**SpeedRun Ethereum Challenge 6** teaches this hands-on: build a lending protocol, implement the health factor, create the liquidation function, and watch how incentives keep the system healthy.

## 7. Stablecoins — Pegging Through Incentives

How does a token stay worth $1 without anyone controlling it?

### CDP Stablecoins (MakerDAO/DAI model)

```
User deposits $1,500 ETH → mints 1,000 DAI ($1 each)
→ DAI is backed by overcollateralized ETH
→ If ETH drops, position gets liquidated (same as lending)
```

**The peg mechanism:**
- **DAI > $1:** Minting DAI and selling it is profitable → more supply → price drops to $1
- **DAI < $1:** Buying DAI cheap and repaying loans is profitable → less supply → price rises to $1

**Borrow rates are the lever.** MakerDAO adjusts the interest rate to control supply:
- Too much DAI → raise rates → people repay loans → supply decreases
- Not enough DAI → lower rates → people borrow more → supply increases

No operator sets the price. Arbitrageurs and interest rates do all the work. Incentives again.

## 8. Randomness Is Hard

Smart contracts are deterministic. Every node must get the same result. This means you can't use `Math.random()` — there's nothing random about a system where everyone computes the same thing.

### What Doesn't Work

```solidity
// ❌ Miners can manipulate block.timestamp
uint random = uint(keccak256(abi.encodePacked(block.timestamp)));

// ❌ blockhash(block.number) is ALWAYS zero for the current block
uint random = uint(blockhash(block.number));

// ❌ Miners can withhold blocks if they don't like the result
uint random = uint(blockhash(block.number - 1));
```

### What Works

**Commit-Reveal** (no external dependency):
```
1. User commits hash(secret + salt) → stored onchain
2. Wait at least 1 block
3. User reveals secret + salt → contract verifies hash
4. Random seed = keccak256(secret + blockhash(commitBlock))
```
- User can't predict blockhash when they commit
- Miner can't know the secret to manipulate the result
- Must reveal within 256 blocks (blockhash returns zero after that)

**Chainlink VRF** (provably random, costs LINK):
```
1. Contract requests randomness from Chainlink
2. Chainlink generates random number off-chain with a VRF proof
3. Anyone can verify the proof onchain
4. Guaranteed unbiased — even Chainlink can't manipulate it
```

Use commit-reveal for simple cases. Use Chainlink VRF when you need provable randomness (lotteries, NFT reveals, gaming).

## 9. Oracles — Real-World Data Onchain

Smart contracts can't call APIs, read websites, or access any data outside the blockchain. If your contract needs a price, weather data, or sports scores, someone has to put that data onchain.

**Oracles** are the bridge between offchain data and onchain contracts.

### Chainlink Price Feeds

```solidity
(, int256 price,, uint256 updatedAt,) = priceFeed.latestRoundData();
require(block.timestamp - updatedAt < 3600, "Stale price");
require(price > 0, "Invalid price");
// ETH/USD price with 8 decimals → $1,960.12345678
```

### ⚠️ Never Use DEX Spot Prices as Oracles

```
❌ "Check the Uniswap pool to get the ETH price"
```

A flash loan can manipulate the pool's spot price within a single transaction:
1. Borrow 100M USDC
2. Buy ETH on Uniswap → price spikes to $50,000
3. Your contract reads the manipulated price
4. Your contract makes a bad decision based on fake price
5. Attacker profits from your contract's mistake
6. Repay flash loan

This has caused hundreds of millions in losses. Use Chainlink or TWAP oracles — never spot prices.

## 10. Smart Contract Wallets & Multisigs

A wallet doesn't have to be a single private key. It can be a smart contract with its own rules.

### Safe (Gnosis Safe) — The Standard Multisig

```
5 people control a treasury
Threshold: 3 of 5 must approve any transaction
→ No single person can steal funds
→ Losing 1-2 keys doesn't lock the treasury
→ $100B+ secured this way
```

DAOs, protocol treasuries, and teams use Safe for everything. It's the standard.

### EIP-7702 — Smart EOAs (Live Since May 2025)

Regular wallets can temporarily become smart contract wallets within a transaction:
- Batch 10 approvals into one transaction
- Gas sponsorship (someone else pays your gas)
- Session keys with limited permissions

Best of both worlds: simple wallet experience + smart contract features.

## 11. Prediction Markets

Binary outcomes tokenized as tradeable positions:

```
"Will ETH be above $3,000 on March 1?"

YES token: currently $0.35 (market thinks 35% likely)
NO token:  currently $0.65 (market thinks 65% likely)

YES + NO always = $1.00

If ETH IS above $3,000:
  YES → redeemable for $1.00 (profit: $0.65 per token)
  NO  → worth $0.00

If ETH IS NOT above $3,000:
  YES → worth $0.00
  NO  → redeemable for $1.00 (profit: $0.35 per token)
```

**Resolution** requires an oracle or governance mechanism to determine the outcome. The market itself is just an AMM for YES/NO tokens — same liquidity and incentive concepts as DEXs.

**Why it matters:** Prediction markets are information aggregators. The price of a YES token IS the market's probability estimate. This is useful far beyond gambling — governance, forecasting, insurance.

## The Thread That Connects Everything

Every concept above comes back to one principle: **incentive design.**

- DEXs work because fees incentivize LPs
- Lending works because liquidation bonuses incentivize liquidators
- Stablecoins work because arbitrage incentivizes peg maintenance
- Oracles work because staking incentivizes honest reporting
- Even block production works because rewards incentivize validators

When you're designing an onchain system, start with the incentives. If the incentives are right, the system runs itself. If they're wrong, no amount of code will save it.

## Learning Path

Build these in order to internalize the concepts:

| # | Challenge | Concept | What Clicks |
|---|-----------|---------|-------------|
| 0 | Simple NFT | ERC-721 | Minting, metadata, ownership |
| 1 | Staking | Coordination | Deadlines, escrow, thresholds |
| 2 | Token Vendor | ERC-20 + DEX | Approve pattern, buy/sell curves |
| 3 | Dice Game | Randomness | Why onchain randomness is insecure |
| 4 | DEX | AMM | x*y=k, slippage, LP incentives |
| 5 | Oracles | Price Feeds | Chainlink, manipulation resistance |
| 6 | Lending | Collateral | Health factor, liquidation incentives |
| 7 | Stablecoins | Pegging | CDP, overcollateralization, rate levers |
| 8 | Prediction Markets | Resolution | Outcome determination, market making |
| 9 | ZK Voting | Privacy | Zero-knowledge proofs |
| 10 | Multisig | Signatures | Threshold approval, social recovery |
| 11 | SVG NFT | Onchain Art | Generative, base64 encoding |

**Start at https://speedrunethereum.com** — each challenge is a hands-on build.

## Resources

- **SpeedRun Ethereum:** https://speedrunethereum.com
- **ETH Tech Tree:** https://www.ethtechtree.com
- **Ethereum.org:** https://ethereum.org/en/developers/
- **EthSkills (for agents):** https://ethskills.com
