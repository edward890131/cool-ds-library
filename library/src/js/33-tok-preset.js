  /* ==================== TOK-PRESET:v1 快速風格（2026-11-10）====================
     不用輸入數值：四組選項直接改寫 L1 token（寫進 __tokOverrides，跟手調同一份，可再微調、可匯出）。
     間距／字級依裝置 tier 各自換算（desktop／tablet／mobile 的 base 值不同）；字重、色彩全寬。「適中」＝刪掉覆寫回到預設。 */
  const TOK_BASE={sp:{desktop:[0,4,6,8,12,16,24,32,48,64],tablet:[0,4,6,8,12,16,20,28,40,56],mobile:[0,4,6,8,12,12,16,24,32,48]},
    fs:{desktop:[64,56,48,40,32,24,20,18,16,14,12,10],tablet:[52,46,40,34,28,22,20,18,16,14,12,10],mobile:[40,36,32,28,24,20,20,18,16,14,12,10]}};
  const TOK_TIERS=['desktop','tablet','mobile'];
  const TOK_NEUTRAL={cool:['#FFFFFF','#F8FAFC','#F1F5F9','#E8EDF3','#DCE3EB','#CBD5E1','#94A3B8','#64748B','#334155','#1E293B','#0F172A'],
    natural:['#FFFFFF','#FAFAFA','#F5F5F5','#EDEDED','#E0E0E0','#CCCCCC','#A1A1A1','#737373','#404040','#1F1F1F','#0F0F0F'],
    warm:['#FFFFFF','#FAFAF9','#F5F5F4','#EEECEA','#E2DFDC','#D0CBC6','#A8A29E','#78716C','#44403C','#292524','#1C1917']};
  const TOK_ACCENT={cool:['#DBEAFE','#BFDBFE','#93C5FD','#60A5FA','#2563EB','#1D4ED8','#1E40AF','#1E3A8A','#172554'],
    natural:['#DCFCE7','#BBF7D0','#86EFAC','#4ADE80','#16A34A','#15803D','#166534','#14532D','#052E16'],
    warm:['#FFEDD5','#FED7AA','#FDBA74','#FB923C','#EA580C','#C2410C','#9A3412','#7C2D12','#5A200D'],
    lively:['#FCE7F3','#FBCFE8','#F9A8D4','#F472B6','#DB2777','#BE185D','#9D174D','#831843','#500724']};
  const TOK_NSTEP=[0,50,100,200,300,400,500,600,700,800,900],TOK_ASTEP=[100,200,300,400,500,600,700,800,900];
  const TOK_PRESETS=[
    {k:'space',t:'間距',opts:[['dense','密集'],['mid','適中'],['loose','寬鬆']],
     apply:(v,OV)=>TOK_TIERS.forEach(tr=>TOK_BASE.sp[tr].forEach((b,i)=>{const n='--sp-'+i;if(v==='mid'||!i)delete OV[tr][n];else OV[tr][n]=Math.round(b*(v==='dense'?.8:1.25)/2)*2+'px';}))},
    {k:'type',t:'字級對比',opts:[['high','強烈'],['mid','適中'],['low','含蓄']],
     apply:(v,OV)=>TOK_TIERS.forEach(tr=>TOK_BASE.fs[tr].forEach((b,i)=>{const n='--fs-h'+(i+1);if(v==='mid'||i>=8)delete OV[tr][n];else OV[tr][n]=Math.round(16+(b-16)*(v==='high'?1.2:.8))+'px';}))},   /* 內文 h9–h12 不動，只拉開／收斂標題 */
    {k:'weight',t:'字重',opts:[['heavy','份量'],['mid','適中'],['light','輕盈']],
     apply:(v,OV)=>{const W={heavy:{'--fw-medium':600,'--fw-semibold':700,'--fw-bold':800,h:[700,700,700,700,600,600,600]},light:{'--fw-medium':400,'--fw-semibold':500,'--fw-bold':600,h:[500,500,500,500,400,400,400]}}[v];
       ['--fw-medium','--fw-semibold','--fw-bold'].forEach(n=>{if(W)OV.root[n]=String(W[n]);else delete OV.root[n];});
       for(let i=1;i<=7;i++){const n='--fw-h'+i;if(W)OV.root[n]=String(W.h[i-1]);else delete OV.root[n];}}},
    {k:'color',t:'用色',opts:[['neutral','中性'],['cool','冷靜'],['natural','自然'],['warm','溫暖'],['lively','活潑']],
     apply:(v,OV)=>{const N=TOK_NEUTRAL[v],B=TOK_ACCENT[v];   /* 換主色 brand（9 階）＋灰階色調；中性＝刪覆寫回到預設黑 */
       TOK_NSTEP.forEach((st,i)=>{const n='--c-neutral-'+st;if(N)OV.root[n]=N[i];else delete OV.root[n];});
       TOK_ASTEP.forEach((st,i)=>{const n='--c-brand-'+st;if(B)OV.root[n]=B[i];else delete OV.root[n];delete OV.root['--c-brand2-'+st];});}}];
  /* 第二批（2026-11-10）：圓角、陰影、動態、文字對比 */
  const TOK_RAD={sharp:{xs:0,sm:2,md:4,'2xl':12,'3xl':16,lg:[6,6,4],xl:[8,8,6]},round:{xs:4,sm:8,md:12,'2xl':28,'3xl':36,lg:[14,14,12],xl:[20,20,16]}};   /* lg／xl 依 desktop／tablet／mobile */
  const TOK_SHADOW={flat:{l:['none','none','none','none','none'],d:['none','none','none','none','none']},
    raised:{l:['0 1px 3px 0 rgba(0,0,0,.10)','0 6px 10px -2px rgba(0,0,0,.16),0 3px 6px -3px rgba(0,0,0,.14)','0 15px 24px -6px rgba(0,0,0,.18),0 6px 10px -6px rgba(0,0,0,.14)','0 30px 40px -10px rgba(0,0,0,.20),0 12px 16px -8px rgba(0,0,0,.14)','0 40px 80px -20px rgba(0,0,0,.40)'],
      d:['0 1px 3px 0 rgba(0,0,0,.6)','0 6px 10px -2px rgba(0,0,0,.7),0 3px 6px -3px rgba(0,0,0,.6)','0 15px 24px -6px rgba(0,0,0,.75),0 6px 10px -6px rgba(0,0,0,.6)','0 30px 40px -10px rgba(0,0,0,.8),0 12px 16px -8px rgba(0,0,0,.6)','0 40px 80px -20px rgba(0,0,0,.85)']}};
  const TOK_MOTION={crisp:[90,180,300,150],slow:[225,450,750,350],off:[1,1,1,0]};   /* fast／default／slow／hover-delay（ms） */
  const TOK_TEXT={soft:{l:{'--s-text-2':'var(--c-neutral-500)','--s-text-3':'var(--c-neutral-400)','--s-border-1':'var(--c-neutral-200)','--s-border-2':'var(--c-neutral-300)'},
      d:{'--s-text-2':'#84868E','--s-text-3':'#5A5D66','--s-border-1':'#1F2024','--s-border-2':'#2B2D32'}},
    high:{l:{'--s-text-1':'var(--c-neutral-900)','--s-text-2':'var(--c-neutral-700)','--s-text-3':'var(--c-neutral-600)','--s-border-1':'var(--c-neutral-400)','--s-border-2':'var(--c-neutral-500)'},
      d:{'--s-text-1':'#FFFFFF','--s-text-2':'#C4C6CC','--s-text-3':'#9A9CA4','--s-border-1':'#3A3C42','--s-border-2':'#4A4D54'}}};
  TOK_PRESETS.push(
    {k:'radius',t:'圓角',opts:[['sharp','方正'],['mid','柔和'],['round','圓潤'],['pill','膠囊']],
     apply:(v,OV)=>{const R=TOK_RAD[v==='pill'?'round':v];['xs','sm','md','2xl','3xl'].forEach(k=>{if(R)OV.root['--r-'+k]=R[k]+'px';else delete OV.root['--r-'+k];});
       TOK_TIERS.forEach((tr,i)=>['lg','xl'].forEach(k=>{if(R)OV[tr]['--r-'+k]=R[k][i]+'px';else delete OV[tr]['--r-'+k];}));
       ['--btn-radius','--field-radius'].forEach(n=>{if(v==='pill')OV.root[n]='var(--r-pill)';else delete OV.root[n];});}},
    {k:'shadow',t:'陰影',opts:[['flat','扁平'],['mid','輕柔'],['raised','立體']],
     apply:(v,OV)=>{const S=TOK_SHADOW[v];['sm','md','lg','xl','2xl'].forEach((k,i)=>{const n='--e-'+k;if(S){OV.root[n]=S.l[i];OV.dark[n]=S.d[i];}else{delete OV.root[n];delete OV.dark[n];}});}},
    {k:'motion',t:'動態',opts:[['crisp','俐落'],['mid','適中'],['slow','悠緩'],['off','靜止']],
     apply:(v,OV)=>{const M=TOK_MOTION[v];['--dur-fast','--dur-default','--dur-slow','--dur-hover-delay'].forEach((n,i)=>{if(M)OV.root[n]=M[i]+'ms';else delete OV.root[n];});}},
    {k:'text',t:'文字對比',opts:[['soft','柔和'],['mid','標準'],['high','高對比']],
     apply:(v,OV)=>{const T=TOK_TEXT[v];['--s-text-1','--s-text-2','--s-text-3','--s-border-1','--s-border-2'].forEach(n=>{delete OV.root[n];delete OV.dark[n];});
       if(T){Object.assign(OV.root,T.l);Object.assign(OV.dark,T.d);}}});
  /* CTL-H:v3 元件尺寸：控制項 xs／s／m／l ＋ Tag s／m／l 一起縮放（標準＝刪覆寫回預設） */
  const TOK_SIZE={compact:{ctl:[20,28,36,44],tag:[18,22,26]},roomy:{ctl:[28,36,44,52],tag:[22,26,30]}};
  TOK_PRESETS.push({k:'size',t:'元件尺寸',opts:[['compact','精巧'],['mid','標準'],['roomy','寬大']],
     apply:(v,OV)=>{const Z=TOK_SIZE[v];['xs','s','m','l'].forEach((k,i)=>{const n='--ctl-h-'+k;if(Z)OV.root[n]=Z.ctl[i]+'px';else delete OV.root[n];});
       ['s','m','l'].forEach((k,i)=>{const n='--tag-h-'+k;if(Z)OV.root[n]=Z.tag[i]+'px';else delete OV.root[n];});}});
  const TOK_DOT={neutral:'#1C1C20',cool:'#2563EB',natural:'#16A34A',warm:'#EA580C',lively:'#DB2777'};
  const TOK_PRESET_COLS=[['版面',['space','size','radius','shadow','motion']],['色彩與文字',['color','type','weight','text']]];   /* 相關設定排同一欄 */
  const TOK_PRESET_DEF=k=>k==='color'?'neutral':'mid';
  function tokPresetPanel(OV,onApply){const st=window.__tokPreset||(window.__tokPreset={space:'mid',type:'mid',weight:'mid',color:'neutral',radius:'mid',shadow:'mid',motion:'mid',text:'mid',size:'mid'});
    if(window.__tokPresetOpen===undefined)window.__tokPresetOpen=true;   // 預設展開；選項觸發重繪時保留收合狀態
    const box=ce('section','tok-preset'+(window.__tokPresetOpen?'':' is-closed'));box.setAttribute('aria-labelledby','tokPresetT');
    const h=ce('div','tok-preset-h');const hm=ce('div','tok-preset-hm');
    hm.innerHTML='<div class="tok-preset-t" id="tokPresetT">快速風格</div><div class="tok-preset-d">選一個方向，對應的 token 會直接帶入；之後仍可在下方逐一微調。</div>';
    const sum=ce('div','tok-preset-sum');hm.appendChild(sum);
    // 收合鈕：取用 Button 原子（text／secondary／s）＋chevron
    const tg=mkBtn({variant:'text',intent:'secondary',size:'s',trail:true,isLive:true});tg.type='button';tg.classList.add('tok-preset-tg');tg.setAttribute('aria-controls','tokPresetBody');
    const paintTg=()=>{const open=!box.classList.contains('is-closed');tg.innerHTML='<span>'+(open?'收合':'展開')+'</span>'+PI('chevron-down');tg.setAttribute('aria-expanded',String(open));};
    // 摘要：非預設選項用 Tag 原子列出；全部預設顯示「預設」
    const paintSum=()=>{sum.innerHTML='';const on=TOK_PRESETS.filter(p=>st[p.k]!==TOK_PRESET_DEF(p.k));
      (on.length?on.map(p=>p.t+'：'+p.opts.find(o=>o[0]===st[p.k])[1]):['全部預設']).forEach(t=>{const g=tagEl('soft','neutral','default','round');g.querySelector('span').textContent=t;sum.appendChild(g);});};
    tg.onclick=()=>{box.classList.toggle('is-closed');window.__tokPresetOpen=!box.classList.contains('is-closed');paintTg();paintSum();};
    // 回到預設：取用 Button 原子；全部已是預設時停用
    const rs=mkBtn({variant:'text',intent:'secondary',size:'s',isLive:true});rs.type='button';rs.classList.add('tok-preset-rs');rs.innerHTML=PI('refresh-cw')+'<span>回到預設</span>';rs.setAttribute('aria-label','回到預設');rs.title='回到預設';   /* 圖示只在手機顯示（CSS） */
    const allDef=()=>TOK_PRESETS.every(p=>st[p.k]===TOK_PRESET_DEF(p.k));
    rs.disabled=allDef();rs.classList.toggle('st-disabled',rs.disabled);rs.classList.toggle('st-default',!rs.disabled);
    rs.onclick=()=>{if(allDef())return;TOK_PRESETS.forEach(p=>{const d=TOK_PRESET_DEF(p.k);if(st[p.k]!==d){st[p.k]=d;p.apply(d,OV);}});onApply();};
    const acts=ce('div','tok-preset-acts');acts.append(rs,tg);
    h.append(hm,acts);box.appendChild(h);
    const bw=ce('div','tok-preset-bw');bw.id='tokPresetBody';const bi=ce('div','tok-preset-bi');const grid=ce('div','tok-preset-g');bi.appendChild(grid);bw.appendChild(bi);box.appendChild(bw);
    const byK=Object.fromEntries(TOK_PRESETS.map(p=>[p.k,p]));
    TOK_PRESET_COLS.forEach(([ct,ks])=>{const col=ce('div','tok-preset-col');const chd=ce('div','tok-preset-ch');chd.textContent=ct;col.appendChild(chd);
      ks.forEach(k=>{const p=byK[k];if(!p)return;const row=ce('div','tok-preset-row');const lb=ce('div','tok-preset-lb');lb.id='tokP-'+p.k;lb.textContent=p.t;
      if(!p.opts.some(o=>o[0]===st[p.k]))st[p.k]=(p.opts.find(o=>o[0]==='mid'||o[0]==='neutral')||p.opts[0])[0];
      // CHIP:v1 取用 Chip 原子（單選、m 32）；用色帶 dot 色點
      const pills=chpGroup('single','m',{labelledby:lb.id,value:st[p.k],items:p.opts.map(([k,t])=>({k,label:t,dot:p.k==='color'?TOK_DOT[k]:null})),
        onChange:k=>{st[p.k]=k;p.apply(k,OV);onApply();}});
      row.append(lb,pills);col.appendChild(row);});
      grid.appendChild(col);});
    paintTg();paintSum();
    return box;}
  /* MODE:v1 瀏覽模式的 Token 頁：只能看（取用 Alert 原子說明），輸入框唯讀、色票不開選色器 */
  function tokReadonlyNote(){const a=alEl('soft','info',{});const t=a.querySelector('.al-title'),d=a.querySelector('.al-desc');
    if(t)t.textContent='這是元件庫預設的 token';if(d)d.textContent='瀏覽模式只能看。要調整，按右上「開啟新專案」。';a.classList.add('tok-ro');
    a.querySelectorAll('.al-close').forEach(x=>x.remove());return a;}
  document.addEventListener('focusin',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('tok-hex')&&typeof dsEditing==='function'&&!dsEditing())t.readOnly=true;},true);
  document.addEventListener('click',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('tok-sw-btn')&&t.closest('#view')&&typeof dsEditing==='function'&&!dsEditing()&&current==='tokens')e.preventDefault();},true);
  function renderTokens(view){
    let ovr=document.getElementById('tokenOverrides');
    if(!ovr){ovr=document.createElement('style');ovr.id='tokenOverrides';document.head.appendChild(ovr);}
    const OV=window.__tokOverrides||(window.__tokOverrides={});
    ['root','dark','desktop','tablet','mobile'].forEach(k=>OV[k]=OV[k]||{}); // root=全寬(色彩/L2 light) · dark=L2 dark · desktop/tablet/mobile=響應式尺寸
    const layer=window.__tokLayer||(window.__tokLayer='l1');
    let refreshExport=null,exportRaf=0;   // 由下方 buildExportSection 掛上：改 token 後即時重繪匯出區 code（rAF 合併，避免拖曳色票每幀重算）
    function apply(){const blk=o=>Object.entries(o).map(([k,v])=>k+':'+v+';').join('');const has=o=>Object.keys(o).length>0;
      let css='';
      if(has(OV.root))css+=':root,:root[data-theme="light"]{'+blk(OV.root)+'}';                 // 全寬（色彩、L2 light）；亮色 L2 寫在 [data-theme=light]，要同樣具體才蓋得過
      if(has(OV.dark))css+=':root[data-theme="dark"]{'+blk(OV.dark)+'}';                          // L2 dark
      if(has(OV.desktop))css+='@media(min-width:1024px){:root{'+blk(OV.desktop)+'}}';             // 響應式各 tier 用互斥區間，避免外洩
      if(has(OV.tablet))css+='@media(min-width:768px) and (max-width:1023px){:root{'+blk(OV.tablet)+'}}';
      if(has(OV.mobile))css+='@media(max-width:767px){:root{'+blk(OV.mobile)+'}}';
      dynCss(ovr,css);
      if(refreshExport){cancelAnimationFrame(exportRaf);exportRaf=requestAnimationFrame(refreshExport);}}  // token 改動 → 下方 _variables.scss code 同步更新
    apply();
    view.innerHTML=`<div class="sum-top"><div class="sum-head"><p class="eyebrow">Foundation · Design Token</p><h1>Design Token</h1></div><button class="btn v-soft i-secondary sz-s st-default live" id="tokCopy"><span>查看程式碼 SCSS</span></button></div>
      <p class="lede">依 <b>DS Framework L1 Primitive → L2 Semantic</b> 架構、以 <b>v0 視覺</b> 為種子的預設 token。<b>L1</b> 純值來源、<b>L2</b> 角色組合（含 light/dark）、<b>框架索引</b> 是唯讀的框架完整定義對照。L1/L2 每列可即時手調、層層往下傳全站。</p>
      <div class="head-rule"></div>
      <div class="tok-lead">
        <span id="tokTabs"></span>
        <span id="tokBtns" style="display:inline-flex;gap:var(--sp-2);align-items:center"></span>
        <div class="spacer"></div>
        <div class="tok-name" id="tokStatus" style="color:var(--faint)">${window.__tokEditMode?'點選要停用的 token · 僅標記、不刪除、不匯出':(layer==='ref'?'唯讀對照 · 框架 base theme':'即時預覽 · 不自動儲存')}</div>
      </div>
      <div id="tokBody"></div>`;
    { const LAYERS=['l1','l2','ref'],tabsHost=document.getElementById('tokTabs'); // PAGES10:v1 層級切換改用 library Segmented 原子（sgmEl）
      const sg=sgmEl('soft','m',{live:true,items:['L1 Primitive','L2 Semantic','框架索引'],active:Math.max(0,LAYERS.indexOf(layer)),label:'Token 層級',
        onChange:i=>{window.__tokLayer=LAYERS[i];setTimeout(()=>{if(current!=='tokens')return;renderTokens(view);const n=document.querySelector('#tokTabs .sgm-it.is-active');if(n)n.focus({preventScroll:true});},200);}});
      sg.id='tokTabs';tabsHost.replaceWith(sg); }
    const btnRow=document.getElementById('tokBtns');
    if(btnRow){
      if(!dsEditing())btnRow.hidden=true;   // MODE:v1 瀏覽模式：不給重設
      const reset=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});reset.type='button';reset.querySelector('span').textContent='重設';
      reset.onclick=()=>{window.__tokOverrides={root:{},dark:{},desktop:{},tablet:{},mobile:{}};window.__tokPreset=null;renderTokens(view);};
      btnRow.appendChild(reset);
      if(layer!=='ref'&&window.__dsProject){const edit=!!window.__tokEditMode;
        const db=mkBtn({variant:edit?'solid':'outline',intent:edit?'primary':'secondary',size:'s',isLive:true});db.type='button';db.querySelector('span').textContent=edit?'完成':'停用部分數值';
        db.onclick=()=>{window.__tokEditMode=!window.__tokEditMode;renderTokens(view);};
        btnRow.appendChild(db);}
    }
    const bodyEl=document.getElementById('tokBody');
    {const lead=view.querySelector('.tok-lead');if(lead&&!dsEditing())lead.before(tokReadonlyNote());   // MODE:v1 瀏覽模式：唯讀，快速風格不出現
     if(lead&&dsEditing())lead.before(tokPresetPanel(OV,()=>{apply();const m=document.querySelector('.main'),sy=m?m.scrollTop:0;   /* 快速風格：放在 L1／L2 分頁上方 */
      clearTimeout(window.__tokPresetT);window.__tokPresetT=setTimeout(()=>{if(current!=='tokens')return;const f=document.activeElement&&document.activeElement.closest('.chp-grp')?[document.activeElement.closest('.tok-preset-row').querySelector('.tok-preset-lb').id,document.activeElement.dataset.k]:null;
        renderTokens(view);if(m)m.scrollTop=sy;if(f){const n=document.querySelector(`[aria-labelledby="${f[0]}"] [data-k="${f[1]}"]`);if(n)n.focus({preventScroll:true});}},60);}));}
    const mkColorCtl=(name,cur,store)=>{ // 填滿式色票鈕（無白邊）＋ hex
      const ctl=ce('div','tok-ctl');
      const cp=document.createElement('input');cp.type='color';cp.className='tok-sw-btn';
      const rc=tokResolve(cur);cp.value=/^#([0-9a-f]{6})$/i.test(rc)?rc:'#000000';
      const tx=document.createElement('input');tx.type='text';tx.className='tok-hex';tx.value=cur;
      const commit=v=>{store[name]=v;apply();const r2=tokResolve(v);if(/^#([0-9a-f]{6})$/i.test(r2))cp.value=r2;};
      cp.oninput=()=>{tx.value=cp.value;commit(cp.value);};
      tx.onchange=()=>commit(tx.value.trim());
      ctl.append(cp,tx);return ctl;};

    if(layer==='l1'){
      bodyEl.className='tok-cardgrid'; // 牌卡由左至右排列、寬度不夠再往下
      const TOK_L1_SECTIONS=[
        {t:'色彩 Color',d:'品牌、中性與狀態色階',g:['Neutral 中性色階','Brand 主色（9 階）','Brand 副色（9 階）','Feedback 狀態色（各 9 階）']},
        {t:'文字 Typography',d:'字體、字級、字重、行高、字距',g:['Font Family 字體','Typography 複合樣式（text style）','Letter Spacing 字距（中／英）','Font Weight 字重','Line Height 行高']},
        {t:'間距與尺寸 Spacing & Sizing',d:'間距、圓角、控制項高度、容器、斷點、網格',g:['Spacing 間距（v0 校準）','Radius 圓角（9 階）','Control Height 控制項高度','Tag Height 標籤高度','Container 容器','Breakpoints 裝置斷點','Grid 網格（per device）']},
        {t:'效果 Effect',d:'陰影與動態',g:['Elevation 陰影（5 階）','Motion 動態']},
      ];
      const renderL1Group=gr=>{
        const box=ce('div','tok-group');
        const gh=ce('div','tok-gh');
        gh.innerHTML=`<span class="t">${gr.g}</span>`; // header 右側小說明（gr.note）已移除
        box.appendChild(gh);
        if(gr.kind==='typo'){ // 複合 text style：device 切換＋中英切換＋自訂預覽文案；全寬
          box.classList.add('span');
          const dev=window.__tokTypoDev||(window.__tokTypoDev='desktop');const di={desktop:0,tablet:1,mobile:2}[dev];
          const lang=window.__tokTypoLang||(window.__tokTypoLang='zh');
          const fontKind=window.__tokTypoFont||(window.__tokTypoFont='sans');
          const FF={sans:'var(--font-sans)',mono:'var(--font-mono)'};
          const DEF={zh:'中文標題範例 Goons',en:'The quick brown fox 12'};
          const txt=(window.__tokTypoText!=null?window.__tokTypoText:'')||DEF[lang];
          // 控制列：device tab ｜ 中英 tab ｜ Sans/Mono tab ｜ 自訂預覽文案 input
          const ctlbar=ce('div','tok-typobar');
          const typoSeg=(keys,labels,curK,lab,set)=>sgmEl('soft','s',{live:true,items:labels,active:Math.max(0,keys.indexOf(curK)),label:lab, // PAGES10:v1 library Segmented 原子
            onChange:i=>{set(keys[i]);const m=document.querySelector('.main'),sy=m?m.scrollTop:0;setTimeout(()=>{if(current!=='tokens')return;renderTokens(view);if(m)m.scrollTop=sy;},200);}});
          const dtabs=typoSeg(['desktop','tablet','mobile'],['Desktop','Tablet','Mobile'],dev,'裝置',k=>{window.__tokTypoDev=k;});
          const ltabs=typoSeg(['zh','en'],['中','En'],lang,'語系',k=>{window.__tokTypoLang=k;});
          const ftabs=typoSeg(['sans','mono'],['Sans','Mono'],fontKind,'字體',k=>{window.__tokTypoFont=k;});
          const tiF=ce('div','field v-outline st-default live-field tok-typofield'); // library Input 原子（.field＋裸 input）
          const ti=document.createElement('input');ti.type='text';ti.className='bare';ti.placeholder='自訂預覽文案…';ti.setAttribute('aria-label','自訂預覽文案');ti.value=(window.__tokTypoText!=null?window.__tokTypoText:'');tiF.appendChild(ti);
          ctlbar.append(dtabs,ltabs,ftabs,tiF);box.appendChild(ctlbar);
          const head=ce('div','tok-modehead typo');head.innerHTML=`<span>Token</span><span>字級·${dev}</span><span>字重</span><span>行高 中</span><span>行高 英</span><span>預覽（${dev}·${lang==='zh'?'中':'En'}·${fontKind==='mono'?'Mono':'Sans'}）</span>`;box.appendChild(head);
          const rows=ce('div','tok-rows');const previews=[];
          gr.rows.forEach(lv=>{const d=gr.def[lv];
            const row=ce('div','tok-row typo');
            const nm=ce('div','tok-name');nm.textContent=lv.toUpperCase();row.appendChild(nm);
            const curSz=OV[dev]['--fs-'+lv]||gr.sz[lv][di];
            const pv=ce('div','ty-prev');pv.textContent=txt;pv.style.fontFamily=FF[fontKind];
            const setPv=()=>{pv.style.fontSize=OV[dev]['--fs-'+lv]||gr.sz[lv][di];
              pv.style.fontWeight=OV.root['--fw-'+lv]||d[0];
              pv.style.fontFamily=FF[fontKind];
              pv.style.lineHeight=lang==='zh'?(OV.root['--lh-'+lv]||d[1]):(OV.root['--lh-en-'+lv]||d[2]);
              pv.style.letterSpacing=getComputedStyle(document.documentElement).getPropertyValue(lang==='zh'?'--ls-'+lv:'--ls-en-'+lv).trim();};
            setPv();previews.push({pv,lv,setPv});
            const szc=ce('div','tok-ctl');szc.innerHTML=`<span class="tok-flab">字級·${dev}</span>`;const szx=document.createElement('input');szx.type='text';szx.className='tok-hex';szx.value=curSz;
            szx.onchange=()=>{OV[dev]['--fs-'+lv]=szx.value.trim();apply();setPv();};szc.appendChild(szx);row.appendChild(szc);
            [['--fw-'+lv,d[0],'字重'],['--lh-'+lv,d[1],'行高 中'],['--lh-en-'+lv,d[2],'行高 英']].forEach(([pn,pd,flab])=>{
              const c=ce('div','tok-ctl');c.innerHTML=`<span class="tok-flab">${flab}</span>`;const tx=document.createElement('input');tx.type='text';tx.className='tok-hex';tx.value=OV.root[pn]||pd;
              tx.onchange=()=>{OV.root[pn]=tx.value.trim();apply();setPv();};c.appendChild(tx);row.appendChild(c);});
            row.appendChild(pv);
            rows.appendChild(row);});
          ti.oninput=()=>{window.__tokTypoText=ti.value;const t2=ti.value||DEF[lang];previews.forEach(p=>p.pv.textContent=t2);};
          box.appendChild(rows);
          if(gr.sample){const fr=ce('div','tok-fontrow');
            fr.innerHTML=`<div class="fp" style="font-family:var(--font-sans)">Geist Sans · 果思設計 Goons 0123456789</div>
              <div class="fp" style="font-family:var(--font-mono);font-size:var(--fs-h8)">Geist Mono · NT$ 12,800 · 786</div>`;
            box.appendChild(fr);}
          bodyEl.appendChild(box);return;
        }
        if(gr.kind==='ls2'){ // 字距中/英兩欄
          const head=ce('div','tok-modehead ls2');head.innerHTML=`<span>Token</span><span>字距 中（--ls-h*）</span><span>字距 英（--ls-en-h*）</span>`;box.appendChild(head);
          const rows=ce('div','tok-rows');
          gr.rows.forEach(lv=>{const d=gr.def[lv];
            const row=ce('div','tok-row ls2');
            const nm=ce('div','tok-name');nm.textContent=lv.toUpperCase();row.appendChild(nm);
            [['--ls-'+lv,d[0],'字距 中'],['--ls-en-'+lv,d[1],'字距 英']].forEach(([pn,pd,flab])=>{
              const c=ce('div','tok-ctl');c.innerHTML=`<span class="tok-flab">${flab}</span>`;const tx=document.createElement('input');tx.type='text';tx.className='tok-hex';tx.value=OV.root[pn]||pd;
              tx.onchange=()=>{OV.root[pn]=tx.value.trim();apply();};c.appendChild(tx);row.appendChild(c);});
            rows.appendChild(row);});
          box.appendChild(rows);bodyEl.appendChild(box);return;
        }
        if(gr.resp){const head=ce('div','tok-modehead resp');head.innerHTML=`<span>Token</span><span>🖥 Desktop</span><span>▭ Tablet</span><span>▯ Mobile</span>`;box.appendChild(head);}
        const rows=ce('div','tok-rows');
        gr.rows.forEach(([name,lab])=>{
          if(gr.resp){ // 響應式：Desktop / Tablet / Mobile 三欄各自可調
            const row=ce('div','tok-row resp');row.dataset.tokkey=name;
            const nm=ce('div','tok-name');nm.innerHTML=name+(lab?`<span class="lab">${lab}</span>`:'');
            row.appendChild(nm);
            [['desktop','🖥 Desktop'],['tablet','▭ Tablet'],['mobile','▯ Mobile']].forEach(([bk,flab],i)=>{
              const cell=ce('div','tok-ctl');cell.innerHTML=`<span class="tok-flab">${flab}</span>`;
              const tx=document.createElement('input');tx.type='text';tx.className='tok-hex';tx.value=OV[bk][name]||gr.def[name][i];
              tx.onchange=()=>{OV[bk][name]=tx.value.trim();apply();};
              cell.appendChild(tx);row.appendChild(cell);});
            rows.appendChild(row);return;
          }
          const def=gr.def[name];const cur=OV.root[name]||def;
          const row=ce('div','tok-row');if(gr.kind!=='ref')row.dataset.tokkey=name;
          const nm=ce('div','tok-name');nm.innerHTML=name+(lab?`<span class="lab">${lab}</span>`:'');
          let ctl;
          if(gr.kind==='color'){ctl=mkColorCtl(name,cur,OV.root);}
          else if(gr.kind==='ref'){ctl=ce('div','tok-ctl');const s=ce('div','m-val');s.textContent=cur;s.style.fontSize='var(--fs-h11)';ctl.appendChild(s);}
          else if(gr.kind==='shadow'){ctl=ce('div','tok-ctl');
            const pv=ce('div','tok-shprev');pv.style.boxShadow=cur;
            const tx=document.createElement('input');tx.type='text';tx.className='tok-hex';tx.value=cur;
            tx.onchange=()=>{OV.root[name]=tx.value.trim();apply();pv.style.boxShadow=tx.value.trim();};
            ctl.append(pv,tx);}
          else{ctl=ce('div','tok-ctl');
            const tx=document.createElement('input');tx.type='text';tx.className='tok-hex';tx.value=cur;
            tx.onchange=()=>{OV.root[name]=tx.value.trim();apply();};ctl.appendChild(tx);}
          row.append(nm,ctl);rows.appendChild(row);
        });
        box.appendChild(rows);
        if(gr.sample){const fr=ce('div','tok-fontrow');
          fr.innerHTML=`<div class="fp" style="font-family:var(--font-sans)">Geist Sans · 果思設計 Goons 0123456789</div>
            <div class="fp" style="font-family:var(--font-mono);font-size:var(--fs-h8)">Geist Mono · NT$ 12,800 · 786</div>`;
          box.appendChild(fr);}
        bodyEl.appendChild(box);
      };
      TOK_L1_SECTIONS.forEach(sctn=>{
        const sh=ce('div','tok-sec-head');sh.innerHTML=`<span class="tok-sec-t">${sctn.t}</span><span class="tok-sec-d">${sctn.d}</span>`;bodyEl.appendChild(sh);
        sctn.g.forEach(gname=>{const gr=TOK_L1.find(x=>x.g===gname);if(gr)renderL1Group(gr);});
      });
    }else if(layer==='ref'){ // 框架索引：值表牌卡由左至右排列（同 L1 版型）
      bodyEl.className='tok-cardgrid';
      const isHex=v=>/^#([0-9a-f]{3,8})$/i.test(String(v).trim());
      const intro=ce('p','tref-note');intro.innerHTML='<b>DS Framework <code>_base.theme.yaml</code></b> 完整原始定義（唯讀對照）。⚠ 標記＝框架原值與本專案 v0 種子<b>刻意不同</b>；空值＝框架留白由專案 delta 填。';
      bodyEl.appendChild(intro);
      FRAMEWORK_REF.forEach(sec=>{
        const box=ce('div','tok-group');
        const gh=ce('div','tok-gh');gh.innerHTML=`<span class="t">${sec.t}</span>`;box.appendChild(gh); // header 右側小說明（sec.note）已移除
        const rows=ce('div','tok-rows');
        sec.rows.forEach(([k,v,r])=>{
          const row=ce('div','tref-row');
          const kk=ce('div','tref-k');kk.textContent=k;
          const vv=ce('div','tref-v');
          if(isHex(v)){const sw=ce('span','tref-sw');sw.style.background=v;vv.appendChild(sw);}
          const vt=document.createElement('span');vt.textContent=v+(r?'  · '+r:'');vv.appendChild(vt);
          row.append(kk,vv);rows.appendChild(row);
        });
        box.appendChild(rows);bodyEl.appendChild(box);
      });
    }else{ // L2 semantic：每列 light / dark 兩模式
      TOK_L2.forEach(gr=>{
        const box=ce('div','tok-group');
        const gh=ce('div','tok-gh');
        gh.innerHTML=`<span class="t">${gr.g}</span>`;
        box.appendChild(gh);
        const head=ce('div','tok-modehead');head.innerHTML=`<span>Token</span><span>◐ Light</span><span>◑ Dark</span>`;box.appendChild(head);
        const rows=ce('div','tok-rows');
        gr.rows.forEach(([name,lab,lv,dv])=>{
          const curL=OV.root[name]||lv, curD=OV.dark[name]||dv;
          const row=ce('div','tok-row l2');row.dataset.tokkey=name;
          const nm=ce('div','tok-name');nm.innerHTML=`${name}${lab?`<span class="lab">${lab}</span>`:''}<span class="map">${tokShort(lv)} → ${tokShort(dv)}</span>`;
          const mkMode=(cur,store)=>{const cell=ce('div','tok-mode');
            const cp=document.createElement('input');cp.type='color';cp.className='tok-sw-btn';cp.style.width='30px';cp.style.height='26px';
            const rc=tokResolve(cur);cp.value=/^#([0-9a-f]{6})$/i.test(rc)?rc:'#000000';
            const vl=ce('div','m-val');vl.textContent=tokShort(cur);
            cp.oninput=()=>{store[name]=cp.value;apply();vl.textContent=cp.value;};
            cell.append(cp,vl);return cell;};
          row.append(nm,mkMode(curL,OV.root),mkMode(curD,OV.dark));rows.appendChild(row);
        });
        box.appendChild(rows);
        bodyEl.appendChild(box);
      });
    }
    // 停用清單裝飾：編輯模式選取 / 一般模式灰底+pill（只裝飾有 data-tokkey 的 row）
    (function decorateDisable(){
      const DIS=window.__tokDisabled||(window.__tokDisabled=new Set());
      const edit=!!window.__tokEditMode; bodyEl.classList.toggle('tok-editmode',edit);
      const paint=()=>bodyEl.querySelectorAll('.tok-row[data-tokkey]').forEach(row=>{
        const key=row.dataset.tokkey, nm=row.querySelector('.tok-name');
        row.querySelectorAll('.tok-chk,.tok-pill').forEach(x=>x.remove());
        row.classList.remove('tok-disabled','tok-picked');
        const off=DIS.has(key);
        if(edit){ const chk=ce('span','tok-chk'+(off?' on':''));chk.textContent=off?'✓':''; if(nm)nm.insertBefore(chk,nm.firstChild); if(off)row.classList.add('tok-picked');
          row.onclick=()=>{DIS.has(key)?DIS.delete(key):DIS.add(key);paint();}; }
        else{ row.onclick=null; if(off){row.classList.add('tok-disabled'); if(nm){const p=ce('span','tok-pill');p.textContent='停用';nm.appendChild(p);}} }
      }); paint();
    })();
    // 匯出：完整 token CSS（L1 primitive base=desktop＋L2 light｜dark｜tablet media｜mobile media）；停用者不匯出
    function buildCSS(){return tokBuildCSS();}   // 產生器抽到全域 tokBuildCSS()（開新專案 zip 共用同一份）
    {const o=document.getElementById('tokCopy');const nb=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});nb.type='button';nb.id='tokCopy';nb.querySelector('span').textContent='查看程式碼 SCSS';o.replaceWith(nb);
      /* MODE:v2 編輯模式（已套用提案）：「沿用提案」主按鈕。有改動＝確認後改回提案的值；沒改動＝標記沿用（引導小卡打勾） */
      if(!window.__dsProject&&FLW.active&&FLW.applied&&FLW.proposal){const acts=ce('div','tok-top-acts');nb.replaceWith(acts);acts.appendChild(nb);
        const kb=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:true});kb.type='button';kb.classList.add('tok-keep');acts.appendChild(kb);
        const paintK=()=>{const n=flwTokDiff(),done=!n&&FLW.tokKept;kb.querySelector('span').textContent=done?'已沿用提案':'沿用提案';kb.disabled=done;kb.classList.toggle('st-disabled',done);
          kb.title=n?'目前改了 '+n+' 個，按下會改回提案的值':'不調整，直接用提案的值';};
        const keep=()=>{const P=FLW.proposal;window.__tokOverrides=JSON.parse(JSON.stringify(P.tokens.overrides));applyTokOverrides();
          window.__compBindings={};applyCompBindings();window.__tokPreset=Object.assign({},P.preset||flwPresetOf(FLW.q));
          FLW.tokKept=true;flwSnapSave();flwSave();flwPill();renderTokens(view);requestAnimationFrame(()=>{const b=document.querySelector('.tok-keep');if(b)b.focus({preventScroll:true});});};
        kb.onclick=()=>{const n=flwTokDiff();if(!n){FLW.tokKept=true;flwSave();flwPill();paintK();return;}
          dsDialog({title:'改回提案的值？',sub:'目前改了 '+n+' 個 token，會全部改回提案的值（快速風格也一起回到提案）。',okText:'改回提案',cancelText:'取消',onOk:keep});};
        paintK();}
    } // PAGES10:v1 library Button 原子
    document.getElementById('tokCopy').onclick=()=>{const t=document.getElementById('scssExport');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});}; // 滾動到下方「輸出 · 樣式包」程式碼段

    /* ── 輸出 · 樣式包（SCSS）：把當前 token 產成比照 @ec/styles 的檔案，開發端 @use 引入直接套用 ── */
    (function buildExportSection(){
      const files=tokStylePackFiles();   // 樣式包產生器抽到全域（開新專案 zip 共用）；_variables 每次現算
      const sec=section(view,'輸出 · 樣式包（SCSS）','比照 @ec/styles 的樣式包，開發端 @use 引入、以 var(--token) 取用。');
      const box=ce('div','tokexp');box.id='scssExport';   // 供右上「查看程式碼 SCSS」滾動定位
      const head=ce('div','tokexp-head');const headTitle=ce('span','tokexp-title');headTitle.textContent='樣式包檔案';  // 卡片標題列
      const bar=ce('div','tokexp-bar');
      const tabs=ce('div','code-tabs seg');   // 檔名分頁（重用站上 .seg 滑動分段控制）
      const acts=ce('div','tokexp-acts');
      const mkB=(v,i,t)=>{const b=mkBtn({variant:v,intent:i,size:'s',isLive:true});b.type='button';b.querySelector('span').textContent=t;return b;}; // PAGES10:v1 library Button 原子
      const copyBtn=mkB('outline','secondary','複製此檔'),dlBtn=mkB('outline','secondary','下載此檔'),dlAll=mkB('solid','primary','全部下載');
      acts.append(copyBtn,dlBtn,dlAll);
      const codeWrap=ce('div','tokexp-code');
      const gutter=ce('div','code-gutter');const pre=ce('pre','code-pre');
      codeWrap.append(gutter,pre);
      let cur=0;
      const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      function paint(keepScroll){const f=files[cur];const lines=f.get().replace(/\n$/,'').split('\n');
        const st=codeWrap.scrollTop;
        gutter.textContent=lines.map((_,i)=>i+1).join('\n');
        pre.innerHTML=lines.map(l=>f.lang==='scss'?hlCss(l):(esc(l)||'&nbsp;')).join('\n');
        codeWrap.scrollTop=keepScroll?st:0;}                                     // 切分頁歸零；改 token 即時刷新時保留捲動位置
      refreshExport=()=>{if(cur===0)paint(true);};                              // 只有 _variables.scss（files[0]）吃 token 值；其餘檔案靜態、不需刷新
      files.forEach((f,i)=>{const b=ce('button','code-tab');b.type='button';b.textContent=f.name;b.setAttribute('aria-pressed',i===0?'true':'false');
        b.onclick=()=>{cur=i;[...tabs.querySelectorAll(':scope>button')].forEach((x,j)=>x.setAttribute('aria-pressed',j===i?'true':'false'));paint();};tabs.appendChild(b);}); // 只選 button：.seg-pill 也是 tabs 子元素，用 children 會位移一格
      copyBtn.onclick=()=>{navigator.clipboard.writeText(files[cur].get()).then(()=>{const s=copyBtn.querySelector('span');const o=s.textContent;swapText(s,'已複製 ✓');setTimeout(()=>swapText(s,o),1400);});};
      dlBtn.onclick=()=>dsDownloadText(files[cur].name,files[cur].get());
      dlAll.onclick=()=>{files.forEach((f,i)=>setTimeout(()=>dsDownloadText(f.name,f.get()),i*140));const s=dlAll.querySelector('span');const o=s.textContent;s.textContent='已下載 ✓';setTimeout(()=>s.textContent=o,1600);}; // 逐檔錯開下載，避免瀏覽器擋多檔
      head.append(headTitle,acts);   // header：標題 + 動作按鈕
      bar.appendChild(tabs);          // tab 列在 header 以下
      box.append(head,bar,codeWrap);sec.appendChild(box);
      paint();
    })();
  }

  /* MODE:v1 瀏覽模式沒有選擇元件頁：取用 Empty 原子，引導開啟新專案 */
  function renderSummaryLocked(view){view.innerHTML='';const w=ce('div','sum-locked');
    const e=empEl('first','m',{live:true,secondary:false});e.querySelector('.emp-title').textContent='選擇元件要在專案裡做';
    e.querySelector('.emp-desc').textContent='按「開啟新專案」進入編輯模式後，就能勾選要產出的元件與變體。想先看元件長怎樣，直接到各元件頁調整篩選就好。';
    const a=e.querySelector('.emp-actions .btn');if(a){a.querySelector('span').textContent='開啟新專案';a.onclick=()=>{location.hash='start';};}
    w.appendChild(e);view.appendChild(w);}
  function renderSummary(view){
    const rep=choiceReport();
    view.innerHTML=`<div class="sum-top"><div class="sum-head"><p class="eyebrow">Overview · 選擇元件</p><h1>選擇元件</h1></div><div class="sum-ok" id="sumOk"></div></div>
      <p class="lede">每個元件<b>最後選定的複雜度</b>——先依<b>四大分類</b>展開，再展開牌卡<b>直接點選</b>要產出的變數，牌卡前的勾選框決定<b>要不要產出</b>；跟各元件頁的「變數篩選器」是同一份選擇。</p>
      <div class="head-rule"></div>
      <div class="sum-actions">
        <button class="aitoggle" id="aiBtn">${ICON_SPARK}<span>AI 建議產出</span><span class="switch" aria-hidden="true"></span></button>
        <label class="sum-selall"><input type="checkbox" id="selAllChk"><span>全選</span></label>
        <div class="spacer"></div>
        <div class="sumtotal" id="sumTotal"></div>
      </div>
      <div id="sumBody"></div>`;
    const allKeys=Object.keys(DIAL_SPECS);
    /* MODE:v1 建立流程「選擇元件」：按確認才打勾；少於 FLW_MIN_COMP 個不能確認 */
    const okHost=document.getElementById('sumOk');const okNote=ce('span','sum-ok-n');okNote.setAttribute('aria-live','polite');
    const okBtn=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:true});okBtn.type='button';okBtn.insertAdjacentHTML('afterbegin',PI('check'));okBtn.classList.add('has-lead');
    if(okHost&&!window.__dsProject&&FLW.active)okHost.append(okNote,okBtn);
    function syncOk(){const n=SUMSEL.size,few=n<FLW_MIN_COMP;okBtn.disabled=few;okBtn.classList.toggle('st-disabled',few);
      okBtn.querySelector('span').textContent=FLW.compOk&&!few?'已確認':'確認元件';okNote.textContent=few?'至少選 '+FLW_MIN_COMP+' 個才能確認':(FLW.compOk?'之後再改也會自動更新':'');}
    okBtn.onclick=()=>{if(SUMSEL.size<FLW_MIN_COMP)return;FLW.compOk=true;flwSave();flwPill();syncOk();};
    function syncTotal(){let comp=0,vari=0;allKeys.forEach(id=>{if(SUMSEL.has(id)){comp++;vari+=rep[id].count;}});
      syncOk();
      document.getElementById('sumTotal').innerHTML=`已選 <b>${comp}</b>/${allKeys.length} 個元件 · 共 <b>${vari}</b> 個變體將建立`;
      const sa=document.getElementById('selAllChk');if(sa){sa.checked=comp===allKeys.length&&comp>0;sa.indeterminate=comp>0&&comp<allKeys.length;}}
    const pageOf=id=>DIAL_PAGE[id]||id;
    // 依側邊欄四大群分組（DIAL_SPECS id 依對應頁面歸群，如 checkbox/radio→selector 併入 Basic）
    const GROUPS=NAV.map(g=>{const order=g.items.map(it=>it.id);
      const ids=allKeys.filter(id=>order.includes(pageOf(id))).sort((a,b)=>order.indexOf(pageOf(a))-order.indexOf(pageOf(b)));
      return {name:g.group,emoji:g.emoji,ic:g.ic,ids};}).filter(g=>g.ids.length);
    const body=document.getElementById('sumBody');
    function onManual(){if(aiOn){aiOn=false;aiSnapshot=null;const b=document.getElementById('aiBtn');if(b)b.classList.remove('on');}} // 手動改動即脫離 AI 建議
    const setSel=(id,on)=>{on?SUMSEL.add(id):SUMSEL.delete(id);};
    function updateCatCounts(){body.querySelectorAll('.sumcat').forEach((sec,i)=>{const g=GROUPS[i];if(!g)return;
      const selN=g.ids.filter(id=>SUMSEL.has(id)).length;const n=sec.querySelector('.sumcat-n');if(n)n.textContent=selN+' / '+g.ids.length;});}

    /* 單顆可展開牌卡（accordion 版型；沿用原本 sumcard＋lazy Live） */
    function makeCard(id){const spec=DIAL_SPECS[id],rec=rep[id];
      const card=ce('div','sumcard collapsed');card.dataset.id=id;
      let axesHTML='';
      spec.order.forEach(k=>{const all=spec.axes[k];const sel=new Set(rec[k]);
        axesHTML+=`<div class="sum-axis" data-k="${k}"><span class="sa-name">${spec.zh.axisName[k]}</span><span class="sa-chips chp-grp" role="group" aria-label="${spec.zh.axisName[k]}"></span><span class="sa-n">${rec[k].length}/${all.length}</span></div>`;});
      card.innerHTML=`<div class="sc-head">
          <label class="sc-check"><input type="checkbox" ${SUMSEL.has(id)?'checked':''}></label>
          <span class="sc-name">${spec.label}</span>
          <span class="sc-count">${spec.when?'有效組合':spec.order.map(k=>rec[k].length).join(' × ')} = <b>${rec.count}</b> <span class="full">/ ${rec.full}</span></span>
          <span class="sc-chevron">${ICON_CARET}</span>
        </div>
        <div class="sc-body"><div class="sc-hint">點選項即可加入或排除該變數（每個軸至少留一個）。</div>${axesHTML}
          <div class="sc-foot"><button class="adjustbtn"><span>前往元件</span></button></div></div>`;
      card.classList.toggle('unpicked',!SUMSEL.has(id));
      const chk=card.querySelector('.sc-check input');
      card.querySelector('.sc-check').onclick=e=>e.stopPropagation();
      chk.onchange=()=>{setSel(id,chk.checked);card.classList.toggle('unpicked',!chk.checked);onManual();syncTotal();updateCatCounts();};
      const head=card.querySelector('.sc-head');
      head.onclick=()=>card.classList.toggle('collapsed');
      /* 2026-11-10 拿掉 Live 示範；軸選項直接在這裡點選（同元件頁的變數篩選器，共用 CHOICE） */
      /* CHIP:v1 每個軸值一顆 Chip（multi、s）；選中＝產出該變數 */
      spec.order.forEach(k=>{const box=card.querySelector(`.sum-axis[data-k="${k}"] .sa-chips`);const sel=new Set(rec[k]);
        spec.axes[k].forEach(v=>{const b=chpEl('multi',sel.has(v)?'selected':'default','m',{label:v,live:true});b.dataset.k=k;b.dataset.v=v;
          const zr=String((spec.zh[k]&&spec.zh[k][v])||v);const zhT=k==='size'?v:(/[\u3400-\u9fff]/.test(zr)?zr.replace(/\s+[A-Za-z0-9-]+$/,'').replace(/^[A-Za-z0-9-]+\s+(?=[\u3400-\u9fff])/,''):zr);   /* 只有含中文的標籤才去掉附帶英文（「sp-2 · 8px」這類純英數照原樣） */   /* 中文：去掉前後附的英文（「標準 m」→「標準」、「Stack 直排」→「直排」）；Size 一律英文 */
          const t=b.querySelector('.chp-t');t.innerHTML='';t.setAttribute('data-i18n-skip','');const z=ce('span','sum-l-zh'),e=ce('span','sum-l-en');z.textContent=zhT;e.textContent=v;t.append(z,e);   /* 只顯示目前語言 */
          box.appendChild(b);});});
      card.querySelectorAll('.sa-chips .chp').forEach(b=>b.onclick=()=>{const k=b.dataset.k,v=b.dataset.v,act=CHOICE[id].active[k];
        if(act.has(v)){if(act.size===1){b.classList.add('is-deny');setTimeout(()=>b.classList.remove('is-deny'),360);return;}act.delete(v);}else act.add(v);
        const on=act.has(v);b.setAttribute('aria-checked',String(on));
        rep[id]=choiceReport()[id];const r=rep[id];
        card.querySelector(`.sum-axis[data-k="${k}"] .sa-n`).textContent=r[k].length+'/'+spec.axes[k].length;
        card.querySelector('.sc-count').innerHTML=`${spec.when?'有效組合':spec.order.map(q=>r[q].length).join(' × ')} = <b>${r.count}</b> <span class="full">/ ${r.full}</span>`;
        onManual();syncTotal();});
      {const ob=card.querySelector('.adjustbtn');const nb=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:true,trail:true});nb.type='button';nb.querySelector('span').textContent='前往元件';nb.onclick=()=>renderView(pageOf(id));ob.replaceWith(nb);} // 主 CTA：前往元件頁
      return card;}

    /* 緊湊清單列（list 版型：一列一元件，點列跳頁、右側箭頭調整） */
    function makeRow(id){const spec=DIAL_SPECS[id],rec=rep[id];
      const row=ce('div','sumrow'+(SUMSEL.has(id)?'':' unpicked'));row.dataset.id=id;
      const cb=ce('label','sr-check');cb.innerHTML=`<input type="checkbox" ${SUMSEL.has(id)?'checked':''}>`;
      cb.onclick=e=>e.stopPropagation();
      cb.querySelector('input').onchange=e=>{setSel(id,e.target.checked);row.classList.toggle('unpicked',!e.target.checked);onManual();syncTotal();updateCatCounts();};
      const nm=ce('span','sr-name');nm.textContent=spec.label;
      const cnt=ce('span','sr-count');cnt.innerHTML=`${spec.order.map(k=>rec[k].length).join('×')} = <b>${rec.count}</b>`;
      const go=ce('button','sr-go');go.innerHTML=IC_ARROW_RIGHT;go.setAttribute('aria-label','調整');
      go.onclick=e=>{e.stopPropagation();renderView(pageOf(id));};
      row.append(cb,nm,cnt,go);row.onclick=()=>renderView(pageOf(id));
      return row;}

    /* 網格磚（grid 版型：小卡＋勾選＋變體數，點磚跳頁） */
    function makeTile(id){const spec=DIAL_SPECS[id],rec=rep[id];
      const tile=ce('div','sumtile'+(SUMSEL.has(id)?'':' unpicked'));tile.dataset.id=id;
      tile.innerHTML=`<label class="st-check"><input type="checkbox" ${SUMSEL.has(id)?'checked':''}></label>
        <span class="st-name">${spec.label}</span>
        <span class="st-count"><b>${rec.count}</b> 變體</span>
        <button class="st-go" aria-label="調整">${ICON_PENCIL}</button>`;
      const inp=tile.querySelector('input');
      tile.querySelector('.st-check').onclick=e=>e.stopPropagation();
      inp.onchange=()=>{setSel(id,inp.checked);tile.classList.toggle('unpicked',!inp.checked);onManual();syncTotal();updateCatCounts();};
      tile.querySelector('.st-go').onclick=e=>{e.stopPropagation();renderView(pageOf(id));};
      tile.onclick=()=>renderView(pageOf(id));
      return tile;}

    /* 分類外殼（可折疊；三版型共用，預設收合＝先看分類再展開） */
    function catShell(g,inner){const sec=ce('div','sumcat collapsed');
      const selN=g.ids.filter(id=>SUMSEL.has(id)).length;
      const head=ce('button','sumcat-h');
      head.innerHTML=`<span class="sumcat-t">${g.name}</span>
        <span class="sumcat-n">${selN} / ${g.ids.length}</span><span class="sumcat-caret">${ICON_CARET}</span>`;
      head.onclick=()=>sec.classList.toggle('collapsed');
      const bw=ce('div','sumcat-body');bw.appendChild(inner);
      sec.append(head,bw);return sec;}

    function renderBody(){body.innerHTML='';body.className='sum-body sum-'+sumLayout;
      GROUPS.forEach(g=>{let inner;
        if(sumLayout==='accordion'){inner=ce('div','sumcat-cards');g.ids.forEach(id=>inner.appendChild(makeCard(id)));}
        else if(sumLayout==='list'){inner=ce('div','sumlist');g.ids.forEach(id=>inner.appendChild(makeRow(id)));}
        else{inner=ce('div','sumgrid');g.ids.forEach(id=>inner.appendChild(makeTile(id)));}
        body.appendChild(catShell(g,inner));});}

    renderBody();syncTotal();
    const selAll=document.getElementById('selAllChk');
    if(selAll)selAll.onchange=()=>{const on=selAll.checked;allKeys.forEach(id=>on?SUMSEL.add(id):SUMSEL.delete(id));onManual();renderBody();syncTotal();}; // 全選/全不選 → 重繪三版型卡片＋更新總計
    const aiBtn=document.getElementById('aiBtn');
    {const sw=aiBtn.querySelector('.switch');const syncSw=()=>{if(sw)sw.classList.toggle('on',aiBtn.classList.contains('on'));aiBtn.setAttribute('aria-pressed',aiBtn.classList.contains('on')?'true':'false');};new MutationObserver(syncSw).observe(aiBtn,{attributes:true,attributeFilter:['class']});aiBtn.classList.toggle('on',aiOn);syncSw();} // PAGES10:v1 library Switch 原子跟著 .on
    aiBtn.classList.toggle('on',aiOn);
    aiBtn.onclick=()=>{ // AI 建議 toggle：開→套用建議並存快照；關→還原點擊前選擇
      if(!aiOn){aiSnapshot=[...SUMSEL];SUMSEL.clear();RECOMMEND.forEach(x=>SUMSEL.add(x));aiOn=true;}
      else{if(aiSnapshot){SUMSEL.clear();aiSnapshot.forEach(x=>SUMSEL.add(x));}aiSnapshot=null;aiOn=false;}
      aiBtn.classList.toggle('on',aiOn);renderBody();syncTotal();
    };
    /* 2026-11-10「複製此頁 JSON」按鈕先移除（使用者要求）；要恢復請看 git 歷史的 renderSummary */
  }

