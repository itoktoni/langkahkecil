<template>
  <div class="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 soft-shadow w-fit">
    <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm" :style="{ background: selectedAnak?.bg }">{{ selectedAnak?.emoji }}</span>
    <select :value="modelValue"
      class="bg-transparent text-sm font-medium text-text-main focus:outline-none appearance-none pr-4 cursor-pointer"
      @change="$emit('update:modelValue', Number($event.target.value))">
      <option v-for="anak in anakList" :key="anak.id" :value="anak.id">{{ anak.nama }}</option>
    </select>
    <span class="material-symbols-outlined text-on-surface-variant text-base -ml-2 pointer-events-none">expand_more</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  anakList: { type: Array, default: () => [] },
  modelValue: { type: Number, default: null }
})

defineEmits(['update:modelValue'])

const selectedAnak = computed(() => props.anakList.find(a => a.id === props.modelValue))
</script>
