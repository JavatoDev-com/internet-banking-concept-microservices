# Coding Assistant Process Guide

This file governs how every development session runs. Read it in full before starting any work.

---

## Development Session Flow

### Step 0 — Branch Check (Hard Gate)

**Before anything else**, run:

```bash
git branch --show-current
```

- If the branch is `main` or `develop` → **stop immediately**. Respond with:

  > "You are on the `{branch}` branch. Development must happen on a feature branch. Please switch to or create a feature branch and come back."

  Do not proceed. Do not create files. Do not ask questions.

- If the branch is anything else → continue to Step 1.

---

### Step 1 — Open the Session

Respond with a single line that frames the work:

```
development: {brief topic derived from what the user said}
```

Example: `development: fix expired token handling for re-authentication flow`

Then ask exactly one question:

> "What are you planning to build or change here?"

Wait for the user's answer. The user must own the plan.

---

### Step 2 — Assess the Plan

Read the user's plan. Take one of two paths:

**Path A — Plan is clear enough to act on**
No further questions. Go directly to Step 3.
A plan is clear enough when you know: what changes, in which layer/platform, and what the expected outcome is.

**Path B — Plan has genuine gaps**
Ask only the questions that are actually blocking you from starting. Be specific and direct. Do not ask for information you can derive from the codebase yourself.

Examples of valid clarifying questions:
- "Should this affect all platforms or only Threads?"
- "Do you want a new endpoint or should this happen inside the existing token refresh flow?"
- "Is this additive or does it replace the current behaviour in `AuthDataProcessorService`?"

Examples of questions you should NOT ask (derive these yourself):
- "Which files will be affected?" — read the codebase
- "Should we follow existing patterns?" — yes, always
- "Any deadline?" — not relevant to implementation

Once the gaps are filled, go to Step 3.

---

### Step 2a — Check for an Existing Decision Log / Task on This Requirement

Before creating new files, search `ai-dlc/decision-logs/`, `ai-dlc/tasks/`, `ai-dlc/api-contracts/`, and `ai-dlc/mq-contracts/` for a file that already covers the same requirement or feature.

- **No match found** → continue to Step 3, create new files as normal.
- **Match found** → show the user the existing file's path and a short summary of its scope, then ask:

  > "This looks like the same requirement as `{existing file}`. Should I amend that file, or create a new one?"

  - **Amend** → reuse the existing decision log and task file (same filenames/timestamp). Add an `AMENDMENTS` entry to the decision log (date + reason), update `IMPLEMENTATION_NOTES` and acceptance criteria in the task file, and move `STATUS` back to `IN_PROGRESS` for this round of work. Do the same for the related API contract or MQ contract file if this round touches them.
  - **New** → continue to Step 3 with a fresh timestamp.

Rule: **one decision log + one task file per requirement.** Don't let a single feature accumulate `dl-`/`task-` files across sessions — amend forward instead of duplicating.

---

### Step 3 — Create the Decision Log

Create `ai-dlc/decision-logs/dl-{unix_epoch}_{HHMMSS}-{prefix}.log` using the template at `ai-dlc/templates/decision-log.template.log`.

Capture:
- The user's plan (verbatim summary)
- Any Q&A from Step 2
- The decisions made (approach chosen)
- Scope: which layers, platforms, endpoints, schema changes
- Acceptance criteria derived from the plan

---

### Step 4 — Create the Task File (STATUS: PENDING)

Create `ai-dlc/tasks/task-{unix_epoch}_{HHMMSS}-{prefix}.log` using **the same timestamp** as the decision log and the template at `ai-dlc/templates/task.template.log`.

Set `STATUS: PENDING`. Fill in the implementation plan steps and acceptance criteria.

---

### Step 5 — Implement (STATUS: IN_PROGRESS)

Update the task file to `STATUS: IN_PROGRESS` and record the start time.

Implement the change. Follow existing codebase patterns. If you discover something significant during implementation that changes the approach, note it in `IMPLEMENTATION_NOTES` in the task file.

---

### Step 5a — Test Coverage Practice

Write unit tests alongside any new service/repository/filter business logic. Use JUnit 5 + Mockito + AssertJ — already available via `spring-boot-starter-test`, no new test dependency needed. Mirror the main package structure under `src/test/java`.

- **Service classes**: mock collaborators with `@Mock`/`@InjectMocks` (Mockito). No real Spring context needed.
- **Repository classes** (two-layer `*BaseRepository implements *ReadDB, *WriteDB` pattern): instantiate the concrete `*BaseRepository` directly with a mocked `*MongoRepository` (via its Lombok-generated constructor) to test default-method business logic without a real or embedded MongoDB.
- **Filters**: mock `HttpServletRequest`/`HttpServletResponse`/`FilterChain` directly. No servlet container needed.
- **Controller-layer (`@WebMvcTest`) and real/embedded-Mongo integration tests** are a separate, larger decision — don't add them casually alongside a routine feature. Raise it explicitly with the user if broader coverage is wanted.

---

### Step 6 — Build Verification

Run:

```bash
./gradlew clean build
```

- **PASS** → record `BUILD_RESULT: PASS` in the task file, continue to Step 7.
- **FAIL** → fix all errors, re-run. Do not mark complete until green. Do not comment out code or skip checks.

---

### Step 7 — API Contracts (MANDATORY when controller layer is touched)

**Trigger:** Any session where a controller file is added, modified, or deleted — no exceptions.
**Skip only if:** Zero controller files were changed in the session.

Create `ai-dlc/api-contracts/api-contract-{unix_epoch}_{HHMMSS}-{prefix}.log` using the **same timestamp** as the decision log and task file.

Each changed or new endpoint must be documented with:
- HTTP method and full path
- Required headers (`Authorization`, `Content-Type`, etc.)
- Request body (if applicable) as a JSON example
- Success response example with HTTP status code
- All curl commands must be valid, copy-paste ready, and importable to Postman

Example:

```bash
curl --location 'http://localhost:8080/api/v1/example' \
--header 'Authorization: Bearer {{token}}' \
--header 'Content-Type: application/json' \
--data '{
  "field": "value"
}'
```

---

### Step 7a — MQ Contract (when applicable)

If this session introduced or changed **any** MQ contract element — a new queue, a new exchange, a new routing key, a new or changed event/message schema, or a change in who produces vs. consumes a message — create `ai-dlc/mq-contracts/mqc-{unix_epoch}_{HHMMSS}-{prefix}.log` using **the same timestamp** as the decision log/task file for this session, and the template at `ai-dlc/templates/mq-contract.template.log`.

This file is the artifact handed to other API teams (e.g. socialic-user-service, socialic-connector-service) who need to produce or consume these messages. It must capture, per routing key:
- Exchange, queue, and routing key names (exact strings, not just the `application.yml` property key)
- Direction: which service produces, which service(s) consume
- Full payload schema (field name, type, required/optional, meaning)
- An example JSON payload
- Ack/retry/error-handling semantics the other side needs to know (e.g. manual ack, dead-letter routing, idempotency expectations)
- Any known follow-up work (e.g. "producer side not yet implemented in service X")

If no MQ changes were made this session, skip this step entirely — do not create an empty contract file.

---

### Step 8 — Mark Complete (STATUS: COMPLETE)

---

Update the task file:
- `STATUS: COMPLETE`
- `Completed at: {timestamp}`
- `BUILD_RESULT: PASS`
- All acceptance criteria checked: `[ ]` → `[x]`

Update the decision log:
- All acceptance criteria checked: `[ ]` → `[x]`
- If any decisions changed during implementation, add an `AMENDMENTS` entry with date and reason.

If Step 7a produced an MQ contract file, mention it explicitly in the completion summary so the user knows it's ready to hand off to other teams.

Report a brief completion summary to the user.

---

## File Naming

All session files share the same timestamp from the moment the session starts:

```
ai-dlc/decision-logs/dl-{unix_epoch}_{HHMMSS}-{prefix}.log
ai-dlc/tasks/task-{unix_epoch}_{HHMMSS}-{prefix}.log
ai-dlc/api-contracts/api-contract-{unix_epoch}_{HHMMSS}-{prefix}.log  ← when controller is touched
ai-dlc/mq-contracts/mqc-{unix_epoch}_{HHMMSS}-{prefix}.log            ← when MQ contract changes (Step 7a)
```

Example:
```
ai-dlc/decision-logs/dl-1750330200_143000-reauth-flow.log
ai-dlc/tasks/task-1750330200_143000-reauth-flow.log
ai-dlc/api-contracts/api-contract-1750330200_143000-reauth-flow.log
ai-dlc/mq-contracts/mqc-1750330200_143000-reauth-flow.log
```

`{prefix}` = short kebab-case label, ≤ 5 words, derived from the topic.

---

## Folder Structure

```
ai-dlc/
├── coding-assistant.md              ← this file
├── templates/
│   ├── decision-log.template.log
│   └── task.template.log
├── decision-logs/
│   └── dl-{ts}_{time}-{prefix}.log
├── tasks/
│   └── task-{ts}_{time}-{prefix}.log
├── api-contracts/
│   └── api-contract-{ts}_{time}-{prefix}.log
└── mq-contracts/
    └── mqc-{ts}_{time}-{prefix}.log   (only when Step 7a applies)
```

---

## Rules

| Rule | What it means |
|------|---------------|
| Branch gate | `main` or `develop` → reject, full stop |
| User owns the plan | Always ask "what are you planning?" — never assume or propose a plan upfront |
| Questions only when blocked | Ask only what you cannot derive yourself; keep it to one round if possible |
| Both files always | Decision log + task file created before any code is written |
| Same timestamp | DL, task file, api-contract, and mq-contract share the exact same `{ts}_{time}` prefix |
| Dedupe check | Before creating new files, search for an existing DL/task on the same requirement; confirm with the user whether to amend or create new — established 2026-07-22 |
| One file per requirement | Amend the existing DL/task/contract file forward instead of creating a new one for the same requirement — established 2026-07-22 |
| Build must pass | `./gradlew clean build` green before COMPLETE — no exceptions |
| Tests alongside code | New service/repository/filter logic ships with JUnit5/Mockito unit tests — established 2026-07-22 |
| API contracts mandatory | Any controller add/change/delete → api-contract file required before marking COMPLETE |
| MQ contract on MQ changes | Any new/changed queue, exchange, routing key, or event schema → `ai-dlc/mq-contracts/mqc-{ts}_{time}-{prefix}.log` before COMPLETE — established 2026-07-22 |
| Production system | No speculative changes, no commented-out bypasses |