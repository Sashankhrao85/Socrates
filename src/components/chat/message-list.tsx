"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";
import type { useSpeech } from "@/hooks/use-speech";
import type { useEngagementTracker } from "@/hooks/use-engagement-tracker";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: Message[];
  speech: ReturnType<typeof useSpeech>;
  tracker: ReturnType<typeof useEngagementTracker>;
  isStreaming: boolean;
  streamingText: string;
}

export function MessageList({
  messages,
  speech,
  tracker,
  isStreaming,
  streamingText,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingText]);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Ask me anything</h3>
          <p className="text-sm text-muted-foreground">
            I&apos;ll guide you to discover the answer yourself through
            questions, visual aids, and hints. Try asking about any topic you
            want to understand better.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            speech={speech}
            tracker={tracker}
          />
        ))}
        {isStreaming && streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted">
              <div className="text-sm text-muted-foreground animate-pulse">
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
