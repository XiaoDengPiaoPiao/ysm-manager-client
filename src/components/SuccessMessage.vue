<template>
  <div class="success-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'SuccessMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.success-message {
  padding: 12px 16px;
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  color: #67c23a;
  border-radius: 8px;
  font-size: 14px;
}
</style>
