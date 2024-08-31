<template>
  <q-page class="row">
    <ChatDialog
      :InputSystemPrompt="InputSystemPrompt"
      @update-system-prompt="setSystemPrompt"
    >
      <template v-slot:setting-drawer>
        <q-input
          dense
          clearable
          type="textarea"
          label="SystemPrompt"
          v-model="InputSystemPrompt"
          outlined
          placeholder="输入System Prompt..."
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="systemPromptUpdate"
        >
        </q-input>
      </template>
    </ChatDialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChatDialog from 'components/chat/ChatDialog.vue';
import { SystemPrompt, saveSystemPrompt } from './RobotModels';

let InputSystemPrompt = ref(SystemPrompt);
let timeoutId: NodeJS.Timeout | undefined;

defineOptions({
  name: 'CustomRobot',
});

function setSystemPrompt(prompt: string) {
  InputSystemPrompt.value = prompt;
}

function systemPromptUpdate() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    if (InputSystemPrompt.value === null) {
      InputSystemPrompt.value = '';
    }
    saveSystemPrompt(InputSystemPrompt.value);
  }, 1000);
}
</script>
