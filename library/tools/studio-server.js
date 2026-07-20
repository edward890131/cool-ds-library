#!/usr/bin/env node
/* ds-studio 本地 server：serve library/ 靜態檔 + 讀寫 projects/<name>/ 的 proposal / export / state。
   用法：node library/tools/studio-server.js  → http://localhost:8899/gallery.html?project=<name> */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const LIB = path.resolve(__dirname, '..');          // library/
const ROOT = path.resolve(LIB, '..');               // repo root
const PROJECTS = path.join(ROOT, 'projects');
const PORT = process.env.PORT || 8899;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
};
// dev server：一律 no-cache，避免改完檔案瀏覽器還吃舊版（本機預覽快取坑）
const send = (res, code, type, body) => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-cache, no-store, must-revalidate' }); res.end(body); };
const readJSON = fp => { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { return null; } };

const server = http.createServer((req, res) => {
  const u = url.parse(req.url, true);
  let p = decodeURIComponent(u.pathname);

  // ---- API：/api/project/<name>[/export|/state] ----
  if (p.startsWith('/api/project/')) {
    const parts = p.split('/').filter(Boolean);     // ['api','project','<name>', action?]
    const name = parts[2];
    const action = parts[3];
    if (!name) return send(res, 400, 'text/plain', 'missing project name');
    const dir = path.join(PROJECTS, name);

    // GET：回傳 proposal + 已存 state + 版本資訊
    if (req.method === 'GET' && !action) {
      return send(res, 200, MIME['.json'], JSON.stringify({
        name,
        proposal: readJSON(path.join(dir, 'proposal.json')),
        state: readJSON(path.join(dir, 'selection.state.json')),
        version: readJSON(path.join(dir, 'library.version.json')), // {version,history} 或 null
        icons: readJSON(path.join(dir, 'icons.json')) || [],       // 專案自訂 icon [{name,svg}]（來源＝專案 Figma 經同步拉入）
      }));
    }
    // POST export / state：寫檔到 projects/<name>/
    if (req.method === 'POST' && (action === 'export' || action === 'state')) {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        let data; try { data = JSON.parse(body); } catch (e) { return send(res, 400, 'text/plain', 'bad json'); }
        fs.mkdirSync(dir, { recursive: true });
        const written = [];
        if (action === 'export') {
          if (data.tokens) { fs.writeFileSync(path.join(dir, 'tokens.export.json'), JSON.stringify(data.tokens, null, 2)); written.push('tokens.export.json'); }
          if (data.components) { fs.writeFileSync(path.join(dir, 'components.export.json'), JSON.stringify(data.components, null, 2)); written.push('components.export.json'); }
          if (data.state) { fs.writeFileSync(path.join(dir, 'selection.state.json'), JSON.stringify(data.state, null, 2)); written.push('selection.state.json'); }
          // 版本升級：data.version = {version, historyEntry}；append 到 library.version.json，只更新專案元件庫、不動共用引擎
          if (data.version && data.version.historyEntry) {
            const vfp = path.join(dir, 'library.version.json');
            const cur = readJSON(vfp) || { version: 0, history: [] };
            const entry = Object.assign({ v: (cur.version || 0) + 1 }, data.version.historyEntry);
            cur.version = entry.v; cur.history = (cur.history || []).concat(entry);
            fs.writeFileSync(vfp, JSON.stringify(cur, null, 2)); written.push('library.version.json');
          }
        } else {
          fs.writeFileSync(path.join(dir, 'selection.state.json'), JSON.stringify(data, null, 2)); written.push('selection.state.json');
        }
        return send(res, 200, MIME['.json'], JSON.stringify({ ok: true, dir, written }));
      });
      return;
    }
    return send(res, 404, 'text/plain', 'not found');
  }

  // ---- 靜態檔（library/）----
  if (p === '/') p = '/gallery.html';
  const fp = path.normalize(path.join(LIB, p));
  if (!fp.startsWith(LIB)) return send(res, 403, 'text/plain', 'forbidden');
  fs.readFile(fp, (e, d) => {
    if (e) return send(res, 404, 'text/plain', '404 ' + p);
    send(res, 200, MIME[path.extname(fp)] || 'application/octet-stream', d);
  });
});

server.listen(PORT, () => {
  console.log('ds-studio server → http://localhost:' + PORT);
  console.log('  library:  ' + LIB);
  console.log('  projects: ' + PROJECTS);
  console.log('  開專案：   http://localhost:' + PORT + '/gallery.html?project=<name>');
});
