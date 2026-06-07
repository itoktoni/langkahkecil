<template>
  <div class="space-y-4">
    <div v-for="sc in scripts" :key="sc.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: color }">
      <h3 class="font-headline-md text-headline-md mb-3">🎤 {{ sc.title }}</h3>
      <div class="bg-surface-container-low rounded-2xl p-5 mb-4">
        <p class="font-body-md text-body-md text-on-surface-variant italic leading-relaxed">"{{ sc.script }}"</p>
      </div>
      <div class="bg-[#D7EDFF] rounded-2xl p-4">
        <p class="font-label-lg text-label-lg text-on-tertiary-fixed mb-2">💡 Tips</p>
        <ul class="space-y-1.5">
          <li v-for="(tip, i) in sc.tips" :key="i" class="flex items-start gap-2 text-sm text-on-surface-variant">
            <span class="material-symbols-outlined text-tertiary text-lg mt-0.5">lightbulb</span>
            {{ tip }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  scripts: { type: Array, required: true },
  color: { type: String, default: '#9C27B0' }
})
</script>
