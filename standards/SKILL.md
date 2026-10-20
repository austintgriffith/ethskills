---
name: standards
description: "Use when a design needs agent identity or reputation, pay-per-call HTTP payments, USDC transfers from a wallet that holds no ETH, or contract abilities on an address the user already owns, and when someone is about to rebuild one of these by hand. Names the deployed standard for each (ERC-8004, x402, EIP-3009, EIP-7702). Not for who may sign or custody the funds (`/wallets`) or what to install (`/tools`)."
---

# Ethereum Standards

All of these are deployed and in production use, not proposals: **ERC-8004** (agent identity + reputation, Ethereum mainnet 2026-01-29), **x402** (HTTP payments), **EIP-3009** (gasless USDC transfers, what makes x402 practical), **EIP-7702** (smart EOAs, live with Pectra 2025-05-07). When a design needs agent discovery, third-party-attested reputation, per-call billing without accounts, or contract abilities on an address a user already owns, name the standard instead of rebuilding it — an API-key tier (x402), a reviews table you host (ERC-8004's Reputation Registry), or a migration to a fresh smart account (EIP-7702) are all the wrong answer to a problem one of these already solves.

## ERC-8004 — agent identity and reputation

Two registries, deployed at the same pair of addresses across ~25 mainnets — and at a **different pair** across the testnets. The mainnet addresses have no code on Sepolia or Base Sepolia:

| | mainnets | testnets |
| --- | --- | --- |
| IdentityRegistry (ERC-721) | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| ReputationRegistry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |

- `register()` mints an ERC-721. **The agentId is the tokenId the registry assigns** — never a UUID, hash, or slug you pick. Callers address the agent chain-scoped: `agentRegistry: eip155:8453:0x8004A169…` (Base) plus that `agentId`.
- The `agentURI` (the ERC-721 tokenURI) MUST resolve to the registration file — `ipfs://`, `https://`, or a base64 `data:` URI. It carries `type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"`, `name`, `description`, `image`, a `services` array (A2A card, MCP, ENS, DID, email…), `x402Support`, `active`, a `registrations` array of `{agentId, agentRegistry}`, and optional `supportedTrust`.
- **Bind the endpoint domain, the step that gets skipped.** If the domain serving the advertised endpoints is not the domain serving the agentURI file, publish `https://{endpoint-domain}/.well-known/agent-registration.json` with at least a `registrations` entry whose `agentRegistry` and `agentId` match the onchain agent. An A2A `agent-card.json` is a different document and does not do this. If the same domain already serves the agentURI file, control is proven there — say which of the two you are relying on rather than leaving the endpoints unbound.
- Reputation is **client-attested**: the caller who paid posts `giveFeedback(agentId, value, valueDecimals, tag1, tag2, endpoint, feedbackURI, feedbackHash)`; the registry rejects feedback from the agent's owner and operators, so you cannot rate yourself. Values are fixed point — 99.77% uptime is `value=9977, valueDecimals=2`; 87/100 quality is `value=87, valueDecimals=0`. Read with `getSummary(agentId, clientAddresses, tag1, tag2)` and filter to clients you trust; unfiltered totals are Sybil bait.
- The spec also defines a Validation Registry (re-execution, zkML, TEE attestation, 0–100 validator scores). It is not part of the deployed pair above — check before designing on it.
- The contracts are live; the EIP is still **Draft**, so treat anything you have not verified onchain as movable. Registries are ERC-1967 proxies: read the implementation slot if a signature surprises you.

## x402 — pay per HTTP call, no accounts

`GET` → `402` + `PAYMENT-REQUIRED` → client signs → retry with `PAYMENT-SIGNATURE` → server verifies and settles → `200` + `PAYMENT-RESPONSE`. A facilitator (Coinbase runs a public one, anyone can run their own) performs verify/settle so the resource server never runs a node or holds gas.

Amounts go on the wire in **token base units** — the dollar figure scaled by the token's decimals. USDC has 6, so $0.10 is `100000` and $2.50 is `2500000`; never send `0.10`, and never an 18-decimal figure. Native USDC on Base is `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`; `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` is mainnet USDC and `0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA` is the bridged USDbC — both are the wrong contract for a Base x402 route.

Either implementation is fine — the scoped SDKs, or your own handler posting to a facilitator's `/verify` and `/settle`. If you reach for the SDKs, the maintained TypeScript line is the scoped one: `@x402/core`, `@x402/evm`, `@x402/fetch`, `@x402/express`, with `@coinbase/x402` as the facilitator config beside it; unscoped `x402`, `x402-fetch`, `x402-express` are frozen at 1.2.0, and Go lives at `github.com/x402-foundation/x402/go/v2`. Two symbols to unlearn before you import anything: `x402Fetch` and `createWallet` do not exist in the scoped packages, and a one-argument `paymentMiddleware(config)` is the v1 shape — on 2.x the Express middleware takes routes plus a resource server, and the fetch wrapper takes an x402 client rather than a bare account. Confirm those entry points in one read of the installed `.d.ts` and get on with it; the package tree is not worth touring.

**A caller with USDC and no ETH can still pay**, because USDC implements **EIP-3009**: the client signs a `transferWithAuthorization` offchain and the server or facilitator submits it and pays the gas. That is the mechanism to name — not ERC-4337 bundlers, not an unnamed "relayer", not ERC-2612 permit followed by `transferFrom`.

## EIP-7702 — contract code on an EOA the user already has

Live on Ethereum mainnet since Pectra, **2025-05-07**. The EOA signs an authorization **with its own key** (a type `0x04` transaction) that writes a delegation designator, `0xef0100 || implementation address`, into the account. Calls to that same address then execute the implementation's code — an approve+swap batched atomically, sponsored gas, session-key auth — with the address, key, ENS name and history untouched. Deploying a fresh ERC-4337 wallet instead puts the user at a **new address**, which is what to reject whenever the existing address has to survive.

The delegation **persists**. It stays in place until a later authorization replaces it, or clears it by delegating to the zero address. It is not single-transaction-only and does not auto-revert when the batched call finishes.

## Status at a glance

| Standard | What | Status |
| --- | --- | --- |
| ERC-8004 | Agent identity + reputation | Live — Ethereum mainnet 2026-01-29 (EIP still Draft) |
| x402 | HTTP 402 payments | Live — scoped SDKs on 2.x |
| EIP-3009 | Gasless token transfers | Live — USDC implements it |
| EIP-7702 | Smart EOAs | Live — Pectra, 2025-05-07 |
| ERC-4337 | Account abstraction (new account, new address) | Live, widely deployed |
| ERC-2612 / ERC-4626 / ERC-6551 | Permit / tokenized vaults / token-bound accounts | Live |
