import {defineStore} from 'pinia';

export const useAPIStore = defineStore('api', {
  state: () => ({
    modelOptions: ['GPT-3.5-turbo', 'GPT-4'],
    model: 'GPT-3.5-turbo',
    temperatureOptions: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
    temperature: 0.7
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
