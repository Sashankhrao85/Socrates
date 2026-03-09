import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Learning Insights</h1>
      <p className="text-muted-foreground mb-6">
        Track which learning modalities work best for you
      </p>
      <AnalyticsDashboard />
    </div>
  );
}
