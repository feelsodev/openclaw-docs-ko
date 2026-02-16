import container from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function registerCallout(md: MarkdownIt, name: string, cls: string): void {
  md.use(container, name, {
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return `<div class="mint-callout ${cls}">\n`
      }
      return '</div>\n'
    },
  })
}

export function registerMarkdownContainers(md: MarkdownIt): void {
  registerCallout(md, 'note', 'note')
  registerCallout(md, 'warning', 'warning')
  registerCallout(md, 'tip', 'tip')
  registerCallout(md, 'info', 'info')

  md.use(container, 'accordion-group', {
    render(tokens: Token[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return '<div class="accordion-group">\n'
      }
      return '</div>\n'
    },
  })

  md.use(container, 'accordion', {
    render(tokens: Token[], idx: number) {
      const token = tokens[idx]
      const match = token.info.trim().match(/^accordion\s+(.*)$/)
      if (token.nesting === 1) {
        const title = escapeHtml((match?.[1] || 'Details').trim())
        return `<details class="mint-accordion">\n<summary>${title}</summary>\n<div class="accordion-content">\n`
      }
      return '</div>\n</details>\n'
    },
  })
}
