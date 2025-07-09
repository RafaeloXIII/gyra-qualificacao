<template>
  <div class="container">
    <h2>Qualificação de Cliente - Gyra+</h2>
    <form @submit.prevent="analisarCredito">
      <div>
        <label>Nome:</label>
        <input v-model="nome" required />
      </div>
      <div>
        <label>CPF:</label>
        <input v-model="cpf" required />
      </div>
      <div>
        <label>Renda:</label>
        <input v-model.number="renda" type="number" required />
      </div>
      <div>
        <label>Valor do Pedido:</label>
        <input v-model.number="valor_pedido" type="number" required />
      </div>
      <button type="submit">Analisar Crédito</button>
    </form>

    <div v-if="resultado">
      <h3>Resultado:</h3>
      <p><strong>Status:</strong> {{ resultado.status }}</p>
      <p v-if="resultado.limite_aprovado"><strong>Limite aprovado:</strong> R$ {{ resultado.limite_aprovado }}</p>
      <p v-if="resultado.mensagem"><strong>Mensagem:</strong> {{ resultado.mensagem }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nome: '',
      cpf: '',
      renda: null,
      valor_pedido: null,
      resultado: null
    }
  },
  methods: {
    async analisarCredito() {
      // Substitua a URL e header abaixo conforme sua documentação e autenticação
      const url = 'https://api.gyramais.com/v1/credit/analysis';
      try {
        const response = await axios.post(url, {
          nome: this.nome,
          cpf: this.cpf,
          renda: this.renda,
          valor_pedido: this.valor_pedido
        }, {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer SEU_TOKEN_AQUI', // se for necessário
          }
        });
        this.resultado = response.data;
      } catch (err) {
        this.resultado = { status: 'erro', mensagem: err.response?.data?.mensagem || 'Erro na análise.' };
      }
    }
  }
}
</script>

<style>
.container {
  max-width: 400px;
  margin: 30px auto;
  padding: 2em;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}
input, button {
  margin: 0.3em 0;
  width: 100%;
  padding: 0.7em;
}
button {
  background: #36a2eb;
  color: #fff;
  border: none;
  border-radius: 5px;
}
</style>
