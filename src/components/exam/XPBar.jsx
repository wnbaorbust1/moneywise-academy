import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { getLevel } from "@/lib/xpSystem";

export default function XPBar({ xp, newXP = 0, showGain = false }) {
  const levelInfo = getLevel(xp);
  const nextTitle = levelInfo.nextLevel?.title || "MAX";

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-foreground/5 rounded-xl min-w-0">
      {/* Level badge */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: levelInfo.color }}
      >
        {levelInfo.level}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold truncate" style={{ color: levelInfo.color }}>
            {levelInfo.title}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-bold text-foreground">{xp} XP</span>
            <AnimatePresence>
              {showGain && newXP > 0 && (
                <motion.span
                  key="gain"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -8 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="text-xs font-bold text-primary ml-1"
                >
                  +{newXP}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: levelInfo.color }}
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        {levelInfo.nextLevel && (
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Next: {nextTitle} ({levelInfo.nextLevel.minXP - xp} XP away)
          </p>
        )}
      </div>
    </div>
  );
}