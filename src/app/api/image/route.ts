import OpenAI from "openai";
import type { ImageRequest, ImageResponse } from "@/lib/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  const body: ImageRequest = await request.json();

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Educational diagram for a learning tool: ${body.prompt}. Style: clean, minimalist, educational. Use clear labels, arrows, and visual hierarchy. White or light background. No walls of text -- prefer visual representation.`,
      n: 1,
      size: body.size || "1024x1024",
      style: body.style || "natural",
      quality: "standard",
    });

    const imageData = response.data?.[0];
    if (!imageData?.url) {
      return Response.json({ error: "No image generated" }, { status: 500 });
    }

    const result: ImageResponse = {
      url: imageData.url,
      revisedPrompt: imageData.revised_prompt || body.prompt,
    };

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
