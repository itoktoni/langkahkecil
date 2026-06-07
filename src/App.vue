<template>
  <div class="bg-canvas-cream text-text-main min-h-screen">
    <AppSidebar :tabs="tabs" :active-tab="activeTab" :user-name="userName" @switch="switchTab" />
    <AppHeader :title="pageTitle" :tabs="tabs" :active-tab="activeTab" :user-name="userName" @switch="switchTab" />

    <main class="content-wrapper pb-24 lg:pb-8">
      <PilarTab ref="pilarTabRef" v-show="activeTab === 'pilar'" :selected-pilar="selectedPilar" @select-pilar="openPilarSub" @close-pilar="closePilarSub" />
      <ProgressTab v-show="activeTab === 'progress'" :anak-list="anakList" :history="allHistory" :selected-anak-id="selectedAnakId" @reset-subpilar="resetSubpilar" />
      <ToolsTab v-show="activeTab === 'tools'" :anak-list="anakList" />
      <ProfileTab v-show="activeTab === 'profile'" :anak-list="anakList" @select="handleProfileMenu" @select-anak="goToAnakProgress" />

      <div v-show="activeTab === 'challenge'" class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
        <AnakSelector v-if="anakList.length" :anak-list="anakList" v-model="toolsAnakId" class="mb-stack-lg" />
        <ChallengePage :challenges="toolsData.challenges" :challenge-history="toolsData.challengeHistory" @add-challenge="onAddChallenge" @add-point="onAddPoint" @remove-point="onRemovePoint" @edit-challenge="onEditChallenge" />
      </div>

      <div v-show="activeTab === 'jadwal'" class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
        <AnakSelector v-if="anakList.length" :anak-list="anakList" v-model="toolsAnakId" class="mb-stack-lg" />
        <JadwalPage :schedules="toolsData.schedules" @add-schedule="onAddSchedule" @remove-schedule="onRemoveSchedule" />
      </div>

      <div v-show="activeTab === 'checklist'" class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
        <AnakSelector v-if="anakList.length" :anak-list="anakList" v-model="toolsAnakId" class="mb-stack-lg" />
        <ChecklistPage :checklists="toolsData.checklists" @add-checklist="onAddChecklist" @remove-checklist="onRemoveChecklist" @add-item="onAddChecklistItem" @remove-item="onRemoveChecklistItem" />
      </div>
    </main>

    <BottomNav :tabs="tabs" :active-tab="activeTab" @switch="switchTab" />

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
          <button @click="dismissInstall"
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
import { ageLabel, ageGroup } from './utils/age.js'
import {
  getAnakList, saveAnak,
  getChallenges, saveChallenge, removeChallenge,
  getChallengeHistory, saveChallengeHistory,
  getChecklists, saveChecklist, removeChecklist,
  getSchedules, saveSchedule, removeSchedule
} from './db.js'
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
import AnakSelector from './components/AnakSelector.vue'

const activeTab = ref('pilar')
const selectedPilar = ref(null)
const selectedAnakId = ref(null)
const userName = ref('Azizah')
const pilarTabRef = ref(null)
const toolsAnakId = ref(null)
const appReady = ref(false)
const { canInstall, install: installApp } = useInstall()
const installDismissed = ref(false)

const showInstallBar = computed(() => canInstall.value && !installDismissed.value)

function dismissInstall() {
  installDismissed.value = true
}

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

const anakList = ref([])
const anakToolsData = ref({})

const emptyToolsData = { challenges: [], challengeHistory: [], checklists: [], schedules: [] }

function getAnakToolsData(anakId) {
  if (!anakToolsData.value[anakId]) {
    anakToolsData.value[anakId] = JSON.parse(JSON.stringify(emptyToolsData))
  }
  return anakToolsData.value[anakId]
}

const toolsData = computed(() => getAnakToolsData(toolsAnakId.value))

const pageTitle = computed(() => {
  const titles = { pilar: `Halo ${userName.value}!`, progress: 'Statistik', tools: 'Buku Alat', profile: 'Profile', challenge: 'Challenge', jadwal: 'Jadwal Harian', checklist: 'Checklist Harian' }
  return titles[activeTab.value] || `Halo ${userName.value}!`
})

const allHistory = computed(() => {
  return anakList.value
    .flatMap(a => (a.history || []).map(h => ({ ...h, anakNama: a.nama, anakEmoji: a.emoji })))
    .sort((a, b) => {
      const parse = s => { const [d, m, y] = s.split(' '); const months = { Jan:0, Feb:1, Mar:2, Apr:3, Mei:4, Jun:5, Jul:6, Agu:7, Sep:8, Okt:9, Nov:10, Des:11 }; return new Date(y, months[m], d) }
      return parse(b.date) - parse(a.date)
    })
})

function getUsia(anak) {
  return ageLabel(anak.tahun, anak.bulan, anak.tanggal)
}

function getAgeGroup(anak) {
  return ageGroup(anak.tahun)
}

async function seedAndLoad() {
  const existing = await getAnakList()
  if (existing.length === 0) {
    for (const a of defaultAnakList) await saveAnak(JSON.parse(JSON.stringify(a)))
    for (const [anakId, data] of Object.entries(defaultToolsByAnak)) {
      const id = Number(anakId)
      for (const c of (data.challenges || [])) await saveChallenge({ ...c, anakId: id })
      for (const c of (data.challengeHistory || [])) await saveChallengeHistory({ ...c, anakId: id })
      for (const cl of (data.checklists || [])) await saveChecklist({ ...cl, anakId: id })
      for (const s of (data.schedules || [])) await saveSchedule({ ...s, anakId: id })
    }
  }
  anakList.value = await getAnakList()
  if (anakList.value.length && !toolsAnakId.value) {
    toolsAnakId.value = anakList.value[0].id
  }
  for (const anak of anakList.value) {
    const challenges = await getChallenges(anak.id)
    const challengeHistory = await getChallengeHistory(anak.id)
    const checklists = await getChecklists(anak.id)
    const schedules = await getSchedules(anak.id)
    anakToolsData.value[anak.id] = { challenges, challengeHistory, checklists, schedules }
  }
  appReady.value = true
}

function persistChallenge(item) { saveChallenge({ ...item, anakId: toolsAnakId.value }) }

function onAddChallenge(item) {
  toolsData.value.challenges.push(item)
  persistChallenge(item)
}

function onAddPoint({ id, amount }) {
  const c = toolsData.value.challenges.find(c => c.id === id)
  if (c) { c.points = Math.min(c.maxPoints, c.points + amount); persistChallenge(c) }
}

function onRemovePoint({ id }) {
  const c = toolsData.value.challenges.find(c => c.id === id)
  if (c) { c.points = Math.max(0, c.points - 1); persistChallenge(c) }
}

function onEditChallenge(data) {
  const c = toolsData.value.challenges.find(c => c.id === data.id)
  if (c) { Object.assign(c, data); saveChallenge(c) }
}

function persistChecklist(item) { saveChecklist({ ...item, anakId: toolsAnakId.value }) }

function onAddChecklist(item) {
  toolsData.value.checklists.push(item)
  persistChecklist(item)
}

function onRemoveChecklist(index) {
  const removed = toolsData.value.checklists.splice(index, 1)[0]
  if (removed?.id) removeChecklist(removed.id)
}

function onAddChecklistItem({ checklistId, item }) {
  const cl = toolsData.value.checklists.find(c => c.id === checklistId)
  if (cl) { cl.items.push(item); persistChecklist(cl) }
}

function onRemoveChecklistItem({ checklistId, itemIndex }) {
  const cl = toolsData.value.checklists.find(c => c.id === checklistId)
  if (cl) { cl.items.splice(itemIndex, 1); persistChecklist(cl) }
}

function persistSchedule(item) { saveSchedule({ ...item, anakId: toolsAnakId.value }) }

function onAddSchedule(item) {
  toolsData.value.schedules.push(item)
  persistSchedule(item)
}

function onRemoveSchedule(item) {
  const idx = toolsData.value.schedules.indexOf(item)
  if (idx > -1) { toolsData.value.schedules.splice(idx, 1); if (item.id) removeSchedule(item.id) }
}

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

function closePilarSub() { selectedPilar.value = null }

function handleProfileMenu(menuId) { console.log('Profile menu clicked:', menuId) }

function goToAnakProgress(anak) {
  if (activeTab.value !== 'progress') history.pushState({ action: 'tab', from: activeTab.value }, '')
  selectedAnakId.value = anak.id
  activeTab.value = 'progress'
  window.scrollTo(0, 0)
}

function handleBack() {
  if (pilarTabRef.value?.goBack()) return
  if (selectedPilar.value) { selectedPilar.value = null; return }
  if (activeTab.value !== 'pilar') { activeTab.value = 'pilar'; window.scrollTo(0, 0); return }
}

onMounted(async () => {
  history.replaceState({ action: 'root' }, '')
  window.addEventListener('popstate', handleBack)
  await seedAndLoad()
})

onUnmounted(() => {
  window.removeEventListener('popstate', handleBack)
})

function resetSubpilar({ anak, subpilar }) {
  const idx = anak.completedSubpilars.findIndex(s => s.key === subpilar.key)
  if (idx > -1) {
    anak.completedSubpilars.splice(idx, 1)
    anak.subpilars.push({ ...subpilar, progress: 0 })
  }
}
</script>
