"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, SparklesIcon, LayoutDashboardIcon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  // Функція для визначення активного посилання
  const isActive = (path: string) => pathname === path;

  if (pathname === "/") return null;
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-50">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl text-blue-600"
      >
        <SparklesIcon className="w-6 h-6" />
        <span className="hidden sm:inline">LingoFlow</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/dictionary"
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isActive("/dictionary")
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <BookOpenIcon className="w-4 h-4" />
          <span>Словник</span>
        </Link>

        <Link
          href="/flashcards"
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isActive("/flashcards")
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <LayoutDashboardIcon className="w-4 h-4" />
          <span>Тренування</span>
        </Link>
      </div>
    </nav>
  );
}
