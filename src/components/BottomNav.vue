<template>
  <nav class="mobile-nav fixed bottom-0 w-full z-50 rounded-t-[32px] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.04)] flex justify-around items-center h-20 px-2 pb-safe">
    <button v-for="tab in tabs" :key="tab.id"
      class="flex flex-col items-center justify-center rounded-2xl px-5 py-2 active:scale-95 transition-all duration-150"
      :class="activeTab === tab.id ? 'bg-success-soft text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'"
      @click="$emit('switch', tab.id)">
      <span class="material-symbols-outlined" :style="iconStyle(tab.id)">
        {{ tab.icon }}
      </span>
      <span class="font-label-sm text-label-sm mt-0.5">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  tabs: { type: Array, required: true },
  activeTab: { type: String, required: true }
})

defineEmits(['switch'])

function iconStyle(tabId) {
  return { fontVariationSettings: props.activeTab === tabId ? "'FILL' 1" : "'FILL' 0" }
}
</script>
