import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb } from "lucide-react";

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  moduleTitle,
}) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const isCorrect = selected === question.correctIndex;

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
    setSelected(null);
    setConfirmed(false);
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="text-xs font-medium">
          {moduleTitle}
        </Badge>
        <span className="text-xs text-muted-foreground font-medium">
          {questionNumber} of {totalQuestions}
        </span>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5 mb-6">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground leading-snug mb-5">
        {question.question}
      </h3>

      <div className="grid gap-2.5">
        {question.options.map((option, idx) => {
          let optionStyle = "border-border hover:border-primary/40 hover:bg-primary/5";

          if (confirmed) {
            if (idx === question.correctIndex) {
              optionStyle = "border-primary bg-primary/10 ring-1 ring-primary/30";
            } else if (idx === selected && !isCorrect) {
              optionStyle = "border-destructive bg-destructive/5 ring-1 ring-destructive/30";
            } else {
              optionStyle = "border-border opacity-50";
            }
          } else if (idx === selected) {
            optionStyle = "border-primary bg-primary/5 ring-1 ring-primary/30";
          }

          return (
            <button
              key={idx}
              onClick={() => !confirmed && setSelected(idx)}
              disabled={confirmed}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 ${optionStyle}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    confirmed && idx === question.correctIndex
                      ? "border-primary bg-primary"
                      : confirmed && idx === selected && !isCorrect
                      ? "border-destructive bg-destructive"
                      : idx === selected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {confirmed && idx === question.correctIndex && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  )}
                  {confirmed && idx === selected && !isCorrect && (
                    <XCircle className="w-3.5 h-3.5 text-white" />
                  )}
                  {!confirmed && idx === selected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-sm sm:text-base font-medium">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <Card
              className={`p-4 ${
                isCorrect
                  ? "bg-primary/5 border-primary/20"
                  : "bg-destructive/5 border-destructive/20"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-sm mb-1">
                    {isCorrect ? "Correct!" : "Not quite."}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5">
        {!confirmed ? (
          <Button
            onClick={handleConfirm}
            disabled={selected === null}
            className="w-full h-11 text-sm gap-2"
          >
            <Lightbulb className="w-4 h-4" /> Lock In Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full h-11 text-sm gap-2">
            {questionNumber < totalQuestions ? "Next Question" : "Continue"}{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}