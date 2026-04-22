import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getAllStudents } from "@/lib/storage";

function percentileRank(value, allValues, higherIsBetter = true) {
  if (!allValues.length) return null;
  const below = allValues.filter((v) => (higherIsBetter ? v < value : v > value)).length;
  return Math.round((below / allValues.length) * 100);
}

function ComparisonRow({ icon, label, mine, classAvg, unit = "%", higherIsBetter = false, percentile }) {
  const diff = mine - classAvg;
  const absDiff = Math.abs(diff).toFixed(unit === "%" ? 1 : 0);
  const better = higherIsBetter ? diff > 0 : diff < 0;
  const neutral = Math.abs(diff) < 0.5;

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {neutral ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Minus className="w-3 h-3" /> About the same as the class average
            </span>
          ) : (
            <span className={`text-xs font-semibold flex items-center gap-1 ${better ? "text-primary" : "text-destructive"}`}>
              {better ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              You spent {absDiff}{unit} {better ? "less" : "more"} than the class average
            </span>
          )}
          {percentile !== null && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              Better than {percentile}% of peers
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
          <span>You: <strong className="text-foreground">{mine.toFixed(1)}{unit}</strong></span>
          <span>Class avg: <strong>{classAvg.toFixed(1)}{unit}</strong></span>
        </div>
      </div>
    </div>
  );
}

export default function ClassComparison({ scenario, scores, xp }) {
  const allStudents = getAllStudents();

  // Need at least 2 students (including self) to show comparisons
  if (allStudents.length < 2) {
    return null;
  }

  // My metrics
  const myRentRatio = (scenario.fixedExpenses.rent / scenario.monthlyNet) * 100;
  const myAccuracy = scores.length
    ? (scores.reduce((a, s) => a + s.correct, 0) / scores.reduce((a, s) => a + s.total, 0)) * 100
    : 0;
  const myDiscretionaryRatio = (scenario.discretionary / scenario.monthlyNet) * 100;

  // Find self in allStudents (by name)
  const selfRecord = allStudents.find((s) => s.name.toLowerCase() === scenario.name.toLowerCase());
  const peers = allStudents.filter((s) => s.name.toLowerCase() !== scenario.name.toLowerCase());

  if (peers.length === 0) return null;

  // Class averages — compute from peer scenarios (we only store high-level stats)
  const peerAccuracies = peers
    .map((s) => (s.totalCorrect / Math.max(1, s.totalQuestions)) * 100)
    .filter(Boolean);

  const peerXPs = peers.map((s) => s.xp).filter(Boolean);
  const peerHealthScores = peers.map((s) => s.healthScore || 0).filter((v) => v > 0);

  const avgAccuracy = peerAccuracies.length
    ? peerAccuracies.reduce((a, b) => a + b, 0) / peerAccuracies.length
    : null;
  const avgXP = peerXPs.length ? peerXPs.reduce((a, b) => a + b, 0) / peerXPs.length : null;
  const avgHealth = peerHealthScores.length
    ? peerHealthScores.reduce((a, b) => a + b, 0) / peerHealthScores.length
    : null;

  const accuracyPercentile = percentileRank(myAccuracy, peerAccuracies, true);
  const xpPercentile = percentileRank(xp, peerXPs, true);

  const insightLines = [];

  if (avgAccuracy !== null) {
    const diff = myAccuracy - avgAccuracy;
    if (diff > 5) insightLines.push(`Your quiz accuracy is ${diff.toFixed(0)}% above the class average — excellent!`);
    else if (diff < -5) insightLines.push(`Your quiz accuracy is ${Math.abs(diff).toFixed(0)}% below class average — review the sections you missed!`);
    else insightLines.push("Your quiz accuracy is right in line with the class average.");
  }

  if (xpPercentile !== null) {
    if (xpPercentile >= 75) insightLines.push(`Your XP puts you in the top ${100 - xpPercentile}% of the class!`);
    else if (xpPercentile < 30) insightLines.push("There's XP on the table — try for more perfect modules next time!");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-chart-3/10">
            <Users className="w-4 h-4 text-chart-3" />
          </div>
          <h3 className="font-semibold text-sm">How You Compare to the Class</h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
            {peers.length} peer{peers.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-1">
          {avgAccuracy !== null && (
            <ComparisonRow
              icon="🎯"
              label="Quiz Accuracy"
              mine={myAccuracy}
              classAvg={avgAccuracy}
              unit="%"
              higherIsBetter={true}
              percentile={accuracyPercentile}
            />
          )}
          {avgXP !== null && (
            <ComparisonRow
              icon="⚡"
              label="Total XP Earned"
              mine={xp}
              classAvg={avgXP}
              unit=" XP"
              higherIsBetter={true}
              percentile={xpPercentile}
            />
          )}
          {avgHealth !== null && (
            <ComparisonRow
              icon="💚"
              label="Financial Health Score"
              mine={selfRecord?.healthScore || 0}
              classAvg={avgHealth}
              unit=" pts"
              higherIsBetter={true}
              percentile={percentileRank(selfRecord?.healthScore || 0, peerHealthScores, true)}
            />
          )}
        </div>

        {insightLines.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border space-y-1.5">
            {insightLines.map((line, i) => (
              <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                💬 {line}
              </p>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}