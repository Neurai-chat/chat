export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const userMessage = req.body.message;

  // valódi memória
  global.history = global.history || [
    {
      role: "system",
      content: "You are Neurai, a friendly, casual AI assistant."
    }
  ];

  // user üzenet hozzáadása
  global.history.push({ role: "user", content: userMessage });

  // elküldjük a teljes history-t a modellnek
  const response = await fetch("https://pulse-proxy-3n26.onrender.com/chat
", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.YOUR_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-oss-20b",
      messages: global.history
    })
  });

  const data = await response.json();

  const aiMessage = data.choices?.[0]?.message?.content || "Hiba történt.";

  // AI válasz hozzáadása a memóriához
  global.history.push({ role: "assistant", content: aiMessage });

  res.status(200).json({ reply: aiMessage });
}
