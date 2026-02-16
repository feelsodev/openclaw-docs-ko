import fs from 'node:fs'
import path from 'node:path'

const TARGET_DOCS_ROOT = path.resolve('docs')
const SOURCE_DOCS_ROOT = '/Users/once/Documents/feelso/openclaw-docs/openclaw/docs/ko-KR'

const MINTLIFY_COMPONENT_REGEX = /<(Card|CardGroup|Columns|Tabs|Tab|Steps|Step|Accordion|AccordionGroup|Frame|Tooltip|Check|Note|Warning|Tip|Info)\b/

function getMarkdownFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === '.vitepress') {
        continue
      }
      files.push(...getMarkdownFiles(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

function splitFrontmatter(content) {
  const newline = content.includes('\r\n') ? '\r\n' : '\n'
  const lines = content.split(newline)

  if (lines[0] !== '---') {
    return { frontmatter: null, body: content, newline }
  }

  let endIndex = -1
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === '---') {
      endIndex = i
      break
    }
  }

  if (endIndex === -1) {
    return { frontmatter: null, body: content, newline }
  }

  return {
    frontmatter: lines.slice(1, endIndex),
    body: lines.slice(endIndex + 1).join(newline),
    newline,
  }
}

function keepTitleOnlyFrontmatter(content) {
  const { frontmatter, body, newline } = splitFrontmatter(content)
  if (!frontmatter) {
    return content
  }

  const titleLine = frontmatter.find((line) => /^title:\s*/.test(line))
  if (!titleLine) {
    return body
  }

  return ['---', titleLine, '---', body].join(newline)
}

function stripTooltips(content) {
  // Convert <Tooltip ...>text</Tooltip> to just text (tooltips don't work well inline in VitePress)
  return content.replace(/<Tooltip[^>]*>([\s\S]*?)<\/Tooltip>/g, '$1')
}

function renameComponents(content) {
  return content
    .replace(/<Tooltip(\s|>)/g, '<MintTooltip$1')
    .replace(/<\/Tooltip>/g, '</MintTooltip>')
    .replace(/<Check(\s|>)/g, '<MintCheck$1')
    .replace(/<\/Check>/g, '</MintCheck>')
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function readAttribute(attrs, name) {
  const quoted = attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))
  if (quoted) {
    return quoted[1]
  }

  const singleQuoted = attrs.match(new RegExp(`${name}\\s*=\\s*'([^']*)'`))
  if (singleQuoted) {
    return singleQuoted[1]
  }

  return null
}

function hasTrueAttribute(attrs, name) {
  if (new RegExp(`(^|\\s)${name}(?=(\\s|$))`).test(attrs)) {
    return true
  }

  const bound = readAttribute(attrs, `:${name}`)
  if (!bound) {
    return false
  }

  return bound === 'true' || bound === '1'
}

function normalizeInnerContent(content) {
  const trimmed = content
    .replace(/^\s*\n/, '')
    .replace(/\n\s*$/, '')

  const lines = trimmed.split('\n')
  let minIndent = null

  for (const line of lines) {
    if (!line.trim()) {
      continue
    }

    const indent = line.match(/^[ \t]*/)?.[0].length ?? 0
    if (minIndent === null || indent < minIndent) {
      minIndent = indent
    }
  }

  if (!minIndent) {
    return trimmed
  }

  return lines
    .map((line) => {
      if (!line.trim()) {
        return ''
      }

      const indent = line.match(/^[ \t]*/)?.[0].length ?? 0
      const removeCount = Math.min(indent, minIndent)
      return line.slice(removeCount)
    })
    .join('\n')
}

function convertTabsAndSteps(content) {
  const convertStepsBlock = (source) => {
    let result = source
    const stepsPattern = /<Steps\b[^>]*>((?:(?!<Steps\b|<\/Steps>).|[\r\n])*)<\/Steps>/g

    while (stepsPattern.test(result)) {
      result = result.replace(stepsPattern, (_match, body) => {
        const steps = []
        const stepPattern = /<Step\b([^>]*)>((?:(?!<Step\b|<\/Step>).|[\r\n])*)<\/Step>/g

        for (const stepMatch of body.matchAll(stepPattern)) {
          const attrs = stepMatch[1] ?? ''
          const title = readAttribute(attrs, 'title')
          const inner = normalizeInnerContent(stepMatch[2] ?? '')
          const header = title ? `:::step{title="${escapeHtml(title)}"}` : ':::step'
          steps.push(`${header}\n${inner}\n:::`)
        }

        if (steps.length === 0) {
          return ':::steps\n:::'
        }

        return `:::steps\n${steps.join('\n')}\n:::`
      })
    }

    return result
  }

  let withSteps = convertStepsBlock(content)
  const tabsPattern = /<Tabs\b[^>]*>((?:(?!<Tabs\b|<\/Tabs>).|[\r\n])*)<\/Tabs>/g

  while (tabsPattern.test(withSteps)) {
    withSteps = withSteps.replace(tabsPattern, (_match, body) => {
      const steps = []
      const tabPattern = /<Tab\b([^>]*)>((?:(?!<Tab\b|<\/Tab>).|[\r\n])*)<\/Tab>/g

      for (const tabMatch of body.matchAll(tabPattern)) {
        const attrs = tabMatch[1] ?? ''
        const title = readAttribute(attrs, 'title') ?? ''
        const inner = normalizeInnerContent(tabMatch[2] ?? '')
        steps.push(`:::tab{title="${escapeHtml(title)}"}\n${inner}\n:::`)
      }

      if (steps.length === 0) {
        return ':::tabs\n:::'
      }

      return `:::tabs\n${steps.join('\n')}\n:::`
    })
  }

  return withSteps
}

function convertAccordions(content) {
  let output = content
    .replace(/<AccordionGroup\b[^>]*>/g, ':::accordion-group')
    .replace(/<\/AccordionGroup>/g, ':::')

  const accordionPattern = /<Accordion\b([^>]*)>((?:(?!<Accordion\b|<\/Accordion>).|[\r\n])*)<\/Accordion>/g

  while (accordionPattern.test(output)) {
    output = output.replace(accordionPattern, (_match, attrs = '', body = '') => {
      const title = readAttribute(attrs, 'title') ?? ''
      const defaultOpen = hasTrueAttribute(attrs, 'default-open') || hasTrueAttribute(attrs, 'defaultOpen')
      const inner = normalizeInnerContent(body)

      const header = defaultOpen
        ? `:::accordion{title="${escapeHtml(title)}" defaultOpen="true"}`
        : `:::accordion{title="${escapeHtml(title)}"}`

      return `${header}\n${inner}\n:::`
    })
  }

  return output
}

function isMintContainerOpen(line) {
  return /^\s*:::(tabs|tab\{.*\}|steps|step(?:\{.*\})?|accordion(?:\{.*\})?|accordion-group)\s*$/.test(line)
}

function isFenceLine(line) {
  const marker = line.match(/^\s*(`{3,}|~{3,})/)
  return marker ? marker[1] : null
}

function escapeCodeLineInContainer(line) {
  return line
    .replaceAll('&lt;', '\uE001LT\uE002')
    .replaceAll('&gt;', '\uE001GT\uE002')
    .replaceAll('&amp;', '\uE001AMP\uE002')
    .replaceAll('&#123;', '\uE001LB\uE002')
    .replaceAll('&#125;', '\uE001RB\uE002')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('{{', '&#123;&#123;')
    .replaceAll('}}', '&#125;&#125;')
    .replaceAll('\uE001LT\uE002', '&lt;')
    .replaceAll('\uE001GT\uE002', '&gt;')
    .replaceAll('\uE001AMP\uE002', '&amp;')
    .replaceAll('\uE001LB\uE002', '&#123;')
    .replaceAll('\uE001RB\uE002', '&#125;')
}

function escapeTemplateSequencesInNestedFences(content) {
  const newline = content.includes('\r\n') ? '\r\n' : '\n'
  const lines = content.split(newline)
  const output = []
  const containerStack = []
  let inFence = false
  let fenceChar = ''
  let fenceLength = 0

  for (const line of lines) {
    if (!inFence && isMintContainerOpen(line)) {
      containerStack.push('container')
      output.push(line)
      continue
    }

    if (!inFence && containerStack.length > 0 && /^\s*:::\s*$/.test(line)) {
      containerStack.pop()
      output.push(line)
      continue
    }

    const fenceMarker = isFenceLine(line)
    if (!inFence) {
      if (fenceMarker) {
        inFence = true
        fenceChar = fenceMarker[0]
        fenceLength = fenceMarker.length
      }

      output.push(line)
      continue
    }

    const fenceClose = line.match(/^\s*(`{3,}|~{3,})\s*$/)
    if (fenceClose && fenceClose[1][0] === fenceChar && fenceClose[1].length >= fenceLength) {
      inFence = false
      fenceChar = ''
      fenceLength = 0
      output.push(line)
      continue
    }

    if (containerStack.length > 0) {
      output.push(escapeCodeLineInContainer(line))
      continue
    }

    output.push(line)
  }

  return output.join(newline)
}

function escapeVueMustache(content) {
  return content
    .replaceAll('{{', '&#123;&#123;')
    .replaceAll('}}', '&#125;&#125;')
}

function convertCallouts(content) {
  return content
    .replace(/<Note>([\s\S]*?)<\/Note>/g, '::: info\n$1\n:::')
    .replace(/<Warning>([\s\S]*?)<\/Warning>/g, '::: warning\n$1\n:::')
    .replace(/<Tip>([\s\S]*?)<\/Tip>/g, '::: tip\n$1\n:::')
    .replace(/<Info>([\s\S]*?)<\/Info>/g, '::: info\n$1\n:::')
}

function convertJsxProps(attrs) {
  let output = attrs
  output = output.replace(/(^|\s)className=/g, '$1class=')
  output = output.replace(/(^|\s)defaultOpen(?=(\s|\/|$))/g, '$1:default-open="true"')

  output = output.replace(/(\s)([A-Za-z][\w:-]*)=\{([^{}]+)\}/g, (_match, space, attrName, expression) => {
    const vueName = attrName === 'defaultOpen' ? 'default-open' : attrName
    const escaped = expression.trim().replaceAll('"', '&quot;')
    return `${space}:${vueName}="${escaped}"`
  })

  return output
}

function toKebabCase(value) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

function convertStyleObjectToInlineCss(styleObject) {
  const declarations = []
  const entryRegex = /([A-Za-z][A-Za-z0-9]*)\s*:\s*("[^"]*"|'[^']*'|[^,\n]+)\s*,?/g

  for (const match of styleObject.matchAll(entryRegex)) {
    const prop = toKebabCase(match[1])
    const rawValue = match[2].trim().replace(/^['"]|['"]$/g, '')
    declarations.push(`${prop}: ${rawValue}`)
  }

  return declarations.join('; ')
}

function convertJsxStyleObjects(content) {
  return content.replace(/style=\{\{([\s\S]*?)\}\}/g, (_match, styleBody) => {
    const inlineStyle = convertStyleObjectToInlineCss(styleBody)
    return `style=\"${inlineStyle}\"`
  })
}

function convertTagProps(content) {
  return content.replace(/<([A-Za-z][\w:-]*)([^<>]*?)(\/)?>/g, (_match, tagName, attrs, selfClosing) => {
    const nextAttrs = convertJsxProps(attrs)
    return `<${tagName}${nextAttrs}${selfClosing ?? ''}>`
  })
}

function fixAssetPaths(content) {
  return content
    .replace(/(!\[[^\]]*\]\()\/assets\//g, '$1https://docs.openclaw.ai/assets/')
    .replace(/(<img[^>]*\ssrc=["'])\/assets\//g, '$1https://docs.openclaw.ai/assets/')
    .replace(/(<img[^>]*\ssrc=["'])(?!https?:\/\/|\/)([^"']+)(["'][^>]*>)/g, '$1https://docs.openclaw.ai/assets/$2$3')
}

function transformFile(sourceContent) {
  let output = sourceContent
  output = keepTitleOnlyFrontmatter(output)
  output = stripTooltips(output)
  output = convertCallouts(output)
  output = convertJsxStyleObjects(output)
  output = convertTagProps(output)
  output = convertTabsAndSteps(output)
  output = convertAccordions(output)
  output = renameComponents(output)
  output = fixAssetPaths(output)
  output = escapeTemplateSequencesInNestedFences(output)
  output = escapeVueMustache(output)
  return output
}

function main() {
  const targetFiles = getMarkdownFiles(TARGET_DOCS_ROOT)
  let restoredCount = 0
  let skippedCount = 0

  for (const targetFilePath of targetFiles) {
    const relativePath = path.relative(TARGET_DOCS_ROOT, targetFilePath)
    const sourceFilePath = path.join(SOURCE_DOCS_ROOT, relativePath)

    if (!fs.existsSync(sourceFilePath)) {
      skippedCount += 1
      continue
    }

    const sourceContent = fs.readFileSync(sourceFilePath, 'utf8')
    if (!MINTLIFY_COMPONENT_REGEX.test(sourceContent)) {
      skippedCount += 1
      continue
    }

    const transformed = transformFile(sourceContent)
    fs.writeFileSync(targetFilePath, transformed, 'utf8')
    restoredCount += 1
  }

  console.log(`[restore-components] scanned=${targetFiles.length} restored=${restoredCount} skipped=${skippedCount}`)
}

main()
