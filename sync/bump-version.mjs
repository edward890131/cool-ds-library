#!/usr/bin/env node
// bump-version.mjs
// 把「從 Figma 同步回來的改動」記進專案元件庫版本（Phase F 的第 4 塊）。
// sync 只出報告、不自動改；當設計師 confirm 要把 Figma 的改動吃回 projects/<name>/ 後，
// Claude 套完值、再跑這支 bump 版本 —— 網站下次載入就會跳「版本已更新」說明（來源標 Figma）。
//
// 用法：
//   node sync/bump-version.mjs <name> --source=figma --change="token --c-brand-500 #A→#B" --change="+variant tag/personal"
//   （--source 預設 figma；每個 --change 一條 changelog）
//
// 只動 projects/<name>/library.version.json —— 專案層，不碰共用引擎。

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const name = process.argv[2];
if (!name || name.startsWith("--")) {
  console.error('用法：node sync/bump-version.mjs <name> --source=figma --change="..."');
  process.exit(2);
}
const args = process.argv.slice(3);
const source = (args.find((a) => a.startsWith("--source=")) || "--source=figma").split("=")[1];
const changes = args.filter((a) => a.startsWith("--change=")).map((a) => a.slice("--change=".length));
if (!changes.length) {
  console.error("至少要一條 --change=\"...\"");
  process.exit(2);
}

const dir = join(ROOT, "projects", name);
if (!existsSync(dir)) { console.error(`查無專案 ${dir}`); process.exit(2); }
const vfp = join(dir, "library.version.json");

let cur;
try { cur = JSON.parse(readFileSync(vfp, "utf8")); } catch { cur = { version: 0, history: [] }; }

// 台北時間 ISO（stamp 用；Node 端可用 Date）
const at = new Date(Date.now() + 8 * 3600 * 1000).toISOString().replace("Z", "+08:00");
const entry = { v: (cur.version || 0) + 1, at, source, changes };
cur.version = entry.v;
cur.history = (cur.history || []).concat(entry);

mkdirSync(dir, { recursive: true });
writeFileSync(vfp, JSON.stringify(cur, null, 2) + "\n");

console.log(`\n${name} 元件庫版本 → v${entry.v}（來源：${source}）`);
changes.forEach((c) => console.log("  · " + c));
console.log(`\n寫入 ${vfp}\n`);
