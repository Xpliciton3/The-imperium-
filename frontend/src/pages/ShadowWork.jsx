import React, { useState, useEffect } from "react";
import { 
  Eye, EyeOff, Brain, Shield, Heart, ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CHAPTER_ICONS = {
  inferior: Eye,
  opposing: Brain,
  senex: Shield,
  trickster: Heart,
  daemon: EyeOff,
};

const CHAPTER_COLORS = {
  inferior: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  opposing: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  senex: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  trickster: "text-pink-500 bg-pink-500/10 border-pink-500/30",
  daemon: "text-red-500 bg-red-500/10 border-red-500/30",
};

export default function ShadowWork() {
  const [chapters, setChapters] = useState([]);
  const [moralArch, setMoralArch] = useState(null);
  const [cogFunctions, setCogFunctions] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [expandedValue, setExpandedValue] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND_URL}/api/shadow`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/moral-architecture`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/cognitive-functions`).then(r => r.json()),
    ]).then(([shadow, moral, cog]) => {
      setChapters(shadow.chapters || []);
      setMoralArch(moral);
      setCogFunctions(cog.functions || []);
    }).catch(console.error);
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8" data-testid="shadow-work-page">
      <div>
        <h1 className="heading-2 text-zinc-100">The Shadow</h1>
        <p className="body-text mt-2">Five chapters on the territory that costs you most. Know the shadow to stop being surprised by it.</p>
      </div>

      {/* Cognitive Functions in Vel'nar */}
      <div>
        <h2 className="heading-3 text-zinc-200 mb-4">The Eight Functions in Vel'nar</h2>
        <p className="text-sm text-zinc-400 mb-4">The actual processes through which the Uncrowned takes in information and makes decisions, named in the tradition's language.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {cogFunctions.map((fn) => (
            <Card key={fn.vel_nar} className="bg-[#18181b] border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-4">
                <p className="font-mono text-red-400 text-sm font-bold">{fn.vel_nar}</p>
                <p className="text-xs text-zinc-500 font-mono">{fn.pronunciation}</p>
                <p className="text-xs text-zinc-300 mt-2 font-medium">{fn.meaning}</p>
                <Badge variant="outline" className="mt-2 text-xs">{fn.role}</Badge>
                <p className="text-xs text-zinc-500 mt-2">{fn.function}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Shadow Chapters */}
      <div>
        <h2 className="heading-3 text-zinc-200 mb-4">The Five Shadow Functions</h2>
        <div className="space-y-4">
          {chapters.map((ch) => {
            const Icon = CHAPTER_ICONS[ch.id] || Eye;
            const colors = CHAPTER_COLORS[ch.id] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/30";
            const isExpanded = expandedChapter === ch.id;
            
            return (
              <Card key={ch.id} className="bg-[#18181b] border-zinc-800" data-testid={`shadow-${ch.id}`}>
                <CardHeader 
                  className="cursor-pointer" 
                  onClick={() => setExpandedChapter(isExpanded ? null : ch.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-sm border", colors)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="heading-4 flex items-center gap-2">
                          {ch.number}. {ch.title}
                          <span className="font-mono text-red-400 text-xs ml-2">{ch.vel_nar}</span>
                        </CardTitle>
                        <p className="text-xs text-zinc-500">{ch.subtitle}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="space-y-6 pt-0">
                    <p className="text-sm text-zinc-300">{ch.description}</p>
                    
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 mb-2">Normal Manifestation</h4>
                      <ul className="space-y-1">
                        {ch.normal_manifestation.map((item, i) => (
                          <li key={i} className="text-xs text-zinc-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-zinc-600">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-red-600/5 border border-red-600/20 rounded-sm">
                      <h4 className="text-sm font-medium text-red-400 mb-2">The Grip State</h4>
                      <ul className="space-y-1">
                        {ch.grip_state.map((item, i) => (
                          <li key={i} className="text-xs text-zinc-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-red-600/50">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-emerald-600/5 border border-emerald-600/20 rounded-sm">
                      <h4 className="text-sm font-medium text-emerald-400 mb-2">Integration</h4>
                      <p className="text-xs text-zinc-300">{ch.integration}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {ch.integration_practices.map((p, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900 rounded-sm">
                      <h4 className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Shadow Audit Questions
                      </h4>
                      <ul className="space-y-3">
                        {ch.audit_questions.map((q, i) => (
                          <li key={i} className="text-sm text-zinc-300 italic">"{q}"</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Moral Architecture */}
      {moralArch && (
        <div>
          <h2 className="heading-3 text-zinc-200 mb-2">{moralArch.title}</h2>
          <p className="text-sm text-zinc-400 mb-4">{moralArch.subtitle}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {moralArch.values.map((val, i) => {
              const isExpanded = expandedValue === i;
              return (
                <Card 
                  key={i} 
                  className="bg-[#18181b] border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                  onClick={() => setExpandedValue(isExpanded ? null : i)}
                  data-testid={`value-${val.name.toLowerCase()}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-zinc-100">{val.name}</p>
                        <p className="text-xs text-zinc-500">{val.function}</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </div>
                    <p className="text-xs text-red-400 font-medium">{val.principle}</p>
                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        <div className="p-2 bg-red-600/5 border border-red-600/20 rounded-sm">
                          <p className="text-xs text-zinc-500">Corrupted Form</p>
                          <p className="text-xs text-zinc-300">{val.corrupted_form}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Test Questions</p>
                          {val.test_questions.map((q, j) => (
                            <p key={j} className="text-xs text-zinc-400 italic mb-1">"{q}"</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
