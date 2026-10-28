# Design compatibility at affected boundaries

Reuse the shared [discovery profile](../../tools/references/project-discovery.md) and [tool selection rules](../../tools/references/tool-adapters.md). This reference adds design questions, not a separate discovery system or a claim of tested version support.

For each affected boundary record the triggering files/imports, resolved versions, existing command or API, observed contract, failure condition and proposed check. A manifest range alone does not prove the installed API. Prefer installed types/help and matching official release documentation when resolution is unclear. Do not install or upgrade to make a proposed sketch compile.

| Boundary | Evidence to inspect | Design failure to resolve |
|---|---|---|
| Compiler and network | Pragma plus resolved compiler; Foundry profile/remappings or Hardhat configuration/plugins; optimizer, EVM target and target-chain support | New syntax, opcodes or imported library require a different compiler or unsupported network behavior. |
| Contract integration | Existing ABI, concrete call sites, deployment chain/address identity, protocol version and token units | A signature or unit changes while callers still encode or interpret the old contract; an unverified address is assumed compatible. |
| Proxy upgrade | Actual proxy/implementation, installed OpenZeppelin version, initializer/reinitializer path, upgrade authority and storage layout artifacts | Layout or inheritance changes corrupt existing slots; initialization can repeat or is unreachable; the assumed signer cannot upgrade. Retain the existing proxy pattern and propose the installed compatible layout check. |
| Client and wallet | ethers major or viem client types, wagmi wrappers, receipt handling, chain switching, account permissions and generated bindings | Submission is presented as success, stale bindings encode old calldata, numeric types change, or a Safe/UserOperation result is mistaken for inner execution. Preserve project wrappers, including Scaffold hooks where actually installed. |
| Indexer and consumers | Event signatures/indexing, generated schema/types, start block, ingestion/cache boundaries and reorg assumptions | An ABI/event change silently loses indexed history, replay duplicates actions or consumers see inconsistent state. Specify versioning/backfill strategy only where needed. Checks that mutate data require an isolated authorized database. |
| Host and SDK | Actual build mode/base path, SDK version, protocol deployment, RPC/provider configuration and service authority | A static-only assumption breaks SSR, a new route fails on the configured host, or a required wallet/indexer vendor has no supported fallback. |

Treat proposed migrations as explicit design scope with their own compatibility and authorization needs. A read-only layout inspection or local type check has a different boundary from an upgrade broadcast, wallet signature or shared database backfill. If a check cannot run, name the missing capability and limit the corresponding claim.
