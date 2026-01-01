import { defineStore } from 'pinia';

export const useAPIStore = defineStore('api', {
  state: () => ({
    model:
    {
      name: 'gemini-2.5-flash-preview-05-20',
      model: 'gemini-2.5-flash-preview-05-20',
      icon: 'gemini.svg',
    },
    temperatureOptions: Array.from({ length: 21 }, (_, index) => 2.0 - (index * 0.1)),
    temperature: 1
  })
});


// export const useChatStore = defineStore('chat', {
//   state: () => ({
//     systemPrompt: '',
//     messages: [],
//     maxMessageNum: 100
//   }),
//   getters: {
//     lastMessage() {
//       return this.messages[this.messages.length - 1];
//     }
//   },
//   actions: {
//     addMessage(message) {
//       this.messages.push(message);
//       if (this.messages.length > this.maxMessageNum) {
//         this.messages.shift();
//       }
//     }
//   }
// });