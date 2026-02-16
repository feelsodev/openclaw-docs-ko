<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  title?: string
}>()

const stepsContext = inject<{ registerStep: () => number }>('mint-steps-context')
const stepNumber = stepsContext ? stepsContext.registerStep() : 1
</script>

<template>
  <div class="mint-step">
    <div class="mint-step-indicator" aria-hidden="true">{{ stepNumber }}</div>
    <div class="mint-step-content">
      <div v-if="props.title" class="mint-step-title">{{ props.title }}</div>
      <div class="mint-step-body">
        <slot />
      </div>
    </div>
  </div>
</template>
