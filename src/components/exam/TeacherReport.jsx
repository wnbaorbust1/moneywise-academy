import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send, CheckCircle2, Printer, Wallet, FileText, Brain,
  PenLine, BookOpen, Landmark, CreditCard, Star, User, Briefcase, CalendarDays
} from "lucide-react";
import { getLevel, calcFinancialHealthScore, getFinancialHealthLabel } from "@/lib/xpSystem";
import { PATHS } from "@/components/exam/PathSelector";

function getGrade(pct) {
  if (pct >= 93) return "A";
  if (pct >= 85) return "B+";
  if (pct >= 77) return "B";
  if (pct >= 70) return "C+";
  if (pct >= 60) return "C";
  return "F";
}

const moduleIcons = {
  "Budget Building": Wallet,
  "Tax Filing": FileText,
  "Financial Literacy": Brain,
  "Writing Checks": PenLine,
  "Checkbook Balancing": BookOpen,
  "Opening a Bank Account": Landmark,
  "Credit Application": CreditCard,
};

export default function TeacherReport({ scores, scenario, xp, classPeriod }) {
  const [submitted, setSubmitted] = useState(false);
  const reportRef = useRef(null);

  const totalCorrect = scores.reduce((s, m) => s + m.correct, 0);
  const totalQuestions = scores.reduce((s, m) => s + m.total, 0);
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const grade = getGrade(percentage);
  const levelInfo = getLevel(xp);
  const healthScore = calcFinancialHealthScore(scores, scenario);
  const healthLabel = getFinancialHealthLabel(healthScore);
  const path = PATHS.find((p) => p.id === scenario.pathId);
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handlePrint = () => {
    const content = reportRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Grade Report — ${scenario.name}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 32px; color: #1a1a2e; font-size: 13px; }
        h1 { font-size: 20px; margin-bottom: 2px; }
        .meta { color: #6b7280; font-size: 11px; margin-bottom: 16px; }
        .grade-box { text-align: center; padding: 16px; border: 2px solid #059669; border-radius: 12px; margin-bottom: 20px; }
        .grade-letter { font-size: 48px; font-weight: bold; color: ${percentage >= 70 ? '#059669' : percentage >= 60 ? '#d97706' : '#dc2626'}; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .info-item { background: #f3f4f6; padding: 8px 12px; border-radius: 8px; }
        .info-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
        .info-value { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #1a1a2e; color: white; padding: 8px; text-align: left; font-size: 11px; }
        td { padding: 7px 8px; border-bottom: 1px solid #e5e7eb; }
        .pass { color: #059669; } .warn { color: #d97706; } .fail { color: #dc2626; }
        .footer { margin-top: 24px; color: #9ca3af; font-size: 10px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 12px; }
        .sig-line { margin-top: 40px; display: flex; justify-content: space-between; }
        .sig-line div { width: 40%; border-top: 1px solid #1a1a2e; padding-top: 4px; font-size: 11px; color: #6b7280; }
        @media print { body { margin: 16px; } }
      </style></head><body>
      <h1>🌟 Ghana Green Star — Student Grade Report</h1>
      <p class="meta">Financial Literacy Final Exam &nbsp;|&nbsp; Date: ${now}</p>
      <div class="grade-box">
        <div class="grade-letter">${grade}</div>
        <div style="font-size:18px;font-weight:bold;">${percentage}%</div>
        <div style="font-size:12px;color:#6b7280;">${totalCorrect} of ${totalQuestions} correct</div>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Student Name</div><div class="info-value">${scenario.name}</div></div>
        <div class="info-item"><div class="info-label">Class Period</div><div class="info-value">${classPeriod || "—"}</div></div>
        <div class="info-item"><div class="info-label">Career Path</div><div class="info-value">${scenario.job.title}</div></div>
        <div class="info-item"><div class="info-label">Difficulty Path</div><div class="info-value">${path ? path.label : scenario.pathId}</div></div>
        <div class="info-item"><div class="info-label">Total XP</div><div class="info-value">${xp} XP (Level ${levelInfo.level} — ${levelInfo.title})</div></div>
        <div class="info-item"><div class="info-label">Financial Health Score</div><div class="info-value">${healthScore > 0 ? healthScore : "N/A"}</div></div>
      </div>
      <table>
        <thead><tr><th>Module</th><th>Score</th><th>Percentage</th><th>Grade</th></tr></thead>
        <tbody>${scores.map((s) => {
          const pct = Math.round((s.correct / s.total) * 100);
          const g = getGrade(pct);
          const cls = pct >= 70 ? 'pass' : pct >= 60 ? 'warn' : 'fail';
          return `<tr><td>${s.module}</td><td>${s.correct}/${s.total}</td><td class="${cls}" style="font-weight:bold">${pct}%</td><td style="font-weight:bold">${g}</td></tr>`;
        }).join("")}</tbody>
      </table>
      <div class="sig-line"><div>Teacher Signature</div><div>Date</div></div>
      <div class="footer">Ghana Green Star Financial Literacy Program — Confidential Student Report</div>
      </body></html>`);
    win.document.close();
    win.onload = () => setTimeout(() => win.print(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-5 border-2 border-primary/30 bg-primary/5" ref={reportRef}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base">Teacher Grade Report</h3>
            <p className="text-xs text-muted-foreground">Submit your results for grading</p>
          </div>
        </div>

        {/* Summary info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Student</p>
              <p className="font-semibold text-xs">{scenario.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Class Period</p>
              <p className="font-semibold text-xs">{classPeriod || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Career</p>
              <p className="font-semibold text-xs">{scenario.job.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
            <Star className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Path</p>
              <p className="font-semibold text-xs">{path ? `${path.emoji} ${path.label}` : scenario.pathId}</p>
            </div>
          </div>
        </div>

        {/* Overall grade */}
        <div className="text-center py-3 mb-4 bg-background rounded-xl border">
          <span className={`text-4xl font-display font-bold ${percentage >= 70 ? 'text-primary' : percentage >= 60 ? 'text-accent' : 'text-destructive'}`}>
            {grade}
          </span>
          <p className="text-lg font-bold">{percentage}%</p>
          <p className="text-xs text-muted-foreground">{totalCorrect}/{totalQuestions} correct · {xp} XP · Level {levelInfo.level}</p>
        </div>

        {/* Per-module breakdown */}
        <div className="space-y-1.5 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Module Breakdown</p>
          {scores.map((s, idx) => {
            const Icon = moduleIcons[s.module] || Star;
            const pct = Math.round((s.correct / s.total) * 100);
            const g = getGrade(pct);
            return (
              <div key={idx} className="flex items-center gap-3 p-2 bg-background rounded-lg">
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-xs font-medium truncate">{s.module}</span>
                <span className="text-xs text-muted-foreground">{s.correct}/{s.total}</span>
                <Badge
                  variant={pct >= 70 ? "default" : pct >= 60 ? "secondary" : "destructive"}
                  className="text-[10px] w-10 justify-center"
                >
                  {g}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {!submitted ? (
          <Button onClick={handleSubmit} className="w-full h-11 gap-2">
            <Send className="w-4 h-4" /> Submit Report to Teacher
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">Report Submitted!</p>
                <p className="text-xs text-muted-foreground">Your teacher can view your grade in the Teacher Dashboard.</p>
              </div>
            </div>
            <Button variant="outline" onClick={handlePrint} className="w-full h-10 gap-2 text-sm">
              <Printer className="w-4 h-4" /> Print Report Card
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}