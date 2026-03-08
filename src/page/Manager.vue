<template>
  <div class="manager-container">
    <div class="manager-header">
      <div class="manager-icon">⚙️</div>
      <h1 class="manager-title">管理后台</h1>
    </div>
    <div class="manager-content">
      <div class="manager-card">
        <h2 class="manager-card-title">重置用户密码</h2>
        <p class="manager-card-description">输入用户名来重置该用户的密码</p>
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
.manager-container {
  max-width: 1200px;
  margin: 0 auto;
}

.manager-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.manager-icon {
  font-size: 64px;
}

.manager-title {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

.manager-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.manager-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.manager-card-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.manager-card-description {
  color: #909399;
  font-size: 14px;
  margin-bottom: 24px;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
