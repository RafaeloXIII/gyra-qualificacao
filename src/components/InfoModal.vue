<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Como funciona o Motor de Crédito</h2>

      <h3>O que é</h3>
      <p>
        O Motor de Crédito é uma ferramenta que analisa a saúde financeira de empresas de forma rápida e precisa.
        Basta informar o CNPJ da empresa, e nosso sistema faz todo o trabalho de análise para você.
      </p>

      <h3>Como funciona</h3>
      <p>
        Quando você insere um CNPJ, nossa ferramenta busca informações em diversas fontes confiáveis e bases de dados governamentais.
        Analisamos histórico financeiro, obrigações fiscais, processos judiciais e outros indicadores importantes.
      </p>

      <h3>O que avaliamos</h3>
      <ul>
        <li>Histórico de pagamentos</li>
        <li>Situação junto aos órgãos reguladores</li>
        <li>Processos judiciais relevantes</li>
        <li>Capacidade de pagamento</li>
        <li>Saúde financeira geral</li>
      </ul>

      <h3>O relatório</h3>
      <p>
        Após a análise, geramos um relatório completo com uma pontuação de crédito fácil de entender.
        Você recebe informações claras sobre os riscos e oportunidades, apresentadas em gráficos e dados visuais que facilitam a tomada de decisão.
      </p>

      <h3>Segurança</h3>
      <p>
        Todas as informações são tratadas com o máximo de segurança.
        Utilizamos criptografia avançada e seguimos rigorosos protocolos de proteção de dados para garantir a confidencialidade de todas as informações.
      </p>

      <button class="close-button" @click="$emit('close')">Fechar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #ffffff;
  color: #333;
  padding: 32px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  font-family: 'Montserrat', sans-serif;
  /* font-family: 'Montserrat', sans-serif; */
}

.modal-content h2 {
  margin-top: 0;
}

.close-button {
  margin-top: 20px;
  background-color: #0072ff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
