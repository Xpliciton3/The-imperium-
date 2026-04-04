import React, { useState, useEffect } from "react";
import { 
  Utensils, 
  Clock, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  ShoppingCart,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState([]);
  const [recipes, setRecipes] = useState({});
  const [currentDay, setCurrentDay] = useLocalStorage("meal_plan_day", 1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [completedMeals, setCompletedMeals] = useLocalStorage("completed_meals", {});

  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND_URL}/api/meals/plan`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/meals/recipes`).then(r => r.json())
    ])
      .then(([planData, recipeData]) => {
        setMealPlan(planData.days || []);
        setRecipes(recipeData.recipes || {});
      })
      .catch(console.error);
  }, []);

  const currentMeals = mealPlan.find(d => d.day === currentDay) || {};

  const toggleMealComplete = (day, meal) => {
    const key = `${day}-${meal}`;
    setCompletedMeals(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isMealComplete = (day, meal) => {
    return completedMeals[`${day}-${meal}`];
  };

  const goToDay = (day) => {
    if (day >= 1 && day <= 30) {
      setCurrentDay(day);
    }
  };

  const getWeekNumber = (day) => Math.ceil(day / 7);

  const ingredientSources = {
    "Standard grocery": ["Costco", "Walmart", "Kroger", "Safeway"],
    "Fish market": ["Local fish market", "Whole Foods seafood counter"],
    "Bulk items": ["Costco", "Sam's Club", "Restaurant Depot"],
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-zinc-100">30-Day Meal Plan</h1>
          <p className="body-text mt-2">Anti-inflammatory, protein-prioritized nutrition</p>
        </div>
        <Badge variant="outline" className="text-amber-500 border-amber-500/50">
          Week {getWeekNumber(currentDay)}
        </Badge>
      </div>

      {/* Day Navigation */}
      <Card className="bg-[#18181b] border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => goToDay(currentDay - 1)}
              disabled={currentDay <= 1}
              data-testid="prev-day-btn"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">Day {currentDay}</p>
              <p className="text-xs text-zinc-500">of 30</p>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => goToDay(currentDay + 1)}
              disabled={currentDay >= 30}
              data-testid="next-day-btn"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Day Dots */}
          <div className="flex justify-center gap-1 mt-4 flex-wrap">
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => goToDay(day)}
                data-testid={`calendar-date-${day}`}
                className={cn(
                  "w-6 h-6 rounded-sm text-xs transition-all duration-200",
                  day === currentDay
                    ? "bg-red-600 text-white"
                    : day < currentDay
                    ? "bg-zinc-700 text-zinc-400"
                    : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      <div className="grid md:grid-cols-3 gap-4">
        {["breakfast", "lunch", "dinner"].map((meal) => {
          const mealName = currentMeals[meal];
          const recipe = recipes[mealName];
          const isComplete = isMealComplete(currentDay, meal);

          return (
            <Card 
              key={meal} 
              className={cn(
                "bg-[#18181b] border-zinc-800 transition-all duration-200",
                isComplete && "border-emerald-500/30 bg-emerald-500/5"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="overline text-zinc-500 capitalize">{meal}</CardTitle>
                  <button
                    onClick={() => toggleMealComplete(currentDay, meal)}
                    className={cn(
                      "p-1 rounded-sm transition-colors",
                      isComplete ? "text-emerald-500" : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-zinc-200 mb-4">{mealName || "—"}</p>
                
                {recipe && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => setSelectedRecipe({ name: mealName, ...recipe })}
                      >
                        View Recipe
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#18181b] border-zinc-800 max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="heading-4 text-zinc-100">
                          {selectedRecipe?.name}
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh]">
                        <div className="space-y-6 pr-4">
                          {/* Meta */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <Clock className="w-4 h-4" />
                              <span>Prep: {selectedRecipe?.prep_time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <Clock className="w-4 h-4" />
                              <span>Cook: {selectedRecipe?.cook_time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <Users className="w-4 h-4" />
                              <span>{selectedRecipe?.servings} servings</span>
                            </div>
                          </div>

                          {/* Ingredients */}
                          <div>
                            <p className="overline text-amber-500 mb-3">Ingredients</p>
                            <ul className="space-y-2">
                              {selectedRecipe?.ingredients?.map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                                  <span className="text-red-500 mt-1">•</span>
                                  {ing}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Instructions */}
                          <div>
                            <p className="overline text-amber-500 mb-3">Instructions</p>
                            <ol className="space-y-3">
                              {selectedRecipe?.instructions?.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-xs">
                                    {idx + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Where to get ingredients */}
                          <div className="p-4 bg-zinc-900/50 rounded-sm">
                            <p className="overline text-zinc-500 mb-2">Where to Get Ingredients</p>
                            <p className="text-sm text-zinc-400">
                              All ingredients available at standard grocery stores: Walmart, Kroger, Safeway, Costco, or your local supermarket.
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Overview */}
      <Card className="bg-[#18181b] border-zinc-800">
        <CardHeader>
          <CardTitle className="heading-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-500" />
            Week {getWeekNumber(currentDay)} Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table-grid w-full text-sm">
              <thead>
                <tr className="text-zinc-400">
                  <th className="font-medium">Day</th>
                  <th className="font-medium">Breakfast</th>
                  <th className="font-medium">Lunch</th>
                  <th className="font-medium">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {mealPlan
                  .filter(d => getWeekNumber(d.day) === getWeekNumber(currentDay))
                  .map(day => (
                    <tr 
                      key={day.day}
                      className={cn(
                        "transition-colors",
                        day.day === currentDay && "bg-red-600/10"
                      )}
                    >
                      <td className="font-medium text-zinc-200">
                        Day {day.day}
                      </td>
                      <td className="text-zinc-400">{day.breakfast}</td>
                      <td className="text-zinc-400">{day.lunch}</td>
                      <td className="text-zinc-400">{day.dinner}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Nutritional Principles */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-6">
          <p className="overline text-red-400 mb-4">The Imperium Nutritional Architecture</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900/50 rounded-sm">
              <p className="text-sm font-medium text-zinc-200 mb-2">Anti-Inflammatory</p>
              <p className="text-xs text-zinc-500">Whole foods, healthy fats, minimal processed ingredients</p>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-sm">
              <p className="text-sm font-medium text-zinc-200 mb-2">Protein-Prioritized</p>
              <p className="text-xs text-zinc-500">Lean meats, fish, legumes, eggs for satiety and strength</p>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-sm">
              <p className="text-sm font-medium text-zinc-200 mb-2">16:8 Fasting Window</p>
              <p className="text-xs text-zinc-500">Breakfast at noon, all meals within 8 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
