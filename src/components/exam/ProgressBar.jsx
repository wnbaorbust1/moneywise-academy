import { motion } from "framer-motion";
import { Check } from "lucide-react";

const modules = ["Story", "Budget", "Taxes", "Fin. Lit.", "Checks", "Checkbook", "Bank Acct", "Credit", "Results"];

export default function ProgressBar({ currentModule }) {
  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {modules.map((mod, idx) => {
          const isCompleted = idx < currentModule;
          const isCurrent = idx === currentModule;

          return (
            <div key={mod} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                    backgroundColor: isCompleted
                      ? "hsl(160, 60%, 38%)"
                      : isCurrent
                      ? "hsl(28, 80%, 56%)"
                      : "hsl(220, 13%, 89%)",
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className={isCurrent ? "text-white" : "text-muted-foreground"}>
                      {idx + 1}
                    </span>
                  )}
                </motion.div>
                <span
                  className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {mod}
                </span>
              </div>
              {idx < modules.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 h-0.5 rounded-full bg-border relative mt-[-18px]">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}