<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-headline-sm text-text-main flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">schedule</span> Jadwal Harian
      </h3>
      <button class="text-primary text-sm font-bold bg-success-soft px-4 py-1.5 rounded-full">Ubah</button>
    </div>
    <div class="space-y-2">
      <div v-for="s in schedules" :key="s.time"
        class="bg-white p-4 rounded-2xl flex items-center justify-between soft-shadow">
        <div class="flex items-center gap-3">
          <span class="font-label-sm text-on-surface-variant">{{ s.time }}</span>
          <span class="font-body-md text-sm">{{ s.label }}</span>
        </div>
        <span class="material-symbols-outlined"
          :class="s.done ? 'text-growth-green' : 'text-outline-variant'">
          {{ s.done ? 'check_circle' : 'radio_button_unchecked' }}
        </span>
      </div>
      <div v-if="!schedules.length"
        class="bg-white/70 rounded-2xl p-6 soft-shadow text-center text-sm text-on-surface-variant">
        Belum ada jadwal
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  schedules: { type: Array, default: () => [] }
})
</script>
