"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ModalityStats } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ModalityChartProps {
  stats: ModalityStats[];
}

export function ModalityChart({ stats }: ModalityChartProps) {
  const chartData = stats.map((s) => ({
    name: s.modality.charAt(0).toUpperCase() + s.modality.slice(1),
    interactions: s.totalInteractions,
    avgTime: Math.round(s.averageTimeMs / 1000),
    sessions: s.sessionsUsed,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Modality Engagement</CardTitle>
        <CardDescription>
          How you engage with each learning format
        </CardDescription>
      </CardHeader>
      <div className="px-6 pb-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar
              dataKey="interactions"
              fill="hsl(var(--chart-1))"
              name="Interactions"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="avgTime"
              fill="hsl(var(--chart-2))"
              name="Avg Time (s)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
