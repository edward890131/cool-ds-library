  /* ==================== ALERT 提示橫幅 ==================== */
  /* 頁內常駐提示（不自動消失）：表單錯誤摘要、帳號到期、權限不足。與 notification（暫時浮出的 toast）分工。icon 沿用 notification 的 NT_ICON。 */
  const AL_TEXT={info:['有新版本可用','重新整理即可套用最新的元件與 token。'],success:['專案已同步到 Figma','12 個元件、48 個 token 已更新。'],
    warning:['方案將於 3 天後到期','到期後專案會轉為唯讀，記得續約。'],error:['有 2 個欄位需要修正','請檢查 Email 與手機號碼的格式。']};
  const AL_ACT={info:'重新整理',success:'查看變更',warning:'立即續約',error:'前往修正'};
  function alEl(variant,intent,o){o=o||{};
    const a=ce('div',`al al-v-${variant} al-i-${intent}`);a.setAttribute('role',intent==='error'||intent==='warning'?'alert':'status');
    if(o.icon!==false){const ic=ce('span','al-ico');ic.innerHTML=NT_ICON[intent];a.appendChild(ic);}
    const bd=ce('div','al-body');const [t,d]=AL_TEXT[intent];
    if(o.title!==false){const ti=ce('div','al-title');ti.textContent=t;bd.appendChild(ti);}
    if(o.desc!==false){const ds=ce('div','al-desc');ds.textContent=d;bd.appendChild(ds);}
    if(o.action){const ac=ce('div','al-actions');const b=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:!!o.live});b.querySelector('span').textContent=AL_ACT[intent];ac.appendChild(b);bd.appendChild(ac);}
    a.appendChild(bd);
    if(o.close){const x=ce('button','al-close');x.type='button';x.setAttribute('aria-label','關閉提示');x.innerHTML=ICON_CLOSE;a.appendChild(x);
      if(o.live)x.onclick=()=>{ /* 關閉＝淡出後高度收合；示意：約 1 秒後復原 */
        if(a.classList.contains('al-out'))return;a.classList.remove('al-in');a.classList.add('al-out');
        afterAnim(a,()=>{a.dataset.slideHide='1';slideToggle(a,false);setTimeout(()=>{a.classList.remove('al-out');delete a.dataset.slideHide;a.style.display='flex';slideToggle(a,true);a.classList.add('al-in');},1000);});};}
    return a;}
  LIVE.alert=(host)=>mountLive(host,{gate:'alert',
    initial:{variant:'soft',intent:'warning',icon:true,title:true,desc:true,action:true,close:true},
    segs:[{key:'variant',label:'Variant',options:['soft','outline','accent'],labels:['柔色','外框','左側色條']},
          {key:'intent',label:'Intent',options:['info','success','warning','error'],labels:['資訊','成功','警告','錯誤']}],
    bools:[{key:'icon',label:'icon 圖示'},{key:'title',label:'title 標題'},{key:'desc',label:'description 說明'},{key:'action',label:'action 動作鈕'},{key:'close',label:'close 可關閉'}],
    boolLabel:'Content',
    render:st=>{const a=alEl(st.variant,st.intent,{icon:st.icon,title:st.title,desc:st.desc,action:st.action,close:st.close,live:true});a.classList.add('al-in');return a;},
    note:'關閉後會先淡出、再把高度收掉（下方內容平滑往上補），約 1 秒後自動復原方便反覆觀看。實際產品裡關閉狀態應依需求記住（例如本次登入期間不再顯示）。'
  });
  function buildAlert(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Alert',title:'Alert 提示橫幅',
      lede:'放在頁面內容中、<b>不會自動消失</b>的提示：表單錯誤摘要、帳號到期、權限不足、系統公告。和 <a href="#notification">notification</a>（暫時浮出、會自己消失的 toast）分工。三種 variant × 四種 intent（<b>3 × 4 = 12</b>），意圖色綁語意 token <code>--s-feedback-*</code>，深淺模式自動切換。',
      specRows:[['axes','<code>variant × intent</code>'],['formula','<code>3 × 4 = 12</code>'],['token-policy','<code>semantic.*.feedback.*</code>'],['features','icon / title / description / action / close']]});
    const VN={soft:['柔色','soft'],outline:['外框','outline'],accent:['左側色條','accent']};
    const IN={info:['資訊','info'],success:['成功','success'],warning:['警告','warning'],error:['錯誤','error']};
    const axes=DIAL_SPECS.alert.axes, zh=DIAL_SPECS.alert.zh, active=CHOICE.alert.active;
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v)), is=axes.intent.filter(v=>active.intent.has(v));
      p.appendChild(matrixPanel({badge:'content · icon＋title＋description',name:'Variant × Intent',rows:is,cols:vs,
        rowLab:i=>labHTML(IN[i][0],IN[i][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),
        cell:(i,v)=>alEl(v,i,{close:true}),mincol:300})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Intent 矩陣','列＝四種 intent、欄＝三種 variant。soft 適合一般頁面；outline 用在白底卡片內；accent（左側色條）適合長文或文件頁，不搶版面。');
    p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','內容開關走 boolean property（鐵則 3）。只有說明時，說明會升為主文字；需要使用者處理才加 action。');
    const st=ce('div','al-stack');
    [['只有說明',{title:false}],['標題＋說明',{}],['＋動作鈕',{action:true}],['＋可關閉',{action:true,close:true}],['無圖示（較次要）',{icon:false}]]
      .forEach(([cap,o])=>{const it=ce('div','demo-item');it.style.width='100%';it.appendChild(alEl('soft','info',o));const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);st.appendChild(it);});
    cs.appendChild(st);
    const us=section(body,'什麼時候用','和相近元件的分工。');
    const ul=ce('div','row-demo');ul.style.cssText='display:block;font-size:13px;line-height:1.7;color:var(--muted);';
    ul.innerHTML='<b style="color:var(--ink)">用 Alert</b>：需要使用者看到、而且在處理前都應該留著的訊息（表單錯誤摘要、帳號到期、權限不足、維護公告）。<br>'
      +'<b style="color:var(--ink)">改用 Notification</b>：操作完成的回饋（已儲存、已複製），幾秒後自己消失即可。<br>'
      +'<b style="color:var(--ink)">改用 Modal</b>：必須先決定才能繼續（刪除確認）。';
    us.appendChild(ul);
    const sl=section(body,'互動預覽與程式碼','切 variant／intent、勾內容開關；按 × 看關閉時的淡出與高度收合。');
    LIVE.alert(sl);
  }

  /* ==================== POPOVER 氣泡卡 ==================== */
  /* 點擊觸發、可放互動內容（勾選、按鈕、連結）的浮層。tooltip 只放純文字；需要互動就用 popover。內容取用既有原子：selector 的 .cbx、button 的 mkBtn（鐵則 5）。 */
  function popBodyHTML(){
    const row=(lb,on)=>`<span class="optrow"><span class="cbx sz-s${on?' st-checked':''}">${on?ICON_CHECK:''}</span><span class="oplab">${lb}</span></span>`;
    return row('有現貨',true)+row('免運費',false)+row('4 星以上',true);}
  function popEl(placement,size,o){o=o||{};
    const pp=ce('div',`pop pop-p-${placement} sz-${size}`);pp.setAttribute('role','dialog');pp.setAttribute('aria-label','篩選條件');
    if(o.arrow!==false)pp.appendChild(ce('span','pop-arrow'));
    if(o.header!==false){const hd=ce('div','pop-head');const t=ce('div','pop-title');t.textContent='篩選條件';hd.appendChild(t);
      if(o.close!==false){const x=ce('button','pop-x');x.type='button';x.setAttribute('aria-label','關閉');x.innerHTML=ICON_CLOSE;hd.appendChild(x);}pp.appendChild(hd);}
    const bd=ce('div','pop-body');bd.innerHTML=popBodyHTML();pp.appendChild(bd);
    if(o.live)bd.querySelectorAll('.optrow').forEach(r=>{r.style.cursor='pointer';r.onclick=()=>{const c=r.querySelector('.cbx');const on=c.classList.toggle('st-checked');c.innerHTML=on?ICON_CHECK:'';};});
    if(o.footer!==false){const ft=ce('div','pop-foot');
      const c=mkBtn({variant:'text',intent:'secondary',size:'s',isLive:!!o.live});c.querySelector('span').textContent='清除';
      const k=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:!!o.live});k.querySelector('span').textContent='套用';
      c.dataset.popClose='1';k.dataset.popClose='1';ft.append(c,k);pp.appendChild(ft);}
    return pp;}
  /* 互動：點 trigger 開合；點外面、按 Esc、按 ×／套用 關閉；開啟時 focus 第一個可操作元素、關閉時 focus 回 trigger */
  function popLive(placement,size,o,syncCode){
    const stage=ce('div','pop-live-stage');const wrap=ce('div','pop-wrap');
    const trg=mkBtn({variant:'outline',intent:'secondary',size:'m',isLive:true,trail:true});trg.querySelector('span').textContent='篩選';
    trg.setAttribute('aria-haspopup','dialog');trg.setAttribute('aria-expanded','false');
    const pp=popEl(placement,size,Object.assign({live:true},o));pp.classList.add('pop-float');
    wrap.append(trg,pp);stage.appendChild(wrap);
    const set=v=>{pp.classList.toggle('is-open',v);trg.setAttribute('aria-expanded',v?'true':'false');
      if(v){const f=pp.querySelector('.optrow,button');if(f&&f.focus)setTimeout(()=>{(pp.querySelector('button')||trg).focus({preventScroll:true});},40);}
      if(syncCode)syncCode();};
    trg.onclick=e=>{e.stopPropagation();set(!pp.classList.contains('is-open'));};
    pp.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('.pop-x,[data-pop-close]');if(b){set(false);trg.focus({preventScroll:true});}});
    const outside=e=>{if(!stage.isConnected){document.removeEventListener('click',outside);document.removeEventListener('keydown',esc);return;}if(!wrap.contains(e.target))set(false);};
    const esc=e=>{if(e.key==='Escape'&&pp.classList.contains('is-open')){set(false);trg.focus({preventScroll:true});}};
    document.addEventListener('click',outside);document.addEventListener('keydown',esc);
    if(o.open!==false)pp.classList.add('is-open'); // 預設開啟（不跑動畫），一進頁就看得到
    return stage;}
  LIVE.popover=(host)=>mountLive(host,{gate:'popover',
    initial:{placement:'bottom',size:'m',arrow:true,header:true,footer:true,close:true},
    segs:[{key:'placement',label:'Placement',options:['bottom','top','left','right'],labels:['下方','上方','左側','右側']},
          {key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'arrow',label:'arrow 箭頭'},{key:'header',label:'header 標題列'},{key:'close',label:'close ×'},{key:'footer',label:'footer 動作列'}],
    boolLabel:'Content',
    render:(st,syncCode)=>popLive(st.placement,st.size,{arrow:st.arrow,header:st.header,close:st.close,footer:st.footer},syncCode),
    note:'點「篩選」開合，從按鈕所在的方向縮放展開；點外面、按 Esc、按 × 或「套用」都會關閉，關閉後焦點回到按鈕。'
  });
  function buildPopover(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Popover',title:'Popover 氣泡卡',
      lede:'點擊觸發、貼齊觸發點的浮層，<b>可以放互動內容</b>（勾選、按鈕、連結、表單）。和 <a href="#tooltip">tooltip</a>（滑過才出現、只有純文字）、<a href="#modal">modal</a>（擋住整頁、必須先處理）分工。四向 placement × 三級 size（<b>4 × 3 = 12</b>）。',
      specRows:[['axes','<code>placement × size</code>'],['formula','<code>4 × 3 = 12</code>'],['token-policy','<code>semantic.*.popover.*</code>'],['features','arrow / header / close / footer']]});
    const PZ={bottom:['下方','bottom'],top:['上方','top'],left:['左側','left'],right:['右側','right']};
    const SZN={s:['小','s · 220'],m:['標準','m · 280'],l:['大','l · 340']};
    const axes=DIAL_SPECS.popover.axes, zh=DIAL_SPECS.popover.zh, active=CHOICE.popover.active;
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const ps=axes.placement.filter(v=>active.placement.has(v)), ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'content · header＋body＋footer',name:'Placement × Size（箭頭指向 trigger）',rows:ps,cols:ss,
        rowLab:pl=>labHTML(PZ[pl][0],PZ[pl][1]),colLab:sz=>labHTML(SZN[sz][0],SZN[sz][1]),
        cell:(pl,sz)=>popEl(pl,sz,{}),mincol:360})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Placement × Size 矩陣','列＝四個浮出方向（箭頭在靠近 trigger 的那一側）、欄＝三級寬度。');
    p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','header、close、footer、arrow 都是內容開關（boolean property）；沒有 footer 時，勾選即時生效。');
    const rd=ce('div','row-demo');
    [['完整',{}],['無 footer（即時生效）',{footer:false}],['無 header',{header:false}],['無箭頭',{arrow:false}]]
      .forEach(([cap,o])=>{const it=ce('div','demo-item');it.appendChild(popEl('bottom','s',o));const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    cs.appendChild(rd);
    const us=section(body,'什麼時候用','和相近元件的分工。');
    const ul=ce('div','row-demo');ul.style.cssText='display:block;font-size:13px;line-height:1.7;color:var(--muted);';
    ul.innerHTML='<b style="color:var(--ink)">用 Popover</b>：跟某個按鈕直接相關、需要操作的少量內容（篩選、分享、快速設定、日期選擇）。<br>'
      +'<b style="color:var(--ink)">改用 Tooltip</b>：只是補一句說明文字，不需要點。<br>'
      +'<b style="color:var(--ink)">改用 Action Menu</b>：一串動作清單，選了就執行。<br>'
      +'<b style="color:var(--ink)">改用 Modal／Drawer</b>：內容多到需要捲動，或必須先處理才能繼續。';
    us.appendChild(ul);
    const sl=section(body,'互動預覽與程式碼','點「篩選」實際開合；切 placement 看展開方向、切 size 看寬度。');
    LIVE.popover(sl);
  }

  /* ---- DROPDOWN 下拉 ---- */
  function ddEl(variant,state,multi,size){const f=ce('div',`field dd v-${variant}${multi?' multi':''} st-${state}`+(size&&size!=='m'?' fsz-'+size:''));
    const b=ce('span','dd-body');
    if(state==='selected'){
      if(multi)['台北市','台中市'].forEach(o=>{const chip=ce('span','ddchip');chip.innerHTML=`<span>${o}</span><span class="x">${ICON_CLOSE}</span>`;b.appendChild(chip);});
      else{const val=ce('span','val');val.textContent='台北市';b.appendChild(val);}
    } else {const ph=ce('span','ph');ph.textContent='請選擇…';b.appendChild(ph);}
    const c=ce('span',`ddcaret${state==='open'?' up':''}`);c.innerHTML=ICON_CARET;
    f.append(b,c);return f;}
  /* 可互動下拉：opts={searchable, multi} —— 單選點了關閉、多選勾選 chip 不關 */
  function ddField(variant,opts){opts=opts||{};
    const RAW=opts.options||['台北市','台中市','高雄市','花蓮縣'];               // 可傳 options=[{value,label}] 或字串陣列；不傳→沿用原示範選項（向後相容）
    const OPTS=RAW.map(o=>typeof o==='string'?{value:o,label:o}:o);
    const selected=new Set(); if(opts.value!=null)selected.add(opts.value);       // 可帶初始值
    const labelOf=v=>{const f=OPTS.find(o=>o.value===v);return f?f.label:v;};
    const wrap=ce('div','ddwrap');
    const trg=ce('div',`field dd v-${variant}${opts.multi?' multi':''}${opts.size&&opts.size!=='m'?' fsz-'+opts.size:''}`);
    const bodyEl=ce('span','dd-body');
    const caret=ce('span','ddcaret');caret.innerHTML=ICON_CARET;
    trg.append(bodyEl,caret);
    const menu=ce('div','ddmenu');
    let searchInput;
    if(opts.searchable){searchInput=document.createElement('input');searchInput.className='ddsearch';searchInput.placeholder='搜尋…';
      searchInput.oninput=()=>{const q=searchInput.value;[...menu.querySelectorAll('.ddopt')].forEach(el=>{el.style.display=el.textContent.includes(q)?'flex':'none';});};
      menu.appendChild(searchInput);}
    const optEls={};
    OPTS.forEach(o=>{const it=ce('div','ddopt');it.setAttribute('role','option');it.tabIndex=-1;
      if(opts.multi){const box=cbxEl('default','s');box.classList.add('dd-cbx');box.setAttribute('aria-hidden','true');const lab=document.createElement('span');lab.textContent=o.label;it.append(box,lab);}
      else it.textContent=o.label;
      it.onclick=()=>{ if(opts.multi){selected.has(o.value)?selected.delete(o.value):selected.add(o.value);syncMenu();renderTrg();opts.onChange&&opts.onChange([...selected]);}
        else{selected.clear();selected.add(o.value);syncMenu();renderTrg();toggle(false);trg.focus();opts.onChange&&opts.onChange(o.value);} };
      optEls[o.value]=it;menu.appendChild(it);});
    function renderTrg(){bodyEl.innerHTML='';
      if(selected.size===0){const p=ce('span','ph');p.textContent=opts.placeholder||'請選擇…';bodyEl.appendChild(p);return;}
      if(opts.multi){[...selected].forEach(v=>{const chip=ce('span','ddchip');chip.innerHTML=`<span>${labelOf(v)}</span>`;const x=ce('span','x');x.innerHTML=ICON_CLOSE;
        x.onclick=e=>{e.stopPropagation();chip.classList.add('tg-out');afterAnim(chip,()=>{selected.delete(v);syncMenu();renderTrg();opts.onChange&&opts.onChange([...selected]);});};chip.appendChild(x);bodyEl.appendChild(chip);});}
      else{const val=ce('span','val');val.textContent=labelOf([...selected][0]);bodyEl.appendChild(val);}}
    function syncMenu(){OPTS.forEach(o=>{const el=optEls[o.value],on=selected.has(o.value);el.setAttribute('aria-selected',on?'true':'false');
      if(opts.multi){el.classList.toggle('on',on);const c=el.querySelector('.dd-cbx');if(c){c.classList.toggle('st-checked',on);c.classList.toggle('st-default',!on);c.innerHTML=on?ICON_CHECK:'';}}else el.classList.toggle('sel',on);});}
    let open=false;
    /* 開合（修正：原本只有 trigger 的 onclick 在切換，沒有任何「外點／Esc／焦點離開」的關閉路徑，trigger 也不能聚焦）。
       開啟時才在 document 掛 capture 監聽（pointerdown 外點、keydown Esc、focusin 焦點移出），關閉就拆掉，不累積；
       Esc 用 stopImmediatePropagation，避免同時把外層 modal 一起關掉；關閉後焦點回 trigger。 */
    const mid='ddm-'+(window.__ddUid=(window.__ddUid||0)+1);
    menu.id=mid;menu.setAttribute('role','listbox');if(opts.multi)menu.setAttribute('aria-multiselectable','true');
    trg.tabIndex=0;trg.setAttribute('role','combobox');trg.setAttribute('aria-haspopup','listbox');trg.setAttribute('aria-controls',mid);trg.setAttribute('aria-expanded','false');
    const visOpts=()=>[...menu.querySelectorAll('.ddopt')].filter(el=>el.style.display!=='none');
    function onDocDown(e){if(!wrap.isConnected||!wrap.contains(e.target))toggle(false);}
    function onDocKey(e){if(e.key!=='Escape')return;e.preventDefault();e.stopImmediatePropagation();toggle(false);if(wrap.isConnected)trg.focus();}
    function onDocFocus(e){if(!wrap.contains(e.target))toggle(false);}
    function toggle(v,focusOpt){v=!!v;if(v===open)return;open=v;menu.classList.toggle('is-open',v);trg.classList.toggle('st-open',v);caret.classList.toggle('up',v);trg.setAttribute('aria-expanded',v?'true':'false');
      const m=v?'addEventListener':'removeEventListener';document[m]('pointerdown',onDocDown,true);document[m]('keydown',onDocKey,true);document[m]('focusin',onDocFocus,true);
      if(v){if(searchInput)searchInput.focus();else if(focusOpt){const l=visOpts();const s=l.find(el=>el.getAttribute('aria-selected')==='true')||l[0];if(s)s.focus();}}}
    trg.onclick=()=>toggle(!open);
    trg.addEventListener('keydown',e=>{if(e.target!==trg)return;if(e.key==='Enter'||e.key===' '||e.key==='ArrowDown'){e.preventDefault();if(open&&e.key!=='ArrowDown')toggle(false);else toggle(true,true);}});
    menu.addEventListener('keydown',e=>{const l=visOpts();const i=l.indexOf(document.activeElement);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=i<0?0:(i+(e.key==='ArrowDown'?1:-1)+l.length)%l.length;if(l[n])l[n].focus();}
      else if(e.key==='Home'||e.key==='End'){e.preventDefault();const n=e.key==='Home'?l[0]:l[l.length-1];if(n)n.focus();}
      else if((e.key==='Enter'||e.key===' ')&&i>=0){e.preventDefault();l[i].click();}
      else if(e.key==='Tab')toggle(false);});
    renderTrg();syncMenu();wrap.append(trg,menu);return wrap;}
  function buildDropdown(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Dropdown',title:'Dropdown 下拉',
      lede:'扁平列表選單（role=combobox），併入 multi-select。<b>兩個變體軸：<code>type 單選／多選</code>（跟 outline／filled 同層級）× <code>variant outline／filled</code></b>；狀態含 <code>selected</code>（已選：單選顯示值、多選顯示 chips）、<code>open</code>（展開）。label／必填／hint／searchable 走 boolean／feature flag。與 input 對齊：無 size 軸、focus/open 只描邊無外陰影。<br><span style="color:var(--faint)">註：spec 另有 size／success、及多選專屬 select-all／max-selected，此處先略、需要可補。</span>',
      specRows:[['axes','<code>type × variant × state × size</code>'],['formula','<code>2 × 2 × 7 × 3 = 84</code>'],['token-policy','<code>semantic.*.input.*</code>'],['content / features','label / 必填 / hint / searchable']]});
    const Z={default:['預設','default'],hover:['滑過','hover'],focus:['聚焦','focus'],selected:['已選','selected'],open:['展開','open'],disabled:['停用','disabled'],error:['錯誤','error']};
    const axes=DIAL_SPECS.dropdown.axes, zh=DIAL_SPECS.dropdown.zh, active=CHOICE.dropdown.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const ts=axes.type.filter(t=>active.type.has(t)),vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(s=>active.state.has(s));
      const zs=axes.size.filter(z=>active.size.has(z));
      ts.forEach(t=>zs.forEach(z=>p.appendChild(matrixPanel({badge:'type · size '+z,name:(t==='single'?'單選 single':'多選 multi')+'（'+({s:'32',m:'40',l:'48'})[z]+'px）',rows:ss,cols:vs,
        rowLab:s=>labHTML(Z[s][0],Z[s][1]),colLab:v=>labHTML(v==='outline'?'外框':'實填',v),cell:(s,v)=>ddEl(v,s,t==='multi',z),mincol:230})))); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State 矩陣（type × variant）','每個 type 一塊、欄＝variant、列＝狀態。selected 那列：單選顯示值、多選顯示 chips；open＝caret 朝上、accent 描邊。實際展開清單見下方 Live。');p=panelsIn(sec);renderM();

    const sb=section(body,'Content 內容軸（boolean）','label／必填／hint 與 input 一致，用 boolean 控制、不進變體矩陣。');
    const rd=ce('div','row-demo');sb.appendChild(rd);
    const demos=[
      ['with-label',()=>{const w=ce('div','fieldwrap');w.innerHTML='<span class="fl">縣市</span>';w.appendChild(ddEl('outline','default'));return w;}],
      ['label 必填 (required)',()=>{const w=ce('div','fieldwrap');w.innerHTML='<span class="fl">縣市 <span class="req">*</span></span>';w.appendChild(ddEl('outline','default'));return w;}],
      ['with-hint',()=>{const w=ce('div','fieldwrap');w.innerHTML='<span class="fl">縣市</span>';w.appendChild(ddEl('outline','default'));const h=ce('span','fh');h.textContent='可搜尋縣市';w.appendChild(h);return w;}],
    ];
    demos.forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});

    const sl=section(body,'互動預覽與程式碼','切 <b>單選／多選</b>、variant、label／hint／searchable，下面下拉可真的點開、選項、關閉。多選勾選不關、選項成 chip。');
    LIVE.dropdown(sl);
  }

  /* 家族 id → builder（button 為特例走 buttonView）。tag/tab 目前先接代表子元件，家族其餘之後補。 */
  /* ===== 回饋+載入批次 buildXxx（平行 workflow 產出、序列整合）===== */
  /* ---- TOOLTIP 提示（builders 提升頂層，頁面與 summary Live 共用）---- */
  const TT_INFO=PI('info');
  function ttEl(placement,size,arrow){
    const t=ce('div',`tt-tip tt-p-${placement} tt-sz-${size}${arrow?' tt-arrow':''}`);
    t.innerHTML='<span>提示文字</span>';return t;}
  function ttTrigger(placement,size,arrow){
    const wrap=ce('div','tt-trigwrap');
    const btn=ce('button','tt-trig');btn.innerHTML=TT_INFO+'<span>hover 我</span>';
    const tip=ttEl(placement,size,arrow);tip.classList.add('tt-float','tt-fp-'+placement);
    wrap.append(btn,tip);return wrap;}
  LIVE.tooltip=(host)=>mountLive(host,{gate:'tooltip',
    initial:{placement:'top',size:'m',arrow:true},
    segs:[{key:'placement',label:'Placement',options:['top','bottom','left','right'],labels:['上','下','左','右']},
          {key:'size',label:'Size',options:['s','m']}],
    bools:[{key:'arrow',label:'with-arrow 箭頭'}],
    boolLabel:'Feature',
    render:st=>{const box=ce('div','tt-live-box');box.appendChild(ttTrigger(st.placement,st.size,st.arrow));return box;},
    note:'tooltip 只承載純文字；需要按鈕／連結等互動內容時，請改用 <a href="#popover">popover</a>。'
  });
  function buildTooltip(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Tooltip',title:'Tooltip 提示',
      lede:'滑過或聚焦時浮出的<b>純文字</b>輔助說明。單一 variant（<b>solid 深底白字</b>），只有 <b>placement 四向 × size 兩級（1 × 4 × 2 = 8）</b>；純展示、不可互動、不放任何可點元素——需要互動內容請改用 <a href="#popover">popover</a>。',
      specRows:[['axes','<code>variant × placement × size</code>'],['formula','<code>1 × 4 × 2 = 8</code>'],['token-policy','<code>semantic.*.tooltip.*</code>'],['features','with-arrow / placement-auto']]});
    const PZ={top:['上方','top'],bottom:['下方','bottom'],left:['左側','left'],right:['右側','right']};
    const SZN={s:['小','s'],m:['標準','m']};
    const axes=DIAL_SPECS.tooltip.axes, zh=DIAL_SPECS.tooltip.zh, active=CHOICE.tooltip.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const ps=axes.placement.filter(v=>active.placement.has(v));
      const ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'variant · solid',name:'Placement × Size（含箭頭指向 trigger）',
        rows:ps,cols:ss,
        rowLab:pl=>labHTML(PZ[pl][0],PZ[pl][1]),
        colLab:sz=>labHTML(SZN[sz][0]+'尺寸',SZN[sz][1]),
        cell:(pl,sz)=>ttEl(pl,sz,true),mincol:150})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Placement × Size 矩陣','列＝四個浮出方向、欄＝兩級尺寸；每顆泡泡含指向 trigger 的箭頭。');
    p=panelsIn(sec);renderM();
    const fs=section(body,'Feature Flags','with-arrow：指向 trigger 的三角箭頭可關；placement-auto：空間不足時自動翻面（行為旗標，此處示意其一）。');
    const rd=ce('div','row-demo');rd.style.marginBottom='4px';
    [['with-arrow 有箭頭',()=>ttEl('top','m',true)],
     ['no arrow 無箭頭',()=>ttEl('top','m',false)],
     ['size s 小尺寸',()=>ttEl('top','s',true)],
     ['多字自動換行',()=>{const t=ttEl('top','m',true);t.querySelector('span').textContent='較長的輔助說明會在最大寬度內自動折行';return t;}]
    ].forEach(([cap,fn])=>{const it=ce('div','demo-item');it.appendChild(fn());const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});
    fs.appendChild(rd);
    const sl=section(body,'互動預覽與程式碼','切方向／尺寸、勾箭頭，把滑鼠移到按鈕上會真的依 placement 浮出 tooltip。');
    LIVE.tooltip(sl);
  }


  /* ---- NOTIFICATION 通知（builders 提升頂層，頁面與 summary Live 共用）---- */
  const NT_IC_SUCCESS=PI('circle-check',{solid:1});
  const NT_IC_WARNING=PI('triangle-alert',{solid:1});
  const NT_IC_ERROR=PI('circle-x',{solid:1});
  const NT_IC_INFO=PI('info',{solid:1});
  const NT_ICON={success:NT_IC_SUCCESS,warning:NT_IC_WARNING,error:NT_IC_ERROR,info:NT_IC_INFO};
  const NT_TITLE={success:'儲存成功',warning:'即將到期',error:'上傳失敗',info:'有新版本'};
  const NT_MSG={success:'你的變更已同步到雲端。',warning:'方案將於 3 天後到期，記得續約。',error:'網路連線中斷，請稍後再試。',info:'重新整理即可套用最新功能。'};
  /* 消失後自動復原（示意用，可反覆看）；after 用於 auto-dismiss 消失後重新計時 */
  function ntDismiss(t,after,swiped){t.classList.remove('nt-in');if(!swiped)t.classList.add('nt-out');
    setTimeout(()=>{t.classList.remove('nt-out');t.style.transition='';t.style.transform='';t.style.opacity='';void t.offsetWidth;t.classList.add('nt-in'); // 復原＝重新從上方落入
      if(after&&t.isConnected)after();},900);}
  /* Motion v1：往右滑掉（超過 80px 或甩得夠快）；不夠遠 spring 彈回；往左有阻尼 */
  function ntSwipe(t){let x0=0,t0=0,dx=0,drag=false;
    t.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button,a'))return;drag=true;x0=e.clientX;t0=performance.now();dx=0;
      t.classList.remove('nt-in','nt-snap');t.classList.add('nt-drag');t.setPointerCapture(e.pointerId);});
    t.addEventListener('pointermove',e=>{if(!drag)return;dx=e.clientX-x0;const tx=dx>0?dx:-Math.sqrt(-dx)*2;
      t.style.transform=`translateX(${tx}px)`;t.style.opacity=String(Math.max(.2,1-Math.max(0,dx)/220));});
    const end=()=>{if(!drag)return;drag=false;t.classList.remove('nt-drag');const v=dx/Math.max(1,performance.now()-t0);
      if(dx>80||v>.5){t.style.transition='transform var(--dur-fast) var(--ease-in),opacity var(--dur-fast) var(--ease-in)';t.style.transform='translateX(120%)';t.style.opacity='0';ntDismiss(t,null,true);}
      else{t.classList.add('nt-snap');t.style.transform='';t.style.opacity='';afterTransition(t,()=>t.classList.remove('nt-snap'));}};
    t.addEventListener('pointerup',end);t.addEventListener('pointercancel',end);}
  /* toast 原子：opts={icon,desc,action,close,timer} */
  function ntEl(variant,intent,opts){opts=opts||{};
    const t=ce('div',`nt-toast nt-v-${variant} nt-i-${intent}`);
    if(opts.icon!==false){const ic=ce('span','nt-ico');ic.innerHTML=NT_ICON[intent];t.appendChild(ic);}
    const bd=ce('div','nt-body');
    const ti=ce('div','nt-title');ti.textContent=NT_TITLE[intent];
    bd.appendChild(ti);
    if(opts.desc!==false){const ms=ce('div','nt-msg');ms.textContent=NT_MSG[intent];bd.appendChild(ms);} // 說明文字可用 boolean 關閉，只留標題
    if(opts.action){const a=ce('button','nt-action');a.textContent='立即查看';bd.appendChild(a);}
    t.appendChild(bd);
    if(opts.close){const x=ce('button','nt-close');x.innerHTML=ICON_CLOSE;x.setAttribute('aria-label','關閉');
      x.onclick=e=>{e.stopPropagation();ntDismiss(t);};t.appendChild(x);ntSwipe(t);}
    if(opts.timer){const arm=()=>{t._ntTimer=setTimeout(()=>{if(t.isConnected)ntDismiss(t,arm);},3000);};arm();} // auto-dismiss：3 秒後直接消失（無進度條）
    return t;}
  /* rect toast 原子：置中方形（圓 icon badge 在上、文字在下）*/
  function ntRectEl(intent){
    const el=ce('div',`nt-rect nt-i-${intent}`);
    const badge=ce('div','nt-rect-badge');badge.innerHTML=NT_ICON[intent];
    const tx=ce('div','nt-rect-txt');tx.textContent=NT_TITLE[intent];
    el.append(badge,tx);return el;}
  LIVE.notification=(host)=>mountLive(host,{gate:'notification',
    initial:{variant:'soft',intent:'info',icon:true,desc:true,action:false,close:true,timer:false},
    segs:[
      {key:'variant',label:'Variant',options:['solid','outline','soft','dark'],labels:['實心','外框','柔色','半透明黑']},
      {key:'intent',label:'Intent',options:['success','warning','error','info'],labels:['成功','警告','錯誤','資訊']}],
    bools:[{key:'icon',label:'with-icon'},{key:'desc',label:'說明文字'},{key:'action',label:'with-action'},{key:'close',label:'close ×'},{key:'timer',label:'auto-dismiss'}],
    boolLabel:'Feature',
    render:st=>{const t=ntEl(st.variant,st.intent,{icon:st.icon,desc:st.desc,action:st.action,close:st.close,timer:st.timer});t.classList.add('nt-in');return t;},
    note:'↑ auto-dismiss 開啟後 3 秒自動淡出再復原（示意循環）；無下方進度條。'
  });
  function buildNotification(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Notification',title:'Notification 通知 / Toast',
      lede:'非阻斷式的即時回饋（俗稱 toast／snackbar）。<b>variant × intent（4 × 4 = 16）</b>：solid／outline／soft／dark（半透明黑）四種視覺風格 × success／warning／error／info 四種意圖。with-icon、說明文字、with-action、close ×、auto-dismiss 為 feature flag；position（右上／右下／底部置中）不改元件本體、只是掛載位置。另附 Rect Toast 方形格式。',
      specRows:[['axes','<code>variant × intent</code>'],['formula','<code>4 × 4 = 16</code>'],['token-policy','<code>semantic.*.feedback.*</code>（待接）'],['features','with-icon ／ 說明文字 ／ with-action ／ close ／ auto-dismiss'],['position','toast-tr ／ toast-br ／ snackbar-bc']]});
    const axes=DIAL_SPECS.notification.axes, zh=DIAL_SPECS.notification.zh, active=CHOICE.notification.active; // 接中央 store
    const VN={solid:'實心 solid',outline:'外框 outline',soft:'柔色 soft',dark:'半透明黑 dark'};
    const IN={success:'成功',warning:'警告',error:'錯誤',info:'資訊'};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v)),is=axes.intent.filter(i=>active.intent.has(i));
      p.appendChild(matrixPanel({badge:'variant × intent',name:'Toast 通知卡',desc:'含 icon＋標題＋訊息＋×',rows:vs,cols:is,
        rowLab:v=>labHTML(VN[v].split(' ')[0],v),colLab:i=>labHTML(IN[i],i),
        cell:(v,i)=>ntEl(v,i,{icon:true,close:true}),mincol:240})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Intent 矩陣','列＝視覺風格（實心／外框／柔色／半透明黑）、欄＝意圖 4 色。每張卡含 icon＋標題＋訊息＋可點的 ×。');
    p=panelsIn(sec);renderM();
    /* ===== Position 掛載位置 ===== */
    const ps=section(body,'Position 掛載位置','同一顆 toast、三種常見停靠位置。position 不改元件本體，只決定它出現在畫面哪個角。');
    const posDemos=[
      ['toast-top-right','右上角 · 系統級提示','nt-pos-tr','success'],
      ['toast-bottom-right','右下角 · 常見預設','nt-pos-br','info'],
      ['snackbar-bottom-center','底部置中 · Snackbar','nt-pos-bc','warning'],
    ];
    const prd=ce('div','row-demo');prd.style.marginBottom='16px';
    posDemos.forEach(([en,zhc,pcls,intent])=>{
      const it=ce('div','demo-item');
      const scr=ce('div','nt-screen');
      const mini=ce('div',`nt-mini ${pcls} nt-i-${intent}`);
      mini.innerHTML='<span class="nt-dot"></span><span class="nt-mline"></span>';
      scr.appendChild(mini);it.appendChild(scr);
      const c=ce('div','cap');c.innerHTML=`<b>${zhc}</b><br><code>${en}</code>`;it.appendChild(c);
      prd.appendChild(it);});
    ps.appendChild(prd);
    /* ===== Rect Toast 方形（獨立格式）===== */
    const rs=section(body,'Rect Toast 方形（獨立格式）','有別於上方橫列 banner，rect 是固定 124×124 方形：圓 icon 在上、文字在下（對齊 Figma toast/rect_*）。intent 配色沿用本頁 DS 色（非 Figma 橘）。勾「自動輪播」後每 3 秒切換一種 intent。');
    const rrow=ce('div','row-demo');rrow.style.marginBottom='16px';
    [['success','成功'],['warning','警告'],['error','錯誤'],['info','資訊']].forEach(([it,zhi])=>{
      const item=ce('div','demo-item');item.appendChild(ntRectEl(it));
      const c=ce('div','cap');c.innerHTML=`<b>${zhi}·${it}</b>`;item.appendChild(c);rrow.appendChild(item);});
    rs.appendChild(rrow);
    const ctl=ce('div','checks');ctl.style.margin='4px 0 14px';
    const lab=ce('label','chk');const cb=document.createElement('input');cb.type='checkbox';
    lab.append(cb,document.createTextNode('自動輪播（每 3 秒切換一種 intent）'));ctl.appendChild(lab);rs.appendChild(ctl);
    const stage=ce('div','nt-rect-stage');rs.appendChild(stage);
    const ORDER=['success','warning','error','info'];let carIdx=0,carTimer=null;
    function showRect(intent){ stage.innerHTML='';
      const t=ntRectEl(intent);t.style.transition='opacity .28s ease, transform .28s ease';
      t.style.opacity='0';t.style.transform='scale(.92)';stage.appendChild(t);
      requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='none';}); }
    function tick(){ if(!stage.isConnected){clearInterval(carTimer);carTimer=null;return;}
      showRect(ORDER[carIdx%ORDER.length]);carIdx++; }
    cb.onchange=()=>{ if(cb.checked){carIdx=0;tick();carTimer=setInterval(tick,3000);}
      else{clearInterval(carTimer);carTimer=null;stage.innerHTML='';} };
    /* ===== 互動預覽與程式碼 ===== */
    const sl=section(body,'互動預覽與程式碼','切 variant／intent、勾 feature，下面即時預覽。close × 可點掉再自動復原；auto-dismiss 開啟後 3 秒直接消失再復原（示意循環）。');
    LIVE.notification(sl);
  }


  /* ---- SKELETON 骨架 ---- */
/* 單一骨架 atom：shape=text|rectangle|circle；size=s|m|l；anim=shimmer|pulse|none */
function skelEl(shape,size,anim){
  return ce('div',`sk sk-${shape} sk-sz-${size} sk-a-${anim||'shimmer'}`);
}
/* 組合範例：頭像卡（circle 頭像 + 兩行 text，模擬一張卡片載入中） */
function skelCard(anim){
  const card=ce('div','sk-card');
  const av=skelEl('circle','l',anim);
  const lines=ce('div','sk-lines');
  lines.appendChild(skelEl('text','m',anim)); // 標題行
  lines.appendChild(skelEl('text','s',anim)); // 副標行
  card.append(av,lines);return card;
}
/* 組合範例：段落（三行文字，末行留白） */
function skelPara(anim){
  const p=ce('div','sk-para');
  p.appendChild(skelEl('text','m',anim));
  p.appendChild(skelEl('text','m',anim));
  p.appendChild(skelEl('text','m',anim));
  return p;
}
/* 組合範例：媒體卡（矩形縮圖 + 標題／副標） */
function skelMedia(anim){
  const m=ce('div','sk-media');
  m.appendChild(skelEl('rectangle','l',anim));
  m.appendChild(skelEl('text','m',anim));
  m.appendChild(skelEl('text','s',anim));
  return m;
}

  /* Motion v1：骨架 → 內容。骨架先淡出，內容（同幾何：頭像＋兩行）從輕微模糊逐行淡入 */
  function skelLoadDemo(anim){
    const w=ce('div','sk-load-demo');const stack=ce('div','sk-load-stack');
    const real=ce('div','sk-real');real.innerHTML='<div class="sk-real-tx"><b>林語晨</b><span>剛剛更新了 Token 綁定</span></div>';const av=avtEl('m','circle','initials',{initials:'林'});av.classList.add('sk-real-av');real.prepend(av);
    stack.append(skelCard(anim),real);
    const b=ce('button','btn v-outline i-secondary sz-s live');b.innerHTML='<span>模擬載入完成</span>';
    b.onclick=()=>{const on=w.classList.toggle('is-loaded');swapText(b.querySelector('span'),on?'重新載入':'模擬載入完成');};
    w.append(stack,b);return w;}
  LIVE.skeleton=(host)=>mountLive(host,{gate:'skeleton',
    initial:{shape:'rectangle',size:'m',anim:'shimmer',card:false},
    segs:[
      {key:'shape',label:'Shape',options:['text','rectangle','circle'],labels:['文字列','矩形','圓形']},
      {key:'size',label:'Size',options:['s','m','l']},
      {key:'anim',label:'Animation',options:['shimmer','pulse','none'],labels:['光澤','脈衝','靜態']}
    ],
    bools:[{key:'card',label:'組合卡片（頭像 + 兩行文字）'}],
    boolLabel:'Composition',
    render:st=> st.card ? skelLoadDemo(st.anim) : skelEl(st.shape,st.size,st.anim),
    note:'↓ 三種動畫在矩形上快速對照',
    free:()=>['shimmer','pulse','none'].map(a=>skelEl('rectangle','m',a))
  });
  function buildSkeleton(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Skeleton',title:'Skeleton 骨架',
      lede:'內容載入前的佔位骨架，複雜度極低。<b>shape × size（3 × 3 = 9）</b>：三種基本形狀（文字列／矩形／圓形）× 三級尺寸。多個形狀可組合模擬真實內容結構（頭像卡、段落、媒體卡）。動畫僅是 feature flag：<b>shimmer 光澤／pulse 脈衝／none 靜態</b>，無語意色。',
      specRows:[['axes','<code>variant(shape) × size</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>surface.skeleton.*</code>（中性 --panel-3）'],['features','shimmer / pulse / no-animation']]});
    const axes=DIAL_SPECS.skeleton.axes, zh=DIAL_SPECS.skeleton.zh, active=CHOICE.skeleton.active; // 接中央 store
    const SN={text:['文字列','text'],rectangle:['矩形','rectangle'],circle:['圓形','circle']};
    const ZS={s:['小','s'],m:['中','m'],l:['大','l']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v)),szs=axes.size.filter(z=>active.size.has(z));
      p.appendChild(matrixPanel({badge:'skeleton',name:'Shape × Size 對照',desc:'列＝形狀、欄＝尺寸（皆帶 shimmer 光澤示意）',
        rows:vs,cols:szs,
        rowLab:s=>labHTML(SN[s][0],SN[s][1]),
        colLab:z=>labHTML(ZS[z][0],ZS[z][1]),
        cell:(s,z)=>skelEl(s,z,'shimmer'),mincol:140}));
    }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Shape × Size 矩陣','三種基本形狀 × 三級尺寸，共 9 顆。皆為中性佔位色（無語意色），動畫預設 shimmer。');
    p=panelsIn(sec);renderM();
    const secA=section(body,'動畫類型 Feature Flags','同一張頭像卡，比較三種動畫：shimmer 光澤掃過／pulse 脈衝／none 靜態（給 prefers-reduced-motion 或低能耗情境）。');
    const rd=ce('div','row-demo');rd.style.marginBottom='16px';
    [['shimmer 光澤掃過（預設）','shimmer','linear-gradient 掃過，質感佳'],
     ['pulse 脈衝','pulse','整體 opacity 呼吸，低能耗'],
     ['none 靜態','none','不動，尊重減少動態偏好']].forEach(function(row){var cap=row[0],a=row[1],note=row[2];
      const it=ce('div','demo-item');it.appendChild(skelCard(a));
      const c=ce('div','cap');c.innerHTML=`<b>${cap}</b><br>${note}`;it.appendChild(c);rd.appendChild(it);});
    body.appendChild(rd);
    const secC=section(body,'組合範例','把基本形狀拼起來，模擬真實內容的載入骨架。');
    const rd2=ce('div','row-demo');rd2.style.marginBottom='16px';
    [['頭像卡',skelCard('shimmer'),'circle 頭像 + 兩行 text'],
     ['段落',skelPara('shimmer'),'三行等寬 text（末行留白）'],
     ['媒體卡',skelMedia('shimmer'),'rectangle 縮圖 + 標題／副標']].forEach(function(row){var cap=row[0],node=row[1],note=row[2];
      const it=ce('div','demo-item');it.appendChild(node);
      const c=ce('div','cap');c.innerHTML=`<b>${cap}</b><br>${note}`;it.appendChild(c);rd2.appendChild(it);});
    body.appendChild(rd2);
    const sl=section(body,'互動預覽與程式碼','切 shape／size／動畫類型即時預覽；勾「組合卡片」改看頭像卡結構（動畫類型同步套用）。');
    LIVE.skeleton(sl);
  }


  /* ---- LOADER 載入器（loaderEl 提升頂層，頁面與 summary Live 共用）---- */
  function loaderEl(variant,intent,size,opts){opts=opts||{};
    intent=intent||'neutral';size=size||'m';
    const iCls='ld-'+intent;
    const wrap=ce('div','ld-wrap'+(opts.inline?' ld-inline':''));
    let core;
    if(variant==='dots'){
      core=ce('div','ld-dots '+iCls+' ld-sz-'+size);
      core.innerHTML='<span class="ld-dot"></span><span class="ld-dot"></span><span class="ld-dot"></span>';
    } else if(variant==='bar'){
      core=ce('div','ld-bar '+iCls+' ld-sz-'+size);
      const fill=ce('div','ld-bar-fill');
      if(opts.progress){fill.style.left='0';fill.style.width=(opts.pct||65)+'%';}
      else fill.className='ld-bar-fill ld-indet';
      core.appendChild(fill);
    } else {
      core=ce('div','ld-circ '+iCls+' ld-sz-'+size);
    }
    wrap.appendChild(core);
    if(opts.label){const l=ce('span','ld-label');l.textContent=opts.labelText||'載入中…';wrap.appendChild(l);}
    if(opts.progress){const pc=ce('span','ld-pct');pc.textContent=(opts.pct||65)+'%';wrap.appendChild(pc);}
    return wrap;
  }
  LIVE.loader=(host)=>mountLive(host,{gate:'loader',
    initial:{variant:'circular',size:'m',intent:'primary',label:false,progress:false,inline:false},
    segs:[{key:'variant',label:'Variant',options:['circular','dots','bar'],labels:['旋轉圈','跳動點','進度條']},
          {key:'size',label:'Size',options:['s','m','l']},
          {key:'intent',label:'Intent',options:['neutral','primary'],labels:['中性','品牌']}],
    bools:[{key:'label',label:'with-label 旁配文字'},{key:'progress',label:'with-progress %（進度條）'},{key:'inline',label:'inline 內嵌'}],
    render:st=>loaderEl(st.variant,st.intent,st.size,{label:st.label,labelText:'載入中…',progress:st.progress,pct:65,inline:st.inline}),
    note:'↓ 三種 variant 快速對照（primary·m）',
    free:()=>['circular','dots','bar'].map(v=>loaderEl(v,'primary','m',{}))
  });
  function buildLoader(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Loader',title:'Loader 載入器 / Spinner',
      lede:'載入狀態的視覺回饋。<b>variant × size（3 × 3 = 9）</b>：旋轉圈 circular／跳動點 dots／進度條 bar；size 分小 s／標準 m／大 l。intent 只有中性 neutral／品牌 primary 兩色（loader 不承載 feedback 語意）。with-label／inline／full-screen／with-progress 為 feature flag。',
      specRows:[['axes','<code>variant × size</code>（intent 走 flag）'],['formula','<code>3 × 3</code>（視覺全展）'],['token-policy','<code>semantic.feedback.loading.*</code>'],['features','with-label / inline / full-screen / with-progress']]});
    function screenDemo(){
      const s=ce('div','ld-screen');
      const sk=ce('div','ld-screen-sk');
      sk.innerHTML='<i style="width:55%"></i><i style="width:88%"></i><i style="width:74%"></i><i style="width:40%"></i>';
      const ov=ce('div','ld-overlay');
      ov.appendChild(loaderEl('circular','primary','l',{}));
      const l=ce('span','ld-label');l.textContent='載入中，請稍候…';ov.appendChild(l);
      s.append(sk,ov);return s;
    }
    const VN={circular:['旋轉圈','circular'],dots:['跳動點','dots'],bar:['進度條','bar']};
    const SZ={s:['小','s'],m:['標準','m'],l:['大','l']};
    const axes=DIAL_SPECS.loader.axes, zh=DIAL_SPECS.loader.zh, active=CHOICE.loader.active; // 接中央 store
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v)),szs=axes.size.filter(s=>active.size.has(s));
      p.appendChild(matrixPanel({badge:'category · loading',name:'旋轉圈／跳動點／進度條 × 尺寸',
        rows:vs,cols:szs,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(SZ[s][0],SZ[s][1]),
        cell:(v,s)=>loaderEl(v,'neutral',s,{}),mincol:140})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','列＝三種樣式、欄＝三個尺寸。動畫持續播放；此矩陣統一用中性色。');p=panelsIn(sec);renderM();
    const si=section(body,'Intent 意圖','loader 只有中性／品牌兩色；不承載 success／warning／error（那是 <a href="#alert">alert</a> 的事）。以標準 m 尺寸對照。');
    const rdI=ce('div','row-demo');rdI.style.marginBottom='16px';
    [['circular','旋轉圈'],['dots','跳動點'],['bar','進度條']].forEach(([v,zhn])=>{
      [['neutral','中性'],['primary','品牌']].forEach(([it,zhi])=>{
        const item=ce('div','demo-item');item.appendChild(loaderEl(v,it,'m',{}));
        const c=ce('div','cap');c.innerHTML=`<b>${zhn}·${zhi}</b>`;item.appendChild(c);rdI.appendChild(item);});
    });
    si.appendChild(rdI);
    const sf=section(body,'Feature Flags 功能旗標','旁配文字／文字內嵌／全螢幕遮罩／顯示百分比——內容差異走旗標、不進 variant 矩陣。');
    const rdF=ce('div','row-demo');rdF.style.marginBottom='16px';
    const f1=ce('div','demo-item');f1.appendChild(loaderEl('circular','primary','m',{label:true,labelText:'載入中…'}));
    const c1=ce('div','cap');c1.innerHTML='<b>with-label 旁配文字</b>';f1.appendChild(c1);rdF.appendChild(f1);
    const f2=ce('div','demo-item');
    const line=ce('div');line.style.cssText='display:flex;align-items:center;gap:6px;color:var(--muted);font-size:14px;';
    const tx=document.createElement('span');tx.textContent='表格資料更新中';line.appendChild(tx);
    line.appendChild(loaderEl('dots','neutral','s',{inline:true}));
    f2.appendChild(line);
    const c2=ce('div','cap');c2.innerHTML='<b>inline 文字內嵌小尺寸</b>';f2.appendChild(c2);rdF.appendChild(f2);
    const f3=ce('div','demo-item');f3.appendChild(loaderEl('bar','primary','m',{progress:true,pct:65}));
    const c3=ce('div','cap');c3.innerHTML='<b>with-progress 顯示百分比</b>';f3.appendChild(c3);rdF.appendChild(f3);
    const f4=ce('div','demo-item');f4.style.minWidth='240px';f4.appendChild(screenDemo());
    const c4=ce('div','cap');c4.innerHTML='<b>full-screen 全螢幕遮罩置中</b>';f4.appendChild(c4);rdF.appendChild(f4);
    sf.appendChild(rdF);
    const sl=section(body,'互動預覽與程式碼','切 variant／size／intent、勾旗標，下面即時重繪（動畫持續播放）。');
    LIVE.loader(sl);
  }



