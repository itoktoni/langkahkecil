import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const activeTab = ref('pilar')
  const selectedPilar = ref(null)
  const selectedAnakId = ref(null)
  const userName = ref('Parent')
  const toolsAnakId = ref(null)
  const appReady = ref(false)
  const installDismissed = ref(false)

  const pageTitle = computed(() => {
    const titles = {
      pilar: `Halo ${userName.value}!`,
      progress: 'Statistik',
      activity: 'Aktivitas',
      profile: 'Profile',
      challenge: 'Challenge',
      jadwal: 'Jadwal Harian',
      checklist: 'Checklist Harian'
    }
    return titles[activeTab.value] || `Halo ${userName.value}!`
  })

  const switchCounter = ref(0)

  function switchTab(tabId) {
    if (activeTab.value !== tabId) history.pushState({ action: 'tab', from: activeTab.value }, '')
    activeTab.value = tabId
    selectedPilar.value = null
    switchCounter.value++
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
    appReady, installDismissed, pageTitle, switchCounter,
    switchTab, openPilarSub, closePilarSub
  }
})
