"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from "recharts";

interface Props {
  measurements: { measured_at: string; weight_kg: number | null; body_fat_pct: number | null }[];
  targetWeight: number | null;
}

export function WeightChart({ measurements, targetWeight }: Props) {
  const withWeight = measurements.filter(m => m.weight_kg != null);

  if (withWeight.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">⚖️ Poids</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-sm text-muted-foreground">
          Aucune mesure enregistrée.<br />Clique sur "Ajouter" pour commencer le suivi.
        </CardContent>
      </Card>
    );
  }

  const data = withWeight.map(m => ({
    date: new Date(m.measured_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    poids: m.weight_kg,
    mg: m.body_fat_pct,
  }));

  const latest = withWeight[withWeight.length - 1];
  const first = withWeight[0];
  const diff = latest.weight_kg != null && first.weight_kg != null
    ? (latest.weight_kg - first.weight_kg)
    : null;

  const weights = withWeight.map(m => m.weight_kg!);
  const minW = Math.floor(Math.min(...weights) - 1);
  const maxW = Math.ceil(Math.max(...weights) + 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>⚖️ Poids</span>
          <div className="flex items-center gap-3 text-sm font-normal">
            <span className="font-bold text-lg">{latest.weight_kg} kg</span>
            {diff != null && (
              <span className={`text-xs font-medium ${diff < 0 ? "text-green-600" : diff > 0 ? "text-rose-500" : "text-muted-foreground"}`}>
                {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minW, maxW]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(val: any) => [`${val} kg`, "Poids"]}
            />
            {targetWeight && (
              <ReferenceLine
                y={targetWeight}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 4"
                label={{ value: `Objectif ${targetWeight}kg`, fontSize: 10, fill: "hsl(var(--primary))" }}
              />
            )}
            <Line
              type="monotone"
              dataKey="poids"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Body fat if available */}
        {withWeight.some(m => m.body_fat_pct != null) && (
          <p className="text-xs text-muted-foreground mt-2">
            Masse grasse : <span className="font-medium text-foreground">{latest.body_fat_pct}%</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
