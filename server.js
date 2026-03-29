import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ IMPORTANT — ROOT ROUTE (ye missing tha)
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

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

    res.json({
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Backend error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});