"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ImageBlock } from "./image-block";
import { AudioControls } from "./audio-controls";
import type { useSpeech } from "@/hooks/use-speech";
import type { useEngagementTracker } from "@/hooks/use-engagement-tracker";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: Message;
  speech: ReturnType<typeof useSpeech>;
  tracker: ReturnType<typeof useEngagementTracker>;
}

export function MessageBubble({ message, speech, tracker }: MessageBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const primaryModality = message.metadata.modalitiesUsed[0] || "text";
          tracker.startTracking(message.id, primaryModality, message.id);
        } else {
          tracker.stopTracking(message.id);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [message.id, message.metadata.modalitiesUsed, tracker]);

  const isUser = message.role === "user";

  return (
    <div
      ref={ref}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {message.blocks.map((block, i) => (
          <div key={i} className="mb-2 last:mb-0">
            {block.type === "text" && (
              <div
                className={cn(
                  "prose prose-sm max-w-none",
                  isUser ? "prose-invert" : "dark:prose-invert"
                )}
              >
                <ReactMarkdown>{block.content}</ReactMarkdown>
              </div>
            )}
            {block.type === "image" && (
              <ImageBlock
                block={block}
                onExpand={() =>
                  tracker.recordExplicitInteraction(
                    "image",
                    message.id,
                    "expand",
                    0
                  )
                }
              />
            )}
            {block.type === "audio" && (
              <AudioControls
                block={block}
                speech={speech}
                onPlay={() =>
                  tracker.recordExplicitInteraction(
                    "audio",
                    message.id,
                    "play",
                    0
                  )
                }
              />
            )}
          </div>
        ))}

        {message.metadata.isBreakthrough && (
          <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-amber-500">&#9733;</span> Breakthrough moment
            detected
          </div>
        )}
      </div>
    </div>
  );
}
