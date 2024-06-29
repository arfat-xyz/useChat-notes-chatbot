import OpenAI from "openai";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw Error("OPENAI_API_KEY is not available");
}
const openai = new OpenAI({ apiKey });
export default openai;
export async function getEmbedding(input: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input,
  });
  const embedding = response.data[0].embedding;
  if (!embedding) throw Error("Generating embedding error");
  console.log(embedding);
  return embedding;
}
