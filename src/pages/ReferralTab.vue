<template>
  <div class="px-margin-mobile md:px-margin-desktop pt-5 max-w-6xl mx-auto pb-8">

    <!-- Hero Card -->
    <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-primary shadow-lg mb-5">
      <div class="flex items-start gap-3 mb-5">
        <div class="w-12 h-12 rounded-full bg-success-soft flex items-center justify-center border-2 border-white shadow-sm shrink-0">
          <span class="material-symbols-outlined text-2xl text-primary">group_add</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-lg text-text-main">Ajak Teman</p>
          <p class="text-xs text-on-surface-variant mt-0.5">Bagikan link referral dan dapatkan manfaat bersama</p>
        </div>
      </div>

      <!-- Code -->
      <div class="bg-white rounded-xl p-4 border-2 border-primary mb-3">
        <p class="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">Kode Referral Kamu</p>
        <p class="text-2xl font-bold text-primary tracking-widest">{{ auth.user?.affiliate_code || '-' }}</p>
      </div>

      <!-- Link + Salin -->
      <div class="flex items-stretch bg-white rounded-xl border-2 border-primary overflow-hidden mb-3">
        <div class="flex-1 px-3 py-3 min-w-0 flex flex-col justify-center">
          <p class="text-[11px] text-on-surface-variant mb-0.5">Link Referral</p>
          <p class="text-sm font-bold text-primary truncate">{{ referralLink }}</p>
        </div>
        <button @click="copyLink"
          class="px-4 bg-primary hover:bg-primary/90 transition-colors text-white font-bold text-sm flex items-center gap-1.5 border-l-2 border-primary">
          <span class="material-symbols-outlined text-base">{{ copied ? 'check' : 'content_copy' }}</span>
          {{ copied ? 'Tersalin!' : 'Salin' }}
        </button>
      </div>

      <!-- Edit Data + Share -->
      <div class="flex gap-2">
        <button @click="startEditData"
          class="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary hover:bg-success-soft transition-colors">
          <span class="material-symbols-outlined text-base">edit</span>
          Edit Data
        </button>
        <button @click="shareLink"
          class="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors">
          <span class="material-symbols-outlined text-base">share</span>
          Share Link
        </button>
      </div>
    </div>

    <!-- Edit Data Modal -->
    <div v-if="editingData" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @mousedown.self="editingData = false">
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-[#B7D9BC] shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-lg text-text-main mb-4">Edit Data Rekening</h3>

        <div class="mb-3">
          <label class="text-xs text-on-surface-variant font-bold mb-1 block">Kode Referral</label>
          <input v-model="editCodeValue"
            class="w-full px-4 py-3 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white uppercase tracking-wider font-bold"
            placeholder="KODEUNIK" maxlength="20" />
          <p class="text-[10px] text-on-surface-variant mt-1">Huruf dan angka saja, 4-20 karakter</p>
        </div>

        <div class="mb-3">
          <label class="text-xs text-on-surface-variant font-bold mb-1 block">Nama Pemilik Rekening</label>
          <input v-model="rekeningForm.rekening_nama"
            class="w-full px-4 py-3 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
            placeholder="Nama sesuai rekening" />
        </div>

        <div class="mb-3">
          <label class="text-xs text-on-surface-variant font-bold mb-1 block">Bank</label>
          <select v-model="rekeningForm.rekening_bank"
            class="w-full px-4 py-3 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white">
            <option value="" disabled>Pilih bank</option>
            <option v-for="b in banks" :key="b.code" :value="b.name">{{ b.name }}</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="text-xs text-on-surface-variant font-bold mb-1 block">Nomor Rekening</label>
          <input v-model="rekeningForm.rekening_nomor"
            class="w-full px-4 py-3 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
            placeholder="Nomor rekening" />
        </div>

        <div class="mb-3">
          <label class="text-xs text-on-surface-variant font-bold mb-1 block">Diskon Affiliate untuk Customer</label>
          <div class="flex items-center gap-3">
            <input v-model.number="editAffiliateDiscount" type="range" min="0" :max="rates.commission_rate" step="1"
              class="flex-1 accent-primary" />
            <span class="text-sm font-bold text-primary w-12 text-right">{{ editAffiliateDiscount }}%</span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-1">
            Kamu dapat komisi <span class="font-bold">{{ editAffiliateDiscount }}%</span>,
            customer dapat diskon <span class="font-bold">{{ rates.customer_discount + (rates.commission_rate - editAffiliateDiscount) }}%</span>
          </p>
          <p v-if="editAffiliateDiscount === 0" class="text-[10px] text-primary mt-0.5">Semua komisi untuk customer</p>
        </div>

        <p v-if="editDataError" class="text-xs text-error font-medium mb-3">{{ editDataError }}</p>

        <div class="flex gap-3">
          <button @click="editingData = false"
            class="flex-1 py-3 rounded-2xl text-sm font-bold text-on-surface-variant btn-pop-gray">Batal</button>
          <button @click="saveData" :disabled="savingData"
            class="flex-1 py-3 rounded-2xl text-sm font-bold text-white btn-pop-green disabled:opacity-50">
            {{ savingData ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cashout Modal -->
    <div v-if="showCashout" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @mousedown.self="showCashout = false">
      <div class="bg-canvas-cream rounded-[32px] p-6 border-4 border-primary shadow-xl max-w-sm w-full">
        <h3 class="font-bold text-lg text-text-main mb-2">Cairkan Komisi</h3>
        <p class="text-xs text-on-surface-variant mb-4">Saldo tersedia: <span class="font-bold text-primary">Rp{{ totalKomisi.toLocaleString('id-ID') }}</span></p>

        <div class="mb-3">
          <label class="text-xs text-on-surface-variant font-bold mb-1 block">Nominal Pencairan</label>
          <input v-model.number="cashoutAmount" type="number" :min="cashoutConfig.minimum"
            class="w-full px-4 py-3 rounded-xl border-2 border-primary text-sm focus:outline-none focus:border-primary bg-white font-bold"
            :placeholder="'Minimal Rp' + cashoutConfig.minimum.toLocaleString('id-ID')" />
        </div>

        <div v-if="cashoutAmount >= cashoutConfig.minimum" class="bg-white rounded-xl p-3 border-2 border-[#B7D9BC] mb-3">
          <div class="flex justify-between text-xs text-on-surface-variant mb-1">
            <span>Administrasi ({{ cashoutConfig.admin_rate }}%)</span>
            <span class="font-bold text-error">-Rp{{ adminFee.toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex justify-between text-sm font-bold text-text-main">
            <span>Diterima</span>
            <span class="text-primary">Rp{{ received.toLocaleString('id-ID') }}</span>
          </div>
        </div>

        <div v-if="!hasRekening" class="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 mb-3">
          <p class="text-xs text-amber-700 font-medium">Lengkapi data rekening terlebih dahulu melalui tombol Edit Data.</p>
        </div>

        <p class="text-[11px] text-on-surface-variant mb-4">Pencairan diproses maksimal <span class="font-bold">2 hari kerja</span>.</p>

        <p v-if="cashoutError" class="text-xs text-error font-medium mb-3">{{ cashoutError }}</p>

        <div class="flex gap-3">
          <button @click="showCashout = false"
            class="flex-1 py-3 rounded-2xl text-sm font-bold text-on-surface-variant btn-pop-gray">Batal</button>
          <button @click="submitCashout" :disabled="cashingOut || !hasRekening"
            class="flex-1 py-3 rounded-2xl text-sm font-bold text-white btn-pop-green disabled:opacity-50">
            {{ cashingOut ? 'Memproses...' : 'Cairkan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Referral Stats -->
    <div class="space-y-3 mb-5">
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-canvas-cream rounded-[24px] p-5 border-4 border-[#B7D9BC] shadow-md text-center">
          <p class="text-xs text-on-surface-variant mb-1">Total Referral</p>
          <p class="font-bold text-2xl text-text-main">{{ referrals.length }}</p>
          <p class="text-xs text-on-surface-variant">Orang bergabung</p>
        </div>
        <div class="bg-canvas-cream rounded-[24px] p-5 border-4 border-[#B7D9BC] shadow-md text-center">
          <p class="text-xs text-on-surface-variant mb-1">Bonus Register</p>
          <p class="font-bold text-2xl text-text-main">Rp{{ bonusRegister.toLocaleString('id-ID') }}</p>
          <p class="text-xs text-on-surface-variant">@{{ rates.register_bonus.toLocaleString('id-ID') }} per referral</p>
        </div>
      </div>
      <div class="bg-canvas-cream rounded-[24px] p-5 border-4 border-[#B7D9BC] shadow-md">
        <p class="text-xs text-on-surface-variant mb-1">Komisi Upgrade</p>
        <p class="font-bold text-2xl text-text-main">Rp{{ earnings.upgrade.toLocaleString('id-ID') }}</p>
        <p class="text-xs text-on-surface-variant">{{ rates.commission_rate }}% dari pembayaran</p>
      </div>
      <div class="bg-canvas-cream rounded-[24px] p-5 border-4 border-primary shadow-md">
        <p class="text-xs text-on-surface-variant mb-1">Total Komisi</p>
        <p class="font-bold text-2xl text-primary">Rp{{ totalKomisi.toLocaleString('id-ID') }}</p>
        <p class="text-xs text-on-surface-variant">Saldo outstanding</p>
      </div>
      <p class="text-[11px] text-on-surface-variant text-center px-4">
        Saldo outstanding baru bisa dicairkan jika terdapat komisi dari upgrade referral.
        Bonus register akan masuk ke saldo setelah referral kamu melakukan upgrade.
      </p>
      <button @click="openCashout"
        class="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors"
        :disabled="totalKomisi < cashoutConfig.minimum">
        <span class="material-symbols-outlined text-base">payments</span>
        Cairkan Komisi
      </button>
    </div>

    <!-- Cashout History -->
    <div v-if="cashouts.length" class="mb-5">
      <p class="text-sm font-bold text-text-main mb-3">Riwayat Pencairan</p>
      <div class="space-y-2">
        <div v-for="c in cashouts" :key="c.id"
          class="bg-canvas-cream rounded-2xl p-4 border-2 border-[#B7D9BC]">
          <div class="flex items-center justify-between mb-1">
            <p class="font-bold text-sm text-text-main">Rp{{ c.amount.toLocaleString('id-ID') }}</p>
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg"
              :class="{
                'bg-amber-50 text-amber-600': c.status === 'pending',
                'bg-blue-50 text-blue-600': c.status === 'processing',
                'bg-success-soft text-primary': c.status === 'completed',
                'bg-red-50 text-red-600': c.status === 'rejected',
              }">
              {{ c.status === 'pending' ? 'Menunggu' : c.status === 'processing' ? 'Diproses' : c.status === 'completed' ? 'Selesai' : 'Ditolak' }}
            </span>
          </div>
          <div class="flex justify-between text-xs text-on-surface-variant">
            <span>Admin: Rp{{ c.admin_fee.toLocaleString('id-ID') }} · Diterima: Rp{{ c.received.toLocaleString('id-ID') }}</span>
            <span>{{ formatDate(c.created_at) }}</span>
          </div>
          <p class="text-[11px] text-on-surface-variant mt-1">{{ c.rekening_bank }} - {{ c.rekening_nomor }} a/n {{ c.rekening_nama }}</p>
        </div>
      </div>
    </div>

    <!-- Referral List -->
    <div v-if="referrals.length" class="space-y-3">
      <div v-for="r in referrals" :key="r.id"
        class="bg-canvas-cream rounded-2xl p-5 border-2 border-[#B7D9BC] flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-success-soft flex items-center justify-center border-2 border-white shadow-sm text-xl shrink-0">
          👤
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-base text-text-main truncate">{{ r.name }}</p>
          <p class="text-sm text-on-surface-variant truncate">{{ r.email }}</p>
        </div>
        <div class="text-right shrink-0">
          <span class="text-xs font-bold px-2.5 py-1 rounded-lg"
            :class="r.role === 'trial' ? 'bg-amber-50 text-amber-600' : 'bg-success-soft text-primary'">
            {{ r.role === 'trial' ? 'Trial' : r.role === 'premium' ? 'Premium' : 'Aktif' }}
          </span>
          <p class="text-xs text-on-surface-variant mt-1.5">{{ formatDate(r.joined_at) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="bg-canvas-cream rounded-[24px] p-8 text-center border-4 border-dashed border-[#B7D9BC]">
      <p class="text-4xl mb-2">🤝</p>
      <p class="text-sm text-on-surface-variant font-medium">Belum ada yang bergabung</p>
      <p class="text-xs text-on-surface-variant/60 mt-1">Bagikan link referral kamu untuk mengundang teman</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import { appConfig } from '../config/appConfig.js'
import * as api from '../services/api.js'

const auth = useAuthStore()

const copied = ref(false)
const referrals = ref([])
const earnings = ref({ total: 0, register: 0, upgrade: 0, pending: 0 })
const rates = ref({ register_bonus: 500, commission_rate: 15, commission_bonus: 1000, customer_discount: 20 })
const cashoutConfig = ref({ minimum: 50000, admin_rate: 3 })
const banks = ref([])
const cashouts = ref([])

const editingData = ref(false)
const editCodeValue = ref('')
const editAffiliateDiscount = ref(0)
const editDataError = ref('')
const savingData = ref(false)
const rekeningForm = ref({ rekening_nama: '', rekening_bank: '', rekening_nomor: '' })

const showCashout = ref(false)
const cashoutAmount = ref(null)
const cashoutError = ref('')
const cashingOut = ref(false)

const appUrl = import.meta.env.VITE_APP_URL || 'https://halobunda.app'
const referralLink = computed(() => {
  const code = auth.user?.affiliate_code || ''
  return code ? `${appUrl}?ref=${code}` : ''
})

const bonusRegister = computed(() => referrals.value.length * rates.value.register_bonus)
const totalKomisi = computed(() => earnings.value.upgrade + bonusRegister.value)
const hasRekening = computed(() => auth.user?.rekening_nama && auth.user?.rekening_bank && auth.user?.rekening_nomor)
const adminFee = computed(() => Math.round((cashoutAmount.value || 0) * cashoutConfig.value.admin_rate / 100))
const received = computed(() => (cashoutAmount.value || 0) - adminFee.value)

function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) { console.warn('Copy failed:', e) }
}

async function shareLink() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Undangan ${appConfig.name}`,
        text: `Yuk coba ${appConfig.name} — ${appConfig.tagline}`,
        url: referralLink.value,
      })
    } catch (e) {
      if (e.name !== 'AbortError') copyLink()
    }
  } else {
    copyLink()
  }
}

function startEditData() {
  editCodeValue.value = auth.user?.affiliate_code || ''
  editAffiliateDiscount.value = auth.user?.affiliate_discount || 0
  rekeningForm.value = {
    rekening_nama: auth.user?.rekening_nama || '',
    rekening_bank: auth.user?.rekening_bank || '',
    rekening_nomor: auth.user?.rekening_nomor || '',
  }
  editDataError.value = ''
  editingData.value = true
}

async function saveData() {
  editDataError.value = ''
  savingData.value = true
  try {
    const code = editCodeValue.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (code && code.length >= 4) {
      const codeRes = await api.updateAffiliateCode(code, editAffiliateDiscount.value)
      if (codeRes.user) {
        auth.user = codeRes.user
        localStorage.setItem('lk_user', JSON.stringify(codeRes.user))
      }
    }

    const rekRes = await api.updateRekening({ ...rekeningForm.value })
    if (rekRes.user) {
      auth.user = rekRes.user
      localStorage.setItem('lk_user', JSON.stringify(rekRes.user))
    }

    editingData.value = false
  } catch (e) {
    editDataError.value = e.message || 'Gagal menyimpan data'
  } finally {
    savingData.value = false
  }
}

function openCashout() {
  cashoutAmount.value = null
  cashoutError.value = ''
  showCashout.value = true
}

async function submitCashout() {
  cashoutError.value = ''
  if (!cashoutAmount.value || cashoutAmount.value < cashoutConfig.value.minimum) {
    cashoutError.value = `Minimal pencairan Rp${cashoutConfig.value.minimum.toLocaleString('id-ID')}`
    return
  }
  if (cashoutAmount.value > totalKomisi.value) {
    cashoutError.value = 'Nominal melebihi saldo tersedia'
    return
  }
  cashingOut.value = true
  try {
    const res = await api.requestCashout(cashoutAmount.value)
    if (res.komisi !== undefined) {
      auth.user.komisi = res.komisi
      localStorage.setItem('lk_user', JSON.stringify(auth.user))
    }
    if (res.cashout) {
      cashouts.value.unshift(res.cashout)
    }
    showCashout.value = false
  } catch (e) {
    cashoutError.value = e.message || 'Gagal memproses pencairan'
  } finally {
    cashingOut.value = false
  }
}

async function loadReferrals() {
  try {
    const res = await api.getReferrals()
    referrals.value = res.referrals || []
    if (res.earnings) earnings.value = res.earnings
    if (res.rates) rates.value = res.rates
    if (res.cashout) cashoutConfig.value = res.cashout
    if (res.banks) banks.value = res.banks
  } catch (e) { console.warn('Failed to load referrals:', e) }
}

async function loadCashouts() {
  try {
    const res = await api.getCashouts()
    cashouts.value = res.cashouts || []
  } catch (e) { console.warn('Failed to load cashouts:', e) }
}

onMounted(() => {
  loadReferrals()
  loadCashouts()
})
</script>

<style scoped>
.btn-pop-green { background-color: #6DBE7B; box-shadow: 0 4px 0 #176c33; transition: all 0.1s ease; }
.btn-pop-green:active { transform: translateY(4px); box-shadow: 0 0px 0 #176c33; }
.btn-pop-gray { background-color: #E5E7EB; box-shadow: 0 4px 0 #9CA3AF; transition: all 0.1s ease; }
.btn-pop-gray:active { transform: translateY(4px); box-shadow: 0 0px 0 #9CA3AF; }
</style>
