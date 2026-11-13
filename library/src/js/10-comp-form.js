  /* ---- INPUT ---- */
  function inputEl(variant,state,size){
    const filled=['focus','filled-value','error'].includes(state);
    const f=ce('div',`field v-${variant} st-${state}`+(size&&size!=='m'?' fsz-'+size:''));
    f.innerHTML=filled?`<span class="val">使用者輸入的內容</span>`:`<span class="ph">請輸入…</span>`;
    if(state==='filled-value')f.insertAdjacentHTML('beforeend',`<span class="fieldclear">${ICON_XCIRCLE}</span>`); // 有值時顯示清除（圓底 ×）
    return f;
  }
  function buildInput(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Input',title:'Input 輸入框',
      lede:'Input 家族：<b>純文字 input、search、password、PIN／OTP、textarea、file</b>。以下先攤開基本 input（<b>outline／filled 兩 variant × s／m／l 三尺寸</b>，高度 32／40／48 對齊 Button；label／必填／hint／icon／後綴 eye／清除 ×／錯誤文案走 boolean，有值時右側出現清除 ×，focus 只描邊、無外陰影），再往下逐個列出其餘子元件的狀態與互動。',
      specRows:[['axes','<code>variant × state × size</code>'],['formula','<code>2 × 6 × 3 = 36</code>'],['token-policy','<code>semantic.*.input.*</code>'],['content boolean','label(+必填) / hint / leading icon / 後綴 eye / 清除 × / 錯誤文案']]});
    const Z={default:['預設','default'],hover:['滑過','hover'],focus:['聚焦','focus'],'filled-value':['已填值','filled-value'],disabled:['停用','disabled'],error:['錯誤','error']};
    const axes=DIAL_SPECS.input.axes, zh=DIAL_SPECS.input.zh, active=CHOICE.input.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML=''; const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(s=>active.state.has(s));
      axes.size.filter(z=>active.size.has(z)).forEach(z=>p.appendChild(matrixPanel({badge:'size · '+z,name:'輸入欄位 field（'+({s:'32',m:'40',l:'48'})[z]+'px）',rows:ss,cols:vs,rowLab:s=>labHTML(Z[s][0],Z[s][1]),colLab:v=>labHTML(v==='outline'?'外框':'實填',v),cell:(s,v)=>inputEl(v,s,z),mincol:240}))); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','列＝狀態、欄＝variant（外框／實填左右並排）。focus 只換邊框色（無外陰影）、error 帶紅框。');p=panelsIn(sec);renderM();
    const sb=section(body,'Content 內容軸（boolean）','內容差異用 boolean 開關、不進 variant 矩陣。');
    const rd=ce('div','row-demo');sb.appendChild(rd);
    const demos=[
      ['label',()=>{const w=ce('div','fieldwrap');w.innerHTML='<span class="fl">電子郵件</span>';w.appendChild(inputEl('outline','default'));return w;}],
      ['label 必填 (required)',()=>{const w=ce('div','fieldwrap');w.innerHTML='<span class="fl">電子郵件 <span class="req">*</span></span>';w.appendChild(inputEl('outline','default'));return w;}],
      ['with-hint',()=>{const w=ce('div','fieldwrap');w.innerHTML='<span class="fl">密碼</span>';w.appendChild(inputEl('outline','default'));const h=ce('span','fh');h.textContent='至少 8 碼';w.appendChild(h);return w;}],
      ['leading-icon',()=>{const f=inputEl('outline','default');f.insertAdjacentHTML('afterbegin',ICON_SEARCH);return f;}],
      ['後綴 eye (密碼顯示切換)',()=>{const f=inputEl('outline','filled-value');const v=f.querySelector('.val');if(v)v.textContent='••••••••';f.insertAdjacentHTML('beforeend',ICON_EYE);return f;}],
      ['error + hint',()=>{const w=ce('div','fieldwrap');w.innerHTML='<span class="fl">帳號</span>';w.appendChild(inputEl('outline','error'));const h=ce('span','fh err');h.textContent='此帳號不存在';w.appendChild(h);return w;}],
    ];
    demos.forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    const sl=section(body,'互動預覽與程式碼','用控制項調 variant／內容，下面即時預覽——欄位可真的打字、滑過看 hover、點一下看 focus。');
    LIVE.input(sl);

    /* ===== input 家族其餘子元件 ===== */
    famBlock(body,{zh:'Search 搜尋框',en:'search',note:'帶前置放大鏡的輸入，多用於列表過濾；有值時可清除。variant 同 input（外框／實填）。',
      variants:[['outline','外框'],['filled','實填']],mincol:230,
      states:[['default','預設'],['hover','滑過'],['focus','聚焦'],['filled-value','已填值'],['disabled','停用']],
      el:searchEl,
      live:{initial:{variant:'outline'},segs:[{key:'variant',label:'Variant',options:['outline','filled']}],
        render:st=>{const f=ce('div',`field live-field v-${st.variant}`);f.style.minWidth='300px';f.insertAdjacentHTML('beforeend',ICON_SEARCH);
          const i=document.createElement('input');i.className='bare';i.placeholder='搜尋…';f.appendChild(i);
          const clr=ce('span','fieldclear');clr.innerHTML=ICON_XCIRCLE;clr.style.display='none';clr.onmousedown=e=>e.preventDefault();clr.onclick=()=>{i.value='';i.focus();clr.style.display='none';};
          i.addEventListener('input',()=>{clr.style.display=i.value?'inline-flex':'none';});f.appendChild(clr);return f;}}});

    famBlock(body,{zh:'Password 密碼輸入',en:'password',note:'遮罩顯示；後綴 eye 切換明碼（eye ↔ eye-slash）、有值可清除。',
      states:[['default','預設'],['hover','滑過'],['focus','聚焦'],['filled-value','已填值'],['disabled','停用'],['error','錯誤']],
      el:pwdEl,
      live:{initial:{},render:()=>{const f=ce('div','field live-field v-outline');f.style.minWidth='300px';
        const i=document.createElement('input');i.className='bare';i.type='password';i.placeholder='請輸入密碼';f.appendChild(i);
        const clr=ce('span','fieldclear');clr.innerHTML=ICON_XCIRCLE;clr.style.display='none';clr.onmousedown=e=>e.preventDefault();clr.onclick=()=>{i.value='';i.focus();clr.style.display='none';};
        i.addEventListener('input',()=>{clr.style.display=i.value?'inline-flex':'none';});f.appendChild(clr);
        const b=document.createElement('span');b.style.cssText='display:inline-flex;cursor:pointer;color:var(--muted);flex:0 0 auto;';b.innerHTML=ICON_EYE;
        b.onclick=()=>{const show=i.type==='password';i.type=show?'text':'password';swapIcon(b,show?ICON_EYE_SLASH:ICON_EYE);};f.appendChild(b);return f;}}});

    famBlock(body,{zh:'PIN 驗證碼',en:'pin / otp',note:'6 位數字一次性驗證碼（OTP）：每格一個數字、<b>自動跳格、貼上自動拆分、只收數字</b>。邊框／聚焦／錯誤沿用 input 家族（focus 只描邊、error 紅框）。variant 同 input（外框／實填）。',
      variants:[['outline','外框'],['filled','實填']],mincol:320,
      states:[['default','預設'],['hover','滑過'],['focus','聚焦'],['filled-value','已填值'],['error','錯誤'],['disabled','停用']],
      el:pinEl,
      live:{initial:{variant:'outline'},segs:[{key:'variant',label:'Variant',options:['outline','filled']}],
        render:st=>{const wrap=ce('div','pin live-pin');const inputs=[];
          for(let i=0;i<6;i++){const cell=document.createElement('input');cell.className=`pincell v-${st.variant}`;
            cell.maxLength=1;cell.inputMode='numeric';cell.setAttribute('aria-label',`第 ${i+1} 碼`);if(i===0)cell.autocomplete='one-time-code';
            cell.addEventListener('input',()=>{cell.value=cell.value.replace(/\D/g,'').slice(0,1);if(cell.value&&i<5)inputs[i+1].focus();});
            cell.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!cell.value&&i>0){inputs[i-1].value='';inputs[i-1].focus();e.preventDefault();}});
            cell.addEventListener('paste',e=>{e.preventDefault();const d=((e.clipboardData||window.clipboardData).getData('text')||'').replace(/\D/g,'').slice(0,6);if(!d)return;for(let j=0;j<6;j++)inputs[j].value=d[j]||'';inputs[Math.min(d.length,5)].focus();});
            inputs.push(cell);wrap.appendChild(cell);}
          return wrap;}}});

    famBlock(body,{zh:'Textarea 多行輸入',en:'textarea',note:'多行文字、可垂直拉伸；狀態與 input 相同。',
      states:[['default','預設'],['hover','滑過'],['focus','聚焦'],['filled-value','已填值'],['disabled','停用'],['error','錯誤']],
      el:tareaEl,
      live:{initial:{variant:'outline'},segs:[{key:'variant',label:'Variant',options:['outline','filled']}],
        render:st=>{const t=document.createElement('textarea');t.className=`tarea v-${st.variant}`;t.placeholder='請輸入…';t.rows=3;t.style.minWidth='320px';return t;}}});

    famBlock(body,{zh:'File 檔案上傳',en:'file-input',note:'選檔按鈕＋檔名；選到檔後可清除。<b>外框／實色的邊框與底色對齊 input</b>（外框＝白底實線、實色＝填色）；差別在 content 是按鈕＋檔名。狀態含未選／已選檔／錯誤。',
      variants:[['outline','外框'],['solid','實色']],mincol:240,
      states:[['default','未選'],['hover','滑過'],['focus','聚焦'],['has-file','已選檔'],['disabled','停用'],['error','錯誤']],
      el:fileEl,
      live:{initial:{variant:'outline',disabled:false},segs:[{key:'variant',label:'Variant',options:['outline','solid']}],bools:[{key:'disabled',label:'disabled'}],
        render:st=>{const f=ce('div',`filefield v-${st.variant}${st.disabled?' st-disabled':''}`);const btn=ce('span','filebtn');btn.innerHTML=ICON_UPLOAD+'選擇檔案';
          const name=ce('span','fname');name.textContent='未選擇檔案';
          const clr=ce('span','fieldclear');clr.innerHTML=ICON_XCIRCLE;clr.style.display='none'; // 選檔後才出現的刪除鍵
          let picked=false;
          const setPicked=v=>{picked=v;name.textContent=picked?'report-2026.pdf':'未選擇檔案';f.classList.toggle('has-file',picked);clr.style.display=picked?'inline-flex':'none';};
          if(!st.disabled){btn.onclick=()=>setPicked(!picked);clr.onclick=e=>{e.stopPropagation();setPicked(false);};}
          f.append(btn,name,clr);return f;}}});
  }

  /* ---- 家族子區塊小標 ---- */
  function subhead(host,zh,en){const d=ce('div','famhead');d.innerHTML=`<span class="fz">${zh}</span><span class="fe">${en}</span>`;host.appendChild(d);}
  /* ---- 家族子元件區塊：小標 + 說明 +（狀態列 或 state×variant 矩陣）+ Live ---- */
  function famBlock(host,cfg){
    subhead(host,cfg.zh,cfg.en);
    if(cfg.note){const p=ce('p');p.style.cssText='color:var(--muted);font-size:13px;margin:0 0 16px;';p.innerHTML=cfg.note;host.appendChild(p);}
    if(cfg.variants){ // state × variant 矩陣：variant 左右並排（cfg.el(variant,state)）
      const panels=ce('div','panels');
      panels.appendChild(matrixPanel({badge:'variant',name:cfg.matrixName||cfg.zh,rows:cfg.states,cols:cfg.variants,
        rowLab:s=>labHTML(s[1],s[0]),colLab:v=>labHTML(v[1],v[0]),cell:(s,v)=>cfg.el(v[0],s[0]),mincol:cfg.mincol||220}));
      host.appendChild(panels);
    } else if(cfg.states){const rd=ce('div','row-demo');rd.style.marginBottom='16px';
      cfg.states.forEach(([st,zh])=>{const it=ce('div','demo-item');it.appendChild(cfg.el(st));const c=ce('div','cap');c.innerHTML=`<b>${zh}·${st}</b>`;it.appendChild(c);rd.appendChild(it);});
      host.appendChild(rd);}
    if(cfg.live)mountLive(host,cfg.live);
  }
  /* ---- input 家族子元件的靜態 element ---- */
  function searchEl(variant,state){const filled=['focus','filled-value'].includes(state);const f=ce('div',`field v-${variant} st-${state}`);
    f.insertAdjacentHTML('beforeend',ICON_SEARCH);
    f.insertAdjacentHTML('beforeend',filled?`<span class="val">搜尋關鍵字</span>`:`<span class="ph">搜尋…</span>`);
    if(state==='filled-value')f.insertAdjacentHTML('beforeend',`<span class="fieldclear">${ICON_XCIRCLE}</span>`);
    return f;}
  function pwdEl(state){const filled=['focus','filled-value','error'].includes(state);const f=ce('div',`field st-${state}`);
    f.insertAdjacentHTML('beforeend',filled?`<span class="val">••••••••</span>`:`<span class="ph">請輸入密碼</span>`);
    if(state==='filled-value'||state==='error')f.insertAdjacentHTML('beforeend',`<span class="fieldclear">${ICON_XCIRCLE}</span>`);
    f.insertAdjacentHTML('beforeend',`<span style="display:inline-flex;color:var(--muted);flex:0 0 auto;">${ICON_EYE}</span>`);
    return f;}
  function tareaEl(state){const filled=['focus','filled-value','error'].includes(state);const t=ce('div',`tarea st-${state}`);
    t.innerHTML=filled?`<span class="val">使用者輸入的多行內容……</span>`:`<span class="ph">請輸入…</span>`;return t;}
  function fileEl(variant,state){const hasFile=state==='has-file';const f=ce('div',`filefield v-${variant} st-${state}${hasFile?' has-file':''}`);
    f.innerHTML=`<span class="filebtn">${ICON_UPLOAD}選擇檔案</span><span class="fname">${hasFile?'report-2026.pdf':'未選擇檔案'}</span>`+(hasFile?`<span class="fieldclear">${ICON_XCIRCLE}</span>`:'');
    return f;}
  /* PIN / OTP：6 格單字元；filled/error 全格帶值、focus 顯示輸入到一半（前兩格已填、第三格 active） */
  function pinEl(variant,state){const wrap=ce('div','pin');
    const codes={'filled-value':['2','4','8','1','9','6'],'error':['3','0','7','7','1','2']};
    for(let i=0;i<6;i++){let cs=state,txt='';
      if(state==='filled-value'){txt=codes['filled-value'][i];cs='filled-value';}
      else if(state==='error'){txt=codes['error'][i];cs='error';}
      else if(state==='focus'){if(i<2){cs='filled-value';txt=['4','9'][i];}else if(i===2){cs='focus';}else{cs='default';}}
      const c=ce('div',`pincell v-${variant} st-${cs}`);if(txt)c.textContent=txt;wrap.appendChild(c);}
    return wrap;}

  /* ---- CHECKBOX ---- */
  function cbxEl(state,size){const c=ce('div',`cbx sz-${size} st-${state}`);
    if(state==='checked')c.innerHTML=ICON_CHECK; else if(state==='indeterminate')c.innerHTML=ICON_MINUS;return c;}
  function checkboxCore(body){
    const Z={default:['預設','default'],hover:['滑過','hover'],checked:['已選','checked'],indeterminate:['半選','indeterminate'],disabled:['停用','disabled'],focus:['聚焦','focus']};
    const axes=DIAL_SPECS.checkbox.axes, zh=DIAL_SPECS.checkbox.zh, active=CHOICE.checkbox.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML=''; const ss=axes.state.filter(s=>active.state.has(s)),cs=axes.size.filter(c=>active.size.has(c));
      p.appendChild(matrixPanel({badge:'checkbox',name:'核取方塊',rows:ss,cols:cs,rowLab:s=>labHTML(Z[s][0],Z[s][1]),colLab:c=>labHTML('尺寸 '+c,c),cell:(s,c)=>cbxEl(s,c),mincol:110})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','列＝狀態、欄＝size。');p=panelsIn(sec);renderM();
    const sl=section(body,'互動預覽與程式碼','調 size／狀態，下面預覽可真的點擊勾選。');
    LIVE.checkbox(sl);
  }
  function buildCheckbox(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Checkbox',title:'Checkbox 核取方塊',
      lede:'多選核取。<b>無 variant 軸</b>；狀態含 <code>indeterminate</code>（半選，父層全選常用）。單一 size（m）。',
      specRows:[['axes','<code>state × size</code>'],['formula','<code>6 × 1</code>'],['token-policy','<code>semantic.*.input.* / action.*</code>'],['a11y','indeterminate → aria-checked=mixed']]});
    checkboxCore(body);
  }

  /* ---- RADIO ---- */
  function rdoEl(state,size){const r=ce('div',`rdo sz-${size} st-${state}`);r.innerHTML='<span class="dot"></span>';return r;}
  function radioCore(body){
    const Z={default:['預設','default'],hover:['滑過','hover'],checked:['已選','checked'],disabled:['停用','disabled'],focus:['聚焦','focus']};
    const axes=DIAL_SPECS.radio.axes, zh=DIAL_SPECS.radio.zh, active=CHOICE.radio.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML=''; const ss=axes.state.filter(s=>active.state.has(s)),cs=axes.size.filter(c=>active.size.has(c));
      p.appendChild(matrixPanel({badge:'radio',name:'單選鈕',rows:ss,cols:cs,rowLab:s=>labHTML(Z[s][0],Z[s][1]),colLab:c=>labHTML('尺寸 '+c,c),cell:(s,c)=>rdoEl(s,c),mincol:110})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','列＝狀態、欄＝size。');p=panelsIn(sec);renderM();
    const sl=section(body,'互動預覽與程式碼','調 size／狀態，下面群組可真的單選。');
    LIVE.radio(sl);
  }
  function buildRadio(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Radio',title:'Radio 單選鈕',
      lede:'群組內單選（須包在 role=radiogroup）。<b>無 variant 軸</b>；狀態較 checkbox 少一個 indeterminate。單一 size（m）。',
      specRows:[['axes','<code>state × size</code>'],['formula','<code>5 × 1</code>'],['token-policy','<code>semantic.*.input.* / action.*</code>'],['a11y','群組 role=radiogroup、單選']]});
    radioCore(body);
  }

  /* ---- SELECTOR 家族（checkbox + radio）---- */
  function buildSelector(view){
    const body=viewScaffold(view,{eyebrow:'L3 Family · Selector',title:'Selector 選擇控制',
      lede:'把 <b>checkbox／radio</b> 收成一包「選擇控制」家族——共用 <code>state × size</code> 兩軸與勾選語意。以下逐個攤開各子元件的複雜度。<br><span style="color:var(--faint)">註：multi-select 已改併入 Dropdown（作為多選 type），不再放在此家族。</span>',
      specRows:[['family','checkbox · radio'],['shared axes','<code>state × size</code>'],['token-policy','<code>semantic.*.input.* / action.*</code>'],['a11y','群組 role + aria-checked']]});
    subhead(body,'Checkbox 核取方塊','multi-select');checkboxCore(body);
    subhead(body,'Radio 單選鈕','single-select');radioCore(body);
  }

  /* ---- TAG ---- */
  function tagEl(variant,intent,state,corner,size){corner=corner||'round';   // size：s（預設，不加 class）／m／l
    const t=ce('div',`tg v-${variant} c-${corner} i-${intent} st-${state}`+(size&&size!=='s'?' sz-'+size:''));
    t.innerHTML=`<span>標籤</span>`;return t;}
  function buildTag(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Tag',title:'Tag 標籤 / Chip',
      lede:'標籤與 Chip 合併。<b>variant × corner × intent × size（3 × 2 × 7 × 3 = 126）</b>，size 分 <b>s 20px（預設）／m 24px／l 28px</b>，intent 提供 brand／brand2（輔助）／neutral／danger／success／warning／info 七色（brand2 綁副品牌 <code>--accent2</code>、feedback 綁 <code>--s-feedback-*</code>；warning solid 底自動改深字保可讀）。corner 圓角／方角切換；removable／icon 為 feature flag。',
      specRows:[['axes','<code>variant × corner × intent × state × size</code>'],['formula','<code>3 × 2 × 7 × 3</code>（視覺全展）'],['token-policy','<code>semantic.*.tag.*</code>'],['features','removable / icon / avatar']]});
    const Z={default:['預設','default'],hover:['滑過','hover'],disabled:['停用','disabled']};
    const VN={solid:'實心 solid',outline:'外框 outline',soft:'柔色 soft'};
    const axes=DIAL_SPECS.tag.axes, zh=DIAL_SPECS.tag.zh, active=CHOICE.tag.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v)),cs=axes.corner.filter(c=>active.corner.has(c)),is=axes.intent.filter(i=>active.intent.has(i)),ss=axes.state.filter(s=>active.state.has(s)),zs=axes.size.filter(z=>active.size.has(z));
      const cols=[];is.forEach(i=>cs.forEach(cn=>cols.push({i,cn}))); // 欄＝intent × corner
      vs.forEach(v=>zs.forEach(z=>p.appendChild(matrixPanel({badge:'variant',name:VN[v]+' · '+z.toUpperCase(),rows:ss,cols,
        rowLab:s=>labHTML(Z[s][0],Z[s][1]),
        colLab:o=>labHTML(zh.intent[o.i]+'·'+(o.cn==='round'?'圓角':'方角'),o.i+'·'+o.cn),
        cell:(s,o)=>tagEl(v,o.i,s,o.cn,z),mincol:120})))); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × (Intent·Corner) 矩陣','每個 variant 一塊；列＝狀態、欄＝intent × 圓角。');p=panelsIn(sec);renderM();
    const sl=section(body,'互動預覽與程式碼','調 variant／corner／intent／feature，下面即時預覽（removable 可點 × 移除）。');
    LIVE.tag(sl);
  }

  /* ---- TAB ---- */
  /* ---- tab 家族 icon 池（leading icon 示意用）---- */
  const ICON_HOUSE=PI('house',{solid:1});
  const ICON_LIST=PI('menu');
  const ICON_GEAR=PI('settings'); // = IC_SETTINGS（新版 PulsoIcon settings；tab/menu/list/drawer/floating-line/step 共用）
  const TAB_ICONS=[ICON_HOUSE,ICON_LIST,ICON_GEAR];
  function tabCell(v,state,size){const bar=ce('div',`tabbar v-${v}`);const ti=ce('div',`tabi sz-${size||'m'} st-${state}`);ti.textContent='分頁';bar.appendChild(ti);return bar;}
  /* ---- tab-item 原子：可帶 leading icon／count badge、size m/s ---- */
  function tabItemEl(o){o=o||{};
    const bar=ce('div',`tabbar v-${o.variant||'line'}`);
    const ti=ce('div',`tabi sz-${o.size||'m'} st-${o.state||'default'}`);
    if(o.icon!=null&&o.icon!==false){const idx=typeof o.icon==='number'?o.icon:0;ti.insertAdjacentHTML('beforeend',`<span class="ticon">${TAB_ICONS[idx]}</span>`);}
    ti.insertAdjacentHTML('beforeend',`<span>${o.label||'分頁'}</span>`);
    if(o.count!=null)ti.insertAdjacentHTML('beforeend',`<span class="tcount">${o.count}</span>`);
    bar.appendChild(ti);return bar;}
  /* ---- toggle 開關靜態 element ---- */
  function switchEl(state,o){o=o||{};const on=state==='on'||state==='disabled-on';const dis=state.indexOf('disabled')===0;
    const w=ce('div',`switch${on?' on':''}${dis?' st-disabled':''}${o.icon?' has-ic':''}`);if(o.icon)w.appendChild(switchIc(o.icon));return w;}
  /* TOGGLE-IC:v1 圓鈕圖示：icon＝{off,on}（SVG 字串）或 true（預設太陽／月亮） */
  function switchIc(icon){const ic=ce('span','switch-ic');ic.setAttribute('aria-hidden','true');const I=icon===true?{off:PI('sun'),on:PI('moon')}:icon;
    ic.innerHTML='<span class="ic-off">'+(I.off||'')+'</span><span class="ic-on">'+(I.on||I.off||'')+'</span>';return ic;}
  /* ---- tab 容器 Live：3 個分頁 + 內容零件開關（icon／count）+ size ---- */
  /* TAB-JELLY:v1 果凍切換：移植 React Bits Jelly Radio 的彈簧參數（swell 0.2／shrink 0.05／barge 6px／stagger 22ms），
     不依賴 motion 函式庫，用 rAF 逐格積分彈簧（damping = 2√(k·m)·(1−bounce)）。
     動作（v2 輕柔版，依使用者回饋收斂）：選中那顆微微膨脹（約 1.05）、其餘略縮並往兩側推開 3px，停 100ms 後以柔和彈簧回到 1 倍原樣，約 0.35 秒、幾乎不晃。
     scaleY 晚 50ms、越遠的晚 30ms 起動。減少動態時不播。 */
  function tabJelly(bar){
    const SW=.08,SH=.02,BG=3,ST=.03,HOLD=.1,K=240,B=.1,BSX=.25;  /* TAB-JELLY:v2 輕柔版：縮放幅度、推距、晃動都收斂 */
    const spr=(k,m,b)=>({k,m,c:2*Math.sqrt(k*m)*(1-b)});
    let P=[],raf=0,last=0;
    function init(){P=[...bar.querySelectorAll('.tabi')].map(el=>({el,x:0,vx:0,sx:1,vsx:1*0,sy:1,vsy:0,tx:0,tsx:1,tsy:1,px:null,psx:null,psy:null,dx:0,dy:0,back:0}));}
    function play(sel){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!P.length)init();
      const w=P[sel].el.offsetWidth,push=w*SW/2+BG,now=performance.now()/1000;
      P.forEach((q,i)=>{const far=Math.abs(i-sel),k=K*(1-.12*Math.min(far,3)),busy=raf&&(Math.abs(q.vx)+Math.abs(q.vsx)>.01);
        const d=busy?0:far*ST;q.px=spr(k,.9,B);q.psx=spr(k*1.24,.8,BSX);q.psy=spr(k*.86,.95,B);
        q.tx=i===sel?0:Math.sign(i-sel)*push;q.tsx=q.tsy=i===sel?1+SW:1-SH;
        q.dx=now+d;q.dy=now+d+.05;q.back=now+d+HOLD;});
      last=now;if(!raf)raf=requestAnimationFrame(step);}
    function step(){const now=performance.now()/1000;let dt=Math.min(.05,now-last);last=now;let moving=false;
      P.forEach(q=>{if(q.back&&now>=q.back){q.tx=0;q.tsx=q.tsy=1;q.back=0;}
        const n=Math.max(1,Math.ceil(dt/(1/240))),h=dt/n;
        for(let s=0;s<n;s++){
          if(now>=q.dx){q.vx+=(-q.px.k*(q.x-q.tx)-q.px.c*q.vx)/q.px.m*h;q.x+=q.vx*h;
            q.vsx+=(-q.psx.k*(q.sx-q.tsx)-q.psx.c*q.vsx)/q.psx.m*h;q.sx+=q.vsx*h;}
          if(now>=q.dy){q.vsy+=(-q.psy.k*(q.sy-q.tsy)-q.psy.c*q.vsy)/q.psy.m*h;q.sy+=q.vsy*h;}}
        const rest=!q.back&&Math.abs(q.x)<.05&&Math.abs(q.vx)<.05&&Math.abs(q.sx-1)<.0005&&Math.abs(q.vsx)<.005&&Math.abs(q.sy-1)<.0005&&Math.abs(q.vsy)<.005;
        if(rest){q.x=q.vx=q.vsx=q.vsy=0;q.sx=q.sy=1;q.el.style.transform='';}
        else{moving=true;q.el.style.transform=`translateX(${q.x.toFixed(2)}px) scale(${q.sx.toFixed(4)},${q.sy.toFixed(4)})`;}});
      raf=moving?requestAnimationFrame(step):0;}
    return {init,play};}
  function tabBarLive(v,opts){opts=opts||{};const slide=(v==='pill'||v==='line');  // 只有軌道型 variant 套滑動指示器
    const bar=ce('div',`tabbar v-${v}${slide?' tab-slide':''}`);
    let ind=null;if(slide){ind=ce('span','tab-ind');bar.appendChild(ind);}
    const jelly=(v==='contained'||v==='soft')?tabJelly(bar):null;if(jelly)bar.classList.add('tab-jelly');
    // 字型未載入完成前，tab 寬度會用 fallback 字算 → 定位會偏；ready 前不顯示指示器，避免「閃一下（錯位）→跳掉（字型到位後重定位）」
    let fontsReady=!(document.fonts&&document.fonts.ready);
    // 把指示器滑到 .st-active：x/width inline 寫入，靠 CSS 補間；animate=false 時 snap（首次掛載／字型或寬度變動）
    function placeInd(animate){if(!ind)return;const act=bar.querySelector('.tabi.st-active');if(!act||act.offsetParent===null){ind.style.opacity='0';return;}
      if(!animate)ind.style.transition='none';
      ind.style.transform='translateX('+act.offsetLeft+'px)';ind.style.width=act.offsetWidth+'px';ind.style.opacity=fontsReady?'1':'0';
      if(!animate){void ind.offsetWidth;ind.style.transition='';}}
    [['總覽',12],['明細',4],['設定',null]].forEach(([t,n],i)=>{const ti=ce('button',`tabi sz-${opts.size||'m'}`+(i===0?' st-active':''));
      if(opts.icon)ti.insertAdjacentHTML('beforeend',`<span class="ticon">${TAB_ICONS[i]}</span>`);
      ti.insertAdjacentHTML('beforeend',`<span>${t}</span>`);
      if(opts.count&&n!=null)ti.insertAdjacentHTML('beforeend',`<span class="tcount">${n}</span>`);
      ti.onclick=e=>{bar.querySelectorAll('.tabi').forEach(x=>x.classList.remove('st-active'));ti.classList.add('st-active');if(slide)placeInd(true);
        if(jelly&&e&&e.detail>0)jelly.play(i);};  // 滑鼠／觸控點選才彈；鍵盤（detail=0）直接切換
      bar.appendChild(ti);});
    if(jelly)jelly.init();
    if(slide){requestAnimationFrame(()=>placeInd(false));
      if(!fontsReady)document.fonts.ready.then(()=>{fontsReady=true;placeInd(false);}).catch(()=>{});   // 字型到位後以正確字寬重定位並顯示
      if(window.ResizeObserver){const ro=new ResizeObserver(()=>placeInd(false));ro.observe(bar);}}
    return bar;}
  function buildTab(view){
    const body=viewScaffold(view,{eyebrow:'L3 Family · Tab',title:'Tab 分頁',
      lede:'Tab 家族：<b>分頁容器 tab、分頁項 tab-item、開關 toggle</b>。容器決定排版與 variant（<b>line 底線／contained 容器／soft 灰底／pill 藥丸</b>）；tab-item 是被 INSTANCE_SWAP 進去的原子（可帶 leading icon／count badge）；toggle 則是家族內的二元開關 atom。',
      specRows:[['axes','tab-item：<code>variant × state × size</code>'],['formula','<code>4 × 4 × 3</code>（+ toggle 3 態）'],['token-policy','<code>semantic.surface/text/border.* / action.*</code>'],['composition','tab → N × tab-item（INSTANCE_SWAP）']]});
    const Z={default:['預設','default'],hover:['滑過','hover'],active:['選中','active'],disabled:['停用','disabled']};
    const VZ={line:'底線',contained:'容器',soft:'灰底',pill:'藥丸'};
    const SZN={s:'小 s · 32',m:'標準 m · 40',l:'大 l · 48'};
    const axes=DIAL_SPECS.tab.axes, zh=DIAL_SPECS.tab.zh, active=CHOICE.tab.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(s=>active.state.has(s)),szs=axes.size.filter(z=>active.size.has(z));
      szs.forEach(sz=>p.appendChild(matrixPanel({badge:`size · ${sz}`,name:`${SZN[sz]}　底線／容器／灰底／藥丸 對照`,rows:ss,cols:vs,
        rowLab:s=>labHTML(Z[s][0],Z[s][1]),colLab:v=>labHTML(VZ[v],v),cell:(s,v)=>tabCell(v,s,sz),mincol:150}))); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','列＝狀態、欄＝四個 variant（底線／容器／灰底／藥丸）並排對照。size 有 <b>小 s／標準 m／大 l</b> 三級（高度 32／40／48，對齊 Button）——轉盤勾 size 會各出一張對照表。');p=panelsIn(sec);renderM();
    const sl=section(body,'互動預覽與程式碼','切 variant／內容零件，下面分頁列可真的點擊切換選中；容器／灰底點選時有果凍彈跳。');
    LIVE.tab(sl);

    /* ===== tab-item 內容零件 ===== */
    subhead(body,'Tab Item 分頁項','tab-item');
    const p2=ce('p');p2.style.cssText='color:var(--muted);font-size:13px;margin:0 0 16px;';
    p2.innerHTML='被塞進容器的原子。除了純文字，常再掛 <b>leading icon</b>（辨識）、<b>count badge</b>（該分頁未讀／筆數）。以下用 line variant 選中態示意各內容組合。';body.appendChild(p2);
    const rd=ce('div','row-demo');rd.style.marginBottom='16px';
    [['純文字',{}],['+ leading icon',{icon:0}],['+ count badge',{count:12}],['icon + count 組合',{icon:2,count:4}]].forEach(([cap,o])=>{
      const it=ce('div','demo-item');it.appendChild(tabItemEl(Object.assign({variant:'line',state:'active',label:'分頁'},o)));
      const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    body.appendChild(rd);

    /* toggle 已升格為獨立元件頁（2026-11-03 分類重整），這裡只留指引 */
    const tgl=ce('p');tgl.style.cssText='color:var(--muted);font-size:13px;margin:8px 0 0;';
    tgl.innerHTML='Toggle 開關已獨立成元件頁，見側欄「表單」群組的 <b>Toggle 開關</b>。';body.appendChild(tgl);
  }

  function buildToggle(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Toggle',title:'Toggle 開關',
      lede:'二元開關（on／off），用於「立即生效」的設定切換——不像 checkbox 需再按送出。狀態：關／開／停用。<b>單一 size</b>。原本收在 Tab 頁，2026-11-03 起獨立成元件。',
      specRows:[['axes','<code>state</code>'],['formula','<code>4</code>'],['boolean','<code>icon</code>（圓鈕圖示）'],['token-policy','<code>semantic.*.toggle.*</code>'],['features','label / disabled / icon']]});
    const axes=DIAL_SPECS.toggle.axes, zh=DIAL_SPECS.toggle.zh, active=CHOICE.toggle.active;
    const CAP={off:'關 off',on:'開 on','disabled-off':'停用（關）','disabled-on':'停用（開）'};
    let rd2,rd3;
    function renderM(){ if(!rd2)return; rd2.innerHTML='';
      axes.state.filter(v=>active.state.has(v)).forEach(st=>{const it=ce('div','demo-item');it.appendChild(switchEl(st));const c=ce('div','cap');c.innerHTML=`<b>${CAP[st]}</b>`;it.appendChild(c);rd2.appendChild(it);});
      if(rd3){rd3.innerHTML='';axes.state.filter(v=>active.state.has(v)).forEach(st=>{const it=ce('div','demo-item');it.appendChild(switchEl(st,{icon:true}));const c=ce('div','cap');c.innerHTML=`<b>${CAP[st]}</b>`;it.appendChild(c);rd3.appendChild(it);});} }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State 狀態矩陣','四種狀態並排對照：關／開／停用（關）／停用（開）。');
    rd2=ce('div','row-demo');rd2.style.marginBottom='16px';sec.appendChild(rd2);
    const sec3=section(body,'icon 圓鈕圖示','boolean：圓鈕裡放圖示，關／開各一個（例：頂欄深淺色切換的太陽／月亮）。');rd3=ce('div','row-demo');rd3.style.marginBottom='16px';sec3.appendChild(rd3);renderM();
    const sl2=section(body,'互動預覽與程式碼','點開關可真的切換；勾 disabled 看停用態。');
    mountLive(sl2,{initial:{on:false,disabled:false,icon:false},bools:[{key:'icon',label:'icon 圓鈕圖示'},{key:'disabled',label:'disabled'}],
      render:(st,sync)=>{const row=ce('div','switchrow');const sw=ce('button',`switch${st.on?' on':''}${st.disabled?' st-disabled':''}${st.icon?' has-ic':''}`);sw.type='button';sw.setAttribute('role','switch');sw.setAttribute('aria-checked',String(st.on));if(st.icon)sw.appendChild(switchIc(true));
        const lab=ce('span','switch-label');lab.textContent=st.on?'開啟':'關閉';
        if(!st.disabled)sw.onclick=()=>{st.on=!st.on;sw.classList.toggle('on',st.on);sw.setAttribute('aria-checked',String(st.on));lab.textContent=st.on?'開啟':'關閉';if(sync)sync();};
        row.append(sw,lab);return row;}});
  }

