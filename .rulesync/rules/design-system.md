---
root: false
globs:
  - 'src/styles/theme.ts'
  - 'src/styles/global.css'
  - 'design-system/**'
---
# Design system

- `design-system/` is the durable source of truth for tokens and component previews.
- `tokens.css` mirrors `src/styles/theme.ts`; update both in the same change.
- The interface is dark-first with accent `#4F46E5` and radius `6` unless an approved
  redesign changes the token contract.
- Build redesigns as a parallel route and component tree for side-by-side review.
- Retire the current screen only after its replacement is approved.
