const jobs = [
  { title: "Graphic Designer", annualSalary: 42000, payFrequency: "bi-weekly", icon: "Palette" },
  { title: "Restaurant Manager", annualSalary: 38000, payFrequency: "bi-weekly", icon: "UtensilsCrossed" },
  { title: "Electrician Apprentice", annualSalary: 34000, payFrequency: "weekly", icon: "Zap" },
  { title: "Dental Hygienist", annualSalary: 52000, payFrequency: "bi-weekly", icon: "Heart" },
  { title: "Software Developer", annualSalary: 58000, payFrequency: "bi-weekly", icon: "Monitor" },
  { title: "Veterinary Technician", annualSalary: 32000, payFrequency: "bi-weekly", icon: "Dog" },
  { title: "Auto Mechanic", annualSalary: 36000, payFrequency: "weekly", icon: "Wrench" },
  { title: "Marketing Coordinator", annualSalary: 40000, payFrequency: "bi-weekly", icon: "Megaphone" },
  { title: "Registered Nurse", annualSalary: 55000, payFrequency: "bi-weekly", icon: "Stethoscope" },
  { title: "Construction Foreman", annualSalary: 45000, payFrequency: "weekly", icon: "HardHat" },
  { title: "Freelance Photographer", annualSalary: 30000, payFrequency: "monthly", icon: "Camera" },
  { title: "Bank Teller", annualSalary: 33000, payFrequency: "bi-weekly", icon: "Landmark" },
];

const livingSituations = [
  { description: "You rent a 1-bedroom apartment by yourself.", monthlyRent: 950, utilities: 120, landlord: "Greenview Property Management", utilityCompany: "CityLight & Power" },
  { description: "You share a 2-bedroom apartment with a roommate.", monthlyRent: 600, utilities: 80, landlord: "Oakwood Rentals LLC", utilityCompany: "Metro Energy Services" },
  { description: "You live in a studio apartment downtown.", monthlyRent: 1100, utilities: 100, landlord: "Downtown Living Co.", utilityCompany: "Apex Utilities Inc." },
  { description: "You rent a small house in the suburbs.", monthlyRent: 1200, utilities: 160, landlord: "Sunrise Home Rentals", utilityCompany: "Suburban Power & Gas" },
  { description: "You live with family and pay reduced rent.", monthlyRent: 400, utilities: 50, landlord: "Family (personal arrangement)", utilityCompany: "CityLight & Power" },
  { description: "You share a house with two roommates.", monthlyRent: 500, utilities: 65, landlord: "Maplewood Properties", utilityCompany: "Tri-County Electric" },
];

const vehicles = [
  { description: "You drive a used 2018 Honda Civic.", payment: 220, insurance: 110, gas: 120 },
  { description: "You take public transit and occasionally rideshare.", payment: 0, insurance: 0, gas: 85 },
  { description: "You drive a used 2020 Toyota Corolla.", payment: 280, insurance: 130, gas: 110 },
  { description: "You have a paid-off 2015 Ford Focus.", payment: 0, insurance: 95, gas: 130 },
  { description: "You lease a 2024 Hyundai Elantra.", payment: 320, insurance: 140, gas: 100 },
  { description: "You bike to work and use transit in bad weather.", payment: 0, insurance: 0, gas: 45 },
];

const lifeEvents = [
  { description: "You have $4,200 in student loan debt.", monthlyPayment: 150 },
  { description: "You have $2,800 in credit card debt from moving expenses.", monthlyPayment: 120 },
  { description: "You are saving for a vacation next year ($2,400 goal).", monthlyPayment: 0, savingsGoal: 200 },
  { description: "You need to build a $1,000 emergency fund.", monthlyPayment: 0, savingsGoal: 100 },
  { description: "You have medical bills of $1,500 from last year.", monthlyPayment: 100 },
  { description: "You want to start investing — goal is $100/month.", monthlyPayment: 0, savingsGoal: 100 },
];

const filingStatuses = [
  { status: "Single, no dependents", filing: "single", dependents: 0 },
  { status: "Single, one dependent (younger sibling you support)", filing: "head_of_household", dependents: 1 },
  { status: "Married filing jointly, no kids", filing: "married_jointly", dependents: 0 },
  { status: "Single, no dependents, side hustle income", filing: "single", dependents: 0, sideIncome: true },
];

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateScenario(studentName, pathId = "conservative") {
  const seed = hashString(studentName.toLowerCase().trim());
  const rand = seededRandom(seed);

  const job = jobs[Math.floor(rand() * jobs.length)];
  const living = livingSituations[Math.floor(rand() * livingSituations.length)];
  const vehicle = vehicles[Math.floor(rand() * vehicles.length)];
  const lifeEvent = lifeEvents[Math.floor(rand() * lifeEvents.length)];
  const filingStatus = filingStatuses[Math.floor(rand() * filingStatuses.length)];

  // Path modifiers — imported lazily to avoid circular deps
  const pathModifiers = {
    conservative: { salaryMult: 0.92, debtMult: 0.55, startingDebt: 1800, emergencyTarget: 1000 },
    aggressive:   { salaryMult: 1.18, debtMult: 1.60, startingDebt: 7500, emergencyTarget: 3000 },
    entrepreneurial: { salaryMult: 1.0, debtMult: 1.0, startingDebt: 4200, emergencyTarget: 2000, sideIncome: true },
  };
  const mods = pathModifiers[pathId] || pathModifiers.conservative;

  const baseAnnualSalary = Math.round(job.annualSalary * mods.salaryMult);
  const monthlyGross = Math.round(baseAnnualSalary / 12);

  // Entrepreneurial gets bonus side income
  const sideIncomeMonthly = mods.sideIncome ? Math.round(monthlyGross * 0.15) : 0;

  const federalTaxRate = baseAnnualSalary > 44725 ? 0.22 : baseAnnualSalary > 11000 ? 0.12 : 0.10;
  const stateTaxRate = 0.05;
  const ficaRate = 0.0765;
  const totalDeductions = federalTaxRate + stateTaxRate + ficaRate;
  const monthlyNet = Math.round((monthlyGross + sideIncomeMonthly) * (1 - totalDeductions));

  const adjustedDebtPayment = Math.round(lifeEvent.monthlyPayment * mods.debtMult);

  const fixedExpenses = {
    rent: living.monthlyRent,
    utilities: living.utilities,
    carPayment: vehicle.payment,
    carInsurance: vehicle.insurance,
    gas: vehicle.gas,
    phone: 65,
    groceries: 280,
    healthInsurance: Math.round(monthlyGross * 0.04),
    debtPayment: adjustedDebtPayment,
  };

  const totalFixed = Object.values(fixedExpenses).reduce((a, b) => a + b, 0);
  const discretionary = monthlyNet - totalFixed;

  // Override life event debt amount to match path
  const adjustedLifeEvent = {
    ...lifeEvent,
    monthlyPayment: adjustedDebtPayment,
    startingDebt: mods.startingDebt,
  };

  return {
    name: studentName,
    pathId,
    job: { ...job, annualSalary: baseAnnualSalary },
    living,
    vehicle,
    lifeEvent: adjustedLifeEvent,
    filingStatus,
    monthlyGross,
    monthlyNet,
    sideIncomeMonthly,
    federalTaxRate,
    stateTaxRate,
    ficaRate,
    fixedExpenses,
    totalFixed,
    discretionary,
    savingsGoal: lifeEvent.savingsGoal || 0,
    emergencyFundTarget: mods.emergencyTarget,
  };
}

export function getBudgetQuestions(scenario) {
  return [
    {
      id: "needs_vs_wants",
      question: `Your monthly take-home pay is $${scenario.monthlyNet.toLocaleString()}. Your fixed expenses total $${scenario.totalFixed.toLocaleString()}. How much discretionary income do you have left?`,
      options: [
        `$${(scenario.discretionary + 200).toLocaleString()}`,
        `$${scenario.discretionary.toLocaleString()}`,
        `$${(scenario.discretionary - 150).toLocaleString()}`,
        `$${(scenario.monthlyGross - scenario.totalFixed).toLocaleString()}`,
      ],
      correctIndex: 1,
      explanation: `Take-home pay ($${scenario.monthlyNet.toLocaleString()}) minus fixed expenses ($${scenario.totalFixed.toLocaleString()}) = $${scenario.discretionary.toLocaleString()} discretionary income.`,
    },
    {
      id: "50_30_20",
      question: "The 50/30/20 budget rule suggests dividing your after-tax income into three categories. What are they?",
      options: [
        "50% savings, 30% needs, 20% wants",
        "50% needs, 30% wants, 20% savings & debt",
        "50% rent, 30% food, 20% entertainment",
        "50% wants, 30% needs, 20% taxes",
      ],
      correctIndex: 1,
      explanation: "The 50/30/20 rule: 50% goes to needs (housing, food, insurance), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment.",
    },
    {
      id: "emergency_fund",
      question: `As a ${scenario.job.title} earning $${scenario.monthlyNet.toLocaleString()}/month, what is the recommended emergency fund amount?`,
      options: [
        `$${(scenario.monthlyNet * 1).toLocaleString()} (1 month)`,
        `$${(scenario.monthlyNet * 3).toLocaleString()} (3 months)`,
        `$${(scenario.monthlyNet * 6).toLocaleString()} (3-6 months)`,
        `$${(scenario.monthlyNet * 12).toLocaleString()} (12 months)`,
      ],
      correctIndex: 2,
      explanation: "Financial experts recommend saving 3-6 months of expenses in an emergency fund. This provides a safety net for unexpected job loss, medical bills, or major repairs.",
    },
    {
      id: "budget_category",
      question: `Your rent of $${scenario.fixedExpenses.rent}/month is what percentage of your take-home pay?`,
      options: [
        `${Math.round((scenario.fixedExpenses.rent / scenario.monthlyNet) * 100)}% — ${Math.round((scenario.fixedExpenses.rent / scenario.monthlyNet) * 100) <= 30 ? "Within the recommended 30%" : "Over the recommended 30%"}`,
        `${Math.round((scenario.fixedExpenses.rent / scenario.monthlyGross) * 100)}% of gross pay`,
        `${Math.round((scenario.fixedExpenses.rent / scenario.totalFixed) * 100)}% of fixed expenses`,
        "It doesn't matter as long as bills are paid",
      ],
      correctIndex: 0,
      explanation: `Your rent ($${scenario.fixedExpenses.rent}) is ${Math.round((scenario.fixedExpenses.rent / scenario.monthlyNet) * 100)}% of your take-home pay ($${scenario.monthlyNet.toLocaleString()}). The general rule is to spend no more than 30% of income on housing.`,
    },
    {
      id: "savings_priority",
      question: `${scenario.lifeEvent.description} What should be your top financial priority?`,
      options: [
        "Spend all discretionary income on entertainment",
        "Pay only minimum payments and save nothing",
        "Build an emergency fund while making regular debt/savings payments",
        "Take on more debt to invest in crypto",
      ],
      correctIndex: 2,
      explanation: "The best approach is to balance building an emergency fund with regular debt payments or savings contributions. Having an emergency fund prevents you from going deeper into debt when unexpected expenses arise.",
    },
  ];
}

export function getTaxQuestions(scenario) {
  const standardDeduction = scenario.filingStatus.filing === "single" ? 14600 :
    scenario.filingStatus.filing === "married_jointly" ? 29200 : 21900;
  const taxableIncome = Math.max(0, scenario.job.annualSalary - standardDeduction);

  return [
    {
      id: "w2_purpose",
      question: "What document does your employer send you by January 31st that you need to file taxes?",
      options: ["W-4", "W-2", "1099", "I-9"],
      correctIndex: 1,
      explanation: "A W-2 form shows your total earnings and taxes withheld for the year. Your employer must send this to you by January 31st. A W-4 is what you fill out when hired, a 1099 is for independent contractors, and an I-9 verifies employment eligibility.",
    },
    {
      id: "filing_status",
      question: `Your situation: ${scenario.filingStatus.status}. What is your filing status?`,
      options: ["Single", "Married Filing Jointly", "Head of Household", "Married Filing Separately"],
      correctIndex: scenario.filingStatus.filing === "single" ? 0 :
        scenario.filingStatus.filing === "married_jointly" ? 1 : 2,
      explanation: `Based on your situation (${scenario.filingStatus.status}), your correct filing status is ${scenario.filingStatus.filing === "single" ? "Single" : scenario.filingStatus.filing === "married_jointly" ? "Married Filing Jointly" : "Head of Household"}. Your filing status affects your tax brackets and standard deduction.`,
    },
    {
      id: "standard_deduction",
      question: `For the 2024 tax year with your filing status, what is the standard deduction?`,
      options: [
        `$${(standardDeduction - 2000).toLocaleString()}`,
        `$${standardDeduction.toLocaleString()}`,
        `$${(standardDeduction + 3000).toLocaleString()}`,
        `$${(standardDeduction * 2).toLocaleString()}`,
      ],
      correctIndex: 1,
      explanation: `The 2024 standard deduction for ${scenario.filingStatus.filing === "single" ? "Single filers" : scenario.filingStatus.filing === "married_jointly" ? "Married Filing Jointly" : "Head of Household"} is $${standardDeduction.toLocaleString()}. This reduces your taxable income before calculating tax owed.`,
    },
    {
      id: "taxable_income",
      question: `Your annual salary is $${scenario.job.annualSalary.toLocaleString()}. After the standard deduction of $${standardDeduction.toLocaleString()}, what is your taxable income?`,
      options: [
        `$${scenario.job.annualSalary.toLocaleString()}`,
        `$${taxableIncome.toLocaleString()}`,
        `$${(taxableIncome - 5000).toLocaleString()}`,
        `$${standardDeduction.toLocaleString()}`,
      ],
      correctIndex: 1,
      explanation: `Taxable income = Gross income - Standard deduction. $${scenario.job.annualSalary.toLocaleString()} - $${standardDeduction.toLocaleString()} = $${taxableIncome.toLocaleString()}. You only pay taxes on this amount, not your total salary.`,
    },
    {
      id: "fica_knowledge",
      question: "FICA taxes fund two important programs. What are they?",
      options: [
        "Medicare and Medicaid",
        "Social Security and Medicare",
        "Federal income tax and state tax",
        "Unemployment insurance and workers' comp",
      ],
      correctIndex: 1,
      explanation: "FICA stands for Federal Insurance Contributions Act. It funds Social Security (6.2%) and Medicare (1.45%), totaling 7.65% of your gross pay. Your employer matches this amount.",
    },
  ];
}

export function getFinancialLiteracyQuestions(scenario) {
  return [
    {
      id: "credit_score",
      question: "Which of the following has the BIGGEST impact on your credit score?",
      options: [
        "How much money is in your bank account",
        "Your payment history (paying bills on time)",
        "Your age",
        "Your income level",
      ],
      correctIndex: 1,
      explanation: "Payment history accounts for about 35% of your credit score — the single biggest factor. Income, age, and bank balance are NOT directly part of your credit score calculation.",
    },
    {
      id: "compound_interest",
      question: "If you invest $100/month starting at age 22 with an average 7% annual return, approximately how much will you have at age 62?",
      options: ["$48,000", "$96,000", "$240,000", "$264,000"],
      correctIndex: 2,
      explanation: "Thanks to compound interest, $100/month over 40 years at 7% grows to approximately $240,000 — even though you only invested $48,000 total. Starting early is the most powerful financial decision you can make.",
    },
    {
      id: "insurance_purpose",
      question: `As a ${scenario.job.title}, which type of insurance is MOST important if you can only afford one?`,
      options: [
        "Pet insurance",
        "Health insurance",
        "Extended warranty on electronics",
        "Travel insurance",
      ],
      correctIndex: 1,
      explanation: "Health insurance is essential — a single ER visit can cost $5,000+, and a hospital stay can cost tens of thousands. Medical debt is the #1 cause of bankruptcy in the US.",
    },
    {
      id: "interest_rates",
      question: "You're comparing two savings accounts. Bank A offers 0.01% APY, Bank B offers 4.5% APY. On $5,000 saved for one year, how much more interest does Bank B earn?",
      options: ["About $5 more", "About $25 more", "About $225 more", "About $2,250 more"],
      correctIndex: 2,
      explanation: "Bank A: $5,000 × 0.01% = $0.50/year. Bank B: $5,000 × 4.5% = $225/year. That's about $224.50 more! Always shop around for the best savings rates — high-yield savings accounts can make a big difference.",
    },
    {
      id: "identity_theft",
      question: "Which is the BEST way to protect yourself from identity theft?",
      options: [
        "Never use a credit card",
        "Use strong unique passwords and monitor your credit regularly",
        "Only use cash for all purchases",
        "Avoid having a bank account",
      ],
      correctIndex: 1,
      explanation: "Strong passwords, two-factor authentication, and regular credit monitoring are the best defenses. Avoiding credit entirely actually makes it harder to detect fraud. You can check your credit report for free at AnnualCreditReport.com.",
    },
  ];
}