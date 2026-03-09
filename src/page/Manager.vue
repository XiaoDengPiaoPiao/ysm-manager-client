<template>
  <div class="manager-container">
    <div class="manager-header">
      <div class="header-left">
        <div class="manager-icon">⚙️</div>
        <h1 class="manager-title">管理后台</h1>
      </div>
      <button @click="handleLogout" class="logout-btn">
        <span>🚪</span>
        <span>退出管理后台</span>
      </button>
    </div>
    <div class="manager-wrapper">
      <div class="manager-card-container">
        <div class="manager-card">
          <div class="card-header-section">
            <div class="card-icon-wrapper">
              <span class="card-icon">🔑</span>
            </div>
            <div class="card-header-text">
              <h2 class="manager-card-title">重置用户密码</h2>
              <p class="manager-card-description">输入用户名来重置该用户的密码</p>
            </div>
          </div>
          <form @submit="handleResetPassword" class="reset-form">
            <FormInput 
              id="username"
              label="用户名"
              type="text"
              v-model="username"
              :required="true"
              placeholder="请输入需要重置密码的用户名"
              autocomplete="off"
            />
            <ErrorMessage v-if="error" :message="error" />
            <SuccessMessage v-if="success" :message="success" />
            <SubmitButton 
              text="重置密码" 
              loading-text="重置中..." 
              :loading="loading"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAdminKey, removeAdminKey } from '../utils/auth.js'
import { resetPassword } from '../utils/api.js'
import FormInput from '../components/FormInput.vue'
import SubmitButton from '../components/SubmitButton.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import SuccessMessage from '../components/SuccessMessage.vue'

export default {
  components: {
    FormInput,
    SubmitButton,
    ErrorMessage,
    SuccessMessage
  },
  data() {
    return {
      adminKey: '',
      username: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  mounted() {
    const key = getAdminKey()
    if (!key) {
      this.$router.push('/managerLogin')
    } else {
      this.adminKey = key
    }
  },
  methods: {
    async handleResetPassword(e) {
      e.preventDefault()
      this.loading = true
      this.error = ''
      this.success = ''

      try {
        await resetPassword(this.username, this.adminKey)
        this.success = '密码重置成功！'
        this.username = ''
      } catch (err) {
        this.error = err.message || '重置密码失败，请稍后再试'
      } finally {
        this.loading = false
      }
    },
    handleLogout() {
      removeAdminKey()
      this.$router.push('/managerLogin')
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.manager-container {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 40px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
}

.manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24px 60px 24px;
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.manager-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.manager-title {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 108, 108, 0.35);
}

.manager-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 24px;
}

.manager-card-container {
  width: 100%;
  max-width: 600px;
}

.manager-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.card-header-section {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f2f5;
}

.card-icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  font-size: 32px;
}

.card-header-text {
  flex: 1;
}

.manager-card-title {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 8px 0;
}

.manager-card-description {
  color: #909399;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
