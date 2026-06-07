<template>
  <div class="fixed inset-0 z-[100] bg-black/50 flex items-end lg:items-center justify-center" @click.self="$emit('close')">
    <div class="bg-canvas-cream w-full h-full lg:rounded-[32px] lg:max-w-2xl lg:max-h-[85vh] lg:h-auto flex flex-col overflow-hidden soft-shadow lg:mx-4"
      style="box-shadow: 0 25px 60px rgba(0,0,0,0.15);">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant bg-white shrink-0">
        <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 class="font-headline-md text-headline-md text-center flex-1 px-2 truncate">{{ story.title }}</h3>
        <span class="text-sm font-bold text-on-surface-variant bg-surface-container-low rounded-full px-3 py-1">
          {{ isFinished ? 'Selesai' : `${currentPage.num}/${story.pages.length}` }}
        </span>
      </div>

      <!-- Page Content with Swipe -->
      <div v-if="!isFinished" class="flex-1 overflow-hidden relative select-none"
        @mousedown="onDragStart"
        @mousemove="onDragMove"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd"
        @touchstart="onDragStart"
        @touchmove="onDragMove"
        @touchend="onDragEnd">
        <div class="h-full overflow-y-auto"
          :style="{ transform: `translateX(${dragOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }">
          <div class="flex flex-col items-center">
            <!-- Image -->
            <div class="w-full h-[350px] lg:h-[400px] overflow-hidden bg-surface-container-low">
              <img :src="currentPage.image" :alt="currentPage.text"
                class="w-full h-full object-cover pointer-events-none" />
            </div>
            <!-- Text -->
            <div class="px-6 lg:px-10 py-6 max-w-lg w-full">
              <p class="font-body-lg text-body-lg text-on-surface leading-relaxed text-center">
                {{ currentPage.text }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Finished / Moral Screen -->
      <div v-else class="flex-1 overflow-y-auto">
        <div class="flex flex-col items-center px-6 lg:px-10 py-10 max-w-lg mx-auto">
          <!-- Celebration -->
          <div class="w-20 h-20 rounded-full bg-success-soft flex items-center justify-center text-5xl mb-6">
            🎉
          </div>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-text-main text-center mb-2">
            Cerita Selesai!
          </h2>
          <p class="font-body-md text-body-md text-on-surface-variant text-center mb-8">
            {{ story.title }}
          </p>
          <!-- Moral Card -->
          <div class="w-full bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: color }">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                :style="{ background: bg }">💬</div>
              <h3 class="font-headline-md text-headline-md">Pelajaran</h3>
            </div>
            <p class="font-body-lg text-body-lg text-on-surface leading-relaxed">
              {{ story.moral }}
            </p>
          </div>
          <!-- TTS for Moral -->
          <button @click="speakMoral"
            class="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full font-label-lg transition-all"
            :class="isSpeakingMoral ? 'bg-error text-on-error' : 'bg-success-soft text-primary'">
            <span class="material-symbols-outlined text-xl">{{ isSpeakingMoral ? 'stop' : 'volume_up' }}</span>
            {{ isSpeakingMoral ? 'Berhenti' : 'Dengarkan Pelajaran' }}
          </button>
        </div>
      </div>

      <!-- TTS Button (only when reading) -->
      <div v-if="!isFinished" class="flex justify-center px-5 py-2 bg-white border-t border-outline-variant shrink-0">
        <button @click="toggleSpeech"
          class="flex items-center gap-2 px-5 py-2 rounded-full font-label-lg transition-all"
          :class="isSpeaking ? 'bg-error text-on-error' : 'bg-success-soft text-primary'">
          <span class="material-symbols-outlined text-xl">{{ isSpeaking ? 'stop' : 'volume_up' }}</span>
          {{ isSpeaking ? 'Berhenti' : 'Dengarkan' }}
        </button>
      </div>

      <!-- Bottom Navigation -->
      <div class="border-t border-outline-variant bg-white px-4 py-3 shrink-0">
        <div v-if="!isFinished" class="flex items-center justify-center gap-1.5 mb-3 overflow-x-auto px-2">
          <button v-for="page in story.pages" :key="page.num"
            @click="goToPage(page.num - 1)"
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0"
            :class="currentPageIndex === page.num - 1
              ? 'text-white scale-110'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'"
            :style="currentPageIndex === page.num - 1 ? { background: color } : {}">
            {{ page.num }}
          </button>
        </div>
        <div class="flex items-center justify-between gap-3">
          <button @click="isFinished ? backToLastPage() : prevPage()" :disabled="!isFinished && currentPageIndex === 0"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg transition-all"
            :class="!isFinished && currentPageIndex === 0
              ? 'bg-surface-container-low text-outline-variant cursor-not-allowed'
              : 'bg-surface-container-low text-primary hover:bg-surface-container'">
            <span class="material-symbols-outlined">arrow_back</span>
            {{ isFinished ? 'Baca Lagi' : 'Sebelumnya' }}
          </button>
          <button @click="nextPage"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg text-white transition-all"
            :style="{ background: color }">
            {{ isFinished ? 'Tutup' : currentPageIndex === story.pages.length - 1 ? 'Selesai' : 'Selanjutnya' }}
            <span class="material-symbols-outlined">{{ isFinished ? 'close' : currentPageIndex === story.pages.length - 1 ? 'check' : 'arrow_forward' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  story: { type: Object, required: true },
  color: { type: String, default: '#176c33' },
  bg: { type: String, default: '#E1F2E5' }
})

const emit = defineEmits(['close'])

const currentPageIndex = ref(0)
const isSpeaking = ref(false)
const isSpeakingMoral = ref(false)
let utterance = null

const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const SWIPE_THRESHOLD = 50

const isFinished = ref(false)

const currentPage = computed(() => props.story.pages[currentPageIndex.value])

function getClientX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX
}

function onDragStart(e) {
  isDragging.value = true
  dragStartX.value = getClientX(e)
  dragOffset.value = 0
}

function onDragMove(e) {
  if (!isDragging.value) return
  e.preventDefault()
  dragOffset.value = getClientX(e) - dragStartX.value
}

function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragOffset.value < -SWIPE_THRESHOLD) nextPage()
  else if (dragOffset.value > SWIPE_THRESHOLD) prevPage()
  dragOffset.value = 0
}

function goToPage(index) {
  stopSpeech()
  currentPageIndex.value = index
}

function prevPage() {
  if (currentPageIndex.value > 0) {
    stopSpeech()
    currentPageIndex.value--
  }
}

function nextPage() {
  if (isFinished.value) {
    emit('close')
    return
  }
  stopSpeech()
  if (currentPageIndex.value < props.story.pages.length - 1) {
    currentPageIndex.value++
  } else {
    isFinished.value = true
  }
}

function backToLastPage() {
  isFinished.value = false
  stopSpeech()
}

function toggleSpeech() {
  if (isSpeaking.value) stopSpeech()
  else speak()
}

function speak() {
  if (!('speechSynthesis' in window)) return
  stopSpeech()
  utterance = new SpeechSynthesisUtterance(currentPage.value.text)
  utterance.lang = 'id-ID'
  utterance.rate = 0.9
  utterance.pitch = 1.1
  utterance.onend = () => { isSpeaking.value = false }
  utterance.onerror = () => { isSpeaking.value = false }
  speechSynthesis.speak(utterance)
  isSpeaking.value = true
}

function speakMoral() {
  if (!('speechSynthesis' in window)) return
  if (isSpeakingMoral.value) {
    speechSynthesis.cancel()
    isSpeakingMoral.value = false
    return
  }
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(props.story.moral)
  u.lang = 'id-ID'
  u.rate = 0.9
  u.pitch = 1.1
  u.onend = () => { isSpeakingMoral.value = false }
  u.onerror = () => { isSpeakingMoral.value = false }
  speechSynthesis.speak(u)
  isSpeakingMoral.value = true
}

function stopSpeech() {
  if ('speechSynthesis' in window) speechSynthesis.cancel()
  isSpeaking.value = false
  isSpeakingMoral.value = false
}

onUnmounted(() => stopSpeech())
</script>
