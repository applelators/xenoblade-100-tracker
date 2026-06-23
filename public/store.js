/*
 * store.js — persistence layer for the XCDE 100% tracker.
 *
 * v1: localStorage only (single device, zero backend, works offline).
 * The whole app talks to state ONLY through this object, so a future
 * D1 / KV cross-device sync layer can be dropped in here without touching
 * app.js (mirrors the pokemon-pack-tracker pattern).
 */
(function () {
  "use strict";

  const KEYS = {
    checked: "xbc100:checked",   // array of item ids
    reached: "xbc100:reached",   // array of area ids the player has reached
    prefs: "xbc100:prefs"        // ui preferences object
  };

  const DEFAULT_PREFS = {
    view: "walk",                // "walk" | "missable" | "full"
    hideCompleted: false,
    hideFutureAreas: true,       // spoiler guard: hide not-yet-reached areas/sections
    category: "all",             // category filter for full view
    search: ""
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage full / disabled — fail silently, app still works in-memory */
    }
  }

  // In-memory mirrors (Sets for fast membership tests).
  let checked = new Set(read(KEYS.checked, []));
  let reached = new Set(read(KEYS.reached, []));
  let prefs = Object.assign({}, DEFAULT_PREFS, read(KEYS.prefs, {}));

  // cross-dataset check-state links: id -> [partner ids] (set by app at load).
  // Checking an item also checks its matched twin in the other tab, and vice-versa.
  let links = {};
  const partnersOf = (id) => links[id] || [];

  // mutually-exclusive quests: id -> [partner ids]. Checking one clears the other.
  let mutex = {};
  const mutexOf = (id) => mutex[id] || [];

  const Store = {
    // ---- cross-dataset links / mutex ----
    setLinks(map) { links = map || {}; },
    setMutex(map) { mutex = map || {}; },

    // ---- checked items ----
    isChecked(id) {
      if (checked.has(id)) return true;
      const ps = links[id];
      if (ps) for (let i = 0; i < ps.length; i++) if (checked.has(ps[i])) return true;
      return false;
    },
    // is this item blocked because a mutually-exclusive partner is already done?
    isMutexLocked(id) {
      if (this.isChecked(id)) return false;
      const ps = mutex[id];
      if (ps) for (let i = 0; i < ps.length; i++) if (this.isChecked(ps[i])) return true;
      return false;
    },
    // the checked mutex partner blocking this id (or null)
    mutexWinner(id) {
      const ps = mutex[id] || [];
      for (let i = 0; i < ps.length; i++) if (this.isChecked(ps[i])) return ps[i];
      return null;
    },
    setChecked(id, on) {
      const group = new Set([id, ...partnersOf(id)]); // the item + its cross-tab twins
      group.forEach((x) => { if (on) checked.add(x); else checked.delete(x); });
      if (on) {
        // completing this quest forfeits its mutually-exclusive partner(s) + their twins
        group.forEach((x) => mutexOf(x).forEach((p) => {
          checked.delete(p);
          (links[p] || []).forEach((pt) => checked.delete(pt));
        }));
      }
      write(KEYS.checked, [...checked]);
    },
    toggleChecked(id) {
      if (!this.isChecked(id) && this.isMutexLocked(id)) return this.isChecked(id); // can't pick a forfeited quest
      const on = !this.isChecked(id);
      this.setChecked(id, on);
      return on;
    },
    checkedCount: () => checked.size,

    // ---- reached areas (progressive reveal) ----
    isReached: (areaId) => reached.has(areaId),
    markReached(areaId) {
      reached.add(areaId);
      write(KEYS.reached, [...reached]);
    },
    reachedCount: () => reached.size,

    // ---- preferences ----
    getPref: (k) => prefs[k],
    setPref(k, v) {
      prefs[k] = v;
      write(KEYS.prefs, prefs);
    },

    // ---- backup / restore ----
    exportState() {
      return {
        checked: [...checked],
        reached: [...reached],
        prefs,
        exportedAt: new Date().toISOString()
      };
    },
    importState(obj) {
      if (!obj || typeof obj !== "object") return false;
      checked = new Set(Array.isArray(obj.checked) ? obj.checked : []);
      reached = new Set(Array.isArray(obj.reached) ? obj.reached : []);
      prefs = Object.assign({}, DEFAULT_PREFS, obj.prefs || {});
      write(KEYS.checked, [...checked]);
      write(KEYS.reached, [...reached]);
      write(KEYS.prefs, prefs);
      return true;
    },
    resetAll() {
      checked = new Set();
      reached = new Set();
      prefs = Object.assign({}, DEFAULT_PREFS);
      write(KEYS.checked, []);
      write(KEYS.reached, []);
      write(KEYS.prefs, prefs);
    }
  };

  window.Store = Store;
})();
