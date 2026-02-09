"use client";
import { ButtonAddWord } from "@/components/ButtonAddWord/ButtonAddWord";
import { ModalAddWord } from "@/components/ModalAddWord/ModalAddWord";
import { WordActions } from "@/components/WordActions/WordActions";
import { Word } from "@prisma/client";
import { BookOpenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateEnglishLevel } from "../actions/user";

interface WordsClientProps {
  words: Word[];
  userId: string;
  initialLevel: string;
}

export default function WordsClient({
  words,
  userId,
  initialLevel = "B1",
}: WordsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [filter, setFilter] = useState<"all" | "learning" | "learned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [englishLevel, setEnglishLevel] = useState(initialLevel);
  const [isLevelUpdating, setIsLevelUpdating] = useState(false);

  const router = useRouter();

  const filteredWords = words.filter((word) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "learned"
          ? word.isLearned
          : !word.isLearned;
    const matchesSearch =
      word.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAdd = () => {
    setEditingWord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setIsModalOpen(true);
  };

  const handleLevelChange = async (newLevel: string) => {
    setIsLevelUpdating(true);
    setEnglishLevel(newLevel);
    await updateEnglishLevel(userId, newLevel);
    setIsLevelUpdating(false);
  };

  const toggleStatus = async (word: Word) => {
    try {
      const response = await fetch("api/words", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          id: word.id,
          isLearned: !word.isLearned,
        }),
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error status change:", error);
    }
  };

  return (
    <>
      {/* Header — ТУТ БУЛА ПОМИЛКА ВКЛАДЕНОСТІ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpenIcon className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
            Мій Словник
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Вибір рівня */}
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">
                Рівень:
              </span>
              <select
                value={englishLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                disabled={isLevelUpdating}
                className="text-sm font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-blue-700 p-0"
              >
                {["А0", "A1", "A2", "B1", "B2", "C1"].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Всього:{" "}
              <span className="text-gray-900">{filteredWords.length} слів</span>
            </p>
          </div>
        </div>

        {/* Контейнер для кнопки, щоб вона займала всю ширину на мобільних */}
        <div className="w-full sm:w-auto">
          <ButtonAddWord handleAdd={handleAdd} />
        </div>
      </div>

      {/* Пошук */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Пошук слова або перекладу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-gray-900 w-full p-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Фільтри */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${filter === "all" ? "bg-white shadow-md text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Всі ({words.length})
        </button>
        <button
          onClick={() => setFilter("learning")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${filter === "learning" ? "bg-white shadow-md text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Вивчаю ({words.filter((w) => !w.isLearned).length})
        </button>
        <button
          onClick={() => setFilter("learned")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${filter === "learned" ? "bg-white shadow-md text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Вивчено ({words.filter((w) => w.isLearned).length})
        </button>
      </div>

      {/* Grid зі словами */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <WordActions word={word} onEdit={handleEdit} />
            </div>

            <div className="flex-grow">
              <div className="mb-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  EN
                </span>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  {word.original}
                </h2>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                  UA
                </span>
                <p className="text-lg text-gray-600 font-semibold">
                  {word.translation}
                </p>
              </div>

              {word.example && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border-l-4 border-blue-400">
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    {word.example}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
              <button
                onClick={() => toggleStatus(word)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-90 ${
                  word.isLearned
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                {word.isLearned ? "Вивчено" : "Вивчаю"}
              </button>
              <span className="text-gray-300 text-[10px] font-bold uppercase">
                {new Date(word.createdAt).toLocaleDateString("uk-UA")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ModalAddWord
          initialData={editingWord}
          onClose={() => {
            setIsModalOpen(false);
            setEditingWord(null);
          }}
          userId={userId}
          currentLevel={englishLevel}
        />
      )}

      {filteredWords.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium">
            Твій словник порожній. Час додати перше слово!
          </p>
        </div>
      )}
    </>
  );
}
