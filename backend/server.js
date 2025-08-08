import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './db.js';   // ✅ usa o pool centralizado

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 🔐 Token
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
    res.json({ token: response.data.accessToken });
  } catch (err) {
    console.error('❌ /api/token:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🧾 Gera/recicla report (salva só o id)
app.post('/api/report', async (req, res) => {
  const { token, cnpj, policyId } = req.body;

  try {
    // verifica reaproveitamento nos últimos 90 dias
    const [rows] = await pool.execute(
      `SELECT report_id, created_at 
         FROM cnpj_reports 
        WHERE cnpj = ? AND created_at > NOW() - INTERVAL 90 DAY
        ORDER BY created_at DESC
        LIMIT 1`,
      [cnpj]
    );

    if (rows.length > 0) {
      return res.json({ reused: true, reportId: rows[0].report_id });
    }

    // gera novo relatório na Gyra+
    const response = await axios.post(
      'https://gyra-core.gyramais.com.br/report',
      { document: cnpj, policyId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const reportId = response.data.id;

    // insere/atualiza (garanta UNIQUE(cnpj) na tabela)
    await pool.execute(
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

// 🔎 Busca um report na Gyra+ pelo id salvo
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
    console.error('❌ /api/report/:id', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

// 📃 Lista ids salvos
app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, cnpj, report_id, created_at FROM cnpj_reports ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/reports:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 💡 encerra pool com elegância
const shutdown = async () => {
  try {
    await pool.end();
  } finally {
    process.exit(0);
  }
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.listen(3001, () => {
  console.log('✅ Backend API ready at http://localhost:3001');
});
