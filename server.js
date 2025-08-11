const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-26422a8ba2ec49d3aeb9be200851c4d0";

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const deepseekResponse = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",  
        messages: req.body.messages,
        temperature: req.body.temperature || 0.7,
        max_tokens: req.body.max_tokens || 2000,
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
      id: "chatcmpl-" + Math.random().toString(36).substring(2),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "gpt-4",  // Притворяемся GPT-4
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: deepseekResponse.data.choices[0].message.content,
        },
        finish_reason: "stop",
      }],
      usage: {
        prompt_tokens: 0,  //
        completion_tokens: 0,
        total_tokens: 0,
      },
    });

  } catch (error) {
    console.error("Ошибка прокси:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 
app.get('/', (req, res) => {
  res.send
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
