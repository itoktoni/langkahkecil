<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto">
    <h2 class="font-headline-md text-headline-md mb-stack-lg">Alat Bantu Bunda</h2>
    <div class="mb-stack-lg grid md:grid-cols-2 gap-4 md:gap-6">
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-label-lg text-label-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">schedule</span> Jadwal Harian
          </h3>
          <button class="text-primary text-sm font-bold bg-success-soft px-4 py-1.5 rounded-full">Ubah</button>
        </div>
        <div class="space-y-3">
          <div v-for="s in schedules" :key="s.time"
            class="bg-white p-5 rounded-[32px] flex items-center justify-between soft-shadow">
            <div class="flex items-center gap-3">
              <span class="font-label-sm text-on-surface-variant">{{ s.time }}</span>
              <span class="font-body-md">{{ s.label }}</span>
            </div>
            <span class="material-symbols-outlined"
              :class="s.done ? 'text-growth-green' : 'text-outline-variant'">
              {{ s.done ? 'check_circle' : 'radio_button_unchecked' }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="font-label-lg text-label-lg flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-secondary">menu_book</span> Tracker Hafalan Qur'an
        </h3>
        <div class="bg-white p-6 rounded-[40px] soft-shadow">
          <div class="flex justify-between items-end mb-3">
            <div>
              <p class="text-sm text-on-surface-variant mb-1">Target Minggu Ini:</p>
              <p class="font-headline-md text-primary">An-Naba (Ayat 1-10)</p>
            </div>
            <p class="font-label-lg text-primary">60%</p>
          </div>
          <div class="w-full bg-surface-container rounded-full h-2">
            <div class="bg-growth-green h-2 rounded-full" style="width: 60%"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-stack-lg">
      <h3 class="font-label-lg text-label-lg flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-friendly-sky">fact_check</span> Checklist Harian
      </h3>
      <div class="bg-white p-6 rounded-[40px] soft-shadow space-y-4">
        <label v-for="(item, i) in localChecklist" :key="i" class="flex items-center gap-4 cursor-pointer">
          <input v-model="item.done" type="checkbox"
            class="w-5 h-5 rounded-md border-outline-variant text-growth-green focus:ring-growth-green">
          <span class="font-body-md">{{ item.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { schedules as schedData, checklist as checkData } from '../data/pilars.js'

const schedules = reactive(schedData)
const localChecklist = reactive(checkData.map(c => ({ ...c })))
</script>
