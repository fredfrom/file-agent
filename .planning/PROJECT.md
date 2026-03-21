# File Agent

## What This Is

An AI agent that navigates construction project documents like a filesystem. Users ask natural language questions about a construction project, and the agent answers by executing bash commands (ls, cat, grep) against a virtual in-memory filesystem of project documents. The interface and all documents are in German, targeting German-speaking construction professionals.

## Core Value

The architectural demonstration: filesystem abstraction over documents is a viable alternative to vector search / SQL queries for document navigation. The agent "thinks in bash" — and that thinking is visible to the user.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Virtual filesystem loaded with realistic German construction documents at startup
- [ ] Agent receives natural language questions and navigates the filesystem using bash commands (ls, cat, grep) via just-bash
- [ ] Agent loop powered by Vercel AI SDK with Anthropic Claude as the model
- [ ] Visible agent trace — user sees every bash command the agent runs before the final answer
- [ ] Final answer includes citations referencing which documents were used
- [ ] Simple Next.js page with text input — German UI
- [ ] Realistic folder structure reflecting actual construction project organization
- [ ] Document corpus: meeting minutes (Besprechungsprotokolle), email thread, contract clause, punch list, and similar — all in German
- [ ] Deployable on Vercel
- [ ] Public GitHub repo with clear README explaining the architectural decision

### Out of Scope

- Database or persistence layer — in-memory filesystem only
- Document ingestion pipeline — documents are hardcoded at startup
- Vector search / embeddings — the whole point is to avoid this
- Authentication or user management — internal prototype
- Multi-project support — single construction project
- Mobile-optimized UI — desktop is fine for internal use
- English language support — German only for now

## Context

This is an internal prototype to validate the "filesystem as document interface" pattern. The hypothesis is that for structured document collections (like construction projects), letting an AI agent navigate a familiar filesystem metaphor produces better, more auditable results than embedding-based retrieval.

The construction domain is chosen because construction projects have well-established document hierarchies (contracts, meeting minutes, RFIs, punch lists, correspondence) that map naturally to folder structures.

Stack: TypeScript, Next.js (App Router), just-bash (npm), Vercel AI SDK (ai), @ai-sdk/anthropic, deployed on Vercel.

## Constraints

- **Stack**: TypeScript + Next.js App Router — non-negotiable, deploying on Vercel
- **Agent library**: just-bash from Vercel for the virtual filesystem and bash tool
- **Model**: Anthropic Claude via @ai-sdk/anthropic
- **Language**: All user-facing content (UI, documents, agent responses) in German
- **Scope**: Small and focused — the architecture is the deliverable, not a production app

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Filesystem abstraction over vector search | Core thesis — documents have natural hierarchy that bash navigation preserves | — Pending |
| In-memory fs only, no persistence | Keeps demo focused on the pattern, not infrastructure | — Pending |
| Visible agent trace | Internal prototype — transparency aids evaluation of the approach | — Pending |
| German language throughout | Target audience is German-speaking construction professionals | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-21 after initialization*
