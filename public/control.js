/* Bảng điều khiển: gửi lệnh tới server, đồng bộ trạng thái qua SSE. */
(function () {
  'use strict';

  var el = function (n) { return document.querySelector('[data-el="' + n + '"]'); };
  var state = null;
  var clockOffset = 0;

  function send(query) { fetch('/cmd?' + query, { method: 'GET' }).catch(function () {}); }
  function setField(path, value) {
    send('action=set&path=' + encodeURIComponent(path) + '&value=' + encodeURIComponent(value));
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cmd]');
    if (!b) return;
    if (b.dataset.confirm && !window.confirm(b.dataset.confirm)) return;
    send(b.dataset.cmd);
  });

  var setClockBtn = document.querySelector('[data-set-clock]');
  if (setClockBtn) setClockBtn.addEventListener('click', function () {
    var v = (el('clock-input').value || '').trim();
    if (v) send('action=clock&op=set&value=' + encodeURIComponent(v));
  });

  // Ô cài đặt (data-field). Với ô màu: gửi cả khi kéo (input) lẫn khi chọn xong (change).
  var fields = Array.prototype.slice.call(document.querySelectorAll('[data-field]'));
  fields.forEach(function (inp) {
    var isColor = inp.type === 'color';
    var t = null;
    var fire = function () {
      clearTimeout(t);
      t = setTimeout(function () { setField(inp.dataset.field, inp.value); }, isColor ? 100 : 0);
    };
    inp.addEventListener('change', fire);
    if (isColor) inp.addEventListener('input', fire);
  });

  var KEYS = {
    q: 'action=score&team=home&points=1',
    w: 'action=score&team=home&points=2',
    e: 'action=score&team=home&points=3',
    a: 'action=score&team=home&points=-1',
    z: 'action=foul&team=home&delta=1',
    u: 'action=score&team=away&points=1',
    i: 'action=score&team=away&points=2',
    o: 'action=score&team=away&points=3',
    k: 'action=score&team=away&points=-1',
    m: 'action=foul&team=away&delta=1',
    ' ': 'action=clock&op=toggle',
    r: 'action=clock&op=reset',
    s: 'action=shotclock&op=reset&value=24',
    d: 'action=shotclock&op=reset&value=14',
    f: 'action=shotclock&op=toggle',
    v: 'action=shotclock&op=togglevis',
    h: 'action=visible&value=toggle',
  };
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key === ' ' ? ' ' : (e.key.length === 1 ? e.key.toLowerCase() : e.key);
    if (KEYS[k]) { e.preventDefault(); send(KEYS[k]); }
  });

  function now() { return Date.now() + clockOffset; }
  function liveRemaining(c) { return c && c.running ? Math.max(0, c.remaining - (now() - c.updatedAt)) : (c ? c.remaining : 0); }
  function fmtClock(ms) {
    if (ms >= 60000) {
      var total = Math.ceil(ms / 1000), m = Math.floor(total / 60), s = total % 60;
      return m + ':' + (s < 10 ? '0' + s : s);
    }
    return (Math.max(0, ms) / 1000).toFixed(1);
  }
  function fmtShot(ms) { var s = Math.max(0, ms) / 1000; return s < 5 ? s.toFixed(1) : String(Math.ceil(s)); }

  function fillInputs() {
    fields.forEach(function (inp) {
      if (document.activeElement === inp) return;
      var val = inp.dataset.field.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, state);
      if (val === undefined || val === null) return;
      var s = String(val);
      if (inp.value !== s) inp.value = s;
    });
  }

  function render() {
    if (!state) return;
    el('home-score').textContent = state.teams.home.score;
    el('away-score').textContent = state.teams.away.score;
    el('home-fouls').textContent = state.teams.home.fouls;
    el('away-fouls').textContent = state.teams.away.fouls;

    var ct = el('clock-toggle');
    ct.textContent = state.gameClock.running ? '⏸ Dừng' : '▶ Chạy';
    ct.classList.toggle('active', state.gameClock.running);

    var sc = state.shotClock || {};
    var st = el('shot-toggle');
    st.textContent = sc.running ? '⏸' : '▶';
    st.classList.toggle('active', !!sc.running);
    var sv = el('shot-vis');
    sv.textContent = sc.visible ? 'Ẩn 24s' : 'Hiện 24s';

    fillInputs();
    tick();
  }

  function tick() {
    if (!state) return;
    el('clock').textContent = fmtClock(liveRemaining(state.gameClock));
    if (state.shotClock) el('shot').textContent = fmtShot(liveRemaining(state.shotClock));
  }
  setInterval(tick, 80);

  function connect() {
    var es = new EventSource('/events');
    es.onopen = function () { el('conn').textContent = '• đã kết nối'; el('conn').className = 'conn on'; };
    es.onerror = function () { el('conn').textContent = '• mất kết nối, đang thử lại…'; el('conn').className = 'conn off'; };
    es.onmessage = function (e) {
      var msg; try { msg = JSON.parse(e.data); } catch (_) { return; }
      if (msg.type === 'state') {
        if (typeof msg.serverNow === 'number') clockOffset = msg.serverNow - Date.now();
        state = msg.state; render();
      }
    };
  }

  var cu = el('cmd-url');
  if (cu) cu.textContent = location.origin + '/cmd?action=score&team=home&points=2';
  var ut = el('url-tv'); if (ut) ut.textContent = location.origin + '/tv';
  var ul = el('url-live'); if (ul) ul.textContent = location.origin + '/scoreboard';

  connect();
})();
