<template>
    <div class="chat-history-browser">
        <div class="exit-button" @click="$emit('closeChatBrowser')">❎</div>
        <div style="height:20px;"></div>
        <div class="reversed-list">
            <div class="conv-button" v-for="(conversation, index) in conversations" :key="index" @click="selectConversation(index)">
                <span class="preview-message" style="font-size: 12pt;">#{{ index + 1 }}</span>
                <span class="preview-message" v-if="conversation.length > 0"> {{conversation[0].role=="human"?"🧠":"🔮" }}:{{ conversation[0].content || "" }}</span>
                <span class="preview-message" v-if="conversation.length > 1"> {{conversation[1].role=="human"?"🧠":"🔮" }}:{{ conversation[1].content || "" }}</span>
                <span class="preview-message" v-if="conversation.length > 2 && conversation.length < 5"> {{conversation[2].role=="human"?"🧠":"🔮" }}:{{ conversation[2].content || "" }}</span>
                <span class="preview-message" v-if="conversation.length > 3 && conversation.length < 5"> {{conversation[3].role=="human"?"🧠":"🔮" }}:{{ conversation[3].content || "" }}</span>
                <span class="preview-message" v-if="conversation.length > 4"> … ⏳ … ⌛ … </span>
                <span class="preview-message" v-if="conversation.length > 4"> {{conversation[conversation.length-2].role=="human"?"🧠":"🔮" }}:{{ conversation[conversation.length-2].content || "" }}</span>
                <span class="preview-message" v-if="conversation.length > 4"> {{conversation[conversation.length-1].role=="human"?"🧠":"🔮" }}:{{ conversation[conversation.length-1].content || "" }}</span>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  props: {
    conversations: {
      type: Array,
      required: true
    }
  },
  methods: {
    selectConversation(index) {
      this.$emit('changeConversation', index);
    }
  }
};
</script>


<style scoped>
.chat-history-browser {
  position: fixed; /* Floats over interface */
  z-index: 1000;
  left: 0;
  top: 0;
  max-width: 350px; /* Adjust width as needed */
  width: 90%;
  height: 100%; /* Full height */
  background-color: #7631b6d4;
  border-radius: 10px;
  color: white;
  overflow-y: auto; /* Scrollable */
  padding: 1rem;
}

.conv-button {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin-bottom: 5px;
  background-color: black;
  border-width: 2px;
  border-color: #6d2fff;
  border-radius: 10px;
  padding: 10px;
}

.preview-message {
  color: white; /* Dark text for readability */
  font-size: 10pt;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.reversed-list {
  display: flex;
  flex-direction: column-reverse; /* Magic happens here */
  /* Additional styling as needed */
}

.exit-button {
    display: flex; 
    background: black;
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 16pt;
    border-width: 2px;
    border-color: #6d2fff;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    cursor: pointer;
}
</style>
