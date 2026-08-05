/* Bảng điểm 3x3 on-air: nhận trạng thái qua SSE và hiển thị. */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var el = function (n) { return document.querySelector('[data-el="' + n + '"]'); };

  var params = new URLSearchParams(location.search);
  if (params.get('pos') === 'center') document.body.className = 'pos-center';
  if (params.get('scale')) document.documentElement.style.setProperty('--scale', params.get('scale'));
  if (params.get('y')) document.documentElement.style.setProperty('--pos-y', parseInt(params.get('y'), 10) + 'px');

  var board = $('#board');
  var state = null;
  var clockOffset = 0;

  function connect() {
    var es = new EventSource('/events');
    es.onmessage = function (e) {
      var msg; try { msg = JSON.parse(e.data); } catch (_) { return; }
      if (msg.type === 'state') {
        if (typeof msg.serverNow === 'number') clockOffset = msg.serverNow - Date.now();
        state = msg.state; render();
      }
    };
    es.onerror = function () {};
  }

  function now() { return Date.now() + clockOffset; }
  function liveRemaining(c) { return c && c.running ? Math.max(0, c.remaining - (now() - c.updatedAt)) : (c ? c.remaining : 0); }
  function fmtClock(ms) {
    if (ms >= 60000) {
      var total = Math.ceil(ms / 1000), m = Math.floor(total / 60), s = total % 60;
      return m + ':' + (s < 10 ? '0' + s : s);
    }
    return (Math.max(0, ms) / 1000).toFixed(1);   // dưới 1 phút: giây.phần mười
  }
  function setText(node, txt) { if (node && node.textContent !== txt) node.textContent = txt; }
  function setBg(node, url) {
    var v = url ? 'url("' + String(url).replace(/"/g, '') + '")' : 'none';
    if (node && node.style.backgroundImage !== v) node.style.backgroundImage = v;
  }

  function renderTeam(side) {
    var t = state.teams[side];
    var root = document.documentElement.style;
    root.setProperty('--' + side, t.color);
    root.setProperty('--' + side + '-text', t.text);
    setText(el(side + '-name'), t.name);
    setText(el(side + '-score'), String(t.score));
    setText(el(side + '-fouls'), String(t.fouls));
    setBg(el(side + '-logo'), t.logo);
  }

  function render() {
    if (!state) return;
    board.classList.toggle('is-hidden', !state.visible);
    el('banner').classList.toggle('is-hidden', !state.showBanner);
    renderTeam('home');
    renderTeam('away');
    setText(el('tournament'), state.tournament || '');
    setBg(el('event-logo'), state.eventLogo);
    tick();
  }

  function tick() {
    if (!state) return;
    setText(el('clock'), fmtClock(liveRemaining(state.gameClock)));
  }
  setInterval(tick, 60);

  connect();
})();
