"use client";
import { Flashcard } from "@/components/FlashCard/FlashCard";
import { Word } from "@prisma/client";
import { markAsLearnedAction } from "../actions/words";
import { useState } from "react";
interface FlashcardsClientProps {
  initialWords: Word[]; // Вказуємо, що це масив об'єктів типу Word
}
export default function FlashcardsClient({
  initialWords,
}: FlashcardsClientProps) {
  const [words, setWords] = useState<Word[]>(initialWords);

  const handleMarkLearned = async (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));

    await markAsLearnedAction(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {words.map((word) => (
        <Flashcard
          key={word.id}
          id={word.id}
          original={word.original}
          translation={word.translation}
          example={word.example || ""}
          onMarkLearned={handleMarkLearned}
        />
      ))}
    </div>
  );
}
