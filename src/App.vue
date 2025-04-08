<template>
  <main class="p-4">
    <h1>用例宝 V0.5</h1>
    <InputArea @update-diagram="updateDiagram" />
    <MermaidViewer :code="diagramCode" :key="diagramCode" />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import InputArea from './components/InputArea.vue'
import MermaidViewer from './components/MermaidViewer.vue'

const diagramCode = ref('')
function updateDiagram(code) {
  diagramCode.value = code
}
</script>
