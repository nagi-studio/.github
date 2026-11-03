// Rewrite the videos block of profile/README.md (between the videos:start / videos:end markers)
// from the 【Re:从零开始的AI学习】 series on Bilibili: the Season 1 recap card with its current
// views, then the three newest episodes with their covers and companion skills.
//   bun scripts/update-videos.ts     (also runs daily in .github/workflows/update-videos.yml)
// Views are rounded to 万 and the newest episodes show none, so the README only changes when an
// episode comes out or the recap crosses another 万 — not on every run.
// Bilibili sometimes rejects datacenter IPs. The series list is required (the script fails and
// the README stays as it is); per-video details are optional and cached in profile/videos.json.
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const MID = '312249633'
const SEASON = '8719249'
const FEATURED = 'BV1VZWc6dECG' // Season 1 recap, picked for Weekly Must-Watch #395
const NEWEST = 3

const root = fileURLToPath(new URL('..', import.meta.url))
const README = `${root}profile/README.md`
const CACHE = `${root}profile/videos.json`
const COVERS = `${root}profile/assets/videos`
const START = '<!-- videos:start -->'
const END = '<!-- videos:end -->'

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36',
  Referer: `https://space.bilibili.com/${MID}`,
}

type Archive = { bvid: string; title: string; pic: string; pubdate: number; stat: { view: number } }
/** Per-video details that need one extra request each; null skill = checked, the episode has none. */
type Cache = { skills: Record<string, string | null>; hisRank?: number }

async function bili<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.bilibili.com${path}`, { headers })
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
  const body = (await res.json()) as { code: number; message?: string; data: T }
  if (body.code !== 0) throw new Error(`${path}: code ${body.code} ${body.message ?? ''}`)
  return body.data
}

async function seriesArchives() {
  const data = await bili<{ archives: Archive[] }>(
    `/x/polymer/web-space/seasons_archives_list?mid=${MID}&season_id=${SEASON}&page_num=1&page_size=100`,
  )
  if (!data.archives?.length) throw new Error('series list is empty')
  return data.archives
}

/** Video description and best-ever site rank; null when Bilibili refuses (kept from the cache). */
async function videoDetails(bvid: string) {
  try {
    const v = await bili<{ desc: string; stat: { his_rank: number } }>(`/x/web-interface/view?bvid=${bvid}`)
    return { skill: v.desc.match(/[Ss]kill\s*「([^」]+)」/)?.[1] ?? null, hisRank: v.stat.his_rank }
  } catch (e) {
    console.warn(`details for ${bvid} unavailable (${e}); using the cache`)
    return null
  }
}

/** skill name → its folder in nagi-studio/skills (skills/<category>/<name>), which moves between categories. */
async function skillPaths() {
  const res = await fetch('https://api.github.com/repos/nagi-studio/skills/git/trees/main?recursive=1', {
    headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
  })
  if (!res.ok) throw new Error(`skills tree: HTTP ${res.status}`)
  const { tree } = (await res.json()) as { tree: { path: string; type: string }[] }
  const paths = new Map<string, string>()
  for (const { path, type } of tree) {
    const m = path.match(/^skills\/[^/]+\/([^/]+)$/)
    if (m && type === 'tree') paths.set(m[1]!, path)
  }
  return paths
}

/** 1151456 → "115 万", 48472 → "4.8 万". */
function wan(n: number) {
  if (n < 10_000) return String(n)
  const w = n / 10_000
  return `${w >= 100 ? Math.floor(w) : Math.floor(w * 10) / 10} 万`
}
/** Same granularity as wan(): 1151456 → "1.15M", 48472 → "48k". */
const en = (n: number) => (n >= 1e6 ? `${Math.floor(n / 1e4) / 100}M` : `${Math.floor(n / 1e3)}k`)
const date = (unix: number) => new Date((unix + 8 * 3600) * 1000).toISOString().slice(0, 10).replaceAll('-', '.')
const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const SERIES_PREFIX = /^【Re:从零开始的AI学习】\s*/

async function saveCover(a: Archive) {
  const file = `${COVERS}/${a.bvid}.jpg`
  if (existsSync(file)) return
  const res = await fetch(`${a.pic.replace(/^http:/, 'https:')}@672w_378h_1c.jpg`, { headers })
  if (!res.ok) throw new Error(`cover ${a.bvid}: HTTP ${res.status}`)
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
}

function render(total: number, featured: Archive, hisRank: number | undefined, newest: Archive[], skillLink: (bvid: string) => string) {
  const url = (bvid: string) => `https://www.bilibili.com/video/${bvid}`
  const rank = hisRank ? ` · 全站排行最高第 ${hisRank} 名` : ''
  const rankEn = hisRank ? `, peaked at #${hisRank} site-wide` : ''
  const cells = newest.map(a => {
    const title = escape(a.title.replace(SERIES_PREFIX, ''))
    return `<td width="33%" valign="top">
<a href="${url(a.bvid)}"><img src="assets/videos/${a.bvid}.jpg" width="100%" alt="${title}" /></a><br />
<a href="${url(a.bvid)}"><b>${title}</b></a><br />
<sub>${date(a.pubdate)}${skillLink(a.bvid)}</sub>
</td>`
  })
  return `${START}
<!-- Generated by scripts/update-videos.ts; edit the script, not this block. -->
<table>
<tr>
<td width="36%" valign="middle"><a href="${url(featured.bvid)}"><img src="assets/weekly-395.jpg" width="100%" alt="入选 B 站每周必看第 395 期：【Re:从零开始的AI学习】第一季总集篇" /></a></td>
<td valign="middle">
<sub>入选 B 站「每周必看」第 395 期 · 2026.10.16</sub><br />
<a href="${url(featured.bvid)}"><b>${escape(featured.title)}</b></a><br />
13 期、55 分钟，从零开始把 AI 用起来。${wan(featured.stat.view)}播放${rank}。<br />
<sub>Season 1 recap of the series, featured in Bilibili's Weekly Must-Watch #395 — 13 episodes in 55 minutes, ${en(featured.stat.view)}+ views${rankEn}.</sub>
</td>
</tr>
</table>

<sub>最新几期 · Latest episodes — <a href="https://space.bilibili.com/${MID}/lists/${SEASON}?type=season">全部 ${total} 期</a></sub>

<table>
<tr>
${cells.join('\n')}
</tr>
</table>
${END}`
}

const archives = await seriesArchives()
const featured = archives.find(a => a.bvid === FEATURED)
if (!featured) throw new Error(`${FEATURED} is no longer in the series`)
const newest = archives.filter(a => a.bvid !== FEATURED).sort((a, b) => b.pubdate - a.pubdate).slice(0, NEWEST)

const cache: Cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : { skills: {} }
for (const a of [featured, ...newest]) {
  if (a.bvid !== FEATURED && a.bvid in cache.skills) continue // descriptions don't change; the rank might
  const details = await videoDetails(a.bvid)
  if (!details) continue
  if (a.bvid === FEATURED) cache.hisRank = details.hisRank
  else cache.skills[a.bvid] = details.skill
}
const paths = await skillPaths()
const skillLink = (bvid: string) => {
  const name = cache.skills[bvid]
  const path = name && paths.get(name)
  return path ? ` · 配套 skill：<a href="https://github.com/nagi-studio/skills/tree/main/${path}">${name}</a>` : ''
}

for (const a of newest) await saveCover(a)
const keep = new Set(newest.map(a => `${a.bvid}.jpg`))
for (const f of readdirSync(COVERS)) if (/^BV\w+\.jpg$/.test(f) && !keep.has(f)) rmSync(`${COVERS}/${f}`)

const readme = readFileSync(README, 'utf8')
const [before, rest] = readme.split(START)
const after = rest?.split(END)[1]
if (before === undefined || after === undefined) throw new Error(`${README} is missing the ${START} / ${END} markers`)
const block = render(archives.length, featured, cache.hisRank, newest, skillLink)
writeFileSync(README, before + block + after)
writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n')
console.log(`recap ${featured.stat.view} views; newest: ${newest.map(a => a.bvid).join(', ')}`)
