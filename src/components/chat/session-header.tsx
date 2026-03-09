"use client";

import type { Session } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const difficultyLabels: Record<number, string> = {
  1: "Beginner",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Expert",
};

const difficultyColors: Record<number, string> = {
  1: "bg-emerald-500",
  2: "bg-green-500",
  3: "bg-yellow-500",
  4: "bg-orange-500",
  5: "bg-red-500",
};

interface SessionHeaderProps {
  session: Session;
  onNewSession: () => void;
  onSetDifficulty: (level: number) => void;
}

export function SessionHeader({
  session,
  onNewSession,
  onSetDifficulty,
}: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-medium">
            {session.topic || session.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {session.messages.length} messages
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Difficulty:
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => onSetDifficulty(level)}
                title={difficultyLabels[level]}
                className={`
                  w-7 h-7 rounded-md text-xs font-semibold transition-all
                  ${
                    session.currentDifficulty === level
                      ? `${difficultyColors[level]} text-white shadow-sm scale-110`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            {difficultyLabels[session.currentDifficulty]}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNewSession}
          className="gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          New Session
        </Button>
      </div>
    </div>
  );
}
