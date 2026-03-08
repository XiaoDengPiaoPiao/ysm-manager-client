<template>
  <div :class="['auth-card', themeClass]">
    <div class="card-header">
      <div class="card-icon">{{ icon }}</div>
      <h2>{{ title }}</h2>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AuthCard',
  props: {
    icon: {
      type: String,
      default: '🔐'
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'green', 'gray'].includes(value)
    }
  },
  computed: {
    themeClass() {
      const themes = {
        blue: 'theme-blue',
        green: 'theme-green',
        gray: 'theme-gray'
      }
      return themes[this.theme]
    }
  }
}
</script>

<style scoped>
.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 40px;
  max-width: 420px;
  width: 100%;
  animation: slideIn 0.4s ease-out;
  border-left: 4px solid;
}

.auth-card.theme-blue {
  border-left-color: #409eff;
}

.auth-card.theme-green {
  border-left-color: #67c23a;
}

.auth-card.theme-gray {
  border-left-color: #909399;
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
</style>
