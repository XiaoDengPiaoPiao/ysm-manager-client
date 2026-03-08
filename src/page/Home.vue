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
        <h1>Welcome to Home Page</h1>
        
        <div class="button-group">
            <button @click="toggleCustomUpload" :class="{ active: showCustomUpload }">
                公共模型上传
            </button>
            <button @click="toggleAuthUpload" :class="{ active: showAuthUpload }">
                私人模型上传
            </button>
        </div>

        <div v-if="showCustomUpload" class="upload-container">
            <ModelUpload type="custom" @close="showCustomUpload = false" />
        </div>

        <div v-if="showAuthUpload" class="upload-container">
            <ModelUpload type="auth" @close="showAuthUpload = false" />
        </div>
    </div>
</template>

<style scoped>
.home {
    padding: 20px;
}

.home h1 {
    margin-bottom: 30px;
    color: #333;
}

.button-group {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.button-group button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    background-color: #409eff;
    color: white;
}

.button-group button:hover {
    background-color: #66b1ff;
}

.button-group button.active {
    background-color: #337ecc;
}

.logout-btn {
    background-color: #f56c6c !important;
}

.logout-btn:hover {
    background-color: #f78989 !important;
}

.upload-container {
    margin-top: 20px;
}
</style>