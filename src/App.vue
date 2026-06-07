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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { tabs } from './data/pilars.js'
import { challengeByAnak, defaultChallenge } from './data/challenge.js'
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

const anakList = ref([
  {
    id: 1, nama: 'Raka', usia: '7 tahun', emoji: '👦', bg: '#E3F2FD',
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
    id: 2, nama: 'Rina', usia: '5 tahun', emoji: '👧', bg: '#FCE4EC',
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
])

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

const allHistory = computed(() => {
  return anakList.value
    .flatMap(a => (a.history || []).map(h => ({ ...h, anakNama: a.nama, anakEmoji: a.emoji })))
    .sort((a, b) => {
      const parse = s => {
        const [d, m, y] = s.split(' ')
        const months = { Jan:0, Feb:1, Mar:2, Apr:3, Mei:4, Jun:5, Jul:6, Agu:7, Sep:8, Okt:9, Nov:10, Des:11 }
        return new Date(y, months[m], d)
      }
      return parse(b.date) - parse(a.date)
    })
})

const toolsDataByAnak = {
  1: {
    ...JSON.parse(JSON.stringify(challengeByAnak[1] || defaultChallenge)),
    schedules: [
      { time: '07:00', label: 'Sarapan & Persiapan Sekolah', done: true },
      { time: '08:00', label: 'Belajar Membaca', done: true },
      { time: '16:00', label: 'Waktu Bermain Bebas', done: false },
      { time: '20:00', label: 'Membaca Buku', done: false }
    ],
    checklists: [
      {
        id: 1, title: 'Pagi Hari',
        items: [
          { label: 'Sholat Subuh', done: true },
          { label: 'Membaca buku sebelum tidur', done: true },
          { label: 'Sarapan sehat', done: false }
        ]
      },
      {
        id: 2, title: 'Malam Hari',
        items: [
          { label: 'Merapiikan mainan', done: false },
          { label: 'Minum air putih', done: true },
          { label: 'Sholat Isya', done: true }
        ]
      }
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
      {
        id: 1, title: 'Kegiatan Harian',
        items: [
          { label: 'Sikat Gigi Sendiri', done: true },
          { label: 'Membereskan Mainan', done: false },
          { label: 'Makan Sendiri', done: true }
        ]
      }
    ]
  }
}

const defaultToolsData = {
  challenges: [],
  challengeHistory: [],
  schedules: [
    { time: '07:00', label: 'Sarapan', done: false },
    { time: '20:00', label: 'Tidur', done: false }
  ],
  checklists: []
}

const anakToolsData = ref({})

function getAnakToolsData(anakId) {
  if (!anakToolsData.value[anakId]) {
    anakToolsData.value[anakId] = JSON.parse(JSON.stringify(toolsDataByAnak[anakId] || defaultToolsData))
  }
  return anakToolsData.value[anakId]
}

const toolsData = computed(() => getAnakToolsData(toolsAnakId.value))

function onAddChallenge(item) {
  toolsData.value.challenges.push(item)
}

function onAddPoint({ id, amount }) {
  const c = toolsData.value.challenges.find(c => c.id === id)
  if (c) {
    c.points = Math.min(c.maxPoints, c.points + amount)
  }
}

function onRemovePoint({ id }) {
  const c = toolsData.value.challenges.find(c => c.id === id)
  if (c) {
    c.points = Math.max(0, c.points - 1)
  }
}

function onEditChallenge(data) {
  const c = toolsData.value.challenges.find(c => c.id === data.id)
  if (c) {
    c.category = data.category
    c.title = data.title
    c.notes = data.notes
    c.emoji = data.emoji
    c.bg = data.bg
    c.color = data.color
    c.maxPoints = data.maxPoints
  }
}

function onAddChecklist(item) {
  toolsData.value.checklists.push(item)
}

function onRemoveChecklist(index) {
  toolsData.value.checklists.splice(index, 1)
}

function onAddChecklistItem({ checklistId, item }) {
  const cl = toolsData.value.checklists.find(c => c.id === checklistId)
  if (cl) cl.items.push(item)
}

function onRemoveChecklistItem({ checklistId, itemIndex }) {
  const cl = toolsData.value.checklists.find(c => c.id === checklistId)
  if (cl) cl.items.splice(itemIndex, 1)
}

function onAddSchedule(item) {
  toolsData.value.schedules.push(item)
}

function onRemoveSchedule(item) {
  const idx = toolsData.value.schedules.indexOf(item)
  if (idx > -1) toolsData.value.schedules.splice(idx, 1)
}

function switchTab(tabId) {
  if (activeTab.value !== tabId) {
    history.pushState({ action: 'tab', from: activeTab.value }, '')
  }
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

function handleProfileMenu(menuId) {
  console.log('Profile menu clicked:', menuId)
}

function goToAnakProgress(anak) {
  if (activeTab.value !== 'progress') {
    history.pushState({ action: 'tab', from: activeTab.value }, '')
  }
  selectedAnakId.value = anak.id
  activeTab.value = 'progress'
  window.scrollTo(0, 0)
}

function handleBack() {
  if (pilarTabRef.value?.goBack()) return
  if (selectedPilar.value) { selectedPilar.value = null; return }
  if (activeTab.value !== 'pilar') { activeTab.value = 'pilar'; window.scrollTo(0, 0); return }
}

onMounted(() => {
  history.replaceState({ action: 'root' }, '')
  window.addEventListener('popstate', handleBack)
  if (anakList.value.length && !toolsAnakId.value) {
    toolsAnakId.value = anakList.value[0].id
  }
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
