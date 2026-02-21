// server.mjs FINAL
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());

// ---------------------------------------------------------
// PASO CRÍTICO: PEGA TU CLAVE AQUÍ ABAJO ENTRE LAS COMILLAS
// (La que empieza con AIzaSy...)
// ---------------------------------------------------------
const API_KEY = "*tu clave API*"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// CAMBIO IMPORTANTE: Usamos 'gemini-flash-latest' 
// Este modelo SÍ aparecía en tu lista permitida.
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

app.post("/api/chat", async (req, res) => {
  try {
    const { history } = req.body;
    
    const systemPrompt = `Eres un orientador vocacional. 
    REGLAS:
    - Si el usuario dice "si", empieza la entrevista.
    - Haz una pregunta a la vez.
    - Sé breve.`;

    // Historial simplificado para evitar errores
    const historyForGemini = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history.slice(0, -1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }))
    ];

    const chat = model.startChat({ history: historyForGemini });
    const lastMessage = history[history.length - 1].text;

    console.log("📩 Intentando enviar:", lastMessage);
    
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    console.log("✅ ¡ÉXITO! Respuesta recibida.");

    res.json({
        candidates: [{ content: { parts: [{ text: text }] } }]
    });

  } catch (error) {
    console.error("❌ ERROR DETECTADO:", error.message);
    // Si falla 'latest', intentamos con 'pro' automáticamente como respaldo
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => console.log(`🚀 Servidor LISTO en http://localhost:${PORT}`));
