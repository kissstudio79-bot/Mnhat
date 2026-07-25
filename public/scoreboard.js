/* Bảng điểm on-air: nhận trạng thái qua SSE và hiển thị. */
(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var el = function (name) { return document.querySelector('[data-el="' + name + '"]'); };

  // ---- Tham số URL: vị trí / tỉ lệ ----
  var params = new URLSearchParams(location.search);
  if (params.get('pos') === 'top') document.body.className = 'pos-top';
  if (params.get('pos') === 'bottom') document.body.className = 'pos-bottom';
  if (params.get('scale')) document.documentElement.style.setProperty('--scale', params.get('scale'));
  if (params.get('y')) document.documentElement.style.setProperty('--pos-y', parseInt(params.get('y'), 10) + 'px');

  var board = $('#board');
  var state = null;
  var clockOffset = 0;               // đồng bộ giờ server ↔ client

  // ---- Kết nối SSE, tự kết nối lại ----
  function connect() {
    var es = new EventSource('/events');
    es.onmessage = function (e) {
      var msg;
      try { msg = JSON.parse(e.data); } catch (_) { return; }
      if (msg.type === 'state') {
        if (typeof msg.serverNow === 'number') clockOffset = msg.serverNow - Date.now();
        state = msg.state;
        render();
      }
    };
    es.onerror = function () { /* EventSource tự kết nối lại */ };
  }

  // ---- Tiện ích ----
  function now() { return Date.now() + clockOffset; }
  function liveRemaining(c) {
    if (!c) return 0;
    return c.running ? Math.max(0, c.remaining - (now() - c.updatedAt)) : c.remaining;
  }
  function fmtClock(ms) {
    if (ms >= 60000) {
      var total = Math.ceil(ms / 1000);
      var m = Math.floor(total / 60);
      var s = total % 60;
      return m + ':' + (s < 10 ? '0' + s : s);
    }
    // Dưới 1 phút: hiển thị giây.phần mười
    var t = Math.max(0, ms) / 1000;
    return t.toFixed(1);
  }
  function fmtShot(ms) {
    var s = Math.max(0, ms) / 1000;
    return s < 5 ? s.toFixed(1) : String(Math.ceil(s));
  }
  var ORD = { 1: 'st', 2: 'nd', 3: 'rd' };
  function periodLabel() {
    var p = state.period;
    if (p > state.totalPeriods) {
      var ot = p - state.totalPeriods;
      return 'OT' + (ot > 1 ? ot : '');
    }
    return p + '<sup>' + (ORD[p] || 'th') + '</sup>';
  }

  function setText(node, txt) { if (node && node.textContent !== txt) node.textContent = txt; }

  function renderFouls(container, count, total) {
    if (container.childElementCount !== total) {
      container.innerHTML = '';
      for (var i = 0; i < total; i++) container.appendChild(document.createElement('i'));
    }
    var segs = container.children;
    for (var j = 0; j < segs.length; j++) {
      segs[j].classList.toggle('on', j < count);
    }
  }

  function renderTeam(side) {
    var t = state.teams[side];
    document.documentElement.style.setProperty('--' + side + '-bg', t.color);
    document.documentElement.style.setProperty('--' + side + '-fg', t.text);
    setText(el(side + '-name'), t.name);
    setText(el(side + '-score'), String(t.score));
    setText(el(side + '-record'), 'W ' + (t.wins || 0) + ' - L ' + (t.losses || 0));
    renderFouls(el(side + '-fouls'), t.fouls, state.foulSegments || 5);

    var logoEl = el('logo');
    if (side === 'home') {                 // ô logo bên trái dùng logo đội nhà
      if (t.logo) logoEl.style.backgroundImage = 'url("' + t.logo.replace(/"/g, '') + '")';
      else logoEl.style.backgroundImage = 'none';
    }
  }

  // ---- Vẽ toàn bộ khi có trạng thái mới ----
  function render() {
    if (!state) return;
    board.classList.toggle('is-hidden', !state.visible);
    renderTeam('home');
    renderTeam('away');
    el('tournament').textContent = state.tournament || '';
    var periodEl = el('period');
    var lbl = periodLabel();
    if (periodEl.innerHTML !== lbl) periodEl.innerHTML = lbl;
    el('shot').classList.toggle('is-hidden', !state.shotVisible);
    tick();                                // cập nhật đồng hồ ngay
  }

  // ---- Vòng lặp đồng hồ (mượt) ----
  function tick() {
    if (!state) return;
    setText(el('clock'), fmtClock(liveRemaining(state.gameClock)));
    setText(el('shot'), fmtShot(liveRemaining(state.shotClock)));
  }
  setInterval(tick, 60);

  connect();
})();
