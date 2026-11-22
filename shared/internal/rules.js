/* INTERNAL provisional business rules. NOT loaded by the customer website (a test enforces this).
   Every value here is a WORKING ASSUMPTION pending the business owner's review (docs/BUSINESS-RULES.md).
   Change a value here and the tests/docs show what depends on it. Amounts are whole pesos. */
(function (root) {
  'use strict';
  var RULES = Object.freeze({
    status: 'PROVISIONAL - pending owner review',
    depositRequired: false,      // no initial security deposit
    extensionFeePerDay: 500,
    maxExtensionDays: 2,         // normal extension process; beyond this the admin reviews
    overdueFeePerDay: 1000
  });
  if (typeof module === 'object' && module.exports) module.exports = RULES;
  else { root.CamNGo = root.CamNGo || {}; root.CamNGo.rules = RULES; }
})(typeof self !== 'undefined' ? self : globalThis);
