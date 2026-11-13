  /* ===== 導覽（Yuu 自訂分類藍圖：60 顆 L3 併成 43 個陳列項目）===== */
  /* st: 'ready'=已定案 / 'partial'=代表元件已建、家族其餘待補 / 省略=待建 */
  /* 側欄／分類圖示：PulsoIcon （2026-11-03 取代 emoji） */
  const NAV_IC={"house-simple": PI('house'), "palette": PI('palette'), "ruler": PI('ruler'), "clipboard-text": PI('clipboard-list'), "book-open-text": PI('book-open-text'), "shapes": PI('shapes'), "layout": PI('layout-panel-left'), "compass": PI('compass'), "textbox": PI('text-cursor-input'), "chat-circle-dots": PI('message-circle-more'), "rows": PI('rows-3'), "cards": PI('gallery-vertical-end'), "chart-bar": PI('chart-column'), "clock-counter-clockwise": PI('rotate-ccw-clock'), "gear-six": PI('settings'), "ai": PI('sparkles'), "template": PI('layout-template')};
  const navIc=k=>NAV_IC[k]?'<span class="nav-ic" aria-hidden="true">'+NAV_IC[k]+'</span>':'';
  const NAV=[
    /* 2026-11-03 分類重整：依「用途」分 8 組（參考 Ant Design／Carbon）；id 不變，只改分組。st:'planned'＝規劃中（差距分析建議新增，點進去顯示佔位頁＋優先級說明） */
    {group:'General 基礎',emoji:'🧱',ic:'shapes',items:[
      {id:'button',name:'Button 按鈕',st:'ready'},
      {id:'button-group',name:'Button Group 按鈕組',st:'ready'},
      {id:'icon',name:'Icon 圖示',st:'ready'},
      {id:'link',name:'Link 連結',st:'ready'},
      {id:'kbd',name:'Kbd 快捷鍵',st:'ready'},
      {id:'divider',name:'Divider 分隔線',st:'ready'},
      {id:'avatar',name:'Avatar 頭像',st:'ready'},
      {id:'logo',name:'Logo 品牌標誌',st:'ready'},
    ]},
    {group:'Layout 版面',emoji:'📐',ic:'layout',items:[
      {id:'stack',name:'Stack 版面排列',st:'ready'},
      {id:'app-shell',name:'App Shell 應用程式框架',st:'ready'},
      {id:'splitter',name:'Splitter 分割面板',st:'ready'},
      {id:'scroll-area',name:'Scroll Area 捲動區',st:'ready'},
      {id:'header',name:'Header 頁首',st:'ready'},
      {id:'footer',name:'Footer 頁尾',st:'ready'},
      {id:'section-head',name:'Section Head 區段標題',st:'ready'},
      {id:'floating-line',name:'Floating Line 浮動列',st:'ready'},
    ]},
    {group:'Navigation 導覽',emoji:'🧭',ic:'compass',items:[
      {id:'tab',name:'Tab 分頁',st:'ready'},
      {id:'menu',name:'Menu 選單',st:'ready'},
      {id:'action-menu',name:'Action Menu 動作選單',st:'ready'},
      {id:'context-menu',name:'Context Menu 右鍵選單',st:'ready'},
      {id:'breadcrumb',name:'Breadcrumb 麵包屑',st:'ready'},
      {id:'pagination',name:'Pagination 分頁器',st:'ready'},
      {id:'step',name:'Step 步驟',st:'ready'},
      {id:'command',name:'Command 指令面板',st:'ready'},
      {id:'tour',name:'Tour 新手導覽',st:'ready'},
      {id:'menubar',name:'Menubar 選單列',st:'ready'},
    ]},
    {group:'Form 表單',emoji:'✍️',ic:'textbox',items:[
      {id:'input',name:'Input 輸入框',st:'ready'},
      {id:'number-input',name:'Number Input 數字欄位',st:'ready'},
      {id:'dropdown',name:'Dropdown 下拉',st:'ready'},
      {id:'selector',name:'Selector 選擇',st:'ready'},
      {id:'toggle',name:'Toggle 開關',st:'ready'},
      {id:'segmented',name:'Segmented 分段控制',st:'ready'},
      {id:'chip',name:'Chip 選擇膠囊',st:'ready'},
      {id:'slider',name:'Slider 滑桿',st:'ready'},
      {id:'date-picker',name:'Date Picker 日期選擇',st:'ready'},
      {id:'time-picker',name:'Time Picker 時間選擇',st:'ready'},
      {id:'cascader',name:'Cascader 多層選擇',st:'ready'},
      {id:'tree-select',name:'Tree Select 樹狀選擇',st:'ready'},
      {id:'color-picker',name:'Color Picker 選色器',st:'ready'},
      {id:'dropzone',name:'Dropzone 檔案上傳',st:'ready'},
      {id:'quantity',name:'Quantity 商品計數',st:'ready'},
      {id:'field',name:'Field 表單欄位',st:'ready'},
    ]},
    {group:'Feedback & Overlay 回饋與浮層',emoji:'💬',ic:'chat-circle-dots',items:[
      {id:'alert',name:'Alert 提示橫幅',st:'ready'},
      {id:'notification',name:'Notification 通知',st:'ready'},
      {id:'tooltip',name:'Tooltip 提示',st:'ready'},
      {id:'popover',name:'Popover 氣泡卡',st:'ready'},
      {id:'hover-card',name:'Hover Card 資訊卡',st:'ready'},
      {id:'modal',name:'Modal 對話框',st:'ready'},
      {id:'drawer',name:'Drawer 抽屜',st:'ready'},
      {id:'progress',name:'Progress 進度條',st:'ready'},
      {id:'loader',name:'Loader 載入器',st:'ready'},
      {id:'skeleton',name:'Skeleton 骨架',st:'ready'},
      {id:'empty',name:'Empty 空狀態',st:'ready'},
    ]},
    {group:'Data Display 資料展示',emoji:'🗂',ic:'rows',items:[
      {id:'tag',name:'Tag 標籤',st:'ready'},
      {id:'price',name:'Number 數值',st:'ready'},
      {id:'image',name:'Image 圖片',st:'ready'},
      {id:'rating',name:'Rating 評分',st:'ready'},
      {id:'carousel',name:'Carousel 輪播',st:'ready'},
      {id:'list',name:'List 列表',st:'ready'},
      {id:'list-item',name:'List Item 資訊列',st:'ready'},
      {id:'collapse',name:'Collapse 摺疊',st:'ready'},
      {id:'descriptions',name:'Descriptions 資料清單',st:'ready'},
    ]},
    {group:'Card 卡片',emoji:'🃏',ic:'cards',items:[
      {id:'article-card',name:'Article Card 文章卡',st:'ready'},
      {id:'person-card',name:'Person Card 照片人物卡',st:'ready'},
      {id:'profile-card',name:'Profile Card 品牌檔案卡',st:'ready'},
      {id:'metric-card',name:'Metric Card 指標週卡',st:'ready'},
      {id:'invite-card',name:'Invite Card 邀請協作卡',st:'ready'},
      {id:'widget-card',name:'Widget Card 小工具卡',st:'ready'},
      {id:'trend-card',name:'Trend Card 趨勢卡',st:'ready'},
      {id:'media-card',name:'Media Card 照片標籤卡',st:'ready'},
      {id:'weather-card',name:'Weather Card 天氣卡',st:'ready'},
      {id:'player-card',name:'Player Card 音樂播放卡',st:'ready'},
      {id:'ticket-card',name:'Ticket Card 登機證',st:'ready'},
      {id:'news-item',name:'News Item 消息列表項',st:'ready'},
      {id:'product-tile',name:'Product Tile 商品格',st:'ready'},
    ]},
    {group:'Table & Chart 表格圖表',emoji:'📊',ic:'chart-bar',items:[
      {id:'table',name:'Table 表格',st:'ready'},
      {id:'table-toolbar',name:'Table Toolbar 表格工具列',st:'ready'},
      {id:'tree-view',name:'Tree View 樹狀',st:'ready'},
      {id:'calendar',name:'Calendar 日曆／時間',st:'ready'},
      {id:'chart',name:'Chart 圖表',st:'ready'},
      {id:'schedule-chart',name:'Schedule Chart 排程圖',st:'ready'},
    ]},
    {group:'AI Chat 對話',emoji:'✨',ic:'ai',items:[
      {id:'ai-avatar',name:'AI Avatar 頭像',st:'ready'},
      {id:'chat-message',name:'Chat Message 訊息',st:'ready'},
      {id:'chat-thinking',name:'Chat Thinking 思考狀態',st:'ready'},
      {id:'chat-composer',name:'Chat Composer 輸入列',st:'ready'},
      {id:'prompt-suggestion',name:'Prompt Suggestion 建議問題',st:'ready'},
      {id:'chat-error',name:'Chat Error 對話錯誤',st:'ready'},
    ]},
    {group:'Template 範本',emoji:'🧩',ic:'template',items:[
      {id:'tpl-ai-chat',name:'AI Chat 對話',st:'ready',kind:'template'},
      {id:'tpl-admin-dashboard',name:'Admin Dashboard 後台儀表板',st:'ready',kind:'template'},
      {id:'tpl-admin-report',name:'Admin Report 後台統計報表',st:'ready',kind:'template'},
      {id:'tpl-admin-list',name:'Admin List 後台資料列表',st:'ready',kind:'template'},
      {id:'tpl-admin-detail',name:'Admin Detail 後台詳情頁',st:'ready',kind:'template'},
      {id:'tpl-admin-form',name:'Admin Form 後台建立表單',st:'ready',kind:'template'},
      {id:'tpl-web-product',name:'Product List 商品列表',st:'ready',kind:'template'},
      {id:'tpl-web-blog',name:'Blog 部落格',st:'ready',kind:'template'},
      {id:'tpl-web-news',name:'News 最新消息',st:'ready',kind:'template'},
      {id:'tpl-web-article',name:'Article 文章內頁',st:'ready',kind:'template'},
    ]},
  ];
  const STAT={ready:'已定案',partial:'部分'};

  /* ===== button 軸定義（與 L3 spec 對齊）===== */
  const AXES={variant:['solid','soft','outline','text'],intent:['primary','secondary','danger'],state:['default','hover','pressed','disabled'],size:['s','m','l']};
  const ZH={
    variant:{solid:'實心',soft:'柔色',outline:'外框',text:'文字'},
    intent:{primary:'主要',secondary:'次要',danger:'危險'},
    state:{default:'預設',hover:'滑過',pressed:'按下',disabled:'停用'},
    size:{s:'小 s',m:'標準 m',l:'大 l'},
    axisName:{variant:'Variant 風格',intent:'Intent 意圖',state:'State 狀態',size:'Size 尺寸'},
  };
  const LABEL={primary:'送出',secondary:'取消',danger:'刪除'};
  const VDESC={solid:'最高層級 CTA',soft:'柔色次要強調',outline:'次層級動作',text:'最弱／行內動作'};
  const FULL=144;
  const ICON_PENCIL=PI('pencil');
  const ICON_ARROW=PI('arrow-right');
  /* HOME15:v1 Figma 官方 logo（品牌資產，維持官方色，不走 token） */
  const ICON_FIGMA='<svg class="ic-figma" viewBox="0 0 38 57" aria-hidden="true" focusable="false"><path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/><path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/><path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/><path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/></svg>';
  const ICON_GITHUB='<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

  const active={}; for(const k in AXES) active[k]=new Set(AXES[k]);
  const live={variant:'solid',intent:'primary',size:'m',lead:false,trail:false,iconOnly:false,disabled:false,text:'',layout:'a',tab:'ctl'};

  /* ===== 中央複雜度 store：各元件轉盤的選擇集中在此、跨切頁持久，供「複雜度確認」總覽彙整 ===== */
  const DIAL_SPECS={
    button:{label:'Button 按鈕',order:['variant','intent','state','size'],axes:AXES,zh:ZH},
    input:{label:'Input 輸入框',order:['variant','state','size'],
      axes:{variant:['outline','filled'],state:['default','hover','focus','filled-value','disabled','error'],size:['s','m','l']},
      zh:{variant:{outline:'外框',filled:'實填'},state:{default:'預設',hover:'滑過',focus:'聚焦','filled-value':'已填值',disabled:'停用',error:'錯誤'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 風格',state:'State 狀態',size:'Size 尺寸'}}},
    dropdown:{label:'Dropdown 下拉',order:['variant','type','state','size'],
      axes:{variant:['outline','filled'],type:['single','multi'],state:['default','hover','focus','selected','open','disabled','error'],size:['s','m','l']},
      zh:{variant:{outline:'外框',filled:'實填'},type:{single:'單選',multi:'多選'},state:{default:'預設',hover:'滑過',focus:'聚焦',selected:'已選',open:'展開',disabled:'停用',error:'錯誤'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 風格',type:'Type 型態',state:'State 狀態',size:'Size 尺寸'}}},
    checkbox:{label:'Checkbox 核取方塊',order:['state','size'],
      axes:{state:['default','hover','checked','indeterminate','disabled','focus'],size:['m']},
      zh:{state:{default:'預設',hover:'滑過',checked:'已選',indeterminate:'半選',disabled:'停用',focus:'聚焦'},size:{m:'標準 m'},axisName:{state:'State 狀態',size:'Size 尺寸'}}},
    radio:{label:'Radio 單選鈕',order:['state','size'],
      axes:{state:['default','hover','checked','disabled','focus'],size:['m']},
      zh:{state:{default:'預設',hover:'滑過',checked:'已選',disabled:'停用',focus:'聚焦'},size:{m:'標準 m'},axisName:{state:'State 狀態',size:'Size 尺寸'}}},
    tag:{label:'Tag 標籤',order:['variant','corner','intent','state','size'],
      axes:{variant:['solid','outline','soft'],corner:['round','rect'],intent:['brand','brand2','neutral','danger','success','warning','info'],state:['default','hover','disabled'],size:['s','m','l']},
      zh:{variant:{solid:'實心',outline:'外框',soft:'柔色'},corner:{round:'圓角',rect:'方角'},intent:{brand:'品牌',brand2:'輔助',neutral:'中性',danger:'危險',success:'成功',warning:'警告',info:'資訊'},state:{default:'預設',hover:'滑過',disabled:'停用'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 風格',corner:'Corner 圓角',intent:'Intent 意圖',state:'State 狀態',size:'Size 尺寸'}}},
    'button-group':{label:'Button Group 按鈕組',order:['variant','size'],axes:{variant:['outline','soft','split'],size:['s','m','l']},zh:{variant:{outline:'外框',soft:'柔色',split:'主鈕＋下拉'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 風格',size:'Size 尺寸'}}},
    link:{label:'Link 連結',order:['variant','state'],axes:{variant:['inline','standalone'],state:['default','hover','visited','focus','disabled']},zh:{variant:{inline:'段落內',standalone:'獨立連結'},state:{default:'預設',hover:'滑過',visited:'已造訪',focus:'聚焦',disabled:'停用'},axisName:{variant:'Variant 風格',state:'State 狀態'}}},
    kbd:{label:'Kbd 快捷鍵',order:['variant','size'],axes:{variant:['default','ghost'],size:['s','m']},zh:{variant:{default:'鍵帽',ghost:'淡底'},size:{s:'小 s',m:'標準 m'},axisName:{variant:'Variant 風格',size:'Size 尺寸'}}},
    divider:{label:'Divider 分隔線',order:['orientation','variant'],axes:{orientation:['horizontal','vertical'],variant:['solid','dashed','strong']},zh:{orientation:{horizontal:'水平',vertical:'垂直'},variant:{solid:'實線',dashed:'虛線',strong:'加深'},axisName:{orientation:'Orientation 方向',variant:'Variant 樣式'}}},
    descriptions:{label:'Descriptions 資料清單',order:['layout','columns'],axes:{layout:['horizontal','vertical'],columns:['1','2','3']},zh:{layout:{horizontal:'標籤在左',vertical:'標籤在上'},columns:{'1':'1 欄','2':'2 欄','3':'3 欄'},axisName:{layout:'Layout 版面',columns:'Columns 欄數'}}},
    splitter:{label:'Splitter 分割面板',order:['orientation','handle'],axes:{orientation:['horizontal','vertical'],handle:['line','grip']},zh:{orientation:{horizontal:'左右',vertical:'上下'},handle:{line:'細線',grip:'握把'},axisName:{orientation:'Orientation 方向',handle:'Handle 握把'}}},
    'scroll-area':{label:'Scroll Area 捲動區',order:['orientation','scrollbar'],axes:{orientation:['vertical','horizontal'],scrollbar:['always','hover']},zh:{orientation:{vertical:'垂直',horizontal:'水平'},scrollbar:{always:'一直顯示',hover:'滑過才顯示'},axisName:{orientation:'Orientation 方向',scrollbar:'Scrollbar 捲軸'}}},
    'number-input':{label:'Number Input 數字欄位',order:['variant','state'],axes:{variant:['stacked','plain'],state:['default','focus','disabled','error']},zh:{variant:{stacked:'上下鈕',plain:'純輸入'},state:{default:'預設',focus:'聚焦',disabled:'停用',error:'超出範圍'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    rating:{label:'Rating 評分',order:['size','state'],axes:{size:['s','m','l'],state:['default','readonly','disabled']},zh:{size:{s:'小 s',m:'標準 m',l:'大 l'},state:{default:'可評分',readonly:'唯讀',disabled:'停用'},axisName:{size:'Size 尺寸',state:'State 狀態'}}},
    carousel:{label:'Carousel 輪播',order:['arrows','indicator'],axes:{arrows:['inside','outside'],indicator:['dots','number']},zh:{arrows:{inside:'疊在圖上',outside:'放兩側'},indicator:{dots:'圓點',number:'頁碼'},axisName:{arrows:'Arrows 箭頭位置',indicator:'Indicator 指示器'}}},
    'hover-card':{label:'Hover Card 資訊卡',order:['placement','size'],axes:{placement:['bottom','top','left','right'],size:['s','m','l']},zh:{placement:{bottom:'下方',top:'上方',left:'左側',right:'右側'},size:{s:'精簡 s',m:'標準 m',l:'寬 l'},axisName:{placement:'Placement 方向',size:'Size 尺寸'}}},
    'context-menu':{label:'Context Menu 右鍵選單',order:['variant','size'],axes:{variant:['default','with-icon','with-shortcut'],size:['s','m','l']},zh:{variant:{default:'純文字','with-icon':'帶圖示','with-shortcut':'帶快捷鍵'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 型態',size:'Size 尺寸'}}},
    command:{label:'Command 指令面板',order:['state','size'],axes:{state:['default','results','empty'],size:['m','l']},zh:{state:{default:'預設（建議）',results:'搜尋結果',empty:'無結果'},size:{m:'標準 m',l:'寬 l'},axisName:{state:'State 狀態',size:'Size 尺寸'}}},
    'date-picker':{label:'Date Picker 日期選擇',order:['variant','state'],axes:{variant:['single','range'],state:['default','focus','filled','disabled','error']},zh:{variant:{single:'單日',range:'區間'},state:{default:'預設',focus:'聚焦',filled:'已選',disabled:'停用',error:'錯誤'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    'time-picker':{label:'Time Picker 時間選擇',order:['variant','state'],axes:{variant:['single','range'],state:['default','focus','filled','disabled','error']},zh:{variant:{single:'單一時間',range:'時段'},state:{default:'預設',focus:'聚焦',filled:'已選',disabled:'停用',error:'錯誤'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    'color-picker':{label:'Color Picker 選色器',order:['variant','state'],axes:{variant:['swatch','full'],state:['default','focus','filled','disabled','error']},zh:{variant:{swatch:'色票',full:'完整'},state:{default:'預設',focus:'聚焦',filled:'已選',disabled:'停用',error:'錯誤'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    cascader:{label:'Cascader 多層選擇',order:['variant','state'],axes:{variant:['single','multi'],state:['default','focus','filled','disabled','error']},zh:{variant:{single:'單選',multi:'多選'},state:{default:'預設',focus:'聚焦',filled:'已選',disabled:'停用',error:'錯誤'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    'tree-select':{label:'Tree Select 樹狀選擇',order:['variant','state'],axes:{variant:['single','multi'],state:['default','focus','filled','disabled','error']},zh:{variant:{single:'單選',multi:'多選'},state:{default:'預設',focus:'聚焦',filled:'已選',disabled:'停用',error:'錯誤'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    tour:{label:'Tour 新手導覽',order:['placement','step'],bools:{progress:'Progress 進度',close:'Close 關閉鈕'},axes:{placement:['bottom','top','left','right'],step:['first','middle','last']},zh:{placement:{bottom:'下方',top:'上方',left:'左側',right:'右側'},step:{first:'第一步',middle:'中間步',last:'最後一步'},axisName:{placement:'Placement 方向',step:'Step 步驟'}}},
    menubar:{label:'Menubar 選單列',order:['variant','state','size'],axes:{variant:['bar','plain'],state:['default','hover','open','disabled'],size:['s','m']},zh:{variant:{bar:'外框',plain:'無框'},state:{default:'預設',hover:'滑過',open:'展開',disabled:'停用'},size:{s:'s',m:'m'},axisName:{variant:'Variant 型態',state:'State 狀態',size:'Size 尺寸'}}},
    dropzone:{label:'Dropzone 檔案上傳',order:['state','size'],axes:{state:['default','dragover','uploading','done','error'],size:['s','m']},zh:{state:{default:'預設',dragover:'拖曳中',uploading:'上傳中',done:'完成',error:'錯誤'},size:{s:'精簡 s',m:'標準 m'},axisName:{state:'State 狀態',size:'Size 尺寸'}}},
    'table-toolbar':{label:'Table Toolbar 表格工具列',order:['filter','bulk','density'],axes:{filter:['none','applied'],bulk:['hidden','page','all'],density:['comfortable','compact']},bools:{views:'Views 已存檢視分頁',densityToggle:'Density toggle 列高切換'},zh:{filter:{none:'無條件',applied:'已套用條件'},bulk:{hidden:'未選取',page:'選取本頁',all:'全選符合條件'},density:{comfortable:'寬鬆',compact:'緊湊'},axisName:{filter:'Filter 篩選',bulk:'Bulk 批次列',density:'Density 列高'}}},
    avatar:{label:'Avatar 頭像',order:['size','shape','content'],axes:{size:['xs','s','m','l','xl'],shape:['circle','rounded'],content:['image','initials','icon']},zh:{size:{xs:'極小 xs',s:'小 s',m:'標準 m',l:'大 l',xl:'特大 xl'},shape:{circle:'圓形',rounded:'圓角方'},content:{image:'照片',initials:'縮寫',icon:'圖示'},axisName:{size:'Size 尺寸',shape:'Shape 形狀',content:'Content 內容'}}},
    segmented:{label:'Segmented 分段控制',order:['variant','size'],axes:{variant:['soft','outline'],size:['s','m','l']},zh:{variant:{soft:'柔色軌道',outline:'外框'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 風格',size:'Size 尺寸'}}},
    chip:{label:'Chip 選擇膠囊',order:['type','state','size'],axes:{type:['single','multi'],state:['default','hover','selected','disabled'],size:['s','m','l']},bools:{dot:'Dot 色點',icon:'Icon 圖示'},zh:{type:{single:'單選',multi:'多選'},state:{default:'預設',hover:'滑過',selected:'選中',disabled:'停用'},size:{s:'s',m:'m',l:'l'},axisName:{type:'Type 類型',state:'State 狀態',size:'Size 尺寸'}}},
    slider:{label:'Slider 滑桿',order:['variant','type','size','state'],axes:{variant:['track','fill'],type:['single','range'],size:['s','m'],state:['default','hover','focus','disabled']},zh:{variant:{track:'軌道',fill:'填充'},type:{single:'單值',range:'區間'},size:{s:'細 s',m:'標準 m'},state:{default:'預設',hover:'滑過',focus:'聚焦',disabled:'停用'},axisName:{variant:'Variant 樣式',type:'Type 型態',size:'Size 尺寸',state:'State 狀態'}}},
    field:{label:'Field 表單欄位',order:['layout','state'],axes:{layout:['vertical','horizontal'],state:['default','filled','error','disabled']},zh:{layout:{vertical:'標籤在上',horizontal:'標籤在左'},state:{default:'預設',filled:'已填值',error:'錯誤',disabled:'停用'},axisName:{layout:'Layout 版面',state:'State 狀態'}}},
    stack:{label:'Stack 版面排列',order:['direction','gap'],axes:{direction:['vertical','horizontal','grid'],gap:['sp-2','sp-3','sp-4','sp-5']},zh:{direction:{vertical:'Stack 直排',horizontal:'Inline 橫排',grid:'Grid 格狀'},gap:{'sp-2':'sp-2 · 6','sp-3':'sp-3 · 8','sp-4':'sp-4 · 12','sp-5':'sp-5 · 16'},axisName:{direction:'Direction 方向',gap:'Gap 間距'}}},
    'app-shell':{label:'App Shell 應用程式框架',order:['layout','device'],axes:{layout:['side','top','side-top'],device:['desktop','mobile']},zh:{layout:{side:'側欄',top:'頂欄','side-top':'側欄＋頂欄'},device:{desktop:'電腦版',mobile:'行動版'},axisName:{layout:'Layout 版面',device:'Device 裝置'}}},
    empty:{label:'Empty 空狀態',order:['kind','size'],axes:{kind:['first','search','error','permission'],size:['s','m']},zh:{kind:{first:'首次使用',search:'搜尋無結果',error:'載入失敗',permission:'無權限'},size:{s:'小 s',m:'標準 m'},axisName:{kind:'Kind 情境',size:'Size 尺寸'}}},
    alert:{label:'Alert 提示橫幅',order:['variant','intent'],axes:{variant:['soft','outline','accent'],intent:['info','success','warning','error']},zh:{variant:{soft:'柔色',outline:'外框',accent:'左側色條'},intent:{info:'資訊',success:'成功',warning:'警告',error:'錯誤'},axisName:{variant:'Variant 風格',intent:'Intent 意圖'}}},
    popover:{label:'Popover 氣泡卡',order:['placement','size'],axes:{placement:['bottom','top','left','right'],size:['s','m','l']},zh:{placement:{bottom:'下方',top:'上方',left:'左側',right:'右側'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{placement:'Placement 方向',size:'Size 尺寸'}}},
    toggle:{label:'Toggle 開關',order:['state'],axes:{state:['off','on','disabled-off','disabled-on']},bools:{icon:'Icon 圓鈕圖示'},zh:{state:{off:'關',on:'開','disabled-off':'停用（關）','disabled-on':'停用（開）'},axisName:{state:'State 狀態'}}},
    tab:{label:'Tab 分頁',order:['variant','state','size'],
      axes:{variant:['line','contained','soft','pill'],state:['default','hover','active','disabled'],size:['s','m','l']},
      zh:{variant:{line:'底線',contained:'容器',soft:'灰底',pill:'藥丸'},state:{default:'預設',hover:'滑過',active:'選中',disabled:'停用'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 風格',state:'State 狀態',size:'Size 尺寸'}}},
    notification:{label:'Notification 通知',order:['variant','intent'],
      axes:{variant:['solid','outline','soft','dark'],intent:['success','warning','error','info']},
      zh:{axisName:{variant:'Variant 視覺風格',intent:'Intent 意圖'},variant:{solid:'實心',outline:'外框',soft:'柔色',dark:'半透明黑'},intent:{success:'成功',warning:'警告',error:'錯誤',info:'資訊'}}},
    tooltip:{label:'Tooltip 提示',order:['placement','size'],
      axes:{placement:['top','bottom','left','right'],size:['s','m']},
      zh:{axisName:{placement:'Placement 方向',size:'Size 尺寸'},placement:{top:'上方',bottom:'下方',left:'左側',right:'右側'},size:{s:'小 s',m:'標準 m'}}},
    skeleton:{label:'Skeleton 骨架',order:['variant','size'],
      axes:{variant:['text','rectangle','circle'],size:['s','m','l']},
      zh:{axisName:{variant:'Shape 形狀',size:'Size 尺寸'},variant:{text:'文字列',rectangle:'矩形',circle:'圓形'},size:{s:'小 s',m:'中 m',l:'大 l'}}},
    loader:{label:'Loader 載入器',order:['variant','size'],
      axes:{variant:['circular','dots','bar'],size:['s','m','l']},
      zh:{axisName:{variant:'Variant 樣式',size:'Size 尺寸'},variant:{circular:'旋轉圈',dots:'跳動點',bar:'進度條'},size:{s:'小',m:'標準',l:'大'}}},
    menu:{label:'Menu 選單',order:['variant','state','size'],bools:{icon:'Icon 左側圖示',groups:'Groups 分類小標題（vertical）',nested:'Nested 內層展開收合（vertical）'},
      axes:{variant:['horizontal','vertical'],state:['default','hover','active','disabled','focus'],size:['s','m','l']},
      zh:{axisName:{variant:'Variant 方向',state:'State 狀態',size:'Size 尺寸'},variant:{horizontal:'水平',vertical:'垂直'},state:{default:'預設',hover:'滑過',active:'當前頁',disabled:'停用',focus:'聚焦'},size:{s:'小 s',m:'標準 m',l:'大 l'}}},
    'action-menu':{label:'Action Menu 動作選單',order:['variant','state','size'],
      axes:{variant:['default','with-icon','with-divider'],state:['closed','open','hover','focused','disabled'],size:['s','m','l']},
      zh:{axisName:{variant:'Variant 風格',state:'State 狀態',size:'Size 尺寸'},variant:{default:'純文字','with-icon':'帶圖示','with-divider':'含分隔線'},state:{closed:'收合',open:'展開',hover:'滑過',focused:'聚焦',disabled:'停用'},size:{s:'小 s',m:'標準 m',l:'大 l'}}},
    breadcrumb:{label:'Breadcrumb 麵包屑',order:['separator'],
      axes:{separator:['chevron','slash','arrow']},
      zh:{axisName:{separator:'Separator 分隔符'},separator:{chevron:'箭頭 ›',slash:'斜線 /',arrow:'→'}}},
    pagination:{label:'Pagination 分頁器',order:['variant','state','size'],
      axes:{variant:['numbered','prev-next'],state:['default','hover','active','disabled'],size:['s','m','l']},
      zh:{axisName:{variant:'Variant 風格',state:'State 狀態',size:'Size 尺寸'},variant:{numbered:'數字頁碼','prev-next':'前後翻頁'},state:{default:'預設',hover:'滑過',active:'當前頁',disabled:'停用'},size:{s:'小 s',m:'標準 m',l:'大 l'}}},
    icon:{label:'Icon 圖示',order:['style','size','tone'],
      axes:{style:['outline','solid'],size:['s','m','l','xl'],tone:['default','primary','secondary','danger']},
      zh:{axisName:{style:'Style 樣式',size:'Size 尺寸',tone:'Tone 色調'},style:{outline:'線框',solid:'實心'},size:{s:'16 s',m:'20 m',l:'24 l',xl:'32 xl'},tone:{default:'預設',primary:'主要',secondary:'次要',danger:'危險'}}},
    price:{label:'Number 數值',order:['variant','size'],axes:{variant:['normal','discount','sale','free'],size:['sm','md','lg']},zh:{axisName:{variant:'Variant 型態',size:'Size 尺寸'},variant:{normal:'一般',discount:'折扣',sale:'特價',free:'免費'},size:{sm:'小 sm',md:'標準 md',lg:'大 lg'}}},
    image:{label:'Image 圖片',order:['variant','state','size','ratio'],
      axes:{variant:['rectangular','rounded','circular'],state:['default','loading','error'],size:['s','m','l','xl'],ratio:['4:3','16:9','2:1','1:1']},
      zh:{axisName:{variant:'Shape 形狀',state:'State 狀態',size:'Size 尺寸',ratio:'Ratio 比例'},variant:{rectangular:'矩形',rounded:'圓角',circular:'圓形'},state:{default:'正常',loading:'載入中',error:'錯誤'},size:{s:'小 s',m:'中 m',l:'大 l',xl:'特大 xl'},ratio:{'4:3':'4:3','16:9':'16:9','2:1':'2:1','1:1':'1:1'}}},
    header:{label:'Header 頁首',order:['device'],axes:{device:['desktop','mobile']},zh:{device:{desktop:'電腦版',mobile:'行動版'},axisName:{device:'Device 裝置'}}},
    footer:{label:'Footer 頁尾',order:['variant','device'],axes:{variant:['rich','simple','minimal'],device:['desktop','mobile']},zh:{variant:{rich:'多欄',simple:'單列',minimal:'極簡'},device:{desktop:'電腦版',mobile:'行動版'},axisName:{variant:'Variant 型態',device:'Device 裝置'}}},
    'section-head':{label:'Section Head 區段標題',order:['align','size'],axes:{align:['left','center'],size:['m','l']},zh:{align:{left:'靠左',center:'置中'},size:{m:'標準 m',l:'大 l'},axisName:{align:'Align 對齊',size:'Size 尺寸'}}},
    list:{label:'List 列表',order:['variant','state'],axes:{variant:['nested','selection'],state:['default','hover','selected','error','disabled']},zh:{variant:{nested:'雙欄／巢狀',selection:'選項卡'},state:{default:'預設',hover:'滑過',selected:'已選',error:'錯誤',disabled:'停用'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    'list-item':{label:'List Item 資訊列',order:['leading','state'],axes:{leading:['checkbox','icon','none'],state:['default','hover','selected','disabled']},zh:{leading:{checkbox:'勾選框',icon:'圖示',none:'無'},state:{default:'預設',hover:'滑過',selected:'已選',disabled:'停用'},axisName:{leading:'Leading 前置',state:'State 狀態'}}},
    collapse:{label:'Collapse 摺疊',order:['variant','state'],axes:{variant:['bordered','filled','plain'],state:['collapsed','expanded','hover','disabled']},zh:{variant:{bordered:'外框',filled:'填色',plain:'極簡'},state:{collapsed:'收合',expanded:'展開',hover:'滑過',disabled:'停用'},axisName:{variant:'Variant 風格',state:'State 狀態'}}},
    modal:{label:'Modal 對話框',order:['kind','variant'],axes:{kind:['popup','modal'],variant:['normal','illustration','regular','larger']},zh:{axisName:{kind:'Kind 大小',variant:'Variant 型態'},kind:{popup:'小彈窗 popup',modal:'大視窗 modal'},variant:{normal:'一般 popup',illustration:'警示 popup',regular:'標準 modal',larger:'大版 modal'}}},
    drawer:{label:'Drawer 抽屜',order:['side','size'],axes:{side:['left','right'],size:['s','m','l']},zh:{side:{left:'左側',right:'右側'},size:{s:'窄 s',m:'標準 m',l:'寬 l'},axisName:{side:'Side 方向',size:'Size 尺寸'}}},
    'floating-line':{label:'Floating Line 浮動列',order:['variant','position'],axes:{variant:['selection','toolbar','fab'],position:['bottom-center','bottom-right']},zh:{variant:{selection:'選取列',toolbar:'工具列',fab:'浮動鈕'},position:{'bottom-center':'底部置中','bottom-right':'底部靠右'},axisName:{variant:'Variant 型態',position:'Position 位置'}}},
    step:{label:'Step 步驟指示器',order:['type','orientation','variant'],axes:{type:['classic','compact','timeline'],orientation:['horizontal','vertical'],variant:['numbered','dotted','icon']},when:{orientation:{type:['classic']},variant:{type:['classic']}},bools:{description:'Description 每步說明',count:'Count 步驟 n / m',time:'Time 時間',expandable:'Expandable 可展開'},zh:{type:{classic:'經典',compact:'精簡進度',timeline:'時間軸'},orientation:{horizontal:'水平',vertical:'垂直'},variant:{numbered:'編號',dotted:'圓點',icon:'圖示'},axisName:{type:'Type 型式',orientation:'Orientation 方向（classic）',variant:'Variant 樣式（classic）'}}},
    quantity:{label:'Quantity 商品計數',order:['variant','size'],axes:{variant:['outline','pill','plain'],size:['s','m','l']},zh:{variant:{outline:'外框',pill:'膠囊',plain:'極簡'},size:{s:'小 s',m:'標準 m',l:'大 l'},axisName:{variant:'Variant 型態',size:'Size 尺寸'}}},
    progress:{label:'Progress 進度條',order:['variant','size'],axes:{variant:['bar','label','gradient'],size:['s','m','l']},zh:{variant:{bar:'基本',label:'帶百分比',gradient:'漸層'},size:{s:'細 s',m:'標準 m',l:'粗 l'},axisName:{variant:'Variant 型態',size:'Size 尺寸'}}},
    'article-card':{label:'Article Card 文章卡',order:['variant','state','size'],axes:{variant:['vertical','horizontal','overlay'],state:['default','hover'],size:['m','s']},zh:{variant:{vertical:'直式',horizontal:'橫式',overlay:'疊字'},state:{default:'預設',hover:'滑過'},size:{m:'標準 m',s:'精簡 s'},axisName:{variant:'Variant 版式',state:'State 狀態',size:'Size 尺寸'}}},
    'person-card':{label:'Person Card 照片人物卡',order:['state','size'],axes:{state:['default','added'],size:['m','s']},bools:{tags:'Tags 照片標籤'},zh:{state:{default:'預設',added:'已加入'},size:{m:'標準 m',s:'精簡 s'},axisName:{state:'State 狀態',size:'Size 尺寸'}}},
    'profile-card':{label:'Profile Card 品牌檔案卡',order:['cover','state'],axes:{cover:['graphic','image','color'],state:['default','following']},bools:{verified:'Verified 認證徽章'},zh:{cover:{graphic:'圖形',image:'照片',color:'純色'},state:{default:'預設',following:'追蹤中'},axisName:{cover:'Cover 封面',state:'State 狀態'}}},
    'metric-card':{label:'Metric Card 指標週卡',order:['chart','tone'],axes:{chart:['daily-bar','weekly-bar','line'],tone:['brand','info','success','violet']},zh:{chart:{'daily-bar':'每日長條','weekly-bar':'每週長條',line:'折線'},tone:{brand:'品牌橘',info:'資訊藍',success:'成功綠',violet:'紫'},axisName:{chart:'Chart 圖型',tone:'Tone 色調'}}},
    'invite-card':{label:'Invite Card 邀請協作卡',order:['layout','members'],axes:{layout:['card','modal'],members:['empty','list']},zh:{layout:{card:'頁內卡片',modal:'對話框'},members:{empty:'空',list:'成員清單'},axisName:{layout:'Layout 版型',members:'Members 成員'}}},
    'widget-card':{label:'Widget Card 小工具卡',order:['kind'],axes:{kind:['message','todo','group','welcome','date']},zh:{kind:{message:'訊息',todo:'今日待辦',group:'群組訊息',welcome:'歡迎回來',date:'日期'},axisName:{kind:'Kind 種類'}}},
    /* CARDS5:v1 單張牌卡 */
    'trend-card':{label:'Trend Card 趨勢卡',order:['tone'],axes:{tone:['ink','violet','white','lime','green']},bools:{index:'Index 編號',media:'Media 底部圖片'},zh:{tone:{ink:'墨黑',violet:'紫',white:'白',lime:'萊姆',green:'綠'},axisName:{tone:'Tone 色調'}}},
    'media-card':{label:'Media Card 照片標籤卡',order:['ratio'],axes:{ratio:['portrait','square','landscape']},bools:{label:'Label 標籤',selected:'Selected 已選取',tilt:'Tilt 傾斜'},zh:{ratio:{portrait:'直式 4:5',square:'方形 1:1',landscape:'橫式 4:3'},axisName:{ratio:'Ratio 比例'}}},
    'weather-card':{label:'Weather Card 天氣卡',order:['cond'],axes:{cond:['sunny','cloudy','rain','storm']},bools:{forecast:'Forecast 五日列'},zh:{cond:{sunny:'晴',cloudy:'多雲',rain:'雨',storm:'雷雨'},axisName:{cond:'Condition 天氣'}}},
    'player-card':{label:'Player Card 音樂播放卡',order:['state'],axes:{state:['paused','playing']},bools:{likes:'Likes 按讚列'},zh:{state:{paused:'暫停',playing:'播放中'},axisName:{state:'State 狀態'}}},
    'news-item':{label:'News Item 消息列表項',order:['type','state'],axes:{type:['important','news'],state:['default','hover']},bools:{date:'Date 日期',summary:'Summary 摘要'},zh:{type:{important:'重要公告',news:'最新消息'},state:{default:'預設',hover:'滑過'},axisName:{type:'Type 類型',state:'State 狀態'}}},
    'product-tile':{label:'Product Tile 商品格',order:['badge','price','state'],axes:{badge:['none','new','hot'],price:['normal','discount'],state:['default','hover']},bools:{cart:'Cart 加入購物車按鈕'},zh:{badge:{none:'無角標',new:'新品',hot:'熱門'},price:{normal:'一般價',discount:'折扣價'},state:{default:'預設',hover:'滑過'},axisName:{badge:'Badge 角標',price:'Price 價格',state:'State 狀態'}}},
    'ticket-card':{label:'Ticket Card 登機證',order:['status'],axes:{status:['on-time','boarding','delayed','cancelled']},bools:{passenger:'Passenger 旅客列'},zh:{status:{'on-time':'準時',boarding:'登機中',delayed:'延誤',cancelled:'取消'},axisName:{status:'Status 狀態'}}},
    table:{label:'Table 資料表格',order:['variant','density'],axes:{variant:['bordered','striped','plain'],density:['comfortable','compact']},zh:{variant:{bordered:'格線',striped:'斑馬紋',plain:'簡潔'},density:{comfortable:'寬鬆',compact:'緊湊'},axisName:{variant:'Variant 型態',density:'Density 密度'}}},
    chart:{label:'Chart 圖表',order:['variant','size'],axes:{variant:['stat','line','curve','bar','donut','semi','pie','spark','brush','area-stack','bar-stack','combo','bar-rank','funnel','heatmap'],size:['m','s']},zh:{variant:{stat:'統計數字',line:'折線',curve:'曲線',bar:'長條',donut:'甜甜圈',semi:'半圓',pie:'實心圓餅',spark:'趨勢小圖卡',brush:'刷選縮放折線','area-stack':'堆疊面積圖','bar-stack':'堆疊長條',combo:'長條＋折線組合圖','bar-rank':'橫向排名長條',funnel:'漏斗圖',heatmap:'熱力圖'},size:{m:'M',s:'S'},axisName:{variant:'Variant 圖型',size:'Size 尺寸'}}},
    'tree-view':{label:'Tree View 樹狀',order:['variant','state'],axes:{variant:['lines','plain','checkbox'],state:['default','hover','selected']},zh:{variant:{lines:'連接線',plain:'無線',checkbox:'勾選樹'},state:{default:'預設',hover:'滑過',selected:'選取'},axisName:{variant:'Variant 型態',state:'State 狀態'}}},
    'schedule-chart':{label:'Schedule Chart 排程圖',order:['variant','size'],axes:{variant:['gantt','week','timeline'],size:['m','s']},zh:{variant:{gantt:'甘特圖',week:'週排程',timeline:'時間軸'},size:{m:'標準',s:'精簡'},axisName:{variant:'Variant 型態',size:'Size 尺寸'}}},
    calendar:{label:'Calendar 日曆時間',order:['variant','size'],axes:{variant:['month','range','time'],size:['m','s']},zh:{variant:{month:'月曆',range:'區間',time:'時間'},size:{m:'M',s:'S'},axisName:{variant:'Variant 型態',size:'Size 尺寸'}}},
    'ai-avatar':{label:'AI Avatar 頭像',order:['state','size'],axes:{state:['idle','thinking','streaming'],size:['s','m','l']},zh:{state:{idle:'待命',thinking:'思考中',streaming:'回覆中'},size:{s:'S 24',m:'M 32',l:'L 48'},axisName:{state:'State 狀態',size:'Size 尺寸'}}},
    'chat-message':{label:'Chat Message 訊息',order:['role','state'],bools:{avatar:'Avatar 頭像',actions:'Actions 操作列',sources:'Sources 來源',files:'Files 附件'},axes:{role:['user','assistant'],state:['done','pending','interrupted']},zh:{role:{user:'使用者',assistant:'AI'},state:{done:'完成',pending:'進行中',interrupted:'中斷'},axisName:{role:'Role 角色',state:'State 狀態'}}},
    'chat-thinking':{label:'Chat Thinking 思考狀態',order:['kind','state'],axes:{kind:['thinking','searching','reasoning'],state:['active','done']},zh:{kind:{thinking:'思考',searching:'搜尋',reasoning:'推理摘要'},state:{active:'進行中',done:'完成'},axisName:{kind:'Kind 類型',state:'State 狀態'}}},
    'chat-composer':{label:'Chat Composer 輸入列',order:['layout','state'],bools:{attach:'Attach ＋選單',tools:'Tools 已開啟工具',model:'Model 模型選擇',voice:'Voice 語音',files:'Files 已附檔案',usage:'Usage 方案使用量'},axes:{layout:['standard','compact'],state:['empty','typing','generating','disabled']},zh:{layout:{standard:'標準',compact:'精簡'},state:{empty:'空白',typing:'輸入中',generating:'生成中',disabled:'停用'},axisName:{layout:'Layout 版型',state:'State 狀態'}}},
    'prompt-suggestion':{label:'Prompt Suggestion 建議問題',order:['variant'],bools:{icon:'Icon 圖示'},axes:{variant:['chip','card']},zh:{variant:{chip:'膠囊',card:'卡片'},axisName:{variant:'Variant 樣式'}}},
    'chat-error':{label:'Chat Error 對話錯誤',order:['kind'],axes:{kind:['network','server','rate-limit','auth','policy']},zh:{kind:{network:'網路中斷',server:'伺服器錯誤','rate-limit':'用量上限',auth:'登入過期',policy:'內容規範'},axisName:{kind:'Kind 情境'}}},
  
  };
  /* 變體組合數：spec.when={軸:{依賴軸:[成立值]}} 時，該軸只在依賴軸取那些值時展開，其餘只算 1（例：step 的 orientation／variant 只作用於 classic） */
  function dialCount(order,pick,when){if(!when)return order.reduce((a,k)=>a*pick[k].length,1);
    let cs=[{}];order.forEach(k=>{const nx=[];cs.forEach(c=>{const w=when[k];const ap=!w||Object.keys(w).every(d=>c[d]==null||w[d].includes(c[d]));(ap?pick[k]:[null]).forEach(v=>nx.push(Object.assign({},c,{[k]:v})));});cs=nx;});
    return new Set(cs.map(c=>JSON.stringify(c))).size;}
  const CHOICE={};
  Object.keys(DIAL_SPECS).forEach(id=>{const a={};DIAL_SPECS[id].order.forEach(k=>a[k]=new Set(DIAL_SPECS[id].axes[k]));CHOICE[id]={active:a};});
  CHOICE.button.active=active; // button 沿用既有 module active，讓轉盤與總覽同步

  function mkBtn(o){
    const {variant,intent,size='m',label=true,lead=false,trail=false,iconOnly=false,isLive=false,shape='rect'}=o;   /* BTN-SHAPE:v1 shape＝rect（預設圓角）／circle（膠囊；icon-only 為正圓） */
    let state=o.state||'default'; const disabled=o.disabled||state==='disabled';
    if(disabled && state==='default') state='disabled';
    const b=document.createElement('button');
    b.className=`btn v-${variant} i-${intent} sz-${size} st-${state}${iconOnly?' icon-only':''}${trail&&!iconOnly?' has-trail':''}${isLive?' live':''}${shape==='circle'?' shape-circle':''}`;
    if(disabled) b.disabled=true;
    let html='';
    if(iconOnly){html=ICON_PENCIL;b.setAttribute('aria-label',LABEL[intent]);}
    else{ if(lead)html+=ICON_PENCIL; if(label)html+=`<span>${LABEL[intent]}</span>`; if(trail)html+=ICON_ARROW; }
    b.innerHTML=html; return b;
  }

