<template>
  <div class="space-y-4">
    <div v-for="song in songs" :key="song.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: color }">
      <h3 class="font-headline-md text-headline-md mb-3">🎵 {{ song.title }}</h3>
      <div class="bg-surface-container-low rounded-2xl p-5 mb-4">
        <p class="font-body-md text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">{{ song.lyrics }}</p>
      </div>
      <div class="bg-[#D7EDFF] rounded-2xl p-4 mb-3">
        <p class="font-label-lg text-label-lg text-on-tertiary-fixed mb-2">💃 Gerakan</p>
        <ul class="space-y-1.5">
          <li v-for="(move, i) in song.moves" :key="i" class="flex items-start gap-2 text-sm text-on-surface-variant">
            <span class="font-bold text-tertiary shrink-0">{{ i + 1 }}.</span>{{ move }}
          </li>
        </ul>
      </div>
      <div class="bg-success-soft rounded-2xl p-4">
          <p class="font-label-lg text-label-lg text-primary mb-1"><span class="w-6 h-6 rounded-full bg-success-soft border-2 border-[#B7D9BC] inline-flex items-center justify-center text-xs align-middle mr-1">💬</span> Pelajaran</p>
        <p class="text-sm text-on-surface-variant">{{ song.moral }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  songs: { type: Array, required: true },
  color: { type: String, default: '#FF5722' }
})
</script>
