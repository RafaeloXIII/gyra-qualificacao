<template>
  <div class="duplo-layout">
    <div class="home-container">
      <h2>Relatórios Salvos</h2>
      <ul class="report-list">
        <li v-for="report in reports" :key="report.id">
            <button @click="loadReport(report.report_id)" class="report-button" :class="{ 'report-button--active': selectedReportId === report.report_id }">
                <strong>CNPJ:</strong> {{ report.cnpj }}<br />
                <strong>ID:</strong> {{ report.report_id }}<br />
                <small>{{ formatDate(report.created_at) }}</small>
            </button>
        </li>
      </ul>
    </div>

    <div class="info-panel" v-if="loadingReport">
        <p>🔄 Buscando relatório... aguarde.</p>
    </div>
    <div class="info-panel" v-if="!loadingReport && fullReport">
      <h3>Status Geral: {{ translateStatus(fullReport.status?.value) }}</h3>

      <div v-if="risks.length">
        <h4>Riscos:</h4>
        <ul>
          <li v-for="(risk, index) in risks" :key="index">{{ risk }}</li>
        </ul>
      </div>

      <div v-if="rules.length">
        <h4>Regras da Política:</h4>
        <ul>
          <li v-for="(rule, index) in rules" :key="index">
            <strong>{{ rule.description }}</strong> — <em>{{ rule.status }}</em>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
data() {
    return {
        reports: [],
        fullReport: null,
        rules: [],
        risks: [],
        lastRequestTime: null, // ⏱️ controle da última consulta
        cooldownSeconds: 1,
        selectedReportId: null,
        loadingReport: false
    };
},
  methods: {
    async loadReports() {
      const res = await axios.get('http://localhost:3001/api/reports');
      this.reports = res.data;
    },

    async loadReport(id) {
    const now = Date.now();

    // ⚠️ 
    if (this.lastRequestTime && now - this.lastRequestTime < this.cooldownSeconds * 1000) {
        const waitTime = Math.ceil((this.cooldownSeconds * 1000 - (now - this.lastRequestTime)) / 1000);
        alert(`⏳ Aguarde ${waitTime} segundos para fazer outra consulta.`);
        return;
    }

    this.selectedReportId = id;
    this.lastRequestTime = now; 
    this.loadingReport = true; 

    try {
        const tokenRes = await axios.post('http://localhost:3001/api/token');
        const token = tokenRes.data.token;

        const res = await axios.get(`http://localhost:3001/api/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });

        this.fullReport = res.data;
        this.extractInfo(res.data);

    } catch (err) {
        console.error('Erro ao carregar relatório:', err);
    } finally{
        this.loadingReport = false; 
    }
    },
    extractInfo(report) {
      this.rules = [];
      this.risks = [];
      const sections = report.sections || [];

      const ruleSet = new Set();
      const riskSet = new Set();

      sections.forEach(section => {
        (section.sectionDetails || []).forEach(detail => {
          const values = detail.values || {};

          if (values.risk) riskSet.add(values.risk);

          (values.policyRuleGroupResults || []).forEach(group => {
            (group.policyRuleResultJoins || []).forEach(join => {
              (join.policyRuleResults || []).forEach(rule => {
                if (rule.status?.key === 'ALERT' || rule.status?.key === 'DENIED') {
                  ruleSet.add(JSON.stringify({
                    description: rule.descriptions?.replace(/\{\{.*?\}\}/g, '').trim(),
                    status: rule.status?.value
                  }));
                }
              });
            });
          });
        });
      });

      this.risks = Array.from(riskSet);
      this.rules = Array.from(ruleSet).map(r => JSON.parse(r));
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    },
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
    }
  },
  mounted() {
    this.loadReports();
  }
};
</script>

<style src="@/assets/styles/credito.css"></style>
