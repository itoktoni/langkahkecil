<template>
  <div class="mb-6 rounded-[28px] p-5 border-2" style="border-color: #4CAF5040">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-headline-sm text-text-main flex items-center gap-2">
        <span class="material-symbols-outlined" style="color: #4CAF50">school</span> Hafalan
      </h3>
      <button @click="showHistory = !showHistory"
        class="flex items-center gap-1.5 text-sm font-medium transition-colors" style="color: #4CAF50">
        <span class="material-symbols-outlined text-lg">{{ showHistory ? 'close' : 'history' }}</span>
        {{ showHistory ? 'Tutup' : 'History' }}
      </button>
    </div>

    <div v-if="!showHistory" class="space-y-4">
      <div v-for="h in activeHafalan" :key="h.id"
        class="bg-white rounded-[24px] p-5 soft-shadow cursor-pointer hover:shadow-md transition-shadow"
        @click="openEdit(h)">
        <div class="flex items-end gap-4">
          <div class="flex-1 min-w-0">
            <div class="mb-1">
              <p class="text-[11px] font-bold uppercase tracking-wider mb-0.5" :style="{ color: h.color }">{{ h.category }}</p>
              <p class="font-label-lg font-bold text-text-main">{{ h.title }}</p>
              <p v-if="h.notes" class="text-xs text-on-surface-variant mt-0.5">{{ h.notes }}</p>
            </div>

            <div class="flex items-center gap-2 mt-4">
              <button @click.stop="removePoint(h)"
                class="py-2 px-4 rounded-xl text-sm font-bold border-2 transition-all active:scale-95"
                :style="{ borderColor: h.color + '80', color: h.color }">
                -1 Poin
              </button>
              <button @click.stop="addPoint(h)"
                class="py-2 px-4 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                :style="{ background: h.color }">
                +1 Poin
              </button>
            </div>
          </div>

          <div class="celengan shrink-0 flex flex-col items-center self-stretch">
            <div class="celengan-tube relative w-16 h-full rounded-lg overflow-hidden border-2 shadow-lg"
              :style="{ borderColor: h.color + '60', background: h.color + '10', boxShadow: `0 4px 16px ${h.color}40` }">
              <div class="absolute bottom-0 left-0 right-0 transition-all duration-700 rounded-b-lg"
                :style="{ height: pointPercent(h) + '%', background: `linear-gradient(to top, ${h.color}, ${h.color}CC)` }">
              </div>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-lg font-extrabold leading-none" :style="{ color: pointPercent(h) > 50 ? '#FFF9F3' : h.color }">{{ h.points }}</span>
                <span class="text-[10px] font-bold leading-none mt-0.5" :style="{ color: pointPercent(h) > 50 ? 'rgba(255,255,255,0.8)' : 'text-on-surface-variant' }">/ {{ h.maxPoints }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!activeHafalan.length"
        class="bg-white/70 rounded-[24px] p-6 soft-shadow text-center text-sm text-on-surface-variant">
        Belum ada hafalan aktif
      </div>
      <button @click="showAddHafalan = true"
        class="w-full py-3 rounded-2xl border-2 border-dashed text-sm font-medium transition-colors flex items-center justify-center gap-2" style="border-color: #4CAF5060; color: #4CAF50">
        <span class="material-symbols-outlined text-lg">add</span>
        Tambah Hafalan
      </button>
    </div>

    <div v-else class="space-y-5">
      <div v-for="(items, cat) in historyByCategory" :key="cat">
        <div class="flex items-center gap-2 mb-2">
          <h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{{ cat }}</h4>
          <span class="text-xs font-bold text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded-full">{{ items.length }}</span>
        </div>
        <div class="space-y-2">
          <div v-for="h in items" :key="h.id"
            class="bg-white rounded-2xl p-4 soft-shadow flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" :style="{ background: h.bg }">{{ h.emoji }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-main">{{ h.title }}</p>
              <p class="text-xs text-on-surface-variant">{{ h.maxPoints }} poin terkumpul</p>
            </div>
            <span class="material-symbols-outlined text-green-600 text-xl">check_circle</span>
          </div>
        </div>
      </div>
      <div v-if="!hafalanHistory.length"
        class="bg-white rounded-[24px] p-6 soft-shadow text-center text-sm text-on-surface-variant">
        Belum ada riwayat hafalan
      </div>
    </div>
  </div>

  <AppModal v-model="showAddHafalan" title="Tambah Hafalan">
    <div class="space-y-4">
      <AppSelect v-model="form.category" label="Kategori" placeholder="Pilih kategori">
        <option value="Kitab Suci">Kitab Suci</option>
        <option value="Matematika">Matematika</option>
        <option value="Bahasa">Bahasa</option>
        <option value="IPA">IPA</option>
        <option value="Lainnya">Lainnya</option>
      </AppSelect>
      <AppInput v-model="form.title" label="Nama Hafalan" placeholder="Contoh: Surat An-Naba" />
      <AppTextarea v-model="form.notes" label="Catatan" placeholder="Catatan tambahan..." :rows="2" />
      <AppInput v-model.number="form.maxPoints" label="Target Poin" type="number" placeholder="10" />
    </div>
    <div class="flex gap-3 mt-6">
      <AppButton variant="outline" block @click="closeForm">Batal</AppButton>
      <AppButton block @click="saveForm">Simpan</AppButton>
    </div>
  </AppModal>

  <AppModal v-model="showEditHafalan" title="Edit Hafalan">
    <div class="space-y-4">
      <AppSelect v-model="editForm.category" label="Kategori" placeholder="Pilih kategori">
        <option value="Kitab Suci">Kitab Suci</option>
        <option value="Matematika">Matematika</option>
        <option value="Bahasa">Bahasa</option>
        <option value="IPA">IPA</option>
        <option value="Lainnya">Lainnya</option>
      </AppSelect>
      <AppInput v-model="editForm.title" label="Nama Hafalan" placeholder="Contoh: Surat An-Naba" />
      <AppTextarea v-model="editForm.notes" label="Catatan" placeholder="Catatan tambahan..." :rows="2" />
      <AppInput v-model.number="editForm.maxPoints" label="Target Poin" type="number" placeholder="10" />
    </div>
    <div class="flex gap-3 mt-6">
      <AppButton variant="outline" block @click="closeEdit">Batal</AppButton>
      <AppButton block @click="saveEdit">Simpan</AppButton>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppModal from '../components/AppModal.vue'
import AppInput from '../components/AppInput.vue'
import AppSelect from '../components/AppSelect.vue'
import AppTextarea from '../components/AppTextarea.vue'
import AppButton from '../components/AppButton.vue'
import { playAddSound, playRemoveSound } from '../utils/sound.js'

const props = defineProps({
  hafalan: { type: Array, default: () => [] },
  hafalanHistory: { type: Array, default: () => [] }
})

const emit = defineEmits(['add-hafalan', 'add-point', 'remove-point', 'edit-hafalan'])

const showHistory = ref(false)
const showAddHafalan = ref(false)
const showEditHafalan = ref(false)
const editingId = ref(null)

const categoryEmojis = {
  "Kitab Suci": { emoji: '📖', bg: '#E8F5E9', color: '#4CAF50' },
  "Matematika": { emoji: '✖️', bg: '#E3F2FD', color: '#2196F3' },
  "Bahasa": { emoji: '🔤', bg: '#FFF3E0', color: '#FF9800' },
  "IPA": { emoji: '🔬', bg: '#F3E5F5', color: '#9C27B0' },
  "Lainnya": { emoji: '📝', bg: '#FCE4EC', color: '#E91E63' }
}

const defaultForm = { category: '', title: '', notes: '', maxPoints: 10 }
const form = ref({ ...defaultForm })
const editForm = ref({ ...defaultForm })

const activeHafalan = computed(() => props.hafalan.filter(h => h.points < h.maxPoints))

const historyByCategory = computed(() => {
  const grouped = {}
  for (const h of props.hafalanHistory) {
    if (!grouped[h.category]) grouped[h.category] = []
    grouped[h.category].push(h)
  }
  return grouped
})

function pointPercent(h) {
  return Math.min(100, Math.round((h.points / h.maxPoints) * 100))
}

function addPoint(h, amount = 1) {
  playAddSound()
  emit('add-point', { id: h.id, amount })
}

function removePoint(h) {
  playRemoveSound()
  emit('remove-point', { id: h.id })
}

function openEdit(h) {
  editingId.value = h.id
  editForm.value = {
    category: h.category,
    title: h.title,
    notes: h.notes || '',
    maxPoints: h.maxPoints
  }
  showEditHafalan.value = true
}

function closeEdit() {
  showEditHafalan.value = false
  editingId.value = null
}

function saveEdit() {
  if (!editForm.value.category || !editForm.value.title.trim()) return
  const cat = categoryEmojis[editForm.value.category] || categoryEmojis['Lainnya']
  emit('edit-hafalan', {
    id: editingId.value,
    category: editForm.value.category,
    title: editForm.value.title.trim(),
    notes: editForm.value.notes.trim(),
    emoji: cat.emoji,
    bg: cat.bg,
    color: cat.color,
    maxPoints: Number(editForm.value.maxPoints) || 10
  })
  closeEdit()
}

function closeForm() {
  showAddHafalan.value = false
  form.value = { ...defaultForm }
}

function saveForm() {
  if (!form.value.category || !form.value.title.trim()) return
  const max = Number(form.value.maxPoints) || 10
  const cat = categoryEmojis[form.value.category] || categoryEmojis['Lainnya']
  emit('add-hafalan', {
    id: Date.now(),
    category: form.value.category,
    title: form.value.title.trim(),
    notes: form.value.notes.trim(),
    emoji: cat.emoji,
    bg: cat.bg,
    color: cat.color,
    points: 0,
    maxPoints: max
  })
  closeForm()
}
</script>
