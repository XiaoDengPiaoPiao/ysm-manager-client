<script>
import { removeToken, isLogin } from '../utils/auth.js'
import ModelUpload from '../components/modelUpload.vue'

export default {
    components: {
        ModelUpload
    },
    data() {
        return {
            isLogin,
            showCustomUpload: false,
            showAuthUpload: false
        }
    },
    methods: {
        toggleCustomUpload() {
            this.showCustomUpload = !this.showCustomUpload
            this.showAuthUpload = false
        },
        toggleAuthUpload() {
            this.showAuthUpload = !this.showAuthUpload
            this.showCustomUpload = false
        }
    }
}
</script>

<template>
    <div class="home">
        <div class="page-header">
            <h1>模型上传</h1>
            <p class="subtitle">选择上传公共模型或私人模型</p>
        </div>
        
        <div class="cards-container">
            <div 
                @click="toggleCustomUpload" 
                :class="['upload-card', 'custom-card', { active: showCustomUpload }]"
            >
                <div class="card-icon">
                    🌐
                </div>
                <h3>公共模型上传</h3>
                <p>上传可以被所有用户使用的公共模型</p>
                <div class="card-action">
                    <span>{{ showCustomUpload ? '收起' : '上传' }}</span>
                </div>
            </div>

            <div 
                @click="toggleAuthUpload" 
                :class="['upload-card', 'auth-card', { active: showAuthUpload }]"
            >
                <div class="card-icon">
                    🔒
                </div>
                <h3>私人模型上传</h3>
                <p>上传只有您授权的用户才能使用的私人模型</p>
                <div class="card-action">
                    <span>{{ showAuthUpload ? '收起' : '上传' }}</span>
                </div>
            </div>
        </div>

        <transition name="slide">
            <div v-if="showCustomUpload" class="upload-container">
                <ModelUpload type="custom" @close="showCustomUpload = false" />
            </div>
        </transition>

        <transition name="slide">
            <div v-if="showAuthUpload" class="upload-container">
                <ModelUpload type="auth" @close="showAuthUpload = false" />
            </div>
        </transition>
    </div>
</template>

<style scoped>
.home {
    max-width: 1000px;
}

.page-header {
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
}

.subtitle {
    color: #909399;
    font-size: 14px;
}

.cards-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.upload-card {
    background: white;
    border-radius: 16px;
    padding: 40px 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.upload-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.upload-card.active {
    border-color: #409eff;
    background: linear-gradient(135deg, #ecf5ff 0%, #ffffff 100%);
}

.custom-card:hover {
    border-color: #409eff;
}

.auth-card:hover {
    border-color: #67c23a;
}

.card-icon {
    font-size: 48px;
    margin-bottom: 20px;
}

.upload-card h3 {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
}

.upload-card p {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 24px;
}

.card-action {
    text-align: center;
}

.card-action span {
    display: inline-block;
    padding: 10px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
}

.custom-card .card-action span {
    background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
    color: white;
}

.auth-card .card-action span {
    background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
    color: white;
}

.upload-card:hover .card-action span {
    transform: scale(1.05);
}

.upload-container {
    margin-top: 40px;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

@media (max-width: 768px) {
    .cards-container {
        grid-template-columns: 1fr;
    }
}
</style>