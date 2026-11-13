  /* ===== Design Guideline（出貨前確認頁：讀當前 token + 選定元件）===== */
  function renderGuideline(view){
    const cs=getComputedStyle(document.documentElement);
    const val=n=>cs.getPropertyValue(n).trim();
    view.innerHTML=`<div class="sum-top"><div class="sum-head"><p class="eyebrow">Review · 出貨前確認</p><h1>Design Guideline</h1></div></div>
      <p class="lede">依<b>當前 token 與選定元件</b>組成的設計指南預覽——匯出前的最後確認關（對應框架 Step 3.5「先看效果」）。在 <b>Design Token</b> 調值、在 <b>選擇元件</b> 頁勾要的元件，這頁即時反映。</p>
      <div class="head-rule"></div>
      <div id="dgBody" class="dg-body"></div>`;
    const body=view.querySelector('#dgBody');
    const sec=(title,sub)=>{const s=ce('div','dg-sec');const h=ce('div','dg-sechead');h.innerHTML=`<h2 class="dg-sectitle">${title}</h2>`+(sub?`<p class="dg-secdesc">${sub}</p>`:'')+`<div class="dg-secline"></div>`;s.appendChild(h);body.appendChild(s);return s;};

    /* 1. 品牌 */
    (function(){const s=sec('品牌 Brand','logo 與主色');
      const wrap=ce('div','dg-brand');
      const logos=ce('div','dg-brand-logos');
      [['light','on-light'],['dark','on-dark']].forEach(([th,cls])=>{const chip=ce('div','dg-logo-chip '+cls);
        const src=PROJECT_LOGOS[th]||PROJECT_LOGOS[th==='dark'?'light':'dark'];chip.innerHTML=src?('<img src="'+src+'" alt="logo">'):HDR_LOGO;logos.appendChild(chip);});
      wrap.appendChild(logos);
      const roles=ce('div','dg-roles');
      [['--accent','主色 Primary'],['--c-brand2-500','副色 Secondary'],['--ink','文字 Ink'],['--panel','面板 Panel']].forEach(([n,lb])=>{
        const v=val(n);if(!v)return;const r=ce('div','dg-role');const sw=ce('div','dg-role-sw');sw.style.background='var('+n+')';sw.title=n;
        const nm=ce('div','dg-role-nm');nm.textContent=lb;r.append(sw,nm);roles.appendChild(r);});
      wrap.appendChild(roles);s.appendChild(wrap);})();

    /* 2. 色彩（JoiiNi guideline 寫法：類別大標＋說明＋分隔線；Base+Color 圓角色塊＋name＋hex 於下）*/
    (function(){const s=sec('色彩 Color','品牌主色、副色、中性與狀態色');
      const wrap=ce('div','dgc-wrap');
      const cat=(t,d,sws)=>{const c=ce('div','dgc-cat');const ch=ce('div','dgc-cathead');ch.innerHTML=`<span class="dgc-cat-t">${t}</span>`+(d?`<span class="dgc-cat-d">${d}</span>`:'');c.appendChild(ch);
        const row=ce('div','dgc-row');sws.forEach(o=>{const v=val(o.token);if(!v)return;const it=ce('div','dgc-item'+((window.__tokDisabled&&window.__tokDisabled.has(o.token))?' dgc-off':''));
          const chip=ce('div','dgc-chip');const col=ce('div','dgc-color');col.style.background='var('+o.token+')';col.title=o.token;chip.appendChild(col);
          const nm=ce('div','dgc-name');nm.textContent=o.name;const hx=ce('div','dgc-hex');hx.dataset.tok=o.token;hx.textContent=v.toUpperCase();
          it.append(chip,nm,hx);row.appendChild(it);});c.appendChild(row);wrap.appendChild(c);};
      const st9=['100','200','300','400','500','600','700','800','900'];
      cat('Primary 主色','品牌主色，主要視覺代表',st9.map(x=>({name:'Brand '+x,token:'--c-brand-'+x})));
      cat('Secondary 副色','視覺點綴、次要強調',st9.map(x=>({name:'Brand2 '+x,token:'--c-brand2-'+x})));
      cat('Neutral 中性','文字、背景、線段',['0','50','100','200','300','400','500','600','700','800','900'].map(x=>({name:'Neutral '+x,token:'--c-neutral-'+x})));
      cat('Notification 狀態色','狀態、提示之應用色',[{name:'Success',token:'--c-success-500'},{name:'Warning',token:'--c-warning-500'},{name:'Error',token:'--c-error-500'},{name:'Info',token:'--c-info-500'}]);
      cat('Semantic 語意角色','L2 常用語意 token',[{name:'Accent',token:'--accent'},{name:'Ink',token:'--ink'},{name:'Muted',token:'--muted'},{name:'Panel',token:'--panel'},{name:'Line',token:'--line'},{name:'Canvas',token:'--canvas'}]);
      s.appendChild(wrap);})();

    /* 3. 字體（JoiiNi 寫法：字體家族＋字級表＋文字色表）*/
    (function(){const s=sec('字體 Typography','字體家族 · 字級 h1–h12 · 文字色');
      const stack=n=>val(n).split(',').map(x=>x.trim().replace(/^['"]|['"]$/g,'')).filter(Boolean);
      // 3a 字體家族
      const fams=ce('div','dgt-fams');
      const mkFam=(lb,tok)=>{const st=stack(tok);const fv='var('+tok+')';const c=ce('div','dgt-fam');
        c.innerHTML=`<div class="dgt-fam-lb">${lb}</div><div class="dgt-fam-name" style="font-family:${fv}">${st[0]||'—'}</div>`;
        const w=ce('div','dgt-weights');[['400','Regular'],['500','Medium'],['600','Semibold'],['700','Bold']].forEach(([wt,wn])=>{
          const ch=ce('div','dgt-wchip');ch.innerHTML=`<span class="dgt-wg" style="font-family:${fv};font-weight:${wt}">Aa</span><span class="dgt-wn">${wn} ${wt}</span>`;w.appendChild(ch);});
        c.appendChild(w);return c;};
      fams.append(mkFam('Display（標題）','--font-display'),mkFam('Sans（內文／數字）','--font-sans'),mkFam('Mono（程式碼／標籤）','--font-mono'));
      s.appendChild(fams);
      const note=ce('div','dgt-note');note.textContent='字體代替排序：'+stack('--font-sans').slice(0,4).join(' → ');s.appendChild(note);
      // 3b 字級表（device 切換 + 中英切換；優先讀 token 編輯 override、其次讀 TOK_L1 資料）
      const typo=TOK_L1.find(g=>g.kind==='typo')||{sz:{},def:{}};
      const ls2=TOK_L1.find(g=>g.kind==='ls2')||{def:{}};
      const OV=window.__tokOverrides||{}; const OVr=OV.root||{}; const DI={desktop:0,tablet:1,mobile:2};
      const USE={h1:'主視覺大標',h2:'頁面主標題',h3:'區塊標題',h4:'次區塊標題',h5:'小標題',h6:'強調內文',h7:'內文標準',h8:'內文／表單',h9:'次要資訊',h10:'註解／說明',h11:'標籤 Caption',h12:'最小註記'};
      const SAMPLE={zh:'設計系統 標題範例 Aa',en:'Design System Title Aa'};
      const DEVLB={desktop:'電腦',tablet:'平板',mobile:'手機'};
      if(!window.__dgTypoDev)window.__dgTypoDev='desktop'; if(!window.__dgTypoLang)window.__dgTypoLang='zh'; if(!window.__dgTypoFont)window.__dgTypoFont='sans';
      const FF={sans:'var(--font-sans)',mono:'var(--font-mono)'};
      // 控制列
      const ctl=ce('div','dgt-ctl');
      const devTabs=ce('div','dgt-tabs'), langTabs=ce('div','dgt-tabs'), fontTabs=ce('div','dgt-tabs');
      const scaleHost=ce('div','dgt-scale');
      function paintScale(){
        const dev=window.__dgTypoDev, lang=window.__dgTypoLang;
        scaleHost.innerHTML='';
        const head=ce('div','dgt-row dgt-head');head.innerHTML='<span class="dgt-cn">N</span><span class="dgt-cp">預覽</span><span class="dgt-cs">Size · Line · Letter（'+DEVLB[dev]+'·'+(lang==='zh'?'中':'En')+'·'+(window.__dgTypoFont==='mono'?'Mono':'Sans')+'）</span><span class="dgt-cu">應用方式</span>';scaleHost.appendChild(head);
        (typo.rows||['h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','h11','h12']).forEach((lv,i)=>{
          const size=(OV[dev]&&OV[dev]['--fs-'+lv])||(typo.sz[lv]&&typo.sz[lv][DI[dev]])||val('--fs-'+lv);
          if(!size)return;
          const weight=OVr['--fw-'+lv]||(typo.def[lv]&&typo.def[lv][0])||'400';
          const lh=lang==='zh'?(OVr['--lh-'+lv]||(typo.def[lv]&&typo.def[lv][1])):(OVr['--lh-en-'+lv]||(typo.def[lv]&&typo.def[lv][2]));
          const lsp=lang==='zh'?(OVr['--ls-'+lv]||(ls2.def[lv]&&ls2.def[lv][0])):(OVr['--ls-en-'+lv]||(ls2.def[lv]&&ls2.def[lv][1]));
          const row=ce('div','dgt-row');
          const n=ce('span','dgt-cn');n.textContent=String(i+1).padStart(2,'0');
          const p=ce('span','dgt-cp');p.style.fontSize=size;p.style.fontWeight=weight;p.style.fontFamily=FF[window.__dgTypoFont];p.style.lineHeight=lh||'1.2';p.style.letterSpacing=lsp||'0';p.textContent=SAMPLE[lang];
          const sp=ce('span','dgt-cs');sp.innerHTML='Size '+size+'<br>Line '+(lh||'—')+'<br>Letter '+(lsp||'0');
          const u=ce('span','dgt-cu');u.textContent=USE[lv]||'';
          row.append(n,p,sp,u);scaleHost.appendChild(row);});
      }
      const dgSeg=(keys,labels,key,lab)=>sgmEl('soft','s',{live:true,items:labels,active:Math.max(0,keys.indexOf(window[key])),label:lab,onChange:i=>{window[key]=keys[i];paintScale();}}); // PAGES10:v1 library Segmented 原子
      ctl.append(dgSeg(['desktop','tablet','mobile'],['電腦','平板','手機'],'__dgTypoDev','裝置'),dgSeg(['zh','en'],['中','En'],'__dgTypoLang','語系'),dgSeg(['sans','mono'],['一般字體','特殊字體 Mono'],'__dgTypoFont','字體'));
      s.append(ctl,scaleHost);
      paintScale();
      // 3c 文字色表
      const fc=ce('div','dgt-fc');
      const fch=ce('div','dgt-fcrow dgt-head');fch.innerHTML='<span class="dgt-fcs">顏色</span><span class="dgt-fcu">應用方式</span>';fc.appendChild(fch);
      [['--ink','主要文字','標題／主文'],['--muted','次要文字','輔助資訊'],['--faint','更淡文字','註解／placeholder'],['--accent','品牌色','重點提示文字'],['--c-error-500','錯誤','錯誤提示'],['--c-success-500','成功','成功提示']].forEach(([tok,nm,use])=>{
        const v=val(tok);if(!v)return;const row=ce('div','dgt-fcrow');
        const sw=ce('span','dgt-fcs');const b=ce('span','dgt-fcsw');b.style.background=v;const t=ce('span','dgt-fcnm');t.textContent=nm+' · '+v.toUpperCase();sw.append(b,t);
        const u=ce('span','dgt-fcu');u.textContent=use;row.append(sw,u);fc.appendChild(row);});
      s.appendChild(fc);})();

    /* 4. 間距 */
    (function(){const s=sec('間距 Spacing','--sp-0 … --sp-9');
      const list=ce('div','dg-spacing');
      for(let i=0;i<=9;i++){const v=val('--sp-'+i);const row=ce('div','dg-sp-row');
        const lb=ce('div','dg-sp-lb');lb.textContent='sp-'+i+' · '+v;
        const bar=ce('div','dg-sp-bar');bar.style.width=(v==='0px'?'1px':v);row.append(lb,bar);list.appendChild(row);}
      s.appendChild(list);})();

    /* 5. 圓角 */
    (function(){const s=sec('圓角 Radius','--r-*');
      const wrap=ce('div','dg-radii');
      [['--r-none','none'],['--r-xs','xs'],['--r-sm','sm'],['--r-md','md'],['--r-lg','lg'],['--r-xl','xl'],['--r-2xl','2xl'],['--r-3xl','3xl'],['--r-pill','pill']].forEach(([n,lb])=>{
        const v=val(n);if(!v)return;const it=ce('div','dg-radius');const box=ce('div','dg-radius-box');box.style.borderRadius=v;
        const nm=ce('div','dg-role-nm');nm.textContent=lb+' · '+v;it.append(box,nm);wrap.appendChild(it);});
      s.appendChild(wrap);})();

    /* 6. 陰影 */
    (function(){const s=sec('陰影 Elevation','--e-*');
      const wrap=ce('div','dg-elevs');
      [['--e-sm','sm'],['--e-md','md'],['--e-lg','lg'],['--e-xl','xl'],['--e-2xl','2xl']].forEach(([n,lb])=>{
        const v=val(n);if(!v)return;const it=ce('div','dg-elev');const box=ce('div','dg-elev-box');box.style.boxShadow=v;
        const nm=ce('div','dg-role-nm');nm.textContent=lb;it.append(box,nm);wrap.appendChild(it);});
      s.appendChild(wrap);})();

  }

