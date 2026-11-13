  /* ======================================================================
     P3 元件（2026-11-11）：Time Picker／Color Picker／Cascader／Tree Select／Tour／Menubar
     ====================================================================== */

  /* ---------- 選擇器共用（PKR-FIELD:v1）：欄位取用 Input 的 .field、浮層取用 Popover（.pop.pop-float），開合／外點／Esc 行為同 Date Picker ---------- */
  /* pkrField(o)：o.cls 外層 class、o.icon 前置 SVG、o.state 狀態、o.ph 佔位、o.val 值（字串或節點）、o.label 讀屏名稱、o.caret 下拉箭頭、o.err 錯誤訊息 */
  function pkrField(o){const w=ce('div','pkr '+o.cls);
    const f=ce('div','field v-outline st-'+o.state+(o.caret?' dd':''));f.setAttribute('role','combobox');f.setAttribute('aria-haspopup',o.popup||'dialog');
    f.setAttribute('aria-expanded','false');f.setAttribute('aria-label',o.label);if(o.state==='disabled')f.setAttribute('aria-disabled','true');else f.tabIndex=0;
    if(o.icon)f.insertAdjacentHTML('beforeend',o.icon);
    const body=ce('span','pkr-body');f.appendChild(body);
    if(o.caret){const c=ce('span','ddcaret');c.innerHTML=ICON_CARET;f.appendChild(c);}
    w.appendChild(f);w.__f=f;w.__body=body;w.__ph=o.ph;pkrSet(w,o.val);
    if(o.state==='error'&&o.err)pkrErr(w,o.err);
    return w;}
  /* 換欄位顯示值：空值顯示佔位字；節點直接放入（多選 chip 等） */
  function pkrSet(w,val){const b=w.__body;b.innerHTML='';
    if(val==null||val===''||(Array.isArray(val)&&!val.length)){const p=ce('span','ph');p.textContent=w.__ph||'請選擇';b.appendChild(p);}
    else if(val instanceof Node)b.appendChild(val);
    else{const v=ce('span','val');v.textContent=val;b.appendChild(v);}}
  /* 錯誤訊息：msg 為空就清掉紅框 */
  function pkrErr(w,msg){const f=w.__f;let e=w.querySelector(':scope > .pkr-err');
    if(!msg){f.classList.remove('st-error');if(e)e.remove();return;}
    f.classList.add('st-error');if(!e){e=ce('div','pkr-err');f.after(e);}e.textContent=msg;}
  /* 靜態展開（矩陣／展開的樣子用）：直接把面板放在欄位下方 */
  function pkrStatic(w,panel){const pp=ce('div','pop pkr-pop pkr-pop-static');pp.appendChild(panel);w.appendChild(pp);w.__f.classList.add('st-open');const c=w.__f.querySelector('.ddcaret');if(c)c.classList.add('up');return w;}
  /* 開合控制：panelFn(close) 回傳浮層內容 */
  function pkrPop(stage,w,panelFn,o){o=o||{};const f=w.__f;let pp=null;
    const caret=v=>{const c=f.querySelector('.ddcaret');if(c)c.classList.toggle('up',v);};
    const close=back=>{if(!pp)return;pp.classList.remove('is-open');f.setAttribute('aria-expanded','false');f.classList.remove('st-open');caret(false);
      const old=pp;pp=null;afterTransition(old,()=>old.remove());if(back)f.focus({preventScroll:true});};
    const open=()=>{if(pp)return;pp=ce('div','pop pkr-pop pop-float'+(o.popCls?' '+o.popCls:''));pp.setAttribute('role',o.role||'dialog');pp.setAttribute('aria-label',o.label||'');
      pp.appendChild(panelFn(close));w.appendChild(pp);void pp.offsetWidth;pp.classList.add('is-open');f.setAttribute('aria-expanded','true');f.classList.add('st-open');caret(true);
      setTimeout(()=>{if(!pp)return;const t=pp.querySelector('[data-pkr-focus]')||pp.querySelector('[tabindex="0"],button:not(:disabled)');if(t)t.focus({preventScroll:true});},40);};
    f.addEventListener('click',e=>{if(e.target.closest('.x'))return;pp?close(false):open();});
    f.addEventListener('keydown',e=>{if(e.target!==f)return;if(['Enter',' ','ArrowDown'].includes(e.key)){e.preventDefault();open();}});
    w.addEventListener('keydown',e=>{if(e.key==='Escape'&&pp){e.preventDefault();e.stopPropagation();close(true);}});
    const outside=e=>{if(!stage.isConnected){document.removeEventListener('pointerdown',outside);return;}if(pp&&!w.contains(e.target))close(false);};
    document.addEventListener('pointerdown',outside);
    return {open,close,isOpen:()=>!!pp};}
  /* 取用 Button 原子（s），改成指定文字 */
  function pkrBtn(label,variant,intent){const b=mkBtn({variant,intent,size:'s',isLive:true});b.type='button';b.querySelector('span').textContent=label;return b;}
  /* 多選欄位內容：取用 Dropdown 的 .ddchip；超過 max 顆收成「+N」；onRemove 給了才有 × */
  function pkrChips(labels,o){o=o||{};const max=o.max||3;const frag=document.createDocumentFragment();
    labels.slice(0,max).forEach(l=>{const c=ce('span','ddchip');const t=ce('span');t.textContent=l;c.appendChild(t);
      if(o.onRemove){const x=ce('span','x');x.innerHTML=ICON_CLOSE;x.setAttribute('role','button');x.setAttribute('aria-label','移除 '+l);x.onclick=e=>{e.stopPropagation();o.onRemove(l);};c.appendChild(x);}
      frag.appendChild(c);});
    if(labels.length>max){const m=ce('span','pkr-more');m.textContent='+'+(labels.length-max);frag.appendChild(m);}
    const s=ce('span','pkr-chips');s.appendChild(frag);return s;}
  const PKR_STN={default:['預設','default'],focus:['聚焦','focus'],filled:['已選','filled'],disabled:['停用','disabled'],error:['錯誤','error']};

  /* ---------- TIME PICKER 時間選擇（TPK:v1）：24 小時制；時、分兩欄捲動（分鐘 5 分一格），選項取用 Dropdown 的 .ddopt ---------- */
  const TPK_H=[...Array(24)].map((_,i)=>i),TPK_M=[...Array(12)].map((_,i)=>i*5);
  const tpkP2=n=>(n<10?'0':'')+n,tpkFmt=t=>tpkP2(t[0])+':'+tpkP2(t[1]);
  /* tpkPanel(o)：o.range 時段；o.val 單一＝[時,分]、時段＝{s:[時,分],e:[時,分]}；o.live 可操作；o.onChange(值)、o.onDone() */
  function tpkPanel(o){const box=ce('div','tpk-panel'+(o.range?' tpk-panel-range':''));
    const v=o.range?{s:(o.val&&o.val.s||[9,0]).slice(),e:(o.val&&o.val.e||[18,0]).slice()}:(o.val||[14,30]).slice();
    let which='s';const cur=()=>o.range?v[which]:v;
    if(o.range)box.appendChild(sgmEl('soft','s',{live:!!o.live,full:true,items:['開始','結束'],active:0,onChange:i=>{which=i?'e':'s';paint(true);}}));
    const cols=ce('div','tpk-cols');const lists=[];
    [[TPK_H,'時'],[TPK_M,'分']].forEach(([list,lab],k)=>{const cw=ce('div','tpk-colwrap');const hd=ce('div','tpk-col-h');hd.textContent=lab;
      const c=ce('div','tpk-col');c.setAttribute('role','listbox');c.setAttribute('aria-label',lab);
      list.forEach(n=>{const b=ce('div','ddopt tpk-opt');b.setAttribute('role','option');b.tabIndex=-1;b.textContent=tpkP2(n);b.dataset.n=n;
        if(o.live)b.onclick=()=>{cur()[k]=n;paint();emit();b.focus({preventScroll:true});};c.appendChild(b);});
      if(o.live)c.addEventListener('keydown',e=>{const opts=[...c.children],i=opts.findIndex(x=>+x.dataset.n===cur()[k]);
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=opts[(i+(e.key==='ArrowDown'?1:-1)+opts.length)%opts.length];cur()[k]=+n.dataset.n;paint(true);emit();n.focus({preventScroll:true});}
        else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const t=lists[k?0:1].querySelector('.sel');if(t)t.focus({preventScroll:true});}
        else if(e.key==='Enter'){e.preventDefault();if(o.onDone)o.onDone();}});
      cw.append(hd,c);cols.appendChild(cw);lists.push(c);});
    box.appendChild(cols);
    /* 把選中項標起來並捲到欄位中間 */
    function paint(scroll){lists.forEach((c,k)=>[...c.children].forEach(b=>{const on=+b.dataset.n===cur()[k];b.classList.toggle('sel',on);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;
      if(on&&scroll!==false)c.scrollTop=b.offsetTop-c.clientHeight/2+b.offsetHeight/2;}));
      const s=lists[0].querySelector('.sel');if(s)s.dataset.pkrFocus='1';}
    function emit(){if(o.onChange)o.onChange(o.range?{s:v.s.slice(),e:v.e.slice()}:v.slice());}
    if(o.live){const ft=ce('div','tpk-foot');const now=pkrBtn('現在','text','secondary'),ok=pkrBtn('確定','solid','primary');
      now.onclick=()=>{const d=new Date();const t=cur();t[0]=d.getHours();t[1]=Math.floor(d.getMinutes()/5)*5;paint(true);emit();};ok.onclick=()=>{if(o.onDone)o.onDone();};
      ft.append(now,ok);box.appendChild(ft);}
    paint(false);requestAnimationFrame(()=>paint(true));   /* 面板掛上去量得到高度後再捲到選中項 */
    return box;}
  function tpkEl(variant,state,o){o=o||{};const range=variant==='range';
    const filled=['filled','error'].includes(state);
    const val=o.value||(filled?(range?(state==='error'?'18:00 – 09:00':'09:00 – 18:00'):(state==='error'?'22:30':'14:30')):'');
    const w=pkrField({cls:'tpk tpk-'+variant,icon:IC_CLOCK,state,ph:range?'開始 – 結束':'時:分',val,label:range?'選擇時段':'選擇時間',
      err:range?'結束時間要晚於開始時間':'請選 09:00–18:00 之間的時間'});
    if(o.panel)pkrStatic(w,tpkPanel({range,val:range?{s:[9,0],e:[18,0]}:[14,30]}));
    return w;}
  function tpkLive(variant){const range=variant==='range';const stage=ce('div','pop-live-stage pkr-live-stage');const w=tpkEl(variant,'default',{});
    let val=range?{s:[9,0],e:[18,0]}:[14,30];
    const show=()=>{pkrSet(w,range?tpkFmt(val.s)+' – '+tpkFmt(val.e):tpkFmt(val));
      if(range){const a=val.s[0]*60+val.s[1],b=val.e[0]*60+val.e[1];pkrErr(w,b<=a?'結束時間要晚於開始時間':null);}};
    pkrPop(stage,w,close=>tpkPanel({range,val,live:true,onChange:v=>{val=v;show();},onDone:()=>close(true)}),{label:range?'選擇時段':'選擇時間'});
    stage.appendChild(w);return stage;}
  LIVE['time-picker']=(host)=>mountLive(host,{gate:'time-picker',initial:{variant:'single'},
    segs:[{key:'variant',label:'Variant',options:['single','range'],labels:['單一時間','時段']}],
    render:st=>tpkLive(st.variant),
    note:'24 小時制。點欄位（或 Enter／↓）打開；點時、分直接寫回欄位。↑↓ 換數字、←→ 換欄、Enter 或「確定」關閉；時段先切「開始／結束」再選，結束早於開始會即時標紅。'});
  function buildTimePicker(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Time Picker',title:'Time Picker 時間選擇',
      lede:'表單裡選時間的欄位，<b>一律 24 小時制</b>（09:00、18:30），不用上午／下午。欄位取用 <a href="#input">input</a> 的 field、浮層沿用 <a href="#popover">popover</a>、選項取用 <a href="#dropdown">dropdown</a> 的選項列，時段的開始／結束切換取用 <a href="#segmented">segmented</a>。兩種 variant × 五種狀態（<b>2 × 5 = 10</b>）。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>2 × 5 = 10</code>'],['token-policy','<code>semantic.*.input.* · semantic.*.popover.*</code>'],['features','24h / 5 分一格 / keyboard / range 檢查']]});
    const VN={single:['單一時間','single'],range:['時段','range']};
    const axes=DIAL_SPECS['time-picker'].axes,zh=DIAL_SPECS['time-picker'].zh,active=CHOICE['time-picker'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'field · 收合',name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(PKR_STN[s][0],PKR_STN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(s,v)=>tpkEl(v,s,{}),mincol:300}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','欄位外觀與 input 完全一致；時間一律 時:分（兩位數）與等寬數字，時段用「–」連接。');p=panelsIn(sec);renderM();
    const os=section(body,'展開的樣子','時、分兩欄各自捲動，選中項置中；時段多一列「開始／結束」切換。');capRow(os,[['單一時間',tpkEl('single','filled',{panel:true})],['時段',tpkEl('range','filled',{panel:true})]]);os.querySelector('.row-demo').classList.add('pkr-demo-row');
    usageSection(body,[['用 Time Picker','預約、營業時間、提醒這類要選「幾點幾分」的欄位。'],['改成直接輸入','熟手常打的時間（例如工時登錄），欄位可以直接打 0930。'],['改用 Chip','只有少數固定時段可選（10:00／14:00／16:00）。'],['搭配 Date Picker','同時要日期和時間時，兩個欄位並排，不要塞進同一個浮層。']]);
    const sl=section(body,'互動預覽與程式碼','點欄位選時間。');LIVE['time-picker'](sl);
  }

  /* ---------- COLOR PICKER 選色器（CPK:v1）：色票版＝取用 Chip（帶色點）；完整版＝彩度平面＋色相滑桿（取用 Slider）＋色碼欄（取用 Input）＋色票 ---------- */
  const CPK_PRESETS=[['#1C1C20','品牌黑'],['#2563EB','藍'],['#16A34A','綠'],['#EA580C','橘'],['#DB2777','桃紅'],['#7C3AED','紫']];
  /* 色彩換算：hex ↔ HSV（h 0–360、s／v 0–1） */
  function cpkHex2Hsv(hex){const m=/^#?([0-9a-f]{6})$/i.exec(hex||'');if(!m)return null;const n=parseInt(m[1],16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255;
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;
    if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}
    return {h,s:mx?d/mx:0,v:mx};}
  function cpkHsv2Hex(h,s,v){const f=n=>{const k=(n+h/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1));};
    return '#'+[f(5),f(3),f(1)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('').toUpperCase();}
  /* cpkPanel(o)：o.variant swatch｜full；o.hex 目前色；o.live；o.onChange(hex) */
  function cpkPanel(o){const box=ce('div','cpk-panel cpk-panel-'+o.variant);let hex=(o.hex||'#EA580C').toUpperCase();let hsv=cpkHex2Hsv(hex)||{h:20,s:.9,v:.9};
    let chips=null;
    const emit=()=>{if(o.onChange)o.onChange(hex);};
    const presetVal=()=>{const f=CPK_PRESETS.find(x=>x[0]===hex);return f?f[0]:null;};
    const mkChips=()=>chpGroup('single','s',{items:CPK_PRESETS.map(([c,l])=>({k:c,label:l,dot:c})),value:presetVal(),label:'預設顏色',live:!!o.live,
      onChange:k=>{hex=k;hsv=cpkHex2Hsv(hex);paint('chip');emit();if(o.variant==='swatch'&&o.onDone)o.onDone();}});
    let plane,knob,hue,hexIn,prev;
    if(o.variant==='full'){
      plane=ce('div','cpk-plane');knob=ce('span','cpk-knob');knob.setAttribute('role','slider');knob.setAttribute('aria-label','彩度與明度');knob.tabIndex=o.live?0:-1;knob.dataset.pkrFocus='1';plane.appendChild(knob);
      hue=sldEl('single','s',o.live?'default':'default',{label:false,min:0,max:359,step:1,value:Math.round(hsv.h),title:'色相',live:!!o.live,onChange:x=>{hsv.h=x;hex=cpkHsv2Hex(hsv.h,hsv.s,hsv.v);paint('hue');emit();}});
      hue.classList.add('cpk-hue');
      const row=ce('div','cpk-row');prev=ce('span','cpk-sw cpk-prev');
      const fld=ce('div','field v-outline fsz-s live-field');hexIn=document.createElement('input');hexIn.className='bare';hexIn.maxLength=7;hexIn.spellcheck=false;hexIn.setAttribute('aria-label','色碼');
      if(!o.live)hexIn.tabIndex=-1;fld.appendChild(hexIn);row.append(prev,fld);
      box.append(plane,hue,row);
      if(o.live){
        const at=e=>{const r=plane.getBoundingClientRect();hsv.s=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));hsv.v=Math.min(1,Math.max(0,1-(e.clientY-r.top)/r.height));hex=cpkHsv2Hex(hsv.h,hsv.s,hsv.v);paint('plane');emit();};
        plane.addEventListener('pointerdown',e=>{e.preventDefault();plane.setPointerCapture(e.pointerId);at(e);knob.focus({preventScroll:true});
          const mv=ev=>at(ev),up=()=>{plane.removeEventListener('pointermove',mv);plane.removeEventListener('pointerup',up);plane.removeEventListener('pointercancel',up);};
          plane.addEventListener('pointermove',mv);plane.addEventListener('pointerup',up);plane.addEventListener('pointercancel',up);});
        knob.addEventListener('keydown',e=>{const d={ArrowRight:[.02,0],ArrowLeft:[-.02,0],ArrowUp:[0,.02],ArrowDown:[0,-.02]}[e.key];if(!d)return;e.preventDefault();
          hsv.s=Math.min(1,Math.max(0,hsv.s+d[0]));hsv.v=Math.min(1,Math.max(0,hsv.v+d[1]));hex=cpkHsv2Hex(hsv.h,hsv.s,hsv.v);paint('plane');emit();});
        hexIn.addEventListener('input',()=>{let t=hexIn.value.trim();if(t&&t[0]!=='#')t='#'+t;const n=cpkHex2Hsv(t);fld.classList.toggle('st-error',!!t&&!n);
          if(n){hex=t.toUpperCase();hsv=n;paint('input');emit();}});}
    }
    chips=mkChips();box.appendChild(chips);
    /* 依來源更新其他部件（不改正在操作的那個，避免游標跳動） */
    function paint(src){box.style.setProperty('--cpk-h',Math.round(hsv.h));box.style.setProperty('--cpk-c',hex);
      if(plane){knob.style.left=(hsv.s*100)+'%';knob.style.top=((1-hsv.v)*100)+'%';knob.setAttribute('aria-valuetext',hex);
        if(src!=='input')hexIn.value=hex;prev.style.setProperty('--cpk-c',hex);
        if(src==='chip'||src==='input'){{/* 色相從色票／色碼來時，重建一顆同設定的 Slider（維持取用原子） */const nhue=sldEl('single','s','default',{label:false,min:0,max:359,step:1,value:Math.round(hsv.h),title:'色相',live:!!o.live,onChange:x=>{hsv.h=x;hex=cpkHsv2Hex(hsv.h,hsv.s,hsv.v);paint('hue');emit();}});nhue.classList.add('cpk-hue');hue.replaceWith(nhue);hue=nhue;}}}
      if(chips&&src!=='chip')chips.__btns.forEach(b=>{const on=b.dataset.k===hex;b.setAttribute('aria-checked',String(on));});}
    paint('init');return box;}
  function cpkSwatch(hex){return '<span class="cpk-sw'+(hex?'':' is-empty')+'"'+(hex?' style="--cpk-c:'+hex+'"':'')+'></span>';}
  function cpkEl(variant,state,o){o=o||{};const filled=['filled','error'].includes(state);
    const hex=o.value||(state==='error'?'':(filled?'#EA580C':''));
    const w=pkrField({cls:'cpk cpk-'+variant,icon:cpkSwatch(hex),state,ph:'#RRGGBB',val:state==='error'?'#EA58G0':hex,label:'選擇顏色',err:'色碼要是 # 加 6 位 0–9、A–F'});
    if(o.panel)pkrStatic(w,cpkPanel({variant,hex:'#EA580C'}));
    return w;}
  function cpkLive(variant){const stage=ce('div','pop-live-stage pkr-live-stage');let hex='#EA580C';const w=cpkEl(variant,'filled',{value:hex});
    const show=()=>{pkrSet(w,hex);const sw=w.__f.querySelector('.cpk-sw');sw.classList.remove('is-empty');sw.style.setProperty('--cpk-c',hex);};
    pkrPop(stage,w,close=>cpkPanel({variant,hex,live:true,onChange:h=>{hex=h;show();},onDone:()=>close(true)}),{label:'選色器'});
    stage.appendChild(w);return stage;}
  LIVE['color-picker']=(host)=>mountLive(host,{gate:'color-picker',initial:{variant:'full'},
    segs:[{key:'variant',label:'Variant',options:['swatch','full'],labels:['色票','完整']}],
    render:st=>cpkLive(st.variant),
    note:'色票版點一顆就套用並關閉；完整版可拖彩度平面（或聚焦後用方向鍵）、拉色相、直接打色碼，欄位即時跟著變。Esc 或點外面關閉。'});
  function buildColorPicker(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Color Picker',title:'Color Picker 選色器',
      lede:'讓使用者自訂顏色的欄位（標籤顏色、品牌主色）。欄位取用 <a href="#input">input</a> 的 field、浮層沿用 <a href="#popover">popover</a>；<b>色票版</b>的預設色取用 <a href="#chip">chip</a>（帶色點），<b>完整版</b>再加彩度平面、色相取用 <a href="#slider">slider</a>、色碼欄取用 input。兩種 variant × 五種狀態（<b>2 × 5 = 10</b>）。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>2 × 5 = 10</code>'],['token-policy','<code>semantic.*.input.* · semantic.*.popover.*</code>'],['features','HSV 平面 / hue / hex 輸入 / 預設色']]});
    const VN={swatch:['色票','swatch'],full:['完整','full']};
    const axes=DIAL_SPECS['color-picker'].axes,zh=DIAL_SPECS['color-picker'].zh,active=CHOICE['color-picker'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'field · 收合',name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(PKR_STN[s][0],PKR_STN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(s,v)=>cpkEl(v,s,{}),mincol:280}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','欄位左側色塊＝目前顏色（四邊等距的正方形），右側是等寬大寫色碼；沒選時色塊畫斜線。');p=panelsIn(sec);renderM();
    const os=section(body,'展開的樣子','色票版只有預設色；完整版上面是彩度平面與色相，下面保留同一組預設色。');capRow(os,[['色票',cpkEl('swatch','filled',{panel:true})],['完整',cpkEl('full','filled',{panel:true})]]);os.querySelector('.row-demo').classList.add('pkr-demo-row');
    usageSection(body,[['用 Color Picker','使用者真的需要「任意顏色」：標籤、行事曆分類、品牌設定。'],['只給色票','多數情境給 6～12 個預設色就夠，避免挑出看不清的顏色。'],['改用 Chip','只有幾個固定選項、而且每個都有名字（冷靜／自然／溫暖）。']]);
    const sl=section(body,'互動預覽與程式碼','點欄位選顏色。');LIVE['color-picker'](sl);
  }

  /* ---------- CASCADER 多層選擇（CSC:v1）：欄位取用 Dropdown 的 .field.dd；面板多欄並排，選項取用 .ddopt、多選勾選框取用 Checkbox（cbxEl） ---------- */
  const CSC_DATA=[{l:'台北市',c:['中正區','大安區','信義區','松山區','中山區']},{l:'新北市',c:['板橋區','永和區','中和區','新店區']},{l:'台中市',c:['西屯區','北屯區','南屯區']},
    {l:'高雄市',c:['苓雅區','前鎮區','左營區']},{l:'花蓮縣',c:['花蓮市','吉安鄉']}];
  /* cscPanel(o)：o.multi；o.val 單選＝[縣市索引,區索引]、多選＝Set('縣市索引:區索引')；o.live；o.onPick(值) */
  function cscPanel(o){const box=ce('div','csc-panel');const multi=!!o.multi;let act=multi?(o.act||0):(o.val?o.val[0]:0);const sel=multi?new Set(o.val||[]):null;
    const c1=ce('div','csc-col');c1.setAttribute('role','listbox');c1.setAttribute('aria-label','縣市');
    const c2=ce('div','csc-col');c2.setAttribute('role','listbox');c2.setAttribute('aria-label','鄉鎮市區');if(multi)c2.setAttribute('aria-multiselectable','true');
    box.append(c1,c2);
    const cnt=ci=>[...sel].filter(k=>k.split(':')[0]==ci).length;
    function draw1(){c1.innerHTML='';CSC_DATA.forEach((city,ci)=>{const it=ce('div','ddopt csc-opt'+(ci===act?' is-act':''));it.setAttribute('role','option');it.tabIndex=ci===act?0:-1;it.setAttribute('aria-expanded',String(ci===act));
      const l=ce('span','csc-l');l.textContent=city.l;it.appendChild(l);
      if(multi&&cnt(ci)){const n=ce('span','csc-n');n.textContent=cnt(ci);it.appendChild(n);}
      it.insertAdjacentHTML('beforeend',PI('chevron-right'));
      if(!multi&&o.val&&o.val[0]===ci)it.classList.add('sel');
      if(o.live){it.onclick=()=>{act=ci;draw1();draw2();c1.children[ci].focus({preventScroll:true});};it.onmouseenter=()=>{if(act!==ci){act=ci;draw1();draw2();}};}
      if(ci===act)it.dataset.pkrFocus='1';c1.appendChild(it);});}
    function draw2(){c2.innerHTML='';CSC_DATA[act].c.forEach((d,di)=>{const k=act+':'+di;const it=ce('div','ddopt csc-opt');it.setAttribute('role','option');it.tabIndex=di?-1:0;
      const on=multi?sel.has(k):(o.val&&o.val[0]===act&&o.val[1]===di);it.setAttribute('aria-selected',String(!!on));
      if(multi){const cb=cbxEl(on?'checked':'default','s');cb.setAttribute('aria-hidden','true');it.appendChild(cb);}else if(on)it.classList.add('sel');
      const l=ce('span','csc-l');l.textContent=d;it.appendChild(l);
      if(o.live)it.onclick=()=>{if(multi){sel.has(k)?sel.delete(k):sel.add(k);draw1();draw2();c2.children[di].focus({preventScroll:true});if(o.onPick)o.onPick(new Set(sel));}
        else{o.val=[act,di];if(o.onPick)o.onPick([act,di]);}};
      c2.appendChild(it);});}
    if(o.live)box.addEventListener('keydown',e=>{const col=e.target.closest('.csc-col');if(!col)return;const opts=[...col.children],i=opts.indexOf(e.target);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=opts[(i+(e.key==='ArrowDown'?1:-1)+opts.length)%opts.length];
        if(col===c1){n.click();}else n.focus({preventScroll:true});}
      else if(e.key==='ArrowRight'&&col===c1){e.preventDefault();const f=c2.firstElementChild;if(f)f.focus({preventScroll:true});}
      else if(e.key==='ArrowLeft'&&col===c2){e.preventDefault();c1.children[act].focus({preventScroll:true});}
      else if((e.key==='Enter'||e.key===' ')&&i>=0){e.preventDefault();e.target.click();}});
    draw1();draw2();return box;}
  const cscLabel=v=>CSC_DATA[v[0]].l+' / '+CSC_DATA[v[0]].c[v[1]];
  const cscNames=set=>[...set].map(k=>{const [a,b]=k.split(':');return CSC_DATA[a].c[b];});
  function cscEl(variant,state,o){o=o||{};const multi=variant==='multi',filled=['filled','error'].includes(state);
    let val='';if(filled)val=multi?pkrChips(['大安區','信義區','板橋區','永和區']):(state==='error'?'台北市':cscLabel([0,1]));
    const w=pkrField({cls:'csc csc-'+variant,state,ph:'縣市 / 鄉鎮市區',val,label:'選擇地區',caret:true,popup:'listbox',err:multi?'最多選 3 區':'請選到鄉鎮市區'});
    if(multi&&filled)w.__f.classList.add('multi');
    if(o.panel)pkrStatic(w,cscPanel(multi?{multi,val:['0:1','0:2','1:0','1:1'],act:0}:{val:[0,1]}));
    return w;}
  function cscLive(variant){const multi=variant==='multi';const stage=ce('div','pop-live-stage pkr-live-stage');const w=cscEl(variant,'default',{});
    let val=multi?new Set():null;
    const show=()=>{if(multi){const names=cscNames(val);w.__f.classList.toggle('multi',!!names.length);
        pkrSet(w,names.length?pkrChips(names,{onRemove:n=>{[...val].forEach(k=>{if(cscNames([k])[0]===n)val.delete(k);});show();}}):'');}
      else pkrSet(w,val?cscLabel(val):'');};
    pkrPop(stage,w,close=>cscPanel({multi,val:multi?val:val,live:true,onPick:v=>{val=v;show();if(!multi)close(true);}}),{label:'選擇地區',role:'group'});
    stage.appendChild(w);return stage;}
  LIVE.cascader=(host)=>mountLive(host,{gate:'cascader',initial:{variant:'single'},
    segs:[{key:'variant',label:'Variant',options:['single','multi'],labels:['單選','多選']}],
    render:st=>cscLive(st.variant),
    note:'滑過或點縣市，右欄換成該縣市的區；單選點到區就寫回並關閉，多選可跨縣市勾選、縣市旁顯示已選數量。↑↓ 移動、→ 進下一層、← 回上一層、Enter 選取、Esc 關閉。'});
  function buildCascader(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Cascader',title:'Cascader 多層選擇',
      lede:'有上下層關係的選項，一層一欄往右展開（縣市 → 鄉鎮市區）。欄位取用 <a href="#dropdown">dropdown</a> 的 field 與選項列、浮層沿用 <a href="#popover">popover</a>、多選勾選框取用 <a href="#selector">checkbox</a>、已選項取用 dropdown 的 chip。兩種 variant × 五種狀態（<b>2 × 5 = 10</b>）。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>2 × 5 = 10</code>'],['token-policy','<code>semantic.*.input.* · semantic.*.popover.*</code>'],['features','hover 展開 / 跨層多選 / keyboard']]});
    const VN={single:['單選','single'],multi:['多選','multi']};
    const axes=DIAL_SPECS.cascader.axes,zh=DIAL_SPECS.cascader.zh,active=CHOICE.cascader.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'field · 收合',name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(PKR_STN[s][0],PKR_STN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(s,v)=>cscEl(v,s,{}),mincol:300}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','單選在欄位顯示完整路徑（台北市 / 大安區）；多選只顯示最後一層，超過 3 個收成 +N。');p=panelsIn(sec);renderM();
    const os=section(body,'展開的樣子','左欄是上層、右欄是目前上層的下一層；目前展開的上層用灰底標出。');capRow(os,[['單選',cscEl('single','filled',{panel:true})],['多選',cscEl('multi','filled',{panel:true})]]);os.querySelector('.row-demo').classList.add('pkr-demo-row');
    usageSection(body,[['用 Cascader','2～3 層、每層選項不多的固定分類：地址、商品類別。'],['改用兩個 Dropdown','只有兩層、而且使用者習慣分開選（先選縣市再選區）。'],['改用 Tree Select','層數不固定、或要能選中間層（整個部門）。']]);
    const sl=section(body,'互動預覽與程式碼','點欄位選地區。');LIVE.cascader(sl);
  }

  /* ---------- TREE SELECT 樹狀選擇（TSL:v1）：欄位取用 Dropdown 的 .field.dd；面板直接取用 Tree View（trvTree），多選＝Tree View 的 checkbox variant ---------- */
  function tslData(){return [
    {name:'產品部',ic:'folder',open:true,children:[{name:'設計組',ic:'file'},{name:'前端組',ic:'file'},{name:'後端組',ic:'file'}]},
    {name:'營運部',ic:'folder',open:true,children:[{name:'客服組',ic:'file'},{name:'行銷組',ic:'file'}]},
    {name:'管理部',ic:'folder',open:false,children:[{name:'人資組',ic:'file'},{name:'財務組',ic:'file'}]}];}
  /* tslPanel(o)：o.multi；o.val 單選＝名稱、多選＝名稱陣列（只算最底層）；o.live；o.onPick(值) */
  function tslPanel(o){const box=ce('div','tsl-panel');const multi=!!o.multi;const pre=new Set(multi?(o.val||[]):[]);
    const mark=d=>{if(d.children){d.children.forEach(mark);d.checked=d.children.every(c=>c.checked);}else d.checked=pre.has(d.name);if(!multi&&d.name===o.val)d.sel=true;};
    const data=tslData();data.forEach(mark);
    const tree=trvTree(data,{variant:multi?'checkbox':'plain',live:!!o.live,showIcon:false,showCount:false,
      onPick:(row,d)=>{if(multi){const cb=row.querySelector('.cbx');if(cb)cb.click();return;}
        tree.querySelectorAll('.trv-row.is-selected').forEach(r=>r.classList.remove('is-selected'));row.classList.add('is-selected');if(o.onPick)o.onPick(d.name);}});
    box.appendChild(tree);
    const setCb=(cb,on)=>{cb.classList.toggle('st-checked',on);cb.classList.toggle('st-default',!on);cb.innerHTML=on?ICON_CHECK:'';cb.setAttribute('aria-checked',String(on));};
    if(multi&&o.live){
      /* Tree View 的勾選框只切換自己：這裡補上「勾上層＝整組、下層全勾＝上層自動勾」 */
      tree.addEventListener('click',e=>{const cb=e.target.closest&&e.target.closest('.cbx');if(!cb)return;setTimeout(()=>{   /* 等 Tree View 自己的切換跑完再讀（capture 階段先到） */
        const li=cb.closest('.trv-item'),on=cb.classList.contains('st-checked');
        li.querySelectorAll('.trv-children .cbx').forEach(c=>setCb(c,on));
        tree.querySelectorAll(':scope > .trv-item').forEach(top=>{const kids=[...top.querySelectorAll('.trv-children .cbx')];if(kids.length)setCb(top.querySelector('.trv-row .cbx'),kids.every(c=>c.classList.contains('st-checked')));});
        if(o.onPick)o.onPick([...tree.querySelectorAll('.trv-children .cbx.st-checked')].map(c=>c.closest('.trv-row').querySelector('.trv-name').textContent));},0);},true);}
    tree.querySelectorAll('.trv-row').forEach((r,i)=>{if(o.live){r.tabIndex=i?-1:0;}});
    if(o.live)tree.addEventListener('keydown',e=>{const rows=[...tree.querySelectorAll('.trv-row')].filter(r=>r.offsetParent!==null),i=rows.indexOf(e.target);if(i<0)return;
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=rows[Math.min(rows.length-1,Math.max(0,i+(e.key==='ArrowDown'?1:-1)))];n.tabIndex=0;n.focus({preventScroll:true});}
      else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const li=e.target.closest('.trv-item');const want=e.key==='ArrowRight';if(li.querySelector(':scope > .trv-children')&&li.classList.contains('is-open')!==want){e.preventDefault();li.querySelector('.trv-caret').click();}}
      else if(e.key==='Enter'||e.key===' '){e.preventDefault();e.target.click();}});
    const first=tree.querySelector('.trv-row');if(first)first.dataset.pkrFocus='1';
    return box;}
  function tslEl(variant,state,o){o=o||{};const multi=variant==='multi',filled=['filled','error'].includes(state);
    let val='';if(filled)val=multi?pkrChips(['設計組','前端組','後端組','客服組']):(state==='error'?'管理部':'設計組');
    const w=pkrField({cls:'tsl tsl-'+variant,state,ph:'選擇部門',val,label:'選擇部門',caret:true,popup:'tree',err:multi?'至少選一個組':'請選到組別，不能只選部門'});
    if(multi&&filled)w.__f.classList.add('multi');
    if(o.panel)pkrStatic(w,tslPanel(multi?{multi,val:['設計組','前端組','後端組','客服組']}:{val:'設計組'}));
    return w;}
  function tslLive(variant){const multi=variant==='multi';const stage=ce('div','pop-live-stage pkr-live-stage');const w=tslEl(variant,'default',{});let val=multi?[]:'';
    let ctl=null;
    const show=()=>{if(multi){w.__f.classList.toggle('multi',!!val.length);pkrSet(w,val.length?pkrChips(val,{onRemove:n=>{val=val.filter(x=>x!==n);show();if(ctl&&ctl.isOpen()){ctl.close(false);ctl.open();}}}):'');}else pkrSet(w,val);};
    ctl=pkrPop(stage,w,close=>tslPanel({multi,val,live:true,onPick:v=>{val=v;show();if(!multi)close(true);}}),{label:'選擇部門',role:'group'});
    stage.appendChild(w);return stage;}
  LIVE['tree-select']=(host)=>mountLive(host,{gate:'tree-select',initial:{variant:'single'},
    segs:[{key:'variant',label:'Variant',options:['single','multi'],labels:['單選','多選']}],
    render:st=>tslLive(st.variant),
    note:'面板就是 Tree View：點箭頭展開收合、點列選取。多選勾上層＝整組一起勾，下層全勾時上層自動勾上；欄位 chip 的 × 可以直接移除。↑↓ 移動、→ 展開、← 收合、Enter 選取、Esc 關閉。'});
  function buildTreeSelect(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Tree Select',title:'Tree Select 樹狀選擇',
      lede:'從階層資料裡選一個或多個項目（部門、資料夾、分類）。<b>就是 <a href="#dropdown">dropdown</a> 的欄位＋浮層裡放 <a href="#tree-view">tree view</a></b>：單選用 tree view 的 plain、多選用它的 checkbox variant，已選項取用 dropdown 的 chip。兩種 variant × 五種狀態（<b>2 × 5 = 10</b>）。',
      specRows:[['axes','<code>variant × state</code>'],['formula','<code>2 × 5 = 10</code>'],['token-policy','<code>semantic.*.input.* · semantic.*.tree.*</code>'],['reuse','tree-view / dropdown field / ddchip / .cbx']]});
    const VN={single:['單選','single'],multi:['多選','multi']};
    const axes=DIAL_SPECS['tree-select'].axes,zh=DIAL_SPECS['tree-select'].zh,active=CHOICE['tree-select'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'field · 收合',name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(PKR_STN[s][0],PKR_STN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),cell:(s,v)=>tslEl(v,s,{}),mincol:300}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','單選顯示選中項名稱；多選顯示最底層的已選項，超過 3 個收成 +N。');p=panelsIn(sec);renderM();
    const os=section(body,'展開的樣子','浮層裡就是 tree view 元件本身，不另外畫一套樹。');capRow(os,[['單選',tslEl('single','filled',{panel:true})],['多選',tslEl('multi','filled',{panel:true})]]);os.querySelector('.row-demo').classList.add('pkr-demo-row');
    usageSection(body,[['用 Tree Select','階層深淺不一、或要能選到中間層的資料。'],['改用 Cascader','固定 2～3 層、每層一定要選到底（地址）。'],['改用 Tree View','樹本身就是畫面主體（檔案總管、側欄），不需要收進欄位。']]);
    const sl=section(body,'互動預覽與程式碼','點欄位選部門。');LIVE['tree-select'](sl);
  }

  /* ---------- TOUR 新手導覽（TUR:v1）：卡片沿用 Popover（.pop＋箭頭＋標題列＋動作列），按鈕取用 Button；導覽時用遮罩把目標以外的區域壓暗 ---------- */
  const TUR_STEPS=[{t:'search',title:'搜尋訂單',body:'輸入訂單編號或顧客名稱，結果會即時篩選。',pl:'bottom'},
    {t:'filter',title:'篩選條件',body:'依狀態、日期篩選，條件會保留到下次打開。',pl:'bottom'},
    {t:'add',title:'新增訂單',body:'電話或現場下單時，從這裡手動建立一筆訂單。',pl:'left'}];
  /* turCard(placement,step,o)：step first｜middle｜last；o.progress 進度、o.close ×、o.idx／o.total、o.title／o.body、o.live、o.onPrev／onNext／onClose */
  function turCard(placement,step,o){o=o||{};const pp=ce('div','pop tur-card pop-p-'+placement+' sz-m');pp.setAttribute('role','dialog');pp.setAttribute('aria-label',o.title||'新手導覽');
    pp.appendChild(ce('span','pop-arrow'));
    const hd=ce('div','pop-head');const t=ce('div','pop-title');t.textContent=o.title||'篩選條件';hd.appendChild(t);
    if(o.close!==false){const x=ce('button','pop-x');x.type='button';x.setAttribute('aria-label','結束導覽');x.innerHTML=ICON_CLOSE;if(o.live)x.onclick=()=>o.onClose&&o.onClose();else x.tabIndex=-1;hd.appendChild(x);}
    pp.appendChild(hd);
    const bd=ce('div','pop-body');const tx=ce('p','tur-text');tx.textContent=o.body||'依狀態、日期篩選，條件會保留到下次打開。';bd.appendChild(tx);pp.appendChild(bd);
    const ft=ce('div','pop-foot tur-foot');
    const total=o.total||3,idx=o.idx!=null?o.idx:{first:0,middle:1,last:total-1}[step];
    if(o.progress!==false){const pg=ce('span','tur-prog');pg.textContent=(idx+1)+' / '+total;pg.setAttribute('aria-label','第 '+(idx+1)+' 步，共 '+total+' 步');ft.appendChild(pg);}
    const acts=ce('div','tur-acts');
    const back=step==='first'?pkrBtn('略過','text','secondary'):pkrBtn('上一步','outline','secondary');
    const next=pkrBtn(step==='last'?'完成':'下一步','solid','primary');next.dataset.pkrFocus='1';
    if(o.live){back.onclick=()=>step==='first'?(o.onClose&&o.onClose()):(o.onPrev&&o.onPrev());next.onclick=()=>step==='last'?(o.onClose&&o.onClose()):(o.onNext&&o.onNext());}
    else{back.tabIndex=-1;next.tabIndex=-1;}
    acts.append(back,next);ft.appendChild(acts);pp.appendChild(ft);return pp;}
  /* 矩陣格：目標（取用 Button＋聚光框）＋導覽卡，依 placement 排在目標的上下左右 */
  const TUR_DEMO={title:'新增訂單',body:'電話或現場下單時，從這裡手動建立一筆訂單。'};
  function turCell(placement,step,o){const c=ce('div','tur-cell pl-'+placement);const tg=pkrBtn('新增訂單','solid','primary');tg.tabIndex=-1;tg.classList.add('tur-ring');
    c.append(tg,turCard(placement,step,Object.assign({},TUR_DEMO,o||{})));return c;}
  function turLive(o){const stage=ce('div','tur-stage');const app=ce('div','tur-app');
    /* 示範畫面：搜尋欄取用 Input、按鈕取用 Button、列表取用 List Item 的文字層級 */
    const bar=ce('div','tur-bar');
    const sf=ce('div','field v-outline fsz-s live-field');sf.innerHTML=PI('search');const si=document.createElement('input');si.className='bare';si.placeholder='搜尋訂單編號、顧客';sf.appendChild(si);sf.dataset.tur='search';
    const fb=pkrBtn('篩選','outline','secondary');fb.dataset.tur='filter';const ab=pkrBtn('新增訂單','solid','primary');ab.dataset.tur='add';
    bar.append(sf,fb,ab);app.appendChild(bar);
    const rows=ce('div','tur-rows');[['ORD-1043','林志豪','NT$ 1,280'],['ORD-1046','吳佩珊','NT$ 3,560'],['ORD-1042','王小明','NT$ 860'],['ORD-1047','周子淇','NT$ 2,140']].forEach(r=>{const d=ce('div','tur-row');r.forEach(x=>{const s=ce('span');s.textContent=x;d.appendChild(s);});rows.appendChild(d);});
    app.appendChild(rows);
    const spot=ce('div','tur-spot');app.appendChild(spot);
    const start=pkrBtn('開始導覽','solid','primary');start.classList.add('tur-start');
    stage.append(app,start);
    let i=-1,card=null,returnTo=null;
    const end=()=>{if(card){card.remove();card=null;}spot.classList.remove('is-on');app.classList.remove('is-touring');i=-1;(returnTo||start).focus({preventScroll:true});};
    const go=n=>{i=n;const s=TUR_STEPS[i];const tg=app.querySelector('[data-tur="'+s.t+'"]');const step=i===0?'first':i===TUR_STEPS.length-1?'last':'middle';
      if(card)card.remove();
      card=turCard(s.pl,step,{live:true,title:s.title,body:s.body,idx:i,total:TUR_STEPS.length,progress:o.progress,close:o.close,onPrev:()=>go(i-1),onNext:()=>go(i+1),onClose:end});
      card.classList.add('tur-float');app.appendChild(card);app.classList.add('is-touring');
      /* 用元件座標定位（外層被縮放時換算） */
      const ar=app.getBoundingClientRect(),k=ar.width?app.offsetWidth/ar.width:1,r=tg.getBoundingClientRect();
      const x=(r.left-ar.left)*k,y=(r.top-ar.top)*k,w=r.width*k,h=r.height*k,pad=4,gap=12;
      spot.style.transform=`translate(${x-pad}px,${y-pad}px)`;spot.style.width=(w+pad*2)+'px';spot.style.height=(h+pad*2)+'px';spot.classList.add('is-on');
      const cw=card.offsetWidth,ch=card.offsetHeight,W=app.clientWidth;let cx,cy;
      if(s.pl==='bottom'){cx=Math.min(W-cw-8,Math.max(8,x+w/2-cw/2));cy=y+h+pad+gap;}
      else if(s.pl==='top'){cx=Math.min(W-cw-8,Math.max(8,x+w/2-cw/2));cy=y-pad-gap-ch;}
      else if(s.pl==='left'){cx=x-pad-gap-cw;cy=y+h/2-ch/2;}else{cx=x+w+pad+gap;cy=y+h/2-ch/2;}
      if(s.pl==='left'&&cx<8){/* 左邊放不下就改放下方 */card.classList.replace('pop-p-left','pop-p-bottom');cx=Math.min(W-cw-8,Math.max(8,x+w/2-cw/2));cy=y+h+pad+gap;}
      cy=Math.max(8,cy);card.style.left=cx+'px';card.style.top=cy+'px';
      /* 卡片被推離置中位置時，箭頭仍對準目標中心 */
      const arw=card.querySelector('.pop-arrow');if(card.classList.contains('pop-p-bottom')||card.classList.contains('pop-p-top'))arw.style.left=(x+w/2-cx-5)+'px';
      else arw.style.top=Math.min(ch-18,Math.max(8,y+h/2-cy-5))+'px';
      setTimeout(()=>{const f=card&&card.querySelector('[data-pkr-focus]');if(f)f.focus({preventScroll:true});},30);};
    start.onclick=()=>{returnTo=start;go(0);};
    app.addEventListener('keydown',e=>{if(i<0)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();end();}
      else if(e.key==='ArrowRight'&&i<TUR_STEPS.length-1){e.preventDefault();go(i+1);}else if(e.key==='ArrowLeft'&&i>0){e.preventDefault();go(i-1);}});
    if(window.ResizeObserver)new ResizeObserver(()=>{if(i>=0&&card)go(i);}).observe(app);
    return stage;}
  LIVE.tour=(host)=>mountLive(host,{gate:'tour',initial:{progress:true,close:true},
    bools:[{key:'progress',label:'progress 進度'},{key:'close',label:'close ×'}],boolLabel:'Content',
    render:st=>turLive(st),
    note:'按「開始導覽」，遮罩把目標以外壓暗、導覽卡指向目標；右邊放不下時自動改放下方。→／← 換步、Esc 或 × 結束，結束後焦點回到「開始導覽」。'});
  function buildTour(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Tour',title:'Tour 新手導覽',
      lede:'第一次使用時，一步步指出畫面上的重點。導覽卡沿用 <a href="#popover">popover</a>（箭頭、標題列、動作列）、按鈕取用 <a href="#button">button</a>；導覽時用和 <a href="#modal">modal</a> 相同的遮罩色把目標以外壓暗。<b>placement × step（4 × 3 = 12）</b>，進度與關閉鈕是 boolean。',
      specRows:[['axes','<code>placement × step</code>'],['formula','<code>4 × 3 = 12</code>'],['boolean','<code>progress · close</code>'],['token-policy','<code>semantic.*.popover.* · --s-scrim</code>']]});
    const PN={bottom:['下方','bottom'],top:['上方','top'],left:['左側','left'],right:['右側','right']},SN={first:['第一步','first'],middle:['中間步','middle'],last:['最後一步','last']};
    const axes=DIAL_SPECS.tour.axes,zh=DIAL_SPECS.tour.zh,active=CHOICE.tour.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ps=axes.placement.filter(v=>active.placement.has(v)),ss=axes.step.filter(v=>active.step.has(v));
      ps.forEach(pl=>p.appendChild(matrixPanel({badge:'placement · '+pl,name:PN[pl][0]+' '+PN[pl][1],rows:['card'],cols:ss,rowLab:()=>labHTML('導覽卡','card'),colLab:s=>labHTML(SN[s][0],SN[s][1]),cell:(r,s)=>turCell(pl,s,{}),mincol:pl==='left'||pl==='right'?440:300})));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Placement × Step 矩陣','每個方向一塊；欄＝步驟。第一步左鈕是「略過」、中間步是「上一步」、最後一步主鈕變「完成」。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容','boolean：progress 進度（1 / 3）、close 右上角 ×。');
    capRow(cs,[['完整',turCard('bottom','middle',TUR_DEMO)],['無進度',turCard('bottom','middle',Object.assign({progress:false},TUR_DEMO))],['無 ×',turCard('bottom','middle',Object.assign({close:false},TUR_DEMO))]]);
    usageSection(body,[['用 Tour','新功能上線、或第一次進到複雜頁面時，3～5 步帶過重點。'],['不要用來教基本操作','需要導覽才會用的介面，先改介面本身。'],['改用 Tooltip','只想補充一個按鈕的說明，不需要步驟。'],['改用 Empty','頁面還沒有資料時，用空狀態說明下一步就好。']]);
    const sl=section(body,'互動預覽與程式碼','按「開始導覽」試一次。');LIVE.tour(sl);
  }

  /* ---------- MENUBAR 選單列（MBR:v1）：上層取用 Menu item（mnItem），下拉面板取用 Action Menu（.am-panel／.am-item），快捷鍵取用 Kbd ---------- */
  const MBR_MENUS=[
    {l:'檔案',items:[{l:'新增檔案',k:['mod','N']},{l:'開啟…',k:['mod','O']},{div:1},{l:'儲存',k:['mod','S']},{l:'另存新檔…',k:['shift','mod','S']}]},
    {l:'編輯',items:[{l:'復原',k:['mod','Z']},{l:'重做',k:['shift','mod','Z']},{div:1},{l:'剪下',k:['mod','X']},{l:'複製',k:['mod','C']},{l:'貼上',k:['mod','V']}]},
    {l:'檢視',items:[{l:'放大',k:['mod','+']},{l:'縮小',k:['mod','-']},{div:1},{l:'顯示側欄',k:['mod','B']},{l:'全螢幕',k:['ctrl','mod','F'],dis:true}]},
    {l:'說明',items:[{l:'快捷鍵一覽',k:['mod','/']},{l:'回報問題'}]}];
  /* 下拉面板：取用 Action Menu 的面板與項目，右側放 Kbd */
  function mbrMenu(menu,o){o=o||{};const p=ce('div','am-panel sz-l mbr-menu');p.setAttribute('role','menu');p.setAttribute('aria-label',menu.l);
    menu.items.forEach((it,i)=>{if(it.div){const d=ce('div','am-divider');d.setAttribute('role','separator');p.appendChild(d);return;}
      const a=amItem(it.l,{state:it.dis?'disabled':(o.hover===i?'hover':null)});a.setAttribute('role','menuitem');a.tabIndex=-1;if(it.dis)a.setAttribute('aria-disabled','true');
      if(it.k)a.appendChild(kbdEl(it.k,'s','ghost',{platform:'mac'}));p.appendChild(a);});
    return p;}
  /* mbrEl(variant,state,size,o)：state 套在第二個選單（編輯）上；open＝展開它的面板 */
  function mbrEl(variant,state,size,o){o=o||{};const bar=ce('div','mbr mbr-v-'+variant+' mbr-sz-'+size);bar.setAttribute('role','menubar');bar.setAttribute('aria-label','應用程式選單');
    MBR_MENUS.forEach((m,i)=>{const wrap=ce('div','mbr-it');const st=i===1?state:'default';
      const t=mnItem(st==='open'?'hover':st==='disabled'?'disabled':st==='hover'?'hover':'default',size,{label:m.l});t.setAttribute('role','menuitem');t.setAttribute('aria-haspopup','menu');t.setAttribute('aria-expanded',String(st==='open'));
      if(st==='open')t.classList.add('is-open');if(!o.live)t.tabIndex=-1;
      wrap.appendChild(t);if(st==='open')wrap.appendChild(mbrMenu(m,{hover:0}));bar.appendChild(wrap);});
    return bar;}
  function mbrLive(variant,size,syncCode){const stage=ce('div','mbr-stage');const bar=mbrEl(variant,'default',size,{live:true});const status=ce('p','mbr-status');status.setAttribute('aria-live','polite');status.textContent='還沒執行任何指令';
    stage.append(bar,status);
    const tops=[...bar.querySelectorAll(':scope > .mbr-it > .mn-item')];let cur=-1,menu=null;
    tops.forEach((t,i)=>{t.tabIndex=i?-1:0;});
    const items=()=>menu?[...menu.querySelectorAll('.am-item:not(.st-disabled)')]:[];
    const close=back=>{if(menu){const m=menu;m.classList.remove('is-open');afterTransition(m,()=>m.remove());menu=null;}
      if(cur>=0){tops[cur].classList.remove('is-open');tops[cur].setAttribute('aria-expanded','false');if(back)tops[cur].focus({preventScroll:true});}cur=-1;};
    const open=(i,focusFirst)=>{if(cur===i&&menu)return;const was=cur>=0;close(false);cur=i;const t=tops[i];tops.forEach((x,j)=>x.tabIndex=j===i?0:-1);
      t.classList.add('is-open');t.setAttribute('aria-expanded','true');menu=mbrMenu(MBR_MENUS[i]);menu.classList.add('mbr-float');if(was)menu.classList.add('no-anim');
      t.parentNode.appendChild(menu);
      /* 右邊放不下就改成靠右對齊（預覽欄較窄時，快捷鍵不會被切掉） */
      const sr=stage.getBoundingClientRect(),mr=menu.getBoundingClientRect();if(mr.right>sr.right-4)menu.classList.add('is-end');
      void menu.offsetWidth;menu.classList.add('is-open');
      items().forEach((a,j)=>{a.onclick=()=>{status.textContent='已執行：'+MBR_MENUS[i].l+' › '+a.querySelector('.am-lb').textContent;close(true);};});
      if(focusFirst){const f=items()[0];if(f)f.focus({preventScroll:true});}
      if(syncCode)syncCode();};
    tops.forEach((t,i)=>{t.addEventListener('click',()=>{cur===i?close(false):open(i,false);});
      t.addEventListener('mouseenter',()=>{if(cur>=0&&cur!==i){const kb=bar.contains(document.activeElement);open(i,false);if(kb)t.focus({preventScroll:true});}});});   /* 焦點跟著滑鼠換到的選單，鍵盤接著操作才不會錯位 */
    bar.addEventListener('keydown',e=>{const ti=tops.indexOf(e.target),its=items(),ii=its.indexOf(e.target);
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const base=ti>=0?ti:cur;const n=(base+(e.key==='ArrowRight'?1:-1)+tops.length)%tops.length;
        if(menu)open(n,ii>=0);else{tops.forEach((x,j)=>x.tabIndex=j===n?0:-1);tops[n].focus({preventScroll:true});}}
      else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(ti>=0){open(ti,false);const l=items();const f=e.key==='ArrowDown'?l[0]:l[l.length-1];if(f)f.focus({preventScroll:true});}
        else if(ii>=0){const n=its[(ii+(e.key==='ArrowDown'?1:-1)+its.length)%its.length];n.focus({preventScroll:true});}}
      else if(e.key==='Enter'||e.key===' '){if(ti>=0){e.preventDefault();open(ti,true);}else if(ii>=0){e.preventDefault();e.target.click();}}
      else if(e.key==='Escape'&&menu){e.preventDefault();e.stopPropagation();close(true);}
      else if(e.key==='Tab'&&menu)close(false);});
    const outside=e=>{if(!stage.isConnected){document.removeEventListener('pointerdown',outside);return;}if(menu&&!bar.contains(e.target))close(false);};
    document.addEventListener('pointerdown',outside);
    return stage;}
  LIVE.menubar=(host)=>mountLive(host,{gate:'menubar',initial:{variant:'bar',size:'m'},
    segs:[{key:'variant',label:'Variant',options:['bar','plain'],labels:['外框','無框']},{key:'size',label:'Size',options:['s','m']}],
    render:(st,sync)=>mbrLive(st.variant,st.size,sync),
    note:'點「檔案」打開後，滑鼠滑到其他選單會直接切換（不用再點）。←→ 換選單、↓ 進入項目、↑↓ 移動、Enter 執行、Esc 關閉並回到上層；停用項目會被跳過。'});
  function buildMenubar(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Menubar',title:'Menubar 選單列',
      lede:'桌面 App 式的「檔案／編輯／檢視」選單列，給編輯器、後台這類工具型產品。上層取用 <a href="#menu">menu</a> 的項目、下拉面板取用 <a href="#action-menu">action menu</a>、快捷鍵取用 <a href="#kbd">kbd</a>。<b>variant × state × size（2 × 4 × 2 = 16）</b>。',
      specRows:[['axes','<code>variant × state × size</code>'],['formula','<code>2 × 4 × 2 = 16</code>'],['token-policy','<code>semantic.*.menu.* · semantic.*.popover.*</code>'],['reuse','menu item / action menu / kbd']]});
    const VN={bar:['外框','bar'],plain:['無框','plain']},SN={default:['預設','default'],hover:['滑過','hover'],open:['展開','open'],disabled:['停用','disabled']};
    const axes=DIAL_SPECS.menubar.axes,zh=DIAL_SPECS.menubar.zh,active=CHOICE.menubar.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.state.filter(v=>active.state.has(v)),zs=axes.size.filter(v=>active.size.has(v));
      zs.forEach(z=>p.appendChild(matrixPanel({badge:'size · '+z,name:'State × Variant',rows:ss,cols:vs,rowLab:s=>labHTML(SN[s][0],SN[s][1]),colLab:v=>labHTML(VN[v][0],VN[v][1]),
        cell:(s,v)=>{const c=ce('div','mbr-cell'+(s==='open'?' is-open':''));c.appendChild(mbrEl(v,s,z,{}));return c;},mincol:340})));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Variant 矩陣','狀態示範在「編輯」上；展開時面板接在選單下方，項目右側對齊快捷鍵。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Menubar','桌面型的工具產品，指令多、使用者會記快捷鍵（編輯器、設計工具）。'],['改用 Header＋Action Menu','一般網站或後台：主要導覽放 header，少數動作收進「更多」。'],['改用 Command','指令很多但不想佔畫面空間，讓熟手用 ⌘K 叫出來。']]);
    const sl=section(body,'互動預覽與程式碼','點「檔案」打開，再滑到其他選單。');LIVE.menubar(sl);
  }

  /* ---------- DROPZONE 檔案上傳 ---------- */
  const DRZ_MAX=10*1024*1024;
  function drzSize(b){return b>=1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';}
  function drzFile(name,bytes,status,pct,o){o=o||{};const li=ce('li','drz-file'+(status==='done'?' is-done':status==='error'?' is-error':''));li.innerHTML=IC_FILE;
    const n=ce('span','drz-fn');n.textContent=name;const m=ce('span','drz-fm');
    m.textContent=status==='error'?'超過 10 MB，無法上傳':status==='done'?drzSize(bytes)+' · 上傳完成':drzSize(bytes)+' · 上傳中 '+pct+'%';
    const x=mkBtn({variant:'text',intent:'secondary',size:'s',iconOnly:true,isLive:!!o.live});x.innerHTML=ICON_CLOSE;x.setAttribute('aria-label',(status==='uploading'?'取消上傳 ':'移除 ')+name);
    li.append(n,x,m);if(status==='uploading')li.insertBefore(prgEl('bar','s',{value:pct}),m.nextSibling);
    return li;}
  function drzEl(state,size,o){o=o||{};const w=ce('div',`drz drz-sz-${size} drz-st-${state}`);
    const a=ce('div','drz-area');a.setAttribute('role','button');a.setAttribute('aria-label','上傳檔案：拖曳到這裡或按 Enter 選擇');if(state==='disabled')a.setAttribute('aria-disabled','true');else a.tabIndex=0;
    const ic=ce('span','drz-ic');ic.innerHTML=IC_UPLOAD;ic.setAttribute('aria-hidden','true');const tx=ce('div');
    const t=ce('div','drz-t');t.innerHTML=state==='dragover'?'放開以上傳':'拖曳檔案到這裡，或 <b>選擇檔案</b>';const h=ce('div','drz-hint');h.textContent='PNG、JPG、PDF，單檔 10 MB 以內';tx.append(t,h);a.append(ic,tx);w.appendChild(a);
    const ul=ce('ul','drz-files');ul.setAttribute('aria-live','polite');w.appendChild(ul);
    if(state==='uploading')ul.appendChild(drzFile('商品主圖.jpg',2516582,'uploading',45));
    if(state==='done')ul.appendChild(drzFile('商品主圖.jpg',2516582,'done'));
    if(state==='error')ul.appendChild(drzFile('開箱影片.mov',48234496,'error'));
    return w;}
  function drzLive(size){const w=drzEl('default',size,{});const a=w.querySelector('.drz-area'),ul=w.querySelector('.drz-files');
    const inp=document.createElement('input');inp.type='file';inp.multiple=true;inp.hidden=true;w.appendChild(inp);
    const add=(name,bytes)=>{const bad=bytes>DRZ_MAX;let pct=0;let li=drzFile(name,bytes,bad?'error':'uploading',0,{live:true});li.classList.add('is-in');ul.appendChild(li);
      const wire=el=>{el.querySelector('.btn').onclick=()=>{clearInterval(tm);el.classList.add('is-out');afterAnim(el,()=>el.remove());};};wire(li);
      const tm=bad?null:setInterval(()=>{if(!li.isConnected){clearInterval(tm);return;}pct=Math.min(100,pct+8+Math.round(Math.random()*14));
        if(pct>=100){clearInterval(tm);const nl=drzFile(name,bytes,'done',100,{live:true});li.replaceWith(nl);li=nl;wire(nl);return;}
        const f=li.querySelector('.prg-fill');f.style.width=pct+'%';li.querySelector('.prg').setAttribute('aria-valuenow',pct);li.querySelector('.drz-fm').textContent=drzSize(bytes)+' · 上傳中 '+pct+'%';},180);};
    a.addEventListener('click',()=>inp.click());a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click();}});
    inp.addEventListener('change',()=>{[...inp.files].forEach(f=>add(f.name,f.size));inp.value='';});
    let depth=0;const setOver=v=>{w.classList.toggle('drz-st-dragover',v);w.classList.toggle('drz-st-default',!v);a.querySelector('.drz-t').innerHTML=v?'放開以上傳':'拖曳檔案到這裡，或 <b>選擇檔案</b>';};
    a.addEventListener('dragenter',e=>{e.preventDefault();depth++;setOver(true);});a.addEventListener('dragover',e=>e.preventDefault());
    a.addEventListener('dragleave',()=>{if(--depth<=0){depth=0;setOver(false);}});
    a.addEventListener('drop',e=>{e.preventDefault();depth=0;setOver(false);[...(e.dataTransfer?e.dataTransfer.files:[])].forEach(f=>add(f.name,f.size));});
    const demo=mkBtn({variant:'text',intent:'primary',size:'s',isLive:true});demo.querySelector('span').textContent='加入範例檔（模擬）';demo.style.alignSelf='flex-start';
    let k=0;demo.onclick=()=>{const S=[['商品主圖.jpg',2516582],['規格書.pdf',860160],['開箱影片.mov',48234496]];const [n,b]=S[k++%3];add(n,b);};
    w.insertBefore(demo,ul);return w;}
  LIVE.dropzone=(host)=>mountLive(host,{gate:'dropzone',initial:{size:'m'},
    segs:[{key:'size',label:'Size',options:['s','m']}],
    render:st=>drzLive(st.size),
    note:'把檔案拖進框內，邊框轉實線、圖示往上浮，提示放開；點框或 Enter 開檔案選擇。上傳中的檔案可取消，超過 10 MB 直接標錯不送出。沒有檔案可拖時，按「加入範例檔」模擬。'});
  function buildDropzone(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Dropzone',title:'Dropzone 檔案上傳',
      lede:'可拖曳的上傳區＋檔案列表。<a href="#input">input · file</a> 只有單一欄位；需要多檔、看進度時用 Dropzone。進度取用 <a href="#progress">progress</a>、移除鈕取用 <a href="#button">button</a>。五種狀態 × 兩級 size（<b>5 × 2 = 10</b>）。',
      specRows:[['axes','<code>state × size</code>'],['formula','<code>5 × 2 = 10</code>'],['token-policy','<code>semantic.border.* · semantic.action.primary · semantic.feedback.*</code>'],['features','multiple / max-size / cancel']]});
    const STN={default:['預設','default'],dragover:['拖曳中','dragover'],uploading:['上傳中','uploading'],done:['完成','done'],error:['錯誤','error']},SZN={s:['精簡','s'],m:['標準','m']};
    const axes=DIAL_SPECS.dropzone.axes,zh=DIAL_SPECS.dropzone.zh,active=CHOICE.dropzone.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ss=axes.state.filter(v=>active.state.has(v)),zs=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'accept · png jpg pdf',name:'State × Size',rows:ss,cols:zs,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:z=>labHTML(SZN[z][0],SZN[z][1]),cell:(s,z)=>drzEl(s,z,{}),mincol:400}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','精簡版是一行高，放在表單裡；標準版給上傳是主要任務的頁面。錯誤寫出「為什麼」，不只寫「上傳失敗」。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Dropzone','一次上傳多個檔案，或檔案大、需要看進度。'],['改用 Input · file','表單裡只附一個小檔案。'],['限制先說','格式與大小限制寫在框裡，不要等上傳失敗才告訴使用者。']]);
    const sl=section(body,'互動預覽與程式碼','拖曳檔案進框，或按「加入範例檔」。');LIVE.dropzone(sl);
  }

  /* ---------- TABLE TOOLBAR 表格工具列（2026-11-04 改版：已存檢視型主體＋浮動批次列 bulk 模式）----------
     軸：filter none｜applied（chip 列＋篩選鈕計數＋另存為檢視）× bulk hidden｜page｜all（浮動批次列）× density comfortable｜compact（表格列高）
     boolean：views（已存檢視分頁）、densityToggle（列高切換）。表格直接取用 tblTable（plain＋checkbox＋自訂欄位 cols）。 */
  const TTB_IC_USER_PLUS=PI('user-plus'); // PulsoIcon user-plus
  const TTB_ME='陳美華',TTB_OWNERS=['陳美華','李承翰','黃冠宇'],TTB_STS=['doing','late','done'];
  const TTB_COLS=[{key:'id',lab:'編號',sortable:false,cls:'tbl-mut ttb-id'},{key:'name',lab:'客戶',sortable:false,cls:'tbl-name'},{key:'status',lab:'狀態',sortable:false,cls:''},
    {key:'assignee',lab:'負責人',sortable:false,cls:''},{key:'amount',lab:'金額',sortable:false,cls:'tbl-num'},{key:'date',lab:'到期日',sortable:false,cls:'tbl-mut'}];
  const TTB_VIEWS=[{name:'全部',f:{}},{name:'我的',f:{assignee:[TTB_ME]}},{name:'逾期',f:{status:['late']}}];
  const TTB_FKEYS=[['status','狀態',TTB_STS,v=>TBL_STATUS[v][0]],['assignee','負責人',TTB_OWNERS,v=>v]];
  /* 示意資料：128 筆訂單（伺服器分頁，畫面只顯示第 1 頁）；前 6 筆固定，其餘依規則產生，數字可重現 */
  const TTB_DATA=(()=>{const head=[['王小明','doing','陳美華',12800,'11/08'],['林志豪','late','李承翰',23150,'10/30'],['張雅婷','done','陳美華',8990,'11/02'],
      ['李承翰','doing','黃冠宇',1500,'11/12'],['吳佩珊','late','陳美華',6420,'11/01'],['周子淇','doing','黃冠宇',4600,'11/10']];
    const NM=['蔡依林','郭俊宏','許雅雯','鄭家豪','謝佳穎','洪志明','楊淑芬','劉冠廷','黃詩涵','陳柏翰','曾郁婷','高子軒'];
    const out=head.map(([name,status,assignee,amount,date],i)=>({id:'ORD-'+(1042+i),name,status,assignee,amount,date}));
    for(let i=out.length;i<128;i++){const s=(i*7)%10;
      out.push({id:'ORD-'+(1042+i),name:NM[i%NM.length],status:s<5?'doing':s<8?'done':'late',assignee:TTB_OWNERS[(i*5)%3],amount:Math.round((1200+(i*3779)%24000)/10)*10,date:'11/'+String(1+(i*11)%28).padStart(2,'0')});}
    return out;})();
  const ttbPass=(r,f)=>Object.keys(f).every(k=>!f[k]||!f[k].length||f[k].includes(r[k]));
  function ttbChip(label,o){const t=tagEl('soft','neutral','default');t.querySelector('span').textContent=label;const x=ce('span','x');x.innerHTML=ICON_CLOSE;x.setAttribute('role','button');x.tabIndex=o&&o.onRemove?0:-1;x.setAttribute('aria-label','移除條件 '+label);t.appendChild(x);
    if(o&&o.onRemove){const rm=e=>{e.stopPropagation();e.preventDefault();t.classList.add('tg-out');afterAnim(t,()=>o.onRemove());};x.onclick=rm;x.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')rm(e);};}
    return t;}
  function ttbBarBtn(icon,label,o){o=o||{};const b=mkBtn({variant:'text',intent:o.danger?'danger':'secondary',size:'s',iconOnly:!!o.iconOnly,isLive:!!o.live});
    b.type='button';b.innerHTML=icon+(o.iconOnly?'':`<span>${label}</span>`);b.setAttribute('aria-label',o.aria||label);if(!o.live)b.tabIndex=-1;return b;}

  /* 主要工廠：ttbEl(filter,bulk,density,o) → .ttb-card（分頁＋工具列＋chip 列＋表格＋浮動批次列）
     o.views（boolean，預設開）／o.densityToggle（boolean，2026-11-10 改預設關）、o.pageN 每頁筆數、o.live 真的可操作（o.msg＝aria-live 訊息節點）、o.table=false 不放表格（只看工具列） */
  function ttbEl(filter,bulk,density,o){o=o||{};const live=!!o.live,showViews=o.views!==false,showDn=o.densityToggle===true,withTable=o.table!==false;
    const S={data:TTB_DATA.map(d=>Object.assign({},d)),views:TTB_VIEWS.map(v=>({name:v.name,f:JSON.parse(JSON.stringify(v.f))})),v:0,
      extra:filter==='applied'?{status:['doing','late']}:{},q:'',dense:density==='compact',sel:new Set(),all:false,confirm:false,flash:new Set(),saved:0,pageN:o.pageN||(live?6:3)};
    const say=t=>{if(o.msg)o.msg.textContent=t;};
    const base=()=>S.data.filter(r=>ttbPass(r,S.views[S.v].f));
    const rows=()=>base().filter(r=>ttbPass(r,S.extra)&&(!S.q||(r.name+r.id).toLowerCase().includes(S.q.toLowerCase())));
    const page=()=>rows().slice(0,S.pageN);
    const nExtra=()=>Object.keys(S.extra).reduce((a,k)=>a+(S.extra[k]||[]).length,0);
    const nSel=()=>S.all?rows().length:S.sel.size;
    if(bulk==='page'){const pg=page();[0,2].forEach(i=>{if(pg[i])S.sel.add(pg[i].id);});}
    if(bulk==='all'){S.all=true;page().forEach(r=>S.sel.add(r.id));}

    const card=ce('div','ttb-card ttb-dn-'+density);
    /* ── 已存檢視分頁（Tab 原子 v-line；live 時底線滑動） ── */
    let tabs=null,ind=null,saveBtn=null;
    const vw=showViews?ce('div','ttb-views'):null;
    function placeInd(anim){if(!ind)return;const a=tabs.querySelector('.tabi.st-active');if(!a||!a.offsetWidth){ind.style.opacity='0';return;}
      if(!anim)ind.style.transition='none';ind.style.transform='translateX('+a.offsetLeft+'px)';ind.style.width=a.offsetWidth+'px';ind.style.opacity='1';
      if(!anim){void ind.offsetWidth;ind.style.transition='';}}
    function drawViews(){if(!vw)return;vw.innerHTML='';
      tabs=ce('div','tabbar v-line'+(live?' tab-slide':''));tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','已存檢視');
      if(live){ind=ce('span','tab-ind');tabs.appendChild(ind);}
      S.views.forEach((w,i)=>{const t=ce(live?'button':'div','tabi sz-m'+(i===S.v?' st-active':''));if(live){t.type='button';t.tabIndex=i===S.v?0:-1;}
        t.setAttribute('role','tab');t.setAttribute('aria-selected',String(i===S.v));t.dataset.v=i;
        t.innerHTML=`<span>${w.name}</span><span class="tcount">${S.data.filter(r=>ttbPass(r,w.f)).length}</span>`;tabs.appendChild(t);});
      vw.appendChild(tabs);
      saveBtn=null;if(nExtra()){saveBtn=mkBtn({variant:'text',intent:'secondary',size:'s',isLive:live});saveBtn.type='button';saveBtn.classList.add('ttb-save');
        saveBtn.innerHTML=IC_PLUS+'<span>另存為檢視</span>';saveBtn.setAttribute('aria-label','另存為檢視');if(!live)saveBtn.tabIndex=-1;saveBtn.dataset.act='save';vw.appendChild(saveBtn);}
      if(live)requestAnimationFrame(()=>placeInd(false));}
    function syncViews(anim){if(!tabs)return;
      tabs.querySelectorAll('.tabi').forEach((t,i)=>{const on=i===S.v;t.classList.toggle('st-active',on);t.setAttribute('aria-selected',String(on));if(live)t.tabIndex=on?0:-1;
        t.querySelector('.tcount').textContent=S.data.filter(r=>ttbPass(r,S.views[i].f)).length;});
      const want=nExtra()>0;if(want!==!!saveBtn){drawViews();return;}placeInd(anim);}
    /* ── 工具列：搜尋（.field）＋篩選（Button＋Popover）＋筆數＋列高（Segmented） ── */
    const bar=ce('div','ttb');bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','訂單工具列');
    const fld=ce('label','field v-outline st-default');fld.innerHTML=ICON_SEARCH;const inp=document.createElement('input');inp.className='bare';inp.type='search';
    inp.placeholder='搜尋客戶或編號';inp.setAttribute('aria-label','搜尋客戶或編號');if(!live){inp.readOnly=true;inp.tabIndex=-1;}fld.appendChild(inp);
    const fwrap=ce('div','ttb-rel');const fbtn=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:live});fbtn.type='button';
    fbtn.innerHTML=IC_FILTER+'<span>篩選</span>';const badge=ce('span','ttb-badge');fbtn.appendChild(badge);
    fbtn.setAttribute('aria-haspopup','true');fbtn.setAttribute('aria-expanded','false');if(!live)fbtn.tabIndex=-1;
    const fpop=ce('div','pop sz-s pop-float ttb-fpop');fpop.setAttribute('role','menu');fpop.setAttribute('aria-label','篩選條件');
    const fid='ttbf-'+Math.random().toString(36).slice(2,8);fpop.id=fid;fbtn.setAttribute('aria-controls',fid);fwrap.append(fbtn,fpop);
    const cnt=ce('span','ttb-count');cnt.setAttribute('aria-live','polite');
    bar.append(fld,fwrap,ce('span','ttb-sp'),cnt);
    if(showDn){const sg=sgmEl('soft','s',{items:['寬鬆','緊湊'],active:S.dense?1:0,live,label:'列高',onChange:i=>{S.dense=i===1;card.classList.toggle('ttb-dn-compact',S.dense);card.classList.toggle('ttb-dn-comfortable',!S.dense);drawTable();say(S.dense?'已切換為緊湊列高':'已切換為寬鬆列高');}});
      if(!live)sg.querySelectorAll('button').forEach(b=>b.tabIndex=-1);bar.appendChild(sg);}
    function drawPop(){const b=base();const a=document.activeElement;const k=a&&fpop.contains(a)?a.dataset.k:null;
      fpop.innerHTML='';TTB_FKEYS.forEach(([key,title,vals,lab])=>{const h=ce('div','ttb-pop-h');h.textContent=title;fpop.appendChild(h);
        vals.forEach(v=>{const on=(S.extra[key]||[]).includes(v);const it=ce('button','ttb-opt');it.type='button';it.setAttribute('role','menuitemcheckbox');it.setAttribute('aria-checked',String(on));
          it.dataset.f=key;it.dataset.v=v;it.dataset.k=key+'|'+v;it.appendChild(cbxEl(on?'checked':'default','s'));
          const l=ce('span');l.textContent=lab(v);const n=ce('span','n');n.textContent=b.filter(r=>r[key]===v).length;it.append(l,n);fpop.appendChild(it);});});
      if(k){const n=fpop.querySelector(`[data-k="${k}"]`);if(n)n.focus({preventScroll:true});}}
    function popOpen(on){fpop.classList.toggle('is-open',on);fbtn.setAttribute('aria-expanded',String(on));
      if(on){drawPop();fpop.classList.remove('is-right');const r=fpop.getBoundingClientRect(),W=document.documentElement.clientWidth;if(r.right>W-8)fpop.classList.add('is-right');
        const f=fpop.querySelector('.ttb-opt');if(f&&live)setTimeout(()=>f.focus({preventScroll:true}),30);}}
    /* ── chip 列 ── */
    const chips=ce('div','ttb-chips');
    function drawChips(){chips.innerHTML='';const cs=[];TTB_FKEYS.forEach(([key,title,,lab])=>(S.extra[key]||[]).forEach(v=>cs.push([key,v,title+'：'+lab(v)])));
      chips.hidden=!cs.length;chips.style.display=cs.length?'':'none';
      cs.forEach(([key,v,l])=>chips.appendChild(ttbChip(l,live?{onRemove:()=>{S.extra[key]=S.extra[key].filter(x=>x!==v);changed();say('已移除條件 '+l);const f=chips.querySelector('.x');(f||inp).focus();}}:null)));
      if(cs.length){const c=ce('button','ttb-clear');c.type='button';c.textContent='清除全部';c.dataset.act='clear';if(!live)c.tabIndex=-1;chips.appendChild(c);}
      badge.textContent=cs.length;badge.hidden=!cs.length;fbtn.setAttribute('aria-label',cs.length?`篩選，已套用 ${cs.length} 個條件`:'篩選');}
    /* ── 表格（Table 原子）＋浮動批次列 ── */
    let tbl=null;const fb=ce('div','ttb-bar'+(live?'':' no-anim'));fb.setAttribute('role','region');fb.setAttribute('aria-label','批次操作');
    function drawCount(){const t=rows().length,p=Math.min(t,S.pageN);cnt.innerHTML=t>p?`第 1–${p} 筆，共 <b>${t}</b> 筆`:`共 <b>${t}</b> 筆`;}
    function drawTable(){if(!withTable){drawCount();return;}const pg=page();
      const n=tblTable('plain',S.dense?'compact':'comfortable',{data:pg.map(r=>Object.assign({},r,{_sel:S.all||S.sel.has(r.id)})),cols:TTB_COLS,checkbox:true,live});
      if(live){n.querySelectorAll('tbody .tbl-row').forEach((tr,i)=>{tr.setAttribute('aria-selected',String(S.all||S.sel.has(pg[i].id)));if(S.flash.has(pg[i].id))tr.classList.add('ttb-flash');});
        n.addEventListener('click',()=>{const on=new Set([...n.querySelectorAll('tbody .tbl-row')].filter(tr=>tr.classList.contains('is-selected')).map(tr=>pg[+tr.dataset.flip].id));
          const was=S.all?pg.length:pg.filter(r=>S.sel.has(r.id)).length;if(on.size===was&&!S.all)return;
          S.all=false;S.sel=on;S.confirm=false;n.querySelectorAll('tbody .tbl-row').forEach((tr,i)=>tr.setAttribute('aria-selected',String(on.has(pg[i].id))));drawBar();});}
      S.flash=new Set();
      if(!pg.length){const tb=n.querySelector('tbody');const tr=ce('tr');const td=ce('td','tbl-td');td.colSpan=TTB_COLS.length+1;
        const em=ce('div','ttb-empty');em.innerHTML='<span>沒有符合條件的訂單</span>';const rb=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:live});rb.type='button';rb.querySelector('span').textContent='清除條件';rb.dataset.act='reset';if(!live)rb.tabIndex=-1;
        em.appendChild(rb);td.appendChild(em);tr.appendChild(td);tb.appendChild(tr);}
      if(tbl)tbl.replaceWith(n);else card.insertBefore(n,fb);tbl=n;drawCount();}
    let asg=null;
    function drawBar(){const n=nSel(),on=n>0&&withTable;card.classList.toggle('has-bar',on);fb.classList.toggle('is-on',on);fb.inert=!on;fb.setAttribute('aria-hidden',String(!on));
      if(!on){S.confirm=false;fb.innerHTML='';asg=null;return;}
      const keep=document.activeElement&&fb.contains(document.activeElement)?document.activeElement.dataset.b:null;fb.innerHTML='';asg=null;
      const t=rows().length,pg=page();
      if(S.confirm){const q=ce('span','ttb-bar-n ttb-bar-q');q.textContent=`刪除 ${n} 筆訂單？無法復原`;
        const c=ttbBarBtn('','取消',{live});c.innerHTML='<span>取消</span>';c.dataset.b='cancel';
        const ok=mkBtn({variant:'solid',intent:'danger',size:'s',isLive:live});ok.type='button';ok.querySelector('span').textContent='刪除';ok.dataset.b='del-ok';if(!live)ok.tabIndex=-1;
        fb.append(q,c,ok);}
      else{const lab=ce('span','ttb-bar-n');lab.setAttribute('aria-live','polite');lab.textContent=S.all?`已選全部 ${t} 筆`:`已選 ${n} 筆`;fb.appendChild(lab);
        const full=!S.all&&pg.length&&pg.every(r=>S.sel.has(r.id))&&t>pg.length;
        if(full||S.all){const a=ce('button','ttb-bar-all');a.type='button';a.textContent=S.all?'只選本頁':`全選 ${t} 筆`;a.dataset.b=S.all?'page':'all';if(!live)a.tabIndex=-1;fb.appendChild(a);}
        fb.appendChild(ce('span','ttb-bar-sep'));
        const ex=ttbBarBtn(IC_DOWNLOAD,'匯出',{live});ex.dataset.b='export';
        const aw=ce('span','ttb-rel');const ab=ttbBarBtn(TTB_IC_USER_PLUS,'指派',{live});ab.dataset.b='assign';ab.setAttribute('aria-haspopup','menu');ab.setAttribute('aria-expanded','false');
        asg=ce('div','am-panel sz-m ttb-asg');asg.setAttribute('role','menu');asg.setAttribute('aria-label','指派給');asg.hidden=true;
        const h=ce('div','ttb-pop-h');h.textContent='指派給';asg.appendChild(h);
        TTB_OWNERS.forEach(w=>{const it=ce('button','am-item');it.type='button';it.setAttribute('role','menuitem');it.dataset.own=w;it.innerHTML=IC_USER+`<span class="am-lb">${w}</span>`+(w===TTB_ME?'<span class="ttb-me">我</span>':'');asg.appendChild(it);});
        aw.append(ab,asg);
        const del=ttbBarBtn(IC_TRASH,'刪除',{live,danger:true});del.dataset.b='del';
        const x=ttbBarBtn(ICON_CLOSE,'',{live,iconOnly:true,aria:'取消選取（Esc）'});x.dataset.b='clear';
        fb.append(ex,aw,del,ce('span','ttb-bar-sep'),x);}
      if(keep){const k=fb.querySelector(`[data-b="${keep}"]`);if(k)k.focus({preventScroll:true});}}
    function asgOpen(on){if(!asg)return;asg.hidden=!on;const b=fb.querySelector('[data-b="assign"]');if(b)b.setAttribute('aria-expanded',String(on));if(on){const f=asg.querySelector('.am-item');if(f)f.focus({preventScroll:true});}}
    /* 條件改變：保留仍看得到的已選列、退出「全選 N 筆」 */
    function changed(){const vis=new Set(page().map(r=>r.id));S.sel=new Set([...S.sel].filter(id=>vis.has(id)));S.all=false;S.confirm=false;
      syncViews(false);drawChips();drawTable();drawBar();if(fpop.classList.contains('is-open'))drawPop();}
    function clearSel(msg){S.sel.clear();S.all=false;S.confirm=false;drawTable();drawBar();if(msg)say(msg);}

    if(vw)card.appendChild(vw);card.append(bar,chips);card.appendChild(fb);
    drawViews();drawChips();drawTable();drawBar();
    if(live){
      card.tabIndex=-1;   // 點表格列（非可聚焦元素）時焦點留在卡片內，Esc 才能取消選取
      card.addEventListener('click',e=>{
        const t=e.target.closest('.ttb-views [data-v]');if(t){const i=+t.dataset.v;if(i!==S.v){S.v=i;S.extra={};changed();placeInd(true);say(`切換到「${S.views[i].name}」`);}const nt=tabs.querySelector(`[data-v="${S.v}"]`);if(nt)nt.focus();return;}
        const a=e.target.closest('[data-act]');if(a){const k=a.dataset.act;
          if(k==='clear'||k==='reset'){S.extra={};if(k==='reset'){S.q='';inp.value='';}changed();say('已清除篩選條件');inp.focus();}
          else if(k==='save'){S.saved++;const f=JSON.parse(JSON.stringify(S.views[S.v].f));Object.keys(S.extra).forEach(x=>f[x]=[...new Set([...(f[x]||[]),...S.extra[x]])]);
            S.views.push({name:'自訂 '+S.saved,f});S.v=S.views.length-1;S.extra={};drawViews();changed();say(`已另存為「自訂 ${S.saved}」`);
            const nt=tabs.querySelector(`[data-v="${S.v}"]`);if(nt)nt.focus();}
          return;}
        if(fbtn.contains(e.target)){popOpen(!fpop.classList.contains('is-open'));return;}
        const op=e.target.closest('.ttb-opt');if(op){const k=op.dataset.f,v=op.dataset.v;const s=new Set(S.extra[k]||[]);s.has(v)?s.delete(v):s.add(v);S.extra[k]=[...s];changed();return;}
        const ow=e.target.closest('[data-own]');if(ow){const ids=S.all?rows().map(r=>r.id):[...S.sel];S.data.forEach(r=>{if(ids.includes(r.id)){r.assignee=ow.dataset.own;S.flash.add(r.id);}});
          const n=ids.length;say(`已將 ${n} 筆指派給 ${ow.dataset.own}`);syncViews(false);drawTable();drawBar();const b=fb.querySelector('[data-b="assign"]');if(b)b.focus();return;}
        const b=e.target.closest('[data-b]');if(!b)return;const k=b.dataset.b,n=nSel();
        if(k==='assign'){asgOpen(asg&&asg.hidden);return;}
        if(k==='all'){S.all=true;drawTable();drawBar();say(`已選取全部 ${rows().length} 筆`);return;}
        if(k==='page'){S.all=false;S.sel=new Set(page().map(r=>r.id));drawTable();drawBar();say('只選取本頁');return;}
        if(k==='export'){say(`已匯出 ${n} 筆訂單（CSV，示意）`);return;}
        if(k==='del'){S.confirm=true;drawBar();const c=fb.querySelector('[data-b="cancel"]');if(c)c.focus();return;}
        if(k==='cancel'){S.confirm=false;drawBar();const d=fb.querySelector('[data-b="del"]');if(d)d.focus();return;}
        if(k==='del-ok'){const ids=new Set(S.all?rows().map(r=>r.id):[...S.sel]);const before=new Set(page().map(r=>r.id));S.data=S.data.filter(r=>!ids.has(r.id));
          page().forEach(r=>{if(!before.has(r.id))S.flash.add(r.id);});say(`已刪除 ${ids.size} 筆訂單`);syncViews(false);clearSel();inp.focus();return;}
        if(k==='clear'){clearSel('已取消選取');inp.focus();return;}});
      inp.addEventListener('input',()=>{S.q=inp.value.trim();changed();});
      card.addEventListener('keydown',e=>{
        if(e.key==='Escape'){
          if(fpop.classList.contains('is-open')){e.preventDefault();popOpen(false);fbtn.focus();return;}
          if(asg&&!asg.hidden){e.preventDefault();asgOpen(false);const b=fb.querySelector('[data-b="assign"]');if(b)b.focus();return;}
          if(S.confirm){e.preventDefault();S.confirm=false;drawBar();const d=fb.querySelector('[data-b="del"]');if(d)d.focus();return;}
          if(nSel()){e.preventDefault();clearSel('已取消選取');inp.focus();}return;}
        const t=e.target.closest('.ttb-views [data-v]');if(t&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();const L=S.views.length;S.v=(S.v+(e.key==='ArrowRight'?1:-1)+L)%L;S.extra={};changed();placeInd(true);
          const nt=tabs.querySelector(`[data-v="${S.v}"]`);if(nt)nt.focus();say(`切換到「${S.views[S.v].name}」`);}
        const op=e.target.closest('.ttb-opt,.ttb-asg .am-item');if(op&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();const all=[...op.parentElement.querySelectorAll('.ttb-opt,.am-item')];
          const j=(all.indexOf(op)+(e.key==='ArrowDown'?1:-1)+all.length)%all.length;all[j].focus();}});
      const outside=e=>{if(!card.isConnected){document.removeEventListener('click',outside,true);return;}
        if(fpop.classList.contains('is-open')&&!fwrap.contains(e.target))popOpen(false);
        if(asg&&!asg.hidden&&!e.target.closest('.ttb-asg,[data-b="assign"]'))asgOpen(false);};
      document.addEventListener('click',outside,true);
      if(window.ResizeObserver&&vw){const ro=new ResizeObserver(()=>{if(!card.isConnected){ro.disconnect();return;}placeInd(false);});ro.observe(vw);}
      if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>placeInd(false)).catch(()=>{});}
    return card;}
  function ttbLive(st){const w=ce('div','ttb-wrap');const msg=ce('div','ttb-msg');msg.setAttribute('aria-live','polite');
    w.append(ttbEl('applied','hidden',st.density,{live:true,msg,views:st.views,densityToggle:st.densityToggle}),msg);return w;}
  LIVE['table-toolbar']=(host)=>mountLive(host,{gate:'table-toolbar',initial:{density:'comfortable',views:true,densityToggle:false},
    segs:[{key:'density',label:'Density',options:['comfortable','compact'],labels:['寬鬆','緊湊']}],
    bools:[{key:'views',label:'views 已存檢視分頁'},{key:'densityToggle',label:'densityToggle 列高切換'}],boolLabel:'Content',
    render:st=>ttbLive(st),
    note:'分頁切換已存檢視（底線滑動、帶筆數）；「篩選」打開選單勾狀態與負責人，按鈕數字＝套用幾個條件，條件排成 chip、可「清除全部」或「另存為檢視」。勾選列後，表格底部彈出浮動批次列（搜尋與篩選照樣看得到）：勾滿本頁可「全選 N 筆」、指派會即時更新表格、刪除在列內二次確認、Esc 取消選取。表格直接取用 table 原子。'});
  function buildTableToolbar(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Table Toolbar',title:'Table Toolbar 表格工具列',
      lede:'放在 <a href="#table">table</a> 上方的工具列：<b>已存檢視分頁</b>（全部／我的／逾期，帶筆數）、搜尋、<b>篩選選單</b>（勾選＋各值筆數）、已套用條件 chip、筆數、列高切換；勾選列之後，表格底部彈出<b>浮動批次列</b>，搜尋與篩選維持原樣。內容取用 <a href="#tab">tab</a>、<a href="#input">input</a>、<a href="#button">button</a>、<a href="#popover">popover</a>、<a href="#selector">selector</a>、<a href="#tag">tag</a>、<a href="#segmented">segmented</a>、<a href="#action-menu">action menu</a>。<b>filter × bulk × density（2 × 3 × 2 = 12）</b>。',
      specRows:[['axes','<code>filter × bulk × density</code>'],['formula','<code>2 × 3 × 2 = 12</code>'],['boolean','<code>views · densityToggle</code>'],['token-policy','<code>semantic.surface.* · semantic.border.*</code>']]});
    const FN={none:['無條件','none'],applied:['已套用條件','applied']},BN={hidden:['未選取','hidden'],page:['選取本頁部分','page'],all:['全選符合條件','all']},DN={comfortable:['寬鬆','comfortable'],compact:['緊湊','compact']};
    const axes=DIAL_SPECS['table-toolbar'].axes,zh=DIAL_SPECS['table-toolbar'].zh,active=CHOICE['table-toolbar'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const fs=axes.filter.filter(v=>active.filter.has(v)),bs=axes.bulk.filter(v=>active.bulk.has(v)),ds=axes.density.filter(v=>active.density.has(v));
      bs.forEach(b=>p.appendChild(matrixPanel({badge:'bulk · '+b,name:BN[b][0]+' '+b+(b==='hidden'?'（沒有勾選列，批次列收起）':b==='page'?'（勾了本頁 2 筆：表頭半選、浮動批次列彈出）':'（全選符合條件的所有筆數，可退回只選本頁）'),
        rows:fs,cols:ds,rowLab:f=>labHTML(FN[f][0],FN[f][1]),colLab:d=>labHTML(DN[d][0],DN[d][1]),cell:(f,d)=>ttbEl(f,b,d,{}),mincol:440})));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Filter × Bulk × Density 矩陣','每個 bulk 值一塊；列＝是否套用篩選條件（chip 列、篩選鈕計數、另存為檢視）、欄＝表格列高。批次列浮在表格底部，選取時搜尋與篩選不會被蓋掉；刪除鈕用 danger 色。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Table Toolbar','資料超過一頁、需要找特定幾筆或一次處理多筆。'],['已存檢視','每個人有固定要看的組合（我的、逾期）時存成分頁，分頁上帶筆數；有額外條件時才出現「另存為檢視」。'],
      ['篩選條件要看得到','套用的篩選一律變成 chip，並顯示筆數，避免使用者以為資料不見了。'],['批次操作','勾選後才出現浮動批次列；勾滿本頁時提示「全選 N 筆」。刪除在列內二次確認並寫出會刪掉幾筆，不另開 modal。']]);
    const sl=section(body,'互動預覽與程式碼','切換檢視、打開篩選勾條件、勾選列叫出批次列試試看。');LIVE['table-toolbar'](sl);
  }

