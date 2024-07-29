<template>
  <q-table
    flat
    selection="multiple"
    :rows="dayWork.rows"
    v-model:selected="dayWork.selected"
    :columns="WorkColumns"
    row-key="id"
    :pagination="initialPagination"
  >
    <!--表格顶部内容:插槽-->
    <template v-slot:top>
      <div class="q-gutter-sm row full-width" style="margin: 0">
        <!--表格标题-->
        <div class="q-table__title text-h5">{{ dayWork.name }}</div>
        <q-space></q-space>

        <q-btn
          flat
          size="13px"
          icon="clear"
          color="red"
          label="ClearAll"
          @click="clearAll(dayWork)"
        />
        <!--批量删除按钮-->
        <q-btn
          outline
          size="13px"
          icon="delete"
          color="red"
          label="Delete"
          :disabled="dayWork.selected.length < 1"
          @click="deleteSelectedWorks(dayWork)"
        />
        <!--创建按钮-->
        <q-btn
          unelevated
          size="13px"
          color="green"
          icon="add"
          label="ADD"
          @click="addWorkItem(dayWork)"
        />
      </div>
    </template>

    <template v-slot:body-cell="props">
      <q-td :props="props">
        <q-input
          v-model="props.row[props.col.name]"
          input-class="text-left"
          dense
          standout="bg-teal text-white"
          @update:model-value="autoSaveInput"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  WorkColumns,
  DayWork,
  addWorkItem,
  deleteSelectedWorks,
  autoSave,
  clearAll,
} from './models';

defineOptions({
  name: 'DailyWorkTable',
});

// props
interface Props {
  dayWork: DayWork;
}

const props = defineProps<Props>();
let dayWork = ref(props.dayWork);
let timeoutId: NodeJS.Timeout | undefined; // 检查延时的计时器ID

function autoSaveInput() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    autoSave();
  }, 1000);
}
let initialPagination = {
  sortBy: 'date',
  descending: false,
  page: 1,
  rowsPerPage: 50,
};
</script>
