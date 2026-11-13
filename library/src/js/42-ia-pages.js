  /* ===== IA-PAGES:v1 頁首裝飾：麵包屑（Breadcrumb 原子）、手機 Token 區分頁（Tab 原子 soft＋果凍）、元件／範本頁底上一個下一個；拿掉標題上方小標。
     內容區被頁面自己局部重畫（例如 Token 頁切 L1／L2）時，由下方的 MutationObserver 自動補回 ===== */
  const navEnName=it=>{const p=it.name.split(' ').filter(x=>!/[一-鿿]/.test(x));return p.length?p.join(' '):it.name;};   // 「Button 按鈕」→「Button」
  function pgcCrumbs(id){const sec=secOf(id);const S=NAV_SECS.find(x=>x.id===sec);if(!S)return null;const all=NAV.flatMap(g=>g.items),it=all.find(n=>n.id===id);
    const L=[{t:'首頁',go:'home'}];
    if(id==='components'||id==='templates'){L.push({t:S.lb,skip:1});return L;}
    if(sec==='tokens'){const nm={tokens:'Design Token',guideline:'Design Guideline',summary:'選擇元件',settings:'設定'}[id];L.push({t:S.lb,go:id==='tokens'?null:'tokens',skip:1});L.push({t:nm,skip:/^Design/.test(nm)});return L;}
    if(sec==='history'){L.push({t:S.lb,skip:1});L.push({t:window.__dsProject?'更新紀錄':'版本紀錄'});return L;}
    L.push({t:S.lb,go:S.go(),skip:1});
    if(sec==='components'&&it){const gs=NAV.filter(g=>g!==NAV_TPL()),gi=gs.findIndex(g=>g.items.includes(it));if(gi>=0)L.push({t:gs[gi].group.split(' ').filter(x=>!/[一-鿿]/.test(x)).join(' ')||gs[gi].group,go:'components#'+gi,skip:1});}
    if(it)L.push({t:navEnName(it),skip:1});
    return L;}
  function pgcGo(go){if(go.startsWith('components#')){renderView('components');const g=document.getElementById('cov-g'+go.split('#')[1]);if(g)requestAnimationFrame(()=>g.scrollIntoView({block:'start'}));}else renderView(go);}
  let PGC_SUB=null;   /* Token 區分頁列：同一組頁面沿用同一條（換頁時搬進新內容），果凍動畫才不會被重畫切掉 */
  function pgcDecorate(view,id){if(!view||id==='home'||id==='start')return;
    view.querySelectorAll(':scope > .pgc-bc,:scope > .pgc-subtab,:scope > .pgc-pn').forEach(x=>x.remove());
    const L=pgcCrumbs(id);if(!L)return;
    const nav=ce('nav','pgc-bc');nav.setAttribute('aria-label','麵包屑');const tr=bcTrail(L.map(x=>x.t),{sep:'chevron'});nav.appendChild(tr);
    [...tr.querySelectorAll('.bc-item')].forEach((el,i)=>{const x=L[i];if(!x)return;if(x.skip)el.setAttribute('data-i18n-skip','');if(!x.go||el.classList.contains('bc-current'))return;
      el.setAttribute('role','link');el.tabIndex=0;el.onclick=()=>pgcGo(x.go);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pgcGo(x.go);}};});
    view.prepend(nav);
    if(secOf(id)==='tokens'){const pages=[['tokens','Design Token'],['guideline','Design Guideline']];if(typeof dsEditing==='function'&&dsEditing())pages.push(['summary','選擇元件']);
      const key=pages.map(x=>x[0]).join(',');
      if(!PGC_SUB||PGC_SUB.key!==key){const bar=ce('div','tabbar v-soft tab-jelly pgc-subtab');bar.setAttribute('role','tablist');bar.setAttribute('aria-label','Token 區頁面');
        const jelly=typeof tabJelly==='function'?tabJelly(bar):null;   /* 跟元件頁 Tab soft 同一支果凍動畫 */
        pages.forEach(([pid,lb],i)=>{const t=ce('button','tabi sz-m');t.type='button';t.dataset.pid=pid;t.setAttribute('role','tab');t.innerHTML='<span></span>';t.firstChild.textContent=lb;
          if(/^Design/.test(lb))t.setAttribute('data-i18n-skip','');
          t.onclick=e=>{if(t.classList.contains('st-active'))return;bar.querySelectorAll('.tabi').forEach(x=>x.classList.remove('st-active'));t.classList.add('st-active');if(jelly&&e&&e.detail>0)jelly.play(i);renderView(pid);};
          bar.appendChild(t);});
        if(jelly)jelly.init();PGC_SUB={key,bar};}
      PGC_SUB.bar.querySelectorAll('.tabi').forEach(t=>{const on=t.dataset.pid===id;t.classList.toggle('st-active',on);t.setAttribute('aria-selected',String(on));});nav.after(PGC_SUB.bar);}
    const h1=view.querySelector('h1');const eb=h1&&h1.previousElementSibling;if(eb&&eb.classList.contains('eyebrow'))eb.hidden=true;   /* 有麵包屑就不要標題上方的小標 */
    const sec=secOf(id);if((sec==='components'||sec==='templates')&&id!=='components'&&id!=='templates'){
      const list=sec==='templates'?(NAV_TPL()||{items:[]}).items:NAV.filter(g=>g!==NAV_TPL()).flatMap(g=>g.items),i=list.findIndex(x=>x.id===id);if(i<0)return;
      const box=ce('div','pgc-pn');const mk=(txt,go,v,skip)=>{const b=mkBtn({variant:v,intent:'secondary',size:'m',isLive:true});b.type='button';b.querySelector('span').textContent=txt;if(skip)b.setAttribute('data-i18n-skip','');b.onclick=()=>renderView(go);return b;};
      box.appendChild(i>0?mk('← '+navEnName(list[i-1]),list[i-1].id,'outline',1):ce('span'));box.appendChild(mk(sec==='templates'?'全部範本':'全部元件',sec,'soft'));   /* 前後元件名是英文（不翻），中間按鈕跟語言 */
      box.appendChild(i<list.length-1?mk(navEnName(list[i+1])+' →',list[i+1].id,'outline',1):ce('span'));
      const ft=view.querySelector(':scope > footer');ft?ft.before(box):view.appendChild(box);}}
  {const v=document.getElementById('view');let q=0;if(v)new MutationObserver(()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;if(typeof current==='string'&&current!=='home'&&!v.querySelector(':scope > .pgc-bc'))pgcDecorate(v,current);});}).observe(v,{childList:true});}

  /* ===== IA-PAGES:v1 總覽頁：分類跳轉＋卡片；縮圖＝各元件頁的預覽本身（捲到才畫），範本＝整頁縮圖 ===== */
  /* 互動預覽要操作才看得懂的元件，改用變體矩陣裡已經展開的靜態畫面 */
  const COV_PICK={'floating-line':'.flo-stage','context-menu':'.mcell','menubar':'.mbr-cell.is-open','modal':'.mcell','drawer':'.mcell','table-toolbar':'.mcell'};
  const COV_OPEN=['time-picker','cascader','tree-select'];   /* 選擇器類：欄位＋已展開面板 */
  const COV_DESC={'button':'觸發動作的按鈕：四種樣式 × 三種意圖 × 三種尺寸，含載入與停用狀態。','tag':'標示分類或狀態的小標籤，有多種樣式、圓角與顏色意圖。','dropdown':'從一串選項裡挑一個或多個的下拉選單，選項多時可搜尋。'};   /* 元件頁開頭那句不像說明的，另寫一句（英日在字典） */
  const COV_FOCUS={'tpl-admin-dashboard':'.tad-tabs','tpl-admin-report':'.tad-tabs','tpl-admin-list':'.tad-head','tpl-admin-detail':'.tad-card','tpl-admin-form':'.tad-card',
    'tpl-web-product':'.tws-grid','tpl-web-blog':'.tws-grid','tpl-web-news':'.tws-news-list','tpl-web-article':'.im-box'};   /* 手機範本縮圖捲到的代表區塊 */
  function covThumb(id,host,descEl){
    const tmp=ce('div');tmp.style.cssText='position:absolute;left:-99999px;top:0;width:1100px;';document.body.appendChild(tmp);
    let stage=null;
    try{if(BUILD[id])BUILD[id](tmp);else if(id==='button')tmp.innerHTML=buttonBentoHTML();
      const lede=tmp.querySelector('.lede');
      if(descEl&&!descEl.childNodes.length&&COV_DESC[id])descEl.textContent=COV_DESC[id];
      else if(descEl&&!descEl.childNodes.length&&lede){const c=lede.cloneNode(true);c.querySelectorAll('a').forEach(a=>a.replaceWith(...a.childNodes));descEl.append(...c.childNodes);}   /* 說明＝元件頁開頭那段（原文，交給翻譯機制換語言） */
      const hw=HX_WALL.find(x=>x.id===id&&id!=='tooltip');
      const pk=id==='color-picker'?([...tmp.querySelectorAll('.cpk-full')].find(e=>e.querySelector('.pkr-pop-static'))||null)
        :COV_OPEN.includes(id)?((tmp.querySelector('.pkr-pop-static')||{}).parentElement||null):(COV_PICK[id]&&tmp.querySelector(COV_PICK[id]));
      if(pk){const r=pk.getBoundingClientRect();pk.style.width=Math.round(r.width)+'px';pk.style.height=Math.round(r.height)+'px';pk.style.boxSizing='border-box';}   /* 版面靠外層撐開的：搬進卡片前先固定原本寬高 */
      stage=hw?hw.mk():pk?pk:(tmp.querySelector('.live-stage')||tmp.querySelector('.tpl-fit'));
      if(id==='logo'){const lg=document.querySelector('.topbar .brand-logo');if(lg){stage=ce('div');const c=lg.cloneNode(true);c.style.cssText='width:120px;height:auto;color:var(--ink)';stage.appendChild(c);}}
      if(id==='tooltip'){const tip=tmp.querySelector('.mcell .tt-tip.tt-p-top.tt-sz-m')||tmp.querySelector('.mcell .tt-tip'),btn=tmp.querySelector('.live-stage .tt-trig');
        if(tip&&btn){const b=ce('div');b.style.cssText='display:flex;flex-direction:column;align-items:center;gap:var(--sp-2)';b.append(tip,btn);stage=b;}}
      if(stage&&stage.classList.contains('tpl-fit'))stage.style.transform='none';}catch(e){stage=null;}
    host.innerHTML='';
    if(!stage){tmp.remove();const p=ce('span','cov-ph');p.textContent='（沒有預覽）';host.appendChild(p);return;}
    const fit=ce('div','cov-fit');fit.appendChild(stage);let box=host;
    if(host.closest('.is-tpl')){const win=ce('div','cov-win');win.appendChild(fit);host.appendChild(win);box=win;}else host.appendChild(fit);
    tmp.remove();
    /* 量「真的畫出東西」的範圍（有底色／框線／陰影、圖片 svg 輸入框、或直接含文字）；遇到會裁切的容器只算它自己的框 → 置中縮進卡片。
       元件：不放大，放不下才縮，寬最多 80%、高最多 70%；範本：照寬度填滿、從頂端開始 */
    const tpl=!!host.closest('.is-tpl');
    const fitNow=()=>{fit.style.transform='none';const hr=box.getBoundingClientRect(),W=box.clientWidth,H=box.clientHeight;if(!W||!H)return;
      let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
      const walk=e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||(e!==fit&&+cs.opacity===0))return;const r=e.getBoundingClientRect();
        const ink=/^(IMG|SVG|CANVAS|INPUT|TEXTAREA|SELECT|VIDEO)$/i.test(e.tagName)||[...e.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim())||
          !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)||cs.backgroundImage!=='none'||parseFloat(cs.borderTopWidth)+parseFloat(cs.borderLeftWidth)+parseFloat(cs.borderBottomWidth)+parseFloat(cs.borderRightWidth)>0||cs.boxShadow!=='none';
        if(ink&&r.width>=1&&r.height>=1&&e!==fit){x0=Math.min(x0,r.left);y0=Math.min(y0,r.top);x1=Math.max(x1,r.right);y1=Math.max(y1,r.bottom);}
        if(e!==fit&&(cs.overflowX!=='visible'||cs.overflowY!=='visible'))return;[...e.children].forEach(walk);};
      walk(fit);if(!isFinite(x0)){fit.classList.add('is-in');return;}
      let ux=x0-hr.left,uy=y0-hr.top,uw=x1-x0,uh=y1-y0;
      if(tpl){const root=fit.querySelector('.tpl-fit > *');if(root){const rr=root.getBoundingClientRect();ux=rr.left-hr.left;uy=rr.top-hr.top;uw=rr.width;uh=rr.height;}}
      const k=tpl?W/uw:Math.min(1,(W*.8)/uw,(H*.7)/uh);
      const tx=tpl?(-ux*k):(W/2-(ux+uw/2)*k),ty=tpl?(-uy*k):(H/2-(uy+uh/2)*k);
      fit.style.transform='translate('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px) scale('+k.toFixed(3)+')';fit.classList.add('is-in');};
    const focus=()=>{const root=fit.querySelector('.tpl-fit > .dv-mobile'),sel=COV_FOCUS[id];if(!root||!sel)return;const t=root.querySelector(sel);if(!t)return;
      let sc=t.parentElement;while(sc&&sc!==root){if(/(auto|scroll)/.test(getComputedStyle(sc).overflowY)&&sc.scrollHeight>sc.clientHeight)break;sc=sc.parentElement;}
      if(!sc||sc===root)return;const k=(root.getBoundingClientRect().width/root.offsetWidth)||1;sc.scrollTop+=(t.getBoundingClientRect().top-sc.getBoundingClientRect().top)/k-12;};
    requestAnimationFrame(()=>requestAnimationFrame(()=>{fitNow();focus();}));
    /* 有進場動畫／自動示範的：前 2.5 秒內容一變就重量，之後固定 */
    let t=0;const mo=viewObs(new MutationObserver(()=>{clearTimeout(t);t=setTimeout(fitNow,150);}));mo.observe(fit,{subtree:true,childList:true,attributes:true,characterData:true});
    setTimeout(()=>{mo.disconnect();clearTimeout(t);fitNow();focus();},2500);}
  function renderOverview(view,sec){const comp=sec==='components';const groups=comp?NAV.filter(g=>g!==NAV_TPL()):[NAV_TPL()].filter(Boolean);
    view.innerHTML='';const head=ce('div','cov-head');const h1=ce('h1');h1.textContent=comp?'元件':'範本';const p=ce('p');
    p.textContent=comp?'所有元件共用同一套 Design Token。點卡片看規格、互動預覽與程式碼。':'頁面範本全部由元件庫的元件組成，點卡片看完整頁面與不同裝置的樣子。';head.append(h1,p);
    if(comp){const j=ce('div','cov-jump');groups.forEach((g,i)=>{const b=mkBtn({variant:'soft',intent:'secondary',size:'s',isLive:true});b.type='button';
        const sp=b.querySelector('span');sp.textContent=g.group.split(' ').filter(x=>!/[一-鿿]/.test(x)).join(' ')||g.group;sp.setAttribute('data-i18n-skip','');
        const n=ce('span','cov-jn');n.textContent=String(g.items.length);b.appendChild(n);b.onclick=()=>{const t=document.getElementById('cov-g'+i);if(t)t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});};j.appendChild(b);});head.appendChild(j);}
    view.appendChild(head);
    const main=document.querySelector('.main');const zh=navZh();
    const io=viewObs(new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);covThumb(e.target.dataset.id,e.target.querySelector('.cov-thumb'),e.target.querySelector('.cov-desc'));}),{root:main,rootMargin:'300px 0px'}));
    groups.forEach((g,i)=>{const s=ce('section','cov-sec');s.id='cov-g'+i;
      if(comp){s.innerHTML='<div class="gd-sec-h"><h2 class="gd-sec-t"></h2></div>';s.querySelector('h2').textContent=g.group;}
      const grid=ce('div','cov-grid'+(comp?'':' is-tpl'));
      g.items.forEach(it=>{const c=document.createElement('a');c.className='cov-card';c.href='#'+it.id;c.dataset.id=it.id;c.onclick=e=>{e.preventDefault();renderView(it.id);};
        const en=navEnName(it),zhn=it.name.replace(en,'').trim();
        c.innerHTML='<div class="cov-thumb" aria-hidden="true" inert></div><div class="cov-body"><div class="cov-name" data-i18n-skip></div><div class="cov-desc"></div></div>';
        const nm=c.querySelector('.cov-name');nm.textContent=en;if(zh&&zhn){const sm=ce('small');sm.textContent=zhn;nm.appendChild(sm);}
        grid.appendChild(c);io.observe(c);});
      s.appendChild(grid);view.appendChild(s);});
    viewOn(document,'cdl:lang',()=>{if(current===sec)renderView(sec);});}   /* 換語言：中文補充名稱跟著顯示／隱藏 */
  function renderNav(){const host=document.getElementById('sidebar');host.innerHTML='';const sec=secOf(current);host.dataset.sec=sec;
    if(!window.__dsProject&&typeof dsModeSw==='function'){try{const w=ce('div','nav-mode');w.appendChild(dsModeSw());host.appendChild(w);}catch(e){}}   // IA-SHELL:v1 模式切換放側欄最上方（桌機手機都是）；重新開始移到建立流程彈窗底部
    host.appendChild(navPrefBox());   // NAV-PREF:v1 手機：深淺色、語言放側欄（頂欄那兩顆 ≤767px 隱藏）
    /* 手機（≤1023px）：首頁＋四個分區入口（Header 收進來的那排），點了進各區 */
    {const ml=ce('div','nav-mlist');const zh=navZh();
      [{id:'home',lb:'首頁',go:()=>'home'},...NAV_SECS].forEach(x=>{const b=document.createElement('button');b.type='button';b.className='nav-item nav-pin';b.dataset.sec=x.id;
        b.innerHTML='<span></span>';b.firstChild.textContent=x.id==='home'?x.lb:(x.lb+(zh?' '+x.zh:''));if(x.id!=='home')b.setAttribute('data-i18n-skip','');
        b.setAttribute('aria-current',String(x.id===sec));b.onclick=()=>renderView(x.go());ml.appendChild(b);});
      host.appendChild(ml);}
    /* 桌機：目前分區的項目 */
    const box=ce('div','nav-sec');box.dataset.sec=sec;const S=NAV_SECS.find(x=>x.id===sec);
    if(S){const h=ce('div','nav-sec-h');h.setAttribute('data-i18n-skip','');h.textContent=S.lb;box.appendChild(h);}
    if(sec==='tokens'){const zh=navZh();
      box.appendChild(navPin('tokens','Design Token'+(zh?' 設計變數':''),'nav-mono'));box.appendChild(ce('div','nav-sep'));
      box.appendChild(navPin('guideline','Design Guideline'+(zh?' 設計規範':''),'nav-mono'));
      if(typeof dsEditing==='function'&&dsEditing()){box.appendChild(ce('div','nav-sep'));box.appendChild(navPin('summary','選擇元件'));}}   // MODE:v1 選擇元件只在編輯模式出現
    if(sec==='components'||sec==='templates'){box.appendChild(navPin(sec,sec==='components'?'全部元件':'全部範本'));if(sec==='templates')box.appendChild(ce('div','nav-sep'));}   /* IA-PAGES:v1 總覽頁入口；元件區下面的分類群組自帶上框線，不再多加分隔線 */
    if(sec==='templates'){const t=NAV_TPL();if(t)t.items.forEach(it=>box.appendChild(navPin(it.id,it.name)));}   /* 範本：不收合，直接平鋪 */
    if(sec==='history'){box.appendChild(navPin('changelog',window.__dsProject?'更新紀錄':'版本紀錄'));}
    if(sec==='components'){
    NAV.filter(g=>g!==NAV_TPL()).forEach((g,gi)=>{const hasCur=g.items.some(it=>it.id===current); // 只展開「當前檢視所在」的群組，其餘預設收合
      const grp=document.createElement('div');grp.className='nav-group'+(hasCur?'':' collapsed');
      const head=document.createElement('button');head.className='gh';
      const readyN=g.items.filter(x=>x.st!=='planned').length;
      head.innerHTML=`<span class="gh-t">${g.group}</span><span class="gh-n" title="已完成 / 全部（含規劃中）">${readyN===g.items.length?readyN:readyN+'/'+g.items.length}</span><span class="gh-caret">${ICON_CARET}</span>`;
      head.onclick=()=>grp.classList.toggle('collapsed');
      const list=document.createElement('div');list.className='ng-items';       // 動畫外層：grid rows 1fr／0fr
      const inner=document.createElement('div');inner.className='ng-inner';      // 內層：裁切＋opacity＋承載縮排直線
      g.items.forEach(it=>{const b=document.createElement('button');b.className='nav-item';b.dataset.id=it.id;b.setAttribute('aria-current',it.id===current);
        if(it.st==='planned')b.classList.add('is-planned');
        b.innerHTML=`<span class="nm">${it.name}</span>`+(it.st==='planned'?`<span class="nav-plan">${it.pr||'規劃'}</span>`:'');b.onclick=()=>renderView(it.id);inner.appendChild(b);});
      list.appendChild(inner);grp.append(head,list);box.appendChild(grp);});}
    host.appendChild(box);
    requestAnimationFrame(()=>{const c=box.querySelector('.nav-item[aria-current="true"]');if(c)c.scrollIntoView({block:'nearest'});dsModeFit();});
    const fh=sbFootHTML();if(fh){const foot=ce('div','sb-foot');foot.id='sbFoot';foot.innerHTML=fh;foot.style.cursor='pointer';foot.title=window.__dsProject?'看更新紀錄':'看版本紀錄';foot.onclick=()=>renderView('changelog');host.appendChild(foot);} // 選單底部：版本號＋母元件庫說明（.sb-foot 只 ≤767px 顯示）；點擊進紀錄頁
  }
  function sbFootHTML(){
    if(window.__dsProject) return '<span class="sb-foot-name">'+window.__dsProject+'</span><span class="sb-foot-ver">v'+(window.__dsVersion||0)+'</span>';
    return '';   /* MODE-COPY:v1 母庫說明已移除 */
  }

