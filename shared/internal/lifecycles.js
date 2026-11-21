/* INTERNAL lifecycle rules: which status changes are allowed, and what must be true first.
   Mirrors docs/LIFECYCLES.md. Status NAMES are provisional. Not for the public site. */
(function (root) {
  'use strict';
  var TRANSITIONS = {
    application: { submitted: ['under_review'], under_review: ['approved', 'rejected', 'needs_info'], needs_info: ['under_review', 'rejected'], approved: [], rejected: [] },
    reservation: { pending: ['confirmed', 'cancelled'], confirmed: ['converted_to_rental', 'cancelled', 'no_show'], converted_to_rental: [], cancelled: [], no_show: [] },
    rental: { active: ['returned', 'disputed'], returned: ['closed', 'disputed'], disputed: ['closed'], closed: [] },
    unit: {
      available: ['reserved', 'under_maintenance', 'damaged', 'retired'],
      reserved: ['available', 'rented'],
      rented: ['returned_inspection_pending'],
      returned_inspection_pending: ['available', 'under_maintenance', 'damaged'],
      under_maintenance: ['available', 'damaged', 'retired'],
      damaged: ['under_maintenance', 'retired'],
      retired: []
    }
  };
  // Extra conditions ("guards") for specific changes. ctx is a plain object of booleans.
  var GUARDS = {
    'unit:reserved>rented': function (c) { return canActivateRental(c); },
    'unit:returned_inspection_pending>available': function (c) { return c.inspectionComplete === true; },
    'rental:returned>closed': function (c) { return c.inspectionComplete === true && c.balanceSettled === true; },
    'rental:disputed>closed': function (c) { return c.resolutionNoted === true; }
  };
  /** A rental may become active ONLY when cash payment is confirmed AND the camera is physically handed over. */
  function canActivateRental(c) { c = c || {}; return c.paymentConfirmed === true && c.handoverConfirmed === true; }

  function canTransition(entity, from, to, ctx) {
    var t = TRANSITIONS[entity];
    if (!t || !t[from]) return { ok: false, reason: 'unknown_status' };
    if (t[from].indexOf(to) < 0) return { ok: false, reason: 'transition_not_allowed' };
    var g = GUARDS[entity + ':' + from + '>' + to];
    if (g && !g(ctx || {})) return { ok: false, reason: 'condition_not_met' };
    return { ok: true, reason: null };
  }
  /** Compare money owed vs money actually received (kept separate). Whole pesos. */
  function paymentStatus(owed, received) {
    if (received <= 0) return owed > 0 ? 'unpaid' : 'paid';
    if (received < owed) return 'partially_paid';
    return received === owed ? 'paid' : 'overpaid';
  }
  /** Only completed, fully settled, undisputed rentals may even be LISTED as archive candidates. Never auto-deleted. */
  function isArchiveCandidate(r) { return r.status === 'closed' && r.balanceSettled === true && r.disputed !== true; }

  var api = { TRANSITIONS: TRANSITIONS, canTransition: canTransition, canActivateRental: canActivateRental, paymentStatus: paymentStatus, isArchiveCandidate: isArchiveCandidate };
  if (typeof module === 'object' && module.exports) module.exports = api; else { root.CamNGo = root.CamNGo || {}; root.CamNGo.lifecycles = api; }
})(typeof self !== 'undefined' ? self : globalThis);
