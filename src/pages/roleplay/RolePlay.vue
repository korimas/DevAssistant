<template>
  <q-page class="row">
    <ChatDialog :InputSystemPrompt="InputSystemPrompt" :max-number="rolePlayPrompt.maxNum" fource-model="gpt-3.5-turbo"
      @update-system-prompt="setSystemPrompt" @update-new-chat="handleNewChat">
      <template v-slot:setting-drawer>
        <q-input dense clearable autogrow label="回顾区大小" v-model="maxReviewItemsNum" outlined class="full-width"
          style="margin-bottom: 10px" />
        <q-input dense clearable autogrow label="人物名称" v-model="rolePlayPrompt.roleName" outlined class="full-width"
          style="margin-bottom: 10px" @update:model-value="RolePlayPromptUpdate" />
        <q-input dense clearable autogrow label="我的名称" v-model="rolePlayPrompt.myName" outlined class="full-width"
          style="margin-bottom: 10px" @update:model-value="RolePlayPromptUpdate" />
        <q-input dense clearable autogrow label="规则区" v-model="rolePlayPrompt.rulesArea" outlined class="full-width"
          style="margin-bottom: 10px" @update:model-value="RolePlayPromptUpdate" />
        <q-input dense autogrow clearable label="记忆区" v-model="rolePlayPrompt.memoryArea" outlined class="full-width"
          style="margin-bottom: 10px" @update:model-value="RolePlayPromptUpdate" />
        <q-input v-for="(item, index) in rolePlayPrompt.reviewItems" :key="index" dense clearable autogrow
          :label="'回顾区' + (index + 1)" v-model="rolePlayPrompt.reviewItems[index]" outlined class="full-width"
          style="margin-bottom: 10px" @clear="clearReviewItem(index)" @update:model-value="RolePlayPromptUpdate" />
        <div class="row">
          <q-checkbox left-label v-model="rolePlayPrompt.rolePlayConfig.enableRoleState" label="开启角色状态(Beta)"
            checked-icon="task_alt" unchecked-icon="highlight_off" @update:model-value="RolePlayPromptUpdate" />
          <q-input v-if="rolePlayPrompt.rolePlayConfig.enableRoleState" dense clearable autogrow label="角色状态"
            v-model="rolePlayPrompt.roleState" outlined class="full-width" style="margin-bottom: 10px"
            @update:model-value="RolePlayPromptUpdate" />
        </div>

        <q-input dense clearable autogrow label="示例输出" v-model="rolePlayPrompt.exampleOutput" outlined
          class="full-width" style="margin-bottom: 10px" @update:model-value="RolePlayPromptUpdate" />
        <span> {{ InputSystemPrompt }}</span>
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
let maxReviewItemsNum = ref(2);

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
  if (rolePlayPrompt.value.rolePlayConfig.enableRoleState) {
    let splitIndex = outputContent.indexOf('角色状态');
    if (splitIndex != -1) {
      rolePlayPrompt.value.roleState = outputContent
        .slice(splitIndex + 5)
        .trimStart();
      outputContent = outputContent.slice(0, splitIndex - 1);
    }
  }

  rolePlayPrompt.value.reviewItems.push(
    `${rolePlayPrompt.value.myName}：${inputContent}\n${rolePlayPrompt.value.roleName
    }：${outputContent.trimEnd()}`
  );
  if (maxReviewItemsNum.value <= 0) {
    rolePlayPrompt.value.reviewItems = [];
  } else {
    rolePlayPrompt.value.reviewItems = rolePlayPrompt.value.reviewItems.slice(
      -maxReviewItemsNum.value
    );
  }
  saveRolePlayPrompt(rolePlayPrompt.value);
  InputSystemPrompt.value = generateRolePlayPromptStr(rolePlayPrompt.value);
}

function clearReviewItem(index: number) {
  rolePlayPrompt.value.reviewItems.splice(index, 1);
  saveRolePlayPrompt(rolePlayPrompt.value);
  InputSystemPrompt.value = generateRolePlayPromptStr(rolePlayPrompt.value);
}
</script>
