<template>
  <div class="q-pa-md q-gutter-md">
    <div class="text-h5">中英文翻译</div>
    <div class="row q-pa-md q-gutter-md" style="min-height: 500px">
      <div class="col" style="min-width: 400px">
        <q-input outlined type="textarea"
                 v-model="InputText"
                 label="中文"
                 class="fit"
                 @keydown.enter="handleEnter"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="RequirementAnasys"/>
          </template>
        </q-input>

      </div>
      <q-card flat bordered class="col" style="min-width: 400px">
        <q-card-section>
          <div v-html="MarkdownText" class="markdown-body"></div>
        </q-card-section>
      </q-card>

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
import {marked} from 'marked';
import 'github-markdown-css';

export default defineComponent({
  name: 'TranslatePage',
  setup() {
    let InputText = ref('')
    let OutputText = ref('')
    let MarkdownText = ref('')
    let Chatting = false

//     MarkdownText.value=marked(`First Header | Second Header
// ------------ | -------------
// Content Cell | Content Cell
// Content Cell | Content Cell`)

    async function RequirementAnasys() {
      if (InputText.value == '' || Chatting) {
        return
      }

      OutputText.value = ''
      MarkdownText.value = ''
      Chatting = true

      // request
      const response = await fetch('/api/stream-zh-to-en', {
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
