/* Bảng điểm TV (47HOOPS): nhận trạng thái qua SSE và hiển thị. */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var el = function (n) { return document.querySelector('[data-el="' + n + '"]'); };

  var state = null;
  var clockOffset = 0;

  // Co giãn canvas 1920x1080 vừa cửa sổ
  function fit() {
    var f = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty('--fit', f);
  }
  window.addEventListener('resize', fit);
  fit();

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
  function fmtShot(ms) { var s = Math.max(0, ms) / 1000; return s < 5 ? s.toFixed(1) : String(Math.ceil(s)); }
  function setText(node, txt) { if (node && node.textContent !== txt) node.textContent = txt; }
  function setBg(node, url) {
    var v = url ? 'url("' + String(url).replace(/"/g, '') + '")' : 'none';
    if (node && node.style.backgroundImage !== v) node.style.backgroundImage = v;
  }

  function render() {
    if (!state) return;
    setText(el('home-name'), state.teams.home.name || '');
    setText(el('away-name'), state.teams.away.name || '');
    setText(el('home-score'), String(state.teams.home.score));
    setText(el('away-score'), String(state.teams.away.score));
    setText(el('home-fouls'), String(state.teams.home.fouls));
    setText(el('away-fouls'), String(state.teams.away.fouls));
    setBg(el('logo'), state.logo);
    el('shotwrap').classList.toggle('is-hidden', !(state.shotClock && state.shotClock.visible));
    tick();
  }

  function tick() {
    if (!state) return;
    setText(el('clock'), fmtClock(liveRemaining(state.gameClock)));
    if (state.shotClock) setText(el('shot'), fmtShot(liveRemaining(state.shotClock)));
  }
  setInterval(tick, 60);

  connect();
})();
