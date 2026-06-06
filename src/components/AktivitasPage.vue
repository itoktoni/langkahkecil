<template>
  <div class="fade-in-up">
    <button @click="$emit('back')"
      class="flex items-center gap-2 text-primary font-label-lg mb-stack-md hover:opacity-80 transition-opacity border border-primary-container px-3 py-1.5 rounded-full">
      <span class="material-symbols-outlined text-xl">arrow_back</span>
      Kembali
    </button>

    <section class="mb-stack-lg">
      <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-text-main leading-tight mb-2">
        Pilih Aktivitas
      </h2>
      <p class="font-body-md text-body-md text-on-surface-variant">Aktivitas seru untuk {{ title }}.</p>
    </section>

    <!-- Featured Card (first item) -->
    <div class="mb-4">
      <div v-if="aktivitasData[0]"
        class="bento-card group relative overflow-hidden rounded-[32px] cursor-pointer transition-all hover:shadow-xl border-2"
        :style="{ background: `linear-gradient(135deg, ${aktivitasData[0].color}20, ${aktivitasData[0].color}08)`, borderColor: aktivitasData[0].color, boxShadow: `0 8px 32px ${aktivitasData[0].color}30` }"
        @click="$emit('selectAktivitas', aktivitasData[0])">
        <div class="flex items-center gap-5 p-6 md:p-8">
          <div class="w-20 h-20 rounded-[24px] flex items-center justify-center text-5xl shrink-0 shadow-lg"
            :style="{ background: `linear-gradient(135deg, ${aktivitasData[0].color}, ${aktivitasData[0].color}CC)` }">
            {{ aktivitasData[0].emoji }}
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-xs font-bold uppercase tracking-widest" :style="{ color: aktivitasData[0].color }">Populer</span>
            <h3 class="font-headline-md text-headline-md text-text-main mt-1">{{ aktivitasData[0].title }}</h3>
            <p class="text-sm text-on-surface-variant mt-1 line-clamp-2">{{ aktivitasData[0].desc }}</p>
          </div>
          <span class="material-symbols-outlined text-3xl text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">arrow_forward</span>
        </div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10" :style="{ background: aktivitasData[0].color }"></div>
      </div>
    </div>

    <!-- Grid Cards (remaining items) -->
    <div class="grid grid-cols-2 gap-3">
      <div v-for="(item, index) in aktivitasData.slice(1)" :key="item.key"
        class="bento-card group bg-white rounded-[24px] soft-shadow overflow-hidden cursor-pointer transition-all hover:shadow-xl flex flex-col border-2"
        :style="{ borderColor: item.color + '80', boxShadow: `0 4px 16px ${item.color}30` }"
        @click="$emit('selectAktivitas', item)">
        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-start justify-between mb-3">
            <div class="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl"
              :style="{ background: item.bg }">
              {{ item.emoji }}
            </div>
            <span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-lg">chevron_right</span>
          </div>
          <h3 class="font-label-lg text-label-lg text-text-main mb-1">{{ item.title }}</h3>
          <p class="text-xs leading-snug text-on-surface-variant line-clamp-2 mt-auto">{{ item.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="mt-stack-lg bg-[#D7EDFF] rounded-4xl p-6 relative overflow-hidden soft-shadow mb-8">
      <div class="relative z-10 flex gap-4">
        <div class="shrink-0">
          <div class="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-3xl">psychology</span>
          </div>
        </div>
        <div>
          <h4 class="font-label-lg text-label-lg text-on-tertiary-fixed mb-1 uppercase tracking-wider">Tips Hari Ini</h4>
          <p class="font-body-md text-body-lg text-primary italic leading-relaxed">"Karakter tidak dibangun dalam sehari, tapi melalui pilihan kecil yang dilakukan setiap pagi."</p>
        </div>
      </div>
      <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
    </div>
  </div>
</template>

<script setup>
import { aktivitasData } from '../data/pilars.js'

defineProps({
  title: { type: String, default: '' }
})

defineEmits(['back', 'selectAktivitas'])
</script>
