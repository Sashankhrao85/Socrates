"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { SessionAnalytics } from "@/lib/types";

interface SessionTimelineProps {
  sessions: SessionAnalytics[];
}

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  const sorted = [...sessions].sort((a, b) => b.startedAt - a.startedAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Session History</CardTitle>
        <CardDescription>Your recent learning sessions</CardDescription>
      </CardHeader>
      <div className="px-6 pb-6">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {sorted.slice(0, 10).map((session) => (
              <div
                key={session.sessionId}
                className="flex items-center justify-between p-3 rounded-md border border-border"
              >
                <div>
                  <p className="text-sm font-medium">{session.topic || "General"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.startedAt).toLocaleDateString()} &middot;{" "}
                    {session.messageCount} messages &middot;{" "}
                    {Math.round(session.durationMs / 60000)}min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {session.breakthroughCount > 0 && (
                    <span className="text-xs text-amber-500">
                      &#9733; {session.breakthroughCount}
                    </span>
                  )}
                  {session.resolved && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded dark:bg-green-900/30 dark:text-green-400">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
