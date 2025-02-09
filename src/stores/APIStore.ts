import { defineStore } from 'pinia';

export const useAPIStore = defineStore('api', {
  state: () => ({
    model:
    {
      name: 'GPT-4o',
      model: 'gpt-4o',
      icon: 'openai.svg',
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