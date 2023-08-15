<template>
  <div id="app">
    <ChatBox />
  </div>
</template>

<script>
import ChatBox from './components/ChatBox.vue';

export default {
  name: 'App',
  components: {
    ChatBox,
  },
};
</script>

<style scoped>

#app{
  display: flex;
  flex-direction: column;
  height: 95vh;
  margin: 0 auto;
}

</style>