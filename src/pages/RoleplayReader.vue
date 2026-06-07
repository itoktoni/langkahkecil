<template>
  <div class="fixed inset-0 z-[100] bg-black/50 flex items-end lg:items-center justify-center" @click.self="$emit('close')">
    <div class="bg-canvas-cream w-full h-full lg:rounded-[32px] lg:max-w-2xl lg:max-h-[85vh] lg:h-auto flex flex-col overflow-hidden soft-shadow lg:mx-4"
      style="box-shadow: 0 25px 60px rgba(0,0,0,0.15);">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant bg-white shrink-0">
        <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 class="font-headline-md text-headline-md text-center flex-1 px-2 truncate">{{ roleplay.title }}</h3>
        <span class="text-sm font-bold text-on-surface-variant bg-surface-container-low rounded-full px-3 py-1">
          {{ isFinished ? 'Selesai' : `${currentPage.num}/${roleplay.pages.length}` }}
        </span>
      </div>

      <!-- Page Content -->
      <div v-if="!isFinished" class="flex-1 overflow-hidden relative select-none"
        @mousedown="onDragStart" @mousemove="onDragMove" @mouseup="onDragEnd" @mouseleave="onDragEnd"
        @touchstart="onDragStart" @touchmove="onDragMove" @touchend="onDragEnd">
        <div class="h-full overflow-y-auto"
          :style="{ transform: `translateX(${dragOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }">
          <div class="flex flex-col">
            <!-- Image -->
            <div class="w-full h-[220px] lg:h-[260px] overflow-hidden bg-surface-container-low shrink-0">
              <img :src="currentPage.image" :alt="currentPage.narrator" class="w-full h-full object-cover pointer-events-none" />
            </div>
            <!-- Content -->
            <div class="px-5 py-5 space-y-4">
              <!-- Narrator -->
              <div class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-lg">auto_stories</span>
                    <span class="font-label-lg text-label-lg text-primary">Narator</span>
                  </div>
                  <button @click="speakNarrator" class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    :class="isSpeakingNarrator ? 'bg-error text-on-error' : 'bg-success-soft text-primary'">
                    <span class="material-symbols-outlined text-lg">{{ isSpeakingNarrator ? 'stop' : 'volume_up' }}</span>
                  </button>
                </div>
                <p class="font-body-md text-body-md text-on-surface leading-relaxed">{{ currentPage.narrator }}</p>
              </div>
              <!-- Dialogs -->
              <div v-for="(d, i) in currentPage.dialog" :key="i"
                class="flex gap-3"
                :class="isRightRole(d.role) ? 'flex-row-reverse' : ''">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-2"
                  :style="{ background: getRoleColor(d.role).bg, borderColor: getRoleColor(d.role).border }">
                  {{ getRoleEmoji(d.role) }}
                </div>
                <div class="max-w-[75%]">
                  <span class="text-xs font-bold mb-1 block"
                    :class="isRightRole(d.role) ? 'text-right' : ''"
                    :style="{ color: getRoleColor(d.role).text }">
                    {{ d.role }}
                  </span>
                  <div class="rounded-2xl px-4 py-3 border"
                    :style="{
                      background: getRoleColor(d.role).bg,
                      borderColor: getRoleColor(d.role).border
                    }"
                    :class="isRightRole(d.role) ? 'rounded-tr-sm' : 'rounded-tl-sm'">
                    <p class="text-sm leading-relaxed" :style="{ color: getRoleColor(d.role).text }">{{ d.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Finished Screen -->
      <div v-else class="flex-1 overflow-y-auto">
        <div class="flex flex-col items-center px-6 py-10 max-w-lg mx-auto">
          <div class="w-20 h-20 rounded-full bg-success-soft flex items-center justify-center text-5xl mb-6">🎭</div>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-text-main text-center mb-2">Selesai!</h2>
          <p class="font-body-md text-body-md text-on-surface-variant text-center mb-8">{{ roleplay.title }}</p>
          <!-- Roles -->
          <div class="w-full grid grid-cols-2 gap-3 mb-6">
            <div v-for="role in roleplay.roles" :key="role.name" class="bg-white rounded-2xl p-4 soft-shadow border border-outline-variant text-center">
              <div class="text-3xl mb-2">{{ role.emoji }}</div>
              <p class="font-label-lg text-label-lg text-primary">{{ role.name }}</p>
              <p class="text-xs text-on-surface-variant mt-1">{{ role.desc }}</p>
            </div>
          </div>
          <!-- Moral -->
          <div class="w-full bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: color }">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" :style="{ background: bg }">💬</div>
              <h3 class="font-headline-md text-headline-md">Pelajaran</h3>
            </div>
            <p class="font-body-lg text-body-lg text-on-surface leading-relaxed">{{ roleplay.moral }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="border-t border-outline-variant bg-white px-4 py-3 shrink-0">
        <div v-if="!isFinished" class="flex items-center justify-center gap-1.5 mb-3 overflow-x-auto px-2">
          <button v-for="page in roleplay.pages" :key="page.num"
            @click="goToPage(page.num - 1)"
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0"
            :class="currentPageIndex === page.num - 1 ? 'text-white scale-110' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'"
            :style="currentPageIndex === page.num - 1 ? { background: color } : {}">
            {{ page.num }}
          </button>
        </div>
        <div class="flex items-center justify-between gap-3">
          <button @click="isFinished ? backToLastPage() : prevPage()" :disabled="!isFinished && currentPageIndex === 0"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg transition-all"
            :class="!isFinished && currentPageIndex === 0 ? 'bg-surface-container-low text-outline-variant cursor-not-allowed' : 'bg-surface-container-low text-primary hover:bg-surface-container'">
            <span class="material-symbols-outlined">arrow_back</span>
            {{ isFinished ? 'Baca Lagi' : 'Sebelumnya' }}
          </button>
          <button @click="nextPage"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-label-lg text-white transition-all"
            :style="{ background: color }">
            {{ isFinished ? 'Tutup' : currentPageIndex === roleplay.pages.length - 1 ? 'Selesai' : 'Selanjutnya' }}
            <span class="material-symbols-outlined">{{ isFinished ? 'close' : currentPageIndex === roleplay.pages.length - 1 ? 'check' : 'arrow_forward' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  roleplay: { type: Object, required: true },
  color: { type: String, default: '#FF9800' },
  bg: { type: String, default: '#FFF3E0' }
})

const emit = defineEmits(['close'])

const currentPageIndex = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const isFinished = ref(false)
const isSpeakingNarrator = ref(false)
const SWIPE_THRESHOLD = 50

const currentPage = computed(() => props.roleplay.pages[currentPageIndex.value])

const rightRoles = ['Pembeli', 'Pasien', 'Anak']
const mainRoles = ['Pedagang', 'Dokter', 'Ibu', 'Nenek']
const emojiMap = { Pedagang: '👨‍🍳', Dokter: '👨‍⚕️', Pembeli: '👩', Pasien: '🧒', Ibu: '👩', Anak: '🧒', Nenek: '👵' }

const roleColorPalette = [
  { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
  { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
  { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
  { bg: '#F3E5F5', border: '#9C27B0', text: '#6A1B9A' },
  { bg: '#FFEBEE', border: '#F44336', text: '#C62828' },
  { bg: '#E0F2F1', border: '#009688', text: '#00695C' },
  { bg: '#FFF8E1', border: '#FFC107', text: '#F57F17' },
]

const roleColors = {}
let colorIndex = 0

function getRoleColor(role) {
  if (!roleColors[role]) {
    roleColors[role] = roleColorPalette[colorIndex % roleColorPalette.length]
    colorIndex++
  }
  return roleColors[role]
}

function isRightRole(role) { return rightRoles.includes(role) }
function isMainRole(role) { return mainRoles.includes(role) }
function getRoleEmoji(role) { return emojiMap[role] || '👤' }

function getClientX(e) { return e.touches ? e.touches[0].clientX : e.clientX }
function onDragStart(e) { isDragging.value = true; dragStartX.value = getClientX(e); dragOffset.value = 0 }
function onDragMove(e) { if (!isDragging.value) return; e.preventDefault(); dragOffset.value = getClientX(e) - dragStartX.value }
function onDragEnd() {
  if (!isDragging.value) return; isDragging.value = false
  if (dragOffset.value < -SWIPE_THRESHOLD) nextPage()
  else if (dragOffset.value > SWIPE_THRESHOLD) prevPage()
  dragOffset.value = 0
}
function goToPage(index) { stopSpeech(); currentPageIndex.value = index }
function prevPage() { if (currentPageIndex.value > 0) { stopSpeech(); currentPageIndex.value-- } }
function nextPage() {
  if (isFinished.value) { emit('close'); return }
  stopSpeech()
  if (currentPageIndex.value < props.roleplay.pages.length - 1) currentPageIndex.value++
  else isFinished.value = true
}
function backToLastPage() { isFinished.value = false }

function speakNarrator() {
  if (!('speechSynthesis' in window)) return
  if (isSpeakingNarrator.value) { stopSpeech(); return }
  stopSpeech()
  const u = new SpeechSynthesisUtterance(currentPage.value.narrator)
  u.lang = 'id-ID'; u.rate = 0.9; u.pitch = 1.1
  u.onend = () => { isSpeakingNarrator.value = false }
  u.onerror = () => { isSpeakingNarrator.value = false }
  speechSynthesis.speak(u)
  isSpeakingNarrator.value = true
}

function stopSpeech() {
  if ('speechSynthesis' in window) speechSynthesis.cancel()
  isSpeakingNarrator.value = false
}

onUnmounted(() => stopSpeech())
</script>
