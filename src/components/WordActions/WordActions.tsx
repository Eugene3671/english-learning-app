"use client";
import { Word } from "@prisma/client";
import { PencilIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
interface WordActionsProps {
  word: Word;
  onEdit: (word: Word) => void;
}
export function WordActions({ word, onEdit }: WordActionsProps) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm("Delete this word?")) return;
    const response = await fetch(`api/words?id=${word.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        className="p-2 text-red-400 hover:text-red-600 transition-colors"
      >
        <Trash2 size={18} />
      </button>
      <button
        onClick={() => onEdit(word)}
        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
      >
        <PencilIcon size={18} />
      </button>
    </>
  );
}
