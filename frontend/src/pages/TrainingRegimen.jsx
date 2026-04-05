import React, { useState, useEffect } from "react";
import { 
  Dumbbell, ChevronDown, ChevronUp, Timer, Target, Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PHASE_COLORS = [
  "border-emerald-500/30 bg-emerald-500/5",
  "border-blue-500/30 bg-blue-500/5",
  "border-amber-500/30 bg-amber-500/5",
  "border-red-500/30 bg-red-500/5",
];

export default function TrainingRegimen() {
  const [data, setData] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(0);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/training-regimen`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-zinc-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="training-regimen-page">
      <div>
        <h1 className="heading-2 text-zinc-100">Training Regimen</h1>
        <p className="body-text mt-2">{data.philosophy?.principle}</p>
      </div>

      {/* Pillars */}
      <div className="grid md:grid-cols-3 gap-4">
        {data.philosophy?.pillars?.map((p, i) => (
          <Card key={i} className="bg-[#18181b] border-zinc-800">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-zinc-100">{p.name}</p>
              <p className="text-xs text-zinc-400 mt-1">{p.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Architecture */}
      {data.session_architecture && (
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader>
            <CardTitle className="heading-4 flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-400" />
              Session Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-zinc-500 mb-3">{data.session_architecture.description}</p>
            {data.session_architecture.phases?.map((p, i) => (
              <div key={i} className="flex gap-3 p-3 bg-zinc-900/50 rounded-sm">
                <div className="text-center shrink-0">
                  <span className="text-red-400 font-mono text-xs">{i + 1}</span>
                  <p className="text-[10px] text-zinc-600">{p.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{p.phase}</p>
                  <p className="text-xs text-zinc-400">{p.instructions}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Proficiency Model */}
      {data.proficiency_model?.length > 0 && (
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader>
            <CardTitle className="heading-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Proficiency Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {data.proficiency_model.map((t, i) => (
                <div key={i} className={cn("p-3 rounded-sm border", PHASE_COLORS[i] || "border-zinc-800")}>
                  <p className="text-sm font-medium text-zinc-100">{t.tier}</p>
                  <p className="text-xs text-zinc-400 mt-1">{t.description}</p>
                  <p className="text-xs text-zinc-500 mt-2">Priority: <span className="text-zinc-300">{t.priority}</span></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 12-Month Roadmap */}
      {data.twelve_month_roadmap?.length > 0 && (
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader>
            <CardTitle className="heading-4">12-Month Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.twelve_month_roadmap.map((r, i) => (
              <div key={i} className="flex gap-3 p-3 bg-zinc-900/50 rounded-sm">
                <span className="text-red-400 font-mono text-sm shrink-0">M{r.months}</span>
                <p className="text-sm text-zinc-300">{r.focus}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Logbook Standard */}
      {data.logbook_standard && (
        <div className="p-4 bg-amber-600/5 border border-amber-600/20 rounded-sm">
          <p className="text-xs text-amber-400 font-medium mb-1">Logbook Standard</p>
          <p className="text-sm text-zinc-300">{data.logbook_standard}</p>
        </div>
      )}

      {/* Phases */}
      <div className="space-y-4">
        {data.phases?.map((phase, pi) => {
          const isExpanded = expandedPhase === pi;
          return (
            <Card key={pi} className={cn("border", PHASE_COLORS[pi] || "border-zinc-800 bg-[#18181b]")} data-testid={`phase-${phase.phase}`}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedPhase(isExpanded ? null : pi)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="heading-4 flex items-center gap-2">
                      Phase {phase.phase}: {phase.name}
                      <Badge variant="outline" className="text-xs ml-2">{phase.duration}</Badge>
                    </CardTitle>
                    <p className="text-xs text-zinc-400 mt-1">{phase.subtitle}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0 space-y-4">
                  <p className="text-sm text-zinc-300">{phase.description}</p>
                  
                  {phase.completion_criteria && (
                    <div className="p-3 bg-zinc-900 rounded-sm">
                      <p className="text-xs text-zinc-500">Completion Criteria</p>
                      <p className="text-sm text-zinc-300">{phase.completion_criteria}</p>
                    </div>
                  )}

                  {phase.exercises && (
                    <div className="space-y-2">
                      {phase.exercises.map((ex, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-sm">
                          <Dumbbell className="w-4 h-4 text-zinc-500 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-zinc-200">{ex.name}</p>
                            {ex.notes && <p className="text-xs text-zinc-500">{ex.notes}</p>}
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">{ex.sets}x{ex.reps}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {phase.days && (
                    <Tabs defaultValue={phase.days[0]?.day} className="w-full">
                      <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
                        {phase.days.map((day) => (
                          <TabsTrigger key={day.day} value={day.day} className="text-xs">
                            Day {day.day}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {phase.days.map((day) => (
                        <TabsContent key={day.day} value={day.day} className="mt-4">
                          <p className="text-sm font-medium text-zinc-200 mb-3">{day.name}</p>
                          <div className="space-y-2">
                            {day.exercises.map((ex, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-sm">
                                <Dumbbell className="w-4 h-4 text-zinc-500 shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-zinc-200">{ex.name}</p>
                                  {ex.notes && <p className="text-xs text-zinc-500">{ex.notes}</p>}
                                </div>
                                <Badge variant="outline" className="text-xs shrink-0">{ex.sets}x{ex.reps}</Badge>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}

                  {phase.principles && (
                    <div className="space-y-2 mt-4">
                      {phase.principles.map((p, i) => (
                        <p key={i} className="text-sm text-zinc-400 italic">"{p}"</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
