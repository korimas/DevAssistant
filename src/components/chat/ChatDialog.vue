<template>
  <div
    class="column justify-between no-wrap full-width"
    style="padding: 5px; height: calc(100vh - 55px)"
  >
    <div style="overflow: auto">
      <div class="row full-width q-pa-xs q-gutter-xs bg-grey-4">
        <q-btn unelevated round size="sm" icon="add" @click="newChat" />

        <slot name="toolbox-left"></slot>
        <q-space />
        <q-btn
          unelevated
          round
          size="sm"
          icon="history"
          @click="historyDrawerOpen = true"
        />
        <q-btn
          unelevated
          round
          size="sm"
          icon="tune"
          @click="SettingDrawerOpen = true"
        />
        <q-btn unelevated round size="sm" icon="output" @click="exportDialog" />
      </div>
      <q-scroll-area
        class="full-width"
        style="height: calc(100vh - 167px)"
        ref="scrollAreaRef"
      >
        <div
          v-for="item in Messages"
          :key="item.Id"
          class="caption doc-content"
        >
          <MiChatCard
            :message="item"
            @delete="
              () => (Messages = Messages.filter((msg) => msg.Id !== item.Id))
            "
            @refresh="RefreshChat(item.Content)"
          />
        </div>
      </q-scroll-area>
    </div>

    <div style="margin-bottom: 10px; margin-top: 10px">
      <q-input
        dense
        autogrow
        v-model="InputText"
        outlined
        placeholder="输入任何问题，与AI互动..."
        @keydown.enter="handleEnter"
      >
        <template v-slot:append>
          <q-btn dense flat icon="send" @click="StreamChat" />
        </template>
      </q-input>
    </div>
  </div>

  <q-drawer
    elevated
    side="right"
    :width="$q.screen.width > 600 ? 500 : $q.screen.width * 0.85"
    v-model="SettingDrawerOpen"
    overlay
  >
    <div class="q-pa-md row" style="height: 65px">
      <div class="text-h6">Chat Config</div>
      <q-space></q-space>
      <q-btn
        unelevated
        size="12px"
        icon="clear"
        color="red"
        @click="SettingDrawerOpen = false"
      />
    </div>
    <q-separator />
    <q-scroll-area style="height: calc(100% - 66px)">
      <div class="column q-pa-md">
        <q-input
          dense
          label="MaxMessageNumInSession"
          v-model="MessageKeepNum"
          outlined
          placeholder="会话中最多保留几个消息..."
          class="full-width q-mb-md"
        />
        <slot name="setting-drawer"></slot>
      </div>
    </q-scroll-area>
  </q-drawer>

  <q-drawer
    elevated
    side="right"
    :width="$q.screen.width > 600 ? 500 : $q.screen.width * 0.85"
    v-model="historyDrawerOpen"
    overlay
  >
    <div class="q-pa-md row" style="height: 65px">
      <div class="text-h6">Chat History</div>
      <q-space></q-space>
      <q-btn
        unelevated
        size="12px"
        icon="clear"
        color="red"
        @click="historyDrawerOpen = false"
      />
    </div>
    <q-separator />
    <q-scroll-area style="height: calc(100% - 66px)" class="chat-history">
      <div class="column">
        <q-list separator class="full-width">
          <q-item
            v-for="item in historyRecords"
            :key="item.timestamp"
            clickable
            @click="restoreChat(item)"
          >
            <div class="column full-width">
              <div class="row items-center no-wrap full-width">
                <div
                  class="col-grow text-weight-bold"
                  style="
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    flex: 1 1 auto;
                  "
                >
                  {{ item.inputSummary }}
                </div>
                <div class="text-caption text-grey-6 text-no-wrap q-ms-sm">
                  {{ new Date(item.timestamp).toLocaleString() }}
                </div>
              </div>
              <div caption class="row items-center no-wrap full-width">
                <div
                  class="col-grow text-grey-6 text-caption full-width"
                  style="
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    flex: 1 1 auto;
                  "
                >
                  {{ item.outputSummary }}
                </div>
                <q-btn
                  class="q-ml-sm"
                  dense
                  size="0.8em"
                  flat
                  icon="delete"
                  color="grey"
                  @click="handleDelete(item)"
                />
              </div>
            </div>

            <!-- <q-item-section side top>
              <q-item-label caption
                >{{ new Date(item.timestamp).toLocaleString() }}
              </q-item-label>
              <q-btn
                dense
                flat
                icon="delete"
                color="grey"
                @click="handleDelete(item)"
              />
            </q-item-section> -->
          </q-item>
        </q-list>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useAPIStore } from 'stores/APIStore';
import MiChatCard from './ChatCard.vue';
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
// import { marked } from 'marked';
// import 'github-markdown-css';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github.css';

defineOptions({
  name: 'ChatDialog',
});
// define emits
const emit = defineEmits(['update-system-prompt']);

// define props
interface Props {
  InputSystemPrompt: string;
}

const props = defineProps<Props>();

const store = useAPIStore();
let Messages = ref<Message[]>([]);
let GptMessages = ref<GptMessage[]>([]);
let InputText = ref('');
let Loading = ref(false);
let Waiting = ref(false);
let MessageKeepNum = ref(9); // i think it's enough
let scrollAreaRef = ref<any>(null);
let SettingDrawerOpen = ref(false);
let historyDrawerOpen = ref(false);
let historyRecords = ref<HistoryRecord[]>(loadHistorys());
let currentRecord: HistoryRecord | null = null;

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
  historyDrawerOpen.value = false;
  currentRecord = record;
}

function GetGPTMessages() {
  GptMessages.value = [];

  if (props.InputSystemPrompt != '' && props.InputSystemPrompt != null) {
    GptMessages.value.push({
      role: 'system',
      content: props.InputSystemPrompt,
    });
  }

  // 从Messages中获取最新的MessageKeepNum个个消息
  let len = Messages.value.length;
  let start = len - MessageKeepNum.value;
  if (start < 0) {
    start = 0;
  }
  for (let i = start; i < len; i++) {
    let msg = Messages.value[i];
    if (msg.Sender) {
      GptMessages.value.push({
        role: 'user',
        content: msg.Content,
      });
    } else {
      GptMessages.value.push({
        role: 'assistant',
        content: msg.Content,
      });
    }
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

function RefreshChat(content: string) {
  InputText.value = content;
}

async function StreamChat() {
  if (InputText.value == '') {
    return;
  }

  // 检查是否是新对话
  let needAddHistory = false;
  let inputSummary = '';
  if (Messages.value.length == 0) {
    needAddHistory = true;
    inputSummary = InputText.value.slice(0, 100);
  }

  // 添加输入的消息
  Messages.value.push({
    Id: Date.now(),
    Sender: true,
    Content: InputText.value,
    IncludeSession: true,
    Welcome: false,
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
  });
  let lastMsg = Messages.value[Messages.value.length - 1];
  InputText.value = '';

  // 流式聊天
  Loading.value = true;
  const response = await fetch('/api/stream-api', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: store.model,
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
