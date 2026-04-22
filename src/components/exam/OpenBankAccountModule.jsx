import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Landmark, ChevronRight } from "lucide-react";

const ACCOUNT_TYPES = [
  {
    id: "checking",
    name: "Checking Account",
    icon: "🏦",
    description: "For everyday spending — debit card, bill pay, direct deposit.",
    features: ["No limit on transactions", "Debit card access", "Online bill pay", "Usually low/no interest"],
    bestFor: "Day-to-day expenses",
    correct: true,
  },
  {
    id: "savings",
    name: "Savings Account",
    icon: "💰",
    description: "Earns interest on money you set aside — limited monthly withdrawals.",
    features: ["Earns interest (APY)", "Limited to 6 withdrawals/month", "No debit card", "FDIC insured"],
    bestFor: "Emergency fund & goals",
    correct: false,
  },
  {
    id: "cd",
    name: "Certificate of Deposit (CD)",
    icon: "🔒",
    description: "Higher interest rate but money is locked for a set term.",
    features: ["Higher interest rate", "Fixed term (3mo–5yr)", "Early withdrawal penalty", "FDIC insured"],
    bestFor: "Long-term savings",
    correct: false,
  },
];

const APPLICATION_FIELDS = [
  { id: "fullName", label: "Full Legal Name", placeholder: "As it appears on your ID", type: "text", hint: "Match your government-issued ID exactly" },
  { id: "ssn", label: "Social Security Number", placeholder: "XXX-XX-XXXX", type: "text", hint: "Required by law (Bank Secrecy Act)" },
  { id: "dob", label: "Date of Birth", placeholder: "MM/DD/YYYY", type: "text", hint: "Must be 18+ to open without a co-signer" },
  { id: "address", label: "Home Address", placeholder: "123 Main St, City, ST 00000", type: "text", hint: "Must match your government ID" },
  { id: "phone", label: "Phone Number", placeholder: "(555) 000-0000", type: "text", hint: "For account alerts and verification" },
  { id: "email", label: "Email Address", placeholder: "you@email.com", type: "email", hint: "For statements and online banking" },
  { id: "initialDeposit", label: "Initial Deposit Amount", placeholder: "$25.00", type: "text", hint: "Most banks require $25–$100 to open" },
  { id: "employment", label: "Employer / Income Source", placeholder: "Company name or 'Self-employed'", type: "text", hint: "Banks verify your ability to maintain the account" },
];

const KNOWLEDGE_QUESTIONS = [
  {
    id: "fdic",
    question: "Your new checking account is FDIC insured. What does that mean?",
    options: [
      "The bank will never charge you fees",
      "The government insures your deposits up to $250,000 if the bank fails",
      "Your debit card is protected from fraud",
      "You earn guaranteed interest",
    ],
    correctIndex: 1,
    explanation: "FDIC (Federal Deposit Insurance Corporation) insures deposits up to $250,000 per bank, per depositor. If your bank fails, your money is protected.",
  },
  {
    id: "overdraft",
    question: "You have $50 in your account and spend $75 with your debit card. What happens?",
    options: [
      "The transaction is always declined automatically",
      "You may be charged an overdraft fee (often $25–$35) if you opted in",
      "The bank covers it for free",
      "Your credit score instantly drops 100 points",
    ],
    correctIndex: 1,
    explanation: "If you opted into overdraft protection, the transaction goes through but you're charged a fee (typically $25–$35). If you didn't opt in, the transaction is declined. Always track your balance!",
  },
  {
    id: "direct_deposit",
    question: `You set up direct deposit for your ${""} paycheck. What information do you give your employer?`,
    options: [
      "Your debit card number and PIN",
      "Your routing number and account number",
      "Your SSN and bank login",
      "Your branch address only",
    ],
    correctIndex: 1,
    explanation: "To set up direct deposit, you give your employer your bank's routing number (9-digit code identifying the bank) and your account number. Never share your PIN or online banking password.",
  },
];

const STEPS = ["Choose Account Type", "Fill Application", "Banking Knowledge"];

export default function OpenBankAccountModule({ scenario, onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [typeConfirmed, setTypeConfirmed] = useState(false);
  const [formFields, setFormFields] = useState({});
  const [formVerified, setFormVerified] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizConfirmed, setQuizConfirmed] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(0);

  const totalScore = { module: "Opening a Bank Account", correct: 0, total: 3 };

  // Step 0: Choose account type
  const handleTypeConfirm = () => {
    setTypeConfirmed(true);
  };
  const handleTypeNext = () => setStep(1);

  // Step 1: Fill application
  const updateField = (id, val) => setFormFields((f) => ({ ...f, [id]: val }));
  const handleFormVerify = () => {
    const missing = APPLICATION_FIELDS.filter(f => !formFields[f.id]?.trim()).map(f => f.id);
    setFormErrors(missing);
    setFormVerified(true);
  };
  const handleFormNext = () => setStep(2);

  // Step 2: Quiz
  const handleQuizConfirm = () => setQuizConfirmed(true);
  const handleQuizNext = () => {
    const correct = quizSelected === KNOWLEDGE_QUESTIONS[quizIndex].correctIndex;
    const newCorrect = quizCorrect + (correct ? 1 : 0);
    if (quizIndex + 1 >= KNOWLEDGE_QUESTIONS.length) {
      // score: 1 for picking checking, 1 for complete form, + quiz score
      const typeScore = selectedType === "checking" ? 1 : 0;
      const formScore = formErrors.length === 0 ? 1 : 0;
      onComplete({ module: "Opening a Bank Account", correct: typeScore + formScore + newCorrect, total: 5 });
    } else {
      setQuizIndex(quizIndex + 1);
      setQuizSelected(null);
      setQuizConfirmed(false);
      setQuizCorrect(newCorrect);
    }
  };

  const q = KNOWLEDGE_QUESTIONS[quizIndex];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-chart-3/15">
            <Landmark className="w-4 h-4 text-chart-3" />
          </div>
          <span className="font-semibold text-sm">Opening a Bank Account</span>
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

      {/* STEP 0: Choose Account Type */}
      {step === 0 && (
        <div>
          <Card className="p-4 bg-muted/40 border-dashed mb-5">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                You just started your new job as a <strong>{scenario.job.title}</strong>. Your employer asks for your bank account info for direct deposit. First, you need to open the right type of account. Which account should you open for everyday spending and direct deposit?
              </p>
            </div>
          </Card>

          <div className="grid gap-3">
            {ACCOUNT_TYPES.map((acct) => (
              <button
                key={acct.id}
                onClick={() => !typeConfirmed && setSelectedType(acct.id)}
                disabled={typeConfirmed}
                className={`text-left w-full p-4 rounded-xl border-2 transition-all ${
                  typeConfirmed
                    ? acct.id === "checking"
                      ? "border-primary bg-primary/5"
                      : acct.id === selectedType
                      ? "border-destructive bg-destructive/5 opacity-70"
                      : "border-border opacity-40"
                    : selectedType === acct.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{acct.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{acct.name}</span>
                      {typeConfirmed && acct.id === "checking" && (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">✓ Correct Choice</Badge>
                      )}
                      {typeConfirmed && acct.id === selectedType && acct.id !== "checking" && (
                        <Badge variant="destructive" className="text-xs">Not Ideal</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{acct.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {acct.features.map((f) => (
                        <span key={f} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {typeConfirmed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                <Card className={`p-4 ${selectedType === "checking" ? "bg-primary/5 border-primary/20" : "bg-accent/5 border-accent/20"}`}>
                  <div className="flex items-start gap-2.5">
                    {selectedType === "checking" ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <XCircle className="w-5 h-5 text-accent shrink-0" />}
                    <div>
                      <p className="font-semibold text-sm mb-1">{selectedType === "checking" ? "Great choice!" : "A checking account is the better choice."}</p>
                      <p className="text-xs text-muted-foreground">A checking account is designed for everyday use — direct deposit, debit card purchases, and paying bills. A savings account limits withdrawals and doesn't provide a debit card for daily spending.</p>
                    </div>
                  </div>
                </Card>
                <Button onClick={handleTypeNext} className="w-full mt-4 h-11 gap-2">Next: Fill Application <ArrowRight className="w-4 h-4" /></Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!typeConfirmed && (
            <Button onClick={handleTypeConfirm} disabled={!selectedType} className="w-full mt-5 h-11 gap-2">
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
              <p className="text-sm font-medium">Fill out the bank account application for <strong>{scenario.name}</strong>. Every field is required — banks use this info to verify your identity.</p>
            </div>
          </Card>

          <Card className="p-5 border-2 bg-card">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <Landmark className="w-5 h-5 text-primary" />
              <div>
                <p className="font-display font-bold text-sm">First National Bank</p>
                <p className="text-[10px] text-muted-foreground">New Account Application — Checking</p>
              </div>
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
                      type={field.type}
                      value={formFields[field.id] || ""}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={formVerified}
                      className={`h-9 text-sm ${hasError ? "border-destructive focus-visible:ring-destructive" : formVerified ? "border-primary/40" : ""}`}
                    />
                    <p className={`text-[10px] mt-0.5 ${hasError ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {hasError ? "⚠ This field is required" : field.hint}
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
                        {formErrors.length === 0 ? "Application complete!" : `${formErrors.length} required field(s) missing.`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formErrors.length === 0
                          ? "All required information provided. Banks use this to verify your identity under the USA PATRIOT Act (Know Your Customer rules)."
                          : "All fields are required. Banks must verify your identity by law before opening an account."}
                      </p>
                    </div>
                  </div>
                </Card>
                <Button onClick={handleFormNext} className="w-full mt-4 h-11 gap-2">Next: Banking Knowledge <ArrowRight className="w-4 h-4" /></Button>
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
            <Badge variant="secondary" className="text-xs">Banking Knowledge</Badge>
            <span className="text-xs text-muted-foreground">{quizIndex + 1} of {KNOWLEDGE_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-5">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((quizIndex) / KNOWLEDGE_QUESTIONS.length) * 100}%` }} />
          </div>

          <h3 className="font-display text-lg font-semibold mb-5 leading-snug">{q.question}</h3>

          <div className="grid gap-2.5">
            {q.options.map((opt, idx) => {
              let style = "border-border hover:border-primary/40 hover:bg-primary/5";
              if (quizConfirmed) {
                if (idx === q.correctIndex) style = "border-primary bg-primary/10";
                else if (idx === quizSelected) style = "border-destructive bg-destructive/5 opacity-60";
                else style = "border-border opacity-40";
              } else if (idx === quizSelected) {
                style = "border-primary bg-primary/5";
              }
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
                    {quizSelected === q.correctIndex
                      ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      : <XCircle className="w-5 h-5 text-destructive shrink-0" />}
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