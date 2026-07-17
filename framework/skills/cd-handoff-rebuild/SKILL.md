---
name: cd-handoff-rebuild
description: Run the full validated workflow from Claude Design handoff bundle to source-fidelity Figma rebuild. Handles 5 stages + 2 gates — (1) fetch + extract handoff, [Gate 1] L4 required-states coverage audit, (2) gap analysis vs existing DS framework, (3) backfill across 3 layers (built-ds code + L0/L4 patch + Figma components), (4) page rebuild with strict source-binding, (5) reverse audit + visual iteration loop with [Gate 4.5] DS-instance-required HARD. Enforces Path B trial 2 validated protocol (Phase 0.5 source-binding pledge + Gate 1 L4 alignment + Gate 4.5 DS-instance-required). Triggers when user has both (a) CD handoff URL/bundle AND (b) existing Figma DS file (possibly incomplete), and wants full reconnectable rebuild with cross-iteration visual fix loop. NOT for one-off page rebuilds (`visual-to-figma-ds`) or framework governance only (`ds-architecture-flow`).
---

# CD handoff → Figma rebuild (full workflow)

## When to trigger

User has all three:
1. **Claude Design handoff URL or extracted bundle** (the `api.anthropic.com/v1/design/h/<id>` URL or already-fetched `bundle.tar` / `project/` folder)
2. **Existing Figma file with DS file key** (may be incomplete — this skill handles backfill)
3. **Intent to fully rebuild** the CD output into Figma with reconnectability (source-binding, full DS instance application, visual fidelity to CD)

Typical phrasings:
- "把 CD handoff 跑完整流程到 Figma DS"
- "走 Path B 流程接這個 CD bundle"
- "從 CD 出貨到 Figma，要 source-binding 嚴守不要重蹈 Trial 1 覆轍"

**Do NOT trigger for**:
- 單頁快速 rebuild、DS 已完整 → use `/visual-to-figma-ds`
- 純 framework governance / L0+L4 trial 跑 Gates → use `/ds-architecture-flow`
- 沒有 existing Figma DS file（要從零建 DS 用別的 skill）
- CD output 不完整、缺 jsx/css/tokens → 應先回 CD 端補

---

## v0.7 — Path 2 alignment with ds-architecture-flow v0.6

**Empirically determined missing in v0.6 ship (2026-06-16)** — Path 2 沿用很多 v0.6 改動但時機/規則不同。以下是兩 path 對齊參考。

### v0.6 改動在 Path 2 怎麼讀

| v0.6 規則 | Path 1 | **Path 2(本 skill)** |
|---|---|---|
| Phase 0.8 scope inventory | CC build 前自動跑 | **跑兩次**:(a) Stage 0 打包前先 surface 給 CD 參考 + (b) Stage 2 接回後再跑、reconcile CD 產出與 spec 差異 |
| Build-time token binding HARD | CC 自建、Variable-first 三步、不接受 patch | **CD 是 black box、必然 patch**;Stage 3 backfill 接受「先收 CD 產出 + 一輪 binding remediation」、但 remediation 必須**全綁完才能進 Stage 4**(等同 v0.6 HARD 結果、只是時機後) |
| Nested INSTANCE_SWAP HARD | Step 4 build 時強制 | Stage 5 audit catch + Stage 5.3 visual iteration loop remediate(已是現有 Gate 4.5 該做的、v0.7 同步擴大到 L0 composition 宣告的所有 nested) |
| Page = 4(Cover/Foundations/Components/Masters)| Step 4 寫死 | **Stage 3 backfill 時 reformat**:CD 給的 Figma 多頁結構需在 backfill 結束時收斂成 4 頁(把 master sets 收進 Masters 頁) |
| SECTION 往右排列 | Step 4 寫死 | Stage 3 reformat 套用 |
| spec-callout 拿掉 | Step 4 寫死 | Stage 3/4 不加 spec-callout |
| Icon library(Untitled UI) | INSTANCE_SWAP 到 library | **Stage 3 swap**:CD 自帶 icon set(可能 lucide / 內建)→ 換成 INSTANCE_SWAP 到 Untitled UI library(file-key: hnySloSFGa5ju356tbr5C4) |
| L0 composition / default-expansion | Step 3/4 套用 | Stage 2 gap analysis 加 L0 composition 比對、Stage 5 audit 14 項套用 |

### 新增 Stage 0 — Pre-pack scope inventory(Path 2 專用、Phase 0.8 第一次)

在打包給 CD 之前、跑 ds-architecture-flow 的 Phase 0.8 一次:
- 從 Q2 spec 篩 L0 元件 subset
- 列出 composition / default-expansion / 預估 variants 數量
- 設計師 confirm 後寫進 `cd-pack/scope-inventory.md`
- 跟 CD pack 一起送出(讓 CD 知道目標 scope)

CD 端如何使用 scope-inventory.md 不歸我們管;但回來時可以對照差異。

### Build-time binding 在 Path 2 的例外(明文)

```
v0.6 SKILL.md Step 4 寫:「audit FAIL 不接受 patch、必須 rebuild 該 frame」
→ 那條規則對 CC 自建(Path 1)有效。

Path 2 接回 CD 黑盒、必然會撞到 hex / inline fontSize。
本 skill Stage 3 接受「**一輪 binding remediation**」、但:
  1. Stage 3 結束時 binding 必 100%(等同 v0.6 結果)
  2. Stage 5 audit 第 10 項 仍 HARD(re-audit pass 才結束)
  3. 「patch 修正」紀錄寫進 ITERATION report 的 drift 區塊(讓 framework 反饋怎麼跟 CD 端溝通)
```

### Nested INSTANCE_SWAP 在 Path 2 的範圍

```
v0.6 L0 composition 宣告的所有 nested 要 INSTANCE_SWAP:
  - alert 內 icon-button(dismiss)+ button(CTA)
  - notification 內 icon-button(close)
  - calendar 內 calendar-day × 42 + button(prev/next)
  - pagination 內 icon-button × 2 + button(numbered)
  - tab 內 tab-item × N
  - steps 內 step-item × N
  - 所有 icon → Untitled UI library

CD 對這些通常用 inline frame、本 skill Stage 5 audit 全部 catch、Stage 5.3 visual iteration 修正。
```

### Phase 0.8 兩段時機

```
(a) Stage 0(本 skill 新加、打包前)
    - 在 ds-architecture-flow Phase 0.7 brand 一致性後、打包給 CD 前
    - 從 Q2 spec + L0 篩 subset、設計師 confirm
    - 寫進 cd-pack/scope-inventory.md、跟 CD pack 一起送

(b) Stage 2 後(本 skill 第二次跑)
    - 收回 CD bundle、Stage 1 fetch 完成
    - 跑 Phase 0.8 第二次:列出 CD 產出 vs scope-inventory 的差異
      * CD 多建了:flag 為 "out-of-scope by CD"、設計師裁示要不要進 DS
      * CD 少建了:flag 為 "missing"、Stage 3 backfill 補
      * CD 用了不同 variant 軸:Q-C 決策
    - 結果寫進 reconcile-report.md
```

---

## v0.8 增補 — alignment with ds-architecture-flow v0.8(2026-06-17)

v0.8 在 ds-architecture-flow 又有更動、本 skill 同步:

### Stage 3 reformat 規約調整

**(a) figma-rules v0.2 四層命名套用**(v0.8 新):
- Master name = L0 id 直接用(`button` 不是 `btn`、`icon-button` 不是 `icon-btn`、`tab-item` / `calendar-day` 等)
- Variant property = PascalCase=lowercase(`Style=Solid`、`Show-Leading-Icon=True`)
- 2025 縮寫(btn / img / ill)deprecated;CD 端可能用 2025 縮寫、Stage 3 reformat 時 rename 成 L0 id

**(b) Alert inline-card 重做**(v0.8 新):
- L0 alert 改 `[inline-card]` 單一 variant、舊 soft/outline/solid 拿掉
- 白底 + intent 在 icon 體現 + brand primary CTA
- CD 給的 alert 若仍是舊 soft/solid 設計、Stage 3 reformat 時 swap 為 inline-card
- CTA `default-intent: primary`(不繼承 alert intent)

**(c) Page=4 規約放寬**(v0.8 新):
- DS 4 頁固定(Cover/Foundations/Components/Masters)
- **頁面 rebuild 額外開 `Pages/<name>` 頁、不計入 4 頁**(WF 試跑撞「DS 第 5 頁」問題、現在 ds-architecture-flow 跟本 skill 都接受)
- Stage 4 page rebuild 產出 → 寫進 `Pages/<page-name>`、不污染 DS 4 頁

### Stage 4 page rebuild 紀律強化(v0.8 新增)

**(a) 「有就先建再套」原則**(W1):
- 頁面 rebuild 中發現缺 L0 元件 → Phase 0.8 scope cross-check
- L0 有的先補建 master、不直接 DSGAP
- 例:WF 找 announcement-item / price 等 scope 排除的元件、補建再套

**(b) Instance text override 用直接子層**(W2):
- `findChild()` / 已知 layer name 直接 `setCharacters()`
- 禁止 `findOne(deep)` — 會抓到 nested tag 內文字
- 此為 SME WF 試跑 article-card 標題 override 撞過的點

**(c) 複合元件內 image 預設 FILL**(W3):
- card / article-card 等內含 image 的 master、image 預設 `layoutSizingHorizontal=FILL`
- 避免卡片 resize 時 image 不跟隨

### Stage 5 audit 升級 — 14 → 17 metrics(同步 ds-architecture-flow v0.7.1 / v0.8)

```
原 14 項基礎上加:
15. 多軸元件用表格排版(button / input / alert specimen-frame 內 row=state × col=variant×intent)
16. Boolean property 使用(L0 宣告 boolean 的元件在 Figma 用 BOOLEAN property、非獨立 variant)
17. Foundations 標注完整(color swatch hex + opacity / 字級 size+weight+lh / spacing radius px)
```

Page=4 audit(第 1 項)同步調整:
- 接受「4 DS 頁 + N 個 Pages/<name>」結構
- Pages/<name> 不計入 4、但須是 root frame AUTO_LAYOUT 等基本紀律

---

## Prerequisites checklist

| Required | Where |
|---|---|
| CD handoff URL or extracted bundle | provided by user |
| Existing Figma file with DS file key | provided by user; may need backfill |
| L0 manifest (DS schema) | `/AI projects/DS Architecture/L0-scope-manifest.yaml` or project's own L0 |
| L4 archetype library | `/AI projects/DS Architecture/L4-archetype-library.yaml` |
| Figma plugin access (use_figma) | available via MCP |
| Disk space for bundle + screenshots | ~50 MB typical |

If L0/L4 missing or DS file empty → STOP. This skill assumes those exist. Tell user to run `/ds-architecture-flow` Gates 1-3 first.

---

## The workflow — 5 stages

### Stage 1 — Fetch + persist CD handoff to disk

Same pattern as `visual-to-figma-ds` Phase 1, with handoff-specific extraction.

**Steps**:

```bash
# 1. Download CD bundle (URL responds with gzip-compressed tar)
mkdir -p <project-root>/cd-bundles/round<N>
cd <project-root>/cd-bundles/round<N>
curl -sL "<CD handoff URL>" -o bundle.bin

# 2. Identify format + extract
file bundle.bin  # should say "gzip compressed data"
gunzip -c bundle.bin > bundle.tar
tar -xf bundle.tar
# Top-level folder is the project/handoff name; inside is README.md + chats/ + project/
```

**Bundle structure** (typical):
```
<handoff-name>/
├── README.md              # CD's own "to coding agents" instructions
├── chats/chat1.md         # full user ↔ CD transcript (HARD: read this for intent)
└── project/
    ├── <page>/
    │   ├── <Page>.html             # Page entry
    │   ├── components-<brand>.jsx  # ← READ THIS FIRST. Top comment lists DS gaps.
    │   ├── atoms-extras.jsx        # additional components
    │   ├── home-blocks.jsx          # page-level composition
    │   ├── colors_and_type.css     # token definitions
    │   ├── data.js                 # text content + structure data
    │   ├── prototype-nav.js
    │   ├── assets/
    │   └── ...
    └── uploads/  # user-uploaded refs to CD (PRD, brand refs, etc)
```

**MUST read before Stage 2**:
1. `README.md` — CD's intent
2. `chats/chat1.md` — full back-and-forth, esp. final decisions
3. `<page>/colors_and_type.css` — **token source of truth**
4. `<page>/components-<brand>.jsx` top comment block — CD self-flag list (50-70% of gap analysis pre-done by CD here)
5. `<page>/data.js` — text content for Stage 4 source binding

---

### Gate 1 — L4 required-states audit (Soft, fires between Stage 1 and Stage 2)

**Empirically determined missing in Path B trial 2 (2026-05-20)** — original cd-handoff-rebuild skipped L4 alignment check, so designer never got the "CD didn't show submit-error state" type warning. v0.2 add this Gate to fire L4 value.

**Steps**:

1. **Identify the page's L4 archetype** (CC infers from PRD or filename):

```
auth-page.jsx → auth-flow
product-detail-page.jsx → detail-page
list / catalog / browse pages → content-list-page
home/landing pages → home-page (proposed)
register / settings / checkout → form-page
admin / overview → dashboard
404 / 500 / maintenance → error-page
```

2. **Read L4 archetype** from `/AI projects/DS Architecture/L4-archetype-library.yaml#<archetype-id>`:
   - `required-states[]` — must be covered
   - `typical-components[]` — should be used
   - `override-policy` — what flexibility exists

3. **Audit CD bundle against archetype**:
   - For each `required-state`: scan CD jsx + chats for evidence of the state rendered (e.g., does `<Input error=...>` exist for `validation-error` state?)
   - For each `typical-component`: check if used in CD jsx
   - Don't auto-classify "missing" if uncertain — list as ambiguous + ask user

4. **Output (soft list — no block)**:

```markdown
=== Gate 1 — L4 archetype coverage ===
Page: <name>
Inferred archetype: <archetype-id>

Required states (per L4):
  ✅ idle (covered in Home.html)
  ✅ logged-in (Header conditional rendering)
  ❌ announcement-empty — CD always renders 5 items, no empty path
  ⚠️ hero-loading — Hero auto-rotates but no explicit loading skeleton
  ✅ logged-out

Typical components present:
  ✅ header / footer / floating-line / marquee / product-card / section-head / badge
  ⚠️ tag (only used in Header search keywords, not as filter)

Designer decisions for missing states:
  □ 請 CD 補畫 announcement-empty / hero-loading
  □ 接受、Stage 4 rebuild 時 inline 處理
  □ 跳過、不在本 trial scope
```

5. **Designer reviews + confirms** before Stage 2 fires. Output saved to `findings/<round>-gate1-l4-coverage.md`.

**Why this matters**: L4 archetype 的 required-states 是「設計師應提醒自己畫齊」的 checklist。沒這個 audit、required-states 變成 trial 結束後反向 audit 時才發現「沒畫到」— 等於跳過 trial 才補。Path B trial 2 內因為 home-page archetype 才提案、required-states 列表新生，這 Gate 1 沒 fire；下次 archetype 已 planned 時 Gate 1 應該 fire。

---

### Stage 2 — Gap analysis vs existing DS framework

**Inputs**:
- CD declared components (from `components-<brand>.jsx` + `atoms-extras.jsx` — actual `function Name() {}` declarations)
- CD foundation tokens (from `colors_and_type.css` — color palettes, typography classes, semantic tokens)
- CD self-flag list (from top comment block)
- Existing L0 manifest + `built-ds/components/index.json` + Figma component sets

**Three categories of gap** (per user Q-γ from Path B trial):

| Category | Meaning | Resolution |
|---|---|---|
| **Component-level gap** | CD declares X but L0 doesn't | Backfill L0 (Stage 3) |
| **Variant-level gap** | L0 has X but CD uses different variant axes | Either preserve L0 axes (跨 trial 通用) or replace with CD axes (project-specific) — **user decides per component** |
| **Page composite (no DS)** | CD inline-styled patterns (header / footer / hero / card composites) | Enumerate as `-DSGAP-<pattern>` for Stage 5 audit; may become A-level backfill candidates later |

**Output — gap list** (write to `findings/path-b-stage2-gap-list.md`):

```markdown
## 0. 重大發現 (must surface first)
- Brand color mismatch (CD primary vs trial baseline)
- Dark mode availability
- Typography class naming差異

## 1. Component-level gap
| # | CD ID | L0 status | trial 1 built-ds status | gap classification |

## 2. Sub-component / molecule gap (per user Q1-c nested)

## 3. State gap (per user Q4-b — only WF-observed states count)

## 4. Foundation token gap (color / typography / spacing / radius / shadow / motion)

## 5. L4 archetype gap (any home-page / detail-flow gap)

## 6. Backfill scope proposal (per user decision points)
- Hard gap (must backfill for rebuild): list
- Variant-level decisions (D1-D6): user picks per component
- Out of scope: list (defer to next trial)
```

**User decision points** (Path B validated D1-D6 + Q-A through Q-D pattern):

| Decision | Options |
|---|---|
| Variant axis preservation | (a) L0 axes preserved (跨 trial 通用 wins) OR (b) replace with CD axes (project-specific) — per component |
| Schema axis extension | input.success state? alert.rate-limited intent? |
| Card composition | Build composite on top of card primitive OR standalone? |
| Cleanup criteria | Remove trial-1-era extras that CD doesn't declare, regardless of past usage? |
| Dark mode | Build with light+dark mode tokens from start? |
| Variant matrix scope | Full matrix all components OR singletons get 1 variant? |

Pause here. User confirms decisions before Stage 3.

---

### Stage 3 — Backfill across 3 layers

For each gap (per user decisions), execute updates across **3 layers in sync**:

**3.1 built-ds code layer**:
- `built-ds/tokens/primitives/*.json` — overwrite per CD `colors_and_type.css`
- `built-ds/tokens/semantic/*.json` — both light + dark mode if D6 enabled
- `built-ds/components/index.json` — full component scope
- `built-ds/L0-patch-<run-name>.yaml` — new components not yet in main L0 (don't pollute baseline)

**3.2 Figma file layer** (single big use_figma call):
- Clean: delete old Variable collections / Text Styles / Effect Styles / obsolete component sets
- Create: Primitives collection (single mode) + Semantic collection (Light/Dark modes)
- Create: Text Styles per CD's t-* classes (typically 11-13 styles)
- Create: Effect Styles for shadows (6 light + 4 dark typically)
- Move trial-1-era rebuilds to archive page (preserve as failed-version comparison)

**3.3 Component build** (split into 3-4 sub-batches by complexity):
- Atoms (icon / badge / button / tag / alert / etc) — full variant matrix
- Form/nav (input / password-input / otp / checkbox / steps / breadcrumb / tabs) — full or representative
- Specialty (collapse / modal / social-button / number-stepper / rating / countdown-timer)
- Page composites (header / footer / floating-line / marquee / price / section-head / product-card)

**Total**: typically 25-30 component sets, ~200-230 variants for first JoiiNi-class project.

---

### Stage 4 — Page rebuild with HARD source-binding

**Phase 0.5 — Source Binding Pledge (HARD before any build call)**:

Open with this declaration:

> CD output is the source of truth. I (CC) will not self-judge brand color, typography class naming, copy content, icon choice, layout structure, variant axis, or visual details. Every build script decision must trace to a CD source location (file + line / token path / variant prop).

**Decision ownership table** (memorize this):

| Decision type | Ownership | CC may NOT |
|---|---|---|
| Brand color | Inferred from CD `colors_and_type.css` | Self-judge from brand keyword |
| Typography class | CD's existing classes (`t-h1` / `t-body-lg`) | Invent H1-H8 |
| Copy content | CD jsx inline string + `data.js` | Self-write |
| Icon choice | CD's lucide / inline SVG | Use emoji or color block |
| Layout structure | CD jsx tree | Reorganize |
| Component variant | CD `<X variant="...">` | Cross-pollinate framework axes |
| Visual details | CD CSS var values | Self-decide |

**Per-section binding rule**:
- For each section, locate the CD jsx function (e.g., `HomeHero`, `HomeRanking`)
- Mirror the jsx tree structure exactly
- Use DS instances where CD uses DS components
- Use raw frames where CD inlines (will surface as Gate 4.5 violations OR DSGAP)
- Bind every text to a DS text style (no `fontSize` overrides — use the closest DS class)
- Bind every fill to a DS variable (no raw hex except third-party brand colors)
- Bind every radius via 4-corner setBoundVariable

**Common layout traps** (validated patterns to avoid):

| Trap | Symptom | Fix |
|---|---|---|
| `primAxis=AUTO, cntAxis=FIXED` on HORIZONTAL section | Section collapses to 1px height | Set `cntAxis=AUTO` (counter axis = vertical = height) |
| layoutGrow=1 child in primAxis=AUTO parent | Child collapses to 1px width | Parent must be `primAxis=FIXED` for layoutGrow to work |
| `clipsContent=true` + IG-style square grid | Grid bottom row clipped | Set primAxis=AUTO on container OR `clipsContent=false` |
| 2×2 grid with `gap=2` looks like 2 tiles | tiles wrong aspect (e.g., 2:1 instead of 1:1) | Set tile size to true 1:1 (e.g., 334×334) |
| Fixed height on column that needs to match sibling | Column shrinks to content | Use `layoutAlign='STRETCH'` (stretches in parent's counter axis) |
| feat-article + IG side-by-side with mismatched height | Looks short or tall | Both with `primAxis=FIXED` + minHeight + `layoutAlign='STRETCH'` + parent `cntAxis=AUTO` |

**Helper template** (reuse from `visual-to-figma-ds` Phase 3):
- F() frame factory with auto-axis-mirror
- T() text factory with text style binding
- fillVar() / bindRadius() helpers
- instOf() factory for DS instances with text override

---

### Stage 5 — Reverse audit + visual iteration loop

#### 5.1 Audit script — 8 metrics

```js
// Run on the rebuilt page root
let frames=0, texts=0, instances=0, vectors=0;
let fillBound=0, fillRaw=0, txtBound=0, radBound=0, radRaw=0;
const instByMaster = {};
const remainingInline = []; // for DS-instance-required check
const knownInlineDSPatterns = ['kind','banner-label','label-pill','feat-cat','bf-cat','type','pct-pill',
  'soldout-pill','hot-mark','status-pill','type-badge','more-cta','follow','play'];

function walk(n) {
  // ... walk + tally per node type
  // ... check name against knownInlineDSPatterns → flag as Gate 4.5 violation
}
```

**17 metric thresholds(v0.7 升 14、v0.8 同步 ds-architecture-flow v0.8 再 +3 = 17;見上方 v0.8 增補)**:

1. Instance count > 0 per required DS component (mapping table baseline)
2. Text style binding = 100%
3. Fill binding ≥ 95% (allow third-party brand colors + gradient overlays as raw)
4. Radius binding = 100%
5. Spacing binding ≥ 90% (allow page-chrome 40/80/60 px as raw)
6. Sizing-mode consistency = 0 mismatches (no `primAxis=AUTO + cntAxis=FIXED + content-overflow`)
7. **DS-instance-required = 0 violations** (no inline-styled frame that should be DS instance)
8. Q8 enumeration list classified (a) / (b) per item
9. **Page count = 4** (Cover / Foundations / Components / Masters)(v0.7 加,Stage 3 reformat 後)
10. **Figma SECTION 往右排列**(Foundations 8 / Components 3 / Masters 3 SECTION)(v0.7 加)
11. **Nested INSTANCE_SWAP**(L0 composition 宣告的 nested 全部 INSTANCE_SWAP,延伸 Gate 4.5 到 component-level)(v0.7 加)
12. **Icon library 連結**(所有 icon 為 Untitled UI library asset instance, 無 unicode / 文字 / 自建 master)(v0.7 加)
13. **Spec-callout 缺席**(v0.7 加,v0.6 設計師要求拿掉)
14. **L0 composition / default-expansion 對齊**(per-component state / variant 覆蓋率 ≥ default-expansion 列出)(v0.7 加)

#### 5.2 Q8 enumeration — CC list, designer judge

Walk rebuilt page, list every inline frame:

| Category | Meaning | Action |
|---|---|---|
| **(a) DS doesn't exist** | Pattern not in L0 — page composite | Flag as `-DSGAP-{pattern}`, designer evaluates for L0 backfill |
| **(b) DS exists, CC didn't apply** | Pattern matches DS component — CC violation | Fix immediately (replace inline → instance) |

**HARD rule**: Gate 4.5 = (b) must be 0 before exiting Stage 5.

#### 5.3 Visual iteration loop (CRITICAL — CC cannot self-audit visual fidelity)

After audit passes, user reviews screenshot. Expected output flow:

```
Round N
├─ Build → screenshot → save to /tmp/<page>-vN.png
├─ User visually reviews
├─ User reports specific visual issues (typically 2-5 per round)
├─ CC diagnoses via use_figma query (NOT guesswork — measure actual frame state)
├─ Apply targeted fix in single use_figma call
├─ Re-screenshot
└─ Repeat until user signs off
```

**Typical issue categories** (Path B validated):
- Section collapsing to 1px height (layout sizing mode misuse)
- Inline frames that should be DS instances (Gate 4.5 false negatives)
- Spacing missing (default itemSpacing=0 in F() helper)
- Aspect ratio wrong (e.g., grid tiles 2:1 instead of 1:1)
- Feature article column collapsing (primAxis AUTO when should be FIXED + STRETCH)
- Icons all using color-block placeholders (need actual SVG)
- Footer column widths wrong proportion

**Anti-pattern**: Don't fix what user didn't flag. Each round, fix ONLY what user reported + don't accidentally regress other parts. Each iteration is targeted.

**Typical round count**: 5-8 rounds for first-time project, 2-3 for repeat.

---

## After all stages

1. Write final report (`findings/round<N>-trial-synthesis.md`):
   - Quantitative metrics (instances / token bind / dimensions)
   - Comparison vs prior trial baseline
   - DSGAP candidates A/B/C level
   - Protocol violations encountered + lessons

2. Update memory if new patterns surfaced:
   - New feedback memory if user gave guidance
   - Update reference memory if skill needs adjustment

3. L0/L4 backfill (separate step — only if user requests):
   - Don't auto-modify L0 during a single trial run
   - L0 backfill should be batched after cross-trial validation

---

## Decision protocol templates (Path B validated reference)

### D-series — variant axis decisions

```
D1: <Component>.<variant> 用在何處？
D2: <Component>.<axis> Trial baseline vs CD axis 差異
D3: Schema axis extension needed?
D4: Composite on top of primitive OR standalone?
D5: Cleanup criteria — remove framework over-spec OR preserve?
D6: Dark mode included?
```

### Q-series — backfill scope decisions

```
Q-A: Necessary backfill list (8-10 components typical) — full accept?
Q-B: Variant matrix details for ambiguous components
Q-C: Use CD axes or L0 axes (per component)
Q-D: Full variant matrix all components, or representative variants for unused?
```

### Q-γ — page composite scope (Stage 5)

```
A 級 (high cross-product reuse): 3-5 page composites worth L0 backfill
B 級 (medium): 1-2 specialized but reusable
C 級 (domain-specific): not for L0
```

---

## Plugin runtime gotchas (validated)

### Layout / sizing
- `primAxis=AUTO + cntAxis=FIXED` on HORIZONTAL section → height collapses to 1px (the "section disappeared" pattern)
- layoutGrow=1 in primAxis=AUTO parent → grow has nothing to work against, child shrinks to content
- Set `primAxis=FIXED with explicit size` for sections that should fill 1440px even with auto height
- `layoutAlign='STRETCH'` on child works on parent's COUNTER axis (height for HORIZONTAL parent)

### Variables / tokens
- `figma.setPluginData` unavailable in MCP runtime → use `setSharedPluginData(ns, key, val)` with ≥3 char namespace
- `setBoundVariable("cornerRadius", v)` silently fails → bind 4 corners separately
- Spacing bind requires `node.paddingTop = value FIRST` then `setBoundVariable`
- After `primaryAxisSizingMode='AUTO'` use `resizeWithoutConstraints(w, h)` not plain `resize()`

### SVG icons
- `figma.createNodeFromSvg(svgString)` returns FrameNode with VECTOR children
- Apply colors to VECTOR + BOOLEAN_OPERATION descendants (both strokes + fills)
- Resize whole node after creation: `node.resize(size, size)`

### Component instances
- `mainComponent.parent.name` is set name for COMPONENT_SET, page name for standalone COMPONENT (singletons)
- Detect singleton vs set via `c.type === 'COMPONENT_SET' || c.type === 'COMPONENT'`
- Text override: `findFirstText()` walks, `loadFontAsync(t.fontName)` before `t.characters = ...`

### Edit master vs instance
- Editing master COMPONENT's inline children propagates to all instances ← use this to fix many at once
- Editing instance directly only affects that instance
- For product-card-style composites where each instance has 3 sub-badge frames, edit the master to replace inline → DS sub-instance (1 master edit = 14 instance updates)

### Layout positioning
- `layoutPositioning='ABSOLUTE'` only works if parent has `layoutMode != 'NONE'`
- Append child to parent FIRST, then set ABSOLUTE positioning + x/y coords

---

## Worked example reference

**JoiiNi F-flow trial 2 / Path B (2026-05-20)** — full workflow execution:

| Stage | Input | Output | Duration |
|---|---|---|---|
| 1 | CD URL | `cd-bundles/round2/` extracted (11.4MB) | 5 min |
| 2 | Bundle + L0 + built-ds | `path-b-stage2-gap-list.md` with 8 component / 6 foundation / 35 page composite gaps | 20 min |
| 3 | Gap list + user D1-D6 + Q-A-D | 7 token JSON + 1 L0 patch + 1 index.json + 25 Figma component sets + 228 variants | 60 min |
| 4 | DS in Figma + CD source | Home page 1440×4326 with 79 DS instances (initial) | 90 min |
| 5 | Rebuild + audit | Round 1 audit (0% text bind / 64 inline → CC violation) → Round 2 (100% bind / 0 inline) → 5 more visual iteration rounds → final 4772px | 90 min |

**Visual iteration loop**: 6 rounds total (v3 through v9 screenshots), each addressing 2-5 specific user-reported issues.

**Final metrics** (per `findings/round7-trial-synthesis.md`):
- 79 DS instances (badge 61 / product-card 14 / button 2 / header 1 / footer 1)
- 100% text style binding
- 99% radius binding
- 0 inline DS-able frames
- 35 page composites listed as Q-γ for L0 backfill consideration

---

## Trial design principle (carry-over from `ds-architecture-flow`)

**Variable isolation**: 4 variables jointly determine output quality:
- V1 — Upstream source binding capacity (CD output machine-readable)
- V2 — Tool wiring (WebFetch + Figma plugin path complete)
- V3 — Protocol clarity (this SKILL.md + Phase 0.5 + Gate 4.5)
- V4 — CC execution discipline (audit catches violations)

Change at most 1-2 per trial cycle. Trial 1 had V3+V4 both moving → unattributable failure. Path B locked V1+V2+V3 (this SKILL became V3 baseline), tested V4 — succeeded.

---

## Coordination with other skills

| Skill | Relationship |
|---|---|
| `visual-to-figma-ds` | Stage 4-5 of this skill is essentially a more rigorous version of that skill's Phase 0-3, with added source-binding pledge + DS-instance-required HARD |
| `ds-architecture-flow` | This skill is step 6 (rebuild) of that skill's F-flow, with all 5 stages compressed |
| `session-stats` | Report-only at iteration end |

**Use this skill** when the workflow is full end-to-end (CD bundle in → reconnected Figma rebuild out + audit + iterate).
**Use `visual-to-figma-ds`** for single-page quick rebuild with existing complete DS.
**Use `ds-architecture-flow`** when running full F-flow including framework-level governance.

---

## Known limitations + future work

| Area | Limitation | Next iteration |
|---|---|---|
| Auth + Detail page coverage | Path B only validated home page archetype | Run auth + detail through this skill, surface form-heavy / detail-heavy patterns |
| Text content full sync | Stage 4 default uses placeholder text; data.js content sync is optional | Add as Stage 4.5 — "data binding step" |
| SVG icon library | Currently 15 hardcoded lucide icons inline in script | Build a reusable icon helper module |
| Cross-trial validation | A-level backfill candidates (10 components, 1 archetype) at status=proposed in L0 | Run another non-electronic-commerce home through this skill to graduate proposed → planned |
| Audit script reusability | Audit logic currently rewritten per call | Package as `tools/audit.js` script callable via single Bash invocation |

**v0.1 → v0.2** (2026-05-21) — added Gate 1 L4 required-states audit between Stage 1 + Stage 2 (Path B missed this; v0.2 fills L4 coverage gap before rebuild starts).

**Next v0.3 candidates** (cross-trial learnings):
- Stage 4.5 data binding (auto-bind CD's `data.js` content to text nodes — currently manual)
- Audit script extracted to `tools/audit.js` (callable via Bash, not per-call rewrite)
- Multi-page workflow (auth + detail + home as single trial run)
- Path A integration (Lovable as alt SSOT)

---

## Path 2 ITERATION report template (v0.7 加,寫到 `<project>/output/ITERATION-report.md`)

```markdown
# <project> — Iteration Report (cd-handoff-rebuild v0.7, Path 2)
Date: YYYY-MM-DD · Mode: Path 2 (CD → CC integrate) · Round: <descriptor>

## Phase 0(打包前)
- CI / spec / brand 一致性: <consistent | mismatch-resolved + 解法>
- Stage 0 Phase 0.8 scope inventory: <N components / <summary>>
- CD pack 內容: <list>

## Stage 1 — CD bundle fetch
- Bundle source: <URL / file>
- Extracted to: `<project>/cd-bundles/round<N>/`
- Size: <MB>
- CD self-flag list (top comment): <N items>

## Gate 1 — L4 archetype coverage
- Inferred archetype: <archetype-id>
- Required states: ✅<list> / ❌<missing>
- Designer decisions: <list>

## Stage 2 — Gap analysis + Phase 0.8 第二次(reconcile)
- Component-level gap: <list>
- Variant-level gap: <list>
- Page composite (DSGAP): <list>
- ⭐ Phase 0.8 reconcile diff:
  - CD 多建: <list>
  - CD 少建: <list>
  - CD 用不同 variant 軸: <list, Q-C 決策>
- Out of scope (defer): <list>

## Stage 3 — Backfill across 3 layers + v0.7 reformat
- built-ds tokens: <files>
- Figma Variables / Text Styles / Effect Styles: <counts>
- Components built: <N sets / M variants>
- v0.7 Reformat:
  - Page count after reformat: <4>
  - SECTION 結構: <OK / 偏差>
  - Master sets 收進 Masters 頁: <yes / no>
  - Icon swap to Untitled UI library: <swapped N / unable M>
- Build-time binding remediation (Path 2 例外):
  - Initial hex 數量: <N>
  - Remediation 後: <0 / 殘留>
  - Patch 紀錄: <summary、給 framework 反饋怎麼跟 CD 端溝通>

## Stage 4 — Page rebuild
- Phase 0.5 Source Binding Pledge declared: yes
- Pages rebuilt: <list>
- DS instance count: <N>
- Inline frames after build: <N before Stage 5>

## Stage 5 — Audit + Visual iteration
| Metric (14 項) | PASS / FAIL |
|---|---|
| ... |  |

### Visual iteration loop
- Round count: <N>
- Issues fixed per round: <summary>
- Final screenshot: <path>

## Proposals raised(→ upstream candidates)
- A-level page composites: <list>
- L0 extension candidates: <list>

## Drift vs skill expectations
- <list>

## Anti-patterns surfaced
- <list>

## Next round candidates
1. <list>
```

---

## Distribution

**v0.7(2026-06-16):skill 已移進 framework repo**(原本在 `/AI projects/tools/skills/`)。
路徑:`<framework-repo>/skills/cd-handoff-rebuild/SKILL.md`

成員 `git clone` framework 後跑這條 install:

```bash
ln -s "$(pwd)/ds-framework/skills/cd-handoff-rebuild" ~/.claude/skills/cd-handoff-rebuild
```

→ `git pull` 框架時 skill 一起同步更新。

Self-contained folder;no external dependencies beyond the existing memory + L0/L4 files referenced inline。
