---
name: indexing
description: How to read and query onchain data — events, The Graph, indexing patterns. Why you cannot just loop through blocks, and what to use instead.
---

# Onchain Data & Indexing

## What You Probably Got Wrong

**You try to query historical state via RPC calls.** You can't cheaply read past state. `eth_call` reads current state. Reading state at a historical block requires an archive node (expensive, slow). For historical data, you need an indexer.

**You loop through blocks looking for events.** Scanning millions of blocks with `eth_getLogs` is O(n) — it will timeout, get rate-limited, or cost a fortune in RPC credits. Use an indexer that has already processed every block.

**You store query results onchain.** Leaderboards, activity feeds, analytics — these belong offchain. Compute offchain, index events offchain. If you need an onchain commitment, store a hash.

**You don't know about The Graph.** The Graph turns your contract's events into a queryable GraphQL API. It's how every serious dApp reads historical data. Etherscan uses indexers. Uniswap uses indexers. So should you.

**You treat events as optional.** Events are THE primary way to read historical onchain activity. If your contract doesn't emit events, nobody can build a frontend, dashboard, or analytics on top of it. Design contracts event-first.

---

## Events Are Your API

Solidity events are cheap to emit (~375 gas base + 375 per indexed topic + 8 gas per byte of data) and free to read offchain. They're stored in transaction receipts, not in contract storage, so they don't cost storage gas.

### Design Contracts Event-First

Every state change should emit an event. This isn't just good practice — it's how your frontend, indexer, and block explorer know what happened.

```solidity
// ✅ Good — every action emits a queryable event
contract Marketplace {
    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed tokenContract,
        uint256 tokenId,
        uint256 price
    );
    event Sold(uint256 indexed listingId, address indexed buyer, uint256 price);
    event Cancelled(uint256 indexed listingId);

    function list(address token, uint256 tokenId, uint256 price) external {
        uint256 id = nextListingId++;
        listings[id] = Listing(msg.sender, token, tokenId, price, true);
        emit Listed(id, msg.sender, token, tokenId, price);
    }

    function buy(uint256 listingId) external payable {
        // ... transfer logic ...
        emit Sold(listingId, msg.sender, msg.value);
    }
}
```

**Index the fields you'll filter by.** You get 3 indexed topics per event. Use them for addresses and IDs that you'll query — `seller`, `buyer`, `tokenContract`, `listingId`. Don't index large values or values you won't filter on.

### Reading Events Directly (Small Scale)

For recent events or low-volume contracts, you can read events directly via RPC:

```typescript
import { createPublicClient, http, parseAbiItem } from 'viem';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Get recent events (last 1000 blocks)
const logs = await client.getLogs({
  address: '0xYourContract',
  event: parseAbiItem('event Sold(uint256 indexed listingId, address indexed buyer, uint256 price)'),
  fromBlock: currentBlock - 1000n,
  toBlock: 'latest',
});
```

**This works for:** Last few thousand blocks, low-volume contracts, real-time monitoring.
**This breaks for:** Historical queries, high-volume contracts, anything scanning more than ~10K blocks.

---

## The Graph (Subgraphs)

The Graph is a decentralized indexing protocol. You define how to process events, deploy a subgraph, and get a GraphQL API that serves historical data instantly.

### When to Use The Graph

- Any dApp that needs historical data (activity feeds, transaction history)
- Leaderboards, rankings, analytics dashboards
- NFT collection browsers (who owns what, transfer history)
- DeFi dashboards (position history, PnL tracking)
- Any query that would require scanning more than ~10K blocks

### How It Works

1. **Define a schema** — what entities you want to query
2. **Write mappings** — TypeScript handlers that process events into entities
3. **Deploy** — subgraph indexes all historical events and stays synced

### Example: NFT Collection Subgraph

**schema.graphql:**
```graphql
type Token @entity {
  id: ID!
  tokenId: BigInt!
  owner: Bytes!
  mintedAt: BigInt!
  transfers: [Transfer!]! @derivedFrom(field: "token")
}

type Transfer @entity {
  id: ID!
  token: Token!
  from: Bytes!
  to: Bytes!
  timestamp: BigInt!
  blockNumber: BigInt!
}
```

**mapping.ts:**
```typescript
import { Transfer as TransferEvent } from './generated/MyNFT/MyNFT';
import { Token, Transfer } from './generated/schema';

export function handleTransfer(event: TransferEvent): void {
  let tokenId = event.params.tokenId.toString();

  // Create or update token entity
  let token = Token.load(tokenId);
  if (token == null) {
    token = new Token(tokenId);
    token.tokenId = event.params.tokenId;
    token.mintedAt = event.block.timestamp;
  }
  token.owner = event.params.to;
  token.save();

  // Create transfer record
  let transfer = new Transfer(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );
  transfer.token = tokenId;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.timestamp = event.block.timestamp;
  transfer.blockNumber = event.block.number;
  transfer.save();
}
```

**Query the subgraph:**
```graphql
{
  tokens(where: { owner: "0xAlice..." }, first: 100) {
    tokenId
    mintedAt
    transfers(orderBy: timestamp, orderDirection: desc, first: 5) {
      from
      to
      timestamp
    }
  }
}
```

### Deploying a Subgraph

```bash
# Install
npm install -g @graphprotocol/graph-cli

# Initialize from contract ABI
graph init --studio my-subgraph

# Generate types from schema
graph codegen

# Build
graph build

# Deploy to Subgraph Studio
graph deploy --studio my-subgraph
```

**Subgraph Studio** (studio.thegraph.com) — development and testing environment. Free during development. Publish to the decentralized network for production.

---

## Alternative Indexing Solutions

| Solution | Best for | Tradeoffs |
|----------|----------|-----------|
| **The Graph** | Production dApp backends, decentralized | GraphQL API, requires subgraph development |
| **Dune Analytics** | Dashboards, analytics, ad-hoc queries | SQL interface, great visualization, not for app backends |
| **Alchemy/QuickNode APIs** | Quick token/NFT queries | `getTokenBalances`, `getNFTs`, `getAssetTransfers` — fast but centralized |
| **Etherscan/Blockscout APIs** | Simple event log queries | Rate-limited, not for high-volume |
| **Ponder** | TypeScript-first indexing | Local-first, simpler than The Graph for single-app use |
| **Direct RPC** | Real-time current state only | Only for current state reads, not historical |

### Dune Analytics

Write SQL queries over decoded onchain data. Best for analytics and dashboards, not for app backends.

```sql
-- Top 10 buyers on your marketplace (last 30 days)
SELECT
    buyer,
    COUNT(*) as purchases,
    SUM(price / 1e18) as total_eth_spent
FROM mycontract_ethereum.Marketplace_evt_Sold
WHERE evt_block_time > NOW() - INTERVAL '30' DAY
GROUP BY buyer
ORDER BY total_eth_spent DESC
LIMIT 10
```

### Enhanced Provider APIs

For common queries, provider APIs are faster than building a subgraph:

```typescript
// Alchemy: get all tokens held by an address
const balances = await alchemy.core.getTokenBalances(address);

// Alchemy: get all NFTs owned by an address
const nfts = await alchemy.nft.getNftsForOwner(address);

// Alchemy: get transfer history
const transfers = await alchemy.core.getAssetTransfers({
  fromAddress: address,
  category: ['erc20', 'erc721'],
});
```

---

## Reading Current State (Not Historical)

For current balances, allowances, and contract state, direct RPC reads are fine. No indexer needed.

### Single Reads

```typescript
import { createPublicClient, http } from 'viem';

const client = createPublicClient({ chain: mainnet, transport: http() });

// Read current balance
const balance = await client.readContract({
  address: tokenAddress,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [userAddress],
});
```

### Batch Reads with Multicall

For multiple reads in one RPC call, use Multicall3 (deployed at the same address on every chain):

```typescript
// Multicall3: 0xcA11bde05977b3631167028862bE2a173976CA11
// Same address on Ethereum, Arbitrum, Optimism, Base, Polygon, and 50+ chains

const results = await client.multicall({
  contracts: [
    { address: tokenA, abi: erc20Abi, functionName: 'balanceOf', args: [user] },
    { address: tokenB, abi: erc20Abi, functionName: 'balanceOf', args: [user] },
    { address: tokenC, abi: erc20Abi, functionName: 'balanceOf', args: [user] },
    { address: vault, abi: vaultAbi, functionName: 'totalAssets' },
  ],
});
// One RPC call instead of four
```

### Real-Time Updates

For live updates, subscribe to new events via WebSocket:

```typescript
import { createPublicClient, webSocket } from 'viem';

const client = createPublicClient({
  chain: mainnet,
  transport: webSocket('wss://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'),
});

// Watch for new sales in real-time
const unwatch = client.watchContractEvent({
  address: marketplaceAddress,
  abi: marketplaceAbi,
  eventName: 'Sold',
  onLogs: (logs) => {
    for (const log of logs) {
      console.log(`Sale: listing ${log.args.listingId} for ${log.args.price}`);
    }
  },
});
```

---

## Common Patterns

| What you need | How to get it |
|---------------|---------------|
| Activity feed for a dApp | Emit events → index with The Graph → query via GraphQL |
| Token balances for a user | Alchemy `getTokenBalances` or Multicall |
| NFT collection browser | The Graph subgraph or Alchemy `getNftsForContract` |
| Price history | Dune Analytics or DEX subgraphs |
| Real-time new events | WebSocket subscription via viem |
| Historical transaction list | The Graph or Alchemy `getAssetTransfers` |
| Dashboard / analytics | Dune Analytics (SQL + charts) |
| Protocol TVL tracking | DeFiLlama API or custom subgraph |
