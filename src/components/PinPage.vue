<template>
  <div class="pin-page">
    <h2>Digite o PIN de acesso</h2>
    <input v-model="pin" type="password" placeholder="PIN" />
    <button @click="validatePin">Entrar</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'PinPage',
  data() {
    return {
      pin: '',
      error: ''
    };
  },
  methods: {
    validatePin() {
  if (this.pin === 'Creditogp@123') {
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('accessGranted', 'true');
        localStorage.setItem('accessExpiresAt', expiresAt.toString());
        this.$router.push('/motorcredito/credito');
    } else {
        this.error = 'PIN inválido';
    }
    }
  }
}
</script>

<style scoped>
.pin-page {
  max-width: 400px;
  margin: auto;
  padding: 40px;
  background-color: #0d1b2a;
  color: white;
  border-radius: 12px;
  text-align: center;
}
input {
  padding: 10px;
  font-size: 18px;
  width: 92%;
  margin-bottom: 12px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #0072ff;
  color: white;
  border: none;
  border-radius: 6px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
