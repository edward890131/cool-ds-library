  /* ===== topbar 行為 =====（桌機側欄常駐；窄螢幕漢堡控制抽屜）*/
  const shell=document.getElementById('shell');
  (function(){ // 漢堡改用 library icon-only s 按鈕（保留原 svg 與行為）
    const hb=document.getElementById('hambBtn'); if(hb){ const svg=hb.querySelector('svg'); hb.className='btn v-outline i-secondary sz-s st-default live icon-only'; hb.innerHTML=''; if(svg)hb.appendChild(svg); }
  })();
  const NAV_DUR=300; // 與 CSS .nav-anim 的 --sb-w transition(.3s) 同步（ms）
  function setNavCollapsed(collapse){ // 桌機側欄收合/展開：動畫期間側欄留 grid 內平滑縮放，動畫結束才切浮動抽屜（保留 peek）
    if(shell.__navT){clearTimeout(shell.__navT);shell.__navT=null;}
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(collapse){
      if(reduce){shell.classList.add('nav-collapsed','nav-drawer');return;} // 減少動態：直接到位、不跑過場
      shell.classList.remove('nav-drawer');       // 確保動畫期間側欄留在 grid 內（尚未變 fixed）
      shell.classList.add('nav-anim');            // 開啟寬度過場
      void shell.offsetWidth;                     // 強制 reflow，讓 nav-anim 先生效再改寬
      shell.classList.add('nav-collapsed');       // --sb-w → 0：側欄平滑縮、主內容＋mockup 平滑放大
      shell.__navT=setTimeout(()=>{ // 縮完才切浮動抽屜備用
        shell.classList.add('nav-arming');        // 先關掉 transform 過場
        shell.classList.add('nav-drawer');        // 切成 fixed 浮動抽屜
        shell.classList.remove('nav-anim');
        void shell.offsetWidth;                   // reflow → 側欄無過場直接歸位 translateX(-100%)
        shell.classList.remove('nav-arming');     // 復原過場，之後 hover peek 才有滑入/滑出動畫
        shell.__navT=null;
      },NAV_DUR);
    }else{
      shell.classList.remove('nav-drawer');       // 先把側欄從 fixed 收回 grid 內（此時 --sb-w 仍為 0、不可見，無跳動）
      if(reduce){shell.classList.remove('nav-collapsed');return;}
      shell.classList.add('nav-anim');
      void shell.offsetWidth;
      shell.classList.remove('nav-collapsed');    // --sb-w 0 → 全寬：側欄平滑展開、主內容＋mockup 平滑縮小
      shell.__navT=setTimeout(()=>{ shell.classList.remove('nav-anim'); shell.__navT=null; },NAV_DUR);
    }
  }
  /* SHELL8:v1 901–1199（iPad Pro 直向 1024、小筆電）側欄預設收合成浮動抽屜（左緣 peek／漢堡可展開）；在此寬度手動切換＝明確選擇，記在 localStorage ds-nav-mid */
  const NAV_MID_KEY='ds-nav-mid', navMid=()=>window.innerWidth>900&&window.innerWidth<1200;
  const navMidPref=()=>{try{return localStorage.getItem(NAV_MID_KEY);}catch(e){return null;}};
  document.getElementById('hambBtn').onclick=()=>{ if(window.innerWidth>900){ const c=!shell.classList.contains('nav-collapsed'); setNavCollapsed(c);
      if(navMid()){try{localStorage.setItem(NAV_MID_KEY,c?'1':'0');}catch(e){}} } else shell.classList.toggle('nav-open'); };
  (function(){ let band=null;
    const sync=()=>{ const b=window.innerWidth<=900?'s':(navMid()?'m':'l'); if(b===band)return; const prev=band; band=b;
      const col=shell.classList.contains('nav-collapsed');
      if(b==='m'){ const p=navMidPref(), want=p==null?true:p==='1'; if(want===col)return;
        if(prev==null){ if(want)shell.classList.add('nav-collapsed','nav-drawer'); } else setNavCollapsed(want); }   // 首次載入直接到位、不跑過場
      else if(b==='l'&&prev==='m'&&col&&navMidPref()==null) setNavCollapsed(false); };                                // 放大回桌機寬：預設收合自動還原
    sync(); window.addEventListener('resize',sync); })();
  { const bd=document.querySelector('.topbar .brand'); if(bd){ bd.classList.add('is-link'); bd.setAttribute('role','link'); bd.setAttribute('tabindex','0'); bd.title='回首頁'; const go=()=>renderView('home');   /* IA-SHELL:v1 直接換頁（hash 本來就是 home 時改 hash 不會觸發） */ bd.addEventListener('click',go); bd.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}}); } }  // 點 header logo 回首頁（guide）
  document.getElementById('scrim').onclick=()=>shell.classList.remove('nav-open');
  /* IA-SHELL:v1 Header 分區入口：Menu 原子水平選單（滑動底線），放在 logo／專案名後面 */
  {const bd=document.querySelector('.topbar .brand');if(bd&&!document.querySelector('.tb-secnav')){const w=ce('div','tb-secnav');w.setAttribute('data-i18n-skip','');
    const bar=mnBar('horizontal','m',{items:NAV_SECS.map(x=>x.lb),activeIndex:-1,clickable:true,label:'網站分區'});
    bar._nodes.forEach((n,i)=>n.addEventListener('click',()=>{const t=NAV_SECS[i].go();if(secOf(current)===NAV_SECS[i].id&&current===t)return;renderView(t);}));
    w.appendChild(bar);const pj=document.getElementById('dsBadgeProj');(pj&&pj.previousElementSibling===bd?pj:bd).insertAdjacentElement('afterend',w);}}
  document.addEventListener('cdl:lang',()=>{if(typeof current==='string')renderNav();});   /* 側欄的中文補充名稱跟著語言 */
  /* 變數篩選器／Token 綁定／狀態一覽表（.dcard）收合：高度補間＋內容淡入淡出，不再瞬間變 0（Motion token：--dur-default／--ease-out） */
  document.addEventListener('click',e=>{const h=e.target.closest('.dcard-head');if(!h)return;const c=h.closest('.dcard');if(!c)return;
    const body=c.querySelector(':scope > .dcard-body');
    if(c.__anim){const a=c.__anim;c.__anim=null;a.onfinish=null;a.cancel();if(c.__done)c.__done();}   // 連點：先把上一段收尾到終點狀態
    const willOpen=c.classList.contains('collapsed');
    if(!body||matchMedia('(prefers-reduced-motion:reduce)').matches||!c.animate){c.classList.toggle('collapsed');return;}
    const cs=getComputedStyle(document.documentElement);const dur=(parseFloat(cs.getPropertyValue('--dur-default'))||240)*1.25;const ease=cs.getPropertyValue('--ease-out').trim()||'cubic-bezier(.2,.8,.2,1)';
    const from=c.getBoundingClientRect().height;
    c.classList.toggle('collapsed',!willOpen);const to=c.getBoundingClientRect().height;   // 量終點高度
    if(!willOpen)c.classList.remove('collapsed');                                          // 收合：先保持展開，播完再隱藏內容
    const ov=c.style.overflow;c.style.overflow='hidden';
    body.animate(willOpen?[{opacity:0,transform:'translateY(-4px)'},{opacity:1,transform:'none'}]:[{opacity:1},{opacity:0}],{duration:willOpen?dur:dur*.6,easing:ease,fill:'none'});
    const an=c.animate([{height:from+'px'},{height:to+'px'}],{duration:dur,easing:ease});c.__anim=an;
    if(!willOpen)c.classList.add('is-closing');
    const done=()=>{c.__done=null;c.style.overflow=ov;c.classList.remove('is-closing');if(!willOpen)c.classList.add('collapsed');if(c.__anim===an)c.__anim=null;};
    c.__done=done;an.onfinish=done;});
  (function(){ // 主題偏好：light／dark，存 localStorage；預設淺色（2026-11-03 拿掉跟隨系統）。控制入口＝topbar 右上角切換
    window.__applyThemePref=function(pref,persist){
      pref=pref==='dark'?'dark':'light';window.__themePref=pref;
      if(persist){try{localStorage.setItem('ds-theme',pref);}catch(e){}}
      document.documentElement.setAttribute('data-theme',pref);
      if(typeof refreshLogo==='function')refreshLogo();
    };
    let saved; try{saved=localStorage.getItem('ds-theme');}catch(e){}
    window.__applyThemePref(saved==='light'?'light':'dark',false); // 2026-11-04 起預設深色：只有明確選過淺色才用淺色
  })();
  (function(){ // 磨砂偏好：0～100（預設 0＝實心，與原本相同）；只影響網站外框，元件預覽釘回實心
    window.__applyFrost=function(v,persist){v=Math.max(0,Math.min(100,Math.round(+v||0)));window.__frost=v;const r=document.documentElement;
      if(v>0){r.setAttribute('data-frost','');r.style.setProperty('--frost',String(v/100));}else{r.removeAttribute('data-frost');r.style.removeProperty('--frost');}
      if(persist){try{localStorage.setItem('ds-frost',String(v));}catch(e){}}};
    let s; try{s=localStorage.getItem('ds-frost');}catch(e){} window.__applyFrost(s==null?0:s,false);
  })();
  /* ==================== 網站搜尋：模糊比對（2026-11-03）====================
     fzMatch(q,text)：① 子字串（開頭／斷詞處加分）② 依序出現的子序列（間隔越少分越高）③ 4 字以上容許 1～2 個錯字（OSA 編輯距離）。
     回傳 {s:分數, hit:[命中字元位置]}，hit 用來標色。Command 元件與 topbar 搜尋共用。 */
  function fzDist(a,b){const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;const d=[];for(let i=0;i<=m;i++){d[i]=[i];}for(let j=0;j<=n;j++)d[0][j]=j;
    for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const c=a[i-1]===b[j-1]?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
      if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);}return d[m][n];}
  function fzMatch(q,t){q=(q||'').toLowerCase().trim();const s=(t||'').toLowerCase();if(!q||!s)return null;const SEP=/[\s\-_/·．.（）()]/;
    const i=s.indexOf(q);
    if(i>=0){const st=i===0||SEP.test(s[i-1]);return {s:1000+(st?200:0)-i-(s.length-q.length)*.5,hit:Array.from({length:q.length},(_,k)=>i+k)};}
    const hit=[];let j=0,gap=0,prev=-1;for(let k=0;k<s.length&&j<q.length;k++){if(s[k]===q[j]){hit.push(k);if(prev>=0)gap+=k-prev-1;prev=k;j++;}}
    if(j===q.length){const starts=hit.filter(k=>k===0||SEP.test(s[k-1])).length;return {s:500-gap*8+starts*30-hit[0],hit};}
    if(q.length>=4&&!/[^\x00-\x7f]/.test(q)){const lim=q.length>=7?2:1;let best=9;s.split(SEP).filter(Boolean).forEach(w=>{best=Math.min(best,fzDist(q,w),fzDist(q,w.slice(0,q.length)));});
      if(best<=lim)return {s:200-best*50,hit:[]};}
    return null;}
  function fzHL(txt,hit){const esc=c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]||c);const H=new Set(hit||[]);let out='',open=false;
    [...txt].forEach((c,i)=>{const on=H.has(i);if(on&&!open){out+='<mark>';open=true;}if(!on&&open){out+='</mark>';open=false;}out+=esc(c);});return out+(open?'</mark>':'');}
  /* 對一個項目的多個 key 取最高分；只有命中 label 時才回傳 hit（別名命中不標色） */
  function fzBest(q,label,keys){let best=null;const m=fzMatch(q,label);if(m)best={s:m.s,hit:m.hit};
    (keys||[]).forEach(k=>{const r=fzMatch(q,k);if(r&&(!best||r.s*.92>best.s))best={s:r.s*.92,hit:[]};});return best;}

  const SS_ALIAS={button:'按鈕 btn','button-group':'按鈕群組 工具列 toolbar',icon:'圖示 icons',link:'超連結 連結 anchor',kbd:'快捷鍵 鍵盤 shortcut keyboard',
    divider:'分隔線 hr separator',avatar:'頭像 大頭貼 profile',logo:'商標 品牌 brand',stack:'排版 間距 auto layout flex grid','app-shell':'框架 版型 layout',splitter:'分割 resizable 面板',
    'scroll-area':'捲軸 scroll',header:'頁首 導覽列 navbar',footer:'頁尾','section-head':'區塊標題','floating-line':'浮動 客服',tab:'頁籤 分頁 tabs',menu:'選單 側欄 nav sidebar',
    'action-menu':'更多 動作選單 dropdown menu','context-menu':'右鍵 選單',breadcrumb:'麵包屑 路徑',pagination:'分頁 頁碼',step:'步驟 stepper',command:'指令 搜尋 cmdk palette',
    input:'輸入框 文字框 textfield search password 密碼','number-input':'數字 number spinbutton',dropdown:'下拉 select 選擇器',selector:'勾選 checkbox radio 單選 複選',toggle:'開關 switch',
    segmented:'分段 切換',chip:'膠囊 選擇 篩選 chip pill filter',slider:'滑桿 range','date-picker':'日期 datepicker','time-picker':'時間 timepicker 時刻 24h','color-picker':'選色 顏色 colorpicker hex',cascader:'多層 地址 縣市 cascade','tree-select':'樹狀 部門 treeselect',tour:'導覽 新手 onboarding walkthrough',menubar:'選單列 檔案 編輯 menubar',dropzone:'上傳 upload 檔案 file',quantity:'數量 計數',field:'表單 form 欄位 label',
    alert:'警示 提示 banner',notification:'通知 toast 訊息 snackbar',tooltip:'提示 說明',popover:'氣泡 浮層','hover-card':'資訊卡 預覽卡',modal:'彈窗 對話框 dialog 視窗',
    drawer:'抽屜 側邊面板 sheet',progress:'進度條 progressbar',loader:'載入 loading spinner',skeleton:'骨架 載入',empty:'空狀態 無資料 empty state',tag:'標籤 chip badge',
    price:'價格 金額',image:'圖片 img 照片',rating:'評分 星星 star',carousel:'輪播 banner',list:'清單 列表','list-item':'清單項目 列',collapse:'折疊 accordion 手風琴',
    descriptions:'資料清單 屬性 key value',card:'卡片',  'product-card':'商品卡 商品','category-tile':'分類',  'article-card':'文章卡 部落格','person-card':'人物卡 成員 照片 person','profile-card':'檔案卡 品牌 追蹤 profile follow','metric-card':'指標 週 KPI 數據 metric','invite-card':'邀請 協作 分享 成員 invite share','widget-card':'小工具 儀表板 widget dashboard 待辦','trend-card':'趨勢 主題 色塊 trend','media-card':'照片 標籤 選取 media photo','weather-card':'天氣 溫度 weather forecast','player-card':'音樂 播放器 player music','ticket-card':'登機證 票券 機票 ticket boarding pass',table:'表格 資料表 datagrid',
    'table-toolbar':'篩選 批次 filter','tree-view':'樹狀 tree 資料夾',calendar:'日曆 行事曆',chart:'圖表 統計 graph','schedule-chart':'排程 甘特 gantt'};
  const SS_PAGES=[['home','首頁','首頁 home landing 元件牆 playground'],['start','開始新專案','專案 新專案 匯入 流程 精靈 start wizard onboarding'],['tokens','Design Token','變數 顏色 色票 間距 token variables'],['guideline','Design Guideline','規範 設計指南 guideline'],
    ['summary','選擇元件','需求匯總 匯出 選取 select comps export summary'],['changelog','更新紀錄','版本 changelog release'],['settings','偏好設定','設定 磨砂 深色 主題 settings preferences']];
  let SS_TOK=null;
  function ssTokens(){if(SS_TOK)return SS_TOK;const set=new Set();
    [...document.styleSheets].forEach(sh=>{let rs;try{rs=sh.cssRules;}catch(e){return;}[...rs].forEach(r=>{if(r.selectorText===':root'&&r.style)for(let i=0;i<r.style.length;i++){const p=r.style[i];if(/^--(c|s|sp|r|fs|fw|lh|e|dur|ease)-/.test(p))set.add(p);}});});
    return SS_TOK=[...set].sort();}
  function ssItems(){const it=[];
    NAV.forEach(g=>g.items.forEach(x=>{const [zh,...en]=x.name.split(' ');const lab=x.name.includes(' ')?(en.join(' ')+' '+zh):x.name;
      it.push({kind:'comp',key:'c:'+x.id,id:x.id,label:x.name,keys:[x.id,(SS_ALIAS[x.id]||''),lab],planned:x.st==='planned',ic:IC_FILE});}));
    SS_PAGES.forEach(([id,l,k])=>it.push({kind:'page',key:'p:'+id,id,label:l,keys:[id,k],ic:id==='settings'?ICON_GEAR:ICON_HOUSE}));
    return it;}
  function ssGo(x){if(x.kind==='token'){ssRecent(x);location.hash='tokens';setTimeout(()=>{const v=document.getElementById('view');if(!v)return;
        const hit=[...v.querySelectorAll('code,td,span,div')].find(e=>e.childElementCount===0&&e.textContent.trim()===x.id)||[...v.querySelectorAll('code')].find(e=>e.textContent.includes(x.id));
        if(hit){const row=hit.closest('tr,.tok-row,.tk-row,li')||hit;row.scrollIntoView({block:'center',behavior:'smooth'});row.classList.remove('ss-flash');void row.offsetWidth;row.classList.add('ss-flash');}},350);return;}
    ssRecent(x);if(hashId()===x.id){renderView(x.id);}else location.hash=x.id;}
  function ssRecent(x){try{const a=JSON.parse(localStorage.getItem('ds-search-recent')||'[]').filter(k=>k!==x.key);a.unshift(x.key);localStorage.setItem('ds-search-recent',JSON.stringify(a.slice(0,5)));}catch(e){}}
  function ssRecentKeys(){try{return JSON.parse(localStorage.getItem('ds-search-recent')||'[]');}catch(e){return [];}}

  let ssOpenEl=null,ssBackFocus=null;
  function ssOpen(initial){if(ssOpenEl){ssOpenEl.querySelector('input').focus();return;}ssBackFocus=document.activeElement;
    const ovl=ce('div','ss-ovl');const c=ce('div','cmd ss-panel');c.setAttribute('role','dialog');c.setAttribute('aria-modal','true');c.setAttribute('aria-label','搜尋');
    const sr=ce('div','cmd-search');sr.innerHTML=ICON_SEARCH;const inp=document.createElement('input');inp.type='text';inp.placeholder='搜尋元件、頁面或 token（例如 按鈕、dtpk、--sp-4）';
    inp.setAttribute('role','combobox');inp.setAttribute('aria-expanded','true');inp.setAttribute('aria-autocomplete','list');inp.setAttribute('aria-controls','ssList');inp.value=initial||'';
    const esc=kbdEl(['Esc'],'m','ghost');esc.style.cursor='pointer';esc.onclick=()=>ssClose();sr.append(inp,esc);
    const list=ce('div','cmd-list');list.id='ssList';list.setAttribute('role','listbox');
    const foot=ce('div','cmd-foot');[[['↑','↓'],'移動'],[['↵'],'前往'],[['Esc'],'關閉']].forEach(([k,t])=>{const s=ce('span');s.append(kbdEl(k,'m','default'),t);foot.appendChild(s);});
    const hint=ce('span');hint.style.marginLeft='auto';hint.textContent='支援模糊比對與錯字';foot.appendChild(hint);
    c.append(sr,list,foot);ovl.appendChild(c);document.body.appendChild(ovl);ssOpenEl=ovl;
    const ITEMS=ssItems();let flat=[],act=0;
    const row=(x,hit)=>{  /* I18N:v2 EN 模式結果只顯示英文名（「Button Group 按鈕組」→ Button Group），避免高亮把中文切成碎片 */
      if(I18N_LANG!=='zh'&&x.kind!=='token'){const m=String(x.label).match(I18N_NAV);if(m){const L=m[1].length;x={...x,label:m[1]};hit=(hit||[]).filter(i=>i<L);}}
      const el=ce('div','cmd-it');el.setAttribute('role','option');el.id='ss-o-'+flat.length;
      el.innerHTML=(x.kind==='token'?'<span style="width:16px;height:16px;border-radius:4px;flex:0 0 auto;background:'+(/^--(c|s)-/.test(x.id)?'var('+x.id+')':'var(--panel-3)')+';border:1px solid var(--line)"></span>':x.ic)
        +`<span class="cmd-lb">${x.kind==='token'?'<code>'+fzHL(x.label,hit)+'</code>':fzHL(x.label,hit)}</span>`
        +(x.planned?'<span class="cmd-tag">規劃中</span>':'')+(x.meta?`<span class="cmd-meta">${x.meta}</span>`:'');
      const k=flat.length;el.addEventListener('pointermove',()=>{if(act!==k){act=k;mark();}});el.addEventListener('click',()=>pick(k));flat.push({x,el});return el;};
    const grp=(h,rows,onClear)=>{if(!rows.length)return;const g=ce('div','cmd-grp');g.setAttribute('role','group');g.setAttribute('aria-label',h);const hh=ce('div','cmd-grp-h');const ht=ce('span');ht.textContent=h;hh.appendChild(ht);
      if(onClear){const cb=ce('button','cmd-grp-clear');cb.type='button';cb.textContent='清除紀錄';cb.setAttribute('aria-label','清除最近搜尋紀錄');cb.onclick=e=>{e.stopPropagation();onClear();inp.focus();};hh.appendChild(cb);}g.appendChild(hh);rows.forEach(([x,hit])=>g.appendChild(row(x,hit)));list.appendChild(g);};
    const draw=()=>{const q=inp.value.trim();list.innerHTML='';flat=[];
      if(!q){const rk=ssRecentKeys();const byKey=new Map(ITEMS.map(x=>[x.key,x]));
        grp('最近搜尋',rk.map(k=>byKey.get(k)).filter(Boolean).map(x=>[x,[]]),()=>{try{localStorage.removeItem('ds-search-recent');}catch(e){}draw();});
        grp('常用',['p:tokens','p:summary','c:button','c:table'].filter(k=>!rk.includes(k)).map(k=>byKey.get(k)).filter(Boolean).map(x=>[x,[]]));}
      else{const sc=ITEMS.map(x=>{const b=fzBest(q,x.label,x.keys);return b?[x,b]:null;}).filter(Boolean).sort((a,b)=>b[1].s-a[1].s);
        const toks=(q.length>=2)?ssTokens().map(t=>{const m=fzMatch(q.replace(/^-*/,''),t);return m&&m.s>=1000?[{kind:'token',key:'t:'+t,id:t,label:t,meta:getComputedStyle(document.documentElement).getPropertyValue(t).trim().slice(0,22)},{s:m.s,hit:fzMatch(q,t)?fzMatch(q,t).hit:[]}]:null;}).filter(Boolean).sort((a,b)=>b[1].s-a[1].s).slice(0,5):[];
        const comps=sc.filter(r=>r[0].kind==='comp').slice(0,8),pages=sc.filter(r=>r[0].kind==='page').slice(0,4);
        const G=[['元件',comps],['頁面',pages],['Token',toks]];if(q.startsWith('-'))G.unshift(G.pop());
        G.forEach(([h,r])=>grp(h,r.map(([x,b])=>[x,b.hit])));
        if(!flat.length){const e=empEl('search','s',{primary:false,secondary:false});e.querySelector('.emp-title').textContent=`找不到「${q}」`;e.querySelector('.emp-desc').textContent='試試中文或英文名稱，例如「彈窗」或 modal。';list.appendChild(e);}}
      act=0;mark();};
    const mark=()=>{flat.forEach((f,i)=>{f.el.classList.toggle('is-active',i===act);f.el.setAttribute('aria-selected',String(i===act));});
      if(flat[act]){inp.setAttribute('aria-activedescendant',flat[act].el.id);flat[act].el.scrollIntoView({block:'nearest'});}else inp.removeAttribute('aria-activedescendant');};
    const pick=k=>{const f=flat[k];if(!f)return;ssClose(true);ssGo(f.x);};
    let composing=false;inp.addEventListener('compositionstart',()=>{composing=true;});inp.addEventListener('compositionend',()=>{composing=false;draw();});
    inp.addEventListener('input',e=>{if(composing||e.isComposing)return;draw();});
    inp.addEventListener('keydown',e=>{if(e.isComposing||e.keyCode===229)return;if(e.key==='ArrowDown'){e.preventDefault();if(flat.length){act=(act+1)%flat.length;mark();}}else if(e.key==='ArrowUp'){e.preventDefault();if(flat.length){act=(act-1+flat.length)%flat.length;mark();}}
      else if(e.key==='Enter'){e.preventDefault();pick(act);}else if(e.key==='Escape'){e.preventDefault();ssClose();}else if(e.key==='Tab'){e.preventDefault();}});
    ovl.addEventListener('pointerdown',e=>{if(e.target===ovl)ssClose();});
    draw();setTimeout(()=>inp.focus(),10);}
  function ssClose(noRestore){const o=ssOpenEl;if(!o)return;ssOpenEl=null;o.classList.add('is-out');afterAnim(o,()=>o.remove());
    if(!noRestore&&ssBackFocus&&ssBackFocus.focus)ssBackFocus.focus({preventScroll:true});}
  (function(){const t=document.getElementById('ssTrig');if(t){t.insertAdjacentHTML('afterbegin',ICON_SEARCH);t.appendChild(kbdEl([/Mac|iPhone|iPad/.test(navigator.platform)?'⌘K':'Ctrl K'],'m','ghost'));t.onclick=()=>ssOpen();
      const m=mkBtn({variant:'outline',intent:'secondary',size:'s',iconOnly:true,isLive:true});m.type='button';m.id='ssTrigM';m.innerHTML=ICON_SEARCH;m.setAttribute('aria-label','搜尋元件、頁面或 token');m.setAttribute('aria-haspopup','dialog');m.onclick=()=>ssOpen();t.insertAdjacentElement('afterend',m);}   /* 手機版：Button 原子 icon-only */
    document.addEventListener('keydown',e=>{const tg=e.target;const typing=tg&&(tg.tagName==='INPUT'||tg.tagName==='TEXTAREA'||tg.isContentEditable);
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){if(tg&&tg.closest&&tg.closest('.cmd-live'))return;e.preventDefault();ssOpen();}
      else if(e.key==='/'&&!typing&&!e.metaKey&&!e.ctrlKey){e.preventDefault();ssOpen();}});})();

