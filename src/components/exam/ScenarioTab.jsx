import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Briefcase, Home, Car, AlertTriangle, FileText, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

function Row({ icon: Icon, title, description, detail, color }) {
  return (
    <Card className="p-3 border border-border/60">
      <div className="flex items-start gap-2.5">
        <div className={`p-2 rounded-lg ${color} shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="font-medium text-sm">{description}</p>
          {detail && <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>}
        </div>
      </div>
    </Card>
  );
}

export default function ScenarioTab({ scenario }) {
  const [open, setOpen] = useState(false);

  if (!scenario) return null;

  const paycheck = scenario.job.payFrequency === "weekly"
    ? Math.round(scenario.monthlyNet / 4.33)
    : scenario.job.payFrequency === "bi-weekly"
    ? Math.round(scenario.monthlyNet / 2.17)
    : scenario.monthlyNet;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Tab handle */}
      <div className="flex justify-center">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-t-xl shadow-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          My Financial Story
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="scenario-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden bg-background border-t border-border shadow-2xl"
          >
            <div className="max-w-2xl mx-auto px-4 py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {scenario.name.split(" ")[0]}'s Financial Story — Reference this anytime
              </p>
              <Row
                icon={Briefcase}
                title="Your Job"
                description={`${scenario.job.title} — $${scenario.job.annualSalary.toLocaleString()}/year`}
                detail={`Paid ${scenario.job.payFrequency}: $${paycheck.toLocaleString()} per paycheck after taxes`}
                color="bg-primary"
              />
              <Row
                icon={Home}
                title="Your Housing"
                description={scenario.living.description}
                detail={`Rent: $${scenario.fixedExpenses.rent}/mo · Utilities: $${scenario.fixedExpenses.utilities}/mo`}
                color="bg-accent"
              />
              <Row
                icon={Car}
                title="Your Transportation"
                description={scenario.vehicle.description}
                detail={`Car: $${scenario.fixedExpenses.carPayment}/mo · Insurance: $${scenario.fixedExpenses.carInsurance}/mo · Gas: $${scenario.fixedExpenses.gas}/mo`}
                color="bg-chart-3"
              />
              <Row
                icon={AlertTriangle}
                title="Financial Situation"
                description={scenario.lifeEvent.description}
                detail={scenario.lifeEvent.monthlyPayment > 0
                  ? `Monthly payment: $${scenario.lifeEvent.monthlyPayment}`
                  : scenario.savingsGoal > 0
                  ? `Monthly savings goal: $${scenario.savingsGoal}`
                  : null}
                color="bg-chart-4"
              />
              <Row
                icon={FileText}
                title="Tax Situation"
                description={scenario.filingStatus.status}
                detail={scenario.filingStatus.sideIncome ? "Side hustle income: $3,000 (1099)" : null}
                color="bg-chart-5"
              />
              <Card className="p-3 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-xs">Monthly Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-base font-bold">${scenario.monthlyGross.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Gross Pay</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-primary">${scenario.monthlyNet.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Take-Home</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-accent">${scenario.totalFixed.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Fixed Costs</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}