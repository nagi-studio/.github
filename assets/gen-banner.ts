// Render the NAGI STUDIO org banner — structured house style (dark + acid `#c8f031`,
// faint blueprint grid + scanlines, Space Grotesk + JetBrains Mono). Left column:
// brand lockup / wordmark / tagline / a shelf of the five project logos. Right: the
// transparent Anon (爱音) cutout cropped into a framing circle (an orbit ring traces
// the crop), with glowing nodes, a soft disc backdrop and a floor glow. Crisp
// HTML/CSS via puppeteer, not AI art. Needs puppeteer-core + system Chrome (same
// recipe as nagi-bench-site/scripts/og.ts).
//   bun assets/gen-banner.ts   → profile/assets/banner.png (2560x1440 @2x)
// Anon cutout = assets/anon.png, keyed from ai-jiahao-test's Live2D film page; see
// that repo's COVER-HANDOFF.md to regenerate or swap the pose. Shelf icons are the
// same files used in profile/README.md (profile/assets/logos/*.png).
import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const here = fileURLToPath(new URL('.', import.meta.url))
const b64 = (p: string) => readFileSync(p).toString('base64')
const anon = b64(`${here}anon.png`)
const out = `${here}../profile/assets/banner.png`
const L = `${here}../profile/assets/logos`
const logos = [
  { src: b64(`${L}/nagi-bench.png`), label: 'BENCH' },
  { src: b64(`${L}/ai-jiahao.png`), label: '嘉豪测试' },
  { src: b64(`${L}/voyager.png`), label: 'VOYAGER' },
  { src: b64(`${L}/shiori.png`), label: 'SHIORI' },
  { src: b64(`${L}/komorebi.png`), label: 'KOMOREBI' },
]

const W = 1280
const H = 720
const N_SVG = `<svg viewBox="0 0 64 64"><path d="M16 48V16h7l18 22V16h7v32h-7L23 26v22h-7z" fill="#0a0a0e"/></svg>`
// Anon is a half-body cutout (ends at the skirt). Crop her into the framing circle:
// keep the head, let the circle's lower arc take the skirt — a natural portrait cut
// instead of a straight hard edge. (element-local coords; box = right:80 bottom:0.)
const MASK = 'radial-gradient(circle 320px at 238px 272px,#000 0,#000 84%,transparent 99%)'

const html = `<!doctype html><html><head><meta charset="utf8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px}
body{background:#0a0a0e;color:#ecece4;font-family:'Space Grotesk','PingFang SC','Hiragino Sans GB',sans-serif;overflow:hidden;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(236,236,228,.032) 1px,transparent 1px),linear-gradient(90deg,rgba(236,236,228,.032) 1px,transparent 1px);background-size:56px 56px}
.glow{position:absolute;width:720px;height:720px;left:-240px;top:-280px;background:radial-gradient(circle,#c8f03116 0%,transparent 60%)}
.scan{position:absolute;inset:0;z-index:6;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,0,0,.16) 3px 4px);opacity:.32;pointer-events:none}

/* right stage: framing circle = where Anon is cropped */
.disc{position:absolute;z-index:1;left:632px;top:-38px;width:636px;height:636px;border-radius:50%;background:radial-gradient(circle at 50% 42%,#c8f0311c 0%,#5cc6e810 46%,transparent 70%)}
.ring{position:absolute;z-index:3;left:630px;top:-40px;width:640px;height:640px;border:1.5px solid rgba(200,240,49,.26);border-radius:50%}
.ring2{position:absolute;z-index:1;left:566px;top:-104px;width:768px;height:768px;border:1px solid rgba(236,236,228,.055);border-radius:50%}
.floor{position:absolute;z-index:1;left:766px;top:548px;width:368px;height:120px;background:radial-gradient(ellipse at center,#c8f03124 0%,transparent 72%);filter:blur(7px)}
.dot{position:absolute;z-index:3;border-radius:50%;background:#c8f031}
.d1{left:694px;top:206px;width:11px;height:11px;box-shadow:0 0 18px 3px #c8f03188}
.d2{left:1142px;top:150px;width:7px;height:7px;box-shadow:0 0 12px 2px #c8f03166}
.d3{left:712px;top:470px;width:8px;height:8px;background:#5cc6e8;box-shadow:0 0 14px 2px #5cc6e877}
.tick{position:absolute;z-index:1;left:600px;top:300px;width:34px;height:1px;background:rgba(200,240,49,.4)}
.anon{position:absolute;z-index:2;right:80px;bottom:0;height:712px;filter:drop-shadow(0 14px 38px #c8f03126) drop-shadow(0 6px 18px rgba(0,0,0,.45));-webkit-mask-image:${MASK};mask-image:${MASK}}

/* left content */
.lockup{position:absolute;z-index:4;left:76px;top:62px;display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-size:15px;letter-spacing:.30em;color:#9a9aa2;text-transform:uppercase}
.lockup .n{width:30px;height:30px;background:#c8f031;display:grid;place-items:center;box-shadow:0 0 22px #c8f03155}
.lockup .n svg{width:70%;height:70%}
.bar{position:absolute;z-index:4;left:78px;top:152px;width:66px;height:6px;background:#c8f031;box-shadow:0 0 20px #c8f03166}
.title{position:absolute;z-index:4;left:74px;top:170px;font-weight:700;font-size:116px;line-height:.86;letter-spacing:-.02em;color:#ecece4}
.tag{position:absolute;z-index:4;left:78px;top:430px;font-size:30px;font-weight:600;color:#ecece4;letter-spacing:.01em}
.tag .s{color:#c8f031}
.tagen{position:absolute;z-index:4;left:78px;top:476px;font-family:'JetBrains Mono';font-size:16px;letter-spacing:.02em;color:#7e7e88}

/* project shelf */
.shelf{position:absolute;z-index:4;left:78px;bottom:52px;width:584px;padding-top:20px;border-top:1px solid rgba(236,236,228,.13)}
.shelf .hd{position:absolute;top:-9px;left:0;background:#0a0a0e;padding-right:12px;font-family:'JetBrains Mono';font-size:11px;letter-spacing:.26em;color:#6f6f78;text-transform:uppercase}
.row{display:flex;gap:30px;align-items:flex-start}
.cell{display:flex;flex-direction:column;align-items:center;gap:9px;width:84px}
.cell img{width:38px;height:38px;border-radius:9px;box-shadow:0 4px 14px rgba(0,0,0,.4)}
.cell span{font-family:'JetBrains Mono';font-weight:600;font-size:11px;letter-spacing:.08em;color:#9a9aa2;text-transform:uppercase;white-space:nowrap}

.vign{position:absolute;z-index:5;inset:0;box-shadow:inset 0 0 220px 60px rgba(0,0,0,.5);pointer-events:none}
</style></head><body>
<div class="grid"></div><div class="glow"></div>
<div class="ring2"></div><div class="disc"></div><div class="floor"></div>
<img class="anon" src="data:image/png;base64,${anon}"/>
<div class="ring"></div>
<div class="tick"></div><div class="dot d1"></div><div class="dot d2"></div><div class="dot d3"></div>

<div class="lockup"><span class="n">${N_SVG}</span> NAGI STUDIO</div>
<div class="bar"></div>
<div class="title">NAGI<br>STUDIO</div>
<div class="tag">兴趣驱动的<span class="s">开源项目</span>与<span class="s">社群</span></div>
<div class="tagen">Open-source projects and a community, built for the joy of it.</div>

<div class="shelf"><span class="hd">Projects</span><div class="row">
${logos.map((g) => `<div class="cell"><img src="data:image/png;base64,${g.src}"><span>${g.label}</span></div>`).join('')}
</div></div>

<div class="vign"></div><div class="scan"></div>
</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(async () => { await (document as any).fonts?.ready })
await page.evaluate(() => new Promise((r) => setTimeout(r, 300)))
await page.screenshot({ path: out as `${string}.png`, clip: { x: 0, y: 0, width: W, height: H } })
await browser.close()
console.log('done →', out)
