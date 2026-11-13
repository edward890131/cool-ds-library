  /* ===== 檢視切換 ===== */
  let current='summary';
  /* URL hash 記住當前檢視：重新整理／深連結會停在原元件頁，不跳回匯出需求 */
  /* Motion：等元素目前的 animation 播完再執行（讀 computed duration；減少動態時為 0 立即執行） */
  /* Motion v1 · 第三批共用：文字滾換／圖示交叉替換／高度展開收合／FLIP 重排 */
  function swapText(el,text){ if(!el)return; const old=el.textContent; if(old===text)return;
    if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=text;return;}
    el.classList.add('txt-swap');el.innerHTML='';const a=ce('span','ts-old'),b=ce('span','ts-new');a.textContent=old;b.textContent=text;el.append(a,b);
    afterAnim(b,()=>{if(el.contains(b)){el.classList.remove('txt-swap');el.textContent=text;}}); }
  function swapIcon(el,html){ if(!el)return;
    if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.innerHTML=html;return;}
    const old=el.innerHTML;el.innerHTML='';const w=ce('span','ic-swap'),a=ce('span','ic-old'),b=ce('span','ic-new');a.innerHTML=old;b.innerHTML=html;w.append(a,b);el.appendChild(w);
    afterAnim(b,()=>{if(el.contains(w))el.innerHTML=html;}); }
  function slideToggle(el,open){ if(!el)return;
    if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.removeAttribute('style');return;}
    el.style.display='block';el.style.overflow='hidden';const h=el.scrollHeight;
    el.style.transition='none';el.style.height=(open?0:h)+'px';el.style.opacity=open?'0':'1';void el.offsetHeight;
    el.style.transition='height var(--dur-default) var(--ease-out),opacity var(--dur-fast) var(--ease-out)';
    el.style.height=(open?h:0)+'px';el.style.opacity=open?'1':'0';
    afterTransition(el,()=>{el.removeAttribute('style');if(!open&&el.dataset.slideHide==='1')el.style.display='none';}); }
  function flipFirst(box){const m=new Map();box.querySelectorAll(':scope > [data-flip]').forEach(r=>m.set(r.dataset.flip,r.getBoundingClientRect().top));return m;}
  function flipPlay(box,first){ if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    box.querySelectorAll(':scope > [data-flip]').forEach(r=>{const t=first.get(r.dataset.flip);if(t==null)return;const dy=t-r.getBoundingClientRect().top;if(!dy)return;
      r.style.transition='none';r.style.transform=`translateY(${dy}px)`;});
    requestAnimationFrame(()=>requestAnimationFrame(()=>box.querySelectorAll(':scope > [data-flip]').forEach(r=>{if(!r.style.transform)return;
      r.style.transition='transform var(--dur-default) var(--ease-out)';r.style.transform='';afterTransition(r,()=>{r.style.transition='';});}))); }
  function afterTransition(el,cb){const cs=getComputedStyle(el);const ms=Math.max(...cs.transitionDuration.split(',').map(x=>parseFloat(x)||0))*1000;ms>0?setTimeout(cb,ms+20):cb();}
  function afterAnim(el,cb){const cs=getComputedStyle(el);const ms=(parseFloat(cs.animationDuration)||0)*1000+(parseFloat(cs.animationDelay)||0)*1000;ms>0?setTimeout(cb,ms+20):cb();}
  /* Motion v1：圖片載入完成 → 加 .is-loaded 播 blur-up（load 不冒泡，用捕獲階段） */
  document.addEventListener('load',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('im-img'))t.classList.add('is-loaded');},true);
