import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

function getGradeLetter(pct) {
  if (pct >= 93) return "A";
  if (pct >= 85) return "B+";
  if (pct >= 77) return "B";
  if (pct >= 70) return "C+";
  if (pct >= 60) return "C";
  return "F";
}

function getGradeColor(pct) {
  if (pct >= 77) return "#059669";
  if (pct >= 60) return "#d97706";
  return "#dc2626";
}

export default function CertificateGenerator({ scenario, scores, xp, levelInfo }) {
  const totalCorrect = scores.reduce((s, m) => s + m.correct, 0);
  const totalQuestions = scores.reduce((s, m) => s + m.total, 0);
  const pct = Math.round((totalCorrect / totalQuestions) * 100);
  const grade = getGradeLetter(pct);
  const gradeColor = getGradeColor(pct);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const moduleRows = scores.map((s) => {
    const mpct = Math.round((s.correct / s.total) * 100);
    return `<tr>
      <td style="padding:5px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">${s.module}</td>
      <td style="padding:5px 10px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:12px">${s.correct}/${s.total}</td>
      <td style="padding:5px 10px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:12px;font-weight:700;color:${getGradeColor(mpct)}">${mpct}%</td>
    </tr>`;
  }).join("");

  const handleDownload = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Certificate of Achievement — ${scenario.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8f5ee; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', Arial, sans-serif; }
    .cert-wrap { padding: 32px; max-width: 820px; width: 100%; margin: auto; }
    .cert {
      background: #ffffff;
      border: 2px solid #d4b896;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }
    .cert-inner {
      border: 6px solid transparent;
      background:
        linear-gradient(white, white) padding-box,
        linear-gradient(135deg, #c8a96e, #059669, #c8a96e, #059669) border-box;
      padding: 48px 56px;
    }
    .corner {
      position: absolute;
      width: 60px; height: 60px;
      border-color: #c8a96e;
      border-style: solid;
      opacity: 0.6;
    }
    .corner-tl { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }
    .seal {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, #059669, #047857);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 0 0 4px #d1fae5, 0 0 0 8px #059669;
    }
    .seal-inner { color: white; font-size: 36px; }
    .issued-by { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #6b7280; text-align: center; margin-bottom: 10px; }
    .cert-title { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 700; text-align: center; color: #1f2937; line-height: 1.2; margin-bottom: 6px; }
    .cert-subtitle { font-size: 13px; color: #6b7280; text-align: center; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 28px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px; }
    .presented-to { font-size: 13px; color: #9ca3af; text-align: center; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .student-name { font-family: 'Playfair Display', Georgia, serif; font-size: 44px; font-weight: 700; text-align: center; color: #059669; margin-bottom: 6px; }
    .student-role { font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 28px; }
    .achievement-text { font-size: 14px; color: #374151; text-align: center; line-height: 1.7; max-width: 520px; margin: 0 auto 32px; }
    .stats-row { display: flex; justify-content: center; gap: 0; margin-bottom: 32px; }
    .stat-box { text-align: center; padding: 16px 36px; border: 1px solid #e5e7eb; }
    .stat-box:first-child { border-radius: 8px 0 0 8px; }
    .stat-box:last-child { border-radius: 0 8px 8px 0; }
    .stat-box + .stat-box { border-left: none; }
    .stat-val { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; }
    .stat-lbl { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #9ca3af; margin-top: 2px; }
    .module-section { margin-bottom: 28px; }
    .module-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af; text-align: center; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #9ca3af; padding: 6px 10px; border-bottom: 2px solid #e5e7eb; text-align: left; }
    th:not(:first-child) { text-align: center; }
    .sig-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 12px; padding-top: 24px; border-top: 1px solid #f3f4f6; }
    .sig-block { text-align: center; }
    .sig-line { width: 180px; border-bottom: 1px solid #d1d5db; margin-bottom: 4px; height: 28px; display: flex; align-items: flex-end; justify-content: center; }
    .sig-name { font-style: italic; font-size: 16px; color: #374151; }
    .sig-label { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #9ca3af; }
    .date-issued { font-size: 12px; color: #9ca3af; }
    @media print {
      body { background: white; }
      .cert-wrap { padding: 0; }
    }
  </style>
</head>
<body>
<div class="cert-wrap">
  <div class="cert">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="cert-inner">
      <div class="seal"><div class="seal-inner">🏆</div></div>
      <div class="issued-by">Money Matters Financial Literacy Program</div>
      <div class="cert-title">Certificate of Achievement</div>
      <div class="cert-subtitle">Financial Literacy Final Examination</div>
      <hr class="divider"/>
      <div class="presented-to">This certifies that</div>
      <div class="student-name">${scenario.name}</div>
      <div class="student-role">${scenario.job.title} · ${scenario.pathId ? scenario.pathId.charAt(0).toUpperCase() + scenario.pathId.slice(1) : "Standard"} Path</div>
      <div class="achievement-text">
        has successfully completed all modules of the <strong>Money Matters Financial Literacy Exam</strong>,
        demonstrating knowledge in budgeting, tax filing, writing checks, banking, credit applications,
        and personal financial management.
      </div>
      <div class="stats-row">
        <div class="stat-box">
          <div class="stat-val" style="color:${gradeColor}">${grade}</div>
          <div class="stat-lbl">Final Grade</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color:#1f2937">${pct}%</div>
          <div class="stat-lbl">Overall Score</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color:#7c3aed">${xp}</div>
          <div class="stat-lbl">XP Earned</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color:#059669">L${levelInfo.level}</div>
          <div class="stat-lbl">${levelInfo.title}</div>
        </div>
      </div>
      <div class="module-section">
        <div class="module-title">Module Breakdown</div>
        <table>
          <thead><tr><th>Module</th><th>Score</th><th>Result</th></tr></thead>
          <tbody>${moduleRows}</tbody>
        </table>
      </div>
      <div class="sig-row">
        <div class="sig-block">
          <div class="sig-line"><span class="sig-name">${scenario.name}</span></div>
          <div class="sig-label">Student</div>
        </div>
        <div class="sig-block">
          <div class="date-issued">Issued: ${date}</div>
        </div>
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-label">Teacher Signature</div>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.onload = () => setTimeout(() => win.print(), 400);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      className="w-full h-11 gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
    >
      <Award className="w-4 h-4" /> Download Certificate of Achievement
    </Button>
  );
}