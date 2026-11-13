/* PULSO-RT:v1 PulsoIcon 執行端（手寫，不會被 build-pulso-icons.mjs 覆蓋）
   PI(key,{solid})：產生一顆 icon 的 <svg>（寬高交給 CSS；root 帶 data-pi 供播放器辨識）。
   遮罩去重：實心版用 <mask> 挖出細節，同一字串重複插入會撞 id（第一份若在隱藏區塊，其他份會畫不出來）→ 新增節點時改成唯一 id。
   播放：滑過／聚焦最近的 button、a、[role=tab]… 時播該 icon 的專屬動態（沿用 PulsoIcon 的觸發規則；系統「減少動態」時不動）。
   第一次碰到才綁定（lazy），不用每顆 icon 都先掛監聽。 */
let PI_N=0;
function PI(key,o){o=o||{};const d=PULSO_ICONS[key];if(!d){if(window.console)console.warn('PI：找不到 icon',key);return '';}
  const lead={'data-pi':key};if(o.solid)lead['data-pi-solid']='';
  return PulsoCore.frameMarkup(PulsoCore.iconFrame(d,{solid:!!o.solid,maskId:'pim'+(++PI_N)}),lead)
    .replace(/^<svg([^>]*?) height="[^"]*"/,'<svg$1').replace(/^<svg([^>]*?) width="[^"]*"/,'<svg$1');}
function piFixMasks(root){if(!root||!root.querySelectorAll)return;
  root.querySelectorAll('svg[data-pi-solid] mask[id]').forEach(m=>{const id=m.id;const first=document.getElementById(id);if(!first||first===m)return;
    const n='pim'+(++PI_N)+'-'+id.split('-').pop();m.id=n;const svg=m.ownerSVGElement;if(svg)svg.querySelectorAll('[mask="url(#'+id+')"]').forEach(e=>e.setAttribute('mask','url(#'+n+')'));});}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;
  if(n.matches('svg[data-pi-solid]'))piFixMasks(n.parentNode||n);else if(n.querySelector('svg[data-pi-solid]'))piFixMasks(n);}})
  .observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>piFixMasks(document));
function piArm(e){const el=e.target;if(!el||!el.closest)return;const T=PulsoCore.TRIGGER_SELECTOR;
  const t=el.closest(T);let svgs;
  if(t)svgs=[...t.querySelectorAll('svg[data-pi]')].filter(s=>s.closest(T)===t);
  else{const s=el.closest('svg[data-pi]');svgs=s?[s]:[];}
  svgs=svgs.filter(s=>!s.closest('[data-pi-off]'));   // animated=false：完全靜態
  svgs.forEach(svg=>{if(svg.__pi!==undefined)return;svg.__pi=null;const d=PULSO_ICONS[svg.dataset.pi];if(!d)return;
    try{const fr=PulsoCore.iconFrame(d,{solid:svg.hasAttribute('data-pi-solid'),maskId:'pi-x'});svg.__pi=PulsoCore.playIcon(svg,fr,{});svg.__pi.startAnimation();}catch(err){}});}
document.addEventListener('pointerover',piArm,{passive:true});document.addEventListener('focusin',piArm);
/* CBX-IN:v1 原生 checkbox → Checkbox 原子（見 CSS CBX-IN:v1）。cbxEl 定義在後面，執行時（DOMContentLoaded 後）才呼叫。 */
function cbxAdopt(root){if(!root||!root.querySelectorAll||typeof cbxEl!=='function')return;
  const list=root.matches&&root.matches('input[type=checkbox]')?[root]:root.querySelectorAll('input[type=checkbox]');
  list.forEach(i=>{if(i.hasAttribute('data-cbx')||!i.parentNode||i.closest('.cbx-in'))return;i.setAttribute('data-cbx','');
    const w=document.createElement('span');w.className='cbx-in';i.parentNode.insertBefore(w,i);
    const v=cbxEl('default','m');v.setAttribute('aria-hidden','true');v.innerHTML=ICON_CHECK+ICON_MINUS;
    const sv=v.querySelectorAll('svg');sv[0].classList.add('cbx-ck');sv[1].classList.add('cbx-ind');w.append(i,v);});}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1||n.classList.contains('cbx-in'))continue;
  if(n.matches('input[type=checkbox]')||n.querySelector('input[type=checkbox]:not([data-cbx])'))cbxAdopt(n);}})
  .observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>cbxAdopt(document));

  /* SHELL8:v1 框內載入進度：主程式開始執行 */ try{if(/[?&]rwdframe=1(&|$)/.test(location.search)&&window.parent!==window)window.parent.postMessage({rwdframe:1,t:'stage',s:'js'},'*');}catch(e){}
