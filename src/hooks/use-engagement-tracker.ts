"use client";

import { useCallback, useRef } from "react";
import type { Modality, ModalityInteraction } from "@/lib/types";
import { useAnalytics } from "./use-analytics";

export function useEngagementTracker(sessionId: string) {
  const { recordInteraction } = useAnalytics();
  const activeTimers = useRef<
    Map<string, { start: number; modality: Modality; messageId: string }>
  >(new Map());

  const startTracking = useCallback(
    (blockKey: string, modality: Modality, messageId: string) => {
      if (!activeTimers.current.has(blockKey)) {
        activeTimers.current.set(blockKey, {
          start: Date.now(),
          modality,
          messageId,
        });
      }
    },
    []
  );

  const stopTracking = useCallback(
    (blockKey: string) => {
      const timer = activeTimers.current.get(blockKey);
      if (timer) {
        const duration = Date.now() - timer.start;
        if (duration > 500) {
          const interaction: ModalityInteraction = {
            modality: timer.modality,
            messageId: timer.messageId,
            sessionId,
            timestamp: timer.start,
            durationMs: duration,
            interactionType: "view",
          };
          recordInteraction(interaction);
        }
        activeTimers.current.delete(blockKey);
      }
    },
    [sessionId, recordInteraction]
  );

  const recordExplicitInteraction = useCallback(
    (
      modality: Modality,
      messageId: string,
      type: ModalityInteraction["interactionType"],
      durationMs: number
    ) => {
      recordInteraction({
        modality,
        messageId,
        sessionId,
        timestamp: Date.now(),
        durationMs,
        interactionType: type,
      });
    },
    [sessionId, recordInteraction]
  );

  return { startTracking, stopTracking, recordExplicitInteraction };
}
