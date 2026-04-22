import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

// Badge definitions — earned by XP thresholds or completions
export const BADGES = [
  { id: "first_step",   emoji: "👣", label: "First Step",       desc: "Completed your first module",           condition: (xp, mods) => mods >= 1 },
  { id: "budget_hero",  emoji: "💰", label: "Budget Hero",       desc: "Completed Budget Building",             condition: (xp, mods, scores) => scores.some((s) => s.module === "Budget Building") },
  { id: "tax_pro",      emoji: "📄", label: "Tax Pro",           desc: "Completed Tax Filing",                  condition: (xp, mods, scores) => scores.some((s) => s.module === "Tax Filing") },
  { id: "xp_100",       emoji: "⚡", label: "Power Up",          desc: "Earned 100 XP",                         condition: (xp) => xp >= 100 },
  { id: "xp_250",       emoji: "🌟", label: "Rising Star",       desc: "Earned 250 XP",                         condition: (xp) => xp >= 250 },
  { id: "xp_450",       emoji: "🔥", label: "On Fire",           desc: "Earned 450 XP",                         condition: (xp) => xp >= 450 },
  { id: "xp_700",       emoji: "💎", label: "Diamond Mind",      desc: "Earned 700 XP",                         condition: (xp) => xp >= 700 },
  { id: "xp_1000",      emoji: "🏆", label: "Champion",          desc: "Earned 1000 XP",                        condition: (xp) => xp >= 1000 },
  { id: "half_way",     emoji: "🎯", label: "Halfway There",     desc: "Completed 4 modules",                   condition: (xp, mods) => mods >= 4 },
  { id: "perfect_mod",  emoji: "💯", label: "Perfect Score",     desc: "Got 100% on any module",                condition: (xp, mods, scores) => scores.some((s) => s.correct === s.total) },
  { id: "streak_3",     emoji: "🔗", label: "3-Module Streak",   desc: "Completed 3 modules in a row",          condition: (xp, mods) => mods >= 3 },
  { id: "graduate",     emoji: "🎓", label: "Financial Graduate", desc: "Completed all 8 modules",              condition: (xp, mods) => mods >= 8 },
  { id: "ace",          emoji: "🌈", label: "Ace",               desc: "Scored 90%+ overall",                   condition: (xp, mods, scores) => {
    if (!scores.length) return false;
    const t = scores.reduce((a, s) => a + s.correct, 0);
    const q = scores.reduce((a, s) => a + s.total, 0);
    return q > 0 && (t / q) >= 0.9;
  }},
];

export function getEarnedBadges(xp, scores) {
  const mods = scores.length;
  return BADGES.filter((b) => b.condition(xp, mods, scores));
}

// Popup overlay when a new badge is earned
export function BadgeUnlockOverlay({ badge, onDone }) {
  if (!badge) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="badge-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onDone}
      >
        <motion.div
          initial={{ scale: 0.5, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="bg-card rounded-2xl p-8 text-center shadow-2xl max-w-xs mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl mb-3"
          >
            {badge.emoji}
          </motion.div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Badge Unlocked!</p>
          <h3 className="font-display text-xl font-bold mb-1">{badge.label}</h3>
          <p className="text-sm text-muted-foreground mb-5">{badge.desc}</p>
          <button
            onClick={onDone}
            className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
          >
            Awesome!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Static display of all badges (earned vs locked)
export default function BadgeShowcase({ xp, scores }) {
  const earned = getEarnedBadges(xp, scores);
  const earnedIds = new Set(earned.map((b) => b.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-4"
    >
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
        <Award className="w-4 h-4" /> Badges & Achievements
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {BADGES.map((b) => {
          const isEarned = earnedIds.has(b.id);
          return (
            <Card
              key={b.id}
              className={`p-2.5 text-center transition-all ${isEarned ? "border-primary/30 bg-primary/5" : "opacity-40 grayscale"}`}
              title={isEarned ? b.desc : `Locked: ${b.desc}`}
            >
              <div className="text-2xl mb-1">{b.emoji}</div>
              <p className="text-[9px] font-semibold leading-tight">{b.label}</p>
              {isEarned && <p className="text-[8px] text-primary mt-0.5">✓ Earned</p>}
            </Card>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        {earned.length}/{BADGES.length} badges earned
      </p>
    </motion.div>
  );
}