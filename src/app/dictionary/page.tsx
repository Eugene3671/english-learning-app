import { db } from "@/lib/db";

import { auth, signIn, signOut } from "@/auth";
import WordsClient from "./WordsClient";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Мій Словник</h1>
          <p className="text-gray-600 mb-8">
            Будь ласка, увійдіть через Google, щоб почати вивчати англійські
            слова.
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
  const [user, words] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { englishLevel: true }, // Беремо тільки потрібне поле
    }),
    db.word.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-100"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
              Вийти
            </button>
          </form>
        </div>
        <WordsClient
          words={words}
          userId={session.user.id}
          initialLevel={user?.englishLevel || "B1"}
        />
      </div>
    </main>
  );
}
