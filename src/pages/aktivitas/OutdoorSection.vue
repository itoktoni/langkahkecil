<template>
  <div class="space-y-4">
    <div v-for="act in activities" :key="act.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: color }">
      <h3 class="font-headline-md text-headline-md mb-3">🌿 {{ act.title }}</h3>
      <ol class="space-y-3 mb-4">
        <li v-for="(step, i) in act.steps" :key="i" class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" :style="{ background: color }">{{ i + 1 }}</div>
          <p class="font-body-md text-body-md text-on-surface-variant pt-1">{{ step }}</p>
        </li>
      </ol>
      <div class="bg-[#D7EDFF] rounded-2xl p-4">
        <p class="font-label-lg text-label-lg text-on-tertiary-fixed mb-1">🔍 Pengamatan</p>
        <p class="text-sm text-on-surface-variant">{{ act.observation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: { type: Array, required: true },
  color: { type: String, default: '#009688' }
})
</script>
