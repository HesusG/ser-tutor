# Design — Pedagogía del Bien Común

Visual system for `docs/bien-comun/index.html`. Deliberately departs from the parent
*Ser tutor* warm-serif book system; art-directed per page toward a bold humanist-editorial
register with **sober neobrutalism**, modeled on academias.dev + pudding.cool scrollytelling.
Self-contained (no external CSS/JS/fonts).

## v2 additions (research-driven rebuild)

- **Voice:** first person, explanatory, andragogical (activate experience, real problem,
  closing application question). No em-dashes, no en-dashes (hyphen only in reference page
  ranges), no arrows.
- **Citations:** inline APA 7 author-date links (`.cite`) to a hanging-indent reference list
  (`#ref-*`); 14 sources, all web-verified in a prior research workflow.
- **Author cards:** B&W circle portraits (grayscale filter) of Sánchez Cuevas & Medina
  Delgadillo in hard-bordered cards with hard shadow.
- **Scrollytelling:** the four pillars as a sticky stage + IntersectionObserver steps
  (rootMargin center trigger); collapses to static single-column below 760px; content fully
  readable without JS.
- **Neobrutalism (sober):** 2px ink borders, hard offset shadows (`--shadow-hard`), no radius,
  mono labels; used on author/philosopher/mode cards, table, route widget, doc callout.
- **Reading progress:** scroll-driven `animation-timeline: scroll()` bar, hidden on
  reduced-motion / unsupported.

## Theme

Light only. Off-white paper, ink text, one teal accent, hairline rules. Physical scene:
an adult teacher reading on a laptop in daylight, unhurried — a fine journal, not a brochure.

## Color

OKLCH, single-accent (Restrained strategy — content carries the page, color punctuates).

- `--paper`  `#faf8f4` — off-white body (near-neutral, faint warm; chroma kept low)
- `--surface` `#ffffff` — raised panels / photo mounts
- `--ink`    `#17171a` — primary text (≈15:1 on paper)
- `--ink-soft` `#41434a` — secondary text (≥7:1, never lighter for body)
- `--muted`  `#6b6e77` — captions/labels only (≥4.5:1)
- `--accent` `#0e6b6b` — teal; links, section index, active states, rules of emphasis
- `--accent-strong` `#0a5555` — hover/pressed
- `--line`   `#e4e1d9` — hairline dividers

Contrast verified: body `--ink`/`--ink-soft` on `--paper` clears AA; `--muted` used only at
≥14px. Teal on paper for large/link text only.

## Typography

System stacks (offline-safe, user-directed). One sans for voice + one mono for indices.

- `--sans`: `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- `--mono`: `ui-monospace, "SF Mono", "Roboto Mono", Menlo, Consolas, monospace`

Roles:
- Display h1/h2 — sans, weight 600–700, `letter-spacing:-0.02em`, `text-wrap:balance`,
  fluid `clamp()` (h1 max ≤ 4rem). Intentional line breaks + one italic emphasis line in hero.
- Body — sans 400, `1.6` line-height, measure ≤ 68ch, `text-wrap:pretty`.
- Section index `[01]–[04]` and captions/`FIG.` — mono, small, `--muted`/`--accent`.
  Mono is used *only* for these indices/labels (not as generic "technical" costume).

## Layout

- Centered column, `--measure: min(100% - 2.5rem, 1000px)`.
- Hairline `--line` rules between sections; no colored section backgrounds.
- Prose max ~68ch; hero/table/figures may span wider.
- Fluid `clamp()` vertical rhythm; tight groupings inside sections, generous between.
- Two-column text+figure splits collapse to one column under ~760px.

## Components

- **Section index**: mono `[0N]` + real title. Numbers map to the four required parts
  (a genuine sequence), not decorative eyebrows.
- **Pillars (4)**: differentiated by leading number + type, not color blocks. No card grid
  of identical tiles; a ruled list / asymmetric layout instead.
- **Pull-quote (Lévinas)**: large sans, hairline rule above, mono cite. No side-stripe.
- **Case route widget**: three `→` text-link buttons swap a consequence panel (only JS on
  the page). `aria-pressed` + `aria-live`. Reduced-motion = instant swap.
- **Figures**: source photos straight (no rotation), thin `--line` frame, monochrome/duotone
  (grayscale + slight ink tint), `FIG.` mono caption as evidence.
- **Table**: hairline rules, no zebra fills; área / aplicación / pregunta ética.

## Motion

Quiet only. Small scroll-reveal fade+translate on an *already-visible* default (no
visibility gating). Ease-out-quint. `@media (prefers-reduced-motion: reduce)` → no transform,
instant. The route-widget swap is a crossfade.

## Bans honored

No side-stripe borders, no gradient text, no glassmorphism, no hero-metric block, no
identical card grid, no per-section uppercase eyebrows. Numbered indices justified by the
real four-part sequence.
