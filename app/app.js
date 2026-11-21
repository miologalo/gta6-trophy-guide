/* GTA VI Trophy Guide & Tracker — checklist, filters, spoiler mode, export/import.
   Data: data/trophies.json (55 official PS5 trophies). Progress: localStorage only. */
(function () {
  'use strict';

  var STORAGE_KEY = 'gta6-trophy-tracker-v1';
  var DATA_URL = 'data/trophies.json';

  var trophies = [];
  var earned = loadEarned();
  var kindFilter = 'all';
  var gradeFilter = 'all';
  var hideEarned = false;
  var spoilerSafe = true;
  var unearnedOnly = false;

  var listEl = document.getElementById('trophyList');
  var searchEl = document.getElementById('searchBox');
  var resultCountEl = document.getElementById('resultCount');

  function loadEarned() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) { return {}; }
  }

  function saveEarned() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(earned));
      var s = document.getElementById('saveState');
      if (s) s.textContent = 'Saved just now in this browser (localStorage).';
    } catch (e) { /* storage full or unavailable: progress stays in memory */ }
  }

  function gradeClass(grade) { return grade.toLowerCase(); }

  function isHiddenFromSpoilers(t) {
    return spoilerSafe && t.hidden && !earned[t.name];
  }

  function matchesFilters(t) {
    if (kindFilter === 'missable') { if (!t.missable) return false; }
    else if (kindFilter !== 'all') { if (t.kind !== kindFilter) return false; }
    if (gradeFilter !== 'all' && t.grade !== gradeFilter) return false;
    if (hideEarned && earned[t.name]) return false;
    if (unearnedOnly && earned[t.name]) return false;
    var q = searchEl.value.trim().toLowerCase();
    if (q) {
      var hay = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function sourceLinks(t) {
    return t.sources.map(function (s) {
      var url = sourceUrl(s);
      return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(s) + '</a>' : esc(s);
    }).join(' · ');
  }

  function sourceUrl(label) {
    if (label.indexOf('Output Lag') === 0) return 'https://outputlag.com/guides/gta-6-trophy-list/';
    if (label.indexOf('EGamers') === 0) return 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/';
    if (label.indexOf('Leonida') === 0) return 'https://leonidainteractive.com/wiki/guides/trophies-achievements/';
    if (label.indexOf('u7buy') === 0) return 'https://www.u7buy.com/blog/gta-6-trophies/';
    return '';
  }

  function renderProgress() {
    var total = trophies.length || 55;
    var done = trophies.filter(function (t) { return earned[t.name]; });
    var count = done.length;
    var pct = total ? Math.round(count / total * 100) : 0;
    var gs = done.reduce(function (sum, t) { return sum + (t.gamerscore || 0); }, 0);
    document.getElementById('progressBig').textContent = count + ' / ' + total;
    document.getElementById('progressDetail').textContent =
      pct + '% complete · ' + gs + ' Gamerscore of 1,000 · Platinum at 54/54 others';
    var bar = document.getElementById('progressBar');
    bar.style.width = pct + '%';
    document.getElementById('progressBarWrap').setAttribute('aria-valuenow', String(count));
    var grades = ['Platinum', 'Gold', 'Silver', 'Bronze'];
    document.getElementById('gradeCounts').innerHTML = grades.map(function (g) {
      var gTotal = trophies.filter(function (t) { return t.grade === g; }).length;
      var gDone = done.filter(function (t) { return t.grade === g; }).length;
      return '<span class="chip ' + gradeClass(g) + '">' + esc(g) + ' ' + gDone + '/' + gTotal + '</span>';
    }).join('');
  }

  function renderList() {
    var shown = trophies.filter(matchesFilters);
    resultCountEl.textContent = 'Showing ' + shown.length + ' of ' + trophies.length + ' trophies' +
      (spoilerSafe ? ' · spoiler-safe mode on: story trophies stay hidden until earned' : '');
    if (!shown.length) {
      listEl.innerHTML = '<p class="empty">No trophies match these filters. Clear the search or widen the filters.</p>';
      return;
    }
    listEl.innerHTML = shown.map(function (t) {
      var isEarned = !!earned[t.name];
      var hiddenNow = isHiddenFromSpoilers(t);
      var nameHtml = hiddenNow ? 'Hidden Trophy (story — earn it to reveal)' : esc(t.name);
      var descHtml = hiddenNow
        ? '<p class="desc hidden-note">Hidden on PlayStation until earned. Turn spoiler-safe mode off to reveal its name and description.</p>'
        : '<p class="desc">' + esc(t.description) + '</p>';
      var missableHtml = t.missable ? ' <span class="missable-flag">⚠ MISSABLE</span>' : '';
      var kindLabel = t.kind === 'platinum' ? '' : t.kind.charAt(0).toUpperCase() + t.kind.slice(1);
      var kindChip = kindLabel ? '<span class="chip">' + esc(kindLabel) + '</span>' : '';
      var guideHtml = hiddenNow ? '' :
        '<details class="guide-details"><summary>How to unlock — guide &amp; sources</summary>' +
        '<div class="guide"><p>' + esc(t.guide) + '</p>' +
        '<p class="src">Sources: ' + sourceLinks(t) + '</p></div></details>';
      return '<article class="trophy' + (isEarned ? ' earned' : '') + '">' +
        '<div class="trophy-head">' +
        '<input type="checkbox" data-name="' + esc(t.name) + '"' + (isEarned ? ' checked' : '') +
        ' aria-label="Mark ' + esc(hiddenNow ? 'hidden trophy' : t.name) + ' as earned">' +
        '<div class="trophy-title"><h3>' + nameHtml + missableHtml + '</h3>' + descHtml +
        '<div class="trophy-meta">' +
        '<span class="chip ' + gradeClass(t.grade) + '">' + esc(t.grade) + '</span>' +
        kindChip +
        '<span class="chip">' + (t.gamerscore || 0) + 'G</span>' +
        (t.hidden ? '<span class="chip">Hidden</span>' : '') +
        (t.count ? '<span class="chip">Target: ' + esc(String(t.count)) + '</span>' : '') +
        '</div>' + guideHtml + '</div></div></article>';
    }).join('');

    listEl.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
      box.addEventListener('change', function () {
        var name = box.getAttribute('data-name');
        if (box.checked) earned[name] = true; else delete earned[name];
        saveEarned();
        renderProgress();
        renderList();
      });
    });
  }

  function render() { renderProgress(); renderList(); }

  function bindFilterButtons(containerId, attr, setter) {
    var container = document.getElementById(containerId);
    container.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        container.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setter(btn.getAttribute(attr));
        renderList();
      });
    });
  }

  bindFilterButtons('kindFilters', 'data-kind', function (v) { kindFilter = v; });
  bindFilterButtons('gradeFilters', 'data-grade', function (v) { gradeFilter = v; });

  searchEl.addEventListener('input', renderList);
  document.getElementById('hideEarnedBox').addEventListener('change', function (e) {
    hideEarned = e.target.checked; renderList();
  });
  document.getElementById('spoilerBox').addEventListener('change', function (e) {
    spoilerSafe = e.target.checked; renderList();
  });
  document.getElementById('unearnedOnlyBox').addEventListener('change', function (e) {
    unearnedOnly = e.target.checked; renderList();
  });

  document.getElementById('exportBtn').addEventListener('click', function () {
    var payload = {
      app: 'gta6-trophy-guide-tracker',
      version: 1,
      exportedAt: new Date().toISOString(),
      earned: Object.keys(earned).sort()
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gta6-trophies-progress.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  document.getElementById('importBtn').addEventListener('click', function () {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        var names = Array.isArray(data) ? data : data.earned;
        if (!Array.isArray(names)) throw new Error('bad file');
        var known = {};
        trophies.forEach(function (t) { known[t.name] = true; });
        var next = {};
        names.forEach(function (n) { if (known[n]) next[n] = true; });
        earned = next;
        saveEarned();
        render();
        document.getElementById('saveState').textContent = 'Imported ' + Object.keys(next).length + ' earned trophies.';
      } catch (err) {
        document.getElementById('saveState').textContent = 'Import failed: not a valid progress file.';
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
    if (!confirm('Clear all earned trophies? This cannot be undone. Export first if you want a backup.')) return;
    earned = {};
    saveEarned();
    render();
  });

  fetch(DATA_URL)
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (data) {
      trophies = data.trophies || data;
      render();
    })
    .catch(function () {
      listEl.innerHTML = '<p class="empty">Could not load data/trophies.json. Open this app from its own folder (app/index.html) so the data file loads.</p>';
    });
})();
