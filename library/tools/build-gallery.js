#!/usr/bin/env node
/* build-gallery.js — 把 library/src/ 的小檔合併回 library/gallery.html（網站實際載入的單一檔）
   為什麼：gallery.html 有 4MB、兩萬多行，改一個元件要在巨檔裡找；拆成小檔好找好改，
          但網站部署、匯出、其他腳本（build-registry、extract-base-tokens…）都吃單一檔，所以改完再合併回去。
   規則：src/page.html 是頁面骨架；裡面獨佔一行的「@@include 相對路徑」會被換成那個檔案的完整內容。
         每個小檔都以換行結尾，合併時原樣接上，不加不減任何字元。
   用法：node library/tools/build-gallery.js          → 重新產生 gallery.html
         node library/tools/build-gallery.js --check  → 只比對，不寫檔；gallery.html 跟 src/ 不同步就回傳錯誤碼 1
   不需要安裝任何套件。 */
'use strict';
const fs = require('fs');
const path = require('path');

const LIB = path.join(__dirname, '..');
const SRC = path.join(LIB, 'src');
const OUT = path.join(LIB, 'gallery.html');
const INCLUDE = /^@@include (\S+)$/;

/* 讀骨架，逐行把 @@include 換成檔案內容（只展開一層：小檔裡不再放 @@include） */
function build() {
  const page = fs.readFileSync(path.join(SRC, 'page.html'), 'utf8');
  const used = new Set();
  const out = page.split('\n').map(line => {
    const m = INCLUDE.exec(line);
    if (!m) return line;
    const rel = m[1];
    if (used.has(rel)) throw new Error('重複 include：' + rel);
    used.add(rel);
    const fp = path.join(SRC, rel);
    if (!fp.startsWith(SRC + path.sep)) throw new Error('include 路徑跑出 src/：' + rel);
    const body = fs.readFileSync(fp, 'utf8');
    if (!body.endsWith('\n')) throw new Error(rel + ' 結尾少了換行');
    return body.slice(0, -1);   // 換行由外層 join 補回
  }).join('\n');
  /* src/ 裡有檔案沒被 include → 多半是新增檔案忘了加進 page.html，直接報錯 */
  const orphan = listFiles(SRC).filter(r => r !== 'page.html' && !used.has(r));
  if (orphan.length) throw new Error('這些檔案沒有被 page.html 引用：' + orphan.join('、'));
  return out;
}

/* 列出 src/ 下所有檔案（相對路徑、統一用 /） */
function listFiles(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    if (d.name.startsWith('.')) return [];
    const fp = path.join(dir, d.name);
    return d.isDirectory() ? listFiles(fp, base) : [path.relative(base, fp).split(path.sep).join('/')];
  });
}

let html;
try { html = build(); } catch (e) { console.error('✗ ' + e.message); process.exit(1); }

if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === html) { console.log('✓ gallery.html 與 src/ 同步'); process.exit(0); }
  /* 找出第一個不同的行，方便定位是誰直接改了 gallery.html */
  const a = cur.split('\n'), b = html.split('\n');
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  console.error('✗ gallery.html 跟 src/ 不同步（第 ' + (i + 1) + ' 行開始不同）。');
  console.error('  請改 library/src/ 裡的檔案，再跑 node library/tools/build-gallery.js');
  process.exit(1);
}

fs.writeFileSync(OUT, html);
console.log('✓ 已產生 library/gallery.html（' + (Buffer.byteLength(html) / 1024 / 1024).toFixed(2) + ' MB）');
