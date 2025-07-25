<template>
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

    <div v-if="mainStatus">
      <h3>Status Geral: {{ translateStatus(mainStatus) }}</h3>
    </div>
    <div v-if="riskInfo.length">
      <strong>Detalhes:</strong>
      <ul>
        <li v-for="(risk, index) in riskInfo" :key="index">
           {{ risk }}
        </li>
      </ul>
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
      PENDING: 'Pendente',
      NOT_EXECUTED: 'Não Processado',
      '': 'Desconhecido'
    };
    return map[status?.toUpperCase()] || status;
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
      // 👇 Pega o status principal
      this.mainStatus = fullReport.data.status?.value || 'Sem status';
          // ✅ Extrai todas as regras da política a partir do JSON aninhado
      const sections = fullReport.data.sections || [];
      const extractedRules = [];
      let risks = new Set();

      sections.forEach(section => {
        (section.sectionDetails || []).forEach(detail => {
          const values = detail.values || {};

          if (values.risk) {
            risks.add(values.risk);
          }
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

<style scoped>

input {
  display: block;
  width: 97%;
  margin-bottom: 12px;
  padding: 8px;
  font-size: 16px;
  border-radius: 6px;
}

.home-container {
  max-width: 600px;
  color: #8ecae6;
  margin: auto;
  padding: 24px;
  background-color: #0d1b2a; /* azul escuro */
  padding: 40px;
  border-radius: 12px;
}

.home-container h2 {
  font-size: 45px;
  color: white;
}

.home-container h3 {
  font-size: 25px;
  color: white;
}
.home-container li,
.home-container p {
  color: #8ecae6; 
}


button {
  padding: 10px 18px;
  font-size: 16px;
  background-color: #0072ff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background-color: #aaa;
}

.error {
  margin-top: 12px;
  color: red;
}

.resultado {
  margin-top: 24px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
}

.consulta-info.with-icon {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #1b263b;
  color: #8ecae6;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.icon-verificado {
  width: 70px;
  height: 70px;
}

.footer {
  margin-top: 40px;
  font-size: 13px;
  text-align: center;
  color: #8ecae6;
}
</style>