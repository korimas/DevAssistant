<template>
  <q-input
    v-model="SystemPrompt"
    outlined
    placeholder="输入System Prompt..."
    class="full-width"
  >
  </q-input>
  <div
    class="column justify-between no-wrap full-width"
    style="padding: 5px; height: calc(100vh - 107px)"
  >
    <div style="overflow: auto">
      <div v-for="item in Messages" :key="item.Id" class="caption doc-content">
        <MiChatCard
          :Sender="item.Sender"
          :Content="item.Content"
          :IncludeSession="item.IncludeSession"
          :Welcome="item.Welcome"
        />
      </div>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAPIStore } from 'stores/APIStore';
import MiChatCard from './ChatCard.vue';

defineOptions({
  name: 'ChatDialog',
});

type Message = {
  Id: number;
  Content: string;
  Sender: boolean;
  IncludeSession: boolean;
  Welcome: boolean;
};

type GptMessage = {
  role: string;
  content: string;
};

const store = useAPIStore();
let Messages = ref<Message[]>([]);
let GptMessages = ref<GptMessage[]>([]);

Messages.value.push({
  Id: Date.now(),
  Sender: false,
  Content: 'Hello, I am AI. How can I help you?',
  IncludeSession: false,
  Welcome: true,
});

let InputText = ref('');
let SystemPrompt = ref('');
let Loading = ref(false);
let Waiting = ref(false);

GptMessages.value.push({
  role: 'system',
  content: SystemPrompt.value,
});

async function StreamChat() {
  if (InputText.value == '') {
    return;
  }
  Messages.value.push({
    Id: Date.now(),
    Sender: true,
    Content: InputText.value,
    IncludeSession: true,
    Welcome: false,
  });

  GptMessages.value.push({
    role: 'user',
    content: InputText.value,
  });

  // 添加一个空消息，用于显示最新的AI回复
  Messages.value.push({
    Id: Date.now(),
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
    }

    if (done) {
      Waiting.value = false;
      GptMessages.value.push({
        role: 'assistant',
        content: lastMsg.Content,
      });
      // await nextTick()
      // inputCom.value.focus()
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
