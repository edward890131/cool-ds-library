const fs=require('fs');
const SRC='/Users/goons/Downloads/yuu-agent/ds-component-lib/ds-component-gallery.html';
const OUT='/Users/goons/Downloads/yuu-agent/goons-ds-studio/library/component-registry.json';
const L0='/Users/goons/Downloads/yuu-agent/goons-ds-studio/framework/L0-scope-manifest.yaml';
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

// --- L0 元件 id 粗略比對（有同名就標，僅供參考、id 主權在 library）---
const l0=fs.readFileSync(L0,'utf8');
function l0Has(id){
  // L0 元件多以 "- id: xxx" 或 "  xxx:" 形式；做寬鬆比對
  const re=new RegExp('(^|\\n)\\s*(- )?(id:\\s*)?'+id.replace(/[-]/g,'[-]')+'\\s*:?\\s*($|\\n)','i');
  return re.test(l0);
}

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
    }
    return {
      id:it.id,
      name:it.name,
      status:it.st||'todo',
      l0Ref:l0Has(it.id)?it.id:null,
      axes
    };
  })
}));

// --- 加入 logo 品牌資產（Basic 群）---
const basic=groups.find(g=>g.group.startsWith('Basic'));
basic.items.push({
  id:'logo',
  name:'Logo 品牌標誌',
  status:'ready',
  kind:'brand-asset',
  l0Ref:null,
  note:'專案級可替換品牌資產。上傳後同步替換：網站 topbar / library header / library footer 三處。鎖寬度、高度等比。存於專案狀態、bake 時以 data URI inline。',
  targets:['site-topbar(.brand-logo)','library-header(hdrLogo/HDR_LOGO)','library-footer(ftrLogo)'],
  axes:null
});

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
const sel=basic.items.find(it=>it.id==='selector');
if(sel){ sel.composes=['checkbox','radio']; sel.note='複合選擇族：內部用 checkbox（含 indeterminate 半選）與 radio；軸定義見 subComponents。'; }

// --- 獨立 sub-component（非頂層陳列項、但有自己的軸）---
const subComponents={
  checkbox:{name:'Checkbox 核取方塊',partOf:'selector',axes:axesOf('checkbox')},
  radio:{name:'Radio 單選鈕',partOf:'selector',axes:axesOf('radio')}
};

const registry={
  meta:{
    version:'0.1.0',
    generated:'2026-07-17',
    source:'library/gallery.html',
    principle:'library-first canonical id；框架 L0 僅供 l0Ref 參考，id 主權在 library。',
    counts:{}
  },
  groups,
  subComponents
};
// 統計
let total=0,withAxes=0,noAxes=0;
groups.forEach(g=>g.items.forEach(it=>{total++;it.axes?withAxes++:noAxes++;}));
registry.meta.counts={total,withAxes,noAxes};

fs.mkdirSync(require('path').dirname(OUT),{recursive:true});
fs.writeFileSync(OUT,JSON.stringify(registry,null,2));
console.log('OK 寫入 registry:',OUT);
console.log('分組:',groups.map(g=>g.group+'('+g.items.length+')').join(' / '));
console.log('總項目:',total,' 有軸:',withAxes,' 無軸(待補/複合):',noAxes);
// 列出無軸項目（缺口候選）
groups.forEach(g=>g.items.forEach(it=>{if(!it.axes&&it.kind!=='brand-asset')console.log('  ⚠ 無軸定義:',g.group,'/',it.id,it.name);}));
