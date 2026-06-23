# Refined Dark — drop-in restyle for the Xenoblade 100% Tracker

`styles.css` here is a **complete drop-in replacement** for `public/styles.css`.
It reuses every class name the app already emits, so **no markup or JS changes
are required** — replace the file and reload.

```
cp redesign/styles.css public/styles.css
```

`preview.html` is a static harness using the real class names so you can eyeball
the look without running the full app.

## What changed (and why)

1. **Responsive floats — the big one.** The original hid both `#toc-float`
   (jump-to-area + prev/next) and `#arts-float` with `display:none !important`
   below 1281px, so all navigation + arts guidance vanished on laptops, tablets
   and phones. Now they stay **fixed side rails on wide screens** and **reflow
   into the page as full-width cards** below 1280px (TOC links go 2-up, prev/next
   becomes a row) instead of disappearing.

2. **Less fragile layout.** Tidied the reserved-gutter math
   (`calc(100vw - 580px)`, capped main at 1240px) so the reading column isn't
   over-squeezed between 1281–1600px.

3. **Depth + typography.** Separated the surface tokens (`--bg`/`--card`/`--card2`
   are now visibly distinct), added soft shadows and a faint ambient glow, and
   introduced **Space Grotesk** for headings with a real type scale (h1 27px).
   Loaded via `@import` at the top of the CSS — no `<link>` needed.

4. **Disclosure hierarchy.** The nested `<details>` levels now read as
   descending weight: `completed-area` (L1, green) › `area-card` / `area-group`
   (L2, inset) › `cat-block` (L3, header + indent only, no heavy box).

5. **Consistent color language.** Badges are grouped by meaning —
   cyan = info/reference, amber = time-sensitive, purple = either/or choice,
   green = done/safe, red = forfeit. Category headers were de-cyaned so bright
   cyan reliably means "interactive/active".

6. **Spoiler affordance + calmer gate.** `.spoiler` now has a dashed cyan
   underline and a 🔒 glyph so it clearly reads as "click to reveal", and the
   `.arc-wall` spoiler gate uses a soft amber-edged card instead of the red
   hazard stripes (which read as an error).

Plus: sticky control bar, progress-bar shimmer, card hover-lift, gentle
entrance fades, and a `prefers-reduced-motion` guard.

## Optional follow-ups (need a small markup/JS tweak, not CSS)

- A true mobile **bottom tab bar** for the 4 views (mocked in
  `Walkthrough Mobile (iPhone 17 Pro).dc.html`). The CSS reflow above keeps
  everything usable today; this would make it feel native.
- A literal "Tap to reveal" label inside spoilers (one extra `<span>`).
