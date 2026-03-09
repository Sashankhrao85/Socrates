"use client";

import { useChat } from "@/hooks/use-chat";
import { useSpeech } from "@/hooks/use-speech";
import { useAnalytics } from "@/hooks/use-analytics";
import { useEngagementTracker } from "@/hooks/use-engagement-tracker";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { SessionHeader } from "./session-header";
import { ThinkingIndicator } from "./thinking-indicator";

export function ChatContainer() {
  const {
    session,
    isStreaming,
    streamingText,
    sendMessage,
    stopStreaming,
    newSession,
  } = useChat();
  const speech = useSpeech();
  const { getModalityPreference } = useAnalytics();
  const tracker = useEngagementTracker(session.id);

  const handleSend = (text: string) => {
    const preference = getModalityPreference();
    sendMessage(text, preference);
  };

  return (
    <div className="flex flex-col h-screen">
      <SessionHeader session={session} onNewSession={newSession} />
      <MessageList
        messages={session.messages}
        speech={speech}
        tracker={tracker}
        isStreaming={isStreaming}
        streamingText={streamingText}
      />
      {isStreaming && <ThinkingIndicator onStop={stopStreaming} />}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
