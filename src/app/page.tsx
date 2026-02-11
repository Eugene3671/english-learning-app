import Link from "next/link";
import { db } from "@/lib/db";
import { BookIcon, SparklesIcon, GraduationCapIcon } from "lucide-react";
import { auth, signIn } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  // 1. Екран для неавторизованого користувача
  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 font-mono tracking-tight">
            LingoFlow
          </h1>
          <p className="text-gray-600 mb-8">
            Твій персональний помічник для вивчення англійської. Увійди, щоб
            зберегти свій прогрес.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Увійти через Google
            </button>
          </form>
        </div>
      </main>
    );
  }
  const totalWords = await db.word.count({
    where: {
      userId: session.user.id,
    },
  });
  const learnedWords = await db.word.count({ where: { isLearned: true } });
  const toLearn = totalWords - learnedWords;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Привітання */}
      <header className="mb-12 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Привіт! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Твій шлях до рівня{" "}
          <span className="font-bold text-blue-600 text-xl">B1</span> триває.
          Сьогодні чудовий день, щоб вивчити кілька нових слів для майбутніх
          подорожей!
        </p>
      </header>

      {/* Картки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
            Всього слів
          </p>
          <p className="text-3xl font-black text-gray-900">{totalWords}</p>
        </div>
        <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white">
          <p className="text-sm text-blue-100 font-medium uppercase tracking-wider">
            Вивчено
          </p>
          <p className="text-3xl font-black">{learnedWords}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
            Залишилось
          </p>
          <p className="text-3xl font-black text-gray-900">{toLearn}</p>
        </div>
      </div>

      {/* Швидкі дії */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/dictionary" className="group">
          <div className="h-full bg-white p-8 rounded-3xl border-2 border-transparent hover:border-blue-500 transition-all shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookIcon className="text-blue-600 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Мій Словник</h2>
            <p className="text-gray-500">
              Додавай нові слова, редагуй переклади та керуй своїм списком.
            </p>
          </div>
        </Link>

        <Link href="/flashcards" className="group">
          <div className="h-full bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98]">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
              <SparklesIcon className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Тренування ✨</h2>
            <p className="text-blue-100">
              Перевіряй свої знання за допомогою флеш-карток. Тільки не вивчені
              слова!
            </p>
          </div>
        </Link>
      </div>

      {/* Мотиваційна фраза */}
      <footer className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-500">
          <GraduationCapIcon className="w-4 h-4" />
          <span>Крок за кроком до вільного спілкування!</span>
        </div>
      </footer>
    </div>
  );
}
