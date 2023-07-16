<template>
  <div class="q-pa-md q-gutter-md">
    <div class="text-h5">一问一答</div>
    <div class="column">
      <q-input class="col" autogrow v-model="InputText" label="问题描述" @keydown.enter="handleEnter" :disable="Chatting">
        <template v-slot:after>
          <q-btn flat @click="Chat">
            <div class="column">
              <q-icon style="margin: auto" name="send"></q-icon>
              <div class="text-caption">Ctrl + Enter</div>
            </div>
          </q-btn>
        </template>
      </q-input>

      <div v-html="MarkdownText" class="markdown-body"></div>

    </div>
  </div>
</template>

<style>
.md-c table {
  border-collapse: collapse;
}

.q-textarea .q-field__control {
  height: 100%;
}

.md-c. tr {
  border: solid 1px black;
}

.md-c td {
  border: solid 1px black;
}

.md-c th {
  border: solid 1px black;
}

.md-c tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {marked} from "marked";
import 'github-markdown-css';
import {useAPIStore} from 'stores/APIStore';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

export default defineComponent({
  name: 'OneQOneAPage',
  setup() {
    let InputText = ref('')
    let OutputText = ref('')
    let MarkdownText = ref('')
    let Chatting = false
    const store = useAPIStore();

    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code, language) {
        const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
        return hljs.highlight(validLanguage, code).value;
      },
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });

    async function Chat() {
      if (InputText.value == '' || Chatting) {
        return
      }

      OutputText.value = ''
      MarkdownText.value = ''
      Chatting = true

      // request
      const response = await fetch('/api/stream-api', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          'model': store.model,
          'temperature': store.temperature,
          'question': InputText.value,
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
        Chat()
        console.log('send')
      }
    }

    return {
      InputText,
      OutputText,
      MarkdownText,
      handleEnter,
      Chatting,
      Chat
    }
  }
});
</script>

<style scoped>

</style>
