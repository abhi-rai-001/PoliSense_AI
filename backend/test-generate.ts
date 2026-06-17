import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  console.log("Testing gemini-2.5-flash...");
  try {
    const start = Date.now();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Hello",
    });
    console.log(`Success! Response: ${response.text}, took ${Date.now() - start}ms`);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
