import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const docsRoot = path.join(repoRoot, 'docs')
const publicRoots = [
  path.join(docsRoot, 'public'),
  path.join(docsRoot, '.vitepress', 'public'),
]

const EXTERNAL_TIMEOUT_MS = 12000
const EXTERNAL_CONCURRENCY = 20

const markdownLinkRe = /\[[^\]]*\]\(([^)]+)\)/g
const htmlLinkRe = /<(?:a|img)\b[^>]*?\b(?:href|src)=["']([^"']+)["'][^>]*>/gi
const frontmatterRe = /^---\n[\s\S]*?\n---\n/
const fencedCodeRe = /```[\s\S]*?```/g
const inlineCodeRe = /`[^`]*`/g

const mdFiles = await listMarkdownFiles(docsRoot)
const permalinkMap = await buildPermalinkMap(mdFiles)

const internalFailures = []
const externalByUrl = new Map()

for (const filePath of mdFiles) {
  const raw = await readFile(filePath, 'utf8')
  const content = raw
    .replace(frontmatterRe, '')
    .replace(fencedCodeRe, '')
    .replace(inlineCodeRe, '')

  for (const link of extractLinks(content)) {
    const normalized = normalizeLink(link)
    if (!normalized) {
      continue
    }

    if (isExternal(normalized)) {
      const stripped = stripAnchorAndQuery(normalized)
      if (!externalByUrl.has(stripped)) {
        externalByUrl.set(stripped, new Set())
      }
      externalByUrl.get(stripped).add(toRepoRel(filePath))
      continue
    }

    if (normalized.startsWith('#')) {
      continue
    }

    const ok = resolveInternalLink(filePath, normalized, permalinkMap)
    if (!ok) {
      internalFailures.push({
        source: toRepoRel(filePath),
        link: normalized,
      })
    }
  }
}

const externalFailures = await checkExternalUrls(externalByUrl)

if (internalFailures.length > 0) {
  console.error('\n[link-check] Internal broken links')
  for (const item of internalFailures) {
    console.error(`- ${item.source} -> ${item.link}`)
  }
}

if (externalFailures.length > 0) {
  console.error('\n[link-check] External HTTP 404 links')
  for (const item of externalFailures) {
    const sources = item.sources.join(', ')
    console.error(`- ${item.url} (sources: ${sources})`)
  }
}

const summary = `[link-check] scanned ${mdFiles.length} files | internal errors=${internalFailures.length} | external 404=${externalFailures.length}`
if (internalFailures.length > 0 || externalFailures.length > 0) {
  console.error(`\n${summary}`)
  process.exit(1)
}

console.log(`\n${summary}`)

function extractLinks(content) {
  const links = []
  for (const m of content.matchAll(markdownLinkRe)) {
    links.push(m[1])
  }
  for (const m of content.matchAll(htmlLinkRe)) {
    links.push(m[1])
  }
  return links
}

function normalizeLink(link) {
  if (!link) {
    return null
  }
  const trimmed = link.trim()
  if (!trimmed) {
    return null
  }
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

function isExternal(link) {
  return link.startsWith('http://') || link.startsWith('https://')
}

function stripAnchorAndQuery(link) {
  return link.split('#', 1)[0].split('?', 1)[0]
}

function resolveInternalLink(sourceFile, rawLink, permalinkMap) {
  if (rawLink.startsWith('mailto:') || rawLink.startsWith('tel:') || rawLink.startsWith('javascript:')) {
    return true
  }

  let link = stripAnchorAndQuery(rawLink)
  if (!link) {
    return true
  }

  if (link.startsWith('/openclaw-docs-ko/')) {
    link = link.slice('/openclaw-docs-ko'.length)
  }

  if (link.startsWith('/')) {
    const permalinkKey = ensureTrailingSlash(link)
    if (permalinkMap.has(permalinkKey)) {
      return true
    }
  }

  const isAbsolute = link.startsWith('/')
  const sourceDir = path.dirname(sourceFile)
  const relPath = isAbsolute ? link.slice(1) : link
  const relNorm = path.posix.normalize(relPath)

  if (relNorm === '.' || relNorm === '') {
    return true
  }

  const pathCandidates = []

  if (isAbsolute) {
    pathCandidates.push(...absoluteCandidates(relNorm))
  } else {
    pathCandidates.push(...relativeCandidates(sourceDir, relNorm))
  }

  return pathCandidates.some((p) => existsSync(p))
}

function absoluteCandidates(relNorm) {
  const candidates = []
  const hasExt = path.posix.extname(relNorm) !== ''

  for (const root of [docsRoot, ...publicRoots]) {
    const base = path.join(root, relNorm)
    if (hasExt) {
      candidates.push(base)
      candidates.push(`${base}.md`)
      candidates.push(`${base}.mdx`)
      candidates.push(path.join(base, 'index.md'))
      continue
    }
    candidates.push(`${base}.md`)
    candidates.push(path.join(base, 'index.md'))
    candidates.push(base)
    candidates.push(path.join(base, 'index.html'))
  }

  return candidates
}

function relativeCandidates(sourceDir, relNorm) {
  const candidates = []
  const hasExt = path.posix.extname(relNorm) !== ''
  const base = path.join(sourceDir, relNorm)

  if (hasExt) {
    candidates.push(base)
    candidates.push(`${base}.md`)
    candidates.push(`${base}.mdx`)
    candidates.push(path.join(base, 'index.md'))
  } else {
    candidates.push(`${base}.md`)
    candidates.push(path.join(base, 'index.md'))
    candidates.push(base)
    candidates.push(path.join(base, 'index.html'))
  }

  return candidates
}

async function buildPermalinkMap(files) {
  const map = new Map()
  const permalinkRe = /^permalink:\s*([^\n]+)$/m

  for (const filePath of files) {
    const raw = await readFile(filePath, 'utf8')
    const frontmatter = raw.match(frontmatterRe)?.[0]
    if (!frontmatter) {
      continue
    }

    const permalink = frontmatter.match(permalinkRe)?.[1]?.trim()
    if (!permalink) {
      continue
    }

    const unquoted = permalink.replace(/^['"]|['"]$/g, '')
    if (!unquoted.startsWith('/')) {
      continue
    }

    map.set(ensureTrailingSlash(unquoted), toRepoRel(filePath))
  }

  return map
}

function ensureTrailingSlash(input) {
  return input.endsWith('/') ? input : `${input}/`
}

async function checkExternalUrls(externalMap) {
  const urls = [...externalMap.keys()]
  const queue = [...urls]
  const failures = []

  const workers = Array.from({ length: Math.min(EXTERNAL_CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0) {
      const url = queue.shift()
      const status = await fetchStatus(url)
      if (status === 404) {
        failures.push({
          url,
          sources: [...externalMap.get(url)].sort(),
        })
      }
    }
  })

  await Promise.all(workers)
  return failures.sort((a, b) => a.url.localeCompare(b.url))
}

async function fetchStatus(url) {
  const head = await requestStatus(url, 'HEAD')
  if (head === 404) {
    return 404
  }
  if (head !== null && head < 400) {
    return head
  }

  const get = await requestStatus(url, 'GET')
  return get
}

async function requestStatus(url, method) {
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
      headers: {
        'User-Agent': 'openclaw-docs-ko-link-check/1.0',
      },
    })
    return res.status
  } catch {
    return null
  }
}

async function listMarkdownFiles(root) {
  const out = []
  await walk(root, out)
  return out
}

async function walk(dir, out) {
  const { readdir } = await import('node:fs/promises')
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(fullPath, out)
      continue
    }
    if (entry.isFile() && fullPath.endsWith('.md')) {
      out.push(fullPath)
    }
  }
}

function toRepoRel(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/')
}
