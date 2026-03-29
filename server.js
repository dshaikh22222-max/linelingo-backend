import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/decode", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(400).json({ error: "AI response invalid" });
    }

    res.json({
      result: data.choices[0].message.content,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 IMPORTANT
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});