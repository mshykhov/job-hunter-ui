# Design System

Reference for the Job Hunter UI design system: the design tokens and a set of
standalone HTML preview cards for the app's signature components.

## Structure

```
design-system/
  README.md          # this file
  tokens.css         # CSS variables mirroring src/styles/theme.ts
  cards/             # HTML preview cards, one visual primitive each
    colors.html      # brand, dark surfaces, semantic colors
    typography.html  # type scale and font stack
    foundations.html # component library, radius scale, base facts
    job-row.html     # job list row (source tags, score, status, remote)
```

## Source of truth

`tokens.css` mirrors the Ant Design theme in `src/styles/theme.ts` (accent
`#4F46E5`, radius `6`, the dark and light surface palette). When the theme
changes, update `tokens.css` so this reference stays accurate.

The cards are self-contained HTML: open any file in a browser to preview the
component in isolation. They are documentation, not part of the app build.
