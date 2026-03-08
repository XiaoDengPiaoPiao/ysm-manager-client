<script>
import SparkMD5 from 'spark-md5'
import { hashVerify, customModel, authModel } from '../utils/api.js'

export default {
  name: 'ModelUpload',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['custom', 'auth'].includes(value)
    }
  },
  data() {
    return {
      file: null,
      fileName: '',
      fileMD5: '',
      fileMD5Loading: false,
      verifyLoading: false,
      uploadLoading: false,
      verified: false,
      canUpload: false,
      errorMessage: '',
      message: ''
    }
  },
  methods: {
    handleClose() {
      this.resetState()
      this.$emit('close')
    },
    handleFileChange(event) {
      const selectedFile = event.target.files[0]
      if (!selectedFile) return

      const fileName = selectedFile.name
      if (!fileName.endsWith('.ysm')) {
        this.errorMessage = '只能上传后缀为.ysm的文件'
        this.resetState()
        return
      }

      this.file = selectedFile
      this.fileName = fileName
      this.errorMessage = ''
      this.message = ''
      this.verified = false
      this.canUpload = false
      this.fileMD5 = ''
      this.fileMD5Loading = true

      this.calculateMD5(selectedFile)
    },

    calculateMD5(file) {
      const reader = new FileReader()
      const spark = new SparkMD5.ArrayBuffer()
      const chunkSize = 2097152
      const chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0

      reader.onload = (e) => {
        spark.append(e.target.result)
        currentChunk++

        if (currentChunk < chunks) {
          loadNext()
        } else {
          this.fileMD5 = spark.end()
          this.fileMD5Loading = false
        }
      }

      reader.onerror = () => {
        this.errorMessage = '计算MD5失败'
        this.fileMD5Loading = false
      }

      const loadNext = () => {
        const start = currentChunk * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        reader.readAsArrayBuffer(file.slice(start, end))
      }

      loadNext()
    },

    async handleVerify() {
      if (!this.fileMD5) {
        this.errorMessage = '请先选择文件'
        return
      }

      this.verifyLoading = true
      this.errorMessage = ''
      this.message = ''
      this.canUpload = false

      try {
        const response = await hashVerify(this.fileMD5, this.type)
        if (response.data.exists === false) {
          this.message = '模型不存在，可以上传'
          this.verified = true
          this.canUpload = true
        } else {
          this.message = '模型已存在'
          this.verified = true
          this.canUpload = false
        }
      } catch (err) {
        this.errorMessage = err.message
        this.verified = true
        this.canUpload = false
      } finally {
        this.verifyLoading = false
      }
    },

    async handleUpload() {
      if (!this.canUpload) {
        this.errorMessage = '请先验证模型'
        return
      }

      this.uploadLoading = true
      this.errorMessage = ''
      this.message = ''

      try {
        const formData = {
          file: this.file
        }

        let response
        if (this.type === 'custom') {
          response = await customModel(formData)
        } else {
          response = await authModel(formData)
        }

        this.message = '上传成功！'
        this.resetState()
      } catch (err) {
        this.errorMessage = err.message || '上传失败'
      } finally {
        this.uploadLoading = false
      }
    },

    resetState() {
      this.file = null
      this.fileName = ''
      this.fileMD5 = ''
      this.verified = false
      this.canUpload = false
      this.fileMD5Loading = false
      this.verifyLoading = false
      this.uploadLoading = false
      const fileInput = this.$refs.fileInput
      if (fileInput) {
        fileInput.value = ''
      }
    }
  }
}
</script>

<template>
  <div class="model-upload">
    <div class="card">
      <button class="close-btn" @click="handleClose">×</button>
      <h3>{{ type === 'custom' ? '公共模型上传' : '私人模型上传' }}</h3>
      
      <div class="file-input-wrapper">
        <input 
          type="file" 
          ref="fileInput"
          accept=".ysm" 
          @change="handleFileChange"
          :disabled="uploadLoading"
        >
      </div>

      <div v-if="fileName" class="file-info">
        <div class="file-name">
          <strong>文件名：</strong>{{ fileName }}
        </div>
        <div class="file-md5">
          <strong>MD5：</strong>
          <span v-if="fileMD5Loading">计算中...</span>
          <span v-else>{{ fileMD5 }}</span>
        </div>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="message" class="success-message">
        {{ message }}
      </div>

      <div class="button-group">
        <button 
          class="verify-btn"
          @click="handleVerify"
          :disabled="!fileMD5 || fileMD5Loading || verifyLoading || uploadLoading"
        >
          {{ verifyLoading ? '验证中...' : '验证模型' }}
        </button>

        <button 
          class="upload-btn"
          @click="handleUpload"
          :disabled="!canUpload || uploadLoading"
        >
          {{ uploadLoading ? '上传中...' : '上传模型' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  font-size: 24px;
  color: #909399;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.card h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.file-input-wrapper {
  margin-bottom: 20px;
}

.file-input-wrapper input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.file-input-wrapper input[type="file"]:hover {
  border-color: #409eff;
}

.file-info {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.file-name,
.file-md5 {
  margin-bottom: 10px;
  word-break: break-all;
}

.file-md5:last-child {
  margin-bottom: 0;
}

.error-message {
  margin-bottom: 20px;
  padding: 12px;
  background: #fef0f0;
  border: 1px solid #fde2e2;
  color: #f56c6c;
  border-radius: 4px;
}

.success-message {
  margin-bottom: 20px;
  padding: 12px;
  background: #f0f9ff;
  border: 1px solid #e1f3d8;
  color: #67c23a;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 15px;
}

.verify-btn,
.upload-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.verify-btn {
  background-color: #409eff;
  color: white;
}

.verify-btn:hover:not(:disabled) {
  background-color: #66b1ff;
}

.verify-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.upload-btn {
  background-color: #67c23a;
  color: white;
}

.upload-btn:hover:not(:disabled) {
  background-color: #85ce61;
}

.upload-btn:disabled {
  background-color: #c2e7b0;
  cursor: not-allowed;
}
</style>
