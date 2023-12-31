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
  align-self: center;
  justify-self: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
}

</style>