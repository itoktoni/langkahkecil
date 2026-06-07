import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const activeTab = ref('pilar')
  const selectedPilar = ref(null)
  const selectedAnakId = ref(null)
  const userName = ref('Azizah')
  const toolsAnakId = ref(null)
  const appReady = ref(false)
  const installDismissed = ref(false)

  const pageTitle = computed(() => {
    const titles = {
      pilar: `Halo ${userName.value}!`,
      progress: 'Statistik',
      tools: 'Buku Alat',
      profile: 'Profile',
      challenge: 'Challenge',
      jadwal: 'Jadwal Harian',
      checklist: 'Checklist Harian'
    }
    return titles[activeTab.value] || `Halo ${userName.value}!`
  })

  function switchTab(tabId) {
    if (activeTab.value !== tabId) history.pushState({ action: 'tab', from: activeTab.value }, '')
    activeTab.value = tabId
    selectedPilar.value = null
    window.scrollTo(0, 0)
  }

  function openPilarSub(key) {
    selectedPilar.value = key
    history.pushState({ action: 'pilar' }, '')
    window.scrollTo(0, 0)
  }

  function closePilarSub() {
    selectedPilar.value = null
  }

  return {
    activeTab, selectedPilar, selectedAnakId, userName, toolsAnakId,
    appReady, installDismissed, pageTitle,
    switchTab, openPilarSub, closePilarSub
  }
})
