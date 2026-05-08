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

function getGrade(pct) {
  return pct >= 93 ? "A" : pct >= 85 ? "B+" : pct >= 77 ? "B" : pct >= 70 ? "C+" : pct >= 60 ? "C" : "F";
}

function getScoreColor(pct) {
  return pct >= 80 ? "#059669" : pct >= 60 ? "#d97706" : "#dc2626";
}

function getHealthLabel(score) {
  if (!score) return { label: "N/A", color: "#9ca3af" };
  if (score >= 85) return { label: "Excellent", color: "#059669" };
  if (score >= 70) return { label: "Good", color: "#10b981" };
  if (score >= 55) return { label: "Fair", color: "#d97706" };
  return { label: "Needs Work", color: "#dc2626" };
}

const MODULE_NAMES = [
  "Budget Building", "Tax Filing", "Financial Literacy",
  "Writing Checks", "Checkbook Balancing", "Opening a Bank Account", "Credit Application"
];

function exportPDF(students) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const avgXP = students.length ? Math.round(students.reduce((a, s) => a + s.xp, 0) / students.length) : 0;
  const avgPct = students.length ? Math.round(students.reduce((a, s) => a + (s.totalCorrect / Math.max(1, s.totalQuestions)) * 100, 0) / students.length) : 0;
  const completed = students.filter((s) => s.modulesCompleted >= 8).length;

  // Summary table rows
  const summaryRows = students.map((s, idx) => {
    const levelInfo = getLevel(s.xp);
    const pct = Math.round((s.totalCorrect / Math.max(1, s.totalQuestions)) * 100);
    const grade = getGrade(pct);
    const health = getHealthLabel(s.healthScore);
    const bg = idx % 2 === 0 ? "#f9fafb" : "#ffffff";
    return `
      <tr style="background:${bg}">
        <td style="font-weight:600">${s.name}</td>
        <td style="text-align:center">${s.classPeriod || "—"}</td>
        <td>${s.job}</td>
        <td style="text-align:center;font-weight:700;color:#059669">${s.xp}</td>
        <td style="text-align:center;font-size:10px;color:${levelInfo.color};font-weight:600">L${levelInfo.level} ${levelInfo.title}</td>
        <td style="text-align:center;font-weight:700;color:${getScoreColor(pct)}">${pct}%</td>
        <td style="text-align:center;font-weight:800;font-size:13px;color:${getScoreColor(pct)}">${grade}</td>
        <td style="text-align:center">${s.modulesCompleted || 0}/8</td>
        <td style="text-align:center;font-weight:600;color:${health.color}">${s.healthScore ? `${s.healthScore} (${health.label})` : "—"}</td>
      </tr>`;
  }).join("");

  // Individual student detail cards
  const studentCards = students.map((s) => {
    const pct = Math.round((s.totalCorrect / Math.max(1, s.totalQuestions)) * 100);
    const grade = getGrade(pct);
    const levelInfo = getLevel(s.xp);
    const health = getHealthLabel(s.healthScore);

    const moduleRows = MODULE_NAMES.map((name) => {
      const sc = (s.scores || []).find((x) => x.module === name);
      if (!sc) return `<tr><td>${name}</td><td style="text-align:center;color:#9ca3af">Not attempted</td><td style="text-align:center">—</td></tr>`;
      const mpct = Math.round((sc.correct / sc.total) * 100);
      return `<tr>
        <td>${name}</td>
        <td style="text-align:center;font-weight:700;color:${getScoreColor(mpct)}">${sc.correct}/${sc.total} (${mpct}%)</td>
        <td style="text-align:center;font-weight:700;color:${getScoreColor(mpct)}">${getGrade(mpct)}</td>
      </tr>`;
    }).join("");

    return `
      <div class="student-card">
        <div class="card-header">
          <div>
            <div class="student-name">${s.name}</div>
            <div class="student-meta">${s.job}${s.classPeriod ? ` &nbsp;·&nbsp; ${s.classPeriod} Period` : ""}</div>
          </div>
          <div class="grade-badge" style="background:${getScoreColor(pct)}">${grade}</div>
        </div>
        <div class="card-stats">
          <div class="mini-stat">
            <div class="mini-val" style="color:#059669">${pct}%</div>
            <div class="mini-lbl">Overall Score</div>
          </div>
          <div class="mini-stat">
            <div class="mini-val" style="color:#7c3aed">${s.xp} XP</div>
            <div class="mini-lbl">Experience Points</div>
          </div>
          <div class="mini-stat">
            <div class="mini-val" style="color:${levelInfo.color}">L${levelInfo.level}</div>
            <div class="mini-lbl">${levelInfo.title}</div>
          </div>
          <div class="mini-stat">
            <div class="mini-val" style="color:${health.color}">${s.healthScore || "—"}</div>
            <div class="mini-lbl">Financial Health</div>
          </div>
          <div class="mini-stat">
            <div class="mini-val">${s.modulesCompleted || 0}/8</div>
            <div class="mini-lbl">Modules Done</div>
          </div>
        </div>
        <table class="module-table">
          <thead><tr><th>Module</th><th style="text-align:center">Score</th><th style="text-align:center">Grade</th></tr></thead>
          <tbody>${moduleRows}</tbody>
        </table>
        ${s.healthScore ? `<div class="health-bar-wrap"><span>Financial Health: <strong style="color:${health.color}">${health.label} (${s.healthScore}/100)</strong></span><div class="health-bar"><div class="health-fill" style="width:${s.healthScore}%;background:${health.color}"></div></div></div>` : ""}
      </div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Money Matters — Student Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; color: #111827; font-size: 12px; background: #fff; }
    .page { padding: 32px; max-width: 960px; margin: auto; }
    .report-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; border-bottom: 3px solid #059669; padding-bottom: 16px; }
    .report-title { font-size: 24px; font-weight: 800; color: #059669; }
    .report-sub { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .report-date { font-size: 11px; color: #9ca3af; text-align: right; }
    .section-title { font-size: 15px; font-weight: 700; color: #1f2937; margin: 24px 0 12px; border-left: 4px solid #059669; padding-left: 10px; }
    .summary-stats { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 18px; border-radius: 8px; text-align: center; flex: 1; }
    .stat .val { font-size: 20px; font-weight: 800; color: #059669; }
    .stat .lbl { font-size: 10px; color: #6b7280; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th { background: #1f2937; color: #fff; padding: 8px 7px; text-align: left; font-size: 11px; }
    td { padding: 7px 7px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
    .student-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; margin-bottom: 20px; page-break-inside: avoid; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .student-name { font-size: 16px; font-weight: 800; color: #111827; }
    .student-meta { font-size: 11px; color: #6b7280; margin-top: 2px; }
    .grade-badge { color: #fff; font-size: 22px; font-weight: 900; width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .card-stats { display: flex; gap: 12px; background: #f9fafb; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
    .mini-stat { flex: 1; text-align: center; }
    .mini-val { font-size: 16px; font-weight: 800; }
    .mini-lbl { font-size: 9px; color: #6b7280; margin-top: 2px; }
    .module-table th { background: #374151; font-size: 10px; padding: 6px 7px; }
    .module-table td { font-size: 11px; padding: 6px 7px; }
    .health-bar-wrap { margin-top: 12px; font-size: 11px; color: #6b7280; }
    .health-bar { height: 8px; background: #e5e7eb; border-radius: 99px; margin-top: 5px; overflow: hidden; }
    .health-fill { height: 100%; border-radius: 99px; }
    .footer { margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 12px; text-align: center; color: #9ca3af; font-size: 10px; }
    @media print {
      .page { padding: 16px; }
      .student-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="report-header">
    <div>
      <div class="report-title">Money Matters — Student Report</div>
      <div class="report-sub">Financial Literacy Final Exam Results</div>
    </div>
    <div class="report-date">Generated: ${date}<br/>Confidential — For Teacher/Parent Use</div>
  </div>

  <div class="summary-stats">
    <div class="stat"><div class="val">${students.length}</div><div class="lbl">Total Students</div></div>
    <div class="stat"><div class="val">${avgPct}%</div><div class="lbl">Class Average</div></div>
    <div class="stat"><div class="val">${avgXP}</div><div class="lbl">Avg XP Earned</div></div>
    <div class="stat"><div class="val">${completed}</div><div class="lbl">Completed All Modules</div></div>
  </div>

  <div class="section-title">Class Summary</div>
  <table>
    <thead>
      <tr>
        <th>Student Name</th><th>Period</th><th>Job Scenario</th><th style="text-align:center">XP</th>
        <th style="text-align:center">Level</th><th style="text-align:center">Score</th>
        <th style="text-align:center">Grade</th><th style="text-align:center">Modules</th><th style="text-align:center">Fin. Health</th>
      </tr>
    </thead>
    <tbody>${summaryRows}</tbody>
  </table>

  <div class="section-title">Individual Student Reports</div>
  ${studentCards}

  <div class="footer">Money Matters Financial Literacy Exam &mdash; ${date} &mdash; Do not distribute to students</div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => setTimeout(() => win.print(), 400);
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