import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { original, translation, example, userId, isLearned } = body;
    if (!original || !translation) {
      return NextResponse.json(
        { error: "Поля 'original' та 'translation' обов'язкові" },
        { status: 400 },
      );
    }
    const newWord = await db.word.create({
      data: {
        original: original.trim().toLowerCase(),
        translation,
        example,
        userId,
        isLearned: isLearned ?? false,
      },
    });
    return NextResponse.json(newWord, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("API Error [POST /api/words]:", message);
    return NextResponse.json(
      {
        error:
          "Не вдалося зберегти слово. Можливо, сталася помилка бази даних.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    }
    await db.word.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "Delete successful" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { original, translation, example, isLearned, id } = body;
    if (!id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 },
      );
    }
    const updateWord = await db.word.update({
      where: { id: id },
      data: {
        original,
        translation,
        example,
        isLearned,
      },
    });
    return NextResponse.json(updateWord);
  } catch {
    return NextResponse.json({ error: "Error update" }, { status: 500 });
  }
}
