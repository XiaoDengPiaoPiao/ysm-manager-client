<script>
import { isLogin, removeToken, getUsername, getAdminKey } from './utils/auth.js'
import { logout } from './utils/api.js'

export default {
  data() {
    return {
      isLogin,
      username: '',
      adminKey: ''
    }
  },
  mounted() {
    this.username = getUsername()
    this.adminKey = getAdminKey()
  },
  watch: {
    isLogin: {
      handler() {
        this.username = getUsername()
        this.adminKey = getAdminKey()
      },
      immediate: true
    },
    $route: {
      handler() {
        this.adminKey = getAdminKey()
      },
      immediate: true
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
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>YSM Manager</h2>
        <span>version: 0.0.1</span>
      </div>
      <nav class="nav-menu">
        <router-link 
          v-if="isLogin" 
          to="/" 
          class="nav-item"
          active-class="active"
        >
          <span>🏠</span>
          <span>首页</span>
        </router-link>
        <router-link 
          v-if="isLogin" 
          to="/list" 
          class="nav-item"
          active-class="active"
        >
          <span>📋</span>
          <span>模型列表</span>
        </router-link>
        <router-link 
          v-if="isLogin" 
          to="/user" 
          class="nav-item"
          active-class="active"
        >
          <span>👤</span>
          <span>{{ username }}</span>
        </router-link>
        
        <router-link 
          v-if="isLogin && username === 'nullname' && adminKey" 
          to="/manager" 
          class="nav-item"
          active-class="active"
        >
          <span>⚙️</span>
          <span>管理后台</span>
        </router-link>
        
        <router-link 
          v-if="isLogin && username === 'nullname' && !adminKey" 
          to="/managerLogin" 
          class="nav-item"
          active-class="active"
        >
          <span>🔑</span>
          <span>管理员登录</span>
        </router-link>
        
        <template v-if="!isLogin">
          <router-link 
            to="/login" 
            class="nav-item"
            active-class="active"
          >
            <span>🔐</span>
            <span>登录</span>
          </router-link>
          <router-link 
            to="/register" 
            class="nav-item"
            active-class="active"
          >
            <span>📝</span>
            <span>注册</span>
          </router-link>
        </template>
      </nav>
      <div class="sidebar-footer">
        <button v-if="isLogin" @click="handleLogout" class="logout-btn">
          <span>🚪</span>
          <span>退出登录</span>
        </button>
      </div>
    </aside>

    <main class="main-content" :class="{ 'auth-page': !isLogin }">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.nav-menu {
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-right: 3px solid #409eff;
}

.nav-item span:first-child {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn span:first-child {
  font-size: 18px;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 30px;
  min-height: 100vh;
}

.main-content.auth-page {
  display: flex;
  align-items: flex-start;
  padding-top: 60px;
}
</style>
