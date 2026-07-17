#!/usr/bin/env node
// extract-base-tokens.mjs
// 從 library/gallery.html 的 :root 四個區塊抽出 base token，寫成可檢視的
// library/tokens.base.json（= Token 軌的 code 端「基準真相」，專案 override 疊在這之上）。
//
// 用法：
//   node sync/extract-base-tokens.mjs
//
// 為什麼要這支：gallery.html 有 8000+ 行，drift 每次重解析太脆弱；抽成一份 JSON
// 讓 code SoT 可讀、可 diff、可 commit。gallery :root 改了就重跑這支更新 base。

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const html = readFileSync(join(ROOT, "library/gallery.html"), "utf8");

// 從一段 CSS 文字抽出 --name:value 對（值內不含 { }，只有 ( )，安全）
function parseVars(block) {
  const out = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(block))) {
    out[m[1].trim()] = m[2].trim();
  }
  return out;
}

// 取「起始標記」之後到「第一個 }」之間的內容（:root 區塊內無巢狀 {}）
function sliceBlock(marker) {
  const i = html.indexOf(marker);
  if (i < 0) return "";
  const start = i + marker.length;
  const end = html.indexOf("}", start);
  return html.slice(start, end);
}

// root（= 桌機 / 淺色基準，含 L1 primitive + L2 semantic light）
const rootBlock = sliceBlock(":root{");
// dark（語意層 + elevation 覆寫）——取 media 版（與 data-theme=dark 內容相同）
const darkBlock = sliceBlock("@media (prefers-color-scheme:dark){ :root{");
// tablet / mobile（只覆寫尺寸類）
const tabletBlock = sliceBlock("@media(max-width:1023px){ :root{");
const mobileBlock = sliceBlock("@media(max-width:767px){ :root{");

const base = {
  $meta: {
    title: "Goons DS Studio — Code 端 base token（Token 軌基準真相）",
    source: "library/gallery.html :root 四區塊自動抽取",
    note: "專案 tokens.export.json 的 overrides 疊在此之上 = 該專案的 code SoT。root=桌機/淺色基準、dark=深色語意覆寫、tablet/mobile=響應式尺寸覆寫。legacy 別名層（--canvas/--ink/--i-* 等）與 --s-* 語意仍在 root 內、由 adapter 分類。",
    regenerate: "gallery :root 改了就重跑 node sync/extract-base-tokens.mjs",
  },
  root: parseVars(rootBlock),
  dark: parseVars(darkBlock),
  tablet: parseVars(tabletBlock),
  mobile: parseVars(mobileBlock),
};

const outPath = join(ROOT, "library/tokens.base.json");
writeFileSync(outPath, JSON.stringify(base, null, 2) + "\n");

console.log(`\ntokens.base.json → ${outPath}`);
console.log(
  `  root ${Object.keys(base.root).length} · dark ${Object.keys(base.dark).length} · tablet ${Object.keys(base.tablet).length} · mobile ${Object.keys(base.mobile).length}\n`
);
