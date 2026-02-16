<script setup lang="ts">
withDefaults(
  defineProps<{
    cols?: number
  }>(),
  {
    cols: 2,
  },
)
</script>

<template>
  <div class="card-group" :data-cols="cols">
    <slot />
  </div>
</template>
