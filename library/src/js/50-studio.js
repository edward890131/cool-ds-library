  /* ===== Studio 資料管線（C1 匯入 proposal / C4 匯出 / C5 server）===== */
  /* 動態覆寫樣式（#tokenOverrides／#bindOverrides）：先照舊寫 <style> 的 textContent（Vercel／本機直接生效，也讓觀察者收得到改動）；
     若宿主環境的 CSP 擋掉動態 <style>（例：預覽 artifact 只放行頁面原本的樣式表，style.sheet 會是 null），改用 CSSOM insertRule 寫進頁面既有樣式表的最後面。
     CSSOM 不受 CSP 限制；每次重寫前先移除上一次插入的規則。 */
  /* 色塊用 var() 即時跟著變；旁邊的色號文字（[data-tok]）在主題切換／token 覆寫後重讀一次 */
  function tokTextRefresh(){requestAnimationFrame(()=>{const cs=getComputedStyle(document.documentElement);
    document.querySelectorAll('[data-tok]').forEach(el=>{const v=cs.getPropertyValue(el.dataset.tok).trim();if(v)el.textContent=v.toUpperCase();});});}
  new MutationObserver(tokTextRefresh).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  /* 最後保險：寫完 token 覆寫後抽查實際生效值；若樣式表路徑在此環境沒生效（computed 仍是舊值），改把覆寫直接寫到 <html> 的 inline style（CSSOM，任何環境都生效）。
     inline 依目前主題／斷點合併：root ＋（深色時）dark ＋ 當前 tier；深色時略過 root 裡的 L2 light 值（--s-*），避免蓋掉深色定義。主題或斷點變了就重算。 */
  const TOK_INLINE={on:false,keys:[]};
  function tokInlineApply(){const R=document.documentElement,OV=window.__tokOverrides||{};
    TOK_INLINE.keys.forEach(k=>R.style.removeProperty(k));TOK_INLINE.keys=[];if(!TOK_INLINE.on)return;
    const dk=R.dataset.theme==='dark',w=innerWidth,m={};
    Object.entries(OV.root||{}).forEach(([k,v])=>{if(dk&&/^--s-/.test(k))return;m[k]=v;});
    if(dk)Object.assign(m,OV.dark||{});
    Object.assign(m,(w>=1024?OV.desktop:w>=768?OV.tablet:OV.mobile)||{});
    Object.entries(m).forEach(([k,v])=>{R.style.setProperty(k,v);TOK_INLINE.keys.push(k);});tokTextRefresh();}
  function tokVerify(){const OV=window.__tokOverrides||{};const hexes=Object.entries(OV.root||{}).filter(([k,v])=>/^#[0-9a-f]{6}$/i.test(String(v).trim())&&!/^--s-/.test(k));
    if(!hexes.length){if(TOK_INLINE.on){TOK_INLINE.on=false;tokInlineApply();}return;}
    if(TOK_INLINE.on){tokInlineApply();return;}
    const cs=getComputedStyle(document.documentElement);const bad=hexes.slice(0,3).some(([k,v])=>cs.getPropertyValue(k).trim().toLowerCase()!==String(v).trim().toLowerCase());
    if(bad){TOK_INLINE.on=true;window.__tokApplyMode='inline';try{console.info('[cdl] token 覆寫改用 inline style 套用（樣式表路徑未生效）');}catch(e){}tokInlineApply();}
    else window.__tokApplyMode='sheet';}
  new MutationObserver(()=>{if(TOK_INLINE.on)tokInlineApply();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  {let rt;addEventListener('resize',()=>{if(!TOK_INLINE.on)return;clearTimeout(rt);rt=setTimeout(tokInlineApply,120);});}
  function dynCss(el,css){
    el.textContent=css;setTimeout(tokTextRefresh,0);if(el.id==='tokenOverrides')setTimeout(tokVerify,0);
    const H=window.__dynCssRules||(window.__dynCssRules={}),id=el.id;
    let host=null;try{host=[...document.styleSheets].find(sh=>{try{return sh.ownerNode&&!sh.ownerNode.id&&sh.cssRules&&sh.cssRules.length>50;}catch(e){return false;}})||null;}catch(e){}
    if(host&&H[id]){H[id].forEach(r=>{const i=[...host.cssRules].indexOf(r);if(i>=0)try{host.deleteRule(i);}catch(e){}});}
    H[id]=[];
    let ok=false;try{ok=!!el.sheet&&(!css.trim()||el.sheet.cssRules.length>0);}catch(e){}
    if(ok||!host||!css.trim())return;
    let d=0,st=0;for(let i=0;i<css.length;i++){const ch=css[i];if(ch==='{')d++;else if(ch==='}'){d--;if(d===0){const t=css.slice(st,i+1).trim();st=i+1;
      if(t)try{const k=host.insertRule(t,host.cssRules.length);H[id].push(host.cssRules[k]);}catch(e){}}}}
  }
  function applyTokOverrides(){
    const OV=window.__tokOverrides; if(!OV)return;
    let ovr=document.getElementById('tokenOverrides');
    if(!ovr){ovr=document.createElement('style');ovr.id='tokenOverrides';document.head.appendChild(ovr);}
    const blk=o=>Object.entries(o).map(([k,v])=>k+':'+v+';').join('');const has=o=>o&&Object.keys(o).length>0;
    let css='';
    if(has(OV.root))css+=':root{'+blk(OV.root)+'}';
    if(has(OV.dark))css+=':root[data-theme="dark"]{'+blk(OV.dark)+'}';
    if(has(OV.desktop))css+='@media(min-width:1024px){:root{'+blk(OV.desktop)+'}}';
    if(has(OV.tablet))css+='@media(min-width:768px) and (max-width:1023px){:root{'+blk(OV.tablet)+'}}';
    if(has(OV.mobile))css+='@media(max-width:767px){:root{'+blk(OV.mobile)+'}}';
    dynCss(ovr,css);
  }
  /* ── 元件級 Token 綁定（實驗，垂直切片：button／tag）──
   * 元件 CSS 的屬性走「元件槽 var(--元件-槽, var(--預設token))」；這裡讓專案把某槽換綁到同類別的另一顆 token。
   * 只寫專案層（存進 export 的 tokens.bindings），不碰共用引擎；粒度＝專案內該元件全體；類別鎖（spacing 槽只能選 --sp-*）。*/
  const TOKEN_SLOTS={
    /* ── Basic ── */
    button:[{slot:'--btn-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'}],
    input:[{slot:'--field-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
           {slot:'--field-pad-x',label:'水平內距 padding-x',cat:'spacing',def:'--sp-3'},
           {slot:'--field-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-3'},
           {slot:'--field-fs',label:'文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    dropdown:[{slot:'--ddmenu-radius',label:'選單圓角 radius',cat:'radius',def:'--r-sm'},
              {slot:'--ddopt-pad-x',label:'選項水平內距 padding-x',cat:'spacing',def:'--sp-4'},
              {slot:'--ddopt-gap',label:'選項圖文間距 gap',cat:'spacing',def:'--sp-3'},
              {slot:'--ddopt-fs',label:'選項文字級別 font-size',cat:'typography',def:'--fs-h11'}],
    tab:[{slot:'--tab-radius',label:'圓角 radius（容器／藥丸）',cat:'radius',def:'--r-pill'},
         {slot:'--tab-pad-x',label:'水平內距 padding-x',cat:'spacing',def:'--sp-5'},
         {slot:'--tab-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-2'},
         {slot:'--tab-fs',label:'文字級別 font-size',cat:'typography',def:'--fs-h11'}],
    menu:[{slot:'--mn-item-radius',label:'項目圓角 radius',cat:'radius',def:'--r-sm'},
          {slot:'--mn-gap',label:'項目圖文間距 gap',cat:'spacing',def:'--sp-3'}],
    'action-menu':[{slot:'--am-item-radius',label:'項目圓角 radius',cat:'radius',def:'--r-sm'},
                   {slot:'--am-item-pad',label:'項目內距 padding',cat:'spacing',def:'--sp-2'},
                   {slot:'--am-gap',label:'項目圖文間距 gap',cat:'spacing',def:'--sp-3'},
                   {slot:'--am-fs',label:'項目文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    breadcrumb:[{slot:'--bc-gap',label:'項目間距 gap',cat:'spacing',def:'--sp-3'},
                {slot:'--bc-fs',label:'文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    pagination:[{slot:'--pg-btn-radius',label:'頁碼鈕圓角 radius',cat:'radius',def:'--r-sm'},
                {slot:'--pg-gap',label:'頁碼間距 gap',cat:'spacing',def:'--sp-2'}],
    notification:[{slot:'--nt-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                  {slot:'--nt-pad',label:'內距 padding',cat:'spacing',def:'--sp-4'},
                  {slot:'--nt-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-3'},
                  {slot:'--nt-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    tooltip:[{slot:'--tt-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'}],
    splitter:[{slot:'--spl-radius',label:'外框圓角 radius',cat:'radius',def:'--r-md'}],
    'scroll-area':[{slot:'--sca-radius',label:'外框圓角 radius',cat:'radius',def:'--r-md'}],
    carousel:[{slot:'--crs-radius',label:'圓角 radius',cat:'radius',def:'--r-md'}],
    command:[{slot:'--cmd-radius',label:'面板圓角 radius',cat:'radius',def:'--r-lg'}],
    dropzone:[{slot:'--drz-radius',label:'拖曳區圓角 radius',cat:'radius',def:'--r-md'}],
    'table-toolbar':[{slot:'--ttb-radius',label:'外框圓角 radius',cat:'radius',def:'--r-sm'},
                     {slot:'--ttb-bar-radius',label:'浮動批次列圓角 radius',cat:'radius',def:'--r-md'},
                     {slot:'--ttb-gap',label:'工具列間距 gap',cat:'spacing',def:'--sp-3'}],
    descriptions:[{slot:'--dsc-gap',label:'列間距 gap',cat:'spacing',def:'--sp-4'},{slot:'--dsc-fs',label:'值文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    avatar:[{slot:'--avt-radius',label:'圓角 radius（圓角方）',cat:'radius',def:'--r-md'}],
    chip:[{slot:'--chp-radius',label:'圓角 radius',cat:'radius',def:'--r-pill'},{slot:'--chp-pad-x',label:'水平內距 padding-x',cat:'spacing',def:'--sp-4'},{slot:'--chp-fs',label:'文字級別 font-size',cat:'typography',def:'--fs-h11'}],
    segmented:[{slot:'--sgm-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},{slot:'--sgm-pad-x',label:'選項水平內距 padding-x',cat:'spacing',def:'--sp-4'},{slot:'--sgm-fs',label:'文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    field:[{slot:'--fld-gap',label:'標籤↔欄位間距 gap',cat:'spacing',def:'--sp-2'},{slot:'--fld-label-fs',label:'標籤文字級別 font-size',cat:'typography',def:'--fs-h11'}],
    'app-shell':[{slot:'--shl-radius',label:'外框圓角 radius',cat:'radius',def:'--r-md'}],
    empty:[{slot:'--emp-pad',label:'上下內距 padding',cat:'spacing',def:'--sp-7'},{slot:'--emp-gap',label:'元素間距 gap',cat:'spacing',def:'--sp-3'},{slot:'--emp-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h9'}],
    alert:[{slot:'--al-radius',label:'圓角 radius',cat:'radius',def:'--r-md'},{slot:'--al-pad',label:'內距 padding',cat:'spacing',def:'--sp-4'},
           {slot:'--al-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-3'},{slot:'--al-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    popover:[{slot:'--pop-radius',label:'圓角 radius',cat:'radius',def:'--r-md'},{slot:'--pop-pad',label:'內距 padding',cat:'spacing',def:'--sp-4'},
             {slot:'--pop-gap',label:'內容間距 gap',cat:'spacing',def:'--sp-3'},{slot:'--pop-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    skeleton:[{slot:'--sk-radius',label:'圓角 radius（文字／矩形）',cat:'radius',def:'--r-sm'}],
    loader:[{slot:'--ld-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-3'}],
    tag:[{slot:'--tg-pad-x',label:'水平內距 padding-x',cat:'spacing',def:'--sp-3'},
         {slot:'--tg-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-1'},
         {slot:'--tg-fs',label:'文字級別 font-size',cat:'typography',def:'--fs-h12'}],
    price:[{slot:'--pr-gap',label:'數字間距 gap',cat:'spacing',def:'--sp-2'}],
    image:[{slot:'--im-radius',label:'圓角 radius（rounded 變體）',cat:'radius',def:'--r-lg'}],
    /* ── Complex ── */
    header:[{slot:'--hdr-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
            {slot:'--hdr-pad-x',label:'水平內距 padding-x',cat:'spacing',def:'--sp-4'},
            {slot:'--hdr-gap',label:'區塊間距 gap',cat:'spacing',def:'--sp-5'}],
    footer:[{slot:'--ftr-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
            {slot:'--ftr-pad',label:'內距 padding',cat:'spacing',def:'--sp-5'}],
    'section-head':[{slot:'--sch-gap',label:'標題↔動作間距 gap',cat:'spacing',def:'--sp-5'},
                    {slot:'--sch-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h8'}],
    list:[{slot:'--lst-radius',label:'容器圓角 radius',cat:'radius',def:'--r-sm'}],
    'list-item':[{slot:'--lst-item-pad',label:'列內距 padding',cat:'spacing',def:'--sp-3'},
                 {slot:'--lst-item-gap',label:'列圖文間距 gap',cat:'spacing',def:'--sp-4'},
                 {slot:'--lst-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    collapse:[{slot:'--cps-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
              {slot:'--cps-head-pad',label:'標題列內距 padding',cat:'spacing',def:'--sp-4'},
              {slot:'--cps-head-gap',label:'標題列間距 gap',cat:'spacing',def:'--sp-3'},
              {slot:'--cps-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    modal:[{slot:'--mdl-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
           {slot:'--mdl-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h9'}],
    drawer:[{slot:'--drw-radius',label:'面板圓角 radius',cat:'radius',def:'--r-sm'},
            {slot:'--drw-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    'floating-line':[{slot:'--flo-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                     {slot:'--flo-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-4'}],
    step:[{slot:'--stp-gap',label:'節點↔標籤間距 gap',cat:'spacing',def:'--sp-3'},
          {slot:'--stp-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h11'},
          {slot:'--stp-seg-gap',label:'精簡型段落間距 gap',cat:'spacing',def:'--sp-1'},
          {slot:'--stp-fs-cur',label:'精簡型目前步驟文字級別 font-size',cat:'typography',def:'--fs-h9'},
          {slot:'--stp-tl-gap',label:'時間軸節點↔內容間距 gap',cat:'spacing',def:'--sp-4'}],
    quantity:[{slot:'--qty-radius',label:'圓角 radius（外框變體）',cat:'radius',def:'--r-sm'}],
    progress:[{slot:'--prg-radius',label:'圓角 radius',cat:'radius',def:'--r-pill'}],
    /* ── Card ── */
    card:[{slot:'--crd-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
          {slot:'--crd-body-gap',label:'內文間距 gap',cat:'spacing',def:'--sp-2'},
          {slot:'--crd-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    'product-card':[{slot:'--pcd-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                    {slot:'--pcd-pad',label:'內距 padding',cat:'spacing',def:'--sp-3'},
                    {slot:'--pcd-name-fs',label:'品名文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    'category-tile':[{slot:'--cat-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                     {slot:'--cat-pad',label:'內距 padding',cat:'spacing',def:'--sp-4'},
                     {slot:'--cat-gap',label:'圖文間距 gap',cat:'spacing',def:'--sp-4'},
                     {slot:'--cat-name-fs',label:'名稱文字級別 font-size',cat:'typography',def:'--fs-h10'}],
    'article-card':[{slot:'--art-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                    {slot:'--art-body-gap',label:'內文間距 gap',cat:'spacing',def:'--sp-3'},
                    {slot:'--art-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h9'}],
    'person-card':[{slot:'--psc-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                   {slot:'--psc-pad',label:'內距 padding',cat:'spacing',def:'--sp-3'},
                   {slot:'--psc-gap',label:'照片↔底列間距 gap',cat:'spacing',def:'--sp-3'}],
    'profile-card':[{slot:'--bpf-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                    {slot:'--bpf-pad',label:'內距 padding',cat:'spacing',def:'--sp-5'},
                    {slot:'--bpf-name-fs',label:'名稱文字級別 font-size',cat:'typography',def:'--fs-h8'}],
    'metric-card':[{slot:'--mtc-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                   {slot:'--mtc-pad',label:'內距 padding',cat:'spacing',def:'--sp-5'},
                   {slot:'--mtc-num-fs',label:'數值文字級別 font-size',cat:'typography',def:'--fs-h5'}],
    'invite-card':[{slot:'--ivc-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                   {slot:'--ivc-pad',label:'內距 padding',cat:'spacing',def:'--sp-5'},
                   {slot:'--ivc-gap',label:'區塊間距 gap',cat:'spacing',def:'--sp-4'}],
    'widget-card':[{slot:'--wdg-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                   {slot:'--wdg-pad',label:'內距 padding',cat:'spacing',def:'--sp-6'},
                   {slot:'--wdg-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h9'}],
    /* CARDS5:v1 */
    'trend-card':[{slot:'--trd-radius',label:'圓角 radius',cat:'radius',def:'--r-lg'},
                  {slot:'--trd-pad',label:'內距 padding',cat:'spacing',def:'--sp-5'},
                  {slot:'--trd-title-fs',label:'標題文字級別 font-size',cat:'typography',def:'--fs-h8'}],
    'media-card':[{slot:'--mdc-radius',label:'圓角 radius',cat:'radius',def:'--r-lg'}],
    'weather-card':[{slot:'--wtc-radius',label:'圓角 radius',cat:'radius',def:'--r-lg'},
                    {slot:'--wtc-pad',label:'內距 padding',cat:'spacing',def:'--sp-6'}],
    'player-card':[{slot:'--plc-radius',label:'圓角 radius',cat:'radius',def:'--r-lg'},
                   {slot:'--plc-pad',label:'內距 padding',cat:'spacing',def:'--sp-6'},
                   {slot:'--plc-title-fs',label:'曲名文字級別 font-size',cat:'typography',def:'--fs-h6'}],
    'ticket-card':[{slot:'--tkc-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
                   {slot:'--tkc-pad',label:'內距 padding',cat:'spacing',def:'--sp-6'},
                   {slot:'--tkc-code-fs',label:'機場代碼文字級別 font-size',cat:'typography',def:'--fs-h4'}],
    /* ── Table & Chart ── */
    table:[{slot:'--tbl-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'}],
    chart:[{slot:'--cht-radius',label:'圖表卡圓角 radius',cat:'radius',def:'--r-sm'},
           {slot:'--cht-gap',label:'圖表↔圖例間距 gap',cat:'spacing',def:'--sp-3'}],
    'tree-view':[{slot:'--trv-radius',label:'容器圓角 radius',cat:'radius',def:'--r-sm'},
                 {slot:'--trv-indent',label:'層級縮排 indent',cat:'spacing',def:'--sp-6'},
                 {slot:'--trv-fs',label:'文字級別 font-size',cat:'typography',def:'--fs-h11'}],
    'schedule-chart':[{slot:'--gnt-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'}],
    calendar:[{slot:'--cal-radius',label:'圓角 radius',cat:'radius',def:'--r-sm'},
              {slot:'--cal-gap',label:'區塊間距 gap',cat:'spacing',def:'--sp-2'}],
  };
  const TOK_POOLS={
    spacing:['--sp-0','--sp-1','--sp-2','--sp-3','--sp-4','--sp-5','--sp-6','--sp-7','--sp-8','--sp-9'],
    radius:['--r-none','--r-xs','--r-sm','--r-md','--r-lg','--r-xl','--r-2xl','--r-pill'],
    typography:['--fs-h1','--fs-h2','--fs-h3','--fs-h4','--fs-h5','--fs-h6','--fs-h7','--fs-h8','--fs-h9','--fs-h10','--fs-h11','--fs-h12'],
  };
  function tokVal(tok){return getComputedStyle(document.documentElement).getPropertyValue(tok).trim();}
  function applyCompBindings(){ // 把 __compBindings 疊成一段 :root{ --槽:var(--新token) }，全站該元件生效
    let st=document.getElementById('bindOverrides');
    if(!st){st=document.createElement('style');st.id='bindOverrides';document.head.appendChild(st);}
    const B=window.__compBindings||{}; let css=':root{';
    Object.values(B).forEach(slots=>Object.entries(slots).forEach(([slot,tok])=>{if(tok)css+=slot+':var('+tok+');';}));
    dynCss(st,css+'}');
  }
  // 專案模式下：把「變數篩選器」dcard 包進一個有錨點的段落「變數與 Token」（所有元件頁一致，即使還沒有綁定卡）
  function ensureVarTokenSection(host){
    let sec=host.querySelector('#sec-vartoken'); if(sec)return sec;
    const bslot=host.querySelector('[data-bento-slot="vartoken"]'); if(bslot)return bslot; // bento 版型：篩選器／Token 卡留在右欄，不包段落  // 母庫與專案模式都建段落＋錨點
    const filter=host.querySelector('.dcard:not(.bind-dcard)'); if(!filter)return null;
    sec=ce('section','block');sec.id='sec-vartoken';
    sec.innerHTML='<h2><span class="bh-t">變數與 Token</span><span class="bh-d">篩選要保留的變體</span></h2>';
    filter.parentNode.insertBefore(sec,filter);                    // 段落插在原篩選器位置
    sec.appendChild(filter);                                       // 變數篩選器移進段落
    return sec;
  }
  function renderBindPanel(host,compId){
    const slots=TOKEN_SLOTS[compId]; if(!slots||!slots.length)return;
    const isProj=!!window.__dsProject||!!(window.__pjEditing&&window.__pjEditing());   // SHELL8:v1 ?project= 或開新專案流程已套用提案＝可編輯；母庫模式＝唯讀示意（不給改綁定）
    const B=window.__compBindings||(window.__compBindings={}); const bc=B[compId]||(B[compId]={});
    // 沿用「變數篩選器」那張 .dcard 的結構＋全域委派收合（點 .dcard-head 即 toggle）；標題/內文/pill/下拉全用 library 既有 class 與原子
    const card=ce('div','dcard bind-dcard'+(isProj?'':' bind-readonly')); // 母庫＝唯讀：欄位 dim＋不可互動
    const head=ce('button','dcard-head');head.type='button';
    const title=ce('span','dh-title');title.textContent='Token 綁定';
    const pill=tagEl('soft','neutral','default','round');pill.querySelector('span').textContent=isProj?'實驗 · 專案層':'僅專案層可編輯'; // library Tag 原子（中性，meta 標籤不隨專案色變動）
    const chev=ce('span','dh-chevron');chev.innerHTML=ICON_CARET;
    head.append(title,pill,chev);
    const bodyEl=ce('div','dcard-body');
    const hint=ce('p','hint');
    hint.innerHTML=isProj
      ?'把這顆元件某個屬性從預設 token 換綁成<b>同類別</b>的其他 token（例：padding 從 <code>--sp-3</code> 換 <code>--sp-4</code>）。只影響<b>本專案的這顆元件</b>、不動共用母庫；換綁寫進匯出 <code>tokens.bindings</code>，之後由 Figma 同步改對應 Variable。'
      :'這顆元件可換綁的屬性一覽——把某屬性從預設 token 換成<b>同類別</b>的其他 token（例：padding 從 <code>--sp-3</code> 換 <code>--sp-4</code>）。<b>母元件庫僅供預覽、不可編輯</b>；要實際換綁請在<b>專案模式</b>（網址帶 <code>?project=</code>）操作，只影響該專案、不動共用母庫。'; // 母庫唯讀說明
    bodyEl.appendChild(hint);
    const rows=ce('div','bindrows');
    slots.forEach(s=>{
      const fw=ce('div','fieldwrap');                       // library 欄位包裝：.fl 標籤 → ddField 下拉 → .fh 提示
      const fl=ce('span','fl');fl.innerHTML=s.label+' <code>'+s.cat+'</code>';
      const pool=(TOK_POOLS[s.cat]||[]).map(tok=>({value:tok,label:tok+(tokVal(tok)?'（'+tokVal(tok)+'）':'')+(tok===s.def?' · 預設':'')}));
      const picker=ddField('outline',Object.assign({options:pool,value:bc[s.slot]||s.def},
        isProj?{onChange:v=>{ if(v===s.def){delete bc[s.slot];}else{bc[s.slot]=v;} applyCompBindings(); }}:{})); // 母庫不接 onChange（＋CSS pointer-events:none 擋互動）
      const fh=ce('span','fh');fh.textContent='預設 '+s.def;
      fw.append(fl,picker,fh);rows.appendChild(fw);
    });
    bodyEl.appendChild(rows);
    card.append(head,bodyEl);
    const sec=ensureVarTokenSection(host);          // 取得（或建立）「變數與 Token」段落
    if(sec){ const d=sec.querySelector('.bh-d'); if(d)d.textContent=isProj?'篩選要保留的變體，並把屬性換綁其他 token':'篩選變體，並檢視可換綁的 token（母庫唯讀）'; sec.appendChild(card); } // 有綁定卡→副標補上 token 說明
    else host.appendChild(card);
  }
  function dsBuildExport(){
    const logo={light:PROJECT_LOGOS.light||null,dark:PROJECT_LOGOS.dark||null};
    const rep=choiceReport();
    const comp={selected:[...SUMSEL],axes:{},counts:{}};
    [...SUMSEL].forEach(id=>{const spec=DIAL_SPECS[id];if(!spec||!rep[id])return;comp.axes[id]={};spec.order.forEach(k=>comp.axes[id][k]=rep[id][k]);comp.counts[id]=rep[id].count;});
    const disabled=[...(window.__tokDisabled||[])].sort();
    const bindings=window.__compBindings||{};
    const state={tokens:window.__tokOverrides||{},logo,disabled,bindings,components:comp};
    return {tokens:{overrides:window.__tokOverrides||{},logo,disabled,bindings},components:comp,state};
  }
  function dsDownload(name,obj){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  function dsDownloadText(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);} // 純文字檔下載（.scss / .md）
  /* ── 專案元件庫版本化（Phase F）：CTA＝儲存並更新 vN、防呆彈窗、進站版本比對；只動專案層、不碰共用引擎 ── */
  function dsVerKey(){return 'dsv:'+(window.__dsProject||'');}
  function dsToast(msg){const b=document.getElementById('dsExportBtn');if(!b)return;const s=b.querySelector('span');const o=s.dataset.o||s.textContent;s.textContent=msg;setTimeout(()=>{s.textContent=o;},1800);}
  function updateBadgeVersion(){
    const b=document.getElementById('dsExportBtn');if(b){const s=b.querySelector('span');s.textContent=window.__dsProject?'儲存並更新':'匯出（下載）';s.dataset.o=s.textContent;}
    const pj=document.getElementById('dsBadgeProj');if(pj&&window.__dsProject){(pj.querySelector('span')||pj).textContent=window.__dsProject+' · v'+(window.__dsVersion||0);}   /* Tag 原子：改內層文字 */ // 版本號跟著專案名走
    const sf=document.getElementById('sbFoot');if(sf)sf.innerHTML=sbFootHTML(); // 選單底部版本號同步
    const fv=document.getElementById('ftrVer');if(fv){const ver=window.__dsProject?('v'+(window.__dsVersion||0)):((CHANGELOG_DATA[0]&&CHANGELOG_DATA[0].v)||'');fv.textContent=ver?' · '+ver:'';} // footer 尾端版本號
  }
  // 目前狀態的可比較快照（token override + logo + 選用元件 + 各軸）
  function dsSnap(){
    const rep=(typeof choiceReport==='function')?choiceReport():{}; const axes={};
    [...SUMSEL].forEach(id=>{const spec=DIAL_SPECS[id];if(spec&&rep[id]){axes[id]={};spec.order.forEach(k=>axes[id][k]=(rep[id][k]||[]));}});
    return {ov:JSON.parse(JSON.stringify(window.__tokOverrides||{})),logo:{light:PROJECT_LOGOS.light||null,dark:PROJECT_LOGOS.dark||null},sel:[...SUMSEL].sort(),axes,disabled:[...(window.__tokDisabled||[])].sort(),bindings:JSON.parse(JSON.stringify(window.__compBindings||{}))};
  }
  // baseline → current 差異 → [{t:'add'|'rm'|'chg', s}]
  function dsDiff(a,b){
    const out=[];
    ['root','dark','desktop','tablet','mobile'].forEach(m=>{
      const oa=(a.ov&&a.ov[m])||{}, ob=(b.ov&&b.ov[m])||{};
      new Set([...Object.keys(oa),...Object.keys(ob)]).forEach(k=>{
        const va=oa[k], vb=ob[k]; if(va===vb)return;
        const tag=m==='root'?'':' ('+m+')';
        if(va===undefined)out.push({t:'add',s:'token '+k+tag+' → '+vb});
        else if(vb===undefined)out.push({t:'rm',s:'token '+k+tag+' 移除'});
        else out.push({t:'chg',s:'token '+k+tag+'：'+va+' → '+vb});
      });
    });
    ['light','dark'].forEach(k=>{ if((a.logo[k]||null)!==(b.logo[k]||null)) out.push({t:'chg',s:'logo（'+k+'）更新'}); });
    const sa=new Set(a.sel), sb=new Set(b.sel);
    b.sel.filter(x=>!sa.has(x)).forEach(id=>out.push({t:'add',s:'元件 '+id}));
    a.sel.filter(x=>!sb.has(x)).forEach(id=>out.push({t:'rm',s:'元件 '+id+' 移除'}));
    b.sel.filter(x=>sa.has(x)).forEach(id=>{
      const axa=a.axes[id]||{}, axb=b.axes[id]||{};
      new Set([...Object.keys(axa),...Object.keys(axb)]).forEach(k=>{
        const la=(axa[k]||[]).join(','), lb=(axb[k]||[]).join(',');
        if(la!==lb)out.push({t:'chg',s:id+' · '+k+'：['+la+'] → ['+lb+']'});
      });
    });
    const da=new Set(a.disabled||[]), db=new Set(b.disabled||[]);
    (b.disabled||[]).filter(x=>!da.has(x)).forEach(k=>out.push({t:'rm',s:'停用 '+k}));
    (a.disabled||[]).filter(x=>!db.has(x)).forEach(k=>out.push({t:'add',s:'恢復 '+k}));
    const ba=a.bindings||{}, bb=b.bindings||{};
    new Set([...Object.keys(ba),...Object.keys(bb)]).forEach(cid=>{
      const sa=ba[cid]||{}, sb=bb[cid]||{};
      new Set([...Object.keys(sa),...Object.keys(sb)]).forEach(slot=>{
        const va=sa[slot], vb=sb[slot]; if(va===vb)return;
        if(va===undefined)out.push({t:'add',s:'綁定 '+cid+' '+slot+' → '+vb});
        else if(vb===undefined)out.push({t:'rm',s:'綁定 '+cid+' '+slot+' 還原'});
        else out.push({t:'chg',s:'綁定 '+cid+' '+slot+'：'+va+' → '+vb});
      });
    });
    return out;
  }
  /* 全站確認框：一律取用 library Modal 元件——單純確認＝popup（置中小卡＋並排按鈕）；帶變更清單／自訂內容＝modal（標題列＋可捲內容＋右對齊 footer） */
  function dsDialog(o){
    const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    const ovl=ce('div','mdl-overlay mdl-fixed ds-ovl');
    let bd=null;
    if(o.changes&&o.changes.length)bd='<ul class="ds-chg">'+o.changes.map(c=>'<li class="'+c.t+'">'+esc(c.s)+'</li>').join('')+'</ul>';
    else if(o.changes)bd='<p class="mdl-desc">沒有變更。</p>';
    else if(o.bodyHTML)bd=o.bodyHTML;
    let card,cancel=null,ok=null;
    if(bd==null){                                   // popup：標題＋說明＋次／主並排
      card=ce('div','mdl-card mdl-kind-popup');const body=ce('div','mdl-pop-body');
      const t=ce('div','mdl-pop-title');t.id='dsDlgT';t.textContent=o.title;body.appendChild(t);
      if(o.sub){const d=ce('p','mdl-desc');d.textContent=o.sub;body.appendChild(d);}
      card.appendChild(body);
      const arrange=o.cancelText&&o.okText?'row':(o.okText?'primary':'secondary');
      const foot=mdlPopFoot({secondary:esc(o.cancelText||''),primary:{cls:o.danger?'i-danger':'i-primary',label:esc(o.okText||'')}},{arrange},true);
      card.appendChild(foot);cancel=foot.querySelector('[data-mdl-cancel]');ok=foot.querySelector('.v-solid');
    }else{                                          // modal：header（標題＋副標＋×）＋內容＋footer
      card=ce('div','mdl-card mdl-kind-modal');const head=ce('div','mdl-mhead');const ht=ce('div','mdl-mhead-txt');
      ht.innerHTML='<div class="mdl-title" id="dsDlgT">'+esc(o.title)+'</div>'+(o.sub?'<div class="mdl-sub">'+esc(o.sub)+'</div>':'');
      const x=mdlClose(false);x.type='button';head.append(ht,x);card.appendChild(head);
      const ct=ce('div','mdl-content');ct.innerHTML=bd;card.appendChild(ct);
      const foot=mdlModalFoot({cancel:esc(o.cancelText||'取消'),confirm:esc(o.okText||'確定')},true);
      cancel=foot.querySelector('[data-mdl-cancel]');ok=foot.querySelector('.v-solid');
      if(!o.cancelText&&cancel)cancel.remove();if(!o.okText&&ok){ok.remove();ok=null;}
      card.appendChild(foot);x.onclick=()=>close();
    }
    card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','dsDlgT');card.tabIndex=-1;
    const ret=document.activeElement;
    const key=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}};
    function close(){document.removeEventListener('keydown',key,true);ovl.classList.add('is-closing');afterAnim(ovl,()=>ovl.remove());
      if(ret&&ret.isConnected&&ret.focus)ret.focus({preventScroll:true});}
    if(cancel){cancel.type='button';cancel.onclick=close;}
    if(ok){ok.type='button';ok.onclick=()=>{close();o.onOk&&o.onOk();};}
    ovl.appendChild(card);document.body.appendChild(ovl);
    document.addEventListener('keydown',key,true);
    ovl.addEventListener('mousedown',e=>{if(e.target===ovl)close();});
    requestAnimationFrame(()=>(ok||cancel||card).focus({preventScroll:true}));
  }
  // CTA：先算 diff，確認再寫；無 proj（公開/無 server）仍給 diff 確認後下載
  function dsSave(){
    const proj=window.__dsProject;
    const changes=dsDiff(window.__dsBaseline||dsSnap(), dsSnap());
    if(!proj){ dsDialog({title:'匯出（下載）',sub:changes.length+' 項變更',changes,okText:'下載',cancelText:'取消',onOk:dsExport}); return; }
    if(!changes.length){ dsToast('無變更'); return; }
    const v=window.__dsVersion||0;
    dsDialog({title:'儲存並更新此元件庫',sub:'v'+v+' → v'+(v+1)+'　·　'+changes.length+' 項變更',changes,okText:'確定更新',cancelText:'取消',onOk:()=>dsCommit(changes)});
  }
  function dsCommit(changes){
    const proj=window.__dsProject; const payload=dsBuildExport();
    payload.version={historyEntry:{at:new Date().toISOString(),source:'website',changes:changes.map(c=>c.s)}};
    fetch('/api/project/'+encodeURIComponent(proj)+'/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(r=>r.json()).then(()=>{ window.__dsVersion=(window.__dsVersion||0)+1; window.__dsBaseline=dsSnap(); localStorage.setItem(dsVerKey(),String(window.__dsVersion)); updateBadgeVersion(); dsToast('已更新 → v'+window.__dsVersion+' ✓'); })
      .catch(()=>{ const p=dsBuildExport(); dsDownload('tokens.export.json',p.tokens);dsDownload('components.export.json',p.components); dsToast('無 server · 改用下載'); });
  }
  // 純下載（公開模式或 server fallback）
  function dsExport(){ const p=dsBuildExport(); dsDownload('tokens.export.json',p.tokens);dsDownload('components.export.json',p.components); dsToast('已下載 ✓'); }
  // 進站版本比對：專案層版本被（Figma 同步等）推進過 → 跳「版本已更新」說明
  function dsVersionPopup(){
    const proj=window.__dsProject; if(!proj)return;
    const vinfo=window.__dsProjectData&&window.__dsProjectData.version; if(!vinfo)return;
    const cur=vinfo.version||0;
    const seenRaw=localStorage.getItem(dsVerKey());
    const seen=seenRaw==null?null:parseInt(seenRaw,10);
    if(seen==null){ localStorage.setItem(dsVerKey(),String(cur)); return; } // 首訪靜默記住
    if(cur>seen){
      const changes=[];
      (vinfo.history||[]).filter(h=>h.v>seen).forEach(h=>{(h.changes||[]).forEach(s=>changes.push({t:'chg',s:'v'+h.v+(h.source==='figma'?'（Figma）':'')+'：'+s}));});
      dsDialog({title:'版本已更新',sub:'v'+seen+' → v'+cur,changes:changes.length?changes:null,okText:'知道了'});
      localStorage.setItem(dsVerKey(),String(cur));
    }
  }
  function showStudioBadge(proj){
    const tb=document.querySelector('.topbar'); if(!tb||document.getElementById('dsBadge'))return;
    const wrap=document.createElement('div');wrap.id='dsBadge';wrap.className='ds-badge';
    if(proj){const tg=tagEl('soft','neutral','default','round','m');tg.classList.add('ds-badge-proj');tg.id='dsBadgeProj';tg.querySelector('span').textContent=proj;wrap.appendChild(tg);}   /* 2026-11-10 專案名稱取用 Tag 原子 */
    /* MODE-COPY:v1 母庫提示「此為母元件庫…」已移除：頂欄有瀏覽／編輯模式切換，不再需要 */
    const ghb=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});ghb.type='button';ghb.classList.add('gh-topbar'); // CTA 左邊的 GitHub 外連入口（library 外框次要原子）
    ghb.querySelector('span').textContent='Github';ghb.insertAdjacentHTML('afterbegin',ICON_GITHUB);
    ghb.onclick=()=>window.open('https://github.com/edward890131/cool-ds-library','_blank','noopener');
    wrap.appendChild(ghb);
    const btn=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:true});btn.type='button';if(proj){btn.id='dsExportBtn';btn.onclick=dsSave;}
    else{btn.id='dsNewProjBtn';btn.classList.add('has-lead');btn.innerHTML=ICON_PLUS+'<span>開啟新專案</span>';   // SHELL8:v1 母庫：匯出（下載）→ 開啟新專案（匯出在流程「匯出」步驟／浮動列）
      btn.onclick=()=>{ if(typeof FLW_UI!=='undefined'&&FLW_UI)return; if(location.hash==='#start')flwOpen(); else location.hash='start'; };} // 兩模式都 s
    wrap.appendChild(btn);
    tb.appendChild(wrap); // 匯出 badge 靠右（spacer 後）
    { const pj=wrap.querySelector('#dsBadgeProj'),bd=tb.querySelector('.brand'); if(pj&&bd)bd.insertAdjacentElement('afterend',pj); }   // 母庫提示／專案名移到 logo 右側（細線分隔）
    updateBadgeVersion();
  }
  function applyProposal(p){
    if(!p)return;
    const tok=p.tokens&&(p.tokens.overrides||p.tokens); // 兼容 {overrides} 或直接 OV 結構
    if(tok&&typeof tok==='object'){window.__tokOverrides=Object.assign({root:{},dark:{},desktop:{},tablet:{},mobile:{}},tok);applyTokOverrides();}
    const dis=(p.tokens&&p.tokens.disabled)||p.disabled;
    if(Array.isArray(dis))window.__tokDisabled=new Set(dis);
    const bind=(p.tokens&&p.tokens.bindings)||p.bindings;
    window.__compBindings=(bind&&typeof bind==='object')?bind:{};
    applyCompBindings();
    const logo=p.logo||(p.tokens&&p.tokens.logo);
    if(logo){PROJECT_LOGOS.light=logo.light||null;PROJECT_LOGOS.dark=logo.dark||null;}
    if(p.components&&Array.isArray(p.components.selected)){SUMSEL.clear();p.components.selected.forEach(id=>SUMSEL.add(id));}
    if(p.components&&p.components.axes){Object.entries(p.components.axes).forEach(([id,ax])=>{if(CHOICE[id])Object.entries(ax).forEach(([k,vals])=>{if(CHOICE[id].active[k]&&Array.isArray(vals))CHOICE[id].active[k]=new Set(vals);});});}
  }
