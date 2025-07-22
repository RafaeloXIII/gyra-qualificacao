<template>
  <div id="app" class="background">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

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

