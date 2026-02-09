import { getWordDetails } from "@/app/actions/gemini";
import { Word } from "@prisma/client";
import { AlertCircleIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModalAddWordProps {
  onClose: () => void;
  initialData?: Word | null;
  userId: string;
  currentLevel: string;
}

export function ModalAddWord({
  onClose,
  initialData,
  userId,
  currentLevel,
}: ModalAddWordProps) {
  const [original, setOriginal] = useState(initialData?.original || "");
  const [translation, setTranslation] = useState(
    initialData?.translation || "",
  );
  const [example, setExample] = useState(initialData?.example || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneratedWord, setLastGeneratedWord] = useState("");
  const router = useRouter();

  const checkDuplicate = async (word: string) => {
    const res = await fetch("/api/words/check", {
      method: "POST",
      body: JSON.stringify({ original: word, userId }),
    });
    const data = await res.json();
    return data.exists;
  };
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    if (!initialData) {
      const exists = await checkDuplicate(original);
      if (exists) {
        setError("Це слово вже є у словнику");
        return;
      }
    }
    const isEditing = !!initialData?.id;
    const url = "/api/words";
    const methods = isEditing ? "PATCH" : "POST";
    try {
      const response = await fetch(url, {
        method: methods,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialData?.id,
          original: original,
          translation: translation,
          example: example,
          userId: userId,
          isLearned: initialData?.isLearned ?? false,
        }),
      });
      if (response.ok) {
        setOriginal("");
        setTranslation("");
        setExample("");
        router.refresh();
        onClose();
      } else {
        console.error("Error saving");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  }
  const handleMagicFill = async () => {
    if (!original || original.trim().toLowerCase() === lastGeneratedWord)
      return;
    setError(null);
    setIsGenerating(true);

    try {
      const cleanWord = original.trim().toLowerCase();
      const exists = await checkDuplicate(cleanWord);
      if (exists && !initialData) {
        setError("Це слово вже є у твоєму словнику");
        setIsGenerating(false);
        return;
      }
      const data = await getWordDetails(cleanWord, currentLevel);
      if (data) {
        setTranslation(data.translation);
        setExample(data.example);
        setLastGeneratedWord(cleanWord);
      }
    } catch (error) {
      console.error("Помилка генерації:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Додати нове слово
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Англійське слово */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Англійське слово
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={original}
                  onChange={(e) => {
                    setOriginal(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                  placeholder="Наприклад: resilient"
                />
                {/* Кнопка Магії ✨ */}
                <button
                  type="button"
                  onClick={handleMagicFill}
                  disabled={
                    isGenerating ||
                    !original ||
                    original.trim().toLowerCase() === lastGeneratedWord
                  }
                  className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  {isGenerating ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      <span className="text-xs font-bold">Magic</span>
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-2 animate-in slide-in-from-top-1">
                  <AlertCircleIcon className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Переклад
              </label>
              <input
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                type="text"
                placeholder="Наприклад: Стійкість"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Приклад (необовязково)
              </label>
              <textarea
                value={example}
                onChange={(e) => setExample(e.target.value)}
                rows={3}
                placeholder="She showed great resilience during the crisis."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                type="button"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
              >
                Зберегти
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
