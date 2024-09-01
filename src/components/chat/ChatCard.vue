<template>
  <div class="column" style="border-bottom: 1px solid #cfcfcf; margin: 5px">
    <!-- 头像 -->
    <div class="row items-center">
      <q-avatar
        v-if="messageRef.Sender"
        size="24px"
        color="primary"
        icon="perm_identity"
      />
      <q-avatar v-else size="24px" color="orange" icon="polymer"></q-avatar>
      <!-- 昵称 -->
      <div class="text-h7 text-bold" style="margin: 0 0 0 10px">
        {{ messageRef.Sender ? 'You' : 'DevAssistant' }}
      </div>

      <q-space />
      <div v-if="!messageRef.Welcome">
        <q-btn
          v-if="messageRef.Sender"
          dense
          flat
          size="0.8em"
          icon="content_copy"
          color="grey"
          @click="handleRefresh"
        />
        <q-btn
          dense
          flat
          size="0.8em"
          icon="delete"
          color="grey"
          @click="handleDelete"
        />
      </div>
    </div>

    <!-- 内容 -->
    <div class="full-width q-my-sm">
      <!-- load动画 -->
      <q-circular-progress
        v-if="!messageRef.Content"
        indeterminate
        size="xs"
        :thickness="0.4"
        font-size="50px"
        color="lime"
        track-color="grey-3"
        center-color="grey-8"
      />
      <div v-else>
        <div style="white-space: pre-line">
          {{ messageRef.Content }}
        </div>
        <!-- <div
          style="white-space: pre-line"
          v-else
          v-html="messageRef.Content"
          class="markdown-body"
        ></div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Message } from './ChatModels';

defineOptions({
  name: 'ChatCard',
});

// define emits
const emit = defineEmits(['delete', 'refresh']);

function handleDelete() {
  emit('delete');
}

function handleRefresh() {
  emit('refresh');
}

interface Props {
  message: Message;
}

const props = defineProps<Props>();

let messageRef = ref(props.message);
</script>

<!-- <style>
.chat-content .q-scrollarea__content {
  width: 100%;
}
</style> -->
