<template>
  <div class="q-pa-md q-gutter-md">
    <div class="text-h5">测试用例分析</div>
    <div class="row">
      <q-input class="col" autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter"/>
      <q-btn color="primary" style="margin-left: 10px" @click="TestAnasys">
        <div class="text-center">
          提交<br>Ctrl + Enter
        </div>
      </q-btn>
    </div>
    <div>
      <div v-html="MarkdownText" class="markdown-body"></div>
    </div>
  </div>
</template>

<style>
.md-c table { border-collapse: collapse; }
.md-c. tr { border: solid 1px black; }
.md-c td {border: solid 1px black;}
.md-c th {border: solid 1px black;}
.md-c tr:nth-child(even) {background-color: #f2f2f2;}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {marked} from 'marked';
import 'github-markdown-css';
import { useAPIStore } from 'stores/APIStore'

export default defineComponent({
  name: 'TestCase',
  setup() {
    let InputText = ref('')
    let OutputText = ref('')
    let MarkdownText = ref('')
    let Chatting = false
    const store = useAPIStore();

    async function TestAnasys() {
      if (InputText.value == '' || Chatting) {
        return
      }

      OutputText.value = ''
      MarkdownText.value = ''
      Chatting = true

      // request
      const response = await fetch('/api/stream-test', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          'model': store.model,
          'requirement': InputText.value,
          'temperature': store.temperature,
        })
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const {value, done} = await reader.read()

        if (value) {
          OutputText.value = OutputText.value + decoder.decode(value)
          MarkdownText.value = marked(OutputText.value)
        }

        if (done) {
          Chatting = false
          break
        }
      }
    }

    function handleEnter(e: any) {
      if (e.ctrlKey) {
        TestAnasys()
        console.log('send')
      }
    }

    return {
      InputText,
      OutputText,
      MarkdownText,
      handleEnter,
      TestAnasys
    }
  }
});
</script>

<style scoped>

</style>
