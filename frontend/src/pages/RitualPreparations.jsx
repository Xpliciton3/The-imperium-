import React, { useState, useEffect } from "react";
import { 
  Flame, Droplet, Wind, ChevronDown, ChevronUp, ExternalLink, MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function RitualPreparations() {
  const [data, setData] = useState(null);
  const [expandedBlend, setExpandedBlend] = useState(0);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/ritual-preparations`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-zinc-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="ritual-preparations-page">
      <div>
        <h1 className="heading-2 text-zinc-100">Ritual Preparations</h1>
        <p className="body-text mt-2">Teas, oils, and burning substances. Nothing here is decorative. Every substance has a function.</p>
      </div>

      {/* Principle */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-4">
          <p className="text-sm text-zinc-300 italic">{data.principle}</p>
        </CardContent>
      </Card>

      {/* Blends */}
      <div>
        <h2 className="heading-3 text-zinc-200 mb-4">Sacred Blends</h2>
        <div className="space-y-4">
          {data.blends?.map((blend, bi) => {
            const isExpanded = expandedBlend === bi;
            return (
              <Card key={bi} className="bg-[#18181b] border-zinc-800" data-testid={`blend-${bi}`}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedBlend(isExpanded ? null : bi)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-sm bg-amber-500/10 border border-amber-500/30">
                        <Flame className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <CardTitle className="heading-4">{blend.name}</CardTitle>
                        <p className="text-xs text-zinc-500">{blend.timing}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {blend.does_not_break_fast && (
                        <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/30">Fasting Safe</Badge>
                      )}
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-sm text-zinc-300">{blend.purpose}</p>
                    
                    <div className="space-y-4">
                      {blend.ingredients.map((ing, i) => (
                        <div key={i} className="p-4 bg-zinc-900/50 rounded-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-200">{ing.name}</p>
                            <Badge variant="outline" className="text-xs">{ing.amount}</Badge>
                          </div>
                          <p className="text-xs text-zinc-400">{ing.function}</p>
                          <div className="p-3 bg-amber-600/5 border border-amber-600/20 rounded-sm">
                            <p className="text-xs text-amber-400 font-medium flex items-center gap-1 mb-1">
                              <MapPin className="w-3 h-3" /> Where to Source
                            </p>
                            <p className="text-xs text-zinc-300">{ing.sourcing}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-zinc-900 rounded-sm">
                      <p className="text-xs text-zinc-500 mb-1">Preparation</p>
                      <p className="text-sm text-zinc-300">{blend.preparation}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Essential Oils */}
      <div>
        <h2 className="heading-3 text-zinc-200 mb-4">Essential Oils</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.oils?.map((oil, i) => (
            <Card key={i} className="bg-[#18181b] border-zinc-800">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-violet-400" />
                  <p className="text-sm font-medium text-zinc-200">{oil.name}</p>
                </div>
                <p className="text-xs text-zinc-400">{oil.use}</p>
                <div className="p-2 bg-amber-600/5 border border-amber-600/20 rounded-sm">
                  <p className="text-xs text-zinc-300">{oil.sourcing}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Burning Substances */}
      <div>
        <h2 className="heading-3 text-zinc-200 mb-4">Burning Substances</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.burning_substances?.map((sub, i) => (
            <Card key={i} className="bg-[#18181b] border-zinc-800">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-orange-400" />
                  <p className="text-sm font-medium text-zinc-200">{sub.name}</p>
                </div>
                <p className="text-xs text-zinc-400">{sub.use}</p>
                <div className="p-2 bg-amber-600/5 border border-amber-600/20 rounded-sm">
                  <p className="text-xs text-zinc-300">{sub.sourcing}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
