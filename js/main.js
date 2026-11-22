/* Cam & Go Rentals - Stage 1 prototype. Demo data only; frontend checks are NOT security. */
(function () {
  'use strict';
  // ---- Demo data (replace with backend data in a later stage) ----
  var CAMERAS = [{
    id: 'canon-sx740', name: 'Canon SX740',
    desc: 'Compact travel camera with a 40x optical zoom and 4K video. Pocket-sized and easy for beginners.',
    image: 'assets/images/cameras/canon-sx740.jpg', available: true
  }];
  // Rates and date maths come from shared/js (loaded before this file).
  var D = window.CamNGo.dates, P = window.CamNGo.pricing;
  var RATE_SHORT = P.RATES.shortRate, RATE_LONG = P.RATES.longRate;
  var PAGES = [['index.html', 'Home'], ['cameras.html', 'Cameras'], ['availability.html', 'Availability'], ['application.html', 'Apply'], ['policies.html', 'Policies']];

  function $(s) { return document.querySelector(s); }
  function peso(n) { return '\u20B1' + n.toLocaleString('en-PH'); }
  var iso = D.toISO, parse = D.parseISO, today = D.today, rentalDays = D.rentalDays, rentalCost = P.rentalCost;
  // DEMONSTRATION ONLY: fake "unavailable" days (8th-10th and 20th-22nd of every month).
  function demoUnavailable(d) { var n = d.getDate(); return (n >= 8 && n <= 10) || (n >= 20 && n <= 22); }
  function rangeBlocked(a, b) { for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) if (demoUnavailable(d)) return true; return false; }

  function mountLayout() {
    var cur = document.body.dataset.page;
    var links = PAGES.map(function (p) { return '<li><a href="' + p[0] + '"' + (p[0] === cur ? ' aria-current="page"' : '') + '>' + p[1] + '</a></li>'; }).join('');
    $('#site-header').outerHTML = '<header class="site-header"><div class="wrap nav">' +
      // LOGO: place your logo at assets/images/logo/camngo-logo.png (hidden automatically if missing)
      '<a class="brand" href="index.html"><img src="assets/images/logo/camngo-logo.png" alt="" onerror="this.remove()"><span>Cam <em>&amp;</em> Go</span></a>' +
      '<button class="menu-btn" aria-expanded="false" aria-controls="menu">Menu</button><ul id="menu">' + links + '</ul></div></header>';
    $('#site-footer').outerHTML = '<footer class="site-footer"><div class="wrap"><div class="cols">' +
      '<div><h3>Cam &amp; Go Rentals</h3><p>Camera rentals made simple.</p></div>' +
      '<div><h3>Contact</h3><p>Phone: [your number]<br>Email: [your email]<br>Location: [your city]</p></div>' +
      '<div><h3>Follow</h3><p><a href="#" aria-disabled="true">Facebook</a> &middot; <a href="#" aria-disabled="true">Instagram</a><br>(placeholders)</p></div>' +
      '</div><small>&copy; ' + new Date().getFullYear() + ' Cam &amp; Go Rentals. Stage 1 prototype: no real reservations are made.</small></div></footer>';
    var btn = $('.menu-btn'), menu = $('#menu');
    btn.addEventListener('click', function () { var o = menu.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  }

  // Missing images keep their size/aspect ratio and show a labeled placeholder.
  function markMissing(img) { var m = img.closest('.media'); if (m) m.classList.add('missing'); }
  function initImages() {
    document.addEventListener('error', function (e) { if (e.target.tagName === 'IMG') markMissing(e.target); }, true);
    // A photo that loads successfully always clears the placeholder.
    document.addEventListener('load', function (e) { if (e.target.tagName === 'IMG') { var m = e.target.closest('.media'); if (m) m.classList.remove('missing'); } }, true);
    document.querySelectorAll('.media img').forEach(function (i) { if (i.complete && i.naturalWidth === 0) markMissing(i); });
  }

  function card(c) {
    return '<article class="card"><div class="media" data-label="' + c.name + '" data-file="' + c.image.split('/').pop() + '">' +
      '<img src="' + c.image + '" alt="' + c.name + ' camera"></div>' +
      '<div><span class="badge ok">' + (c.available ? 'Available (demo)' : 'Unavailable (demo)') + '</span></div>' +
      '<h3>' + c.name + '</h3><p>' + c.desc + '</p>' +
      '<div class="price">' + peso(RATE_SHORT) + ' <small>/ day, 1\u20133 days</small></div>' +
      '<ul class="tiers"><li>' + peso(RATE_SHORT) + '/day for 1\u20133 days</li><li>' + peso(RATE_LONG) + '/day for 4 days and above</li></ul>' +
      '<div class="row"><a class="btn" href="application.html?camera=' + c.id + '">Apply for Rental</a><a class="btn ghost" href="availability.html">Check dates</a></div></article>';
  }
  function initCards() { var t = $('[data-cameras]'); if (t) t.innerHTML = CAMERAS.map(card).join(''); }

  function initCalendar() {
    var grid = $('#cal-grid'); if (!grid) return;
    var view = new Date(today().getFullYear(), today().getMonth(), 1), pick = null, ret = null;
    var msg = $('#cal-msg'), go = $('#go-apply');
    function render() {
      var y = view.getFullYear(), m = view.getMonth(), n = new Date(y, m + 1, 0).getDate(), h = '';
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(function (d) { h += '<div class="dow">' + d + '</div>'; });
      for (var i = 0; i < view.getDay(); i++) h += '<div></div>';
      for (var d = 1; d <= n; d++) {
        var dt = new Date(y, m, d), past = dt < today(), un = demoUnavailable(dt), cls = 'day';
        if (un) cls += ' unavail';
        if (pick && ret && dt > pick && dt < ret) cls += ' inrange';
        if ((pick && +dt === +pick) || (ret && +dt === +ret)) cls += ' sel';
        h += '<button type="button" class="' + cls + '" data-d="' + iso(dt) + '"' + (past || un ? ' disabled' : '') +
          ' aria-label="' + dt.toDateString() + (un ? ', unavailable (demo)' : '') + '">' + d + '</button>';
      }
      $('#cal-title').textContent = view.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
      grid.innerHTML = h;
      $('#s-pick').textContent = pick ? pick.toDateString() : '\u2014';
      $('#s-ret').textContent = ret ? ret.toDateString() : '\u2014';
      if (pick && ret) {
        var days = rentalDays(pick, ret);
        $('#s-days').textContent = days; $('#s-cost').textContent = peso(rentalCost(days));
        go.href = 'application.html?pickup=' + iso(pick) + '&return=' + iso(ret); go.removeAttribute('aria-disabled');
      } else { $('#s-days').textContent = '\u2014'; $('#s-cost').textContent = '\u2014'; go.setAttribute('aria-disabled', 'true'); go.href = 'application.html'; }
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.day'); if (!b) return; var d = parse(b.dataset.d);
      if (!pick || ret) { pick = d; ret = null; msg.textContent = 'Now choose your expected return date (same day = 1 rental day).'; }
      else if (d < pick) { pick = d; msg.textContent = 'Return cannot be before pickup. Pickup updated.'; }
      else if (rangeBlocked(pick, d)) { msg.textContent = 'That range includes unavailable (demo) dates. Choose a different return date.'; }
      else { ret = d; msg.textContent = 'Dates selected. These are demonstration dates only; nothing is reserved.'; }
      render();
    });
    $('#prev').addEventListener('click', function () { var p = new Date(view.getFullYear(), view.getMonth() - 1, 1); if (p >= new Date(today().getFullYear(), today().getMonth(), 1)) { view = p; render(); } });
    $('#next').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
    render();
  }

  // Demo submission: nothing is uploaded, sent, or stored; the ID file is never read.
  function initForm() {
    var f = $('#apply-form'); if (!f) return;
    var q = new URLSearchParams(location.search), sel = $('#camera');
    CAMERAS.forEach(function (c) { sel.add(new Option(c.name, c.id)); });
    if (q.get('camera')) sel.value = q.get('camera');
    if (q.get('pickup')) f.elements.pickup.value = q.get('pickup');
    if (q.get('return')) f.elements['return'].value = q.get('return');
    var ret = f.elements['return'];
    f.elements.pickup.min = ret.min = iso(today());
    var touched = false;
    function validate(show) {
      var ok = true, p = f.elements.pickup.value, r = ret.value, file = f.elements.idimage.files[0], pd = p && parse(p), rd = r && parse(r);
      f.elements.pickup.setCustomValidity(pd && pd < today() ? 'Pickup date cannot be in the past.' : '');
      ret.setCustomValidity(pd && rd && rd < pd ? 'Return date cannot be before the pickup date.' : (pd && rd && rangeBlocked(pd, rd) ? 'Range includes unavailable (demo) dates.' : ''));
      f.elements.idimage.setCustomValidity(file ? (['image/jpeg', 'image/png'].indexOf(file.type) < 0 ? 'Please choose a JPG or PNG image.' : file.size > 5 * 1048576 ? 'File must be 5 MB or smaller.' : '') : '');
      f.elements.phone.setCustomValidity(f.elements.phone.value && !/^(\+63|0)9\d{9}$/.test(f.elements.phone.value.replace(/[\s-]/g, '')) ? 'Enter a valid PH mobile number, e.g. 09XX XXX XXXX.' : '');
      f.querySelectorAll('input,select,textarea').forEach(function (el) {
        var e = document.getElementById(el.id + '-err'); if (!e) return;
        if (!el.validity.valid) ok = false;
        e.textContent = show ? el.validationMessage : ''; el.setAttribute('aria-invalid', show && !el.validity.valid);
      });
      var days = pd && rd && rd >= pd ? rentalDays(pd, rd) : 0;
      $('#estimate').textContent = days ? days + ' day(s): estimated ' + peso(rentalCost(days)) + ' (not a confirmed price)' : '';
      return ok;
    }
    f.addEventListener('input', function () { validate(touched); }); f.addEventListener('change', function () { validate(touched); });
    f.addEventListener('submit', function (e) {
      e.preventDefault(); touched = true;
      if (!validate(true)) { var bad = f.querySelector('[aria-invalid=true]'); if (bad) bad.focus(); return; }
      f.hidden = true; $('#demo-success').hidden = false; $('#demo-success').focus(); window.scrollTo(0, 0);
    });
    $('#new-app').addEventListener('click', function () { f.reset(); touched = false; f.hidden = false; $('#demo-success').hidden = true; validate(false); });
    validate(false);
  }

  document.addEventListener('DOMContentLoaded', function () { mountLayout(); initCards(); initCalendar(); initForm(); initImages(); });
})();
