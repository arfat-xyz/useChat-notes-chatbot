import { noteIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { errorResponse } from "@/lib/error/error-response";
import { getEmbedding } from "@/lib/openai";
import {
  createNoteZodSchema,
  deleteNoteZodSchema,
  updateNoteZodSchema,
} from "@/lib/validate/note";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseData = createNoteZodSchema.safeParse(body);
    if (!parseData.success) {
      //   console.error(parseData.error);
      //   return Response.json({ error: "Invalid input" }, { status: 400 });
      return errorResponse(parseData.error, "Invalid input", 400);
    }
    const { title, content } = parseData.data;
    const { userId } = auth();
    if (!userId) {
      return errorResponse("No user found", "Unauthorized", 401);
    }
    const embedding = await getEmbeddingForNote(title, content);
    const note = await prisma.$transaction(async (tx) => {
      const note = await prisma.note.create({
        data: {
          title,
          content,
          userId,
        },
      });
      await noteIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });
    return Response.json({ note }, { status: 201 });
  } catch (error) {
    errorResponse(error);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseData = updateNoteZodSchema.safeParse(body);
    if (!parseData.success) {
      return errorResponse(parseData.error, "Invalid input", 400);
    }
    const { id, title, content } = parseData.data;
    const { userId } = auth();

    const note = await prisma.note.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!note) {
      return errorResponse("Note not found", "Note not found", 404);
    }
    if (!userId || userId !== note.userId) {
      return errorResponse("No user found", "Unauthorized", 401);
    }
    const embedding = await getEmbeddingForNote(title, content);
    const updateNote = await prisma.$transaction(async (tx) => {
      const updateNote = await prisma.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
      await noteIndex.upsert([
        {
          id: updateNote.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });

    return Response.json({ updateNote }, { status: 200 });
  } catch (error) {
    errorResponse(error);
  }
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseData = deleteNoteZodSchema.safeParse(body);
    if (!parseData.success) {
      return errorResponse(parseData.error, "Invalid input", 400);
    }
    const { id } = parseData.data;
    const { userId } = auth();

    const note = await prisma.note.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!note) {
      return errorResponse("Note not found", "Note not found", 404);
    }
    if (!userId || userId !== note.userId) {
      return errorResponse("No user found", "Unauthorized", 401);
    }
    await prisma.$transaction(async (tx) => {
      await prisma.note.delete({
        where: { id },
      });
      await noteIndex.deleteOne(id);
    });

    return Response.json(
      { message: "Node deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    errorResponse(error);
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
