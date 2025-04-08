<template>
  <div ref="container">
    <div class="mermaid" ref="mermaidBox">{{ code }}</div>
  </div>
</template>

<script setup>
import mermaid from 'mermaid'
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({ code: String })

const container = ref(null)
const mermaidBox = ref(null)

function renderMermaid() {
  nextTick(() => {
    try {
      mermaid.initialize({ startOnLoad: false })
      mermaid.init(undefined, mermaidBox.value)
    } catch (e) {
      container.value.innerHTML = `<pre style="color:red;">Mermaid 渲染失败：${e.message}</pre>`
    }
  });
}

onMounted(() => {
  renderMermaid()
})

watch(() => props.code, () => {
  renderMermaid()
})
</script>

<style scoped>
.mermaid {
  background: #fff;
  padding: 1rem;
  margin-top: 20px;
  border-radius: 10px;
  white-space: pre-line;
  font-family: monospace;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>
