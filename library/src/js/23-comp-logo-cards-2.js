  /* ===== Logo 品牌資產（Phase C · 專案級可替換，淺／深雙檔）=====
     PROJECT_LOGOS 依主題各存一顆；activeLogo() 取當前主題、沒有退用另一顆、再沒有回 null(CDL 字標)。三處同步、鎖寬高等比。 */
  const PROJECT_LOGOS={light:null,dark:null};
  function curTheme(){return document.documentElement.getAttribute('data-theme')||'light';}
  function activeLogo(){const t=curTheme();return PROJECT_LOGOS[t]||PROJECT_LOGOS[t==='dark'?'light':'dark']||null;}
  function refreshLogo(){
    const src=activeLogo();
    const brand=document.querySelector('.topbar .brand');
    if(!brand)return;
    const svg=brand.querySelector('svg.brand-logo');
    let img=brand.querySelector('img.brand-logo-img');
    if(src){
      if(!img){img=document.createElement('img');img.className='brand-logo-img';img.alt='Logo';brand.insertBefore(img,brand.firstChild);}
      img.src=src;img.style.display='block';
      if(svg)svg.style.display='none';
    }else{
      if(img)img.remove();
      if(svg)svg.style.display='';
    }
  }
  function applyLogo(theme,src){PROJECT_LOGOS[theme]=src||null;refreshLogo();}
  function buildLogo(view){
    view.innerHTML='<div class="block"><p class="eyebrow">Basic</p><h1>Logo 品牌標誌</h1>'
      +'<p class="lede">專案級可替換品牌標誌，<b>淺色／深色主題各一顆</b>。上傳後<b>同步替換三處</b>：網站 topbar、library Header、library Footer，並依當前主題自動切換。<b>鎖寬度、高度等比縮放</b>。存於專案狀態，匯出／bake 時以 data URI 內嵌。</p>'
      +'<div class="head-rule"></div></div>';
    const wrap=ce('div','block');
    const slots=ce('div','logo-slots');
    function slot(theme,label,hint){
      const cell=ce('div','logo-slot lp-'+theme);
      cell.innerHTML='<div class="ls-top"><span class="ls-title">'+label+'</span></div>'
        +'<div class="ls-prev"><span class="lp-logo lp-lg"></span></div>'
        +'<span class="ls-hint">'+hint+'</span>';
      const top=cell.querySelector('.ls-top'), prevLogo=cell.querySelector('.lp-logo');
      function paint(){const src=PROJECT_LOGOS[theme];prevLogo.innerHTML=src?('<img src="'+src+'" alt="Logo">'):HDR_LOGO;cell.classList.toggle('is-empty',!src);}
      /* 用 library mkBtn 原子（isLive→真 :hover/:active），僅換文字＝比照 library 完整互動契約，不手拼 class */
      const upBtn=mkBtn({variant:'solid',intent:'primary',size:'s',isLive:true});upBtn.type='button';upBtn.querySelector('span').textContent='上傳';
      const file=document.createElement('input');file.type='file';file.accept='image/svg+xml,image/png,image/jpeg,image/webp';file.hidden=true;
      upBtn.onclick=()=>file.click();
      file.onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{applyLogo(theme,r.result);paint();};r.readAsDataURL(f);};
      const clrBtn=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});clrBtn.type='button';clrBtn.querySelector('span').textContent='清除';
      clrBtn.onclick=()=>{applyLogo(theme,null);paint();};
      top.append(upBtn,clrBtn,file);
      paint();
      return cell;
    }
    slots.appendChild(slot('light','淺色主題 Logo','用於淺色背景。'));
    slots.appendChild(slot('dark','深色主題 Logo','用於深色背景；未設定時自動用淺色那顆替代。'));
    wrap.appendChild(slots);
    const note=ce('p','logo-note');note.innerHTML='⚠ topbar 依當前主題自動切換對應 logo；未設定的主題會退用另一顆。都未上傳時維持 CDL 字標（會跟著主題反白）。切右上角深淺色可即時預覽。';
    wrap.appendChild(note);
    view.appendChild(wrap);
  }
  /* ==================== CARDS:round2-v1 · Card 卡片第二批（2026-11-03）====================
     person-card／profile-card／metric-card／invite-card／widget-card。依設計主管核可的提案（Round 2）實作。
     內部一律取用既有原子（鐵則 5）：mkBtn（按鈕）、avtEl（頭像，image 來源走 o.src）、tagEl（標籤）、sgmEl（分段）、
     .field（輸入框）、amPanel/amItem 樣式（角色選單）、empEl（空狀態）、lnk（連結）、chtxRoll（數字滾動）。卡片內容文字維持英文（提案原文）。 */
  /* 新增 PulsoIcon icon（官方 SVG：caret-right／link／seal-check-fill／person-simple-walk／fire／gauge／chat-centered-text）；其餘重用既有 IC_* */
  const IC_CARET_RIGHT=PI('chevron-right');
  const IC_LINK=PI('link');
  const IC_SEAL_CHECK=PI('badge-check',{solid:1});
  const IC_WALK=PI('person-standing');
  const IC_FIRE=PI('flame');
  const IC_GAUGE=PI('gauge');
  const IC_CHAT_TEXT=PI('message-square-text');
  /* 卡片照片（data URI 內嵌，離線與 artifact 預覽可用）。原檔在 library/assets/photos/：
     CARD_PHOTO＝person-card 主照，取自 sunglasses-portrait.webp（16）；CARD_COVER＝profile-card image 封面，dusk-white-set.webp（15）上方天空裁切；
     CARD_AV＝5 張頭像 96px 臉部裁切，依序 city-monochrome（12）／white-suit-night（13）／field-grey-suit（14）／dusk-white-set（15）／sunglasses-portrait（16）。 */
  const CARD_PHOTO=cdlAsset('img/card-photo.jpg');
  const PSC_ROT=[cdlAsset('img/person-rot-1.jpg'),cdlAsset('img/person-rot-2.jpg'),cdlAsset('img/person-rot-3.jpg')];  /* 人物牌卡輪播用的站內人像（assets/photos 裁成 1:1.08、420px） */
  const CARD_COVER=cdlAsset('img/card-cover.jpg');
  const CRD_PEOPLE=['王大明','林語晨','陳美華','張雅婷','陳凱'];   /* LOC-SRC:v2 */
  const crdReduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const crdFmt=n=>Math.round(n).toLocaleString('en-US');
  /* 頭像：Avatar 原子（image 內容），照片取 CARD_AV */
  function crdAv(i,size,o){o=o||{};return avtEl(size,'circle','image',{src:CARD_AV[i%CARD_AV.length],name:o.name||CRD_PEOPLE[i%CRD_PEOPLE.length],status:o.status||null});}
  /* 按鈕：Button 原子（mkBtn），換成卡片自己的文字／icon */
  function crdBtn(variant,intent,size,label,icon,o){o=o||{};const b=mkBtn({variant,intent,size,isLive:!!o.live,iconOnly:!!o.iconOnly,shape:o.shape});b.type=o.type||'button';
    if(o.iconOnly){b.innerHTML=icon;b.setAttribute('aria-label',label);}else b.innerHTML=(icon||'')+'<span>'+label+'</span>'+(o.trail||'');return b;}
  function crdBtnSet(b,variant,intent){b.className=b.className.replace(/\bv-[a-z]+/,'v-'+variant).replace(/\bi-[a-z]+/,'i-'+intent);}
  function crdTag(text,variant,intent,extra){const t=tagEl(variant||'soft',intent||'neutral','default');t.querySelector('span').textContent=text;if(extra)t.classList.add(extra);return t;}

  /* ---------- PERSON CARD 照片人物卡 ---------- */
  function pscEl(state,size,o){o=o||{};const S=size==='s';let on=state==='added';
    const c=ce('article','psc psc-sz-'+size+(o.live?' live':''));c.setAttribute('aria-label','陳凱');
    const ph=ce('div','psc-photo');const img=document.createElement('img');img.src=CARD_PHOTO;img.alt='陳凱的照片';img.decoding='async';ph.appendChild(img);
    if(o.tags!==false){const tg=ce('div','psc-tags');(S?['可合作','設計師']:['可合作','設計師','台北'])   /* LOC-SRC:v1 */.forEach((t,i)=>{const x=crdTag(t,'soft','neutral','tg-frost');
      if(i===0)x.insertAdjacentHTML('afterbegin','<i class="psc-dot" aria-hidden="true"></i>');tg.appendChild(x);});ph.appendChild(tg);}
    c.appendChild(ph);
    const ft=ce('div','psc-foot');const who=ce('div','psc-who');who.appendChild(crdAv(3,S?'s':'m',{status:'online'}));
    const tx=ce('div');tx.innerHTML='<b>@tina.chang</b><span>12 分鐘前</span>';who.appendChild(tx);ft.appendChild(who);
    const b=crdBtn('solid','primary','s','加入成員',IC_PLUS,{live:o.live,iconOnly:S});b.classList.add('psc-add');
    const paint=()=>{crdBtnSet(b,on?'outline':'solid',on?'secondary':'primary');b.setAttribute('aria-pressed',String(on));const lab=on?'已加入':'加入成員',ic=on?IC_CHECK:IC_PLUS;
      if(S){b.innerHTML=ic;b.setAttribute('aria-label',lab);}else b.innerHTML=ic+'<span>'+lab+'</span>';};
    paint();
    if(o.live)b.onclick=()=>{on=!on;paint();b.classList.remove('psc-pop');void b.offsetWidth;b.classList.add('psc-pop');if(o.onChange)o.onChange();};
    ft.appendChild(b);c.appendChild(ft);return c;}
  LIVE['person-card']=(host)=>mountLive(host,{gate:'person-card',initial:{state:'default',size:'m',tags:true},
    segs:[{key:'state',label:'State',options:['default','added'],labels:['預設','已加入']},{key:'size',label:'Size',options:['s','m']}],
    bools:[{key:'tags',label:'tags 照片標籤'}],boolLabel:'Content',
    render:(st,sync)=>pscEl(st.state,st.size,{live:true,tags:st.tags,onChange:sync}),
    note:'點「Add member」切換成「Added」：文字與 icon 一起換、按鈕從實心變外框；精簡 s 只留 icon（aria-label 跟著換）。滑過照片會微微放大，「Available」的綠點持續脈動。'});
  function buildPersonCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Person Card',title:'Person Card 照片人物卡',
      lede:'大張人物照＋左上角標籤＋底部「誰新增的」與加入按鈕。內部全數取用原子：<a href="#tag">tag</a>（照片上的白色磨砂標籤）、<a href="#avatar">avatar</a>（照片頭像＋在線點）、<a href="#button">button</a>（加入成員）。兩種狀態 × 兩級尺寸（<b>2 × 2 = 4</b>），標籤為 boolean。',
      specRows:[['axes','<code>state × size</code>'],['formula','<code>2 × 2 = 4</code>'],['boolean','<code>tags</code>'],['atoms','<code>.tg · avtEl · .btn</code>'],['token-policy','<code>semantic.*.card.* · radius.lg / md</code>']]});
    const STN={default:['預設','default'],added:['已加入','added']},SZN={m:['標準','m · 300'],s:['精簡','s · 240']};
    const axes=DIAL_SPECS['person-card'].axes,zh=DIAL_SPECS['person-card'].zh,active=CHOICE['person-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ss=axes.state.filter(v=>active.state.has(v)),zs=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'tags · on',name:'State × Size',rows:ss,cols:zs,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:z=>labHTML(SZN[z][0],SZN[z][1]),cell:(s,z)=>pscEl(s,z,{}),mincol:300}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','已加入＝按鈕換成外框＋勾勾；精簡 s 的按鈕只留 icon、標籤只放前兩個。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>tags</code> 對應 Figma boolean property：標籤列整排開／關，不影響照片比例。');
    capRow(cs,[['tags = true',pscEl('default','s',{})],['tags = false',pscEl('default','s',{tags:false})]]);
    usageSection(body,[['用 Person Card','成員邀請、創作者推薦、團隊介紹等「臉比名字重要」的情境。'],['改用 List Item','一次要列很多人、需要比對資訊時；照片卡太佔空間。'],['標籤','最多三個，第一個放狀態（Available）；照片上的標籤一律用白色磨砂底，任何照片都讀得到。']]);
    const sl=section(body,'互動預覽與程式碼','點按鈕加入／取消；滑過照片看放大。');LIVE['person-card'](sl);
  }

  /* ---------- PROFILE CARD 品牌檔案卡 ---------- */
  let BPF_SEQ=0;
  function bpfCover(cover){const cv=ce('div','bpf-cover bpf-cv-'+cover);
    if(cover==='graphic'){const id='bpfg'+(++BPF_SEQ);
      cv.innerHTML=`<svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop class="g-s0" offset="0"/><stop class="g-s1" offset="1"/></linearGradient></defs>
        <rect class="g-deep" width="320" height="160"/><path d="M0 0h230c22 0 30 22 16 38L170 118H0z" fill="url(#${id})"/><path class="g-deep" d="M0 118h320v60H0z"/><path class="g-deep" d="M170 118 246 38c10-12 30-18 74-18v98z"/><path d="M120 178l58-60h142v60z" fill="url(#${id})"/></svg>`;}
    else if(cover==='image'){const i=document.createElement('img');i.src=CARD_COVER;i.alt='';i.decoding='async';cv.appendChild(i);}
    return cv;}
  function bpfEl(cover,state,o){o=o||{};let following=state==='following';let n=23140+(following?1:0);
    const c=ce('article','bpf'+(o.live?' live':''));c.setAttribute('aria-label','Lumen Studio');
    const cv=bpfCover(cover);c.appendChild(cv);
    const b=ce('div','bpf-b');const top=ce('div','bpf-top');const logo=ce('span','bpf-logo');
    logo.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 8h20a4 4 0 0 1 0 8H16l-8 8z"/><path d="M32 32H12a4 4 0 0 1 0-8h12l8-8z"/></svg>';
    const fb=crdBtn('solid','primary','s','追蹤',null,{live:o.live});top.append(logo,fb);b.appendChild(top);
    const nm=ce('div','bpf-name');nm.appendChild(document.createTextNode('Lumen Studio'));
    if(o.verified!==false){const v=ce('span','bpf-ver');v.innerHTML=IC_SEAL_CHECK;v.setAttribute('role','img');v.setAttribute('aria-label','已認證');nm.appendChild(v);}
    const hd=ce('div','bpf-handle');hd.textContent='@lumen.studio';
    const bio=ce('p','bpf-bio');bio.textContent='每次都準時交付，讓每份設計都和程式碼保持同步。';
    const sts=ce('div','bpf-stats');sts.innerHTML='<span><b>431</b>追蹤中</span><span><b class="bpf-fc"></b>粉絲</span>';
    const fc=chtxRoll(crdFmt(n));sts.querySelector('.bpf-fc').appendChild(fc);
    const ln=lnkEl('inline','default',{bare:true,text:'lumen.studio'});ln.classList.add('bpf-link');ln.insertAdjacentHTML('afterbegin',`<span class="lnk-ic">${IC_LINK}</span>`);
    b.append(nm,hd,bio,sts,ln);c.appendChild(b);
    const paint=()=>{crdBtnSet(fb,following?'outline':'solid',following?'secondary':'primary');fb.querySelector('span').textContent=following?'追蹤中':'追蹤';fb.setAttribute('aria-pressed',String(following));};
    paint();
    if(o.live){fb.onclick=()=>{following=!following;n+=following?1:-1;paint();chtxSetRoll(fc,crdFmt(n));if(o.onChange)o.onChange();};
      const art=cv.firstElementChild;
      c.addEventListener('pointermove',e=>{if(crdReduce()||!art)return;const r=c.getBoundingClientRect();art.style.transform=`translate(${((e.clientX-r.left)/r.width-.5)*-12}px,${((e.clientY-r.top)/r.height-.5)*-8}px)`;});
      c.addEventListener('pointerleave',()=>{if(art)art.style.transform='';});}
    return c;}
  LIVE['profile-card']=(host)=>mountLive(host,{gate:'profile-card',initial:{cover:'graphic',state:'default',verified:true},
    segs:[{key:'cover',label:'Cover',options:['graphic','image','color'],labels:['圖形','照片','純色']},{key:'state',label:'State',options:['default','following'],labels:['預設','追蹤中']}],
    bools:[{key:'verified',label:'verified 認證徽章'}],boolLabel:'Content',
    render:(st,sync)=>bpfEl(st.cover,st.state,{live:true,verified:st.verified,onChange:sync}),
    note:'點 Follow → Following：按鈕從實心變外框，追蹤者數字逐位滾動 +1。滑過卡片時封面跟著游標反向微移、Logo 輕轉（減少動態設定下關閉）。'});
  function buildProfileCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Profile Card',title:'Profile Card 品牌檔案卡',
      lede:'品牌或創作者的檔案卡：封面＋壓在封面上的圓形 Logo＋名稱、簡介、追蹤數與連結。追蹤按鈕取用 <a href="#button">button</a>、連結取用 <a href="#link">link</a>、追蹤數用圖表的數字滾動。三種封面 × 兩種狀態（<b>3 × 2 = 6</b>），認證徽章為 boolean。',
      specRows:[['axes','<code>cover × state</code>'],['formula','<code>3 × 2 = 6</code>'],['boolean','<code>verified</code>'],['atoms','<code>.btn · .lnk · chtxRoll · icon</code>'],['token-policy','<code>primitive.violet（封面／徽章）· semantic.*.card.*</code>']]});
    const CVN={graphic:['圖形','graphic'],image:['照片','image'],color:['純色','color']},STN={default:['預設','default'],following:['追蹤中','following']};
    const axes=DIAL_SPECS['profile-card'].axes,zh=DIAL_SPECS['profile-card'].zh,active=CHOICE['profile-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const cs=axes.cover.filter(v=>active.cover.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'verified · on',name:'Cover × State',rows:cs,cols:ss,rowLab:x=>labHTML(CVN[x][0],CVN[x][1]),colLab:x=>labHTML(STN[x][0],STN[x][1]),cell:(cv,s)=>bpfEl(cv,s,{}),mincol:330}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Cover × State 矩陣','封面三種：品牌圖形、照片、純色（都綁 violet 色階，不寫死色值）。追蹤中＝按鈕外框、數字 +1。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>verified</code> 對應 Figma boolean property：名稱後的認證徽章。');
    capRow(cs,[['verified = true',bpfEl('color','default',{})],['verified = false',bpfEl('color','default',{verified:false})]]);
    usageSection(body,[['用 Profile Card','品牌頁、創作者推薦、搜尋結果中的帳號卡。'],['改用 Hover Card','只是滑過人名時的快速預覽，不需要封面。'],['封面','有品牌主視覺用 graphic；有活動照用 image；兩者都沒有就用 color，別放模糊的佔位圖。']]);
    const sl=section(body,'互動預覽與程式碼','按 Follow 看數字滾動；滑過卡片看封面視差。');LIVE['profile-card'](sl);
  }

  /* ---------- METRIC CARD 指標週卡 ---------- */
  const MTC_DATA={'daily-bar':{k:'步行',ic:()=>IC_WALK,unit:'步',kind:'daily',w:[7800,6900,9600,11200,8400,9100,8700,10300]},
    'weekly-bar':{k:'活動消耗',ic:()=>IC_FIRE,unit:'kcal',kind:'weekly',w:[980,760,1420,1610,1120,1050,1780,1245]},
    line:{k:'體重',ic:()=>IC_GAUGE,unit:'kg',kind:'line',w:[71.2,70.6,71.0,72.4,74.1,73.6,75.0,75.2],dec:1},
    sleep:{k:'睡眠',ic:()=>IC_MOON,unit:'',kind:'weekly',w:[412,368,446,472,421,418,502,454],time:true}};
  function mtcEl(chart,tone,o){o=o||{};const m=MTC_DATA[o.metric||chart],NS='http://www.w3.org/2000/svg';let sel=o.week==null?7:o.week;
    const c=ce('article','mtc mtc-c-'+chart+' mtc-t-'+tone+(o.live?' live':''));c.setAttribute('aria-label',m.k+'，近 8 週');   /* LOC-SRC:v1 原文改中文，英日文走字典 */
    const h=ce('div','mtc-h');h.innerHTML=`<span class="mtc-ic" aria-hidden="true">${m.ic()}</span><span class="mtc-k">${m.k}</span><span class="mtc-sub">近 8 週</span>`;
    h.appendChild(crdBtn('text','secondary','s','查看'+m.k+'詳情',IC_CARET_RIGHT,{iconOnly:true,live:o.live}));c.appendChild(h);
    const lab=ce('div','mtc-l');const nb=ce('div','mtc-n');c.append(lab,nb);
    const fmtV=v=>m.dec?v.toFixed(m.dec):crdFmt(v);let rr,rh,rm;
    const sm=t=>{const s=ce('small');s.textContent=t;return s;};
    if(m.time){rh=chtxRoll('7');rm=chtxRoll('34');nb.append(rh,sm('小時'),rm,sm('分'));}else{rr=chtxRoll(fmtV(m.w[sel]));nb.appendChild(rr);if(m.unit)nb.appendChild(sm(m.unit));}
    const plot=ce('div','mtc-plot');const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 320 96');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');plot.appendChild(svg);c.appendChild(plot);
    const mk=(t,a,cls)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(cls)e.setAttribute('class',cls);svg.appendChild(e);return e;};
    const avg=m.w.reduce((a,b)=>a+b,0)/8,line=m.kind==='line';
    const lo=line?Math.min(...m.w)-2:0,hi=line?Math.max(...m.w)+1:Math.max(...m.w)*1.08;const Y=v=>90-(v-lo)/(hi-lo)*84;
    const colW=40,els=[];let band=null;
    if(m.kind==='daily'){let seed=7;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
      for(let w=0;w<8;w++)for(let d=0;d<7;d++){const v=Math.min(m.w[w]*(.55+rnd()*.9),hi),x=w*colW+4+d*(colW-8)/7;
        const bw=(colW-8)/7-1.6,r=mk('path',{d:chtxBarTop(+x.toFixed(1),+Y(v).toFixed(1),bw,90-Y(v),chtxR())},'b');r.dataset.w=w;els.push(r);}}
    else if(m.kind==='weekly'){m.w.forEach((v,w)=>{const r=mk('path',{d:chtxBarTop(w*colW+5,+Y(v).toFixed(1),colW-10,90-Y(v),chtxR())},'b');r.dataset.w=w;els.push(r);});}
    else{band=mk('rect',{y:0,height:96,width:colW-6,rx:chtxR()},'mtc-band');
      const pts=m.w.map((v,w)=>[w*colW+colW/2,Y(v)]);let d='M'+pts[0];for(let i=1;i<8;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],mx=(x0+x1)/2;d+=` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;}
      mk('path',{d,'vector-effect':'non-scaling-stroke'},'mtc-path');
      pts.forEach(([x,y],w)=>{const e=mk('ellipse',{cx:x,cy:y.toFixed(1),rx:3,ry:3.2},'mtc-dot');e.dataset.w=w;els.push(e);});}
    const ay=Y(avg);mk('line',{x1:0,x2:320,y1:ay.toFixed(1),y2:ay.toFixed(1),'vector-effect':'non-scaling-stroke'},'mtc-avgline');
    const al=ce('div','mtc-avg');al.style.top=(ay/96*100).toFixed(1)+'%';
    al.innerHTML=(m.time?`${Math.floor(avg/60)}:${String(Math.round(avg%60)).padStart(2,'0')}`:m.dec?avg.toFixed(m.dec):crdFmt(avg))+' <span>平均</span>';plot.appendChild(al);
    function pick(w){sel=w;els.forEach(e=>{const on=+e.dataset.w===w;if(e.tagName==='ellipse'){e.setAttribute('rx',on?5.5:3);e.setAttribute('ry',on?5.8:3.2);}else e.classList.toggle('on',on);});
      if(band)band.setAttribute('x',w*colW+3);
      const v=m.w[w];if(m.time){chtxSetRoll(rh,String(Math.floor(v/60)));chtxSetRoll(rm,String(v%60).padStart(2,'0'));}else chtxSetRoll(rr,fmtV(v));
      lab.textContent=w===7?'本週平均':'第 '+(w+1)+' 週平均';}
    const sg=sgmEl('soft','s',{items:['1','2','3','4','5','6','7','8'],active:sel,full:true,live:!!o.live,label:'選擇週次',onChange:pick});sg.classList.add('mtc-x');
    sg.querySelectorAll('.sgm-it').forEach((b,i)=>b.setAttribute('aria-label','第 '+(i+1)+' 週'));c.appendChild(sg);
    pick(sel);return c;}
  LIVE['metric-card']=(host)=>mountLive(host,{gate:'metric-card',initial:{chart:'weekly-bar',tone:'brand'},
    segs:[{key:'chart',label:'Chart',options:['daily-bar','weekly-bar','line'],labels:['每日長條','每週長條','折線']},{key:'tone',label:'Tone',options:['brand','info','success','violet'],labels:['品牌橘','資訊藍','成功綠','紫']}],
    render:st=>mtcEl(st.chart,st.tone,{live:true}),
    note:'點下方週數（或聚焦後用 ← / →）：該週轉實心、其他週變淡，上方數字逐位滾到該週。滑過或聚焦卡片才顯示平均線的數值標籤。'});
  function buildMetricCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Metric Card',title:'Metric Card 指標週卡',
      lede:'一張卡看一個指標的近 8 週：標題＋本週平均＋小圖表＋週選擇。週選擇取用 <a href="#segmented">segmented</a>（透明版、滑動膠囊）、數字滾動與系列色沿用 <a href="#chart">chart</a>（<code>--accent2</code>／<code>--s-chart-2..4</code>）、右上角取用 <a href="#button">button</a>。三種圖 × 四種色調（<b>3 × 4 = 12</b>）。',
      specRows:[['axes','<code>chart × tone</code>'],['formula','<code>3 × 4 = 12</code>'],['atoms','<code>sgmEl · chtxRoll · .btn · icon</code>'],['token-policy','<code>--accent2 · semantic.chart.2–4</code>'],['features','week pick / keyboard / avg line']]});
    const CN={'daily-bar':['每日長條','daily-bar'],'weekly-bar':['每週長條','weekly-bar'],line:['折線','line']},TN={brand:['品牌橘','brand'],info:['資訊藍','info'],success:['成功綠','success'],violet:['紫','violet']};
    const axes=DIAL_SPECS['metric-card'].axes,zh=DIAL_SPECS['metric-card'].zh,active=CHOICE['metric-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const cs=axes.chart.filter(v=>active.chart.has(v)),ts=axes.tone.filter(v=>active.tone.has(v));
      p.appendChild(matrixPanel({badge:'week · 8（本週）',name:'Chart × Tone',rows:cs,cols:ts,rowLab:x=>labHTML(CN[x][0],CN[x][1]),colLab:x=>labHTML(TN[x][0],TN[x][1]),cell:(ch,t)=>mtcEl(ch,t,{}),mincol:340}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Chart × Tone 矩陣','每日長條＝一週 7 根細條；每週長條＝一週一根；折線＝選中週加底色欄。色調只換 --mc，一顆元件四種系列色。');p=panelsIn(sec);renderM();
    const sw=section(body,'Showcase 範例','提案核可的四張組合（可直接操作）：步行、活動消耗、睡眠（時:分 格式）、體重。');
    const g=ce('div','mtc-grid');[['daily-bar','info'],['weekly-bar','brand'],['weekly-bar','violet','sleep'],['line','success']].forEach(([ch,t,mt])=>g.appendChild(mtcEl(ch,t,{live:true,metric:mt})));
    const rd=ce('div','row-demo');rd.appendChild(g);sw.appendChild(rd);
    usageSection(body,[['用 Metric Card','儀表板上「這週 vs 前幾週」的單一指標，使用者想點回某一週看細節。'],['改用 Chart','要比多條系列、或需要座標軸與 tooltip 精讀數值。'],['色調','同一頁的多張卡各用不同 tone 區分指標；brand 留給最重要的那張。']]);
    const sl=section(body,'互動預覽與程式碼','點週數或用方向鍵切換。');LIVE['metric-card'](sl);
  }

  /* ---------- INVITE CARD 邀請協作卡 ---------- */
  const IVC_ROLES=['可編輯','可檢視'],IVC_ACC=['僅限成員','知道連結的人都能檢視','知道連結的人都能編輯'];   /* LOC-SRC:v2 */
  const IVC_MEMBERS=[[0,'王大明','daming@goons.design','可編輯','online'],[2,'陳美華','meihua@goons.design','可檢視','busy'],[3,'張雅婷','yating@goons.design','可編輯','online']];
  function ivcCloseMenus(scope,except){(scope||document).querySelectorAll('.ivc-role.open').forEach(r=>{if(r===except)return;r.classList.remove('open');r.firstElementChild.setAttribute('aria-expanded','false');});}
  function ivcEmpty(){const e=empEl('first','s',{primary:false,secondary:false});e.querySelector('.emp-ic').innerHTML=IC_USERS;
    e.querySelector('.emp-title').textContent='還沒有成員';e.querySelector('.emp-desc').textContent='用 email 邀請，成員就會出現在這裡。';return e;}
  function ivcEl(layout,members,o){o=o||{};const L=!!o.live;
    const c=ce('div','ivc ivc-ly-'+layout+(L?' live':''));c.setAttribute('role',layout==='modal'?'dialog':'region');c.setAttribute('aria-label','邀請協作者');
    if(layout==='modal'){const h=ce('div','ivc-h');const t=ce('b');t.textContent='邀請協作者';h.append(t,crdBtn('text','secondary','s','關閉',IC_CLOSE,{iconOnly:true,live:L}));c.appendChild(h);}
    const b=ce('div','ivc-b');c.appendChild(b);
    if(layout==='card'){const hd=ce('div','ivc-hd');hd.innerHTML='<b>Invite collaborators</b><span>Share this project with your team.</span>';b.appendChild(hd);}
    const f=ce('form','ivc-in');f.noValidate=true;
    const fld=ce('label','field v-outline'+(L?' live-field':''));fld.innerHTML='<input class="bare" type="email" placeholder="輸入 email 或名稱…" aria-label="Email 或名稱" autocomplete="off">';
    f.append(fld,crdBtn('solid','primary','m','送出邀請',null,{live:L,type:'submit'}));
    const err=ce('div','ivc-err');err.setAttribute('aria-live','polite');
    const sh=ce('div','ivc-share');const shl=ce('div');const sb=ce('b');sb.textContent='分享連結';
    let acc=1;const ab=crdBtn('text','secondary','s',IVC_ACC[acc],null,{live:L,trail:IC_CARET_DOWN});ab.classList.add('ivc-acc');shl.append(sb,ab);
    const cp=crdBtn('outline','secondary','s','複製',AM_IC_COPY,{live:L});cp.classList.add('ivc-copy');sh.append(shl,cp);
    const mm=ce('div','ivc-m');const mh=ce('span','ivc-mh');mh.textContent='目前成員';const list=ce('div','ivc-list');mm.append(mh,list);
    b.append(f,err,sh,mm);
    const syncEmpty=()=>{const rows=list.querySelectorAll('.ivc-row:not(.is-out)').length;const em=list.querySelector('.emp');if(!rows&&!em)list.appendChild(ivcEmpty());if(rows&&em)em.remove();};
    function row(i,name,email,role,status,isNew){const r=ce('div','ivc-row'+(isNew?' is-in':''));r.appendChild(crdAv(i,'m',{name,status}));
      const tx=ce('div');const nb=ce('b');const nn=ce('span','ivc-nm');nn.textContent=name;nb.appendChild(nn);if(isNew)nb.appendChild(crdTag('已邀請','soft','neutral'));
      const em=ce('span','ivc-em');em.textContent=email;tx.append(nb,em);r.appendChild(tx);
      const rb=ce('div','ivc-role');let cur=role;const btn=crdBtn('text','secondary','s',cur,null,{live:L,trail:IC_CARET_DOWN});btn.setAttribute('aria-haspopup','menu');btn.setAttribute('aria-expanded','false');
      const menu=ce('div','am-panel sz-s ivc-menu');menu.setAttribute('role','menu');menu.setAttribute('aria-label',name+' 的角色');
      const draw=()=>{btn.querySelector('span').textContent=cur;menu.innerHTML='';
        IVC_ROLES.forEach(x=>{const it=amItem(x,{});it.setAttribute('role','menuitemradio');it.setAttribute('aria-checked',String(x===cur));it.tabIndex=-1;it.dataset.role=x;if(x===cur)it.insertAdjacentHTML('beforeend',`<span class="ivc-ck">${ICON_CHECK}</span>`);menu.appendChild(it);});
        const dv=ce('div','am-divider');dv.setAttribute('role','separator');menu.appendChild(dv);const rm=amItem('移除',{danger:true});rm.setAttribute('role','menuitem');rm.tabIndex=-1;rm.dataset.rm='1';menu.appendChild(rm);};
      draw();rb.append(btn,menu);r.appendChild(rb);
      if(L){const items=()=>[...menu.querySelectorAll('.am-item')];
        const close=back=>{rb.classList.remove('open');btn.setAttribute('aria-expanded','false');if(back)btn.focus();};
        btn.onclick=e=>{e.stopPropagation();const op=!rb.classList.contains('open');ivcCloseMenus(c,rb);rb.classList.toggle('open',op);btn.setAttribute('aria-expanded',String(op));if(op&&e.detail===0)items()[0].focus();};
        const act=it=>{if(it.dataset.rm){close(false);r.classList.add('is-out');setTimeout(()=>{r.remove();syncEmpty();if(o.onChange)o.onChange();},crdReduce()?0:240);return;}cur=it.dataset.role;draw();close(true);if(o.onChange)o.onChange();};
        menu.onclick=e=>{const it=e.target.closest('.am-item');if(!it)return;e.stopPropagation();act(it);};
        rb.addEventListener('keydown',e=>{if(!rb.classList.contains('open'))return;const its=items(),k=its.indexOf(document.activeElement);
          if(e.key==='Escape'){e.preventDefault();close(true);}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();its[(k+(e.key==='ArrowDown'?1:its.length-1))%its.length].focus();}
          else if((e.key==='Enter'||e.key===' ')&&k>=0){e.preventDefault();act(its[k]);}});}
      return r;}
    if(members==='list')IVC_MEMBERS.forEach(a=>list.appendChild(row(...a)));
    syncEmpty();
    if(L){let k=4;
      if(!window.__ivcDoc){window.__ivcDoc=true;document.addEventListener('click',e=>{document.querySelectorAll('.ivc-role.open').forEach(r=>{if(!r.contains(e.target)){r.classList.remove('open');r.firstElementChild.setAttribute('aria-expanded','false');}});});}
      ab.onclick=()=>{acc=(acc+1)%IVC_ACC.length;ab.querySelector('span').textContent=IVC_ACC[acc];};
      let ct=null;const cpl=d=>{cp.innerHTML=(d?ICON_CHECK:AM_IC_COPY)+'<span>'+(d?'已複製':'複製')+'</span>';};
      cp.onclick=()=>{try{navigator.clipboard&&navigator.clipboard.writeText('https://goons.design/invite/ds-2026').catch(()=>{});}catch(e){}cpl(true);clearTimeout(ct);ct=setTimeout(()=>cpl(false),1600);};
      const inp=fld.querySelector('input');
      f.addEventListener('submit',e=>{e.preventDefault();const v=inp.value.trim(),ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        if(!ok){fld.classList.remove('st-error');void fld.offsetWidth;fld.classList.add('st-error');err.textContent=v?'請輸入有效的 email，例如 name@company.com':'請先輸入 email';inp.focus();return;}
        fld.classList.remove('st-error');err.textContent='';list.prepend(row(k++,v.split('@')[0],v,'可檢視','away',true));syncEmpty();inp.value='';if(o.onChange)o.onChange();});
      inp.addEventListener('input',()=>{fld.classList.remove('st-error');err.textContent='';});}
    return c;}
  LIVE['invite-card']=(host)=>mountLive(host,{gate:'invite-card',initial:{layout:'modal',members:'list'},
    segs:[{key:'layout',label:'Layout',options:['card','modal'],labels:['頁內卡片','對話框']},{key:'members',label:'Members',options:['empty','list'],labels:['空','成員清單']}],
    render:(st,sync)=>ivcEl(st.layout,st.members,{live:true,onChange:sync}),
    note:'輸入 email 按「送出邀請」：新成員從上方滑入並標「已邀請」；格式不對時欄位抖一下並顯示提示。點連結權限可切換三種存取範圍；「複製」→「已複製」。每位成員的角色選單可改「可編輯／可檢視」或「移除」（↑↓ 移動、Enter 選、Esc 關閉）；全部移除後出現空狀態。'});
  function buildInviteCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Invite Card',title:'Invite Card 邀請協作卡',
      lede:'邀請協作者的卡片：email 輸入＋送出、分享連結與權限、目前成員與角色。全部取用原子：<a href="#input">input</a>（.field）、<a href="#button">button</a>、<a href="#avatar">avatar</a>、<a href="#tag">tag</a>（Invited）、<a href="#action-menu">action-menu</a>（角色選單）、<a href="#empty">empty</a>（沒有成員）。兩種版型 × 兩種成員狀態（<b>2 × 2 = 4</b>）。',
      specRows:[['axes','<code>layout × members</code>'],['formula','<code>2 × 2 = 4</code>'],['atoms','<code>.field · .btn · avtEl · .tg · am-panel · empEl</code>'],['token-policy','<code>semantic.*.card.* · elevation.xl（modal）</code>'],['features','validate / copy / role menu / remove']]});
    const LN={card:['頁內卡片','card'],modal:['對話框','modal']},MN={empty:['空','empty'],list:['成員清單','list']};
    const axes=DIAL_SPECS['invite-card'].axes,zh=DIAL_SPECS['invite-card'].zh,active=CHOICE['invite-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ls=axes.layout.filter(v=>active.layout.has(v)),ms=axes.members.filter(v=>active.members.has(v));
      p.appendChild(matrixPanel({badge:'invite-card',name:'Layout × Members',rows:ls,cols:ms,rowLab:x=>labHTML(LN[x][0],LN[x][1]),colLab:x=>labHTML(MN[x][0],MN[x][1]),cell:(l,m)=>ivcEl(l,m,{}),mincol:460}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Layout × Members 矩陣','對話框＝標題列＋關閉鈕＋分隔線、陰影加深一階；頁內卡片把標題放進內容區、沒有關閉鈕。沒有成員時用 empty 原子。');p=panelsIn(sec);renderM();
    usageSection(body,[['用 Invite Card','分享文件、專案或工作區給特定的人。'],['對話框 vs 頁內','從「分享」按鈕打開用 modal；設定頁裡的成員管理直接用 card。'],['角色選單','只放 2～3 個角色；移除放最後、用分隔線隔開並標紅。']]);
    const sl=section(body,'互動預覽與程式碼','試著送出錯誤的 email、再送一個正確的。');LIVE['invite-card'](sl);
  }

  /* ---------- WIDGET CARD 小工具卡 ---------- */
  function wdgMsg(o){const L=!!o.live;const c=ce('article','wdg-msg');c.setAttribute('aria-label','林語晨的訊息');
    const h=ce('div','wdg-msg-h');h.appendChild(crdAv(1,'l'));const who=ce('div','wdg-who');who.innerHTML='<div class="wdg-t">林語晨<span>昨天 上午 10:12</span></div><div class="wdg-m">yuchen@goons.design</div>';h.appendChild(who);
    const acts=ce('div','wdg-acts');acts.append(crdBtn('text','secondary','m','傳送',IC_SEND,{iconOnly:true,live:L}),crdBtn('text','danger','m','刪除',IC_TRASH,{iconOnly:true,live:L}));h.appendChild(acts);
    const p=ce('p');p.textContent='對，新的動態 token 上線了。按鈕、抽屜和通知現在共用同一條 ease-out 曲線，每個轉場都像出自同一個產品。';
    const rx=ce('div','wdg-rx');rx.setAttribute('aria-live','polite');
    const ft=ce('div','wdg-ft');ft.innerHTML='<input type="text" placeholder="輸入回覆…" aria-label="回覆">';
    const emo=ce('div','wdg-emo');const base=ce('span','wdg-base');base.style.display='contents';const xtra=ce('span','wdg-xtra');const more=document.createElement('button');more.type='button';more.className='wdg-more';more.setAttribute('aria-label','更多表情');more.setAttribute('aria-expanded','false');more.innerHTML=IC_PLUS;
    emo.append(base,xtra,more);ft.appendChild(emo);
    const cnt={};
    const mk=(e,host)=>{const b=document.createElement('button');b.type='button';b.textContent=e;b.setAttribute('aria-label','用 '+e+' 回應');host.appendChild(b);
      if(L)b.onclick=()=>{if(!crdReduce()){const f=ce('span','wdg-fly');f.textContent=e;b.appendChild(f);setTimeout(()=>f.remove(),900);}cnt[e]=(cnt[e]||0)+1;rx.innerHTML='';Object.entries(cnt).forEach(([k,v])=>rx.appendChild(crdTag(k+' '+v,'outline','neutral')));};};
    ['😂','❤️','🔥','⚡','👍'].forEach(e=>mk(e,base));['🎉','👀','🙏','💯'].forEach(e=>mk(e,xtra));
    c.append(h,p,rx,ft);
    if(L){more.onclick=()=>{const op=emo.classList.toggle('open');more.setAttribute('aria-expanded',String(op));};
      const inp=ft.querySelector('input');inp.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing||!inp.value.trim())return;const r=ce('div','wdg-reply');r.textContent=inp.value.trim();
        const old=c.querySelector('.wdg-reply');if(old)old.remove();c.insertBefore(r,ft);inp.value='';});}
    return c;}
  function wdgTodo(o){const c=ce('article','wdg-todo');c.setAttribute('aria-label','今日待辦');c.innerHTML='<div class="wdg-t">今日待辦</div><div class="wdg-m">11 月 3 日</div>';
    const T=[[['P2 設計審查','09:00 – 09:45'],['和前端對 token 命名','11:30 – 12:00']],[['補 Figma 變數說明','週五前'],['回覆首頁文案','今天']]];
    const ls=ce('div','wdg-ls');ls.setAttribute('aria-live','polite');
    const draw=i=>{ls.innerHTML='';T[i].forEach(([a,b])=>{const d=ce('div');d.innerHTML='<div class="wdg-t"></div><div class="wdg-m"></div>';d.firstChild.textContent=a;d.lastChild.textContent=b;ls.appendChild(d);});};
    c.appendChild(sgmEl('soft','m',{items:['已排程','筆記'],active:0,full:true,live:!!o.live,label:'檢視',onChange:draw}));c.appendChild(ls);draw(0);return c;}
  function wdgGrp(){const c=ce('article','');c.setAttribute('aria-label','27 new messages');const g=ce('div','wdg-g4');[3,0,2,4].forEach(i=>g.appendChild(crdAv(i,'l')));
    const t=ce('div','wdg-t');t.textContent='27 則新訊息';const m=ce('div','wdg-m');m.textContent='+ 12 人';   /* LOC-SRC:v1 */c.append(g,t,m);return c;}
  function wdgWel(o){const c=ce('article','');c.setAttribute('aria-label','歡迎回來');
    const h=ce('div','wdg-wel-h');const tx=ce('div');tx.innerHTML='<div class="wdg-m">歡迎回來！</div><div class="wdg-t">林語晨</div>';h.append(tx,crdAv(1,'l'));
    const row=ce('div','wdg-wel-row');row.innerHTML='<span class="wdg-m">昨天 上午 10:12</span>';const mb=document.createElement('button');mb.type='button';mb.className='lnk';mb.textContent='標為已讀';row.appendChild(mb);
    const nt=ce('div','wdg-nt');nt.innerHTML=`<span class="wdg-nt-ic" aria-hidden="true">${IC_CHAT_TEXT}</span><p>Catch up later this week to review our progress on the new motion tokens for the component library.</p>`;
    const dn=ce('div','wdg-done');dn.textContent='通知都看完了。';c.append(h,row,nt,dn);
    if(o.live)mb.onclick=()=>{const r=c.classList.toggle('read');swapText(mb,r?'復原':'標為已讀');};
    return c;}
  function wdgDate(){const c=ce('article','');c.setAttribute('aria-label','11 月 3 日 星期一');c.innerHTML='<div class="wdg-m">星期一</div><div class="wdg-d">11/3</div>';
    const bd=ce('div','wdg-bd');bd.appendChild(crdAv(3,'m'));const tx=ce('div');tx.innerHTML='<div class="wdg-t">Happy Birthday!</div><div class="wdg-m">T. Chang</div>';bd.appendChild(tx);c.appendChild(bd);return c;}
  const WDG_KIND={message:wdgMsg,todo:wdgTodo,group:wdgGrp,welcome:wdgWel,date:wdgDate};
  function wdgEl(kind,o){o=o||{};const c=WDG_KIND[kind](o);c.classList.add('wdg','wdg-k-'+kind);if(o.live)c.classList.add('live');return c;}
  function wdgBento(o){const g=ce('div','wdg-bento');['message','todo','group','welcome','date'].forEach(k=>g.appendChild(wdgEl(k,o)));return g;}
  LIVE['widget-card']=(host)=>mountLive(host,{gate:'widget-card',initial:{kind:'message'},
    segs:[{key:'kind',label:'Kind',options:['message','todo','group','welcome','date'],labels:['訊息','待辦','群組','歡迎','日期']}],
    render:st=>wdgEl(st.kind,{live:true}),
    note:'訊息：點表情會往上飄並累計數量，＋ 展開更多表情，回覆欄按 Enter 送出。待辦：「已排程／筆記」白色膠囊滑動切換。群組：滑過頭像散開。歡迎回來：「標為已讀」收合通知、「復原」還原。'});
  function buildWidgetCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Widget Card',title:'Widget Card 小工具卡',
      lede:'儀表板首頁的小工具卡，照參考圖的五張：訊息、今日待辦、群組訊息、歡迎回來、日期。共用同一個外框（--r-xl 大圓角、淡陰影），內容取用 <a href="#avatar">avatar</a>、<a href="#button">button</a>、<a href="#segmented">segmented</a>、<a href="#tag">tag</a>、<a href="#link">link</a>。一個 kind 軸（<b>5</b>）。',
      specRows:[['axes','<code>kind</code>'],['formula','<code>5</code>'],['atoms','<code>avtEl · .btn · sgmEl · .tg · .lnk</code>'],['token-policy','<code>semantic.*.card.* · radius.xl</code>'],['layout','bento：message 跨 2 欄']]});
    const KN={message:['訊息','message'],todo:['今日待辦','todo'],group:['群組訊息','group'],welcome:['歡迎回來','welcome'],date:['日期','date']};
    const axes=DIAL_SPECS['widget-card'].axes,zh=DIAL_SPECS['widget-card'].zh,active=CHOICE['widget-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ks=axes.kind.filter(v=>active.kind.has(v));
      p.appendChild(matrixPanel({badge:'widget-card',name:'Kind',rows:ks,cols:['default'],rowLab:x=>labHTML(KN[x][0],KN[x][1]),colLab:()=>labHTML('預設','default'),cell:k=>wdgEl(k,{}),mincol:580}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Kind 矩陣','五種小工具各自是 kind 的一個值；外框、圓角、內距共用。');p=panelsIn(sec);renderM();
    const sw=section(body,'Bento 組合','參考圖的排法：訊息跨兩欄，待辦、群組、歡迎回來、日期依序排列；窄螢幕自動改成兩欄、一欄。全部可以操作。');
    const rd=ce('div','row-demo');rd.style.padding='0';rd.style.border='0';rd.style.background='transparent';rd.appendChild(wdgBento({live:true}));sw.appendChild(rd);
    usageSection(body,[['用 Widget Card','個人化首頁、儀表板的一眼資訊與一步動作。'],['改用 Card','內容是一般文章或商品，沒有「小工具」的即時性。'],['排版','同一排的卡片等高；訊息這類有輸入欄的放上排、跨兩欄。']]);
    const sl=section(body,'互動預覽與程式碼','切 kind，每張都可以操作。');LIVE['widget-card'](sl);
  }
  /* ==================== /CARDS:round2-v1 ==================== */
  /* ==================== CARDS5:v1 · Card 卡片第三批：5 種單張牌卡（2026-11-05）====================
     trend-card／media-card／weather-card／player-card／ticket-card。每顆都是「單張」卡片（不是卡片堆疊）。
     內部一律取用既有原子（鐵則 5）：mkBtn（crdBtn 包裝，播放／上下首／愛心／Check in）、tagEl（crdTag：狀態、照片標籤）、
     avtEl（頭像＋.avt-grp 疊放樣式）、sgmEl（天氣五日分段）、sldEl（播放進度，可拖曳／鍵盤）、dvdEl（分隔線／票根虛線）、chtxRoll（溫度數字滾動）。
     照片沿用已內嵌的 CARD_PHOTO／PSC_ROT／CARD_COVER（data URI，CSP 預覽可用）；專輯封面用 token 漸層。卡片內容文字維持英文（同第二批）。 */
  /* 新增 icon（PulsoIcon 風格 24 viewBox；play／pause／fast-forward 為 fill，其餘 regular）；sun／heart／airplane／caret-down 重用既有 IC_* */
  const IC_PLAY_F=PI('play',{solid:1});
  const IC_PAUSE_F=PI('pause',{solid:1});
  const IC_FFWD_F=PI('fast-forward',{solid:1});
  const IC_RWND_F=IC_FFWD_F.replace('<path ','<path transform="matrix(-1 0 0 1 256 0)" ');
  const IC_HEART_F=PI('heart',{solid:1});
  const IC_CLOUD_P='M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z';
  const IC_CLOUD=PI('cloud');
  const IC_RAIN=PI('cloud-rain');
  const IC_BOLT=PI('zap');

  /* ---------- TREND CARD 趨勢卡 ---------- */
  const TRD_DATA={ink:{n:'01',t:['Metaverse','Mayhem'],src:()=>PSC_ROT[0]},violet:{n:'02',t:['Digital','Fashion'],src:()=>CARD_PHOTO},
    white:{n:'03',t:['Web','Kitsch'],src:()=>PSC_ROT[1]},lime:{n:'04',t:['3D Interactive','Elements'],src:()=>PSC_ROT[2]},green:{n:'05',t:['Zen','Energy'],src:()=>CARD_COVER}};
  function trdEl(tone,o){o=o||{};const d=TRD_DATA[tone]||TRD_DATA.ink;
    const c=ce('article','trd trd-t-'+tone+(o.media===false?' no-media':'')+(o.live?' live':''));c.setAttribute('aria-label','趨勢 '+d.n+'：'+d.t.join(' '));
    if(o.index!==false){const n=ce('span','trd-no');n.setAttribute('aria-hidden','true');n.textContent=d.n;c.appendChild(n);}
    const h=ce('h3','trd-title');h.innerHTML=d.t.map(x=>`<span>${x}</span>`).join('');c.appendChild(h);
    if(o.media!==false){const m=ce('div','trd-media');const i=document.createElement('img');i.src=d.src();i.alt='';i.decoding='async';m.appendChild(i);c.appendChild(m);}
    if(o.live){c.tabIndex=0;}
    return c;}
  LIVE['trend-card']=(host)=>mountLive(host,{gate:'trend-card',initial:{tone:'ink',index:true,media:true},
    segs:[{key:'tone',label:'Tone',options:['ink','violet','white','lime','green'],labels:['墨黑','紫','白','萊姆','綠'],as:'seg'}],
    bools:[{key:'index',label:'index 編號'},{key:'media',label:'media 底部圖片'}],boolLabel:'Content',
    render:st=>trdEl(st.tone,{live:true,index:st.index,media:st.media}),
    note:'滑過（或 Tab 聚焦）卡片：整張微微上浮、輕轉 −2°，底部圖片放大；減少動態設定下只保留陰影變化。'});
  function buildTrendCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Trend Card',title:'Trend Card 趨勢卡',
      lede:'直式色塊卡：左上角手寫感編號、大寫多行標題、底部圓角圖片。整張實心底色是唯一的 variant 軸（<b>5</b>）：墨黑、紫、白、萊姆、綠，全部綁色階 token（萊姆＝<code>warning-300 × success-300</code> 混色）。編號與圖片是內容開關（boolean）。',
      specRows:[['axes','<code>tone</code>'],['formula','<code>5</code>'],['boolean','<code>index · media</code>'],['atoms','<code>img（內嵌照片）· token 色階</code>'],['token-policy','<code>brand-800 · violet-400 · neutral-0 · success-300/400 · radius.xl</code>']]});
    const TN={ink:['墨黑','ink'],violet:['紫','violet'],white:['白','white'],lime:['萊姆','lime'],green:['綠','green']};
    const axes=DIAL_SPECS['trend-card'].axes,active=CHOICE['trend-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ts=axes.tone.filter(v=>active.tone.has(v));
      p.appendChild(matrixPanel({badge:'index · media on',name:'Tone',rows:['default'],cols:ts,rowLab:()=>labHTML('預設','default'),colLab:x=>labHTML(TN[x][0],TN[x][1]),cell:(r,t)=>trdEl(t,{}),mincol:200}));}
    mountDial(body,{axes,zh:DIAL_SPECS['trend-card'].zh,active,onRender:renderM});
    const sec=section(body,'Tone 色調','五種實心底色；深底（墨黑）配白字，其餘配深字，對比都 ≥ 4.5:1。白卡在淺色頁面上多一圈淡邊框。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>index</code>、<code>media</code> 對應 Figma boolean property；關掉圖片時標題往下撐滿，卡片比例不變。');
    capRow(cs,[['index · media',trdEl('lime',{})],['media = false',trdEl('lime',{media:false})],['index = false',trdEl('lime',{index:false})]]);
    usageSection(body,[['用 Trend Card','年度回顧、主題策展、分類入口這類「一眼一個主題」的牌卡。'],['改用 Article Card','需要摘要、作者、日期等資訊時。'],['色調','同一排最多交錯 3 種色調；文字一律走 token 對應的 on-color，不另外改色。']]);
    const sl=section(body,'互動預覽與程式碼','切色調、開關編號與圖片；滑過卡片看上浮。');LIVE['trend-card'](sl);
  }

  /* ---------- MEDIA CARD 照片標籤卡 ---------- */
  const MDC_SRC={portrait:()=>CARD_PHOTO,square:()=>PSC_ROT[1],landscape:()=>CARD_COVER};
  const MDC_LAB={portrait:'SORA 2',square:'KLING',landscape:'SEEDANCE 2.0'};
  function mdcEl(ratio,o){o=o||{};let sel=!!o.selected;
    const c=ce('article','mdc mdc-r-'+ratio+(o.tilt?' is-tilt':'')+(o.live?' live':''));c.setAttribute('aria-label',(MDC_LAB[ratio]||'Media')+' 範例圖');
    const i=document.createElement('img');i.src=MDC_SRC[ratio]();i.alt='';i.decoding='async';c.appendChild(i);
    if(o.label!==false){const t=crdTag(MDC_LAB[ratio],'soft','neutral','tg-smoke');t.classList.add('mdc-lab');c.appendChild(t);}
    const paint=()=>{c.classList.toggle('is-selected',sel);if(o.live)c.setAttribute('aria-pressed',String(sel));};paint();
    if(o.live){c.tabIndex=0;c.setAttribute('role','button');
      const tg=()=>{sel=!sel;paint();if(o.onChange)o.onChange();};
      c.onclick=tg;c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tg();}});}
    return c;}
  LIVE['media-card']=(host)=>mountLive(host,{gate:'media-card',initial:{ratio:'portrait',label:true,selected:false,tilt:false},
    segs:[{key:'ratio',label:'Ratio',options:['portrait','square','landscape'],labels:['直式 4:5','方形 1:1','橫式 4:3']}],
    bools:[{key:'label',label:'label 標籤'},{key:'selected',label:'selected 已選取'},{key:'tilt',label:'tilt 傾斜'}],boolLabel:'Content',
    render:(st,sync)=>mdcEl(st.ratio,{live:true,label:st.label,selected:st.selected,tilt:st.tilt,onChange:sync}),
    note:'點卡片（或聚焦後按 Enter／空白鍵）切換選取：外圈出現 <code>--accent2</code> 虛線框。傾斜開啟時卡片轉 −4°，滑過回正並放大一點。'});
  function buildMediaCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Media Card',title:'Media Card 照片標籤卡',
      lede:'整張滿版照片＋大圓角，右上角半透明膠囊標籤（取用 <a href="#tag">tag</a> 原子＋磨砂修飾）。比例是 variant 軸（<b>3</b>）；<code>label</code>、<code>selected</code>（虛線外框）、<code>tilt</code>（傾斜，預設關）是 boolean。適合模型／作品／素材挑選。',
      specRows:[['axes','<code>ratio</code>'],['formula','<code>3</code>'],['boolean','<code>label · selected · tilt</code>'],['atoms','<code>.tg · img</code>'],['token-policy','<code>radius.2xl · --accent2（選取框）</code>']]});
    const RN={portrait:['直式','4:5'],square:['方形','1:1'],landscape:['橫式','4:3']};
    const axes=DIAL_SPECS['media-card'].axes,active=CHOICE['media-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const rs=axes.ratio.filter(v=>active.ratio.has(v));
      p.appendChild(matrixPanel({badge:'label · on',name:'Ratio × Selected',rows:['off','on'],cols:rs,rowLab:x=>labHTML(x==='on'?'已選取':'未選取','selected · '+x),colLab:x=>labHTML(RN[x][0],RN[x][1]),cell:(s,r)=>mdcEl(r,{selected:s==='on'}),mincol:240}));}
    mountDial(body,{axes,zh:DIAL_SPECS['media-card'].zh,active,onRender:renderM});
    const sec=section(body,'Ratio × Selected 矩陣','選取＝外圈 2px 虛線（--accent2），不改變卡片尺寸，排在一起不會跳動。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>label</code>／<code>tilt</code> 對應 Figma boolean property。');
    capRow(cs,[['label = false',mdcEl('square',{label:false})],['tilt = true',mdcEl('square',{tilt:true})]]);
    usageSection(body,[['用 Media Card','照片本身就是內容：作品集、AI 模型挑選、素材庫。'],['改用 Person Card','重點是「人」，需要名字與動作按鈕。'],['tilt','只在展示型版面（hero、拼貼）使用；清單與格狀排列一律關閉。']]);
    const sl=section(body,'互動預覽與程式碼','點卡片切換選取；開 tilt 看傾斜。');LIVE['media-card'](sl);
  }

  /* ---------- WEATHER CARD 天氣卡 ---------- */
  const WTC_DAYS=[{d:'週一',day:'星期一',c:'sunny',t:24,h:26,l:17},{d:'週二',day:'星期二',c:'cloudy',t:19,h:21,l:15},{d:'週三',day:'星期三',c:'rain',t:17,h:18,l:13},   /* LOC-SRC:v2 */
    {d:'週四',day:'星期四',c:'storm',t:16,h:19,l:12},{d:'週五',day:'星期五',c:'sunny',t:23,h:25,l:16}];
  const WTC_COND={sunny:['晴',()=>IC_SUN],cloudy:['多雲',()=>IC_CLOUD],rain:['小雨',()=>IC_RAIN],storm:['雷雨',()=>IC_BOLT]};
  function wtcEl(cond,o){o=o||{};let cur=Math.max(0,WTC_DAYS.findIndex(x=>x.c===cond));
    const c=ce('article','wtc'+(o.live?' live':''));c.setAttribute('aria-label','舊金山天氣');
    const top=ce('div','wtc-top');top.innerHTML='<div class="wtc-city">舊金山</div><div class="wtc-day"></div>';
    const mid=ce('div','wtc-mid');const tp=ce('div','wtc-temp');const roll=chtxRoll(String(WTC_DAYS[cur].t));tp.append(roll,document.createTextNode('°'));
    const ic=ce('span','wtc-ic');ic.setAttribute('aria-hidden','true');mid.append(tp,ic);
    const cd=ce('div','wtc-cond');cd.innerHTML='<div class="wtc-cn"></div><div class="wtc-hl"></div>';
    c.append(top,mid,cd);
    function show(i){cur=i;const w=WTC_DAYS[i];WTC_KEYS.forEach(k=>c.classList.toggle('wtc-c-'+k,k===w.c));
      top.querySelector('.wtc-day').textContent=w.day;chtxSetRoll(roll,String(w.t));ic.innerHTML=WTC_COND[w.c][1]();
      cd.querySelector('.wtc-cn').textContent=WTC_COND[w.c][0];cd.querySelector('.wtc-hl').textContent=`H:${w.h}° L:${w.l}°`;
      c.setAttribute('aria-label',`舊金山，${w.day}：${w.t}°，${WTC_COND[w.c][0]}`);}
    if(o.forecast!==false){const sg=sgmEl('soft','m',{items:WTC_DAYS.map(x=>x.d),active:cur,full:true,live:!!o.live,label:'預報日',onChange:i=>{show(i);if(o.onChange)o.onChange();}});
      sg.classList.add('wtc-fc');sg.querySelectorAll('.sgm-it').forEach((b,i)=>{b.insertAdjacentHTML('afterbegin',`<span class="sgm-ic" aria-hidden="true">${WTC_COND[WTC_DAYS[i].c][1]()}</span>`);b.setAttribute('aria-label',WTC_DAYS[i].day);});
      c.appendChild(sg);}
    show(cur);return c;}
  const WTC_KEYS=Object.keys(WTC_COND);
  LIVE['weather-card']=(host)=>mountLive(host,{gate:'weather-card',initial:{cond:'sunny',forecast:true},
    segs:[{key:'cond',label:'Condition',options:['sunny','cloudy','rain','storm'],labels:['晴','多雲','雨','雷雨']}],
    bools:[{key:'forecast',label:'forecast 五日列'}],boolLabel:'Content',
    render:(st,sync)=>wtcEl(st.cond,{live:true,forecast:st.forecast,onChange:sync}),
    note:'點下方任一天（或聚焦後用 ← / →）：磨砂膠囊滑過去，上方星期、溫度（逐位滾動）、天氣圖示、H/L 與整張漸層一起換成那天。'});
  function buildWeatherCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Weather Card',title:'Weather Card 天氣卡',
      lede:'藍色漸層天氣小工具：城市＋星期、超大溫度、天氣圖示、狀況與高低溫，底部是磨砂玻璃的五日列。五日列直接取用 <a href="#segmented">segmented</a> 原子（滑動指示器＋方向鍵），只換成玻璃質感；溫度用圖表的數字滾動。天氣狀況是 variant 軸（<b>4</b>），每種綁不同色階漸層。',
      specRows:[['axes','<code>cond</code>'],['formula','<code>4</code>'],['boolean','<code>forecast</code>'],['atoms','<code>sgmEl · chtxRoll · icon</code>'],['token-policy','<code>info-400–800 · violet-600/900 · warning-300（太陽／閃電）</code>']]});
    const CN={sunny:['晴','sunny'],cloudy:['多雲','cloudy'],rain:['雨','rain'],storm:['雷雨','storm']};
    const axes=DIAL_SPECS['weather-card'].axes,active=CHOICE['weather-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const cs=axes.cond.filter(v=>active.cond.has(v));
      p.appendChild(matrixPanel({badge:'forecast · on',name:'Condition',rows:['default'],cols:cs,rowLab:()=>labHTML('預設','default'),colLab:x=>labHTML(CN[x][0],CN[x][1]),cell:(r,x)=>wtcEl(x,{}),mincol:340}));}
    mountDial(body,{axes,zh:DIAL_SPECS['weather-card'].zh,active,onRender:renderM});
    const sec=section(body,'Condition 天氣狀況','晴＝info 亮藍、多雲＝info 混中性灰、雨＝info 深藍、雷雨＝violet 深紫；字一律白色，深淺主題都一樣（卡片自帶底色）。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>forecast</code> 對應 Figma boolean property：關掉五日列＝精簡版小工具。');
    capRow(cs,[['forecast = false',wtcEl('cloudy',{forecast:false})]]);
    usageSection(body,[['用 Weather Card','儀表板、旅遊行程、活動頁的天氣資訊。'],['改用 Widget Card','資訊不是天氣、也不需要逐日切換。'],['五日列','最多 5 天；超過改用可橫向捲動的清單。']]);
    const sl=section(body,'互動預覽與程式碼','點任一天切換，看溫度滾動與漸層轉換。');LIVE['weather-card'](sl);
  }

  /* ---------- PLAYER CARD 音樂播放卡 ---------- */
  const PLC_LEN=204,PLC_AT=72;
  const plcFmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
  const PLC_LIKERS=[['MC','sec','Mei Chen'],['LP','sec','Leo Park'],['SI','sec','Sora Ito'],['OR','sec','Olivia Ruiz']];
  function plcEl(state,o){o=o||{};let playing=state==='playing',liked=false,likes=24,t=PLC_AT,timer=null;
    const c=ce('article','plc'+(playing?' is-playing':'')+(o.live?' live':''));c.setAttribute('aria-label','正在播放：Juno Vale 的 Slow Tides');
    const art=ce('div','plc-art');art.setAttribute('role','img');art.setAttribute('aria-label','專輯封面');c.appendChild(art);
    const hd=ce('div','plc-hd');const tx=ce('div','plc-tx');tx.innerHTML='<div class="plc-title">Slow Tides</div><div class="plc-artist">Juno Vale</div>';
    const hb=crdBtn('text','secondary','m','喜歡',IC_HEART,{iconOnly:true,live:o.live,shape:'circle'});hb.classList.add('plc-heart');hd.append(tx,hb);c.appendChild(hd);
    const pr=ce('div','plc-prog');const tm=ce('div','plc-time');tm.innerHTML='<span></span><span></span>';
    const sl=sldEl('single','s','default',{live:!!o.live,label:false,min:0,max:PLC_LEN,step:1,value:t,title:'播放進度',format:plcFmt,onChange:v=>{t=v;paintT();}});
    pr.append(sl,tm);c.appendChild(pr);
    const ctl=ce('div','plc-ctl');const pv=crdBtn('text','secondary','m','上一首',IC_RWND_F,{iconOnly:true,live:o.live,shape:'circle'});
    const pp=crdBtn('solid','primary','l','播放',IC_PLAY_F,{iconOnly:true,live:o.live,shape:'circle'});pp.classList.add('plc-pp');
    const nx=crdBtn('text','secondary','m','下一首',IC_FFWD_F,{iconOnly:true,live:o.live,shape:'circle'});ctl.append(pv,pp,nx);c.appendChild(ctl);
    if(o.likes!==false){c.appendChild(dvdEl('horizontal','solid'));
      const ft=ce('div','plc-ft');const g=ce('span','avt-grp');g.setAttribute('role','group');g.setAttribute('aria-label',PLC_LIKERS.map(x=>x[2]).join('、')+' 都按了喜歡');
      PLC_LIKERS.forEach(([ini,tone,nm])=>g.appendChild(avtEl('m','circle','initials',{initials:ini,tone,name:nm})));
      const lk=ce('span','plc-likes');const more=crdBtn('text','secondary','s','查看按喜歡的人',IC_CARET_DOWN,{iconOnly:true,live:o.live,shape:'circle'});more.classList.add('plc-more');more.setAttribute('aria-expanded','false');
      ft.append(g,lk,more);c.appendChild(ft);
      const who=ce('div','plc-who');who.textContent=PLC_LIKERS.map(x=>x[2]).join('、')+' 和其他 20 人';c.appendChild(who);
      c.__lk=lk;if(o.live)more.onclick=()=>{const op=c.classList.toggle('is-open');more.setAttribute('aria-expanded',String(op));};}
    const thumb=sl.querySelector('.sld-thumb');
    function paintT(){tm.firstChild.textContent=plcFmt(t);tm.lastChild.textContent=plcFmt(PLC_LEN);}
    function paint(){c.classList.toggle('is-playing',playing);pp.innerHTML=playing?IC_PAUSE_F:IC_PLAY_F;pp.setAttribute('aria-label',playing?'暫停':'播放');
      hb.innerHTML=liked?IC_HEART_F:IC_HEART;hb.setAttribute('aria-pressed',String(liked));hb.setAttribute('aria-label',liked?'取消喜歡':'喜歡');hb.classList.toggle('is-on',liked);
      if(c.__lk)c.__lk.textContent=likes+' 個喜歡';paintT();}
    /* 播放中每秒推進：走 Slider 原子自己的鍵盤步進（ArrowRight＝+1 秒），內部值、aria、填色一起更新 */
    const step=k=>{if(thumb)thumb.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true}));};
    function tick(){if(!c.isConnected){clearInterval(timer);timer=null;return;}if(t>=PLC_LEN){playing=false;stop();step('Home');paint();if(o.onChange)o.onChange();return;}step('ArrowRight');}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    function run(){stop();if(playing&&o.live)timer=setInterval(tick,1000);}
    paint();
    if(o.live){pp.onclick=()=>{playing=!playing;paint();run();if(o.onChange)o.onChange();};
      hb.onclick=()=>{liked=!liked;likes+=liked?1:-1;paint();hb.classList.remove('plc-pop');void hb.offsetWidth;hb.classList.add('plc-pop');if(o.onChange)o.onChange();};
      pv.onclick=()=>step('Home');nx.onclick=()=>step('End');
      requestAnimationFrame(run);}
    return c;}
  LIVE['player-card']=(host)=>mountLive(host,{gate:'player-card',initial:{state:'paused',likes:true},
    segs:[{key:'state',label:'State',options:['paused','playing'],labels:['暫停','播放中']}],
    bools:[{key:'likes',label:'likes 按讚列'}],boolLabel:'Content',
    render:(st,sync)=>plcEl(st.state,{live:true,likes:st.likes,onChange:sync}),
    note:'按圓形播放鍵切換播放／暫停：播放中進度每秒前進（減少動態設定下不做平滑補間），可直接拖曳或用方向鍵調進度；⏮ 回到開頭、⏭ 跳到結尾。愛心切換已按讚並 +1；右下角箭頭展開按讚名單。'});
  function buildPlayerCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Player Card',title:'Player Card 音樂播放卡',
      lede:'專輯封面＋曲名歌手＋愛心、進度條與時間、上一首／大圓播放鍵／下一首、分隔線、按讚頭像群。內部全數取用原子：<a href="#button">button</a>（icon-only；播放鍵為 solid l 加大成圓）、<a href="#slider">slider</a>（進度，可拖曳）、<a href="#divider">divider</a>、<a href="#avatar">avatar</a>（縮寫＋群組疊放）。封面用 token 漸層，不放外部圖片。',
      specRows:[['axes','<code>state</code>'],['formula','<code>2</code>'],['boolean','<code>likes</code>'],['atoms','<code>.btn · .sld · .dvd · avtEl / .avt-grp</code>'],['token-policy','<code>violet / info / brand2 漸層 · radius.2xl</code>']]});
    const SN={paused:['暫停','paused'],playing:['播放中','playing']};
    const axes=DIAL_SPECS['player-card'].axes,active=CHOICE['player-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'likes · on',name:'State',rows:['default'],cols:ss,rowLab:()=>labHTML('預設','default'),colLab:x=>labHTML(SN[x][0],SN[x][1]),cell:(r,s)=>plcEl(s,{}),mincol:340}));}
    mountDial(body,{axes,zh:DIAL_SPECS['player-card'].zh,active,onRender:renderM});
    const sec=section(body,'State 狀態','暫停＝播放三角；播放中＝暫停雙槓，封面多一圈柔光。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>likes</code> 對應 Figma boolean property：分隔線＋按讚列整段開／關。');
    capRow(cs,[['likes = false',plcEl('paused',{likes:false})]]);
    usageSection(body,[['用 Player Card','單首曲目／Podcast 單集的迷你播放器、分享卡。'],['改用 List Item','播放清單：一次很多首，每首只需要一列。'],['播放鍵','整張卡只有一個 solid 主按鈕（播放），其他控制都用 text 按鈕。']]);
    const sl=section(body,'互動預覽與程式碼','按播放看進度前進；拖進度、按愛心、展開按讚名單。');LIVE['player-card'](sl);
  }

  /* ---------- TICKET CARD 登機證 ---------- */
  const TKC_ST={'on-time':['準時','success'],boarding:['登機中','info'],delayed:['延誤','warning'],cancelled:['已取消','danger']};   /* LOC-SRC:v2 */
  function tkcEl(status,o){o=o||{};const S=TKC_ST[status]||TKC_ST['on-time'];let done=false;
    const c=ce('article','tkc tkc-s-'+status+(o.live?' live':''));c.setAttribute('aria-label','登機證 TA 482，舊金山飛往紐約，'+S[0]);
    const top=ce('div','tkc-top');const hd=ce('div','tkc-hd');hd.innerHTML='<span>TA 482 · 6 月 12 日（三）</span>';hd.appendChild(crdTag(S[0],'soft',S[1],'tkc-tag'));top.appendChild(hd);
    const rt=ce('div','tkc-rt');
    rt.innerHTML=`<div class="tkc-pt"><b>SFO</b><span>舊金山</span></div><div class="tkc-path" aria-label="飛行時間 5 小時 20 分鐘"><div class="tkc-line"><i></i><span class="tkc-plane" aria-hidden="true">${IC_AIRPLANE}</span><i></i></div><span>5h 20m</span></div><div class="tkc-pt tkc-to"><b>JFK</b><span>紐約</span></div>`;
    top.appendChild(rt);
    const tms=ce('div','tkc-tm');tms.innerHTML=status==='delayed'?'<span><s>08:45</s> 09:25</span><span><s>17:05</s> 17:45</span>':'<span>08:45</span><span>17:05</span>';top.appendChild(tms);
    c.appendChild(top);
    const bt=ce('div','tkc-bot');const perf=dvdEl('horizontal','dashed');perf.classList.add('tkc-perf');bt.appendChild(perf);
    const gr=ce('dl','tkc-grid');[['登機門','B12'],['座位','14A'],['登機時間',status==='delayed'?'08:45':'08:05'],['分區','2']].forEach(([k,v])=>{const d=ce('div');d.innerHTML=`<dt>${k}</dt><dd>${v}</dd>`;gr.appendChild(d);});bt.appendChild(gr);
    if(o.passenger!==false){bt.appendChild(dvdEl('horizontal','solid'));const ps=ce('div','tkc-ps');
      ps.appendChild(avtEl('l','circle','initials',{initials:'MC',tone:'sec',name:'陳美雅'}));
      const nm=ce('div','tkc-nm');nm.innerHTML='<b>陳美雅</b><span>經濟艙</span>';ps.appendChild(nm);
      const cancelled=status==='cancelled';
      const b=mkBtn({variant:'solid',intent:'primary',size:'m',isLive:!!o.live,disabled:cancelled});b.type='button';b.classList.add('tkc-btn');
      const paint=()=>{if(done){b.className=b.className.replace(/\bv-[a-z]+/,'v-outline').replace(/\bi-[a-z]+/,'i-secondary');b.innerHTML=IC_CHECK+'<span>已報到</span>';}
        else b.innerHTML='<span>'+(cancelled?'重新訂位':'報到')+'</span>';b.setAttribute('aria-pressed',String(done));};
      paint();if(o.live&&!cancelled)b.onclick=()=>{if(done)return;done=true;paint();c.classList.add('is-done');if(o.onChange)o.onChange();};
      ps.appendChild(b);bt.appendChild(ps);}
    c.appendChild(bt);return c;}
  LIVE['ticket-card']=(host)=>mountLive(host,{gate:'ticket-card',initial:{status:'on-time',passenger:true},
    segs:[{key:'status',label:'Status',options:['on-time','boarding','delayed','cancelled'],labels:['準時','登機中','延誤','取消']}],
    bools:[{key:'passenger',label:'passenger 旅客列'}],boolLabel:'Content',
    render:(st,sync)=>tkcEl(st.status,{live:true,passenger:st.passenger,onChange:sync}),
    note:'滑過票卡：航線上的飛機沿虛線滑到終點。按「Check in」→ 變成外框「Checked in」＋勾勾。延誤會劃掉原時間並顯示新時間；取消時按鈕停用。'});
  function buildTicketCard(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Ticket Card',title:'Ticket Card 登機證',
      lede:'票券型卡片：航班與日期＋狀態標籤、大字 SFO → JFK（虛線航線＋飛機＋飛行時間）、起降時間，中段兩側半圓缺口＋虛線撕線，下方 Gate／Seat／Boards／Zone 與旅客列。內部取用 <a href="#tag">tag</a>（狀態）、<a href="#divider">divider</a>（撕線／分隔）、<a href="#avatar">avatar</a>、<a href="#button">button</a>。狀態是 variant 軸（<b>4</b>）。',
      specRows:[['axes','<code>status</code>'],['formula','<code>4</code>'],['boolean','<code>passenger</code>'],['atoms','<code>.tg · .dvd · avtEl · .btn</code>'],['token-policy','<code>semantic.feedback.* · radius.2xl · mask 缺口</code>']]});
    const SN={'on-time':['準時','on-time'],boarding:['登機中','boarding'],delayed:['延誤','delayed'],cancelled:['取消','cancelled']};
    const axes=DIAL_SPECS['ticket-card'].axes,active=CHOICE['ticket-card'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ss=axes.status.filter(v=>active.status.has(v));
      p.appendChild(matrixPanel({badge:'passenger · on',name:'Status',rows:['default'],cols:ss,rowLab:()=>labHTML('預設','default'),colLab:x=>labHTML(SN[x][0],SN[x][1]),cell:(r,s)=>tkcEl(s,{}),mincol:340}));}
    mountDial(body,{axes,zh:DIAL_SPECS['ticket-card'].zh,active,onRender:renderM});
    const sec=section(body,'Status 狀態','狀態標籤綁 feedback 語意色：準時 success、登機中 info、延誤 warning、取消 danger。缺口是 CSS mask 挖空，放在任何底色上都透出底色。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','<code>passenger</code> 對應 Figma boolean property：旅客列（頭像＋姓名艙等＋按鈕）整段開／關。');
    capRow(cs,[['passenger = false',tkcEl('boarding',{passenger:false})]]);
    usageSection(body,[['用 Ticket Card','登機證、電子票券、活動入場券等「有撕線」語意的憑證。'],['改用 Descriptions','只是列出訂單欄位，沒有票券的實體感。'],['缺口','只放在撕線那一列；一張票最多一條撕線。']]);
    const sl=section(body,'互動預覽與程式碼','滑過看飛機滑行；按 Check in。');LIVE['ticket-card'](sl);
  }
  /* ==================== /CARDS5:v1 ==================== */

