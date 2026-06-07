<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">

    <h2 class="font-headline-md text-headline-md mb-6">Laporan Perkembangan</h2>

    <div class="space-y-4">
      <div v-for="anak in anakList" :key="anak.id" class="bg-white rounded-[28px] border border-outline-variant shadow-md overflow-hidden">
        <button class="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
          @click="toggle(anak.id)">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0" :style="{ background: anak.bg }">
            {{ anak.emoji }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-lg text-text-main">{{ anak.nama }}</p>
            <p class="text-sm text-on-surface-variant">{{ ageLabel(anak.tahun, anak.bulan, anak.tanggal) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="anak.subpilars" class="text-xs font-bold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full">
              {{ anak.subpilars.length }} skills
            </span>
            <span class="material-symbols-outlined text-on-surface-variant transition-transform duration-200"
              :class="{ 'rotate-180': openId === anak.id }">expand_more</span>
          </div>
        </button>

        <div v-show="openId === anak.id" class="px-5 pb-5 space-y-5 border-t border-outline-variant">

          <div v-if="anak.subpilars && anak.subpilars.length" class="pt-4 space-y-3">
            <h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Skills Aktif</h4>
            <div v-for="sp in anak.subpilars" :key="sp.key" class="bg-canvas-cream rounded-2xl p-4 border border-outline-variant shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-text-main">{{ sp.title }}</p>
                  <p class="text-xs text-on-surface-variant">{{ getPilarName(sp.pilar) }}</p>
                </div>
                <span class="text-xs font-bold" :style="{ color: sp.color }">{{ sp.progress }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: sp.progress + '%', background: sp.color }"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 text-xs text-on-surface-variant">
                  <span class="material-symbols-outlined text-xs">check_circle</span>
                  <span>{{ Math.round(sp.progress / 20) }} dari 5 aktivitas</span>
                </div>
                <div class="flex items-center gap-2">
                  <button @click.stop="openEvaluasi(anak, sp)"
                    class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all active:scale-95"
                    :style="{ background: sp.color }">
                    <span class="material-symbols-outlined text-sm">rate_review</span>
                    Evaluasi
                  </button>
                  <button @click.stop="shareEvalDirect(anak, sp)"
                    class="h-8 w-8 rounded-lg flex items-center justify-center border-2 transition-all active:scale-95"
                    :style="{ borderColor: sp.color + '60', color: sp.color }">
                    <span class="material-symbols-outlined text-base">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="pt-4 text-center text-sm text-on-surface-variant py-4">
            Belum ada skills aktif
          </div>

          <div class="" v-if="anak.completedSubpilars && anak.completedSubpilars.length">
            <h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Skills Selesai</h4>
            <div class="space-y-2">
              <div v-for="sp in anak.completedSubpilars" :key="sp.key"
                class="flex items-center gap-3 bg-canvas-cream rounded-2xl p-3 border border-outline-variant shadow-sm">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-text-main">{{ sp.title }}</p>
                  <p class="text-xs text-on-surface-variant">{{ getPilarName(sp.pilar) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="$emit('reset-subpilar', { anak, subpilar: sp })"
                    class="h-8 w-8 rounded-lg flex items-center justify-center border-2 transition-all active:scale-95"
                    style="border-color: #C6282860; color: #C62828;">
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                  <button @click.stop="shareEvalDirect(anak, sp)"
                    class="h-8 w-8 rounded-lg flex items-center justify-center border-2 transition-all active:scale-95"
                    :style="{ borderColor: (sp.color || '#4CAF50') + '60', color: sp.color || '#4CAF50' }">
                    <span class="material-symbols-outlined text-base">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <AppModal v-model="showEvaluasi" :title="evalTitle">
      <div class="text-center mb-4">
        <div class="text-4xl mb-2">{{ evalEmoji }}</div>
        <p class="text-xs text-on-surface-variant">{{ evalDesc }}</p>
      </div>

      <div v-if="evalQuestions.length" class="space-y-2 mb-5">
        <p class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Panduan Penilaian</p>
        <div v-for="(q, i) in evalQuestions" :key="i"
          class="bg-canvas-cream rounded-xl p-3 text-sm text-text-main border border-outline-variant">
          {{ i + 1 }}. {{ q }}
        </div>
      </div>

      <div class="bg-canvas-cream rounded-2xl p-4 shadow-sm border border-outline-variant">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Penilaian Orang Tua</span>
          <span class="text-xs font-bold" :style="{ color: evalColor }">{{ evalPoints }}/{{ evalMax }}</span>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div class="flex-1">
            <div class="w-full h-5 rounded-full overflow-hidden relative" :style="{ background: evalColor + '20' }">
              <div class="h-full rounded-full transition-all duration-700"
                :style="{ width: evalPercent + '%', background: evalColor }">
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center gap-2 mt-2">
          <button @click="removeEvalPoint"
            class="h-9 px-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95"
            :style="{ borderColor: evalColor + '80', color: evalColor }">
            -1 Poin
          </button>
          <button @click="addEvalPoint"
            class="h-9 px-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            :style="{ background: evalColor }">
            +1 Poin
          </button>
        </div>
      </div>

      <div class="flex gap-3 mt-5">
        <AppButton variant="outline" block @click="closeEvaluasi">Tutup</AppButton>
        <AppButton block @click="shareEval">
          <span class="material-symbols-outlined text-lg">share</span> Share
        </AppButton>
      </div>
    </AppModal>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { pilars } from '../data/pilars.js'
import { evaluasiData } from '../data/evaluasi.js'
import { ageLabel } from '../utils/age.js'
import { shareProgress } from '../utils/share.js'
import AppModal from '../components/AppModal.vue'
import AppButton from '../components/AppButton.vue'
import { playAddSound, playRemoveSound } from '../utils/sound.js'

const props = defineProps({
  anakList: { type: Array, default: () => [] },
  selectedAnakId: { type: Number, default: null }
})

defineEmits(['evaluasi', 'reset-subpilar'])

const openId = ref(null)
const showEvaluasi = ref(false)
const evalAnak = ref(null)
const evalSubpilar = ref(null)
const evalQuestions = ref([])
const evalPoints = ref(0)
const evalMax = 10

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

const evalTitle = computed(() => {
  if (!evalSubpilar.value) return 'Evaluasi'
  return `Evaluasi: ${evalSubpilar.value.title}`
})

const evalEmoji = computed(() => evalSubpilar.value?.emoji || '⭐')
const evalColor = computed(() => evalSubpilar.value?.color || '#4CAF50')
const evalDesc = computed(() => evalSubpilar.value?.desc || '')

const evalPercent = computed(() => Math.min(100, Math.round((evalPoints.value / evalMax) * 100)))

function openEvaluasi(anak, sp) {
  evalAnak.value = anak
  evalSubpilar.value = sp
  const data = evaluasiData[sp.key]
  evalQuestions.value = data ? data.questions : []
  evalPoints.value = 0
  showEvaluasi.value = true
}

function addEvalPoint() {
  if (evalPoints.value < evalMax) {
    evalPoints.value++
    playAddSound()
  }
}

function removeEvalPoint() {
  if (evalPoints.value > 0) {
    evalPoints.value--
    playRemoveSound()
  }
}

function closeEvaluasi() {
  showEvaluasi.value = false
}

function shareEval() {
  if (!evalAnak.value || !evalSubpilar.value) return
  shareProgress({
    title: `Evaluasi ${evalSubpilar.value.title}`,
    category: getPilarName(evalSubpilar.value.pilar),
    emoji: evalSubpilar.value.emoji,
    color: evalColor.value,
    points: evalPoints.value,
    maxPoints: evalMax,
    notes: `${evalPoints.value} dari ${evalMax} poin`,
    childName: evalAnak.value.nama
  })
}

function shareEvalDirect(anak, sp) {
  shareProgress({
    title: sp.title,
    category: getPilarName(sp.pilar),
    emoji: sp.emoji,
    color: sp.color,
    points: Math.round(sp.progress / 10),
    maxPoints: 10,
    notes: `Progress ${sp.progress}%`,
    childName: anak.nama
  })
}
</script>
