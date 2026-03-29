import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios"; // ✅ CHANGE

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/api/decode", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: model || "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      result: response.data.choices?.[0]?.message?.content || ""
    });

  } catch (e) {
    console.log("ERROR:", e.message);
    res.status(500).json({ error: "Backend error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});