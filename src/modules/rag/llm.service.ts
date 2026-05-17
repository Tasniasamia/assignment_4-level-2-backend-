import OpenAI from "openai";

export class LLMService {
  private client: OpenAI;
  private llmModel: string;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is missing");
    }

    this.client = new OpenAI({
      baseURL:
        process.env.OPENROUTER_URL ||
        "https://openrouter.ai/api/v1",

      apiKey,

      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Idea Generator AI",
      },
    });

    this.llmModel =
      process.env.OPENROUTER_LLM_MODEL ||
      "baidu/cobuddy:free";
  }

async generateAnswer(prompt: string, context: string[] = []) {
  try {
    const contextBlock =
      context.length > 0
        ? `Context Information:\n${context.join("\n\n")}\n\nQuestion:\n${prompt}\n\nAnswer only based on the context above.`
        : prompt;

    const fullPrompt = `${contextBlock}

Return ONLY valid JSON with this structure:
{
  "answer": "main answer here",
  "meals": [
    {
      "name": "meal name",
      "price": "price",
      "rating": "rating",
      "category": "category",
      "provider": "restaurant name",
      "isAvailable": true
    }
  ],
  "orders": [
    {
      "orderId": "id",
      "status": "status",
      "totalAmount": "amount",
      "items": "item summary"
    }
  ],
  "providers": [
    {
      "restaurantName": "name",
      "address": "address",
      "isOpen": true
    }
  ],
  "customers": [
    {
      "name": "name",
      "email": "email"
    }
  ]
}

Rules:
- Only include arrays that are relevant to the question (empty array [] if not relevant)
- Do not return markdown
- Do not use \`\`\`json
- Return pure JSON only`;

    const systemMessage = `
You are an AI assistant for a food delivery platform.
You help with questions about meals, orders, restaurants, and customers.
You MUST return ONLY valid JSON. Never explain outside JSON.
If information is missing from context, set "answer" to "I don't have enough information."
`;

    const completion = await this.client.chat.completions.create({
      model: this.llmModel,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: fullPrompt },
      ],
      temperature: 0.1,
      max_tokens: 1500,
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");

    return content;
  } catch (error) {
    console.error("LLM error:", error);
    throw error;
  }
}
}