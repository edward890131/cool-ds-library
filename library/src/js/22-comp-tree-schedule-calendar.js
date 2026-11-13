  /* ===== Table&Chart group build: tree-view ===== */
/* ==================== Tree View 樹狀（trv-）==================== */
/* 重用原子：ICON_CARET（展開箭頭・旋轉）、.cbx + ICON_CHECK（勾選樹）、IC_FOLDER / IC_FILE（分支/葉子 icon）
   無新增 icon const——需要的資料夾/檔案 icon 主檔都已存在 */

/* 單一節點（遞迴建 li）：d={name, ic:'folder'|'file', count, open, children, hover, sel, checked}
   o={variant:'lines'|'plain'|'checkbox', live, showIcon(預設true), showCount(預設true), onPick(row,d)} */
function trvNode(d,o){
  o=o||{};
  const hasKids=Array.isArray(d.children)&&d.children.length>0;
  const li=ce('li','trv-item'+((hasKids&&d.open)?' is-open':''));
  li.setAttribute('role','treeitem');
  if(hasKids)li.setAttribute('aria-expanded',d.open?'true':'false');

  const row=ce('div','trv-row'
    +(d.hover?' is-hover':'')                       // 矩陣格：靜態模擬 hover
    +(d.sel?' is-selected':'')
    +(o.live?' live':''));                          // Live/showcase 才吃真實 :hover

  /* 展開箭頭：有子節點才有；葉子放同寬 spacer 讓縮排對齊 */
  const car=ce('span','trv-caret'+(hasKids?'':' trv-blank'));
  if(hasKids)car.innerHTML=ICON_CARET;
  row.appendChild(car);

  /* checkbox variant：列內重用 .cbx 原子（sz-s） */
  if(o.variant==='checkbox'){
    const cb=ce('span','cbx sz-s '+(d.checked?'st-checked':'st-default'));
    if(d.checked)cb.innerHTML=ICON_CHECK;
    cb.setAttribute('role','checkbox');
    cb.setAttribute('aria-checked',d.checked?'true':'false');
    row.appendChild(cb);
  }

  /* 分支/葉子 icon：IC_FOLDER / IC_FILE（showIcon 可關） */
  if(o.showIcon!==false){
    const ic=ce('span','trv-ic');
    ic.innerHTML=(d.ic==='file'?IC_FILE:IC_FOLDER);
    row.appendChild(ic);
  }

  const nm=ce('span','trv-name');nm.textContent=d.name;row.appendChild(nm);

  /* 右側 count／檔案大小（showCount 可關） */
  if(o.showCount!==false&&d.count!=null){
    const ct=ce('span','trv-count');ct.textContent=d.count;row.appendChild(ct);
  }
  li.appendChild(row);

  if(hasKids){
    const ul=ce('ul','trv-children');
    ul.setAttribute('role','group');
    d.children.forEach(c=>ul.appendChild(trvNode(c,o)));
    li.appendChild(ul);
  }

  /* Live 真實互動：點箭頭展開/收合（不觸發選取）、點列選取、點 cbx 只切換勾選 */
  if(o.live){
    if(hasKids)car.addEventListener('click',e=>{
      e.stopPropagation();
      const open=li.classList.toggle('is-open');
      li.setAttribute('aria-expanded',open?'true':'false');
      slideToggle(li.querySelector(':scope > .trv-children'),open); // Motion v1：沿用 collapse 的高度展開
    });
    row.addEventListener('click',e=>{
      const cb=e.target.closest?e.target.closest('.cbx'):null;
      if(cb){                                        // 勾選框：只切換勾選、不選取列
        e.stopPropagation();
        const on=cb.classList.toggle('st-checked');
        cb.classList.toggle('st-default',!on);
        cb.innerHTML=on?ICON_CHECK:'';
        cb.setAttribute('aria-checked',on?'true':'false');
        return;
      }
      if(o.onPick)o.onPick(row,d);
    });
  }
  return li;
}

/* 一棵樹：data=節點陣列；o 同 trvNode。live 時內建單選互斥（點列清掉其他 is-selected） */
function trvTree(data,o){
  o=o||{};
  const ul=ce('ul','trv-tree trv-v-'+(o.variant||'plain'));
  ul.setAttribute('role','tree');
  if(o.live&&!o.onPick){
    o.onPick=row=>{
      ul.querySelectorAll('.trv-row.is-selected').forEach(r=>r.classList.remove('is-selected'));
      row.classList.add('is-selected');
    };
  }
  data.forEach(d=>ul.appendChild(trvNode(d,o)));
  return ul;
}

/* 範例資料（檔案總管）：每次呼叫回傳全新物件，避免 Live 重畫共用狀態；open 控制資料夾初始展開 */
function trvSample(open){
  return [
    {name:'專案文件',ic:'folder',count:'8',open:open,children:[
      {name:'設計稿',ic:'folder',count:'3',open:open,children:[
        {name:'首頁-v2.fig',ic:'file',count:'2.4 MB'},
        {name:'元件庫.fig',ic:'file',count:'8.1 MB'},
        {name:'流程圖.fig',ic:'file',count:'1.2 MB'},
      ]},
      {name:'規格書',ic:'folder',count:'2',open:open,children:[
        {name:'PRD-v1.md',ic:'file',count:'36 KB'},
        {name:'API 規格.md',ic:'file',count:'52 KB'},
      ]},
      {name:'會議記錄.md',ic:'file',count:'12 KB'},
    ]},
    {name:'共用資源',ic:'folder',count:'4',open:open,children:[
      {name:'品牌素材',ic:'folder',count:'2',open:false,children:[
        {name:'logo.svg',ic:'file',count:'8 KB'},
        {name:'配色表.png',ic:'file',count:'214 KB'},
      ]},
      {name:'字型授權.pdf',ic:'file',count:'1.1 MB'},
    ]},
  ];
}

/* 矩陣格：一棵三層小樹靜態呈現該 variant × state；hover/selected 落在「設計稿」列 */
function trvCell(v,s){
  const data=[
    {name:'專案文件',ic:'folder',count:'3',open:true,checked:v==='checkbox',children:[
      {name:'設計稿',ic:'folder',count:'2',open:true,
        hover:s==='hover',sel:s==='selected',checked:v==='checkbox',children:[
        {name:'首頁-v2.fig',ic:'file',count:'2.4 MB',checked:v==='checkbox'},
        {name:'元件庫.fig',ic:'file',count:'8.1 MB'},
      ]},
      {name:'會議記錄.md',ic:'file',count:'12 KB'},
    ]},
  ];
  const box=ce('div','trv-cellbox');
  box.appendChild(trvTree(data,{variant:v}));        // 靜態：不掛 live、不綁事件
  return box;
}

function buildTreeView(view){
  const body=viewScaffold(view,{eyebrow:'L3 Component · Tree View',title:'Tree View 樹狀',
    lede:'階層資料的<b>樹狀清單</b>：可展開／收合節點（重用 <b>ICON_CARET</b>，收合時轉 -90°）、依 depth 縮排、資料夾／檔案 icon（<b>IC_FOLDER／IC_FILE</b>）、選取列淡藍底。三 variant：<b>lines 連接線</b>（L 形引導線・--line token）、<b>plain 無線</b>(純縮排)、<b>checkbox 勾選樹</b>（重用 <b>.cbx</b> 原子多選）。',
    specRows:[['axes','<code>variant × state</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>semantic.*.tree.*</code>'],['reuse','ICON_CARET / .cbx / IC_FOLDER / IC_FILE']]});
  const axes=DIAL_SPECS['tree-view'].axes, zh=DIAL_SPECS['tree-view'].zh, active=CHOICE['tree-view'].active; // 接中央 store（hyphen id 用括號取值）
  const VN={lines:['連接線','lines'],plain:['無線','plain'],checkbox:['勾選樹','checkbox']};
  const STN={default:['預設','default'],hover:['滑過','hover'],selected:['選取','selected']};
  let p;
  function renderM(){ if(!p)return; p.innerHTML='';
    const vs=axes.variant.filter(v=>active.variant.has(v));
    const ss=axes.state.filter(s=>active.state.has(s));
    p.appendChild(matrixPanel({badge:'tree-view',name:'Variant × State',rows:vs,cols:ss,
      rowLab:v=>labHTML(VN[v][0],VN[v][1]),
      colLab:s=>labHTML(STN[s][0],STN[s][1]),
      cell:(v,s)=>trvCell(v,s),mincol:250})); }
  mountDial(body,{axes,zh,active,onRender:renderM});
  const sec=section(body,'Variant × State 矩陣','列＝三 variant、欄＝狀態（靜態呈現，hover 以 is-hover 模擬）。每格為一棵三層小樹；hover／selected 狀態落在中段「設計稿」節點——selected 為淡藍底＋名稱轉主色。');
  p=panelsIn(sec);renderM();

  /* ---- Showcase：三 variant 各一棵完整可互動樹 ---- */
  const sw=section(body,'檔案總管 Showcase','三 variant 各一棵完整樹，真實可互動：點<b>箭頭</b>展開／收合（箭頭旋轉）、點<b>列</b>選取（單選互斥・淡藍底）、checkbox 樹點<b>勾選框</b>多選（不觸發選取）。');
  const grid=ce('div','trv-show-grid');
  [['lines','連接線 lines'],['plain','無線 plain'],['checkbox','勾選樹 checkbox']].forEach(pair=>{
    const col=ce('div','trv-show-col');
    const cap=ce('div','trv-show-cap');cap.textContent=pair[1];col.appendChild(cap);
    const bx=ce('div','trv-box');
    bx.appendChild(trvTree(trvSample(true),{variant:pair[0],live:true}));
    col.appendChild(bx);grid.appendChild(col);
  });
  sw.appendChild(grid);

  /* ---- 互動預覽與程式碼 ---- */
  const sl=section(body,'互動預覽與程式碼','切換 variant 與內容開關，即時重畫整棵樹；點箭頭展開／收合、點列選取、勾選樹點 cbx 多選皆為真實互動。');
  mountLive(sl,{
    initial:{variant:'lines',showIcon:true,showCount:true,defaultOpen:true},
    segs:[{key:'variant',label:'Variant',options:['lines','plain','checkbox'],labels:['lines 連接線','plain 無線','checkbox 勾選樹']}],
    bools:[
      {key:'showIcon',label:'showIcon 圖示'},
      {key:'showCount',label:'showCount 計數／大小'},
      {key:'defaultOpen',label:'defaultOpen 預設展開'},
    ],
    boolLabel:'Content',
    render:st=>{
      const box=ce('div','trv-box');box.style.width='420px';box.style.maxWidth='100%'; // Live 固定寬 420px
      box.appendChild(trvTree(trvSample(st.defaultOpen),{
        variant:st.variant,live:true,showIcon:st.showIcon,showCount:st.showCount}));
      return box;
    },
    note:'點<b>箭頭</b>展開／收合（ICON_CARET 旋轉）、點<b>列</b>選取（單選互斥）。每個開關都對應可見變化：<b>showIcon</b> 收掉資料夾/檔案 icon、<b>showCount</b> 收掉右側計數/大小、<b>defaultOpen</b> 切資料夾初始展開/收合；lines 連接線由 variant 控制。'
  });
}

  /* ===== Table&Chart group build: schedule-chart ===== */
/* ==================== Schedule Chart 排程圖（gnt-）==================== */
/* 重用原子：.tg（任務／節點狀態：進行中 i-brand／完成 i-neutral／延遲 i-danger／待開始 outline）、
   IC_CLOCK（timeline 時間列，既有 icon）。無新增 icon const。
   三 variant：gantt 甘特圖／week 週排程／timeline 垂直時間軸 × size m 標準／s 精簡。
   橫條／事件塊系列色一律綁 token（--accent/--ok/--warn/--i-danger），格線 --line、字 --muted/--faint。 */

/* 狀態 → .tg 標籤（重用 Tag 原子，不重畫） */
function gntTag(st){
  const map={active:['進行中','i-brand','v-soft'],done:['完成','i-neutral','v-soft'],
             delay:['延遲','i-danger','v-soft'],todo:['待開始','i-neutral','v-outline']};
  const m=map[st]||map.active;
  const t=ce('div','tg '+m[2]+' c-round '+m[1]+' st-default');
  t.innerHTML='<span>'+m[0]+'</span>';
  return t;
}

/* --- 示意資料 --- */
/* gantt：s/e＝起訖日 index（0-based，e 不含）；c＝系列色；prog＝進度 %；st＝狀態（接 .tg） */
const GNT_TASKS=[
  {name:'需求訪談',s:0,e:3,c:'ok',st:'done',prog:100},
  {name:'線框設計',s:2,e:6,c:'ok',st:'done',prog:100},
  {name:'視覺設計',s:5,e:9,c:'accent',st:'active',prog:60},
  {name:'前端開發',s:7,e:12,c:'accent',st:'active',prog:35},
  {name:'API 串接',s:8,e:11,c:'warn',st:'delay',prog:20},
  {name:'測試驗收',s:11,e:14,c:'danger',st:'todo',prog:0}
];
const GNT_TASKS_SM=[                                             /* 矩陣格縮小版：3 任務 × 8 天 */
  {name:'需求',s:0,e:3,c:'ok',st:'done',prog:100},
  {name:'設計',s:2,e:6,c:'accent',st:'active',prog:55},
  {name:'開發',s:5,e:8,c:'warn',st:'delay',prog:20}
];
/* week：d＝星期（0=一）；s＝起始時段 index（0=09:00）；du＝跨幾個時段；tm＝起始時間 */
const GNT_WEVENTS=[
  {d:0,s:0,du:2,t:'產品週會',c:'accent',tm:'09:00'},
  {d:1,s:3,du:1,t:'需求訪談',c:'ok',tm:'12:00'},
  {d:2,s:1,du:3,t:'設計衝刺',c:'warn',tm:'10:00'},
  {d:3,s:5,du:2,t:'用戶測試',c:'accent',tm:'14:00'},
  {d:4,s:2,du:2,t:'版本回顧',c:'danger',tm:'11:00'},
  {d:5,s:4,du:2,t:'工作坊',c:'ok',tm:'13:00'}
];
const GNT_WEVENTS_SM=[                                           /* 矩陣格縮小版：5 時段內 */
  {d:0,s:0,du:2,t:'週會',c:'accent',tm:'09:00'},
  {d:2,s:1,du:3,t:'衝刺',c:'warn',tm:'10:00'},
  {d:4,s:2,du:2,t:'回顧',c:'ok',tm:'11:00'},
  {d:5,s:3,du:1,t:'測試',c:'danger',tm:'12:00'}
];
/* timeline：tm＝時間；t＝標題；d＝描述；st＝狀態（接 .tg 與節點圓點色） */
const GNT_TLNODES=[
  {tm:'09:30',t:'需求確認會議',d:'與客戶對齊本期範圍與交付項目',st:'done'},
  {tm:'11:00',t:'線框稿評審',d:'PM／工程雙方確認資訊架構',st:'done'},
  {tm:'14:00',t:'視覺設計交付',d:'主頁與列表頁 hi-fi 稿上傳 Figma',st:'active'},
  {tm:'16:30',t:'前端切版排程',d:'依交付稿拆 component 工單',st:'delay'},
  {tm:'18:00',t:'每日站會回顧',d:'同步進度與風險',st:'todo'}
];

/* 週末判定：示意月份 7/01 為週一 → 7/05、7/06（index 4、5）與 7/12、7/13（11、12）為週末 */
function gntIsWkend(i){const w=i%7;return w===4||w===5;}

/* ---- variant 1：gantt 甘特圖 ----
   o={live, prog(進度填色,預設開), wkend(週末標記,預設開), today(今日線,預設開), tasks, days, todayIx, compact} */
function gntGantt(size,o){
  o=o||{};
  const tasks=o.tasks||GNT_TASKS, days=o.days||14, todayIx=o.todayIx==null?9:o.todayIx;
  const box=ce('div','gnt-box gnt-gantt gnt-sz-'+size
    +(o.live?' live':'')+(o.prog===false?' no-prog':'')+(o.compact?' gnt-g-compact':''));
  /* 左：任務名欄（名稱 + .tg 狀態標） */
  const side=ce('div','gnt-g-side');
  const sh=ce('div','gnt-g-side-head');sh.textContent='任務';side.appendChild(sh);
  tasks.forEach(t=>{
    const r=ce('div','gnt-g-task');
    const n=ce('span','gnt-g-name');n.textContent=t.name;r.appendChild(n);
    r.appendChild(gntTag(t.st));
    side.appendChild(r);
  });
  /* 右：日期表頭 + 格線背景 + 橫條列（過寬容器內捲動） */
  const scroll=ce('div','gnt-g-scroll');
  const main=ce('div','gnt-g-main');
  const head=ce('div','gnt-g-head');
  for(let i=0;i<days;i++){
    const h=ce('div','gnt-g-hcell'
      +(o.wkend!==false&&gntIsWkend(i)?' is-wkend':'')
      +(o.today!==false&&i===todayIx?' is-today':''));
    h.textContent='7/'+String(i+1).padStart(2,'0');
    head.appendChild(h);
  }
  main.appendChild(head);
  const rows=ce('div','gnt-g-rows');
  tasks.forEach(t=>{
    const row=ce('div','gnt-g-row');
    for(let i=0;i<days;i++)row.appendChild(ce('div','gnt-g-cell'+(o.wkend!==false&&gntIsWkend(i)?' is-wkend':''))); /* 每列 in-flow 格線 cell（含週末底），取代原絕對定位背景層 */
    const bar=ce('div','gnt-bar c-'+t.c);bar.style.setProperty('--i',rows.children.length); // Motion v1：逐列接續
    bar.style.left=(t.s/days*100)+'%';                           /* 依起訖日以 % 定位／設寬 */
    bar.style.width=((t.e-t.s)/days*100)+'%';
    const fill=ce('div','gnt-bar-fill');fill.style.width=t.prog+'%';bar.appendChild(fill);
    const lab=ce('span','gnt-bar-lab');lab.textContent=t.prog+'%';bar.appendChild(lab);
    bar.title=t.name+'（'+t.prog+'%）';
    row.appendChild(bar);rows.appendChild(row);
  });
  if(o.today!==false){                                           /* 今日線：accent 直線 + 頂端小籤 */
    const tl=ce('div','gnt-today');tl.style.left=((todayIx+0.5)/days*100)+'%';
    const pin=ce('span','gnt-today-pin');pin.textContent='今日';tl.appendChild(pin);
    rows.appendChild(tl);
  }
  main.appendChild(rows);scroll.appendChild(main);
  box.append(side,scroll);
  return box;
}

/* ---- variant 2：week 週排程 ----
   o={live, times(時段標籤,預設開), detail(事件細節,預設開), events, slots, compact} */
function gntWeek(size,o){
  o=o||{};
  const evts=o.events||GNT_WEVENTS, slots=o.slots||8, hasT=o.times!==false;
  const box=ce('div','gnt-box gnt-week gnt-sz-'+size+(o.live?' live':'')+(o.compact?' gnt-w-compact':''));
  const g=ce('div','gnt-w-grid');
  /* 欄列模板依「有無時段欄」與時段數計算（版面數學，非樣式 token） */
  g.style.gridTemplateColumns=(hasT?'var(--gnt-timew) ':'')+'repeat(7,minmax(0,1fr))';
  g.style.gridTemplateRows='auto repeat('+slots+',var(--gnt-slot))';
  const off=hasT?2:1;                                            /* 天欄的 grid column 起點 */
  if(hasT)g.appendChild(ce('div','gnt-w-corner'));
  ['一','二','三','四','五','六','日'].forEach((d,i)=>{
    const h=ce('div','gnt-w-dhead'+(i===0&&!hasT?' first':'')+(i>=5?' is-wkend':''));
    h.textContent='週'+d;g.appendChild(h);
  });
  for(let s=0;s<slots;s++){
    if(hasT){
      const t=ce('div','gnt-w-time');t.textContent=String(9+s).padStart(2,'0')+':00';
      t.style.gridRow=String(s+2);t.style.gridColumn='1';g.appendChild(t);
    }
    for(let d=0;d<7;d++){
      const c=ce('div','gnt-w-cell'+(s===0?' firstrow':'')+(d===0&&!hasT?' firstcol':'')+(d>=5?' is-wkend':''));
      c.style.gridRow=String(s+2);c.style.gridColumn=String(d+off);
      g.appendChild(c);
    }
  }
  evts.forEach(e=>{
    const b=ce('div','gnt-evt c-'+e.c);
    b.style.gridColumn=String(e.d+off);
    b.style.gridRow=(e.s+2)+' / span '+e.du;                     /* 事件跨時段＝grid-row span */
    b.innerHTML='<span class="t">'+e.t+'</span>'
      +(o.detail!==false?'<span class="tm">'+e.tm+'–'+String(9+e.s+e.du).padStart(2,'0')+':00</span>':'');
    b.title=e.t;
    g.appendChild(b);
  });
  box.appendChild(g);
  return box;
}

/* ---- variant 3：timeline 垂直時間軸 ----
   o={live, tags(狀態 tag,預設開), line(連接線,預設開), nodes, compact} */
function gntTimeline(size,o){
  o=o||{};
  const nodes=o.nodes||GNT_TLNODES;
  const box=ce('div','gnt-box gnt-tl gnt-sz-'+size+(o.live?' live':'')+(o.line===false?' no-line':''));
  nodes.forEach((n,i)=>{
    const it=ce('div','gnt-tl-item');
    const rail=ce('div','gnt-tl-rail');                          /* 左軌：圓點 + 連接線 */
    rail.appendChild(ce('span','gnt-tl-dot st-'+n.st));
    if(i<nodes.length-1)rail.appendChild(ce('span','gnt-tl-cord'));
    it.appendChild(rail);
    const card=ce('div','gnt-tl-card');                          /* 事件卡：時間 + tag + 標題 + 描述 */
    const top=ce('div','gnt-tl-top');
    const tm=ce('span','gnt-tl-time');tm.innerHTML=IC_CLOCK+'<span>'+n.tm+'</span>';
    top.appendChild(tm);
    if(o.tags!==false)top.appendChild(gntTag(n.st));
    card.appendChild(top);
    const tt=ce('div','gnt-tl-title');tt.textContent=n.t;card.appendChild(tt);
    if(n.d&&!o.compact){const de=ce('div','gnt-tl-desc');de.textContent=n.d;card.appendChild(de);}
    it.appendChild(card);
    box.appendChild(it);
  });
  return box;
}

/* ---- 矩陣格：該 variant × size 的縮小示意（靜態呈現） ---- */
function gntCell(variant,size){
  const wrap=ce('div','gnt-cellwrap');
  if(variant==='gantt')wrap.appendChild(gntGantt(size,{compact:true,tasks:GNT_TASKS_SM,days:8,todayIx:5}));
  else if(variant==='week')wrap.appendChild(gntWeek(size,{compact:true,slots:5,detail:false,events:GNT_WEVENTS_SM}));
  else wrap.appendChild(gntTimeline(size,{compact:true,nodes:GNT_TLNODES.slice(1,4)}));
  return wrap;
}

function buildScheduleChart(view){
  const body=viewScaffold(view,{eyebrow:'L3 Component · Schedule Chart',title:'Schedule Chart 排程圖',
    lede:'專案排程／時段視覺化：<b>gantt 甘特圖</b>（左任務欄＋日期軸，每列一條依起訖日定位的圓角橫條，可疊進度填色／週末標記／今日線）、<b>week 週排程</b>（7 天欄 × 時段列，事件方塊落格、可跨時段）、<b>timeline 時間軸</b>（垂直節點：圓點＋連接線＋事件卡）。× size <b>m 標準／s 精簡</b>。純 DOM＋CSS 排版無外部圖表庫；橫條／事件系列色綁 <code>--accent/--ok/--warn/--i-danger</code>，狀態標重用 <b>Tag（.tg）</b>，時間 icon 重用既有 <b>IC_CLOCK</b>。',
    specRows:[['axes','<code>variant × size</code>'],['formula','<code>3 × 2 = 6</code>'],
      ['atoms','<code>.tg · IC_CLOCK</code>'],['series','<code>accent / ok / warn / danger</code>'],
      ['token-policy','<code>semantic.*.schedule.*</code>'],['slots','tasks / days / events / slots / nodes']]});
  const axes=DIAL_SPECS['schedule-chart'].axes, zh=DIAL_SPECS['schedule-chart'].zh, active=CHOICE['schedule-chart'].active; // 接中央 store（hyphen id 用括號取值）
  const VN={gantt:['甘特圖','gantt'],week:['週排程','week'],timeline:['時間軸','timeline']};
  const SN={m:['標準','m'],s:['精簡','s']};
  let p;
  function renderM(){ if(!p)return; p.innerHTML='';
    const vs=axes.variant.filter(v=>active.variant.has(v));
    const ss=axes.size.filter(s=>active.size.has(s));
    p.appendChild(matrixPanel({badge:'schedule-chart',name:'Variant × Size（縮小示意；s 精簡＝更矮列高、隱藏狀態標／描述）',
      rows:vs,cols:ss,
      rowLab:v=>labHTML(VN[v][0],VN[v][1]),
      colLab:s=>labHTML(SN[s][0],SN[s][1]),
      cell:(v,s)=>gntCell(v,s),mincol:300})); }
  mountDial(body,{axes,zh,active,onRender:renderM});
  const sec=section(body,'Variant × Size 矩陣','列＝三型態（甘特圖／週排程／時間軸）、欄＝兩尺寸；格內為縮小示意（甘特 3 任務 × 8 天、週排程 5 時段、時間軸 3 節點）。');
  p=panelsIn(sec);renderM();

  /* Showcase：三 variant 各一張較完整範例（size m、live 真實 hover） */
  const sw=section(body,'Showcase 範例','三種 variant 的完整組合：甘特圖 6 任務 × 14 天（進度填色＋週末標記＋今日線）、週排程一週 6 個事件（可跨時段）、時間軸 5 個節點（狀態 tag＋連接線）。滑上橫條／事件／卡片看真實 hover。');
  const rd=ce('div','row-demo');
  [['gantt 甘特圖 · 6 任務 × 14 天',()=>gntGantt('m',{live:true})],
   ['week 週排程 · 一週 6 事件',()=>gntWeek('m',{live:true})],
   ['timeline 時間軸 · 5 節點',()=>gntTimeline('m',{live:true})]
  ].forEach(([cap,fn])=>{const it=ce('div','demo-item');it.style.maxWidth='100%';it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
  sw.appendChild(rd);

  /* Live：segs 切 variant／size；勾選項依 variant 條件顯示（避免空轉開關） */
  const sl=section(body,'互動預覽與程式碼','切 variant／size 即時重組；勾選項隨 variant 切換——甘特圖：進度填色／週末標記／今日線；週排程：時段標籤／事件細節；時間軸：狀態 tag／連接線。');
  const GNT_BOOL_OWNER=['gantt','gantt','gantt','week','week','timeline','timeline']; // 勾選項 ↔ 所屬 variant（與 bools 順序一致）
  mountLive(sl,{
    initial:{variant:'gantt',size:'m',prog:true,wkend:true,today:true,times:true,detail:true,tags:true,line:true},
    segs:[{key:'variant',label:'Variant',options:['gantt','week','timeline'],labels:['甘特圖','週排程','時間軸']},
          {key:'size',label:'Size',options:['s','m']}],
    bools:[{key:'prog',label:'進度填色'},{key:'wkend',label:'週末標記'},{key:'today',label:'今日線'},
           {key:'times',label:'時段標籤'},{key:'detail',label:'事件細節'},
           {key:'tags',label:'狀態 tag'},{key:'line',label:'連接線'}],
    boolLabel:'Options（依 variant 顯示）',
    render:st=>{
      /* 條件顯示：只留當前 variant 有意義的勾選項（控制列只建一次，改用 display 切換） */
      sl.querySelectorAll('.checks .chk').forEach((c,i)=>{c.style.display=GNT_BOOL_OWNER[i]===st.variant?'':'none';});
      if(st.variant==='gantt')return gntGantt(st.size,{live:true,prog:st.prog,wkend:st.wkend,today:st.today});
      if(st.variant==='week')return gntWeek(st.size,{live:true,times:st.times,detail:st.detail});
      return gntTimeline(st.size,{live:true,tags:st.tags,line:st.line});
    },
    note:'甘特圖：關「進度填色」整條轉實色、關「週末標記」拿掉灰底欄、關「今日線」移除 accent 直線；週排程：關「時段標籤」收起左欄、關「事件細節」只留標題；時間軸：關「狀態 tag」拿掉 .tg、關「連接線」只剩節點圓點。hover 為真實 <code>:hover</code>（橫條增亮／事件加深／卡片浮起）。'
  });
}

  /* ===== Table&Chart group build: calendar ===== */
  /* ==================== Calendar 日曆時間（cal-）==================== */
  /* 日期時間選擇：month 月曆／range 日期區間／time 時間清單 × size m／s。
     表頭上下月鈕重用 .btn v-text i-secondary icon-only 原子；time 表頭重用既有 IC_CLOCK。
     ‼️ 勿用 Date.now / new Date（環境不穩）：示意日期全部寫死——「今日」＝2026 年 7 月 16、
     選取＝18、區間＝12–16、事件日＝3/10/16/21/24、停用日＝5/26；月份切換用純數學（Zeller）推算。 */

  /* 新增 icon：既有只有 ICON_CARET（朝下）與 LST_IC_CHEVRON（lst- 專用），故補左右 caret（PulsoIcon ） */
  const CAL_IC_CARET_L=PI('chevron-left');
  const CAL_IC_CARET_R=PI('chevron-right');

  /* ---- 純數學日曆工具（不碰 Date）---- */
  function calLeap(y){return (y%4===0&&y%100!==0)||y%400===0;} // 閏年判斷
  function calDim(y,m){return [31,calLeap(y)?29:28,31,30,31,30,31,31,30,31,30,31][m-1];} // 該月天數
  function calDow(y,m,d){ // Zeller 公式：回傳星期 0=日 … 6=六
    if(m<3){m+=12;y--;}
    const K=y%100,J=Math.floor(y/100);
    const h=(d+Math.floor(13*(m+1)/5)+K+Math.floor(K/4)+Math.floor(J/4)+5*J)%7; // 0=六
    return (h+6)%7;
  }
  function calDoy(y,m,d){let n=d;for(let i=1;i<m;i++)n+=calDim(y,i);return n;} // 年內第幾天
  function calWeekNo(y,m,d){ // 該列（週日起算）的第幾週示意：取該週「週四」的年內天數 / 7 進位（近似 ISO）
    let dd=d+4,mm=m,yy=y;
    while(dd>calDim(yy,mm)){dd-=calDim(yy,mm);mm++;if(mm>12){mm=1;yy++;}}
    return Math.ceil(calDoy(yy,mm,dd)/7);
  }
  function calGridDays(y,m){ // 回傳 6×7=42 格 {y,m,d,out}：前後補上／下月的日
    const first=calDow(y,m,1), dim=calDim(y,m);
    const pm=m===1?12:m-1, py=m===1?y-1:y, pdim=calDim(py,pm);
    const nm=m===12?1:m+1, ny=m===12?y+1:y;
    const cells=[];
    for(let i=0;i<42;i++){
      const n=i-first+1;
      if(n<1)cells.push({y:py,m:pm,d:pdim+n,out:true});
      else if(n>dim)cells.push({y:ny,m:nm,d:n-dim,out:true});
      else cells.push({y:y,m:m,d:n,out:false});
    }
    return cells;
  }

  /* ---- 月曆／區間工廠：calMonthEl(size,o) ----
     o={range, y, m, today, selected, rs, re, events, disabled, weeknum, rangeText, live, interactive}
     today=null 可關今日標記；events 傳 [] 可關事件圓點；interactive=true 點日可選、上下月鈕可切月 */
  function calMonthEl(size,o){
    o=o||{};
    const range=!!o.range;
    const TY=2026,TM=7; // 「今日」寫死落在 2026 年 7 月
    const todayD=(o.today!==undefined)?o.today:16;
    const events=(o.events!==undefined)?o.events:[3,10,16,21,24];
    const dis=(o.disabled!==undefined)?o.disabled:[5,26]; // 每月 5、26 示意停用（公休日）
    let y=o.y||2026,m=o.m||7;
    let selY=o.selY||2026,selM=o.selM||7,sel=(o.selected!==undefined)?o.selected:18; // 單日選取（month 用）；selY／selM 供 date-picker 帶入
    let rY=2026,rM=7,rs=(o.rs!==undefined)?o.rs:12,re=(o.re!==undefined)?o.re:16,picking=false; // 區間起訖（range 用）

    const root=ce('div','cal cal-v-'+(range?'range':'month')+' cal-sz-'+size
      +(o.weeknum?' cal-has-wk':'')+(o.live?' live':''));

    /* 表頭：上下月鈕＝Button 原子（v-text icon-only） */
    const head=ce('div','cal-head');
    const prev=ce('button','btn v-text i-secondary sz-s icon-only'+(o.live?' live':''));
    prev.type='button';prev.setAttribute('aria-label','上一月');prev.innerHTML=CAL_IC_CARET_L;
    const title=ce('div','cal-head-title');
    const next=ce('button','btn v-text i-secondary sz-s icon-only'+(o.live?' live':''));
    next.type='button';next.setAttribute('aria-label','下一月');next.innerHTML=CAL_IC_CARET_R;
    head.append(prev,title,next);root.appendChild(head);

    const dow=ce('div','cal-dow');root.appendChild(dow);
    const grid=ce('div','cal-grid');grid.setAttribute('role','grid');root.appendChild(grid);
    let foot=null;
    if(range&&o.rangeText){foot=ce('div','cal-foot');root.appendChild(foot);}

    function ftxt(){ // 區間文字：已選 7/12 – 7/16（5 天）
      if(!foot)return;
      if(rs==null){foot.innerHTML='請點選起始日';}
      else if(re==null){foot.innerHTML='起 <b>'+rM+'/'+rs+'</b>，請再點選結束日';}
      else{foot.innerHTML='已選 <b>'+rM+'/'+rs+' – '+rM+'/'+re+'</b>（'+(re-rs+1)+' 天）';}
    }
    function draw(){
      title.textContent=y+' 年 '+m+' 月';
      dow.innerHTML='';
      if(o.weeknum){const w=ce('span','cal-dow-c cal-wk-head');w.textContent='週';dow.appendChild(w);}
      ['日','一','二','三','四','五','六'].forEach(t=>{const s=ce('span','cal-dow-c');s.textContent=t;dow.appendChild(s);});
      grid.innerHTML='';
      const cells=calGridDays(y,m);
      cells.forEach((c,i)=>{
        if(o.weeknum&&i%7===0){ // 每列開頭補週數
          const wk=ce('span','cal-wk');wk.textContent=calWeekNo(c.y,c.m,c.d);grid.appendChild(wk);
        }
        const b=ce('button','cal-day');b.type='button';b.textContent=c.d;
        const cur=!c.out;
        if(c.out)b.classList.add('is-out');
        if(cur&&dis.indexOf(c.d)>=0){b.classList.add('is-disabled');b.disabled=true;}
        if(cur&&y===TY&&m===TM&&todayD===c.d)b.classList.add('is-today');
        if(!range){
          if(cur&&y===selY&&m===selM&&sel===c.d){b.classList.add('is-selected');b.setAttribute('aria-selected','true');}
          if(cur&&events.indexOf(c.d)>=0)b.classList.add('has-event');
        }else if(cur&&y===rY&&m===rM&&rs!=null){
          if(c.d===rs)b.classList.add('is-range-start');
          if(re!=null&&c.d===re)b.classList.add('is-range-end');
          if(re!=null&&c.d>rs&&c.d<re)b.classList.add('is-in-range');
        }
        if(o.interactive&&cur&&!b.disabled){
          b.onclick=()=>{
            if(!range){selY=y;selM=m;sel=c.d;} // 單日：點誰選誰
            else if(!picking){rY=y;rM=m;rs=c.d;re=null;picking=true;} // 區間：第一下＝起點
            else if(y===rY&&m===rM&&c.d>=rs){re=c.d;picking=false;}   // 第二下（不早於起點）＝終點
            else{rY=y;rM=m;rs=c.d;re=null;}                            // 點得比起點早＝重新起算
            draw();
            if(o.onPick)o.onPick(range?{y:rY,m:rM,rs,re}:{y:selY,m:selM,d:sel}); // date-picker 取用：選完回傳
          };
        }
        grid.appendChild(b);
      });
      ftxt();
    }
    if(o.interactive){ // 上下月鈕切月（純數學推算，不碰 Date）
      prev.onclick=()=>{m--;if(m<1){m=12;y--;}draw();};
      next.onclick=()=>{m++;if(m>12){m=1;y++;}draw();};
    }
    draw();
    return root;
  }

  /* ---- 時間清單工廠：calTimeEl(size,o) ----
     o={selected(分鐘制), h24, step, live, interactive}；選項寫死 09:00–18:00，預設選中 09:30 */
  function calTimeEl(size,o){
    o=o||{};
    const step=o.step||30;
    const h24=(o.h24!==undefined)?o.h24:true;
    let sel=(o.selected!==undefined)?o.selected:570; // 570 分＝09:30（寫死示意）
    sel=Math.round(sel/step)*step; // 換 step 時貼齊最近選項
    const root=ce('div','cal cal-v-time cal-sz-'+size+(o.live?' live':''));
    const head=ce('div','cal-time-head'); // 表頭重用既有 IC_CLOCK
    head.innerHTML='<span class="cal-time-ic">'+IC_CLOCK+'</span><span>選擇時間</span>';
    root.appendChild(head);
    const list=ce('div','cal-time-list');
    const pad=n=>(n<10?'0':'')+n;
    function fmt(t){const h=Math.floor(t/60),mm=t%60;
      return h24?pad(h)+':'+pad(mm):(h<12?'上午':'下午')+' '+(((h+11)%12)+1)+':'+pad(mm);}
    for(let t=9*60;t<=18*60;t+=step){
      const it=ce('button','cal-time-item'+(t===sel?' is-selected':''));
      it.type='button';it.textContent=fmt(t);
      it.setAttribute('aria-selected',t===sel?'true':'false');
      if(o.interactive){
        it.onclick=()=>{sel=t;
          [...list.children].forEach(x=>{x.classList.remove('is-selected');x.setAttribute('aria-selected','false');});
          it.classList.add('is-selected');it.setAttribute('aria-selected','true');};
      }
      list.appendChild(it);
    }
    root.appendChild(list);
    return root;
  }

  /* 矩陣格：該 variant×size 的靜態縮影（不互動、示意值寫死） */
  function calCell(variant,size){
    if(variant==='time')return calTimeEl(size,{});
    return calMonthEl(size,{range:variant==='range'});
  }

  /* 日格狀態一覽用：單顆裸日格 */
  function calStateChip(cls,txt,event){
    const shell=ce('div','cal cal-sz-m cal-bare');
    const g=ce('div','cal-grid');
    const b=ce('button','cal-day'+(cls?' '+cls:'')+(event?' has-event':''));
    b.type='button';b.textContent=txt;
    if(cls&&cls.indexOf('is-disabled')>=0)b.disabled=true;
    g.appendChild(b);shell.appendChild(g);
    return shell;
  }

  function buildCalendar(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Calendar',title:'Calendar 日曆時間',
      lede:'日期時間選擇：<b>month 月曆</b>（單日選取）／<b>range 區間</b>（起訖實心＋中間淡 accent 連續帶）／<b>time 時間清單</b>（可捲動時段），各有 <b>m 標準／s 精簡</b> 兩尺寸。表頭上下月鈕重用 <b>Button</b> 原子（v-text icon-only）；日格狀態含一般／今日（accent 圈）／選取（accent 實心）／非本月（淡）／停用（劃掉）／有事件（下方圓點）。示意日期寫死在 <b>2026 年 7 月</b>（今日＝16、選取＝18、區間＝12–16），不依賴系統時間。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>3 × 2 = 6</code>'],['token-policy','<code>--accent / --i-primary-tint / --line</code>'],['a11y','<code>role=grid・aria-selected・aria-label 上/下月</code>']]});
    const axes=DIAL_SPECS.calendar.axes, zh=DIAL_SPECS.calendar.zh, active=CHOICE.calendar.active; // 接中央 store
    const VN={month:['月曆','month'],range:['區間','range'],time:['時間','time']};
    const SZN={m:['標準','m'],s:['精簡','s']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.size.filter(s=>active.size.has(s));
      p.appendChild(matrixPanel({badge:'calendar',name:'Variant × Size（三型態 × 兩尺寸）',
        desc:'列＝月曆／區間／時間、欄＝標準 m／精簡 s；示意月固定 2026 年 7 月',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(SZN[s][0]+'尺寸',SZN[s][1]),
        cell:(v,s)=>calCell(v,s),mincol:310}));
    }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','month＝今日 accent 圈＋選取實心＋事件圓點＋非本月淡＋停用劃掉；range＝起訖實心、中間淡 accent 連續帶；time＝時段清單選中高亮。矩陣為靜態呈現，互動請到下方 Live。');
    p=panelsIn(sec);renderM();

    /* 日格狀態一覽：六（＋滑過）種狀態並排 */
    const stt=section(body,'日格狀態 Day States','單一日格的七種狀態：一般／滑過／今日（accent 圈）／選取（accent 實心）／非本月（淡）／停用（劃掉）／有事件（下方小圓點）。');
    const srow=ce('div','cal-staterow');
    [['','一般','15',false],['is-hover','滑過','9',false],['is-today','今日','16',false],
     ['is-selected','選取','18',false],['is-out','非本月','2',false],
     ['is-disabled','停用','5',false],['','有事件','21',true]].forEach(a=>{
      const cell=ce('div','cal-statecell');
      cell.appendChild(calStateChip(a[0],a[2],a[3]));
      const cap=ce('div','cal-statecap');cap.textContent=a[1];
      cell.append(cap);
      srow.appendChild(cell);
    });
    stt.appendChild(srow);

    /* showcase：三 variant 各一（m 尺寸、真互動：點日可選、上下月可切、時段可點） */
    const ss2=section(body,'三型態完整範例','完整月曆／區間選取／時間清單並排（皆為 m 尺寸、真互動）：點日格試選取、按 ‹ › 切月、點時段試選中。');
    const shell=ce('div','row-demo');
    const row=ce('div','cal-show');
    [['month 完整月曆','今日圈＋選取實心＋事件圓點',()=>calMonthEl('m',{live:true,interactive:true})],
     ['range 區間選取','起訖實心、中間連續帶＋區間文字',()=>calMonthEl('m',{range:true,rangeText:true,live:true,interactive:true})],
     ['time 時間清單','09:00–18:00 每 30 分、可捲動',()=>calTimeEl('m',{live:true,interactive:true})]].forEach(([cap,sub,mk])=>{
      const it=ce('div','demo-item');
      it.appendChild(mk());
      const c=ce('div','cap');c.innerHTML='<b>'+cap+'</b> '+sub;it.appendChild(c);
      row.appendChild(it);
    });
    shell.appendChild(row);ss2.appendChild(shell);

    /* Live：segs=variant/size；bools 依 variant 動態換（month：今日/事件/週數；range：區間文字；time：24 小時/間隔 30 分）
       比照 Progress 頁前例手刻控制列（mountLive 的 bools 建一次就固定，無法跟著 variant 換） */
    const sl=section(body,'互動預覽與程式碼','切 variant／size；勾選項會跟著 variant 換組。月曆點日真的可選取、‹ › 真的可切月（切走再切回，今日圈只在 2026 年 7 月出現）；區間點兩下選起訖；時間清單點時段選中。');
    const st={variant:'month',size:'m',today:true,events:true,weeknum:false,rangeText:true,h24:true,step30:true};
    const wrap=ce('div','livewrap');
    const ctlRow=ce('div','ctl-row');
    const stage=ce('div','live-stage');
    function draw(){stage.innerHTML='';const box=ce('div','cal-live-stage');
      if(st.variant==='time'){
        box.appendChild(calTimeEl(st.size,{h24:st.h24,step:st.step30?30:60,live:true,interactive:true}));
      }else{
        box.appendChild(calMonthEl(st.size,{
          range:st.variant==='range',
          today:st.today?16:null,                      // 關掉＝今日圈消失
          events:(st.variant==='month'&&st.events)?[3,10,16,21,24]:[],
          weeknum:st.variant==='month'&&st.weeknum,
          rangeText:st.variant==='range'&&st.rangeText,
          live:true,interactive:true}));
      }
      stage.appendChild(box);}
    function calSeg(key,label,opts,labels){ // 比照 mountLive 的 seg 樣式
      const c=ce('div','ctl');c.innerHTML='<span class="lab">'+label+'</span>';
      const seg=ce('div','seg');
      opts.forEach((op,i)=>{const b=document.createElement('button');b.textContent=labels?labels[i]:op;
        b.setAttribute('aria-pressed',st[key]===op);
        b.onclick=()=>{st[key]=op;[...seg.children].forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');
          if(key==='variant')rebuildBools();draw();};
        seg.appendChild(b);});
      c.appendChild(seg);return c;}
    /* bools 依 variant 動態重建 */
    const CAL_BOOLS={
      month:[['today','今日標記'],['events','事件圓點']],
      range:[['rangeText','顯示已選區間文字']],
      time:[['h24','24 小時制'],['step30','間隔 30 分']]
    };
    const boolC=ce('div','ctl');boolC.innerHTML='<span class="lab">Options</span>';
    const checks=ce('div','checks');boolC.appendChild(checks);
    function rebuildBools(){checks.innerHTML='';
      CAL_BOOLS[st.variant].forEach(([k,lb])=>{
        const l=ce('label','chk');const i=document.createElement('input');i.type='checkbox';i.checked=!!st[k];
        i.onchange=()=>{st[k]=i.checked;draw();};
        l.append(i,document.createTextNode(lb));checks.appendChild(l);});}
    ctlRow.appendChild(calSeg('variant','Variant',['month','range','time'],['月曆','區間','時間']));
    ctlRow.appendChild(calSeg('size','Size',['s','m'],['s','m']));   /* 2026-11-10 由小到大、只用英文 */
    ctlRow.appendChild(boolC);
    wrap.append(ctlRow,stage);
    const note=ce('p','live-note');
    note.innerHTML='示意日期寫死 <b>2026 年 7 月</b>（今日＝16、事件＝3/10/16/21/24、停用＝每月 5/26），月份切換用純數學推算、不碰系統時間。<b>今日標記</b>關掉＝16 的 accent 圈消失；<b>事件圓點</b>關掉＝日格下方小點消失；<b>週數</b>開啟＝左側多一欄；<b>區間文字</b>＝月曆下緣顯示「已選 7/12 – 7/16（5 天）」；<b>24 小時制</b>關掉＝上午/下午格式；<b>間隔 30 分</b>關掉＝改每 60 分一格。';
    wrap.appendChild(note);
    sl.appendChild(wrap);rebuildBools();draw();
  }

