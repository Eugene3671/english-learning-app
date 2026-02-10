export const revalidate = 0;
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import FlashcardsClient from "./FlashCardsClient";

export default async function FlashcardsPage() {
  const words = await db.word.findMany({ where: { isLearned: false } });
  return <FlashcardsClient initialWords={words} />;
}
