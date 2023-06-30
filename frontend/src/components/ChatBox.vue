<template>
  <div class="chatbox">
    <div class="chathistory">
      <ChatMessage v-for="(message, index) in messages" :key="index" :message="message" />
    </div>
    
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
      this.$nextTick(() => {
        this.expandTextarea();
      });

      if (message !== '') {
        this.isSending = true;

        this.messages.push({
          role: 'user',
          content: message,
        });

        //const response = await axios.post('http://localhost:3000/chat', { 
        const response = await axios.post('http://104.229.89.14:3000/chat', { 
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
  padding: 10px;
  border-radius: 10px;
  background-color: #202020;
}

.chathistory {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 250px;
}

.input-area {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 20px;
  border-radius: 5px;
  background-color: #383838;
}

.input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  resize: none;
  outline: none;
  overflow: auto;
  background-color: #00000000;
  border-radius: 5px;
  font-size: 12pt;
  font-family: roboto;
  color: white;
  max-height: 320px;
  width: 50px;
}

.send-button {
  align-self: flex-end;
  width: 50px;
  height: 50px;
  border: none;
  color: white;
  background-color: #555555;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:disabled {
  opacity: 0.1
}
</style>