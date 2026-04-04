import React, { useState, useEffect } from "react";
import { Search, BookOpen, Sword, Languages, Brain, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CATEGORY_MAP = {
  beebe_model: { label: "Beebe Model", icon: Brain, color: "text-purple-400" },
  japanese_martial: { label: "Japanese Martial Arts", icon: Sword, color: "text-red-400" },
  vel_nar_terms: { label: "Vel'nar Language", icon: Languages, color: "text-amber-400" },
  philosophical: { label: "Philosophical", icon: BookOpen, color: "text-blue-400" },
  meditation: { label: "Meditation", icon: Volume2, color: "text-emerald-400" },
};

export default function GlossaryPage() {
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/glossary`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const categories = Object.keys(data);
  const defaultTab = categories[0] || "beebe_model";

  const filterTerms = (terms) => {
    if (!search) return terms;
    const q = search.toLowerCase();
    return terms.filter(t => 
      t.term.toLowerCase().includes(q) || 
      t.definition.toLowerCase().includes(q)
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="glossary-page">
      <div>
        <h1 className="heading-2 text-zinc-100">Glossary</h1>
        <p className="body-text mt-2">Every term used in The Imperium, with pronunciation and definition.</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
          data-testid="glossary-search"
        />
      </div>

      {categories.length > 0 && (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
            {categories.map(cat => {
              const meta = CATEGORY_MAP[cat] || { label: cat, icon: BookOpen, color: "text-zinc-400" };
              const Icon = meta.icon;
              return (
                <TabsTrigger key={cat} value={cat} className="text-xs flex items-center gap-1">
                  <Icon className={`w-3 h-3 ${meta.color}`} />
                  {meta.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {categories.map(cat => {
            const terms = filterTerms(data[cat] || []);
            const meta = CATEGORY_MAP[cat] || { label: cat, color: "text-zinc-400" };
            return (
              <TabsContent key={cat} value={cat} className="mt-4">
                <div className="space-y-2">
                  {terms.length === 0 && (
                    <p className="text-sm text-zinc-500">No matching terms.</p>
                  )}
                  {terms.map((t, i) => (
                    <Card key={i} className="bg-[#18181b] border-zinc-800">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm font-medium ${meta.color}`}>{t.term}</p>
                            <Badge variant="outline" className="text-xs font-mono">{t.pronunciation}</Badge>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{t.definition}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
