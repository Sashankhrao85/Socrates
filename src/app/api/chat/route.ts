import Anthropic from "@anthropic-ai/sdk";
import { buildSocraticSystemPrompt } from "@/lib/socratic-prompt";
import type { ChatRequest } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  const body: ChatRequest = await request.json();
  const systemPrompt = buildSocraticSystemPrompt(body.sessionContext);

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: body.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const fullText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse the JSON response for metadata
    let metadata;
    try {
      const parsed = JSON.parse(fullText);
      metadata = {
        should_generate_image: parsed.should_generate_image,
        image_prompt: parsed.image_prompt,
        image_alt: parsed.image_alt,
        should_offer_audio: parsed.should_offer_audio,
        audio_text: parsed.audio_text,
        difficulty_adjustment: parsed.difficulty_adjustment,
        detected_topic: parsed.detected_topic,
        user_understanding_level: parsed.user_understanding_level,
        is_breakthrough: parsed.is_breakthrough,
      };
    } catch {
      metadata = {
        should_generate_image: false,
        image_prompt: null,
        image_alt: null,
        should_offer_audio: false,
        audio_text: null,
        difficulty_adjustment: 0,
        detected_topic: body.sessionContext.topic || "general",
        user_understanding_level: 3,
        is_breakthrough: false,
      };
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "text_delta", content: fullText })}\n\n`
          )
        );
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "metadata", metadata })}\n\n`
          )
        );
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    let message = "Failed to connect to Claude API";
    if (error instanceof Error) {
      const errMsg = error.message;
      if (errMsg.includes("credit balance is too low")) {
        message = "Your Anthropic API credit balance is too low. Please add credits at console.anthropic.com/settings/billing";
      } else if (errMsg.includes("invalid x-api-key") || errMsg.includes("authentication")) {
        message = "Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local";
      } else {
        message = errMsg;
      }
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
