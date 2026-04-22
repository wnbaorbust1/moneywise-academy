import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BADGES, getEarnedBadges } from "@/components/exam/BadgeShowcase";
import { LEVELS, getLevel } from "@/lib/xpSystem";
import { LIFE_EVENT_SCENARIOS, UPCOMING_CHALLENGES } from "@/lib/careerLadder";
import { getAllStudents } from "@/lib/storage";
import {
  ArrowLeft, Lock, CheckCircle2, Zap, Star, Trophy, ChevronRight, Sparkles,
} from "lucide-react";

function DifficultyDots({ level }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-accent" : "bg-muted"}`}
        />
      ))}
    </div>
  );
}

function XPProgressRail({ xp }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        {LEVELS.map((lvl, i) => {
          const reached = xp >= lvl.minXP;
          return (
            <div key={lvl.level} className="flex flex-col items-center gap-1" style={{ flex: i < LEVELS.length - 1 ? 1 : 0 }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all z-10 relative"
                style={{
                  backgroundColor: reached ? lvl.color : "hsl(var(--muted))",
                  borderColor: reached ? lvl.color : "hsl(var(--border))",
                  color: reached ? "#fff" : "hsl(var(--muted-foreground))",
                }}
              >
                {reached ? lvl.level : <Lock className="w-3 h-3" />}
              </div>
              {i < LEVELS.length - 1 && (
                <div className="absolute" />
              )}
            </div>
          );
        })}
      </div>
      {/* Track bar */}
      <div className="absolute top-3.5 left-3.5 right-3.5 h-1 bg-muted rounded-full -z-0">
        {(() => {
          const levelInfo = getLevel(xp);
          const maxXP = LEVELS[LEVELS.length - 1].minXP;
          const fillPct = Math.min(100, (xp / maxXP) * 100);
          return (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-primary"
            />
          );
        })()}
      </div>
    </div>
  );
}

export default function CareerLadder() {
  const [student, setStudent] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");

  const lookup = () => {
    const found = getAllStudents().find(
      (s) => s.name.toLowerCase() === nameInput.trim().toLowerCase()
    );
    if (found) {
      setStudent(found);
      setError("");
    } else {
      setError("No record found. Complete the exam first!");
    }
  };

  const xp = student?.xp || 0;
  const scores = student?.scores || [];
  const levelInfo = getLevel(xp);
  const earnedBadges = getEarnedBadges(xp, scores);
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/">
            <button className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold leading-none">Career Ladder</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Track your progress & unlock new challenges</p>
          </div>
          {student && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: levelInfo.color + "20", color: levelInfo.color }}
            >
              <Zap className="w-3 h-3" />
              {xp} XP
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Name lookup */}
        {!student ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h2 className="font-display text-xl font-bold mb-1">Find Your Progress</h2>
              <p className="text-sm text-muted-foreground mb-4">Enter the name you used during your exam</p>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  className="flex-1 h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Your name..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && lookup()}
                />
                <Button size="sm" onClick={lookup}>Look Up</Button>
              </div>
              {error && <p className="text-xs text-destructive mt-2">{error}</p>}
              <p className="text-[10px] text-muted-foreground mt-4">
                No record yet?{" "}
                <Link to="/" className="text-primary underline">Take the exam first</Link>
              </p>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Level overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: levelInfo.color }}
                  >
                    {levelInfo.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{levelInfo.title}</p>
                  </div>
                  <button
                    onClick={() => setStudent(null)}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Switch
                  </button>
                </div>
                <XPProgressRail xp={xp} />
                <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
                  {LEVELS.map((l) => (
                    <span key={l.level} className="text-center truncate" style={{ flex: 1 }}>
                      {l.title.split(" ")[0]}
                    </span>
                  ))}
                </div>
                {levelInfo.nextLevel && (
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    <span className="font-semibold text-foreground">{levelInfo.nextLevel.minXP - xp} XP</span> to reach {levelInfo.nextLevel.title}
                  </p>
                )}
              </Card>
            </motion.div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Badges — {earnedBadges.length}/{BADGES.length} Earned
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {BADGES.map((b) => {
                  const earned = earnedBadgeIds.has(b.id);
                  return (
                    <Card
                      key={b.id}
                      className={`p-2 text-center transition-all ${earned ? "border-primary/30 bg-primary/5" : "opacity-40 grayscale"}`}
                      title={earned ? b.desc : `Locked: ${b.desc}`}
                    >
                      <div className="text-2xl mb-1">{b.emoji}</div>
                      <p className="text-[9px] font-semibold leading-tight">{b.label}</p>
                      {earned && <p className="text-[8px] text-primary mt-0.5">✓ Earned</p>}
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            {/* Life Event Scenarios */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Life Event Scenarios
              </h2>
              <div className="space-y-3">
                {LIFE_EVENT_SCENARIOS.map((scenario, idx) => {
                  const unlocked = xp >= scenario.xpRequired;
                  return (
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.07 }}
                    >
                      <Card
                        className={`p-4 transition-all ${
                          unlocked
                            ? "border-primary/20 bg-card hover:shadow-md"
                            : "opacity-60 bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-3xl shrink-0 ${!unlocked ? "grayscale" : ""}`}>
                            {scenario.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold text-sm">{scenario.title}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${scenario.tagColor}`}>
                                {scenario.tag}
                              </span>
                              <DifficultyDots level={scenario.difficulty} />
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                              {scenario.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {scenario.challenges.map((c, i) => (
                                <span
                                  key={i}
                                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                    unlocked
                                      ? "bg-muted text-foreground border-border"
                                      : "bg-muted/50 text-muted-foreground border-muted"
                                  }`}
                                >
                                  {unlocked ? <CheckCircle2 className="inline w-2.5 h-2.5 mr-0.5 text-primary" /> : null}
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-1.5">
                            {unlocked ? (
                              <div className="flex items-center gap-1 text-primary">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-0.5">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[9px] text-muted-foreground font-semibold whitespace-nowrap">
                                  {scenario.xpRequired} XP
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* XP progress bar toward unlock */}
                        {!unlocked && (
                          <div className="mt-3">
                            <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                              <span>Progress to unlock</span>
                              <span>{xp}/{scenario.xpRequired} XP</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div
                                className="h-full rounded-full bg-primary/50 transition-all"
                                style={{ width: `${Math.min(100, (xp / scenario.xpRequired) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Upcoming Challenges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> Upcoming Challenges
              </h2>
              <div className="space-y-2">
                {UPCOMING_CHALLENGES.map((ch, idx) => (
                  <Card key={idx} className="p-3 flex items-center gap-3 opacity-70 bg-muted/20">
                    <span className="text-xl grayscale">{ch.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{ch.title}</p>
                      <p className="text-[11px] text-muted-foreground">{ch.desc}</p>
                    </div>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border shrink-0">
                      Coming Soon
                    </span>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link to="/">
                <Button className="w-full h-11 gap-2">
                  <ChevronRight className="w-4 h-4" /> Go Back to Exam
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}