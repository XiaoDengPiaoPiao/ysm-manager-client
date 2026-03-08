<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input 
      :id="id"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      :required="required"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :minlength="minlength"
      :maxlength="maxlength"
      :theme="theme"
    >
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    minlength: {
      type: Number,
      default: null
    },
    maxlength: {
      type: Number,
      default: null
    },
    theme: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'green', 'gray'].includes(value)
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script>

<style scoped>
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

.form-group input {
  padding: 14px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.form-group input[theme="green"]:focus {
  border-color: #67c23a;
  box-shadow: 0 0 0 3px rgba(103, 194, 58, 0.1);
}

.form-group input[theme="gray"]:focus {
  border-color: #909399;
  box-shadow: 0 0 0 3px rgba(144, 147, 153, 0.1);
}
</style>
