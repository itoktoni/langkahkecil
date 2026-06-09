<template>
  <div class="min-h-screen bg-canvas-cream flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🌸</div>
        <h1 class="text-2xl font-bold text-text-main">Halo Bunda</h1>
        <p class="text-sm text-on-surface-variant mt-1">Masuk ke akun Anda</p>
      </div>

      <div class="bg-white rounded-[24px] border-4 border-[#B7D9BC] shadow-lg p-6">
        <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4">
          <p class="text-xs text-red-600 font-medium text-center">{{ error }}</p>
        </div>

        <div v-if="mode === 'check-email'" class="text-center py-4">
          <div class="text-4xl mb-3">📧</div>
          <h3 class="font-bold text-text-main mb-2">Cek Email Anda</h3>
          <p class="text-sm text-on-surface-variant">Klik link login yang dikirim ke <strong>{{ form.email }}</strong></p>
          <button @click="mode = 'login'" class="mt-4 text-sm font-bold text-primary hover:underline">Kembali</button>
        </div>

        <template v-else>
          <div class="flex gap-2 mb-6">
            <button @click="mode = 'magic'"
              class="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
              :class="mode === 'magic' ? 'bg-primary text-white border-primary' : 'border-[#B7D9BC] text-on-surface-variant'">
              Magic Link
            </button>
            <button @click="mode = 'login'"
              class="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
              :class="mode === 'login' ? 'bg-primary text-white border-primary' : 'border-[#B7D9BC] text-on-surface-variant'">
              Password
            </button>
            <button @click="mode = 'register'"
              class="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
              :class="mode === 'register' ? 'bg-primary text-white border-primary' : 'border-[#B7D9BC] text-on-surface-variant'">
              Daftar
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Email</label>
              <input v-model="form.email" type="email"
                class="w-full px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary"
                placeholder="email@example.com" @keyup.enter="submit" />
            </div>
            <div v-if="mode !== 'magic'">
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Password</label>
              <input v-model="form.password" type="password"
                class="w-full px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary"
                placeholder="Minimal 6 karakter" @keyup.enter="submit" />
            </div>
            <div v-if="mode === 'register'">
              <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Konfirmasi Password</label>
              <input v-model="form.confirmPassword" type="password"
                class="w-full px-3 py-2.5 rounded-xl border-2 border-[#B7D9BC] text-sm focus:outline-none focus:border-primary"
                placeholder="Ulangi password" @keyup.enter="submit" />
            </div>
          </div>

          <button @click="submit" :disabled="submitting"
            class="w-full mt-5 py-3 rounded-2xl text-white text-sm font-bold transition-all"
            :class="submitting ? 'bg-gray-400' : 'bg-primary hover:opacity-90 active:scale-[0.98]'">
            {{ submittingText }}
          </button>

          <button v-if="mode === 'login'" @click="forgotPassword"
            class="w-full mt-2 py-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
            Lupa Password?
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/authStore.js'

const auth = useAuthStore()

const mode = ref('magic')
const error = ref('')
const submitting = ref(false)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const submittingText = computed(() => {
  if (submitting.value) return 'Memproses...'
  if (mode.value === 'magic') return 'Kirim Link Login'
  if (mode.value === 'register') return 'Daftar'
  return 'Masuk'
})

async function submit() {
  if (!form.email) {
    error.value = 'Email wajib diisi'
    return
  }
  error.value = ''
  submitting.value = true

  try {
    if (mode.value === 'magic') {
      await auth.signInWithMagicLink(form.email)
      mode.value = 'check-email'
    } else if (mode.value === 'register') {
      if (form.password !== form.confirmPassword) {
        error.value = 'Password tidak cocok'
        return
      }
      if (form.password.length < 6) {
        error.value = 'Password minimal 6 karakter'
        return
      }
      const { user: newUser } = await auth.signUp(form.email, form.password)
      if (newUser && !newUser.email_confirmed_at) {
        mode.value = 'check-email'
      }
    } else {
      await auth.signIn(form.email, form.password)
    }
  } catch (e) {
    error.value = e.message === 'Invalid login credentials'
      ? 'Email atau password salah'
      : e.message
  } finally {
    submitting.value = false
  }
}

async function forgotPassword() {
  if (!form.email) {
    error.value = 'Masukkan email terlebih dahulu'
    return
  }
  error.value = ''
  try {
    await auth.resetPassword(form.email)
    error.value = 'Link reset password telah dikirim ke email Anda'
  } catch (e) {
    error.value = e.message
  }
}
</script>
