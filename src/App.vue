<template>
  <div class="bg-canvas-cream text-text-main min-h-screen">
    <AppSidebar :tabs="tabs" :active-tab="activeTab" @switch="switchTab" />
    <AppHeader :title="pageTitle" />

    <main class="content-wrapper pb-24 lg:pb-8">
      <PilarTab v-show="activeTab === 'pilar'" :selected-pilar="selectedPilar" @select-pilar="openPilarSub" @close-pilar="closePilarSub" />
      <ProgressTab v-show="activeTab === 'progress'" />
      <ToolsTab v-show="activeTab === 'tools'" />
      <PoinTab v-show="activeTab === 'poin'" />
    </main>

    <BottomNav :tabs="tabs" :active-tab="activeTab" @switch="switchTab" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { tabs } from './data/pilars.js'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import BottomNav from './components/BottomNav.vue'
import PilarTab from './components/PilarTab.vue'
import ProgressTab from './components/ProgressTab.vue'
import ToolsTab from './components/ToolsTab.vue'
import PoinTab from './components/PoinTab.vue'

const activeTab = ref('pilar')
const selectedPilar = ref(null)

const pageTitle = computed(() => {
  const titles = { pilar: 'Home', progress: 'Statistik', tools: 'Buku Alat', poin: 'Point' }
  return titles[activeTab.value] || 'Home'
})

function switchTab(tabId) {
  activeTab.value = tabId
  selectedPilar.value = null
  window.scrollTo(0, 0)
}

function openPilarSub(key) {
  selectedPilar.value = key
  window.scrollTo(0, 0)
}

function closePilarSub() {
  selectedPilar.value = null
}
</script>
