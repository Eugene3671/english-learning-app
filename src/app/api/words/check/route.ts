import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { original, userId } = await req.json();

    const existingWord = await db.word.findFirst({
      where: {
        original: original.trim().toLowerCase(),
        userId: userId,
      },
    });

    return NextResponse.json({ exists: !!existingWord });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
