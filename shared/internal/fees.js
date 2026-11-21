/* INTERNAL fee logic (extensions, overdue). Uses provisional rules from rules.js. Not for the public site. */
(function (root) {
  'use strict';
  var node = typeof module === 'object' && module.exports;
  var dates = node ? require('../js/dates.js') : root.CamNGo.dates;
  var pricing = node ? require('../js/pricing.js') : root.CamNGo.pricing;
  var RULES = node ? require('./rules.js') : root.CamNGo.rules;

  /** Fee for approving `days` extra days. Over the limit -> not allowed (admin must review). */
  function extensionFee(days) {
    if (!Number.isInteger(days) || days < 1) return { allowed: false, fee: null, reason: 'invalid_days' };
    if (days > RULES.maxExtensionDays) return { allowed: false, fee: null, reason: 'exceeds_max_extension_days_admin_review' };
    return { allowed: true, fee: days * RULES.extensionFeePerDay, reason: null };
  }
  /** Approved return deadline = original return date + approved extension days (Dates in/out). */
  function approvedDeadline(returnDate, approvedExtensionDays) { return dates.addDays(returnDate, approvedExtensionDays || 0); }
  /** Overdue calendar days: days after the deadline day up to `asOf` (the actual return date, or today if still out).
      Returning on the deadline day = 0. OPEN DECISION: time-of-day deadlines are not modelled yet. */
  function overdueDays(deadline, asOf) { return Math.max(0, dates.dayDiff(deadline, asOf)); }
  function overdueFee(days) { return (Number.isInteger(days) && days >= 0) ? days * RULES.overdueFeePerDay : null; }
  /** Everything owed on one rental transaction (extensions stay part of the original transaction). */
  function totalOwed(o) {
    var rental = pricing.rentalCost(o.rentalDays);
    if (rental === null) return null;
    var ext = o.extensionDays ? extensionFee(o.extensionDays) : { allowed: true, fee: 0 };
    if (!ext.allowed) return null;
    return { rental: rental, extension: ext.fee, overdue: overdueFee(o.overdueDays || 0), deposit: 0,
             total: rental + ext.fee + overdueFee(o.overdueDays || 0) };
  }

  var api = { extensionFee: extensionFee, approvedDeadline: approvedDeadline, overdueDays: overdueDays, overdueFee: overdueFee, totalOwed: totalOwed };
  if (node) module.exports = api; else { root.CamNGo = root.CamNGo || {}; root.CamNGo.fees = api; }
})(typeof self !== 'undefined' ? self : globalThis);
