declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it-container' {
  import type MarkdownIt from 'markdown-it'

  type ContainerRender = (
    tokens: Array<{ info: string; nesting: number }>,
    idx: number,
  ) => string

  export default function container(
    md: MarkdownIt,
    name: string,
    options?: {
      render?: ContainerRender
      validate?: (params: string) => boolean
      marker?: string
    },
  ): void
}
