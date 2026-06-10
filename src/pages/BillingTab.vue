<template>
  <div class="px-margin-mobile md:px-margin-desktop pt-5 max-w-6xl mx-auto pb-8">

    <!-- Trial Status Banner -->
    <div v-if="isTrial" class="mb-4 rounded-[24px] p-4 border-4 shadow-md"
      :class="trialExpired ? 'bg-error-container border-error/30' : 'bg-canvas-cream border-[#B7D9BC]'">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
          :class="trialExpired ? 'bg-error/10' : 'bg-success-soft'">
          <span class="material-symbols-outlined" :class="trialExpired ? 'text-error' : 'text-primary'">
            {{ trialExpired ? 'timer_off' : 'timer' }}
          </span>
        </div>
        <div class="flex-1">
          <p class="font-label-lg text-text-main">
            {{ trialExpired ? 'Trial Berakhir' : 'Masa Trial' }}
          </p>
          <p class="text-sm text-on-surface-variant">
            <template v-if="trialExpired">
              Masa trial {{ auth.trialDays }} hari telah berakhir. Pilih paket di bawah untuk melanjutkan.
            </template>
            <template v-else>
              Sisa <span class="font-bold text-primary">{{ trialRemaining }} hari</span> dari {{ auth.trialDays }} hari
            </template>
          </p>
        </div>
      </div>
      <div v-if="!trialExpired" class="mt-3">
        <div class="w-full h-2 bg-white rounded-full overflow-hidden">
          <div class="h-full bg-primary rounded-full transition-all" :style="{ width: trialProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Current Plan Banner -->
    <div v-if="auth.userPlan" class="mb-4 bg-canvas-cream rounded-[24px] p-4 border-4 border-[#B7D9BC] shadow-md">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-success-soft flex items-center justify-center border-2 border-white shadow-sm">
          <span class="material-symbols-outlined text-primary">workspace_premium</span>
        </div>
        <div class="flex-1">
          <p class="font-label-lg text-text-main">{{ planName(auth.userPlan.slug) }}</p>
          <p class="text-sm text-on-surface-variant">
            Aktif hingga {{ formatDate(auth.userPlan.ends_at) }}
          </p>
        </div>
        <span class="text-xs text-primary font-bold bg-success-soft px-2 py-1 rounded-lg">Aktif</span>
      </div>
    </div>

    <!-- Plans -->
    <div class="space-y-4">
      <div v-for="plan in auth.plans" :key="plan.id"
        class="bg-canvas-cream rounded-[32px] p-6 border-4 shadow-lg transition-all cursor-pointer"
        :class="selectedPlan?.id === plan.id ? 'border-primary' : 'border-[#B7D9BC] hover:border-primary/50'"
        @click="selectPlan(plan)">

        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
            :class="selectedPlan?.id === plan.id ? 'bg-primary' : 'bg-success-soft'">
            <span class="material-symbols-outlined text-xl"
              :class="selectedPlan?.id === plan.id ? 'text-white' : 'text-primary'">
              {{ planIcon(plan.slug) }}
            </span>
          </div>
          <div class="flex-1">
            <p class="font-headline-md text-text-main">{{ planName(plan.slug) }}</p>
            <p class="text-sm text-on-surface-variant">{{ planDesc(plan.slug) }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary">Rp{{ plan.price.toLocaleString('id-ID') }}</p>
            <p class="text-xs text-on-surface-variant">/tahun</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div v-for="feature in plan.features" :key="feature.slug"
            class="flex items-center gap-2 text-sm text-on-surface-variant">
            <span class="material-symbols-outlined text-primary text-base">check_circle</span>
            <span>{{ featureName(feature.slug) }}: <span class="font-bold text-text-main">{{ featureDisplay(feature) }}</span></span>
          </div>
        </div>

        <div v-if="getExtraPrice(plan)" class="mt-3 pt-3 border-t-2 border-[#B7D9BC]/50 text-sm text-on-surface-variant">
          Anak tambahan: <span class="font-bold text-primary">Rp{{ parseInt(getExtraPrice(plan)).toLocaleString('id-ID') }}/anak</span>
        </div>

        <button v-if="selectedPlan?.id === plan.id" @click.stop="showPurchaseModal = true"
          class="w-full mt-4 py-3 rounded-2xl text-white text-sm font-bold btn-pop-green">
          {{ auth.userPlan?.id === plan.id ? 'Perpanjang' : 'Pilih Paket Ini' }}
        </button>
      </div>
    </div>

    <!-- Purchase Modal -->
    <div v-if="showPurchaseModal && selectedPlan" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showPurchaseModal = false">
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-xl max-w-md w-full">
        <div class="text-center mb-4">
          <span class="text-4xl">{{ planEmoji(selectedPlan.slug) }}</span>
          <h3 class="font-headline-md text-text-main mt-2">{{ planName(selectedPlan.slug) }}</h3>
        </div>

        <div class="bg-white rounded-2xl p-4 border-2 border-[#B7D9BC] mb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-text-main">Langganan Tahunan</p>
              <p class="text-xs text-on-surface-variant">{{ planDesc(selectedPlan.slug) }}</p>
            </div>
            <div class="text-right">
              <p v-if="discountApplied && finalPrice === 0" class="text-lg font-bold text-primary">GRATIS</p>
              <template v-else>
                <p v-if="discountApplied" class="text-xs text-on-surface-variant line-through">Rp{{ selectedPlan.price.toLocaleString('id-ID') }}</p>
                <p class="text-lg font-bold text-primary">Rp{{ finalPrice.toLocaleString('id-ID') }}</p>
              </template>
              <p class="text-xs text-on-surface-variant">/tahun</p>
            </div>
          </div>

          <div v-if="discountApplied" class="mt-3 flex items-center gap-2 bg-success-soft rounded-xl p-2">
            <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
            <span class="text-xs font-bold text-primary">Diskon {{ discountDisplay }} diterapkan</span>
            <button @click="removeDiscount" class="ml-auto text-xs text-on-surface-variant hover:text-error">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

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

        <div class="flex gap-3">
          <button @click="showPurchaseModal = false"
            class="flex-1 py-3 rounded-2xl text-sm font-bold text-on-surface-variant btn-pop-gray">
            Batal
          </button>
          <button @click="processPurchase" :disabled="purchasing"
            class="flex-1 py-3 rounded-2xl text-white text-sm font-bold btn-pop-green disabled:opacity-50">
            {{ purchasing ? 'Memproses...' : (finalPrice === 0 ? 'Klaim Gratis' : `Bayar Rp${finalPrice.toLocaleString('id-ID')}`) }}
          </button>
        </div>

        <p v-if="purchaseResult" class="text-center text-xs mt-3" :class="purchaseResult.success ? 'text-primary' : 'text-error'">
          {{ purchaseResult.message }}
        </p>

        <p class="text-center text-xs text-on-surface-variant mt-4">
          Pembayaran aman melalui Midtrans (simulasi)
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore.js'
import { useAuthStore } from '../stores/authStore.js'
import * as api from '../services/api.js'

const app = useAppStore()
const auth = useAuthStore()

const selectedPlan = ref(null)
const showPurchaseModal = ref(false)
const purchasing = ref(false)
const purchaseResult = ref(null)

const discountCode = ref('')
const discountApplied = ref(false)
const discountType = ref('')
const discountValue = ref(0)
const discountError = ref('')
const showDiscountInput = ref(false)

const isTrial = computed(() => auth.userRole === 'trial')
const trialExpired = computed(() => {
  if (!isTrial.value) return false
  const trialStart = auth.user?.trial_start_date
  if (!trialStart) return true
  const serverNow = auth.serverDate ? new Date(auth.serverDate) : new Date()
  const daysDiff = Math.floor((serverNow - new Date(trialStart)) / (1000 * 60 * 60 * 24))
  return daysDiff > auth.trialDays
})
const trialRemaining = computed(() => {
  if (!isTrial.value) return 0
  const trialStart = auth.user?.trial_start_date
  if (!trialStart) return 0
  const serverNow = auth.serverDate ? new Date(auth.serverDate) : new Date()
  const daysDiff = Math.floor((serverNow - new Date(trialStart)) / (1000 * 60 * 60 * 24))
  return Math.max(0, auth.trialDays - daysDiff)
})
const trialProgress = computed(() => {
  if (!isTrial.value) return 0
  const trialStart = auth.user?.trial_start_date
  if (!trialStart) return 100
  const serverNow = auth.serverDate ? new Date(auth.serverDate) : new Date()
  const daysDiff = Math.floor((serverNow - new Date(trialStart)) / (1000 * 60 * 60 * 24))
  return Math.min(100, Math.round((daysDiff / auth.trialDays) * 100))
})

const finalPrice = computed(() => {
  if (!selectedPlan.value) return 0
  const base = selectedPlan.value.price
  if (!discountApplied.value) return base
  let amount = 0
  if (discountType.value === 'percentage') {
    amount = base * discountValue.value / 100
  } else {
    amount = discountValue.value
  }
  return Math.max(0, Math.round(base - amount))
})

const discountDisplay = computed(() => {
  if (!discountApplied.value) return ''
  if (discountType.value === 'percentage') return `${discountValue.value}%`
  return `Rp${discountValue.value.toLocaleString('id-ID')}`
})

const PLAN_META = {
  member: { name: 'Member', desc: '1 anak, semua fitur dasar', icon: 'person', emoji: '👤' },
  family: { name: 'Family', desc: 'Maksimal 3 anak, laporan perbandingan', icon: 'family_restroom', emoji: '👨‍👩‍👧‍👦' },
  premium: { name: 'Premium', desc: 'Maksimal 5 anak, evaluasi lanjutan, export PDF', icon: 'workspace_premium', emoji: '👑' },
}

function planName(slug) { return PLAN_META[slug]?.name || slug }
function planDesc(slug) { return PLAN_META[slug]?.desc || '' }
function planIcon(slug) { return PLAN_META[slug]?.icon || 'star' }
function planEmoji(slug) { return PLAN_META[slug]?.emoji || '⭐' }

function featureName(slug) {
  const names = {
    'max-children': 'Anak',
    'milestone-tracking': 'Milestone',
    'activities-and-worksheets': 'Aktivitas',
    'daily-schedule': 'Jadwal',
    'comparison-reports': 'Laporan',
    'family-schedule': 'Jadwal Keluarga',
    'advanced-evaluations': 'Evaluasi',
    'pdf-export': 'Export PDF',
    'priority-support': 'Support',
    'extra-child-price': 'Anak Tambahan',
  }
  return names[slug] || slug
}

function featureDisplay(feature) {
  if (feature.value === 'true') return '✓'
  if (feature.value === 'false') return '✗'
  const num = parseInt(feature.value)
  if (!isNaN(num) && num > 1000) return `Rp${num.toLocaleString('id-ID')}`
  return feature.value
}

function getExtraPrice(plan) {
  const f = plan.features.find(f => f.slug === 'extra-child-price')
  return f?.value || null
}

function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function selectPlan(plan) {
  selectedPlan.value = plan
  purchaseResult.value = null
  removeDiscount()
}

function applyDiscount() {
  discountError.value = ''
  const code = discountCode.value.trim().toUpperCase()
  if (!code) {
    discountError.value = 'Masukkan kode diskon'
    return
  }
  const found = auth.discounts.find(d => d.code.toUpperCase() === code)
  if (found) {
    discountType.value = found.type
    discountValue.value = found.value
    discountApplied.value = true
    discountError.value = ''
  } else {
    discountError.value = 'Kode diskon tidak valid'
    discountApplied.value = false
    discountType.value = ''
    discountValue.value = 0
  }
}

function removeDiscount() {
  discountCode.value = ''
  discountApplied.value = false
  discountType.value = ''
  discountValue.value = 0
  discountError.value = ''
  showDiscountInput.value = false
}

async function processPurchase() {
  if (!selectedPlan.value) return
  purchasing.value = true
  purchaseResult.value = null

  try {
    const res = await api.purchasePlan(selectedPlan.value.id, discountCode.value || null)
    auth.applyServerData(res)
    purchaseResult.value = { success: true, message: res.message || 'Pembayaran berhasil!' }
    setTimeout(() => {
      showPurchaseModal.value = false
      purchaseResult.value = null
      removeDiscount()
    }, 2000)
  } catch (e) {
    purchaseResult.value = { success: false, message: e.message || 'Gagal memproses pembayaran' }
  } finally {
    purchasing.value = false
  }
}

onMounted(async () => {
  if (auth.plans.length === 0) {
    try {
      const data = await api.getPlans()
      if (data.plans) auth.plans = data.plans
      if (data.discounts) auth.discounts = data.discounts
    } catch (e) {
      console.warn('Failed to load plans:', e)
    }
  }
})
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
