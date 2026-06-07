<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">

    <!-- Profile Card -->
    <div class="bg-canvas-cream rounded-[32px] border-4 border-[#B7D9BC] p-6 shadow-lg relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-success-soft rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
          <span class="text-4xl">{{ userGender === 'Ayah' ? '👨' : '👩' }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div v-if="!editingName">
            <h3 class="font-headline-md text-text-main">{{ userName }}</h3>
            <p class="text-sm text-on-surface-variant truncate">{{ userEmail }}</p>
            <p v-if="userGender" class="text-xs text-primary font-bold mt-0.5">{{ userGender }}</p>
          </div>
          <div v-else class="space-y-2 flex-1">
            <input v-model="editNameValue"
              class="w-full px-3 py-2 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
              placeholder="Nama baru" @keyup.enter="saveName" />
            <p v-if="nameError" class="text-xs text-error font-medium">{{ nameError }}</p>
            <div class="flex gap-2">
              <button @click="setGender('Bunda')"
                class="flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all"
                :class="editGender === 'Bunda' ? 'bg-pink-100 border-pink-400 text-pink-700' : 'border-[#B7D9BC] text-on-surface-variant bg-white'">
                👩 Bunda
              </button>
              <button @click="setGender('Ayah')"
                class="flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all"
                :class="editGender === 'Ayah' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-[#B7D9BC] text-on-surface-variant bg-white'">
                👨 Ayah
              </button>
            </div>
            <button @click="saveName"
              class="w-full px-3 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-all shadow-md">
              Simpan
            </button>
          </div>
        </div>
        <button v-if="!editingName" @click="startEditName"
          class="w-10 h-10 rounded-full bg-white border-2 border-[#B7D9BC] flex items-center justify-center text-primary hover:bg-success-soft transition-colors shadow-sm">
          <span class="material-symbols-outlined text-xl">edit</span>
        </button>
      </div>

      <!-- Password Section -->
      <div class="mt-4 pt-4 border-t-2 border-[#B7D9BC]/50">
        <button v-if="!showPasswordForm" @click="showPasswordForm = true"
          class="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors w-full">
          <span class="material-symbols-outlined text-lg">lock</span>
          <span class="font-medium">Ganti Password</span>
          <span class="ml-auto material-symbols-outlined text-base">chevron_right</span>
        </button>
        <div v-else class="space-y-3">
          <div class="flex items-center gap-3 text-sm text-primary font-bold">
            <span class="material-symbols-outlined text-lg">lock</span>
            <span>Ganti Password</span>
          </div>
          <input v-model="oldPassword" type="password"
            class="w-full px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
            placeholder="Masukkan password lama" />
          <input v-model="newPassword" type="password"
            class="w-full px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
            placeholder="Masukkan password baru" />
          <p v-if="passwordError" class="text-xs text-error font-medium">{{ passwordError }}</p>
          <div class="flex gap-2">
            <button @click="cancelPassword"
              class="flex-1 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm font-bold text-on-surface-variant btn-pop-gray">
              Batal
            </button>
            <button @click="savePassword"
              class="flex-1 py-2.5 rounded-xl text-white text-sm font-bold btn-pop-green">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Anak Section -->
    <div class="mt-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-headline-md text-text-main flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-success-soft border-2 border-[#B7D9BC] flex items-center justify-center text-base">👶</span> Anak
        </h3>
        <div class="flex items-center gap-2">
          <button v-if="anakList.length" @click="resetAnak"
            class="px-4 py-2 rounded-xl text-sm font-bold border-2 border-error/30 text-error hover:bg-error/5 transition-colors">
            Reset
          </button>
          <button @click="tambahAnak"
            class="px-4 py-2 rounded-xl text-sm font-bold text-primary btn-pop-green-sm"
            :class="{ 'opacity-40 pointer-events-none': !canAddAnak }">
            + Tambah
          </button>
        </div>
      </div>

      <div v-if="addAnakError" class="bg-error-container rounded-2xl p-3 mb-3 border-2 border-error/20">
        <p class="text-xs text-error font-medium text-center">{{ addAnakError }}</p>
      </div>

      <div class="space-y-3">
        <div v-for="anak in anakList" :key="anak.id"
          class="relative bg-canvas-cream rounded-[24px] p-4 flex items-center gap-4 border-4 border-[#B7D9BC] shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all"
          @click="$emit('select-anak', anak)">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-sm" :style="{ background: anak.bg }">
            {{ anak.emoji }}
          </div>
          <div class="flex-1">
            <p class="font-label-lg text-text-main">{{ anak.nama }}</p>
            <p class="text-sm text-on-surface-variant">{{ ageLabel(anak.tahun, anak.bulan, anak.tanggal) }}</p>
          </div>
          <button @click.stop="toggleMenu(anak.id)"
            class="w-8 h-8 rounded-full bg-white border-2 border-[#B7D9BC] flex items-center justify-center text-on-surface-variant hover:bg-success-soft transition-colors shadow-sm">
            <span class="material-symbols-outlined text-base">more_vert</span>
          </button>
          <div v-if="openMenuId === anak.id"
            class="absolute right-4 top-14 bg-white rounded-2xl shadow-xl border-2 border-[#B7D9BC] py-1 z-10 min-w-[140px]">
            <button @click.stop="openEditAnak(anak)"
              class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-main hover:bg-success-soft transition-colors">
              <span class="material-symbols-outlined text-base">edit</span> Edit
            </button>
            <button @click.stop="deleteAnak(anak)"
              class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors">
              <span class="material-symbols-outlined text-base">delete</span> Hapus
            </button>
          </div>
        </div>

        <div v-if="anakList.length === 0"
          class="bg-canvas-cream rounded-[24px] p-8 text-center border-4 border-dashed border-[#B7D9BC]">
          <p class="text-4xl mb-2">👶</p>
          <p class="text-sm text-on-surface-variant font-medium">Belum ada data anak</p>
        </div>
      </div>
    </div>

    <!-- Billing Section -->
    <div class="mt-6">
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-lg">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
            :class="currentPlan === 'free' ? 'bg-warm-bonding/20' : 'bg-success-soft'">
            <span class="material-symbols-outlined"
              :class="currentPlan === 'free' ? 'text-warm-bonding' : 'text-primary'"
              :style="fillIcon">workspace_premium</span>
          </div>
          <div>
            <p class="font-label-lg text-text-main">Billing</p>
            <p class="text-sm text-on-surface-variant">
              Paket saat ini: <span class="font-bold capitalize text-primary">{{ currentPlan }}</span>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-4">
          <div v-for="plan in plans" :key="plan.id"
            class="text-center p-4 rounded-2xl border-2 transition-all cursor-pointer"
            :class="selectedPlan === plan.id
              ? 'border-primary bg-success-soft'
              : 'border-[#B7D9BC] bg-white hover:border-primary/50'"
            @click="selectedPlan = plan.id">
            <p class="text-2xl mb-1">{{ plan.emoji }}</p>
            <p class="text-sm font-bold" :class="selectedPlan === plan.id ? 'text-primary' : 'text-on-surface-variant'">{{ plan.label }}</p>
            <p class="text-xs text-on-surface-variant mt-0.5">{{ plan.price }}</p>
            <p class="text-xs text-on-surface-variant mt-1">{{ plan.desc }}</p>
          </div>
        </div>

        <button v-if="currentPlan !== selectedPlan"
          @click="upgradePlan"
          class="w-full py-3 rounded-2xl font-label-lg text-white btn-pop-green">
          {{ currentPlan === 'free' ? 'Upgrade Sekarang' : 'Ubah Paket' }}
        </button>
        <div v-else class="text-center text-sm text-on-surface-variant py-2 font-medium">
          ✅ Paket aktif
        </div>

        <div class="mt-4 pt-4 border-t-2 border-[#B7D9BC]/50">
          <button @click="shareReferral"
            class="w-full py-3 rounded-2xl font-label-lg border-2 border-primary text-primary hover:bg-success-soft transition-all duration-200 flex items-center justify-center gap-2 font-bold">
            <span class="material-symbols-outlined text-lg">share</span>
            Share Link Referral
          </button>
          <p v-if="referralCode" class="text-center text-xs text-on-surface-variant mt-2">
            Kode: <span class="font-bold text-primary">{{ referralCode }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Edit Anak Modal -->
    <div v-if="editAnak" class="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
      <div class="absolute inset-0 bg-black/40" @click="closeEditAnak"></div>
      <div class="relative bg-canvas-cream rounded-t-[32px] lg:rounded-[32px] w-full max-w-md p-6 pb-8 lg:mb-0 border-4 border-[#B7D9BC] border-b-0 lg:border-b-4">
        <div class="w-10 h-1 bg-[#B7D9BC] rounded-full mx-auto mb-5 lg:hidden"></div>
        <h3 class="font-headline-md text-text-main mb-1 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-success-soft border-2 border-[#B7D9BC] flex items-center justify-center text-base">✏️</span> Edit Profil Anak
        </h3>
        <div v-if="editAnakError" class="bg-error-container rounded-xl p-2.5 mb-3 border-2 border-error/20">
          <p class="text-xs text-error font-medium text-center">{{ editAnakError }}</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Nama</label>
            <input v-model="editAnakForm.nama"
              class="w-full px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
              placeholder="Nama anak" />
          </div>
          <div>
            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Gender</label>
            <div class="grid grid-cols-2 gap-2">
              <button @click="editAnakForm.gender = 'Laki-laki'"
                class="py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                :class="editAnakForm.gender === 'Laki-laki' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-[#B7D9BC] text-on-surface-variant bg-white'">
                👦 Laki-laki
              </button>
              <button @click="editAnakForm.gender = 'Perempuan'"
                class="py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                :class="editAnakForm.gender === 'Perempuan' ? 'bg-pink-100 border-pink-400 text-pink-700' : 'border-[#B7D9BC] text-on-surface-variant bg-white'">
                👧 Perempuan
              </button>
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Tanggal Lahir</label>
            <div class="grid grid-cols-3 gap-2">
              <select v-model="editAnakForm.tanggal"
                class="px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white appearance-none">
                <option value="" disabled>Tgl</option>
                <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
              </select>
              <select v-model="editAnakForm.bulan"
                class="px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white appearance-none">
                <option value="" disabled>Bulan</option>
                <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
              </select>
              <select v-model="editAnakForm.tahun"
                class="px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white appearance-none">
                <option value="" disabled>Tahun</option>
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="closeEditAnak"
            class="flex-1 py-3 rounded-2xl text-sm font-bold text-on-surface-variant btn-pop-gray">
            Batal
          </button>
          <button @click="saveEditAnak"
            class="flex-1 py-3 rounded-2xl text-white text-sm font-bold btn-pop-green">
            Simpan
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { saveAnak, removeAnak, getSetting, saveSetting } from '../db.js'
import { ageLabel } from '../utils/age.js'
import { useAppStore } from '../stores/appStore.js'

const app = useAppStore()

const props = defineProps({
  anakList: { type: Array, default: () => [] }
})

const emit = defineEmits(['select-anak'])

const fillIcon = { fontVariationSettings: "'FILL' 1" }

const userName = ref('Bunda')
const userEmail = ref('')
const userGender = ref('')
const editingName = ref(false)
const editNameValue = ref('')
const editGender = ref('')
const openMenuId = ref(null)

const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const passwordError = ref('')

const editAnak = ref(null)
const editAnakForm = ref({ nama: '', gender: '', tanggal: '', bulan: '', tahun: '' })
const editAnakError = ref('')
const nameError = ref('')

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i)

const currentPlan = ref('free')
const plans = [
  { id: 'premium', label: 'Premium', emoji: '👑', price: 'Rp99.000/bulan', desc: '1 anak, semua fitur' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', price: 'Rp299.000/bulan', desc: 'Maks 5 anak' }
]
const selectedPlan = ref('premium')
const addAnakError = ref('')
const referralCode = ref('')

function generateRefCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function shareReferral() {
  const code = referralCode.value || generateRefCode()
  referralCode.value = code
  const appUrl = import.meta.env.VITE_APP_URL || 'https://halobunda.app'
  const appName = import.meta.env.VITE_APP_NAME || 'Halo Bunda'
  const url = `${appUrl}?ref=${code}`
  const text = `Yuk coba ${appName}! Aplikasi pengembangan anak. Pakai kode referral: ${code} 🌸\n${url}`

  if (navigator.share) {
    navigator.share({ title: `Referral ${appName}`, text, url }).catch(() => {})
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link referral sudah disalin!')
    })
  }
}

const maxAnak = computed(() => currentPlan.value === 'family' ? 5 : 1)
const canAddAnak = computed(() => {
  if (currentPlan.value === 'free') return false
  return props.anakList.length < maxAnak.value
})

onMounted(async () => {
  const name = await getSetting('userName')
  if (name) userName.value = name
  const email = await getSetting('userEmail')
  if (email) userEmail.value = email
  const gender = await getSetting('userGender')
  if (gender) userGender.value = gender
})

function startEditName() {
  editNameValue.value = userName.value
  editGender.value = userGender.value
  editingName.value = true
}

function setGender(g) { editGender.value = g }

function saveName() {
  nameError.value = ''
  if (!editNameValue.value.trim()) {
    nameError.value = 'Nama wajib diisi'
    return
  }
  userName.value = editNameValue.value.trim()
  app.userName = editNameValue.value.trim()
  saveSetting('userName', userName.value)
  userGender.value = editGender.value
  app.userGender = editGender.value
  saveSetting('userGender', userGender.value)
  editingName.value = false
}

function cancelPassword() {
  showPasswordForm.value = false
  oldPassword.value = ''
  newPassword.value = ''
  passwordError.value = ''
}

function savePassword() {
  passwordError.value = ''
  if (!oldPassword.value || !newPassword.value) {
    passwordError.value = 'Password lama dan baru wajib diisi'
    return
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'Password baru minimal 6 karakter'
    return
  }
  cancelPassword()
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function openEditAnak(anak) {
  openMenuId.value = null
  editAnak.value = anak
  editAnakForm.value = { nama: anak.nama, gender: anak.gender || '', tanggal: anak.tanggal || '', bulan: anak.bulan || '', tahun: anak.tahun || '' }
}

function closeEditAnak() {
  editAnak.value = null
  editAnakError.value = ''
}

async function saveEditAnak() {
  editAnakError.value = ''
  if (!editAnakForm.value.nama.trim()) {
    editAnakError.value = 'Nama anak wajib diisi'
    return
  }
  if (!editAnakForm.value.gender) {
    editAnakError.value = 'Gender wajib dipilih'
    return
  }
  if (!editAnakForm.value.tanggal || !editAnakForm.value.bulan || !editAnakForm.value.tahun) {
    editAnakError.value = 'Tanggal lahir wajib diisi lengkap'
    return
  }
  const anak = editAnak.value
  anak.nama = editAnakForm.value.nama.trim()
  anak.gender = editAnakForm.value.gender
  if (anak.gender === 'Perempuan') {
    anak.emoji = '👧'
    anak.bg = '#FCE4EC'
  } else if (anak.gender === 'Laki-laki') {
    anak.emoji = '👦'
    anak.bg = '#E3F2FD'
  }
  anak.tanggal = editAnakForm.value.tanggal
  anak.bulan = editAnakForm.value.bulan
  anak.tahun = editAnakForm.value.tahun
  await saveAnak(JSON.parse(JSON.stringify(anak)))
  closeEditAnak()
}

async function deleteAnak(anak) {
  openMenuId.value = null
  if (!confirm(`Hapus data ${anak.nama}?`)) return
  await removeAnak(anak.id)
  const idx = props.anakList.indexOf(anak)
  if (idx > -1) props.anakList.splice(idx, 1)
}

async function resetAnak() {
  if (!confirm('Hapus semua data anak? Semua data challenge, jadwal, dan checklist akan ikut terhapus.')) return
  for (const anak of [...props.anakList]) {
    await removeAnak(anak.id)
  }
  props.anakList.splice(0)
}

async function tambahAnak() {
  addAnakError.value = ''
  if (currentPlan.value === 'free') {
    addAnakError.value = 'Upgrade ke Premium atau Family untuk menambah anak.'
    return
  }
  if (props.anakList.length >= maxAnak.value) {
    addAnakError.value = currentPlan.value === 'premium'
      ? 'Batas 1 anak. Upgrade ke Family untuk menambah hingga 5 anak.'
      : `Batas maksimal ${maxAnak.value} anak.`
    return
  }
  const emojis = ['👦', '👧']
  const bgs = ['#E3F2FD', '#FCE4EC', '#E8F5E9', '#FFF3E0', '#F3E5F5']
  const idx = props.anakList.length
  const newAnak = {
    nama: `Anak ${idx + 1}`,
    emoji: emojis[idx % 2],
    bg: bgs[idx % bgs.length],
    tanggal: null, bulan: null, tahun: null,
    skills: [], completedSkills: [], history: []
  }
  newAnak.id = await saveAnak(newAnak)
  props.anakList.push(newAnak)
  app.selectedAnakId = newAnak.id
}

function upgradePlan() {
  currentPlan.value = selectedPlan.value
  addAnakError.value = ''
}
</script>

<style scoped>
.btn-pop-green {
  background-color: #6DBE7B;
  box-shadow: 0 4px 0 #176c33;
  transition: all 0.1s ease;
}
.btn-pop-green:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 #176c33;
}
.btn-pop-green-sm {
  background-color: #6DBE7B;
  box-shadow: 0 3px 0 #176c33;
  transition: all 0.1s ease;
  color: white;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
}
.btn-pop-green-sm:active {
  transform: translateY(3px);
  box-shadow: 0 0px 0 #176c33;
}
.btn-pop-gray {
  background-color: #E5E7EB;
  box-shadow: 0 4px 0 #9CA3AF;
  transition: all 0.1s ease;
}
.btn-pop-gray:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 #9CA3AF;
}
</style>
