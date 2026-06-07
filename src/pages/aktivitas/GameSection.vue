<template>
  <div class="space-y-4">
    <div v-for="game in games" :key="game.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: color }">
      <h3 class="font-headline-md text-headline-md mb-3">{{ game.title }}</h3>
      <p class="font-body-md text-body-md text-on-surface-variant mb-4">{{ game.how }}</p>
      <div class="bg-surface-container-low rounded-2xl p-4 mb-3">
        <p class="font-label-lg text-label-lg text-primary mb-2">📋 Aturan</p>
        <ul class="space-y-2">
          <li v-for="(rule, i) in game.rules" :key="i" class="flex items-start gap-2 text-sm text-on-surface-variant">
            <span class="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
            {{ rule }}
          </li>
        </ul>
      </div>
      <div class="bg-success-soft rounded-2xl p-4">
        <p class="font-label-lg text-label-lg text-primary mb-1">💬 Pelajaran</p>
        <p class="text-sm text-on-surface-variant">{{ game.moral }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  games: { type: Array, required: true },
  color: { type: String, default: '#E91E63' }
})
</script>
