  /* ==================== P1 元件（2026-11-03）==================== */
  /* 共用：「什麼時候用」說明段 */
  function usageSection(body,rows){const us=section(body,'什麼時候用','和相近元件的分工。');
    const d=ce('div','row-demo');d.style.cssText='display:block;font-size:13px;line-height:1.7;color:var(--muted);';
    d.innerHTML=rows.map(([k,v])=>`<b style="color:var(--ink)">${k}</b>：${v}`).join('<br>');us.appendChild(d);}
  function capRow(host,items){const rd=ce('div','row-demo');items.forEach(([cap,node])=>{const it=ce('div','demo-item');it.appendChild(node);const c=ce('div','cap');c.innerHTML=`<b>${cap}</b>`;it.appendChild(c);rd.appendChild(it);});host.appendChild(rd);return rd;}

  /* ---------- AVATAR 頭像 ---------- */
  /* 人物頭像照片（96×96 內嵌 JPEG，離線可顯示）：Avatar photo 型與卡片類元件共用；2026-11-08 從 card 區移上來給 avtEl 用 */
  const CARD_AV=["data:image/jpeg;base64,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", "data:image/jpeg;base64,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", "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCABgAGADASIAAhEBAxEB/8QAHAAAAgIDAQEAAAAAAAAAAAAABQYEBwABCAMC/8QANhAAAQMDAgQDBwQCAQUAAAAAAQIDBAAFERIhBjFBURMyYQcUIkJxgZEVUqHBI2KCM3Kx0fD/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMEAAb/xAAnEQACAgIBAwMEAwAAAAAAAAAAAQIRAyExBBJBBVGhE5Gx8TNhcf/aAAwDAQACEQMRAD8AerWu4LYIukZll9Jxll3WhfqNsj6Gpu9aaLhZSp9KW1kZKQchPpnrWOqLaMhJWrOAkdTWqzzvY7o3WV5+G6XlLW8dBTgNoTgJPfPPNeh2rkBxS8mjWqwmtZphLN1la1Ctg1x1gG2Zf4tvLi1uK92S0y2FHZOU5UB6ZNMA50GsKVCbd1rx/kk6hvk+Udf66UaFJHgtm/k+34N4r5dcQy0p11aUNoGVKUcAD1qHc7g3AZcfd1FtpsrKW91qI+UD+aGtQm+I1RrlNbdTGDaVR2FOkY/2UkbZ7elBy3SKRxJR75vQTfhtptciMouqbLR1L1krO3PPfbnQVV5NlltfrDy3Iso4iPhJJbSBnDgA5nc5pmcx4a9StI0nKuwxzpVt8lNw4YdnS0F+HOKleCSnX4XkASepwnP3rvIyd47fv+RqQtLiErQcpUAQe4qFdbnCtMVUq4yW47I21LPM9gOZPoKSLLeW+HJobdkKXZpXiLZzzjKSSVIwT8KQABg755UgXubduNLq5N0OBgEpYb+VpH/geprpTUVYMPTPLOvA9Tva3a2nVIiW6XIQOTilJbz9jk1kL2s2d1YTMhTIwPzDS4B+MGkNjhVp9h5bVwaWpkfHsooz+0K6n6UvTGQwvw1I0KA5hWQqprK2bX6firg6HtnFViuxSm33OM4vH/TUrQvP0Vg0YCjjP4rlY0d4d4su9hktuRpTrjAPxxnFlSFjqMHkfUU6ye5nyenvmDL6tC83C8OL+FPvISOxwgb/AF33qcZa0rGqK6GyfPscDuRzxQCz3Rma3DuMRXiRJ7/x921lO33ynSR6ijUJ2Qi3rkSHlOqWsq0gABKB8u/KmWkRmlKTk9fo+bhDdmJcaaQnQpKiHHFE7lOAQBXjYJziLNA/Um0x1FhI15+DPIDPTYZ3qUifIT4ahbyUqXp2fRy7+o/moShJtXDrVucCUXae661EacUFeG3qJ1kjnhP9UktMtiX1YPu8fCPH2gzlw+G1x2FKEu5OphRwjOolfmI+ic/kUKnOuou9n4fs0dqXGhwyqQ0sBJKEkJGc+U5APf8ANQUXFziLjRU8J98tfDzZbaWkpQlx9R8+5x3O37R3oNFurUP2ny7jJU+hlllZkk/AVnQB5exVjA+lTlLdmqGNKLgua+SV7QrehlTbC2A3IlupDbLTynBIAIJWUkZGPKOpJPakqbeLnDbfgurUEKOggjASM7gD/wC5UYlPpvkW5cQX6U8wZUhDEYtN6ihsZUUpHQAad/X1pZnw7aAV21111C3NCUvp0uLHRQx0J2pHtmnFahXkKxn2l25bTcpcbW0lBbCeo5knsfSgNxbDYS2XvFUkbHTip8S5NxipuRGy8j4fj5jHehM94vOlZxv2rknZST0Ra1W61inED3C1/l2l0xmnSGH3G1FJGrC0qBBA7nGKviz3mPItEMSyGnHWC69rGkDGxznuTXNQJSQpJwoHIPY10lZXE3+LYpaXtCHYxWpW2wwNQIPqD+KaN8mTqEriq2wixcbbaeHRcJ7niMoSENNqOVvLPJAHU9KS7Pd5V8a4hu9zQEzwtMaOwpOfdgN0pT6g7k9xTjKY95uiHnWQIcbJjNYGkH5nD/ueh6A+pquOAlomXOe2044EvpckOJWk5B8YgDV/2kZIoSu7BiWNwcI8L5HvhLhaNw7bmo3iF9aSVFShhKVHmQO/qd8dhtVMXKQ7fOKJDLC9a5krTjPnOo4Ge2MVZHtP4ncixl2W1upbfdbJlSSrSllv9oP71DoN8fWkD2UW9U7jGOtvHhwyX1E88AED+SKEknpHYlOCc8gx+0CHGssa0233Iyo7DJLYKtKXnSrKlKI6DA29R2pXkRZ4Qi4OMtNhG6G204CPzv8AarJ9qQZhRrbc3W/FQ08ttSM48ycgg/8AE1UN44idnunQ2hpoeRtI2H/s+tLJU6Rp6eV4k2Dri8t6Wt105cUcqPeoqjmtElRya1TIcwmpci3qYt8SaZEdaZJWA0hzLiNJwdQ6c9qh1sVwDZx0q2OC0zGLLwstYbWh2RKSwheQQD1z9jj61VsKOJUtlgupaStYSp1flbBONR9BV9oRHt8jhS2x0eKhguhGnmdLZGfud6ZEOok0lSv9ML3Z+VDgK8ELD7qkstJUdQLizpH8n+KVuEOGZVj4vuClOkxY7Zith04K1KwshPQgAg9N1D1rw444nl27i2zNrirUywsPpj5H+Q50pOx588U9YcuGVPMlic8FqQOjWMYGepxjJ6nNBtyl/hPGo4se+ZHN02fLm+M/NkrfUVHBWc5UeZ/Apt9iz5a4vU3vh6KtP3GD/VKE9+OYMBiNq+FsrfB6ukkbf8QKNezZ12PxZCfZTq0upQoZA2X8P90sXRfJHug0y+7/AG2PeLU/AmMh5h1PxDOCCOSknuOYrn3ing658OqU68kPwtQCZLfLfcBQ5pP8V0gtYaQ46cq8JsulCN1FI5kCkT2lymnLLCiMDWLi6l/OOaAM8vqU086sh0veoVXLKHrKaLhDiMNnVEbUoA5PlNLB5nbFInZtao+akQor82UzFitlx95YQ2gfMTUenj2PtML4wQ6/jLMdxTef3HAz+CaK5J5JdkHIZ7vwK2jg9mDBjH9Rip8Zx7Ay+T5gfTt2x60vcMX8QpdubvUl5oW9xwt4TvpUhWoE9wcAD1q6opQ5IeDiSFrSMA/sqofabbox4lQIQSZIbQJPYEqwkn1IIppxraMfS5ZZLi/uEuAYLnFPELt+vQ8RuOR4aVHbxPlTjskb/UirZZba8ZtKdiCQMH03oDwrHg2KPDsrTBcWpC3FvaSlSiMZV23JA+1ercxUu5wRDAbt77j+tWclwISBj0BOrcdqC0qHncp96ejmY8qePZlGS8q5ueAl11ppt5vPNPhuoUrH2JoBb+F7nLAW40IzR+d/Yn6J5mnHh5ocItPzUySvUytlRU2AF68bJT3+HrStmpq0Wszdrem831IjtpVEhIaemE+datRDQ/IOB3qteJbyblfFqdCGm4cdCGGuyT5j6nP9VEtU1biXHFI/yuuFwISTjUfmOfTrQbi1hxjRPbOV50rOfMD0+lB7Ggkq/o8Z0pDqFheCk8t6WJWC6SlOBRWNBlXCIp+MNaR0B3z2qLFhOPtSHlghthBKlHv0FBaHlsGVOsl0fs9zjzoxwtlYOOih1BqDRC2MtqZlPPJCkpSEJz0Urr+AaYm9nRdqubXEVubk2/Ug4BKiN0nqKrz2tIaauLLrDWh92NhahsTg7fcUk2Lia98LrV+lyyhpZyptaQtCvseX2xUniXjN/iMsuzoTTUhsaS4wo4UPoeX5ppO4mXHhljyJrgdrFxrcrz7sxEjpXdExPdAVnzuKI+MdtgOfrTRb1pslnsTvEDgiuwnHWVjGdR0lPT85qoeGp6YMlu5Q57TM1pYAbWdJx1Izse2M0T4pu9w4tvcSG3KS88VaQs/ClrVzGeWKmpNMtPFCUUvY/9k=", "data:image/jpeg;base64,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", "data:image/jpeg;base64,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"];
  /* Avatar photo 型預設照片：依名字挑一張人物照（同名同一人），取代原本的插畫 SVG 人像（2026-11-08 改人物照片） */
  function avtPhoto(name){const n=String(name||'');let h=0;for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))>>>0;return CARD_AV[h%CARD_AV.length];}
  const AVT_PEOPLE=[['林','accent'],['陳','brand2'],['王','sec'],['李','accent'],['張','brand2'],['周','sec']];
  function avtEl(size,shape,content,o){o=o||{};
    const a=ce('span',`avt avt-sz-${size} avt-sh-${shape} avt-c-${content}`+(o.tone&&content==='initials'?' avt-t-'+o.tone:''));
    a.setAttribute('role','img');a.setAttribute('aria-label',(o.name||'林語晨')+(o.status?'（'+({online:'在線',away:'離開',busy:'忙碌',offline:'離線'}[o.status])+'）':''));
    if(content==='image'){const i=document.createElement('img');i.className='avt-img';i.alt='';i.src=o.src||avtPhoto(o.name||'林語晨');a.appendChild(i);}
    else if(content==='initials')a.appendChild(document.createTextNode(o.initials||'林'));
    else a.innerHTML=IC_USER;
    if(o.status)a.appendChild(ce('span','avt-dot avt-dot-'+o.status));
    return a;}
  function avtGroup(size,n,max){const g=ce('span','avt-grp');g.setAttribute('role','group');g.setAttribute('aria-label',n+' 位成員');
    for(let i=0;i<Math.min(n,max);i++)g.appendChild(avtEl(size,'circle','initials',{initials:AVT_PEOPLE[i%6][0],tone:AVT_PEOPLE[i%6][1],name:AVT_PEOPLE[i%6][0]}));
    if(n>max){const m=ce('span',`avt avt-sz-${size} avt-sh-circle avt-more`);m.textContent='+'+(n-max);m.setAttribute('aria-label','另外 '+(n-max)+' 位');g.appendChild(m);}
    return g;}
  LIVE.avatar=(host)=>mountLive(host,{gate:'avatar',
    initial:{size:'l',shape:'circle',content:'initials',status:true,group:false},
    segs:[{key:'size',label:'Size',options:['xs','s','m','l','xl']},{key:'shape',label:'Shape',options:['circle','rounded'],labels:['圓形','圓角方']},
          {key:'content',label:'Content',options:['image','initials','icon'],labels:['照片','縮寫','圖示']}],
    bools:[{key:'status',label:'status 在線狀態'},{key:'group',label:'group 群組疊放'}],boolLabel:'Feature',
    render:st=>st.group?avtGroup(st.size,6,4):avtEl(st.size,st.shape,st.content,{status:st.status?'online':null}),
    note:'群組模式只用圓形（疊放時方形會互相切到）；滑過群組裡的頭像會往上位移，疊放順序不變。'});
  function buildAvatar(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Avatar',title:'Avatar 頭像',
      lede:'代表一個人或帳號的小圖：照片、名字縮寫或預設圖示。五級 size × 兩種 shape × 三種內容（<b>5 × 2 × 3 = 30</b>），另有在線狀態點與群組疊放。list-item、header、評論、成員清單都應該取用這顆原子，不要各自重畫（鐵則 5）。',
      specRows:[['axes','<code>size × shape × content</code>'],['formula','<code>5 × 2 × 3 = 30</code>'],['token-policy','<code>semantic.*.avatar.*</code>'],['features','status / group / +N']]});
    const SZ={xs:['極小','xs · 20'],s:['小','s · 28'],m:['標準','m · 36'],l:['大','l · 48'],xl:['特大','xl · 64']};
    const CN={image:['照片','image'],initials:['縮寫','initials'],icon:['圖示','icon']};
    const axes=DIAL_SPECS.avatar.axes,zh=DIAL_SPECS.avatar.zh,active=CHOICE.avatar.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';
      const ss=axes.size.filter(v=>active.size.has(v)),cs=axes.content.filter(v=>active.content.has(v));
      axes.shape.filter(v=>active.shape.has(v)).forEach(sh=>p.appendChild(matrixPanel({badge:'shape · '+sh,name:'Size × Content（'+(sh==='circle'?'圓形':'圓角方')+'）',rows:ss,cols:cs,
        rowLab:s=>labHTML(SZ[s][0],SZ[s][1]),colLab:c=>labHTML(CN[c][0],CN[c][1]),cell:(s,c)=>avtEl(s,sh,c,{}),mincol:120})));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Size × Content 矩陣','每種 shape 一張：列＝五級尺寸、欄＝照片／縮寫／圖示。縮寫字級隨尺寸等比（尺寸的 42%）。');p=panelsIn(sec);renderM();
    const ss=section(body,'Status 在線狀態','右下角的狀態點；外圈用 --panel 色描邊，放在任何底色上都切得開。');
    capRow(ss,[['在線 online',avtEl('l','circle','initials',{status:'online'})],['離開 away',avtEl('l','circle','initials',{status:'away',initials:'陳',tone:'brand2'})],
      ['忙碌 busy',avtEl('l','circle','image',{status:'busy'})],['離線 offline',avtEl('l','circle','icon',{status:'offline'})]]);
    const gs=section(body,'Group 群組疊放','多人時重疊顯示，超過上限以 +N 收合。疊放間距＝尺寸的 28%。');
    capRow(gs,[['s · 6 人上限 4',avtGroup('s',6,4)],['m · 3 人',avtGroup('m',3,4)],['l · 9 人上限 3',avtGroup('l',9,3)]]);
    usageSection(body,[['用照片','有使用者上傳的頭貼時。'],['用縮寫','沒有照片時的預設；底色依人固定，同一個人在各處同色。'],['用圖示','訪客、未登入、或系統帳號。'],['用群組','卡片或列表上需要顯示「誰參與了」，但不需要每個人的名字時。']]);
    const sl=section(body,'互動預覽與程式碼','切 size／shape／內容、勾狀態點；勾 group 看疊放與 +N。');LIVE.avatar(sl);
  }

  /* ---------- SEGMENTED 分段控制 ---------- */
  const SGM_ICONS=()=>[IC_CALENDAR,IC_CHART_BAR,IC_PIE,IC_TRENDING];
  function sgmEl(variant,size,o){o=o||{};const items=o.items||['日','週','月','年'];let cur=o.active==null?1:o.active;
    const g=ce('div',`sgm sgm-v-${variant} sgm-sz-${size}`+(o.full?' sgm-full':''));g.setAttribute('role','radiogroup');g.setAttribute('aria-label',o.label||'檢視範圍');
    const ind=ce('span','sgm-ind');ind.setAttribute('aria-hidden','true');g.appendChild(ind);
    const btns=items.map((t,i)=>{const b=ce('button','sgm-it');b.type='button';b.setAttribute('role','radio');
      b.innerHTML=(o.icon?`<span class="sgm-ic">${SGM_ICONS()[i%4]}</span>`:'')+`<span>${t}</span>`;
      if(o.disabledIndex===i)b.disabled=true;if(o.hoverIndex===i)b.classList.add('is-hover');g.appendChild(b);return b;});
    function place(anim){const b=btns[cur];if(!b||!b.offsetWidth)return;if(!anim)ind.classList.add('no-anim');
      ind.style.width=b.offsetWidth+'px';ind.style.transform=`translateX(${b.offsetLeft}px)`;if(!anim){void ind.offsetWidth;ind.classList.remove('no-anim');}}
    function set(i,anim,silent){cur=i;btns.forEach((b,j)=>{const on=j===i;b.classList.toggle('is-active',on);b.setAttribute('aria-checked',on?'true':'false');b.tabIndex=on?0:-1;});place(anim);if(anim&&!silent&&o.onChange)o.onChange(i);}
    g.__set=i=>{if(i!==cur)set(i,true,true);};   // MODE:v2 外部同步選中項（不觸發 onChange）
    if(o.live)btns.forEach((b,i)=>{b.onclick=()=>{if(!b.disabled)set(i,true);};
      b.addEventListener('keydown',e=>{const d=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:0;if(!d)return;e.preventDefault();
        let n=cur;do{n=(n+d+btns.length)%btns.length;}while(btns[n].disabled&&n!==cur);set(n,true);btns[n].focus();});});
    set(cur,false);requestAnimationFrame(()=>place(false));if(window.ResizeObserver)new ResizeObserver(()=>place(false)).observe(g); // 掛上 DOM、字型載入後再量
    return g;}
  LIVE.segmented=(host)=>mountLive(host,{gate:'segmented',
    initial:{variant:'soft',size:'m',icon:false,full:false,disabled:false},
    segs:[{key:'variant',label:'Variant',options:['soft','outline'],labels:['柔色軌道','外框']},{key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'icon',label:'icon 圖示'},{key:'full',label:'full-width 填滿'},{key:'disabled',label:'disabled 停用一項'}],boolLabel:'Content',
    render:(st,sync)=>{const w=ce('div');w.style.cssText='width:100%;max-width:420px;display:flex;justify-content:center;';
      w.appendChild(sgmEl(st.variant,st.size,{live:true,icon:st.icon,full:st.full,disabledIndex:st.disabled?3:null,onChange:()=>sync&&sync()}));return w;},
    note:'選中底色是一塊會滑動的指示器（與 tab pill 同一套 --accent 對比色）；可用方向鍵切換，Tab 只會停在選中的那一項。'});
  function buildSegmented(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Segmented',title:'Segmented 分段控制',
      lede:'在 2～5 個互斥選項間切換<b>同一份內容的呈現方式</b>（日／週／月、清單／格狀）。兩種 variant × 三級 size（<b>2 × 3 = 6</b>，高度 32／40／48 對齊 Button）。選中樣式與 <a href="#tab">tab</a> pill 同一套：<code>--accent</code> 底＋<code>--primary-on</code> 字，深淺模式自動切換。',
      specRows:[['axes','<code>variant × size</code>'],['formula','<code>2 × 3 = 6</code>'],['token-policy','<code>semantic.*.segmented.*</code>'],['features','icon / full-width / disabled-item']]});
    const VN={soft:['柔色軌道','soft'],outline:['外框','outline']},SZN={s:['小','s · 32'],m:['標準','m · 40'],l:['大','l · 48']};
    const axes=DIAL_SPECS.segmented.axes,zh=DIAL_SPECS.segmented.zh,active=CHOICE.segmented.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const vs=axes.variant.filter(v=>active.variant.has(v)),ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'item · 第二項選中',name:'Variant × Size',rows:vs,cols:ss,rowLab:v=>labHTML(VN[v][0],VN[v][1]),colLab:s=>labHTML(SZN[s][0],SZN[s][1]),
        cell:(v,s)=>sgmEl(v,s,{}),mincol:220}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Variant × Size 矩陣','soft 放在白底頁面；outline 放在已經有底色的卡片或工具列上。');p=panelsIn(sec);renderM();
    const is=section(body,'Item States 選項狀態','預設、滑過、選中、停用。');
    capRow(is,[['滑過（第一項）',sgmEl('soft','m',{hoverIndex:0})],['停用（最後一項）',sgmEl('soft','m',{disabledIndex:3})],['帶圖示',sgmEl('soft','m',{icon:true,items:['日','週','月']})]]);
    usageSection(body,[['用 Segmented','切換同一份資料的檢視方式，選了立刻生效。'],['改用 Tab','切換的是不同內容區塊（例如「基本資料／付款／通知」）。'],['改用 Radio','在表單裡選一個值、要按送出才生效。'],['改用 Dropdown','選項超過 5 個。']]);
    const sl=section(body,'互動預覽與程式碼','點選或用方向鍵切換，看指示器滑動。');LIVE.segmented(sl);
  }

  /* ---------- CHIP 選擇膠囊（CHIP:v1，2026-11-10）---------- */
  /* chpEl(type,state,size,o)：單顆。type single｜multi；state default｜hover｜selected｜disabled；size s｜m｜l。
     o.label 文字、o.dot 色點（CSS 顏色）、o.icon 前置圖示（SVG 字串）、o.live 真的可操作 */
  function chpEl(type,state,size,o){o=o||{};const b=ce('button','chp chp-sz-'+size+' chp-'+type+(o.live?' live':'')+(state==='hover'?' is-hover':''));b.type='button';
    b.setAttribute('role',type==='multi'?'checkbox':'radio');b.setAttribute('aria-checked',String(state==='selected'));if(state==='disabled')b.disabled=true;
    let h='';if(o.dot)h+='<span class="chp-dot"></span>';if(o.icon)h+=o.icon;
    b.innerHTML=h+'<span class="chp-t"></span>';b.querySelector('.chp-t').textContent=o.label||'選項';if(o.dot)b.querySelector('.chp-dot').style.setProperty('--chp-dot',o.dot);
    if(o.key!=null)b.dataset.k=o.key;return b;}
  /* chpGroup(type,size,o)：一組。o.items＝[{k,label,dot,icon,disabled}]；o.value 單選＝k、多選＝陣列；o.label 群組名稱（aria）；o.onChange(值)
     單選：role=radiogroup，方向鍵移動並選取、Tab 只停在選中項；多選：role=group，各自切換 */
  /* TXT-OPTICAL:v3 純中文的 Tag／Chip 文字加 data-cjk（換語系、改文字都會重算）；Mac 加 html.os-mac */
  (function(){const R=document.documentElement;try{const ud=navigator.userAgentData;if((ud&&ud.platform==='macOS')||/Mac|iPhone|iPad/.test(navigator.platform||''))R.classList.add('os-mac');}catch(e){}
    const CJK=/[\u3400-\u9fff]/,ONLY=/^[\s\u3000-\u303f\u3400-\u9fff\uff00-\uffef·]+$/;
    const SEL='.tg > span, .chp-t';
    const fix=sp=>{const t=sp.textContent.trim();const on=!!t&&CJK.test(t)&&ONLY.test(t);if(on!==sp.hasAttribute('data-cjk'))sp.toggleAttribute('data-cjk',on);};
    /* 只檢查有變動的節點（首頁動畫會頻繁改字，不整頁重掃） */
    const onMut=recs=>{for(const r of recs){const n=r.target;
      if(n.nodeType===3){const sp=n.parentElement&&n.parentElement.closest(SEL);if(sp)fix(sp);continue;}
      if(n.matches&&n.matches(SEL))fix(n);
      r.addedNodes.forEach(a=>{if(a.nodeType!==1)return;if(a.matches(SEL))fix(a);if(a.firstElementChild)a.querySelectorAll(SEL).forEach(fix);});}};
    const start=()=>{document.querySelectorAll(SEL).forEach(fix);new MutationObserver(onMut).observe(document.body,{childList:true,subtree:true,characterData:true});};
    if(document.body)start();else document.addEventListener('DOMContentLoaded',start);})();
  function chpGroup(type,size,o){o=o||{};const g=ce('div','chp-grp');g.setAttribute('role',type==='multi'?'group':'radiogroup');if(o.label)g.setAttribute('aria-label',o.label);if(o.labelledby)g.setAttribute('aria-labelledby',o.labelledby);
    let val=type==='multi'?new Set(o.value||[]):o.value;
    const btns=(o.items||[]).map(it=>{const b=chpEl(type,it.disabled?'disabled':'default',size,{label:it.label,dot:it.dot,icon:it.icon,live:o.live!==false,key:it.k});g.appendChild(b);return b;});
    const paint=()=>btns.forEach(b=>{const on=type==='multi'?val.has(b.dataset.k):b.dataset.k===val;b.setAttribute('aria-checked',String(on));if(type!=='multi')b.tabIndex=on?0:-1;});
    if(type!=='multi'&&!btns.some(b=>b.dataset.k===val)){const f=btns.find(b=>!b.disabled);if(f)val=f.dataset.k;}
    const emit=()=>{if(o.onChange)o.onChange(type==='multi'?[...val]:val);};
    btns.forEach((b,i)=>{b.onclick=()=>{if(b.disabled)return;const k=b.dataset.k;
        if(type==='multi'){val.has(k)?val.delete(k):val.add(k);}else{if(val===k)return;val=k;}paint();emit();};
      if(type!=='multi')b.onkeydown=e=>{const d={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(!d)return;e.preventDefault();
        let n=i;do{n=(n+d+btns.length)%btns.length;}while(btns[n].disabled&&n!==i);const nb=btns[n];nb.focus();if(nb.dataset.k!==val){val=nb.dataset.k;paint();emit();}};});
    paint();g.__btns=btns;return g;}
  const CHP_DEMO=[{k:'dense',label:'密集'},{k:'mid',label:'適中'},{k:'loose',label:'寬鬆'},{k:'xl',label:'特寬'}];
  const CHP_DOTS=['#1C1C20','#2563EB','#16A34A','#EA580C'];
  LIVE.chip=(host)=>mountLive(host,{gate:'chip',
    initial:{type:'single',size:'m',dot:false,icon:false,disabled:false},
    segs:[{key:'type',label:'Type',options:['single','multi'],labels:['單選','多選']},{key:'size',label:'Size',options:['s','m','l']}],
    bools:[{key:'dot',label:'dot 色點'},{key:'icon',label:'icon 圖示'},{key:'disabled',label:'disabled 停用一項'}],boolLabel:'Content',
    render:(st,sync)=>{const items=CHP_DEMO.map((it,i)=>Object.assign({},it,{dot:st.dot?CHP_DOTS[i]:null,icon:st.icon?PI('sparkles'):null,disabled:st.disabled&&i===3}));
      const w=ce('div');w.style.cssText='width:100%;max-width:460px;display:flex;justify-content:center;';
      w.appendChild(chpGroup(st.type,st.size,{items,value:st.type==='multi'?['mid','loose']:'mid',label:'示範選項',onChange:()=>sync&&sync()}));return w;},
    note:'單選＝radiogroup（方向鍵移動並選取，Tab 只停在選中項）；多選＝group（各自切換）。'});
  function buildChip(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Chip',title:'Chip 選擇膠囊',
      lede:'可點選的膠囊，給<b>少量選項的單選或多選</b>（風格方向、篩選條件、偏好）。<b>type × state × size（2 × 4 × 3 = 24）</b>；未選＝<code>--panel-2</code> 底、選中＝<code>--ink</code> 底＋<code>--panel</code> 字，單選與多選外觀相同。高度綁 <code>--ctl-h-xs／s／m</code>（24／32／40）。和 <a href="#tag">Tag</a> 的差別：Tag 只顯示狀態、不能點。',
      specRows:[['axes','<code>type × state × size</code>'],['formula','<code>2 × 4 × 3 = 24</code>'],['boolean','<code>dot · icon</code>'],['token-policy','<code>--chp-*</code> → <code>--ctl-h-*</code>／<code>--r-pill</code>／<code>--panel-2</code>／<code>--ink</code>']]});
    const TN={single:['單選','single'],multi:['多選','multi']},SN={default:['預設','default'],hover:['滑過','hover'],selected:['選中','selected'],disabled:['停用','disabled']},ZN={s:['24','s'],m:['32','m'],l:['40','l']};
    const axes=DIAL_SPECS.chip.axes,zh=DIAL_SPECS.chip.zh,active=CHOICE.chip.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';axes.type.filter(t=>active.type.has(t)).forEach(t=>{
      const sts=axes.state.filter(v=>active.state.has(v)),szs=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'type · '+t,name:TN[t][0]+' '+TN[t][1],rows:sts,cols:szs,rowLab:v=>labHTML(SN[v][0],SN[v][1]),colLab:z=>labHTML(ZN[z][0],ZN[z][1]),
        cell:(v,z)=>chpEl(t,v,z,{label:'適中'}),mincol:140}));});}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Size 矩陣','每個 type 一塊；列＝狀態、欄＝尺寸。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容','boolean：dot 色點（用色選擇等）、icon 前置圖示。');
    capRow(cs,[['dot 色點',chpGroup('single','m',{items:[{k:'a',label:'冷靜',dot:'#2563EB'},{k:'b',label:'自然',dot:'#16A34A'},{k:'c',label:'溫暖',dot:'#EA580C'}],value:'a',live:false})],
      ['icon 圖示',chpGroup('multi','m',{items:[{k:'a',label:'精選',icon:PI('sparkles')},{k:'b',label:'免運',icon:PI('truck')}],value:['a'],live:false})]]);
    usageSection(body,[['用 Chip','2～8 個選項、想讓所有選項一眼看完，例如風格方向、篩選條件。'],['改用 Segmented','切換同一份內容的檢視方式、選項固定連成一條。'],['改用 Radio／Checkbox','在表單裡、選項文字較長或需要說明。'],['改用 Dropdown','選項超過 8 個。'],['改用 Tag','只是顯示狀態、不能點。']]);
    const sl=section(body,'互動預覽與程式碼','點選或用方向鍵切換。');LIVE.chip(sl);
  }

  /* ---------- SLIDER 滑桿 ---------- */
  /* ---- Slider · fill 填充式（2026-11-04）：整條就是控制項——標籤在左、數值在右、填色＝目前值、握把在填色邊緣；
     點或拖任何位置都能調、鍵盤同 track 版；單值與區間共用。尺寸 s＝32px、m＝40px。 ---- */
  function fslEl(type,size,state,o){o=o||{};const min=o.min!=null?o.min:0,max=o.max!=null?o.max:100,step=o.step||1;
    let v=o.value!=null?o.value:(type==='range'?[20,70]:60);const fmt=x=>o.format?o.format(x):String(x);
    const w=ce('div',`fsl fsl-x fsl-sz-${size} fsl-${type} st-${state}`+(state==='hover'?' is-hover':'')+(state==='focus'?' is-focus':''));
    const fill=ce('span','fsl-fill');w.appendChild(fill);
    if(o.marks!==false){const tk=ce('span','fsl-ticks');tk.setAttribute('aria-hidden','true');for(let i=0;i<11;i++)tk.appendChild(ce('i'));w.appendChild(tk);}
    let val=null;if(o.label!==false){const lb=ce('span','fsl-lb');lb.textContent=o.title||(type==='range'?'價格區間':'音量');val=ce('span','fsl-val');w.append(lb,val);}
    const hs=(type==='range'?[0,1]:[0]).map(k=>{const h=ce('span','fsl-h');h.setAttribute('role','slider');h.tabIndex=state==='disabled'?-1:0;h.setAttribute('aria-valuemin',min);h.setAttribute('aria-valuemax',max);
      h.setAttribute('aria-label',type==='range'?(k?'最高':'最低'):(o.title||'數值'));if(state==='disabled')h.setAttribute('aria-disabled','true');w.appendChild(h);return h;});
    const pc=x=>(x-min)/(max-min)*100;
    function paint(){const vs=type==='range'?v:[v];const ps=vs.map(pc);
      if(type==='range'){w.style.setProperty('--a',ps[0]+'%');w.style.setProperty('--b',ps[1]+'%');}else{w.style.setProperty('--a','0%');w.style.setProperty('--b',ps[0]+'%');}
      hs.forEach((h,k)=>{h.style.setProperty('--p',ps[k]+'%');h.setAttribute('aria-valuenow',vs[k]);h.setAttribute('aria-valuetext',fmt(vs[k]));});
      if(val)val.textContent=type==='range'?fmt(vs[0])+' – '+fmt(vs[1]):fmt(vs[0]);}
    paint();
    if(o.live&&state!=='disabled'){
      const setK=(k,x)=>{x=Math.round(Math.min(max,Math.max(min,x))/step)*step;x=+x.toFixed(6);
        if(type==='range'){const a=v.slice();a[k]=x;if(a[0]>a[1])a[k]=k?a[0]:a[1];v=a;}else v=x;paint();if(o.onChange)o.onChange(v);};
      const valAt=cx=>{const r=w.getBoundingClientRect();return min+(cx-r.left)/r.width*(max-min);};
      w.addEventListener('pointerdown',e=>{if(e.button)return;e.preventDefault();const x=valAt(e.clientX);const k=type==='range'?(Math.abs(x-v[0])<=Math.abs(x-v[1])?0:1):0;
        w.setPointerCapture(e.pointerId);w.classList.add('is-drag');hs[k].focus({preventScroll:true});setK(k,x);
        const mv=ev=>setK(k,valAt(ev.clientX));const up=()=>{w.classList.remove('is-drag');w.removeEventListener('pointermove',mv);w.removeEventListener('pointerup',up);w.removeEventListener('pointercancel',up);};
        w.addEventListener('pointermove',mv);w.addEventListener('pointerup',up);w.addEventListener('pointercancel',up);});
      hs.forEach((h,k)=>h.addEventListener('keydown',e=>{const cur=type==='range'?v[k]:v,big=(max-min)/10;
        const d={ArrowRight:step,ArrowUp:step,ArrowLeft:-step,ArrowDown:-step,PageUp:big,PageDown:-big}[e.key];
        if(d!=null){e.preventDefault();setK(k,cur+d);}else if(e.key==='Home'){e.preventDefault();setK(k,min);}else if(e.key==='End'){e.preventDefault();setK(k,max);}}));}
    return w;}
  function sldEl(type,size,state,o){o=o||{};if(o.variant==='fill')return fslEl(type,size,state,o);const min=o.min!=null?o.min:0,max=o.max!=null?o.max:100,step=o.step||1;
    let v=o.value!=null?o.value:(type==='range'?[20,70]:60);const fmt=x=>o.format?o.format(x):String(x);
    const w=ce('div',`sld sld-${type} sld-sz-${size} st-${state}`);
    let lab=null;if(o.label!==false){const hd=ce('div','sld-head');const t=ce('span');t.textContent=o.title||(type==='range'?'價格區間':'音量');lab=ce('span','sld-val');hd.append(t,lab);w.appendChild(hd);}
    const track=ce('div','sld-track');const fill=ce('div','sld-fill');track.appendChild(fill);
    if(o.marks){const mk=ce('div','sld-marks');for(let i=0;i<=4;i++){const m=ce('span','sld-mark');m.style.left=(i*25)+'%';mk.appendChild(m);}track.appendChild(mk);}
    const thumbs=(type==='range'?[0,1]:[0]).map(k=>{const t=ce('span','sld-thumb'+(state==='hover'&&k===thumbsLast(type)?' is-hover':'')+(state==='focus'&&k===0?' is-focus':''));
      t.setAttribute('role','slider');t.tabIndex=state==='disabled'?-1:0;t.setAttribute('aria-valuemin',min);t.setAttribute('aria-valuemax',max);
      t.setAttribute('aria-label',type==='range'?(k?'最高':'最低'):(o.title||'數值'));if(state==='disabled')t.setAttribute('aria-disabled','true');
      if(o.tip)t.appendChild(ce('span','sld-tip'));track.appendChild(t);return t;});
    w.appendChild(track);
    function paint(){const vs=type==='range'?v:[v];const pct=vs.map(x=>(x-min)/(max-min)*100);
      thumbs.forEach((t,k)=>{t.style.left=pct[k]+'%';t.setAttribute('aria-valuenow',vs[k]);t.setAttribute('aria-valuetext',fmt(vs[k]));const tp=t.querySelector('.sld-tip');if(tp)tp.textContent=fmt(vs[k]);});
      if(type==='range'){fill.style.left=pct[0]+'%';fill.style.width=(pct[1]-pct[0])+'%';}else{fill.style.left='0';fill.style.width=pct[0]+'%';}
      if(lab)lab.textContent=type==='range'?fmt(vs[0])+' – '+fmt(vs[1]):fmt(vs[0]);}
    paint();
    if(o.live&&state!=='disabled'){
      const setK=(k,x)=>{x=Math.round(Math.min(max,Math.max(min,x))/step)*step;
        if(type==='range'){const a=v.slice();a[k]=x;if(a[0]>a[1])a[k]=k?a[0]:a[1];v=a;}else v=x;paint();if(o.onChange)o.onChange(v);}; // 區間兩端不交叉
      const valAt=cx=>{const r=track.getBoundingClientRect();return min+(cx-r.left)/r.width*(max-min);};
      thumbs.forEach((t,k)=>{
        t.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();t.setPointerCapture(e.pointerId);t.classList.add('is-drag');t.focus({preventScroll:true});
          const mv=ev=>setK(k,valAt(ev.clientX));const up=()=>{t.classList.remove('is-drag');t.removeEventListener('pointermove',mv);t.removeEventListener('pointerup',up);t.removeEventListener('pointercancel',up);};
          t.addEventListener('pointermove',mv);t.addEventListener('pointerup',up);t.addEventListener('pointercancel',up);});
        t.addEventListener('keydown',e=>{const cur=type==='range'?v[k]:v,big=(max-min)/10;
          const d={ArrowRight:step,ArrowUp:step,ArrowLeft:-step,ArrowDown:-step,PageUp:big,PageDown:-big}[e.key];
          if(d!=null){e.preventDefault();setK(k,cur+d);}else if(e.key==='Home'){e.preventDefault();setK(k,min);}else if(e.key==='End'){e.preventDefault();setK(k,max);}});});
      track.addEventListener('pointerdown',e=>{if(e.target.closest('.sld-thumb'))return;const x=valAt(e.clientX);const k=type==='range'?(Math.abs(x-v[0])<=Math.abs(x-v[1])?0:1):0;
        track.classList.add('is-jump');setK(k,x);afterTransition(thumbs[k],()=>track.classList.remove('is-jump'));thumbs[k].focus({preventScroll:true});});
    }
    return w;}
  function thumbsLast(type){return type==='range'?1:0;}
  const SLD_PRICE={min:0,max:5000,step:100,format:x=>'NT$ '+x.toLocaleString('en-US')};
  LIVE.slider=(host)=>mountLive(host,{gate:'slider',
    initial:{variant:'track',type:'range',size:'m',label:true,tip:true,marks:false,disabled:false},
    segs:[{key:'variant',label:'Variant',options:['track','fill'],labels:['軌道','填充']},{key:'type',label:'Type',options:['single','range'],labels:['單值','區間']},{key:'size',label:'Size',options:['s','m']}],
    bools:[{key:'label',label:'label 標題與數值'},{key:'tip',label:'tip 拖曳時顯示數值'},{key:'marks',label:'marks 刻度'},{key:'disabled',label:'disabled 停用'}],boolLabel:'Content',
    render:(st,sync)=>{const o=st.type==='range'?Object.assign({value:[500,2000],title:'價格區間'},SLD_PRICE):{value:60,title:'音量',format:x=>x+'%'};
      const w=ce('div');w.style.cssText='width:100%;max-width:360px;padding-top:var(--sp-4);';
      w.appendChild(sldEl(st.type,st.size,st.disabled?'disabled':'default',Object.assign(o,{live:true,variant:st.variant,label:st.label,tip:st.tip,marks:st.variant==='fill'?true:st.marks})));return w;},
    note:'拖曳圓鈕、或直接點軌道跳到該位置；鍵盤可用方向鍵（±1 級距）、PageUp／PageDown（±10%）、Home／End。區間的兩端不會交叉。'});
  function buildSlider(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Slider',title:'Slider 滑桿',
      lede:'在一段連續範圍裡選一個值或一個區間：價格篩選、音量、透明度。兩種樣式（軌道／填充）× 兩種 type × 兩級 size × 四種狀態（<b>2 × 2 × 2 × 4 = 32</b>）。填充式把整條當成控制項：標籤在左、數值在右，適合設定面板。需要精確數字時旁邊應再配 <a href="#input">input</a>。',
      specRows:[['axes','<code>variant × type × size × state</code>'],['formula','<code>2 × 2 × 2 × 4 = 32</code>'],['token-policy','<code>semantic.*.slider.*</code>'],['features','label / tip / marks']]});
    const TN={single:['單值','single'],range:['區間','range']},STN={default:['預設','default'],hover:['滑過','hover'],focus:['聚焦','focus'],disabled:['停用','disabled']};
    const axes=DIAL_SPECS.slider.axes,zh=DIAL_SPECS.slider.zh,active=CHOICE.slider.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ts=axes.type.filter(v=>active.type.has(v)),sts=axes.state.filter(v=>active.state.has(v));
      axes.variant.filter(v=>active.variant.has(v)).forEach(vr=>axes.size.filter(v=>active.size.has(v)).forEach(sz=>p.appendChild(matrixPanel({badge:(vr==='fill'?'填充':'軌道')+' · size '+sz,name:'State × Type（'+(vr==='fill'?'填充':'軌道')+'·'+(sz==='s'?'細':'標準')+'）',rows:sts,cols:ts,
        rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:t=>labHTML(TN[t][0],TN[t][1]),cell:(s,t)=>sldEl(t,sz,s,vr==='fill'?{variant:'fill',title:t==='range'?'價格區間':'音量',format:t==='range'?(x=>x):(x=>x+'%')}:{label:false}),mincol:260}))));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Type 矩陣','每級尺寸一張：列＝狀態、欄＝單值／區間。聚焦時圓鈕外加一圈淡外框。');p=panelsIn(sec);renderM();
    const vsec=section(body,'Variant 樣式軸','軌道式適合放在內容裡；填充式把整條當成控制項（標籤在左、數值在右），適合設定面板與工具列。');
    (capRow(vsec,[['軌道 · 單值',sldEl('single','m','default',{live:true,value:60,title:'音量',format:x=>x+'%'})],['軌道 · 區間',sldEl('range','m','default',Object.assign({live:true,value:[500,2000],title:'價格區間'},SLD_PRICE))],
      ['填充 · 單值',sldEl('single','m','default',{live:true,variant:'fill',value:40,title:'磨砂程度',format:x=>x+'%'})],['填充 · 區間',sldEl('range','m','default',Object.assign({live:true,variant:'fill',value:[500,2000],title:'價格區間'},SLD_PRICE))]])).classList.add('sld-row');
    const cs=section(body,'Content 內容軸（boolean）','標題與數值、刻度都是內容開關。');
    (capRow(cs,[['標題＋數值',sldEl('range','m','default',Object.assign({value:[500,2000],title:'價格區間'},SLD_PRICE))],['刻度',sldEl('single','m','default',{marks:true,value:50,format:x=>x+'%'})]])).classList.add('sld-row');
    usageSection(body,[['用 Slider','範圍比精確值重要、而且希望即時看到結果（篩選、音量）。'],['改用 Number input','使用者知道確切數字，或需要精準輸入。'],['改用 Segmented','只有 3～5 個固定級距。']]);
    const sl=section(body,'互動預覽與程式碼','拖曳、點軌道、或用鍵盤調整。');LIVE.slider(sl);
  }

  /* ---------- FIELD 表單欄位 ---------- */
  let FLD_ID=0;
  function fldEl(layout,state,o){o=o||{};const f=ce('div',`fld fld-${layout} st-${state}`);
    const lb=ce('label','fld-label');lb.innerHTML=(o.label||'電子郵件')+(o.required?'<span class="req" aria-hidden="true">*</span>':'')+(o.optional?'<span class="fld-opt">選填</span>':'');
    const ctl=ce('div','fld-ctl');let box;
    if(o.live){box=ce('div','field v-outline'+(state==='error'?' st-error':'')+(state==='disabled'?' st-disabled':''));
      const inp=document.createElement('input');inp.className='bare';inp.placeholder=o.placeholder||'name@example.com';inp.value=o.value||'';inp.id='fld-'+(++FLD_ID);
      if(o.required)inp.required=true;if(state==='disabled')inp.disabled=true;lb.htmlFor=inp.id;box.appendChild(inp);}
    else box=inputEl('outline',state==='error'?'error':state==='disabled'?'disabled':state==='filled'?'filled-value':'default');
    box.classList.add('fld-box');ctl.appendChild(box);
    const msg=ce('div','fld-msg');
    if(state==='error'){msg.classList.add('is-err');msg.innerHTML=`<span class="fld-msg-ic">${NT_IC_ERROR}</span><span>${o.error||'請輸入正確的 Email 格式'}</span>`;}
    else if(o.hint)msg.textContent=o.hint===true?'我們會寄送驗證信到這個信箱。':o.hint;
    if(o.counter){const c=ce('span','fld-count');c.textContent='12 / 40';msg.appendChild(c);}
    if(msg.childNodes.length){msg.id='fld-msg-'+(++FLD_ID);const inp=box.querySelector('input');if(inp)inp.setAttribute('aria-describedby',msg.id);ctl.appendChild(msg);}
    f.append(lb,ctl);return f;}
  /* 表單：欄位容器＋表單版面＋錯誤摘要（取用 input、alert、button 原子）；送出時驗證、修正後即時清除 */
  function frmLive(layout){
    const w=ce('form','frm');w.noValidate=true;w.setAttribute('aria-label','建立帳號');
    const sum=ce('div','frm-sum');sum.setAttribute('aria-live','polite');w.appendChild(sum);
    const grid=ce('div','frm-grid');const F={};
    [{k:'last',label:'姓氏',req:true,ph:'林',half:true},{k:'first',label:'名字',req:true,ph:'語晨',half:true},
     {k:'email',label:'電子郵件',req:true,ph:'name@example.com',hint:'我們會寄送驗證信到這個信箱。',test:v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),err:'請輸入正確的 Email 格式'},
     {k:'phone',label:'手機',opt:true,ph:'0912-345-678',test:v=>/^09\d{2}-?\d{3}-?\d{3}$/.test(v),err:'手機格式為 09 開頭的 10 碼'}]
    .forEach(d=>{const f=fldEl(layout,'default',{live:true,label:d.label,required:d.req,optional:d.opt,placeholder:d.ph,hint:d.hint});if(d.half&&layout==='vertical')f.classList.add('frm-half');
      grid.appendChild(f);F[d.k]={d,inp:f.querySelector('input'),box:f.querySelector('.field'),ctl:f.querySelector('.fld-ctl')};});
    w.appendChild(grid);
    const act=ce('div','frm-actions');const clr=mkBtn({variant:'text',intent:'secondary',size:'m',isLive:true});clr.type='button';clr.querySelector('span').textContent='清除';
    const ok=mkBtn({variant:'solid',intent:'primary',size:'m',isLive:true});ok.type='submit';ok.querySelector('span').textContent='建立帳號';act.append(clr,ok);w.appendChild(act);
    const check=x=>{const v=x.inp.value.trim();if(x.d.req&&!v)return '請填寫'+x.d.label;if(v&&x.d.test&&!x.d.test(v))return x.d.err;return '';};
    function setErr(x,m){let el=x.ctl.querySelector('.fld-msg');if(!el){el=ce('div','fld-msg');el.id='fld-msg-'+(++FLD_ID);x.inp.setAttribute('aria-describedby',el.id);x.ctl.appendChild(el);}
      if(m){x.box.classList.add('st-error');x.inp.setAttribute('aria-invalid','true');el.className='fld-msg is-err';el.innerHTML=`<span class="fld-msg-ic">${NT_IC_ERROR}</span><span>${m}</span>`;}
      else{x.box.classList.remove('st-error');x.inp.removeAttribute('aria-invalid');el.className='fld-msg';if(x.d.hint)el.textContent=x.d.hint;else el.remove();}}
    function showSum(errs){sum.innerHTML='';if(!errs)return;let a;
      if(errs.length){a=alEl('soft','error',{});a.querySelector('.al-title').textContent=`有 ${errs.length} 個欄位需要修正`;
        const d=a.querySelector('.al-desc');d.textContent='';errs.forEach((k,i)=>{if(i)d.appendChild(document.createTextNode('、'));const l=document.createElement('a');l.href='#';l.textContent=F[k].d.label;
          l.onclick=e=>{e.preventDefault();F[k].inp.focus();};d.appendChild(l);});}
      else{a=alEl('soft','success',{});a.querySelector('.al-title').textContent='帳號已建立';a.querySelector('.al-desc').textContent='驗證信已寄出，請到信箱完成啟用。';}
      a.classList.add('al-in');sum.appendChild(a);}
    w.addEventListener('submit',e=>{e.preventDefault();const errs=[];Object.entries(F).forEach(([k,x])=>{const m=check(x);setErr(x,m);if(m)errs.push(k);});
      showSum(errs);if(errs.length)F[errs[0]].inp.focus();});
    Object.values(F).forEach(x=>x.inp.addEventListener('input',()=>{if(!x.box.classList.contains('st-error')||check(x))return;setErr(x,'');
      const left=Object.keys(F).filter(k=>F[k].box.classList.contains('st-error'));showSum(left.length?left:null);}));
    clr.onclick=()=>{Object.values(F).forEach(x=>{x.inp.value='';setErr(x,'');});showSum(null);};
    return w;}
  LIVE.field=(host)=>mountLive(host,{gate:'field',initial:{layout:'vertical'},
    segs:[{key:'layout',label:'Layout',options:['vertical','horizontal'],labels:['標籤在上','標籤在左']}],
    render:st=>frmLive(st.layout),
    note:'直接按「建立帳號」看錯誤：欄位轉紅並說明原因、上方出現錯誤摘要（點欄位名稱會跳到該欄）；修正後錯誤即時消失，全部正確就顯示成功。'});
  function buildField(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Field',title:'Field 表單欄位',
      lede:'把「標籤＋輸入控制項＋提示／錯誤訊息」包成一個單位，再把多個欄位排成表單。控制項取用既有的 <a href="#input">input</a>、<a href="#dropdown">dropdown</a>，錯誤摘要取用 <a href="#alert">alert</a>（鐵則 5）。兩種 layout × 四種狀態（<b>2 × 4 = 8</b>）。',
      specRows:[['axes','<code>layout × state</code>'],['formula','<code>2 × 4 = 8</code>'],['token-policy','<code>semantic.*.form.*</code>'],['features','required / optional / hint / counter / error-summary']]});
    const LN={vertical:['標籤在上','vertical'],horizontal:['標籤在左','horizontal']},STN={default:['預設','default'],filled:['已填值','filled'],error:['錯誤','error'],disabled:['停用','disabled']};
    const axes=DIAL_SPECS.field.axes,zh=DIAL_SPECS.field.zh,active=CHOICE.field.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ls=axes.layout.filter(v=>active.layout.has(v)),ss=axes.state.filter(v=>active.state.has(v));
      p.appendChild(matrixPanel({badge:'content · label＋hint',name:'State × Layout',rows:ss,cols:ls,rowLab:s=>labHTML(STN[s][0],STN[s][1]),colLab:l=>labHTML(LN[l][0],LN[l][1]),
        cell:(s,l)=>fldEl(l,s,{required:true,hint:true}),mincol:340}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'State × Layout 矩陣','錯誤時訊息取代提示文字，並帶錯誤圖示（不只靠紅色傳達）。標籤在左適合欄位多、螢幕寬的後台；手機一律改回標籤在上。');p=panelsIn(sec);renderM();
    const cs=section(body,'Content 內容軸（boolean）','');
    capRow(cs,[['必填 required',fldEl('vertical','default',{required:true})],['選填 optional',fldEl('vertical','default',{optional:true,label:'公司名稱'})],
      ['提示 hint',fldEl('vertical','default',{hint:true})],['字數 counter',fldEl('vertical','filled',{counter:true,label:'暱稱'})]]);
    usageSection(body,[['必填與選填','多數欄位必填時只標「選填」，少數必填時只標「*」，不要兩種都標。'],['錯誤訊息','說清楚怎麼改（「請輸入 09 開頭的 10 碼」），不要只寫「格式錯誤」。'],['錯誤摘要','欄位超過一屏時一定要有，送出後焦點移到第一個錯誤欄位。']]);
    const sl=section(body,'互動預覽與程式碼','實際送出看驗證流程。');LIVE.field(sl);
  }

  /* ---------- STACK 版面排列 ---------- */
  function stkEl(dir,gap,o){o=o||{};const w=ce('div','stk-wrap');const tag=ce('span','stk-tag');
    tag.textContent=({vertical:'Stack',horizontal:'Inline',grid:'Grid'}[dir])+' · gap var('+gap+')';
    const s=ce('div',`stk stk-${dir}`);s.style.gap=`var(${gap})`;
    if(o.align)s.style.alignItems=o.align;if(o.justify)s.style.justifyContent=o.justify;if(o.wrap&&dir==='horizontal')s.style.flexWrap='wrap';
    const n=o.n||(dir==='grid'?6:(o.wrap?7:3));
    for(let i=0;i<n;i++){const b=ce('div','stk-box');b.textContent=i+1;
      if(o.varied){if(dir==='vertical')b.style.height=[28,40,32][i%3]+'px';else if(dir==='horizontal')b.style.width=[56,84,44,72,60,48,90][i%7]+'px';}
      else if(dir==='horizontal'&&!o.wrap)b.style.width='56px';
      s.appendChild(b);}
    w.append(tag,s);return w;}
  LIVE.stack=(host)=>mountLive(host,{gate:'stack',
    initial:{direction:'horizontal',gap:'--sp-3',align:'center',justify:'flex-start',wrap:false,varied:true},
    segs:[{key:'direction',label:'Direction',options:['vertical','horizontal','grid'],labels:['Stack 直排','Inline 橫排','Grid 格狀']},
          {key:'gap',label:'Gap',options:['--sp-1','--sp-2','--sp-3','--sp-4','--sp-5','--sp-6'],labels:['sp-1','sp-2','sp-3','sp-4','sp-5','sp-6']},
          {key:'align',label:'Align',options:['flex-start','center','flex-end','stretch'],labels:['起點','置中','終點','撐滿']},
          {key:'justify',label:'Justify',options:['flex-start','center','space-between'],labels:['起點','置中','分散']}],
    bools:[{key:'wrap',label:'wrap 換行（Inline）'},{key:'varied',label:'不等尺寸子項'}],boolLabel:'Options',
    render:st=>stkEl(st.direction,st.gap,{align:st.align,justify:st.justify,wrap:st.wrap,varied:st.varied}),
    note:'gap 只能選 --sp-* token，程式碼區會直接寫成 var(--sp-x)；同樣的設定在 Figma 就是 auto layout 的 spacing 綁 spacing variable。'});
  function buildStack(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Stack',title:'Stack 版面排列',
      lede:'用 token 控制間距的排版容器：<b>Stack</b> 直排、<b>Inline</b> 橫排、<b>Grid</b> 格狀。間距只能選 <code>--sp-*</code>，不再在各元件裡寫 margin。三種 direction × 四級常用 gap（<b>3 × 4 = 12</b>）；完全對應 Figma 的 auto layout。',
      specRows:[['axes','<code>direction × gap</code>'],['formula','<code>3 × 4 = 12</code>'],['token-policy','<code>spacing.*（--sp-1～--sp-6）</code>'],['features','align / justify / wrap']]});
    const DN={vertical:['Stack 直排','vertical'],horizontal:['Inline 橫排','horizontal'],grid:['Grid 格狀','grid']};
    const axes=DIAL_SPECS.stack.axes,zh=DIAL_SPECS.stack.zh,active=CHOICE.stack.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ds=axes.direction.filter(v=>active.direction.has(v)),gs=axes.gap.filter(v=>active.gap.has(v));
      p.appendChild(matrixPanel({badge:'子項 · 等尺寸',name:'Direction × Gap',rows:ds,cols:gs,rowLab:d=>labHTML(DN[d][0],DN[d][1]),colLab:g=>labHTML(g,'--'+g),
        cell:(d,g)=>stkEl(d,'--'+g,{}),mincol:220}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Direction × Gap 矩陣','虛線框＝容器、白塊＝子項；只有 gap 改變，子項本身不帶外距。');p=panelsIn(sec);renderM();
    const fs=section(body,'對應 Figma auto layout','程式與 Figma 用同一組設定，設計稿與程式的間距不會各自漂移（鐵則 4）。');
    const mp=ce('div','row-demo');mp.style.display='block';
    mp.innerHTML='<div class="stk-map"><b>Stack</b><span>Auto layout · Vertical</span><b>Inline</b><span>Auto layout · Horizontal（wrap 對應 Wrap）</span><b>Grid</b><span>Auto layout · Grid</span>'
      +'<b>gap: var(--sp-3)</b><span>Spacing between items 綁 spacing variable「sp-3」</span><b>align／justify</b><span>Alignment 九宮格＋Spacing mode（Packed／Space between）</span></div>';
    fs.appendChild(mp);
    usageSection(body,[['用 Stack','任何「一排東西加固定間距」：表單欄位、卡片內文、按鈕列。'],['不要用 margin','元件本身不帶外距，間距一律交給外層 Stack，換位置時不會多出或少掉空白。']]);
    const sl=section(body,'互動預覽與程式碼','切方向、gap token、對齊方式，看程式碼區的 var(--sp-x)。');LIVE.stack(sl);
  }

  /* ---------- APP SHELL 應用程式框架 ---------- */
  const SHL_NAV=['總覽','訂單','顧客','設定'];
  function shlEl(layout,device,o){o=o||{};const mob=device==='mobile';
    const sh=ce('div',`shl shl-${layout} shl-${device}`+(o.collapsed&&!mob?' is-collapsed':''));
    const hasSide=layout!=='top'||mob,hasTop=layout!=='side'||mob;
    if(hasTop){const tb=ce('header','shl-top');
      if(mob||(o.live&&hasSide)){const mb=mkBtn({variant:'text',intent:'secondary',size:'s',iconOnly:true,isLive:!!o.live});mb.innerHTML=ICON_LIST;mb.classList.add('shl-menu-btn');
        mb.setAttribute('aria-label',mob?'開啟選單':'收合側欄');mb.setAttribute('aria-expanded',mob?'false':String(!o.collapsed));tb.appendChild(mb);}
      const lg=ce('span','shl-logo');lg.textContent='cool-ds';tb.appendChild(lg);
      if(layout==='top'&&!mob)tb.appendChild(mnBar('horizontal','s',{items:SHL_NAV.slice(0,3),activeIndex:0,clickable:!!o.live}));
      tb.appendChild(ce('span','shl-sp'));
      const bell=mkBtn({variant:'text',intent:'secondary',size:'s',iconOnly:true,isLive:!!o.live});bell.innerHTML=IC_BELL;bell.setAttribute('aria-label','通知');tb.appendChild(bell);
      tb.appendChild(avtEl('s','circle','initials',{initials:'林'}));sh.appendChild(tb);}
    const body=ce('div','shl-body');
    if(hasSide){const sd=ce('nav','shl-side');sd.setAttribute('aria-label','主選單');
      if(!hasTop){const lg=ce('div','shl-side-logo');lg.textContent='cool-ds';sd.appendChild(lg);}
      sd.appendChild(mnBar('vertical','s',{items:SHL_NAV,activeIndex:0,icon:true,clickable:!!o.live}));
      if(!hasTop&&o.live){const cb=mkBtn({variant:'text',intent:'secondary',size:'s',iconOnly:true,isLive:true});cb.innerHTML=ICON_LIST;cb.classList.add('shl-collapse','shl-menu-btn');
        cb.setAttribute('aria-label','收合側欄');cb.setAttribute('aria-expanded',String(!o.collapsed));sd.appendChild(cb);}
      body.appendChild(sd);}
    const main=ce('main','shl-main');main.innerHTML='<div class="shl-h"></div><div class="shl-cards"><span></span><span></span><span></span></div><div class="shl-ln"></div><div class="shl-ln s"></div>';
    body.appendChild(main);
    if(hasSide&&mob){const sc=ce('div','shl-scrim');body.appendChild(sc);if(o.live)sc.onclick=()=>{sh.classList.remove('is-open');const b=sh.querySelector('.shl-menu-btn');if(b)b.setAttribute('aria-expanded','false');};}
    sh.appendChild(body);
    if(o.live)sh.querySelectorAll('.shl-menu-btn').forEach(b=>b.onclick=()=>{
      if(mob){const on=sh.classList.toggle('is-open');b.setAttribute('aria-expanded',String(on));}
      else{const c=sh.classList.toggle('is-collapsed');b.setAttribute('aria-expanded',String(!c));}
      if(o.onChange)o.onChange();});
    return sh;}
  LIVE['app-shell']=(host)=>mountLive(host,{gate:'app-shell',initial:{layout:'side-top',device:'desktop',collapsed:false},
    segs:[{key:'layout',label:'Layout',options:['side','top','side-top'],labels:['側欄','頂欄','側欄＋頂欄']},{key:'device',label:'Device',options:['desktop','mobile'],labels:['電腦版','行動版']}],
    bools:[{key:'collapsed',label:'collapsed 側欄收合（電腦版）'}],boolLabel:'State',
    render:(st,sync)=>shlEl(st.layout,st.device,{live:true,collapsed:st.collapsed,onChange:()=>sync&&sync()}),
    note:'電腦版按選單鈕收合側欄（只留圖示，寬度平滑收起）；行動版按漢堡鈕從左側滑出選單，點遮罩關閉。導覽列用的是 Menu 元件、右上角是 Avatar 與 Button。'});
  function buildAppShell(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · App Shell',title:'App Shell 應用程式框架',
      lede:'後台與工具型產品的頁面骨架：頂欄、側欄導覽、內容區。三種 layout × 兩種 device（<b>3 × 2 = 6</b>）。內部全部取用既有原子：<a href="#menu">menu</a>、<a href="#avatar">avatar</a>、<a href="#button">button</a>（鐵則 5）；行動版側欄改成<a href="#drawer">抽屜</a>。',
      specRows:[['axes','<code>layout × device</code>'],['formula','<code>3 × 2 = 6</code>'],['token-policy','<code>semantic.*.surface.*</code>'],['features','collapsible-side / mobile-drawer']]});
    const LN={side:['側欄','side'],top:['頂欄','top'],'side-top':['側欄＋頂欄','side-top']},DN={desktop:['電腦版','desktop'],mobile:['行動版','mobile']};
    const axes=DIAL_SPECS['app-shell'].axes,zh=DIAL_SPECS['app-shell'].zh,active=CHOICE['app-shell'].active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const g=ce('div','shl-grid');
      axes.device.filter(v=>active.device.has(v)).forEach(d=>axes.layout.filter(v=>active.layout.has(v)).forEach(l=>{const it=ce('div','demo-item');it.style.flex=d==='desktop'?'1 1 420px':'0 0 auto';
        it.appendChild(shlEl(l,d,{}));const c=ce('div','cap');c.innerHTML=`<b>${LN[l][0]} · ${DN[d][0]}</b>`;it.appendChild(c);g.appendChild(it);}));p.appendChild(g);}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Layout × Device 陳列','行動版一律只留頂欄，側欄收進漢堡選單。');p=panelsIn(sec);renderM();
    const cs=section(body,'State 側欄收合','電腦版側欄可收成只剩圖示（58px），讓內容區變寬。');
    capRow(cs,[['展開',shlEl('side','desktop',{})],['收合',shlEl('side','desktop',{collapsed:true})]]).style.alignItems='flex-start';
    usageSection(body,[['側欄','導覽項目多（5 個以上）、或有多層級的後台。'],['頂欄','導覽項目少（3～5 個）的工具或內容型產品。'],['側欄＋頂欄','側欄放主導覽、頂欄放搜尋、通知、帳號。']]);
    const sl=section(body,'互動預覽與程式碼','切 layout／device；實際收合側欄、打開行動版選單。');LIVE['app-shell'](sl);
  }

  /* ---------- EMPTY 空狀態 ---------- */
  const EMP=()=>({first:{ic:IC_FOLDER,t:'還沒有專案',d:'建立第一個專案，開始挑選元件與 token。',a:'建立專案',b:'看範例專案'},
    search:{ic:IC_SEARCH,t:'找不到「藍色按鈕」',d:'換個關鍵字，或清除篩選條件再試一次。',a:'清除篩選',b:null},
    error:{ic:NT_IC_WARNING,t:'資料載入失敗',d:'網路連線不穩定，請稍後再試。',a:'重新載入',b:'回報問題'},
    permission:{ic:IC_USERS,t:'你沒有檢視權限',d:'這個專案只開放給成員，請聯絡專案管理員。',a:'申請權限',b:null}});
  function empEl(kind,size,o){o=o||{};const k=EMP()[kind];const e=ce('div',`emp emp-k-${kind} emp-sz-${size}`);e.setAttribute('role','status');
    if(o.icon!==false){const ic=ce('span','emp-ic');ic.setAttribute('aria-hidden','true');ic.innerHTML=k.ic;e.appendChild(ic);}
    const t=ce('div','emp-title');t.textContent=k.t;e.appendChild(t);
    if(o.desc!==false){const d=ce('div','emp-desc');d.textContent=k.d;e.appendChild(d);}
    const showA=o.primary!==false,showB=o.secondary!==false&&k.b;
    if(showA||showB){const ac=ce('div','emp-actions');
      if(showA){const a=mkBtn({variant:'solid',intent:'primary',size:size==='s'?'s':'m',isLive:!!o.live,lead:kind==='first'});if(kind==='first')a.innerHTML=ICON_PLUS+'<span></span>';a.querySelector('span').textContent=k.a;ac.appendChild(a);}
      if(showB){const b=mkBtn({variant:'text',intent:'secondary',size:size==='s'?'s':'m',isLive:!!o.live});b.querySelector('span').textContent=k.b;ac.appendChild(b);}
      e.appendChild(ac);}
    return e;}
  LIVE.empty=(host)=>mountLive(host,{gate:'empty',initial:{kind:'first',size:'m',icon:true,desc:true,primary:true,secondary:true},
    segs:[{key:'kind',label:'Kind',options:['first','search','error','permission'],labels:['首次使用','搜尋無結果','載入失敗','無權限']},{key:'size',label:'Size',options:['s','m']}],
    bools:[{key:'icon',label:'icon 圖示'},{key:'desc',label:'description 說明'},{key:'primary',label:'主要動作'},{key:'secondary',label:'次要動作'}],boolLabel:'Content',
    render:st=>{const e=empEl(st.kind,st.size,{live:true,icon:st.icon,desc:st.desc,primary:st.primary,secondary:st.secondary});e.classList.add('emp-in');return e;},
    note:'切換時內容逐行淡入（與 skeleton 轉內容同一套）。標題寫「發生了什麼」、說明寫「接下來可以怎麼做」，動作鈕直接給出路。'});
  function buildEmpty(view){
    const body=viewScaffold(view,{eyebrow:'L3 Component · Empty',title:'Empty 空狀態',
      lede:'列表、表格、搜尋、dashboard 沒有內容時顯示的畫面，說明原因並給下一步。四種情境 × 兩級 size（<b>4 × 2 = 8</b>）。內容取用 <a href="#button">button</a> 原子。',
      specRows:[['axes','<code>kind × size</code>'],['formula','<code>4 × 2 = 8</code>'],['token-policy','<code>semantic.*.empty.*</code>'],['features','icon / description / primary / secondary']]});
    const KN={first:['首次使用','first'],search:['搜尋無結果','search'],error:['載入失敗','error'],permission:['無權限','permission']},SZN={s:['小','s · 卡片內'],m:['標準','m · 整頁']};
    const axes=DIAL_SPECS.empty.axes,zh=DIAL_SPECS.empty.zh,active=CHOICE.empty.active;let p;
    function renderM(){if(!p)return;p.innerHTML='';const ks=axes.kind.filter(v=>active.kind.has(v)),ss=axes.size.filter(v=>active.size.has(v));
      p.appendChild(matrixPanel({badge:'content · 完整',name:'Kind × Size',rows:ks,cols:ss,rowLab:k=>labHTML(KN[k][0],KN[k][1]),colLab:s=>labHTML(SZN[s][0],SZN[s][1]),
        cell:(k,s)=>empEl(k,s,{}),mincol:320}));}
    mountDial(body,{axes,zh,active,onRender:renderM});
    const sec=section(body,'Kind × Size 矩陣','載入失敗用警示色圖示，其他情境用中性色；s 放在卡片或表格裡、m 用在整頁。');p=panelsIn(sec);renderM();
    const cx=section(body,'情境：放在列表裡','空狀態取代列表內容，但保留列表的標題列與操作，使用者知道自己在哪裡。');
    const box=ce('div','emp-ctx');const h=ce('div','emp-ctx-h');h.innerHTML='<span>訂單</span>';const nb=mkBtn({variant:'outline',intent:'secondary',size:'s'});nb.innerHTML=ICON_PLUS+'<span>新增訂單</span>';h.appendChild(nb);
    box.append(h,empEl('search','s',{}));cx.appendChild(box);
    usageSection(body,[['首次使用','引導建立第一筆資料；可以多一個「看範例」降低門檻。'],['搜尋無結果','重述關鍵字，提供清除篩選。'],['載入失敗','說明原因並提供重試，不要只顯示空白。'],['無權限','說明誰可以開權限，避免使用者以為資料不見了。']]);
    const sl=section(body,'互動預覽與程式碼','切情境與尺寸、開關內容。');LIVE.empty(sl);
  }

