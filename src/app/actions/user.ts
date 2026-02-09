"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateEnglishLevel(userId: string, englishLevel: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { englishLevel: englishLevel },
    });
    revalidatePath("/");
    return { secces: true };
  } catch (error) {
    console.error("Failed to update level:", error);
    return { error: "Failed to update level" };
  }
}
