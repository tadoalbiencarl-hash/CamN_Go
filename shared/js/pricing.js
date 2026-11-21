/* Shared pricing (PUBLIC-SAFE: only the advertised rental rates live here).
   Extension and overdue fees are deliberately NOT here (they are internal and provisional). */
(function (root) {
  'use strict';
  var dates = (typeof module === 'object' && module.exports) ? require('./dates.js') : root.CamNGo.dates;
  // Canon SX740, advertised on the customer site. Working rates; may change after owner review.
  var RATES = Object.freeze({ shortRate: 350, longRate: 300, longFromDays: 4 });

  /** Daily rate that applies to a rental of `days` days. */
  function dailyRate(days) { return days >= RATES.longFromDays ? RATES.longRate : RATES.shortRate; }
  /** Total rental price in pesos, or null if `days` is not a whole number >= 1. */
  function rentalCost(days) { return (Number.isInteger(days) && days >= 1) ? days * dailyRate(days) : null; }
  /** Price for a pickup/return pair of Date objects (inclusive day counting). */
  function costForRange(pickup, ret) { return rentalCost(dates.rentalDays(pickup, ret)); }

  var api = { RATES: RATES, dailyRate: dailyRate, rentalCost: rentalCost, costForRange: costForRange };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.CamNGo = root.CamNGo || {}; root.CamNGo.pricing = api; }
})(typeof self !== 'undefined' ? self : globalThis);
