  /* ==================== P2 元件 · 第一批（2026-11-03）==================== */
  /* ---------- BUTTON GROUP 按鈕組 ---------- */
  const BGP_ICONS=()=>[AM_IC_COPY,ICON_PENCIL,IC_FOLDER];
  function bgpEl(variant,size,o){o=o||{};const g=ce('div',`bgp bgp-v-${variant} bgp-sz-${size}`);g.setAttribute('role','group');g.setAttribute('aria-label',o.label||'檔案動作');
    if(variant==='split'){
      const main=mkBtn({variant:'solid',intent:'primary',size,isLive:!!o.live});main.querySelector('span').textContent='儲存';
      const more=mkBtn({variant:'solid',intent:'primary',size,iconOnly:true,isLive:!!o.live});more.innerHTML=ICON_CARET;more.setAttribute('aria-label','更多儲存選項');more.setAttribute('aria-haspopup','menu');more.setAttribute('aria-expanded','false');
      if(o.live)more.onclick=()=>{const on=more.classList.toggle('is-open');more.setAttribute('aria-expanded',String(on));};
      g.append(main,more);return g;}
    const v=variant==='soft'?'soft':'outline';
    ['複製','編輯','封存'].forEach((t,i)=>{const b=mkBtn({variant:v,intent:'secondary',size,iconOnly:!!o.iconOnly,lead:!!o.icon&&!o.iconOnly,isLive:!!o.live});
      if(o.iconOnly){b.innerHTML=BGP_ICONS()[i];b.setAttribute('aria-label',t);}else{if(o.icon){b.innerHTML=BGP_ICONS()[i]+'<span></span>';}b.querySelector('span').textContent=t;}
      if(o.toggle){b.setAttribute('aria-pressed',i===0?'true':'false');if(i===0)b.classList.add('is-on');
        if(o.live)b.addEventListener('click',()=>{g.querySelectorAll('.btn').forEach(x=>{x.classList.toggle('is-on',x===b);x.setAttribute('aria-pressed',String(x===b));});});}
      g.appendChild(b);});
    return g;}
  LIVE['button-group']=(host)=>mountLive(host,{gate:'button-group',initial:{variant:'outline',size:'m',icon:true,iconOnly:false,toggle:false},
    segs:[{key:'variant',label:'Variant',options:['outline','soft','split'],labels:['外框','柔色','主鈕＋下拉']},{key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'icon',label:'icon 圖示'},{key:'iconOnly',label:'icon only 純圖示'},{key:'toggle',label:'toggle 可切換選中'}],boolLabel:'Content',
    render:st=>bgpEl(st.variant,st.size,{live:true,icon:st.icon,iconOnly:st.iconOnly,toggle:st.toggle}),
    note:'按鈕組直接取用 Button 原子，只把相鄰處的圓角歸零、外框重疊一條線；hover／focus 的那顆會浮到上層，外框不會被鄰居蓋住。'});
  function buildButtonGroup(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Button Group',title:'Button Group 按鈕組',
      lede:'把幾個相關的動作連成一組：工具列、分頁式切換、「主動作＋更多選項」。直接取用 <a href="#button">button</a> 原子，三種 variant × 三級 size（<b>3 × 3 = 9</b>）。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>semantic.action.*</code>'],['features','icon / icon-only / toggle']]});
    const VN={outline:['外框','outline'],soft:['柔色','soft'],split:['主鈕＋下拉','split']},SZN={s:['小','s'],m:['標準','m'],l:['大','l']};
    const axes=DIAL_SPECS['button-group'].axes,zh=DIAL_SPECS['button-group'].zh,active=CHOICE['button-group'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'content · 文字',name:'Variant × Size',rows:vs,cols:ss,rowLab:v=>labHTML(VN[v][0],VN[v][1]),colLab:s=>labHTML(SZN[s][0],SZN[s][1]),cell:(v,s)=>bgpEl(v,s,{}),mincol:240}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','outline 用在白底工具列；soft 用在已有底色的區塊；split 是「最常用的動作＋其他選項」。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','');
    capRow(cs,[['帶圖示',bgpEl('outline','m',{icon:true})],['純圖示',bgpEl('outline','m',{iconOnly:true})],['可切換選中（類似 toggle group）',bgpEl('outline','m',{toggle:true})]]);
    usageSection(body,[['用 Button Group','2～4 個彼此相關、使用頻率相近的動作。'],['改用 Segmented','切換的是「檢視方式」，一次只能選一個。'],['改用 Action Menu','動作超過 4 個，或不常用。']]);
    const sl=section(body,'互動預覽與程式碼','切 variant／size、開關圖示與切換模式。');LIVE['button-group'](sl);
  }

  /* ---------- LINK 連結 ---------- */
  const LNK_EXT=PI('arrow-up-right');
  function lnkEl(variant,state,o){o=o||{};const a=document.createElement('a');a.href='#';a.className=`lnk lnk-${variant} st-${state}`+(o.external?' lnk-ext':'');
    a.onclick=e=>e.preventDefault(); // 示意用，不換頁
    if(state==='disabled'){a.setAttribute('aria-disabled','true');a.tabIndex=-1;}
    a.innerHTML=`<span>${o.text||(variant==='inline'?'使用條款':'查看全部訂單')}</span>`+(o.external?`<span class="lnk-ic">${LNK_EXT}</span>`:variant==='standalone'?`<span class="lnk-ic">${ICON_ARROW}</span>`:'');
    if(o.external){a.setAttribute('target','_blank');a.setAttribute('rel','noopener');a.setAttribute('aria-label',(o.text||'使用條款')+'（另開新視窗）');}
    if(variant==='inline'&&!o.bare){const w=ce('span','lnk-ctx');w.append('閱讀 ',a,' 後繼續');return w;}
    return a;}
  LIVE.link=(host)=>mountLive(host,{gate:'link',initial:{variant:'inline',external:false,disabled:false},
    segs:[{key:'variant',label:'Variant',options:['inline','standalone'],labels:['段落內','獨立連結']}],
    bools:[{key:'external',label:'external 外部連結'},{key:'disabled',label:'disabled 停用'}],boolLabel:'Content',
    render:st=>lnkEl(st.variant,st.disabled?'disabled':'default',{external:st.external}),
    note:'段落內連結一律有底線（不只靠顏色辨識）；獨立連結平常不帶底線、hover 時出現，並帶箭頭前推。外部連結加上「另開新視窗」的圖示與說明。'});
  function buildLink(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Link',title:'Link 連結',
      lede:'前往另一個頁面或資源的文字連結。和 <a href="#button">button</a> 的 text variant 分工：<b>會換頁的用 Link、會執行動作的用 Button</b>。兩種 variant × 五種狀態（<b>2 × 5 = 10</b>）。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>2 × 5 = 10</code>'],['token-policy','<code>semantic.action.primary</code>'],['features','external']]});
    const VN={inline:['段落內','inline'],standalone:['獨立連結','standalone']},STN={default:['預設','default'],hover:['滑過','hover'],visited:['已造訪','visited'],focus:['聚焦','focus'],disabled:['停用','disabled']};
    const axes=DIAL_SPECS.link.axes,zh=DIAL_SPECS.link.zh,active=CHOICE.link.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'content · 文字',name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(s,v)=>lnkEl(v,s,{}),mincol:220}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','底線用半透明的文字色，hover 時轉成實色；已造訪轉為次要色。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','');capRow(cs,[['外部連結',lnkEl('inline','default',{external:true,text:'Figma 社群檔'})],['獨立＋外部',lnkEl('standalone','default',{external:true,text:'開啟 GitHub'})]]);
    usageSection(body,[['用 Link','前往其他頁面、文件、外部網站。'],['改用 Button','送出、刪除、開啟對話框這類「執行動作」。'],['連結文字','寫出目的地（「查看全部訂單」），不要寫「點這裡」。']]);
    const sl=section(body,'互動預覽與程式碼','滑過看底線與箭頭動態。');LIVE.link(sl);
  }

  /* ---------- KBD 快捷鍵 ---------- */
  const KBD_MAP={mac:{mod:'⌘',shift:'⇧',alt:'⌥',ctrl:'⌃'},win:{mod:'Ctrl',shift:'Shift',alt:'Alt',ctrl:'Ctrl'}};
  function kbdEl(keys,size,variant,o){o=o||{};const g=ce('span','kbd-grp');const plat=o.platform||'mac';
    keys.forEach((k,i)=>{if(i&&plat==='win'){const pl=ce('span','kbd-plus');pl.textContent='+';pl.setAttribute('aria-hidden','true');g.appendChild(pl);}
      const kb=document.createElement('kbd');kb.className=`kbd kbd-sz-${size} kbd-v-${variant}`;kb.textContent=KBD_MAP[plat][k]||k;g.appendChild(kb);});
    return g;}
  LIVE.kbd=(host)=>mountLive(host,{gate:'kbd',initial:{platform:'mac',variant:'default',size:'m'},
    segs:[{key:'platform',label:'Platform',options:['mac','win'],labels:['macOS','Windows']},{key:'variant',label:'Variant',options:['default','ghost'],labels:['鍵帽','淡底']},{key:'size',label:'Size',options:['s','m']}],
    render:st=>{const w=ce('div');w.style.cssText='display:flex;flex-direction:column;align-items:center;gap:var(--sp-5);width:100%;';
      const list=ce('div','kbd-list');[['開啟搜尋',['mod','K']],['儲存',['mod','S']],['開啟指令面板',['shift','mod','P']],['關閉視窗',['Esc']]].forEach(([t,k])=>{const l=ce('span');l.textContent=t;list.append(l,kbdEl(k,st.size,st.variant,{platform:st.platform}));});
      const pad=ce('div','kbd-pad');pad.tabIndex=0;pad.setAttribute('aria-label','按鍵測試區');const hint=ce('span');hint.textContent='點這裡，再按任意組合鍵';const out=ce('span','kbd-grp');pad.append(out,hint);
      pad.addEventListener('keydown',e=>{if(e.key==='Tab')return;e.preventDefault();const ks=[];if(e.metaKey)ks.push(st.platform==='mac'?'mod':'Win');if(e.ctrlKey)ks.push(st.platform==='mac'?'ctrl':'mod');
        if(e.altKey)ks.push('alt');if(e.shiftKey)ks.push('shift');if(!['Meta','Control','Alt','Shift'].includes(e.key))ks.push(e.key.length===1?e.key.toUpperCase():e.key==='Escape'?'Esc':e.key);
        pad.querySelector('.kbd-grp').replaceWith(kbdEl(ks,'m',st.variant,{platform:st.platform}));const nw=pad.querySelector('.kbd-grp');nw.querySelectorAll('.kbd').forEach(k=>k.classList.add('is-down'));hint.textContent='放開看鍵帽彈回';});
      pad.addEventListener('keyup',()=>{const g=pad.querySelector('.kbd-grp');if(g)g.querySelectorAll('.kbd').forEach(k=>k.classList.remove('is-down'));hint.textContent='再按一次試試';});
      w.append(list,pad);return w;},
    note:'同一組快捷鍵依平台顯示：macOS 用符號（⌘ ⇧ ⌥），Windows 用文字並以 + 相連。按鍵測試區按下時鍵帽會壓平。'});
  function buildKbd(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Kbd',title:'Kbd 快捷鍵',
      lede:'標示鍵盤按鍵與快捷鍵的小原子，給 <a href="#tooltip">tooltip</a>、選單、指令面板取用。兩種 variant × 兩級 size（<b>2 × 2 = 4</b>），依平台切換符號與文字。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>2 × 2 = 4</code>'],['token-policy','<code>semantic.surface.* · font-mono</code>'],['features','platform (mac / win)']]});
    const VN={default:['鍵帽','default'],ghost:['淡底','ghost']},SZN={s:['小','s · 18'],m:['標準','m · 22']};
    const axes=DIAL_SPECS.kbd.axes,zh=DIAL_SPECS.kbd.zh,active=CHOICE.kbd.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'keys · ⌘ K',name:'Variant × Size',rows:vs,cols:ss,rowLab:v=>labHTML(VN[v][0],VN[v][1]),colLab:s=>labHTML(SZN[s][0],SZN[s][1]),cell:(v,s)=>kbdEl(['mod','K'],s,v),mincol:160}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','鍵帽版用在說明文件；淡底版放在選單項目右側，不搶主文字。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Kbd','告訴使用者「有更快的做法」，放在選單、tooltip、指令面板。'],['平台','依使用者的作業系統顯示 ⌘ 或 Ctrl，不要兩個並列。']]);
    const sl=section(body,'互動預覽與程式碼','切平台看符號差異；在測試區按下按鍵。');LIVE.kbd(sl);
  }

  /* ---------- DIVIDER 分隔線 ---------- */
  function dvdEl(orientation,variant,o){o=o||{};
    if(o.label&&orientation==='horizontal'){const d=ce('div',`dvd dvd-horizontal dvd-v-${variant} dvd-label`+(o.label==='start'?' dvd-start':''));d.setAttribute('role','separator');d.textContent=o.text||'或';return d;}
    const d=ce('div',`dvd dvd-${orientation} dvd-v-${variant}`);d.setAttribute('role','separator');d.setAttribute('aria-orientation',orientation);return d;}
  function dvdDemo(orientation,variant,o){
    if(orientation==='vertical'){const w=ce('div','dvd-demo-v');['首頁','文件','設定'].forEach((t,i)=>{if(i)w.appendChild(dvdEl('vertical',variant));const s=ce('span');s.textContent=t;w.appendChild(s);});return w;}
    const w=ce('div','dvd-demo-h');const a=ce('span');a.style.cssText='font-size:12px;color:var(--muted)';a.textContent='帳號設定';const b=a.cloneNode();b.textContent='通知設定';
    w.append(a,dvdEl('horizontal',variant,o),b);return w;}
  LIVE.divider=(host)=>mountLive(host,{gate:'divider',initial:{orientation:'horizontal',variant:'solid',label:'none'},
    segs:[{key:'orientation',label:'Orientation',options:['horizontal','vertical'],labels:['水平','垂直']},{key:'variant',label:'Variant',options:['solid','dashed','strong'],labels:['實線','虛線','加深']},
          {key:'label',label:'Label（水平）',options:['none','center','start'],labels:['無','置中文字','靠左文字']}],
    render:st=>dvdDemo(st.orientation,st.variant,{label:st.label==='none'?null:st.label,text:st.label==='start'?'進階設定':'或'}),
    note:'分隔線本身沒有外距，間距交給外層 Stack 的 gap 控制。'});
  function buildDivider(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Divider',title:'Divider 分隔線',
      lede:'分隔兩組內容的線。兩種方向 × 三種樣式（<b>2 × 3 = 6</b>），水平線可以帶文字。本身不帶外距，間距交給 <a href="#stack">stack</a>。',
      specRows:[['axes','<code>orientation × variant</code>'],['formula','<code>2 × 3 = 6</code>'],['token-policy','<code>semantic.border.*</code>'],['features','label (center / start)']]});
    const ON={horizontal:['水平','horizontal'],vertical:['垂直','vertical']},VN={solid:['實線','solid'],dashed:['虛線','dashed'],strong:['加深','strong']};
    const axes=DIAL_SPECS.divider.axes,zh=DIAL_SPECS.divider.zh,active=CHOICE.divider.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const os=axes.orientation.filter(v=>active.orientation.has(v)),vs=axes.variant.filter(v=>active.variant.has(v));
      p.appendChild(matrixPanel({badge:'label · 無',name:'Orientation × Variant',rows:os,cols:vs,rowLab:x=>labHTML(ON[x][0],ON[x][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(x,v)=>dvdDemo(x,v,{}),mincol:220}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Orientation × Variant 矩陣','實線＝--s-border-1、加深＝--s-border-2；虛線用在「可選」或「之後再補」的區塊。');p=panelsIn(sec);renderM();
    const cs=section(body,'Label 帶文字','');capRow(cs,[['置中（登入方式之間）',dvdDemo('horizontal','solid',{label:'center'})],['靠左（區塊標題）',dvdDemo('horizontal','solid',{label:'start',text:'進階設定'})]]);
    usageSection(body,[['用 Divider','同一張卡片或面板裡，把不同主題的內容分開。'],['不需要','已經用卡片、底色或留白分開的區塊，不要再加線。']]);
    const sl=section(body,'互動預覽與程式碼','切方向、樣式、文字。');LIVE.divider(sl);
  }

  /* ---------- DESCRIPTIONS 資料清單 ---------- */
  const DSC_ROWS=()=>[['訂單編號','#20261103-018','copy'],['付款方式','信用卡 ****4321'],['出貨狀態','已出貨','tag'],['收件人','林語晨'],['電話','0912-345-678'],['配送地址','台北市大安區復興南路一段 100 號']];
  function dscEl(layout,cols,o){o=o||{};const dl=document.createElement('dl');dl.className=`dsc dsc-${layout}`+(o.bordered?' dsc-bordered':'');dl.style.setProperty('--dsc-cols',cols);
    DSC_ROWS().forEach(([k,v,kind])=>{const it=ce('div','dsc-it');const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');
      if(kind==='tag'){const t=tagEl('soft','success','default');t.querySelector('span').textContent=v;dd.appendChild(t);}else dd.append(v);
      if(kind==='copy'&&o.copy){const b=ce('button','dsc-copy');b.type='button';b.setAttribute('aria-label','複製'+k);b.innerHTML=AM_IC_COPY+'<span>複製</span>';
        b.onclick=()=>{try{navigator.clipboard&&navigator.clipboard.writeText(v).catch(()=>{});}catch(e){}swapText(b.querySelector('span'),'已複製');setTimeout(()=>swapText(b.querySelector('span'),'複製'),1400);};dd.appendChild(b);}
      it.append(dt,dd);dl.appendChild(it);});
    return dl;}
  LIVE.descriptions=(host)=>mountLive(host,{gate:'descriptions',initial:{layout:'vertical',columns:'3',bordered:false,copy:true},
    segs:[{key:'layout',label:'Layout',options:['horizontal','vertical'],labels:['標籤在左','標籤在上']},{key:'columns',label:'Columns',options:['1','2','3']}],
    bools:[{key:'bordered',label:'bordered 格線'},{key:'copy',label:'copy 可複製'}],boolLabel:'Content',
    render:st=>dscEl(st.layout,st.columns,{bordered:st.bordered,copy:st.copy}),
    note:'用 dl／dt／dd 語意結構，螢幕閱讀器會念成「名稱：值」。手機寬度自動改成單欄。'});
  function buildDescriptions(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Descriptions',title:'Descriptions 資料清單',
      lede:'成組顯示「名稱：值」的唯讀資料：訂單資訊、帳號設定、商品規格。兩種 layout × 三種欄數（<b>2 × 3 = 6</b>）。狀態取用 <a href="#tag">tag</a> 原子。',
      specRows:[['axes','<code>layout × columns</code>'],['formula','<code>2 × 3 = 6</code>'],['token-policy','<code>semantic.text.* · semantic.border.*</code>'],['features','bordered / copy']]});
    const LN={horizontal:['標籤在左','horizontal'],vertical:['標籤在上','vertical']};
    const axes=DIAL_SPECS.descriptions.axes,zh=DIAL_SPECS.descriptions.zh,active=CHOICE.descriptions.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ls=axes.layout.filter(v=>active.layout.has(v)),cs=axes.columns.filter(v=>active.columns.has(v));
      cs.forEach(c=>p.appendChild(matrixPanel({badge:'columns · '+c,name:c+' 欄',rows:ls,cols:['default'],rowLab:l=>labHTML(LN[l][0],LN[l][1]),colLab:()=>labHTML('預設','default'),cell:l=>dscEl(l,c,{}),mincol:520})));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Layout × Columns 矩陣','欄數依版面寬度選：側欄或手機 1 欄、詳情頁 2～3 欄。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','');capRow(cs,[['bordered 格線',dscEl('horizontal','2',{bordered:true})]]);
    usageSection(body,[['用 Descriptions','唯讀、成組的屬性資料。'],['改用 Table','多筆資料要比較或排序。'],['改用 Field','需要編輯的值。']]);
    const sl=section(body,'互動預覽與程式碼','切 layout／欄數、開關格線與複製。');LIVE.descriptions(sl);
  }

  /* ==================== P2 元件 · 第二批（2026-11-03）==================== */
  /* ---------- SPLITTER 分割面板 ---------- */
  function splEl(orientation,handle,o){o=o||{};const s=ce('div',`spl spl-${orientation}`);const def=o.size||40;s.style.setProperty('--spl-a',def+'%');
    const a=ce('div','spl-a');[['src',IC_FOLDER,0],['index.html',IC_FILE,1],['gallery.css',IC_FILE,0],['tokens.json',IC_FILE,0]].forEach(([t,ic,on])=>{const f=ce('div','spl-file'+(on?' on':''));f.innerHTML=ic+'<span></span>';f.querySelector('span').textContent=t;a.appendChild(f);});
    const h=ce('div','spl-h'+(handle==='grip'?' spl-h-grip':''));h.setAttribute('role','separator');h.setAttribute('aria-orientation',orientation==='horizontal'?'vertical':'horizontal');
    h.setAttribute('aria-label','調整面板大小');h.setAttribute('aria-valuemin','20');h.setAttribute('aria-valuemax','80');h.setAttribute('aria-valuenow',String(def));
    const b=ce('div','spl-b');['m','s','m','m','s'].forEach(k=>b.appendChild(ce('div','spl-ln '+k)));
    s.append(a,h,b);
    if(o.live){h.tabIndex=0;let cur=def;
      const set=(v,anim)=>{cur=Math.round(Math.max(20,Math.min(80,v)));s.classList.toggle('is-reset',!!anim);s.style.setProperty('--spl-a',cur+'%');h.setAttribute('aria-valuenow',String(cur));
        if(anim)afterTransition(a,()=>s.classList.remove('is-reset'));};
      h.addEventListener('pointerdown',e=>{e.preventDefault();h.setPointerCapture(e.pointerId);h.classList.add('is-drag');const r=s.getBoundingClientRect();
        const mv=ev=>set(orientation==='horizontal'?(ev.clientX-r.left)/r.width*100:(ev.clientY-r.top)/r.height*100);
        const up=()=>{h.classList.remove('is-drag');h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up);};
        h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up);});
      h.addEventListener('dblclick',()=>set(def,true));
      h.addEventListener('keydown',e=>{const k=e.key,st=e.shiftKey?10:5;const fw=orientation==='horizontal'?'ArrowRight':'ArrowDown',bw=orientation==='horizontal'?'ArrowLeft':'ArrowUp';
        if(k===fw)set(cur+st,true);else if(k===bw)set(cur-st,true);else if(k==='Home')set(20,true);else if(k==='End')set(80,true);else if(k==='Enter')set(def,true);else return;e.preventDefault();});}
    return s;}
  LIVE.splitter=(host)=>mountLive(host,{gate:'splitter',initial:{orientation:'horizontal',handle:'line'},
    segs:[{key:'orientation',label:'Orientation',options:['horizontal','vertical'],labels:['左右','上下']},{key:'handle',label:'Handle',options:['line','grip'],labels:['細線','握把']}],
    render:st=>splEl(st.orientation,st.handle,{live:true}),
    note:'拖曳分隔線調整大小（20%～80%）；聚焦後可用方向鍵（按住 Shift 一次 10%）、Home／End 到最小／最大；雙擊或按 Enter 還原預設比例，還原時有過渡。'});
  function buildSplitter(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Splitter',title:'Splitter 分割面板',
      lede:'兩個並排面板之間可拖曳的分隔線：檔案樹＋編輯區、清單＋詳情。兩種方向 × 兩種握把（<b>2 × 2 = 4</b>），支援鍵盤與雙擊還原。',
      specRows:[['axes','<code>orientation × handle</code>'],['formula','<code>2 × 2 = 4</code>'],['token-policy','<code>semantic.border.* · semantic.action.primary</code>'],['features','min / max / keyboard / reset']]});
    const ON={horizontal:['左右','horizontal'],vertical:['上下','vertical']},HN={line:['細線','line'],grip:['握把','grip']};
    const axes=DIAL_SPECS.splitter.axes,zh=DIAL_SPECS.splitter.zh,active=CHOICE.splitter.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const os=axes.orientation.filter(v=>active.orientation.has(v)),hs=axes.handle.filter(v=>active.handle.has(v));
      p.appendChild(matrixPanel({badge:'size · 40%',name:'Orientation × Handle',rows:os,cols:hs,rowLab:x=>labHTML(ON[x][0],ON[x][1]),colLab:x=>labHTML(HN[x][0],HN[x][1]),cell:(x,hd)=>{const e=splEl(x,hd,{});e.style.height='160px';return e;},mincol:300}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Orientation × Handle 矩陣','細線版看起來就是一般的邊框，hover 才變色；握把版在分隔線中間多一條提示，適合使用者不知道可以拖的情境。可點擊範圍都擴大到 9px。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Splitter','使用者需要依內容自己調整兩區的比例（程式碼、表格、長清單）。'],['改用 Stack／Grid','比例固定、不需要調整。'],['記住比例','真實產品裡把使用者調好的比例存起來，下次打開還原。']]);
    const sl=section(body,'互動預覽與程式碼','拖曳、方向鍵、雙擊還原。');LIVE.splitter(sl);
  }

  /* ---------- SCROLL AREA 捲動區 ---------- */
  function scaEl(orientation,visibility,o){o=o||{};const s=ce('div',`sca sca-${orientation} sca-${visibility}`);
    const vp=ce('div','sca-vp');vp.tabIndex=0;vp.setAttribute('role','region');vp.setAttribute('aria-label',orientation==='vertical'?'通知列表（可捲動）':'相簿（可橫向捲動）');
    if(o.height)s.style.setProperty('--sca-h',o.height+'px');
    if(orientation==='vertical'){[['訂單已出貨','3 分鐘前'],['新的留言','12 分鐘前'],['付款成功','1 小時前'],['優惠券即將到期','2 小時前'],['林語晨 加入了專案','昨天'],['系統維護通知','昨天'],['密碼已變更','3 天前'],['新的登入裝置','5 天前'],['週報已產生','1 週前']]
      .forEach(([t,m])=>vp.appendChild(lstRowBasic('default',{title:t,meta:m})));}
    else{for(let i=1;i<=10;i++){const c=ce('div','sca-chip');c.textContent='照片 '+i;vp.appendChild(c);}}
    const fa=ce('span','sca-fade a'),fb=ce('span','sca-fade b');fa.setAttribute('aria-hidden','true');fb.setAttribute('aria-hidden','true');s.append(vp,fa,fb);
    const upd=()=>{const v=orientation==='vertical';const pos=v?vp.scrollTop:vp.scrollLeft,max=v?vp.scrollHeight-vp.clientHeight:vp.scrollWidth-vp.clientWidth;
      s.classList.toggle('can-a',pos>2);s.classList.toggle('can-b',max-pos>2);};
    vp.addEventListener('scroll',upd,{passive:true});requestAnimationFrame(upd);setTimeout(upd,300);
    return s;}
  LIVE['scroll-area']=(host)=>mountLive(host,{gate:'scroll-area',initial:{orientation:'vertical',visibility:'always'},
    segs:[{key:'orientation',label:'Orientation',options:['vertical','horizontal'],labels:['垂直','水平']},{key:'visibility',label:'Scrollbar',options:['always','hover'],labels:['一直顯示','滑過才顯示']}],
    render:st=>scaEl(st.orientation,st.visibility,{}),
    note:'捲軸統一成細版（不受作業系統預設影響），邊緣的漸層提示「這個方向還有內容」，捲到底就消失。可聚焦，用方向鍵／空白鍵捲動。'});
  function buildScrollArea(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Scroll Area',title:'Scroll Area 捲動區',
      lede:'固定高度（或寬度）、內容超出時捲動的區塊：通知清單、下拉選單、橫向相簿。兩種方向 × 兩種捲軸顯示（<b>2 × 2 = 4</b>），內容取用 <a href="#list-item">list-item</a>。',
      specRows:[['axes','<code>orientation × scrollbar</code>'],['formula','<code>2 × 2 = 4</code>'],['token-policy','<code>semantic.border.strong · semantic.surface.*</code>'],['features','edge fade / keyboard']]});
    const ON={vertical:['垂直','vertical'],horizontal:['水平','horizontal']},VN={always:['一直顯示','always'],hover:['滑過才顯示','hover']};
    const axes=DIAL_SPECS['scroll-area'].axes,zh=DIAL_SPECS['scroll-area'].zh,active=CHOICE['scroll-area'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const os=axes.orientation.filter(v=>active.orientation.has(v)),vs=axes.scrollbar.filter(v=>active.scrollbar.has(v));
      p.appendChild(matrixPanel({badge:'height · 160',name:'Orientation × Scrollbar',rows:os,cols:vs,rowLab:x=>labHTML(ON[x][0],ON[x][1]),colLab:x=>labHTML(VN[x][0],VN[x][1]),cell:(x,v)=>scaEl(x,v,{height:160}),mincol:300}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Orientation × Scrollbar 矩陣','「滑過才顯示」適合空間很擠的側欄；一般清單建議一直顯示，讓使用者一眼知道可以捲。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Scroll Area','區塊高度必須固定（側欄、彈窗、下拉選單）而內容可能很長。'],['不要用','整頁內容 —— 讓頁面自然捲動就好，巢狀捲動很難操作。'],['橫向捲動','要有邊緣漸層或露出半張卡片，不然使用者不知道右邊還有。']]);
    const sl=section(body,'互動預覽與程式碼','捲動看邊緣漸層的出現與消失。');LIVE['scroll-area'](sl);
  }

  /* ---------- NUMBER INPUT 數字欄位 ---------- */
  function nmiEl(variant,state,o){o=o||{};const min=o.min??0,max=o.max??100,step=o.step??1;const w=ce('div','nmi');
    const f=ce('div',`field v-outline st-${state}`);const inp=document.createElement('input');inp.className='bare';inp.type='text';inp.inputMode='decimal';
    inp.value=String(o.value??(state==='error'?120:24));inp.setAttribute('role','spinbutton');inp.setAttribute('aria-label',o.label||'寬度');
    inp.setAttribute('aria-valuemin',min);inp.setAttribute('aria-valuemax',max);inp.setAttribute('aria-valuenow',inp.value);
    if(state==='disabled')inp.disabled=true;if(state==='error')inp.setAttribute('aria-invalid','true');if(!o.live)inp.readOnly=true;
    f.appendChild(inp);
    if(o.unit!==false){const u=ce('span','nmi-unit');u.textContent=o.unit||'px';f.appendChild(u);}
    let up,dn;
    if(variant==='stacked'){const k=ce('div','nmi-stk');up=document.createElement('button');dn=document.createElement('button');
      [[up,'增加'],[dn,'減少']].forEach(([b,l])=>{b.type='button';b.tabIndex=-1;b.innerHTML=ICON_CARET;b.setAttribute('aria-label',l);if(state==='disabled')b.disabled=true;k.appendChild(b);});f.appendChild(k);}
    w.appendChild(f);
    if(o.live&&state!=='disabled'){const dec=String(step).includes('.')?String(step).split('.')[1].length:0;
      const bump=()=>{f.classList.remove('is-bump');void f.offsetWidth;f.classList.add('is-bump');afterAnim(inp,()=>f.classList.remove('is-bump'));};
      const sync=()=>{const n=parseFloat(inp.value);const bad=isNaN(n)||n<min||n>max;f.classList.toggle('st-error',bad);inp.setAttribute('aria-invalid',String(bad));
        if(!isNaN(n))inp.setAttribute('aria-valuenow',String(n));if(up){up.disabled=!isNaN(n)&&n>=max;dn.disabled=!isNaN(n)&&n<=min;}if(o.onChange)o.onChange(n,bad);};
      const add=d=>{let n=parseFloat(inp.value);if(isNaN(n))n=min;const nx=+(Math.max(min,Math.min(max,n+d))).toFixed(dec);if(nx===n&&(n===min||n===max))bump();inp.value=String(nx);sync();};
      inp.addEventListener('keydown',e=>{const m=e.shiftKey?10:1;if(e.key==='ArrowUp'){e.preventDefault();add(step*m);}else if(e.key==='ArrowDown'){e.preventDefault();add(-step*m);}
        else if(e.key==='Home'){e.preventDefault();inp.value=String(min);sync();}else if(e.key==='End'){e.preventDefault();inp.value=String(max);sync();}});
      inp.addEventListener('input',sync);
      inp.addEventListener('blur',()=>{const n=parseFloat(inp.value);if(isNaN(n))return;const c=+(Math.max(min,Math.min(max,n))).toFixed(dec);if(c!==n){inp.value=String(c);bump();sync();}});
      if(up){up.onmousedown=e=>e.preventDefault();dn.onmousedown=e=>e.preventDefault();up.onclick=()=>{add(step);inp.focus();};dn.onclick=()=>{add(-step);inp.focus();};}
      setTimeout(sync,0);}
    return w;}
  LIVE['number-input']=(host)=>mountLive(host,{gate:'number-input',initial:{variant:'stacked',step:'1',unit:true},
    segs:[{key:'variant',label:'Variant',options:['stacked','plain'],labels:['上下鈕','純輸入']},{key:'step',label:'Step',options:['1','5','0.1']}],
    bools:[{key:'unit',label:'unit 單位'}],boolLabel:'Content',
    render:st=>{const w=ce('div');w.style.cssText='display:flex;flex-direction:column;align-items:center;gap:var(--sp-3);';
      const hint=ce('span');hint.style.cssText='font-size:var(--fs-h12);color:var(--muted);';hint.textContent='範圍 0～100';
      w.append(nmiEl(st.variant,'default',{live:true,step:parseFloat(st.step),value:st.step==='0.1'?2.4:24,unit:st.unit?'px':false,
        onChange:(n,bad)=>{hint.textContent=bad?'請輸入 0～100 之間的數字':'範圍 0～100';hint.style.color=bad?'var(--i-danger)':'var(--muted)';}}),hint);return w;},
    note:'方向鍵 ↑↓ 加減一個 step（按住 Shift 一次 10 倍），Home／End 到最小／最大；超出範圍即時標紅，離開欄位時自動夾回範圍內，碰到上下限時欄位輕輕晃一下。'});
  function buildNumberInput(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Number Input',title:'Number Input 數字欄位',
      lede:'輸入精確數字的欄位：尺寸、百分比、金額、間隔秒數。取用 <a href="#input">input</a> 的 field 外框，兩種 variant × 四種狀態（<b>2 × 4 = 8</b>）。電商「加入幾件」的大按鈕計數器請用 <a href="#quantity">quantity</a>。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>2 × 4 = 8</code>'],['token-policy','<code>semantic.*.input.*</code>'],['features','unit / min / max / step']]});
    const VN={stacked:['上下鈕','stacked'],plain:['純輸入','plain']},STN={default:['預設','default'],focus:['聚焦','focus'],disabled:['停用','disabled'],error:['超出範圍','error']};
    const axes=DIAL_SPECS['number-input'].axes,zh=DIAL_SPECS['number-input'].zh,active=CHOICE['number-input'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'unit · px',name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(s,v)=>nmiEl(v,s,{}),mincol:220}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','數字一律等寬（tabular-nums），加減時不會左右跳。上下鈕不進 Tab 順序，鍵盤直接用方向鍵。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','');capRow(cs,[['帶單位',nmiEl('stacked','default',{unit:'%',value:80})],['無單位',nmiEl('stacked','default',{unit:false,value:3})]]);
    usageSection(body,[['用 Number Input','需要精確數字、範圍大，或使用者通常直接打字。'],['改用 Slider','大概的值就好、需要邊拖邊看效果。'],['改用 Quantity','購物車件數這類小範圍、常用點按的加減。']]);
    const sl=section(body,'互動預覽與程式碼','用方向鍵加減，試著打入超出範圍的數字。');LIVE['number-input'](sl);
  }

  /* ---------- RATING 評分 ---------- */
  function rtgEl(size,state,o){o=o||{};let val=o.value??3.5;const half=o.half!==false;const live=!!o.live&&state==='default';
    const r=ce('div',`rtg rtg-sz-${size} rtg-${state}`+(live?' rtg-live':''));const ss=ce('div','rtg-stars');const stars=[];
    for(let i=0;i<5;i++){const b=document.createElement(live?'button':'span');b.className='rtg-s';if(live){b.type='button';b.tabIndex=-1;b.setAttribute('aria-label',(i+1)+' 星');}
      b.innerHTML=PCD_IC_STAR_FILL+`<span class="rtg-fill">${PCD_IC_STAR_FILL}</span>`;ss.appendChild(b);stars.push(b);}
    const txt=ce('span','rtg-txt');
    const paint=v=>{stars.forEach((s,i)=>s.querySelector('.rtg-fill').style.setProperty('--f',Math.max(0,Math.min(1,v-i))*100+'%'));};
    const label=v=>{txt.innerHTML=`<b>${v.toFixed(1)}</b>`+(o.count?` · ${o.count} 則評價`:'');};
    paint(val);label(val);r.appendChild(ss);if(o.showValue!==false)r.appendChild(txt);
    if(!live){ss.setAttribute('role','img');ss.setAttribute('aria-label',`評分 ${val} 顆星（滿分 5）`);if(state==='disabled')r.setAttribute('aria-disabled','true');return r;}
    ss.tabIndex=0;ss.setAttribute('role','slider');ss.setAttribute('aria-label','評分');ss.setAttribute('aria-valuemin','0');ss.setAttribute('aria-valuemax','5');
    const aria=()=>{ss.setAttribute('aria-valuenow',String(val));ss.setAttribute('aria-valuetext',val+' 顆星');};aria();
    const at=(e,i)=>{if(!half)return i+1;const rc=stars[i].getBoundingClientRect();return e.clientX-rc.left<rc.width/2?i+.5:i+1;};
    const commit=(v,i)=>{val=v;paint(val);label(val);aria();r.classList.remove('is-preview');const s=stars[Math.max(0,Math.ceil(v)-1)];if(s&&v>0){s.classList.remove('is-pop');void s.offsetWidth;s.classList.add('is-pop');afterAnim(s,()=>s.classList.remove('is-pop'));}if(o.onChange)o.onChange(val);};
    stars.forEach((s,i)=>{s.addEventListener('pointermove',e=>{r.classList.add('is-preview');const v=at(e,i);paint(v);label(v);});
      s.addEventListener('click',e=>{const v=at(e,i);commit(v===val?0:v);});});   // 再點一次同一個值＝清除
    ss.addEventListener('pointerleave',()=>{r.classList.remove('is-preview');paint(val);label(val);});
    ss.addEventListener('keydown',e=>{const st=half?.5:1;let v=val;if(e.key==='ArrowRight'||e.key==='ArrowUp')v=Math.min(5,val+st);else if(e.key==='ArrowLeft'||e.key==='ArrowDown')v=Math.max(0,val-st);
      else if(e.key==='Home')v=0;else if(e.key==='End')v=5;else return;e.preventDefault();commit(v);});
    return r;}
  LIVE.rating=(host)=>mountLive(host,{gate:'rating',initial:{size:'l',state:'default',half:true,showValue:true},
    segs:[{key:'size',label:'Size',options:['s','m','l']},{key:'state',label:'State',options:['default','readonly','disabled'],labels:['可評分','唯讀','停用']}],
    bools:[{key:'half',label:'half 半顆星'},{key:'showValue',label:'value 顯示分數'}],boolLabel:'Content',
    render:st=>rtgEl(st.size,st.state,{live:true,half:st.half,showValue:st.showValue,value:st.half?3.5:4,count:st.state==='readonly'?128:0}),
    note:'滑過時預覽分數（顏色稍淡）、離開還原；點下去星星會彈一下確認。再點一次相同分數＝清除。鍵盤用 ←→ 調整、Home／End 到 0／5。'});
  function buildRating(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Rating',title:'Rating 評分',
      lede:'顯示或輸入 0～5 顆星的評分。把商品評分的星星抽成獨立元件，三級 size × 三種狀態（<b>3 × 3 = 9</b>），支援半顆星。',
      specRows:[['axes','<code>size × state</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>semantic.feedback.warning · semantic.border.strong</code>'],['features','half / value / count']]});
    const SZN={s:['小','s · 14'],m:['標準','m · 18'],l:['大','l · 26']},STN={default:['可評分','default'],readonly:['唯讀','readonly'],disabled:['停用','disabled']};
    const axes=DIAL_SPECS.rating.axes,zh=DIAL_SPECS.rating.zh,active=CHOICE.rating.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ss=axes.state.filter(v=>active.state.has(v)),zs=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'value · 3.5',name:'State × Size',rows:ss,cols:zs,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:z=>labHTML(SZN[z][0],SZN[z][1]),cell:(s,z)=>rtgEl(z,s,{}),mincol:200}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','星色用 warning 黃、空星用 border.strong；唯讀版不能點，螢幕閱讀器念成「評分 3.5 顆星」。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','');capRow(cs,[['帶評價數（商品卡）',rtgEl('s','readonly',{count:128,value:4.5})],['只有星星',rtgEl('m','readonly',{showValue:false,value:4})],['整顆星',rtgEl('m','readonly',{value:3,half:false})]]);
    usageSection(body,[['可評分','評論表單、滿意度問卷；旁邊要寫出每個分數代表什麼。'],['唯讀','商品卡、評論列表；一定要附分數與評價數，光看星星不精確。'],['改用 Segmented／Radio','選項不是「程度」而是不同類別。']]);
    const sl=section(body,'互動預覽與程式碼','滑過預覽、點擊評分、鍵盤調整。');LIVE.rating(sl);
  }

  /* ---------- CAROUSEL 輪播 ---------- */
  const CRS_SLIDES=[['雙 11 全館 85 折','11/01～11/11 · 結帳自動折抵'],['新會員首購免運','註冊即送 NT$100 購物金'],['秋冬新品上市','保暖外套 · 機能背包'],['設計師聯名系列','限量 300 組，售完為止'],['週末限時快閃','每週六 20:00 開搶']];
  function crsPhoto(i){try{return [PSC_ROT[0],CARD_PHOTO,HX_TSM_BG,PSC_ROT[2],PSC_ROT[1]][i%5];}catch(e){return null;}}   // 輪播各張用內嵌照片
  function crsEl(arrows,indicator,o){o=o||{};const n=CRS_SLIDES.length;let idx=o.index||0;
    const root=ce('div',`crs crs-arrows-${arrows} crs-ind-${indicator}`);root.setAttribute('role','region');root.setAttribute('aria-roledescription','carousel');root.setAttribute('aria-label','活動 Banner');
    const main=ce('div','crs-main');const vp=ce('div','crs-vp');const tr=ce('div','crs-track');
    CRS_SLIDES.forEach(([t,s],i)=>{const sl=ce('div','crs-slide crs-s'+i);sl.setAttribute('role','group');sl.setAttribute('aria-roledescription','slide');sl.setAttribute('aria-label',`${i+1} / ${n}`);
      {const ph=crsPhoto(i);if(ph)sl.style.backgroundImage='linear-gradient(180deg,color-mix(in srgb,var(--c-neutral-900) 10%,transparent),color-mix(in srgb,var(--c-neutral-900) 68%,transparent)),url("'+ph+'")';sl.style.backgroundSize='cover';sl.style.backgroundPosition='center 35%';sl.style.backgroundRepeat='no-repeat';}   // 照片底＋下方加深，文字維持可讀
      const b=ce('b');b.textContent=t;const sp=ce('span');sp.textContent=s;sl.append(b,sp);tr.appendChild(sl);});
    vp.appendChild(tr);main.appendChild(vp);
    const mkArrow=dir=>{const b=mkBtn({variant:'outline',intent:'secondary',size:'s',iconOnly:true,isLive:!!o.live});b.classList.add('crs-arrow',dir);b.innerHTML=ICON_CARET;b.setAttribute('aria-label',dir==='prev'?'上一張':'下一張');return b;};
    const prev=mkArrow('prev'),next=mkArrow('next');
    let num,dots;
    if(indicator==='number'){num=ce('span','crs-num');num.setAttribute('aria-hidden','true');main.appendChild(num);}
    if(arrows==='inside')main.append(prev,next);
    if(arrows==='outside')root.append(prev,main,next);else root.appendChild(main);
    if(indicator==='dots'){dots=ce('div','crs-dots');for(let i=0;i<n;i++){const d=document.createElement('button');d.type='button';d.className='crs-dot';d.setAttribute('aria-label',`第 ${i+1} 張`);dots.appendChild(d);}
      (arrows==='outside'?main:root).appendChild(dots);}
    const loop=o.loop!==false;
    const go=(i,anim)=>{idx=loop?(i+n)%n:Math.max(0,Math.min(n-1,i));tr.classList.toggle('is-drag',anim===false);tr.style.transform=`translateX(${-idx*100}%)`;
      if(num)num.textContent=`${idx+1} / ${n}`;if(dots)[...dots.children].forEach((d,k)=>{d.classList.toggle('on',k===idx);d.setAttribute('aria-current',k===idx?'true':'false');});
      if(!loop){prev.disabled=idx===0;next.disabled=idx===n-1;}};
    go(idx,false);
    if(!o.live)return root;
    prev.onclick=()=>go(idx-1);next.onclick=()=>go(idx+1);
    if(dots)[...dots.children].forEach((d,k)=>d.onclick=()=>go(k));
    vp.tabIndex=0;vp.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();go(idx-1);}else if(e.key==='ArrowRight'){e.preventDefault();go(idx+1);}});
    // 拖曳：跟手、放開時超過 20% 寬或速度夠快就換頁
    vp.addEventListener('pointerdown',e=>{if(e.button)return;const x0=e.clientX,t0=performance.now(),w=vp.clientWidth;let dx=0;vp.setPointerCapture(e.pointerId);tr.classList.add('is-drag');
      const mv=ev=>{dx=ev.clientX-x0;let d=dx;if(!loop&&((idx===0&&d>0)||(idx===n-1&&d<0)))d*=.3;tr.style.transform=`translateX(calc(${-idx*100}% + ${d}px))`;};
      const up=()=>{vp.removeEventListener('pointermove',mv);vp.removeEventListener('pointerup',up);vp.removeEventListener('pointercancel',up);tr.classList.remove('is-drag');
        const v=Math.abs(dx)/(performance.now()-t0);if(Math.abs(dx)>w*.2||(v>.5&&Math.abs(dx)>20))go(idx+(dx<0?1:-1));else go(idx);};
      vp.addEventListener('pointermove',mv);vp.addEventListener('pointerup',up);vp.addEventListener('pointercancel',up);});
    if(o.autoplay){let timer=null;const stop=()=>{clearInterval(timer);timer=null;};const start=()=>{stop();timer=setInterval(()=>{if(!root.isConnected){stop();return;}go(idx+1);},3500);};
      root.addEventListener('pointerenter',stop);root.addEventListener('pointerleave',start);root.addEventListener('focusin',stop);root.addEventListener('focusout',start);start();}
    return root;}
  LIVE.carousel=(host)=>mountLive(host,{gate:'carousel',initial:{arrows:'inside',indicator:'dots',loop:true,autoplay:false},
    segs:[{key:'arrows',label:'Arrows',options:['inside','outside'],labels:['疊在圖上','放兩側']},{key:'indicator',label:'Indicator',options:['dots','number'],labels:['圓點','頁碼']}],
    bools:[{key:'loop',label:'loop 循環'},{key:'autoplay',label:'autoplay 自動播放'}],boolLabel:'Behavior',
    render:st=>crsEl(st.arrows,st.indicator,{live:true,loop:st.loop,autoplay:st.autoplay}),
    note:'可以按箭頭、點圓點、方向鍵，或直接拖曳（跟著手指走，放開時超過 20% 或甩得夠快就換頁）。自動播放時滑過或聚焦會暫停；不循環時到頭尾箭頭停用、拖曳有阻尼。'});
  function buildCarousel(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Carousel',title:'Carousel 輪播',
      lede:'一次顯示一張、可左右切換的內容：首頁 Banner、商品圖集。箭頭取用 <a href="#button">button</a> 原子，兩種箭頭位置 × 兩種指示器（<b>2 × 2 = 4</b>）。',
      specRows:[['axes','<code>arrows × indicator</code>'],['formula','<code>2 × 2 = 4</code>'],['token-policy','<code>semantic.action.primary · primitive color ramps</code>'],['features','loop / autoplay / drag / keyboard']]});
    const AN={inside:['疊在圖上','inside'],outside:['放兩側','outside']},IN={dots:['圓點','dots'],number:['頁碼','number']};
    const axes=DIAL_SPECS.carousel.axes,zh=DIAL_SPECS.carousel.zh,active=CHOICE.carousel.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const as=axes.arrows.filter(v=>active.arrows.has(v)),is=axes.indicator.filter(v=>active.indicator.has(v));
      p.appendChild(matrixPanel({badge:'slides · 5',name:'Arrows × Indicator',rows:as,cols:is,rowLab:x=>labHTML(AN[x][0],AN[x][1]),colLab:x=>labHTML(IN[x][0],IN[x][1]),cell:(a,i)=>crsEl(a,i,{index:1}),mincol:380}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Arrows × Indicator 矩陣','圓點適合 5 張以內；超過就改頁碼。指示點切換時，選中的那顆會拉長成膠囊。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Carousel','同等重要、可以輪流看的內容（活動 Banner、同一商品的多張圖）。'],['不要用','重要資訊 —— 第二張之後的點擊率很低，重要的直接攤開。'],['自動播放','要能暫停（滑過、聚焦即停）；有文字時間隔至少 3 秒以上。']]);
    const sl=section(body,'互動預覽與程式碼','點、拖、方向鍵都可以切換。');LIVE.carousel(sl);
  }

  /* ---------- HOVER CARD 資訊卡 ---------- */
  function hvcEl(placement,size,o){o=o||{};const pp=ce('div',`pop hvc pop-p-${placement} sz-${size}`);pp.setAttribute('role','dialog');pp.setAttribute('aria-label','林語晨 的個人資訊');
    if(o.arrow!==false)pp.appendChild(ce('span','pop-arrow'));
    const hd=ce('div','hvc-head');const av=avtEl(size==='s'?'m':'l','circle','initials',{initials:'林',status:'online'});
    const nm=ce('div');nm.innerHTML='<div class="hvc-name">林語晨</div><div class="hvc-role">產品設計師 · @yuchen</div>';hd.append(av,nm);pp.appendChild(hd);
    if(size!=='s'){const bio=ce('div','hvc-bio');bio.textContent='負責元件庫與設計規範，最近在整理動態 token。';pp.appendChild(bio);
      const sts=ce('div','hvc-stats');sts.innerHTML='<span><b>128</b>追蹤中</span><span><b>2.4k</b>追蹤者</span>';pp.appendChild(sts);}
    if(o.footer!==false){const ft=ce('div','hvc-foot');const a=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:!!o.live});a.querySelector('span').textContent='追蹤';
      const b=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:!!o.live});b.querySelector('span').textContent='傳訊息';ft.append(a,b);pp.appendChild(ft);}
    else pp.style.paddingBottom='var(--sp-4)';
    return pp;}
  /* 互動：滑過（或聚焦）等 --dur-hover-delay 才出現；離開後有 150ms 緩衝，滑進卡片裡不會消失；Esc 關閉 */
  function hvcLive(placement,size,o){const stage=ce('div','pop-live-stage hvc-live-stage');const txt=ce('p','hvc-trig');
    const wrap=ce('span','pop-wrap');const lk=lnkEl('inline','default',{bare:true,text:'@林語晨'});const card=hvcEl(placement,size,Object.assign({live:true},o));card.classList.add('pop-float');
    card.id='hvc-'+Math.random().toString(36).slice(2,8);lk.setAttribute('aria-describedby',card.id);
    wrap.append(lk,card);txt.append('這次的動態規範由 ',wrap,' 整理，歡迎留言討論。');stage.appendChild(txt);
    const delay=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-hover-delay'))||250;let tIn=null,tOut=null;
    const open=()=>{clearTimeout(tOut);if(card.classList.contains('is-open'))return;clearTimeout(tIn);tIn=setTimeout(()=>card.classList.add('is-open'),delay);};
    const close=now=>{clearTimeout(tIn);clearTimeout(tOut);if(now){card.classList.remove('is-open');return;}tOut=setTimeout(()=>card.classList.remove('is-open'),150);};
    wrap.addEventListener('pointerenter',open);wrap.addEventListener('pointerleave',()=>close());
    lk.addEventListener('focus',()=>{clearTimeout(tOut);card.classList.add('is-open');});wrap.addEventListener('focusout',e=>{if(!wrap.contains(e.relatedTarget))close(true);});
    wrap.addEventListener('keydown',e=>{if(e.key==='Escape'&&card.classList.contains('is-open')){close(true);lk.focus();}});
    return stage;}
  LIVE['hover-card']=(host)=>mountLive(host,{gate:'hover-card',initial:{placement:'bottom',size:'m',arrow:true,footer:true},
    segs:[{key:'placement',label:'Placement',options:['bottom','top','left','right'],labels:['下方','上方','左側','右側']},{key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'arrow',label:'arrow 箭頭'},{key:'footer',label:'footer 動作列'}],boolLabel:'Content',
    render:st=>hvcLive(st.placement,st.size,{arrow:st.arrow,footer:st.footer}),
    note:'滑過人名停一下（--dur-hover-delay，250ms）才出現，避免滑鼠路過就跳出來；移開後有 150ms 緩衝，可以把滑鼠移進卡片按按鈕。Tab 聚焦也會打開，Esc 關閉。'});
  function buildHoverCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Hover Card',title:'Hover Card 資訊卡',
      lede:'滑過人名、連結時浮出的預覽小卡，<b>讓使用者不用點進去就能先看重點</b>。卡片與定位沿用 <a href="#popover">popover</a>，內容取用 <a href="#avatar">avatar</a> 與 <a href="#button">button</a>。四向 placement × 三級 size（<b>4 × 3 = 12</b>）。',
      specRows:[['axes','<code>placement × size</code>'],['formula','<code>4 × 3 = 12</code>'],['token-policy','<code>semantic.*.popover.* · motion.hover-delay</code>'],['features','arrow / footer']]});
    const PZ={bottom:['下方','bottom'],top:['上方','top'],left:['左側','left'],right:['右側','right']},SZN={s:['精簡','s · 220'],m:['標準','m · 280'],l:['寬','l · 340']};
    const axes=DIAL_SPECS['hover-card'].axes,zh=DIAL_SPECS['hover-card'].zh,active=CHOICE['hover-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ps=axes.placement.filter(v=>active.placement.has(v)),ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'content · 個人資訊',name:'Placement × Size（箭頭指向觸發文字）',rows:ps,cols:ss,rowLab:x=>labHTML(PZ[x][0],PZ[x][1]),colLab:x=>labHTML(SZN[x][0],SZN[x][1]),cell:(pl,sz)=>hvcEl(pl,sz,{}),mincol:390}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Placement × Size 矩陣','精簡版只有頭像與名稱，適合留言列表；標準與寬版多了簡介與數據。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Hover Card','預覽「點進去才看得到」的資訊（個人檔案、連結預覽）；卡片裡的內容在目的頁也找得到。'],['改用 Tooltip','只是一句說明文字。'],['改用 Popover','內容需要點擊才打開，或手機也要能用（手機沒有 hover）。']]);
    const sl=section(body,'互動預覽與程式碼','滑過「@林語晨」，或用 Tab 聚焦。');LIVE['hover-card'](sl);
  }

  /* ==================== P2 元件 · 第三批（2026-11-03）==================== */
  /* ---------- CONTEXT MENU 右鍵選單 ---------- */
  const CTX_ITEMS=()=>[{label:'剪下',icon:AM_IC_COPY,keys:['mod','X']},{label:'複製',icon:AM_IC_COPY,keys:['mod','C']},{label:'貼上',icon:IC_FILE,keys:['mod','V']},
    {div:true},{label:'重新命名',icon:ICON_PENCIL,keys:['Enter']},{label:'移到資料夾',icon:IC_FOLDER,sub:true},{div:true},{label:'刪除',icon:IC_TRASH,keys:['⌫'],danger:true}];
  function ctxPanel(variant,size,o){o=o||{};const p=ce('div','am-panel ctx sz-'+size);p.setAttribute('role','menu');p.setAttribute('aria-label','檔案動作');
    CTX_ITEMS().forEach((it,i)=>{if(it.div){const d=ce('div','am-divider');d.setAttribute('role','separator');p.appendChild(d);return;}
      const el=amItem(it.label,{icon:variant==='default'?null:it.icon,danger:it.danger,state:o.hover===i?'hover':null});el.setAttribute('role','menuitem');el.tabIndex=-1;
      if(variant==='with-shortcut'&&it.keys)el.appendChild(kbdEl(it.keys,'s','ghost',{platform:'mac'}));
      if(it.sub){const c=ce('span','ctx-sub');c.innerHTML=ICON_CARET;c.setAttribute('aria-hidden','true');el.appendChild(c);el.setAttribute('aria-haspopup','menu');}
      p.appendChild(el);});
    return p;}
  function ctxLive(variant,size){const z=ce('div','ctx-zone');z.tabIndex=0;z.setAttribute('aria-label','檔案區：按右鍵或 Shift＋F10 開啟選單');
    const tip=ce('span');tip.textContent='在這裡按右鍵（或聚焦後按 Shift＋F10）';const log=ce('span','ctx-log');log.setAttribute('aria-live','polite');
    const p=ctxPanel(variant,size);z.append(tip,p,log);const items=()=>[...p.querySelectorAll('.am-item')];
    const close=(back)=>{p.classList.remove('is-open');z.classList.remove('is-active');if(back)z.focus({preventScroll:true});};
    const open=(x,y,kb)=>{p.classList.remove('is-open');z.classList.add('is-active');
      const zw=z.clientWidth,zh=z.clientHeight,pw=p.offsetWidth,ph=p.offsetHeight;const fx=x+pw>zw-8,fy=y+ph>zh-8;   // 靠邊時往反方向開
      p.style.left=Math.max(8,fx?x-pw:x)+'px';p.style.top=Math.max(8,fy?y-ph:y)+'px';p.style.transformOrigin=(fy?'bottom ':'top ')+(fx?'right':'left');
      void p.offsetWidth;p.classList.add('is-open');if(kb)setTimeout(()=>items()[0].focus({preventScroll:true}),30);};
    z.addEventListener('contextmenu',e=>{e.preventDefault();const r=z.getBoundingClientRect();open(e.clientX-r.left,e.clientY-r.top,false);});
    z.addEventListener('keydown',e=>{const its=items(),i=its.indexOf(document.activeElement);
      if((e.shiftKey&&e.key==='F10')||e.key==='ContextMenu'){e.preventDefault();open(z.clientWidth/2-60,z.clientHeight/2-80,true);return;}
      if(!p.classList.contains('is-open'))return;
      if(e.key==='Escape'){e.preventDefault();close(true);}
      else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=e.key==='ArrowDown'?(i+1)%its.length:(i<=0?its.length-1:i-1);its[n].focus({preventScroll:true});}
      else if((e.key==='Enter'||e.key===' ')&&i>=0){e.preventDefault();its[i].click();}});
    p.addEventListener('click',e=>{const it=e.target.closest('.am-item');if(!it)return;e.stopPropagation();log.textContent='已執行：'+it.querySelector('.am-lb').textContent;close(true);});
    const outside=e=>{if(!z.isConnected){document.removeEventListener('pointerdown',outside);return;}if(!p.contains(e.target))close(false);};
    document.addEventListener('pointerdown',outside);
    return z;}
  LIVE['context-menu']=(host)=>mountLive(host,{gate:'context-menu',initial:{variant:'with-shortcut',size:'m'},
    segs:[{key:'variant',label:'Variant',options:['default','with-icon','with-shortcut'],labels:['純文字','帶圖示','帶快捷鍵']},{key:'size',label:'Size',options:['s','m','l']}],
    render:st=>ctxLive(st.variant,st.size),
    note:'選單從游標位置展開，靠右／靠下時自動往反方向開，展開原點跟著換角。鍵盤：Shift＋F10 開啟、↑↓ 移動、Enter 執行、Esc 關閉並把焦點還給原本的區塊。'});
  function buildContextMenu(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Context Menu',title:'Context Menu 右鍵選單',
      lede:'在項目上按右鍵（或長按）出現的動作選單。面板與項目直接取用 <a href="#action-menu">action-menu</a>，快捷鍵取用 <a href="#kbd">kbd</a>。三種 variant × 三級 size（<b>3 × 3 = 9</b>）。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>semantic.*.menu.*</code>'],['features','submenu / danger / keyboard']]});
    const VN={default:['純文字','default'],'with-icon':['帶圖示','with-icon'],'with-shortcut':['帶快捷鍵','with-shortcut']},SZN={s:['小','s'],m:['標準','m'],l:['大','l']};
    const axes=DIAL_SPECS['context-menu'].axes,zh=DIAL_SPECS['context-menu'].zh,active=CHOICE['context-menu'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'state · 第二項 hover',name:'Variant × Size',rows:vs,cols:ss,rowLab:v=>labHTML(VN[v][0],VN[v][1]),colLab:s=>labHTML(SZN[s][0],SZN[s][1]),cell:(v,s)=>ctxPanel(v,s,{hover:1}),mincol:240}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','和 action-menu 同一組 token；差別只在觸發方式（右鍵、長按）與「從游標位置展開」。危險動作放最後並用分隔線隔開。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Context Menu','桌面型工具裡的「進階捷徑」（檔案、表格列、畫布物件）。'],['一定要有替代入口','右鍵不好發現，同樣的動作也要放在 action-menu 或工具列。'],['改用 Action Menu','一般網頁、手機 —— 使用者不會想到按右鍵。']]);
    const sl=section(body,'互動預覽與程式碼','在虛線框裡按右鍵。');LIVE['context-menu'](sl);
  }

  /* ---------- COMMAND 指令面板 ---------- */
  function cmdData(){const comps=[];NAV.forEach(g=>g.items.forEach(it=>{if(it.st==='ready')comps.push({id:it.id,label:it.name,icon:IC_FILE});}));
    return {suggest:[{id:'guide',label:'上手指南',icon:ICON_HOUSE,keys:['mod','G']},{id:'tokens',label:'Design Token',icon:ICON_GEAR,keys:['mod','T']},{id:'button',label:'Button 按鈕',icon:IC_FILE,keys:['mod','B']}],comps};}
  function cmdHL(txt,q){if(!q)return txt.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));const i=txt.toLowerCase().indexOf(q.toLowerCase());
    const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));return i<0?esc(txt):esc(txt.slice(0,i))+'<mark>'+esc(txt.slice(i,i+q.length))+'</mark>'+esc(txt.slice(i+q.length));}
  function cmdEl(state,size,o){o=o||{};const c=ce('div',`cmd cmd-sz-${size}`);c.setAttribute('role','dialog');c.setAttribute('aria-label','指令面板');
    const sr=ce('div','cmd-search');sr.innerHTML=ICON_SEARCH;const inp=document.createElement('input');inp.type='text';inp.placeholder='搜尋元件、頁面或指令…';
    inp.setAttribute('role','combobox');inp.setAttribute('aria-expanded','true');inp.setAttribute('aria-autocomplete','list');
    const lid='cmd-'+Math.random().toString(36).slice(2,7);inp.setAttribute('aria-controls',lid);
    inp.value=o.query!=null?o.query:state==='results'?'ta':state==='empty'?'藍色按鈕':'';if(!o.live)inp.readOnly=true;
    sr.append(inp,kbdEl(['Esc'],'s','ghost'));c.appendChild(sr);
    const list=ce('div','cmd-list');list.id=lid;list.setAttribute('role','listbox');c.appendChild(list);
    const foot=ce('div','cmd-foot');[[['↑','↓'],'移動'],[['↵'],'開啟'],[['Esc'],'關閉']].forEach(([k,t])=>{const s=ce('span');s.append(kbdEl(k,'m','default'),t);foot.appendChild(s);});c.appendChild(foot);
    const D=cmdData();let act=0,flat=[];
    const draw=()=>{const q=inp.value.trim();list.innerHTML='';flat=[];
      const grps=q?[['元件',D.comps.map(x=>{const b=fzBest(q,x.label,[x.id,SS_ALIAS[x.id]||'']);return b?Object.assign({},x,{_hit:b.hit,_s:b.s}):null;}).filter(Boolean).sort((a,b)=>b._s-a._s).slice(0,8)]]:[['建議',D.suggest],['最近瀏覽',D.comps.filter(x=>['table','date-picker','modal'].includes(x.id))]];
      grps.forEach(([h,its])=>{if(!its.length)return;const g=ce('div','cmd-grp');g.setAttribute('role','group');const hh=ce('div','cmd-grp-h');hh.textContent=h;g.appendChild(hh);
        its.forEach(x=>{const it=ce('div','cmd-it');it.setAttribute('role','option');it.id=lid+'-'+flat.length;it.innerHTML=x.icon+`<span class="cmd-lb">${x._hit?fzHL(x.label,x._hit):cmdHL(x.label,'')}</span>`;
          if(x.keys)it.appendChild(kbdEl(x.keys,'s','ghost'));else if(x.meta){const m=ce('span','cmd-meta');m.textContent=x.meta;it.appendChild(m);}
          const k=flat.length;it.addEventListener('pointermove',()=>{if(act!==k){act=k;mark();}});it.addEventListener('click',()=>pick(k));
          flat.push({x,el:it});g.appendChild(it);});list.appendChild(g);});
      if(!flat.length){const e=empEl('search','s',{primary:false,secondary:false});e.querySelector('.emp-title').textContent=`找不到「${q}」`;e.querySelector('.emp-desc').textContent='試試元件英文名稱，例如 table、modal。';list.appendChild(e);}
      act=Math.min(act,Math.max(0,flat.length-1));mark();};
    const mark=()=>{flat.forEach((f,i)=>{f.el.classList.toggle('is-active',i===act);f.el.setAttribute('aria-selected',String(i===act));});
      if(flat[act]){inp.setAttribute('aria-activedescendant',flat[act].el.id);if(o.live)flat[act].el.scrollIntoView({block:'nearest'});}else inp.removeAttribute('aria-activedescendant');};
    const pick=k=>{const f=flat[k];if(!f)return;if(o.onPick)o.onPick(f.x);};
    if(o.live){let comp=false;inp.addEventListener('compositionstart',()=>{comp=true;});inp.addEventListener('compositionend',()=>{comp=false;act=0;draw();});
      inp.addEventListener('input',e=>{if(comp||e.isComposing)return;act=0;draw();});
      inp.addEventListener('keydown',e=>{if(e.isComposing||e.keyCode===229)return;if(e.key==='ArrowDown'){e.preventDefault();act=(act+1)%Math.max(1,flat.length);mark();}else if(e.key==='ArrowUp'){e.preventDefault();act=(act-1+flat.length)%Math.max(1,flat.length);mark();}
        else if(e.key==='Enter'){e.preventDefault();pick(act);}else if(e.key==='Escape'&&o.onClose){e.preventDefault();o.onClose();}});}
    draw();if(state==='default'&&!o.live&&flat[1])act=1,mark();
    return c;}
  function cmdLive(size){const w=ce('div','cmd-live');const msg=ce('span');msg.style.cssText='font-size:var(--fs-h12);color:var(--muted);min-height:1.4em;';msg.setAttribute('aria-live','polite');
    const trg=mkBtn({variant:'outline',intent:'secondary',size:'m',isLive:true});trg.querySelector('span').textContent='搜尋元件';trg.appendChild(kbdEl(['mod','K'],'s','ghost'));trg.style.gap='var(--sp-3)';
    let c=null;const mount=()=>{const n=cmdEl('default',size,{live:true,onPick:x=>{msg.innerHTML='';msg.append('前往 ');const a=document.createElement('a');a.className='lnk lnk-inline';a.href='#'+x.id;a.textContent=x.label;msg.append(a,'（點連結換頁）');},
        onClose:()=>{c.remove();c=null;trg.focus();msg.textContent='已關閉，按按鈕或 ⌘K 重新開啟';}});
      if(c)c.replaceWith(n);else w.insertBefore(n,msg);c=n;c.classList.add('is-in');setTimeout(()=>c&&c.querySelector('input').focus({preventScroll:true}),30);};
    trg.onclick=mount;
    w.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();mount();}});
    w.append(trg,msg);mount();return w;}
  LIVE.command=(host)=>mountLive(host,{gate:'command',initial:{size:'m'},
    segs:[{key:'size',label:'Size',options:['m','l']}],
    render:st=>cmdLive(st.size),
    note:'這裡搜的是元件庫自己的元件清單（即時讀側欄）。打字即時篩選並標出命中的字；↑↓ 移動、Enter 選取、Esc 關閉。滑鼠移動也會同步「目前項目」，鍵盤與滑鼠不會打架。'});
  function buildCommand(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Command',title:'Command 指令面板',
      lede:'按 ⌘K 叫出來、打字就能找頁面或執行指令的面板。快捷鍵取用 <a href="#kbd">kbd</a>、無結果取用 <a href="#empty">empty</a>。三種狀態 × 兩級 size（<b>3 × 2 = 6</b>）。',
      specRows:[['axes','<code>state × size</code>'],['formula','<code>3 × 2 = 6</code>'],['token-policy','<code>semantic.surface.* · semantic.action.primary</code>'],['features','groups / highlight / keyboard']]});
    const STN={default:['預設（建議）','default'],results:['搜尋結果','results'],empty:['無結果','empty']},SZN={m:['標準','m · 440'],l:['寬','l · 600']};
    const axes=DIAL_SPECS.command.axes,zh=DIAL_SPECS.command.zh,active=CHOICE.command.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ss=axes.state.filter(v=>active.state.has(v)),zs=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'data · 元件清單',name:'State × Size',rows:ss,cols:zs,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:z=>labHTML(SZN[z][0],SZN[z][1]),cell:(s,z)=>cmdEl(s,z,{}),mincol:620}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','沒輸入時給「建議」與「最近瀏覽」；有輸入時只列結果並標出命中的字；找不到時給替代關鍵字。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Command','項目很多的工具型產品（後台、編輯器、元件庫），讓熟手不用滑鼠就能跳轉。'],['不能取代導覽','新手不會知道 ⌘K，側欄和選單仍然要有。'],['改用 Search','只是搜尋內容（文章、商品），不需要指令。']]);
    const sl=section(body,'互動預覽與程式碼','打字搜元件，例如 tab、table。');LIVE.command(sl);
  }

  /* ---------- DATE PICKER 日期選擇 ---------- */
  function dpkEl(variant,state,o){o=o||{};const range=variant==='range';const w=ce('div','dpk dpk-'+variant);
    const f=ce('div',`field v-outline st-${state}`);f.innerHTML=IC_CALENDAR;f.setAttribute('role','combobox');f.setAttribute('aria-haspopup','dialog');f.setAttribute('aria-expanded','false');
    f.setAttribute('aria-label',range?'選擇日期區間':'選擇日期');if(state==='disabled')f.setAttribute('aria-disabled','true');else f.tabIndex=0;
    const filled=['filled','error'].includes(state)||o.value;const v=ce('span',filled?'val':'ph');
    v.textContent=o.value||(filled?(range?'2026/07/12 – 2026/07/16':'2026/07/18'):(range?'開始日期 – 結束日期':'年/月/日'));f.appendChild(v);w.appendChild(f);
    if(state==='error'){const e=ce('div','dpk-err');e.textContent=range?'結束日期不能早於開始日期':'請選擇今天以後的日期';w.appendChild(e);}
    if(o.panel){const pp=ce('div','pop dpk-pop dpk-pop-static');pp.appendChild(calMonthEl('m',{range,rangeText:range}));w.appendChild(pp);}
    return w;}
  function dpkLive(variant){const range=variant==='range';const stage=ce('div','pop-live-stage dpk-live-stage');const w=dpkEl(variant,'default',{});const f=w.querySelector('.field');
    const pad=n=>(n<10?'0':'')+n;let pp=null;
    const close=back=>{if(!pp)return;pp.classList.remove('is-open');f.setAttribute('aria-expanded','false');const old=pp;pp=null;afterTransition(old,()=>old.remove());if(back)f.focus({preventScroll:true});};
    const setVal=t=>{const v=f.querySelector('.ph,.val');v.className='val';v.textContent=t;};
    const open=()=>{if(pp)return;pp=ce('div','pop dpk-pop pop-float');pp.setAttribute('role','dialog');pp.setAttribute('aria-label','日曆');
      pp.appendChild(calMonthEl('m',{range,rangeText:range,interactive:true,live:true,selected:range?undefined:null,rs:null,re:null,
        onPick:r=>{if(!range){setVal(`${r.y}/${pad(r.m)}/${pad(r.d)}`);close(true);}else if(r.re!=null){setVal(`${r.y}/${pad(r.m)}/${pad(r.rs)} – ${r.y}/${pad(r.m)}/${pad(r.re)}`);setTimeout(()=>close(true),260);}}}));
      w.appendChild(pp);void pp.offsetWidth;pp.classList.add('is-open');f.setAttribute('aria-expanded','true');
      setTimeout(()=>{const d=pp&&(pp.querySelector('.cal-day.is-today')||pp.querySelector('.cal-day:not(.is-out)'));if(d)d.focus({preventScroll:true});},40);};
    f.addEventListener('click',()=>pp?close(false):open());
    f.addEventListener('keydown',e=>{if(['Enter',' ','ArrowDown'].includes(e.key)){e.preventDefault();open();}});
    w.addEventListener('keydown',e=>{if(e.key==='Escape'&&pp){e.preventDefault();close(true);}});
    const outside=e=>{if(!stage.isConnected){document.removeEventListener('pointerdown',outside);return;}if(pp&&!w.contains(e.target))close(false);};
    document.addEventListener('pointerdown',outside);
    stage.appendChild(w);return stage;}
  LIVE['date-picker']=(host)=>mountLive(host,{gate:'date-picker',initial:{variant:'single'},
    segs:[{key:'variant',label:'Variant',options:['single','range'],labels:['單日','區間']}],
    render:st=>dpkLive(st.variant),
    note:'點欄位（或 Enter／↓）打開日曆，焦點直接跳到今天；單日選完立刻關閉，區間選完結束日後停一下讓你看到結果再關。Esc 或點外面關閉，焦點回到欄位。'});
  function buildDatePicker(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Date Picker',title:'Date Picker 日期選擇',
      lede:'表單裡選日期的欄位：欄位取用 <a href="#input">input</a> 的 field、浮層沿用 <a href="#popover">popover</a>、內容直接取用 <a href="#calendar">calendar</a>。兩種 variant × 五種狀態（<b>2 × 5 = 10</b>）。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>2 × 5 = 10</code>'],['token-policy','<code>semantic.*.input.* · semantic.*.popover.*</code>'],['features','range / keyboard / error']]});
    const VN={single:['單日','single'],range:['區間','range']},STN={default:['預設','default'],focus:['聚焦','focus'],filled:['已選','filled'],disabled:['停用','disabled'],error:['錯誤','error']};
    const axes=DIAL_SPECS['date-picker'].axes,zh=DIAL_SPECS['date-picker'].zh,active=CHOICE['date-picker'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'field · 收合',name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(s,v)=>dpkEl(v,s,{}),mincol:320}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','欄位外觀與 input 完全一致；日期一律用 年/月/日 與等寬數字，區間用「–」連接。');p=panelsIn(sec);renderM();
    const os=section(body,'展開的樣子','浮層裡就是 calendar 元件本身，不另外畫一套日曆。');capRow(os,[['單日',dpkEl('single','focus',{panel:true})],['區間',dpkEl('range','focus',{panel:true})]]);
    usageSection(body,[['用 Date Picker','近期、需要看星期的日期（預約、出貨、活動）。'],['改成直接輸入','生日這類很久以前的日期 —— 用三個欄位或可打字的欄位，不要逼人翻幾十年。'],['改用 Calendar','日曆本身就是畫面主體（排班、行程）。']]);
    const sl=section(body,'互動預覽與程式碼','點欄位選日期。');LIVE['date-picker'](sl);
  }

