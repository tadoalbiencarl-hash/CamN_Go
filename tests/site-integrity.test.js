// Static checks of the customer site: paths, privacy of provisional rules, no storage/secrets.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname, '..');
const pages = ['index', 'cameras', 'availability', 'application', 'policies'].map((p) => p + '.html');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const publicFiles = [...pages, 'js/main.js', 'css/styles.css', 'shared/css/tokens.css', 'shared/js/dates.js', 'shared/js/pricing.js'];

test('every local href/src on every page exists', () => {
  const missing = [];
  for (const p of pages) for (const m of read(p).matchAll(/(?:href|src)="([^"#?]+)/g)) {
    if (/^(https?:|mailto:)/.test(m[1])) continue;
    // hero banner / logo / camera photos are intentionally supplied by the owner later
    if (/^assets\/images\/.+\.(jpg|png)$/.test(m[1])) continue;
    if (!fs.existsSync(path.join(root, m[1]))) missing.push(`${p}: ${m[1]}`);
  }
  assert.deepEqual(missing, []);
});
test('navigation targets in main.js exist', () => {
  for (const m of read('js/main.js').matchAll(/\['([a-z]+\.html)'/g)) assert.ok(fs.existsSync(path.join(root, m[1])), m[1]);
});
test('shared scripts load before main.js on every page', () => {
  for (const p of pages) { const h = read(p); const a = h.indexOf('shared/js/dates.js'), b = h.indexOf('shared/js/pricing.js'), c = h.indexOf('js/main.js'); assert.ok(a > 0 && a < b && b < c, p); assert.ok(h.indexOf('shared/css/tokens.css') < h.indexOf('css/styles.css'), p); }
});
test('customer site never loads shared/internal, admin, or docs', () => {
  for (const f of publicFiles) assert.doesNotMatch(read(f), /shared\/internal|\/admin\/|docs\//i, f);
});
test('provisional internal fees are not published on the customer site', () => {
  for (const f of publicFiles) {
    const s = read(f);
    assert.doesNotMatch(s, /extensionFee|overdueFee|maxExtension|depositRequired/, f);
    assert.doesNotMatch(s, /(?:₱|&#8369;|PHP\s?)\s?(?:500|1,?000)\b/, f);
    assert.doesNotMatch(s, /(?:deposit|extension fee|overdue fee)[^<.]{0,30}\d/i, f);
  }
});
test('customer site makes no network calls, uses no browser storage, holds no secrets', () => {
  for (const f of ['js/main.js', 'shared/js/dates.js', 'shared/js/pricing.js']) {
    const s = read(f);
    assert.doesNotMatch(s, /\bfetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|supabase/i, f);
    assert.doesNotMatch(s, /api[_-]?key|secret|password/i, f);
  }
});
test('tokens.css defines the palette and styles.css no longer redefines :root', () => {
  assert.match(read('shared/css/tokens.css'), /--bg:#f6f1e9[\s\S]*--brown:#8a5a3c/);
  assert.doesNotMatch(read('css/styles.css'), /:root\s*\{/);
});
