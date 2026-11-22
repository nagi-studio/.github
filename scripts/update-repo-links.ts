// Keep profile/README.md's GitHub links pointing at each repo's current name.
//   bun scripts/update-repo-links.ts     (also runs weekly in .github/workflows/update-repo-links.yml)
// GitHub redirects a renamed repo's old URL, but the old name would stay in the links, the star
// badges and any label that was just the repo name. For every github.com/<owner>/<repo> in the
// README, ask the API for the repo's current full_name (it follows the rename); when it differs,
// rewrite the links and badges, and the labels that equal the old repo name exactly
// (<b>Old</b>, alt="Old"). Hand-written labels and blurbs are left alone.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const README = fileURLToPath(new URL('../profile/README.md', import.meta.url))
// Paths under github.com that are not repos.
const NOT_OWNERS = new Set(['orgs', 'settings', 'features', 'topics', 'sponsors', 'marketplace'])

const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'nagi-studio-profile' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

/** Current "owner/repo", or undefined when the API can't say (the link is left as it is). */
async function currentName(fullName: string) {
  const res = await fetch(`https://api.github.com/repos/${fullName}`, { headers })
  if (!res.ok) {
    console.warn(`${fullName}: HTTP ${res.status}; left as it is`)
    return undefined
  }
  return ((await res.json()) as { full_name: string }).full_name
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let readme = readFileSync(README, 'utf8')
const linked = new Set<string>()
for (const m of readme.matchAll(/github\.com\/([\w.-]+)\/([\w.-]+?)(?=[/?#"'\s)]|$)/g)) {
  if (!NOT_OWNERS.has(m[1]!) && !m[2]!.endsWith('.git')) linked.add(`${m[1]}/${m[2]}`)
}
// shields.io star badges name the repo without the github.com host.
for (const m of readme.matchAll(/img\.shields\.io\/github\/stars\/([\w.-]+)\/([\w.-]+?)(?=[?"])/g)) {
  linked.add(`${m[1]}/${m[2]}`)
}

let renamed = 0
for (const old of linked) {
  const now = await currentName(old)
  if (!now || now.toLowerCase() === old.toLowerCase()) continue
  const [, oldRepo] = old.split('/') as [string, string]
  const [, newRepo] = now.split('/') as [string, string]
  const path = new RegExp(`(github\\.com/|img\\.shields\\.io/github/stars/)${escapeRe(old)}(?=[/?#"'\\s)]|$)`, 'gi')
  readme = readme
    .replace(path, `$1${now}`)
    .replaceAll(`<b>${oldRepo}</b>`, `<b>${newRepo}</b>`)
    .replaceAll(`alt="${oldRepo}"`, `alt="${newRepo}"`)
  console.log(`${old} -> ${now}`)
  renamed++
}

writeFileSync(README, readme)
console.log(`${linked.size} repos checked, ${renamed} renamed`)
