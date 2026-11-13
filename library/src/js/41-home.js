  /* ===== 首頁 Home（2026-11 改版 HOME3:v1：無 hash 時的預設首屏；上手指南為 #guide 文件頁）=====
     1 Hero：版面參考 designsystems.surf（靠左大標＋尾字輪播、左 CTA／右說明、細線＋分組數字列）
       試玩區：左側控制面板（sticky）＋右側預覽（3～4 個真元件）。所有覆寫只寫在預覽容器 #hxPv 的 custom properties，
       不動 :root；預覽容器會重新宣告 :root 的別名鏈（--panel→--s-surface-1…），語意層與 primitive 的覆寫才會沿鏈生效。
     2 元件牆：精選 15 格，元件一律原尺寸（不縮放），容器查詢決定 4／3／2／1 欄，每種欄數各自明確擺位、不留空洞；
       滑過時游標換成「查看 <元件> →」膠囊（pointer:fine 才有），鍵盤聚焦時在格內顯示同一個標籤
     3 動態展示：卡片與圖表自動示範，只放元件本身；滑過暫停、捲出畫面暫停、減少動態時不自動播放
     4 四步流程 → #start　5 Figma 同步與 token　6 最新更新＋FAQ */
  const HX_REDUCE=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
  const HX_DEF={primary:'brand',primaryC:'#7C3AED',second:'brand2',secondC:'#0EA5E9',theme:0,radius:4,bw:1,bc:35,shadow:0,font:0,weight:1,scale:100,density:100,motion:100};
  const HX_ST=Object.assign({},HX_DEF);
  /* 色票：全部取既有 primitive token（淺／深色各一階）；第一個＝不覆寫 */
  const HX_PRIM=[{k:'brand',label:'品牌預設',light:'--c-brand-500',dark:'--c-brand-200'},{k:'orange',label:'品牌橘',light:'--c-brand2-500',dark:'--c-brand2-400'},
    {k:'blue',label:'資訊藍',light:'--c-info-600',dark:'--c-info-400'},{k:'green',label:'成功綠',light:'--c-success-600',dark:'--c-success-400'},{k:'violet',label:'紫',light:'--c-violet-600',dark:'--c-violet-400'}];
  const HX_SEC=[{k:'brand2',label:'預設輔助色（品牌橘）',light:'--c-brand2-500',dark:'--c-brand2-400'},{k:'blue',label:'資訊藍',light:'--c-info-500',dark:'--c-info-400'},
    {k:'green',label:'成功綠',light:'--c-success-500',dark:'--c-success-400'},{k:'violet',label:'紫',light:'--c-violet-500',dark:'--c-violet-400'}];
  const HX_FONTS=[{label:'Geist',v:null},{label:'系統黑體',v:'system-ui,-apple-system,"Segoe UI","PingFang TC","Noto Sans TC",sans-serif'},{label:'明體',v:"'Noto Serif TC','Songti TC','PMingLiU',serif"}];
  const HX_SHADOW=['無','淡','預設','重'];
  const hxRootVar=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const hxPx=n=>parseFloat(hxRootVar(n))||0;
  function hxSiteDark(){const c=getComputedStyle(document.body).backgroundColor.match(/\d+/g);if(!c)return false;return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255<0.5;}
  function hxRgb(expr,host){const p=ce('span');p.style.cssText='position:absolute;width:0;height:0;overflow:hidden;color:'+expr;(host||document.body).appendChild(p);
    const m=getComputedStyle(p).color.match(/[\d.]+/g)||[0,0,0];p.remove();return m.slice(0,3).map(Number);}
  function hxHex(rgb){return '#'+rgb.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();}
  function hxLum(rgb){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(rgb[0])+0.7152*f(rgb[1])+0.0722*f(rgb[2]);}
  /* 讀樣式表：:root 的別名（值含 var()）＋淺／深主題語意層。預覽容器重新宣告這些，覆寫才會在容器內沿別名鏈生效 */
  let HX_SHEET=null;
  function hxSheet(){if(HX_SHEET)return HX_SHEET;const alias={},light={},dark={};
    const take=(rule,into,onlyVar)=>{for(let i=0;i<rule.style.length;i++){const n=rule.style[i];if(n.indexOf('--')!==0)continue;const v=rule.style.getPropertyValue(n).trim();if(!onlyVar||v.indexOf('var(')>=0)into[n]=v;}};
    for(const sh of document.styleSheets){let rs;try{rs=sh.cssRules;}catch(e){continue;}
      for(const r of rs){if(!r.style||!r.selectorText)continue;const s=r.selectorText.trim();
        if(s===':root')take(r,alias,true);else if(s===':root[data-theme="dark"]')take(r,dark,false);else if(s===':root[data-theme="light"]')take(r,light,false);}}
    return (HX_SHEET={alias,light,dark});}
  /* 預覽主題：0＝淺色、1＝深色。載入時跟網站當下主題；使用者切過就固定（HX_THEME_USER），按「重設」回到跟網站 */
  let HX_THEME_USER=false;
  const hxSiteTheme=()=>hxSiteDark()?1:0;
  const hxPrevDark=()=>HX_ST.theme===1;
  const hxSw=(list,k,dark)=>{const s=list.find(x=>x.k===k)||list[0];return 'var('+(dark?s.dark:s.light)+')';};

  /* 依 HX_ST 算出「使用者改了什麼」（只含覆寫，給讀數與複製用）；預覽容器另外加上別名＋主題語意層 */
  function hxOverrides(pv){const o={},dark=hxPrevDark(),S=hxSheet(),TH=dark?S.dark:S.light;
    if(HX_ST.primary!=='brand'){const C=HX_ST.primary==='custom'?HX_ST.primaryC:hxSw(HX_PRIM,HX_ST.primary,dark);
      const on=hxLum(hxRgb(C,pv))>0.4?'var(--c-neutral-900)':'var(--c-neutral-0)';
      o['--s-action-primary']=C;o['--s-action-primary-hover']='color-mix(in srgb,'+C+' 86%,var(--s-text-1))';o['--s-action-primary-press']='color-mix(in srgb,'+C+' 72%,var(--s-text-1))';
      o['--s-action-primary-tint']='color-mix(in srgb,'+C+' 12%,transparent)';o['--s-action-primary-tint2']='color-mix(in srgb,'+C+' 22%,transparent)';o['--s-on-primary']=on;}
    if(HX_ST.second!=='brand2')o['--accent2']=HX_ST.second==='custom'?HX_ST.secondC:hxSw(HX_SEC,HX_ST.second,dark);
    if(HX_ST.radius!==HX_DEF.radius){const f=HX_ST.radius/(hxPx('--r-sm')||4);['--r-xs','--r-sm','--r-md','--r-lg','--r-xl','--r-2xl','--r-3xl'].forEach(n=>{if(hxRootVar(n))o[n]=Math.round(hxPx(n)*f*10)/10+'px';});}
    if(HX_ST.bw!==HX_DEF.bw)o['--hx-bw']=HX_ST.bw+'px';
    if(HX_ST.bc!==50){const bc=HX_ST.bc,val=n=>TH[n]||hxRootVar(n);   // 外框深淺：50＝預設；往上混入文字色變深、往下混入透明變淡
      ['--s-border-1','--s-border-2'].forEach(n=>{o[n]=bc>50?'color-mix(in srgb,var(--s-text-1) '+Math.round((bc-50)*1.2)+'%,'+val(n)+')':'color-mix(in srgb,'+val(n)+' '+Math.round(bc*2)+'%,transparent)';});}
    if(HX_ST.shadow!==2){const E=['--e-sm','--e-md','--e-lg','--e-xl','--e-2xl'],val=n=>TH[n]||hxRootVar(n);
      if(HX_ST.shadow===0)E.forEach(n=>o[n]='none');
      else if(HX_ST.shadow===1){o['--e-2xl']=val('--e-xl');o['--e-xl']=val('--e-lg');o['--e-lg']=val('--e-md');o['--e-md']=val('--e-sm');o['--e-sm']='none';}
      else{o['--e-sm']=val('--e-md');o['--e-md']=val('--e-lg');o['--e-lg']=val('--e-xl');o['--e-xl']=val('--e-2xl');}}
    if(HX_ST.font)o['--font-sans']=HX_FONTS[HX_ST.font].v;
    if(HX_ST.weight!==1){const fw={r:hxRootVar('--fw-regular'),m:hxRootVar('--fw-medium'),s:hxRootVar('--fw-semibold'),b:hxRootVar('--fw-bold')};
      if(HX_ST.weight===0){o['--fw-semibold']=fw.m;o['--fw-medium']=fw.r;o['--fw-bold']=fw.s;}else{o['--fw-semibold']=fw.b;o['--fw-medium']=fw.s;o['--fw-regular']=fw.m;}}
    if(HX_ST.scale!==100)for(let i=1;i<=12;i++){const n='--fs-h'+i;if(hxRootVar(n))o[n]=Math.round(hxPx(n)*HX_ST.scale/100)+'px';}
    if(HX_ST.density!==100)for(let i=1;i<=9;i++){const n='--sp-'+i;if(hxRootVar(n))o[n]=Math.round(hxPx(n)*HX_ST.density/100)+'px';}
    if(HX_ST.motion!==100)['--dur-fast','--dur-default','--dur-slow'].forEach(n=>{const v=hxRootVar(n),ms=parseFloat(v)*(/[^m]s$/.test(v)?1000:1);o[n]=Math.round(ms*HX_ST.motion/100)+'ms';});
    return o;}
  function hxApply(pv){(pv.__hxProps||[]).forEach(p=>pv.style.removeProperty(p));
    const S=hxSheet(),dark=hxPrevDark(),all=Object.assign({},S.alias,dark?S.dark:S.light);
    const o=hxOverrides(pv);Object.assign(all,o);
    Object.entries(all).forEach(([k,v])=>pv.style.setProperty(k,v));pv.__hxProps=Object.keys(all);
    pv.dataset.theme=dark?'dark':'light';pv.style.colorScheme=dark?'dark':'light';
    return o;}

  /* HOME3-BENTO:v1 預覽＝「春季活動頁」專案總覽：頂列＋ bento 牌卡（進度／交付／待審 KPI、交付趨勢圖、團隊、待辦、快速新增）。
     HOME5-HOME:v1 團隊改成照片人物卡（Person Card 結構＋CARD_AV 照片）；待辦拿掉封面、底部加完成度；快速新增加負責人／截止日／標籤／說明，新增／清除移到標題列（size s）。
     全部取用既有原子（avtEl／avtGroup／mkBtn／tagEl／prgEl／chtChart／sgmEl／cbxEl／fldEl／ddField／dpkLive／textarea.tarea／switch），可直接操作；新增的任務會進「待辦任務」。 */
  function hxPreview(host){host.innerHTML='';
    const btn=(variant,intent,size,label,o)=>{const b=mkBtn(Object.assign({variant,intent,size,isLive:true},o||{}));b.querySelector('span').textContent=label;return b;};
    const tag=(v,i,label)=>{const g=tagEl(v,i,'default');g.querySelector('span').textContent=label;return g;};
    const meta=t=>{const s=ce('span');s.textContent=t;return s;};
    /* 頂列 */
    const bar=ce('header','hx-pvb');const id=ce('div','hx-pvb-id');
    id.appendChild(avtEl('m','rounded','initials',{initials:'春',tone:'accent',name:'春季活動頁'}));
    const tt=ce('div','hx-pvb-tt');const h=ce('h2');h.appendChild(document.createTextNode('春季活動頁'));h.appendChild(tag('soft','success','進行中'));
    tt.append(h,meta('專案總覽 · 3 分鐘前更新'));id.appendChild(tt);
    const acts=ce('div','hx-pvb-acts');acts.append(avtGroup('s',5,3),btn('outline','secondary','s','分享'),btn('solid','primary','s','新增任務'));
    bar.append(id,acts);host.appendChild(bar);
    /* 牌卡：同一個建構器，標題列一律「標題＋右側輔助」 */
    const grid=ce('div','hx-bento');host.appendChild(grid);
    const card=(key,title,extra)=>{const c=ce('section','hx-bc hx-bc-'+key);c.setAttribute('aria-label',title);
      const hd=ce('div','hx-bc-h');const t=ce('h3','hx-bc-t');t.textContent=title;const x=ce('div','hx-bc-x');x.appendChild(typeof extra==='string'?meta(extra):extra);hd.append(t,x);
      const b=ce('div','hx-bc-b');c.append(hd,b);grid.appendChild(c);return b;};
    const kpi=(b,v,unit,foot)=>{const r=ce('div','hx-kpi-v');const n=ce('b');n.textContent=v;r.appendChild(n);if(unit)r.appendChild(meta(unit));
      const f=ce('div','hx-kpi-f');foot.forEach(x=>f.appendChild(typeof x==='string'?meta(x):x));b.append(r,f);};
    kpi(card('k1','整體進度','本週'),'68','%',[prgEl('bar','s',{value:68})]);
    kpi(card('k2','元件交付','本月'),'42','/ 56',[tag('soft','success','+6'),'比上週多']);
    kpi(card('k3','待審項目','今天'),'7','項',[tag('soft','warning','2 項'),'今天到期']);
    /* 趨勢圖：右上 Segmented 切換「月份」（曲線）／「本週」（長條），摘要列跟著換 */
    let chW;const chartOf=i=>chtChart(i?'bar':'curve','m',i?{xaxis:true,interactive:true}:{area:true,grid:true,grad:true,xaxis:true,interactive:true});
    const SUM=[['+18%','比上月多交付 9 個元件','10 月最高'],['31','本週交付（設計＋程式）','週四最多']];let sumP;
    const ch=card('ch','設計交付趨勢',sgmEl('soft','s',{live:true,items:['月份','本週'],active:0,label:'統計區間',onChange:i=>{const n=chartOf(i);chW.replaceWith(n);chW=n;sumP(i);}}));
    const sum=ce('div','hx-ch-sum');const sb=ce('b'),sm=meta(''),sg=tag('soft','brand2','');sum.append(sb,sm,sg);ch.appendChild(sum);
    sumP=i=>{sb.textContent=SUM[i][0];sm.textContent=SUM[i][1];sg.querySelector('span').textContent=SUM[i][2];};sumP(0);
    chW=chartOf(0);ch.appendChild(chW);
    /* 團隊（HOME6:v1 改回 HOME4 版）：頭像列＝Avatar 原子（initials＋狀態點）＋姓名／職務；邀請＝灰色 soft 按鈕 */
    const MEM=[['林語晨','設計主責','林','accent','online'],['陳柏宇','前端工程','陳','brand2','away'],['王思妤','專案經理','王','sec','online'],
      ['李承恩','品質測試','李','accent','offline'],['張家豪','視覺設計','張','brand2','online'],['黃詩涵','內容策略','黃','sec','away']];
    const tm=card('tm','團隊成員',btn('soft','secondary','s','邀請'));
    MEM.forEach(([n,r,i,tone,st])=>{const m=ce('div','hx-mem');m.appendChild(avtEl('s','circle','initials',{initials:i,tone,status:st,name:n}));
      const nm=ce('div','hx-mem-n');const b=ce('b');b.textContent=n;nm.append(b,meta(r));m.appendChild(nm);tm.appendChild(m);});
    /* 待辦：整列可點切換完成；底部完成度（Progress 原子） */
    const ts=card('ts','待辦任務','本週');const list=ce('div','hx-ts-l');ts.appendChild(list);
    const tf=ce('div','hx-kpi-f');let tpb=prgEl('bar','s',{value:0});const cnt=meta('');tf.append(tpb,cnt);ts.appendChild(tf);
    const recount=()=>{const all=list.querySelectorAll('.hx-task').length,done=list.querySelectorAll('.hx-task.is-done').length;cnt.textContent=done+' / '+all+' 完成';
      const n=prgEl('bar','s',{value:all?Math.round(done/all*100):0});tpb.replaceWith(n);tpb=n;};
    const task=(text,label,intent,done,first)=>{const r=ce('button','hx-task');r.type='button';r.setAttribute('role','checkbox');
      const paint=on=>{r.classList.toggle('is-done',on);r.setAttribute('aria-checked',String(on));const c=cbxEl(on?'checked':'default','s');const old=r.querySelector('.cbx');if(old)old.replaceWith(c);else r.prepend(c);};
      const t=ce('span','hx-task-t');t.textContent=text;r.append(t,tag('soft',intent,label));paint(done);
      r.onclick=()=>{paint(!r.classList.contains('is-done'));recount();};if(first)list.prepend(r);else list.appendChild(r);recount();return r;};
    [['確認主色與輔助色','設計','brand',true],['圓角 token 定案','設計','brand',true],['Button 寫進 Figma','Figma','info',false],['跑 sync drift 檢查','前端','brand2',false],['Modal 文案校稿','內容','neutral',false],['活動頁 Hero 切版','前端','brand2',false]].forEach(a=>task(...a));
    /* 快速新增：新增／清除在標題列（size s）；欄位＝任務名稱／負責人（Dropdown）／截止日（Date Picker）／優先度（Segmented）／標籤（Dropdown 多選 chips）／通知（Switch）；HOME6:v1 拿掉說明 */
    const fx=ce('div','hx-fm-x');const cl=btn('outline','secondary','s','清除'),add=btn('solid','primary','s','新增');fx.append(cl,add);
    const fm=card('fm','快速新增',fx);const fg=ce('div','hx-fm-g');fm.appendChild(fg);
    const fld=(label,node,cls)=>{const f=fldEl('vertical','default',{label});const ctl=f.querySelector('.fld-ctl');ctl.innerHTML='';ctl.appendChild(node);if(cls)f.classList.add(cls);
      const lb=f.querySelector('.fld-label'),inp=node.matches('textarea,input')?node:null;
      if(inp){inp.id='fld-'+(++FLD_ID);lb.htmlFor=inp.id;}else{const c=node.querySelector('[role="combobox"]');if(c)c.setAttribute('aria-label',label);}
      fg.appendChild(f);return f;};
    const fl=fldEl('vertical','default',{live:true,label:'任務名稱',placeholder:'例如：Card 元件驗收',value:'Card 元件驗收'});fl.classList.add('hx-fm-full');fg.appendChild(fl);
    const inp=fl.querySelector('input');
    let owner='林語晨',tags=['設計'];
    fld('負責人',ddField('outline',{options:MEM.map(m=>m[0]),value:owner,onChange:v=>{owner=v;}}));
    fld('截止日',dpkLive('single'),'hx-fm-up');
    const pg=sgmEl('soft','s',{live:true,full:true,items:['低','中','高'],active:1,label:'優先度'});fld('優先度',pg);
    fld('標籤',ddField('outline',{multi:true,options:['設計','前端','Figma','內容'],value:'設計',placeholder:'選擇標籤',onChange:v=>{tags=v;}}),'hx-fm-up');
    const sw=ce('label','hx-fm-sw hx-fm-full');const s=ce('button','switch on');s.type='button';s.setAttribute('role','switch');s.setAttribute('aria-checked','true');s.setAttribute('aria-label','通知成員');
    s.onclick=()=>{const on=!s.classList.contains('on');s.classList.toggle('on',on);s.setAttribute('aria-checked',String(on));};sw.append(meta('通知成員'),s);fg.appendChild(sw);
    const TI={'設計':'brand','前端':'brand2','Figma':'info','內容':'neutral'};
    add.onclick=()=>{const v=(inp&&inp.value||'').trim();if(!v){if(inp)inp.focus();return;}
      const hi=pg.querySelector('.is-active')&&pg.querySelector('.is-active').textContent.trim()==='高';const lb=tags[0]||'新';
      task(v,lb,hi?'danger':(TI[lb]||'neutral'),false,true);
      const all=[...list.querySelectorAll('.hx-task')];if(all.length>7){const old=all.reverse().find(x=>x.classList.contains('is-done'))||all[0];old.remove();recount();}inp.value='';};
    cl.onclick=()=>{if(inp){inp.value='';inp.focus();}};
  }

  /* 標題尾字輪播（打字效果）＋每個字各自的顏色（primitive token，淺／深各一階）；刪完換下一個字時顏色以 --dur-slow／--ease-out 漸變，游標用 currentColor 跟著變。
     減少動態時固定顯示第一個字與顏色 */
  /* HERO-FLOW:v1 Hero 互動背景：點陣像水面一樣流動（斜向湧浪＋兩組慢速正弦把浪扭彎），浪頭上的點放大、偏向字色，少數變資訊藍；
     游標附近的點被推開、離開後彈回；點背景空白處發出一圈波；主光暈以彈性補間跟隨游標。
     顏色＝字色 --ink 混進底色 --canvas 的比例（淺深兩主題對比一致；深色再打 8 折，暗底上的亮點看起來比較刺）。
     滑鼠裝置 60fps；觸控裝置 30fps 省電、沒有游標推開；減少動態時不啟用（CSS 靜態點陣）；離開畫面或分頁隱藏時停止 rAF */
  function hxHeroFx(hero){const bg=hero.querySelector('.hx-hero-bg');if(!bg||HX_REDUCE())return;
    const fine=matchMedia('(pointer:fine)').matches;
    const cv=document.createElement('canvas');bg.appendChild(cv);bg.classList.add('has-fx');const cx=cv.getContext('2d');
    /* 參數＝2026-11-12 試玩頁選定值：點距 23、浪紋 600、流速 .25、位移 8、放大 1.3、變深 .1、藍點比例 .12、點擊波速 195 */
    const G=23,R=110,PUSH=18,SC=1/600,SP=.25,AMP=8,GROW=1.3,INK=.1,ACC=.12,RING=195*2.2,FPS=fine?60:30,B=6,TAU=6.2832;
    let W=0,H=0,dpr=1,pts=[],mx=-9999,my=-9999,gx=.5,gy=0,tgx=.5,tgy=0,raf=0,vis=true,active=false,last=0,shocks=[],col={base:'#999',acc:'#3B82F6',bins:[]};
    const t0=performance.now();
    const hash=(x,y)=>{const v=Math.sin(x*12.9898+y*78.233)*43758.5453;return v-Math.floor(v);};   // 每個點固定的亂數（決定誰會變藍）
    const rgb=c=>{cx.fillStyle='#000';cx.fillStyle=c;const v=cx.fillStyle;return v[0]==='#'?[1,3,5].map(i=>parseInt(v.slice(i,i+2),16)):v.match(/[\d.]+/g).slice(0,3).map(Number);};   // 任何 CSS 色 → [r,g,b]
    const readCol=()=>{const cs=getComputedStyle(hero),g=k=>cs.getPropertyValue(k).trim();
      const ink=rgb(g('--ink')||'#111'),cvs=rgb(g('--canvas')||'#fff'),dk=(cvs[0]*.299+cvs[1]*.587+cvs[2]*.114)/255<.5?.8:1;
      const tone=t=>'rgb('+ink.map((v,i)=>Math.round(cvs[i]+(v-cvs[i])*Math.min(1,t*dk))).join(',')+')';   // 字色混進底色 t
      col={base:tone(.22),acc:g('--c-info-500')||'#3B82F6',bins:Array.from({length:B},(_,i)=>tone(.22+(i+.5)/B*INK*.45))};};
    const draw=(now)=>{const t=(now-t0)/1000,ot=t*SP;let moving=false;cx.clearRect(0,0,W,H);
      shocks=shocks.filter(s=>t-s.t<2.6);
      const bins=Array.from({length:B},()=>new Path2D()),accP=new Path2D(),base=new Path2D();
      for(const p of pts){let k=0,disp=0,ux=0,uy=0;
        /* 洋流：斜線往右下推進、被扭彎；只有浪頭那幾條變亮 */
        const x=p.x*SC,y=p.y*SC,warp=1.1*Math.sin(y*2.3+ot*.9)+.8*Math.sin(x*1.6-ot*.6),n=Math.sin((x*.82+y*.57)*TAU+warp-ot*4);
        const o=Math.pow(.5+.5*n,5);k=o;ux=Math.cos(n*3);uy=Math.sin(n*3);disp=o*.8;
        for(const s of shocks){const dx=p.x-s.x,dy=p.y-s.y,d=Math.hypot(dx,dy)||1,rr=(t-s.t)*RING+10,e=Math.exp(-(((d-rr)/16)**2))*Math.exp(-(t-s.t)*1.4);
          if(e>.01){k=Math.max(k,e);disp+=e*1.2;ux=dx/d;uy=dy/d;}}
        /* 游標推開（只有滑鼠） */
        let tx=0,ty=0;const dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;
        if(d2<R*R){const d=Math.sqrt(d2)||1,f=1-d/R;tx=dx/d*PUSH*f*f*2;ty=dy/d*PUSH*f*f*2;}
        p.ox+=(tx-p.ox)*.14;p.oy+=(ty-p.oy)*.14;if(Math.abs(tx-p.ox)>.05||Math.abs(ty-p.oy)>.05)moving=true;
        k=Math.max(k,Math.min(1,Math.hypot(p.ox,p.oy)/PUSH));
        const px=p.x+p.ox+ux*disp*AMP,py=p.y+p.oy+uy*disp*AMP,r=1+GROW*k;
        if(k<.06){base.moveTo(px+1,py);base.arc(px,py,1,0,TAU);continue;}
        if(k>.45&&p.h<ACC){accP.moveTo(px+r,py);accP.arc(px,py,r,0,TAU);continue;}
        const b=Math.min(B-1,Math.floor(k*B));bins[b].moveTo(px+r,py);bins[b].arc(px,py,r,0,TAU);}
      cx.fillStyle=col.base;cx.fill(base);
      for(let i=0;i<B;i++){cx.fillStyle=col.bins[i];cx.fill(bins[i]);}   // 越強越接近字色
      cx.fillStyle=col.acc;cx.fill(accP);return moving;};
    const build=()=>{const r=bg.getBoundingClientRect();W=r.width;H=r.height;if(!W||!H)return;dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
      pts=[];for(let y=1;y<H;y+=G)for(let x=1;x<W;x+=G)pts.push({x,y,ox:0,oy:0,h:hash(x,y)});readCol();draw(performance.now());kick();};
    /* 持續流動：每幀都畫，但依 FPS 節流；看不到（滑出畫面／分頁隱藏）就停 */
    const loop=(now)=>{raf=0;if(!vis||document.hidden||!hero.isConnected)return;raf=requestAnimationFrame(loop);if(now-last<1000/FPS-2)return;last=now;
      gx+=(tgx-gx)*.08;gy+=(tgy-gy)*.08;
      bg.style.setProperty('--gx',(gx*100).toFixed(2)+'%');bg.style.setProperty('--gy',(gy*100).toFixed(2)+'%');
      draw(now);};
    const kick=()=>{if(!raf)raf=requestAnimationFrame(loop);};
    new ResizeObserver(()=>build()).observe(bg);
    new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)kick();}).observe(hero);
    viewOn(document,'visibilitychange',()=>{if(!document.hidden)kick();});
    viewObs(new MutationObserver(()=>{readCol();draw(performance.now());})).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    /* 點背景空白處（不是按鈕／連結／試玩區）→ 從那裡發出一圈波；觸控點一下也會 */
    hero.addEventListener('click',e=>{if(e.target.closest('a,button,input,select,textarea,label,[role=button],.btn,.hx-pgx'))return;
      const r=bg.getBoundingClientRect();shocks.push({x:e.clientX-r.left,y:e.clientY-r.top,t:(performance.now()-t0)/1000});kick();});
    requestAnimationFrame(build);
    if(!fine)return;   // 觸控裝置：只有流動＋點一下發波，沒有協作游標
    const cur=ce('div','hx-cur');cur.setAttribute('aria-hidden','true');cur.setAttribute('data-i18n-skip','');   /* LOC-SRC:v1 標籤自己依語言選字 */
    cur.innerHTML='<svg viewBox="0 0 18 18"><path d="M2 1.5 16 7.2 9.6 9.4 7.1 16Z" fill="var(--cur-c)" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg><span class="hx-cur-tag">yuu</span>';
    document.body.appendChild(cur);viewDone(()=>cur.remove());let cx2=0,cy2=0,tx2=0,ty2=0,seen=false;const home=()=>hero.closest('.hx');requestAnimationFrame(()=>{const h=home();if(h)h.classList.add('has-cur');});   // 整個首頁都有協作游標
    const cloop=()=>{cx2+=(tx2-cx2)*.32;cy2+=(ty2-cy2)*.32;cur.style.transform='translate3d('+cx2.toFixed(1)+'px,'+cy2.toFixed(1)+'px,0)';
      if(Math.abs(tx2-cx2)>.3||Math.abs(ty2-cy2)>.3)requestAnimationFrame(cloop);else cur.__r=0;};
    /* 游標標籤依段落換字（打字效果：先逐字刪到共同前綴，再逐字打出新字；減少動態時直接換） */
    const CUR_LB=[['#hxHero','yuu'],['#hxWall','component'],['#hxStats','about'],['#hxShow','motion'],['#hxFlow','how2use'],['#hxFigma','highlight'],['#hxVoice','feedback'],['#hxMap','worldwide'],['#hxNews','question'],['#hxContact','Talk']];   /* HOME-CONTACT:v1 */
    /* LOC-SRC:v1 游標標籤三語（逐字打字，不走字典） */
    const CUR_T={component:{zh:'元件',ja:'コンポーネント'},about:{zh:'關於',ja:'概要'},motion:{zh:'動態',ja:'モーション'},how2use:{zh:'怎麼用',ja:'使い方'},highlight:{zh:'亮點',ja:'ハイライト'},feedback:{zh:'回饋',ja:'フィードバック'},worldwide:{zh:'全球',ja:'世界へ'},question:{zh:'問答',ja:'質問'}};
    const ctag=cur.querySelector('.hx-cur-tag');let cWant='yuu',cT=0;
    const cStep=()=>{cT=0;const now=ctag.textContent;
      if(now===cWant){cur.classList.remove('is-typing');return;}
      cur.classList.add('is-typing');
      if(!cWant.startsWith(now)){ctag.textContent=now.slice(0,-1);cT=setTimeout(cStep,chtxMs('--dur-fast')*.25);}
      else{ctag.textContent=cWant.slice(0,now.length+1);cT=setTimeout(cStep,chtxMs('--dur-fast')*.4);}};
    const cSet=w=>{if(w===cWant)return;cWant=w;if(HX_REDUCE()){ctag.textContent=w;return;}if(!cT)cStep();};
    const onMove=e=>{if(!hero.isConnected){document.removeEventListener('pointermove',onMove);cur.remove();return;}
      if(!e.isTrusted)return;   // 動態展示的自動示範會派發合成 pointer 事件給圖表做 hover，協作游標只跟真實滑鼠
      if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;const h=home();if(!h||!h.contains(e.target)){cur.classList.remove('on');seen=false;return;}
      {const hit=CUR_LB.find(([q])=>e.target.closest(q));if(hit){let w=hit[1];try{const t=CUR_T[w];if(t&&t[I18N_LANG])w=t[I18N_LANG];}catch(e){}cSet(w);}}   // LOC-SRC:v1 游標標籤依語言
      if(hero.contains(e.target)){const r=bg.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;active=true;kick();}
      tx2=e.clientX;ty2=e.clientY;if(!seen){cx2=tx2;cy2=ty2;seen=true;}
      const over=(!!e.target.closest('a,button,input,[role=button],.btn,.hx-pgx')&&!e.target.closest('.hx-tile'))||!!e.target.closest('#hxPhones');   /* 手機跑馬燈段落只留「查看範本」跟隨按鈕 */cur.classList.toggle('on',!over);
      if(!cur.__r){cur.__r=1;requestAnimationFrame(cloop);}};
    viewOn(document,'pointermove',onMove,{passive:true});
    hero.addEventListener('pointerleave',()=>{mx=my=-9999;active=false;kick();});
    viewOn(document.documentElement,'pointerleave',()=>{cur.classList.remove('on');seen=false;});}

  /* 標題尾字輪播（打字效果）：先播英文 4 個詞、再換中文 4 個詞，循環；換語言時前兩行淡出淡入。減少動態時固定英文第一個詞 */
  function hxTypeword(el){
    /* LOC-SRC:v1 依網站語言：每種語言一組前兩行＋4 個輪播詞；換語言時整組換掉重新打字 */
    const HL={en:{l1:'Tune one token,',l2:'every component ',W:['recolors','rounds','reweights','tightens'],a:'Tune one token, every component follows.'},
      zh:{l1:'調一個 token，',l2:'所有元件跟著',W:['換色','變圓','換字重','變緊湊'],a:'調一個 token，所有元件跟著變。'},
      ja:{l1:'token ひとつで、',l2:'全コンポーネントが',W:['色を変える','丸くなる','太くなる','引き締まる'],a:'token ひとつで、全コンポーネントが変わる。'}};
    const hlLang=()=>{try{return HL[I18N_LANG]?I18N_LANG:'zh';}catch(e){return 'zh';}};
    let L=[HL[hlLang()]];
    const h1=el.closest('.hx-h1'),l1=h1&&h1.querySelector('.hx-l1'),l2=h1&&h1.querySelector('.hx-l2');
    let g=0,i=0,n=L[0].W[0].length,del=false;el.textContent=L[0].W[0];
    const box=el.closest('.hx-type')||el.parentNode;const tone=k=>{if(box)box.dataset.w=String(k);};tone(0);
    const setLang=k=>{if(!h1)return;const lg=hlLang();h1.lang=lg==='en'?'en':lg==='ja'?'ja':'zh-Hant';h1.classList.toggle('is-en',lg==='en');h1.setAttribute('aria-label',L[k].a);if(l1)l1.textContent=L[k].l1;if(l2)l2.textContent=L[k].l2;};setLang(0);
    if(h1)h1.setAttribute('data-i18n-skip','');
    /* LOC-SRC:v1 切換語言：換整組文字、從第一個詞重新打、重算鎖高 */
    const onLang=()=>{if(!el.isConnected){document.removeEventListener('cdl:lang',onLang);return;}L=[HL[hlLang()]];g=0;i=0;del=false;n=L[0].W[0].length;el.textContent=L[0].W[0];tone(0);setLang(0);lockH();};
    viewOn(document,'cdl:lang',onLang);
    /* 鎖高度：量兩種語言 × 每個詞的最大高度設為 min-height，換字／換語言時標題下方內容不跳動 */
    const lockH=()=>{if(!h1||!l1||!l2||!h1.isConnected)return;const sv=[l1.textContent,l2.textContent,el.textContent,h1.classList.contains('is-en'),h1.lang];h1.style.minHeight='';let mx=0;
      L.forEach(lg=>{l1.textContent=lg.l1;l2.textContent=lg.l2;lg.W.forEach(w=>{el.textContent=w;mx=Math.max(mx,h1.getBoundingClientRect().height);});});
      l1.textContent=sv[0];l2.textContent=sv[1];el.textContent=sv[2];h1.classList.toggle('is-en',sv[3]);h1.lang=sv[4];h1.style.minHeight=Math.ceil(mx)+'px';};
    lockH();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(lockH);
    {let rt;viewOn(window,'resize',()=>{clearTimeout(rt);rt=setTimeout(lockH,150);});}
    if(HX_REDUCE())return;
    const tick=()=>{if(!el.isConnected)return;let wait=chtxMs('--dur-fast')*(g?1:.6);
      if(!document.hidden){const W=L[g].W;const hold=!!(box&&box.__hold);   // HERO-DSEL:v1 滑鼠停在字上：正在刪的字倒回打完，打完就停住不刪
        if(hold&&del)del=false;
        if(del){n--;if(n<=0){del=false;n=0;i++;
          if(i>=W.length){i=0;g=(g+1)%L.length;                        // 換語言：前兩行淡出 → 換字 → 淡入
            if(h1&&L.length>1){h1.classList.add('is-swap');setTimeout(()=>{setLang(g);h1.classList.remove('is-swap');},chtxMs('--dur-default'));}
            wait=chtxMs('--dur-default',2.2);}
          else wait=chtxMs('--dur-default',1.4);
          tone(i);}}
        else{n++;if(n>=W[i].length){n=W[i].length;if(hold)wait=chtxMs('--dur-default');else{del=true;wait=chtxMs('--dur-slow',5);}}}
        el.textContent=L[g].W[i].slice(0,Math.max(0,n));if(box&&box.__dsUpd)box.__dsUpd();}
      setTimeout(tick,wait);};
    setTimeout(tick,chtxMs('--dur-slow',5));}

  /* 控制面板：取用 Slider（sldEl）、Segmented（sgmEl）原子；色票＋自訂選色（同 Design Token 頁的 input[type=color]） */
  function hxPanel(pnl,pv,refresh){const body=pnl.__hxB||pnl.querySelector('.hx-pnl-b');body.innerHTML='';  /* HOME7:v1 本體可能暫時搬進手機 Modal */
    const grp=t=>{const g=ce('div','hx-grp');g.setAttribute('role','group');g.setAttribute('aria-label',t);body.appendChild(g);return g;};  // 分組不顯示小標（保留 aria-label）
    const row=(g,lb,node)=>{const r=ce('div','hx-ctl');if(lb){const l=ce('span','hx-ctl-lb');l.textContent=lb;r.appendChild(l);}r.appendChild(node);g.appendChild(r);return r;};
    const swatches=(list,key,ckey,lb)=>{const w=ce('div','hx-sws');w.setAttribute('role','radiogroup');w.setAttribute('aria-label',lb);
      const paint=()=>w.querySelectorAll('.hx-sw-b').forEach(b=>{const on=b.dataset.k===HX_ST[key];b.classList.toggle('on',on);b.setAttribute('aria-checked',String(on));});
      list.forEach(s=>{const b=ce('button','hx-sw-b'+(s.none?' hx-sw-none':''));b.type='button';b.dataset.k=s.k;b.setAttribute('role','radio');b.setAttribute('aria-label',s.label);b.title=s.label;
        b.style.setProperty('--sw-l','var('+s.light+')');b.style.setProperty('--sw-d','var('+s.dark+')');b.onclick=()=>{HX_ST[key]=s.k;paint();refresh();};w.appendChild(b);});
      const cu=ce('label','hx-sw-b hx-sw-custom');cu.dataset.k='custom';cu.title='自訂顏色';cu.setAttribute('role','radio');cu.style.setProperty('--sw-c',HX_ST[ckey]);
      const ci=document.createElement('input');ci.type='color';ci.value=HX_ST[ckey];ci.setAttribute('aria-label',lb+'：自訂顏色');
      ci.oninput=()=>{HX_ST[ckey]=ci.value;HX_ST[key]='custom';cu.style.setProperty('--sw-c',ci.value);paint();refresh();};
      ci.onclick=()=>{if(HX_ST[key]!=='custom'){HX_ST[key]='custom';paint();refresh();}};
      cu.innerHTML='<span class="hx-sw-plus" aria-hidden="true">'+ICON_PENCIL+'</span>';cu.appendChild(ci);w.appendChild(cu);paint();return w;};
    /* 色號欄：左＝色票預覽（點開選色器）、右＝輸入色號；欄位空白＝回到預設 */
    const colorIn=(list,key,ckey,lb)=>{const def=list[0],dark=hxPrevDark();
      const defHex=def.none?'':hxHex(hxRgb('var('+(dark?def.dark:def.light)+')'));
      const cur=HX_ST[key]==='custom'?HX_ST[ckey].toUpperCase():HX_ST[key]===def.k?defHex:hxHex(hxRgb('var('+((list.find(x=>x.k===HX_ST[key])||def)[dark?'dark':'light'])+')'));
      const box=flwColor(cur,v=>{const h=flwHex(v);
        if(!String(v).trim()){HX_ST[key]=def.k;box.classList.remove('is-bad');refresh();return;}
        if(!h){box.classList.add('is-bad');return;}box.classList.remove('is-bad');
        if(h.toUpperCase()===defHex){HX_ST[key]=def.k;}else{HX_ST[key]='custom';HX_ST[ckey]=h;}refresh();},def.none?'不染色':defHex);
      box.classList.add('hx-color');box.__text.setAttribute('aria-label',lb+' 色號');if(!cur)box.querySelector('.tok-sw-btn').value='#ffffff';return box;};
    const seg=(items,key,lb)=>sgmEl('outline','s',{live:true,full:true,items,active:HX_ST[key],label:lb,onChange:i=>{HX_ST[key]=i;refresh();}});
    const sld=(title,key,min,max,step,fmt)=>{const s=sldEl('single','s','default',{live:true,variant:'fill',title,value:HX_ST[key],min,max,step,format:fmt,onChange:v=>{HX_ST[key]=v;refresh();}});s.classList.add('hx-sld');return s;};
    const g1=grp('顏色');
    row(g1,'主色',colorIn(HX_PRIM,'primary','primaryC','主色'));
    row(g1,'輔助色',colorIn(HX_SEC,'second','secondC','輔助色'));
    row(g1,'預覽主題',sgmEl('outline','s',{live:true,full:true,items:['淺色','深色'],active:HX_ST.theme,label:'預覽主題',onChange:i=>{HX_ST.theme=i;HX_THEME_USER=true;refresh();}}));
    const g2=grp('形狀');
    row(g2,null,sld('元件圓角','radius',0,16,1,v=>v+'px'));
    row(g2,null,sld('外框粗細','bw',0,3,1,v=>v+'px'));
    row(g2,null,sld('外框深淺','bc',0,100,5,v=>v+'%'));
    row(g2,'陰影',seg(HX_SHADOW,'shadow','陰影'));
    const g3=grp('文字');
    row(g3,'字體',seg(HX_FONTS.map(x=>x.label),'font','字體'));
    row(g3,'字重',seg(['細','標準','粗'],'weight','字重'));
    row(g3,null,sld('字級比例','scale',85,125,5,v=>v+'%'));
    const g4=grp('間距與動態');
    row(g4,null,sld('間距密度（--sp-*）','density',75,150,5,v=>v+'%'));
    row(g4,null,sld('動態速度（--dur-*）','motion',25,200,25,v=>(v/100).toFixed(2).replace(/0$/,'')+'×'));
  }

  /* HERO-DSEL:v1 尾字方向感知選取（參考 Aceternity Direction Aware Selection 的互動概念，樣式沿用站內 .hx-sel）
     只在有滑鼠的裝置啟用；判斷滑鼠從哪一側進來／出去 → data-dir＝l/r/t/b，CSS 依方向決定框滑入與底色填入的起點 */
  function hxDirSel(box){
    if(!box||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const word=box.querySelector('.hx-type-w');if(!word)return;
    const ds=ce('span','hx-ds');ds.setAttribute('aria-hidden','true');
    ds.innerHTML='<span class="hx-ds-fill"></span><span class="hx-sel"><i></i><i></i><i></i><i></i></span><span class="hx-ds-tag"></span>';
    box.prepend(ds);const tag=ds.querySelector('.hx-ds-tag');
    // 依字的實際外框定位（左右多留一點呼吸空間），尺寸標籤顯示框的寬×高
    const upd=()=>{if(!ds.isConnected)return;const r=word.getBoundingClientRect(),b=box.getBoundingClientRect();
      const fs=parseFloat(getComputedStyle(box).fontSize)||48,px=Math.round(fs*.08);
      const w=Math.max(r.width,fs*.3)+px*2,h=r.height;
      ds.style.left=(r.left-b.left-px)+'px';ds.style.top=(r.top-b.top)+'px';ds.style.width=w+'px';ds.style.height=h+'px';
      tag.textContent=Math.round(w)+' × '+Math.round(h);};
    box.__dsUpd=upd;upd();
    {let rt;viewOn(window,'resize',()=>{clearTimeout(rt);rt=setTimeout(upd,150);});}
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(upd);
    // 滑鼠位置相對字框中心 → 判斷靠近哪一邊（以寬高正規化，避免長字老是判成上下）
    const edge=e=>{const r=ds.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(r.width||1),dy=(e.clientY-(r.top+r.height/2))/(r.height||1);
      return Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'t':'b');};
    // 不用 pointerenter／leave：打字換字時文字節點被替換，瀏覽器會瞬間判定「離開又進來」造成閃爍。改成自己用座標判斷是否在字框內
    let inside=false;
    const enter=e=>{inside=true;box.__hold=true;upd();
      ds.classList.add('is-snap');ds.classList.remove('is-on');ds.dataset.dir=edge(e);void ds.offsetWidth;   // 先瞬間放到進場那一側
      ds.classList.remove('is-snap');ds.classList.add('is-on');};
    const leave=e=>{inside=false;box.__hold=false;if(e)ds.dataset.dir=edge(e);ds.classList.remove('is-on');};
    const onMove=e=>{if(!box.isConnected){document.removeEventListener('pointermove',onMove);return;}
      const r=ds.getBoundingClientRect(),hit=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      if(hit&&!inside)enter(e);else if(!hit&&inside)leave(e);};
    viewOn(document,'pointermove',onMove,{passive:true});
    viewOn(document.documentElement,'pointerleave',()=>{if(inside)leave();});
  }
  function hxHero(){
    const all=NAV.flatMap(g=>g.items),ready=all.filter(x=>x.st==='ready').length;
    const hero=ce('section','hx-hero');hero.id='hxHero';
    const groups=NAV.map(g=>({label:g.group.replace(/^[A-Za-z &]+\s/,''),n:g.items.filter(x=>x.st==='ready').length,first:(g.items.find(x=>x.st==='ready')||{}).id})).filter(g=>g.n&&g.first);
    hero.innerHTML=`<div class="hx-hero-bg" aria-hidden="true"></div>
      <div class="hx-hero-in">
        <div class="hx-copy">
          <h1 class="hx-h1" aria-label="調一個 token，所有元件跟著變。"><span class="hx-l1" aria-hidden="true">調一個 token，</span><br class="hx-br"><span class="hx-l2" aria-hidden="true">所有元件跟著</span><span class="hx-type" aria-hidden="true"><span class="hx-type-w"></span><span class="hx-caret"></span></span></h1>
          <div class="hx-cta" id="hxCta"></div>
          <p class="hx-lede">${ready} 個元件共用同一套 Design Token。改一個值，網站、程式碼與 Figma Variables 會一起更新。</p>
        </div>
        <div class="hx-win-h"><h2>動手調調看 token 設定。</h2></div>
        <div class="hx-pgx" id="hxPgx">
          <aside class="hx-pnl" id="hxPnl" aria-label="Token 試玩控制">
            <span class="hx-pnl-n" id="hxPnlN" hidden></span>
            <div class="hx-pnl-b"></div>
            <div class="hx-pnl-f"><div class="hx-diff" id="hxDiff" aria-live="polite"></div><div class="hx-pnl-acts" id="hxActs"></div></div>
          </aside>
          <div class="hx-tokdock" id="hxTokDock"></div>
          <div class="hx-pv" id="hxPv" aria-label="Token 試玩預覽"></div>
        </div>
      </div>`;
    hxTypeword(hero.querySelector('.hx-type-w'));hxDirSel(hero.querySelector('.hx-type'));hxHeroFx(hero);
    hero.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();renderView(a.dataset.go);}));
    const cta=hero.querySelector('#hxCta');
    const go1=mkBtn({variant:'solid',intent:'primary',size:'l',isLive:true,trail:true});go1.querySelector('span').textContent='開始新專案';go1.onclick=()=>{location.hash='start';};
    const go2=mkBtn({variant:'soft',intent:'secondary',size:'l',isLive:true,trail:true});go2.querySelector('span').textContent='下載元件庫';go2.querySelector('span').dataset.dlT='';   /* IA-SHELL:v1 原本的「瀏覽元件」改成下載（側欄的下載入口拿掉了） */
    {const tr=go2.querySelector('svg:last-child');if(tr)tr.outerHTML=IC_DOWNLOAD;else go2.insertAdjacentHTML('beforeend',IC_DOWNLOAD);}
    go2.title='下載預設（未調整）的 token 與元件樣式';go2.onclick=()=>dsDownloadDefault(go2);
    cta.append(go1,go2);
    const pv=hero.querySelector('#hxPv'),pnl=hero.querySelector('#hxPnl'),diff=hero.querySelector('#hxDiff'),cnt=hero.querySelector('#hxPnlN');
    /* 操作控制欄位時：預覽整塊加上 Figma 式選取框（同元件牆 hover 的 .hx-sel：細框＋四角方點）；點到試玩區以外才收掉 */
    {const sel=ce('span','hx-sel hx-pv-sel');sel.setAttribute('aria-hidden','true');sel.innerHTML='<i></i><i></i><i></i><i></i>';pv.__sel=sel;
      const inCtl=t=>!!(t&&t.closest&&t.closest('#hxPnl,.hx-tok-ov,.hx-toktb,#hxActs'));
      const pgx=hero.querySelector('#hxPgx');let pg=pv;if(pgx){pg=ce('div','hx-pgx-w');pgx.replaceWith(pg);pg.appendChild(pgx);}pv.__pg=pg;const on=()=>pg.classList.add('is-sel'),off=()=>pg.classList.remove('is-sel');
      viewOn(document,'pointerdown',e=>{if(!pv.isConnected)return;if(inCtl(e.target))on();else if(!pg.contains(e.target))off();},true);
      viewOn(document,'focusin',e=>{if(!pv.isConnected)return;if(inCtl(e.target))on();},true);}
    hxPreview(pv);pv.__pg.appendChild(pv.__sel);   // 掛在整塊試玩外層（hxPreview 會重寫預覽內容）
    let reset,copy,last={},tokN=()=>{};
    const css=o=>'/* 貼到 :root（或專案的 tokens 覆寫） */\n:root {\n'+Object.entries(o).map(([k,v])=>'  '+k+': '+v+';').join('\n')+'\n}\n';
    const refresh=()=>{const o=hxApply(pv);last=o;const ks=Object.keys(o);
      diff.innerHTML='';if(!ks.length){diff.textContent='目前全部是預設 token';diff.classList.add('is-default');}
      else{diff.classList.remove('is-default');ks.forEach(k=>{const r=ce('div','hx-diff-r');const a=ce('code');a.textContent=k;const b=ce('span');let v=o[k];
        if(k==='--s-action-primary'||k==='--accent2')v=hxHex(hxRgb(v,pv));
        b.textContent=v.length>34?v.slice(0,32)+'…':v;b.title=o[k];r.append(a,b);diff.appendChild(r);});}
      cnt.textContent=ks.length?'已改 '+ks.length+' 個 token':'';tokN(ks.length);
      if(reset)reset.disabled=!ks.length;if(copy)copy.disabled=!ks.length;};
    reset=mkBtn({variant:'text',intent:'secondary',size:'s',isLive:true});reset.querySelector('span').textContent='重設';
    reset.onclick=()=>{Object.assign(HX_ST,HX_DEF);HX_THEME_USER=false;HX_ST.theme=hxSiteTheme();hxPanel(pnl,pv,refresh);refresh();};
    copy=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});copy.querySelector('span').textContent='複製 CSS 變數';
    copy.onclick=()=>{const t=css(last);const done=()=>{copy.querySelector('span').textContent='已複製';setTimeout(()=>{if(copy.isConnected)copy.querySelector('span').textContent='複製 CSS 變數';},1600);};
      try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,()=>{hxCopyFallback(t);done();});else{hxCopyFallback(t);done();}}catch(e){hxCopyFallback(t);done();}};
    hero.querySelector('#hxActs').append(reset,copy);
    /* HOME7:v1 手機（≤599）：控制項收進一顆「調整 token」按鈕（Button 原子＋Tag 原子當改動數徽章），浮在預覽底部（sticky）；
       點擊開 library Modal 的 bottom sheet（.mdl-overlay.mdl-fixed.mdl-sheet-ov ＋ .mdl-card.mdl-kind-modal.mdl-sheet），
       把同一份面板本體（.hx-pnl-b）與重設／複製按鈕搬進去 → 狀態完全共用、預覽即時更新；關閉時搬回。遮罩調淡、sheet 限高，背後預覽看得到 */
    const pb=pnl.querySelector('.hx-pnl-b'),pf=pnl.querySelector('.hx-pnl-f'),acts=hero.querySelector('#hxActs');pnl.__hxB=pb;
    const PHONE=matchMedia('(max-width:599px)');
    /* 工具列：每個分組一顆 icon-only Button（outline · secondary · s），點了開 sheet 並捲到對應分組 */
    const TB=[['顏色',PI('palette')],['形狀',PI('scan')],['文字',PI('a-large-small')],['間距與動態',PI('move-horizontal')]];
    const tb=ce('div','hx-toktb');tb.setAttribute('role','toolbar');tb.setAttribute('aria-label','調整 token');
    let fab=null;const tbBtns=TB.map(([g,ic])=>{const b=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});b.type='button';b.classList.add('icon-only','hx-toktb-b');
      b.innerHTML=ic;b.setAttribute('aria-label','調整'+g);b.title=g;b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');b.dataset.g=g;tb.appendChild(b);return b;});
    const fbd=tagEl('solid','brand2','default');fbd.classList.add('hx-tokfab-n');fbd.hidden=true;tb.appendChild(fbd);
    hero.querySelector('#hxTokDock').appendChild(tb);fab=tbBtns[0];
    let tov=null,tsub=null,tkey=null;
    tokN=n=>{fbd.hidden=!n;fbd.querySelector('span').textContent=String(n);
      fbd.setAttribute('aria-label','已改 '+n+' 個 token');
      if(tsub)tsub.textContent=n?'已改 '+n+' 個 token · 預覽即時更新':'目前全部是預設 token · 預覽即時更新';};
    const closeTok=()=>{if(!tov)return;const ov=tov;tov=null;tsub=null;document.removeEventListener('keydown',tkey,true);
      pnl.insertBefore(pb,pf);pf.appendChild(acts);tbBtns.forEach(b=>b.setAttribute('aria-expanded','false'));
      ov.classList.add('is-closing');afterAnim(ov,()=>ov.remove());if(fab.isConnected)fab.focus({preventScroll:true});};
    const openTok=(grp)=>{if(tov)return;
      const ov=ce('div','mdl-overlay mdl-fixed mdl-sheet-ov hx-tok-ov');
      const card=ce('div','mdl-card mdl-kind-modal mdl-sheet hx-tok-card');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','hxTokT');card.tabIndex=-1;
      const head=ce('div','mdl-mhead');const ht=ce('div','mdl-mhead-txt');const t=ce('div','mdl-title');t.id='hxTokT';t.textContent='調整 token';
      tsub=ce('div','mdl-sub');ht.append(t,tsub);const x=mdlClose(false);x.type='button';x.onclick=closeTok;head.append(ht,x);
      const ct=ce('div','mdl-content hx-tok-ct');ct.appendChild(pb);
      const ft=ce('div','mdl-foot hx-tok-foot');ft.appendChild(acts);
      card.append(head,ct,ft);ov.appendChild(card);
      ov.addEventListener('mousedown',e=>{if(e.target===ov)closeTok();});
      tkey=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeTok();return;}
        if(e.key==='Tab'){const f=[...card.querySelectorAll('button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(n=>n.offsetParent!==null);
          if(!f.length)return;const a=f[0],z=f[f.length-1];
          if(e.shiftKey&&(document.activeElement===a||document.activeElement===card)){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}};
      viewOn(document,'keydown',tkey,true);
      tov=ov;tokN(Object.keys(last).length);fab.setAttribute('aria-expanded','true');
      const top=pv.getBoundingClientRect().top;if(top<0||top>innerHeight*.3)pv.scrollIntoView({block:'start',behavior:HX_REDUCE()?'auto':'smooth'});  // 讓預覽上半露在 sheet 上方
      document.body.appendChild(ov);
      requestAnimationFrame(()=>{card.focus({preventScroll:true});const g=grp&&pb.querySelector('.hx-grp[aria-label="'+grp+'"]');
        if(g){ct.scrollTo({top:Math.max(0,g.offsetTop-ct.offsetTop-8),behavior:HX_REDUCE()?'auto':'smooth'});g.classList.remove('hx-grp-hl');void g.offsetWidth;g.classList.add('hx-grp-hl');}});};
    tbBtns.forEach(b=>b.onclick=()=>{fab=b;openTok(b.dataset.g);});
    viewOn(PHONE,'change',()=>{if(!PHONE.matches)closeTok();});
    window.__hxTokClose=closeTok;
    if(!HX_THEME_USER)HX_ST.theme=hxSiteTheme();
    hxPanel(pnl,pv,refresh);refresh();
    const re=()=>{if(!pv.isConnected)return;if(!HX_THEME_USER){const t=hxSiteTheme();if(t!==HX_ST.theme){HX_ST.theme=t;hxPanel(pnl,pv,refresh);}}refresh();};
    if(!window.__hxThemeWatch){window.__hxThemeWatch=true;   /* 系統深淺色：全站常駐一個就好（回呼用 window.__hxRetheme，頁面不在時自己略過） */
      matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>setTimeout(()=>window.__hxRetheme&&window.__hxRetheme(),30));}
    /* HERO-THEME:v2 網站深淺色切換：每次進首頁都重掛（換頁時由 VIEW-LIFE 關掉）。原本跟上面一起只掛一次，離開首頁被關掉後回來就不會再跟著變 */
    viewObs(new MutationObserver(()=>setTimeout(()=>window.__hxRetheme&&window.__hxRetheme(),30))).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class']});
    window.__hxRetheme=re;
    return hero;
  }
  function hxCopyFallback(t){const ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}

  /* HOME6:v1 元件牆＝跑馬燈，互動還原 designsystems.surf：
     · 自動捲動用 rAF 推 translateX（同 Framer Ticker），兩份內容無縫循環；滑過該列＝減速到 25%（不硬停，速度以 400ms 指數緩動）
     · 可拖曳（滑鼠／觸控，touch-action:pan-y＋不可選字／不可拖連結＝Framer drag 的寫法），放開後帶慣性滑行再接回自動速度；觸控板橫向滾輪也能推
     · 格子滑過＝標題列淡入並往上收（間距 22→12、名稱與「查看元件 →」4px），彈簧曲線；鍵盤聚焦同樣顯示。不用游標膠囊（參考站沒有）
     · 點格子進元件頁（拖曳後不觸發點擊）；捲出畫面／分頁在背景就停；減少動態＝不自動捲動、改原生橫向捲動
     bg＝底的種類；row＝第幾列 */
  /* HOME8:v1 元件牆改成「一列」15 格，滑過時格子裡的元件自己換狀態（參考 designsystems.surf）：
     · 拿掉 儀表板／評價／步驟／分頁器；新增 Date Picker（區間月曆）、Metric Card、Tooltip；Slider 改 fill variant；人物牌卡整張放得下
     · 每格 st(node) 回傳一串狀態：[0]＝靜止（離開時回到這裡），之後每 ~820ms 換下一個、循環；項目可寫 [fn, ms] 自訂停留
       狀態一律用元件自己的 class／工廠／事件（st-hover、st-pressed、is-open、.on、is-active、click()、keydown…），不另外重畫
     · 滑鼠滑過＋鍵盤聚焦都會循環；減少動態＝直接跳到代表狀態（peak）、不循環 */
  const HX_TS={ms:820,first:240};  // 每個狀態停留時間、滑入後第一拍（ms）
  const hxEo=k=>1-Math.pow(1-k,3);
  const hxCls=(el,re,c)=>{el.className=el.className.replace(re,c);};
  const hxBtnSt=(b,s)=>hxCls(b,/\bst-[\w-]+/,'st-'+s);
  const HX_WALL=[
    /* Button：hover → pressed → loading（Loader 原子塞進按鈕）→ 換下一顆 */
    {id:'button',bg:'grad',peak:3,mk:()=>{const w=ce('div','hx-mcol');[['solid','primary','開始使用'],['outline','secondary','稍後再說'],['soft','secondary','了解更多']].forEach(([v,i,t])=>{const b=mkBtn({variant:v,intent:i,size:'m'});b.querySelector('span').textContent=t;w.appendChild(b);});return w;},
      st:w=>{const B=[...w.querySelectorAll('.btn')],L=B.map(b=>b.querySelector('span')),T=L.map(s=>s.textContent);
        const set=(i,s)=>B.forEach((b,j)=>hxBtnSt(b,j===i?s:'default'));
        const load=on=>{const b=B[0];let l=b.querySelector('.ld-circ');if(on&&!l){l=ce('span','ld-circ ld-sz-s hx-btn-ld');l.setAttribute('aria-hidden','true');b.prepend(l);}else if(!on&&l)l.remove();
          if(on)b.setAttribute('aria-busy','true');else b.removeAttribute('aria-busy');L[0].textContent=on?'處理中…':T[0];};
        return [()=>{load(false);set(-1);},()=>set(0,'hover'),()=>set(0,'pressed'),[()=>{set(-1);load(true);},1600],()=>{load(false);set(1,'hover');},()=>set(1,'pressed'),()=>set(2,'hover'),()=>set(2,'pressed')];}},
    /* Dropdown：展開狀態 → 游標往下滑過選項 → 選定收合 → 再展開 */
    {id:'dropdown',bg:'dots',peak:2,mk:()=>{const w=ddField('outline',{value:'台中市'});w.querySelector('.ddmenu').classList.add('is-open');const t=w.querySelector('.field');t.classList.add('st-open');const c=w.querySelector('.ddcaret');if(c)c.classList.add('up');return w;},
      st:w=>{const T=w.querySelector('.field'),M=w.querySelector('.ddmenu'),C=w.querySelector('.ddcaret'),O=[...M.querySelectorAll('.ddopt')];
        const open=v=>{M.classList.toggle('is-open',v);T.classList.toggle('st-open',v);if(C)C.classList.toggle('up',v);T.setAttribute('aria-expanded',String(v));};
        const sim=i=>O.forEach((o,j)=>o.classList.toggle('hx-sim',j===i));
        const pick=i=>{sim(-1);O.forEach((o,j)=>{o.classList.toggle('sel',j===i);o.setAttribute('aria-selected',String(j===i));});const v=w.querySelector('.dd-body .val');if(v)v.textContent=O[i].textContent;open(false);};
        return [()=>{pick(1);open(true);},()=>sim(2),()=>sim(3),()=>pick(3),()=>open(true),()=>sim(0),()=>sim(1),()=>pick(1),()=>open(true)];}},
    /* Notification：新通知從上方落入、舊的往右淡出（nt-in／nt-out），最多疊三張 */
    {id:'notification',bg:'grad2',peak:1,mk:()=>{const w=ce('div','hx-mcol hx-w-nt');const a=ntEl('soft','success',{close:true});const b=ntEl('dark','info',{close:true,desc:false});[a,b].forEach(n=>{n.classList.add('nt-in');w.appendChild(n);});return w;},
      st:w=>{const [A,B]=[...w.children],C=ntEl('soft','warning',{close:true,desc:false}),D=ntEl('outline','error',{close:true,desc:false}),P=[A,B,C,D];
        const show=(list,out)=>{P.forEach(n=>{if(!list.includes(n)&&n.parentNode===w)n.remove();});
          for(let i=list.length-1;i>=0;i--){const n=list[i];if(n.parentNode!==w){const ref=list.slice(i+1).find(m=>m.parentNode===w)||null;n.classList.remove('nt-out','nt-in');w.insertBefore(n,ref);void n.offsetWidth;n.classList.add('nt-in');}}
          list.forEach(n=>{const o=n===out;if(o){n.classList.remove('nt-in');n.classList.add('nt-out');}else if(n.classList.contains('nt-out')){n.classList.remove('nt-out');n.classList.add('nt-in');}});};
        return [()=>show([A,B]),[()=>show([C,A,B]),1000],[()=>show([C,A,B],B),420],()=>show([C,A]),[()=>show([D,C,A]),1000],[()=>show([D,C,A],C),420],()=>show([D,A]),[()=>show([D,A],D),420],()=>show([A])];}},
    /* Tag：chip 滑過（st-hover）→ 點選變實心 → 取消 */
    {id:'tag',bg:'check',peak:2,mk:()=>{const r=ce('div','hx-mrow hx-wrap hx-w-tag');[['solid','brand','設計中'],['outline','neutral','已上線'],['outline','info','Figma'],['soft','warning','待審'],['soft','brand2','v7'],['outline','neutral','Token'],['outline','neutral','需修正'],['outline','neutral','新功能'],['outline','neutral','元件 70'],['outline','neutral','通過'],['outline','neutral','Beta'],['outline','neutral','草稿']].forEach(([v,i,t])=>{const g=tagEl(v,i,'default');g.querySelector('span').textContent=t;r.appendChild(g);});return r;},
      st:r=>{const G=[...r.children],V0=G.map(g=>(g.className.match(/\bv-(\w+)/)||[])[1]);
        const v=(i,x)=>hxCls(G[i],/\bv-\w+/,'v-'+x),h=i=>G.forEach((g,j)=>hxCls(g,/\bst-[\w-]+/,'st-'+(j===i?'hover':'default')));
        const base=()=>G.forEach((g,i)=>v(i,V0[i]));
        return [()=>{base();h(-1);},()=>h(2),()=>{v(2,'solid');h(-1);},()=>h(3),()=>{v(3,'solid');h(-1);},()=>h(0),()=>{v(0,'outline');h(-1);},()=>h(4),()=>{v(4,'solid');h(-1);},()=>{base();h(-1);}];}},
    /* Avatar group：逐顆往上浮 → 「+2」展開成全部成員 → 收合 */
    {id:'avatar',bg:'photo',peak:6,mk:()=>{const g=avtGroup('l',6,4);const more=g.querySelector('.avt-more');
        /* 人物頭貼：Avatar 原子的 image 內容型，照片取站內 CARD_AV（5 張循環） */
        const ph=i=>{const P=AVT_PEOPLE[i%6];const a=avtEl('l','circle','image',{src:CARD_AV[i%CARD_AV.length],name:P[0]});return a;};
        [...g.querySelectorAll('.avt:not(.avt-more)')].forEach((a,i)=>a.replaceWith(ph(i)));
        for(let i=4;i<6;i++){const a=ph(i);a.classList.add('hx-avx');g.insertBefore(a,more);}return g;},
      st:g=>{const A=[...g.querySelectorAll('.avt:not(.hx-avx)')];
        const lift=i=>A.forEach((a,j)=>a.classList.toggle('hx-sim',j===i)),all=v=>g.classList.toggle('hx-all',v);
        return [()=>{all(false);lift(-1);},()=>lift(0),()=>lift(1),()=>lift(2),()=>lift(3),()=>lift(4),[()=>{lift(-1);all(true);},1700],()=>all(false)];}},
    /* Toggle：開關逐個切換（.on，旋鈕走元件自己的彈簧曲線） */
    {id:'toggle',bg:'dots',peak:1,mk:()=>{const w=ce('div','hx-mcol hx-w-tgl');[['通知成員','on'],['自動同步','on'],['公開專案','off']].forEach(([t,s])=>{const r=ce('div','hx-tgl-r');const l=ce('span');l.textContent=t;r.append(l,switchEl(s));w.appendChild(r);});return w;},
      st:w=>{const S=[...w.querySelectorAll('.switch')];const set=(...v)=>S.forEach((s,i)=>s.classList.toggle('on',!!v[i]));
        return [()=>set(1,1,0),()=>set(1,1,1),()=>set(0,1,1),()=>set(0,0,1),()=>set(1,0,0),()=>set(1,1,0)];}},
    /* Slider（fill variant）：用元件自己的鍵盤邏輯一格一格推，ease-out 補間決定每幀推到哪；推的時候掛 is-drag */
    {id:'slider',bg:'dash',peak:1,mk:()=>{const w=ce('div','hx-mcol hx-w-full hx-gap5');w.append(sldEl('range','m','default',Object.assign({live:true,variant:'fill',value:[500,2000],title:'價格區間'},SLD_PRICE)),sldEl('single','m','default',{live:true,variant:'fill',value:60,title:'音量',format:x=>x+'%'}));return w;},
      st:w=>{const [R,S]=[...w.querySelectorAll('.fsl')],H=[...R.querySelectorAll('.fsl-h')],h1=S.querySelector('.fsl-h');
        const val=h=>+h.getAttribute('aria-valuenow');
        const key=(h,k)=>h.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));
        const to=(K,f,pairs,step)=>{f.classList.add('is-drag');const st=pairs.map(([h,b])=>[h,val(h),b]);
          K.tween(560,k=>{const e=hxEo(k);for(let pass=0;pass<2;pass++)st.forEach(([h,a,b])=>{const want=a+(b-a)*e;let g=80;
            while(g--&&Math.abs(val(h)-want)>=step/2){const v0=val(h);key(h,want>v0?'ArrowRight':'ArrowLeft');if(val(h)===v0)break;}});},()=>f.classList.remove('is-drag'));};
        return [K=>{to(K,R,[[H[0],500],[H[1],2000]],100);to(K,S,[[h1,60]],1);},K=>to(K,S,[[h1,88]],1),K=>to(K,R,[[H[1],3600],[H[0],1200]],100),K=>to(K,S,[[h1,30]],1),K=>to(K,R,[[H[0],300],[H[1],1500]],100)];}},
    /* Date Picker：月曆面板（區間）。游標滑過日期（hx-sim）→ 點起點 → 往後滑時預覽區間（is-in-range）→ 點終點；點擊走 calMonthEl 自己的區間邏輯 */
    {id:'date-picker',bg:'grad',peak:4,mk:()=>{const p=ce('div','pop dpk-pop dpk-pop-static hx-w-cal');p.appendChild(calMonthEl('s',{range:true,rangeText:true,interactive:true}));return p;},
      st:p=>{const cal=()=>p.querySelector('.cal'),days=()=>[...cal().querySelectorAll('.cal-day:not(.is-out)')],day=d=>days().find(b=>+b.textContent===d);
        const sim=(d,from)=>days().forEach(b=>{const n=+b.textContent;b.classList.toggle('hx-sim',n===d);if(from)b.classList.toggle('is-in-range',n>from&&n<d);});
        const tap=d=>{const b=day(d);if(b)b.click();};
        return [()=>cal().replaceWith(calMonthEl('s',{range:true,rangeText:true,interactive:true})),()=>sim(20),()=>tap(20),()=>sim(22,20),()=>sim(24,20),[()=>tap(24),1500]];}},
    /* Progress：數值往上推（寬度走元件自己的 ease-out）→ 滿格變 success → 重新掃描 */
    {id:'progress',bg:'check',peak:2,mk:()=>{const w=ce('div','hx-mcol hx-w-full');const p=prgEl('label','m',{value:68});const c=p.querySelector('.prg-cap');if(c)c.textContent='元件覆蓋率';w.appendChild(p);return w;},
      st:w=>{const P=w.querySelector('.prg'),F=P.querySelector('.prg-fill'),N=P.querySelector('.prg-pct'),Cp=P.querySelector('.prg-cap');
        const set=(K,v,cap,ok)=>{const a=parseInt(N.textContent,10)||0;F.style.width=v+'%';P.setAttribute('aria-valuenow',v);hxCls(F,/\bi-\w+/,'i-'+(ok?'success':'primary'));if(Cp)Cp.textContent=cap;
          K.tween(800,k=>{N.textContent=Math.round(a+(v-a)*hxEo(k))+'%';});};
        return [K=>set(K,68,'元件覆蓋率'),K=>set(K,84,'元件覆蓋率'),[K=>set(K,100,'覆蓋完成',true),1500],K=>set(K,24,'重新掃描…'),K=>set(K,52,'重新掃描…')];}},
    /* Tab（pill）：分頁滑過（st-hover）→ 點選，滑動指示器跟著走 */
    {id:'tab',bg:'grad2',peak:2,mk:()=>tabBarLive('pill',{}),
      st:bar=>{const T=[...bar.querySelectorAll('.tabi')];const hov=i=>T.forEach((t,j)=>t.classList.toggle('st-hover',j===i));const go=i=>{hov(-1);T[i].click();};
        return [()=>go(0),()=>hov(1),()=>go(1),()=>hov(2),()=>go(2),()=>hov(0),()=>go(0)];}},
    /* Person Card：照片推近 → 加入鈕 hover／pressed → Added → 取消（精簡 s 尺寸，整張放得下） */
    {id:'person-card',bg:'grad',peak:4,mk:()=>pscEl('default','s',{live:true}),
      st:c=>{const b=c.querySelector('.psc-add'),on=()=>b.getAttribute('aria-pressed')==='true';
        return [()=>{c.classList.remove('is-zoom');hxBtnSt(b,'default');if(on())b.click();},()=>c.classList.add('is-zoom'),()=>hxBtnSt(b,'hover'),()=>hxBtnSt(b,'pressed'),[()=>{hxBtnSt(b,'default');if(!on())b.click();},1500],()=>c.classList.remove('is-zoom'),()=>{if(on())b.click();}];}},
    /* Metric Card：逐週切換（Segmented 原子 click），數字滾動、長條高亮跟著換 */
    {id:'metric-card',bg:'dash',peak:3,mk:()=>mtcEl('weekly-bar','violet',{live:true,metric:'sleep'}),
      st:c=>{const B=[...c.querySelectorAll('.mtc-x .sgm-it')];const go=i=>{if(B[i])B[i].click();};
        return [()=>go(7),()=>go(6),()=>go(5),()=>go(3),()=>go(1),()=>go(4),()=>go(7)];}},
    /* Segmented：滑過（is-hover）→ 點選，指示器滑過去 */
    {id:'segmented',bg:'dots',peak:2,mk:()=>sgmEl('soft','m',{items:['日','週','月','年'],active:1,live:true}),
      st:g=>{const B=[...g.querySelectorAll('.sgm-it')];const hov=i=>B.forEach((b,j)=>b.classList.toggle('is-hover',j===i));const go=i=>{hov(-1);B[i].click();};
        return [()=>go(1),()=>hov(2),()=>go(2),()=>hov(3),()=>go(3),()=>hov(0),()=>go(0),()=>hov(1),()=>go(1)];}},
    /* Widget Card · group：頭像散開 → 收回 */
    {id:'widget-card',v:'group',bg:'grad2',peak:1,mk:()=>wdgEl('group',{}),
      st:c=>[()=>c.classList.remove('is-spread'),[()=>c.classList.add('is-spread'),1500],[()=>c.classList.remove('is-spread'),900]]},
    /* Tooltip：trigger hover → 提示淡入，位置 上 → 右 → 下 → 左 輪流（tt-p-*／tt-fp-*） */
    {id:'tooltip',bg:'check',peak:3,mk:()=>{const w=ttTrigger('top','m',true);const s=w.querySelector('.tt-trig span');if(s)s.textContent='分享元件';const p=w.querySelector('.tt-tip span');if(p)p.textContent='複製元件連結';w.classList.add('is-open');return w;},
      st:w=>{const g=w.querySelector('.tt-trig'),t=w.querySelector('.tt-tip'),P=['top','right','bottom','left'];
        const place=(K,p,hv)=>{g.classList.toggle('hx-sim',!!hv);if(t.classList.contains('tt-p-'+p)){w.classList.add('is-open');return;}w.classList.remove('is-open');
          K.later(K.instant?0:180,()=>{t.style.transition='none';P.forEach(q=>t.classList.remove('tt-p-'+q,'tt-fp-'+q));t.classList.add('tt-p-'+p,'tt-fp-'+p);void t.offsetWidth;t.style.transition='';w.classList.add('is-open');});};  // 換邊時先關掉補間，只讓淡入＋4px 滑入那段動
        return [K=>place(K,'top',false),()=>{g.classList.add('hx-sim');w.classList.remove('is-open');},K=>place(K,'top',true),K=>place(K,'right',true),K=>place(K,'bottom',true),K=>place(K,'left',true)];}},
  ];
  /* 格子的狀態循環：來源＝滑過（hover）或聚焦（focus），任一在就循環；都沒了就回到 [0] */
  function hxTileFx(t,node,x){if(!x.st||t.__hx)return;let S=null;try{S=x.st(node);}catch(e){S=null;}if(!S||!S.length)return;
    const steps=S.map(s=>Array.isArray(s)?{f:s[0],ms:s[1]}:{f:s,ms:HX_TS.ms});const stops=[];
    const unstop=c=>{const k=stops.indexOf(c);if(k>=0)stops.splice(k,1);};
    const K={instant:false,
      later(ms,f){const c=()=>clearTimeout(id);const id=setTimeout(()=>{unstop(c);f();},ms);stops.push(c);},
      tween(dur,fn,done){if(K.instant||!(dur>0)){fn(1);if(done)done();return;}const t0=performance.now();let r=0;const c=()=>{cancelAnimationFrame(r);if(done)done();};stops.push(c);
        const f=n=>{const k=Math.min(1,Math.max(0,(n-t0)/dur));fn(k);if(k<1)r=requestAnimationFrame(f);else{unstop(c);if(done)done();}};r=requestAnimationFrame(f);}};
    const clear=()=>stops.splice(0).forEach(c=>{try{c();}catch(e){}});
    let i=0,tm=0;const src=new Set();
    const apply=j=>{i=j;try{steps[j].f(K);}catch(e){}};
    const tick=()=>{tm=0;if(!t.isConnected){src.clear();clear();return;}clear();apply(i+1<steps.length?i+1:(steps.length>1?1:0));tm=setTimeout(tick,steps[i].ms);};
    const set=(k,v)=>{const was=src.size>0;if(v)src.add(k);else src.delete(k);const now=src.size>0;if(now===was)return;
      clearTimeout(tm);tm=0;clear();K.instant=HX_REDUCE();
      if(now){if(K.instant)apply(Math.min(x.peak!=null?x.peak:1,steps.length-1));else tm=setTimeout(tick,HX_TS.first);}
      else apply(0);
      t.classList.toggle('is-cyc',now);
      /* 本尊／複本同步：循環接縫時游標下那格會換成另一份，兩份一起換狀態，接縫看不出來 */
      if(k!=='twin'&&t.parentNode){const tw=()=>t.parentNode&&t.parentNode.querySelectorAll('.hx-tile[data-id="'+x.id+'"]').forEach(o=>{if(o!==t&&o.__hx)o.__hx.set('twin',src.size>0);});
        if(now)tw();else setTimeout(tw,0);}};  // 關掉時晚一拍：接縫換格時 leave 先到、enter 後到，讓另一份先接手 hover 再撤 twin
    t.__hx={set,get step(){return i;},get on(){return src.size>0;}};
    /* 狀態裡的 click()（分頁、Segmented、月曆、加入鈕…）會冒泡到外層 <a>，被點的節點若在處理中被重畫掉，連結的啟用行為還會導頁；
       舞台本身 pointer-events:none＋inert，真的點擊不會從這裡出發，所以元件自己的 handler 跑完後，在舞台把冒泡＋預設行為都擋掉 */
    const stg=t.querySelector('.hx-tile-stage');if(stg)stg.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();});
    t.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')set('hover',true);});
    t.addEventListener('pointerleave',()=>set('hover',false));
    t.addEventListener('focus',()=>set('focus',true));t.addEventListener('blur',()=>set('focus',false));}
  /* 跟手：滑過的格子（舞台）往游標方向位移 ≤8px、傾斜 ≤2.5°，用彈簧（rAF 速度＋阻尼，略帶回彈）；離開彈回原位後清掉 inline transform。
     只給 pointer:fine；減少動態不掛（hxWall 在那之前就 return）；拖曳中目標歸零 */
  const HX_FOL={move:16,tilt:5,k:.085,damp:.74};  // 位移／傾斜加大一倍
  function hxFollow(mq){if(!matchMedia('(pointer:fine)').matches)return null;
    const S=new Map();let cur=null,px=0,py=0,raf=0,lt=0;
    const frame=n=>{raf=0;const dt=Math.min(48,lt?n-lt:16.7);lt=n;const f=dt/16.7,dm=Math.pow(HX_FOL.damp,f);
      S.forEach((s,t)=>{const stg=s.stg;let g=[0,0,0,0];
        if(t===cur&&t.isConnected&&!t.closest('.is-drag')){const r=t.getBoundingClientRect(),h=stg.offsetHeight||r.width;
          const nx=Math.max(-1,Math.min(1,(px-(r.left+r.width/2))/(r.width/2))),ny=Math.max(-1,Math.min(1,(py-(r.top+h/2))/(h/2)));
          g=[nx*HX_FOL.move,ny*HX_FOL.move,-ny*HX_FOL.tilt,nx*HX_FOL.tilt];}
        let rest=true;for(let j=0;j<4;j++){s.v[j]+=(g[j]-s.p[j])*HX_FOL.k*f;s.v[j]*=dm;s.p[j]+=s.v[j]*f;if(Math.abs(s.p[j]-g[j])>.02||Math.abs(s.v[j])>.02)rest=false;}
        if(rest&&t!==cur){stg.style.transform='';S.delete(t);return;}
        const p=s.p;stg.style.transform='perspective(900px) translate3d('+p[0].toFixed(2)+'px,'+p[1].toFixed(2)+'px,0) rotateX('+p[2].toFixed(2)+'deg) rotateY('+p[3].toFixed(2)+'deg)';});
      if(S.size)raf=requestAnimationFrame(frame);else lt=0;};
    const kick=()=>{if(!raf&&S.size){lt=0;raf=requestAnimationFrame(frame);}};
    mq.addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;},{passive:true});
    mq.querySelectorAll('.hx-tile').forEach(t=>{const stg=t.querySelector('.hx-tile-wrap')||t.querySelector('.hx-tile-stage');if(!stg)return;   // 跟手位移套在 wrap：選取框與元件一起動
      t.addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;px=e.clientX;py=e.clientY;cur=t;if(!S.has(t))S.set(t,{stg,p:[0,0,0,0],v:[0,0,0,0]});kick();});
      t.addEventListener('pointerleave',()=>{if(cur===t)cur=null;kick();});});
    return {get cur(){return cur;},get n(){return S.size;}};}
  const HX_MQ={hover:.25,ease:400,glide:325,drag:5,pps:46};  // 滑過速度倍率、速度緩動時間常數（ms）、放開後慣性衰減時間常數（ms）、拖曳判定距離（px）、自動捲動速度（px/s，HOME8 一列改用固定速度）
  function hxWall(){
    const all=NAV.flatMap(g=>g.items);
    const sec=ce('section','gd-sec hx-sec');sec.id='hxWall';sec.setAttribute('aria-label','元件牆');
    sec.innerHTML=`<div class="hx-mq" id="hxWallGrid"></div><div class="hx-wall-cta" id="hxWallCta"></div>`;
    const mq=sec.querySelector('.hx-mq');mq.style.setProperty('--hx-photo','url("'+CARD_COVER+'")');
    const items=HX_WALL.filter(x=>all.some(n=>n.id===x.id));
    const tile=(x,clone)=>{const it=all.find(n=>n.id===x.id);
      const nm=it.name.split(' ');const zh=nm.pop(),en=nm.join(' ');const label='查看 '+zh+(x.v?' · '+x.v:'');
      const t=document.createElement('a');t.className='hx-tile hx-bg-'+x.bg;t.href='#'+x.id;t.dataset.id=x.id;t.draggable=false;
      if(clone){t.dataset.clone='1';t.tabIndex=-1;t.setAttribute('aria-hidden','true');}else t.setAttribute('aria-label',label+'（'+en+(x.v?' '+x.v:'')+'）');
      t.onclick=e=>{e.preventDefault();renderView(x.id);};
      const stg=ce('div','hx-tile-stage');stg.setAttribute('aria-hidden','true');stg.inert=true;
      let node=null;try{node=x.mk();}catch(err){node=null;}
      if(!node){node=ce('span','hx-tile-ph');node.textContent='🧩';}
      stg.appendChild(node);
      /* 標題列：名稱＋英文名，下面一顆「查看元件 →」；平常收起，滑過／聚焦才淡入上移 */
      const cap=ce('div','hx-tile-cap');cap.setAttribute('aria-hidden','true');const tt=ce('div','hx-tile-tt');const b=ce('b');b.textContent=zh;const s=ce('span');s.textContent=en+(x.v?' · '+x.v:'');tt.append(b,s);
      const go=ce('span','hx-tile-go');go.innerHTML='<span>查看元件</span>'+ICON_ARROW;cap.append(tt,go);
      const wrap=ce('div','hx-tile-wrap');const sel=ce('span','hx-sel');sel.setAttribute('aria-hidden','true');sel.innerHTML='<i></i><i></i><i></i><i></i>';wrap.append(stg,sel);
      t.append(wrap,cap);hxTileFx(t,node,x);return t;};  // HOME8:v1 滑過／聚焦換狀態

    const rows=[0].map(r=>{const row=ce('div','hx-mq-row');  // HOME8:v1 只留一列
      const vp=ce('div','hx-mq-vp');const tr=ce('div','hx-mq-tr');
      const set=items;set.forEach(x=>tr.appendChild(tile(x,false)));set.forEach(x=>tr.appendChild(tile(x,true)));  // 第二份＝無縫循環用的複本
      vp.appendChild(tr);row.appendChild(vp);mq.appendChild(row);
      return {vp,tr,dir:-1,x:0,v:0,W:0,hover:false,focus:false,drag:null,mom:0,last:[]};});
    const b=mkBtn({variant:'solid',intent:'primary',size:'l',isLive:true,trail:true});b.querySelector('span').textContent='瀏覽元件';b.onclick=()=>renderView('button');
    sec.querySelector('#hxWallCta').append(b);
    if(HX_REDUCE())return sec;  // 減少動態：CSS 改原生橫向捲動、藏複本，不掛任何動畫
    const measure=R=>{const c=R.tr.querySelector('[data-clone]'),f=R.tr.firstElementChild;R.W=c&&f?c.offsetLeft-f.offsetLeft:0;};
    const wrap=R=>{if(R.W>0){R.x=((R.x%R.W)+R.W)%R.W-R.W;}};
    const put=R=>{R.tr.style.transform='translate3d('+R.x.toFixed(2)+'px,0,0)';};
    let vis=false,raf=0,lt=0;
    const loop=t=>{raf=0;if(!mq.isConnected)return;const dt=Math.min(64,lt?t-lt:16);lt=t;
      rows.forEach(R=>{if(!R.W)measure(R);if(!R.W)return;
        const base=R.dir*HX_MQ.pps;const target=(R.drag&&R.drag.on)||R.focus?0:R.hover?base*HX_MQ.hover:base;
        R.v+=(target-R.v)*(1-Math.exp(-dt/HX_MQ.ease));
        if(!(R.drag&&R.drag.on)){if(R.mom){R.x+=R.mom*dt;R.mom*=Math.exp(-dt/HX_MQ.glide);if(Math.abs(R.mom)<.01)R.mom=0;}R.x+=R.v*dt/1000;}
        wrap(R);put(R);});
      if(vis&&!document.hidden)raf=requestAnimationFrame(loop);else lt=0;};
    const kick=()=>{if(!raf&&vis&&!document.hidden&&mq.isConnected){lt=0;raf=requestAnimationFrame(loop);}};
    rows.forEach(R=>{const {vp}=R;
      if(window.ResizeObserver)new ResizeObserver(()=>{measure(R);wrap(R);put(R);}).observe(R.tr);
      vp.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')R.hover=true;});
      vp.addEventListener('pointerleave',()=>{R.hover=false;});
      /* 拖曳：超過 5px 才算拖，之後抓住指標；放開時用最近 100ms 的位移算速度，交給慣性 */
      vp.addEventListener('pointerdown',e=>{if(e.button!==0)return;R.drag={id:e.pointerId,x0:e.clientX,y0:e.clientY,start:R.x,on:false};R.mom=0;R.last=[[performance.now(),e.clientX]];});
      vp.addEventListener('pointermove',e=>{const D=R.drag;if(!D||D.id!==e.pointerId)return;const dx=e.clientX-D.x0;
        if(!D.on){if(Math.abs(dx)<HX_MQ.drag)return;if(Math.abs(e.clientY-D.y0)>Math.abs(dx)){R.drag=null;return;}D.on=true;R.v=0;vp.classList.add('is-drag');try{vp.setPointerCapture(e.pointerId);}catch(err){}}
        R.x=D.start+dx;wrap(R);D.start+=R.x-(D.start+dx);put(R);const now=performance.now();R.last.push([now,e.clientX]);while(R.last.length>2&&now-R.last[0][0]>100)R.last.shift();});
      const end=e=>{const D=R.drag;if(!D||D.id!==e.pointerId)return;R.drag=null;if(!D.on)return;vp.classList.remove('is-drag');
        const L=R.last,a=L[0],z=L[L.length-1];const v=z&&a&&z[0]>a[0]&&performance.now()-z[0]<80?(z[1]-a[1])/(z[0]-a[0]):0;  // 用指標的位移算速度（不受循環接縫影響）；放開前停住 80ms 以上＝不滑行
        R.mom=Math.max(-3,Math.min(3,v));R.dragged=true;setTimeout(()=>{R.dragged=false;},0);kick();};
      vp.addEventListener('pointerup',end);vp.addEventListener('pointercancel',end);
      vp.addEventListener('click',e=>{if(R.dragged){e.preventDefault();e.stopPropagation();R.dragged=false;}},true);
      vp.addEventListener('dragstart',e=>e.preventDefault());
      /* 觸控板／Shift＋滾輪：只吃橫向量，直向滾動照常捲頁面 */
      vp.addEventListener('wheel',e=>{const dx=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:(e.shiftKey?e.deltaY:0);if(!dx)return;e.preventDefault();R.x-=dx*(e.deltaMode===1?16:1);R.v=0;wrap(R);put(R);kick();},{passive:false});
      /* 鍵盤：聚焦的格子停下、必要時把它推進可視範圍（overflow:hidden 的捲動位置歸零，只用 transform） */
      vp.addEventListener('focusin',e=>{R.focus=true;const t=e.target.closest('.hx-tile');vp.scrollLeft=0;if(!t)return;
        const vr=vp.getBoundingClientRect(),tr=t.getBoundingClientRect(),pad=parseFloat(getComputedStyle(mq).getPropertyValue('--hx-edge'))||48;
        if(tr.left<vr.left+pad)R.x+=vr.left+pad-tr.left;else if(tr.right>vr.right-pad)R.x-=tr.right-(vr.right-pad);R.v=0;R.mom=0;put(R);});
      vp.addEventListener('focusout',e=>{if(!vp.contains(e.relatedTarget))R.focus=false;});
      vp.addEventListener('scroll',()=>{if(vp.scrollLeft)vp.scrollLeft=0;},{passive:true});});
    // 捲出畫面就停（rAF 不跑）
    if(window.IntersectionObserver){const io=new IntersectionObserver(es=>es.forEach(e=>{vis=e.isIntersecting;mq.classList.toggle('is-off',!vis);if(vis)kick();}),{threshold:0});io.observe(mq);}else{vis=true;kick();}
    const onVis=()=>{if(!mq.isConnected){document.removeEventListener('visibilitychange',onVis);return;}kick();};viewOn(document,'visibilitychange',onVis);
    const fol=hxFollow(mq);  // HOME8:v1 跟手（pointer:fine）
    window.__hxWall={rows,fol,get running(){return !!raf;}};
    return sec;
  }

  /* 動態展示（HOME5-HOME:v1 版面參考 aceternity）：錯位 bento——多欄（CSS columns）＋細虛線格線，每格一個元件、高度不一。
     每張示範一個 step()；只在「看得到、沒被滑過／聚焦、分頁在前景、使用者沒按暫停」時播放。卡片下不放文字，名稱只留在 aria-label
     HOME6:v1 拿掉儀表／品牌牌卡／motion token 卡，換成三張輸入類（表單打字驗證、搜尋＋篩選即時過濾、下拉＋日期選擇）；
     熱銷排名改成模擬游標滑過長條（tooltip＋高亮），KPI 走勢一次只滑一張、淡入淡出、從左緣進場，每張停 3.6 秒以上 */
  function hxClickNext(scope,sel){const bs=[...scope.querySelectorAll(sel)];if(!bs.length)return;const i=bs.findIndex(b=>b.classList.contains('is-active'));bs[(i+1)%bs.length].click();}
  const HX_IC_PAUSE=PI('pause');
  const HX_IC_PLAY=PI('play');
  const HX_IC_GHOST='<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M2 1.6v14.6l3.7-3.6 2.6 5.8 2.6-1.1-2.6-5.7h5.1z"/></svg>';
  function hxShow(){
    const sec=ce('section','gd-sec hx-sec hx-sec-show');sec.id='hxShow';sec.setAttribute('aria-label','動態展示');
    sec.innerHTML=`<div class="hx-show-bar" id="hxShowBar"></div><div class="bento-card hx-showq"><div class="hx-show" id="hxShowGrid"></div></div>`;
    const grid=sec.querySelector('#hxShowGrid');const demos=[];
    /* 每張示範可以有多個 actor（各自的節奏）；第 n 張卡片錯開起跑，整面牆隨時都有東西在動。
       actor.once＝只在開始播放時呼叫一次，之後由它自己的時間軸（later／tween）接續循環 */
    const demo=(key,label,node,actors,o)=>{const c=ce('div','hx-sc hx-sc-'+key);c.dataset.playing='0';c.setAttribute('role','group');c.setAttribute('aria-label',label+'（自動示範）');
      const st=ce('div','hx-sc-stage');st.appendChild(node);c.appendChild(st);grid.appendChild(c);
      node.querySelectorAll('.chtx-sr[aria-live]').forEach(n=>n.setAttribute('aria-live','off'));  // 自動示範不要一直播報 tooltip
      const d=Object.assign({el:c,node,actors:actors.map(a=>Object.assign({t:null,w:null},a)),idx:demos.length,stops:[]},o||{});demos.push(d);return d;};
    const fire=(el,type,x,y)=>{try{el.dispatchEvent(new PointerEvent(type,{bubbles:type!=='pointerleave',clientX:x,clientY:y,pointerType:'mouse'}));}catch(e){}};
    /* 時間軸小工具：都掛在 d.stops，暫停時一次清掉 */
    const unstop=(d,c)=>{const i=d.stops.indexOf(c);if(i>=0)d.stops.splice(i,1);};
    const later=(d,ms,f)=>{const c=()=>clearTimeout(id);const id=setTimeout(()=>{unstop(d,c);if(d.running)f();},ms);d.stops.push(c);};
    const tween=(d,dur,fn,done)=>{const t0=performance.now();let raf=0;const c=()=>cancelAnimationFrame(raf);d.stops.push(c);
      const f=t=>{if(!d.running)return;const k=Math.min(1,Math.max(0,(t-t0)/dur));fn(k);if(k<1)raf=requestAnimationFrame(f);else{unstop(d,c);if(done)done();}};raf=requestAnimationFrame(f);};
    const seq=(d,steps,done)=>{let i=0;const go=()=>{if(!d.running)return;if(i>=steps.length){if(done)done();return;}steps[i++](go);};go();};
    const jit=ms=>Math.round(ms*(0.85+Math.random()*0.3));
    const eo=k=>1-Math.pow(1-k,3),ss=k=>k*k*(3-2*k);
    /* 模擬游標：卡片內一個箭頭（aria-hidden），位置用卡片內座標；送事件時換回視窗座標 */
    const ghost=d=>{if(d.g)return d.g;const g=ce('span','hx-ghost');g.setAttribute('aria-hidden','true');g.innerHTML=HX_IC_GHOST;d.el.appendChild(g);let lx=0,ly=0;
      d.g={at(x,y){lx=x;ly=y;g.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';},show(v){g.classList.toggle('on',!!v);},
        client(){const r=d.el.getBoundingClientRect();return [r.left+lx,r.top+ly];},get x(){return lx;},get y(){return ly;}};return d.g;};
    const local=(d,el)=>{const e=d.el.getBoundingClientRect(),r=el.getBoundingClientRect();return {l:r.left-e.left,t:r.top-e.top,w:r.width,h:r.height};};
    /* 打字：逐字 110～190ms（標點後多停一下），每打一個字呼叫 onKey */
    const type=(d,inp,text,done,onKey)=>{let i=0;const step=()=>{if(i>=text.length){if(done)done();return;}inp.value+=text[i++];if(onKey)onKey(inp.value);
      later(d,Math.round((110+Math.random()*80)*(/[@.\s]/.test(text[i-1])?1.8:1)),step);};step();};
    const setMsg=(m,kind,text)=>{if(!m)return;m.className='fld-msg'+(kind==='err'?' is-err':kind==='ok'?' hx-ok':'');
      m.innerHTML=kind?`<span class="fld-msg-ic">${kind==='err'?NT_IC_ERROR:NT_IC_SUCCESS}</span><span>${text}</span>`:'';if(!kind)m.textContent=text||'';};
    /* 節奏：每一拍 2.5～4 秒（--dur-slow 的倍數，最短 2.5 秒）；排程時每拍再加 ±15% 隨機，卡片之間不會同步跳動 */
    const ms=n=>Math.max(2500,chtxMs('--dur-slow',n));

    /* ── KPI 走勢：一次只滑一張圖。游標從圖的左緣外滑進來 → 碰到圖才送 pointermove（十字線／點／tooltip 淡入）→ 3.8 秒 smoothstep 往右掃（最多 82%，tooltip 不換邊）→ 停 0.8 秒 → 往下滑出、送 pointerleave（淡出）→ 空 1.2 秒才換下一張 */
    const sweepKpi=(d,svg,done)=>{const G=ghost(d);const r=local(d,svg);if(!r.w){done();return;}const y0=r.t+r.h*.58;let inside=false;
      /* tooltip 在游標右側；掃到它放不下、要翻到左側之前就停（不讓 tooltip 中途左右換邊） */
      let span=r.w*.82;const fitSpan=()=>{const tip=d.node.querySelector('.chtx-tip');if(!tip||!tip.parentElement)return;const hr=tip.parentElement.getBoundingClientRect(),sr=svg.getBoundingClientRect();
        const fit=hr.right-22-tip.offsetWidth*1.15-sr.left-6;if(fit>=r.w*.4)span=Math.min(span,fit);};  // tooltip 已出現後量寬度（留 15% 給數字變長）
      const at=(x,y,send)=>{G.at(x,y);if(send){inside=true;const [cx,cy]=G.client();fire(svg,'pointermove',cx,cy);}};
      d.leave=()=>{if(inside)fire(svg,'pointerleave',0,0);inside=false;G.show(false);d.leave=null;};
      G.at(r.l-22,y0+14);requestAnimationFrame(()=>G.show(true));
      seq(d,[n=>tween(d,jit(800),k=>{const e=eo(k);at(r.l-22+e*28,y0+14-e*14,k>.55);},n),
        n=>{fitSpan();n();},
        n=>tween(d,jit(3800),k=>{const e=ss(k);at(r.l+6+e*span,y0-Math.sin(e*Math.PI)*r.h*.18,true);},n),
        n=>later(d,jit(800),n),
        n=>{const x1=G.x,y1=G.y;if(inside)fire(svg,'pointerleave',0,0);inside=false;G.show(false);tween(d,jit(600),k=>{const e=eo(k);G.at(x1+e*12,y1+e*(r.h*.5+20));},()=>{d.leave=null;n();});}],done);};
    const spark=chtChart('spark','m',{live:true});[...spark.querySelectorAll('.chtx-kpi')].slice(1).forEach(k=>k.remove());   // 只留一張走勢圖
    demo('spark','Chart · spark：區間切換＋游標逐張滑過走勢',spark,[{once:true,at:600,fn:d=>{const run=()=>{const svgs=[...d.node.querySelectorAll('.chtx-kpi svg')];
      seq(d,[n=>{hxClickNext(d.node,'.chtx-kpi-top .sgm-it');later(d,jit(2400),n);},
        ...svgs.map(s=>n=>sweepKpi(d,s,()=>later(d,jit(1200),n))),
        n=>later(d,jit(1400),n)],run);};run();}}]);
    demo('grp','Widget Card · group：頭像展開',wdgEl('group',{live:true}),[{ms:ms(6.6),fn:d=>d.node.classList.toggle('is-spread')}]);

    /* ── 表單：Field／Input 原子。打姓名 → 打 Email（少了網域尾）→ 離開欄位跳錯誤 → 回來補上 → 變成功訊息 → 按送出 → 重來 */
    const fm=ce('form','hx-icard hx-ifm');fm.noValidate=true;fm.setAttribute('aria-label','建立帳號');fm.onsubmit=e=>e.preventDefault();
    const fmh=ce('div','hx-icard-h');fmh.innerHTML='<b>建立帳號</b><span>填完寄送驗證信</span>';fm.appendChild(fmh);
    const fN=fldEl('vertical','default',{live:true,label:'姓名',required:true,placeholder:'王小明'}),fE=fldEl('vertical','default',{live:true,label:'電子郵件',required:true,placeholder:'name@example.com',hint:'我們會寄送驗證信到這個信箱。'});
    [fN,fE].forEach(f=>{if(!f.querySelector('.fld-msg')){const m=ce('div','fld-msg');m.id='fld-msg-'+(++FLD_ID);f.querySelector('input').setAttribute('aria-describedby',m.id);f.querySelector('.fld-ctl').appendChild(m);}fm.appendChild(f);});
    const fOk=mkBtn({variant:'solid',intent:'primary',size:'m',isLive:true});fOk.type='submit';fOk.querySelector('span').textContent='建立帳號';fOk.classList.add('hx-ifm-go');fm.appendChild(fOk);
    const F=[fN,fE].map(f=>({f,inp:f.querySelector('input'),box:f.querySelector('.field'),msg:f.querySelector('.fld-msg')}));
    const fmState=k=>{F.forEach(x=>{x.box.classList.remove('st-focus','st-error');x.inp.removeAttribute('aria-invalid');});fOk.classList.remove('st-press','st-hover');
      if(k==='done'){F[0].inp.value='林語晨';F[1].inp.value='yuchen.lin@goons.tw';setMsg(F[1].msg,'ok','格式正確，驗證信會寄到這裡');}
      else{F.forEach(x=>{x.inp.value='';});setMsg(F[1].msg,'','我們會寄送驗證信到這個信箱。');}};
    fmState('done');
    demo('form','Field · 表單：打字、聚焦、即時驗證',fm,[{once:true,at:1400,fn:d=>{const [N,E]=F;const run=()=>seq(d,[
        n=>{fmState('reset');later(d,jit(1100),n);},
        n=>{N.box.classList.add('st-focus');later(d,jit(500),n);},
        n=>type(d,N.inp,'林語晨',()=>later(d,jit(700),n)),
        n=>{N.box.classList.remove('st-focus');E.box.classList.add('st-focus');later(d,jit(450),n);},
        n=>type(d,E.inp,'yuchen.lin@goons',()=>later(d,jit(800),n)),
        n=>{E.box.classList.remove('st-focus');E.box.classList.add('st-error');E.inp.setAttribute('aria-invalid','true');setMsg(E.msg,'err','請輸入完整的 Email，例如 name@example.com');later(d,jit(2800),n);},
        n=>{E.box.classList.add('st-focus');later(d,jit(600),n);},
        n=>type(d,E.inp,'.tw',()=>{E.box.classList.remove('st-error');E.inp.removeAttribute('aria-invalid');setMsg(E.msg,'ok','格式正確，驗證信會寄到這裡');later(d,jit(1600),n);}),
        n=>{E.box.classList.remove('st-focus');fOk.classList.add('st-hover');later(d,jit(700),n);},
        n=>{fOk.classList.add('st-press');later(d,260,()=>{fOk.classList.remove('st-press');n();});},
        n=>later(d,jit(3000),n)],run);run();}}],{reset:()=>{F.forEach(x=>x.box.classList.remove('st-focus'));fOk.classList.remove('st-press','st-hover');}});  // 暫停時只收掉暫態（聚焦框／按下），內容停在當下

    /* ── 篩選：搜尋框＋狀態 chip（Tag 原子）＋已套用條件 chip（Table Toolbar 的 ttbChip）＋清單列（List 原子）即時過濾；清單高度固定，列收起時不推動整面牆 */
    const FL_ROWS=[['Card 元件驗收','設計 · 林語晨','進行中'],['Button 寫進 Figma','Figma · 陳柏宇','已完成'],['Card 深色模式檢查','設計 · 王思妤','已完成'],
      ['Modal 文案校稿','內容 · 李承恩','待審'],['Card 圖片比例','前端 · 陳柏宇','進行中'],['Table 欄寬調整','前端 · 林語晨','進行中']];
    const FL_I={'進行中':'info','已完成':'success','待審':'warning'};
    const fl=ce('div','hx-icard hx-ifl');
    const flh=ce('div','hx-icard-h');const flCnt=ce('span');flh.innerHTML='<b>任務清單</b>';flh.appendChild(flCnt);fl.appendChild(flh);
    const sb=ce('div','field v-outline hx-ifl-q');sb.insertAdjacentHTML('beforeend',ICON_SEARCH);const sq=document.createElement('input');sq.className='bare';sq.placeholder='搜尋任務…';sq.setAttribute('aria-label','搜尋任務');sb.appendChild(sq);fl.appendChild(sb);
    const chips=ce('div','hx-ifl-chips');chips.setAttribute('role','group');chips.setAttribute('aria-label','狀態');
    const CH=['全部','進行中','待審','已完成'].map(k=>{const t=tagEl('outline','neutral','default');t.querySelector('span').textContent=k;t.dataset.k=k;chips.appendChild(t);return t;});fl.appendChild(chips);
    const cond=ce('div','hx-ifl-cond');fl.appendChild(cond);
    const lst=ce('div','lst-solo hx-ifl-l');fl.appendChild(lst);
    const FR=FL_ROWS.map(([t,ds,s])=>{const w=ce('div','hx-fr');const it=lstRowBasic('default',{title:t,desc:ds});const tr=ce('div','lst-trail');const g=tagEl('soft',FL_I[s],'default');g.querySelector('span').textContent=s;tr.appendChild(g);it.appendChild(tr);
      const inner=ce('div','hx-fr-i');inner.appendChild(it);w.appendChild(inner);lst.appendChild(w);return {w,t,s};});
    const flS={q:'',st:'全部'};
    const flApply=()=>{let n=0;FR.forEach(r=>{const ok=(!flS.q||r.t.toLowerCase().includes(flS.q.toLowerCase()))&&(flS.st==='全部'||r.s===flS.st);r.w.classList.toggle('is-out',!ok);r.w.setAttribute('aria-hidden',String(!ok));if(ok)n++;});
      flCnt.textContent=n+' / '+FR.length+' 筆';
      CH.forEach(c=>{const on=c.dataset.k===flS.st;c.className=c.className.replace(/\bv-\w+/,on?'v-solid':'v-outline').replace(/\bi-\w+/,on?'i-brand':'i-neutral');c.setAttribute('aria-pressed',String(on));});};
    const flCond=(label,key)=>{const c=ttbChip(label,{});c.classList.add('tg-in');c.dataset.key=key;cond.appendChild(c);};
    const flReset=()=>{flS.q='';flS.st='全部';sq.value='';sb.classList.remove('st-focus');cond.innerHTML='';flApply();};
    CH.forEach(c=>{c.setAttribute('role','button');c.tabIndex=0;const pick=()=>{flS.st=c.dataset.k;flApply();};c.onclick=pick;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick();}};});
    sq.addEventListener('input',()=>{flS.q=sq.value.trim();flApply();});
    flReset();
    /* 清單外框鎖住「全部列都在」的高度（隨寬度重算），過濾時卡片不變高 */
    if(window.ResizeObserver)new ResizeObserver(()=>{if(FR.some(r=>r.w.classList.contains('is-out')))return;const h=FR.reduce((a,r)=>a+r.w.offsetHeight,0);if(h)lst.style.setProperty('--hx-ifl-h',(h+2)+'px');}).observe(lst);
    demo('filter','Table Toolbar · 篩選：搜尋＋狀態 chip 即時過濾清單',fl,[{once:true,at:2600,fn:d=>{const run=()=>seq(d,[
        n=>{flReset();later(d,jit(1400),n);},
        n=>{sb.classList.add('st-focus');later(d,jit(500),n);},
        n=>type(d,sq,'Card',()=>later(d,jit(900),n),v=>{flS.q=v;flApply();}),
        n=>{sb.classList.remove('st-focus');flCond('關鍵字：Card','q');later(d,jit(2000),n);},
        n=>{const c=CH[1];c.classList.add('hx-press');later(d,220,()=>{c.classList.remove('hx-press');flS.st='進行中';flApply();flCond('狀態：進行中','st');later(d,jit(3200),n);});},
        n=>{[...cond.children].forEach(c=>c.classList.add('tg-out'));later(d,jit(400),()=>{flReset();later(d,jit(2600),n);});}],run);run();}}],{reset:()=>{sb.classList.remove('st-focus');CH.forEach(c=>c.classList.remove('hx-press'));}});

    demo('mtc','Metric Card：逐週切換',mtcEl('weekly-bar','violet',{live:true,metric:'sleep'}),[{ms:ms(6),fn:d=>hxClickNext(d.node,'.mtc-x .sgm-it')}]);
    /* 人物牌卡：照片淡入淡出輪播（疊一層 img 交叉淡化），名牌跟著換；加入成員鈕照舊切換 */
    const pscN=pscEl('default','s',{live:true});
    { const ph=pscN.querySelector('.psc-photo');const base=ph&&ph.querySelector('img');
      if(base){const srcs=[base.src,...PSC_ROT];
        const top=base.cloneNode();top.classList.add('hx-psc-x');top.style.opacity='0';top.alt='';ph.appendChild(top);pscN.__ph={base,top,srcs,i:0};}}
    demo('psc','Person Card：照片淡入淡出輪播＋加入成員',pscN,[
      {ms:ms(5),fn:d=>{const P=d.node.__ph;if(!P||P.srcs.length<2)return;P.i=(P.i+1)%P.srcs.length;
        P.top.src=P.srcs[P.i];P.top.style.opacity='1';setTimeout(()=>{P.base.src=P.srcs[P.i];P.top.style.opacity='0';},chtxMs('--dur-slow',1.6)+60);}},
      {ms:ms(7.2),at:ms(3.6),fn:d=>{const b=d.node.querySelector('.psc-add');if(b)b.click();}}]);

    /* ── 熱銷排名：不換位，改成模擬游標滑過長條——游標從右側進場，經過的列即時高亮＋tooltip（圖表自己的 hover），每列停 3.4 秒、列與列之間 1 秒滑動，三列後滑出休息 */
    const rank=chtChart('bar-rank','m',{live:true});
    const rkRows=()=>[...rank.querySelectorAll('.chtx-rk-row')];
    const rkSim=row=>rkRows().forEach(r=>r.classList.toggle('hx-sim',r===row));
    demo('rank','Chart · bar-rank：游標滑過長條看數值',rank,[{once:true,at:2000,fn:d=>{const G=ghost(d);let cur=null,prev=-1;
      const hit=()=>{const [cx,cy]=G.client();const rs=rkRows();const r=rs.find(x=>{const b=x.getBoundingClientRect();return cy>=b.top&&cy<b.bottom&&cx>=b.left&&cx<=b.right;});
        if(r){cur=r;rkSim(r);fire(r,'pointermove',cx,cy);}};
      const target=i=>{const r=local(d,rkRows()[i]);return [r.l+r.w*(.42+Math.random()*.12),r.t+r.h*.5];};
      d.leave=()=>{if(cur)fire(cur,'pointerleave',0,0);cur=null;rkSim(null);G.show(false);};
      const move=(to,dur,send,done)=>{const x0=G.x,y0=G.y;tween(d,dur,k=>{const e=eo(k);G.at(x0+(to[0]-x0)*e,y0+(to[1]-y0)*e);if(send)hit();},done);};
      const pick=()=>{let i;do{i=Math.floor(Math.random()*Math.min(6,rkRows().length));}while(i===prev);prev=i;return i;};
      const run=()=>{const a=pick(),b=pick(),c=pick();const box=local(d,rank);const t0=target(a);G.at(box.l+box.w+12,t0[1]+18);requestAnimationFrame(()=>G.show(true));
        seq(d,[n=>move(t0,jit(1000),true,n),n=>later(d,jit(3400),n),
          n=>move(target(b),jit(1000),true,n),n=>later(d,jit(3400),n),
          n=>move(target(c),jit(1000),true,n),n=>later(d,jit(3400),n),
          n=>{if(cur)fire(cur,'pointerleave',0,0);cur=null;rkSim(null);G.show(false);move([box.l+box.w+12,G.y+24],jit(700),false,n);},
          n=>later(d,jit(2600),n)],run);};run();}}]);

    /* ── 排程：Dropdown 展開→游標往下滑過選項→選定收合；接著 Date Picker 的月曆逐日滑過→選定，欄位跟著填值。月曆常駐（同 dpk 的 static 面板），選單浮在上面，卡片高度不變 */
    const SC_OWN=['林語晨','陳柏宇','王思妤','李承恩'];
    const sc=ce('div','hx-icard hx-isc');const sch=ce('div','hx-icard-h');sch.innerHTML='<b>排程上線</b><span>春季活動頁</span>';sc.appendChild(sch);
    const scg=ce('div','hx-isc-g');sc.appendChild(scg);
    const scF=(label,node)=>{const f=fldEl('vertical','default',{label});const ctl=f.querySelector('.fld-ctl');ctl.innerHTML='';ctl.appendChild(node);scg.appendChild(f);return f;};
    const dd=ddField('outline',{options:SC_OWN,placeholder:'選擇負責人'});scF('負責人',dd).querySelector('[role="combobox"]').setAttribute('aria-label','負責人');
    const dpk=dpkEl('single','default',{});scF('上線日',dpk);const dpF=dpk.querySelector('.field');dpF.setAttribute('aria-expanded','true');
    const pop=ce('div','pop dpk-pop dpk-pop-static hx-isc-cal');sc.appendChild(pop);
    let cal=null;const scCal=sel=>{const n=calMonthEl('m',{selected:sel==null?null:sel});if(cal)cal.replaceWith(n);else pop.appendChild(n);cal=n;};
    const ddT=dd.querySelector('.field'),ddM=dd.querySelector('.ddmenu'),ddC=dd.querySelector('.ddcaret');
    const ddOpen=v=>{ddM.classList.toggle('is-open',v);ddT.classList.toggle('st-open',v);if(ddC)ddC.classList.toggle('up',v);ddT.setAttribute('aria-expanded',String(v));if(!v)ddM.querySelectorAll('.ddopt').forEach(o=>o.classList.remove('hx-sim'));};
    const ddVal=v=>{const b=dd.querySelector('.dd-body');b.innerHTML='';const s=ce('span',v?'val':'ph');s.textContent=v||'選擇負責人';b.appendChild(s);ddM.querySelectorAll('.ddopt').forEach(o=>{const on=o.textContent===v;o.classList.toggle('sel',on);o.setAttribute('aria-selected',String(on));});};
    const dpVal=t=>{const s=dpF.querySelector('.ph,.val');s.className=t?'val':'ph';s.textContent=t||'年/月/日';};
    const scState=k=>{ddOpen(false);dpF.classList.remove('st-focus');if(k==='done'){ddVal('王思妤');dpVal('2026/07/23');scCal(23);}else{ddVal('');dpVal('');scCal(null);}};
    scState('done');
    demo('sched','Dropdown＋Date Picker：展開、滑過、選定',sc,[{once:true,at:3400,fn:d=>{
      const opts=()=>[...ddM.querySelectorAll('.ddopt')];const days=()=>[...cal.querySelectorAll('.cal-day:not(.is-out):not(:disabled)')];
      const hov=(list,i)=>list.forEach((o,j)=>o.classList.toggle('hx-sim',j===i));
      const walk=(listFn,from,to,step,done)=>{let i=from;const go=()=>{hov(listFn(),i);if(i===to){done();return;}i+=i<to?1:-1;later(d,step(),go);};go();};
      const run=()=>{const pickO=1+Math.floor(Math.random()*3),dayA=17+Math.floor(Math.random()*3),dayB=dayA+3+Math.floor(Math.random()*4);
        seq(d,[n=>{scState('reset');later(d,jit(1200),n);},
          n=>{ddT.classList.add('st-focus');ddOpen(true);later(d,jit(700),n);},
          n=>walk(opts,0,pickO,()=>jit(520),()=>later(d,jit(900),n)),
          n=>{ddVal(SC_OWN[pickO]);ddOpen(false);ddT.classList.remove('st-focus');later(d,jit(1400),n);},
          n=>{dpF.classList.add('st-focus');later(d,jit(600),n);},
          n=>{const ds=days(),ia=ds.findIndex(x=>+x.textContent===dayA),ib=ds.findIndex(x=>+x.textContent===dayB);walk(days,ia<0?0:ia,ib<0?ds.length-1:ib,()=>jit(380),()=>later(d,jit(900),n));},
          n=>{hov(days(),-1);scCal(dayB);dpVal('2026/07/'+String(dayB).padStart(2,'0'));dpF.classList.remove('st-focus');later(d,jit(3400),n);}],run);};run();}}],{reset:()=>{ddOpen(false);ddT.classList.remove('st-focus');dpF.classList.remove('st-focus');if(cal)cal.querySelectorAll('.hx-sim').forEach(x=>x.classList.remove('hx-sim'));}});

    demo('todo','Widget Card · todo：分頁切換',wdgEl('todo',{live:true}),[{ms:ms(6.8),fn:d=>hxClickNext(d.node,'.sgm-it')}]);
    { /* 拿掉熱銷商品；todo 的位置改放「27 New Messages」群組卡 */
      const by=k=>demos.find(d=>d.el.classList.contains('hx-sc-'+k));const rk=by('rank'),td=by('todo'),gp=by('grp');
      if(gp&&td)grid.insertBefore(gp.el,td.el);
      [rk,td].forEach(d=>{if(!d)return;d.el.remove();demos.splice(demos.indexOf(d),1);});demos.forEach((d,i)=>d.idx=i);}
    let on=!HX_REDUCE();
    /* 暫停／播放：段落右上角一顆小鈕（icon＋短字），aria-pressed 表示已暫停 */
    const bar=sec.querySelector('#hxShowBar');const pb=mkBtn({variant:'outline',intent:'secondary',size:'s',isLive:true});pb.classList.add('hx-show-pb');bar.append(pb);
    const stopD=d=>{d.actors.forEach(a=>{clearTimeout(a.w);clearInterval(a.t);a.w=a.t=null;});d.stops.splice(0).forEach(f=>{try{f();}catch(e){}});
      if(d.leave){try{d.leave();}catch(e){}}if(d.reset){try{d.reset();}catch(e){}}};
    const sync=d=>{const run=on&&d.vis&&!d.hold&&!document.hidden&&d.el.isConnected;
      if(run&&!d.running){d.running=true;d.actors.forEach((a,i)=>{const tick=()=>{if(!d.el.isConnected){stopD(d);d.running=false;return;}try{a.fn(d);}catch(e){}};
          const next=()=>{a.w=setTimeout(()=>{if(!d.running)return;tick();next();},Math.round(a.ms*(0.85+Math.random()*0.3)));};
          a.w=setTimeout(()=>{if(!d.running)return;tick();if(!a.once)next();},(a.at||0)+d.idx*480+Math.round(Math.random()*900)+600);});}
      else if(!run&&d.running){d.running=false;stopD(d);}
      d.el.dataset.playing=run?'1':'0';};
    const syncAll=()=>demos.forEach(sync);
    const paint=()=>{pb.innerHTML=(on?HX_IC_PAUSE:HX_IC_PLAY)+'<span>'+(on?'暫停':'播放')+'</span>';pb.setAttribute('aria-label',on?'暫停自動播放':'播放自動示範');pb.title=on?'暫停自動播放':'播放自動示範';pb.setAttribute('aria-pressed',String(!on));};
    pb.onclick=()=>{on=!on;paint();syncAll();};paint();
    demos.forEach(d=>{d.vis=!window.IntersectionObserver;d.hold=false;d.running=false;
      d.el.addEventListener('pointerenter',e=>{if(!e.isTrusted)return;d.hold=true;sync(d);});d.el.addEventListener('pointerleave',e=>{if(!e.isTrusted)return;d.hold=d.el.contains(document.activeElement);sync(d);});
      d.el.addEventListener('focusin',()=>{d.hold=true;sync(d);});d.el.addEventListener('focusout',e=>{if(!d.el.contains(e.relatedTarget)){d.hold=d.el.matches(':hover');sync(d);}});});
    if(window.IntersectionObserver){const io=new IntersectionObserver(es=>es.forEach(e=>{const d=demos.find(x=>x.el===e.target);if(!d)return;d.vis=e.isIntersecting;sync(d);}),{threshold:.3});
      demos.forEach(d=>io.observe(d.el));}
    if(window.__hxShowStop)window.__hxShowStop();
    const vis=()=>syncAll();viewOn(document,'visibilitychange',vis);
    const mq=matchMedia('(prefers-reduced-motion:reduce)');const onMq=()=>{if(mq.matches)on=false;paint();syncAll();};viewOn(mq,'change',onMq);
    window.__hxShowStop=()=>{demos.forEach(d=>{d.running=false;stopD(d);});document.removeEventListener('visibilitychange',vis);mq.removeEventListener('change',onMq);};
    window.__hxShow={demos,get on(){return on;}};
    /* 手機自動橫移：約 18px/s 來回漂移，碰到底就反向；觸控後暫停 4 秒、捲出畫面停止、減少動態不動 */
    { const PH=matchMedia('(max-width:599px)');let dir=1,last=0,hold=0,raf=0,inView=true,fx=0;
      const step=t=>{raf=0;if(!grid.isConnected)return;const dt=last?Math.min(64,t-last):16;last=t;
        if(PH.matches&&on&&inView&&!document.hidden&&t>hold){const max=grid.scrollWidth-grid.clientWidth;
          if(max>2){if(Math.abs(grid.scrollLeft-fx)>2)fx=grid.scrollLeft;let x=fx+dir*dt*.018;if(x>=max){x=max;dir=-1;}else if(x<=0){x=0;dir=1;}fx=x;grid.scrollLeft=x;}}   // fx＝浮點位置（scrollLeft 會取整數，小步長不累積）
        raf=requestAnimationFrame(step);};
      const pause=()=>{hold=performance.now()+4000;};grid.addEventListener('touchstart',pause,{passive:true});grid.addEventListener('pointerdown',pause);grid.addEventListener('wheel',pause,{passive:true});
      if(window.IntersectionObserver)new IntersectionObserver(es=>{inView=es[0].isIntersecting;}).observe(grid);
      if(!HX_REDUCE())raf=requestAnimationFrame(step);}
    syncAll();
    return sec;
  }

  function hxFlow(){ /* HOME9:v1 → HOME10:v1 arqe 式 sticky 堆疊大卡 → HOME11:v1 去區塊標題、Step 序號眉標、右側示意自動播放、只有第 4 步放 CTA */
    const sec=ce('section','gd-sec hx-sec');sec.id='hxFlow';sec.setAttribute('aria-label','四個步驟，開好一個新專案');
    /* HOME16:v1 段標題與 Code ⇄ Figma 同規格；副標不加粗；拿掉「看 skill 路徑」 */
    sec.innerHTML=`<div class="gd-sec-h"><h2 class="gd-sec-t">從這個網站開始編輯</h2></div><div class="hx-fl-intro"><p class="hx-fl-lede">從網站開始，不用寫程式。打開元件庫網址、按「開啟新專案」進入編輯模式，四步調好你的樣式。</p></div><ol class="hx-steps" id="hxSteps"></ol>`;
    const tg=(v,i,t)=>{const g=tagEl(v,i,'default');g.querySelector('span').textContent=t;return g;};
    const stage=(cap,meta,...kids)=>{const s=ce('div','hx-step-stage bento-card');const c=ce('div','hx-step-cap');const a=ce('span');a.innerHTML=cap;const m=ce('span');m.textContent=meta;c.append(a,m);s.append(c,...kids);s.hxCap=(h,t)=>{if(h!=null)a.innerHTML=h;if(t!=null)m.textContent=t;};return s;};
    const btn=(v,i,t,o)=>{const b=mkBtn(Object.assign({variant:v,intent:i,size:'s'},o||{}));b.querySelector('span').textContent=t;return b;};
    const goStart=()=>{if(location.hash==='#start'&&typeof flwOpen==='function')flwOpen();else location.hash='start';};
    const goFigma=()=>{const f=document.getElementById('hxFigma');if(f)f.scrollIntoView({behavior:HX_REDUCE()?'auto':'smooth',block:'start'});};
    const eo=p=>1-Math.pow(1-Math.max(0,Math.min(1,p)),3); /* ease-out */
    const tw=(R,ms,f)=>{const t0=performance.now();const k=()=>{const p=Math.min(1,(performance.now()-t0)/ms);f(p);if(p<1)R.raf=requestAnimationFrame(k);};R.raf=requestAnimationFrame(k);};
    const setPrg=(p,v)=>{if(!p)return;const f=p.querySelector('.prg-fill');if(f){f.style.width=v+'%';f.classList.toggle('hx-done',v>=100);}p.setAttribute('aria-valuenow',v);const c=p.querySelector('.prg-pct');if(c)c.textContent=v+'%';};
    /* 每個示意回傳 {el, beats:[[fn,停留ms]...], end}：end＝靜態終態（減少動態／尚未播放時） */
    const visUpload=()=>{const d=drzEl('default','m');const ul=d.querySelector('.drz-files');const s=stage('','',d);
      const A=['品牌規範.pdf',3355443],B=['logo.svg',48213];let f1,f2;
      const up=(li,b,v)=>{setPrg(li.querySelector('.prg'),v);const m=li.querySelector('.drz-fm');if(m)m.textContent=drzSize(b)+' · 上傳中 '+v+'%';};
      const inF=(f,st)=>{const li=drzFile(f[0],f[1],st,0);li.classList.add('is-in');return li;};
      const end=()=>{ul.replaceChildren(drzFile(A[0],A[1],'done'),drzFile(B[0],B[1],'done'));s.hxCap('<b>Dropzone</b> · 上傳完成','2 個檔案');};
      return {el:s,end,beats:[
        [()=>{f1=inF(A,'uploading');ul.replaceChildren(f1);s.hxCap('<b>Dropzone</b> · 上傳中','1 個檔案');},700],
        [R=>tw(R,2600,p=>up(f1,A[1],Math.round(eo(p)*100))),2900],
        [()=>{f1.replaceWith(drzFile(A[0],A[1],'done'));f2=inF(B,'uploading');ul.appendChild(f2);s.hxCap(null,'2 個檔案');},700],
        [R=>tw(R,2200,p=>up(f2,B[1],Math.round(eo(p)*100))),2500],
        [()=>{f2.replaceWith(drzFile(B[0],B[1],'done'));s.hxCap('<b>Dropzone</b> · 上傳完成',null);},3400]]};};
    /* HOME14:v1 Step 02 示意改成照文案走一遍：選起始風格 → Design Token 輸入主色色碼 → 拖圓角 → 淺色／深色兩個預覽同時跟著變 */
    const visStyle=()=>{const NM=['俐落','柔和','活潑'];const sg=sgmEl('soft','m',{items:NM,active:1,label:'起始風格',live:true});
      const w=ce('div','hx-mcol hx-st2');
      /* token 欄位 1：主色（色票＋色碼逐字輸入） */
      const rc=ce('div','hx-tk');rc.innerHTML='<span class="hx-tk-n">主色</span><code class="hx-tk-v"><i class="hx-tk-sw"></i><span data-v></span><span class="hx-tk-cur"></span></code>';
      const hv=rc.querySelector('[data-v]');
      /* token 欄位 2：圓角（取用 Slider 原子，刻度＝圓角 token 尺標） */
      const RN=['--r-xs','--r-sm','--r-md','--r-lg','--r-xl','--r-pill'],STY_R=[0,2,5];
      const rr=ce('div','hx-tk hx-tk-sl');let sl=null,slV=2;
      const mkSl=i=>{slV=i;const n=sldEl('single','s','default',{min:0,max:RN.length-1,step:1,value:i,title:'圓角',live:true,
          format:x=>RN[x].slice(2)+' · '+(RN[x]==='--r-pill'?'pill':hxRootVar(RN[x])),onChange:x=>{slV=x;w.style.setProperty('--hx-tr','var('+RN[x]+')');}});
        if(sl)sl.replaceWith(n);else rr.appendChild(n);sl=n;};
      mkSl(2);
      /* 預覽：淺色／深色並排，同一組 Button 原子 */
      const pv=ce('div','hx-st-pv');
      [['light','淺色'],['dark','深色']].forEach(([m,t])=>{const h=ce('div','hx-st-pm');h.dataset.m=m;const lb=ce('span','hx-st-pl');lb.textContent=t;
        const r=ce('div','hx-mrow');r.append(btn('solid','primary','主要'),btn('outline','secondary','次要'));h.append(lb,r);pv.appendChild(h);});
      w.append(rc,rr,pv);
      const s=stage('<b>Segmented</b> · 起始風格','柔和',sg,w);
      const BASE=['--c-brand-500','--c-brand-500','--c-brand2-500'],NEW='--c-info-600';
      const hexOf=n=>(hxRootVar(n)||'').toUpperCase();
      const go=k=>{const b=sg.querySelectorAll('.sgm-it')[k];if(b&&!b.classList.contains('is-active'))b.click();w.dataset.sty=String(k);
        delete w.dataset.c;w.style.removeProperty('--hx-tr');rc.classList.remove('is-typ');hv.textContent=hexOf(BASE[k]);mkSl(STY_R[k]);
        s.hxCap('<b>Segmented</b> · 起始風格',NM[k]);};
      const typeHex=R=>{const k=+w.dataset.sty||0,from=hexOf(BASE[k]),to=hexOf(NEW);s.hxCap('<b>Design Token</b> · 主色','輸入色碼');rc.classList.add('is-typ');
        let t=0;for(let i=from.length;i>=1;i--){R.later(()=>{hv.textContent=from.slice(0,i);},t);t+=55;}  /* 先逐字刪到「#」 */
        for(let i=2;i<=to.length;i++){R.later(()=>{hv.textContent=to.slice(0,i);},t+=110);}
        R.later(()=>{w.dataset.c='1';rc.classList.remove('is-typ');s.hxCap(null,'淺色、深色一起換');},t+240);};
      const drag=R=>{s.hxCap('<b>Design Token</b> · 圓角','拖曳調整');let t=200;
        for(let x=slV+1;x<=4;x++){R.later(()=>{const th=sl.querySelector('.sld-thumb');if(th)th.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));},t);t+=650;}  /* 用原子自己的鍵盤步進 */
        R.later(()=>s.hxCap(null,'整站元件跟著變'),t);};
      const end=()=>{go(1);hv.textContent=hexOf(NEW);w.dataset.c='1';s.hxCap('<b>Design Token</b> · 已套用','淺色、深色一起看');};
      return {el:s,end,beats:[[()=>go(0),2200],[()=>go(1),2200],[()=>go(2),2400],[()=>go(1),900],[typeHex,3000],[drag,3200]]};};
    const visPick=()=>{const L=[['Button 按鈕','L3'],['Field 輸入欄','L3'],['Dropzone 上傳','L3'],['Carousel 輪播','L4'],['Gantt 甘特圖','L4']];const w=ce('div');
      const rows=L.map(([t,m])=>{const r=ce('div','hx-pick');r.append(cbxEl('default','m'));const l=ce('span');l.textContent=t;const mm=ce('span','hx-pick-m');mm.textContent=m;r.append(l,mm);w.appendChild(r);return r;});
      const s=stage('<b>Checkbox</b> · 元件清單','已選 0 / 5',w);
      const set=(i,st)=>{const o=rows[i].firstChild;if(!o.classList.contains('st-'+st))o.replaceWith(cbxEl(st,'m'));};
      const cnt=()=>s.hxCap(null,'已選 '+rows.filter(r=>r.firstChild.classList.contains('st-checked')).length+' / 5');
      const tick=i=>R=>{set(i,'hover');R.later(()=>{set(i,'checked');cnt();},380);};
      return {el:s,end:()=>{rows.forEach((r,i)=>set(i,i<3?'checked':'default'));cnt();},beats:[
        [()=>{rows.forEach((r,i)=>set(i,'default'));cnt();},1200],[tick(0),1300],[tick(1),1300],[tick(2),3600]]};};
    const visExport=()=>{const w=ce('div','hx-mcol');const bars=['tokens.export.json','components.export.json'].map(t=>{const p=prgEl('label','s',{value:0});const c=p.querySelector('.prg-cap');if(c){c.textContent=t;c.classList.add('hx-fl-file');}w.appendChild(p);return p;});
      const br=ce('div','hx-mrow hx-wrap');const bw=btn('solid','primary','輸出檔案'),bd=btn('outline','secondary','交給 Claude');const ok=tg('soft','success','已寫入 Figma');ok.insertAdjacentHTML('afterbegin',ICON_FIGMA);ok.classList.add('hx-fl-ok');br.append(bw,bd,ok);
      const s=stage('<b>Progress</b> · 輸出中','2 個檔案',w,br);
      const press=(b,R)=>{b.classList.replace('st-default','st-pressed');R.later(()=>b.classList.replace('st-pressed','st-default'),240);};
      return {el:s,end:()=>{bars.forEach(p=>setPrg(p,100));ok.classList.add('is-on');s.hxCap('<b>Claude</b> · 已寫入 Figma','Variables · variant');},beats:[
        [()=>{bars.forEach(p=>setPrg(p,0));ok.classList.remove('is-on');s.hxCap('<b>Progress</b> · 輸出中','2 個檔案');},600],
        [R=>tw(R,3000,p=>{setPrg(bars[0],Math.round(eo(p/.78)*100));setPrg(bars[1],Math.round(eo((p-.22)/.78)*100));}),3300],
        [R=>{press(bw,R);s.hxCap('<b>Progress</b> · 輸出完成','2 個檔案');},1100],
        [R=>{press(bd,R);s.hxCap('<b>Claude</b> · 寫入 Figma 中','ds-studio-flow');},1600],
        [R=>{ok.classList.add('is-on');s.hxCap('<b>Claude</b> · 已寫入 Figma','Variables · variant');},3400]]};};
    const steps=[
      ['丟進你的品牌資料','按「開啟新專案」填好專案名稱、產業與平台，上傳品牌規範、logo 或 PRD，再回答幾題品牌問卷。網站會依答案提出第一版 token 與元件建議，草稿自動保存，隨時回來接著做。',visUpload],
      ['挑風格和主色','先選俐落、柔和或活潑當起點，再到 Design Token 頁自己輸入色碼，調整間距、圓角、字級與陰影。改一個值，整站元件立刻跟著換色換形，淺色、深色模式一起看。',visStyle],
      ['勾選要用的元件','到各元件頁用變數篩選器勾選需要的樣式、意圖、狀態和尺寸，狀態一覽表與變體數即時縮減。上方即時預覽可切換組合，HTML／CSS 程式碼同步更新，一鍵複製；圓角、間距也能用 Token 綁定換成別的 token。',visPick],
      ['輸出檔案，交給 Claude 接上 Figma','確認後輸出 token 檔、元件清單和 SCSS 樣式包。把檔案交給裝好 ds-studio-flow skill 的 Claude，它會寫進 Figma Variables 和元件 variant，並記下這份專案的版本。之後哪一邊有改動，都能再跑一次同步。',visExport],
    ];
    const ol=sec.querySelector('#hxSteps');const runs=[];
    steps.forEach(([t,d,vis],i)=>{const li=ce('li','hx-step bento-card');li.style.setProperty('--hx-st-i',String(i));
      const tx=ce('div','hx-step-tx');const k=tagEl('solid','neutral','default','round','m');k.classList.add('hx-step-k');k.querySelector('span').textContent='Step 0'+(i+1);const h=ce('h3','hx-step-h');h.textContent=t;
      const p=ce('p','hx-step-d');p.textContent=d;tx.append(k,h,p);
      if(i===steps.length-1){const a=ce('div','hx-step-a');
        const b1=mkBtn({variant:'solid',intent:'primary',size:'m',isLive:true,trail:true});b1.querySelector('span').textContent='開始新專案';b1.onclick=goStart;
        const b2=mkBtn({variant:'text',intent:'secondary',size:'m',isLive:true});b2.querySelector('span').textContent='看 Figma 同步';b2.onclick=goFigma;
        a.append(b1,b2);const n=ce('p','hx-sub hx-fl-end');n.textContent='中途關掉也沒關係，草稿會幫你留著。';tx.append(a,n);}
      const v=ce('div','hx-step-v');v.inert=true;v.setAttribute('aria-hidden','true');
      try{const an=vis();v.appendChild(an.el);an.end();
        const R={i:0,t:0,raf:0,subs:[],on:false,vis:false};R.later=(f,ms)=>{R.subs.push(setTimeout(f,ms));};
        R.halt=()=>{clearTimeout(R.t);cancelAnimationFrame(R.raf);R.subs.forEach(clearTimeout);R.subs=[];R.t=0;R.raf=0;};
        const beat=()=>{if(!sec.isConnected){stop();return;}const [f,ms]=an.beats[R.i];f(R);R.t=setTimeout(()=>{R.subs.forEach(clearTimeout);R.subs=[];R.i=(R.i+1)%an.beats.length;beat();},ms);};
        R.sync=()=>{const want=R.vis&&!document.hidden&&!HX_REDUCE();if(want===R.on)return;R.on=want;R.halt();
          if(want){R.i=0;beat();}else an.end();}; /* 進畫面從頭播；離開／分頁隱藏停在終態 */
        R.li=li;runs.push(R);}catch(e){}
      li.append(tx,v);ol.appendChild(li);});
    /* 堆疊效果：每張卡被後面幾張蓋住的程度加總 → --hx-st-p（0＝沒被蓋、1＝被一張完全蓋住…），CSS 依此微縮＋淡出。.main 捲動不冒泡 → document capture 監聽 */
    if(window.__hxFlowStop)window.__hxFlowStop();
    const lis=[...ol.children],MOB=matchMedia('(max-width:767px)');let raf=0;
    const paint=()=>{raf=0;if(!sec.isConnected){stop();return;}const on=!HX_REDUCE()&&!MOB.matches;
      const tops=lis.map(li=>li.getBoundingClientRect().top);
      lis.forEach((li,i)=>{let s=0;if(on){const h=li.offsetHeight||1;for(let j=i+1;j<lis.length;j++){const dd=tops[j]-tops[i]-12*(j-i);s+=Math.max(0,Math.min(1,1-dd/h));}}
        const v=s.toFixed(3);if(li.style.getPropertyValue('--hx-st-p')!==v)li.style.setProperty('--hx-st-p',v);});};
    const req=()=>{if(!raf)raf=requestAnimationFrame(paint);};
    /* HOME11:v1 播放閘：卡片在畫面內（IntersectionObserver）＋分頁可見＋未要求減少動態才播 */
    const io=window.IntersectionObserver?new IntersectionObserver(es=>es.forEach(e=>{const R=runs.find(r=>r.li===e.target);if(R){R.vis=e.isIntersecting;R.sync();}}),{threshold:.35}):null;
    if(io)runs.forEach(R=>io.observe(R.li));
    const onVis=()=>runs.forEach(R=>R.sync());const RM=matchMedia('(prefers-reduced-motion:reduce)');
    const stop=()=>{document.removeEventListener('scroll',req,true);removeEventListener('resize',req);if(raf)cancelAnimationFrame(raf);raf=0;
      document.removeEventListener('visibilitychange',onVis);try{RM.removeEventListener('change',onVis);}catch(e){}if(io)io.disconnect();runs.forEach(R=>{R.on=false;R.halt();});
      if(window.__hxFlowStop===stop)window.__hxFlowStop=null;};
    viewOn(document,'scroll',req,{capture:true,passive:true});viewOn(window,'resize',req,{passive:true});window.__hxFlowStop=stop;viewDone(stop);req();
    viewOn(document,'visibilitychange',onVis);try{viewOn(RM,'change',onVis);}catch(e){}
    return sec;
  }

  let HX_TW_ID=0;
  function hxFigma(){ /* HOME17:v1 三方同步拼貼：卡片平放交疊（不旋轉）＋卡片間細拋物線箭頭（資料流過時小點沿線移動）；
       網站卡（cdl logo）改主色／間距（打字）、勾 hover、勾 icon → 程式碼 → Figma Variables／Button 元件 property 依序更新 */
    const sec=ce('section','gd-sec hx-sec hx-sy');sec.id='hxFigma';
    const uid='hxtw'+(++HX_TW_ID);
    sec.innerHTML=`<div class="gd-sec-h"><h2 class="gd-sec-t">從 Claude 開始，程式碼與 Figma 自動同步</h2><div class="hx-sec-x" id="hxFgX"></div></div>
      <div class="hx-sy-intro"><p class="hx-sy-lede">你也可以從 Github 下載 Skill 檔案，用 Claude 從訪談階段一步步帶你執行。AI 會根據你的品牌規範、PRD、Wireframe 等輸入資料，提供更客製化的元件庫推薦。</p></div>
      <div class="hx-tw" role="img" aria-label="示意：在專案網站改色碼、間距、元件狀態與 icon，程式碼和 Figma 的 Variables、元件 property 跟著同步">
        <div class="hx-tw-glow" aria-hidden="true"></div>
        <div class="hx-tw-card hx-tw-web"><div class="hx-tw-bar"><span class="hx-tw-dots"><i></i><i></i><i></i></span><svg class="hx-tw-logo" viewBox="0 0 90 48" fill="none" aria-label="CDL"><g stroke="currentColor" stroke-width="6"><path d="M25.96 21.64A13 13 0 1 0 25.96 38.36"/><circle cx="48" cy="30" r="13"/><path d="M61 2V46"/><path d="M75 2V46"/></g><rect x="82" y="40" width="6" height="6" fill="var(--accent2)"/></svg><span class="hx-tw-url">productname.vercel.app</span></div><div class="hx-tw-wb"></div></div>
        <div class="hx-tw-card hx-tw-code"><div class="hx-tw-ch"><span class="is-on">tokens.export.json</span><span>components.export.json</span></div><div class="hx-tw-cd"></div></div>
        <div class="hx-tw-card hx-tw-var"><div class="hx-tw-fh">${ICON_FIGMA}<b>Local variables</b><em>✕</em></div>
          <div class="hx-tw-vt"><div class="hx-tw-vc"><small>Collections</small><span>Primitives</span><span class="is-on">Semantic</span><span>Spacing</span><span>Radius</span></div><div class="hx-tw-vb"></div></div></div>
        <div class="hx-tw-card hx-tw-cmp"><div class="hx-tw-fh">${ICON_FIGMA}<b>Button</b><em>Component set</em></div><div class="hx-tw-pv"></div><div class="hx-tw-props"></div></div>
        <svg class="hx-tw-arw" aria-hidden="true"><defs>${['a','b','c'].map(k=>`<marker id="${uid}m${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path class="hx-tw-mk" data-m="${k}" d="M1 1 9 5 1 9"/></marker>`).join('')}</defs>
          ${['a','b','c'].map(k=>`<path id="${uid}${k}" class="hx-tw-ln-a" data-a="${k}" marker-end="url(#${uid}m${k})"/><circle class="hx-tw-dot" r="3.5" data-d="${k}"><animateMotion dur="0.9s" begin="indefinite" fill="freeze" calcMode="spline" keySplines=".4 0 .2 1" keyTimes="0;1"><mpath href="#${uid}${k}"/></animateMotion></circle>`).join('')}</svg>
        <div class="hx-tw-pill"><span class="hx-tw-pk"></span><span data-pill></span></div>
        <div class="hx-tw-cur" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 2.5 20 11l-7.2 1.7L9.6 20z" fill="currentColor" stroke="var(--panel)" stroke-width="1.5" stroke-linejoin="round"/></svg><span>you</span></div>
      </div>
      <ul class="hx-sy-facts"></ul>`;
    { const intro=sec.querySelector('.hx-sy-intro');   // HOME-GH:v1 GitHub 連結：主按鈕，另開分頁（同頂欄）
      const gh=mkBtn({variant:'solid',intent:'primary',size:'m',isLive:true});gh.type='button';gh.classList.add('hx-sy-gh');
      gh.querySelector('span').textContent='Download Skill';gh.insertAdjacentHTML('afterbegin',ICON_GITHUB);gh.setAttribute('aria-label','Download Skill（GitHub，另開分頁）');
      gh.onclick=()=>window.open('https://github.com/edward890131/cool-ds-library','_blank','noopener');
      if(intro)intro.appendChild(gh); }
    const g=sec.querySelector('.hx-tw');g.inert=true;
    const HX=n=>(hxRootVar(n)||'').toUpperCase();
    const TOK=['--c-info-600','--accent2','--c-success-600','--c-violet-500'],SP=['--sp-4','--sp-5','--sp-6'],ST=['default','hover','pressed','disabled'];
    const row=(cls,k,v)=>{const r=ce('div','hx-tw-row '+(cls||''));const a=ce('span','hx-tw-k');a.innerHTML=k;const b=ce('span','hx-tw-v');b.innerHTML=v||'';r.append(a,b);return r;};
    const field=(pre)=>`<span class="hx-tw-hex">${pre}<span data-v></span><span class="hx-tw-caret"></span></span>`;
    /* 網站卡：主色、間距都是可輸入欄位；狀態與 icon 用 Checkbox 原子 */
    const wb=sec.querySelector('.hx-tw-wb');const wt=ce('div','hx-tw-wt');wt.textContent='Design Token';wb.appendChild(wt);
    const rHex=row('','主色',field('<i class="hx-tw-sw"></i>'));const rSp=row('','間距',field('<i class="hx-tw-sp"></i>'));wb.append(rHex,rSp);
    const hexV=rHex.querySelector('[data-v]'),hexSw=rHex.querySelector('.hx-tw-sw'),hexBox=rHex.querySelector('.hx-tw-hex');
    const spV=rSp.querySelector('[data-v]'),spBox=rSp.querySelector('.hx-tw-hex'),spBar=rSp.querySelector('.hx-tw-sp');
    const rSt=ce('div','hx-tw-row hx-tw-r-st');const stL=ce('span','hx-tw-k');stL.textContent='Button 狀態';const stG=ce('span','hx-tw-cbs');rSt.append(stL,stG);wb.appendChild(rSt);
    const stOn={default:true,hover:false,pressed:true,disabled:false};const cbx={};
    const lab=(on,t)=>{const l=ce('label','hx-tw-cb');l.append(cbxEl(on?'checked':'default','s'),document.createTextNode(t));return l;};
    const paintCbx=()=>ST.forEach(k=>{const l=lab(stOn[k],k);if(cbx[k])cbx[k].replaceWith(l);else stG.appendChild(l);cbx[k]=l;});
    paintCbx();
    const rIc=ce('div','hx-tw-row');let icL=lab(false,'顯示 icon');rIc.appendChild(icL);wb.appendChild(rIc);
    /* 程式碼卡（語法色跟隨淺／深色） */
    const cd=sec.querySelector('.hx-tw-cd');
    const ln=k=>{const l=ce('div','hx-tw-ln');l.innerHTML=`<span class="sx-k">"${k}"</span><span class="sx-p">: </span><span data-v></span>`;cd.appendChild(l);return l;};
    const cHex=ln('color.primary'),cSp=ln('space.inset'),cSt=ln('button.state'),cIc=ln('button.icon');
    /* Figma Variables 表格 */
    const vb=sec.querySelector('.hx-tw-vb');
    const vr=(n,sw,v,d)=>{const r=ce('div','hx-tw-vr');r.innerHTML=`<span>${sw}${n}</span><code data-v>${v||''}</code>`;vb.appendChild(r);return r;};
    vb.insertAdjacentHTML('beforeend','<div class="hx-tw-vr hx-tw-vh"><span>Name</span><span>Value</span></div>');
    const vHex=vr('action/primary','<i class="hx-tw-sw"></i>');const vSp=vr('spacing/inset','<i class="hx-tw-sp"></i>');
    vr('feedback/success','<i class="hx-tw-sw" style="background:var(--s-feedback-success)"></i>',HX('--s-feedback-success'));vr('radius/sm','<i class="hx-tw-rd"></i>',hxRootVar('--r-sm'));
    /* Figma 元件卡：Button 原子預覽＋property（variant 選項／boolean 用 Checkbox） */
    const pv=sec.querySelector('.hx-tw-pv'),props=sec.querySelector('.hx-tw-props');
    const pSt=row('','State','');const pIc=row('','Icon','');const pSize=row('hx-tw-dim','Size','<span class="hx-tw-opt is-on">m</span>');props.append(pSt,pIc,pSize);
    let pCb=cbxEl('default','s');pIc.querySelector('.hx-tw-v').appendChild(pCb);
    let prevSt='default',prevIc=false,hexI=0,spI=0;
    const setPrev=()=>{const b=mkBtn({variant:'solid',intent:'primary',size:'m',lead:prevIc,state:prevSt});b.querySelector('span').textContent='Button';pv.replaceChildren(b);};
    const onHex=()=>{const t=TOK[hexI];g.style.setProperty('--hx-tw-pc','var('+t+')');hexSw.style.background=vHex.querySelector('.hx-tw-sw').style.background='var('+t+')';
      hexV.textContent=HX(t);vHex.querySelector('[data-v]').textContent=HX(t);cHex.querySelector('[data-v]').innerHTML='<span class="sx-s">"'+HX(t)+'"</span>';};
    const onSp=()=>{const t=SP[spI],px=hxRootVar(t);g.style.setProperty('--hx-tw-pad','var('+t+')');spBar.style.width=vSp.querySelector('.hx-tw-sp').style.width='var('+t+')';
      spV.textContent=px;vSp.querySelector('[data-v]').textContent=px;cSp.querySelector('[data-v]').innerHTML='<span class="sx-s">"'+px+'"</span>';};
    const onSt=()=>{const on=ST.filter(k=>stOn[k]);cSt.querySelector('[data-v]').innerHTML='<span class="sx-p">[</span>'+on.map(k=>'<span class="sx-s">"'+k+'"</span>').join('<span class="sx-p">, </span>')+'<span class="sx-p">]</span>';
      pSt.querySelector('.hx-tw-v').innerHTML=on.map(k=>'<span class="hx-tw-opt'+(k===prevSt?' is-on':'')+'">'+k+'</span>').join('');};
    const onIc=()=>{cIc.querySelector('[data-v]').innerHTML='<span class="sx-n">'+prevIc+'</span>';const nl=lab(prevIc,'顯示 icon');icL.replaceWith(nl);icL=nl;const nc=cbxEl(prevIc?'checked':'default','s');pCb.replaceWith(nc);pCb=nc;};
    const paintAll=()=>{onHex();onSp();onSt();onIc();setPrev();};
    /* 拋物線箭頭：依卡片實際位置算；a＝網站→程式碼、b＝網站→Variables、c＝程式碼→元件 */
    const W={web:sec.querySelector('.hx-tw-web'),code:sec.querySelector('.hx-tw-code'),var:sec.querySelector('.hx-tw-var'),cmp:sec.querySelector('.hx-tw-cmp')};
    const PAIR={a:['web','code'],b:['web','var'],c:['code','cmp']};
    /* HOME19:v1 桌機箭頭照手繪：a＝網站卡底部左側 → 往下彎進程式碼卡左側；b＝網站卡右側偏下 → 往上拱進 Variables 左側；c＝程式碼右側 → 元件左側
       手機（≤767）沿用依相對位置自動計算 */
    const MOB=matchMedia('(max-width:767px)');
    const pt=(R,gr,side,t,o)=>side==='b'?{x:R.left-gr.left+R.width*t,y:R.bottom-gr.top+o}:side==='t'?{x:R.left-gr.left+R.width*t,y:R.top-gr.top-o}:side==='l'?{x:R.left-gr.left-o,y:R.top-gr.top+R.height*t}:{x:R.right-gr.left+o,y:R.top-gr.top+R.height*t};
    const DESK={a:[['b',.2],['l',.3],'down'],b:[['r',.62],['l',.4],'up'],c:[['r',.32],['l',.42],'up']};
    /* 手機：a 沿左側（Variables 卡左邊的空隙）往下進程式碼；b 從網站卡右側往右繞進 Variables 右側；c 從程式碼底部 L 形轉進元件左側 */
    const MOBS={a:[['b',.08],['t',.1],'left'],b:[['r',.7],['r',.16],'right'],c:[['b',.22],['l',.5],'down']};
    const geo=()=>{const gr=g.getBoundingClientRect();if(!gr.width)return;
      Object.entries(PAIR).forEach(([k,[f,t]])=>{const A=W[f].getBoundingClientRect(),B=W[t].getBoundingClientRect();let p0,p1,c;
        if(true){const [s0,s1,bow]=(MOB.matches?MOBS:DESK)[k];p0=pt(A,gr,s0[0],s0[1],6);p1=pt(B,gr,s1[0],s1[1],9);
          if(bow==='down')c={x:p0.x,y:p1.y};  /* L 形二次曲線：先往下再轉進目標 */
          else if(bow==='left')c={x:Math.min(p0.x,p1.x)-28,y:(p0.y+p1.y)/2};
          else if(bow==='right')c={x:Math.min(Math.max(p0.x,p1.x)+24,gr.width-6),y:(p0.y+p1.y)/2};
          else{const len=Math.hypot(p1.x-p0.x,p1.y-p0.y);c={x:(p0.x+p1.x)/2,y:Math.min(p0.y,p1.y)-len*.28};}}
        else{const ca={x:A.left+A.width/2-gr.left,y:A.top+A.height/2-gr.top},cb={x:B.left+B.width/2-gr.left,y:B.top+B.height/2-gr.top};
          const dx=cb.x-ca.x,dy=cb.y-ca.y;
          if(Math.abs(dx)>Math.abs(dy)){p0={x:(dx>0?A.right:A.left)-gr.left+(dx>0?6:-6),y:ca.y-A.height*.18};p1={x:(dx>0?B.left:B.right)-gr.left+(dx>0?-8:8),y:cb.y-B.height*.22};}
          else{p0={x:ca.x+A.width*.18,y:(dy>0?A.bottom:A.top)-gr.top+(dy>0?6:-6)};p1={x:cb.x-B.width*.12,y:(dy>0?B.top:B.bottom)-gr.top+(dy>0?-8:8)};}
          const mx=(p0.x+p1.x)/2,my=(p0.y+p1.y)/2,len=Math.hypot(p1.x-p0.x,p1.y-p0.y);
          let nx=-(p1.y-p0.y)/len,ny=(p1.x-p0.x)/len;if(ny>0){nx=-nx;ny=-ny;}
          c=Math.abs(dx)>Math.abs(dy)?{x:mx+nx*len*.32,y:my+ny*len*.32}:{x:mx+len*.22,y:my-len*.12};}
        sec.querySelector(`[data-a="${k}"]`).setAttribute('d',`M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`);});};
    const ro=window.ResizeObserver?new ResizeObserver(()=>geo()):null;if(ro)ro.observe(g);
    /* 游標＋同步提示 */
    const cur=sec.querySelector('.hx-tw-cur'),pill=sec.querySelector('[data-pill]');
    const moveTo=el=>{const gr=g.getBoundingClientRect(),r=el.getBoundingClientRect();cur.style.transform=`translate(${Math.round(r.left-gr.left+r.width*.55)}px,${Math.round(r.top-gr.top+r.height*.55)}px)`;cur.classList.add('is-on');};
    const click=()=>{cur.classList.remove('is-click');void cur.offsetWidth;cur.classList.add('is-click');};
    let tms=[],run=false,vis=false,n=0;const later=(f,ms)=>{tms.push(setTimeout(()=>{if(run)f();},ms));};
    const flash=el=>{el.classList.remove('is-hit');void el.offsetWidth;el.classList.add('is-hit');later(()=>el.classList.remove('is-hit'),1500);};
    const flow=k=>{const pa=sec.querySelector(`[data-a="${k}"]`),d=sec.querySelector(`[data-d="${k}"]`);flash(pa);flash(sec.querySelector(`[data-m="${k}"]`));d.classList.add('is-on');try{d.querySelector('animateMotion').beginElement();}catch(e){}later(()=>d.classList.remove('is-on'),1100);};
    const say=t=>{pill.textContent=t;flash(sec.querySelector('.hx-tw-pill'));};
    const typeIn=(box,vEl,to,t0)=>{const from=vEl.textContent;let t=t0;later(()=>{click();box.classList.add('is-typ');},t);t+=250;
      for(let c=from.length;c>=1;c--){later(()=>{vEl.textContent=from.slice(0,c-1);},t);t+=40;}
      for(let c=1;c<=to.length;c++){later(()=>{vEl.textContent=to.slice(0,c);},t);t+=85;}
      later(()=>box.classList.remove('is-typ'),t);return t;};
    /* 四拍：主色 → 間距 → 勾 hover → 勾 icon；每拍資料沿箭頭流：網站 → 程式碼／Variables → 元件 */
    const B=[
      ()=>{const nx=(hexI+1)%TOK.length;moveTo(hexBox);const t=typeIn(hexBox,hexV,HX(TOK[nx]),650);
        later(()=>{hexI=nx;onHex();flow('a');flow('b');flash(cHex);flash(vHex);say('Variables · color/primary');},t+150);
        later(()=>{flow('c');setPrev();flash(W.cmp);},t+1050);return t+2600;},
      ()=>{const nx=(spI+1)%SP.length;moveTo(spBox);const t=typeIn(spBox,spV,hxRootVar(SP[nx]),650);
        later(()=>{spI=nx;onSp();flow('a');flow('b');flash(cSp);flash(vSp);say('Variables · spacing/inset');},t+150);
        later(()=>{flow('c');setPrev();flash(W.cmp);},t+1050);return t+2600;},
      ()=>{moveTo(cbx.hover.firstChild);later(()=>{click();stOn.hover=true;prevSt='hover';paintCbx();onSt();flow('a');flash(cSt);say('Variant property · State = hover');},650);
        later(()=>{flow('c');setPrev();flash(pSt);},1550);return 3300;},
      ()=>{moveTo(icL.firstChild);later(()=>{click();prevIc=true;onIc();flow('a');flash(cIc);say('Boolean property · Icon = true');},650);
        later(()=>{flow('c');setPrev();flash(pIc);},1550);return 3300;},
      ()=>{cur.classList.remove('is-on');say('Site ← → Code ← → Figma · 已同步');return 2400;},
      ()=>{stOn.hover=false;prevSt='default';prevIc=false;paintCbx();onSt();onIc();setPrev();return 600;}];
    const tick=()=>{if(!sec.isConnected){cleanup();return;}geo();const ms=B[n%B.length]();n++;later(tick,ms);};
    const stop=()=>{run=false;tms.forEach(clearTimeout);tms=[];cur.classList.remove('is-on');};
    const end=()=>{stOn.hover=true;prevSt='hover';prevIc=true;spI=1;paintCbx();paintAll();pill.textContent='Site ← → Code ← → Figma · 已同步';geo();};
    const mq=matchMedia('(prefers-reduced-motion:reduce)');
    const want=()=>vis&&!document.hidden&&!mq.matches&&sec.isConnected;
    const syncRun=()=>{const w=want();if(w&&!run){run=true;n=0;B[5]();later(tick,700);}else if(!w&&run){stop();end();}};
    const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)geo();syncRun();},{threshold:.3});io.observe(g);
    const onVis=()=>syncRun();viewOn(document,'visibilitychange',onVis);viewOn(mq,'change',onVis);
    const cleanup=()=>{stop();io.disconnect();if(ro)ro.disconnect();document.removeEventListener('visibilitychange',onVis);mq.removeEventListener('change',onVis);};
    paintAll();end();requestAnimationFrame(geo);
    /* HOME12:v1 三欄線稿：幾何八角形 icon（1px 線、currentColor）＋ display 標題＋說明；進入畫面時線條描繪 */
    const oct=(x,y,w,h,c)=>[[x+c,y],[x+w-c,y],[x+w,y+c],[x+w,y+h-c],[x+w-c,y+h],[x+c,y+h],[x,y+h-c],[x,y+c]].map(p=>p.join(',')).join(' ');
    const reg=(cx,cy,r,a0)=>Array.from({length:8},(_,i)=>{const a=(a0+i*45)*Math.PI/180;return (cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1);}).join(' ');
    const pg=(pts,cls,d)=>`<polygon class="${cls||''}" points="${pts}" pathLength="1" style="--d:${d||0}"/>`;
    /* 簡化版 icon：兩個基本形＋一顆強調色小方塊（同 logo 的 cdl. 點綴） */
    const ac=(x,y)=>`<rect class="ac" x="${x}" y="${y}" width="6" height="6"/>`;
    const ICONS={
      layers:pg(oct(4,10,34,34,9),'bk',0)+pg(oct(18,4,34,34,9),'fr',1)+ac(54,38),
      split:pg(reg(26,24,20,22.5),'bk',0)+`<line class="fr" x1="12" y1="38" x2="40" y2="10" pathLength="1" style="--d:1"/>`+ac(50,38),
      drift:pg(oct(4,8,30,30,8),'bk',0)+pg(oct(20,14,30,30,8),'fr',1)+ac(54,6),
      web:pg('4,6 52,6 52,42 4,42','bk',0)+`<line class="fr" x1="4" y1="16" x2="52" y2="16" pathLength="1" style="--d:1"/>`+ac(56,0)   /* HOME15:v1 瀏覽器視窗 */
    };
    const FACTS=[  /* HOME18:v1 說明精簡 */
      ['web','Library Edit','每個專案有自己的 library 網址，在網頁上改 token、即時預覽元件，輸出後由 Claude 同步到程式碼和 Figma。'],
      ['layers','Variables','顏色、間距、圓角、字級和陰影都寫成 Figma Variables，淺色、深色各一個 mode，元件數值全部綁定、不寫死。'],
      ['split','Variants','網站上的樣式、意圖、狀態、尺寸一對一變成 Figma variant，內容開關變成 boolean，兩邊組合方式一致。'],
      ['drift','Drift Check','任一邊有改動，差異檢查會列出哪裡不同並分類，確認後才寫回，三邊不會互相覆蓋。']];
    const fl=sec.querySelector('.hx-sy-facts');
    FACTS.forEach(([ic,k,t])=>{const li=ce('li','hx-sy-f');li.dataset.ic=ic;
      li.innerHTML=`<svg class="hx-sy-ic" viewBox="0 0 64 48" aria-hidden="true" focusable="false">${ICONS[ic]}</svg><h3 class="hx-sy-ft"></h3><p class="hx-sy-fd"></p>`;
      li.querySelector('h3').textContent=k;li.querySelector('p').textContent=t;fl.appendChild(li);});
    /* HOME18:v1 手機：四張亮點水平輪播（滑動吸附＋左右箭頭） */
    {const nav=ce('div','hx-sy-fnav');const ARW=PI('arrow-left');
      const cnt=ce('span','hx-sy-fn');const step=d=>{const li=fl.querySelector('li');if(!li)return;fl.scrollBy({left:d*(li.offsetWidth+parseFloat(getComputedStyle(fl).columnGap||0)),behavior:HX_REDUCE()?'auto':'smooth'});};
      const mk=(lb,d)=>{const b=mkBtn({variant:'outline',intent:'secondary',size:'s',iconOnly:true,isLive:true});b.type='button';b.innerHTML=ARW;b.setAttribute('aria-label',lb);if(d>0)b.classList.add('hx-tm-nx');b.onclick=()=>step(d);return b;};
      const pb=mk('上一張',-1),nb=mk('下一張',1);nav.append(pb,cnt,nb);fl.after(nav);
      const upd=()=>{const li=fl.querySelector('li');const w=li?li.offsetWidth:1;const i=Math.round(fl.scrollLeft/(w+parseFloat(getComputedStyle(fl).columnGap||0)));const N=fl.children.length;
        cnt.textContent=(Math.min(N,i+1))+' / '+N;pb.disabled=fl.scrollLeft<4;nb.disabled=fl.scrollLeft+fl.clientWidth>=fl.scrollWidth-4;};
      fl.addEventListener('scroll',()=>requestAnimationFrame(upd),{passive:true});viewOn(window,'resize',upd,{passive:true});requestAnimationFrame(upd);}
    if(HX_REDUCE())fl.classList.add('is-in');
    else{const fio=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;fio.disconnect();fl.classList.add('is-in');},{threshold:.3});fio.observe(fl);}
    return sec;
  }

  function hxNews(){ /* HOME9:v1 */
    const sec=ce('section','gd-sec hx-sec');sec.id='hxNews';
    const isProj=!!window.__dsProject;
    const data=(isProj&&typeof projectChangelogData==='function'?projectChangelogData():CHANGELOG_DATA).slice(0,4);
    sec.innerHTML=`<div class="gd-sec-h"><h2 class="gd-sec-t">常見問題 FAQ</h2></div><div class="hx-nf"><div class="hx-news bento-card"></div><div class="hx-faq"></div></div>`;
    const nw=sec.querySelector('.hx-news');
    const nh=ce('div','hx-news-h');const nt=ce('h3','hx-h3');nt.textContent=isProj?'最近的更新':'最近的版本';nh.appendChild(nt);nw.appendChild(nh);
    const all=document.createElement('a');all.className='hx-more';all.href='#changelog';all.innerHTML='看全部 '+ICON_ARROW;all.onclick=e=>{e.preventDefault();renderView('changelog');};nh.appendChild(all);
    if(!data.length){const p=ce('p','hx-sub');p.textContent='目前還沒有更新紀錄。';nw.appendChild(p);}
    else{const ul=ce('ul','hx-nl');nw.appendChild(ul);
      data.forEach(r=>{const li=ce('li');const a=document.createElement('a');a.className='hx-nl-i';a.href='#changelog';a.onclick=e=>{e.preventDefault();renderView('changelog');};
        const v=tagEl('soft','brand','default');v.querySelector('span').textContent=r.v;
        const t=ce('span','hx-nl-t');t.textContent=String(r.title||'').replace(/<[^>]+>/g,'');a.title=t.textContent;
        const d=document.createElement('time');d.className='hx-nl-d';d.textContent=r.date||'';
        a.append(v,t,d);li.appendChild(a);ul.appendChild(li);});}
    const FAQ=[
      {title:'這個網站是做什麼的？',body:'果思設計的共用元件庫。網站、程式碼和 Figma 用同一套 token 與元件：在這裡看元件長什麼樣、怎麼互動，再把需要的帶進專案。首頁上方的調色只是試玩，重新整理就還原。'},
      {title:'我要怎麼開始一個新專案？',body:'按右上角「開新專案」：先挑要用的元件，再調整顏色、字級、圓角等 <a href="#tokens">Design Token</a>，最後匯出樣式包與 Figma Variables。專案有自己的網址，之後可以回來繼續改。'},
      {title:'網站和 Figma 檔是什麼關係？',body:'網站是元件和 token 的正本。寫進 Figma 時，元件的樣式切換會變成 variant 或 boolean，顏色和圓角綁 Variables，不會寫死數值。'},
      {title:'母庫改了 token，進行中的專案會跟著變嗎？',body:'不會自動變。每個專案有自己的 tokens.export.json，母庫更新後由專案成員決定要不要同步。'},
      {title:'可以直接複製程式碼嗎？',body:'可以。每個元件頁都有 HTML 和 CSS 可以一鍵複製；<a href="#tokens">Design Token</a> 頁還能下載整包 SCSS。範本頁的畫面也都是元件組的，可以直接參考排版。'},
      {title:'範本（Template）是什麼？可以直接用嗎？',body:'範本是用元件組出來的常見畫面，例如 <a href="#tpl-ai-chat">AI 對話</a>、<a href="#tpl-admin-dashboard">後台儀表板</a>。範本只負責排版，元件或 token 一改，範本跟著更新；當作起點複製後再依專案調整即可。'},
    ];
    sec.querySelector('.hx-faq').appendChild(cpsAccordion(FAQ,{variant:'filled',indicator:'plusminus',multiple:true}));
    return sec;
  }

  /* 元件牆下方：宣言段落（隨捲動逐字由淡轉實）＋大數字（進入畫面時從 0 滾動計數到實際值）。
     數字取自網站本身：已定案元件數、全部變體組合數（DIAL_SPECS × dialCount）、:root 上的 design token 數、主題 × 斷點。減少動態時直接顯示終值與實色文字 */
  function hxStats(){
    const sec=ce('section','gd-sec hx-sec hx-stats');sec.id='hxStats';sec.setAttribute('aria-label','CDL 數字');
    const all=NAV.flatMap(g=>g.items),ready=all.filter(x=>x.st==='ready').length;
    let vars=0;try{Object.values(DIAL_SPECS).forEach(sp=>{if(!sp||!sp.order||!sp.axes)return;const pick={};sp.order.forEach(k=>pick[k]=sp.axes[k]||[]);vars+=dialCount(sp.order,pick,sp.when);});}catch(e){}
    let toks=0;try{const seen=new Set();for(const sh of document.styleSheets){let rs;try{rs=sh.cssRules;}catch(e){continue;}for(const r of rs){if(r.selectorText===':root'&&r.style)for(let i=0;i<r.style.length;i++){const n=r.style[i];if(/^--(c|s|r|sp|fs|fw|lh|e|dur|ease|font|i)-/.test(n))seen.add(n);}}}toks=seen.size;}catch(e){}
    const TXT_EN='Every component grows from the same set of tokens. Change one color or one radius, and the site, the code and Figma update together.';
    const TXT_JA='すべてのコンポーネントは、同じ token から生まれます。色や角丸をひとつ変えるだけで、サイトもコードも Figma もまとめて更新されます。';   /* I18N-JA:v2 */
    const TXT_ZH='每個元件都長在同一套 token 上。改一個顏色或一個圓角，網站、程式碼和 Figma 一起更新。';   /* LOC-SRC:v1 中文原文 */
    const curLang=()=>{try{return I18N_LANG;}catch(e){return 'zh';}};
    const manHTML=()=>{const L=curLang(),T=L==='ja'?TXT_JA:L==='en'?TXT_EN:TXT_ZH;   /* 英文以單字為單位、中日文以字為單位（英數字連在一起）逐一亮起 */
      const parts=L==='en'?T.split(/(\s+)/):T.match(/[A-Za-z0-9]+|\s+|./gu);
      return {T,html:parts.map(w=>/^\s+$/.test(w)?w:`<span aria-hidden="true">${w}</span>`).join('')};};
    const TXT=manHTML();
    const STATS=[[ready,'','元件'],[vars,'','變體組合'],[toks,'+','Design Token 數']];   /* LOC-SRC:v1 */
    sec.innerHTML=`<div class="hx-stats-card"><p class="hx-manifesto" data-i18n-skip aria-label="${TXT.T}">${TXT.html}</p>
      <div class="hx-nums">${STATS.map(([n,suf,lb])=>`<div class="hx-num"><div class="hx-num-l">${lb}</div><div class="hx-num-v"><span class="hx-num-n" data-to="${n}">${n.toLocaleString('en-US')}</span><span class="hx-num-s">${suf}</span></div></div>`).join('')}</div></div>`;
    let chars=[...sec.querySelectorAll('.hx-manifesto span')];const nums=[...sec.querySelectorAll('.hx-num-n')];
    /* I18N-JA:v2 切換語言：重建宣言的字塊，再依目前捲動位置上色 */
    const onLang=()=>{if(!sec.isConnected){document.removeEventListener('cdl:lang',onLang);return;}const m=sec.querySelector('.hx-manifesto'),t=manHTML();m.setAttribute('aria-label',t.T);m.innerHTML=t.html;
      chars=[...m.querySelectorAll('span')];if(HX_REDUCE())chars.forEach(c=>c.classList.add('on'));else requestAnimationFrame(()=>{try{paint();}catch(e){}});};
    viewOn(document,'cdl:lang',onLang);
    if(HX_REDUCE()){chars.forEach(c=>c.classList.add('on'));return sec;}
    nums.forEach(n=>n.textContent='0');
    /* 逐字變色：依段落在視窗中的位置算進度（段落頂到視窗 85% 開始，到 35% 全亮） */
    const main=document.querySelector('.main')||window;let raf=0;
    const paint=()=>{raf=0;if(!sec.isConnected){main.removeEventListener('scroll',onS);removeEventListener('resize',onS);return;}
      const r=sec.querySelector('.hx-manifesto').getBoundingClientRect(),vh=innerHeight;const a=vh*.85,b=vh*.35;
      const prog=Math.min(1,Math.max(0,(a-r.top)/((a-b)+r.height*.6)));const k=Math.round(prog*chars.length);
      chars.forEach((c,i)=>c.classList.toggle('on',i<k));};
    const onS=()=>{if(!raf)raf=requestAnimationFrame(paint);};
    viewOn(main,'scroll',onS,{passive:true});viewOn(window,'resize',onS);requestAnimationFrame(paint);
    /* 數字：第一次進入畫面才計數（ease-out，約 1.6s，錯開 120ms） */
    const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;io.disconnect();
      nums.forEach((el,i)=>{const to=+el.dataset.to,dur=1600,t0=performance.now()+i*120;
        const step=t=>{const p=Math.min(1,Math.max(0,(t-t0)/dur)),e=1-Math.pow(1-p,4);el.textContent=Math.round(to*e).toLocaleString('en-US');if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);});},{threshold:.35});
    io.observe(sec.querySelector('.hx-nums'));
    return sec;}

  const HX_TSM_BG=cdlAsset('img/home-feedback-bg.jpg');  /* 使用回饋面板背景（辦公室窗景，原檔 library/assets/photos/office-window.webp；網頁用壓縮版在 assets/img/） */
  /* HOME12:v1 使用回饋（testimonials）：寬幅圓角圖片面板＋置中淺色引言卡；← → 切換、細進度線、每 6 秒交叉淡入。
     hover／focus／離開畫面／分頁隱藏時暫停；減少動態＝不自動播放、不淡入。背景圖 bg、頭像 av 為每筆欄位，之後換正式照片只改這裡。 */
  /* HOME-MAP:v1 點陣世界地圖：Natural Earth 50m 陸地（公有領域）以 Miller 投影、每格 2° 轉成位元圖內嵌（cols×rows，1＝陸地），不外連任何資源。
     互動概念參考 Aceternity Inference Landing Page 的 Global network 段落；顏色全走 token（--ink／--c-info-*），深淺色自動切換 */
  const HX_GM={cols:180,rows:82,b64:'AAAAA+Ur4f///wAAbgAAAAIHAAAAAAAAAAD5P/4////4AAIAAAOAAf4AAAAAAAAAA/+v4A///4AAAAAB4AP/4AP4AAAAAAHGA/wAf//4AAAAAHAAf/4AHIAAAAAAH4X/8AP//wAAAAAGBD//+cDAAAAAAAH//3+AP//gAAAAAMD3///+H4AAgBAAD/z3/gP//gAAAAAcHf///+/8ABAH+Asf83/4P//gAAD4ABH///////wQAP/////9v4H//AAAf/gg7/////////wf///79/n4H/8AAAf/y///////////+P//////x/H/gAAA//7///////////+///////B+H/A+AA//P///////////Mf//////n8D8A+AB+/////////////Df/////5g8D8AIAH//////////////Af/////wvYB4AAIP7////////////8A//////gH0A4AAAP7///////////PwAH4P///gH2AAAACP9///////////OAABwD///wH+AAAAOF9/////////+A8AADAB///8H/AAAAGCz/////////8A8AAYAB////v/gAAAfD3/////////wA4AAgAB////v/wAAAfH///////////AwAQAAAP/////wAAAfv///////////AgAAAAAP/////wAAAD////////////BAAAAAAP////+4AAAD////////////AAAAAAAH////88AAAH///////////9AAAAAAAD/////AAAAB///fv//////5IAAAAAAD////+AAAAB//5/f//////xQAAAAAAD////gAAAAfzvwPf//////jgAAAAAAD////gAAAAfi///v/////+CAAAAAAAD///+AAAAAfyL//v/////8CAAAAAAAD///+AAAAAfCz//n/////+GAAAAAAAB///8AAAAAF/AK///////meAAAAAAAB///8AAAAAP/AB///////F4AAAAAAAAf//wAAAAAf/zh///////hAAAAAAAAAP//wAAAAAf//////////hAAAAAAAAAP/gwAAAAF///////////gAAAAAAAAAH/AwAAAAB///+/v/////gAAAAAAAAAD/AQAAAAD/////3/////gAAAAAAAAAA+AwAAAAD////f/D///+gAAAAAAAAAAfGMAAAAH//////B/7/wAAAAAAAgAAAfMBwAAAD////v+A/j+wAAAAAAAAAAAH8EgAAAD////38A/B/AgAAAAAAAAAABfgAAABn/////wAeBfggAAAAAAAAAAAPgAAAAH/////AAcCfgwAAAAAAAAAAADBwAAAD////9wAcAXhYAAAAAAAAAAAB7/AAAB/////wAOATAYAAAAAAAAAAAAX/gAAB/////gACCYAYAAAAAAAAAAAAH/8AAAfv///gACBsDIAAAAAAAAAAAAH/+AAAAB///AAAA8OAAAAAAAAAAAAAP/+AAAAB//+AAAA+/uAAAAAAAAAAAIf//gAAAD//8AAAAM/xgAAAAAAAAAAAf//8AAAD//4AAAAPdq+AAAAAAAAAAAf///AAAB//wAAAAGBwfmAAAAAAAAAAf///gAAA//wAAAAB8gX8AAAAAAAAAAP///gAAA//wAAAAAfsH4AAAAAAAAAAH///AAAA//4AAAAAAoBIAAAAAAAAAAH//+AAAA//4gAAAAAB5AAAAAAAAAAAD//+AAAA//4gAAAAAP7gBAAAAAAAAAB//+AAAA//zgAAAAAP/gABAAAAAAAAA//+AAAA//jgAAAAAf/gAjAAAAAAAAAf/8AAAA//DgAAAAB//4CAAAAAAAAAAf/8AAAAf/HAAAAAH//8CAAAAAAAAAA//wAAAAf/DAAAAAP//8AAAAAAAAAAA//AAAAAf+CAAAAAH//+AAAAAAAAAAA//AAAAAf+AAAAAAH//+AAAAAAAAAAA/+AAAAAP8AAAAAAH//+AAAAAAAAAAA/+AAAAAH4AAAAAAH//+AAAAAAAAAAA/8AAAAAHwAAAAAAH4f8AAAAAAAAAAA/4AAAAAEAAAAAAADAf8AAAAAAAAAAB/wAAAAAAAAAAAAAAAD4AEAAAAAAAAB/gAAAAAAAAAAAAAAADwAGAAAAAAAAB+AAAAAAAAAAAAAAAAAAAGAAAAAAAAB8AAAAAAAAAAAAAAAAAwAcQAAAAAAAB8AAAAAAAAAAAAAAAAAQA4AAAAAAAAD4AAAAAAAAAAAAAAAAAABwAAAAAAAAD4AAAAAAAAAAAAAAAAAAAgAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAACAAAAAAAAAAAAAAAAADxgAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8ABAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA',
    geo:[[25.0330,121.5654],[35.6762,139.6503],[37.5665,126.9780],[22.3193,114.1694],[40.7128,-74.0060],[51.5072,-0.1276]],   /* 各城市真實經緯度（顯示用） */
    cities:[['Taipei',150.28,37],['Tokyo',159.34,31.15],['Seoul',152.99,30.06],['Hong Kong',146.59,38.43],['New York',52.49,28.23],['London',89.44,21.46]]};
  function hxMap(){
    const sec=ce('section','gd-sec hx-sec hx-gm');sec.id='hxMap';sec.setAttribute('aria-labelledby','hxMapT');
    sec.innerHTML=`<div class="gd-sec-h"><h2 class="gd-sec-t" id="hxMapT">從台北到每個時區</h2></div>
      <div class="hx-gm-stage" role="group" aria-label="World map">
        <canvas class="hx-gm-cv" aria-hidden="true"></canvas><div class="hx-gm-xy" aria-hidden="true"></div><div class="hx-gm-lb is-out" aria-hidden="true"><b></b></div>
        <figure class="hx-gm-ph is-out" aria-hidden="true"><img alt="" decoding="async"><canvas></canvas><i></i><i></i><i></i><i></i></figure>
        <span class="hx-gm-ink" hidden></span><span class="hx-gm-hi" hidden></span></div>`;
    const stage=sec.querySelector('.hx-gm-stage'),cv=stage.querySelector('canvas'),ctx=cv.getContext('2d'),lb=stage.querySelector('.hx-gm-lb'),lbT=lb.querySelector('b'),xy=stage.querySelector('.hx-gm-xy');
    /* 十字座標（參考 piergorelli.com）：地標方塊拉出 X／Y 細線，旁邊小字顯示經緯度；鏡頭移動時線跟著走、數字從上一個城市滾到下一個 */
    let geoNow=HX_GM.geo[0].slice(),geoFrom=geoNow.slice(),curM=null,curFrom=null;   /* curM＝方塊在地圖上的位置（px），快於鏡頭移動 */
    const cityM=k=>{const [,c,r]=HX_GM.cities[k];return [c*P+P/2,r*P+P/2];};
    const fmtGeo=([la,lo])=>(la>=0?'N ':'S ')+Math.abs(la).toFixed(4).padStart(7,'0')+'° · '+(lo>=0?'E ':'W ')+Math.abs(lo).toFixed(4).padStart(8,'0')+'°';
    /* 地標配圖：檔名＝城市名小寫去空白（library/assets/map/taipei.webp…），同名覆蓋即可換圖；file:// 用相對路徑、線上用絕對路徑（/ 會 rewrite 到 gallery） */
    const ph=stage.querySelector('.hx-gm-ph'),phImg=ph.querySelector('img');
    const phSrc=n=>cdlAsset('map/')   /* 路徑規則統一由 cdlAsset 處理（IMG-ASSET:v1） */+n.toLowerCase().replace(/\s+/g,'')+'.webp';
    HX_GM.cities.forEach(([n])=>{const im=new Image();im.src=phSrc(n);});   /* 預載，切換時不閃 */
    /* 生成過場：0–.45s 點狀雜訊亮起；.35–1.25s 依亂數順序逐點換成圖片取色（小圖放大＋點遮罩，file:// 也不需讀像素）；1.1s 起原圖去模糊淡入、點陣淡出 */
    const gcv=ph.querySelector('canvas'),gcx=gcv.getContext('2d'),pix=document.createElement('canvas'),px=pix.getContext('2d'),lay=document.createElement('canvas'),lx=lay.getContext('2d');let genRaf=0;
    const gen=src=>{cancelAnimationFrame(genRaf);ph.classList.add('is-gen');gcv.style.opacity=1;
      if(HX_REDUCE()){gcv.style.opacity=0;phImg.src=src;ph.classList.remove('is-gen');return;}
      const im=new Image();im.src=src;const dpr=Math.min(2,devicePixelRatio||1),W=gcv.clientWidth,H=gcv.clientHeight,C=W<180?5:6,GX=Math.ceil(W/C),GY=Math.ceil(H/C);
      if(W<2||H<2){gcv.style.opacity=0;phImg.src=src;ph.classList.remove('is-gen');return;}   /* 2026-11-10 框還沒有尺寸（換頁中、隱藏）時跳過過場，避免 0 寬畫布 drawImage 報錯 */
      gcv.width=lay.width=W*dpr;gcv.height=lay.height=H*dpr;pix.width=GX;pix.height=GY;const ord=Array.from({length:GX*GY},()=>Math.random()),ph0=Array.from({length:GX*GY},()=>Math.random()*6.28);
      const ink=getComputedStyle(ph).getPropertyValue('--hx-gm-hi').trim()||'#3b82f6';let t0=0,drawn=false;
      const fr=t=>{if(!t0)t0=t;const e=t-t0;if(!drawn&&im.complete&&im.naturalWidth){px.drawImage(im,0,0,GX,GY);drawn=true;}
        gcx.setTransform(dpr,0,0,dpr,0,0);gcx.clearRect(0,0,W,H);lx.setTransform(dpr,0,0,dpr,0,0);lx.clearRect(0,0,W,H);
        const wake=Math.min(1,e/450),res=drawn?Math.max(0,Math.min(1,(e-350)/900)):0;gcx.fillStyle=ink;lx.fillStyle='#000';
        for(let y=0;y<GY;y++)for(let x=0;x<GX;x++){const k=y*GX+x,cxp=x*C+C/2,cyp=y*C+C/2;
          if(ord[k]<res){const g=Math.min(1,(res-ord[k])*6);lx.beginPath();lx.arc(cxp,cyp,C*(.32+.42*g),0,6.283);lx.fill();}
          else{const a=wake*(.18+.5*(.5+.5*Math.sin(e/110+ph0[k])))*(ord[k]<wake?1:0);if(a>.02){gcx.globalAlpha=a;gcx.beginPath();gcx.arc(cxp,cyp,C*.22,0,6.283);gcx.fill();}}}
        gcx.globalAlpha=1;if(drawn){lx.globalCompositeOperation='source-in';lx.imageSmoothingEnabled=false;lx.setTransform(1,0,0,1,0,0);lx.drawImage(pix,0,0,lay.width,lay.height);lx.globalCompositeOperation='source-over';gcx.setTransform(1,0,0,1,0,0);gcx.drawImage(lay,0,0);}
        if(e>1100&&ph.classList.contains('is-gen')){phImg.src=src;ph.classList.remove('is-gen');}
        if(e>1100)gcv.style.opacity=String(Math.max(0,1-(e-1100)/500));
        if(e<1650&&ph.isConnected)genRaf=requestAnimationFrame(fr);else{gcx.setTransform(1,0,0,1,0,0);gcx.clearRect(0,0,gcv.width,gcv.height);}};
      genRaf=requestAnimationFrame(fr);};
    phImg.addEventListener('error',()=>ph.classList.add('is-none'));phImg.addEventListener('load',()=>ph.classList.remove('is-none'));
    // 解碼位元圖 → 陸地格座標清單
    const {cols:C,rows:R}=HX_GM,raw=atob(HX_GM.b64),land=[];
    for(let i=0;i<C*R;i++)if(raw.charCodeAt(i>>3)&(128>>(i&7)))land.push([i%C,(i/C)|0]);
    const seed=k=>{const x=Math.sin(k*12.9898)*43758.5453;return x-Math.floor(x);};   // 固定亂數：每點亮度不同但每次一樣
    let P=12,w=0,h=0,dpr=1,base=null,col={ink:'#888',hi:'#3b82f6'};
    const rgba=(c,a)=>{const m=c.match(/[\d.]+/g)||[136,136,136];return `rgba(${m[0]},${m[1]},${m[2]},${a})`;};
    const readCol=()=>{col.ink=getComputedStyle(stage.querySelector('.hx-gm-ink')).color;col.hi=getComputedStyle(stage.querySelector('.hx-gm-hi')).color;};
    // 底圖（全部陸地點）先畫在離屏 canvas，每幀只貼圖＋畫閃爍點與城市標記
    const buildBase=()=>{readCol();base=document.createElement('canvas');base.width=C*P*dpr;base.height=R*P*dpr;const b=base.getContext('2d');b.scale(dpr,dpr);
      land.forEach(([c,r],k)=>{b.fillStyle=rgba(col.ink,.2+seed(k)*.24);b.beginPath();b.arc(c*P+P/2,r*P+P/2,P*.14,0,Math.PI*2);b.fill();});};
    const size=()=>{const r=stage.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(2,window.devicePixelRatio||1);P=w<600?9:12;
      cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);buildBase();};
    // 鏡頭：把目前城市放到畫面焦點（桌機偏右、手機置中），不超出地圖邊界
    let ci=0,hv=-1,cam=null,camT=[0,0],hold=0,last=0,run=false,raf=0;
    const redraw=()=>{if(!run)draw(performance.now());};   // 沒在跑動畫（減少動態／畫面外）時手動重畫一次
    const pins=HX_GM.cities.map(([n],k)=>{const b=document.createElement('button');b.type='button';b.className='hx-gm-pin';b.setAttribute('aria-label',n);
      const t=document.createElement('span');t.textContent=n;b.appendChild(t);
      b.addEventListener('click',()=>{if(k!==ci){setCity(k);redraw();}hold=0;});   // 點擊：跳到該城市，計時歸零，之後從它的下一站接續
      b.addEventListener('pointerenter',()=>{hv=k;redraw();});b.addEventListener('pointerleave',()=>{if(hv===k)hv=-1;redraw();});
      stage.appendChild(b);return b;});
    const focus=()=>{const [, c,r]=HX_GM.cities[ci];const fx=w<600?.5:.62,fy=.52;
      const x=Math.max(0,Math.min(C*P-w,c*P+P/2-w*fx)),y=Math.max(0,Math.min(R*P-h,r*P+P/2-h*fy));return [x,y];};
    const setCity=k=>{geoFrom=geoNow.slice();curFrom=curM?curM.slice():null;ci=k;camT=focus();pins.forEach((b,j)=>{b.classList.toggle('is-cur',j===k);if(j===k)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});lb.classList.add('is-out');ph.classList.add('is-out');setTimeout(()=>{lbT.textContent=HX_GM.cities[ci][0];lb.classList.remove('is-out');ph.classList.remove('is-out');gen(phSrc(HX_GM.cities[ci][0]));},HX_REDUCE()?0:chtxMs('--dur-slow'));};
    // 閃爍點：同時約 70 顆，隨機挑陸地點，淡入淡出；三成是重點色
    const tw=[];const spawn=t=>({k:(Math.random()*land.length)|0,t0:t+Math.random()*1200,d:1400+Math.random()*1400,hi:Math.random()<.3});
    const sq=(x,y,r)=>{ctx.beginPath();ctx.rect(Math.round(x-r),Math.round(y-r),Math.round(r*2),Math.round(r*2));};   // 地標：正方形（r＝半邊長）
    const draw=t=>{if(!cam||HX_REDUCE())cam=camT.slice();cam[0]+=(camT[0]-cam[0])*.028;cam[1]+=(camT[1]-cam[1])*.028;   /* 鏡頭慢慢跟 */
      {const T=cityM(ci);if(!curM||HX_REDUCE())curM=T.slice();curM[0]+=(T[0]-curM[0])*.075;curM[1]+=(T[1]-curM[1])*.075;}   /* 方塊先走 */
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.drawImage(base,-cam[0],-cam[1],C*P,R*P);
      if(!HX_REDUCE()){while(tw.length<70)tw.push(spawn(t));
        for(let i=tw.length-1;i>=0;i--){const q=tw[i],u=(t-q.t0)/q.d;if(u<0)continue;if(u>=1){tw.splice(i,1);continue;}
          const [c,r]=land[q.k],x=c*P+P/2-cam[0],y=r*P+P/2-cam[1];if(x<-P||y<-P||x>w+P||y>h+P)continue;
          ctx.fillStyle=rgba(q.hi?col.hi:col.ink,Math.sin(Math.PI*u)*(q.hi?.9:.75));ctx.beginPath();ctx.arc(x,y,P*.17,0,Math.PI*2);ctx.fill();}}
      HX_GM.cities.forEach(([,c,r],k)=>{const x=c*P+P/2-cam[0],y=r*P+P/2-cam[1];
        const pin=pins[k];pin.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;pin.style.visibility=(x<0||y<0||x>w||y>h)?'hidden':'';
        ctx.fillStyle=rgba(col.hi,k===hv?.9:.5);if(k!==ci||!curM)sq(x,y,P*(k===hv?.42:.34));else sq(x,y,P*.34);ctx.fill();
        if(k===ci){const x=curM[0]-cam[0],y=curM[1]-cam[1];const u=HX_REDUCE()?0:(t%1800)/1800;   // 目前城市：方塊（在地圖上移動）＋擴散方框＋十字線
          ctx.fillStyle=rgba(col.ink,.22);ctx.fillRect(0,Math.round(y),w,1);ctx.fillRect(Math.round(x),0,1,h);   // X／Y 細線（1px，貫穿整個地圖）
          {const G=HX_GM.geo[ci];let p=1;if(curFrom){const T=cityM(ci),d0=Math.hypot(T[0]-curFrom[0],T[1]-curFrom[1]),d=Math.hypot(T[0]-curM[0],T[1]-curM[1]);p=d0>1?Math.max(0,Math.min(1,1-d/d0)):1;}
            geoNow=[geoFrom[0]+(G[0]-geoFrom[0])*p,geoFrom[1]+(G[1]-geoFrom[1])*p];const txt=fmtGeo(geoNow);if(xy.textContent!==txt)xy.textContent=txt;
            xy.style.transform=`translate(${(x+12).toFixed(1)}px,${(y+12).toFixed(1)}px)`;}
          if(u){ctx.strokeStyle=rgba(col.hi,.55*(1-u));ctx.lineWidth=1.2;sq(x,y,P*.5+u*P*1.1);ctx.stroke();}
          ctx.fillStyle=rgba(col.hi,1);sq(x,y,P*.5);ctx.fill();
          lb.style.transform=`translate(${(x+14).toFixed(1)}px,${(y-6).toFixed(1)}px)`;
          /* 配圖：桌機放在地標左側、垂直置中；手機放在地標下方置中；都夾在畫面內 */
          const pw=ph.offsetWidth,phh=ph.offsetHeight,m=16;let px,py;
          if(w<600){px=x-pw/2;py=y+28;}else{px=x-pw-40;py=y-phh/2;}
          px=Math.max(m,Math.min(w-pw-m,px));py=Math.max(m,Math.min(h-phh-m,py));ph.style.transform=`translate(${px.toFixed(1)}px,${py.toFixed(1)}px)`;}
      });};   // 滑過的地標加深、略放大
    const loop=t=>{raf=0;if(!sec.isConnected){run=false;return;}
      if(!last)last=t;hold+=t-last;last=t;if(hold>3600){hold=0;setCity((ci+1)%HX_GM.cities.length);}
      draw(t);if(run)raf=requestAnimationFrame(loop);};
    const start=()=>{if(run||HX_REDUCE())return;run=true;last=0;raf=requestAnimationFrame(loop);};
    const stop=()=>{run=false;if(raf)cancelAnimationFrame(raf);raf=0;};
    requestAnimationFrame(()=>{if(!sec.isConnected)return;size();setCity(0);cam=camT.slice();draw(performance.now());
      // 只有段落在畫面內才動；離開或分頁隱藏就停
      new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&!document.hidden?start():stop()),{threshold:.1}).observe(stage);
      new ResizeObserver(()=>{const r=stage.getBoundingClientRect();if(Math.abs(r.width-w)<1&&Math.abs(r.height-h)<1)return;size();camT=focus();cam=camT.slice();curM=null;draw(performance.now());}).observe(stage);
      // 切換深淺色：重畫底圖
      const re=()=>{if(!sec.isConnected)return;requestAnimationFrame(()=>{buildBase();draw(performance.now());});};
      viewObs(new MutationObserver(re)).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','style','class']});
      viewOn(matchMedia('(prefers-color-scheme:dark)'),'change',re);});
    return sec;
  }
  function hxVoice(){
    const sec=ce('section','gd-sec hx-sec hx-tm');sec.id='hxVoice';sec.setAttribute('aria-label','使用回饋');sec.setAttribute('aria-roledescription','carousel');
    const BG=Array(5).fill(HX_TSM_BG);  /* 每筆可各自換圖：改 VOICES[i].bg */
    const AV=i=>CARD_AV[i%CARD_AV.length];
    const VOICES=[
      {q:'以前改主色要逐個元件檢查，現在在 CDL 調好 token，Figma 的 Variables 就跟著更新，省下整整兩天。',name:'林佳穎',role:'產品設計師 · 森果數位',bg:BG[0],av:AV(0)},
      {q:'元件頁的 HTML 和 CSS 複製就能用，variant 名稱跟 Figma 一模一樣，跟設計師對規格再也不用猜。',name:'陳柏翰',role:'前端工程師 · 好住科技',bg:BG[1],av:AV(1)},
      {q:'三條產品線共用一套母庫，各專案只改自己的 token。差異檢查會列出誰動了什麼，審稿快很多。',name:'黃詩涵',role:'設計主管 · 拾光金融',bg:BG[2],av:AV(2)},
      {q:'開新案時先在網站上挑元件、調顏色，客戶當場就看得到樣子，提案到定稿從三週縮到一週。',name:'張育誠',role:'產品經理 · 綠點物流',bg:BG[3],av:AV(3)},
      {q:'我們只有一位設計師，靠 CDL 直接拿到整套元件和 Figma 檔，第一版 App 一個月就上線了。',name:'吳宜蓁',role:'創辦人 · 小步健康',bg:BG[4],av:AV(4)},
    ];
    const QM='<svg class="hx-tm-qm" viewBox="0 0 48 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 40V23C0 10 7 2.5 19 0l2.2 5.2C14.6 7.4 11 12 10.6 18H20v22Zm27 0V23C27 10 34 2.5 46 0l2 5.2c-6.6 2.2-10.2 6.8-10.6 12.8H47v22Z"/></svg>';
    const ARW=PI('arrow-left');
    sec.innerHTML=`<div class="hx-tm-stage" tabindex="0" aria-label="使用回饋輪播，可用左右方向鍵切換"></div>
`;
    const stage=sec.querySelector('.hx-tm-stage'),N=VOICES.length;
    { const b0=document.createElement('img');b0.className='hx-tm-bg hx-tm-bg0';b0.alt='';b0.decoding='async';b0.src=VOICES[0].bg;stage.appendChild(b0);
      /* 視差滾動：舞台在視窗內的位置 → -1（剛從下方進場）～1（將從上方離開），背景反向慢移 */
      if(!HX_REDUCE()){let raf=0,on=false;const upd=()=>{raf=0;if(!stage.isConnected){removeEventListener('scroll',req,true);return;}
          const r=stage.getBoundingClientRect(),vh=innerHeight;const k=Math.max(-1,Math.min(1,((r.top+r.height/2)-vh/2)/((vh+r.height)/2)));b0.style.setProperty('--hx-px',(-k).toFixed(4));};
        const req=()=>{if(on&&!raf)raf=requestAnimationFrame(upd);};
        viewOn(window,'scroll',req,{passive:true,capture:true});viewOn(window,'resize',req,{passive:true});
        if(window.IntersectionObserver)new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on)req();}).observe(stage);else{on=true;req();}} }
    const slides=VOICES.map((v,i)=>{const sl=ce('div','hx-tm-sl');sl.setAttribute('role','group');sl.setAttribute('aria-roledescription','slide');sl.setAttribute('aria-label',(i+1)+' / '+N);
      const im=document.createElement('img');im.className='hx-tm-bg';im.alt='';im.decoding='async';im.src=v.bg;
      const fg=document.createElement('figure');fg.className='hx-tm-card';fg.innerHTML=QM+'<blockquote class="hx-tm-q"><p></p></blockquote><figcaption class="hx-tm-who"><span class="hx-tm-id"><b></b><span></span></span></figcaption>';
      fg.querySelector('p').textContent=v.q;fg.querySelector('b').textContent=v.name;fg.querySelector('.hx-tm-id span').textContent=v.role;
      fg.querySelector('figcaption').appendChild(avtEl('l','circle','image',{src:v.av,name:v.name}));
      /* 每張牌卡底部各有一組切換＋進度（同一份狀態） */
      const ctl=ce('div','hx-tm-ctl');ctl.innerHTML='<div class="hx-tm-nav"></div><div class="hx-tm-bar" aria-hidden="true"><i></i></div><span class="hx-tm-n"></span>';
      const nav=ctl.querySelector('.hx-tm-nav');
      const mk=(lb,dir)=>{const b=mkBtn({variant:'outline',intent:'secondary',size:'s',iconOnly:true});b.type='button';b.innerHTML=ARW;b.setAttribute('aria-label',lb);if(dir>0)b.classList.add('hx-tm-nx');b.onclick=()=>go(cur+dir);nav.appendChild(b);};
      mk('上一則',-1);mk('下一則',1);fg.appendChild(ctl);
      sl.append(im,fg);stage.appendChild(sl);return sl;});
    const bars=[...sec.querySelectorAll('.hx-tm-bar i')],cnts=[...sec.querySelectorAll('.hx-tm-n')];
    let cur=-1,tm=0,vis=false,hov=false,foc=false;
    const mq=matchMedia('(prefers-reduced-motion:reduce)');
    const want=()=>vis&&!hov&&!foc&&!document.hidden&&!mq.matches&&sec.isConnected;
    const arm=()=>{clearTimeout(tm);tm=0;if(want())tm=setTimeout(()=>{if(!sec.isConnected){cleanup();return;}go(cur+1);},6000);};
    function go(i){i=((i%N)+N)%N;if(i===cur)return;cur=i;
      slides.forEach((s,k)=>{const on=k===i;s.classList.toggle('on',on);s.inert=!on;s.setAttribute('aria-hidden',on?'false':'true');});
      bars.forEach(b=>b.style.width=((i+1)/N*100)+'%');cnts.forEach(c=>c.textContent=String(i+1).padStart(2,'0')+' / '+String(N).padStart(2,'0'));arm();}
    stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1);}else if(e.key==='ArrowRight'){e.preventDefault();go(cur+1);}});
    sec.addEventListener('pointerenter',()=>{hov=true;arm();});sec.addEventListener('pointerleave',()=>{hov=false;arm();});
    sec.addEventListener('focusin',()=>{foc=true;arm();});sec.addEventListener('focusout',e=>{if(!sec.contains(e.relatedTarget)){foc=false;arm();}});
    const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;arm();},{threshold:.35});io.observe(stage);
    const onVis=()=>arm();viewOn(document,'visibilitychange',onVis);viewOn(mq,'change',onVis);
    const cleanup=()=>{clearTimeout(tm);io.disconnect();document.removeEventListener('visibilitychange',onVis);mq.removeEventListener('change',onVis);};
    go(0);
    return sec;
  }


  /* ==================== HOME-PHONES:v1 首頁手機跑馬燈 ====================
     iPhone 外框取自 Figma 社群檔「iPhone 16/17 Free Mockup」（iphone17pro，螢幕透明、狀態列移除），webp 內嵌 13KB；
     螢幕內是真的範本（手機版，等比縮小），主題與外面相反（淺色頁面 → 深色手機）。只有 7 支實例，滑出左邊就搬到最後，不複製 DOM。 */
  const HX_PHONE_FRAME=cdlAsset('img/phone-frame.webp');
  /* 反相主題：暫時切換根節點主題讀出所有 token，套在容器上（同一個 task 內切回，不會閃） */
  let HX_TOKEN_NAMES=null;
  function hxTokenNames(){if(HX_TOKEN_NAMES)return HX_TOKEN_NAMES;const set=new Set();
    const walk=rules=>{for(const r of rules){if(r.cssRules&&!r.selectorText)walk(r.cssRules);else if(r.style&&/:root|html/.test(r.selectorText||''))for(const p of r.style)if(p.startsWith('--'))set.add(p);}};
    for(const sh of document.styleSheets){try{walk(sh.cssRules);}catch(e){}}
    for(const p of document.documentElement.style)if(p.startsWith('--'))set.add(p);return HX_TOKEN_NAMES=[...set];}
  function hxCurTheme(){const t=document.documentElement.getAttribute('data-theme');return t==='dark'||t==='light'?t:(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');}
  let HX_INV_BUSY=false;
  function hxApplyInverse(el){if(HX_INV_BUSY)return;HX_INV_BUSY=true;const de=document.documentElement,inv=hxCurTheme()==='dark'?'light':'dark',had=de.getAttribute('data-theme');
    de.setAttribute('data-theme',inv);const cs=getComputedStyle(de);const vals=hxTokenNames().map(n=>[n,cs.getPropertyValue(n)]);
    if(had==null)de.removeAttribute('data-theme');else de.setAttribute('data-theme',had);
    vals.forEach(([n,v])=>{if(v)el.style.setProperty(n,v);});el.style.colorScheme=inv;el.dataset.inv=inv;
    setTimeout(()=>{HX_INV_BUSY=false;},0);}   /* 自己切換主題觸發的 MutationObserver 回呼在 microtask，這時仍是 busy，直接略過 */
  /* HOME-PHONES:v2（2026-11-10）四支手機、每支跑一段「真的操作流程」：手指點擊指示 → 換頁 → 慢慢捲動 → 重來。
     流程只呼叫範本自己的元素 .click()（不是 isTrusted，不會觸發外層「查看範本」換頁）；只在手機進入畫面時計時，離開畫面就暫停。
     跑馬燈需要比畫面寬：四支一組，依螢幕寬複製 2–3 組，複本錯開起始時間。 */
  const HX_PHONE_FLOWS=[
    {name:'AI 對話',to:'tpl-ai-chat',mk:()=>tacApp('mobile','conversation'),run:async f=>{
      for(const q of ['可以改成適合帶小孩的版本嗎？','幫我寫一封請假信']){await f.wait(1800);
        const ta=f.q('.aic-cmp textarea');await f.tap(ta,false);
        for(const ch of [...aicT(q)]){ta.value+=ch;ta.dispatchEvent(new Event('input'));await f.wait(70);}
        await f.wait(500);await f.tap('.aic-send');await f.until(()=>{const s=f.q('.aic-send');return s&&!s.classList.contains('is-stop');},14000);await f.wait(2600);}}},
    {name:'後台：儀表板 → 訂單明細 → 訂單列表',to:'tpl-admin-dashboard',mk:()=>tadApp('dashboard','mobile','normal'),run:async f=>{
      await f.wait(1600);await f.tap('.tad-tbl tr.is-link:nth-child(2)');await f.wait(1800);await f.scroll(260);await f.wait(1400);await f.scroll(260);await f.wait(1600);
      await f.scrollTop();await f.wait(500);await f.tap('.tad-top .btn');await f.wait(900);await f.tap('.tad-nav .mn-item[data-key=list]');await f.wait(1800);
      await f.scroll(240);await f.wait(1400);await f.scroll(240);await f.wait(1800);}},
    {name:'圖表：統計報表',to:'chart',mk:()=>{const a=tadApp('report','mobile','normal');   /* 主打圖表多樣性：報表頁原有 4 張＋補上趨勢、組合、熱力、堆疊 */
      const pg=a.querySelector('.tad-page');const card=(v,o)=>{const c=tadCard();c.appendChild(chtChart(v,'m',Object.assign({live:true},o)));return c;};
      const note=pg&&pg.querySelector('.tad-note');if(note)note.after(card('spark',{}));
      if(pg)['combo','heatmap','bar-stack'].forEach(v=>pg.appendChild(card(v,{})));return a;},run:async f=>{
      await f.wait(1600);await f.tap('.cht-area-stack .chtx-legend button:nth-child(2)');await f.wait(1100);await f.tap('.cht-area-stack .chtx-legend button:nth-child(2)');await f.wait(900);
      await f.tap('.cht-bar-rank .chtx-sortbtn');await f.wait(1500);await f.tap('.cht-bar-rank .chtx-sortbtn');await f.wait(1000);
      await f.tap('.cht-funnel .chtx-dd .field');await f.wait(700);await f.tap('.cht-funnel .ddopt:nth-child(2)');await f.wait(1600);
      for(let i=0;i<3;i++){await f.scroll(260);await f.wait(1500);}await f.wait(800);}},
    {name:'最新消息 → 文章內頁',to:'tpl-web-news',mk:()=>twsApp('news','mobile','normal'),run:async f=>{
      await f.wait(1600);await f.tap('.tws-news .tabi:nth-child(2)');await f.wait(1400);await f.tap('.tws-news-it');await f.wait(1600);
      for(let i=0;i<4;i++){await f.scroll(220);await f.wait(1300);}await f.wait(800);}},
    {name:'商品列表：篩選 → 結果',to:'tpl-web-product',mk:()=>twsApp('product','mobile','normal'),run:async f=>{
      await f.wait(1600);await f.tap('.tws-fwrap > .btn');await f.wait(900);await f.tap('.tws-filter .sgm button:nth-of-type(2)');await f.wait(900);
      await f.tap('.tws-fwrap > .btn');await f.wait(1100);for(let i=0;i<3;i++){await f.scroll(240);await f.wait(1300);}await f.wait(800);}}];
  function hxPhone(flow,delay){const ph=ce('figure','hx-ph');ph.setAttribute('aria-label',flow.name+' 範本');
    const scr=ce('div','hx-ph-scr');const box=ce('div','hx-ph-app');scr.append(box);
    const fr=document.createElement('img');fr.className='hx-ph-frame';fr.src=HX_PHONE_FRAME;fr.alt='';fr.decoding='async';
    ph.append(scr,fr);ph._to=flow.to;ph._on=false;
    const fresh=()=>{const a=flow.mk();a.classList.add('in-phone');box.replaceChildren(a);ph._app=a;};fresh();
    /* 計時只算「手機在畫面上」的時間 */
    const wait=ms=>new Promise(res=>{let left=ms,last=performance.now();const t=()=>{if(!ph.isConnected)return;const n=performance.now();if(ph._on)left-=n-last;last=n;if(left<=0)res();else setTimeout(t,60);};setTimeout(t,60);});
    const q=sel=>ph._app.querySelector(sel);
    const until=async(fn,max)=>{let t=0;while(!fn()&&t<max){await wait(250);t+=250;}};
    const sc=()=>ph._app.querySelector('.tad-scroll,.tws-scroll,.aic-scroll,.tac-msgs');
    const tween=(el,to,dur)=>new Promise(res=>{const from=el.scrollTop,max=el.scrollHeight-el.clientHeight;to=Math.max(0,Math.min(max,to));if(Math.abs(to-from)<2)return res();
      let t0=0;const step=t=>{if(!ph.isConnected)return res();if(!t0)t0=t;const k=Math.min(1,(t-t0)/dur),e=.5-Math.cos(Math.PI*k)/2;el.scrollTop=from+(to-from)*e;k<1?requestAnimationFrame(step):res();};requestAnimationFrame(step);});
    const scroll=dy=>{const el=sc();return el?tween(el,el.scrollTop+dy,2600):wait(0);};
    const scrollTop=()=>{const el=sc();return el?tween(el,0,2200):wait(0);};
    /* 點擊：目標不在可視範圍就先捲過去，停一下再呼叫元素自己的 click()（不畫點擊圓圈，直接看元件狀態變化） */
    const tapAt=async(sel,click=true)=>{const el=typeof sel==='string'?q(sel):sel;if(!el)return;const s=sc();
      if(s&&s.contains(el)){const sr=s.getBoundingClientRect(),r=el.getBoundingClientRect();if(r.top<sr.top+20||r.bottom>sr.bottom-20)await tween(s,s.scrollTop+(r.top-sr.top)-sr.height*.4,1800);}
      await wait(650);if(click)el.click();await wait(500);};
    const f={wait,q,until,scroll,scrollTop,tap:tapAt};
    (async()=>{await wait(delay);while(ph.isConnected){try{await flow.run(f);}catch(e){console.warn('phone flow',e);}if(!ph.isConnected)break;
      ph.classList.add('is-reset');await wait(360);fresh();ph.classList.remove('is-reset');await wait(900);}})();
    return ph;}
  /* HOME-CONTACT:v1 聯絡我段落：大 email（滑過時中間撐開頭像、頭像看向滑鼠、游標變「Let's Talk」）＋首頁版頁尾（版權、社群） */
  /* HOME-CONTACT:v2 頭像看向滑鼠：WebGL 即時變形，角度連續、用緩動追上滑鼠（v1 的 25 格 sprite 會一格一格跳）。
     變形方式：輸出像素去原圖「往反方向偏一點」的位置取色；偏移量＝方向 × 幾個高斯權重（臉部五官、整顆頭、兩顆眼珠、鼻子）。
     不支援 WebGL 時退回正面靜態圖。 */
  /* HOME-CONTACT:v5 頭像：library/assets/avatar/yuu-face.webp（IMG-ASSET:v1 改由 cdlAsset 算路徑，正式站首頁 / 也不會 404） */
  const HX_CM_FACE=cdlAsset('avatar/yuu-face.webp');
  function hxCmFace(host){host.style.setProperty('--hx-cm-img','url('+HX_CM_FACE+')');
    const api={set(){},reset(){}};
    const cv=document.createElement('canvas');cv.className='hx-cm-cv';
    const gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false});
    if(!gl){host.classList.add('is-static');return api;}
    host.appendChild(cv);
    const VS='attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
    const FS='precision mediump float;uniform sampler2D t;uniform vec2 d;varying vec2 v;'
      +'float g(vec2 c,float s){vec2 q=v-c;return exp(-dot(q,q)/(2.*s*s));}'
      +'void main(){float F=g(vec2(.503,.608),.225),H=g(vec2(.45,.5),.433),E=g(vec2(.35,.537),.05)+g(vec2(.637,.542),.05),N=g(vec2(.52,.633),.075);'
      +'vec2 uv=v-vec2(d.x*(.05*F+.0133*H+.025*E+.0167*N),d.y*(.0333*F+.01*H+.0183*E+.01*N));'
      +'gl_FragColor=(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)?vec4(0.):texture2D(t,uv);}';
    const sh=(type,src)=>{const o=gl.createShader(type);gl.shaderSource(o,src);gl.compileShader(o);return o;};
    const pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pg);
    if(!gl.getProgramParameter(pg,gl.LINK_STATUS)){cv.remove();host.classList.add('is-static');return api;}
    gl.useProgram(pg);
    const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(pg,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const uD=gl.getUniformLocation(pg,'d');
    let tx=0,ty=0,x=0,y=0,raf=0,ready=false;
    const draw=()=>{if(!ready)return;const dpr=Math.min(2,devicePixelRatio||1),w=Math.round(cv.clientWidth*dpr)||1;
      if(cv.width!==w){cv.width=cv.height=w;gl.viewport(0,0,w,w);}
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(uD,x,y);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      cv.style.transform=`translate(${(x*2.5).toFixed(2)}%,${(y*2).toFixed(2)}%) rotate(${(x*2).toFixed(2)}deg)`;};   /* 整顆頭跟著微移、微歪，更像真的轉頭 */
    const loop=()=>{raf=0;if(!host.isConnected)return;const k=HX_REDUCE()?1:.14;x+=(tx-x)*k;y+=(ty-y)*k;draw();
      if(Math.abs(tx-x)>.002||Math.abs(ty-y)>.002)raf=requestAnimationFrame(loop);};
    const kick=()=>{if(!raf)raf=requestAnimationFrame(loop);};
    const img=new Image();img.decoding='async';
    img.onload=()=>{const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
      [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(p=>gl.texParameteri(gl.TEXTURE_2D,p,gl.CLAMP_TO_EDGE));
      [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(p=>gl.texParameteri(gl.TEXTURE_2D,p,gl.LINEAR));
      ready=true;draw();};
    img.onerror=()=>{cv.remove();host.classList.add('is-static');};
    img.src=HX_CM_FACE;
    new ResizeObserver(()=>draw()).observe(cv);
    api.set=(dx,dy)=>{tx=Math.max(-1,Math.min(1,dx));ty=Math.max(-1,Math.min(1,dy));kick();};
    api.reset=()=>api.set(0,0);
    return api;}
  function hxContact(){const sec=ce('section','gd-sec hx-sec hx-cm');sec.id='hxContact';sec.setAttribute('aria-label','聯絡我');
    sec.innerHTML='<div class="gd-sec-h"><h2 class="gd-sec-t">聯絡我</h2></div>'
      +'<a class="hx-cm-mail" href="mailto:edward890131@gmail.com" aria-label="寄信給 Yuu"><span class="hx-cm-w" data-i18n-skip>YUU</span><span class="hx-cm-av" aria-hidden="true"><span class="hx-cm-face"></span></span><span class="hx-cm-w" data-i18n-skip>DESIGN@GMAIL</span></a>'
      +'<div class="hx-cm-ft"><p class="hx-cm-cp" data-i18n-skip>© 2026 YUUDESIGN, all rights reserved.</p></div>';
    sec.querySelector('.hx-cm-ft').appendChild(ftrSocial());   /* 社群連結＝Footer 元件的同一組按鈕 */
    const mail=sec.querySelector('.hx-cm-mail'),face=sec.querySelector('.hx-cm-face'),av=sec.querySelector('.hx-cm-av');
    /* 字寬係數：量兩段字在目前字級下的總寬 ÷ 字級，CSS 用它算出剛好填滿寬度的字級（字體載入後再量一次） */
    const fit=()=>{if(!sec.isConnected)return;const fs=parseFloat(getComputedStyle(mail).fontSize)||1;let w=0;sec.querySelectorAll('.hx-cm-w').forEach(x=>w+=x.getBoundingClientRect().width);
      if(w>0)sec.style.setProperty('--hx-cm-k',(w/fs).toFixed(3));};
    requestAnimationFrame(fit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
    const fc=hxCmFace(face),look=(dx,dy)=>fc.set(dx,dy);   /* HOME-CONTACT:v2 */
    /* 跟隨游標的「Let's Talk」按鈕：Button 元件（solid／secondary／s），前置 icon 換成信封 */
    const cur=ce('div','hx-cm-cur');const pill=mkBtn({variant:'solid',intent:'secondary',size:'s',isLive:true,lead:true});pill.type='button';pill.tabIndex=-1;pill.style.pointerEvents='none';
    pill.innerHTML=IC_MAIL+'<span data-i18n-skip>Let\'s Talk</span>';cur.appendChild(pill);cur.setAttribute('aria-hidden','true');sec.appendChild(cur);
    const move=e=>{const r=sec.getBoundingClientRect();cur.style.transform=`translate(${e.clientX-r.left}px,${e.clientY-r.top}px) translate(-50%,-50%)`;
      const a=av.getBoundingClientRect(),cx=a.left+a.width/2,cy=a.top+a.height/2;look((e.clientX-cx)/Math.max(160,sec.clientWidth*.36),(e.clientY-cy)/90);   /* 滑過範圍只有一列高，上下靈敏度調高 */};
    mail.addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse')return;move(e);sec.classList.add('cur-on');});
    mail.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')move(e);});
    mail.addEventListener('pointerleave',()=>{sec.classList.remove('cur-on');look(0,0);});
    mail.addEventListener('blur',()=>look(0,0));
    return sec;}
  function hxPhones(){const sec=ce('section','gd-sec hx-sec hx-phs');sec.id='hxPhones';sec.setAttribute('aria-label','範本預覽');
    sec.innerHTML='<div class="hx-phs-view"><div class="hx-phs-track"></div></div>';
    const view=sec.querySelector('.hx-phs-view'),track=sec.querySelector('.hx-phs-track');view.setAttribute('aria-label','範本預覽跑馬燈');
    const sets=Math.max(2,Math.ceil((((screen&&screen.width)||1440)+300)/(HX_PHONE_FLOWS.length*276)));   /* 剛好蓋滿螢幕＋一支即可，少一組＝少 5 份範本 DOM */
    for(let k=0;k<sets;k++)HX_PHONE_FLOWS.forEach((fl,i)=>track.appendChild(hxPhone(fl,k*4200+i*700)));
    /* 游標跟隨「查看範本」：滑過段落時取代原生游標；點哪支手機就開那個範本。鍵盤：段落可聚焦，Enter 開 AI 對話範本 */
    const cur=ce('div','hx-phs-cur');const pill=mkBtn({variant:'solid',intent:'secondary',size:'s',isLive:true,trail:true});pill.type='button';pill.tabIndex=-1;
    pill.querySelector('span').textContent='查看範本';pill.style.pointerEvents='none';cur.appendChild(pill);view.appendChild(cur);
    view.tabIndex=0;view.setAttribute('role','link');view.setAttribute('aria-label','查看範本');
    const hit=e=>[...track.children].find(p=>{const r=p.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right;});
    const moveCur=e=>{const r=view.getBoundingClientRect();cur.style.transform=`translate(${e.clientX-r.left}px,${e.clientY-r.top}px) translate(-50%,-50%)`;};
    view.addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse')return;moveCur(e);view.classList.add('cur-on');});
    view.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')moveCur(e);});
    view.addEventListener('pointerleave',()=>view.classList.remove('cur-on'));
    view.addEventListener('click',e=>{if(!e.isTrusted)return;   /* 手機內流程的程式點擊會冒泡上來，略過 */
      const p=hit(e);renderView((p&&p._to)||'tpl-ai-chat');});
    view.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();renderView('tpl-ai-chat');}});
    track.setAttribute('inert','');   /* 純展示：手機內不可點、不進 Tab 順序 */
    const inv=()=>{if(sec.isConnected)hxApplyInverse(track);};
    /* 2026-11-10 效能：每幀不再讀版面（offsetWidth／getComputedStyle／getBoundingClientRect 會強迫 15 份範本重排）。
       步距與可視寬只在尺寸改變時量；哪幾支在畫面上用位置推算，每 250ms 更新一次。 */
    let x=0,last=0,run=false,raf=0,step=0,gap=0,padL=0,viewW=0,markT=0;const SPEED=40;   /* px／秒 */
    const measure=()=>{const f=track.firstElementChild;if(!f)return;const cs=getComputedStyle(track);gap=parseFloat(cs.columnGap||0);step=f.offsetWidth+gap;padL=parseFloat(cs.paddingLeft||0);viewW=view.clientWidth;};
    const mark=on=>{const kids=track.children,pw=step-gap;for(let i=0;i<kids.length;i++){const p=kids[i];if(!on){p._on=false;continue;}const l=padL+x+i*step;p._on=l+pw>0&&l<viewW;}};
    const loop=t=>{raf=0;if(!sec.isConnected){run=false;return;}const dt=last?Math.min(48,t-last):16;last=t;if(!step)measure();
      x-=SPEED*dt/1000;if(step&&-x>=step){x+=step;track.appendChild(track.firstElementChild);}track.style.transform=`translate3d(${x.toFixed(1)}px,0,0)`;
      if(t-markT>250){markT=t;mark(true);}
      if(run)raf=requestAnimationFrame(loop);};
    new ResizeObserver(()=>{measure();}).observe(view);
    const start=()=>{if(run)return;if(HX_REDUCE()){mark(false);return;}run=true;last=0;raf=requestAnimationFrame(loop);};
    const stop=()=>{run=false;if(raf)cancelAnimationFrame(raf);raf=0;mark(false);};
    requestAnimationFrame(()=>{if(!sec.isConnected)return;inv();
      new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&!document.hidden?start():stop()),{threshold:.05}).observe(view);
      viewDone(stop);viewOn(document,'visibilitychange',()=>{if(!sec.isConnected)return;if(document.hidden)stop();else{const r=view.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)start();}});
      let lastT=hxCurTheme();viewObs(new MutationObserver(()=>{if(HX_INV_BUSY)return;const t=hxCurTheme();if(t!==lastT){lastT=t;inv();}})).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
      viewOn(matchMedia('(prefers-color-scheme:dark)'),'change',inv);});
    return sec;}
  function renderHome(view){
    if(window.__hxShowStop)window.__hxShowStop();
    if(window.__hxCur)window.__hxCur.hide();
    view.innerHTML='';
    const root=ce('div','hx');root.id='hxHome';
    root.append(hxHero(),hxWall(),hxStats(),hxShow(),hxFlow(),hxFigma(),hxVoice(),hxMap(),hxNews(),hxContact(),hxPhones());  /* HOME12:v1 hxVoice／HOME-MAP:v1 hxMap／HOME-CONTACT:v1 hxContact */
    /* HOME14:v1 本頁目錄補齊沒有大標題的段落（buildTOC 讀 [data-toc]） */
    [['.hx-pgx-w, #hxPv','試玩區'],['#hxWall','元件跑馬燈'],['#hxStats','關於 CDL'],['#hxShow','動態 Demo'],['#hxVoice','用戶回饋']]
      .forEach(([q,t])=>{const el=root.querySelector(q);if(el)el.dataset.toc=t;});
    view.appendChild(root);
    root.querySelectorAll('.hx-faq a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();renderView(a.getAttribute('href').slice(1));}));
  }
  function hashId(){const h=decodeURIComponent(location.hash.replace(/^#/,''));if(h==='start')return h;if(h==='summary'||h==='tokens'||h==='guideline'||h==='guide'||h==='changelog'||h==='settings'||h==='home'||h==='components'||h==='templates')return h;   /* IA-PAGES:v1 總覽頁 */
    const ids=NAV.flatMap(g=>g.items).map(x=>x.id);return ids.includes(h)?h:null;}
  /* 元件頁段落統一順序：互動預覽與程式碼 → 變數與 Token → State × Variant 矩陣 → 其餘（維持原相對順序）。
     各元件 BUILD 自行決定 append 順序，這裡在渲染後集中重排，避免逐頁改。只搬「主要」那一段（第一個互動預覽／第一個矩陣），
     子元件自己的段落（如 tab 頁的 Toggle 互動預覽）留在原位，跟它的矩陣待在一起。 */
  function reorderSections(view){
    const vt=view.querySelector('#sec-vartoken');
    const host=vt?vt.parentElement:(view.querySelector('section.block')||{}).parentElement; if(!host)return;
    const blocks=[...host.children].filter(el=>el.matches('section.block')); if(blocks.length<2)return;
    const title=s=>(s.querySelector(':scope > h2 .bh-t')||{}).textContent||'';
    const live=blocks.find(s=>/^互動預覽與程式碼/.test(title(s)))||blocks.find(s=>s.querySelector('.livewrap,#liveWrap'));
    const mtx=blocks.find(s=>s!==live&&/矩陣/.test(title(s)));
    const head=[live,vt,mtx].filter(Boolean);
    const mark=document.createComment('');host.insertBefore(mark,blocks[0]); // 錨在原本第一段的位置（第一段本身也可能被搬）
    head.forEach(s=>host.insertBefore(s,mark));mark.remove();
  }
  /* VIEW-LIFE:v1 頁面生命週期：每次換頁開一個新的 AbortController（像一個總開關）。
     頁面裡掛在「不會隨換頁消失」的對象（document、window、<html>、.main、matchMedia）上的監聽、觀察器、計時器、塞進 body 的浮層，
     都登記到目前這頁的開關；renderView 換頁前先 viewEnd() 一次全部關掉，避免切頁來回越積越多。
     頁內元素上的監聽不用登記（元素被移除就跟著回收）。 */
  let VIEW_AC=new AbortController();
  function viewOn(t,type,fn,opt){const o=typeof opt==='boolean'?{capture:opt}:Object.assign({},opt||{});o.signal=VIEW_AC.signal;t.addEventListener(type,fn,o);}   // 取代 addEventListener
  function viewDone(fn){VIEW_AC.signal.addEventListener('abort',fn,{once:true});}   // 換頁時要做的收尾
  function viewObs(o){viewDone(()=>o.disconnect());return o;}   // 觀察器：換頁時 disconnect
  function viewTimer(id){viewDone(()=>clearInterval(id));return id;}   // setInterval：換頁時清掉
  function viewEnd(){VIEW_AC.abort();VIEW_AC=new AbortController();}
  function renderView(id){
    if(id==='start'){flwRoute();return;}  // 開新專案流程＝大型 modal，開在目前頁面上（深連結開在首頁上）
    window.__flwBg=id;
    viewEnd();   // VIEW-LIFE:v1 先關掉上一頁登記的常駐監聽／觀察器／計時器
    LIVE_REFRESH.clear(); // 換頁清掉舊 Live 篩選器連動註冊，避免累積
    current=id;const view=document.getElementById('view');
    view.classList.toggle('pg10',['tokens','guideline','summary','changelog','settings','guide'].includes(id)); // PAGES10:v1 非元件頁 bento 版型
    if(hashId()!==id)location.hash=id; // 寫入 hash 供重整後還原
    const item=NAV.flatMap(g=>g.items).find(x=>x.id===id);
    if(id==='home'){renderHome(view);}
    else if(id==='summary'){if(dsEditing())renderSummary(view);else renderSummaryLocked(view);}   // MODE:v1
    else if(id==='guide'){renderGuide(view);}
    else if(id==='changelog'){renderChangelog(view);}
    else if(id==='guideline'){renderGuideline(view);}
    else if(id==='settings'){renderSettings(view);}
    else if(id==='tokens'){renderTokens(view);}
    else if(id==='components'||id==='templates'){renderOverview(view,id);}   // IA-PAGES:v1 總覽頁
    else if(id==='button'&&PAGE_LAYOUT.button==='bento'){view.innerHTML=buttonBentoHTML();renderAxes();renderMatrix();renderSizes();renderBooleans();renderShapes();renderCount();renderLive();renderBindPanel(view,'button');wireBento(view.querySelector('.bento'));} // bento 版型（不跑 reorderSections：順序由版型決定）
    else if(id==='button'){view.innerHTML=buttonViewHTML();renderSpecStrip();renderAxes();renderMatrix();renderSizes();renderBooleans();renderCount();renderLive();renderBindPanel(view,'button');reorderSections(view);} // 「互動預覽與程式碼」段落移到「變數與 Token」下方
    else if(BUILD[id]){BUILD[id](view);renderBindPanel(view,id);if(!bentoifyPage(view,id))reorderSections(view);} // BENTO-ALL:v1 預設套 bento 版型；PAGE_LAYOUT[id]='classic' 或沒有 Live／篩選器的頁維持舊版 // 集中掛綁定卡（無 TOKEN_SLOTS 則 early-return）＋統一段落順序
    else if(item&&item.st==='planned'){view.innerHTML=`<div class="placeholder"><div class="em">🧩</div><h2>${item.name}</h2><p><span class="nav-plan" style="margin-right:6px">${item.pr||''}</span>規劃中元件（2026-11-03 差距分析建議新增）。</p><p>${item.note||''}</p><div class="axhint">完成前不會出現在選擇元件頁與匯出；建置時請補 DIAL_SPECS（軸）並把 st 改為 ready。</div></div>`;}
    else{view.innerHTML=`<div class="placeholder"><div class="em">🧩</div><h2>${item.name}</h2><p>這顆元件還沒定案。先在已完成的元件上把「元件該多複雜」的模式定下來，我再用同一套方式套到這裡。</p><div class="axhint">預定軸：variant × state × size（＋各自的內容軸）</div></div>`;}
    {const sec=secOf(id),sb=document.getElementById('sidebar');   // IA-SHELL:v1
      if(!sb||sb.dataset.sec!==sec)renderNav();
      else{document.querySelectorAll('#sidebar .nav-sec .nav-item').forEach(el=>el.setAttribute('aria-current',el.dataset.id===id));
        const c=document.querySelector('#sidebar .nav-sec .nav-item[aria-current="true"]');if(c){const g=c.closest('.nav-group');if(g)g.classList.remove('collapsed');requestAnimationFrame(()=>c.scrollIntoView({block:'nearest'}));}}
      paintSec(sec);}
    if(window.innerWidth<=900)document.getElementById('shell').classList.remove('nav-open'); // 窄螢幕選完自動收起
    const _m=document.querySelector('.main');if(_m)_m.scrollTo(0,0); // app-shell：捲 main 容器（非 document）
    pgcDecorate(view,id);   // IA-PAGES:v1 麵包屑／手機 Token 分頁／上一個下一個
    buildTOC(); // 換頁後重建右緣本頁目錄
    armReveal(); // 換頁後為本頁段落掛捲動進場（fade-up）
    adoptTextLinks(view); // LNK-ADOPT:v1 說明文字連結取用 Link 原子
  }
  /* LNK-ADOPT:v1（2026-11-10）頁面說明文字（lede）、段落副標（bh-d）、首頁 FAQ 裡沒有 class 的 <a> 原本吃瀏覽器預設樣式（藍／紫、實線底線），
     一律套上 Link 原子 inline（.lnk.lnk-inline：--accent、半透明底線、hover 轉實色、focus 外框）。元件示範與程式碼裡的連結不動。 */
  function adoptTextLinks(root){(root||document).querySelectorAll('.lede a:not([class]),.bh-d a:not([class]),.hx-faq a:not([class])').forEach(a=>a.classList.add('lnk','lnk-inline'));}
  function armReveal(){ // 全站段落進場：首屏可見段落確定性淡入（rAF）＋其餘捲動進視窗才觸發；SPA 換頁重建內容故每次換頁重掛
    const view=document.getElementById('view'); if(!view) return;
    if(view.__rvObs){view.__rvObs.disconnect();view.__rvObs=null;} // 先斷開舊 observer 避免累積
    if(view.__rvRaf){cancelAnimationFrame(view.__rvRaf);view.__rvRaf=null;}
    if(matchMedia('(prefers-reduced-motion:reduce)').matches) return; // 尊重系統「減少動態」設定：不隱藏、不動畫
    const SECT='.gd-sec,.block,.tok-sec,.cl-entry,.dg-sec,.sumcat,.placeholder'; // 內容段落單位（hero 有自己的載入動畫，不納入）
    const SKIP='.head-rule'; // 分隔線等非內容元素排除：不加 opacity:0，避免動畫沒播到時整條消失
    const guide=view.querySelector(':scope > .gd-guide');
    const root=guide||view; // guide 頁降一層進 .gd-guide（跳過 hero）；其餘頁以 #view 為根
    const units=[...root.querySelectorAll(SECT)].filter(el=>!el.parentElement.closest(SECT) && !el.closest('.gd-hero')); // 最外層段落單位（去巢狀、排除 hero 內）
    const loose=[...root.children].filter(el=>!el.classList.contains('gd-hero') && el.tagName!=='FOOTER' && !el.matches(SKIP) && !el.matches(SECT) && !el.querySelector(SECT)); // 頂層區塊本身不含段落單位者（各頁標題頭部、tokens 卡片區等）整塊納入 → 讓「第一個段落」也淡入
    const targets=[...loose,...units].sort((a,b)=> (a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING)?-1:1); // 依 DOM 順序排序，stagger 才正確
    if(!targets.length) return;
    const main=document.querySelector('.main'); // 捲動容器＝IntersectionObserver 的 root
    targets.forEach(el=>el.classList.add('rv')); // 同步先隱藏（opacity:0）：保證首幀就是隱藏態
    const obs=new IntersectionObserver(ents=>{ ents.forEach(e=>{ // 捲動進視窗、或已捲過視窗上緣 → 顯示，避免快速捲動/TOC 跳轉的段落卡在隱藏
      if(e.isIntersecting || (e.rootBounds && e.boundingClientRect.top < e.rootBounds.top)){ e.target.classList.add('rv-in'); obs.unobserve(e.target); } }); },
      {root:main,rootMargin:'0px 0px -10% 0px',threshold:.02});
    view.__rvObs=obs;
    view.__rvRaf=requestAnimationFrame(()=>{ view.__rvRaf=null; // 一次 rAF 等 layout 穩定再量位置（@keyframes 動畫不需靠幀間隔觸發）
      const mr=main.getBoundingClientRect();
      const inView=[], below=[];
      targets.forEach(el=>{ const r=el.getBoundingClientRect(); (r.top<mr.bottom && r.bottom>mr.top ? inView : below).push(el); });
      below.forEach(el=>obs.observe(el)); // 首屏外：捲動進視窗才觸發
      inView.forEach((el,i)=>{ el.style.setProperty('--rv-d',Math.min(i,5)*70+'ms'); el.classList.add('rv-in'); }); // 首屏內：確定性淡入＋小幅 stagger（上限 5×70ms）
    });
  }
  function renderSettings(view){ // 偏好設定頁：磨砂材質＋背景漸層＋互動預覽版型，皆持久化到 localStorage（深淺色已移到 topbar）
    const CHK='<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0L3.22 8.28a.75.75 0 0 1 1.06-1.06L7 9.94l5.72-5.72a.75.75 0 0 1 1.06 0Z"/></svg>';
    const ptPage='<div class="pt-top"><span class="pt-dot"></span><span class="pt-dot"></span><span class="pt-dot"></span></div>'+
      '<div class="pt-body"><div class="pt-side"><span></span><span></span><span></span><span></span></div>'+
      '<div class="pt-main"><span class="pt-h"></span><span></span><span></span><span></span><span></span></div></div>';
    const ptHero='<span class="pt-hb pt-hb1"></span><span class="pt-hb pt-hb2"></span><span class="pt-hcta"></span>';
    const THEME=[ // 縮圖＝我們頁面的化簡（topbar 圓點＋側欄列＋內容列）
      {k:'light',name:'淺色',thumb:'<div class="pt pt-light">'+ptPage+'</div>'},
      {k:'dark',name:'深色',thumb:'<div class="pt pt-dark">'+ptPage+'</div>'},
      {k:'system',name:'跟隨系統',thumb:'<div class="pt pt-light">'+ptPage+'</div><div class="pt pt-dark pt-split">'+ptPage+'</div>'},
    ];
    const GRAD=[ // 縮圖＝化簡首屏 hero；經典流動/靜態＝珊瑚暖色（動/不動）、主色/輔色流動＝依當前 token 錨點色即時生成
      {k:'classic',name:'經典流動',thumb:'<div class="pt pt-hero pt-grad-classic">'+ptHero+'</div>'},
      {k:'static',name:'經典靜態',thumb:'<div class="pt pt-hero pt-grad-classic-static">'+ptHero+'</div>'},
      {k:'primary',name:'主色流動',thumb:'<div class="pt pt-hero pt-grad-primary">'+ptHero+'</div>'},
      {k:'secondary',name:'輔色流動',thumb:'<div class="pt pt-hero pt-grad-secondary">'+ptHero+'</div>'},
    ];
    const plA='<div class="pl-a"><span class="pl-seg"></span><span class="pl-seg"></span><span class="pl-btn"></span></div>'; // 控制項條＋預覽鈕
    const plB='<div class="pl-b"><i></i><i></i><i></i><i></i></div>'; // 程式碼行（含語法色）
    const LAY=[ // 縮圖＝互動預覽排列（精細化：左＝控制項/預覽、右/下＝程式碼；水平左右、垂直上下堆疊）
      {k:'h',name:'水平排列',thumb:'<div class="pt pt-lay pt-lay-h">'+plA+'<span class="pl-div"></span>'+plB+'</div>'},
      {k:'v',name:'垂直排列',thumb:'<div class="pt pt-lay pt-lay-v">'+plA+plB+'</div>'},
    ];
    const curTheme=window.__themePref||'system';
    const curGrad=window.__shaderMode||'classic';
    const curLay=(window.__liveLayoutPref==='v')?'v':'h';
    const isMobile=window.matchMedia('(max-width:767px)').matches; // 手機：水平版型無法呈現（版面已強制單欄）
    const effLay=isMobile?'v':curLay;                              // 手機一律以垂直為當前選中
    const card=(o,sel)=>'<button class="pref-card'+(sel?' sel':'')+'" type="button" data-k="'+o.k+'"><div class="pref-thumb">'+o.thumb+'<span class="pref-check">'+CHK+'</span></div><div class="pref-cardfoot"><span class="pref-cardname">'+o.name+'</span></div></button>';
    const layCard=(o)=>{const disabled=isMobile&&o.k==='h';return '<button class="pref-card'+(o.k===effLay?' sel':'')+(disabled?' pref-disabled':'')+'" type="button" data-k="'+o.k+'"'+(disabled?' disabled':'')+'><div class="pref-thumb">'+o.thumb+'<span class="pref-check">'+CHK+'</span></div><div class="pref-cardfoot"><span class="pref-cardname">'+o.name+'</span></div></button>';};
    view.innerHTML=`
      <div class="sum-top"><div class="sum-head"><p class="eyebrow">Preferences · 偏好設定</p><h1>偏好設定</h1></div></div>
      <p class="lede">個人化這個介面的外觀。你的選擇會記在這台裝置，重新整理後仍會保留。</p>
      <div class="head-rule"></div>
      <section class="block pref-sec">
        <div class="pref-sec-h"><h2>磨砂材質</h2><p>網站外框變成半透明磨砂，透出依主／副色生成的漸層；元件預覽維持實心底色。</p></div>
        <div class="pref-frost"><div class="pref-frost-prev" id="pfPrev" aria-hidden="true"><div class="pfb"></div><div class="pfp"><i></i><i></i><i></i></div></div>
          <div class="pref-frost-ctl"><div class="fsl" id="pfSl"><span class="fsl-fill"></span><span class="fsl-ticks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
              <label class="fsl-lb" for="pfRange">磨砂程度</label><output class="fsl-val" id="pfOut" for="pfRange"></output><input type="range" id="pfRange" min="0" max="100" step="5"></div>
            <div id="pfPre"></div></div></div>
      </section>
      <section class="block pref-sec">
        <div class="pref-sec-h"><h2>背景漸層</h2><p>上手指南首屏的背景效果。主色／輔助色會依當前 Design Token 的主／副色即時生成，改了 token 色號漸層也跟著變。</p></div>
        <div class="pref-cards" id="prefGrad">${GRAD.map(o=>card(o,o.k===curGrad)).join('')}</div>
      </section>
      <section class="block pref-sec">
        <div class="pref-sec-h"><h2>互動預覽版型</h2><p>元件頁「互動預覽與程式碼」的排列方式。水平＝控制項與預覽在左、程式碼在右（可拖拉調寬）；垂直＝由上而下堆疊。</p></div>
        <div class="pref-cards" id="prefLay">${LAY.map(layCard).join('')}</div>
        ${isMobile?'<p class="pref-note">📱 手機上無法水平顯示，僅能垂直排列。</p>':''}
      </section>`;
    (function(){ // 磨砂：填充式滑桿即時套用＋持久化；快速值取用 Segmented 原子（自訂值時都不選）
      const rg=view.querySelector('#pfRange'),out=view.querySelector('#pfOut'),pv=view.querySelector('#pfPrev'),pre=view.querySelector('#pfPre'),sl=view.querySelector('#pfSl');
      const P=[0,30,60,100];let lastIdx=null;
      const seg=idx=>{lastIdx=idx;const g=sgmEl('soft','m',{live:true,full:true,label:'磨砂快速值',items:['關閉','輕','中','重'],active:idx<0?-1:idx,onChange:i=>set(P[i],true,true)});
        if(idx<0){const b=g.querySelector('.sgm-it');if(b)b.tabIndex=0;}pre.replaceChildren(g);};
      const set=(v,persist,fromSeg)=>{v=+v;rg.value=v;out.textContent=v+'%';sl.style.setProperty('--p',v+'%');pv.style.setProperty('--pf',String(v/100));window.__applyFrost(v,persist);
        const idx=P.indexOf(v);if(!fromSeg&&idx!==lastIdx)seg(idx);else if(fromSeg)lastIdx=idx;};
      rg.addEventListener('input',()=>set(rg.value,false));rg.addEventListener('change',()=>set(rg.value,true));
      rg.addEventListener('pointerdown',()=>sl.classList.add('is-drag'));['pointerup','pointercancel','blur'].forEach(t=>rg.addEventListener(t,()=>sl.classList.remove('is-drag')));
      set(window.__frost||0,false);
    })();
    view.querySelectorAll('#prefGrad .pref-card').forEach(c=>c.onclick=()=>{ // 漸層：記模式偏好＋持久化；在 guide 頁即時套用（classic/primary/secondary/off）
      const mode=c.dataset.k; window.__shaderMode=mode;
      try{localStorage.setItem('ds-shader',mode);}catch(e){}
      if(current==='guide' && window.__shaderApply)window.__shaderApply(mode);
      view.querySelectorAll('#prefGrad .pref-card').forEach(x=>x.classList.toggle('sel',x===c));
    });
    view.querySelectorAll('#prefLay .pref-card').forEach(c=>c.onclick=()=>{ // 互動預覽版型：記偏好＋持久化（元件頁下次載入即套用）
      if(c.classList.contains('pref-disabled'))return; // 手機的水平排列不可選
      window.__liveLayoutPref=c.dataset.k==='v'?'v':'h';
      try{localStorage.setItem('ds-livelayout',window.__liveLayoutPref);}catch(e){}
      view.querySelectorAll('#prefLay .pref-card').forEach(x=>x.classList.toggle('sel',x===c));
    });
  }
  function navPrefBox(){const w=ce('div','nav-pref');
    const row=(label,ctl)=>{const r=ce('div','nav-pref-r');const l=ce('span');l.textContent=label;r.append(l,ctl);w.appendChild(r);};
    /* NAV-PREF:v2 深淺色切換回到頂欄，選單只放語言 */
    let lg=null;try{lg=langDd();}catch(e){}   /* I18N-JA:v1 renderNav 可能比 langDd 宣告早跑 */
    if(lg)row('語言',lg);
    return w;}
  /* IA-SHELL:v1 網站分區：Header 四個入口（順序 Token → Components → Templates → History），側欄只列目前分區的項目 */
  const NAV_TPL=()=>NAV.find(g=>/^Template/.test(g.group));
  const NAV_SECS=[{id:'tokens',lb:'Token',zh:'設計變數',go:()=>'tokens'},{id:'components',lb:'Components',zh:'元件',go:()=>'components'},
    {id:'templates',lb:'Templates',zh:'範本',go:()=>'templates'},{id:'history',lb:'History',zh:'版本紀錄',go:()=>'changelog'}];
  function secOf(id){if(!id||id==='home'||id==='start')return 'home';if(['tokens','guideline','summary','settings'].includes(id))return 'tokens';if(['changelog','guide'].includes(id))return 'history';if(id==='templates')return 'templates';
    const t=NAV_TPL();return t&&t.items.some(x=>x.id===id)?'templates':'components';}
  const navZh=()=>typeof I18N_LANG==='undefined'||I18N_LANG==='zh';   /* 英文名稱後面補中文只在中文介面 */
  function navPin(id,label,cls){const b=document.createElement('button');b.className='nav-item nav-pin'+(cls?' '+cls:'');b.dataset.id=id;b.setAttribute('aria-current',current===id);
    b.innerHTML='<span></span>';b.firstChild.textContent=label;b.onclick=()=>renderView(id);return b;}
  /* 目前分區：Header 入口底線、手機清單、shell 的 data-sec（控制首頁／版本紀錄不顯示側欄） */
  function paintSec(sec){const sh=document.getElementById('shell');if(sh)sh.dataset.sec=sec;
    const bar=document.querySelector('.tb-secnav .mn-bar');if(bar&&bar._setActive){const i=NAV_SECS.findIndex(x=>x.id===sec);bar._setActive(i<0?null:bar._nodes[i]);}
    document.querySelectorAll('.nav-mlist .nav-item').forEach(b=>b.setAttribute('aria-current',String(b.dataset.sec===sec)));}

