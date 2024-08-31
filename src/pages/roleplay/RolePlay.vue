<template>
  <q-page class="row">
    <ChatDialog :InputSystemPrompt="InputSystemPrompt">
      <template v-slot:setting-drawer>
        <q-input
          dense
          clearable
          autogrow
          label="基本规则"
          v-model="rolePlayPrompt.baseRule"
          outlined
          placeholder="输入基本规则"
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />
        <q-input
          dense
          clearable
          label="人物角色"
          v-model="rolePlayPrompt.role.role"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />

        <!-- <q-input
            dense
            clearable
            label="人物名字"
            v-model="rolePlayPrompt.role.name"
            outlined
            class="full-width"
            style="margin-bottom: 10px"
            @update:model-value="RolePlayPromptUpdate"
          /> -->
        <q-input
          dense
          clearable
          autogrow
          label="人物背景"
          v-model="rolePlayPrompt.role.background"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />
        <q-input
          dense
          clearable
          autogrow
          label="人物特点"
          v-model="rolePlayPrompt.role.character"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />

        <q-input
          dense
          clearable
          autogrow
          label="对话指引"
          v-model="rolePlayPrompt.dialogGuide.guide"
          outlined
          class="full-width"
          style="margin-bottom: 10px"
          @update:model-value="RolePlayPromptUpdate"
        />

        <q-input
          dense
          clearable
          autogrow
          label="对话示例"
          v-model="rolePlayPrompt.dialogGuide.example"
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
</script>
