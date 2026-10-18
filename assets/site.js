// Theme toggle, BibTeX toggles, and the publication filter. No dependencies.

(function () {
  var root = document.documentElement;

  // Theme: remember an explicit choice; otherwise follow the OS.
  try {
    var saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('.theme-toggle');
    if (t) {
      var dark = root.getAttribute('data-theme') === 'dark' ||
        (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      return;
    }

    var bib = ev.target.closest('[data-bib]');
    if (bib) {
      var pub = bib.closest('.pub');
      var open = pub.classList.toggle('show-bib');
      bib.setAttribute('aria-expanded', open);
      if (open && navigator.clipboard) {
        // Copying on open is the common case; the button label confirms it.
        navigator.clipboard.writeText(pub.querySelector('pre.bib').textContent.trim()).then(function () {
          var label = bib.textContent;
          bib.textContent = 'Copied';
          setTimeout(function () { bib.textContent = label; }, 1200);
        }, function () {});
      }
    }
  });

  // Publication filter (publications page only).
  var search = document.getElementById('pub-search');
  if (!search) return;
  var chips = document.querySelectorAll('.chips button');
  var items = Array.prototype.slice.call(document.querySelectorAll('.pub'));
  var groups = document.querySelectorAll('.year-group');
  var count = document.getElementById('pub-count');
  var kind = 'all';

  function apply() {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (el) {
      var ok = (kind === 'all' || el.dataset.kind === kind) &&
        (!q || el.textContent.toLowerCase().indexOf(q) !== -1);
      el.hidden = !ok;
      if (ok) shown++;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.pub:not([hidden])'); });
    count.textContent = shown + (shown === 1 ? ' item' : ' items');
  }

  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
      kind = b.dataset.kind;
      apply();
    });
  });
  search.addEventListener('input', apply);

  // Deep links from old per-paper URLs land on #key; open that entry.
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.classList.add('flash');
  }
  apply();
})();
