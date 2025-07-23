<template>
  <div class="home-container">
    <h1>Motor de Crédito 2025</h1>
    <p class="subtitle">
      Tempo médio de 30 segundos:
    </p>

    <div class="link-grid">
      <router-link to="/motorcredito/credito" class="link-box">
        📊 <span>Report - Análise de Crédito</span>
      </router-link>

      <router-link to="/motorcredito/marketing" class="link-box">
        📣 <span>Área do Marketing</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
  background-color: #131a2a;
  color: #8ecae6;
  text-align: center;
  border-radius: 12px;
  font-family: 'Montserrat', sans-serif;
}

h1 {
  font-size: 45px;
  color: white;
  margin-bottom: 16px;
}

.subtitle {
  color: white;
  font-size: 18px;
  margin-bottom: 32px;
}

.link-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.link-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: #1b263b;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 20px;
  transition: background-color 0.3s ease;
}

.link-box:hover {
  background-color: #415a77;
  color: #ffffff;
}

.link-box span {
  font-weight: 500;
}

.footer {
  margin-top: 48px;
  font-size: 15px;
  color: white;
  font-family: 'Roboto', sans-serif;
}
</style>
