---
name: visual-to-figma-ds
description: Rebuild an external visual reference (Claude Design output / Figma Make output / a screenshot) into a Figma file that ALREADY has DS component sets. Enforces a 4-phase protocol — (0) if upstream is Claude Design, prepare a balanced CD prompt + retrieve handoff bundle → (1) persist ref to disk → (2) propose component mapping → (3) end-of-build audit. Output uses real component instances + 100% token binding instead of hand-built lookalikes. Triggers when user asks to rebuild a visual into an existing DS-bearing Figma file (e.g. "把這張 Claude Design 截圖照著 DS 重建到 X 檔", "rebuild this screenshot into our Figma DS file", "CD 出貨的設計幫我接到 Figma DS"). Does NOT apply to first-time DS construction, in-place section edits, or wireframe-only files.
---

# Visual → Figma + DS rebuild

## When to trigger

User wants you to recreate an external visual (Claude Design output / screenshot / Figma Make export / pasted image) into a Figma file that already has at least one component set and design tokens. Typical phrasings:
- "套用這個檔案內的 DS 把這張圖重建一份"
- "rebuild this Claude Design screen into our Figma DS file"
- "把 prototype 截圖照 DS 元件重做"
- "CD 給的設計幫我用 DS 元件接到 Figma"

**Do not trigger for**:
- Building the DS / component library itself for the first time (no instances yet to use)
- Editing one specific section of an existing page in place
- Files without component sets / wireframe-only files
- DS architecture / spec / planning work
- Tasks where the user explicitly wants CD's visual creativity preserved at any cost (this protocol trades some creativity for reconnectability)

---

## The protocol — 4 phases

Phase 0 only fires if Claude Design is the upstream source. Phases 1–3 always fire. Skipping any active phase has historically produced unmaintainable lookalikes or token-rename-only output.

---

### Phase 0 — Upstream prep (only if Claude Design is in the loop)

Empirically validated on Cathay Futures 2026-05-15 → 2026-05-18 across 4 handoff rounds: **three variables jointly determine whether CD's output is reconnectable** — input format, prompt phrasing, and task framing. Get all three right before CD generates.

**Variable 1 — Input format**: feed CD the DS as a **clean local folder** (CD's "Drag a folder here" option).

- Build a staging folder under user's Desktop (drag-friendly) containing ONLY the DS spec:
  - `tokens/` (DTCG JSON, primitives + semantic)
  - `components/` (per-component README with variant matrix + Figma node IDs)
  - `docs/` and top-level `README.md`
- **EXCLUDE**: any `web/` or `src/` directory containing earlier React rebuilds, demo pages, sample sections.jsx — CD treats them as DS extension and will re-learn divergent variants (e.g. `<Button variant="outline">` even when DS doesn't have outline).
- **EXCLUDE**: `ref/` (CD's own past outputs), `.git/`, `.env*`, `tools/`.
- If user's repo is private and they want to use "Link code on GitHub" instead, repo must be public OR rely on OAuth — folder drag is the easier path.

**Variable 2 — Prompt phrasing (the balanced prompt template)**:

The single most discriminating variable. Strict "only use DS, no inventions" kills CD's design value; pure-freedom invites silent gaps. The balanced template asks CD to invent freely BUT self-flag:

```
請用 <ds-name> skill 從零生成 <screen-name> 頁面 (<viewport>).

【DS 使用原則】
- 元件預設使用 DS spec 內列出的 variants
  (例: Button 只有 Primary / Text / TextGreen / Icon 四種 type、無 Size 維度)
- 你**可以**為了視覺需要引入 DS 沒列的元素
  (例如某按鈕需要 size 變大、某按鈕需要在深色底上)
- 但每個 DS 沒列的新變體，請在 components-<brand>.jsx 開頭的註解區明確列出：
  - 新變體名稱
  - 為什麼必要
  - 建議補入 DS 的哪一層
- 元件命名跟 DS spec 對齊
  (不要把 Type=Primary 改名成 main 或 contained)
- 透過 instance-level 加 padding / inline style 解決尺寸變化，
  不要為了 size 變化發明 btn-lg / btn-sm 等新 class

【WF + 風格】
<page-specific 內容>
```

This template forces CD to:
1. Use DS variants as default vocabulary
2. Invent only when visually necessary
3. Surface every invention in a top-of-file comment block with rationale + suggested DS extension
4. Prefer inline style over new class invention for size/state variations

**Variable 3 — Task framing**: ask CD to generate from scratch.

| Task framing | Outcome | Reconnectability |
|---|---|---|
| "從零用 DS 生成 <screen>" | CD respects spec, self-flags new variants | ✅ High |
| "把這個既有設計套上 DS" | CD does token rename, keeps original structure with all its gaps | ❌ Low — gaps inherit silently |

If the user only has an existing CD design and wants it "套上 DS", **tell them to ask CD to regenerate from scratch instead**. Token-rename mode is a trap.

**Retrieving the handoff bundle**:

CD's handoff URL (`https://api.anthropic.com/v1/design/h/<id>`) returns a gzip-compressed tar. Fetch + extract:

```bash
# Fetch via WebFetch tool (URL responds with application/gzip binary)
# The bundle path is saved as a side effect to tool-results/

# Extract:
gunzip -c bundle.gz > bundle.tar
tar -xf bundle.tar
# Top-level folder is the project name; inside is README.md + chats/ + project/
```

Bundle structure (typical):
```
<project-name>/
├── README.md          # CD's own instructions to "coding agents"
├── chats/chat1.md     # full user ↔ CD transcript
└── project/
    ├── components-<brand>.jsx   # ← READ THIS FIRST. Top comment lists DS gaps.
    ├── sections.jsx              # page-level composition
    ├── *.css                     # styles
    └── ...
```

---

### Phase 0.5 — Source Binding Pledge (HARD)

**Empirically validated on JoiiNi F-flow trial 2 / Path B (2026-05-20)**: when Trial 1 left this implicit, CC made 6 越權 decisions (brand color / typography naming / 文案 / icon / layout / variant axis) that produced a "rebuild" with zero visual resemblance to CD output. After making this explicit + audit, Path B reached 79 DS instances / 100% text bind / 0 inline DS-able frames on first pass.

**The pledge**: before any build call fires, CC declares — **CD output is source of truth, not inspiration material.** Specific decision ownership:

| Decision type | Ownership | CC may NOT |
|---|---|---|
| Brand color (primary / hot / etc) | Inferred from CD output (CSS vars, token files, computed from screenshots) | Self-judge from brand keyword or Ref |
| Typography class naming | CD's existing class set (e.g., `t-h1` / `t-body-lg`) | Invent own H1-H8 scheme |
| Copy content (titles / labels / placeholders) | CD's inline string in jsx / data file | Self-write |
| Icon choice | CD's lucide / inline SVG library | Use emoji or color-block placeholder |
| Layout structure (section order, grid breakdown) | CD's jsx tree | Reorganize |
| Component variant selection | CD's `<X variant="...">` calls | Cross-pollinate trial-1-era variant axes |
| Visual details (radius, shadow, spacing values) | CD's CSS var values | Self-decide |

**Audit trigger**: every decision in the rebuild script must be traceable to a CD source location (file + line / token path / variant prop). If CC cannot point to source, that decision is a violation and must be revised.

**Anti-pattern signals** (catch these in self-review):
- "I'll use `space/4` here because that looks right" → must check CD CSS value, find matching token
- "The CD title looks like H4 — close enough" → must use CD's exact `t-h4` class binding to DS text style
- "DS doesn't have this color exactly, I'll use a similar one" → flag as DSGAP, don't substitute
- "The grid in CD has 4 cols but my Figma wrap looks fine with flex" → must match exact structure (2 rows × 4 cols explicit)

**This pledge is HARD** — the goal of this skill is reconnectability, which requires byte-level source binding for the determinate decisions. Creative variance happens upstream (CD) or downstream (designer review), never in CC's rebuild step.

---

### Phase 1 — Persist the visual reference to disk

Conversation context dies on session resume; only disk survives.

**Steps**:
1. Save user-provided reference to:
   ```
   <project root>/ref/<source>/<screen-name>/
   ```
   - If raw screenshot: `screenshot-full.png` (+ any section close-ups)
   - If CD handoff: extract the entire bundle into this folder so the whole `project/` subtree is preserved
2. Write `source.md` in the same folder:
   ```markdown
   # Source — <screen> reference
   - Date received: YYYY-MM-DD
   - Origin: <Claude Design URL / screenshot path / Figma Make>
   - CD handoff URL (if any): <api.anthropic.com/v1/design/h/...>
   - Used for: <target Figma file key + page + position>
   - Decisions in scope:
     - A. <new build vs replace>
     - B. <how to handle DS gaps — flag / approximate / request extension>
     - C. <placeholders for missing imagery>
   ```
3. Confirm with user that the file is on disk and decisions are captured before moving on.

---

### Phase 2 — Component mapping table, user-confirmed

**Steps**:

1. List the file's component sets via Plugin API (set name, set id, variant property keys, value ranges):
   ```js
   const compsPage = figma.root.children.find(p => p.name.includes("Components"));
   await compsPage.loadAsync();
   const sets = [];
   function walk(n) {
     if (n.type === "COMPONENT_SET") sets.push(n);
     if ("children" in n && n.type !== "COMPONENT_SET") for (const c of n.children) walk(c);
   }
   for (const c of compsPage.children) walk(c);
   ```
2. List local variables + text styles:
   ```js
   const vars = await figma.variables.getLocalVariablesAsync();
   const styles = await figma.getLocalTextStylesAsync();
   ```
3. **If Phase 0 fired** and CD's bundle has a `components-*.jsx`, READ the top comment block first. CD self-flags new variants and recommends DS extensions — this is 50–70% of the mapping pre-done. For each item:
   - Cross-check against your component set list. Verify CD's claim that the variant doesn't exist.
   - Decide: (a) hand-build with `-DSGAP` suffix, (b) approximate with closest existing variant + `-APPROX-<reason>` suffix, (c) request DS extension before building (flag back to user).
4. Build the mapping table:
   | Section / Element | Component + variant | Notes |
   |---|---|---|
   | Header "立即開戶" CTA | `Button` `Type=Primary, State=Default` | |
   | Header "登入" | DS gap — Button has no Outline type | hand-build, flag `-DSGAP` |
   | Reports pill tabs | `TabItem` `State=Active/Default, Size=Desktop` | approximation: DS only has underline; flag `-APPROX-pill` |
   | Hero illustration | placeholder | imagery not in DS, decision C |
5. Present the table to user. Ask 2–4 specific decision questions for ambiguous mappings (e.g. "pill tabs use TabItem approximation, or hand-build flagged as DS gap?").
6. Do NOT start building until user confirms.

---

### Phase 3 — Build, then audit before marking done

Build in batches of ~3–5 sections per `use_figma` call (stays under the 50,000-char code limit). Use real component instances per the agreed mapping; only hand-build DS gaps.

**DS-instance-required rule (HARD)**:

If a DS component set exists that matches a frame's structure + visual purpose, the frame MUST be a DS instance — even if inline-styling is faster.

Validated on Path B (2026-05-20): initial Stage 4 build had **64 inline frames that should have been DS instances** (Badge × 41, Button × 3, etc) — caught by reverse audit, fixed by replacing inline → instance. Pattern: when CC builds in `for` loop with small reusable frames (badges, pills, type labels), it's tempting to inline-style them. Always reach for the DS instance first.

Concrete check per frame: "Is there a DS component set whose any variant would produce this same visual?" If yes, use instance. If no, that's a DSGAP — name accordingly.

**Naming rule for audit visibility**:
- Hand-built DS-gap frames: name ends with `-DSGAP` (e.g., `btn-outline-DSGAP`, `nav-item-DSGAP`)
- Approximations: name ends with `-APPROX-<reason>` (e.g., `pill-tabs-APPROX-TabItem`)

**Reusable helper template** (top of each batch's `use_figma` call):

```js
// --- Lookups ---
const page = await figma.getNodeByIdAsync(PAGE_ID);
const allVars = await figma.variables.getLocalVariablesAsync();
const allStyles = await figma.getLocalTextStylesAsync();
const V = (n) => allVars.find(v => v.name === n);
const S = (n) => allStyles.find(s => s.name === n);

// --- Fonts (load up front; rollback occurs on any throw) ---
await figma.loadFontAsync({ family: "Noto Sans TC", style: "Regular" });
// ...load all needed weights/styles

// --- Token-bound paint + radius ---
function fillVar(name, opacity = 1) {
  const v = V(name);
  if (!v) throw new Error(`Variable missing: ${name}`);
  return figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity }, "color", v);
}
function bindRadius(node, name) {
  const v = V(name); if (!v) return;
  node.setBoundVariable("topLeftRadius", v);
  node.setBoundVariable("topRightRadius", v);
  node.setBoundVariable("bottomLeftRadius", v);
  node.setBoundVariable("bottomRightRadius", v);
}

// --- Spacing token map (build at top of script after allVars is loaded) ---
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collMap = new Map(collections.map(c => [c.id, c.defaultModeId]));
const spaceTokens = {}; // "space/6" → { variable, value }
for (const v of allVars) {
  if (!v.name.startsWith("space/")) continue;
  const val = v.valuesByMode[collMap.get(v.variableCollectionId)];
  if (typeof val === "number") spaceTokens[v.name] = { variable: v, value: val };
}

// --- Spacing binding helper (accepts either "space/<name>" or number) ---
function bindSpace(node, prop, val) {
  if (typeof val === "string" && val.startsWith("space/")) {
    const t = spaceTokens[val];
    if (!t) throw new Error(`Space token missing: ${val}`);
    node[prop] = t.value;
    node.setBoundVariable(prop, t.variable);
  } else if (typeof val === "number") {
    node[prop] = val; // raw — audit will flag if > 0
  }
}

// --- Frame factory ---
function F(name, o = {}) {
  const f = figma.createFrame(); f.name = name;
  if (o.layoutMode) f.layoutMode = o.layoutMode;
  // Pair sizing modes by default — primAxis without cntAxis was a real bug source
  // (default cntAxis=FIXED + default width=100 → clipped 4-char Chinese titles)
  if (o.primAxis) f.primaryAxisSizingMode = o.primAxis;
  if (o.cntAxis !== undefined) f.counterAxisSizingMode = o.cntAxis;
  else if (o.primAxis) f.counterAxisSizingMode = o.primAxis; // mirror as safe default
  if (o.alignItems) f.counterAxisAlignItems = o.alignItems;
  if (o.justify) f.primaryAxisAlignItems = o.justify;
  // Spacing — prefer "space/<name>" strings; numbers stay raw (audit catches)
  if (o.gap != null) bindSpace(f, "itemSpacing", o.gap);
  if (o.pt != null) bindSpace(f, "paddingTop", o.pt);
  if (o.pb != null) bindSpace(f, "paddingBottom", o.pb);
  if (o.pl != null) bindSpace(f, "paddingLeft", o.pl);
  if (o.pr != null) bindSpace(f, "paddingRight", o.pr);
  if (o.p != null) for (const s of ["paddingTop","paddingBottom","paddingLeft","paddingRight"]) bindSpace(f, s, o.p);
  if (o.fill) f.fills = [o.fill];
  if (o.noFill) f.fills = [];
  if (o.stroke) { f.strokes = [o.stroke]; f.strokeWeight = o.strokeW ?? 1; }
  if (o.size) f.resizeWithoutConstraints(o.size[0], o.size[1]); // NEVER plain resize after AUTO
  if (o.radius) bindRadius(f, o.radius); // NEVER bind cornerRadius; bind 4 corners
  return f;
}

// --- Text factory (always binds to a Text Style) ---
async function T(name, text, styleName, o = {}) {
  const t = figma.createText(); t.name = name || text.slice(0, 24);
  t.characters = text;
  const st = S(styleName);
  if (!st) throw new Error(`Text style missing: ${styleName}`);
  await t.setTextStyleIdAsync(st.id);
  if (o.fillVar) t.fills = [fillVar(o.fillVar)];
  if (o.width) { t.textAutoResize = "HEIGHT"; t.resizeWithoutConstraints(o.width, t.height); }
  if (o.align) t.textAlignHorizontal = o.align;
  return t;
}

// --- Instance factories ---
function findFirstText(n) {
  if (n.type === "TEXT") return n;
  if ("children" in n) for (const c of n.children) {
    const r = findFirstText(c); if (r) return r;
  }
  return null;
}
async function overrideText(inst, newText) {
  const t = findFirstText(inst); if (!t) return;
  try { await figma.loadFontAsync(t.fontName); } catch {}
  t.characters = newText;
}
async function instButton(label, type, state = "Default") {
  const set = await figma.getNodeByIdAsync(BUTTON_SET_ID);
  const v = set.children.find(x => x.name === `Type=${type}, State=${state}`);
  if (!v) throw new Error(`Button variant missing: Type=${type}, State=${state}`);
  const inst = v.createInstance();
  await overrideText(inst, label);
  return inst;
}
// Mirror this pattern for Tag / TabItem / BreadcrumbItem / Searchbar / PaginatorLink
```

**Plugin runtime gotchas**:
- The plugin runtime **rolls back ALL writes** on any throw → put risky/diagnostic calls inside `try/catch` or strictly AFTER the build is committed.
- `figma.setPluginData` unavailable in MCP runtime → use `figma.setSharedPluginData(namespace, key, value)` with a stable namespace ≥3 chars.
- `node.cornerRadius` + `setBoundVariable("cornerRadius", v)` silently fail → bind 4 corners separately.
- After `primaryAxisSizingMode = "AUTO"`, use `resizeWithoutConstraints(w, h)`.
- Instance text override: `await figma.loadFontAsync(text.fontName)` BEFORE `text.characters = ...`. Handle MIXED via `getRangeFontName(0, len)`.
- **Auto-layout sizing mode pairing**: setting `primAxis="AUTO"` without `cntAxis` leaves cntAxis at its default `FIXED` + default width `100px` → 4+ char Chinese titles get clipped to 2-3 chars (e.g., "資訊管道與連結" → "管道與"). Always pair both axes, or rely on the F() helper's auto-mirror.
- **Spacing tokens are bound differently**: `setBoundVariable("paddingTop", v)` requires the prop's value already match the variable's resolved value. Set `node.paddingTop = tokenVal` FIRST, then bind. Same for `itemSpacing`.

**End-of-build audit script**:

```js
const root = await figma.getNodeByIdAsync(PATH_ROOT_ID);
let frames=0, text=0, inst=0, vec=0;
let txtBound=0, txtUnbound=0, fillBound=0, fillRaw=0, rBound=0, rRaw=0, rNone=0;
let padBound=0, padRaw=0, gapBound=0, gapRaw=0;
const sizingMismatches = []; // primAxis=AUTO + cntAxis=FIXED + small width → clip risk
const instByMaster = {}, dsGapNodes = [];

function walk(n) {
  if (n.type === "FRAME") {
    frames++;
    if (n.name && (n.name.includes("DSGAP") || n.name.includes("APPROX"))) {
      dsGapNodes.push({ name: n.name, type: n.name.includes("APPROX") ? "approximation" : "gap" });
    }
    for (const f of (n.fills || [])) {
      if (f.type === "SOLID") {
        if (f.boundVariables && f.boundVariables.color) fillBound++; else fillRaw++;
      }
    }
    if (typeof n.topLeftRadius === "number" && n.topLeftRadius > 0) {
      const bv = n.boundVariables || {};
      if (bv.topLeftRadius) rBound++; else rRaw++;
    } else { rNone++; }
    // Spacing binding (padding + itemSpacing)
    const bv = n.boundVariables || {};
    for (const p of ["paddingTop","paddingBottom","paddingLeft","paddingRight"]) {
      const v = n[p];
      if (typeof v === "number" && v > 0) { if (bv[p]) padBound++; else padRaw++; }
    }
    if (typeof n.itemSpacing === "number" && n.itemSpacing > 0) {
      if (bv.itemSpacing) gapBound++; else gapRaw++;
    }
    // Sizing mode consistency check
    if ((n.layoutMode === "VERTICAL" || n.layoutMode === "HORIZONTAL")
        && n.primaryAxisSizingMode === "AUTO" && n.counterAxisSizingMode === "FIXED") {
      const isV = n.layoutMode === "VERTICAL";
      const cwNow = isV ? n.width : n.height;
      const pad = isV ? (n.paddingLeft||0)+(n.paddingRight||0) : (n.paddingTop||0)+(n.paddingBottom||0);
      const maxChild = n.children.reduce((m, c) => Math.max(m, isV ? c.width : c.height), 0);
      if (maxChild + pad > cwNow - 1 && cwNow <= 200) {
        sizingMismatches.push(`${n.name} (w=${Math.round(cwNow)}, req≈${Math.round(maxChild+pad)})`);
      }
    }
  } else if (n.type === "TEXT") {
    text++;
    if (n.textStyleId) txtBound++; else txtUnbound++;
  } else if (n.type === "INSTANCE") {
    inst++;
    try {
      const set = n.mainComponent && n.mainComponent.parent;
      const key = (set && set.type === "COMPONENT_SET") ? set.name : (n.mainComponent && n.mainComponent.name) || "?";
      instByMaster[key] = (instByMaster[key] || 0) + 1;
    } catch {}
  } else if (["VECTOR","LINE","ELLIPSE","RECTANGLE"].includes(n.type)) {
    vec++;
  }
  if ("children" in n) for (const c of n.children) walk(c);
}
walk(root);
```

Render result as a table. **Done = all seven green**:
- Instance count > 0 for every component type the agreed mapping required
- Text-style binding rate = 100%
- Fill binding rate (on non-empty solids) = 100%
- Radius binding rate (on non-zero radius) = 100%
- **Spacing binding rate ≥ 90%** — padding + itemSpacing bound to `space/*`. Allow page-chrome values (e.g., 60px page gutter) to stay raw if they're not in DS scale.
- **Sizing-mode consistency = 0 mismatches** — no auto-layout frame should have `primAxis=AUTO + cntAxis=FIXED` with content overflowing (this is the Chinese-title-truncation pattern).
- **DS-instance-required = 0 violations** — walk the rebuild, for each inline frame check if a DS component set has a variant matching its structure + visual purpose. Any inline-styled frame that should be a DS instance is a violation. Common offenders: pill-shaped labels (should be Badge instance), small buttons (should be Button instance), card-like layouts (should be Card or page-composite). Catches the Path B Stage 4 mistake where 64 inline frames slipped past the first audit.

DS gap / approximation list goes to user as actionable backlog (often becomes input for the DS team's next sprint). **If Phase 0 fired**, this list should match (or be a subset of) CD's self-flag block. Discrepancies indicate CD's invention slipped past the balanced-prompt guard — surface as audit finding.

---

## Worked example summary (Cathay Futures, 2026-05-15 → 2026-05-18)

Four CD handoff rounds proved each Phase 0 variable's effect:

| Round | CD input | CD task framing | Prompt style | Silent DS gaps in CD output | Inline hex in JSX |
|---|---|---|---|---|---|
| 1 | DS Fingerprint JPGs | from-scratch about-us | unconstrained | ~6 (outline, sizes, pill tabs, dropdown trigger…) | many |
| 2 | DS codebase folder | from-scratch homepage | unconstrained | 1 (`btn-outline` in modal) | low |
| 3 | DS codebase folder + existing JPG-fed about-us | apply DS to existing | unconstrained | 9 (kept all original invented variants, only renamed CSS vars) | 23+ |
| **4** | **DS codebase folder** | **from-scratch about-us** | **balanced prompt** | **0 silent / 7 self-flagged with rationale** | **1** |

Round 4 = all three Phase 0 variables tuned correctly. Result: zero silent inventions, every DS gap pre-documented by CD with rationale + suggested DS extension. Phase 2 mapping work reduced ~60–70%.

Figma instance audit (one earlier non-CD round for baseline):
| Metric | Path B (no protocol) | Path C (this skill, on Round 1 CD output) |
|---|---|---|
| Instances | 0 | 64 (Button 29 / Tag 16 / PaginatorLink 9 / TabItem 6 / BreadcrumbItem 3 / Searchbar 1) |
| Text-style binding | 85% | 100% (284/284) |
| Fill binding | 76% | 100% (95/95) |
| Radius binding | 89% | 100% (82/82) |
| DS gaps surfaced | none | 4 actionable + 1 approximation |

**Late discovery (Path E retro-audit, 2026-05-19)** — previous "100% binding" claim was incomplete because the audit only counted color/text/radius. Once spacing binding + sizing-mode consistency were added:
- Spacing binding was **0%** across Path C/D/E because the original F() helper set `paddingTop` / `itemSpacing` to raw numbers without ever calling `setBoundVariable`. After patch: ~94% (only legitimate page-chrome 60px stays raw).
- **29 frames** in Path E had `primAxis=AUTO + cntAxis=FIXED` at default 100px width, causing Chinese section titles to clip ("資訊管道與連結" → "管道與"). Root cause: `sectionHead()` helper in Batches 2/3 set primAxis but not cntAxis. F() now auto-mirrors and audit catches the pattern.

Lesson encoded in the updated helper + audit: counting bindings in 3 dimensions while missing 2 is silently wrong. Always include spacing + sizing-mode consistency in the audit.

---

## After the build

- Report to user: audit table + DS gap list + screenshot of result.
- Suggest (do not auto-create) follow-up tasks if gaps look substantial: "Button Outline variant needed for 8 occurrences across the page — open a DS-gap task?"
- If user later adds Code Connect mappings for the components used, the same Path C deliverable can become input for a downstream code prototype generation pass — that flow is OUT OF SCOPE for this skill and should be a separate skill if built.
