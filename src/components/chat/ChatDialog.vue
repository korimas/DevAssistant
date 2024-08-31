<template>
  <div
    class="column justify-between no-wrap full-width"
    style="padding: 5px; height: calc(100vh - 55px)"
  >
    <div style="overflow: auto">
      <div class="row full-width q-pa-xs q-gutter-xs bg-grey-4">
        <slot name="toolbox-left"></slot>
        <q-space />
        <q-btn
          unelevated
          round
          size="sm"
          icon="tune"
          @click="SettingDrawerOpen = true"
        />
        <q-btn unelevated round size="sm" icon="output" @click="exportDialog" />
      </div>
      <q-scroll-area style="height: calc(100vh - 167px)" ref="scrollAreaRef">
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
    :width="$q.screen.width > 600 ? 500 : $q.screen.width * 0.8"
    v-model="SettingDrawerOpen"
    overlay
  >
    <div class="q-pa-md row" style="height: 65px">
      <div class="text-h6">AI Configurations</div>
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
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useAPIStore } from 'stores/APIStore';
import MiChatCard from './ChatCard.vue';
import { Message, GptMessage } from './ChatModels';
import { saveAs } from 'file-saver';

// import { marked } from 'marked';
// import 'github-markdown-css';
defineOptions({
  name: 'ChatDialog',
});
// define emits
// const emit = defineEmits(['updateSystemPrompt']);

// function handleUpdateSystemPrompt() {
//   emit('updateSystemPrompt');
// }

// define props
interface Props {
  InputSystemPrompt: string;
}

const props = defineProps<Props>();

const store = useAPIStore();
let Messages = ref<Message[]>([]);
let GptMessages = ref<GptMessage[]>([]);
let SystemPrompt = ref(props.InputSystemPrompt);

let InputText = ref('');
let Loading = ref(false);
let Waiting = ref(false);
let MessageKeepNum = ref(5);
let scrollAreaRef = ref<any>(null);
let SettingDrawerOpen = ref(false);

function exportDialog() {
  let textContent = '';
  Messages.value.forEach((msg) => {
    textContent += msg.Content + '\n';
  });

  const blob = new Blob([textContent], { type: 'text/plain' });
  saveAs(blob, 'dialog.txt');
}

function GetGPTMessages() {
  GptMessages.value = [];

  if (SystemPrompt.value != '' && SystemPrompt.value != null) {
    GptMessages.value.push({
      role: 'system',
      content: SystemPrompt.value,
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
  scrollArea.setScrollPosition(
    'vertical',
    scrollArea.getScrollTarget().scrollHeight
  );
}

function RefreshChat(content: string) {
  InputText.value = content;
}

async function StreamChat() {
  if (InputText.value == '') {
    return;
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
  nextTick(() => {
    ScrollAtBottom();
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
      model: 'gpt-3.5-turbo',
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
      nextTick(() => {
        ScrollAtBottom(); // TODO: 提升性能
      });
    }

    if (done) {
      Waiting.value = false;
      // lastMsg.Content = marked(lastMsg.Content);
      // await nextTick();
      // inputCom.value.focus();
      break;
    }
  }
}

function handleEnter(e: any) {
  if (e.ctrlKey) {
    StreamChat();
  }
}
</script>
