<template>
  <div class="px-margin-mobile md:px-margin-desktop pt-5 max-w-6xl mx-auto pb-8">

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
              Anak pertama: <span class="font-bold text-primary">Gratis</span> • Anak tambahan: <span class="font-bold text-primary">Rp99.000/tahun</span>
            </p>
          </div>
        </div>

        <!-- Info pricing -->
        <div class="bg-white rounded-2xl p-4 border-2 border-[#B7D9BC] mb-4">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">👶</span>
            <div>
              <p class="text-sm font-bold text-text-main">Anak Pertama</p>
              <p class="text-xs text-on-surface-variant">Gratis selamanya</p>
            </div>
            <span class="ml-auto text-lg font-bold text-primary">GRATIS</span>
          </div>
          <div class="flex items-center gap-3 pt-3 border-t-2 border-[#B7D9BC]/50">
            <span class="text-2xl">👧</span>
            <div>
              <p class="text-sm font-bold text-text-main">Anak Tambahan</p>
              <p class="text-xs text-on-surface-variant">Per anak, per tahun</p>
            </div>
            <span class="ml-auto text-lg font-bold text-primary">Rp99rb</span>
          </div>
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

    <!-- Pricing Modal for Additional Child -->
    <div v-if="showPricingModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showPricingModal = false">
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-xl max-w-md w-full">
        <div class="text-center mb-4">
          <span class="text-4xl">👧</span>
          <h3 class="font-headline-md text-text-main mt-2">Tambah Anak</h3>
          <p class="text-sm text-on-surface-variant mt-1">Anak ke-{{ anakList.length + 1 }}</p>
        </div>

        <!-- Price Display -->
        <div class="bg-white rounded-2xl p-4 border-2 border-[#B7D9BC] mb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-text-main">Langganan Tahunan</p>
              <p class="text-xs text-on-surface-variant">Akses semua fitur untuk 1 anak</p>
            </div>
            <div class="text-right">
              <p v-if="discountApplied && discountPercent === 100" class="text-lg font-bold text-primary">GRATIS</p>
              <template v-else>
                <p v-if="discountApplied" class="text-xs text-on-surface-variant line-through">Rp{{ PRICE_PER_CHILD.toLocaleString('id-ID') }}</p>
                <p class="text-lg font-bold text-primary">Rp{{ finalPrice.toLocaleString('id-ID') }}</p>
              </template>
              <p class="text-xs text-on-surface-variant">/tahun</p>
            </div>
          </div>

          <!-- Discount Badge -->
          <div v-if="discountApplied" class="mt-3 flex items-center gap-2 bg-success-soft rounded-xl p-2">
            <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
            <span class="text-xs font-bold text-primary">Diskon {{ discountPercent }}% diterapkan</span>
            <button @click="removeDiscount" class="ml-auto text-xs text-on-surface-variant hover:text-error">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        <!-- Discount Code Input -->
        <div v-if="!discountApplied" class="mb-4">
          <button v-if="!showDiscountInput" @click="showDiscountInput = true"
            class="w-full py-2.5 rounded-xl border-2 border-dashed border-[#B7D9BC] text-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">local_offer</span>
            Punya kode diskon?
          </button>
          <div v-else class="space-y-2">
            <div class="flex gap-2">
              <input v-model="discountCode"
                class="flex-1 px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white uppercase"
                placeholder="Masukkan kode diskon"
                @keyup.enter="applyDiscount" />
              <button @click="applyDiscount"
                class="px-4 py-2.5 rounded-xl text-sm font-bold text-white btn-pop-green">
                Pakai
              </button>
            </div>
            <p v-if="discountError" class="text-xs text-error font-medium">{{ discountError }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button @click="showPricingModal = false"
            class="flex-1 py-3 rounded-2xl text-sm font-bold text-on-surface-variant btn-pop-gray">
            Batal
          </button>
          <button @click="processPayment"
            class="flex-1 py-3 rounded-2xl text-white text-sm font-bold btn-pop-green">
            {{ finalPrice === 0 ? 'Klaim Gratis' : `Bayar Rp${finalPrice.toLocaleString('id-ID')}` }}
          </button>
        </div>

        <p class="text-center text-xs text-on-surface-variant mt-4">
          Pembayaran aman melalui Midtrans
        </p>
      </div>
    </div>

    <!-- Account Section -->
    <div class="mt-6">
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-lg">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-success-soft flex items-center justify-center border-2 border-white shadow-sm">
            <span class="material-symbols-outlined text-primary">account_circle</span>
          </div>
          <div>
            <p class="font-label-lg text-text-main">Akun</p>
            <p class="text-sm text-on-surface-variant">
              {{ auth.isAuthenticated ? appConfig.connectedText : appConfig.offlineText }}
            </p>
          </div>
        </div>

        <div v-if="auth.isAuthenticated" class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-[#B7D9BC]">
            <span class="material-symbols-outlined text-primary text-xl">check_circle</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-text-main">{{ auth.user?.name || 'User' }}</p>
              <p class="text-xs text-on-surface-variant">{{ auth.user?.email || '' }}</p>
            </div>
            <span class="text-xs text-primary font-bold bg-success-soft px-2 py-1 rounded-lg">Online</span>
          </div>

          <button @click="$emit('logout')"
            class="w-full py-3 rounded-2xl text-sm font-bold border-2 border-error/30 text-error hover:bg-error/5 transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>

        <div v-else>
          <button @click="$emit('logout')"
            class="w-full py-3 rounded-2xl text-sm font-bold text-primary btn-pop-green flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">login</span>
            {{ appConfig.loginText }}
          </button>
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
import { useAuthStore } from '../stores/authStore.js'
import { useAnakStore } from '../stores/anakStore.js'
import { appConfig } from '../config/appConfig.js'
import * as api from '../services/api.js'

const app = useAppStore()
const auth = useAuthStore()
const anakStore = useAnakStore()

const props = defineProps({
  anakList: { type: Array, default: () => [] }
})

const emit = defineEmits(['select-anak', 'logout', 'sync'])

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
const selectedPlan = ref('premium')
const addAnakError = ref('')
const referralCode = ref('')

// Pricing per child
const PRICE_PER_CHILD = 99000
const discountCode = ref('')
const discountApplied = ref(false)
const discountPercent = ref(0)
const discountError = ref('')
const showDiscountInput = ref(false)
const showPricingModal = ref(false)

// Simulated discount codes (in real app, this would be server-validated)
const VALID_DISCOUNTS = {
  'HEMAT10': 10,
  'LAUNCH20': 20,
  'SAHABAT30': 30,
  'GRATIS': 100,
}

function applyDiscount() {
  discountError.value = ''
  const code = discountCode.value.trim().toUpperCase()
  if (!code) {
    discountError.value = 'Masukkan kode diskon'
    return
  }
  if (VALID_DISCOUNTS[code]) {
    discountPercent.value = VALID_DISCOUNTS[code]
    discountApplied.value = true
    discountError.value = ''
  } else {
    discountError.value = 'Kode diskon tidak valid'
    discountApplied.value = false
    discountPercent.value = 0
  }
}

function removeDiscount() {
  discountCode.value = ''
  discountApplied.value = false
  discountPercent.value = 0
  discountError.value = ''
  showDiscountInput.value = false
}

const finalPrice = computed(() => {
  if (discountApplied.value && discountPercent.value === 100) return 0
  if (discountApplied.value) {
    return Math.round(PRICE_PER_CHILD * (1 - discountPercent.value / 100))
  }
  return PRICE_PER_CHILD
})

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
  const appName = appConfig.name
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

const maxAnak = computed(() => 10) // Max 10 anak
const canAddAnak = computed(() => {
  // First child is free, subsequent children require payment
  return props.anakList.length < maxAnak.value
})

onMounted(async () => {
  const name = await getSetting('userName')
  if (name) userName.value = name
  const email = await getSetting('userEmail')
  if (email) userEmail.value = email
  const gender = await getSetting('userGender')
  if (gender) userGender.value = gender

  if (auth.user) {
    if (auth.user.name) userName.value = auth.user.name
    if (auth.user.email) userEmail.value = auth.user.email
  }
})

function startEditName() {
  editNameValue.value = userName.value
  editGender.value = userGender.value
  editingName.value = true
}

function setGender(g) { editGender.value = g }

async function saveName() {
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

  if (auth.isAuthenticated) {
    try {
      const res = await api.updateProfile({ name: userName.value })
      if (res.user) {
        auth.user = res.user
        localStorage.setItem('lk_user', JSON.stringify(res.user))
      }
    } catch (e) {
      console.warn('Failed to update profile on server:', e)
    }
  }
}

function cancelPassword() {
  showPasswordForm.value = false
  oldPassword.value = ''
  newPassword.value = ''
  passwordError.value = ''
}

async function savePassword() {
  passwordError.value = ''
  if (!oldPassword.value || !newPassword.value) {
    passwordError.value = 'Password lama dan baru wajib diisi'
    return
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'Password baru minimal 6 karakter'
    return
  }

  if (auth.isAuthenticated) {
    try {
      await api.changePassword(oldPassword.value, newPassword.value, newPassword.value)
    } catch (e) {
      passwordError.value = e.message || 'Gagal mengubah password'
      return
    }
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
  await anakStore.updateAnak(anak)
  closeEditAnak()
}

async function deleteAnak(anak) {
  openMenuId.value = null
  if (!confirm(`Hapus data ${anak.nama}?`)) return
  await removeAnak(anak.id)
  const idx = props.anakList.indexOf(anak)
  if (idx > -1) props.anakList.splice(idx, 1)
  if (app.selectedAnakId === anak.id) {
    app.selectedAnakId = props.anakList.length ? props.anakList[0].id : null
  }
}

async function resetAnak() {
  if (!confirm('Hapus semua data anak? Semua data challenge, jadwal, dan checklist akan ikut terhapus.')) return
  for (const anak of [...props.anakList]) {
    await removeAnak(anak.id)
  }
  props.anakList.splice(0)
  app.selectedAnakId = null
}

async function tambahAnak() {
  addAnakError.value = ''

  // First child is free
  if (props.anakList.length === 0) {
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
    currentPlan.value = 'active'
    return
  }

  // For 2nd+ child, show pricing modal
  showPricingModal.value = true
}

function upgradePlan() {
  currentPlan.value = selectedPlan.value
  addAnakError.value = ''
}

async function processPayment() {
  // In real app, this would integrate with payment gateway
  // For now, simulate successful payment
  addAnakError.value = ''
  showPricingModal.value = false

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

  // Reset discount after use
  removeDiscount()
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
