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

        <q-toolbar-title> DevAssistant </q-toolbar-title>
        <q-btn round flat icon="settings" @click="toggleSettingDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="230"
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
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      elevated
      side="right"
      :width="$q.screen.width > 600 ? 500 : $q.screen.width * 0.8"
      v-model="settingDrawerOpen"
      overlay
    >
      <div class="q-pa-md row" style="height: 65px">
        <div class="text-h6">API Config</div>
        <q-space></q-space>
        <q-btn
          unelevated
          size="12px"
          icon="clear"
          color="red"
          @click="toggleSettingDrawer"
        />
      </div>
      <q-separator />

      <q-scroll-area
        style="height: calc(100% - 66px)"
        :horizontal-thumb-style="{ opacity: '0' }"
      >
        <div class="q-pa-md q-gutter-md">
          <div style="min-width: 100px">
            <q-select dense filled v-model="store.model" :options="AIModels">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <div
                      style="padding-left: 0px"
                      class="q-gutter-xs row items-center"
                    >
                      <q-avatar square style="width: 16px; height: 16px">
                        <img :src="'/aimodels/' + scope.opt.icon" />
                      </q-avatar>

                      <span>{{ scope.opt.name }}</span>
                    </div>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:selected-item="scope">
                <div
                  style="padding-left: 0px"
                  class="q-gutter-xs row items-center"
                >
                  <q-avatar square style="width: 16px; height: 16px">
                    <img :src="'/aimodels/' + scope.opt.icon" />
                  </q-avatar>

                  <span>{{ scope.opt.name }}</span>
                </div>
              </template>
            </q-select>
          </div>
          <div style="min-width: 130px">
            <!-- <q-badge color="secondary">
              Temperature: {{ store.temperature }}, 介于0和2之间，数字越大代表每次结果的随机性越高
            </q-badge> -->
            Temperature: {{ store.temperature }}
            <q-slider
              v-model="store.temperature"
              :min="0"
              :max="2"
              :step="0.1"
              label
            />
            Temperature介于0和2之间，数字越大代表每次结果的随机性越高
            <!-- <q-select filled v-model="store.temperature" :options="store.temperatureOptions" label="Temperature"
              hint="介于0和2之间，数字越大代表每次结果的随机性越高" /> -->
            <!--            <q-input-->
            <!--              hint="介于0和2之间，数字越大代表随机性越高"-->
            <!--              v-model.number="store.temperature"-->
            <!--              type="number"-->
            <!--              step="0.1"-->
            <!--              label="Temperature"-->
            <!--              filled-->
            <!--              :rules="[val => val >=0 && val <= 2 || '应该介于0和2之间']"-->
            <!--            />-->
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { useAPIStore } from 'stores/APIStore';
import EssentialLink from 'components/EssentialLink.vue';
import { AIModels } from 'src/service/common/constances';

const linksList = [
  {
    title: '软件需求分析',
    caption: '效率工具',
    icon: 'school',
    link: '/requirement',
  },
  {
    title: 'AI中英文翻译',
    caption: '效率工具',
    icon: 'translate',
    link: '/translate',
  },
  {
    title: '周报生成工具',
    caption: '效率工具',
    icon: 'summarize',
    link: '/weeklyreport',
  },
  {
    title: '自定义机器人',
    caption: '效率工具',
    icon: 'precision_manufacturing',
    link: '/customrobot',
  },
  {
    title: '一问一答聊天',
    caption: '效率工具',
    icon: 'question_answer',
    link: '/oneqonea',
    disable: true,
  },
  {
    title: '系统需求拆解',
    caption: '效率工具',
    icon: 'mediation',
    link: '/systosw',
    disable: true,
  },
  {
    title: '测试用例分析',
    caption: '效率工具',
    icon: 'saved_search',
    link: '/testcase',
    disable: true,
  },
  {
    title: '数据文件分析',
    caption: '效率工具',
    icon: 'document_scanner',
    link: '/oneqonea',
    disable: true,
  },
];

const leftDrawerOpen = ref(false);
const settingDrawerOpen = ref(false);
const store = useAPIStore();
const miniState = ref(true);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleSettingDrawer() {
  settingDrawerOpen.value = !settingDrawerOpen.value;
}
</script>
