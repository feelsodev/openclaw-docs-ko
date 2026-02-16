<script setup lang="ts">
import { computed, provide, ref } from 'vue'

type TabsContext = {
  activeIndex: { value: number }
  registerTab: (title: string) => number
}

const tabTitles = ref<string[]>([])
const activeIndex = ref(0)

function registerTab(title: string): number {
  const index = tabTitles.value.length
  tabTitles.value.push(title)
  return index
}

provide<TabsContext>('mint-tabs-context', {
  activeIndex,
  registerTab,
})

const hasTabs = computed(() => tabTitles.value.length > 0)
</script>

<template>
  <ClientOnly>
    <div class="mint-tabs">
      <div v-if="hasTabs" class="mint-tabs-header" role="tablist" aria-label="Tabs">
        <button
          v-for="(title, index) in tabTitles"
          :key="`${title}-${index}`"
          class="mint-tab-btn"
          :class="{ active: index === activeIndex }"
          role="tab"
          type="button"
          :aria-selected="index === activeIndex"
          @click="activeIndex = index"
        >
          {{ title }}
        </button>
      </div>

      <div class="mint-tab-content">
        <slot />
      </div>
    </div>
  </ClientOnly>
</template>
