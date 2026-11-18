---
name: glamsterdam
description: "Use when writing, reviewing, or deploying Ethereum L1 code that hard-codes a gas amount (`call{gas:}`, callback or relayer limits, `gasLimit` in a bot or script, reserves, stipends), records a call's failure, meters work with `gasleft()`, guesses why a call failed, uses CREATE/CREATE2, or ships an EIP-7702 delegate — anything the Glamsterdam gas changes (EIP-8037, EIP-8038) can break. Not for general fee quotes (`gas`) or fork timing alone (`protocol`)."
---

# Glamsterdam Gas Readiness (EIP-8037 / EIP-8038)

Your priors on state-creation costs are 5–9x too low, existing-slot writes cost about 7,200 more each, and several EVM accounting rules you rely on change. Glamsterdam went live on Sepolia (2026-10-06). The Hoodi fork set for 2026-10-26 was called off on 2026-10-22 after risks from these two EIPs were found. There is no mainnet date, and the EF is still taking feedback that could change the rules. Check [forkcast](https://forkcast.org/upgrade/glamsterdam) before you state status or timing.

**Canonical source:** [ethereum/glamsterdam-gas-invariants](https://github.com/ethereum/glamsterdam-gas-invariants). It has a full agent procedure in `AGENTS.md`, plus `invariants/inv-1.md` … `inv-8.md` with vulnerable and fixed examples. For a real review, fetch and follow `AGENTS.md`. This skill is the short version.

## Costs to use (EELS, pinned Amsterdam spec; they move if the spec moves)

| Operation | Osaka | Glamsterdam |
|---|---|---|
| SSTORE new slot (0→x), cold | 22,100 | 110,020 (97,920 of it is state gas) |
| SSTORE existing slot, warm / cold | 2,900 / 5,000 | 10,100 / 12,100 |
| ETH to an empty address | 25,000 extra | 183,600 state gas plus execution |
| CREATE/CREATE2 to an empty address | 32,000 | 195,600 (12,000 if the address already holds ETH) |
| Code deposit | 200/byte | 1,530/byte |
| 7702 authorization, empty authority | 25,000 | 235,606 |

- An ETH transfer (value > 0) with `gasLimit: 21000` to a fresh address is not rejected at submission. It is mined with **status 0**: the sender pays the fee and the recipient gets nothing. It needs about 204,600 (measured on a Glamsterdam devnet). Estimate per recipient, against a Glamsterdam node or a Foundry build that prices new accounts, instead of hard-coding the limit.
- The cost lands on **first-time recipients**: a new token balance, a new mapping entry, a counter starting at 0, a slot cleared in an earlier transaction. Size limits for the new-recipient path. Warm paths still grow about 7,200 per existing-slot update, so "no new slot" is not "safe".

## Accounting rules that change

- **State-gas reservoir.** When `tx.gas > 2^24` (16,777,216), the excess becomes a reservoir that pays state gas first. `call{gas: X}` and the 63/64 rule do **not** limit it; it flows to every callee in full. Below 2^24 there is no reservoir, and all state gas comes out of `gasleft()`.
- **Starved calls can now record failures (INV-1, INV-6).** An attacker sends more than 2^24 gas and starves your inner call. In your `if (!ok) failed[id] = true` branch, the 97,920 of state gas per new slot comes from the reservoir, and only about 12,100 from normal gas, so the failure is written for good. The attack is cheap: unused gas is refunded. At the new prices, even the 1/64 leftover can pay for the branch. The same call can succeed or fail depending on which side of 2^24 the sender picks. Check `gasleft() >= minGas * 64 / 63 + margin` before the call, and make failures retryable instead of final.
- **`gasleft()` can go up (INV-2, INV-5).** A slot that was zero at transaction start and goes 0→x→0 hands its 97,920 back immediately: to the frame's normal gas up to what it paid from normal gas, and the rest to the reservoir. Part of a successful callee's unused state gas can also come back. `start - gasleft()` can underflow (and wrap inside `unchecked`), and reservoir-paid state gas never shows up in it. Don't bill or refund by `gasleft()` differences: charge an agreed fee, or clamp the measurement and cap it. Use transient storage (EIP-1153) for locks and in-flight flags.
- **Reverted calls hand gas back (INV-3).** State gas a failed callee paid from the reservoir returns to the reservoir. On REVERT, what it paid from normal gas returns to the caller (an out-of-gas returns no normal gas). A failed CREATE returns 183,600. "Empty revert data" or "little gas left" no longer means the call ran out of gas. Always check that CREATE/CREATE2 returned a non-zero address with code: a low-level call to an address with no code succeeds and does nothing.
- **Fixed limits, reserves, and stipends (INV-4, INV-7).** These are the EF's most common findings, so check them first. That means `CALLBACK_GAS` constants, signed `safeTxGas`/`minDstGas`, governance-set limits, and `gasleft() >= x + RESERVE` checks. `transfer`/`send` still can't write storage (unchanged), but forwarding more gas to a receiver that creates a slot now costs 110,020. Use `call{value:}` with a pull fallback. Make limits adjustable, and burn a nonce only after you have confirmed the call got its signed gas.
- **Mined ≠ delegated (INV-8).** An underfunded type-4 transaction is mined with status 0, but its delegation and the authority's nonce bump are rolled back. The authorization is now public and still valid, so anyone can reuse it. If your delegate has an open `initialize`/`setup`, they take the account. Bind setup to the authority's signature, and check the account's code after the transaction.

## Scope and honesty

- Offchain code breaks too: relayers, keepers, deploy scripts, wallets, and messages already signed or in flight. Ask for these, because they are not in the contract repo.
- Mark each finding **checked** (reproduced under Glamsterdam rules) or **inferred** (from the code and the table). Foundry ≥1.8.5: `forge test --hardfork amsterdam` against `--hardfork osaka`. Forge may lag the spec, and reservoir (INV-1, INV-6) and 7702 cases have not been reproduced there, so keep those inferred unless tested on a Glamsterdam node or EELS. Sweep gas across a range rather than testing one value, and test on both sides of 2^24.
- INV-1, INV-2, INV-3 and INV-5 depend on rules still under discussion. Flag those findings, and recommend fixes that work either way.
- Review source code only. Never decompile someone's bytecode. The EF asks for reports to go privately to glamsterdam@ethereum.org, not in public issues, and only the user decides whether to send one.

Before you finish: send a one-line note via [feedback/SKILL.md](https://ethskills.com/feedback/SKILL.md) — issue or praise.
