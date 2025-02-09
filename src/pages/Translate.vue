<template>
  <div class="column q-ma-md">
    <div class="text-h5 q-my-sm">中英文翻译</div>
    <q-card
      class="translate-container no-border-radius col-grow q-mb-md"
      flat
      style="min-height: 600px; border-top: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <div class="col column t-input-container" style="min-width: 300px">
        <div
          class="row full-width col-auto input-box"
          style="border-left: 1px solid rgba(0, 0, 0, 0.12)"
        >
          <q-select
            borderless
            style="width: 120px; margin-left: 20px"
            v-model="SrcLanguage"
            :options="LanguageOptions"
            label="检测源语言"
          />
          <q-space></q-space>

          <q-btn
            unelevated
            color="primary"
            label="翻译"
            style="margin: 10px"
            @click="StreamTranslate"
            :loading="Chatting"
          />
        </div>
        <div class="full-width col">
          <q-input
            square
            outlined
            type="textarea"
            v-model="InputText"
            label="原文"
            class="fit"
            @keydown.enter="handleEnter"
            @update:model-value="handleInput"
          >
          </q-input>
        </div>
      </div>

      <div class="col column" style="min-width: 300px">
        <div
          class="full-width col-auto translated-box"
          style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
        >
          <q-select
            borderless
            style="width: 120px; margin-left: 20px"
            v-model="DstLanguage"
            :options="LanguageOptions"
            label="目标语言"
          />
        </div>

        <div
          class="column full-width col translated-box"
          style="
            border-top: 1px solid rgba(0, 0, 0, 0.12);
            border-right: 1px solid rgba(0, 0, 0, 0.12);
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          "
        >
          <div class="column col full-width" style="white-space: pre-line">
            <div class="bg-grey-3 q-px-md q-py-xs full-width">翻译后的内容</div>
            <div class="q-ma-md">
              {{ TranslatedText }}
            </div>
          </div>
          <q-separator horizontal />
          <div class="column col full-width" style="white-space: pre-line">
            <div class="bg-grey-3 q-px-md q-py-xs full-width">
              翻译后重新翻译回源语言
            </div>
            <div class="q-ma-md">
              {{ NewOldText }}
            </div>
          </div>
        </div>
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

.md-c tr {
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

<script setup lang="ts">
import { ref } from 'vue';
import { useAPIStore } from 'stores/APIStore';

defineOptions({
  name: 'TranslatePage',
});

let InputText = ref('');
let TranslatedText = ref('');
let NewOldText = ref('');
let Chatting = ref(false);
let SrcLanguage = ref('');
let DstLanguage = ref('');
let timer: NodeJS.Timeout;

const LanguageOptions = ['中文', '英文'];
const splitWords = '#-split-#';
const store = useAPIStore();

function checkLanguage(inputStr: string) {
  let isChinese = /[\u4E00-\u9FA5]+/g.test(inputStr);
  if (isChinese) {
    SrcLanguage.value = '中文';
    DstLanguage.value = '英文';
  } else {
    SrcLanguage.value = '英文';
    DstLanguage.value = '中文';
  }
}

async function StreamTranslate() {
  if (InputText.value == '' || Chatting.value) {
    return;
  }

  TranslatedText.value = '';
  NewOldText.value = '';
  Chatting.value = true;
  let isNewOld = false;

  checkLanguage(InputText.value);

  // request
  const response = await fetch('/api/stream-translate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      //'Authorization': 'Bearer ' + Password.value
    },
    body: JSON.stringify({
      requirement: InputText.value,
      src: SrcLanguage.value,
      dst: DstLanguage.value,
      model: store.model.model,
      temperature: store.temperature,
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();

    if (value) {
      const decodedValue = decoder.decode(value);
      if (isNewOld) {
        NewOldText.value += decodedValue;
      } else {
        TranslatedText.value += decodedValue;
        // find splitwords
        let splitIndex = TranslatedText.value.indexOf(splitWords);
        if (splitIndex != -1) {
          isNewOld = true;
          const tmp = TranslatedText.value.substring(0, splitIndex);
          NewOldText.value = TranslatedText.value.substring(
            splitIndex + splitWords.length
          );
          TranslatedText.value = tmp;
        }
      }

      // MarkdownText.value = marked(OutputText.value);
    }
    if (done) {
      Chatting.value = false;
      break;
    }
  }
}

function handleEnter(e: any) {
  if (e.ctrlKey) {
    StreamTranslate();
    console.log('send');
  }
}

function handleInput() {
  if (timer) {
    clearTimeout(timer); // 当用户连续输入时，清除上一次的定时器
  }

  timer = setTimeout(() => {
    checkLanguage(InputText.value);
  }, 1000); // 延时1s后进行语言检测
}
</script>

<style>
.translate-container {
  display: flex;
  flex-direction: row;
}

@media (max-width: 632px) {
  .translated-box {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
  }
  .input-box {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }
  .translate-container {
    display: flex;
    flex-direction: column;
  }
  .t-input-container {
    flex: 0 0 auto;
  }
}
</style>
