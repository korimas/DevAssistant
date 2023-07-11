<template>
  <q-layout view="hHh Lpr lff">
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
        <q-btn round flat icon="settings" @click="toggleSettingDrawer"/>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">

      <q-list padding>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer elevated side="right"
              :width="($q.screen.width > 600) ? 600: ($q.screen.width * 0.8)"
              v-model="settingDrawerOpen"
              overlay
    >

      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <div class="q-pa-md q-gutter-md">
          <div style="min-width: 100px"><q-select filled v-model="store.model" :options="store.modelOptions" label="Model" /></div>
          <div style="width: 130px"><q-select filled v-model="store.temperature" :options="store.temperatureOptions" label="Temperature" /></div>
        </div>

      </q-scroll-area>
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
    const settingDrawerOpen = ref(false)
    const store = useAPIStore();
    const miniState = ref(true)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      miniState,
      store,
      settingDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      toggleSettingDrawer() {
        settingDrawerOpen.value = !settingDrawerOpen.value
      }
    }
  }
});
</script>
