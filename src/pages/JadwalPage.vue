<template>
  <div class="space-y-4">
    <div v-for="s in schedules" :key="s.time"
      class="bg-white rounded-[24px] p-5 border-2 soft-shadow flex items-center gap-4 cursor-pointer"
      style="border-color: #FF980040; box-shadow: 0 4px 16px #FF980018"
      @click="s.done = !s.done">
      <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
        :style="s.done ? { background: '#FF9800', color: '#fff' } : { background: '#FFF3E0', color: '#FF9800' }">
        <span class="material-symbols-outlined text-lg">{{ s.done ? 'check' : 'schedule' }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-label-lg" :class="s.done ? 'text-on-surface-variant line-through' : 'text-text-main'">{{ s.label }}</p>
        <p class="text-xs text-on-surface-variant">{{ s.time }}</p>
      </div>
      <button @click.stop="emit('remove-schedule', s)"
        class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-red-50 hover:text-error transition-colors">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
    </div>

    <div v-if="!schedules.length"
      class="bg-white/70 rounded-[24px] p-6 soft-shadow text-center text-sm text-on-surface-variant border-2"
      style="border-color: #FF980030">
      Belum ada jadwal
    </div>

    <button @click="showForm = true"
      class="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2"
      style="background: #FF9800; box-shadow: 0 4px 12px #FF980040">
      <span class="material-symbols-outlined text-lg">add</span>
      Tambah Jadwal
    </button>
  </div>

  <AppModal v-model="showForm" title="Tambah Jadwal">
    <div class="space-y-4">
      <AppInput v-model="newLabel" label="Nama Aktivitas" placeholder="Contoh: Belajar Membaca" :error="labelError" />
      <AppInput v-model="newTime" label="Waktu" type="time" placeholder="08:00" :error="timeError" />
    </div>
    <div class="flex gap-3 mt-6">
      <AppButton variant="outline" block @click="closeForm">Batal</AppButton>
      <AppButton block @click="addSchedule">Simpan</AppButton>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppModal from '../components/AppModal.vue'
import AppInput from '../components/AppInput.vue'
import AppButton from '../components/AppButton.vue'

const props = defineProps({
  schedules: { type: Array, default: () => [] }
})

const emit = defineEmits(['add-schedule', 'remove-schedule'])

const showForm = ref(false)
const newLabel = ref('')
const newTime = ref('')
const labelError = ref('')
const timeError = ref('')

onMounted(() => {
  const today = new Date().toISOString().slice(0, 10)
  const lastReset = localStorage.getItem('jadwal_last_reset')
  if (lastReset !== today) {
    props.schedules.forEach(s => { s.done = false })
    localStorage.setItem('jadwal_last_reset', today)
  }
})

function closeForm() {
  showForm.value = false
  newLabel.value = ''
  newTime.value = ''
  labelError.value = ''
  timeError.value = ''
}

function addSchedule() {
  labelError.value = ''
  timeError.value = ''
  let valid = true
  if (!newLabel.value.trim()) {
    labelError.value = 'Nama aktivitas wajib diisi'
    valid = false
  }
  if (!newTime.value) {
    timeError.value = 'Waktu wajib diisi'
    valid = false
  }
  if (!valid) return
  emit('add-schedule', { time: newTime.value, label: newLabel.value.trim(), done: false })
  closeForm()
}
</script>
