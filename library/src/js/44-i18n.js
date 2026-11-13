  const I18N_UNIT={'元':'NTD','筆':'','件':''};   /* 後台 KPI 單位：英文標籤已說明是什麼（Orders today…），計數單位省略，避免撐爆 */  /* 分段控制裡的「日週月年」 */
  const I18N_S={'在線':'Online','離線':'Offline','離開':'Away','忙碌':'Busy'};
  const I18N_MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const I18N_CJK=/[\u3400-\u9fff]/;
  const I18N_NAV=/^([A-Za-z][A-Za-z0-9 &\/.+\-]*?)\s+[\u3400-\u9fff（）、／]+$/;   /* 「Button 按鈕」→ Button */
  const I18N_DOT=/^[\u3400-\u9fff（）、／ ]+·\s*([A-Za-z][A-Za-z0-9 \-]*)$/;   /* I18N:v2「實心·solid」→ solid */
  const I18N_TERM=/^[\u3400-\u9fff（）、／ ]+\s([A-Za-z][A-Za-z0-9\-]*(?: [A-Za-z][A-Za-z0-9\-]*)*)$/;  /* I18N:v2「圓角 radius」→ Radius */
  const I18N_ATTRS=['aria-label','placeholder','title'];
  const I18N_SKIP='script,style,pre,textarea,.code-pre,.code-gutter,[data-i18n-skip]';  /* 2026-11-10：只跳過程式碼本體（.code-pre／行號），程式碼區的標題與「複製」「下載」按鈕照常翻 */  /* inline <code> 只換對照表完全相符的字，可以放行 */
  const I18N_SKIP_ATTR='script,style,[data-i18n-skip]';  /* I18N:v2 程式碼區裡的按鈕 title／aria-label 仍要翻（例：展開檢視） */
  let I18N_LANG='zh';try{const v=localStorage.getItem('cdl-lang');if(v==='en'||v==='ja')I18N_LANG=v;}catch(e){}   /* I18N-JA:v1 加日文 */
  let I18N_HIT=0;   /* I18N-JA:v1 這次翻譯是否來自日文字典（日文保留全形標點、不補英文空格） */
  const I18N_TXT=new Map(),I18N_ATR=new Map();let I18N_MO=null;
  function i18nCore(k,el){
    if(I18N_LANG==='ja'){const j=i18nJa(k,el);if(j!=null){I18N_HIT=1;return j;}}
    if(el&&el.closest&&el.closest('.sgm')&&I18N_SGM[k])return I18N_SGM[k];
    if(el&&el.closest&&el.closest('.mbr,.mbr-stage')&&({'檔案':1,'說明':1})[k])return k==='檔案'?'File':'Help';   /* P3-I18N:v1 選單列語境 */
    if(el&&el.closest&&el.closest('.tad-kpi-u')&&I18N_UNIT[k]!=null)return I18N_UNIT[k];
    if(el&&el.closest&&el.closest('.mtc')&&({'分':'min','小時':'h','平均':'avg'})[k])return ({'分':'min','小時':'h','平均':'avg'})[k];   /* LOC-SRC:v1 指標卡單位縮寫 */
    if(el&&el.closest&&el.closest('.tad-kpi-p')&&k==='元')return 'NT$';
    if(el&&el.closest&&el.closest('.tad-per-u')&&k==='筆')return '';
    if(I18N_EN[k]!=null)return I18N_EN[k];
    if(k.length===1&&I18N_WD[k])return I18N_WD[k];
    for(const [rx,r] of I18N_RX){const mm=k.match(rx);if(!mm)continue;
      if(r==='MONTH')return I18N_MON[+mm[1]-1]||null;
      let ok=true;const out=k.replace(new RegExp(rx),r).replace(/\{([TWS]):(\d)\}/g,(_,t,n)=>{const g=mm[+n]||'';
        if(t==='W')return I18N_W[g]||g;if(t==='S')return I18N_S[g]||g;const v=i18nCore(g,el);if(v==null&&I18N_CJK.test(g))ok=false;return v==null?g:v;});
      return ok?out:null;}
    if(k.includes(' · ')){let ok=true;const o=k.split(' · ').map(x=>{if(!I18N_CJK.test(x))return x;const v=i18nCore(x.trim(),el);if(v==null){ok=false;return x;}return v;});return ok?o.join(' · '):null;}
    if(k.startsWith('· ')){const v=i18nCore(k.slice(2),el);return v==null?null:'· '+v;}
    const n=k.match(I18N_NAV);if(n)return n[1];
    /* I18N:v2 通用規則：「實心·solid」→ solid；「圓角 radius」→ Radius（中文標籤＋英文術語只留英文） */
    const d=k.match(I18N_DOT);if(d)return d[1];
    const t=k.match(I18N_TERM);if(t)return t[1].charAt(0).toUpperCase()+t[1].slice(1);
    return null;}
  /* I18N-JA:v1 日文：字典 → 動態句型（{T:n} 子片段再翻） */
  function i18nJa(k,el){if(I18N_JA[k]!=null)return I18N_JA[k];
    for(const [rx,r] of I18N_JA_RX){const mm=k.match(rx);if(!mm)continue;
      return k.replace(new RegExp(rx),r).replace(/\{T:(\d)\}/g,(_,n)=>{const g=mm[+n]||'';const v=I18N_JA[g]!=null?I18N_JA[g]:i18nCore(g,el);return v==null?g:v;});}
    return null;}
  function i18nJaLoadFont(){if(document.getElementById('jaFont'))return;const l=document.createElement('link');l.id='jaFont';l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap';document.head.appendChild(l);}
  /* I18N:v2 全形標點轉半形；片段與相鄰 <b>／<code>／<a> 之間補空格（中文沒有空格，直接拼接英文會黏在一起） */
  const I18N_FW=/[，。、；：（）＋／「」『』！？]/;
  const I18N_INL=/^(B|STRONG|EM|I|CODE|A|SPAN|KBD|SMALL|MARK|U|S)$/;
  function i18nPunct(s){if(!I18N_FW.test(s))return s;const e=/[，。、；：（）＋／「」『』！？]\s*$/.test(s),b=/^\s*[（＋／]/.test(s);
    const r=s.replace(/[，、]/g,', ').replace(/。/g,'. ').replace(/；/g,'; ').replace(/：/g,': ').replace(/！/g,'! ').replace(/？/g,'? ')
      .replace(/（/g,' (').replace(/）/g,') ').replace(/＋/g,' + ').replace(/／/g,' / ').replace(/[「『]/g,'“').replace(/[」』]/g,'”')
      .replace(/ {2,}/g,' ').replace(/ ([,.;:!?)])/g,'$1').replace(/\( /g,'(');
    return b&&e?r.trim():e?r.trimEnd():b?r.trimStart():r;}  /* 結尾／開頭的空格交給 i18nGap 依相鄰文字決定 */
  function i18nSib(n,dir){let x=n;while(x){const s=dir<0?x.previousSibling:x.nextSibling;if(s)return s;x=x.parentElement;if(!x||!I18N_INL.test(x.tagName))return null;}return null;}
  function i18nGap(n,en){const ok=x=>x&&(x.nodeType===3||(x.nodeType===1&&I18N_INL.test(x.tagName)));
    const pv=i18nSib(n,-1),nx=i18nSib(n,1);
    if(ok(pv)&&/^[A-Za-z0-9(“]/.test(en)&&/[A-Za-z0-9)”.,:;!?]$/.test(pv.textContent||''))en=' '+en;
    if(ok(nx)&&/[A-Za-z0-9,.;:)”]$/.test(en)&&/^[A-Za-z0-9(“]/.test(nx.textContent||''))en=en+' ';
    return en;}
  function i18nText(n){const cur=n.nodeValue;const rec=I18N_TXT.get(n);if(rec&&rec.en===cur)return;
    const cjk=!!cur&&I18N_CJK.test(cur),fw=!!cur&&!cjk&&I18N_FW.test(cur);
    if(!cjk&&!fw){if(rec)I18N_TXT.delete(n);return;}
    const p=n.parentElement;if(!p||p.closest(I18N_SKIP))return;
    let en=cur;I18N_HIT=0;if(cjk){const k=cur.trim();const v=i18nCore(k,p);if(v==null){I18N_TXT.delete(n);return;}en=cur.replace(k,()=>v).replace(/^\s+(?=[,.;:)!?])/,'');}
    if(I18N_LANG==='ja'&&(I18N_HIT||!cjk))en=en.replace(/，/g,'、');else en=i18nGap(n,i18nPunct(en));if(en===cur)return;
    I18N_TXT.set(n,{zh:cur,en});n.nodeValue=en;}
  function i18nAttr(el,a){const cur=el.getAttribute(a);let r=I18N_ATR.get(el);if(r&&r[a]&&r[a].en===cur)return;
    if(!cur||!I18N_CJK.test(cur)||el.closest(I18N_SKIP_ATTR))return;I18N_HIT=0;let v=i18nCore(cur.trim(),el);if(v==null)return;v=(I18N_LANG==='ja'&&I18N_HIT?v:i18nPunct(v)).trim();
    if(!r){r={};I18N_ATR.set(el,r);}r[a]={zh:cur,en:v};el.setAttribute(a,v);}
  function i18nWalk(root){if(!root)return;if(root.nodeType===3){i18nText(root);return;}if(root.nodeType!==1)return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))i18nText(n);
    const els=[root,...root.querySelectorAll('[aria-label],[placeholder],[title]')];els.forEach(el=>{if(el.getAttribute)I18N_ATTRS.forEach(a=>{if(el.hasAttribute(a))i18nAttr(el,a);});});}
  /* I18N-JA:v1 語言下拉：Dropdown 原子（ddField），選項用各語言自己的寫法；__sync 讓頂欄與手機選單兩顆保持一致 */
  const I18N_LANGS=[{value:'zh',label:'中文'},{value:'en',label:'English'},{value:'ja',label:'日本語'}];
  function langDd(){const cur=(()=>{try{return I18N_LANG;}catch(e){return 'zh';}})();
    const d=ddField('outline',{size:'s',options:I18N_LANGS,value:cur,onChange:v=>{if(v!==I18N_LANG)i18nSet(v);}});
    d.classList.add('lang-dd');d.setAttribute('data-i18n-skip','');const t=d.querySelector('.dd');if(t)t.setAttribute('aria-label','語言 Language');
    d.__sync=()=>{const L=I18N_LANGS.find(x=>x.value===I18N_LANG);const v=d.querySelector('.dd .val');if(v&&L)v.textContent=L.label;
      d.querySelectorAll('.ddopt').forEach((o,i)=>{const on=I18N_LANGS[i].value===I18N_LANG;o.classList.toggle('sel',on);o.setAttribute('aria-selected',on?'true':'false');});};
    return d;}
  function i18nSet(lang){I18N_LANG=(lang==='en'||lang==='ja')?lang:'zh';try{localStorage.setItem('cdl-lang',I18N_LANG);}catch(e){}
    document.documentElement.lang=I18N_LANG==='en'?'en':I18N_LANG==='ja'?'ja':'zh-Hant';
    if(I18N_MO){I18N_MO.disconnect();I18N_MO=null;}
    /* I18N-JA:v1 換語言前先還原成中文原文，en ↔ ja 才不會疊在上一個語言上 */
    I18N_TXT.forEach((r,n)=>{if(n.nodeValue===r.en)n.nodeValue=r.zh;});I18N_TXT.clear();
    I18N_ATR.forEach((r,el)=>{for(const a in r)if(el.getAttribute(a)===r[a].en)el.setAttribute(a,r[a].zh);});I18N_ATR.clear();
    if(I18N_LANG==='ja')i18nJaLoadFont();
    if(I18N_LANG!=='zh'){i18nWalk(document.body);
      I18N_MO=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')i18nText(m.target);
        else if(m.type==='attributes')i18nAttr(m.target,m.attributeName);else m.addedNodes.forEach(i18nWalk);}});
      I18N_MO.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:I18N_ATTRS});}

    document.querySelectorAll('.lang-dd').forEach(d=>d.__sync&&d.__sync());
    document.dispatchEvent(new CustomEvent('cdl:lang',{detail:I18N_LANG}));}
  window.__i18nSet=i18nSet;
  /* topbar 語系切換：Segmented 原子（中／EN），放在深淺色切換右邊 */
  (function(){const th=document.getElementById('themeBtn');if(!th)return;
    const g=langDd();g.id='langSgm';th.insertAdjacentElement('afterend',g);
    if(I18N_LANG!=='zh')requestAnimationFrame(()=>i18nSet(I18N_LANG));})();

