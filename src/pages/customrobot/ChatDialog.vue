<template>
  <div
    class="column justify-between no-wrap full-width"
    style="padding: 5px; height: calc(100vh - 55px)"
  >
    <div style="overflow: auto">
      <q-expansion-item
        dense
        class="shadow-1 overflow-hidden"
        icon="tune"
        label="AI Configuration"
        header-class="bg-grey-3"
        expand-icon-class="text-white"
        style="margin-bottom: 10px"
      >
        <q-card class="column q-pa-md">
          <q-input
            dense
            clearable
            type="textarea"
            label="SystemPrompt"
            v-model="SystemPrompt"
            outlined
            placeholder="输入System Prompt..."
            class="full-width"
            style="margin-bottom: 10px"
            @update:model-value="systemPromptUpdate"
          >
          </q-input>

          <q-input
            dense
            label="MaxMessageNumInSession"
            v-model="MessageKeepNum"
            outlined
            placeholder="会话中最多保留几个消息..."
            class="full-width"
          >
          </q-input>
        </q-card>
      </q-expansion-item>

      <div v-for="item in Messages" :key="item.Id" class="caption doc-content">
        <MiChatCard
          :Sender="item.Sender"
          :Content="item.Content"
          :IncludeSession="item.IncludeSession"
          :Welcome="item.Welcome"
          :Id="item.Id"
          @delete="
            () => (Messages = Messages.filter((msg) => msg.Id !== item.Id))
          "
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
import {
  SystemPrompt as RobotSystemPrompt,
  saveSystemPrompt,
} from './RobotModels';

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

let InputText = ref('');
let SystemPrompt = ref(RobotSystemPrompt);
let Loading = ref(false);
let Waiting = ref(false);
let MessageKeepNum = ref(5);
let timeoutId: NodeJS.Timeout | undefined; // 检查延时的计时器ID

function systemPromptUpdate() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    saveSystemPrompt(SystemPrompt.value);
  }, 1000);
}

function GetGPTMessages() {
  GptMessages.value = [
    {
      role: 'system',
      content: SystemPrompt.value,
    },
  ];

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
    }

    if (done) {
      Waiting.value = false;
      //   GptMessages.value.push({
      //     role: 'assistant',
      //     content: lastMsg.Content,
      //   });
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
