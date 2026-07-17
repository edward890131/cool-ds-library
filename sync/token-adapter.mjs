// token-adapter.mjs（Goons DS Studio 版）
// 把 code 端 token（library/tokens.base.json ＋ projects/<name>/tokens.export.json 疊加）
// 與 Figma snapshot 都 normalize 成同一份中性 schema，供 check-token-drift.mjs diff。
//
// ⚠️ 這支是 figma-sync-setup 原版 token-adapter 的**改寫**：原版吃三份 DTCG JSON，
//    我們的 token 是 gallery :root 的 CSS 變數（--c-brand-500 …），結構不同 → normalizeCodeTokens 重寫。
//
// 三個 collection（對齊 gallery 結構、也對齊 Figma DS 實務）：
//   Primitives (mode: Value)      — L1 literal：色階/圓角/間距/字級/字重/行高/字距/陰影/容器/字體/動態
//   Theme      (modes: Light/Dark)— L2 semantic --s-*：Light=root、Dark=dark 區塊
//   Device     (modes: Desktop/Tablet/Mobile) — 只有隨斷點變的尺寸 token（fs-h1..h7 / sp-5..9 / r-lg / r-xl / container）
//
// 不納入 diff：legacy 別名層（--canvas/--ink/--i-*/--radius/--accent…）＝ code 便利層、非 Figma 變數。

// ── 中性 schema ──
// { collections:[ { name, modes:[...], variables:[ { name:"color/brand/500", type:"COLOR"|"FLOAT"|"STRING",
//   values:{ <mode>:{kind:"literal",value} | {kind:"alias",ref} } } ] } ] }

// legacy 別名前綴（跳過）
const LEGACY = new Set([
  "--canvas", "--panel", "--panel-2", "--panel-3", "--ink", "--muted", "--faint",
  "--line", "--line-strong", "--accent", "--primary-on", "--danger-on", "--radius",
]);
function isLegacy(name) {
  return LEGACY.has(name) || name.startsWith("--i-"); // --i-* intent 別名
}

// 隨裝置變的 token（Device collection 專屬；其餘尺寸留 Primitives）
// = tablet + mobile 兩區塊 override 的 key 聯集（於 buildDeviceKeySet 動態算，再併入固定容器）
function buildDeviceKeySet(base) {
  const s = new Set([...Object.keys(base.tablet || {}), ...Object.keys(base.mobile || {})]);
  s.add("--container-max");
  s.add("--container-pad");
  return s;
}

// --name → slash path（可讀、與 Figma snapshot 命名約定一致）
function toPath(name) {
  const n = name.replace(/^--/, "");
  // 明確前綴展開（可讀性）
  const rules = [
    [/^c-([a-z0-9]+)-(\d+)$/, (m) => `color/${m[1]}/${m[2]}`],
    [/^r-(.+)$/, (m) => `radius/${m[1]}`],
    [/^sp-(.+)$/, (m) => `spacing/${m[1]}`],
    [/^fs-(.+)$/, (m) => `font/size/${m[1]}`],
    [/^fw-h(\d+)$/, (m) => `font/style/h${m[1]}/weight`],
    [/^fw-(.+)$/, (m) => `font/weight/${m[1]}`],
    [/^lh-en-(.+)$/, (m) => `font/line-height/en/${m[1]}`],
    [/^lh-(.+)$/, (m) => `font/line-height/${m[1]}`],
    [/^ls-en-(.+)$/, (m) => `font/letter-spacing/en/${m[1]}`],
    [/^ls-(.+)$/, (m) => `font/letter-spacing/${m[1]}`],
    [/^e-(.+)$/, (m) => `elevation/${m[1]}`],
    [/^container-(.+)$/, (m) => `container/${m[1]}`],
    [/^font-(.+)$/, (m) => `font/family/${m[1]}`],
    [/^dur-(.+)$/, (m) => `motion/duration/${m[1]}`],
    [/^ease-(.+)$/, (m) => `motion/ease/${m[1]}`],
    [/^s-(.+)$/, (m) => `semantic/${m[1].replace(/-/g, "/")}`],
  ];
  for (const [re, fn] of rules) {
    const mm = n.match(re);
    if (mm) return fn(mm);
  }
  return n.replace(/-/g, "/"); // fallback：dash → slash
}

// 值型別判斷
function isColorLiteral(v) {
  return /^#([0-9a-f]{3,8})$/i.test(v) || v.startsWith("rgb");
}
function isNumberLike(v) {
  return /^-?[\d.]+(px|em|ms|%)?$/.test(v);
}

// rgba/rgb → hex
function rgbaToHex(v) {
  const m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (!m) return v.toLowerCase();
  const [r, g, b] = [m[1], m[2], m[3]].map((x) => parseInt(x, 10));
  const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
  const hx = (x) => x.toString(16).padStart(2, "0");
  let hex = "#" + hx(r) + hx(g) + hx(b);
  if (a < 1) hex += hx(Math.round(a * 255));
  return hex.toLowerCase();
}

// 數字：px/em/ms/% 去單位取數值（em×100=percent，對齊 Figma letterSpacing）
function toNumber(v) {
  if (v.endsWith("em")) return parseFloat(v) * 100;
  return parseFloat(v); // px / ms / % / 純數
}

// 單一 CSS 值 → 中性 value 物件
function normVal(raw) {
  const v = String(raw).trim();
  // alias：純 var(--x)
  const am = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (am) return { kind: "alias", ref: toPath(am[1]) };
  // color-mix / cubic-bezier / 多段陰影 / 字體堆疊 → 當字串 literal（Figma 難精確對應，誠實列 advisory）
  if (v.includes("color-mix(") || v.includes("cubic-bezier(") || v.includes(",") && !v.startsWith("rgb")) {
    // 多值（陰影、字體、ease）：保留原字串
    if (!/^rgba?\(/i.test(v)) return { kind: "literal", value: v.toLowerCase() };
  }
  if (isColorLiteral(v)) {
    return { kind: "literal", value: v.startsWith("rgb") ? rgbaToHex(v) : v.toLowerCase() };
  }
  if (isNumberLike(v)) return { kind: "literal", value: toNumber(v) };
  return { kind: "literal", value: v.toLowerCase() };
}

// 型別標籤（供報告顯示；diff 用 value 本身）
function typeOf(name, valObj) {
  if (valObj.kind === "alias") {
    return /color|semantic\/(surface|text|border|action|feedback|on|sec)/.test(valObj.ref) ? "COLOR" : "FLOAT";
  }
  const v = valObj.value;
  if (typeof v === "number") return "FLOAT";
  if (typeof v === "string" && isColorLiteral(v)) return "COLOR";
  return "STRING";
}

// ── code 端：base + project override → 中性 schema ──
export function normalizeCodeTokens(base, override = {}) {
  const ov = override.overrides || {};
  // 疊加：desktop override 也視為 root（桌機=root 基準）
  const root = { ...base.root, ...(ov.root || {}), ...(ov.desktop || {}) };
  const dark = { ...base.dark, ...(ov.dark || {}) };
  const tablet = { ...base.tablet, ...(ov.tablet || {}) };
  const mobile = { ...base.mobile, ...(ov.mobile || {}) };

  const deviceKeys = buildDeviceKeySet(base);

  const primitives = [];
  const themeVars = [];
  const deviceVars = [];

  for (const [name, raw] of Object.entries(root)) {
    if (isLegacy(name)) continue;
    const path = toPath(name);
    const vo = normVal(raw);

    if (name.startsWith("--s-")) {
      // Theme：Light=root、Dark=dark（dark 沒覆寫則沿用 light）
      const values = { Light: vo };
      if (dark[name] !== undefined) values.Dark = normVal(dark[name]);
      themeVars.push({ name: path, type: typeOf(name, vo), values });
    } else if (deviceKeys.has(name)) {
      // Device：Desktop=root、Tablet/Mobile 有覆寫才填、否則沿用 Desktop
      const values = { Desktop: vo };
      if (tablet[name] !== undefined) values.Tablet = normVal(tablet[name]);
      if (mobile[name] !== undefined) values.Mobile = normVal(mobile[name]);
      deviceVars.push({ name: path, type: typeOf(name, vo), values });
    } else {
      primitives.push({ name: path, type: typeOf(name, vo), values: { Value: vo } });
    }
  }

  // dark 區塊裡有、但 root 沒有的 --s-*（理論上不會，保險處理）
  for (const [name, raw] of Object.entries(dark)) {
    if (!name.startsWith("--s-") || root[name] !== undefined) continue;
    const vo = normVal(raw);
    themeVars.push({ name: toPath(name), type: typeOf(name, vo), values: { Dark: vo } });
  }

  return {
    collections: [
      { name: "Primitives", modes: ["Value"], variables: primitives },
      { name: "Theme", modes: ["Light", "Dark"], variables: themeVars },
      { name: "Device", modes: ["Desktop", "Tablet", "Mobile"], variables: deviceVars },
    ],
  };
}

// ── Figma snapshot → 中性 schema ──
// snapshot.collections[].variables[].values[mode] = "#hex" | 數字 | "→ some/path"（alias）
export function normalizeFigmaSnapshot(snapshotJson) {
  return {
    collections: (snapshotJson.collections || []).map((c) => ({
      name: c.name,
      modes: c.modes,
      variables: (c.variables || []).map((v) => {
        const values = {};
        for (const [mode, raw] of Object.entries(v.values)) {
          if (typeof raw === "string" && raw.startsWith("→ ")) {
            values[mode] = { kind: "alias", ref: raw.slice(2).trim() };
          } else if (typeof raw === "string") {
            values[mode] = { kind: "literal", value: raw.toLowerCase() };
          } else {
            values[mode] = { kind: "literal", value: raw };
          }
        }
        return { name: v.name, type: v.type, values };
      }),
    })),
  };
}
