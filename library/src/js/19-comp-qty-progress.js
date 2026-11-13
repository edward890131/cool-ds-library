  /* ==================== Quantity 商品計數 ==================== */
  /* 計數器：variant 外觀、size 尺寸；state：default／min(−停用)／max(＋停用)／disabled。＋／− 重用 Button 原子（icon-only）*/
  function qtyEl(variant,size,o){
    o=o||{};
    const val=(o.value!=null)?o.value:1;
    const state=o.state||'default';
    const el=ce('div','qty qty-v-'+variant+' qty-sz-'+size+(state==='disabled'?' is-disabled':''));
    const bv=variant==='plain'?'v-outline':'v-outline';                 // 內部 −/＋ 皆用 outline 原子，容器再依 variant 改外觀
    const minus=ce('button','btn '+bv+' i-secondary sz-'+size+' icon-only'+(o.live?' live':''));
    minus.innerHTML=ICON_MINUS;minus.setAttribute('aria-label','減少');
    if(state==='min'||state==='disabled')minus.disabled=true;
    const num=ce('span','qty-val');num.textContent=val;
    const plus=ce('button','btn '+bv+' i-secondary sz-'+size+' icon-only'+(o.live?' live':''));
    plus.innerHTML=IC_PLUS;plus.setAttribute('aria-label','增加');
    if(state==='max'||state==='disabled')plus.disabled=true;
    el.append(minus,num,plus);
    el._parts={minus,num,plus};
    return el;
  }
  function buildQuantity(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Quantity',title:'Quantity 商品計數',
      lede:'電商常見的<b>數量選擇器</b>：<b>−</b> 減 ／ <b>數值</b> ／ <b>＋</b> 加，用於購物車、商品頁調整購買數量。三種 variant（<b>外框</b>／<b>膠囊</b>／<b>極簡</b>）× 三尺寸；達下限時 <b>−</b> 停用、達上限時 <b>＋</b> 停用。＋／− 重用 Button 原子（icon-only）。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>semantic.*.control.*</code>'],['a11y','<code>aria-label 減少／增加</code>']]});
    const axes=DIAL_SPECS.quantity.axes, zh=DIAL_SPECS.quantity.zh, active=CHOICE.quantity.active;
    const VN={outline:['外框','outline'],pill:['膠囊','pill'],plain:['極簡','plain']};
    const SZN={s:['小','s'],m:['標準','m'],l:['大','l']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'quantity',name:'Variant × Size（三型態 × 三尺寸）',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(SZN[s][0]+'尺寸',SZN[s][1]),
        cell:(v,s)=>qtyEl(v,s,{value:1}),mincol:170})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','列＝三型態（外框／膠囊／極簡）、欄＝三尺寸；＋／− 為 Button 原子（icon-only），容器依 variant 改外觀。');
    p=panelsIn(sec);renderM();
    const stt=section(body,'狀態 States','預設／達下限（− 停用）／達上限（＋ 停用）／整體停用。');
    const srow=ce('div','qty-staterow');
    [['default','預設',3],['min','達下限',1],['max','達上限',99],['disabled','停用',3]].forEach(([s,lbl,v])=>{
      const cell=ce('div','qty-statecell');
      const cap=ce('div','qty-statecap');cap.textContent=lbl;
      cell.append(cap,qtyEl('outline','m',{value:v,state:s}));
      srow.appendChild(cell);
    });
    stt.appendChild(srow);
    const sl=section(body,'互動預覽與程式碼','點 ＋／− 調整數量（範圍 1–10），到邊界對應鈕自動停用；切 variant／size、勾 disabled。');
    mountLive(sl,{
      initial:{variant:'outline',size:'m',disabled:false},
      segs:[{key:'variant',label:'Variant',options:['outline','pill','plain'],labels:['外框','膠囊','極簡']},
            {key:'size',label:'Size',options:['s','m','l']}],
      bools:[{key:'disabled',label:'disabled 停用'}],
      boolLabel:'State',
      render:st=>{
        let v=1;const MIN=1,MAX=10;
        const wrap=ce('div','qty-live-box');
        function mk(){wrap.innerHTML='';
          const state=st.disabled?'disabled':(v<=MIN?'min':v>=MAX?'max':'default');
          const el=qtyEl(st.variant,st.size,{value:v,state:state,live:true});
          if(!st.disabled){
            el._parts.minus.onclick=()=>{if(v>MIN){v--;mk();}};
            el._parts.plus.onclick=()=>{if(v<MAX){v++;mk();}};
          }
          wrap.appendChild(el);
        }
        mk();return wrap;
      },
      note:'數量範圍 1–10；到下限 − 停用、到上限 ＋ 停用。＋／− 為 Button 原子（icon-only、live 開啟真互動）。'
    });
  }

  /* ==================== Progress 進度條 ==================== */
  /* 進度條：variant（bar 基本／label 帶百分比／gradient 漸層）× size（細/標準/粗）；o.value 0–100、o.intent 語意色
     label／gradient 亦可用 o.label / o.gradient 旗標獨立疊加（Live 用），彼此正交 */
  function prgEl(variant,size,o){
    o=o||{};
    const intent=o.intent||'primary';
    const val=(o.value!=null)?o.value:60;
    const showLabel=(o.label!=null)?o.label:(variant==='label');
    const gradient=(o.gradient!=null)?o.gradient:(variant==='gradient');
    const wrap=ce('div','prg prg-sz-'+size);
    wrap.setAttribute('role','progressbar');
    wrap.setAttribute('aria-valuenow',val);wrap.setAttribute('aria-valuemin','0');wrap.setAttribute('aria-valuemax','100');
    if(showLabel){
      const lab=ce('div','prg-label');
      const t=ce('span','prg-cap');t.textContent=o.cap||'上傳進度';
      const pct=ce('span','prg-pct');pct.textContent=val+'%';
      lab.append(t,pct);wrap.appendChild(lab);
    }
    const track=ce('div','prg-track');
    const fill=ce('div','prg-fill i-'+intent+(gradient?' is-grad':''));
    fill.style.width=val+'%';
    track.appendChild(fill);wrap.appendChild(track);
    return wrap;
  }
  function buildProgress(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Progress',title:'Progress 進度條',
      lede:'線性<b>進度指示</b>：track 底軌 ＋ fill 填充（依 value 0–100% 撐開）。三種 variant（<b>基本</b>／<b>帶百分比</b>／<b>漸層</b>）× 三尺寸（細／標準／粗）。語意色 primary／success／warning／danger 綁 semantic token；漸層版每種語意色各有對應的深淺漸層。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>--accent / --ok / --warn / --i-danger</code>'],['a11y','<code>role=progressbar</code>']]});
    const axes=DIAL_SPECS.progress.axes, zh=DIAL_SPECS.progress.zh, active=CHOICE.progress.active;
    const VN={bar:['基本','bar'],label:['帶百分比','label'],gradient:['漸層','gradient']};
    const SZN={s:['細','s'],m:['標準','m'],l:['粗','l']};
    let p;
    function renderM(){ if(!p)return; p.innerHTML='';
      const vs=axes.variant.filter(v=>active.variant.has(v));
      const ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'progress',name:'Variant × Size（三型態 × 三尺寸）',
        rows:vs,cols:ss,
        rowLab:v=>labHTML(VN[v][0],VN[v][1]),
        colLab:s=>labHTML(SZN[s][0],SZN[s][1]),
        cell:(v,s)=>prgEl(v,s,{value:60}),mincol:210})); }
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','列＝三型態、欄＝三尺寸；基本＝純填充、帶百分比＝上方標題＋%、漸層＝填充帶深淺漸層。粗（l）尺寸標題與百分比字級一併放大。');
    p=panelsIn(sec);renderM();
    const cs=section(body,'語意色 Intent','進度色依情境語意：primary 一般／success 完成／warning 注意／danger 錯誤，全綁 semantic token。');
    const crow=ce('div','prg-intentrow');
    [['primary','一般 primary',72],['success','完成 success',100],['warning','注意 warning',45],['danger','錯誤 danger',30]].forEach(([it,lbl,v])=>{
      const cell=ce('div','prg-intentcell');
      const cap=ce('div','prg-intentcap');cap.textContent=lbl;
      cell.append(cap,prgEl('bar','m',{value:v,intent:it}));
      crow.appendChild(cell);
    });
    cs.appendChild(crow);
    const sl=section(body,'互動預覽與程式碼','切 size／intent，勾 label（標題＋%）／gradient（漸層填充）；滑桿就在勾選項右側即時調整進度。進度條長度為區域的 50%。');
    // 自訂 Live（非 mountLive）：滑桿要跟勾選項同列，故手刻控制列＝seg×2 ＋（勾選項＋滑桿同一 ctl）
    const st={size:'m',intent:'primary',label:true,gradient:false,value:60};
    const wrap=ce('div','livewrap');
    const ctlRow=ce('div','ctl-row');
    const stage=ce('div','live-stage');
    function draw(){stage.innerHTML='';const box=ce('div','prg-live-box');
      box.appendChild(prgEl('bar',st.size,{value:st.value,intent:st.intent,label:st.label,gradient:st.gradient,cap:'上傳進度'}));
      stage.appendChild(box);}
    // seg 控制（比照 mountLive 樣式）
    function prgSeg(key,label,opts,labels){
      const c=ce('div','ctl');c.innerHTML=`<span class="lab">${label}</span>`;
      const seg=ce('div','seg');
      opts.forEach((o,i)=>{const b=document.createElement('button');b.textContent=labels?labels[i]:o;
        b.setAttribute('aria-pressed',st[key]===o);
        b.onclick=()=>{st[key]=o;[...seg.children].forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');draw();};
        seg.appendChild(b);});
      c.appendChild(seg);return c;}
    ctlRow.appendChild(prgSeg('size','Size',['s','m','l']));
    ctlRow.appendChild(prgSeg('intent','Intent',['primary','success','warning','danger'],['一般','完成','注意','錯誤']));
    // 勾選項 ＋ 滑桿同一組（滑桿坐在勾選項右邊）
    const cc=ce('div','ctl');cc.innerHTML='<span class="lab">Content</span>';
    const checks=ce('div','checks prg-checks');
    [['label','label 標題＋%'],['gradient','gradient 漸層']].forEach(([k,lb])=>{
      const l=ce('label','chk');const i=document.createElement('input');i.type='checkbox';i.checked=!!st[k];
      i.onchange=()=>{st[k]=i.checked;draw();};l.append(i,document.createTextNode(lb));checks.appendChild(l);});
    const rng=document.createElement('input');rng.type='range';rng.min=0;rng.max=100;rng.value=st.value;rng.className='prg-range';
    rng.oninput=()=>{st.value=+rng.value;const fill=stage.querySelector('.prg-fill');if(fill)fill.style.width=rng.value+'%';const pct=stage.querySelector('.prg-pct');if(pct)pct.textContent=rng.value+'%';const pb=stage.querySelector('.prg');if(pb)pb.setAttribute('aria-valuenow',rng.value);};
    checks.appendChild(rng);
    cc.appendChild(checks);ctlRow.appendChild(cc);
    wrap.appendChild(ctlRow);wrap.appendChild(stage);
    const note=ce('p','live-note');note.innerHTML='value 0–100 由勾選項右側滑桿控制；<b>label</b> 顯示標題＋%、<b>gradient</b> 換漸層填充（隨 intent 變色）、<b>intent</b> 切換語意色。進度條寬度固定為互動區的 50%。';
    wrap.appendChild(note);
    sl.appendChild(wrap);draw();
  }


