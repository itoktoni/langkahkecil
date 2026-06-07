<template>
  <div>
    <h3 class="font-headline-sm text-text-main flex items-center gap-2 mb-3">
      <span class="material-symbols-outlined text-friendly-sky">fact_check</span> Checklist Harian
    </h3>
    <div class="bg-white p-5 rounded-[24px] soft-shadow space-y-3">
      <AppCheckbox v-for="(item, i) in checklist" :key="i"
        v-model="item.done"
        :label="item.label" />
      <div v-if="!checklist.length"
        class="text-center text-sm text-on-surface-variant py-3">
        Belum ada checklist
      </div>
    </div>
  </div>
</template>

<script setup>
import AppCheckbox from '../components/AppCheckbox.vue'

defineProps({
  checklist: { type: Array, default: () => [] }
})
</script>
