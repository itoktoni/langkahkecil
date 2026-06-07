<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto">

    <div v-show="!selectedSub" class="mb-stack-lg">
      <section class="mb-4">
        <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-text-main leading-tight mb-2">
          Mau Belajar Apa Hari Ini?
        </h2>
        <p class="font-body-md text-body-md text-on-surface-variant mb-3">Pilih area yang ingin dikembangkan bersama si kecil.</p>
        <div v-if="anakList.length">
          <AnakSelector :anak-list="anakList" :model-value="selectedAnakId" @update:model-value="$emit('update:anak-id', $event)" />
        </div>
      </section>

      <template v-for="pilar in pilars" :key="pilar.key">
        <div
          class="bento-card group relative bg-white rounded-[24px] soft-shadow overflow-hidden cursor-pointer transition-all hover:shadow-xl border-2 mb-3"
          :style="{ borderColor: selectedPilar === pilar.key ? pilar.color : pilar.color + '30', boxShadow: selectedPilar === pilar.key ? `0 6px 24px ${pilar.color}40` : `0 2px 12px ${pilar.color}10` }"
          @click="togglePilar(pilar.key)">
          <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-[24px]" :style="{ background: pilar.color }"></div>
          <div class="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.07]" :style="{ background: pilar.color }"></div>
          <div class="flex items-center gap-4 p-4 md:p-5 pl-5">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              :style="{ background: pilar.bg, color: pilar.color }">
              {{ pilar.emoji }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-label-lg text-label-lg text-text-main">{{ pilar.title }}</h3>
              <p class="text-xs text-on-surface-variant mt-0.5">{{ pilar.subtitle }}</p>
            </div>
            <span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-lg shrink-0"
              :class="{ 'rotate-180': selectedPilar === pilar.key }">expand_more</span>
          </div>
        </div>

        <div v-if="selectedPilar === pilar.key && getSubData(pilar.key)" class="mb-3 fade-in-up">
          <div class="bg-canvas-cream rounded-[24px] p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-headline-sm text-text-main">{{ getSubData(pilar.key).title }}</h3>
              <button @click.stop="closePilar"
                class="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-lg">close</span>
                Tutup
              </button>
            </div>
            <p class="text-sm text-on-surface-variant mb-4">{{ getSubData(pilar.key).desc }}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="item in getSubData(pilar.key).items" :key="item.title"
                class="group bg-white p-4 rounded-[20px] soft-shadow flex items-center gap-3 transition-all hover:shadow-xl cursor-pointer border-2"
                :style="{ borderColor: getSubData(pilar.key).color + '40' }" @click.stop="openAktivitas(item.title)">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  :style="{ background: getSubData(pilar.key).bg }">{{ item.emoji }}</div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-label-lg text-label-lg text-primary leading-snug">{{ item.title }}</h3>
                  <p class="text-xs leading-snug text-on-surface-variant mt-0.5 line-clamp-2">{{ item.desc }}</p>
                </div>
                <span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-lg shrink-0">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-show="!selectedSub"
      class="mt-stack-lg bg-[#D7EDFF] rounded-[32px] p-6 md:p-8 relative overflow-hidden soft-shadow">
      <div class="relative z-10 flex gap-4">
        <div class="shrink-0">
          <div class="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-3xl">psychology</span>
          </div>
        </div>
        <div>
          <h4 class="font-label-lg text-label-lg text-on-tertiary-fixed mb-1 uppercase tracking-wider">Tips Hari Ini</h4>
          <p class="font-body-md text-body-lg text-primary italic leading-relaxed">"Fokus pada satu hal kecil hari ini memberikan dampak besar di masa depan."</p>
        </div>
      </div>
      <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
    </div>

    <AktivitasPage v-if="selectedSub && !selectedAktivitas" :title="selectedSub" @back="closeAktivitas"
      @select-aktivitas="openDetail" />

    <AktivitasDetailPage v-if="selectedAktivitas" ref="detailPageRef" :item="selectedAktivitas" @back="closeDetail" />

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AktivitasPage from './AktivitasPage.vue'
import AktivitasDetailPage from './AktivitasDetailPage.vue'
import AnakSelector from '../components/AnakSelector.vue'
import { pilars, pillarSubs } from '../data/pilars.js'

const props = defineProps({
  anakList: { type: Array, default: () => [] },
  selectedPilar: { type: String, default: null },
  selectedAnakId: { type: Number, default: null }
})

const emit = defineEmits(['select-pilar', 'close-pilar', 'update:anak-id'])

const selectedSub = ref(null)
const selectedAktivitas = ref(null)
const detailPageRef = ref(null)

watch(() => props.selectedPilar, (val) => {
  if (!val) {
    selectedSub.value = null
    selectedAktivitas.value = null
  }
})

function getSubData(key) {
  return pillarSubs[key] || null
}

function togglePilar(key) {
  if (props.selectedPilar === key) {
    closePilar()
  } else {
    emit('select-pilar', key)
    selectedSub.value = null
    selectedAktivitas.value = null
  }
}

function closePilar() {
  emit('close-pilar')
  selectedSub.value = null
  selectedAktivitas.value = null
}

function openAktivitas(subTitle) {
  selectedSub.value = subTitle
  selectedAktivitas.value = null
  history.pushState({ action: 'sub' }, '')
  window.scrollTo(0, 0)
}

function closeAktivitas() {
  selectedSub.value = null
  selectedAktivitas.value = null
}

function openDetail(item) {
  selectedAktivitas.value = item
  history.pushState({ action: 'detail' }, '')
  window.scrollTo(0, 0)
}

function closeDetail() {
  selectedAktivitas.value = null
}

function goBack() {
  if (selectedAktivitas.value && detailPageRef.value?.goBack()) return true
  if (selectedAktivitas.value) { selectedAktivitas.value = null; return true }
  if (selectedSub.value) { selectedSub.value = null; selectedAktivitas.value = null; return true }
  return false
}

defineExpose({ goBack })
</script>
