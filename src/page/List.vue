<template>
  <div class="list-page">
    <PageHeader title="模型列表" subtitle="查看和管理您的模型" />
    
    <LoadingSpinner v-if="userInfoLoading" text="加载用户信息中..." />
    
    <div v-if="userInfo" class="upload-stats-section">
      <div class="upload-stats-card">
        <div class="stat-card">
          <div class="stat-icon custom">🌐</div>
          <div class="stat-content">
            <div class="stat-title">公共模型</div>
            <div class="stat-value">{{ userInfo.customUploaded }} / {{ userInfo.customUploadLimit }}</div>
            <div class="stat-remaining">剩余 {{ userInfo.customRemaining }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon auth">🔒</div>
          <div class="stat-content">
            <div class="stat-title">私人模型</div>
            <div class="stat-value">{{ userInfo.authUploaded }} / {{ userInfo.authUploadLimit }}</div>
            <div class="stat-remaining">剩余 {{ userInfo.authRemaining }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tabs-container">
      <button 
        @click="fetchAllModels" 
        :class="['tab-btn', { active: currentTab === 'all' }]"
      >
        <span class="tab-icon">📁</span>
        <span>所有模型</span>
      </button>
      <button 
        @click="fetchAuthModels" 
        :class="['tab-btn', { active: currentTab === 'auth' }]"
      >
        <span class="tab-icon">🔒</span>
        <span>私人模型</span>
      </button>
      <button 
        @click="fetchCustomModels" 
        :class="['tab-btn', { active: currentTab === 'custom' }]"
      >
        <span class="tab-icon">🌐</span>
        <span>公共模型</span>
      </button>
    </div>

    <LoadingSpinner v-if="loading" text="加载中..." />

    <ErrorMessage v-if="errorMessage" :message="errorMessage" />

    <div v-if="!loading && models.length === 0 && !errorMessage" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>暂无模型数据</p>
    </div>

    <div v-else-if="models.length > 0" class="model-list-container">
      <div class="model-list">
        <div v-for="model in paginatedModels" :key="model.id" class="model-card">
          <div class="card-header">
            <span :class="['type-badge', model.currentType]">
              {{ model.currentType === 'auth' ? '私人' : '公共' }}
            </span>
            <span class="card-id">#{{ model.id }}</span>
          </div>
          
          <div class="model-info">
            <div class="model-name">
              <span class="label">文件名</span>
              <span class="value">{{ model.fileName }}</span>
            </div>
            <div class="model-created">
              <span class="label">创建时间</span>
              <span class="value">{{ formatDate(model.createdAt) }}</span>
            </div>
            <div class="model-hash">
              <span class="label">Hash</span>
              <span class="value hash-value">{{ model.hash }}</span>
            </div>
          </div>
          
          <div v-if="model.currentType === 'auth'" class="model-actions">
            <button 
              @click="handleAuthorizeModel(model.id)" 
              class="action-btn authorize"
              :disabled="loadingActions"
            >
              <span>✅</span>
              <span>授权</span>
            </button>
            <button 
              @click="handleDeauthorizeModel(model.id)" 
              class="action-btn deauthorize"
              :disabled="loadingActions"
            >
              <span>❌</span>
              <span>解除</span>
            </button>
            <button 
              @click="handleDeleteAuthModel(model.id)" 
              class="action-btn delete"
              :disabled="loadingActions"
            >
              <span>🗑️</span>
              <span>删除</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1 || loading"
          class="pagination-btn"
        >
          ← 上一页
        </button>
        <div class="pagination-info">
          第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
          <span class="total-count">（共 {{ models.length }} 个）</span>
        </div>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages || loading"
          class="pagination-btn"
        >
          下一页 →
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getAllModel, 
  getAuthModelList, 
  getCustomModel,
  authorizeModel as apiAuthorizeModel,
  deauthorizeModel as apiDeauthorizeModel,
  deleteAuthModel as apiDeleteAuthModel,
  getUserInfo
} from '../utils/api.js'
import { formatDate } from '../utils/utils.js'
import PageHeader from '../components/PageHeader.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

export default {
  name: 'List',
  components: {
    PageHeader,
    LoadingSpinner,
    ErrorMessage
  },
  data() {
    return {
      currentTab: 'all',
      models: [],
      loading: false,
      loadingActions: false,
      errorMessage: '',
      currentPage: 1,
      pageSize: 8,
      userInfo: null,
      userInfoLoading: false
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.models.length / this.pageSize)
    },
    paginatedModels() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.models.slice(start, end)
    }
  },
  mounted() {
    this.fetchUserInfo()
    this.fetchAllModels()
  },
  methods: {
    formatDate,
    
    async fetchUserInfo() {
      this.userInfoLoading = true
      
      try {
        const response = await getUserInfo()
        this.userInfo = response.data
      } catch (err) {
        console.error('获取用户信息失败:', err)
      } finally {
        this.userInfoLoading = false
      }
    },
    
    async fetchAllModels() {
      this.currentTab = 'all'
      this.currentPage = 1
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await getAllModel()
        this.models = response.data
      } catch (err) {
        this.errorMessage = err.message || '获取所有模型列表失败'
      } finally {
        this.loading = false
      }
    },
    
    async fetchAuthModels() {
      this.currentTab = 'auth'
      this.currentPage = 1
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await getAuthModelList()
        this.models = response.data
      } catch (err) {
        this.errorMessage = err.message || '获取私人模型列表失败'
      } finally {
        this.loading = false
      }
    },
    
    async fetchCustomModels() {
      this.currentTab = 'custom'
      this.currentPage = 1
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await getCustomModel()
        this.models = response.data
      } catch (err) {
        this.errorMessage = err.message || '获取公共模型列表失败'
      } finally {
        this.loading = false
      }
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    
    async handleAuthorizeModel(id) {
      this.loadingActions = true
      
      try {
        await apiAuthorizeModel(id)
        alert('授权成功')
        this.refreshCurrentList()
      } catch (err) {
        alert('授权失败：' + (err.message || '未知错误'))
      } finally {
        this.loadingActions = false
      }
    },
    
    async handleDeauthorizeModel(id) {
      this.loadingActions = true
      
      try {
        await apiDeauthorizeModel(id)
        alert('解除授权成功')
        this.refreshCurrentList()
      } catch (err) {
        alert('解除授权失败：' + (err.message || '未知错误'))
      } finally {
        this.loadingActions = false
      }
    },
    
    async handleDeleteAuthModel(id) {
      if (!confirm('确定要删除这个模型吗？')) {
        return
      }
      
      this.loadingActions = true
      
      try {
        await apiDeleteAuthModel(id)
        alert('删除成功')
        this.refreshCurrentList()
      } catch (err) {
        alert('删除失败：' + (err.message || '未知错误'))
      } finally {
        this.loadingActions = false
      }
    },
    
    refreshCurrentList() {
      switch(this.currentTab) {
        case 'all':
          this.fetchAllModels()
          break
        case 'auth':
          this.fetchAuthModels()
          break
        case 'custom':
          this.fetchCustomModels()
          break
      }
    }
  }
}
</script>

<style scoped>
.list-page {
  width: 100%;
}

.upload-stats-section {
  margin-bottom: 32px;
}

.upload-stats-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-icon.custom {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

.stat-icon.auth {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.stat-remaining {
  font-size: 13px;
  color: #909399;
}


.tabs-container {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  display: inline-flex;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-icon {
  font-size: 18px;
}

.tab-btn:hover {
  background-color: #f5f7fa;
  color: #303133;
}

.tab-btn.active {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: #909399;
  font-size: 16px;
}

.model-list-container {
  width: 100%;
}

.model-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.model-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #e4e7ed;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-id {
  font-size: 12px;
  color: #c0c4cc;
}

.model-info {
  margin-bottom: 20px;
}

.model-info > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f7fa;
}

.model-info > div:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.label {
  color: #909399;
  font-size: 13px;
}

.value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
  max-width: 60%;
}

.hash-value {
  font-family: monospace;
  font-size: 12px;
  color: #606266;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.type-badge.auth {
  background: linear-gradient(135deg, #e1f3d8 0%, #f0f9ff 100%);
  color: #67c23a;
}

.type-badge.custom {
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9ff 100%);
  color: #409eff;
}

.model-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.authorize {
  background: linear-gradient(135deg, #e1f3d8 0%, #f0f9ff 100%);
  color: #67c23a;
}

.action-btn.authorize:hover:not(:disabled) {
  background: linear-gradient(135deg, #c2e7b0 0%, #d9ecff 100%);
}

.action-btn.deauthorize {
  background: linear-gradient(135deg, #fef0f0 0%, #fdf6ec 100%);
  color: #e6a23c;
}

.action-btn.deauthorize:hover:not(:disabled) {
  background: linear-gradient(135deg, #fde2e2 0%, #faecd8 100%);
}

.action-btn.delete {
  background: linear-gradient(135deg, #fef0f0 0%, #fef0f0 100%);
  color: #f56c6c;
}

.action-btn.delete:hover:not(:disabled) {
  background: linear-gradient(135deg, #fde2e2 0%, #fde2e2 100%);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.pagination-btn {
  padding: 10px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: white;
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #606266;
  font-size: 14px;
}

.total-count {
  color: #909399;
  margin-left: 8px;
}
</style>
