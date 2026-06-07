<template>
  <div class="fixed inset-0 z-[100] bg-black/50 flex items-end lg:items-center justify-center" @click.self="$emit('close')">
    <div class="bg-canvas-cream w-full h-full lg:rounded-[32px] lg:max-w-2xl lg:max-h-[85vh] lg:h-auto flex flex-col overflow-hidden soft-shadow lg:mx-4"
      style="box-shadow: 0 25px 60px rgba(0,0,0,0.15);">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant bg-white shrink-0">
        <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 class="font-headline-md text-headline-md text-center flex-1 px-2 truncate">{{ puzzle.title }}</h3>
        <span class="text-sm font-bold text-on-surface-variant bg-surface-container-low rounded-full px-3 py-1">
          {{ isFinished ? 'Selesai' : `${currentQ + 1}/${puzzle.questions.length}` }}
        </span>
      </div>

      <!-- Question Content -->
      <div v-if="!isFinished" class="flex-1 overflow-hidden relative select-none"
        @mousedown="onDragStart" @mousemove="onDragMove" @mouseup="onDragEnd" @mouseleave="onDragEnd"
        @touchstart="onDragStart" @touchmove="onDragMove" @touchend="onDragEnd">
        <div class="h-full overflow-y-auto"
          :style="{ transform: `translateX(${dragOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }">
          <div class="flex flex-col items-center px-6 py-8">
            <!-- Question Number -->
            <div class="mb-6">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-xl"
                :style="{ background: color }">
                {{ currentQ + 1 }}
              </span>
            </div>
            <!-- Question -->
            <div class="w-full bg-white rounded-[28px] p-6 soft-shadow border mb-6" :style="{ borderColor: color }">
              <p class="font-body-lg text-body-lg text-on-surface leading-relaxed text-center">
                {{ currentQuestion.q }}
              </p>
            </div>
            <!-- Hint (toggle) -->
            <button @click="showHint = !showHint"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 transition-all"
              :class="showHint ? 'bg-[#D7EDFF] text-on-tertiary-fixed' : 'bg-surface-container-low text-on-surface-variant'">
              <span class="material-symbols-outlined text-lg">{{ showHint ? 'visibility_off' : 'visibility' }}</span>
              {{ showHint ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk' }}
            </button>
            <div v-if="showHint" class="w-full bg-[#D7EDFF] rounded-2xl p-4 mb-6 fade-in-up">
              <p class="text-sm text-on-tertiary-fixed text-center">💡 {{ currentQuestion.hint }}</p>
            </div>
            <!-- Answer (toggle) -->
            <button @click="showAnswer = !showAnswer"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 transition-all"
              :class="showAnswer ? 'bg-success-soft text-primary' : 'bg-surface-container-low text-on-surface-variant'">
              <span class="material-symbols-outlined text-lg">{{ showAnswer ? 'visibility_off' : 'check_circle' }}</span>
              {{ showAnswer ? 'Sembunyikan Jawaban' : 'Lihat Jawaban' }}
            </button>
            <div v-if="showAnswer" class="w-full bg-success-soft rounded-2xl p-4 mb-6 fade-in-up">
              <p class="font-headline-md text-headline-md text-primary text-center">✅ {{ currentQuestion.a }}</p>
            </div>
            <!-- Benar / Salah Buttons -->
            <div v-if="answers[currentQ] === undefined" class="w-full flex gap-3 mb-4">
              <button @click="answer(true)"
                class="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-label-lg text-white bg-[#4CAF50] hover:bg-[#388E3C] transition-all active:scale-95 shadow-lg shadow-green-500/25">
                <span class="material-symbols-outlined text-2xl">check_circle</span>
                Benar!
              </button>
              <button @click="answer(false)"
                class="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-label-lg text-white bg-[#F44336] hover:bg-[#D32F2F] transition-all active:scale-95 shadow-lg shadow-red-500/25">
                <span class="material-symbols-outlined text-2xl">cancel</span>
                Salah
              </button>
            </div>
            <!-- Answered Feedback -->
            <div v-else class="w-full rounded-2xl p-4 mb-4 text-center fade-in-up"
              :class="answers[currentQ] ? 'bg-success-soft' : 'bg-error-container'">
              <p class="font-headline-md text-headline-md"
                :class="answers[currentQ] ? 'text-primary' : 'text-error'">
                {{ answers[currentQ] ? '✅ Benar!' : '❌ Salah' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Finished Screen -->
      <div v-else class="flex-1 overflow-y-auto">
        <div class="flex flex-col items-center px-6 py-10 max-w-lg mx-auto">
          <!-- Score Circle -->
          <div class="relative w-32 h-32 mb-6">
            <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#E0E0E0" stroke-width="10" />
              <circle cx="60" cy="60" r="50" fill="none" :stroke="scoreColor" stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="314"
                :stroke-dashoffset="314 - (314 * score / 100)"
                class="transition-all duration-1000" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold" :style="{ color: scoreColor }">{{ score }}</span>
              <span class="text-xs text-on-surface-variant">dari 100</span>
            </div>
          </div>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-text-main text-center mb-2">
            {{ score >= 80 ? 'Luar Biasa! 🎉' : score >= 50 ? 'Bagus! 👍' : 'Terus Belajar! 💪' }}
          </h2>
          <p class="font-body-md text-body-md text-on-surface-variant text-center mb-8">{{ puzzle.title }}</p>
          <!-- Stats -->
          <div class="w-full grid grid-cols-2 gap-3 mb-6">
            <div class="bg-success-soft rounded-2xl p-4 text-center">
              <p class="text-sm text-on-surface-variant mb-1">Benar</p>
              <p class="font-headline-md text-primary text-2xl">{{ correctCount }}</p>
            </div>
            <div class="bg-error-container rounded-2xl p-4 text-center">
              <p class="text-sm text-on-surface-variant mb-1">Salah</p>
              <p class="font-headline-md text-error text-2xl">{{ wrongCount }}</p>
            </div>
          </div>
          <!-- Detail -->
          <div class="w-full bg-white rounded-[28px] p-5 soft-shadow border" :style="{ borderColor: color }">
            <p class="font-label-lg text-label-lg text-primary mb-3">Detail Jawaban</p>
            <div class="space-y-2">
              <div v-for="(q, i) in puzzle.questions" :key="i"
                class="flex items-center gap-3 bg-surface-container-low rounded-xl p-3">
                <span class="material-symbols-outlined text-lg"
                  :class="answers[i] ? 'text-primary' : 'text-error'">
                  {{ answers[i] ? 'check_circle' : 'cancel' }}
                </span>
                <p class="text-sm text-on-surface flex-1 truncate">{{ q.q }}</p>
                <span class="text-xs font-bold" :class="answers[i] ? 'text-primary' : 'text-error'">
                  {{ answers[i] ? 'Benar' : 'Salah' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="border-t border-outline-variant bg-white px-4 py-3 shrink-0">
        <div v-if="!isFinished" class="flex items-center justify-center gap-1.5 mb-3 overflow-x-auto px-2">
          <button v-for="(q, i) in puzzle.questions" :key="i"
            @click="goToQ(i)"
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0"
            :class="currentQ === i ? 'text-white scale-110' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'"
            :style="currentQ === i ? { background: color } : {}">
            {{ i + 1 }}
          </button>
        </div>
        <div class="flex items-center justify-between gap-3">
          <button @click="isFinished ? backToQ() : prevQ()" :disabled="!isFinished && currentQ === 0"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg transition-all"
            :class="!isFinished && currentQ === 0 ? 'bg-surface-container-low text-outline-variant cursor-not-allowed' : 'bg-surface-container-low text-primary hover:bg-surface-container'">
            <span class="material-symbols-outlined">arrow_back</span>
            {{ isFinished ? 'Main Lagi' : 'Sebelumnya' }}
          </button>
          <button @click="nextQ"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg text-white transition-all"
            :style="{ background: color }">
            {{ isFinished ? 'Tutup' : currentQ === puzzle.questions.length - 1 ? 'Selesai' : 'Selanjutnya' }}
            <span class="material-symbols-outlined">{{ isFinished ? 'close' : currentQ === puzzle.questions.length - 1 ? 'check' : 'arrow_forward' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  puzzle: { type: Object, required: true },
  color: { type: String, default: '#673AB7' },
  bg: { type: String, default: '#EDE7F6' }
})

const emit = defineEmits(['close'])

const currentQ = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const isFinished = ref(false)
const showHint = ref(false)
const showAnswer = ref(false)
const answers = ref({})
const SWIPE_THRESHOLD = 50

const currentQuestion = computed(() => props.puzzle.questions[currentQ.value])

const correctCount = computed(() => Object.values(answers.value).filter(v => v === true).length)
const wrongCount = computed(() => Object.values(answers.value).filter(v => v === false).length)
const score = computed(() => {
  const total = props.puzzle.questions.length
  if (total === 0) return 0
  return Math.round((correctCount.value / total) * 100)
})
const scoreColor = computed(() => score.value >= 80 ? '#4CAF50' : score.value >= 50 ? '#FF9800' : '#F44336')

function answer(isCorrect) {
  answers.value[currentQ.value] = isCorrect
}

function getClientX(e) { return e.touches ? e.touches[0].clientX : e.clientX }
function onDragStart(e) { isDragging.value = true; dragStartX.value = getClientX(e); dragOffset.value = 0 }
function onDragMove(e) { if (!isDragging.value) return; e.preventDefault(); dragOffset.value = getClientX(e) - dragStartX.value }
function onDragEnd() {
  if (!isDragging.value) return; isDragging.value = false
  if (dragOffset.value < -SWIPE_THRESHOLD) nextQ()
  else if (dragOffset.value > SWIPE_THRESHOLD) prevQ()
  dragOffset.value = 0
}
function goToQ(i) { currentQ.value = i; showHint.value = false; showAnswer.value = false }
function prevQ() { if (currentQ.value > 0) { currentQ.value--; showHint.value = false; showAnswer.value = false } }
function nextQ() {
  if (isFinished.value) { emit('close'); return }
  if (currentQ.value < props.puzzle.questions.length - 1) { currentQ.value++; showHint.value = false; showAnswer.value = false }
  else isFinished.value = true
}
function backToQ() { isFinished.value = false; answers.value = {} }
</script>
