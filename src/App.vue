<template>
  <ReferralPage v-if="isReferral" />
  <div v-else class="bg-canvas-cream text-text-main min-h-screen">
    <AppSidebar :tabs="tabs" :active-tab="app.activeTab" :user-name="app.userName" @switch="app.switchTab" />
    <AppHeader :title="app.pageTitle" :tabs="tabs" :active-tab="app.activeTab" :user-name="app.userName" @switch="app.switchTab" />

    <main class="content-wrapper pb-24 lg:pb-8">
      <PilarTab ref="pilarTabRef" v-show="app.activeTab === 'pilar'" :selected-pilar="app.selectedPilar" @select-pilar="app.openPilarSub" @close-pilar="app.closePilarSub" />
      <ProgressTab v-show="app.activeTab === 'progress'" :anak-list="anak.anakList" :selected-anak-id="app.selectedAnakId" @reset-subpilar="anak.resetSubpilar" />
      <ToolsTab v-show="app.activeTab === 'tools'" :anak-list="anak.anakList" />
      <ProfileTab v-show="app.activeTab === 'profile'" :anak-list="anak.anakList" @select="handleProfileMenu" @select-anak="goToAnakProgress" />

      <div v-show="app.activeTab === 'challenge'" class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
        <AnakSelector v-if="anak.anakList.length" :anak-list="anak.anakList" v-model="tools.toolsAnakId" class="mb-stack-lg" />
        <ChallengePage :challenges="tools.toolsData.challenges" :challenge-history="tools.toolsData.challengeHistory" @add-challenge="tools.addChallenge" @add-point="tools.addPoint" @remove-point="tools.removePoint" @edit-challenge="tools.editChallenge" />
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
            <p class="font-label-lg text-text-main text-sm">Install Halo Bunda</p>
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
import { tabs } from './data/pilars.js'
import { challengeByAnak, defaultChallenge } from './data/challenge.js'
import { useInstall } from './composables/useInstall.js'
import { getAnakList, saveAnak as dbSaveAnak, saveChallenge, saveChallengeHistory, saveChecklist, saveSchedule } from './db.js'
import { useAppStore } from './stores/appStore.js'
import { useAnakStore } from './stores/anakStore.js'
import { useToolsStore } from './stores/toolsStore.js'
import AppHeader from './layouts/AppHeader.vue'
import AppSidebar from './layouts/AppSidebar.vue'
import BottomNav from './layouts/BottomNav.vue'
import PilarTab from './pages/PilarTab.vue'
import ProgressTab from './pages/ProgressTab.vue'
import ToolsTab from './pages/ToolsTab.vue'
import ProfileTab from './pages/ProfileTab.vue'
import ChallengePage from './pages/ChallengePage.vue'
import JadwalPage from './pages/JadwalPage.vue'
import ChecklistPage from './pages/ChecklistPage.vue'
import ReferralPage from './pages/ReferralPage.vue'
import AnakSelector from './components/AnakSelector.vue'

const isReferral = computed(() => new URLSearchParams(window.location.search).has('ref'))

const app = useAppStore()
const anak = useAnakStore()
const tools = useToolsStore()

const pilarTabRef = ref(null)
const { canInstall, install: installApp } = useInstall()

const showInstallBar = computed(() => canInstall.value && !app.installDismissed)

const defaultAnakList = [
  {
    id: 1, nama: 'Raka', gender: 'Laki-laki', emoji: '👦', bg: '#E3F2FD',
    tanggal: 15, bulan: 3, tahun: 2019,
    subpilars: [
      { key: 'bersyukur', emoji: '🤲', title: 'Bersyukur', pilar: 'spiritual', progress: 80, color: '#4CAF50' },
      { key: 'tidak_mudah_menyerah', emoji: '💪', title: 'Tidak Mudah Menyerah', pilar: 'karakter', progress: 45, color: '#FF9800' },
      { key: 'berpikir_kreatif', emoji: '🎨', title: 'Berpikir Kreatif', pilar: 'kreatifitas', progress: 60, color: '#2196F3' }
    ],
    completedSubpilars: [
      { key: 'fokus', emoji: '🎯', title: 'Fokus', pilar: 'disiplin', color: '#9C27B0' }
    ],
    history: [
      { date: '05 Jun 2026', action: 'Menyelesaikan aktivitas Bersyukur', emoji: '🤲', color: '#4CAF50' },
      { date: '03 Jun 2026', action: 'Mulai Belajar Tidak Mudah Menyerah', emoji: '💪', color: '#FF9800' },
      { date: '01 Jun 2026', action: 'Menyelesaikan aktivitas Berpikir Kreatif', emoji: '🎨', color: '#2196F3' },
      { date: '28 Mei 2026', action: 'Mulai Belajar Bersyukur', emoji: '🤲', color: '#4CAF50' }
    ]
  },
  {
    id: 2, nama: 'Rina', gender: 'Perempuan', emoji: '👧', bg: '#FCE4EC',
    tanggal: 22, bulan: 7, tahun: 2021,
    subpilars: [
      { key: 'berani_bicara', emoji: '🗣', title: 'Berani Bicara', pilar: 'karakter', progress: 30, color: '#FF9800' },
      { key: 'berbagi', emoji: '🎁', title: 'Berbagi', pilar: 'sosial', progress: 55, color: '#8D6E63' }
    ],
    completedSubpilars: [
      { key: 'jujur', emoji: '🤝', title: 'Jujur', pilar: 'spiritual', color: '#4CAF50' }
    ],
    history: [
      { date: '06 Jun 2026', action: 'Menyelesaikan aktivitas Jujur', emoji: '🤝', color: '#4CAF50' },
      { date: '04 Jun 2026', action: 'Mulai Belajar Berbagi', emoji: '🎁', color: '#8D6E63' },
      { date: '02 Jun 2026', action: 'Mulai Belajar Berani Bicara', emoji: '🗣', color: '#FF9800' },
      { date: '30 Mei 2026', action: 'Mulai Belajar Jujur', emoji: '🤝', color: '#4CAF50' }
    ]
  }
]

const defaultToolsByAnak = {
  1: {
    ...JSON.parse(JSON.stringify(challengeByAnak[1] || defaultChallenge)),
    schedules: [
      { time: '07:00', label: 'Sarapan & Persiapan Sekolah', done: true },
      { time: '08:00', label: 'Belajar Membaca', done: true },
      { time: '16:00', label: 'Waktu Bermain Bebas', done: false },
      { time: '20:00', label: 'Membaca Buku', done: false }
    ],
    checklists: [
      { id: 1, title: 'Pagi Hari', items: [{ label: 'Sholat Subuh', done: true }, { label: 'Membaca buku sebelum tidur', done: true }, { label: 'Sarapan sehat', done: false }] },
      { id: 2, title: 'Malam Hari', items: [{ label: 'Merapiikan mainan', done: false }, { label: 'Minum air putih', done: true }, { label: 'Sholat Isya', done: true }] }
    ]
  },
  2: {
    ...JSON.parse(JSON.stringify(challengeByAnak[2] || defaultChallenge)),
    schedules: [
      { time: '07:30', label: 'Sarapan & Bermain', done: true },
      { time: '10:00', label: 'Belajar Menggambar', done: false },
      { time: '15:00', label: 'Tidur Siang', done: true }
    ],
    checklists: [
      { id: 1, title: 'Kegiatan Harian', items: [{ label: 'Sikat Gigi Sendiri', done: true }, { label: 'Membereskan Mainan', done: false }, { label: 'Makan Sendiri', done: true }] }
    ]
  }
}

async function seedAndLoad() {
  const existing = await getAnakList()
  if (existing.length === 0) {
    for (const a of defaultAnakList) await dbSaveAnak(JSON.parse(JSON.stringify(a)))
    for (const [anakId, data] of Object.entries(defaultToolsByAnak)) {
      const id = Number(anakId)
      for (const c of (data.challenges || [])) await saveChallenge({ ...c, anakId: id })
      for (const c of (data.challengeHistory || [])) await saveChallengeHistory({ ...c, anakId: id })
      for (const cl of (data.checklists || [])) await saveChecklist({ ...cl, anakId: id })
      for (const s of (data.schedules || [])) await saveSchedule({ ...s, anakId: id })
    }
  }
  await anak.loadAnakList()
  await tools.loadToolsData(anak.anakList)
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
