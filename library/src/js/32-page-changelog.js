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

  /* ── 上手指南 教學頁（Batch B）：圖文搭配、schematic 插圖、深淺色自動跟隨 ── */
  function renderGuide(view){
    view.innerHTML = `
      <div class="gd-guide show-rich" id="gdGuide">
      <section class="gd-hero" id="gdHero">
        <div class="gd-hero-bg"></div>
        <div class="gd-hero-shader" id="gdHeroShader" aria-hidden="true"></div>
        <div class="gd-hero-shfade" aria-hidden="true"></div>
        <div class="gd-hero-scrim" aria-hidden="true"></div>
        <div class="gd-hero-grid" id="gdHeroGrid"></div>
        <div class="gd-hero-copy">
          <p class="eyebrow">上手指南 · Getting Started</p>
          <h1>Cool-DS-Library</h1>
          <p class="gd-hero-lede">CDL 設計系統的單一事實來源。選定元件、校準 Design Token、預覽整體視覺，一鍵雙向同步至工程與 Figma——讓每一次交付都精準、一致、可追溯。</p>
          <div class="gd-hero-cta" id="gdHeroCta"></div>
        </div>
        <div class="gd-hero-mock">
          <div class="gd-devices">
            <div class="gd-carousel" id="gdCarousel">
              <div class="gd-caro-stage" id="gdCaroStage"></div>
            </div>
          </div>
          <div class="gd-mocktoggle" id="gdMockToggle" role="group" aria-label="mockup 深淺配色">
            <button class="gd-mt-seg on" data-mock="dark" type="button">深色模式</button>
            <button class="gd-mt-seg" data-mock="light" type="button">淺色模式</button>
          </div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">01</span><h2 class="gd-sec-t">流程總覽</h2></div>
        <p class="gd-flow-desc">這是一套「<b>設計系統即工作流</b>」的框架——把設計系統的治理規範、元件庫網站、Figma 雙向同步整合成<b>同一個 GitHub repo</b>：同事只要把網址丟給 Claude Code，就能照著跑一個新專案。整條線從品牌訪談、token／元件提案，到<b>在這個網站選取定案</b>，再產出程式碼、寫進 Figma、兩邊同步。你（設計師）主要負責下面標記「你在這」的<b>第 3 步</b>，前後由 Claude 接手。</p>
        <div class="gd-stepcards">
          <div class="gd-card gd-scard"><div class="gd-scard-ic"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="12.5" r="7" stroke="currentColor" stroke-width="0.6"/><circle cx="17.5" cy="7" r="2.6" fill="var(--accent2)"/></svg></div><div class="gd-card-ic">01</div><h3>品牌訪談</h3><p>Claude 先跟你聊品牌、產品與使用情境，抓出設計方向。</p></div>
          <div class="gd-card gd-scard"><div class="gd-scard-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5l7.4 4.25v8.5L12 20.5l-7.4-4.25v-8.5z" stroke="currentColor" stroke-width="0.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.7" fill="var(--accent2)"/></svg></div><div class="gd-card-ic">02</div><h3>Claude 給提案</h3><p>依訪談判定 token 值、從元件庫篩出建議元件，產出提案。</p></div>
          <div class="gd-card gd-scard now"><div class="gd-scard-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4.5 8V4.5H8M20 8V4.5h-3.5M4.5 16v3.5H8M20 16v3.5h-3.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round"/><rect x="9" y="9" width="6" height="6" rx="1.2" fill="var(--accent2)"/></svg></div><div class="gd-card-ic">03</div><h3>網站選取</h3><p>在這個網站挑元件、調 token、選每顆要的狀態樣式定案。</p></div>
          <div class="gd-card gd-scard"><div class="gd-scard-ic"><svg viewBox="0 0 24 24" fill="none"><rect x="4.5" y="4.5" width="15" height="4" rx="1.2" fill="var(--accent2)"/><rect x="4.5" y="10.5" width="15" height="4" rx="1.2" stroke="currentColor" stroke-width="0.6"/><path d="M12 16.5V20m0 0l-2.2-2.2M12 20l2.2-2.2" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="gd-card-ic">04</div><h3>匯出設定檔</h3><p>把定案的 token 值與元件清單匯出成設定檔。</p></div>
          <div class="gd-card gd-scard"><div class="gd-scard-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M8.5 6.5l-4.5 5.5 4.5 5.5M15.5 6.5l4.5 5.5-4.5 5.5" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.4" fill="var(--accent2)"/></svg></div><div class="gd-card-ic">05</div><h3>產出程式碼</h3><p>Claude 依設定檔，從元件庫建出對應的程式碼元件。</p></div>
          <div class="gd-card gd-scard"><div class="gd-scard-ic"><svg viewBox="0 0 24 24" fill="none"><rect x="4.5" y="4.5" width="6.4" height="6.4" rx="1.2" fill="var(--accent2)"/><rect x="13.1" y="4.5" width="6.4" height="6.4" rx="1.2" stroke="currentColor" stroke-width="0.6"/><rect x="4.5" y="13.1" width="6.4" height="6.4" rx="1.2" stroke="currentColor" stroke-width="0.6"/><rect x="13.1" y="13.1" width="6.4" height="6.4" rx="1.2" stroke="currentColor" stroke-width="0.6"/></svg></div><div class="gd-card-ic">06</div><h3>寫進 Figma</h3><p>把 token 與元件同步建進 Figma 設計檔。</p></div>
          <div class="gd-card gd-scard"><div class="gd-scard-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M5.5 10.5a6.5 6.5 0 0 1 11-3.2M18.5 13.5a6.5 6.5 0 0 1-11 3.2" stroke="currentColor" stroke-width="0.6" stroke-linecap="round"/><path d="M16.5 3.8v3.8h-3.8M7.5 20.2v-3.8h3.8" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18.6" cy="7.2" r="1.9" fill="var(--accent2)"/></svg></div><div class="gd-card-ic">07</div><h3>雙向同步</h3><p>之後 code 或 Figma 任一邊改動，跑腳本把差異對齊。</p></div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">02</span><h2 class="gd-sec-t">畫面地圖</h2></div>
        <div class="gd-grid">
          <div class="gd-fig">
            <div class="gd-figv gd-figv-simple">
            <div class="gd-shell">
              <div class="gd-shell-top"><span>☰</span><span>cdl</span><span class="gd-anno">① 上方列</span></div>
              <div class="gd-shell-body">
                <div class="gd-shell-side"><span class="gd-anno">② 側欄</span><div class="gd-shell-line" style="width:80%"></div><div class="gd-shell-line" style="width:64%"></div><div class="gd-shell-line" style="width:72%"></div></div>
                <div class="gd-shell-main"><span class="gd-anno">③ 主區</span></div>
              </div>
            </div>
            </div>
            <div class="gd-figv gd-figv-rich" id="gdRich02"></div>
          </div>
          <div class="gd-txt"><ul>
            <li><b>① 上方列</b>：漢堡（收合側欄）、品牌 logo、深淺色切換、右側是專案版本與「儲存並更新」。</li>
            <li><b>② 側欄</b>：最上面三個置頂頁（下一段講），下面是所有元件依分類排列。</li>
            <li><b>③ 主區</b>：點什麼就在這看什麼——元件規格、token 編輯、指南預覽。</li>
          </ul></div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">03</span><h2 class="gd-sec-t">核心頁面</h2></div>
        <div class="gd-cards">
          <div class="gd-card gd-navcard" data-nav="tokens" role="link" tabindex="0"><span class="gd-navcard-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></span><div class="gd-card-ic">TOKEN</div><h3>Design Token</h3><p>改顏色、字級、圓角、間距的地方。改了整站<b>即時套用</b>，可隨時 reset。</p><div class="gd-navcard-mock" data-mock="token"></div></div>
          <div class="gd-card gd-navcard" data-nav="guideline" role="link" tabindex="0"><span class="gd-navcard-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></span><div class="gd-card-ic">GUIDELINE</div><h3>Design Guideline</h3><p>把「目前 token ＋ 選定元件」的整體效果攤成一頁。<b>交付前最後確認</b>看這裡。</p><div class="gd-navcard-mock" data-mock="guideline"></div></div>
          <div class="gd-card gd-navcard" data-nav="summary" role="link" tabindex="0"><span class="gd-navcard-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></span><div class="gd-card-ic">SELECT</div><h3>選擇元件</h3><p>勾這個專案<b>要哪些元件</b>、每顆要哪些狀態樣式。交付清單從這來。</p><div class="gd-navcard-mock" data-mock="summary"></div></div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">04</span><h2 class="gd-sec-t">元件架構</h2></div>
        <div class="gd-grid rev">
          <div class="gd-fig">
            <div class="gd-figv gd-figv-simple">
            <div class="gd-chiprow"><span class="gd-chip on">實心</span><span class="gd-chip on">外框</span><span class="gd-chip on">柔色</span><span class="gd-chip on">主要</span><span class="gd-chip on">次要</span><span class="gd-chip on">危險</span></div>
            <div class="gd-specmx" id="gdSpecMx"></div>
            <span class="gd-anno gd-anno-blk">↑ 篩選器控制下面矩陣要顯示哪些變化</span>
            </div>
            <div class="gd-figv gd-figv-rich" id="gdRich04"></div>
          </div>
          <div class="gd-txt">
            <ul>
              <li>每顆元件頁都攤開它<b>完整的複雜度</b>：一個<b>規格矩陣</b>把所有變化列出來。</li>
              <li>下面的 <b>變數與 Token</b> 段：左邊<b>變數篩選器</b>＝這顆的「軸」（風格 / 意圖 / 狀態 / 尺寸），勾掉不要的，矩陣與變體數即時縮減。</li>
              <li>同一段還有 <b>Token 綁定</b>：把這顆元件的<b>圓角 / 間距 / 字級</b>換綁成同類別的其他 token（例：padding 從 <code>--sp-3</code> 換 <code>--sp-4</code>）。只影響<b>這個專案的這顆元件</b>、不動共用母庫。</li>
              <li>緊接著是 <b>互動預覽與程式碼</b>：左邊調參數（風格 / 尺寸 / 內容，甚至直接改文字），中間即時預覽（可滑鼠 hover、按下去試），右邊<b>同步顯示對應程式碼</b>、一鍵複製給工程師。排列方式（<b>水平 / 垂直</b>）可到 <b>偏好設定</b> 頁切換。</li>
            </ul>
            <div class="gd-note">心法：指著任何一格，決定「這個專案要不要保留」。</div>
          </div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">05</span><h2 class="gd-sec-t">數值編輯</h2></div>
        <div class="gd-grid">
          <div class="gd-fig">
            <div class="gd-figv gd-figv-simple">
            <div class="gd-tokrow"><span class="gd-tok-sw" style="background:var(--accent)"></span><span class="gd-tok-nm">--c-brand-500</span><span class="gd-tok-field">#1C1C20</span></div>
            <div class="gd-tokrow"><span class="gd-tok-sw" style="background:var(--c-brand2-500)"></span><span class="gd-tok-nm">--c-brand2-500</span><span class="gd-tok-field">#EA580C</span></div>
            <div class="gd-tokrow"><span class="gd-tok-nm">--r-md 圓角</span><span class="gd-tok-field">8px</span></div>
            <span class="gd-anno gd-anno-blk">改欄位 → 整站即時變</span>
            </div>
            <div class="gd-figv gd-figv-rich" id="gdRich05"></div>
          </div>
          <div class="gd-txt"><ul>
            <li>進 <b>Design Token</b>，L1（基礎色階、字級…）與 L2（語意角色）都能直接改值。</li>
            <li>改了<b>不用存也會即時套用</b>到整站所有元件——馬上看得到效果。</li>
            <li>改壞了？右上有 <b>reset</b> 一鍵還原。</li>
            <li>用不到的值可以按<b>「停用部分數值」</b>標記起來——停用的不會匯出，Design Guideline 也會跟著淡掉。</li>
          </ul></div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">06</span><h2 class="gd-sec-t">需求偏好</h2></div>
        <div class="gd-grid rev">
          <div class="gd-fig">
            <div class="gd-figv gd-figv-simple">
            <div class="gd-chiprow"><span class="gd-chip on">✓ Button</span><span class="gd-chip on">✓ Input</span><span class="gd-chip">Tag</span><span class="gd-chip on">✓ Card</span></div>
            <div class="gd-logos">
              <div class="gd-logobox lp-light">logo 淺</div>
              <div class="gd-logobox lp-dark">logo 深</div>
            </div>
            </div>
            <div class="gd-figv gd-figv-rich" id="gdRich06"></div>
          </div>
          <div class="gd-txt"><ul>
            <li><b>選擇元件</b>頁勾要的元件；每顆展開能選要哪些狀態 / 樣式（軸）。AI 建議會幫你預勾。</li>
            <li><b>Logo</b>：側欄 Basic → Logo，上傳淺色 / 深色兩版，網站與 header／footer 三處同步替換。</li>
            <li><b>深淺色</b>：上方列的圓鈕一鍵切換，隨時檢查兩種主題。</li>
          </ul></div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">07</span><h2 class="gd-sec-t">版本存檔</h2></div>
        <div class="gd-grid">
          <div class="gd-fig">
            <div class="gd-figv gd-figv-simple">
            <div class="gd-dlgm">
              <div class="gd-dlgm-h">儲存並更新此元件庫<small>v1 → v2 · 2 項變更</small></div>
              <div class="gd-dlgm-b"><span class="gd-chg">token --r-md：8px → 12px</span><span class="gd-chg">元件 input</span></div>
              <div class="gd-dlgm-f" id="gdDlgFoot"></div>
            </div>
            </div>
            <div class="gd-figv gd-figv-rich" id="gdRich07"></div>
          </div>
          <div class="gd-txt"><ul>
            <li>調完按右上<b>「儲存並更新 · v&lt;N&gt;」</b>，會先跳確認框<b>列出你改了哪些</b>、確認才寫檔，版本 +1。</li>
            <li>這只動<b>這個專案的元件庫</b>，不會碰到共用母庫——隨手改不怕污染。</li>
            <li>之後若 Figma 那邊同步了新版本，你一進站會跳<b>「版本已更新」</b>說明。</li>
          </ul></div>
        </div>
      </section>

      <section class="gd-sec">
        <div class="gd-sec-h"><span class="gd-sec-n">08</span><h2 class="gd-sec-t">常見問題</h2></div>
        <div class="gd-faq" id="gdFaq">
          <div class="gd-faq-item collapsed"><button class="gd-faq-q" type="button">我在這裡改東西，會不會動到共用母庫？<span class="gd-faq-caret"></span></button><div class="gd-faq-a">不會。你的調整只存進「這個專案」；共用母庫（給所有專案用的母盤）只有人工升級才會變。</div></div>
          <div class="gd-faq-item collapsed"><button class="gd-faq-q" type="button">存的東西跑去哪了？<span class="gd-faq-caret"></span></button><div class="gd-faq-a">寫進專案資料夾 projects/&lt;專案名&gt;/。Claude 之後會拿這些檔去建 code 和 Figma。</div></div>
          <div class="gd-faq-item collapsed"><button class="gd-faq-q" type="button">每顆元件可以單獨換綁 token 嗎？<span class="gd-faq-caret"></span></button><div class="gd-faq-a">可以。每顆元件頁下方的「變數與 Token」段有 <b>Token 綁定</b>：能把這顆元件的<b>圓角 / 間距 / 字級</b>換綁成同類別的其他 token（例：padding 從 <code>--sp-3</code> 換 <code>--sp-4</code>）。只影響<b>這個專案的這顆元件</b>，不動共用母庫；母庫頁只做唯讀示意。</div></div>
          <div class="gd-faq-item collapsed"><button class="gd-faq-q" type="button">怎麼改整站的主色 / 副色？<span class="gd-faq-caret"></span></button><div class="gd-faq-a">到 <b>Design Token</b> 頁的「色彩 Color」→ 改 <b>Brand 主色</b>或 <b>Brand 副色</b>的九階色號，整站會<b>即時套用</b>。主色＝主要動作（按鈕、選中）；副色＝點綴與次要強調。改壞了用 reset 一鍵還原。</div></div>
          <div class="gd-faq-item collapsed"><button class="gd-faq-q" type="button">操作小技巧<span class="gd-faq-caret"></span></button><div class="gd-faq-a">側欄邊緣可拖曳調寬、雙擊還原；深淺色隨時切換檢查（首屏 mockup 會自動反轉配色）；改壞的 token 用 reset 一鍵還原。首屏小彩蛋：滑鼠<b>滑過背景</b>會透出網格、<b>移到 mockup 上</b>游標會變成「在 GitHub 查看完整流程」按鈕；<b>手機</b>把頁面拉到頂再下拉可<b>重新整理</b>。</div></div>
        </div>
      </section>
      </div>
    `;
    // spec 矩陣示意：用真 library 按鈕原子（風格 × 意圖），比空色塊具體
    const mx=view.querySelector('#gdSpecMx');
    if(mx){[['solid','實心'],['outline','外框'],['soft','柔色']].forEach(([v,zh])=>{
      const row=ce('div','gd-mxrow');const lb=ce('span','gd-mxlb');lb.textContent=zh;row.appendChild(lb);
      ['primary','secondary','danger'].forEach(intent=>row.appendChild(mkBtn({variant:v,intent,size:'s'})));
      mx.appendChild(row);});}
    // 存檔彈窗示意的兩顆按鈕：用真 library 原子（示意、非互動）
    const foot=view.querySelector('#gdDlgFoot');
    if(foot){const c=mkBtn({variant:'outline',intent:'secondary',size:'s'});c.querySelector('span').textContent='取消';const k=mkBtn({variant:'solid',intent:'primary',size:'s'});k.querySelector('span').textContent='確定更新';foot.append(c,k);}
    // section 07 → GitHub 原始碼導連：用 library 按鈕原子（mkBtn），非手刻樣式；另開新分頁
    // mockup 內容＝豐富版 GitHub repo 頁（JS 建構，避免 11 列檔案重複 SVG）；octicon 路徑：
    const O={
      mark:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
      repo:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>',
      folder:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"/></svg>',
      file:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"/></svg>',
      star:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>',
      code:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06Zm6.56 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L13.94 8l-3.72-3.72a.75.75 0 0 1 0-1.06Z"/></svg>',
      branch:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Z"/></svg>',
      fork:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>',
      eye:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2Zm0 1.5c-1.51 0-2.879.755-3.983 1.704C2.89 6.256 2.079 7.372 1.682 8c.397.628 1.208 1.744 2.335 2.796C5.121 11.745 6.49 12.5 8 12.5s2.879-.755 3.983-1.704C13.11 9.744 13.921 8.628 14.318 8c-.397-.628-1.208-1.744-2.335-2.796C10.879 4.255 9.51 3.5 8 3.5ZM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>',
      book:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 2.75A.75.75 0 0 1 .75 2h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 2h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 14H.75a.75.75 0 0 1-.75-.75ZM7.25 4.996c-.38-.899-1.27-1.496-2.247-1.496H1.5v9h3.757a3.75 3.75 0 0 1 1.993.575ZM8.75 12.575A3.75 3.75 0 0 1 10.743 12H14.5V3.5h-3.503c-.977 0-1.867.597-2.247 1.496Z"/></svg>',
      search:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>',
      link:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 2 2 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a2 2 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 2 2 0 0 0-2.83 0l-2.5 2.5a2 2 0 0 0 0 2.83Z"/></svg>',
      tag:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>',
      pulse:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 2c.306 0 .582.187.696.471L10 10.731l1.304-3.26A.751.751 0 0 1 12 7h3.25a.75.75 0 0 1 0 1.5h-2.742l-1.812 4.528a.751.751 0 0 1-1.392 0L6 4.77 4.696 8.03A.75.75 0 0 1 4 8.5H.75a.75.75 0 0 1 0-1.5h2.742l1.812-4.529A.751.751 0 0 1 6 2Z"/></svg>',
      globe:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.315-.383.602-.789.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.352.552.715 1.192 1.437 2.874 1.581 4.948Z"/></svg>'
    };
    const FILES=[
      ['folder','framework','Phase E：sync 雙向同步落地','5 days ago'],
      ['folder','library','上手指南 mockup：v1／v2 雙版切換＋主題反轉','1 hour ago'],
      ['folder','projects','元件庫多項功能：字級 12 階、停用清單、專案 icon、token…','2 days ago'],
      ['folder','skills/ds-studio-flow','Phase F：專案元件庫版本化（CTA 防呆彈窗＋進站版本提示…','5 days ago'],
      ['folder','sync','元件庫多項功能：字級 12 階、停用清單、專案 icon、token…','2 days ago'],
      ['file','.gitignore','修 vercel root rewrite（cleanUrls 下指到無副檔名版）＋收 v…','5 days ago'],
      ['file','CHANGELOG.md','docs：CHANGELOG 補 Batch A/B（topbar 微調＋上手指南…','5 days ago'],
      ['file','CLAUDE.md','Phase A+B：搭 ds-studio 骨架、快照三塊、建 library-first…','5 days ago'],
      ['file','QUICKSTART.md','新增新手上手教學 QUICKSTART.md（以舊框架 quickstart…','yesterday'],
      ['file','README.md','README 補指向 QUICKSTART、線上展示網址、填實 clone…','yesterday'],
      ['file','vercel.json','修 vercel root rewrite（cleanUrls 下指到無副檔名版）＋收 v…','5 days ago']
    ];
    const fileRows=FILES.map(([ic,nm,msg,t])=>
      '<div class="gd-gh-file"><span class="gd-gh-fico'+(ic==='folder'?' gd-gh-folder':'')+'">'+O[ic]+'</span><span class="gd-gh-fn">'+nm+'</span><span class="gd-gh-fmsg">'+msg+'</span><span class="gd-gh-ft">'+t+'</span></div>').join('');
    const ghHTML=
      '<div class="gd-gh-bar"><span class="gd-gh-dot" style="background:#FF5F57"></span><span class="gd-gh-dot" style="background:#FEBC2E"></span><span class="gd-gh-dot" style="background:#28C840"></span><span class="gd-gh-url"><span class="gd-gh-lock">🔒</span>github.com/edward890131/cool-ds-library</span></div>'
      +'<div class="gd-gh-topnav"><span class="gd-gh-tn-l"><span class="gd-gh-burger">☰</span><span class="gd-gh-mark">'+O.mark+'</span><span class="gd-gh-crumb"><b>edward890131</b> / <b>cool-ds-library</b></span></span><span class="gd-gh-tn-r"><span class="gd-gh-searchbox">Type <kbd>/</kbd> to search</span><span class="gd-gh-tn-plus">+</span><span class="gd-gh-avatar"></span></span></div>'
      +'<div class="gd-gh-tabs"><span class="gd-gh-tab on">'+O.code+'Code</span><span class="gd-gh-tab">Issues</span><span class="gd-gh-tab">Pull requests</span><span class="gd-gh-tab">Actions</span><span class="gd-gh-tab">Projects</span><span class="gd-gh-tab">Wiki</span><span class="gd-gh-tab">Insights</span><span class="gd-gh-tab">Settings</span></div>'
      +'<div class="gd-gh-cols"><div class="gd-gh-main">'
        +'<div class="gd-gh-head"><div class="gd-gh-repo"><span class="gd-gh-repoic">'+O.repo+'</span><b class="gd-gh-name">cool-ds-library</b><span class="gd-gh-badge">Public</span></div><div class="gd-gh-actions"><span class="gd-gh-abtn">'+O.eye+'Watch <b>0</b></span><span class="gd-gh-abtn">'+O.fork+'Fork <b>0</b></span><span class="gd-gh-abtn">'+O.star+'Star <b>0</b></span></div></div>'
        +'<div class="gd-gh-toolbar"><span class="gd-gh-branchbtn">'+O.branch+'main</span><span class="gd-gh-tbmeta">'+O.branch+'1 Branch</span><span class="gd-gh-tbmeta">0 Tags</span><span class="gd-gh-spacer"></span><span class="gd-gh-gotofile">Go to file</span><span class="gd-gh-addfile">Add file</span><span class="gd-gh-codebtn">'+O.code+'Code</span></div>'
        +'<div class="gd-gh-commitrow"><span class="gd-gh-cavatar"></span><span class="gd-gh-cauth"><b>edward890131</b> and <b>claude</b></span><span class="gd-gh-cmsg">上手指南 mockup 精修</span><span class="gd-gh-chash">941df1a</span><span class="gd-gh-ctime">now</span><span class="gd-gh-ccount">'+O.branch.replace(/<svg/,'<svg class="gd-gh-histic"')+'39 commits</span></div>'
        +'<div class="gd-gh-files">'+fileRows+'</div>'
        +'<div class="gd-gh-readme"><div class="gd-gh-readme-h">'+O.book+'README</div><div class="gd-gh-readme-t">CDL Studio</div></div>'
      +'</div><div class="gd-gh-side">'
        +'<div class="gd-gh-side-h">About</div><p class="gd-gh-side-desc">cool-des-library — 設計系統元件庫網站＋框架＋Figma 雙向同步</p>'
        +'<div class="gd-gh-side-link">🔗 cool-ds-library.vercel.app</div>'
        +'<div class="gd-gh-side-stats"><span>'+O.star+'<b>0</b> stars</span><span>'+O.eye+'<b>0</b> watching</span><span>'+O.fork+'<b>0</b> forks</span></div>'
        +'<div class="gd-gh-side-h2">Releases</div><p class="gd-gh-side-sub">No releases published</p>'
        +'<div class="gd-gh-side-h2">Deployments <span class="gd-gh-badge">13</span></div>'
      +'</div></div>';
    // 手機版 frame 內容：GitHub 手機網頁單欄版型（沿用舊 .gd-ghm-* 樣式，去掉手機狀態列、前置瀏覽器列與桌機一致；CSS 在 ≤767px 才顯示 .gd-ghm、隱藏 .gd-gh）
    const mFileRows=FILES.map(function(x){var ic=x[0],nm=x[1],t=x[3];return '<div class="gd-ghm-file"><span class="gd-ghm-fico'+(ic==='folder'?' gd-gh-folder':'')+'">'+O[ic]+'</span><span class="gd-ghm-fn">'+nm+'</span><span class="gd-ghm-ft">'+t+'</span></div>';}).join('');
    const ghmHTML=
      '<div class="gd-gh-bar"><span class="gd-gh-dot" style="background:#FF5F57"></span><span class="gd-gh-dot" style="background:#FEBC2E"></span><span class="gd-gh-dot" style="background:#28C840"></span><span class="gd-gh-url"><span class="gd-gh-lock">🔒</span>github.com/edward890131/cool-ds-library</span></div>'
      +'<div class="gd-ghm-top"><span class="gd-ghm-burger">☰</span><span class="gd-ghm-mark">'+O.mark+'</span><span class="gd-ghm-crumb">⋯ / <b>cool-ds-library</b> ▾</span><span class="gd-ghm-top-r"><span class="gd-ghm-search">'+O.search+'</span><span class="gd-ghm-avatar"></span></span></div>'
      +'<div class="gd-ghm-tabs"><span class="gd-ghm-tab on">Code</span><span class="gd-ghm-tab">Issues</span><span class="gd-ghm-tab">Pull requests</span><span class="gd-ghm-more">More ▾</span></div>'
      +'<div class="gd-ghm-body">'
        +'<div class="gd-ghm-actions"><span class="gd-ghm-abtn">'+O.eye+'Watch <b>0</b> <span class="gd-ghm-cv">▾</span></span><span class="gd-ghm-abtn">'+O.fork+'<span class="gd-ghm-cv">▾</span></span><span class="gd-ghm-abtn">'+O.star+'<span class="gd-ghm-cv">▾</span></span></div>'
        +'<p class="gd-ghm-desc">cool-des-library — 設計系統元件庫網站＋框架＋Figma 雙向同步</p>'
        +'<div class="gd-ghm-link">'+O.link+'cool-ds-library.vercel.app</div>'
        +'<div class="gd-ghm-stats"><span>'+O.star+'<b>0</b> stars</span><span>'+O.fork+'<b>0</b> forks</span><span>'+O.eye+'<b>0</b> watching</span><span>'+O.branch+'<b>1</b> Branch</span><span>'+O.tag+'<b>0</b> Tags</span><span>'+O.pulse+'Activity</span></div>'
        +'<div class="gd-ghm-public">'+O.globe+'Public repository</div>'
        +'<div class="gd-ghm-divider"></div>'
        +'<div class="gd-ghm-toolbar"><span class="gd-ghm-branchbtn">'+O.branch+'main <span class="gd-ghm-cv">▾</span></span><span class="gd-ghm-spacer"></span><span class="gd-ghm-codebtn">'+O.code+'Code <span class="gd-ghm-cv">▾</span></span><span class="gd-ghm-dots">⋯</span></div>'
        +'<div class="gd-ghm-commit"><span class="gd-ghm-cav"></span><span class="gd-ghm-cauth"><b>edward890131</b> and <b>claude</b></span><span class="gd-ghm-ctime">1 hour ago</span></div>'
        +'<div class="gd-ghm-files">'+mFileRows+'</div>'
      +'</div>';
    // ── 另兩張輪播 mockup：高還原「我們網站」的 Design Token 頁與需求匯總頁（1040 native，隨 gh 深淺變數）──
    const hmBar=(u)=>'<div class="gd-gh-bar"><span class="gd-gh-dot" style="background:#FF5F57"></span><span class="gd-gh-dot" style="background:#FEBC2E"></span><span class="gd-gh-dot" style="background:#28C840"></span><span class="gd-gh-url"><span class="gd-gh-lock">🔒</span>'+u+'</span></div>';
    const hmTop='<div class="hm-top"><span class="hm-burger">☰</span><span class="hm-brand">cdl</span><span class="hm-brandsub">cool-ds-library</span><span class="hm-divider"></span><span class="hm-pill">📖 上手指南</span><span class="hm-sp"></span><span class="hm-tbtn">'+O.mark+'Github</span><span class="hm-tbtn solid">開啟新專案</span></div>'; // 深淺色 toggle 已移到偏好設定頁，topbar 不再有
    const hmSide=(act)=>'<div class="hm-side">' // 對齊現行側欄：無上手指南（在 topbar）、末端加偏好設定
      +'<div class="hm-nav'+(act==='tokens'?' on':'')+'">'+navIc('palette')+'Design Token</div>'
      +'<div class="hm-sep"></div><div class="hm-nav'+(act==='guideline'?' on':'')+'">'+navIc('ruler')+'Design Guideline</div>'
      +'<div class="hm-sep"></div><div class="hm-nav'+(act==='summary'?' on':'')+'">'+navIc('clipboard-text')+'選擇元件</div>'
      +'<div class="hm-navg">🧱 Basic 基本<span class="n">18</span><span class="cv">›</span></div>'
      +'<div class="hm-navg">🍀 Complex 複雜<span class="n">12</span><span class="cv">›</span></div>'
      +'<div class="hm-navg">🗂 Card 卡片<span class="n">4</span><span class="cv">›</span></div>'
      +'<div class="hm-navg">📊 Table & Chart 表格圖表<span class="n">5</span><span class="cv">›</span></div>'
      +'<div class="hm-sep"></div><div class="hm-nav'+(act==='changelog'?' on':'')+'">'+navIc('clock-counter-clockwise')+'版本紀錄</div>'
      +'<div class="hm-sep"></div><div class="hm-nav'+(act==='settings'?' on':'')+'">'+navIc('gear-six')+'偏好設定</div></div>';
    const CK2='<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0L3.22 8.28a.75.75 0 0 1 1.06-1.06L7 9.94l5.72-5.72a.75.75 0 0 1 1.06 0Z"/></svg>';
    const tokRow=(nm,hex,lab)=>'<div class="hm-tokrow"><span class="hm-tokname">'+nm+(lab?'<span class="lab">'+lab+'</span>':'')+'</span><span class="hm-toksw" style="background:'+hex+'"></span><span class="hm-tokhex">'+hex+'</span></div>';
    const NEU=[['--c-neutral-0','#FFFFFF'],['--c-neutral-50','#FAFAFA'],['--c-neutral-100','#F4F5F7'],['--c-neutral-200','#ECEEF2'],['--c-neutral-300','#DFE1E7'],['--c-neutral-400','#C9CDD6'],['--c-neutral-500','#9BA0AA']];
    const BRD=[['--c-brand-100','#EDEDEE'],['--c-brand-200','#D1D1D3','dark 亮端'],['--c-brand-300','#A8A8AB'],['--c-brand-400','#5F5F64'],['--c-brand-500','#1C1C20','± 500'],['--c-brand-600','#141417','hover'],['--c-brand-700','#0C0C0E','press']];
    const tokenMain='<div class="hm-main">'
      +'<div class="hm-eyebrow">Foundation · Design Token</div>'
      +'<div class="hm-headrow"><div class="hm-h1">Design Token</div><span class="hm-copybtn">複製此頁 CSS</span></div>'
      +'<p class="hm-lede">依 <b>DS Framework L1 Primitive → L2 Semantic</b> 架構、以 <b>v0 視覺</b> 為種子的預設 token。L1 純值來源、L2 角色組合（含 light/dark）、框架索引是唯讀對照。</p>'
      +'<div class="hm-tablead"><span class="hm-tab on">L1 Primitive</span><span class="hm-tab">L2 Semantic</span><span class="hm-tab">框架索引</span><span class="hm-reset">重設</span><span class="hm-leadnote">即時預覽 · 不自動儲存</span></div>'
      +'<div class="hm-sec-t">色彩 Color</div><div class="hm-sec-d">品牌、中性與狀態色階</div><div class="hm-rule strong"></div>'
      +'<div class="hm-tokgrid"><div class="hm-tokgroup"><div class="hm-tokgh">Neutral 中性色階</div>'+NEU.map(r=>tokRow(r[0],r[1],r[2])).join('')+'</div>'
      +'<div class="hm-tokgroup"><div class="hm-tokgh">Brand 主色（9 階）</div>'+BRD.map(r=>tokRow(r[0],r[1],r[2])).join('')+'</div></div></div>';
    const tokenHTML='<div class="hm">'+hmBar('cool-ds-library.vercel.app')+hmTop+'<div class="hm-body">'+hmSide('tokens')+tokenMain+'</div></div>';
    const catCard=(t,n)=>'<div class="hm-catcard"><span class="hm-catt">'+t+'</span><span class="hm-catn">'+n+'</span><span class="hm-catcaret">›</span></div>';
    const summaryMain='<div class="hm-main">'
      +'<div class="hm-eyebrow">Overview · 選擇元件</div>'
      +'<div class="hm-headrow"><div class="hm-h1">選擇元件</div></div>'
      +'<p class="hm-lede">每個元件<b>最後選定的複雜度</b>——先依<b>四大分類</b>展開，再展開牌卡看該元件的<b>實際操作</b>，牌卡前的勾選框決定<b>要不要產出</b>。回各元件用「變數篩選器」調整組合，這裡即時彙整。</p>'
      +'<div class="hm-rule"></div>'
      +'<div class="hm-actions"><span class="hm-aitoggle">✦ AI 建議產出<span class="sw"></span></span><span class="hm-selall"><span class="ck">'+CK2+'</span>全選</span><span class="hm-total">已選 <b>39</b>/39 個元件 · 共 <b>860</b> 個變體將建立</span></div>'
      +catCard('🧱 Basic 基本','18 / 18')+catCard('🍀 Complex 複雜','12 / 12')+catCard('🗂 Card 卡片','4 / 4')+catCard('📊 Table & Chart 表格圖表','5 / 5')+'</div>';
    const summaryHTML='<div class="hm">'+hmBar('cool-ds-library.vercel.app')+hmTop+'<div class="hm-body">'+hmSide('summary')+summaryMain+'</div></div>';
    // Design Guideline 精修 mockup（新做，供 03 核心頁卡片用）：色票分類＋字體示意
    const dgChips=arr=>arr.map(c=>'<span class="hm-dgsw" style="background:'+c+'"></span>').join('');
    const guidelineMain='<div class="hm-main">'
      +'<div class="hm-eyebrow">Review · 出貨前確認</div>'
      +'<div class="hm-headrow"><div class="hm-h1">Design Guideline</div></div>'
      +'<p class="hm-lede">依<b>當前 token 與選定元件</b>組成的設計指南預覽——匯出前的最後確認關。在 Design Token 調值、在選擇元件頁勾要的元件，這頁即時反映。</p>'
      +'<div class="hm-rule"></div>'
      +'<div class="hm-sec-t">品牌 Brand</div><div class="hm-sec-d">logo 與主色角色</div>'
      +'<div class="hm-dgbrand"><div class="hm-dglogos"><span class="hm-dglogo lt">cdl</span><span class="hm-dglogo dk">cdl</span></div>'
      +'<div class="hm-dgroles"><div class="hm-dgrole"><span class="hm-dgrole-sw" style="background:#141417"></span>主色</div><div class="hm-dgrole"><span class="hm-dgrole-sw" style="background:#EA580C"></span>副色</div><div class="hm-dgrole"><span class="hm-dgrole-sw" style="background:#9BA0AA"></span>中性</div></div></div>'
      +'<div class="hm-rule"></div>'
      +'<div class="hm-sec-t">色彩 Color</div><div class="hm-sec-d">品牌主色、中性與狀態色階</div>'
      +'<div class="hm-dgcat"><span class="hm-dgcat-l">Primary</span><div class="hm-dgrow">'+dgChips(BRD.map(r=>r[1]))+'</div></div>'
      +'<div class="hm-dgcat"><span class="hm-dgcat-l">Neutral</span><div class="hm-dgrow">'+dgChips(NEU.map(r=>r[1]))+'</div></div>'
      +'<div class="hm-dgcat"><span class="hm-dgcat-l">Status</span><div class="hm-dgrow">'+dgChips(['#10B981','#F59E0B','#EF4444','#3B82F6'])+'</div></div>'
      +'<div class="hm-rule"></div>'
      +'<div class="hm-sec-t">字體 Typography</div><div class="hm-sec-d">Geist Sans · 中英數一致</div>'
      +'<div class="hm-dgtype"><span style="font-size:28px;font-weight:700">Aa 果思</span><span style="font-size:15px;color:var(--ghmut)">Design Guideline 0123456789</span></div>'
      +'</div>';
    const guidelineHTML='<div class="hm">'+hmBar('cool-ds-library.vercel.app')+hmTop+'<div class="hm-body">'+hmSide('guideline')+guidelineMain+'</div></div>';
    // 首屏 mockup 輪播：3 張＝GitHub repo／Design Token 頁／需求匯總頁；一次只呈現一張、每 5 秒前後輪播（淡切）；
    //   桌機內容固定 1040 native 由 JS 依螢幕寬 scale＝等比縮放（鎖比例不拉扁）；active 卡＝自訂游標＋點擊開對應連結
    // native＝每張桌機內容的設計寬（github 較密設 680，token/summary 頁面設 1040）
    const SLIDE_DATA=[
      {d:ghHTML,m:ghmHTML,url:'https://github.com/edward890131/cool-ds-library',pill:'在 GitHub 查看完整流程',icon:ICON_GITHUB,native:680},
      {d:tokenHTML,m:tokenHTML,url:'https://cool-ds-library.vercel.app/#tokens',pill:'開啟 Design Token 頁',icon:O.link,native:1040},
      {d:guidelineHTML,m:guidelineHTML,url:'https://cool-ds-library.vercel.app/#guideline',pill:'開啟 Design Guideline 頁',icon:O.link,native:1040},
      {d:summaryHTML,m:summaryHTML,url:'https://cool-ds-library.vercel.app/#summary',pill:'開啟選擇元件頁',icon:O.link,native:1040}
    ];
    const stage=view.querySelector('#gdCaroStage');
    if(stage){
      const SLIDES=SLIDE_DATA.length, frames=[];
      SLIDE_DATA.forEach((sd,i)=>{
        const slide=ce('div','gd-caro-slide');
        const frame=ce('div','gd-hero-frame');
        const scr=ce('div','gd-hero-screen');
        const gh=ce('div','gd-gh');gh.innerHTML=sd.d;gh.style.width=sd.native+'px';
        const ghm=ce('div','gd-ghm');ghm.innerHTML=sd.m;
        scr.append(gh,ghm);
        const cur=ce('div','gd-hero-cursor');
        const pill=mkBtn({variant:'solid',intent:'secondary',size:'s',isLive:true});pill.type='button';  // 淺色近白底／深色近黑底
        pill.querySelector('span').textContent=sd.pill;
        pill.insertAdjacentHTML('afterbegin',sd.icon);
        pill.style.pointerEvents='none';
        cur.appendChild(pill);
        const glare=ce('div','gd-hero-glare');   // 3D 傾斜的游標光暈層（螢幕之上、游標之下）
        frame.append(scr,glare,cur);
        slide.appendChild(frame);
        stage.appendChild(slide);
        frames.push({slide,frame,cur,url:sd.url,native:sd.native});
      });
      // 等比縮放：桌機把各張 native 內容 scale 到螢幕寬；手機清除 transform（改走 .gd-ghm 單欄）
      const fitScale=()=>{const mob=window.matchMedia('(max-width:767px)').matches;
        frames.forEach(f=>{const g=f.frame.querySelector('.gd-gh');const s=f.frame.querySelector('.gd-hero-screen');
          if(g&&s)g.style.transform=mob?'':'scale('+(s.clientWidth/f.native)+')';});};
      let active=0;
      // 3D 傾斜：僅桌機（hover 裝置）＋非「減少動態」啟用；游標與傾斜都以外層 slide rect 量測（slide 不變形→傾斜時邊界不抖）
      const canTilt=window.matchMedia('(hover:hover)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches;
      const clamp01=v=>v<0?0:v>1?1:v;
      const resetTilt=f=>{f.frame.classList.remove('is-tilting','is-hover');f.frame.style.setProperty('--tilt-rx','0deg');f.frame.style.setProperty('--tilt-ry','0deg');};
      const setActive=(n)=>{active=((n%SLIDES)+SLIDES)%SLIDES;
        frames.forEach((f,i)=>{f.slide.classList.toggle('is-active',i===active);if(i!==active)resetTilt(f);});};  // 切走的卡回正，避免殘留傾斜
      frames.forEach((f,i)=>{
        f.frame.addEventListener('mouseenter',()=>{if(i===active){f.frame.classList.add('cur-on');if(canTilt)f.frame.classList.add('is-hover');}});
        f.frame.addEventListener('mouseleave',()=>{f.frame.classList.remove('cur-on');if(canTilt)resetTilt(f);});
        f.frame.addEventListener('mousemove',e=>{if(i!==active)return;const r=f.slide.getBoundingClientRect();
          const lx=e.clientX-r.left, ly=e.clientY-r.top;
          f.cur.style.transform='translate('+lx+'px,'+ly+'px) translate(-50%,-50%)';
          if(canTilt){const px=clamp01(lx/r.width), py=clamp01(ly/r.height), MAX=16;   // 傾斜幅度：±8°，大卡上立體感明確又不暈
            f.frame.classList.add('is-tilting');
            f.frame.style.setProperty('--tilt-ry',((px-.5)*MAX).toFixed(2)+'deg');
            f.frame.style.setProperty('--tilt-rx',((.5-py)*MAX).toFixed(2)+'deg');
            f.frame.style.setProperty('--tilt-gx',(px*100).toFixed(1)+'%');
            f.frame.style.setProperty('--tilt-gy',(py*100).toFixed(1)+'%');}
        });
        f.frame.addEventListener('click',()=>{if(i===active)window.open(f.url,'_blank','noopener');});
      });
      // 自動輪播（每 5 秒）：timer 存 window，換頁重跑先清；hover 暫停
      if(window.__caroTimer){clearInterval(window.__caroTimer);window.__caroTimer=null;}
      const startAuto=()=>{window.__caroTimer=viewTimer(setInterval(()=>setActive(active+1),5000));};
      const caro=view.querySelector('#gdCarousel');
      if(caro){caro.addEventListener('mouseenter',()=>{if(window.__caroTimer){clearInterval(window.__caroTimer);window.__caroTimer=null;}});
        caro.addEventListener('mouseleave',()=>{if(!window.__caroTimer)startAuto();});}
      setActive(0);
      fitScale();requestAnimationFrame(fitScale);setTimeout(fitScale,180);
      // ResizeObserver 監看 stage 寬度：側邊欄開關等改變容器寬度（不觸發 window resize）時也重算 scale，避免 mockup 跑版
      if(window.__caroRO)window.__caroRO.disconnect();
      window.__caroRO=new ResizeObserver(()=>fitScale());
      window.__caroRO.observe(stage);
      startAuto();
    }
    // 03 核心頁三張卡片：嵌入對應精修 mockup（token／guideline／summary），等比縮放到卡片寬
    const CARD_MOCK={token:tokenHTML,guideline:guidelineHTML,summary:summaryHTML};
    const cardMocks=[...view.querySelectorAll('.gd-navcard-mock')];
    cardMocks.forEach(box=>{const k=box.dataset.mock;if(CARD_MOCK[k])box.innerHTML='<div class="gd-devices">'+CARD_MOCK[k]+'</div>';}); // 包 .gd-devices 供 --gh* 變數（固定深色）
    const fitCardMocks=()=>{cardMocks.forEach(box=>{const d=box.querySelector('.gd-devices');if(d)d.style.transform='scale('+(box.clientWidth/1040)+')';});};
    fitCardMocks();requestAnimationFrame(fitCardMocks);setTimeout(fitCardMocks,180);
    if(window.__cardMockRO)window.__cardMockRO.disconnect();
    window.__cardMockRO=new ResizeObserver(()=>fitCardMocks());
    cardMocks.forEach(box=>window.__cardMockRO.observe(box));
    // 首屏 mockup 配色 toggle：直接控制深/淺（深色模式＝預設無 class；淺色模式＝加 .gd-dev-light），active 即 mockup 當前配色
    const devs=view.querySelector('.gd-hero-mock .gd-devices');
    { const mt=view.querySelector('#gdMockToggle'); if(mt){ // PAGES10:v1 mockup 深淺切換改用 library Segmented 原子
      const sg=sgmEl('outline','s',{live:true,items:['深色模式','淺色模式'],active:0,label:'mockup 深淺配色',onChange:i=>{if(devs)devs.classList.toggle('gd-dev-light',i===1);}});
      sg.id='gdMockToggle';sg.classList.add('gd-mocktoggle-sgm');mt.replaceWith(sg);} }
    // hero 背景網格互動（cula.tech 風）：radial mask 在游標半徑內透出網格；游標即時跟隨（已移除 lerp 拖尾 delay）
    const gHero=view.querySelector('#gdHero');const gGrid=view.querySelector('#gdHeroGrid');
    if(gHero&&gGrid){
      gHero.addEventListener('mousemove',e=>{const r=gHero.getBoundingClientRect();
        gGrid.style.setProperty('--mx',(e.clientX-r.left).toFixed(1)+'px');
        gGrid.style.setProperty('--my',(e.clientY-r.top).toFixed(1)+'px');});
    }
    // 方案 B：直接掛 ShaderGradient 官方 React 元件（control='query' 讀下方 URL 的全部參數），畫面等同 shadergradient.co 預覽。
    // 純 HTML 頁用 ESM 從 CDN 動態載入官方套件＋peer deps；載入失敗（離線/CDN 掛）自動退回原本靜態漸層並藏 toggle。city 環境反射走官方預設 envBasePath。
    (function initHeroShader(){
      if(window.__sgUnmount){try{window.__sgUnmount();}catch(e){}window.__sgUnmount=null;}   // 換頁重渲染：先卸掉上一份，避免殘留 WebGL context
      const host=view.querySelector('#gdHeroShader');const hero=view.querySelector('#gdHero');
      if(!host||!hero)return;
      // 三色 stop 依模式決定：經典＝原手調珊瑚（固定）；主色／輔助色＝掛載時即時讀「當前 token 主/副錨點色」（改 token 就跟著變）
      const cssVar=(n,f)=>{const v=getComputedStyle(document.documentElement).getPropertyValue(n).trim();return v||f;};
      // hex 明度混色工具：把單一錨點色展成三個 stop（淺→基準→深），確保明度落差夠→滑順；深端刻意不到純黑，避免 city 環境反射打在大片死黑上結塊出色帶
      const h2r=h=>{h=h.replace('#','').trim();if(h.length===3)h=h.split('').map(c=>c+c).join('');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];};
      const r2h=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
      const mix=(hex,t,amt)=>{const a=h2r(hex),b=h2r(t);if(a.some(isNaN))return hex;return r2h(a.map((v,i)=>v+(b[i]-v)*amt));};
      const fromBase=b=>[mix(b,'#FFFFFF',0.60),mix(b,'#FFFFFF',0.18),mix(b,'#000000',0.15)]; // 淺(混白 60%)→中(混白 18%)→深(混黑 15%，不到純黑)
      const triad=(mode)=>{
        if(mode==='primary')  return fromBase(cssVar('--c-brand-500','#1C1C20'));   // 主錨點 --c-brand-500（改它整條主色漸層跟著變）
        if(mode==='secondary')return fromBase(cssVar('--c-brand2-500','#EA580C'));  // 副錨點 --c-brand2-500
        return ['#ff816e','#F3B8AC','#DEB4E1'];   // classic（Yuu 2026-07-23 手調暖色）
      };
      // 基底參數固定（brightness/uStrength/pixelDensity…同原版），只換 color1/2/3
      const buildURL=(mode)=>{const c=triad(mode).map(h=>'%23'+h.replace('#',''));
        return 'https://www.shadergradient.co/customize?animate=on&axesHelper=off&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1='+c[0]+'&color2='+c[1]+'&color3='+c[2]+'&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=2.4&positionX=-1.4&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uAmplitude=1&uDensity=1.8&uFrequency=5.5&uSpeed=0.2&uStrength=4&uTime=0&wireframe=false';};
      // 模式：classic 經典流動／static 經典靜態／primary 主色流動／secondary 輔色流動。colorKey＝shader 取色用（經典兩態都用珊瑚色）
      const colorKey=m=>(m==='primary'||m==='secondary')?m:'classic';
      // 依當前模式把底層靜態漸層 .gd-hero-bg 重新上色：動態平面旋轉後角落會露出底層，同色才不會漏出不相干的橘/珊瑚
      const heroBg=hero.querySelector('.gd-hero-bg');
      const applyHeroBg=(m)=>{if(!heroBg)return;
        if(m==='primary'||m==='secondary'){const t=triad(m);heroBg.style.background='radial-gradient(90% 80% at 22% 12%, '+t[0]+' 0%, '+t[1]+' 42%, '+t[2]+' 78%), '+t[2];}
        else heroBg.style.background='';};   // classic/static→還原 CSS 預設（經典珊瑚）
      let root=null,Rref=null,SGref=null,domCreateRoot=null;   // 快取載入的 React／SG／createRoot：換色模式時可同步重建 root（免重新 import→無感切換）
      const initMode=window.__shaderMode||'classic';
      let curMode=colorKey(initMode);
      let shaderOn=(initMode!=='static'),mounted=false,loading=false,failed=false;   // static＝經典靜態（不掛 shader，只顯示底層珊瑚）；其餘皆掛 shader
      const unmount=()=>{if(root){try{root.unmount();}catch(e){}root=null;}mounted=false;};
      window.__sgUnmount=unmount;
      const fresh=()=>{   // 用快取 refs 建 root 並以 curMode 三色繪製（換色＝卸舊重建同 host）
        if(!Rref||!SGref||!domCreateRoot)return;
        if(root){try{root.unmount();}catch(e){}}
        root=domCreateRoot(host);
        root.render(Rref.createElement(SGref.ShaderGradientCanvas,
          {style:{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none'}},
          Rref.createElement(SGref.ShaderGradient,{control:'query',urlString:buildURL(curMode)})));
        mounted=true;
      };
      async function mount(){
        if(mounted||loading||failed)return;loading=true;
        try{
          const [reactMod,domMod,SG]=await Promise.all([
            import('https://esm.sh/react@19.2.0'),
            import('https://esm.sh/react-dom@19.2.0/client?deps=react@19.2.0'),
            import('https://esm.sh/@shadergradient/react@2.4.20?deps=react@19.2.0,react-dom@19.2.0,three@0.180.0')   // @shadergradient/react@2 依賴 R3F v9，需 React 19，版本要一致否則 reconciler 內部對不上
          ]);
          Rref=reactMod.default||reactMod;SGref=SG;domCreateRoot=domMod.createRoot;
          loading=false;
          if(!shaderOn){return;}                     // 載入期間被切成「靜態」就別掛
          fresh();
          requestAnimationFrame(()=>hero.classList.add('shader-on'));   // 掛好再淡入，避開空白閃爍
        }catch(e){failed=true;loading=false;window.__shaderFailed=true;hero.classList.remove('shader-on');console.warn('[hero-shader] ShaderGradient 載入失敗，退回靜態漸層',e);}
      }
      // 偏好設定呼叫這支切換：傳模式字串（classic/static/primary/secondary）；此函式每次 renderGuide 重掛時覆寫成綁定當前 host
      window.__shaderApply=(mode)=>{mode=mode||'classic';window.__shaderMode=mode;
        applyHeroBg(mode);                           // 先把底層靜態層改成當前模式的色
        const on=mode!=='static';shaderOn=on;
        if(!on){hero.classList.remove('shader-on');unmount();return;}   // 經典靜態＝只顯示底層珊瑚、不掛 shader
        const ck=colorKey(mode),changed=(ck!==curMode);curMode=ck;
        if(!mounted){mount();return;}                // 從靜態切回→首次掛載
        if(changed)fresh();                          // 換色→重建 root（import 已快取，瞬間完成）
        hero.classList.add('shader-on');};
      applyHeroBg(initMode);                          // 初次載入先設底層色（primary/secondary→石墨/橘；經典兩態→珊瑚）
      if(shaderOn)mount();
    })();
    // 首屏 hero 兩顆 CTA：主要＝編輯 Token（solid primary）、次要＝瀏覽元件（solid secondary：淺色近白底／深色近黑底，凸顯於漸層上）；都用 library mkBtn 原子，不手拼 class
    const heroCta=view.querySelector('#gdHeroCta');
    if(heroCta){
      const pri=mkBtn({variant:'solid',intent:'primary',size:'m',isLive:true});pri.type='button';
      pri.querySelector('span').textContent='編輯 Design Token';
      pri.onclick=()=>renderView('tokens');
      const sec=mkBtn({variant:'solid',intent:'secondary',size:'m',isLive:true});sec.type='button';
      sec.querySelector('span').textContent='瀏覽 Component';
      sec.onclick=()=>renderView('summary');
      heroCta.append(pri,sec);
    }
    // FAQ 展開收合（＋／− 由 CSS ::before 依 collapsed 狀態切換，JS 只負責 toggle）
    view.querySelectorAll('#gdFaq .gd-faq-item').forEach(it=>{
      const a=it.querySelector('.gd-faq-a');  // 把答案內容包進 .gd-faq-a-inner，供 grid 0fr→1fr 平滑展開
      if(a&&!a.querySelector('.gd-faq-a-inner')){const inner=document.createElement('div');inner.className='gd-faq-a-inner';while(a.firstChild)inner.appendChild(a.firstChild);a.appendChild(inner);}
      const q=it.querySelector('.gd-faq-q');if(q)q.onclick=()=>it.classList.toggle('collapsed');
    });
    // 核心頁面三張導覽牌卡：點擊（或 Enter/Space）跳到對應頁
    view.querySelectorAll('.gd-navcard').forEach(c=>{ const t=c.getAttribute('data-nav'); if(!t)return;
      const go=()=>renderView(t);
      c.addEventListener('click',go);
      c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    });
    // ── 精細配圖 mockup（模擬本網站實際畫面；矩陣／按鈕一律用 mkBtn 原子，不手拼 class）──
    const CK='<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0L3.22 8.28a.75.75 0 0 1 1.06-1.06L7 9.94l5.72-5.72a.75.75 0 0 1 1.06 0Z"/></svg>';
    // 02 畫面地圖：完整 app 視窗＋三區標註
    const r02=view.querySelector('#gdRich02');
    if(r02)r02.innerHTML=
      '<div class="gm-rel"><div class="gm-win">'
      +'<div class="gm-top"><span class="gm-burger">☰</span><span class="gm-brand">cdl</span><span class="gm-sp"></span><span class="gm-ver">儲存並更新 · v3</span></div>'
      +'<div class="gm-body"><div class="gm-side">'
        +'<div class="gm-si"><span class="gm-ico"></span>Design Token</div><div class="gm-si"><span class="gm-ico"></span>Design Guideline</div><div class="gm-si"><span class="gm-ico"></span>選擇元件</div>'
        +'<div class="gm-lb">BASIC</div><div class="gm-si on"><span class="gm-ico"></span>Button</div><div class="gm-si"><span class="gm-ico"></span>Input</div>'
        +'<div class="gm-lb">COMPLEX</div><div class="gm-si"><span class="gm-ico"></span>Modal</div>'
      +'</div><div class="gm-main">'
        +'<div class="gm-crumb">Basic / Button</div><div class="gm-h">Button</div>'
        +'<div class="gm-line" style="width:88%"></div><div class="gm-card-ph"></div><div class="gm-line" style="width:64%"></div>'
      +'</div></div></div></div>';
    // 04 元件架構：Button 規格矩陣（mkBtn 原子）＋篩選 chip＋token 綁定列
    const r04=view.querySelector('#gdRich04');
    if(r04){r04.innerHTML=
      '<div class="gm-win"><div class="gm-top"><span class="gm-burger">☰</span><span class="gm-brand">cdl</span><span class="gm-crumb" style="margin-left:6px">/ Basic / Button</span><span class="gm-sp"></span></div>'
      +'<div class="gm-main" style="gap:9px">'
        +'<div class="gm-h" style="font-size:var(--fs-h9)">規格矩陣</div>'
        +'<div class="gd-chiprow"><span class="gd-chip on">實心</span><span class="gd-chip on">外框</span><span class="gd-chip on">柔色</span><span class="gd-chip on">主要</span><span class="gd-chip on">次要</span><span class="gd-chip on">危險</span></div>'
        +'<div class="gm-mx" id="gdRich04Mx"></div>'
        +'<div class="gm-lb">變數與 TOKEN · 綁定</div>'
        +'<div class="gm-bind"><span class="gm-bind-k">圓角</span>--r-md<span class="gm-bind-v">→ --r-sm ▾</span></div>'
        +'<div class="gm-bind"><span class="gm-bind-k">間距</span>--sp-3<span class="gm-bind-v">→ --sp-4 ▾</span></div>'
        +'<div class="gm-lb">互動預覽與程式碼</div>'   // 新功能示意：左預覽、右程式碼（水平版型＝預設）
        +'<div class="gm-live"><div class="gm-live-l" id="gdRich04Prev"></div><div class="gm-live-c"><i></i><i></i><i></i></div></div>'
      +'</div></div>';
      const pv4=r04.querySelector('#gdRich04Prev');if(pv4)pv4.appendChild(mkBtn({variant:'solid',intent:'primary',size:'s'}));
      const mx4=r04.querySelector('#gdRich04Mx');
      if(mx4){ // 表格：左上角＋欄標題(intent)＋每列 variant 標題＋mkBtn 格
        mx4.appendChild(ce('div','gm-mxc cnr'));
        ['主要','次要','危險'].forEach((zh,ix)=>{const h=ce('div','gm-mxc hd'+(ix===2?' lc':''));h.textContent=zh;mx4.appendChild(h);});
        const VR=[['solid','實心'],['outline','外框'],['soft','柔色']];
        VR.forEach(([v,zh],ri)=>{const lr=ri===VR.length-1;
          const lbl=ce('div','gm-mxc rl'+(lr?' lr':''));lbl.textContent=zh;mx4.appendChild(lbl);
          ['primary','secondary','danger'].forEach((intent,ci)=>{const cell=ce('div','gm-mxc'+(ci===2?' lc':'')+(lr?' lr':''));cell.appendChild(mkBtn({variant:v,intent,size:'s'}));mx4.appendChild(cell);});
        });}
    }
    // 05 數值編輯：Design Token L1 tab＋色票／數值列（brand2 欄位 focus 高亮示意編輯中）
    const r05=view.querySelector('#gdRich05');
    if(r05){r05.innerHTML=
      '<div class="gm-win"><div class="gm-top"><span class="gm-burger">☰</span><span class="gm-brand">cdl</span><span class="gm-crumb" style="margin-left:6px">Design Token</span><span class="gm-sp"></span><span id="gdR05Reset"></span></div>'
      +'<div class="gm-main" style="gap:8px">'
        +'<div class="gm-tabs"><span class="gm-tab on">L1 Primitive</span><span class="gm-tab">L2 Semantic</span><span class="gm-tab">框架索引</span></div>'
        +'<div class="gm-trow"><span class="gm-tsw" style="background:var(--accent)"></span><span class="gm-tnm">--c-brand-500</span><span class="gm-tfield plain">#1C1C20</span></div>'
        +'<div class="gm-trow"><span class="gm-tsw" style="background:var(--c-brand2-500)"></span><span class="gm-tnm">--c-brand2-500</span><span class="gm-tfield">#EA580C</span></div>'
        +'<div class="gm-trow"><span class="gm-tnm">--r-md 圓角</span><span class="gm-tfield plain">8px</span></div>'
        +'<div class="gm-trow"><span class="gm-tnm">--sp-4 間距</span><span class="gm-tfield plain">16px</span></div>'
      +'</div></div>';
      const reset=mkBtn({variant:'soft',intent:'secondary',size:'s'});reset.querySelector('span').textContent='reset';
      const rs=r05.querySelector('#gdR05Reset');if(rs)rs.appendChild(reset);
    }
    // 06 需求偏好：需求匯總勾選列＋每列軸 chip＋logo 雙版
    const r06=view.querySelector('#gdRich06');
    if(r06){
      const gmTag=(txt,on)=>'<div class="tg v-outline c-round i-neutral st-default'+(on?'':' off')+'"><span>'+txt+'</span></div>'; // 真實 Tag 元件
      const gmCard=(name,checked,tags)=>'<div class="gm-ccard"><div class="gm-ccard-top"><span class="gm-ck'+(checked?' on':'')+'">'+(checked?CK:'')+'</span><span class="gm-cnm">'+name+'</span></div><div class="gm-ctags">'+tags+'</div></div>';
      r06.innerHTML=
      '<div class="gm-win"><div class="gm-top"><span class="gm-burger">☰</span><span class="gm-brand">cdl</span><span class="gm-crumb" style="margin-left:6px">選擇元件</span><span class="gm-sp"></span></div>'
      +'<div class="gm-cardgrid">'
        +gmCard('Button',true,gmTag('實心',1)+gmTag('外框',1)+gmTag('柔色',0))
        +gmCard('Input',true,gmTag('預設',1)+gmTag('錯誤',1))
        +gmCard('Tag',false,gmTag('實心',0)+gmTag('外框',0))
        +gmCard('Card',true,gmTag('基本',1))
      +'</div>'
      +'<div style="padding:9px 12px 11px;display:flex;gap:8px;align-items:center;border-top:1px solid var(--line)"><span class="gm-lb" style="margin:0">LOGO</span><div class="gd-logobox lp-light">淺</div><div class="gd-logobox lp-dark">深</div></div>'
      +'</div>';
    }
    // 07 版本存檔：存檔確認對話框疊在暗化視窗上（按鈕用 mkBtn 原子）
    const r07=view.querySelector('#gdRich07');
    if(r07){r07.innerHTML=
      '<div class="gm-win gm-stage7"><div class="gm-top"><span class="gm-burger">☰</span><span class="gm-brand">cdl</span><span class="gm-sp"></span><span class="gm-ver">v1</span></div>'
      +'<div class="gm-body" style="min-height:270px"><div class="gm-side"><div class="gm-si"><span class="gm-ico"></span>Design Token</div><div class="gm-si"><span class="gm-ico"></span>Design Guideline</div><div class="gm-si"><span class="gm-ico"></span>選擇元件</div><div class="gm-lb">BASIC</div><div class="gm-si on"><span class="gm-ico"></span>Button</div></div><div class="gm-main"><div class="gm-line" style="width:78%"></div><div class="gm-card-ph"></div><div class="gm-line" style="width:56%"></div><div class="gm-line" style="width:68%"></div></div></div>'
      +'<div class="gm-scrim"></div>'
      +'<div class="gm-dlg"><div class="gm-dlg-h"><div class="gm-dlg-t">儲存並更新此元件庫</div><div class="gm-dlg-sub">v1 → v2 · 3 項變更</div></div>'
        +'<div class="gm-dlg-b"><span class="gm-chg chg">token --r-md：8px → 12px</span><span class="gm-chg add">新增元件 Input</span><span class="gm-chg rm">停用 --fs-h1</span></div>'
        +'<div class="gm-dlg-f" id="gdRich07Foot"></div></div></div>';
      const f7=r07.querySelector('#gdRich07Foot');
      if(f7){const c=mkBtn({variant:'outline',intent:'secondary',size:'s'});c.querySelector('span').textContent='取消';
        const k=mkBtn({variant:'solid',intent:'primary',size:'s'});k.querySelector('span').textContent='確定更新';f7.append(c,k);}
    }
  }


