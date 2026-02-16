<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  icon?: string
  href?: string
}>()

const iconMap: Record<string, string> = {
  rocket: '🚀',
  sparkles: '✨',
  network: '🌐',
  link: '🔗',
  terminal: '💻',
  key: '🔑',
  code: '📝',
  bolt: '⚡',
  paintbrush: '🎨',
  puzzle: '🧩',
  users: '👥',
  lock: '🔒',
  zap: '⚡',
  star: '⭐',
  check: '✅',
  cloud: '☁️',
  database: '🗄️',
  server: '🖥️',
  cpu: '🔲',
  tools: '🛠️',
  download: '📥',
  upload: '📤',
  refresh: '🔄',
  search: '🔍',
  microphone: '🎙️',
  brain: '🧠',
  phone: '📞',
  plug: '🔌',
  route: '🧭',
  image: '🖼️',
  monitor: '🖥️',
  smartphone: '📱',
  'book-open': '📖',
  settings: '⚙️',
  globe: '🌍',
  'message-square': '💬',
  'life-buoy': '🛟',
  list: '📋',
  shield: '🛡️',
  wrench: '🔧',
  info: 'ℹ️',
}

const resolvedIcon = computed(() => {
  if (!props.icon) {
    return ''
  }
  return iconMap[props.icon] ?? props.icon
})
</script>

<template>
  <a v-if="href" class="mint-card" :href="href">
    <div v-if="title || resolvedIcon" class="card-title">
      <span v-if="resolvedIcon" class="card-icon" aria-hidden="true">{{ resolvedIcon }}</span>
      <span>{{ title }}</span>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </a>

  <div v-else class="mint-card">
    <div v-if="title || resolvedIcon" class="card-title">
      <span v-if="resolvedIcon" class="card-icon" aria-hidden="true">{{ resolvedIcon }}</span>
      <span>{{ title }}</span>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>
