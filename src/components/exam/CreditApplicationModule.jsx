import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, CreditCard, Star } from "lucide-react";

const CREDIT_TYPES = [
  {
    id: "secured",
    name: "Secured Credit Card",
    icon: "🔒",
    apr: "22.99%",
    limit: "$200–$500",
    requirement: "Requires a cash deposit (your credit limit)",
    bestFor: "Building credit from scratch",
    correct: true,
  },
  {
    id: "rewards",
    name: "Premium Rewards Card",
    icon: "✈️",
    apr: "27.99%",
    limit: "$5,000+",
    requirement: "Excellent credit score (750+) required",
    bestFor: "Frequent travelers with great credit",
    correct: false,
  },
  {
    id: "store",
    name: "Department Store Card",
    icon: "🛍️",
    apr: "29.99%",
    limit: "$300–$800",
    requirement: "Easy approval but very high interest",
    bestFor: "Store discounts (but risky)",
    correct: false,
  },
  {
    id: "personal_loan",
    name: "Personal Loan",
    icon: "🏦",
    apr: "18–36%",
    limit: "$1,000–$10,000",
    requirement: "Income verification, credit check",
    bestFor: "Large one-time expenses",
    correct: false,
  },
];

const APPLICATION_FIELDS = [
  { id: "fullName", label: "Full Legal Name", placeholder: "As on government ID", hint: "Must match ID exactly" },
  { id: "ssn", label: "Social Security Number", placeholder: "XXX-XX-XXXX", hint: "Used for credit check (hard inquiry)" },
  { id: "dob", label: "Date of Birth", placeholder: "MM/DD/YYYY", hint: "Must be 18 or older" },
  { id: "address", label: "Current Address", placeholder: "123 Main St, City, ST 00000", hint: "Must be current residence" },
  { id: "annualIncome", label: "Annual Income", placeholder: "$0.00", hint: "Gross income before taxes" },
  { id: "employment", label: "Employer Name", placeholder: "Company name", hint: "Current employer" },
  { id: "housingPayment", label: "Monthly Housing Payment", placeholder: "$0.00", hint: "Rent or mortgage amount" },
];

const KNOWLEDGE_QUESTIONS = [
  {
    id: "apr",
    question: "Your secured credit card has a 22.99% APR. You carry a $400 balance for one full month. Approximately how much interest do you owe?",
    options: ["About $0 — there's a grace period", "About $7.66", "About $22.99", "About $91.96"],
    correctIndex: 1,
    explanation: "Monthly interest = Balance × (APR ÷ 12) = $400 × (22.99% ÷ 12) ≈ $7.66. If you pay your full balance by the due date each month, you pay ZERO interest. Always pay in full!",
  },
  {
    id: "utilization",
    question: "Your credit limit is $500. To keep a healthy credit score, how much should you spend on the card each month?",
    options: ["Up to $500 (use it fully)", "Up to $250 (under 50%)", "Under $150 (under 30%)", "Under $50 (under 10%)"],
    correctIndex: 2,
    explanation: "Credit utilization — how much of your limit you use — is 30% of your credit score. Experts recommend staying under 30% of your limit. On a $500 card, that's under $150.",
  },
  {
    id: "hard_inquiry",
    question: "When you apply for the secured card, the bank does a 'hard inquiry.' What happens to your credit score?",
    options: [
      "Nothing — inquiries don't affect scores",
      "It drops by 50–100 points permanently",
      "It may drop 5–10 points temporarily",
      "It immediately improves your score",
    ],
    correctIndex: 2,
    explanation: "A hard inquiry can temporarily lower your score by 5–10 points for up to 12 months, then disappears from your report after 2 years. Don't apply for multiple cards at once — each inquiry adds up.",
  },
  {
    id: "missed_payment",
    question: "You forget to pay your credit card bill this month. What is the WORST consequence?",
    options: [
      "You lose your rewards points",
      "The bank calls you once",
      "A late payment on your credit report for up to 7 years, hurting your score",
      "Your account is immediately closed",
    ],
    correctIndex: 2,
    explanation: "A missed payment (30+ days late) is reported to all three credit bureaus and stays on your credit report for 7 years. It's the #1 damage to your credit score. Set up autopay for at least the minimum payment!",
  },
];

const STEPS = ["Pick a Card", "Fill Application", "Credit Knowledge"];

export default function CreditApplicationModule({ scenario, onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardConfirmed, setCardConfirmed] = useState(false);
  const [formFields, setFormFields] = useState({});
  const [formVerified, setFormVerified] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizConfirmed, setQuizConfirmed] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(0);

  const q = KNOWLEDGE_QUESTIONS[quizIndex];

  const handleCardConfirm = () => setCardConfirmed(true);
  const handleCardNext = () => setStep(1);

  const updateField = (id, val) => setFormFields((f) => ({ ...f, [id]: val }));
  const handleFormVerify = () => {
    const missing = APPLICATION_FIELDS.filter(f => !formFields[f.id]?.trim()).map(f => f.id);
    setFormErrors(missing);
    setFormVerified(true);
  };
  const handleFormNext = () => setStep(2);

  const handleQuizConfirm = () => setQuizConfirmed(true);
  const handleQuizNext = () => {
    const correct = quizSelected === q.correctIndex;
    const newCorrect = quizCorrect + (correct ? 1 : 0);
    if (quizIndex + 1 >= KNOWLEDGE_QUESTIONS.length) {
      const cardScore = selectedCard === "secured" ? 1 : 0;
      const formScore = formErrors.length === 0 ? 1 : 0;
      onComplete({ module: "Credit Application", correct: cardScore + formScore + newCorrect, total: 6 });
    } else {
      setQuizIndex(quizIndex + 1);
      setQuizSelected(null);
      setQuizConfirmed(false);
      setQuizCorrect(newCorrect);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-chart-4/15">
            <CreditCard className="w-4 h-4 text-chart-4" />
          </div>
          <span className="font-semibold text-sm">Applying for Credit</span>
        </div>
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"}`} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {step + 1} of 3 — {STEPS[step]}</p>
      </div>

      {/* STEP 0: Pick a card */}
      {step === 0 && (
        <div>
          <Card className="p-4 bg-muted/40 border-dashed mb-5">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                You're a new <strong>{scenario.job.title}</strong> with no credit history. You want to start building credit responsibly. Which type of credit product is BEST for someone just starting out?
              </p>
            </div>
          </Card>

          <div className="grid gap-3">
            {CREDIT_TYPES.map((card) => (
              <button key={card.id} onClick={() => !cardConfirmed && setSelectedCard(card.id)} disabled={cardConfirmed}
                className={`text-left w-full p-4 rounded-xl border-2 transition-all ${
                  cardConfirmed
                    ? card.id === "secured" ? "border-primary bg-primary/5"
                    : card.id === selectedCard ? "border-destructive bg-destructive/5 opacity-60"
                    : "border-border opacity-40"
                  : selectedCard === card.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{card.icon}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{card.name}</span>
                      {cardConfirmed && card.id === "secured" && <Badge className="text-xs bg-primary/10 text-primary border-primary/20">✓ Best Choice</Badge>}
                      {cardConfirmed && card.id === selectedCard && card.id !== "secured" && <Badge variant="destructive" className="text-xs">Not Ideal</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>APR: <strong>{card.apr}</strong></span>
                      <span>·</span>
                      <span>Limit: <strong>{card.limit}</strong></span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{card.requirement}</p>
                    <p className="text-xs font-medium mt-1 text-foreground/70">Best for: {card.bestFor}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {cardConfirmed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                <Card className={`p-4 ${selectedCard === "secured" ? "bg-primary/5 border-primary/20" : "bg-accent/5 border-accent/20"}`}>
                  <div className="flex items-start gap-2.5">
                    {selectedCard === "secured" ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <XCircle className="w-5 h-5 text-accent shrink-0" />}
                    <div>
                      <p className="font-semibold text-sm mb-1">{selectedCard === "secured" ? "Smart choice!" : "A secured card is the best starting point."}</p>
                      <p className="text-xs text-muted-foreground">With no credit history, you likely won't qualify for premium cards. A secured card requires a small deposit but reports to all 3 credit bureaus — use it responsibly for 6–12 months to build your score.</p>
                    </div>
                  </div>
                </Card>
                <Button onClick={handleCardNext} className="w-full mt-4 h-11 gap-2">Next: Fill Application <ArrowRight className="w-4 h-4" /></Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!cardConfirmed && (
            <Button onClick={handleCardConfirm} disabled={!selectedCard} className="w-full mt-5 h-11 gap-2">
              <Lightbulb className="w-4 h-4" /> Confirm My Choice
            </Button>
          )}
        </div>
      )}

      {/* STEP 1: Application Form */}
      {step === 1 && (
        <div>
          <Card className="p-4 bg-muted/40 border-dashed mb-5">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Fill out the secured credit card application for <strong>{scenario.name}</strong>. Use your scenario details where applicable.</p>
            </div>
          </Card>

          <Card className="p-5 border-2 bg-card">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <p className="font-display font-bold text-sm">First National Bank</p>
                <p className="text-[10px] text-muted-foreground">Secured Credit Card Application</p>
              </div>
            </div>

            {/* Credit card preview */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-4 mb-4 text-white">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-semibold opacity-70">SECURED VISA</p>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-yellow-400/80" />
                  <div className="w-6 h-6 rounded-full bg-yellow-600/80 -ml-2" />
                </div>
              </div>
              <p className="font-mono text-sm tracking-widest mb-3 opacity-60">•••• •••• •••• ••••</p>
              <p className="text-xs font-semibold">{scenario.name.toUpperCase()}</p>
            </div>

            <div className="grid gap-4">
              {APPLICATION_FIELDS.map((field) => {
                const hasError = formVerified && formErrors.includes(field.id);
                return (
                  <div key={field.id}>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      {field.label} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={formFields[field.id] || ""}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={formVerified}
                      className={`h-9 text-sm ${hasError ? "border-destructive" : formVerified ? "border-primary/40" : ""}`}
                    />
                    <p className={`text-[10px] mt-0.5 ${hasError ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {hasError ? "⚠ Required field" : field.hint}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          <AnimatePresence>
            {formVerified && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                <Card className={`p-4 ${formErrors.length === 0 ? "bg-primary/5 border-primary/20" : "bg-accent/5 border-accent/20"}`}>
                  <div className="flex items-start gap-2.5">
                    {formErrors.length === 0 ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <XCircle className="w-5 h-5 text-accent shrink-0" />}
                    <div>
                      <p className="font-semibold text-sm mb-1">
                        {formErrors.length === 0 ? "Application submitted!" : `${formErrors.length} field(s) missing.`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formErrors.length === 0
                          ? "The bank will do a hard credit inquiry and review your income-to-debt ratio before approving."
                          : "Credit applications require all fields to comply with federal lending laws (Equal Credit Opportunity Act)."}
                      </p>
                    </div>
                  </div>
                </Card>
                <Button onClick={handleFormNext} className="w-full mt-4 h-11 gap-2">Next: Credit Knowledge <ArrowRight className="w-4 h-4" /></Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!formVerified && (
            <Button onClick={handleFormVerify} className="w-full mt-5 h-11 gap-2">
              <Lightbulb className="w-4 h-4" /> Submit Application
            </Button>
          )}
        </div>
      )}

      {/* STEP 2: Knowledge Quiz */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-xs">Credit Knowledge</Badge>
            <span className="text-xs text-muted-foreground">{quizIndex + 1} of {KNOWLEDGE_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-5">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(quizIndex / KNOWLEDGE_QUESTIONS.length) * 100}%` }} />
          </div>

          <h3 className="font-display text-lg font-semibold mb-5 leading-snug">{q.question}</h3>

          <div className="grid gap-2.5">
            {q.options.map((opt, idx) => {
              let style = "border-border hover:border-primary/40 hover:bg-primary/5";
              if (quizConfirmed) {
                if (idx === q.correctIndex) style = "border-primary bg-primary/10";
                else if (idx === quizSelected) style = "border-destructive bg-destructive/5 opacity-60";
                else style = "border-border opacity-40";
              } else if (idx === quizSelected) style = "border-primary bg-primary/5";
              return (
                <button key={idx} onClick={() => !quizConfirmed && setQuizSelected(idx)} disabled={quizConfirmed}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${style}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                      quizConfirmed && idx === q.correctIndex ? "border-primary bg-primary" :
                      quizConfirmed && idx === quizSelected ? "border-destructive bg-destructive" :
                      idx === quizSelected ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                      {quizConfirmed && idx === q.correctIndex && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {quizConfirmed && idx === quizSelected && idx !== q.correctIndex && <XCircle className="w-3 h-3 text-white" />}
                      {!quizConfirmed && idx === quizSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {quizConfirmed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                <Card className={`p-4 ${quizSelected === q.correctIndex ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"}`}>
                  <div className="flex items-start gap-2.5">
                    {quizSelected === q.correctIndex ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                    <div>
                      <p className="font-semibold text-sm mb-1">{quizSelected === q.correctIndex ? "Correct!" : "Not quite."}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5">
            {!quizConfirmed ? (
              <Button onClick={handleQuizConfirm} disabled={quizSelected === null} className="w-full h-11 gap-2">
                <Lightbulb className="w-4 h-4" /> Lock In Answer
              </Button>
            ) : (
              <Button onClick={handleQuizNext} className="w-full h-11 gap-2">
                {quizIndex + 1 < KNOWLEDGE_QUESTIONS.length ? "Next Question" : "Continue"} <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}