<template>
  <div class="chatbox">
    <div class="chathistory" ref="chathistory">
      <ChatMessage v-for="(message, index) in message_list" :key="index" :message="message" />
    </div>
    
    <div class="input-area">
      <textarea ref="textarea" v-model="userMessage" placeholder="send a message" :disabled="isSending" class="input"
        @keydown.enter.exact.prevent="sendMessage" @keydown.shift.enter.exact="allowNewline" @input="expandTextarea" />
      <button @click="sendMessage" :disabled="isSending" class="send-button">Send</button>
    </div>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue';

export default {
  components: {
    ChatMessage,
  },
  data() {
    return {
      userMessage: '',
      isSending: false,
      conversation_history: [],
      currentAIresponse: {role: "assistant", content:""},
      audioContext: new (window.AudioContext || window.webkitAudioContext)(),
      osc: this.audioContext,
      gainNode: null
    };
  },
  computed: {
      message_list(){
        if (this.currentAIresponse.content!=''){
          return this.conversation_history.concat({role:"assistant", content:this.currentAIresponse.content});
        }
        return this.conversation_history
      }
  },
  mounted() {
    // Connect to the WebSocket server on port 3001
    this.socket = new WebSocket('ws://104.229.89.14:3001');

    // Listen for incoming messages and handle them
    this.socket.onmessage = (event) => {
      const JSONmsg = JSON.parse(event.data);
      if(JSONmsg.type == "token"){
        this.currentAIresponse.content += JSONmsg.content;
        this.playTickSound();
        this.scrollCheck();
      } else if(JSONmsg.type == "aiResponse"){
        this.conversation_history.push({role:"assistant", content:JSONmsg.content});
        this.currentAIresponse.content = '';
        this.isSending = false;
        this.$nextTick(() => {
          this.$refs.textarea.focus();
        });
      }
    };
  },
  methods: {
    // Other methods stay the same
    async sendMessage() {
      const message = this.userMessage.trim();
      this.userMessage = '';

      if (message !== '') {
        this.scrollCheck();
        this.expandTextarea();

        this.isSending = true;

        this.conversation_history.push({
          role: 'user',
          content: message,
        });

        // Send the message over WebSocket
        this.socket.send(JSON.stringify({ message: message }));
      }
    },
    scrollCheck() {
    // this gets the .chathistory div
      const chatHistory = this.$refs.chathistory;
    
      // check if .chathistory scroll was already at the bottom
      if (chatHistory.scrollTop + chatHistory.clientHeight === chatHistory.scrollHeight) {
        // if it was, wait for dom to update then scroll to new bottom 
        this.$nextTick(() => {
          chatHistory.scrollTop = chatHistory.scrollHeight;
        });
      }
      // if chat wasn't already at the bottom, don't do anything!
    },
    allowNewline() {
      // Do nothing
    },
    expandTextarea() {
      this.$nextTick(() => {
        this.$refs.textarea.style.height = 'auto';
        const scrollHeight = this.$refs.textarea.scrollHeight;
        const verticalPadding = 2 * 10; // 2 * padding-top
        this.$refs.textarea.style.height = `${scrollHeight - verticalPadding}px`;
      })
    },
    playTickSound() {
        this.osc = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();
        this.osc.frequency.value = 200;
        this.osc.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
      
        // Gain value starts from 0
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        // Gain value increases to 0.1 over 0.01 seconds (fade in)
        this.gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.02);
      
        this.osc.start(this.audioContext.currentTime);
        
        // Gain value decreases to 0 over 0.01 seconds (fade out)
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.02);
      
        this.osc.stop(this.audioContext.currentTime + 0.04);
    },
    playGloppySound() {
      this.osc = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      this.osc.type = 'sine';  // you can experiment with 'sine', 'square', 'sawtooth', 'triangle' 
      this.osc.frequency.setValueAtTime(200, this.audioContext.currentTime);  

      // create a frequency ramp that goes up and down
      this.osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.01); 
      this.osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.02);

      this.gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime); 

      // add some fade-in and fade-out to the glop
      this.gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.02);

      this.osc.start(this.audioContext.currentTime);
      this.osc.stop(this.audioContext.currentTime + 0.04);
    }
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
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #202020;
  font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.chathistory {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 250px;
  max-height: 500px; 
  overflow: auto;
}

.chathistory::-webkit-scrollbar {
    width: 4px;
    height: 8px;
}

.chathistory::-webkit-scrollbar-track {
    background: transparent;
}

.chathistory::-webkit-scrollbar-thumb {
    background-color: rgba(125, 125, 125, 0.7);
    border-radius: 4px;
}

.input-area {
  display: flex;
  flex-direction: row;
  align-items: stretch;
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
  background-color: #383838;
  border-radius: 20px;
  font-size: 12pt;
  font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  color: white;
  max-height: 320px;
  width: 50px;
  padding: 16px;
}

.send-button {
  align-self: stretch;
  width: 70px;
  border: none;
  color: white;
  background-color: #555555;
  border-radius: 5px;
  cursor: pointer;
}

.input:disabled, .send-button:disabled {
  opacity: 0.1
}




</style>