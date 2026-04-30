---
name: storage
description: Decentralised file storage for Ethereum agents and dApps. Covers IPFS pinning, Arweave permanent storage, and how to pay for storage with USDC via x402. Use when uploading files, hosting static sites on ENS, or storing content that needs to outlive your server.
---

# Decentralised Storage

## What You Probably Got Wrong

**IPFS does not store files permanently.** IPFS is a content-addressing protocol, not a storage service. If nobody pins your file, it disappears. You need a pinning service (Pinata, Filebase) or pin it yourself. "I uploaded to IPFS" means nothing without a pin.

**Arweave is permanent, IPFS is not.** Arweave stores data forever via a one-time payment. IPFS pins expire when you stop paying. Choose based on your use case — most things don't need to be permanent.

**ENS websites use contenthash, not a URL.** An ENS name points to IPFS/Arweave content via an onchain `contenthash` record (EIP-1577). Users access it at `name.eth.limo`. This is NOT the same as setting a URL text record.

**You can pay for storage with USDC over HTTP.** The x402 protocol lets agents pay for IPFS/Arweave uploads inline with the HTTP request. No token approvals, no contract calls — the payment is in the request header.

## Storage Tiers

| Storage | Retention | Payment | Best for |
|---------|-----------|---------|----------|
| CDN (Cloudflare) | 90 days | Free | Previews, temporary files |
| IPFS | 12 months (pinned) | USDC via x402 | dApp assets, metadata |
| Arweave | Permanent | USDC via x402 | NFT media, immutable records |

## Content Addressing (IPFS only)

IPFS uses content hashes — the CID IS the content. Same file always produces the same CID. Deduplication is free, integrity is built in.

Arweave does NOT use content addressing. Transaction IDs are derived from the signature, not the content. Uploading the same file twice produces two different txIds.

```
IPFS CID:    bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
EIP-1577:    0xe3010170... (codec 0xe3 = ipfs, for ENS contenthash)
```

## IPFS Pinning

**Pinata** is the largest pinning service. Others: Filebase, web3.storage, Infura IPFS (deprecated).

```bash
# Pin via Pinata API
curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" \
  -H "Authorization: Bearer $PINATA_JWT" \
  -F "file=@photo.png"
```

**CID versions:** CIDv0 starts with `Qm...` (base58). CIDv1 starts with `bafy...` (base32). Both work. CIDv1 is preferred for new content.

## Arweave

One-time payment, stored forever. Arweave uses ANS-104 bundled transactions (via Irys/Turbo) for sub-second uploads.

## x402 Payments for Storage

The x402 protocol wraps any HTTP request with a USDC payment. When a server returns `402 Payment Required`, the x402 client automatically pays and retries. USDC on Base (chain ID 8453).

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWallet } from "@x402/evm";

const wallet = createWallet(privateKey);
const x402Fetch = wrapFetchWithPayment(fetch, wallet);

// Upload to Arweave — x402 handles payment automatically
const res = await x402Fetch("https://api.objekt.sh/photo.png?storage=arweave", {
  method: "PUT",
  body: formData,
});
```

No token approvals, no contract interactions. The payment settles onchain in the background via EIP-3009 (gasless USDC transfers).

## ENS Content Hosting

### Static site to ENS in 3 steps

1. **Deploy to IPFS** — get a CID
2. **Set contenthash onchain** — points ENS name to the CID (requires ETH for gas)
3. **Access at `name.eth.limo`** — gateway resolves the contenthash

```bash
# Using objekt.sh CLI (OWS wallet + x402 payment)
objekt deploy ./dist -w my-wallet --storage ipfs
# Returns: ipfs://QmRootCID + contenthash

objekt ens contenthash set myname.eth "ipfs://QmRootCID" -w my-wallet --rpc $RPC_URL
# Site live at https://myname.eth.limo
```

### Contenthash encoding

ENS contenthash is EIP-1577 encoded — a hex string that encodes the storage protocol and hash:

```
IPFS:    0xe3010170... (codec 0xe3 = ipfs)
Arweave: 0xe4...      (codec 0xe4 = arweave, see ENSIP-11)
```

Libraries like `@ensdomains/ensjs` and `viem` handle encoding/decoding. Do not construct these by hand.

## objekt.sh

**CLI:** `@objekt.sh/cli` on npm — upload files, deploy sites, manage ENS media.
**MCP:** `@objekt.sh/mcp-upload` on npm — file storage for AI agents via MCP.
**API:** `api.objekt.sh/openapi.json` — full OpenAPI spec.

Wallet signing via Open Wallet Standard (see [wallets skill](https://ethskills.com/wallets/SKILL.md)). Payments via x402.

```bash
# Install
pnpm add -g @objekt.sh/cli

# Upload to IPFS (paid, USDC)
objekt upload photo.png -w my-wallet --storage ipfs

# Upload to Arweave (paid, permanent)
objekt upload photo.png -w my-wallet --storage arweave

# Upload to CDN (free)
objekt upload photo.png -w my-wallet --storage cdn
```

## What Changed in 2025-2026

- **Infura IPFS was deprecated** (Nov 2025). Use Pinata or Filebase.
- **x402 went production-ready** — agents can pay for storage inline with HTTP requests.
- **Arweave Turbo** replaced old bundlr.network for ANS-104 uploads.
- **web3.storage pivoted** to Filecoin-only. Not recommended for simple pinning.
- **ENS websites are real** — multiple projects host production sites via contenthash + eth.limo.

## Further Reading

- **IPFS docs:** https://docs.ipfs.tech/
- **Arweave docs:** https://docs.arweave.org/
- **Pinata:** https://docs.pinata.cloud/
- **x402 protocol:** https://x402.org
- **EIP-1577 (contenthash):** https://eips.ethereum.org/EIPS/eip-1577
- **objekt.sh docs:** https://docs.objekt.sh
- **Open Wallet Standard:** https://openwallet.sh
