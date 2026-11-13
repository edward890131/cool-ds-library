  /* ===== Table&Chart group build: table ===== */
/* ===================== Table 資料表格（tbl-） =====================
   variant（bordered 格線／striped 斑馬紋／plain 簡潔）× density（comfortable 寬鬆／compact 緊湊）
   重用原子：.cbx（全選＋列選，含 st-indeterminate 半選）、.tg（狀態欄標籤）、.btn（排序鈕／分頁）、
             ICON_CHECK（勾）、ICON_CARET（排序方向／分頁箭頭）
   新增 icon：TBL_IC_SORT（PulsoIcon chevrons-up-down；表頭「未排序」中性指示） */

/* ---- 新增 icon：caret-up-down（未排序中性雙箭頭） ---- */
  const TBL_IC_SORT=PI('chevrons-up-down');

/* ---- 狀態欄標籤對照（重用 .tg 原子：完成 i-brand／進行中 i-neutral／逾期 i-danger） ---- */
  const TBL_STATUS={done:['完成','i-brand'],doing:['進行中','i-neutral'],late:['逾期','i-danger']};

/* ---- 示意資料池（每張表都取深拷貝，排序／選取互不污染） ---- */
  const TBL_DATA=[
    {name:'王小明',status:'done', amount:12800,date:'2026-07-02'},
    {name:'陳美華',status:'doing',amount:4600, date:'2026-07-05'},
    {name:'林志豪',status:'late', amount:23150,date:'2026-06-28'},
    {name:'張雅婷',status:'done', amount:8990, date:'2026-07-11'},
    {name:'李承翰',status:'doing',amount:1500, date:'2026-07-14'},
  ];

/* ---- 小工具 ---- */
  function tblFmt(n){return 'NT$ '+n.toLocaleString('en-US');}
  function tblCmp(x,y){return typeof x==='number'&&typeof y==='number'?x-y:String(x??'').localeCompare(String(y??''),'zh-Hant',{numeric:true});}   // 通用比較：數字比大小、文字依中文排序（含數字）                     // 金額格式化
  function tblTagEl(status){                                                       // 狀態標籤：重用 .tg
    const s=TBL_STATUS[status];
    const t=ce('div','tg v-soft c-round '+s[1]+' st-default');
    t.innerHTML='<span>'+s[0]+'</span>';return t;}
  function tblCbxEl(density,checked){                                              // 勾選框：重用 .cbx（緊湊縮 sz-s）
    const c=ce('div','cbx '+(density==='compact'?'sz-s':'sz-m')+' '+(checked?'st-checked':'st-default'));
    if(checked)c.innerHTML=ICON_CHECK;return c;}

/* ---- 分頁列（showcase 示意；直接重用 library Pagination 元件 pgBar，非自畫按鈕） ---- */
  function tblPagerEl(){
    const bar=ce('div','tbl-pgbar');
    const info=ce('div','tbl-pginfo');bar.appendChild(info);
    let cur=1;const total=3,per=5,all=13;                                          // 3 頁示意
    const nav=ce('div','tbl-pgnav');
    function draw(){
      const from=(cur-1)*per+1,to=Math.min(cur*per,all);
      info.textContent='共 '+all+' 筆 · 第 '+from+'-'+to+' 筆';
      nav.innerHTML='';
      nav.appendChild(pgBar('numbered','s',{total,current:cur,onNav:n=>{cur=Math.max(1,Math.min(total,n));draw();}})); // 用 Pagination 元件（pg-btn＋pgArrow）
    }
    draw();bar.appendChild(nav);
    return bar;}

/* ---- 欄位型別儲存格：文字按鈕（重用 Button v-text）／Dropdown（重用 Dropdown 元件） ---- */
  function tblActionEl(){                                                          // 文字按鈕儲存格
    const b=ce('button','btn v-text i-primary sz-s live tbl-actbtn');b.innerHTML='<span>檢視</span>';return b;}
  function tblOwnerEl(){                                                           // Dropdown 儲存格（可展開選單）
    const w=ddField('outline');w.classList.add('tbl-dd');return w;}

/* ---- 主要工廠：tblTable(variant,density,opts) → .tbl-wrap ----
   opts：checkbox 勾選欄／sortable 可排序表頭／zebra 額外斑馬紋／footer 總計列／pager 分頁列／cols 自訂欄位
         selected:[idx] 預選列／live 真實 hover／interactive 點列切選取／mini 矩陣小表（去日期欄、3 列）／simHover 靜態 hover 列 */
  function tblTable(variant,density,o){
    o=o||{};
    const rows=(o.data||(o.mini?TBL_DATA.slice(0,3):TBL_DATA)).map(d=>Object.assign({},d)); // 資料副本
    (o.selected||[]).forEach(i=>{if(rows[i])rows[i]._sel=true;});
    const zebra=variant==='striped'||!!o.zebra;                                    // v-striped 或 stripe 開關都算斑馬紋
    const wrap=ce('div','tbl-wrap tbl-v-'+variant+' tbl-dn-'+density+(zebra?' tbl-zebra':'')+(o.live?' live':'')+(o.cellTypes?' tbl-celltypes':'')+(o.mini?' tbl-mini':''));
    const table=ce('table','tbl');wrap.appendChild(table);
    const cols=o.cellTypes?[                                                       // 欄位型別展示表：文字／Tag／數字／Dropdown／文字按鈕
      {key:'name',  lab:'姓名',  sortable:false,cls:'tbl-name'},
      {key:'status',lab:'狀態',  sortable:false,cls:''},
      {key:'amount',lab:'金額',  sortable:false,cls:'tbl-num'},
      {key:'owner', lab:'負責人',sortable:false,cls:'tbl-owner'},
      {key:'action',lab:'操作',  sortable:false,cls:'tbl-action'},
    ]:(o.cols||[                                                                   // opts.cols：自訂欄位 [{key,lab,sortable,cls}]（table-toolbar 用；未知 key 以文字呈現）
      {key:'name',  lab:'姓名',sortable:true, cls:'tbl-name'},
      {key:'status',lab:'狀態',sortable:false,cls:''},
      {key:'amount',lab:'金額',sortable:true, cls:'tbl-num'},
      {key:'date',  lab:'日期',sortable:true, cls:'tbl-mut'},
    ]).filter(c=>!(o.mini&&c.key==='date'));                                        // 矩陣小表拿掉日期欄
    let sortKey=o.sortKey||null,sortAsc=o.sortAsc!==false;                         // 排序狀態（每張表獨立；o.sortKey／o.sortAsc 可帶初值）
    const interactive=!!o.live&&o.interactive!==false;

    const thead=ce('thead'),htr=ce('tr');thead.appendChild(htr);table.appendChild(thead);
    const tbody=ce('tbody');table.appendChild(tbody);
    let headCbx=null;

    function syncHead(){                                                           // 全選框三態同步（重用 .cbx st-indeterminate＋.dash）
      if(!headCbx)return;
      const n=rows.filter(r=>r._sel).length;
      headCbx.classList.remove('st-checked','st-indeterminate','st-default');
      if(n===rows.length&&n>0){headCbx.classList.add('st-checked');headCbx.innerHTML=ICON_CHECK;}
      else if(n>0){headCbx.classList.add('st-indeterminate');headCbx.innerHTML='<span class="dash"></span>';}
      else{headCbx.classList.add('st-default');headCbx.innerHTML='';}}

    function renderHead(){                                                         // 表頭（排序鈕重用 .btn v-text）
      htr.innerHTML='';
      if(o.checkbox){
        const th=ce('th','tbl-th tbl-col-cbx');
        headCbx=tblCbxEl(density,false);
        if(interactive)headCbx.addEventListener('click',()=>{                      // 點全選框：全選 ↔ 全不選
          const all=rows.every(r=>r._sel);
          rows.forEach(r=>{r._sel=!all;});renderBody();syncHead();});
        th.appendChild(headCbx);htr.appendChild(th);syncHead();}
      cols.forEach(c=>{
        const th=ce('th','tbl-th'+(c.key==='amount'||/\btbl-num\b/.test(c.cls||'')?' tbl-num':''));
        if(o.sortable&&c.sortable){
          const cur=sortKey===c.key;
          const b=ce('button','btn v-text i-secondary sz-s live tbl-sortbtn'+(cur?' is-active':''));
          b.innerHTML='<span>'+c.lab+'</span><span class="tbl-sortic'+(cur&&sortAsc?' tbl-asc':'')+'">'
            +(cur?ICON_CARET:TBL_IC_SORT)+'</span>';                               // 排序中：caret 升／降；未排序：中性雙箭頭
          b.setAttribute('aria-label',c.lab+'，'+(cur?(sortAsc?'目前由小到大，點擊改為由大到小':'目前由大到小，點擊改為由小到大'):'點擊排序'));
          b.addEventListener('click',()=>{
            if(o.onSort){o.onSort(c.key,sortKey===c.key?!sortAsc:true);return;}       // 外部排序（例：分頁表格要排整份資料）
            if(sortKey===c.key)sortAsc=!sortAsc;else{sortKey=c.key;sortAsc=true;}
            const first=flipFirst(tbody);renderHead();renderBody();flipPlay(tbody,first);}); // Motion v1：列從原位置平滑移到新位置
          th.appendChild(b);
        }else{th.textContent=c.lab;}
        htr.appendChild(th);});}

    function renderBody(){                                                         // 資料列
      tbody.innerHTML='';
      const rs=rows.slice();
      if(sortKey&&!o.onSort){const k=sortKey;rs.sort((a,b)=>{const r=tblCmp(a[k],b[k]);return sortAsc?r:-r;});}
      rs.forEach((d,i)=>{
        const tr=ce('tr','tbl-row'+(d._sel?' is-selected':'')+(o.simHover===i?' is-hover':''));tr.dataset.flip=String(rows.indexOf(d));
        if(o.checkbox){const td=ce('td','tbl-td tbl-col-cbx');td.appendChild(tblCbxEl(density,!!d._sel));tr.appendChild(td);}
        cols.forEach(c=>{
          const td=ce('td','tbl-td'+(c.cls?' '+c.cls:''));
          if(c.key==='status')td.appendChild(tblTagEl(d.status));
          else if(c.key==='amount')td.textContent=tblFmt(d.amount);
          else if(c.key==='owner')td.appendChild(tblOwnerEl());                     // Dropdown 儲存格
          else if(c.key==='action')td.appendChild(tblActionEl());                   // 文字按鈕儲存格
          else td.textContent=d[c.key];
          tr.appendChild(td);});
        if(interactive){                                                           // 點列切換選取，勾選框／全選框連動
          tr.style.cursor='pointer';
          tr.addEventListener('click',()=>{d._sel=!d._sel;renderBody();syncHead();});}
        tbody.appendChild(tr);});}

    renderHead();renderBody();

    if(o.footer){                                                                  // 表尾總計列（金額右對齊 tabular-nums）
      const tfoot=ce('tfoot'),ftr=ce('tr');
      const lab=ce('td','tbl-td tbl-ft tbl-ft-lab');lab.colSpan=(o.checkbox?1:0)+2;lab.textContent='總計';
      const amt=ce('td','tbl-td tbl-ft tbl-num');amt.textContent=tblFmt(rows.reduce((s,d)=>s+d.amount,0));
      ftr.append(lab,amt);
      if(cols.some(c=>c.key==='date'))ftr.appendChild(ce('td','tbl-td tbl-ft'));
      tfoot.appendChild(ftr);table.appendChild(tfoot);}

    if(o.pager)wrap.appendChild(tblPagerEl());                                     // 分頁列（重用 .btn）
    return wrap;}

/* ---- 矩陣格：tblCell(variant,density) → 小表（表頭＋3 列，呈現該組合外觀） ---- */
  function tblCell(variant,density){
    return tblTable(variant,density,{mini:true});}

/* ---- 頁面組裝 ---- */
  function buildTable(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Table',title:'Table 資料表格',
      lede:'資料密集場景的<b>表格容器</b>：可排序表頭 ＋ 資料列（斑馬紋／hover／選取）＋ 表尾總計／分頁。三種 variant——<b>bordered 格線</b>（完整直橫格線）、<b>striped 斑馬紋</b>（偶數列鋪淺灰）、<b>plain 簡潔</b>（只留表頭底線）；兩級 density——<b>comfortable 寬鬆</b>／<b>compact 緊湊</b>。重用 <b>.cbx</b>（全選含半選態／列選）、<b>.tg</b>（狀態欄）、<b>.btn</b>(排序鈕／分頁）；金額欄右對齊 tabular-nums。',
      specRows:[['axes','<code>variant × density</code>'],['formula','<code>3 × 2 = 6</code>'],['token-policy','<code>semantic.*.table.*</code>'],['slots','header（sortable）/ rows / footer（總計／分頁）']]});
    const axes=DIAL_SPECS.table.axes, zh=DIAL_SPECS.table.zh, active=CHOICE.table.active; // 接中央 store
    const VN={bordered:['格線','bordered'],striped:['斑馬紋','striped'],plain:['簡潔','plain']};
    const DN={comfortable:['寬鬆','comfortable'],compact:['緊湊','compact']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ds=axes.density.filter(d=>active.density.has(d));
      p.appendChild(matrixPanel({badge:'table',name:'Variant × Density（框線體系 × 密度）',
        rows:vs,cols:ds,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:d=>labHTML(DN[d][0],DN[d][1]),
        cell:(v,d)=>tblCell(v,d),mincol:300})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Density 矩陣','列＝框線體系（格線／斑馬紋／簡潔）、欄＝密度（寬鬆／緊湊）。每格是一張縮小示意表（表頭＋3 列）；斑馬紋偶數列鋪淺灰、簡潔款去外框只留表頭底線、緊湊款 padding 收窄且勾選框／標籤同步縮小。');
    p=panelsIn(sec);renderM();

    // ---- Cell Types：資料列可承載的欄位型別（文字／Tag／數字／Dropdown／文字按鈕） ----
    const ct=section(body,'Cell Types 欄位型別','一列資料格可承載五種欄位內容：<b>純文字</b>（姓名）、<b>Tag</b>（狀態，重用 .tg）、<b>數字</b>（金額右對齊 tabular-nums）、<b>Dropdown</b>（重用 Dropdown 元件、可點開選單）、<b>文字按鈕</b>（重用 Button v-text，可點）。同一套 <code>tblTable</code> 依欄位型別自動渲染對應原子，不另畫 primitive。');
    const ctDemo=ce('div','tbl-demo');
    ctDemo.appendChild(tblTable('bordered','comfortable',{cellTypes:true,live:true}));
    ct.appendChild(ctDemo);

    // ---- Showcase：完整表（checkbox 欄＋可排序表頭＋選取列＋狀態 tag＋金額＋表尾總計＋分頁），真實 hover ----
    const sc=section(body,'Showcase 完整範例','格線＋寬鬆的滿配表：左側勾選欄（全選框支援<b>半選</b>三態）、姓名／金額／日期表頭可點擊<b>排序</b>（升／降 caret 主色指示）、狀態欄重用 Tag、金額右對齊 tabular-nums、表尾總計＋分頁列（重用 Button）。滑鼠移到列上看真實 hover，<b>點列</b>切換選取（淡藍底＋勾選連動）。');
    const demo=ce('div','tbl-demo');
    demo.appendChild(tblTable('bordered','comfortable',{checkbox:true,sortable:true,footer:true,pager:true,live:true,selected:[1]}));
    sc.appendChild(demo);

    // ---- 互動預覽與程式碼：segs＝variant/density；每個開關都對應可見樣式 ----
    const sl=section(body,'互動預覽與程式碼','切 variant／density，勾選各 feature：checkbox 勾選欄、sortable 排序表頭、stripe 斑馬紋（bordered／plain 上疊加；striped 本身已含）、footer 總計列、selected 選取列示意。點列可切換選取（勾選框與全選框連動）、點表頭排序。');
    mountLive(sl,{
      initial:{variant:'bordered',density:'comfortable',checkbox:true,sortable:true,stripe:false,footer:true,selrow:true},
      segs:[
        {key:'variant',label:'Variant 型態',options:['bordered','striped','plain'],labels:['bordered 格線','striped 斑馬紋','plain 簡潔']},
        {key:'density',label:'Density 密度',options:['comfortable','compact'],labels:['comfortable 寬鬆','compact 緊湊']},
      ],
      bools:[
        {key:'checkbox',label:'checkbox 勾選欄'},
        {key:'sortable',label:'sortable 排序表頭'},
        {key:'stripe',label:'stripe 斑馬紋'},
        {key:'footer',label:'footer 總計列'},
        {key:'selrow',label:'selected 選取列示意'},
      ],
      boolLabel:'Features',
      render:st=>{
        const w=tblTable(st.variant,st.density,{
          checkbox:st.checkbox,sortable:st.sortable,zebra:st.stripe,footer:st.footer,
          selected:st.selrow?[1]:[],live:true});
        const box=ce('div');box.style.width='680px';box.style.maxWidth='100%';box.appendChild(w);return box; // Live 固定寬 680px
      },
      note:'每個開關都對應可見樣式：<b>checkbox</b> 開左側勾選欄（全選框支援半選三態）、<b>sortable</b> 表頭出現排序鈕（未排序中性雙箭頭、排序中主色 caret 升／降）、<b>stripe</b> 在 bordered／plain 上疊加斑馬紋（striped variant 本身已含）、<b>footer</b> 收總計列、<b>selected</b> 預選第二列示意。<b>hover</b> 滑鼠移上即見（斑馬紋表自動用更深一階）；點列切換選取、勾選框連動。'
    });
  }

  /* ===== Table&Chart group build: chart ===== */
  /* ==================== Chart 圖表（cht-）==================== */
  /* 儀表板圖表：stat 統計數字卡＋ line 折線／bar 長條／donut 甜甜圈迷你圖，全部 inline SVG 手刻（無外部 lib）。
     variant：stat／line／bar／donut × size：m 標準／s 精簡（精簡＝sparkline 式簡配：折線收掉格線端點、長條單系列、甜甜圈收圖例）。
     重用原子：stat 卡直接用 prMetricEl（含標題＋趨勢 delta，icon 走 IC_TRENDING）；圖例／delta 用 .tg；
     系列色一律綁 token：--accent／--ok／--warn／--i-danger；格線 --line、軸線 --line-strong；數字 tabular-nums。 */

  /* --- 示意資料池（固定不隨機，方便明暗／尺寸對照） --- */
  const CHT_LINE_DATA=[42,54,48,66,60,78,72,92,86,108];      // 折線：近 10 期上升趨勢
  const CHT_BAR_A=[64,92,78,110,88,120,72];                  // 長條系列 A（本週，--accent）
  const CHT_BAR_B=[48,70,90,84,64,96,58];                    // 長條系列 B（上週，--ok）
  const CHT_DONUT_SEGS=[                                     // 甜甜圈四段，各綁一個 intent 色 token
    {k:'已完成',v:46,c:'--accent',dot:'c-accent'},
    {k:'進行中',v:26,c:'--ok',dot:'c-ok'},
    {k:'待處理',v:18,c:'--warn',dot:'c-warn'},
    {k:'逾期',v:10,c:'--i-danger',dot:'c-danger'}
  ];
  const CHT_XCATS=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月']; // 折線 x 類別
  const CHT_BAR_CATS=['週一','週二','週三','週四','週五','週六','週日'];        // 長條 x 類別
  const SVGNS='http://www.w3.org/2000/svg';
  let chtUID=0; // 漸層填充 <linearGradient> 唯一 id 計數

  /* --- 座標軸留白：yaxis 開→左側留數值刻度、xaxis 開→底部留類別 --- */
  function chtPad(o){return {L:o.yaxis?26:6, R:6, T:6, B:o.xaxis?15:6};}
  /* 把資料映射到 plot 內座標（box 為扣掉留白後的繪圖區） */
  function chtPtsBox(data,box){
    const mx=Math.max.apply(null,data),mn=Math.min.apply(null,data),span=(mx-mn)||1;
    return data.map((v,i)=>[
      box.x+(data.length>1?i*box.w/(data.length-1):box.w/2),
      box.y+box.h-((v-mn)/span)*box.h
    ]);
  }
  /* y 軸刻度 text（top→bottom 由大到小）＋x 軸類別 text */
  function chtAxisSVG(o,box,ticks,cats,catXs){
    let s='';
    if(o.yaxis)for(let i=0;i<ticks.length;i++){ // 左側數值刻度，右對齊貼近繪圖區
      const y=(box.y+i*box.h/(ticks.length-1)).toFixed(1);
      s+='<text x="'+(box.x-4)+'" y="'+(+y+3).toFixed(1)+'" class="cht-axis" text-anchor="end">'+ticks[i]+'</text>';
    }
    if(o.xaxis)cats.forEach((c,i)=>{ // 底部類別，置中對齊各資料點
      s+='<text x="'+catXs[i].toFixed(1)+'" y="'+(o.h-4)+'" class="cht-axis" text-anchor="middle">'+c+'</text>';
    });
    return s;
  }

  /* Catmull-Rom → cubic bezier 平滑路徑（曲線圖 curve 用；端點以自身當虛擬控制點）*/
  function chtSmoothPath(pts){
    if(pts.length<2)return '';
    let d='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
    for(let i=0;i<pts.length-1;i++){
      const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||pts[i+1];
      const c1x=p1[0]+(p2[0]-p0[0])/6,c1y=p1[1]+(p2[1]-p0[1])/6;
      const c2x=p2[0]-(p3[0]-p1[0])/6,c2y=p2[1]-(p3[1]-p1[1])/6;
      d+=' C'+c1x.toFixed(1)+' '+c1y.toFixed(1)+' '+c2x.toFixed(1)+' '+c2y.toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1].toFixed(1);
    }
    return d;
  }
  /* 折線圖：回傳 {svg, pts, box}；不再永遠畫端點（dots 改由 hover 顯示）；o.smooth→平滑曲線 */
  function chtLineSVG(o){
    const w=o.w,h=o.h,data=o.data||CHT_LINE_DATA,p=chtPad(o);
    const box={x:p.L,y:p.T,w:w-p.L-p.R,h:h-p.T-p.B};
    const pts=chtPtsBox(data,box);
    const mx=Math.max.apply(null,data),mn=Math.min.apply(null,data);
    const d=o.smooth?chtSmoothPath(pts):pts.map((pt,i)=>(i?'L':'M')+pt[0].toFixed(1)+' '+pt[1].toFixed(1)).join(' ');
    const gid=o.grad?('chtGrad'+(++chtUID)):null; // 漸層填充唯一 id
    let s='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="折線圖：近 '+data.length+' 期呈上升趨勢">';
    if(gid)s+='<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".32"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>';
    if(o.grid)for(let i=0;i<4;i++){ // 4 條水平淡格線（--line）
      const y=(box.y+i*box.h/3).toFixed(1);
      s+='<line x1="'+box.x+'" y1="'+y+'" x2="'+(box.x+box.w)+'" y2="'+y+'" stroke="var(--line)" stroke-width="1"/>';
    }
    if(o.area) // 面積填充：折線閉合到底邊，accent 半透明
      s+='<path d="'+d+' L'+pts[pts.length-1][0].toFixed(1)+' '+(box.y+box.h)+' L'+pts[0][0].toFixed(1)+' '+(box.y+box.h)+' Z" '+(gid?'fill="url(#'+gid+')"':'fill="var(--accent)" fill-opacity=".14"')+' stroke="none"/>';
    s+='<path class="cht-ln" pathLength="1" d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    const ticks=[mx,Math.round(mx-(mx-mn)/3),Math.round(mn+(mx-mn)/3),mn]; // y 刻度由大到小
    s+=chtAxisSVG(o,box,ticks,CHT_XCATS.slice(0,data.length),pts.map(pt=>pt[0]));
    return {svg:s+'</svg>',pts,box};
  }
  /* 折線圖 DOM 節點：interactive→掛 hover（顯示端點＋垂直導引＋tooltip） */
  function chtLineNode(o){
    const wrap=ce('div','cht-plot');const g=chtLineSVG(o);wrap.innerHTML=g.svg;
    if(o.interactive)chtHoverLine(wrap,o,g.pts,g.box,o.data||CHT_LINE_DATA);
    return wrap;
  }
  /* 折線 hover：dot＋垂直線只在滑到節點時出現（不再永遠顯示每個節點） */
  function chtHoverLine(wrap,o,pts,box,data){
    const svg=wrap.querySelector('svg'),vw=o.w,vh=o.h;
    const guide=document.createElementNS(SVGNS,'line');guide.setAttribute('class','cht-guide');guide.setAttribute('y1',box.y);guide.setAttribute('y2',box.y+box.h);guide.style.opacity='0';svg.appendChild(guide);
    const dot=document.createElementNS(SVGNS,'circle');dot.setAttribute('r','3.6');dot.setAttribute('class','cht-hdot');dot.style.opacity='0';svg.appendChild(dot);
    const tip=ce('div','cht-tip');wrap.appendChild(tip);
    function move(e){
      const r=svg.getBoundingClientRect();const relx=(e.clientX-r.left)/r.width*vw;
      let bi=0,bd=1e9;pts.forEach((pt,i)=>{const dd=Math.abs(pt[0]-relx);if(dd<bd){bd=dd;bi=i;}});
      const pt=pts[bi];
      dot.setAttribute('cx',pt[0]);dot.setAttribute('cy',pt[1]);dot.style.opacity='1';
      guide.setAttribute('x1',pt[0]);guide.setAttribute('x2',pt[0]);guide.style.opacity='1';
      tip.innerHTML='<b>'+data[bi]+'</b><span>'+CHT_XCATS[bi]+'</span>';
      tip.style.left=(pt[0]/vw*r.width)+'px';tip.style.top=(pt[1]/vh*r.height)+'px';tip.classList.add('on');
    }
    svg.addEventListener('mousemove',move);
    svg.addEventListener('mouseleave',()=>{dot.style.opacity='0';guide.style.opacity='0';tip.classList.remove('on');});
  }

  /* 長條圖：回傳 {svg, centers, box}；centers 供 hover 定位 */
  function chtBarSVG(o){
    const w=o.w,h=o.h,A=CHT_BAR_A,B=CHT_BAR_B,n=A.length,p=chtPad(o);
    const top=Math.max(p.T,o.vals?14:p.T);
    const box={x:p.L,y:top,w:w-p.L-p.R,h:h-top-p.B};
    const mx=Math.max.apply(null,o.series2?A.concat(B):A);
    const gw=box.w/n,centers=[];
    let s='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="長條圖：近 '+n+' 期'+(o.series2?'雙系列對照':'數值')+'">';
    if(o.grid)for(let i=0;i<4;i++){const y=(box.y+i*box.h/3).toFixed(1);
      s+='<line x1="'+box.x+'" y1="'+y+'" x2="'+(box.x+box.w)+'" y2="'+y+'" stroke="var(--line)" stroke-width="1"/>';}
    for(let i=0;i<n;i++){
      const cx=box.x+gw*i+gw/2;const bh=(A[i]/mx)*box.h;
      centers.push({cx,gw,a:A[i],b:B[i]});
      if(o.series2){
        const bw=Math.min(gw*0.30,o.thin===false?10:8),bh2=(B[i]/mx)*box.h;
        s+='<rect class="cht-b" data-i="'+i+'" style="--i:'+i+'" x="'+(cx-bw-1).toFixed(1)+'" y="'+(box.y+box.h-bh).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+bh.toFixed(1)+'" rx="0" fill="var(--accent)"/>';
        s+='<rect class="cht-b" data-i="'+i+'" style="--i:'+i+'" x="'+(cx+1).toFixed(1)+'" y="'+(box.y+box.h-bh2).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+bh2.toFixed(1)+'" rx="0" fill="var(--ok)"/>';
        if(o.vals){
          s+='<text x="'+(cx-bw/2-1).toFixed(1)+'" y="'+(box.y+box.h-bh-3).toFixed(1)+'" class="cht-val" text-anchor="middle">'+A[i]+'</text>';
          s+='<text x="'+(cx+bw/2+1).toFixed(1)+'" y="'+(box.y+box.h-bh2-3).toFixed(1)+'" class="cht-val" text-anchor="middle">'+B[i]+'</text>';
        }
      }else{
        const bw=Math.min(gw*0.52,o.thin===false?16:12);
        s+='<rect class="cht-b" data-i="'+i+'" style="--i:'+i+'" x="'+(cx-bw/2).toFixed(1)+'" y="'+(box.y+box.h-bh).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+bh.toFixed(1)+'" rx="0" fill="var(--accent)"/>';
        if(o.vals)s+='<text x="'+cx.toFixed(1)+'" y="'+(box.y+box.h-bh-3).toFixed(1)+'" class="cht-val" text-anchor="middle">'+A[i]+'</text>';
      }
    }
    s+='<line x1="'+box.x+'" y1="'+(box.y+box.h)+'" x2="'+(box.x+box.w)+'" y2="'+(box.y+box.h)+'" stroke="var(--line-strong)" stroke-width="1"/>';
    const ticks=[mx,Math.round(mx*2/3),Math.round(mx/3),0];
    s+=chtAxisSVG(o,box,ticks,CHT_BAR_CATS,centers.map(c=>c.cx));
    return {svg:s+'</svg>',centers,box};
  }
  /* 長條圖 DOM 節點：interactive→掛 hover（highlight 該組＋tooltip） */
  function chtBarNode(o){
    const wrap=ce('div','cht-plot');const g=chtBarSVG(o);wrap.innerHTML=g.svg;
    if(o.interactive)chtHoverBar(wrap,o,g.centers,g.box);
    return wrap;
  }
  function chtHoverBar(wrap,o,centers,box){
    const svg=wrap.querySelector('svg'),vw=o.w,vh=o.h;
    const hl=document.createElementNS(SVGNS,'rect');hl.setAttribute('class','cht-bhl');hl.setAttribute('rx','3');hl.setAttribute('fill-opacity','.12');hl.setAttribute('y',box.y);hl.setAttribute('height',box.h);hl.style.opacity='0';svg.insertBefore(hl,svg.firstChild);
    const tip=ce('div','cht-tip');wrap.appendChild(tip);
    function move(e){
      const r=svg.getBoundingClientRect();const relx=(e.clientX-r.left)/r.width*vw;
      let bi=0,bd=1e9;centers.forEach((c,i)=>{const dd=Math.abs(c.cx-relx);if(dd<bd){bd=dd;bi=i;}});
      const c=centers[bi];
      hl.setAttribute('x',c.cx-c.gw/2);hl.setAttribute('width',c.gw);hl.style.opacity='1';
      svg.querySelectorAll('.cht-b').forEach(r=>r.classList.toggle('is-dim',+r.dataset.i!==bi)); // Motion v1：聚焦目前這組、其餘淡化
      tip.innerHTML='<b>'+c.a+(o.series2?' · '+c.b:'')+'</b><span>'+CHT_BAR_CATS[bi]+'</span>';
      tip.style.left=(c.cx/vw*r.width)+'px';tip.style.top=(box.y/vh*r.height)+'px';tip.classList.add('on');
    }
    svg.addEventListener('mousemove',move);
    svg.addEventListener('mouseleave',()=>{hl.style.opacity='0';tip.classList.remove('on');svg.querySelectorAll('.cht-b.is-dim').forEach(r=>r.classList.remove('is-dim'));});
  }
  /* 甜甜圈 SVG：pathLength=100 ＋ stroke-dasharray 分段畫環（各段綁 intent 色 token），o.center 顯示中央百分比 */
  function chtDonutSVG(o){   /* 2026-11-05 細緻化：環寬 15→7（約直徑 6%）、半徑 46→52、段間留 1% 細縫；中央改「小標在上＋大數字」 */
    const SEGS=o.segs||CHT_DONUT_SEGS;   /* o.segs＝自訂資料 [{k,v(百分比),c(色 token)}]；o.label＝aria；o.sub／o.num／o.unit＝中央文字 */
    let off=0,s='<svg viewBox="0 0 120 120" role="img" aria-label="'+(o.label||'甜甜圈圖：任務狀態分布，已完成 46%、進行中 26%、待處理 18%、逾期 10%')+'">';
    s+='<g transform="rotate(-90 60 60)">'; // 轉 -90 度讓第一段從 12 點鐘開始
    const GAP=1;
    SEGS.forEach((g,gi)=>{
      s+='<circle class="cht-seg" data-i="'+gi+'" cx="60" cy="60" r="52" fill="none" stroke="var('+g.c+')" stroke-width="7" pathLength="100" stroke-dasharray="'+(g.v-GAP)+' '+(100-g.v+GAP)+'" stroke-dashoffset="'+(-off)+'"/>';
      off+=g.v;
    });
    s+='</g>';
    if(o.center)s+='<text x="60" y="50" class="cht-donut-sub" text-anchor="middle">'+(o.sub||'完成率')+'</text><text x="60" y="72" class="cht-donut-num" text-anchor="middle">'+(o.num||'46')+'<tspan class="cht-donut-u">'+(o.unit!=null?o.unit:'%')+'</tspan></text>';
    return s+'</svg>';
  }
  /* 半圓 semi：180° 弧（左→上→右），平頭段、段間留細縫（同甜甜圈）；中央大數字壓在弧心下緣 */
  const chtPt=(cx,cy,r,a)=>[(cx+r*Math.cos(a)).toFixed(2),(cy+r*Math.sin(a)).toFixed(2)];
  function chtSemiSVG(o){
    const cx=100,cy=100,r=86,sw=11.5,gap=Math.PI*2*.01;   /* 與甜甜圈同比例：環寬≈半徑 13.5%、段間縫＝圓周 1%、平頭 */let a=Math.PI,s='<svg viewBox="0 0 200 112" role="img" aria-label="半圓圖：任務狀態分布，已完成 46%、進行中 26%、待處理 18%、逾期 10%">';
    CHT_DONUT_SEGS.forEach((g,gi)=>{const span=Math.PI*g.v/100;const a0=a+(gi?gap/2:0),a1=a+span-(gi<CHT_DONUT_SEGS.length-1?gap/2:0);
      const p0=chtPt(cx,cy,r,a0),p1=chtPt(cx,cy,r,a1);
      s+='<path class="cht-seg" data-i="'+gi+'" d="M'+p0+'A'+r+' '+r+' 0 0 1 '+p1+'" fill="none" stroke="var('+g.c+')" stroke-width="'+sw+'"/>';a+=span;});
    if(o.center)s+='<text x="100" y="66" class="cht-donut-sub" text-anchor="middle">完成率</text><text x="100" y="96" class="cht-donut-num cht-semi-num" text-anchor="middle">46<tspan class="cht-donut-u">%</tspan></text>';
    return s+'</svg>';
  }
  /* 實心 pie：扇形以面板色細線分隔，≥10% 的扇形內標百分比（文字色 --s-on-primary） */
  function chtPieSVG(o){
    const c=60,r=56;let a=-Math.PI/2,s='<svg viewBox="0 0 120 120" role="img" aria-label="圓餅圖：任務狀態分布，已完成 46%、進行中 26%、待處理 18%、逾期 10%">';let lb='';
    CHT_DONUT_SEGS.forEach((g,gi)=>{const span=2*Math.PI*g.v/100;const p0=chtPt(c,c,r,a),p1=chtPt(c,c,r,a+span);
      s+='<path class="cht-seg cht-pie-sl" data-i="'+gi+'" d="M'+c+' '+c+'L'+p0+'A'+r+' '+r+' 0 '+(span>Math.PI?1:0)+' 1 '+p1+'Z" fill="var('+g.c+')"/>';
      if(o.labels!==false&&g.v>=10){const m=chtPt(c,c,r*.62,a+span/2);lb+='<text x="'+m[0]+'" y="'+m[1]+'" class="cht-pie-lb" text-anchor="middle" dominant-baseline="central">'+g.v+'%</text>';}
      a+=span;});
    return s+lb+'</svg>';
  }
  /* 甜甜圈 hover：跟折線／長條一樣浮 .cht-tip tooltip（label＋%），不動中央數字、不 focus 段 */
  function chtDonutHover(box,data){
    const segs=[...box.querySelectorAll('.cht-seg')];if(!segs.length)return;const D=data||CHT_DONUT_SEGS;
    box.style.position='relative';
    const tip=ce('div','cht-tip');box.appendChild(tip);
    segs.forEach((c,i)=>{
      const g=D[i];
      const move=(e)=>{const r=box.getBoundingClientRect();
        tip.innerHTML='<b>'+g.v+'%</b><span>'+g.k+(g.n?' · '+g.n:'')+'</span>';
        tip.style.left=(e.clientX-r.left)+'px';tip.style.top=(e.clientY-r.top)+'px';tip.classList.add('on');};
      c.addEventListener('mouseenter',move);
      c.addEventListener('mousemove',move);
      c.addEventListener('mouseleave',()=>tip.classList.remove('on'));
    });
  }
  /* 圖例：重用 .tg 原子（v-soft i-neutral），前置 .cht-dot 色點綁各系列色 token */
  function chtLegend(items){
    const lg=ce('div','cht-legend');
    (items||CHT_DONUT_SEGS).forEach(g=>{
      const t=ce('div','tg v-soft c-round i-neutral st-default');
      t.innerHTML='<span class="cht-dot '+g.dot+'"></span><span>'+g.k+(g.v!=null?' '+g.v+'%':'')+'</span>';
      lg.appendChild(t);
    });
    return lg;
  }

  /* --- 圖表工廠：chtChart(variant,size,o) → .cht-box ---
     size 決定預設配置（m 標準＝完整配置、s 精簡＝sparkline 式簡配），o 可逐項覆寫（Live 用）：
     stat {title,trend,unit}／line {area,grid,xaxis,yaxis,interactive}／bar {series2,vals,xaxis,yaxis,interactive}／donut {center,legend}
     圖表加寬（m 340／s 170）；o.interactive 開 hover tooltip＋端點；o.xaxis/o.yaxis 控座標軸類別／數值 */
  /* RWD：line／curve／bar 依容器實際寬度重畫（和進階 9 型一樣伸縮；viewBox 寬＝實際像素，文字與線條不變形） */
  function chtFluid(mk,base){const host=ce('div','cht-fluid');let w0=0;
    const draw=w=>{host.replaceChildren(mk(Object.assign({},base,{w})));};draw(base.w);
    if(window.ResizeObserver)new ResizeObserver(()=>{const w=Math.round(host.clientWidth);if(w>=80&&Math.abs(w-w0)>1){w0=w;draw(w);}}).observe(host);
    return host;}
  function chtChart(variant,size,o){
    o=o||{};
    if(CHTX[variant])return chtxChart(variant,size,o); // 進階 9 型（見下方 CHTX）
    const s=size==='s';
    const box=ce('div','cht-box cht-'+variant+' cht-sz-'+size+(o.wide?' cht-wide':''));
    if(variant==='stat'){ // 統計數字卡：直接重用 Number 頁的 prMetricEl 原子（含趨勢 delta）
      box.appendChild(prMetricEl(s?'sm':'md',{
        title:o.title!==false,
        trend:o.trend===undefined?'up':o.trend,
        unit:o.unit
      }));
    }else if(variant==='line'){
      box.appendChild(chtFluid(chtLineNode,{w:s?170:340,h:s?76:150,
        area:o.area===undefined?true:o.area,
        grid:o.grid===undefined?!s:o.grid,
        grad:!!o.grad,
        xaxis:!!o.xaxis,yaxis:!!o.yaxis,interactive:!!o.interactive}));
    }else if(variant==='curve'){ // 曲線＝折線的平滑版（Catmull-Rom），選項沿用 line
      box.appendChild(chtFluid(chtLineNode,{w:s?170:340,h:s?76:150,smooth:true,
        area:o.area===undefined?true:o.area,
        grid:o.grid===undefined?!s:o.grid,
        grad:!!o.grad,
        xaxis:!!o.xaxis,yaxis:!!o.yaxis,interactive:!!o.interactive}));
    }else if(variant==='bar'){
      box.appendChild(chtFluid(chtBarNode,{w:s?170:340,h:s?76:150,thin:o.thin!==false,
        series2:o.series2===undefined?!s:o.series2,
        vals:!!o.vals,xaxis:!!o.xaxis,yaxis:!!o.yaxis,interactive:!!o.interactive}));
    }else{ // donut／semi 半圓／pie 實心
      const center=o.center===undefined?true:o.center;
      box.innerHTML=variant==='pie'?chtPieSVG({labels:o.labels===undefined?!s:o.labels}):variant==='semi'?chtSemiSVG({center}):chtDonutSVG({center});
      chtDonutHover(box); // 滑段浮 tooltip（同折線／長條）
      if(o.legend===undefined?!s:o.legend)box.appendChild(chtLegend());
    }
    return box;
  }
  /* 矩陣格：dashboard tile（panel 底＋細邊）包一顆對應 variant × size 的小圖 */
  function chtCell(variant,size){
    const t=ce('div','cht-tile');
    t.appendChild(chtChart(variant,size,{}));
    return t;
  }

  /* --- Live 勾選項 scoped 控制：bools 依 variant 顯示對應選項，避免空轉 ---
     mountLive 控制列只建一次，故在 render 時依 label 文字比對、隱藏非當前 variant 的勾選項 */
  const CHT_BOOL_SCOPE={
    '趨勢 trend':'stat','單位 unit':'stat',
    '面積填充 area':['line','curve'],'漸層填充 gradient':['line','curve'],'格線 grid':['line','curve'],'X 軸月份':['line','curve'],'Y 軸數值':['line','curve'],
    '第二系列 series2':'bar','數值標 values':'bar','X 軸星期':'bar','Y 軸數量':'bar',
    '中央數字 center':['donut','semi'],'圖例 legend':['donut','semi','pie'],'扇形百分比 labels':'pie'
  };
  function chtScopeBools(host,variant){
    requestAnimationFrame(()=>{ // render 回傳後控制列才在 DOM，延一拍再掃
      const root=document.getElementById('view')||host;  // bento 版控制列已移出 section，改從整頁找
      root.querySelectorAll('.bento-ctl label.chk,.livewrap label.chk').forEach(l=>{
        const key=l.textContent.trim();
        const sc=CHT_BOOL_SCOPE[key];if(sc)l.style.display=((Array.isArray(sc)?sc.includes(variant):sc===variant))?'':'none';
      });
    });
  }

  /* ==================== Chart 擴充 · 9 種進階圖表（cht-x / chtx-，2026-11-03 設計確認）CHTX:charts-v1 ====================
     spark KPI 趨勢小圖卡／brush 刷選縮放折線／area-stack 堆疊面積／bar-stack 堆疊長條／combo 長條＋折線／bar-rank 橫向排名／gauge 儀表／funnel 漏斗／heatmap 熱力圖。
     併入 chart 的 variant 軸（DIAL_SPECS.chart 為矩陣與 registry 的唯一來源）；chtChart(variant,size,o) 自動分派到這裡。
     矩陣格＝靜態版（固定寬、無互動）；Live（o.live）＝可操作版：十字準線 tooltip、圖例開關、hover 淡化、morph、方向鍵、數字滾動、FLIP 排序、刷選。
     原子：卡內切換＝sgmEl（Segmented）、圖例／漲跌／狀態＝.tg（Tag）、數字字級＝.pr-metric（Number）、tooltip＝.cht-tip。
     色彩：系列 1＝--accent（chart scope＝--c-brand2-500）、2–4＝--s-chart-2..4、熱力色階＝--s-chart-seq-0..5、門檻＝--s-feedback-*；動態讀 --dur-*／--ease-out。 */
  const CHTX={};
  const CHTX_GROUPS=[
    {k:'base',t:'基礎',d:'單一數字與單一系列',vs:['stat','line','curve','bar','donut','semi','pie']},
    {k:'trend',t:'趨勢',d:'看數字隨時間怎麼走：切區間、縮放長時間序列',vs:['spark','brush']},
    {k:'comp',t:'組成',d:'總數由哪些部分組成、比例怎麼變',vs:['area-stack','bar-stack']},
    {k:'cmp',t:'比較',d:'多個項目或兩種指標放在一起比',vs:['combo','bar-rank']},
    {k:'dist',t:'分布',d:'在哪一步流失、什麼時段最忙',vs:['funnel','heatmap']}
  ];
  const chtxRM=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const chtxTok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function chtxMs(n,f){const v=chtxTok(n);let ms=parseFloat(v);if(/[^m]s$/.test(v))ms*=1000;return (isFinite(ms)?ms:300)*(f||1);}
  let chtxEaseFn=null;
  function chtxEase(){if(chtxEaseFn)return chtxEaseFn;const m=chtxTok('--ease-out').match(/cubic-bezier\(([^)]+)\)/);
    const p=m?m[1].split(',').map(Number):[.22,1,.36,1],[x1,y1,x2,y2]=p.length===4&&p.every(isFinite)?p:[.22,1,.36,1];
    const bz=(a,b,t)=>3*a*t*(1-t)*(1-t)+3*b*t*t*(1-t)+t*t*t;
    chtxEaseFn=k=>{if(k<=0)return 0;if(k>=1)return 1;let lo=0,hi=1,t=k;for(let i=0;i<22;i++){t=(lo+hi)/2;if(bz(x1,x2,t)<k)lo=t;else hi=t;}return bz(y1,y2,t);};return chtxEaseFn;}
  function chtxAnim(o,dur,step,done){cancelAnimationFrame(o._raf);if(chtxRM()||!dur){step(1);done&&done();return;}const e=chtxEase(),t0=performance.now();
    const f=t=>{const k=Math.min(1,(t-t0)/dur);step(e(k));if(k<1)o._raf=requestAnimationFrame(f);else done&&done();};o._raf=requestAnimationFrame(f);}
  const chtxLerp=(a,b,t)=>a+(b-a)*t, chtxClamp=(v,a,b)=>Math.max(a,Math.min(b,v)), chtxFmt=n=>Math.round(n).toLocaleString('en-US');
  function chtxNice(x){const e=Math.pow(10,Math.floor(Math.log10(x))),f=x/e;for(const k of [1,1.25,1.5,2,2.5,3,4,5,6,8,10])if(f<=k+1e-9)return k*e;return 10*e;}
  function chtxScale4(v){const st=chtxNice(v/4);return {max:st*4,step:st};}
  function chtxRng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  function chtxSv(t,a){const e=document.createElementNS(SVGNS,t);if(a)for(const k in a)e.setAttribute(k,a[k]);return e;}
  let chtxUID=0;
  const chtxBarTop=(x,y,w,h,r)=>{if(h<=0)return '';r=Math.min(r,h,w/2);return `M${x},${y+h}V${y+r}Q${x},${y} ${x+r},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y+r}V${y+h}Z`;};
  const chtxR=()=>{const v=parseFloat(chtxTok('--r-xs'));return isFinite(v)?v:2;}; // 長條頂端圓角＝--r-xs
  /* 寬度：靜態（o.w）直接畫；Live 量容器寬（ResizeObserver） */
  function chtxPlot(host,o,H,onW,cls){const plot=ce('div','chtx-plot'+(cls?' '+cls:''));const svg=chtxSv('svg',{height:H});plot.appendChild(svg);host.appendChild(plot);
    const set=w=>{svg.setAttribute('viewBox',`0 0 ${w} ${svg.getAttribute('height')}`);svg.setAttribute('width',w);onW(w);};
    if(o.w)set(o.w);else if(window.ResizeObserver){let w0=0;new ResizeObserver(()=>{const w=Math.round(plot.clientWidth);if(w&&w!==w0){w0=w;set(w);}}).observe(plot);}
    return {plot,svg};}
  /* 共用 tooltip（.cht-tip 視覺）：跟游標、貼邊翻面；同步寫 aria-live */
  function chtxTip(host){const t=ce('div','cht-tip chtx-tip');t.setAttribute('aria-hidden','true');host.appendChild(t);
    const live=ce('div','chtx-sr');live.setAttribute('aria-live','polite');host.appendChild(live);let on=false;
    function place(cx,cy){const hr=host.getBoundingClientRect();const x=cx-hr.left,y=cy-hr.top,w=t.offsetWidth,h=t.offsetHeight;
      let L=x+14;if(L+w>hr.width-4)L=x-14-w;L=chtxClamp(L,4,Math.max(4,hr.width-w-4));let T=y-h-12;if(T<4)T=y+18;T=chtxClamp(T,4,Math.max(4,hr.height-h-4));t.style.transform=`translate(${L}px,${T}px)`;}
    return {show(cx,cy,head,rows){t.replaceChildren();const txt=[];
        if(head){const h=ce('div','chtx-th');h.textContent=head;t.appendChild(h);txt.push(head);}
        rows.forEach(r=>{const d=ce('div','chtx-tr'+(r.cls?' '+r.cls:''));const k=ce('i');if(r.c)k.style.background=r.c;const b=ce('b');b.textContent=r.v;const s=ce('span');s.textContent=r.k||'';d.append(k,b,s);t.appendChild(d);txt.push((r.k||'')+' '+r.v);});
        live.textContent=txt.join('，');
        if(!on){t.style.transition='none';place(cx,cy);void t.offsetWidth;t.style.transition='';t.classList.add('on');on=true;}else place(cx,cy);},
      hide(){t.classList.remove('on');on=false;}};}
  function chtxKeys(node,label,move){node.setAttribute('tabindex','0');node.setAttribute('role','img');node.setAttribute('aria-label',label);node.classList.add('chtx-focus');
    node.addEventListener('keydown',e=>{const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!m)return;e.preventDefault();move(m,e.shiftKey);});
    node.addEventListener('focus',()=>move([0,0]));}
  /* 圖例：.tg 原子（v-soft／i-neutral）＋系列色塊；onToggle → <button aria-pressed> */
  function chtxLegend(items,onToggle){const lg=ce('div','cht-legend chtx-legend');
    lg.items=items.map((it,i)=>{const b=ce(onToggle?'button':'div','tg v-soft c-round i-neutral st-default chtx-lgi');
      if(onToggle){b.type='button';b.setAttribute('aria-pressed','true');b.onclick=()=>onToggle(i,b);}
      const sw=ce('span','cht-dot chtx-sw'+(it.line?' is-ln':''));sw.style.background=`var(${it.c})`;const s=ce('span');s.textContent=it.k;b.append(sw,s);lg.appendChild(b);return b;});
    return lg;}
  /* 卡內切換：Segmented 原子（soft／s）；靜態版不掛事件 */
  const chtxSeg=(items,idx,onPick,label,live)=>sgmEl('soft','s',{items,active:idx,live:!!live,label,onChange:onPick});
  /* 卡內切換預設＝Dropdown（2026-11-10 與後台範本同步）；o.dropdown===false 才退回分段按鈕 */
  function chtxPick(items,idx,onPick,label,live,o){if(o&&o.dropdown===false)return chtxSeg(items,idx,onPick,label,live);
    const d=ddField('outline',{size:'s',options:items.map((t,i)=>({value:String(i),label:t})),value:String(idx),onChange:v=>onPick(+v)});d.classList.add('chtx-dd');d.setAttribute('aria-label',label);return d;}
  /* 排序按鈕：一顆按鈕切換高→低／低→高，圖示跟著換 */
  function chtxSortBtn(asc,onToggle){const b=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});b.type='button';b.classList.add('chtx-sortbtn');
    const draw=()=>{b.innerHTML=PI(asc?'arrow-up-narrow-wide':'arrow-down-wide-narrow')+'<span></span>';b.querySelector('span').textContent=asc?'由低到高':'由高到低';b.setAttribute('aria-label','排序：'+(asc?'由低到高':'由高到低')+'，點擊切換');};
    draw();b.onclick=()=>{asc=!asc;draw();onToggle(asc);};return b;}
  function chtxHead(box,title,sub,size){const h=ce('div','chtx-h');const t=ce('div','chtx-ht');const a=ce('div','chtx-t');a.textContent=title;t.appendChild(a);
    if(sub&&size!=='s'){const b=ce('div','chtx-sub');b.textContent=sub;t.appendChild(b);}const tools=ce('div','chtx-tools');h.append(t,tools);box.appendChild(h);return tools;}
  /* 數字逐位滾動 */
  function chtxSetRoll(r,text){r.setAttribute('aria-label',text);const ch=[...text];
    if(r.childElementCount!==ch.length){r.innerHTML='';ch.forEach(c=>{if(/\d/.test(c)){const d=ce('span','d');d.setAttribute('aria-hidden','true');const col=ce('span');for(let i=0;i<10;i++){const n=ce('i');n.textContent=i;col.appendChild(n);}d.appendChild(col);r.appendChild(d);}
      else{const s=ce('span');s.textContent=c;s.setAttribute('aria-hidden','true');r.appendChild(s);}});}
    [...r.children].forEach((n,i)=>{const c=ch[i];if(n.classList.contains('d')){const col=n.firstChild;col.style.transitionDelay=(i*25)+'ms';col.style.transform=`translateY(${-Number(c)}em)`;}else n.textContent=c;});}
  function chtxRoll(text){const r=ce('span','chtx-roll');chtxSetRoll(r,text);return r;}
  const chtxArrow=up=>`<span class="chtx-arw">${ICON_ARROW}</span>`;

  /* --- 共用模擬資料（固定種子：近 455 天每日營收、通路月營收）--- */
  let CHTX_DATA=null;
  function chtxData(){if(CHTX_DATA)return CHTX_DATA;const R=chtxRng(20261103),END=new Date(2026,10,3),N=455,DAYS=[];
    const ev={1109:1.2,1110:1.45,1111:3.1,1112:1.35,1211:1.2,1212:1.75,616:1.15,617:1.4,618:2.35,619:1.25,909:1.35,1010:1.3,1101:1.25,1102:1.22,1103:1.3};
    const cny0=new Date(2026,1,14),cny1=new Date(2026,1,22);
    for(let i=0;i<N;i++){const d=new Date(END);d.setDate(END.getDate()-(N-1-i));const dow=d.getDay(),key=(d.getMonth()+1)*100+d.getDate();
      const base=(34+i/N*11)*[1.13,.94,.97,.98,1,1.04,1.17][dow];let f=ev[key]||1;if(d>=cny0&&d<=cny1)f=.58;
      const rev=Math.round(base*f*(1+(R()-.5)*.16)*100)*100,aov=1060+R()*110+(f>1.5?70:0);
      DAYS.push({d,rev,orders:Math.round(rev/aov),ret:(3.3+R()*1.1+(f>2?1.2:0))/100});}
    const MON=['11月','12月','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月'];
    const MONF=['2025年11月','2025年12月','2026年1月','2026年2月','2026年3月','2026年4月','2026年5月','2026年6月','2026年7月','2026年8月','2026年9月','2026年10月'];
    const CH=[{k:'官網',c:'--cs1',v:[528,472,431,356,402,418,436,541,442,431,452,478]},{k:'蝦皮',c:'--cs2',v:[402,350,312,248,288,301,318,422,320,316,333,356]},
      {k:'momo',c:'--cs3',v:[262,224,176,140,171,178,186,268,184,180,194,208]},{k:'門市',c:'--cs4',v:[288,306,262,231,236,240,246,252,238,236,244,262]}];
    return CHTX_DATA={DAYS,N,MON,MONF,CH};}
  const chtxMD=d=>(d.getMonth()+1)+'/'+String(d.getDate()).padStart(2,'0');
  const chtxYMD=d=>d.getFullYear()+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0');
  const CHTX_WK=['日','一','二','三','四','五','六'];

  /* ════ spark：KPI 趨勢小圖卡 ════ */
  CHTX.spark=function(box,size,o){const {DAYS,N}=chtxData(),S=size==='s',live=!!o.live,PER=[7,30,90];let pi=1;
    const T=[{k:'營收',pre:'NT$',key:'rev',show:v=>chtxFmt(v),tf:v=>'NT$ '+chtxFmt(v),good:1},
      {k:'訂單數',suf:'筆',key:'orders',show:v=>chtxFmt(v),tf:v=>chtxFmt(v)+' 筆',good:1},
      {k:'退貨率',suf:'%',key:'ret',show:v=>v.toFixed(1),tf:v=>(v*100).toFixed(1)+'%',good:-1,pt:true}].slice(0,live&&!S?3:1);
    const tip=live?chtxTip(box):null;let note=null;
    if(live&&!S&&o.period!==false){const top=ce('div','chtx-kpi-top');note=ce('span','chtx-sub');top.append(chtxSeg(['7 天','30 天','90 天'],pi,i=>go(i),'區間',true),note);box.appendChild(top);}
    const grid=ce('div','chtx-kpis'+(T.length>1?' is-multi':''));box.appendChild(grid);
    const H=S?30:44,K=120,spark=o.spark!==false;
    function calc(p){const cur=DAYS.slice(-p),prev=DAYS.slice(-2*p,-p),s=(a,k)=>a.reduce((x,y)=>x+y[k],0);
      const rv=s(cur,'rev'),pr=s(prev,'rev'),od=s(cur,'orders'),po=s(prev,'orders');
      const rt=cur.reduce((x,y)=>x+y.ret*y.orders,0)/od*100,prt=prev.reduce((x,y)=>x+y.ret*y.orders,0)/po*100;
      return {cur,v:[rv,od,rt],d:[(rv/pr-1)*100,(od/po-1)*100,rt-prt]};}
    const tiles=T.map(t=>{const c=ce('div','chtx-kpi'+(live?' is-live':''));grid.appendChild(c);
      const hd=ce('div','chtx-kpi-h');const lab=ce('span','pr-metric pr-m-sz-'+(S?'sm':'md'));const ml=ce('span','pr-mlabel');ml.textContent=t.k;lab.appendChild(ml);
      const chip=ce('span','tg v-soft c-round i-neutral st-default chtx-delta');hd.append(lab,chip);c.appendChild(hd);
      const m=ce('span','pr-metric pr-m-sz-'+(S?'sm':'md'));const row=ce('span','pr-numrow');const num=ce('span','pr-num');const r=chtxRoll('0');num.appendChild(r);
      if(t.pre){const u=ce('span','pr-unit');u.textContent=t.pre;row.appendChild(u);}row.appendChild(num);if(t.suf){const u=ce('span','pr-unit');u.textContent=t.suf;row.appendChild(u);}
      m.appendChild(row);c.appendChild(m);const sub=ce('div','chtx-sub');c.appendChild(sub);
      const ob={t,c,r,chip,sub,w:0,ys:null,data:null,norm:null,hi:-1};
      if(spark){const pad={l:3,r:5,t:5,b:5};
        const P=chtxPlot(c,o.w?{w:o.w-(T.length>1?34:0)}:{},H,w=>{ob.w=w;ob.draw&&ob.draw();});ob.svg=P.svg;
        const gArea=chtxSv('path',{style:'fill:var(--cs1);fill-opacity:.1'}),gLine=chtxSv('path',{style:'fill:none;stroke:var(--cs1);stroke-width:2;stroke-linejoin:round;stroke-linecap:round'});
        const gEnd=chtxSv('circle',{r:S?3:3.6,class:'cht-hdot'}),xh=chtxSv('line',{class:'chtx-xh',opacity:0}),hd2=chtxSv('circle',{r:3.6,opacity:0,class:'cht-hdot'});
        P.svg.append(gArea,gLine,xh,gEnd,hd2);
        ob.X=i=>pad.l+i/(ob.data.length-1)*(ob.w-pad.l-pad.r);ob.Y=v=>pad.t+(1-v)*(H-pad.t-pad.b);
        ob.draw=()=>{if(!ob.w||!ob.ys)return;let d='';ob.ys.forEach((v,s)=>{const x=pad.l+s/(K-1)*(ob.w-pad.l-pad.r);d+=(s?'L':'M')+x.toFixed(1)+','+ob.Y(v).toFixed(1);});
          gLine.setAttribute('d',d);gArea.setAttribute('d',d+`L${ob.w-pad.r},${H}L${pad.l},${H}Z`);gEnd.setAttribute('cx',ob.w-pad.r);gEnd.setAttribute('cy',ob.Y(ob.ys[K-1]));};
        if(!S){const xl=ce('div','chtx-kpi-x');xl.innerHTML='<span></span><span></span>';c.appendChild(xl);ob.xl=xl;}
        if(live){const hover=(i,cx,cy)=>{ob.hi=i;const x=ob.X(i),y=ob.Y(ob.norm[i]);xh.setAttribute('x1',x);xh.setAttribute('x2',x);xh.setAttribute('y1',0);xh.setAttribute('y2',H);xh.setAttribute('opacity',1);
            hd2.setAttribute('cx',x);hd2.setAttribute('cy',y);hd2.setAttribute('opacity',1);const dd=ob.data[i].d,rr=P.svg.getBoundingClientRect();
            tip.show(cx??rr.left+x,cy??rr.top+y,chtxMD(dd)+'（'+CHTX_WK[dd.getDay()]+'）',[{c:'var(--cs1)',v:t.tf(ob.data[i][t.key]),k:t.k}]);};
          const leave=()=>{ob.hi=-1;xh.setAttribute('opacity',0);hd2.setAttribute('opacity',0);tip.hide();};
          P.svg.addEventListener('pointermove',e=>{const rr=P.svg.getBoundingClientRect();const i=chtxClamp(Math.round((e.clientX-rr.left-pad.l)/(rr.width-pad.l-pad.r)*(ob.data.length-1)),0,ob.data.length-1);hover(i,e.clientX,e.clientY);});
          P.svg.addEventListener('pointerleave',leave);P.svg.addEventListener('blur',leave);
          chtxKeys(P.svg,t.k+'趨勢小圖，方向鍵逐日查看',(mv,sh)=>{const n=ob.data.length;let i=ob.hi<0?n-1:ob.hi;hover(chtxClamp(i+mv[0]*(sh?7:1),0,n-1));});}
      }
      return ob;});
    const resample=norm=>{const n=norm.length,out=[];for(let s=0;s<K;s++){const x=s/(K-1)*(n-1),a=Math.floor(x),b=Math.min(n-1,a+1);out.push(chtxLerp(norm[a],norm[b],x-a));}return out;};
    function go(i){pi=i;const p=PER[i],R=calc(p);if(note)note.textContent='對比前 '+p+' 天（'+chtxMD(DAYS[N-2*p].d)+'–'+chtxMD(DAYS[N-p-1].d)+'）';
      tiles.forEach((ob,ti)=>{const t=ob.t;ob.data=R.cur;const vals=R.cur.map(x=>t.key==='ret'?x.ret*100:x[t.key]),mn=Math.min(...vals),mx=Math.max(...vals);
        ob.norm=vals.map(v=>.08+(v-mn)/(mx-mn||1)*.84);
        if(ob.draw){const to=resample(ob.norm),from=ob.ys||to;chtxAnim(ob,ob.ys&&live?chtxMs('--dur-slow',1.2):0,k=>{ob.ys=from.map((v,j)=>chtxLerp(v,to[j],k));ob.draw();});}
        chtxSetRoll(ob.r,t.show(R.v[ti]));const d=R.d[ti],good=d*t.good>0,flat=Math.abs(d)<.05;
        ob.chip.className='tg v-soft c-round st-default chtx-delta '+(flat?'i-neutral':good?'i-success':'i-danger')+(flat?'':d>=0?' is-up':' is-dn');
        ob.chip.innerHTML=(flat?'':chtxArrow())+'<span>'+(flat?'±':d>=0?'+':'−')+Math.abs(d).toFixed(1)+(t.pt?' pt':'%')+'</span>';
        ob.chip.setAttribute('aria-label',(good?'表現較好':'表現較差')+'，'+(d>=0?'上升 ':'下降 ')+Math.abs(d).toFixed(1)+(t.pt?' 個百分點':'%'));
        ob.sub.textContent=(t.key==='ret'?'近 '+p+' 天平均':'近 '+p+' 天合計');
        if(ob.xl){const xs=ob.xl.children;xs[0].textContent=chtxMD(R.cur[0].d);xs[1].textContent=chtxMD(R.cur[R.cur.length-1].d);}});}
    go(pi);};

  /* ════ brush：刷選縮放折線 ════ */
  CHTX.brush=function(box,size,o){const {DAYS}=chtxData(),S=size==='s',live=!!o.live,ma=o.ma!==false;
    const D=DAYS.slice(-365),N=D.length,MA=D.map((x,i)=>{let s=0,c=0;for(let k=Math.max(0,i-6);k<=i;k++){s+=D[k].rev;c++;}return s/c;});
    const tools=chtxHead(box,'每日營收','2025/11/04–2026/11/03 · 近 365 天',size);const tip=live?chtxTip(box):null;
    let s=N-90,e=N-1,yMax=0,hi=-1,W=0,tgt=null;const H=S?64:(live?210:132),P=S?{l:4,r:4,t:4,b:4}:{l:40,r:8,t:10,b:22},OH=S?24:(live?58:40),OT=S?3:(live?14:10),OB=OH-(S?3:(live?14:10));
    let presets=null;const br={},yA={};
    if(!S){presets=chtxSeg(['30 天','90 天','全部'],1,i=>{const span=[30,90,N][i],s0=s,e0=e;chtxAnim(br,chtxMs('--dur-slow',1.04),k=>{s=chtxLerp(s0,N-span,k);e=chtxLerp(e0,N-1,k);update();});},'範圍',live);tools.appendChild(presets);
      box.appendChild(chtxLegend(ma?[{k:'每日營收',c:'--line-strong',line:1},{k:'7 日平均',c:'--cs1',line:1}]:[{k:'每日營收',c:'--cs1',line:1}]));}
    const cid='chtxClip'+(++chtxUID);
    const gGrid=chtxSv('g'),gX=chtxSv('g'),gData=chtxSv('g',{'clip-path':`url(#${cid})`}),gOv=chtxSv('g'),defs=chtxSv('defs'),clip=chtxSv('clipPath',{id:cid}),clipR=chtxSv('rect');clip.appendChild(clipR);defs.appendChild(clip);
    const pDaily=chtxSv('path',{style:ma?'fill:none;stroke:var(--line-strong);stroke-width:1.5;stroke-linejoin:round':'fill:none;stroke:var(--cs1);stroke-width:1.75;stroke-linejoin:round'}),
      pArea=chtxSv('path',{style:'fill:var(--cs1);fill-opacity:.1'}),pMA=chtxSv('path',{style:'fill:none;stroke:var(--cs1);stroke-width:2;stroke-linejoin:round;stroke-linecap:round'});
    if(ma)gData.append(pArea,pDaily,pMA);else gData.append(pArea,pDaily);
    const xh=chtxSv('line',{class:'chtx-xh',opacity:0}),d1=chtxSv('circle',{r:3.6,opacity:0,class:'cht-hdot',style:ma?'fill:var(--line-strong)':''}),d2=chtxSv('circle',{r:3.6,opacity:0,class:'cht-hdot'});gOv.append(xh,d1,d2);
    const onW=w=>{W=w;clipR.setAttribute('x',P.l);clipR.setAttribute('y',0);clipR.setAttribute('width',w-P.l-P.r);clipR.setAttribute('height',H);tgt=null;yMax=0;if(OV.svg)OV.svg.setAttribute('viewBox',`0 0 ${w} ${OH}`),OV.svg.setAttribute('width',w);drawOvStatic();update();};
    const M=chtxPlot(box,{},H,onW);
    M.svg.append(defs,gGrid,gX,gData,gOv);
    const OV={svg:null};const ov=ce('div','chtx-plot chtx-ov'+(live?'':' is-static'));const osv=chtxSv('svg',{height:OH,viewBox:`0 0 ${o.w||300} ${OH}`,width:o.w||300});ov.appendChild(osv);box.appendChild(ov);OV.svg=osv;
    const oArea=chtxSv('path',{style:'fill:var(--panel-3)'}),oLine=chtxSv('path',{style:'fill:none;stroke:var(--muted);stroke-width:1'}),shL=chtxSv('rect',{class:'chtx-brshade'}),shR=chtxSv('rect',{class:'chtx-brshade'}),
      win=chtxSv('rect',{class:'chtx-brwin',rx:chtxR()}),hL=chtxSv('rect',{class:'chtx-brh',rx:chtxR(),width:S?4:7,height:S?12:20}),hR=chtxSv('rect',{class:'chtx-brh',rx:chtxR(),width:S?4:7,height:S?12:20}),gEv=chtxSv('g'),gOX=chtxSv('g');
    osv.append(oArea,oLine,gEv,gOX,shL,shR,win,hL,hR);
    const X=i=>P.l+(i-s)/(e-s)*(W-P.l-P.r),Y=v=>P.t+(H-P.t-P.b)*(1-v/yMax),OX=i=>P.l+i/(N-1)*(W-P.l-P.r);
    function targetY(){let m=0;for(let i=Math.max(0,Math.floor(s));i<=Math.min(N-1,Math.ceil(e));i++)m=Math.max(m,D[i].rev);return chtxScale4(m*1.04);}
    function update(){if(!W)return;const t=targetY();if(!tgt||t.max!==tgt.max){const y0=yMax||t.max;tgt=t;chtxAnim(yA,yMax&&live?chtxMs('--dur-default',1.07):0,k=>{yMax=chtxLerp(y0,t.max,k);draw();});}else draw();drawOv();}
    function draw(){const ih=H-P.t-P.b;let g='';
      if(!S)for(let v=0;v<=tgt.max+1;v+=tgt.step){const y=Y(v);if(y<P.t-1)continue;g+=`<line class="${v?'chtx-gl':'chtx-bl'}" x1="${P.l}" x2="${W-P.r}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="chtx-ax" x="${P.l-6}" y="${(y+3.5).toFixed(1)}" text-anchor="end">${v?chtxFmt(v/10000)+'萬':'0'}</text>`;}
      gGrid.innerHTML=g;
      const a=Math.max(0,Math.floor(s)-1),b=Math.min(N-1,Math.ceil(e)+1);let dd='',dm='';for(let i=a;i<=b;i++){const x=X(i).toFixed(1);dd+=(i>a?'L':'M')+x+','+Y(D[i].rev).toFixed(1);dm+=(i>a?'L':'M')+x+','+Y(MA[i]).toFixed(1);}
      pDaily.setAttribute('d',dd);pMA.setAttribute('d',dm);pArea.setAttribute('d',(ma?dm:dd)+`L${X(b).toFixed(1)},${P.t+ih}L${X(a).toFixed(1)},${P.t+ih}Z`);
      let xt='';if(!S){const span=e-s;let last=-1e9;
        for(let i=Math.ceil(s);i<=Math.floor(e);i++){const d=D[i].d;let ok,lab;
          if(span<=50){ok=d.getDay()===1;lab=chtxMD(d);}else if(span<=140){ok=d.getDate()===1||d.getDate()===15;lab=chtxMD(d);}else{ok=d.getDate()===1;lab=d.getMonth()===0?d.getFullYear()+'':(d.getMonth()+1)+'月';}
          if(!ok)continue;const x=X(i);if(x-last<56||x<P.l+16||x>W-P.r-16)continue;last=x;xt+=`<line class="chtx-gl" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${P.t+ih}" y2="${P.t+ih+4}"/><text class="chtx-ax" x="${x.toFixed(1)}" y="${H-6}" text-anchor="middle">${lab}</text>`;}}
      gX.innerHTML=xt;if(hi>=0)hover(hi);}
    function drawOv(){const ow=W-P.l-P.r,mx=Math.max(...D.map(x=>x.rev)),oy=v=>OB-(v/mx)*(OB-OT-2);let d='';D.forEach((x,i)=>{d+=(i?'L':'M')+OX(i).toFixed(1)+','+oy(x.rev).toFixed(1);});
      oLine.setAttribute('d',d);oArea.setAttribute('d',d+`L${OX(N-1)},${OB}L${OX(0)},${OB}Z`);const x0=OX(s),x1=OX(e),hh=+hL.getAttribute('height');
      win.setAttribute('x',x0);win.setAttribute('width',Math.max(1,x1-x0));win.setAttribute('y',OT);win.setAttribute('height',OB-OT);
      shL.setAttribute('x',P.l);shL.setAttribute('width',Math.max(0,x0-P.l));shL.setAttribute('y',OT);shL.setAttribute('height',OB-OT);
      shR.setAttribute('x',x1);shR.setAttribute('width',Math.max(0,P.l+ow-x1));shR.setAttribute('y',OT);shR.setAttribute('height',OB-OT);
      const hw=+hL.getAttribute('width');hL.setAttribute('x',x0-hw/2);hR.setAttribute('x',x1-hw/2);hL.setAttribute('y',OT+(OB-OT-hh)/2);hR.setAttribute('y',OT+(OB-OT-hh)/2);}
    function drawOvStatic(){if(S){gEv.innerHTML=gOX.innerHTML='';return;}let g='';
      if(live)[['雙 11',new Date(2025,10,11)],['春節',new Date(2026,1,17)],['618',new Date(2026,5,18)]].forEach(([k,d])=>{const i=D.findIndex(x=>x.d.getTime()===d.getTime());if(i<0)return;const x=OX(i);
        g+=`<line class="chtx-bl" x1="${x}" x2="${x}" y1="${OT-3}" y2="${OT}"/><text class="chtx-axc" x="${x}" y="${OT-5}" text-anchor="middle">${k}</text>`;});gEv.innerHTML=g;
      let xt='';if(live)for(let i=0;i<N;i++){const d=D[i].d;if(d.getDate()!==1||d.getMonth()%3!==0)continue;const x=OX(i);if(x<P.l+14||x>W-P.r-14)continue;xt+=`<text class="chtx-ax" x="${x}" y="${OH-2}" text-anchor="middle">${d.getMonth()===0?d.getFullYear():(d.getMonth()+1)+'月'}</text>`;}gOX.innerHTML=xt;}
    function hover(i,cx,cy){if(!live)return;hi=i;const x=X(i);if(x<P.l-1||x>W-P.r+1){leave();return;}xh.setAttribute('x1',x);xh.setAttribute('x2',x);xh.setAttribute('y1',P.t);xh.setAttribute('y2',H-P.b);xh.setAttribute('opacity',1);
      d1.setAttribute('cx',x);d1.setAttribute('cy',Y(D[i].rev));d1.setAttribute('opacity',1);if(ma){d2.setAttribute('cx',x);d2.setAttribute('cy',Y(MA[i]));d2.setAttribute('opacity',1);}
      const r=M.svg.getBoundingClientRect(),d=D[i].d,rows=[{c:ma?'var(--line-strong)':'var(--cs1)',v:'NT$ '+chtxFmt(D[i].rev),k:'每日'}];if(ma)rows.push({c:'var(--cs1)',v:'NT$ '+chtxFmt(MA[i]),k:'7 日平均'});
      tip.show(cx??r.left+x,cy??r.top+Y(ma?MA[i]:D[i].rev),chtxYMD(d)+'（'+CHTX_WK[d.getDay()]+'）',rows);}
    function leave(){hi=-1;xh.setAttribute('opacity',0);d1.setAttribute('opacity',0);d2.setAttribute('opacity',0);tip&&tip.hide();}
    if(live){const svg=M.svg;
      svg.addEventListener('pointermove',ev=>{const r=svg.getBoundingClientRect(),fx=(ev.clientX-r.left-P.l)/(r.width-P.l-P.r);if(fx<0||fx>1){leave();return;}hover(Math.round(s+fx*(e-s)),ev.clientX,ev.clientY);});
      svg.addEventListener('pointerleave',leave);svg.addEventListener('blur',leave);
      chtxKeys(svg,'每日營收主圖，方向鍵逐日查看',(m,sh)=>{let i=hi<0?Math.round(e):hi;hover(chtxClamp(i+m[0]*(sh?7:1),Math.ceil(s),Math.floor(e)));});
      const MIN=7,toI=cx=>{const r=osv.getBoundingClientRect();return chtxClamp((cx-r.left-P.l)/(r.width-P.l-P.r)*(N-1),0,N-1);};
      const clearPreset=()=>{if(!presets)return;presets.querySelectorAll('.sgm-it').forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-checked','false');});const ind=presets.querySelector('.sgm-ind');if(ind)ind.style.width='0px';};
      osv.addEventListener('pointerdown',ev=>{ev.preventDefault();osv.setPointerCapture(ev.pointerId);const i0=toI(ev.clientX),r=osv.getBoundingClientRect(),sc=r.width/W;
        const xs=OX(s)*sc,xe=OX(e)*sc,lx=ev.clientX-r.left;let mode;
        if(Math.abs(lx-xs)<10)mode='l';else if(Math.abs(lx-xe)<10)mode='r';else if(lx>xs&&lx<xe)mode='m';else mode='n';
        const s0=s,e0=e;clearPreset();cancelAnimationFrame(br._raf);win.style.cursor=mode==='m'?'grabbing':'';
        const mv=m=>{const i=toI(m.clientX);if(mode==='m'){const sp=e0-s0;s=chtxClamp(s0+i-i0,0,N-1-sp);e=s+sp;}else if(mode==='l')s=chtxClamp(i,0,e-MIN);else if(mode==='r')e=chtxClamp(i,s+MIN,N-1);
          else{const a=Math.min(i0,i),b=Math.max(i0,i);if(b-a<MIN){if(i>=i0){s=chtxClamp(i0,0,N-1-MIN);e=s+MIN;}else{e=chtxClamp(i0,MIN,N-1);s=e-MIN;}}else{s=a;e=b;}}update();};
        const up=()=>{osv.removeEventListener('pointermove',mv);osv.removeEventListener('pointerup',up);win.style.cursor='';s=Math.round(s);e=Math.round(e);update();};
        osv.addEventListener('pointermove',mv);osv.addEventListener('pointerup',up);if(mode==='n')mv(ev);});
      osv.setAttribute('tabindex','0');osv.setAttribute('role','slider');osv.setAttribute('aria-label','選取範圍，左右鍵平移，減號與等號縮放');osv.classList.add('chtx-focus');
      osv.addEventListener('keydown',ev=>{const sp=e-s,k=ev.shiftKey?7:1;let ds=0,de=0;
        if(ev.key==='ArrowLeft')ds=de=-k;else if(ev.key==='ArrowRight')ds=de=k;else if(ev.key==='-'||ev.key==='_'){ds=-7;de=7;}else if(ev.key==='='||ev.key==='+'){if(sp-14>=MIN){ds=7;de=-7;}}else return;
        ev.preventDefault();clearPreset();let ns=s+ds,ne=e+de;if(ds===de){if(ns<0){ne-=ns;ns=0;}if(ne>N-1){ns-=ne-(N-1);ne=N-1;}}else{ns=Math.max(0,ns);ne=Math.min(N-1,ne);}
        const s0=s,e0=e;chtxAnim(br,chtxMs('--dur-fast',1.47),t=>{s=chtxLerp(s0,ns,t);e=chtxLerp(e0,ne,t);update();});
        osv.setAttribute('aria-valuetext',chtxYMD(D[Math.round(ns)].d)+' 至 '+chtxYMD(D[Math.round(ne)].d));});
      const h=ce('div','chtx-hint');h.textContent='拖曳下方選取框平移、拖兩側把手縮放；聚焦後 ← → 平移、− ＝ 縮放';box.appendChild(h);}
    if(o.w){M.svg.setAttribute('viewBox',`0 0 ${o.w} ${H}`);M.svg.setAttribute('width',o.w);onW(o.w);}};

  /* ════ area-stack：堆疊面積圖 ════ */
  CHTX['area-stack']=function(box,size,o){const {MON,MONF,CH:ALL}=chtxData(),S=size==='s',live=!!o.live,n=MON.length;
    const CH=ALL.slice(0,chtxClamp(+o.series||4,2,4));chtxHead(box,'各通路營收','2025/11–2026/10 · 單位：萬元',size);const tip=live?chtxTip(box):null;
    let wt=CH.map(()=>1),on=CH.map(()=>true),W=0,hi=-1,yMax=0,tk=null;const H=S?72:(live?230:140),P=S?{l:2,r:2,t:4,b:2}:{l:36,r:8,t:10,b:22};
    if(!S){const tog=live&&o.toggle!==false;box.appendChild(chtxLegend(CH,tog?(i,b)=>{if(on[i]&&on.filter(Boolean).length===1)return;on[i]=!on[i];b.setAttribute('aria-pressed',String(on[i]));go();}:null));}
    const gG=chtxSv('g'),gM=chtxSv('g'),gO=chtxSv('g'),xh=chtxSv('line',{class:'chtx-xh',opacity:0});gO.appendChild(xh);
    const dots=CH.map(s=>{const d=chtxSv('circle',{r:3.6,opacity:0,class:'cht-hdot',style:`fill:var(${s.c})`});gO.appendChild(d);return d;});
    const tot=w=>MON.map((_,i)=>CH.reduce((a,s,j)=>a+s.v[i]*w[j],0));
    const X=i=>P.l+i*(W-P.l-P.r)/(n-1),Y=v=>P.t+(H-P.t-P.b)*(1-v/yMax);
    function stack(){const lo=[],up=[];let acc=MON.map(()=>0);CH.forEach((s,j)=>{lo.push(acc.slice());acc=acc.map((a,i)=>a+s.v[i]*wt[j]);up.push(acc.slice());});return {lo,hi:up};}
    function render(){if(!W)return;const St=stack();let g='';
      if(!S){for(let v=0;v<=tk.max;v+=tk.step){const y=Y(v);if(y<P.t-1)continue;g+=`<line class="${v?'chtx-gl':'chtx-bl'}" x1="${P.l}" x2="${W-P.r}" y1="${y}" y2="${y}"/><text class="chtx-ax" x="${P.l-6}" y="${y+3.5}" text-anchor="end">${chtxFmt(v)}</text>`;}
        const every=(W-P.l-P.r)/(n-1)<34?((W-P.l-P.r)/(n-1)<20?3:2):1;MON.forEach((m,i)=>{if(i%every)return;g+=`<text class="chtx-axc" x="${X(i)}" y="${H-7}" text-anchor="${i===0?'start':i===n-1?'end':'middle'}">${m}</text>`;});}
      gG.innerHTML=g;let m='';
      CH.forEach((s,j)=>{if(wt[j]<.001)return;const up=St.hi[j].map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)),dn=St.lo[j].map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).reverse();
        m+=`<path d="M${up.join('L')}L${dn.join('L')}Z" style="fill:var(${s.c});fill-opacity:${(.22*wt[j]).toFixed(3)}"/><path d="M${up.join('L')}" style="fill:none;stroke:var(${s.c});stroke-width:${S?1.5:2};stroke-linejoin:round;opacity:${wt[j].toFixed(3)}"/>`;});
      gM.innerHTML=m;if(hi>=0)hover(hi);}
    function go(){const w0=wt.slice(),w1=on.map(b=>b?1:0),y0=yMax;tk=chtxScale4(Math.max(...tot(w1))*1.02);chtxAnim(go,chtxMs('--dur-slow',1.04),k=>{wt=w0.map((v,j)=>chtxLerp(v,w1[j],k));yMax=chtxLerp(y0,tk.max,k);render();});}
    function hover(i,cx,cy){hi=i;const St=stack(),x=X(i);xh.setAttribute('x1',x);xh.setAttribute('x2',x);xh.setAttribute('y1',P.t);xh.setAttribute('y2',H-P.b);xh.setAttribute('opacity',1);
      dots.forEach((d,j)=>{d.setAttribute('cx',x);d.setAttribute('cy',Y(St.hi[j][i]));d.setAttribute('opacity',on[j]?1:0);});
      const rows=CH.map((s,j)=>({c:`var(${s.c})`,v:chtxFmt(s.v[i])+' 萬',k:s.k,j})).filter(r=>on[r.j]).reverse();rows.push({v:chtxFmt(CH.reduce((a,s,j)=>a+(on[j]?s.v[i]:0),0))+' 萬',k:'合計',cls:'tot'});
      const r=PL.svg.getBoundingClientRect();tip.show(cx??r.left+x,cy??r.top+Y(St.hi[CH.length-1][i]),MONF[i],rows);}
    function leave(){hi=-1;xh.setAttribute('opacity',0);dots.forEach(d=>d.setAttribute('opacity',0));tip&&tip.hide();}
    tk=chtxScale4(Math.max(...tot(wt))*1.02);yMax=tk.max;
    const PL=chtxPlot(box,o,H,w=>{W=w;render();});PL.svg.append(gG,gM,gO);if(W)render();
    if(live){const svg=PL.svg;svg.addEventListener('pointermove',e=>{const r=svg.getBoundingClientRect();hover(chtxClamp(Math.round((e.clientX-r.left-P.l)/(r.width-P.l-P.r)*(n-1)),0,n-1),e.clientX,e.clientY);});
      svg.addEventListener('pointerleave',leave);svg.addEventListener('blur',leave);chtxKeys(svg,'各通路營收堆疊面積圖，方向鍵逐月查看',m=>hover(chtxClamp((hi<0?n-1:hi)+m[0],0,n-1)));}};

  /* ════ bar-stack：堆疊長條 ════ */
  CHTX['bar-stack']=function(box,size,o){const S=size==='s',live=!!o.live;const M=['5月','6月','7月','8月','9月','10月'];
    const SE=[{k:'信用卡',c:'--cs1',v:[6820,7140,6510,6690,6980,7410]},{k:'行動支付',c:'--cs2',v:[3960,4480,4310,4620,5050,5580]},{k:'貨到付款',c:'--cs3',v:[1980,2050,1760,1690,1640,1580]},{k:'ATM 轉帳',c:'--cs4',v:[940,1010,880,860,830,790]}];
    const TOT=M.map((_,i)=>SE.reduce((a,s)=>a+s.v[i],0)),AM=chtxScale4(Math.max(...TOT));
    let m=o.scale==='percent'?1:0,W=0,hs=-1,hm=-1;const H=S?72:(live?230:150),P=S?{l:2,r:2,t:4,b:2}:{l:38,r:4,t:16,b:22},rr=chtxR();
    const tools=chtxHead(box,'每月訂單的付款方式','2026/5–2026/10 · 單位：筆',size);const tip=live?chtxTip(box):null;const st={};
    if(!S){tools.appendChild(chtxSeg(['筆數','百分比'],m,i=>{const m0=m;chtxAnim(st,chtxMs('--dur-slow',1.12),k=>{m=chtxLerp(m0,i,k);render();});},'刻度',live));box.appendChild(chtxLegend(SE));}
    const gG=chtxSv('g'),gB=chtxSv('g');const ih=()=>H-P.t-P.b,gw=()=>(W-P.l-P.r)/M.length;
    function geo(i,j){const base=P.t+ih(),val=k=>chtxLerp(SE[k].v[i]/AM.max,SE[k].v[i]/TOT[i],m)*ih();let y=base;for(let k=0;k<j;k++)y-=val(k);const h=val(j);return {y0:y-h,h};}
    function render(){if(!W)return;let g='';
      if(!S){for(let k=0;k<=4;k++){const y=P.t+ih()*(1-k/4);g+=`<line class="${k?'chtx-gl':'chtx-bl'}" x1="${P.l}" x2="${W-P.r}" y1="${y}" y2="${y}"/>`;
          g+=`<text class="chtx-ax" x="${P.l-6}" y="${y+3.5}" text-anchor="end" opacity="${(1-m).toFixed(2)}">${chtxFmt(AM.step*k)}</text><text class="chtx-ax" x="${P.l-6}" y="${y+3.5}" text-anchor="end" opacity="${m.toFixed(2)}">${25*k}%</text>`;}
        M.forEach((mm,i)=>{const cx=P.l+gw()*(i+.5);g+=`<text class="chtx-axc" x="${cx}" y="${H-7}" text-anchor="middle">${mm}</text>`;
          const top=geo(i,SE.length-1);if(W>240)g+=`<text class="chtx-ax" x="${cx}" y="${top.y0-5}" text-anchor="middle" opacity="${(1-m).toFixed(2)}">${(TOT[i]/1000).toFixed(1)}K</text>`;});}
      gG.innerHTML=g;const bw=Math.min(S?14:(o.thin===false?24:12),gw()*.55);let b='';
      M.forEach((_,i)=>{const cx=P.l+gw()*(i+.5),x=cx-bw/2;SE.forEach((s,j)=>{const q=geo(i,j),gap=j?(S?1:2):0,h=Math.max(0,q.h-gap);const d=j===SE.length-1?chtxBarTop(x,q.y0,bw,h,rr):`M${x},${q.y0+h}V${q.y0}H${x+bw}V${q.y0+h}Z`;
        b+=`<path class="chtx-dim${hs>=0&&!(hs===j&&hm===i)?' is-dim':''}" data-i="${i}" data-j="${j}" d="${d}" style="fill:var(${s.c})"/>`;});});gB.innerHTML=b;}
    function pick(i,j,cx,cy){hm=i;hs=j;gB.querySelectorAll('path').forEach(p=>p.classList.toggle('is-dim',!(+p.dataset.i===i&&+p.dataset.j===j)));
      const q=geo(i,j),r=PL.svg.getBoundingClientRect(),cxx=P.l+gw()*(i+.5);
      tip.show(cx??r.left+cxx+12,cy??r.top+q.y0+q.h/2,M[i]+' · '+SE[j].k,[{c:`var(${SE[j].c})`,v:chtxFmt(SE[j].v[i])+' 筆',k:'訂單'},{v:(SE[j].v[i]/TOT[i]*100).toFixed(1)+'%',k:'占當月'},{v:chtxFmt(TOT[i])+' 筆',k:'當月合計',cls:'tot'}]);}
    function leave(){hs=hm=-1;gB.querySelectorAll('path').forEach(p=>p.classList.remove('is-dim'));tip&&tip.hide();}
    const PL=chtxPlot(box,o,H,w=>{W=w;render();});PL.svg.append(gG,gB);if(W)render();
    if(live){const svg=PL.svg;svg.addEventListener('pointermove',e=>{const r=svg.getBoundingClientRect(),lx=e.clientX-r.left,ly=e.clientY-r.top,i=Math.floor((lx-P.l)/gw());if(i<0||i>=M.length){leave();return;}
        let j=-1;for(let k=0;k<SE.length;k++){const q=geo(i,k);if(ly>=q.y0-1&&ly<=q.y0+q.h+1){j=k;break;}}if(j<0){if(hs>=0)leave();return;}pick(i,j,e.clientX,e.clientY);});
      svg.addEventListener('pointerleave',leave);svg.addEventListener('blur',leave);
      chtxKeys(svg,'付款方式堆疊長條，左右換月份、上下換付款方式',mv=>{let i=hm<0?M.length-1:hm,j=hs<0?0:hs;pick(chtxClamp(i+mv[0],0,M.length-1),chtxClamp(j-mv[1],0,SE.length-1));});}};

  /* ════ combo：長條＋折線組合圖（預設分開；雙軸為選配） ════ */
  CHTX.combo=function(box,size,o){const {MON,MONF,CH}=chtxData(),S=size==='s',live=!!o.live,n=MON.length;
    const REV=MON.map((_,i)=>CH.reduce((a,s)=>a+s.v[i],0)),CR=[3.62,3.18,2.94,2.71,2.86,2.92,3.05,3.84,3.01,2.97,3.08,3.26];
    const RS=chtxScale4(Math.max(...REV)),CS={max:4,step:1};let m=1,W=0,hi=-1;const H=S?84:(live?250:168),P=S?{l:2,r:2,t:4,b:2}:{l:36,r:0,t:12,b:22},GAP=S?8:20,rr=chtxR();
    const tools=chtxHead(box,'月營收與轉換率','2025/11–2026/10',size);const tip=live?chtxTip(box):null;const st={};
    if(!S){   /* 2026-11-10 拿掉「分開／雙軸」切換，固定上下分開 */
      box.appendChild(chtxLegend([{k:'營收（萬元）',c:'--cs1'},{k:'轉換率（%）',c:'--cs2',line:1}]));}
    const gH=chtxSv('g'),gG=chtxSv('g'),gB=chtxSv('g'),gL=chtxSv('g'),gO=chtxSv('g');
    const band=chtxSv('rect',{rx:chtxR(),opacity:0,style:`fill:var(--panel-3);transition:opacity var(--dur-fast) var(--ease-out)`});gH.appendChild(band);
    const dot=chtxSv('circle',{r:3.6,opacity:0,class:'cht-hdot',style:'fill:var(--cs2)'});gO.appendChild(dot);
    const gw=()=>(W-P.l-P.r)/n,cx=i=>P.l+gw()*(i+.5);
    function panels(){const full=H-P.t-P.b,h1=(full-GAP)*.55;return {bT:P.t,bB:chtxLerp(P.t+full,P.t+h1,m),lT:chtxLerp(P.t,P.t+h1+GAP,m),lB:P.t+full};}
    function render(){if(!W)return;const p=panels(),yb=v=>p.bB-(v/RS.max)*(p.bB-p.bT),yl=v=>p.lB-(v/CS.max)*(p.lB-p.lT);let g='';
      if(!S){for(let k=0;k<=4;k++){const y=yb(RS.step*k);if(m>.5&&k%2)continue;g+=`<line class="${k?'chtx-gl':'chtx-bl'}" x1="${P.l}" x2="${W-P.r}" y1="${y}" y2="${y}"/><text class="chtx-ax" x="0" y="${y+3.5}" text-anchor="start">${chtxFmt(RS.step*k)}</text>`;}
        for(let k=0;k<=4;k++){const y=yl(CS.step*k);if(m>.5&&k%2)continue;if(m>.02)g+=`<line class="${k?'chtx-gl':'chtx-bl'}" x1="${P.l}" x2="${W-P.r}" y1="${y}" y2="${y}" opacity="${m.toFixed(2)}"/>`;g+=`<text class="chtx-ax" x="0" y="${y+3.5}" text-anchor="start">${k}%</text>`;}
        const every=gw()<20?3:gw()<34?2:1;MON.forEach((mm,i)=>{if(i%every)return;g+=`<text class="chtx-axc" x="${cx(i)}" y="${H-7}" text-anchor="middle">${mm}</text>`;});}
      else g+=`<line class="chtx-bl" x1="${P.l}" x2="${W-P.r}" y1="${p.bB}" y2="${p.bB}"/>`;
      gG.innerHTML=g;const bw=Math.min(S?10:22,gw()*.56);let b='';REV.forEach((v,i)=>{const y=yb(v);b+=`<path class="chtx-dim${hi>=0&&hi!==i?' is-dim':''}" d="${chtxBarTop(cx(i)-bw/2,y,bw,p.bB-y,rr)}" style="fill:var(--cs1)"/>`;});gB.innerHTML=b;
      gL.innerHTML=`<path d="M${CR.map((v,i)=>cx(i).toFixed(1)+','+yl(v).toFixed(1)).join('L')}" style="fill:none;stroke:var(--cs2);stroke-width:${S?1.5:2};stroke-linejoin:round;stroke-linecap:round"/>`;
      if(hi>=0)hover(hi);}
    function hover(i,ex,ey){hi=i;const p=panels(),yl=v=>p.lB-(v/CS.max)*(p.lB-p.lT);band.setAttribute('x',P.l+gw()*i+1);band.setAttribute('width',gw()-2);band.setAttribute('y',P.t-6);band.setAttribute('height',H-P.b-P.t+6);band.setAttribute('opacity',1);
      gB.querySelectorAll('path').forEach((q,k)=>q.classList.toggle('is-dim',k!==i));dot.setAttribute('cx',cx(i));dot.setAttribute('cy',yl(CR[i]));dot.setAttribute('opacity',1);
      const r=PL.svg.getBoundingClientRect();tip.show(ex??r.left+cx(i),ey??r.top+yl(CR[i]),MONF[i],[{c:'var(--cs1)',v:chtxFmt(REV[i])+' 萬',k:'營收'},{c:'var(--cs2)',v:CR[i].toFixed(2)+'%',k:'轉換率'}]);}
    function leave(){hi=-1;band.setAttribute('opacity',0);dot.setAttribute('opacity',0);gB.querySelectorAll('path').forEach(q=>q.classList.remove('is-dim'));tip&&tip.hide();}
    const PL=chtxPlot(box,o,H,w=>{W=w;render();});PL.svg.append(gH,gG,gB,gL,gO);if(W)render();
    if(live){const svg=PL.svg;svg.addEventListener('pointermove',e=>{const r=svg.getBoundingClientRect(),i=Math.floor((e.clientX-r.left-P.l)/gw());if(i<0||i>=n){leave();return;}hover(i,e.clientX,e.clientY);});
      svg.addEventListener('pointerleave',leave);svg.addEventListener('blur',leave);chtxKeys(svg,'月營收與轉換率組合圖，方向鍵逐月查看',mv=>hover(chtxClamp((hi<0?n-1:hi)+mv[0],0,n-1)));}};

  /* ════ bar-rank：橫向排名長條（FLIP 換位） ════ */
  CHTX['bar-rank']=function(box,size,o){const S=size==='s',live=!!o.live;
    const ALL=[['機能防潑水外套',3280,1306],['登山後背包 28L',2490,1542],['美麗諾羊毛圍巾',890,3860],['防水短靴',2980,812],['輕量羽絨背心',1980,1095],['速乾排汗 T 恤',590,4720],['保溫隨行杯',680,2960],['抓絨保暖手套',450,3210]].map(([k,p,q])=>({k,p,q,s:p*q}));
    const PR=S?[...ALL].sort((a,b)=>b.s-a.s).slice(0,4):live?ALL:[...ALL].sort((a,b)=>b.s-a.s).slice(0,6);
    const SUM={s:PR.reduce((a,x)=>a+x.s,0),q:PR.reduce((a,x)=>a+x.q,0)};let metric='s',asc=o.sort==='asc',first0=true;
    const tools=chtxHead(box,'熱銷商品 Top '+PR.length,'近 30 天',size);const tip=live?chtxTip(box):null;
    if(!S){tools.append(chtxPick(['銷售額','銷量'],0,i=>{metric=i?'q':'s';apply();},'指標',live,o));
      if(live)tools.append(o.dropdown!==false?chtxSortBtn(asc,a=>{asc=a;apply();}):chtxSeg(['由高到低','由低到高'],asc?1:0,i=>{asc=!!i;apply();},'排序',live));}
    const rk=ce('div','chtx-rk'+(live?' is-live':'')+(o.values===false?' no-vals':''));box.appendChild(rk);
    const axis=ce('div','chtx-rk-axis');axis.innerHTML='<span></span><span></span><div></div>';if(!S)rk.appendChild(axis);
    const rows=PR.map(x=>{const r=ce('div','chtx-rk-row');r.innerHTML='<span class="chtx-rk-n"></span><span class="chtx-rk-name"></span><div class="chtx-rk-bar"><i></i><b></b></div>';r.querySelector('.chtx-rk-name').textContent=x.k;r._d=x;rk.appendChild(r);
      if(live){r.tabIndex=0;const show=(cx,cy)=>{rk.classList.add('hov');const b=r.getBoundingClientRect();
          tip.show(cx??b.left+b.width*.6,cy??b.top+b.height/2,x.k,[{c:'var(--cs1)',v:'NT$ '+chtxFmt(x.s),k:'銷售額'},{v:chtxFmt(x.q)+' 件',k:'銷量'},{v:(x[metric]/SUM[metric]*100).toFixed(1)+'%',k:'占 Top '+PR.length+' '+(metric==='s'?'銷售額':'銷量')}]);};
        const hide=()=>{rk.classList.remove('hov');tip.hide();};
        r.addEventListener('pointermove',e=>show(e.clientX,e.clientY));r.addEventListener('pointerleave',hide);r.addEventListener('focus',()=>show());r.addEventListener('blur',hide);
        r.addEventListener('keydown',e=>{const d=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;if(!d)return;e.preventDefault();const vis=[...rk.querySelectorAll('.chtx-rk-row')];const n=vis[vis.indexOf(r)+d];if(n)n.focus();});}
      return r;});
    const lab=x=>metric==='s'?(x.s/10000).toFixed(1)+' 萬':chtxFmt(x.q)+' 件';
    function apply(){const mx=chtxScale4(Math.max(...PR.map(x=>x[metric]))),rank=[...PR].sort((a,b)=>b[metric]-a[metric]);
      const ax=axis.querySelector('div');ax.innerHTML='';for(let k=0;k<=4;k+=2){const sp=ce('span');sp.style.left=(k/4*100)+'%';const v=mx.step*k;sp.textContent=metric==='s'?(v?chtxFmt(v/10000)+'萬':'0'):chtxFmt(v);ax.appendChild(sp);}
      const first=new Map(rows.map(r=>[r,r.getBoundingClientRect().top]));
      rows.forEach(r=>{const x=r._d,ri=rank.indexOf(x)+1;r.style.setProperty('--p',(x[metric]/mx.max).toFixed(4));r.querySelector('.chtx-rk-n').textContent=ri;r.querySelector('b').textContent=lab(x);r.setAttribute('aria-label',`第 ${ri} 名 ${x.k}，${lab(x)}`);});
      (asc?[...rank].reverse():rank).forEach(x=>rk.appendChild(rows.find(r=>r._d===x)));
      if(chtxRM()||first0||!live){first0=false;return;}
      rows.forEach(r=>{const dy=first.get(r)-r.getBoundingClientRect().top;if(!dy)return;r.style.transition='none';r.style.transform=`translateY(${dy}px)`;});
      requestAnimationFrame(()=>requestAnimationFrame(()=>rows.forEach(r=>{r.style.transition='';r.style.transform='';})));}
    apply();};

  /* ════ funnel：漏斗圖 ════ */
  CHTX.funnel=function(box,size,o){const S=size==='s',live=!!o.live;const ALL=['瀏覽商品','加入購物車','進入結帳','填寫付款資料','完成訂單'];
    const DV0={全部:[48200,9640,4820,3610,2890],手機:[34100,6480,2980,2090,1610],桌機:[14100,3160,1840,1520,1280]};
    const ns=chtxClamp(+o.stages||5,3,5),pickI=ns===5?[0,1,2,3,4]:ns===4?[0,1,2,4]:[0,1,4];const STG=pickI.map(i=>ALL[i]),DV={};Object.keys(DV0).forEach(k=>DV[k]=pickI.map(i=>DV0[k][i]));let dv='全部';
    const tools=chtxHead(box,'結帳漏斗','近 7 天 · 不重複訪客',size);const tip=live?chtxTip(box):null;
    const fn=ce('div','chtx-fn'+(live?' is-live':''));const rows=[],steps=[];const rates=!S&&o.rates!==false;
    STG.forEach((k,i)=>{if(i&&rates){const sp=ce('div','chtx-fn-step');sp.innerHTML=ICON_ARROW+'<span></span>';fn.appendChild(sp);steps.push(sp);}
      const r=ce('div','chtx-fn-row');r.innerHTML='<div class="chtx-fn-l"><span><span class="k"></span> <b></b></span><span></span></div><div class="chtx-fn-bar"><span class="loss"></span><i></i></div>';r.querySelector('.k').textContent=k;fn.appendChild(r);rows.push(r);
      if(live){r.tabIndex=0;const show=(cx,cy)=>{fn.classList.add('hov');r.classList.add('on');const v=DV[dv],bb=r.querySelector('.chtx-fn-bar').getBoundingClientRect();const rr=[{c:'var(--cs1)',v:chtxFmt(v[i])+' 人',k:'到達'},{v:(v[i]/v[0]*100).toFixed(1)+'%',k:'占第一步'}];
          if(i){rr.splice(1,0,{v:(v[i]/v[i-1]*100).toFixed(1)+'%',k:'上一步轉換'});rr.push({v:'−'+chtxFmt(v[i-1]-v[i])+' 人（'+((1-v[i]/v[i-1])*100).toFixed(1)+'%）',k:'從上一步流失',cls:'tot neg'});}
          tip.show(cx??bb.left+bb.width*v[i]/v[0],cy??bb.top,k,rr);};
        const hide=()=>{fn.classList.remove('hov');r.classList.remove('on');tip.hide();};
        r.addEventListener('pointermove',e=>show(e.clientX,e.clientY));r.addEventListener('pointerleave',hide);r.addEventListener('focus',()=>show());r.addEventListener('blur',hide);
        r.addEventListener('keydown',e=>{const d=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;if(!d)return;e.preventDefault();const n=rows[i+d];if(n)n.focus();});}});
    function apply(){const v=DV[dv];rows.forEach((r,i)=>{r.style.setProperty('--p',(v[i]/v[0]).toFixed(4));r.style.setProperty('--pp',(i?v[i-1]/v[0]:1).toFixed(4));
        r.querySelector('b').textContent=chtxFmt(v[i]);r.querySelector('.chtx-fn-l>span:last-child').textContent=(v[i]/v[0]*100).toFixed(1)+'%';r.setAttribute('aria-label',`${STG[i]} ${chtxFmt(v[i])} 人`);});
      steps.forEach((sp,i)=>sp.querySelector('span').textContent='轉換 '+(v[i+1]/v[i]*100).toFixed(1)+'%');}
    if(!S)tools.appendChild(chtxPick(Object.keys(DV),0,i=>{dv=Object.keys(DV)[i];apply();},'裝置',live,o));box.appendChild(fn);apply();};

  /* ════ heatmap：熱力圖（星期 × 小時；色階＝--s-chart-seq-*） ════ */
  CHTX.heatmap=function(box,size,o){const S=size==='s',live=!!o.live;const DAYN=['週一','週二','週三','週四','週五','週六','週日'];
    const curve=[22,12,6,3,2,2,4,9,18,26,32,38,52,48,36,34,36,40,46,58,78,92,84,52];
    const make=kind=>{const R=chtxRng(kind?11:4);return DAYN.map((_,d)=>curve.map((v,h)=>{const we=d>=5;let x=v*(we?(h>=9&&h<=17?1.35:1.08):1)*(d===4&&h>=20?1.12:1);
      if(kind){x*=d===2?1.9:1.25;if(d===2&&h===0)x=262;if(d===2&&h===1)x=176;if(d===1&&h>=22)x*=1.5;}return Math.round(x*(.88+R()*.24));}));};
    const DATA=[make(0),make(1)],six=String(o.steps||'6')!=='5';
    const BINS=six?[0,10,25,45,70,100]:[0,15,35,60,90],SEQ=six?[0,1,2,3,4,5]:[0,1,3,4,5];const bin=v=>{let b=0;BINS.forEach((t,i)=>{if(v>=t)b=i;});return b;};
    let ds=0,W=0,cell=0,ch=0,hc=null;const P={l:S?2:38,t:4,b:S?2:18},GAP=S?1:2;
    const tools=chtxHead(box,'下單時段熱度','每格＝該時段平均每小時訂單數',size);const tip=live?chtxTip(box):null;
    if(!S)tools.appendChild(chtxSeg(['近 4 週','去年雙 11 當週'],0,i=>{ds=i;paint(true);},'資料',live));
    const gC=chtxSv('g'),gT=chtxSv('g'),ring=chtxSv('rect',{rx:chtxR(),opacity:0,style:'fill:none;stroke:var(--ink);stroke-width:1.5;pointer-events:none'});
    const lbl=(d,h)=>`${d===2&&ds===1?'11/11 ':''}${DAYN[d]} ${String(h).padStart(2,'0')}:00–${String(h+1).padStart(2,'0')}:00`;
    let peak=null;
    const PL=chtxPlot(box,{},100,w=>{W=w;build();});PL.svg.append(gT,gC,ring);if(o.w){W=o.w;PL.svg.setAttribute('width',o.w);}
    if(!S&&o.legend!==false){const leg=ce('div','chtx-hm-leg');peak=ce('span');const sc=ce('div','chtx-hm-scale');
      sc.innerHTML='<span>少</span><span class="bins">'+BINS.map((b,i)=>`<span><i style="background:var(--s-chart-seq-${SEQ[i]})"></i>${b}${i===BINS.length-1?'+':''}</span>`).join('')+'</span><span>多</span>';
      leg.append(peak,sc);box.appendChild(leg);}
    function build(){const short=W<520;if(!S)P.l=short?26:38;cell=Math.max(S?3:6,(W-P.l)/24-GAP);ch=S?chtxClamp(cell*1.4,6,10):chtxClamp(cell,14,24);const H=P.t+7*(ch+GAP)+P.b;
      PL.svg.setAttribute('viewBox',`0 0 ${W} ${H}`);PL.svg.setAttribute('height',H);let t='';
      if(!S){DAYN.forEach((d,i)=>{d=short?d.slice(1):d;t+=`<text class="chtx-axc" x="${P.l-6}" y="${P.t+i*(ch+GAP)+ch/2+3.5}" text-anchor="end">${d}</text>`;});
        for(let h=0;h<24;h+=(W<300?6:3))t+=`<text class="chtx-ax" x="${P.l+h*(cell+GAP)}" y="${H-4}" text-anchor="start">${String(h).padStart(2,'0')}</text>`;}
      gT.innerHTML=t;gC.innerHTML='';const rx=Math.min(chtxR(),ch/4);
      for(let d=0;d<7;d++)for(let h=0;h<24;h++){const r=chtxSv('rect',{class:'chtx-hm-cell',x:P.l+h*(cell+GAP),y:P.t+d*(ch+GAP),width:cell,height:ch,rx});r.dataset.d=d;r.dataset.h=h;gC.appendChild(r);}paint(false);}
    function paint(wave){const D=DATA[ds];gC.querySelectorAll('rect').forEach(r=>{const d=+r.dataset.d,h=+r.dataset.h;r.style.transitionDelay=wave&&!chtxRM()?(h*14)+'ms':'0ms';r.style.fill=`var(--s-chart-seq-${SEQ[bin(D[d][h])]})`;});
      let pd=0,ph=0;D.forEach((row,d)=>row.forEach((v,h)=>{if(v>D[pd][ph]){pd=d;ph=h;}}));
      if(peak){peak.innerHTML='';const b=ce('b');b.textContent=`尖峰：${lbl(pd,ph)}`;peak.append(b,document.createTextNode(`，平均 ${D[pd][ph]} 筆`));}
      if(hc)show(hc[0],hc[1]);}
    function show(d,h,cx,cy){hc=[d,h];const x=P.l+h*(cell+GAP),y=P.t+d*(ch+GAP);ring.setAttribute('x',x-1.5);ring.setAttribute('y',y-1.5);ring.setAttribute('width',cell+3);ring.setAttribute('height',ch+3);ring.setAttribute('opacity',1);
      const r=PL.svg.getBoundingClientRect();tip.show(cx??r.left+x+cell/2,cy??r.top+y,lbl(d,h),[{c:`var(--s-chart-seq-${SEQ[bin(DATA[ds][d][h])]})`,v:DATA[ds][d][h]+' 筆',k:'平均每小時訂單'}]);}
    function leave(){hc=null;ring.setAttribute('opacity',0);tip&&tip.hide();}
    if(W)build();
    if(live){const svg=PL.svg;svg.addEventListener('pointermove',e=>{const t=e.target.closest&&e.target.closest('.chtx-hm-cell');if(!t){leave();return;}show(+t.dataset.d,+t.dataset.h,e.clientX,e.clientY);});
      svg.addEventListener('pointerleave',leave);svg.addEventListener('blur',leave);chtxKeys(svg,'下單時段熱力圖，方向鍵移動格子',m=>{const [d,h]=hc||[2,20];show(chtxClamp(d+m[1],0,6),chtxClamp(h+m[0],0,23));});}};

  /* --- 分派：chtChart(variant,size,o) 遇到進階型 → chtxChart --- */
  function chtxChart(variant,size,o){o=o||{};const s=size==='s'?'s':'m';
    const box=ce('div','cht-box cht-x cht-'+variant+' cht-sz-'+s+(o.live?' is-live':''));
    const opt=Object.assign({},o,{w:s==='s'?196:(o.live?null:320)});
    try{CHTX[variant](box,s,opt);}catch(err){console.error('chart '+variant,err);}
    return box;}

  /* --- Live 控制列 scoped：依圖型只留對應的 seg／勾選（標籤文字比對）--- */
  const CHTX_SEG_SCOPE={'系列數 series':'area-stack','刻度 scale':'bar-stack','步驟數 stages':'funnel','色階 steps':'heatmap'};
  Object.assign(CHT_BOOL_SCOPE,{'小圖 sparkline':'spark','區間切換 period':'spark','7 日平均 moving-avg':'brush','圖例可切換 legend toggle':'area-stack',
    '排名數值 values':'bar-rank','步驟轉換率 rates':'funnel','色階圖例 legend':'heatmap'});
  function chtxScopeCtl(host,variant){requestAnimationFrame(()=>{const root=document.getElementById('view')||host;
    root.querySelectorAll('.bento-ctl .ctl,.livewrap .ctl').forEach(c=>{const lab=c.querySelector(':scope>.lab');const sc=lab&&CHTX_SEG_SCOPE[lab.textContent.trim()];if(!sc)return;
      const show=sc===variant;c.style.display=show?'':'none';
      if(show){const a=c.querySelector('.seg>button[aria-pressed="true"]');if(a)a.setAttribute('aria-pressed','true');}});
    root.querySelectorAll('.bento-ctl .ctl,.livewrap .ctl').forEach(c=>{const ck=c.querySelector(':scope>.checks');if(!ck)return;c.style.display=[...ck.children].some(l=>l.style.display!=='none')?'':'none';});
    const variantCtl=host.querySelector('.livewrap .ctl .seg');if(variantCtl){const a=variantCtl.querySelector(':scope>button[aria-pressed="true"]');if(a)a.setAttribute('aria-pressed','true');}});}
  /* 矩陣：依圖表用途分段（每段一張 matrixPanel；列＝圖型、欄＝尺寸），軸值仍以 DIAL_SPECS.chart 為準 */
  function chtxMatrix(p,axes,active,VN,SZN){
    const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.size.filter(s=>active.size.has(s));
    const known=new Set(CHTX_GROUPS.flatMap(g=>g.vs));const groups=CHTX_GROUPS.map(g=>Object.assign({},g,{vs:g.vs.filter(v=>vs.includes(v))}));
    const rest=vs.filter(v=>!known.has(v));if(rest.length)groups.push({k:'other',t:'其他',d:'',vs:rest});
    groups.filter(g=>g.vs.length).forEach(g=>{const panel=matrixPanel({badge:'chart · '+g.t,name:'Variant × Size',desc:g.d,rows:g.vs,cols:ss,
      rowLab:v=>labHTML((VN[v]||[v])[0],v),colLab:s=>labHTML(SZN[s][0],SZN[s][1]),cell:(v,s)=>chtCell(v,s),mincol:g.k==='base'?240:360});panel.classList.add('cht-mx-group');p.appendChild(panel);});}

  function buildChart(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Chart',title:'Chart 圖表',
      lede:'儀表板圖表共 <b>15 型</b>，依用途分五段：<b>基礎</b>（stat 統計數字＝重用 <b>prMetricEl</b>、line 折線、curve 曲線、bar 長條、donut 甜甜圈、semi 半圓、pie 實心圓餅）、<b>趨勢</b>（spark KPI 趨勢小圖卡、brush 刷選縮放折線）、<b>組成</b>（area-stack 堆疊面積、bar-stack 堆疊長條）、<b>比較</b>（combo 長條＋折線、bar-rank 橫向排名）、<b>分布</b>（funnel 漏斗、heatmap 熱力圖）。× 兩尺寸：<b>m 標準</b>＝完整配置、<b>s 精簡</b>＝收座標軸／圖例／切換的小卡版。全部 <b>inline SVG 手刻</b>、無外部 lib；系列 1 綁 <code>--accent</code>（chart 內＝品牌橘），系列 2–4 綁 <code>--s-chart-2..4</code>，熱力色階 <code>--s-chart-seq-*</code>，狀態只用 <code>--s-feedback-*</code>；卡內切換預設重用 <b>Dropdown</b>、排序用一顆 <b>Button</b> 切換（同後台範本），長條一律細柱、圖例與漲跌重用 <b>.tg</b>，數字一律 <code>tabular-nums</code>。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>15 × 2 = 30</code>'],['token-policy','<code>--accent / --s-chart-2..4 / --s-chart-seq-0..5 / --s-feedback-*</code>'],['tech','<code>inline SVG 手刻 · tabular-nums · --dur-* / --ease-out</code>']]});
    const axes=DIAL_SPECS.chart.axes, zh=DIAL_SPECS.chart.zh, active=CHOICE.chart.active; // 接中央 store
    const VN={};axes.variant.forEach(v=>VN[v]=[zh.variant[v]||v,v]);
    const SZN={m:['標準','m'],s:['精簡','s']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML=''; chtxMatrix(p,axes,active,VN,SZN); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','依用途分段：基礎／趨勢／組成／比較／進度與分布。m 標準＝完整配置（座標軸、圖例、卡內切換）；s 精簡＝收掉座標軸與切換，適合塞進表格列或緊湊卡片。矩陣格為靜態版；可操作的版本在本頁最上方的互動預覽。');
    p=panelsIn(sec);renderM();

    /* showcase：一組 dashboard 並排（stat ×2 ＋ line ＋ bar ＋ donut），示意真實儀表板 */
    const cs=section(body,'Dashboard 組合示意','五張卡組成的迷你儀表板：兩張統計數字卡（prMetricEl 上升／下降）＋近期走勢折線＋雙週對照長條＋任務狀態甜甜圈。卡標題旁的 delta 與圖例都重用 .tg 原子；示意數據為固定值，方便明暗模式對照。');
    const dash=ce('div','cht-dash');
    function dashCard(title,delta,node,span){
      const c=ce('div','cht-card'+(span?' cht-span-'+span:''));
      const h=ce('div','cht-card-h');
      const t=ce('div','cht-card-t');t.textContent=title;h.appendChild(t);
      if(delta){const tg=ce('div','tg v-soft c-round '+(delta.up?'i-brand':'i-danger')+' st-default');tg.innerHTML='<span>'+delta.txt+'</span>';h.appendChild(tg);}
      c.append(h,node);return c;
    }
    dash.appendChild(dashCard('本月營收',null,chtChart('stat','m',{title:false,trend:'up',unit:true})));
    dash.appendChild(dashCard('客訴案件',null,chtChart('stat','m',{title:false,trend:'down'})));
    dash.appendChild(dashCard('任務狀態分布',null,chtChart('donut','m',{center:true,legend:true})));
    dash.appendChild(dashCard('近 10 期營收走勢',{up:true,txt:'+12.5%'},chtChart('line','m',{grid:true,area:true,xaxis:true,yaxis:true,interactive:true,wide:true}),3));
    const barCard=dashCard('每日訂單 本週 vs 上週',null,chtChart('bar','m',{series2:true,xaxis:true,yaxis:true,interactive:true,wide:true}),3);
    barCard.appendChild(chtLegend([{k:'本週',dot:'c-accent'},{k:'上週',dot:'c-ok'}]));
    dash.appendChild(barCard);
    cs.appendChild(dash);

    /* Live：seg 切 variant／size；其餘 seg／勾選依 variant scoped 顯示（只留當前圖型的選項） */
    const sl=section(body,'互動預覽與程式碼','切圖型與尺寸；下方選項會隨圖型只留對應的屬性（＝Figma variant／boolean property）。進階圖表在預覽裡都能直接操作：<b>滑過</b>看十字準線與 tooltip、<b>點圖例</b>開關系列、<b>卡內切換</b>看平滑變形、<b>聚焦後用方向鍵</b>逐點查看；刷選圖可拖曳下方總覽條縮放。');
    sl.classList.add('cht-live-sec');
    const vOpts=axes.variant.slice();
    mountLive(sl,{gate:'chart',
      initial:{variant:'line',size:'m',
        statTrend:true,statUnit:false,
        lineArea:true,lineGrid:true,lineXcat:true,lineYval:true,lineGrad:false,
        barSeries2:true,barVals:false,barXcat:true,barYval:true,
        donutCenter:true,donutLegend:true,pieLabels:true,
        sparkLine:true,sparkPeriod:true,brushMA:true,areaSeries:'4',areaToggle:true,stackScale:'count',
        rankVals:true,funnelStages:'5',funnelRates:true,heatSteps:'6',heatLegend:true},
      segs:[{key:'variant',label:'Variant',as:'select',options:vOpts,labels:vOpts.map(v=>zh.variant[v]||v)}, // BENTO-ALL:v1 圖表類型太多→下拉
            {key:'size',label:'Size',options:['s','m']},
            {key:'areaSeries',label:'系列數 series',options:['2','3','4']},
            {key:'stackScale',label:'刻度 scale',options:['count','percent'],labels:['筆數','百分比']},
            {key:'funnelStages',label:'步驟數 stages',options:['3','4','5']},
            {key:'heatSteps',label:'色階 steps',options:['5','6']}],
      bools:[{key:'statTrend',label:'趨勢 trend'},{key:'statUnit',label:'單位 unit'},
             {key:'lineArea',label:'面積填充 area'},{key:'lineGrad',label:'漸層填充 gradient'},{key:'lineGrid',label:'格線 grid'},{key:'lineXcat',label:'X 軸月份'},{key:'lineYval',label:'Y 軸數值'},
             {key:'barSeries2',label:'第二系列 series2'},{key:'barVals',label:'數值標 values'},{key:'barXcat',label:'X 軸星期'},{key:'barYval',label:'Y 軸數量'},
             {key:'donutCenter',label:'中央數字 center'},{key:'donutLegend',label:'圖例 legend'},{key:'pieLabels',label:'扇形百分比 labels'},
             {key:'sparkLine',label:'小圖 sparkline'},{key:'sparkPeriod',label:'區間切換 period'},{key:'brushMA',label:'7 日平均 moving-avg'},
             {key:'areaToggle',label:'圖例可切換 legend toggle'},{key:'rankVals',label:'排名數值 values'},
             {key:'funnelRates',label:'步驟轉換率 rates'},{key:'heatLegend',label:'色階圖例 legend'}],
      boolLabel:'選項（依圖型）',
      render:(st,sync)=>{
        if(sync){chtScopeBools(sl,st.variant);chtxScopeCtl(sl,st.variant);} // 只在真正渲染時 scope（CSS 分頁列舉時不動控制列）
        const stage=ce('div','cht-live-stage');
        let node;
        if(CHTX[st.variant]){
          node=chtChart(st.variant,st.size,{live:true,spark:st.sparkLine,period:st.sparkPeriod,ma:st.brushMA,series:st.areaSeries,toggle:st.areaToggle,scale:st.stackScale,
            values:st.rankVals,stages:st.funnelStages,rates:st.funnelRates,steps:st.heatSteps,legend:st.heatLegend});
          const multi=st.variant==='spark'&&st.size==='m';
          const tile=ce('div',multi?'chtx-live-bare':'cht-tile chtx-live-tile');if(st.size==='s'&&!multi){tile.style.width='auto';tile.style.display='inline-flex';}
          tile.appendChild(node);stage.appendChild(tile);return stage;
        }
        if(st.variant==='stat')node=chtChart('stat',st.size,{title:true,trend:st.statTrend?'up':null,unit:st.statUnit});
        else if(st.variant==='line')node=chtChart('line',st.size,{area:st.lineArea,grad:st.lineGrad,grid:st.lineGrid,xaxis:st.lineXcat,yaxis:st.lineYval,interactive:true,wide:true});
        else if(st.variant==='curve')node=chtChart('curve',st.size,{area:st.lineArea,grad:st.lineGrad,grid:st.lineGrid,xaxis:st.lineXcat,yaxis:st.lineYval,interactive:true,wide:true});
        else if(st.variant==='bar')node=chtChart('bar',st.size,{series2:st.barSeries2,vals:st.barVals,xaxis:st.barXcat,yaxis:st.barYval,interactive:true,wide:true});
        else node=chtChart(st.variant,st.size,{center:st.donutCenter,legend:st.donutLegend,labels:st.pieLabels});
        const tile=ce('div','cht-tile'+(st.variant==='line'||st.variant==='curve'||st.variant==='bar'?' cht-tile-wide':''));tile.appendChild(node);
        stage.appendChild(tile);
        return stage;
      },
      note:'↓ 基礎七型精簡尺寸快速對照（sparkline 式簡配）。系列色全綁 token（--accent／--s-chart-2..4／--s-feedback-*），明暗模式自動跟切；進階圖表的動態時長讀 --dur-*、曲線讀 --ease-out，系統開「減少動態」時直接跳到終點。',
      free:()=>['stat','line','curve','bar','donut','semi','pie'].map(v=>{const t=ce('div','cht-tile');t.appendChild(chtChart(v,'s',{}));return t;})
    });
  }

