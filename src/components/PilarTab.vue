<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto">
    <div v-show="!selectedPilar" class="mb-stack-lg">
      <p class="font-body-lg text-body-lg text-on-surface-variant leading-tight">
        Hari ini ingin membantu anak berkembang di area apa?
      </p>
    </div>

    <div v-show="!selectedPilar"
      class="mb-stack-lg bg-tertiary-container/10 p-6 md:p-8 rounded-[32px] soft-shadow relative overflow-hidden border border-growth-green">
      <div class="flex gap-4 items-start relative z-10">
        <span class="material-symbols-outlined text-tertiary text-2xl">auto_awesome</span>
        <div>
          <p class="font-label-lg text-label-lg text-tertiary mb-1">Tips Siang Ini</p>
          <p class="font-body-md text-body-md text-on-surface-variant">Fokus pada satu hal kecil hari ini memberikan dampak besar di masa depan.</p>
        </div>
      </div>
    </div>

    <div v-show="!selectedPilar" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <button v-for="(pilar, index) in pilars" :key="pilar.key"
        class="pillar-card flex flex-col items-center justify-center p-6 md:p-8 rounded-[40px] aspect-square transition-all duration-500 border"
        :style="{
          backgroundColor: pilar.bg,
          borderColor: pilar.color,
          boxShadow: `0 4px 16px ${pilar.color}40`,
          transitionDelay: `${index * 50}ms`
        }"
        @click="openPilarSub(pilar.key)">
        <div class="mb-4 text-4xl">{{ pilar.emoji }}</div>
        <span class="font-label-lg text-label-lg text-center leading-snug">{{ pilar.title }}</span>
        <span class="text-xs text-on-surface-variant text-center mt-1.5">{{ pilar.subtitle }}</span>
      </button>
    </div>

    <PilarSubList
      v-if="selectedPilar && !selectedSub && !selectedAktivitas"
      :pilar-key="selectedPilar"
      @back="closePilarSub"
      @select-sub="openAktivitas" />

    <AktivitasPage
      v-if="selectedSub && !selectedAktivitas"
      :title="selectedSub"
      @back="closeAktivitas"
      @select-aktivitas="openDetail" />

    <AktivitasDetailPage
      v-if="selectedAktivitas"
      :item="selectedAktivitas"
      @back="closeDetail" />

    <div v-show="!selectedPilar" class="mt-stack-lg mb-8">
      <div class="bg-white rounded-[40px] p-6 md:p-8 soft-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 border border-growth-green">
        <div class="md:max-w-[65%]">
          <h3 class="font-headline-md text-headline-md mb-2">Refleksi Hari Ini</h3>
          <p class="font-body-md text-body-md text-on-surface-variant">Bagaimana perasaan Bunda hari ini dalam mendampingi si kecil?</p>
        </div>
        <div class="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center border border-growth-green shrink-0">
          <span class="material-symbols-outlined text-primary text-3xl">edit_note</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PilarSubList from './PilarSubList.vue'
import AktivitasPage from './AktivitasPage.vue'
import AktivitasDetailPage from './AktivitasDetailPage.vue'
import { pilars } from '../data/pilars.js'

const selectedPilar = ref(null)
const selectedSub = ref(null)
const selectedAktivitas = ref(null)

function openPilarSub(key) {
  selectedPilar.value = key
  selectedSub.value = null
  selectedAktivitas.value = null
  window.scrollTo(0, 0)
}

function closePilarSub() {
  selectedPilar.value = null
  selectedSub.value = null
  selectedAktivitas.value = null
}

function openAktivitas(subTitle) {
  selectedSub.value = subTitle
  selectedAktivitas.value = null
  window.scrollTo(0, 0)
}

function closeAktivitas() {
  selectedSub.value = null
  selectedAktivitas.value = null
}

function openDetail(item) {
  selectedAktivitas.value = item
  window.scrollTo(0, 0)
}

function closeDetail() {
  selectedAktivitas.value = null
}
</script>
