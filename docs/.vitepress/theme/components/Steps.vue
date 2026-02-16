<script setup lang="ts">
import { provide, ref } from 'vue'

const count = ref(0)

function registerStep(): number {
  count.value += 1
  return count.value
}

provide('mint-steps-context', {
  registerStep,
})
</script>

<template>
  <div class="mint-steps">
    <slot />
  </div>
</template>
