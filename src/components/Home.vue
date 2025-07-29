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


h1 {
  font-size: 45px;
  color: white;
  margin-bottom: 16px;
  font-family: 'Montserrat', sans-serif;
}

.subtitle {
  color: white;
  font-size: 18px;
  text-align: center;
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
  font-family: 'Montserrat', sans-serif;
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

</style>
