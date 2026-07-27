#!/usr/bin/env node
// build-icon-catalog.mjs（Goons DS Studio 專屬）
// 從 library/gallery.html 的 icLibrary() 自動抽出「本 DS 採用的 Phosphor icon 子集」，
// 產出 canonical 圖庫清單 library/icons.catalog.json。
//
// 為什麼：那 65 顆 icon 原本只活在 gallery.html 的畫面陳列（display-only），
// 沒有機器可讀的正本 → Step 6 寫 Figma 時抓不到、只建得出那顆 size×tone 示意 icon。
// 本腳本沿用 repo「從正本自動生」的老套路（同 build-component-spec），
// 讓 gallery 一改、重跑就同步，圖庫與 Figma 寫入流程不再脫鉤。
//
// 用法：node sync/build-icon-catalog.mjs
// 產出：library/icons.catalog.json
//   { $meta:{...}, groups:[ { name, icons:[ {name, svg}, ... ] } ] }

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const GALLERY = join(ROOT, "library/gallery.html");
const OUT = join(ROOT, "library/icons.catalog.json");

const src = readFileSync(GALLERY, "utf8");

// ── 1. 建 const → svg 對照表（IC_* 與 FTR_IC_*，雙引號與單引號兩種宣告都吃）──
const constMap = new Map();
function collect(re, kind) {
  let m;
  while ((m = re.exec(src))) {
    let svg = m[2];
    // 還原字串字面值跳脫（Phosphor SVG 除了跳脫引號外沒有其他反斜線）
    svg = kind === "d"
      ? svg.replace(/\\"/g, '"').replace(/\\\\/g, "\\")
      : svg.replace(/\\'/g, "'").replace(/\\\\/g, "\\");
    constMap.set(m[1], svg.trim());
  }
}
collect(/\bconst\s+((?:FTR_)?IC_[A-Z0-9_]+)\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g, "d");
collect(/\bconst\s+((?:FTR_)?IC_[A-Z0-9_]+)\s*=\s*'((?:[^'\\]|\\.)*)'\s*;/g, "s");

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
    const svg = constMap.get(cname);
    if (!svg) { missing.push(`${iname} → ${cname}`); continue; }
    icons.push({ name: iname, svg });
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
    iconSet: "phosphor",
    viewBox: "0 0 256 256",
    fill: "currentColor",
    tokenPolicy: "單色 icon，寫 Figma 時 fill 綁 semantic.icon.*（預設 semantic.icon.default）；currentColor 不 hard-code 色值。",
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
