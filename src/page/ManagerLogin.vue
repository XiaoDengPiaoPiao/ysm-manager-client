<template>
  <AuthCard icon="🔑" title="管理员登录" subtitle="请输入管理员密钥以访问管理后台" theme="gray">
    <form @submit="handleSubmit" class="auth-form">
      <FormInput 
        id="adminKey"
        label="管理员密钥"
        type="password"
        v-model="adminKey"
        :required="true"
        placeholder="请输入管理员密钥"
        autocomplete="off"
        theme="gray"
      />
      <ErrorMessage v-if="error" :message="error" />
      <SubmitButton 
        text="登录" 
        loading-text="验证中..." 
        :loading="loading"
        theme="gray"
      />
    </form>
  </AuthCard>
</template>

<script>
import { setAdminKey, getAdminKey } from '../utils/auth.js'
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
      adminKey: '',
      loading: false,
      error: ''
    }
  },
  mounted() {
    const existingKey = getAdminKey()
    if (existingKey) {
      this.$router.push('/manager')
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.loading = true
      this.error = ''
      
      setAdminKey(this.adminKey)
      this.$router.push('/manager')
    }
  }
}
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
