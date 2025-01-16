import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export default async function handler(req: Request) {
  try {
    const { text, tone, model } = await req.json();
    const prompt = `Rewrite the following email in a ${tone} tone: ${text}`;

    const response = streamText({
      model: openai(model),
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
