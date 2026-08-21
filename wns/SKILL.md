---
name: wns
description: Use when resolving, registering, or integrating .wei names — the Wei Name Service, an ENS-compatible ERC-721 naming system on Ethereum mainnet. Covers namehash→tokenId, address/contenthash/text resolution, reverse resolution, commit-reveal registration, subdomains, and serving IPFS/IPNS websites through the wei.limo / wei.is / wei.domains gateway. Applies to both onchain integration (a single resolver+registry+NFT contract) and offchain resolution (the HTTP gateway, no wallet needed).
---

# WNS — Wei Name Service (.wei)

`.wei` names are an ENS-compatible naming system on **Ethereum mainnet**. If you can resolve ENS, you can resolve WNS — same namehash algorithm, same resolver selectors — you just point at a different contract.

## What You Probably Got Wrong

- **WNS is not ENS, but it is ENS-*compatible*.** Same namehash (EIP-137), same resolver interface IDs (`addr`, `text`, `contenthash`). Existing ENS resolver-read code works if you point it at the WNS contract.
- **It is ONE contract.** Not a registry + registrar + resolver split like ENS. A single non-upgradeable contract is the ERC-721 (ownership), the registrar (commit-reveal), and the resolver (addr/text/contenthash) all at once.
- **Token ID = `uint256(namehash(name))`.** The NFT tokenId *is* the ENS namehash. No separate node/id mapping.
- **You do not need a wallet or a library to resolve a website.** `https://<name>.wei.limo` (also `.wei.is`, `.wei.domains`) serves the name's IPFS/IPNS contenthash over plain HTTPS. Just fetch the URL.
- **Names expire.** 365-day registration + 90-day grace. During grace and after, resolver reads return empty. Don't cache resolutions forever.

## Contract

| | |
|---|---|
| Address (mainnet) | `0x0000000000696760E15f265e828DB644A0c242EB` |
| `WEI_NODE` = `namehash("wei")` | `0xa82820059d5df798546bcc2985157a77c3eef25eba9ba01899927333efacbd6f` |
| Standard | ERC-721 + registrar + ENS-compatible resolver, one non-upgradeable contract |
| Chain | Ethereum mainnet only |

`namehash("alice.wei") = keccak256(WEI_NODE ++ keccak256("alice"))`, and `tokenId = uint256(namehash)`. The contract will compute it for you — see `computeId` below — so you never have to implement namehash yourself.

## Resolve a name (read-only, no wallet)

Every resolver read takes the `uint256` tokenId. Get it with `computeId(fullName)` (accepts `"alice.wei"` or `"alice"`; also handles subdomains like `"sub.alice.wei"`).

```bash
WNS=0x0000000000696760E15f265e828DB644A0c242EB

# name -> tokenId (this is the namehash)
TID=$(cast call $WNS "computeId(string)(uint256)" "alice.wei" --rpc-url $RPC)

cast call $WNS "resolve(uint256)(address)"        $TID --rpc-url $RPC  # ETH address
cast call $WNS "contenthash(uint256)(bytes)"      $TID --rpc-url $RPC  # IPFS/IPNS/Swarm
cast call $WNS "text(uint256,string)(string)"     $TID "url" --rpc-url $RPC
cast call $WNS "addr(uint256,uint256)(bytes)"     $TID 60  --rpc-url $RPC  # SLIP-44 coin (60=ETH)
```

`resolve()` falls back to `ownerOf` when no explicit address is set, so a freshly registered name resolves to its owner by default.

**ENS-compatible `bytes32 node` overloads** also exist, so an ENS-style resolver client works unchanged once pointed at this contract:

```solidity
function addr(bytes32 node) view returns (address)
function addr(bytes32 node, uint256 coinType) view returns (bytes)
function text(bytes32 node, string key) view returns (string)
function contenthash(bytes32 node) view returns (bytes)
```

`supportsInterface` advertises: `addr(bytes32)` `0x3b3b57de`, `addr(bytes32,uint256)` `0xf1cb7e06`, `text` `0x59d1d43c`, `contenthash` `0xbc1c58d1`, plus ERC-721 / ERC-165.

### Reverse resolution (address → name)

```bash
cast call $WNS "reverseResolve(address)(string)" 0xUser --rpc-url $RPC
```

Returns the owner's **primary name**, or `""` if unset/inactive. A user sets it with `setPrimaryName(tokenId)` (callable by the owner or the address the token resolves to). `setPrimaryName(0)` clears it.

## Serve a website (IPFS/IPNS)

Set an IPFS or IPNS contenthash on the name, and the gateway serves it — no per-name DNS, no config:

```
https://alice.wei.limo        ->  IPFS/IPNS content of alice.wei
https://alice.wei.is          ->  same, alternate zone
https://alice.wei.domains     ->  same, alternate zone
```

- **IPNS** contenthash means the owner can update the site with no new onchain transaction (the gateway resolves the IPNS key fresh each request).
- **Subdomains resolve too**, to any depth the owner registers: `https://send.slow.wei.limo` serves the contenthash of `send.slow.wei`.
- The gateway reads the contenthash live from the contract on each request, so a name published to IPFS works instantly.

## Give an agent an identity

A `.wei` name is a portable, human-readable identity for an autonomous agent — the naming/resolver layer that complements **ERC-8004** (onchain agent identity, which is tokenId-based). One name gives an agent:

- **Name ↔ address** — `setAddr` / `resolve()` so others pay or verify the agent by `agent.wei` instead of a raw `0x…`; `setPrimaryName` makes wallets/explorers show `agent.wei` for its address (reverse resolution).
- **Endpoints & metadata** — `setText(tokenId, key, value)` for `url`, `description`, `com.twitter`, or custom keys (A2A / MCP endpoint, agent-card URI).
- **A hosted agent card / site** — `setContenthash` → served at `https://agent.wei.limo` with zero infra.
- **Fleets** — one parent name mints free subdomains (`worker1.fleet.wei`, `worker2.fleet.wei`), each with its own address and records, up to 10 levels deep.

## Register a name (commit-reveal)

Front-running protection requires two transactions with a wait between them.

```bash
SECRET=0x<32-random-bytes>

# 1) commit (hides the label). makeCommitment is a pure helper.
COMMIT=$(cast call $WNS "makeCommitment(string,address,bytes32)(bytes32)" "alice" $ME $SECRET --rpc-url $RPC)
cast send $WNS "commit(bytes32)" $COMMIT --rpc-url $RPC --private-key $PK

# 2) wait >= 60s (MIN_COMMITMENT_AGE), and reveal within 24h (MAX_COMMITMENT_AGE)
FEE=$(cast call $WNS "getFee(uint256)(uint256)" 5 --rpc-url $RPC)   # 5 = byte length of "alice"
cast send $WNS "reveal(string,bytes32)" "alice" $SECRET --value $FEE --rpc-url $RPC --private-key $PK
```

- **Fee:** `getFee(labelByteLength)`; default **0.001 ETH / year**. Excess ETH is refunded (caller must be able to receive ETH).
- **Timing:** reveal no sooner than **60s** and no later than **24h** after commit.
- **Duration:** 365 days. Renew with `renew(tokenId)` (payable) any time before `expiresAt + 90d` grace ends.
- **Availability:** `isAvailable(label, parentId)` — use `parentId = 0` for a top-level `.wei` name.

## Subdomains

The owner of `alice.wei` creates children for free — no commit-reveal, no fee:

```bash
PID=$(cast call $WNS "computeId(string)(uint256)" "alice.wei" --rpc-url $RPC)
cast send $WNS "registerSubdomain(string,uint256)" "sub" $PID --rpc-url $RPC --private-key $PK
# or registerSubdomainFor(label, parentId, to) to mint to someone else
```

- Depth up to **10** levels. Each subdomain is its own ERC-721 token with its own resolver records and contenthash.
- Subdomains have no expiry of their own but go **stale** if the parent expires or the parent owner re-registers (epoch bump) — stale subdomains resolve empty.
- The parent owner can always reclaim a subdomain label (this burns the old token and clears the prior holder's primary name).

## Resolver writes (token owner only)

```solidity
setAddr(uint256 tokenId, address addr)                       // ETH address
setContenthash(uint256 tokenId, bytes hash)                  // IPFS/IPNS/Swarm
setAddrForCoin(uint256 tokenId, uint256 coinType, bytes addr)// any SLIP-44 coin
setText(uint256 tokenId, string key, string value)           // text records
setPrimaryName(uint256 tokenId)                              // reverse record (owner or resolved addr)
```

## Gotchas

- **Grace period returns empty.** Between `expiresAt` and `expiresAt + 90d`, the name is inactive: resolver reads return empty, resolver writes revert, transfers are blocked. Renew still works.
- **Re-registration wipes records.** After a name fully expires and is re-registered, a `recordVersion` bump clears all resolver data (address, contenthash, coins, text) without any delete gas.
- **Normalization is caller's job for Unicode.** Onchain `normalize(label)` only lowercases ASCII. For emoji/Unicode labels, normalize with **ENSIP-15** offchain before hashing/registering; `isAsciiLabel(label)` tells you if the cheap onchain path is enough. Labels are 1–255 bytes.
- **Don't hallucinate the address.** Verify `0x0000000000696760E15f265e828DB644A0c242EB` on a block explorer before sending value.

## Libraries & links

- **`wns-utils`** (npm) — namehash/tokenId, encode/decode contenthash, resolver reads. Zero-config for JS/TS.
- **`@1001-digital/ethereum-names`** (npm) — one resolver for **WNS + ENS + GNS** (Gwei Name Service, a `.gwei` fork) names.
- **Gateway:** `wei.limo` / `wei.is` / `wei.domains` (self-hostable; plain ESM, zero deps).
- **App / register:** https://wei.domains  ·  **Source:** https://github.com/src-company/wei-names
