<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  headline?: string
  tip?: string
}>()

const tooltipText = computed(() => {
  if (props.headline && props.tip) {
    return `${props.headline}: ${props.tip}`
  }
  return props.tip ?? props.headline ?? ''
})
</script>

<template>
  <span class="mint-tooltip" :title="tooltipText">
    <slot />
  </span>
</template>
