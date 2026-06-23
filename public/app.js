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
    landmarks: "Landmarks & Locations",
    collectopaedia: "Collectopaedia",
    colony6: "Colony 6 Reconstruction",
    other: "Other Missables",
    achievements: "Achievements",
    futureConnected: "Future Connected"
  };
  const CATEGORY_ORDER = ["quests", "uniqueMonsters", "heartToHearts", "landmarks", "collectopaedia", "colony6", "other"];
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
    let shown = 0;
    CATEGORY_ORDER.forEach((cat) => {
      if (catFilter !== "all" && catFilter !== cat) return;
      const list = (area.sections && area.sections[cat]) || [];
      const entries = list
        .map((item) => ({ item, area, category: cat }))
        .filter((e) => matchesSearch(e.item))
        .filter((e) => !(Store.getPref("hideCompleted") && Store.isChecked(e.item.id)));
      if (!entries.length) return;
      shown += entries.length;
      const done = entries.filter((e) => Store.isChecked(e.item.id)).length;
      body.appendChild(el("div", { class: "cat-block" }, [
        el("div", { class: "cat-head" }, [
          el("span", { text: CATEGORY_LABELS[cat] || cat }),
          el("span", { class: "count", text: `${done}/${entries.length}` })
        ]),
        el("div", { class: "items" }, entries.map(itemRow))
      ]));
    });
    if (!shown) body.appendChild(el("div", { class: "muted empty", text: "Nothing in this area for the current filters." }));

    return el("section", { class: "area-card" }, [
      el("div", { class: "area-head" }, [
        el("h3", { text: area.name }),
        el("span", { class: "chip soft", text: area.reachableAnchor })
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
      const qBlock = walkBlock("Quests", g.quests, "q");
      const umBlock = walkBlock("Unique Monsters", g.ums, "um");
      // quests + unique monsters sit side-by-side on wide screens
      const qumRow = (qBlock || umBlock) ? el("div", { class: "qum-row" }, [qBlock, umBlock].filter(Boolean)) : null;
      const blocks = [lmBlock, locBlock, qumRow].filter(Boolean);
      if (!blocks.length) return null;
      const all = [...g.landmarks, ...g.locations, ...g.quests, ...g.ums];
      const done = all.filter((i) => Store.isChecked(i.id)).length;
      const allDone = done === all.length;
      return el("details", { class: "area-group" + (allDone ? " complete" : ""), ...(allDone ? {} : { open: "open" }) }, [
        el("summary", { class: "area-group-head" }, [el("span", { text: "📂 " + r }), el("span", { class: "count", text: `${done}/${all.length}` })]),
        el("div", { class: "area-group-body" }, blocks)
      ]);
    }).filter(Boolean);

    const sectionBlocks = [
      walkBlock("Heart-to-Hearts", s.hths, "hth"),
      walkBlock("Colony 6 Development", s.colony6, "c6"),
      walkBlock("🏅 Records to unlock", s.records, "rec"),
      walkBlock("🎯 Trials to unlock", s.trials, "trial"),
      walkBlock("💞 Improve area affinity — steps", s.affinitySteps, "aff"),
      // Nota Bene lives under route steps when a route exists; otherwise show the panel
      (s.guide && s.guide.length) ? null : refList("📝 Nota Bene", s.notaBene, { cls: "nb" })
    ].filter(Boolean);

    const body = el("div", { class: "area-body" }, [...areaGroups, ...sectionBlocks]);
    if (!areaGroups.length && !sectionBlocks.length && !(s.guide && s.guide.length)) {
      body.appendChild(el("div", { class: "muted empty", text: "(Story/exploration section — nothing to check off here, or filtered out.)" }));
    }
    const route = (s.guide && s.guide.length) ? el("div", { class: "route" }, [
      el("div", { class: "route-head", text: "🧭 Route — what to do" }),
      el("ol", { class: "route-list" }, s.guide.map(routeStep))
    ]) : null;
    const aside = artsAside(s);
    const main = el("div", { class: "area-main" }, [
      el("div", { class: "area-head" }, [
        el("h3", { text: s.title }),
        el("span", { class: "chip soft", text: "§" + s.code }),
        el("span", { class: "chip soft", text: s.region })
      ]),
      ...banners,
      ...((s.notes || []).map((n) => el("div", { class: "muted section-note", text: n }))),
      route,
      body
    ]);
    return el("section", { class: "area-card" + (aside ? " has-aside" : "") }, aside ? [main, aside] : [main]);
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

    // achievements + future connected appended at the bottom of full view
    const tail = el("div", { class: "view-tail" });
    ["achievements", "futureConnected"].forEach((cat) => {
      const list = (cat === "achievements" ? DATA.achievements : DATA.futureConnected) || [];
      const entries = list.map((item) => ({ item, area: null, category: cat }))
        .filter((e) => matchesSearch(e.item))
        .filter((e) => !(Store.getPref("hideCompleted") && Store.isChecked(e.item.id)));
      if (!entries.length) return;
      tail.appendChild(el("section", { class: "area-card" }, [
        el("div", { class: "area-head" }, [el("h3", { text: CATEGORY_LABELS[cat] })]),
        el("div", { class: "area-body" }, [el("div", { class: "items" }, entries.map(itemRow))])
      ]));
    });
    if (Store.getPref("category") === "all") {
      const rt = recordsTrialsCard();
      if (rt) wrap.appendChild(rt);
      wrap.appendChild(tail);
    }

    if (!visible.length) wrap.insertBefore(el("div", { class: "muted empty", text: "No areas revealed yet — hit “Reveal next area” when you start playing." }), wrap.firstChild);
    return wrap;
  }

  // Records & Trials, aggregated from REVEALED walkthrough sections only (spoiler
  // gate — later-Part record/trial names can be spoilers). Checks share with the
  // Walkthrough tab via the same wrec-/wtrial- ids.
  function recordsTrialsCard() {
    const secs = (DATA.walkthrough || []).filter((s) => arcReached(s.arc));
    const collect = (key) => { const out = []; secs.forEach((s) => (s[key] || []).forEach((it) => out.push(it))); return out; };
    const block = (label, arr) => {
      if (!arr.length) return null;
      const visible = arr.filter(matchesSearch).filter((it) => !(Store.getPref("hideCompleted") && Store.isChecked(it.id)));
      if (!visible.length) return null;
      const done = arr.filter((it) => Store.isChecked(it.id)).length;
      return el("details", { class: "cat-block", open: "open" }, [
        el("summary", { class: "cat-head" }, [el("span", { text: label }), el("span", { class: "count", text: `${done}/${arr.length}` })]),
        el("div", { class: "items" }, visible.map(missRow))
      ]);
    };
    const blocks = [block("🏅 Records", collect("records")), block("🎯 Trials", collect("trials"))].filter(Boolean);
    if (!blocks.length) return null;
    const sealed = (DATA.arcs || []).some((a) => !arcReached(a.id));
    return el("section", { class: "area-card" }, [
      el("div", { class: "area-head" }, [el("h3", { text: "Records & Trials" })]),
      el("div", { class: "muted", text: sealed
        ? "🔒 From the Parts you've revealed only — more records & trials (some with spoiler-y names) appear as you reveal later Parts in the Walkthrough tab."
        : "All Parts revealed." }),
      el("div", { class: "area-body" }, blocks)
    ]);
  }

  // ---------- controls ----------
  function controls() {
    const view = Store.getPref("view");
    const bar = el("div", { class: "controls" });

    const tabs = el("div", { class: "tabs" }, [
      el("button", { class: "tab" + (view === "walk" ? " active" : ""), onclick: () => { Store.setPref("view", "walk"); render(); } }, ["📖 Walkthrough"]),
      el("button", { class: "tab" + (view === "missable" ? " active" : ""), onclick: () => { Store.setPref("view", "missable"); render(); } }, ["⏱ Missable"]),
      el("button", { class: "tab" + (view === "full" ? " active" : ""), onclick: () => { Store.setPref("view", "full"); render(); } }, ["Collectables"])
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
      CATEGORY_ORDER.map((c) => el("option", Object.assign({ value: c }, Store.getPref("category") === c ? { selected: "selected" } : {}), [CATEGORY_LABELS[c]]))
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
    if (view === "full") root.appendChild(expiresNextPanel());
    root.appendChild(view === "walk" ? walkView() : view === "missable" ? missableView() : fullView());

    root.appendChild(el("footer", { class: "app-footer" }, [
      el("div", { class: "muted", text: "Trust the in-game ⏱ stopwatch icon over any guide. Cross-check quest completeness on Fandom; read the area walkthroughs on ShulkLink." }),
      el("div", { class: "footer-links" }, [
        DATA.meta.links.fandomQuestsByArea ? el("a", { href: DATA.meta.links.fandomQuestsByArea, target: "_blank", rel: "noopener" }, ["Fandom — Quests by Area"]) : null,
        el("a", { href: DATA.meta.links.shulkLinkGuide, target: "_blank", rel: "noopener" }, ["ShulkLink 100% guide"]),
        el("a", { href: DATA.meta.links.timedQuestFaq, target: "_blank", rel: "noopener" }, ["Timed Quest FAQ"])
      ]),
      el("div", { class: "muted small", text: `Data ${DATA.meta.version} · ⚠ Verify = double-check in-game. Collectopaedia/landmark bulk data is loaded progressively.` })
    ]));
  }

  // ---------- boot ----------
  fetch("data/checklist.json")
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then((data) => {
      DATA = data;
      buildIndex();
      // auto-reveal the first area + Part 1 so the app isn't empty on first run
      if (DATA.areas && DATA.areas.length && !Store.isReached(DATA.areas[0].id)) Store.markReached(DATA.areas[0].id);
      if (DATA.arcs && DATA.arcs.length && !Store.isReached(DATA.arcs[0].id)) Store.markReached(DATA.arcs[0].id);
      render();
    })
    .catch((err) => {
      $("#app").innerHTML = '<div class="error">Failed to load checklist data: ' + esc(err.message) +
        '. If you opened the file directly (file://), run a local server instead — e.g. <code>python3 -m http.server</code> in this folder.</div>';
    });
})();
