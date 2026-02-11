"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, Volume2Icon } from "lucide-react";

interface FlashcardProps {
  id: string;
  original: string;
  translation: string;
  example: string;
  onMarkLearned: (id: string) => void; // Функція для видалення зі списку
}

export function Flashcard({
  id,
  original,
  translation,
  example,
  onMarkLearned,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Викликаємо твій власний API
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(original)}`);

    audio.play().catch((err) => {
      console.error("Помилка відтворення через Proxy:", err);
      // Фолбек на стандартний синтезатор, якщо проксі не спрацював
      const utterance = new SpeechSynthesisUtterance(original);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    });
  };

  return (
    <div className="relative w-full h-64 perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT: English Word */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-blue-50 rounded-3xl shadow-md flex flex-col items-center justify-center p-6">
          <button
            onClick={handleSpeak}
            className="absolute top-4 right-4 p-4 text-blue-400 hover:text-blue-600"
          >
            <Volume2Icon className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-gray-800 capitalize">
            {original}
          </h2>
          <p className="mt-4 text-xs text-gray-400">
            Клікни, щоб перевірити себе
          </p>
        </div>

        {/* BACK: Translation & Action */}
        <div
          className="absolute inset-0 backface-hidden bg-blue-600 rounded-3xl shadow-md flex flex-col items-center justify-between p-6 text-white"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold mb-2">{translation}</h3>
            <p className="text-sm text-blue-100 italic">{example}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkLearned(id);
            }}
            className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/30"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Знаю це слово
          </button>
        </div>
      </motion.div>
    </div>
  );
}
