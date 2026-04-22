import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLevel } from "@/lib/xpSystem";

function exportCSV(students) {
  const headers = ["Name", "Class Period", "Job", "XP", "Level", "Score %", "Modules Completed", "Financial Health Score", "Path", "Completed At"];
  const rows = students.map((s) => {
    const levelInfo = getLevel(s.xp);
    const pct = Math.round((s.totalCorrect / Math.max(1, s.totalQuestions)) * 100);
    const date = s.completedAt ? new Date(s.completedAt).toLocaleDateString() : "—";
    return [
      `"${s.name}"`,
      s.classPeriod || "—",
      `"${s.job}"`,
      s.xp,
      `"L${levelInfo.level} ${levelInfo.title}"`,
      `${pct}%`,
      s.modulesCompleted || 0,
      s.healthScore || 0,
      s.pathId || "—",
      date,
    ];
  });

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `money-matters-grades-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(students) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const rows = students.map((s, idx) => {
    const levelInfo = getLevel(s.xp);
    const pct = Math.round((s.totalCorrect / Math.max(1, s.totalQuestions)) * 100);
    const grade = pct >= 93 ? "A" : pct >= 85 ? "B+" : pct >= 77 ? "B" : pct >= 70 ? "C+" : pct >= 60 ? "C" : "F";
    const bg = idx % 2 === 0 ? "#f9fafb" : "#ffffff";
    return `
      <tr style="background:${bg}">
        <td>${idx + 1}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.classPeriod || "—"}</td>
        <td>${s.job}</td>
        <td>${s.xp} XP</td>
        <td>L${levelInfo.level}</td>
        <td style="font-weight:bold;color:${pct >= 80 ? "#059669" : pct >= 60 ? "#d97706" : "#dc2626"}">${pct}%</td>
        <td style="font-weight:bold">${grade}</td>
        <td>${s.modulesCompleted || 0}/8</td>
        <td>${s.healthScore || "—"}</td>
      </tr>`;
  }).join("");

  const avgXP = students.length ? Math.round(students.reduce((a, s) => a + s.xp, 0) / students.length) : 0;
  const avgPct = students.length ? Math.round(students.reduce((a, s) => a + (s.totalCorrect / Math.max(1, s.totalQuestions)) * 100, 0) / students.length) : 0;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Money Matters Grade Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #1a1a2e; font-size: 12px; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .meta { color: #6b7280; margin-bottom: 20px; }
    .summary { display: flex; gap: 24px; margin-bottom: 24px; }
    .stat { background: #f3f4f6; padding: 12px 20px; border-radius: 8px; text-align: center; }
    .stat .val { font-size: 22px; font-weight: bold; color: #059669; }
    .stat .lbl { font-size: 10px; color: #6b7280; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a1a2e; color: white; padding: 8px 6px; text-align: left; font-size: 11px; }
    td { padding: 7px 6px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
    .footer { margin-top: 24px; color: #9ca3af; font-size: 10px; text-align: center; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <h1>💰 Money Matters — Grade Report</h1>
  <p class="meta">Generated: ${date} &nbsp;|&nbsp; Total Students: ${students.length}</p>
  <div class="summary">
    <div class="stat"><div class="val">${students.length}</div><div class="lbl">Students</div></div>
    <div class="stat"><div class="val">${avgPct}%</div><div class="lbl">Avg Score</div></div>
    <div class="stat"><div class="val">${avgXP}</div><div class="lbl">Avg XP</div></div>
    <div class="stat"><div class="val">${students.filter((s) => s.modulesCompleted >= 8).length}</div><div class="lbl">Completed All</div></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Name</th><th>Period</th><th>Job</th><th>XP</th><th>Level</th><th>Score%</th><th>Grade</th><th>Modules</th><th>Fin. Health</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Money Matters Financial Literacy Exam &mdash; Confidential Grade Report</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => {
      setTimeout(() => win.print(), 300);
    };
  }
  URL.revokeObjectURL(url);
}

export default function ExportButton({ students }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
          <Download className="w-3 h-3" /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportCSV(students)} className="gap-2 text-xs cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-primary" /> Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPDF(students)} className="gap-2 text-xs cursor-pointer">
          <FileText className="w-4 h-4 text-accent" /> Export / Print as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}