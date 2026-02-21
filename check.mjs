// check.mjs
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("🔍 Probando llave...");

try {
  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    console.error("❌ ERROR DETECTADO:", data.error.message);
    console.log("👉 CAUSA PROBABLE: No has habilitado la 'Generative Language API' en tu proyecto de Google Cloud.");
  } else {
    console.log("✅ ¡Conexión exitosa! Tu llave sí funciona.");
    console.log("📋 Modelos disponibles para ti:");
    // Filtramos para mostrar solo los nombres limpios
    const names = data.models.map(m => m.name.replace('models/', ''));
    console.log(names);
  }
} catch (error) {
  console.error("❌ Error de conexión:", error);
}