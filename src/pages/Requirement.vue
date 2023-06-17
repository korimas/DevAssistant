<template>
  <div class="q-pa-md">
  <div class="q-gutter-md">
    <q-input autogrow v-model="InputText" label="需求描述" @keydown.enter="handleEnter"/>
    <div style="white-space: pre-wrap">{{OutputText}}</div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RequirementPage',
  setup() {
    let InputText = ref('')
    let OutputText = ref('')

    function handleEnter(e: any) {
      if (e.ctrlKey) {
        //StreamChat()
        console.log("send")
      }
    }

    return {
      InputText,
      OutputText,
      handleEnter
    }
  }
});
</script>

<style scoped>

</style>
