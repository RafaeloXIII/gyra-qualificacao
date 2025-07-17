<template>
  <div id="app" class="background">
    <QualificarCliente />
  </div>
</template>

<style scoped>
.background {
  background-image: url('@/assets/herring-gull-2494975_960_720-637017194.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
  color: black; /* optional if image is dark */
}
</style>
<script setup>
import QualificarCliente from './components/QualificarCliente.vue'
</script>
