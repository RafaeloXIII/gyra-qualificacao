import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); 

// DB connection
const db = await mysql.createConnection(process.env.DATABASE_URL);

app.post('/api/token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://gyra-core.gyramais.com.br/auth/authenticate',
      {},
      {
        headers: {
          'gyra-client-id': process.env.GYRA_CLIENT_ID,
          'gyra-client-secret': process.env.GYRA_CLIENT_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('🔐 GYRA+ token response:', response.data);

    // ✅ Only return the access token to the frontend
    res.json({ token: response.data.accessToken });

  } catch (err) {
    console.error('❌ Error /api/token:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/report', async (req, res) => {
  const { token, cnpj, policyId } = req.body;

  try {
    // 🔍 Verifica se já existe para esse CNPJ nos últimos 90 dias
    const [rows] = await db.execute(
      'SELECT report_id, created_at FROM cnpj_reports WHERE cnpj = ? AND created_at > NOW() - INTERVAL 90 DAY',
      [cnpj]
    );

    if (rows.length > 0) {
      console.log('♻️ Usando relatório já existente');
      return res.json({ reused: true, reportId: rows[0].report_id });
    }

    // 🚀 Gera novo relatório
    const response = await axios.post(
      'https://gyra-core.gyramais.com.br/report',
      { document: cnpj, policyId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const reportId = response.data.id;

    // 💾 Insere ou atualiza
    await db.execute(
      `INSERT INTO cnpj_reports (cnpj, report_id, created_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE report_id = VALUES(report_id), created_at = NOW()`,
      [cnpj, reportId]
    );

    res.json({ reused: false, reportId });

  } catch (err) {
    console.error('❌ /api/report:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/report/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const reportId = req.params.id;
    const resp = await axios.get(
      `https://gyra-core.gyramais.com.br/report/${reportId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM cnpj_reports ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/reports:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('✅ Backend API ready at http://localhost:3001');
});
