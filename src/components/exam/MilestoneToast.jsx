import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function MilestoneToast({ milestone, onDone }) {
  useEffect(() => {
    if (!milestone) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [milestone, onDone]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          key={milestone.id}
          initial={{ opacity: 0, scale: 0.5, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -40 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-foreground text-background rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 max-w-sm">
            <span className="text-3xl">{milestone.icon}</span>
            <div>
              <p className="font-bold text-sm">{milestone.title}</p>
              <p className="text-xs opacity-70">{milestone.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}