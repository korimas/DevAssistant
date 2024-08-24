<template>
  <q-page class="row">
    <ChatDialog />
  </q-page>
</template>

<script setup lang="ts">
import ChatDialog from './ChatDialog.vue';
// import { ref } from 'vue';
// import { useAPIStore } from 'stores/APIStore';
// import { marked } from 'marked';
// import 'github-markdown-css';

defineOptions({
  name: 'CustomRobot',
});

// let generating = ref(false);
// let OutputText = ref('');
// let MarkdownText = ref('');
// const store = useAPIStore();

// async function generateWeeklyReport() {
//   if (getWeeklyWorkItemsNumber() === 0) {
//     weeklyWork.value.report = '请先填写工作内容';
//     return;
//   }

//   OutputText.value = '';
//   MarkdownText.value = '';
//   generating.value = true;
//   weeklyWork.value.report = '';

//   // request
//   const response = await fetch('/api/stream-weekly-status', {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//       //'Authorization': 'Bearer ' + Password.value
//     },
//     body: JSON.stringify({
//       model: store.model,
//       weeklyWork: JSON.stringify(weeklyWork.value),
//       temperature: store.temperature,
//     }),
//   });

//   const reader = response.body!.getReader();
//   const decoder = new TextDecoder('utf-8');

//   while (true) {
//     const { value, done } = await reader.read();

//     if (value) {
//       OutputText.value = OutputText.value + decoder.decode(value);
//       weeklyWork.value.report = marked(OutputText.value);
//     }

//     if (done) {
//       generating.value = false;
//       autoSave();
//       break;
//     }
//   }
// }
</script>
