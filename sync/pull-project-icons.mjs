#!/usr/bin/env node
/* pull-project-icons —— 把「專案 Figma 新建的 icon」拉進專案元件庫（v1 只顯示）。
 *
 * 半自動流程（沿用本 repo sync 一貫的「Claude MCP 拉 → 腳本正規化寫入」模式，見 SYNC_PROMPTS.md）：
 *   1. Claude 用 Figma MCP 讀專案 Figma 的 icon frame/page，取每顆 icon 的 name + 原始 SVG，
 *      存成一個暫存 JSON：[{ "name": "...", "svg": "<svg ...>...</svg>" }, ...]
 *   2. 跑本腳本：node sync/pull-project-icons.mjs <projectName> <rawIcons.json>
 *   3. 腳本正規化每顆 SVG，合併寫入 projects/<projectName>/icons.json（依 name 去重）
 *   4. 網站 ?project=<projectName> 的 Icon 頁「本專案自訂 Icon」區塊即會顯示
 *
 * 只寫 projects/<name>/，不碰共用引擎、不影響其他專案（符合兩庫防呆）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');           // repo root
const PROJECTS = path.join(ROOT, 'projects');

const [, , name, rawPath] = process.argv;
if (!name || !rawPath) {
  console.error('用法：node sync/pull-project-icons.mjs <projectName> <rawIcons.json>');
  console.error('  rawIcons.json 格式：[{ "name": "star", "svg": "<svg ...>...</svg>" }, ...]');
  process.exit(1);
}

const projDir = path.join(PROJECTS, name);
if (!fs.existsSync(projDir)) { console.error(`✗ 找不到專案資料夾：projects/${name}/`); process.exit(1); }

let raw;
try { raw = JSON.parse(fs.readFileSync(rawPath, 'utf8')); }
catch (e) { console.error(`✗ 讀不到 / 解析失敗：${rawPath}`); process.exit(1); }
if (!Array.isArray(raw)) { console.error('✗ rawIcons.json 必須是陣列'); process.exit(1); }

// ── 正規化：確保是單一 <svg>、補 fill=currentColor（讓 tone/currentColor 生效）、偵測 stroke 提醒 ──
const warnings = [];
function normalize(name, svgIn) {
  let svg = String(svgIn || '').trim();
  const m = svg.match(/<svg[\s\S]*<\/svg>/i);           // 只取第一個 <svg>…</svg>，去掉外層 wrapper/xml 宣告
  if (!m) return null;
  svg = m[0];
  // 沒有 fill 屬性 → 補 fill="currentColor"（單色 icon 才能吃 semantic.icon.* / currentColor）
  if (!/<svg[^>]*\bfill=/.test(svg)) svg = svg.replace(/<svg/i, '<svg fill="currentColor"');
  // 硬寫的具體色 fill（非 currentColor/none）→ 提醒（多半是設計沒綁 token，v1 保留原樣不強改）
  const hard = svg.match(/fill="(#|rgb)[^"]*"/gi);
  if (hard) warnings.push(`「${name}」含硬寫色 fill（${hard.length} 處）：單色 icon 建議在 Figma 綁 semantic.icon.* 再拉。`);
  // stroke-based icon：line width 不會隨縮放（本 repo 既有坑），提醒需換算
  if (/\bstroke=(?!"none")/.test(svg) || /stroke-width=/.test(svg)) {
    const vb = (svg.match(/viewBox="0 0 (\d+)/) || [])[1];
    warnings.push(`「${name}」是 stroke 描邊 icon（viewBox ${vb || '?'}）：stroke-width 不隨縮放，若線變粗細不對，需按 目標px/viewBox 換算。`);
  }
  return svg;
}

const existing = (() => { try { return JSON.parse(fs.readFileSync(path.join(projDir, 'icons.json'), 'utf8')); } catch { return []; } })();
const byName = new Map(existing.map(o => [o.name, o]));

let added = 0, updated = 0, skipped = 0;
for (const it of raw) {
  const nm = (it.name || '').trim();
  if (!nm) { skipped++; continue; }
  const svg = normalize(nm, it.svg);
  if (!svg) { console.warn(`  ⚠ 略過「${nm}」：抓不到有效的 <svg>`); skipped++; continue; }
  if (byName.has(nm)) updated++; else added++;
  byName.set(nm, { name: nm, svg });
}

const merged = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(path.join(projDir, 'icons.json'), JSON.stringify(merged, null, 2) + '\n');

console.log(`✓ projects/${name}/icons.json：新增 ${added}、更新 ${updated}、略過 ${skipped}，目前共 ${merged.length} 顆`);
if (warnings.length) { console.log('\n提醒：'); warnings.forEach(w => console.log('  · ' + w)); }
console.log('\n下一步：開 http://localhost:8899/gallery.html?project=' + name + '#icon → 看「本專案自訂 Icon」區塊。');
