<template>
  <div>
    <div v-for="(message, index) in messages" :key="index">
      <p><strong>{{ message.role }}:</strong> {{ message.content }}</p>
    </div>
    <input v-model="userMessage" placeholder="Type a message..." />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userMessage: '',
      messages: [
        {
          role: 'system',
          content: 'You are talking to GPT-4',
        },
      ],
    };
  },
  methods: {
    async sendMessage() {
      if (this.userMessage.trim() !== '') {
        this.messages.push({
          role: 'user',
          content: this.userMessage,
        });

        const response = await axios.post('http://localhost:3000/chat', {
          message: this.userMessage,
        });

        this.messages.push({
          role: 'assistant',
          content: response.data.message,
        });

        this.userMessage = '';
      }
    },
  },
};
</script>
