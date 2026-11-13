  /* ===== MODE:v1 瀏覽／編輯模式（2026-11-11）=====
     瀏覽＝沒有開專案：元件頁篩選可玩但不記錄、Token 頁唯讀、沒有選擇元件頁；右上主按鈕「開啟新專案」。
     編輯＝FLW.active（或 ?project=）：右上「匯出檔案」、專案名選單（結束編輯／重新開始）、右下建立流程引導小卡。 */
  function dsEditing(){try{return !!window.__dsProject||!!FLW.active;}catch(e){return !!window.__dsProject;}}   // FLW 尚未初始化時＝瀏覽
  window.__dsEditing=dsEditing;
  function dsEnterEdit(){if(FLW.active)return;FLW.active=true;
    if(FLW.applied&&FLW.snap){flwSnapRestore();try{const cur=window.__flwBg||current;if(cur&&cur!=='start')renderView(cur);}catch(e){}}   // 有草稿就接續（重繪目前頁）
    else flwResetSite();   // 沒有草稿：把瀏覽時玩過的篩選清回預設
    flwSave();dsSyncMode();}
  function dsExitEdit(){dsDialog({title:'結束編輯？',sub:'專案草稿會保留在這個瀏覽器，下次按「開啟新專案」會接續。網站回到元件庫預設的樣子。',okText:'結束編輯',cancelText:'取消',
    onOk:()=>{if(FLW_UI)flwClose({noFocus:true});flwSnapSave();FLW.active=false;flwSave();flwResetSite();dsSyncMode();flwPill();
      const b=document.getElementById('dsNewProjBtn');if(b)b.focus({preventScroll:true});}});}
  function dsRestart(){dsDialog({title:'清除這份草稿？',sub:'問卷答案、提案和網站上已套用的 token、元件勾選都會清掉，回到第 1 步。',okText:'清除並重來',cancelText:'取消',
    onOk:()=>{flwResetSite();FLW=flwBlank();FLW.active=true;FLW_FILES.length=0;flwSave();if(FLW_UI)flwClose({noFocus:true});flwOpen();}});}
  function flwExportOpen(){if(FLW_UI)return;flwSnapSave();flwOpen({mode:'export'});}
  let DS_MODE=null;
  function dsSyncMode(){const m=dsEditing()?'edit':'browse',prev=DS_MODE;DS_MODE=m;document.documentElement.dataset.mode=m;dsSyncTopbar();
    if(prev!==null&&prev!==m&&typeof current==='string'){renderNav();if(!FLW_UI&&(current==='summary'||current==='tokens'))renderView(current);}}
  /* MODE:v2 頂欄：logo 右邊「瀏覽｜編輯」切換（Segmented 原子）；瀏覽＝母庫提示＋「開啟新專案」；編輯＝專案名（Tag 原子）＋「重新開始」＋「匯出檔案」。
     手機頂欄放不下：切換與重新開始改放在側欄最上方。?project= 模式維持原本的「儲存並更新」 */
  function dsGoEdit(){if(FLW.active||FLW_UI)return;if(location.hash==='#start')flwRoute();else location.hash='start';}
  function dsGoBrowse(){if(!FLW.active)return;if(FLW_UI)flwClose({noFocus:true});flwSnapSave();FLW.active=false;flwSave();flwResetSite();dsSyncMode();flwPill();}   // 草稿保留，網站回預設
  function dsModeSw(){const g=sgmEl('soft','s',{live:true,items:['瀏覽模式','編輯模式'],active:FLW.active?1:0,label:'瀏覽或編輯模式',onChange:i=>{i===1?dsGoEdit():dsGoBrowse();}});
    g.classList.add('ds-mode-sw');g.title='瀏覽：只看不改｜編輯：開專案調整';
    /* IA-SHELL:v1 每段加圖示（瀏覽＝eye、編輯＝pencil）：側欄太窄、文字放不下時只顯示圖示，名稱留在 aria-label／title */
    g.querySelectorAll('.sgm-it').forEach((it,i)=>{const lb=i===0?'瀏覽模式':'編輯模式';it.innerHTML='<span class="ds-ms-ic" aria-hidden="true">'+PI(i===0?'eye':'pencil')+'</span><span class="ds-ms-lb"></span>';
      it.querySelector('.ds-ms-lb').textContent=lb;it.setAttribute('aria-label',lb);it.title=lb;});
    return g;}
  function dsModeFit(){document.querySelectorAll('.nav-mode .ds-mode-sw').forEach(sw=>{if(!sw.isConnected||!sw.offsetParent)return;sw.classList.remove('is-ico');   /* 先用文字版量，溢出才切圖示 */
    const over=sw.scrollWidth>sw.clientWidth+1||[...sw.querySelectorAll('.sgm-it')].some(it=>it.scrollWidth>it.clientWidth+1);sw.classList.toggle('is-ico',over);});}
  if(window.ResizeObserver)new ResizeObserver(()=>dsModeFit()).observe(document.getElementById('sidebar'));
  function dsRstBtn(){const b=mkBtn({variant:'text',intent:'secondary',size:'s',isLive:true});b.type='button';b.classList.add('has-lead','ds-pj-rst');
    b.innerHTML=PI('refresh-cw')+'<span>重新開始</span>';b.title='清除這份草稿，回到第 1 步';b.setAttribute('aria-label','重新開始');b.onclick=dsRestart;return b;}
  function dsSyncTopbar(){if(window.__dsProject)return;const btn=document.getElementById('dsNewProjBtn');if(!btn)return;
    const ed=!!FLW.active,note=document.getElementById('dsBadgeProj'),tb=document.querySelector('.topbar');
    /* IA-SHELL:v1 模式切換移到側欄、重新開始移到建立流程彈窗；頂欄只留專案名標籤（logo 右邊） */
    document.querySelectorAll('#sidebar .ds-mode-sw').forEach(g=>{if(g.__set)g.__set(ed?1:0);});
    let pj=document.getElementById('dsPjTag');
    if(ed){if(!pj){pj=tagEl('soft','brand','default','round','m');pj.id='dsPjTag';pj.classList.add('ds-pj-tag');const br=tb&&tb.querySelector('.brand');(note||br||btn).insertAdjacentElement('afterend',pj);}
      const nm=FLW.info.name||'未命名專案';pj.querySelector('span').textContent=nm;pj.title='專案：'+nm;pj.hidden=false;if(note)note.hidden=true;
      if(btn.dataset.m!=='edit'){btn.dataset.m='edit';btn.innerHTML=IC_DOWNLOAD+'<span>匯出檔案</span>';}
      btn.disabled=false;btn.classList.remove('st-disabled');btn.removeAttribute('aria-disabled');btn.title='檢查後下載專案檔（zip）';btn.onclick=flwExportOpen;}
    else{if(pj)pj.hidden=true;if(note)note.hidden=false;
      if(btn.dataset.m!=='browse'){btn.dataset.m='browse';btn.innerHTML=ICON_PLUS+'<span>開啟新專案</span>';}
      btn.disabled=false;btn.classList.remove('st-disabled');btn.removeAttribute('aria-disabled');btn.title='';btn.onclick=dsGoEdit;}}
  /* 通用下拉選單：取用 Action Menu 原子（amPanel）；items:[{label,icon,on,danger,divBefore}]，onPick(i) */
  function dsMenu(t,items,onPick,o){o=o||{};let m=document.getElementById('dsMenu');if(m){const same=m.__t===t;m.__close(false);if(same)return;}
    m=amPanel('with-icon','s',{items:items.map(x=>({label:x.label,icon:x.icon||'',danger:x.danger,divBefore:x.divBefore}))});m.id='dsMenu';m.__t=t;m.classList.add('ds-menu');m.setAttribute('role','menu');
    if(o.label)m.setAttribute('aria-label',o.label);
    const its=[...m.querySelectorAll('.am-item')];
    const close=back=>{m.remove();t.setAttribute('aria-expanded','false');document.removeEventListener('pointerdown',out,true);document.removeEventListener('keydown',key,true);window.removeEventListener('resize',rz);if(back)t.focus();};
    const out=ev=>{if(!m.contains(ev.target)&&!t.contains(ev.target))close(false);};
    const rz=()=>close(false);
    const key=ev=>{const i=its.indexOf(document.activeElement);if(ev.key==='Escape'||ev.key==='Tab'){if(ev.key==='Escape')ev.preventDefault();close(ev.key==='Escape');}
      else if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();its[(i+(ev.key==='ArrowDown'?1:-1)+its.length)%its.length].focus();}};
    its.forEach((it,i)=>{const x=items[i];it.setAttribute('role',x.on!==undefined?'menuitemradio':'menuitem');if(x.on!==undefined){it.setAttribute('aria-checked',String(!!x.on));it.classList.toggle('is-on',!!x.on);}
      it.tabIndex=-1;it.onclick=()=>{close(true);onPick(i);};it.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();it.click();}};});
    m.__close=close;document.body.appendChild(m);
    const r=t.getBoundingClientRect(),w=m.offsetWidth;m.style.top=(r.bottom+6)+'px';m.style.left=Math.max(8,Math.min(o.alignRight?r.right-w:r.left,innerWidth-w-8))+'px';
    t.setAttribute('aria-expanded','true');(its.find((x,i)=>items[i].on)||its[0]).focus();
    document.addEventListener('pointerdown',out,true);document.addEventListener('keydown',key,true);window.addEventListener('resize',rz);}
  /* ---- 建立流程引導小卡：彈窗關著時固定右下；可收成膠囊（記在瀏覽器）----
     完成判斷：彈窗 4 步＝走過；匯入沒放檔＝略過；調整 Token＝有改（跟提案比）或「沿用提案」（按鈕／已確認元件）；
     選擇元件＝在選擇元件頁按「確認元件」且至少 FLW_MIN_COMP 個；匯出＝下載後內容沒再變（變了顯示「有新變更」）。 */
  const FLW_GUIDE_KEY='ds-guide-min';
  function flwTokDiff(){const P=(FLW.proposal&&FLW.proposal.tokens&&FLW.proposal.tokens.overrides)||{},O=window.__tokOverrides||{};let n=0;
    ['root','dark','desktop','tablet','mobile'].forEach(m=>{const a=O[m]||{},b=P[m]||{};new Set([...Object.keys(a),...Object.keys(b)]).forEach(k=>{if(a[k]!==b[k])n++;});});
    Object.values(window.__compBindings||{}).forEach(x=>{if(x)n+=Object.values(x).filter(Boolean).length;});return n;}
  function flwSig(){const sel=[...SUMSEL].sort();
    const str=JSON.stringify({o:window.__tokOverrides||{},b:window.__compBindings||{},d:[...(window.__tokDisabled||[])].sort(),s:sel,
      a:sel.map(id=>{const c=CHOICE[id];return c?Object.keys(c.active).map(k=>k+':'+[...c.active[k]].join(',')).join('|'):'';})});
    let h=5381;for(let i=0;i<str.length;i++)h=((h<<5)+h+str.charCodeAt(i))|0;return String(h>>>0);}
  function flwGuideItems(){const passed=i=>FLW.flowDone||FLW.max>i;const src=FLW.src||{};const hasSrc=!!((src.files&&src.files.length)||src.text||src.url);
    const n=flwTokDiff(),kept=FLW.tokKept||FLW.compOk,cOk=FLW.compOk&&SUMSEL.size>=FLW_MIN_COMP,sig=FLW.exportSig?flwSig():null;
    return [
      {k:'info',t:'基本資料',st:passed(0)?'done':'todo',d:passed(0)?(FLW.info.name||''):''},
      {k:'src',t:'匯入資料',st:passed(1)?(hasSrc?'done':'skip'):'todo',d:passed(1)?(hasSrc?'已匯入':'略過'):''},
      {k:'q',t:'品牌問卷',st:passed(2)?'done':'todo',d:''},
      {k:'prop',t:'提案確認',st:FLW.applied?'done':'todo',d:FLW.applied?'已套用':''},
      {k:'tok',t:'調整 Token',st:n>0?'done':(kept?'skip':'todo'),d:n>0?'改了 '+n+' 個':(kept?'沿用提案':''),go:'前往 Design Token'},
      {k:'comp',t:'選擇元件',st:cOk?'done':'todo',d:'已選 '+SUMSEL.size+' 個',go:'前往選擇元件'},
      {k:'exp',t:'匯出檔案',st:FLW.exportSig&&sig===FLW.exportSig?'done':'todo',d:FLW.exportSig?(sig===FLW.exportSig?'已匯出':'有新變更'):'',go:'右上「匯出檔案」'}];}
  function flwGuideGo(k){const M={info:0,src:1,q:2,prop:3};
    if(k in M){FLW.step=Math.min(M[k],FLW.max);flwSave();flwOpen();return;}
    if(k==='tok')renderView('tokens');else if(k==='comp')renderView('summary');else if(k==='exp')flwExportOpen();}
  function flwPill(){
    const ed=pjEditing();
    if(PJB_EDIT!==null&&ed!==PJB_EDIT&&typeof current==='string'&&document.querySelector('#view .bind-dcard'))renderView(current);  // 進／出編輯模式：重繪目前元件頁，綁定卡切換可編輯
    PJB_EDIT=ed;
    dsSyncMode();
    let el=document.getElementById('flwGuide');
    const show=!FLW_UI&&!window.__dsProject&&!!FLW.active;
    document.body.classList.toggle('has-pjg',show);
    if(!show){if(el)el.hidden=true;return;}
    if(!el){el=ce('aside','pjg');el.id='flwGuide';el.setAttribute('aria-label','建立流程');document.body.appendChild(el);}
    const r0=!el.hidden&&el.__min!==undefined?el.getBoundingClientRect():null,wasMin=el.__min;   // MODE:v2 展開／收合：記下舊尺寸做補間
    let min=false;try{min=localStorage.getItem(FLW_GUIDE_KEY)==='1';}catch(e){}
    const items=flwGuideItems(),n=items.filter(x=>x.st!=='todo').length,nx=items.findIndex(x=>x.st==='todo');
    const key=JSON.stringify([min,nx,items.map(x=>x.st+x.d),FLW.applied]);if(el.__key===key&&!el.hidden)return;el.__key=key;   // 沒變就不重畫（不打斷焦點）
    const had=el.contains(document.activeElement)?(document.activeElement.dataset.k||document.activeElement.className):null;
    el.hidden=false;el.classList.toggle('is-min',min);el.innerHTML='';el.__min=min;
    const morph=()=>{if(!r0||wasMin===min||!el.animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r1=el.getBoundingClientRect();
      const ease='cubic-bezier(.2,.8,.2,1)',d=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-default'))||240;
      el.animate([{width:r0.width+'px',height:r0.height+'px'},{width:r1.width+'px',height:r1.height+'px'}],{duration:d*1.25,easing:ease});
      [...el.children].forEach(c=>c.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:d,delay:min?0:d*.45,easing:ease,fill:'backwards'}));};
    const pct=Math.round(n/items.length*100);
    if(min){const b=mkBtn({variant:'text',intent:'secondary',size:'m',isLive:true});b.type='button';b.classList.add('pjg-pill');b.setAttribute('aria-expanded','false');   // GUIDE-ATOM:v1 Button 原子
      b.innerHTML='<span class="pjg-pt">建立流程</span><span class="pjg-pn">'+n+' / '+items.length+'</span><span class="pjg-ring" style="--p:'+pct+'" aria-hidden="true"></span>';
      b.setAttribute('aria-label','展開建立流程（完成 '+n+' / '+items.length+'）');
      b.onclick=()=>{try{localStorage.setItem(FLW_GUIDE_KEY,'0');}catch(e){}flwPill();const f=document.querySelector('#flwGuide .pjg-min');if(f)f.focus();};
      el.appendChild(b);morph();if(had)b.focus();return;}
    const hd=ce('div','pjg-hd');const ht=ce('div','pjg-t');ht.textContent='建立流程';const hn=ce('span','pjg-n');hn.textContent=n+' / '+items.length;
    const mn=mkBtn({variant:'text',intent:'secondary',size:'s',iconOnly:true,isLive:true});mn.type='button';mn.classList.add('pjg-min');mn.innerHTML=PI('minus');
    mn.setAttribute('aria-label','收合建立流程');mn.title='收合';mn.setAttribute('aria-expanded','true');
    mn.onclick=()=>{try{localStorage.setItem(FLW_GUIDE_KEY,'1');}catch(e){}flwPill();const p=document.querySelector('#flwGuide .pjg-pill');if(p)p.focus();};
    hd.append(ht,hn,mn);el.appendChild(hd);
    const ol=ce('ol','pjg-list');
    items.forEach((it,i)=>{const li=ce('li','pjg-it is-'+it.st+(i===nx?' is-next':''));
      const b=document.createElement('button');b.type='button';b.className='pjg-b';b.dataset.k=it.k;
      b.innerHTML='<span class="pjg-tx"><span class="pjg-lb"></span><span class="pjg-d"></span></span>';
      const nd=stpNode(it.st==='todo'?(i===nx?'current':'todo'):'done','numbered',{num:i+1});nd.setAttribute('aria-hidden','true');b.prepend(nd);   // GUIDE-ATOM:v1 步驟圓圈用 Stepper 節點（略過＝勾勾＋淡色）
      b.querySelector('.pjg-lb').textContent=it.t;
      /* 匯出過又改了：下一步提示改成「有新變更」 */
      const d=i===nx?((it.k==='exp'&&it.d?it.d:'下一步')+(it.go?' · '+it.go:'')):it.d;b.querySelector('.pjg-d').textContent=d||'';if(!d)b.querySelector('.pjg-d').remove();
      b.setAttribute('aria-label',it.t+'，'+(it.st==='done'?'完成':(it.st==='skip'?(it.d||'略過'):(i===nx?'下一步':'未完成')))+(it.st==='done'&&it.d?'，'+it.d:''));
      if(i===nx)b.setAttribute('aria-current','step');
      b.onclick=()=>flwGuideGo(it.k);li.appendChild(b);
      ol.appendChild(li);});
    el.appendChild(ol);
    {const rb=mkBtn({variant:'text',intent:'secondary',size:'m',isLive:true});rb.type='button';rb.classList.add('has-lead','pjg-rst');   /* IA-SHELL:v1 重新開始（Button 原子 m 尺寸，間距走 token）從頂欄移到這裡 */
      rb.innerHTML=PI('refresh-cw')+'<span>重新開始</span>';rb.title='清除這份草稿，回到第 1 步';rb.onclick=dsRestart;el.appendChild(rb);}
    morph();
    if(had){const f=el.querySelector('[data-k="'+had+'"]')||el.querySelector('.pjg-min');if(f)f.focus();}}
  (function(){let raf=0;const kick=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!window.__dsProject&&FLW.active&&FLW.applied)flwSnapSave();flwPill();});};
    ['add','delete','clear'].forEach(m=>{const o=SUMSEL[m];SUMSEL[m]=function(){const r=o.apply(this,arguments);kick();return r;};});
    new MutationObserver(kick).observe(document.head,{childList:true,subtree:true,characterData:true});
    window.__pjbKick=kick;
    /* MODE:v1 元件頁篩選（CHOICE）改了不會動到 <head>：編輯模式下在頁面裡點選／改值後也重算引導小卡（匯出後再改＝有新變更） */
    ['click','change'].forEach(t=>document.addEventListener(t,e=>{if(FLW.active&&!FLW_UI&&e.target&&e.target.closest&&e.target.closest('#view'))setTimeout(kick,60);},true));})();
  window.addEventListener('hashchange',()=>{if(FLW_UI&&hashId()!=='start')flwClose({fromHash:true,noFocus:true});flwSnapSave();flwPill();});
  window.addEventListener('pagehide',()=>flwSnapSave());
  /* 進站接續：有進行中的草稿且不是 ?project= 專案模式 → 還原上次的 token／勾選（boot 之前執行） */
  if(FLW.active&&FLW.applied&&!new URLSearchParams(location.search).get('project')){try{flwSnapRestore();}catch(e){}}
  setTimeout(flwPill,0);
  /* 重整／深連結：從 hash 還原檢視；有 ?project= 則先抓 proposal/state 再渲染 */
  (function studioInit(){
    const proj=new URLSearchParams(location.search).get('project');
    window.__dsProject=proj||null;
    const boot=()=>{ current=hashId()||'home'; renderNav(); renderView(current); if(typeof refreshLogo==='function')refreshLogo(); showStudioBadge(proj); }; // 母庫＋專案模式皆預設進 guide 首屏
    if(!proj){ boot(); window.__dsBaseline=dsSnap(); return; }
    fetch('/api/project/'+encodeURIComponent(proj)).then(r=>r.ok?r.json():null).then(d=>{
      window.__dsProjectData=d||null;
      window.PROJECT_ICONS=(d&&d.icons)||[]; // 專案自訂 icon（來源 projects/<name>/icons.json）
      applyProposal(d&&(d.state||d.proposal)); // 有 state（續編）優先，否則 proposal（初始）
      window.__dsVersion=(d&&d.version&&d.version.version)||0;
    }).catch(()=>{}).finally(()=>{ boot(); window.__dsBaseline=dsSnap(); dsVersionPopup(); });
  })();
  window.addEventListener('hashchange',()=>{const id=hashId()||'home';if(id!==current){current=id;renderNav();renderView(id);}});

  /* ===== .seg 分段控制：滑動 pill（全站 tab 共用滑動指示器） =====
     站上所有 tab 都是 .seg（互動預覽篩選／HTML-CSS 分頁／展開 modal 分頁／圖表切換…）。
     這裡用「單一全域 MutationObserver」讓每個 .seg 內生一顆 .seg-pill，跟著 aria-pressed 的按鈕平滑滑動——
     不必逐一改各 tab 的切換程式，改一處＝全站同步。做法比照 transitions.dev「tabs sliding」：
     pill 的 transform/width/height 由此處 inline 寫入，靠 CSS transition 補間。
     多數 seg 是「原地切換 aria-pressed」→ 直接滑；少數重建型（button 頁篩選走 renderLive 整塊重建）
     靠 data-seg 幾何快取：新 seg 先落在上一版 active 位置再滑到新位置，重建也有滑動感。*/
  /* .seg 鍵盤操作（同 Segmented 元件）：左右／上下方向鍵切到相鄰的可用選項並觸發 */
  document.addEventListener('keydown',e=>{const b=e.target;if(!b||b.tagName!=='BUTTON'||!b.parentElement||!b.parentElement.classList.contains('seg'))return;
    const d=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:0;if(!d)return;
    const bs=[...b.parentElement.querySelectorAll(':scope>button')].filter(x=>!x.disabled&&!x.classList.contains('is-off'));const i=bs.indexOf(b);if(i<0||bs.length<2)return;
    e.preventDefault();const key=b.parentElement.dataset.seg,ni=(i+d+bs.length)%bs.length,n=bs[ni];n.click();
    if(n.isConnected){n.focus();return;}
    /* 重建型控制列（例如 button 頁點選後整塊重繪）：用 data-seg 找回新的那一列，把焦點放回選中項 */
    const again=key&&document.querySelector('.seg[data-seg="'+key+'"] button[aria-pressed="true"]');if(again)again.focus();});
  (function initSegPill(){
    /* seg 自身尺寸變動（欄寬拖曳、容器查詢換版、字級調整）→ 重新對齊 pill；window resize 抓不到這類變動 */
    const roW=new WeakMap();   // 只在尺寸真的變了才 snap；observe 當下的首次回報略過，否則會蓋掉切換時的滑動動畫
    const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(es=>es.forEach(e=>{const s=e.target,w=Math.round(e.contentRect.width)+'x'+Math.round(e.contentRect.height),o=roW.get(s);roW.set(s,w);
      if(o!==undefined&&o!==w&&s.isConnected)place(s,false);})):null;
    const lastGeo={};                                  // key＝seg 的 data-seg；存上次 active 的 {l,t,w,h}，供重建型 seg 續接滑動
    let fontsReady=!(document.fonts&&document.fonts.ready);  // 字型 ready 前不顯示 pill，避免用 fallback 字寬定位後跳位（手機首載）
    function pillOf(seg){
      let p=seg.querySelector(':scope>.seg-pill');
      if(!p){p=document.createElement('span');p.className='seg-pill';p.setAttribute('aria-hidden','true');seg.insertBefore(p,seg.firstChild);if(ro)ro.observe(seg);}
      return p;
    }
    function measure(seg){
      const act=seg.querySelector(':scope>button[aria-pressed="true"]');
      if(!act||act.offsetParent===null)return null;     // 無 active 或 seg 隱藏（如桌機下隱藏的雙欄小網 tab）
      return {l:act.offsetLeft,t:act.offsetTop,w:act.offsetWidth,h:act.offsetHeight};
    }
    function apply(p,g){p.style.opacity=fontsReady?'1':'0';p.style.width=g.w+'px';p.style.height=g.h+'px';p.style.transform='translate('+g.l+'px,'+g.t+'px)';}
    // 把 pill 滑到 active 按鈕位置；animate=false 時暫停 transition 直接 snap（首次掛載／resize）
    function place(seg,animate){
      if(!seg||!seg.isConnected)return;
      const p=pillOf(seg), g=measure(seg);
      if(!g){p.style.opacity='0';return;}
      const key=seg.dataset.seg; if(key)lastGeo[key]=g;
      if(!animate){p.style.transition='none';apply(p,g);void p.offsetWidth;p.style.transition='';}
      else apply(p,g);
    }
    const placeAll=animate=>document.querySelectorAll('.seg').forEach(s=>place(s,animate));
    const obs=new MutationObserver(muts=>{
      const inplace=new Set(), fresh=new Set();
      for(const m of muts){
        if(m.type==='attributes'){const par=m.target.parentElement;if(par&&par.classList.contains('seg'))inplace.add(par);}
        else if(m.type==='childList')m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;
          if(n.classList&&n.classList.contains('seg'))fresh.add(n);
          n.querySelectorAll&&n.querySelectorAll('.seg').forEach(s=>fresh.add(s));});
      }
      // 新掛載的 seg：有快取（重建型）→ 先落舊位置再滑到新位置；無快取（首見）→ snap
      fresh.forEach(s=>{const key=s.dataset.seg, prev=key&&lastGeo[key];const p=pillOf(s);
        if(prev){p.style.transition='none';apply(p,prev);void p.offsetWidth;p.style.transition='';requestAnimationFrame(()=>place(s,true));}
        else requestAnimationFrame(()=>place(s,false));});
      // 既有 seg 的 aria-pressed 改變 → 原地滑動（跳過剛新建的，避免重複）
      inplace.forEach(s=>{if(!fresh.has(s))requestAnimationFrame(()=>place(s,true));});
    });
    const boot=()=>{obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed']});requestAnimationFrame(()=>placeAll(false));};
    if(document.body)boot();else document.addEventListener('DOMContentLoaded',boot);
    let rz;window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>placeAll(false),120);}); // 版位變動 → 重新對齊（無動畫）
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fontsReady=true;placeAll(false);}).catch(()=>{}); // 字型載入後以正確字寬重定位並顯示
  })();

  /* ===== 下拉重新整理（手機觸控 pull-to-refresh）：.main 捲到頂再下拉 → 圓圈 loader → 放手過閾值 reload ===== */
  (function(){
    const main=document.querySelector('.main'); const shell=document.getElementById('shell');
    const view=document.getElementById('view');
    if(!main||!shell||!view)return;
    const loader=document.createElement('div'); loader.className='ptr-loader';
    loader.innerHTML='<div class="ptr-spinner"></div>';
    shell.appendChild(loader);
    const spin=loader.querySelector('.ptr-spinner');
    const TH=72, MAXSHIFT=88; let startY=0, dist=0, pulling=false;
    const shiftFor=d=>Math.min(d*0.55,MAXSHIFT);              // rubber-band 阻尼
    const reset=()=>{ loader.classList.remove('spin'); loader.style.opacity='0'; loader.style.transform='translate(-50%,-6px)'; spin.style.transform='';
      view.style.transition='transform .3s cubic-bezier(.2,.7,.2,1)'; view.style.transform=''; };
    main.addEventListener('touchstart',e=>{ if(main.scrollTop<=0){startY=e.touches[0].clientY;dist=0;pulling=true;view.style.transition='';} },{passive:true});
    main.addEventListener('touchmove',e=>{ if(!pulling)return;
      dist=e.touches[0].clientY-startY;
      if(dist>0 && main.scrollTop<=0){
        e.preventDefault();                                   // 攔掉原生 overscroll，改跑自訂下拉
        const sh=shiftFor(dist);
        view.style.transform='translateY('+sh+'px)';          // 內容跟著往下位移
        loader.style.opacity=String(Math.min(dist/TH,1));
        loader.style.transform='translate(-50%,'+(sh/2)+'px)'; // loader 置於 header 與內容間讓出的空間
        spin.style.transform='rotate('+(dist*2.6)+'deg)';
      } else { pulling=false; reset(); }
    },{passive:false});
    main.addEventListener('touchend',()=>{ if(!pulling)return; pulling=false;
      if(dist>TH){ loader.classList.add('spin'); loader.style.opacity='1';
        view.style.transition='transform .25s ease'; view.style.transform='translateY('+MAXSHIFT+'px)';  // 保持下移露出 loader
        loader.style.transform='translate(-50%,'+(MAXSHIFT/2)+'px)'; spin.style.transform='';
        setTimeout(()=>location.reload(),650);
      } else { reset(); }
    });
  })();

  /* ===== 側邊欄拖曳調寬 ===== */
  (function(){
    const shell=document.getElementById('shell');
    const handle=document.getElementById('sidebarResize');
    if(!shell||!handle)return;
    const KEY='ds-sidebar-w', MIN=180, MAX=480;
    const clamp=x=>Math.max(MIN,Math.min(MAX,Math.min(window.innerWidth*0.42,x))); // 夾在 180 ~ min(480, 42vw)
    const saved=parseInt(localStorage.getItem(KEY),10);
    if(saved) shell.style.setProperty('--sb',clamp(saved)+'px'); // 還原上次寬度
    let dragging=false;
    handle.addEventListener('pointerdown',e=>{
      if(window.innerWidth<=900)return; // 行動/收合模式不啟用
      dragging=true; handle.classList.add('is-drag'); document.body.classList.add('is-resizing');
      try{handle.setPointerCapture(e.pointerId);}catch(_){} e.preventDefault();
    });
    handle.addEventListener('pointermove',e=>{ if(dragging) shell.style.setProperty('--sb',clamp(e.clientX)+'px'); }); // sidebar 左緣＝0，故 clientX≈寬度
    function end(){ if(!dragging)return; dragging=false; handle.classList.remove('is-drag'); document.body.classList.remove('is-resizing');
      const px=parseInt(shell.style.getPropertyValue('--sb'),10); if(px) localStorage.setItem(KEY,px); }
    handle.addEventListener('pointerup',end);
    handle.addEventListener('pointercancel',end);
    handle.addEventListener('dblclick',()=>{ shell.style.removeProperty('--sb'); localStorage.removeItem(KEY); }); // 雙擊還原預設 20vw
  })();


  /* ==================== rwdprev:v1 響應式預覽（topbar「上手指南」右側）====================
     裝置切換＝Segmented 原子（sgmEl，icon-only）＋Tooltip 原子（ttEl）；旋轉／關閉＝Button 原子（mkBtn）。
     選裝置 → topbar 下方開預覽區，<iframe> 以真實 CSS 尺寸載入同一頁（?rwdframe=1，保留 query＋hash），框內不再建切換（防遞迴）。
     主題／磨砂：載入時帶 query，之後以 postMessage 同步；兩邊 hash 互相同步。選擇只記在本次分頁（sessionStorage）。 */
  (function(){
    const RWD_Q=new URLSearchParams(location.search);
    if(RWD_Q.get('rwdframe')==='1'){ // ── 框內模式 ──
      document.documentElement.classList.add('rwd-in');
      { /* SHELL8:v1 載入進度回報：跑到這裡＝主程式已執行完（非專案模式首屏 renderView 已同步完成） */
        const post=s=>{if(window.parent&&window.parent!==window){try{window.parent.postMessage({rwdframe:1,t:'stage',s},'*');}catch(e){}}};
        post('view');
        const vw=document.getElementById('view');
        const hasView=new Promise(res=>{if(!vw||vw.childElementCount)return res();const mo=new MutationObserver(()=>{if(vw.childElementCount){mo.disconnect();res();}});
          mo.observe(vw,{childList:true});setTimeout(()=>{mo.disconnect();res();},8000);});   // ?project= 模式 boot 在 fetch 之後
        const fonts=(document.fonts&&document.fonts.ready)?document.fonts.ready.catch(()=>{}):Promise.resolve();
        Promise.all([hasView,fonts]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>post('ready'))));
      }
      const th=RWD_Q.get('rwdtheme'),fr=RWD_Q.get('rwdfrost');
      try{ if(th&&window.__applyThemePref)window.__applyThemePref(th,false); if(fr!=null&&window.__applyFrost)window.__applyFrost(fr,false); }catch(e){}
      const up=(m)=>{ if(window.parent&&window.parent!==window){ try{window.parent.postMessage(Object.assign({rwdframe:1},m),'*');}catch(e){} } };
      window.addEventListener('hashchange',()=>up({t:'hash',hash:location.hash}));
      window.addEventListener('message',e=>{ if(e.source!==window.parent)return; const d=e.data; if(!d||d.rwdframe!==1||d.t!=='theme')return;
        try{ if(window.__applyThemePref)window.__applyThemePref(d.theme==='dark'?'dark':'light',false); if(window.__applyFrost)window.__applyFrost(+d.frost||0,false); }catch(_){} });
      let dlgOpen=false; // Esc：框內沒有開著的對話框時，才請外層關閉預覽
      const anyDlg=()=>[...document.querySelectorAll('[aria-modal="true"],.ss-ovl')].some(n=>n.isConnected&&n.getClientRects().length);
      window.addEventListener('keydown',e=>{ if(e.key==='Escape')dlgOpen=anyDlg(); },true);
      document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!dlgOpen&&!e.defaultPrevented)up({t:'esc'}); });
      return;
    }
    const tb=document.querySelector('.topbar'),gb=document.getElementById('guideBtn');
    if(!tb||!gb||typeof sgmEl!=='function'||typeof mkBtn!=='function')return;
    const IC={  /* 裝置預覽工具列與狀態列 icon：PulsoIcon（2026-11-08 取代 PulsoIcon） */
      desktop:PI('monitor'),tablet:PI('tablet'),mini:PI('tablet-smartphone'),phone:PI('smartphone'),rotate:PI('rotate-cw-square'),x:PI('x'),sig:PI('signal'),wifi:PI('wifi'),bat:PI('battery-full')};
    /* 裝置規格：w×h＝CSS viewport（直向）；bz＝邊框厚、r／sr＝外框／螢幕圓角、sb＝狀態列高 */
    const DEV=[
      {id:'desktop',label:'桌機',tip:'桌機（一般檢視）'},
      {id:'tablet',label:'平板',name:'iPad Pro 13"',w:1024,h:1366,bz:22,r:44,sr:22,sb:28,home:200,fs:13,ic:14},
      {id:'mini',label:'小平板',name:'iPad mini',w:744,h:1133,bz:20,r:40,sr:20,sb:26,home:170,fs:12,ic:13},
      {id:'phone',label:'手機',name:'iPhone 16',w:393,h:852,bz:13,r:60,sr:47,sb:54,home:134,fs:16,ic:15,island:true}];
    const SKEY='ds-rwdprev';
    const ssGet=()=>{try{return JSON.parse(sessionStorage.getItem(SKEY)||'null');}catch(e){return null;}};
    const ssSet=(v)=>{try{ if(v)sessionStorage.setItem(SKEY,JSON.stringify(v)); else sessionStorage.removeItem(SKEY);}catch(e){}};

    /* ── 切換組（Segmented 原子，icon-only＋Tooltip）── */
    let cur=0,rot=false,ovl=null,dev=null,sizer=null,frame=null,frameBase='',lastFrameHash=null,capT=null,rotBtn=null;
    const saved=ssGet(); const savedIdx=saved?DEV.findIndex(d=>d.id===saved.d):-1;
    const grp=sgmEl('soft','s',{live:true,items:DEV.map(d=>d.label),label:'響應式預覽',active:0,onChange:i=>{pick(i);paintDd();}});
    grp.classList.add('rwd-sw');
    grp.querySelectorAll('.sgm-it').forEach((b,i)=>{const d=DEV[i];b.classList.add('tt-trigwrap');b.setAttribute('aria-label',d.label+(d.name?'預覽 · '+d.name+' '+d.w+' × '+d.h:'（一般檢視）'));
      b.innerHTML='<span class="sgm-ic">'+IC[d.id]+'</span>';
      if(typeof ttEl==='function'){const t=ttEl('bottom','s',true);t.classList.add('tt-float','tt-fp-bottom');t.setAttribute('aria-hidden','true');
        t.querySelector('span').textContent=d.name?d.label+' · '+d.name:d.tip;b.appendChild(t);} else b.title=d.label;});
    {const th=document.getElementById('themeBtn');if(th)th.insertAdjacentElement('beforebegin',grp);else gb.insertAdjacentElement('afterend',grp);
      const ss=document.getElementById('ssTrig');if(ss){grp.insertAdjacentElement('beforebegin',ss);const sm=document.getElementById('ssTrigM');if(sm)ss.insertAdjacentElement('afterend',sm);}}   // 搜尋框放在 RWD 切換左邊（深淺色切換左邊）
    tb.classList.add('has-rwd');   // 2026-11-10 修正：這行先前被併進上一行的註解、從沒執行 → topbar 沒疊在預覽層（z 39）之上，tooltip 被蓋住
    const segBtns=[...grp.querySelectorAll('.sgm-it')];
    /* MODE:v2 頂欄太擠：裝置切換改成下拉（Button 原子觸發＋Action Menu 原子選單）；Segmented 留在 DOM 當狀態來源、不顯示 */
    grp.style.display='none';grp.setAttribute('aria-hidden','true');
    const dd=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});dd.type='button';dd.classList.add('rwd-dd');dd.setAttribute('aria-haspopup','menu');dd.setAttribute('aria-expanded','false');
    function paintDd(){const d=DEV[cur];dd.innerHTML='<span class="rwd-dd-ic">'+IC[d.id]+'</span>'+PI('chevron-down');
      const t='響應式預覽：'+d.label+(d.name?' · '+d.name:'');dd.setAttribute('aria-label',t);dd.title=t;}
    dd.onclick=()=>dsMenu(dd,DEV.map((d,i)=>({label:d.name?d.label+' · '+d.name:d.tip,icon:IC[d.id],on:i===cur})),i=>{if(i!==cur)segBtns[i].click();},{alignRight:true,label:'響應式預覽'});
    grp.insertAdjacentElement('afterend',dd);paintDd();

    function themeMsg(){const r=document.documentElement;return {rwdframe:1,t:'theme',theme:r.getAttribute('data-theme')==='dark'?'dark':'light',frost:window.__frost||0};}
    function buildUrl(){const u=new URL(location.href);const m=themeMsg();u.searchParams.set('rwdframe','1');u.searchParams.set('rwdtheme',m.theme);
      if(m.frost)u.searchParams.set('rwdfrost',String(m.frost));else u.searchParams.delete('rwdfrost');u.hash='';return u.href.replace(/#$/,'');}
    function mkAct(icon,text,fn){const b=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});b.type='button';b.classList.add('has-lead');
      b.innerHTML=icon+'<span>'+text+'</span>';b.onclick=fn;return b;}
    function ensureOvl(){
      if(ovl)return;
      ovl=ce('div','rwd-ovl');ovl.setAttribute('role','region');ovl.setAttribute('aria-label','響應式預覽');ovl.hidden=true;
      sizer=ce('div','rwd-sizer');dev=ce('div','rwd-dev');
      dev.innerHTML='<span class="rwd-cam" aria-hidden="true"></span><div class="rwd-scr"><div class="rwd-bar" aria-hidden="true"><span class="rwd-time">9:41</span><span class="rwd-ics">'+IC.sig+IC.wifi+IC.bat+'</span></div>'+
        '<span class="rwd-island" aria-hidden="true"></span><span class="rwd-home" aria-hidden="true"></span></div>';
      sizer.appendChild(dev);
      const cap=ce('div','rwd-cap');capT=ce('span','rwd-cap-t');capT.setAttribute('aria-live','polite');
      const acts=ce('span','rwd-cap-acts');
      rotBtn=mkAct(IC.rotate,'旋轉',()=>{rot=!rot;layout();save();});rotBtn.setAttribute('aria-pressed','false');
      acts.appendChild(rotBtn);acts.appendChild(mkAct(IC.x,'關閉',()=>closeAll()));
      cap.appendChild(capT);cap.appendChild(acts);
      ovl.appendChild(sizer);ovl.appendChild(cap);document.body.appendChild(ovl);
    }
    function ensureFrame(){
      if(frame)return;
      frameBase=buildUrl();lastFrameHash=location.hash;
      frame=document.createElement('iframe');frame.title='響應式預覽：目前頁面';frame.setAttribute('loading','eager');
      frame.src=frameBase+location.hash;
      dev.querySelector('.rwd-scr').insertBefore(frame,dev.querySelector('.rwd-island'));
      frame.addEventListener('load',()=>{try{frame.contentWindow.postMessage(themeMsg(),'*');}catch(e){}});
      frame.addEventListener('load',()=>rwdLd.stage('load'));rwdLd.start(dev.querySelector('.rwd-scr'));   // SHELL8:v1
    }
    /* SHELL8:v1 載入中 %：iframe 每次新建都要重新解析整份單檔（~1.8MB）＋跑完整初始化，期間只畫得出靜態骨架（topbar＋空側欄＋footer）。
       這裡在裝置畫面內疊 Progress＋Loader 原子，用框內真實訊號推進：head→body→js→view（主程式跑完）→load→ready（首屏＋字型就緒＋兩幀）；
       訊號之間緩動逼近該階段上限（最高 90%），ready 才衝到 100% 並淡出。20 秒保底、load 後 1.5 秒保底。 */
    const LD_CAP={start:30,head:45,body:62,js:78,view:90,load:90};
    const LD_TXT={start:'連線中…',head:'讀取樣式與字型…',body:'建立頁面骨架…',js:'執行元件庫程式…',view:'套用字型與版面…',load:'套用字型與版面…',ready:'完成'};
    const rwdLd={el:null,raf:0,log:[],
      start(scr){this.stop();
        const el=ce('div','rwd-ld');el.setAttribute('role','status');el.setAttribute('aria-live','polite');
        const box=ce('div','rwd-ld-box');const pc=ce('div','rwd-ld-pct');pc.innerHTML='0<small>%</small>';
        const pg=prgEl('bar','s',{value:0});pg.setAttribute('aria-label','預覽載入進度');
        const cap=ce('div','rwd-ld-cap');cap.appendChild(loaderEl('circular','primary','s',{inline:true}));const ct=ce('span');cap.appendChild(ct);
        box.append(pc,pg,cap);el.appendChild(box);scr.appendChild(el);
        Object.assign(this,{el,pc,pg,fill:pg.querySelector('.prg-fill'),ct,pct:0,cap:LD_CAP.start,done:false,t0:performance.now(),log:[{s:'start',t:0}]});
        this.say('start');this.paint();
        this.safety=setTimeout(()=>this.stage('ready'),20000);
        let last=performance.now();
        const tick=now=>{this.raf=0;if(!this.el)return;   // 以實際經過時間做指數緩動：框內主程式佔住執行緒時（同源 iframe 共用主執行緒）數字暫停、恢復後直接補到位；Loader 旋轉圈走合成層、不會停
          const dt=Math.min(1000,Math.max(0,now-last));last=now;const tgt=this.done?100:this.cap;
          this.pct+=(tgt-this.pct)*(1-Math.exp(-dt/(this.done?60:650)));if(this.done&&tgt-this.pct<.6)this.pct=100;
          this.paint();
          if(this.done&&this.pct>=100){this.finish();return;}
          this.raf=requestAnimationFrame(tick);};
        this.raf=requestAnimationFrame(tick);},
      say(s){if(this.ct)this.ct.textContent=LD_TXT[s]||LD_TXT.start;},
      paint(){const v=Math.floor(this.pct);this.pc.firstChild.nodeValue=String(v);this.fill.style.width=v+'%';this.pg.setAttribute('aria-valuenow',String(v));},
      stage(s){if(!this.el||this.done)return;
        this.log.push({s,t:Math.round(performance.now()-this.t0)});
        if(s==='ready'){this.done=true;this.say('ready');if(!this.raf)this.raf=requestAnimationFrame(()=>{this.raf=0;this.pct=100;this.paint();this.finish();});return;}
        if(LD_CAP[s])this.cap=Math.max(this.cap,LD_CAP[s]);this.say(s);
        if(s==='load'){clearTimeout(this.late);this.late=setTimeout(()=>this.stage('ready'),1500);}},
      finish(){const el=this.el;if(!el)return;this.log.push({s:'done',t:Math.round(performance.now()-this.t0)});window.__rwdLoadLog=this.log;
        clearTimeout(this.safety);clearTimeout(this.late);this.el=null;el.classList.add('is-done');setTimeout(()=>el.remove(),320);},
      stop(){if(this.raf)cancelAnimationFrame(this.raf);this.raf=0;clearTimeout(this.safety);clearTimeout(this.late);if(this.el){this.el.remove();this.el=null;}}};
    function layout(){
      if(!ovl||!dev||cur<1)return; const d=DEV[cur];
      const land=rot, w=land?d.h:d.w, h=land?d.w:d.h, noBar=!!(land&&d.island);
      const s=dev.style;s.setProperty('--rwd-w',w+'px');s.setProperty('--rwd-h',h+'px');s.setProperty('--rwd-bz',d.bz+'px');s.setProperty('--rwd-r',d.r+'px');
      s.setProperty('--rwd-sr',d.sr+'px');s.setProperty('--rwd-sb',(noBar?0:d.sb)+'px');s.setProperty('--rwd-home',d.home+'px');
      s.setProperty('--rwd-bar-fs',d.fs+'px');s.setProperty('--rwd-ic',d.ic+'px');s.setProperty('--rwd-bar-px',(d.island?32:20)+'px');
      dev.classList.toggle('has-island',!!d.island);dev.classList.toggle('is-land',land);dev.classList.toggle('no-bar',noBar);
      dev.dataset.device=d.id;
      capT.innerHTML='<b>'+d.name+'</b><span aria-hidden="true">·</span><span class="rwd-dim">'+w+' × '+h+'</span>';
      rotBtn.setAttribute('aria-pressed',String(land));rotBtn.setAttribute('aria-label',land?'旋轉為直向':'旋轉為橫向');
      ovl.style.setProperty('--rwd-top',Math.round(tb.getBoundingClientRect().bottom)+'px');
      const ow=w+d.bz*2, oh=h+d.bz*2, cs=getComputedStyle(ovl), cap=ovl.querySelector('.rwd-cap');
      const aw=ovl.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-8;
      const ah=ovl.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-cap.offsetHeight-parseFloat(cs.rowGap||cs.gap||0)-8;
      const k=Math.max(.1,Math.min(1,aw/ow,ah/oh));
      dev.style.transform='scale('+k+')';dev.style.setProperty('--rwd-inv',String(1/k));sizer.style.width=(ow*k)+'px';sizer.style.height=(oh*k)+'px';
    }
    function save(){ssSet(cur>0?{d:DEV[cur].id,r:rot}:null);}
    function openDev(i){
      if(window.innerWidth<1024)return;
      const prev=cur; cur=i; if(prev!==i&&prev>0)rot=false;
      ensureOvl();ovl.hidden=false;layout();ensureFrame();save();
    }
    function closeAll(fromSeg){
      cur=0;rot=false;save();
      if(ovl){ovl.hidden=true; if(frame){frame.remove();frame=null;} rwdLd.stop(); }
      if(!fromSeg&&segBtns[0]&&!segBtns[0].classList.contains('is-active'))segBtns[0].click(); // 讓 Segmented 指示器回到「桌機」
    }
    function pick(i){ if(i===0)closeAll(true); else openDev(i); }
    window.__rwdPreview={open:(id,r)=>{const i=DEV.findIndex(d=>d.id===id);if(i>0){segBtns[i].click();if(r&&!rot){rot=true;layout();save();}}},close:()=>closeAll(),state:()=>({device:DEV[cur].id,rotated:rot})};

    window.addEventListener('resize',()=>{ if(cur>0){ if(window.innerWidth<1024)closeAll(); else layout(); } });
    window.addEventListener('hashchange',()=>{ // 外層換頁 → 框內跟著換（只改 hash，不整頁重載）
      if(!frame||location.hash===lastFrameHash)return; lastFrameHash=location.hash; frame.src=frameBase+location.hash; });
    window.addEventListener('message',e=>{ if(!frame||e.source!==frame.contentWindow)return; const d=e.data; if(!d||d.rwdframe!==1)return;
      if(d.t==='hash'&&typeof d.hash==='string'){ lastFrameHash=d.hash; if(d.hash&&location.hash!==d.hash)location.hash=d.hash; } // 框內換頁 → 外層同步（關閉後停在同一頁）
      else if(d.t==='esc')closeAll();
      else if(d.t==='stage'&&typeof d.s==='string')rwdLd.stage(d.s); });   // SHELL8:v1 框內載入進度
    new MutationObserver(()=>{ if(frame){try{frame.contentWindow.postMessage(themeMsg(),'*');}catch(e){}} })
      .observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-frost','style']});
    document.addEventListener('keydown',e=>{ if(e.key!=='Escape'||cur<1||e.defaultPrevented)return;
      if([...document.querySelectorAll('[aria-modal="true"],.ss-ovl')].some(n=>n.getClientRects().length))return; closeAll(); });
    if(savedIdx>0&&window.innerWidth>=1024){ rot=!!saved.r; segBtns[savedIdx].click(); rot=!!saved.r; layout(); save(); } // 本次分頁內重新整理：還原上次裝置
  })();
