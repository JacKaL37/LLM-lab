<template>
    <div class="message" :class="message.role">
        <strong>{{ message.role }}:</strong>
        <span v-html="renderMarkdown(message.content)"></span>
    </div>
</template>
  
<script>
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default {
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    methods: {
        renderMarkdown(markdownString) {
            return md.render(markdownString);
        }
    }
};
</script>
  
  
<style scoped>
.message {
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid;
  border-radius: 10px;
  color: white;
  font-size: 12pt;
  font-family: roboto;
  /*white-space: pre-wrap;*/
}

.message ::v-deep{
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
}

.message.user {
  align-self: flex-end;
  background-color: #200820;
  color: #ff60ff;
  border-bottom-right-radius: 0;
}

.message.assistant {
  align-self: flex-start;
  background-color: #0e2324;
  color: #57f9ff;
  border-bottom-left-radius: 0;
}
</style>
  