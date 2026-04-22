// XP awarded per correct answer and per completed module
export const XP_PER_CORRECT = 15;
export const XP_PER_MODULE = 25;
export const XP_PERFECT_BONUS = 50; // all correct in a module

export const LEVELS = [
  { level: 1, title: "Penny Pincher", minXP: 0, color: "#94a3b8" },
  { level: 2, title: "Budget Rookie", minXP: 100, color: "#60a5fa" },
  { level: 3, title: "Money Apprentice", minXP: 250, color: "#34d399" },
  { level: 4, title: "Finance Scholar", minXP: 450, color: "#a78bfa" },
  { level: 5, title: "Dollar Dynamo", minXP: 700, color: "#f59e0b" },
  { level: 6, title: "Budget Master", minXP: 1000, color: "#f97316" },
  { level: 7, title: "Money Mogul", minXP: 1400, color: "#ef4444" },
  { level: 8, title: "Financial Genius", minXP: 1900, color: "#ec4899" },
];

export function getLevel(xp) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) current = l;
  }
  const nextLevel = LEVELS.find((l) => l.minXP > xp) || null;
  const progress = nextLevel
    ? ((xp - current.minXP) / (nextLevel.minXP - current.minXP)) * 100
    : 100;
  return { ...current, nextLevel, progress, xp };
}

export function calcXP(scores) {
  let xp = 0;
  for (const s of scores) {
    xp += s.correct * XP_PER_CORRECT;
    xp += XP_PER_MODULE;
    if (s.correct === s.total) xp += XP_PERFECT_BONUS;
  }
  return xp;
}

export function calcFinancialHealthScore(scores, scenario) {
  if (!scores.length || !scenario) return 0;
  const totalCorrect = scores.reduce((a, s) => a + s.correct, 0);
  const totalQs = scores.reduce((a, s) => a + s.total, 0);
  const accuracy = totalCorrect / totalQs;

  // Factor in scenario financial health
  const rentRatio = scenario.fixedExpenses.rent / scenario.monthlyNet;
  const housingScore = rentRatio <= 0.3 ? 1 : rentRatio <= 0.4 ? 0.7 : 0.4;

  const discretionaryRatio = scenario.discretionary / scenario.monthlyNet;
  const budgetScore = discretionaryRatio > 0.15 ? 1 : discretionaryRatio > 0.05 ? 0.6 : 0.3;

  const rawScore = (accuracy * 0.6 + housingScore * 0.2 + budgetScore * 0.2) * 850;
  return Math.round(Math.min(850, Math.max(300, rawScore)));
}

export function getFinancialHealthLabel(score) {
  if (score >= 750) return { label: "Excellent", color: "text-primary" };
  if (score >= 670) return { label: "Good", color: "text-chart-3" };
  if (score >= 580) return { label: "Fair", color: "text-accent" };
  return { label: "Needs Work", color: "text-destructive" };
}

export function getGoals(scenario) {
  if (!scenario) return [];
  const goals = [];

  if (scenario.lifeEvent.monthlyPayment > 0) {
    // Debt payoff goal
    const debtMap = {
      "student loan": { total: 4200, label: "Pay Off Student Loan", icon: "🎓" },
      "credit card": { total: 2800, label: "Pay Off Credit Card Debt", icon: "💳" },
      "medical": { total: 1500, label: "Pay Off Medical Bills", icon: "🏥" },
    };
    const key = Object.keys(debtMap).find((k) => scenario.lifeEvent.description.toLowerCase().includes(k));
    const debt = key ? debtMap[key] : { total: 2000, label: "Pay Off Debt", icon: "💰" };
    goals.push({
      id: "debt",
      label: debt.label,
      icon: debt.icon,
      target: debt.total,
      monthly: scenario.lifeEvent.monthlyPayment,
      type: "debt",
      color: "bg-destructive",
      unit: "$",
    });
  }

  if (scenario.savingsGoal > 0) {
    const savingsMap = {
      "vacation": { total: 2400, label: "Save for Vacation", icon: "✈️" },
      "emergency": { total: 1000, label: "Build Emergency Fund", icon: "🛡️" },
      "invest": { total: 1200, label: "Start Investing ($100/mo)", icon: "📈" },
    };
    const key = Object.keys(savingsMap).find((k) => scenario.lifeEvent.description.toLowerCase().includes(k));
    const savings = key ? savingsMap[key] : { total: 1000, label: "Reach Savings Goal", icon: "🏦" };
    goals.push({
      id: "savings",
      label: savings.label,
      icon: savings.icon,
      target: savings.total,
      monthly: scenario.savingsGoal,
      type: "savings",
      color: "bg-primary",
      unit: "$",
    });
  }

  // Emergency fund goal (always)
  if (!goals.find((g) => g.label.includes("Emergency"))) {
    goals.push({
      id: "emergency",
      label: "Build Emergency Fund",
      icon: "🛡️",
      target: Math.round(scenario.monthlyNet * 3),
      monthly: Math.round(scenario.discretionary * 0.3),
      type: "savings",
      color: "bg-chart-3",
      unit: "$",
    });
  }

  // Budget mastery
  goals.push({
    id: "budget",
    label: "Keep Housing Under 30%",
    icon: "🏠",
    target: 30,
    current: Math.round((scenario.fixedExpenses.rent / scenario.monthlyNet) * 100),
    type: "ratio",
    color: scenario.fixedExpenses.rent / scenario.monthlyNet <= 0.3 ? "bg-primary" : "bg-accent",
    unit: "%",
    inverse: true, // lower is better
  });

  return goals;
}

// XP milestones that trigger celebrations
export const XP_MILESTONES = [100, 250, 450, 700, 1000, 1400];