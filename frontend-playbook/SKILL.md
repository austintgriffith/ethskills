---
name: frontend-playbook
description: "Use when working inside a Scaffold-ETH 2 app: running it against a local chain or a fork of a real chain, demoing on that fork, or shipping it as a static export to IPFS or ENS. Not for rehearsing or running a live contract deployment (`/orchestration`)."
---

# Frontend Playbook

Follow this workflow; do not treat a green build or successful upload as proof that the intended app shipped.

## Start with the requested stack

When the user wants Scaffold-ETH 2 or has not selected a stack for a conventional contract-plus-frontend dApp, use its generator:

```bash
npx create-eth@2.0.23 # Tested version; update deliberately
```

Use the generated Foundry/Next.js monorepo, wallet integration, contract hooks, and components. Respect an explicitly requested alternative stack.

## Choose the local chain deliberately

- Use `yarn chain` for isolated contracts, mocks, and unit tests.
- Use `yarn fork --network <chain>` when behavior depends on deployed protocols, tokens, balances, or other real chain state.
- In fork mode, point the frontend at the local Anvil network (`chains.foundry`, chain ID 31337), not the upstream chain being copied. Switch to the real target chain only for a real deployment.

A fork also grants powers the real chain does not. Fund demo identities from state that already exists rather than deploying a mock token:

```bash
cast rpc anvil_impersonateAccount <whale>
cast send <token> "transfer(address,uint256)" <demo-account> <amount> \
  --from <whale> --unlocked
```

`anvil_setBalance` and `anvil_setStorageAt` are equivalent overrides when no suitable holder exists. Nothing here is broadcast; the fork is a local copy.

Anvil normally mines only when a transaction arrives, so between transactions the latest block and `block.timestamp` remain frozen; the next transaction advances time in one jump. This silently breaks live deadlines, expiry, and vesting displays even when `vm.warp` unit tests pass. For continuous behavior, enable interval mining:

```bash
cast rpc anvil_setIntervalMining 1
```

For a frozen live demo, enable interval mining. Mining a single block with `evm_mine` restamps `block.timestamp` once and it freezes again immediately; manual mining and `evm_increaseTime` are for controlled single-step tests, not a running demo. Add `--block-time 1` to the fork script when the project should always run that way.

## Build a static IPFS release

Configure the IPFS build for static export, route directories, and static images:

```typescript
if (process.env.NEXT_PUBLIC_IPFS_BUILD === "true") {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images = { unoptimized: true };
}
```

Set the production origin before building so Open Graph URLs and images do not resolve to localhost. Then remove old artifacts and rebuild:

```bash
cd packages/nextjs
rm -rf .next out
NEXT_PUBLIC_PRODUCTION_URL="https://<production-domain>" \
  NEXT_PUBLIC_IPFS_BUILD=true \
  yarn build
```

On Node 25, the built-in `localStorage` global can exist without the standard Web Storage methods when no backing file is configured; libraries detect it and crash on calls such as `getItem()` during static prerender. Apply a process-level remedy inherited by build workers, not only code in `instrumentation.ts` or `next.config.ts`. Depending on the app, use one of:

```bash
NODE_OPTIONS="--localstorage-file=.node-localstorage"
NODE_OPTIONS="--no-experimental-webstorage"
```

## Verify before and after upload

Before uploading, confirm the expected change is in `out/`, that every route emitted its own directory, and that generated metadata carries the production origin:

```bash
ls out/*/index.html # One directory with an index.html per route
```

After uploading:

1. Record the CID. An unchanged CID means the uploaded bytes are identical; check the build output and upload target before blaming gateway caching.
2. Load the root and at least one non-home route through the gateway. Root success does not prove exported routes resolve.

   ```bash
   curl -s -o /dev/null -w "%{http_code}" -L "https://<gateway>/ipfs/<cid>/debug/" # Expect 200, not 404
   ```

3. Verify the Open Graph image and URL use the production origin.
4. For ENS, update the content hash only after the deployed CID has been reviewed and approved, then confirm the resolver and public gateway serve that CID.

Do not claim the release is complete until these checks pass.
