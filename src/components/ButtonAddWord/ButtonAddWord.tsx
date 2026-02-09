"use client";

export function ButtonAddWord({ handleAdd }: { handleAdd: () => void }) {
  return (
    <>
      <button
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14M5 12h14"></path>
        </svg>
        Додати слово
      </button>
    </>
  );
}
