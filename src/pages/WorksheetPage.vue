<template>
  <div class="space-y-4">
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
        @click="openWorksheet(ws)">

        <div class="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm mb-3"
          :style="{ background: ws.bg }">
          <Icon :icon="ws.icon" class="w-6 h-6" :style="{ color: ws.iconColor || '#333' }" />
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
      <div class="text-3xl mb-2 animate-bounce">
        <Icon icon="mdi:pencil-outline" class="w-8 h-8 text-primary mx-auto" />
      </div>
      <p class="text-sm text-on-surface-variant font-medium">Membuat worksheet...</p>
    </div>

  </div>

  <!-- Template Overlays -->
  <div v-if="activeTemplate" class="fixed inset-0 z-[100] bg-white overflow-y-auto">
    <!-- 1-3 Tahun -->
    <MewarnaiAlfabet v-if="activeTemplate === 'mewarnai_alfabet'" @close="activeTemplate = null" />
    <MewarnaiAngka v-if="activeTemplate === 'mewarnai_angka'" @close="activeTemplate = null" />
    <TracingHuruf v-if="activeTemplate === 'tracing_huruf'" @close="activeTemplate = null" />
    <TracingAngka v-if="activeTemplate === 'tracing_angka'" @close="activeTemplate = null" />
    <GarisZigzag v-if="activeTemplate === 'garis_zigzag'" @close="activeTemplate = null" />
    <CocokanWarna v-if="activeTemplate === 'cocokan_warna'" @close="activeTemplate = null" />

    <!-- 3-5 Tahun -->
    <MenulisHuruf v-if="activeTemplate === 'menulis_huruf'" @close="activeTemplate = null" />
    <MenulisAngka v-if="activeTemplate === 'menulis_angka'" @close="activeTemplate = null" />
    <MenulisKotak v-if="activeTemplate === 'menulis_kotak'" @close="activeTemplate = null" />
    <MenulisAngkaKotak v-if="activeTemplate === 'menulis_angka_kotak'" @close="activeTemplate = null" />
    <MenebalkanHuruf v-if="activeTemplate === 'menebalkan_huruf'" @close="activeTemplate = null" />
    <MenebalkanAngka v-if="activeTemplate === 'menebalkan_angka'" @close="activeTemplate = null" />
    <AlfabetWs v-if="activeTemplate === 'huruf_kapital'" @close="activeTemplate = null" />
    <AngkaWs v-if="activeTemplate === 'angka_1_10'" @close="activeTemplate = null" />
    <MewarnaiBuah v-if="activeTemplate === 'mewarnai_buah'" @close="activeTemplate = null" />
    <MewarnaiHewan v-if="activeTemplate === 'mewarnai_hewan'" @close="activeTemplate = null" />
    <MengenalWarna v-if="activeTemplate === 'mengenal_warna'" @close="activeTemplate = null" />
    <MengenalBentuk v-if="activeTemplate === 'mengenal_bentuk'" @close="activeTemplate = null" />

    <!-- 4-7 Tahun -->
    <Penjumlahan v-if="activeTemplate === 'penjumlahan'" @close="activeTemplate = null" />
    <Pengurangan v-if="activeTemplate === 'pengurangan'" @close="activeTemplate = null" />
    <MenyalinKata v-if="activeTemplate === 'menyalin_kata'" @close="activeTemplate = null" />
    <PasanganBenda v-if="activeTemplate === 'pasangan_benda'" @close="activeTemplate = null" />
    <FillBlanks v-if="activeTemplate === 'fill_blanks'" @close="activeTemplate = null" />
    <DotToDot v-if="activeTemplate === 'dot_to_dot'" @close="activeTemplate = null" />
    <MathIcons v-if="activeTemplate === 'math_icons'" @close="activeTemplate = null" />

    <!-- 6-9 Tahun -->
    <Perkalian v-if="activeTemplate === 'perkalian'" @close="activeTemplate = null" />
    <Pembagian v-if="activeTemplate === 'pembagian'" @close="activeTemplate = null" />
    <QuotesWs v-if="activeTemplate === 'menyalin_kalimat'" @close="activeTemplate = null" />
    <IsiKata v-if="activeTemplate === 'isi_kata'" @close="activeTemplate = null" />
    <GrafikBatang v-if="activeTemplate === 'grafik_batang'" @close="activeTemplate = null" />
    <WordSearch v-if="activeTemplate === 'word_search'" @close="activeTemplate = null" />
    <MazeWs v-if="activeTemplate === 'maze'" @close="activeTemplate = null" />

    <!-- 7+ Tahun -->
    <MenulisCerita v-if="activeTemplate === 'cerita_pendek'" @close="activeTemplate = null" />
    <BukuWs v-if="activeTemplate === 'rangkuman_buku'" @close="activeTemplate = null" />
    <SoalCerita v-if="activeTemplate === 'soal_cerita'" @close="activeTemplate = null" />
    <BendaSekitar v-if="activeTemplate === 'benda_sekitar'" @close="activeTemplate = null" />
    <GeografiWs v-if="activeTemplate === 'geografi'" @close="activeTemplate = null" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useToolsStore } from '../stores/toolsStore.js'
import { useAnakStore } from '../stores/anakStore.js'

import MewarnaiAlfabet from './worksheet/MewarnaiAlfabet.vue'
import MewarnaiAngka from './worksheet/MewarnaiAngka.vue'
import MenulisHuruf from './worksheet/MenulisHuruf.vue'
import MenulisAngka from './worksheet/MenulisAngka.vue'
import MenulisKotak from './worksheet/MenulisKotak.vue'
import MenulisAngkaKotak from './worksheet/MenulisAngkaKotak.vue'
import MenebalkanHuruf from './worksheet/MenebalkanHuruf.vue'
import MenebalkanAngka from './worksheet/MenebalkanAngka.vue'
import AlfabetWs from './worksheet/AlfabetWs.vue'
import AngkaWs from './worksheet/AngkaWs.vue'
import MewarnaiBuah from './worksheet/MewarnaiBuah.vue'
import MewarnaiHewan from './worksheet/MewarnaiHewan.vue'
import MengenalWarna from './worksheet/MengenalWarna.vue'
import MengenalBentuk from './worksheet/MengenalBentuk.vue'
import Penjumlahan from './worksheet/Penjumlahan.vue'
import Pengurangan from './worksheet/Pengurangan.vue'
import MenyalinKata from './worksheet/MenyalinKata.vue'
import PasanganBenda from './worksheet/PasanganBenda.vue'
import Perkalian from './worksheet/Perkalian.vue'
import Pembagian from './worksheet/Pembagian.vue'
import QuotesWs from './worksheet/QuotesWs.vue'
import IsiKata from './worksheet/IsiKata.vue'
import MenulisCerita from './worksheet/MenulisCerita.vue'
import BukuWs from './worksheet/BukuWs.vue'
import SoalCerita from './worksheet/SoalCerita.vue'
import BendaSekitar from './worksheet/BendaSekitar.vue'
import MathIcons from './worksheet/MathIcons.vue'
import GrafikBatang from './worksheet/GrafikBatang.vue'
import WordSearch from './worksheet/WordSearch.vue'
import FillBlanks from './worksheet/FillBlanks.vue'
import DotToDot from './worksheet/DotToDot.vue'
import MazeWs from './worksheet/MazeWs.vue'
import GeografiWs from './worksheet/GeografiWs.vue'
import TracingHuruf from './worksheet/TracingHuruf.vue'
import TracingAngka from './worksheet/TracingAngka.vue'
import GarisZigzag from './worksheet/GarisZigzag.vue'
import CocokanWarna from './worksheet/CocokanWarna.vue'

const tools = useToolsStore()
const anakStore = useAnakStore()

const selectedAge = ref('all')
const searchQuery = ref('')
const generating = ref(false)
const activeTemplate = ref(null)

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

import { worksheetTypes } from '../data/worksheetTypes.js'

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

function openWorksheet(ws) {
  generating.value = true
  setTimeout(() => {
    activeTemplate.value = ws.id
    generating.value = false
  }, 200)
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
