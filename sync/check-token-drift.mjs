#!/usr/bin/env node
// check-token-drift.mjs（Goons DS Studio 版）
// 比對某專案的 code 端 token（tokens.base.json + projects/<name>/tokens.export.json）
// 與 Figma snapshot（projects/<name>/sync/figma-snapshot.json）的差異，
// 輸出 markdown 到 projects/<name>/sync/reports/drift-{YYYY-MM-DD}.md（台北時間）。
//
// 用法：
//   node sync/check-token-drift.mjs <name>      （或 npm run figma:diff -- <name>）
//
// 前置：figma-snapshot.json 要先用 AI 透過 Figma MCP（get_variable_defs）拉取；
//       拉取 prompt 見 sync/SYNC_PROMPTS.md。Node 端碰不到 Figma。

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeCodeTokens, normalizeFigmaSnapshot } from "./token-adapter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const name = process.argv[2];
if (!name) {
  console.error("用法：node sync/check-token-drift.mjs <專案名>");
  process.exit(2);
}
const projDir = join(ROOT, "projects", name);
const syncDir = join(projDir, "sync");

// ---- 讀輸入 ----
const base = JSON.parse(readFileSync(join(ROOT, "library/tokens.base.json"), "utf8"));
const exportPath = join(projDir, "tokens.export.json");
const override = existsSync(exportPath) ? JSON.parse(readFileSync(exportPath, "utf8")) : {};
const snapPath = join(syncDir, "figma-snapshot.json");
if (!existsSync(snapPath)) {
  console.error(`缺 ${snapPath}\n先用 Figma MCP 拉 snapshot（見 sync/SYNC_PROMPTS.md）。`);
  process.exit(2);
}
const snapshot = JSON.parse(readFileSync(snapPath, "utf8"));

const codeData = normalizeCodeTokens(base, override);
const figmaData = normalizeFigmaSnapshot(snapshot);

// ---- 索引 ----
function makeIndex(data) {
  const idx = new Map();
  for (const c of data.collections)
    for (const v of c.variables)
      idx.set(`${c.name}::${v.name}`, { collection: c.name, variable: v, modes: c.modes });
  return idx;
}
const codeIdx = makeIndex(codeData);
const figmaIdx = makeIndex(figmaData);

// ---- 值比對 ----
const EPS = 0.001;
function valueEqual(va, vb) {
  if (!va || !vb) return va === vb;
  if (va.kind !== vb.kind) return false;
  if (va.kind === "alias") return va.ref === vb.ref;
  if (typeof va.value === "string" && typeof vb.value === "string")
    return va.value.toLowerCase() === vb.value.toLowerCase();
  if (typeof va.value === "number" && typeof vb.value === "number")
    return Math.abs(va.value - vb.value) < EPS;
  return va.value === vb.value;
}
function fmtValue(v) {
  if (!v) return "(none)";
  if (v.kind === "alias") return `→ ${v.ref}`;
  return String(v.value);
}

// ---- 分類 ----
const onlyInCode = [];
const onlyInFigma = [];
const drifted = [];
const aligned = [];

for (const key of new Set([...codeIdx.keys(), ...figmaIdx.keys()])) {
  const c = codeIdx.get(key);
  const f = figmaIdx.get(key);
  if (c && !f) { onlyInCode.push({ key, entry: c }); continue; }
  if (!c && f) { onlyInFigma.push({ key, entry: f }); continue; }
  const modeIssues = [];
  for (const m of f.modes) {
    const cv = c.variable.values[m];
    const fv = f.variable.values[m];
    if (fv === undefined) continue; // Figma 該 mode 沒值 → 不比
    if (!cv) modeIssues.push({ mode: m, issue: "code-missing-mode", figma: fv });
    else if (!valueEqual(cv, fv)) modeIssues.push({ mode: m, issue: "value-mismatch", code: cv, figma: fv });
  }
  if (modeIssues.length === 0) aligned.push({ key });
  else drifted.push({ key, modeIssues, code: c, figma: f });
}

// ---- markdown（台北時間 UTC+8）----
const today = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
const reportPath = join(syncDir, "reports", `drift-${today}.md`);
mkdirSync(dirname(reportPath), { recursive: true });

const meta = snapshot.$metadata || {};
const L = [];
L.push(`# Figma ↔ Code Token Drift — ${name}`);
L.push("");
L.push(`> 產生：${today}（台北時間）  `);
L.push(`> Figma：${meta.fileName || "?"} (\`${meta.fileKey || "?"}\`)　Snapshot：${meta.snapshotAt || "?"}`);
L.push("");
L.push("## TL;DR");
L.push("");
L.push("| 類別 | 數量 | 歸位（鐵則 6） |");
L.push("|---|---|---|");
L.push(`| ✅ 對齊 | ${aligned.length} | — |`);
L.push(`| 📤 只在 Figma（code 缺） | ${onlyInFigma.length} | 補進 tokens.export.json（figma→code） |`);
L.push(`| 📥 只在 Code（Figma 缺） | ${onlyInCode.length} | 推進 Figma Variables（code→figma） |`);
L.push(`| ⚠️ 值不一致 | ${drifted.length} | 使用者裁決誰對 |`);
L.push("");

function dumpByCollection(title, arr) {
  if (!arr.length) return;
  L.push(`## ${title}`);
  L.push("");
  const byC = new Map();
  for (const x of arr) {
    const c = x.entry.collection;
    if (!byC.has(c)) byC.set(c, []);
    byC.get(c).push(x);
  }
  for (const [c, items] of byC) {
    L.push(`### \`${c}\` collection`);
    L.push("");
    for (const x of items) {
      const v = x.entry.variable;
      const vals = Object.entries(v.values).map(([m, vv]) => `**${m}**: ${fmtValue(vv)}`).join(" / ");
      L.push(`- \`${v.name}\` (${v.type}) — ${vals}`);
    }
    L.push("");
  }
}
dumpByCollection("📤 只在 Figma 端（建議補進 `tokens.export.json`）", onlyInFigma);
dumpByCollection("📥 只在 Code 端（建議補進 Figma Variables）", onlyInCode);

if (drifted.length) {
  L.push("## ⚠️ 值不一致");
  L.push("");
  for (const d of drifted) {
    const [c, n] = d.key.split("::");
    L.push(`### \`${c}\` :: \`${n}\``);
    L.push("");
    L.push("| Mode | Code | Figma | 狀態 |");
    L.push("|---|---|---|---|");
    for (const mi of d.modeIssues) {
      if (mi.issue === "code-missing-mode")
        L.push(`| ${mi.mode} | _(缺)_ | \`${fmtValue(mi.figma)}\` | code 缺此 mode |`);
      else
        L.push(`| ${mi.mode} | \`${fmtValue(mi.code)}\` | \`${fmtValue(mi.figma)}\` | 值不同 |`);
    }
    L.push("");
  }
}

L.push("## ✅ 已對齊");
L.push("");
L.push(`<details><summary>${aligned.length} 個 tokens</summary>`);
L.push("");
const alignedByC = new Map();
for (const a of aligned) {
  const [c, n] = a.key.split("::");
  if (!alignedByC.has(c)) alignedByC.set(c, []);
  alignedByC.get(c).push(n);
}
for (const [c, names] of alignedByC) {
  L.push(`**${c}** (${names.length})：`);
  L.push("");
  L.push(names.map((n) => `\`${n}\``).join(", "));
  L.push("");
}
L.push("</details>");
L.push("");

writeFileSync(reportPath, L.join("\n"));

console.log(`\nToken drift → ${reportPath}`);
console.log(`  ✅ ${aligned.length} · 📤 ${onlyInFigma.length} figma-only · 📥 ${onlyInCode.length} code-only · ⚠️ ${drifted.length} drifted\n`);
if (drifted.length || onlyInCode.length || onlyInFigma.length) process.exitCode = 1;
