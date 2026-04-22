import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen, Briefcase, Home, Car, AlertTriangle, FileText, DollarSign } from "lucide-react";
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

export default function ScenarioReviewSheet({ scenario }) {
  if (!scenario) return null;

  const paycheck = scenario.job.payFrequency === "weekly"
    ? Math.round(scenario.monthlyNet / 4.33)
    : scenario.job.payFrequency === "bi-weekly"
    ? Math.round(scenario.monthlyNet / 2.17)
    : scenario.monthlyNet;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs shrink-0">
          <BookOpen className="w-3.5 h-3.5" /> Review Story
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-display text-lg">
            {scenario.name.split(" ")[0]}'s Financial Story
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-2.5">
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
      </SheetContent>
    </Sheet>
  );
}