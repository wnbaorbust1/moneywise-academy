import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, DollarSign, PiggyBank, Receipt } from "lucide-react";

const CLASS_PERIODS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && period) onStart(name.trim(), period);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md text-center"
      >
        {/* Floating icons */}
        <div className="relative inline-block mb-6">
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -left-10 -top-2"
          >
            <DollarSign className="w-6 h-6 text-primary/40" />
          </motion.div>
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
            className="absolute -right-10 top-0"
          >
            <PiggyBank className="w-6 h-6 text-accent/40" />
          </motion.div>
          <motion.div
            animate={{ y: [-3, 5, -3] }}
            transition={{ repeat: Infinity, duration: 2.8 }}
            className="absolute -right-6 -bottom-4"
          >
            <Receipt className="w-5 h-5 text-chart-3/40" />
          </motion.div>

          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Money Matters
        </h1>
        <p className="font-display text-lg sm:text-xl text-accent font-semibold mt-1">
          Final Exam
        </p>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          Enter your full name to receive a unique life scenario. You'll create a budget,
          file taxes, and answer financial literacy questions.
        </p>

        <Card className="mt-8 p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Your Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                className="h-12 text-base"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Each name generates a different scenario — use your real name!
              </p>
            </div>
            <div className="text-left">
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Class Period
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CLASS_PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`h-10 rounded-lg text-sm font-semibold border transition-all ${
                      period === p
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input text-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              disabled={!name.trim() || !period}
              className="w-full h-12 text-base gap-2"
            >
              Start My Exam <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Budgeting", icon: "💰" },
            { label: "Taxes", icon: "📋" },
            { label: "Financial IQ", icon: "🧠" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-muted/60 p-3 text-center"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}