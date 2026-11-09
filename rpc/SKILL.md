---
name: rpc
description: "Use when deciding how an app should reach EVM nodes, choosing or changing an RPC provider, assessing what an RPC outage would take down, budgeting RPC, or interpreting a send response on various L1 and rollup architectures. Not for picking a chain (`l2s`), indexer design (`indexing`) or a whole-app trust review (`crops`)."
---

# RPC

## Reaching nodes reliably

Count failure domains, not URLs. Two vendors can share a [cloud region](https://decrypt.co/345036/metamask-showing-zero-balances-base-network-struggling-aws-issues-persist) or a [client bug](https://status.infura.io/incidents/syvkl4pr4mk2), a gateway may route to [the vendor](https://docs.uniblock.dev/guides/uniblock/autorouting/uniblock-auto-routing) you also use directly, and no vendor mix survives an L2 sequencer stall. Wallet-originated calls go to the wallet's RPC: you can change your own, but an app cannot change its users'. Every operator on the path can link IP, key and queried addresses, and sees intent in `eth_call`.

Ask the human what an hour of RPC failure costs and what each workload needs, then stop at the first step that covers it:

1. **Default:** one URL in app-owned config, using standard methods.
2. **Outage is costly:** add an independent operator through client fallback ([viem](https://github.com/wevm/viem/blob/main/src/clients/transports/fallback.ts), [ethers](https://docs.ethers.org/v6/api/providers/fallback-provider/)) or a shared library. A failed send can fall through to any URL in the list.
3. **Workloads differ:** give each its own config in that library. A trading send cares about time to inclusion from the deployed region; a backfill trades latency for cost and history.
4. **Router or gateway:** only for a demonstrated need: services cannot share a library, upstream changes cannot wait for a redeploy, a wallet needs one keyed URL, or you cannot otherwise attribute failures. It adds a failure domain and does not remove webhook or proprietary-API lock-in, sequencer risk or same-operator upstreams. Judge one by what it adds beyond a fallback list: upstreams ranked from live per-method measurements rather than a fixed order, the serving upstream reported per request, subscriptions resumed without gaps, and sends kept out of read fallback. Self-hostable options include [dShackle](https://github.com/emeraldpay/dshackle), [eRPC](https://github.com/erpc/erpc) and [Lasso](https://github.com/jaxernst/lasso-rpc).
5. **Cannot trust an operator:** run your own node; see [CROPS](https://ethskills.com/crops/SKILL.md).

## What differs and what answers prove

"Compatible" APIs disagree in ways a plan page hides. Test the exact URL you will deploy:

- **Empty results:** a lagging node's empty result looks like success and will not trigger fallback.
- **History:** a node serving current state may have [dropped pre-Merge block history](https://blog.ethereum.org/2025/07/08/partial-history-exp), so look up a pre-Merge block before a backfill relies on it.
- **Cost:** meters do not compare. [Alchemy](https://www.alchemy.com/docs/reference/compute-unit-costs) weights methods, with separate throughput limits; [dRPC](https://drpc.org/docs/pricing/compute-units) charges most calls the same, with exceptions; [Chainstack](https://docs.chainstack.com/docs/request-units) can price full and archive differently; [Infura](https://docs.infura.io/get-started/pricing) spends a daily credit quota. Price your own method mix.
- **Errors:** [Besu](https://github.com/hyperledger/besu/blob/bda7433c4f42e0e1cec5b74518f534d176f39c94/ethereum/api/src/main/java/org/hyperledger/besu/ethereum/api/jsonrpc/internal/response/RpcErrorType.java) uses `-32005` for gas limits, ranges and batches, so classify retries by method and message, not code.
- **Comparing providers:** replay or shadow real reads per method from your deployed region with a script or your client. Keep sends out.
- **Attributing a bad answer:** record the vendor's request ID and repeat the query at a pinned block against an independent operator. You can only see down to the layer that reports to you.

## What a send response means

Success means different things by architecture, so L1 stuck-transaction runbooks do not port:

- **Public L1:** the send enters one node's pool, then gossip. `already known` is not acceptance: [Nethermind](https://github.com/NethermindEth/nethermind/blob/24efa85f6d397bfae32e9673181e94174127a815/src/Nethermind/Nethermind.TxPool/Filters/AlreadyKnownTxFilter.cs) caches rejected hashes and [Erigon](https://github.com/erigontech/erigon/blob/27e20b9fa23ac1480bc9c759bd68bda746c0b55b/txnprovider/txpool/pool.go) treats recently discarded hashes as known. Look up the exact hash on the upstream that answered.
- **OP Stack:** the send goes to a sequencer with no public mempool; the escape is an `OptimismPortal` deposit. `pending` is pre-confirmed only on [Subblocks-aware endpoints](https://docs.optimism.io/app-developers/guides/transactions/integrating-subblocks).
- **Base:** a sequencer too, with an [`OptimismPortal` deposit](https://docs.base.org/specifications/base-protocol/bridging/deposits) as the escape. [Denim's guide](https://docs.base.org/upgrades/denim/migrate-from-flashblocks) replaces Flashblocks with 200 ms canonical blocks and retires pre-confirmed `pending`; check the live endpoint, since a `newFlashblocks` subscription may be acknowledged and then stay silent.
- **Arbitrum One:** on the [direct sequencer endpoint](https://docs.arbitrum.io/arbitrum-essentials/reference/node-providers), success means already in an L2 block, soft-confirmed and not final, with no pending-but-unconfirmed state; `context deadline exceeded` from its queue means not accepted. The escape is the Delayed Inbox. It [orders by priority fee and collects tips](https://docs.arbitrum.io/how-arbitrum-works/deep-dives/gas-and-fees), so a zero tip gives up position; other Nitro chains can differ.

For any other chain, read its current docs on submission, exclusion, finality and escape.

## Private sends on L1

- **`/fast` modes:** Protect's [`/fast`](https://docs.flashbots.net/flashbots-protect/settings-guide) shares the full unsigned transaction with TEE searchers; MEV Blocker's [`/fast`](https://mevblocker.io/) lacks `/noreverts` revert protection.
- **What acceptance proves:** check the relay before taking the next nonce from `pending`. [Flashbots](https://docs.flashbots.net/flashbots-protect/nonce-management) counts a private send only for a sender-signed request; [MEV Blocker](https://docs.mevblocker.io/how-to/integrate/Wallets) documents counting its own, but do not assume instantly. An accepted hash may never execute.
- **When every relay refuses:** the human, not a fallback list, chooses between stopping and public broadcast.
