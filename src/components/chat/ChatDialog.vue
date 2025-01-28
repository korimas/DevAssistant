<template>
  <div class="column justify-between no-wrap full-width" style="padding: 5px; height: calc(100vh - 55px)">
    <div style="overflow: auto">
      <div class="row full-width q-pa-xs q-gutter-xs bg-grey-4">
        <q-btn unelevated round size="sm" icon="add" @click="newChat" />

        <slot name="toolbox-left"></slot>
        <q-space />
        <q-btn unelevated round size="sm" icon="history" @click="historyDrawerModel.open = true" />
        <q-btn unelevated round size="sm" icon="tune" @click="configDrawerModel.open = true" />
        <q-btn unelevated round size="sm" icon="output" @click="exportDialog" />
      </div>
      <q-scroll-area class="full-width" style="height: calc(100vh - 167px)" ref="scrollAreaRef">
        <div v-for="item in Messages" :key="item.Id" class="caption doc-content">
          <MiChatCard :message="item" @delete="() => (Messages = Messages.filter((msg) => msg.Id !== item.Id))
            " @paste="PasteInput(item.Content)" />
        </div>
      </q-scroll-area>
    </div>

    <div style="margin-bottom: 10px; margin-top: 10px">
      <q-input dense autogrow v-model="InputText" outlined placeholder="输入任何问题，与AI互动..." @keydown.enter="handleEnter">
        <template v-slot:append>
          <q-btn dense flat icon="send" @click="StreamChat" />
        </template>
      </q-input>
    </div>
  </div>

  <MIDrawer :drawer="configDrawerModel">
    <template v-slot:drawer-content>
      <div class="column q-pa-md">
        <q-input dense label="MaxMessageNumInSession" v-model="MessageKeepNum" outlined placeholder="会话中最多保留几个消息..."
          class="full-width q-mb-md" />
        <slot name="setting-drawer"></slot>
      </div>
    </template>
  </MIDrawer>

  <MIDrawer :drawer="historyDrawerModel" class="chat-history">
    <template v-slot:drawer-content>
      <div class="column">
        <q-list separator class="full-width">
          <q-item v-for="item in historyRecords" :key="item.timestamp" clickable @click="restoreChat(item)">
            <div class="column full-width">
              <div class="row items-center no-wrap full-width">
                <div class="col-grow text-weight-bold" style="
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    flex: 1 1 auto;
                  ">
                  {{ item.inputSummary }}
                </div>
                <div class="text-caption text-grey-6 text-no-wrap q-ms-sm">
                  {{ new Date(item.timestamp).toLocaleString() }}
                </div>
              </div>
              <div caption class="row items-center no-wrap full-width">
                <div class="col-grow text-grey-6 text-caption full-width" style="
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    flex: 1 1 auto;
                  ">
                  {{ item.outputSummary }}
                </div>
                <q-btn class="q-ml-sm" dense size="0.8em" flat icon="delete" color="grey" @click="handleDelete(item)" />
              </div>
            </div>
          </q-item>
        </q-list>
      </div>
    </template>
  </MIDrawer>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import MiChatCard from './ChatCard.vue';
import MIDrawer from '../base/MIDrawer.vue';
import { DrawerModel } from '../base/BaseModels';
import {
  Message,
  GptMessage,
  loadHistorys,
  HistoryRecord,
  // ChatHistory,
  getHistory,
  addHistory,
  deleteHistory,
  updateHistory,
} from './ChatModels';
import { saveAs } from 'file-saver';
import { useAPIStore } from 'stores/APIStore';
// import { marked } from 'marked';
// import 'github-markdown-css';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github.css';

defineOptions({
  name: 'ChatDialog',
});
// define emits
const emit = defineEmits(['update-system-prompt', 'update-new-chat']);

// define props
interface Props {
  InputSystemPrompt: string;
  exampleInput?: string;
  exampleOutput?: string;
  maxNumber?: number;
  fourceModel?: string;
}
const props = withDefaults(defineProps<Props>(), {
  maxNumber: 9, // Set your default value here
});
const store = useAPIStore();
let Messages = ref<Message[]>([]);
let GptMessages = ref<GptMessage[]>([]);
let InputText = ref('');
let Loading = ref(false);
let Waiting = ref(false);
let MessageKeepNum = ref(props.maxNumber); // i think it's enough
let scrollAreaRef = ref<any>(null);
let historyRecords = ref<HistoryRecord[]>(loadHistorys());
let currentRecord: HistoryRecord | null = null;
let configDrawerModel = ref<DrawerModel>({
  open: false,
  side: 'right',
  title: 'Chat Config',
});
let historyDrawerModel = ref<DrawerModel>({
  open: false,
  side: 'right',
  title: 'Chat History',
});

let lastScrollHeight = 0;

// function init() {
//   marked.setOptions({
//     renderer: new marked.Renderer(),
//     highlight: function (code, language) {
//       const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
//       return hljs.highlight(validLanguage, code).value;
//     },
//     pedantic: false,
//     gfm: true,
//     breaks: false,
//     sanitize: false,
//     // smartLists: true,
//     smartypants: false,
//     xhtml: false,
//   });
// }
// init();

function exportDialog() {
  let textContent = '';
  Messages.value.forEach((msg) => {
    textContent += msg.Content + '\n';
  });

  const blob = new Blob([textContent], { type: 'text/plain' });
  saveAs(blob, 'dialog.txt');
}

function handleDelete(record: HistoryRecord) {
  historyRecords.value = deleteHistory(historyRecords.value, record);
}

function restoreChat(record: HistoryRecord) {
  let chatHistory = getHistory(record);
  emit('update-system-prompt', chatHistory?.systemPrompt);
  Messages.value = chatHistory?.messages ?? [];
  GptMessages.value = [];
  InputText.value = '';
  historyDrawerModel.value.open = false;
  currentRecord = record;
}

function GetGPTMessages() {
  GptMessages.value = [];

  let added = 0;
  for (let i = Messages.value.length - 1; i >= 0; i--) {
    let msg = Messages.value[i];

    if (added < MessageKeepNum.value) {
      // add last serval messages
      GptMessages.value.unshift({
        role: msg.Sender ? 'user' : 'assistant',
        content: msg.Content,
      });
      added++;
    } else {
      // add pinned message
      if (msg.Pinned) {
        GptMessages.value.unshift({
          role: msg.Sender ? 'user' : 'assistant',
          content: msg.Content,
        });
      }
    }
    // add example messages
    if (props.exampleInput && props.exampleOutput) {
      GptMessages.value.unshift({
        role: 'assistant',
        content: props.exampleOutput,
      });
      GptMessages.value.unshift({
        role: 'user',
        content: props.exampleInput,
      });
    }
  }

  // put system prompt
  if (props.InputSystemPrompt != '' && props.InputSystemPrompt != null) {
    GptMessages.value.unshift({
      role: 'user',
      content: props.InputSystemPrompt,
    });
  }
}

function ScrollAtBottom() {
  const scrollArea = scrollAreaRef.value;
  let curScrollHeight = scrollArea.getScrollTarget().scrollHeight;
  if (curScrollHeight > lastScrollHeight) {
    lastScrollHeight = curScrollHeight;
    nextTick(() => {
      scrollArea.setScrollPosition(
        'vertical',
        scrollArea.getScrollTarget().scrollHeight
      );
    });
  }
}

function PasteInput(content: string) {
  InputText.value = content;
}

async function StreamChat() {
  if (InputText.value == '') {
    return;
  }

  // 检查是否是新对话
  let needAddHistory = false;
  let inputSummary = '';
  const inputContent = InputText.value;
  if (Messages.value.length == 0) {
    needAddHistory = true;
    inputSummary = inputContent.slice(0, 100);
  }

  // 添加输入的消息
  Messages.value.push({
    Id: Date.now(),
    Sender: true,
    Content: inputContent,
    IncludeSession: true,
    Welcome: false,
    Pinned: false,
  });
  nextTick(() => {
    ScrollAtBottom();
  });

  GetGPTMessages();

  // 添加一个空消息，用于显示最新的AI回复
  Messages.value.push({
    Id: Date.now() + 1,
    Sender: false,
    Content: '',
    IncludeSession: true,
    Welcome: false,
    Pinned: false,
  });
  let lastMsg = Messages.value[Messages.value.length - 1];
  InputText.value = '';

  // 流式聊天
  Loading.value = true;
  const response = await fetch('/api/deepseek-stream-api', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: props.fourceModel ?? store.model,
      messages: GptMessages.value,
      temperature: store.temperature,
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();
    Loading.value = false;
    Waiting.value = true;

    if (value) {
      let text = decoder.decode(value);
      lastMsg.Content = lastMsg.Content + text;
      ScrollAtBottom();
    }

    if (done) {
      Waiting.value = false;
      // lastMsg.Content = marked(lastMsg.Content);
      // await nextTick();
      // inputCom.value.focus();
      ScrollAtBottom();
      emit('update-new-chat', inputContent, lastMsg.Content);

      if (needAddHistory) {
        currentRecord = {
          timestamp: Date.now(),
          inputSummary: inputSummary,
          outputSummary: lastMsg.Content.slice(0, 100),
        };
        historyRecords.value.push(currentRecord);
        addHistory(
          historyRecords.value,
          currentRecord,
          props.InputSystemPrompt,
          Messages.value
        );
      } else {
        if (currentRecord) {
          updateHistory(currentRecord, props.InputSystemPrompt, Messages.value);
        }
      }

      break;
    }
  }
}

function handleEnter(e: any) {
  if (e.ctrlKey) {
    StreamChat();
  }
}

function newChat() {
  Messages.value = [];
  GptMessages.value = [];
  InputText.value = '';
  Waiting.value = false;
}
</script>

<style>
.chat-history .q-scrollarea__content {
  width: 100%;
}
</style>
