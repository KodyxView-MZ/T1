const express = require('express');
const axios = require('axios');

const app = express();

const API_KEY = "1858|i0VrA5Y6GR4qJ3CUypU4DNdHcgQyhxnR66YqvxIe4f49ec77";

app.get('/criar-pagamento', async (req, res) => {
  try {

    // Detecta automaticamente o domínio atual
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const response = await axios.post(
      'https://api.paysuite.tech/api/v1/payments',
      {
        amount: 100,
        currency: "MZN",
        reference: "PAY_" + Date.now(),
        return_url: `${baseUrl}/sucesso`,
        callback_url: `${baseUrl}/webhook`
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.redirect(response.data.checkout_url);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send("Erro ao criar pagamento");
  }
});

app.get('/sucesso', (req, res) => {
  res.send("Pagamento concluído!");
});

app.post('/webhook', express.json(), (req, res) => {
  console.log("Webhook recebido:", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Servidor rodando...");
});
