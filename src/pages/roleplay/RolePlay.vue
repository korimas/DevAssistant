<template>
  <q-page class="row">
    <ChatDialog
      :InputSystemPrompt="InputSystemPrompt"
      @update-system-prompt="setSystemPrompt"
      @update-new-chat="handleNewChat"
    >
      <template v-slot:setting-drawer>
        <q-input
          dense
          clearable
          autogrow
          label="命令区"
          v-model="rolePlayPrompt.rulesArea"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />
        <q-input
          dense
          autogrow
          clearable
          label="记忆区"
          v-model="rolePlayPrompt.memoryArea"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />
        <q-input
          dense
          clearable
          autogrow
          label="回顾区"
          v-model="rolePlayPrompt.reviewArea"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />
        <q-input
          dense
          clearable
          autogrow
          label="回顾区2"
          v-model="rolePlayPrompt.reviewArea2"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />
        <q-input
          dense
          clearable
          autogrow
          label="人物状态"
          v-model="rolePlayPrompt.roleState"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />
      </template>
    </ChatDialog>
  </q-page>
</template>

<script setup lang="ts">
import ChatDialog from 'components/chat/ChatDialog.vue';
import { ref } from 'vue';
import {
  ROLE_PLAY_PROMPT,
  saveRolePlayPrompt,
  generateRolePlayPromptStr,
} from './RolePlayModels';

defineOptions({
  name: 'RolePlay',
});

let rolePlayPrompt = ref(ROLE_PLAY_PROMPT);
let InputSystemPrompt = ref('');
let timeoutId: NodeJS.Timeout | undefined;
let lastInputContent = '';
let lastOutputContent = '';

// init
InputSystemPrompt.value = generateRolePlayPromptStr(rolePlayPrompt.value);

function RolePlayPromptUpdate() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    saveRolePlayPrompt(rolePlayPrompt.value);
    InputSystemPrompt.value = generateRolePlayPromptStr(rolePlayPrompt.value);
  }, 1000);
}

function setSystemPrompt(prompt: string) {
  InputSystemPrompt.value = prompt; // just for change history
}

function handleNewChat(inputContent: string, outputContent: string) {
  // split role state
  let splitIndex = outputContent.indexOf('[角色状态]');
  if (splitIndex != -1) {
    rolePlayPrompt.value.roleState = outputContent.slice(1, splitIndex + 6);
    outputContent = outputContent.slice(0, splitIndex);
  }
  if (
    rolePlayPrompt.value.reviewArea2 !== '' &&
    rolePlayPrompt.value.reviewArea2 !== 'undefined' &&
    rolePlayPrompt.value.reviewArea2 !== null
  ) {
    rolePlayPrompt.value.reviewArea = rolePlayPrompt.value.reviewArea2;
  }

  if (inputContent !== '' && outputContent !== '') {
    rolePlayPrompt.value.reviewArea2 = `桐谷华: ${inputContent}
桐谷绫: ${outputContent}`;
  }
  saveRolePlayPrompt(rolePlayPrompt.value);
  InputSystemPrompt.value = generateRolePlayPromptStr(rolePlayPrompt.value);
}
</script>
