import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'
import './tabs-steps.css'
import { onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import { initializeMintTabs } from './tabs-client'

import Card from './components/Card.vue'
import CardGroup from './components/CardGroup.vue'
import Columns from './components/Columns.vue'
import Frame from './components/Frame.vue'
import MintTooltip from './components/MintTooltip.vue'
import MintCheck from './components/MintCheck.vue'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    const mountTabs = () => {
      nextTick(() => {
        initializeMintTabs()
      })
    }

    onMounted(mountTabs)
    watch(() => route.path, mountTabs)
  },
  enhanceApp({ app }) {
    app.component('Card', Card)
    app.component('CardGroup', CardGroup)
    app.component('Columns', Columns)
    app.component('Frame', Frame)
    app.component('MintTooltip', MintTooltip)
    app.component('MintCheck', MintCheck)
  },
} satisfies Theme
