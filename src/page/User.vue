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
            <span class="card-icon">🎮</span>
            <span class="card-title">游戏名称</span>
          </div>
          <div class="card-body">
            <div v-if="!isEditing" class="game-name-view">
              <div class="game-name-display">{{ userInfo.gameName }}</div>
              <button @click="startEdit" class="edit-btn">
                <span>✏️</span>
                <span>编辑</span>
              </button>
            </div>
            <div v-else class="game-name-edit">
              <input 
                type="text" 
                v-model="editingGameName" 
                class="edit-input"
                placeholder="请输入新的游戏名称"
                maxlength="30"
              >
              <div class="edit-actions">
                <button @click="saveGameName" class="save-btn" :disabled="saving">
                  <span>💾</span>
                  <span>{{ saving ? '保存中...' : '保存' }}</span>
                </button>
                <button @click="cancelEdit" class="cancel-btn" :disabled="saving">
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
import { getUserInfo, updateGameName, changePassword } from '../utils/api.js'
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
      isEditing: false,
      editingGameName: '',
      saving: false,
      updateMessage: '',
      updateMessageType: '',
      isEditingPassword: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      changingPassword: false
    }
  },
  mounted() {
    this.fetchUserInfo()
  },
  methods: {
    formatDate,
    
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
    
    startEdit() {
      this.editingGameName = this.userInfo.gameName
      this.isEditing = true
      this.updateMessage = ''
    },
    
    cancelEdit() {
      this.isEditing = false
      this.editingGameName = ''
      this.updateMessage = ''
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
    
    async saveGameName() {
      if (!this.editingGameName.trim()) {
        this.updateMessage = '游戏名称不能为空'
        this.updateMessageType = 'error'
        return
      }
      
      if (this.editingGameName === this.userInfo.gameName) {
        this.updateMessage = '游戏名称未修改'
        this.updateMessageType = 'warning'
        return
      }
      
      if (this.editingGameName.length < 3) {
        this.updateMessage = '游戏名称至少3个字符'
        this.updateMessageType = 'error'
        return
      }
      
      this.saving = true
      this.updateMessage = ''
      
      try {
        const response = await updateGameName(this.editingGameName)
        this.userInfo.gameName = response.data.gameName
        this.isEditing = false
        this.updateMessage = '游戏名称更新成功'
        this.updateMessageType = 'success'
        
        setTimeout(() => {
          this.updateMessage = ''
        }, 3000)
      } catch (err) {
        this.updateMessage = err.message || '更新失败'
        this.updateMessageType = 'error'
      } finally {
        this.saving = false
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

@media (max-width: 768px) {
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
