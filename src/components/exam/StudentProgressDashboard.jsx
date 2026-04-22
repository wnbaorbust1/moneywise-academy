import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";

const MODULE_SHORT = {
  "Budget Building": "Budget",
  "Tax Filing": "Taxes",
  "Financial Literacy": "Fin. Lit.",
  "Writing Checks": "Checks",
  "Checkbook Balancing": "Checkbook",
  "Opening a Bank Account": "Banking",
  "Credit Application": "Credit",
};

function TrendIcon({ pct }) {
  if (pct >= 80) return <TrendingUp className="w-4 h-4 text-primary" />;
  if (pct >= 60) return <Minus className="w-4 h-4 text-accent" />;
  return <TrendingDown className="w-4 h-4 text-destructive" />;
}

export default function StudentProgressDashboard({ scores }) {
  if (!scores || scores.length === 0) return null;

  const barData = scores.map((s) => ({
    name: MODULE_SHORT[s.module] || s.module,
    pct: Math.round((s.correct / s.total) * 100),
    correct: s.correct,
    total: s.total,
  }));

  const radarData = scores.map((s) => ({
    module: MODULE_SHORT[s.module] || s.module,
    score: Math.round((s.correct / s.total) * 100),
  }));

  const weakAreas = barData.filter((d) => d.pct < 70);
  const strongAreas = barData.filter((d) => d.pct >= 85);

  const getBarColor = (pct) => {
    if (pct >= 80) return "hsl(var(--primary))";
    if (pct >= 60) return "hsl(var(--accent))";
    return "hsl(var(--destructive))";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4 mt-4"
    >
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Target className="w-4 h-4" /> Performance Breakdown
      </h3>

      {/* Bar chart */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">Module Scores</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(val, name, props) => [`${val}% (${props.payload.correct}/${props.payload.total})`, "Score"]}
              contentStyle={{ fontSize: 11 }}
            />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {barData.map((entry, idx) => (
                <Cell key={idx} fill={getBarColor(entry.pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Radar chart */}
      {scores.length >= 3 && (
        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Mastery Radar</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="module" tick={{ fontSize: 9 }} />
              <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {strongAreas.length > 0 && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Strong Areas
            </p>
            <div className="space-y-1">
              {strongAreas.map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <span className="text-xs">{a.name}</span>
                  <Badge variant="default" className="text-[10px]">{a.pct}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
        {weakAreas.length > 0 && (
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <p className="text-xs font-bold text-destructive mb-2 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Needs Review
            </p>
            <div className="space-y-1">
              {weakAreas.map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <span className="text-xs">{a.name}</span>
                  <Badge variant="destructive" className="text-[10px]">{a.pct}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
}