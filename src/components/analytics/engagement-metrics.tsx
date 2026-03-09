"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "@/lib/types";

interface EngagementMetricsProps {
  data: AnalyticsData;
}

export function EngagementMetrics({ data }: EngagementMetricsProps) {
  const totalTime = data.interactions.reduce((s, i) => s + i.durationMs, 0);
  const totalSessions = data.sessionSummaries.length;
  const breakthroughs = data.sessionSummaries.reduce(
    (s, sess) => s + sess.breakthroughCount,
    0
  );
  const resolved = data.sessionSummaries.filter((s) => s.resolved).length;

  const metrics = [
    {
      label: "Total Learning Time",
      value: totalTime > 60000
        ? `${Math.round(totalTime / 60000)} min`
        : `${Math.round(totalTime / 1000)} sec`,
    },
    { label: "Sessions", value: totalSessions.toString() },
    { label: "Breakthroughs", value: breakthroughs.toString() },
    { label: "Problems Resolved", value: resolved.toString() },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <CardTitle className="text-2xl">{metric.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
