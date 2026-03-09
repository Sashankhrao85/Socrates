"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  AnalyticsData,
  ModalityInteraction,
  SessionAnalytics,
  Modality,
} from "@/lib/types";
import {
  loadAnalytics,
  saveAnalytics,
  computeModalityStats,
} from "@/lib/analytics-store";

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    setData(loadAnalytics());
  }, []);

  const recordInteraction = useCallback(
    (interaction: ModalityInteraction) => {
      setData((prev) => {
        const updated: AnalyticsData = {
          interactions: [...(prev?.interactions || []), interaction],
          sessionSummaries: prev?.sessionSummaries || [],
          updatedAt: Date.now(),
        };
        saveAnalytics(updated);
        return updated;
      });
    },
    []
  );

  const saveSessionSummary = useCallback(
    (summary: SessionAnalytics) => {
      setData((prev) => {
        const summaries = [...(prev?.sessionSummaries || [])];
        const existingIdx = summaries.findIndex(
          (s) => s.sessionId === summary.sessionId
        );
        if (existingIdx >= 0) {
          summaries[existingIdx] = summary;
        } else {
          summaries.push(summary);
        }
        const updated: AnalyticsData = {
          interactions: prev?.interactions || [],
          sessionSummaries: summaries,
          updatedAt: Date.now(),
        };
        saveAnalytics(updated);
        return updated;
      });
    },
    []
  );

  const getModalityPreference = useCallback((): Modality | null => {
    if (!data || data.interactions.length < 10) return null;
    const stats = computeModalityStats(data.interactions);
    const scored = stats.map((s) => ({
      modality: s.modality,
      score:
        s.breakthroughCorrelation * 0.6 + (s.averageTimeMs / 10000) * 0.4,
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.modality || null;
  }, [data]);

  return {
    data,
    recordInteraction,
    saveSessionSummary,
    getModalityPreference,
  };
}
