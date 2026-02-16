<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    defaultOpen?: boolean
  }>(),
  {
    defaultOpen: false,
  },
)
</script>

<template>
  <details class="mint-accordion" :open="defaultOpen || undefined">
    <summary>{{ title }}</summary>
    <div class="accordion-content">
      <slot />
    </div>
  </details>
</template>
