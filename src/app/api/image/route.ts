import OpenAI from "openai";
import type { ImageRequest, ImageResponse } from "@/lib/types";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key-here") {
    return Response.json(
      { error: "OpenAI API key not configured. Image generation is disabled." },
      { status: 501 }
    );
  }

  const openai = new OpenAI({ apiKey });
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
