import { motion } from "framer-motion";
import { getLevel, calcFinancialHealthScore, getFinancialHealthLabel } from "@/lib/xpSystem";
import ClassComparison from "@/components/exam/ClassComparison";
import PerformanceNarrative from "@/components/exam/PerformanceNarrative";
import StudentProgressDashboard from "@/components/exam/StudentProgressDashboard";
import BadgeShowcase from "@/components/exam/BadgeShowcase";
import TeacherReport from "@/components/exam/TeacherReport";
import { PATHS } from "@/components/exam/PathSelector";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Star, Target, RotateCcw,
  TrendingUp, Wallet, FileText, Brain, PenLine, BookOpen, Landmark, CreditCard, Zap,
} from "lucide-react";

function getGrade(pct) {
  if (pct >= 93) return { letter: "A", color: "text-primary", msg: "Outstanding! You're financially ready!" };
  if (pct >= 85) return { letter: "B+", color: "text-primary", msg: "Great job! Strong financial knowledge." };
  if (pct >= 77) return { letter: "B", color: "text-chart-5", msg: "Good work! A few areas to review." };
  if (pct >= 70) return { letter: "C+", color: "text-accent", msg: "Decent effort — keep studying!" };
  if (pct >= 60) return { letter: "C", color: "text-accent", msg: "You passed, but review key concepts." };
  return { letter: "F", color: "text-destructive", msg: "Keep studying — you'll get there!" };
}

const moduleIcons = {
  "Budget Building": Wallet,
  "Tax Filing": FileText,
  "Financial Literacy": Brain,
  "Writing Checks": PenLine,
  "Checkbook Balancing": BookOpen,
  "Opening a Bank Account": Landmark,
  "Credit Application": CreditCard,
};

export default function ResultsSummary({ scores, scenario, onRestart, xp = 0, classPeriod }) {
  const totalCorrect = scores.reduce((sum, s) => sum + s.correct, 0);
  const totalQuestions = scores.reduce((sum, s) => sum + s.total, 0);
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const grade = getGrade(percentage);
  const levelInfo = getLevel(xp);
  const healthScore = calcFinancialHealthScore(scores, scenario);
  const healthLabel = getFinancialHealthLabel(healthScore);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-3">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold">Exam Complete!</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {scenario.name} — {scenario.job.title}
        </p>
        {scenario.pathId && (() => {
          const path = PATHS.find((p) => p.id === scenario.pathId);
          return path ? (
            <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ${path.badgeClass}`}>
              {path.emoji} {path.label} Path
            </span>
          ) : null;
        })()}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 text-center bg-card border-2">
          <div className={`text-6xl sm:text-7xl font-display font-bold ${grade.color}`}>
            {grade.letter}
          </div>
          <p className="text-2xl font-bold mt-2">{percentage}%</p>
          <p className="text-muted-foreground text-sm mt-1">
            {totalCorrect} of {totalQuestions} correct
          </p>
          <p className="text-sm font-medium mt-3">{grade.msg}</p>
          {/* XP + Level + Health Score row */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-lg">{xp}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Total XP</p>
            </div>
            <div className="text-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto"
                style={{ backgroundColor: levelInfo.color }}
              >
                {levelInfo.level}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{levelInfo.title}</p>
            </div>
            {healthScore > 0 && (
              <div className="text-center">
                <span className={`font-bold text-lg ${healthLabel.color}`}>{healthScore}</span>
                <p className="text-[10px] text-muted-foreground">Fin. Health Score</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-2.5"
      >
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Section Breakdown
        </h3>
        {scores.map((s, idx) => {
          const Icon = moduleIcons[s.module] || Star;
          const pct = Math.round((s.correct / s.total) * 100);
          return (
            <Card key={idx} className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-sm">{s.module}</span>
                  <Badge
                    variant={pct >= 80 ? "default" : pct >= 60 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {s.correct}/{s.total}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5 + idx * 0.15, duration: 0.6 }}
                    className={`h-full rounded-full ${
                      pct >= 80 ? "bg-primary" : pct >= 60 ? "bg-accent" : "bg-destructive"
                    }`}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-2"
      >
        <Card className="p-4 bg-muted/50 border-dashed">
          <div className="flex items-start gap-2.5">
            <Target className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Key Takeaway</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As a {scenario.job.title} earning ${scenario.job.annualSalary.toLocaleString()}/year,
                your most important financial habits are: budgeting your ${scenario.monthlyNet.toLocaleString()}/month take-home pay,
                building an emergency fund, and understanding how taxes work. These skills will serve you for life.
              </p>
            </div>
          </div>
        </Card>

        <PerformanceNarrative scores={scores} scenario={scenario} />

        <StudentProgressDashboard scores={scores} />

        <BadgeShowcase xp={xp} scores={scores} />

        <ClassComparison scenario={scenario} scores={scores} xp={xp} />

        <TeacherReport scores={scores} scenario={scenario} xp={xp} classPeriod={classPeriod} />

        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full mt-4 h-11 gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Start Over with New Name
        </Button>
      </motion.div>
    </div>
  );
}