<template>
  <div>
    <button @click="show = true" class="info-button" title="Como funciona o Motor de Crédito">
      ℹ️
    </button>

    <div v-if="show" class="modal-overlay" @click.self="show = false">
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

        <button class="close-button" @click="show = false">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoModal',
  data() {
    return {
      show: false
    };
  }
};
</script>

<style scoped>
.info-button {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #1b263b;
  color: white;
  font-size: 20px;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 999;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  text-align: left;
}

.modal-content h2, h3 {
  margin-top: 16px;
  color: #0d1b2a;
}

.modal-content p, li {
  color: #333;
}

.close-button {
  margin-top: 24px;
  background-color: #0072ff;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
