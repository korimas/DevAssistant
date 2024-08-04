<template>
  <q-page class="row justify-center">
    <div class="q-pa-md full-width">
      <q-tabs
        v-model="tab"
        dense
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        align="left"
        narrow-indicator
      >
        <q-tab name="Monday" label="周一" />
        <q-tab name="Tuesday" label="周二" />
        <q-tab name="Wednesday" label="周三" />
        <q-tab name="Thursday" label="周四" />
        <q-tab name="Friday" label="周五" />
        <q-tab name="Saturday" label="周六" />
        <q-tab name="Sunday" label="周日" />
        <q-tab name="report" label=">> 周报 <<" />
        <q-space />

        <q-btn
          round
          dense
          :loading="generating"
          color="secondary"
          icon="webhook"
          style="margin-right: 5px"
          @click="generateWeeklyReport"
        >
          <q-tooltip> 生成周报 </q-tooltip>
        </q-btn>
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab">
        <q-tab-panel name="Monday">
          <DailyWorkTable :dayWork="weeklyWork.monday" />
        </q-tab-panel>
        <q-tab-panel name="Tuesday">
          <DailyWorkTable :dayWork="weeklyWork.tuesday" />
        </q-tab-panel>
        <q-tab-panel name="Wednesday">
          <DailyWorkTable :dayWork="weeklyWork.wednesday" />
        </q-tab-panel>
        <q-tab-panel name="Thursday">
          <DailyWorkTable :dayWork="weeklyWork.thursday" />
        </q-tab-panel>
        <q-tab-panel name="Friday">
          <DailyWorkTable :dayWork="weeklyWork.friday" />
        </q-tab-panel>
        <q-tab-panel name="Saturday">
          <DailyWorkTable :dayWork="weeklyWork.saturday" />
        </q-tab-panel>
        <q-tab-panel name="Sunday">
          <DailyWorkTable :dayWork="weeklyWork.sunday" />
        </q-tab-panel>
        <q-tab-panel name="report">
          <div v-html="weeklyWork.value.report" class="markdown-body"></div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  WEEKLY_WORK,
  getWeeklyWorkItemsNumber,
} from 'pages/weeklyreport/models';
import DailyWorkTable from './DailyWorkTable.vue';
import { useAPIStore } from 'stores/APIStore';
import { marked } from 'marked';
import 'github-markdown-css';

defineOptions({
  name: 'WeeklyReport',
});

let tab = ref('Monday');
let weeklyWork = ref(WEEKLY_WORK);
let generating = ref(false);
let OutputText = ref('');
let MarkdownText = ref('');
const store = useAPIStore();

async function generateWeeklyReport() {
  if (getWeeklyWorkItemsNumber() === 0) {
    return;
  }

  OutputText.value = '';
  MarkdownText.value = '';
  generating.value = true;

  // request
  const response = await fetch('/api/stream-weekly-status', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      //'Authorization': 'Bearer ' + Password.value
    },
    body: JSON.stringify({
      model: store.model,
      weeklyWork: JSON.stringify(weeklyWork.value),
      temperature: store.temperature,
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();

    if (value) {
      OutputText.value = OutputText.value + decoder.decode(value);
      weeklyWork.value.report = marked(OutputText.value);
    }

    if (done) {
      generating.value = false;
      break;
    }
  }
}
</script>
