<script>
import { isLogin, removeToken } from './utils/auth.js'
import { logout } from './utils/api.js'

export default {
  data() {
    return {
      isLogin
    }
  },
  methods: {
    async handleLogout() {
      try {
        await logout()
      } catch (err) {
        console.error('Logout failed:', err)
      } finally {
        removeToken()
        this.$router.push('/login')
      }
    }
  }
}
</script>

<template>
  <div class="view">
  <nav>
    <ul>
      <li v-if="!isLogin">
        <router-link to="/login">Login</router-link>
      </li>
      <li v-if="!isLogin">
        <router-link to="/register">Register</router-link>
      </li>
      <li v-if="isLogin">
        <router-link to="/">Home</router-link>
      </li>
      <li v-if="isLogin">
        <button @click="handleLogout">Logout</button>
      </li>
    </ul>
  </nav>

  <div>
    <RouterView />
  </div>
  </div>
</template>

<style>
  .view{
    margin: 0;
    padding: 0;
    display: flex;
  }
</style>
