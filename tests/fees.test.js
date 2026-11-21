const test = require('node:test'), assert = require('node:assert/strict');
const D = require('../shared/js/dates.js'), F = require('../shared/internal/fees.js'), R = require('../shared/internal/rules.js');
const d = (s) => D.parseISO(s);

test('provisional rules are flagged and match the working assumptions', () => {
  assert.match(R.status, /PROVISIONAL/);
  assert.deepEqual({ ...R, status: undefined }, { status: undefined, depositRequired: false, extensionFeePerDay: 500, maxExtensionDays: 2, overdueFeePerDay: 1000 });
});
test('extension: 1 and 2 days allowed at 500/day', () => { assert.deepEqual(F.extensionFee(1), { allowed: true, fee: 500, reason: null }); assert.equal(F.extensionFee(2).fee, 1000); });
test('extension: 3 days exceeds the limit and needs admin review', () => { const r = F.extensionFee(3); assert.equal(r.allowed, false); assert.equal(r.fee, null); assert.match(r.reason, /admin_review/); });
test('extension: invalid input rejected', () => { for (const n of [0, -1, 1.5, null]) assert.equal(F.extensionFee(n).allowed, false); });
test('approved deadline = return date + approved extension days', () => {
  assert.equal(D.toISO(F.approvedDeadline(d('2026-12-16'), 2)), '2026-12-18');
  assert.equal(D.toISO(F.approvedDeadline(d('2026-12-16'))), '2026-12-16');
});
test('overdue days: none on the deadline day, 1 the day after', () => {
  assert.equal(F.overdueDays(d('2026-12-18'), d('2026-12-18')), 0);
  assert.equal(F.overdueDays(d('2026-12-18'), d('2026-12-17')), 0);
  assert.equal(F.overdueDays(d('2026-12-18'), d('2026-12-19')), 1);
  assert.equal(F.overdueDays(d('2026-12-30'), d('2027-01-02')), 3);
});
test('overdue fee is 1000/day', () => { assert.equal(F.overdueFee(0), 0); assert.equal(F.overdueFee(3), 3000); assert.equal(F.overdueFee(-1), null); });
test('total owed keeps extension and overdue inside the original transaction', () => {
  assert.deepEqual(F.totalOwed({ rentalDays: 3 }), { rental: 1050, extension: 0, overdue: 0, deposit: 0, total: 1050 });
  assert.equal(F.totalOwed({ rentalDays: 3, extensionDays: 2, overdueDays: 1 }).total, 1050 + 1000 + 1000);
  assert.equal(F.totalOwed({ rentalDays: 3, extensionDays: 3 }), null);
});
