<template>
  <div class="q-pa-md q-gutter-md">
    <div class="text-h5">中英文翻译</div>
    <q-card class="row no-border-radius" flat bordered style="min-height: 500px">
      <div class="col column">
        <div class="row full-width col-auto">
          <q-select borderless style="width: 120px; margin-left: 20px" v-model="SrcLanguage" :options="LanguageOptions"
                    label="检测源语言"/>
          <q-space></q-space>

          <q-btn unelevated color="primary" label="翻译" style="margin: 10px" @click="RequirementAnasys"
          :disable="SrcLanguage===''"/>
        </div>
        <div class="full-width col">
          <q-input square outlined type="textarea"
                   v-model="InputText"
                   label="原文"
                   class="fit"
                   @keydown.enter="handleEnter"
                   @update:model-value="handleInput"
          >
          </q-input>
        </div>
      </div>

      <div class="col column">
        <div class="full-width col-auto">
          <q-select borderless style="width: 120px; margin-left: 20px" v-model="DstLanguage"
                    :options="LanguageOptions"
                    label="目标语言"/>
        </div>
        <q-card flat bordered class="full-width col  no-border-radius">
          <q-card-section>
            <div v-html="MarkdownText" class="markdown-body"></div>
          </q-card-section>
        </q-card>
      </div>


    </q-card>
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
    let SrcLanguage = ref('')
    let DstLanguage = ref('')
    let timer: NodeJS.Timeout;

    const LanguageOptions = ['中文', '英文']

    function checkLanguage(inputStr: string) {
      let isChinese = /[\u4E00-\u9FA5]+/g.test(inputStr)
      if (isChinese) {
        SrcLanguage.value = '中文'
        DstLanguage.value = '英文'
      } else {
        SrcLanguage.value = '英文'
        DstLanguage.value = '中文'
      }
    }

    async function RequirementAnasys() {
      if (InputText.value == '' || Chatting) {
        return
      }

      OutputText.value = ''
      MarkdownText.value = ''
      Chatting = true

      checkLanguage(InputText.value)

      // request
      const response = await fetch('/api/stream-zh-to-en', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          'requirement': InputText.value,
          'from': SrcLanguage.value,
          'to': DstLanguage.value
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

    function handleInput(value: string) {
      if(timer) {
        clearTimeout(timer); // 当用户连续输入时，清除上一次的定时器
      }

      timer = setTimeout(() => {
        checkLanguage(value)
      }, 1000); // 延时1s后进行语言检测
    }

    return {
      InputText,
      OutputText,
      MarkdownText,
      handleEnter,
      RequirementAnasys,
      LanguageOptions,
      SrcLanguage,
      DstLanguage,
      handleInput
    }
  }
});
</script>

<style scoped>

</style>
