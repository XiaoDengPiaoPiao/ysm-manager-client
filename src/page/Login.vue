<script>
import { login } from '../utils/api.js'
import { setToken, getToken } from '../utils/auth.js'

export default {
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
                // 登录成功，存储token
                setToken(response.data.token)
                // 跳转到首页或其他页面
                this.$router.push('/')
            } catch (err) {
                this.error = err.message || '登录失败，但后端没有返回错误'
            } finally {
                this.loading = false
            }
        }
    },
    mounted() {
        // 检查是否有token
        const token = getToken()
        if (token) {
            // 有token，跳转到首页或其他页面
            this.$router.push('/')
        }
    }
}
</script>

<template>
    <div>
        <h2>Login</h2>
        <form @submit="handleSubmit">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="name" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div v-if="error">{{ error }}</div>
            <div>
                <button type="submit" :disabled="loading">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>

</style>
