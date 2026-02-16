<script setup lang="ts">
defineProps<{
  caption?: string
}>()
</script>

<template>
  <div class="mint-frame">
    <slot />
    <div v-if="caption" class="mint-frame-caption">{{ caption }}</div>
  </div>
</template>
