import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "@/components/exam/ProgressBar";
import WelcomeScreen from "@/components/exam/WelcomeScreen";
import ScenarioCard from "@/components/exam/ScenarioCard";
import QuizModule from "@/components/exam/QuizModule";
import ResultsSummary from "@/components/exam/ResultsSummary";
import WriteCheckModule from "@/components/exam/WriteCheckModule";
import CheckbookModule from "@/components/exam/CheckbookModule";
import OpenBankAccountModule from "@/components/exam/OpenBankAccountModule";
import CreditApplicationModule from "@/components/exam/CreditApplicationModule";
import {
  generateScenario,
  getBudgetQuestions,
  getTaxQuestions,
  getFinancialLiteracyQuestions,
} from "@/lib/scenarios";

// Modules: 0=scenario, 1=budget, 2=taxes, 3=fin literacy, 4=checks, 5=checkbook, 6=bank acct, 7=credit, 8=results
export default function Exam() {
  const [studentName, setStudentName] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [scores, setScores] = useState([]);

  const scenario = useMemo(
    () => (studentName ? generateScenario(studentName) : null),
    [studentName]
  );

  const budgetQs = useMemo(() => (scenario ? getBudgetQuestions(scenario) : []), [scenario]);
  const taxQs = useMemo(() => (scenario ? getTaxQuestions(scenario) : []), [scenario]);
  const finLitQs = useMemo(() => (scenario ? getFinancialLiteracyQuestions(scenario) : []), [scenario]);

  const handleStart = (name) => {
    setStudentName(name);
    setCurrentModule(0);
    setScores([]);
  };

  const handleModuleComplete = (result) => {
    setScores((prev) => [...prev, result]);
    setCurrentModule((prev) => prev + 1);
  };

  const handleRestart = () => {
    setStudentName(null);
    setCurrentModule(0);
    setScores([]);
  };

  if (!studentName) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentModule={currentModule} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {currentModule === 0 && (
            <motion.div key="scenario" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ScenarioCard
                scenario={scenario}
                onContinue={() => setCurrentModule(1)}
              />
            </motion.div>
          )}

          {currentModule === 1 && (
            <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizModule
                questions={budgetQs}
                moduleTitle="Budget Building"
                onComplete={handleModuleComplete}
              />
            </motion.div>
          )}

          {currentModule === 2 && (
            <motion.div key="taxes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizModule
                questions={taxQs}
                moduleTitle="Tax Filing"
                onComplete={handleModuleComplete}
              />
            </motion.div>
          )}

          {currentModule === 3 && (
            <motion.div key="finlit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizModule
                questions={finLitQs}
                moduleTitle="Financial Literacy"
                onComplete={handleModuleComplete}
              />
            </motion.div>
          )}

          {currentModule === 4 && (
            <motion.div key="checks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WriteCheckModule
                scenario={scenario}
                onComplete={handleModuleComplete}
              />
            </motion.div>
          )}

          {currentModule === 5 && (
            <motion.div key="checkbook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckbookModule
                scenario={scenario}
                onComplete={handleModuleComplete}
              />
            </motion.div>
          )}

          {currentModule === 6 && (
            <motion.div key="bankacct" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OpenBankAccountModule
                scenario={scenario}
                onComplete={handleModuleComplete}
              />
            </motion.div>
          )}

          {currentModule === 7 && (
            <motion.div key="credit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CreditApplicationModule
                scenario={scenario}
                onComplete={handleModuleComplete}
              />
            </motion.div>
          )}

          {currentModule === 8 && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultsSummary
                scores={scores}
                scenario={scenario}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}