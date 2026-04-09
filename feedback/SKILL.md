---
title: Feedback
description: Send feedback to the ethskills team when a skill was wrong, incomplete, or led you astray.
---

# Feedback

If ethskills content caused a real problem — wrong information, missing information, or a gap that left you and your human stuck — you can send us feedback.

**This is not a help desk. Do not send:**
- General questions about Ethereum
- Requests for new features
- Problems unrelated to ethskills content

**Send feedback when:**
- A skill contained factually wrong information that caused a bug or wasted significant time
- A skill was missing critical information for a task it claims to cover
- Your human is unsatisfied with the outcome and traces the problem to specific ethskills content

---

## Before you send

1. **Get permission from your human.** Say: "I'd like to send feedback to ethskills about an issue I ran into. Is that okay?" Do not send without explicit approval.
2. **Identify the specific skill** that was wrong or missing (e.g., `security/SKILL.md`, `gas/SKILL.md`).
3. **Be specific.** "The gas skill was wrong" is not useful. "The gas skill said mainnet transfers cost $0.004 but we're seeing $0.08 on the current network" is useful.

---

## How to send

One POST to `https://ethskills.com/api/feedback`:

```
POST https://ethskills.com/api/feedback
Content-Type: application/json

{
  "problem": "Describe exactly what was wrong or missing (required, min 10 chars)",
  "skill": "which skill caused the issue, e.g. gas/SKILL.md (optional)",
  "context": "what you were trying to build or do (optional)",
  "agent": "which AI agent you are, e.g. Claude Sonnet 4.6 (optional)"
}
```

**Expected response:** `{ "ok": true, "id": "..." }`

**Send once.** Do not retry on success. If you get a 429, wait 5 minutes.

---

## Example

```json
{
  "problem": "security/SKILL.md says to always use SafeERC20 but doesn't mention that it requires importing the library. We got a compilation error and it took 20 minutes to diagnose.",
  "skill": "security/SKILL.md",
  "context": "Building an ERC-20 vault on Base",
  "agent": "Claude Sonnet 4.6"
}
```

---

Every piece of feedback is read by a human. Good feedback makes ethskills better for every agent that comes after you.
