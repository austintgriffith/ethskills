---
name: wallets
description: "Use when deciding who or what may sign for funds: an agent or script signing unattended, a treasury's custody, a multisig's owners and threshold, a private key that ended up in a prompt or a repo, or whether a user must accept a new address to act from the one they already have. Not for which standard to build on (`/standards`)."
---

# Wallets

## Authority first, storage second

Where a key lives bounds *who* can use it. It does not bound *what* it can do. A KMS, an HSM, or an encrypted keystore wrapped around a key that can spend the whole treasury is still a design where one stolen key takes everything.

So decide the authority before the storage. Whatever signs unattended — an agent, a bot, a deploy script — should be able to move only what you would accept losing: a bounded float, an on-chain allowance, or a scoped module, with the principal behind a threshold that key alone cannot meet. Then say plainly, in whatever you hand over, which operations need a human signature — moving principal, raising the agent's own limit, changing who may sign — and how a human revokes or evicts that signer without its cooperation.

A multisig does not require multiple people. One person holding keys on separate devices meets a threshold of two alone, and an attacker then needs several devices rather than one — which is why a lone hardware wallet is not the most secure way to hold a treasury.

## An EOA does not have to migrate to batch

An existing EOA can sign an authorization delegating it to contract code and execute a batch atomically in a single transaction — same address, same history, no smart-contract wallet to deploy and no funds to move (EIP-7702, live on Ethereum mainnet since Pectra, May 2025). Reach for it before telling a user they have to accept a new address.

That delegation persists. It stays in effect until it is replaced or explicitly cleared: it is not scoped to the transaction that set it, and a transaction whose inner call reverts can still leave the delegation standing. Removing it takes a new signed authorization; decommissioning the delegate contract does nothing.

## Before anything signs

- **A key that arrived in a prompt, a chat, or a ticket is burned.** Say so, rotate it, replace the account — do not fund it on mainnet.
- **`.gitignore` before the first push, not after.** A committed secret is compromised in seconds and stays compromised; deleting the commit does not undo it. Nothing the delivered code signs with may be baked into the repo — no hardcoded value, default, fallback, or filled-in example.
- **Anything that moves funds gets a gate.** Print the amount, the checksummed destination, and the gas cost, then stop until a human says yes. Estimate gas and price it live; never from a remembered ETH price.
