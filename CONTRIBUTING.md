# Contributing to ethskills

PRs from humans and agents are welcome. Before submitting, understand the bar:

## The Rule

**Every line must either fill a verified LLM blind spot OR be something the agent needs to teach the human.**

If a stock LLM already knows something *and* the human doesn't need to hear it, it doesn't belong here. But some content exists because the agent is a teacher — the human needs to learn about gas costs, security patterns, or why Ethereum matters, and the agent needs accurate material to teach from. Both are valid reasons for a line to exist.

## How to Evaluate a Change

Before adding or modifying content, run the triage process:

1. **Spawn a fresh LLM** — no tools, no skills, no web access. Pure training data.
2. **Give it a realistic task** that exercises the content you're proposing. Don't ask "do you know X?" — ask it to *build something* and examine what it produces.
3. **Classify each item** in your proposed change:
   - 🔴 **LLM blind spot** — consistently gets this wrong → **keep**
   - 🟣 **Human needs to learn this** — the agent knows it, but needs to teach it accurately → **keep**
   - 🟡 **Knows but skips** — knows the concept, won't do it unprompted → **compress to one line**
   - 🟢 **Does this naturally** — any competent model does this already AND human doesn't need teaching → **cut**

Full methodology with worked examples: [research/triage-methodology.md](https://github.com/austintgriffith/ethskills-research/blob/master/research/triage-methodology.md)

## Anti-Patterns

- **Don't trust intuition.** "I think agents get this wrong" is not evidence. Run the test.
- **Don't ask leading questions.** The LLM will say "yes I know that." Make it *demonstrate* knowledge by building.
- **Don't keep content because it's correct.** Correct ≠ necessary. A lot of correct information is already in training data.
- **Don't pad skills with training-data-tier knowledge.** A 95-line skill that's all blind spots is more effective than a 205-line skill where half is noise.

## PR Checklist

- [ ] Ran a baseline test against a stock LLM (no tools/skills)
- [ ] Every item classified as 🔴, 🟡, or 🟢
- [ ] 🟢 items removed
- [ ] 🟡 items compressed
- [ ] Content verified against onchain reality (not LLM-generated "facts")
