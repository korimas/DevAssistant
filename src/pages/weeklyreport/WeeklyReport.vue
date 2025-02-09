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
        <q-tab name="Project" label="项目" />
        <q-tab name="report" label=">> 周报 <<" />
        <q-space />
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
        <q-tab-panel name="Project">
          <ProjectWorkTable :dayWork="weeklyWork.sunday" />
        </q-tab-panel>
        <q-tab-panel name="report">
          <div class="row q-pl-sm" style="margin-bottom: 13px">
            <q-space />

            <q-btn
              label="生成周报"
              :loading="generating"
              color="secondary"
              icon="webhook"
              style="margin-right: 5px"
              @click="generateWeeklyReport"
            />
            <q-btn
              label="导出JSON"
              color="green"
              icon="output"
              style="margin-right: 5px"
              @click="exportWorkItems"
            />
          </div>

          <div v-html="weeklyWork.report" class="markdown-body"></div>
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
  autoSave,
} from 'src/pages/weeklyreport/DayModels';
import DailyWorkTable from './DailyWorkTable.vue';
import ProjectWorkTable from './ProjectWorkTable.vue';
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

function exportWorkItems() {
  // 创建包含字符串内容的Blob对象
  const blob = new Blob([JSON.stringify(weeklyWork.value)], {
    type: 'text/plain;charset=utf-8',
  });

  // 创建URL对象
  const url = URL.createObjectURL(blob);

  // 创建隐蔽的<a>元素
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'myFile.txt'; // 指定下载文件的文件名

  // 将<a>元素添加到DOM中
  document.body.appendChild(a);

  // 触发<a>元素的点击事件，以下载文件
  a.click();

  // 移除<a>元素
  document.body.removeChild(a);

  // 释放URL对象
  URL.revokeObjectURL(url);
}

async function generateWeeklyReport() {
  if (getWeeklyWorkItemsNumber() === 0) {
    weeklyWork.value.report = '请先填写工作内容';
    return;
  }

  OutputText.value = '';
  MarkdownText.value = '';
  generating.value = true;
  weeklyWork.value.report = '';

  // request
  const response = await fetch('/api/stream-weekly-status', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      //'Authorization': 'Bearer ' + Password.value
    },
    body: JSON.stringify({
      model: store.model.model,
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
      autoSave();
      break;
    }
  }
}
</script>
