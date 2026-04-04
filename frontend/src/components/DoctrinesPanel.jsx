import React, { useState, useEffect } from "react";
import { BookOpen, X, ChevronRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function DoctrinesPanel({ isOpen, onClose }) {
  const [doctrines, setDoctrines] = useState(null);
  const [selectedDoctrine, setSelectedDoctrine] = useState("the_litany");

  useEffect(() => {
    if (isOpen && !doctrines) {
      fetch(`${BACKEND_URL}/api/doctrines`)
        .then(r => r.json())
        .then(data => setDoctrines(data))
        .catch(console.error);
    }
  }, [isOpen, doctrines]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  const doctrineOrder = [
    "the_axiom",
    "the_oath", 
    "the_creed",
    "the_litany",
    "the_covenant",
    "the_manifesto",
    "the_four_word_form"
  ];

  const currentDoctrine = doctrines?.[selectedDoctrine];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-sm w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-red-500" />
            <h2 className="heading-4 text-zinc-100">The Doctrines</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            data-testid="close-doctrines"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-zinc-800 p-2">
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {doctrineOrder.map(key => {
                  const doctrine = doctrines?.[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDoctrine(key)}
                      data-testid={`doctrine-${key}`}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-sm text-sm transition-colors",
                        selectedDoctrine === key
                          ? "bg-red-600/20 text-red-400 border-l-2 border-red-500"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                      )}
                    >
                      {doctrine?.name || key.replace("the_", "").replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-auto">
            {currentDoctrine ? (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <p className="overline text-red-400 mb-2">{currentDoctrine.name}</p>
                  {currentDoctrine.when_spoken && (
                    <p className="text-xs text-zinc-500 mb-4">
                      When spoken: {currentDoctrine.when_spoken}
                    </p>
                  )}
                </div>

                {/* Main Text */}
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                  <p className="text-lg text-zinc-100 italic leading-relaxed">
                    "{currentDoctrine.text}"
                  </p>
                  {currentDoctrine.vel_nar && (
                    <p className="text-sm font-mono text-red-400 mt-4">
                      Vel'nar: {currentDoctrine.vel_nar}
                    </p>
                  )}
                  <button
                    onClick={() => speakText(currentDoctrine.text)}
                    className="mt-4 flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300"
                    data-testid="speak-doctrine"
                  >
                    <Volume2 className="w-3 h-3" />
                    Hear it spoken
                  </button>
                </div>

                {/* Explanation */}
                {currentDoctrine.explanation && (
                  <div>
                    <p className="overline text-zinc-500 mb-2">Understanding</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {currentDoctrine.explanation}
                    </p>
                  </div>
                )}

                {/* Line by line (for Litany) */}
                {currentDoctrine.line_by_line && (
                  <div>
                    <p className="overline text-amber-500 mb-3">Line by Line</p>
                    <div className="space-y-4">
                      {currentDoctrine.line_by_line.map((item, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/30 border-l-2 border-amber-500/50">
                          <p className="text-sm text-zinc-200 italic mb-2">"{item.line}"</p>
                          <p className="text-xs text-zinc-400">{item.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-zinc-500">Loading doctrines...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            "Power from within cannot be revoked."
          </p>
        </div>
      </div>
    </div>
  );
}
