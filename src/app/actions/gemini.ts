"use server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const listModels = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-robotics-er-1.5-preview",
];

export async function getWordDetails(word: string, level: string = "B1") {
  const prompt = `Act as an expert English teacher. 
  Translate the English word or phrase "${word}" into Ukrainian. 
  Provide a concise Ukrainian translation. 
  Create one natural example sentence in English using this word, suitable for a ${level} learner.
  
  Return ONLY a valid JSON object:
  {
    "translation": "Ukrainian translation",
    "example": "English example sentence"
  }`;

  for (const modelId of listModels) {
    try {
      console.log(`📡 Спроба запиту до моделі: ${modelId} для слова: ${word}`);

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
      });

      const text = response.text;

      if (text) {
        console.log(`✅ Успішно отримано через: ${modelId}`);
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    } catch (error: unknown) {
      let status: number | undefined;

      if (error && typeof error === "object" && "status" in error) {
        status = (error as { status: number }).status;
      } else if (error && typeof error === "object" && "error" in error) {
        status = (error as { error: { code: number } }).error?.code;
      }

      if (status === 429 || status === 404) {
        console.warn(
          `⚠️ Модель ${modelId} недоступна (Статус: ${status}), перемикаюсь...`,
        );
        continue;
      }
      console.error(
        `❌ Помилка моделі ${modelId}:`,
        error instanceof Error ? error.message : error,
      );
      break;
    }
  }

  console.error("🚫 Всі доступні моделі вичерпали ліміти або недоступні.");
  return null;
}
