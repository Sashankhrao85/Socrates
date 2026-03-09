"use client";

import type { Session } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface SessionHeaderProps {
  session: Session;
  onNewSession: () => void;
}

export function SessionHeader({ session, onNewSession }: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-medium">
            {session.topic || session.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            Difficulty: {session.currentDifficulty}/5 &middot;{" "}
            {session.messages.length} messages
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onNewSession} className="gap-2">
        <RotateCcw className="w-3 h-3" />
        New Session
      </Button>
    </div>
  );
}
