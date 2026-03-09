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

        <div class="manager-card">
          <div class="card-header-section">
            <div class="card-icon-wrapper">
              <span class="card-icon">👤</span>
            </div>
            <div class="card-header-text">
              <h2 class="manager-card-title">通过用户名查询用户</h2>
              <p class="manager-card-description">输入用户名查询用户详细信息及上传统计</p>
            </div>
          </div>
          <form @submit="handleGetUserByUsername" class="reset-form">
            <FormInput 
              id="searchUsername"
              label="用户名"
              type="text"
              v-model="searchUsername"
              :required="true"
              placeholder="请输入用户名"
              autocomplete="off"
            />
            <ErrorMessage v-if="searchUserError" :message="searchUserError" />
            <SubmitButton 
              text="查询用户" 
              loading-text="查询中..." 
              :loading="searchUserLoading"
            />
          </form>
          <div v-if="searchedUser" class="user-info-display">
            <div class="info-section">
              <h3>📋 用户基本信息</h3>
              <div class="info-item">
                <span class="info-label">用户ID：</span>
                <span class="info-value">{{ searchedUser.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">用户名：</span>
                <span class="info-value">{{ searchedUser.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">游戏名：</span>
                <span class="info-value">{{ searchedUser.gameName || '未绑定' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">注册时间：</span>
                <span class="info-value">{{ formatDate(searchedUser.createdAt) }}</span>
              </div>
            </div>
            <div class="info-section">
              <h3>📊 上传统计</h3>
              <div class="info-item">
                <span class="info-label">公共模型：</span>
                <span class="info-value">{{ searchedUser.customUploaded }} / {{ searchedUser.customUploadLimit }} (剩余 {{ searchedUser.customRemaining }})</span>
              </div>
              <div class="info-item">
                <span class="info-label">私人模型：</span>
                <span class="info-value">{{ searchedUser.authUploaded }} / {{ searchedUser.authUploadLimit }} (剩余 {{ searchedUser.authRemaining }})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="manager-card">
          <div class="card-header-section">
            <div class="card-icon-wrapper">
              <span class="card-icon">🎮</span>
            </div>
            <div class="card-header-text">
              <h2 class="manager-card-title">通过游戏名查询用户</h2>
              <p class="manager-card-description">输入游戏名查询用户详细信息及上传统计</p>
            </div>
          </div>
          <form @submit="handleGetUserByGameName" class="reset-form">
            <FormInput 
              id="searchGameName"
              label="游戏名"
              type="text"
              v-model="searchGameName"
              :required="true"
              placeholder="请输入游戏名"
              autocomplete="off"
            />
            <ErrorMessage v-if="searchGameNameError" :message="searchGameNameError" />
            <SubmitButton 
              text="查询用户" 
              loading-text="查询中..." 
              :loading="searchGameNameLoading"
            />
          </form>
          <div v-if="searchedGameNameUser" class="user-info-display">
            <div class="info-section">
              <h3>📋 用户基本信息</h3>
              <div class="info-item">
                <span class="info-label">用户ID：</span>
                <span class="info-value">{{ searchedGameNameUser.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">用户名：</span>
                <span class="info-value">{{ searchedGameNameUser.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">游戏名：</span>
                <span class="info-value">{{ searchedGameNameUser.gameName || '未绑定' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">注册时间：</span>
                <span class="info-value">{{ formatDate(searchedGameNameUser.createdAt) }}</span>
              </div>
            </div>
            <div class="info-section">
              <h3>📊 上传统计</h3>
              <div class="info-item">
                <span class="info-label">公共模型：</span>
                <span class="info-value">{{ searchedGameNameUser.customUploaded }} / {{ searchedGameNameUser.customUploadLimit }} (剩余 {{ searchedGameNameUser.customRemaining }})</span>
              </div>
              <div class="info-item">
                <span class="info-label">私人模型：</span>
                <span class="info-value">{{ searchedGameNameUser.authUploaded }} / {{ searchedGameNameUser.authUploadLimit }} (剩余 {{ searchedGameNameUser.authRemaining }})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="manager-card">
          <div class="card-header-section">
            <div class="card-icon-wrapper">
              <span class="card-icon">⚙️</span>
            </div>
            <div class="card-header-text">
              <h2 class="manager-card-title">更新用户上传限制</h2>
              <p class="manager-card-description">更新用户的公共模型和私人模型上传上限</p>
            </div>
          </div>
          <form @submit="handleUpdateUploadLimit" class="reset-form">
            <FormInput 
              id="updateLimitUsername"
              label="用户名"
              type="text"
              v-model="updateLimitUsername"
              :required="true"
              placeholder="请输入用户名"
              autocomplete="off"
            />
            <FormInput 
              id="customUploadLimit"
              label="公共模型上限 (不填则不修改)"
              type="number"
              v-model="customUploadLimit"
              :required="false"
              placeholder="请输入公共模型上限"
              autocomplete="off"
            />
            <FormInput 
              id="authUploadLimit"
              label="私人模型上限 (不填则不修改)"
              type="number"
              v-model="authUploadLimit"
              :required="false"
              placeholder="请输入私人模型上限"
              autocomplete="off"
            />
            <ErrorMessage v-if="updateLimitError" :message="updateLimitError" />
            <SuccessMessage v-if="updateLimitSuccess" :message="updateLimitSuccess" />
            <SubmitButton 
              text="更新限制" 
              loading-text="更新中..." 
              :loading="updateLimitLoading"
            />
          </form>
          <div v-if="updatedUser" class="user-info-display">
            <div class="info-section">
              <h3>✅ 更新后信息</h3>
              <div class="info-item">
                <span class="info-label">用户名：</span>
                <span class="info-value">{{ updatedUser.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">公共模型上限：</span>
                <span class="info-value">{{ updatedUser.customUploadLimit }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">私人模型上限：</span>
                <span class="info-value">{{ updatedUser.authUploadLimit }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">公共模型已上传：</span>
                <span class="info-value">{{ updatedUser.customUploaded }} / {{ updatedUser.customUploadLimit }} (剩余 {{ updatedUser.customRemaining }})</span>
              </div>
              <div class="info-item">
                <span class="info-label">私人模型已上传：</span>
                <span class="info-value">{{ updatedUser.authUploaded }} / {{ updatedUser.authUploadLimit }} (剩余 {{ updatedUser.authRemaining }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAdminKey, removeAdminKey } from '../utils/auth.js'
import { resetPassword, getModelByFileName, deleteModel, getUserInfoByUsername, getUserInfoByGameName, updateUserUploadLimit } from '../utils/api.js'
import { formatDate } from '../utils/utils.js'
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
      deleteSuccess: '',
      searchUsername: '',
      searchUserLoading: false,
      searchUserError: '',
      searchedUser: null,
      searchGameName: '',
      searchGameNameLoading: false,
      searchGameNameError: '',
      searchedGameNameUser: null,
      updateLimitUsername: '',
      customUploadLimit: '',
      authUploadLimit: '',
      updateLimitLoading: false,
      updateLimitError: '',
      updateLimitSuccess: '',
      updatedUser: null
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
    formatDate,
    
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
    
    async handleGetUserByUsername(e) {
      e.preventDefault()
      this.searchUserLoading = true
      this.searchUserError = ''
      this.searchedUser = null

      try {
        const result = await getUserInfoByUsername(this.searchUsername, this.adminKey)
        this.searchedUser = result.data
      } catch (err) {
        this.searchUserError = err.message || '查询用户失败，请稍后再试'
      } finally {
        this.searchUserLoading = false
      }
    },
    
    async handleGetUserByGameName(e) {
      e.preventDefault()
      this.searchGameNameLoading = true
      this.searchGameNameError = ''
      this.searchedGameNameUser = null

      try {
        const result = await getUserInfoByGameName(this.searchGameName, this.adminKey)
        this.searchedGameNameUser = result.data
      } catch (err) {
        this.searchGameNameError = err.message || '查询用户失败，请稍后再试'
      } finally {
        this.searchGameNameLoading = false
      }
    },
    
    async handleUpdateUploadLimit(e) {
      e.preventDefault()
      this.updateLimitLoading = true
      this.updateLimitError = ''
      this.updateLimitSuccess = ''
      this.updatedUser = null

      try {
        const customLimit = this.customUploadLimit ? parseInt(this.customUploadLimit) : null
        const authLimit = this.authUploadLimit ? parseInt(this.authUploadLimit) : null
        
        const result = await updateUserUploadLimit(this.updateLimitUsername, customLimit, authLimit, this.adminKey)
        this.updatedUser = result.data
        this.updateLimitSuccess = '上传限制更新成功！'
        this.updateLimitUsername = ''
        this.customUploadLimit = ''
        this.authUploadLimit = ''
      } catch (err) {
        this.updateLimitError = err.message || '更新上传限制失败，请稍后再试'
      } finally {
        this.updateLimitLoading = false
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

.user-info-display {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px dashed #e0e0e0;
}
</style>
