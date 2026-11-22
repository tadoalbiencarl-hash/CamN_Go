const test = require('node:test'), assert = require('node:assert/strict');
const L = require('../shared/internal/lifecycles.js');
const ok = (...a) => L.canTransition(...a).ok;

test('every transition target is a defined status', () => {
  for (const [entity, t] of Object.entries(L.TRANSITIONS)) for (const [from, tos] of Object.entries(t)) for (const to of tos) assert.ok(t[to], `${entity}: ${from} -> ${to} is undefined`);
});
test('application: normal path and blocked jumps', () => {
  assert.ok(ok('application', 'submitted', 'under_review'));
  assert.ok(ok('application', 'under_review', 'approved'));
  assert.equal(ok('application', 'submitted', 'approved'), false);
  assert.equal(ok('application', 'rejected', 'approved'), false);
});
test('reservation: pending cannot jump to converted_to_rental', () => {
  assert.equal(ok('reservation', 'pending', 'converted_to_rental'), false);
  assert.ok(ok('reservation', 'confirmed', 'converted_to_rental'));
  assert.ok(ok('reservation', 'confirmed', 'no_show'));
});
test('rental activation needs BOTH payment confirmed and handover', () => {
  assert.equal(L.canActivateRental({ paymentConfirmed: true }), false);
  assert.equal(L.canActivateRental({ handoverConfirmed: true }), false);
  assert.equal(L.canActivateRental({}), false);
  assert.equal(L.canActivateRental({ paymentConfirmed: true, handoverConfirmed: true }), true);
});
test('unit: reserved -> rented is blocked until payment + handover', () => {
  assert.deepEqual(L.canTransition('unit', 'reserved', 'rented', { paymentConfirmed: true }), { ok: false, reason: 'condition_not_met' });
  assert.ok(ok('unit', 'reserved', 'rented', { paymentConfirmed: true, handoverConfirmed: true }));
});
test('unit: a returned camera is NOT available until inspection is complete', () => {
  assert.equal(ok('unit', 'rented', 'available'), false);
  assert.ok(ok('unit', 'rented', 'returned_inspection_pending'));
  assert.equal(ok('unit', 'returned_inspection_pending', 'available'), false);
  assert.equal(ok('unit', 'returned_inspection_pending', 'available', { inspectionComplete: false }), false);
  assert.ok(ok('unit', 'returned_inspection_pending', 'available', { inspectionComplete: true }));
  assert.ok(ok('unit', 'returned_inspection_pending', 'damaged'));
});
test('unit: retired is final', () => { for (const to of Object.keys(L.TRANSITIONS.unit)) assert.equal(ok('unit', 'retired', to), false); });
test('rental: cannot close until inspected and balance settled', () => {
  assert.equal(ok('rental', 'returned', 'closed', { inspectionComplete: true }), false);
  assert.equal(ok('rental', 'returned', 'closed', { balanceSettled: true }), false);
  assert.ok(ok('rental', 'returned', 'closed', { inspectionComplete: true, balanceSettled: true }));
  assert.equal(ok('rental', 'active', 'closed', { inspectionComplete: true, balanceSettled: true }), false);
});
test('rental: disputed needs a noted resolution to close', () => {
  assert.equal(ok('rental', 'disputed', 'closed'), false);
  assert.ok(ok('rental', 'disputed', 'closed', { resolutionNoted: true }));
});
test('unknown entity/status handled', () => { assert.equal(L.canTransition('nope', 'a', 'b').reason, 'unknown_status'); assert.equal(L.canTransition('unit', 'zzz', 'available').reason, 'unknown_status'); });
test('payment status keeps owed and received separate', () => {
  assert.equal(L.paymentStatus(1050, 0), 'unpaid');
  assert.equal(L.paymentStatus(1050, 500), 'partially_paid');
  assert.equal(L.paymentStatus(1050, 1050), 'paid');
  assert.equal(L.paymentStatus(1050, 1100), 'overpaid');
});
test('archive candidates: only closed, settled, undisputed rentals', () => {
  assert.equal(L.isArchiveCandidate({ status: 'closed', balanceSettled: true }), true);
  for (const r of [{ status: 'active', balanceSettled: true }, { status: 'closed', balanceSettled: false }, { status: 'closed', balanceSettled: true, disputed: true }, { status: 'returned', balanceSettled: true }]) assert.equal(L.isArchiveCandidate(r), false);
});
