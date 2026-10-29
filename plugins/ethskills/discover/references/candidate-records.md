# Candidate records

Use these fields for a comparison or handoff. A short task can return the same facts in prose. Do not create a persistent registry unless the task needs one.

| Field | Record |
|---|---|
| Task gap | Missing knowledge or operation, project versions, and relevant target. |
| Catalog evidence | Catalog URL, commit, retrieval date, and relevant entry or section. |
| Candidate identity | Provider, repository or service URL, kind, and actual skill or tool path. Separate a repository's skills when their purposes differ. |
| Source pin | Commit and paths read. Pin local references to that commit. Record external document revisions or retrieval dates separately. |
| Freshness evidence | Relevant path history, archive or replacement notices, versioned primary documentation, and current claim checks. State unknowns. |
| Relevance | Which part of the task the candidate helps and which instructions do not apply. |
| Verdict | `use`, `qualified`, `reject`, or `unverified`, with the reason and usable scope. |
| Availability | Readable instructions, installed dependencies, callable tools, authenticated access, and authorized operations. Mark unknown states explicitly. |
| Next action | What the task owner can do now, what requires setup or additional authorization, and the fallback. |

A source without immutable revisions needs a retrieval date and, when practical, a content digest or retained public snapshot. Do not describe that evidence as commit-pinned. Never retain private responses or temporary authenticated URLs in a shared record.

For a qualified skill, name excluded claims. For example, an audit checklist may fit Solidity 0.8 while its obsolete scanner command cannot be used. The verdict covers the checklist only. Scanner availability and execution remain separate.

Do not copy arbitrary upstream metadata into an executable configuration. Record proposed commands as text until their source, behavior, target, and authorization have been assessed.
