import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, BookOpen, ArrowRight, Lightbulb, Plus, Minus } from "lucide-react";

function generateTransactions(scenario) {
  const startingBalance = Math.round(scenario.monthlyNet * 1.3);
  const txns = [
    { id: 1, date: "4/01", description: "Starting Balance", type: "balance", amount: null, balance: startingBalance },
    { id: 2, date: "4/01", description: "Paycheck deposit", type: "deposit", amount: Math.round(scenario.monthlyNet / 2) },
    { id: 3, date: "4/03", description: `Rent — ${scenario.living.description.includes("roommate") ? "City Properties" : "Landlord"}`, type: "check", amount: scenario.fixedExpenses.rent, checkNum: "1001" },
    { id: 4, date: "4/05", description: "Grocery Store", type: "debit", amount: 87 },
    { id: 5, date: "4/08", description: "Gas Station", type: "debit", amount: Math.round(scenario.fixedExpenses.gas / 4) },
    { id: 6, date: "4/10", description: "Electric Bill (check)", type: "check", amount: scenario.fixedExpenses.utilities, checkNum: "1002" },
    { id: 7, date: "4/15", description: "Paycheck deposit", type: "deposit", amount: Math.round(scenario.monthlyNet / 2) },
    { id: 8, date: "4/17", description: "Grocery Store", type: "debit", amount: 63 },
    { id: 9, date: "4/20", description: "Phone Bill", type: "debit", amount: 65 },
    { id: 10, date: "4/22", description: "Gas Station", type: "debit", amount: Math.round(scenario.fixedExpenses.gas / 4) },
  ];

  // Calculate running balances
  let balance = startingBalance;
  return txns.map((t) => {
    if (t.type === "balance") return t;
    if (t.type === "deposit") balance += t.amount;
    else balance -= t.amount;
    return { ...t, correctBalance: balance };
  });
}

export default function CheckbookModule({ scenario, onComplete }) {
  const transactions = useState(() => generateTransactions(scenario))[0];

  // Students fill in balances for rows 2-10 (index 1-9)
  const fillableRows = transactions.filter((t) => t.type !== "balance");
  const [answers, setAnswers] = useState({});
  const [verified, setVerified] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const updateAnswer = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));

  const handleVerify = () => {
    let correct = 0;
    fillableRows.forEach((t) => {
      const entered = parseFloat(String(answers[t.id] || "").replace(/[$,]/g, ""));
      if (!isNaN(entered) && entered === t.correctBalance) correct++;
    });
    setCorrectCount(correct);
    setVerified(true);
  };

  const handleFinish = () => {
    onComplete({ module: "Checkbook Balancing", correct: correctCount, total: fillableRows.length });
  };

  const startingBalance = transactions[0].balance;

  const getRowStatus = (t) => {
    if (!verified) return "pending";
    const entered = parseFloat(String(answers[t.id] || "").replace(/[$,]/g, ""));
    return entered === t.correctBalance ? "correct" : "wrong";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/15">
            <BookOpen className="w-4 h-4 text-accent" />
          </div>
          <span className="font-semibold text-sm">Balancing Your Checkbook</span>
        </div>
      </div>

      <Card className="p-4 bg-muted/40 border-dashed mb-5">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Fill in the running balance after each transaction.</p>
            <p className="text-muted-foreground text-xs mt-1">
              For deposits (+), add to the previous balance. For checks/debits (−), subtract from the previous balance.
            </p>
          </div>
        </div>
      </Card>

      {/* Checkbook register */}
      <Card className="overflow-hidden border-2">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-muted border-b">
                <th className="text-left p-2 font-semibold text-muted-foreground w-12">Ck#</th>
                <th className="text-left p-2 font-semibold text-muted-foreground w-14">Date</th>
                <th className="text-left p-2 font-semibold text-muted-foreground">Description</th>
                <th className="text-center p-2 font-semibold text-muted-foreground w-6"></th>
                <th className="text-right p-2 font-semibold text-muted-foreground w-20">Amount</th>
                <th className="text-right p-2 font-semibold text-muted-foreground w-24">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => {
                if (t.type === "balance") {
                  return (
                    <tr key={t.id} className="border-b bg-primary/5">
                      <td className="p-2 text-muted-foreground">—</td>
                      <td className="p-2 text-muted-foreground">{t.date}</td>
                      <td className="p-2 font-semibold">{t.description}</td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2 text-right font-bold text-primary">${t.balance.toLocaleString()}.00</td>
                    </tr>
                  );
                }

                const status = getRowStatus(t);
                const isDeposit = t.type === "deposit";

                return (
                  <tr
                    key={t.id}
                    className={`border-b transition-colors ${
                      status === "correct" ? "bg-primary/5" :
                      status === "wrong" ? "bg-destructive/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="p-2 text-muted-foreground font-mono">{t.checkNum || "—"}</td>
                    <td className="p-2 text-muted-foreground">{t.date}</td>
                    <td className="p-2 font-medium">{t.description}</td>
                    <td className="p-2 text-center">
                      {isDeposit
                        ? <Plus className="w-3 h-3 text-primary inline-block" />
                        : <Minus className="w-3 h-3 text-destructive inline-block" />}
                    </td>
                    <td className={`p-2 text-right font-mono ${isDeposit ? "text-primary" : "text-destructive"}`}>
                      ${t.amount.toLocaleString()}.00
                    </td>
                    <td className="p-2 text-right">
                      {verified ? (
                        <div className="flex items-center justify-end gap-1">
                          {status === "correct"
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                            : <XCircle className="w-3.5 h-3.5 text-destructive" />}
                          <span className={`font-mono font-semibold ${status === "correct" ? "text-primary" : "text-destructive"}`}>
                            ${t.correctBalance.toLocaleString()}.00
                          </span>
                        </div>
                      ) : (
                        <Input
                          value={answers[t.id] || ""}
                          onChange={(e) => updateAnswer(t.id, e.target.value)}
                          placeholder="$0.00"
                          className="h-7 w-24 text-xs text-right font-mono ml-auto p-1"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {verified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <Card className={`p-4 ${correctCount === fillableRows.length ? "bg-primary/5 border-primary/20" : correctCount >= fillableRows.length / 2 ? "bg-accent/5 border-accent/20" : "bg-destructive/5 border-destructive/20"}`}>
              <div className="flex items-start gap-2.5">
                {correctCount === fillableRows.length
                  ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  : <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                <div>
                  <p className="font-semibold text-sm mb-1">
                    {correctCount} of {fillableRows.length} balances correct
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Correct balances are shown in the table above.
                    Remember: always track every transaction the moment it happens!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5">
        {!verified ? (
          <Button onClick={handleVerify} className="w-full h-11 gap-2">
            <Lightbulb className="w-4 h-4" /> Check My Balances
          </Button>
        ) : (
          <Button onClick={handleFinish} className="w-full h-11 gap-2">
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}