<template>
  <ReferralPage v-if="isReferral" />
  <div v-else class="bg-canvas-cream text-text-main min-h-screen">
    <AppSidebar :tabs="tabs" :active-tab="app.activeTab" :user-name="app.userName" :user-gender="app.userGender" @switch="app.switchTab" />
    <AppHeader :title="app.pageTitle" :tabs="tabs" :active-tab="app.activeTab" :user-name="app.userName" @switch="app.switchTab" />

    <main class="content-wrapper pb-24 lg:pb-8">
      <PilarTab ref="pilarTabRef" v-show="app.activeTab === 'pilar'" :anak-list="anak.anakList" :selected-pilar="app.selectedPilar" :selected-anak-id="app.selectedAnakId" @select-pilar="app.openPilarSub" @close-pilar="app.closePilarSub" @update:anak-id="app.selectedAnakId = $event" @go-profile="app.switchTab('profile')" />
      <ProgressTab v-show="app.activeTab === 'progress'" :anak-list="anak.anakList" :selected-anak-id="app.selectedAnakId" @reset-skill="anak.resetSkill" @delete-skill="anak.deleteSkill" />
      <ActivityTab ref="activityTabRef" v-show="app.activeTab === 'activity'" />
      <ProfileTab v-show="app.activeTab === 'profile'" :anak-list="anak.anakList" @select="handleProfileMenu" @select-anak="goToAnakProgress" />

      <div v-show="app.activeTab === 'challenge'" class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
        <AnakSelector v-if="anak.anakList.length" :anak-list="anak.anakList" v-model="tools.toolsAnakId" class="mb-stack-lg" />
        <ChallengePage :challenges="tools.toolsData.challenges" :challenge-history="tools.toolsData.challengeHistory" @add-challenge="tools.addChallenge" @add-point="tools.addPoint" @remove-point="tools.removePoint" @edit-challenge="tools.editChallenge" @delete-challenge="tools.deleteChallenge" />
      </div>

      <div v-show="app.activeTab === 'jadwal'" class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
        <AnakSelector v-if="anak.anakList.length" :anak-list="anak.anakList" v-model="tools.toolsAnakId" class="mb-stack-lg" />
        <JadwalPage :schedules="tools.toolsData.schedules" @add-schedule="tools.addSchedule" @remove-schedule="tools.removeSchedule" />
      </div>

      <div v-show="app.activeTab === 'checklist'" class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
        <AnakSelector v-if="anak.anakList.length" :anak-list="anak.anakList" v-model="tools.toolsAnakId" class="mb-stack-lg" />
        <ChecklistPage :checklists="tools.toolsData.checklists" @add-checklist="tools.addChecklist" @remove-checklist="tools.removeChecklist" @add-item="tools.addChecklistItem" @remove-item="tools.removeChecklistItem" />
      </div>
    </main>

    <BottomNav :tabs="tabs" :active-tab="app.activeTab" @switch="app.switchTab" />

    <Transition name="install-bar">
      <div v-if="showInstallBar" class="fixed bottom-24 left-4 right-4 z-50 lg:bottom-4 lg:left-auto lg:right-4 lg:w-80">
        <div class="bg-white rounded-2xl p-4 shadow-xl border-2 border-primary-container flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-success-soft flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-primary">download</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-lg text-text-main text-sm">Install {{ appName }}</p>
            <p class="text-xs text-on-surface-variant">Akses lebih cepat dari layar utama</p>
          </div>
          <button @click="installApp"
            class="px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold active:scale-95 transition-transform">
            Install
          </button>
          <button @click="app.installDismissed = true"
            class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { tabs } from './data/tabs.js'
import { useInstall } from './composables/useInstall.js'
import { getSetting } from './db.js'
import { useAppStore } from './stores/appStore.js'
import { useAnakStore } from './stores/anakStore.js'
import { useToolsStore } from './stores/toolsStore.js'
import AppHeader from './layouts/AppHeader.vue'
import AppSidebar from './layouts/AppSidebar.vue'
import BottomNav from './layouts/BottomNav.vue'
import PilarTab from './pages/PilarTab.vue'
import ProgressTab from './pages/ProgressTab.vue'
import ActivityTab from './pages/ActivityTab.vue'
import ProfileTab from './pages/ProfileTab.vue'
import ChallengePage from './pages/ChallengePage.vue'
import JadwalPage from './pages/JadwalPage.vue'
import ChecklistPage from './pages/ChecklistPage.vue'
import ReferralPage from './pages/ReferralPage.vue'
import AnakSelector from './components/AnakSelector.vue'

const isReferral = computed(() => new URLSearchParams(window.location.search).has('ref'))
const appName = import.meta.env.VITE_APP_NAME || 'Halo Bunda'

const app = useAppStore()
const anak = useAnakStore()
const tools = useToolsStore()

const pilarTabRef = ref(null)
const activityTabRef = ref(null)
const { canInstall, install: installApp } = useInstall()

const showInstallBar = computed(() => canInstall.value && !app.installDismissed)

async function seedAndLoad() {
  const savedName = await getSetting('userName')
  if (savedName) app.userName = savedName
  const savedGender = await getSetting('userGender')
  if (savedGender) app.userGender = savedGender
  await anak.loadAnakList()
  await tools.loadToolsData(anak.anakList)
  if (!app.selectedAnakId && anak.anakList.length) {
    app.selectedAnakId = anak.anakList[0].id
  }
  app.appReady = true
}

function handleProfileMenu(menuId) {
  console.log('Profile menu clicked:', menuId)
}

function goToAnakProgress(anakItem) {
  if (app.activeTab !== 'progress') history.pushState({ action: 'tab', from: app.activeTab }, '')
  app.selectedAnakId = anakItem.id
  app.activeTab = 'progress'
  window.scrollTo(0, 0)
}

function handleBack() {
  if (pilarTabRef.value?.goBack()) return
  if (activityTabRef.value?.goBack()) return
  if (app.selectedPilar) { app.selectedPilar = null; return }
  if (app.activeTab !== 'pilar') { app.activeTab = 'pilar'; window.scrollTo(0, 0); return }
}

onMounted(async () => {
  history.replaceState({ action: 'root' }, '')
  window.addEventListener('popstate', handleBack)
  await seedAndLoad()
})

onUnmounted(() => {
  window.removeEventListener('popstate', handleBack)
})
</script>
