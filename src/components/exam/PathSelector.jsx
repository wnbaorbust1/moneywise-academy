import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Lightbulb } from "lucide-react";

export const PATHS = [
  {
    id: "conservative",
    label: "Conservative",
    emoji: "🛡️",
    icon: Shield,
    tagline: "Play it safe, build slowly.",
    color: "hsl(160 60% 38%)",   // primary green
    colorClass: "border-primary bg-primary/5",
    badgeClass: "bg-primary/10 text-primary",
    description: "Lower debt, steady income, focus on saving and security. Best for students who want to master the basics.",
    modifiers: {
      salaryMultiplier: 0.92,
      debtMultiplier: 0.55,
      savingsBoostMultiplier: 1.3,
      startingDebt: 1800,
      emergencyFundTarget: 1000,
      riskLabel: "Low Risk",
      goalDescription: "Build a $1,000 emergency fund and eliminate $1,800 in debt.",
    },
  },
  {
    id: "aggressive",
    label: "Aggressive",
    emoji: "🚀",
    icon: TrendingUp,
    tagline: "High income, high stakes.",
    color: "hsl(28 80% 56%)",   // accent orange
    colorClass: "border-accent bg-accent/5",
    badgeClass: "bg-accent/10 text-accent",
    description: "Higher earning potential but heavier debt load and big financial goals. Great for a challenge.",
    modifiers: {
      salaryMultiplier: 1.18,
      debtMultiplier: 1.6,
      savingsBoostMultiplier: 0.9,
      startingDebt: 7500,
      emergencyFundTarget: 3000,
      riskLabel: "High Risk",
      goalDescription: "Pay off $7,500 in debt while saving for a $3,000 emergency fund.",
    },
  },
  {
    id: "entrepreneurial",
    label: "Entrepreneurial",
    emoji: "💡",
    icon: Lightbulb,
    tagline: "Variable income, big dreams.",
    color: "hsl(220 70% 55%)",   // chart-3 blue
    colorClass: "border-chart-3 bg-chart-3/5",
    badgeClass: "bg-chart-3/10 text-chart-3",
    description: "Freelance / side-hustle income that fluctuates. Teaches budgeting with irregular cash flow and investment goals.",
    modifiers: {
      salaryMultiplier: 1.0,
      debtMultiplier: 1.0,
      savingsBoostMultiplier: 1.0,
      startingDebt: 4200,
      emergencyFundTarget: 2000,
      riskLabel: "Variable Risk",
      goalDescription: "Manage irregular income, save $2,000 emergency fund, and start investing $100/month.",
      sideIncome: true,
      incomeVariance: true,
    },
  },
];

export default function PathSelector({ name, onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-7">
          <p className="text-sm text-muted-foreground font-medium mb-1">
            Welcome, <span className="text-foreground font-semibold">{name}</span> 👋
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Choose Your Financial Path</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
            Your path shapes your life scenario — income, debt, and goals. All paths have the same modules, but different challenges.
          </p>
        </div>

        <div className="space-y-4">
          {PATHS.map((path, idx) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.12 }}
              >
                <button
                  onClick={() => onSelect(path.id)}
                  className="w-full text-left group"
                >
                  <Card className={`p-5 border-2 transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.01] ${path.colorClass}`}>
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ backgroundColor: path.color + "20" }}
                      >
                        {path.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-display font-bold text-lg">{path.label}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${path.badgeClass}`}>
                            {path.modifiers.riskLabel}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">{path.tagline}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{path.description}</p>
                        <div className="mt-2.5 p-2 rounded-lg bg-background/60 border border-border/50">
                          <p className="text-[11px] font-medium">🎯 Your goal: {path.modifiers.goalDescription}</p>
                        </div>
                      </div>
                      <ArrowRight
                        className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                      />
                    </div>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-5">
          Your name still determines your unique job, housing, and scenario — the path adjusts the difficulty.
        </p>
      </motion.div>
    </div>
  );
}