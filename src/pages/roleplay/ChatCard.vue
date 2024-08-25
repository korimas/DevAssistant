<template>
  <div class="column" style="border-bottom: 1px solid #cfcfcf; margin: 5px">
    <div class="row">
      <q-avatar
        v-if="Sender"
        size="24px"
        color="primary"
        icon="perm_identity"
      ></q-avatar>
      <q-avatar v-else size="24px" color="orange" icon="polymer"></q-avatar>

      <div class="text-h7 text-grey" style="margin: 0 0 0 10px">
        {{ Sender ? 'You' : 'DevAssistant' }}
      </div>

      <q-space></q-space>
      <div v-if="!Welcome">
        <q-btn
          dense
          flat
          icon="delete"
          color="negative"
          @click="handleDelete"
        ></q-btn>
      </div>
    </div>
    <div style="margin-top: 5px">
      <q-circular-progress
        v-if="!Content"
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
        {{ Content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const props = defineProps({
  Id: {
    type: Number,
    default: 0,
  },
  Sender: {
    type: Boolean,
    default: true,
  },
  Content: {
    type: String,
    default: 'Oops! Something went wrong!',
  },
  IncludeSession: {
    type: Boolean,
    default: true,
  },
  Welcome: {
    type: Boolean,
    default: false,
  },
});
</script>
