"use client";

import type { AudioContent } from "@/lib/types";
import { Volume2, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioControlsProps {
  block: AudioContent;
  speech: {
    isSpeaking: boolean;
    isPaused: boolean;
    isSupported: boolean;
    speak: (text: string) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
  };
  onPlay: () => void;
}

export function AudioControls({ block, speech, onPlay }: AudioControlsProps) {
  if (!speech.isSupported) return null;

  const handlePlay = () => {
    speech.speak(block.text);
    onPlay();
  };

  return (
    <div className="flex items-center gap-2 py-1">
      {!speech.isSpeaking ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlay}
          className="gap-2 text-xs"
        >
          <Volume2 className="w-3 h-3" />
          {block.label}
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={speech.isPaused ? speech.resume : speech.pause}
            className="gap-1 text-xs"
          >
            <Pause className="w-3 h-3" />
            {speech.isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={speech.stop}
            className="gap-1 text-xs"
          >
            <Square className="w-3 h-3" />
            Stop
          </Button>
        </>
      )}
    </div>
  );
}
