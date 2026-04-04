import React, { useState, useEffect } from "react";
import { 
  Sword, 
  Target, 
  Wind, 
  Crosshair,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const practiceIcons = {
  iaido: Sword,
  kyudo: Target,
  systema: Wind,
  throwing_daggers: Crosshair
};

export default function WarriorPractices() {
  const [practices, setPractices] = useState(null);
  const [warriorProgress, setWarriorProgress] = useLocalStorage("warrior_progress", {
    iaido: { stage: 1, progress: 0, completedRequirements: [] },
    kyudo: { stage: 1, progress: 0, completedRequirements: [] },
    systema: { stage: 1, progress: 0, completedRequirements: [], passedTests: [] },
    throwing_daggers: { stage: 1, progress: 0, completedRequirements: [] }
  });
  const [selectedPractice, setSelectedPractice] = useState("iaido");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/warrior/practices`)
      .then(r => r.json())
      .then(data => setPractices(data))
      .catch(console.error);
  }, []);

  const currentPractice = practices?.[selectedPractice];
  const currentProgress = warriorProgress[selectedPractice] || { stage: 1, progress: 0, completedRequirements: [] };
  const currentStage = currentPractice?.stages?.find(s => s.stage === currentProgress.stage);
  const totalStages = currentPractice?.stages?.length || 5;

  const toggleRequirement = (requirement) => {
    setWarriorProgress(prev => {
      const practice = prev[selectedPractice] || { stage: 1, progress: 0, completedRequirements: [] };
      const completed = practice.completedRequirements || [];
      const isCompleted = completed.includes(requirement);
      
      const newCompleted = isCompleted
        ? completed.filter(r => r !== requirement)
        : [...completed, requirement];
      
      // Calculate progress
      const totalReqs = currentStage?.requirements?.length || 1;
      const newProgress = (newCompleted.length / totalReqs) * 100;

      return {
        ...prev,
        [selectedPractice]: {
          ...practice,
          completedRequirements: newCompleted,
          progress: newProgress
        }
      };
    });
  };

  const advanceStage = () => {
    if (currentProgress.progress < 100) return;
    if (currentProgress.stage >= totalStages) return;

    setWarriorProgress(prev => ({
      ...prev,
      [selectedPractice]: {
        stage: prev[selectedPractice].stage + 1,
        progress: 0,
        completedRequirements: [],
        passedTests: prev[selectedPractice].passedTests || []
      }
    }));
  };

  const toggleTest = (testNum) => {
    setWarriorProgress(prev => {
      const practice = prev.systema || { stage: 1, progress: 0, completedRequirements: [], passedTests: [] };
      const passed = practice.passedTests || [];
      const isPassed = passed.includes(testNum);

      return {
        ...prev,
        systema: {
          ...practice,
          passedTests: isPassed
            ? passed.filter(t => t !== testNum)
            : [...passed, testNum]
        }
      };
    });
  };

  const isRequirementComplete = (req) => {
    return (currentProgress.completedRequirements || []).includes(req);
  };

  const isTestPassed = (testNum) => {
    return (warriorProgress.systema?.passedTests || []).includes(testNum);
  };

  const overallProgress = ((currentProgress.stage - 1) / totalStages) * 100 + (currentProgress.progress / totalStages);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div 
        className="relative h-48 rounded-sm overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1746960854615-d99ee8e55b96?w=1200)` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-center p-8">
          <p className="overline text-red-400 mb-2">The Warrior's Practice</p>
          <h1 className="heading-2 text-zinc-100">Martial Disciplines</h1>
          <p className="body-text mt-2 max-w-xl">
            Develop a disciplined mind and capable body through contemplative martial practice.
          </p>
        </div>
      </div>

      {/* Practice Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {practices && Object.entries(practices).map(([key, practice]) => {
          const Icon = practiceIcons[key];
          const progress = warriorProgress[key] || { stage: 1, progress: 0 };
          const stages = practice.stages?.length || 5;
          const overall = ((progress.stage - 1) / stages) * 100 + (progress.progress / stages);

          return (
            <button
              key={key}
              onClick={() => setSelectedPractice(key)}
              data-testid={`practice-${key}`}
              className={cn(
                "p-4 rounded-sm border transition-all duration-200 text-left",
                selectedPractice === key
                  ? "bg-red-600/10 border-red-600/50"
                  : "bg-[#18181b] border-zinc-800 hover:border-zinc-600"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "p-2 rounded-sm",
                  selectedPractice === key ? "bg-red-600/20 text-red-500" : "bg-zinc-900 text-zinc-400"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-zinc-200 capitalize">
                  {key.replace("_", " ")}
                </span>
              </div>
              <Progress value={overall} className="h-1" />
              <p className="text-xs text-zinc-500 mt-2">
                Stage {progress.stage} of {stages}
              </p>
            </button>
          );
        })}
      </div>

      {/* Current Practice Details */}
      {currentPractice && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="heading-3 text-zinc-100 capitalize">
                    {selectedPractice.replace("_", " ")}
                  </CardTitle>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                    Stage {currentProgress.stage}
                  </Badge>
                </div>
                <p className="body-text">{currentPractice.description}</p>
              </CardHeader>
              <CardContent>
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="small-text">Overall Progress</p>
                    <p className="text-sm text-zinc-300">{Math.round(overallProgress)}%</p>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                {/* Stage Progress */}
                <div className="flex items-center gap-2 mb-6">
                  {currentPractice.stages?.map((stage, idx) => (
                    <React.Fragment key={stage.stage}>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all",
                          stage.stage < currentProgress.stage
                            ? "bg-red-600 border-red-600 text-white"
                            : stage.stage === currentProgress.stage
                            ? "border-red-500 text-red-500"
                            : "border-zinc-700 text-zinc-500"
                        )}
                      >
                        {stage.stage < currentProgress.stage ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          stage.stage
                        )}
                      </div>
                      {idx < currentPractice.stages.length - 1 && (
                        <div className={cn(
                          "flex-1 h-0.5",
                          stage.stage < currentProgress.stage ? "bg-red-600" : "bg-zinc-700"
                        )} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Current Stage Details */}
                {currentStage && (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/50 rounded-sm">
                      <p className="text-lg font-medium text-zinc-200 mb-1">{currentStage.name}</p>
                      <p className="text-sm text-zinc-400">{currentStage.focus}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs text-zinc-500">{currentStage.duration}</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <p className="overline text-amber-500 mb-3">Requirements to Complete</p>
                      <div className="space-y-2">
                        {currentStage.requirements?.map((req, idx) => (
                          <button
                            key={idx}
                            onClick={() => toggleRequirement(req)}
                            data-testid={`requirement-${idx}`}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-sm text-left transition-all duration-200",
                              isRequirementComplete(req)
                                ? "bg-emerald-500/10 border border-emerald-500/30"
                                : "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700"
                            )}
                          >
                            {isRequirementComplete(req) ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                            )}
                            <span className="text-sm text-zinc-300">{req}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advance Button */}
                    {currentProgress.progress >= 100 && currentProgress.stage < totalStages && (
                      <Button
                        onClick={advanceStage}
                        data-testid="advance-stage-btn"
                        className="w-full btn-primary"
                      >
                        Advance to Stage {currentProgress.stage + 1}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Systema Tests */}
            {selectedPractice === "systema" && currentPractice.tests && (
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <CardTitle className="heading-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Advancement Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentPractice.tests.map((test) => (
                    <button
                      key={test.test}
                      onClick={() => toggleTest(test.test)}
                      data-testid={`systema-test-${test.test}`}
                      className={cn(
                        "w-full flex items-start gap-4 p-4 rounded-sm text-left transition-all duration-200",
                        isTestPassed(test.test)
                          ? "bg-emerald-500/10 border border-emerald-500/30"
                          : "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      {isTestPassed(test.test) ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          Test {test.test}: {test.name}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{test.description}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Equipment */}
            {currentPractice.equipment && (
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <CardTitle className="heading-4">Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentPractice.equipment.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                        <span className="text-red-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-zinc-600 mt-4">
                    Equipment is earned through progression, not purchased prematurely.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Kyudo Hassetsu */}
            {selectedPractice === "kyudo" && currentPractice.hassetsu && (
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <CardTitle className="heading-4">The Hassetsu</CardTitle>
                  <p className="text-xs text-zinc-500">Eight stages of drawing and shooting</p>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {currentPractice.hassetsu.map((stage, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <span className="text-zinc-300">{stage}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* All Stages */}
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4">All Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {currentPractice.stages?.map((stage) => (
                      <div
                        key={stage.stage}
                        className={cn(
                          "p-3 rounded-sm border",
                          stage.stage === currentProgress.stage
                            ? "bg-red-600/10 border-red-600/30"
                            : stage.stage < currentProgress.stage
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-zinc-900/30 border-zinc-800"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-zinc-500">Stage {stage.stage}</span>
                          {stage.stage < currentProgress.stage && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-sm text-zinc-200">{stage.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">{stage.duration}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
