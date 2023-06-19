<template>
  <div class="q-pa-md q-gutter-md">
    <h5>测试用例分析</h5>
    <div class="row">
      <q-input class="col" autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter"/>
      <q-btn color="primary" style="margin-left: 10px" @click="TestAnasys">
        <div class="text-center">
          提交<br>Ctrl + Enter
        </div>
      </q-btn>
    </div>
    <div style="white-space: pre-wrap">{{OutputText}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TestCase',
  setup() {
    let InputText = ref('')
    let OutputText = ref('')
    let Chatting = false

    async function TestAnasys() {
      if (InputText.value == '' || Chatting) {
        return
      }

      OutputText.value = ''
      Chatting = true

      // request
      const response = await fetch('/api/streamtest', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          //"model": "gpt-3.5-turbo",
          //"model": "gpt-4",
          'requirement': InputText.value,
          //"stream": true,
          //"temperature": 0.7,
        })
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const {value, done} = await reader.read()

        if (value) {
          OutputText.value = OutputText.value + decoder.decode(value)
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
      handleEnter,
      TestAnasys
    }
  }
});
</script>

<style scoped>

</style>
