  /* 專案更新紀錄：讀該專案 library.version.json 的 history（每次網站手動調整 / Figma 同步的紀錄），非母檔版本紀錄 */
  function projectChangelogData(){
    const v=window.__dsProjectData&&window.__dsProjectData.version;
    if(!v||!Array.isArray(v.history)||!v.history.length)return [];
    return v.history.slice().reverse().map(h=>({
      v:'v'+h.v, date:(h.at||'').slice(0,10),
      src:h.source==='figma'?'figma':'manual',
      title:h.source==='figma'?'從 Figma 同步':'網站手動調整',
      items:(h.changes||[]).map(c=>({t:c})) // 無 tag → 純點列
    }));
  }
  function renderChangelog(view){
    const isProj=!!window.__dsProject;
    const TAG={add:['新增','cl-add'],improve:['優化','cl-improve'],fix:['修正','cl-fix']};
    const data=isProj?projectChangelogData():CHANGELOG_DATA;
    const eyebrow=isProj?'Changelog · 更新紀錄':'Release Notes · 版本紀錄';
    const h1=isProj?'更新紀錄':'版本紀錄';
    const lede=isProj
      ?'這個專案元件庫的每次調整——手動改 token／元件，或從 Figma 同步回來的內容，最新在最上面。'
      :'這個元件庫的每次版本更新內容，最新在最上面，各筆標上<b>版本</b>與<b>發布日期</b>。';
    let h='<div class="sum-top"><div class="sum-head"><p class="eyebrow">'+eyebrow+'</p><h1>'+h1+'</h1></div></div>'
      +'<p class="lede">'+lede+'</p><div class="head-rule"></div>';
    if(!data.length){ h+='<p class="sub" style="padding:var(--sp-6) 0;">目前還沒有任何調整紀錄。在 Design Token 調值或勾選元件、按右上「儲存並更新」，或從 Figma 同步後，就會記錄在這裡。</p>'; view.innerHTML=h; return; }
    h+='<div class="cl-tl">';
    data.forEach((r,i)=>{
      const open=i===0; // 預設只展開最新（第一筆），其餘收合
      h+='<section class="cl-entry'+(open?'':' collapsed')+'"><div class="cl-meta"><span class="cl-ver">'+r.v+'</span><time class="cl-date">'+r.date+'</time>'
        +(r.src?'<span class="cl-src cl-src-'+r.src+'">'+(r.src==='figma'?'Figma':'手動')+'</span>':'')+'</div>'
        +'<div class="cl-body"><button class="cl-head" type="button" aria-expanded="'+(open?'true':'false')+'"><h2 class="cl-title">'+r.title+'</h2><span class="cl-toggle"><span class="cl-tg-plus">'+ICON_PLUS+'</span><span class="cl-tg-minus">'+ICON_MINUS+'</span></span></button><div class="cl-anim"><ul class="cl-list">';
      r.items.forEach(it=>{
        if(it.tag){const t=TAG[it.tag]||TAG.add;h+='<li><span class="cl-tag '+t[1]+'">'+t[0]+'</span><span class="cl-txt">'+it.t+'</span></li>';}
        else{h+='<li><span class="cl-dot"></span><span class="cl-txt">'+it.t+'</span></li>';}
      });
      h+='</ul></div></div></section>';
    });
    h+='</div>';
    view.innerHTML=h;
    view.querySelectorAll('.cl-head').forEach(btn=>btn.onclick=()=>{const e=btn.closest('.cl-entry');const c=e.classList.toggle('collapsed');btn.setAttribute('aria-expanded',String(!c));}); // 點標題列展開/收合
  }
