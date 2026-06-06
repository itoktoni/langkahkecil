<template>
  <div class="bg-canvas-cream text-text-main min-h-screen">
    <AppSidebar :tabs="tabs" :active-tab="activeTab" :user-name="userName" @switch="switchTab" />
    <AppHeader :title="pageTitle" :tabs="tabs" :active-tab="activeTab" :user-name="userName" @switch="switchTab" />

    <main class="content-wrapper pb-24 lg:pb-8">
      <PilarTab v-show="activeTab === 'pilar'" :selected-pilar="selectedPilar" @select-pilar="openPilarSub" @close-pilar="closePilarSub" />
      <ProgressTab v-show="activeTab === 'progress'" :anak-list="anakList" :history="allHistory" :selected-anak-id="selectedAnakId" @reset-subpilar="resetSubpilar" />
      <ToolsTab v-show="activeTab === 'tools'" :anak-list="anakList" />
      <ProfileTab v-show="activeTab === 'profile'" :anak-list="anakList" @select="handleProfileMenu" @select-anak="goToAnakProgress" />
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
import ProfileTab from './components/ProfileTab.vue'

const activeTab = ref('pilar')
const selectedPilar = ref(null)
const selectedAnakId = ref(null)
const userName = ref('Azizah')

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
  const titles = { pilar: `Halo ${userName.value}!`, progress: 'Statistik', tools: 'Buku Alat', profile: 'Profile' }
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

function handleProfileMenu(menuId) {
  console.log('Profile menu clicked:', menuId)
}

function goToAnakProgress(anak) {
  selectedAnakId.value = anak.id
  activeTab.value = 'progress'
  window.scrollTo(0, 0)
}

function resetSubpilar({ anak, subpilar }) {
  const idx = anak.completedSubpilars.findIndex(s => s.key === subpilar.key)
  if (idx > -1) {
    anak.completedSubpilars.splice(idx, 1)
    anak.subpilars.push({ ...subpilar, progress: 0 })
  }
}
</script>
