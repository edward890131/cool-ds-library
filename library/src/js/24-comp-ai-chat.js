  /* ==================== AIC:v1 AI Chat 對話元件（2026-11-10）====================
     盤點 ChatGPT／Claude／Gemini 的共通介面後拆成 6 顆：AI 頭像、訊息、思考狀態、輸入列、建議問題、錯誤。
     內部的按鈕、標籤、Popover、Alert、Loader、Avatar 一律取用既有原子（鐵則 5）；假資料為通用情境。
     動態（思考旋轉、串流游標、逐字淡入）只存在程式碼，寫進 Figma 時以靜態 variant 表示。 */
  function aiavEl(state,size,o){o=o||{};const a=ce('span',`aiav st-${state||'idle'} as-${size||'m'}`);a.setAttribute('role','img');a.setAttribute('aria-label',o.label||'AI');
    const l=ce('span','aiav-logo');const src=activeLogo();l.innerHTML=src?'<img src="'+src+'" alt="">':HDR_LOGO.replace('role="img" aria-label="CDL"','aria-hidden="true"');a.appendChild(l);return a;}
  /* 共用：取用 Button／Tag 原子，只換圖示與文字 */
  /* 換圖示時新圖示縮放＋模糊進場；kind='ok' 為成功勾（多一點旋轉、彈性） */
  function aicSwap(btn,icon,kind){btn.innerHTML=PI(icon);const sv=btn.querySelector('svg');if(sv)sv.classList.add(kind==='ok'?'aic-ok-in':'aic-ic-in');}
  function aicIconBtn(icon,label,o){o=o||{};const b=mkBtn({variant:o.variant||'text',intent:o.intent||'secondary',size:o.size||'s',iconOnly:true,isLive:true});
    b.type='button';b.innerHTML=PI(icon);b.setAttribute('aria-label',label);b.title=label;return b;}
  function aicBtn(text,o){o=o||{};const b=mkBtn({variant:o.variant||'outline',intent:o.intent||'secondary',size:o.size||'s',isLive:true});
    b.type='button';b.innerHTML=(o.icon?PI(o.icon):'')+'<span></span>';b.querySelector('span').textContent=text;return b;}
  /* Tag 原子：o.as='a'／'button' 時是可點的 chip（尺寸用 m 26px，hover／focus／按下回饋），類別照抄 tagEl 產生的 */
  function aicTag(text,icon,o){o=o||{};const base=tagEl(o.variant||'outline',o.intent||'neutral','default',null,o.as?'m':o.size);
    const t=o.as?document.createElement(o.as):base;if(o.as){t.className=base.className+' aic-chip';if(o.as==='button')t.type='button';}
    t.innerHTML=(icon?PI(icon):'')+'<span></span>';t.querySelector('span').textContent=text;return t;}
  /* 來源：開新分頁的連結 */
  function aicSrc(d){const a=aicTag(d,'link',{as:'a'});a.href='https://'+d+'/';a.target='_blank';a.rel='noopener noreferrer';a.title=d;a.setAttribute('aria-label',d+'（開新分頁）');return a;}
  /* 附件：可點開；removable 時帶移除鈕（輸入列） */
  function aicFile(name,o){o=o||{};const w=ce('span','aic-file');const b=aicTag(name,'file-text',{as:'button',variant:'soft'});b.title='開啟 '+name;w.appendChild(b);
    if(o.removable){const x=ce('button','aic-file-x');x.type='button';x.innerHTML=PI('x');x.setAttribute('aria-label','移除 '+name);x.title='移除';x.onclick=()=>{w.remove();if(o.onRemove)o.onRemove();};w.appendChild(x);}
    return w;}
  /* 英文模式下串流要逐字顯示英文（逐字切出的中文片段對不到翻譯表），先整段翻好再切 */
  const aicT=s=>{try{if(I18N_LANG!=='zh'){const v=i18nCore(s);if(v!=null)return v;}}catch(e){}return s;};
  const aicTr=bl=>bl.map(b=>b.p!=null?{p:aicT(b.p)}:{[b.ol?'ol':'ul']:(b.ol||b.ul).map(i=>({b:i.b?aicT(i.b):'',t:aicT(i.t)}))});
  const aicLen=bl=>bl.reduce((n,b)=>n+(b.p!=null?b.p.length:(b.ol||b.ul).reduce((m,i)=>m+(i.b||'').length+i.t.length,0)),0);
  /* 回覆內容（通用假資料）：段落／條列，條列可帶粗體開頭 */
  const AIC_REPLY=[{p:'好的！這是一份適合週末兩天的台南美食行程：'},
    {ol:[{b:'第一天上午',t:'：國華街吃牛肉湯、碗粿，順路逛神農街。'},{b:'第一天下午',t:'：到安平老街吃蝦捲和豆花，傍晚看夕陽。'},{b:'第二天',t:'：早上喝鹹粥，中午吃擔仔麵，下午到藍晒圖文創園區喝咖啡。'}]},
    {p:'需要我依照預算或交通方式再調整嗎？'}];
  const AIC_SOURCES=['twtainan.net','tripadvisor.com','klook.com'];
  /* 依字數 n 畫出前 n 個字（Infinity＝全部）；回傳實際畫出的字數 */
  /* tail＝每次吐出的字數：最後 6 批字依「新舊」分 6 級，從模糊淡入到清楚（每次重畫往前推一級，看起來就是一路解析出來） */
  function aicBlocks(host,blocks,n,tail){host.innerHTML='';let left=n,pos=0;
    const seg=(parent,txt,bold)=>{if(left<=0||!txt)return;const s=txt.slice(0,left);left-=s.length;const tg=bold?parent.appendChild(ce('b')):parent;
      if(!tail){tg.appendChild(document.createTextNode(s));pos+=s.length;return;}
      let buf='',ba=-1;const flush=()=>{if(!buf)return;if(ba>=6)tg.appendChild(document.createTextNode(buf));else{const sp=ce('span','aic-t'+ba);sp.textContent=buf;tg.appendChild(sp);}buf='';};
      for(const ch of s){const a=Math.min(6,Math.floor((n-1-pos)/tail));if(a!==ba){flush();ba=a;}buf+=ch;pos+=ch.length;}flush();};
    for(const bl of blocks){if(left<=0)break;
      if(bl.p!=null){const p=ce('p');seg(p,bl.p);host.appendChild(p);}
      else{const l=ce(bl.ol?'ol':'ul');for(const it of (bl.ol||bl.ul)){if(left<=0)break;const li=ce('li');seg(li,it.b,true);seg(li,it.t);l.appendChild(li);}host.appendChild(l);}}}
  const aicPlain=bl=>bl.map(b=>b.p!=null?b.p:(b.ol||b.ul).map((i,k)=>(b.ol?(k+1)+'. ':'• ')+(i.b||'')+i.t).join('\n')).join('\n\n');

  /* ---------- Chat Message 訊息：role × state（完成／進行中／中斷）---------- */
  function aicMsgEl(role,state,o){o=o||{};const m=ce('div',`aic-msg r-${role} st-${state}`);
    if(role==='user'){
      if(o.files){const f=ce('div','aic-files');(Array.isArray(o.files)?o.files:['週末行程草稿.pdf']).forEach(n=>f.appendChild(aicFile(n)));m.appendChild(f);}
      const b=ce('div','aic-bubble');b.textContent=o.text||'幫我規劃週末兩天的台南美食行程';m.appendChild(b);
      if(state==='pending'){const mt=ce('div','aic-meta');mt.appendChild(loaderEl('dots','neutral','s',{inline:true}));const s=ce('span');s.textContent='傳送中…';mt.appendChild(s);m.appendChild(mt);}
      if(state==='interrupted'){const mt=ce('div','aic-meta is-error');mt.innerHTML=PI('circle-alert');const s=ce('span');s.textContent='沒有送出';mt.appendChild(s);
        const r=aicBtn('重試',{variant:'text',icon:'refresh-cw'});if(o.onRetry)r.onclick=o.onRetry;mt.appendChild(r);m.appendChild(mt);}
      return m;}
    if(o.avatar!==false)m.appendChild(aiavEl(state==='pending'?'streaming':'idle','m'));
    const body=ce('div','aic-body');const tx=ce('div','aic-text');body.appendChild(tx);
    const blocks=o.blocks||aicTr(AIC_REPLY),half=Math.round(aicLen(blocks)*.45);
    if(state==='pending'){aicBlocks(tx,blocks,o.n!=null?o.n:half,o.tail||3);}
    else if(state==='interrupted'){aicBlocks(tx,blocks,o.n!=null?o.n:half);
      const mt=ce('div','aic-meta');const s=ce('span');s.textContent='已停止生成';mt.appendChild(s);
      const r=aicBtn('重新產生',{variant:'text',icon:'refresh-cw'});if(o.onRegen)r.onclick=o.onRegen;mt.appendChild(r);body.appendChild(mt);}
    else aicBlocks(tx,blocks,Infinity);
    if(state==='done'&&o.sources){const src=ce('div','aic-sources');AIC_SOURCES.forEach(d=>src.appendChild(aicSrc(d)));body.appendChild(src);}
    if(state==='done'&&o.actions!==false)body.appendChild(aicActionsEl(Object.assign({getText:()=>aicPlain(blocks)},o)));
    m.appendChild(body);return m;}
  /* 回覆操作列：複製（變勾 1.5 秒）、讚／倒讚（倒讚開回饋 Popover）、重新產生、分享 */
  function aicActionsEl(o){o=o||{};const a=ce('div','aic-actions');a.setAttribute('role','group');a.setAttribute('aria-label','回覆操作');
    const cp=aicIconBtn('copy','複製');cp.onclick=()=>{try{if(navigator.clipboard&&o.getText)navigator.clipboard.writeText(o.getText()).catch(()=>{});}catch(e){}
      aicSwap(cp,'check','ok');cp.setAttribute('aria-label','已複製');cp.title='已複製';setTimeout(()=>{aicSwap(cp,'copy');cp.setAttribute('aria-label','複製');cp.title='複製';},1500);};
    const up=aicIconBtn('thumbs-up','回覆很有幫助');const dnWrap=ce('span','aic-fb-wrap');const dn=aicIconBtn('thumbs-down','回覆不理想');dnWrap.appendChild(dn);
    [up,dn].forEach(b=>b.setAttribute('aria-pressed','false'));
    const set=(b,on)=>{b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',String(on));};
    up.onclick=()=>{const on=!up.classList.contains('is-on');set(up,on);set(dn,false);dnWrap.querySelector('.aic-fb')?.remove();
      const sv=up.querySelector('svg');if(sv&&on){sv.classList.remove('aic-pop');void sv.getBoundingClientRect();sv.classList.add('aic-pop');}};
    dn.onclick=()=>{if(dn.classList.contains('is-on')){set(dn,false);return;}set(up,false);aicFeedback(dnWrap,dn,()=>set(dn,true));};
    const rg=aicIconBtn('refresh-cw','重新產生');if(o.onRegen)rg.onclick=o.onRegen;
    a.append(cp,up,dnWrap,rg,aicIconBtn('share-2','分享'));return a;}
  /* 倒讚回饋：取用 Popover 原子＋可選 Tag */
  function aicFeedback(wrap,dn,onSent){const old=wrap.querySelector('.aic-fb');if(old){old.remove();return;}
    const pp=popEl('bottom','s',{arrow:false});pp.classList.add('aic-fb','is-open');pp.setAttribute('aria-label','回饋原因');
    pp.style.cssText='position:absolute;top:calc(100% + 6px);left:0;translate:none;z-index:6;opacity:1;visibility:visible;transform:none;pointer-events:auto;';
    pp.querySelector('.pop-title').textContent='哪裡可以更好？';
    const bd=pp.querySelector('.pop-body');bd.innerHTML='';
    ['內容不正確','沒有回答到問題','太冗長','格式不好讀','其他'].forEach(t=>{const g=aicTag(t,null,{as:'button'});g.setAttribute('aria-pressed','false');
      const tg=()=>{const on=!g.classList.contains('is-on');g.classList.toggle('is-on',on);g.setAttribute('aria-pressed',String(on));};
      g.onclick=tg;bd.appendChild(g);});
    const btns=pp.querySelectorAll('.pop-foot .btn');if(btns[0])btns[0].querySelector('span').textContent='取消';if(btns[1])btns[1].querySelector('span').textContent='送出';
    const close=()=>{pp.remove();dn.focus();};if(btns[0])btns[0].onclick=close;const x=pp.querySelector('.pop-x');if(x)x.onclick=close;
    if(btns[1])btns[1].onclick=()=>{if(onSent)onSent();pp.remove();dn.focus();};
    pp.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close();}});
    wrap.appendChild(pp);const f=bd.querySelector('.tg');if(f)f.focus();}

  /* ---------- Chat Thinking 思考狀態：kind（思考／搜尋／推理摘要）× state（進行中／完成）---------- */
  /* 點陣環繞 loader（orbit）：4×4 點陣去掉四角，外圈 8 點順時針輪流亮起、中間 4 點維持不動 */
  const AIC_ORBIT=[1,2,7,11,14,13,8,4];
  function aicMatrixEl(){const m=ce('span','aic-mx');m.setAttribute('aria-hidden','true');
    for(let k=0;k<16;k++){const d=ce('i');const o=AIC_ORBIT.indexOf(k);
      if([0,3,12,15].includes(k))d.className='is-gap';else if(o<0)d.className='is-core';else d.style.animationDelay=(o*150)+'ms';m.appendChild(d);}
    return m;}
  /* 狀態列（Thinking states）：文字微光，每隔一段時間以「模糊＋上移」換成下一句 */
  function aicStatusEl(lines,active){const w=ce('span','aic-status');const mk=(txt,cls)=>{const x=ce('span',(active?'aic-shimmer ':'')+(cls||''));x.textContent=txt;return x;};
    w.appendChild(mk(lines[0]));
    if(active&&lines.length>1){let i=0,seen=0;const t=setInterval(()=>{if(!w.isConnected){if(seen)clearInterval(t);return;}seen=1;i=(i+1)%lines.length;
      const old=w.querySelector('span:not(.is-out)');if(old){old.classList.add('is-out');setTimeout(()=>old.remove(),280);}w.appendChild(mk(lines[i],'is-in'));},2000);}
    return w;}
  /* 推理串流（Reasoning stream）：兩行高的視窗，推理內容一行一行往上捲 */
  function aicReasonStreamEl(lines){const w=ce('div','aic-rs');const tr=ce('div','aic-rs-track');lines.forEach(x=>{const d=ce('div');d.textContent=x;tr.appendChild(d);});w.appendChild(tr);
    let k=0,seen=0;const t=setInterval(()=>{if(!w.isConnected){if(seen)clearInterval(t);return;}seen=1;k++;
      if(k>lines.length-2){k=0;tr.classList.add('no-tr');tr.style.transform='';void tr.offsetWidth;tr.classList.remove('no-tr');return;}
      tr.style.transform='translateY(calc(var(--rs-lh) * -'+k+'))';},1500);
    return w;}
  const AIC_REASON=['確認需求：週末兩天、以美食為主。','依區域排出順路動線，避免來回。','每個時段挑一到兩個代表性小吃。','查詢營業時間，避開公休日。','整理成兩天的行程表。'];
  function aicThinkEl(kind,state){const t=ce('div',`aic-think k-${kind} st-${state}`);t.setAttribute('role','status');const row=ce('div','aic-think-row');t.appendChild(row);
    const act=state==='active';
    if(kind==='thinking'){if(act){row.appendChild(aicMatrixEl());row.appendChild(aicStatusEl(['思考中…','理解你的問題…','整理回覆重點…'],true));}
      else{row.innerHTML=PI('check');row.appendChild(aicStatusEl(['已完成思考']));}return t;}
    if(kind==='searching'){row.innerHTML=PI('globe');row.appendChild(aicStatusEl(act?['正在搜尋網路…','閱讀 twtainan.net…','比對 3 個來源…']:['已搜尋 3 個來源'],act));
      if(!act){const src=ce('div','aic-sources');AIC_SOURCES.forEach(d=>src.appendChild(aicSrc(d)));t.appendChild(src);}return t;}
    if(act){row.appendChild(aicMatrixEl());row.appendChild(aicStatusEl(['推理中…'],true));t.appendChild(aicReasonStreamEl(AIC_REASON));return t;}
    const btn=ce('button','aic-think-toggle');btn.type='button';btn.setAttribute('aria-expanded','false');
    btn.appendChild(aicStatusEl(['已思考 12 秒']));btn.insertAdjacentHTML('beforeend',PI('chevron-right'));row.appendChild(btn);
    const body=ce('div','aic-think-body');const ol=ce('ol');
    AIC_REASON.forEach(x=>{const li=ce('li');li.textContent=x;ol.appendChild(li);});
    body.appendChild(ol);body.hidden=true;t.appendChild(body);
    btn.onclick=()=>{const on=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(on));body.hidden=!on;};
    return t;}

  /* ---------- Chat Composer 輸入列：layout（標準／精簡）× state（空白／輸入中／生成中／停用）---------- */
  /* ＋選單：常見的加入內容與工具（取用 Action Menu 原子 am-panel／amItem）。工具是開關，開了會在輸入列出現可移除的 chip */
  const AIC_PLUS=[{k:'file',ic:'paperclip',t:'上傳檔案'},{k:'photo',ic:'image',t:'加入照片'},{div:true},
    {k:'search',ic:'globe',t:'網頁搜尋',tool:'搜尋'},{k:'think',ic:'lightbulb',t:'深度思考',tool:'思考'},{k:'research',ic:'telescope',t:'深度研究',tool:'研究'},{k:'image',ic:'palette',t:'建立圖片',tool:'圖片'}];
  /* AIC-USAGE:v1（2026-11-10）方案使用量：送出鈕左邊一顆圓環（目前週額度 %），滑過／聚焦／點擊浮出面板，列出各額度與重設時間＋Progress 條。
     live 時每送出一則訊息用量 +1–2%；≥80% 圓環轉 warning、≥95% danger。 */
  const AIC_USAGE=[{k:'週額度',t:'每週 · 所有模型',reset:'週日上午 6:00 重設',v:38},{k:'5 小時',t:'每 5 小時 · 對話',reset:'下午 3:20 重設',v:62}];
  function aicUsageEl(o){o=o||{};const L=AIC_USAGE.map(x=>Object.assign({},x));const w=ce('span','aic-use');
    const b=ce('button','aic-use-btn');b.type='button';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');
    b.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" class="trk"/><circle cx="10" cy="10" r="7.5" class="val"/></svg>';
    const pn=ce('div','aic-use-pop');pn.setAttribute('role','dialog');pn.setAttribute('aria-label','方案使用量');
    const hd=ce('div','aic-use-h');const ht=ce('span');ht.textContent='方案使用量限制 · Pro';const all=ce('a','aic-use-all');all.href='#';all.innerHTML='<span>查看全部</span>'+PI('arrow-right');all.onclick=e=>e.preventDefault();hd.append(ht,all);pn.appendChild(hd);
    const rows=L.map(x=>{const r=ce('div','aic-use-row');const top=ce('div','aic-use-top');const a=ce('span','aic-use-t');a.textContent=x.t;const m=ce('span','aic-use-m');const rs=ce('span');rs.textContent=x.reset;const pc=ce('b');m.append(rs,pc);top.append(a,m);
      const bar=prgEl('bar','s',{value:x.v,label:false});r.append(top,bar);pn.appendChild(r);return {x,pc,bar};});
    const C=2*Math.PI*7.5,val=b.querySelector('.val');
    const paint=()=>{const v=L[0].v;val.style.strokeDasharray=`${(C*v/100).toFixed(2)} ${C.toFixed(2)}`;w.dataset.lv=v>=95?'danger':v>=80?'warn':'';
      b.setAttribute('aria-label',`方案使用量：每週額度已用 ${v}%`);b.title=`已使用 ${v}%`;
      rows.forEach(({x,pc,bar})=>{pc.textContent=x.v+'%';const f=bar.querySelector('.prg-fill');if(f)f.style.width=x.v+'%';bar.setAttribute('aria-valuenow',x.v);});};
    paint();w.append(b,pn);
    let pin=false,ht2=0;const show=on=>{w.classList.toggle('is-open',on);b.setAttribute('aria-expanded',String(on));};
    w.addEventListener('pointerenter',()=>{clearTimeout(ht2);show(true);});w.addEventListener('pointerleave',()=>{ht2=setTimeout(()=>{if(!pin)show(false);},120);});
    b.onclick=()=>{pin=!pin;show(pin||w.matches(':hover'));};b.addEventListener('focus',()=>show(true));b.addEventListener('blur',()=>{if(!pin)show(false);});
    w.addEventListener('keydown',e=>{if(e.key==='Escape'){pin=false;show(false);b.focus();}});
    w._bump=()=>{L.forEach((x,i)=>{x.v=Math.min(100,x.v+(i?2:1));});paint();w.classList.remove('is-bump');void w.offsetWidth;w.classList.add('is-bump');};
    return w;}
  function aicCmpEl(layout,state,o){o=o||{};const c=ce('div',`aic-cmp ly-${layout} st-${state}`);
    const ta=document.createElement('textarea');ta.rows=1;ta.setAttribute('aria-label','輸入訊息');
    ta.placeholder=state==='disabled'?'目前無法傳送訊息':'問點什麼…';if(state==='typing')ta.value=o.value||'幫我規劃週末兩天的台南美食行程';if(state==='disabled')ta.disabled=true;
    const gen=state==='generating';
    const send=aicIconBtn(gen?'square':'arrow-up',gen?'停止生成':'送出',{variant:'solid',intent:'primary'});send.classList.add('aic-send');if(gen)send.classList.add('is-stop');
    send.disabled=state==='empty'||state==='disabled';
    const grow=()=>{ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,180)+'px';};
    if(o.live){ta.addEventListener('input',()=>{grow();if(c.classList.contains('st-generating'))return;const has=!!ta.value.trim();send.disabled=!has;c.classList.toggle('st-typing',has);c.classList.toggle('st-empty',!has);});
      ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();if(!send.disabled)send.click();}});}
    /* 上方附件列（檔案＋已開啟的工具）；沒有內容時隱藏 */
    const top=ce('div','aic-cmp-top');const tools=new Set();const files=[];
    const syncTop=()=>{top.hidden=!top.children.length;};
    const addFile=name=>{files.push(name);top.appendChild(aicFile(name,{removable:!!o.live,onRemove:()=>{files.splice(files.indexOf(name),1);syncTop();}}));syncTop();};
    const toolChip=it=>{const w=ce('span','aic-tool');w.dataset.k=it.k;const b=aicTag(it.tool,it.ic,{as:'button',variant:'soft',intent:'brand'});b.title=it.t;w.appendChild(b);
      const x=ce('button','aic-file-x');x.type='button';x.innerHTML=PI('x');x.setAttribute('aria-label','關閉'+it.t);x.title='關閉';x.onclick=()=>setTool(it,false);w.appendChild(x);return w;};
    function setTool(it,on){if(on===tools.has(it.k))return;on?tools.add(it.k):tools.delete(it.k);
      const ex=top.querySelector(`.aic-tool[data-k="${it.k}"]`);if(ex)ex.remove();if(on)top.appendChild(toolChip(it));
      const mi=menu&&menu.querySelector(`[data-k="${it.k}"]`);if(mi)mi.setAttribute('aria-checked',String(on));syncTop();}
    /* ＋按鈕＋選單 */
    let menu=null,plusWrap=null;
    if(o.attach!==false){plusWrap=ce('span','aic-plus');const plus=aicIconBtn('plus','加入檔案與工具',{variant:'soft'});plus.setAttribute('aria-haspopup','menu');plus.setAttribute('aria-expanded','false');plusWrap.appendChild(plus);
      if(o.live){menu=ce('div','am-panel sz-m aic-plus-menu');menu.setAttribute('role','menu');menu.setAttribute('aria-label','加入檔案與工具');
        AIC_PLUS.forEach(it=>{if(it.div){const d=ce('div','am-divider');d.setAttribute('role','separator');menu.appendChild(d);return;}
          const el=amItem(it.t,{icon:PI(it.ic)});el.tabIndex=-1;el.dataset.k=it.k;
          if(it.tool){el.setAttribute('role','menuitemcheckbox');el.setAttribute('aria-checked','false');el.insertAdjacentHTML('beforeend','<span class="aic-ck">'+PI('check')+'</span>');}
          else el.setAttribute('role','menuitem');
          el.onclick=()=>{if(it.tool)setTool(it,!tools.has(it.k));else addFile(it.k==='photo'?'IMG_2481.jpg':'週末行程草稿.pdf');close(true);};menu.appendChild(el);});
        plusWrap.appendChild(menu);
        const items=()=>[...menu.querySelectorAll('.am-item')];
        const open=()=>{const box=(plusWrap.closest('.live-stage,.tac-main,.mcell')||document.body).getBoundingClientRect(),r=plus.getBoundingClientRect();
          menu.classList.toggle('is-down',r.top-box.top<menu.offsetHeight+12&&box.bottom-r.bottom>r.top-box.top);   /* 上方放不下就往下開，展開原點跟著換 */
          menu.classList.add('is-open');plus.setAttribute('aria-expanded','true');setTimeout(()=>items()[0].focus({preventScroll:true}),20);
          setTimeout(()=>document.addEventListener('pointerdown',outside),0);};
        function close(back){if(!menu.classList.contains('is-open'))return;menu.classList.remove('is-open');plus.setAttribute('aria-expanded','false');document.removeEventListener('pointerdown',outside);if(back)plus.focus({preventScroll:true});}
        function outside(e){if(!plusWrap.isConnected){document.removeEventListener('pointerdown',outside);return;}if(!plusWrap.contains(e.target))close(false);}
        plus.onclick=()=>menu.classList.contains('is-open')?close(true):open();
        menu.addEventListener('keydown',e=>{const its=items(),i=its.indexOf(document.activeElement);
          if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close(true);}
          else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();its[e.key==='ArrowDown'?(i+1)%its.length:(i<=0?its.length-1:i-1)].focus({preventScroll:true});}
          else if((e.key==='Enter'||e.key===' ')&&i>=0){e.preventDefault();its[i].click();}
          else if(e.key==='Tab')close(false);});}}
    const left=[],right=[];if(plusWrap)left.push(plusWrap);
    if(o.model!==false&&layout==='standard'){const m=aicBtn('cdl-1',{variant:'text'});m.insertAdjacentHTML('beforeend',PI('chevron-down'));m.setAttribute('aria-label','選擇模型：cdl-1');right.push(m);}
    if(o.voice!==false&&!(layout==='compact'&&state==='typing'))right.push(aicIconBtn('mic','語音輸入'));
    if(o.usage!==false&&layout==='standard'){const u=aicUsageEl();c._usage=u;right.push(u);if(o.live)send.addEventListener('click',()=>{if(!send.classList.contains('is-stop')&&!send.disabled)u._bump();});}   /* 方案使用量 */
    right.push(send);
    c.appendChild(top);
    if(layout==='standard'){c.appendChild(ta);const row=ce('div','aic-cmp-row');left.forEach(x=>row.appendChild(x));row.appendChild(ce('span','aic-cmp-sp'));right.forEach(x=>row.appendChild(x));c.appendChild(row);}
    else{const row=ce('div','aic-cmp-line');left.forEach(x=>row.appendChild(x));row.appendChild(ta);right.forEach(x=>row.appendChild(x));c.appendChild(row);}
    if(o.files)addFile('週末行程草稿.pdf');
    if(o.tools)setTool(AIC_PLUS.find(x=>x.k==='search'),true);
    syncTop();
    if(state==='disabled')c.querySelectorAll('button').forEach(b=>b.disabled=true);
    c._ta=ta;c._send=send;c._has=k=>tools.has(k);c._files=files;c._clearFiles=()=>{files.length=0;top.querySelectorAll('.aic-file').forEach(x=>x.remove());syncTop();};
    requestAnimationFrame(grow);return c;}

  /* ---------- Prompt Suggestion 建議問題：variant（膠囊／卡片）---------- */
  const AIC_SG=[{ic:'map-pin',t:'規劃行程',d:'週末兩天的台南美食路線'},{ic:'mail',t:'寫一封信',d:'向主管請兩天特休'},{ic:'file-text',t:'摘要文件',d:'把會議紀錄整理成重點'},{ic:'code-xml',t:'解釋程式碼',d:'這段 Python 在做什麼？'}];
  function aicSgEl(variant,o){o=o||{};const w=ce('div',`aic-sg v-${variant}`);w.setAttribute('role','group');w.setAttribute('aria-label','建議問題');
    AIC_SG.forEach(s=>{let b;
      if(variant==='card'){b=ce('button','aic-sg-card');b.type='button';if(o.icon!==false)b.innerHTML=PI(s.ic);const t=ce('span','aic-sg-t');t.textContent=s.t;const d=ce('span','aic-sg-d');d.textContent=s.d;b.append(t,d);}
      else b=aicBtn(s.t,{icon:o.icon!==false?s.ic:null});
      if(o.onPick)b.onclick=()=>o.onPick(s);w.appendChild(b);});
    return w;}

  /* ---------- Chat Error 對話錯誤：取用 Alert 原子，只換文案與動作 ---------- */
  const AIC_ERR={network:{i:'warning',t:'網路連線中斷',d:'訊息沒有送出，恢復連線後再試一次。',a:'重試'},
    server:{i:'error',t:'回覆時發生錯誤',d:'伺服器暫時無法處理，請稍後重新產生。',a:'重新產生'},
    'rate-limit':{i:'warning',t:'已達使用上限',d:'今天的訊息額度已用完，將在 3 小時後重置。',a:'查看方案'},
    auth:{i:'info',t:'登入已過期',d:'為了保護你的帳號，請重新登入後繼續對話。',a:'重新登入'},
    policy:{i:'warning',t:'無法回覆這個要求',d:'這個問題可能不符合使用規範，試著換個方式描述。',a:null}};
  function aicErrEl(kind,o){o=o||{};const k=AIC_ERR[kind];const a=alEl('soft',k.i,{action:!!k.a,live:!!o.live});a.classList.add('aic-err');
    const t=a.querySelector('.al-title');if(t)t.textContent=k.t;const d=a.querySelector('.al-desc');if(d)d.textContent=k.d;
    const b=a.querySelector('.al-actions .btn');if(b){b.querySelector('span').textContent=k.a;if(o.onAction)b.onclick=o.onAction;}
    return a;}

  /* ---------- 元件頁 ---------- */
  const aicDial=(id,body,render)=>{const axes=DIAL_SPECS[id].axes,zh=DIAL_SPECS[id].zh,active=CHOICE[id].active;let p=null;
    const renderM=()=>{if(!p)return;p.innerHTML='';render(p,axes,active,zh);};mountDial(body,{axes,zh,active,onRender:renderM});return{set:x=>{p=x;renderM();}};};
  const aicLab=(zh,axis,v)=>labHTML(zh[axis][v],v);
  function buildAiAvatar(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · AI Avatar',title:'AI Avatar 頭像',
      lede:'AI 回覆的身分標示，<b>圓框＋專案 logo</b>：與 <a href="#logo">Logo</a>、Header、Footer 同源，換專案 logo 時自動跟著換；內容與動態都裁在圓框內。<b>state × size（3 × 3 = 9）</b>：思考中一道光掃過、回覆中 logo 輕輕呼吸。',
      specRows:[['axes','<code>state × size</code>'],['formula','<code>3 × 3 = 9</code>'],['token-policy','<code>--panel-2 ／ --line ／ logo 資產</code>'],['code-only','掃光、呼吸等動態（Figma 用靜態 variant）']]});
    const d=aicDial('ai-avatar',body,(p,axes,active,zh)=>p.appendChild(matrixPanel({badge:'logo · 專案',name:'State × Size',rows:axes.state.filter(v=>active.state.has(v)),cols:axes.size.filter(v=>active.size.has(v)),
      rowLab:v=>aicLab(zh,'state',v),colLab:v=>aicLab(zh,'size',v),cell:(s,z)=>aiavEl(s,z),mincol:120})));
    d.set(panelsIn(section(body,'State × Size 矩陣','列＝三種狀態、欄＝三級尺寸（24／32／48px）。')));
    usageSection(body,[['待命','AI 回覆完成後，或歡迎畫面的身分標示。'],['思考中','送出訊息後、AI 還沒開始回覆的等待期。'],['回覆中','AI 正在逐字輸出回覆時。']]);
    LIVE['ai-avatar'](section(body,'互動預覽與程式碼','切狀態與尺寸，看動態。'));}
  LIVE['ai-avatar']=(host)=>mountLive(host,{gate:'ai-avatar',initial:{state:'thinking',size:'l'},
    segs:[{key:'state',label:'State',options:['idle','thinking','streaming'],labels:['待命','思考中','回覆中']},{key:'size',label:'Size',options:['s','m','l']}],
    render:st=>aiavEl(st.state,st.size),note:'系統開「減少動態」時不播動畫。'});

  function buildChatMessage(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Chat Message',title:'Chat Message 訊息',
      lede:'對話中的一則訊息。使用者靠右用泡泡，AI 用<b>頭像＋無底純文字</b>（長回覆好讀，各大 AI 產品的共通做法）。<b>role × state（2 × 3 = 6）</b>：完成、進行中（使用者＝傳送中；AI＝逐字從模糊浮現）、中斷（使用者＝沒有送出；AI＝已停止生成）。內部取用 AI Avatar、Button、Tag、Popover、Loader。',
      specRows:[['axes','<code>role × state</code>'],['formula','<code>2 × 3 = 6</code>'],['features','avatar / actions / sources / files'],['code-only','串流尾端模糊漸清、圖示切換']]});
    const d=aicDial('chat-message',body,(p,axes,active,zh)=>p.appendChild(matrixPanel({badge:'content · 完整',name:'Role × State',rows:axes.role.filter(v=>active.role.has(v)),cols:axes.state.filter(v=>active.state.has(v)),
      rowLab:v=>aicLab(zh,'role',v),colLab:v=>aicLab(zh,'state',v),cell:(r,s)=>aicMsgEl(r,s,{}),mincol:340})));
    d.set(panelsIn(section(body,'Role × State 矩陣','AI 完成的訊息下方帶操作列；倒讚會跳出回饋原因。')));
    usageSection(body,[['AI 用純文字','回覆常有條列、程式碼，不包泡泡比較好讀，也跟使用者訊息清楚區隔。'],['操作列','複製、讚／倒讚、重新產生、分享；只出現在完成的回覆。'],['來源','用了搜尋或文件時，附上來源標籤讓使用者查證。']]);
    LIVE['chat-message'](section(body,'互動預覽與程式碼','切角色與狀態、開關內容；可以按複製、讚、倒讚試試。'));}
  LIVE['chat-message']=(host)=>mountLive(host,{gate:'chat-message',initial:{role:'assistant',state:'done',avatar:true,actions:true,sources:true,files:false},
    segs:[{key:'role',label:'Role',options:['user','assistant'],labels:['使用者','AI']},{key:'state',label:'State',options:['done','pending','interrupted'],labels:['完成','進行中','中斷']}],
    bools:[{key:'avatar',label:'avatar 頭像'},{key:'actions',label:'actions 操作列'},{key:'sources',label:'sources 來源'},{key:'files',label:'files 附件'}],boolLabel:'Content',
    render:st=>{const w=ce('div');w.style.cssText='width:100%;max-width:620px;';w.appendChild(aicMsgEl(st.role,st.state,{avatar:st.avatar,actions:st.actions,sources:st.sources,files:st.files}));return w;},
    note:'avatar、actions、sources 只作用在 AI 訊息；files 只作用在使用者訊息。'});

  function buildChatThinking(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Chat Thinking',title:'Chat Thinking 思考狀態',
      lede:'送出訊息後、回覆出現前的等待提示。<b>kind × state（3 × 2 = 6）</b>：一般思考（點陣環繞＋狀態文字微光並輪流換句）、使用工具搜尋（完成後列出來源）、推理摘要（進行中兩行往上捲，完成後收成可展開的「已思考 12 秒」）。',
      specRows:[['axes','<code>kind × state</code>'],['formula','<code>3 × 2 = 6</code>'],['token-policy','<code>--muted ／ --ink</code>'],['code-only','矩陣、微光、換句、兩行捲動']]});
    const d=aicDial('chat-thinking',body,(p,axes,active,zh)=>p.appendChild(matrixPanel({badge:'status',name:'Kind × State',rows:axes.kind.filter(v=>active.kind.has(v)),cols:axes.state.filter(v=>active.state.has(v)),
      rowLab:v=>aicLab(zh,'kind',v),colLab:v=>aicLab(zh,'state',v),cell:(k,s)=>aicThinkEl(k,s),mincol:280})));
    d.set(panelsIn(section(body,'Kind × State 矩陣','進行中的狀態文字會輪流換句；推理摘要完成後收合，點標題可以展開。')));
    usageSection(body,[['思考','一般回覆的等待期，越短越好，超過幾秒再顯示文字。'],['搜尋','AI 使用網路或文件時，讓使用者知道它在查什麼。'],['推理摘要','需要較長推理的問題；完成後收合，想看的人再展開。']]);
    LIVE['chat-thinking'](section(body,'互動預覽與程式碼','切類型與狀態；推理摘要可以點開。'));}
  LIVE['chat-thinking']=(host)=>mountLive(host,{gate:'chat-thinking',initial:{kind:'reasoning',state:'done'},
    segs:[{key:'kind',label:'Kind',options:['thinking','searching','reasoning'],labels:['思考','搜尋','推理摘要']},{key:'state',label:'State',options:['active','done'],labels:['進行中','完成']}],
    render:st=>aicThinkEl(st.kind,st.state)});

  function buildChatComposer(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Chat Composer',title:'Chat Composer 輸入列',
      lede:'輸入訊息的地方。<b>layout × state（2 × 4 = 8）</b>：標準版（電腦：上面輸入、下面工具列）／精簡版（手機：一列）；生成中時<b>送出鍵變成停止鍵</b>。輸入框會隨內容長高，Enter 送出、Shift＋Enter 換行。上傳檔案、網頁搜尋等都收在<b>「＋」選單</b>（取用 <a href="#action-menu">Action Menu</a> 原子），開啟的工具以可移除的 chip 顯示。',
      specRows:[['axes','<code>layout × state</code>'],['formula','<code>2 × 4 = 8</code>'],['features','attach / tools / model / voice / files'],['token-policy','<code>--line-strong ／ --accent ／ --r-xl</code>']]});
    const d=aicDial('chat-composer',body,(p,axes,active,zh)=>p.appendChild(matrixPanel({badge:'composer',name:'State × Layout',rows:axes.state.filter(v=>active.state.has(v)),cols:axes.layout.filter(v=>active.layout.has(v)),
      rowLab:v=>aicLab(zh,'state',v),colLab:v=>aicLab(zh,'layout',v),cell:(s,l)=>{const w=ce('div');w.style.width=l==='standard'?'440px':'320px';w.appendChild(aicCmpEl(l,s,{}));return w;},mincol:340})));
    d.set(panelsIn(section(body,'State × Layout 矩陣','精簡版只留＋、語音、送出；模型選擇只在標準版。')));
    usageSection(body,[['標準版','電腦與平板；工具列放＋選單、模型選擇。'],['＋選單','上傳檔案、加入照片，以及網頁搜尋、深度思考等工具開關；不常用的操作收在這裡，輸入列保持乾淨。'],['精簡版','手機；一列輸入，鍵盤彈出時仍看得到送出鍵。'],['停用','離線、額度用完或沒有權限時，同時說明原因。']]);
    LIVE['chat-composer'](section(body,'互動預覽與程式碼','真的可以打字：輸入後送出鍵才會亮起，按 Enter 送出；按「＋」試試選單。'));}
  LIVE['chat-composer']=(host)=>mountLive(host,{gate:'chat-composer',initial:{layout:'standard',state:'empty',attach:true,tools:false,model:true,voice:true,files:false,usage:true},
    segs:[{key:'layout',label:'Layout',options:['standard','compact'],labels:['標準（電腦）','精簡（手機）']},{key:'state',label:'State',options:['empty','typing','generating','disabled'],labels:['空白','輸入中','生成中','停用']}],
    bools:[{key:'attach',label:'attach ＋選單'},{key:'tools',label:'tools 已開啟工具'},{key:'model',label:'model 模型選擇'},{key:'voice',label:'voice 語音'},{key:'files',label:'files 已附檔案'},{key:'usage',label:'usage 方案使用量'}],boolLabel:'Content',
    render:st=>{const w=ce('div');w.style.cssText='width:100%;max-width:'+(st.layout==='standard'?'560px':'360px')+';';
      const c=aicCmpEl(st.layout,st.state,{live:true,attach:st.attach,tools:st.tools,model:st.model,voice:st.voice,files:st.files,usage:st.usage});
      c._send.addEventListener('click',()=>{if(c._send.classList.contains('is-stop'))return;c._ta.value='';c._ta.dispatchEvent(new Event('input'));});w.appendChild(c);return w;},
    note:'按「＋」打開選單：上傳檔案、加入照片會出現在附件列；網頁搜尋等工具是開關，開了會變成可移除的 chip。model 只出現在標準版。'});

  function buildPromptSuggestion(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Prompt Suggestion',title:'Prompt Suggestion 建議問題',
      lede:'新對話時提供的起手問題，降低「不知道要問什麼」的門檻。<b>variant（2）</b>：膠囊（取用 Button 原子，適合輸入框上方）／卡片（標題＋說明，適合歡迎畫面）。點下去直接帶入並送出。',
      specRows:[['axes','<code>variant</code>'],['formula','<code>2</code>'],['features','icon'],['composition','chip＝Button outline s']]});
    const d=aicDial('prompt-suggestion',body,(p,axes,active)=>{const g=ce('div');g.style.cssText='display:flex;flex-direction:column;gap:var(--sp-6);width:100%;';
      axes.variant.filter(v=>active.variant.has(v)).forEach(v=>{const it=ce('div','demo-item');it.style.width='100%';it.appendChild(aicSgEl(v,{}));const c=ce('div','cap');c.innerHTML='<b>'+DIAL_SPECS['prompt-suggestion'].zh.variant[v]+' · '+v+'</b>';it.appendChild(c);g.appendChild(it);});p.appendChild(g);});
    d.set(panelsIn(section(body,'Variant 陳列','卡片在窄螢幕會自動換成兩欄。')));
    usageSection(body,[['卡片','歡迎畫面；空間足夠時說明每個問題能做什麼。'],['膠囊','對話中的追問建議，或手機上空間有限時。']]);
    LIVE['prompt-suggestion'](section(body,'互動預覽與程式碼','切樣式、開關圖示。'));}
  LIVE['prompt-suggestion']=(host)=>mountLive(host,{gate:'prompt-suggestion',initial:{variant:'card',icon:true},
    segs:[{key:'variant',label:'Variant',options:['chip','card'],labels:['膠囊','卡片']}],bools:[{key:'icon',label:'icon 圖示'}],boolLabel:'Content',
    render:st=>{const w=ce('div');w.style.cssText='width:100%;max-width:640px;';w.appendChild(aicSgEl(st.variant,{icon:st.icon}));return w;}});

  function buildChatError(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Chat Error',title:'Chat Error 對話錯誤',
      lede:'對話中常見的五種失敗。<b>kind（5）</b>：網路中斷、伺服器錯誤、用量上限、登入過期、內容規範。取用 <a href="#alert">Alert</a> 原子，標題說「發生了什麼」、內文說「接下來怎麼做」，能補救的都附上動作。',
      specRows:[['axes','<code>kind</code>'],['formula','<code>5</code>'],['composition','Alert soft ＋ Button'],['token-policy','<code>semantic.*.alert.*</code>']]});
    const d=aicDial('chat-error',body,(p,axes,active)=>{const g=ce('div');g.style.cssText='display:flex;flex-direction:column;gap:var(--sp-4);width:100%;';
      axes.kind.filter(v=>active.kind.has(v)).forEach(k=>{const it=ce('div','demo-item');it.style.width='100%';it.appendChild(aicErrEl(k,{}));const c=ce('div','cap');c.innerHTML='<b>'+DIAL_SPECS['chat-error'].zh.kind[k]+' · '+k+'</b>';it.appendChild(c);g.appendChild(it);});p.appendChild(g);});
    d.set(panelsIn(section(body,'Kind 陳列','錯誤顯示在出錯那則訊息的位置，不用彈窗打斷對話。')));
    usageSection(body,[['網路中斷','使用者訊息沒送出；保留原文，按重試直接再送。'],['伺服器錯誤','AI 回到一半失敗；提供重新產生。'],['用量上限','說明何時重置，或引導升級。'],['登入過期','保留對話內容，重新登入後繼續。'],['內容規範','不給重試，改建議換個問法。']]);
    LIVE['chat-error'](section(body,'互動預覽與程式碼','切換五種情境。'));}
  LIVE['chat-error']=(host)=>mountLive(host,{gate:'chat-error',initial:{kind:'network'},
    segs:[{key:'kind',label:'Kind',options:['network','server','rate-limit','auth','policy'],labels:['網路中斷','伺服器錯誤','用量上限','登入過期','內容規範']}],
    render:st=>{const w=ce('div');w.style.cssText='width:100%;max-width:560px;';w.appendChild(aicErrEl(st.kind,{live:true}));return w;}});

