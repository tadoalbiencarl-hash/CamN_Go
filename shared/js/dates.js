/* Shared date helpers (PUBLIC-SAFE: loaded by the customer website).
   Works as a normal <script> (window.CamNGo.dates) and as a Node module (for tests).
   All functions use local calendar dates, never clock times. */
(function (root) {
  'use strict';
  function pad(n) { return String(n).padStart(2, '0'); }
  /** Date -> 'YYYY-MM-DD' */
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  /** 'YYYY-MM-DD' -> Date (local midnight), or null if invalid (e.g. 2026-02-30). */
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var d = new Date(+m[1], m[2] - 1, +m[3]);
    return (d.getFullYear() === +m[1] && d.getMonth() === m[2] - 1 && d.getDate() === +m[3]) ? d : null;
  }
  function today() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  /** Whole calendar days from a to b (negative if b is before a). DST-safe. */
  function dayDiff(a, b) {
    return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);
  }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  /** PROVISIONAL RULE: inclusive counting. Pickup day is Day 1; Mon->Wed = 3; same day = 1.
      Returns 0 when the return date is before the pickup date. */
  function rentalDays(pickup, ret) { var n = dayDiff(pickup, ret); return n < 0 ? 0 : n + 1; }
  /** Inclusive overlap of two date ranges (a shared boundary day counts as overlap). */
  function rangesOverlap(aStart, aEnd, bStart, bEnd) { return aStart <= bEnd && bStart <= aEnd; }

  var api = { toISO: toISO, parseISO: parseISO, today: today, dayDiff: dayDiff, addDays: addDays, rentalDays: rentalDays, rangesOverlap: rangesOverlap };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.CamNGo = root.CamNGo || {}; root.CamNGo.dates = api; }
})(typeof self !== 'undefined' ? self : globalThis);
