/* ==================== section-head 區段標題 ==================== */
  /* 單一區段標題列 builder：矩陣 / 內容示範 / Live 共用同一顆 */
  /* o = {align,size,eyebrow:false|'tag'|'breadcrumb',eyebrowText,title,sub:false|undefined,subText,action,filters,count:false|字串,divider} */
  function schHead(o){
    o=o||{};
    const head=ce('div','sch-head sch-a-'+(o.align||'left')+' sch-sz-'+(o.size||'m')+(o.divider?' sch-divider':''));
    const main=ce('div','sch-main');
    /* eyebrow：tag 標籤 or 麵包屑式 */
    if(o.eyebrow==='tag'){
      const eb=ce('div','sch-eyebrow');
      eb.innerHTML='<div class="tg v-soft c-rect i-brand st-default"><span>'+(o.eyebrowText||'本月焦點')+'</span></div>';
      main.appendChild(eb);
    }else if(o.eyebrow==='breadcrumb'){
      const eb=ce('div','sch-eyebrow sch-crumb');
      eb.innerHTML='訂單管理 <span class="sch-crumb-sep">›</span> 出貨明細';
      main.appendChild(eb);
    }
    /* 主標題（可選帶計數 badge） */
    const tr=ce('div','sch-titlerow');
    const h=ce('h3','sch-title');h.textContent=o.title||'近期訂單';
    tr.appendChild(h);
    if(o.count){
      const cb=ce('div','sch-count');
      cb.innerHTML='<div class="tg v-soft c-round i-neutral st-default"><span>'+o.count+'</span></div>';
      tr.appendChild(cb);
    }
    main.appendChild(tr);
    /* 副標（sub===false 才隱藏） */
    if(o.sub!==false){
      const s=ce('p','sch-sub');s.textContent=o.subText||'顯示最近 30 天內建立的訂單資料';
      main.appendChild(s);
    }
    head.appendChild(main);
    /* 右側動作：filter 按鈕群 or 單顆「查看全部」文字鈕 */
    if(o.filters){
      const act=ce('div','sch-actions');
      act.innerHTML=
        '<button class="btn v-solid i-primary sz-s">待處理</button>'+
        '<button class="btn v-outline i-secondary sz-s">已完成</button>'+
        '<button class="btn v-text i-secondary sz-s">全部</button>';
      head.appendChild(act);
    }else if(o.action){
      const act=ce('div','sch-actions');
      const b=document.createElement('button');b.className='btn v-text i-primary sz-s';
      b.innerHTML='<span>查看全部</span><span class="sch-arw">'+ICON_ARROW+'</span>';
      act.appendChild(b);head.appendChild(act);
    }
    return head;
  }

  function buildSectionHead(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Section Head',title:'Section Head 區段標題',
      lede:'放在內容區塊<b>上方的標題列</b>：主標題 + 副標，可再帶 <b>eyebrow 小標</b>、右側<b>動作按鈕</b>、<b>計數 badge</b> 或<b>底部分隔線</b>。用來標示一段內容的開頭與層級，跟頁面級 header、導航用 menu 不同。',
      specRows:[['axes','<code>align × size</code>'],['formula','<code>2 × 2 = 4</code>'],['token-policy','<code>semantic.text.* / surface.line.*</code>'],['content','eyebrow / title / subtitle / action / count / divider']]});
    const axes=DIAL_SPECS['section-head'].axes, zh=DIAL_SPECS['section-head'].zh, active=CHOICE['section-head'].active; // 接中央 store
    const ALN={left:['靠左','left'],center:['置中','center']};
    const SZN={m:['標準','m'],l:['大','l']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const as=axes.align.filter(v=>active.align.has(v));
      const ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'align · size',name:'Align × Size（靠左帶右側動作、置中不帶動作；大尺寸標題放大）',
        rows:as,cols:ss,
        rowLab:a=>labHTML(ALN[a][0],ALN[a][1]),
        colLab:s=>labHTML(SZN[s][0]+'尺寸',SZN[s][1]),
        cell:(a,s)=>schHead({align:a,size:s,eyebrow:'tag',eyebrowText:'本月焦點',
          title:'營收總覽',subText:'2026 年 7 月 · 已同步 3 個管道',action:a==='left'}),
        mincol:300})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Align × Size 矩陣','列＝對齊（靠左／置中）、欄＝尺寸（標準／大）。靠左時右側可帶「查看全部」文字鈕，置中時置中排列且不帶右側動作；大尺寸標題字級放大。');
    p=panelsIn(sec);renderM();
    /* 內容組合示範 */
    const cs=section(body,'Content 內容組合','同一顆 section head 依需求拼裝不同內容：eyebrow 小標、計數 badge、底部分隔線、右側 filter 按鈕群、麵包屑式 eyebrow。');
    const list=ce('div','sch-demolist');
    [['帶 eyebrow 小標',()=>schHead({align:'left',size:'m',eyebrow:'tag',eyebrowText:'本月焦點',title:'營收總覽',subText:'較上月成長 12%'})],
     ['帶計數 badge',()=>schHead({align:'left',size:'m',title:'顧客名單',count:'128',subText:'目前有效的付費顧客總數'})],
     ['帶底部分隔線',()=>schHead({align:'left',size:'m',title:'近期訂單',subText:'顯示最近 30 天內建立的訂單',action:true,divider:true})],
     ['帶右側 filter 按鈕群',()=>schHead({align:'left',size:'m',title:'訂單列表',subText:'依狀態快速篩選',filters:true})],
     ['帶麵包屑式 eyebrow',()=>schHead({align:'left',size:'l',eyebrow:'breadcrumb',title:'出貨明細',subText:'第 8342 號訂單的逐項出貨紀錄'})]
    ].forEach(([cap,fn])=>{const d=ce('div','sch-demo');const c=ce('div','sch-demo-cap');c.textContent=cap;d.append(c,fn());list.appendChild(d);});
    cs.appendChild(list);
    /* 互動預覽與程式碼 */
    const sl=section(body,'互動預覽與程式碼','切換對齊與尺寸，勾選要顯示的元素（eyebrow 小標／副標／右側動作／計數 badge／底部分隔線），下面即時預覽。');
    mountLive(sl,{
      initial:{align:'left',size:'m',eyebrow:true,subtitle:true,action:true,count:false,divider:false},
      segs:[
        {key:'align',label:'Align',options:['left','center'],labels:['靠左','置中']},
        {key:'size',label:'Size',options:['m','l']},
      ],
      bools:[
        {key:'eyebrow',label:'eyebrow 小標'},
        {key:'subtitle',label:'subtitle 副標'},
        {key:'action',label:'action 右側動作'},
        {key:'count',label:'count 計數 badge'},
        {key:'divider',label:'divider 底部分隔線'},
      ],
      boolLabel:'Content',
      render:st=>{
        const box=ce('div','sch-live-box');
        box.appendChild(schHead({
          align:st.align,size:st.size,
          eyebrow:st.eyebrow?'tag':false,eyebrowText:'本月焦點',
          title:'本月訂單總覽',subText:'2026 年 7 月 · 共同步 3 個管道的即時資料',
          sub:st.subtitle?undefined:false,
          action:st.action,count:st.count?'128':false,
          divider:st.divider
        }));
        return box;
      },
      note:'置中（center）時右側動作不顯示、整體置中排列；勾 divider 會在底部加一條分隔線標示區段結束。'
    });
  }

/* list icons */
/* ---- list 家族自訂 icon ---- */
  /* caret-right（PulsoIcon ）：列尾指向箭頭，比下拉 caret 更符合「可進入」語意 */
  const LST_IC_CHEVRON=PI('chevron-right');

/* list build */
/* ==================== list 列表（資料列 ＋ 選項卡完整體系） ==================== */
  /* leading icon 池（示意用，重用既有 PulsoIcon const） */
  const LST_LEAD_ICONS=[ICON_HOUSE,ICON_LIST,ICON_GEAR];

  /* 狀態 → 靜態 class 字串（矩陣展示用） */
  function lstStCls(state){return state==='hover'?' is-hover':state==='selected'?' is-selected':state==='disabled'?' is-disabled':'';}
  /* 列內勾選框（重用既有 .cbx 原子） */
  function lstCbx(checked,state){
    const cb=ce('div','cbx sz-s'+(checked?' st-checked':'')+(state==='disabled'?' st-disabled':''));
    if(checked)cb.innerHTML=ICON_CHECK;
    return cb;
  }

  /* ---- 基本列 basic：左 leading（checkbox／icon 可省）＋ 中 title ＋ 右 trailing 組合 ----
     trailing 標準化：tag（重用 .tg）／info（重用 NT_IC_INFO）／meta 文字／動作鈕／caret，可組合
     o：{title,desc,leadIcon,checkbox,checked,tag,info,meta,action,caret} */
  function lstRowBasic(state,o){
    o=o||{};
    const it=ce('div','lst-item'+lstStCls(state));
    if(o.checkbox)it.appendChild(lstCbx(o.checked,state));
    if(o.leadIcon){const ld=ce('span','lst-lead');const ic=ce('span','lst-icon');ic.innerHTML=o.leadIcon;ld.appendChild(ic);it.appendChild(ld);}
    const bd=ce('div','lst-body');
    const tt=ce('div','lst-title');tt.textContent=o.title||'';bd.appendChild(tt);
    if(o.desc){const ds=ce('div','lst-desc');ds.textContent=o.desc;bd.appendChild(ds);}
    it.appendChild(bd);
    const tr=ce('div','lst-trail');let has=false;
    if(o.tag){const t=ce('div','tg v-soft c-round i-brand st-default');t.innerHTML='<span>'+o.tag+'</span>';tr.appendChild(t);has=true;} // 重用 Tag 原子
    if(o.info){const ic=ce('span','lst-info');ic.innerHTML=NT_IC_INFO;tr.appendChild(ic);has=true;} // 重用 notification info 圓標
    if(o.meta){const m=ce('span','lst-meta');m.textContent=o.meta;tr.appendChild(m);has=true;}
    if(o.amount){const p=ce('span','pr-price pr-sz-sm lst-amount');p.innerHTML='<span class="pr-cur">NT$</span><span class="pr-amt">'+o.amount+'</span>';tr.appendChild(p);has=true;} // 重用 Price 原子顯示金額
    if(o.action){const b=ce('button','btn v-text i-primary sz-s');b.innerHTML='<span>'+(typeof o.action==='string'?o.action:'動作')+'</span>';tr.appendChild(b);has=true;} // 文字按鈕（重用 Button 原子）
    if(o.caret){const c=ce('span','lst-caret');c.innerHTML=LST_IC_CHEVRON;tr.appendChild(c);has=true;}
    if(o.selCheck){tr.appendChild(lstCbx(true,state));has=true;} // 已選指示：右側補已勾選 checkbox（非 checkbox-leading 時）
    if(has)it.appendChild(tr);
    return it;
  }

  /* ---- 雙欄列 two-column：左 title、右 value（小標題）＋ caret ---- */
  function lstRowTwoCol(state,o){
    o=o||{};
    const it=ce('div','lst-item'+lstStCls(state));
    const bd=ce('div','lst-body');
    const tt=ce('div','lst-title');tt.textContent=o.title||'';bd.appendChild(tt);
    it.appendChild(bd);
    const tr=ce('div','lst-trail');
    const v=ce('span','lst-value');v.textContent=o.value||'';tr.appendChild(v);
    if(o.caret!==false){const c=ce('span','lst-caret');c.innerHTML=LST_IC_CHEVRON;tr.appendChild(c);}
    it.appendChild(tr);
    return it;
  }

  /* ---- 明細/摘要列 summary：右對齊 label（＋說明／caret）、＋按鈕新增列、NT$ 總計列 ----
     o：{label,desc,strong,caret} ／ {add:true} ／ {total:'200,000'} */
  function lstSumRow(o){
    o=o||{};
    const it=ce('div','lst-item lst-sum');
    if(o.add){ // 新增列：重用 Button 原子（text / primary）＋ IC_PLUS
      it.classList.add('is-add');
      const b=ce('button','btn v-text i-primary sz-s');b.innerHTML=IC_PLUS+'<span>按鈕</span>';it.appendChild(b);
      return it;
    }
    if(o.total){ // 總計列：重用 Price 原子（.pr-price）
      it.classList.add('is-total');
      const p=ce('span','pr-price pr-sz-md');
      p.innerHTML='<span class="pr-cur">NT$</span><span class="pr-amt">'+o.total+'</span>';
      it.appendChild(p);
      return it;
    }
    const bd=ce('div','lst-body');
    const tt=ce('div','lst-title'+(o.strong?' w-strong':''));tt.textContent=o.label||'';bd.appendChild(tt);
    if(o.desc){const ds=ce('div','lst-desc');ds.textContent=o.desc;bd.appendChild(ds);}
    it.appendChild(bd);
    if(o.caret){const tr=ce('div','lst-trail');const c=ce('span','lst-caret');c.innerHTML=LST_IC_CHEVRON;tr.appendChild(c);it.appendChild(tr);}
    return it;
  }

  /* ---- 巢狀可展開列 nested：checkbox 母列 ＋ 內縮子列，點列展開收合 ----
     o：{title,meta,checked,open,children:[{title,meta}]} */
  function lstNested(o){
    o=o||{};
    const box=ce('div','lst-nest');
    const parent=lstRowBasic('default',{title:o.title,checkbox:true,checked:o.checked,meta:o.meta});
    const sub=ce('div','lst-subwrap');
    (o.children||[]).forEach(c=>sub.appendChild(lstRowBasic('default',{title:c.title,meta:c.meta,caret:true})));
    sub.style.display=o.open?'block':'none';
    parent.addEventListener('click',e=>{
      const cb=e.target.closest('.cbx');
      if(cb){ // 點勾選框只切換勾選，不觸發展開
        const on=cb.classList.toggle('st-checked');cb.innerHTML=on?ICON_CHECK:'';return;
      }
      const willOpen=sub.style.display==='none';sub.dataset.slideHide='1';
      if(willOpen){sub.style.display='block';slideToggle(sub,true);}else slideToggle(sub,false); // Motion v1：高度展開收合
    });
    box.append(parent,sub);
    return box;
  }

  /* ---- 選項卡 selection card：整列一張有框卡（icon＋主標題＋敘述＋checkbox/radio）----
     kind：checkbox／radio；state：default/hover/selected/error/disabled
     o：{title,desc,icon,error 錯誤訊息文字,expand 展開帶 inline 下拉} */
  function lstSelCard(kind,state,o){
    o=o||{};
    const wrap=ce('div','lst-sel-wrap');
    const card=ce('div','lst-sel'+lstStCls(state)+(state==='error'?' is-error':'')+(o.expand?' is-expanded':''));
    // leading icon（預設 globe，沿用 .lst-lead / .lst-icon 尺寸樣式）
    const ld=ce('span','lst-lead');const ic=ce('span','lst-icon');ic.innerHTML=o.icon||IC_GLOBE;ld.appendChild(ic);card.appendChild(ld);
    const main=ce('div','lst-sel-main');
    const tt=ce('div','lst-sel-title');tt.textContent=o.title||'主標題';main.appendChild(tt);
    const ds=ce('div','lst-sel-desc');ds.textContent=o.desc||'相關的敘述說明';main.appendChild(ds);
    card.appendChild(main);
    // 右側選擇控制：checkbox 重用 .cbx、radio 重用 .rdo 原子
    const on=state==='selected';
    let ctl;
    if(kind==='radio'){
      ctl=ce('div','rdo sz-m'+(on?' st-checked':state==='disabled'?' st-disabled':' st-default'));
      ctl.innerHTML='<span class="dot"></span>';
    }else{
      ctl=ce('div','cbx sz-m'+(on?' st-checked':state==='disabled'?' st-disabled':' st-default'));
      if(on)ctl.innerHTML=ICON_CHECK;
    }
    card.appendChild(ctl);
    // 展開帶 inline 下拉的進階版（重用 .field 靜態外觀）
    if(o.expand){
      const ex=ce('div','lst-sel-extra');
      ex.appendChild(lstMiniField());
      const dash=ce('span','lst-sel-dash');dash.textContent='–';ex.appendChild(dash);
      ex.appendChild(lstMiniField());
      card.appendChild(ex);
    }
    wrap.appendChild(card);
    if(state==='error'){const e=ce('div','lst-sel-err');e.textContent=o.error||'錯誤訊息';wrap.appendChild(e);}
    return wrap;
  }
  /* 選項卡展開版 inline 下拉（重用 .field / .ph / .ddcaret 樣式，靜態示意） */
  function lstMiniField(){
    const f=ce('div','field dd v-outline lst-sel-field');
    f.innerHTML='<span class="dd-body"><span class="ph">請選擇</span></span><span class="ddcaret">'+ICON_CARET+'</span>';
    return f;
  }

  /* 依 variant × state 給矩陣單格內容；error 為選項卡專屬 → 其餘顯示不適用
     雙欄／巢狀：母列（checkbox＋標題＋右側小標題）＋ 一條內縮子列示意上下兩層；已選 → 母列勾選框打勾 */
  function lstMatrixCell(variant,state){
    if(state==='error'&&variant!=='selection'){const na=ce('div','lst-na');na.textContent='—（selection 專屬）';return na;}
    if(variant==='selection')return lstSelCard('checkbox',state,{});
    const wrap=ce('div','lst-solo');
    const nest=ce('div','lst-nest');
    nest.appendChild(lstRowBasic(state,{checkbox:true,checked:(state==='selected'),title:'標題',meta:'小標題'}));
    const sub=ce('div','lst-subwrap');sub.style.display='block';
    sub.appendChild(lstRowBasic('default',{title:'子項',meta:'小標題',caret:true}));
    nest.appendChild(sub);
    wrap.appendChild(nest);
    return wrap;
  }

  /* List Item 專用矩陣格：leading（勾選框／圖示／無）× state；已選狀態僅勾選框 leading 適用（其餘不適用） */
  function lstiCell(leading,state){
    if(state==='selected'&&leading!=='checkbox'){const na=ce('div','lst-na');na.textContent='—（需勾選框）';return na;}
    const o={title:'資訊列標題',tag:'標籤',caret:true};
    if(leading==='checkbox'){o.checkbox=true;o.checked=(state==='selected');}
    else if(leading==='icon'){o.leadIcon=IC_GLOBE;}
    const wrap=ce('div','lst-solo');wrap.appendChild(lstRowBasic(state,o));
    return wrap;
  }

  /* 整組列表卡片：收多個列節點 ＋ 可選分隔線；filled=填色卡片底 */
  function lstGroup(nodes,o){
    o=o||{};
    const g=ce('div','lst-group'+(o.filled?' v-filled':''));
    nodes.forEach((n,i)=>{
      if(i>0&&o.divider)g.appendChild(ce('div','lst-divider'));
      g.appendChild(n);
    });
    return g;
  }

  /* ==================== List Item 資訊列（左右欄位可自由配置的單列） ==================== */
  function buildListItem(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · List Item',title:'List Item 資訊列',
      lede:'列表的<b>基本單元</b>：左 <b>leading</b>（無／圖示／勾選框）＋ 中 <b>body</b>（title，可加副描述）＋ 右 <b>trailing</b>（tag／info／meta／動作鈕／caret／checkbox，<b>可複選</b>）。每個欄位都能獨立開關組合，是 List、Menu、選項卡等容器共用的原子列。狀態走 default／hover／selected／disabled；<b>已選</b>會出現已勾選的 checkbox 作為選取指示。',
      specRows:[['axes','<code>leading × state</code>'],['formula','<code>3 × 4 = 12</code>'],['token-policy','<code>semantic.*.list.*</code>'],['slots','leading / title / desc / trailing 組合']]});
    const axes=DIAL_SPECS['list-item'].axes, zh=DIAL_SPECS['list-item'].zh, active=CHOICE['list-item'].active; // 接中央 store
    const LN={checkbox:['勾選框','checkbox'],icon:['圖示','icon'],none:['無','none']};
    const STN={default:['預設','default'],hover:['滑過','hover'],selected:['已選','selected'],disabled:['停用','disabled']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const ls=axes.leading.filter(v=>active.leading.has(v));
      const ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'list · item',name:'Leading × State（前置欄位 × 狀態；已選出現已勾選 checkbox）',
        rows:ls,cols:ss,
        rowLab:v=>labHTML(LN[v][0],LN[v][1]),
        colLab:s=>labHTML(STN[s][0],STN[s][1]),
        cell:(l,s)=>lstiCell(l,s),mincol:260})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Leading × State 矩陣','列＝左側前置（勾選框／圖示／無）、欄＝狀態。hover 底色轉深、selected 帶淡藍底＋左側 accent 色條並出現已勾選 checkbox、disabled 整體淡化。');
    p=panelsIn(sec);renderM();

    // ---- Slot 組合：左右欄位自由組合 ----
    const bs=section(body,'Slot 組合 · 左右欄位','左 leading（無／圖示／勾選框）＋ 中 title（可加副描述）＋ 右 trailing 標準化：tag（重用 Tag）／info icon／meta 文字／金額（重用 Price）／動作鈕（文字按鈕，重用 Button）／caret，依資訊密度自由組合。');
    const bwrap=ce('div','lst-group-demo');
    bwrap.appendChild(lstGroup([
      lstRowBasic('default',{title:'純標題'}),
      lstRowBasic('default',{title:'標題',desc:'相關的敘述說明'}),
      lstRowBasic('default',{title:'圖示＋標籤',leadIcon:IC_GLOBE,tag:'標籤'}),
      lstRowBasic('default',{title:'勾選框＋尾端資訊',checkbox:true,meta:'小標題'}),
      lstRowBasic('default',{title:'金額',amount:'1,280'}),
      lstRowBasic('default',{title:'資訊圖示＋箭頭',info:true,caret:true}),
      lstRowBasic('default',{title:'動作鈕',action:'編輯'}),
    ],{divider:true}));
    bs.appendChild(bwrap);

    // ---- 互動預覽與程式碼：每個 slot 一個開關，全部對應樣式；hover 為真實滑過、disabled 用勾選（比照其他頁面）----
    const sl=section(body,'互動預覽與程式碼','切 Leading（無／圖示／勾選框），勾選右側 trailing 各 slot；滑鼠移上去看 hover、勾 disabled 停用、點勾選框 leading 切換勾選並轉已選。每個開關都對應一個可見樣式。');
    mountLive(sl,{
      initial:{leading:'checkbox',desc:false,tag:true,info:false,meta:false,amount:false,action:false,caret:true,disabled:false},
      segs:[
        {key:'leading',label:'Leading 前置',options:['none','icon','checkbox'],labels:['無','圖示','勾選框']},
      ],
      bools:[
        {key:'desc',label:'desc 副描述'},
        {key:'tag',label:'tag 標籤'},
        {key:'info',label:'info 資訊圖示'},
        {key:'meta',label:'meta 尾端文字'},
        {key:'amount',label:'amount 金額'},
        {key:'action',label:'action 動作鈕'},
        {key:'caret',label:'caret 箭頭'},
        {key:'disabled',label:'disabled 停用'},
      ],
      boolLabel:'Trailing 組合',
      render:st=>{
        const state=st.disabled?'disabled':'default';
        const o={title:'資訊列標題',
          desc:st.desc?'相關的敘述說明':null,
          leadIcon:st.leading==='icon'?IC_GLOBE:null,
          checkbox:st.leading==='checkbox',
          tag:st.tag?'標籤':null,info:st.info,meta:st.meta?'小標題':null,
          amount:st.amount?'1,280':null,action:st.action,caret:st.caret};
        const row=lstRowBasic(state,o);
        if(!st.disabled){ // 可點：checkbox-leading 切勾選＋已選；其餘點列切已選
          row.style.cursor='pointer';
          row.addEventListener('click',()=>{
            if(st.leading==='checkbox'){const cb=row.querySelector('.cbx');if(cb){const on=cb.classList.toggle('st-checked');cb.innerHTML=on?ICON_CHECK:'';row.classList.toggle('is-selected',on);}}
            else{row.classList.toggle('is-selected');}
          });
        }
        const box=ce('div','lst-solo');box.style.width='600px';box.style.maxWidth='100%';box.appendChild(row);return box; // Live 固定寬 600px
      },
      note:'每個開關都對應一個 slot：<b>Leading</b>（無／圖示／勾選框）、<b>Trailing</b> 可複選（tag／info／meta／金額／動作鈕／caret）。<b>hover</b> 滑鼠移上去即見、<b>disabled</b> 停用整列；點勾選框 leading 切換勾選並轉已選（已選僅淡藍底、無左側色條）。'
    });
  }

  function buildList(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · List',title:'List 列表',
      lede:'資料列容器的<b>組合體系</b>，兩大類 variant：<b>雙欄／巢狀 nested</b>（上下兩層——白底母列＋<b>內縮灰底</b>子列，點母列展開／收合）、<b>選項卡 selection</b>（整列一張有框卡：icon＋主標題＋敘述說明＋右側 checkbox／radio）。單列本身的左右欄位組合請見<b>List Item 資訊列</b>。另含<b>明細／總計列</b>進階組合。nested 走四狀態，selection 多一個 <b>error</b>（紅框＋錯誤訊息）；<b>已選</b>狀態的母列會出現已勾選 checkbox。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>nested 4 ＋ selection 5 = 9</code>'],['token-policy','<code>semantic.*.list.*</code>'],['features','上下巢狀 / 選項卡 / 明細總計']]});
    const axes=DIAL_SPECS.list.axes, zh=DIAL_SPECS.list.zh, active=CHOICE.list.active; // 接中央 store
    const VN={nested:['雙欄／巢狀','nested'],selection:['選項卡','selection']};
    const STN={default:['預設','default'],hover:['滑過','hover'],selected:['已選','selected'],error:['錯誤','error'],disabled:['停用','disabled']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'list · group',name:'Variant × State（雙欄／巢狀、選項卡 × 狀態；error 為選項卡專屬）',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(STN[s][0],STN[s][1]),
        cell:(v,s)=>lstMatrixCell(v,s),mincol:260})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × State 矩陣','列＝雙欄／巢狀與選項卡、欄＝狀態。雙欄／巢狀 selected：母列出現已勾選 checkbox＋淡藍底；選項卡 selected 轉藍底藍框；error 僅選項卡有（紅框＋卡下錯誤訊息）；disabled 整體淡化。');
    p=panelsIn(sec);renderM();

    // ---- 雙欄／巢狀 ----
    const ts=section(body,'雙欄／巢狀 Nested','上下兩層結構：白底母列（checkbox＋標題＋右側小標題）＋ 內縮的<b>灰底</b>子列區塊（標題＋小標題＋caret）；點母列展開／收合，點勾選框只切換勾選、不觸發展開。');
    const twrap=ce('div','lst-group-demo');
    twrap.appendChild(lstGroup([
      lstNested({title:'王小明',meta:'3 項',open:true,checked:true,children:[{title:'子項一',meta:'小標題'},{title:'子項二',meta:'小標題'},{title:'子項三',meta:'小標題'}]}),
      lstNested({title:'陳美華',meta:'2 項',children:[{title:'子項一',meta:'小標題'},{title:'子項二',meta:'小標題'}]}),
    ],{divider:true}));
    ts.appendChild(twrap);

    // ---- 明細/摘要列 ----
    const ms=section(body,'明細／總計列 Summary','右對齊的明細 label（可加粗／帶說明）、caret 導覽列、「＋按鈕」新增列，底部以 Price 原子（.pr-price）收「NT$ 總計」。');
    const mwrap=ce('div','lst-group-demo');
    mwrap.appendChild(lstGroup([
      lstSumRow({label:'小標題'}),
      lstSumRow({label:'小標題',strong:true}),
      lstSumRow({label:'小標題',desc:'說明',strong:true}),
      lstSumRow({label:'小標題',caret:true}),
      lstSumRow({add:true}),
      lstSumRow({total:'200,000'}),
    ],{divider:true}));
    ms.appendChild(mwrap);

    // ---- 選項卡 ----
    const scs=section(body,'選項卡 Selection Card','整列一張有框卡：icon＋主標題＋敘述說明＋右側 checkbox（.cbx）或 radio（.rdo）。五狀態：default／hover／selected（藍底藍框）／error（紅框＋錯誤訊息）／disabled；另有展開帶 inline 下拉（.field）的進階版。');
    const sgrid=ce('div','lst-sel-grid');
    const cap1=ce('div','lst-sel-cap');cap1.textContent='checkbox 版（多選語意）';
    const cap2=ce('div','lst-sel-cap');cap2.textContent='radio 版（單選語意）';
    sgrid.append(cap1,cap2);
    ['default','hover','selected','error','disabled'].forEach(st=>{
      sgrid.appendChild(lstSelCard('checkbox',st,{}));
      sgrid.appendChild(lstSelCard('radio',st,{}));
    });
    scs.appendChild(sgrid);
    const exp=ce('div','lst-sel-expdemo');
    exp.appendChild(lstSelCard('radio','selected',{expand:true}));
    scs.appendChild(exp);

    // ---- 互動預覽與程式碼：兩類各自 scoped，控制項只顯示對該類有效者（無空轉開關）----
    const sl=section(body,'互動預覽與程式碼','雙欄／巢狀與選項卡各自的互動 playground；控制項只出現對該類有效的選項，每個開關都對應一個可見樣式。');
    // 雙欄／巢狀
    const l1=ce('div','lst-live-block');const c1=ce('div','lst-live-cap');c1.innerHTML='<b>雙欄／巢狀 Nested</b>';l1.appendChild(c1);sl.appendChild(l1);
    mountLive(l1,{
      initial:{divider:true,open:true},
      segs:[],
      bools:[{key:'divider',label:'divider 分隔線'},{key:'open',label:'預設展開子列'},{key:'removable',label:'removable 可刪除／新增'}],
      boolLabel:'Content',
      render:st=>{const g=lstGroup([
        lstNested({title:'王小明',meta:'2 項',open:st.open,checked:true,children:[{title:'子項一',meta:'小標題'},{title:'子項二',meta:'小標題'}]}),
        lstNested({title:'陳美華',meta:'2 項',open:st.open,children:[{title:'子項一',meta:'小標題'},{title:'子項二',meta:'小標題'}]}),
      ],{divider:st.divider});g.style.width='600px';g.style.maxWidth='100%';
        if(!st.removable)return g;
        /* Motion v1：刪除＝往左淡出 → 高度收合、下方遞補（示意：約 1 秒後復原）；新增＝從上方淡入 */
        const addDel=nest=>{const head=nest.querySelector(':scope > .lst-item');if(!head)return;const x=ce('button','btn v-text i-danger sz-s live lst-del');x.innerHTML='<span>刪除</span>';
          x.onclick=e=>{e.stopPropagation();if(nest.classList.contains('lst-out'))return;nest.classList.remove('lst-in');nest.classList.add('lst-out');
            afterAnim(nest,()=>{nest.dataset.slideHide='1';slideToggle(nest,false);
              setTimeout(()=>{nest.classList.remove('lst-out');delete nest.dataset.slideHide;nest.style.display='block';slideToggle(nest,true);nest.classList.add('lst-in');},900);});};
          (head.querySelector('.lst-trail')||head).appendChild(x);};
        g.querySelectorAll(':scope > .lst-nest').forEach(addDel);
        const w=ce('div','lst-live-rm');let n=0;
        const add=ce('button','btn v-outline i-secondary sz-s live');add.innerHTML='<span>新增一列</span>';
        add.onclick=()=>{const nn=lstNested({title:'新成員 '+(++n),meta:'0 項',open:false,children:[]});nn.classList.add('lst-in');addDel(nn);
          if(st.divider&&g.firstChild)g.insertBefore(ce('div','lst-divider'),g.firstChild);g.insertBefore(nn,g.firstChild);};
        w.append(g,add);return w;}, // Live 固定寬 600px
      note:'點母列展開／收合子列（子列為內縮灰底區塊），點左側勾選框只切換勾選。每個開關都對應樣式：<b>divider</b> 加分隔線、<b>預設展開子列</b> 切子列初始狀態。'
    });
    // 選項卡
    const l2=ce('div','lst-live-block');const c2=ce('div','lst-live-cap');c2.innerHTML='<b>選項卡 Selection</b>';l2.appendChild(c2);sl.appendChild(l2);
    mountLive(l2,{
      initial:{control:'checkbox'},
      segs:[{key:'control',label:'Control',options:['checkbox','radio'],labels:['checkbox 多選','radio 單選']}],
      bools:[],
      boolLabel:'Content',
      render:st=>{
        const box=ce('div','lst-sel-live');
        const data=[
          {title:'標準方案',desc:'適合個人使用的基本功能'},
          {title:'進階方案',desc:'完整協作與自動化功能'},
          {title:'企業方案',desc:'客製化部署與專屬支援'},
        ];
        const cards=data.map((d,i)=>lstSelCard(st.control,i===0?'selected':'default',{title:d.title,desc:d.desc}));
        cards.forEach(w=>{
          const card=w.querySelector('.lst-sel');
          card.addEventListener('click',e=>{
            if(e.target.closest('.field'))return; // 展開下拉不觸發選取
            const on=card.classList.contains('is-selected');
            if(st.control==='radio'){ // 單選：先清其他卡
              cards.forEach(o2=>{const c2=o2.querySelector('.lst-sel');c2.classList.remove('is-selected');const r2=c2.querySelector('.rdo');if(r2){r2.classList.remove('st-checked');r2.classList.add('st-default');}});
              card.classList.add('is-selected');
              const r=card.querySelector('.rdo');if(r){r.classList.remove('st-default');r.classList.add('st-checked');}
            }else{ // 多選：逐卡 toggle，同步 .cbx
              card.classList.toggle('is-selected',!on);
              const cb=card.querySelector('.cbx');
              if(cb){cb.classList.toggle('st-checked',!on);cb.innerHTML=!on?ICON_CHECK:'';}
            }
          });
          box.appendChild(w);
        });
        return box;
      },
      note:'點整卡選取——<b>radio</b> 為單選互斥、<b>checkbox</b> 為多選 toggle。（展開帶 inline 下拉的進階版見上方靜態示意區）'
    });
  }

/* collapse icons */
/* ---- collapse 前置 icon 池（with-icon 左側前置圖示；FAQ 情境用問號圓）---- */
  const CPS_ICON_QUESTION=PI('circle-question-mark');

/* ---- collapse 指示 icon：加減款（收合顯示＋、展開顯示−，PulsoIcon plus/minus，不旋轉）---- */
  const CPS_ICON_PLUS=PI('plus');
  const CPS_ICON_MINUS=PI('minus');

/* collapse build */
/* ==================== collapse 摺疊 / 手風琴 ==================== */
  /* ---- COLLAPSE 摺疊面板（builders 提升頂層，頁面與 Live 共用）---- */
  /* FAQ 內容池：真實繁中文案，手風琴各項共用同一份資料（不 mutate） */
  const CPS_FAQ=[
    {title:'如何申請退款？',body:'訂單成立後 7 天內可於「我的訂單」頁面點選退款，款項將於 3–5 個工作天內退回原付款方式；已使用的優惠券不予退回。'},
    {title:'運費如何計算？',body:'單筆訂單滿 NT$1,000 免運費，未達門檻酌收 NT$80 物流費用；外島與偏遠地區另計，結帳時會即時顯示。'},
    {title:'可以修改已送出的訂單嗎？',body:'訂單進入出貨流程前皆可於「訂單詳情」點選編輯；一旦開始揀貨或已出貨，則無法更動內容，需改走退換貨流程。'},
    {title:'支援哪些付款方式？',body:'支援信用卡、ATM 虛擬帳號轉帳、超商代碼繳費，以及 Apple Pay 與 Google Pay 等行動支付。'}
  ];

  /* 單一摺疊面板：variant 控外觀、state 控狀態；expanded 才渲染 body、caret 朝上 */
  function cpsPanel(variant,state,o){
    o=o||{};
    const expanded=(state==='expanded');
    const panel=ce('div','cps-panel v-'+variant+' st-'+state);
    const head=ce('div','cps-head');
    let h=''; if(o.icon)h+=`<span class="cps-lead">${o.icon}</span>`;
    h+=`<span class="cps-title">${o.title||'標題'}</span><span class="cps-caret">${ICON_CARET}</span>`;
    head.innerHTML=h;
    panel.appendChild(head);
    if(expanded){                                   // 展開狀態才渲染 body（外層 wrap 負責展開動畫版位）
      const bwrap=ce('div','cps-body-wrap');
      const bodyEl=ce('div','cps-body');
      bodyEl.innerHTML=o.body||'';
      bwrap.appendChild(bodyEl);
      panel.appendChild(bwrap);
    }
    return panel;
  }

  /* 真正可互動的手風琴：點 header 切換展開／收合（切 class 交給 CSS grid 0fr→1fr 往下展開 + 淡入動畫）。
     o.variant 風格；o.multiple 允許多項同時展開（否則單開手風琴，展開新項自動收合前一項）；
     o.icon 左側前置圖示；o.firstOpen 預設展開第一項；
     o.indicator 指示 icon：'chevron'（caret 旋轉 180°）或 'plusminus'（收合顯示＋、展開顯示−，不旋轉） */
  function cpsAccordion(items,o){
    o=o||{};
    const variant=o.variant||'bordered';
    const indicator=o.indicator||'chevron';
    const wrap=ce('div','cps-acc v-'+variant);
    const panels=[];
    // 統一開合入口：只切 class（動畫由 CSS transition 負責），plusminus 模式同步換＋／−
    const setOpen=(r,open)=>{
      r.panel.classList.toggle('is-open',open);
      r.head.setAttribute('aria-expanded',open?'true':'false');
      if(indicator==='plusminus')r.caret.innerHTML=open?CPS_ICON_MINUS:CPS_ICON_PLUS;
    };
    items.forEach((it,idx)=>{
      const open=!!it.open||(!!o.firstOpen&&idx===0);
      const panel=ce('div','cps-panel v-'+variant+(open?' is-open':'')+(indicator==='plusminus'?' ind-pm':''));
      const head=ce('button','cps-head cps-head-btn');head.type='button';
      let hd=''; if(o.icon)hd+=`<span class="cps-lead">${o.icon}</span>`;
      const ind=indicator==='plusminus'?(open?CPS_ICON_MINUS:CPS_ICON_PLUS):ICON_CARET;
      hd+=`<span class="cps-title">${it.title}</span><span class="cps-caret">${ind}</span>`;
      head.innerHTML=hd;
      head.setAttribute('aria-expanded',open?'true':'false');
      const bwrap=ce('div','cps-body-wrap');          // 動畫外層：grid rows 0fr／1fr
      const body=ce('div','cps-body');body.innerHTML=it.body;
      bwrap.appendChild(body);
      const rec={panel,head,caret:head.querySelector('.cps-caret')};
      head.onclick=()=>{
        const isOpen=panel.classList.contains('is-open');
        if(!o.multiple)panels.forEach(r=>setOpen(r,false)); // 單開模式：先收合所有項
        setOpen(rec,!isOpen);
      };
      panel.append(head,bwrap);
      panels.push(rec);
      wrap.appendChild(panel);
    });
    return wrap;
  }

  function buildCollapse(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Collapse',title:'Collapse 摺疊 / 手風琴',
      lede:'由 <b>header 列</b>（標題 + 右側指示 icon）與展開後的 <b>body 內容</b>組成；點 header 切換展開／收合，body 往下展開並淡入。指示 icon 可選 <b>chevron</b>（旋轉 180°）或<b>加減號</b>（收合＋／展開−）。三種 variant（<b>外框 / 填色 / 極簡</b>）× 四狀態（收合 / 展開 / 滑過 / 停用），填色為整張填色卡片。多項組成手風琴時可設定<b>單開或多開</b>。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>3 × 4 = 12</code>'],['token-policy','<code>semantic.*.panel.*</code>'],['features','indicator chevron·plus-minus / expand-fade 動畫 / accordion single-open / with-icon']]});
    const axes=DIAL_SPECS.collapse.axes, zh=DIAL_SPECS.collapse.zh, active=CHOICE.collapse.active; // 接中央 store
    const VN={bordered:['外框','bordered'],filled:['填色','filled'],plain:['極簡','plain']};
    const STN={collapsed:['收合','collapsed'],expanded:['展開','expanded'],hover:['滑過','hover'],disabled:['停用','disabled']};
    const M_TITLE='帳戶與安全設定';
    const M_BODY='展開後顯示的內容區塊，可放段落、清單或表單欄位；收合時僅保留 header 與右側 caret。';
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const sts=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'panel · header',name:'Variant × State（每格一個摺疊項；expanded 顯示 body、caret 朝上）',
        rows:vs,cols:sts,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(STN[s][0],STN[s][1]),
        cell:(v,s)=>cpsPanel(v,s,{title:M_TITLE,body:M_BODY}),mincol:300})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × State 矩陣','列＝三種風格、欄＝四種狀態；expanded 顯示 body 且 caret 旋轉 180°、hover 為底色變化（填色整張再深一階）、disabled 降透明。外框有框圓角、填色整張帶 --panel-2 底色卡、極簡只留底部分隔線。');
    p=panelsIn(sec);renderM();

    const acc=section(body,'Accordion 手風琴','三種風格各一組可點擊的手風琴，均為單開模式（展開一項會自動收合其他項）。點 header 即切換，caret 旋轉、body 往下展開並淡入（收合反向）。');
    const arow=ce('div','cps-acc-row');
    [['bordered','外框 bordered'],['filled','填色 filled'],['plain','極簡 plain']].forEach(([v,cap])=>{
      const col=ce('div','cps-acc-col');
      const c=ce('div','cps-acc-cap');c.innerHTML=`<b>${cap}</b>`;
      col.append(c,cpsAccordion(CPS_FAQ,{variant:v,multiple:false,firstOpen:true}));
      arow.appendChild(col);
    });
    acc.appendChild(arow);

    const sl=section(body,'互動預覽與程式碼','切 variant 與 indicator（chevron 箭頭或加減號指示）、勾 with-icon（左側前置圖示）與 multiple（允許多項同時展開，取消則為單開手風琴）；點各項 header 展開／收合，帶往下展開＋淡入動畫。');
    mountLive(sl,{
      initial:{variant:'bordered',indicator:'chevron',icon:false,multiple:false},
      segs:[
        {key:'variant',label:'Variant',options:['bordered','filled','plain'],labels:['外框','填色','極簡']},
        {key:'indicator',label:'Indicator',options:['chevron','plusminus'],labels:['箭頭','加減']}
      ],
      bools:[{key:'icon',label:'with-icon 前置圖示'},{key:'multiple',label:'multiple 多項同時展開'}],
      boolLabel:'Feature',
      render:st=>{
        const box=ce('div','cps-live-box');
        box.appendChild(cpsAccordion(CPS_FAQ,{variant:st.variant,multiple:st.multiple,icon:st.icon?CPS_ICON_QUESTION:null,indicator:st.indicator,firstOpen:true}));
        return box;
      },
      note:'點任一項 header 展開／收合，body 往下展開並淡入；<b>indicator</b> 可切 chevron（caret 旋轉 180°）或加減號（收合＋、展開−，不旋轉）；<b>multiple</b> 未勾時為手風琴（單開，展開新項自動收合前一項），勾選後可多項同時展開；<b>with-icon</b> 在標題左側加前置圖示。'
    });
  }

/* modal icons */
/* Modal 專用 icon：PulsoIcon warning-circle（regular）— popup 可選的頂部圓 icon（一般＝主色、警示＝紅） */
  const MDL_ICON_WARNING=PI('circle-alert');

/* modal build */
