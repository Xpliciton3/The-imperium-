import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  Utensils, 
  Sword, 
  Crown, 
  Moon,
  CheckCircle2,
  Circle,
  ArrowRight,
  Mic
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_velnar-learn/artifacts/9g8ehgnc_6221.png";

export default function Dashboard() {
  const [dailyPractices] = useLocalStorage("daily_practices", {
    morning: [],
    evening: [],
    date: null
  });
  const [warriorProgress] = useLocalStorage("warrior_progress", {});
  const [riteCompleted] = useLocalStorage("rite_completed", false);
  const [currentDay] = useLocalStorage("meal_plan_day", 1);
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/meals/plan/${currentDay}`)
      .then(res => res.json())
      .then(data => setMealPlan(data))
      .catch(console.error);
  }, [currentDay]);

  const morningComplete = dailyPractices.morning?.length >= 4;
  const eveningComplete = dailyPractices.evening?.length >= 4;
  const todayDate = new Date().toDateString();
  const isPracticeToday = dailyPractices.date === todayDate;

  const quickLinks = [
    { path: "/velnar", icon: Mic, label: "Practice Vel'nar", color: "text-red-500" },
    { path: "/planner", icon: Calendar, label: "Daily Practice", color: "text-amber-500" },
    { path: "/meals", icon: Utensils, label: "Today's Meals", color: "text-emerald-500" },
    { path: "/warrior", icon: Sword, label: "Warrior Training", color: "text-blue-500" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
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
        {/* Daily Practices Status */}
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader>
            <CardTitle className="heading-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Today's Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-sm">
              <div className="flex items-center gap-3">
                {isPracticeToday && morningComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600" />
                )}
                <span className="text-sm">Morning Sovereignty</span>
              </div>
              <span className="text-xs text-zinc-500">
                {isPracticeToday ? dailyPractices.morning?.length || 0 : 0}/4
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-sm">
              <div className="flex items-center gap-3">
                {isPracticeToday && eveningComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600" />
                )}
                <span className="text-sm">Evening Inventory</span>
              </div>
              <span className="text-xs text-zinc-500">
                {isPracticeToday ? dailyPractices.evening?.length || 0 : 0}/4
              </span>
            </div>
            <Link to="/planner">
              <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-zinc-100">
                Go to Planner
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
                  <p className="text-sm text-zinc-200">{mealPlan.breakfast}</p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-sm">
                  <p className="overline mb-1">Lunch</p>
                  <p className="text-sm text-zinc-200">{mealPlan.lunch}</p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-sm">
                  <p className="overline mb-1">Dinner</p>
                  <p className="text-sm text-zinc-200">{mealPlan.dinner}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-500">Loading meal plan...</p>
            )}
            <Link to="/meals">
              <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-zinc-100">
                View Full Plan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Rite Status */}
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader>
            <CardTitle className="heading-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-red-500" />
              Rite of the Uncrowned
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riteCompleted ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm text-emerald-400 font-medium">Rite Completed</p>
                <p className="text-xs text-zinc-500 mt-1">You have crossed the threshold</p>
                <a 
                  href="https://www.challengecoins4less.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="challenge-coin-link"
                  className="mt-4 inline-block"
                >
                  <Button className="btn-primary">
                    Order Challenge Coin
                  </Button>
                </a>
              </div>
            ) : (
              <div className="text-center py-4">
                <img src={LOGO_URL} alt="The Imperium" className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">The forge awaits</p>
                <p className="text-xs text-zinc-600 mt-1">Begin your initiation</p>
                <Link to="/rite" className="mt-4 inline-block">
                  <Button className="btn-primary" data-testid="begin-rite-btn">
                    Begin the Rite
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warrior Practices Overview */}
      <Card className="bg-[#18181b] border-zinc-800">
        <CardHeader>
          <CardTitle className="heading-4 flex items-center gap-2">
            <Sword className="w-5 h-5 text-blue-500" />
            Warrior Practices Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["iaido", "kyudo", "systema", "throwing_daggers"].map((practice) => {
              const progress = warriorProgress[practice] || { stage: 1, progress: 0 };
              const stages = practice === "throwing_daggers" ? 4 : 5;
              const overallProgress = ((progress.stage - 1) / stages) * 100 + (progress.progress / stages);
              
              return (
                <div key={practice} className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-sm font-medium text-zinc-200 capitalize mb-2">
                    {practice.replace("_", " ")}
                  </p>
                  <Progress value={overallProgress} className="h-2 mb-2" />
                  <p className="text-xs text-zinc-500">
                    Stage {progress.stage} of {stages}
                  </p>
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
        <p className="small-text mt-4">
          Seen. Sovereign. Structured. Uncrowned.
        </p>
      </div>
    </div>
  );
}
