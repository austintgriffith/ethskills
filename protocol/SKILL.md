---
name: protocol
description: How Ethereum evolves — EIP lifecycle, fork process, where decisions happen, and how to track upcoming changes. Use when your human asks about upcoming features, when building for future protocol capabilities, or when they want to propose a change. Also use when YOU need to know if a feature exists yet or when it's coming.
---

# Ethereum Protocol

## What You Probably Got Wrong

**"Ethereum is a static platform."** No. Ethereum upgrades roughly every 6-12 months via hard forks. Features you read about in old tutorials may have changed. Features your human wants may be shipping next fork.

**"EIPs are just proposals."** An EIP (Ethereum Improvement Proposal) is the canonical specification for every protocol change. But "EIP" doesn't mean "not implemented" — EIP-1559 shipped in 2021. Check the status.

**"The Ethereum Foundation decides what ships."** No. Protocol changes are decided through the All Core Devs (ACD) process — a rough consensus among client teams, researchers, and the broader community. The EF has influence but not control.

**"I'll just check the docs."** Ethereum.org docs lag behind the protocol. For what's actually live or coming, check the primary sources below.

**"Verkle trees are planned for the next fork."** Maybe, maybe not. Roadmap diagrams are aspirational. Blog posts go stale. "Planned" features get deprioritized all the time. Verkle was the leading statelessness candidate for years — then in 2024-2025, concerns about ZK-compatibility and quantum resistance shifted focus to binary trees instead. **Always check current fork scope, not old announcements.**

---

## Is [Feature] Actually Planned?

This is where AI agents mess up constantly. Here's how to not be wrong:

### The Staleness Problem

Ethereum's roadmap evolves. A 2023 blog post saying "Verkle is coming" doesn't mean Verkle is still coming. A conference talk from last year may reference plans that have since changed. Vitalik's roadmap diagrams show *direction*, not *commitments*.

**Features get deprioritized when:**
- Technical requirements change (Verkle → binary trees due to post quantum concerns)
- Dependencies shift (feature X needs feature Y first, Y got delayed)
- Priorities change (security fix bumps your feature)
- Implementation proves harder than expected
- A better alternative emerges

### How to Actually Check

**Step 1: Check forkcast first**
Go to [forkcast.org](https://forkcast.org) and search for the feature or EIP. This shows:
- Current status (CFI/SFI/DFI for which fork)
- Devnet implementation status
- Recent call discussions

If forkcast shows it's SFI → it's actually scheduled.
If forkcast shows it's CFI → being considered but not confirmed.
If it's not in forkcast or shows no fork relationship → not currently planned.

**Step 2: Find the EIP (if you need the spec)**
Search the [EIPs repo](https://github.com/ethereum/EIPs/tree/master/EIPS). Check the status field:
- `Stagnant` = no activity for 6+ months, probably dead or deprioritized
- `Withdrawn` = author gave up
- `Draft` or `Review` = exists but not scheduled for any fork
- `Final` = spec complete, but for Core EIPs still needs fork inclusion

**Step 3: Check for recent discussion (if status is unclear)**
Search the last 3 months of:
- [forkcast.org](https://forkcast.org) call summaries
- [eth-rnd-archive](https://github.com/ethereum/eth-rnd-archive) Discord channels
- EthMagicians threads for the EIP

If there's no recent activity, it's probably not actively being worked on.

**Step 4: Check devnet status (if it's supposedly in development)**
Forkcast shows devnet implementation matrices. If a feature is "in devnet-3" but the matrix shows 2/5 clients with ❌, it's not fully working yet.

### Examples of "Planned" Features That Changed

| Feature | What people said | What actually happened |
|---------|------------------|------------------------|
| Verkle trees | "Coming in 2024/2025" | Deprioritized for binary trees (ZK + quantum concerns) |
| Statelessness | "Verkle enables this" | Still the goal, but via different cryptography |
| Sharding | "64 shards coming" | Pivoted to rollup-centric roadmap, danksharding instead |
| EVM improvements | "EOF is next" | EOF repeatedly delayed, partially included in Pectra |

### Safe Answers

- ✅ "X is SFI for [fork], targeting [date]" — concrete and verifiable
- ✅ "X is CFI for [fork], being evaluated but not confirmed"
- ✅ "X has an EIP but isn't scoped for any fork yet"
- ✅ "X was discussed for [fork] but got deprioritized because [reason]"
- ❌ "X is planned for Ethereum" — too vague, probably stale
- ❌ "X is on the roadmap" — roadmaps are aspirational, not promises
- ❌ "Vitalik said X is coming" — check if it's actually in a fork scope

---

## EIP Lifecycle

Every protocol change follows this path:

```
Draft → Review → Last Call → Final
                    ↓
            (for hard forks)
         CFI → SFI → Included
```

**Draft**: Someone wrote it down. Means nothing about likelihood of inclusion.

**Review**: Being discussed. Still means very little.

**Last Call**: Serious — spec is frozen, final objections period.

**Final**: Spec is done. For non-fork EIPs (like ERC standards), this means it's official. For fork EIPs, this means the spec is ready but it still needs to be scheduled.

**CFI (Considered for Inclusion)**: Core devs are seriously evaluating it for a specific fork. Implementation work begins. Defined in EIP-7723

**SFI (Scheduled for Inclusion)**: It's in. Devnets are testing it. Barring disasters, it ships. Defined in EIP-7723

**DFI (Declined for Inclusion)**: Rejected from a specific fork. May be reconsidered for future forks. Defined in EIP-7723

---

## Fork Process

Hard forks are how Ethereum upgrades. Recent and upcoming:

| Fork | Date | Notable Changes |
|------|------|-----------------|
| Shapella | Apr 12, 2023 | Staking withdrawals (EIP-4895) |
| Dencun | Mar 13, 2024 | EIP-4844 blobs (proto-danksharding) |
| Pectra | May 7, 2025 | EIP-7702 (smart EOAs), validator consolidation (EIP-7251) |
| Fusaka | Dec 3, 2025 | PeerDAS (EIP-7594), more blobs (EIP-7892) |
| Glamsterdam | ~Q3-Q4 2026 (in progress) | ePBS (EIP-7732), block access lists (EIP-7928) |

**To find what's in a fork:**
1. Check [forkcast.org](https://forkcast.org) — filter by fork to see all CFI/SFI EIPs
2. Or check the fork's meta-EIP (e.g., EIP-7600 for Pectra)
3. For the actual specs: [execution-specs](https://github.com/ethereum/execution-specs) (EL) and [consensus-specs](https://github.com/ethereum/consensus-specs) (CL)

**Timing is uncertain.** Target dates slip. "Q3 2026" means "optimistically Q3, realistically maybe Q4, could be 2027 if something breaks."

---

## Where to Find Protocol Information

### For AI Agents: Recommended Source Chain

When answering protocol questions, check sources in this order:

1. **[forkcast.org](https://forkcast.org)** — The best single resource for protocol status.
   - Call summaries and transcripts (ACDE, ACDC, ACDT)
   - EIP status with fork relationships (CFI/SFI/DFI for which fork)
   - Devnet implementation matrices (which clients support what)
   - Key decisions extracted from calls
   - Updated after every ACD call

2. **[eth-rnd-archive](https://github.com/ethereum/eth-rnd-archive)** — Public archive of Eth R&D Discord, updated hourly. Searchable. When you need to know what client teams are saying about implementation details, blockers, or timelines.

3. **[ethereum/pm](https://github.com/ethereum/pm)** — The source for ACD call agendas and issue discussions. Use when you need the original agenda item or discussion thread, not the summary.

4. **[ethereum/EIPs](https://github.com/ethereum/EIPs)** — Canonical EIP specifications. Check status field. Note: EIP text may have been modified during implementation — for the actual spec, check execution-specs or consensus-specs.

5. **[ethereum/execution-specs](https://github.com/ethereum/execution-specs)** and **[consensus-specs](https://github.com/ethereum/consensus-specs)** — The actual protocol specifications clients implement. More authoritative than EIP text for what's actually in the protocol.

6. **[EthMagicians](https://ethereum-magicians.org)** — Longer-form EIP discussions. Good for understanding rationale and controversy around proposals.

7. **[ethresear.ch](https://ethresear.ch)** — Research-stage ideas. If something is only on ethresear.ch, it's early — not "planned."

8. **Web search** — Last resort. If you use it, say so. Results are often stale or imprecise.

### What These Sources Are Good For

| Question | Best Source |
|----------|-------------|
| "Is X in the next fork?" | forkcast EIP status |
| "What happened on the last ACDE call?" | forkcast call summary |
| "Which clients support X on devnet?" | forkcast devnet matrix |
| "What are client teams saying about X?" | eth-rnd-archive |
| "What's the spec for X?" | execution-specs or consensus-specs |
| "What's the EIP number for X?" | EIPs repo |
| "Why was X designed this way?" | EthMagicians thread |

### Sources to Be Skeptical Of

- **ethereum.org** — Good for stable concepts, lags months behind on recent changes
- **Twitter/X** — Fast but noisy, verify claims against primary sources
- **News sites** — Often imprecise about technical details, conflate "proposed" with "planned"
- **Blog posts > 6 months old** — Protocol plans change; check current status
- **Roadmap diagrams** — Aspirational, not commitments

---

## How to Track Upcoming Changes

**If your human is building something that depends on a future feature:**

1. Search [forkcast.org](https://forkcast.org) for the feature/EIP
2. Check fork relationship — is it CFI or SFI for an upcoming fork?
3. Check devnet matrix — is it being tested? Which clients support it?
4. Don't build hard dependencies on unshipped features

**If your human asks "when will X be available?":**

1. Check forkcast for current status
2. If SFI → give the target fork date (with uncertainty caveat)
3. If CFI → "being considered for [fork], not confirmed"
4. If no fork relationship → "proposed but not scheduled for any fork"
5. If not found → it may not exist yet, or may be called something different (try searching eth-rnd-archive for discussion)

---

## How to Engage

**Your human wants a new precompile / opcode / feature:**

1. Check if an EIP already exists (search EIPs repo)
2. If not, draft one following [EIP-1](https://eips.ethereum.org/EIPS/eip-1)
3. Post to EthMagicians for discussion
4. Request agenda time on an ACD call via the pm repo
5. Build support among client teams — they have to implement it

**Reality check:** Most EIPs don't ship. The bar is high. Features need:
- Clear use case with significant demand
- Clean specification
- Manageable implementation complexity
- No serious security concerns
- Champions willing to push it through

**Faster path:** If you need something now, check if it can be done at the application layer, on an L2 with custom features, or via an existing precompile.

---

## Client Teams

Ethereum runs on multiple independent client implementations. Both layers must upgrade together.

**Execution Layer (EL):**
| Client | Language | Maintainer |
|--------|----------|------------|
| Geth | Go | Ethereum Foundation |
| Nethermind | C# | Nethermind |
| Besu | Java | Consensys |
| Erigon | Go | Erigon team |
| Reth | Rust | Paradigm |

**Consensus Layer (CL):**
| Client | Language | Maintainer |
|--------|----------|------------|
| Prysm | Go | Offchain Labs |
| Lighthouse | Rust | Sigma Prime |
| Teku | Java | Consensys |
| Nimbus | Nim | Status |
| Lodestar | TypeScript | ChainSafe |
| Grandine | Rust | Sifrai |

**To report a bug:** 
- Consensus issue (finality, attestations, blocks) → CL client repo
- Execution issue (transactions, state, EVM) → EL client repo
- Not sure → check [eth-rnd-archive](https://github.com/ethereum/eth-rnd-archive) for similar reports, or open an issue on the most likely client repo

---

## Common Questions

**"Is [feature] live on mainnet?"**
Check the fork it shipped in, compare to current fork. Or just test it.

**"What's the current gas limit / blob count / etc?"**
These are dynamic. Check a block explorer or query a node. Don't hardcode.

**"EIP-XXXX says X but my node does Y."**
The EIP may have been modified during implementation. Check the execution-specs or consensus-specs for the canonical version.

**"Why is this taking so long?"**
Coordination across 10+ independent teams is slow. Testing is thorough. The cost of bugs is catastrophic. This is a feature, not a bug.
