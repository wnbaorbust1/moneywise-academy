import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Star } from "lucide-react";

export default function LevelUpOverlay({ levelInfo, onDone }) {
  useEffect(() => {
    if (!levelInfo) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [levelInfo, onDone]);

  return (
    <AnimatePresence>
      {levelInfo && (
        <motion.div
          key="levelup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onDone}
        >
          <motion.div
            initial={{ scale: 0.3, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="rounded-3xl p-8 text-center max-w-xs mx-4 shadow-2xl"
            style={{ backgroundColor: levelInfo.color }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl mb-3"
            >
              ⬆️
            </motion.div>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1">Level Up!</p>
            <p className="text-white text-3xl font-display font-bold">{levelInfo.title}</p>
            <p className="text-white/70 text-sm mt-2">Level {levelInfo.level} achieved!</p>
            <motion.div
              className="flex justify-center gap-1 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {Array.from({ length: levelInfo.level }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-white fill-white" />
              ))}
            </motion.div>
            <p className="text-white/50 text-xs mt-4">Tap anywhere to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}