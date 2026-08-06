/* Bảng điểm on-air (layout nghiêng): nhận trạng thái qua SSE và hiển thị. */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var el = function (n) { return document.querySelector('[data-el="' + n + '"]'); };

  var params = new URLSearchParams(location.search);
  if (params.get('scale')) document.documentElement.style.setProperty('--scale', params.get('scale'));
  if (params.get('x')) document.documentElement.style.setProperty('--x', parseInt(params.get('x'), 10) + 'px');
  if (params.get('y')) document.documentElement.style.setProperty('--y', parseInt(params.get('y'), 10) + 'px');

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
    return (Math.max(0, ms) / 1000).toFixed(1);
  }
  function setText(node, txt) { if (node && node.textContent !== txt) node.textContent = txt; }

  function render() {
    if (!state) return;
    board.classList.toggle('is-hidden', !state.visible);
    var root = document.documentElement.style;
    root.setProperty('--home', state.teams.home.color);
    root.setProperty('--away', state.teams.away.color);

    setText(el('category'), state.category || '');
    setText(el('tournament'), state.tournament || '');
    setText(el('home-name'), state.teams.home.name || '');
    setText(el('away-name'), state.teams.away.name || '');
    setText(el('home-score'), String(state.teams.home.score));
    setText(el('away-score'), String(state.teams.away.score));
    setText(el('home-fouls'), String(state.teams.home.fouls));
    setText(el('away-fouls'), String(state.teams.away.fouls));
    tick();
  }

  function tick() {
    if (!state) return;
    setText(el('clock'), fmtClock(liveRemaining(state.gameClock)));
  }
  setInterval(tick, 60);

  connect();
})();
