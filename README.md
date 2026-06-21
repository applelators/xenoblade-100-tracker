# Xenoblade Chronicles DE — Spoiler-Free 100% / Missable Tracker

A personal, offline-capable web tracker for a **first, spoiler-free 100% playthrough** of
*Xenoblade Chronicles: Definitive Edition*. It surfaces the stuff you can **permanently lose**
(timed quests, mutually-exclusive choices, region lockouts) **before** the cutoff, while never
naming bosses, cutscenes, or plot beats.

## What it does

- **Two views**
  - **⏱ Missable priority** (default while playing) — only the permanently-losable items, grouped by
    cutoff in the order you'll hit them. Your "don't screw up 100%" list.
  - **Full 100%** — everything, grouped by **area** card (mirrors how you explore / how the
    ShulkLink guide is ordered).
- **"Expires next" panel** — the next cutoff with unchecked missables under it, pinned at the top.
- **Spoiler guard** — cutoffs are anchored to **chapter ranges + region locks**, never plot events.
  **Future areas are hidden by default** ("Hide future areas") and revealed one at a time with
  **“Reveal next area ▸”** as you actually reach them, so you never see a list of places ahead.
- **Badges** — `⏱ Timed`, `⚄ Either/or` (mutually exclusive; click to highlight its pair),
  `★ Missable` (achievement), `↻ Anytime` (not missable), `⚠ Verify` (lower-confidence data).
- **Progress meters** — separate **Missable progress** (be "100% missable-safe") and **Overall**.
- **Backup** — Export / Import your progress as JSON; Reset with confirm. State is `localStorage`.

## Run it

Static site in `./public`.

```bash
# Option A — Cloudflare (matches the other tracker apps)
wrangler dev          # local preview
wrangler deploy       # deploy to the applelators account

# Option B — no tooling
cd public && python3 -m http.server 8000   # then open http://localhost:8000
```

> Open it via a server, not `file://` — the app `fetch()`es `data/checklist.json`.

## Data, sources & honesty

- The checklist lives in **`public/data/checklist.json`** (separate from app logic, so content can be
  fixed without touching code). Every item carries a `confidence` of `high` (cross-confirmed) or
  `verify` (single-source / uncertain — double-check in-game).
- **Sources** (factual game data — lockouts, quest lists, monster levels — reconciled across):
  Game8 *List of Missables* (#290848) & *100% Walkthrough* (#290832), RPG Site missables checklist,
  Exion Vault 100% guide. Collectopaedia from Game8 #290251.
- **ShulkLink (GameFAQs #76615)** and the **Fandom wiki** are **linked, not copied**. ShulkLink's
  guide is copyrighted and marked no-redistribution; it's also bot-blocked, so the app **deep-links**
  to it per area rather than reproducing any text. Read it in your browser for the "what to do"
  narrative; use this tool for the checkable missable layer.
- **Golden rule baked into the UI:** trust the **in-game ⏱ stopwatch icon** over any guide, and
  reconcile quest completeness against Fandom.

## Scope

**In:** side quests (timed + mutex), unique monsters & landmarks in locking regions,
heart-to-hearts, Colony 6 quest-gated occupants, missable achievements; full Collectopaedia + all
landmarks loaded progressively; Future Connected (epilogue).

**Out (not missable — add later if wanted):** Lv.99, Arts Lv.12, skill trees, area Affinity 5★,
party affinity links, cosmetic skins as a category, Time Attacks, NG+-only items (Monado III).

## Status / TODO

- [x] App shell + missable spine dataset (quests, monsters, mutex pairs, cutoffs, achievements)
- [ ] Bulk-load full Collectopaedia (all areas) + all landmarks for map completion
- [ ] Populate Future Connected list
- [ ] Pin exact chapter numbers for each cutoff (currently `verify` where uncertain)
- [ ] Optional: D1 cross-device sync (seam already in `worker.js` + `store.js`)

## Architecture

```
public/
  index.html      # shell
  styles.css
  store.js        # localStorage persistence — the ONLY state layer (D1-swap seam)
  app.js          # renders everything from checklist.json
  data/checklist.json
worker.js         # CF Worker: serves ./public; room for /api/* (D1) later
wrangler.toml
```
