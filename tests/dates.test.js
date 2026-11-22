const test = require('node:test'), assert = require('node:assert/strict');
const D = require('../shared/js/dates.js');
const d = (s) => D.parseISO(s);

test('inclusive counting: Monday pickup, Wednesday return = 3 days', () => {
  assert.equal(D.rentalDays(d('2026-12-14'), d('2026-12-16')), 3); // Dec 14 2026 is a Monday
  assert.equal(d('2026-12-14').getDay(), 1);
});
test('same-day pickup and return = 1 day', () => assert.equal(D.rentalDays(d('2026-12-14'), d('2026-12-14')), 1));
test('return before pickup = 0 (invalid)', () => assert.equal(D.rentalDays(d('2026-12-14'), d('2026-12-13')), 0));
test('counts across month and year boundaries', () => assert.equal(D.rentalDays(d('2026-12-30'), d('2027-01-02')), 4));
test('counts across a leap day', () => assert.equal(D.rentalDays(d('2028-02-28'), d('2028-03-01')), 3));
test('parseISO rejects impossible or malformed dates', () => {
  for (const s of ['2026-02-30', '2026-13-01', '26-01-01', '', null, undefined, '2026-1-1']) assert.equal(D.parseISO(s), null, String(s));
});
test('toISO / parseISO round trip', () => assert.equal(D.toISO(d('2026-03-09')), '2026-03-09'));
test('addDays crosses month end', () => assert.equal(D.toISO(D.addDays(d('2026-12-31'), 2)), '2027-01-02'));
test('rangesOverlap is inclusive of boundary days', () => {
  assert.equal(D.rangesOverlap(d('2026-12-14'), d('2026-12-16'), d('2026-12-16'), d('2026-12-18')), true);
  assert.equal(D.rangesOverlap(d('2026-12-14'), d('2026-12-16'), d('2026-12-17'), d('2026-12-18')), false);
  assert.equal(D.rangesOverlap(d('2026-12-10'), d('2026-12-20'), d('2026-12-12'), d('2026-12-13')), true);
});
