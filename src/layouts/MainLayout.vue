<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          DevAssistant
        </q-toolbar-title>
        <div style="min-width: 100px"><q-select filled v-model="store.model" :options="store.modelOptions" label="Model" /></div>
        <div style="width: 130px"><q-select filled v-model="store.temperature" :options="store.temperatureOptions" label="Temperature" /></div>

      </q-toolbar>


    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          菜单
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAPIStore } from 'stores/APIStore'
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: '软件需求分析',
    caption: '效率工具',
    icon: 'school',
    link: '/requirement'
  }, {
    title: '系统需求拆解',
    caption: '效率工具',
    icon: 'mediation',
    link: '/systosw'
  }, {
    title: '测试用例分析',
    caption: '效率工具',
    icon: 'saved_search',
    link: '/testcase'
  }, {
    title: 'AI中英文翻译',
    caption: '效率工具',
    icon: 'translate',
    link: '/translate'
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const store = useAPIStore();

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      store,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
});
</script>
