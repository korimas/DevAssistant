<template>
  <div class="q-pa-md q-gutter-md">
    <div class="text-h5">系统需求拆解</div>
    <div class="row">
      <q-input class="col" autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter">
        <template v-slot:after>
          <q-btn round dense flat icon="send"  @click="RequirementAnasys" />
        </template>
      </q-input>
    </div>
    <div>
      <div v-html="MarkdownText" class="markdown-body"></div>
    </div>
<!--    <div style="white-space: pre-wrap">{{OutputText}}</div>-->
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
  name: 'SySToSWPage',
  setup() {
    let InputText = ref('')
    let OutputText = ref('')
    let MarkdownText = ref('')
    let Chatting = false
    const store = useAPIStore();

    async function RequirementAnasys() {
      if (InputText.value == '' || Chatting) {
        return
      }

      OutputText.value = ''
      MarkdownText.value = ''
      Chatting = true

      // request
      const response = await fetch('/api/stream-systosw', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          'model': store.model.model,
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
        RequirementAnasys()
        console.log('send')
      }
    }

    return {
      InputText,
      OutputText,
      MarkdownText,
      handleEnter,
      RequirementAnasys
    }
  }
});
</script>

<style scoped>

</style>
