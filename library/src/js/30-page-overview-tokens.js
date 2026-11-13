  /* ===== 複雜度確認總覽 ===== */
  function choiceReport(){
    // 回傳 {id:{axis:[選中值],...,count,full}, _total, _full}
    const out={};let total=0,full=0;
    Object.keys(DIAL_SPECS).forEach(id=>{const spec=DIAL_SPECS[id],act=CHOICE[id].active;const rec={};let c=1,f=1;
      spec.order.forEach(k=>{const sel=spec.axes[k].filter(v=>act[k].has(v));rec[k]=sel;});
      c=dialCount(spec.order,rec,spec.when);f=dialCount(spec.order,spec.axes,spec.when);
      rec.count=c;rec.full=f;out[id]=rec;total+=c;full+=f;});
    out._total=total;out._full=full;return out;
  }
  const SUMSEL=new Set(Object.keys(DIAL_SPECS)); // 手動選取要產出的元件（預設全選、跨切頁持久）
  const RECOMMEND=['button','input','dropdown','checkbox','radio','tag','icon','tooltip','notification','modal','table','tab','pagination','menu']; // AI 建議＝最常見/使用機率最高的元件（預設推薦集）
  let aiOn=false,aiSnapshot=null; // AI 建議 toggle 狀態＋開啟前的選擇快照
  let sumLayout='accordion'; // 匯出頁版型方案：accordion 分類展開／list 緊湊清單／grid 分組網格（跨切頁持久）
  const DIAL_PAGE={button:'button',input:'input',dropdown:'dropdown',checkbox:'selector',radio:'selector',tag:'tag',tab:'tab',notification:'notification',tooltip:'tooltip',skeleton:'skeleton',loader:'loader',menu:'menu','action-menu':'action-menu',breadcrumb:'breadcrumb',pagination:'pagination',icon:'icon',price:'price',image:'image',
    header:'header',
    footer:'footer',
    'section-head':'section-head',
    list:'list',
    'list-item':'list-item',
    collapse:'collapse',
    modal:'modal',
    drawer:'drawer',
    'floating-line':'floating-line',
    step:'step',
    quantity:'quantity',
    progress:'progress',
    card:'card',
    'product-card':'product-card',
    'category-tile':'category-tile',
    'article-card':'article-card',
    table:'table',
    chart:'chart',
    'tree-view':'tree-view',
    'schedule-chart':'schedule-chart',
    calendar:'calendar'
  }; // 轉盤元件 → 對應頁面（checkbox/radio 都在 selector 頁）
  const ICON_SPARK=PI('sparkles');
  /* ===== Design Token 檢視 / 編輯頁（L1 primitive / L2 semantic 切換）===== */
  // L1：純值 primitive（kind：color 色票／text 值／shadow 陰影示意／ref 唯讀參考）
  const TOK_L1=[
    {g:'Neutral 中性色階',kind:'color',note:'單色底來源；light 的 surface/text/border 皆引用。',
     rows:[['--c-neutral-0'],['--c-neutral-50'],['--c-neutral-100'],['--c-neutral-200'],['--c-neutral-300'],['--c-neutral-400'],['--c-neutral-500'],['--c-neutral-600'],['--c-neutral-700'],['--c-neutral-800'],['--c-neutral-900']],
     def:{'--c-neutral-0':'#FFFFFF','--c-neutral-50':'#FAFAFA','--c-neutral-100':'#F4F5F7','--c-neutral-200':'#ECEEF2','--c-neutral-300':'#DFE1E7','--c-neutral-400':'#C9CDD6','--c-neutral-500':'#9BA0AA','--c-neutral-600':'#6F7179','--c-neutral-700':'#3A3D45','--c-neutral-800':'#1C1E24','--c-neutral-900':'#0D0F15'}},
    {g:'Brand 主色（9 階）',kind:'color',note:'primary 主色；餵 action.primary／選中／圖表主系列。500 為主錨點，暗色模式翻成亮端（見框架索引）。色相由 --c-brand 色階定義、可自由調整。',
     rows:[['--c-brand-100'],['--c-brand-200','dark 亮端'],['--c-brand-300'],['--c-brand-400'],['--c-brand-500','主 500'],['--c-brand-600','hover'],['--c-brand-700','press'],['--c-brand-800'],['--c-brand-900']],
     def:{'--c-brand-100':'#EDEDEE','--c-brand-200':'#D1D1D3','--c-brand-300':'#A8A8AB','--c-brand-400':'#5F5F64','--c-brand-500':'#1C1C20','--c-brand-600':'#141417','--c-brand-700':'#0C0C0E','--c-brand-800':'#060607','--c-brand-900':'#000000'}},
    {g:'Brand 副色（9 階）',kind:'color',note:'副品牌色（框架 brand.secondary）；色相由 --c-brand2 色階定義、可自由調整。目前為 primitive，元件端 secondary 仍走中性色（要不要接副色需另行確認）。',
     rows:[['--c-brand2-100'],['--c-brand2-200'],['--c-brand2-300'],['--c-brand2-400'],['--c-brand2-500','副 500'],['--c-brand2-600'],['--c-brand2-700'],['--c-brand2-800'],['--c-brand2-900']],
     def:{'--c-brand2-100':'#FFEDD5','--c-brand2-200':'#FED7AA','--c-brand2-300':'#FDBA74','--c-brand2-400':'#FB923C','--c-brand2-500':'#EA580C','--c-brand2-600':'#C2410C','--c-brand2-700':'#9A3412','--c-brand2-800':'#7C2D12','--c-brand2-900':'#5A200D'}},
    {g:'Feedback 狀態色（各 9 階）',kind:'color',note:'成功／警告／錯誤／資訊，框架完整 9 階 tint；500 為主、兼圖表系列色，400/600 供 hover/press 與暗色。',
     rows:[['--c-success-100'],['--c-success-200'],['--c-success-300'],['--c-success-400'],['--c-success-500','success'],['--c-success-600'],['--c-success-700'],['--c-success-800'],['--c-success-900'],['--c-warning-100'],['--c-warning-200'],['--c-warning-300'],['--c-warning-400'],['--c-warning-500','warning'],['--c-warning-600'],['--c-warning-700'],['--c-warning-800'],['--c-warning-900'],['--c-error-100'],['--c-error-200'],['--c-error-300'],['--c-error-400'],['--c-error-500','error'],['--c-error-600'],['--c-error-700'],['--c-error-800'],['--c-error-900'],['--c-info-100'],['--c-info-200'],['--c-info-300'],['--c-info-400'],['--c-info-500','info'],['--c-info-600'],['--c-info-700'],['--c-info-800'],['--c-info-900']],
     def:{'--c-success-100':'#D1FAE5','--c-success-200':'#A7F3D0','--c-success-300':'#6EE7B7','--c-success-400':'#34D399','--c-success-500':'#10B981','--c-success-600':'#059669','--c-success-700':'#047857','--c-success-800':'#065F46','--c-success-900':'#064E3B','--c-warning-100':'#FEF3C7','--c-warning-200':'#FDE68A','--c-warning-300':'#FCD34D','--c-warning-400':'#FBBF24','--c-warning-500':'#F59E0B','--c-warning-600':'#D97706','--c-warning-700':'#B45309','--c-warning-800':'#92400E','--c-warning-900':'#78350F','--c-error-100':'#FEE2E2','--c-error-200':'#FECACA','--c-error-300':'#FCA5A5','--c-error-400':'#F87171','--c-error-500':'#EF4444','--c-error-600':'#DC2626','--c-error-700':'#B91C1C','--c-error-800':'#991B1B','--c-error-900':'#7F1D1D','--c-info-100':'#DBEAFE','--c-info-200':'#BFDBFE','--c-info-300':'#93C5FD','--c-info-400':'#60A5FA','--c-info-500':'#3B82F6','--c-info-600':'#2563EB','--c-info-700':'#1D4ED8','--c-info-800':'#1E40AF','--c-info-900':'#1E3A8A'}},
    {g:'Violet 紫（9 階）',kind:'color',note:'圖表系列 4（--s-chart-4）來源；2026-11-03 隨圖表擴充新增。',
     rows:[['--c-violet-100'],['--c-violet-200'],['--c-violet-300'],['--c-violet-400','dark 系列'],['--c-violet-500'],['--c-violet-600','系列 4'],['--c-violet-700'],['--c-violet-800'],['--c-violet-900']],
     def:{'--c-violet-100':'#EEECFB','--c-violet-200':'#DCD8F7','--c-violet-300':'#BDB5F1','--c-violet-400':'#9085E9','--c-violet-500':'#7565DF','--c-violet-600':'#6250D6','--c-violet-700':'#4F3EB5','--c-violet-800':'#3D3190','--c-violet-900':'#2C246A'}},
    {g:'Radius 圓角（9 階）',kind:'text',resp:true,note:'響應式：mobile 收小 lg/xl；md 8 為預設、按鈕 pill（＝框架 full）。xs/2xl/3xl 固定不隨裝置。',
     rows:[['--r-none'],['--r-xs'],['--r-sm'],['--r-md','預設'],['--r-lg'],['--r-xl'],['--r-2xl'],['--r-3xl'],['--r-pill','按鈕']],
     def:{'--r-none':['0px','0px','0px'],'--r-xs':['2px','2px','2px'],'--r-sm':['4px','4px','4px'],'--r-md':['8px','8px','8px'],'--r-lg':['10px','10px','8px'],'--r-xl':['16px','16px','12px'],'--r-2xl':['24px','24px','24px'],'--r-3xl':['32px','32px','32px'],'--r-pill':['9999px','9999px','9999px']}},
    {g:'Spacing 間距（v0 校準）',kind:'text',resp:true,note:'依 v0.app 量測校準：base 較緊、補 6px 階（v0 最常用 gap）；響應式大間距在 tablet/mobile 再收緊。',
     rows:[['--sp-0'],['--sp-1'],['--sp-2','6 · v0 gap'],['--sp-3'],['--sp-4','12 · v0 pad'],['--sp-5'],['--sp-6'],['--sp-7'],['--sp-8'],['--sp-9']],
     def:{'--sp-0':['0px','0px','0px'],'--sp-1':['4px','4px','4px'],'--sp-2':['6px','6px','6px'],'--sp-3':['8px','8px','8px'],'--sp-4':['12px','12px','12px'],'--sp-5':['16px','16px','12px'],'--sp-6':['24px','20px','16px'],'--sp-7':['32px','28px','24px'],'--sp-8':['48px','40px','32px'],'--sp-9':['64px','56px','48px']}},
    {g:'Font Family 字體',kind:'ref',note:'Latin 走 Epilogue（標題）／Geist（內文與數字）／Geist Mono（程式碼與標籤），三套都內嵌；中文（CJK）走系統字 per-character fallback。實際輸出見程式碼區 _font.scss（唯讀對照，非在此編輯）。',
     rows:[['--font-display','display'],['--font-sans','sans'],['--font-mono','mono']],
     def:{'--font-display':"'Epilogue', 'Geist', -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', system-ui, sans-serif",'--font-sans':"'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', system-ui, sans-serif",'--font-mono':"'Geist Mono', ui-monospace, 'SF Mono', Menlo, 'PingFang TC', 'Noto Sans TC', monospace"}},
    {g:'Typography 複合樣式（text style）',kind:'typo',sample:true,note:'＝ Figma text style：每階字級（隨 device）＋字重＋行高（中/英）綁一包；左側即時預覽用 .ty-h* 渲染。右上切換 device 改字級欄。',
     rows:['h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','h11','h12'],
     sz:{h1:['64px','52px','40px'],h2:['56px','46px','36px'],h3:['48px','40px','32px'],h4:['40px','34px','28px'],h5:['32px','28px','24px'],h6:['24px','22px','20px'],h7:['20px','20px','20px'],h8:['18px','18px','18px'],h9:['16px','16px','16px'],h10:['14px','14px','14px'],h11:['12px','12px','12px'],h12:['10px','10px','10px']},
     def:{h1:['600','1.25','1.15'],h2:['600','1.3','1.2'],h3:['600','1.35','1.25'],h4:['600','1.4','1.3'],h5:['500','1.45','1.4'],h6:['500','1.5','1.4'],h7:['500','1.55','1.5'],h8:['400','1.6','1.5'],h9:['400','1.6','1.5'],h10:['400','1.5','1.4'],h11:['400','1.5','1.4'],h12:['400','1.5','1.4']}},
    {g:'Letter Spacing 字距（中／英）',kind:'ls2',note:'中文（CJK 幾乎不收）／英文（Latin 大標題略收）兩套獨立字距，套用於 .ty-h*。',
     rows:['h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','h11','h12'],
     def:{h1:['-0.01em','-0.03em'],h2:['-0.01em','-0.025em'],h3:['-0.005em','-0.02em'],h4:['-0.005em','-0.015em'],h5:['0','-0.01em'],h6:['0','-0.01em'],h7:['0','0'],h8:['0','0'],h9:['0','0'],h10:['0.01em','0.01em'],h11:['0.01em','0.01em'],h12:['0.01em','0.01em']}},
    {g:'Container 容器',kind:'text',resp:true,note:'響應式：內容最大寬與頁面 gutter 隨裝置變（gutter 已接到頁面 .main）。',
     rows:[['--container-max','max width'],['--container-pad','gutter']],
     def:{'--container-max':['1280px','1024px','100%'],'--container-pad':['32px','24px','16px']}},
    {g:'Control Height 控制項高度',kind:'text',note:'Button、Input、Dropdown、Tab、Segmented、Pagination 的高度：s／m／l 三級共用這組數值；Button、Input、Dropdown 為最小高度（字放大會跟著長）。',
     rows:[['--ctl-h-xs','xs'],['--ctl-h-s','s'],['--ctl-h-m','m（預設）'],['--ctl-h-l','l']],
     def:{'--ctl-h-xs':'24px','--ctl-h-s':'32px','--ctl-h-m':'40px','--ctl-h-l':'48px'}},
    {g:'Tag Height 標籤高度',kind:'text',note:'Tag 的 s／m／l 高度，比控制項小一階（Tag 只顯示、不操作）。',
     rows:[['--tag-h-s','s（預設）'],['--tag-h-m','m'],['--tag-h-l','l']],
     def:{'--tag-h-s':'20px','--tag-h-m':'24px','--tag-h-l':'28px'}},
    {g:'Font Weight 字重',kind:'text',
     rows:[['--fw-regular'],['--fw-medium'],['--fw-semibold'],['--fw-bold']],
     def:{'--fw-regular':'400','--fw-medium':'500','--fw-semibold':'600','--fw-bold':'700'}},
    {g:'Line Height 行高',kind:'text',
     rows:[['--lh-tight'],['--lh-snug'],['--lh-normal'],['--lh-relaxed']],
     def:{'--lh-tight':'1.2','--lh-snug':'1.35','--lh-normal':'1.5','--lh-relaxed':'1.6'}},
    {g:'Elevation 陰影（5 階）',kind:'shadow',note:'左側示意 box 套用實際陰影；暗色模式另有加深版（見框架索引）。',
     rows:[['--e-sm'],['--e-md'],['--e-lg'],['--e-xl'],['--e-2xl']],
     def:{'--e-sm':'0 1px 2px 0 rgba(0,0,0,.05)','--e-md':'0 4px 6px -1px rgba(0,0,0,.10),0 2px 4px -2px rgba(0,0,0,.10)','--e-lg':'0 10px 15px -3px rgba(0,0,0,.10),0 4px 6px -4px rgba(0,0,0,.10)','--e-xl':'0 20px 25px -5px rgba(0,0,0,.10),0 8px 10px -6px rgba(0,0,0,.10)','--e-2xl':'0 25px 50px -12px rgba(0,0,0,.25)'}},
    {g:'Icon 圖示',kind:'text',note:'PulsoIcon 線寬，單位為 24 格 viewBox（16px icon 實際約 1.3px）；寫入 Figma 時綁 stroke weight Variable。',
     rows:[['--icon-stroke','線寬 stroke']],
     def:{'--icon-stroke':'2'}},
    {g:'Motion 動態',kind:'text',
     rows:[['--dur-fast'],['--dur-default'],['--dur-slow'],['--dur-hover-delay','hover 延遲'],['--ease-standard'],['--ease-out','進場'],['--ease-in','退場'],['--ease-spring']],
     def:{'--dur-fast':'150ms','--dur-default':'300ms','--dur-slow':'500ms','--dur-hover-delay':'250ms','--ease-standard':'cubic-bezier(.4,0,.2,1)','--ease-out':'cubic-bezier(.22,1,.36,1)','--ease-in':'cubic-bezier(.55,0,1,.45)','--ease-spring':'cubic-bezier(.34,1.56,.64,1)'}},
    {g:'Breakpoints 裝置斷點',kind:'ref',note:'響應式 device mode 分界：Desktop ≥1024／Tablet 768–1023／Mobile <768（字級/間距/圓角/容器隨此變）。',
     rows:[['--bp-mobile','mobile'],['--bp-tablet','tablet'],['--bp-desktop','desktop'],['--bp-wide','wide']],
     def:{'--bp-mobile':'480px','--bp-tablet':'768px','--bp-desktop':'1024px','--bp-wide':'1920px'}},
    {g:'Grid 網格（per device）',kind:'ref',note:'各裝置欄數 · gutter · margin（框架值，設計參考）。',
     rows:[['grid-mobile','mobile'],['grid-tablet','tablet'],['grid-desktop','desktop'],['grid-wide','wide']],
     def:{'grid-mobile':'4 欄 · gutter 16 · margin 16','grid-tablet':'8 欄 · gutter 24 · margin 24','grid-desktop':'12 欄 · gutter 32 · margin 64','grid-wide':'12 欄 · gutter 32 · margin 96（≥1920）'}}
  ];
  // L2：semantic 角色（每列 light / dark 兩模式值；值可為 hex 或 var(--c-*) 參考）
  const TOK_L2=[
    {g:'Surface 表面',rows:[
      ['--s-surface-canvas','canvas','var(--c-neutral-50)','#040406'],['--s-surface-1','surface','var(--c-neutral-0)','#09090B'],
      ['--s-surface-2','surface-2','var(--c-neutral-100)','#101012'],['--s-surface-3','surface-3','var(--c-neutral-200)','#17171A']]},
    {g:'Text 文字',rows:[
      ['--s-text-1','ink','var(--c-neutral-900)','#F4F4F5'],['--s-text-2','muted','var(--c-neutral-600)','#9A9CA4'],['--s-text-3','faint','var(--c-neutral-500)','#6B6E77']]},
    {g:'Border 邊界',rows:[
      ['--s-border-1','line','var(--c-neutral-300)','#26272B'],['--s-border-2','line-strong','var(--c-neutral-400)','#34363C']]},
    {g:'Action 主要動作',rows:[
      ['--s-action-primary','primary','var(--c-brand-500)','var(--c-brand-400)'],['--s-action-primary-hover','hover','var(--c-brand-600)','#8CA2F8'],
      ['--s-action-primary-press','press','var(--c-brand-700)','var(--c-brand-500)'],['--s-on-primary','on','#FFFFFF','#FFFFFF']]},
    {g:'Danger / Secondary',rows:[
      ['--s-action-danger','danger','var(--c-error-500)','var(--c-error-400)'],['--s-sec-fill','sec fill','var(--c-neutral-100)','#22232A'],
      ['--s-sec-on','sec on','var(--c-neutral-800)','#F4F4F5'],['--s-sec-edge','sec edge','var(--c-neutral-400)','#3A3C43']]},
    {g:'Feedback 狀態',rows:[
      ['--s-feedback-success','success','var(--c-success-500)','var(--c-success-400)'],['--s-feedback-warning','warning','var(--c-warning-500)','var(--c-warning-400)'],
      ['--s-feedback-error','error','var(--c-error-500)','var(--c-error-400)'],['--s-feedback-info','info','var(--c-info-500)','var(--c-info-400)']]},
    {g:'Chart 圖表系列',rows:[
      ['--s-chart-2','series 2','var(--c-info-600)','var(--c-info-500)'],['--s-chart-3','series 3','var(--c-success-600)','var(--c-success-500)'],['--s-chart-4','series 4','var(--c-violet-600)','var(--c-violet-400)'],
      ['--s-chart-seq-0','heat 0','var(--s-surface-3)','var(--s-surface-3)'],['--s-chart-seq-1','heat 1','var(--c-brand2-100)','var(--c-brand2-900)'],['--s-chart-seq-2','heat 2','var(--c-brand2-300)','var(--c-brand2-800)'],
      ['--s-chart-seq-3','heat 3','var(--c-brand2-400)','var(--c-brand2-600)'],['--s-chart-seq-4','heat 4','var(--c-brand2-500)','var(--c-brand2-400)'],['--s-chart-seq-5','heat 5','var(--c-brand2-700)','var(--c-brand2-300)']]}
  ];
  /* 框架索引（唯讀）：DS Framework _base.theme.yaml 完整原始定義；rows=[key,value,role/note]，value 為 #hex 時左側顯示色塊。
     ⚠ 標記處＝框架原值與本專案 v0 種子刻意不同（對照用）。 */
  const FRAMEWORK_REF=[
    {t:'Color · Gray 中性（11 階）',note:'框架原值為 Tailwind 系；本專案 L1 改用 v0 單色（0D0F15 系），階數相同、值不同。',
     rows:[['gray.0','#FFFFFF'],['gray.50','#F9FAFB'],['gray.100','#F3F4F6'],['gray.200','#E5E7EB'],['gray.300','#D1D5DB'],['gray.400','#9CA3AF'],['gray.500','#6B7280'],['gray.600','#4B5563'],['gray.700','#374151'],['gray.800','#1F2937'],['gray.900','#111827']]},
    {t:'Color · Brand 主色（9 階）',note:'框架結構鎖定、值留空由專案 delta 填；本專案主色種子＝深黑（見 L1 分頁）。',
     rows:[['brand.primary.100','（專案填）'],['brand.primary.200','（專案填）'],['brand.primary.300','（專案填）'],['brand.primary.400','（專案填）'],['brand.primary.500','（主錨點）'],['brand.primary.600','（專案填）'],['brand.primary.700','（專案填）'],['brand.primary.800','（專案填）'],['brand.primary.900','（專案填）']]},
    {t:'Color · Brand 副色（9 階）',note:'同上，框架留空；本專案副色＝品牌橘 #EA580C。',
     rows:[['brand.secondary.100','（專案填）'],['brand.secondary.300','（專案填）'],['brand.secondary.500','（副錨點）'],['brand.secondary.700','（專案填）'],['brand.secondary.900','（專案填）']]},
    {t:'Color · Feedback / Success（9 階）',
     rows:[['success.100','#D1FAE5'],['success.200','#A7F3D0'],['success.300','#6EE7B7'],['success.400','#34D399'],['success.500','#10B981'],['success.600','#059669'],['success.700','#047857'],['success.800','#065F46'],['success.900','#064E3B']]},
    {t:'Color · Feedback / Warning（9 階）',
     rows:[['warning.100','#FEF3C7'],['warning.200','#FDE68A'],['warning.300','#FCD34D'],['warning.400','#FBBF24'],['warning.500','#F59E0B'],['warning.600','#D97706'],['warning.700','#B45309'],['warning.800','#92400E'],['warning.900','#78350F']]},
    {t:'Color · Feedback / Error（9 階）',
     rows:[['error.100','#FEE2E2'],['error.200','#FECACA'],['error.300','#FCA5A5'],['error.400','#F87171'],['error.500','#EF4444'],['error.600','#DC2626'],['error.700','#B91C1C'],['error.800','#991B1B'],['error.900','#7F1D1D']]},
    {t:'Color · Feedback / Info（9 階）',
     rows:[['info.100','#DBEAFE'],['info.200','#BFDBFE'],['info.300','#93C5FD'],['info.400','#60A5FA'],['info.500','#3B82F6'],['info.600','#2563EB'],['info.700','#1D4ED8'],['info.800','#1E40AF'],['info.900','#1E3A8A']]},
    {t:'Radius 圓角（9 階）',note:'⚠ 框架 lg=12px；本專案折衷改 lg=10px。',
     rows:[['none','0'],['xs','2px'],['sm','4px'],['md','8px'],['lg','12px','⚠ 專案=10px'],['xl','16px'],['2xl','24px'],['3xl','32px'],['full','9999px','＝專案 pill']]},
    {t:'Spacing 間距（9 階 · 4-base）',note:'⚠ 本專案依 v0.app 量測改用較緊尺標（補 6px、base 12）；見 L1 分頁。',
     rows:[['0','0px'],['1','4px'],['2','8px'],['3','12px'],['4','16px'],['5','24px'],['6','32px'],['7','48px'],['8','64px']]},
    {t:'Typography · 中文 zh（H1–H10）',note:'size / weight / line-height；中文行高預設略大於英文。',
     rows:[['h1','48px · 700 · 1.4','重點應用'],['h2','36px · 700 · 1.4','頁面主標'],['h3','28px · 600 · 1.5','區塊主標'],['h4','24px · 600 · 1.5','區塊主標'],['h5','20px · 600 · 1.5','區塊主標'],['h6','18px · 500 · 1.6','區塊次標'],['h7','16px · 500 · 1.6','區塊次標'],['h8','14px · 400 · 1.6','內文/按鈕'],['h9','12px · 400 · 1.6','內文/按鈕'],['h10','10px · 400 · 1.5','輔助']]},
    {t:'Typography · 英文 en（H1–H10）',note:'size 與 zh 相同、line-height 較緊。',
     rows:[['h1','48px · 700 · 1.15','重點應用'],['h2','36px · 700 · 1.2','頁面主標'],['h3','28px · 600 · 1.25','區塊主標'],['h4','24px · 600 · 1.3','區塊主標'],['h5','20px · 600 · 1.4','區塊主標'],['h6','18px · 500 · 1.4','區塊次標'],['h7','16px · 500 · 1.5','區塊次標'],['h8','14px · 400 · 1.5','內文/按鈕'],['h9','12px · 400 · 1.5','內文/按鈕'],['h10','10px · 400 · 1.4','輔助']]},
    {t:'Typography · font-family / letter-spacing',note:'框架宣告含 letter-spacing（base 未給值）；本專案字距見 L1 複合樣式分頁。',
     rows:[['sans-zh','（專案填，如 Noto Sans TC）'],['sans-en','（專案填，如 Inter）'],['mono','（專案填，如 JetBrains Mono）'],['letter-spacing','（L0 宣告 / base 未定值）']]},
    {t:'Elevation 陰影（5 階）',note:'含 light/dark 兩模式（dark 通常加深或改 glow）。',
     rows:[['none','none'],['sm','0 1px 2px 0 rgba(0,0,0,.05)'],['md','0 4px 6px -1px rgba(0,0,0,.10) …'],['lg','0 10px 15px -3px rgba(0,0,0,.10) …'],['xl','0 20px 25px -5px rgba(0,0,0,.10) …'],['2xl','0 25px 50px -12px rgba(0,0,0,.25)']]},
    {t:'Motion 動態',
     rows:[['duration.fast','150ms'],['duration.default','300ms'],['duration.slow','500ms'],['easing.default','cubic-bezier(.4,0,.2,1)','standard'],['easing.in','cubic-bezier(.4,0,1,1)','accelerate'],['easing.out','cubic-bezier(0,0,.2,1)','decelerate'],['easing.spring','cubic-bezier(.34,1.56,.64,1)']]},
    {t:'Breakpoints 斷點',
     rows:[['mobile','360'],['tablet','768'],['desktop','1024'],['wide','1920']]},
    {t:'Grid 網格（per breakpoint）',note:'columns · gutter · margin。',
     rows:[['mobile','4 · 16 · 16'],['tablet','8 · 24 · 24'],['desktop','12 · 32 · 64'],['wide','12 · 32 · 96']]},
    {t:'L2 Semantic（角色 → L1，light / dark）',note:'命名為框架鎖定、不可改名；delta 只改指向值。',
     rows:[['surface.primary','gray.0 → gray.900'],['surface.secondary','gray.50 → gray.800'],['surface.overlay','rgba(0,0,0,.5) → .7'],['text.default','gray.900 → gray.50'],['text.muted','gray.500 → gray.400'],['text.inverse','gray.0 → gray.900'],['border.default','gray.200 → gray.700'],['border.focus','brand.primary.500 → .400'],['action.primary','brand.primary.500 → .400'],['action.secondary','brand.secondary.500 → .400'],['action.danger','error.500 → .400'],['feedback.success','success.500 → .400'],['feedback.warning','warning.500 → .400'],['feedback.error','error.500 → .400'],['feedback.info','info.500 → .400']]}
  ];
  function tokResolve(v){ // 把 var(--c-*) 參考解析成實際色（primitive 與模式無關，任何當下都讀得到）
    if(typeof v==='string' && v.indexOf('var(')===0){const nm=v.slice(4,-1).trim();
      return (getComputedStyle(document.documentElement).getPropertyValue(nm).trim())||v;}
    return v;}
  const tokShort=v=>String(v).replace('var(--c-','').replace(')','').replace('--c-','');

