import React from "react";
import { useImperiumApp } from "../lib/useImperiumApp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, AlertCircle, Clock, ScrollText } from "lucide-react";

export default function DoctrinePage() {
  const { content, state, setRecentDoctrine, toggleBookmark } = useImperiumApp();

  const litany = content.doctrineLibrary.find((d) => d.id === "litany");

  return (
    <div className="p-6 space-y-6" data-testid="doctrine-page">
      <div>
        <h2 className="text-2xl sm:text-3xl font-light text-zinc-100 tracking-tight">Doctrine</h2>
        <p className="text-sm text-zinc-500 mt-1">Quick access to the core texts. Emergency litany. Bookmarks. Recent.</p>
      </div>

      {/* Emergency Litany */}
      {litany?.emergency && (
        <Card className="bg-red-950/20 border-red-800/40">
          <CardHeader className="pb-2">
            <CardTitle className="heading-4 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              Emergency Litany
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-200 whitespace-pre-line leading-relaxed" data-testid="emergency-litany">{litany.emergency}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Access Bookmarks */}
      <div className="flex flex-wrap gap-2">
        {state.doctrineBookmarks.map((id) => {
          const doc = content.doctrineLibrary.find((d) => d.id === id);
          if (!doc) return null;
          return (
            <Badge key={id} variant="outline" className="text-xs text-amber-300 border-amber-700/50 bg-amber-900/10">
              <BookmarkCheck className="w-3 h-3 mr-1" />
              {doc.title}
            </Badge>
          );
        })}
        {state.recentDoctrine.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Clock className="w-3 h-3" />
            Recent: {state.recentDoctrine.slice(0, 3).map((id) => {
              const doc = content.doctrineLibrary.find((d) => d.id === id);
              return doc?.title || id;
            }).join(", ")}
          </span>
        )}
      </div>

      {/* Doctrine Cards */}
      {content.doctrineLibrary.map((entry) => {
        const isBookmarked = state.doctrineBookmarks.includes(entry.id);
        return (
          <Card key={entry.id} className="bg-[#18181b] border-zinc-800" data-testid={`doctrine-${entry.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="heading-4 flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-red-500" />
                  {entry.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(entry.id)}
                  className={isBookmarked ? "text-amber-400" : "text-zinc-500"}
                  data-testid={`bookmark-${entry.id}`}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-zinc-400 mt-1">{entry.quick || entry.emergency}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Full Text</p>
                  <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">{entry.full}</p>
                </div>
                <div className="p-4 bg-zinc-900/50 rounded-sm">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Explanation</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{entry.explanation}</p>
                  {entry.related?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {entry.related.map((r) => (
                        <Badge key={r} variant="outline" className="text-[10px]">{r}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecentDoctrine(entry.id)}
                data-testid={`mark-recent-${entry.id}`}
              >
                Mark as recently opened
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
