/*
 * app.js — XCDE spoiler-free 100% / missable tracker.
 * Renders entirely from data/checklist.json; state via window.Store.
 */
(function () {
  "use strict";

  const CATEGORY_LABELS = {
    quests: "Quests",
    uniqueMonsters: "Unique Monsters",
    heartToHearts: "Heart-to-Hearts",
    landmarks: "Landmarks",
    locations: "Locations",
    collectopaedia: "Collectopaedia",
    colony6: "Colony 6 Reconstruction",
    other: "Other Missables",
    achievements: "Achievements",
    futureConnected: "Future Connected"
  };
  const CATEGORY_ORDER = ["quests", "uniqueMonsters", "heartToHearts", "landmarks", "locations", "collectopaedia", "colony6", "other"];

  // Collectopaedia: the game's six in-game categories (per-item `cat` from the
  // wiki data, set in build-data). Displayed as six columns in this order.
  const COLLECT_CAT_ORDER = ["veg", "fruit", "bug", "nature", "parts", "strange"];
  const COLLECT_CAT_LABEL = { veg: "🥬 Veg", fruit: "🍎 Fruit", bug: "🐛 Bug", nature: "🌿 Nature", parts: "⚙️ Parts", strange: "✨ Strange" };
  // collectables tab shows only collectable-type categories (no quests/UMs/H2H/missables)
  const COLLECT_VIEW_CATS = ["landmarks", "locations", "collectopaedia", "colony6"];
  // "Critical" missables shown upfront; collectables/landmarks tuck behind a collapsible.
  const CRITICAL_CATS = new Set(["quests", "uniqueMonsters", "heartToHearts", "colony6", "other", "achievements"]);

  function splitCritical(entries) {
    const crit = [], comp = [];
    entries.forEach((e) => (CRITICAL_CATS.has(e.category) ? crit : comp).push(e));
    return { crit, comp };
  }
  function completionDetails(comp) {
    if (!comp.length) return null;
    const done = comp.filter((e) => Store.isChecked(e.item.id)).length;
    return el("details", { class: "completion" }, [
      el("summary", null, [`📦 Collectables & landmarks to grab before lock — ${done}/${comp.length}`]),
      el("div", { class: "items" }, comp.map(itemRow))
    ]);
  }

  // ---- best-arts reference (Game8 tier list #289556) — S & A tier per character ----
  const ARTS_TIER_URL = "https://game8.co/games/Xenoblade-Chronicles-Definitive-Edition/archives/289556";
  const PARTY_ARTS = {
    Shulk:  { S: ["Battle Soul", "Shadow Eye", "Air Slash", "Back Slash", "Slit Edge"], A: ["Stream Edge", "Light Heal", "Armor", "Shield", "Buster"] },
    Reyn:   { S: ["Lariat", "Berserker", "Sword Drive", "Wild Down"], A: ["Dive Sobat", "Magnum Charge", "Shield Bash", "War Swing"] },
    Sharla: { S: ["Cure Round", "Head Shot", "Heal Round", "Heal Bullet"], A: ["Covert Stance", "Heal Blast"] },
    Dunban: { S: ["Soaring Tempest", "Heat Haze", "Serene Heart", "Steel Strike", "Worldly Slash", "Peerless", "Gale Slash"], A: ["Spirit Breath", "Electric Gutbuster"] },
    Melia:  { S: ["Summon Earth", "Summon Copy", "Summon Flare", "Summon Bolt"], A: ["Mind Blast", "Summon Wind", "Reflection", "Summon Ice"] },
    Riki:   { S: ["Freezinate", "Burninate", "You Can Do It", "Hero Time", "Lurgy", "Sneaky", "Bitey Bitey"], A: ["Tantrum", "Happy Happy"] },
    Seven:  { S: ["Final Cross", "Air Fang", "Lock-On", "Zero Gravity", "Spear Blade", "Double Blade"], A: ["Power Drain", "Double Wind", "Ether Drain", "Cross Impact"] }
  };
  // display order of the aside
  const PARTY_ORDER = ["Shulk", "Reyn", "Sharla", "Dunban", "Melia", "Riki", "Seven"];
  let SECTION_RANK = {};      // section code -> chronological index (for party-by-section)
  // who is in the party at a given section (spoiler-gated by arc reveal anyway)
  function partyFor(code) {
    const r = SECTION_RANK[code];
    if (r == null) return [];
    const at = (c) => SECTION_RANK[c];
    const mem = new Set();
    if (r >= at("4.2")) { mem.add("Shulk"); mem.add("Reyn"); }
    if (r === at("4.4") || r >= at("4.9")) mem.add("Dunban");   // raid cameo, then permanent
    if (r >= at("4.5")) mem.add("Sharla");
    if (r >= at("4.13")) mem.add("Melia");
    if (r >= at("4.14")) mem.add("Riki");
    if (r >= at("4.25")) mem.add("Seven");                       // Fiora returns (new art set)
    return PARTY_ORDER.filter((c) => mem.has(c));
  }
  function artsAside(s) {
    const party = partyFor(s.code).filter((c) => PARTY_ARTS[c]);
    if (!party.length) return null;
    const chars = party.map((c) => {
      const a = PARTY_ARTS[c];
      return el("div", { class: "arts-char" }, [
        el("div", { class: "arts-name", text: c }),
        a.S && a.S.length ? el("div", { class: "arts-tier" }, [el("span", { class: "tl s", text: "S" }), el("span", { class: "arts-list", text: a.S.join(", ") })]) : null,
        a.A && a.A.length ? el("div", { class: "arts-tier" }, [el("span", { class: "tl a", text: "A" }), el("span", { class: "arts-list", text: a.A.join(", ") })]) : null
      ]);
    });
    return el("aside", { class: "arts-aside" }, [
      el("div", { class: "arts-head" }, [
        el("span", { class: "arts-title", text: "⚔️ Best Arts to Level" }),
        el("span", { class: "arts-sub", text: "Current party · Game8 S/A tier" })
      ]),
      el("div", { class: "arts-body" }, chars),
      el("a", { class: "arts-src", href: ARTS_TIER_URL, target: "_blank", rel: "noopener" }, ["Source: Game8 best-arts tier list ↗"])
    ]);
  }

  let DATA = null;
  let CUTOFF_BY_ID = {};
  let CUTOFF_ORDER = {};      // id -> order index
  let ALL_ENTRIES = [];       // { item, area, category }
  let WALK_ITEMS = [];        // flat walkthrough items (for progress)
  let CHECK_LINKS = {};       // id -> [partner ids] across datasets (for dedup)
  let ITEM_LABEL = {};        // id -> label (for mutex "forfeited" messaging)
  let IMPLIED_BY = {};        // unique-monster id -> [quest labels that auto-check it]

  // ---------- helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, props, children) {
    const n = document.createElement(tag);
    if (props) for (const k in props) {
      if (k === "class") n.className = props[k];
      else if (k === "html") n.innerHTML = props[k];
      else if (k === "text") n.textContent = props[k];
      else if (k.startsWith("on") && typeof props[k] === "function") n.addEventListener(k.slice(2), props[k]);
      else if (props[k] != null) n.setAttribute(k, props[k]);
    }
    (children || []).forEach((c) => { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function effectiveCutoff(item, area) {
    return item.expiresAt || (area && area.locksAt) || null;
  }
  function isAreaVisible(area) {
    if (!Store.getPref("hideFutureAreas")) return true;
    return Store.isReached(area.id);
  }
  function matchesSearch(item) {
    const q = (Store.getPref("search") || "").trim().toLowerCase();
    if (!q) return true;
    return (item.label || "").toLowerCase().includes(q) || (item.note || "").toLowerCase().includes(q);
  }

  // ---------- data prep ----------
  function buildIndex() {
    CUTOFF_BY_ID = {};
    CUTOFF_ORDER = {};
    (DATA.cutoffs || []).forEach((c, i) => { CUTOFF_BY_ID[c.id] = c; CUTOFF_ORDER[c.id] = c.order != null ? c.order : i; });

    ALL_ENTRIES = [];
    (DATA.areas || []).forEach((area) => {
      const sections = area.sections || {};
      Object.keys(sections).forEach((cat) => {
        (sections[cat] || []).forEach((item) => ALL_ENTRIES.push({ item, area, category: cat }));
      });
    });
    (DATA.achievements || []).forEach((item) => ALL_ENTRIES.push({ item, area: null, category: "achievements" }));
    (DATA.futureConnected || []).forEach((item) => ALL_ENTRIES.push({ item, area: null, category: "futureConnected" }));

    // flat list of walkthrough items (quests/ums/hths/colony6) for progress counting
    WALK_ITEMS = [];
    (DATA.walkthrough || []).forEach((s) => {
      ["quests", "ums", "hths", "colony6", "landmarks", "locations", "records", "trials", "affinitySteps"].forEach((k) => (s[k] || []).forEach((item) => WALK_ITEMS.push(item)));
      (s.guide || []).forEach((g) => WALK_ITEMS.push(g)); // steps count; Nota Bene sub-notes don't
    });

    SECTION_RANK = {};
    (DATA.walkthrough || []).forEach((s, i) => { SECTION_RANK[s.code] = i; });

    buildCheckLinks();
    buildMutex();
    buildImplies();
  }

  // quest -> unique-monster auto-check links (quest.defeatsUM, matched by UM name)
  function buildImplies() {
    const norm = (s) => String(s || "").toLowerCase().replace(/[“”"'’]/g, "").replace(/\(lv\.?\s*\d+\)/g, "").replace(/lv\.?\s*\d+/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
    const umByName = {};
    const idxUM = (u) => { (umByName[norm(u.label)] = umByName[norm(u.label)] || []).push(u.id); };
    (DATA.walkthrough || []).forEach((s) => (s.ums || []).forEach(idxUM));
    (DATA.areas || []).forEach((a) => (a.sections.uniqueMonsters || []).forEach(idxUM));
    const implies = {}; IMPLIED_BY = {};
    (DATA.walkthrough || []).forEach((s) => (s.quests || []).forEach((q) => {
      if (!q.defeatsUM) return;
      const names = Array.isArray(q.defeatsUM) ? q.defeatsUM : [q.defeatsUM];
      names.forEach((nm) => (umByName[norm(nm)] || []).forEach((uid) => {
        (implies[q.id] = implies[q.id] || []); if (implies[q.id].indexOf(uid) < 0) implies[q.id].push(uid);
        (IMPLIED_BY[uid] = IMPLIED_BY[uid] || []); if (IMPLIED_BY[uid].indexOf(q.label) < 0) IMPLIED_BY[uid].push(q.label);
      }));
    }));
    Store.setImplies(implies);
  }

  // mutually-exclusive quest pairs → Store. Walkthrough quests reference the
  // partner by name (label); area quests reference it by id.
  function buildMutex() {
    const norm = (s) => String(s || "").toLowerCase().replace(/[“”"'’]/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    const mutex = {};
    ITEM_LABEL = {};
    const add = (a, b) => {
      if (!a || !b || a === b) return;
      (mutex[a] = mutex[a] || []); if (mutex[a].indexOf(b) < 0) mutex[a].push(b);
      (mutex[b] = mutex[b] || []); if (mutex[b].indexOf(a) < 0) mutex[b].push(a);
    };
    const byLabel = {}; // norm(label) -> [walkthrough quest ids]
    (DATA.walkthrough || []).forEach((s) => (s.quests || []).forEach((q) => {
      ITEM_LABEL[q.id] = q.label;
      (byLabel[norm(q.label)] = byLabel[norm(q.label)] || []).push(q.id);
    }));
    (DATA.walkthrough || []).forEach((s) => (s.quests || []).forEach((q) => {
      if (q.mutexWith) (byLabel[norm(q.mutexWith)] || []).forEach((pid) => add(q.id, pid));
    }));
    (DATA.areas || []).forEach((a) => (a.sections.quests || []).forEach((q) => {
      ITEM_LABEL[q.id] = q.label;
      if (q.mutexWith) add(q.id, q.mutexWith);
    }));
    Store.setMutex(mutex);
  }

  // Link check-state across the Walkthrough and Collectables datasets: when a
  // landmark/location/unique-monster/quest in one matches one in the other (same
  // normalized name, unambiguous 1:1), checking either checks both.
  function buildCheckLinks() {
    const norm = (s) => String(s || "").toLowerCase()
      .replace(/[“”"'’]/g, "").replace(/\(lv\.?\s*\d+\)/g, "").replace(/lv\.?\s*\d+/g, "")
      .replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    const groups = {};
    const add = (type, name, id, side) => {
      const n = norm(name); if (!n) return;
      const k = type + "|" + n;
      (groups[k] = groups[k] || { w: [], c: [] })[side].push(id);
    };
    (DATA.walkthrough || []).forEach((s) => {
      (s.landmarks || []).forEach((i) => add("place", i.label, i.id, "w"));
      (s.locations || []).forEach((i) => add("place", i.label, i.id, "w"));
      (s.ums || []).forEach((i) => add("monster", i.label, i.id, "w"));
      (s.quests || []).forEach((i) => add("quest", i.label, i.id, "w"));
    });
    (DATA.areas || []).forEach((a) => {
      const sec = a.sections || {};
      (sec.landmarks || []).forEach((i) => add("place", i.label, i.id, "c"));
      (sec.uniqueMonsters || []).forEach((i) => add("monster", i.label, i.id, "c"));
      (sec.quests || []).forEach((i) => add("quest", i.label, i.id, "c"));
    });
    const links = {};
    Object.values(groups).forEach((g) => {
      if (g.w.length === 1 && g.c.length === 1) { // unambiguous 1:1 only
        const a = g.w[0], b = g.c[0];
        (links[a] = links[a] || []).push(b);
        (links[b] = links[b] || []).push(a);
      }
    });
    CHECK_LINKS = links;
    Store.setLinks(links);
  }

  function progress(predicate) {
    let total = 0, done = 0;
    const counted = new Set(); // dedupe linked twins so each pair counts once
    const count = (item) => {
      if (!predicate(item)) return;
      if (counted.has(item.id)) return;
      counted.add(item.id);
      (CHECK_LINKS[item.id] || []).forEach((p) => counted.add(p));
      total++;
      if (Store.isChecked(item.id)) done++;
    };
    ALL_ENTRIES.forEach(({ item }) => count(item));
    WALK_ITEMS.forEach(count);
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  // ---------- shared UI bits ----------
  function progressBar(label, p, cls) {
    return el("div", { class: "progress-block" }, [
      el("div", { class: "progress-row" }, [
        el("span", { class: "progress-label", text: label }),
        el("span", { class: "progress-num", text: `${p.done} / ${p.total} (${p.pct}%)` })
      ]),
      el("div", { class: "progress " + (cls || "") }, [el("div", { class: "bar", style: `width:${p.pct}%` })])
    ]);
  }

  function badges(item, category) {
    const out = [];
    if (item.timed) out.push(el("span", { class: "badge timed", title: "Timed quest — shows the stopwatch icon in-game and expires at a cutoff" }, ["⏱ Timed"]));
    if (item.mutexWith) out.push(el("button", { class: "badge mutex", title: "Mutually exclusive — completing this forfeits its pair. Click to highlight the pair.", "data-mutex": item.mutexWith }, ["⚄ Either/or"]));
    if (category === "achievements" && item.missable) out.push(el("span", { class: "badge ach", title: "Missable achievement" }, ["★ Missable"]));
    if (item.missable === false) out.push(el("span", { class: "badge anytime", title: "Not missable — can be done anytime" }, ["↻ Anytime"]));
    if (item.confidence === "verify") out.push(el("span", { class: "badge verify", title: "Lower-confidence data — double-check in-game via the stopwatch icon and against ShulkLink/Fandom" }, ["⚠ Verify"]));
    return out;
  }

  function itemRow(entry) {
    const { item, category } = entry;
    const checked = Store.isChecked(item.id);
    const locked = !checked && Store.isMutexLocked(item.id);
    const badgeEls = badges(item, category);
    if (locked) badgeEls.push(forfeitBadge(item.id));
    const row = el("label", { class: "item" + (checked ? " done" : "") + (locked ? " locked" : ""), id: "item-" + item.id }, [
      el("input", {
        type: "checkbox",
        ...(checked ? { checked: "checked" } : {}),
        ...(locked ? { disabled: "disabled" } : {}),
        onchange: (e) => {
          Store.setChecked(item.id, e.target.checked);
          render(); // re-render to update progress / expires-next / hide-completed
        }
      }),
      el("span", { class: "item-body" }, [
        el("span", { class: "item-label", text: item.label }),
        el("span", { class: "item-badges" }, badgeEls),
        item.note ? el("span", { class: "item-note", text: item.note }) : null
      ])
    ]);
    return row;
  }

  // ---------- EXPIRES NEXT ----------
  function expiresNextPanel() {
    // entries that are missable, region-timed (have a cutoff), in a visible area, not yet checked
    const pending = ALL_ENTRIES.filter(({ item, area }) => {
      if (!item.missable) return false;
      if (area && !isAreaVisible(area)) return false;
      if (Store.isChecked(item.id)) return false;
      return !!effectiveCutoff(item, area);
    });
    if (!pending.length) {
      return el("div", { class: "panel expires-next clear" }, [
        el("div", { class: "panel-title", text: "✓ No missables pending in revealed areas" }),
        el("div", { class: "muted", text: "Reveal more areas in the Full 100% tab as you reach them — new cutoffs will appear here." })
      ]);
    }
    // earliest cutoff (by order) that has pending items
    let earliest = null;
    pending.forEach((e) => {
      const cid = effectiveCutoff(e.item, e.area);
      const ord = CUTOFF_ORDER[cid];
      if (earliest == null || ord < earliest.ord) earliest = { ord, cid };
    });
    const cutoff = CUTOFF_BY_ID[earliest.cid];
    const items = pending.filter((e) => effectiveCutoff(e.item, e.area) === earliest.cid);
    const { crit, comp } = splitCritical(items);

    return el("div", { class: "panel expires-next" }, [
      el("div", { class: "panel-title", text: "⏱ Expires next — finish before you move on" }),
      el("div", { class: "cutoff-head" }, [
        el("strong", { text: cutoff ? cutoff.label : earliest.cid }),
        cutoff ? el("span", { class: "chip", text: cutoff.chapterAnchor }) : null
      ]),
      cutoff && cutoff.note ? el("div", { class: "muted", text: cutoff.note }) : null,
      crit.length ? el("div", { class: "expires-list" }, crit.map((e) => itemRow(e))) : null,
      completionDetails(comp)
    ]);
  }

  // ---------- MISSABLE VIEW ----------
  // a checkable missables row. Item ids match the Walkthrough dataset, so checks
  // are shared; `mg-*` extras are RPG-Site-only items with their own ids.
  function missRow(it) {
    const checked = Store.isChecked(it.id);
    const locked = !checked && Store.isMutexLocked(it.id);
    const badgeEls = [];
    if (it.timed) badgeEls.push(el("span", { class: "badge timed", title: "Timed quest — shows the in-game ⏱ icon" }, ["⏱ Timed"]));
    if (locked) badgeEls.push(forfeitBadge(it.id));
    return el("label", { class: "item" + (checked ? " done" : "") + (locked ? " locked" : ""), id: "item-" + it.id }, [
      el("input", { type: "checkbox", ...(checked ? { checked: "checked" } : {}), ...(locked ? { disabled: "disabled" } : {}), onchange: (e) => { Store.setChecked(it.id, e.target.checked); render(); } }),
      el("span", { class: "item-body" }, [
        el("span", { class: "item-label" }, [document.createTextNode(it.label), it.area ? el("span", { class: "item-sub", text: " · " + it.area }) : null]),
        badgeEls.length ? el("span", { class: "item-badges" }, badgeEls) : null,
        it.note ? el("span", { class: "item-note", text: it.note }) : null
      ])
    ]);
  }

  // Missables tab — RPG Site checklist (data.missables), spoiler-gated by arc.
  function missableView() {
    const wrap = el("div", { class: "view" });
    wrap.appendChild(el("div", { class: "arc-banner" }, [
      el("div", { class: "arc-title", text: "⏱ Missables — RPG Site checklist" }),
      el("div", { class: "muted", text: "Grouped by point of no return (source: RPG Site's missables list). Later cutoffs stay sealed / genericised until you reveal that Part in the Walkthrough tab. Checks here are shared with the Walkthrough tab. Always trust the in-game ⏱ icon." })
    ]));

    let shown = 0;
    (DATA.missables || []).forEach((m) => {
      const triggerRevealed = arcReached(m.triggerArc);
      const allVisible = m.items.filter((it) => arcReached(it.arc)).concat(m.extras.filter((e) => arcReached(e.arc)));
      if (!allVisible.length) return;
      const done = allVisible.filter((x) => Store.isChecked(x.id)).length;
      if (Store.getPref("hideCompleted") && done === allVisible.length) return;
      shown++;
      const items = m.items.filter((it) => arcReached(it.arc)).filter(matchesSearch).filter((it) => !(Store.getPref("hideCompleted") && Store.isChecked(it.id)));
      const extras = m.extras.filter((e) => arcReached(e.arc)).filter(matchesSearch).filter((e) => !(Store.getPref("hideCompleted") && Store.isChecked(e.id)));
      wrap.appendChild(el("section", { class: "cutoff-card" + (done === allVisible.length ? " complete" : "") }, [
        el("div", { class: "cutoff-head" }, [
          el("strong", { text: triggerRevealed ? m.label : m.generic }),
          el("span", { class: "count", text: `${done}/${allVisible.length}` })
        ]),
        el("div", { class: "muted cutoff-trigger", text: triggerRevealed ? m.trigger : "⏱ These are TIMED — finish them before a later-game point of no return." }),
        items.length ? el("div", { class: "items" }, items.map(missRow)) : null,
        extras.length ? el("div", { class: "miss-extras" }, [
          el("div", { class: "miss-extras-head", text: "Also flagged by RPG Site" }),
          el("div", { class: "items" }, extras.map(missRow))
        ]) : null
      ]));
    });

    if (!shown) wrap.appendChild(el("div", { class: "empty muted", text: "No missables in revealed Parts yet — they appear as you reveal Parts in the Walkthrough tab." }));
    return wrap;
  }

  // ---------- FULL VIEW ----------
  // landmarks + locations share one data array (kind: "Landmark"|"Location");
  // surface them as two separate categories.
  function listForCat(area, cat) {
    const sec = area.sections || {};
    if (cat === "landmarks") return (sec.landmarks || []).filter((i) => i.kind !== "Location");
    if (cat === "locations") return (sec.landmarks || []).filter((i) => i.kind === "Location");
    return sec[cat] || [];
  }
  // a compact collectable row (no badges/notes — keeps the six columns tight)
  function collectRow(entry) {
    const item = entry.item;
    const checked = Store.isChecked(item.id);
    return el("label", { class: "item" + (checked ? " done" : ""), id: "item-" + item.id }, [
      el("input", { type: "checkbox", ...(checked ? { checked: "checked" } : {}), onchange: (e) => { Store.setChecked(item.id, e.target.checked); render(); } }),
      el("span", { class: "item-body" }, [el("span", { class: "item-label", text: item.label })])
    ]);
  }
  // collectopaedia laid out as the game's six category columns
  function collectGrouped(entries) {
    const buckets = {};
    entries.forEach((e) => { const c = e.item.cat || "strange"; (buckets[c] = buckets[c] || []).push(e); });
    const wrap = el("div", { class: "collect-cols" });
    COLLECT_CAT_ORDER.forEach((c) => {
      const arr = buckets[c];
      if (!arr || !arr.length) return;
      const done = arr.filter((e) => Store.isChecked(e.item.id)).length;
      wrap.appendChild(el("div", { class: "collect-col" }, [
        el("div", { class: "collect-cat" }, [el("span", { text: COLLECT_CAT_LABEL[c] }), el("span", { class: "count", text: `${done}/${arr.length}` })]),
        el("div", { class: "items" }, arr.map(collectRow))
      ]));
    });
    return wrap;
  }
  function areaCard(area) {
    const cutoff = area.locksAt ? CUTOFF_BY_ID[area.locksAt] : null;
    const lockBanner = cutoff
      ? el("div", { class: "lock-banner danger" }, [`⏱ Locks: ${cutoff.label} `, el("span", { class: "chip", text: cutoff.chapterAnchor })])
      : el("div", { class: "lock-banner safe", text: "↻ Never locks — do anytime" });

    const links = el("div", { class: "area-links" }, [
      area.shulkLinkSection ? el("a", { href: area.shulkLinkSection, target: "_blank", rel: "noopener", class: "link" }, ["📖 ShulkLink walkthrough"]) : null,
      DATA.meta && DATA.meta.links ? el("a", { href: DATA.meta.links.timedQuestFaq, target: "_blank", rel: "noopener", class: "link" }, ["⏱ Timed Quest FAQ"]) : null
    ]);

    const body = el("div", { class: "area-body" });
    const catFilter = Store.getPref("category");
    // a category block that auto-collapses once every item in it is checked
    const mkBlock = (cat) => {
      if (catFilter !== "all" && catFilter !== cat) return null;
      const allList = listForCat(area, cat);
      if (!allList.length) return null;
      const entries = allList
        .map((item) => ({ item, area, category: cat }))
        .filter((e) => matchesSearch(e.item))
        .filter((e) => !(Store.getPref("hideCompleted") && Store.isChecked(e.item.id)));
      if (!entries.length) return null;
      const total = allList.length;
      const done = allList.filter((i) => Store.isChecked(i.id)).length;
      const allDone = done === total;
      const inner = (cat === "collectopaedia") ? collectGrouped(entries) : el("div", { class: "items" }, entries.map(itemRow));
      return el("details", { class: "cat-block" + (cat === "collectopaedia" ? " collect-block" : "") + (allDone ? " complete" : ""), ...(allDone ? {} : { open: "open" }) }, [
        el("summary", { class: "cat-head" }, [
          el("span", { text: CATEGORY_LABELS[cat] || cat }),
          el("span", { class: "count", text: `${done}/${total}` })
        ]),
        inner
      ]);
    };
    // Landmarks + Locations side-by-side; then Collectopaedia (6 columns); then Colony 6.
    const lm = mkBlock("landmarks"), loc = mkBlock("locations");
    const placesRow = (lm || loc) ? el("div", { class: "places-row" }, [lm, loc].filter(Boolean)) : null;
    const collo = mkBlock("collectopaedia");
    const c6 = mkBlock("colony6");
    [placesRow, collo, c6].filter(Boolean).forEach((b) => body.appendChild(b));
    if (!placesRow && !collo && !c6) body.appendChild(el("div", { class: "muted empty", text: "Nothing in this area for the current filters." }));

    // whole area auto-collapses once every collectable in it is checked off
    const areaItems = [];
    COLLECT_VIEW_CATS.forEach((cat) => listForCat(area, cat).forEach((i) => areaItems.push(i)));
    const areaDone = areaItems.filter((i) => Store.isChecked(i.id)).length;
    const areaComplete = areaItems.length > 0 && areaDone === areaItems.length;
    return el("details", { class: "area-card area-collapsible" + (areaComplete ? " complete" : ""), ...(areaComplete ? {} : { open: "open" }) }, [
      el("summary", { class: "area-head" }, [
        el("h3", { text: area.name }),
        el("span", { class: "chip soft", text: area.reachableAnchor }),
        areaItems.length ? el("span", { class: "count", text: `${areaDone}/${areaItems.length}` }) : null
      ]),
      lockBanner,
      links,
      body
    ]);
  }

  // ---------- WALKTHROUGH VIEW (ShulkLink §4.1–4.40) ----------
  function walkBadges(item, kind) {
    const out = [];
    if (item.timed) out.push(el("span", { class: "badge timed", title: "Timed quest — has the in-game ⏱ stopwatch icon and expires at a point of no return" }, ["⏱ Timed"]));
    if (item.mutexWith) out.push(el("span", { class: "badge mutex", title: "Mutually exclusive — completing this forfeits: " + item.mutexWith }, ["⚄ Either/or"]));
    if (item.story) out.push(el("span", { class: "badge story", title: "Story quest — required to progress" }, ["📖 Story"]));
    if (kind === "um" && item.missable) out.push(el("span", { class: "badge ach", title: "Missable / no-respawn unique monster" }, ["★ Missable"]));
    if (item.confidence === "verify") out.push(el("span", { class: "badge verify", title: "Double-check in-game" }, ["⚠ Verify"]));
    return out;
  }
  function itemDetails(item) {
    const rows = [
      ["Area", item.area], ["Giver", item.giver], ["Location", item.location],
      ["Condition", item.condition], ["Affinity", item.affinity], ["Objective", item.objective],
      ["Gain choices", item.gainChoices], ["Rewards", item.rewards], ["Strategy", item.strategy],
      ["Affinity changes", item.affinityChanges], ["Why this pick", item.mutexWhy]
    ].filter(([, v]) => v);
    const hasRich = item.giver || item.location || item.objective || item.rewards || item.strategy ||
      item.condition || item.gainChoices || item.mutexWhy || item.affinity || item.affinityChanges;
    if (!hasRich) return null;
    // always-visible detail grid (no disclosure); faded by CSS when the item is checked
    return el("div", { class: "qfields" }, rows.map(([k, v]) => {
      let vcell;
      if (k === "Gain choices") {
        // one dialogue choice per line
        const parts = String(v).split("//").map((x) => x.trim()).filter(Boolean);
        vcell = el("span", { class: "qf-v choices" }, parts.map((p) => el("span", { class: "choice", text: p })));
      } else {
        vcell = el("span", { class: "qf-v", text: v });
      }
      return el("div", { class: "qf" + (k === "Why this pick" ? " why" : k === "Affinity changes" ? " aff" : "") }, [
        el("span", { class: "qf-k", text: k }), vcell
      ]);
    }));
  }
  // parse {{spoiler}} markup into text nodes + click-to-reveal spans
  function parseSpoilers(text) {
    const out = [];
    const re = /\{\{(.+?)\}\}/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(document.createTextNode(text.slice(last, m.index)));
      out.push(el("span", { class: "spoiler", title: "Spoiler — click to reveal" }, [m[1]]));
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push(document.createTextNode(text.slice(last)));
    return out;
  }
  // a checkable route step (numbered) with display-only Nota-Bene sub-bullets
  // (notes aren't checkable but cross out together with their parent step)
  function routeStep(g) {
    const checked = Store.isChecked(g.id);
    const stepRow = el("label", { class: "rstep" }, [
      el("input", { type: "checkbox", ...(checked ? { checked: "checked" } : {}), onchange: (e) => { Store.setChecked(g.id, e.target.checked); render(); } }),
      el("span", { class: "rstep-text" }, parseSpoilers(g.step))
    ]);
    const kids = [stepRow];
    if (g.notes && g.notes.length) {
      kids.push(el("ul", { class: "rnotes" }, g.notes.map((n) =>
        el("li", { class: "rnote" }, [el("span", { class: "rnote-text" }, [document.createTextNode("📝 "), ...parseSpoilers(n.text)])])
      )));
    }
    return el("li", { class: "rli" + (checked ? " done" : "") }, kids);
  }
  function walkRow(item, kind) {
    const checked = Store.isChecked(item.id);
    const locked = !checked && Store.isMutexLocked(item.id);
    const badgeEls = walkBadges(item, kind);
    if (locked) badgeEls.push(forfeitBadge(item.id));
    return el("label", { class: "item" + (checked ? " done" : "") + (locked ? " locked" : ""), id: "item-" + item.id }, [
      el("input", { type: "checkbox", ...(checked ? { checked: "checked" } : {}), ...(locked ? { disabled: "disabled" } : {}), onchange: (e) => { Store.setChecked(item.id, e.target.checked); render(); } }),
      el("span", { class: "item-body" }, [
        el("span", { class: "item-label" }, [item.code ? el("span", { class: "qcode", text: item.code + " " }) : null, document.createTextNode(item.label)]),
        el("span", { class: "item-badges" }, badgeEls),
        item.note ? el("span", { class: "item-note", text: item.note }) : null,
        (kind === "um" && IMPLIED_BY[item.id]) ? el("span", { class: "item-note implied", text: "↩ Auto-checks when you complete: " + IMPLIED_BY[item.id].join(", ") }) : null,
        item.rpgsite ? el("span", { class: "item-note rpg" + (item.rpgConflict ? " conflict" : ""), text: (item.rpgConflict ? "⚠ Guides disagree — " : "ℹ Second opinion — ") + item.rpgsite }) : null,
        itemDetails(item)
      ])
    ]);
  }
  function forfeitBadge(id) {
    const w = Store.mutexWinner(id);
    const wl = w && ITEM_LABEL[w] ? " — chose “" + ITEM_LABEL[w] + "”" : "";
    return el("span", { class: "badge forfeit", title: "Mutually exclusive — its partner is already completed" }, ["⚄ Forfeited" + wl]);
  }
  // reference panel (display-only): landmarks/locations (quoted), records, nota bene, affinity steps
  function refList(label, arr, opts) {
    opts = opts || {};
    if (!arr || !arr.length) return null;
    return el("div", { class: "ref-block" + (opts.cls ? " " + opts.cls : "") }, [
      el("div", { class: "ref-head", text: label + " (" + arr.length + ")" }),
      el("ul", { class: "ref-listw" }, arr.map((x) => el("li", { text: opts.quote ? "“" + x + "”" : x })))
    ]);
  }
  function walkBlock(label, list, kind) {
    const all = (list || []).filter((it) => matchesSearch(it));
    if (!all.length) return null;
    const done = all.filter((it) => Store.isChecked(it.id)).length;
    const allDone = done === all.length;
    const visible = Store.getPref("hideCompleted") ? all.filter((it) => !Store.isChecked(it.id)) : all;
    if (!visible.length) return null;
    // a <details> that auto-collapses once every item in the block is checked
    return el("details", { class: "cat-block" + (allDone ? " complete" : ""), ...(allDone ? {} : { open: "open" }) }, [
      el("summary", { class: "cat-head" }, [el("span", { text: label }), el("span", { class: "count", text: `${done}/${all.length}` })]),
      el("div", { class: "items" }, visible.map((it) => walkRow(it, kind)))
    ]);
  }
  // A block where settled-complete items (checked > 60s ago) tuck into a collapsed
  // "Completed" sub-section at the top; freshly-checked ones stay visible so an
  // accidental check can be undone within the grace period. Used for quests + UMs.
  function settleBlock(label, list, kind) {
    const all = (list || []).filter((it) => matchesSearch(it));
    if (!all.length) return null;
    const done = all.filter((it) => Store.isChecked(it.id)).length;
    const allDone = done === all.length;
    const settled = all.filter((it) => Store.isChecked(it.id) && Store.isSettled(it.id));
    const active = all.filter((it) => !(Store.isChecked(it.id) && Store.isSettled(it.id)));
    const hideC = Store.getPref("hideCompleted");
    const activeVisible = hideC ? active.filter((it) => !Store.isChecked(it.id)) : active;
    if (!activeVisible.length && (hideC || !settled.length)) return null;
    const completedSub = (!hideC && settled.length)
      ? el("details", { class: "completed-quests" }, [
          el("summary", { class: "completed-quests-head" }, ["✓ Completed — " + settled.length]),
          el("div", { class: "items" }, settled.map((it) => walkRow(it, kind)))
        ])
      : null;
    return el("details", { class: "cat-block" + (allDone ? " complete" : ""), ...(allDone ? {} : { open: "open" }) }, [
      el("summary", { class: "cat-head" }, [el("span", { text: label }), el("span", { class: "count", text: `${done}/${all.length}` })]),
      el("div", { class: "items" }, [completedSub, ...activeVisible.map((it) => walkRow(it, kind))].filter(Boolean))
    ]);
  }
  // --- story-Part (arc) spoiler gating ---
  function arcReached(id) { return Store.isReached(id); }
  function ponrSectionArc(ponr) {
    const code = (ponr && ponr.after || "").replace(/[^0-9.]/g, "");
    const sec = (DATA.walkthrough || []).find((s) => s.id === code);
    return sec ? sec.arc : null;
  }
  function ponrVisible(ponr) { const a = ponrSectionArc(ponr); return a ? arcReached(a) : true; }

  function sectionCard(s) {
    const ponrTrig = s.ponrTrigger ? (DATA.pointsOfNoReturn || []).find((p) => p.id === s.ponrTrigger) : null;
    const locks = s.locksAt ? (DATA.pointsOfNoReturn || []).find((p) => p.id === s.locksAt) : null;
    const banners = [];
    if (ponrTrig) banners.push(el("div", { class: "lock-banner danger" }, [`⚠ POINT OF NO RETURN here: ${ponrTrig.label} — ${ponrTrig.locks}`]));
    if (locks && !ponrTrig) {
      // if the lock's trigger is in a not-yet-revealed Part, keep the warning spoiler-safe
      banners.push(el("div", { class: "lock-banner danger" }, [ponrVisible(locks)
        ? `⏱ Do before: ${locks.label}. ${locks.locks}`
        : `⏱ These are TIMED quests — finish them now. They become permanently unavailable at a later-game point of no return.`]));
    }
    // Group landmarks / locations / quests / unique monsters by in-game area,
    // each area a collapsible. Records / H2H / Colony 6 / affinity stay section-level.
    const groups = {};
    const push = (cat, list) => (list || []).forEach((i) => {
      const r = i.area || "Other";
      (groups[r] = groups[r] || { landmarks: [], locations: [], quests: [], ums: [] })[cat].push(i);
    });
    push("landmarks", s.landmarks); push("locations", s.locations); push("quests", s.quests); push("ums", s.ums);
    const regions = Object.keys(groups).sort((a, b) => regionIndex(a) - regionIndex(b));
    const areaGroups = regions.map((r) => {
      const g = groups[r];
      const lmBlock = walkBlock("📍 Landmarks (discover here)", g.landmarks, "lm");
      const locBlock = walkBlock("📍 Locations (discover here)", g.locations, "loc");
      const qBlock = settleBlock("Quests", g.quests, "q");
      const umBlock = settleBlock("Unique Monsters", g.ums, "um");
      // quests + unique monsters sit side-by-side on wide screens
      const qumRow = (qBlock || umBlock) ? el("div", { class: "qum-row" }, [qBlock, umBlock].filter(Boolean)) : null;
      const blocks = [lmBlock, locBlock, qumRow].filter(Boolean);
      if (!blocks.length) return null;
      const all = [...g.landmarks, ...g.locations, ...g.quests, ...g.ums];
      const done = all.filter((i) => Store.isChecked(i.id)).length;
      const allDone = done === all.length;
      const agId = "ag-" + String(s.code).replace(/\./g, "-") + "-" + r.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return el("details", { class: "area-group" + (allDone ? " complete" : ""), id: agId, "data-region": r, ...(allDone ? {} : { open: "open" }) }, [
        el("summary", { class: "area-group-head" }, [el("span", { text: "📂 " + r }), el("span", { class: "count", text: `${done}/${all.length}` })]),
        el("div", { class: "area-group-body" }, blocks)
      ]);
    }).filter(Boolean);

    // Heart-to-Hearts move directly under the route (rendered separately, below).
    const hthBlock = walkBlock("Heart-to-Hearts", s.hths, "hth");
    // Records + Trials side-by-side (records left, trials right).
    const recBlock = walkBlock("🏅 Records to unlock", s.records, "rec");
    const triBlock = walkBlock("🎯 Trials to unlock", s.trials, "trial");
    const rtRow = (recBlock || triBlock) ? el("div", { class: "qum-row" }, [recBlock, triBlock].filter(Boolean)) : null;
    const sectionBlocks = [
      walkBlock("Colony 6 Development", s.colony6, "c6"),
      rtRow,
      walkBlock("💞 Improve area affinity — steps", s.affinitySteps, "aff"),
      // Nota Bene lives under route steps when a route exists; otherwise show the panel
      (s.guide && s.guide.length) ? null : refList("📝 Nota Bene", s.notaBene, { cls: "nb" })
    ].filter(Boolean);

    const body = el("div", { class: "area-body" }, [...areaGroups, ...sectionBlocks]);
    if (!areaGroups.length && !sectionBlocks.length && !hthBlock && !(s.guide && s.guide.length)) {
      body.appendChild(el("div", { class: "muted empty", text: "(Story/exploration section — nothing to check off here, or filtered out.)" }));
    }
    // Route — a collapsible that auto-collapses once every step is checked.
    let route = null;
    if (s.guide && s.guide.length) {
      const rDone = s.guide.filter((g) => Store.isChecked(g.id)).length;
      const rAll = s.guide.length;
      const rComplete = rDone === rAll;
      route = el("details", { class: "route" + (rComplete ? " complete" : ""), ...(rComplete ? {} : { open: "open" }) }, [
        el("summary", { class: "route-head" }, [el("span", { text: "🧭 Route — what to do" }), el("span", { class: "count", text: `${rDone}/${rAll}` })]),
        el("ol", { class: "route-list" }, s.guide.map(routeStep))
      ]);
    }
    // best-arts panel is NOT inlined per section — a single floating card (managed
    // by updateArtsFloat) follows the scroll and shows only the active section.
    return el("section", { class: "area-card", "data-code": s.code }, [
      el("div", { class: "area-head" }, [
        el("h3", { text: s.title }),
        el("span", { class: "chip soft", text: "§" + s.code }),
        el("span", { class: "chip soft", text: s.region })
      ]),
      ...banners,
      ...((s.notes || []).map((n) => el("div", { class: "muted section-note", text: n }))),
      route,
      hthBlock,
      body
    ]);
  }

  // ----- floating side cards: best-arts (right) + area table-of-contents (left),
  //       both tracking the walkthrough section currently in view -----
  let artsFloatEl = null, tocFloatEl = null, floatsBound = false;
  function sectionByCode(code) { return (DATA.walkthrough || []).find((s) => s.code === code); }
  function activeSectionCard() {
    const LINE = 160; // reference line, px from the top of the viewport
    // only sections in the active flow — never the collapsed "Completed sections" pile
    const cards = Array.prototype.slice
      .call(document.querySelectorAll("#app .area-card[data-code]"))
      .filter((c) => !c.closest(".completed-area"));
    let firstBelow = null, lastAbove = null;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (r.height <= 0) continue;                       // skip anything not laid out
      if (r.top <= LINE && r.bottom > LINE) return cards[i]; // the card crossing the line = active
      if (r.bottom <= LINE) lastAbove = cards[i];        // fully scrolled past
      else if (!firstBelow) firstBelow = cards[i];        // first one still below the line
    }
    return firstBelow || lastAbove || cards[0] || null;
  }
  function updateArtsFloat() {
    if (!artsFloatEl) return;
    const active = Store.getPref("view") === "walk" ? activeSectionCard() : null;
    const s = active && sectionByCode(active.getAttribute("data-code"));
    const aside = s ? artsAside(s) : null;
    artsFloatEl.innerHTML = "";
    if (!aside) { artsFloatEl.style.display = "none"; return; }
    artsFloatEl.appendChild(aside);
    artsFloatEl.style.display = "";
  }
  function updateTocFloat() {
    if (!tocFloatEl) return;
    const active = Store.getPref("view") === "walk" ? activeSectionCard() : null;
    const groups = active ? active.querySelectorAll(".area-group[data-region]") : [];
    if (!active || groups.length < 2) { tocFloatEl.style.display = "none"; return; }
    const card = el("div", { class: "toc-card" }, [el("div", { class: "toc-head", text: "🧭 Jump to area" })]);
    groups.forEach((g) => {
      const region = g.getAttribute("data-region");
      card.appendChild(el("button", {
        class: "toc-link" + (g.classList.contains("complete") ? " done" : ""),
        onclick: () => { g.open = true; g.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }, [region]));
    });
    tocFloatEl.innerHTML = "";
    tocFloatEl.appendChild(card);
    tocFloatEl.style.display = "";
  }
  function updateFloats() { updateArtsFloat(); updateTocFloat(); }
  function ensureFloats() {
    if (!artsFloatEl) { artsFloatEl = el("div", { id: "arts-float" }); document.body.appendChild(artsFloatEl); }
    if (!tocFloatEl) { tocFloatEl = el("div", { id: "toc-float" }); document.body.appendChild(tocFloatEl); }
    if (!floatsBound) {
      window.addEventListener("scroll", updateFloats, { passive: true });
      window.addEventListener("resize", updateFloats, { passive: true });
      floatsBound = true;
    }
  }
  const REGION_ORDER = ["Colony 9", "Tephra Cave", "Bionis' Leg", "Colony 6", "Ether Mine", "Satorl Marsh",
    "Bionis' Interior", "Makna Forest", "Frontier Village", "Eryth Sea", "Alcamoth", "High Entia Tomb",
    "Prison Island", "Valak Mountain", "Sword Valley", "Galahad Fortress", "Fallen Arm", "Mechonis Field",
    "Central Factory", "Agniratha", "Mechonis Core", "Memory Space", "Other"];
  function regionIndex(r) { const i = REGION_ORDER.indexOf(r); return i < 0 ? 998 : i; }

  // a section is "complete" when it has checkable items and they're all checked
  function sectionComplete(s) {
    const ids = [];
    ["quests", "ums", "hths", "colony6", "landmarks", "locations", "records", "trials", "affinitySteps"].forEach((k) => (s[k] || []).forEach((i) => ids.push(i.id)));
    (s.guide || []).forEach((g) => ids.push(g.id));
    return ids.length > 0 && ids.every((id) => Store.isChecked(id));
  }
  function walkView() {
    const wrap = el("div", { class: "view" });
    const secs = DATA.walkthrough || [];
    const arcs = DATA.arcs || [];
    const reached = arcs.filter((a) => arcReached(a.id));
    const cur = reached[reached.length - 1] || arcs[0];

    // current-Part header + spoiler-wall status
    wrap.appendChild(el("div", { class: "arc-banner" }, [
      el("div", { class: "arc-title", text: "📖 " + (cur ? cur.title : "Walkthrough") }),
      cur && cur.blurb ? el("div", { class: "muted", text: cur.blurb }) : null,
      el("div", { class: "muted small", text: "🔒 Spoiler wall is ON — nothing past this Part is shown. Browse this Part freely." })
    ]));

    const visible = secs.filter((s) => arcReached(s.arc));
    const completed = visible.filter(sectionComplete);
    const active = visible.filter((s) => !sectionComplete(s));

    // fully-checked sections collapse into a "Completed sections" area at the top
    if (completed.length) {
      wrap.appendChild(el("details", { class: "completed-area" }, [
        el("summary", { class: "completed-summary" }, ["✓ Completed sections — " + completed.length]),
        el("div", { class: "completed-body" }, completed.map(sectionCard))
      ]));
    }
    active.forEach((s) => wrap.appendChild(sectionCard(s)));

    // sealed wall for the next Part
    const nextArc = arcs.find((a) => !arcReached(a.id));
    if (nextArc) {
      wrap.appendChild(el("div", { class: "arc-wall" }, [
        el("div", { class: "arc-wall-title", text: "🚧 " + nextArc.title + " — sealed" }),
        el("div", { class: "muted", text: nextArc.blurb }),
        el("div", { class: "muted small", text: "Revealing this shows quests, regions and story events from later in the game." }),
        el("button", {
          class: "btn reveal",
          onclick: () => { if (confirm("Reveal " + nextArc.title + "?\n\nThis permanently shows content and SPOILERS from later in the game.")) { Store.markReached(nextArc.id); render(); } }
        }, ["Reveal " + nextArc.title + " ▸"])
      ]));
    }
    return wrap;
  }

  function fullView() {
    const wrap = el("div", { class: "view" });
    const areas = DATA.areas || [];
    const visible = areas.filter(isAreaVisible);
    visible.forEach((a) => wrap.appendChild(areaCard(a)));

    // progressive reveal control
    if (Store.getPref("hideFutureAreas")) {
      const nextHidden = areas.find((a) => !Store.isReached(a.id));
      if (nextHidden) {
        wrap.appendChild(el("div", { class: "reveal-row" }, [
          el("button", {
            class: "btn reveal",
            onclick: () => { Store.markReached(nextHidden.id); render(); }
          }, ["Reveal next area ▸"]),
          el("span", { class: "muted", text: "Reveal an area only once you've actually reached it in-game (keeps later places hidden / spoiler-free)." })
        ]));
      }
    }

    // (Achievements / Other Missables live on the Missable tab, not here.)
    if (!visible.length) wrap.insertBefore(el("div", { class: "muted empty", text: "No areas revealed yet — hit “Reveal next area” when you start playing." }), wrap.firstChild);
    return wrap;
  }

  // ---------- RECORDS & TRIALS VIEW (own tab) ----------
  function recordsView() {
    const wrap = el("div", { class: "view" });
    wrap.appendChild(el("div", { class: "arc-banner" }, [
      el("div", { class: "arc-title", text: "🏅 Records & Trials" }),
      el("div", { class: "muted", text: "Numbered in wiki order, with the actual (spoiler-free) unlock condition for each. Records carry over in New Game+; Trials reset. Checks are shared with the Walkthrough tab." })
    ]));
    const card = recordsTrialsCard();
    wrap.appendChild(card || el("div", { class: "empty muted", text: "No records or trials in revealed Parts yet." }));
    return wrap;
  }

  // wiki lookup: normalised achievement name -> { type, n, cond, name }
  let _wikiLUT = null;
  function normAch(s) { return String(s).toLowerCase().replace(/^(a|an|the)\s+/, "").replace(/[^a-z0-9]+/g, ""); }
  function wikiLUT() {
    if (_wikiLUT) return _wikiLUT;
    _wikiLUT = {};
    const wa = DATA.wikiAchievements || { trials: [], records: [] };
    (wa.records || []).forEach((r) => { _wikiLUT[normAch(r.name)] = { type: "record", n: r.n, cond: r.cond, name: r.name }; });
    (wa.trials || []).forEach((t) => { _wikiLUT[normAch(t.name)] = { type: "trial", n: t.n, cond: t.cond, name: t.name }; });
    return _wikiLUT;
  }
  function achRow(e) {
    const checked = Store.isChecked(e.id);
    return el("label", { class: "item" + (checked ? " done" : ""), id: "item-" + e.id }, [
      el("input", { type: "checkbox", ...(checked ? { checked: "checked" } : {}), onchange: (ev) => { Store.setChecked(e.id, ev.target.checked); render(); } }),
      el("span", { class: "item-body" }, [
        el("span", { class: "item-label" }, [e.n < 9999 ? el("span", { class: "ach-num", text: "#" + e.n + " " }) : null, document.createTextNode(e.name)]),
        e.cond ? el("span", { class: "item-note", text: e.cond }) : null
      ])
    ]);
  }
  // Records & Trials tab: built from the wiki list (number + condition, plot-free),
  // classified by the wiki (not by guide context), from REVEALED Parts only.
  function recordsTrialsCard() {
    const lut = wikiLUT();
    const secs = (DATA.walkthrough || []).filter((s) => arcReached(s.arc));
    const seen = { record: {}, trial: {} };
    secs.forEach((s) => ["records", "trials"].forEach((k) => (s[k] || []).forEach((it) => {
      const bare = String(it.label).split(" — ")[0].trim();
      const w = lut[normAch(bare)];
      if (w) { if (!seen[w.type][w.n]) seen[w.type][w.n] = { id: it.id, n: w.n, name: w.name, cond: w.cond }; }
      else { // not in the wiki list — keep it under its stored kind, unnumbered
        const type = k === "trials" ? "trial" : "record";
        seen[type]["x" + bare] = { id: it.id, n: 9999, name: bare, cond: null };
      }
    })));
    const sortNum = (a, b) => a.n - b.n || a.name.localeCompare(b.name);
    const recs = Object.values(seen.record).sort(sortNum);
    const tris = Object.values(seen.trial).sort(sortNum);
    if (!recs.length && !tris.length) return null;
    const q = (Store.getPref("search") || "").trim().toLowerCase();
    const column = (label, arr) => {
      const done = arr.filter((e) => Store.isChecked(e.id)).length;
      const visible = arr
        .filter((e) => !q || e.name.toLowerCase().includes(q) || (e.cond || "").toLowerCase().includes(q))
        .filter((e) => !(Store.getPref("hideCompleted") && Store.isChecked(e.id)));
      return el("div", { class: "rt-col" }, [
        el("div", { class: "rt-col-head" }, [
          el("span", { class: "rt-col-title", text: label }),
          el("span", { class: "rt-col-count", text: `${done} / ${arr.length} completed` })
        ]),
        visible.length
          ? el("div", { class: "items" }, visible.map(achRow))
          : el("div", { class: "muted empty", text: arr.length ? "All done here." : "None in revealed Parts yet." })
      ]);
    };
    const sealed = (DATA.arcs || []).some((a) => !arcReached(a.id));
    return el("section", { class: "area-card" }, [
      sealed ? el("div", { class: "muted", text: "🔒 More records & trials appear as you reveal later Parts in the Walkthrough tab." }) : null,
      el("div", { class: "rt-cols" }, [column("🏅 Records", recs), column("🎯 Trials", tris)])
    ]);
  }

  // ---------- controls ----------
  function controls() {
    const view = Store.getPref("view");
    const bar = el("div", { class: "controls" });

    const tabs = el("div", { class: "tabs" }, [
      el("button", { class: "tab" + (view === "walk" ? " active" : ""), onclick: () => { Store.setPref("view", "walk"); render(); } }, ["📖 Walkthrough"]),
      el("button", { class: "tab" + (view === "missable" ? " active" : ""), onclick: () => { Store.setPref("view", "missable"); render(); } }, ["⏱ Missable"]),
      el("button", { class: "tab" + (view === "full" ? " active" : ""), onclick: () => { Store.setPref("view", "full"); render(); } }, ["Collectables"]),
      el("button", { class: "tab" + (view === "records" ? " active" : ""), onclick: () => { Store.setPref("view", "records"); render(); } }, ["🏅 Records & Trials"])
    ]);

    const search = el("input", {
      class: "search", type: "search", placeholder: "Search quests, monsters, notes…",
      value: Store.getPref("search") || "",
      oninput: (e) => { Store.setPref("search", e.target.value); render(); }
    });

    const toggles = el("div", { class: "toggles" }, [
      toggle("Hide completed", "hideCompleted"),
      toggle("Hide future areas (spoiler guard)", "hideFutureAreas")
    ]);

    // category filter (full view only)
    const cat = el("select", {
      class: "cat-select",
      onchange: (e) => { Store.setPref("category", e.target.value); render(); }
    }, [el("option", { value: "all" }, ["All categories"])].concat(
      COLLECT_VIEW_CATS.map((c) => el("option", Object.assign({ value: c }, Store.getPref("category") === c ? { selected: "selected" } : {}), [CATEGORY_LABELS[c]]))
    ));
    if (Store.getPref("category") !== "all") cat.value = Store.getPref("category");

    const right = el("div", { class: "controls-right" }, [
      search,
      view === "full" ? cat : null,
      el("div", { class: "data-buttons" }, [
        el("button", { class: "btn small", onclick: doExport }, ["Export"]),
        el("button", { class: "btn small", onclick: doImport }, ["Import"]),
        el("button", { class: "btn small danger", onclick: doReset }, ["Reset"])
      ])
    ]);

    bar.appendChild(tabs);
    bar.appendChild(toggles);
    bar.appendChild(right);
    return bar;
  }

  function toggle(label, pref) {
    return el("label", { class: "toggle" }, [
      el("input", { type: "checkbox", ...(Store.getPref(pref) ? { checked: "checked" } : {}), onchange: (e) => { Store.setPref(pref, e.target.checked); render(); } }),
      el("span", { text: label })
    ]);
  }

  // ---------- data buttons ----------
  function doExport() {
    const blob = new Blob([JSON.stringify(Store.exportState(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = el("a", { href: url, download: "xcde-100-progress.json" });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  function doImport() {
    const input = el("input", { type: "file", accept: "application/json" });
    input.addEventListener("change", () => {
      const f = input.files[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try { if (Store.importState(JSON.parse(reader.result))) render(); else alert("Could not read that file."); }
        catch (e) { alert("Invalid JSON file."); }
      };
      reader.readAsText(f);
    });
    input.click();
  }
  function doReset() {
    if (confirm("Reset ALL progress (checks + revealed areas)? Export first if you want a backup.")) { Store.resetAll(); render(); }
  }

  // ---------- spoiler reveal (event delegation; don't toggle the step checkbox) ----------
  document.addEventListener("click", (e) => {
    const sp = e.target.closest(".spoiler");
    if (!sp) return;
    e.preventDefault();
    e.stopPropagation();
    sp.classList.toggle("revealed");
  }, true);

  // ---------- mutex highlight (event delegation) ----------
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-mutex]");
    if (!b) return;
    e.preventDefault();
    const target = document.getElementById("item-" + b.getAttribute("data-mutex"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("flash");
      setTimeout(() => target.classList.remove("flash"), 1600);
    }
  });

  // ---------- render ----------
  function render() {
    const root = $("#app");
    root.innerHTML = "";
    document.body.classList.toggle("view-walk", Store.getPref("view") === "walk");

    const overall = progress(() => true);
    const missable = progress((i) => i.missable);

    root.appendChild(el("header", { class: "app-header" }, [
      el("div", { class: "title-row" }, [
        el("h1", { text: "Xenoblade Chronicles DE — 100% Tracker" }),
        el("span", { class: "subtitle", text: "Spoiler-free · missable-first" })
      ]),
      el("div", { class: "meters" }, [
        progressBar("⏱ Missable progress", missable, "accent"),
        progressBar("Overall 100%", overall, "")
      ])
    ]));

    root.appendChild(controls());
    const view = Store.getPref("view");
    root.appendChild(view === "walk" ? walkView() : view === "missable" ? missableView() : view === "records" ? recordsView() : fullView());

    root.appendChild(el("footer", { class: "app-footer" }, [
      el("div", { class: "muted", text: "Trust the in-game ⏱ stopwatch icon over any guide. Cross-check quest completeness on Fandom; read the area walkthroughs on ShulkLink." }),
      el("div", { class: "footer-links" }, [
        DATA.meta.links.fandomQuestsByArea ? el("a", { href: DATA.meta.links.fandomQuestsByArea, target: "_blank", rel: "noopener" }, ["Fandom — Quests by Area"]) : null,
        el("a", { href: DATA.meta.links.shulkLinkGuide, target: "_blank", rel: "noopener" }, ["ShulkLink 100% guide"]),
        el("a", { href: DATA.meta.links.timedQuestFaq, target: "_blank", rel: "noopener" }, ["Timed Quest FAQ"])
      ]),
      el("div", { class: "muted small", text: `Data ${DATA.meta.version} · ⚠ Verify = double-check in-game. Collectopaedia/landmark bulk data is loaded progressively.` })
    ]));

    updateFloats(); // refresh the floating best-arts + table-of-contents cards

    // schedule a re-render when the next freshly-checked quest "settles" (so it
    // tucks into Completed automatically ~60s after you check it)
    if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
    const next = Store.soonestSettle();
    if (next) settleTimer = setTimeout(render, Math.max(250, next - Date.now() + 50));
  }
  let settleTimer = null;

  // ---------- boot ----------
  fetch("data/checklist.json")
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then((data) => {
      DATA = data;
      buildIndex();
      // auto-reveal the first area + Part 1 so the app isn't empty on first run
      if (DATA.areas && DATA.areas.length && !Store.isReached(DATA.areas[0].id)) Store.markReached(DATA.areas[0].id);
      if (DATA.arcs && DATA.arcs.length && !Store.isReached(DATA.arcs[0].id)) Store.markReached(DATA.arcs[0].id);
      ensureFloats();
      render();
    })
    .catch((err) => {
      $("#app").innerHTML = '<div class="error">Failed to load checklist data: ' + esc(err.message) +
        '. If you opened the file directly (file://), run a local server instead — e.g. <code>python3 -m http.server</code> in this folder.</div>';
    });
})();
