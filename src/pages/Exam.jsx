import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProgressBar from "@/components/exam/ProgressBar";
import WelcomeScreen from "@/components/exam/WelcomeScreen";
import ScenarioCard from "@/components/exam/ScenarioCard";
import QuizModule from "@/components/exam/QuizModule";
import ResultsSummary from "@/components/exam/ResultsSummary";
import WriteCheckModule from "@/components/exam/WriteCheckModule";
import CheckbookModule from "@/components/exam/CheckbookModule";
import OpenBankAccountModule from "@/components/exam/OpenBankAccountModule";
import CreditApplicationModule from "@/components/exam/CreditApplicationModule";
import XPBar from "@/components/exam/XPBar";
import GoalsDashboard from "@/components/exam/GoalsDashboard";
import LevelUpOverlay from "@/components/exam/LevelUpOverlay";
import MilestoneToast from "@/components/exam/MilestoneToast";
import PathSelector from "@/components/exam/PathSelector";
import { BadgeUnlockOverlay, getEarnedBadges } from "@/components/exam/BadgeShowcase";
import {
  generateScenario,
  getBudgetQuestions,
  getTaxQuestions,
  getFinancialLiteracyQuestions,
} from "@/lib/scenarios";
import { calcXP, getLevel, calcFinancialHealthScore, XP_MILESTONES } from "@/lib/xpSystem";
import { saveStudentRecord } from "@/lib/storage";
import { BarChart2 } from "lucide-react";

// Modules: 0=scenario, 1=budget, 2=taxes, 3=fin literacy, 4=checks, 5=checkbook, 6=bank acct, 7=credit, 8=results
const TOTAL_MODULES = 8;

export default function Exam() {
  const [studentName, setStudentName] = useState(null);
  const [classPeriod, setClassPeriod] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null); // null = path not chosen yet
  const [currentModule, setCurrentModule] = useState(0);
  const [scores, setScores] = useState([]);
  const [xpGain, setXpGain] = useState(0);
  const [showXPGain, setShowXPGain] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [moduleMilestone, setModuleMilestone] = useState(null);
  const [newBadge, setNewBadge] = useState(null);
  const prevXPRef = useRef(0);
  const prevBadgeIdsRef = useRef(new Set());

  const scenario = useMemo(
    () => (studentName && selectedPath ? generateScenario(studentName, selectedPath) : null),
    [studentName, selectedPath]
  );

  const budgetQs = useMemo(() => (scenario ? getBudgetQuestions(scenario) : []), [scenario]);
  const taxQs = useMemo(() => (scenario ? getTaxQuestions(scenario) : []), [scenario]);
  const finLitQs = useMemo(() => (scenario ? getFinancialLiteracyQuestions(scenario) : []), [scenario]);

  const currentXP = useMemo(() => calcXP(scores), [scores]);

  // Watch for level-ups
  useEffect(() => {
    if (scores.length === 0) return;
    const prevLevel = getLevel(prevXPRef.current).level;
    const newLevel = getLevel(currentXP).level;
    if (newLevel > prevLevel) {
      setLevelUpInfo(getLevel(currentXP));
    }
    prevXPRef.current = currentXP;
  }, [currentXP]);

  const handleStart = (name, period) => {
    setStudentName(name);
    setClassPeriod(period);
    setSelectedPath(null);
    setCurrentModule(0);
    setScores([]);
    prevXPRef.current = 0;
  };

  const handlePathSelect = (pathId) => {
    setSelectedPath(pathId);
  };

  const handleModuleComplete = (result) => {
    const newScores = [...scores, result];
    setScores(newScores);

    // Calculate XP gain for this module
    const oldXP = calcXP(scores);
    const newXP = calcXP(newScores);
    const gained = newXP - oldXP;
    setXpGain(gained);
    setShowXPGain(true);
    setTimeout(() => setShowXPGain(false), 2500);

    // Check XP milestones
    const hitMilestone = XP_MILESTONES.find((m) => oldXP < m && newXP >= m);
    if (hitMilestone) {
      setModuleMilestone({
        id: `xp-${hitMilestone}`,
        icon: "⚡",
        title: `${hitMilestone} XP Milestone!`,
        description: `You've earned ${hitMilestone} total XP — incredible progress!`,
      });
    }

    // Check for newly earned badges
    const earnedNow = getEarnedBadges(newXP, newScores);
    const justUnlocked = earnedNow.find((b) => !prevBadgeIdsRef.current.has(b.id));
    if (justUnlocked) {
      setNewBadge(justUnlocked);
    }
    earnedNow.forEach((b) => prevBadgeIdsRef.current.add(b.id));

    setCurrentModule((prev) => prev + 1);
  };

  // Save to storage when exam is done
  useEffect(() => {
    if (currentModule === TOTAL_MODULES && scores.length > 0 && scenario) {
      const totalCorrect = scores.reduce((a, s) => a + s.correct, 0);
      const totalQuestions = scores.reduce((a, s) => a + s.total, 0);
      saveStudentRecord({
        name: scenario.name,
        job: scenario.job.title,
        pathId: scenario.pathId,
        classPeriod,
        xp: currentXP,
        scores,
        totalCorrect,
        totalQuestions,
        modulesCompleted: scores.length,
        healthScore: calcFinancialHealthScore(scores, scenario),
        completedAt: Date.now(),
      });
    }
  }, [currentModule]);

  const handleRestart = () => {
    setStudentName(null);
    setClassPeriod(null);
    setSelectedPath(null);
    setCurrentModule(0);
    setScores([]);
    prevXPRef.current = 0;
  };

  if (!studentName) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (!selectedPath) {
    return <PathSelector name={studentName} onSelect={handlePathSelect} />;
  }

  const modulesCompleted = scores.length;

  return (
    <div className="min-h-screen bg-background">
      <LevelUpOverlay levelInfo={levelUpInfo} onDone={() => setLevelUpInfo(null)} />
      <MilestoneToast milestone={moduleMilestone} onDone={() => setModuleMilestone(null)} />
      <BadgeUnlockOverlay badge={newBadge} onDone={() => setNewBadge(null)} />

      {/* Sticky header with progress + XP + goals */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-2xl mx-auto">
          {/* Top row: XP bar + teacher link */}
          <div className="flex items-center gap-3 px-4 pt-3 pb-1">
            <div className="flex-1">
              <XPBar xp={currentXP} newXP={xpGain} showGain={showXPGain} />
            </div>
            <Link to="/teacher" className="shrink-0">
              <button className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors" title="Teacher Dashboard">
                <BarChart2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </Link>
          </div>
          {/* Module progress */}
          <ProgressBar currentModule={currentModule} />
        </div>

        {/* Goals dashboard (collapsible) — only shown after scenario */}
        {currentModule > 0 && currentModule < TOTAL_MODULES && scenario && (
          <GoalsDashboard
            scenario={scenario}
            modulesCompleted={modulesCompleted}
            scores={scores}
          />
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {currentModule === 0 && (
            <motion.div key="scenario" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ScenarioCard scenario={scenario} onContinue={() => setCurrentModule(1)} />
            </motion.div>
          )}
          {currentModule === 1 && (
            <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizModule questions={budgetQs} moduleTitle="Budget Building" onComplete={handleModuleComplete} />
            </motion.div>
          )}
          {currentModule === 2 && (
            <motion.div key="taxes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizModule questions={taxQs} moduleTitle="Tax Filing" onComplete={handleModuleComplete} />
            </motion.div>
          )}
          {currentModule === 3 && (
            <motion.div key="finlit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizModule questions={finLitQs} moduleTitle="Financial Literacy" onComplete={handleModuleComplete} />
            </motion.div>
          )}
          {currentModule === 4 && (
            <motion.div key="checks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WriteCheckModule scenario={scenario} onComplete={handleModuleComplete} />
            </motion.div>
          )}
          {currentModule === 5 && (
            <motion.div key="checkbook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckbookModule scenario={scenario} onComplete={handleModuleComplete} />
            </motion.div>
          )}
          {currentModule === 6 && (
            <motion.div key="bankacct" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OpenBankAccountModule scenario={scenario} onComplete={handleModuleComplete} />
            </motion.div>
          )}
          {currentModule === 7 && (
            <motion.div key="credit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CreditApplicationModule scenario={scenario} onComplete={handleModuleComplete} />
            </motion.div>
          )}
          {currentModule === 8 && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultsSummary scores={scores} scenario={scenario} onRestart={handleRestart} xp={currentXP} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}