  /* ===== button view 內容 ===== */
  function buttonViewHTML(){return `
    <p class="eyebrow">L3 Component</p>
    <h1>Button 按鈕</h1>
    <p class="lede">L3 spec 定義的完整複雜度攤開在此。<b>指著任何一格跟我說要不要保留</b>，或用下方轉盤把矩陣「調」到你要的複雜度。示意色為 placeholder token，之後接真正的 <code>semantic.action.*</code>。</p>
    <div class="spec" id="specStrip"></div>
    <div class="dcard">
      <button class="dcard-head"><span class="dh-title">變數篩選器</span><span class="dh-count" id="countOut"></span><span class="dh-chevron">${ICON_CARET}</span></button>
      <div class="dcard-body"><p class="hint">勾掉不需要的軸值，矩陣與總變體數即時縮減。每軸至少保留一個。</p><div class="axes" id="axesCtl"></div></div>
    </div>
    <section class="block"><h2><span class="bh-t">State × Intent 矩陣</span><span class="bh-d">每個 variant 一塊；列＝狀態、欄＝意圖，尺寸固定 m。停用狀態帶 <code>disabled</code>。此區為靜態呈現。</span></h2>
      <div class="panels" id="matrix"></div></section>
    <section class="block"><h2><span class="bh-t">互動預覽與程式碼</span><span class="bh-d">這區是<b>真的可以操作</b>的按鈕——滑鼠移上去會切到 hover、按住會切到 pressed。調參數看即時效果與對應程式碼。</span></h2>
      <div class="livewrap" id="liveWrap">
        <div class="ctl-row" id="liveCtl"></div>
        <div class="live-stage" id="liveStage"></div>
        <div class="lay-resizer" id="layResizer" title="拖曳調整程式碼寬度"></div>
        <div class="live-code" id="liveCode"></div>
        <p class="live-note">↓ 這排直接用滑鼠試 hover / 按下（solid・soft・outline・text，皆 primary）</p>
        <div class="live-free" id="liveFree"></div>
      </div></section>
    <section class="block"><h2><span class="bh-t">Size 尺寸軸</span><span class="bh-d">solid・primary・預設狀態，對照 s／m／l。</span></h2>
      <div class="row-demo" id="sizeRow"></div></section>
    <section class="block"><h2><span class="bh-t">Content 內容軸（boolean）</span><span class="bh-d"><code>show-label</code>／<code>show-leading-icon</code>／<code>show-trailing-icon</code>；<code>show-label=false</code> 的 icon-only 取代舊 icon-button。</span></h2>
      <div class="row-demo" id="boolRow"></div></section>
    <footer><span>來源：L0-scope-manifest.yaml · components/button（唯讀）</span><span id="deltaOut"></span></footer>`;
  }

  /* ===== Bento 元件頁版型（可重用）=====
     PAGE_LAYOUT[id]==='bento' 的元件頁改用 bentoHTML()＋wireBento()：Row1 三欄（控制項｜預覽｜篩選器＋Token，可拖曳調寬）、
     Row2 HTML｜SCSS 並排、其後內容段落卡、最後「狀態一覽表」預設收合。目前只有 button 切過來，其他頁維持原版型。 */
  const PAGE_LAYOUT={button:'bento',logo:'classic'}; // BENTO-ALL:v1 其餘 BUILD 頁預設 'bento'（bentoifyPage）；'classic'＝維持舊版型（logo＝品牌資產頁，沒有 Live／篩選器）
  function bentoHTML(o){
    const sec=s=>`<section class="block bento-sec"${s.id?` id="${s.id}"`:''}><h2><span class="bh-t">${s.title}</span>${s.sub?`<span class="bh-d">${s.sub}</span>`:''}</h2>${s.html}</section>`;
    const m=o.matrix;
    return `<p class="eyebrow">${ebTrim(o.eyebrow)}</p><h1>${o.title}</h1><p class="lede">${o.lede}</p>
    <div class="bento" data-bento="${o.key}">
      <div class="bento-top">
        <div class="bento-card bento-ctl" id="${o.ctlId}"></div>
        <div class="bento-rz" data-i="1" role="separator" aria-orientation="vertical" tabindex="0" aria-label="調整控制項欄寬度" title="拖曳調整寬度 · 方向鍵微調 · 雙擊還原"></div>
        <div class="bento-stage live-stage" id="${o.stageId}"></div>
        <div class="bento-rz" data-i="2" role="separator" aria-orientation="vertical" tabindex="0" aria-label="調整篩選器與 Token 欄寬度" title="拖曳調整寬度 · 方向鍵微調 · 雙擊還原"></div>
        <div class="bento-side" data-bento-slot="vartoken">${o.side||''}</div>
      </div>
      <div class="bento-code">${(o.codeIds||[]).map(id=>`<div class="live-code" id="${id}"></div>`).join('')}</div>
      ${(o.sections||[]).map(sec).join('')}
      ${m?`<section class="block dcard bento-mtx collapsed" id="${m.id||'sec-matrix'}"><h2><button type="button" class="dcard-head" aria-expanded="false" aria-controls="${m.bodyId}"><span class="dh-title bh-t">${m.title}</span>${m.sub?`<span class="dh-sub">${m.sub}</span>`:''}<span class="dh-count"${m.countId?` id="${m.countId}"`:''}></span><span class="dh-act">展開</span><span class="dh-chevron">${ICON_CARET}</span></button></h2>
        <div class="dcard-body"><div class="panels" id="${m.bodyId}"></div></div></section>`:''}
    </div>`;
  }
  // 三欄拖曳調寬（比照側欄 sidebarResize：拖曳／雙擊還原／localStorage 持久化，另加方向鍵）；欄寬夾在各欄最小值內，窄容器自動改兩欄／單欄
  function wireBento(root){
    const top=root&&root.querySelector('.bento-top'); if(!top)return;
    const KEY='ds-bento-w:'+(root.dataset.bento||'page');
    const MIN1=240,MIN3=280,MINS0=280,GAP=()=>{const rz=top.querySelector('.bento-rz');return rz?rz.getBoundingClientRect().width||16:16;};
    // BENTO-ALL:v1 自動頁（data-bento-auto）：量預覽內容的 max-content 寬度當預覽欄下限；data-stage="wide" 直接走寬版
    const AUTO=root.hasAttribute('data-bento-auto'), stg=top.querySelector(':scope>.bento-stage');
    function measure(){ if(!AUTO||!stg)return MINS0; if(root.dataset.stage==='wide')return 99999;
      const s=stg.style,keep=s.cssText; s.width='max-content';s.maxWidth='none';s.minWidth='0';s.justifySelf='start';
      const w=Math.ceil(stg.getBoundingClientRect().width); s.cssText=keep; return Math.max(MINS0,w); }
    let MINS=measure();
    const DEF1=264,DEF3=400;   // 設計稿：控制項 233（無內距）→ 卡片含 --sp-5 內距約 264；右欄 400
    let saved={}; try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){saved={};}
    const w={c1:saved.c1||null,c3:saved.c3||null};      // null＝用預設
    let mode='3';
    const cw=()=>top.clientWidth;
    function layout(pri){
      const W=cw(); if(!W)return;
      const g=GAP(); const m=W>=MIN1+MINS+MIN3+g*2?'3':(W>=MIN1+MINS+g?'2':(MINS>MINS0&&W>=560?'w':'1'));  // 'w'＝寬版（BENTO-ALL:v1）
      if(m!==mode){mode=m;top.classList.toggle('is-2col',m==='2');top.classList.toggle('is-1col',m==='1');top.classList.toggle('is-wide',m==='w');}
      let c1=w.c1||DEF1, c3=w.c3||Math.min(DEF3,Math.max(MIN3,W*.34));
      if(m==='3'){ const room=W-g*2-MINS;                   // 拖哪欄就先夾那欄（不擠鄰欄，只吃預覽欄）；容器變窄時兩欄一起退到最小值
        if(pri==='c3'){ c3=Math.max(MIN3,Math.min(c3,room-MIN1)); c1=Math.max(MIN1,Math.min(c1,room-c3)); }
        else{ if(pri==='c1')c1=Math.min(c1,room-Math.max(MIN3,Math.min(c3,room-MIN1))); c1=Math.max(MIN1,Math.min(c1,room-MIN3)); c3=Math.max(MIN3,Math.min(c3,room-c1)); } }
      else if(m==='2'){ c1=Math.max(MIN1,Math.min(c1,W-g-MINS)); }
      top.style.setProperty('--bc1',Math.round(c1)+'px'); top.style.setProperty('--bc3',Math.round(c3)+'px');
      top.querySelectorAll('.bento-rz').forEach(rz=>{const one=rz.dataset.i==='1';
        rz.setAttribute('aria-valuenow',Math.round(one?c1:c3));rz.setAttribute('aria-valuemin',one?MIN1:MIN3);
        rz.setAttribute('aria-valuemax',Math.round(one?(m==='3'?W-g*2-MINS-c3:W-g-MINS):W-g*2-MINS-c1));});
      return {c1,c3};
    }
    const cur=k=>parseFloat(top.style.getPropertyValue(k==='c1'?'--bc1':'--bc3'))||0;
    const save=()=>{try{const o={};if(w.c1)o.c1=w.c1;if(w.c3)o.c3=w.c3;if(Object.keys(o).length)localStorage.setItem(KEY,JSON.stringify(o));else localStorage.removeItem(KEY);}catch(_){}};
    const commit=()=>{const r=layout();if(r){if(w.c1)w.c1=Math.round(r.c1);if(w.c3)w.c3=Math.round(r.c3);}save();};
    top.querySelectorAll('.bento-rz').forEach(rz=>{
      const k=rz.dataset.i==='1'?'c1':'c3', dir=k==='c1'?1:-1;  // 欄1 往右拖變寬；欄3 往左拖變寬
      let x0=0,w0=0,drag=false;
      rz.addEventListener('pointerdown',e=>{ if(mode==='1'||mode==='w')return; drag=true;x0=e.clientX;w0=cur(k);
        rz.classList.add('is-drag');document.body.classList.add('is-resizing');try{rz.setPointerCapture(e.pointerId);}catch(_){} e.preventDefault(); });
      rz.addEventListener('pointermove',e=>{ if(!drag)return; w[k]=w0+dir*(e.clientX-x0); layout(k); });
      const end=()=>{ if(!drag)return; drag=false; rz.classList.remove('is-drag');document.body.classList.remove('is-resizing'); w[k]=cur(k); commit(); };
      rz.addEventListener('pointerup',end); rz.addEventListener('pointercancel',end);
      rz.addEventListener('keydown',e=>{ const step=e.shiftKey?32:8; let d=0;
        if(e.key==='ArrowLeft')d=-step; else if(e.key==='ArrowRight')d=step;
        else if(e.key==='Home'||e.key==='End'){ e.preventDefault(); w[k]=e.key==='Home'?1:99999; layout(k); w[k]=cur(k); commit(); return; }
        else if(e.key==='Enter'){ e.preventDefault(); w[k]=null; commit(); return; }
        else return;
        e.preventDefault(); w[k]=cur(k)+dir*d; layout(k); w[k]=cur(k); commit(); });
      rz.addEventListener('dblclick',()=>{ w[k]=null; commit(); });  // 雙擊還原預設
    });
    layout();
    if(top.__ro)top.__ro.disconnect();
    if(window.ResizeObserver){top.__ro=new ResizeObserver(()=>layout());top.__ro.observe(top);}
    if(AUTO&&stg&&root.dataset.stage!=='wide'){let q=0;new MutationObserver(()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;const n=measure();if(n!==MINS){MINS=n;layout();}});}).observe(stg,{childList:true});} // 控制項換掉預覽節點→重量寬度
    // 狀態一覽表：.dcard-head 由全域委派切 collapsed；這裡同步 aria-expanded 與「展開／收合」字樣
    root.querySelectorAll('.bento-mtx').forEach(sec=>{const h=sec.querySelector('.dcard-head'),a=sec.querySelector('.dh-act');
      const sync=()=>{const open=!sec.classList.contains('collapsed');h.setAttribute('aria-expanded',String(open));if(a)a.textContent=open?'收合':'展開';};
      new MutationObserver(sync).observe(sec,{attributes:true,attributeFilter:['class']});sync();});
  }
  function buttonBentoHTML(){return bentoHTML({key:'button',
    eyebrow:'L3 Component · Button',title:'Button 按鈕',
    lede:'L3 spec 定義的完整複雜度攤開在此。<b>指著任何一格跟我說要不要保留</b>，或用下方轉盤把矩陣「調」到你要的複雜度。示意色為 placeholder token，之後接真正的 <code>semantic.action.*</code>。',
    ctlId:'liveCtl',stageId:'liveStage',codeIds:['liveCode','liveCode2'],
    side:`<div class="dcard">
      <button class="dcard-head" type="button"><span class="dh-title">變數篩選器</span><span class="dh-chevron">${ICON_CARET}</span></button>
      <div class="dcard-body"><p class="hint">勾掉不需要的軸值，矩陣與總變體數即時縮減。每軸至少保留一個。</p><div class="axes" id="axesCtl"></div></div>
    </div>`,
    sections:[
      {title:'Size 尺寸軸',sub:'solid・primary・預設狀態，對照 s／m／l。',html:'<div class="row-demo" id="sizeRow"></div>'},
      {title:'Content 內容軸（boolean）',sub:'<code>show-label</code>／<code>show-leading-icon</code>／<code>show-trailing-icon</code>；<code>show-label=false</code> 的 icon-only 取代舊 icon-button。',html:'<div class="row-demo" id="boolRow"></div>'},
      {title:'Shape 形狀',sub:'<code>rect</code>（預設，綁 <code>--btn-radius</code>）／<code>circle</code>（膠囊；icon-only 時為正圓）。圓形用在播放鍵、浮動鈕這類單一圖示的主要操作。',html:'<div class="row-demo" id="shapeRow"></div>'}],
    matrix:{title:'狀態一覽表',sub:'State × Intent',countId:'countOut',bodyId:'matrix'}
  });}

  /* ===== BENTO-ALL:v1 其他元件頁套用 Button 的 bento 版型（renderView 在 BUILD＋renderBindPanel 之後呼叫）=====
     不改各 BUILD：渲染完把既有節點（closure 都還在）搬進 bento 欄位——
       主 Live（第一個 .livewrap）：.ctl → 控制項卡、.live-stage → 預覽舞台、.live-code → Row2 HTML 卡（＋鏡像一張 SCSS 卡）；
       變數篩選器／Token 綁定 → 右欄；其餘段落 → 內容段落（標題在卡外）；第一個「…矩陣／陳列」段 → 最後的「狀態一覽表」（預設收合，標頭帶變體數）。
     有 famhead 且自帶 Live／篩選器的家族（selector＝checkbox＋radio）→ 每組一個 bento；只有說明＋示意的 famhead 組（input 子元件、tab-item）→ 內容段落。
     規格表 strip、head-rule、「互動預覽與程式碼」「變數與 Token」段標題都不再出現。離屏的 flwCompCode／需求匯總 Live 不經過這裡（不受影響）。 */
  const BENTO_STAGE={header:'wide',footer:'wide','app-shell':'wide','schedule-chart':'wide',table:'wide','table-toolbar':'wide',modal:'wide',drawer:'wide'}; // 預覽天生要滿寬的頁
  const BENTO_LIVE2={price:'數值 Metric 互動預覽'};                    // 第二組 Live 沒有小標時的段落標題
  function bentoSec(title,sub,nodes,id){const s=ce('section','block bento-sec');if(id)s.id=id;
    s.innerHTML=`<h2><span class="bh-t">${title}</span>${sub?`<span class="bh-d">${sub}</span>`:''}</h2>`;
    nodes.forEach(n=>{if(n.style)n.style.marginBottom='';s.appendChild(n);});return s;}
  function bentoMirrorCode(src){const h=ce('div','live-code');const cp=makeCodePanel(h,'');cp.setTab('css');if(src.__cpMirror)src.__cpMirror(cp);return h;} // SCSS 卡＝同一個面板的鏡像
  function bentoifyPage(view,id){
    if((PAGE_LAYOUT[id]||'bento')!=='bento')return false;
    const host=view.querySelector('#cbody'); if(!host)return false;
    const isSec=el=>el.matches('section.block');
    const ttl=el=>((el.querySelector(':scope>h2 .bh-t')||{}).textContent||'').trim();
    const isLive=el=>isSec(el)&&(/^互動預覽/.test(ttl(el))||!!el.querySelector('.livewrap'));
    const groups=[[]];[...host.children].forEach(el=>{if(el.classList.contains('famhead'))groups.push([el]);else groups[groups.length-1].push(el);});
    const isCore=g=>g.some(el=>isLive(el)||el.id==='sec-vartoken'||el.matches('.dcard'));
    if(!groups.some(isCore))return false;
    view.querySelectorAll(':scope>.head-rule,:scope>.spec,:scope>footer').forEach(e=>e.remove());
    const out=[];let cur=null,n=0;
    groups.forEach(g=>{ if(!g.length)return;
      const fam=g[0].classList.contains('famhead')?g.shift():null;
      if(isCore(g)){ n++; if(fam){fam.classList.add('bento-fam');out.push(fam);} cur=bentoGroup(g,id,n); out.push(cur.root); return; }
      let sub='';if(fam&&g[0]&&g[0].tagName==='P'&&!g[0].className)sub=g.shift().innerHTML;
      const items=fam?[bentoSec((fam.querySelector('.fz')||fam).textContent.trim(),sub,g)]:g;
      items.forEach(it=>cur?cur.add(it):out.push(it));
    });
    host.innerHTML='';out.forEach(e=>host.appendChild(e));
    host.querySelectorAll(':scope>.bento').forEach(b=>wireBento(b));
    return true;
  }
  function bentoGroup(g,id,n){
    const isSec=el=>el.matches('section.block');
    const ttl=el=>((el.querySelector(':scope>h2 .bh-t')||{}).textContent||'').trim();
    const root=ce('div','bento');root.dataset.bento=id+(n>1?'-'+n:'');root.setAttribute('data-bento-auto','');if(BENTO_STAGE[id])root.dataset.stage=BENTO_STAGE[id];
    const top=ce('div','bento-top'),ctl=ce('div','bento-card bento-ctl'),side=ce('div','bento-side'),code=ce('div','bento-code');
    side.dataset.bentoSlot='vartoken';
    const rz=i=>{const r=ce('div','bento-rz');r.dataset.i=i;r.setAttribute('role','separator');r.setAttribute('aria-orientation','vertical');r.tabIndex=0;
      r.setAttribute('aria-label',i==='1'?'調整控制項欄寬度':'調整篩選器與 Token 欄寬度');r.title='拖曳調整寬度 · 方向鍵微調 · 雙擊還原';return r;};
    const liveSec=g.find(el=>isSec(el)&&(/^互動預覽/.test(ttl(el))||!!el.querySelector('.livewrap')));
    const vt=g.find(el=>el.id==='sec-vartoken');
    const mtxs=g.filter(el=>isSec(el)&&el!==liveSec&&el!==vt&&/矩陣|陳列/.test(ttl(el)));
    const cards=[...g.filter(el=>el.matches('.dcard')),...(vt?[...vt.querySelectorAll(':scope>.dcard')]:[])];
    cards.sort((a,b)=>a.classList.contains('bind-dcard')-b.classList.contains('bind-dcard')).forEach(c=>side.appendChild(c));
    const early=[],secs=[];
    let stage=null;
    if(liveSec){ const lws=[...liveSec.querySelectorAll('.livewrap')], capOf=w=>{const blk=w.parentElement!==liveSec?w.parentElement:null;return {blk,cap:blk&&blk.querySelector(':scope>[class$="-live-cap"]')};};
      const lw=lws[0];
      if(lw){ const {cap}=capOf(lw); if(cap){const c=ce('div','bento-cap');c.textContent=cap.textContent.trim();ctl.appendChild(c);}
        const cr=lw.querySelector(':scope>.ctl-row');if(cr)[...cr.children].forEach(c=>ctl.appendChild(c));
        stage=lw.querySelector(':scope>.live-stage');if(stage)stage.classList.add('bento-stage');
        const lc=lw.querySelector(':scope>.live-code');if(lc)code.append(lc,bentoMirrorCode(lc));
        const note=lw.querySelector(':scope>.live-note'),free=lw.querySelector(':scope>.live-free');
        if(free){free.classList.add('row-demo');early.push(bentoSec('快速對照',note?note.innerHTML.replace(/^\s*↓\s*/,''):'',[free]));}
        else if(note){note.className='bento-note';ctl.appendChild(note);} }
      lws.slice(1).forEach((w,i)=>{const {blk,cap}=capOf(w);const t=cap?cap.textContent.trim():(BENTO_LIVE2[id]||'互動預覽 '+(i+2));if(cap)cap.remove();early.push(bentoSec(t,'',[blk||w]));});
    }
    if(stage){top.append(ctl,rz('1'),stage,rz('2'),side);}else{top.classList.add('is-wide');top.append(side);} // 沒有 Live：只剩右欄卡片一列
    let last=null;
    g.forEach(el=>{ if(el===liveSec||el===vt||mtxs.includes(el)||el.matches('.dcard'))return;
      if(isSec(el)){el.classList.add('bento-sec');el.style.marginBottom='';secs.push(el);last=el;}
      else if(last){last.appendChild(el);}          // 段落後面直接 append 到 body 的散件（如 skeleton 第二排）歸回前一段
      else secs.push(el); });
    let mtx=null;
    const filter=side.querySelector('.dcard:not(.bind-dcard)'),cnt=filter&&filter.querySelector('.dh-count');
    if(mtxs.length){ mtx=mtxs[0];
      const sub=escHTML(ttl(mtx).replace(/\s*矩陣/,'').trim());
      if(!mtx.id)mtx.id='sec-matrix'+(n>1?'-'+n:'');
      const body=ce('div','dcard-body');body.id=mtx.id+'-body';
      mtxs.forEach((m,i)=>{const h=m.querySelector(':scope>h2');
        if(i){const s=ce('div','bento-mtx-sub');s.textContent=ttl(m);body.appendChild(s);}
        [...m.children].filter(e=>e!==h).forEach(e=>body.appendChild(e)); if(i)m.remove();});
      const h2=document.createElement('h2');
      h2.innerHTML=`<button type="button" class="dcard-head" aria-expanded="false" aria-controls="${body.id}"><span class="dh-title bh-t">狀態一覽表</span>${sub?`<span class="dh-sub">${sub}</span>`:''}<span class="dh-act">展開</span><span class="dh-chevron">${ICON_CARET}</span></button>`;
      if(cnt)h2.querySelector('.dh-act').before(cnt);                // 篩選器的變體數（同一個節點，updateCount 照常更新）搬到一覽表標頭
      mtx.className='block dcard bento-mtx collapsed';mtx.style.marginBottom='';mtx.innerHTML='';mtx.append(h2,body);
    } else if(cnt)cnt.classList.add('bento-keep');
    root.append(top);
    if(code.children.length)root.append(code);
    [...early,...secs].forEach(s=>root.appendChild(s));
    if(mtx)root.appendChild(mtx);
    return {root,add:el=>{ if(!el.matches('section.block'))el=bentoSec('','',[el]);el.classList.add('bento-sec');if(mtx)root.insertBefore(el,mtx);else root.appendChild(el);}};
  }

  function renderSpecStrip(){
    const rows=[['axes','<code>variant × intent × state × size</code>'],['formula','<code>4 × 3 × 4 × 3 = 144</code> 全展'],
      ['token-policy','<code>semantic.action.*</code>（禁 primitive）'],['content boolean','show-label / leading / trailing icon']];
    document.getElementById('specStrip').innerHTML=rows.map(([k,v])=>`<div class="cell"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
  }
  function renderMatrix(){
    const host=document.getElementById('matrix');host.innerHTML='';
    const vs=AXES.variant.filter(v=>active.variant.has(v)),is=AXES.intent.filter(i=>active.intent.has(i)),ss=AXES.state.filter(s=>active.state.has(s));
    vs.forEach(variant=>{
      const panel=document.createElement('div');panel.className='vpanel';
      panel.innerHTML=`<div class="vtitle"><span class="badge">variant</span><span class="vname">${ZH.variant[variant]} · ${variant}</span><span class="vdesc">${VDESC[variant]}</span></div>`;
      const scroll=document.createElement('div');scroll.className='grid-scroll';
      const grid=document.createElement('div');grid.className='mgrid';grid.style.minWidth=(140+is.length*150)+'px';
      grid.style.gridTemplateColumns=`minmax(96px,120px) repeat(${is.length},1fr)`;
      const corner=document.createElement('div');corner.className='corner';corner.style.borderBottom='1px solid var(--line-strong)';grid.appendChild(corner);
      is.forEach((intent,ix)=>{const c=document.createElement('div');c.className='colhead'+(ix===is.length-1?' lastcol':'');c.style.borderBottom='1px solid var(--line-strong)';c.innerHTML=`<span class="zh">${ZH.intent[intent]}</span><span class="en">${intent}</span>`;grid.appendChild(c);});
      ss.forEach(state=>{
        const rh=document.createElement('div');rh.className='rowhead';rh.innerHTML=`<span class="zh">${ZH.state[state]}</span><span class="en">${state}</span>`;grid.appendChild(rh);
        is.forEach((intent,ix)=>{const cell=document.createElement('div');cell.className='mcell'+(ix===is.length-1?' lastcol':'');cell.appendChild(mkBtn({variant,intent,state,size:'m'}));grid.appendChild(cell);});
      });
      scroll.appendChild(grid);panel.appendChild(scroll);host.appendChild(panel);
    });
  }
  function renderSizes(){const host=document.getElementById('sizeRow');host.innerHTML='';
    AXES.size.filter(s=>active.size.has(s)).forEach(size=>{const item=document.createElement('div');item.className='demo-item';const w=document.createElement('div');w.appendChild(mkBtn({variant:'solid',intent:'primary',state:'default',size}));const cap=document.createElement('div');cap.className='cap';cap.innerHTML=`<b>size ${size}</b>`;item.append(w,cap);host.appendChild(item);});}
  function renderBooleans(){const host=document.getElementById('boolRow');host.innerHTML='';
    const defs=[{cfg:{variant:'solid',intent:'primary',size:'m'},cap:'show-label=true'},{cfg:{variant:'solid',intent:'primary',size:'m',lead:true},cap:'+ leading-icon'},{cfg:{variant:'solid',intent:'primary',size:'m',trail:true},cap:'+ trailing-icon'},{cfg:{variant:'solid',intent:'primary',size:'m',iconOnly:true},cap:'show-label=false (icon-only)'}];
    defs.forEach(d=>{const item=document.createElement('div');item.className='demo-item';const w=document.createElement('div');w.appendChild(mkBtn(d.cfg));const cap=document.createElement('div');cap.className='cap';cap.innerHTML=`<b>${d.cap}</b>`;item.append(w,cap);host.appendChild(item);});}
  function renderShapes(){const host=document.getElementById('shapeRow');if(!host)return;host.innerHTML='';   /* BTN-SHAPE:v1 */
    const defs=[{cfg:{variant:'solid',intent:'primary',size:'m'},cap:'rect · 文字'},{cfg:{variant:'solid',intent:'primary',size:'m',shape:'circle'},cap:'circle · 文字'}];
    ['s','m','l'].forEach(sz=>{defs.push({cfg:{variant:'solid',intent:'primary',size:sz,iconOnly:true},cap:'rect · icon-only '+sz});defs.push({cfg:{variant:'solid',intent:'primary',size:sz,iconOnly:true,shape:'circle'},cap:'circle · icon-only '+sz});});
    defs.forEach(d=>{const item=document.createElement('div');item.className='demo-item';const w=document.createElement('div');w.appendChild(mkBtn(d.cfg));const cap=document.createElement('div');cap.className='cap';cap.innerHTML=`<b>${d.cap}</b>`;item.append(w,cap);host.appendChild(item);});}
  function renderCount(){const n={};for(const k in AXES)n[k]=[...active[k]].length;const total=n.variant*n.intent*n.state*n.size;
    document.getElementById('countOut').innerHTML=`${n.variant} × ${n.intent} × ${n.state} × ${n.size} = <b>${total}</b> <span class="full">/ ${FULL} 個變體</span>`;
    const diff=FULL-total;const _dOut=document.getElementById('deltaOut');if(_dOut)_dOut.textContent=diff>0?`已精簡 ${diff} 個變體`:`= spec 全展`;}
  function renderAxes(){const host=document.getElementById('axesCtl');host.innerHTML='';
    for(const k of ['variant','intent','state','size']){const ax=document.createElement('div');ax.className='axis';ax.innerHTML=`<div class="name">${ZH.axisName[k]}</div>`;const list=document.createElement('div');list.className='chk-list';
      AXES[k].forEach(val=>{const row=document.createElement('label');row.className='chk-row'+(active[k].has(val)?'':' off');
        const box=document.createElement('input');box.type='checkbox';box.checked=active[k].has(val);
        const txt=document.createElement('span');txt.textContent=ZH[k][val].replace(/\s.*/,'')+'·'+val;
        box.onchange=()=>{if(!box.checked){if(active[k].size===1){box.checked=true;return;}active[k].delete(val);}else active[k].add(val);
          row.classList.toggle('off',!box.checked);renderMatrix();renderSizes();renderCount();renderLive();};
        row.append(box,txt);list.appendChild(row);});
      ax.appendChild(list);host.appendChild(ax);}}

  /* ---- live ---- */
  function seg(key,opts){const s=document.createElement('div');s.className='seg';s.dataset.seg='btn-'+key;const gate=active[key];opts.forEach(o=>{const b=document.createElement('button');b.textContent=o;const on=!gate||gate.has(o);b.disabled=!on;b.classList.toggle('is-off',!on);b.setAttribute('aria-pressed',live[key]===o);b.onclick=()=>{if(b.disabled)return;live[key]=o;renderLive();};s.appendChild(b);});return s;}
  function renderLive(){
    ['variant','intent','size'].forEach(k=>{if(active[k]&&!active[k].has(live[k])){const f=AXES[k].find(v=>active[k].has(v));if(f)live[k]=f;}}); // 篩選器連動：選中值被篩掉就跳到第一個啟用值
    const ctl=document.getElementById('liveCtl');ctl.innerHTML='';
    const bento=!!ctl.closest('.bento'); // bento 版型：控制項直排，順序比照設計稿 Size → Intent → Variant → 文字 → Content
    const groups=bento?[['size','Size',AXES.size],['intent','Intent',AXES.intent],['variant','Variant',AXES.variant],['shape','Shape',['rect','circle']]]:[['variant','Variant',AXES.variant],['intent','Intent',AXES.intent],['size','Size',AXES.size],['shape','Shape',['rect','circle']]];   /* BTN-SHAPE:v1 */
    if(!live.shape)live.shape='rect';
    groups.forEach(([key,lab,opts])=>{const c=document.createElement('div');c.className='ctl';c.innerHTML=`<span class="lab">${lab}</span>`;c.appendChild(seg(key,opts));ctl.appendChild(c);});
    const c=document.createElement('div');c.className='ctl';c.innerHTML=`<span class="lab">Content</span>`;
    const checks=document.createElement('div');checks.className='checks';
    [['lead','leading icon'],['trail','trailing icon'],['iconOnly','icon only'],['disabled','disabled']].forEach(([key,lab])=>{const l=document.createElement('label');l.className='chk';const i=document.createElement('input');i.type='checkbox';i.checked=live[key];i.onchange=()=>{live[key]=i.checked;renderLive();};l.append(i,document.createTextNode(lab));checks.appendChild(l);});
    c.appendChild(checks);
    // Demo：可編輯文字（偷 Storybook Controls 的字串 arg）——打字即時反映到預覽與程式碼；用 paintLive 局部重繪避免輸入框失焦
    const tc=document.createElement('div');tc.className='ctl';tc.innerHTML=`<span class="lab">文字</span>`;
    const ti=document.createElement('input');ti.type='text';ti.className='ctl-text';ti.placeholder=LABEL[live.intent];ti.value=live.text||'';
    ti.oninput=()=>{live.text=ti.value;paintLive();};tc.appendChild(ti);
    if(bento)ctl.append(tc,c);else ctl.append(c,tc);
    // 程式碼區用共用面板 makeCodePanel + liveMarkup（序列化預覽節點）；面板快取在 host 上（切換控制項不重建→保留分頁、SCSS 只算一次）
    // bento 版型有兩張：#liveCode 預設 HTML、#liveCode2 預設 SCSS（並排）
    const codeHosts=['liveCode','liveCode2'].map(id=>document.getElementById(id)).filter(Boolean);
    codeHosts.forEach((h,ix)=>{ if(h.__cp)return; const cp=makeCodePanel(h,'Button · HTML');
      // CSS 分頁：用 mkBtn 列舉 variant/intent/size＋各 bool 撈出整顆 button 的樣式
      cp.setCssProvider(()=>componentCss(
        st=>mkBtn(Object.assign({variant:'solid',intent:'primary',size:'m',isLive:true},st)),
        [{key:'variant',options:AXES.variant},{key:'intent',options:AXES.intent},{key:'size',options:AXES.size},
         {key:'shape',options:['rect','circle']},{key:'lead',options:[true,false]},{key:'trail',options:[true,false]},{key:'iconOnly',options:[true,false]},{key:'disabled',options:[true,false]}]));
      if(ix===1)cp.setTab('css');
      h.__cp=cp; });
    function paintLive(){
      const stage=document.getElementById('liveStage');stage.innerHTML='';
      const b=mkBtn({variant:live.variant,intent:live.intent,size:live.size,shape:live.shape,lead:live.lead,trail:live.trail,iconOnly:live.iconOnly,disabled:live.disabled,isLive:true});
      if(!live.iconOnly&&live.text&&live.text.trim()){const sp=b.querySelector('span');if(sp)sp.textContent=live.text.trim();}
      stage.appendChild(b);
      const mk=liveMarkup(b); codeHosts.forEach(h=>h.__cp.set(mk));
    }
    paintLive();
    const free=document.getElementById('liveFree');
    if(free){free.innerHTML='';['solid','soft','outline','text'].forEach(v=>free.appendChild(mkBtn({variant:v,intent:'primary',size:'m',isLive:true})));}
    applyLiveLayout(document.getElementById('liveWrap'),document.getElementById('layResizer')); // 版型吃全站偏好（垂直／水平）；bento 無 #liveWrap → no-op
  }

  /* ===== 共用建構器（給 button 以外的元件）===== */
  const ICON_CHECK=PI('check');
  const ICON_MINUS=PI('minus');
  const ICON_PLUS=PI('plus');
  const ICON_CARET=PI('chevron-down');
  const ICON_CLOSE=PI('x');
  const ICON_EXPAND=PI('expand');
  /* x-circle（fill）：灰底圓 + 鏤空 ×，給輸入框清除用 */
  const ICON_XCIRCLE=PI('circle-x',{solid:1});
  const ICON_SEARCH=PI('search');
  const ICON_EYE=PI('eye');
  const ICON_EYE_SLASH=PI('eye-off');
  const ICON_UPLOAD=PI('upload');
  function ce(t,c){const e=document.createElement(t);if(c)e.className=c;return e;}
  function labHTML(zh,en){return `<span class="zh">${zh}</span><span class="en">${en}</span>`;}
  /* EYEBROW-TRIM:v1 頁面標題上方小標只留分類（L3 Component／Template…），「 · 元件名」跟大標重複所以拿掉 */
  function ebTrim(t){return String(t||'').split(' · ')[0];}
  function viewScaffold(view,o){
    view.innerHTML=`<p class="eyebrow">${ebTrim(o.eyebrow)}</p><h1>${o.title}</h1><p class="lede">${o.lede}</p><div class="head-rule"></div><div class="spec" id="specStrip"></div><div id="cbody"></div>`;
    document.getElementById('specStrip').innerHTML=o.specRows.map(r=>`<div class="cell"><div class="k">${r[0]}</div><div class="v">${r[1]}</div></div>`).join('');
    return document.getElementById('cbody');
  }
  function section(host,title,sub){const s=ce('section','block');s.innerHTML=`<h2><span class="bh-t">${title}</span>${sub?`<span class="bh-d">${sub}</span>`:''}</h2>`;host.appendChild(s);return s;}
  function panelsIn(sec){const p=ce('div','panels');sec.appendChild(p);return p;}
  function matrixPanel(o){
    const mincol=o.mincol||130;
    const panel=ce('div','vpanel');
    panel.innerHTML=`<div class="vtitle"><span class="badge">${o.badge}</span><span class="vname">${o.name}</span>${o.desc?`<span class="vdesc">${o.desc}</span>`:''}</div>`;
    const scroll=ce('div','grid-scroll');const grid=ce('div','mgrid');
    grid.style.gridTemplateColumns=`minmax(104px,132px) repeat(${o.cols.length},minmax(${mincol}px,1fr))`;
    grid.style.minWidth=(150+o.cols.length*mincol)+'px';
    const corner=ce('div','corner');corner.style.borderBottom='1px solid var(--line-strong)';grid.appendChild(corner);
    o.cols.forEach((c,ix)=>{const h=ce('div','colhead'+(ix===o.cols.length-1?' lastcol':''));h.style.borderBottom='1px solid var(--line-strong)';h.innerHTML=o.colLab(c);grid.appendChild(h);});
    o.rows.forEach(r=>{const rh=ce('div','rowhead');rh.innerHTML=o.rowLab(r);grid.appendChild(rh);
      o.cols.forEach((c,ix)=>{const cell=ce('div','mcell'+(ix===o.cols.length-1?' lastcol':''));cell.appendChild(o.cell(r,c));grid.appendChild(cell);});});
    scroll.appendChild(grid);panel.appendChild(scroll);return panel;
  }

  /* ---- 共用：可收合變數篩選器 ---- */
  function mountDial(host,cfg){
    const {axes,zh,active,onRender}=cfg;
    const card=ce('div','dcard');
    const head=ce('button','dcard-head');
    const countSpan=ce('span','dh-count');
    const title=ce('span','dh-title');title.textContent='變數篩選器';
    const chev=ce('span','dh-chevron');chev.innerHTML=ICON_CARET;
    head.append(title,countSpan,chev);
    const bodyEl=ce('div','dcard-body');
    const hint=ce('p','hint');hint.textContent='勾掉不需要的軸值，矩陣即時縮減。每軸至少保留一個。';bodyEl.appendChild(hint);
    const axesWrap=ce('div','axes');bodyEl.appendChild(axesWrap);
    const ks=Object.keys(axes),full=dialCount(ks,axes,cfg.when);
    function updateCount(){const parts=ks.map(k=>[...active[k]].length);const total=dialCount(ks,Object.fromEntries(ks.map(k=>[k,axes[k].filter(v=>active[k].has(v))])),cfg.when);countSpan.innerHTML=(cfg.when?'有效組合':parts.join(' × '))+' = <b>'+total+'</b> / '+full;}
    Object.keys(axes).forEach(k=>{const ax=ce('div','axis');ax.innerHTML=`<div class="name">${zh.axisName[k]}</div>`;const list=ce('div','chk-list');
      axes[k].forEach(val=>{const row=ce('label','chk-row'+(active[k].has(val)?'':' off'));
        const box=document.createElement('input');box.type='checkbox';box.checked=active[k].has(val);
        const txt=document.createElement('span');txt.textContent=(zh[k][val]||val).replace(/\s.*/,'')+'·'+val;
        box.onchange=()=>{if(!box.checked){if(active[k].size===1){box.checked=true;return;}active[k].delete(val);}else active[k].add(val);
          row.classList.toggle('off',!box.checked);onRender();updateCount();(LIVE_REFRESH.get(active)||[]).forEach(fn=>fn());};
        row.append(box,txt);list.appendChild(row);});
      ax.appendChild(list);axesWrap.appendChild(ax);});
    card.append(head,bodyEl);host.appendChild(card);updateCount();
    ensureVarTokenSection(host);   // 專案模式：把變數篩選器包進「變數與 Token」段落（含尚未有綁定卡的頁面）
  }

  /* ===== 共用：互動預覽版型（垂直／水平）＋程式碼區＋語法高亮（button 與所有元件共用）===== */
  function liveLayoutPref(){return window.__liveLayoutPref==='v'?'v':'h';} // 全站偏好，預設水平(h)
  const escHTML=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // 迷你 HTML 語法高亮（自包含、不引外部 lib）：tag / 屬性名 / 字串 / 標點 / 文字各上色
  function hlAttrs(s){let out='';const re=/(\s+)|([\w:-]+)(?:(=)("[^"]*"|'[^']*'))?/g;let m;while((m=re.exec(s))){if(m[1]){out+=m[1];continue;}if(m[2]){out+=`<span class="tk-attr">${escHTML(m[2])}</span>`;if(m[3])out+=`<span class="tk-punct">=</span><span class="tk-str">${escHTML(m[4])}</span>`;}}return out;}
  function hlTag(tag){const mm=tag.match(/^<(\/?)([A-Za-z][\w-]*)([\s\S]*?)(\/?)>$/);if(!mm)return `<span class="tk-punct">${escHTML(tag)}</span>`;const sl=mm[1],nm=mm[2],at=mm[3],sc=mm[4];return `<span class="tk-punct">&lt;${sl}</span><span class="tk-tag">${escHTML(nm)}</span>${hlAttrs(at)}<span class="tk-punct">${sc?' /':''}&gt;</span>`;}
  function hlLine(line){let out='',last=0,m;const re=/<\/?[A-Za-z][^>]*>/g;while((m=re.exec(line))){if(m.index>last)out+=`<span class="tk-txt">${escHTML(line.slice(last,m.index))}</span>`;out+=hlTag(m[0]);last=re.lastIndex;}if(last<line.length)out+=`<span class="tk-txt">${escHTML(line.slice(last))}</span>`;return out||'&nbsp;';}
  // 把渲染後的 DOM 節點序列化成乾淨多行 HTML（給程式碼區顯示；SVG 內縮成 …、去掉 live/is-off/st-default 噪音 class）
  function liveMarkup(node){
    function ser(el,d){
      if(el.nodeType===3){const t=el.textContent.replace(/\s+/g,' ').trim();return t?'  '.repeat(d)+t:'';}
      if(el.nodeType!==1)return '';
      const tag=el.tagName.toLowerCase(),pad='  '.repeat(d);
      const cls=(el.getAttribute('class')||'').split(/\s+/).filter(c=>c&&c!=='live'&&c!=='is-off'&&c!=='st-default').join(' ');
      if(tag==='svg')return `${pad}<svg${cls?` class="${cls}"`:''}>…</svg>`;
      const at=[];if(cls)at.push(`class="${cls}"`);
      ['type','name','placeholder','aria-label','aria-current','role','href','disabled','checked'].forEach(a=>{if(el.hasAttribute(a)){const v=el.getAttribute(a);at.push(v===''?a:`${a}="${v}"`);}});
      const open=`<${tag}${at.length?' '+at.join(' '):''}>`;
      if(tag==='input'||tag==='img'||tag==='br'||tag==='hr')return pad+open.replace(/>$/,' />');
      if(el.childNodes.length===1&&el.childNodes[0].nodeType===3){return pad+open+el.textContent.replace(/\s+/g,' ').trim()+`</${tag}>`;}
      const kids=[...el.childNodes].map(k=>ser(k,d+1)).filter(Boolean);
      if(!kids.length)return pad+open+`</${tag}>`;
      return pad+open+'\n'+kids.join('\n')+'\n'+pad+`</${tag}>`;
    }
    return ser(node,0);
  }
  /* ---- 共用：從實際樣式表撈「這顆元件用到的所有變體 CSS」----
     做法：用元件自己的建構器列舉各軸選項渲染 → 聯集所有出現過的 class（精準，不摻別元件的 v-line/i-brand）
     → 比對 <style> 裡選擇器命中這些 class 的規則 → 撈出來。來源＝同一份 <style>，零脫鉤（改樣式即時反映）。*/
  function collectClasses(node,set){ if(!node||node.nodeType!==1)return;
    const add=el=>{(el.getAttribute('class')||'').split(/\s+/).forEach(c=>{if(c)set.add(c);});};
    add(node); node.querySelectorAll('*').forEach(add); }
  const CSS_UTIL=new Set(['live','is-off','st-default']);           // 純運行期 class，不拿來配對（否則會撈到不相干全域規則）
  const ATOM_SET=new Set(['btn','tg','chip','chp','field','cbx','rdo','switch']); // 會被複合元件巢狀取用的原子 base（＋前綴 im-/pr- 為 image/price）
  const clsList=el=>((el&&el.getAttribute&&el.getAttribute('class'))||'').split(/\s+/).filter(Boolean);
  const isAtomCls=c=>ATOM_SET.has(c)||/^(im|pr)-/.test(c);          // 是否為「原子元件」的 base
  const isUtilCls=c=>/^(v|i|sz|st|is|live)-/.test(c)||CSS_UTIL.has(c); // 變體/狀態/運行期工具 class（不拿來當自己的 prefix）
  function fmtRule(txt){ const m=txt.match(/^([^{]+)\{([\s\S]*)\}\s*$/); if(!m)return txt;   // 把單行 cssText 攤成多行（每宣告一行）好讀
    const sel=m[1].trim().replace(/\s*,\s*/g,',\n');
    const decls=m[2].split(';').map(d=>d.trim()).filter(Boolean).map(d=>'  '+d+';');
    return sel+' {\n'+decls.join('\n')+'\n}'; }
  // 把 componentCss 的扁平 CSS 轉成較 SCSS 風格（純顯示用）：同元素的 modifier／state／pseudo 用 & 巢狀、後代選擇器降一層；
  // @media 與逗號多選擇器保持平放（仍是合法 SCSS）；layout 屬性加 // 註記提醒「佈局由使用端決定」。因為只顯示不編譯，轉換有瑕疵也不影響 app。
  function scssify(flat){
    const LAYOUT=/^(position|top|right|bottom|left|inset|inset-block|inset-inline|margin|margin-top|margin-right|margin-bottom|margin-left|float|z-index)\s*:/;
    const note=l=>{const t=l.trim();return LAYOUT.test(t)?l.replace(/;\s*$/,'; // 佈局，可由使用端覆寫'):l;};
    const declLines=body=>body.split('\n').map(l=>l.trim()).filter(Boolean).map(note);
    let head=''; const rules=[], flats=[];
    flat.split('\n\n').forEach(b=>{ if(!b.trim())return; const s=b.trimStart();
      if((s.startsWith('/*')&&s.includes(':root'))||s.startsWith(':root')){head=head?head+'\n\n'+b:b;return;} // token 區保持原樣
      if(s.startsWith('@media')){flats.push(b);return;}                                                      // 響應式平放
      const m=b.match(/^([\s\S]*?)\s*\{\n([\s\S]*)\n\}\s*$/); if(!m){flats.push(b);return;}
      const sel=m[1].trim(); if(sel.includes(',')){flats.push(b);return;}                                    // 逗號多選擇器平放
      const cm=sel.match(/^\.([-\w]+)/); if(!cm){flats.push(b);return;}
      const base='.'+cm[1], rem=sel.slice(base.length);
      const key = rem==='' ? '' : (/^\s/.test(rem) ? rem.trim() : '&'+rem);   // 有前導空白＝後代（降一層）；否則＝同元素複合（&）
      rules.push({base,key,body:m[2]});
    });
    const groups=new Map();
    rules.forEach(r=>{ if(!groups.has(r.base))groups.set(r.base,{root:[],kids:[]}); const g=groups.get(r.base);
      if(r.key==='')g.root.push(r.body); else g.kids.push(r); });
    const emit=(base,g)=>{ const inner=[];
      g.root.forEach(b=>declLines(b).forEach(l=>inner.push(l)));
      g.kids.forEach(k=>{ inner.push(k.key+' {'); declLines(k.body).forEach(l=>inner.push('  '+l)); inner.push('}'); });
      return base+' {\n'+inner.map(l=>'  '+l).join('\n')+'\n}'; };
    const parts=[]; if(head)parts.push(head);
    groups.forEach((g,base)=>parts.push(emit(base,g)));
    flats.forEach(f=>parts.push(f));
    return parts.join('\n\n');
  }
  function componentCss(renderFn,axes){
    // 推導「這顆元件自己的 prefix」：來自 root＋『最大的第一層子』（依子孫數）的非工具 class 及其字首字段。
    // 用最大子而非全部子：input 的主角是 .field（原子但最大）、modal 的 .btn 只是觸發鈕（不最大）→ 精準區分自己 vs 巢狀。
    const ownP=new Set(),stem=c=>c.split('-')[0];
    const addStems=el=>{ if(el)clsList(el).forEach(c=>{if(!isUtilCls(c)){ownP.add(c);ownP.add(stem(c));}}); };
    let first=null; try{first=renderFn({});}catch(e){}
    if(first&&first.nodeType===1){ addStems(first);
      let best=null,bestN=-1; for(const ch of first.children){ if(ch.nodeType!==1)continue; const n=ch.querySelectorAll('*').length; if(n>bestN){bestN=n;best=ch;} }
      addStems(best); }
    const sharesOwn=c=>[...ownP].some(p=>c===p||c.startsWith(p+'-'));
    const foreignAtom=c=>isAtomCls(c)&&!sharesOwn(c);               // 外來原子 base（例：卡片/彈窗內的 .btn；但 button 頁自己的 .btn 不算）
    const ownable=c=>!isUtilCls(c)&&!foreignAtom(c);               // 這個 class 是否算「自己的」
    const skipChild=cs=>cs.length>0&&cs.some(isAtomCls)&&!cs.some(ownable); // 純外來原子子樹（如單純的 .btn / .im-box）→ 整棵略過
    const set=new Set();
    // 逐元素收 class：外來原子 base 不收；若這個元素本身是外來原子（如 .btn.mdl-reopen），連它的變體/工具 class（v-solid…）也不收（那是原子的樣式），只留自家 namespace（.mdl-reopen）
    const addFrom=cs=>{ const foreignEl=cs.some(foreignAtom);
      cs.forEach(c=>{ if(foreignAtom(c))return; if(foreignEl&&isUtilCls(c))return; set.add(c); }); };
    const collect=root=>{ if(!root||root.nodeType!==1)return;
      addFrom(clsList(root));                                        // root 一定算自己
      (function walk(el){ for(const ch of el.children){ if(ch.nodeType!==1)continue;
        const cs=clsList(ch); if(skipChild(cs))continue;
        addFrom(cs); walk(ch); } })(root); };
    const run=ov=>{ try{const n=renderFn(ov||{}); if(n&&n.nodeType===1)collect(n);}catch(e){} };
    run({}); (axes||[]).forEach(a=>(a.options||[]).forEach(o=>run({[a.key]:o})));  // 初始＋每軸每選項各渲染一次
    const union=new Set([...set].filter(c=>!CSS_UTIL.has(c)&&!/live-(stage|root)/.test(c))); // 濾掉純運行期＋ live 展示外殼 class
    if(!union.size)return '/* 找不到對應樣式 */';
    // 一條規則只在「它某段選擇器裡的『結構 class』全屬於這顆元件」時才收：
    // 結構 class＝濾掉狀態(st-*)與運行期(live…)後剩的 class；例 .v-solid.st-hover→{v-solid}⊆聯集✓、.cbx.st-hover→{cbx}✗、.row-demo .btn→{row-demo,btn}✗
    const hit=sel=>sel.split(',').some(part=>{
      const cl=(part.match(/\.[-\w]+/g)||[]).map(c=>c.slice(1)).filter(c=>!/^st-/.test(c)&&!CSS_UTIL.has(c));
      return cl.length&&cl.every(c=>union.has(c));
    });
    const blocks=[],seen=new Set();
    for(const sheet of document.styleSheets){ let rules; try{rules=sheet.cssRules;}catch(e){continue;} if(!rules)continue;
      for(const r of rules){
        if(r.type===1){ if(hit(r.selectorText)&&!seen.has(r.cssText)){seen.add(r.cssText);blocks.push(fmtRule(r.cssText));} }
        else if(r.type===4){ const seg=['@media '+r.conditionText+' {']; // 響應式：內部命中的規則包在 @media 內
          for(const x of r.cssRules){ if(x.type===1&&hit(x.selectorText)&&!seen.has(x.cssText)){seen.add(x.cssText);seg.push(fmtRule(x.cssText).split('\n').map(l=>'  '+l).join('\n'));} }
          if(seg.length>1){seg.push('}');blocks.push(seg.join('\n'));} }
      }
    }
    const body=blocks.join('\n\n');
    // 不再輸出 :root token 區：token 已由 Design Token 頁／輸出的 _variables.scss 全域提供（@use 引入），元件只留自己的樣式、直接 var(--token) 取用，避免重複＋把當前值寫死
    return body?scssify(body):'/* 找不到對應樣式 */';   // 轉成 SCSS 風格（巢狀＋layout 註記）再輸出
  }
  // CSS 語法高亮（逐行；配合 makeCodePanel 的行號渲染）
  function hlCss(line){ if(!line.trim())return '&nbsp;'; const t=line.trim();
    if(t.startsWith('/*')||t.endsWith('*/')||t.startsWith('*'))return `<span class="tk-comment">${escHTML(line)}</span>`;
    if(t.startsWith('//'))return `<span class="tk-comment">${escHTML(line)}</span>`;            // SCSS 整行註解
    const ci=line.indexOf(' // ');                                                                // 行尾 SCSS 註解（如 layout 標註）→ 拆開，程式碼段照常高亮、註解段轉灰
    if(ci>=0)return hlCss(line.slice(0,ci))+`<span class="tk-comment">${escHTML(line.slice(ci))}</span>`;
    const dm=line.match(/^(\s*)([-\w]+)(\s*):(\s*)(.+?)(;?)\s*$/);    // 宣告 prop: value;
    if(dm&&!/[{}]/.test(dm[5])){ const val=escHTML(dm[5])
        .replace(/(--[\w-]+)/g,'<span class="tk-var">$1</span>')
        .replace(/(#[0-9a-fA-F]{3,8})\b/g,'<span class="tk-str">$1</span>');
      return `${dm[1]}<span class="tk-prop">${escHTML(dm[2])}</span><span class="tk-punct">:</span>${dm[4]}<span class="tk-val">${val}</span><span class="tk-punct">${dm[6]}</span>`; }
    return `<span class="tk-sel">${escHTML(line)}</span>`;            // 選擇器／大括號行
  }
  // 建立「程式碼區」面板（populate host）：HTML／CSS 分頁 + 展開/複製鈕（library mkBtn 原子）+ 行號 gutter + 高亮；回傳 { set(html), setCssProvider(fn), setTab(t) }
  // opts.title＝展開 modal 標題；opts.expandable=false＝不顯示展開鈕（modal 內部面板用，避免遞迴）
  function makeCodePanel(host,chipText,opts){
    opts=opts||{};
    const title=opts.title||((chipText||'').replace(/\s*·\s*HTML\s*$/i,''))||'程式碼';
    host.classList.add('live-code');host.innerHTML='';
    const head=ce('div','code-head');
    const tabs=ce('div','code-tabs seg');   // HTML／CSS 分頁：重用 .seg 分段控制
    const tabH=document.createElement('button');tabH.type='button';tabH.className='code-tab';tabH.textContent='HTML';tabH.setAttribute('aria-pressed','true');
    const tabC=document.createElement('button');tabC.type='button';tabC.className='code-tab';tabC.textContent='SCSS';tabC.setAttribute('aria-pressed','false');
    tabs.append(tabH,tabC);
    const actions=ce('div','code-actions');
    let exp=null;
    if(opts.expandable!==false){        // 展開鈕：icon-only，開大 modal 看程式碼（複用 mkBtn 原子）
      exp=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});exp.type='button';
      exp.classList.add('icon-only');exp.innerHTML=ICON_EXPAND;exp.title='展開檢視';exp.setAttribute('aria-label','展開檢視');
      exp.onclick=()=>openCodeModal({title:componentName(current)+'的程式碼',html:htmlRaw,cssProvider,active});   // 標題＝當前元件名＋的程式碼；傳當前 HTML＋CSS 產生器＋當前分頁
      actions.append(exp);
    }
    const copy=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});copy.type='button';copy.querySelector('span').textContent='複製';
    actions.append(copy);
    head.append(tabs,actions);
    const bodyEl=ce('div','code-body');const gutter=ce('div','code-gutter');const pre=ce('pre','code-pre');
    bodyEl.append(gutter,pre);
    const inner=ce('div','code-inner');inner.append(head,bodyEl);host.append(inner); // 包一層供水平版型絕對定位（高度不撐大版面）
    let htmlRaw='',cssRaw=null,cssProvider=null,active='html';   // cssRaw lazy：切到 CSS 分頁才產生並快取（各變體固定、不隨切換控制項改）
    const cur=()=>active==='css'?(cssRaw!=null?cssRaw:''):htmlRaw;
    function paint(){const raw=cur(),hl=active==='css'?hlCss:hlLine,lines=raw.split('\n');
      gutter.innerHTML=lines.map((_,i)=>`<span>${i+1}</span>`).join('');pre.innerHTML=lines.map(hl).join('\n');}
    function ensureCss(){if(cssRaw==null&&cssProvider){try{cssRaw=cssProvider();}catch(e){cssRaw='/* CSS 產生失敗 */';}}}
    function activate(t){active=t;tabH.setAttribute('aria-pressed',t==='html');tabC.setAttribute('aria-pressed',t==='css');if(t==='css')ensureCss();bodyEl.scrollTop=0;paint();}
    tabH.onclick=()=>activate('html');tabC.onclick=()=>activate('css');
    const mirrors=[];host.__cpMirror=m=>{mirrors.push(m);m.set(htmlRaw);if(cssProvider)m.setCssProvider(cssProvider);}; // BENTO-ALL:v1 bento 的 SCSS 卡：鏡像這個面板的 HTML／CSS 產生器
    copy.onclick=()=>{if(navigator.clipboard)navigator.clipboard.writeText(cur());const s=copy.querySelector('span');const o=s.textContent;swapText(s,'已複製 ✓');setTimeout(()=>swapText(s,o),1200);};
    return {
      set(r){htmlRaw=r;if(active==='html')paint();mirrors.forEach(m=>m.set(r));},                       // 相容舊呼叫：設 HTML（切換控制項時每次更新）
      setCssProvider(fn){cssProvider=fn;cssRaw=null;if(active==='css'){ensureCss();paint();}mirrors.forEach(m=>m.setCssProvider(fn));},  // 設 CSS 產生器（lazy，只在看 CSS 分頁時執行）
      setTab(t){activate(t==='css'?'css':'html');}                          // 外部指定分頁（展開 modal 沿用來源分頁）
    };
  }
  const prettyName=s=>String(s||'').split(/[-_\s]+/).filter(Boolean).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')||'程式碼'; // input→Input、product-card→Product Card
  // 元件顯示名稱：以當前頁 id 查 NAV（含中英，如「Product Card 商品卡」）；查不到退回 DIAL_SPECS.label 或字首正名
  function componentName(id){
    for(const g of NAV){const it=(g.items||[]).find(x=>x.id===id);if(it&&it.name)return it.name;}
    if(typeof DIAL_SPECS!=='undefined'&&DIAL_SPECS[id]&&DIAL_SPECS[id].label)return DIAL_SPECS[id].label;
    return prettyName(id);
  }
  // 一欄程式碼（行號＋高亮＋複製）：dual 版的單欄與 tab 內容共用
  function codeColumn(lang,raw,hl){
    const col=ce('div','code-col');col.dataset.lang=lang;
    const ch=ce('div','code-col-head');
    const lab=ce('span','col-lang');lab.textContent=lang==='css'?'SCSS':lang.toUpperCase();
    const copy=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});copy.type='button';copy.querySelector('span').textContent='複製';
    copy.onclick=()=>{if(navigator.clipboard)navigator.clipboard.writeText(raw);const s=copy.querySelector('span');const o=s.textContent;swapText(s,'已複製 ✓');setTimeout(()=>swapText(s,o),1200);};
    ch.append(lab,copy);
    const body=ce('div','code-body');const g=ce('div','code-gutter');const pre=ce('pre','code-pre');
    const lines=(raw||'').split('\n');g.innerHTML=lines.map((_,i)=>`<span>${i+1}</span>`).join('');pre.innerHTML=lines.map(hl).join('\n');
    body.append(g,pre);col.append(ch,body);return col;
  }
  // 雙欄程式碼：大網 HTML｜CSS 並排、小網用 tab 切換（≤767px）；複用 .live-code 的配色與 .code-body 樣式
  function buildDualCode(html,cssRaw,active){
    const wrap=ce('div','live-code code-dual');
    const tabs=ce('div','code-tabs code-dual-tabs seg');   // 只在小網顯示；重用 .seg 分段控制
    const tabH=document.createElement('button');tabH.type='button';tabH.className='code-tab';tabH.textContent='HTML';
    const tabC=document.createElement('button');tabC.type='button';tabC.className='code-tab';tabC.textContent='SCSS';
    tabs.append(tabH,tabC);
    const cols=ce('div','code-cols');
    const colH=codeColumn('html',html,hlLine);
    const colC=codeColumn('css',cssRaw,hlCss);
    cols.append(colH,colC);                              // 兩欄各自灰底盒、中間白色 margin（不放分隔線）
    wrap.append(tabs,cols);
    const showTab=t=>{const css=t==='css';tabH.setAttribute('aria-pressed',!css);tabC.setAttribute('aria-pressed',css);
      colH.classList.toggle('active',!css);colC.classList.toggle('active',css);};
    tabH.onclick=()=>showTab('html');tabC.onclick=()=>showTab('css');
    showTab(active==='css'?'css':'html');               // 小網初始分頁沿用來源
    return wrap;
  }
  // 展開檢視：用 library 大版 modal（mdl-larger 1224px）＋現成 mdlClose ×；內容為雙欄程式碼（大網並排／小網 tab）
  function openCodeModal(o){
    o=o||{};
    const overlay=ce('div','mdl-overlay mdl-fixed');
    const card=ce('div','mdl-card mdl-kind-modal mdl-larger mdl-code-modal');
    const mhead=ce('div','mdl-mhead');
    const ht=ce('div','mdl-mhead-txt');const t=ce('div','mdl-title');t.textContent=o.title||'程式碼';ht.appendChild(t);
    mhead.appendChild(ht);
    const x=mdlClose(false);mhead.appendChild(x);       // 複用 modal 的關閉 ×
    card.appendChild(mhead);
    const content=ce('div','mdl-content mdl-code-content');
    let cssRaw='';if(o.cssProvider){try{cssRaw=o.cssProvider();}catch(e){cssRaw='/* CSS 產生失敗 */';}}
    content.appendChild(buildDualCode(o.html||'',cssRaw,o.active));
    card.appendChild(content);
    overlay.appendChild(card);
    const prevOverflow=document.body.style.overflow;
    const close=()=>{overlay.remove();document.removeEventListener('keydown',onKey);document.body.style.overflow=prevOverflow;};
    const onKey=e=>{if(e.key==='Escape')close();};
    x.onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close();}); // × / 遮罩空白 / Esc 皆可關閉
    document.addEventListener('keydown',onKey);
    document.body.style.overflow='hidden';document.body.appendChild(overlay);
  }
  // 套用版型到 livewrap；水平時掛拖拉分隔線（預設 code 1/3、最小 200px、左欄也保留 200px）
  function applyLiveLayout(wrap,resizer){
    if(!wrap)return; const lay=liveLayoutPref();
    wrap.classList.remove('lay-v','lay-h');wrap.classList.add(lay==='v'?'lay-v':'lay-h');
    if(resizer&&!resizer.dataset.wired){resizer.dataset.wired='1';
      const onMove=e=>{const r=wrap.getBoundingClientRect(),cs=getComputedStyle(wrap);
        const padL=parseFloat(cs.paddingLeft)||0,padR=parseFloat(cs.paddingRight)||0,gap=parseFloat(cs.columnGap)||0;
        const inner=r.width-padL-padR,rightEdge=r.right-padR;
        let w=rightEdge-e.clientX;const max=Math.max(200,inner-200-8-gap*2);
        w=Math.max(200,Math.min(w,max));wrap.style.setProperty('--code-w',w+'px');};
      const onUp=()=>{document.removeEventListener('pointermove',onMove);document.removeEventListener('pointerup',onUp);resizer.classList.remove('dragging');document.body.style.userSelect='';};
      resizer.addEventListener('pointerdown',e=>{e.preventDefault();resizer.classList.add('dragging');document.body.style.userSelect='none';document.addEventListener('pointermove',onMove);document.addEventListener('pointerup',onUp);});
    }
  }

  /* ---- 共用：互動預覽與程式碼 控制面板（segmented 控制 + boolean 勾選 + 即時預覽）---- */
  function mountLive(host,cfg){
    const state=Object.assign({},cfg.initial||{});
    // 篩選器連動：cfg.gate=元件 id → 讀 DIAL_SPECS[id].axes（完整軸值）＋ CHOICE[id].active（目前勾選），
    // 讓「變數篩選器」沒勾的軸值，在下方實際操作 Live 的對應 seg 選項一起被 disable。
    const gid=cfg.gate; const gAxes=(gid&&DIAL_SPECS[gid])?DIAL_SPECS[gid].axes:null; const gActive=(gid&&CHOICE[gid])?CHOICE[gid].active:null;
    const wrap=ce('div','livewrap');
    const ctlRow=ce('div','ctl-row');
    const stage=ce('div','live-stage');
    let cp=null; // 程式碼面板參照（非摘要卡才建）
    const syncCode=()=>{const n=stage.firstElementChild;if(cp&&n)cp.set(liveMarkup(n));}; // 預覽內自行改 DOM（如點開關）後呼叫，程式碼區跟著同步、不重建節點（保留過渡動態）
    function rerender(){stage.innerHTML='';const n=cfg.render(state,syncCode);stage.appendChild(n);if(cp&&n&&n.nodeType===1)cp.set(liveMarkup(n));}
    const segRefs=[]; // 供篩選器連動時更新各 seg 選項 disabled
    (cfg.segs||[]).forEach(s=>{
      const c=ce('div','ctl');c.innerHTML=`<span class="lab">${s.label}</span>`;
      if(s.as==='select'||(s.as!=='seg'&&s.options.length>LIVE_SELECT_MAX)){ // BENTO-ALL:v1 選項太多 → library Dropdown（ddField），行為同 seg
        const dd=ddField('outline',{size:'s',options:s.options.map((o,i)=>({value:o,label:s.labels?s.labels[i]:o})),value:state[s.key],
          onChange:v=>{state[s.key]=v;sync(v);rerender();}});
        dd.classList.add('ctl-sel');const trg=dd.querySelector('.field.dd');if(trg)trg.setAttribute('aria-label',s.label);
        const opts=[...dd.querySelectorAll('.ddopt')];
        opts.forEach((el,i)=>{el.dataset.val=s.options[i];const go=el.onclick;el.onclick=()=>{if(el.disabled)return;go();};}); // 篩選器停用的選項不可選（滑鼠／Enter 都走 onclick）
        function sync(v){const val=dd.querySelector('.dd-body .val');opts.forEach((el,i)=>{const on=el.dataset.val===v;el.classList.toggle('sel',on);el.setAttribute('aria-selected',on?'true':'false');if(on&&val)val.textContent=el.textContent;});}
        c.appendChild(dd);ctlRow.appendChild(c);segRefs.push({key:s.key,btns:opts,sync});return;}
      const seg=ce('div','seg');const btns=[];
      s.options.forEach((o,i)=>{const b=document.createElement('button');b.textContent=s.labels?s.labels[i]:o;b.dataset.val=o;
        b.setAttribute('aria-pressed',state[s.key]===o);
        b.onclick=()=>{if(b.disabled)return;state[s.key]=o;[...seg.children].forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');rerender();};
        seg.appendChild(b);btns.push(b);});
      c.appendChild(seg);ctlRow.appendChild(c);segRefs.push({key:s.key,btns});});
    if((cfg.bools||[]).length){
      const c=ce('div','ctl');c.innerHTML=`<span class="lab">${cfg.boolLabel||'Content'}</span>`;
      const checks=ce('div','checks');
      cfg.bools.forEach(bo=>{const l=ce('label','chk');const i=document.createElement('input');i.type='checkbox';i.checked=!!state[bo.key];
        i.onchange=()=>{state[bo.key]=i.checked;rerender();};l.append(i,document.createTextNode(bo.label));checks.appendChild(l);});
      c.appendChild(checks);ctlRow.appendChild(c);}
    if(ctlRow.children.length)wrap.appendChild(ctlRow);
    wrap.appendChild(stage);
    const inSummary=!!host.closest('.sc-live,.sumcard'); // 摘要卡維持精簡：不加程式碼區與版型
    let resizer=null;
    if(!inSummary){
      resizer=ce('div','lay-resizer');resizer.title='拖曳調整程式碼寬度';wrap.appendChild(resizer);
      const codeEl=ce('div','live-code');cp=makeCodePanel(codeEl,cfg.codeLabel||((cfg.gate||'HTML')+' · HTML'));wrap.appendChild(codeEl);
      // CSS 分頁：用 cfg.render 列舉各軸（segs＋bools）變體撈出整顆元件的樣式
      const cssAxes=[...(cfg.segs||[]).map(s=>({key:s.key,options:s.options})),...(cfg.bools||[]).map(b=>({key:b.key,options:[true,false]}))];
      cp.setCssProvider(()=>componentCss(st=>cfg.render(Object.assign({},cfg.initial||{},st)),cssAxes));
    }
    if(cfg.free){if(cfg.note){const n=ce('p','live-note');n.innerHTML=cfg.note;wrap.appendChild(n);}
      const f=ce('div','live-free');cfg.free().forEach(nd=>f.appendChild(nd));wrap.appendChild(f);}
    host.appendChild(wrap);
    if(!inSummary)applyLiveLayout(wrap,resizer);
    // 依篩選器 active 停用未勾軸值選項；若目前選中的值被停用，改跳到第一個仍啟用值
    function syncActive(){ if(!gActive){rerender();return;}
      segRefs.forEach(({key,btns,sync})=>{ const set=gActive[key], full=gAxes&&gAxes[key]; if(!set||!full)return;
        let cur=state[key];
        if(full.includes(cur)&&!set.has(cur)){const first=btns.find(b=>full.includes(b.dataset.val)&&set.has(b.dataset.val));if(first)cur=first.dataset.val;}
        state[key]=cur;
        btns.forEach(b=>{const v=b.dataset.val, gated=full.includes(v), on=!gated||set.has(v);
          b.disabled=!on; b.classList.toggle('is-off',!on); b.setAttribute('aria-pressed',String(v===cur)); if(sync)b.setAttribute('aria-disabled',String(!on));});
        if(sync)sync(cur);
      });
      rerender();
    }
    if(gActive){ if(!LIVE_REFRESH.has(gActive))LIVE_REFRESH.set(gActive,[]); LIVE_REFRESH.get(gActive).push(syncActive); }
    syncActive();
  }

  /* ===== 各元件「實際操作 Live」共用 registry ===== 元件頁與「複雜度確認」頁共用同一份，改一處兩邊同步 */
  const LIVE={};
  const LIVE_REFRESH=new Map(); // 篩選器 active 物件 → 該頁 Live syncActive fns（換頁 clear）
  const LIVE_SELECT_MAX=6; // BENTO-ALL:v1 seg 選項超過這個數（或 seg 設 as:'select'）→ 改用 Dropdown；as:'seg' 強制維持分段
  LIVE.button=(host)=>mountLive(host,{
    initial:{variant:'solid',intent:'primary',size:'m',shape:'rect',lead:false,trail:false,disabled:false},
    segs:[{key:'variant',label:'Variant',options:AXES.variant},{key:'intent',label:'Intent',options:AXES.intent},{key:'size',label:'Size',options:AXES.size},{key:'shape',label:'Shape',options:['rect','circle']}],
    bools:[{key:'lead',label:'leading icon'},{key:'trail',label:'trailing icon'},{key:'iconOnly',label:'icon only'},{key:'disabled',label:'disabled'}],
    render:st=>mkBtn({variant:st.variant,intent:st.intent,size:st.size,shape:st.shape,lead:st.lead,trail:st.trail,iconOnly:st.iconOnly,disabled:st.disabled,isLive:true}),
    note:'↓ solid / soft / outline / text 快速對照',
    free:()=>['solid','soft','outline','text'].map(v=>mkBtn({variant:v,intent:'primary',size:'m',isLive:true}))
  });
  LIVE.input=(host)=>mountLive(host,{gate:'input',
    initial:{variant:'outline',size:'m',label:true,required:false,hint:false,lead:false,eye:false},
    segs:[{key:'variant',label:'Variant',options:['outline','filled']},{key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'label',label:'label'},{key:'required',label:'必填 *'},{key:'hint',label:'hint'},{key:'lead',label:'leading icon'},{key:'eye',label:'後綴 eye'}],
    render:st=>{
      const wrap=ce('div','fieldwrap');wrap.style.minWidth='300px';
      if(st.label){const fl=ce('span','fl');fl.innerHTML='電子郵件'+(st.required?' <span class="req">*</span>':'');wrap.appendChild(fl);}
      const f=ce('div',`field live-field v-${st.variant}`+(st.size!=='m'?' fsz-'+st.size:''));
      if(st.lead)f.insertAdjacentHTML('beforeend',ICON_SEARCH);
      const inp=document.createElement('input');inp.className='bare';inp.type=st.eye?'password':'text';inp.placeholder='點我輸入…';f.appendChild(inp);
      const clr=ce('span','fieldclear');clr.innerHTML=ICON_XCIRCLE;clr.style.display='none';
      clr.onmousedown=e=>e.preventDefault();
      clr.onclick=()=>{inp.value='';inp.focus();clr.style.display='none';};
      inp.addEventListener('input',()=>{clr.style.display=inp.value?'inline-flex':'none';});
      f.appendChild(clr);
      if(st.eye){const b=document.createElement('span');b.style.cssText='display:inline-flex;cursor:pointer;color:var(--muted);flex:0 0 auto;';b.innerHTML=ICON_EYE;
        b.onclick=()=>{const show=inp.type==='password';inp.type=show?'text':'password';swapIcon(b,show?ICON_EYE_SLASH:ICON_EYE);};
        f.appendChild(b);}
      wrap.appendChild(f);
      if(st.hint){const h=ce('span','fh');h.textContent='至少 8 碼';wrap.appendChild(h);}
      return wrap;
    },
    note:'↓ outline vs filled 快速對照（滑鼠移上去試 hover）',
    free:()=>{const mk=v=>{const f=ce('div',`field live-field v-${v}`);const i=document.createElement('input');i.className='bare';i.placeholder=v;i.style.minWidth='170px';f.appendChild(i);return f;};return [mk('outline'),mk('filled')];}
  });
  LIVE.dropdown=(host)=>mountLive(host,{gate:'dropdown',
    initial:{variant:'outline',type:'single',size:'m',label:true,required:false,hint:false,searchable:false},
    segs:[{key:'variant',label:'Variant',options:['outline','filled']},{key:'type',label:'Type',options:['single','multi'],labels:['單選','多選']},{key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'label',label:'label'},{key:'required',label:'必填 *'},{key:'hint',label:'hint'},{key:'searchable',label:'searchable'}],
    render:st=>{const wrap=ce('div','fieldwrap');wrap.style.minWidth='300px';
      if(st.label){const fl=ce('span','fl');fl.innerHTML='縣市'+(st.required?' <span class="req">*</span>':'');wrap.appendChild(fl);}
      wrap.appendChild(ddField(st.variant,{searchable:st.searchable,multi:st.type==='multi',size:st.size}));
      if(st.hint){const h=ce('span','fh');h.textContent=st.type==='multi'?'可複選多個縣市':'單選一個縣市';wrap.appendChild(h);}
      return wrap;}
  });
  LIVE.checkbox=(host)=>mountLive(host,{gate:'checkbox',
    initial:{size:'m',indeterminate:false,disabled:false},
    segs:[],
    bools:[{key:'indeterminate',label:'indeterminate'},{key:'disabled',label:'disabled'}],
    render:st=>{
      const row=ce('label','optrow');if(st.disabled)row.style.cursor='not-allowed';
      let checked=false,ind=st.indeterminate;
      const box=ce('div',`cbx sz-${st.size}${st.disabled?' st-disabled':''}${ind?' st-indeterminate':''}`);if(ind)box.innerHTML=ICON_MINUS;
      const lab=ce('span','oplab');lab.textContent='同意條款';
      if(!st.disabled)box.onclick=()=>{if(ind){ind=false;checked=true;}else checked=!checked;box.className='cbx sz-'+st.size+(checked?' st-checked':'');box.innerHTML=checked?ICON_CHECK:'';};
      row.append(box,lab);return row;
    }
  });
  LIVE.radio=(host)=>mountLive(host,{gate:'radio',
    initial:{size:'m',disabled:false},
    segs:[],
    bools:[{key:'disabled',label:'disabled'}],
    render:st=>{
      const g=ce('div');g.style.cssText='display:flex;gap:20px;flex-wrap:wrap;';const rows=[];
      ['標準','商務','頭等'].forEach((t,i)=>{const row=ce('label','optrow');if(st.disabled)row.style.cursor='not-allowed';
        const r=ce('div',`rdo sz-${st.size}${st.disabled?' st-disabled':''}${i===0?' st-checked':''}`);r.innerHTML='<span class="dot"></span>';
        const lab=ce('span','oplab');lab.textContent=t;
        if(!st.disabled)row.onclick=()=>{rows.forEach(x=>x.className='rdo sz-'+st.size);r.className='rdo sz-'+st.size+' st-checked';};
        row.append(r,lab);g.appendChild(row);rows.push(r);});
      return g;
    }
  });
  LIVE.tag=(host)=>mountLive(host,{gate:'tag',
    initial:{variant:'soft',corner:'round',intent:'brand',size:'s',icon:false,close:false},
    segs:[{key:'variant',label:'Variant',options:['solid','outline','soft']},{key:'size',label:'Size',options:['s','m','l']},{key:'corner',label:'Corner',options:['round','rect']},{key:'intent',label:'Intent',options:['brand','brand2','neutral','danger','success','warning','info']}],
    bools:[{key:'icon',label:'icon'},{key:'close',label:'removable ×'}],
    render:st=>{
      const t=ce('div',`tg v-${st.variant} c-${st.corner} i-${st.intent} st-default`+(st.size&&st.size!=='s'?' sz-'+st.size:''));
      t.innerHTML=(st.icon?ICON_SEARCH:'')+'<span>標籤</span>';
      if(st.close){const x=ce('span','x');x.innerHTML=ICON_CLOSE;x.onclick=e=>{e.stopPropagation();t.classList.remove('tg-in');t.classList.add('tg-out');setTimeout(()=>{t.classList.remove('tg-out');void t.offsetWidth;t.classList.add('tg-in');},900);};t.appendChild(x);}
      return t;
    }
  });
  LIVE.tab=(host)=>mountLive(host,{gate:'tab',
    initial:{variant:'line',size:'m',icon:false,count:false},
    segs:[{key:'variant',label:'Variant',options:['line','contained','soft','pill']},{key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'icon',label:'leading icon'},{key:'count',label:'count badge'}],
    render:st=>tabBarLive(st.variant,st)
  });

