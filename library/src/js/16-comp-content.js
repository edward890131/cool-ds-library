  /* ==================== price ==================== */
/* ---- PRICE 價格（builders 提升頂層，頁面與 summary Live 共用）---- */
  function prEl(variant,size){
    const el=ce('span',`pr-price pr-sz-${size} pr-v-${variant}`);
    if(variant==='normal'){
      el.innerHTML='<span class="pr-cur">NT$</span><span class="pr-amt">1,280</span>';
    }else if(variant==='discount'){
      el.setAttribute('aria-label','原價 NT$ 1,680，優惠價 NT$ 1,280');
      el.innerHTML='<s class="pr-orig" aria-hidden="true">NT$ 1,680</s><span class="pr-now"><span class="pr-cur">NT$</span><span class="pr-amt">1,280</span></span>';
    }else if(variant==='sale'){
      el.innerHTML='<span class="pr-cur">NT$</span><span class="pr-amt">990</span><span class="tg v-solid c-round i-danger st-default"><span>SALE</span></span>';
    }else if(variant==='free'){
      el.setAttribute('aria-label','免費');
      el.innerHTML='<s class="pr-orig" aria-hidden="true">NT$ 480</s><span class="pr-free">免費</span>';
    }
    return el;
  }
  /* metric 數值（dashboard KPI）：可組合式——基底大數字，另可各自開關 標題／單位／趨勢
     o.title=true 上方顯示標題、o.unit=true 數字後接單位、o.trend='up'|'down' 顯示趨勢 delta
     （趨勢 up 綁 --ok 正向綠、down 綁 --i-danger，icon 重用 IC_TRENDING；三者彼此正交、可任意組合） */
  function prMetricEl(size,o){o=o||{};
    const el=ce('span','pr-metric pr-m-sz-'+size);
    if(o.title){const t=ce('span','pr-mlabel');t.textContent='本月營收';el.appendChild(t);}
    const row=ce('span','pr-numrow');
    const num=ce('span','pr-num');num.textContent='8,542';row.appendChild(num);
    if(o.unit){const u=ce('span','pr-unit');u.textContent='筆';row.appendChild(u);}
    if(o.trend){const up=o.trend==='up';
      const d=tagEl('soft',up?'success':'danger','default',null,size==='lg'?'m':'s');d.classList.add('pr-delta-tag');d.setAttribute('aria-hidden','true');   /* 2026-11-10 趨勢改 Tag 原子（同後台 KPI） */
      d.querySelector('span').textContent=up?'+12.5%':'-3.2%';row.appendChild(d);}
    el.appendChild(row);
    if(o.trend){num.setAttribute('aria-hidden','true'); // a11y：容器報讀升降語意
      el.setAttribute('aria-label','8,542'+(o.unit?' 筆':'')+'，較上期'+(o.trend==='up'?'上升 12.5%':'下降 3.2%'));}
    return el;
  }
  LIVE.price=(host)=>{
    /* 第一段：價格 price（維持原樣不動） */
    mountLive(host,{gate:'price',
      initial:{variant:'discount',size:'md'},
      segs:[{key:'variant',label:'Variant',options:['normal','discount','sale','free'],labels:['一般','折扣','特價','免費']},
            {key:'size',label:'Size',options:['sm','md','lg'],labels:['s','m','l']}],
      render:st=>{const box=ce('div','pr-live-box');box.appendChild(prEl(st.variant,st.size));return box;},
      note:'價格 price：discount 用 &lt;s&gt; 包原價（螢幕報讀「原價 X、優惠價 Y」）；free 容器加 <code>aria-label=免費</code>。',
      free:()=>['normal','discount','sale','free'].map(v=>prEl(v,'md'))
    });
    /* 第二段：數值 metric（dashboard KPI），獨立控制列避免與價格軸互相干擾；標題／單位／趨勢皆可各自開關 */
    mountLive(host,{gate:'price',
      initial:{size:'md',trend:'up',showUnit:false,showTitle:false},
      segs:[{key:'size',label:'Size',options:['sm','md','lg'],labels:['s','m','l']},
            {key:'trend',label:'Trend 趨勢',options:['none','up','down'],labels:['無','上升','下降']}],
      bools:[{key:'showTitle',label:'標題 title'},{key:'showUnit',label:'單位 unit'}],
      boolLabel:'顯示欄位',
      render:st=>{const box=ce('div','pr-live-box');box.appendChild(prMetricEl(st.size,{trend:st.trend==='none'?null:st.trend,unit:st.showUnit,title:st.showTitle}));return box;},
      note:'數值 metric：基底大數字（<code>tabular-nums</code>）；<b>標題／單位／趨勢</b>可各自開關組合——趨勢選「無」即隱藏，上升綁 <code>--ok</code>、下降綁 <code>--i-danger</code>（icon 重用 IC_TRENDING）。',
      free:()=>[prMetricEl('md',{}),prMetricEl('md',{trend:'up'}),prMetricEl('md',{unit:true}),prMetricEl('md',{title:true}),prMetricEl('md',{title:true,unit:true,trend:'up'})]
    });
  };
  function buildPrice(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Number',title:'Number 數值',
      lede:'各種數字呈現,分 <b>兩大類</b>:<b>價格 price</b> 4 型態(<b>normal 一般</b>、<b>discount 折扣</b>、<b>sale 特價</b>、<b>free 免費</b>)與 <b>儀表數值 metric</b>(dashboard KPI)——基底大數字,另可各自開關 <b>標題 title</b>／<b>單位 unit</b>／<b>趨勢 trend</b> 任意組合。共用 <b>3 尺寸</b>。discount 用 <code>&lt;s&gt;</code> 包原價、free 容器綁 <code>aria-label</code>;metric 數字一律 <code>tabular-nums</code>,趨勢色走 <code>--ok</code>／<code>--i-danger</code>。',
      specRows:[['axes','<code>kind(price | metric) × variant × size</code>'],['formula','<code>(4 + 4) × 3 = 24</code>'],['token-policy','<code>semantic.text.* / semantic.feedback.* / --ok / --i-danger</code>'],['a11y','<code>&lt;s&gt; 原價 · aria-label · delta 報讀升降</code>']]});
    const VZ={normal:['一般','normal'],discount:['折扣','discount'],sale:['特價','sale'],free:['免費','free']};
    const SZN={sm:['小','sm'],md:['標準','md'],lg:['大','lg']};
    const axes=DIAL_SPECS.price.axes, zh=DIAL_SPECS.price.zh, active=CHOICE.price.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.size.filter(s=>active.size.has(s));
      p.appendChild(matrixPanel({badge:'variant × size',name:'Variant × Size（4 型態 × 3 尺寸）',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VZ[v][0],VZ[v][1]),
        colLab:s=>labHTML(SZN[s][0]+'尺寸',SZN[s][1]),
        cell:(v,s)=>prEl(v,s),mincol:170})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','列＝四種價格型態、欄＝三級尺寸；折扣顯示原價刪除線＋紅色優惠價，特價帶 SALE pill。');
    p=panelsIn(sec);renderM();
    const cs=section(body,'商品情境示意','把價格放進商品卡片式排版（純示意，未新建 card 元件），對照原價／優惠價／省多少的語意呈現。');
    const grid=ce('div','pr-scene');
    const cards=[
      {name:'無線藍牙耳機',variant:'discount',save:'省 NT$ 400'},
      {name:'機械鍵盤 87 鍵',variant:'sale',save:''},
      {name:'USB-C 充電線',variant:'normal',save:''},
      {name:'試用版下載',variant:'free',save:''}
    ];
    cards.forEach(c=>{
      const card=ce('div','pr-card');
      const th=ce('div','pr-thumb');
      const nm=ce('div','pr-name');nm.textContent=c.name;
      card.append(th,nm,prEl(c.variant,'md'));
      if(c.save){const sv=ce('div','pr-save');sv.textContent=c.save;card.appendChild(sv);}
      grid.appendChild(card);
    });
    cs.appendChild(grid);
    /* 數值 metric：dashboard KPI 靜態矩陣（不進 dial，避免動到既有 price 軸結構） */
    const ms=section(body,'數值 Metric 儀表數字','dashboard KPI 數字呈現：純數字／＋趨勢／＋單位／＋標題（下方各為單一欄位示意，實際可任意組合，見 Live）；尺寸沿用 sm／md／lg，數字一律 tabular-nums 對齊。趨勢格並列展示上升（--ok 正向綠）／下降（--i-danger）兩態。');
    const MZ={plain:['純數字','plain'],delta:['＋趨勢','trend'],unit:['＋單位','unit'],label:['＋標題','title']};
    const MFEAT={plain:{},unit:{unit:true},label:{title:true}}; // 各列對應的單一欄位開關
    const mp=panelsIn(ms);
    mp.appendChild(matrixPanel({badge:'metric × size',name:'Metric × Size（欄位示意 × 3 尺寸；實際可任意組合）',
      rows:['plain','delta','unit','label'],cols:['sm','md','lg'],
      rowLab:v=>labHTML(MZ[v][0],MZ[v][1]),
      colLab:s=>labHTML(SZN[s][0]+'尺寸',SZN[s][1]),
      cell:(v,s)=>{ if(v!=='delta')return prMetricEl(s,MFEAT[v]);
        const w=ce('div','pr-mstack');w.append(prMetricEl(s,{trend:'up'}),prMetricEl(s,{trend:'down'}));return w; },
      mincol:170}));
    const sl=section(body,'互動預覽與程式碼','上段切價格 variant／size、下段切數值 metric／trend／size，各自附 quick row 並排對照。');
    LIVE.price(sl);
  }

  /* ==================== image ==================== */
/* ---- IMAGE 圖片（imEl 提升頂層，頁面與 summary Live 共用）---- */
  const IM_BROKEN=PI('image-off');
  const IM_POOL=['photo-1506905925346-21bda4d32df4','photo-1470071459604-3b5ec3a7fe05','photo-1501785888041-af3ef285b470','photo-1426604966848-d7adac402bff','photo-1470770841072-f978cf4d019e','photo-1447752875215-b2761acb3c5d','photo-1472214103451-9374bd1c798e','photo-1433086966358-54859d0ed716']; // 已驗證 200 的 Unsplash 自然風景池（山湖／森林／瀑布／綠丘）
  const IM_CIRCLE='photo-1501785888041-af3ef285b470'; // circular 用構圖置中的風景（湖光山色）
  const IM_SIZE={s:40,m:64,l:120,xl:240}; // size → 高度（px）；寬度由 aspect-ratio 依比例算
  /* 組出固定方形的 Unsplash URL；一律帶 &h 強制正方，配 object-fit:cover 填滿 */
  /* 圖片池改用網站內嵌照片（預覽環境會擋 Unsplash 遠端圖）：IM_POOL／IM_CIRCLE 的 id 依序對應到內嵌照片，找不到才退回遠端 */
  function imEmbed(id){try{const E=[HX_TSM_BG,CARD_COVER,PSC_ROT[0],PSC_ROT[1],PSC_ROT[2],CARD_PHOTO];
    if(id===IM_CIRCLE)return CARD_PHOTO;const i=IM_POOL.indexOf(id);return i>=0?E[i%E.length]:null;}catch(e){return null;}}
  function imUrl(id,w){if(/^(data:|https?:|\.{0,2}\/|assets\/)/.test(id))return id;   /* assets/：站內圖檔（IMG-ASSET:v1 cdlAsset） */{const e=imEmbed(id);if(e)return e;}return `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;} // 不鎖比例，裁切交給盒子 aspect-ratio + object-fit:cover
  /* Image atom：variant=rectangular|rounded|circular；state=default|loading|error；size=s|m|l|xl
     opts={src:Unsplash 圖片 ID, alt:替代文字}。circular 為正方，rectangular/rounded 亦統一用正方最簡單 */
  function imEl(variant,state,size,opts){opts=opts||{};
    size=size||'m';
    const box=ce('div',`im-box im-${variant} im-sz-${size} im-st-${state}`);
    if(opts.ratio && variant!=='circular'){box.classList.add('im-r-'+opts.ratio.replace(':','x'));} // circular 恆正方，其餘依比例改盒子 aspect-ratio
    if(state==='loading'){
      box.classList.add('im-loading'); // 骨架佔位：--panel-2 底 + shimmer 掃過，不放真圖
    } else if(state==='error'){
      box.classList.add('im-error'); // 破圖 fallback：置中破圖 icon + 「載入失敗」小字
      const ic=ce('div','im-broken');ic.innerHTML=IM_BROKEN;
      const tx=ce('div','im-errtxt');tx.textContent='載入失敗';
      box.append(ic,tx);
    } else {
      const img=document.createElement('img');img.className='im-img';
      img.src=imUrl(opts.src||IM_POOL[0],600); // W 用 400，實際顯示尺寸由 CSS 控制
      img.alt=(opts.alt!=null)?opts.alt:''; // a11y：必填 alt；裝飾性傳 '' 即可
      img.loading='lazy';
      box.appendChild(img);
    }
    return box;
  }
  LIVE.image=(host)=>mountLive(host,{gate:'image',
    initial:{variant:'rounded',state:'default',size:'l',ratio:'4:3'},
    segs:[
      {key:'variant',label:'Shape',options:['rectangular','rounded','circular'],labels:['矩形','圓角','圓形']},
      {key:'state',label:'State',options:['default','loading','error'],labels:['正常','載入中','錯誤']},
      {key:'size',label:'Size',options:['s','m','l','xl']},
      {key:'ratio',label:'Ratio',options:['1:1','4:3','16:9','2:1']}
    ],
    render:st=>{
      const src=(st.variant==='circular')?IM_CIRCLE:IM_POOL[3]; // circular 用置中風景
      return imEl(st.variant,st.state,st.size,{src,alt:'示意圖片',ratio:st.ratio});
    },
    note:'切形狀時 circular 自動改用人像圖；state 切到 loading 看 shimmer 骨架、error 看破圖 fallback。'
  });
  function buildImage(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Image',title:'Image 圖片',
      lede:'承載照片／插圖的圖片容器，素材統一取自 Unsplash。<b>variant × state × size × ratio</b>：三種形狀（矩形／圓角／圓形）× 三種狀態（正常／載入中／錯誤）× 四級尺寸（s／m／l／xl）、四種長寬比（1:1／4:3／16:9／2:1）。載入中顯示 shimmer 骨架、載入失敗顯示破圖 fallback。<b>alt 為必填</b>，純裝飾性圖片則傳 <code>alt=""</code>。',
      specRows:[['axes','<code>variant × state × size × ratio</code>'],['ratio','<code>1:1 / 4:3 / 16:9 / 2:1</code>'],['token-policy','<code>surface.image / border.image / radius</code>'],['a11y','必填 alt；裝飾性 alt=""']]});
    const axes=DIAL_SPECS.image.axes, zh=DIAL_SPECS.image.zh, active=CHOICE.image.active; // 接中央 store
    const VN={rectangular:['矩形','rectangular'],rounded:['圓角','rounded'],circular:['圓形','circular']};
    const SN={default:['正常','default'],loading:['載入中','loading'],error:['錯誤','error']};
    const SRC={rectangular:IM_POOL[0],rounded:IM_POOL[1],circular:IM_CIRCLE}; // 每個形狀給不同示意圖
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.state.filter(s=>active.state.has(s));
      p.appendChild(matrixPanel({badge:'shape × state',name:'Shape × State 對照',desc:'列＝形狀、欄＝狀態（尺寸固定 m）',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(SN[s][0],SN[s][1]),
        cell:(v,s)=>imEl(v,s,'m',{src:SRC[v],alt:'示意圖'}),mincol:140}));
    }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Shape × State 矩陣','三種形狀 × 三種狀態，尺寸固定 m。default 顯示真圖、loading 顯示 shimmer 骨架、error 顯示破圖 fallback。');
    p=panelsIn(sec);renderM();
    const zs=section(body,'Size 尺寸軸','default 狀態、rounded 形狀、1:1 比例，對照 s／m／l／xl 四級高度（40／64／120／240 px）；寬度＝高度×比例。');
    const rd=ce('div','row-demo');rd.style.marginBottom='16px';
    [['s',40],['m',64],['l',120],['xl',240]].forEach(function(row){var sz=row[0],px=row[1];
      const it=ce('div','demo-item');it.appendChild(imEl('rounded','default',sz,{src:IM_POOL[3],alt:'示意圖'}));
      const c=ce('div','cap');c.innerHTML=`<b>size ${sz}</b><br>${px}×${px}`;it.appendChild(c);rd.appendChild(it);});
    zs.appendChild(rd);
    const rs=section(body,'Ratio 長寬比','同一張風景照、固定高度（size l＝120px），寬度依比例伸縮，對照 1:1／4:3／16:9／2:1（object-fit:cover 自動裁切；circular 不受比例影響、恆正方）。');
    const rrow=ce('div','row-demo');rrow.style.marginBottom='16px';rrow.style.alignItems='flex-start';
    [['1:1','正方'],['4:3','標準'],['16:9','寬螢幕'],['2:1','橫幅']].forEach(function(row){var r=row[0],zhr=row[1];
      const it=ce('div','demo-item');const el=imEl('rounded','default','l',{src:IM_POOL[0],alt:'示意圖',ratio:r});it.appendChild(el);
      const c=ce('div','cap');c.innerHTML='<b>'+r+'</b><br>'+zhr;it.appendChild(c);rrow.appendChild(it);});
    rs.appendChild(rrow);
    const sl=section(body,'互動預覽與程式碼','切形狀／狀態／尺寸即時預覽；circular 自動改用人像圖，切到 loading／error 看佔位與 fallback。');
    LIVE.image(sl);
  }


/* header icons */
/* ---- HEADER 頁首 icon 池（namespaced；PulsoIcon 、24 viewBox）---- */
  const HDR_IC_BELL=PI('bell');
  const HDR_IC_LIST=PI('menu');

/* header build */
/* ==================== header 頁首 ==================== */
  const HDR_LOGO='<svg viewBox="0 0 90 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CDL"><g stroke="currentColor" stroke-width="6"><path d="M25.96 21.64A13 13 0 1 0 25.96 38.36"/><circle cx="48" cy="30" r="13"/><path d="M61 2V46"/><path d="M75 2V46"/></g><rect x="82" y="40" width="6" height="6" fill="var(--accent2)"/></svg>';  /* CDL 字標（小寫 cdl＋強調方塊，方塊綁 --accent2）*/
  /* logo：複用檔內既有 CDL 字標 svg */
  function hdrLogo(){const l=ce('div','hdr-logo');l.innerHTML=(function(){var _l=activeLogo();return _l?('<img src="'+_l+'" alt="Logo">'):HDR_LOGO;})();l.setAttribute('aria-label','CDL');return l;}
  /* 導覽：複用 Menu 元件 mnBar（水平），維持原子建構 */
  function hdrNav(){const slot=ce('div','hdr-nav-slot');
    slot.appendChild(mnBar('horizontal','m',{items:['首頁','產品','定價','關於'],activeIndex:0,clickable:true}));
    return slot;}
  /* 搜尋框：複用 Search／Input 元件（.field v-outline + ICON_SEARCH + .bare）*/
  function hdrSearch(){
    const w=ce('div','hdr-search');
    const f=ce('div','field v-outline');
    f.innerHTML=`<span style="display:inline-flex;width:17px;height:17px;color:var(--muted)">${ICON_SEARCH}</span>`;
    const inp=document.createElement('input');inp.className='bare';inp.placeholder='搜尋產品、文件…';
    f.appendChild(inp);w.appendChild(f);return w;}
  /* 漢堡鈕：複用 Button 元件（無底色無外框 icon btn＝v-text icon-only；.live 才吃真實 hover）*/
  function hdrBurger(){const b=document.createElement('button');b.className='btn v-text i-secondary sz-s icon-only live';
    b.setAttribute('aria-label','選單');b.innerHTML=HDR_IC_LIST;return b;}
  /* 鈴鐺鈕：複用 Button 元件（v-text icon-only live）+ 未讀紅點 */
  function hdrBell(badge){const wrap=ce('div','hdr-bell');
    const b=document.createElement('button');b.className='btn v-text i-secondary sz-s icon-only live';
    b.setAttribute('aria-label','通知');b.innerHTML=HDR_IC_BELL;wrap.appendChild(b);
    if(badge)wrap.appendChild(ce('span','hdr-badge'));return wrap;}
  /* 圓形頭像 */
  function hdrAvatar(){const b=document.createElement('button');b.type='button';b.className='hdr-avatar';b.setAttribute('aria-label','帳號選單'); // 2026-11-03：改取用 Avatar 原子
    b.appendChild(avtEl('s','circle','initials',{initials:'楊',name:'楊鎮瑜'}));return b;}
  /* 右側 actions：鈴鐺 → 頭像 → 登入（登入鈕在頭像右側）*/
  function hdrActions(o){o=o||{};
    const a=ce('div','hdr-actions');
    if(o.bell!==false)a.appendChild(hdrBell(o.badge!==false));
    if(o.avatar!==false)a.appendChild(hdrAvatar());
    if(o.login!==false){const b=document.createElement('button');b.className='btn v-solid i-primary sz-s live';b.textContent='登入';a.appendChild(b);}
    return a;}
  /* 完整頁首 bar：device 決定電腦／行動版；nav 與 search 可同時存在 */
  function hdrBar(device,o){o=o||{};
    const bar=ce('div','hdr-bar');
    if(device==='mobile'){
      if(o.nav!==false)bar.appendChild(hdrBurger());       // 行動版導覽收進漢堡
      bar.appendChild(hdrLogo());
      bar.appendChild(ce('div','hdr-spacer'));
      bar.appendChild(hdrActions({bell:o.bell,avatar:o.avatar,login:o.login,badge:o.badge}));
      const frame=ce('div','hdr-phone');frame.appendChild(bar);return frame; // 行動版以 375px 手機框示意
    }
    bar.appendChild(hdrLogo());
    if(o.nav!==false)bar.appendChild(hdrNav());
    bar.appendChild(ce('div','hdr-spacer'));
    if(o.search)bar.appendChild(hdrSearch());               // 搜尋與導覽並存
    bar.appendChild(hdrActions({bell:o.bell,avatar:o.avatar,login:o.login,badge:o.badge}));
    return bar;
  }

  function buildHeader(view){
    const body=viewScaffold(view,{
      eyebrow:'L3 Component · Header',
      title:'Header 頁首',
      lede:'應用／網站最上緣的<b>全域導覽列</b>：左側 CDL 品牌字標、<b>導覽（Menu 元件）與搜尋框（Search 元件）可同時並存</b>、右側依序為通知鈴鐺、帳號頭像與登入鈕。以 <b>裝置（電腦版／行動版）</b> 為軸，行動版導覽收進漢堡鈕。內部 btn／icon btn／menu／search 全部取自本 library、維持原子建構。',
      specRows:[['axes','<code>device</code>'],['variants','<code>desktop · mobile</code>'],['atoms','Button · Icon Button · Menu · Search'],['content','logo / nav + search / actions']]
    });
    const axes=DIAL_SPECS.header.axes, zh=DIAL_SPECS.header.zh, active=CHOICE.header.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const devs=axes.device.filter(v=>active.device.has(v));
      const stack=ce('div','hdr-stack');
      devs.forEach(dv=>{
        const row=ce('div','hdr-row');
        const cap=ce('div','hdr-cap');cap.innerHTML=`<b>${zh.device[dv]}</b>　<span style="opacity:.65">${dv}</span>`;
        row.appendChild(cap);
        row.appendChild(hdrBar(dv,{nav:true,search:true,bell:true,avatar:true,login:true,badge:true}));
        stack.appendChild(row);
      });
      p.appendChild(stack);
    }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Device 陳列','整條頁首 bar 上下堆疊呈現（不擠壓）。每條同時含導覽（Menu）與搜尋（Search）；行動版導覽收進漢堡鈕。');
    const holder=ce('div');sec.appendChild(holder);p=holder;renderM();

    // 互動預覽與程式碼
    const sl=section(body,'互動預覽與程式碼','切換<b>電腦版／行動版</b>，勾選各內容元素即時預覽；導覽與搜尋可同時勾選並存。按鈕／圖示鈕滑過即見 hover。');
    mountLive(sl,{
      initial:{device:'desktop',nav:true,search:true,bell:true,avatar:true,login:true},
      segs:[{key:'device',label:'Device',options:['desktop','mobile'],labels:['電腦版','行動版']}],
      bools:[{key:'nav',label:'nav 導覽'},{key:'search',label:'search 搜尋'},{key:'bell',label:'bell 鈴鐺'},{key:'avatar',label:'avatar 頭像'},{key:'login',label:'login 登入鈕'}],
      boolLabel:'Content',
      render:st=>{const box=ce('div','hdr-live-box');
        box.appendChild(hdrBar(st.device,{nav:st.nav,search:st.search,bell:st.bell,avatar:st.avatar,login:st.login,badge:st.bell}));return box;},
      note:'<b>導覽與搜尋可同時並存</b>；行動版（mobile）導覽收進漢堡鈕。內部按鈕／圖示鈕／選單／搜尋框皆為本 library 元件實例（皆掛 .live 吃真實 hover）。'
    });
  }

/* footer icons */
/* ---- FOOTER 頁尾：社群 / 全域 icon 池（PulsoIcon 24 viewBox）---- */
  const FTR_IC_TWITTER=PI('brand-twitter');
  const FTR_IC_GITHUB=PI('brand-github');
  const FTR_IC_LINKEDIN=PI('brand-linkedin');
  const FTR_IC_INSTAGRAM=PI('brand-instagram');
  const FTR_IC_GMAIL=PI('brand-gmail');
  const FTR_IC_GLOBE=PI('globe');
  /* 品牌 logo mark：PulsoIcon cube-focus 風格線稿 */
  const FTR_IC_LOGO=PI('box');
  const IC_PHONE=PI('phone'); // 聯絡資訊 / 社群溝通用

/* footer build */
/* ==================== footer 頁尾 ==================== */
  /* ---- FOOTER 頁尾（builders 提升頂層，頁面與 Live 共用同一組零件）---- */

  /* 連結欄群資料 */
  const FTR_COLS=[
    {title:'產品 Product',links:['元件庫','設計 Token','頁面模板','更新日誌']},
    {title:'公司 Company',links:['關於我們','人才招募','設計部落格','聯絡我們']},
    {title:'法務 Legal',links:['服務條款','隱私政策','Cookie 設定']},
  ];
  /* 外連入口（2026-11-10）：Twitter／Instagram 拿掉，改 Gmail；每顆都是真的連結，另開分頁（mailto 不另開） */
  const FTR_SOCIALS=[['Gmail',FTR_IC_GMAIL,'mailto:edward890131@gmail.com'],['GitHub',FTR_IC_GITHUB,'https://github.com/edward890131/cool-ds-library'],['LinkedIn',FTR_IC_LINKEDIN,'https://www.linkedin.com/in/chenyu-yang-023886201']];

  /* 品牌 logo：複用 header 的 CDL 字標 svg */
  function ftrLogo(){const w=ce('div','ftr-logo');w.innerHTML=(function(){var _l=activeLogo();return _l?('<img src="'+_l+'" alt="Logo">'):HDR_LOGO;})();w.setAttribute('aria-label','CDL · Cool Design Library');return w;}
  /* 聯絡資訊：地址／信箱／電話（重用 library icon）*/
  function ftrContact(){
    const c=ce('div','ftr-contact');
    [[IC_LOCATION,'台北市信義區設計路 100 號 8 樓'],[IC_MAIL,'hello@goonsdesign.co'],[IC_PHONE,'+886 2 2345 6789']].forEach(([ic,txt])=>{
      const r=ce('div','ftr-contact-row');
      const i=ce('span','ftr-contact-ic');i.innerHTML=ic;
      const t=document.createElement('span');t.textContent=txt;
      r.append(i,t);c.appendChild(r);
    });
    return c;
  }
  /* 品牌區：logo + 簡介 + 聯絡 */
  function ftrBrand(){
    const b=ce('div','ftr-brand');
    b.appendChild(ftrLogo());
    b.appendChild(ftrContact());
    return b;
  }
  /* 單一連結欄 */
  function ftrLinkCol(col){
    const c=ce('div','ftr-col');
    const t=ce('div','ftr-coltitle');t.textContent=col.title;
    const ls=ce('div','ftr-links');
    col.links.forEach(lb=>{const a=ce('a','ftr-link');a.textContent=lb;ls.appendChild(a);});
    c.append(t,ls);return c;
  }
  /* 社群 icon 列：複用 library Button（v-text icon-only）*/
  function ftrSocial(){
    const w=ce('div','ftr-social');
    FTR_SOCIALS.forEach(([name,ic,href])=>{
      const b=document.createElement('a');b.className='btn v-text i-secondary sz-s icon-only live';b.href=href;
      if(!href.startsWith('mailto:')){b.target='_blank';b.rel='noopener noreferrer';}
      b.setAttribute('aria-label',name);b.title=name;b.innerHTML=ic;
      w.appendChild(b);
    });
    return w;
  }
  /* 回到頂部：複用 library Button（v-outline）+ 上箭頭；行動版只留箭頭（icon-only），跟社群／語言同一列 */
  function ftrBackTop(mobile){
    const b=document.createElement('button');b.type='button';b.className='btn v-outline i-secondary sz-s live'+(mobile?' icon-only ftr-top-ic':'');
    const ic=ce('span','ftr-uparrow');ic.innerHTML=mobile?PI('arrow-up'):ICON_CARET;
    b.appendChild(ic);if(!mobile)b.appendChild(document.createTextNode('回到頂部'));
    b.setAttribute('aria-label','回到頂部');if(mobile)b.title='回到頂部';
    b.onclick=()=>{const sc=b.closest('.tws-scroll,.ftr-phone,.main')||document.scrollingElement;sc.scrollTo({top:0,behavior:HX_REDUCE&&HX_REDUCE()?'auto':'smooth'});};
    return b;
  }
  /* 語言選擇 pill */
  function ftrLang(){
    const b=document.createElement('button');b.className='btn v-outline i-secondary sz-s live';
    b.innerHTML=`${FTR_IC_GLOBE}<span>繁體中文</span>${ICON_CARET}`;
    b.setAttribute('aria-label','切換語言');return b;
  }
  /* 內嵌連結列（simple / minimal）*/
  function ftrNav(cls,labels){
    const w=ce('div',cls);
    labels.forEach(lb=>{const a=ce('a','ftr-link');a.textContent=lb;w.appendChild(a);});
    return w;
  }
  /* 底列：分隔線撐滿寬 + 版權左、按鈕右（社群／語言／回到頂部）*/
  function ftrBottom(o){
    o=o||{};
    const b=ce('div','ftr-bottom');
    const c=ce('div','ftr-copy');c.textContent='© 2026 果思設計 Goons Design. 版權所有。';
    b.appendChild(c);
    b.appendChild(ce('div','ftr-botspacer'));
    const acts=ce('div','ftr-actions');
    if(o.social)acts.appendChild(ftrSocial());
    if(o.language)acts.appendChild(ftrLang());
    if(o.backTop)acts.appendChild(ftrBackTop(o.mobile));
    if(acts.children.length)b.appendChild(acts);
    return b;
  }

  /* 整條頁尾 */
  function ftrFooter(variant,o){
    o=o||{};
    const mobile=o.device==='mobile';
    const foot=ce('footer','ftr-foot ftr-v-'+variant+(mobile?' ftr-mobile':''));
    if(variant==='rich'){
      const main=ce('div','ftr-main');
      main.appendChild(ftrBrand());
      const cols=ce('div','ftr-cols');
      FTR_COLS.forEach(col=>cols.appendChild(ftrLinkCol(col)));
      main.appendChild(cols);
      foot.appendChild(main);
      foot.appendChild(ftrBottom({social:o.social,language:o.language,backTop:o.backTop,mobile}));
    }else if(variant==='simple'){
      const row=ce('div','ftr-simplerow');
      row.appendChild(ftrLogo());
      row.appendChild(ftrNav('ftr-nav',['產品','資源','定價','關於','聯絡我們']));
      foot.appendChild(row);
      foot.appendChild(ftrBottom({social:o.social,language:o.language,backTop:o.backTop,mobile}));
    }else{ // minimal
      const row=ce('div','ftr-minirow');
      const c=ce('div','ftr-copy');c.textContent='© 2026 果思設計 Goons Design.';
      row.appendChild(c);
      row.appendChild(ftrNav('ftr-mininav',['服務條款','隱私政策','聯絡我們']));
      const acts=ce('div','ftr-actions');
      if(o.social)acts.appendChild(ftrSocial());
      if(o.language)acts.appendChild(ftrLang());
      if(o.backTop)acts.appendChild(ftrBackTop(mobile));
      if(acts.children.length){row.appendChild(ce('div','ftr-botspacer'));row.appendChild(acts);}
      foot.appendChild(row);
    }
    if(mobile){const frame=ce('div','ftr-phone');frame.appendChild(foot);return frame;}
    return foot;
  }

  function buildFooter(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Footer',title:'Footer 頁尾',
      lede:'網站／應用最底部的<b>整條寬版</b>導航與資訊區塊：<b>rich 多欄</b>含品牌 logo、地址／信箱／電話聯絡資訊、連結欄群（靠右對齊）與底部版權；<b>simple 單列</b>把 logo 與連結左右撐滿；<b>minimal 極簡</b>只留一行版權與少數連結。底列分隔線撐滿寬度、版權（左）與按鈕（右）左右對齊。因頁尾為整條寬版，另含 <b>device（電腦版／行動版）</b> 軸——行動版收進限寬手機框、內容改單欄堆疊。這裡以「每個勾選的 variant × device 一段完整頁尾」呈現，不走矩陣。',
      specRows:[['axes','<code>variant × device</code>'],['formula','<code>(rich · simple · minimal) × (電腦 · 行動)</code>'],['atoms','Button · Icon Button · Search'],['features','social / language / back-to-top']]});
    const axes=DIAL_SPECS.footer.axes, zh=DIAL_SPECS.footer.zh, active=CHOICE.footer.active;
    const VSUB={
      rich:'左品牌（logo＋地址／信箱／電話）＋ 右側連結欄群（產品／資源／公司／法務，靠右對齊）；底列一條撐滿寬度的分隔線接版權（左）與社群／語言／回到頂部按鈕（右）。',
      simple:'單一橫列：左 logo、右連結列（左右撐滿）；下方分隔線＋版權與按鈕列。',
      minimal:'一行搞定：© 版權 + 幾個必要連結（＋選配社群／語言／回到頂部）。'
    };
    let holder;
    function renderM(){ if(!holder)return; holder.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ds=axes.device.filter(d=>active.device.has(d));
      vs.forEach(v=>ds.forEach(d=>{
        const label=zh.variant[v]+'　·　'+v+(d==='mobile'?'　·　行動版 mobile':'　·　電腦版 desktop');
        const sec=section(holder,label,VSUB[v]);
        sec.appendChild(ftrFooter(v,{social:true,language:true,backTop:true,device:d}));
      }));
    }
    mountDial(body,{axes,zh,active,onRender:renderM});
    holder=ce('div','ftr-holder');body.appendChild(holder);renderM();

    const sl=section(body,'互動預覽與程式碼','切 variant（多欄／單列／極簡）與 device（電腦版／行動版），勾選社群 icon、語言與回到頂部按鈕，下面即時預覽整條頁尾。');
    mountLive(sl,{
      initial:{variant:'rich',device:'desktop',social:true,language:true,backTop:true},
      segs:[{key:'variant',label:'Variant',options:['rich','simple','minimal'],labels:['多欄 rich','單列 simple','極簡 minimal']},
            {key:'device',label:'Device',options:['desktop','mobile'],labels:['電腦版','行動版']}],
      bools:[{key:'social',label:'social 社群'},{key:'language',label:'language 語言'},{key:'backTop',label:'back-to-top 回到頂部'}],
      boolLabel:'Content',
      render:st=>ftrFooter(st.variant,{social:st.social,language:st.language,backTop:st.backTop,device:st.device}),
      note:'<b>社群 icon 與回到頂部皆為 library Button 元件實例</b>；社群 icon 已收進 Icon Library「品牌社群」分類。內部無自製按鈕。'
    });
  }

/* section-head icons */
/* section-head 未新增自訂 icon：右側動作重用既有 ICON_ARROW */

/* section-head build */
