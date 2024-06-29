import { Pinecone } from "@pinecone-database/pinecone";
const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("PINECONE_API_KEY is not available");
}
const pc = new Pinecone({
  apiKey,
});
export const noteIndex = pc.Index("todvob-practice");
