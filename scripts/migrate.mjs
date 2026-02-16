import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { extname, join } from 'path'

const DOCS_DIR = new URL('../docs', import.meta.url).pathname

function getAllMdFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    if (entry === '.vitepress' || entry === 'public' || entry === 'node_modules') continue
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...getAllMdFiles(full))
    } else if (extname(full) === '.md') {
      results.push(full)
    }
  }
  return results
}

function restoreNodeDoc() {
  const nodeDoc = join(DOCS_DIR, 'install', 'node.md')
  const nodeBackup = `${nodeDoc}.bak`

  if (!existsSync(nodeDoc) && existsSync(nodeBackup)) {
    copyFileSync(nodeBackup, nodeDoc)
    return true
  }

  return false
}

function fixFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) return content

  const fm = fmMatch[1]
  const lines = fm.split('\n')
  const kept = []
  let skipBlock = false

  for (const line of lines) {
    if (line.startsWith('x-i18n:')) { skipBlock = true; continue }
    if (line.startsWith('read_when:')) { skipBlock = true; continue }
    if (line.startsWith('summary:') && !line.startsWith('summary: |')) { continue }
    if (line.startsWith('summary: |')) { skipBlock = true; continue }

    if (skipBlock) {
      if (line.startsWith('  ') || line.startsWith('\t') || line.trim() === '') {
        continue
      }
      skipBlock = false
    }

    if (line.startsWith('  source_hash:')) continue

    kept.push(line)
  }

  while (kept.length > 0 && kept[kept.length - 1].trim() === '') kept.pop()

  if (kept.length === 0) {
    return content.slice(fmMatch[0].length).replace(/^\n+/, '')
  }

  return `---\n${kept.join('\n')}\n---` + content.slice(fmMatch[0].length)
}

function fixJsxProps(content) {
  content = content.replace(/<CardGroup\s+cols=\{(\d+)\}/g, '<CardGroup :cols="$1"')
  content = content.replace(/defaultOpen(?=[\s>])/g, ':default-open="true"')
  return content
}

function fixMiscSyntax(content) {
  content = content.replace(/<br \/>/g, '<br/>')
  content = content.replace(/<br>/g, '<br/>')
  content = content.replace(/<hr>/g, '<hr/>')
  content = content.replace(/<img ([^>]*[^/])>/g, '<img $1 />')
  return content
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function convertLegacyHtmlCodeBlocks(content) {
  return content.replace(
    /<pre><code class="language-([a-z0-9_+\-]+)">([\s\S]*?)<\/code><\/pre>/gi,
    (_, lang, raw) => {
      const body = decodeHtmlEntities(raw).replace(/^\n+|\n+$/g, '')
      return `\n\n\`\`\`${lang}\n${body}\n\`\`\`\n\n`
    },
  )
}

function convertMintDetailsHtmlBlocks(content) {
  return content.replace(
    /<details class="mint-accordion"(\s+open)?\s*>\s*\n<summary>([\s\S]*?)<\/summary>\s*\n([\s\S]*?)\n<\/details>/g,
    (_, openAttr, rawTitle, rawBody) => {
      const title = decodeHtmlEntities(String(rawTitle).trim()) || 'Details'
      const body = String(rawBody).replace(/^\n+|\n+$/g, '')
      const openNote = openAttr ? '\n<!-- defaultOpen=true -->\n' : ''
      return `\n::: details ${title}\n${body}\n:::${openNote}\n`
    },
  )
}

const COMPONENTS = new Set([
  'Accordion',
  'AccordionGroup',
  'Tabs',
  'Tab',
  'Steps',
  'Step',
  'Note',
  'Warning',
  'Tip',
  'Info',
  'Frame',
  'CardGroup',
  'Card',
  'Columns',
])

function parseAttrs(raw) {
  const attrs = {}
  if (!raw) return attrs

  const attrRe = /([:@A-Za-z0-9_-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|\{([^}]*)\}|([^\s"'>]+)))?/g
  let match = attrRe.exec(raw)
  while (match) {
    const key = match[1]
    const value = match[3] ?? match[4] ?? match[5] ?? match[6] ?? 'true'
    attrs[key] = value
    match = attrRe.exec(raw)
  }

  return attrs
}

function titleFromAttrs(attrs) {
  return (attrs.title || attrs[':title'] || '').trim()
}

function boolFromAttrs(attrs, keys) {
  for (const key of keys) {
    const value = attrs[key]
    if (!value) continue
    const normalized = String(value).trim().toLowerCase()
    if (normalized === 'true' || normalized === '1') return true
  }
  return false
}

function normalizeBlock(body) {
  return body.replace(/^\n+/, '').replace(/\n+$/, '')
}

function normalizeInline(body) {
  return body
    .replace(/\n{2,}/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function toCallout(kind, body) {
  const content = normalizeBlock(body)
  if (!content) return ''
  return `\n::: ${kind}\n${content}\n:::\n`
}

function toDetailsContainer(title, body, open = false) {
  const content = normalizeBlock(body)
  const summary = title || 'Details'
  const openNote = open ? '\n<!-- defaultOpen=true -->\n' : ''
  return `\n::: details ${escapeHtml(summary)}\n${content}\n:::${openNote}\n`
}

function toCard(attrs, body) {
  const title = (attrs.title || '').trim()
  const href = (attrs.href || '').trim()
  const description = normalizeInline(body)

  const head = href
    ? `- [**${title || 'Link'}**](${href})`
    : `- **${title || 'Item'}**`

  if (!description) return `${head}`
  return `${head} - ${description}`
}

function transformComponent(name, attrs, rawBody, state) {
  const body = rawBody ?? ''

  if (name === 'Note') return toCallout('info', body)
  if (name === 'Info') return toCallout('info', body)
  if (name === 'Tip') return toCallout('tip', body)
  if (name === 'Warning') return toCallout('warning', body)

  if (name === 'AccordionGroup') {
    const content = normalizeBlock(body)
    return content ? `\n${content}\n` : ''
  }

  if (name === 'Accordion') {
    const title = titleFromAttrs(attrs)
    const open = boolFromAttrs(attrs, ['defaultOpen', ':default-open', 'default-open'])
    return toDetailsContainer(title, body, open)
  }

  if (name === 'Tabs') {
    const content = normalizeBlock(body)
    return content ? `\n${content}\n` : ''
  }

  if (name === 'Tab') {
    if (state.tabStack.length > 0) {
      const top = state.tabStack.length - 1
      state.tabStack[top] += 1
    }

    const idx = state.tabStack.length > 0 ? state.tabStack[state.tabStack.length - 1] : 1
    const title = titleFromAttrs(attrs) || `Tab ${idx}`
    const content = normalizeBlock(body)
    const divider = idx > 1 ? '\n---\n\n' : '\n'
    return `${divider}#### ${title}\n\n${content}\n`
  }

  if (name === 'Steps') {
    const content = normalizeBlock(body)
    return content ? `\n${content}\n` : ''
  }

  if (name === 'Step') {
    if (state.stepStack.length > 0) {
      const top = state.stepStack.length - 1
      state.stepStack[top] += 1
    }

    const idx = state.stepStack.length > 0 ? state.stepStack[state.stepStack.length - 1] : 1
    const title = titleFromAttrs(attrs) || `Step ${idx}`
    const content = normalizeBlock(body)
    return `\n**Step ${idx}: ${title}**\n\n${content}\n`
  }

  if (name === 'CardGroup' || name === 'Columns') {
    const content = normalizeBlock(body)
    return content ? `\n${content}\n` : ''
  }

  if (name === 'Card') {
    return `${toCard(attrs, body)}\n`
  }

  if (name === 'Frame') {
    const content = normalizeBlock(body)
    const caption = (attrs.caption || '').trim()
    if (!caption) return `\n${content}\n`
    return `\n${content}\n\n_${caption}_\n`
  }

  return body
}

function parseComponentTree(content) {
  const lines = content.match(/.*(?:\n|$)/g) || []
  const state = { stepStack: [], tabStack: [] }
  const stack = [{ name: '__root__', attrs: {}, chunks: [] }]

  let inFence = false
  let fenceChar = null
  let fenceLength = 0

  function append(value) {
    stack[stack.length - 1].chunks.push(value)
  }

  function openNode(name, attrs) {
    if (name === 'Steps') state.stepStack.push(0)
    if (name === 'Tabs') state.tabStack.push(0)
    stack.push({ name, attrs, chunks: [] })
  }

  function closeNode(name) {
    if (stack.length === 1) return false
    if (stack[stack.length - 1].name !== name) return false

    const node = stack.pop()
    const rendered = transformComponent(name, node.attrs, node.chunks.join(''), state)
    append(rendered)

    if (name === 'Steps') state.stepStack.pop()
    if (name === 'Tabs') state.tabStack.pop()
    return true
  }

  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/)

    if (!inFence && fence) {
      inFence = true
      fenceChar = fence[1][0]
      fenceLength = fence[1].length
      append(line)
      continue
    }

    if (inFence) {
      append(line)
      const closeFence = line.match(/^\s*(`{3,}|~{3,})\s*$/)
      if (closeFence && closeFence[1][0] === fenceChar && closeFence[1].length >= fenceLength) {
        inFence = false
        fenceChar = null
        fenceLength = 0
      }
      continue
    }

    const inline = line.match(/^\s*<([A-Za-z][A-Za-z0-9]*)\b([^>]*)>([\s\S]*?)<\/\1>\s*$/)
    if (inline && COMPONENTS.has(inline[1])) {
      const attrs = parseAttrs(inline[2] || '')
      const body = inline[3] || ''
      append(transformComponent(inline[1], attrs, body, state))
      continue
    }

    const selfClosing = line.match(/^\s*<([A-Za-z][A-Za-z0-9]*)\b([^>]*)\/\s*>\s*$/)
    if (selfClosing && COMPONENTS.has(selfClosing[1])) {
      append(transformComponent(selfClosing[1], parseAttrs(selfClosing[2] || ''), '', state))
      continue
    }

    const opening = line.match(/^\s*<([A-Za-z][A-Za-z0-9]*)\b([^>]*)>\s*$/)
    if (opening && COMPONENTS.has(opening[1])) {
      openNode(opening[1], parseAttrs(opening[2] || ''))
      continue
    }

    const closing = line.match(/^\s*<\/([A-Za-z][A-Za-z0-9]*)>\s*$/)
    if (closing && COMPONENTS.has(closing[1])) {
      if (!closeNode(closing[1])) {
        append('')
      }
      continue
    }

    append(line)
  }

  while (stack.length > 1) {
    const node = stack.pop()
    append(`<${node.name}>${node.chunks.join('')}`)
  }

  return stack[0].chunks.join('')
}

function compressBlankLines(content) {
  return content
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/^\n+/, '')
}

function convertMintComponents(content) {
  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n?/)
  const frontmatter = fmMatch?.[0] || ''
  const body = frontmatter ? content.slice(frontmatter.length) : content

  return frontmatter + compressBlankLines(parseComponentTree(body))
}

const restored = restoreNodeDoc()
const files = getAllMdFiles(DOCS_DIR)
let fixed = 0

for (const file of files) {
  const original = readFileSync(file, 'utf-8')
  let content = original

  content = fixFrontmatter(content)
  content = fixJsxProps(content)
  content = fixMiscSyntax(content)
  content = convertLegacyHtmlCodeBlocks(content)
  content = convertMintDetailsHtmlBlocks(content)
  content = convertMintComponents(content)

  if (content !== original) {
    writeFileSync(file, content)
    fixed++
  }
}

console.log(`Processed ${files.length} files, fixed ${fixed}, restoredNodeDoc=${restored}`)
