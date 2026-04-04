import React, { useState, useEffect } from "react";
import { 
  Crown, 
  Flame, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  ExternalLink,
  Clock,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function RiteOfUncrowned() {
  const [riteData, setRiteData] = useState(null);
  const [riteCompleted, setRiteCompleted] = useLocalStorage("rite_completed", false);
  const [riteProgress, setRiteProgress] = useLocalStorage("rite_progress", {
    currentStage: 1,
    completedStages: [],
    startedAt: null
  });
  const [showCanon, setShowCanon] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/rite`)
      .then(r => r.json())
      .then(data => setRiteData(data))
      .catch(console.error);
  }, []);

  const startRite = () => {
    setRiteProgress({
      currentStage: 1,
      completedStages: [],
      startedAt: new Date().toISOString()
    });
  };

  const completeStage = (stageNum) => {
    if (stageNum !== riteProgress.currentStage) return;

    const newCompleted = [...riteProgress.completedStages, stageNum];
    
    if (stageNum === 6) {
      // Rite complete!
      setRiteCompleted(true);
      setRiteProgress({
        ...riteProgress,
        completedStages: newCompleted,
        completedAt: new Date().toISOString()
      });
    } else {
      setRiteProgress({
        ...riteProgress,
        currentStage: stageNum + 1,
        completedStages: newCompleted
      });
    }
  };

  const resetRite = () => {
    setRiteProgress({
      currentStage: 1,
      completedStages: [],
      startedAt: null
    });
    setRiteCompleted(false);
  };

  const isStageCompleted = (stageNum) => riteProgress.completedStages?.includes(stageNum);
  const isCurrentStage = (stageNum) => riteProgress.currentStage === stageNum;
  const progress = (riteProgress.completedStages?.length || 0) / 6 * 100;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Hero */}
      <div 
        className="relative h-64 rounded-sm overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1667403332341-061cc1cb0add?w=1200)` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        <div className="relative h-full flex flex-col justify-center p-8">
          <p className="overline text-red-400 mb-2">The Central Initiation</p>
          <h1 className="heading-1 text-zinc-100">Rite of the Uncrowned</h1>
          <p className="body-text mt-4 max-w-xl">
            The rite performed at entry and repeated at significant thresholds. 
            Cross deliberately. Do not look back.
          </p>
        </div>
      </div>

      {/* Completion Status */}
      {riteCompleted ? (
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-sm bg-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="heading-4 text-emerald-400">Rite Completed</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    You have crossed the threshold. You are Uncrowned.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={riteData?.challenge_coin_url || "https://www.challengecoins4less.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="challenge-coin-link"
                >
                  <Button className="btn-primary flex items-center gap-2">
                    Order Challenge Coin
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={resetRite}>
                  Repeat Rite
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : riteProgress.startedAt ? (
        <Card className="bg-[#18181b] border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="heading-4 text-zinc-200">Rite in Progress</p>
                <p className="text-sm text-zinc-500 mt-1">
                  Stage {riteProgress.currentStage} of 6
                </p>
              </div>
              <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#18181b] border-zinc-800">
          <CardContent className="p-6 text-center">
            <Flame className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <p className="heading-4 text-zinc-200 mb-2">The Forge Awaits</p>
            <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
              Before beginning, ensure you have completed the preparation requirements.
            </p>
            <Button 
              onClick={startRite}
              data-testid="start-rite-btn"
              className="btn-primary"
            >
              Begin the Rite
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stages */}
        <div className="lg:col-span-2 space-y-4">
          {/* Preparation */}
          {!riteCompleted && !riteProgress.startedAt && (
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Preparation Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm font-medium text-zinc-200 mb-2">Fasting</p>
                    <p className="text-xs text-zinc-500">{riteData?.preparation?.fasting}</p>
                  </div>
                  <div className="p-4 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm font-medium text-zinc-200 mb-2">Timing</p>
                    <p className="text-xs text-zinc-500">{riteData?.preparation?.timing}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-sm font-medium text-zinc-200 mb-2">Required Materials</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {riteData?.preparation?.materials?.map((mat, idx) => (
                      <Badge key={idx} variant="outline" className="text-zinc-400 border-zinc-700">
                        {mat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-sm font-medium text-zinc-200 mb-2">Aromatics (Optional)</p>
                  <ul className="space-y-1">
                    {riteData?.preparation?.aromatics?.map((aroma, idx) => (
                      <li key={idx} className="text-xs text-zinc-500 flex items-center gap-2">
                        <span className="text-red-500">•</span>
                        {aroma}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rite Stages */}
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">The Six Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {riteData?.stages?.map((stage, idx) => (
                  <div
                    key={stage.stage}
                    className={cn(
                      "relative pl-8 pb-8 border-l-2",
                      isStageCompleted(stage.stage)
                        ? "border-l-red-600"
                        : isCurrentStage(stage.stage)
                        ? "border-l-red-500"
                        : "border-l-zinc-800",
                      idx === riteData.stages.length - 1 && "pb-0 border-l-transparent"
                    )}
                  >
                    {/* Marker */}
                    <div
                      className={cn(
                        "absolute left-[-9px] w-4 h-4 rounded-full",
                        isStageCompleted(stage.stage)
                          ? "bg-red-600"
                          : isCurrentStage(stage.stage)
                          ? "bg-red-600 ring-4 ring-red-600/30"
                          : "bg-zinc-800"
                      )}
                    />

                    {/* Content */}
                    <div className={cn(
                      "p-4 rounded-sm ml-4 transition-all",
                      isCurrentStage(stage.stage)
                        ? "bg-red-600/10 border border-red-600/30"
                        : isStageCompleted(stage.stage)
                        ? "bg-emerald-500/5 border border-emerald-500/20"
                        : "bg-zinc-900/30 border border-zinc-800"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-500">
                            Stage {stage.stage}
                          </span>
                          {isStageCompleted(stage.stage) && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-600">
                          <Clock className="w-3 h-3" />
                          {stage.duration}
                        </div>
                      </div>
                      
                      <p className="text-lg font-medium text-zinc-200 mb-1">{stage.name}</p>
                      <p className="text-sm text-zinc-400 mb-3">{stage.description}</p>

                      {/* Instructions - show for current stage */}
                      {(isCurrentStage(stage.stage) || isStageCompleted(stage.stage)) && (
                        <div className="mt-4 space-y-2">
                          <p className="overline text-zinc-500 text-xs">Instructions</p>
                          <ol className="space-y-2">
                            {stage.instructions?.map((inst, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs mt-0.5">
                                  {i + 1}
                                </span>
                                {inst}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Complete Button */}
                      {isCurrentStage(stage.stage) && riteProgress.startedAt && !riteCompleted && (
                        <Button
                          onClick={() => completeStage(stage.stage)}
                          data-testid={`complete-rite-stage-${stage.stage}`}
                          className="w-full mt-4 btn-primary"
                        >
                          Complete Stage {stage.stage}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Canon */}
        <div className="space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                The Canon
              </CardTitle>
              <p className="text-xs text-zinc-500">
                Memorize these for Stage 3: Declaration
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {riteData?.canon_pieces && Object.entries(riteData.canon_pieces).map(([key, text]) => (
                    <div key={key} className="p-4 bg-zinc-900/50 rounded-sm">
                      <p className="overline text-red-400 mb-2 capitalize">{key.replace("_", " ")}</p>
                      <p className="text-sm text-zinc-300 italic leading-relaxed">"{text}"</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Challenge Coin Info */}
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-red-500" />
                The Challenge Coin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                The Uncrowned Challenge Coin belongs to the entire system, earned through the Rite, carried for life.
              </p>
              <div className="p-4 bg-zinc-900/50 rounded-sm">
                <p className="text-xs text-zinc-500 mb-2">Design</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>• Front: The Uncrowned Seal</li>
                  <li>• Back: "Power from within cannot be revoked"</li>
                  <li>• Material: Dark bronze</li>
                </ul>
              </div>
              {riteCompleted && (
                <a
                  href={riteData?.challenge_coin_url || "https://www.challengecoins4less.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="sidebar-coin-link"
                >
                  <Button className="w-full btn-primary">
                    Order Your Coin
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
