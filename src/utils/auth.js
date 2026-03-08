import { ref, computed } from 'vue'

const tokenRef = ref(localStorage.getItem('token'))
const usernameRef = ref(localStorage.getItem('username') || '')
const adminKeyRef = ref(localStorage.getItem('adminKey') || '')

export const isLogin = computed(() => !!tokenRef.value)

export const getToken = () => tokenRef.value

export const setToken = (token) => {
  tokenRef.value = token
  localStorage.setItem('token', token)
}

export const getUsername = () => usernameRef.value

export const setUsername = (username) => {
  usernameRef.value = username
  localStorage.setItem('username', username)
}

export const removeToken = () => {
  tokenRef.value = null
  localStorage.removeItem('token')
  usernameRef.value = ''
  localStorage.removeItem('username')
  removeAdminKey()
}

export const getAdminKey = () => adminKeyRef.value

export const setAdminKey = (key) => {
  adminKeyRef.value = key
  localStorage.setItem('adminKey', key)
}

export const removeAdminKey = () => {
  adminKeyRef.value = ''
  localStorage.removeItem('adminKey')
}

export const useAuth = () => {
  return {
    isLogin,
    token: tokenRef,
    username: usernameRef,
    adminKey: adminKeyRef,
    getToken,
    setToken,
    getUsername,
    setUsername,
    removeToken,
    getAdminKey,
    setAdminKey,
    removeAdminKey
  }
}
