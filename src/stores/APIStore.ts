import { defineStore } from 'pinia';

export const useAPIStore = defineStore('api', {
  state: () => ({
    modelOptions: ['gpt-4-turbo', 'gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    model: 'gpt-3.5-turbo',
    temperatureOptions: Array.from({ length: 21 }, (_, index) => 2.0 - (index * 0.1)),
    temperature: 1
  })
});
