import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";

function getModuleFeedback(s) {
  const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  const name = s.module;

  const tips = {
    "Budget Building": {
      strong: "You understand how to break down income, track fixed expenses, and plan discretionary spending — a critical real-world skill.",
      weak: "Review how to calculate take-home pay vs. gross pay, and practice the 50/30/20 rule to organize your spending priorities.",
    },
    "Tax Filing": {
      strong: "You correctly identified tax forms, filing statuses, and how deductions reduce taxable income — knowledge that will save you money every April.",
      weak: "Focus on the difference between W-2 and 1099 forms, how standard deductions work, and why FICA taxes come out of every paycheck.",
    },
    "Financial Literacy": {
      strong: "You grasp key financial concepts like compound interest, credit scores, and the long-term value of saving early.",
      weak: "Revisit how compound interest grows over time, what the five factors of a credit score are, and why an emergency fund prevents debt spirals.",
    },
    "Writing Checks": {
      strong: "You filled out checks accurately — writing amounts in both numbers and words, with the correct payee and date format.",
      weak: "Practice converting dollar amounts into written words (e.g., 'Two hundred forty-seven and 85/100') and remember to fill every field to prevent fraud.",
    },
    "Checkbook Balancing": {
      strong: "You correctly tracked your running balance through deposits and payments — a habit that prevents overdraft fees.",
      weak: "Practice the formula: Previous Balance ± Transaction = New Balance. Remember deposits add and checks/debits subtract.",
    },
    "Opening a Bank Account": {
      strong: "You understand the difference between checking and savings accounts, and how to avoid common bank fees.",
      weak: "Review the difference between routing numbers and account numbers, and learn which fees to always avoid when choosing a bank.",
    },
    "Credit Application": {
      strong: "You made smart credit choices — selecting the right product for your situation and understanding APR and credit utilization.",
      weak: "Focus on how APR translates to monthly interest, why keeping utilization under 30% matters, and the consequences of missed payments.",
    },
  };

  const feedback = tips[name] || { strong: "Good effort.", weak: "Review this section's key concepts." };
  return { pct, feedback };
}

export default function PerformanceNarrative({ scores, scenario }) {
  if (!scores.length || !scenario) return null;

  const totalCorrect = scores.reduce((a, s) => a + s.correct, 0);
  const totalQs = scores.reduce((a, s) => a + s.total, 0);
  const overallPct = Math.round((totalCorrect / totalQs) * 100);

  const strong = scores.filter((s) => Math.round((s.correct / s.total) * 100) >= 80);
  const weak = scores.filter((s) => Math.round((s.correct / s.total) * 100) < 60);
  const middle = scores.filter((s) => {
    const p = Math.round((s.correct / s.total) * 100);
    return p >= 60 && p < 80;
  });

  const openingLine = overallPct >= 85
    ? `${scenario.name.split(" ")[0]} showed strong mastery across most financial topics.`
    : overallPct >= 70
    ? `${scenario.name.split(" ")[0]} demonstrated a solid foundation with some areas to strengthen.`
    : `${scenario.name.split(" ")[0]} completed the exam and has clear opportunities to grow.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-4"
    >
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
        📝 Performance Report
      </h3>

      {/* Opening summary */}
      <Card className="p-4 bg-card border mb-3">
        <p className="text-sm leading-relaxed text-foreground">
          {openingLine}{" "}
          {strong.length > 0 && weak.length === 0 && (
            <span>Every section was at or above 80% — this student is ready to apply these skills in real life.</span>
          )}
          {weak.length === 0 && middle.length > 0 && (
            <span>No sections fell below 60%, but {middle.map(s => s.module).join(" and ")} {middle.length === 1 ? "has" : "have"} room for growth.</span>
          )}
          {weak.length > 0 && (
            <span>
              {weak.length === 1
                ? `The weakest area was ${weak[0].module}, which needs focused review.`
                : `The weakest areas were ${weak.map(s => s.module).join(" and ")}, which need targeted review.`}
            </span>
          )}
        </p>
      </Card>

      {/* What they did well */}
      {strong.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="w-4 h-4 text-primary shrink-0" />
            <p className="font-semibold text-sm text-primary">Strengths</p>
          </div>
          <ul className="space-y-2">
            {strong.map((s) => {
              const { pct, feedback } = getModuleFeedback(s);
              return (
                <li key={s.module} className="text-xs leading-relaxed text-foreground/80">
                  <strong className="text-foreground">{s.module} ({pct}%):</strong>{" "}
                  {feedback.strong}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* What needs work */}
      {(weak.length > 0 || middle.length > 0) && (
        <Card className="p-4 bg-destructive/5 border-destructive/20 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsDown className="w-4 h-4 text-destructive shrink-0" />
            <p className="font-semibold text-sm text-destructive">Areas to Improve</p>
          </div>
          <ul className="space-y-2">
            {[...weak, ...middle].map((s) => {
              const { pct, feedback } = getModuleFeedback(s);
              return (
                <li key={s.module} className="text-xs leading-relaxed text-foreground/80">
                  <strong className="text-foreground">{s.module} ({pct}%):</strong>{" "}
                  {feedback.weak}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* Personalized next step */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-accent mb-1">Personalized Next Step</p>
            <p className="text-xs leading-relaxed text-foreground/80">
              {weak.length > 0
                ? `As a ${scenario.job.title} earning $${scenario.monthlyNet.toLocaleString()}/month, the most impactful thing ${scenario.name.split(" ")[0]} can do is master ${weak[0].module.toLowerCase()} — this directly affects their day-to-day financial decisions.`
                : overallPct >= 85
                ? `${scenario.name.split(" ")[0]} is ready for the next level — consider exploring real-world applications like opening a high-yield savings account, filing a practice tax return, or setting up an automated budget.`
                : `${scenario.name.split(" ")[0]} should revisit the Education Hub articles for ${middle[0]?.module || scores[0].module} and try explaining the concepts out loud — teaching is the best way to solidify understanding.`}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}