import Anthropic from "@anthropic-ai/sdk";
import type { ImageRequest } from "@/lib/types";

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-anthropic-api-key-here") {
    return Response.json(
      { error: "Anthropic API key not configured." },
      { status: 501 }
    );
  }

  const client = new Anthropic({ apiKey });
  const body: ImageRequest = await request.json();

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Generate a clean, educational SVG diagram for the following concept. The SVG should be a visual aid for learning.

Concept: ${body.prompt}

Requirements:
- Output ONLY valid SVG code, nothing else (no markdown, no code fences, no explanation)
- Use a white background with viewBox="0 0 600 400"
- Use clean, modern colors (#3B82F6 blue, #10B981 green, #F59E0B amber, #EF4444 red, #8B5CF6 purple)
- Include clear labels with legible font sizes (14-18px)
- Use arrows, boxes, circles, and connectors to show relationships
- Keep text short and readable
- Make it visually clear and educational, like a textbook diagram`,
        },
      ],
    });

    const svgText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract SVG from response (in case Claude wraps it)
    const svgMatch = svgText.match(/<svg[\s\S]*<\/svg>/);
    if (!svgMatch) {
      return Response.json({ error: "Failed to generate diagram" }, { status: 500 });
    }

    const svg = svgMatch[0];
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

    return Response.json({
      url: dataUrl,
      revisedPrompt: body.prompt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
