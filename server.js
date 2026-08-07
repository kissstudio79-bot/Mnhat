/*
 * Bảng điểm Bóng rổ (slanted) — vMix / OBS — máy chủ đồng bộ real-time (không cần cài thêm gì)
 * ---------------------------------------------------------------------------
 * - Phục vụ trang tĩnh trong ./public
 * - /events  : luồng SSE real-time
 * - /cmd     : API điều khiển (GET query hoặc POST JSON)
 * - /state   : trạng thái hiện tại (JSON)
 *
 * Chạy:  node server.js        (hoặc  PORT=8000 node server.js)
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const VERSION = 'BUILD-12 (ep-mau-chip)';   // để kiểm tra đang chạy đúng bản mới

// --------------------------------------------------------------------------
// Trạng thái (thời gian tổng + điểm + lỗi; nhãn hạng mục + tên giải)
// --------------------------------------------------------------------------
function defaultState() {
  const now = Date.now();
  return {
    category: 'U16',                                   // ô nhỏ trên bên trái (đổi tên được)
    tournament: 'INVITATION CUP',                      // ô tên giải (đổi tên được)
    logo: '',                                          // logo giữa (bảng TV) — thay được
    teams: {
      // color = màu chip (theo màu áo đội), name = tên hiển thị trong ô đen
      home: { name: '', color: '#1f4fa3', score: 0, fouls: 0 },
      away: { name: '', color: '#8b2332', score: 0, fouls: 0 },
    },
    periodMinutes: 10,
    gameClock: { remaining: 10 * 60 * 1000, running: false, updatedAt: now },
    shotClock: { remaining: 12 * 1000, running: false, updatedAt: now, visible: true },  // 3x3 = 12 giây
    visible: true,
    version: 0,
  };
}

let state = defaultState();

// --------------------------------------------------------------------------
// SSE
// --------------------------------------------------------------------------
const clients = new Set();
function broadcast() {
  state.version++;
  const frame = `data: ${JSON.stringify({ type: 'state', state, serverNow: Date.now() })}\n\n`;
  for (const res of clients) { try { res.write(frame); } catch (_) {} }
}

// --------------------------------------------------------------------------
// Đồng hồ
// --------------------------------------------------------------------------
function freezeClock(c) {
  if (c.running) {
    c.remaining = Math.max(0, c.remaining - (Date.now() - c.updatedAt));
    c.running = false; c.updatedAt = Date.now();
  }
}
function startClock(c) { if (!c.running) { c.running = true; c.updatedAt = Date.now(); } }
function parseTime(v) {
  if (v === undefined || v === null || v === '') return null;
  v = String(v).trim();
  if (v.indexOf(':') >= 0) {
    const p = v.split(':');
    return Math.round(((parseFloat(p[0]) || 0) * 60 + (parseFloat(p[1]) || 0)) * 1000);
  }
  const n = parseFloat(v);
  return isNaN(n) ? null : Math.round(n * 1000);
}
function num(v, dflt) { const n = parseInt(v, 10); return isNaN(n) ? dflt : n; }

const BLOCKED = { __proto__: 1, constructor: 1, prototype: 1 };
function setByPath(obj, p, val) {
  const parts = String(p).split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (BLOCKED[parts[i]] || !(parts[i] in o)) return;
    o = o[parts[i]];
  }
  if (BLOCKED[parts[parts.length - 1]]) return;
  o[parts[parts.length - 1]] = val;
}
function coerce(v) {
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v !== '' && v !== null && /^-?\d+(\.\d+)?$/.test(String(v).trim())) return Number(v);
  return v;
}

// --------------------------------------------------------------------------
// Lệnh
// --------------------------------------------------------------------------
function handleCommand(q) {
  const action = q.action;
  const team = q.team && state.teams[q.team] ? state.teams[q.team] : null;

  switch (action) {
    case 'score':
      if (team) team.score = Math.max(0, team.score + num(q.points !== undefined ? q.points : q.delta, 1));
      break;
    case 'setScore':
      if (team) team.score = Math.max(0, num(q.value, 0));
      break;

    case 'foul':
      if (team) team.fouls = Math.max(0, team.fouls + num(q.delta !== undefined ? q.delta : q.points, 1));
      break;
    case 'setFoul':
      if (team) team.fouls = Math.max(0, num(q.value, 0));
      break;

    case 'clock': {
      const c = state.gameClock, sc = state.shotClock;   // 3x3: đồng hồ tấn công chạy/dừng theo đồng hồ trận
      switch (q.op) {
        case 'start': startClock(c); startClock(sc); break;
        case 'stop': freezeClock(c); freezeClock(sc); break;
        case 'toggle':
          if (c.running) { freezeClock(c); freezeClock(sc); }
          else { startClock(c); startClock(sc); }
          break;
        case 'adjust': freezeClock(c); c.remaining = Math.max(0, c.remaining + (parseTime(q.value) || 0)); c.updatedAt = Date.now(); break;
        case 'set': case 'reset': {
          freezeClock(c);
          const ms = q.value !== undefined ? parseTime(q.value) : state.periodMinutes * 60 * 1000;
          if (ms !== null) { c.remaining = ms; c.updatedAt = Date.now(); }
          break;
        }
      }
      break;
    }

    case 'shotclock': {
      const c = state.shotClock;
      switch (q.op) {
        case 'start': startClock(c); break;
        case 'stop': freezeClock(c); break;
        case 'toggle': c.running ? freezeClock(c) : startClock(c); break;
        case 'show': c.visible = true; break;
        case 'hide': c.visible = false; break;
        case 'togglevis': c.visible = !c.visible; break;
        case 'set': case 'reset':
          c.remaining = Math.max(0, Math.round((q.value !== undefined ? parseFloat(q.value) : 12) * 1000));  // 3x3 = 12 giây
          c.updatedAt = Date.now();
          c.running = state.gameClock.running;    // reset khi trận đang chạy -> đếm ngược tiếp ngay; đang dừng -> đứng ở 12
          break;
      }
      break;
    }

    case 'set':
      if (q.path) setByPath(state, q.path, coerce(q.value));
      break;

    case 'visible':
      state.visible = q.value === 'toggle' ? !state.visible : (q.value !== 'false' && q.value !== false);
      break;

    case 'swap': {
      const t = state.teams.home; state.teams.home = state.teams.away; state.teams.away = t;
      break;
    }

    case 'resetScores':
      state.teams.home.score = 0; state.teams.away.score = 0;
      state.teams.home.fouls = 0; state.teams.away.fouls = 0;
      break;

    case 'reset': {
      const keep = { home: { ...state.teams.home }, away: { ...state.teams.away } };
      const cat = state.category, tour = state.tournament, logo = state.logo;
      state = defaultState();
      state.category = cat; state.tournament = tour; state.logo = logo;
      for (const k of ['home', 'away']) {
        state.teams[k].name = keep[k].name;
        state.teams[k].color = keep[k].color;
      }
      break;
    }

    default: return false;
  }
  return true;
}

// --------------------------------------------------------------------------
// HTTP helpers
// --------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
function sendJSON(res, obj, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}
function serveStatic(res, urlPath) {
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safe);
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 Not Found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      // Không cache: OBS/trình duyệt luôn tải bản mới nhất sau khi cập nhật file
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    res.end(data);
  });
}
function handleSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*', 'X-Accel-Buffering': 'no',
  });
  res.write('retry: 2000\n\n');
  res.write(`data: ${JSON.stringify({ type: 'state', state, serverNow: Date.now() })}\n\n`);
  clients.add(res);
  const ping = setInterval(() => { try { res.write(': ping\n\n'); } catch (_) {} }, 15000);
  req.on('close', () => { clearInterval(ping); clients.delete(res); });
}

// --------------------------------------------------------------------------
// Server
// --------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const pathname = u.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }
  if (pathname === '/events') return handleSSE(req, res);
  if (pathname === '/version') return sendJSON(res, { version: VERSION });
  if (pathname === '/state') return sendJSON(res, { state, serverNow: Date.now() });

  if (pathname === '/cmd' || pathname === '/api') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
      req.on('end', () => {
        let q = {};
        try { q = JSON.parse(body); } catch (_) { q = Object.fromEntries(new URLSearchParams(body)); }
        for (const [k, v] of u.searchParams) if (!(k in q)) q[k] = v;
        handleCommand(q); broadcast();
        sendJSON(res, { ok: true, version: state.version });
      });
      return;
    }
    handleCommand(Object.fromEntries(u.searchParams));
    broadcast();
    return sendJSON(res, { ok: true, version: state.version });
  }

  // Tải ảnh (logo) lên: POST /upload?field=logo&ext=png  (body = dữ liệu ảnh thô)
  if (pathname === '/upload' && req.method === 'POST') {
    const field = u.searchParams.get('field') || 'logo';
    let ext = String(u.searchParams.get('ext') || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!{ png: 1, jpg: 1, jpeg: 1, gif: 1, webp: 1, svg: 1 }[ext]) ext = 'png';
    const chunks = []; let size = 0; let tooBig = false;
    req.on('data', (c) => { size += c.length; if (size > 8e6) { tooBig = true; req.destroy(); } else chunks.push(c); });
    req.on('end', () => {
      if (tooBig) return sendJSON(res, { ok: false, error: 'File quá lớn (>8MB)' }, 413);
      try {
        const dir = path.join(PUBLIC_DIR, 'uploads');
        fs.mkdirSync(dir, { recursive: true });
        const name = 'u-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + '.' + ext;
        fs.writeFileSync(path.join(dir, name), Buffer.concat(chunks));
        if (field === 'logo' || field === 'teams.home.logo' || field === 'teams.away.logo') {
          setByPath(state, field, '/uploads/' + name);
          broadcast();
        }
        sendJSON(res, { ok: true, path: '/uploads/' + name });
      } catch (e) {
        sendJSON(res, { ok: false, error: String(e) }, 500);
      }
    });
    return;
  }

  let file = pathname;
  if (file === '/') file = '/index.html';
  else if (file === '/control') file = '/control.html';
  else if (file === '/scoreboard' || file === '/board' || file === '/live') file = '/scoreboard.html';
  else if (file === '/tv') file = '/tv.html';
  serveStatic(res, file);
});

// --------------------------------------------------------------------------
// Khởi động
// --------------------------------------------------------------------------
function lanIPs() {
  const out = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const ni of ifaces[name]) if (ni.family === 'IPv4' && !ni.internal) out.push(ni.address);
  }
  return out;
}
server.listen(PORT, HOST, () => {
  console.log('\n  🏀  Bảng điểm Bóng rổ (vMix/OBS) đang chạy!');
  console.log('  Phiên bản: ' + VERSION + '\n');
  console.log('  ┌─ Mở các đường dẫn sau:');
  console.log(`  │  • Bảng điều khiển : http://localhost:${PORT}/control`);
  console.log(`  │  • Bảng điểm (OBS) : http://localhost:${PORT}/scoreboard`);
  console.log('  └─ OBS/vMix: thêm nguồn Browser → dán URL /scoreboard (1920 x 1080).\n');
  const lans = lanIPs();
  if (lans.length) {
    console.log('  Điều khiển từ điện thoại/tablet cùng mạng Wi-Fi:');
    for (const ip of lans) console.log(`     http://${ip}:${PORT}/control`);
    console.log('');
  }
});
