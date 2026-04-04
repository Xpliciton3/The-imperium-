import React, { useState, useEffect } from "react";
import { 
  Utensils, Clock, DollarSign, ChevronDown, ChevronUp, ShoppingCart, Users, Lightbulb,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function RecipeCard({ recipeKey, recipes, compact }) {
  const [expanded, setExpanded] = useState(false);
  if (!recipeKey || recipeKey === "leftover") {
    return (
      <div className="p-3 bg-zinc-900/30 rounded-sm border border-zinc-800/50">
        <p className="text-sm text-zinc-400 italic">Leftover from last night's dinner</p>
        <p className="text-xs text-zinc-600">$0.00 (batch cook)</p>
      </div>
    );
  }
  const recipe = recipes?.[recipeKey];
  if (!recipe) return <div className="p-3 bg-zinc-900/30 rounded-sm"><p className="text-sm text-zinc-400">{recipeKey}</p></div>;
  
  return (
    <div className={cn("rounded-sm border transition-colors", expanded ? "bg-[#18181b] border-zinc-700" : "bg-zinc-900/30 border-zinc-800/50")}>
      <div className="p-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-200">{recipe.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />{recipe.prep_cook}
              </span>
              <span className="text-xs text-emerald-500 flex items-center gap-1">
                <DollarSign className="w-3 h-3" />{recipe.cost}
              </span>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Users className="w-3 h-3" />Serves {recipe.serves}
              </span>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-zinc-800/50 pt-3">
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">Ingredients</p>
            <ul className="grid md:grid-cols-2 gap-1">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="text-xs text-zinc-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-red-500/50">{ing}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">Method</p>
            <ol className="space-y-1">
              {recipe.method?.map((step, i) => (
                <li key={i} className="text-xs text-zinc-300 pl-5 relative">
                  <span className="absolute left-0 text-red-400 font-mono">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          {recipe.tip && (
            <div className="p-2 bg-amber-600/5 border border-amber-600/20 rounded-sm flex items-start gap-2">
              <Lightbulb className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-300">{recipe.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MealPlan() {
  const [data, setData] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/meals/plan`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-zinc-500">Loading...</div>;

  const meta = data.meta || {};
  const recipes = data.recipes || {};
  const days = data.days || [];
  const weekDays = days.filter(d => d.week === currentWeek);
  const totalWeeks = Math.max(...days.map(d => d.week || 1));

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="meal-plan-page">
      <div>
        <h1 className="heading-2 text-zinc-100">30-Day Meal Plan</h1>
        <p className="body-text mt-1">{meta.cost}</p>
        <p className="text-xs text-zinc-500 mt-1">{meta.philosophy}</p>
      </div>

      <Tabs defaultValue="plan" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="plan">Daily Plan</TabsTrigger>
          <TabsTrigger value="recipes">All Recipes</TabsTrigger>
          <TabsTrigger value="guide">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-4 space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline" size="sm"
              disabled={currentWeek <= 1}
              onClick={() => setCurrentWeek(w => w - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-zinc-200">Week {currentWeek}</span>
            <Button
              variant="outline" size="sm"
              disabled={currentWeek >= totalWeeks}
              onClick={() => setCurrentWeek(w => w + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {weekDays.map(day => (
            <Card key={day.day} className="bg-[#18181b] border-zinc-800" data-testid={`day-${day.day}`}>
              <CardHeader className="pb-3">
                <CardTitle className="heading-4 flex items-center gap-2">
                  Day {day.day}
                  <span className="text-xs text-zinc-500 font-normal">{day.dow}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-amber-400 font-medium mb-1">Breakfast (Noon - Breaking the Fast)</p>
                  <RecipeCard recipeKey={day.breakfast} recipes={recipes} />
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-medium mb-1">Lunch (Early Afternoon)</p>
                  <RecipeCard recipeKey={day.lunch} recipes={recipes} />
                </div>
                <div>
                  <p className="text-xs text-indigo-400 font-medium mb-1">Dinner (Evening)</p>
                  <RecipeCard recipeKey={day.dinner} recipes={recipes} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recipes" className="mt-4 space-y-6">
          {["breakfast", "lunch", "dinner"].map(cat => (
            <div key={cat}>
              <h3 className="heading-4 text-zinc-200 capitalize mb-3">{cat === "breakfast" ? "Breakfasts" : cat === "lunch" ? "Lunches" : "Dinners"}</h3>
              <div className="space-y-2">
                {Object.entries(recipes).filter(([_, r]) => r.category === cat).map(([key, _]) => (
                  <RecipeCard key={key} recipeKey={key} recipes={recipes} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="guide" className="mt-4 space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">Batch Cooking Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-300">{meta.batch_strategy}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Budget Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {meta.budget_tips?.map((tip, i) => (
                  <li key={i} className="text-sm text-zinc-300 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500/50">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                Pantry Staples (Buy Once)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {meta.pantry_staples?.map((item, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
