<template>
  <header
    class="w-full top-0 sticky z-40 bg-white flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-md lg:hidden rounded-b-[32px] border border-outline-variant shadow-lg">
    <div class="flex items-center gap-3">
      <button @click="menuOpen = true"
        class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#2E7D32] text-white shadow-md hover:bg-[#2E7D32]/90 transition-colors duration-200">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="font-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-text-main">{{ title }}</h1>
    </div>
    <button
      class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:opacity-80 transition-opacity duration-200">
      <span class="material-symbols-outlined">notifications</span>
    </button>

    <Teleport to="body">
      <div v-if="menuOpen" class="fixed inset-0 z-[200]">
        <div class="absolute inset-0 bg-black/40" @click="menuOpen = false"></div>
        <div class="absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl flex flex-col"
          :style="{ transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease' }">
          <div class="flex items-center justify-between p-5 border-b border-outline-variant">
            <h2 class="font-headline-sm text-text-main">Menu</h2>
            <button @click="menuOpen = false"
              class="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <button v-for="item in extraMenus" :key="item.id"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              :class="activeTab === item.id
                ? 'bg-[#2E7D32] text-white shadow-lg shadow-green-900/20'
                : 'text-on-surface-variant hover:bg-gray-50'"
              @click="$emit('switch', item.id); menuOpen = false">
              <span class="material-symbols-outlined text-xl" :style="iconStyle(item.id)">{{ item.icon }}</span>
              <span class="font-label-lg">{{ item.label }}</span>
            </button>
          </nav>
          <div class="p-4 mx-3 mb-4 bg-success-soft rounded-2xl border border-primary-container">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-xl">lightbulb</span>
              <div>
                <p class="text-xs font-bold text-primary">Tips Hari Ini</p>
                <p class="text-xs text-on-surface-variant leading-snug mt-0.5">Fokus pada satu hal kecil untuk dampak besar.</p>
              </div>
            </div>
          </div>
          <div class="border-t border-outline-variant">
            <div class="flex items-center gap-3 px-6 py-4">
              <span class="material-symbols-outlined text-on-surface-variant text-xl">notifications</span>
              <span class="font-label-lg text-on-surface-variant">Notifikasi</span>
              <span class="ml-auto w-5 h-5 rounded-full bg-error text-on-error text-xs font-bold flex items-center justify-center">3</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Halo Bunda 👋' },
  tabs: { type: Array, default: () => [] },
  activeTab: { type: String, default: '' },
  userName: { type: String, default: 'Bunda' }
})

defineEmits(['switch'])

const menuOpen = ref(false)

const extraMenus = computed(() => {
  const footerIds = ['pilar', 'progress', 'tools']
  return props.tabs.filter(t => !footerIds.includes(t.id))
})

function iconStyle(tabId) {
  return { fontVariationSettings: props.activeTab === tabId ? "'FILL' 1" : "'FILL' 0" }
}
</script>
