#!/usr/bin/env node
/*
 * Veo 3 Tool — điều khiển Veo 3 / 3.1 tạo video qua Gemini API (không cần cài thư viện)
 * ---------------------------------------------------------------------------
 *   node veo3.js generate "prompt" [tuỳ chọn]   Tạo 1 video
 *   node veo3.js batch cac-canh.json|.txt       Tạo hàng loạt từ file
 *   node veo3.js ui [cổng]                      Mở giao diện web (mặc định :8080)
 *   node veo3.js models                         Liệt kê model
 *   node veo3.js help
 *
 * Cần API key: đặt biến GEMINI_API_KEY, hoặc file .env cạnh veo3.js (GEMINI_API_KEY=...).
 * Lấy key tại https://aistudio.google.com/apikey (tạo video Veo cần bật thanh toán).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const API = 'https://generativelanguage.googleapis.com/v1beta';
const OUT_DIR = path.resolve(process.env.VEO3_OUT || path.join(__dirname, 'output'));

const MODELS = {
  'veo3':          'veo-3.0-generate-001',
  'veo3-fast':     'veo-3.0-fast-generate-001',
  'veo3.1':        'veo-3.1-generate-preview',
  'veo3.1-fast':   'veo-3.1-fast-generate-preview',
};
const DEFAULTS = { model: 'veo3', ratio: '16:9', res: '720p', duration: 8 };

// ---------------------------------------------------------------- cấu hình
function loadEnv() {
  try {
    for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (_) {}
}
loadEnv();

function apiKey() {
  const k = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!k) throw new Error('Thiếu API key. Đặt GEMINI_API_KEY (hoặc tạo file .env với GEMINI_API_KEY=...).');
  return k;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'video';

async function api(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { 'x-goog-api-key': apiKey(), ...(opts.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!res.ok) {
    let msg = await res.text();
    try { msg = JSON.parse(msg).error.message; } catch (_) {}
    throw new Error(`API ${res.status}: ${msg}`);
  }
  return res;
}

// ---------------------------------------------------------------- lõi tạo video
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
function imagePart(file) {
  const mime = MIME[path.extname(file).toLowerCase()];
  if (!mime) throw new Error('Ảnh phải là png/jpg/webp: ' + file);
  return { bytesBase64Encoded: fs.readFileSync(file).toString('base64'), mimeType: mime };
}

function buildRequest(job) {
  const model = MODELS[job.model] || job.model;
  const instance = { prompt: job.prompt };
  if (job.image) instance.image = imagePart(job.image);              // ảnh → video
  if (job.lastFrame) instance.lastFrame = imagePart(job.lastFrame);  // khung hình cuối (Veo 3.1)
  const parameters = { aspectRatio: job.ratio, resolution: job.res, durationSeconds: Number(job.duration) };
  if (job.negative) parameters.negativePrompt = job.negative;
  if (job.seed !== undefined && job.seed !== '') parameters.seed = Number(job.seed);
  return { model, body: { instances: [instance], parameters } };
}

/** Chạy 1 job: gửi → chờ → tải về. `onStatus(text)` để báo tiến độ. Trả về đường dẫn file. */
async function runJob(job, onStatus = () => {}) {
  job = { ...DEFAULTS, ...job };
  if (!job.prompt || !String(job.prompt).trim()) throw new Error('Prompt trống');
  if (job.res === '1080p' && Number(job.duration) !== 8) throw new Error('1080p chỉ hỗ trợ video 8 giây');
  const { model, body } = buildRequest(job);

  onStatus('Đang gửi yêu cầu…');
  let op = await (await api(`${API}/models/${model}:predictLongRunning`, { method: 'POST', body: JSON.stringify(body) })).json();

  const t0 = Date.now();
  while (!op.done) {
    await sleep(10000);
    op = await (await api(`${API}/${op.name}`)).json();
    onStatus(`Đang tạo… ${Math.round((Date.now() - t0) / 1000)}s`);
    if (Date.now() - t0 > 20 * 60 * 1000) throw new Error('Quá 20 phút, huỷ chờ. Operation: ' + op.name);
  }
  if (op.error) throw new Error(op.error.message || JSON.stringify(op.error));

  const r = op.response || {};
  const video = ((r.generateVideoResponse || {}).generatedSamples || [])[0];
  if (!video || !video.video) {
    const why = (r.generateVideoResponse || {}).raiMediaFilteredReasons;
    throw new Error('Không có video trả về' + (why ? ' (bị bộ lọc an toàn chặn: ' + why.join('; ') + ')' : ''));
  }

  onStatus('Đang tải video về…');
  const file = await download(video.video.uri, job.name || job.prompt);
  onStatus('Xong');
  return file;
}

async function download(uri, label) {
  const res = await api(uri);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const file = path.join(OUT_DIR, `${stamp}-${slug(label)}.mp4`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

// ---------------------------------------------------------------- đọc file batch
/** .json: mảng {name,prompt,image,...} · .txt/.md: các cảnh cách nhau bằng dòng `---` */
function loadBatch(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const base = path.dirname(path.resolve(file));
  let jobs;
  if (file.toLowerCase().endsWith('.json')) {
    const j = JSON.parse(raw);
    jobs = Array.isArray(j) ? j : j.jobs;
  } else {
    jobs = raw.split(/^\s*---\s*$/m).map((s) => s.trim()).filter(Boolean)
      .map((prompt, i) => ({ name: 'canh-' + (i + 1), prompt }));
  }
  return jobs.map((j) => {
    for (const k of ['image', 'lastFrame']) if (j[k]) j[k] = path.resolve(base, j[k]);
    return j;
  });
}

// ---------------------------------------------------------------- CLI
function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      opts[k] = argv[i + 1] !== undefined && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    } else opts._.push(a);
  }
  return opts;
}
const jobFromOpts = (o) => ({
  prompt: o._.slice(1).join(' ') || o.prompt, model: o.model, ratio: o.ratio, res: o.res,
  duration: o.duration, negative: o.negative, image: o.image, lastFrame: o['last-frame'], seed: o.seed, name: o.name,
});
const clean = (j) => Object.fromEntries(Object.entries(j).filter(([, v]) => v !== undefined && v !== true));

const HELP = `Veo 3 Tool

  node veo3.js generate "Một con mèo chạy trên bãi biển" --ratio 9:16 --model veo3-fast
  node veo3.js generate --prompt "..." --image anh.png          (ảnh → video)
  node veo3.js batch cac-canh.json                              (hoặc .txt, cảnh cách nhau bằng ---)
  node veo3.js ui 8080                                          (giao diện web)

Tuỳ chọn:
  --model     veo3 | veo3-fast | veo3.1 | veo3.1-fast | <tên model đầy đủ>   (mặc định veo3)
  --ratio     16:9 | 9:16                                                   (mặc định 16:9)
  --res       720p | 1080p (1080p chỉ 8 giây)                               (mặc định 720p)
  --duration  4 | 6 | 8 giây                                                (mặc định 8)
  --negative  điều không muốn xuất hiện
  --image     ảnh đầu (png/jpg/webp)      --last-frame  ảnh cuối (Veo 3.1)
  --seed      số nguyên cho kết quả ổn định hơn
  --name      tên file đầu ra             --concurrency  số job chạy song song khi batch (mặc định 2)
Video lưu vào: ${OUT_DIR}  (đổi bằng VEO3_OUT)
`;

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const cmd = o._[0];
  if (cmd === 'generate') {
    const file = await runJob(clean(jobFromOpts(o)), (s) => process.stdout.write('\r\x1b[K' + s));
    console.log('\n✔ ' + file);
  } else if (cmd === 'batch') {
    if (!o._[1]) throw new Error('Thiếu file batch');
    const jobs = loadBatch(o._[1]).map((j) => ({ ...clean(jobFromOpts({ _: [], ...o, prompt: undefined })), ...j }));
    const conc = Math.max(1, parseInt(o.concurrency, 10) || 2);
    let next = 0, failed = 0;
    const worker = async () => {
      while (next < jobs.length) {
        const i = next++, tag = `[${i + 1}/${jobs.length}] ${jobs[i].name || ''}`;
        try { console.log(tag, '✔', await runJob(jobs[i], () => {})); }
        catch (e) { failed++; console.error(tag, '✘', e.message); }
      }
    };
    await Promise.all(Array.from({ length: conc }, worker));
    console.log(failed ? `Xong, ${failed}/${jobs.length} lỗi` : `Xong ${jobs.length} video`);
    if (failed) process.exitCode = 1;
  } else if (cmd === 'models') {
    for (const [k, v] of Object.entries(MODELS)) console.log(k.padEnd(14), v);
  } else if (cmd === 'ui') {
    startUI(parseInt(o._[1], 10) || parseInt(process.env.PORT, 10) || 8080);
  } else console.log(HELP);
}

// ---------------------------------------------------------------- giao diện web
const jobs = [];   // {id, status, file, error, ...job}

function startUI(port) {
  const readBody = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => ok(b)); });
  const send = (res, code, data, type = 'application/json') => { res.writeHead(code, { 'Content-Type': type }); res.end(typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data)); };

  http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    try {
      if (url.pathname === '/') return send(res, 200, UI_HTML, 'text/html; charset=utf-8');
      if (url.pathname === '/api/jobs' && req.method === 'GET') {
        return send(res, 200, jobs.map(({ imageData, ...j }) => j));
      }
      if (url.pathname === '/api/jobs' && req.method === 'POST') {
        const b = JSON.parse(await readBody(req));
        const list = Array.isArray(b.prompts) ? b.prompts : [b.prompt];
        const tmp = [];
        for (const p of list.filter((x) => x && x.trim())) {
          const job = { id: jobs.length + 1, prompt: p.trim(), model: b.model, ratio: b.ratio, res: b.res, duration: b.duration, negative: b.negative || undefined, status: 'Đang chờ…' };
          if (b.imageData) {                                   // data URL → file tạm
            const m = /^data:(image\/(png|jpeg|webp));base64,(.+)$/.exec(b.imageData);
            if (!m) throw new Error('Ảnh không hợp lệ');
            fs.mkdirSync(OUT_DIR, { recursive: true });
            job.image = path.join(OUT_DIR, `.in-${Date.now()}-${job.id}.${m[2] === 'jpeg' ? 'jpg' : m[2]}`);
            fs.writeFileSync(job.image, Buffer.from(m[3], 'base64'));
          }
          jobs.push(job); tmp.push(job);
          runJob(job, (s) => { job.status = s; })
            .then((f) => { job.file = path.basename(f); job.done = true; })
            .catch((e) => { job.error = e.message; job.status = 'Lỗi'; })
            .finally(() => { if (job.image) fs.rm(job.image, { force: true }, () => {}); });
        }
        return send(res, 200, { started: tmp.length });
      }
      if (url.pathname.startsWith('/files/')) {
        const f = path.join(OUT_DIR, path.basename(decodeURIComponent(url.pathname)));
        if (!fs.existsSync(f)) return send(res, 404, 'Not found', 'text/plain');
        res.writeHead(200, { 'Content-Type': 'video/mp4' });
        return fs.createReadStream(f).pipe(res);
      }
      send(res, 404, 'Not found', 'text/plain');
    } catch (e) { send(res, 400, { error: e.message }); }
  }).listen(port, '127.0.0.1', () => console.log(`Veo 3 Tool: http://localhost:${port}   (video lưu ở ${OUT_DIR})`));
}

const UI_HTML = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Veo 3 Tool</title>
<style>
:root{--bg:#0f1115;--card:#181b22;--line:#2a2f3a;--fg:#e8eaf0;--mut:#8b93a5;--acc:#6c8cff}
@media(prefers-color-scheme:light){:root{--bg:#f4f5f8;--card:#fff;--line:#d9dce4;--fg:#1a1d25;--mut:#667}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px system-ui,sans-serif}
main{max-width:980px;margin:0 auto;padding:20px 16px;display:grid;gap:16px}
h1{margin:0;font-size:22px}.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
label{display:block;font-size:12px;color:var(--mut);margin:0 0 4px}
textarea,select,input{width:100%;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:9px;font:inherit}
textarea{min-height:130px;resize:vertical}.row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:12px}
button{background:var(--acc);color:#fff;border:0;border-radius:8px;padding:11px 18px;font:inherit;font-weight:600;cursor:pointer;margin-top:14px}
button:disabled{opacity:.5}.hint{color:var(--mut);font-size:12px;margin-top:6px}
.job{display:grid;grid-template-columns:1fr;gap:8px;border-top:1px solid var(--line);padding:12px 0}.job:first-child{border:0}
.job video{max-width:100%;max-height:360px;border-radius:8px;background:#000}.err{color:#ff6b6b}.st{color:var(--mut);font-size:13px}
</style>
<main>
<h1>🎬 Veo 3 Tool</h1>
<form class="card" id="f">
  <label>Prompt (nhiều cảnh: cách nhau bằng một dòng <code>---</code>)</label>
  <textarea id="prompt" required placeholder="Mô tả cảnh, nhân vật, hành động, lời thoại, âm thanh…"></textarea>
  <div class="row">
    <div><label>Model</label><select id="model"><option value="veo3">Veo 3</option><option value="veo3-fast">Veo 3 Fast</option><option value="veo3.1">Veo 3.1</option><option value="veo3.1-fast">Veo 3.1 Fast</option></select></div>
    <div><label>Tỉ lệ</label><select id="ratio"><option>16:9</option><option>9:16</option></select></div>
    <div><label>Độ phân giải</label><select id="res"><option>720p</option><option>1080p</option></select></div>
    <div><label>Thời lượng</label><select id="duration"><option>8</option><option>6</option><option>4</option></select></div>
  </div>
  <div class="row"><div style="grid-column:1/-1"><label>Negative prompt (tuỳ chọn)</label><input id="negative" placeholder="vd: chữ, logo, nhạc nền"></div>
  <div style="grid-column:1/-1"><label>Ảnh đầu (tuỳ chọn, ảnh → video; áp cho mọi cảnh)</label><input type="file" id="image" accept="image/png,image/jpeg,image/webp"></div></div>
  <button id="go">Tạo video</button><div class="hint">1080p chỉ hỗ trợ 8 giây. Mỗi video mất khoảng 1–3 phút và tính phí theo bảng giá Gemini API.</div>
</form>
<section class="card"><b>Kết quả</b><div id="jobs"><div class="hint">Chưa có video nào.</div></div></section>
</main>
<script>
const $=(i)=>document.getElementById(i);
const esc=(s)=>String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function fileData(f){return new Promise((ok)=>{if(!f)return ok(undefined);const r=new FileReader();r.onload=()=>ok(r.result);r.readAsDataURL(f)})}
$('f').onsubmit=async(e)=>{e.preventDefault();$('go').disabled=true;
  try{
    const r=await fetch('/api/jobs',{method:'POST',body:JSON.stringify({
      prompts:$('prompt').value.split(/^\\s*---\\s*$/m),model:$('model').value,ratio:$('ratio').value,res:$('res').value,
      duration:$('duration').value,negative:$('negative').value,imageData:await fileData($('image').files[0])})});
    const j=await r.json();if(j.error)alert(j.error);else refresh();
  }finally{$('go').disabled=false}};
async function refresh(){
  const l=await (await fetch('/api/jobs')).json();if(!l.length)return;
  $('jobs').innerHTML=l.slice().reverse().map((j)=>'<div class="job"><div>#'+j.id+' · '+esc(j.prompt.slice(0,160))+'</div>'+
    (j.file?'<video controls src="/files/'+encodeURIComponent(j.file)+'"></video><a href="/files/'+encodeURIComponent(j.file)+'" download>Tải về '+esc(j.file)+'</a>'
    :j.error?'<div class="err">'+esc(j.error)+'</div>':'<div class="st">⏳ '+esc(j.status)+'</div>')+'</div>').join('');
}
setInterval(refresh,4000);refresh();
</script></html>`;

if (require.main === module) main().catch((e) => { console.error('\n✘ ' + e.message); process.exit(1); });
module.exports = { runJob, buildRequest, loadBatch, MODELS };
