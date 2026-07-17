#!/usr/bin/env node
// check-component-drift.mjs（Goons DS Studio 版）
// 比對 code 端元件指紋（sync/component-spec.json，自動生自 registry）與
// Figma 端 live 指紋（sync/figma-component-snapshot.json），輸出 markdown。
//
// ⚠️ 改寫自 figma-sync-setup 原版：原版比 variants/states 兩軸 + radius/color/hardcoded；
//    我們 registry 是四軸模型（variant/intent/state/size）→ 改成**逐軸結構比對**，
//    對應鐵則 3「軸＝Figma variant/boolean」。樣式指紋（radius/color）屬未來延伸。
//
// 用法：
//   node sync/check-component-drift.mjs <name>   （或 npm run figma:diff:components -- <name>）
//
// 前置：figma-component-snapshot.json 先用 Figma MCP（get_metadata 讀 variant property）拉取；
//       拉取 prompt 見 sync/SYNC_PROMPTS.md。
//
// 偵測：
//   ⚠️ 結構漂移 — 某軸的 option 兩邊增減（Figma 有 code 無 / code 有 Figma 無）、軸本身增減
//   🧩 缺件 — 一邊有元件、另一邊沒有
//   📍 figmaNode 未回填 — snapshot 尚未對到 Figma 節點
//   🎨 Figma hygiene（advisory）— snapshot.colorCssVarNamed：顏色綁 var(--*) 而非語意 token，建議 rebind

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const name = process.argv[2];
if (!name) {
  console.error("用法：node sync/check-component-drift.mjs <專案名>");
  process.exit(2);
}
const syncDir = join(ROOT, "projects", name, "sync");
const specPath = join(syncDir, "component-spec.json");
const snapPath = join(syncDir, "figma-component-snapshot.json");
if (!existsSync(specPath)) {
  console.error(`缺 ${specPath}\n先跑 node sync/build-component-spec.mjs ${name}`);
  process.exit(2);
}
if (!existsSync(snapPath)) {
  console.error(`缺 ${snapPath}\n先用 Figma MCP 拉 component snapshot（見 sync/SYNC_PROMPTS.md）。`);
  process.exit(2);
}
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const snapshot = JSON.parse(readFileSync(snapPath, "utf8"));
const codeComps = spec.components || {};
const figmaComps = snapshot.components || {};

function setDiff(a = [], b = []) {
  const sa = new Set(a), sb = new Set(b);
  return { onlyInCode: a.filter((x) => !sb.has(x)), onlyInFigma: b.filter((x) => !sa.has(x)) };
}

const results = [];
for (const id of [...new Set([...Object.keys(codeComps), ...Object.keys(figmaComps)])].sort()) {
  const c = codeComps[id];
  const f = figmaComps[id];
  if (c && !f) { results.push({ id, missing: "figma", note: "code 有此元件，Figma snapshot 缺（尚未建 / 未拉）" }); continue; }
  if (!c && f) { results.push({ id, missing: "code", figmaNode: f.figmaNode, note: "Figma 有此元件，code registry 未納管（新設計？）" }); continue; }

  const structural = [];
  const cAxes = c.axes || {};
  const fAxes = f.axes || {};
  // 軸本身增減
  const axisDiff = setDiff(Object.keys(cAxes), Object.keys(fAxes));
  if (axisDiff.onlyInCode.length) structural.push(`軸多出（code 有 Figma 無）：${axisDiff.onlyInCode.join(", ")}`);
  if (axisDiff.onlyInFigma.length) structural.push(`軸缺漏（Figma 有 code 無）：${axisDiff.onlyInFigma.join(", ")}`);
  // 每軸 option 增減
  for (const axis of new Set([...Object.keys(cAxes), ...Object.keys(fAxes)])) {
    const d = setDiff(cAxes[axis], fAxes[axis]);
    if (d.onlyInCode.length) structural.push(`\`${axis}\` 多出（code 有 Figma 無）：${d.onlyInCode.join(", ")}`);
    if (d.onlyInFigma.length) structural.push(`\`${axis}\` 缺漏（Figma 有 code 無）：${d.onlyInFigma.join(", ")}`);
  }
  const noNode = !c.figmaNode && !f.figmaNode;
  const hygiene = Array.isArray(f.colorCssVarNamed) ? f.colorCssVarNamed : [];
  results.push({ id, figmaNode: f.figmaNode || c.figmaNode || "", structural, noNode, hygiene });
}

// ---- 統計 ----
const structuralComps = results.filter((r) => r.structural && r.structural.length);
const missingComps = results.filter((r) => r.missing);
const hygieneComps = results.filter((r) => r.hygiene && r.hygiene.length);
const noNodeComps = results.filter((r) => r.noNode);
const cleanCount = results.filter((r) => !r.missing && !(r.structural && r.structural.length)).length;

// ---- markdown（台北時間）----
const today = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
const reportPath = join(syncDir, "reports", `component-drift-${today}.md`);
mkdirSync(dirname(reportPath), { recursive: true });

const meta = snapshot.$metadata || {};
const L = [];
L.push(`# Figma ↔ Code Component Drift — ${name}`);
L.push("");
L.push(`> 產生：${today}（台北時間）  `);
L.push(`> Figma：${meta.fileName || "?"} (\`${meta.fileKey || "?"}\`)　Snapshot：${meta.snapshotAt || "?"}`);
L.push(`> 正本：Figma（component 軌單向 figma→code）；比對範圍＝結構（軸）。`);
L.push("");
L.push("## TL;DR");
L.push("");
L.push("| 類別 | 數量 |");
L.push("|---|---|");
L.push(`| ✅ 結構乾淨 | ${cleanCount} |`);
L.push(`| ⚠️ 結構漂移 | ${structuralComps.length} |`);
L.push(`| 🧩 缺件 | ${missingComps.length} |`);
L.push(`| 📍 figmaNode 未回填 | ${noNodeComps.length} |`);
L.push(`| 🎨 Figma hygiene（advisory） | ${hygieneComps.length} |`);
L.push("");

if (missingComps.length) {
  L.push("## 🧩 缺件");
  L.push("");
  for (const r of missingComps) L.push(`- \`${r.id}\` — ${r.note}`);
  L.push("");
}
if (structuralComps.length) {
  L.push("## ⚠️ 結構漂移（軸／option 不一致）");
  L.push("");
  for (const r of structuralComps) {
    L.push(`### \`${r.id}\`${r.figmaNode ? ` (\`${r.figmaNode}\`)` : ""}`);
    L.push("");
    for (const s of r.structural) L.push(`- ${s}`);
    L.push("");
  }
}
if (noNodeComps.length) {
  L.push("## 📍 figmaNode 未回填");
  L.push("");
  L.push("這些元件 spec / snapshot 都沒對到 Figma 節點；建好 Figma 後回填 figmaNode 才能精確定位。");
  L.push("");
  L.push(noNodeComps.map((r) => `\`${r.id}\``).join(", "));
  L.push("");
}
if (hygieneComps.length) {
  L.push("## 🎨 Figma 綁定 hygiene（advisory，不擋）");
  L.push("");
  L.push("元件在 Figma 把顏色綁到 `var(--*)` 命名變數而非語意 token，建議在 **Figma 端** rebind（用 use_figma）：");
  L.push("");
  for (const r of hygieneComps) L.push(`- \`${r.id}\`：${r.hygiene.join(", ")}`);
  L.push("");
}

L.push("## ✅ 結構乾淨");
L.push("");
L.push(results.filter((r) => !r.missing && !(r.structural && r.structural.length)).map((r) => `\`${r.id}\``).join(", ") || "（無）");
L.push("");

writeFileSync(reportPath, L.join("\n"));

console.log(`\nComponent drift → ${reportPath}`);
console.log(`  ✅ ${cleanCount} clean · ⚠️ ${structuralComps.length} drift · 🧩 ${missingComps.length} missing · 🎨 ${hygieneComps.length} hygiene\n`);
if (structuralComps.length || missingComps.length) process.exitCode = 1;
