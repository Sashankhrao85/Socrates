"use client";

import { useState, useCallback, useRef } from "react";
import type {
  Message,
  Session,
  ContentBlock,
  SocraticLLMResponse,
  ChatRequest,
  ChatStreamChunk,
  Modality,
} from "@/lib/types";

function generateId(): string {
  return crypto.randomUUID();
}

export function useChat() {
  const [session, setSession] = useState<Session>(() => ({
    id: generateId(),
    title: "New Conversation",
    topic: "",
    messages: [],
    startedAt: Date.now(),
    lastActiveAt: Date.now(),
    currentDifficulty: 3,
    resolved: false,
  }));

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const generateImage = useCallback(
    async (prompt: string, messageId: string) => {
      try {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            style: "natural",
            size: "1024x1024",
          }),
        });
        const data = await res.json();

        if (data.url) {
          setSession((prev) => ({
            ...prev,
            messages: prev.messages.map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    blocks: m.blocks.map((b) =>
                      b.type === "image" && b.status === "pending"
                        ? {
                            ...b,
                            url: data.url,
                            status: "generated" as const,
                          }
                        : b
                    ),
                  }
                : m
            ),
          }));
        }
      } catch {
        setSession((prev) => ({
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  blocks: m.blocks.map((b) =>
                    b.type === "image" && b.status === "pending"
                      ? { ...b, status: "error" as const }
                      : b
                  ),
                }
              : m
          ),
        }));
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (userText: string, modalityPreference: Modality | null) => {
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        blocks: [{ type: "text", content: userText }],
        timestamp: Date.now(),
        metadata: {
          modalitiesUsed: ["text"],
          difficultyLevel: session.currentDifficulty,
          isBreakthrough: false,
          topic: session.topic,
        },
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        lastActiveAt: Date.now(),
      }));

      const apiMessages = [...session.messages, userMessage].map((m) => ({
        role: m.role,
        content: m.blocks
          .filter(
            (b): b is { type: "text"; content: string } => b.type === "text"
          )
          .map((b) => b.content)
          .join("\n"),
      }));

      const chatRequest: ChatRequest = {
        messages: apiMessages,
        sessionContext: {
          currentDifficulty: session.currentDifficulty,
          topic: session.topic,
          messageCount: session.messages.length,
          modalityPreference,
        },
      };

      setIsStreaming(true);
      setStreamingText("");

      const controller = new AbortController();
      abortRef.current = controller;
      let accumulated = "";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatRequest),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMsg = errorData?.error || `API error (${response.status})`;
          const errorMessage: Message = {
            id: generateId(),
            role: "assistant",
            blocks: [{ type: "text", content: `**Error:** ${errorMsg}` }],
            timestamp: Date.now(),
            metadata: {
              modalitiesUsed: ["text"],
              difficultyLevel: session.currentDifficulty,
              isBreakthrough: false,
              topic: session.topic,
            },
          };
          setSession((prev) => ({
            ...prev,
            messages: [...prev.messages, errorMessage],
          }));
          return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text
            .split("\n\n")
            .filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const chunk: ChatStreamChunk = JSON.parse(line.slice(6));

            if (chunk.type === "text_delta" && chunk.content) {
              accumulated += chunk.content;
              setStreamingText(accumulated);
            }

            if (chunk.type === "metadata" && chunk.metadata) {
              let displayText = accumulated;
              try {
                const parsed: SocraticLLMResponse = JSON.parse(accumulated);
                displayText = parsed.text_response;
              } catch {
                // Use raw accumulated text as fallback
              }

              const meta = chunk.metadata;
              const assistantMsgId = generateId();
              const blocks: ContentBlock[] = [
                { type: "text", content: displayText },
              ];

              if (meta.should_generate_image && meta.image_prompt) {
                blocks.push({
                  type: "image",
                  prompt: meta.image_prompt,
                  url: null,
                  alt: meta.image_alt || "Educational diagram",
                  status: "pending",
                });
                generateImage(meta.image_prompt, assistantMsgId);
              }

              if (meta.should_offer_audio && meta.audio_text) {
                blocks.push({
                  type: "audio",
                  text: meta.audio_text,
                  label: "Listen to this explanation",
                });
              }

              const assistantMessage: Message = {
                id: assistantMsgId,
                role: "assistant",
                blocks,
                timestamp: Date.now(),
                metadata: {
                  modalitiesUsed: blocks.map((b) => b.type as Modality),
                  difficultyLevel:
                    session.currentDifficulty +
                    (meta.difficulty_adjustment || 0),
                  isBreakthrough: meta.is_breakthrough || false,
                  topic: meta.detected_topic || session.topic,
                },
              };

              setSession((prev) => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
                currentDifficulty: Math.max(
                  1,
                  Math.min(
                    5,
                    prev.currentDifficulty + (meta.difficulty_adjustment || 0)
                  )
                ),
                topic: meta.detected_topic || prev.topic,
                title:
                  prev.messages.length <= 2
                    ? meta.detected_topic || prev.title
                    : prev.title,
                lastActiveAt: Date.now(),
              }));
            }
          }
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Chat stream error:", error);
          const errorMessage: Message = {
            id: generateId(),
            role: "assistant",
            blocks: [
              {
                type: "text",
                content:
                  "**Error:** Could not get a response. Please check your API key and account credits, then try again.",
              },
            ],
            timestamp: Date.now(),
            metadata: {
              modalitiesUsed: ["text"],
              difficultyLevel: session.currentDifficulty,
              isBreakthrough: false,
              topic: session.topic,
            },
          };
          setSession((prev) => ({
            ...prev,
            messages: [...prev.messages, errorMessage],
          }));
        }
      } finally {
        setIsStreaming(false);
        setStreamingText("");
      }
    },
    [session, generateImage]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const newSession = useCallback(() => {
    setSession({
      id: generateId(),
      title: "New Conversation",
      topic: "",
      messages: [],
      startedAt: Date.now(),
      lastActiveAt: Date.now(),
      currentDifficulty: 3,
      resolved: false,
    });
  }, []);

  return {
    session,
    isStreaming,
    streamingText,
    sendMessage,
    stopStreaming,
    newSession,
  };
}
