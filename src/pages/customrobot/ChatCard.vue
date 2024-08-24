<template>
  <div class="column" style="border-bottom: 1px solid #cfcfcf; padding: 5px">
    <div class="row">
      <q-avatar
        v-if="Sender"
        size="24px"
        color="primary"
        icon="perm_identity"
      ></q-avatar>
      <q-avatar v-else size="24px" color="orange" icon="polymer"></q-avatar>

      <div
        v-if="Sender"
        class="text-h7"
        style="margin-top: auto; margin-left: 10px"
      >
        You
      </div>
      <div v-else class="text-h7" style="margin-top: auto; margin-left: 10px">
        DevAssistant
      </div>

      <q-space></q-space>
      <q-icon v-if="IncludeSession" name="maps_ugc" color="positive">
        <q-tooltip
          anchor="center right"
          self="center left"
          transition-show="scale"
          transition-hide="scale"
        >
          当前消息已包含在AI会话中
        </q-tooltip></q-icon
      >

      <q-btn v-if="Welcome" dense flat icon="keyboard_alt"></q-btn>
      <q-btn v-else dense flat icon="delete" color="negative"></q-btn>
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
      <div v-else style="white-space: pre-line">
        {{ Content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ChatCard',
});

const props = defineProps({
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
