import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import container from 'markdown-it-container'

type TabsBounds = {
  openIndex: number
  closeIndex: number
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

// VitePress strips {key="value"} from token.info and puts them in token.attrs
function getTitle(token: Token): string {
  return token.attrGet('title') ?? ''
}

function getBoolAttr(token: Token, key: string): boolean {
  const value = token.attrGet(key)
  return value === 'true' || value === '1' || value === ''
}

function findContainerClose(tokens: Token[], openIndex: number): number {
  let depth = 0

  for (let i = openIndex; i < tokens.length; i += 1) {
    const token = tokens[i]

    if (token.type === tokens[openIndex].type) {
      depth += 1
      continue
    }

    if (token.type === tokens[openIndex].type.replace('_open', '_close')) {
      depth -= 1
      if (depth === 0) {
        return i
      }
    }
  }

  return openIndex
}

function findTabsBounds(tokens: Token[], idx: number): TabsBounds | null {
  const tabLevel = tokens[idx].level
  let openIndex = -1

  for (let i = idx - 1; i >= 0; i -= 1) {
    if (tokens[i].type === 'container_tabs_open' && tokens[i].level === tabLevel - 1) {
      openIndex = i
      break
    }
  }

  if (openIndex === -1) {
    return null
  }

  const closeIndex = findContainerClose(tokens, openIndex)
  return { openIndex, closeIndex }
}

function countSiblingOpens(tokens: Token[], bounds: TabsBounds, idx: number, type: string): number {
  let count = 0

  for (let i = bounds.openIndex + 1; i < idx; i += 1) {
    if (tokens[i].type === type && tokens[i].level === tokens[idx].level) {
      count += 1
    }
  }

  return count
}

function collectTabTitles(tokens: Token[], bounds: TabsBounds): string[] {
  const titles: string[] = []

  for (let i = bounds.openIndex + 1; i < bounds.closeIndex; i += 1) {
    const token = tokens[i]
    if (token.type !== 'container_tab_open') {
      continue
    }

    titles.push(getTitle(token))
  }

  return titles
}

export function installMintContainers(md: MarkdownIt): void {
  md.use(container, 'tabs', {
    validate: (params: string) => params.trim() === 'tabs',
    render(tokens: Token[], idx: number): string {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const bounds = {
          openIndex: idx,
          closeIndex: findContainerClose(tokens, idx),
        }
        const titles = collectTabTitles(tokens, bounds)
        const buttons = titles
          .map((title, index) => {
            const activeClass = index === 0 ? ' active' : ''
            const selected = index === 0 ? 'true' : 'false'
            return `<button class="mint-tab-btn${activeClass}" type="button" role="tab" aria-selected="${selected}" data-tab="${index}">${escapeHtml(title)}</button>`
          })
          .join('')

        return `<div class="mint-tabs" data-mint-tabs><div class="mint-tabs-header" role="tablist">${buttons}</div><div class="mint-tab-content">`
      }

      return '</div></div>'
    },
  })

  md.use(container, 'tab', {
    validate: (params: string) => /^tab(\s|\{|$)/.test(params.trim()),
    render(tokens: Token[], idx: number): string {
      const token = tokens[idx]
      const bounds = findTabsBounds(tokens, idx)
      const tabIndex = bounds ? countSiblingOpens(tokens, bounds, idx, 'container_tab_open') : 0
      const activeClass = tabIndex === 0 ? ' active' : ''

      if (token.nesting === 1) {
        return `<div class="mint-tab-panel${activeClass}" role="tabpanel" data-tab="${tabIndex}">`
      }

      return '</div>'
    },
  })

  md.use(container, 'steps', {
    validate: (params: string) => params.trim() === 'steps',
    render(tokens: Token[], idx: number): string {
      return tokens[idx].nesting === 1 ? '<div class="mint-steps">' : '</div>'
    },
  })

  md.use(container, 'step', {
    validate: (params: string) => /^step(\s|\{|$)/.test(params.trim()),
    render(tokens: Token[], idx: number): string {
      const token = tokens[idx]

      if (token.nesting === 1) {
        let stepsOpenIndex = -1
        for (let i = idx - 1; i >= 0; i -= 1) {
          if (tokens[i].type === 'container_steps_open' && tokens[i].level === token.level - 1) {
            stepsOpenIndex = i
            break
          }
        }

        const stepIndex =
          stepsOpenIndex >= 0
            ? countSiblingOpens(tokens, { openIndex: stepsOpenIndex, closeIndex: findContainerClose(tokens, stepsOpenIndex) }, idx, 'container_step_open') + 1
            : 1

        const title = getTitle(token)
        const titleHtml = title.length > 0 ? `<div class="mint-step-title">${escapeHtml(title)}</div>` : ''

        return `<div class="mint-step"><div class="mint-step-indicator" aria-hidden="true">${stepIndex}</div><div class="mint-step-content">${titleHtml}<div class="mint-step-body">`
      }

      return '</div></div></div>'
    },
  })

  md.use(container, 'accordion-group', {
    validate: (params: string) => params.trim() === 'accordion-group',
    render(tokens: Token[], idx: number): string {
      return tokens[idx].nesting === 1 ? '<div class="accordion-group">' : '</div>'
    },
  })

  md.use(container, 'accordion', {
    validate: (params: string) => /^accordion(\s|\{|$)/.test(params.trim()),
    render(tokens: Token[], idx: number): string {
      if (tokens[idx].nesting === 1) {
        const title = getTitle(tokens[idx])
        const defaultOpen = getBoolAttr(tokens[idx], 'defaultOpen') || getBoolAttr(tokens[idx], 'default-open')
        const openAttr = defaultOpen ? ' open' : ''
        return `<details class="mint-accordion"${openAttr}><summary>${escapeHtml(title)}</summary><div class="accordion-content">`
      }

      return '</div></details>'
    },
  })
}
