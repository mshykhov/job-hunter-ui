---
paths:
  - "src/styles/theme.ts"
  - "src/styles/global.css"
  - "design-system/**"
---
# Design system

- `design-system/` is the durable source of truth (design tokens + component preview
  cards). `tokens.css` mirrors `src/styles/theme.ts`; when theme tokens change, update
  `tokens.css` in the same change so the reference stays accurate.
- Redesign explorations live alongside the current UI (parallel route + components) for
  side-by-side comparison. Retire the old version only after the new one is approved;
  never rewrite a screen in place while it is still being evaluated.
