---
name: ui-workbench
description: >-
  Use when designing, implementing, redesigning, or auditing frontend UI and UX
  in this repository.
---
# UI Workbench

## Route the request

- Audit-only: keep product code and design documents read-only; report evidence and findings.
- Design-only: complete Context and Direction, update approved living design documents, then stop before product code.
- Implementation: run all applicable phases.
- Verification-only: read existing context and run Verification without changing the approved direction.

Read [references/design-context.md](references/design-context.md) for durable design knowledge and [references/verification.md](references/verification.md) for the evidence contract.

## Context

Read project instructions, `docs/design/`, affected routes, components, tokens, assets, runtime commands, and tests. Record only verified durable facts. Audit-only work does not rewrite documents.

## Direction

Query the pinned repository design-intelligence source. Synthesize two or three materially distinct directions and obtain approval before implementing a new direction. Skip new approval only when the request already names an approved direction in `docs/design/system.md`.

## Implementation

Change only requested product code and assets. Follow existing patterns, implement relevant states, preserve semantics and keyboard behavior, and make responsive behavior intentional rather than merely compressed.

## Verification

Create an owned evidence session. Run one batched desktop and `390x844` browser pass, static detection, WCAG scanning, console and failed-request inspection, and relevant interaction states. Fix in-scope findings and run one bounded confirmation pass. Summarize evidence without committing raw cache paths.

External writes, destructive product actions, and authenticated browser actions require separate authority.
