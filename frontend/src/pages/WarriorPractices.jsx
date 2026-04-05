import React, { useState, useEffect } from "react";
import { 
  Sword, Target, Wind, Crosshair, ChevronDown, ChevronUp, Clock,
  AlertCircle, BookOpen, Plus, Save, Dumbbell, X, ShoppingCart, CheckCircle2, Circle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const practiceIcons = { iaido: Sword, kyudo: Target, systema: Wind, throwing_daggers: Crosshair };

function SkillBlock({ skill }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-sm overflow-hidden mb-3" data-testid={`skill-${skill.skill?.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => setOpen(!open)}>
        <div>
          <p className="text-sm font-medium text-zinc-200">{skill.skill}</p>
          <p className="text-xs text-zinc-500">{skill.what_it_is?.substring(0, 100)}{skill.what_it_is?.length > 100 ? "..." : ""}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
      </div>
      {open && (
        <div className="p-4 space-y-4 bg-[#111113]">
          <p className="text-sm text-zinc-300">{skill.what_it_is}</p>
          
          {skill.how_to_do_it && (
            <div>
              <p className="text-xs text-emerald-400 font-medium mb-2">How to Do It</p>
              <ol className="space-y-2">
                {skill.how_to_do_it.map((step, i) => (
                  <li key={i} className="text-sm text-zinc-300 pl-6 relative">
                    <span className="absolute left-0 text-red-400 font-mono text-xs">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {skill.key_principle && (
            <div className="p-3 bg-red-600/5 border border-red-600/20 rounded-sm">
              <p className="text-xs text-red-400 font-medium mb-1">Key Principle</p>
              <p className="text-sm text-zinc-300">{skill.key_principle}</p>
            </div>
          )}

          {skill.common_mistakes && (
            <div>
              <p className="text-xs text-amber-400 font-medium mb-2">Common Mistakes</p>
              <ul className="space-y-1">
                {skill.common_mistakes.map((m, i) => (
                  <li key={i} className="text-xs text-zinc-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-500/50">{m}</li>
                ))}
              </ul>
            </div>
          )}

          {skill.progression && (
            <div className="p-3 bg-zinc-900/50 rounded-sm">
              <p className="text-xs text-zinc-500 mb-1">Progression</p>
              <p className="text-sm text-zinc-300">{skill.progression}</p>
            </div>
          )}

          {skill.beginner_note && (
            <div className="p-3 bg-blue-600/5 border border-blue-600/20 rounded-sm">
              <p className="text-xs text-blue-400 font-medium mb-1">Beginner Note</p>
              <p className="text-sm text-zinc-300">{skill.beginner_note}</p>
            </div>
          )}

          {skill.safety && (
            <div className="p-3 bg-red-600/5 border border-red-600/20 rounded-sm">
              <p className="text-xs text-red-400 font-medium mb-1">Safety</p>
              <p className="text-sm text-zinc-300">{skill.safety}</p>
            </div>
          )}

          {skill.no_partner_alternative && (
            <div className="p-3 bg-zinc-900/50 rounded-sm">
              <p className="text-xs text-zinc-500 mb-1">No Partner Alternative</p>
              <p className="text-sm text-zinc-300">{skill.no_partner_alternative}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExpandedReference({ practice }) {
  const [openSections, setOpenSections] = useState({});
  const toggle = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  return (
    <Card className="bg-[#18181b] border-zinc-800" data-testid="expanded-reference">
      <CardHeader className="pb-3">
        <CardTitle className="heading-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Training Reference
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Body Map */}
        {practice.body_map && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("body_map")}>
              <p className="text-sm font-medium text-zinc-200">Body Map</p>
              {openSections.body_map ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.body_map && (
              <div className="p-4 space-y-3 bg-[#111113]">
                {Object.entries(practice.body_map).map(([k, v]) => (
                  <div key={k} className="p-2 bg-zinc-900/50 rounded-sm">
                    <p className="text-xs text-red-400 font-medium mb-1 capitalize">{k.replace(/_/g, " ")}</p>
                    <p className="text-sm text-zinc-300">{v}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Drill Menu */}
        {practice.drill_menu?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("drills")}>
              <p className="text-sm font-medium text-zinc-200">Drill Menu</p>
              {openSections.drills ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.drills && (
              <div className="p-4 bg-[#111113] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left p-2 text-xs text-zinc-500 font-medium">Drill</th>
                      <th className="text-left p-2 text-xs text-zinc-500 font-medium">Purpose</th>
                      <th className="text-left p-2 text-xs text-zinc-500 font-medium">Dose</th>
                      <th className="text-left p-2 text-xs text-zinc-500 font-medium">Watch For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {practice.drill_menu.map((d, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        <td className="p-2 text-zinc-200 font-medium">{d.drill}</td>
                        <td className="p-2 text-zinc-400">{d.purpose}</td>
                        <td className="p-2 text-emerald-400 font-mono text-xs">{d.dose}</td>
                        <td className="p-2 text-amber-400/70 text-xs">{d.watch_for}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Faults & Corrections */}
        {practice.faults_and_corrections?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("faults")}>
              <p className="text-sm font-medium text-zinc-200">Common Faults & Corrections</p>
              {openSections.faults ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.faults && (
              <div className="p-4 space-y-3 bg-[#111113]">
                {practice.faults_and_corrections.map((f, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm text-amber-400 mb-1">{f.fault}</p>
                    <p className="text-sm text-zinc-300">{f.correction}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Week Progression */}
        {practice.week_progression?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("weeks")}>
              <p className="text-sm font-medium text-zinc-200">Week-by-Week Progression</p>
              {openSections.weeks ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.weeks && (
              <div className="p-4 space-y-2 bg-[#111113]">
                {practice.week_progression.map((w, i) => (
                  <div key={i} className="flex gap-3 p-2 bg-zinc-900/50 rounded-sm">
                    <span className="text-red-400 font-mono text-xs shrink-0 pt-0.5">W{w.weeks}</span>
                    <p className="text-sm text-zinc-300">{w.focus}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Self-Audit */}
        {practice.self_audit?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("audit")}>
              <p className="text-sm font-medium text-zinc-200">Self-Audit Questions</p>
              {openSections.audit ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.audit && (
              <div className="p-4 space-y-2 bg-[#111113]">
                {practice.self_audit.map((q, i) => (
                  <p key={i} className="text-sm text-zinc-300 pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full before:absolute before:left-0 before:top-2">{q}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Core Principles Expanded (Systema) */}
        {practice.core_principles_expanded?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("principles")}>
              <p className="text-sm font-medium text-zinc-200">Core Principles</p>
              {openSections.principles ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.principles && (
              <div className="p-4 space-y-3 bg-[#111113]">
                {practice.core_principles_expanded.map((p, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 rounded-sm border-l-2 border-red-600">
                    <p className="text-sm font-medium text-zinc-200 mb-1">{p.principle}</p>
                    <p className="text-sm text-zinc-400">{p.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Solo Modules (Systema) */}
        {practice.solo_modules?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("solo")}>
              <p className="text-sm font-medium text-zinc-200">Solo Training Modules</p>
              {openSections.solo ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.solo && (
              <div className="p-4 space-y-3 bg-[#111113]">
                {practice.solo_modules.map((m, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm font-medium text-emerald-400 mb-1">{m.module}</p>
                    <p className="text-sm text-zinc-300">{m.instructions}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Partner Progression (Systema) */}
        {practice.partner_progression?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("partner")}>
              <p className="text-sm font-medium text-zinc-200">Partner Progression</p>
              {openSections.partner ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.partner && (
              <div className="p-4 space-y-3 bg-[#111113]">
                {practice.partner_progression.map((p, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">Stage {p.stage}</Badge>
                      <p className="text-sm font-medium text-zinc-200">{p.name}</p>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div><span className="text-xs text-zinc-500">Partner:</span> <span className="text-zinc-400">{p.partner_task}</span></div>
                      <div><span className="text-xs text-zinc-500">You:</span> <span className="text-zinc-300">{p.your_task}</span></div>
                      <div><span className="text-xs text-zinc-500">Standard:</span> <span className="text-emerald-400">{p.standard}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Failure Patterns (Systema) */}
        {practice.failure_patterns?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("failures")}>
              <p className="text-sm font-medium text-zinc-200">Common Failure Patterns</p>
              {openSections.failures ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.failures && (
              <div className="p-4 space-y-3 bg-[#111113]">
                {practice.failure_patterns.map((f, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm text-amber-400 mb-1">{f.pattern}</p>
                    <p className="text-sm text-zinc-300">{f.correction}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Preparatory Capacities (Kyudo) */}
        {practice.preparatory_capacities?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("prep")}>
              <p className="text-sm font-medium text-zinc-200">Preparatory Capacities</p>
              {openSections.prep ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.prep && (
              <div className="p-4 space-y-2 bg-[#111113]">
                {practice.preparatory_capacities.map((c, i) => (
                  <p key={i} className="text-sm text-zinc-300 pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-emerald-500 before:rounded-full before:absolute before:left-0 before:top-2">{c}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Proficiency Standards (Kyudo) */}
        {practice.proficiency_standards?.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            <div className="p-3 bg-zinc-900/50 cursor-pointer flex items-center justify-between" onClick={() => toggle("standards")}>
              <p className="text-sm font-medium text-zinc-200">Proficiency Standards</p>
              {openSections.standards ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openSections.standards && (
              <div className="p-4 space-y-2 bg-[#111113]">
                {practice.proficiency_standards.map((s, i) => (
                  <p key={i} className="text-sm text-zinc-300 pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full before:absolute before:left-0 before:top-2">{s}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Self-Teaching Boundaries */}
        {practice.self_teaching_boundaries && (
          <div className="p-3 bg-amber-600/5 border border-amber-600/20 rounded-sm">
            <p className="text-xs text-amber-400 font-medium mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Self-Teaching Boundaries
            </p>
            <p className="text-sm text-zinc-300">{practice.self_teaching_boundaries}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function WarriorPractices() {
  const [practices, setPractices] = useState(null);
  const [warriorProgress, setWarriorProgress] = useLocalStorage("warrior_progress", {
    iaido: { stage: 1, completedRequirements: [] },
    kyudo: { stage: 1, completedRequirements: [] },
    systema: { stage: 1, completedRequirements: [] },
    throwing_daggers: { stage: 1, completedRequirements: [] }
  });
  const [selectedPractice, setSelectedPractice] = useState("iaido");
  const [selectedStage, setSelectedStage] = useState(0);
  const [showWorkoutLog, setShowWorkoutLog] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([{ name: "", sets: "", reps: "", duration: "" }]);
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/warrior/practices`)
      .then(r => r.json())
      .then(setPractices)
      .catch(console.error);
    fetch(`${BACKEND_URL}/api/tracking/workouts`)
      .then(r => r.json())
      .then(data => setRecentWorkouts(data.workouts || []))
      .catch(console.error);
  }, []);

  const practice = practices?.[selectedPractice];
  const stages = practice?.stages || [];
  const currentStage = stages[selectedStage] || stages[0];
  const Icon = practiceIcons[selectedPractice] || Sword;

  const toggleRequirement = (req) => {
    setWarriorProgress(prev => {
      const curr = prev[selectedPractice] || { stage: 1, completedRequirements: [] };
      const completed = curr.completedRequirements.includes(req)
        ? curr.completedRequirements.filter(r => r !== req)
        : [...curr.completedRequirements, req];
      return { ...prev, [selectedPractice]: { ...curr, completedRequirements: completed } };
    });
  };

  const addExerciseRow = () => setWorkoutExercises(prev => [...prev, { name: "", sets: "", reps: "", duration: "" }]);
  const updateExercise = (idx, field, value) => setWorkoutExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  const removeExercise = (idx) => setWorkoutExercises(prev => prev.filter((_, i) => i !== idx));

  const submitWorkout = async () => {
    const validExercises = workoutExercises.filter(e => e.name.trim());
    if (validExercises.length === 0) return;
    try {
      await fetch(`${BACKEND_URL}/api/tracking/workout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practice: selectedPractice, exercises: validExercises, duration_minutes: parseInt(workoutDuration) || 0, date: new Date().toISOString().split('T')[0], notes: workoutNotes }),
      });
      await fetch(`${BACKEND_URL}/api/tracking/activity`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "workout", date: new Date().toISOString().split('T')[0] }),
      });
      const res = await fetch(`${BACKEND_URL}/api/tracking/workouts`);
      setRecentWorkouts((await res.json()).workouts || []);
      setShowWorkoutLog(false);
      setWorkoutExercises([{ name: "", sets: "", reps: "", duration: "" }]);
      setWorkoutDuration("");
      setWorkoutNotes("");
    } catch (e) { console.error(e); }
  };

  if (!practices) return <div className="p-8 text-zinc-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="warrior-practices-page">
      <div>
        <h1 className="heading-2 text-zinc-100">The Warrior's Practice</h1>
        <p className="body-text mt-2">Four disciplines. Each develops a different dimension of the sovereign self.</p>
      </div>

      {/* Practice Selector */}
      <Tabs value={selectedPractice} onValueChange={(v) => { setSelectedPractice(v); setSelectedStage(0); }} className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
          {Object.keys(practices).map(key => {
            const PIcon = practiceIcons[key] || Sword;
            return (
              <TabsTrigger key={key} value={key} className="text-xs flex items-center gap-1" data-testid={`tab-${key}`}>
                <PIcon className="w-3 h-3" />
                {practices[key]?.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(practices).map(key => (
          <TabsContent key={key} value={key} className="mt-4 space-y-4">
            {/* Practice Overview */}
            <Card className="bg-[#18181b] border-zinc-800">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm bg-red-500/10 border border-red-500/30">
                    <Icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-zinc-100">{practice?.name}</h2>
                    <p className="text-xs text-zinc-500">{stages.length} stages</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-300">{practice?.description}</p>
                {practice?.philosophy && (
                  <div className="p-3 bg-zinc-900/50 rounded-sm border-l-2 border-red-600">
                    <p className="text-xs text-zinc-500 mb-1">Philosophy</p>
                    <p className="text-sm text-zinc-400 italic">{practice.philosophy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipment */}
            {practice?.equipment?.length > 0 && (
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="heading-4 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-amber-400" />
                    Equipment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {practice.equipment.map((eq, i) => (
                    <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-zinc-200">{eq.name}</p>
                        <Badge variant="outline" className="text-xs">{eq.stage}</Badge>
                      </div>
                      <div className="p-2 bg-amber-600/5 border border-amber-600/20 rounded-sm mt-2">
                        <p className="text-xs text-zinc-300">{eq.sourcing}</p>
                      </div>
                      {eq.care && <p className="text-xs text-zinc-500 mt-1">Care: {eq.care}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Expanded Reference Sections */}
            {(practice?.body_map || practice?.drill_menu || practice?.faults_and_corrections || practice?.core_principles_expanded || practice?.solo_modules || practice?.partner_progression) && (
              <ExpandedReference practice={practice} />
            )}

            {/* Stage Selector */}
            <div className="flex gap-2 flex-wrap">
              {stages.map((s, si) => (
                <Button
                  key={si}
                  variant={selectedStage === si ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStage(si)}
                  className={cn(selectedStage === si && "bg-red-600 hover:bg-red-700")}
                  data-testid={`stage-btn-${s.stage}`}
                >
                  Stage {s.stage}: {s.name}
                </Button>
              ))}
            </div>

            {/* Current Stage Detail */}
            {currentStage && (
              <Card className="bg-[#18181b] border-zinc-800" data-testid="current-stage">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="heading-3">Stage {currentStage.stage}: {currentStage.name}</CardTitle>
                      <p className="text-xs text-zinc-500 mt-1">{currentStage.focus}</p>
                    </div>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{currentStage.duration}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Detailed Instructions */}
                  {currentStage.detailed_instructions?.length > 0 ? (
                    <div>
                      <p className="text-xs text-emerald-400 font-medium mb-3">Skills & Detailed Instructions</p>
                      {currentStage.detailed_instructions.map((skill, i) => (
                        <SkillBlock key={i} skill={skill} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">Detailed instructions coming soon.</p>
                  )}

                  {/* Requirements Checklist */}
                  {currentStage.requirements?.length > 0 && (
                    <div className="p-4 bg-zinc-900/50 rounded-sm">
                      <p className="text-xs text-zinc-500 font-medium mb-3">Requirements to Advance</p>
                      <div className="space-y-2">
                        {currentStage.requirements.map((req, i) => {
                          const completed = warriorProgress[selectedPractice]?.completedRequirements?.includes(req);
                          return (
                            <div
                              key={i}
                              className="flex items-start gap-3 cursor-pointer group"
                              onClick={() => toggleRequirement(req)}
                            >
                              {completed 
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                : <Circle className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0 group-hover:text-zinc-400" />
                              }
                              <p className={cn("text-sm", completed ? "text-zinc-500 line-through" : "text-zinc-300")}>{req}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Workout Log Section */}
      <Card className="bg-[#18181b] border-zinc-800" data-testid="workout-logger">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="heading-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-400" />
              Workout Log
            </CardTitle>
            <Dialog open={showWorkoutLog} onOpenChange={setShowWorkoutLog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-red-600 hover:bg-red-700" data-testid="log-workout-btn">
                  <Plus className="w-4 h-4 mr-1" /> Log Workout
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#18181b] border-zinc-800 max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="heading-4 text-zinc-100">Log Workout</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Duration (minutes)</label>
                    <Input type="number" value={workoutDuration} onChange={e => setWorkoutDuration(e.target.value)} placeholder="e.g. 60" className="bg-zinc-900 border-zinc-800" data-testid="workout-duration" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-2 block">Exercises</label>
                    {workoutExercises.map((ex, i) => (
                      <div key={i} className="grid grid-cols-[1fr_60px_60px_60px_30px] gap-2 mb-2 items-center">
                        <Input value={ex.name} onChange={e => updateExercise(i, "name", e.target.value)} placeholder="Exercise" className="bg-zinc-900 border-zinc-800 text-sm" />
                        <Input value={ex.sets} onChange={e => updateExercise(i, "sets", e.target.value)} placeholder="Sets" className="bg-zinc-900 border-zinc-800 text-sm" />
                        <Input value={ex.reps} onChange={e => updateExercise(i, "reps", e.target.value)} placeholder="Reps" className="bg-zinc-900 border-zinc-800 text-sm" />
                        <Input value={ex.duration} onChange={e => updateExercise(i, "duration", e.target.value)} placeholder="Min" className="bg-zinc-900 border-zinc-800 text-sm" />
                        {workoutExercises.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExercise(i)}>
                            <X className="w-3 h-3 text-zinc-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addExerciseRow} className="mt-1" data-testid="add-exercise">
                      <Plus className="w-3 h-3 mr-1" /> Add Exercise
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Notes</label>
                    <Textarea value={workoutNotes} onChange={e => setWorkoutNotes(e.target.value)} placeholder="Session notes..." className="bg-zinc-900 border-zinc-800 min-h-[80px]" />
                  </div>
                  <Button onClick={submitWorkout} className="w-full bg-red-600 hover:bg-red-700" data-testid="save-workout">
                    <Save className="w-4 h-4 mr-2" /> Save Workout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {recentWorkouts.length === 0 ? (
            <p className="text-sm text-zinc-500">No workouts logged yet.</p>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.slice(0, 8).map((w, i) => (
                <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-zinc-200 capitalize">{w.practice?.replace("_", " ") || "Workout"}</p>
                    <div className="flex items-center gap-2">
                      {w.duration_minutes > 0 && <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" />{w.duration_minutes}min</Badge>}
                      <span className="text-xs text-zinc-600">{w.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {w.exercises?.map((ex, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{ex.name}{ex.sets && ` ${ex.sets}x${ex.reps}`}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
