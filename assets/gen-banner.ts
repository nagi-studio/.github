// Render the NAGI STUDIO org banner in the house style (dark + acid-lime, blueprint
// grid, glow, scanlines, Space Grotesk + JetBrains Mono) with the transparent Anon
// (爱音) cutout and faint floating chips — crisp HTML/CSS via puppeteer, not AI art.
// Same recipe as nagi-bench-site/scripts/og.ts; needs puppeteer-core + system Chrome.
//   bun assets/gen-banner.ts   → profile/assets/banner.png (2560x1360 @2x)
// The Anon cutout (assets/anon.png) is keyed from ai-jiahao-test's Live2D film page;
// see that repo's COVER-HANDOFF.md for how to regenerate / swap the pose.
import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const here = fileURLToPath(new URL('.', import.meta.url))
const anon = readFileSync(`${here}anon.png`).toString('base64')
const out = `${here}../profile/assets/banner.png`

const W = 1280
const H = 680

// faint floating chips peeking out around Anon — the studio's ambient chatter
const CHIPS = [
  { t: '// 又在搓新玩具了', x: 50, y: 16, rot: -3 },
  { t: '// Discord 一起玩', x: 55, y: 39, rot: 2.5 },
  { t: '// 看板娘 · 爱音 Anon', x: 52, y: 60, rot: -2 },
]

const html = `<!doctype html><html><head><meta charset="utf8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px}
body{background:#0a0a0e;color:#ecece4;font-family:'Space Grotesk','PingFang SC','Hiragino Sans GB',sans-serif;overflow:hidden;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(236,236,228,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(236,236,228,.045) 1px,transparent 1px);background-size:54px 54px}
.glow{position:absolute;width:780px;height:780px;left:-160px;top:-180px;background:radial-gradient(circle,#c8f03122 0%,transparent 60%)}
.glow2{position:absolute;width:560px;height:560px;right:-120px;bottom:-200px;background:radial-gradient(circle,#5cc6e815 0%,transparent 62%)}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,0,0,.18) 3px 4px);opacity:.4}
.chip{position:absolute;z-index:1;font-family:'JetBrains Mono','PingFang SC',monospace;font-size:17px;color:#8f8f97;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-left:3px solid #c8f03144;padding:8px 13px;border-radius:7px;white-space:nowrap;backdrop-filter:blur(2px)}
.kick{position:absolute;z-index:3;left:74px;top:58px;font-family:'JetBrains Mono';font-size:20px;letter-spacing:.24em;color:#84848e;text-transform:uppercase}
.kick b{color:#c8f031}
.title{position:absolute;z-index:3;left:70px;top:120px;font-weight:700;font-size:132px;line-height:.9;letter-spacing:-.01em;text-shadow:0 8px 40px rgba(0,0,0,.75)}
.title .lime{color:#c8f031}
.sub{position:absolute;z-index:3;left:74px;top:432px;font-size:42px;font-weight:700;color:#ecece4;text-shadow:0 4px 24px rgba(0,0,0,.7)}
.sub .lime{color:#c8f031}
.meta{position:absolute;z-index:3;left:74px;top:506px;font-family:'JetBrains Mono';font-size:21px;letter-spacing:.03em;color:#9a9aa2}
.foot{position:absolute;z-index:3;left:74px;bottom:60px;font-family:'JetBrains Mono';font-size:27px;letter-spacing:.06em}
.foot .u{color:#c8f031;font-weight:700}
.foot .d{color:#84848e}
.anon{position:absolute;z-index:2;right:128px;bottom:-22px;height:726px;filter:drop-shadow(0 20px 60px #c8f03140) drop-shadow(0 8px 24px rgba(0,0,0,.6))}
.vign{position:absolute;z-index:5;inset:0;box-shadow:inset 0 0 220px 60px rgba(0,0,0,.55);pointer-events:none}
</style></head><body>
<div class="grid"></div><div class="glow"></div><div class="glow2"></div>
${CHIPS.map((c) => `<div class="chip" style="left:${(c.x / 100) * W}px;top:${(c.y / 100) * H}px;transform:rotate(${c.rot}deg)">${c.t}</div>`).join('')}
<img class="anon" src="data:image/png;base64,${anon}"/>
<div class="scan"></div>
<div class="kick"><b>■</b> 凭兴趣开源 · 运营社群</div>
<div class="title">NAGI<br><span class="lime">STUDIO</span></div>
<div class="sub">做喜欢的东西，<span class="lime">和同好一起</span>。</div>
<div class="meta">开源项目 · 社群据点 · 一群人的游乐场</div>
<div class="foot"><span class="u">nagi.fun</span> <span class="d">· by Nagi-ovo</span></div>
<div class="vign"></div>
</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(async () => {
  await (document as any).fonts?.ready
})
await page.evaluate(() => new Promise((r) => setTimeout(r, 300)))
await page.screenshot({ path: out as `${string}.png`, clip: { x: 0, y: 0, width: W, height: H } })
await browser.close()
console.log('done →', out)
