  /* ==================== TPL:v1 Template 範本 · AI 對話 ====================
     只負責排版與流程，畫面全部由 AI Chat 元件與既有原子組成——元件或 token 一改，範本跟著變。 */
  /* 專案資料夾（2026-11-10）：側欄最上方，用 Menu 元件（vertical＋groups＋nested＋icon）；點資料夾展開收合，裡面是該專案的對話 */
  /* PI 預掃：PI('folder-open') PI('folder-plus') */
  const TAC_PROJ=[['旅遊規劃',['京都五日自由行','台東親子露營清單']],['工作',['Q4 產品路線圖','客訴回覆範本','新人到職手冊']]];
  const TAC_HIST=[['今天',['台南週末美食行程','請假信範本']],['昨天',['季報重點摘要','會議記錄整理']],['過去 7 天',['Python 讀取 CSV','婚禮致詞草稿','健身菜單建議']]];
  const TAC_Q='幫我規劃週末兩天的台南美食行程';
  const TAC_R2=[{p:'沒問題，調整成適合帶小孩的版本：'},
    {ul:[{b:'第一天',t:'：上午逛台南市美術館二館，中午吃牛肉湯，下午去安平樹屋。'},{b:'第二天',t:'：早上到十鼓文化村，午餐選有兒童座椅的餐廳，傍晚去漁光島玩沙。'}]},
    {p:'室內、戶外的點交錯安排，天氣不好也有備案。'}];
  function tacApp(dev,scn){
    const mobile=dev==='mobile';const app=ce('div',`tac dv-${dev}`);const st={timer:0,cur:null,turns:0};
    /* 側欄：對話紀錄（手機收進抽屜） */
    const side=ce('aside','tac-side');side.setAttribute('aria-label','對話紀錄');
    const top=ce('div','tac-side-top');const br=ce('div','tac-brand');br.appendChild(aiavEl('idle','s'));const bn=ce('span');bn.textContent='cdl AI';br.appendChild(bn);top.appendChild(br);
    const closeD=aicIconBtn('x','關閉對話紀錄');if(mobile)top.appendChild(closeD);side.appendChild(top);
    const nb=aicBtn('新對話',{size:'m',icon:'square-pen'});nb.classList.add('tac-new');side.appendChild(nb);
    const hist=ce('nav','tac-hist');hist.setAttribute('aria-label','最近的對話');
    const proj=mnBar('vertical','s',{label:'專案',icon:true,activeIndex:-1,focusable:true,sections:[{title:'專案',items:TAC_PROJ.map(([n,ch],i)=>({label:n,icon:PI('folder'),open:i===0,children:ch}))}]});
    proj.classList.add('tac-proj');
    const np=aicIconBtn('folder-plus','新增專案',{size:'s'});np.classList.add('tac-proj-add');proj.querySelector('.mn-gt').appendChild(np);
    const pickChat=(t,el)=>{hist.querySelectorAll('.tac-hist-i').forEach(x=>{x.classList.toggle('is-on',x===el);x.toggleAttribute('aria-current',x===el);});if(!proj.contains(el))proj._setActive(null);title.textContent=t;setScn('conversation',true);closeDrawer();};
    proj._nodes.forEach(n=>n.addEventListener('click',()=>pickChat(n.querySelector('.mn-label').textContent,n)));
    /* 資料夾圖示跟著開合換 folder／folder-open */
    proj.querySelectorAll('.mn-item--parent').forEach(p=>{const ic=p.querySelector('.mn-ico');const sync=()=>{ic.innerHTML=PI(p.getAttribute('aria-expanded')==='true'?'folder-open':'folder');};sync();
      new MutationObserver(sync).observe(p,{attributes:true,attributeFilter:['aria-expanded']});});
    hist.appendChild(proj);
    TAC_HIST.forEach(([g,items],gi)=>{const h=ce('div','tac-hist-g');h.textContent=g;hist.appendChild(h);
      items.forEach((t,i)=>{const b=ce('button','tac-hist-i');b.type='button';b.textContent=t;if(gi===0&&i===0){b.classList.add('is-on');b.setAttribute('aria-current','page');}
        b.onclick=()=>pickChat(b.textContent,b);hist.appendChild(b);});});
    side.appendChild(hist);
    const us=ce('div','tac-user');us.appendChild(avtEl('s','circle','image',{name:'林語晨'}));const un=ce('span');un.textContent='林語晨';us.appendChild(un);side.appendChild(us);
    /* 主區 */
    const main=ce('div','tac-main');const head=ce('div','tac-head');
    const menuB=aicIconBtn('menu','開啟對話紀錄');const title=ce('div','tac-title');title.textContent=TAC_HIST[0][1][0];
    const model=aicBtn('cdl-1',{variant:'text'});model.insertAdjacentHTML('beforeend',PI('chevron-down'));model.setAttribute('aria-label','選擇模型：cdl-1');
    const newB=aicIconBtn('square-pen','新對話');
    if(mobile)head.append(menuB,title,newB);else head.append(title,model,aicIconBtn('share-2','分享對話'));
    const welcome=ce('div','tac-welcome');
    const feed=ce('div','tac-feed');feed.setAttribute('role','log');feed.setAttribute('aria-label','對話內容');const col=ce('div','tac-col');feed.appendChild(col);
    const foot=ce('div','tac-foot');const fcol=ce('div','tac-col');foot.appendChild(fcol);
    const cmp=aicCmpEl(mobile?'compact':'standard','empty',{live:true});const disc=ce('div','tac-disc');disc.textContent='AI 可能會出錯，重要資訊請再次確認。';fcol.append(cmp,disc);
    const down=aicIconBtn('arrow-down','捲到最新訊息',{variant:'outline'});down.classList.add('tac-down');down.onclick=()=>{feed.scrollTop=feed.scrollHeight;};
    feed.addEventListener('scroll',()=>down.classList.toggle('is-on',feed.scrollHeight-feed.scrollTop-feed.clientHeight>80));
    main.append(head,welcome,feed,down,foot);const scrim=ce('div','tac-scrim');app.append(side,scrim,main);
    /* 手機抽屜 */
    const openDrawer=()=>{app.classList.add('is-drawer');setTimeout(()=>(hist.querySelector('.is-on')||nb).focus(),60);};
    function closeDrawer(){if(!app.classList.contains('is-drawer'))return;app.classList.remove('is-drawer');menuB.focus();}
    menuB.onclick=openDrawer;scrim.onclick=closeDrawer;closeD.onclick=closeDrawer;app.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});
    /* 流程：送出 → 思考 → 串流 → 完成；生成中送出鍵＝停止 */
    const ta=cmp._ta,send=cmp._send;
    const setGen=on=>{const was=send.classList.contains('is-stop');send.classList.toggle('is-stop',on);if(was!==on)aicSwap(send,on?'square':'arrow-up');const l=on?'停止生成':'送出';send.setAttribute('aria-label',l);send.title=l;
      cmp.classList.toggle('st-generating',on);send.disabled=on?false:!ta.value.trim();};
    const nearEnd=()=>feed.scrollHeight-feed.scrollTop-feed.clientHeight<80;const toEnd=()=>{feed.scrollTop=feed.scrollHeight;};
    const showFeed=()=>{welcome.hidden=true;feed.hidden=false;};
    const nextBlocks=()=>st.turns>0?TAC_R2:AIC_REPLY;
    function doneMsg(bl,sources){return aicMsgEl('assistant','done',{blocks:bl,sources,onRegen:regen});}
    function finish(state){clearTimeout(st.timer);const c=st.cur;st.cur=null;if(!c)return;
      const m=aicMsgEl('assistant',state,{blocks:c.tb,n:c.n,sources:state==='done'&&c.sources,onRegen:regen});c.m.replaceWith(m);st.last=c.src;if(state==='done')st.turns++;setGen(false);}
    function stream(src,sources){const tb=aicTr(src);const m=aicMsgEl('assistant','pending',{blocks:tb,n:0});col.appendChild(m);const tx=m.querySelector('.aic-text');
      const total=aicLen(tb),chunk=Math.max(2,Math.ceil(total/90));st.cur={m,tb,n:0,src,sources};
      const step=()=>{const end=nearEnd();st.cur.n=Math.min(total,st.cur.n+chunk);aicBlocks(tx,tb,st.cur.n,chunk);if(end)toEnd();
        if(st.cur.n>=total){finish('done');return;}st.timer=setTimeout(step,40);};step();}
    function aiTurn(src,sources){setGen(true);const th=aicThinkEl(sources?'searching':'thinking','active');col.appendChild(th);toEnd();
      st.cur={think:th,m:th,tb:aicTr(src),n:0,src,sources};
      st.timer=setTimeout(()=>{th.remove();st.cur=null;stream(src,sources);},sources?1600:1100);}
    function stop(){if(!st.cur)return;clearTimeout(st.timer);
      if(st.cur.think){st.cur.think.remove();const c=st.cur;st.cur={m:ce('div'),tb:c.tb,n:0,src:c.src};col.appendChild(st.cur.m);}finish('interrupted');}
    function regen(){if(st.cur)return;const ms=col.querySelectorAll('.aic-msg.r-assistant');const last=ms[ms.length-1];if(last)last.remove();if(st.turns>0&&last&&last.classList.contains('st-done'))st.turns--;aiTurn(st.last||AIC_REPLY);}
    function sendText(text){if(!text)return;showFeed();const fs=cmp._files.slice();col.appendChild(aicMsgEl('user','done',{text,files:fs.length?fs:null}));cmp._clearFiles();ta.value='';ta.dispatchEvent(new Event('input'));
      aiTurn(nextBlocks(),cmp._has('search'));}
    send.addEventListener('click',()=>{if(send.classList.contains('is-stop')){stop();return;}sendText(ta.value.trim());});
    const sg=aicSgEl(mobile?'chip':'card',{onPick:s=>sendText(aicT(s.d))});
    const hi=ce('h3');hi.textContent='嗨，今天想做什麼？';welcome.append(aiavEl('idle','l'),hi);const wc=ce('div','tac-col');wc.appendChild(sg);welcome.appendChild(wc);
    const newChat=()=>{hist.querySelectorAll('.tac-hist-i').forEach(x=>{x.classList.remove('is-on');x.removeAttribute('aria-current');});proj._setActive(null);title.textContent='新對話';setScn('welcome');closeDrawer();ta.focus();};
    nb.onclick=newChat;newB.onclick=newChat;
    /* 情境 */
    function setScn(s,keepTitle){clearTimeout(st.timer);st.cur=null;st.turns=0;col.innerHTML='';setGen(false);
      if(s==='welcome'){welcome.hidden=false;feed.hidden=true;if(!keepTitle){title.textContent='新對話';hist.querySelectorAll('.tac-hist-i').forEach(x=>{x.classList.remove('is-on');x.removeAttribute('aria-current');});}return;}
      showFeed();col.appendChild(aicMsgEl('user','done',{text:TAC_Q}));
      if(s==='conversation'){col.appendChild(doneMsg(aicTr(AIC_REPLY),true));st.turns=1;st.last=AIC_REPLY;}
      else if(s==='thinking'){setGen(true);const th=aicThinkEl('thinking','active');col.appendChild(th);st.cur={think:th,m:th,tb:aicTr(AIC_REPLY),n:0,src:AIC_REPLY};}
      else if(s==='streaming'){setGen(true);const tb=aicTr(AIC_REPLY),n=Math.round(aicLen(tb)*.45);const m=aicMsgEl('assistant','pending',{blocks:tb,n});col.appendChild(m);st.cur={m,tb,n,src:AIC_REPLY};}
      else if(s==='error'){const e=aicErrEl('server',{live:true,onAction:()=>{e.remove();aiTurn(AIC_REPLY);}});col.appendChild(e);}
      requestAnimationFrame(toEnd);}
    setScn(scn);return app;}
  function buildTplAiChat(view){
    const body=viewScaffold(view,{eyebrow:'Template · AI Chat',title:'AI Chat 對話',
      lede:'用 AI Chat 元件與既有原子組成的完整對話介面：<b>電腦版</b>左側是對話紀錄，<b>手機版</b>紀錄收進抽屜。可以直接打字試玩：思考 → 逐字回覆 → 停止／重新產生 → 讚、倒讚回饋。範本只負責排版，元件或 token 一改，這頁跟著更新。',
      specRows:[['type','<code>template</code>'],['devices','desktop 1080 ／ mobile 375'],['scenarios','歡迎 · 對話中 · 思考中 · 串流中 · 錯誤'],['data','通用假資料']]});
    const sec=section(body,'互動範本','切換裝置與情境；在輸入框打字、按 Enter 送出。從「＋」開啟網頁搜尋，會先顯示搜尋狀態。');
    let dev=tplDefDev(),scn='conversation';const bar=ce('div','tpl-bar bento-card bento-ctl');const stage=ce('div','tpl-stage');
    const seg=(label,items,act,on)=>{const c=ce('div','ctl');const l=ce('span','lab');l.textContent=label;
      const g=items.length>4?ddField('outline',{size:'s',options:items.map(x=>({value:x[0],label:x[1]})),value:act,onChange:v=>on(v)})   /* 選項多：改下拉，左欄放得下 */
        :sgmEl('soft','s',{items:items.map(x=>x[1]),active:items.findIndex(x=>x[0]===act),label,live:true,full:true,onChange:i=>on(items[i][0])});c.append(l,g);return c;};
    const draw=()=>{stage.innerHTML='';tplFit(stage,tacApp(dev,scn));};
    bar.append(seg('裝置',[['desktop','電腦'],['mobile','手機']],dev,v=>{dev=v;draw();}),
      seg('情境',[['welcome','歡迎'],['conversation','對話中'],['thinking','思考中'],['streaming','串流中'],['error','錯誤']],scn,v=>{scn=v;draw();}));
    const lay=tplLay(bar,stage);sec.appendChild(lay);draw();
    const cs=section(body,'組成元件','點名稱前往該元件頁；範本裡沒有自己畫的元件。');const cl=ce('div','tpl-comp');
    TPL_COMPOSE['tpl-ai-chat'].forEach(id=>{const it=NAV.flatMap(g=>g.items).find(x=>x.id===id);const b=aicBtn(it?it.name:id);b.onclick=()=>renderView(id);cl.appendChild(b);});cs.appendChild(cl);
    usageSection(body,[['電腦版','對話紀錄常駐左側，主區最寬 720px，長回覆好讀。'],['手機版','紀錄收進抽屜，輸入列改精簡版；鍵盤彈出時送出鍵仍可見。'],['生成中','送出鍵變停止鍵；停止後保留已產生的內容並可重新產生。']]);}
  /* 範本預覽縮放：節點以原寬度排版，預覽區不夠寬時等比縮小（transform），外框高度跟著縮 */
  /* 範本版型：左控制卡｜拖曳把手（沿用 .bento-rz）｜預覽；寬度記在 localStorage */
  /* TPL-MDEV:v1 範本預設裝置：手機（≤767px，含裝置預覽的手機框）開範本頁直接看手機版，其他照舊電腦版 */
  function tplDefDev(){try{return matchMedia('(max-width:767px)').matches?'mobile':'desktop';}catch(e){return 'desktop';}}
  function tplLay(bar,stage){const lay=ce('div','tpl-lay');const rz=ce('div','bento-rz tpl-rz');rz.setAttribute('role','separator');rz.setAttribute('aria-orientation','vertical');rz.setAttribute('aria-label','調整控制區寬度');rz.tabIndex=0;
    let w=240;try{w=+localStorage.getItem('cdl-tpl-ctl')||240;}catch(e){}
    const set=v=>{w=Math.max(200,Math.min(400,Math.round(v)));lay.style.setProperty('--tpl-c1',w+'px');rz.setAttribute('aria-valuenow',w);try{localStorage.setItem('cdl-tpl-ctl',w);}catch(e){}};set(w);
    rz.addEventListener('pointerdown',e=>{e.preventDefault();rz.setPointerCapture(e.pointerId);rz.classList.add('is-drag');const x0=e.clientX,w0=w;
      const mv=ev=>set(w0+ev.clientX-x0);const up=()=>{rz.classList.remove('is-drag');rz.removeEventListener('pointermove',mv);rz.removeEventListener('pointerup',up);};rz.addEventListener('pointermove',mv);rz.addEventListener('pointerup',up);});
    rz.addEventListener('keydown',e=>{const d=e.key==='ArrowLeft'?-16:e.key==='ArrowRight'?16:0;if(d){e.preventDefault();set(w+d);}});
    lay.append(bar,rz,stage);return lay;}
  function tplFit(stage,node){const box=ce('div','tpl-fit');box.appendChild(node);stage.appendChild(box);
    const fit=()=>{if(!box.isConnected)return;node.style.transform='';const cs=getComputedStyle(stage);const avail=stage.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
      const w=node.offsetWidth,h=node.offsetHeight,k=Math.min(1,avail/w);node.style.transform=k<1?'scale('+k+')':'';box.style.width=(w*k)+'px';box.style.height=(h*k)+'px';};
    fit();requestAnimationFrame(fit);if(window.ResizeObserver){const ro=new ResizeObserver(()=>{if(!box.isConnected){ro.disconnect();return;}fit();});ro.observe(stage);}return box;}
  const TPL_COMPOSE={'tpl-ai-chat':['menu','ai-avatar','chat-message','chat-thinking','chat-composer','prompt-suggestion','chat-error','button','tag','popover','alert','avatar','segmented','loader']};
  /* PI 預掃（build-pulso-icons 只認字面 PI('key')）：PI('copy') PI('check') PI('thumbs-up') PI('thumbs-down') PI('refresh-cw') PI('share-2') PI('arrow-up') PI('square') PI('plus') PI('mic') PI('globe') PI('chevron-down') PI('chevron-right') PI('menu') PI('square-pen') PI('file-text') PI('link') PI('x') PI('arrow-down') PI('map-pin') PI('mail') PI('code-xml') PI('circle-alert') PI('paperclip') PI('image') PI('lightbulb') PI('telescope') PI('palette') */
  /* ==================== TPL:v2 Template 範本 · 後台（2026-11-10）====================
     共用框架 tadApp(page, device, scenario)：側欄（Menu）、頂欄（平板／手機）、頁首、內容欄寬 960。
     五個範本頁＝同一個框架的不同起始頁：儀表板、統計報表、資料列表、詳情頁、建立表單；側欄可以直接切換。
     資訊卡不整張套用組好的牌卡，改用較小的原子（文字、Tag、Button、Dropdown、Table、Descriptions）照參考稿排版。 */
  /* PI 預掃：PI('layout-dashboard') PI('receipt-text') PI('users') PI('package') PI('settings') PI('download') PI('printer') PI('ellipsis') PI('arrow-left') PI('bell') PI('info') PI('menu') PI('chevron-left') PI('chevron-right') PI('pencil') PI('x') PI('search') PI('arrow-right') PI('truck') PI('arrow-up-narrow-wide') PI('arrow-down-wide-narrow') */
  const TAD_NAV=[['營運',[['dashboard','儀表板','layout-dashboard'],['list','訂單','receipt-text']]],['資料管理',[['customers','客戶','users'],['products','商品','package']]],['系統',[['settings','設定','settings']]]];
  const TAD_NAVOF={dashboard:'dashboard',report:'dashboard',list:'list',detail:'list',form:'list'};
  const tadBtn=(text,o)=>{o=o||{};const b=mkBtn({variant:o.variant||'outline',intent:o.intent||'secondary',size:o.size||'s',iconOnly:!!o.iconOnly,isLive:true});b.type='button';
    b.innerHTML=(o.icon?PI(o.icon):'')+(o.iconOnly?'':'<span></span>')+(o.trail?PI(o.trail):'');if(!o.iconOnly)b.querySelector('span').textContent=text;else{b.setAttribute('aria-label',text);b.title=text;}
    if(o.icon&&!o.iconOnly&&(o.variant||'outline')==='outline'){b.classList.add('tad-sec');b.title=text;}return b;};   /* 次要（outline＋圖示）按鈕：窄版只留圖示 */
  const tadCard=(title,o)=>{o=o||{};const c=ce('section','tad-card'+(o.flush?' is-flush':''));if(title){const h=ce('div','tad-card-h');const t=ce('h3');t.textContent=title;h.appendChild(t);if(o.acts)o.acts.forEach(a=>h.appendChild(a));c.appendChild(h);}return c;};
  const tadTag=(text,intent,size)=>{const t=tagEl('soft',intent||'neutral','default',null,size);t.querySelector('span').textContent=text;return t;};
  const TAD_ST={doing:['處理中','info'],late:['逾期','danger'],done:['已完成','success'],ship:['已出貨','brand2'],cancel:['已取消','neutral']};
  const tadStatus=(k,size)=>tadTag(TAD_ST[k][0],TAD_ST[k][1],size);
  /* 頁首：麵包屑（Breadcrumb）＋標題／筆數／副標＋右側動作（Button） */
  function tadHead(o){const h=ce('div','tad-head');
    if(o.crumbs){const bc=bcTrail(o.crumbs);const first=bc.querySelector('.bc-item');if(first&&o.onCrumb){first.setAttribute('role','link');first.tabIndex=0;first.style.cursor='pointer';
      first.onclick=o.onCrumb;first.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();o.onCrumb();}};}h.appendChild(bc);}
    const row=ce('div','tad-head-row');const t=ce('div','tad-title');if(o.back)t.appendChild(o.back);const h2=ce('h2');h2.textContent=o.title;t.appendChild(h2);
    if(o.count){const c=ce('span','tad-count');c.textContent=o.count;t.appendChild(c);}
    const tc=ce('div','tad-tcol');tc.appendChild(t);if(o.sub){const s=ce('div','tad-subtitle');s.textContent=o.sub;tc.appendChild(s);}row.appendChild(tc);   /* 副標緊貼標題，窄版動作換行時不會被隔開 */
    if(o.acts&&o.acts.length){const a=ce('div','tad-acts');o.acts.forEach(x=>a.appendChild(x));row.appendChild(a);}h.appendChild(row);return h;}
  /* 標籤：值（Descriptions 的 dl 結構，只換列） */
  function tadKV(rows){const dl=document.createElement('dl');dl.className='dsc dsc-horizontal';dl.style.setProperty('--dsc-cols',1);
    rows.forEach(([k,v])=>{const it=ce('div','dsc-it');const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');if(typeof v==='string')dd.textContent=v;else dd.appendChild(v);it.append(dt,dd);dl.appendChild(it);});return dl;}
  /* 狀態畫面：載入中（Skeleton）、空資料／錯誤（Empty） */
  function tadSkeleton(){const w=ce('div','tad-skel');const k=tadCard();const kr=ce('div','tad-kpis');for(let i=0;i<4;i++){const c=ce('div','tad-kpi');c.appendChild(skelEl('text','s'));c.appendChild(skelEl('rectangle','s'));kr.appendChild(c);}k.style.padding='0';k.appendChild(kr);
    const a=tadCard();a.appendChild(skelEl('text','m'));for(let i=0;i<3;i++)a.appendChild(skelCard());const b=tadCard();b.appendChild(skelEl('text','m'));const big=skelEl('rectangle','l');big.classList.add('tad-sk-fill');b.appendChild(big);
    w.append(k,a,b);w.setAttribute('aria-busy','true');w.setAttribute('aria-label','載入中');return w;}
  function tadEmpty(kind,t,d,a,onA){const e=empEl(kind,'m',{live:true,secondary:false,primary:!!a});e.querySelector('.emp-title').textContent=t;e.querySelector('.emp-desc').textContent=d;
    const b=e.querySelector('.emp-actions .btn');if(b&&a){b.querySelector('span').textContent=a;if(onA)b.onclick=onA;}const w=ce('div','tad-state');w.appendChild(e);return w;}
  function tadError(retry){const w=ce('div','tad-skel');const al=alEl('soft','error',{action:true,live:true});al.querySelector('.al-title').textContent='資料載入失敗';
    al.querySelector('.al-desc').textContent='伺服器暫時沒有回應，資料可能不是最新的。';const b=al.querySelector('.al-actions .btn');b.querySelector('span').textContent='重新載入';b.onclick=retry;
    const c=tadCard();c.appendChild(tadEmpty('error','無法顯示這個頁面','請稍後再試；問題持續的話，請聯絡系統管理員。','重新載入',retry));w.append(al,c);return w;}

  /* 訂單假資料：沿用 Table Toolbar 的通用訂單（TTB_DATA），補上狀態對應 */
  const tadRows=()=>TTB_DATA.map(r=>({id:r.id,name:r.name,status:r.status,assignee:r.assignee,amount:r.amount,date:r.date}));
  const TAD_COLS=[{key:'id',lab:'訂單編號',sortable:true,cls:'tbl-mut'},{key:'name',lab:'客戶',sortable:true,cls:'tbl-name'},{key:'status',lab:'狀態',sortable:true},
    {key:'assignee',lab:'負責人',sortable:true},{key:'amount',lab:'金額',sortable:true,cls:'tbl-num'},{key:'date',lab:'到期日',sortable:true,cls:'tbl-mut'}];
  /* 表格：取用 Table 原子；狀態欄換成本範本的 Tag、列可點進詳情 */
  function tadTable(rows,cols,o){o=o||{};const w=ce('div','tad-tbl');
    const t=tblTable('plain',o.density||'comfortable',{data:rows,cols,sortable:true,live:true,interactive:false,sortKey:o.sortKey,sortAsc:o.sortAsc,onSort:o.onSort});
    const deco=()=>{t.querySelectorAll('tbody .tbl-row').forEach(tr=>{const r=rows[+tr.dataset.flip];if(!r)return;
      const ci=cols.findIndex(c=>c.key==='status');if(ci>=0){const td=tr.children[ci];td.innerHTML='';td.appendChild(tadStatus(r.status));}
      if(o.onRow){tr.classList.add('is-link');tr.tabIndex=0;tr.setAttribute('aria-label','查看訂單 '+r.id);tr.onclick=()=>o.onRow(r);tr.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();o.onRow(r);}};}});};
    deco();new MutationObserver(()=>{if(!t._d){t._d=1;requestAnimationFrame(()=>{t._d=0;deco();});}}).observe(t.querySelector('tbody'),{childList:true});
    w.appendChild(t);return w;}

  function tadApp(page,dev,scn,o){o=o||{};const app=ce('div',`tad dv-${dev}`);const st={page:page==='report'?'dashboard':page,scn,tab:page==='report'?1:0,
      list:{q:'',status:'',owner:'',sort:'date',asc:false,page:1,per:10},year:2026,todo:''};
    /* 側欄：Logo＋Menu（每組一條 mnBar，換成 PulsoIcon）＋使用者 */
    const side=ce('aside','tad-side');side.setAttribute('aria-label','主選單');
    const br=ce('div','tad-brand');br.appendChild(hdrLogo());const bt=ce('div','tad-brand-t');bt.innerHTML='<b></b><span></span>';bt.querySelector('b').textContent='營運後台';bt.querySelector('span').textContent='台北門市';br.appendChild(bt);
    const closeD=tadBtn('關閉選單',{variant:'text',iconOnly:true,icon:'x'});if(dev!=='desktop')br.appendChild(closeD);side.appendChild(br);
    const nav=ce('nav','tad-nav');const navItems={};   /* 側欄＝Menu 元件（vertical＋groups＋icon） */
    const bar=mnBar('vertical','m',{sections:TAD_NAV.map(([g,items])=>({title:g,items:items.map(([k,l,ic])=>({key:k,label:l,icon:PI(ic)}))})),activeIndex:-1,icon:true});
    bar.querySelectorAll('.mn-item[data-key]').forEach(it=>{const k=it.dataset.key;navItems[k]=it;it.setAttribute('role','link');it.addEventListener('click',()=>{go(k);closeDrawer();});});
    nav.appendChild(bar);
    side.appendChild(nav);
    const us=ce('div','tad-user');us.appendChild(avtEl('s','circle','initials',{initials:'陳',name:'陳美華'}));const un=ce('span');un.textContent='陳美華';us.appendChild(un);us.appendChild(tadBtn('帳號選單',{variant:'text',iconOnly:true,icon:'ellipsis'}));side.appendChild(us);
    /* 主區：頂欄（平板／手機）＋可捲動內容 */
    const main=ce('div','tad-main');const top=ce('header','tad-top');const burger=tadBtn('開啟選單',{variant:'text',iconOnly:true,icon:'menu'});
    top.append(burger,hdrLogo(),ce('span','tad-sp'),tadBtn('通知',{variant:'text',iconOnly:true,icon:'bell'}),avtEl('s','circle','initials',{initials:'陳',name:'陳美華'}));
    const scroll=ce('div','tad-scroll');main.append(top,scroll);const scrim=ce('div','tad-scrim');app.append(side,scrim,main);
    const openDrawer=()=>{app.classList.add('is-drawer');setTimeout(()=>(nav.querySelector('.mn-item--active')||closeD).focus(),60);};
    function closeDrawer(){if(!app.classList.contains('is-drawer'))return;app.classList.remove('is-drawer');burger.focus();}
    burger.onclick=openDrawer;closeD.onclick=closeDrawer;scrim.onclick=closeDrawer;app.addEventListener('keydown',e=>{if(e.key==='Escape'){const l=app.querySelector('.tad-layer');if(l){l._close();return;}closeDrawer();}});
    /* 浮層：確認對話框（Modal popup）、提示（Notification） */
    function confirmDlg(onOk){const l=ce('div','tad-layer');const card=mdlCard('popup',{live:true,icon:false});
      card.querySelector('.mdl-pop-title').textContent='建立這筆訂單？';const d=card.querySelector('.mdl-desc');if(d)d.textContent='建立後會通知倉庫備貨，並寄送訂單確認信給客戶。';
      const bs=[...card.querySelectorAll('.btn')];const ok=bs.find(b=>b.classList.contains('v-solid'))||bs[bs.length-1];const no=bs.find(b=>b!==ok);
      if(ok){ok.querySelector('span').textContent='建立訂單';ok.onclick=()=>{l.remove();onOk();};}if(no){no.querySelector('span').textContent='再檢查一下';no.onclick=()=>l._close();}
      l._close=()=>{l.remove();};l.onclick=e=>{if(e.target===l)l._close();};l.setAttribute('role','presentation');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
      l.appendChild(card);app.appendChild(l);setTimeout(()=>ok&&ok.focus(),30);}
    function toast(title,msg){app.querySelector('.tad-toast')?.remove();const t=ntEl('outline','success',{close:true});t.classList.add('tad-toast');t.querySelector('.nt-title').textContent=title;
      const m=t.querySelector('.nt-msg');if(m)m.textContent=msg;app.appendChild(t);setTimeout(()=>t.isConnected&&t.remove(),3200);}
    /* 頁面 */
    function render(){scroll.innerHTML='';app.querySelector('.tad-foot')?.remove();const pg=ce('div','tad-page');scroll.appendChild(pg);scroll.scrollTop=0;
      Object.entries(navItems).forEach(([k,it])=>{const on=k===(TAD_NAVOF[st.page]||st.page);it.classList.toggle('mn-item--active',on);on?it.setAttribute('aria-current','page'):it.removeAttribute('aria-current');});
      PAGES[st.page](pg);}
    function go(p){if(p==='report'){st.page='dashboard';st.tab=1;}else{st.page=p;if(p==='dashboard')st.tab=0;}render();}
    const retry=()=>{st.scn='normal';render();};
    const body=(pg,fill)=>{if(st.scn==='loading'){pg.appendChild(tadSkeleton());return;}if(st.scn==='error'){pg.appendChild(tadError(retry));return;}fill();};
    let dashTb=null;
    const PAGES={
      dashboard(pg){
        /* TAB-KEEP:v1 分頁列只建一次、重畫頁面時搬回同一條，點擊的果凍動態才不會被整頁重建吃掉 */
        const tabsRow=ce('div','tad-tabs');if(!dashTb){dashTb=tabBarLive('contained',{size:'s'});const t0=[...dashTb.querySelectorAll('.tabi')];t0[2].remove();
          t0[0].querySelector('span').textContent='營運摘要';t0[1].querySelector('span').textContent='統計報表';t0.slice(0,2).forEach((ti,i)=>ti.addEventListener('click',()=>{if(st.tab!==i){st.tab=i;render();}}));}
        const tb=dashTb;[...tb.querySelectorAll('.tabi')].forEach((ti,i)=>ti.classList.toggle('st-active',i===st.tab));
        tabsRow.appendChild(tb);const acts=ce('div','tad-acts');
        if(st.tab===1){ /* 年份切換：‹ 2026 年 ›＋下載 CSV（參考稿做法，取代 tab 式的期間切換） */
          const yr=ce('div','tad-year');const prev=tadBtn('上一年',{variant:'text',iconOnly:true,icon:'chevron-left'}),next=tadBtn('下一年',{variant:'text',iconOnly:true,icon:'chevron-right'});const lab=ce('span');lab.textContent=st.year+' 年';
          prev.disabled=st.year<=2024;next.disabled=st.year>=2026;prev.onclick=()=>{st.year--;render();};next.onclick=()=>{st.year++;render();};yr.append(prev,lab,next);
          const dl=tadBtn('下載 CSV',{icon:'download'});dl.onclick=()=>toast('已開始下載','訂單統計_'+st.year+'.csv 下載中。');acts.append(yr,dl);acts.classList.add('is-tools');}
        else{const nb=tadBtn('新增訂單',{variant:'solid',intent:'primary',icon:'plus'});nb.onclick=()=>go('form');acts.appendChild(nb);}
        tabsRow.appendChild(acts);pg.append(tadHead({title:'儀表板'}),tabsRow);
        body(pg,()=>st.tab===0?overview(pg):report(pg));},
      list(pg){const head=tadHead({title:'訂單',count:st.scn==='empty'?'0 筆':'128 筆',acts:[tadBtn('下載 CSV',{icon:'download'}),tadBtn('新增訂單',{variant:'solid',intent:'primary',icon:'plus'})]});
        const hb=head.querySelectorAll('.tad-acts .btn');hb[0].onclick=()=>toast('已開始匯出','訂單清單_2026-11.csv 下載中。');hb[1].onclick=()=>go('form');pg.appendChild(head);
        body(pg,()=>{if(st.scn==='empty'){const c=tadCard();c.appendChild(tadEmpty('first','還沒有訂單','建立第一筆訂單，或從電商平台匯入訂單資料。','新增訂單',()=>go('form')));pg.appendChild(c);return;}
          orderList(pg);});},
      detail(pg){detail(pg);},
      form(pg){pg.appendChild(tadHead({crumbs:['訂單','新增訂單'],onCrumb:()=>go('list'),title:'新增訂單'}));
        body(pg,()=>{const fld=(label,ctl,o)=>{o=o||{};const f=fldEl('vertical','default',{label,required:o.required,optional:o.optional,live:true});if(ctl){const c=f.querySelector('.fld-ctl');c.innerHTML='';c.appendChild(ctl);}
            if(o.full)f.classList.add('is-full');return f;};
          const live=(label,ph,o)=>{o=o||{};const f=fldEl('vertical','default',{label,placeholder:ph,required:o.required,optional:o.optional,live:true});if(o.full)f.classList.add('is-full');return f;};
          const c1=tadCard('客戶資訊');const f1=ce('div','tad-form');const nameF=live('客戶姓名','例：王小明',{required:true});nameF.dataset.k='name';f1.append(nameF,live('手機號碼','0912-345-678',{required:true}),live('電子郵件','name@example.com',{optional:true,full:true}));c1.appendChild(f1);
          const c2=tadCard('訂單內容');const f2=ce('div','tad-form');
          f2.append(fld('商品',ddField('outline',{options:['亞麻抱枕套（燕麥）','棉麻桌巾 120×180','手作陶杯組','香氛蠟燭禮盒'],searchable:true}),{required:true}),
            fld('數量',qtyEl('outline','m',{value:1,live:true})),fld('出貨日期',dpkLive('single')),fld('配送方式',ddField('outline',{options:['宅配','超商取貨','門市自取']})));c2.appendChild(f2);
          const c3=tadCard('付款與備註');const f3=ce('div','tad-form');
          f3.append(fld('付款方式',sgmEl('soft','m',{items:['信用卡','轉帳','貨到付款'],active:0,label:'付款方式',live:true}),{full:true}),fld('備註',tareaEl('default'),{optional:true,full:true}));c3.appendChild(f3);
          pg.append(c1,c2,c3);
          const foot=ce('div','tad-foot');const cancel=tadBtn('取消',{variant:'text'}),draft=tadBtn('儲存草稿'),ok=tadBtn('建立訂單',{variant:'solid',intent:'primary'});foot.append(cancel,draft,ok);main.appendChild(foot);
          cancel.onclick=()=>go('list');draft.onclick=()=>toast('已儲存草稿','可以在訂單列表的「草稿」找到它。');
          ok.onclick=()=>{const cur=c1.querySelector('[data-k=name]');const inp=cur.querySelector('input');if(!inp.value.trim()){   /* 必填檢查：換成 Field 的錯誤狀態 */
              const err=fldEl('vertical','error',{label:'客戶姓名',required:true,live:true,error:'請輸入客戶姓名',placeholder:'例：王小明'});err.dataset.k='name';cur.replaceWith(err);err.querySelector('input').focus();
              err.querySelector('input').addEventListener('input',function h(){if(!this.value.trim())return;this.removeEventListener('input',h);const fine=live('客戶姓名','例：王小明',{required:true});fine.dataset.k='name';fine.querySelector('input').value=this.value;err.replaceWith(fine);const fi=fine.querySelector('input');fi.focus();fi.setSelectionRange(fi.value.length,fi.value.length);});return;}
            confirmDlg(()=>{toast('訂單已建立','已通知倉庫備貨，可以在這頁追蹤處理進度。');go('detail');});};});},
      customers(pg){stub(pg,'客戶');},products(pg){stub(pg,'商品');},settings(pg){stub(pg,'設定');}};
    function stub(pg,name){pg.appendChild(tadHead({title:name}));body(pg,()=>{const c=tadCard();c.appendChild(tadEmpty('first',name+'頁不在這個範本裡','範本示範儀表板、訂單列表、詳情與新增訂單；其他頁面請沿用相同框架。','回到儀表板',()=>go('dashboard')));pg.appendChild(c);});}

    /* 儀表板：KPI 一張卡分欄（文字＋Tag）、待處理訂單（Dropdown 篩選＋Table）、近 7 日營收（細柱長條） */
    function overview(pg){const empty=st.scn==='empty';
      const kc=tadCard();kc.style.padding='0';const k=ce('div','tad-kpis');
      [['今日營收 (NT$)',empty?'0':'86,420',null,empty?null:['+12.5%','success']],['今日訂單',empty?'0':'128','筆',empty?null:['+8.2%','success']],['待出貨',empty?'0':'24','筆'],['逾期訂單',empty?'0':'3','筆',empty?null:['-2 筆','danger']]]
        .forEach(([l,n,u,d,pre])=>{const it=ce('div','tad-kpi');const lb=ce('span','tad-lab');lb.textContent=l;const row=ce('div','tad-kpi-row');if(pre){const pp=ce('span','tad-kpi-p');pp.textContent=pre;row.appendChild(pp);}   /* 金額單位做成小前綴，英文 NT$ 不會撐寬 */
          const nn=ce('span','tad-kpi-n');nn.textContent=n;const uu=ce('span','tad-kpi-u');uu.textContent=u||'';
          row.append(nn,uu);if(d)row.appendChild(tadTag(d[0],d[1]));it.append(lb,row);k.appendChild(it);});
      kc.appendChild(k);pg.appendChild(kc);
      if(empty){const c=tadCard();c.appendChild(tadEmpty('first','今天還沒有訂單','新訂單會即時出現在這裡；也可以先手動建立一筆。','新增訂單',()=>go('form')));pg.appendChild(c);return;}
      const flt=ddField('outline',{size:'s',options:[{value:'',label:'全部狀態'},{value:'doing',label:'處理中'},{value:'late',label:'逾期'}],value:st.todo,onChange:v=>{st.todo=v;draw();}});flt.style.minWidth='0';flt.style.width='132px';
      const todo=tadCard('待處理訂單',{flush:true,acts:[flt]});const holder=ce('div');todo.appendChild(holder);
      const f=ce('div','tad-card-f');const all=tadBtn('查看全部訂單',{variant:'text',trail:'arrow-right'});all.style.marginLeft='auto';all.onclick=()=>go('list');f.appendChild(all);todo.appendChild(f);
      let sk='date',sa=true;
      function draw(){const rows=tadRows().slice(0,8).filter(r=>r.status!=='done'&&(!st.todo||r.status===st.todo));rows.sort((a,b)=>{const r=tblCmp(a[sk],b[sk]);return sa?r:-r;});
        holder.innerHTML='';holder.appendChild(tadTable(rows,TAD_COLS.filter(c=>c.key!=='assignee'),{sortKey:sk,sortAsc:sa,onSort:(k2,a2)=>{sk=k2;sa=a2;draw();},onRow:()=>go('detail')}));}
      draw();pg.appendChild(todo);
      const lg=ce('div','tad-legend');lg.innerHTML='<span><i style="background:var(--c-brand2-500)"></i></span><span><i style="background:var(--ok)"></i></span>';
      lg.children[0].append('本週');lg.children[1].append('上週');
      const rev=tadCard('近 7 日營收',{acts:[lg]});rev.appendChild(chtChart('bar','m',{xaxis:true,yaxis:true,interactive:true,series2:true,thin:true}));pg.appendChild(rev);}
    /* 統計報表：細柱堆疊長條、排行、漏斗；兩欄等高 */
    function report(pg){if(st.scn==='empty'){const c=tadCard();c.appendChild(tadEmpty('first','這段期間沒有資料','換一個年份，或等有訂單後再回來看。',null));pg.appendChild(c);return;}
      const note=ce('div','tad-note');const ns=ce('span');ns.textContent='資料更新至 2026/11/15 08:00';note.append(ns);note.insertAdjacentHTML('beforeend',PI('info'));pg.appendChild(note);
      [['area-stack','donut'],['bar-rank','funnel']].forEach(pair=>{const g=ce('div','tad-grid');pair.forEach(v=>{const c=tadCard();c.appendChild(v==='donut'?payDonut():chtChart(v,'m',{live:true,thin:true,dropdown:true}));g.appendChild(c);});pg.appendChild(g);});}
    /* 付款方式占比：取用 Chart donut（自訂資料）＋圖例清單；占比類資料適合甜甜圈，堆疊長條改看這張 */
    function payDonut(){const w=ce('div','tad-donut-card');
      const h=ce('div','chtx-h');const t=ce('div','chtx-ht');t.innerHTML='<div class="chtx-t"></div><div class="chtx-sub"></div>';t.children[0].textContent='付款方式占比';t.children[1].textContent='2026/10 · 共 15,360 筆';h.appendChild(t);
      const MON=ddField('outline',{size:'s',options:['10 月','9 月','8 月'],value:'10 月'});MON.classList.add('chtx-dd');h.appendChild(MON);w.appendChild(h);
      const SEG=[{k:'信用卡',v:48.2,n:'7,410 筆',c:'--c-brand2-500'},{k:'行動支付',v:36.3,n:'5,580 筆',c:'--s-chart-2'},{k:'貨到付款',v:10.3,n:'1,580 筆',c:'--s-chart-3'},{k:'ATM 轉帳',v:5.2,n:'790 筆',c:'--s-chart-4'}];
      const body=ce('div','tad-donut');const box=ce('div','cht-box cht-donut tad-donut-fig');box.innerHTML=chtDonutSVG({segs:SEG,center:true,sub:'總訂單',num:'15.4K',unit:'',label:'甜甜圈圖：付款方式占比，信用卡 48.2%、行動支付 36.3%、貨到付款 10.3%、ATM 轉帳 5.2%'});chtDonutHover(box,SEG);
      const ul=ce('ul','tad-donut-list');SEG.forEach(g=>{const li=ce('li');li.innerHTML='<i></i><span></span><b></b><em></em>';li.querySelector('i').style.background='var('+g.c+')';
        li.querySelector('span').textContent=g.k;li.querySelector('b').textContent=g.v+'%';li.querySelector('em').textContent=g.n;ul.appendChild(li);});
      body.append(box,ul);w.appendChild(body);return w;}
    /* 資料列表：篩選列（Field 小標＋Input／Dropdown）→ 已篩選（Tag chip）→ 表格（每欄可排序）→ 每頁筆數＋分頁 */
    function orderList(pg){const L=st.list;
      const fc=tadCard();const fr=ce('div','tad-filters');
      const F=(label,ctl)=>{const w=ce('div','tad-f');const l=ce('span','tad-lab');l.textContent=label;w.append(l,ctl);return w;};
      const sf=ce('div','field v-outline fsz-s');sf.insertAdjacentHTML('beforeend',PI('search'));const si=document.createElement('input');si.placeholder='搜尋訂單編號、客戶';si.value=L.q;si.setAttribute('aria-label','搜尋訂單');sf.appendChild(si);
      let tmr;si.addEventListener('input',()=>{clearTimeout(tmr);tmr=setTimeout(()=>{L.q=si.value.trim();L.page=1;drawRes();},200);});
      const sts=ddField('outline',{size:'s',options:[{value:'',label:'不限'},{value:'doing',label:'處理中'},{value:'late',label:'逾期'},{value:'done',label:'已完成'}],value:L.status,onChange:v=>{L.status=v;L.page=1;drawRes();}});
      const own=ddField('outline',{size:'s',options:[{value:'',label:'不限'},...TTB_OWNERS.map(x=>({value:x,label:x}))],value:L.owner,onChange:v=>{L.owner=v;L.page=1;drawRes();}});
      const SORTS=[{value:'date:0',label:'到期日：近 → 遠'},{value:'date:1',label:'到期日：遠 → 近'},{value:'amount:0',label:'金額：高 → 低'},{value:'amount:1',label:'金額：低 → 高'}];
      const srt=ddField('outline',{size:'s',options:SORTS,value:L.sort+':'+(L.asc?1:0),onChange:v=>{const [k,a]=v.split(':');L.sort=k;L.asc=k==='date'?a==='0':a==='1';drawRes();}});
      fr.append(F('搜尋',sf),F('狀態',sts),F('負責人',own),F('排序',srt));fc.appendChild(fr);pg.appendChild(fc);
      const applied=ce('div','tad-applied');pg.appendChild(applied);
      const tc=tadCard(null,{flush:true});pg.appendChild(tc);
      function drawRes(){
        const chips=[];if(L.q)chips.push(['搜尋：'+L.q,()=>{L.q='';si.value='';}]);if(L.status)chips.push(['狀態：'+TAD_ST[L.status][0],()=>{L.status='';}]);if(L.owner)chips.push(['負責人：'+L.owner,()=>{L.owner='';}]);
        applied.innerHTML='';applied.hidden=!chips.length;if(chips.length){const l=ce('span','tad-lab');l.textContent='已篩選';applied.appendChild(l);
          chips.forEach(([t,clr])=>applied.appendChild(ttbChip(t,{onRemove:()=>{clr();L.page=1;rebuild();}})));const cl=tadBtn('清除篩選',{variant:'text'});cl.onclick=()=>{L.q='';L.status='';L.owner='';L.page=1;rebuild();};applied.appendChild(cl);}
        let rows=tadRows().filter(r=>(!L.status||r.status===L.status)&&(!L.owner||r.assignee===L.owner)&&(!L.q||(r.id+r.name).toLowerCase().includes(L.q.toLowerCase())));
        rows.sort((a,b)=>{const r=tblCmp(a[L.sort],b[L.sort]);return L.asc?r:-r;});
        const total=rows.length,pages=Math.max(1,Math.ceil(total/L.per));L.page=Math.min(L.page,pages);const from=(L.page-1)*L.per;const pr=rows.slice(from,from+L.per);
        tc.innerHTML='';
        if(!total){tc.appendChild(tadEmpty('search','找不到符合條件的訂單','換個關鍵字，或清除篩選條件再試一次。','清除篩選',()=>{L.q='';L.status='';L.owner='';rebuild();}));return;}
        tc.appendChild(tadTable(pr,TAD_COLS,{sortKey:L.sort,sortAsc:L.asc,onSort:(k,a)=>{L.sort=k;L.asc=a;drawRes();},onRow:()=>go('detail')}));
        const f=ce('div','tad-card-f');const per=ddField('outline',{size:'s',options:['10','20','50'],value:String(L.per),onChange:v=>{L.per=+v;L.page=1;drawRes();}});
        const pg1=ce('div','tad-pg-per');const a=ce('span');a.textContent='每頁';const u=ce('span','tad-per-u');u.textContent='筆';pg1.append(a,per,u);
        const rng=ce('span','tad-pg-rng');rng.textContent='第 '+(from+1)+'–'+(from+pr.length)+' 筆，共 '+total+' 筆';
        const nav=pgBar('numbered','s',{total:pages,current:L.page,onNav:n=>{L.page=n;drawRes();}});nav.classList.add('tad-pg-nav');
        f.classList.add('tad-pg');f.append(pg1,rng,nav);tc.appendChild(f);}
      function rebuild(){pg.innerHTML='';PAGES.list(pg);}
      drawRes();}
    /* 詳情頁：參考稿單欄卡片——狀態摘要（三欄）→ 訂單資訊（兩欄標籤：值）→ 商品明細（表格＋合計）→ 處理進度 */
    function detail(pg){const back=tadBtn('返回訂單列表',{iconOnly:true,icon:'arrow-left'});back.onclick=()=>go('list');
      const head=tadHead({crumbs:['訂單','ORD-1042'],onCrumb:()=>go('list'),back,title:'王小明的訂單',sub:'ORD-1042 · 建立於 2026/11/08 14:20',
        acts:[tadBtn('列印出貨單',{icon:'printer'}),tadBtn('更多動作',{iconOnly:true,icon:'ellipsis'})]});
      head.querySelectorAll('.tad-acts .btn')[0].onclick=()=>toast('已送出列印','出貨單已送到預設印表機。');pg.appendChild(head);
      body(pg,()=>{if(st.scn==='empty'){const c=tadCard();c.appendChild(tadEmpty('search','找不到這筆訂單','訂單可能已被刪除，或編號有誤。','回到訂單列表',()=>go('list')));pg.appendChild(c);return;}
        const s=tadCard('狀態摘要');const sum=ce('div','tad-sum');
        const it=(lab,v)=>{const w=ce('div','tad-sum-it');const l=ce('span','tad-lab');l.textContent=lab;w.append(l,v);return w;};
        const stDd=ddField('outline',{size:'s',options:['處理中','已出貨','已完成','已取消'],value:'處理中',onChange:v=>toast('狀態已更新','訂單狀態改為「'+v+'」。')});
        const pay=ce('div','tad-sum-v');pay.append('已付款',tadTag('信用卡','neutral'));
        const eta=ce('div','tad-sum-v');eta.append('2026/11/05（四）');const ship=tadBtn('安排出貨',{variant:'solid',intent:'primary',icon:'truck'});ship.onclick=()=>toast('已建立出貨單','物流將於今天 18:00 前取件。');
        sum.append(it('訂單狀態',stDd),it('付款狀態',pay),it('預計送達',eta));s.appendChild(sum);s.querySelector('.tad-card-h').appendChild(ship);pg.appendChild(s);
        const info=tadCard('訂單資訊');const cols=ce('div','tad-cols');
        const mail=lnkEl('inline','default',{text:'xiaoming@example.com',bare:true});
        const sec=(t,rows)=>{const x=ce('section');const h=ce('h4');h.textContent=t;x.append(h,tadKV(rows));return x;};
        cols.append(sec('收件資訊',[['收件人','王小明'],['手機','0912-345-678'],['Email',mail],['配送方式','宅配 · 黑貓宅急便'],['地址','台北市大安區復興南路一段 100 號']]),
          sec('訂單內容',[['訂單編號','ORD-1042'],['建立時間','2026/11/08 14:20'],['付款方式','信用卡 ****4321'],['發票','電子發票 · 已開立'],['備註','請於平日白天配送']]));
        const meta=ce('div','tad-meta');meta.innerHTML='<span></span><span></span>';meta.children[0].textContent='最後編輯';meta.children[1].textContent='陳美華 · 2026/11/08 14:20';
        info.append(cols,meta);pg.appendChild(info);
        const items=tadCard('商品明細',{acts:[tadBtn('編輯',{icon:'pencil'})]});items.querySelector('.tad-card-h .btn').onclick=()=>go('form');
        const IR=[{name:'亞麻抱枕套（燕麥）',price:640,qty:2,amount:1280},{name:'棉麻桌巾 120×180',price:1890,qty:1,amount:1890},{name:'手作陶杯組',price:990,qty:3,amount:2970}];
        const tw=ce('div','tad-tbl is-fit');const tb=tblTable('plain','comfortable',{data:IR.map(r=>Object.assign({},r,{price:tblFmt(r.price)})),cols:[{key:'name',lab:'商品',cls:'tbl-name'},{key:'price',lab:'單價',cls:'tbl-num'},{key:'qty',lab:'數量',cls:'tbl-num'},{key:'amount',lab:'小計',cls:'tbl-num'}]});tw.appendChild(tb);
        const tot=ce('div','tad-total');[['商品小計','NT$ 6,140'],['運費','NT$ 120'],['合計','NT$ 6,260']].forEach(([k,v],i)=>{const r=ce('div',i===2?'is-sum':'');r.innerHTML='<span></span><span></span>';r.children[0].textContent=k;r.children[1].textContent=v;tot.appendChild(r);});
        tb.querySelectorAll('tr').forEach(tr=>{const c=tr.children[1];if(c)c.dataset.col='price';});   /* 窄版隱藏單價，表格不必橫捲 */
        items.append(tw,tot);pg.appendChild(items);
        const prog=tadCard('處理進度');const steps=stpTlSteps(3);steps[0]=Object.assign({},steps[0],{desc:'訂單 ORD-1042，共 3 項商品',box:[['商品','3 項'],['金額','NT$ 6,260']]});
        prog.appendChild(stpTimeline(steps,{label:'訂單處理進度'}));pg.appendChild(prog);});}
    render();app._go=go;return app;}

  const TAD_PAGES={dashboard:['儀表板','營運摘要：KPI、待處理訂單、近 7 日營收。'],report:['統計報表','年份切換、下載 CSV、營收趨勢與排行。'],list:['資料列表','篩選列、已篩選條件、可排序表格與分頁。'],detail:['詳情頁','狀態摘要、訂單資訊、商品明細與處理進度。'],form:['建立表單','分區表單、必填檢查、確認對話框與完成提示。']};
  function buildTplAdmin(view,page){const meta=TAD_PAGES[page];
    const body=viewScaffold(view,{eyebrow:'Template · Admin',title:'Admin '+{dashboard:'Dashboard',report:'Report',list:'List',detail:'Detail',form:'Form'}[page]+' 後台'+meta[0],
      lede:'後台範本的「'+meta[0]+'」：'+meta[1]+'五個後台範本共用同一個框架（側欄、頁首、960 內容欄），<b>側欄可以直接切換頁面</b>；電腦版側欄常駐，平板與手機收進抽屜。畫面由既有元件組成，元件或 token 一改，範本跟著更新。',
      specRows:[['type','<code>template</code>'],['devices','desktop 1180 ／ tablet 768 ／ mobile 375'],['scenarios','正常 · 載入中 · 空資料 · 錯誤'],['data','通用假資料（電商訂單）']]});
    const sec=section(body,'互動範本','切換裝置與情境；點側欄、表格列、按鈕都會真的切換頁面。');
    let dev=tplDefDev(),scn='normal';const bar=ce('div','tpl-bar bento-card bento-ctl');const stage=ce('div','tpl-stage');
    const seg=(label,items,act,on)=>{const c=ce('div','ctl');const l=ce('span','lab');l.textContent=label;
      const g=items.length>4?ddField('outline',{size:'s',options:items.map(x=>({value:x[0],label:x[1]})),value:act,onChange:v=>on(v)})   /* 選項多：改下拉，左欄放得下 */
        :sgmEl('soft','s',{items:items.map(x=>x[1]),active:items.findIndex(x=>x[0]===act),label,live:true,full:true,onChange:i=>on(items[i][0])});c.append(l,g);return c;};
    const draw=()=>{stage.innerHTML='';tplFit(stage,tadApp(page,dev,scn));};
    bar.append(seg('裝置',[['desktop','電腦'],['tablet','平板'],['mobile','手機']],dev,v=>{dev=v;draw();}),
      seg('情境',[['normal','正常'],['loading','載入中'],['empty','空資料'],['error','錯誤']],scn,v=>{scn=v;draw();}));
    const lay=tplLay(bar,stage);sec.appendChild(lay);draw();
    const cs=section(body,'組成元件','點名稱前往該元件頁；範本裡沒有自己畫的元件。');const cl=ce('div','tpl-comp');
    TPL_COMPOSE['tpl-admin-'+page].forEach(id=>{const it=NAV.flatMap(g=>g.items).find(x=>x.id===id);const b=aicBtn(it?it.name:id);b.onclick=()=>renderView(id);cl.appendChild(b);});cs.appendChild(cl);
    usageSection(body,[['框架','電腦版側欄 240px 常駐、內容欄最寬 960px；平板與手機改成頂欄＋抽屜。'],['資訊卡','不整張套用組好的牌卡，用文字、Tag、Button、Dropdown 等小元件依內容排版。'],['情境','每頁都有載入中（骨架）、空資料（引導下一步）、錯誤（可重試）三種狀態。']]);}
  const TAD_SHELL=['menu','avatar','button','logo'];
  Object.assign(TPL_COMPOSE,{
    'tpl-admin-dashboard':[...TAD_SHELL,'tab','tag','dropdown','table','chart','skeleton','empty','alert'],
    'tpl-admin-report':[...TAD_SHELL,'tab','chart','notification','skeleton','empty','alert'],
    'tpl-admin-list':[...TAD_SHELL,'input','dropdown','tag','table','pagination','notification','skeleton','empty','alert'],
    'tpl-admin-detail':[...TAD_SHELL,'breadcrumb','dropdown','tag','descriptions','link','table','step','notification','skeleton','empty','alert'],
    'tpl-admin-form':[...TAD_SHELL,'breadcrumb','field','dropdown','quantity','date-picker','segmented','input','modal','notification','skeleton','alert']});
  /* ==================== TPL:v3 Template 範本 · 網站內容頁（2026-11-10）====================
     商品列表、部落格、最新消息、文章內頁：只取參考稿的版型架構（頁首→頁面橫幅→左篩選／右內容→頁尾），畫面一律取用既有元件。
     圖片用站內已內嵌的照片（PSC_ROT／CARD_COVER／HX_TSM_BG），之後換成專案素材即可。 */
  /* PI 預掃：PI('sliders-horizontal') PI('arrow-left') PI('arrow-right') PI('chevron-down') PI('clock') PI('share-2') PI('link') */
  const TWS_IMG=()=>[...PSC_ROT,CARD_COVER,HX_TSM_BG,CARD_PHOTO];
  const twsImg=i=>{const L=TWS_IMG();return L[i%L.length];};
  /* 2026-11-10 部落格／文章配圖（使用者提供，Unsplash）：原檔 1280 寬在 library/assets/photos/（team-whiteboard、design-tool-laptop、code-desk-night、phone-app-pool、silhouette-group、mountain-dawn），網頁用 640×400 webp 在 library/assets/img/blog-1～6（IMG-ASSET:v1） */
  const TWS_BLOG=[cdlAsset('img/blog-1.webp'),cdlAsset('img/blog-2.webp'),cdlAsset('img/blog-3.webp'),cdlAsset('img/blog-4.webp'),cdlAsset('img/blog-5.webp'),cdlAsset('img/blog-6.webp')];
  const twsBlog=i=>TWS_BLOG[i%TWS_BLOG.length];
  /* 商品格：Product Card 已從元件庫移除（鐵則 2），改用原子組：Image 1:1＋Tag 角標＋品名＋Price＋icon-only Button */
  function twsProduct(name,i,o){o=o||{};const c=ce('a','tws-prod'+(o.state==='hover'?' is-hover':''));c.href='#';c.onclick=e=>e.preventDefault();
    const th=ce('div','tws-prod-img');th.appendChild(imEl('rectangular','default','l',{ratio:'1:1',src:twsImg(i),alt:name}));
    if(o.badge){const t=tagEl('solid',o.badge==='熱門'?'danger':'brand','default');t.querySelector('span').textContent=o.badge;t.classList.add('tws-prod-badge');th.appendChild(t);}
    const nm=ce('div','tws-prod-name');nm.textContent=name;const row=ce('div','tws-prod-row');row.appendChild(prEl(o.discount?'discount':'normal','sm'));
    const b=mkBtn({variant:'soft',intent:'secondary',size:'s',iconOnly:true,isLive:true});b.type='button';b.innerHTML=IC_CART;b.setAttribute('aria-label','加入購物車：'+name);b.onclick=e=>{e.preventDefault();e.stopPropagation();};if(o.cart!==false)row.appendChild(b);
    c.append(th,nm,row);return c;}
  const TWS_PAGE={product:['所有商品','Products'],blog:['部落格','Blog'],news:['最新消息','News'],article:['文章內頁','Article']};
  const TWS_PRODUCTS=[['機能防潑水外套','服飾'],['登山後背包 28L','生活'],['美麗諾羊毛圍巾','服飾'],['速乾排汗 T 恤','服飾'],['防水短靴','服飾'],['輕量羽絨背心','服飾'],
    ['保溫隨行杯','生活'],['抓絨保暖手套','服飾'],['折疊露營椅','生活'],['旅行收納袋組','生活'],['亞麻抱枕套','生活'],['手作陶杯組','生活']];
  const TWS_POSTS=[['設計','設計系統在多產品線團隊中的實際運作'],['產品','從資料密集後台談資訊層級的取捨'],['趨勢','AI 輔助設計流程的一年實測記錄'],['設計','Token 命名：從顏色到語意的三個階段'],
    ['開發','元件 API 怎麼設計才不會越長越亂'],['產品','用使用者回饋排定下一季的優先順序'],['趨勢','2026 介面動態設計的五個方向'],['開發','把 Figma Variables 接進前端建置流程'],['設計','空狀態不只是一張插畫']];
  const TWS_NEWS=[['important','2026/11/12','系統維護公告：11/15（六）02:00–04:00 暫停服務','維護期間無法登入與下單，已成立的訂單不受影響。'],
    ['important','2026/11/08','隱私權政策更新，將於 12/01 生效','主要調整資料保存期限與第三方分析工具的說明。'],
    ['news','2026/11/05','冬季新品上架：機能外套系列','防潑水、可收納，三種顏色同步開賣。'],['news','2026/10/28','會員點數兌換規則調整','點數有效期限延長為 18 個月。'],
    ['news','2026/10/20','台北門市營業時間異動','自 11 月起週一公休，其餘時間照常營業。'],['important','2026/10/15','客服電話系統升級完成','新增線上預約回電功能。'],
    ['news','2026/10/02','雙 11 活動預告','全館 9 折起，會員再享免運。'],['news','2026/09/22','新增超商取貨付款','支援四大超商取貨付款。']];
  /* ==================== CARDS6:v1（2026-11-10）從網站範本抽出的兩顆牌卡 ====================
     News Item 消息列表項：Tag（類型）＋日期＋標題＋摘要，整列可點。Product Tile 商品格：Image 1:1＋Tag 角標＋品名＋Price＋icon-only Button。
     範本（最新消息、商品列表、文章內頁的相關商品）直接取用這兩顆。 */
  function newsItemEl(type,state,o){o=o||{};const row=o.row||TWS_NEWS.find(r=>r[0]===type)||TWS_NEWS[0];
    const a=ce('a','tws-news-it nwi'+(state==='hover'?' is-hover':''));a.href='#';a.onclick=e=>{e.preventDefault();if(o.onOpen)o.onOpen();};
    const meta=ce('div','tws-news-meta');meta.append(tadTag(type==='important'?'重要公告':'最新消息',type==='important'?'danger':'neutral'));
    if(o.date!==false){const dt=ce('time');dt.textContent=row[1];meta.appendChild(dt);}
    const h=ce('h3');h.textContent=row[2];a.append(meta,h);if(o.summary!==false){const p=ce('p');p.textContent=row[3];a.appendChild(p);}return a;}
  function prodTileEl(badge,price,state,o){o=o||{};const i=o.i||0;
    return twsProduct(o.name||TWS_PRODUCTS[i][0],i,{badge:badge==='new'?'新品':badge==='hot'?'熱門':null,discount:price==='discount',state,cart:o.cart});}
  function nwiList(nodes){const ul=ce('ul','tws-news-list nwi-list');nodes.forEach(n=>{const li=ce('li');li.appendChild(n);ul.appendChild(li);});return ul;}
  LIVE['news-item']=(host)=>mountLive(host,{gate:'news-item',initial:{type:'important',date:true,summary:true},
    segs:[{key:'type',label:'Type',options:['important','news'],labels:['重要公告','最新消息']}],
    bools:[{key:'date',label:'date 日期'},{key:'summary',label:'summary 摘要'}],boolLabel:'Content',
    render:st=>{const w=ce('div','nwi-live');w.appendChild(nwiList([newsItemEl(st.type,'default',{date:st.date,summary:st.summary}),newsItemEl(st.type==='important'?'news':'important','default',{date:st.date,summary:st.summary})]));return w;},
    note:'整列是一個連結（滑過換底色、Tab 可聚焦）；類型用 Tag：重要公告 danger、最新消息 neutral。列與列之間用分隔線。'});
  function buildNewsItem(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · News Item',title:'News Item 消息列表項',
      lede:'消息／公告列表的一列：上方 <a href="#tag">tag</a>（類型）＋日期，下方標題與一行摘要，整列可點進內頁。用在 <a href="#tpl-web-news">最新消息範本</a>。',
      specRows:[['axes','<code>type × state</code>'],['formula','<code>2 × 2 = 4</code>'],['boolean','<code>date · summary</code>'],['atoms','<code>.tg</code>'],['token-policy','<code>semantic.feedback.danger · --panel-2 hover</code>']]});
    const D=DIAL_SPECS['news-item'],axes=D.axes,active=CHOICE['news-item'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ts=axes.type.filter(v=>active.type.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'date · summary · on',name:'Type × State',rows:ts,cols:ss,rowLab:t=>labHTML(D.zh.type[t],t),colLab:x=>labHTML(D.zh.state[x],x),cell:(t,x)=>{const w=ce('div','nwi-cell');w.appendChild(newsItemEl(t,x));return w;},mincol:300}));}
    mountDial(body,{axes,zh:D.zh,active,onRender:renderM});
    const sec=section(body,'Type × State 矩陣','類型只換 Tag 的文字與語意色；滑過整列換成 --panel-2 底。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>date</code>、<code>summary</code> 對應 Figma boolean property，可各自關掉。');
    capRow(cs,[['date = false',(()=>{const w=ce('div','nwi-cell');w.appendChild(newsItemEl('news','default',{date:false}));return w;})()],['summary = false',(()=>{const w=ce('div','nwi-cell');w.appendChild(newsItemEl('important','default',{summary:false}));return w;})()]]);
    usageSection(body,[['用 News Item','公告、最新消息、更新日誌等以時間排序的文字列表。'],['改用 Article Card','需要封面圖、作者或卡片網格排版。'],['排版','一列一則，用分隔線隔開；標題最多兩行，摘要一行。']]);
    const sl=section(body,'互動預覽與程式碼','切類型、開關日期與摘要。');LIVE['news-item'](sl);}
  LIVE['product-tile']=(host)=>mountLive(host,{gate:'product-tile',initial:{badge:'new',price:'discount',cart:true},
    segs:[{key:'badge',label:'Badge',options:['none','new','hot'],labels:['無','新品','熱門']},{key:'price',label:'Price',options:['normal','discount'],labels:['一般','折扣']}],
    bools:[{key:'cart',label:'cart 購物車按鈕'}],boolLabel:'Content',
    render:st=>{const w=ce('div','ptl-live');[0,1,2].forEach(i=>w.appendChild(prodTileEl(st.badge,st.price,'default',{i,cart:st.cart})));return w;},
    note:'整格是連結；滑過圖片微放大。購物車是 icon-only Button，點擊不會觸發整格連結。角標用 Tag（新品 brand、熱門 danger）。'});
  function buildProductTile(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Product Tile',title:'Product Tile 商品格',
      lede:'商品列表與相關商品用的精簡商品格：1:1 <a href="#image">image</a>＋左上 <a href="#tag">tag</a> 角標、品名一行、<a href="#price">price</a>＋icon-only <a href="#button">button</a>（加入購物車）。用在 <a href="#tpl-web-product">商品列表</a>與 <a href="#tpl-web-article">文章內頁</a>的相關商品。',
      specRows:[['axes','<code>badge × price × state</code>'],['formula','<code>3 × 2 × 2 = 12</code>'],['boolean','<code>cart</code>'],['atoms','<code>imEl · .tg · prEl · .btn</code>'],['token-policy','<code>--radius · --fs-h10 · --dur-slow</code>']]});
    const D=DIAL_SPECS['product-tile'],axes=D.axes,active=CHOICE['product-tile'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const bs=axes.badge.filter(v=>active.badge.has(v)),ps=axes.price.filter(v=>active.price.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      ss.forEach(x=>p.appendChild(matrixPanel({badge:'state · '+x,name:'Badge × Price',rows:bs,cols:ps,rowLab:b=>labHTML(D.zh.badge[b],b),colLab:q=>labHTML(D.zh.price[q],q),cell:(b,q)=>{const w=ce('div','ptl-cell');w.appendChild(prodTileEl(b,q,x,{i:axes.badge.indexOf(b)}));return w;},mincol:200})));}
    mountDial(body,{axes,zh:D.zh,active,onRender:renderM});
    const sec=section(body,'Badge × Price 矩陣','角標三種（無／新品／熱門）× 價格兩種（一般／折扣，折扣價重用 Price 的 discount）；滑過狀態圖片微放大。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>cart</code> 對應 Figma boolean property：關掉時價格列只剩價格。');
    capRow(cs,[['cart = false',(()=>{const w=ce('div','ptl-cell');w.appendChild(prodTileEl('none','normal','default',{cart:false,i:3}));return w;})()]]);
    usageSection(body,[['用 Product Tile','商品格線、相關商品、推薦清單等需要快速瀏覽的地方。'],['改用 Card','要放更多說明文字、評價或多顆動作按鈕。'],['排版','桌機 3–4 欄、手機 2 欄；品名一行截斷。']]);
    const sl=section(body,'互動預覽與程式碼','切角標與價格、開關購物車按鈕。');LIVE['product-tile'](sl);}
  /* ==================== /CARDS6:v1 ==================== */
  function twsApp(page,dev,scn){const mob=dev==='mobile';const app=ce('div',`tws dv-${dev}`);
    /* 頁首：Header 原子（行動版取漢堡＋Logo＋動作列，不要外層手機框） */
    const hb=hdrBar(mob?'mobile':'desktop',{});const head=ce('header','tws-head');head.appendChild(mob?hb.firstElementChild:hb);app.appendChild(head);
    const scroll=ce('div','tws-scroll');app.appendChild(scroll);
    const st={page,scn};
    function render(){scroll.innerHTML='';scroll.scrollTop=0;
      if(st.page!=='article'){const bn=ce('section','tws-banner');const t=TWS_PAGE[st.page];bn.innerHTML='<div class="tws-wrap"><h1></h1><p></p></div>';bn.querySelector('h1').textContent=t[0];bn.querySelector('p').textContent=t[1];scroll.appendChild(bn);}
      const main=ce('main','tws-main tws-wrap');scroll.appendChild(main);
      if(st.scn==='loading')main.appendChild(twsSkeleton(st.page));else PAGES[st.page](main);
      const ft=ftrFooter('simple',{device:mob?'mobile':'desktop'});ft.classList.add('tws-foot');scroll.appendChild(ft);}
    const go=p=>{st.page=p;render();};
    const empty=(t,d)=>{const e=empEl('search','m',{secondary:false,live:true});e.querySelector('.emp-title').textContent=t;e.querySelector('.emp-desc').textContent=d;const b=e.querySelector('.emp-actions .btn');if(b)b.querySelector('span').textContent='清除篩選';const w=ce('div','tws-empty');w.appendChild(e);return w;};
    /* 篩選欄：Segmented＋Checkbox 清單＋Tag＋Slider；行動版收進「篩選」按鈕展開 */
    function filters(kind,onChange){const f=ce('aside','tws-filter');
      const sec=(title,node)=>{const s=ce('section','tws-fsec');const h=ce('h3');h.textContent=title;s.append(h,node);f.appendChild(s);};
      if(kind==='product')sec('類型',sgmEl('soft','s',{items:['全部','服飾','生活'],active:0,label:'商品類型',live:true,full:true,onChange:i=>onChange('type',['','服飾','生活'][i])}));
      const cats=kind==='product'?['新品','熱銷','限時優惠','會員專屬']:['設計','產品','開發','趨勢'];const list=ce('div','tws-checks');const on=new Set();
      cats.forEach(c=>{const row=ce('label','tws-check');const box=cbxEl('default','s');row.append(box,document.createTextNode(c));row.tabIndex=0;row.setAttribute('role','checkbox');row.setAttribute('aria-checked','false');
        const tg=()=>{const v=!on.has(c);v?on.add(c):on.delete(c);box.className='cbx sz-s '+(v?'st-checked':'st-default');box.innerHTML=v?ICON_CHECK:'';row.setAttribute('aria-checked',String(v));onChange('cat',[...on]);};
        row.onclick=e=>{e.preventDefault();tg();};row.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();tg();}};list.appendChild(row);});
      sec(kind==='product'?'標籤':'主題',list);
      if(kind==='product'){const tags=ce('div','tws-tags');['免運','現貨','可預購','環保材質'].forEach(t=>{const g=aicTag(t,null,{as:'button'});g.setAttribute('aria-pressed','false');g.onclick=()=>{const v=g.getAttribute('aria-pressed')!=='true';g.setAttribute('aria-pressed',String(v));g.classList.toggle('is-on',v);};tags.appendChild(g);});sec('優惠',tags);
        const sl=sldEl('range','m','default',{min:0,max:3000,step:100,value:[0,2000],live:true});sec('價格',sl);}
      if(mob){const w=ce('div','tws-fwrap');const b=tadBtn('篩選',{icon:'sliders-horizontal'});b.classList.remove('tad-sec');b.setAttribute('aria-expanded','false');f.hidden=true;
        b.onclick=()=>{const v=f.hidden;f.hidden=!v;b.setAttribute('aria-expanded',String(v));};w.append(b,f);return w;}
      return f;}
    function toolbar(count,sorts){const t=ce('div','tws-bar');const c=ce('span','tws-count');c.textContent=count;const s=ddField('outline',{size:'s',options:sorts,value:sorts[0]});s.classList.add('tws-sort');t.append(c,s);return t;}
    const PAGES={
      product(main){const L={type:'',cat:[]};const lay=ce('div','tws-lay');const right=ce('div','tws-content');
        lay.append(filters('product',(k,v)=>{L[k]=v;draw();}),right);main.appendChild(lay);
        function draw(){right.innerHTML='';const rows=st.scn==='empty'?[]:TWS_PRODUCTS.filter(p=>!L.type||p[1]===L.type);
          right.appendChild(toolbar('共 '+rows.length+' 項',['新到舊','舊到新','價格低到高','價格高到低']));
          if(!rows.length){right.appendChild(empty('找不到符合條件的商品','換個條件，或清除篩選再試一次。'));return;}
          const g=ce('div','tws-grid is-product');rows.forEach((p,i)=>g.appendChild(twsProduct(p[0],i,{badge:i%4===0?(i%8===0?'熱門':'新品'):null,discount:i%3===1})));
          right.appendChild(g);const pg=ce('div','tws-pager');pg.appendChild(pgBar('numbered',mob?'s':'m',{total:6,current:1}));right.appendChild(pg);}
        draw();},
      blog(main){let n=6;const lay=ce('div','tws-lay');const right=ce('div','tws-content');lay.append(filters('blog',()=>{}),right);main.appendChild(lay);
        function draw(){right.innerHTML='';const rows=st.scn==='empty'?[]:TWS_POSTS;right.appendChild(toolbar('共 '+rows.length+' 篇',['新到舊','舊到新']));
          if(!rows.length){right.appendChild(empty('還沒有文章','換個主題，或稍後再回來看看。'));return;}
          const g=ce('div','tws-grid is-blog');rows.slice(0,n).forEach(([cat,title],i)=>{const c=artCard('vertical','default',{live:true,author:false,size:'s'});
            c.querySelector('.art-title').textContent=title;c.querySelector('.art-cat .tg span').textContent=cat;const im=c.querySelector('.art-cover img');if(im)im.src=twsBlog(i);
            c.querySelector('.art-excerpt').textContent='拆解實際做法與常見問題，附上可以直接套用的檢查清單。';c.tabIndex=0;c.style.cursor='pointer';c.onclick=()=>go('article');g.appendChild(c);});
          right.appendChild(g);if(n<rows.length){const m=ce('div','tws-pager');const b=tadBtn('載入更多',{trail:'chevron-down'});b.classList.remove('tad-sec');b.onclick=()=>{n+=3;draw();};m.appendChild(b);right.appendChild(m);}}
        draw();},
      news(main){let tab=0;const card=ce('section','tws-news');main.appendChild(card);
        const tb=tabBarLive('contained',{size:'s'});const tis=[...tb.querySelectorAll('.tabi')];   /* TAB-KEEP:v1 分頁列只建一次，重畫內容時沿用 */
        ['全部','重要公告','最新消息'].forEach((t,i)=>{tis[i].querySelector('span').textContent=t;tis[i].classList.toggle('st-active',i===tab);tis[i].addEventListener('click',()=>{if(tab!==i){tab=i;draw();}});});
        function draw(){card.innerHTML='';const top=ce('div','tws-news-top');
          const s=ddField('outline',{size:'s',options:['新到舊','舊到新'],value:'新到舊'});s.classList.add('tws-sort');top.append(tb,s);card.appendChild(top);
          const rows=st.scn==='empty'?[]:TWS_NEWS.filter(r=>tab===0||(tab===1?r[0]==='important':r[0]==='news'));
          if(!rows.length){card.appendChild(empty('目前沒有消息','有新公告時會顯示在這裡。'));return;}
          const ul=nwiList(rows.map(r=>newsItemEl(r[0],'default',{row:r,onOpen:()=>go('article')})));   /* 取用 News Item 元件 */
          card.appendChild(ul);const pg=ce('div','tws-pager');pg.appendChild(pgBar('numbered',mob?'s':'m',{total:3,current:1}));card.appendChild(pg);}
        draw();},
      article(main){if(st.scn==='empty'){main.appendChild(empty('找不到這篇文章','文章可能已下架，回到部落格看看其他內容。'));return;}
        const lay=ce('div','tws-art-lay');const art=ce('article','tws-art');
        const back=lnkEl('standalone','default',{text:'回部落格'});back.classList.add('tws-back');back.insertAdjacentHTML('afterbegin',PI('arrow-left'));back.querySelector('.lnk-ic')?.remove();back.addEventListener('click',()=>go('blog'));
        const meta=ce('div','tws-art-meta');const mt=ce('span');mt.textContent='2026/11/10 · 楊鎮瑜 · 閱讀 6 分鐘';meta.appendChild(mt);
        const h1=ce('h1');h1.textContent='設計系統在多產品線團隊中的實際運作';const sub=ce('p','tws-art-sub');sub.textContent='從 token、元件到文件化流程，拆解導入時最常遇到的三個問題。';
        const cover=imEl('rectangular','default','l',{ratio:'16:9',src:twsBlog(0),alt:'文章封面'});cover.classList.add('tws-art-cover');
        const body=ce('div','tws-art-body');
        const P=t=>{const p=ce('p');p.textContent=t;return p;};const H=(t,id)=>{const h=ce('h2');h.textContent=t;h.id=id;return h;};
        const ul=ce('ul');['同一套 token 對應三種平台的命名','元件只負責外觀與互動，資料由頁面決定','文件和元件放在同一個地方，改一處就同步'].forEach(x=>{const li=ce('li');li.textContent=x;ul.appendChild(li);});
        const q=ce('blockquote');q.textContent='「先讓大家用同一套詞彙，再談一樣的畫面。」';
        const note=alEl('soft','info',{});note.querySelector('.al-title').textContent='重點整理';note.querySelector('.al-desc').textContent='先統一 token 命名、再收斂元件 API，最後把文件和元件放在一起維護。';
        const fig=ce('figure');fig.appendChild(imEl('rectangular','default','l',{ratio:'16:9',src:twsBlog(1),alt:'團隊討論'}));const fc=ce('figcaption');fc.textContent='團隊每週一次的元件審查會議';fig.appendChild(fc);
        const tw=ce('div','tad-tbl');tw.appendChild(tblTable('plain','compact',{data:[{name:'Token',a:'1 週',b:'設計＋前端'},{name:'元件',a:'3 週',b:'前端'},{name:'文件',a:'持續',b:'全員'}],cols:[{key:'name',lab:'階段',cls:'tbl-name'},{key:'a',lab:'時程'},{key:'b',lab:'負責'}]}));
        body.append(P('當產品線從一條變成三條，同樣的按鈕開始出現三種寫法。設計系統要解決的不是「好不好看」，而是讓不同團隊說同一種語言。'),H('一、先統一語言','s1'),P('我們先從 token 命名開始，讓設計稿、程式碼和文件用一樣的名字。'),ul,
          H('二、元件只做一件事','s2'),P('元件負責外觀和互動，資料與商業邏輯留給頁面決定，這樣元件才能在不同產品裡重複使用。'),fig,q,
          H('三、導入的時程','s3'),P('分階段導入，每一階段都有明確的負責人。'),tw,note);
        const pn=ce('nav','tws-prevnext');pn.setAttribute('aria-label','上一篇與下一篇');[['上一篇','從資料密集後台談資訊層級的取捨','arrow-left'],['下一篇','AI 輔助設計流程的一年實測記錄','arrow-right']].forEach(([l,t,ic],i)=>{
          const a=ce('a','tws-pn'+(i?' is-next':''));a.href='#';a.onclick=e=>{e.preventDefault();render();};a.innerHTML=(i?'':PI(ic))+'<span><small></small><b></b></span>'+(i?PI(ic):'');a.querySelector('small').textContent=l;a.querySelector('b').textContent=t;pn.appendChild(a);});
        art.append(back,meta,h1,sub,cover,body,pn);
        const side=ce('aside','tws-art-side');
        const toc=ce('section','tws-side-card');toc.innerHTML='<h3>文章目錄</h3>';const tl=ce('ol','tws-toc');[['s1','先統一語言'],['s2','元件只做一件事'],['s3','導入的時程']].forEach(([id,t])=>{const li=ce('li');const a=lnkEl('inline','default',{text:t,bare:true});
          a.addEventListener('click',()=>{const el=body.querySelector('#'+id);if(el)scroll.scrollTo({top:el.offsetTop-80,behavior:'smooth'});});li.appendChild(a);tl.appendChild(li);});toc.appendChild(tl);
        const rec=ce('section','tws-side-card');rec.innerHTML='<h3>推薦文章</h3>';TWS_POSTS.slice(3,6).forEach(([cat,t],i)=>{const a=ce('a','tws-rec');a.href='#';a.onclick=e=>{e.preventDefault();render();};
          const im=ce('img');im.src=twsBlog(i+3);im.alt='';const d=ce('span');d.innerHTML='<small></small><b></b>';d.querySelector('small').textContent=cat;d.querySelector('b').textContent=t;a.append(im,d);rec.appendChild(a);});
        side.append(toc,rec);lay.append(art,side);main.appendChild(lay);
        const rel=ce('section','tws-related');const rh=ce('h2');rh.textContent='相關商品';const g=ce('div','tws-grid is-related');TWS_PRODUCTS.slice(0,mob?2:4).forEach((p,i)=>g.appendChild(twsProduct(p[0],i)));
        rel.append(rh,g);main.appendChild(rel);}};
    function twsSkeleton(p){const w=ce('div','tws-skel');if(p==='article'){w.append(skelEl('text','l'),skelEl('text','m'));const b=skelEl('rectangle','l');b.classList.add('tws-sk-hero');w.append(b,skelPara(),skelPara());return w;}
      const g=ce('div','tws-grid is-product');for(let i=0;i<(mob?4:6);i++){const c=ce('div','tws-sk-card');const b=skelEl('rectangle','l');b.classList.add('tws-sk-img');c.append(b,skelEl('text','m'),skelEl('text','s'));g.appendChild(c);}w.appendChild(g);return w;}
    render();return app;}

  const TWS_META={product:['Product List','商品列表','左側篩選（類型、標籤、優惠、價格）＋商品卡格線＋排序與分頁。'],blog:['Blog','部落格','主題篩選＋文章卡格線＋載入更多。'],
    news:['News','最新消息','分類分頁＋排序＋消息列表（標籤、日期、標題、摘要）＋分頁。'],article:['Article','文章內頁','文章主欄（標題、封面、內文、引言、表格、上下篇）＋右側目錄與推薦＋相關商品。']};
  function buildTplWeb(view,page){const m=TWS_META[page];
    const body=viewScaffold(view,{eyebrow:'Template · Website',title:m[0]+' '+m[1],
      lede:'網站內容頁範本的「'+m[1]+'」：'+m[2]+'只參考版型架構（頁首 → 頁面橫幅 → 內容 → 頁尾），畫面全部由既有元件組成；點文章或消息會切到文章內頁。',
      specRows:[['type','<code>template</code>'],['devices','desktop 1280 ／ mobile 375'],['scenarios','正常 · 載入中 · 空資料'],['data','通用假資料']]});
    const sec=section(body,'互動範本','切換裝置與情境；篩選、排序、分頁、文章連結都可以操作。');
    let dev=tplDefDev(),scn='normal';const bar=ce('div','tpl-bar bento-card bento-ctl');const stage=ce('div','tpl-stage');
    const seg=(label,items,act,on)=>{const c=ce('div','ctl');const l=ce('span','lab');l.textContent=label;
      const g=sgmEl('soft','s',{items:items.map(x=>x[1]),active:items.findIndex(x=>x[0]===act),label,live:true,full:true,onChange:i=>on(items[i][0])});c.append(l,g);return c;};
    const draw=()=>{stage.innerHTML='';tplFit(stage,twsApp(page,dev,scn));};
    bar.append(seg('裝置',[['desktop','電腦'],['mobile','手機']],dev,v=>{dev=v;draw();}),seg('情境',[['normal','正常'],['loading','載入中'],['empty','空資料']],scn,v=>{scn=v;draw();}));
    sec.appendChild(tplLay(bar,stage));draw();
    const cs=section(body,'組成元件','點名稱前往該元件頁；範本裡沒有自己畫的元件。');const cl=ce('div','tpl-comp');
    TPL_COMPOSE['tpl-web-'+page].forEach(id=>{const it=NAV.flatMap(g=>g.items).find(x=>x.id===id);const b=aicBtn(it?it.name:id);b.onclick=()=>renderView(id);cl.appendChild(b);});cs.appendChild(cl);
    usageSection(body,[['版型','內容欄最寬 1120px；列表頁左側 240px 篩選欄，手機改成「篩選」按鈕展開。'],['圖片','目前用站內示範照片，換成專案素材即可；比例由 Image 元件控制。'],['情境','載入中用 Skeleton、沒有資料用 Empty，並提供清除篩選。']]);}
  const TWS_SHELL=['header','footer','logo','button'];
  Object.assign(TPL_COMPOSE,{
    'tpl-web-product':[...TWS_SHELL,'product-tile','segmented','selector','tag','slider','dropdown','image','price','pagination','skeleton','empty'],
    'tpl-web-blog':[...TWS_SHELL,'selector','dropdown','article-card','image','tag','skeleton','empty'],
    'tpl-web-news':[...TWS_SHELL,'news-item','tab','dropdown','tag','pagination','skeleton','empty'],
    'tpl-web-article':[...TWS_SHELL,'product-tile','link','image','alert','table','price','skeleton','empty']});
  const BUILD={'time-picker':buildTimePicker,'color-picker':buildColorPicker,cascader:buildCascader,'tree-select':buildTreeSelect,tour:buildTour,menubar:buildMenubar,chip:buildChip,'news-item':buildNewsItem,'product-tile':buildProductTile,'context-menu':buildContextMenu,command:buildCommand,'date-picker':buildDatePicker,dropzone:buildDropzone,'table-toolbar':buildTableToolbar,splitter:buildSplitter,'scroll-area':buildScrollArea,'number-input':buildNumberInput,rating:buildRating,'person-card':buildPersonCard,'profile-card':buildProfileCard,'metric-card':buildMetricCard,'invite-card':buildInviteCard,'widget-card':buildWidgetCard,'trend-card':buildTrendCard,'media-card':buildMediaCard,'weather-card':buildWeatherCard,'player-card':buildPlayerCard,'ticket-card':buildTicketCard,carousel:buildCarousel,'hover-card':buildHoverCard,'button-group':buildButtonGroup,link:buildLink,kbd:buildKbd,divider:buildDivider,descriptions:buildDescriptions,avatar:buildAvatar,segmented:buildSegmented,slider:buildSlider,field:buildField,stack:buildStack,'app-shell':buildAppShell,empty:buildEmpty,alert:buildAlert,popover:buildPopover,toggle:buildToggle,logo:buildLogo,input:buildInput,dropdown:buildDropdown,selector:buildSelector,tag:buildTag,tab:buildTab,tooltip:buildTooltip,notification:buildNotification,skeleton:buildSkeleton,loader:buildLoader,menu:buildMenu,'action-menu':buildActionMenu,breadcrumb:buildBreadcrumb,pagination:buildPagination,icon:buildIcon,price:buildPrice,image:buildImage,header:buildHeader,footer:buildFooter,'section-head':buildSectionHead,list:buildList,'list-item':buildListItem,collapse:buildCollapse,modal:buildModal,drawer:buildDrawer,'floating-line':buildFloatingLine,step:buildStep,quantity:buildQuantity,progress:buildProgress,card:buildCard,'product-card':buildProductCard,'category-tile':buildCategoryTile,'article-card':buildArticleCard,table:buildTable,chart:buildChart,'tree-view':buildTreeView,'schedule-chart':buildScheduleChart,calendar:buildCalendar,'ai-avatar':buildAiAvatar,'chat-message':buildChatMessage,'chat-thinking':buildChatThinking,'chat-composer':buildChatComposer,'prompt-suggestion':buildPromptSuggestion,'chat-error':buildChatError,'tpl-ai-chat':buildTplAiChat,'tpl-admin-dashboard':v=>buildTplAdmin(v,'dashboard'),'tpl-admin-report':v=>buildTplAdmin(v,'report'),'tpl-admin-list':v=>buildTplAdmin(v,'list'),'tpl-admin-detail':v=>buildTplAdmin(v,'detail'),'tpl-admin-form':v=>buildTplAdmin(v,'form'),'tpl-web-product':v=>buildTplWeb(v,'product'),'tpl-web-blog':v=>buildTplWeb(v,'blog'),'tpl-web-news':v=>buildTplWeb(v,'news'),'tpl-web-article':v=>buildTplWeb(v,'article')};

