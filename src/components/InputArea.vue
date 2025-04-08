<template>
  <div>
    <textarea v-model="text" rows="4" cols="60" placeholder="请输入需求，例如：用户可以登录系统、查看订单"></textarea>
    <br />
    <button @click="generate">生成用例图</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { parseToMermaid } from '../utils/parseToMermaid'

const emit = defineEmits(['update-diagram'])
const text = ref('')

function generate() {
  const mermaidCode = parseToMermaid(text.value)
  console.log('[Mermaid Code]\n' + mermaidCode)
  emit('update-diagram', mermaidCode)
}
</script>