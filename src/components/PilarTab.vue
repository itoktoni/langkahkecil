<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto">
    <div v-show="!selectedSub" class="mb-stack-lg">
      <p class="font-body-lg text-body-lg text-on-surface-variant leading-tight">
        Hari ini ingin membantu anak berkembang di area apa?
      </p>
    </div>

    <div v-show="!selectedSub" class="flex flex-col gap-3">
      <template v-for="(pilar, index) in pilars" :key="pilar.key">
        <button
          class="w-full flex items-center gap-4 p-5 md:p-6 rounded-[24px] transition-all duration-300 border-2 text-left"
            :style="{
              backgroundColor: pilar.bg,
              borderColor: selectedPilar === pilar.key ? pilar.color : `${pilar.color}40`,
              boxShadow: selectedPilar === pilar.key ? `0 6px 24px ${pilar.color}50` : `0 2px 12px ${pilar.color}20`,
            }" @click="togglePilar(pilar.key)">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            :style="{ background: 'white' }">{{ pilar.emoji }}</div>
          <div class="flex-1 min-w-0">
            <span class="font-label-lg text-label-lg block">{{ pilar.title }}</span>
            <span class="text-xs text-on-surface-variant">{{ pilar.subtitle }}</span>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant transition-transform duration-300 shrink-0"
            :class="{ 'rotate-180': selectedPilar === pilar.key }">expand_more</span>
        </button>

        <Transition @enter="onEnter" @leave="onLeave" @after-leave="afterLeave">
          <div v-if="selectedPilar === pilar.key && subData" :key="'collapse-' + pilar.key" ref="collapseEl"
            class="overflow-hidden">
            <div class="pb-2 pl-4 md:pl-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="item in subData.items" :key="item.title"
                  class="group bg-white p-4 rounded-[20px] soft-shadow flex items-center gap-3 transition-all hover:shadow-xl cursor-pointer border"
                  :style="{ borderColor: subData.color }" @click.stop="openAktivitas(item.title)">
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    :style="{ background: subData.bg }">{{ item.emoji }}</div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-label-lg text-label-lg text-primary leading-snug">{{ item.title }}</h3>
                    <p class="text-xs leading-snug text-on-surface-variant mt-0.5 line-clamp-2">{{ item.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>
    </div>

    <div v-show="!selectedSub"
      class="mt-stack-lg bg-tertiary-container/10 p-6 md:p-8 rounded-[32px] soft-shadow relative overflow-hidden border border-growth-green">
      <div class="flex gap-4 items-start relative z-10">
        <span class="material-symbols-outlined text-tertiary text-2xl">auto_awesome</span>
        <div>
          <p class="font-label-lg text-label-lg text-tertiary mb-1">Tips Siang Ini</p>
          <p class="font-body-md text-body-md text-on-surface-variant">Fokus pada satu hal kecil hari ini memberikan
            dampak besar di masa depan.</p>
        </div>
      </div>
    </div>

    <AktivitasPage v-if="selectedSub && !selectedAktivitas" :title="selectedSub" @back="closeAktivitas"
      @select-aktivitas="openDetail" />

    <AktivitasDetailPage v-if="selectedAktivitas" :item="selectedAktivitas" @back="closeDetail" />


  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import AktivitasPage from './AktivitasPage.vue'
import AktivitasDetailPage from './AktivitasDetailPage.vue'
import { pilars, pillarSubs } from '../data/pilars.js'

const props = defineProps({
  selectedPilar: { type: String, default: null }
})

const emit = defineEmits(['select-pilar', 'close-pilar'])

const selectedSub = ref(null)
const selectedAktivitas = ref(null)
const collapseEl = ref(null)

watch(() => props.selectedPilar, (val) => {
  if (!val) {
    selectedSub.value = null
    selectedAktivitas.value = null
  }
})

const subData = computed(() => {
  if (!props.selectedPilar) return null
  return pillarSubs[props.selectedPilar] || null
})

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

function onEnter(el) {
  el.style.height = '0'
  el.style.opacity = '0'
  nextTick(() => {
    el.style.transition = 'height 0.35s ease, opacity 0.35s ease'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
  })
}

function onLeave(el) {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  nextTick(() => {
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
    el.style.height = '0'
    el.style.opacity = '0'
  })
}

function afterLeave(el) {
  el.style.height = ''
  el.style.opacity = ''
  el.style.transition = ''
}
</script>
