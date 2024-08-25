import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/requirement' },
      { path: 'requirement/', component: () => import('pages/Requirement.vue') },
      { path: 'systosw/', component: () => import('pages/SysToSW.vue') },
      { path: 'testcase/', component: () => import('pages/TestCase.vue') },
      { path: 'translate/', component: () => import('pages/Translate.vue') },
      { path: 'oneqonea/', component: () => import('pages/OneQOneA.vue') },
      { path: 'customrobot/', component: () => import('pages/customrobot/Customrobot.vue') },
      { path: 'weeklyreport/', component: () => import('pages/weeklyreport/WeeklyReport.vue') },
      { path: 'roleplay/', component: () => import('pages/roleplay/RolePlay.vue') },

    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
