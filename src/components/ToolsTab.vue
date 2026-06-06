<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
    <div class="flex items-center justify-between mb-stack-lg">
      <h2 class="font-headline-md text-headline-md">Alat Bantu Bunda</h2>
      <div v-if="anakList.length" class="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 soft-shadow">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm" :style="{ background: selectedAnak?.bg }">{{ selectedAnak?.emoji }}</span>
        <select v-model="selectedAnakId"
          class="bg-transparent text-sm font-medium text-text-main focus:outline-none appearance-none pr-4 cursor-pointer">
          <option v-for="anak in anakList" :key="anak.id" :value="anak.id">{{ anak.nama }}</option>
        </select>
        <span class="material-symbols-outlined text-on-surface-variant text-base -ml-2 pointer-events-none">expand_more</span>
      </div>
    </div>

    <div class="mb-6 rounded-[28px] p-5 border-2" style="border-color: #4CAF5040">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-headline-sm text-text-main flex items-center gap-2">
          <span class="material-symbols-outlined" style="color: #4CAF50">school</span> Hafalan
        </h3>
        <button @click="showHistory = !showHistory"
          class="flex items-center gap-1.5 text-sm font-medium transition-colors" style="color: #4CAF50">
          <span class="material-symbols-outlined text-lg">{{ showHistory ? 'close' : 'history' }}</span>
          {{ showHistory ? 'Tutup' : 'History' }}
        </button>
      </div>

      <div v-if="!showHistory" class="space-y-3">
        <div v-for="h in activeHafalan" :key="h.id"
          class="bg-white rounded-[24px] p-5 soft-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex-1 min-w-0">
              <p class="font-label-lg text-text-main">{{ h.title }}</p>
              <p class="text-xs text-on-surface-variant">{{ h.category }} · {{ h.desc }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between mb-1.5">
            <p class="text-xs text-on-surface-variant">{{ h.desc }}</p>
            <p class="text-xs font-bold" :style="{ color: h.color }">{{ h.progress }}%</p>
          </div>
          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700" :style="{ width: h.progress + '%', background: h.color }"></div>
          </div>
        </div>
        <div v-if="!activeHafalan.length"
          class="bg-white/70 rounded-[24px] p-6 soft-shadow text-center text-sm text-on-surface-variant">
          Belum ada hafalan aktif
        </div>
        <button @click="showAddHafalan = true"
          class="w-full py-3 rounded-2xl border-2 border-dashed text-sm font-medium transition-colors flex items-center justify-center gap-2" style="border-color: #4CAF5060; color: #4CAF50">
          <span class="material-symbols-outlined text-lg">add</span>
          Tambah Hafalan
        </button>
      </div>

      <div v-else class="space-y-5">
        <div v-for="(items, cat) in historyByCategory" :key="cat">
          <div class="flex items-center gap-2 mb-2">
            <h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{{ cat }}</h4>
            <span class="text-[10px] font-bold text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded-full">{{ items.length }}</span>
          </div>
          <div class="space-y-2">
            <div v-for="h in items" :key="h.id"
              class="bg-white rounded-2xl p-4 soft-shadow flex items-center gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text-main">{{ h.title }}</p>
                <p class="text-[11px] text-on-surface-variant">Dimulai {{ h.startDate }} · Selesai {{ h.completedDate }}</p>
              </div>
              <span class="material-symbols-outlined text-green-600 text-xl">check_circle</span>
            </div>
          </div>
        </div>
        <div v-if="!currentData.hafalanHistory.length"
          class="bg-white rounded-[24px] p-6 soft-shadow text-center text-sm text-on-surface-variant">
          Belum ada riwayat hafalan
        </div>
      </div>
    </div>

    <div v-if="showAddHafalan" class="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
      <div class="absolute inset-0 bg-black/40" @click="closeAddHafalan"></div>
      <div class="relative bg-white rounded-t-[28px] lg:rounded-[28px] w-full max-w-md p-6 pb-8 lg:mb-0">
        <div class="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-5 lg:hidden"></div>
        <h3 class="font-headline-sm text-text-main mb-5">Tambah Hafalan</h3>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Kategori</label>
            <select v-model="newHafalan.category"
              class="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white appearance-none">
              <option value="" disabled>Pilih kategori</option>
              <option value="Kitab Suci">Kitab Suci</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa">Bahasa</option>
              <option value="IPA">IPA</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Nama Hafalan</label>
            <input v-model="newHafalan.title"
              class="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white"
              placeholder="Contoh: Perkalian 1-10" />
          </div>
          <div>
            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Catatan</label>
            <textarea v-model="newHafalan.desc"
              class="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white resize-none h-20"
              placeholder="Catatan tambahan..."></textarea>
          </div>
          <div>
            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Progress (1-100)</label>
            <div class="flex items-center gap-3">
              <input v-model.number="newHafalan.progress" type="range" min="1" max="100"
                class="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600">
              <span class="text-sm font-bold text-primary w-10 text-right">{{ newHafalan.progress }}%</span>
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="closeAddHafalan"
            class="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-medium text-on-surface-variant hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button @click="addHafalan"
            class="flex-1 py-3 rounded-xl bg-[#2E7D32] text-white text-sm font-medium hover:bg-[#2E7D32]/90 transition-colors shadow-lg shadow-green-900/20">
            Simpan
          </button>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-headline-sm text-text-main flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">schedule</span> Jadwal Harian
        </h3>
        <button class="text-primary text-sm font-bold bg-success-soft px-4 py-1.5 rounded-full">Ubah</button>
      </div>
      <div class="space-y-2">
        <div v-for="s in currentData.schedules" :key="s.time"
          class="bg-white p-4 rounded-2xl flex items-center justify-between soft-shadow">
          <div class="flex items-center gap-3">
            <span class="font-label-sm text-on-surface-variant">{{ s.time }}</span>
            <span class="font-body-md text-sm">{{ s.label }}</span>
          </div>
          <span class="material-symbols-outlined"
            :class="s.done ? 'text-growth-green' : 'text-outline-variant'">
            {{ s.done ? 'check_circle' : 'radio_button_unchecked' }}
          </span>
        </div>
      </div>
    </div>

    <div>
      <h3 class="font-headline-sm text-text-main flex items-center gap-2 mb-3">
        <span class="material-symbols-outlined text-friendly-sky">fact_check</span> Checklist Harian
      </h3>
      <div class="bg-white p-5 rounded-[24px] soft-shadow space-y-3">
        <label v-for="(item, i) in currentData.checklist" :key="i" class="flex items-center gap-3 cursor-pointer">
          <input v-model="item.done" type="checkbox"
            class="w-5 h-5 rounded-md border-outline-variant text-growth-green focus:ring-growth-green">
          <span class="font-body-md text-sm">{{ item.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  anakList: { type: Array, default: () => [] }
})

const selectedAnakId = ref(null)
const showHistory = ref(false)
const showAddHafalan = ref(false)
const anakData = ref({})

const categoryEmojis = {
  "Kitab Suci": { emoji: '📖', bg: '#E8F5E9', color: '#4CAF50' },
  "Matematika": { emoji: '✖️', bg: '#E3F2FD', color: '#2196F3' },
  "Bahasa": { emoji: '🔤', bg: '#FFF3E0', color: '#FF9800' },
  "IPA": { emoji: '🔬', bg: '#F3E5F5', color: '#9C27B0' },
  "Lainnya": { emoji: '📝', bg: '#FCE4EC', color: '#E91E63' }
}

const newHafalan = ref({ category: '', title: '', desc: '', progress: 1 })

const defaultDataByAnak = {
  1: {
    hafalan: [
      { id: 1, title: 'Surat An-Naba', desc: 'Ayat 1-10', category: "Kitab Suci", emoji: '📖', bg: '#E8F5E9', color: '#4CAF50', progress: 70 },
      { id: 2, title: 'Perkalian 1-5', desc: 'Tabel perkalian', category: 'Matematika', emoji: '✖️', bg: '#E3F2FD', color: '#2196F3', progress: 60 },
      { id: 3, title: 'Kosakata Bahasa Inggris', desc: 'Hewan & Buah', category: 'Bahasa', emoji: '🔤', bg: '#FFF3E0', color: '#FF9800', progress: 40 }
    ],
    hafalanHistory: [
      { id: 101, title: 'Surat Al-Fatihah', category: "Kitab Suci", emoji: '📖', bg: '#E8F5E9', startDate: '01 Apr 2026', completedDate: '25 Mei 2026' },
      { id: 104, title: 'Surat An-Naba', category: "Kitab Suci", emoji: '📖', bg: '#E8F5E9', startDate: '01 Mar 2026', completedDate: '15 Apr 2026' },
      { id: 105, title: 'Surat Al-Baqarah', category: "Kitab Suci", emoji: '📖', bg: '#E8F5E9', startDate: '01 Feb 2026', completedDate: '28 Feb 2026' },
      { id: 102, title: 'Penjumlahan 1-10', category: 'Matematika', emoji: '➕', bg: '#F3E5F5', startDate: '15 Apr 2026', completedDate: '10 Mei 2026' },
      { id: 103, title: 'Kosakata Hewan', category: 'Bahasa', emoji: '🔤', bg: '#FFF3E0', startDate: '01 Mar 2026', completedDate: '20 Apr 2026' }
    ],
    schedules: [
      { time: '07:00', label: 'Sarapan & Persiapan Sekolah', done: true },
      { time: '08:00', label: 'Belajar Membaca', done: true },
      { time: '16:00', label: 'Waktu Bermain Bebas', done: false },
      { time: '20:00', label: 'Membaca Buku', done: false }
    ],
    checklist: [
      { label: 'Membaca buku sebelum tidur', done: true },
      { label: 'Merapiikan mainan sendiri', done: false },
      { label: 'Minum air putih cukup', done: false },
      { label: 'Sholat 5 waktu', done: true }
    ]
  },
  2: {
    hafalan: [
      { id: 1, title: 'Surat Al-Fatihah', desc: 'Ayat 1-7', category: "Kitab Suci", emoji: '📖', bg: '#E8F5E9', color: '#4CAF50', progress: 100 },
      { id: 2, title: 'Menghitung 1-20', desc: 'Angka & Jumlah', category: 'Matematika', emoji: '🔢', bg: '#FCE4EC', color: '#E91E63', progress: 60 }
    ],
    hafalanHistory: [
      { id: 101, title: 'Menghitung 1-10', category: 'Matematika', emoji: '🔢', bg: '#FCE4EC', startDate: '01 Mei 2026', completedDate: '01 Jun 2026' },
      { id: 102, title: 'Warna & Bentuk', category: 'IPA', emoji: '🔬', bg: '#F3E5F5', startDate: '15 Apr 2026', completedDate: '20 Mei 2026' },
      { id: 103, title: 'Sapaan Sehari-hari', category: 'Bahasa', emoji: '🔤', bg: '#FFF3E0', startDate: '01 Mar 2026', completedDate: '10 Apr 2026' }
    ],
    schedules: [
      { time: '07:30', label: 'Sarapan & Bermain', done: true },
      { time: '10:00', label: 'Belajar Menggambar', done: false },
      { time: '15:00', label: 'Tidur Siang', done: true }
    ],
    checklist: [
      { label: 'Sikat Gigi Sendiri', done: true },
      { label: 'Membereskan Mainan', done: false },
      { label: 'Makan Sendiri', done: true }
    ]
  }
}

const defaultData = {
  hafalan: [],
  hafalanHistory: [],
  schedules: [
    { time: '07:00', label: 'Sarapan', done: false },
    { time: '20:00', label: 'Tidur', done: false }
  ],
  checklist: [
    { label: 'Membaca buku', done: false }
  ]
}

function getData(anakId) {
  if (!anakData.value[anakId]) {
    anakData.value[anakId] = JSON.parse(JSON.stringify(defaultDataByAnak[anakId] || defaultData))
  }
  return anakData.value[anakId]
}

const selectedAnak = computed(() => props.anakList.find(a => a.id === selectedAnakId.value))
const currentData = computed(() => getData(selectedAnakId.value))
const activeHafalan = computed(() => currentData.value.hafalan.filter(h => h.progress < 100))

const historyByCategory = computed(() => {
  const grouped = {}
  for (const h of currentData.value.hafalanHistory) {
    if (!grouped[h.category]) grouped[h.category] = []
    grouped[h.category].push(h)
  }
  return grouped
})

function getCategoryStyle(cat) {
  return categoryEmojis[cat] || categoryEmojis['Lainnya']
}

function closeAddHafalan() {
  showAddHafalan.value = false
  newHafalan.value = { category: '', title: '', desc: '', progress: 1 }
}

function addHafalan() {
  if (!newHafalan.value.category || !newHafalan.value.title.trim()) return
  const cat = categoryEmojis[newHafalan.value.category] || categoryEmojis['Lainnya']
  currentData.value.hafalan.push({
    id: Date.now(),
    title: newHafalan.value.title.trim(),
    desc: newHafalan.value.desc.trim() || '-',
    category: newHafalan.value.category,
    emoji: cat.emoji,
    bg: cat.bg,
    color: cat.color,
    progress: newHafalan.value.progress
  })
  closeAddHafalan()
}

watch(() => props.anakList, (list) => {
  if (list.length && !selectedAnakId.value) {
    selectedAnakId.value = list[list.length - 1].id
  }
}, { immediate: true })

watch(selectedAnakId, () => {
  showHistory.value = false
})
</script>
