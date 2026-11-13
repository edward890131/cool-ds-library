  /* ==================== topbar 深淺色切換 ==================== */
  (function(){const b=document.getElementById('themeBtn');if(!b)return;
    const sync=()=>{const dark=document.documentElement.getAttribute('data-theme')==='dark';b.setAttribute('aria-checked',String(dark));b.setAttribute('aria-label',dark?'切換為淺色模式':'切換為深色模式');
      b.classList.toggle('on',dark);};   /* Toggle 原子：開＝深色 */
    {const ic=b.querySelector('.switch-ic');if(ic){ic.querySelector('.ic-off').innerHTML=IC_SUN;ic.querySelector('.ic-on').innerHTML=IC_MOON;}}
    b.onclick=()=>{window.__applyThemePref(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark',true);sync();};sync();})();

  (function(){ let s; try{s=localStorage.getItem('ds-shader');}catch(e){} // 漸層模式偏好：存 localStorage，無選擇→預設經典；舊值 on→classic、off 維持；initHeroShader 會讀取
    const map={on:'classic',off:'static',classic:'classic',static:'static',primary:'primary',secondary:'secondary'};
    window.__shaderMode=map[s]||'classic'; })();
  (function(){ let s; try{s=localStorage.getItem('ds-livelayout');}catch(e){} window.__liveLayoutPref=(s==='v')?'v':'h'; })(); // 互動預覽版型：存 localStorage，無選擇 → 預設水平(h)；applyLiveLayout 會讀取

  /* ===== 右緣本頁目錄（滑到右緣浮出 → 點擊 scroll 到段落；含當前段落高亮）===== */
  const tocDock=document.getElementById('tocDock'), tocPanel=document.getElementById('tocPanel');
  let tocT, tocItems=[];
  function tocShow(){clearTimeout(tocT);tocPanel.classList.add('on');tocDock.classList.add('peek');}
  function tocHide(){clearTimeout(tocT);tocT=setTimeout(()=>{tocPanel.classList.remove('on');tocDock.classList.remove('peek');},180);}
  function buildTOC(){
    const view=document.getElementById('view');
    tocItems=[];
    view.querySelectorAll('.block > h2, .famhead, .dg-sectitle, .gd-sec-t, .tok-sec-head, [data-toc]').forEach(el=>{ // ＋.tok-sec-head＝Design Token 段；[data-toc]＝首頁無大標題段落
      if(el.dataset.toc)tocItems.push({el,lv:1,txt:el.dataset.toc});
      else if(el.classList.contains('famhead')){const t=el.querySelector('.fz');if(t)tocItems.push({el,lv:2,txt:t.textContent.trim()});}
      else if(el.classList.contains('tok-sec-head')){const t=el.querySelector('.tok-sec-t');tocItems.push({el,lv:1,txt:t?t.textContent.trim():el.textContent.trim()});}
      else if(el.matches('.block > h2')){const t=el.querySelector('.bh-t');tocItems.push({el,lv:1,txt:t?t.textContent.trim():el.textContent.trim()});} // 只取標題、不含同行副標
      else tocItems.push({el,lv:1,txt:el.textContent.trim()});
    });
    if(tocItems.length<2){tocDock.style.display='none';tocPanel.classList.remove('on');tocPanel.innerHTML='';return;} // 段落太少不顯示
    tocDock.style.display='';
    tocPanel.innerHTML='<p class="toc-head">本頁目錄</p>';
    const main=document.querySelector('.main');
    tocItems.forEach(it=>{
      const b=document.createElement('button');b.className='toc-item'+(it.lv===2?' lv2':'');b.textContent=it.txt;
      b.onclick=()=>{const r=it.el.getBoundingClientRect(),mr=main.getBoundingClientRect();main.scrollTo({top:r.top-mr.top+main.scrollTop-72,behavior:'smooth'});};
      it.btn=b;tocPanel.appendChild(b);
    });
    if(main._tocScroll)main.removeEventListener('scroll',main._tocScroll); // 舊 listener 先移除避免累積
    main._tocScroll=()=>{const mr=main.getBoundingClientRect();let cur=0;
      tocItems.forEach((it,i)=>{if(it.el.getBoundingClientRect().top-mr.top<120)cur=i;});
      tocItems.forEach((it,i)=>it.btn.classList.toggle('active',i===cur));};
    main.addEventListener('scroll',main._tocScroll);main._tocScroll();
  }
  // 用 mousemove 偵測右緣（不放實體 overlay，避免擋到 .main 捲軸拖曳）
  document.addEventListener('mousemove',e=>{
    if(getComputedStyle(tocDock).display==='none')return;
    const dist=window.innerWidth-e.clientX, belowBar=e.clientY>64;
    tocDock.classList.toggle('hint',dist<130&&belowBar); // 靠近右緣先露出把手提示
    const pr=tocPanel.getBoundingClientRect();
    const overPanel=tocPanel.classList.contains('on')&&e.clientX>=pr.left-10&&e.clientX<=pr.right+6&&e.clientY>=pr.top-10&&e.clientY<=pr.bottom+10;
    if((dist<22&&belowBar)||overPanel)tocShow();
    else if(tocPanel.classList.contains('on'))tocHide();
  });

