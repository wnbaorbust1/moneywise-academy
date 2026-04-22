import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Trophy, Users, TrendingUp, BarChart2, RefreshCw,
  Trash2, Medal, Star, Zap, ArrowLeft, Lock, CheckCircle2,
  AlertTriangle, Crown
} from "lucide-react";
import { getAllStudents, clearAllStudents } from "@/lib/storage";
import ExportButton from "@/components/teacher/ExportButton";
import { getLevel, getFinancialHealthLabel, calcFinancialHealthScore, LEVELS } from "@/lib/xpSystem";
import { Link } from "react-router-dom";

const TEACHER_PIN = "1234"; // simple classroom PIN

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-lg sm:text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </Card>
  );
}

function RankBadge({ rank }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
}

export default function TeacherDashboard() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState("leaderboard"); // leaderboard | class | modules
  const [filterPeriod, setFilterPeriod] = useState("All");

  const load = () => setStudents(getAllStudents().sort((a, b) => b.xp - a.xp));

  useEffect(() => { if (unlocked) load(); }, [unlocked]);

  const handlePin = () => {
    if (pin === TEACHER_PIN) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPin(""); }
  };

  const handleClear = () => {
    if (confirm("Clear ALL student records? This cannot be undone.")) {
      clearAllStudents();
      load();
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Card className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold mb-1">Teacher Dashboard</h2>
            <p className="text-sm text-muted-foreground mb-5">Enter your classroom PIN to view student data.</p>
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePin()}
              placeholder="Enter PIN"
              className={`h-11 text-center text-xl tracking-widest mb-3 ${pinError ? "border-destructive" : ""}`}
              maxLength={6}
            />
            {pinError && <p className="text-xs text-destructive mb-3">Incorrect PIN. Try again.</p>}
            <Button onClick={handlePin} className="w-full h-11">Unlock Dashboard</Button>
            <div className="mt-4">
              <Link to="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Student Exam
              </Link>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4">Default PIN: 1234</p>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Derive all unique class periods, sorted
  const allPeriods = ["All", ...Array.from(new Set(students.map((s) => s.classPeriod).filter(Boolean))).sort()];

  const filteredStudents = filterPeriod === "All"
    ? students
    : students.filter((s) => s.classPeriod === filterPeriod);

  const avgXP = filteredStudents.length ? Math.round(filteredStudents.reduce((a, s) => a + s.xp, 0) / filteredStudents.length) : 0;
  const avgPct = filteredStudents.length
    ? Math.round(filteredStudents.reduce((a, s) => a + (s.totalCorrect / Math.max(1, s.totalQuestions)) * 100, 0) / filteredStudents.length)
    : 0;
  const completedAll = filteredStudents.filter((s) => s.modulesCompleted >= 8).length;

  // Module performance across all students
  const moduleNames = ["Budget Building", "Tax Filing", "Financial Literacy", "Writing Checks", "Checkbook Balancing", "Opening a Bank Account", "Credit Application"];
  const moduleStats = moduleNames.map((name) => {
    const scored = filteredStudents.flatMap((s) => (s.scores || []).filter((sc) => sc.module === name));
    const avg = scored.length ? Math.round(scored.reduce((a, sc) => a + (sc.correct / sc.total) * 100, 0) / scored.length) : null;
    return { name, avg, count: scored.length };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base">Teacher Dashboard</h1>
              <p className="text-[10px] text-muted-foreground">Money Matters Final Exam</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton students={filteredStudents} />
            <Button variant="outline" size="sm" onClick={load} className="gap-1.5 h-8">
              <RefreshCw className="w-3 h-3" /> Refresh
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                <ArrowLeft className="w-3 h-3" /> Student View
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Period filter */}
        {allPeriods.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground shrink-0">Class Period:</span>
            {allPeriods.map((p) => (
              <button
                key={p}
                onClick={() => setFilterPeriod(p)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  filterPeriod === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "All" ? "All Periods" : `${p} Period`}
              </button>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total Students" value={filteredStudents.length} color="bg-primary" />
          <StatCard icon={Zap} label="Avg XP" value={avgXP} sub="per student" color="bg-accent" />
          <StatCard icon={TrendingUp} label="Avg Score" value={`${avgPct}%`} sub="accuracy" color="bg-chart-3" />
          <StatCard icon={CheckCircle2} label="Finished Exam" value={completedAll} sub="all modules done" color="bg-chart-4" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
          {[
            { id: "leaderboard", label: "🏆 Leaderboard" },
            { id: "modules", label: "📊 Module Stats" },
            { id: "class", label: "👥 Class List" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* LEADERBOARD */}
        {tab === "leaderboard" && (
          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No students have completed the exam yet.</p>
              </Card>
            ) : (
              filteredStudents.map((s, idx) => {
                const levelInfo = getLevel(s.xp);
                const healthScore = s.healthScore || 0;
                const healthLabel = getFinancialHealthLabel(healthScore);
                const pct = Math.round((s.totalCorrect / Math.max(1, s.totalQuestions)) * 100);
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className={`p-4 ${idx === 0 ? "border-yellow-300 bg-yellow-50/30" : idx === 1 ? "border-slate-300 bg-slate-50/30" : idx === 2 ? "border-amber-300 bg-amber-50/30" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 shrink-0">
                          <RankBadge rank={idx + 1} />
                        </div>

                        {/* Avatar / level */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: levelInfo.color }}
                        >
                          {levelInfo.level}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm truncate">{s.name}</span>
                            <Badge variant="outline" className="text-[10px] shrink-0" style={{ borderColor: levelInfo.color, color: levelInfo.color }}>
                              {levelInfo.title}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{s.job} · {pct}% accuracy{s.classPeriod ? ` · ${s.classPeriod} Period` : ""}</p>
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                          <div className="flex items-center justify-end gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className="text-sm font-bold">{s.xp} XP</span>
                          </div>
                          {healthScore > 0 && (
                            <p className={`text-xs font-semibold ${healthLabel.color}`}>
                              {healthScore} FS
                            </p>
                          )}
                        </div>
                      </div>

                      {/* XP progress bar */}
                      <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${levelInfo.progress}%`, backgroundColor: levelInfo.color }}
                        />
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* MODULE STATS */}
        {tab === "modules" && (
          <div className="space-y-3">
            {moduleStats.map((m, idx) => (
              <Card key={m.name} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{m.count} submissions</span>
                    {m.avg !== null && (
                      <Badge variant={m.avg >= 80 ? "default" : m.avg >= 60 ? "secondary" : "destructive"} className="text-xs">
                        {m.avg}%
                      </Badge>
                    )}
                  </div>
                </div>
                {m.avg !== null ? (
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.avg}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                      className={`h-full rounded-full ${m.avg >= 80 ? "bg-primary" : m.avg >= 60 ? "bg-accent" : "bg-destructive"}`}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No data yet</p>
                )}
                {m.avg !== null && m.avg < 70 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                    <p className="text-xs text-destructive">Class struggling here — review this topic!</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* CLASS LIST */}
        {tab === "class" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button variant="destructive" size="sm" onClick={handleClear} className="gap-1.5 h-8 text-xs">
                <Trash2 className="w-3 h-3" /> Clear All Records
              </Button>
            </div>
            {filteredStudents.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No students yet.</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2 font-semibold text-xs text-muted-foreground">Name</th>
                      <th className="pb-2 font-semibold text-xs text-muted-foreground">Period</th>
                      <th className="pb-2 font-semibold text-xs text-muted-foreground">Job</th>
                      <th className="pb-2 font-semibold text-xs text-muted-foreground text-center">XP</th>
                      <th className="pb-2 font-semibold text-xs text-muted-foreground text-center">Level</th>
                      <th className="pb-2 font-semibold text-xs text-muted-foreground text-center">Score%</th>
                      <th className="pb-2 font-semibold text-xs text-muted-foreground text-center">Modules</th>
                      <th className="pb-2 font-semibold text-xs text-muted-foreground text-center">Fin. Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, idx) => {
                      const levelInfo = getLevel(s.xp);
                      const pct = Math.round((s.totalCorrect / Math.max(1, s.totalQuestions)) * 100);
                      const healthLabel = getFinancialHealthLabel(s.healthScore || 0);
                      return (
                        <tr key={s.name} className={`border-b last:border-0 ${idx % 2 === 0 ? "bg-muted/20" : ""}`}>
                          <td className="py-2.5 font-medium">{s.name}</td>
                          <td className="py-2.5 text-xs text-center">
                            {s.classPeriod ? (
                              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">{s.classPeriod}</span>
                            ) : "—"}
                          </td>
                          <td className="py-2.5 text-xs text-muted-foreground">{s.job}</td>
                          <td className="py-2.5 text-center">
                            <span className="font-bold">{s.xp}</span>
                          </td>
                          <td className="py-2.5 text-center">
                            <span className="text-xs font-semibold" style={{ color: levelInfo.color }}>
                              L{levelInfo.level} {levelInfo.title}
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            <Badge variant={pct >= 80 ? "default" : pct >= 60 ? "secondary" : "destructive"} className="text-xs">
                              {pct}%
                            </Badge>
                          </td>
                          <td className="py-2.5 text-center text-xs">{s.modulesCompleted || 0}/8</td>
                          <td className={`py-2.5 text-center text-xs font-semibold ${healthLabel.color}`}>
                            {s.healthScore ? `${s.healthScore}` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}