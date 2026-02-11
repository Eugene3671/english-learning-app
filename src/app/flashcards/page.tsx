export const revalidate = 0;
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import FlashcardsClient from "./FlashCardsClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function FlashcardsPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const words = await db.word.findMany({
    where: {
      userId: session.user.id,
      isLearned: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return <FlashcardsClient initialWords={words} />;
}
