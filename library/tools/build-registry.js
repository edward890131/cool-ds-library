const fs=require('fs');
// 用法：node library/tools/build-registry.js（路徑相對 repo，不再寫死本機絕對路徑）
const path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const SRC=path.join(ROOT,'library/gallery.html');
const OUT=path.join(ROOT,'library/component-registry.json');
const L0=path.join(ROOT,'framework/L0-scope-manifest.yaml');
const s=fs.readFileSync(SRC,'utf8');

// --- 抽 NAV（分組＋項目）---
const navM=s.match(/const NAV=(\[[\s\S]*?\n  \]);/);
if(!navM){console.error('NAV 抓不到');process.exit(1);}
// --- 抽 DIAL_SPECS ---
const dsM=s.match(/const DIAL_SPECS=(\{[\s\S]*?\n  \};)/);
if(!dsM){console.error('DIAL_SPECS 抓不到');process.exit(1);}
// --- button 用到的 AXES / ZH / FULL（照檔內原值）---
const axesM=s.match(/const AXES=(\{[^\n]*\});/);
const zhM=s.match(/const ZH=(\{[\s\S]*?\n  \});/);
if(!axesM||!zhM){console.error('AXES/ZH 抓不到');process.exit(1);}

const AXES=eval('('+axesM[1]+')');
const ZH=eval('('+zhM[1]+')');
const FULL=144;
const NAV=eval('('+navM[1].replace(/;$/,'')+')');
const DIAL_SPECS=eval('('+dsM[1].replace(/;$/,'')+')');

// --- 範本組成（TPL_COMPOSE）與舊 registry 的手動欄位 ---
const tplM=s.match(/const TPL_COMPOSE=(\{[^\n]*\});/);
const TPL_COMPOSE=tplM?eval('('+tplM[1]+')'):{};
// 後續以 Object.assign(TPL_COMPOSE,{...}) 追加的範本（可引用同檔的共用陣列，例如 TAD_SHELL）
const SHELLS={};for(const m of s.matchAll(/const ([A-Z]+_SHELL)=(\[[^\]]*\]);/g))SHELLS[m[1]]=eval(m[2]);   // 範本共用外框清單（TAD_SHELL、TWS_SHELL…）
for(const m of s.matchAll(/Object\.assign\(TPL_COMPOSE,(\{[\s\S]*?\})\);/g)){
  Object.assign(TPL_COMPOSE,new Function(...Object.keys(SHELLS),'return ('+m[1]+');')(...Object.values(SHELLS)));
}
const PREV={};
try{ const old=JSON.parse(fs.readFileSync(OUT,'utf8')); (old.groups||[]).forEach(g=>g.items.forEach(it=>{ PREV[it.id]=it; })); }catch(e){}

// --- L0 元件 id 粗略比對（有同名就標，僅供參考、id 主權在 library）---
const l0=fs.readFileSync(L0,'utf8');
const L0_IDS=new Set([...l0.matchAll(/^\s*- id:\s*([a-z0-9-]+)/gm)].map(m=>m[1]));
function l0Has(id){ return L0_IDS.has(id); } // 只認 L0 的「- id: xxx」條目，避免寬鬆比對誤中一般鍵名

const groups=NAV.map(g=>({
  group:g.group,
  emoji:g.emoji,
  items:g.items.map(it=>{
    const spec=DIAL_SPECS[it.id];
    let axes=null;
    if(spec){
      axes={order:spec.order,by:{}};
      spec.order.forEach(k=>{
        const opts=spec.axes[k]||[];
        const zh=(spec.zh&&spec.zh[k])||{};
        const axisName=(spec.zh&&spec.zh.axisName&&spec.zh.axisName[k])||k;
        axes.by[k]={axisName,options:opts.map(o=>({value:o,zh:zh[o]||o}))};
      });
      // when：某軸只在其他軸取特定值時才存在（稀疏組合，Figma 只建有效組合）；bools：Figma boolean property
      if(spec.when)axes.when=spec.when;
      if(spec.bools)axes.bools=spec.bools;
      const combos=(function(){let list=[{}];spec.order.forEach(k=>{const n=[];list.forEach(c=>(spec.axes[k]||[]).forEach(v=>n.push(Object.assign({},c,{[k]:v}))));list=n;});
        if(!spec.when)return list.length;
        const ok=c=>Object.entries(spec.when).every(([ax,cond])=>Object.entries(cond).every(([dep,vals])=>vals.includes(c[dep])));
        const seen=new Set();list.forEach(c=>{const k=spec.order.filter(ax=>!spec.when[ax]||ok(c)).map(ax=>ax+'='+c[ax]).join('|');seen.add(k);});return seen.size;})();
      axes.variantCount=combos;
    }
    const out={
      id:it.id,
      name:it.name,
      status:it.st||'todo',
      l0Ref:l0Has(it.id)?it.id:null,
      axes
    };
    if(it.st==='planned'){ out.priority=it.pr||null; out.note=it.note||null; } // 規劃中：差距分析的優先級與理由
    if(it.kind==='template'){ out.kind='template'; out.composedOf=TPL_COMPOSE[it.id]||[]; } // 範本：只排版、不建新元件，列出取用的元件 id
    const prev=PREV[it.id]; if(prev) Object.keys(prev).forEach(k=>{ if(!(k in out)) out[k]=prev[k]; }); // 保留手動補的欄位（例：icon 的 tokens／codeOnlyProps）
    return out;
  })
}));

// --- 補強 logo 品牌資產（NAV 已含 logo 項，此處 enrich 而非重複新增）---
const findItem=id=>{for(const g of groups){const it=g.items.find(x=>x.id===id);if(it)return it;}return null;}; // 依 id 找，不依群組名稱（分組會改名）
const logoItem=findItem('logo');
if(logoItem){
  logoItem.kind='brand-asset';
  logoItem.note='專案級可替換品牌資產。淺／深主題各一顆，依當前主題自動切換、單邊 fallback。同步替換三處：網站 topbar / library header / library footer。鎖寬度、高度等比。存於專案狀態、bake 時以 data URI inline。';
  logoItem.targets=['site-topbar(.brand-logo)','library-header(hdrLogo)','library-footer(ftrLogo)'];
  logoItem.themes=['light','dark'];
}

// --- selector 補 composes（內部用 checkbox / radio）---
function axesOf(id){
  const spec=DIAL_SPECS[id]; if(!spec) return null;
  const out={order:spec.order,by:{}};
  spec.order.forEach(k=>{
    const opts=spec.axes[k]||[]; const zh=(spec.zh&&spec.zh[k])||{};
    const axisName=(spec.zh&&spec.zh.axisName&&spec.zh.axisName[k])||k;
    out.by[k]={axisName,options:opts.map(o=>({value:o,zh:zh[o]||o}))};
  });
  return out;
}
const sel=findItem('selector');
if(sel){ sel.composes=['checkbox','radio']; sel.note='複合選擇族：內部用 checkbox（含 indeterminate 半選）與 radio；軸定義見 subComponents。'; }

// --- 獨立 sub-component（非頂層陳列項、但有自己的軸）---
const subComponents={
  checkbox:{name:'Checkbox 核取方塊',partOf:'selector',axes:axesOf('checkbox')},
  radio:{name:'Radio 單選鈕',partOf:'selector',axes:axesOf('radio')}
};

const registry={
  meta:{
    version:'0.2.0',
    generated:new Date().toISOString().slice(0,10),
    source:'library/gallery.html',
    principle:'library-first canonical id；框架 L0 僅供 l0Ref 參考，id 主權在 library。',
    counts:{}
  },
  groups,
  subComponents
};
// 統計
let total=0,withAxes=0,noAxes=0,ready=0,planned=0;
groups.forEach(g=>g.items.forEach(it=>{total++;it.axes?withAxes++:noAxes++;it.status==='planned'?planned++:ready++;}));
registry.meta.counts={total,ready,planned,withAxes,noAxes};

fs.mkdirSync(require('path').dirname(OUT),{recursive:true});
fs.writeFileSync(OUT,JSON.stringify(registry,null,2));
console.log('OK 寫入 registry:',OUT);
console.log('分組:',groups.map(g=>g.group+'('+g.items.length+')').join(' / '));
console.log('總項目:',total,' 有軸:',withAxes,' 無軸(待補/複合):',noAxes);
// 列出無軸項目（缺口候選）
groups.forEach(g=>g.items.forEach(it=>{if(!it.axes&&it.kind!=='brand-asset'&&it.kind!=='template'&&it.status!=='planned')console.log('  ⚠ 無軸定義:',g.group,'/',it.id,it.name);}));
console.log('ready:',ready,' planned:',planned);
