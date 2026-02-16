<script setup lang="ts">
import { computed, inject } from 'vue'

const props = defineProps<{
  title: string
}>()

type TabsContext = {
  activeIndex: { value: number }
  registerTab: (title: string) => number
}

const tabsContext = inject<TabsContext>('mint-tabs-context')
const tabIndex = tabsContext ? tabsContext.registerTab(props.title) : 0

const isActive = computed(() => {
  if (!tabsContext) {
    return true
  }
  return tabsContext.activeIndex.value === tabIndex
})
</script>

<template>
  <div v-show="isActive" role="tabpanel">
    <slot />
  </div>
</template>
