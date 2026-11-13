  /* ===== 開新專案流程（#start · flow2）：網站版 ds-studio-flow 原型（無 AI），整條流程跑在 library 大版 Modal 裡 =====
     對應 skills/ds-studio-flow：Step 1 Phase 0 訪談 → Step 2 提案 → Step 3 網站選取 → Step 4 匯出。
     標「AI 之後接上」的地方目前都走固定規則（deterministic fallback），整條流程現在就能跑完。
     草稿存 localStorage（ds-flow-draft:v1，try/catch）；上傳的檔案只留在這個分頁的記憶體，不存內容。 */
  const FLW_KEY='ds-flow-draft:v1';
  const FLW_STEPS=[   /* MODE:v1 彈窗只留 4 步；調整 Token／選擇元件／匯出改在網站上做，由右下引導小卡帶路 */
    {label:'基本資料',desc:'專案與品牌'},
    {label:'匯入資料',desc:'CI／PRD'},
    {label:'品牌問卷',desc:'色彩與調性'},
    {label:'提案確認',desc:'Token 與元件'},
  ];
  const FLW_INDUSTRY=[
    {value:'ecommerce',label:'電商／零售'},{value:'saas',label:'SaaS／後台工具'},{value:'finance',label:'金融／保險'},
    {value:'media',label:'內容／媒體'},{value:'public',label:'醫療／公部門'},{value:'education',label:'教育'},{value:'other',label:'其他'}];
  const FLW_PLATFORM=[['web','Web'],['app','App'],['both','兩者']];
  const FLW_FONT=[['default','預設'],['hei','黑體'],['ming','明體']];
  const FLW_FONT_MD={default:'預設（Geist＋系統黑體）',hei:'黑體優先（Noto Sans TC／PingFang TC）',ming:'明體／襯線（Noto Serif TC）'};
  const FLW_DENSITY=[['comfortable','舒適'],['compact','緊湊']];
  const FLW_RADIUS=[['sharp','銳利'],['soft','柔和'],['round','圓潤']];
  const FLW_DARK=[['now','立即建'],['later','之後補'],['none','不需要']];
  const FLW_TONES=['專業','溫暖','活潑','簡約','高級','科技','自然','親切','可靠','大膽'];
  /* QS-PRESET:v1 品牌問卷 4 題 → 快速風格（TOK_PRESETS）：主色方向→用色；品牌感覺（最後選的那個）→圓角／陰影／動態／字重；
     資訊量→間距＋元件尺寸；主要讀者→字級對比＋文字對比。答案只是起點，提案確認頁可以直接改任何一項 */
  const FLW_TONE_MAP={'專業':{radius:'sharp',shadow:'flat',motion:'crisp',weight:'mid'},'科技':{radius:'sharp',shadow:'flat',motion:'crisp',weight:'light'},
    '簡約':{radius:'mid',shadow:'flat',motion:'mid',weight:'light'},'可靠':{radius:'mid',shadow:'mid',motion:'mid',weight:'mid'},
    '溫暖':{radius:'round',shadow:'mid',motion:'slow',weight:'mid'},'親切':{radius:'round',shadow:'mid',motion:'mid',weight:'mid'},
    '活潑':{radius:'pill',shadow:'raised',motion:'mid',weight:'heavy'},'大膽':{radius:'sharp',shadow:'raised',motion:'crisp',weight:'heavy'},
    '高級':{radius:'mid',shadow:'mid',motion:'slow',weight:'light'},'自然':{radius:'round',shadow:'flat',motion:'slow',weight:'mid'}};
  const FLW_DENS=[['dense','資訊很多（後台、報表）',{space:'dense',size:'compact'}],['mid','一般（電商、會員）',{space:'mid',size:'mid'}],['airy','很少、重閱讀（品牌、內容）',{space:'loose',size:'roomy'}]];
  const FLW_READ=[['pro','天天用的內部人員',{text:'mid',type:'low'}],['pub','一般大眾',{text:'mid',type:'mid'}],['brand','先被吸引的潛在客戶',{text:'mid',type:'high'}],['a11y','長者／需要好讀',{text:'high',type:'mid'}]];
  function flwPresetOf(q){const ps={space:'mid',type:'mid',weight:'mid',color:q.color||'neutral',radius:'mid',shadow:'mid',motion:'mid',text:'mid',size:'mid'};
    const t=(q.tone||[]).slice(-1)[0];if(t&&FLW_TONE_MAP[t])Object.assign(ps,FLW_TONE_MAP[t]);
    const d=FLW_DENS.find(x=>x[0]===q.dens);if(d)Object.assign(ps,d[2]);
    const r=FLW_READ.find(x=>x[0]===q.read);if(r)Object.assign(ps,r[2]);return ps;}
  function flwPresetLabel(k,v){const p=TOK_PRESETS.find(x=>x.k===k);const o=p&&p.opts.find(x=>x[0]===v);return o?o[1]:v;}
  function flwWhyOf(k,q){const lab=(L,v)=>{const f=L.find(x=>x[0]===v);return f?f[1]:v;};
    if(k==='color')return '主色方向選了「'+flwPresetLabel('color',q.color||'neutral')+'」'+(flwHex(q.primary)?'；品牌主色改用你填的色號':'');
    if(['radius','shadow','motion','weight'].includes(k))return '品牌感覺選了「'+((q.tone||[]).slice(-1)[0]||'')+'」';
    if(k==='space'||k==='size')return '資訊量選了「'+lab(FLW_DENS,q.dens)+'」';
    return '主要讀者是「'+lab(FLW_READ,q.read)+'」';}
  const FLW_MIN_COMP=5;
  /* 元件建議規則表：每條＝[元件 id, 一句理由]；依平台、產業疊加，最後只留 DIAL_SPECS 有的 id */
  const FLW_RULES={
    base:[['button','所有流程的主要動作都需要'],['input','表單與搜尋的基本輸入'],['field','欄位標籤、提示與錯誤訊息的外框'],['dropdown','選項多於 5 個時的選擇'],
      ['checkbox','多選與同意條款'],['radio','少量互斥選項'],['toggle','即時生效的開關設定'],['tag','狀態與分類標記'],['icon','全站圖示'],
      ['tooltip','補充說明不佔版面'],['alert','頁內常駐提示'],['notification','操作完成後的回饋'],['modal','需要使用者確認的對話'],['loader','載入中狀態'],['empty','沒有資料時的畫面']],
    web:[['header','網站頁首與主導覽'],['footer','網站頁尾資訊'],['breadcrumb','多層頁面的位置提示'],['pagination','列表分頁'],['tab','同頁內容切換'],['menu','導覽與下拉選單'],['popover','點擊後的浮出內容'],['link','文字連結']],
    app:[['tab','App 底部或頁內分頁'],['list','App 常見的清單版面'],['list-item','清單的單列資訊'],['drawer','App 側邊或底部抽屜'],['segmented','少量檢視方式切換'],['floating-line','固定在底部的主要動作列'],['avatar','會員與個人資料']],
    ecommerce:[['price','售價、折扣與數值'],['quantity','購物車數量'],['carousel','首頁主視覺輪播'],['rating','商品評價'],['image','商品圖'],['step','結帳流程進度']],
    saas:[['table','資料管理的核心'],['table-toolbar','表格的篩選與批次操作'],['chart','儀表板數據'],['date-picker','日期篩選與設定'],['descriptions','詳細頁的欄位清單'],['tree-view','階層資料'],['app-shell','後台框架'],['command','進階使用者的快速指令'],['dropzone','檔案匯入']],
    finance:[['chart','走勢與資產配置'],['price','金額與百分比'],['table','交易明細'],['descriptions','帳戶資料'],['step','開戶與申請流程'],['progress','目標與進度'],['date-picker','查詢區間']],
    media:[['article-card','文章列表'],['image','內容圖片'],['carousel','精選內容'],['section-head','區段標題與更多連結'],['avatar','作者資訊']],
    public:[['step','申辦流程分步'],['date-picker','預約日期'],['dropzone','上傳證明文件'],['descriptions','申請資料確認'],['collapse','常見問題']],
    education:[['progress','學習進度'],['step','課程章節'],['article-card','課程卡'],['list','課程清單'],['calendar','課表與行事曆'],['avatar','講師與學員']],
    other:[['article-card','通用內容卡'],['list','通用清單']],
  };
  const FLW_SAMPLE={brand:'果思咖啡',industry:'ecommerce',platform:'both',color:'natural',primary:'#2F6B4F',secondary:'#E0A458',font:'hei',tone:['溫暖','自然','親切'],dens:'mid',read:'pub',
    text:'果思咖啡品牌規範（範例）\n主色：森林綠 #2F6B4F\n輔色：焦糖 #E0A458\n調性：溫暖、自然、親切\n產品：線上咖啡豆訂閱與門市點餐 App'};
  const FLW_FILES=[];

  function flwBlank(){return {v:1,active:false,step:0,max:0,
    info:{brand:'',name:'',nameTouched:false,industry:'',platform:'web',figma:''},
    src:{files:[],text:'',url:'',extracted:null},
    q:{color:'neutral',primary:'',secondary:'',font:'default',tone:[],dens:'mid',read:'pub',dark:'later'},
    proposal:null,applied:false,snap:null,created:new Date().toISOString(),updated:null,
    flowDone:false,tokKept:false,compOk:false,exportSig:null,qSig:null};}   // MODE:v1 引導小卡的完成判斷
  function flwLoad(){try{const r=localStorage.getItem(FLW_KEY);if(!r)return null;const d=JSON.parse(r);if(!d||d.v!==1)return null;
      const b=flwBlank();return Object.assign(b,d,{info:Object.assign(b.info,d.info||{}),src:Object.assign(b.src,d.src||{}),q:Object.assign(b.q,d.q||{})});}catch(e){return null;}}
  function flwSave(){FLW.updated=new Date().toISOString();try{localStorage.setItem(FLW_KEY,JSON.stringify(FLW));}catch(e){}}
  let FLW=flwLoad()||flwBlank();
  /* MODE:v1 舊草稿（6 步版）轉成 4 步：已套用提案＝彈窗流程已完成 */
  if(FLW.applied&&FLW.max>=3)FLW.flowDone=true;FLW.step=Math.min(FLW.step,FLW_STEPS.length-1);FLW.max=Math.min(FLW.max,FLW_STEPS.length-1);

  /* ---- 色彩工具（只做計算，不寫死任何樣式） ---- */
  const flwHex=v=>{v=String(v||'').trim();if(/^#?[0-9a-f]{3}$/i.test(v)){v=v.replace('#','');v='#'+v.split('').map(c=>c+c).join('');}
    if(/^#?[0-9a-f]{6}$/i.test(v))return ('#'+v.replace('#','')).toUpperCase();return null;};
  const flwRgb=h=>{const x=flwHex(h);if(!x){const m=String(h||'').match(/rgba?\(([^)]+)\)/);if(!m)return null;return m[1].split(',').slice(0,3).map(n=>parseFloat(n));}
    return [1,3,5].map(i=>parseInt(x.slice(i,i+2),16));};
  const flwMix=(hex,to,amt)=>{const a=flwRgb(hex),b=flwRgb(to);return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*amt).toString(16).padStart(2,'0')).join('').toUpperCase();};
  const flwLum=c=>{const a=flwRgb(c);if(!a)return 0;const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(a[0])+0.7152*f(a[1])+0.0722*f(a[2]);};
  const flwContrast=(a,b)=>{const x=flwLum(a),y=flwLum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
  const flwPrim=n=>{const v=getComputedStyle(document.documentElement).getPropertyValue(n).trim();return v;};
  /* 9 階色階：500＝錨點；淺端混白、深端混黑（同 gallery 既有 brand 色階的明度走向） */
  function flwScale(prefix,anchor){const W=flwPrim('--c-neutral-0')||'#FFFFFF',K='#000000';const o={};
    [[100,.86],[200,.68],[300,.46],[400,.22]].forEach(([s,t])=>o[`--c-${prefix}-${s}`]=flwMix(anchor,W,t));
    o[`--c-${prefix}-500`]=flwHex(anchor);
    [[600,.16],[700,.32],[800,.48],[900,.64]].forEach(([s,t])=>o[`--c-${prefix}-${s}`]=flwMix(anchor,K,t));
    return o;}
  const flwEsc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const flwSlug=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9㐀-鿿_-]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'');
  const flwToday=()=>{const d=new Date();return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');};
  const flwDefaultName=()=>(flwSlug(FLW.info.brand)||'project')+'-'+flwToday();
  const flwLabelOf=(list,k)=>{const f=list.find(x=>(x.value||x[0])===k);return f?(f.label||f[1]):(k||'');};

  /* ---- 提案（固定規則；之後換 AI） ---- */
  function flwBuildProposal(){
    const q=FLW.q,info=FLW.info;const OV={root:{},dark:{},desktop:{},tablet:{},mobile:{}},why=[];
    const ps=flwPresetOf(q);   // QS-PRESET:v1 問卷 → 快速風格
    TOK_PRESETS.forEach(pp=>{const v=ps[pp.k];if(!v||v===TOK_PRESET_DEF(pp.k))return;pp.apply(v,OV);why.push({k:'快速風格 · '+pp.t,v:flwPresetLabel(pp.k,v),r:flwWhyOf(pp.k,q)});});
    const root=OV.root,dark=OV.dark;const W=flwPrim('--c-neutral-0')||'#FFFFFF';
    const p=flwHex(q.primary);
    if(p){const SC=flwScale('brand',p);Object.assign(root,SC);why.push({k:'--c-brand-100 … 900',v:p,r:'主色錨點放在 500，其他 8 階依明度自動推出'});
      /* 深色模式：預設主色按鈕吃 --c-brand-200（為近黑的中性品牌設計）；彩色主色改挑「在深底上對比 ≥ 3:1」的最深一階，按鈕才看得出是品牌色 */
      const h=p.replace('#','');const rgb=[0,2,4].map(i=>parseInt(h.substr(i,2),16));const chroma=(Math.max(...rgb)-Math.min(...rgb))/255;
      if(chroma>.18){const BG='#09090B';const k=[500,400,300,200].find(n=>flwContrast(SC['--c-brand-'+n],BG)>=3)||200;const v=n=>'var(--c-brand-'+Math.min(900,Math.max(100,n))+')';
        Object.assign(dark,{'--s-action-primary':v(k),'--s-action-primary-hover':v(k-100),'--s-action-primary-press':v(k+100),
          '--s-action-primary-tint':'color-mix(in srgb,'+v(k)+' 16%,transparent)','--s-action-primary-tint2':'color-mix(in srgb,'+v(k)+' 28%,transparent)',
          '--s-on-primary':flwContrast(SC['--c-brand-'+k],W)>=4.5?'#FFFFFF':'#0B0B0C','--primary-on':'var(--s-on-primary)'});
        why.push({k:'--s-action-primary（Dark）',v:'var(--c-brand-'+k+')',r:'深色模式改用 '+k+' 階，主色在深底上才夠亮（對比 ≥ 3:1），按鈕維持品牌色'});}
      if(flwContrast(p,W)<4.5){root['--primary-on']='var(--c-neutral-900)';why.push({k:'--primary-on',v:'var(--c-neutral-900)',r:'主色偏亮，按鈕上的字改用深色才看得清楚'});}}
    const s=flwHex(q.secondary);
    if(s){Object.assign(root,flwScale('brand2',s));why.push({k:'--c-brand2-100 … 900',v:s,r:'副色錨點放在 500，用於點綴與次要強調'});
      if(flwContrast(s,W)<4.5){root['--accent2-on']='var(--c-neutral-900)';why.push({k:'--accent2-on',v:'var(--c-neutral-900)',r:'副色偏亮，副色底上的字改用深色'});}}
    if(q.font==='hei'){root['--font-sans']="'Noto Sans TC','PingFang TC','Microsoft JhengHei',system-ui,sans-serif";why.push({k:'--font-sans',v:'黑體優先',r:'字體偏好選了黑體'});}
    if(q.font==='ming'){root['--font-sans']="'Noto Serif TC','Songti TC','PMingLiU',serif";why.push({k:'--font-sans',v:'明體',r:'字體偏好選了明體（襯線）'});}
    if(!why.length)why.push({k:'其他 token',v:'沿用預設',r:'問卷沒有特別指定的項目，維持元件庫預設值'});
    /* 元件 */
    const picks=new Map();const add=list=>(list||[]).forEach(([id,r])=>{if(DIAL_SPECS[id]&&!picks.has(id))picks.set(id,r);});
    add(FLW_RULES.base);
    if(info.platform==='web'||info.platform==='both')add(FLW_RULES.web);
    if(info.platform==='app'||info.platform==='both')add(FLW_RULES.app);
    add(FLW_RULES[info.industry]||FLW_RULES.other);
    const selected=[...picks.keys()];
    return {project:info.name,generatedBy:'website-flow · 固定規則（AI 之後接上）',createdAt:new Date().toISOString(),
      tokens:{overrides:OV,logo:{light:null,dark:null}},preset:ps,
      components:{selected,axes:{}},reasons:{tokens:why,components:selected.map(id=>({id,r:picks.get(id)}))}};
  }
  /* 重新開始：網站回到元件庫預設——清 token 覆寫（含 inline 保底）、元件綁定、停用 token、需求匯總勾選、各元件軸篩選；背景頁重繪 */
  function flwResetSite(){
    window.__tokOverrides={root:{},dark:{},desktop:{},tablet:{},mobile:{}};applyTokOverrides();
    window.__compBindings={};applyCompBindings();
    window.__tokDisabled=new Set();
    SUMSEL.clear();
    Object.keys(DIAL_SPECS).forEach(id=>{const c=CHOICE[id];if(!c)return;DIAL_SPECS[id].order.forEach(k=>{const set=c.active[k];if(set&&set.clear){set.clear();DIAL_SPECS[id].axes[k].forEach(v=>set.add(v));}});});
    try{const v=document.getElementById('view');const cur=window.__flwBg||(location.hash||'#home').slice(1);if(v&&cur&&cur!=='start')renderView(cur);}catch(e){}
  }
  function flwApplyProposal(){
    const P=FLW.proposal;if(!P)return;
    window.__tokOverrides=JSON.parse(JSON.stringify(P.tokens.overrides));applyTokOverrides();  // 同 applyProposal：寫 window.__tokOverrides → 全站重新上色
    window.__tokPreset=Object.assign({},P.preset||flwPresetOf(FLW.q));   // QS-PRESET:v1 Token 頁的快速風格跟提案一致
    SUMSEL.clear();P.components.selected.forEach(id=>SUMSEL.add(id));                       // 需求匯總的勾選
    FLW.applied=true;flwSnapSave();
  }
  /* 目前網站狀態快照（token＋勾選＋軸）：使用者在 Design Token／需求匯總調整後，重整也能接續 */
  function flwSnapSave(){if(!FLW.active||!FLW.applied)return;const axes={};
    [...SUMSEL].forEach(id=>{const c=CHOICE[id];if(!c)return;axes[id]={};Object.keys(c.active).forEach(k=>axes[id][k]=[...c.active[k]]);});
    FLW.snap={ov:JSON.parse(JSON.stringify(window.__tokOverrides||{})),sel:[...SUMSEL],axes,bind:JSON.parse(JSON.stringify(window.__compBindings||{}))};flwSave();}   // SHELL8:v1 +bind
  function flwSnapRestore(){const s=FLW.snap;if(!s)return;
    if(s.bind&&typeof s.bind==='object'){window.__compBindings=JSON.parse(JSON.stringify(s.bind));applyCompBindings();}   // SHELL8:v1
    window.__tokOverrides=Object.assign({root:{},dark:{},desktop:{},tablet:{},mobile:{}},s.ov||{});applyTokOverrides();
    if(Array.isArray(s.sel)){SUMSEL.clear();s.sel.forEach(id=>{if(DIAL_SPECS[id])SUMSEL.add(id);});}
    Object.entries(s.axes||{}).forEach(([id,ax])=>{const c=CHOICE[id];if(!c)return;Object.entries(ax).forEach(([k,v])=>{if(c.active[k]&&Array.isArray(v)&&v.length)c.active[k]=new Set(v);});});}

  /* ---- 匯出檔內容 ---- */
  function flwInterviewMD(){const i=FLW.info,q=FLW.q,s=FLW.src,d=new Date().toISOString().slice(0,10);
    const files=s.files.length?s.files.map(f=>'`'+f.name+'`').join('、'):'（無）';
    const hasCI=s.files.length||s.text.trim()||s.url.trim();
    return `# Opening Interview — ${i.name}
Date: ${d}
Source: CDL Studio 網站「開新專案」流程（無 AI 原型；標 assumed-default 的項目請在 Claude Code 跑 Step 5 前確認）

Q0 Project folder:
  - Path: projects/${i.name}/
  - Created-by: website-flow（請手動建資料夾並放入匯出檔）
  - Cwd-warning-triggered: no

Q1 CI:
  - Status: ${hasCI?'provided':'pending'}
  - Source: 檔案 ${files}${s.url.trim()?'；連結 '+s.url.trim():''}${s.text.trim()?'；貼上文字（見文末附錄）':''}
  - Extracted: ${s.extracted?s.extracted:'（尚未萃取；AI 之後接上）'}
  - Note: 視覺判讀為 v0.1-provisional

Q2 Spec / PRD:
  - Type: ${s.files.length||s.text.trim()?'spec':'pending'}
  - Location: 同 Q1 匯入資料
  - Assumed defaults: 元件 scope 由網站規則表依平台（${flwLabelOf(FLW_PLATFORM,i.platform)}）＋產業（${flwLabelOf(FLW_INDUSTRY,i.industry)}）推出

Q3 Brand visual (confirmed):
  - Brand: ${i.brand}
  - Industry: ${flwLabelOf(FLW_INDUSTRY,i.industry)}
  - Source: designer-input（網站問卷）
  - Color: ${flwPresetLabel('color',q.color||'neutral')}${q.primary?' · primary '+q.primary:''}${q.secondary?' / secondary '+q.secondary:''}
  - Typography: ${FLW_FONT_MD[q.font]||q.font}
  - Mood: ${q.tone.length?q.tone.join('、'):'（未指定）'}
  - Density: ${flwLabelOf(FLW_DENS,q.dens)}
  - Audience: ${flwLabelOf(FLW_READ,q.read)}
  - Quick style: ${(()=>{const ps=(FLW.proposal&&FLW.proposal.preset)||flwPresetOf(q);return TOK_PRESETS.map(p=>p.t+' '+flwPresetLabel(p.k,ps[p.k])).join('、');})()}

Q4 Path:
  - Choice: path-1-figma-direct（assumed-default）

Q5 Dev stack:
  - Source: pending-fe（網站流程不問設計師技術選型）

Q6 Figma DS file:
  - ${i.figma.trim()?'Existing: '+i.figma.trim():'沒有 → 開新檔；Q6a 工作空間 / Q6b 檔名（預設 `'+i.brand+' - DS - <成員> - '+d+'`）待 Claude Code 確認'}

Q7 Dark mode:
  - Choice: ${flwLabelOf(FLW_DARK,q.dark)}

Q8 WF / 頁面架構:
  - Status: pending

Q9 Responsive:
  - Platform: ${flwLabelOf(FLW_PLATFORM,i.platform)}
  - Breakpoints: 360 / 768 / 1024 / 1280（assumed-default）
${s.text.trim()?'\n## 附錄：貼上的資料\n\n```\n'+s.text.trim()+'\n```\n':''}`;}
  /* ---- Token 樣式包產生器（全域；flwexp:v1）：Design Token 頁「輸出 · 樣式包」與開新專案 zip 共用同一份；每次呼叫都讀當下 window.__tokOverrides／__tokDisabled（＝專案調整後的值） ---- */
  // 完整 token CSS（L1 primitive base=desktop＋L2 light｜dark｜tablet media｜mobile media）；停用者不匯出
  function tokBuildCSS(){
    // 響應式 token：各 tier override ＞ root（全寬）override ＞ 預設 —— 與網站 #tokenOverrides 的套用順序一致
    const DIS=window.__tokDisabled||new Set();
    const O=window.__tokOverrides||{},OV={root:O.root||{},dark:O.dark||{},desktop:O.desktop||{},tablet:O.tablet||{},mobile:O.mobile||{}};
    let base='';TOK_L1.forEach(gr=>{if(gr.kind==='ref')return;
      if(gr.kind==='typo'){gr.rows.forEach(lv=>{const d=gr.def[lv];
        base+='  --fs-'+lv+':'+(OV.desktop['--fs-'+lv]||OV.root['--fs-'+lv]||gr.sz[lv][0])+';\n  --fw-'+lv+':'+(OV.root['--fw-'+lv]||d[0])+';\n  --lh-'+lv+':'+(OV.root['--lh-'+lv]||d[1])+';\n  --lh-en-'+lv+':'+(OV.root['--lh-en-'+lv]||d[2])+';\n';});return;}
      if(gr.kind==='ls2'){gr.rows.forEach(lv=>{const d=gr.def[lv];base+='  --ls-'+lv+':'+(OV.root['--ls-'+lv]||d[0])+';\n  --ls-en-'+lv+':'+(OV.root['--ls-en-'+lv]||d[1])+';\n';});return;}
      gr.rows.forEach(([n])=>{ if(DIS.has(n))return;
      base+='  '+n+':'+(gr.resp?(OV.desktop[n]||OV.root[n]||gr.def[n][0]):(OV.root[n]||gr.def[n]))+';\n';});});
    let l='',d='';TOK_L2.forEach(gr=>gr.rows.forEach(([n,lab,lv,dv])=>{if(DIS.has(n))return;l+='  '+n+':'+(OV.root[n]||lv)+';\n';d+='  '+n+':'+(OV.dark[n]||dv)+';\n';}));
    let tab='',mob='';TOK_L1.forEach(gr=>{
      if(gr.kind==='typo'){gr.rows.forEach(lv=>{tab+='  --fs-'+lv+':'+(OV.tablet['--fs-'+lv]||OV.root['--fs-'+lv]||gr.sz[lv][1])+';\n';mob+='  --fs-'+lv+':'+(OV.mobile['--fs-'+lv]||OV.root['--fs-'+lv]||gr.sz[lv][2])+';\n';});return;}
      if(!gr.resp)return;gr.rows.forEach(([n])=>{ if(DIS.has(n))return;
      tab+='  '+n+':'+(OV.tablet[n]||OV.root[n]||gr.def[n][1])+';\n';mob+='  '+n+':'+(OV.mobile[n]||OV.root[n]||gr.def[n][2])+';\n';});});
    return '/* Design Token（v0 種子；含 light/dark 與響應式 device mode）*/\n:root{\n'+base+l+'}\n'+
      ':root[data-theme="dark"]{\n'+d+'}\n@media(max-width:1023px){:root{\n'+tab+'}}\n@media(max-width:767px){:root{\n'+mob+'}}\n';
  }
  // 樣式包檔案清單：[{name,lang,desc,get()}]；_variables 每次現算（反映當前 token 編輯），其餘為靜態內容
  function tokStylePackFiles(){
    const SANS="'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', system-ui, sans-serif";
    const MONO="'Geist Mono', ui-monospace, 'SF Mono', Menlo, 'PingFang TC', 'Noto Sans TC', monospace";
    const DISP="'Epilogue', 'Geist', -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', system-ui, sans-serif";
    const HD=t=>'/* ============================================================\n   CDL · '+t+'\n   由 Design Token 頁輸出 · 命名為 source of truth\n   ============================================================ */\n\n';
    // _breakpoints.scss：對齊 token RWD 分層（mobile <768 / tablet 768–1023 / desktop ≥1024），mixin API 比照同事既有慣例
    const F_BP=HD('_breakpoints.scss｜斷點變數與 mixin')+
      '$breakpoint-sm: 480px;   // 小網\n$breakpoint-md: 768px;   // 平板（token tablet 起點）\n$breakpoint-lg: 1024px;  // 桌機（token desktop 起點）\n$breakpoint-xl: 1920px;  // 大網（token wide）\n\n'+
      '@mixin breakpoint-up($bp) {\n'+
      '  @if $bp == sm { @media (min-width: $breakpoint-sm) { @content; } }\n'+
      '  @else if $bp == md { @media (min-width: $breakpoint-md) { @content; } }\n'+
      '  @else if $bp == lg { @media (min-width: $breakpoint-lg) { @content; } }\n'+
      '  @else if $bp == xl { @media (min-width: $breakpoint-xl) { @content; } }\n'+
      '  @else { @warn "Unsupported breakpoint: #{$bp}"; }\n}\n\n'+
      '@mixin breakpoint-down($bp) {\n'+
      '  @if $bp == sm { @media (max-width: $breakpoint-sm - 1px) { @content; } }\n'+
      '  @else if $bp == md { @media (max-width: $breakpoint-md - 1px) { @content; } }\n'+
      '  @else if $bp == lg { @media (max-width: $breakpoint-lg - 1px) { @content; } }\n'+
      '  @else if $bp == xl { @media (max-width: $breakpoint-xl - 1px) { @content; } }\n'+
      '  @else { @warn "Unsupported breakpoint: #{$bp}"; }\n}\n';
    // _font.scss：Latin 走 Geist / Geist Mono（Google Fonts），中文 CJK 走系統字 per-character fallback
    const F_FONT=HD('_font.scss｜字體設定')+
      "@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Epilogue:wght@400..800&family=Noto+Sans+TC:wght@400..700&display=swap');\n\n"+
      ':root {\n  --font-sans: '+SANS+';\n  --font-mono: '+MONO+';\n  --font-display: '+DISP+';\n}\n\nbody {\n  font-family: var(--font-sans);\n  -webkit-font-smoothing: antialiased;\n}\n';
    // layout.scss：reset —— 清各瀏覽器原生樣式差異；保留 focus-visible（鍵盤操作仍看得到焦點，a11y）
    const F_LAYOUT=HD('layout.scss｜reset（清原生樣式、統一各瀏覽器基準）')+
      '*, *::before, *::after { box-sizing: border-box; }\n* { word-wrap: break-word; }\n\n'+
      'html, body { margin: 0; padding: 0; }\nbody { width: 100%; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }\nmain { margin: 0; padding: 0; }\np { margin: 0; }\nh1, h2, h3, h4, h5, h6 { margin: 0; font-size: inherit; font-weight: inherit; }\nul, ol { list-style: none; margin: 0; padding: 0; }\na { color: inherit; text-decoration: none; }\nbutton { border: 0; background: none; font: inherit; cursor: pointer; }\nimg, svg, video { display: block; max-width: 100%; }\n\n'+
      '/* 焦點：滑鼠點擊不顯外框，鍵盤操作（focus-visible）保留外框 —— 不無條件 outline:none（a11y） */\n:focus:not(:focus-visible) { outline: none; }\n:focus-visible { outline: 2px solid var(--s-action-primary, currentColor); outline-offset: 2px; }\n\n'+
      '/* IE 輸入框原生 X / 眼睛 */\n::-ms-clear, ::-ms-reveal { display: none; }\n/* Safari 輸入框原生外觀 */\ninput, textarea { -webkit-appearance: none; appearance: none; }\n\n'+
      '/* 捲軸（webkit）*/\n::-webkit-scrollbar { width: 4px; height: 4px; }\n::-webkit-scrollbar-track { background: none; }\n::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, .2); border-radius: 15px; transition: .3s; }\n::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, .4); }\n';
    const BT='```';
    const F_README=[
      '# CDL · 樣式包（@goons/styles）',
      '',
      '由 Design Token 頁輸出的全站共用樣式包。token 命名為 **source of truth**，開發端直接以 `var(--token)` 取用。',
      '',
      '| 檔案 | 內容 |',
      '|---|---|',
      '| `_variables.scss` | 設計 token（L1 純值 → L2 語意；含 light/dark 與響應式）|',
      '| `_breakpoints.scss` | 斷點變數 `$breakpoint-*` ＋ `breakpoint-up/down` mixin |',
      '| `_font.scss` | 字體 import ＋ `--font-sans/mono` |',
      '| `layout.scss` | reset：清各瀏覽器原生樣式、統一基準（保留 focus-visible）|',
      '',
      '## 使用方式（Nuxt）',
      '',
      '### 1. 引入 reset 與字體',
      BT+'ts',
      'export default defineNuxtConfig({',
      "  css: ['@goons/styles/layout.scss', '@goons/styles/_font.scss'],",
      '})',
      BT,
      '',
      '### 2. 讓變數與 mixin 全域可用',
      BT+'ts',
      'export default defineNuxtConfig({',
      '  vite: { css: { preprocessorOptions: { scss: {',
      '    additionalData: `',
      '      @use "@goons/styles/_variables.scss" as *;',
      '      @use "@goons/styles/_breakpoints.scss" as *;',
      '    `,',
      '  } } } },',
      '})',
      BT,
      '',
      '### 3. 元件套用',
      '元件只要**套 class、照基本 HTML 結構**就有樣式；寬高、定位等「佈局」屬性留給使用端決定：',
      BT+'html',
      '<button class="btn v-solid i-primary sz-m"><span>送出</span></button>',
      BT,
      BT+'scss',
      '.some-layout {',
      '  .btn { width: 100%; }              // 佈局（寬高/定位）由使用端寫',
      '  @include breakpoint-up(md) { ... } // 斷點用 mixin',
      '}',
      BT,
    ].join('\n')+'\n';
    // files：_variables 每次現算（反映當前 token 編輯），其餘為靜態內容
    return [
      {name:'_variables.scss',lang:'scss',desc:'設計 token（目前值；含 light/dark 與響應式）',get:()=>HD('_variables.scss｜設計 token（L1 純值 → L2 語意；含 light/dark 與響應式）')+tokBuildCSS()},
      {name:'_breakpoints.scss',lang:'scss',desc:'斷點變數＋mixin',get:()=>F_BP},
      {name:'_font.scss',lang:'scss',desc:'字體 import＋--font-*',get:()=>F_FONT},
      {name:'layout.scss',lang:'scss',desc:'reset（保留 focus-visible）',get:()=>F_LAYOUT},
      {name:'README.md',lang:'md',desc:'樣式包引入教學（Nuxt）',get:()=>F_README},
    ];
  }
  /* 已選元件（依 DIAL_SPECS 順序，跟需求匯總一致） */
  function flwSelIds(){return Object.keys(DIAL_SPECS).filter(id=>SUMSEL.has(id));}
  function flwReadme(){const n=FLW.info.name;const k=flwSelIds().length;const BT='```';return `# ${n} — 交棒說明

這包是在 CDL Studio 網站「開新專案」流程產生的（${n}.zip）。

## 放到 repo

把 zip 解壓到 repo 的 \`projects/\` 底下，會得到 \`projects/${n}/\`：

${BT}
projects/${n}/
├─ README.md                 這份交棒說明
├─ opening-interview.md      Phase 0 訪談紀錄
├─ proposal.json             初始提案（token＋元件）
├─ tokens.export.json        最終 token（含在網站上的調整）
├─ components.export.json    最終元件與樣式軸
├─ selection.state.json      網站完整狀態（續編用）
├─ components.html           已選的 ${k} 個元件 HTML 結構，一個檔、依元件分段（同元件頁「程式碼」面板）
└─ styles/                   樣式包：_variables.scss（目前 token 值）
   │                         _breakpoints.scss／_font.scss／layout.scss／README.md
   └─ components/            每個元件一個 partial：_<id>.scss（平放，不包資料夾）
      └─ _index.scss         合併入口：@forward 全部已選元件
${BT}

JSON 與訪談紀錄放在專案根目錄：sync 腳本與 \`?project=\` 續編都從這裡讀，不要移進子資料夾。

## 接下來

1. 在 Claude Code 開這個 repo，說：「依 ds-studio-flow 從 Step 5 接續 ${n}」。
2. Claude 會先讀 opening-interview.md 跟你確認標了 assumed-default 的項目，再 build、寫 Figma。
3. 前端可直接用 styles/ 與 components/：全域 @use \`styles/_variables.scss\`（見 styles/README.md），元件樣式一次引入用 \`@use "styles/components"\`（走 _index.scss），只要幾顆就 \`@use "styles/components/button"\`；HTML 結構看 components.html。

之後想再調整：開 \`gallery.html?project=${n}\`（需 studio server），網站會載入 selection.state.json 接續。
`;}
  /* 文件群組（專案根目錄）：[{name,desc,get()}] —— 每次 get 都現算 */
  function flwDocFiles(){const J=o=>JSON.stringify(o,null,2);const p=()=>dsBuildExport();return [
    {name:'opening-interview.md',desc:'訪談紀錄（Phase 0）',get:()=>flwInterviewMD()},
    {name:'proposal.json',desc:'初始提案（token＋元件）',get:()=>J(FLW.proposal)},
    {name:'tokens.export.json',desc:'最終 token',get:()=>J(p().tokens)},
    {name:'components.export.json',desc:'最終元件與樣式軸',get:()=>J(p().components)},
    {name:'selection.state.json',desc:'網站完整狀態（續編用）',get:()=>J(p().state)},
    {name:'README.md',desc:'交棒說明（先看這份）',get:()=>flwReadme()}];}

  /* ---- 元件程式碼（zip 用）：離屏跑一次該元件頁的 build，攔下 makeCodePanel，拿到「元件頁程式碼面板」實際顯示的 HTML 與 SCSS 產生器。
     不另寫元件產生邏輯；HTML 依中央 store（CHOICE）篩選後的初始狀態，跟元件頁一打開看到的一樣。 ---- */
  function flwCompCode(id){
    const build=id==='button'?(h=>{h.innerHTML=buttonViewHTML();renderLive();}):(BUILD[id]||(LIVE[id]&&(h=>LIVE[id](h))));
    if(!build)return null;
    const host=ce('div');host.setAttribute('aria-hidden','true');host.inert=true;
    host.style.cssText='position:fixed;left:-20000px;top:0;width:1200px;visibility:hidden;pointer-events:none;';
    const caps=[],orig=makeCodePanel,cur0=current,saved=new Map([...LIVE_REFRESH].map(([k,v])=>[k,v.slice()]));
    makeCodePanel=function(h,chip,o){const cp=orig(h,chip,o);const c={h,html:'',css:null};caps.push(c);
      return {set(r){c.html=r;cp.set(r);},setCssProvider(f){c.css=f;cp.setCssProvider(f);},setTab(t){cp.setTab(t);}};};
    document.body.prepend(host);   // 放 body 最前面：build 內的 getElementById（#cbody、#liveCtl…）先找到離屏這份，不會動到背景頁
    let out=null;
    try{build(host);
      const ttl=h=>{const s=h.closest('section.block');const t=s&&s.querySelector('.bh-t');return t?t.textContent.trim():'';};
      const css=f=>{if(!f)return '';try{return f();}catch(e){return '/* SCSS 產生失敗 */';}};
      if(caps.length)out={src:'panel',parts:caps.map(c=>({t:ttl(c.h),html:c.html,css:css(c.css)}))};
      else{const nd=host.querySelector('.live-stage > *')||host.querySelector('.mcell > *');   // 元件頁沒有程式碼面板 → 序列化互動預覽（同 liveMarkup／componentCss）
        if(nd)out={src:'preview',parts:[{t:'',html:liveMarkup(nd),css:css(()=>componentCss(()=>nd.cloneNode(true),[]))}]};}
    }catch(e){out={err:String(e&&e.message||e)};}
    finally{makeCodePanel=orig;host.remove();LIVE_REFRESH.clear();saved.forEach((v,k)=>LIVE_REFRESH.set(k,v));current=cur0;}
    return out;}
  function flwCompFiles(id,cc){const nm=componentName(id),parts=cc.parts,multi=parts.length>1;
    const html='<!-- CDL · '+nm+'（'+id+'）HTML｜'+(cc.src==='panel'?'同元件頁「程式碼 · HTML」':'元件頁沒有程式碼面板，由互動預覽序列化')+'；樣式見 '+id+'.scss，token 由 styles/_variables.scss 提供 -->\n\n'+
      parts.map((p,i)=>(multi?'<!-- ── '+(i+1)+'／'+parts.length+(p.t?' · '+p.t:'')+' ── -->\n':'')+String(p.html||'').trim()).join('\n\n')+'\n';
    const seen=new Set(),cs=parts.filter(p=>{const k=String(p.css||'').trim();if(!k||seen.has(k))return false;seen.add(k);return true;});
    const scss='/* CDL · '+nm+'（'+id+'）SCSS｜'+(cc.src==='panel'?'同元件頁「程式碼 · SCSS」':'由互動預覽推導')+'；token 以 var(--token) 取用，先全域 @use styles/_variables.scss */\n\n'+
      cs.map((p,i)=>(cs.length>1?'/* ── '+(i+1)+'／'+cs.length+(p.t?' · '+p.t:'')+' ── */\n':'')+String(p.css).trim()).join('\n\n')+'\n';
    return {html,scss};}

  /* ---- zip（store、不壓縮；CRC32；UTF-8 檔名）：不引外部 lib ---- */
  const FLW_CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?(0xEDB88320^(c>>>1)):(c>>>1);t[n]=c>>>0;}return t;})();
  function flwCrc32(u){let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=FLW_CRC[(c^u[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
  function flwZip(files){const enc=new TextEncoder(),d=new Date();
    const tm=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
    const loc=[],cen=[];let off=0;
    files.forEach(f=>{const nm=enc.encode(f.path),data=enc.encode(f.text),crc=flwCrc32(data);
      const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);
      h.setUint16(10,tm,true);h.setUint16(12,dt,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,nm.length,true);h.setUint16(28,0,true);
      loc.push(h,nm,data);
      const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);
      c.setUint16(12,tm,true);c.setUint16(14,dt,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,nm.length,true);
      c.setUint32(42,off,true);cen.push(c,nm);off+=30+nm.length+data.length;});
    const size=cen.reduce((s,b)=>s+b.byteLength,0);
    const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,size,true);e.setUint32(16,off,true);
    return new Blob([...loc,...cen,e],{type:'application/zip'});}
  /* 整包檔案清單：<name>/（文件＋components.html）＋ styles/（含 components/_<id>.scss＋_index.scss）；元件逐顆產生，中間讓出主執行緒並回報進度 */
  async function flwBuildFiles(onProgress){flwSnapSave();const n=FLW.info.name||'project';const out=[];const add=(p,t)=>out.push({path:n+'/'+p,text:t});
    flwDocFiles().forEach(f=>add(f.name,f.get()));
    tokStylePackFiles().forEach(f=>add('styles/'+f.name,f.get()));
    const ids=flwSelIds(),fw=[],html=[],idx=[];
    for(let i=0;i<ids.length;i++){const id=ids[i];if(onProgress)onProgress(i+1,ids.length);await new Promise(r=>setTimeout(r,0));
      const cc=flwCompCode(id);
      if(cc&&cc.parts&&cc.parts.length){const f=flwCompFiles(id,cc);
        add('styles/components/_'+id+'.scss',f.scss);fw.push('@forward "'+id+'";');                       // SCSS partial 平放，_index.scss 合併
        html.push('<!-- ═════ '+componentName(id)+'（'+id+'）· 樣式：styles/components/_'+id+'.scss ═════ -->\n'+String(f.html).trim());
        idx.push('  '+id.padEnd(16)+componentName(id)+(cc.src==='panel'?'':'（互動預覽序列化）'));}
      else idx.push('  '+id.padEnd(16)+componentName(id)+'（沒有產出：'+(cc&&cc.err?cc.err:'元件頁沒有程式碼')+'）');}
    if(fw.length){add('styles/components/_index.scss','// '+n+' · 元件樣式合併入口（已選 '+fw.length+' 個）\n// 全部引入：@use "styles/components";　只要一顆：@use "styles/components/button";\n// token 一律 var(--token)，請先全域引入 ../_variables.scss\n\n'+fw.join('\n')+'\n');
      add('components.html','<!--\n  '+n+' · 元件 HTML 結構（已選 '+ids.length+' 個，內容同元件頁「程式碼」面板）\n  樣式：styles/components/_<id>.scss，或一次引入 styles/components/_index.scss\n\n'+idx.join('\n')+'\n-->\n\n'+html.join('\n\n')+'\n');}
    return out;}
  /* 匯出前檢查（固定規則；之後換 AI） */
  function flwChecks(){const out=[];const W=flwPrim('--c-neutral-0')||'#FFFFFF';
    const OV=window.__tokOverrides||{};const root=OV.root||{};
    const rv=v=>{v=String(v||'');const m=v.match(/^var\((--[^)]+)\)$/);return m?flwPrim(m[1]):v;};
    const p500=rv(root['--c-brand-500'])||flwPrim('--c-brand-500');const onL=root['--primary-on']?rv(root['--primary-on']):W;
    const c1=flwContrast(p500,onL);out.push({ok:c1>=4.5,lv:c1>=4.5?'pass':(c1>=3?'warn':'fail'),t:'主色與按鈕文字對比（淺色）',d:c1.toFixed(2)+':1，需 4.5:1 以上'});
    const probe=ce('span');probe.style.cssText='position:absolute;visibility:hidden;color:var(--primary-on);background:var(--accent);';document.body.appendChild(probe);
    const cs=getComputedStyle(probe);const c2=flwContrast(cs.backgroundColor,cs.color);probe.remove();
    if(document.documentElement.getAttribute('data-theme')==='dark')out.push({ok:c2>=4.5,lv:c2>=4.5?'pass':(c2>=3?'warn':'fail'),t:'主色與按鈕文字對比（深色）',d:c2.toFixed(2)+':1，需 4.5:1 以上'});
    const s500=rv(root['--c-brand2-500'])||flwPrim('--c-brand2-500');const onS=root['--accent2-on']?rv(root['--accent2-on']):W;const c3=flwContrast(s500,onS);
    out.push({ok:c3>=3,lv:c3>=4.5?'pass':(c3>=3?'warn':'fail'),t:'副色與上方文字對比',d:c3.toFixed(2)+':1，小字建議 4.5:1、至少 3:1'});
    const n=SUMSEL.size;out.push({ok:n>=FLW_MIN_COMP,lv:n>=FLW_MIN_COMP?'pass':'fail',t:'已選元件數',d:'目前 '+n+' 個，至少要 '+FLW_MIN_COMP+' 個'});
    out.push({ok:SUMSEL.has('button'),lv:SUMSEL.has('button')?'pass':'warn',t:'包含 Button',d:SUMSEL.has('button')?'已選':'幾乎所有產品都需要按鈕，確認是否真的不要'});
    return out;}
  async function flwDownloadAll(onProgress){const files=await flwBuildFiles(onProgress);const n=FLW.info.name||'project';const file=n+'.zip';
    const a=document.createElement('a');a.href=URL.createObjectURL(flwZip(files));a.download=file;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    return {file,count:files.length};}

  /* NAV-DL:v1 下載元件庫：瀏覽模式看到的預設（沒有任何調整）的 token 與全部元件樣式 → goons-ds-library.zip */
  async function dsBuildDefaultFiles(onProgress){
    const n='goons-ds-library',out=[],add=(p,t)=>out.push({path:n+'/'+p,text:t});
    const sv={ov:window.__tokOverrides,dis:window.__tokDisabled,bd:window.__compBindings,sel:new Set(SUMSEL),ch:{}};
    Object.keys(CHOICE).forEach(id=>{const a=CHOICE[id].active;sv.ch[id]={};Object.keys(a).forEach(k=>sv.ch[id][k]=new Set(a[k]));});
    const setAll=(src)=>Object.keys(CHOICE).forEach(id=>{const a=CHOICE[id].active,ax=DIAL_SPECS[id]&&DIAL_SPECS[id].axes;Object.keys(a).forEach(k=>{const v=src?src[id][k]:(ax&&ax[k]);if(!v)return;a[k].clear();v.forEach(x=>a[k].add(x));});});
    try{
      window.__tokOverrides={root:{},dark:{},desktop:{},tablet:{},mobile:{}};window.__tokDisabled=new Set();window.__compBindings={};
      SUMSEL.clear();Object.keys(DIAL_SPECS).forEach(id=>SUMSEL.add(id));setAll(null);
      tokStylePackFiles().forEach(f=>add('styles/'+f.name,f.get()));
      const ids=Object.keys(DIAL_SPECS),fw=[],html=[],idx=[];
      for(let i=0;i<ids.length;i++){const id=ids[i];if(onProgress)onProgress(i+1,ids.length);await new Promise(r=>setTimeout(r,0));
        let cc=null;try{cc=flwCompCode(id);}catch(e){cc={err:e.message};}
        if(cc&&cc.parts&&cc.parts.length){const f=flwCompFiles(id,cc);add('styles/components/_'+id+'.scss',f.scss);fw.push('@forward "'+id+'";');
          html.push('<!-- ═════ '+componentName(id)+'（'+id+'）· 樣式：styles/components/_'+id+'.scss ═════ -->\n'+String(f.html).trim());idx.push('  '+id.padEnd(16)+componentName(id));}
        else idx.push('  '+id.padEnd(16)+componentName(id)+'（沒有產出）');}
      add('styles/components/_index.scss','// Goons DS 元件庫 · 元件樣式合併入口（全部 '+fw.length+' 個，預設值）\n// 全部引入：@use "styles/components";　只要一顆：@use "styles/components/button";\n// token 一律 var(--token)，請先引入 styles/_variables.scss\n\n'+fw.join('\n')+'\n');
      add('components.html','<!--\n  Goons DS 元件庫 · 元件 HTML 結構（全部 '+ids.length+' 個，預設值，內容同元件頁「程式碼」面板）\n\n'+idx.join('\n')+'\n-->\n\n'+html.join('\n\n')+'\n');
      add('README.md','# Goons DS 元件庫（預設）\n\n網站瀏覽模式看到的樣子：沒有任何 token 調整、所有元件與變體。\n\n- `styles/`：Design Token 與基礎樣式（`_variables.scss` 含淺色／深色與響應式數值）\n- `styles/components/`：每顆元件一個 SCSS，`_index.scss` 一次引入全部\n- `components.html`：每顆元件的 HTML 結構\n\n要做自己的專案：回到網站按「開啟新專案」，調整後再匯出。\n');
    }finally{
      window.__tokOverrides=sv.ov;window.__tokDisabled=sv.dis;window.__compBindings=sv.bd;
      SUMSEL.clear();sv.sel.forEach(x=>SUMSEL.add(x));setAll(sv.ch);
    }
    return out;}
  async function dsDownloadDefault(btn){if(btn&&btn.classList.contains('is-busy'))return;
    const t=btn&&btn.querySelector('.nav-dl-t,[data-dl-t]'),t0=t&&t.textContent;if(btn){btn.classList.add('is-busy');btn.setAttribute('aria-busy','true');}
    try{const files=await dsBuildDefaultFiles((i,n)=>{if(t)t.textContent='打包中 '+i+' / '+n;});
      const a=document.createElement('a');a.href=URL.createObjectURL(flwZip(files));a.download='goons-ds-library.zip';document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),4000);if(t)t.textContent='已下載';
    }catch(e){if(t)t.textContent='下載失敗，請再試一次';console.error(e);}
    finally{if(btn){btn.classList.remove('is-busy');btn.removeAttribute('aria-busy');}if(t)setTimeout(()=>{t.textContent=t0;},1800);}}

  /* ---- 共用 UI 小工具（全部用既有原子：mkBtn／fldEl／ddField／sgmEl／tagEl／drzEl／alEl／stpStepper／Modal） ---- */
  let FLW_UID=0;
  function flwBtn(variant,intent,text,size,o){o=o||{};const b=mkBtn({variant,intent,size:size||'m',isLive:true,disabled:!!o.disabled});b.type='button';b.querySelector('span').textContent=text;return b;}
  function flwAiBadge(){const t=tagEl('soft','brand2','default','round');t.classList.add('flw-ai-badge');t.innerHTML=ICON_SPARK+'<span>AI 之後接上</span>';return t;}
  function flwAiSlot(title,desc,fallback){const w=ce('div','flw-ai');const hd=ce('div','flw-ai-hd');const t=ce('span','flw-ai-t');t.textContent=title;hd.append(t,flwAiBadge());
    const d=ce('p','flw-ai-d');d.textContent=desc;w.append(hd,d);if(fallback){const r=ce('div','flw-ai-fb');const l=ce('span','flw-ai-fl');l.textContent='目前先用：';r.append(l,fallback);w.appendChild(r);}return w;}
  const flwLabelable=el=>el&&/^(INPUT|TEXTAREA|BUTTON|SELECT)$/.test(el.tagName);
  /* Field 外框（同 fldEl 結構：.fld > .fld-label ＋ .fld-ctl > 控制項 ＋ .fld-msg）。
     o.focus＝要接 label／aria 的元素；o.box＝出錯時加 st-error 的外框；o.group＝群組型控制項（segmented／chips／dropzone）用 aria-labelledby */
  function flwFld(label,ctl,o){o=o||{};const id='flw-f'+(++FLW_UID);const fe=o.focus||ctl;
    const f=ce('div','fld fld-vertical st-default');
    const lb=ce(!o.group&&flwLabelable(fe)?'label':'span','fld-label');lb.id=id+'-l';
    lb.innerHTML=flwEsc(label)+(o.required?'<span class="req" aria-hidden="true">*</span>':'')+(o.optional?'<span class="fld-opt">選填</span>':'');
    const c=ce('div','fld-ctl');c.appendChild(ctl);
    const m=ce('div','fld-msg');m.id=id+'-m';if(o.hint)m.textContent=o.hint;c.appendChild(m);
    if(o.group)ctl.setAttribute('aria-labelledby',lb.id),ctl.removeAttribute('aria-label');
    else if(flwLabelable(fe)){if(!fe.id)fe.id=id+'-c';lb.htmlFor=fe.id;}
    else{fe.setAttribute('aria-labelledby',lb.id);lb.addEventListener('click',()=>fe.focus());}
    if(o.required&&!o.group)fe.setAttribute('aria-required','true');
    fe.setAttribute('aria-describedby',m.id);
    f.append(lb,c);f.__hint=o.hint||'';f.__box=o.box||null;f.__focus=fe;if(o.span)f.classList.add('flw-span');
    return f;}
  /* 文字欄位：直接用 Field 原子 fldEl（live＝真 input） */
  function flwText(label,o){o=o||{};const f=fldEl('vertical','default',{live:true,label,placeholder:o.placeholder||'',value:o.value||'',required:o.required,optional:o.optional,hint:o.hint});
    const inp=f.querySelector('input'),box=f.querySelector('.fld-box');box.classList.add('live-field');if(o.type)inp.type=o.type;inp.spellcheck=false;inp.autocomplete='off';
    if(o.required){inp.required=false;inp.setAttribute('aria-required','true');}
    let m=f.querySelector('.fld-msg');if(!m){m=ce('div','fld-msg');m.id='fld-msg-'+(++FLD_ID);inp.setAttribute('aria-describedby',m.id);f.querySelector('.fld-ctl').appendChild(m);}
    box.addEventListener('mousedown',e=>{if(e.target===box){e.preventDefault();inp.focus();}});
    f.__hint=o.hint||'';f.__box=box;f.__focus=inp;if(o.span)f.classList.add('flw-span');
    inp.addEventListener('input',()=>{flwSetErr(f,null);if(o.onInput)o.onInput(inp.value);});return {f,inp};}
  function flwSetErr(f,msg){if(!f)return;const m=f.querySelector('.fld-msg');const box=f.__box,fe=f.__focus;
    if(!msg){if(box)box.classList.remove('st-error');if(fe)fe.removeAttribute('aria-invalid');if(m){m.className='fld-msg';m.textContent=f.__hint||'';}return;}
    if(box)box.classList.add('st-error');if(fe)fe.setAttribute('aria-invalid','true');
    if(m){m.className='fld-msg is-err';m.innerHTML=`<span class="fld-msg-ic">${NT_IC_ERROR}</span><span>${flwEsc(msg)}</span>`;}}
  /* Segmented 原子（full＝撐滿欄寬，跟 input 同寬同高） */
  function flwSeg(pairs,cur,onChange){const i0=Math.max(0,pairs.findIndex(p=>p[0]===cur));
    return sgmEl('soft','m',{live:true,full:true,items:pairs.map(p=>p[1]),active:i0,onChange:i=>onChange(pairs[i][0])});}
  /* 色彩輸入：.field 外框＋Design Token 頁同款色票鈕（.tok-sw-btn）＋等寬色碼 */
  function flwColor(val,onChange,ph){const box=ce('div','field v-outline live-field flw-color');
    const cp=document.createElement('input');cp.type='color';cp.className='tok-sw-btn';cp.setAttribute('aria-label','開啟選色器');
    const tx=document.createElement('input');tx.type='text';tx.className='bare';tx.placeholder=ph||'#2F6B4F';tx.value=val||'';tx.spellcheck=false;tx.autocomplete='off';tx.maxLength=7;
    const sync=()=>{const h=flwHex(tx.value);if(h)cp.value=h.toLowerCase();};sync();
    cp.oninput=()=>{tx.value=cp.value.toUpperCase();onChange(tx.value);};tx.oninput=()=>{sync();onChange(tx.value.trim());};
    box.addEventListener('mousedown',e=>{if(e.target===box){e.preventDefault();tx.focus();}});
    box.append(cp,tx);box.__text=tx;return box;}
  function flwAlert(intent,title,desc){const a=alEl('soft',intent,{});const t=a.querySelector('.al-title'),d=a.querySelector('.al-desc');if(t)t.textContent=title;if(d){if(desc)d.textContent=desc;else d.remove();}return a;}
  function flwStepHead(body,title,desc,badge){const h=ce('div','flw-sh');const r=ce('div','flw-sh-t');const t=ce('h2','flw-st');t.id='flwStepTitle';t.textContent=title;r.appendChild(t);if(badge)r.appendChild(flwAiBadge());h.appendChild(r);
    if(desc){const d=ce('p','flw-sd');d.innerHTML=desc;h.appendChild(d);}body.appendChild(h);}

  /* ---- 外框：library Modal（大版）。#start 深連結＝在首頁上開；關閉（× / Esc）保留草稿並還焦點；點遮罩不關、不丟資料 ---- */
  let FLW_UI=null;
  function flwFocusables(root){return [...root.querySelectorAll('button:not([disabled]),input:not([disabled]):not([type=hidden]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')]
    .filter(el=>!el.hidden&&el.getClientRects().length);}
  function flwKey(e){const U=FLW_UI;if(!U)return;
    if(document.querySelector('.ds-ovl'))return;                      // 上層確認框（重新開始）優先處理自己的鍵盤
    if(e.key==='Escape'){e.preventDefault();flwClose();return;}
    if(e.key==='Tab'){const f=flwFocusables(U.card);if(!f.length)return;const a=f[0],z=f[f.length-1],cur=document.activeElement;
      if(!U.card.contains(cur)){e.preventDefault();(e.shiftKey?z:a).focus();return;}
      if(e.shiftKey&&(cur===a||cur===U.card)){e.preventDefault();z.focus();}
      else if(!e.shiftKey&&cur===z){e.preventDefault();a.focus();}}}
  function flwOpen(o){o=o||{};const exp=o.mode==='export';
    if(FLW_UI)return;
    if(!FLW.active)dsEnterEdit();   // MODE:v1 開啟新專案＝進入編輯模式
    const ret=document.activeElement;
    const ovl=ce('div','mdl-overlay mdl-fixed flw-ovl');
    const card=ce('div','mdl-card mdl-kind-modal mdl-larger flw-m'+(exp?' is-export':''));card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
    card.setAttribute('aria-labelledby','flwTitle');card.setAttribute('aria-describedby','flwSub');card.tabIndex=-1;
    const hd=ce('div','flw-hd');const mh=ce('div','mdl-mhead');const ht=ce('div','mdl-mhead-txt');
    ht.innerHTML='<div class="mdl-title" id="flwTitle">'+(exp?'匯出檔案':'開啟新專案')+'</div><div class="mdl-sub" id="flwSub" aria-live="polite"></div>';
    const act=ce('div','flw-hd-act');const rst=flwBtn('text','secondary','重新開始','m');rst.classList.add('flw-rst');  /* 放在底部「上一步」右邊（每次換步驟由 flwRenderStep 掛回 nav） */
    const x=mdlClose(false);x.type='button';x.setAttribute('aria-label','關閉（草稿會保留）');x.title='關閉（草稿會保留）';
    act.append(x);mh.append(ht,act);
    const prog=ce('div','flw-prog');hd.append(mh,prog);
    const body=ce('div','mdl-content flw-body');const nav=ce('div','mdl-foot flw-nav');
    card.append(hd,body,nav);ovl.appendChild(card);
    FLW_UI={ovl,card,body,nav,prog,ret,rst,mode:exp?'export':'flow',resume:!exp&&!!(FLW.updated&&FLW.step>0)};
    rst.onclick=()=>dsDialog({title:'清除這份草稿？',sub:'問卷答案、提案和網站上已套用的 token、元件勾選都會清掉，回到元件庫預設。',okText:'清除並重來',cancelText:'取消',
      onOk:()=>{flwResetSite();FLW=flwBlank();FLW.active=true;FLW_FILES.length=0;flwSave();if(FLW_UI){FLW_UI.resume=false;flwRenderStep(true);}}});
    x.onclick=()=>flwClose();
    /* 點遮罩：不關閉（避免誤觸丟掉進度），焦點留在對話框 */
    ovl.addEventListener('mousedown',e=>{if(e.target===ovl){e.preventDefault();if(!card.contains(document.activeElement))card.focus({preventScroll:true});}});
    document.addEventListener('keydown',flwKey);
    document.body.appendChild(ovl);
    if(!exp&&location.hash!=='#start')history.replaceState(null,'','#start');
    flwPill();
    flwRenderStep(false);
    requestAnimationFrame(()=>{if(FLW_UI&&FLW_UI.card===card){const first=FLW.step===0&&body.querySelector('input.bare');(first||card).focus({preventScroll:true});}});
  }
  function flwClose(o){o=o||{};const U=FLW_UI;if(!U)return;FLW_UI=null;
    flwSnapSave();flwSave();document.removeEventListener('keydown',flwKey);
    if(!o.fromHash&&hashId()==='start')history.replaceState(null,'','#'+(window.__flwBg||'home'));
    U.ovl.classList.add('is-closing');afterAnim(U.ovl,()=>U.ovl.remove());
    flwPill();
    if(!o.noFocus){const r=U.ret;const pill=document.querySelector('#flwPill:not([hidden]) .pjb-next');
      const t=(r&&r.isConnected&&r!==document.body&&!U.ovl.contains(r))?r:pill;if(t)t.focus({preventScroll:true});}
  }
  /* 路由：#start 不換頁，在目前頁面（深連結／首次載入＝首頁）上開 modal */
  function flwRoute(){const v=document.getElementById('view');const bg=window.__flwBg;
    if(!bg||!v||!v.childElementCount){history.replaceState(null,'','#home');renderView('home');}
    else{current=bg;renderNav();}
    if(!FLW.active&&FLW.flowDone){history.replaceState(null,'','#'+(current||'home'));dsEnterEdit();flwPill();   // MODE:v1 已走完建立流程的草稿：直接回到編輯模式＋引導小卡，不再開彈窗
      requestAnimationFrame(()=>{const g=document.querySelector('#flwGuide .is-next .pjg-b, #flwGuide .pjg-pill');if(g)g.focus({preventScroll:true});});return;}
    flwOpen();}

  function flwRenderProg(){const U=FLW_UI;if(!U)return;const host=U.prog;host.innerHTML='';
    const steps=FLW_STEPS.map((s,i)=>({label:s.label,description:s.desc,state:i<FLW.step?'done':(i===FLW.step?'current':(i<=FLW.max?'done':'todo'))}));
    const st=stpStepper(matchMedia('(min-width:768px)').matches?'vertical':'horizontal','numbered',steps);host.appendChild(st);
    [...st.querySelectorAll('.stp-step,.stp-vstep')].forEach((el,i)=>{if(i<=FLW.max&&i!==FLW.step){el.classList.add('flw-jump');el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','回到步驟 '+(i+1)+' '+FLW_STEPS[i].label);
      const go=()=>{flwGo(i);};el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}};}
      if(i===FLW.step)el.setAttribute('aria-current','step');});
    const sub=document.getElementById('flwSub');if(sub)sub.textContent='步驟 '+(FLW.step+1)+' / '+FLW_STEPS.length+' · '+FLW_STEPS[FLW.step].label;}
  matchMedia('(min-width:768px)').addEventListener('change',()=>{if(FLW_UI)flwRenderProg();});   // 跨斷點：步驟直／橫切換
  function flwGo(i){if(i>FLW.max||i<0||i>=FLW_STEPS.length)return;FLW.step=i;flwSave();flwRenderStep(true);}
  function flwRenderStep(anim){const U=FLW_UI;if(!U)return;
    const body=U.body,nav=U.nav;
    body.innerHTML='';nav.innerHTML='';body.scrollTop=0;
    if(U.mode==='export'){U.prog.innerHTML='';const sub=document.getElementById('flwSub');if(sub)sub.textContent=FLW.info.name||'未命名專案';   // MODE:v1 右上「匯出檔案」
      flwS6(body);nav.appendChild(ce('div','spacer'));const cl=flwBtn('outline','secondary','關閉');cl.onclick=()=>flwClose();nav.appendChild(cl);return;}
    flwRenderProg();
    if(U.resume){U.resume=false;body.appendChild(flwAlert('info','已接續上次的草稿','停在「'+FLW_STEPS[FLW.step].label+'」，可以按上方步驟回去修改。'));}
    const ctx={valid:()=>true};
    [flwS1,flwS2,flwS3,flwS4][FLW.step](body,ctx);
    if(anim){body.classList.remove('flw-in');void body.offsetWidth;body.classList.add('flw-in');}
    const first=FLW.step===0;
    const back=flwBtn('outline','secondary','上一步','m',{disabled:first});
    if(first)back.setAttribute('aria-disabled','true');else back.onclick=()=>flwGo(FLW.step-1);
    nav.append(back);if(U.rst)nav.appendChild(U.rst);nav.appendChild(ce('div','spacer'));
    const cnt=ce('span','flw-count');cnt.textContent=(FLW.step+1)+' / '+FLW_STEPS.length;nav.appendChild(cnt);
    if(FLW.step<FLW_STEPS.length-1){const next=flwBtn('solid','primary',ctx.nextText||'下一步');next.classList.add('has-trail');next.insertAdjacentHTML('beforeend',ICON_ARROW);
      next.onclick=()=>{if(!ctx.valid()){const bad=body.querySelector('.fld-msg.is-err');const f=bad&&bad.closest('.fld');if(f&&f.__focus)f.__focus.focus();return;}
        if(ctx.onNext)ctx.onNext();FLW.step++;FLW.max=Math.max(FLW.max,FLW.step);flwSave();flwRenderStep(true);
        const t=document.getElementById('flwStepTitle');if(t){t.tabIndex=-1;t.focus({preventScroll:true});}};
      nav.appendChild(next);}
    else{const done=flwBtn('solid','primary',ctx.doneText||'完成');done.onclick=()=>{if(ctx.onDone)ctx.onDone();else flwClose();};nav.appendChild(done);}
  }

  /* Step 1 專案基本資料 */
  function flwS1(body,ctx){const i=FLW.info;
    flwStepHead(body,'專案基本資料','先決定專案叫什麼、給誰用。專案名稱會變成 <code>projects/&lt;名稱&gt;/</code> 資料夾名。');
    const g=ce('div','flw-form');body.appendChild(g);
    if(!i.name){i.name=flwDefaultName();}
    const name=flwText('專案名稱',{required:true,value:i.name,hint:'預設「品牌-日期」，只能用英數、中文、- 和 _',onInput:v=>{i.name=v.trim();i.nameTouched=true;flwSave();}});
    const brand=flwText('品牌名',{required:true,value:i.brand,placeholder:'例如：果思咖啡',hint:'會出現在訪談紀錄與 Figma 檔名',onInput:v=>{i.brand=v.trim();if(!i.nameTouched){i.name=flwDefaultName();name.inp.value=i.name;flwSetErr(name.f,null);}flwSave();}});
    const ind=ddField('outline',{options:FLW_INDUSTRY,value:i.industry||null,placeholder:'請選擇產業',onChange:v=>{i.industry=v;flwSetErr(indF,null);flwSave();}});
    const indTrg=ind.querySelector('.field.dd');
    const indF=flwFld('產業',ind,{required:true,hint:'用來推薦常用元件',focus:indTrg,box:indTrg});
    const plat=flwFld('平台',flwSeg(FLW_PLATFORM,i.platform,v=>{i.platform=v;flwSave();}),{required:true,group:true,hint:'決定要不要帶入 App 專用元件'});
    const fig=flwText('Figma 檔',{optional:true,type:'url',value:i.figma,placeholder:'https://www.figma.com/design/…',hint:'沒有的話之後由 Claude Code 開新檔',onInput:v=>{i.figma=v;flwSave();}});
    g.append(brand.f,name.f,indF,plat,fig.f);
    flwSave();
    ctx.valid=()=>{let ok=true;
      if(!i.brand){flwSetErr(brand.f,'請填品牌名');ok=false;}
      if(!i.name||!/^[a-z0-9㐀-鿿_-]+$/i.test(i.name)){flwSetErr(name.f,'名稱只能用英數、中文、- 和 _，不能有空白');ok=false;}
      if(!i.industry){flwSetErr(indF,'請選擇產業');ok=false;}
      return ok;};
  }
  /* Step 2 匯入資料 */
  function flwS2(body,ctx){const s=FLW.src;
    flwStepHead(body,'匯入資料','有 CI 品牌規範、PRD 或規格書就放進來。沒有也可以先跳過，下一步直接填問卷。');
    const g=ce('div','flw-form');body.appendChild(g);
    /* Dropzone 原子（drzEl 結構＋drzFile 列表，同 drzLive 的拖放／鍵盤接線）；檔案只留在記憶體、不上傳 */
    const dz=drzEl('default','m',{});const a=dz.querySelector('.drz-area'),ul=dz.querySelector('.drz-files');const h=dz.querySelector('.drz-hint');if(h)h.textContent='PDF、圖片、文件皆可 · 只留在這個分頁，不會上傳';
    const inp=document.createElement('input');inp.type='file';inp.multiple=true;inp.hidden=true;inp.setAttribute('aria-hidden','true');dz.appendChild(inp);
    const draw=()=>{ul.innerHTML='';s.files.forEach((f,k)=>{const li=drzFile(f.name,f.size,'done',100,{live:true});const m=li.querySelector('.drz-fm');
        const inMem=FLW_FILES.some(x=>x.name===f.name&&x.size===f.size);if(m)m.textContent=drzSize(f.size)+(inMem?' · 已讀入':' · 只剩紀錄（重新整理後檔案內容不保留）');
        li.querySelector('.btn').onclick=()=>{s.files.splice(k,1);const j=FLW_FILES.findIndex(x=>x.name===f.name&&x.size===f.size);if(j>=0)FLW_FILES.splice(j,1);flwSave();draw();a.focus();};ul.appendChild(li);});};
    const addFiles=list=>{[...list].forEach(f=>{if(s.files.some(x=>x.name===f.name&&x.size===f.size))return;FLW_FILES.push(f);s.files.push({name:f.name,size:f.size,type:f.type||''});});flwSave();draw();};
    a.addEventListener('click',()=>inp.click());a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click();}});
    inp.addEventListener('change',()=>{addFiles(inp.files);inp.value='';});
    let depth=0;const over=v=>{dz.classList.toggle('drz-st-dragover',v);dz.classList.toggle('drz-st-default',!v);const t=a.querySelector('.drz-t');if(t)t.innerHTML=v?'放開以加入':'拖曳檔案到這裡，或 <b>選擇檔案</b>';};
    a.addEventListener('dragenter',e=>{e.preventDefault();depth++;over(true);});a.addEventListener('dragover',e=>e.preventDefault());
    a.addEventListener('dragleave',()=>{if(--depth<=0){depth=0;over(false);}});
    a.addEventListener('drop',e=>{e.preventDefault();depth=0;over(false);if(e.dataTransfer)addFiles(e.dataTransfer.files);});
    draw();
    const dzF=flwFld('CI／PRD 檔案',dz,{optional:true,group:true,span:true,focus:a});
    const ta=document.createElement('textarea');ta.className='tarea v-outline';ta.rows=5;ta.placeholder='貼上品牌規範、需求說明或任何文字。內含色碼（例如 #2F6B4F）會自動帶到問卷。';ta.value=s.text;
    const taF=flwFld('貼上文字',ta,{optional:true,span:true,box:ta,hint:'找到的前兩個色碼會當成主色／副色的預設值'});
    ta.oninput=()=>{s.text=ta.value;flwSave();};
    const url=flwText('參考連結',{optional:true,type:'url',value:s.url,placeholder:'https://',hint:'品牌官網、Notion、雲端資料夾等',span:true,onInput:v=>{s.url=v;flwSave();}});
    g.append(dzF,taF,url.f);
    const fill=flwBtn('outline','primary','填入範例','s');
    fill.onclick=()=>{const S=FLW_SAMPLE;s.text=S.text;ta.value=S.text;if(!FLW.info.brand)FLW.info.brand=S.brand;if(!FLW.info.industry)FLW.info.industry=S.industry;
      Object.assign(FLW.q,{color:S.color,primary:S.primary,secondary:S.secondary,font:S.font,tone:S.tone.slice(),dens:S.dens,read:S.read});
      s.extracted='範例資料：主色 '+S.primary+'、副色 '+S.secondary+'、調性 '+S.tone.join('／');flwSave();msg.textContent='已填入範例品牌資料，下一步可以直接看到答案。';};
    const msg=ce('span','flw-note');msg.setAttribute('aria-live','polite');
    const fb=ce('span','flw-inline');fb.append(fill,msg);
    body.appendChild(flwAiSlot('從資料自動萃取品牌錨點','之後會由 AI 讀上傳的 CI／PRD，自動抓出主色、副色、字體與調性，再讓你確認。',fb));
    ctx.onNext=()=>{const hx=(s.text.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/ig)||[]).map(flwHex).filter(Boolean);
      if(hx.length&&!FLW.q.primary){FLW.q.primary=hx[0];if(hx[1]&&!FLW.q.secondary)FLW.q.secondary=hx[1];
        s.extracted=(s.extracted?s.extracted+'；':'')+'從貼上文字抓到色碼 '+hx.slice(0,2).join('、');}
      flwSave();};
  }
  /* Step 3 品牌問卷（Phase 0 精簡版：Q3 品牌視覺＋Q7 深色） */
  function flwS3(body,ctx){const q=FLW.q;
    flwStepHead(body,'品牌問卷','4 個關於品牌與使用情境的問題，答案會換算成快速風格（間距、圓角、陰影…），下一步可以直接改。');
    if(FLW.src.extracted)body.appendChild(flwAlert('info','已從匯入資料帶入答案',FLW.src.extracted+'。請確認或修改。'));
    const g=ce('div','flw-form');body.appendChild(g);
    /* 每題下方即時顯示會帶入的快速風格 */
    const outs=[];const out=keys=>{const o=ce('div','flw-qmap');o.setAttribute('aria-live','polite');outs.push([o,keys]);return o;};
    const paint=()=>{const ps=flwPresetOf(q);outs.forEach(([o,keys])=>{o.innerHTML='';const h=ce('span','flw-qmap-h');h.textContent='帶入';o.appendChild(h);   /* 拆成單字 span，英文模式逐字對照 */
      keys.forEach(k=>{const it=ce('span','flw-qmap-i');const a=ce('span');a.textContent=TOK_PRESETS.find(x=>x.k===k).t;const b=ce('b');b.textContent=flwPresetLabel(k,ps[k]);it.append(a,b);o.appendChild(it);});});};
    const grp=(n,title)=>{const w=ce('div','flw-q');const h=ce('div','flw-qh');h.innerHTML='<span class="flw-qn">'+n+'</span>';const t=ce('span');t.textContent=title;h.appendChild(t);w.appendChild(h);return w;};
    /* 1 主色 */
    const q1=grp(1,'品牌主色是哪個方向？');
    const cdir=chpGroup('single','m',{label:'主色方向',value:q.color||'neutral',items:TOK_PRESETS.find(p=>p.k==='color').opts.map(([k,t])=>({k,label:t,dot:TOK_DOT[k]})),
      onChange:v=>{q.color=v;flwSave();paint();}});
    const cF=flwFld('方向',cdir,{group:true,span:true,hint:'沒有確定的品牌色就先選方向；有色號就填在右邊，以色號為準'});
    const pc=flwColor(q.primary,v=>{q.primary=v;flwSetErr(pF,null);flwSave();paint();});
    const pF=flwFld('主色色號',pc,{optional:true,focus:pc.__text,box:pc,hint:'用在主要按鈕與選中狀態'});
    const sc=flwColor(q.secondary,v=>{q.secondary=v;flwSetErr(sF,null);flwSave();},'#E0A458');
    const sF=flwFld('副色色號',sc,{optional:true,focus:sc.__text,box:sc,hint:'點綴與次要強調；沒有就維持預設'});
    q1.append(cF,pF,sF,out(['color']));
    /* 2 品牌感覺 */
    const q2=grp(2,'品牌給人的感覺？');
    const tone=chpGroup('multi','m',{label:'品牌感覺',value:q.tone,items:FLW_TONES.map(t=>({k:t,label:t})),onChange:v=>{q.tone=v;flwSave();paint();}});
    q2.append(flwFld('選 1 到 3 個',tone,{group:true,span:true,hint:'最後選的那個決定圓角、陰影、動態、字重；其他會寫進訪談紀錄'}),out(['radius','shadow','motion','weight']));
    /* 3 資訊量 */
    const q3=grp(3,'一個畫面上的資訊量？');
    const dn=chpGroup('single','m',{label:'資訊量',value:q.dens||'mid',items:FLW_DENS.map(([k,t])=>({k,label:t})),onChange:v=>{q.dens=v;flwSave();paint();}});
    q3.append(flwFld('想一下最常用的那一頁',dn,{group:true,span:true}),out(['space','size']));
    /* 4 主要讀者 */
    const q4=grp(4,'主要是誰在讀？');
    const rd=chpGroup('single','m',{label:'主要讀者',value:q.read||'pub',items:FLW_READ.map(([k,t])=>({k,label:t})),onChange:v=>{q.read=v;flwSave();paint();}});
    q4.append(flwFld('選最主要的一群',rd,{group:true,span:true}),out(['type','text']));
    /* 其他：字體、深色模式（不換算快速風格） */
    const q5=grp('＋','其他');
    const chs=(L,v,fn,lb)=>chpGroup('single','m',{label:lb,value:v,items:L.map(([k,t])=>({k,label:t})),onChange:fn});   // MODE:v2 同其他題用 Chip（單選）
    q5.append(flwFld('字體偏好',chs(FLW_FONT,q.font,v=>{q.font=v;flwSave();},'字體偏好'),{group:true,hint:'預設＝Geist 英文＋系統黑體；明體適合文藝、高級感品牌'}),
      flwFld('深色模式',chs(FLW_DARK,q.dark,v=>{q.dark=v;flwSave();},'深色模式'),{group:true,hint:'選「之後補」會先預留 dark 的位置'}));
    g.append(q1,q2,q3,q4,q5);paint();
    ctx.valid=()=>{let ok=true;
      if(q.primary&&!flwHex(q.primary)){flwSetErr(pF,'色碼格式不對，請用 #RRGGBB，或清空');ok=false;}
      if(q.secondary&&!flwHex(q.secondary)){flwSetErr(sF,'色碼格式不對，請用 #RRGGBB，或清空');ok=false;}
      if(ok){if(q.primary)q.primary=flwHex(q.primary);if(q.secondary)q.secondary=flwHex(q.secondary);}return ok;};
    ctx.onNext=()=>{const sig=JSON.stringify([FLW.q,FLW.info.platform,FLW.info.industry]);if(FLW.proposal&&FLW.qSig===sig)return;
      FLW.proposal=flwBuildProposal();FLW.qSig=sig;FLW.applied=false;flwSave();};
  }
  /* Step 4 提案 */
  function flwS4(body,ctx){
    if(!FLW.proposal)FLW.proposal=flwBuildProposal();const P=FLW.proposal;
    flwStepHead(body,'提案確認','依你的答案推出的初始 token 與元件清單。按「套用並開始調整」後整個網站會換成這套樣子，接著在網站上調整。',true);
    body.appendChild(flwAiSlot('AI 依 CI／PRD 擬提案','之後會由 AI 讀匯入資料判斷色階、字級與需要的元件；現在先用固定規則。',(()=>{const s=ce('span','flw-note');s.textContent='固定規則：色階依錨點推算、元件依平台＋產業對照表。';return s;})()));
    /* QS-PRESET:v1 問卷換算的快速風格：直接改，預覽與 Token 提案跟著變（套用前只改提案、不動網站） */
    if(!FLW.applied){const OV=P.tokens.overrides;window.__tokPreset=Object.assign({},P.preset||flwPresetOf(FLW.q));
      const pn=tokPresetPanel(OV,()=>{const prev=(P.preset||{}).color;P.preset=Object.assign({},window.__tokPreset);
        const hx=flwHex(FLW.q.primary);if(hx&&P.preset.color===prev)Object.assign(OV.root,flwScale('brand',hx));else if(P.preset.color!==prev){FLW.q.color=P.preset.color;FLW.q.primary='';}
        const base=flwPresetOf(FLW.q),rs=[];TOK_PRESETS.forEach(pp=>{const v=P.preset[pp.k];if(!v||v===TOK_PRESET_DEF(pp.k))return;
          rs.push({k:'快速風格 · '+pp.t,v:flwPresetLabel(pp.k,v),r:v===base[pp.k]?flwWhyOf(pp.k,FLW.q):'在提案確認頁改的'});});
        P.reasons.tokens=rs.concat(P.reasons.tokens.filter(t=>!/^快速風格 · /.test(t.k)));
        FLW.qSig=JSON.stringify([FLW.q,FLW.info.platform,FLW.info.industry]);flwSave();
        const a=document.activeElement,row=a&&a.closest&&a.closest('.tok-preset-row'),lid=row&&row.querySelector('.tok-preset-lb').id,k=a&&a.dataset&&a.dataset.k,sy=FLW_UI?FLW_UI.body.scrollTop:0;
        flwRenderStep(false);if(FLW_UI)FLW_UI.body.scrollTop=sy;
        if(lid){const b=document.querySelector('[aria-labelledby="'+lid+'"] [data-k="'+k+'"]');if(b)b.focus({preventScroll:true});}});
      pn.classList.add('flw-preset');body.appendChild(pn);}
    const cols=ce('div','flw-cols');body.appendChild(cols);
    const tk=ce('section','flw-panel');tk.innerHTML='<h3 class="flw-ph">Token 提案</h3>';
    const sc=ce('div','flw-scale');const R=P.tokens.overrides.root;
    [['brand','主色'],['brand2','副色']].forEach(([k,lab])=>{if(!R['--c-'+k+'-500'])return;const row=ce('div','flw-scrow');const l=ce('span','flw-scl');l.textContent=lab;row.appendChild(l);
      const bar=ce('div','flw-scbar');[100,200,300,400,500,600,700,800,900].forEach(n=>{const c=ce('span','flw-sw');c.style.background=R['--c-'+k+'-'+n]||('var(--c-'+k+'-'+n+')');c.title=n+' '+R['--c-'+k+'-'+n];if(n===500)c.classList.add('is-anchor');bar.appendChild(c);});
      row.appendChild(bar);sc.appendChild(row);});
    tk.appendChild(sc);
    const ul=ce('ul','flw-why');P.reasons.tokens.forEach(t=>{const li=ce('li');li.innerHTML=`<code>${flwEsc(t.k)}</code><span class="flw-why-v">${flwEsc(t.v)}</span><span class="flw-why-r">${flwEsc(t.r)}</span>`;ul.appendChild(li);});
    tk.appendChild(ul);
    const pv=ce('div','flw-preview');pv.append(flwBtn('solid','primary','主要按鈕','s'),flwBtn('outline','primary','次要按鈕','s'));
    const t1=tagEl('solid','brand','default','round');t1.querySelector('span').textContent='主色標籤';const t2=tagEl('soft','brand2','default','round');t2.querySelector('span').textContent='副色標籤';pv.append(t1,t2);
    /* 預覽直接吃提案色（還沒套用也看得到）：主色／副色語意變數寫在預覽容器上 */
    {const D=P.tokens.overrides.dark||{},isDk=document.documentElement.dataset.theme==='dark';const pick=(k,f)=>{const v=(isDk&&D[k])||R[k];return v||f;};
      const res=v=>String(v||'').replace(/var\((--c-brand2?-\d+)\)/g,(m,n)=>R[n]||m);
      const prim=isDk?res(D['--s-action-primary']||(R['--c-brand-200']?'var(--c-brand-200)':'')):R['--c-brand-500'];
      if(prim){pv.style.setProperty('--i-primary',prim);pv.style.setProperty('--accent',prim);pv.style.setProperty('--i-primary-tint','color-mix(in srgb,'+prim+' 16%,transparent)');}
      const on=res(pick(isDk?'--s-on-primary':'--primary-on',''));if(on)pv.style.setProperty('--primary-on',on);
      const a2=R[isDk?'--c-brand2-400':'--c-brand2-500'];if(a2){pv.style.setProperty('--accent2',a2);pv.style.setProperty('--accent2-tint','color-mix(in srgb,'+a2+' 12%,transparent)');}}
    const pvl=ce('p','flw-note');pvl.textContent='預覽：依提案配色；套用後整個網站會換成這套顏色。';tk.append(pvl,pv);
    const cp=ce('section','flw-panel');cp.innerHTML=`<h3 class="flw-ph">建議元件 <span class="flw-cnt">${P.components.selected.length} 個</span></h3>`;
    /* 依側欄分類（NAV group）分組；分組標題 sticky，清單在面板內捲動 */
    const cl=ce('div','flw-comp');const grpOf=id=>{const g=NAV.find(g=>g.items.some(x=>x.id===id));return g?g.group:'其他';};
    const byG=new Map();P.reasons.components.forEach(c=>{const k=grpOf(c.id);if(!byG.has(k))byG.set(k,[]);byG.get(k).push(c);});
    const order=NAV.map(g=>g.group).concat(['其他']);
    [...byG.keys()].sort((a,b)=>order.indexOf(a)-order.indexOf(b)).forEach(k=>{const sec=ce('section','flw-cg');const h=ce('h4','flw-cg-h');h.innerHTML=`<span>${flwEsc(k)}</span><span class="flw-cnt">${byG.get(k).length}</span>`;
      const ul=ce('ul','flw-cg-l');byG.get(k).forEach(c=>{const li=ce('li');const sp=DIAL_SPECS[c.id];li.innerHTML=`<span class="flw-cn">${flwEsc(sp?sp.label:c.id)}</span><span class="flw-cr">${flwEsc(c.r)}</span>`;ul.appendChild(li);});
      sec.append(h,ul);cl.appendChild(sec);});
    cp.classList.add('flw-panel-comp');cp.appendChild(cl);cols.append(tk,cp);
    const act=ce('div','flw-apply');const st=ce('span','flw-note');st.setAttribute('aria-live','polite');
    const regen=flwBtn('outline','secondary','依問卷重算');
    regen.onclick=()=>{FLW.proposal=flwBuildProposal();FLW.applied=false;flwSave();flwRenderStep(false);};
    st.textContent=FLW.applied?'已套用到網站。要換成新的提案，按「依問卷重算」後再套用（會蓋掉網站上的調整）。':'還沒套用，按下方「套用並開始調整」才會改到網站。';
    act.append(regen,st);body.appendChild(act);
    /* MODE:v1 最後一步：套用（第一次）→ 關閉彈窗、到 Design Token 頁；已套用就單純回到網站 */
    ctx.doneText=FLW.applied?'回到網站':'套用並開始調整';
    ctx.onDone=()=>{const first=!FLW.applied;
      if(first){flwApplyProposal();FLW.tokKept=false;FLW.compOk=false;}
      FLW.flowDone=true;FLW.max=FLW_STEPS.length-1;flwSave();flwClose({noFocus:true});
      if(first)renderView('tokens');
      requestAnimationFrame(()=>{const g=document.querySelector('#flwGuide .pjg-pill, #flwGuide .is-next .pjg-b');if(g)g.focus({preventScroll:true});});};
  }
  /* Step 6 匯出 */
  function flwS6(body){flwSnapSave();
    flwStepHead(body,'匯出專案檔','打包成一個 <code>'+flwEsc(FLW.info.name)+'.zip</code>：文件＋樣式包＋每個已選元件的 HTML／SCSS。解壓到 repo 的 <code>projects/</code> 底下，再交給 Claude Code。');
    const ck=ce('section','flw-panel');ck.innerHTML='<h3 class="flw-ph">匯出前檢查</h3>';
    const list=ce('ul','flw-checks');const res=flwChecks();
    res.forEach(r=>{const li=ce('li','flw-ck is-'+r.lv);li.innerHTML=`<span class="flw-ck-ic">${r.lv==='pass'?NT_ICON.success:(r.lv==='warn'?NT_ICON.warning:NT_ICON.error)}</span><span class="flw-ck-t">${flwEsc(r.t)}</span><span class="flw-ck-d">${flwEsc(r.d)}</span>`;list.appendChild(li);});
    ck.appendChild(list);
    const fails=res.filter(r=>r.lv==='fail').length;
    body.appendChild(flwAiSlot('匯出前 AI 檢查','之後會由 AI 檢查色彩可讀性、元件是否漏選、與 PRD 是否對得上；現在先跑固定規則。',(()=>{const s=ce('span','flw-note');s.textContent='固定規則：主色／副色對比、至少 '+FLW_MIN_COMP+' 個元件、包含 Button。';return s;})()));
    const cols=ce('div','flw-cols');body.appendChild(cols);
    const left=ce('div','flw-stack');left.appendChild(ck);
    if(fails)left.appendChild(flwAlert('warning','有 '+fails+' 項沒過','還是可以匯出，但建議先回網站上修好。'));
    const nm=FLW.info.name||'project';
    const fp=ce('section','flw-panel');fp.innerHTML='<h3 class="flw-ph">檔案 <span class="flw-cnt">'+flwEsc(nm)+'.zip</span></h3>';
    const grp=(title,path,cnt)=>{const h=ce('div','flw-fg');h.innerHTML=`<span class="flw-fg-t">${title}</span><code class="flw-fg-p">${flwEsc(path)}</code><span class="flw-cnt">${cnt}</span>`;return h;};
    const files=list=>{const fl=ce('ul','flw-files');list.forEach(f=>{const li=ce('li');li.innerHTML=IC_FILE;const t=ce('span','flw-fn');t.textContent=f.name;const s=ce('span','flw-fd');s.textContent=f.desc;
      const b=flwBtn('text','primary','下載','s');b.setAttribute('aria-label','下載 '+f.name);b.onclick=()=>dsDownloadText(f.name,f.get());li.append(t,s,b);fl.appendChild(li);});return fl;};
    const docs=flwDocFiles(),pack=tokStylePackFiles(),ids=flwSelIds();
    fp.append(grp('文件',nm+'/',docs.length+' 個檔'),files(docs));
    fp.append(grp('樣式包',nm+'/styles/',pack.length+' 個檔'),files(pack));
    fp.append(grp('元件程式碼',nm+'/components.html＋styles/components/',ids.length+' 個元件 · '+(ids.length?ids.length+2:0)+' 個檔'));
    if(ids.length){const chips=ce('div','flw-fchips');ids.forEach(id=>{const t=tagEl('outline','neutral','default','round');t.querySelector('span').textContent=id;t.title=componentName(id);chips.appendChild(t);});fp.appendChild(chips);}
    const cn=ce('p','flw-note');cn.innerHTML=ids.length?'HTML 全部合在 <code>components.html</code>；樣式每顆一個 <code>_&lt;id&gt;.scss</code>，<code>_index.scss</code> 一次引入全部。內容同元件頁「程式碼」面板；只在 zip 裡。':'還沒選元件，到選擇元件頁勾選。';fp.appendChild(cn);
    const all=flwBtn('solid','primary','全部下載（.zip）');const done=ce('span','flw-note');done.setAttribute('aria-live','polite');
    all.onclick=async()=>{if(all.getAttribute('aria-busy')==='true')return;all.setAttribute('aria-busy','true');done.textContent='正在打包…';
      try{const r=await flwDownloadAll((i,t)=>{done.textContent='正在產生元件程式碼 '+i+' / '+t+'…';});done.textContent='已下載 '+r.file+'（'+r.count+' 個檔）。';
        FLW.exportSig=flwSig();flwSave();flwPill();}   // MODE:v1 引導小卡：匯出完成（之後再改就變「有新變更」）
      catch(e){done.textContent='打包失敗：'+(e&&e.message||e);}
      finally{all.removeAttribute('aria-busy');}};
    const row=ce('div','flw-apply');row.append(all,done);fp.appendChild(row);
    cols.append(left,fp);
    const rd=ce('section','flw-panel');rd.innerHTML='<h3 class="flw-ph">接下來在 Claude Code</h3>';
    const pre=ce('pre','flw-readme');pre.textContent=flwReadme();rd.appendChild(pre);
    const cpb=flwBtn('soft','secondary','複製說明','s');cpb.onclick=()=>{try{navigator.clipboard.writeText(flwReadme()).then(()=>{cpb.querySelector('span').textContent='已複製';},()=>{});}catch(e){}};
    rd.appendChild(cpb);body.appendChild(rd);
  }

  /* ---- 「專案進行中」膠囊：modal 關著且有進度時固定右下角，點了重開 modal ---- */
  /* ---- SHELL8:v1 專案浮動列（取代右下「專案進行中」Notification 膠囊）----
     Floating Line 原子（toolbar 白底面）置中底部常駐：Tag（專案名）＋「已設定 N 項 token · 已選 M 個元件」＋ 匯出（outline）／下一步（solid primary）。
     顯示條件＝流程進行中（同舊膠囊）或 ?project= 專案模式；流程 modal 開著時隱藏。
     N＝token 覆寫（root／dark／desktop／tablet／mobile 合計）＋元件 Token 綁定換綁數；M＝需求匯總勾選數。
     即時更新：觀察 <head> 內 #tokenOverrides／#bindOverrides 樣式改寫（Design Token 頁、提案套用、綁定卡都會改它）＋攔 SUMSEL add/delete/clear。 */
  function pjEditing(){return !!window.__dsProject||!!(FLW.active&&FLW.applied);}
  window.__pjEditing=pjEditing;
  function pjCounts(){const O=window.__tokOverrides||{};let ov=0;['root','dark','desktop','tablet','mobile'].forEach(m=>{if(O[m])ov+=Object.keys(O[m]).length;});
    let bd=0;Object.values(window.__compBindings||{}).forEach(s=>{if(s)bd+=Object.values(s).filter(Boolean).length;});
    return {tok:ov+bd,ov,bd,sel:SUMSEL.size};}
  let PJB_EDIT=null;
