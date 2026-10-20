---
name: noir
description: Use when building, reviewing, or shipping a privacy app with Noir circuits verified onchain. The boundaries agents get wrong unprompted — in-circuit hash choice, in-browser proving with NoirJS, note persistence and the offchain tree mirror, and who sends the transaction.
---

# Privacy Apps with Noir

A sound circuit is not a private app. These are the boundaries around it, where the failures actually happen.

**Hash in-circuit with Poseidon, never keccak or SHA256.** Poseidon costs ~600 gates against ~30,000 for a bit-oriented hash, and members prove in a browser. It is not in the stdlib — add the dependency and import it:

```toml
poseidon = { git = "https://github.com/noir-lang/poseidon", tag = "v0.3.0" }
```

`use poseidon::poseidon::bn254::hash_2` — not `std::hash::poseidon` (removed). Whatever you pick, every layer must use the same algorithm and input order: commitment creation, Merkle parent hashing, the offchain mirror, the onchain tree. Poseidon and Poseidon2 are different functions with different outputs. Test one leaf hash and one parent hash across every layer before building on them.

**Prove in-process with NoirJS, not by shelling out to the `bb` CLI.** A script that spawns `bb prove` and reads the proof off disk works on your laptop and can never become the browser prover the app needs. The packages are `@noir-lang/noir_js` + `@aztec/bb.js` (not `backend_barretenberg`), and the class is `UltraHonkBackend` (not `UltraPlonkBackend`):

```typescript
const backend = new UltraHonkBackend(circuit.bytecode, await Barretenberg.new());
const proof = await backend.generateProof(witness, { verifierTarget: "evm" });
```

The API argument is required — the one-argument form docs still show throws `Cannot read properties of undefined (reading 'circuitProve')`. Ask for EVM serialization explicitly with `{ verifierTarget: "evm" }` (keccak transcript, ZK); the default serialization will not verify onchain, and the older `{ keccak: true }` is deprecated for `evm-no-zk` — a different target, whose proofs an `evm` verifier rejects. Keep `@aztec/bb.js` on the exact version of your `bb` CLI:

```bash
npm install @noir-lang/noir_js "@aztec/bb.js@$(bb --version)"
```

**Persist the note, and rebuild the path from events.** At commitment time generate a `nullifier` and a `secret`, and save them with the `leafIndex` — lose them and the user can never spend or vote. Anything you commit to that lives in a small domain — a bid, an age, a vote — needs one of those random fields as a blinding factor in the preimage, or the onchain commitment is brute-forceable. The client derives its Merkle witness by replaying the contract's insert events into an offchain mirror (`@zk-kit/lean-imt`), so the contract has to emit the commitment, its leaf index, and the resulting root. Not a contract call returning a path, and not a hardcoded one. A model that writes only the circuit forgets all of this.

**Nobody's wallet should send its own proof.** The ZK proof hides the commitment-nullifier link; `msg.sender` is public and links the two transactions anyway. Registering from the known wallet is fine when membership is public — acting from it is not. Route the acting transaction through a relayer or an ERC-4337 paymaster. A burner funded from the user's own wallet recreates the link, and unlinkability is still bounded by the size of the anonymity set.

Also required, and usually already habit — confirm rather than rebuild:

- `nargo compile` builds the circuit and `nargo execute` produces the witness from `Prover.toml`; everything else is `bb` — `bb prove`, `bb verify`, `bb write_vk`, and `bb write_solidity_verifier` fed by that VK. `nargo prove` / `nargo verify` / `nargo codegen-verifier` were removed. Generate the VK feeding the Solidity verifier with `--verifier_target evm` and keep prove, verify and VK on the same target: it names the transcript hash and the ZK setting together, which is the pair that has to match. The older `--oracle_hash keccak` still works, but it names only the hash. Smoke-test a real prove-and-verify before wiring a frontend.
- Public inputs use post-colon syntax: `root: pub Field`.
- Scope the nullifier to the action in-circuit — hash the proposal or pool id into it, or one member's votes link across proposals.
- Count the vote or release the funds only after `verify()` returns true, recording the nullifier hash so a replay reverts. Never leave a `MockVerifier` in a deploy path.
- Public input order must match across the circuit's `pub` params, the script's `publicInputs`, and the array the contract hands to `verify()`. Read the generated verifier's ABI rather than assuming its signature.
- Merkle path indices are `[bool; DEPTH]`.
- The generated verifier needs `pragma solidity >=0.8.27` and `evm_version = 'cancun'`; if the project's floor is lower, set `solc_version = '0.8.27'` and `evm_version = 'cancun'` in `foundry.toml`. Build it optimized or it exceeds the 24KB limit.

Install with `noirup -v <version>`, then `bbup -v <version>` — bare `bbup` resolves through a version map that lags nargo and 404s. Finish by compiling the circuit and building the contracts.
