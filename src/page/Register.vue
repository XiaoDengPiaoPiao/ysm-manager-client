<script>
import { register } from '../utils/api.js'

export default {
    data() {
        return {
            name: '',
            password: '',
            gameName: '',
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
                const response = await register(this.name, this.password, this.gameName)
                // 跳转到登录
                this.$router.push('/login')
            } catch (err) {
                this.error = err.message || '注册失败，但后端没有返回错误'
            } finally {
                this.loading = false
            }
        }
    },
    mounted() {
        // 检查是否有token
        const token = localStorage.getItem('token')
        if (token) {
            // 有token，跳转到首页或其他页面
            this.$router.push('/')
        }
    }
}
</script>

<template>
    <div>
        <h2>Register</h2>
        <form @submit="handleSubmit">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="name" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div>
                <label for="gameName">Game Name:</label>
                <input type="text" id="gameName" v-model="gameName" required>
            </div>
            <div v-if="error">{{ error }}</div>
            <div>
                <button type="submit" :disabled="loading">
                    {{ loading ? 'Registering...' : 'Register' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>

</style>
