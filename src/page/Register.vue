<script>
import { register } from '../utils/api.js'
import { getToken } from '../utils/auth.js'

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
                await register(this.name, this.password, this.gameName)
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
    <div class="auth-card">
        <div class="card-header">
            <div class="card-icon">📝</div>
            <h2>用户注册</h2>
            <p class="subtitle">创建一个新账户，开始使用我们的服务</p>
        </div>
        <form @submit="handleSubmit" class="auth-form">
            <div class="form-group">
                <label for="username">用户名</label>
                <input 
                    type="text" 
                    id="username" 
                    v-model="name" 
                    required
                    placeholder="请输入用户名 (3-20个字符)"
                    minlength="3"
                    maxlength="20"
                    autocomplete="username"
                >
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="password" 
                    required
                    placeholder="请输入密码 (至少6位)"
                    minlength="6"
                    autocomplete="new-password"
                >
            </div>
            <div class="form-group">
                <label for="gameName">游戏名称</label>
                <input 
                    type="text" 
                    id="gameName" 
                    v-model="gameName" 
                    required
                    placeholder="请输入游戏名称 (3-30个字符)"
                    minlength="3"
                    maxlength="30"
                    autocomplete="off"
                >
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <button 
                type="submit" 
                class="submit-btn"
                :disabled="loading"
            >
                {{ loading ? '注册中...' : '注册' }}
            </button>
        </form>
        <div class="card-footer">
            <span>已有账户？</span>
            <router-link to="/login" class="link">立即登录</router-link>
        </div>
    </div>
</template>

<style scoped>
.auth-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    padding: 40px;
    max-width: 420px;
    width: 100%;
    animation: slideIn 0.4s ease-out;
    border-left: 4px solid #67c23a;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.card-header {
    text-align: center;
    margin-bottom: 32px;
}

.card-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.card-header h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
}

.subtitle {
    color: #909399;
    font-size: 14px;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
}

.form-group input {
    padding: 14px 16px;
    border: 2px solid #e4e7ed;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
}

.form-group input:focus {
    outline: none;
    border-color: #67c23a;
    box-shadow: 0 0 0 3px rgba(103, 194, 58, 0.1);
}

.error-message {
    padding: 12px 16px;
    background-color: #fef0f0;
    border: 1px solid #fde2e2;
    color: #f56c6c;
    border-radius: 8px;
    font-size: 14px;
}

.submit-btn {
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(103, 194, 58, 0.35);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
