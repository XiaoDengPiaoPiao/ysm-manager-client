<script>
import { login } from '../utils/api.js'
import { setToken, getToken, setUsername } from '../utils/auth.js'
import AuthCard from '../components/AuthCard.vue'
import FormInput from '../components/FormInput.vue'
import SubmitButton from '../components/SubmitButton.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

export default {
  components: {
    AuthCard,
    FormInput,
    SubmitButton,
    ErrorMessage
  },
  data() {
    return {
      name: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault()
      this.loading = true
      this.error = ''

      try {
        const response = await login(this.name, this.password)
        setToken(response.data.token)
        setUsername(this.name)
        this.$router.push('/')
      } catch (err) {
        this.error = err.message || '登录失败，但后端没有返回错误'
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    const token = getToken()
    if (token) {
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <AuthCard icon="🔐" title="用户登录" subtitle="欢迎回来，请登录您的账户" theme="blue">
    <form @submit="handleSubmit" class="auth-form">
      <FormInput 
        id="username"
        label="用户名"
        type="text"
        v-model="name"
        :required="true"
        placeholder="请输入用户名"
        autocomplete="username"
      />
      <FormInput 
        id="password"
        label="密码"
        type="password"
        v-model="password"
        :required="true"
        placeholder="请输入密码"
        autocomplete="current-password"
      />
      <ErrorMessage v-if="error" :message="error" />
      <SubmitButton 
        text="登录" 
        loading-text="登录中..." 
        :loading="loading"
        theme="blue"
      />
    </form>
    <div class="card-footer">
      <span>还没有账户？</span>
      <router-link to="/register" class="link">立即注册</router-link>
    </div>
  </AuthCard>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #909399;
}

.link {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.3s;
}

.link:hover {
  color: #66b1ff;
  text-decoration: underline;
}
</style>
