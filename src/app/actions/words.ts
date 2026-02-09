"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markAsLearnedAction(id: string) {
  await db.word.update({
    where: { id },
    data: { isLearned: true },
  });
  revalidatePath("/dictionary");
  revalidatePath("/flashcards");
}
