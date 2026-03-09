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
      <div class="manager-cards-grid">
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
            <ErrorMessage v-if="resetError" :message="resetError" />
            <SuccessMessage v-if="resetSuccess" :message="resetSuccess" />
            <SubmitButton 
              text="重置密码" 
              loading-text="重置中..." 
              :loading="resetLoading"
            />
          </form>
        </div>

        <div class="manager-card">
          <div class="card-header-section">
            <div class="card-icon-wrapper">
              <span class="card-icon">🔍</span>
            </div>
            <div class="card-header-text">
              <h2 class="manager-card-title">获取模型信息</h2>
              <p class="manager-card-description">通过文件名获取模型详细信息</p>
            </div>
          </div>
          <form @submit="handleGetModel" class="reset-form">
            <FormInput 
              id="modelFileName"
              label="文件名"
              type="text"
              v-model="modelFileName"
              :required="true"
              placeholder="请输入模型文件名，如：星穹铁道-花火2.2.ysm"
              autocomplete="off"
            />
            <ErrorMessage v-if="modelError" :message="modelError" />
            <SubmitButton 
              text="获取信息" 
              loading-text="获取中..." 
              :loading="modelLoading"
            />
          </form>
          
          <div v-if="modelInfo" class="model-info-display">
            <div class="info-section">
              <h3>📋 基本信息</h3>
              <div class="info-item">
                <span class="info-label">模型ID：</span>
                <span class="info-value">{{ modelInfo.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">文件名：</span>
                <span class="info-value">{{ modelInfo.fileName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">类型：</span>
                <span class="info-value">{{ modelInfo.currentType }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">授权状态：</span>
                <span class="info-value">{{ modelInfo.allowAuth ? '已授权' : '未授权' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Hash：</span>
                <span class="info-value hash">{{ modelInfo.hash }}</span>
              </div>
            </div>
            
            <div class="info-section" v-if="modelInfo.uploaders && modelInfo.uploaders.length > 0">
              <h3>👤 上传者信息</h3>
              <div class="info-item" v-for="(uploader, index) in modelInfo.uploaders" :key="index">
                <span class="info-label">用户名：</span>
                <span class="info-value">{{ uploader.name }}</span>
              </div>
              <div class="info-item" v-for="(uploader, index) in modelInfo.uploaders" :key="'game-' + index">
                <span class="info-label">游戏名称：</span>
                <span class="info-value">{{ uploader.gameName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="manager-card">
          <div class="card-header-section">
            <div class="card-icon-wrapper delete">
              <span class="card-icon">🗑️</span>
            </div>
            <div class="card-header-text">
              <h2 class="manager-card-title">删除模型</h2>
              <p class="manager-card-description">通过模型ID删除模型</p>
            </div>
          </div>
          <form @submit="handleDeleteModel" class="reset-form">
            <FormInput 
              id="modelId"
              label="模型ID"
              type="number"
              v-model="modelId"
              :required="true"
              placeholder="请输入模型ID"
              autocomplete="off"
            />
            <ErrorMessage v-if="deleteError" :message="deleteError" />
            <SuccessMessage v-if="deleteSuccess" :message="deleteSuccess" />
            <SubmitButton 
              text="删除模型" 
              loading-text="删除中..." 
              :loading="deleteLoading"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAdminKey, removeAdminKey } from '../utils/auth.js'
import { resetPassword, getModelByFileName, deleteModel } from '../utils/api.js'
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
      resetLoading: false,
      resetError: '',
      resetSuccess: '',
      modelFileName: '',
      modelLoading: false,
      modelError: '',
      modelInfo: null,
      modelId: '',
      deleteLoading: false,
      deleteError: '',
      deleteSuccess: ''
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
      this.resetLoading = true
      this.resetError = ''
      this.resetSuccess = ''

      try {
        await resetPassword(this.username, this.adminKey)
        this.resetSuccess = '密码重置成功！'
        this.username = ''
      } catch (err) {
        this.resetError = err.message || '重置密码失败，请稍后再试'
      } finally {
        this.resetLoading = false
      }
    },
    
    async handleGetModel(e) {
      e.preventDefault()
      this.modelLoading = true
      this.modelError = ''
      this.modelInfo = null

      try {
        const result = await getModelByFileName(this.modelFileName, this.adminKey)
        this.modelInfo = result.data
      } catch (err) {
        this.modelError = err.message || '获取模型信息失败，请稍后再试'
      } finally {
        this.modelLoading = false
      }
    },
    
    async handleDeleteModel(e) {
      e.preventDefault()
      this.deleteLoading = true
      this.deleteError = ''
      this.deleteSuccess = ''

      try {
        const result = await deleteModel(this.modelId, this.adminKey)
        this.deleteSuccess = `模型删除成功！文件名：${result.data.fileName}`
        this.modelId = ''
      } catch (err) {
        this.deleteError = err.message || '删除模型失败，请稍后再试'
      } finally {
        this.deleteLoading = false
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
  max-width: 1600px;
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

.manager-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1400px;
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

.card-icon-wrapper.delete {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
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

.model-info-display {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px dashed #e0e0e0;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #606266;
  min-width: 100px;
}

.info-value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.info-value.hash {
  font-family: monospace;
  font-size: 13px;
  color: #409eff;
}
</style>
