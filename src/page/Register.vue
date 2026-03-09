<script>
import { register } from '../utils/api.js'
import { getToken } from '../utils/auth.js'
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
        await register(this.name, this.password)
        this.$router.push('/login')
      } catch (err) {
        this.error = err.message || '注册失败，但后端没有返回错误'
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
  <AuthCard icon="📝" title="用户注册" subtitle="创建一个新账户，开始使用我们的服务" theme="green">
    <form @submit="handleSubmit" class="auth-form">
      <FormInput 
        id="username"
        label="用户名"
        type="text"
        v-model="name"
        :required="true"
        placeholder="请输入用户名 (3-20个字符)"
        :minlength="3"
        :maxlength="20"
        autocomplete="username"
        theme="green"
      />
      <FormInput 
        id="password"
        label="密码"
        type="password"
        v-model="password"
        :required="true"
        placeholder="请输入密码 (至少6位)"
        :minlength="6"
        autocomplete="new-password"
        theme="green"
      />
      <ErrorMessage v-if="error" :message="error" />
      <SubmitButton 
        text="注册" 
        loading-text="注册中..." 
        :loading="loading"
        theme="green"
      />
    </form>
    <div class="card-footer">
      <span>已有账户？</span>
      <router-link to="/login" class="link">立即登录</router-link>
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
  color: #67c23a;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.3s;
}

.link:hover {
  color: #85ce61;
  text-decoration: underline;
}
</style>
