import type { ContentBlock, SocraticLLMResponse } from "./types";

export function parseResponseToBlocks(raw: string): {
  blocks: ContentBlock[];
  metadata: Partial<SocraticLLMResponse>;
} {
  try {
    const parsed: SocraticLLMResponse = JSON.parse(raw);

    const blocks: ContentBlock[] = [];

    blocks.push({
      type: "text",
      content: parsed.text_response,
    });

    if (parsed.should_generate_image && parsed.image_prompt) {
      blocks.push({
        type: "image",
        prompt: parsed.image_prompt,
        url: null,
        alt: parsed.image_alt || "Educational diagram",
        status: "pending",
      });
    }

    if (parsed.should_offer_audio && parsed.audio_text) {
      blocks.push({
        type: "audio",
        text: parsed.audio_text,
        label: "Listen to this explanation",
      });
    }

    return { blocks, metadata: parsed };
  } catch {
    return {
      blocks: [{ type: "text", content: raw }],
      metadata: {},
    };
  }
}
