import { ref, computed } from 'vue'

const tokenRef = ref(localStorage.getItem('token'))

export const isLogin = computed(() => !!tokenRef.value)

export const getToken = () => tokenRef.value

export const setToken = (token) => {
  tokenRef.value = token
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  tokenRef.value = null
  localStorage.removeItem('token')
}

export const useAuth = () => {
  return {
    isLogin,
    token: tokenRef,
    getToken,
    setToken,
    removeToken
  }
}
