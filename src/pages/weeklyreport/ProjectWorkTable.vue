<template>
  <q-input filled v-model="date" mask="date" :rules="['date']">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="datePopup"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="date"
            landscape
            @update:model-value="hideDatePopup"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-table
    class="work-item-table"
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
        <div class="q-table__title text-h5">
          {{ tableTitle }}
        </div>
        <q-space></q-space>

        <q-btn
          flat
          size="13px"
          color="red-5"
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
          autogrow
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
} from './DayModels';

defineOptions({
  name: 'ProjectWorkTable',
});

// props
interface Props {
  dayWork: DayWork;
}

const props = defineProps<Props>();
let dayWork = ref(props.dayWork);
let timeoutId: NodeJS.Timeout | undefined; // 检查延时的计时器ID
let tableTitle = 'Project Work Table';
let date = ref(new Date().toISOString().split('T')[0]);
let datePopup = ref<any>(null); // Declare the datePopup ref

function hideDatePopup() {
  if (datePopup.value) {
    datePopup.value.hide();
  }
}

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

<style>
.work-item-table .q-textarea {
  width: 100% !important;
  height: 100% !important;
}

.work-item-table .q-textarea.q-field--dense .q-field__control,
.work-item-table .q-textarea.q-field--dense .q-field__native {
  min-height: 36px;
  height: 100%;
}
</style>
