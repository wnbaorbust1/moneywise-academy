import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase, Home, Car, AlertTriangle, FileText,
  DollarSign, ArrowRight, ShieldCheck, Shuffle, Zap, Info
} from "lucide-react";

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString(36).toUpperCase().slice(0, 6);
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

function ScenarioSection({ icon: Icon, title, description, detail, color, index }) {
  return (
    <motion.div
      custom={index}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-4 sm:p-5 border border-border/60 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {title}
            </p>
            <p className="font-medium text-foreground text-sm sm:text-base">{description}</p>
            {detail && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{detail}</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ScenarioCard({ scenario, onContinue, onRandomize }) {
  const scenarioId = hashCode(scenario.name.toLowerCase().trim() + (scenario.pathId || ""));

  const paycheck = scenario.job.payFrequency === "weekly"
    ? Math.round(scenario.monthlyNet / 4.33)
    : scenario.job.payFrequency === "bi-weekly"
    ? Math.round(scenario.monthlyNet / 2.17)
    : scenario.monthlyNet;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Meet {scenario.name.split(" ")[0]}'s Life
        </h2>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          This is your financial scenario. Read carefully — your exam is based on this story.
        </p>
        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-muted border text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Unique Scenario ID: <strong className="font-mono text-foreground">{scenarioId}</strong>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Your teacher can verify this is your personal scenario — no two students share the same one.</p>
        {onRandomize && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={onRandomize}
              className="mt-3 gap-1.5 text-xs border-dashed"
            >
              <Shuffle className="w-3.5 h-3.5" /> Randomize My Life Scenario
            </Button>
            <p className="text-[10px] text-muted-foreground mt-1">Get a different job, housing & financial situation</p>
          </motion.div>
        )}
      </motion.div>

      <div className="grid gap-3">
        <ScenarioSection
          icon={Briefcase}
          title="Your Job"
          description={`${scenario.job.title} — $${scenario.job.annualSalary.toLocaleString()}/year`}
          detail={`Paid ${scenario.job.payFrequency}: $${paycheck.toLocaleString()} per paycheck after taxes`}
          color="bg-primary"
          index={0}
        />
        <ScenarioSection
          icon={Home}
          title="Your Housing"
          description={scenario.living.description}
          detail={`Rent: $${scenario.fixedExpenses.rent}/mo · Utilities: $${scenario.fixedExpenses.utilities}/mo`}
          color="bg-accent"
          index={1}
        />
        <ScenarioSection
          icon={Car}
          title="Your Transportation"
          description={scenario.vehicle.description}
          detail={`Payment: $${scenario.fixedExpenses.carPayment}/mo · Insurance: $${scenario.fixedExpenses.carInsurance}/mo · Gas/Transit: $${scenario.fixedExpenses.gas}/mo`}
          color="bg-chart-3"
          index={2}
        />
        <ScenarioSection
          icon={AlertTriangle}
          title="Your Financial Situation"
          description={scenario.lifeEvent.description}
          detail={scenario.lifeEvent.monthlyPayment > 0
            ? `Monthly payment: $${scenario.lifeEvent.monthlyPayment}`
            : scenario.savingsGoal > 0
            ? `Monthly savings goal: $${scenario.savingsGoal}`
            : null}
          color="bg-chart-4"
          index={3}
        />
        <ScenarioSection
          icon={FileText}
          title="Your Tax Situation"
          description={scenario.filingStatus.status}
          detail={scenario.filingStatus.sideIncome ? "You also have $3,000 in side hustle income (1099)" : null}
          color="bg-chart-5"
          index={4}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-4"
      >
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Monthly Summary</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg sm:text-xl font-bold text-foreground">
                ${scenario.monthlyGross.toLocaleString()}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Gross Pay</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-primary">
                ${scenario.monthlyNet.toLocaleString()}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Take-Home</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-accent">
                ${scenario.totalFixed.toLocaleString()}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Fixed Costs</p>
            </div>
          </div>
        </Card>

        {scenario.shock && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-4"
          >
            <Card className="p-4 border-2 border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-3">
                <div className="text-2xl shrink-0">{scenario.shock.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-destructive flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Unexpected Event: {scenario.shock.title}
                    </span>
                    <Badge variant="destructive" className="text-[10px]">{scenario.shock.category}</Badge>
                  </div>
                  <p className="text-sm text-foreground">{scenario.shock.description}</p>
                  {scenario.shock.cost > 0 && (
                    <p className="text-sm font-semibold text-destructive mt-1">
                      Cost: ${scenario.shock.isMonthly ? `${scenario.shock.cost}/month more` : scenario.shock.cost.toLocaleString()}
                    </p>
                  )}
                  <div className="flex items-start gap-1 mt-2 p-2 rounded-lg bg-muted/60">
                    <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{scenario.shock.tip}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <Button onClick={onContinue} className="w-full mt-4 h-12 text-base gap-2">
          Begin the Exam <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}