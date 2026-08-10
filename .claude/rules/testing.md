---
paths:
  - src/**/*.test.ts
  - src/**/*.test.tsx
  - src/**/__tests__/**
  - src/test/**
  - src/mocks/**
---
# Frontend tests

- Use Vitest, React Testing Library, and MSW. Import `setupServer` from `msw/node`.
- Test behavior that prevents regressions: request shape, transformations, state
  transitions, critical user flows, retries, cleanup, and edge cases.
- Do not test Ant Design, OIDC library internals, pure navigation, or presentation-only
  components.
- Reuse `src/mocks/` handlers and fixtures for tests and `dev:mock`; do not create a
  second mock server.
- Co-locate tests under `__tests__/` and name them by observable behavior.
- Reset handlers after each test. Use `vi.resetModules()` plus dynamic imports when a
  module owns mutable singleton state.
- Capture request URL, JSON body, and headers in MSW handlers and assert the contract
  rather than implementation details.
- Clear versioned local storage between storage-dependent tests.
- Add a regression test for every bug fix.
