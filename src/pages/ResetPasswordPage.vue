<template>
  <div class="min-h-screen flex items-center justify-center bg-canvas-cream px-4">
    <div class="w-full max-w-sm">
      <div class="bg-white rounded-[32px] border-4 border-[#B7D9BC] p-6 shadow-lg">
        <div class="text-center mb-6">
          <div class="text-4xl mb-2">🔐</div>
          <h2 class="font-headline-md text-text-main">Reset Password</h2>
          <p class="text-sm text-on-surface-variant mt-1">Masukkan password baru Anda</p>
        </div>

        <div class="space-y-4">
          <input v-model="newPassword" type="password"
            class="w-full px-4 py-3 rounded-2xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
            placeholder="Password baru (min. 6 karakter)" />
          <input v-model="confirmPassword" type="password"
            class="w-full px-4 py-3 rounded-2xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary bg-white"
            placeholder="Konfirmasi password baru" />
        </div>

        <p v-if="error" class="text-xs text-error font-medium mt-3 text-center">{{ error }}</p>
        <p v-if="success" class="text-xs text-primary font-medium mt-3 text-center">{{ success }}</p>

        <button @click="submit" :disabled="submitting"
          class="w-full py-3 mt-4 rounded-2xl text-white text-sm font-bold btn-pop-green">
          {{ submitting ? 'Menyimpan...' : 'Simpan Password Baru' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore.js'

const auth = useAuthStore()
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const submitting = ref(false)

async function submit() {
  error.value = ''
  success.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Kedua field wajib diisi'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = 'Password minimal 6 karakter'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Password tidak cocok'
    return
  }

  submitting.value = true
  try {
    await auth.updatePassword(newPassword.value)
    success.value = 'Password berhasil diubah! Mengalihkan...'
    setTimeout(() => {
      auth.isRecovery = false
    }, 1500)
  } catch (e) {
    error.value = e.message || 'Gagal mengubah password'
  } finally {
    submitting.value = false
  }
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
.btn-pop-green:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
