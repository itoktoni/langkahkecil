<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">

    <h2 class="font-headline-md text-headline-md mb-6">Laporan Perkembangan</h2>

    <div class="space-y-4">
      <div v-for="anak in anakList" :key="anak.id" class="bg-white rounded-[28px] soft-shadow overflow-hidden">
        <button class="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
          @click="toggle(anak.id)">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0" :style="{ background: anak.bg }">
            {{ anak.emoji }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-lg text-text-main">{{ anak.nama }}</p>
            <p class="text-sm text-on-surface-variant">{{ anak.usia }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="anak.subpilars" class="text-xs font-bold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full">
              {{ anak.subpilars.length }} pilar
            </span>
            <span class="material-symbols-outlined text-on-surface-variant transition-transform duration-200"
              :class="{ 'rotate-180': openId === anak.id }">expand_more</span>
          </div>
        </button>

        <div v-show="openId === anak.id" class="px-5 pb-5 space-y-5 border-t border-outline-variant">

          <div v-if="anak.subpilars && anak.subpilars.length" class="pt-4 space-y-3">
            <h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sub Pilar Aktif</h4>
            <div v-for="sp in anak.subpilars" :key="sp.key" class="bg-canvas-cream rounded-2xl p-4">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-base"
                  :style="{ background: getPilarBg(sp.pilar) }">
                  {{ sp.emoji }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-text-main">{{ sp.title }}</p>
                  <p class="text-[11px] text-on-surface-variant">{{ getPilarName(sp.pilar) }}</p>
                </div>
                <span class="text-xs font-bold" :style="{ color: sp.color }">{{ sp.progress }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: sp.progress + '%', background: sp.color }"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span class="material-symbols-outlined text-xs">check_circle</span>
                  <span>{{ Math.round(sp.progress / 20) }} dari 5 aktivitas</span>
                </div>
                <button @click="$emit('evaluasi', { anak, subpilar: sp })"
                  class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  :style="{ background: getPilarBg(sp.pilar), color: sp.color }">
                  <span class="material-symbols-outlined text-sm">rate_review</span>
                  Evaluasi
                </button>
              </div>
            </div>
          </div>

          <div v-else class="pt-4 text-center text-sm text-on-surface-variant py-4">
            Belum ada sub pilar aktif
          </div>

          <div v-if="anak.completedSubpilars && anak.completedSubpilars.length">
            <h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Sub Pilar Selesai</h4>
            <div class="space-y-2">
              <div v-for="sp in anak.completedSubpilars" :key="sp.key"
                class="flex items-center gap-3 bg-canvas-cream rounded-2xl p-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-base"
                  :style="{ background: getPilarBg(sp.pilar) }">
                  {{ sp.emoji }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-text-main">{{ sp.title }}</p>
                  <p class="text-[11px] text-on-surface-variant">{{ getPilarName(sp.pilar) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-2xl text-green-600">check_circle</span>
                  <button @click="$emit('reset-subpilar', { anak, subpilar: sp })"
                    class="w-6 h-6 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style="background: #C62828; color: #fff; opacity: 0.7;">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="history.length" class="mt-6">
      <h3 class="font-headline-sm text-text-main mb-3">Riwayat Aktivitas</h3>
      <div class="bg-white rounded-[28px] p-5 soft-shadow">
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
          <div v-for="(h, i) in history" :key="i"
            class="relative flex items-start gap-3 pb-3 last:pb-0">
            <div class="relative z-10 w-2 h-2 rounded-full mt-2 shrink-0" :style="{ background: h.color }"></div>
            <div class="flex-1">
              <p class="text-sm font-medium" :style="{ color: h.color }">{{ h.anakNama }}</p>
              <p class="text-sm text-text-main">{{ h.action }}</p>
              <p class="text-[11px] text-on-surface-variant">{{ h.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { pilars } from '../data/pilars.js'

const props = defineProps({
  anakList: { type: Array, default: () => [] },
  history: { type: Array, default: () => [] },
  selectedAnakId: { type: Number, default: null }
})

defineEmits(['evaluasi', 'reset-subpilar'])

const openId = ref(null)

watch(() => props.selectedAnakId, (id) => {
  if (id) openId.value = id
}, { immediate: true })

function toggle(id) {
  openId.value = openId.value === id ? null : id
}

function getPilarName(key) {
  const p = pilars.find(p => p.key === key)
  return p ? p.title : key
}

function getPilarBg(key) {
  const p = pilars.find(p => p.key === key)
  return p ? p.bg : '#F5F5F5'
}
</script>
