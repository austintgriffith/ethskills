# Deploy

Use for release preparation or an explicitly authorized deployment. Preparation remains useful when the mutation itself is not yet authorized.

1. Identify exactly what releases: contracts, frontend, indexer, configuration, or a combination. Read ship's relevant phase plus wallets and applicable provider/project guidance. Read frontend-playbook for frontend release checks, scoped to the detected framework and hosting target.
2. Pin source/build revision, compiler/profile, constructor/initializer arguments, library links, owner/admin roles, intended chain ID and release target. Resolve addresses from verified artifacts and current chain evidence. Check upgrade storage and implementation compatibility when applicable.
3. Complete build, tests, relevant security/readiness review and artifact inspection before requesting any missing authorization. For transactions, prepare a reviewable operation with destination, function/arguments or deployment artifact, value, network, sender role, cost estimate and expected effects. Simulate using supported tooling; simulation is evidence with a block/context, not a guarantee.
4. Establish the recovery path: rollback/redeploy for hosted assets; pause, upgrade or forward repair for contracts as actually supported. State irreversible effects. Confirm required independent review covers the release revision.
5. Execute only the concrete mutation covered by authorization. Check observed chain/account against the prepared target immediately before signing. Keep secrets in the approved signer/environment. Bound retries; reconcile receipt, nonce and state before considering a replacement or rebroadcast.
6. Record deployment transaction and receipt, contract code and initialized state, source-verification result, published revision and URL as applicable. Route post-release behavior to Verify against the actual target. Explorer verification, deployment success and application success are distinct results.
7. Report the released target and evidence, or the prepared artifact and exact blocked action. Do not create PRs, publish, fund accounts or send announcements as implied release chores.
