"use client";

import { useState } from "react";
import type { ImageContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, ZoomIn } from "lucide-react";

interface ImageBlockProps {
  block: ImageContent;
  onExpand: () => void;
}

export function ImageBlock({ block, onExpand }: ImageBlockProps) {
  const [expanded, setExpanded] = useState(false);

  if (block.status === "pending") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Generating visual aid...
      </div>
    );
  }

  if (block.status === "error") {
    return (
      <div className="text-sm text-destructive py-2">
        Could not generate visual. Continuing with text guidance.
      </div>
    );
  }

  return (
    <div className="my-2">
      <button
        onClick={() => {
          setExpanded(!expanded);
          onExpand();
        }}
        className="group relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.url!}
          alt={block.alt}
          className={cn(
            "rounded-md border transition-all",
            expanded ? "max-w-full" : "max-w-xs"
          )}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center">
          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>
      <p className="text-xs text-muted-foreground mt-1">{block.alt}</p>
    </div>
  );
}
