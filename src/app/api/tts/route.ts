import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");

  if (!text) return new Response("No text provided", { status: 400 });

  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;

  const response = await fetch(googleTtsUrl);

  // Пересилаємо аудіо-потік прямо в браузер
  return new Response(response.body, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
