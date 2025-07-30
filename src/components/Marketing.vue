<template>
  <div class="duplo-layout">
    <!-- FORMULÁRIO PRINCIPAL -->
    <div class="home-container">
      <h2>Consulta de Cliente</h2>

      <form @submit.prevent="handleCNPJSearch">
        <input v-model="cnpj" id="cnpj" placeholder="Digite o CNPJ" required />

        <button type="submit" :disabled="loading">
          {{ loading ? "Consultando..." : "Consultar" }}
        </button>
      </form>

      <div class="consulta-info with-icon">
        <img src="@/assets/Verify-icon.png" alt="Verificado" class="icon-verificado" />
        <span>
          Os resultados das consultas são baseados nas políticas de crédito da GP e nos dados dos principais bureaus de crédito e inteligência artificial do mercado.
        </span>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
    </div>


    <div class="info-panel" v-if="mainStatus || riskInfo.length || policySummaries.length">
      <h3>Status Geral:</h3>
      <p><strong>{{ translateStatus(mainStatus) }}</strong></p>

      <div v-if="riskInfo.length">
        <h4>Detalhes de Risco:</h4>
        <ul>
          <li v-for="(risk, index) in riskInfo" :key="index"> {{ risk }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
name: 'MarketingPage',
data() {
  return {
    cnpj: '',              
    loading: false,        
    error: '',             
    report: null,          
    mainStatus: '',        
    policySummaries: [],
    riskInfo: []
  };
},
methods: {

  translateStatus(status) {
    const map = {
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
      ALERT: 'Alerta',
      DENIED: 'Negado',
      PENDING: 'Pendente, pressione "CONSULTAR" novamente em 30 segundos',
      NOT_EXECUTED: 'Não Processado',
      '': 'Desconhecido'
    };
    return map[status?.toUpperCase()] || status;
  },

  cleanDescription(text) {
  if (!text) return '';
  return text.replace(/\{\{.*?\}\}/g, '').trim();
  },
  async handleCNPJSearch() {
    this.loading = true;
    this.error = '';
    this.report = null;

    try {
      const tokenRes = await axios.post('http://192.168.87.87:3001/api/token');
      console.log('🟢 Token received:', tokenRes.data);
      const token = tokenRes.data.token;

      const reportRes = await axios.post('http://192.168.87.87:3001/api/report', {
        token,
        cnpj: this.cnpj,
        policyId: process.env.VUE_APP_GYRA_POLICY_ID
      });

      console.log('📄 Report created:', reportRes.data);
      const reportId = reportRes.data.id || reportRes.data.reportId;

      const fullReport = await axios.get(
        `http://192.168.87.87:3001/api/report/${reportId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("📦 Relatório completo:", fullReport.data);
      this.report = fullReport.data;
      this.mainStatus = fullReport.data.status?.value || 'Sem status';
      const sections = fullReport.data.sections || [];
      const extractedRules = [];
      let risks = new Set();

      sections.forEach(section => {
        (section.sectionDetails || []).forEach(detail => {
          const values = detail.values || {};

          if (values.risk) {
            risks.add(values.risk);
          }

          (values.policyRuleGroupResults || []).forEach(group => {
            (group.policyRuleResultJoins || []).forEach(join => {
              (join.policyRuleResults || []).forEach(rule => {
                if (rule.status?.key === 'DENIED' || rule.status?.key === 'ALERT'){
                  extractedRules.push({
                    description: rule.descriptions,
                    status: rule.status?.value
                  });
                }
              });
            });
          });
        });
      });

    this.riskInfo = Array.from(risks);
    this.policySummaries = extractedRules;
    } catch (err) {
      console.error('❌ Error in handleCNPJSearch:', err);
      this.error = err.response?.data?.error || err.message;
    } finally {
      this.loading = false;
    }
  }
}
};

</script>
<style src="@/assets/styles/credito.css"></style>
