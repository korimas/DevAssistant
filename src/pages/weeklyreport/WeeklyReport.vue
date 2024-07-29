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
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WEEKLY_WORK } from 'pages/weeklyreport/models';
import DailyWorkTable from './DailyWorkTable.vue';

defineOptions({
  name: 'WeeklyReport',
});

let tab = ref('Monday');
let weeklyWork = ref(WEEKLY_WORK);
</script>
