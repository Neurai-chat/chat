import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// valódi memória
let history = [
  {
    role: "system",
    content: "You are Neurai, a friendly, casual AI assistant."
  }
];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // user üzenet hozzáadása
  history.push({ role: "user", content: userMessage });

  // elküldjük a teljes history-t a modellnek
  const response = await fetch("https://pulse-proxy-3n26.onrender.com/chat
", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
  
    },
    body: JSON.stringify({
      model: "gpt-oss-20b",
      messages: history
    })
  });

  const data = await response.json();
  const aiText = data.choices[0].message.content;

  // AI válasz hozzáadása
  history.push({ role: "assistant", content: aiText });

  res.json({ reply: aiText });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));

