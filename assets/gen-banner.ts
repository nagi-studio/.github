// Render the NAGI STUDIO org banner — structured house style (dark + acid `#c8f031`,
// faint blueprint grid, Space Grotesk + JetBrains Mono): left content column
// (brand lockup / wordmark / tagline / project strip) and a right "character bay"
// framing the transparent Anon (爱音) cutout under a soft spotlight. Crisp HTML/CSS
// via puppeteer, not AI art. Needs puppeteer-core + system Chrome (same recipe as
// nagi-bench-site/scripts/og.ts).
//   bun assets/gen-banner.ts   → profile/assets/banner.png (2560x1280 @2x)
// Anon cutout = assets/anon.png, keyed from ai-jiahao-test's Live2D film page;
// see that repo's COVER-HANDOFF.md to regenerate or swap the pose.
import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const here = fileURLToPath(new URL('.', import.meta.url))
const anon = readFileSync(`${here}anon.png`).toString('base64')
const out = `${here}../profile/assets/banner.png`

const W = 1280
const H = 640
const N_SVG = `<svg viewBox="0 0 64 64"><path d="M16 48V16h7l18 22V16h7v32h-7L23 26v22h-7z" fill="#0a0a0e"/></svg>`

const html = `<!doctype html><html><head><meta charset="utf8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px}
body{background:#0a0a0e;color:#ecece4;font-family:'Space Grotesk','PingFang SC','Hiragino Sans GB',sans-serif;overflow:hidden;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(236,236,228,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(236,236,228,.03) 1px,transparent 1px);background-size:56px 56px}
.glow{position:absolute;width:680px;height:680px;left:-220px;top:-260px;background:radial-gradient(circle,#c8f03116 0%,transparent 60%)}

/* left content column */
.lockup{position:absolute;z-index:3;left:74px;top:60px;display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-size:15px;letter-spacing:.30em;color:#9a9aa2;text-transform:uppercase}
.lockup .n{width:30px;height:30px;background:#c8f031;display:grid;place-items:center;box-shadow:0 0 22px #c8f03155}
.lockup .n svg{width:70%;height:70%}
.bar{position:absolute;z-index:3;left:76px;top:132px;width:66px;height:6px;background:#c8f031;box-shadow:0 0 20px #c8f03166}
.title{position:absolute;z-index:3;left:72px;top:150px;font-weight:700;font-size:116px;line-height:.86;letter-spacing:-.02em;color:#ecece4}
.tag{position:absolute;z-index:3;left:76px;top:402px;font-size:29px;font-weight:600;color:#ecece4;letter-spacing:.01em}
.tagen{position:absolute;z-index:3;left:76px;top:446px;font-family:'JetBrains Mono';font-size:16px;letter-spacing:.02em;color:#7e7e88}
.strip{position:absolute;z-index:3;left:76px;top:540px;width:648px;padding-top:18px;border-top:1px solid rgba(236,236,228,.14);display:flex;gap:20px;align-items:center;font-family:'JetBrains Mono';font-weight:500;font-size:15px;letter-spacing:.14em;color:#8a8a93;text-transform:uppercase}
.strip .sep{color:#3f3f47}
.strip b{color:#c8c8cf;font-weight:700}

/* right character bay */
.bay-glow{position:absolute;z-index:1;right:90px;top:70px;width:430px;height:430px;background:radial-gradient(circle,#c8f0311f 0%,#5cc6e810 42%,transparent 66%)}
.brk{position:absolute;z-index:4;width:32px;height:32px;border-color:#c8f031}
.brk.tl{left:772px;top:48px;border-top:2px solid;border-left:2px solid}
.brk.br{left:1212px;top:562px;border-bottom:2px solid;border-right:2px solid}
.cap{position:absolute;z-index:4;left:818px;top:50px;font-family:'JetBrains Mono';line-height:1.45}
.cap .a{font-size:13px;font-weight:700;letter-spacing:.16em;color:#c8f031}
.cap .b{font-size:11px;letter-spacing:.30em;color:#7e7e88}
.anon{position:absolute;z-index:3;right:70px;bottom:-44px;height:706px;filter:drop-shadow(0 18px 50px #c8f03133) drop-shadow(0 8px 24px rgba(0,0,0,.55))}
.vign{position:absolute;z-index:5;inset:0;box-shadow:inset 0 0 200px 50px rgba(0,0,0,.5);pointer-events:none}
</style></head><body>
<div class="grid"></div><div class="glow"></div>
<div class="bay-glow"></div>
<img class="anon" src="data:image/png;base64,${anon}"/>
<div class="brk tl"></div><div class="brk br"></div>
<div class="cap"><div class="a">看板娘 · 爱音</div><div class="b">ANON</div></div>
<div class="lockup"><span class="n">${N_SVG}</span> NAGI STUDIO</div>
<div class="bar"></div>
<div class="title">NAGI<br>STUDIO</div>
<div class="tag">兴趣驱动的开源项目与社群</div>
<div class="tagen">Open-source projects and a community, built for the joy of it.</div>
<div class="strip"><b>BENCH</b><span class="sep">/</span><b>嘉豪</b><span class="sep">/</span><b>VOYAGER</b><span class="sep">/</span><b>SHIORI</b><span class="sep">/</span><b>KOMOREBI</b></div>
<div class="vign"></div>
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
