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
  min-height: 100vh;
  width: 100vw;
  max-height: 100vh;
  margin: 0;
}

</style>