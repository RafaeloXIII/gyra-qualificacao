import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); 

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
  try {
    const { token, cnpj, policyId } = req.body;
    const resp = await axios.post(
      'https://gyra-core.gyramais.com.br/report',
      { document: cnpj, policyId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(resp.data);
  } catch (err) {
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

app.listen(3001, () => {
  console.log('✅ Backend API ready at http://localhost:3001');
});
