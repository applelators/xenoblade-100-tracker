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

  let DATA = null;
  let CUTOFF_BY_ID = {};
  let CUTOFF_ORDER = {};      // id -> order index
  let ALL_ENTRIES = [];       // { item, area, category }

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
  }

  function progress(predicate) {
    let total = 0, done = 0;
    ALL_ENTRIES.forEach(({ item }) => {
      if (!predicate(item)) return;
      total++;
      if (Store.isChecked(item.id)) done++;
    });
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
    const row = el("label", { class: "item" + (checked ? " done" : ""), id: "item-" + item.id }, [
      el("input", {
        type: "checkbox",
        ...(checked ? { checked: "checked" } : {}),
        onchange: (e) => {
          Store.setChecked(item.id, e.target.checked);
          render(); // re-render to update progress / expires-next / hide-completed
        }
      }),
      el("span", { class: "item-body" }, [
        el("span", { class: "item-label", text: item.label }),
        el("span", { class: "item-badges" }, badges(item, category)),
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

    return el("div", { class: "panel expires-next" }, [
      el("div", { class: "panel-title", text: "⏱ Expires next — finish before you move on" }),
      el("div", { class: "cutoff-head" }, [
        el("strong", { text: cutoff ? cutoff.label : earliest.cid }),
        cutoff ? el("span", { class: "chip", text: cutoff.chapterAnchor }) : null
      ]),
      cutoff && cutoff.note ? el("div", { class: "muted", text: cutoff.note }) : null,
      el("div", { class: "expires-list" }, items.map((e) => itemRow(e)))
    ]);
  }

  // ---------- MISSABLE VIEW ----------
  function missableView() {
    const wrap = el("div", { class: "view" });

    // group visible, missable items by cutoff order; plus a no-deadline bucket
    const groups = {}; // cutoffId or "_none" -> entries
    ALL_ENTRIES.forEach((e) => {
      const { item, area } = e;
      if (!item.missable) return;
      if (area && !isAreaVisible(area)) return;
      if (!matchesSearch(item)) return;
      if (Store.getPref("hideCompleted") && Store.isChecked(item.id)) return;
      const cid = effectiveCutoff(item, area) || "_none";
      (groups[cid] = groups[cid] || []).push(e);
    });

    const orderedCutoffIds = (DATA.cutoffs || []).slice().sort((a, b) => a.order - b.order).map((c) => c.id);
    orderedCutoffIds.push("_none");

    let rendered = 0;
    orderedCutoffIds.forEach((cid) => {
      const entries = groups[cid];
      if (!entries || !entries.length) return;
      rendered++;
      const cutoff = CUTOFF_BY_ID[cid];
      const done = entries.filter((e) => Store.isChecked(e.item.id)).length;
      const head = el("div", { class: "cutoff-card" }, [
        el("div", { class: "cutoff-head" }, [
          el("strong", { text: cutoff ? cutoff.label : "Choice / one-time missables (no region deadline)" }),
          cutoff ? el("span", { class: "chip", text: cutoff.chapterAnchor }) : el("span", { class: "chip", text: "anytime, but easy to miss" }),
          el("span", { class: "count", text: `${done}/${entries.length}` })
        ]),
        cutoff && cutoff.note ? el("div", { class: "muted", text: cutoff.note }) : null,
        el("div", { class: "items" }, entries.map(itemRow))
      ]);
      wrap.appendChild(head);
    });

    if (!rendered) wrap.appendChild(el("div", { class: "empty muted", text: "Nothing to show — reveal areas as you reach them (Full 100% tab), or clear filters." }));
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
    if (Store.getPref("category") === "all") wrap.appendChild(tail);

    if (!visible.length) wrap.insertBefore(el("div", { class: "muted empty", text: "No areas revealed yet — hit “Reveal next area” when you start playing." }), wrap.firstChild);
    return wrap;
  }

  // ---------- controls ----------
  function controls() {
    const view = Store.getPref("view");
    const bar = el("div", { class: "controls" });

    const tabs = el("div", { class: "tabs" }, [
      el("button", { class: "tab" + (view === "missable" ? " active" : ""), onclick: () => { Store.setPref("view", "missable"); render(); } }, ["⏱ Missable priority"]),
      el("button", { class: "tab" + (view === "full" ? " active" : ""), onclick: () => { Store.setPref("view", "full"); render(); } }, ["Full 100%"])
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
    root.appendChild(expiresNextPanel());
    root.appendChild(Store.getPref("view") === "missable" ? missableView() : fullView());

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
      // auto-reveal the first area so the app isn't empty on first run
      if (Store.reachedCount() === 0 && DATA.areas && DATA.areas.length) Store.markReached(DATA.areas[0].id);
      render();
    })
    .catch((err) => {
      $("#app").innerHTML = '<div class="error">Failed to load checklist data: ' + esc(err.message) +
        '. If you opened the file directly (file://), run a local server instead — e.g. <code>python3 -m http.server</code> in this folder.</div>';
    });
})();
