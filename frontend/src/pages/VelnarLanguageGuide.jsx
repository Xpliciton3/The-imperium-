import React, { useState, useEffect } from "react";
import { Languages, Volume2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HOUSE_COLORS = {
  Sovereignty: "border-red-500/30 bg-red-500/5 text-red-400",
  Witness: "border-blue-500/30 bg-blue-500/5 text-blue-400",
  Endurance: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  Threshold: "border-purple-500/30 bg-purple-500/5 text-purple-400",
  Sanctum: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  Rupture: "border-zinc-500/30 bg-zinc-500/5 text-zinc-400",
};

export default function VelnarLanguageGuide() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/velnar/language-guide`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.6;
      window.speechSynthesis.speak(u);
    }
  };

  if (!data) return <div className="p-8 text-zinc-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="velnar-guide-page">
      <div>
        <h1 className="heading-2 text-zinc-100">Vel'nar Language Guide</h1>
        <p className="body-text mt-2">{data.what_velnar_is}</p>
      </div>

      <Tabs defaultValue="roots" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="roots" className="text-xs">Root Houses</TabsTrigger>
          <TabsTrigger value="sound" className="text-xs">Sound</TabsTrigger>
          <TabsTrigger value="formation" className="text-xs">Formation</TabsTrigger>
          <TabsTrigger value="phrases" className="text-xs">Phrases</TabsTrigger>
          <TabsTrigger value="shadow" className="text-xs">Shadow Lexicon</TabsTrigger>
          <TabsTrigger value="rite" className="text-xs">Rite Phrases</TabsTrigger>
          <TabsTrigger value="stages" className="text-xs">Stage Path</TabsTrigger>
          <TabsTrigger value="script" className="text-xs">Script System</TabsTrigger>
        </TabsList>

        <TabsContent value="roots" className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.root_houses?.map((house, i) => (
              <Card key={i} className={cn("border", HOUSE_COLORS[house.house] || "border-zinc-800")}>
                <CardContent className="p-4">
                  <p className={cn("text-sm font-medium", HOUSE_COLORS[house.house]?.split(" ").pop())}>{house.house}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{house.purpose}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {house.roots.map((r, j) => (
                      <Badge key={j} variant="outline" className="font-mono text-xs cursor-pointer hover:bg-zinc-800" onClick={() => speak(r)}>
                        {r}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">Core Canon Roots</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.core_roots?.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-zinc-900/50 rounded-sm">
                  <Button variant="ghost" size="sm" className="h-6 px-2 shrink-0" onClick={() => speak(r.root)}>
                    <span className="font-mono text-red-400 text-sm font-bold">{r.root}</span>
                  </Button>
                  <p className="text-xs text-zinc-300">{r.meaning}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sound" className="mt-4 space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardContent className="p-4">
              <p className="text-sm text-zinc-300">{data.sound?.principle}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">Vowels</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.sound?.vowels?.map((v, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-sm">
                  <span className="font-mono text-red-400 text-lg font-bold w-8 text-center">{v.letter}</span>
                  <div>
                    <Badge variant="outline" className="text-xs font-mono">{v.sound}</Badge>
                    <p className="text-xs text-zinc-400 mt-1">{v.rule}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Consonant Character</p>
                <p className="text-sm text-zinc-300">{data.sound?.consonant_character}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Stress and Pace</p>
                <p className="text-sm text-zinc-300">{data.sound?.stress_and_pace}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formation" className="mt-4 space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">Derivational Markers</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.derivational_markers?.map((m, i) => (
                <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-red-400">{m.marker}</Badge>
                    <p className="text-xs text-zinc-400">{m.function}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 italic">{m.example}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">Word Order</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-zinc-300 mb-3">Default: {data.word_order?.default}</p>
              {data.word_order?.patterns?.map((p, i) => (
                <div key={i} className="p-3 bg-zinc-900/50 rounded-sm flex items-start gap-3">
                  <Badge variant="outline" className="text-xs shrink-0">{p.type}</Badge>
                  <div>
                    <p className="text-xs text-zinc-400">{p.order}</p>
                    <p className="text-xs text-red-400 font-mono mt-1">{p.example}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Breath Rules</p>
                <p className="text-sm text-zinc-300">{data.breath_rules}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Laws</p>
                <ul className="space-y-1">
                  {data.laws?.map((l, i) => (
                    <li key={i} className="text-xs text-zinc-400 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-red-500/50">{l}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phrases" className="mt-4 space-y-4">
          {Object.entries(data.heart_phrases || {}).map(([cat, phrases]) => (
            <Card key={cat} className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4 capitalize">{cat.replace(/_/g, " ")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {phrases.map((p, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 rounded-sm flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-6 shrink-0" onClick={() => speak(p.velnar)}>
                      <Volume2 className="w-3 h-3 mr-1 text-zinc-500" />
                      <span className="font-mono text-red-400">{p.velnar}</span>
                    </Button>
                    <p className="text-xs text-zinc-300">{p.meaning}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="shadow" className="mt-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">The Shadow Lexicon</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.shadow_lexicon?.map((s, i) => (
                <div key={i} className="p-3 bg-zinc-900/50 rounded-sm flex items-start gap-3">
                  <Badge variant="outline" className="font-mono text-xs shrink-0">{s.root}</Badge>
                  <p className="text-xs text-zinc-300">{s.meaning}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rite" className="mt-4 space-y-4">
          {Object.entries(data.rite_phrases || {}).map(([cat, phrases]) => (
            <Card key={cat} className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4 capitalize">{cat}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {phrases.map((p, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                    <Button variant="ghost" size="sm" className="h-auto p-1 mb-1" onClick={() => speak(p.velnar)}>
                      <Volume2 className="w-3 h-3 mr-1 text-zinc-500" />
                      <span className="font-mono text-red-400 text-sm">{p.velnar}</span>
                    </Button>
                    <p className="text-xs text-zinc-400">{p.meaning}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="stages" className="mt-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">Stage Path of Study</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.stage_path?.map((s, i) => (
                <div key={i} className="p-4 bg-zinc-900/50 rounded-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">Stage {s.stage}</Badge>
                    <p className="text-sm font-medium text-zinc-200">{s.focus}</p>
                  </div>
                  <p className="text-xs text-zinc-400">{s.standard}</p>
                </div>
              ))}
              <p className="text-xs text-zinc-500 italic mt-4">Advancement is not performance. A learner advances when the language becomes cleaner, truer, and more restrained.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="script" className="mt-4 space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">Three Script Modes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.script_system?.modes?.map((m, i) => (
                <div key={i} className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-sm font-medium text-zinc-200">{m.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">{m.behavior}</p>
                  <p className="text-xs text-zinc-500 mt-1">Use: {m.use}</p>
                  <p className="text-xs text-red-400/70 mt-1">Restriction: {m.restriction}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader><CardTitle className="heading-4">Inscription Rules</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.script_system?.inscription_rules?.map((r, i) => (
                  <li key={i} className="text-xs text-zinc-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-red-500/50">{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
