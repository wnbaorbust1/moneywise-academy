import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, PenLine } from "lucide-react";

function numberToWords(n) {
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (n === 0) return "zero";
  const dollars = Math.floor(n);
  const cents = Math.round((n - dollars) * 100);
  let words = "";
  if (dollars >= 100) {
    words += ones[Math.floor(dollars / 100)] + " hundred ";
    const remainder = dollars % 100;
    if (remainder >= 20) words += tens[Math.floor(remainder / 10)] + (remainder % 10 !== 0 ? "-" + ones[remainder % 10] : "");
    else if (remainder > 0) words += ones[remainder];
  } else if (dollars >= 20) {
    words += tens[Math.floor(dollars / 10)] + (dollars % 10 !== 0 ? "-" + ones[dollars % 10] : "");
  } else {
    words += ones[dollars];
  }
  return (words.trim() + ` and ${cents.toString().padStart(2, "0")}/100`).trim();
}

function CheckField({ label, value, placeholder, onChange, width, hint, verified }) {
  return (
    <div className={`flex flex-col gap-1 ${width}`}>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={verified !== undefined ? true : false}
          className={`h-9 text-sm font-medium border-b-2 border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-1 bg-transparent ${
            verified === true ? "border-primary text-primary" :
            verified === false ? "border-destructive text-destructive" :
            "border-border"
          }`}
        />
      </div>
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const CHECK_TASKS = [
  {
    id: "rent",
    instruction: (s) => `Write a check to your landlord for your monthly rent payment of $${s.fixedExpenses.rent}.00.`,
    payTo: (s) => "City Properties LLC",
    amount: (s) => s.fixedExpenses.rent,
    memo: "Rent",
  },
  {
    id: "electric",
    instruction: (s) => `Write a check to the electric company for $${s.fixedExpenses.utilities}.00.`,
    payTo: (s) => "Metro Electric Co.",
    amount: (s) => s.fixedExpenses.utilities,
    memo: "Electricity bill",
  },
  {
    id: "phone",
    instruction: (s) => `Write a check to your cell phone provider for $65.00.`,
    payTo: (s) => "Verizon Wireless",
    amount: (s) => 65,
    memo: "Phone bill",
  },
];

export default function WriteCheckModule({ scenario, onComplete }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [fields, setFields] = useState({ payTo: "", amount: "", writtenAmount: "", memo: "", date: "" });
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [correctCount, setCorrectCount] = useState(0);

  const task = CHECK_TASKS[taskIndex];
  const correctPayTo = task.payTo(scenario);
  const correctAmount = task.amount(scenario);
  const correctWritten = numberToWords(correctAmount);
  const today = new Date();
  const correctDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  const updateField = (key, val) => setFields((f) => ({ ...f, [key]: val }));

  const handleVerify = () => {
    const newErrors = {};
    const amountNum = parseFloat(fields.amount.replace(/[$,]/g, ""));

    if (fields.payTo.trim().toLowerCase() !== correctPayTo.toLowerCase()) newErrors.payTo = true;
    if (isNaN(amountNum) || amountNum !== correctAmount) newErrors.amount = true;
    const writtenClean = fields.writtenAmount.trim().toLowerCase().replace(/\s+/g, " ");
    const correctClean = correctWritten.toLowerCase().replace(/\s+/g, " ");
    if (writtenClean !== correctClean) newErrors.writtenAmount = true;
    if (fields.memo.trim().toLowerCase() !== task.memo.toLowerCase()) newErrors.memo = true;

    setErrors(newErrors);
    setVerified(true);
    if (Object.keys(newErrors).length === 0) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (taskIndex + 1 >= CHECK_TASKS.length) {
      onComplete({ module: "Writing Checks", correct: correctCount + (Object.keys(errors).length === 0 ? 0 : 0), total: CHECK_TASKS.length });
    } else {
      setTaskIndex(taskIndex + 1);
      setFields({ payTo: "", amount: "", writtenAmount: "", memo: "", date: "" });
      setVerified(false);
      setErrors({});
    }
  };

  const totalErrors = Object.keys(errors).length;
  const isAllCorrect = verified && totalErrors === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <PenLine className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">Writing Checks</span>
        </div>
        <span className="text-xs text-muted-foreground">Check {taskIndex + 1} of {CHECK_TASKS.length}</span>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5 mb-6">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${((taskIndex) / CHECK_TASKS.length) * 100}%` }}
        />
      </div>

      <Card className="p-4 bg-muted/40 border-dashed mb-5">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{task.instruction(scenario)}</p>
        </div>
      </Card>

      {/* Check visual */}
      <Card className="p-4 sm:p-6 border-2 border-border bg-amber-50/30 relative overflow-hidden">
        <div className="absolute top-3 right-4 text-right">
          <p className="text-[10px] text-muted-foreground font-mono">No. {1000 + taskIndex + 1}</p>
        </div>

        {/* Bank header */}
        <div className="mb-4">
          <p className="font-display font-bold text-base text-foreground">First National Bank</p>
          <p className="text-[10px] text-muted-foreground">123 Main Street · Your City, ST 00000</p>
        </div>

        <div className="space-y-4">
          {/* Date row */}
          <div className="flex justify-end">
            <div className="w-40">
              <CheckField
                label="Date"
                value={fields.date}
                placeholder={correctDate}
                onChange={(v) => updateField("date", v)}
                hint="MM/DD/YYYY"
              />
            </div>
          </div>

          {/* Pay To row */}
          <div className="flex items-end gap-2">
            <span className="text-sm font-semibold text-muted-foreground shrink-0">Pay to the<br/>Order of</span>
            <div className="flex-1">
              <CheckField
                label=""
                value={verified ? correctPayTo : fields.payTo}
                placeholder="Name of payee"
                onChange={(v) => updateField("payTo", v)}
                verified={verified ? (errors.payTo ? false : true) : undefined}
              />
            </div>
            <div className="w-28">
              <CheckField
                label=""
                value={verified ? `$${correctAmount}.00` : fields.amount}
                placeholder="$0.00"
                onChange={(v) => updateField("amount", v)}
                verified={verified ? (errors.amount ? false : true) : undefined}
              />
            </div>
          </div>

          {/* Written amount row */}
          <div>
            <CheckField
              label="Amount in words"
              value={verified ? correctWritten : fields.writtenAmount}
              placeholder={`e.g. "four hundred fifty and 00/100"`}
              onChange={(v) => updateField("writtenAmount", v)}
              verified={verified ? (errors.writtenAmount ? false : true) : undefined}
            />
            <span className="text-[10px] text-muted-foreground">DOLLARS</span>
          </div>

          {/* Memo & Signature */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <CheckField
                label="Memo"
                value={verified ? task.memo : fields.memo}
                placeholder="What is this for?"
                onChange={(v) => updateField("memo", v)}
                verified={verified ? (errors.memo ? false : true) : undefined}
              />
            </div>
            <div className="w-36 text-right">
              <div className="border-b-2 border-border pb-1">
                <p className="text-sm font-display italic text-muted-foreground/60">{scenario.name}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Signature</p>
            </div>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {verified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <Card className={`p-4 ${isAllCorrect ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"}`}>
              <div className="flex items-start gap-2.5">
                {isAllCorrect
                  ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  : <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                <div>
                  <p className="font-semibold text-sm mb-1">
                    {isAllCorrect ? "Check written correctly!" : `${totalErrors} field(s) needed correction.`}
                  </p>
                  {!isAllCorrect && (
                    <p className="text-xs text-muted-foreground">
                      The correct values are now shown on the check above. Study each field carefully.
                    </p>
                  )}
                  {errors.writtenAmount && (
                    <p className="text-xs mt-1 text-muted-foreground">
                      <strong>Written amount:</strong> "{correctWritten}"
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5">
        {!verified ? (
          <Button onClick={handleVerify} className="w-full h-11 gap-2">
            <Lightbulb className="w-4 h-4" /> Submit Check
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full h-11 gap-2">
            {taskIndex + 1 < CHECK_TASKS.length ? "Next Check" : "Continue"} <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}