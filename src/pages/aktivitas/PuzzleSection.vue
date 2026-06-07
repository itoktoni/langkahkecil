<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="pz in puzzles" :key="pz.title"
      class="bento-card group bg-white rounded-[28px] soft-shadow overflow-hidden border cursor-pointer transition-all hover:shadow-xl flex flex-col"
      :style="{ borderColor: color }"
      @click="$emit('open-puzzle', pz)">
      <div class="p-5 pb-3 flex items-center justify-between" :style="{ background: bg }">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style="background: white">🧩</div>
        <span class="bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-primary">
          {{ pz.questions.length }} soal
        </span>
      </div>
      <div class="p-5 pt-3 flex flex-col flex-1">
        <h3 class="font-headline-md text-headline-md mb-2">{{ pz.title }}</h3>
        <p class="text-sm text-on-surface-variant mb-3">{{ pz.desc }}</p>
        <div class="flex items-center gap-2 text-primary font-label-lg mt-auto pt-3 border-t border-outline-variant">
          <span class="material-symbols-outlined text-xl">psychology</span>
          Mulai Teka-Teki
          <span class="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  puzzles: { type: Array, required: true },
  color: { type: String, default: '#673AB7' },
  bg: { type: String, default: '#EDE7F6' }
})
defineEmits(['open-puzzle'])
</script>
