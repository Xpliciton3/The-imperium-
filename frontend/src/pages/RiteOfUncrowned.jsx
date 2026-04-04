import React, { useState, useEffect } from "react";
import { 
  Crown, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  ExternalLink,
  Clock,
  AlertTriangle,
  BookOpen,
  History,
  Scroll,
  Volume2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_velnar-learn/artifacts/9g8ehgnc_6221.png";

export default function RiteOfUncrowned() {
  const [riteData, setRiteData] = useState(null);
  const [permanentRecord, setPermanentRecord] = useState(null);
  const [riteProgress, setRiteProgress] = useLocalStorage("rite_progress", {
    currentStage: 1,
    completedStages: [],
    startedAt: null
  });
  const [inscription, setInscription] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showInscriptionDialog, setShowInscriptionDialog] = useState(false);

  useEffect(() => {
    // Load rite data and permanent record
    Promise.all([
      fetch(`${BACKEND_URL}/api/rite`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/rite/record`).then(r => r.json())
    ])
      .then(([rite, record]) => {
        setRiteData(rite);
        setPermanentRecord(record);
      })
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
      // Show inscription dialog before final completion
      setShowInscriptionDialog(true);
    } else {
      setRiteProgress({
        ...riteProgress,
        currentStage: stageNum + 1,
        completedStages: newCompleted
      });
    }
  };

  const finalizeRite = async () => {
    // Save to permanent record in database
    try {
      const response = await fetch(`${BACKEND_URL}/api/rite/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed_at: new Date().toISOString(),
          stages_completed: [1, 2, 3, 4, 5, 6],
          inscription: inscription,
          notes: `Started: ${riteProgress.startedAt}`
        })
      });
      
      const record = await response.json();
      setPermanentRecord(record);
    } catch (error) {
      console.error('Failed to save rite record:', error);
    }

    setRiteProgress({
      ...riteProgress,
      completedStages: [...riteProgress.completedStages, 6],
      completedAt: new Date().toISOString()
    });
    setShowInscriptionDialog(false);
    setInscription("");
  };

  const resetForNewRite = () => {
    setRiteProgress({
      currentStage: 1,
      completedStages: [],
      startedAt: null
    });
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const isStageCompleted = (stageNum) => riteProgress.completedStages?.includes(stageNum);
  const isCurrentStage = (stageNum) => riteProgress.currentStage === stageNum;
  const riteInProgress = riteProgress.startedAt && !riteProgress.completedStages?.includes(6);
  const riteCompleted = riteProgress.completedStages?.includes(6);
  const hasEverCompleted = permanentRecord?.total_completions > 0;
  const progress = (riteProgress.completedStages?.length || 0) / 6 * 100;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Hero */}
      <div className="relative h-64 rounded-sm overflow-hidden bg-[#18181b] border border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative h-full flex items-center p-8">
          <img 
            src={LOGO_URL} 
            alt="The Imperium Seal" 
            className="w-36 h-36 object-contain mr-8 hidden md:block"
          />
          <div>
            <p className="overline text-red-400 mb-2">The Central Initiation</p>
            <h1 className="heading-1 text-zinc-100">Rite of the Uncrowned</h1>
            <p className="body-text mt-4 max-w-xl">
              The rite performed at entry and repeated at significant thresholds. 
              Cross deliberately. Do not look back.
            </p>
          </div>
        </div>
      </div>

      {/* Permanent Record & Status */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Completion Status */}
        {riteCompleted ? (
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <div>
                  <p className="heading-4 text-emerald-400">Rite Completed</p>
                  <p className="text-sm text-zinc-400">You have crossed the threshold.</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href={riteData?.challenge_coin_url || "https://www.challengecoins4less.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="challenge-coin-link"
                >
                  <Button className="btn-primary">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Order Challenge Coin
                  </Button>
                </a>
                <Button variant="outline" onClick={resetForNewRite}>
                  Repeat Rite
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : riteInProgress ? (
          <Card className="bg-[#18181b] border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="heading-4 text-zinc-200">Rite in Progress</p>
                  <p className="text-sm text-zinc-500">Stage {riteProgress.currentStage} of 6</p>
                </div>
                <Badge variant="outline" className="text-amber-500">{Math.round(progress)}%</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#18181b] border-zinc-800">
            <CardContent className="p-6 text-center">
              <img src={LOGO_URL} alt="The Imperium" className="w-16 h-16 mx-auto mb-4" />
              <p className="heading-4 text-zinc-200 mb-2">The Forge Awaits</p>
              <p className="text-sm text-zinc-500 mb-4">
                {hasEverCompleted 
                  ? "You have walked this path before. Return to the forge."
                  : "Begin your first initiation into The Uncrowned."}
              </p>
              <Button onClick={startRite} className="btn-primary" data-testid="start-rite-btn">
                {hasEverCompleted ? "Begin Again" : "Begin the Rite"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Permanent Record */}
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="heading-4 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-500" />
              Permanent Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            {permanentRecord?.total_completions > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-900/50 rounded-sm text-center">
                    <p className="text-2xl font-bold text-red-400">{permanentRecord.total_completions}</p>
                    <p className="text-xs text-zinc-500">Total Completions</p>
                  </div>
                  <div className="p-3 bg-zinc-900/50 rounded-sm text-center">
                    <p className="text-sm text-zinc-300">
                      {new Date(permanentRecord.first_completed).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-zinc-500">First Completed</p>
                  </div>
                </div>
                <Dialog open={showHistory} onOpenChange={setShowHistory}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full text-zinc-400">
                      View Full History
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#18181b] border-zinc-800 max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="heading-4">Rite Completion History</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[400px]">
                      <div className="space-y-3 pr-4">
                        {permanentRecord.completions?.map((comp, idx) => (
                          <div key={idx} className="p-4 bg-zinc-900/50 rounded-sm">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">Completion #{idx + 1}</Badge>
                              <span className="text-xs text-zinc-500">
                                {new Date(comp.completed_at).toLocaleDateString()}
                              </span>
                            </div>
                            {comp.inscription && (
                              <div className="mt-2 p-3 bg-zinc-800/50 rounded-sm">
                                <p className="text-xs text-zinc-500 mb-1">Inscription:</p>
                                <p className="text-sm text-zinc-300 italic">"{comp.inscription}"</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-zinc-500">No completions yet.</p>
                <p className="text-xs text-zinc-600 mt-1">Complete the Rite to create your permanent record.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Stages */}
        <div className="lg:col-span-2 space-y-4">
          {/* Important Notice for Beginners */}
          {!riteInProgress && !riteCompleted && (
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardHeader>
                <CardTitle className="heading-4 flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  Before You Begin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-300">
                  The Rite of the Uncrowned is not a casual exercise. It is a threshold crossing. 
                  Read all instructions carefully before beginning. If you have never done this before, 
                  take your time. The Rite typically takes 45-90 minutes.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm font-medium text-zinc-200 mb-2">Required Preparation</p>
                    <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-sm mb-3">
                      <p className="text-sm font-bold text-red-400">24-HOUR FAST REQUIRED</p>
                      <p className="text-xs text-zinc-300 mt-1">
                        {riteData?.preparation?.fasting_detail || "Twenty-four hours of fasting (water only). This is non-negotiable. The fast creates the physiological and psychological state necessary for the rite to land with its full weight."}
                      </p>
                    </div>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      <li>Perform at {riteData?.preparation?.timing || "dawn or midnight"}</li>
                      <li>Ensure complete solitude (or one trusted witness)</li>
                      <li>Have all materials ready before starting</li>
                      <li>Duration: {riteData?.preparation?.duration || "Three to four hours minimum"}</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm font-medium text-zinc-200 mb-2">Materials Needed</p>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      {riteData?.preparation?.materials?.map((mat, idx) => (
                        <li key={idx}>{mat}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/50 rounded-sm">
                    <p className="text-sm font-medium text-zinc-200 mb-2">Aromatics</p>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      {riteData?.preparation?.aromatics?.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  {riteData?.preparation?.aromatic_sourcing && (
                    <div className="p-4 bg-amber-600/5 border border-amber-600/20 rounded-sm">
                      <p className="text-sm font-medium text-amber-400 mb-1">Sourcing</p>
                      <p className="text-xs text-zinc-300">{riteData.preparation.aromatic_sourcing}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* The Six Stages */}
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">The Six Stages</CardTitle>
              <p className="text-sm text-zinc-500">Each stage must be completed in order. Do not skip.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {riteData?.stages?.map((stage, idx) => (
                  <div
                    key={stage.stage}
                    className={cn(
                      "relative pl-8 pb-8 border-l-2",
                      isStageCompleted(stage.stage) ? "border-l-red-600"
                        : isCurrentStage(stage.stage) ? "border-l-red-500"
                        : "border-l-zinc-800",
                      idx === riteData.stages.length - 1 && "pb-0 border-l-transparent"
                    )}
                  >
                    {/* Marker */}
                    <div className={cn(
                      "absolute left-[-9px] w-4 h-4 rounded-full",
                      isStageCompleted(stage.stage) ? "bg-red-600"
                        : isCurrentStage(stage.stage) ? "bg-red-600 ring-4 ring-red-600/30"
                        : "bg-zinc-800"
                    )} />

                    {/* Content */}
                    <div className={cn(
                      "p-4 rounded-sm ml-4 transition-all",
                      isCurrentStage(stage.stage) ? "bg-red-600/10 border border-red-600/30"
                        : isStageCompleted(stage.stage) ? "bg-emerald-500/5 border border-emerald-500/20"
                        : "bg-zinc-900/30 border border-zinc-800"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-500">Stage {stage.stage}</span>
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

                      {/* Detailed Instructions - always visible */}
                      <div className="mt-4 space-y-2">
                        <p className="overline text-zinc-500 text-xs">Detailed Instructions</p>
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

                      {/* Complete Button */}
                      {isCurrentStage(stage.stage) && riteInProgress && (
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
                <Scroll className="w-5 h-5 text-amber-500" />
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
                      <div className="flex items-center justify-between mb-2">
                        <p className="overline text-red-400 capitalize">{key.replace("_", " ")}</p>
                        <button
                          onClick={() => speakText(text)}
                          className="text-zinc-500 hover:text-zinc-300"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-zinc-300 italic leading-relaxed">"{text}"</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Challenge Coin */}
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-red-500" />
                The Challenge Coin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                The Challenge Coin is earned through the Rite, carried for life.
              </p>
              <div className="p-4 bg-zinc-900/50 rounded-sm">
                <p className="text-xs text-zinc-500 mb-2">Design</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>• Front: The Uncrowned Seal</li>
                  <li>• Back: "Power from within cannot be revoked"</li>
                  <li>• Material: Dark bronze</li>
                </ul>
              </div>
              {hasEverCompleted && (
                <a
                  href={riteData?.challenge_coin_url || "https://www.challengecoins4less.com"}
                  target="_blank"
                  rel="noopener noreferrer"
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

      {/* Inscription Dialog */}
      <Dialog open={showInscriptionDialog} onOpenChange={setShowInscriptionDialog}>
        <DialogContent className="bg-[#18181b] border-zinc-800">
          <DialogHeader>
            <DialogTitle className="heading-4 text-zinc-100">Stage 5: Inscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-zinc-400">
              Write a single sentence: who you have become. This will be permanently recorded.
            </p>
            <Textarea
              value={inscription}
              onChange={(e) => setInscription(e.target.value)}
              placeholder="I am..."
              className="bg-zinc-900 border-zinc-700 min-h-[100px]"
              data-testid="inscription-input"
            />
            <p className="text-xs text-zinc-500">
              Sign it with your name. Date it. The rite is complete.
            </p>
            <Button 
              onClick={finalizeRite} 
              className="w-full btn-primary"
              data-testid="finalize-rite-btn"
            >
              Complete the Rite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
