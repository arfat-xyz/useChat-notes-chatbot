import { OpenAIStream, StreamingTextResponse } from "ai";
import { auth } from "@clerk/nextjs/server";
import { ChatCompletionMessage } from "openai/resources/index";
import { errorResponse } from "@/lib/error/error-response";
import openai, { getEmbedding } from "@/lib/openai";
import { noteIndex } from "@/lib/db/pinecone";
import { createOpenAI } from "@ai-sdk/openai";
import prisma from "@/lib/db/prisma";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;
    const messagesTruncated = messages.slice(-6);
    const embedding = await getEmbedding(
      messagesTruncated.map((m) => m.content).join("\n")
    );
    const { userId } = auth();

    const vectorQueryResponse = await noteIndex.query({
      vector: embedding,
      topK: 40,
      filter: { userId },
    });
    const relevenNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((m) => m.id),
        },
      },
    });
    console.log("Relevent notes found: ", relevenNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent note-taking app. You answer the user's questions based on their existing notes. The relevent notes for this query: \n" +
        relevenNotes
          .map((n) => `Title: ${n.title}\n\nContent:\n${n.content}`)
          .join("\n\n"),
    };
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });
    // const stream = OpenAIStream(response);
    const stream = OpenAIStream(response);
    const streamData = new StreamingTextResponse(stream);
    console.log("chatgpt response", streamData);

    return streamData;
  } catch (error) {
    errorResponse(error);
  }
}
