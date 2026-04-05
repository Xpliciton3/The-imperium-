import React, { useState, useEffect } from "react";
import { 
  Apple, Clock, Droplets, Pill, ChevronDown, ChevronUp, Utensils, ShoppingCart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function RecipeCard({ recipe }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <div className="p-4 cursor-pointer flex items-center justify-between" onClick={() => setOpen(!open)} data-testid={`recipe-${recipe.name?.toLowerCase().replace(/\s+/g, "-")}`}>
        <div>
          <p className="text-sm font-medium text-zinc-100">{recipe.name}</p>
          <p className="text-xs text-zinc-500">{recipe.meal}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </div>
      {open && (
        <CardContent className="pt-0 space-y-4">
          <div>
            <p className="text-xs text-amber-400 font-medium mb-2 flex items-center gap-1"><ShoppingCart className="w-3 h-3" /> Ingredients</p>
            <div className="space-y-1">
              {recipe.ingredients?.map((ing, i) => (
                <div key={i} className="flex items-start gap-2 p-1">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2 shrink-0" />
                  <p className="text-xs text-zinc-300">{ing}</p>
                </div>
              ))}
            </div>
          </div>
          {recipe.sourcing && (
            <div className="p-3 bg-zinc-900/50 rounded-sm">
              <p className="text-xs text-zinc-500 mb-1">Where to Find</p>
              <p className="text-xs text-zinc-400">{recipe.sourcing}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-emerald-400 font-medium mb-2">Instructions</p>
            <ol className="space-y-2">
              {recipe.instructions?.map((step, i) => (
                <li key={i} className="text-xs text-zinc-300 pl-5 relative">
                  <span className="absolute left-0 text-red-400 font-mono">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function NutritionalArchitecture() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/nutritional-architecture`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-zinc-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="nutrition-page">
      <div>
        <h1 className="heading-2 text-zinc-100">Nutritional Architecture</h1>
        <p className="body-text mt-2">{data.philosophy}</p>
      </div>

      {/* Core Principles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.core_principles?.map((p, i) => (
          <Card key={i} className="bg-[#18181b] border-zinc-800">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-zinc-100">{p.name}</p>
              <p className="text-xs text-red-400 font-mono mt-1">{p.rule}</p>
              <p className="text-xs text-zinc-400 mt-2">{p.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="foods" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="foods" className="flex items-center gap-2">
            <Apple className="w-4 h-4" />
            Foods
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="supplements" className="flex items-center gap-2">
            <Pill className="w-4 h-4" />
            Supplements
          </TabsTrigger>
          <TabsTrigger value="sample" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Sample Day
          </TabsTrigger>
          <TabsTrigger value="hydration" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Hydration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="foods" className="mt-4 space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 text-emerald-400">Foods That Support the System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {data.foods_to_support?.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-zinc-900/50 rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-zinc-300">{f}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 text-red-400">Foods to Minimize</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.foods_to_minimize?.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-red-600/5 rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-zinc-300">{f}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes" className="mt-4 space-y-4">
          {data.recipes?.map((recipe, i) => (
            <RecipeCard key={i} recipe={recipe} />
          ))}
          {data.weekly_prep_protocol && (
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4 text-amber-400">Weekly Prep Protocol</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300">{data.weekly_prep_protocol}</p>
              </CardContent>
            </Card>
          )}
          {data.progress_markers?.length > 0 && (
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4 text-emerald-400">Progress Markers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.progress_markers.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-zinc-900/50 rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-zinc-300">{m}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="supplements" className="mt-4 space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">Core Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.supplement_stack?.core?.map((s, i) => (
                <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-200">{s.name}</p>
                    <Badge variant="outline" className="text-xs">{s.dose}</Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{s.purpose}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">Conditional Additions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.supplement_stack?.conditional?.map((s, i) => (
                <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-200">{s.name}</p>
                    <Badge variant="outline" className="text-xs">{s.dose}</Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{s.condition}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sample" className="mt-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">{data.sample_day?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.sample_day?.meals?.map((meal, i) => (
                <div key={i} className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-500" />
                    {meal.time}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {meal.items.map((item, j) => (
                      <li key={j} className="text-xs text-zinc-400 pl-6">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hydration" className="mt-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                Hydration Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-600/5 border border-blue-600/20 rounded-sm">
                <p className="text-sm font-medium text-blue-400">Formula</p>
                <p className="text-sm text-zinc-300 mt-1">{data.hydration?.formula}</p>
              </div>
              <p className="text-xs text-zinc-400">{data.hydration?.note}</p>
              <div>
                <p className="text-sm font-medium text-zinc-200 mb-2">The Four Daily Beverages</p>
                {data.hydration?.daily_beverages?.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-zinc-900/50 rounded-sm mb-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <p className="text-xs text-zinc-300">{b}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
