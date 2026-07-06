"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";

interface Checkin {
  checkin_date: string;
  sleep_quality?: number | null;
  energy?: number | null;
  fatigue?: number | null;
  soreness?: number | null;
  readiness_score?: number | null;
}

interface Props { checkins: Checkin[] }

export function RecoveryTrends({ checkins }: Props) {
  if (checkins.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
        Pas encore assez de données — reviens après quelques check-ins.
      </div>
    );
  }

  const data = [...checkins]
    .sort((a, b) => a.checkin_date.localeCompare(b.checkin_date))
    .map(c => ({
      date: new Date(c.checkin_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      Sommeil: c.sleep_quality ?? undefined,
      Énergie: c.energy ?? undefined,
      Fatigue: c.fatigue ?? undefined,
      score: c.readiness_score ?? undefined,
    }));

  return (
    <div className="space-y-4">
      <div className="h-48">
        <p className="text-xs text-muted-foreground mb-2">Métriques /5</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 2, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip
              contentStyle={{ fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Sommeil" stroke="#6366f1" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="Énergie" stroke="#10b981" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="Fatigue" stroke="#f43f5e" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.some(d => d.score !== undefined) && (
        <div className="h-36">
          <p className="text-xs text-muted-foreground mb-2">Score de forme /100</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 2, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <ReferenceLine y={70} stroke="#10b981" strokeDasharray="4 2" label={{ value: "Bon", fontSize: 10, fill: "#10b981" }} />
              <ReferenceLine y={40} stroke="#f43f5e" strokeDasharray="4 2" label={{ value: "Bas", fontSize: 10, fill: "#f43f5e" }} />
              <Line type="monotone" dataKey="score" name="Forme" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
