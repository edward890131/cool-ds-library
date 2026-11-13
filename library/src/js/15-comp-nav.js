  /* ==================== menu ==================== */
/* ---- MENU 選單（builders 提升頂層，頁面與 summary Live 共用）---- */
  const MN_ICONS=[ICON_HOUSE,ICON_LIST,ICON_GEAR,ICON_PENCIL];
  function mnItem(state,size,o){
    o=o||{};
    const it=ce('div','mn-item mn-item--'+size);
    if(state==='hover')it.classList.add('mn-item--hover');
    if(state==='active')it.classList.add('mn-item--active');
    if(state==='focus')it.classList.add('mn-item--focus');
    if(state==='disabled')it.classList.add('mn-item--disabled');
    if(o.icon){const ic=ce('span','mn-ico');ic.innerHTML=(typeof o.icon==='string'?o.icon:ICON_HOUSE);it.appendChild(ic);}
    const lb=ce('span','mn-label');lb.textContent=o.label||'選單項';it.appendChild(lb);
    const ind=ce('span','mn-ind');it.appendChild(ind);
    return it;
  }
  /* MENU-TREE:v1（2026-11-10）垂直側欄的三個 boolean property：
     icon 左側圖示／groups 分類小標題（o.sections=[{title,items}]）／nested 內層列表展開收合（item.children）。
     activeIndex 只算「可點的葉節點」；含當前頁的父層自動展開、文字轉 ink。水平 navbar 不吃 groups／nested。 */
  function mnBar(variant,size,o){
    o=o||{};const V=variant==='vertical';
    const bar=ce('div','mn-bar mn-bar--'+variant+' mn-bar--sz-'+size+(o.icon?' mn-bar--icon':''));
    bar.setAttribute('role','navigation');if(o.label)bar.setAttribute('aria-label',o.label);
    const secs=o.sections||[{items:o.items||[]}];
    const cur=(o.activeIndex==null?0:o.activeIndex);const nodes=[],parents=[];let li=0,ii=0;
    const live=o.clickable!==false;
    let setAct=n=>{nodes.forEach(x=>{const on=x===n;x.classList.toggle('mn-item--active',on);if(on)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current');});
      parents.forEach(p=>p.classList.toggle('is-in',!!(n&&p._sub.contains(n))));};
    const keys=(n,fn)=>{n.tabIndex=0;n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});};
    const icOf=it=>{if(!o.icon)return false;const ic=(typeof it==='object'&&it.icon)||MN_ICONS[ii%MN_ICONS.length];ii++;return ic;};
    const leaf=(it,sub)=>{const label=typeof it==='string'?it:it.label;const n=mnItem('default',size,{label,icon:sub?false:icOf(it)});
      if(sub)n.classList.add('mn-item--sub');if(typeof it==='object'&&it.key)n.dataset.key=it.key;
      if(typeof it==='object'&&it.disabled)n.classList.add('mn-item--disabled');
      if(li===cur){n.classList.add('mn-item--active');n.setAttribute('aria-current','page');}li++;
      if(live){const go=()=>{if(!n.classList.contains('mn-item--disabled'))setAct(n);};   /* 呼叫時才取 setAct，水平選單換成滑動版也吃得到 */n.addEventListener('click',go);if(o.focusable!==false)keys(n,go);}
      nodes.push(n);return n;};
    const branch=(it,host)=>{const p=mnItem('default',size,{label:it.label,icon:icOf(it)});p.classList.add('mn-item--parent');
      const car=ce('span','mn-car');car.innerHTML=PI('chevron-down');p.insertBefore(car,p.querySelector('.mn-ind'));
      const sub=ce('div','mn-sub');const inner=ce('div','mn-sub-in');sub.appendChild(inner);p._sub=sub;
      it.children.forEach(c=>inner.appendChild(leaf(c,true)));
      const set=open=>{sub.classList.toggle('is-open',open);p.setAttribute('aria-expanded',String(open));inner.inert=!open;};
      p.setAttribute('role','button');set(!!it.open||[...inner.children].some(c=>c.classList.contains('mn-item--active')));
      p.classList.toggle('is-in',[...inner.children].some(c=>c.classList.contains('mn-item--active')));
      const tg=()=>set(!sub.classList.contains('is-open'));p.addEventListener('click',tg);keys(p,tg);
      parents.push(p);host.append(p,sub);};
    secs.forEach(sec=>{let host=bar;
      if(V&&sec.title!=null){const g=ce('div','mn-group');const t=ce('div','mn-gt');t.textContent=sec.title;g.appendChild(t);bar.appendChild(g);host=g;}
      sec.items.forEach(it=>{if(V&&typeof it==='object'&&it.children&&it.children.length)branch(it,host);else host.appendChild(leaf(it,false));});});
    if(live){ /* Motion v1：整條選單只有一塊 hover 底色，跟著滑鼠滑到目前項；從外面移入時直接定位只淡入（巢狀／分組以 rect 定位） */
      const hl=ce('span','mn-hl');bar.prepend(hl);bar.classList.add('has-hl');let inside=false;
      [...nodes,...parents].forEach(it=>it.addEventListener('mouseenter',()=>{hl.classList.toggle('snap',!inside);inside=true;
        const br=bar.getBoundingClientRect(),r=it.getBoundingClientRect(),k=br.width?bar.offsetWidth/br.width:1;   /* 外層被縮放（範本 tplFit）時換回元件座標 */
        hl.style.width=it.offsetWidth+'px';hl.style.height=it.offsetHeight+'px';hl.style.transform=`translate(${((r.left-br.left)*k-bar.clientLeft).toFixed(1)}px,${((r.top-br.top)*k-bar.clientTop).toFixed(1)}px)`;
        hl.style.opacity=it.classList.contains('mn-item--disabled')?'0':'1';}));
      bar.addEventListener('mouseleave',()=>{inside=false;hl.style.opacity='0';});
    }
    if(live&&!V){ /* MENU-SLIDE:v1 水平選單：選中底線改成一條會滑動的 .mn-sind，換選中項時滑過去（同 Tab line 的滑動曲線） */
      const si=ce('span','mn-sind');bar.appendChild(si);bar.classList.add('has-sind');
      let ready=!(document.fonts&&document.fonts.ready);
      const place=anim=>{const a=nodes.find(x=>x.classList.contains('mn-item--active'));if(!a||a.offsetParent===null){si.style.opacity='0';return;}
        const ind=a.querySelector('.mn-ind'),cs=ind?getComputedStyle(ind):null,inset=cs?parseFloat(cs.left)||0:10;   /* 沿用原本 .mn-ind 的左右內縮與高度 */
        if(!anim)si.style.transition='none';
        si.style.width=Math.max(0,a.offsetWidth-inset*2)+'px';si.style.transform=`translate(${a.offsetLeft+inset}px,${a.offsetTop+a.offsetHeight-2}px)`;si.style.opacity=ready?'1':'0';
        if(!anim){void si.offsetWidth;si.style.transition='';}};
      const base=setAct;setAct=n=>{base(n);place(true);};
      requestAnimationFrame(()=>place(false));
      if(!ready)document.fonts.ready.then(()=>{ready=true;place(false);}).catch(()=>{});
      let shown=false;   /* 第一次定位用 snap；之後寬度變動（選中字變粗、視窗縮放）改用滑動補位，才不會打斷正在滑的底線 */
      if(window.ResizeObserver)new ResizeObserver(()=>{place(shown);shown=true;}).observe(bar);
    }
    bar._nodes=nodes;bar._setActive=setAct;
    return bar;
  }
  /* 示範資料：groups 關＝一層清單；nested 關＝把子項拿掉、父層變一般項 */
  function mnDemoSections(st){const V=st.variant==='vertical';
    const ord={label:'訂單',icon:ICON_LIST,children:['全部訂單','待出貨','退換貨']};
    const A=['總覽',(V&&st.nested)?ord:'訂單'],B=['顧客','設定'];
    return (V&&st.groups)?[{title:'營運',items:A},{title:'管理',items:B}]:[{items:A.concat(B)}];}
  LIVE.menu=(host)=>mountLive(host,{gate:'menu',
    initial:{variant:'vertical',size:'m',icon:true,groups:true,nested:true},
    segs:[{key:'variant',label:'Variant',options:['horizontal','vertical'],labels:['水平','垂直']},
          {key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'icon',label:'icon 左側圖示'},{key:'groups',label:'groups 分類小標題'},{key:'nested',label:'nested 內層展開收合'}],
    boolLabel:'Feature',
    render:(st,sync)=>{
      if(sync)requestAnimationFrame(()=>{const root=document.getElementById('view')||host;   /* 分類／巢狀只有垂直側欄有：水平時藏起來 */
        root.querySelectorAll('.bento-ctl label.chk,.livewrap label.chk').forEach(l=>{if(/^(groups|nested) /.test(l.textContent.trim()))l.style.display=st.variant==='vertical'?'':'none';});});
      const box=ce('div','mn-live-box');box.appendChild(mnBar(st.variant,st.size,{sections:mnDemoSections(st),activeIndex:1,icon:st.icon,label:'主選單'}));return box;},
    note:'menu 是常駐容器；點項目即切換 active（aria-current=page 隨之移動），實際換頁行為由 app router 處理。垂直側欄可加分類小標題與可展開的內層列表（點父層或 Enter 展開收合，含當前頁的父層預設展開）。'
  });
  function buildMenu(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Menu',title:'Menu 選單',
      lede:'常駐式導航容器：<b>horizontal navbar</b> 橫向排列、<b>vertical sidebar</b> 直向排列，內含多個導航項；<b>active</b> 代表目前所在頁面（aria-current=page）。跟浮出動作的 action-menu、同層切換的 tab 不同。',
      specRows:[['axes','<code>variant × state × size</code>'],['formula','<code>2 × 5 × 3 = 30</code>'],['token-policy','<code>semantic.*.menu.*</code>'],['features','icon / groups / nested / active-indicator']]});
    const STN={default:['預設','default'],hover:['滑過','hover'],active:['當前頁','active'],disabled:['停用','disabled'],focus:['聚焦','focus']};
    const SZN={s:['小','s'],m:['標準','m'],l:['大','l']};
    const LBL={default:'總覽',hover:'訂單',active:'顧客',disabled:'設定',focus:'報表'};
    const axes=DIAL_SPECS.menu.axes, zh=DIAL_SPECS.menu.zh, active=CHOICE.menu.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const sts=axes.state.filter(v=>active.state.has(v));
      const szs=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'menu · item',name:'State × Size（單一導航項的 5 狀態 × 3 尺寸）',
        rows:sts,cols:szs,
        rowLab:s=>labHTML(STN[s][0],STN[s][1]),
        colLab:z=>labHTML(SZN[z][0]+'尺寸',SZN[z][1]),
        cell:(s,z)=>mnItem(s,z,{label:LBL[s],icon:false}),mincol:140})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','列＝五種狀態、欄＝三級尺寸；active 帶 --i-primary 文字與指示線，hover 為 --panel-2 底，focus 顯示 2px 焦點框，disabled 淡化。');
    p=panelsIn(sec);renderM();
    const os=section(body,'Orientation 方向','左：水平 navbar（頂部導航，active 底部 2px 指示線）；右：垂直 sidebar（側邊導航，active 左側指示條、各項帶 icon）。');
    const orow=ce('div','mn-orient');
    const c1=ce('div','mn-ocol');
    const cap1=ce('div','mn-ocap');cap1.innerHTML='<b>horizontal navbar</b> · 水平';
    c1.append(cap1,mnBar('horizontal','m',{items:['首頁','產品','定價','關於'],activeIndex:0}));
    const c2=ce('div','mn-ocol');
    const cap2=ce('div','mn-ocap');cap2.innerHTML='<b>vertical sidebar</b> · 垂直';
    c2.append(cap2,mnBar('vertical','m',{items:['總覽','訂單','顧客','設定'],activeIndex:1,icon:true}));
    orow.append(c1,c2);os.appendChild(orow);
    const ss=section(body,'Sidebar 結構','垂直側欄的三個開關（＝Figma boolean property）：<b>groups</b> 分類小標題把項目分組；<b>nested</b> 父層帶箭頭，點擊展開收合內層列表，含當前頁的父層預設展開；<b>icon</b> 關掉時只剩文字，內層縮排跟著對齊。');
    const srow=ce('div','mn-orient');
    [['groups · 分類小標題',{variant:'vertical',groups:true,nested:false},true],['nested · 內層展開收合',{variant:'vertical',groups:false,nested:true},true],['groups ＋ nested · 無 icon',{variant:'vertical',groups:true,nested:true},false]].forEach(([cap,st,ic])=>{
      const col=ce('div','mn-ocol');const c=ce('div','mn-ocap');c.innerHTML='<b>'+cap.split(' · ')[0]+'</b> · '+cap.split(' · ')[1];
      col.append(c,mnBar('vertical','m',{sections:mnDemoSections(st),activeIndex:st.nested?1:1,icon:ic}));srow.appendChild(col);});
    ss.appendChild(srow);
    const sl=section(body,'互動預覽與程式碼','切 variant（水平／垂直）、尺寸，勾 icon／groups／nested；點任一項即切換 active（aria-current=page 隨之移動），點父層展開收合。');
    LIVE.menu(sl);
  }

  /* ==================== action-menu ==================== */
/* ---- ACTION MENU 動作選單（builders 提升頂層，頁面與 summary Live 共用）---- */
  const AM_IC_COPY=PI('copy');
  const AM_IC_SHARE=PI('forward');

  /* 單一動作列：state = hover / focused / disabled；danger 為刪除類危險動作 */
  function amItem(label,o){o=o||{};
    const it=ce('div','am-item'+(o.state?' st-'+o.state:'')+(o.danger?' is-danger':''));
    let h=''; if(o.icon)h+=o.icon; h+=`<span class="am-lb">${label}</span>`;
    it.innerHTML=h; return it;
  }
  /* 浮出面板：variant 控制是否帶 icon / 分隔線；size 控制 min-width */
  function amPanel(variant,size,o){
    const items=(o&&o.items)||[];
    const p=ce('div','am-panel sz-'+size);
    items.forEach(it=>{
      if(variant==='with-divider'&&it.divBefore)p.appendChild(ce('div','am-divider'));
      const icon=(variant==='with-icon')?it.icon:null;
      p.appendChild(amItem(it.label,{icon,state:it.state,danger:it.danger}));
    });
    return p;
  }
  /* 標準動作組：編輯／複製／分享／刪除(danger)。mode='matrix' 第二項 hover；mode='live' 第一項 focused */
  function amItems(mode){
    const base=[
      {label:'編輯',icon:ICON_PENCIL},
      {label:'複製',icon:AM_IC_COPY},
      {label:'分享',icon:AM_IC_SHARE},
      {label:'刪除',icon:ICON_CLOSE,danger:true,divBefore:true},
    ];
    if(mode==='matrix')base[1].state='hover';
    // live 模式全部 default（不預設 focused），讓使用者用滑鼠 hover 實際看效果
    return base;
  }

  LIVE['action-menu']=(host)=>mountLive(host,{gate:'action-menu',
    initial:{variant:'with-icon',size:'m',open:true},
    segs:[
      {key:'variant',label:'Variant',options:['default','with-icon','with-divider'],labels:['純文字','帶圖示','含分隔線']},
      {key:'size',label:'Size',options:['s','m','l']},
    ],
    bools:[{key:'open',label:'open 展開'}],
    boolLabel:'State',
    render:(st,syncCode)=>{
      const wrap=ce('div','am-live-wrap');
      const trig=ce('button','btn v-solid i-secondary sz-m live am-trig'+(st.open?' is-open':''));
      trig.innerHTML=`<span>動作</span><span class="am-tcaret">${ICON_CARET}</span>`;
      wrap.appendChild(trig);
      const panel=amPanel(st.variant,st.size,{items:amItems('live')});panel.classList.add('am-anim');wrap.appendChild(panel); // 常駐掛載，開合靠 class（退場才有動畫）
      function sync(){ panel.classList.toggle('is-open',!!st.open); trig.classList.toggle('is-open',!!st.open); }
      trig.onclick=()=>{st.open=!st.open;sync();if(syncCode)syncCode();};
      sync(); return wrap;
    },
    note:'點「動作 ▾」切換展開／收合；切 Variant 看純文字／帶圖示／含分隔線，切 Size 看面板寬度。展開時第一項自動聚焦。'
  });

  function buildActionMenu(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Action Menu',title:'Action Menu 動作選單',
      lede:'由 trigger（按鈕／右鍵）觸發浮出的<b>動作清單</b>：每一項代表一個要<b>執行的動作</b>（編輯／複製／刪除…），與 dropdown（選值）、menu（常駐導航）本質不同。三種 variant（<b>純文字 / 帶圖示 / 含分隔線</b>）× 五狀態 × 三尺寸。',
      specRows:[['axes','<code>variant × state × size</code>'],['formula','<code>3 × 5 × 3 = 45</code>'],['token-policy','<code>semantic.*.menu.*</code>'],['features','icon / divider / danger-item']]});
    const axes=DIAL_SPECS['action-menu'].axes, zh=DIAL_SPECS['action-menu'].zh, active=CHOICE['action-menu'].active; // 接中央 store
    const VN={default:['純文字','default'],'with-icon':['帶圖示','with-icon'],'with-divider':['含分隔線','with-divider']};
    const SZN={s:['小','s'],m:['標準','m'],l:['大','l']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'state · open',name:'Variant × Size（展開面板；第二項示意 hover、刪除為 danger）',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(SZN[s][0]+'尺寸',SZN[s][1]),
        cell:(v,s)=>amPanel(v,s,{items:amItems('matrix')}),mincol:180})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','列＝三種 variant、欄＝三級尺寸；每格為展開狀態的動作面板（state 軸以「open 展開」呈現）。');
    p=panelsIn(sec);renderM();
    const is=section(body,'Item States 動作列狀態','單一動作列的五種狀態：預設、滑過、聚焦（open 時第一項）、停用、危險。');
    const rd=ce('div','row-demo');rd.style.marginBottom='4px';
    [['default 預設',()=>amItem('編輯',{icon:ICON_PENCIL})],
     ['hover 滑過',()=>amItem('複製',{icon:AM_IC_COPY,state:'hover'})],
     ['focused 聚焦',()=>amItem('分享',{icon:AM_IC_SHARE,state:'focused'})],
     ['disabled 停用',()=>amItem('封存',{icon:AM_IC_COPY,state:'disabled'})],
     ['danger 危險',()=>amItem('刪除',{icon:ICON_CLOSE,danger:true})]
    ].forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    is.appendChild(rd);
    const sl=section(body,'互動預覽與程式碼','點 trigger 切換展開／收合、切 variant 與 size；展開時第一項自動聚焦。');
    LIVE['action-menu'](sl);
  }

  /* ==================== breadcrumb ==================== */
/* ---- BREADCRUMB 麵包屑（builders 提升頂層，頁面與 Live 共用）---- */
  const bcChevron=PI('chevron-right');
  function bcSep(kind){
    const s=ce('span','bc-sep');
    if(kind==='chevron')s.innerHTML=bcChevron;        // › 箭頭
    else if(kind==='slash')s.textContent='/';          // 斜線
    else s.textContent='→';                            // 箭頭
    return s;
  }
  function bcItem(label,o){
    o=o||{};
    const cur=!!o.current;
    const el=ce('span','bc-item'+(cur?' bc-current':(o.state==='hover'?' bc-hover':'')));
    el.textContent=label;
    if(cur)el.setAttribute('aria-current','page');     // 當前層不可點、標記 aria-current
    return el;
  }
  function bcTrail(items,o){
    o=o||{};
    const sep=o.sep||'chevron';
    const wrap=ce('div','bc-trail');
    let seq;
    if(o.collapsed && items.length>3){                 // 省略中段：保留首＋末兩層
      seq=[{label:items[0]},{ellip:true},{label:items[items.length-2]},{label:items[items.length-1],current:true}];
    }else{
      seq=items.map((lb,i)=>({label:lb,current:i===items.length-1})); // 末項自動 current
    }
    seq.forEach((node,i)=>{
      if(i>0)wrap.appendChild(bcSep(sep));
      if(node.ellip){const e=ce(o.expandable?'button':'span','bc-ellip');e.textContent='…';
        if(o.expandable){e.type='button';e.setAttribute('aria-label','展開完整路徑');e.onclick=()=>{ // Motion v1：中段寬度平滑撐開、項目依序淡入
          const rv=ce('span','bc-reveal');const inner=ce('span','bc-reveal-in');
          items.slice(1,items.length-2).forEach((lb,k)=>{if(k>0)inner.appendChild(bcSep(sep));inner.appendChild(bcItem(lb,{}));});
          rv.appendChild(inner);e.replaceWith(rv);requestAnimationFrame(()=>requestAnimationFrame(()=>rv.classList.add('is-open')));if(o.onChange)o.onChange();};}
        wrap.appendChild(e);}
      else wrap.appendChild(bcItem(node.label,{current:node.current}));
    });
    return wrap;
  }
  LIVE.breadcrumb=(host)=>mountLive(host,{gate:'breadcrumb',
    initial:{separator:'chevron',depth:'5',collapsed:false},
    segs:[
      {key:'separator',label:'Separator',options:['chevron','slash','arrow'],labels:['› 箭頭','/ 斜線','→ 箭頭']},
      {key:'depth',label:'Depth',options:['3','5'],labels:['3 層','5 層']}
    ],
    bools:[{key:'collapsed',label:'collapsed 省略中段'}],
    boolLabel:'Feature',
    render:(st,syncCode)=>{
      const items3=['首頁','類別','某商品'];
      const items5=['首頁','產品','類別','子類別','某商品'];
      const box=ce('div','bc-live-box');
      box.appendChild(bcTrail(st.depth==='5'?items5:items3,{sep:st.separator,collapsed:st.collapsed,expandable:true,onChange:()=>setTimeout(()=>syncCode&&syncCode(),400)}));
      return box;
    },
    note:'最後一層為 current（<b>aria-current=page</b>、粗體、不可點）；勾 collapsed 會把中段收成 …，僅保留首＋末兩層。'
  });
  function buildBreadcrumb(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Breadcrumb',title:'Breadcrumb 麵包屑',
      lede:'顯示目前頁面在<b>階層結構</b>中的路徑導航；各層以分隔符相接，最後一項為 <b>current</b>（<code>aria-current=page</code>、粗體、不可點）。<br><span style="color:var(--faint)">註：L0 原生僅定義 <b>state</b>（default／hover／current），<b>尚未定義 breadcrumb 的 variant／size</b>。下方轉盤的「分隔符」軸為<b>陳列頁補充</b>，屬 gallery 端擴充、非 L0 規範。</span>',
      specRows:[['axes','<code>separator（gallery 擴充）</code>'],['state','<code>default · hover · current</code>'],['token-policy','<code>semantic.*.breadcrumb.*</code>'],['features','collapsed 中段省略 / wrap 換行']]});
    const axes=DIAL_SPECS.breadcrumb.axes, zh=DIAL_SPECS.breadcrumb.zh, active=CHOICE.breadcrumb.active; // 接中央 store
    const SEPN={chevron:['箭頭','chevron ›'],slash:['斜線','slash /'],arrow:['箭頭','arrow →']};
    const MODEN={std:['標準','standard'],collapse:['省略中段','collapsed']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const ss=axes.separator.filter(v=>active.separator.has(v));
      p.appendChild(matrixPanel({badge:'gallery · separator',name:'Separator × 展開模式',
        rows:ss,cols:['std','collapse'],
        rowLab:sp=>labHTML(SEPN[sp][0],SEPN[sp][1]),
        colLab:m=>labHTML(MODEN[m][0],MODEN[m][1]),
        cell:(sp,m)=>bcTrail(['首頁','產品','類別','某商品'],{sep:sp,collapsed:m==='collapse'}),
        mincol:200})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sts=section(body,'State 狀態','麵包屑單項的三種狀態：一般連結、滑過（hover）、當前層（current，不可點粗體）。');
    const rd=ce('div','row-demo');
    [['default link 一般連結',()=>bcItem('產品',{state:'default'})],
     ['hover link 滑過',()=>bcItem('產品',{state:'hover'})],
     ['current 當前層',()=>bcItem('某商品',{current:true})]
    ].forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    sts.appendChild(rd);
    const sec=section(body,'Separator × 展開模式矩陣','列＝三種分隔符、欄＝標準／省略中段；每列為一條完整麵包屑（末項自動 current）。');
    p=panelsIn(sec);renderM();
    const sl=section(body,'互動預覽與程式碼','切換分隔符與層數（3／5 層）、勾選 collapsed 省略中段，即時預覽整條麵包屑。');
    LIVE.breadcrumb(sl);
  }

  /* ==================== pagination ==================== */
/* ---- PAGINATION 分頁器（builders 提升頂層，頁面與 summary Live 共用）---- */
  const pgArrowL=PI('chevron-left');
  const pgArrowR=PI('chevron-right');
  // 單顆頁碼／箭頭方鈕：state 控外觀、size 控邊長、current=當前頁高亮、arrow=left/right 放箭頭
  function pgBtn(state,size,o){
    const opt=o||{};
    const b=document.createElement('button');
    b.className='pg-btn pg-sz-'+size+' pg-st-'+state+(opt.current?' pg-cur':'')+(opt.arrow?' pg-arw':'');
    if(state==='disabled')b.disabled=true;
    if(opt.arrow==='left')b.innerHTML=pgArrowL;
    else if(opt.arrow==='right')b.innerHTML=pgArrowR;
    else b.textContent=opt.label;
    return b;
  }
  // 完整分頁器：numbered=數字頁碼＋雙邊箭頭（gap>1 才插省略號）；prev-next=前後翻頁＋頁次資訊
  function pgBar(variant,size,o){
    const opt=o||{},total=opt.total,current=opt.current;
    const bar=ce('div','pg-bar pg-bar-'+size);
    if(variant==='prev-next'){
      const prev=pgBtn(current<=1?'disabled':'default',size,{arrow:'left'});
      const info=ce('span','pg-info');info.textContent='第 '+current+' / '+total+' 頁';
      const next=pgBtn(current>=total?'disabled':'default',size,{arrow:'right'});
      if(opt.onNav){if(current>1)prev.onclick=()=>opt.onNav(current-1);if(current<total)next.onclick=()=>opt.onNav(current+1);}
      bar.append(prev,info,next);return bar;
    }
    // numbered：‹ 1 … (c-1)[c](c+1) … total ›
    const prev=pgBtn(current<=1?'disabled':'default',size,{arrow:'left'});
    if(opt.onNav&&current>1)prev.onclick=()=>opt.onNav(current-1);
    bar.appendChild(prev);
    const set=[]; [1,total,current-1,current,current+1].forEach(n=>{if(n>=1&&n<=total&&set.indexOf(n)<0)set.push(n);});
    set.sort((a,b)=>a-b);
    let last=0;
    set.forEach(n=>{
      if(last&&n-last>1){const e=ce('span','pg-ellip');e.textContent='…';bar.appendChild(e);}
      const nb=pgBtn(n===current?'active':'default',size,{label:n,current:n===current});
      if(opt.onNav&&n!==current)nb.onclick=()=>opt.onNav(n);
      bar.appendChild(nb);last=n;
    });
    const next=pgBtn(current>=total?'disabled':'default',size,{arrow:'right'});
    if(opt.onNav&&current<total)next.onclick=()=>opt.onNav(current+1);
    bar.appendChild(next);return bar;
  }
  LIVE.pagination=(host)=>{
    let cur=3; const total=10;                          // 當前頁次以 closure 保存，切 variant／size 不重置
    return mountLive(host,{gate:'pagination',
      initial:{variant:'numbered',size:'m'},
      segs:[{key:'variant',label:'Variant',options:['numbered','prev-next'],labels:['數字','前後']},
            {key:'size',label:'Size',options:['s','m','l']}],
      render:st=>{
        const box=ce('div','pg-live-box');
        function draw(){box.innerHTML='';box.appendChild(pgBar(st.variant,st.size,{total,current:cur,onNav:n=>{cur=Math.max(1,Math.min(total,n));draw();}}));}
        draw();return box;                              // 內部點擊改 cur 後只重繪自身，達成真實翻頁
      },
      note:'數字頁碼點頁碼或箭頭會真的移動當前頁；切 variant／size 後沿用目前頁次。'
    });
  };
  function buildPagination(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Pagination',title:'Pagination 分頁器',
      lede:'翻頁控制。兩種 <b>variant</b>：<b>numbered</b>（數字頁碼＋雙邊箭頭，超過門檻以 … 省略）與 <b>prev-next</b>（純前後翻頁＋頁次資訊）。狀態涵蓋 <b>default／hover／active（當前頁）／disabled</b>，尺寸 <b>s／m／l 三級</b>（2026 已移除 focus）。',
      specRows:[['axes','<code>variant × state × size</code>'],['formula','<code>2 × 4 × 3 = 24</code>'],['token-policy','<code>semantic.*.pagination.*</code>'],['features','ellipsis / prev-next']]});
    const axes=DIAL_SPECS.pagination.axes, zh=DIAL_SPECS.pagination.zh, active=CHOICE.pagination.active; // 接中央 store
    const STN={default:['預設','default'],hover:['滑過','hover'],active:['當前頁','active'],disabled:['停用','disabled']};
    const SZN={s:['小','s'],m:['標準','m'],l:['大','l']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const sts=axes.state.filter(v=>active.state.has(v));
      const szs=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'page button',name:'State × Size（單顆頁碼方鈕）',
        rows:sts,cols:szs,
        rowLab:st=>labHTML(STN[st][0],STN[st][1]),
        colLab:sz=>labHTML(SZN[sz][0]+'尺寸',SZN[sz][1]),
        cell:(st,sz)=>pgBtn(st,sz,{label:3,current:st==='active'}),mincol:120})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','列＝四種狀態、欄＝三級尺寸；每格為單顆頁碼方鈕。當前頁（active）以主色填滿、停用降透明且不可點。');
    p=panelsIn(sec);renderM();
    const vs=section(body,'Variant 兩種風格','numbered＝數字頁碼＋雙邊箭頭，中段以 … 省略；prev-next＝純前後翻頁，首尾頁對應箭頭停用。');
    const rd=ce('div','row-demo');rd.style.marginBottom='4px';
    [['numbered 數字頁碼（total 10 · current 3）',()=>pgBar('numbered','m',{total:10,current:3})],
     ['prev-next 前後翻頁（total 10 · current 3）',()=>pgBar('prev-next','m',{total:10,current:3})]
    ].forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    vs.appendChild(rd);
    const sl=section(body,'互動預覽與程式碼','切 variant／尺寸；數字頁碼點頁碼或箭頭會真的翻頁，前後翻頁到首尾頁時箭頭自動停用。');
    LIVE.pagination(sl);
  }


  /* ==================== icon ==================== */
/* ---- ICON 圖示（PulsoIcon set；builders 提升頂層，頁面與 Live 共用）---- */
  const IC_HOUSE=PI('house');
  const IC_DASHBOARD=PI('gauge');
  const IC_SETTINGS=PI('settings');
  const IC_USER=PI('user');
  const IC_USERS=PI('users');
  const IC_BELL=PI('bell');
  const IC_SEARCH=PI('search');
  const IC_CALENDAR=PI('calendar');
  const IC_CLOCK=PI('clock');
  const IC_CHART_BAR=PI('chart-column');
  const IC_TRENDING=PI('trending-up');
  const IC_PIE=PI('chart-pie');
  const IC_FOLDER=PI('folder');
  const IC_FILE=PI('file');
  const IC_MAIL=PI('mail');
  const IC_DOWNLOAD=PI('download');
  const IC_UPLOAD=PI('upload');
  const IC_TRASH=PI('trash');
  const IC_EDIT=PI('pencil');
  const IC_PLUS=PI('plus');
  const IC_CHECK=PI('check');
  const IC_CLOSE=PI('x');
  const IC_CARET_DOWN=PI('chevron-down');
  const IC_ARROW_RIGHT=PI('arrow-right');
  const IC_HEART=PI('heart');
  const IC_STAR=PI('star');
  const IC_EYE=PI('eye');
  const IC_TAG=PI('tag');
  const IC_FILTER=PI('funnel');
  const IC_SLIDERS=PI('sliders-horizontal');
  const IC_CARD=PI('credit-card');
  const IC_MONEY=PI('dollar-sign');
  const IC_CART=PI('shopping-cart');
  const IC_BOOKMARK=PI('bookmark');
  const IC_CHAT=PI('message-circle');
  const IC_GIFT=PI('gift');
  const IC_LOCATION=PI('map-pin');
  const IC_LOGOUT=PI('log-out');
  /* 擴充：旅遊／生活／工作／購物／社群 常見產品功能 icon（PulsoIcon ）*/
  const IC_AIRPLANE=PI('plane');
  const IC_SUITCASE=PI('luggage');
  const IC_MAP=PI('map');
  const IC_GLOBE=PI('globe');
  const IC_BED=PI('bed');
  const IC_CAMERA=PI('camera');
  const IC_COFFEE=PI('coffee');
  const IC_MOON=PI('moon');
  const IC_SUN=PI('sun');
  const IC_MUSIC=PI('music-note');
  const IC_FOOD=PI('utensils');
  const IC_BRIEFCASE=PI('briefcase');
  const IC_NOTE=PI('square-pen');
  const IC_PAPERCLIP=PI('paperclip');
  const IC_SEND=PI('send');
  const IC_BAG=PI('shopping-bag');
  const IC_WALLET=PI('wallet');
  const IC_RECEIPT=PI('receipt');
  const IC_STORE=PI('store');
  const IC_TRUCK=PI('truck');
  const IC_PERCENT=PI('percent');
  const IC_SHARE=PI('share-2');
  const IC_THUMBSUP=PI('thumbs-up');

  /* icBox：PulsoIcon svg 容器；size→固定 px（16/20/24/32），tone→currentColor，svg fill 繼承 */
  function icBox(name,size,tone){
    const b=ce('span','ic-box ic-'+size+' ic-t-'+(tone||'default'));
    b.innerHTML=name||IC_DASHBOARD;
    return b;
  }
  /* 本 DS 採用的 PulsoIcon icon 子集（官方 regular 線框、viewBox 256、fill=currentColor；常見 dashboard icon）；延遲求值 */
  function icLibrary(){return [
    ['通用介面 General',[['house',IC_HOUSE],['dashboard',IC_DASHBOARD],['settings',IC_SETTINGS],['search',IC_SEARCH],['bell',IC_BELL],['filter',IC_FILTER],['sliders',IC_SLIDERS],['plus',IC_PLUS],['check',IC_CHECK],['close',IC_CLOSE],['caret-down',IC_CARET_DOWN],['arrow-right',IC_ARROW_RIGHT]]],
    ['工作 Work',[['folder',IC_FOLDER],['file',IC_FILE],['calendar',IC_CALENDAR],['clock',IC_CLOCK],['edit',IC_EDIT],['note',IC_NOTE],['briefcase',IC_BRIEFCASE],['paperclip',IC_PAPERCLIP],['chart-bar',IC_CHART_BAR],['pie',IC_PIE]]],
    ['資料操作 Data',[['mail',IC_MAIL],['download',IC_DOWNLOAD],['upload',IC_UPLOAD],['trash',IC_TRASH],['eye',IC_EYE],['tag',IC_TAG],['trending',IC_TRENDING],['logout',IC_LOGOUT]]],
    ['購物 Shopping',[['cart',IC_CART],['bag',IC_BAG],['card',IC_CARD],['money',IC_MONEY],['wallet',IC_WALLET],['receipt',IC_RECEIPT],['store',IC_STORE],['truck',IC_TRUCK],['percent',IC_PERCENT],['gift',IC_GIFT],['bookmark',IC_BOOKMARK]]],
    ['社群溝通 Social',[['chat',IC_CHAT],['share',IC_SHARE],['thumbs-up',IC_THUMBSUP],['send',IC_SEND],['heart',IC_HEART],['star',IC_STAR],['user',IC_USER],['users',IC_USERS],['camera',IC_CAMERA],['phone',IC_PHONE]]],
    ['旅遊生活 Travel & Life',[['airplane',IC_AIRPLANE],['suitcase',IC_SUITCASE],['map',IC_MAP],['globe',IC_GLOBE],['bed',IC_BED],['location',IC_LOCATION],['coffee',IC_COFFEE],['sun',IC_SUN],['music',IC_MUSIC],['food',IC_FOOD]]],
    ['品牌社群 Brand',[['twitter',FTR_IC_TWITTER],['github',FTR_IC_GITHUB],['linkedin',FTR_IC_LINKEDIN],['instagram',FTR_IC_INSTAGRAM],['gmail',FTR_IC_GMAIL]]],
  ];}
  /* Live 可切換的示意 icon 集 */
  const IC_LIVE_SET={'dashboard':'gauge','chart-bar':'chart-column','bell':'bell','user':'user','settings':'settings','heart':'heart','star':'star','calendar':'calendar'};  // 值＝PulsoIcon key

  LIVE.icon=(host)=>mountLive(host,{gate:'icon',
    initial:{style:'outline',size:'l',tone:'primary',stroke:'2',glyph:'bell',animated:true},
    segs:[
      {key:'style',label:'Style',options:['outline','solid'],labels:['線框','實心']},
      {key:'size',label:'Size',options:['s','m','l','xl'],labels:['16','20','24','32']},
      {key:'tone',label:'Tone',options:['default','primary','secondary','danger'],labels:['預設','主要','次要','危險']},
      {key:'stroke',label:'Stroke 線寬',options:['1','1.5','2','2.5','3']},   /* 只覆寫預覽區的 --icon-stroke；全站值在 Token 頁 */
      {key:'glyph',label:'Icon',options:['dashboard','chart-bar','bell','user','settings','heart','star','calendar'],labels:['儀表板','長條圖','鈴','用戶','設定','愛心','星','日曆']}],
    bools:[{key:'animated',label:'animated（程式碼專屬）'}],
    render:st=>{const b=icBox(PI(IC_LIVE_SET[st.glyph],{solid:st.style==='solid'}),st.size,st.tone);b.style.setProperty('--icon-stroke',st.stroke);
      if(st.animated)b.setAttribute('data-icon-trigger','');else b.setAttribute('data-pi-off','');return b;},
    note:'PulsoIcon：線框／實心兩種樣式、線寬吃 <code>--icon-stroke</code> token、色彩走 <code>currentColor</code>（可綁 <code>semantic.icon.*</code>）。滑過 icon 會播它的專屬動態；<code>animated</code> 只存在程式碼、不進 Figma。'
  });

  /* 線寬切換（Segmented 原子）：只在 host 上覆寫 --icon-stroke，預覽用、不動全站 token（全站值在 Token 頁「Icon 圖示」） */
  const IC_STROKES=['1','1.5','2','2.5','3'];
  function icStrokeSeg(host,label){const cur=getComputedStyle(document.documentElement).getPropertyValue('--icon-stroke').trim()||'2';
    const g=sgmEl('soft','s',{items:IC_STROKES,active:Math.max(0,IC_STROKES.indexOf(cur)),label,live:true,onChange:i=>host.style.setProperty('--icon-stroke',IC_STROKES[i])});
    const w=ce('div','ic-ctl');const l=ce('span','ic-ctl-lb');l.textContent='線寬';w.append(l,g);return w;}
  /* ===== ICX:v1 搜尋完整 PulsoIcon 圖示庫＋加入專案 =====
     資料：執行時從 jsDelivr 載入與內嵌版本相同的 pulsoicon-core（名稱清單、別名、單顆 icon 模組），只在使用者開始搜尋時才載。
     加入專案：專案模式（studio-server，網址 ?project=）→ POST /api/project/<name>/icons 寫進 projects/<name>/icons.json；
     沒有 server → 下載 icons.add.json，交給 Claude 合併。母元件庫模式只能搜尋、預覽、複製 SVG（母庫由設計團隊維護）。 */
  const ICX_CDN='https://cdn.jsdelivr.net/npm/pulsoicon-core@'+PULSO_VERSION+'/dist/';
  let ICX_IDX=null;   // Promise<[{key,words}]>
  function icxIndex(){if(ICX_IDX)return ICX_IDX;
    ICX_IDX=Promise.all([import(ICX_CDN+'names.js'),import(ICX_CDN+'aliases.js')]).then(([n,a])=>{
      const kb=x=>x.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
      return n.ICON_NAMES.map(k=>({key:k,words:[k,...((a.ALIASES[k]||[]).map(kb))]}));
    }).catch(e=>{ICX_IDX=null;throw e;});return ICX_IDX;}
  function icxLoad(key){if(PULSO_ICONS[key])return Promise.resolve(PULSO_ICONS[key]);
    return import(ICX_CDN+'icons/'+key+'.js').then(m=>{const d=Object.values(m)[0];PULSO_ICONS[key]=d;return d;});}
  function icxSearch(idx,q){q=q.trim().toLowerCase().replace(/\s+/g,'-');if(!q)return [];
    const out=[];for(const it of idx){let best=99;for(const w of it.words){const r=w===q?0:w.startsWith(q)?1:w.includes(q)?2:99;if(r<best)best=r;}
      if(best<99)out.push([best,it.words[0]===q?-1:0,it.key.length,it.key]);}
    return out.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]||(a[3]<b[3]?-1:1)).map(x=>x[3]);}
  function icxInProject(key){return (window.PROJECT_ICONS||[]).some(p=>p.key===key||p.name===key);}
  function icxEntry(key,d){return {name:key,key,source:'pulsoicon',version:PULSO_VERSION,svg:PI(key),solidSvg:PI(key,{solid:1}),data:d};}
  function icxAdd(key,done){const proj=window.__dsProject;
    icxLoad(key).then(d=>{const entry=icxEntry(key,d);
      return fetch('/api/project/'+encodeURIComponent(proj)+'/icons',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({icons:[entry]})})
        .then(r=>{if(!r.ok)throw new Error(r.status);return r.json();})
        .then(res=>{window.PROJECT_ICONS=res.icons||((window.PROJECT_ICONS||[]).filter(p=>p.name!==key).concat(entry));renderProjIcons();done('ok');})
        .catch(()=>{if(typeof dsDownload==='function')dsDownload('icons.add.json',[entry]);done('download');});
    }).catch(()=>done('fail'));}
  function icxSection(body,siteKeys){const SITE=new Set(siteKeys);
    const sec=section(body,'搜尋完整圖示庫','PulsoIcon 全庫共 <b>9,955</b> 顆，用英文名稱搜尋（也認得其他 icon 庫的叫法，例如 gear → settings）。<b>網站已有的</b>會標示；沒有的可以'+(window.__dsProject?'<b>加入此專案</b>（寫進 <code>projects/'+window.__dsProject+'/icons.json</code>，只影響本專案）':'在<b>專案模式</b>（<code>?project=</code>）加入該專案；母元件庫只能預覽與複製 SVG')+'。需要連網（從 jsDelivr 載入）。');
    const bar=ce('div','icx-bar');
    const f=ce('div','field icx-field');f.innerHTML=ICON_SEARCH+'<input class="bare" type="search" placeholder="搜尋 icon，例如 rocket、cart、weather…" aria-label="搜尋完整圖示庫" autocomplete="off" spellcheck="false">';
    const inp=f.querySelector('input');
    let solid=false;const sty=sgmEl('soft','s',{items:['線框','實心'],active:0,label:'搜尋結果樣式',live:true,onChange:i=>{solid=i===1;grid.querySelectorAll('.ic-cell[data-key]').forEach(c=>{const b=c.querySelector('.ic-box');if(b&&PULSO_ICONS[c.dataset.key])b.innerHTML=PI(c.dataset.key,{solid});});}});
    bar.append(f,sty,icStrokeSeg(sec,'搜尋結果線寬'));
    const st=ce('p','icx-status');st.setAttribute('role','status');st.setAttribute('aria-live','polite');st.textContent='輸入關鍵字開始搜尋。';
    const grid=ce('div','ic-lib icx-grid');grid.hidden=true;
    const more=mkBtn({variant:'outline',intent:'secondary',size:'s'});more.querySelector('span').textContent='顯示更多';more.hidden=true;more.classList.add('icx-more');
    sec.append(bar,st,grid,more);
    const PAGE=48;let hits=[],shown=0,seq=0;
    function cell(key){const c=ce('div','ic-cell icx-cell');c.dataset.key=key;c.setAttribute('data-icon-trigger','');
      const box=ce('span','ic-box ic-l ic-t-default icx-ph');c.appendChild(box);
      const nm=ce('div','ic-name');nm.textContent=key;c.appendChild(nm);
      const act=ce('div','icx-act');
      if(SITE.has(key)){act.appendChild(tagEl('soft','neutral','default'));act.lastChild.firstChild.textContent='網站已有';}
      else if(icxInProject(key)){act.appendChild(tagEl('soft','success','default'));act.lastChild.firstChild.textContent='已加入專案';}
      else if(window.__dsProject){const b=mkBtn({variant:'soft',intent:'primary',size:'s'});b.querySelector('span').textContent='加入專案';
        b.onclick=()=>{b.disabled=true;b.querySelector('span').textContent='加入中…';
          icxAdd(key,r=>{if(r==='ok'){act.innerHTML='';act.appendChild(tagEl('soft','success','default'));act.lastChild.firstChild.textContent='已加入專案';st.textContent='已加入 '+key+'（projects/'+window.__dsProject+'/icons.json）。';}
            else if(r==='download'){b.querySelector('span').textContent='已下載';st.textContent='連不到本機 server，已改為下載 icons.add.json，交給 Claude 合併進專案。';}
            else{b.disabled=false;b.querySelector('span').textContent='加入專案';st.textContent='載入 '+key+' 失敗，請稍後再試。';}});};
        act.appendChild(b);}
      else{const b=mkBtn({variant:'outline',intent:'secondary',size:'s'});b.querySelector('span').textContent='複製 SVG';
        b.onclick=()=>{const t=PULSO_ICONS[key]?PI(key,{solid}):'';if(!t)return;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{st.textContent='已複製 '+key+' 的 SVG。';}).catch(()=>{st.textContent='瀏覽器不允許複製，請改用專案模式加入。';});};
        act.appendChild(b);}
      c.appendChild(act);
      icxLoad(key).then(()=>{if(!c.isConnected)return;box.classList.remove('icx-ph');box.innerHTML=PI(key,{solid});}).catch(()=>{box.classList.remove('icx-ph');box.textContent='—';});
      return c;}
    function showMore(){hits.slice(shown,shown+PAGE).forEach(k=>grid.appendChild(cell(k)));shown=Math.min(hits.length,shown+PAGE);more.hidden=shown>=hits.length;}
    let tmr=0;
    function run(){const q=inp.value;const my=++seq;
      if(!q.trim()){grid.hidden=true;grid.innerHTML='';more.hidden=true;st.textContent='輸入關鍵字開始搜尋。';return;}
      st.textContent='載入圖示庫…';
      icxIndex().then(idx=>{if(my!==seq)return;hits=icxSearch(idx,q);grid.innerHTML='';shown=0;
        if(!hits.length){grid.hidden=true;more.hidden=true;st.textContent='找不到「'+q.trim()+'」，換個英文關鍵字試試。';return;}
        grid.hidden=false;st.textContent='共 '+hits.length+' 顆符合「'+q.trim()+'」'+(hits.length>PAGE?'，先顯示 '+PAGE+' 顆':'')+'。';showMore();})
      .catch(()=>{if(my!==seq)return;st.textContent='無法連線到圖示庫（jsDelivr），請確認網路後再試。';});}
    inp.addEventListener('input',()=>{clearTimeout(tmr);tmr=setTimeout(run,180);});
    inp.addEventListener('focus',()=>{icxIndex().catch(()=>{});},{once:true});   // 先暖機名稱清單
    more.onclick=showMore;}
  /* 本專案 Icon：Figma 同步拉入的（只有 svg）＋從圖示庫加入的（帶 PulsoIcon 資料，可切實心、會動） */
  function renderProjIcons(){const host=window.__icxProjHost;if(!host||!host.isConnected)return;host.innerHTML='';
    const list=window.PROJECT_ICONS;if(!window.__dsProject||!Array.isArray(list)||!list.length)return;
    list.forEach(pi=>{if(pi.data&&pi.key&&!PULSO_ICONS[pi.key])PULSO_ICONS[pi.key]=pi.data;});
    const ps=section(host,'本專案 Icon','此專案專屬的 icon（'+list.length+' 顆）：來自專案 Figma 同步，或從上方圖示庫加入；只在本專案顯示，不進共用庫、不影響其他專案。');
    const pg=ce('div','ic-lib');
    list.forEach(pi=>{const cell=ce('div','ic-cell');const live=pi.key&&PULSO_ICONS[pi.key];if(live)cell.setAttribute('data-icon-trigger','');
      cell.appendChild(icBox(live?PI(pi.key):pi.svg,'l','default'));const nm=ce('div','ic-name');nm.textContent=pi.name||'icon';cell.appendChild(nm);
      const src=ce('div','icx-src');src.textContent=pi.source==='pulsoicon'?'PulsoIcon':'Figma';cell.appendChild(src);pg.appendChild(cell);});
    ps.appendChild(pg);}
  function buildIcon(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Icon',title:'Icon 圖示',
      lede:'本 DS icon set＝<b>PulsoIcon</b>（線條型、24 格、每顆有專屬動態）。<b>style</b> 有 <b>線框 outline／實心 solid</b> 兩種（對應 L0 的 line／solid，duocolor／duotone 不做）；線寬吃 <code>--icon-stroke</code> token，色彩走 <code>currentColor</code>／<code>semantic.icon.*</code>。尺寸沿用 L0 的 <b>s／m／l／xl＝16／20／24／32 px</b>；<b>tone 為陳列頁擴充軸</b>、非 L0 原生。滑過所在的按鈕、連結、分頁時播放動態，<code>animated</code> 開關只存在程式碼、不進 Figma。',
      specRows:[['axes','<code>style × size × tone</code>'],['formula','<code>2 × 4 × 4 = 32</code>（tone 為擴充軸）'],['sizes','<code>s／m／l／xl = 16／20／24／32 px</code>'],['icon-set','<code>PulsoIcon</code>（'+PULSO_VERSION+'，ISC）'],['token-policy','<code>--icon-stroke ／ semantic.icon.* ／ semantic.text.*</code>'],['code-only','<code>animated</code>（動態開關，Figma 不建屬性）'],['license','<a href="'+(location.pathname==='/'?'/library/':'')+'THIRD_PARTY_NOTICES.md" target="_blank" rel="noopener">ISC／MIT（第三方授權聲明）</a>'],  /* 正式站根目錄 / 由 vercel rewrite 到 /library/gallery，相對路徑要補 /library/ */['L0-note','variant line／solid → style outline／solid；duocolor／duotone 不做']]});
    const axes=DIAL_SPECS.icon.axes, zh=DIAL_SPECS.icon.zh, active=CHOICE.icon.active; // 接中央 store
    const SZ={s:['16','s'],m:['20','m'],l:['24','l'],xl:['32','xl']};
    const TN={default:['預設','default'],primary:['主要','primary'],secondary:['次要','secondary'],danger:['危險','danger']};
    let p;
    const STZ={outline:'線框',solid:'實心'};
    function renderM(){ if(!p)return; p.innerHTML='';
      const ss=axes.size.filter(v=>active.size.has(v));
      const ts=axes.tone.filter(v=>active.tone.has(v));
      axes.style.filter(v=>active.style.has(v)).forEach(sty=>p.appendChild(matrixPanel({badge:'style · '+sty,name:STZ[sty]+'　Size × Tone（示意 icon 固定為 bell）',
        rows:ss,cols:ts,
        rowLab:s=>labHTML(SZ[s][0]+' px',SZ[s][1]),
        colLab:t=>labHTML(TN[t][0],TN[t][1]),
        cell:(s,t)=>icBox(PI('bell',{solid:sty==='solid'}),s,t),mincol:120}))); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Style × Size × Tone 矩陣','線框／實心各一張；列＝四級尺寸 16／20／24／32 px、欄＝四種色調（對應 semantic.icon.*）；示意 icon 固定為 bell，滑過可看動態。');
    p=panelsIn(sec);renderM();

    /* Icon Library：陳列本 DS 可用的 PulsoIcon icon 子集 */
    const lib=section(body,'Icon Library','本 DS 採用的 PulsoIcon 子集共 <b>65 顆</b>：產品功能 icon 依場景分 6 類（通用介面／工作／資料操作／購物／社群溝通／旅遊生活），另含<b>品牌社群</b> 4 顆（Twitter／GitHub／LinkedIn／Instagram）。線條型、viewBox 0 0 24 24、stroke=currentColor；滑過會播動態。需要更多 icon 可用下方「搜尋完整圖示庫」。');
    /* 線框／實心切換（Segmented 原子） */
    const libSty=sgmEl('soft','s',{items:['線框','實心'],active:0,label:'Icon Library 樣式',live:true,onChange:i=>{lib.querySelectorAll('.ic-cell[data-key]').forEach(c=>{const b=c.querySelector('.ic-box');if(b)b.innerHTML=PI(c.dataset.key,{solid:i===1});});}});
    const libBar=ce('div','icx-bar');const libGrids=ce('div');libBar.append(libSty,icStrokeSeg(libGrids,'Icon Library 線寬'));lib.append(libBar,libGrids);
    icLibrary().forEach(([gname,items])=>{
      const g=ce('div','ic-lib-group');
      const cap=ce('div','ic-lib-cap');cap.textContent=gname+' · '+items.length;g.appendChild(cap);
      const grid=ce('div','ic-lib');
      items.forEach(it=>{const cell=ce('div','ic-cell');const km=/data-pi="([^"]+)"/.exec(it[1]);if(km)cell.dataset.key=km[1];cell.appendChild(icBox(it[1],'l','default'));const nm=ce('div','ic-name');nm.textContent=it[0];cell.appendChild(nm);grid.appendChild(cell);});
      g.appendChild(grid);libGrids.appendChild(g);
    });

    /* ===== 搜尋完整圖示庫（ICX:v1）：連 CDN 上的 PulsoIcon 全庫，網站沒有的可加入專案 ===== */
    icxSection(body,icLibrary().flatMap(([,items])=>items.map(it=>(/data-pi="([^"]+)"/.exec(it[1])||[])[1]).filter(Boolean)));

    /* 本專案 Icon（來源：專案 Figma 經同步拉入，或從上方「搜尋完整圖示庫」加入；存 projects/<name>/icons.json）*/
    const projHost=ce('div');body.appendChild(projHost);window.__icxProjHost=projHost;renderProjIcons();

    /* Usage：decorative vs semantic、行內對齊、icon-in-button */
    const us=section(body,'Usage 用法','decorative（純裝飾，aria-hidden）vs semantic（傳達語意，aria-label）、icon 於文字行內對齊、icon-in-button 三種常見用法。');
    const rd=ce('div','row-demo');
    const items=[];
    // 1. decorative
    const dItem=ce('div','demo-item');
    const dBox=icBox(IC_STAR,'l','primary');dBox.setAttribute('aria-hidden','true');
    dItem.appendChild(dBox);
    const dCap=ce('div','cap');dCap.innerHTML='<b>decorative</b> · aria-hidden="true"';dItem.appendChild(dCap);items.push(dItem);
    // 2. semantic
    const sItem=ce('div','demo-item');
    const sBox=icBox(IC_SETTINGS,'l','default');sBox.setAttribute('role','img');sBox.setAttribute('aria-label','設定');
    sItem.appendChild(sBox);
    const sCap=ce('div','cap');sCap.innerHTML='<b>semantic</b> · role="img" aria-label="設定"';sItem.appendChild(sCap);items.push(sItem);
    // 3. inline in text
    const iItem=ce('div','demo-item');
    const line=ce('span','ic-inline');
    line.appendChild(document.createTextNode('搜尋'));
    line.appendChild(icBox(ICON_SEARCH,'s','secondary'));
    line.appendChild(document.createTextNode('結果'));
    iItem.appendChild(line);
    const iCap=ce('div','cap');iCap.innerHTML='<b>inline</b> · 隨文字大小對齊（size s）';iItem.appendChild(iCap);items.push(iItem);
    // 4. icon-in-button（引用 .btn 樣式）
    const bItem=ce('div','demo-item');
    const btn=ce('button','btn i-primary sz-m v-solid st-default');
    btn.innerHTML=IC_PLUS+'<span>新增項目</span>';
    bItem.appendChild(btn);
    const bCap=ce('div','cap');bCap.innerHTML='<b>in-button</b> · leading icon + label';bItem.appendChild(bCap);items.push(bItem);
    // 5. icon-only button
    const oItem=ce('div','demo-item');
    const obtn=ce('button','btn i-secondary sz-m v-solid icon-only');
    obtn.innerHTML=IC_TRASH;obtn.setAttribute('aria-label','刪除');
    oItem.appendChild(obtn);
    const oCap=ce('div','cap');oCap.innerHTML='<b>icon-only</b> · 必附 aria-label';oItem.appendChild(oCap);items.push(oItem);
    items.forEach(it=>rd.appendChild(it));
    us.appendChild(rd);

    /* Live */
    const sl=section(body,'互動預覽與程式碼','切尺寸／色調／icon，即時看 render 結果。');
    LIVE.icon(sl);
  }

