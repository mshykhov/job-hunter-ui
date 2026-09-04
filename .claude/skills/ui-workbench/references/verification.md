# Verification contract

## Evidence session

Create a bounded cache directory before browser or audit work:

```sh
node .rulesync/skills/ui-workbench/scripts/cache.mjs begin --repo "$PWD" --scope affected-flow
```

Store screenshots, traces, videos, and raw reports only in the returned directory. Do not place raw evidence or machine-specific cache paths in Git.

## Required pass

1. Start the verified local development command and record the local URL.
2. Use the isolated interaction browser for an accessibility snapshot, screenshot, keyboard flow, and affected interactions at a desktop viewport.
3. Repeat the affected flow at `390x844`.
4. Run static source detection on affected source paths:

   ```sh
   npm run ui:detect -- src/components/affected src/routes/affected
   ```

5. Run WCAG scanning against each affected local route:

   ```sh
   npm run ui:a11y -- http://127.0.0.1:3000/affected-route
   ```

6. Use the debugging browser to inspect console errors and failed network requests. Capture performance evidence only when performance is in scope.
7. Check relevant loading, empty, error, disabled, destructive, hover, focus, and reduced-motion states that exist in scope.
8. Fix in-scope findings and run one confirmation pass. Report unresolved findings with severity and source location.

## Completion table

Report desktop, `390x844`, keyboard/focus, relevant states, static findings, axe violations, console errors, failed requests, and the confirmation result. A read-only audit reports findings without changing code or design documents.
