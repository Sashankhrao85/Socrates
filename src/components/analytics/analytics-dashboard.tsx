"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { ModalityChart } from "./modality-chart";
import { SessionTimeline } from "./session-timeline";
import { EngagementMetrics } from "./engagement-metrics";
import { computeModalityStats } from "@/lib/analytics-store";

export function AnalyticsDashboard() {
  const { data } = useAnalytics();

  if (!data || (data.interactions.length === 0 && data.sessionSummaries.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No data yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a Socratic conversation to see your learning insights here.
          </p>
        </div>
      </div>
    );
  }

  const stats = computeModalityStats(data.interactions);

  return (
    <div className="space-y-6">
      <EngagementMetrics data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModalityChart stats={stats} />
        <SessionTimeline sessions={data.sessionSummaries} />
      </div>
    </div>
  );
}
