<template>
  <div class="home-page">
    <h2>Bem-vindo ao Motor de Crédito</h2>
    <ul>
      <li><router-link to="/motorcredito/credito">➡️ Consulta de Crédito</router-link></li>
      <li><router-link to="/motorcredito/marketing">➡️ Página de Marketing</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-page {
  max-width: 600px;
  margin: auto;
  padding: 24px;
  font-family: Arial, sans-serif;
  background-color: #0d1b2a;
  color: #8ecae6;
  border-radius: 12px;
}
h2 {
  color: white;
}
a {
  text-decoration: none;
  color: #8ecae6;
}
a:hover {
  text-decoration: underline;
}
</style>
