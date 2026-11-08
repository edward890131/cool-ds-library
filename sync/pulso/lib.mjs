// PulsoIcon 共用工具（Goons DS Studio）：讀圖示資料、輸出靜態 SVG、打包網頁播放器。
// 依賴裝在 sync/pulso/node_modules：cd sync/pulso && npm install
import { iconFrame, frameMarkup } from "pulsoicon-core/frame";
import { ICON_NAMES } from "pulsoicon-core/names";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgVersion = (name) => JSON.parse(readFileSync(join(here, "node_modules", name, "package.json"), "utf8")).version;
export const PULSO_VERSION = pkgVersion("pulsoicon-core");
export const MOTION_VERSION = pkgVersion("motion");
const NAMES = new Set(ICON_NAMES);
export const hasIcon = (key) => NAMES.has(key);

/** 一顆 icon 的原始資料（IconData：形狀＋每個形狀的動態＋實心畫法）。 */
export async function loadIcon(key) {
  if (!NAMES.has(key)) throw new Error(`PulsoIcon 沒有「${key}」這顆 icon`);
  const mod = await import(`pulsoicon-core/icons/${key}`);
  return Object.values(mod)[0];
}

/** 靜態 SVG（與網站 PI() 輸出相同）：去掉寬高交給 CSS，root 帶 data-pi 供播放器辨識。 */
export function markup(data, { solid = false, maskId = "pim" } = {}) {
  const lead = { "data-pi": data.key };
  if (solid) lead["data-pi-solid"] = "";
  return frameMarkup(iconFrame(data, { solid, maskId }), lead).replace(/^<svg([^>]*?) height="[^"]*"/, "<svg$1").replace(/^<svg([^>]*?) width="[^"]*"/, "<svg$1");
}

/** 網頁播放器：pulsoicon-core 的 iconFrame／frameMarkup／playIcon ＋ motion，打成一支 IIFE（window.PulsoCore）。 */
export async function bundleRuntime() {
  const r = await build({
    stdin: { contents: "export {iconFrame,frameMarkup,TRIGGER_SELECTOR} from 'pulsoicon-core/frame';export {playIcon} from 'pulsoicon-core/dom';", resolveDir: here, loader: "js" },
    bundle: true, format: "iife", globalName: "PulsoCore", minify: true, legalComments: "none", write: false, target: "es2020",
  });
  return r.outputFiles[0].text.trim();
}
