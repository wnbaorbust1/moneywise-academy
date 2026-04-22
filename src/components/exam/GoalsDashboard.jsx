import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Target, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { getGoals } from "@/lib/xpSystem";
import MilestoneToast from "./MilestoneToast";

// Simulate progress based on modules completed
function getSimulatedProgress(goal, modulesCompleted) {
  if (goal.type === "ratio") {
    return goal.current; // static — it's their actual ratio
  }
  // Each module completed = ~1 month of payments/savings simulated
  const months = Math.min(modulesCompleted, 8);
  const accumulated = goal.monthly * months;
  return Math.min(goal.target, accumulated);
}

function GoalBar({ goal, modulesCompleted }) {
  const current = goal.type === "ratio"
    ? goal.current
    : getSimulatedProgress(goal, modulesCompleted);

  const pct = goal.type === "ratio"
    ? goal.inverse
      ? Math.min(100, Math.round((30 / goal.current) * 100))
      : Math.min(100, Math.round((goal.current / goal.target) * 100))
    : Math.min(100, Math.round((current / goal.target) * 100));

  const isComplete = pct >= 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{goal.icon}</span>
          <span className="text-sm font-medium">{goal.label}</span>
          {isComplete && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-primary/10 text-primary font-semibold px-1.5 py-0.5 rounded-full"
            >
              ✓ Done!
            </motion.span>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {goal.type === "ratio"
            ? `${current}% / ${goal.inverse ? "≤30%" : `${goal.target}%`}`
            : `$${current.toLocaleString()} / $${goal.target.toLocaleString()}`}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isComplete ? "bg-primary" : goal.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {goal.type !== "ratio" && goal.monthly > 0 && (
        <p className="text-[10px] text-muted-foreground">
          ${goal.monthly}/month · {Math.ceil((goal.target - current) / goal.monthly)} months to go
        </p>
      )}
    </div>
  );
}

export default function GoalsDashboard({ scenario, modulesCompleted, scores }) {
  const [open, setOpen] = useState(false);
  const [milestone, setMilestone] = useState(null);
  const [shownMilestones, setShownMilestones] = useState(new Set());
  const goals = getGoals(scenario);

  // Check for milestone triggers
  useEffect(() => {
    goals.forEach((goal) => {
      if (goal.type === "ratio") return;
      const current = getSimulatedProgress(goal, modulesCompleted);
      const pct = Math.round((current / goal.target) * 100);
      const milestoneKey = `${goal.id}-100`;
      if (pct >= 100 && !shownMilestones.has(milestoneKey)) {
        setShownMilestones((prev) => new Set([...prev, milestoneKey]));
        setMilestone({
          id: milestoneKey,
          icon: goal.icon,
          title: `${goal.label} — COMPLETE! 🎉`,
          description: `You hit your $${goal.target.toLocaleString()} goal! Amazing work!`,
        });
      }
      const halfKey = `${goal.id}-50`;
      if (pct >= 50 && !shownMilestones.has(halfKey)) {
        setShownMilestones((prev) => new Set([...prev, halfKey]));
        setMilestone({
          id: halfKey,
          icon: "🔥",
          title: "Halfway There!",
          description: `You're 50% toward: ${goal.label}`,
        });
      }
    });
  }, [modulesCompleted]);

  const totalProgress = Math.round(
    goals.filter(g => g.type !== "ratio").reduce((sum, g) => {
      const c = getSimulatedProgress(g, modulesCompleted);
      return sum + Math.min(100, (c / g.target) * 100);
    }, 0) / Math.max(1, goals.filter(g => g.type !== "ratio").length)
  );

  return (
    <>
      <MilestoneToast milestone={milestone} onDone={() => setMilestone(null)} />

      <div className="border-b border-border/50 bg-muted/30">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-foreground">My Life Goals</span>
            <span className="text-[10px] bg-accent/15 text-accent font-semibold px-1.5 py-0.5 rounded-full">
              {totalProgress}% achieved
            </span>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                <p className="text-[10px] text-muted-foreground">
                  Each module you complete = 1 month of real-life progress toward these goals!
                </p>
                {goals.map((goal) => (
                  <GoalBar key={goal.id} goal={goal} modulesCompleted={modulesCompleted} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}