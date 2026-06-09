<template>
  <div class="px-margin-mobile md:px-margin-desktop pt-2 mx-auto max-w-2xl">
    <div class="space-y-6">

      <!-- User Info Card -->
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-lg">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center border-2 border-white shadow-md text-2xl">
            {{ userEmoji }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-lg text-text-main truncate">{{ userName }}</p>
            <p class="text-xs text-on-surface-variant truncate">{{ userEmail }}</p>
            <span class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-lg"
              :class="auth.isAuthenticated ? 'bg-success-soft text-primary' : 'bg-warm-bonding/20 text-warm-bonding'">
              {{ auth.isAuthenticated ? 'Online' : 'Offline' }}
            </span>
          </div>
          <button @click="$emit('go-profile')"
            class="w-9 h-9 rounded-full bg-white border-2 border-[#B7D9BC] flex items-center justify-center text-primary hover:opacity-80 shrink-0">
            <span class="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>
      </div>

      <!-- Sync Settings -->
      <SyncSettings />

      <!-- Notification Settings -->
      <NotificationSettings />

      <!-- Download Activities -->
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-lg">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#B7D9BC] shadow-sm shrink-0">
            <span class="material-symbols-outlined text-lg text-primary">download</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-lg text-text-main">Download Aktivitas</p>
            <p class="text-xs text-on-surface-variant mt-0.5">
              {{ act.localCount > 0 ? `${act.localCount} aktivitas tersimpan di perangkat` : 'Belum ada aktivitas diunduh' }}
            </p>
          </div>
        </div>

        <button @click="doDownload" :disabled="act.downloading || !auth.isAuthenticated"
          class="w-full mt-4 py-3 rounded-2xl text-sm font-bold btn-pop-green flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-lg" :class="act.downloading ? 'animate-spin' : ''">cloud_download</span>
          {{ act.downloading ? 'Mengunduh...' : 'Download dari Server' }}
        </button>

        <p v-if="!auth.isAuthenticated" class="text-xs text-warm-bonding mt-2 text-center">Login untuk mengunduh aktivitas dari server</p>
        <p v-if="act.downloadMessage" class="text-xs text-primary mt-2 text-center font-medium">{{ act.downloadMessage }}</p>
      </div>

      <!-- App Info -->
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-lg">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#B7D9BC] shadow-sm">
            <span class="material-symbols-outlined text-lg text-primary">info</span>
          </div>
          <div>
            <p class="font-label-lg text-text-main">Tentang Aplikasi</p>
            <p class="text-xs text-on-surface-variant">{{ appConfig.name }} — {{ appConfig.tagline }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="bg-white rounded-xl p-3 border-2 border-[#B7D9BC]">
            <p class="text-on-surface-variant">Versi</p>
            <p class="font-bold text-text-main mt-0.5">1.0.0</p>
          </div>
          <div class="bg-white rounded-xl p-3 border-2 border-[#B7D9BC]">
            <p class="text-on-surface-variant">Status</p>
            <p class="font-bold text-primary mt-0.5">{{ auth.isAuthenticated ? 'Terhubung' : 'Offline' }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore.js'
import { useAuthStore } from '../stores/authStore.js'
import { appConfig } from '../config/appConfig.js'
import { useActivityStore } from '../stores/activityStore.js'
import { buildAktivitasDataFromAPI, setAktivitasData } from '../data/activities.js'
import NotificationSettings from '../components/NotificationSettings.vue'
import SyncSettings from '../components/SyncSettings.vue'

const app = useAppStore()
const auth = useAuthStore()
const act = useActivityStore()

onMounted(() => { act.loadFromCache() })

async function doDownload() {
  await act.downloadActivities()
  if (act.activitiesCache) {
    const aktivitas = buildAktivitasDataFromAPI(act.activitiesCache)
    setAktivitasData(aktivitas)
  }
}

defineEmits(['go-profile'])

const userName = computed(() => auth.user?.name || app.userName || 'User')
const userEmail = computed(() => auth.user?.email || '')
const userEmoji = computed(() => app.userGender === 'Perempuan' ? '👩' : '👨')
</script>
