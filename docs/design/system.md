# Design system direction

## Approved direction

Use a compact operations-dashboard direction built on the existing Job Hunter design system. The interface is calm, data-dense, and scannable rather than decorative. Preserve the established dark-first palette, indigo accent, system typography, and Ant Design component semantics.

The pinned design-intelligence source recommends a real-time operations layout with visible status indicators. That supports the product need for live workflow state. Its unrelated landing-page typography and green rebrand are intentionally not adopted.

## Foundations

- Accent: `#4F46E5`.
- Base radius: `6px`.
- Typography: native system UI stack; tabular numerals for operational values.
- Dark surfaces: body `#0F0F12`, chrome `#141417`, surface `#1A1A1E`, raised `#1F1F23`, border `#2A2A2E`.
- Light surfaces follow the Ant Design light algorithm and existing theme tokens.
- Semantic success, warning, and error colors come from Ant Design and always accompany text labels.

## Layout and density

- Keep application navigation persistent on desktop but compact enough to prioritize page content.
- On narrow screens, navigation must not reserve a permanent rail; use an accessible temporary menu and a compact page header.
- Use a 24-pixel desktop content gutter and a smaller intentional mobile gutter.
- Group workflow queue/history and selected-run report as distinct regions. Prefer concise metadata rows and progressive disclosure for technical evidence.
- Primary run actions remain visible near run context. Destructive actions require explicit visual treatment.

## Components and states

- Cards define operational sections without excessive nesting.
- Tags pair semantic color with status text.
- Live data shows refresh cadence or freshness instead of silently changing.
- Empty and error states explain what the user can do next.
- Synthetic runs explicitly state that no vacancy is associated. Vacancy title, company, source, URL, trigger source, schedule, screenshots, and browser evidence appear only when the API provides those contracts.
- Attempts, checkpoints, and audit events form the detailed run report. Evidence digests are technical integrity references, not screenshots.

## Motion and responsive behavior

- Keep motion short and functional. Respect `prefers-reduced-motion` for non-essential transitions.
- Desktop may use two-column master-detail layouts. Mobile stacks queue/history above details, keeps controls full-width or wrapping, and avoids horizontal overflow.
- Touch targets are at least 44 pixels where controls are used frequently.

## Accessibility floor

Target WCAG 2.2 AA. Preserve semantic headings, accessible names, keyboard operation, visible focus, sufficient contrast, and non-color status cues. Every affected route is verified at desktop and `390x844` with axe, static detection, console, and failed-request checks.
