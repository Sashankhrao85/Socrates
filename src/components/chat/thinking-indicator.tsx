"use client";

import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

interface ThinkingIndicatorProps {
  onStop: () => void;
}

export function ThinkingIndicator({ onStop }: ThinkingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-2 border-t border-border bg-muted/30">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-muted-foreground">Socrates is thinking...</span>
      <Button variant="ghost" size="sm" onClick={onStop} className="gap-1 text-xs ml-auto">
        <Square className="w-3 h-3" />
        Stop
      </Button>
    </div>
  );
}
