import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '../services/api.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref('')
  const serverAnakList = ref([])

  const isAuthenticated = computed(() => !!token.value)

  // Initialize from localStorage
  function init() {
    const storedToken = api.getAuthToken()
    const storedUser = localStorage.getItem('lk_user')

    if (storedToken) {
      token.value = storedToken
    }
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        user.value = null
      }
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = ''

    try {
      const data = await api.login(email, password)
      token.value = data.access_token

      // Store user info
      if (data.user) {
        user.value = data.user
        localStorage.setItem('lk_user', JSON.stringify(data.user))
      }

      if (data.anak_list) {
        serverAnakList.value = data.anak_list
      }

      return data
    } catch (err) {
      error.value = err.message || 'Login gagal'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password, passwordConfirmation) {
    loading.value = true
    error.value = ''

    try {
      const data = await api.register(name, email, password, passwordConfirmation)
      token.value = data.access_token

      if (data.user) {
        user.value = data.user
        localStorage.setItem('lk_user', JSON.stringify(data.user))
      }

      return data
    } catch (err) {
      error.value = err.message || 'Registrasi gagal'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    api.logout()
    token.value = null
    user.value = null
    serverAnakList.value = []
    localStorage.removeItem('lk_user')
  }

  // Auto-init on store creation
  init()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    serverAnakList,
    login,
    register,
    logout,
    init
  }
})
