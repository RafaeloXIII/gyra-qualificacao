<template>
  <div id="app" class="background">
    <InfoModal />
    <router-view />
  </div>
</template>

<script>
import InfoModal from './components/InfoModal.vue';

export default {
  name: 'App',
  components: {
    InfoModal
  }
};
</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
}
</style>

<style scoped>
.background {
  /* background-image: url('@/assets/Gaivota3_0.png'); */
  background-color: #13284a;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
  color: black; 
}
</style>

