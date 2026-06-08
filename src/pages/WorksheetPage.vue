<template>
  <div class="space-y-4">
    <!-- Header -->
    <!-- Search -->
    <div class="relative">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-base">search</span>
      <input v-model="searchQuery" type="text" placeholder="Cari worksheet..."
        class="w-full pl-9 pr-4 py-2.5 rounded-2xl border-2 border-[#B7D9BC] bg-white text-sm font-medium text-text-main placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors">
    </div>

    <!-- Age Filter -->
    <div class="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
      <button v-for="age in ageFilters" :key="age.value"
        @click="selectedAge = age.value"
        class="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 border-2"
        :class="selectedAge === age.value
          ? 'bg-primary text-on-primary border-primary'
          : 'bg-white text-on-surface-variant border-[#B7D9BC] hover:border-primary/30'">
        {{ age.label }}
      </button>
    </div>

    <!-- Worksheet Types Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="ws in filteredTypes" :key="ws.id"
        class="bg-canvas-cream rounded-[24px] border-4 border-[#B7D9BC] shadow-md p-4 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all active:scale-[0.98]"
        @click="ws.isApi ? generateFromApi(ws) : generateLocal(ws)">

        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-white shadow-sm mb-3"
          :style="{ background: ws.bg }">
          {{ ws.emoji }}
        </div>

        <h4 class="font-label-lg text-text-main mb-1 leading-tight">{{ ws.title }}</h4>
        <p class="text-[11px] text-on-surface-variant mb-2 line-clamp-2">{{ ws.desc }}</p>

        <div class="flex items-center gap-1">
          <span class="text-[10px] font-bold text-primary bg-success-soft px-2 py-0.5 rounded-full">
            {{ ws.ageLabel }}
          </span>
          <span v-if="ws.isApi" class="text-[10px] font-bold text-warm-bonding bg-warm-bonding/10 px-2 py-0.5 rounded-full">
            API
          </span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="generating" class="bg-canvas-cream rounded-[24px] p-6 border-4 border-dashed border-[#B7D9BC] text-center">
      <div class="text-3xl mb-2 animate-bounce">📝</div>
      <p class="text-sm text-on-surface-variant font-medium">Membuat worksheet...</p>
    </div>

    <!-- Saved Worksheets -->
    <div v-if="savedWorksheets.length" class="mt-2">
      <h4 class="text-xs font-bold text-primary uppercase tracking-wider mb-3">Worksheet Tersimpan</h4>
      <div class="space-y-2">
        <div v-for="ws in savedWorksheets" :key="ws.id"
          class="bg-canvas-cream rounded-[20px] border-2 border-[#B7D9BC] shadow-sm p-3 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-white shadow-sm"
            :style="{ background: ws.bg || '#E1F2E5' }">
            {{ ws.emoji || '📝' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-text-main truncate">{{ ws.title }}</p>
            <p class="text-[11px] text-on-surface-variant">{{ ws.childName }} · {{ ws.date }}</p>
          </div>
          <button @click.stop="downloadSaved(ws)"
            class="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-white active:scale-95 transition-all">
            <span class="material-symbols-outlined text-base">download</span>
          </button>
          <button @click.stop="removeSaved(ws.id)"
            class="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-error/30 text-error active:scale-95 transition-all">
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="activeTemplate" class="fixed inset-0 z-[100] bg-white overflow-y-auto">
    <MewarnaiAlfabet v-if="activeTemplate === 'mewarnai_alfabet'" ref="mewarnaiRef" @close="activeTemplate = null" />
    <MewarnaiAngka v-if="activeTemplate === 'mewarnai_angka'" ref="mewarnaiAngkaRef" @close="activeTemplate = null" />
    <MenulisHuruf v-if="activeTemplate === 'menulis_huruf'" ref="menulisHurufRef" @close="activeTemplate = null" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useToolsStore } from '../stores/toolsStore.js'
import { useAnakStore } from '../stores/anakStore.js'
import { generateWordSearch, generateMaze, generateDotToDot, generateBarChart, generateVerticalMath, generateFillBlanks, generateGeography } from '../utils/worksheetGenerator.js'
import MewarnaiAlfabet from './worksheet/MewarnaiAlfabet.vue'
import MewarnaiAngka from './worksheet/MewarnaiAngka.vue'
import MenulisHuruf from './worksheet/MenulisHuruf.vue'

const tools = useToolsStore()
const anakStore = useAnakStore()

const selectedAge = ref('all')
const searchQuery = ref('')
const generating = ref(false)
const activeTemplate = ref(null)
const mewarnaiRef = ref(null)
const mewarnaiAngkaRef = ref(null)
const menulisHurufRef = ref(null)

const childName = computed(() => {
  const a = anakStore.anakList.find(a => a.id === tools.toolsAnakId)
  return a ? a.nama : 'Anak'
})

const ageFilters = [
  { value: 'all', label: 'Semua' },
  { value: '1-3', label: '1-3 tahun' },
  { value: '3-5', label: '3-5 tahun' },
  { value: '4-7', label: '4-7 tahun' },
  { value: '6-9', label: '6-9 tahun' },
  { value: '7+', label: '7+ tahun' }
]

const worksheetTypes = [
  // === USIA 1-3 TAHUN ===
  { id: 'mewarnai_alfabet', emoji: '🖍️', title: 'Mewarnai Huruf', desc: 'Mewarnai huruf A-Z dengan krayon', age: '1-3', ageLabel: '1-3 thn', bg: '#E3F2FD', generate: generateMewarnaiAlfabet },
  { id: 'mewarnai_angka', emoji: '🔢', title: 'Mewarnai Angka', desc: 'Mewarnai angka 1-10', age: '1-3', ageLabel: '1-3 thn', bg: '#F3E5F5', generate: generateMewarnaiAngka },
  { id: 'menulis_huruf', emoji: '✍️', title: 'Menulis Huruf', desc: 'Latihan menulis huruf A-Z dengan panduan', age: '3-5', ageLabel: '3-5 thn', bg: '#E3F2FD', generate: generateMenulisHuruf },
  { id: 'tracing_huruf', emoji: '✍️', title: 'Mengikuti Garis Huruf', desc: 'Mengikuti garis putus-putus huruf', age: '1-3', ageLabel: '1-3 thn', bg: '#E8F5E9', generate: generateTracingHuruf },
  { id: 'tracing_angka', emoji: '✍️', title: 'Mengikuti Garis Angka', desc: 'Mengikuti garis putus-putus angka', age: '1-3', ageLabel: '1-3 thn', bg: '#FFF3E0', generate: generateTracingAngka },
  { id: 'garis_zigzag', emoji: '〰️', title: 'Garis Zig Zag', desc: 'Mengikuti garis zigzag dan lengkung', age: '1-3', ageLabel: '1-3 thn', bg: '#FCE4EC', generate: generateGarisZigzag },
  { id: 'cocokan_warna', emoji: '🎯', title: 'Cocokan Warna', desc: 'Mencocokkan warna yang sama', age: '1-3', ageLabel: '1-3 thn', bg: '#E0F2F1', generate: generateCocokanWarna },

  // === USIA 3-5 TAHUN ===
  { id: 'huruf_kapital', emoji: '🔤', title: 'Huruf Kapital A-Z', desc: 'Latihan menulis huruf kapital dari A sampai Z', age: '3-5', ageLabel: '3-5 thn', bg: '#E3F2FD', generate: generateAlfabet },
  { id: 'angka_1_10', emoji: '🔢', title: 'Angka 1-10', desc: 'Latihan menulis angka dari 1 sampai 10', age: '3-5', ageLabel: '3-5 thn', bg: '#F3E5F5', generate: generateAngka },
  { id: 'mewarnai_buah', emoji: '🍎', title: 'Mewarnai Buah', desc: 'Mewarnai gambar buah-buahan', age: '3-5', ageLabel: '3-5 thn', bg: '#FFF3E0', generate: generateMewarnaiBuah },
  { id: 'mewarnai_hewan', emoji: '🐱', title: 'Mewarnai Hewan', desc: 'Mewarnai gambar hewan', age: '3-5', ageLabel: '3-5 thn', bg: '#E8F5E9', generate: generateMewarnaiHewan },
  { id: 'mengenal_warna', emoji: '🎨', title: 'Mengenal Warna', desc: 'Mengenal dan mencocokkan warna dasar', age: '3-5', ageLabel: '3-5 thn', bg: '#FCE4EC', generate: generateWarna },
  { id: 'mengenal_bentuk', emoji: '⬜', title: 'Mengenal Bentuk', desc: 'Mengenal bentuk dasar: lingkaran, segitiga, persegi', age: '3-5', ageLabel: '3-5 thn', bg: '#E0F2F1', generate: generateBentuk },

  // === USIA 4-7 TAHUN ===
  { id: 'penjumlahan', emoji: '➕', title: 'Penjumlahan 1-10', desc: 'Latihan penjumlahan angka 1-10', age: '4-7', ageLabel: '4-7 thn', bg: '#E8F5E9', generate: generatePenjumlahan },
  { id: 'pengurangan', emoji: '➖', title: 'Pengurangan 1-10', desc: 'Latihan pengurangan angka 1-10', age: '4-7', ageLabel: '4-7 thn', bg: '#E3F2FD', generate: generatePengurangan },
  { id: 'menyalin_kata', emoji: '✏️', title: 'Menyalin Kata', desc: 'Menyalin kata-kata sederhana', age: '4-7', ageLabel: '4-7 thn', bg: '#FFF3E0', generate: generateMenyalinKata },
  { id: 'pasangan_benda', emoji: '🔗', title: 'Pasangan Benda', desc: 'Mencocokkan benda dengan fungsinya', age: '4-7', ageLabel: '4-7 thn', bg: '#F3E5F5', generate: generatePasanganBenda },

  // === USIA 6-9 TAHUN ===
  { id: 'perkalian', emoji: '✖️', title: 'Perkalian 1-5', desc: 'Latihan perkalian tabel 1-5', age: '6-9', ageLabel: '6-9 thn', bg: '#E8F5E9', generate: generatePerkalian },
  { id: 'pembagian', emoji: '➗', title: 'Pembagian 1-10', desc: 'Latihan pembagian sederhana', age: '6-9', ageLabel: '6-9 thn', bg: '#E3F2FD', generate: generatePembagian },
  { id: 'menyalin_kalimat', emoji: '📝', title: 'Menyalin Kalimat', desc: 'Menyalin kalimat pendek dengan benar', age: '6-9', ageLabel: '6-9 thn', bg: '#FFF3E0', isApi: true, generate: generateQuotes },
  { id: 'isi_kata', emoji: '💬', title: 'Melengkapi Kata', desc: 'Melengkapi kata yang hilang', age: '6-9', ageLabel: '6-9 thn', bg: '#FCE4EC', generate: generateIsiKata },

  // === USIA 7+ TAHUN ===
  { id: 'cerita_pendek', emoji: '📖', title: 'Menulis Cerita', desc: 'Menulis cerita pendek dari gambar', age: '7+', ageLabel: '7+ thn', bg: '#E8F5E9', generate: generateMenulisCerita },
  { id: 'rangkuman_buku', emoji: '📚', title: 'Rangkuman Buku', desc: 'Membuat rangkuman dari buku acak', age: '7+', ageLabel: '7+ thn', bg: '#E3F2FD', isApi: true, generate: generateBuku },
  { id: 'soal_cerita', emoji: '🧮', title: 'Soal Cerita Matematika', desc: 'Menyelesaikan soal cerita matematika', age: '7+', ageLabel: '7+ thn', bg: '#F3E5F5', generate: generateSoalCerita },
  { id: 'benda_sekitar', emoji: '🏠', title: 'Benda di Sekitar', desc: 'Mengenal dan menulis nama benda sekitar', age: '7+', ageLabel: '7+ thn', bg: '#FFF3E0', generate: generateBendaSekitar },

  // === NEW: MATH WITH ICONS & VISUAL ===
  { id: 'math_icons', emoji: '⭐', title: 'Berhitung dengan Ikon', desc: 'Penjumlahan & pengurangan dengan gambar bintang', age: '4-7', ageLabel: '4-7 thn', bg: '#E8F5E9', generate: generateMathIcons },
  { id: 'grafik_batang', emoji: '📊', title: 'Grafik Batang', desc: 'Membaca dan menjawab pertanyaan dari grafik batang', age: '6-9', ageLabel: '6-9 thn', bg: '#E3F2FD', generate: generateGrafikBatang },

  // === NEW: BAHASA & KOSAKATA ===
  { id: 'word_search', emoji: '🔍', title: 'Mencari Kata', desc: 'Temukan kata tersembunyi dalam kotak huruf', age: '6-9', ageLabel: '6-9 thn', bg: '#FFF3E0', generate: generateWordSearchWs },
  { id: 'fill_blanks', emoji: '✏️', title: 'Lengkapi Huruf', desc: 'Isi huruf yang hilang dalam kata', age: '4-7', ageLabel: '4-7 thn', bg: '#FCE4EC', generate: generateFillBlanksWs },

  // === NEW: LOGIKA VISUAL & MOTORIK ===
  { id: 'dot_to_dot', emoji: '🔗', title: 'Hubungkan Titik', desc: 'Hubungkan titik berurutan untuk membentuk gambar', age: '4-7', ageLabel: '4-7 thn', bg: '#E0F2F1', generate: generateDotToDotWs },
  { id: 'maze', emoji: '🏁', title: 'Labirin', desc: 'Temukan jalan keluar dari labirin', age: '6-9', ageLabel: '6-9 thn', bg: '#F3E5F5', generate: generateMazeWs },

  // === NEW: GEOGRAFI ===
  { id: 'geografi', emoji: '🗺️', title: 'Geografi Indonesia', desc: 'Mencocokkan kota dengan provinsi', age: '7+', ageLabel: '7+ thn', bg: '#E3F2FD', generate: generateGeografiWs }
]

const filteredTypes = computed(() => {
  let list = worksheetTypes
  if (selectedAge.value !== 'all') {
    list = list.filter(ws => ws.age === selectedAge.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(ws => ws.title.toLowerCase().includes(q) || ws.desc.toLowerCase().includes(q))
  }
  return list
})

const savedWorksheets = computed(() => tools.toolsData.worksheets || [])

function todayStr() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function saveAndDownload(ws, data) {
  const entry = {
    title: ws.title,
    emoji: ws.emoji,
    bg: ws.bg,
    childName: childName.value,
    date: todayStr(),
    createdAt: new Date().toISOString(),
    ...data
  }
  tools.addWorksheet(entry)
}

async function generateLocal(ws) {
  generating.value = true
  try {
    const data = ws.generate()
    if (data.type === 'mewarnai_alfabet') {
      activeTemplate.value = 'mewarnai_alfabet'
    } else if (data.type === 'mewarnai_angka') {
      activeTemplate.value = 'mewarnai_angka'
    } else if (data.type === 'menulis_huruf') {
      activeTemplate.value = 'menulis_huruf'
    } else if (data.pdf) {
      data.pdf()
    } else {
      saveAndDownload(ws, data)
      downloadPDF(data, ws.title)
    }
  } catch (e) {
    console.error(e)
    alert('Gagal membuat worksheet.')
  } finally {
    generating.value = false
  }
}

async function generateFromApi(ws) {
  generating.value = true
  try {
    const data = await ws.generate()
    if (data && data.quotes) {
      saveAndDownload(ws, data)
      downloadPDF(data, ws.title)
    }
  } catch (e) {
    alert('Gagal mengambil data dari server.')
  } finally {
    generating.value = false
  }
}

function downloadSaved(ws) {
  downloadPDF(ws, ws.title)
}

function removeSaved(id) {
  tools.removeWorksheetItem(id)
}

// ============================================
// GENERATOR FUNCTIONS
// ============================================

const blockedKeywords = ['cinta', 'cintai', 'mencintai', 'dicintai', 'kasih', 'sayang', 'kekasih', 'pacar', 'rindu']

// -- ALFABET (3-5) --
function generateAlfabet() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  return {
    type: 'alfabet',
    title: 'Huruf Kapital A-Z',
    emoji: '🔤', bg: '#E3F2FD',
    items: letters.map(l => ({ letter: l }))
  }
}

// ============================================
// USIA 1-3 TAHUN GENERATORS
// ============================================

// -- MEWARNAI ALFABET (1-3) --
function generateMewarnaiAlfabet() {
  const letters = 'ABCDEFGHIJKLM'.split('')
  return { type: 'mewarnai_alfabet', title: 'Mewarnai Alfabet', emoji: '🖍️', bg: '#E3F2FD', items: letters.map(l => ({ letter: l })) }
}

// -- MEWARNAI ANGKA (1-3) --
function generateMewarnaiAngka() {
  const nums = Array.from({ length: 10 }, (_, i) => i + 1)
  return { type: 'mewarnai_angka', title: 'Mewarnai Angka', emoji: '🔢', bg: '#F3E5F5', items: nums.map(n => ({ number: n })) }
}

// -- MENULIS HURUF (1-3) --
function generateMenulisHuruf() {
  return { type: 'menulis_huruf', title: 'Menulis Huruf A-Z', emoji: '✍️', bg: '#E3F2FD', items: [] }
}

// -- TRACING HURUF (1-3) --
function generateTracingHuruf() {
  const letters = 'ABCDEFGHIJKL'.split('')
  return { type: 'tracing', subtype: 'huruf', title: 'Mengikuti Garis Huruf', emoji: '✍️', bg: '#E8F5E9', items: letters.map(l => ({ value: l })) }
}

// -- TRACING ANGKA (1-3) --
function generateTracingAngka() {
  const nums = Array.from({ length: 10 }, (_, i) => i + 1)
  return { type: 'tracing', subtype: 'angka', title: 'Mengikuti Garis Angka', emoji: '✍️', bg: '#FFF3E0', items: nums.map(n => ({ value: String(n) })) }
}

// -- GARIS ZIGZAG (1-3) --
function generateGarisZigzag() {
  const patterns = [
    { name: 'Zig Zag', type: 'zigzag' },
    { name: 'Gelombang', type: 'wave' },
    { name: 'Spiral', type: 'spiral' },
    { name: 'Garis Lurus', type: 'straight' },
    { name: 'Garis Putus', type: 'dashed' }
  ]
  return { type: 'garis_motorik', title: 'Garis Zig Zag', emoji: '〰️', bg: '#FCE4EC', items: patterns }
}

// -- COCOKAN WARNA (1-3) --
function generateCocokanWarna() {
  const colors = [
    { name: 'Merah', hex: '#E53935', emoji: '🔴' },
    { name: 'Biru', hex: '#1E88E5', emoji: '🔵' },
    { name: 'Kuning', hex: '#FDD835', emoji: '🟡' },
    { name: 'Hijau', hex: '#43A047', emoji: '🟢' },
    { name: 'Oranye', hex: '#FB8C00', emoji: '🟠' },
    { name: 'Ungu', hex: '#8E24AA', emoji: '🟣' }
  ]
  return { type: 'cocokan_warna', title: 'Cocokan Warna', emoji: '🎯', bg: '#E0F2F1', items: colors }
}

// -- ANGKA (3-5) --
function generateAngka() {
  const nums = Array.from({ length: 10 }, (_, i) => i + 1)
  return {
    type: 'angka',
    title: 'Angka 1-10',
    emoji: '🔢', bg: '#F3E5F5',
    items: nums.map(n => ({ number: n, word: ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'][n] }))
  }
}

// -- MEWARNAI BUAH (3-5) --
function generateMewarnaiBuah() {
  const buah = [
    { name: 'Apel', emoji: '🍎' }, { name: 'Pisang', emoji: '🍌' }, { name: 'Anggur', emoji: '🍇' },
    { name: 'Semangka', emoji: '🍉' }, { name: 'Jeruk', emoji: '🍊' }, { name: 'Stroberi', emoji: '🍓' }
  ]
  return {
    type: 'mewarnai',
    title: 'Mewarnai Buah',
    emoji: '🍎', bg: '#FFF3E0',
    items: buah
  }
}

// -- MEWARNAI HEWAN (3-5) --
function generateMewarnaiHewan() {
  const hewan = [
    { name: 'Kucing', emoji: '🐱' }, { name: 'Anjing', emoji: '🐶' }, { name: 'Kelinci', emoji: '🐰' },
    { name: 'Ikan', emoji: '🐟' }, { name: 'Burung', emoji: '🐦' }, { name: 'Kupu-kupu', emoji: '🦋' }
  ]
  return {
    type: 'mewarnai',
    title: 'Mewarnai Hewan',
    emoji: '🐱', bg: '#E8F5E9',
    items: hewan
  }
}

// -- WARNA (3-5) --
function generateWarna() {
  const warna = [
    { name: 'Merah', hex: '#E53935' }, { name: 'Biru', hex: '#1E88E5' }, { name: 'Kuning', hex: '#FDD835' },
    { name: 'Hijau', hex: '#43A047' }, { name: 'Oranye', hex: '#FB8C00' }, { name: 'Ungu', hex: '#8E24AA' }
  ]
  return { type: 'warna', title: 'Mengenal Warna', emoji: '🎨', bg: '#FCE4EC', items: warna }
}

// -- BENTUK (3-5) --
function generateBentuk() {
  const bentuk = [
    { name: 'Lingkaran', shape: 'circle' }, { name: 'Persegi', shape: 'square' },
    { name: 'Segitiga', shape: 'triangle' }, { name: 'Hati', shape: 'heart' }
  ]
  return { type: 'bentuk', title: 'Mengenal Bentuk', emoji: '⬜', bg: '#E0F2F1', items: bentuk }
}

// -- PENJUMLAHAN (4-7) --
function generatePenjumlahan() {
  const soal = []
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * (11 - a))
    soal.push({ a, b, op: '+', jawaban: a + b })
  }
  return { type: 'math', title: 'Penjumlahan 1-10', emoji: '➕', bg: '#E8F5E9', items: soal }
}

// -- PENGURANGAN (4-7) --
function generatePengurangan() {
  const soal = []
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * a)
    soal.push({ a, b, op: '-', jawaban: a - b })
  }
  return { type: 'math', title: 'Pengurangan 1-10', emoji: '➖', bg: '#E3F2FD', items: soal }
}

// -- PERKALIAN (6-9) --
function generatePerkalian() {
  const soal = []
  for (let a = 1; a <= 5; a++) {
    for (let b = 1; b <= 5; b++) {
      soal.push({ a, b, op: '×', jawaban: a * b })
    }
  }
  return { type: 'math', title: 'Perkalian 1-5', emoji: '✖️', bg: '#E8F5E9', items: soal.slice(0, 15) }
}

// -- PEMBAGIAN (6-9) --
function generatePembagian() {
  const soal = []
  for (let i = 0; i < 10; i++) {
    const b = Math.floor(Math.random() * 5) + 1
    const jawaban = Math.floor(Math.random() * 5) + 1
    const a = b * jawaban
    soal.push({ a, b, op: '÷', jawaban })
  }
  return { type: 'math', title: 'Pembagian 1-10', emoji: '➗', bg: '#E3F2FD', items: soal }
}

// -- MENYALIN KATA (4-7) --
function generateMenyalinKata() {
  const kata = ['Ibu', 'Ayah', 'Rumah', 'Buku', 'Kucing', 'Bunga', 'Matahari', 'Bintang', 'Gajah', 'Pohon']
  return { type: 'salin', title: 'Menyalin Kata', emoji: '✏️', bg: '#FFF3E0', items: kata }
}

// -- PASANGAN BENDA (4-7) --
function generatePasanganBenda() {
  const pasangan = [
    { benda: 'Pensil', fungsi: 'Menulis' }, { benda: 'Sendok', fungsi: 'Makan' },
    { benda: 'Sepatu', fungsi: 'Berjalan' }, { benda: 'Payung', fungsi: 'Hujan' },
    { benda: 'Sikat gigi', fungsi: 'Gigi bersih' }, { benda: 'Bantal', fungsi: 'Tidur' }
  ]
  return { type: 'pasangan', title: 'Pasangan Benda', emoji: '🔗', bg: '#F3E5F5', items: pasangan }
}

// -- MELENGKAPI KATA (6-9) --
function generateIsiKata() {
  const soal = [
    { kata: 'M_ta Hari', jawaban: 'a', clue: 'Bulan kedua' },
    { kata: 'R_mah S_kolah', jawaban: 'u,a', clue: 'Tempat belajar' },
    { kata: 'B_ngsa Ind_nesia', jawaban: 'a,u', clue: 'Negara kita' },
    { kata: 'K_ncing Put_h', jawaban: 'a,i', clue: 'Hewan berbulu' },
    { kata: 'G_las B_sar', jawaban: 'a,e', clue: 'Ukuran besar' }
  ]
  return { type: 'isi_kata', title: 'Melengkapi Kata', emoji: '💬', bg: '#FCE4EC', items: soal }
}

// -- MENULIS CERITA (7+) --
function generateMenulisCerita() {
  const prompts = [
    { judul: 'Hari di Pantai', prompt: 'Ceritakan pengalamanmu di pantai. Apa yang kamu lihat, dengar, dan rasakan?' },
    { judul: 'Hewan Peliharaan', prompt: 'Ceritakan tentang hewan peliharaanmu atau hewan yang ingin kamu pelihara.' },
    { judul: 'Petualangan di Hutan', prompt: 'Bayangkan kamu tersesat di hutan. Apa yang terjadi?' }
  ]
  const picked = prompts[Math.floor(Math.random() * prompts.length)]
  return { type: 'cerita', title: 'Menulis Cerita', emoji: '📖', bg: '#E8F5E9', items: [picked] }
}

// -- BENDA SEKITAR (7+) --
function generateBendaSekitar() {
  const benda = [
    { name: 'Meja', emoji: '🪑', desc: 'Tempat menulis dan makan' },
    { name: 'Lemari', emoji: '🗄️', desc: 'Menyimpan pakaian' },
    { name: 'Jam', emoji: '🕐', desc: 'Menunjukkan waktu' },
    { name: 'Kaca', emoji: '🪞', desc: 'Melihat pantulan' },
    { name: 'Sepatu', emoji: '👟', desc: 'Melindungi kaki' },
    { name: 'Tas', emoji: '🎒', desc: 'Menyimpan barang' }
  ]
  return { type: 'benda', title: 'Benda di Sekitar', emoji: '🏠', bg: '#FFF3E0', items: benda }
}

// -- SOAL CERITA MATH (7+) --
function generateSoalCerita() {
  const soal = [
    { cerita: 'Andi punya 5 permen. Ibu memberinya 3 lagi. Berapa permen Andi sekarang?', jawaban: '8 permen (5 + 3 = 8)' },
    { cerita: 'Siti punya 10 kelereng. Ia memberikan 4 ke temannya. Berapa sisa kelereng Siti?', jawaban: '6 kelereng (10 - 4 = 6)' },
    { cerita: 'Ada 3 kotak. Setiap kotak berisi 4 buah apel. Berapa jumlah apel semuanya?', jawaban: '12 apel (3 × 4 = 12)' }
  ]
  return { type: 'soal_cerita', title: 'Soal Cerita Matematika', emoji: '🧮', bg: '#F3E5F5', items: soal }
}

// -- QUOTES API (6-9) --
async function generateQuotes() {
  const res = await fetch('/api/quotes?page=1&limit=20')
  const data = await res.json()
  if (data.status !== 'SUCCESS') return null
  const clean = data.data.filter(q => {
    const t = (q.text + ' ' + q.author + ' ' + q.category).toLowerCase()
    return !blockedKeywords.some(kw => t.includes(kw))
  }).slice(0, 3)
  return { type: 'quotes', title: 'Menyalin Kalimat Inspiratif', emoji: '📝', bg: '#FFF3E0', quotes: clean }
}

// -- BUKU API (7+) --
async function generateBuku() {
  const res = await fetch('/api/bukuacak')
  const data = await res.json()
  if (!data || !data.title) return null
  return {
    type: 'buku',
    title: 'Rangkuman Buku',
    emoji: '📚', bg: '#E3F2FD',
    book: { title: data.title, author: data.author, synopsis: data.synopsis || data.description || 'Baca buku ini dan buat rangkumanmu sendiri.' }
  }
}

// -- MATH WITH ICONS (4-7) --
function generateMathIcons() {
  const data = generateVerticalMath('addition', 'easy')
  return { type: 'math_icons', title: 'Berhitung dengan Ikon', emoji: '⭐', bg: '#E8F5E9', ...data }
}

// -- GRAFIK BATANG (6-9) --
function generateGrafikBatang() {
  const data = generateBarChart()
  return { type: 'grafik_batang', title: 'Grafik Batang', emoji: '📊', bg: '#E3F2FD', ...data }
}

// -- WORD SEARCH (6-9) --
function generateWordSearchWs() {
  const themes = {
    hewan: ['SAPI', 'AYAM', 'IKAN', 'KUCING', 'ANJING'],
    buah: ['APEL', 'PISANG', 'JERUK', 'MANGGA', 'ANGGUR'],
    warna: ['MERAH', 'BIRU', 'HIJAU', 'KUNING', 'PUTIH']
  }
  const keys = Object.keys(themes)
  const theme = keys[Math.floor(Math.random() * keys.length)]
  const words = themes[theme]
  const data = generateWordSearch(words, 10)
  return { type: 'word_search', title: `Mencari Kata: ${theme}`, emoji: '🔍', bg: '#FFF3E0', theme, ...data }
}

// -- FILL BLANKS (4-7) --
function generateFillBlanksWs() {
  const data = generateFillBlanks()
  return { type: 'fill_blanks', title: `Lengkapi Huruf: ${data.theme}`, emoji: '✏️', bg: '#FCE4EC', ...data }
}

// -- DOT-TO-DOT (4-7) --
function generateDotToDotWs() {
  const data = generateDotToDot()
  return { type: 'dot_to_dot', title: 'Hubungkan Titik', emoji: '🔗', bg: '#E0F2F1', ...data }
}

// -- MAZE (6-9) --
function generateMazeWs() {
  const data = generateMaze(8, 8)
  return { type: 'maze', title: 'Labirin', emoji: '🏁', bg: '#F3E5F5', ...data }
}

// -- GEOGRAFI (7+) --
function generateGeografiWs() {
  const data = generateGeography()
  return { type: 'geografi', title: 'Geografi Indonesia', emoji: '🗺️', bg: '#E3F2FD', ...data }
}

// ============================================
// PDF GENERATOR
// ============================================

function downloadPDF(data, title) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const W = 210, H = 297, M = 20, CW = W - M * 2

  function drawBorder() {
    doc.setDrawColor(183, 217, 188)
    doc.setLineWidth(1.5)
    doc.roundedRect(10, 10, W - 20, H - 20, 4, 4)
    doc.setLineWidth(0.5)
    doc.roundedRect(14, 14, W - 28, H - 28, 3, 3)
  }

  function drawHeader(y) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(23, 108, 51)
    doc.text(title, W / 2, y, { align: 'center' })
    y += 8

    // Name & Date box
    doc.setDrawColor(183, 217, 188)
    doc.setLineWidth(0.3)
    doc.roundedRect(M, y, CW / 2 - 2, 10, 2, 2)
    doc.setFontSize(9)
    doc.setTextColor(23, 108, 51)
    doc.text('Nama:', M + 3, y + 7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(childName.value, M + 17, y + 7)

    doc.setDrawColor(183, 217, 188)
    doc.roundedRect(M + CW / 2 + 2, y, CW / 2 - 2, 10, 2, 2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(23, 108, 51)
    doc.text('Tgl:', M + CW / 2 + 5, y + 7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(todayStr(), M + CW / 2 + 14, y + 7)

    return y + 16
  }

  // ============ MEWARNAI ALFABET (1-3) ============
  if (data.type === 'mewarnai_alfabet') {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    for (let i = 0; i < letters.length; i++) {
      if (i > 0) doc.addPage()
      drawBorder()

      // Top: 2 columns - Title | Nama
      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.5)

      // Left box - Title
      doc.roundedRect(M, 16, CW / 2 - 2, 18, 3, 3)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(23, 108, 51)
      doc.text(`Mewarnai Huruf ${letters[i]}`, M + CW / 4 - 1, 28, { align: 'center' })

      // Right box - Nama (empty)
      doc.roundedRect(M + CW / 2 + 2, 16, CW / 2 - 2, 18, 3, 3)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(23, 108, 51)
      doc.text('Nama:', M + CW / 2 + 8, 28)

      // Page number
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`${i + 1} / 26`, W / 2, H - 16, { align: 'center' })

      // Giant letter centered in page
      const topY = 38
      const bottomY = H - 24
      const availableH = bottomY - topY
      const fontSize = Math.floor(availableH / 0.3528 * 0.82)
      const centerY = topY + availableH / 2

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(fontSize)
      doc.setTextColor(255, 255, 255)
      doc.setDrawColor(40, 40, 40)
      doc.setLineWidth(1.5)
      doc.text(letters[i], W / 2, centerY + fontSize * 0.28, { align: 'center', renderingMode: 1 })
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_MewarnaiAlfabet_A-Z.pdf`)
    return
  }

  // ============ MEWARNAI ANGKA (1-3) ============
  if (data.type === 'mewarnai_angka') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Warnai angka-angka berikut:', M, y)
    y += 12

    const cols = 5
    const cellW = CW / cols
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * cellW
      const ly = y + row * 30

      if (ly > H - 45) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.5)
      doc.roundedRect(x + 3, ly, cellW - 6, 25, 3, 3)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(23, 108, 51)
      doc.text(String(data.items[i].number), x + cellW / 2, ly + 17, { align: 'center' })
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_MewarnaiAngka.pdf`)
    return
  }

  // ============ TRACING HURUF/ANGKA (1-3) ============
  if (data.type === 'tracing') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(`Ikuti garis putus-putus untuk menulis ${data.subtype}:`, M, y)
    y += 12

    const cols = 4
    const cellW = CW / cols
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * cellW
      const ly = y + row * 35

      if (ly > H - 50) { doc.addPage(); drawBorder(); y = 30 }

      // Guide character (light gray)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(28)
      doc.setTextColor(220, 220, 220)
      doc.text(data.items[i].value, x + cellW / 2, ly + 18, { align: 'center' })

      // Dotted outline
      doc.setFontSize(28)
      doc.setTextColor(23, 108, 51)
      doc.setDrawColor(23, 108, 51)
      doc.setLineDashPattern([1, 2], 0)
      doc.setLineWidth(0.4)
      // Draw dotted text by rendering it multiple times with slight offsets
      doc.text(data.items[i].value, x + cellW / 2, ly + 18, { align: 'center' })
      doc.setLineDashPattern([], 0)

      // Practice line below
      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([2, 2], 0)
      doc.setLineWidth(0.3)
      doc.line(x + 5, ly + 26, x + cellW - 5, ly + 26)
      doc.setLineDashPattern([], 0)
    }

    const fileName = data.subtype === 'huruf' ? 'TracingHuruf' : 'TracingAngka'
    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_${fileName}.pdf`)
    return
  }

  // ============ GARIS MOTORIK / ZIGZAG (1-3) ============
  if (data.type === 'garis_motorik') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Ikuti garis-garis berikut dengan pensil:', M, y)
    y += 12

    const patterns = [
      { name: 'Garis Lurus', draw: (x, y, w) => { doc.line(x, y + 10, x + w, y + 10) } },
      { name: 'Zig Zag', draw: (x, y, w) => {
        const segs = 8; const segW = w / segs; const amp = 8
        for (let i = 0; i < segs; i++) {
          const x1 = x + i * segW
          const y1 = y + 10 + (i % 2 === 0 ? -amp : amp)
          const x2 = x + (i + 1) * segW
          const y2 = y + 10 + ((i + 1) % 2 === 0 ? -amp : amp)
          doc.line(x1, y1, x2, y2)
        }
      }},
      { name: 'Gelombang', draw: (x, y, w) => {
        const steps = 20; const amp = 6
        for (let i = 0; i < steps; i++) {
          const x1 = x + (i / steps) * w
          const y1 = y + 10 + Math.sin(i * Math.PI * 2 / steps * 3) * amp
          const x2 = x + ((i + 1) / steps) * w
          const y2 = y + 10 + Math.sin((i + 1) * Math.PI * 2 / steps * 3) * amp
          doc.line(x1, y1, x2, y2)
        }
      }},
      { name: 'Garis Putus-putus', draw: (x, y, w) => {
        doc.setLineDashPattern([4, 3], 0)
        doc.line(x, y + 10, x + w, y + 10)
        doc.setLineDashPattern([], 0)
      }},
      { name: 'Garis Lengkung S', draw: (x, y, w) => {
        const steps = 20; const amp = 8
        for (let i = 0; i < steps; i++) {
          const t1 = i / steps
          const t2 = (i + 1) / steps
          doc.line(
            x + t1 * w, y + 10 + Math.sin(t1 * Math.PI * 2) * amp,
            x + t2 * w, y + 10 + Math.sin(t2 * Math.PI * 2) * amp
          )
        }
      }}
    ]

    for (let i = 0; i < patterns.length; i++) {
      if (y > H - 50) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.roundedRect(M, y - 3, CW, 28, 3, 3)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(patterns[i].name, M + 3, y + 3)

      // Dotted pattern to follow
      doc.setDrawColor(23, 108, 51)
      doc.setLineDashPattern([2, 2], 0)
      doc.setLineWidth(0.5)
      patterns[i].draw(M + 5, y + 2, CW - 10)
      doc.setLineDashPattern([], 0)

      // Blank practice line
      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([1, 3], 0)
      doc.setLineWidth(0.3)
      doc.line(M + 5, y + 20, M + CW - 5, y + 20)
      doc.setLineDashPattern([], 0)

      y += 35
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_GarisZigzag.pdf`)
    return
  }

  // ============ COCOKAN WARNA (1-3) ============
  if (data.type === 'cocokan_warna') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Warnai dan cocokkan warna yang sama:', M, y)
    y += 12

    const leftColors = [...data.items].sort(() => Math.random() - 0.5)
    const rightColors = [...data.items].sort(() => Math.random() - 0.5)
    const leftX = M + 10
    const rightX = M + CW / 2 + 20
    const boxW = CW / 2 - 30

    for (let i = 0; i < data.items.length; i++) {
      if (y > H - 45) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.5)

      // Left circle
      doc.setFillColor(245, 245, 245)
      doc.circle(leftX + 15, y + 10, 10, 'FD')
      doc.setFontSize(18)
      doc.text(leftColors[i].emoji, leftX + 15, y + 13, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text(leftColors[i].name, leftX + 30, y + 13)

      // Arrow area
      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([2, 2], 0)
      doc.line(leftX + boxW, y + 10, rightX - 10, y + 10)
      doc.setLineDashPattern([], 0)

      // Right circle
      doc.setFillColor(245, 245, 245)
      doc.circle(rightX + 15, y + 10, 10, 'FD')
      doc.setFontSize(18)
      doc.text(rightColors[i].emoji, rightX + 15, y + 13, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(rightColors[i].name, rightX + 30, y + 13)

      y += 28
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_CocokanWarna.pdf`)
    return
  }

  // ============ MATH (penjumlahan, pengurangan, perkalian, pembagian) ============
  if (data.type === 'math') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Kerjakan soal berikut:', M, y)
    y += 10

    const cols = 2
    const colW = CW / cols - 5
    const items = data.items

    for (let i = 0; i < items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (colW + 10)
      const ly = y + row * 18

      if (ly > H - 35) { doc.addPage(); drawBorder(); y = 30; }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.roundedRect(x, ly - 4, colW, 14, 2, 2)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(60, 60, 60)
      doc.text(`${i + 1}.`, x + 3, ly + 6)
      doc.text(`${items[i].a} ${items[i].op} ${items[i].b} =`, x + 12, ly + 6)

      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([], 0)
      doc.line(x + colW - 20, ly + 8, x + colW - 3, ly + 8)
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_${data.title.replace(/\s+/g, '_')}.pdf`)
    return
  }

  // ============ ALFABET ============
  if (data.type === 'alfabet') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Tulis huruf berikut pada garis:', M, y)
    y += 10

    const cols = 4
    const cellW = CW / cols
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * cellW
      const ly = y + row * 28

      if (ly > H - 40) { doc.addPage(); drawBorder(); y = 30 }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(23, 108, 51)
      doc.text(data.items[i].letter, x + cellW / 2, ly + 4, { align: 'center' })

      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([2, 2], 0)
      doc.setLineWidth(0.3)
      doc.line(x + 5, ly + 10, x + cellW - 5, ly + 10)
      doc.line(x + 5, ly + 14, x + cellW - 5, ly + 14)
      doc.line(x + 5, ly + 18, x + cellW - 5, ly + 18)
      doc.setLineDashPattern([], 0)
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Alfabet.pdf`)
    return
  }

  // ============ ANGKA ============
  if (data.type === 'angka') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Tulis angka dan kata:', M, y)
    y += 10

    const cols = 2
    const cellW = CW / cols - 5
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (cellW + 10)
      const ly = y + row * 24

      if (ly > H - 40) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.roundedRect(x, ly - 3, cellW, 20, 2, 2)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(23, 108, 51)
      doc.text(String(data.items[i].number), x + 8, ly + 8)
      doc.text('→', x + 18, ly + 8)
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`(${data.items[i].word})`, x + 28, ly + 8)

      doc.setLineDashPattern([2, 2], 0)
      doc.line(x + 5, ly + 14, x + cellW - 5, ly + 14)
      doc.setLineDashPattern([], 0)
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Angka.pdf`)
    return
  }

  // ============ MENYALIN KATA ============
  if (data.type === 'salin') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Salin kata berikut pada garis:', M, y)
    y += 10

    for (let i = 0; i < data.items.length; i++) {
      if (y > H - 40) { doc.addPage(); drawBorder(); y = 30 }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(23, 108, 51)
      doc.text(`${i + 1}. ${data.items[i]}`, M, y + 5)

      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([2, 2], 0)
      doc.setLineWidth(0.3)
      doc.line(M, y + 10, M + CW, y + 10)
      doc.line(M, y + 14, M + CW, y + 14)
      doc.setLineDashPattern([], 0)

      y += 22
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_MenyalinKata.pdf`)
    return
  }

  // ============ PASANGAN BENDA ============
  if (data.type === 'pasangan') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Gambarkan garis untuk mencocokkan:', M, y)
    y += 12

    for (let i = 0; i < data.items.length; i++) {
      if (y > H - 40) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)

      // Left box
      doc.roundedRect(M, y, CW / 2 - 10, 14, 2, 2)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      doc.text(data.items[i].benda, M + CW / 4 - 5, y + 9, { align: 'center' })

      // Right box
      doc.roundedRect(M + CW / 2 + 10, y, CW / 2 - 10, 14, 2, 2)
      // Shuffle right side
      const shuffled = [...data.items].sort(() => Math.random() - 0.5)
      doc.text(shuffled[i].fungsi, M + CW * 3 / 4 + 5, y + 9, { align: 'center' })

      y += 20
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Pasangan.pdf`)
    return
  }

  // ============ WARNA ============
  if (data.type === 'warna') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Warnai kotak dan tulis namanya:', M, y)
    y += 12

    const cols = 3
    const cellW = CW / cols - 5
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (cellW + 8)
      const ly = y + row * 35

      if (ly > H - 50) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.5)
      doc.roundedRect(x, ly, cellW, 20, 2, 2)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text(data.items[i].name, x + cellW / 2, ly + 28, { align: 'center' })
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Warna.pdf`)
    return
  }

  // ============ BENTUK ============
  if (data.type === 'bentuk') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Gambar bentuk berikut dan tulis namanya:', M, y)
    y += 15

    const cols = 2
    const cellW = CW / cols - 5
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (cellW + 10)
      const ly = y + row * 40

      if (ly > H - 55) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.5)
      doc.roundedRect(x, ly, cellW, 30, 3, 3)

      const cx = x + cellW / 2
      const cy = ly + 12
      doc.setLineWidth(0.8)
      if (data.items[i].shape === 'circle') doc.circle(cx, cy, 8, 'S')
      else if (data.items[i].shape === 'square') doc.rect(cx - 8, cy - 8, 16, 16, 'S')
      else if (data.items[i].shape === 'triangle') doc.lines([[0, -10], [10, 10], [-10, 10], [0, -10]], cx, cy + 5, [1, 1], 'S')

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(60, 60, 60)
      doc.text(data.items[i].name, x + cellW / 2, ly + 27, { align: 'center' })
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Bentuk.pdf`)
    return
  }

  // ============ MEWARNAI (emoji grid) ============
  if (data.type === 'mewarnai') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Warnai gambar di bawah ini:', M, y)
    y += 12

    const cols = 3
    const cellW = CW / cols - 5
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (cellW + 8)
      const ly = y + row * 45

      if (ly > H - 60) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.5)
      doc.roundedRect(x, ly, cellW, 35, 3, 3)

      doc.setFontSize(28)
      doc.text(data.items[i].emoji, x + cellW / 2, ly + 20, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(60, 60, 60)
      doc.text(data.items[i].name, x + cellW / 2, ly + 32, { align: 'center' })
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_${data.title.replace(/\s+/g, '_')}.pdf`)
    return
  }

  // ============ ISI KATA ============
  if (data.type === 'isi_kata') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Lengkapi kata yang hilang:', M, y)
    y += 12

    for (let i = 0; i < data.items.length; i++) {
      if (y > H - 40) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.roundedRect(M, y - 3, CW, 20, 2, 2)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(60, 60, 60)
      doc.text(`${i + 1}. ${data.items[i].kata}`, M + 5, y + 7)

      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(`(Petunjuk: ${data.items[i].clue})`, M + 5, y + 14)
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_IsiKata.pdf`)
    return
  }

  // ============ SOAL CERITA ============
  if (data.type === 'soal_cerita') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Baca cerita dan jawab soalnya:', M, y)
    y += 12

    for (let i = 0; i < data.items.length; i++) {
      if (y > H - 60) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)

      const cerita = doc.splitTextToSize(`${i + 1}. ${data.items[i].cerita}`, CW - 16)
      const boxH = cerita.length * 6 + 28
      doc.roundedRect(M, y - 3, CW, boxH, 3, 3)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      doc.text(cerita, M + 5, y + 5, { maxWidth: CW - 16 })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('Jawaban:', M + 5, y + boxH - 14)

      doc.setLineDashPattern([2, 2], 0)
      doc.line(M + 5, y + boxH - 6, M + CW - 5, y + boxH - 6)
      doc.setLineDashPattern([], 0)

      y += boxH + 8
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_SoalCerita.pdf`)
    return
  }

  // ============ BENDA SEKITAR ============
  if (data.type === 'benda') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Tulis nama benda dan fungsinya:', M, y)
    y += 12

    const cols = 2
    const cellW = CW / cols - 5
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (cellW + 10)
      const ly = y + row * 35

      if (ly > H - 50) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.roundedRect(x, ly, cellW, 28, 2, 2)

      doc.setFontSize(22)
      doc.text(data.items[i].emoji, x + cellW / 2, ly + 14, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(data.items[i].desc, x + cellW / 2, ly + 24, { align: 'center' })
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_BendaSekitar.pdf`)
    return
  }

  // ============ MENULIS CERITA ============
  if (data.type === 'cerita') {
    drawBorder()
    let y = drawHeader(30)

    const item = data.items[0]
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(23, 108, 51)
    doc.text(item.judul, W / 2, y, { align: 'center' })
    y += 10

    doc.setFillColor(240, 253, 244)
    doc.setDrawColor(183, 217, 188)
    doc.setLineWidth(0.5)
    const promptLines = doc.splitTextToSize(item.prompt, CW - 16)
    const promptBoxH = promptLines.length * 6 + 12
    doc.roundedRect(M, y, CW, promptBoxH, 3, 3, 'FD')
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(11)
    doc.setTextColor(23, 108, 51)
    doc.text(promptLines, M + 5, y + 9, { maxWidth: CW - 16 })
    y += promptBoxH + 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)

    for (let i = 0; i < 12; i++) {
      if (y > H - 35) { doc.addPage(); drawBorder(); y = 30 }
      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([2, 2], 0)
      doc.setLineWidth(0.3)
      doc.line(M, y, M + CW, y)
      doc.setLineDashPattern([], 0)
      y += 10
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_MenulisCerita.pdf`)
    return
  }

  // ============ QUOTES (API) ============
  if (data.type === 'quotes' && data.quotes) {
    for (let qi = 0; qi < data.quotes.length; qi++) {
      const q = data.quotes[qi]
      if (qi > 0) doc.addPage()
      drawBorder()

      let y = drawHeader(30)

      doc.setFillColor(240, 253, 244)
      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.8)
      doc.setFont('helvetica', 'bolditalic')
      doc.setFontSize(12)
      const quoteLines = doc.splitTextToSize(`"${q.text}"`, CW - 24)
      const quoteBoxH = quoteLines.length * 6 + 24
      doc.roundedRect(M, y, CW, quoteBoxH, 3, 3, 'FD')
      doc.setTextColor(23, 108, 51)
      doc.text(quoteLines, W / 2, y + 12, { align: 'center', maxWidth: CW - 24 })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(`— ${q.author}`, W / 2, y + quoteBoxH - 6, { align: 'center' })
      y += quoteBoxH + 8

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      doc.text('Tuliskan kutipan di atas:', M, y)
      y += 8

      for (let i = 1; i <= 5; i++) {
        if (y > H - 35) { doc.addPage(); drawBorder(); y = 30 }
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`${i}.`, M, y + 1)
        doc.setDrawColor(183, 217, 188)
        doc.setLineDashPattern([2, 2], 0)
        doc.setLineWidth(0.3)
        doc.line(M + 6, y, M + CW, y)
        y += 2; doc.line(M + 6, y, M + CW, y)
        y += 2; doc.line(M + 6, y, M + CW, y)
        doc.setLineDashPattern([], 0)
        y += 8
      }
    }
    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Inspiratif.pdf`)
    return
  }

  // ============ BUKU (API) ============
  if (data.type === 'buku' && data.book) {
    drawBorder()
    let y = drawHeader(30)

    doc.setFillColor(240, 253, 244)
    doc.setDrawColor(183, 217, 188)
    doc.setLineWidth(0.5)
    const synLines = doc.splitTextToSize(data.book.synopsis, CW - 16)
    const synBoxH = synLines.length * 5.5 + 20
    doc.roundedRect(M, y, CW, synBoxH, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(23, 108, 51)
    doc.text(data.book.title, M + 5, y + 8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`oleh ${data.book.author}`, M + 5, y + 14)
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    doc.text(synLines, M + 5, y + 22, { maxWidth: CW - 16 })
    y += synBoxH + 8

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Tulis rangkumanmu di bawah:', M, y)
    y += 8

    for (let i = 0; i < 10; i++) {
      if (y > H - 35) { doc.addPage(); drawBorder(); y = 30 }
      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([2, 2], 0)
      doc.setLineWidth(0.3)
      doc.line(M, y, M + CW, y)
      doc.setLineDashPattern([], 0)
      y += 10
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_RangkumanBuku.pdf`)
    return
  }

  // ============ MATH WITH ICONS (Visual Stars) ============
  if (data.type === 'math_icons') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Hitung bintang dan tulis jawabannya:', M, y)
    y += 12

    const cols = 2
    const cellW = CW / cols - 5
    for (let i = 0; i < data.items.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (cellW + 10)
      const ly = y + row * 30

      if (ly > H - 45) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.roundedRect(x, ly - 3, cellW, 26, 2, 2)

      // Stars for first number
      const starY = ly + 5
      for (let s = 0; s < data.items[i].a; s++) {
        doc.setFontSize(10)
        doc.text('⭐', x + 5 + s * 7, starY)
      }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(60, 60, 60)
      doc.text(data.items[i].op, x + 5 + data.items[i].a * 7 + 2, starY)

      // Stars for second number
      const starStart = x + 5 + data.items[i].a * 7 + 10
      for (let s = 0; s < data.items[i].b; s++) {
        doc.setFontSize(10)
        doc.text('⭐', starStart + s * 7, starY)
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('= ___', starStart + data.items[i].b * 7 + 4, starY)
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_BerhitungIkon.pdf`)
    return
  }

  // ============ GRAFIK BATANG ============
  if (data.type === 'grafik_batang') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(23, 108, 51)
    doc.text(data.title, M, y)
    y += 10

    // Draw bar chart
    const barW = 20
    const gap = 10
    const maxBarH = 50
    const chartX = M + 15
    const chartBottom = y + maxBarH

    // Y-axis
    doc.setDrawColor(100, 100, 100)
    doc.setLineWidth(0.5)
    doc.line(chartX, y, chartX, chartBottom)

    // X-axis
    doc.line(chartX, chartBottom, chartX + data.categories.length * (barW + gap), chartBottom)

    for (let i = 0; i < data.categories.length; i++) {
      const bx = chartX + i * (barW + gap) + gap / 2
      const barH = (data.values[i] / 5) * maxBarH
      const by = chartBottom - barH

      // Bar
      doc.setFillColor(23, 108, 51)
      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.rect(bx, by, barW, barH, 'FD')

      // Value on top
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(60, 60, 60)
      doc.text(String(data.values[i]), bx + barW / 2, by - 2, { align: 'center' })

      // Label below
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text(data.categories[i], bx + barW / 2, chartBottom + 5, { align: 'center' })
    }
    y = chartBottom + 15

    // Questions
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Jawab pertanyaan berikut:', M, y)
    y += 10

    for (let i = 0; i < data.questions.length; i++) {
      if (y > H - 40) { doc.addPage(); drawBorder(); y = 30 }
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`${i + 1}. ${data.questions[i]}`, M, y)
      y += 6
      doc.setDrawColor(183, 217, 188)
      doc.setLineDashPattern([2, 2], 0)
      doc.line(M, y, M + CW, y)
      doc.setLineDashPattern([], 0)
      y += 10
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_GrafikBatang.pdf`)
    return
  }

  // ============ WORD SEARCH ============
  if (data.type === 'word_search') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(`Tema: ${data.theme.toUpperCase()}. Temukan kata-kata berikut dalam kotak:`, M, y)
    y += 10

    // Grid
    const cellSize = 14
    const gridX = M + (CW - data.size * cellSize) / 2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)

    for (let r = 0; r < data.size; r++) {
      for (let c = 0; c < data.size; c++) {
        const cx = gridX + c * cellSize
        const cy = y + r * cellSize

        doc.setDrawColor(183, 217, 188)
        doc.setLineWidth(0.3)
        doc.rect(cx, cy, cellSize, cellSize)

        doc.setTextColor(60, 60, 60)
        doc.text(data.grid[r][c], cx + cellSize / 2, cy + cellSize / 2 + 1.5, { align: 'center' })
      }
    }
    y += data.size * cellSize + 10

    // Word list
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(23, 108, 51)
    doc.text('Kata yang harus dicari:', M, y)
    y += 8

    const cols = 3
    for (let i = 0; i < data.words.length; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = M + col * (CW / cols)
      const ly = y + row * 8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text(`• ${data.words[i]}`, x, ly)
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_WordSearch.pdf`)
    return
  }

  // ============ FILL IN THE BLANKS ============
  if (data.type === 'fill_blanks') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(`Tema: ${data.theme.toUpperCase()}. Lengkapi huruf yang hilang:`, M, y)
    y += 12

    for (let i = 0; i < data.items.length; i++) {
      if (y > H - 40) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)
      doc.roundedRect(M, y - 3, CW, 18, 2, 2)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(60, 60, 60)
      doc.text(`${i + 1}. ${data.items[i].display}`, M + 5, y + 7)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`(${data.items[i].word.length} huruf)`, M + CW - 15, y + 7)

      y += 22
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_FillBlanks.pdf`)
    return
  }

  // ============ DOT-TO-DOT ============
  if (data.type === 'dot_to_dot') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(`Hubungkan titik berurutan untuk membentuk ${data.name}:`, M, y)
    y += 10

    // Scale points to fit page
    const scaleX = CW / 100
    const scaleY = 80 / 100
    const offsetX = M + 10
    const offsetY = y

    doc.setDrawColor(23, 108, 51)
    doc.setFillColor(23, 108, 51)

    for (let i = 0; i < data.points.length; i++) {
      const px = offsetX + data.points[i][0] * scaleX
      const py = offsetY + data.points[i][1] * scaleY

      // Dot
      doc.setFillColor(23, 108, 51)
      doc.circle(px, py, 1.5, 'F')

      // Number
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(23, 108, 51)
      doc.text(String(i + 1), px + 3, py + 1)
    }

    // Hint
    y += 95
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Gambar apa yang terbentuk? ${data.emoji}`, M, y)

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_DotToDot_${data.name}.pdf`)
    return
  }

  // ============ MAZE ============
  if (data.type === 'maze') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Temukan jalan dari MASUK ke KELUAR:', M, y)
    y += 8

    const cellSize = Math.min(18, (CW - 20) / data.cols)
    const gridX = M + (CW - data.cols * cellSize) / 2
    const gridY = y

    doc.setDrawColor(60, 60, 60)
    doc.setLineWidth(0.8)

    for (let r = 0; r < data.rows; r++) {
      for (let c = 0; c < data.cols; c++) {
        const cx = gridX + c * cellSize
        const cy = gridY + r * cellSize
        const cell = data.cells[r][c]

        if (cell.top) doc.line(cx, cy, cx + cellSize, cy)
        if (cell.right) doc.line(cx + cellSize, cy, cx + cellSize, cy + cellSize)
        if (cell.bottom) doc.line(cx, cy + cellSize, cx + cellSize, cy + cellSize)
        if (cell.left) doc.line(cx, cy, cx, cy + cellSize)
      }
    }

    // Entry/Exit labels
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(23, 108, 51)
    doc.text('MASUK', gridX - 12, gridY + cellSize / 2 + 2)
    doc.text('KELUAR', gridX + data.cols * cellSize + 3, gridY + (data.rows - 1) * cellSize + cellSize / 2 + 2)

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Labirin.pdf`)
    return
  }

  // ============ GEOGRAFI ============
  if (data.type === 'geografi') {
    drawBorder()
    let y = drawHeader(30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Gambarkan garis untuk mencocokkan Kota dengan Provinsi:', M, y)
    y += 12

    const leftX = M + 5
    const rightX = M + CW / 2 + 15
    const boxW = CW / 2 - 20

    for (let i = 0; i < data.cities.length; i++) {
      if (y > H - 40) { doc.addPage(); drawBorder(); y = 30 }

      doc.setDrawColor(183, 217, 188)
      doc.setLineWidth(0.3)

      // Left box (city)
      doc.roundedRect(leftX, y, boxW, 14, 2, 2)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text(data.cities[i], leftX + boxW / 2, y + 9, { align: 'center' })

      // Right box (province)
      doc.roundedRect(rightX, y, boxW, 14, 2, 2)
      doc.text(data.provinces[i], rightX + boxW / 2, y + 9, { align: 'center' })

      y += 20
    }

    doc.save(`Worksheet_${childName.value.replace(/\s+/g, '_')}_Geografi.pdf`)
    return
  }
}
</script>

<style>
@media print {
  .fixed.inset-0.z-\[100\] {
    position: static !important;
    overflow: visible !important;
    height: auto !important;
  }
}
</style>
