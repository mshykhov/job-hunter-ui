# Design context

## Read order

1. Read `docs/design/README.md`.
2. Read `product.md` and `system.md` completely.
3. Read a page document only when the affected page has a listed deviation.
4. Inspect current source before treating documentation as implementation fact.

## Durable documents

`docs/design/README.md` links the living documents and defines their update triggers.

`product.md` contains verified users, jobs, workflows, content constraints, platform constraints, accessibility needs, success criteria, and evidence sources. It never invents customers, metrics, testimonials, or capabilities.

`system.md` contains the approved direction, color and typography roles, spacing and layout, component character, states, imagery, motion, responsive behavior, and accessibility floor.

`pages/<page>.md` contains only real deviations from the shared system. A dated review is created only when the user asks to preserve an audit snapshot.

## Direction query

Build the query from verified product, page, audience, and stack facts, then run:

```sh
python3 .rulesync/skills/.curated/ui-ux-pro-max/scripts/search.py "verified product, page, audience, and stack" --design-system --json
```

Treat results as design input, not repository fact. Present distinct directions, record only the approved synthesis, and never invoke upstream persistence.
