# Refined Dark — Design Language

A working reference for building **new** UI in the Xenoblade 100% Tracker so it
stays consistent with `styles.css`. Pair this with `README.md` (which covers how
to install the restyle). All tokens below are CSS custom properties already
defined in `styles.css` — **use the variables, never raw hex.**

---

## 1. Color — semantic, grouped by meaning

Color carries meaning here. Don't reach for a hue because it looks nice — reach
for the one whose meaning matches.

| Token | Value | Means | Use for |
|---|---|---|---|
| `--accent` | `#4cc9ff` cyan | **interactive / active** | active tab, links, focus rings, route accent, primary buttons |
| `--info` | `#79c2f5` cyan-soft | **information / reference** | `story` + `ach` badges, "second opinion" notes |
| `--warn` | `#ffcf5c` amber | **time-sensitive** | `timed` badge, points of no return, "Expires next", spoiler gate edge |
| `--choice` | `#d6b4ff` purple | **a choice you make** | `mutex` (either/or) badge, "why" detail fields |
| `--accent2` / `--done` | `#7bf7c4` / `#5fd08a` green | **done / safe / always-available** | progress fills, completed states, `anytime` badge |
| `--danger` | `#ff7a7a` red | **danger / forfeited / locked** | `forfeit` badge, danger lock-banner, locked items |
| `--verify` | `#ffb86b` soft orange | **needs verification** | `verify` badge, conflict notes |

Rules:
- **Bright cyan = "you can interact with this."** Don't use it for static labels
  or section headers (those are `--muted`).
- One badge = one meaning. If you add a badge type, map it to an existing hue
  above; don't introduce a new color.
- Never put two same-meaning colors next to each other competing for attention.

---

## 2. Surfaces & elevation

Four stacked planes, each a step lighter. Always pair a surface with its border.

| Token | Value | Plane |
|---|---|---|
| `--bg` | `#0a0e17` | page background |
| `--bg2` | `#111a2b` | inset controls, inputs, search |
| `--card` | `#161f33` | primary card (`.area-card`, `.panel`, `.cutoff-card`) |
| `--card2` | `#1f2b45` | nested block / hover state |
| `--line` | `#283751` | hairline borders |
| `--line2` | `#1c2740` | softer inner borders (level-2 nesting) |

Elevation comes from **shadow + a one-step-lighter fill**, not from borders alone:
- Cards: `box-shadow: var(--shadow)`; on hover lift `translateY(-2px)` +
  `var(--shadow-lg)`.
- Keep nested content on `--card2` / `--bg2` so it separates from its parent card.

---

## 3. Typography

- **Display / headings:** `var(--font-display)` = **Space Grotesk** (600–700).
  Used for `h1`, `h3`, panel/route/category titles, tab labels, arc titles.
- **Body / data:** `var(--font-body)` = system sans. Used for everything else.
- **Numbers / counts:** always `font-variant-numeric: tabular-nums` so columns
  of `2 / 5` align.

Scale (don't go smaller than the floor for each role):
`h1` 27px/700 · section `h3` 19px/600 · card titles 13.5–15px/700 ·
body 15px · secondary 12.5–13px · badges/eyebrows 10.5–12px uppercase,
letter-spacing ~.7px.

---

## 4. Spacing, radius, shape

- Radii: `--radius` 14px (cards/panels), `--radius-sm` 9px (items, inputs,
  inner blocks), 99px (pills/badges/progress).
- Card padding ~15–16px; item rows 7px/9px; gaps 2px (lists) → 12–20px (sections).
- Lay rows out with **flex/grid + `gap`**, not margins on each child.

---

## 5. Component recipes

- **Card** = `--card` fill + `1px solid --line` + `--radius` + `var(--shadow)`,
  hover-lift. Variants: `.area-card`, `.panel`, `.cutoff-card`.
- **Item row** (`.item`) = checkbox (`accent-color: var(--accent2)`) + label +
  optional `.item-badges`. `.item.done` strikes through + mutes. `.item.locked`
  drops opacity to .55 with a red strike.
- **Badge** (`.badge`) = 99px pill, 1px border, semantic color from §1. ~10.5px
  weight 600.
- **Route panel** (`.route`) = the one element allowed a bright cyan left border
  (3px) — it's the "what to do now" focal point. Turns green when complete.
- **Disclosure nesting** (read as descending weight, don't flatten the contrast):
  `completed-area` (L1, green banner) › `area-card` / `area-group` (L2, inset,
  `--line2`) › `cat-block` (L3, **header + indent only, no box**).
- **Spoilers** (`.spoiler`) = blur + dashed cyan underline + 🔒 glyph so it reads
  as clickable; `.revealed` clears the blur. Use for boss names / late content.

---

## 6. Responsive (critical — this is what the restyle fixed)

- The side rails `#toc-float` (nav) and `#arts-float` (arts) are **fixed gutters
  ≥1281px** and **must reflow into the page below 1280px — never `display:none`.**
  Any new persistent panel follows the same rule: degrade to an in-flow card, do
  not hide it on small screens.
- Reserve gutter only at `min-width:1281px` (`body.view-walk #app` max-width).
- Single-column breakpoints already set at 620px / 760px / 900px for meters,
  places-row, ref lists, and qum-row.
- The control bar (`.controls`) is `position:sticky` so tabs/search stay reachable.

---

## 7. Motion

- Subtle and purposeful only. Progress bars get a light sweep; cards a hover-lift;
  panels a one-time `fadeUp` entrance.
- **Always** respect `@media (prefers-reduced-motion: reduce)` (the guard is
  already in `styles.css` — keep new animations inside it).

---

## 8. When you add new UI — checklist

1. Use existing tokens (`var(--…)`), never raw hex or a new color.
2. Pick the surface plane and pair it with its border + shadow.
3. Headings in Space Grotesk; counts in tabular-nums.
4. Badges/labels: map to a §1 meaning.
5. Make it responsive — degrade, don't hide.
6. Keep motion subtle and inside the reduced-motion guard.
7. Bright cyan only for things the user can interact with.
