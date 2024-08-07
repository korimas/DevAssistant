import { defineStore } from 'pinia';

export const useAPIStore = defineStore('api', {
  state: () => ({
    modelOptions: ['gpt-4-turbo', 'gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    model: 'gpt-4o',
    temperatureOptions: [2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0],
    temperature: 0.9
  }),

  // getters: {
  //   GetAPIModel: (state: any) => {
  //     return state.model;
  //   },
  // },
  //
  // actions: {
  //   UpdateAPIModel (model: string) {
  //     this.model = model;
  //   }
  // }
});
