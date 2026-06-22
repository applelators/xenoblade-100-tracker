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

  const Store = {
    // ---- checked items ----
    isChecked: (id) => checked.has(id),
    toggleChecked(id) {
      if (checked.has(id)) checked.delete(id);
      else checked.add(id);
      write(KEYS.checked, [...checked]);
      return checked.has(id);
    },
    setChecked(id, on) {
      if (on) checked.add(id);
      else checked.delete(id);
      write(KEYS.checked, [...checked]);
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
