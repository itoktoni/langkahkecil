<template>
  <div class="fixed inset-0 z-[100] bg-black/50 flex items-end lg:items-center justify-center" @click.self="$emit('close')">
    <div class="bg-canvas-cream w-full h-full lg:rounded-[32px] lg:max-w-2xl lg:max-h-[85vh] lg:h-auto flex flex-col overflow-hidden soft-shadow lg:mx-4"
      style="box-shadow: 0 25px 60px rgba(0,0,0,0.15);">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant bg-white shrink-0">
        <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 class="font-headline-md text-headline-md text-center flex-1 px-2 truncate">{{ project.title }}</h3>
        <span class="text-sm font-bold text-on-surface-variant bg-surface-container-low rounded-full px-3 py-1">
          {{ isFinished ? 'Selesai' : `${currentPageDisplay}/${totalPages}` }}
        </span>
      </div>

      <!-- Content -->
      <div v-if="!isFinished" class="flex-1 overflow-hidden relative select-none"
        @mousedown="onDragStart" @mousemove="onDragMove" @mouseup="onDragEnd" @mouseleave="onDragEnd"
        @touchstart="onDragStart" @touchmove="onDragMove" @touchend="onDragEnd">
        <div class="h-full overflow-y-auto"
          :style="{ transform: `translateX(${dragOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }">

          <!-- Materials Page -->
          <div v-if="currentStep === -1" class="flex flex-col">
            <div class="w-full h-[220px] lg:h-[260px] overflow-hidden bg-surface-container-low shrink-0 relative">
              <img :src="project.image" :alt="project.title" class="w-full h-full object-cover pointer-events-none" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <h2 class="text-white font-headline-lg-mobile text-headline-lg-mobile drop-shadow-lg">{{ project.title }}</h2>
                <p class="text-white/90 text-sm drop-shadow-lg mt-1">{{ project.desc }}</p>
              </div>
            </div>
            <div class="px-6 py-6 space-y-4">
              <!-- Info -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white rounded-2xl p-4 soft-shadow border border-outline-variant text-center">
                  <p class="text-xs text-on-surface-variant mb-1">Durasi</p>
                  <p class="font-label-lg text-label-lg text-primary">⏱ {{ project.duration }}</p>
                </div>
                <div class="bg-white rounded-2xl p-4 soft-shadow border border-outline-variant text-center">
                  <p class="text-xs text-on-surface-variant mb-1">Tingkat</p>
                  <p class="font-label-lg text-label-lg text-primary">📊 {{ project.difficulty }}</p>
                </div>
              </div>
              <!-- Materials -->
              <div class="bg-white rounded-[28px] p-5 soft-shadow border" :style="{ borderColor: color }">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" :style="{ background: bg }">📦</div>
                  <div>
                    <h3 class="font-headline-md text-headline-md">Bahan yang Dibutuhkan</h3>
                    <p class="text-xs text-on-surface-variant">Siapkan semua bahan sebelum mulai</p>
                  </div>
                </div>
                <ul class="space-y-3">
                  <li v-for="(m, i) in project.materials" :key="i" class="flex items-center gap-3 bg-surface-container-low rounded-xl p-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" :style="{ background: color }">
                      {{ i + 1 }}
                    </div>
                    <span class="text-sm text-on-surface font-medium">{{ m }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div v-else class="flex flex-col">
            <div class="w-full h-[220px] lg:h-[260px] overflow-hidden bg-surface-container-low shrink-0 relative">
              <img :src="currentStepData.image" :alt="currentStepData.title" class="w-full h-full object-cover pointer-events-none" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div class="absolute bottom-3 left-3 flex items-center gap-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg" :style="{ background: color }">
                  {{ currentStep + 1 }}
                </div>
                <span class="text-white font-label-lg drop-shadow-lg">{{ currentStepData.title }}</span>
              </div>
            </div>
            <div class="px-6 py-6">
              <p class="font-body-lg text-body-lg text-on-surface leading-relaxed">{{ currentStepData.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Finished Screen -->
      <div v-else class="flex-1 overflow-y-auto">
        <div class="flex flex-col items-center px-6 py-10 max-w-lg mx-auto">
          <div class="w-20 h-20 rounded-full bg-success-soft flex items-center justify-center text-5xl mb-6">🎉</div>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-text-main text-center mb-2">Proyek Selesai!</h2>
          <p class="font-body-md text-body-md text-on-surface-variant text-center mb-8">{{ project.title }}</p>
          <div class="w-full grid grid-cols-2 gap-3 mb-6">
            <div class="bg-white rounded-2xl p-4 soft-shadow border border-outline-variant text-center">
              <p class="text-sm text-on-surface-variant mb-1">Durasi</p>
              <p class="font-label-lg text-label-lg text-primary">⏱ {{ project.duration }}</p>
            </div>
            <div class="bg-white rounded-2xl p-4 soft-shadow border border-outline-variant text-center">
              <p class="text-sm text-on-surface-variant mb-1">Tingkat</p>
              <p class="font-label-lg text-label-lg text-primary">📊 {{ project.difficulty }}</p>
            </div>
          </div>
          <div class="w-full bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: color }">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" :style="{ background: bg }">💡</div>
              <h3 class="font-headline-md text-headline-md">Tips</h3>
            </div>
            <p class="font-body-lg text-body-lg text-on-surface leading-relaxed">{{ project.tips }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="border-t border-outline-variant bg-white px-4 py-3 shrink-0">
        <div v-if="!isFinished" class="flex items-center justify-center gap-1.5 mb-3 overflow-x-auto px-2">
          <button @click="goToMaterials"
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0"
            :class="currentStep === -1 ? 'text-white scale-110' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'"
            :style="currentStep === -1 ? { background: color } : {}">
            📦
          </button>
          <button v-for="(step, i) in project.steps" :key="i"
            @click="goToStep(i)"
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0"
            :class="currentStep === i ? 'text-white scale-110' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'"
            :style="currentStep === i ? { background: color } : {}">
            {{ i + 1 }}
          </button>
        </div>
        <div class="flex items-center justify-between gap-3">
          <button @click="isFinished ? backToSteps() : prevPage()" :disabled="!isFinished && currentStep === -1"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg transition-all"
            :class="!isFinished && currentStep === -1 ? 'bg-surface-container-low text-outline-variant cursor-not-allowed' : 'bg-surface-container-low text-primary hover:bg-surface-container'">
            <span class="material-symbols-outlined">arrow_back</span>
            {{ isFinished ? 'Lihat Langkah' : 'Sebelumnya' }}
          </button>
          <button @click="nextPage"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg text-white transition-all"
            :style="{ background: color }">
            {{ isFinished ? 'Tutup' : currentStep === project.steps.length - 1 ? 'Selesai' : 'Selanjutnya' }}
            <span class="material-symbols-outlined">{{ isFinished ? 'close' : currentStep === project.steps.length - 1 ? 'check' : 'arrow_forward' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  project: { type: Object, required: true },
  color: { type: String, default: '#2196F3' },
  bg: { type: String, default: '#E3F2FD' }
})

const emit = defineEmits(['close'])

const currentStep = ref(-1)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const isFinished = ref(false)
const SWIPE_THRESHOLD = 50

const totalPages = computed(() => 1 + props.project.steps.length)
const currentPageDisplay = computed(() => currentStep.value + 2)
const currentStepData = computed(() => props.project.steps[currentStep.value])

function getClientX(e) { return e.touches ? e.touches[0].clientX : e.clientX }
function onDragStart(e) { isDragging.value = true; dragStartX.value = getClientX(e); dragOffset.value = 0 }
function onDragMove(e) { if (!isDragging.value) return; e.preventDefault(); dragOffset.value = getClientX(e) - dragStartX.value }
function onDragEnd() {
  if (!isDragging.value) return; isDragging.value = false
  if (dragOffset.value < -SWIPE_THRESHOLD) nextPage()
  else if (dragOffset.value > SWIPE_THRESHOLD) prevPage()
  dragOffset.value = 0
}
function goToMaterials() { currentStep.value = -1 }
function goToStep(i) { currentStep.value = i }
function prevPage() { if (currentStep.value > -1) currentStep.value-- }
function nextPage() {
  if (isFinished.value) { emit('close'); return }
  if (currentStep.value < props.project.steps.length - 1) currentStep.value++
  else isFinished.value = true
}
function backToSteps() { isFinished.value = false }
</script>
