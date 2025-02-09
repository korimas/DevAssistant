<template>
  <q-drawer
    elevated
    :side="drawerModel.side"
    :width="$q.screen.width > 600 ? 500 : $q.screen.width * 0.85"
    v-model="drawerModel.open"
    overlay
  >
    <div class="q-pa-md row" style="height: 65px">
      <div class="text-h6">{{ drawerModel.title }}</div>
      <q-space></q-space>
      <q-btn
        unelevated
        size="12px"
        icon="clear"
        color="red"
        @click="drawerModel.open = false"
      />
    </div>
    <q-separator />
    <q-scroll-area style="height: calc(100% - 66px)">
      <slot name="drawer-content"></slot>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DrawerModel } from './BaseModels';
defineOptions({
  name: 'MIDrawer',
});

interface Props {
  drawer: DrawerModel;
}

const props = defineProps<Props>();

const drawerModel = ref<DrawerModel>(props.drawer);
</script>
