  /* ===== Card group build: card ===== */
  /* ==================== Card 基礎卡片（crd-）==================== */
  /* 泛用內容容器卡：media（imEl 圖）＋ badge（.tg 標籤）＋ title ＋ desc ＋ footer actions（.btn）。
     variant：elevated 浮起／outlined 外框／filled 填色 × state：default／hover／selected／disabled。
     全部重用既有原子：imEl（Image）、.tg（Tag）、.btn（Button），不 inline 重畫 primitive。 */

  /* 卡片工廠：o={variant, state, media, badge, title, desc, actions, live, compact, src}
     state 用靜態 class 模擬（矩陣用）；live=true 時掛 .live 走真實 :hover、disabled 同步鎖內部按鈕 */
  function crdCard(o){
    o=o||{};
    const variant=o.variant||'elevated';
    const state=o.state||'default';
    const card=ce('div','crd crd-v-'+variant
      +(state!=='default'?' is-'+state:'')
      +(o.live?' live':'')
      +(o.compact?' crd-mx':'')
      +(o.size==='s'?' crd-sz-s':''));

    /* media slot：重用 Image 原子（16:9 滿版），CSS 覆寫為卡片滿寬 */
    if(o.media){
      const md=ce('div','crd-media');
      md.appendChild(imEl('rectangular','default','l',{src:o.src||IM_POOL[5],alt:o.title||'卡片圖片',ratio:'16:9'}));
      card.appendChild(md);
    }
    /* badge slot：重用 Tag 原子，釘右上角（有圖壓圖上、無圖壓卡上） */
    if(o.badge){
      const bd=ce('div','crd-badge');
      const onImg=!!o.media; // 壓在照片上用半透明黑玻璃、無圖時用一般柔色標
      const t=ce('div','tg c-round st-default '+(onImg?'v-soft i-neutral tg-glass':'v-soft i-brand'));t.innerHTML='<span>精選</span>';
      bd.appendChild(t);
      (onImg?card.firstChild:card).appendChild(bd);
    }
    /* body slot：title 恆有、desc 可選（CSS 兩行截斷） */
    const body=ce('div','crd-body');
    const ti=ce('div','crd-title');ti.textContent=o.title||'合歡山日出季開跑';
    body.appendChild(ti);
    if(o.desc){
      const de=ce('div','crd-desc');
      de.textContent=(typeof o.desc==='string')?o.desc:'十月至二月為最佳觀賞期，凌晨出發上武嶺停車場，建議提前一週預約松雪樓住宿並攜帶保暖衣物。';
      body.appendChild(de);
    }
    card.appendChild(body);
    /* footer actions slot：重用 Button 原子（主 solid primary＋次 text secondary） */
    if(o.actions){
      const ft=ce('div','crd-foot');
      const bp=ce('button','btn v-solid i-primary sz-s'+(o.live?' live':''));bp.innerHTML='<span>查看詳情</span>';
      const bs=ce('button','btn v-text i-secondary sz-s'+(o.live?' live':''));bs.innerHTML='<span>稍後</span>';
      if(state==='disabled'){bp.disabled=true;bs.disabled=true;} // disabled 整卡不可點，按鈕同步鎖
      ft.append(bs,bp); // 次要在左、主 CTA 靠最右
      card.appendChild(ft);
    }
    return card;
  }

  /* 矩陣格：一張緊湊代表卡（media＋title＋desc＋actions 全開，看得到完整解剖），state 靜態模擬 */
  function crdCell(variant,state,size){
    return crdCard({variant,state,size,media:true,badge:false,title:'合歡山日出季',desc:'凌晨出發武嶺，建議預約松雪樓並備保暖衣物。',actions:true,compact:true,src:IM_POOL[(({elevated:0,outlined:1,filled:2})[variant]||0)+3]});
  }

  function buildCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Card',title:'Card 基礎卡片',
      lede:'泛用的<b>內容容器卡</b>：媒體圖＋標題＋兩行描述＋頁尾動作，是商品卡、文章卡等所有內容卡的基底。<b>variant × state</b>：三種容器型態（<b>elevated 浮起</b>陰影／<b>outlined 外框</b>細邊／<b>filled 填色</b>灰底）× 四種狀態（預設／滑過／選取／停用）。slots 可自由組合；內部全數重用既有原子——媒體圖用 <b>Image</b>（16:9）、右上角標用 <b>Tag</b>、動作鈕用 <b>Button</b>。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>3 × 4 = 12</code>'],['token-policy','<code>semantic.*.card.*</code>'],['slots','<code>media / badge / title / desc / actions</code>']]});
    const axes=DIAL_SPECS.card.axes, zh=DIAL_SPECS.card.zh, active=CHOICE.card.active; // 接中央 store
    const VN={elevated:['浮起','elevated'],outlined:['外框','outlined'],filled:['填色','filled']};
    const STN={default:['預設','default'],hover:['滑過','hover'],selected:['選取','selected'],disabled:['停用','disabled']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.state.filter(s=>active.state.has(s));
      const sz=axes.size.filter(z=>active.size.has(z))[0]||'m';
      p.appendChild(matrixPanel({badge:'card',name:'Variant × State',desc:'列＝容器型態、欄＝狀態；每格為一張完整代表卡（媒體圖＋標題＋描述＋動作）',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(STN[s][0],STN[s][1]),
        cell:(v,s)=>crdCell(v,s,sz),mincol:220}));
    }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × State 矩陣','hover＝依型態各自加深（陰影變深／邊框轉強／底色再深一階）；selected＝accent 邊框＋主色淡底；disabled＝整卡淡化不可點。矩陣為靜態模擬，真實 hover 請到下方 showcase／Live 試。');
    p=panelsIn(sec);renderM();

    /* showcase：三種 variant 各一張完整範例卡並排（真實 hover） */
    const ss=section(body,'三型態完整範例','media＋badge＋title＋desc＋actions 全開的完整卡，三種容器型態並排對照；滑鼠移上去看各自的真實 hover 反應。');
    const shell=ce('div','row-demo');
    const row=ce('div','crd-show');
    [['elevated 浮起','以陰影抬離背景',0],['outlined 外框','1px 細邊、無陰影',1],['filled 填色','panel-2 灰底、無框',2]].forEach(([cap,sub,i])=>{
      const it=ce('div','demo-item');
      it.appendChild(crdCard({variant:axes.variant[i],state:'default',media:true,badge:true,title:'合歡山日出季開跑',desc:true,actions:true,live:true,src:IM_POOL[i]}));
      const c=ce('div','cap');c.innerHTML=`<b>${cap}</b> ${sub}`;it.appendChild(c);
      row.appendChild(it);
    });
    shell.appendChild(row);ss.appendChild(shell);

    /* Live：seg 切 variant；bools 開關各 slot＋disabled，每個勾選都對應可見變化 */
    const sl=section(body,'互動預覽與程式碼','切換容器型態，勾選開關各個 slot（媒體圖／角標／描述／動作鈕）與停用；整卡支援真實 hover——移上去看陰影／邊框／底色加深。');
    mountLive(sl,{
      initial:{variant:'elevated',size:'m',media:true,badge:true,description:true,actions:true,disabled:false},
      segs:[{key:'variant',label:'Variant',options:['elevated','outlined','filled'],labels:['浮起','外框','填色']},{key:'size',label:'Size',options:['s','m']}],
      bools:[{key:'media',label:'media 媒體圖'},{key:'badge',label:'badge 角標'},{key:'description',label:'description 描述'},{key:'actions',label:'footer actions'},{key:'disabled',label:'disabled'}],
      boolLabel:'Slots',
      render:st=>{
        const stage=ce('div','crd-live-stage');
        stage.appendChild(crdCard({
          variant:st.variant,
          state:st.disabled?'disabled':'default', // 比照其他頁：disabled 勾選項對映 state
          media:st.media,badge:st.badge,
          title:'合歡山日出季開跑',
          desc:st.description,actions:st.actions,size:st.size,live:true
        }));
        return stage;
      },
      note:'badge 在有媒體圖時壓在圖右上角、拿掉媒體圖後改釘卡片右上角；disabled 時整卡淡化、內部按鈕同步鎖定、hover 不再反應。'
    });
  }

  /* ===== Card group build: product-card ===== */
/* ==================== Product Card 商品卡（pcd-）==================== */
/* 重用原子：imEl（縮圖）、.tg（角標／售完標）、prEl（價格）、.btn（加入購物車／收藏）、IC_HEART／IC_STAR／IC_CART（既有 icon）
   新增 icon const：PCD_IC_STAR_FILL（實心星，評分用）、PCD_IC_HEART_FILL（實心愛心，已收藏狀態用）——PulsoIcon 實心版（solid），與既有線框版不同名 */
const PCD_IC_STAR_FILL=PI('star',{solid:1});
const PCD_IC_HEART_FILL=PI('heart',{solid:1});
/* 真實商品照（已驗證 200）：托特包／羊毛圍巾／保溫瓶 */
const PCD_IMG={bag:'photo-1544816155-12df9643f363',scarf:'photo-1601924994987-69e26d50dc26',bottle:'photo-1602143407151-7111542de6e8'};

/* 評分星列：實星（PCD_IC_STAR_FILL・warn 黃）+ 空星（IC_STAR regular・faint），後綴分數與評論數 */
function pcdStars(val,count){
  const full=Math.floor(val);                                   // 4.5 → 4 顆實星 + 1 顆空星
  const box=ce('span','pcd-rating');
  const stars=ce('span','pcd-stars');
  for(let i=0;i<5;i++){
    const s=ce('span',i<full?'pcd-star-full':'pcd-star-empty');
    s.innerHTML=i<full?PCD_IC_STAR_FILL:IC_STAR;
    stars.appendChild(s);
  }
  box.appendChild(stars);
  box.insertAdjacentHTML('beforeend',`<span class="pcd-rate-val">${val}</span><span class="pcd-rate-cnt">(${count})</span>`);
  box.setAttribute('aria-label',`評分 ${val} 分，共 ${count} 則評論`);
  return box;
}

/* 商品卡本體：variant=vertical|horizontal|minimal；state=default|hover|soldout
   o={live, badge, badgeText, badgeIntent, rating, wishlist, wished, discount, price, name, src, onWish} */
function pcdCard(variant,state,o){
  o=o||{};
  const soldout=state==='soldout';
  const card=ce('div','pcd-card pcd-v-'+variant
    +(state==='hover'?' is-hover':'')                            // 矩陣格用靜態 class 模擬 hover
    +(soldout?' is-soldout':'')
    +(o.live?' live':'')                                       // Live/showcase 才吃真實 :hover
    +(o.size==='s'?' pcd-sz-s':''));

  /* 收藏愛心：.btn v-text icon-only 原子；已收藏換 fill 版 + is-on 轉紅 */
  function mkWish(){
    const w=ce('button','btn v-text i-secondary sz-s icon-only pcd-wish'+(o.live?' live':'')+(o.wished?' is-on':''));
    w.innerHTML=o.wished?PCD_IC_HEART_FILL:IC_HEART;
    w.setAttribute('aria-label',o.wished?'移除收藏':'加入收藏');
    w.setAttribute('aria-pressed',o.wished?'true':'false');
    if(soldout)w.disabled=true;
    if(o.onWish&&!soldout)w.onclick=o.onWish;
    return w;
  }
  /* 角標：.tg 原子（新品=i-brand／熱門=i-danger） */
  function mkBadge(inline){ // inline=true（精簡版無圖）：不絕對定位、不玻璃，正常排進 toprow
    const t=ce('div','tg v-soft c-round i-'+(o.badgeIntent||'brand')+' st-default'+(inline?'':' pcd-badge tg-glass'));
    t.innerHTML='<span>'+(o.badgeText||'新品')+'</span>';
    return t;
  }

  /* 縮圖區（minimal 無圖）：imEl 原子 1:1，角標左上、收藏右上，售完加灰階覆蓋標 */
  if(variant!=='minimal'){
    const th=ce('div','pcd-thumb');
    th.appendChild(imEl('rectangular','default','l',{ratio:'1:1',alt:o.name||'商品圖',src:o.src||PCD_IMG.bag}));
    if(o.badge!==false)th.appendChild(mkBadge());
    if(o.wishlist!==false)th.appendChild(mkWish());
    if(soldout){
      const ov=ce('div','pcd-soldout-ov');
      const t=ce('div','tg v-solid c-round i-neutral st-default');t.innerHTML='<span>售完</span>';
      ov.appendChild(t);th.appendChild(ov);
    }
    card.appendChild(th);
  }

  /* 資訊區：品名 + 評分星列 + 價格(prEl) + 加入購物車(.btn) */
  const info=ce('div','pcd-info');
  if(variant==='minimal'&&(o.badge!==false||o.wishlist!==false||soldout)){
    const top=ce('div','pcd-toprow');                            // minimal 無圖：角標／售完標與收藏改放同一列
    const lf=ce('span','');
    if(soldout){const t=ce('div','tg v-solid c-round i-neutral st-default');t.innerHTML='<span>售完</span>';lf.appendChild(t);}
    else if(o.badge!==false)lf.appendChild(mkBadge(true));
    top.appendChild(lf);
    if(o.wishlist!==false)top.appendChild(mkWish());
    info.appendChild(top);
  }
  const nm=ce('div','pcd-name');nm.textContent=o.name||'經典帆布托特包・大容量通勤款';
  info.appendChild(nm);
  if(o.rating!==false)info.appendChild(pcdStars(o.rating||4.5,o.count||128));

  const buy=ce('div','pcd-buy');
  buy.appendChild(prEl(o.price||(o.discount?'discount':'normal'),'md'));   // 價格原子：normal／discount／sale
  const b=ce('button','btn v-solid i-primary sz-s'+(o.live?' live':''));
  b.innerHTML=IC_CART+'<span>'+(soldout?'已售完':'加入購物車')+'</span>';
  if(soldout)b.disabled=true;
  buy.appendChild(b);
  info.appendChild(buy);
  card.appendChild(info);
  return card;
}

/* 矩陣格：靜態呈現（hover 用 is-hover 模擬、售完灰階＋覆蓋標＋按鈕停用） */
function pcdCell(variant,state,size){
  return pcdCard(variant,state,{src:PCD_IMG.bag,size});
}

function buildProductCard(view){
  const body=viewScaffold(view,{eyebrow:'L3 Component · Product Card',title:'Product Card 商品卡',
    lede:'電商<b>商品卡</b>：縮圖＋角標＋品名＋評分星列＋價格＋加入購物車。三種 variant（<b>直式</b> 圖上資訊下／<b>橫式</b> 圖左資訊右／<b>精簡</b> 無圖純資訊）× 三狀態（預設／<b>hover 浮起</b>／<b>售完</b> 灰階＋覆蓋標＋按鈕停用）。內部全數重用原子：image（imEl 1:1）、tag（角標／售完標）、price（prEl normal/discount）、button（加入購物車＋收藏愛心）。',
    specRows:[['axes','<code>variant × state</code>'],['formula','<code>3 × 3 = 9</code>'],
      ['atoms','<code>imEl · .tg · prEl · .btn · icon</code>'],['token-policy','<code>semantic.*.card.*</code>'],
      ['slots','thumb / badge / wishlist / name / rating / price / action']]});
  const axes=DIAL_SPECS['product-card'].axes, zh=DIAL_SPECS['product-card'].zh, active=CHOICE['product-card'].active; // 接中央 store
  const VN={vertical:['直式','vertical'],horizontal:['橫式','horizontal'],minimal:['精簡','minimal']};
  const STN={default:['預設','default'],hover:['滑過','hover'],soldout:['售完','soldout']};
  let p;
  function renderM(){ if(!p)return; p.innerHTML='';
    const vs=axes.variant.filter(v=>active.variant.has(v));
    const ss=axes.state.filter(s=>active.state.has(s));
    const psz=axes.size.filter(z=>active.size.has(z))[0]||'m';
    p.appendChild(matrixPanel({badge:'product-card',name:'Variant × State（hover 為靜態模擬；售完＝灰階＋覆蓋標＋按鈕停用）',
      rows:vs,cols:ss,
      rowLab:v=>labHTML(VN[v][0],VN[v][1]),
      colLab:s=>labHTML(STN[s][0],STN[s][1]),
      cell:(v,s)=>pcdCell(v,s,psz),mincol:250})); }
  mountDial(body,{axes,zh,active,onRender:renderM});
  const sec=section(body,'Variant × State 矩陣','列＝三型態（直式／橫式／精簡）、欄＝三狀態；hover 格以靜態 class 模擬浮起，售完格圖轉灰階、覆蓋「售完」標、按鈕停用。');
  p=panelsIn(sec);renderM();

  /* Showcase：三種 variant 各一張真實範例卡（live 真 hover） */
  const sw=section(body,'Showcase 範例','三種 variant 的真實組合：直式（新品＋原價）、橫式（熱門＋折扣價）、精簡（無圖）。滑上去看真實 hover 浮起。');
  const rd=ce('div','row-demo');
  [['vertical 直式 · 新品',()=>pcdCard('vertical','default',{live:true,src:PCD_IMG.bag,name:'經典帆布托特包・大容量通勤款'})],
   ['horizontal 橫式 · 熱門＋折扣',()=>pcdCard('horizontal','default',{live:true,src:PCD_IMG.scarf,badgeText:'熱門',badgeIntent:'danger',discount:true,name:'羊毛混紡圍巾・秋冬限定'})],
   ['minimal 精簡 · 無圖',()=>pcdCard('minimal','default',{live:true,name:'不鏽鋼保溫瓶 500ml'})]
  ].forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
  sw.appendChild(rd);

  /* Live：seg 切 variant；勾選項切內容旗標；愛心可真點擊收藏 */
  let pcdWished=false;                                           // 收藏狀態跨 render 保留
  const sl=section(body,'互動預覽與程式碼','切 variant，勾選角標／評分／收藏／折扣價／售完即時重組卡片；愛心可點（切換收藏、轉紅實心），售完時整卡灰階、按鈕與愛心停用。');
  mountLive(sl,{
    initial:{variant:'vertical',size:'m',badge:true,rating:true,wishlist:true,discount:false,soldout:false},
    segs:[{key:'variant',label:'Variant',options:['vertical','horizontal','minimal'],labels:['直式','橫式','精簡']},{key:'size',label:'Size',options:['s','m']}],
    bools:[{key:'badge',label:'badge 角標'},{key:'rating',label:'rating 評分'},
           {key:'wishlist',label:'wishlist 收藏'},{key:'discount',label:'discount 折扣價'},
           {key:'soldout',label:'soldout 售完'}],
    boolLabel:'Content / State',
    render:st=>{
      const wrap=ce('div','');
      function draw(){
        wrap.innerHTML='';
        wrap.appendChild(pcdCard(st.variant,st.soldout?'soldout':'default',{
          live:true,src:PCD_IMG.bag,
          badge:st.badge,rating:st.rating?4.5:false,wishlist:st.wishlist,size:st.size,
          discount:st.discount,wished:pcdWished,
          onWish:()=>{pcdWished=!pcdWished;draw();}               // 點愛心切換收藏後重畫
        }));
      }
      draw();
      return wrap;
    },
    note:'hover 浮起為真實 <code>:hover</code>（售完不浮起）；勾 discount 價格改用 <code>prEl(\'discount\')</code> 劃線原價＋優惠價；售完＝圖灰階＋「售完」覆蓋標＋「已售完」按鈕停用＋愛心停用。'
  });
}

  /* ===== Card group build: category-tile ===== */
/* category-tile icons */
/* category-tile 未新增自訂 icon：leading 重用既有 IC_PHONE／IC_BAG／IC_HOUSE／IC_FOOD／IC_AIRPLANE／IC_MUSIC，右側箭頭重用 ICON_ARROW */

/* category-tile build */
/* ==================== category-tile 分類磚 ==================== */
  /* 分類示意資料池：zh／en／count／desc／icon（既有 PulsoIcon const）／img（IM_POOL 索引） */
  const CAT_DATA=[
    {zh:'電子產品',en:'electronics',count:'128 件',desc:'手機、平板與週邊配件',ic:IC_PHONE,img:0},
    {zh:'服飾配件',en:'fashion',count:'86 件',desc:'男女裝、鞋包與飾品',ic:IC_BAG,img:1},
    {zh:'居家生活',en:'home',count:'54 件',desc:'家具、寢具與收納',ic:IC_HOUSE,img:2},
    {zh:'美食餐飲',en:'food',count:'212 件',desc:'生鮮、零食與飲品',ic:IC_FOOD,img:3,imgId:'photo-1504674900247-0877df9cc836'},
    {zh:'旅遊行程',en:'travel',count:'37 件',desc:'國內外行程與票券',ic:IC_AIRPLANE,img:4},
    {zh:'音樂唱片',en:'music',count:'65 件',desc:'黑膠、CD 與周邊',ic:IC_MUSIC,img:5}
  ];
  /* 矩陣／Live 每個 variant 綁定的固定示意資料（icon=電子產品、image=美食、gradient=音樂） */
  const CAT_MDATA={icon:3,image:3,gradient:3}; // 三 variant 統一用「美食餐飲」，只差樣式
  /* 單顆分類磚：variant=icon|image|gradient；state=default|hover|active
     o={data:CAT_DATA 項, count:顯示數量(預設 true), desc:顯示描述(預設 false), arrow:顯示箭頭(預設 true), live:真實 hover} */
  function catTile(variant,state,o){o=o||{};
    const d=o.data||CAT_DATA[0];
    const t=ce('div','cat-tile cat-'+variant+(o.size==='s'?' cat-sz-s':''));
    if(state==='hover')t.classList.add('is-hover');      // 矩陣用靜態 class 模擬滑過
    if(state==='active')t.classList.add('is-active');    // 選中（目前所在分類）
    if(o.live)t.classList.add('live');                   // Live／showcase 才吃真實 :hover
    t.setAttribute('role','link');t.setAttribute('tabindex','0');
    if(state==='active')t.setAttribute('aria-current','true');
    if(variant==='image'){
      const m=ce('div','cat-media');                     // 重用 Image 原子（imEl），CSS 攤平成滿版背景
      m.appendChild(imEl('rectangular','default','m',{src:d.imgId||IM_POOL[d.img],alt:''}));
      t.appendChild(m);
      t.appendChild(ce('div','cat-scrim'));              // 底部暗色漸層遮罩，確保疊字可讀
    } else {
      const c=ce('div','cat-circle');c.innerHTML=d.ic;c.setAttribute('aria-hidden','true');
      t.appendChild(c);                                  // icon 磚＝主色淡底圓圈；gradient 磚＝半透明白圓圈（CSS 控色）
    }
    const body=ce('div','cat-body');
    const nm=ce('div','cat-name');nm.textContent=d.zh;body.appendChild(nm);
    if(o.desc){const ds=ce('div','cat-desc');ds.textContent=d.desc;body.appendChild(ds);}
    if(o.count!==false){const meta=ce('div','cat-meta');
      const tg=ce('div','tg v-soft c-round i-neutral st-default');   // 重用 Tag 原子顯示數量
      tg.innerHTML='<span>'+d.count+'</span>';
      meta.appendChild(tg);body.appendChild(meta);}
    t.appendChild(body);
    if(o.arrow!==false){const a=ce('span','cat-arrow');a.innerHTML=ICON_ARROW;a.setAttribute('aria-hidden','true');t.appendChild(a);}
    return t;
  }
  /* 矩陣格：count＋arrow、無描述，資料依 variant 固定 */
  function catCell(v,s,size){return catTile(v,s,{data:CAT_DATA[CAT_MDATA[v]],count:true,desc:false,arrow:true,size});}

  function buildCategoryTile(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Category Tile',title:'Category Tile 分類磚',
      lede:'分類導覽磚：點擊進入某分類的入口元件，圖示／圖片＋分類名＋數量。<b>variant × state</b>：icon 圖示磚（主色淡底圓圈＋PulsoIcon icon）／image 圖片磚（Image 原子滿版背景＋暗色遮罩疊白字）／gradient 漸層磚（accent 漸層底＋白字）× default／hover／active（選中）。leading 重用 <b>Icon</b>、背景重用 <b>Image（imEl）</b>、數量重用 <b>Tag（.tg）</b>，箭頭用既有 ICON_ARROW。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>3 × 3 = 9</code>'],
        ['token-policy','<code>semantic.surface.* / semantic.accent.* / --primary-on</code>'],
        ['slots','leading（icon 圓圈／image／gradient 白圈）/ name / count / desc? / arrow?'],
        ['a11y','role="link" tabindex=0；選中 aria-current="true"；媒體圖 alt=""（裝飾性）']]});
    const axes=DIAL_SPECS['category-tile'].axes, zh=DIAL_SPECS['category-tile'].zh, active=CHOICE['category-tile'].active; // 接中央 store
    const VN={icon:['圖示磚','icon'],image:['圖片磚','image'],gradient:['漸層磚','gradient']};
    const STN={default:['預設','default'],hover:['滑過','hover'],active:['選中','active']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.state.filter(s=>active.state.has(s));
      const csz=axes.size.filter(z=>active.size.has(z))[0]||'m';
      p.appendChild(matrixPanel({badge:'category-tile',name:'Variant × State',rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(STN[s][0],STN[s][1]),
        cell:(v,s)=>catCell(v,s,csz),mincol:240})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × State 矩陣','列＝三種磚型、欄＝三種狀態。hover 浮起＋底色／遮罩加深、active 出現 accent 邊框（icon 磚圓圈變實心 accent；gradient 磚以 panel 間隙＋外圈表達）。');
    p=panelsIn(sec);renderM();
    /* Showcase：三磚型並排（含描述、真實 hover） */
    const sc=section(body,'三種磚型 Showcase','同一顆元件的三種外觀：icon 適合密集導覽清單、image 適合視覺主導的分類入口、gradient 適合強調主打分類；此區皆為真實 hover。');
    const row=ce('div','cat-row');
    [['icon',3],['image',3],['gradient',3]].forEach(pair=>{
      row.appendChild(catTile(pair[0],'default',{data:CAT_DATA[pair[1]],count:true,desc:true,arrow:true,live:true}));});
    sc.appendChild(row);
    /* Grid 示意：4~6 磚自適應網格 */
    const gs=section(body,'分類磚 Grid 示意','六個分類排成自適應網格（auto-fill／minmax 220px），其中「美食餐飲」為選中態（aria-current）；真實 hover。');
    const grid=ce('div','cat-grid');
    CAT_DATA.forEach((d,i)=>{grid.appendChild(catTile('icon',i===3?'active':'default',{data:d,count:true,desc:false,arrow:true,live:true}));});
    gs.appendChild(grid);
    /* Live */
    const sl=section(body,'互動預覽與程式碼','切磚型、勾數量／描述／箭頭／選中即時預覽；hover 為真實互動、可與選中疊加。');
    mountLive(sl,{
      initial:{variant:'icon',size:'m',count:true,description:false,arrow:true,active:false},
      segs:[{key:'variant',label:'Variant',options:['icon','image','gradient'],labels:['圖示磚','圖片磚','漸層磚']},{key:'size',label:'Size',options:['s','m']}],
      bools:[{key:'count',label:'count 數量'},{key:'description',label:'description 描述'},{key:'arrow',label:'arrow 箭頭'},{key:'active',label:'active 選中'}],
      boolLabel:'內容／狀態',
      render:st=>{
        const wrap=ce('div','cat-live');
        wrap.appendChild(catTile(st.variant,st.active?'active':'default',
          {data:CAT_DATA[CAT_MDATA[st.variant]],count:st.count,desc:st.description,arrow:st.arrow,size:st.size,live:true}));
        return wrap;},
      note:'active 為「目前所在分類」的持續選中態（<code>aria-current="true"</code>）；image 磚白字靠暗色漸層遮罩保可讀、gradient 磚文字一律 <code>--primary-on</code>。'});
  }

  /* ===== Card group build: article-card ===== */
/* ==================== ARTICLE CARD 文章卡（art-）==================== */
/* 三個 variant 各自的示意內容（封面取自主檔 IM_POOL 已驗證圖池） */
const ART_DATA={
  vertical:{cat:'設計',title:'設計系統如何撐起跨平台的一致體驗',
    excerpt:'從 token、元件到文件化流程，拆解設計系統在多產品線團隊中的實際運作方式，以及導入時最常踩的三個坑。',
    author:'楊鎮瑜',date:'2026/07/12',read:'5 分鐘',srcId:'@HX_TSM_BG'},
  horizontal:{cat:'產品',title:'從資料密集後台談資訊層級的取捨',
    excerpt:'當一個畫面要同時容納篩選、表格與批次操作，怎麼排才不會讓使用者迷路？以三個真實案例拆解。',
    author:'陳美華',date:'2026/07/08',read:'8 分鐘',srcId:'@CARD_PHOTO'},
  overlay:{cat:'趨勢',title:'AI 輔助設計流程的一年實測記錄',
    excerpt:'把生成式工具放進真實交付流程一年後，哪些環節真的變快、哪些反而變慢。',
    author:'王小明',date:'2026/07/01',read:'6 分鐘',srcId:'@CARD_COVER'}
};

/* 文章卡本體：variant=vertical|horizontal|overlay；state=default|hover（矩陣靜態用 is-hover）
   opts={live:真實 hover, more:顯示「閱讀更多」, category/excerpt/author/meta:內容開關（預設全開）} */
function artCard(variant,state,opts){opts=opts||{};
  const on=k=>opts[k]!==false; // 未指定視為開啟
  const d=ART_DATA[variant]||ART_DATA.vertical;
  const card=ce('article','art-card v-'+variant+(state==='hover'?' is-hover':'')+(opts.live?' live':'')+(opts.size==='s'?' art-sz-s':''));
  // 封面：重用 Image 原子 imEl（16:9；橫式/疊字由 CSS 覆寫成填滿）
  const cover=ce('div','art-cover');
  const ART_IMG={'@HX_TSM_BG':()=>HX_TSM_BG,'@CARD_PHOTO':()=>CARD_PHOTO,'@CARD_COVER':()=>CARD_COVER};   // 內嵌照片（預覽環境會擋 Unsplash 遠端圖）
  cover.appendChild(imEl('rectangular','default','l',{src:ART_IMG[d.srcId]?ART_IMG[d.srcId]():d.srcId,alt:d.title,ratio:'16:9'}));
  if(opts.live){ /* 游標位置 → 封面傾斜角（±6°），離開回正 */
    card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=cover.getBoundingClientRect();const px=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),py=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
      card.style.setProperty('--art-ry',((px-.5)*12).toFixed(2)+'deg');card.style.setProperty('--art-rx',((.5-py)*12).toFixed(2)+'deg');});
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--art-rx');card.style.removeProperty('--art-ry');});}
  // 內容區
  const body=ce('div','art-body');
  if(on('category')){ // 分類標：重用 Tag 原子 .tg（疊字版改 v-solid 保對比）
    const c=ce('div','art-cat');
    const t=ce('div','tg '+(variant==='overlay'?'v-solid':'v-soft')+' c-round i-brand st-default');
    t.innerHTML='<span>'+d.cat+'</span>';c.appendChild(t);body.appendChild(c);}
  const ti=ce('h3','art-title');ti.textContent=d.title;body.appendChild(ti);
  if(on('excerpt')){const ex=ce('p','art-excerpt');ex.textContent=d.excerpt;body.appendChild(ex);}
  if(on('author')||on('meta')){ // 作者列：圓形頭像（imEl circular）＋名字＋「·」＋日期＋閱讀時間
    const row=ce('div','art-foot');
    if(on('author')){const a=ce('div','art-author');
      const tone=['accent','brand2','sec'][[...d.author].reduce((n,c)=>n+c.charCodeAt(0),0)%3]; // 同一位作者永遠同色
      a.appendChild(avtEl('s','circle','initials',{initials:d.author[0],tone,name:d.author})); // 2026-11-03：改取用 Avatar 原子
      const nm=ce('span','art-author-name');nm.textContent=d.author;a.appendChild(nm);row.appendChild(a);}
    if(on('meta')){const m=ce('span','art-meta');
      m.innerHTML=(on('author')?'<span class="art-dot">·</span>':'')+'<span>'+d.date+'</span><span class="art-dot">·</span><span>'+d.read+'</span>';
      row.appendChild(m);}
    body.appendChild(row);}
  if(opts.more){ // 閱讀更多：重用 Button 原子（v-text）＋既有 ICON_ARROW
    const mr=ce('div','art-more');
    const b=document.createElement('button');b.className='btn v-text i-primary sz-s live';
    b.innerHTML='<span>閱讀更多</span>'+ICON_ARROW;mr.appendChild(b);body.appendChild(mr);}
  card.append(cover,body); // 疊字版 cover 由 CSS 轉 absolute 鋪底，DOM 順序不變
  return card;
}
/* 矩陣格：靜態呈現一張對應 variant × state 的卡 */
function artCell(variant,state,size){const w=ce('div','art-cell');w.appendChild(artCard(variant,state,{size}));return w;}

function buildArticleCard(view){
  const body=viewScaffold(view,{eyebrow:'L3 Component · Article Card',title:'Article Card 文章卡',
    lede:'部落格／新聞的文章入口卡：封面（重用 <b>Image 原子</b>）＋分類標（重用 <b>Tag 原子</b>）＋標題＋摘要＋作者列（圓形頭像＋日期＋閱讀時間）。<b>variant × state</b>：<b>直式</b>（封面上、內容下）／<b>橫式</b>(封面左、內容右）／<b>疊字</b>（文字壓在封面上、暗漸層遮罩）× default／hover。hover＝卡片浮起＋封面微放大＋標題轉主色。',
    specRows:[['axes','<code>variant × state</code>'],['formula','<code>3 × 2 = 6</code>'],['token-policy','<code>semantic.*.card.*</code>'],['slots','cover / category / title / excerpt / author / meta']]});
  const axes=DIAL_SPECS['article-card'].axes, zh=DIAL_SPECS['article-card'].zh, active=CHOICE['article-card'].active; // 接中央 store
  const VN={vertical:['直式','vertical'],horizontal:['橫式','horizontal'],overlay:['疊字','overlay']};
  const STN={default:['預設','default'],hover:['滑過','hover']};
  let p;
  function renderM(){ if(!p)return; p.innerHTML='';
    const vs=axes.variant.filter(v=>active.variant.has(v));
    const ss=axes.state.filter(s=>active.state.has(s));
    const asz=axes.size.filter(z=>active.size.has(z))[0]||'m';
    p.appendChild(matrixPanel({badge:'article-card',name:'Variant × State',
      rows:vs,cols:ss,
      rowLab:v=>labHTML(VN[v][0],VN[v][1]),
      colLab:s=>labHTML(STN[s][0],STN[s][1]),
      cell:(v,s)=>artCell(v,s,asz),mincol:300})); }
  mountDial(body,{axes,zh,active,onRender:renderM});
  const sec=section(body,'Variant × State 矩陣','列＝三種版式、欄＝狀態。hover 為靜態模擬：卡片浮起加陰影、封面微放大、標題轉主色；疊字版文字置底壓在暗漸層遮罩上。');
  p=panelsIn(sec);renderM();
  // ---- Showcase：三種 variant 各一張真實範例卡（吃真實 hover）----
  const sc=section(body,'三種版式範例 Showcase','直式適合卡片牆／格狀列表、橫式適合窄欄或搜尋結果列（示範附「閱讀更多」text button）、疊字適合封面故事／頭條區。滑鼠移上去看真實 hover。');
  const rd=ce('div','art-showcase');
  rd.appendChild(artCard('vertical','default',{live:true}));
  rd.appendChild(artCard('horizontal','default',{live:true,more:true}));
  rd.appendChild(artCard('overlay','default',{live:true}));
  sc.appendChild(rd);
  // ---- 互動預覽與程式碼 ----
  const sl=section(body,'互動預覽與程式碼','切版式並開關內容 slot 即時預覽；整張卡吃真實 hover（浮起＋封面微放大＋標題轉主色）。');
  mountLive(sl,{
    initial:{variant:'vertical',size:'m',category:true,excerpt:true,author:true,meta:true},
    segs:[{key:'variant',label:'Variant',options:['vertical','horizontal','overlay'],labels:['直式','橫式','疊字']},{key:'size',label:'Size',options:['s','m']}],
    bools:[{key:'category',label:'category 分類標'},{key:'excerpt',label:'excerpt 摘要'},{key:'author',label:'author 作者'},{key:'meta',label:'meta 日期／閱讀'}],
    boolLabel:'內容',
    render:st=>artCard(st.variant,'default',{live:true,size:st.size,category:st.category,excerpt:st.excerpt,author:st.author,meta:st.meta}),
    note:'封面重用 <b>Image</b> 原子（imEl 16:9／頭像 circular）、分類標重用 <b>Tag</b> 原子（疊字版自動改 v-solid 保對比）、閱讀更多重用 <b>Button</b> 原子（v-text）。疊字版關掉摘要更接近頭條卡慣例。'
  });
}


