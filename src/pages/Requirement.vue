<template>
  <div class="q-pa-md">
  <div class="q-gutter-md">
    <q-input autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter"/>
    <div style="white-space: pre-wrap">{{OutputText}}</div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RequirementPage',
  setup() {
    let InputText = ref('')
    let OutputText = ref('')

    async function RequirementAnasys() {
      if (InputText.value == '') {
        return
      }

      // request
      const response = await fetch('/api/streamchat', {
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
          break
        }
      }
    }

    function handleEnter(e: any) {
      if (e.ctrlKey) {
        RequirementAnasys()
        console.log('send')
      }
    }

    return {
      InputText,
      OutputText,
      handleEnter
    }
  }
});
</script>

<style scoped>

</style>
