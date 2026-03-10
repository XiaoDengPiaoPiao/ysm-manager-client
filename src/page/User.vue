<template>
  <div class="user-page">
    <PageHeader title="用户中心" subtitle="管理您的个人信息" />

    <LoadingSpinner v-if="loading" text="加载中..." />

    <ErrorMessage v-if="errorMessage" :message="errorMessage" />

    <div v-else-if="userInfo" class="user-content">
      <div class="profile-section">
        <div class="avatar-section">
          <div class="avatar">{{ userInfo.name.charAt(0).toUpperCase() }}</div>
          <div class="user-name-section">
            <h2>{{ userInfo.name }}</h2>
            <p class="user-id">ID: {{ userInfo.id }}</p>
          </div>
        </div>
      </div>

      <div class="info-cards">
        <div class="info-card">
          <div class="card-header">
            <span class="card-icon">📅</span>
            <span class="card-title">账户信息</span>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">用户名</span>
              <span class="info-value">{{ userInfo.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">创建时间</span>
              <span class="info-value">{{ formatDate(userInfo.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-header">
            <span class="card-icon">📊</span>
            <span class="card-title">上传统计</span>
          </div>
          <div class="card-body">
            <div class="upload-stats">
              <div class="stat-item">
                <div class="stat-label">公共模型</div>
                <div class="stat-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill custom" 
                      :style="{ width: getProgressPercent(userInfo.customUploaded, userInfo.customUploadLimit) + '%' }"
                    ></div>
                  </div>
                  <div class="stat-text">
                    {{ userInfo.customUploaded }} / {{ userInfo.customUploadLimit }}
                    <span class="stat-remaining">(剩余 {{ userInfo.customRemaining }})</span>
                  </div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">私人模型</div>
                <div class="stat-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill auth" 
                      :style="{ width: getProgressPercent(userInfo.authUploaded, userInfo.authUploadLimit) + '%' }"
                    ></div>
                  </div>
                  <div class="stat-text">
                    {{ userInfo.authUploaded }} / {{ userInfo.authUploadLimit }}
                    <span class="stat-remaining">(剩余 {{ userInfo.authRemaining }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-header">
            <span class="card-icon">🎮</span>
            <span class="card-title">游戏名称绑定</span>
          </div>
          <div class="card-body">
            <div v-if="userInfo.gameName && !isBinding" class="game-name-view">
              <div class="game-name-display">{{ userInfo.gameName }}</div>
              <button @click="startBinding" class="edit-btn">
                <span>🔗</span>
                <span>重新绑定</span>
              </button>
            </div>
            <div v-else-if="!userInfo.gameName && !isBinding" class="game-name-view">
              <div class="game-name-display">未绑定</div>
              <button @click="startBinding" class="edit-btn">
                <span>🔗</span>
                <span>立即绑定</span>
              </button>
            </div>
            <div v-if="isBinding" class="bind-form">
              <div class="form-group">
                <label>游戏名称</label>
                <input 
                  type="text" 
                  v-model="gameNameInput" 
                  class="edit-input"
                  placeholder="请输入您的游戏名称"
                  autocomplete="off"
                >
              </div>
              <div class="code-input-group">
                <div class="form-group">
                  <label>验证码</label>
                  <input 
                    type="text" 
                    v-model="verificationCodeInput" 
                    class="edit-input"
                    placeholder="请输入验证码"
                    autocomplete="off"
                  >
                </div>
                <button 
                  @click="sendVerificationCode" 
                  class="send-code-btn"
                  :disabled="sendingCode || countdown > 0 || !gameNameInput.trim()"
                >
                  {{ countdown > 0 ? `${countdown}s` : (sendingCode ? '发送中...' : '发送验证码') }}
                </button>
              </div>
              <ErrorMessage v-if="bindMessage && updateMessageType === 'error'" :message="bindMessage" />
              <div v-if="bindMessage && updateMessageType === 'success'" class="success-message">
                {{ bindMessage }}
              </div>
              <div class="edit-actions">
                <button @click="verifyCode" class="save-btn" :disabled="verifyingCode || !gameNameInput.trim() || !verificationCodeInput.trim()">
                  <span>✅</span>
                  <span>{{ verifyingCode ? '验证中...' : '确认绑定' }}</span>
                </button>
                <button @click="cancelBinding" class="cancel-btn" :disabled="verifyingCode || sendingCode">
                  <span>❌</span>
                  <span>取消</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-header">
            <span class="card-icon">🔐</span>
            <span class="card-title">修改密码</span>
          </div>
          <div class="card-body">
            <div v-if="!isEditingPassword" class="password-view">
              <div class="password-display">••••••••</div>
              <button @click="startEditPassword" class="edit-btn">
                <span>✏️</span>
                <span>修改</span>
              </button>
            </div>
            <div v-else class="password-edit">
              <div class="form-group">
                <label>当前密码</label>
                <input 
                  type="password" 
                  v-model="oldPassword" 
                  class="edit-input"
                  placeholder="请输入当前密码"
                  autocomplete="current-password"
                >
              </div>
              <div class="form-group">
                <label>新密码</label>
                <input 
                  type="password" 
                  v-model="newPassword" 
                  class="edit-input"
                  placeholder="请输入新密码 (至少6位)"
                  minlength="6"
                  autocomplete="new-password"
                >
              </div>
              <div class="form-group">
                <label>确认新密码</label>
                <input 
                  type="password" 
                  v-model="confirmPassword" 
                  class="edit-input"
                  placeholder="请再次输入新密码"
                  minlength="6"
                  autocomplete="new-password"
                >
              </div>
              <div class="edit-actions">
                <button @click="savePassword" class="save-btn" :disabled="changingPassword">
                  <span>💾</span>
                  <span>{{ changingPassword ? '修改中...' : '保存' }}</span>
                </button>
                <button @click="cancelEditPassword" class="cancel-btn" :disabled="changingPassword">
                  <span>❌</span>
                  <span>取消</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="updateMessage" :class="['update-message', updateMessageType]">
        {{ updateMessage }}
      </div>

      <div class="quick-actions">
        <div class="action-card" @click="$router.push('/')">
          <span class="action-icon">📤</span>
          <span class="action-title">上传模型</span>
          <span class="action-desc">上传新的公共或私人模型</span>
        </div>
        <div class="action-card" @click="$router.push('/list')">
          <span class="action-icon">📋</span>
          <span class="action-title">模型列表</span>
          <span class="action-desc">查看和管理您的所有模型</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo, updateGameName, verifyGameName, changePassword } from '../utils/api.js'
import { formatDate } from '../utils/utils.js'
import PageHeader from '../components/PageHeader.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

export default {
  name: 'User',
  components: {
    PageHeader,
    LoadingSpinner,
    ErrorMessage
  },
  data() {
    return {
      userInfo: null,
      loading: false,
      errorMessage: '',
      updateMessage: '',
      updateMessageType: '',
      isEditingPassword: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      changingPassword: false,
      isBinding: false,
      gameNameInput: '',
      verificationCodeInput: '',
      sendingCode: false,
      verifyingCode: false,
      bindToken: null,
      bindMessage: '',
      countdown: 0
    }
  },
  mounted() {
    this.fetchUserInfo()
  },
  methods: {
    formatDate,
    
    getProgressPercent(uploaded, limit) {
      if (!limit) return 0
      return Math.min((uploaded / limit) * 100, 100)
    },
    
    async fetchUserInfo() {
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await getUserInfo()
        this.userInfo = response.data
      } catch (err) {
        this.errorMessage = err.message || '获取用户信息失败'
      } finally {
        this.loading = false
      }
    },
    
    startEditPassword() {
      this.isEditingPassword = true
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
      this.updateMessage = ''
    },
    
    cancelEditPassword() {
      this.isEditingPassword = false
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
      this.updateMessage = ''
    },
    
    async savePassword() {
      if (!this.oldPassword.trim()) {
        this.updateMessage = '请输入当前密码'
        this.updateMessageType = 'error'
        return
      }
      
      if (!this.newPassword.trim()) {
        this.updateMessage = '请输入新密码'
        this.updateMessageType = 'error'
        return
      }
      
      if (this.newPassword.length < 6) {
        this.updateMessage = '新密码至少6位'
        this.updateMessageType = 'error'
        return
      }
      
      if (this.newPassword !== this.confirmPassword) {
        this.updateMessage = '两次输入的密码不一致'
        this.updateMessageType = 'error'
        return
      }
      
      if (this.oldPassword === this.newPassword) {
        this.updateMessage = '新密码不能与原密码相同'
        this.updateMessageType = 'error'
        return
      }
      
      this.changingPassword = true
      this.updateMessage = ''
      
      try {
        await changePassword(this.oldPassword, this.newPassword)
        this.isEditingPassword = false
        this.oldPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.updateMessage = '密码修改成功'
        this.updateMessageType = 'success'
        
        setTimeout(() => {
          this.updateMessage = ''
        }, 3000)
      } catch (err) {
        this.updateMessage = err.message || '密码修改失败'
        this.updateMessageType = 'error'
      } finally {
        this.changingPassword = false
      }
    },
    
    startBinding() {
      this.isBinding = true
      this.gameNameInput = ''
      this.verificationCodeInput = ''
      this.bindMessage = ''
      this.updateMessageType = ''
      this.bindToken = null
      this.countdown = 0
    },
    
    cancelBinding() {
      this.isBinding = false
      this.gameNameInput = ''
      this.verificationCodeInput = ''
      this.bindMessage = ''
      this.updateMessageType = ''
      this.bindToken = null
      this.countdown = 0
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }
    },
    
    async sendVerificationCode() {
      if (!this.gameNameInput.trim()) {
        this.bindMessage = '请先输入游戏名称'
        this.updateMessageType = 'error'
        return
      }
      
      this.sendingCode = true
      this.bindMessage = ''
      this.updateMessageType = ''
      
      try {
        const response = await updateGameName(this.gameNameInput)
        this.bindToken = response.data.token
        this.bindMessage = response.message
        this.updateMessageType = 'success'
        this.startCountdown()
      } catch (err) {
        this.bindMessage = err.message || '发送验证码失败'
        this.updateMessageType = 'error'
      } finally {
        this.sendingCode = false
      }
    },
    
    startCountdown() {
      this.countdown = 60
      this.countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer)
        }
      }, 1000)
    },
    
    async verifyCode() {
      if (!this.gameNameInput.trim()) {
        this.bindMessage = '请输入游戏名称'
        this.updateMessageType = 'error'
        return
      }
      
      if (!this.verificationCodeInput.trim()) {
        this.bindMessage = '请输入验证码'
        this.updateMessageType = 'error'
        return
      }
      
      this.verifyingCode = true
      
      try {
        await verifyGameName(this.gameNameInput, this.verificationCodeInput)
        this.bindMessage = '绑定成功！'
        this.updateMessageType = 'success'
        
        setTimeout(() => {
          this.isBinding = false
          this.gameNameInput = ''
          this.verificationCodeInput = ''
          this.bindMessage = ''
          this.updateMessageType = ''
          this.bindToken = null
          this.fetchUserInfo()
        }, 1500)
      } catch (err) {
        this.bindMessage = err.message || '验证失败，请检查验证码是否正确'
        this.updateMessageType = 'error'
      } finally {
        this.verifyingCode = false
      }
    }
  }
}
</script>

<style scoped>
.user-page {
  max-width: 1000px;
}





.user-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
}

.user-name-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.user-id {
  font-size: 14px;
  color: #909399;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-bottom: 1px solid #f0f0f0;
}

.card-icon {
  font-size: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-body {
  padding: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid #f5f7fa;
}

.info-label {
  color: #909399;
  font-size: 14px;
}

.info-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.game-name-view,
.password-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.game-name-display,
.password-display {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  word-break: break-all;
}

.bind-token-section {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border-radius: 12px;
  border: 1px solid #91d5ff;
}

.message-display {
  font-size: 15px;
  font-weight: 500;
  color: #1890ff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bind-command-wrapper {
  margin-bottom: 12px;
}

.bind-command-label {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.bind-command-box {
  background: #1e1e1e;
  padding: 12px 16px;
  border-radius: 8px;
}

.bind-command {
  display: block;
  width: 100%;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #4ec9b0;
  word-break: break-all;
  line-height: 1.5;
  user-select: text;
}

.expire-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.game-name-edit,
.password-edit {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.edit-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.edit-input:focus {
  outline: none;
  border-color: #409eff;
}

.edit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.save-btn {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f5f7fa;
  color: #606266;
}

.cancel-btn:hover:not(:disabled) {
  background: #e4e7ed;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.update-message {
  padding: 16px 20px;
  border-radius: 8px;
  margin-top: 8px;
}

.update-message.success {
  background-color: #f0f9ff;
  border: 1px solid #e1f3d8;
  color: #67c23a;
}

.update-message.error {
  background-color: #fef0f0;
  border: 1px solid #fde2e2;
  color: #f56c6c;
}

.update-message.warning {
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
  color: #e6a23c;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #409eff;
}

.action-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.action-desc {
  font-size: 13px;
  color: #909399;
}

.upload-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.stat-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #f0f2f5;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-fill.custom {
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
}

.progress-fill.auth {
  background: linear-gradient(90deg, #67c23a 0%, #85ce61 100%);
}

.stat-text {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-remaining {
  color: #909399;
  font-size: 13px;
}

.bind-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.code-input-group {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.code-input-group .form-group {
  flex: 1;
}

.send-code-btn {
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.send-code-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.send-code-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-message {
  padding: 12px 16px;
  background-color: #f0f9ff;
  border: 1px solid #e1f3d8;
  color: #67c23a;
  border-radius: 8px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .code-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .send-code-btn {
    width: 100%;
  }
}
</style>
