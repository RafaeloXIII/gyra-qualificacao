import axios from 'axios';

// Read from .env (Vite: import.meta.env; Vue CLI: process.env)
const clientId = process.env.VUE_APP_GYRA_CLIENT_ID;
const clientSecret = process.env.VUE_APP_GYRA_CLIENT_SECRET;
const policyId = process.env.VUE_APP_GYRA_POLICY_ID;


// Axios instance (optional baseURL config)
const api = axios.create({
  baseURL: 'https://gyra-core.gyramais.com.br',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Step 1: Get Access Token
export async function getAccessToken() {
  const headers = {
    'gyra-client-id': clientId,
    'gyra-client-secret': clientSecret,
  };

  const response = await api.post('/auth/authenticate', {}, { headers });
  return response.data.token; // Adjust if token structure differs
}

// Step 2: Create Report
export async function createReport(token, cnpj) {
  const response = await api.post(
    '/report',
    {
      document: cnpj,
      policyId: policyId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.reportId || response.data.id; // use the correct key
}

// Step 3: Fetch Report Data
export async function fetchReport(token, reportId) {
  const response = await api.get(`/report/${reportId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
