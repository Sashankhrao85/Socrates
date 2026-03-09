import type { AnalyticsData, ModalityInteraction, ModalityStats, Modality } from "./types";

const STORAGE_KEY = "socrates_analytics";

export function loadAnalytics(): AnalyticsData {
  if (typeof window === "undefined") {
    return createEmptyAnalytics();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupted data -- reset
  }
  return createEmptyAnalytics();
}

export function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn("Failed to save analytics to localStorage");
  }
}

function createEmptyAnalytics(): AnalyticsData {
  return {
    interactions: [],
    sessionSummaries: [],
    updatedAt: Date.now(),
  };
}

export function computeModalityStats(
  interactions: ModalityInteraction[]
): ModalityStats[] {
  const modalities: Modality[] = ["text", "image", "audio"];

  return modalities.map((modality) => {
    const relevant = interactions.filter((i) => i.modality === modality);
    const totalTime = relevant.reduce((sum, i) => sum + i.durationMs, 0);
    const sessions = new Set(relevant.map((i) => i.sessionId));

    return {
      modality,
      totalInteractions: relevant.length,
      totalTimeMs: totalTime,
      averageTimeMs: relevant.length > 0 ? totalTime / relevant.length : 0,
      breakthroughCorrelation: 0,
      sessionsUsed: sessions.size,
    };
  });
}
