---
name: rpc
description: "Use when choosing or changing an Ethereum RPC provider, preparing RPC for production, budgeting RPC cost, or setting up RPC for an indexer, trading system, frontend or simulation. Also for what a provider can see, and what a send response means on L1 or a specific L2. Not for picking a chain (`l2s`), indexer design (`indexing`) or a whole-app trust review (`crops`)."
---

# RPC

RPC is a workload decision, not a URL. Ask the human:

- **Who runs the node infrastructure you trust, and what is your exposure when it fails?** Count operators, clouds, clients and sequencers, not URLs.
- **What does each workload demand: throughput, latency, cost, history?** A trading send cares about time from the deployed region to a chosen inclusion or confirmation milestone, not response latency; a backfill can trade latency for cost and deep history.
- **How much do you depend on trusting your provider?** It can link IP, key and queried addresses, sees intent in `eth_call`, and chooses where your send goes. Its answers are trusted unless proved, and a lagging node's empty result looks like success. Wallet-originated calls go to the wallet's RPC: you can change your own, but an app cannot change its users'.

## RPC provider selection and routing

Provider quality shifts by region, method and hour, so no single choice stays right. Each setup moves that problem:

| Setup | Gives you | Watch for |
|---|---|---|
| One provider URL | The simplest start | Outage, quota and revoked key fail together; cannot see which node answered, or compare it with another |
| Client fallback ([viem](https://github.com/wevm/viem/blob/main/src/clients/transports/fallback.ts), [ethers](https://docs.ethers.org/v6/api/providers/fallback-provider/)) | Failover per app, in code | Works inside one process; a failed send can fall through to a public URL in the list |
| Self-hosted proxy | Your providers, keys, per-method policy and traffic, with health shared across clients | A service to run and a new failure domain; wallet use means exposing it |
| Managed router, proxy or gateway | Often more control than client fallback, nothing to run, and a keyed URL that works anywhere, including a wallet | The operator sees traffic; opaque upstreams hide your failure domains |

One URL suits a prototype, and client fallback suits a single process with simple policies. Once several services share RPC, or policies outgrow a fallback list, a shared routing layer usually earns its place. It fronts the vendors, nodes and relays you choose, so count your exposure behind it too.

Failover is the obvious reason to add one; the stronger one is that it is also an instrument:

- **Choosing:** put both candidates behind it and compare them per method on real read traffic from your deployed region, not a separate benchmark. Replacing the loser is then a config change. Keep sends out of the trial.
- **Debugging:** behind a bare URL, an agent can only probe from outside and escalate to the vendor. Per-request evidence of the serving upstream lets it attribute a bad answer itself. [Lasso](https://docs.lasso.sh/cloud/observability.md) returns this on the response with `?include_meta=body`; ask the same of any layer.

Where to find one:

- **Self-hosted:** [Lasso](https://github.com/jaxernst/lasso-rpc) (live per-method routing, subscription failover, fail-closed sends), [eRPC](https://github.com/erpc/erpc) (failover, hedging, re-org-aware caching), [dShackle](https://github.com/emeraldpay/dshackle) (failover, data-availability routing).
- **Managed:** [Lasso Cloud](https://lasso.sh) and [Goldsky Edge](https://goldsky.com/products/edge) (built on eRPC) host these designs; [Uniblock](https://docs.uniblock.dev/guides/uniblock/autorouting/uniblock-auto-routing) and [dRPC](https://drpc.org/docs/specs/balancing/overview) route across their own provider sets. Ask whether you can choose the upstreams, see where each request went, and leave without changing the app.

## Where providers differ

"Compatible" APIs disagree in ways a plan page hides. Test against the exact URL you will deploy:

- **History:** a node serving current state may have [dropped pre-Merge block history](https://blog.ethereum.org/2025/07/08/partial-history-exp), so look up a pre-Merge block before a backfill relies on it.
- **Cost:** meters do not compare. [Alchemy](https://www.alchemy.com/docs/reference/compute-unit-costs) weights methods, with separate throughput limits; [dRPC](https://drpc.org/docs/pricing/compute-units) charges most calls the same, with exceptions; [Chainstack](https://docs.chainstack.com/docs/request-units) can price full and archive differently; [Infura](https://docs.infura.io/get-started/pricing) spends a daily credit quota. Price your own method mix.
- **Errors:** [Besu](https://github.com/hyperledger/besu/blob/bda7433c4f42e0e1cec5b74518f534d176f39c94/ethereum/api/src/main/java/org/hyperledger/besu/ethereum/api/jsonrpc/internal/response/RpcErrorType.java) uses `-32005` for gas limits, ranges and batches, so classify retries by method and message, not code.

## What a send response means

Success means different things by architecture, so L1 stuck-transaction runbooks do not port:

- **Public L1:** the send enters one node's pool, then gossip. `already known` is not acceptance: [Nethermind](https://github.com/NethermindEth/nethermind/blob/24efa85f6d397bfae32e9673181e94174127a815/src/Nethermind/Nethermind.TxPool/Filters/AlreadyKnownTxFilter.cs) caches rejected hashes and [Erigon](https://github.com/erigontech/erigon/blob/27e20b9fa23ac1480bc9c759bd68bda746c0b55b/txnprovider/txpool/pool.go) treats recently discarded hashes as known. Look up the exact hash on the upstream that answered, or its read endpoint if it is send-only.
- **OP Stack:** the send goes to a sequencer with no public mempool; the escape is an `OptimismPortal` deposit. `pending` is pre-confirmed only on [Subblocks-aware endpoints](https://docs.optimism.io/app-developers/guides/transactions/integrating-subblocks).
- **Base:** no longer on the OP Stack, but also a sequencer with no public mempool and an [`OptimismPortal` deposit](https://docs.base.org/specifications/base-protocol/bridging/deposits) as the escape. [Denim](https://docs.base.org/upgrades/denim/migrate-from-flashblocks) replaced Flashblocks with 200 ms canonical blocks on mainnet in November 2026 (checked 2026-11-06), and its guide retires pre-confirmed `pending`. Migrate Flashblocks integrations: a `newFlashblocks` subscription may still be acknowledged and then stay silent.
- **Arbitrum One:** on the [direct sequencer endpoint](https://docs.arbitrum.io/arbitrum-essentials/reference/node-providers), success means already in an L2 block, soft-confirmed and not final, with no pending-but-unconfirmed state; `context deadline exceeded` from its queue means not accepted. The escape is the Delayed Inbox. Arbitrum One [orders by priority fee and collects tips](https://docs.arbitrum.io/how-arbitrum-works/deep-dives/gas-and-fees), so a zero tip gives up position; other Nitro chains can differ.

For any other chain or endpoint, including zk rollups, read its current docs on submission, exclusion, finality and escape.

## Private sends on L1

- **`/fast` modes:** Protect's [`/fast`](https://docs.flashbots.net/flashbots-protect/settings-guide) shares the full unsigned transaction with TEE searchers; MEV Blocker's [`/fast`](https://mevblocker.io/) lacks `/noreverts` revert protection.
- **What acceptance proves:** check the relay before taking the next nonce from `pending`. [Flashbots](https://docs.flashbots.net/flashbots-protect/nonce-management) counts a private send only for a sender-signed request; [MEV Blocker](https://docs.mevblocker.io/how-to/integrate/Wallets) documents counting its own, but do not assume instantly. An accepted hash may never execute.
- **When every relay refuses:** the human, not a fallback list, chooses between stopping and public broadcast. Check that your layer fails closed unless a fallback is configured.

Trust review: [CROPS](https://ethskills.com/crops/SKILL.md).
