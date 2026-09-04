---
paths:
  - '**/*.css'
  - '**/*.scss'
  - '**/*.html'
  - '**/*.jsx'
  - '**/*.tsx'
  - '**/*.vue'
  - '**/*.svelte'
  - docs/design/**/*.md
---
# UI quality

- Read `docs/design/README.md` and the linked living design context before changing UI source.
- Follow established component, token, asset, state, and responsive patterns. Propose a change before replacing an established pattern.
- Use the repository-local `ui-workbench` workflow for substantial design, implementation, or audit work.
- Verify the affected flow at a desktop viewport and `390x844`, including keyboard focus, loading, empty, error, disabled, and destructive states that exist in scope.
