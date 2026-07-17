#!/usr/bin/env node
// build-component-spec.mjs（Goons DS Studio 專屬 —— 原版沒有這支）
// 從 library/component-registry.json 自動生成 code 端元件指紋 component-spec.json。
//
// 為什麼：原版 figma-sync-setup 要人「手填」每顆元件的 variants/states，易漏易錯。
// 我們 library-first，registry 已是 canonical 軸真相 → 直接自動生，永遠跟 library 同步。
//
// 用法：
//   node sync/build-component-spec.mjs <name> [--only=button,input,tag]
//   （--only 限縮納管元件；不給＝全部 selected；都沒有＝全 registry）
//   優先讀 projects/<name>/components.export.json 的 selected（＝該專案實際選用元件）。
//
// 產出：projects/<name>/sync/component-spec.json
//   { components: { <id>: { l0Ref, status, axes:{variant:[...],intent:[...],state:[...],size:[...]} } } }
//   對應 figma-component-snapshot.json（Figma 端真相），用 check-component-drift.mjs 比對。

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const name = process.argv[2];
if (!name) {
  console.error("用法：node sync/build-component-spec.mjs <專案名> [--only=button,input]");
  process.exit(2);
}
const onlyArg = (process.argv.find((a) => a.startsWith("--only=")) || "").replace("--only=", "");
const onlyList = onlyArg ? onlyArg.split(",").map((s) => s.trim()).filter(Boolean) : null;

const projDir = join(ROOT, "projects", name);
const syncDir = join(projDir, "sync");

const registry = JSON.parse(readFileSync(join(ROOT, "library/component-registry.json"), "utf8"));

// 攤平 registry：id → item（含 subComponents）
const catalog = new Map();
for (const g of registry.groups || [])
  for (const it of g.items || []) catalog.set(it.id, it);
for (const [id, sub] of Object.entries(registry.subComponents || {}))
  catalog.set(id, { id, name: sub.name, status: "ready", axes: sub.axes, partOf: sub.partOf });

// 決定納管清單：--only > components.export.json selected > 全部
let ids;
if (onlyList) {
  ids = onlyList;
} else {
  const exPath = join(projDir, "components.export.json");
  if (existsSync(exPath)) {
    const ex = JSON.parse(readFileSync(exPath, "utf8"));
    ids = ex.selected || [];
  } else {
    ids = [...catalog.keys()];
  }
}

// registry item.axes → spec axes（{axis:[values]}）
function axesOf(item) {
  if (!item.axes || !item.axes.by) return {};
  const out = {};
  for (const axis of item.axes.order || Object.keys(item.axes.by)) {
    const a = item.axes.by[axis];
    if (a && a.options) out[axis] = a.options.map((o) => o.value);
  }
  return out;
}

const components = {};
const missing = [];
for (const id of ids) {
  const item = catalog.get(id);
  if (!item) { missing.push(id); continue; }
  components[id] = {
    figmaNode: "",                       // 建好 Figma 後回填（供 snapshot 拉取定位）
    l0Ref: item.l0Ref || null,
    status: item.status || "ready",
    partOf: item.partOf || undefined,
    axes: axesOf(item),                  // {} = 無軸元件（如 logo/icon）→ 結構比對略過
  };
}

const spec = {
  $meta: {
    title: `Component Spec（code 端指紋，自動生自 registry）— ${name}`,
    source: "library/component-registry.json",
    generated: "run: node sync/build-component-spec.mjs " + name,
    note: "軸（variant/intent/state/size）＝ registry canonical 真相，對應 Figma variant/boolean property（鐵則 3）。figmaNode 建好 Figma 後回填。radius/color/hardcoded 指紋屬 code 側樣式細節，gallery 單檔未拆出 → 本階段只比結構（軸）；樣式指紋列為未來延伸。",
    scope: onlyList ? `--only=${onlyList.join(",")}` : (existsSync(join(projDir, "components.export.json")) ? "components.export.json selected" : "full registry"),
  },
  components,
};

mkdirSync(syncDir, { recursive: true });
const outPath = join(syncDir, "component-spec.json");
writeFileSync(outPath, JSON.stringify(spec, null, 2) + "\n");

console.log(`\ncomponent-spec.json → ${outPath}`);
console.log(`  納管 ${Object.keys(components).length} 顆` + (missing.length ? `　⚠️ registry 查無：${missing.join(", ")}` : ""));
console.log("");
