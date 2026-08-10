---
name: release-ui
description: >-
  Use when publishing a patch, minor, major, or prerelease version of the Job
  Hunter UI and updating its parent submodule.
---
# Release the UI

## Execution contract

Explicit invocation authorizes non-force pushes of the release commit and new tag,
plus the parent submodule update, to their configured upstreams. It does not authorize
discarding unrelated work, force-pushing, replacing a published tag, or deleting a
published release.

## Preflight

1. Inspect the UI and parent worktrees, current branches, configured upstreams, package
   version, local tags, and remote tags. Preserve unrelated work; use a clean worktree
   or stop when it cannot be isolated safely.
2. Resolve the intended semver increment and exact `vX.Y.Z` tag. Stop if the remote tag
   already exists, a matching release or CI artifact exists, or upstream identity is
   missing or ambiguous.
3. Fetch the current branch and tags without rewriting local history.

## Release

1. Install and verify from the lockfile:

   ```sh
   npm ci
   npm run lint
   npm run format:check
   npm run test
   npm run build
   ```

2. Set the version without an automatic commit or tag:

   ```sh
   npm version <patch|minor|major|version> --no-git-tag-version
   ```

   Confirm there are no unexpected `preversion`, `version`, or `postversion` lifecycle
   effects. Review `package.json`, `package-lock.json`, and the final diff; stop if any
   unrelated file changed.
3. Commit only the version files as `chore: set version to X.Y.Z`, then create the
   lightweight tag `vX.Y.Z` at that commit.
4. Push the release commit and the new tag to the configured upstream without force.
   Select the `Release` workflow run for the release commit and tag, confirm its event
   is the tag push, watch it to completion, and inspect failed logs when necessary:

   ```sh
   gh run list --workflow Release --event push --commit "$(git rev-parse HEAD)"
   gh run watch <release-run-id> --exit-status
   ```
5. On CI failure, fix the confirmed cause in a normal commit and rerun the full checks.
   Recreate a local-only tag only after proving no matching remote tag, release, CI run,
   or registry artifact exists. Otherwise stop for explicit authority before deletion
   or replacement; prefer a new patch identity when artifacts may have been consumed.
6. After green CI, resolve the parent through `git rev-parse
   --show-superproject-working-tree`. Verify its branch, upstream, and clean scope;
   stage only the `ui` gitlink, commit `chore(ui): bump submodule to vX.Y.Z`, and push
   without force.
7. Verify both local commits equal their upstream commits, the tag resolves to the UI
   release commit, and the release workflow is green.

## Common mistakes

| Mistake | Required response |
| --- | --- |
| Trusting yesterday's checks | Run the complete release verification again. |
| Letting `npm version` create the commit | Use `--no-git-tag-version`. |
| Moving a published tag silently | Stop and request explicit destructive authority. |
| Updating the parent before CI is green | Wait for the release workflow. |
| Staging unrelated parent changes | Isolate the gitlink update or stop. |
