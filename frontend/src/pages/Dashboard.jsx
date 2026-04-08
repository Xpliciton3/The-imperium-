import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, Calendar, Utensils, Sword, Crown, Moon,
  CheckCircle2, Circle, ArrowRight, Mic, ShoppingCart, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useImperiumApp } from "@/lib/useImperiumApp";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_velnar-learn/artifacts/9g8ehgnc_6221.png";

export default function Dashboard() {
  const { state, content, readinessSummary, markPlannerStep } = useImperiumApp();
  const [warriorProgress] = useLocalStorage("warrior_progress", {});
  const [currentDay] = useLocalStorage("meal_plan_day", 1);
  const [mealPlan, setMealPlan] = useState(null);

  const steps = content.plannerTemplates[state.phase] || [];
  const todayLogs = state.plannerLogs[new Date().toISOString().slice(0, 10)] || [];
  const spineProgress = steps.length ? Math.round((todayLogs.length / steps.length) * 100) : 0;

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/meals/plan/${currentDay}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setMealPlan(data); })
      .catch(() => {});
  }, [currentDay]);

  const quickLinks = [
    { path: "/doctrine", icon: FileText, label: "Doctrine", color: "text-red-500" },
    { path: "/tutor", icon: Mic, label: "Vel'nar Tutor", color: "text-red-400" },
    { path: "/meals", icon: Utensils, label: "Meals & Grocery", color: "text-emerald-500" },
    { path: "/warrior", icon: Sword, label: "Warrior Training", color: "text-blue-500" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8" data-testid="dashboard-page">
      {/* Hero Section */}
      <div className="relative h-64 rounded-sm overflow-hidden bg-[#18181b] border border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="relative h-full flex items-center p-8">
          <img 
            src={LOGO_URL} 
            alt="The Imperium Seal" 
            className="w-40 h-40 object-contain mr-8 hidden md:block"
          />
          <div>
            <p className="overline text-red-400 mb-2">The Sovereign Traditions</p>
            <h1 className="heading-1 text-zinc-100 mb-4">Welcome, Uncrowned</h1>
            <p className="body-text max-w-xl">
              Power from within cannot be revoked. Continue your path through the forge.
            </p>
          </div>
        </div>
      </div>

      {/* Today Spine */}
      <Card className="bg-[#18181b] border-zinc-800" data-testid="today-spine">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="heading-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Today Spine
            </CardTitle>
            <Link to="/planner" className="text-sm text-red-400 hover:text-red-300">Open planner</Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Progress value={spineProgress} className="h-2.5 flex-1" />
            <span className="text-sm text-zinc-400 shrink-0">{todayLogs.length}/{steps.length}</span>
          </div>
          <div className="grid gap-2">
            {steps.map((step, i) => {
              const done = todayLogs.includes(step.id);
              return (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-sm">
                  <button
                    onClick={() => markPlannerStep(step.id)}
                    className="shrink-0"
                    data-testid={`spine-step-${step.id}`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${done ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                      {step.title}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">{step.duration}m</span>
                  {step.link && (
                    <Link to={step.link} className="text-xs text-red-400 hover:text-red-300 shrink-0">Go</Link>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            data-testid={`quick-link-${link.label.toLowerCase().replace(/['\s]/g, '-')}`}
            className="card-imperium flex items-center gap-4 hover:border-zinc-600"
          >
            <div className={`p-3 rounded-sm bg-zinc-900 ${link.color}`}>
              <link.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-zinc-200">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Readiness Engine */}
        <Card className="bg-[#18181b] border-zinc-800" data-testid="readiness-card">
          <CardHeader>
            <CardTitle className="heading-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-red-500" />
              Rite Readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.riteCompletedAt ? (
              <div className="text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-emerald-400 font-medium">Rite Completed</p>
                <p className="text-xs text-zinc-500 mt-1">{new Date(state.riteCompletedAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-3xl font-bold text-zinc-100">{readinessSummary.ratio}%</p>
                  <p className={`text-sm mt-1 ${
                    readinessSummary.verdict === 'Rite-Ready' ? 'text-emerald-400' :
                    readinessSummary.verdict === 'Nearly Ready' ? 'text-amber-400' :
                    readinessSummary.verdict === 'Developing' ? 'text-blue-400' : 'text-zinc-500'
                  }`}>{readinessSummary.verdict}</p>
                </div>
                {readinessSummary.blockedBy.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Still needed:</p>
                    {readinessSummary.blockedBy.slice(0, 3).map((item) => (
                      <p key={item} className="text-xs text-amber-400/70 pl-3">{item}</p>
                    ))}
                  </div>
                )}
              </>
            )}
            <Link to="/rite">
              <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-zinc-100">
                {state.riteCompletedAt ? "View Rite Record" : "Open Rite"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Today's Meals */}
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader>
            <CardTitle className="heading-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-500" />
              Day {currentDay} Meals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mealPlan ? (
              <>
                <div className="p-3 bg-zinc-900/50 rounded-sm">
                  <p className="overline mb-1">Breakfast</p>
                  <p className="text-sm text-zinc-200">
                    {typeof mealPlan.breakfast === 'object' ? mealPlan.breakfast?.name : mealPlan.breakfast}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-sm">
                  <p className="overline mb-1">Lunch</p>
                  <p className="text-sm text-zinc-200">
                    {typeof mealPlan.lunch === 'object' ? mealPlan.lunch?.name : (mealPlan.lunch === 'leftover' ? 'Leftover from dinner' : mealPlan.lunch)}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-sm">
                  <p className="overline mb-1">Dinner</p>
                  <p className="text-sm text-zinc-200">
                    {typeof mealPlan.dinner === 'object' ? mealPlan.dinner?.name : mealPlan.dinner}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-500">Loading meal plan...</p>
            )}
            <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
              <ShoppingCart className="w-3 h-3" />
              Store: {state.storeList.length} items | Online: {state.onlineList.length} items
            </div>
            <Link to="/meals">
              <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-zinc-100">
                View Full Plan & Grocery Lists
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Doctrine Quick Access */}
        <Card className="bg-[#18181b] border-zinc-800" data-testid="doctrine-quick">
          <CardHeader>
            <CardTitle className="heading-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Doctrine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.doctrineLibrary.map((entry) => (
              <div key={entry.id} className="p-3 bg-zinc-900/50 rounded-sm">
                <p className="text-sm font-medium text-zinc-200">{entry.title}</p>
                <p className="text-xs text-zinc-500 mt-1">{entry.quick || entry.emergency}</p>
              </div>
            ))}
            <Link to="/doctrine">
              <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-zinc-100">
                Open Doctrine
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Warrior Practices */}
      <Card className="bg-[#18181b] border-zinc-800">
        <CardHeader>
          <CardTitle className="heading-4 flex items-center gap-2">
            <Sword className="w-5 h-5 text-blue-500" />
            Warrior Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["iaido", "kyudo", "systema", "throwing_daggers"].map((practice) => {
              const progress = warriorProgress[practice] || { stage: 1, progress: 0 };
              const overallProgress = ((progress.stage - 1) / 5) * 100 + (progress.progress / 5);
              return (
                <div key={practice} className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-sm font-medium text-zinc-200 capitalize mb-2">
                    {practice.replace("_", " ")}
                  </p>
                  <Progress value={overallProgress} className="h-2 mb-2" />
                  <p className="text-xs text-zinc-500">Stage {progress.stage} of 5</p>
                </div>
              );
            })}
          </div>
          <Link to="/warrior" className="block mt-4">
            <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-zinc-100">
              View All Practices
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* The Axiom */}
      <div className="p-8 bg-[#18181b] border border-zinc-800 text-center">
        <p className="overline text-red-400 mb-4">The Axiom</p>
        <p className="heading-2 text-zinc-100 italic">
          "Power from within cannot be revoked."
        </p>
        <p className="small-text mt-4">Seen. Sovereign. Structured. Uncrowned.</p>
      </div>
    </div>
  );
}
