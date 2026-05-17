import { redisService } from "../../lib/redis";
import  { EmbeddingService } from "./embedding.service";
import { IndexingService } from "./indexing.service";
import  { LLMService } from "./llm.service";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const convertLiteral = (data: number[]) => {
  return `[${data?.join(",")}]`;
  // output: "[0.23,-0.87,0.41]"  ← PostgreSQL vector format
};


export class RagService {
 private indexingService:IndexingService;
private embeddingService:EmbeddingService;
private llmService:LLMService;
constructor(){
this.indexingService=new IndexingService();
this.embeddingService=new EmbeddingService();
this.llmService=new LLMService();
}

  // ── Bulk: সব data একসাথে index (initial setup) ──
  async ingestAdmin() {
    return await this.indexingService.indexAllForAdmin();
  }

  // ── Single: নতুন meal add/update হলে ────────────
  async ingestOneMeal(mealId: string) {
    return await this.indexingService.indexOneMeal(mealId);
  }

  // ── Single: নতুন order place হলে ─────────────────
  async ingestOneOrder(orderId: string) {
    return await this.indexingService.indexOneOrder(orderId);
  }

  // ── Single: provider profile update হলে ──────────
  async ingestOneProvider(providerId: string) {
    return await this.indexingService.indexOneProvider(providerId);
  }

  // ── Single: নতুন customer register হলে ───────────
  async ingestOneCustomer(customerId: string) {
    return await this.indexingService.indexOneCustomer(customerId);
  }
    // ── Single: নতুন admin register হলে ───────────

async ingestOneAdmin(adminId: string) {
  return await this.indexingService.indexOneAdmin(adminId);
}
  // ── Delete: meal/order delete হলে soft delete ────
async removeFromIndex(
    chunkey: string,
    table: "documentEmbeddingAdmin" | "documentEmbeddingProvider" | "documentEmbeddingCustomer"
  ) {
    return await this.indexingService.deleteDocument(chunkey, table);
  }


async retrivalDocument(query: string) {
  const embeddingData = await this.embeddingService.generateEmbedding(query);
  const vectorLiteral = convertLiteral(embeddingData);

  const results = await prisma.$queryRaw(Prisma.sql`
    SELECT
      id, "chunkey", "sourceType", "sourceId", "sourceLabel",
      content, metadata,
      1 - (embedding <=> CAST(${vectorLiteral} AS vector)) AS similarity
    FROM "documentEmbeddingAdmin"
    WHERE "isDeleted" = false
    ORDER BY embedding <=> CAST(${vectorLiteral} AS vector)
    LIMIT 10
  `);

  return results;
}

async generateAnswer(query: string) {
  const cacheKey = `rag_answer:${query}`;
  const cachedAnswer = await redisService.get(cacheKey);

  const retrivalDocuments = await this.retrivalDocument(query);
  const context = (retrivalDocuments as any[])
    .filter((doc) => doc.content)
    .map((doc) => doc.content);

  const sources = (retrivalDocuments as any[]).map((doc) => ({
    id: doc.id,
    chunkKey: doc.chunkey,
    sourceType: doc.sourceType,
    sourceId: doc.sourceId,
    sourceLabel: doc.sourceLabel,
    content: doc.content,
    similarity: doc.similarity,
  }));

  if (cachedAnswer) {
    return { answer: cachedAnswer, sources, contextUsed: context.length > 0 };
  }

  let rawAnswer = await this.llmService.generateAnswer(query, context);

  // clean markdown fence if any
  rawAnswer = rawAnswer
    .replace(/```json\n?/, "")
    .replace(/```$/, "")
    .replace(/\n|\r|\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  let parsedAnswer: any;
  try {
    parsedAnswer = JSON.parse(rawAnswer);
  } catch {
    throw new Error("LLM response is not valid JSON");
  }

  await redisService.set(cacheKey, parsedAnswer, 3600);

  return { answer: parsedAnswer, sources, contextUsed: context.length > 0 };
}



}