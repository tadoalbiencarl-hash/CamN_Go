const test = require('node:test'), assert = require('node:assert/strict');
const D = require('../shared/js/dates.js'), P = require('../shared/js/pricing.js');

test('1-3 days cost 350 per day', () => { assert.equal(P.rentalCost(1), 350); assert.equal(P.rentalCost(2), 700); assert.equal(P.rentalCost(3), 1050); });
test('4+ days cost 300 per day (boundary 3 -> 4)', () => { assert.equal(P.rentalCost(4), 1200); assert.equal(P.rentalCost(5), 1500); assert.equal(P.rentalCost(10), 3000); });
test('invalid day counts return null', () => { for (const n of [0, -1, 1.5, NaN, null, undefined, '3']) assert.equal(P.rentalCost(n), null, String(n)); });
test('Monday-Wednesday costs 1050 and same-day costs 350', () => {
  assert.equal(P.costForRange(D.parseISO('2026-12-14'), D.parseISO('2026-12-16')), 1050);
  assert.equal(P.costForRange(D.parseISO('2026-12-14'), D.parseISO('2026-12-14')), 350);
});
test('reversed range is not priced', () => assert.equal(P.costForRange(D.parseISO('2026-12-16'), D.parseISO('2026-12-14')), null));
test('public pricing module exposes no extension/overdue fees', () => {
  assert.deepEqual(Object.keys(P.RATES).sort(), ['longFromDays', 'longRate', 'shortRate']);
  assert.equal(Object.keys(P).some((k) => /extension|overdue/i.test(k)), false);
});
