#!/usr/bin/env node
// build-icon-catalog.mjs（Goons DS Studio 專屬）
// 從 library/gallery.html 的 icLibrary() 自動抽出「本 DS 採用的 PulsoIcon 子集」（2026-11-08 前為 Phosphor），
// 產出 canonical 圖庫清單 library/icons.catalog.json。
//
// 為什麼：那 65 顆 icon 原本只活在 gallery.html 的畫面陳列（display-only），
// 沒有機器可讀的正本 → Step 6 寫 Figma 時抓不到、只建得出那顆 size×tone 示意 icon。
// 本腳本沿用 repo「從正本自動生」的老套路（同 build-component-spec），
// 讓 gallery 一改、重跑就同步，圖庫與 Figma 寫入流程不再脫鉤。
//
// 用法：node sync/build-icon-catalog.mjs
// 產出：library/icons.catalog.json
//   { $meta:{...}, groups:[ { name, icons:[ {name, key, svg, solidSvg}, ... ] } ] }
// 依賴：cd sync/pulso && npm install

import { readFileSync, writeFileSync } from "node:fs";
import { loadIcon, markup, PULSO_VERSION } from "./pulso/lib.mjs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const GALLERY = join(ROOT, "library/gallery.html");
const OUT = join(ROOT, "library/icons.catalog.json");

const src = readFileSync(GALLERY, "utf8");

// ── 1. 建 const → PulsoIcon key 對照表（2026-11-08 起 icon 改用 PulsoIcon：const IC_X=PI('key')）──
const constMap = new Map();
for (const m of src.matchAll(/\bconst\s+((?:FTR_)?IC_[A-Z0-9_]+)\s*=\s*PI\('([a-z0-9-]+)'(,\{solid:1\})?\)/g)) constMap.set(m[1], { key: m[2], solid: !!m[3] });

// ── 2. 取 icLibrary() 函式主體（＝哪 65 顆、分幾組、每顆叫什麼）為正本 ──
const bodyStart = src.indexOf("function icLibrary(){return [");
if (bodyStart < 0) { console.error("✗ 找不到 icLibrary() 函式，gallery.html 結構可能改了"); process.exit(1); }
const body = src.slice(bodyStart, src.indexOf("];}", bodyStart) + 3);

// 每組：['群組名',[ ['icon-name',IC_CONST], ... ]]
const groups = [];
const missing = [];
const seen = new Set();
const groupRe = /\['([^']+)',\[([\s\S]*?)\]\]/g;
let g;
while ((g = groupRe.exec(body))) {
  const gname = g[1];
  const icons = [];
  const pairRe = /\['([^']+)',\s*((?:FTR_)?IC_[A-Z0-9_]+)/g;
  let p;
  while ((p = pairRe.exec(g[2]))) {
    const [, iname, cname] = p;
    const ref = constMap.get(cname);
    if (!ref) { missing.push(`${iname} → ${cname}`); continue; }
    const data = await loadIcon(ref.key);
    icons.push({ name: iname, key: ref.key, svg: markup(data), solidSvg: markup(data, { solid: true }) });
    seen.add(iname);
  }
  groups.push({ name: gname, icons });
}

const total = groups.reduce((n, gr) => n + gr.icons.length, 0);

// ── 3. 輸出 catalog ──
const catalog = {
  $meta: {
    title: "Icon 圖庫清單（canonical，自動生自 gallery.html icLibrary()）",
    source: "library/gallery.html · icLibrary()",
    generated: "run: node sync/build-icon-catalog.mjs",
    iconSet: "pulsoicon",
    version: PULSO_VERSION,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    styles: ["outline", "solid"],
    tokenPolicy: "線條型 icon：寫 Figma 時 stroke（實心版另含 fill）綁 semantic.icon.*（預設 semantic.icon.default），線寬綁 --icon-stroke 對應的 Variable；currentColor 不 hard-code 色值。動態（animated）只存在程式碼，Figma 不建屬性。",
    note: "Step 6『Icon 圖庫批次寫入』的來源正本：每顆各建一顆 Figma icon component（統一 24、命名 Icon/<群組>/<name>）。size×tone 那顆 registry『icon』是用法示意，兩者分工。",
    count: total,
  },
  groups,
};

writeFileSync(OUT, JSON.stringify(catalog, null, 2) + "\n");

console.log(`\nicons.catalog.json → ${OUT}`);
console.log(`  共 ${total} 顆、${groups.length} 組` + (missing.length ? `　⚠️ 查無常數：${missing.join("、")}` : ""));
groups.forEach((gr) => console.log(`    · ${gr.name}：${gr.icons.length}`));
console.log("");
