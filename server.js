const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // 
app.use(express.json());

// 
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-26422a8ba2ec49d3aeb9be200851c4d0";

app.post('/janitor-proxy', async (req, res) => {
  try {
    const { messages } = req.body;

    const deepseekResponse = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    //
    res.json({
      reply: deepseekResponse.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Ошибка прокси:", error.response?.data || error.message);
    res.status(500).json({ error: "Ошибка прокси" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Прокси работает на порту ${PORT}!`));
