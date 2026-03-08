<template>
  <div class="error-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.error-message {
  padding: 12px 16px;
  background-color: #fef0f0;
  border: 1px solid #fde2e2;
  color: #f56c6c;
  border-radius: 8px;
  font-size: 14px;
}
</style>
