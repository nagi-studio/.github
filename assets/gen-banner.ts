// Render the org banner for 卡普迪姆 / Carpe Diem — notebook house style: cream grid paper,
// two brand colours (the avatar's indigo hair vs Claude orange), giant type as the hero.
// Top: 「卡普迪姆」 in Noto Serif SC 900 (indigo) over 「Carpe Diem」 in Fraunces 900 soft
// (orange); the avatar is a taped-on round sticker. Bottom: series tag on an orange
// highlighter stroke, platform handles, and a shelf of project logos. Crisp HTML/CSS via
// puppeteer, not AI lettering. Needs puppeteer-core + system Chrome (same recipe as
// nagi-bench-site/scripts/og.ts).
//   bun assets/gen-banner.ts   → profile/assets/banner.png (2560x1440 @2x)
// assets/avatar.png is the purchased 卡普迪姆 avatar, cut out to transparent.
// assets/icons/*.svg are platform marks from simple-icons (CC0), drawn in one ink colour.
// Shelf icons are the same files used in profile/README.md (profile/assets/logos/*.png).
import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const here = fileURLToPath(new URL('.', import.meta.url))
const b64 = (p: string) => readFileSync(p).toString('base64')
const avatar = b64(`${here}avatar.png`)
const out = `${here}../profile/assets/banner.png`
const L = `${here}../profile/assets/logos`
const logos = [
  { src: b64(`${L}/nagi-bench.png`), label: 'bench' },
  { src: b64(`${L}/ai-jiahao.png`), label: '嘉豪测试' },
  { src: b64(`${L}/voyager.png`), label: 'voyager' },
  { src: b64(`${L}/shiori.png`), label: 'shiori 栞' },
  { src: b64(`${L}/komorebi.png`), label: 'komorebi' },
]
const icon = (n: string) =>
  readFileSync(`${here}icons/${n}.svg`, 'utf8').replace(/<title>.*?<\/title>/, '').replace('<svg ', '<svg aria-hidden="true" ')

const W = 1280
const H = 720
// indigo = the avatar's hair; orange = Claude orange for big type, its deeper shade for
// small text so it stays readable on the cream paper
const C = { ink: '#14152b', indigo: '#4b4fb0', peri: '#9aa6f2', orange: '#d97757', orangeDeep: '#c15f3c', orangeHl: '#f6c4ae', paper: '#fbf8f2', kraft: '#dccaa4' }
const spark = (x: number, y: number, s: number, fill: string, stroke: string) =>
  `<svg class="spark" style="left:${x}px;top:${y}px" width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M20 3 C22 15 25 18 37 20 C25 22 22 25 20 37 C18 25 15 22 3 20 C15 18 18 15 20 3Z" fill="${fill}" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/></svg>`

const html = `<!doctype html><html><head><meta charset="utf8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@900&family=Fraunces:opsz,wght,SOFT,WONK@9..144,900,100,1&family=Caveat:wght@700&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px}
body{background:${C.paper};color:${C.ink};font-family:'LXGW WenKai',sans-serif;overflow:hidden;position:relative}
body>*{position:absolute}
.grid{inset:0;background-image:linear-gradient(${C.indigo}12 1px,transparent 1px),linear-gradient(90deg,${C.indigo}12 1px,transparent 1px);background-size:32px 32px}
.margin{left:56px;top:0;bottom:0;width:2px;background:${C.orange}55}

/* hero type */
.zh{left:52px;top:30px;font-family:'Noto Serif SC';font-weight:900;font-size:232px;line-height:1;letter-spacing:.02em;color:${C.indigo}}
.en{left:44px;top:290px;font-family:Fraunces;font-weight:900;font-variation-settings:'SOFT' 100,'WONK' 1;font-size:206px;line-height:.86;letter-spacing:-.015em;color:${C.orange};white-space:nowrap}

/* avatar sticker, taped on */
.stk{left:1050px;top:52px;width:172px;height:172px;border-radius:50%;transform:rotate(6deg);z-index:4;background:${C.peri} url(data:image/png;base64,${avatar}) no-repeat 50% 16%/112%;box-shadow:0 0 0 6px #fff,5px 8px 0 6px ${C.ink}1f}
.tape{left:1098px;top:38px;width:120px;height:28px;transform:rotate(14deg);z-index:6;background:${C.kraft}d8;background-image:repeating-linear-gradient(90deg,transparent 0 6px,#ffffff22 6px 7px)}
.spark{z-index:5}
.rule{left:40px;top:528px;z-index:3}

/* bottom band */
.series{left:74px;top:558px;font-size:36px;font-weight:700;color:${C.indigo};-webkit-text-stroke:.6px ${C.indigo};padding:0 6px;background:linear-gradient(transparent 52%,${C.orangeHl} 52%,${C.orangeHl} 94%,transparent 94%)}
.handle{left:80px;top:616px}
.handle .l1,.handle .l2{display:flex;align-items:center;gap:10px}
.handle svg{fill:currentColor;flex:none}
.handle .l1{font-size:30px}.handle .l1 svg{width:1em;height:1em}
.handle .l1 b{font-weight:700;-webkit-text-stroke:.5px ${C.ink}}
.handle .xhs{display:inline-grid;place-items:center;width:1.12em;height:1.12em;border-radius:.26em;background:${C.ink};flex:none}
.handle .l1 .xhs svg{width:.98em;height:.98em;fill:${C.paper}}
.handle .l2{margin-top:8px;font-family:'JetBrains Mono';font-weight:700;font-size:19px;color:${C.indigo}}
.handle .l2 svg{width:1.05em;height:1.05em}.handle .gap{width:16px}
.shelf{left:690px;top:574px;display:flex;align-items:center;gap:12px}
.shelf .hd{font-family:Caveat;font-weight:700;font-size:38px;color:${C.indigo}}
.row{display:flex;gap:6px;align-items:flex-start}
.cell{display:flex;flex-direction:column;align-items:center;gap:8px;width:84px}
.cell img{width:48px;height:48px;border-radius:11px;box-shadow:0 0 0 3px #fff,2px 3px 0 3px ${C.ink}1c}
.cell:nth-child(odd) img{transform:rotate(-5deg)}.cell:nth-child(even) img{transform:rotate(4deg)}
.cell span{font-family:Caveat,'LXGW WenKai';font-weight:700;font-size:25px;line-height:1;color:${C.ink}d0;white-space:nowrap}
</style></head><body>
<div class="grid"></div><div class="margin"></div>
<div class="zh">卡普迪姆</div>
<div class="en">Carpe Diem</div>
<div class="stk"></div><div class="tape"></div>
${spark(1010, 34, 30, 'none', C.indigo)}${spark(1200, 222, 28, C.orange, C.orangeDeep)}
<svg class="rule" width="1200" height="18" viewBox="0 0 1200 18"><path d="M4 10 Q 300 2 600 9 T 1196 8" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/></svg>
<div class="series">【Re:从零开始的AI学习】</div>
<div class="handle">
  <div class="l1">${icon('bilibili')}<span class="xhs">${icon('xiaohongshu')}</span><b>@卡普迪姆</b></div>
  <div class="l2">${icon('github')}<span>@Nagi-ovo</span><i class="gap"></i>${icon('x')}<span>@Nag1ovo</span></div>
</div>
<div class="shelf"><span class="hd">projects:</span><div class="row">
${logos.map((g) => `<div class="cell"><img src="data:image/png;base64,${g.src}"><span>${g.label}</span></div>`).join('')}
</div></div>
</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle0' })
await page.evaluate(async () => { await (document as any).fonts?.ready })
await page.screenshot({ path: out as `${string}.png`, clip: { x: 0, y: 0, width: W, height: H } })
await browser.close()
console.log('done →', out)
