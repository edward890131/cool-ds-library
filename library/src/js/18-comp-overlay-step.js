/* ==================== modal 對話框 ==================== */
  /* 真實文案：popup（normal／illustration）與 modal（regular／larger）各一組情境內容 */
  const MDL_CONTENT={
    popup:{
      normal:{title:'確認登出',desc:'登出後需要重新輸入帳號密碼才能繼續使用，尚未儲存的變更將會遺失。',
        note:'備註：勾選記住帳號後，下次登入會自動帶入。',remember:'記住帳號',
        primary:{label:'登出',cls:'i-primary'},secondary:'取消',text:'稍後提醒我'},
      illustration:{title:'刪除顧客資料',desc:'刪除後將無法復原，確定要刪除「陳曉明」這筆顧客資料嗎？',
        note:'備註：已完成的訂單紀錄不會一併刪除。',remember:'不再顯示此提醒',
        primary:{label:'刪除',cls:'i-danger'},secondary:'取消',text:'瞭解更多'},
    },
    modal:{ // regular／larger 內容一致，只差寬度（regular 800px、larger ≤1224px）
      regular:{title:'服務條款更新',sub:'2026-07-15 版本更新',cancel:'取消',confirm:'同意並繼續'},
      larger:{title:'服務條款更新',sub:'2026-07-15 版本更新',cancel:'取消',confirm:'同意並繼續'},
    },
    /* modal content 段落池：long 時重複鋪長，示範內容溢出出現卷軸 */
    paras:[
      '為提供更完整的服務體驗，我們更新了會員服務條款與個人資料使用方式，請詳閱以下內容。',
      '一、服務範圍：本服務提供之功能以實際上線版本為準，站方得視營運狀況調整、暫停或終止部分功能。',
      '二、資料使用：您的訂單與瀏覽紀錄僅用於改善服務品質與個人化推薦，不會提供給第三方行銷使用。',
      '三、帳號安全：請妥善保管帳號密碼，因個人保管疏失導致的損失，站方不負擔賠償責任。',
      '四、爭議處理：如對條款內容有疑義，可透過客服信箱與我們聯繫，我們將於三個工作天內回覆。',
    ],
  };

  /* popup footer：排列與裝置脫鉤，改由旗標自由組合——lay.arrange 四選一：
     'row' 並排（次→主 等寬）／'stack' 垂直堆疊（主 solid 全寬 → 次 outline 全寬）／
     'primary' 單顆主按鈕（solid 全寬）／'secondary' 單顆次按鈕（outline 全寬）；
     lay.text=true 再加一顆 text 按鈕（如「稍後提醒我」）。live 時掛 .live 開啟真互動 */
  function mdlPopFoot(c,lay,live,compact){
    lay=lay||{};
    const arrange=lay.arrange||'row';
    const single=(arrange==='primary'||arrange==='secondary');
    const sz=compact?'sz-s':'sz-m';                       // 矩陣縮小示意用 s、Live 用 m
    const lv=live?' live':'';
    const foot=ce('div','mdl-pop-foot'+((arrange==='stack'||single)?' stack':'')); // stack/單顆皆走全寬直排
    const mkSec=()=>{const b=ce('button','btn v-outline i-secondary '+sz+lv);b.innerHTML='<span>'+c.secondary+'</span>';b.setAttribute('data-mdl-cancel','1');return b;}; // 次按鈕：primary outline
    const mkPri=()=>{const b=ce('button','btn v-solid '+c.primary.cls+' '+sz+lv);b.innerHTML='<span>'+c.primary.label+'</span>';return b;}; // 主按鈕：solid（intent 依 variant）
    if(arrange==='primary')foot.appendChild(mkPri());            // 單顆主按鈕
    else if(arrange==='secondary')foot.appendChild(mkSec());     // 單顆次按鈕
    else if(arrange==='stack')foot.append(mkPri(),mkSec());      // 垂直堆疊：主在上、次在下
    else foot.append(mkSec(),mkPri());                           // 並排：次→主 等寬
    if(lay.text){                                         // 文字按鈕（第三動作）：永遠獨占一列全寬
      const txt=ce('button','btn v-text i-primary '+sz+lv);
      txt.innerHTML='<span>'+c.text+'</span>';
      foot.appendChild(txt);
    }
    return foot;
  }
  /* modal footer：右對齊 次按鈕＋確認 */
  function mdlModalFoot(c,live){
    const lv=live?' live':'';
    const foot=ce('div','mdl-foot');
    const sec=ce('button','btn v-outline i-secondary sz-s'+lv);
    sec.innerHTML='<span>'+c.cancel+'</span>';
    sec.setAttribute('data-mdl-cancel','1');              // Live 用來綁「取消」關閉
    const ok=ce('button','btn v-solid i-primary sz-s'+lv);
    ok.innerHTML='<span>'+c.confirm+'</span>';
    foot.append(sec,ok);
    return foot;
  }

  /* close × 按鈕；abs=true 時絕對定位到右上（confirm 版用） */
  function mdlClose(abs){
    const b=ce('button','mdl-close'+(abs?' mdl-abs':''));
    b.innerHTML=ICON_CLOSE;b.setAttribute('aria-label','關閉對話框');
    return b;
  }

  /* 對話框卡片主體。kind=popup|modal；
     o = {variant, icon, arrange, textBtn, closeIcon, description, note, remember, subtitle, long, clip, footer, compact, live} */
  function mdlCard(kind,o){
    o=o||{};
    const compact=o.compact?' mdl-compact':'';
    if(kind==='popup'){
      /* ---- popup 置中小卡：置中標題＋說明＋可選 icon（顏色依語意）／備註／記住帳號 ---- */
      const v=o.variant==='illustration'?'illustration':'normal';
      const c=MDL_CONTENT.popup[v];
      const card=ce('div','mdl-card mdl-kind-popup'+compact);
      const body=ce('div','mdl-pop-body');
      if(o.icon){const ic=ce('div','mdl-illus'+(v==='illustration'?' is-danger':''));ic.innerHTML=MDL_ICON_WARNING;body.appendChild(ic);} // 頂部圓 icon：可選旗標，顏色依 variant 語意（一般＝主色、警示＝紅）
      const t=ce('div','mdl-pop-title');t.textContent=c.title;body.appendChild(t);
      if(o.description!==false){const d=ce('p','mdl-desc');d.textContent=c.desc;body.appendChild(d);}
      if(o.note){const n=ce('div','mdl-note');n.textContent=c.note;body.appendChild(n);}
      if(o.remember){                                     // 記住帳號：重用 .cbx 原子，live 時可點選切換
        const row=ce('label','mdl-remember');
        const cb=ce('span','cbx sz-s st-checked');cb.innerHTML=ICON_CHECK;
        let on=true;
        if(o.live)row.onclick=e=>{e.preventDefault();on=!on;cb.className='cbx sz-s'+(on?' st-checked':'');cb.innerHTML=on?ICON_CHECK:'';};
        row.appendChild(cb);row.appendChild(document.createTextNode(c.remember));
        body.appendChild(row);
      }
      card.appendChild(body);
      if(o.footer!==false)card.appendChild(mdlPopFoot(c,{arrange:o.arrange,text:o.textBtn},o.live,o.compact));
      return card;
    }
    /* ---- modal 寬版視窗：header（標題＋副標題＋×）＋可捲動 content ＋右對齊 footer ---- */
    const v=o.variant==='larger'?'larger':'regular';
    const c=MDL_CONTENT.modal[v];
    const card=ce('div','mdl-card mdl-kind-modal'+(v==='larger'?' mdl-larger':'')+compact);
    const head=ce('div','mdl-mhead');
    const ht=ce('div','mdl-mhead-txt');
    const t=ce('div','mdl-title');t.textContent=c.title;ht.appendChild(t);
    if(o.subtitle!==false&&c.sub){const s=ce('div','mdl-sub');s.textContent=c.sub;ht.appendChild(s);} // 副標題：regular／larger 各有情境文案，可用旗標關閉
    head.appendChild(ht);
    if(o.closeIcon!==false)head.appendChild(mdlClose(false));   // 右上關閉 ×
    card.appendChild(head);
    const ct=ce('div','mdl-content'+(o.clip?' mdl-clip':''));
    const paras=o.long?MDL_CONTENT.paras.concat(MDL_CONTENT.paras):MDL_CONTENT.paras.slice(0,2); // long＝鋪長示範卷軸
    paras.forEach(x=>{const d=ce('p','mdl-desc');d.textContent=x;ct.appendChild(d);});
    card.appendChild(ct);
    if(o.footer!==false)card.appendChild(mdlModalFoot(c,o.live));
    return card;
  }

  /* 浮層結構示意：viewport 內三層（頁面骨架 / backdrop 遮罩 / 置中卡片）+ 圖例 */
  function mdlLayerDemo(){
    const wrap=ce('div','mdl-layer-wrap');
    const vp=ce('div','mdl-viewport');
    const page=ce('div','mdl-vp-page');
    ['w70','w90','w50','w80','w70'].forEach(w=>{const s=ce('div','mdl-skel '+w);page.appendChild(s);});
    const scrim=ce('div','mdl-vp-scrim');
    const mini=ce('div','mdl-vp-card');
    const mt=ce('div','mdl-title');mt.textContent='儲存變更';
    const md=ce('p','mdl-desc');md.textContent='確定要儲存這次的變更嗎？';
    const mf=ce('div','mdl-vp-cardfoot');
    mf.appendChild((()=>{const b=ce('button','btn v-outline i-secondary sz-s');b.innerHTML='<span>取消</span>';return b;})());
    mf.appendChild((()=>{const b=ce('button','btn v-solid i-primary sz-s');b.innerHTML='<span>儲存</span>';return b;})());
    mini.append(mt,md,mf);scrim.appendChild(mini);vp.append(page,scrim);
    const legend=ce('div','mdl-legend');
    [['l-page','頁面內容','底層仍在，但被遮罩壓暗、暫停互動'],
     ['l-scrim','backdrop 遮罩','半透明黑幕蓋住整個畫面，點擊可關閉對話框'],
     ['l-card','對話框卡片','置中浮於最上層，承載標題／內容／動作']
    ].forEach(([cls,t,d])=>{
      const it=ce('div','mdl-leg-item');
      const dot=ce('div','mdl-leg-dot '+cls);
      const tx=ce('div');
      const tt=ce('div','mdl-leg-t');tt.textContent=t;
      const dd=ce('div','mdl-leg-d');dd.textContent=d;
      tx.append(tt,dd);it.append(dot,tx);legend.appendChild(it);
    });
    wrap.append(vp,legend);
    return wrap;
  }

  function buildModal(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Modal',title:'Modal 對話框',
      lede:'覆蓋在頁面之上、需<b>先回應才能繼續</b>的浮層容器：由 <b>backdrop 遮罩</b>＋<b>卡片</b>組成。依 Figma 定義分兩種大小——<b>popup 小彈窗</b>（置中小卡：置中標題＋說明＋可選 icon／備註／記住帳號；icon 為可選旗標、<b>顏色依語意</b>：一般＝主色、警示＝紅；footer 排列可自由組合：<b>並排</b>／<b>垂直堆疊</b>，可再加<b>文字按鈕</b>第三動作）與 <b>modal 大視窗</b>（header 標題＋副標題＋關閉 ×、可捲動 content、footer 右對齊；regular 桌機標準寬 800px、larger 寬高 auto 上限 1224px；<b>行動版轉為 bottom sheet</b>：貼齊底部、全寬、上緣圓角、最高約 95vh、由下往上滑入）。點 × 或遮罩空白處皆可關閉。',
      specRows:[['axes','<code>kind × variant</code>'],['formula','<code>popup(2) + modal(2) = 4</code>'],['token-policy','<code>semantic.*.modal.*</code>'],['features','icon(語意色) / note / remember / 並排·堆疊·文字按鈕 / close-icon / subtitle / scroll-content / footer / bottom-sheet(行動版)']]});
    const axes=DIAL_SPECS.modal.axes, zh=DIAL_SPECS.modal.zh, active=CHOICE.modal.active; // 接中央 store
    const PV={normal:['一般','normal'],illustration:['警示','illustration']};             // popup 的 variant：語意差異，icon 顏色與主按鈕 intent 隨之變化
    const MV={regular:['標準 800px','regular'],larger:['大版 ≤1224px','larger']};        // modal 的 variant
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const ks=axes.kind.filter(k=>active.kind.has(k));
      const pv=['normal','illustration'].filter(v=>active.variant.has(v));
      const mv=['regular','larger'].filter(v=>active.variant.has(v));
      if(ks.includes('popup')&&pv.length){
        const ARRZH={row:'並排',stack:'垂直堆疊',primary:'單顆主按鈕',secondary:'單顆次按鈕'};
        p.appendChild(matrixPanel({badge:'kind · popup',name:'Popup 小彈窗（列＝variant、欄＝按鈕排列：並排／垂直／單顆主／單顆次，排列為獨立旗標、不綁裝置）',
          rows:pv,cols:['row','stack','primary','secondary'],
          rowLab:v=>labHTML(PV[v][0],PV[v][1]),
          colLab:a=>labHTML(ARRZH[a],a),
          cell:(v,a)=>mdlCard('popup',{variant:v,icon:v==='illustration',note:v==='illustration',remember:v==='illustration',arrange:a,compact:true}),mincol:230}));
      }
      if(ks.includes('modal')&&mv.length){
        p.appendChild(matrixPanel({badge:'kind · modal',name:'Modal 大視窗（列＝variant、欄＝內容長度：適中／溢出出現卷軸）',
          rows:mv,cols:['fit','overflow'],
          rowLab:v=>labHTML(MV[v][0],MV[v][1]),
          colLab:c2=>labHTML(c2==='fit'?'內容適中':'內容溢出（卷軸）',c2),
          cell:(v,c2)=>mdlCard('modal',{variant:v,long:c2==='overflow',clip:c2==='overflow',compact:true}),mincol:300}));
      }
      if(!p.children.length){const e=ce('p','sub');e.textContent='目前勾選的 kind 沒有對應的 variant 保留下來，請在篩選器至少各留一個。';p.appendChild(e);}
    }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Kind × Variant 矩陣','variant 依 kind 各取兩種：popup→一般／警示、modal→標準／大版，實際共 4 種組合（篩選器的 2×4 為軸值上限）。popup 欄向展示四種按鈕排列（並排／垂直／單顆主／單顆次；排列為獨立旗標、不綁裝置），警示列的 icon 與主按鈕轉紅、一般列也可帶主色 icon（見 Live）；modal 欄向展示內容適中與溢出（出現卷軸）。');
    p=panelsIn(sec);renderM();

    const ls=section(body,'浮層結構','對話框是一個疊在頁面之上的層級：底層頁面內容被 backdrop 遮罩壓暗，卡片置中浮於最上層，點擊遮罩空白處可關閉。');
    ls.appendChild(mdlLayerDemo());

    const sl=section(body,'互動預覽與程式碼','popup 與 modal 各自一段 playground，控制項只出現對該 kind 有效的選項、每個開關都對應可見差異。對話框<b>預設就開啟</b>在舞台內（遮罩限縮於舞台、不遮全頁）；點 ×、取消或遮罩空白處可關閉，關閉後按「重新開啟對話框」再叫出。');

    /* 共用舞台：root＋重開鈕＋overlay；sheet=true 時（modal 行動版）轉 bottom sheet 版型 */
    function mdlLiveStage(kind,opts,sheet){
      const root=ce('div','mdl-live-root'+(sheet?' vp-mobile':''));      // 行動版：舞台縮成手機視口寬
      const trig=ce('button','btn v-solid i-primary live mdl-reopen');   // 關閉後才現身的重開鈕
      trig.innerHTML='<span>重新開啟對話框</span>';
      root.appendChild(trig);
      let overlay=null;
      function close(){ if(overlay){const ov=overlay;overlay=null;ov.classList.add('is-closing');afterAnim(ov,()=>{ov.remove();trig.classList.add('show');});} } // 先播退場再移除
      function open(){ if(overlay)return; trig.classList.remove('show');
        overlay=ce('div','mdl-overlay'+(sheet?' mdl-sheet-ov':''));       // 行動版：內容對齊底部
        const card=mdlCard(kind,Object.assign({live:true},opts));
        if(sheet)card.classList.add('mdl-sheet');                         // 行動版：貼底、全寬、上緣圓角、由下滑入
        overlay.appendChild(card);
        overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); }); // 點遮罩空白處關閉
        const x=card.querySelector('.mdl-close'); if(x)x.onclick=close;           // 點 × 關閉（modal）
        const cc=card.querySelector('[data-mdl-cancel]'); if(cc)cc.onclick=close; // 點「取消／次按鈕」關閉
        root.appendChild(overlay);
      }
      trig.onclick=open;
      open();                                            // ★ 預設開啟：初始畫面直接看到對話框
      return root;
    }

    /* ---- popup 段：只放對 popup 有效的控制項（無空轉開關） ---- */
    const lp=ce('div','mdl-live-block');
    const lpc=ce('div','mdl-live-cap');lpc.innerHTML='<b>Popup 小彈窗</b>';lp.appendChild(lpc);
    sl.appendChild(lp);
    mountLive(lp,{
      initial:{variant:'normal',arrange:'row',icon:false,description:true,note:false,remember:true,textBtn:false},
      segs:[
        {key:'variant',label:'Variant',options:['normal','illustration'],labels:['一般','警示']},
        {key:'arrange',label:'按鈕排列',options:['row','stack','primary','secondary'],labels:['並排','垂直','單顆主','單顆次']},
      ],
      bools:[
        {key:'icon',label:'icon 圖示（顏色依 variant）'},
        {key:'description',label:'description 說明'},
        {key:'note',label:'note 備註'},
        {key:'remember',label:'checkbox 記住帳號'},
        {key:'textBtn',label:'文字按鈕（第三動作）'},
      ],
      boolLabel:'Content',
      render:st=>mdlLiveStage('popup',{variant:st.variant,icon:st.icon,description:st.description,note:st.note,remember:st.remember,arrange:st.arrange,textBtn:st.textBtn}),
      note:'排列與裝置脫鉤，可自由組合：<b>並排</b>＝次＋主等寬、<b>垂直堆疊</b>＝主（solid 全寬）→次（outline 全寬），再勾<b>文字按鈕</b>疊出第三動作（如「稍後提醒我」）。<b>icon</b> 是可選旗標、一般版也能開；顏色依 variant 語意——一般＝主色、警示＝紅（警示與一般的差異只在顏色與主按鈕 intent）。↓ 快速對照：同一顆 icon 在兩種語意下的顏色。',
      free:()=>[mdlCard('popup',{variant:'normal',icon:true,compact:true}),mdlCard('popup',{variant:'illustration',icon:true,note:true,remember:true,compact:true})]
    });

    /* ---- modal 段：只放對 modal 有效的控制項（含 Device：行動版轉 bottom sheet） ---- */
    const lm=ce('div','mdl-live-block');
    const lmc=ce('div','mdl-live-cap');lmc.innerHTML='<b>Modal 大視窗</b>';lm.appendChild(lmc);
    sl.appendChild(lm);
    mountLive(lm,{
      initial:{variant:'regular',device:'desktop',subtitle:true,closeIcon:true,long:false,footer:true},
      segs:[
        {key:'variant',label:'Variant',options:['regular','larger'],labels:['標準 800px','大版 ≤1224px']},
        {key:'device',label:'Device',options:['desktop','mobile'],labels:['桌機（置中）','行動版（bottom sheet）']},
      ],
      bools:[
        {key:'subtitle',label:'subtitle 副標題'},
        {key:'closeIcon',label:'close-icon 關閉 ×'},
        {key:'long',label:'長內容卷軸'},
        {key:'footer',label:'footer 動作列'},
      ],
      boolLabel:'Content',
      render:st=>mdlLiveStage('modal',{variant:st.variant,subtitle:st.subtitle,closeIcon:st.closeIcon,long:st.long,footer:st.footer},st.device==='mobile'),
      note:'<b>Device</b> 會真的改變版型：桌機＝置中卡片；行動版＝<b>bottom sheet</b>——舞台縮成手機視口、面板貼齊底部、全寬、上緣圓角（下緣不圓）、最高約 95%（示意 95vh）、由下往上滑入。真實規格：modal content max-height 80vh／min-height 30vh，舞台內以縮小高度示意。↓ 靜態縮小示意：內容溢出出現卷軸。',
      free:()=>[mdlCard('modal',{variant:'regular',long:true,clip:true,compact:true})]
    });
  }

/* drawer icons */
/* drawer 無自訂 icon：close 用 ICON_CLOSE，選單項重用 ICON_HOUSE / ICON_LIST / ICON_GEAR */

/* drawer build */
/* ==================== drawer 抽屜 ==================== */
  /* 真實比例抽屜的導覽項池（矩陣／結構示意用，維持精簡 3 項） */
  const DRW_NAV=[[ICON_HOUSE,'總覽'],[ICON_LIST,'訂單管理'],[ICON_GEAR,'系統設定']];
  /* Live 專用較長導覽池（9 項）：讓內容超過面板高度，示意 .drw-nav 內部捲動（重用既有 icon，不新畫） */
  const DRW_NAV_LONG=[[ICON_HOUSE,'總覽'],[ICON_LIST,'訂單管理'],[ICON_SEARCH,'商品搜尋'],
    [ICON_UPLOAD,'檔案上傳'],[ICON_PENCIL,'內容編輯'],[ICON_CHECK,'審核中心'],
    [ICON_EYE,'瀏覽紀錄'],[ICON_XCIRCLE,'退貨處理'],[ICON_GEAR,'系統設定']];

  /* 關閉 × 按鈕：沿用 ICON_CLOSE */
  function drwCloseBtn(){
    const b=document.createElement('button');
    b.className='drw-close';b.setAttribute('aria-label','關閉抽屜');
    b.innerHTML=ICON_CLOSE;return b;
  }
  /* 真實比例的單一導覽列：activeIndex 該項高亮 */
  function drwNavRow(icon,label,active){
    const it=ce('div','drw-navrow'+(active?' is-active':''));
    const ic=ce('span','drw-navico');ic.innerHTML=icon;
    const tx=ce('span');tx.textContent=label;
    it.append(ic,tx);return it;
  }

  /* ---- 矩陣格：小型裝置框，抽屜自 side 滑入、寬度依 size；面板採與 Live 一致的浮動內縮樣式 ---- */
  function drwFrame(side,size){
    const fr=ce('div','drw-frame');
    const fake=ce('div','drw-fake');                       // 淡淡的假內容線條
    const bar=ce('div','drw-fbar lead');fake.appendChild(bar);
    [72,54,66,48].forEach(w=>{const b=ce('div','drw-fbar');b.style.width=w+'%';fake.appendChild(b);});
    fr.appendChild(fake);
    fr.appendChild(ce('div','drw-backdrop'));               // 半透明遮罩
    const pn=ce('div','drw-panel side-'+side+' sz-'+size);  // 抽屜面板
    const hd=ce('div','drw-phead');
    const tt=ce('div','drw-ptitle');tt.textContent='選單';
    const cl=ce('span','drw-pclose');cl.innerHTML=ICON_CLOSE;
    hd.append(tt,cl);
    const nav=ce('div','drw-pnav');
    DRW_NAV.forEach((it,i)=>{
      const row=ce('div','drw-pitem'+(i===0?' is-active':''));
      const ic=ce('span','drw-pico');ic.innerHTML=it[0];
      const t=ce('span');t.textContent=it[1];
      row.append(ic,t);nav.appendChild(row);
    });
    pn.append(hd,nav);fr.appendChild(pn);
    return fr;
  }

  /* ---- 內容結構示意：真實比例抽屜 + 三段圖例 ---- */
  function drwStructure(){
    const wrap=ce('div','drw-struct-wrap');
    const box=ce('div','drw-struct');
    const hd=ce('div','drw-head');                          // header：標題 + 關閉
    const tt=ce('div','drw-title');tt.textContent='導覽選單';
    hd.append(tt,drwCloseBtn());
    const nav=ce('div','drw-nav');                          // body：導覽列表
    DRW_NAV.forEach((it,i)=>nav.appendChild(drwNavRow(it[0],it[1],i===0)));
    const ft=ce('div','drw-foot');                          // footer：動作按鈕（重用 Button）
    const cancel=document.createElement('button');cancel.className='btn v-text i-secondary sz-s';cancel.textContent='取消';
    const ok=document.createElement('button');ok.className='btn v-solid i-primary sz-s';ok.textContent='套用';
    ft.append(cancel,ok);
    box.append(hd,nav,ft);
    // 三段圖例（重用 Tag 元件）
    const leg=ce('div','drw-legend');
    [['header','標題列','標題文字與關閉 × 按鈕，固定在頂部。'],
     ['body','導覽列表','可捲動的選單／內容主體，目前所在項高亮。'],
     ['footer','動作列','取消／套用等主要動作，可選（純導覽抽屜可省略）。']
    ].forEach(([en,zh,desc])=>{
      const row=ce('div','drw-legrow');
      const tag=ce('div','tg v-soft c-rect i-neutral st-default');tag.innerHTML='<span>'+en+'</span>';
      const tx=ce('div','drw-legtx');
      const b=document.createElement('b');b.textContent=zh;
      const s=document.createElement('span');s.textContent=desc;
      tx.append(b,s);row.append(tag,tx);leg.appendChild(row);
    });
    wrap.append(box,leg);
    return wrap;
  }

  function buildDrawer(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Drawer',title:'Drawer 抽屜',
      lede:'從螢幕邊緣滑出的<b>側邊面板</b>，覆蓋在頁面上、以 <b>backdrop</b> 遮罩隔開背景內容；常用於導覽選單、篩選面板或詳情檢視。可從<b>左側</b>或<b>右側</b>滑入，寬度分<b>窄／標準／寬</b>三級。跟置中彈出的 modal、貼齊觸發點的 popover 不同。矩陣與 Live 均採面板<b>浮動內縮</b>的漂浮樣式；Live 示範<b>預設展開</b>，導覽項較多時內容於面板內部捲動。',
      specRows:[['axes','<code>side × size</code>'],['formula','<code>2 × 3 = 6</code>'],['token-policy','<code>semantic.*.drawer.*</code>'],['features','backdrop / header / footer']]});
    const axes=DIAL_SPECS.drawer.axes, zh=DIAL_SPECS.drawer.zh, active=CHOICE.drawer.active; // 接中央 store
    const SIDEN={left:['左側','left'],right:['右側','right']};
    const SIZEN={s:['窄','s'],m:['標準','m'],l:['寬','l']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const sd=axes.side.filter(v=>active.side.has(v));
      const sz=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'drawer · frame',name:'Side × Size（裝置框內示意：抽屜自指定邊滑入、寬度依尺寸）',
        rows:sd,cols:sz,
        rowLab:s=>labHTML(SIDEN[s][0],SIDEN[s][1]),
        colLab:z=>labHTML(SIZEN[z][0]+' '+z,z),
        cell:(s,z)=>drwFrame(s,z),mincol:300})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Side × Size 矩陣','列＝滑入方向、欄＝面板寬度；每格為一個裝置視窗示意，抽屜自邊緣滑入、面板浮動內縮並帶圓角陰影，半透明 backdrop 鋪滿整個視窗。');
    p=panelsIn(sec);renderM();
    const sts=section(body,'內容結構','抽屜由三段組成：header（標題 ＋ 關閉）、body（導覽列表）、footer（動作按鈕，可選）。');
    sts.appendChild(drwStructure());
    const sl=section(body,'互動預覽與程式碼','預設即顯示已開啟的抽屜：面板為浮動式、距舞台上下左右內縮 24px；導覽列表放入 9 個項目、內容超過面板高度，於面板內部捲動。點關閉 × 或 backdrop 收回後，再點「開啟抽屜」可重新滑入。切 Side／Size，勾 header／backdrop／footer。');
    mountLive(sl,{
      initial:{side:'left',size:'m',header:true,backdrop:true,footer:false},
      segs:[
        {key:'side',label:'Side',options:['left','right'],labels:['左側','右側']},
        {key:'size',label:'Size',options:['s','m','l']},
      ],
      bools:[{key:'header',label:'header 標題列'},{key:'backdrop',label:'backdrop 遮罩'},{key:'footer',label:'footer 動作列'}],
      boolLabel:'Content',
      render:st=>{
        const stage=ce('div','drw-live-stage');
        const trig=document.createElement('button');
        trig.className='btn v-solid i-primary sz-m';trig.textContent='開啟抽屜';
        const backdrop=ce('div','drw-live-backdrop');
        const panel=ce('div','drw-live-panel side-'+st.side+' sz-'+st.size);
        if(st.header){
          const hd=ce('div','drw-head');
          const tt=ce('div','drw-title');tt.textContent='導覽選單';
          const cl=drwCloseBtn();
          hd.append(tt,cl);panel.appendChild(hd);
          cl.onclick=close;
        }
        const nav=ce('div','drw-nav');   // body：用較長清單讓內容溢出，示意面板內部捲動
        DRW_NAV_LONG.forEach((it,i)=>nav.appendChild(drwNavRow(it[0],it[1],i===0)));
        panel.appendChild(nav);
        if(st.footer){
          const ft=ce('div','drw-foot');
          const cancel=document.createElement('button');cancel.className='btn v-text i-secondary sz-s';cancel.textContent='取消';
          const ok=document.createElement('button');ok.className='btn v-solid i-primary sz-s';ok.textContent='套用';
          cancel.onclick=close;ft.append(cancel,ok);panel.appendChild(ft);
        }
        function open(){ if(st.backdrop)backdrop.classList.add('is-open'); requestAnimationFrame(()=>panel.classList.add('is-open')); }
        function close(){ backdrop.classList.remove('is-open'); panel.classList.remove('is-open'); }
        trig.onclick=open;
        if(st.backdrop)backdrop.onclick=close;
        /* Motion v1：拖曳關閉——往收合方向拖跟手、反向有阻尼；超過面板 35% 或甩得夠快就關，否則 spring 彈回 */
        (function(){let x0=0,t0=0,dx=0,drag=false;const dir=st.side==='left'?-1:1;
          panel.addEventListener('pointerdown',e=>{if(!panel.classList.contains('is-open')||e.button!==0||e.target.closest('button,a,input'))return;
            drag=true;x0=e.clientX;t0=performance.now();dx=0;panel.classList.remove('is-snap');panel.classList.add('is-dragging');panel.setPointerCapture(e.pointerId);});
          panel.addEventListener('pointermove',e=>{if(!drag)return;dx=e.clientX-x0;const d=dx*dir;
            const tx=d>0?dx:Math.sign(dx)*Math.sqrt(Math.abs(dx))*2;panel.style.transform=`translateX(${tx}px)`;
            if(st.backdrop)backdrop.style.opacity=String(Math.max(0,1-Math.max(0,d)/panel.offsetWidth));});
          const end=()=>{if(!drag)return;drag=false;panel.classList.remove('is-dragging');const d=dx*dir,v=d/Math.max(1,performance.now()-t0);
            panel.style.transform='';backdrop.style.opacity='';
            if(d>panel.offsetWidth*.35||v>.5)close();else{panel.classList.add('is-snap');afterTransition(panel,()=>panel.classList.remove('is-snap'));}};
          panel.addEventListener('pointerup',end);panel.addEventListener('pointercancel',end);})();
        stage.append(trig);
        if(st.backdrop)stage.appendChild(backdrop);
        stage.appendChild(panel);
        // 預設即顯示已開啟狀態：插入前先掛 is-open（不跑滑入動畫），關閉後可再點按鈕重開
        if(st.backdrop)backdrop.classList.add('is-open');
        panel.classList.add('is-open');
        return stage;
      },
      note:'抽屜與 backdrop 都<b>限縮在上方 stage 容器內</b>，不會遮住整個頁面；面板為<b>浮動式</b>（四邊內縮 24px、圓角＋陰影），高度＝舞台高 − 48px，內容溢出時面板內部捲動；滑入收合仍用 <code>transform</code> 動畫，backdrop 鋪滿整個舞台。取消 backdrop 時面板直接疊在內容上（無遮罩）。'
    });
  }

/* floating-line icons */
/* floating-line 自訂 icon（PulsoIcon currentColor） */
  const FLO_ICON_PLUS=PI('plus');
  const FLO_ICON_TRASH=PI('trash');

/* floating-line build */
/* ==================== floating-line 浮動列 ==================== */
  /* 浮動列＝漂浮在內容上方的橫向動作列：三型態 selection / toolbar / fab，兩種底部位置 */

  const FLO_TOOLS=[ICON_PENCIL,ICON_EYE,ICON_UPLOAD,ICON_GEAR];        // 工具列 icon 池
  const FLO_FAB_CHILD=[                                                 // FAB 展開子項
    {icon:ICON_PENCIL,label:'新增文件'},
    {icon:ICON_UPLOAD,label:'上傳檔案'},
    {icon:ICON_SEARCH,label:'快速搜尋'},
  ];

  /* 通用 .btn 組裝：cls=額外 class；icon=原始 svg（走 .btn svg em 尺寸）；label=文字 */
  function floBtn(cls,label,icon){
    const b=ce('button','btn '+cls);
    let h=''; if(icon)h+=icon; if(label)h+=`<span>${label}</span>`;
    b.innerHTML=h; return b;
  }

  /* 假內容區：淡背景假內容線條（tall 時多一塊卡片示意有較高內容） */
  function floFake(o){o=o||{};
    const f=ce('div','flo-fake');
    if(o.tall)f.appendChild(ce('div','flo-blk'));
    [92,74,88,60].forEach((w,i)=>{const l=ce('div','flo-line');l.style.width=w+'%';f.appendChild(l);
      if(o.tall&&i===1)f.appendChild(ce('div','flo-blk'));});
    return f;
  }

  /* 型態 1：選取列（深色 pill）＝「已選 N 項」＋ 取消（v-text）＋ 刪除（v-solid i-danger）；more=多動作 */
  function floSelectBar(o){o=o||{};
    const bar=ce('div','flo-select');
    const cnt=ce('span','flo-count');cnt.innerHTML=`已選 <b>${o.count==null?3:o.count}</b> 項`;
    const acts=ce('div','flo-actions');
    if(o.more){                                          // 展開更多批次動作
      acts.appendChild(floBtn('v-text i-secondary sz-s','匯出'));
      acts.appendChild(floBtn('v-text i-secondary sz-s','封存'));
    }
    acts.appendChild(floBtn('v-text i-secondary sz-s','取消'));
    acts.appendChild(floBtn('v-solid i-danger sz-s','刪除',FLO_ICON_TRASH));
    bar.append(cnt,acts);
    return bar;
  }

  /* 型態 2：浮動工具列（白底圓角陰影）＝一排 icon-only 工具鈕，用分隔線分組 */
  function floToolbar(o){o=o||{};
    const bar=ce('div','flo-toolbar');
    const n=o.count||4;
    const gp=o.groupAt==null?2:o.groupAt;               // 第 gp 顆前插分隔線
    for(let i=0;i<n;i++){
      if(gp&&i===gp)bar.appendChild(ce('div','flo-tdiv'));
      bar.appendChild(floBtn('v-text i-secondary sz-s icon-only',null,FLO_TOOLS[i%FLO_TOOLS.length]));
    }
    return bar;
  }

  /* 型態 3：FAB 浮動主鈕（accent 圓形＋＋圖示）；expanded=展開子項清單 */
  function floFab(o){o=o||{};
    const wrap=ce('div','flo-float flo-fabwrap');        // 直向堆疊：子項在上、主鈕在下
    const kids=[];
    // 子項＝單顆白底 library 按鈕（icon＋文字同在一顆、整顆可點）；interactive 時先建好、預設隱藏，點主鈕再展開
    if(o.expanded||o.interactive){
      const n=FLO_FAB_CHILD.length;
      FLO_FAB_CHILD.forEach((c,i)=>{
        const b=floBtn('flo-fab-child-btn sz-m',c.label,c.icon);
        b.style.setProperty('--fab-i',n-1-i);b.style.setProperty('--fab-j',i);   // FAB-MOTION:v1 i＝離主鈕的距離（展開先出近的）、j＝收合順序（遠的先收）
        if(o.interactive&&!o.expanded)b.inert=true;
        wrap.appendChild(b);kids.push(b);
      });
    }
    const main=floBtn('v-solid i-primary flo-fab icon-only'+(o.interactive?' live':''),null,FLO_ICON_PLUS);
    main.setAttribute('aria-label','新增');
    if(o.interactive){                                   // 點主鈕即時展開／收合子項（＋ 旋轉成 ×）
      let open=!!o.expanded;wrap.classList.add('is-anim');wrap.classList.toggle('is-open',open);   // FAB-MOTION:v1 子項常駐 DOM，用 class 切換做彈出／收合動態
      main.classList.toggle('is-open',open);main.setAttribute('aria-expanded',open);
      main.onclick=()=>{open=!open;kids.forEach(k=>k.inert=!open);wrap.classList.toggle('is-open',open);main.classList.toggle('is-open',open);main.setAttribute('aria-expanded',open);};
    }
    wrap.appendChild(main);
    return wrap;
  }

  /* 舞台：假內容區 + 依 variant/position 疊上浮動列 */
  function floStage(variant,position,o){o=o||{};
    const st=ce('div','flo-stage'+(o.tall?' flo-tall':''));   // tall 時加高舞台，容納 FAB 展開子項
    st.appendChild(floFake({tall:o.tall}));
    let float;
    if(variant==='fab'){float=floFab(o);}               // fab 自帶 flo-float wrap
    else{
      float=ce('div','flo-float');
      float.appendChild(variant==='selection'?floSelectBar(o):floToolbar(o));
    }
    float.classList.add('flo-pos-'+(position||'bottom-center'));
    st.appendChild(float);
    return st;
  }

  function buildFloatingLine(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Floating Line',title:'Floating Line 浮動列',
      lede:'漂浮在內容<b>上方</b>的橫向動作列，隨情境浮現以就近操作：<b>選取列</b>（顯示「已選 N 項」＋批次動作）、<b>工具列</b>（一排 icon 工具鈕、分隔線分組）、<b>FAB 浮動主鈕</b>（圓形＋主要新增動作）。與常駐 toolbar、底部固定 bar 不同——它是<b>疊在內容上</b>的浮層，位置固定於視窗一角。',
      specRows:[['axes','<code>variant × position</code>'],['formula','<code>3 × 2 = 6</code>'],['token-policy','<code>semantic.*.floating.*</code>'],['content','selection / toolbar / fab']]});
    const axes=DIAL_SPECS['floating-line'].axes, zh=DIAL_SPECS['floating-line'].zh, active=CHOICE['floating-line'].active; // 接中央 store
    const VN={selection:['選取列','selection'],toolbar:['工具列','toolbar'],fab:['浮動鈕','fab']};
    const PN={'bottom-center':['底部置中','bottom-center'],'bottom-right':['底部靠右','bottom-right']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ps=axes.position.filter(v=>active.position.has(v));
      p.appendChild(matrixPanel({badge:'variant · position',name:'Variant × Position（每格為假內容區，浮動列疊在指定位置）',
        rows:vs,cols:ps,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:c=>labHTML(PN[c][0],PN[c][1]),
        cell:(v,c)=>floStage(v,c,{expanded:false}),mincol:360})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Position 矩陣','列＝三種型態、欄＝兩種底部位置；每格是一塊假內容區，浮動列以 absolute 疊在指定角落（bottom-center 置中、bottom-right 靠右）。');
    p=panelsIn(sec);renderM();

    // ---- 型態細節 ----
    const ds=section(body,'型態細節 Variant details','三種型態各自的內容組成：選取列的計數＋批次動作、工具列的分組、FAB 的展開子項。');
    const det=ce('div','flo-detail');
    // selection 細節（完整批次動作較寬 → 獨佔一列）
    const c1=ce('div','flo-dcol flo-wide');
    const cap1=ce('div','flo-dcap');cap1.innerHTML='<b>selection 選取列</b> · 計數 + 批次動作（匯出／封存／取消／刪除）';
    const b1=ce('div','flo-dbox');b1.appendChild(floSelectBar({count:3,more:true}));
    c1.append(cap1,b1);
    // toolbar 細節
    const c2=ce('div','flo-dcol');
    const cap2=ce('div','flo-dcap');cap2.innerHTML='<b>toolbar 工具列</b> · icon 工具鈕，分隔線分組（編輯／預覽｜上傳／設定）';
    const b2=ce('div','flo-dbox');b2.appendChild(floToolbar({count:4,groupAt:2}));
    c2.append(cap2,b2);
    // fab 細節
    const c3=ce('div','flo-dcol');
    const cap3=ce('div','flo-dcap');cap3.innerHTML='<b>fab 浮動鈕</b> · 主鈕點擊展開子項（新增文件／上傳檔案／快速搜尋）';
    const b3=ce('div','flo-dbox flo-tall');b3.appendChild(floFab({expanded:true}));
    c3.append(cap3,b3);
    det.append(c1,c2,c3);ds.appendChild(det);

    // ---- 互動預覽與程式碼 ----
    const sl=section(body,'互動預覽與程式碼','切 Variant 與 Position 看浮動列型態與落點；勾選項依型態生效——選取列可展開「更多動作」、FAB 可「展開子項」。');
    mountLive(sl,{
      initial:{variant:'selection',position:'bottom-center',more:false,expanded:false},
      segs:[
        {key:'variant',label:'Variant',options:['selection','toolbar','fab'],labels:['選取列','工具列','浮動鈕']},
        {key:'position',label:'Position',options:['bottom-center','bottom-right'],labels:['底部置中','底部靠右']},
      ],
      bools:[
        {key:'more',label:'more 更多動作（選取列）'},
        {key:'expanded',label:'expanded 展開子項（浮動鈕）'},
      ],
      boolLabel:'Content',
      render:st=>{
        // bools 依 variant 生效：selection 看 more、fab 看 expanded（設初始展開狀態，仍可點主鈕切換）、toolbar 兩者皆略
        const o={count:3,more:st.variant==='selection'&&st.more,expanded:st.variant==='fab'&&st.expanded,interactive:st.variant==='fab',tall:true};
        return floStage(st.variant,st.position,o);
      },
      note:'浮動列以 <b>absolute</b> 疊在假內容區上：Position 決定落在<b>底部置中</b>或<b>底部靠右</b>。選取列勾「更多動作」多出匯出／封存；<b>浮動鈕可直接點主鈕展開／收合子項</b>（＋ 旋轉成 ×），「展開子項」勾選則設定初始狀態；工具列不受勾選影響。'
    });
  }

/* step icons */
/* ---- STEP 步驟指示器 專用 icon ---- */
  /* error 狀態用 PulsoIcon warning（警示三角）；done 沿用既有 ICON_CHECK */
  const STP_ICON_WARN=PI('triangle-alert',{solid:1});
  /* icon variant 每步的圖示池（沿用既有 PulsoIcon const） */
  const STP_ICONS=[ICON_HOUSE,ICON_LIST,ICON_UPLOAD,ICON_GEAR];

/* step build */
/* ==================== step 步驟指示器 ==================== */
  /* 單一節點：state = done/current/todo/error/disabled；variant 控制內容物 */
  function stpNode(state,variant,o){
    o=o||{};
    const n=ce('div','stp-node stp-'+state);
    if(variant!=='dotted'){                 // dotted 為純小圓點、內部留空
      if(state==='done')n.innerHTML=ICON_CHECK;          // 完成打勾
      else if(state==='error')n.innerHTML=STP_ICON_WARN; // 錯誤警示
      else if(variant==='icon')n.innerHTML=o.icon||STP_ICONS[0];
      else n.textContent=o.num;             // numbered：顯示步驟編號
    }
    return n;
  }
  /* 完整 stepper：orientation 決定橫向/縱向、variant 決定節點樣式 */
  function stpStepper(orientation,variant,steps){
    const vcls=variant==='dotted'?'stp-dot':(variant==='icon'?'stp-icon':'stp-num');
    if(orientation==='vertical'){
      const w=ce('div','stp-vertical '+vcls);
      steps.forEach((s,i)=>{
        const step=ce('div','stp-vstep stp-is-'+s.state);
        const rail=ce('div','stp-vrail');
        rail.appendChild(stpNode(s.state,variant,{num:i+1,icon:s.icon}));
        if(i<steps.length-1)rail.appendChild(ce('div','stp-vconn'+(s.state==='done'?' stp-conn-done':'')));
        const labels=ce('div','stp-labels');
        labels.innerHTML=`<span class="stp-title">${s.label}</span>`+(s.description?`<span class="stp-desc">${s.description}</span>`:'');
        step.append(rail,labels);
        w.appendChild(step);
      });
      return w;
    }
    const w=ce('div','stp-horizontal '+vcls);
    steps.forEach((s,i)=>{
      const step=ce('div','stp-step stp-is-'+s.state);
      step.appendChild(stpNode(s.state,variant,{num:i+1,icon:s.icon}));
      const labels=ce('div','stp-labels');
      labels.innerHTML=`<span class="stp-title">${s.label}</span>`+(s.description?`<span class="stp-desc">${s.description}</span>`:'');
      step.appendChild(labels);
      w.appendChild(step);
      if(i<steps.length-1)w.appendChild(ce('div','stp-conn'+(s.state==='done'?' stp-conn-done':'')));
    });
    return w;
  }
  /* 主矩陣用的 4 步流程（結帳情境）：狀態混合 done→current→todo→todo */
  const STP_MX_LABELS=['帳號','資料','付款','完成'];
  const STP_MX_STATES=['done','current','todo','todo'];
  const STP_MX_DESC=['已驗證','填寫中','待處理','待處理'];
  function stpMxSteps(){
    return STP_MX_LABELS.map((lb,i)=>({label:lb,icon:STP_ICONS[i],state:STP_MX_STATES[i]}));
  }
  /* Live 用的 4 步流程（每步可帶副標） */
  const STP_LIVE_STEPS=[
    {label:'建立帳號',description:'填寫 Email 與密碼',icon:ICON_HOUSE},
    {label:'基本資料',description:'姓名與聯絡方式',icon:ICON_LIST},
    {label:'上傳文件',description:'身分證明檔案',icon:ICON_UPLOAD},
    {label:'完成設定',description:'確認並送出',icon:ICON_GEAR},
  ];

  /* ---- type 軸（2026-11-04 改版）：classic 經典（stpStepper，#start 流程沿用、不動）＋ compact 精簡進度型 ＋ timeline 直式時間軸型 ---- */
  const STP_IC_CARET_L=PI('chevron-left'); // PulsoIcon caret-left
  const STP_ST_ZH={done:'已完成',current:'進行中',todo:'未開始',error:'錯誤',disabled:'停用'};
  /* compact：一步一段進度條（Progress 原子 prgEl bar·s）；done＝填滿、current＝填一半、error＝填滿轉 danger、todo＝空。
     steps:[{label,state}]；o.count「步驟 n / m」、o.next 下一步預告、o.live 可點回已完成步驟＋←／→ 鍵盤（o.onPick(i)）。
     回傳節點帶 _set(states,justDone)：原地更新（進度條寬度、打勾彈出才有過渡），不重建 DOM。 */
  function stpCompact(steps,o){o=o||{};
    const w=ce('div','stp-cmp');w.style.setProperty('--stp-n',steps.length);
    const head=ce('div','stp-cmp-head');const ttl=ce('div');const cnt=ce('span','stp-cmp-count');const cur=ce('span','stp-cmp-cur');ttl.append(cnt,cur);
    const nx=ce('span','stp-cmp-next');head.append(ttl,nx);
    const ol=ce('ol','stp-cmp-steps');ol.setAttribute('aria-label',o.label||'流程進度');
    const segs=steps.map((s,i)=>{const li=ce('li');const b=ce('button','stp-seg');b.type='button';b.dataset.i=i;
      const p=prgEl('bar','s',{value:0});['role','aria-valuenow','aria-valuemin','aria-valuemax'].forEach(a=>p.removeAttribute(a));p.setAttribute('aria-hidden','true');
      const lab=ce('span','stp-seg-lab');b.append(p,lab);li.appendChild(b);ol.appendChild(li);
      if(!o.live)b.tabIndex=-1;return {li,b,fill:p.querySelector('.prg-fill'),lab};});
    w.append(head,ol);
    let states=steps.map(s=>s.state),focusI=-1;
    const curIdx=()=>{const i=states.findIndex(x=>x==='current'||x==='error');return i<0?states.length-1:i;};
    function set(st,justDone){states=st.slice();const idx=curIdx();
      cnt.hidden=o.count===false;cnt.innerHTML=`步驟 <b>${idx+1}</b> / ${steps.length}`;
      cur.textContent=steps[idx].label;
      nx.hidden=o.next===false;nx.textContent=idx<steps.length-1?'下一步：'+steps[idx+1].label:'最後一步';
      if(focusI<0||focusI>=steps.length)focusI=idx;
      segs.forEach((g,i)=>{const s=states[i];g.li.className='stp-is-'+s;
        g.fill.classList.toggle('i-danger',s==='error');g.fill.classList.toggle('i-primary',s!=='error');
        g.fill.style.width=(s==='done'||s==='error')?'100%':s==='current'?'50%':'0%';
        g.lab.innerHTML=(s==='done'?`<span class="stp-seg-ck${i===justDone?' is-pop':''}">${ICON_CHECK}</span>`:s==='error'?STP_ICON_WARN:'')+`<span>${steps[i].label}</span>`;
        if(i===idx)g.b.setAttribute('aria-current','step');else g.b.removeAttribute('aria-current');
        if(s==='done'||i===idx)g.b.removeAttribute('aria-disabled');else g.b.setAttribute('aria-disabled','true');
        g.b.setAttribute('aria-label',`第 ${i+1} 步，${steps[i].label}，${STP_ST_ZH[s]}`);
        if(o.live)g.b.tabIndex=i===focusI?0:-1;});}
    if(o.live){
      ol.addEventListener('click',e=>{const b=e.target.closest('.stp-seg');if(!b||b.hasAttribute('aria-disabled'))return;const i=+b.dataset.i;focusI=i;if(i!==curIdx()&&o.onPick)o.onPick(i);});
      ol.addEventListener('keydown',e=>{const b=e.target.closest('.stp-seg');if(!b)return;const i=+b.dataset.i;let j=-1;
        if(e.key==='ArrowRight')j=Math.min(steps.length-1,i+1);else if(e.key==='ArrowLeft')j=Math.max(0,i-1);else if(e.key==='Home')j=0;else if(e.key==='End')j=steps.length-1;
        if(j<0)return;e.preventDefault();focusI=j;segs.forEach((g,k)=>g.b.tabIndex=k===j?0:-1);segs[j].b.focus();});}
    set(states,-1);w._set=set;w._focus=()=>{const g=segs[focusI];if(g)g.b.focus();};
    return w;}
  /* 情境資料：結帳 5 步（compact） */
  const STP_CMP_STEPS=['購物車','收件資料','付款方式','確認訂單','完成'];
  const STP_CMP_ERR='信用卡授權失敗：銀行拒絕這筆交易，請確認卡片額度，或改用 LINE Pay、ATM 轉帳。';
  function stpCmpStates(idx,err){return STP_CMP_STEPS.map((_,i)=>i<idx?'done':i===idx?(err?'error':'current'):'todo');}

  /* timeline：直式時間軸，每步有說明、時間；可展開的步驟用 Collapse 原子（一次只開一個）。
     steps:[{label,desc,time,eta,state,box:[[k,v]],action,openable}]；state：done／current／todo／disabled（disabled＝之後才開放的動作，如送達前的退貨）。
     o.desc／o.time／o.expandable 三個 boolean；o.open＝預設展開哪一步；o.live＝可點、↑／↓ 鍵盤。回傳節點帶 _open(i)。 */
  function stpTimeline(steps,o){o=o||{};
    const ol=ce('ol','stp-tl');ol.setAttribute('aria-label',o.label||'進度時間軸');
    const exp=o.expandable!==false;let open=o.open==null?-1:o.open;let focusI=steps.findIndex(s=>s.state==='current');if(focusI<0)focusI=0;
    const items=steps.map((s,i)=>{const st=s.state;const li=ce('li','stp-tl-item stp-is-'+st);
      const rail=ce('div','stp-vrail');rail.appendChild(stpNode(st,'numbered',{num:''}));
      if(i<steps.length-1)rail.appendChild(ce('div','stp-vconn'+(st==='done'?' stp-conn-done':'')));
      const can=exp&&!!s.box&&(st==='done'||st==='current'||!!s.openable);
      const main=ce('div','stp-tl-main'+(exp&&s.box?' cps-panel':'')+(can&&open===i?' is-open':''));
      const time=(st==='done'||st==='current')?(s.time||''):(s.eta||'');
      const head=ce(o.live&&exp?'button':'div','stp-tl-head');if(head.tagName==='BUTTON'){head.type='button';head.tabIndex=o.live&&i===focusI?0:-1;}
      head.dataset.i=i;if(i===steps.findIndex(x=>x.state==='current'))head.setAttribute('aria-current','step');
      head.innerHTML=`<span class="stp-tl-t"><span>${s.label}</span>${can?`<span class="cps-caret">${ICON_CARET}</span>`:''}</span>`+(o.time!==false&&time?`<span class="stp-tl-time">${time}</span>`:'');
      if(head.tagName==='BUTTON'){if(can){head.setAttribute('aria-expanded',String(open===i));head.setAttribute('aria-controls','stptl-'+i);}else head.setAttribute('aria-disabled','true');
        head.setAttribute('aria-label',`${s.label}，${STP_ST_ZH[st]}${time?'，'+time:''}`);}
      main.appendChild(head);
      if(o.desc!==false&&s.desc){const d=ce('div','stp-tl-desc');d.textContent=s.desc;main.appendChild(d);}
      let act=null;
      if(exp&&s.box){const bw=ce('div','cps-body-wrap');bw.id='stptl-'+i;const bd=ce('div','cps-body');const box=ce('div','stp-tl-box');
        box.innerHTML=s.box.map(([k,v])=>`<div class="stp-tl-row"><span>${k}</span><span class="${/碼/.test(k)?'mono':''}">${v}</span></div>`).join('');
        if(s.action){act=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:!!o.live});act.querySelector('span').textContent=s.action;act.tabIndex=can&&open===i?0:-1;box.appendChild(act);}
        bd.appendChild(box);bw.appendChild(bd);main.appendChild(bw);}
      li.append(rail,main);ol.appendChild(li);return {li,main,head,act,can};});
    function setOpen(n){open=n;items.forEach((it,k)=>{const on=it.can&&k===open;it.main.classList.toggle('is-open',on);
      if(it.can&&it.head.tagName==='BUTTON')it.head.setAttribute('aria-expanded',String(on));if(it.act)it.act.tabIndex=on?0:-1;});}
    if(o.live&&exp){
      ol.addEventListener('click',e=>{const h=e.target.closest('.stp-tl-head');if(!h||h.hasAttribute('aria-disabled'))return;const i=+h.dataset.i;focusI=i;setOpen(open===i?-1:i);});
      ol.addEventListener('keydown',e=>{const h=e.target.closest('button.stp-tl-head');if(!h)return;const i=+h.dataset.i;let j=-1;
        if(e.key==='ArrowDown')j=Math.min(steps.length-1,i+1);else if(e.key==='ArrowUp')j=Math.max(0,i-1);else if(e.key==='Home')j=0;else if(e.key==='End')j=steps.length-1;
        if(j<0)return;e.preventDefault();focusI=j;items.forEach((it,k)=>{if(it.head.tagName==='BUTTON')it.head.tabIndex=k===j?0:-1;});items[j].head.focus();});}
    ol._open=setOpen;return ol;}
  /* 情境資料：訂單追蹤（timeline）。idx＝目前物流狀態（1 付款完成 … 4 已送達）；第 6 步「申請退貨」送達前是 disabled */
  const STP_TL_DATA=[
    {label:'訂單成立',time:'11/01 09:12',desc:'訂單 #A2026110187，共 2 件',box:[['商品','亞麻抱枕套 × 2'],['金額','NT$ 1,280']]},
    {label:'付款完成',time:'11/01 09:13',desc:'信用卡末四碼 4821',box:[['付款方式','信用卡一次付清'],['發票','電子發票 · 已開立']]},
    {label:'出貨準備',time:'11/02 16:40',eta:'預計 11/02',desc:'倉庫已揀貨、包裝完成',box:[['出貨倉','桃園大園倉'],['包裹','1 箱 · 0.8 kg']]},
    {label:'配送中',time:'11/04 08:05',eta:'預計 11/04',desc:'黑貓宅急便 · 預計 11/05 送達',box:[['追蹤碼','9012 3345 8871'],['目前位置','台中轉運中心']],action:'查看物流進度'},
    {label:'已送達',time:'11/05 14:22',eta:'預計 11/05',desc:'由本人簽收',box:[['簽收','陳美華 本人'],['地點','台中市西區公益路']]},
    {label:'申請退貨',desc:'送達後 7 天內可申請',descOn:'可申請到 11/12',box:[['期限','11/12 23:59 前'],['方式','超商寄回，免運費']],action:'申請退貨'}];
  function stpTlSteps(idx){const last=STP_TL_DATA.length-1;return STP_TL_DATA.map((s,i)=>{const r=Object.assign({},s);
    if(i===last){const on=idx>=4;r.state=on?'todo':'disabled';r.openable=on;if(on)r.desc=s.descOn;}
    else r.state=i<idx?'done':i===idx?'current':'todo';return r;});}

  /* 互動預覽：classic（沿用原本上一步／下一步）、compact（結帳；可示範付款失敗）、timeline（訂單追蹤；推進物流狀態） */
  function stpLiveClassic(st){
    const wrap=ce('div','stp-live-wrap');
    const stage=ce('div','stp-live-stage');
    function draw(){
      stage.innerHTML='';
      const steps=STP_LIVE_STEPS.map((s,i)=>({
        label:s.label,icon:s.icon,
        description:st.description?s.description:null,
        state:i<st.idx?'done':(i===st.idx?'current':'todo')
      }));
      stage.appendChild(stpStepper(st.orientation,st.variant,steps));
    }
    const ctl=ce('div','stp-live-ctl');
    const prev=ce('button','btn v-outline i-secondary sz-s');prev.textContent='上一步';
    const next=ce('button','btn v-solid i-primary sz-s');next.textContent='下一步';
    function syncBtns(){prev.disabled=st.idx<=0;next.disabled=st.idx>=STP_LIVE_STEPS.length-1;}
    /* Motion v1：前進時依因果順序——剛完成的連接線先填滿 → 節點變色、打勾 → 下一步節點微彈 */
    function animStep(fw){const nodes=stage.querySelectorAll('.stp-node'),conns=stage.querySelectorAll('.stp-conn,.stp-vconn');
      if(fw){if(conns[st.idx-1])conns[st.idx-1].classList.add('stp-anim');if(nodes[st.idx-1])nodes[st.idx-1].classList.add('stp-anim-done');}
      if(nodes[st.idx])nodes[st.idx].classList.add(fw?'stp-anim-cur':'stp-anim-back');}
    prev.onclick=()=>{if(st.idx>0){st.idx--;draw();animStep(false);syncBtns();}};
    next.onclick=()=>{if(st.idx<STP_LIVE_STEPS.length-1){st.idx++;draw();animStep(true);syncBtns();}};
    ctl.append(prev,next);
    wrap.append(stage,ctl);
    draw();syncBtns();
    return wrap;}
  function stpLiveCompact(st){
    const N=STP_CMP_STEPS.length,ERR_AT=2;
    if(st.cIdx==null)st.cIdx=2;if(st.cErr==null)st.cErr=false;
    const wrap=ce('div','stp-cmp-demo');
    const err=()=>st.cErr&&st.cIdx===ERR_AT;
    const bar=stpCompact(STP_CMP_STEPS.map((l,i)=>({label:l,state:stpCmpStates(st.cIdx,err())[i]})),{live:true,count:st.count,label:'結帳進度',onPick:i=>go(i)});
    const al=alEl('soft','error',{title:false});al.querySelector('.al-desc').textContent=STP_CMP_ERR;
    const foot=ce('div','stp-cmp-foot');const note=ce('span','stp-cmp-note');const btns=ce('div','stp-cmp-btns');
    const prev=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});prev.innerHTML=STP_IC_CARET_L+'<span>上一步</span>';
    const next=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:true});
    btns.append(prev,next);foot.append(note,btns);
    const demo=ce('div','stp-demo');demo.innerHTML='<span class="stp-demo-lab">示範</span>';
    const sg=sgmEl('soft','s',{items:['正常','付款失敗'],active:st.cErr?1:0,live:true,label:'示範狀態',onChange:i=>{st.cErr=i===1;if(st.cErr&&st.cIdx!==ERR_AT)st.cIdx=ERR_AT;sync(-1);}});
    const hint=ce('span');hint.textContent='聚焦進度條後可用 ← → 移動，Enter 回到已完成的步驟';demo.append(sg,hint);
    wrap.append(bar,al,foot,demo);
    function sync(justDone){const e=err();bar._set(stpCmpStates(st.cIdx,e),justDone);al.style.display=e?'':'none';
      note.textContent=e?'修正付款資料後才能繼續':st.cIdx===N-1?'訂單已成立，確認信已寄出':'已完成的步驟可以點回去修改';
      prev.disabled=st.cIdx===0;next.disabled=st.cIdx===N-1||e;
      next.innerHTML=`<span>${st.cIdx===N-2?'送出訂單':'下一步'}</span>${IC_CARET_RIGHT}`;}
    function go(n){if(n<0||n>=N||n===st.cIdx)return;const jd=n>st.cIdx?st.cIdx:-1;st.cIdx=n;sync(jd);}
    prev.onclick=()=>go(st.cIdx-1);next.onclick=()=>go(st.cIdx+1);
    sync(-1);return wrap;}
  function stpLiveTimeline(st){
    if(st.tIdx==null)st.tIdx=3;
    const wrap=ce('div','stp-tl-demo');let tl=null;
    const ctl=ce('div','stp-demo');ctl.innerHTML='<span class="stp-demo-lab">示範</span>';
    const prev=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});prev.querySelector('span').textContent='上一個狀態';
    const next=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:true});next.querySelector('span').textContent='推進物流狀態';
    const hint=ce('span');hint.textContent='↑ ↓ 在步驟間移動，Enter 展開明細';ctl.append(prev,next,hint);
    function draw(fw){const n=stpTimeline(stpTlSteps(st.tIdx),{live:true,desc:st.description,time:st.time,expandable:st.expandable,open:fw==null?st.tIdx:-1,label:'訂單進度'});
      if(tl)tl.replaceWith(n);else wrap.insertBefore(n,ctl);tl=n;
      prev.disabled=st.tIdx<=1;next.disabled=st.tIdx>=4;
      if(fw!=null){const nodes=tl.querySelectorAll('.stp-node'),conns=tl.querySelectorAll('.stp-vconn');   // 沿用 classic 的 Motion：連接線填色 → 節點打勾 → 目前節點微彈
        if(fw){if(conns[st.tIdx-1])conns[st.tIdx-1].classList.add('stp-anim');if(nodes[st.tIdx-1])nodes[st.tIdx-1].classList.add('stp-anim-done');}
        if(nodes[st.tIdx])nodes[st.tIdx].classList.add(fw?'stp-anim-cur':'stp-anim-back');
        const t=tl;requestAnimationFrame(()=>requestAnimationFrame(()=>t._open(st.tIdx)));}}  // 新的目前步驟以 Collapse 動態展開
    prev.onclick=()=>{if(st.tIdx>1){st.tIdx--;draw(false);}};next.onclick=()=>{if(st.tIdx<4){st.tIdx++;draw(true);}};
    wrap.appendChild(ctl);draw();return wrap;}

  function buildStep(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Step',title:'Step 步驟指示器',
      lede:'呈現多步驟流程的進度。<b>type</b> 分三型：<b>classic 經典</b>（節點＋連接線，橫向或縱向；網站「開新專案」流程用這型）、<b>compact 精簡進度型</b>（一步一段進度條＋「步驟 n / m」，只佔一行高，適合結帳、短表單）、<b>timeline 直式時間軸型</b>（每步有說明與時間、可展開明細，適合訂單追蹤、審核紀錄）。單步狀態分 <b>done 已完成</b>、<b>current 進行中</b>、<b>todo 待處理</b>、<b>error 錯誤</b>、<b>disabled 停用</b>。',
      specRows:[['axes','<code>type × orientation × variant</code>'],['formula','<code>classic 2 × 3 ＋ compact 1 ＋ timeline 1 = 8</code>'],['state','<code>done · current · todo · error · disabled</code>'],['token-policy','<code>semantic.*.stepper.*</code>']]});
    const spec=DIAL_SPECS.step,axes=spec.axes, zh=spec.zh, active=CHOICE.step.active; // 接中央 store
    const ORIN={horizontal:['水平','horizontal'],vertical:['垂直','vertical']};
    const VARN={numbered:['編號','numbered'],dotted:['圓點','dotted'],icon:['圖示','icon']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const ts=axes.type.filter(v=>active.type.has(v));
      const oris=axes.orientation.filter(v=>active.orientation.has(v));
      const vas=axes.variant.filter(v=>active.variant.has(v));
      if(ts.includes('classic'))p.appendChild(matrixPanel({badge:'type · classic',name:'Classic 經典：Orientation × Variant（每格為 4 步流程；步1 done、步2 current、步3–4 todo）',
        rows:oris,cols:vas,
        rowLab:o=>labHTML(ORIN[o][0],ORIN[o][1]),
        colLab:v=>labHTML(VARN[v][0],VARN[v][1]),
        cell:(o,v)=>stpStepper(o,v,stpMxSteps()),mincol:320}));
      if(ts.includes('compact'))p.appendChild(matrixPanel({badge:'type · compact',name:'Compact 精簡進度型（結帳 5 步；固定水平、無節點樣式）',desc:'右欄示意目前步驟為 error 時的樣子（單步 state，不是另一個 variant）',
        rows:['horizontal'],cols:['current','error'],
        rowLab:o=>labHTML(ORIN[o][0],ORIN[o][1]),
        colLab:s=>labHTML(s==='current'?'目前步驟 進行中':'目前步驟 錯誤',s),
        cell:(o,s)=>stpCompact(STP_CMP_STEPS.map((l,i)=>({label:l,state:stpCmpStates(2,s==='error')[i]}))),mincol:360}));
      if(ts.includes('timeline'))p.appendChild(matrixPanel({badge:'type · timeline',name:'Timeline 直式時間軸型（訂單追蹤 6 步；固定垂直、目前步驟展開明細）',desc:'右欄為送達後：最後一步「申請退貨」從 disabled 轉為可展開',
        rows:['vertical'],cols:['shipping','delivered'],
        rowLab:o=>labHTML(ORIN[o][0],ORIN[o][1]),
        colLab:s=>labHTML(s==='shipping'?'配送中':'已送達',s),
        cell:(o,s)=>{const i=s==='shipping'?3:4;return stpTimeline(stpTlSteps(i),{open:i});},mincol:320}));}
    mountDial(body,{axes,zh,active,when:spec.when,onRender:renderM});
    const sec=section(body,'Type × Orientation × Variant 矩陣','三種 type 各一塊：classic 列＝方向、欄＝節點樣式，已完成段落連接線轉為 accent；compact 與 timeline 方向固定、沒有節點樣式軸（orientation／variant 只作用於 classic）。');
    p=panelsIn(sec);renderM();

    const ss=section(body,'單一 Step 狀態','單一節點的五種狀態：已完成（打勾）、進行中（高亮外圈）、待處理（灰）、錯誤（紅・警示）、停用（淡化）。');
    const rd=ce('div','row-demo');
    [['done 已完成',()=>stpNode('done','numbered',{num:1})],
     ['current 進行中',()=>stpNode('current','numbered',{num:2})],
     ['todo 待處理',()=>stpNode('todo','numbered',{num:3})],
     ['error 錯誤',()=>stpNode('error','numbered',{num:4})],
     ['disabled 停用',()=>stpNode('disabled','numbered',{num:5})]
    ].forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    ss.appendChild(rd);

    usageSection(body,[['classic 經典','步驟名稱要一直看得到、步數固定（3–5 步）的設定流程，如開新專案、精靈。'],['compact 精簡進度型','結帳、短表單（3–6 步），版面只有一行高度可用；已完成的步驟可點回去改，錯誤時「下一步」停用並寫出原因。'],['timeline 直式時間軸型','訂單追蹤、新手引導、審核紀錄，需要看時間順序或每步明細時；之後才開放的動作（如退貨）先 disabled。']]);

    const sl=section(body,'互動預覽與程式碼','切換 type 看三種型式。classic：上一步／下一步；compact：點已完成的段落回去、← → 移動、示範付款失敗；timeline：推進物流狀態、點已完成或目前步驟展開明細（一次一個）、↑ ↓ 移動。');
    mountLive(sl,{gate:'step',
      initial:{type:'classic',orientation:'horizontal',variant:'numbered',description:true,count:true,time:true,expandable:true,idx:1},
      segs:[
        {key:'type',label:'Type',options:['classic','compact','timeline'],labels:['經典','精簡進度','時間軸']},
        {key:'orientation',label:'Orientation（classic）',options:['horizontal','vertical'],labels:['水平','垂直']},
        {key:'variant',label:'Variant（classic）',options:['numbered','dotted','icon'],labels:['編號','圓點','圖示']},
      ],
      bools:[{key:'description',label:'description 每步說明'},{key:'count',label:'count 步驟 n / m（compact）'},{key:'time',label:'time 時間（timeline）'},{key:'expandable',label:'expandable 可展開（timeline）'}],
      boolLabel:'Content',
      render:st=>st.type==='compact'?stpLiveCompact(st):st.type==='timeline'?stpLiveTimeline(st):stpLiveClassic(st),
      note:'classic：current 表示目前所在步驟（accent 外圈），點「下一步」後前一步變 done、連接線轉 accent。compact：進度條取用 progress、錯誤說明取用 alert、操作鈕取用 button。timeline：節點與連接線沿用 classic、展開明細取用 collapse。orientation／variant 只作用於 classic。'
    });
  }

