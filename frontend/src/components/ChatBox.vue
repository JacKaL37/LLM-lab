<template>
  <div class="chatbox">
    <ChatMessage v-for="(message, index) in messages" :key="index" :message="message" />
    <div class="input-area">
      <textarea ref="textarea" v-model="userMessage" placeholder="send a message" :disabled="isSending" class="input"
        @keydown.enter.exact.prevent="sendMessage" @keydown.shift.enter.exact="allowNewline" @input="expandTextarea" />
      <button @click="sendMessage" :disabled="isSending" class="send-button">Send</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ChatMessage from './ChatMessage.vue'


export default {
  components: {
    ChatMessage,
  },
  data() {
    return {
      userMessage: '',
      isSending: false,
      messages: [
      ],
    };
  },
  methods: {
    allowNewline() {
      // Do nothing
    },
    expandTextarea() {
      this.$refs.textarea.style.height = 'auto';
      const scrollHeight = this.$refs.textarea.scrollHeight;
      const verticalPadding = 2 * 10; // 2 * padding-top
      this.$refs.textarea.style.height = `${scrollHeight - verticalPadding}px`;
    },
    async sendMessage() {
      const message = this.userMessage.trim();
      this.userMessage = '';
      this.expandTextarea();

      if (message !== '') {
        this.isSending = true;

        this.messages.push({
          role: 'user',
          content: message,
        });

        const response = await axios.post('http://localhost:3000/chat', {
          message: message,
        });

        this.messages.push({
          role: 'assistant',
          content: response.data.message,
        });

        this.isSending = false;
      }
    },
  },
};
</script>

<style scoped>
.chatbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.input-area {
  position: relative; 
  display: flex;
  width: 100%;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  resize: none;
  outline: none;
  overflow: auto;
  max-height: 320px;
}

.send-button {
  position: absolute;
  right: 0;
  bottom: 0;

  width: 50px;
  height: 50px;
  border: none;
  color: white;
  background-color: #007BFF;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #ccc;
}
</style>