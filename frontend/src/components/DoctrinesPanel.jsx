import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DOCTRINE_ORDER = ["the_oath", "the_creed", "the_litany", "the_covenant", "the_manifesto", "the_axiom"];
const DOCTRINE_LABELS = {
  the_oath: "The Oath",
  the_creed: "The Creed",
  the_litany: "The Litany",
  the_covenant: "The Covenant",
  the_manifesto: "The Manifesto",
  the_axiom: "The Axiom",
};

export default function DoctrinesPanel({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState({});
  const [selectedDoctrine, setSelectedDoctrine] = useState(null);
  const [expandedData, setExpandedData] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetch(`${BACKEND_URL}/api/doctrines/expanded`)
        .then(r => r.json())
        .then(setExpandedData)
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const doctrine = selectedDoctrine ? expandedData[selectedDoctrine] : null;

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.7;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose} data-testid="doctrines-panel">
      <div
        className="w-full max-w-lg bg-[#0a0a0b] border-l border-zinc-800 h-full overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-200">
            {selectedDoctrine ? DOCTRINE_LABELS[selectedDoctrine] : "The Six Doctrines"}
          </h2>
          <div className="flex items-center gap-2">
            {selectedDoctrine && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedDoctrine(null)} className="text-xs text-zinc-400">
                Back
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4 text-zinc-400" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {!selectedDoctrine ? (
              /* Doctrine List */
              DOCTRINE_ORDER.map(key => {
                const doc = expandedData[key];
                if (!doc) return null;
                return (
                  <Card
                    key={key}
                    className="bg-[#18181b] border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                    onClick={() => setSelectedDoctrine(key)}
                    data-testid={`doctrine-${key}`}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-zinc-100">{doc.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{doc.subtitle}</p>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{doc.short_form}</p>
                      {doc.vel_nar_form && (
                        <p className="text-xs text-red-400 font-mono mt-2">{doc.vel_nar_form}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : doctrine ? (
              /* Full Doctrine View */
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-medium text-zinc-100">{doctrine.name}</h3>
                  <p className="text-xs text-zinc-500">{doctrine.subtitle}</p>
                </div>

                {/* Full Text */}
                <div className="p-4 bg-zinc-900/50 rounded-sm border-l-2 border-red-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-zinc-500 font-medium">Full Text</p>
                    <Button variant="ghost" size="sm" className="h-6" onClick={() => speak(doctrine.full_text)}>
                      <Volume2 className="w-3 h-3 mr-1 text-zinc-500" />
                      <span className="text-xs text-zinc-500">Speak</span>
                    </Button>
                  </div>
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{doctrine.full_text}</p>
                </div>

                {/* Short Form */}
                <div className="p-3 bg-zinc-900/30 rounded-sm">
                  <p className="text-xs text-zinc-500 mb-1">Short Form</p>
                  <p className="text-sm text-zinc-300 italic">{doctrine.short_form}</p>
                </div>

                {/* Vel'nar Form */}
                {doctrine.vel_nar_form && (
                  <div className="p-4 bg-red-600/5 border border-red-600/20 rounded-sm space-y-2">
                    <p className="text-xs text-zinc-500">Vel'nar Form</p>
                    <p className="font-mono text-red-400 text-lg">{doctrine.vel_nar_form}</p>
                    <p className="text-xs text-zinc-500">Pronunciation</p>
                    <p className="text-sm text-zinc-300 font-mono">{doctrine.vel_nar_pronunciation}</p>
                    <p className="text-xs text-zinc-500">Meaning</p>
                    <p className="text-sm text-zinc-300">{doctrine.vel_nar_meaning}</p>
                    {doctrine.vel_nar_guide && (
                      <>
                        <p className="text-xs text-zinc-500">Speaking Guide</p>
                        <p className="text-xs text-zinc-400">{doctrine.vel_nar_guide}</p>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 mt-1" onClick={() => speak(doctrine.vel_nar_form)}>
                      <Volume2 className="w-3 h-3 mr-1 text-red-400" />
                      <span className="text-xs text-red-400">Hear Vel'nar</span>
                    </Button>
                  </div>
                )}

                {/* When to Use */}
                {doctrine.when_to_use && (
                  <div className="p-3 bg-amber-600/5 border border-amber-600/20 rounded-sm">
                    <p className="text-xs text-amber-400 font-medium mb-1">When to Use</p>
                    <p className="text-xs text-zinc-300">{doctrine.when_to_use}</p>
                  </div>
                )}

                {/* Explanation */}
                {doctrine.explanation && (
                  <div className="p-3 bg-zinc-900/30 rounded-sm">
                    <p className="text-xs text-zinc-500 mb-1">Understanding</p>
                    <p className="text-xs text-zinc-400">{doctrine.explanation}</p>
                  </div>
                )}

                {/* Line-by-Line for the Litany */}
                {doctrine.line_by_line && (
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 font-medium">Line by Line</p>
                    {doctrine.line_by_line.map((l, i) => (
                      <div key={i} className="p-3 bg-zinc-900/50 rounded-sm">
                        <p className="text-sm text-zinc-200 italic">"{l.line}"</p>
                        <p className="text-xs text-zinc-400 mt-1">{l.meaning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extended form for Axiom */}
                {doctrine.extended_form && (
                  <div className="p-3 bg-zinc-900/30 rounded-sm">
                    <p className="text-xs text-zinc-500 mb-1">Extended Form</p>
                    <p className="text-sm text-zinc-300">{doctrine.extended_form}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Loading...</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
