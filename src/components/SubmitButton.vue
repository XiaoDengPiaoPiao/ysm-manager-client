<template>
  <button 
    type="submit" 
    class="submit-btn"
    :disabled="disabled"
    :theme="theme"
  >
    {{ loading ? loadingText : text }}
  </button>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    text: {
      type: String,
      default: '提交'
    },
    loadingText: {
      type: String,
      default: '提交中...'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'green', 'gray'].includes(value)
    }
  }
}
</script>

<style scoped>
.submit-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
}

.submit-btn[theme="green"] {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.submit-btn[theme="green"]:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgba(103, 194, 58, 0.35);
}

.submit-btn[theme="gray"] {
  background: linear-gradient(135deg, #606266 0%, #909399 100%);
}

.submit-btn[theme="gray"]:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgba(96, 98, 102, 0.35);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
