<template>
  <div class="column" style="border-bottom: 1px solid #cfcfcf; margin: 5px">
    <div class="row">
      <q-avatar
        v-if="messageRef.Sender"
        size="24px"
        color="primary"
        icon="perm_identity"
      ></q-avatar>
      <q-avatar v-else size="24px" color="orange" icon="polymer"></q-avatar>

      <div class="text-h7 text-grey" style="margin: 0 0 0 10px">
        {{ messageRef.Sender ? 'You' : 'DevAssistant' }}
      </div>

      <q-space></q-space>
      <div v-if="!messageRef.Welcome">
        <q-btn
          v-if="messageRef.Sender"
          dense
          flat
          icon="content_copy"
          color="grey"
          @click="handleRefresh"
        />
        <q-btn dense flat icon="delete" color="grey" @click="handleDelete" />
      </div>
    </div>
    <div style="margin-top: 5px">
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
      <div
        v-else
        style="white-space: pre-line; margin-left: 5px; margin-bottom: 5px"
      >
        {{ messageRef.Content }}
        <q-popup-edit v-model="messageRef.Content" auto-save v-slot="scope">
          <q-input
            v-model="scope.value"
            autogrow
            dense
            autofocus
            counter
            @keyup.enter="scope.set"
          />
        </q-popup-edit>
      </div>
      <!-- <div
        v-else
        style="margin-top: 10px"
        v-html="Content"
        class="markdown-body"
      ></div> -->
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
