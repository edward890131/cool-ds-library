#!/usr/bin/env node
/* check-hardcode.js — 檢查 library/src/css 有沒有沒走 Design Token 的寫死值（TOK-SWEEP:v3，2026-11-13）
   為什麼：2026-11 整批清過一次（約 1300 處），之後新寫的樣式只要一寫死就會慢慢累積回來；這支讓它一出現就被抓到。
   用法：node library/tools/check-hardcode.js          → 列出問題，有問題回傳錯誤碼 1
         node library/tools/check-hardcode.js --quiet  → 只印總數
   不需要安裝任何套件。

   會抓（Yuu 2026-11-13 定的規則）：
     顏色      #hex、rgb()、hsl()、white／black（要用 --s-*、--c-*、--s-media-* 等 token）
     字級      font-size 的 px
     字重      font-weight 的數字
     行高      line-height 1.15～1.8 的小數（展示大標的 1.05、1.1 不抓）
     間距      padding／margin／gap 4～64px（1～3px 視覺微調、>64px 版面尺寸不抓）
     圓角      border-radius 2～32px（1px、完全圓角不抓）
     陰影      沒用 var() 的 box-shadow
     動畫時間  transition／animation 的第一個時間，且 ≤600ms、不是無限循環（延遲時間、長裝飾動畫不抓）
   不抓：
     自訂屬性的定義（--x:…）＝token／區域 token 本身
     var() 裡的備用值、calc()／clamp()／min()／max() 公式、mask 遮罩、url()
     同一行寫了 hc-ok 註解的（刻意固定，例如 Logo 固定深淺底、選色器色盤；請在註解裡寫原因）
     @keyframes 裡的關鍵格 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'css');
const QUIET = process.argv.includes('--quiet');

const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\b(?:white|black)\b/;
const PX = /(?<![\w.-])(\d*\.?\d+)px\b/g;
const SPACE_P = /^(?:(?:padding|margin)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|gap|row-gap|column-gap)$/;
const FORMULA = /\b(?:calc|clamp|min|max)\(/;

/* 把 var(...)（可巢狀）換成 VAR，避免把 token 的備用值當成寫死 */
function stripVar(v) {
  let out = '', i = 0;
  while (i < v.length) {
    if (v.startsWith('var(', i)) {
      let d = 0, j = i + 3;
      for (; j < v.length; j++) { if (v[j] === '(') d++; else if (v[j] === ')') { d--; if (!d) break; } }
      out += 'VAR'; i = j + 1;
    } else out += v[i++];
  }
  return out.replace(/url\([^)]*\)/g, 'URL');
}
const pxs = v => [...v.matchAll(PX)].map(m => parseFloat(m[1]));

/* 判斷一條宣告有沒有問題；回傳問題類別或 null */
function check(prop, val) {
  if (prop.startsWith('--')) return null;                 // token 定義
  const v = stripVar(val);
  if (/mask/.test(prop)) return null;
  if (COLOR.test(v) && prop !== 'font-family') return '顏色';
  if (FORMULA.test(v)) return null;
  if (prop === 'font-size' && pxs(v).length) return '字級';
  if (prop === 'font-weight' && /^\s*\d{3}\s*(!important)?\s*$/.test(v)) return '字重';
  if (prop === 'line-height') { const m = v.match(/^\s*(\d*\.\d+)\s*(!important)?\s*$/); if (m && +m[1] >= 1.15 && +m[1] <= 1.8) return '行高'; }
  if (SPACE_P.test(prop) && pxs(v).some(n => n > 3 && n <= 64) && !/^\s*-/.test(v)) return '間距';
  if (/^border.*radius$/.test(prop) && !v.includes('/') && pxs(v).some(n => n > 1 && n <= 32)) return '圓角';
  if (prop === 'box-shadow' && pxs(v).some(n => n > 0) && !v.includes('VAR') && !/transparent|currentColor/.test(v)) return '陰影';
  if (/^(transition|animation)(-duration)?$/.test(prop) && !/infinite/.test(v)) {
    for (const part of v.split(',')) {   // 每段只看第一個時間（第二個是延遲）
      const first = part.trim().split(/\s+/).find(t => t === 'VAR' || /^\d*\.?\d+m?s$/.test(t));
      if (!first || first === 'VAR') continue;   // 長度已經是 token（後面的數字是延遲）
      const m = first.match(/^(\d*\.?\d+)(m?s)$/);
      const ms = parseFloat(m[1]) * (m[2] === 'ms' ? 1 : 1000);
      if (ms > 0 && ms <= 600) return '動畫時間';
    }
  }
  return null;
}

const hits = [];
for (const fn of fs.readdirSync(DIR).filter(f => f.endsWith('.css')).sort()) {
  const src = fs.readFileSync(path.join(DIR, fn), 'utf8');
  /* 註解換成等長空白（保留行號）；標了 hc-ok 的行整行略過 */
  const lines = src.split('\n');
  const okLine = new Set(lines.map((l, i) => /hc-ok/.test(l) ? i + 1 : 0).filter(Boolean));
  const s = src.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  /* 逐條「選擇器 { 宣告 }」（@media 會被拆開，內層規則照樣抓到） */
  for (const m of s.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    if (!sel || /^(from|to|\d+%)/.test(sel) || /:root\b/.test(sel)) continue;
    if (/@keyframes/.test(s.slice(Math.max(0, m.index - 200), m.index + m[1].length))) continue;
    const bodyStart = m.index + m[1].length + 1;
    for (const d of m[2].matchAll(/(?<![\w-])(-{0,2}[a-z][a-z0-9-]*)\s*:\s*([^;{}]+)/g)) {
      const line = s.slice(0, bodyStart + d.index).split('\n').length;
      if (okLine.has(line)) continue;
      const kind = check(d[1], d[2]);
      if (kind) hits.push({ fn, line, kind, prop: d[1], val: d[2].trim().slice(0, 80) });
    }
  }
}

if (!hits.length) { console.log('✓ 沒有寫死值（library/src/css）'); process.exit(0); }
const by = {};
hits.forEach(h => { by[h.kind] = (by[h.kind] || 0) + 1; });
if (!QUIET) hits.forEach(h => console.log(`  ${h.fn}:${h.line}  [${h.kind}]  ${h.prop}: ${h.val}`));
console.error(`✗ 找到 ${hits.length} 處寫死值（${Object.entries(by).map(([k, n]) => k + ' ' + n).join('、')}）。`);
console.error('  請改用 token（00-tokens.css）；確定要固定的，在同一行加 /* hc-ok：原因 */。');
process.exit(1);
