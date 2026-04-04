import React, { useState, useCallback } from "react";
import { ArrowRightLeft, Copy, Check, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MBTI_TYPES = [
  { value: "INTJ", label: "INTJ", alias: "The Uncrowned", description: "Direct, strategic, minimal. Values efficiency." },
  { value: "ESFJ", label: "ESFJ", alias: "The Unspent", description: "Warm, harmonious, conscientious. Values connection." },
  { value: "INTP", label: "INTP", alias: "The Theorist", description: "Analytical, precise, abstract." },
  { value: "ENFP", label: "ENFP", alias: "The Catalyst", description: "Enthusiastic, expressive, possibility-driven." },
  { value: "INFJ", label: "INFJ", alias: "The Counselor", description: "Empathic, insightful, purposeful." },
  { value: "ESTP", label: "ESTP", alias: "The Operative", description: "Action-first, direct, pragmatic." },
  { value: "ENFJ", label: "ENFJ", alias: "The Mentor", description: "Warm, persuasive, orchestrating." },
  { value: "ISTP", label: "ISTP", alias: "The Craftsman", description: "Efficient, logical, independent." },
];

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fromType, setFromType] = useState("INTJ");
  const [toType, setToType] = useState("ESFJ");
  const [direction, setDirection] = useState("outgoing");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null);

  const translate = useCallback(async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setOutputText("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/translator/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          from_type: direction === "outgoing" ? fromType : toType,
          to_type: direction === "outgoing" ? toType : fromType,
          direction,
          session_id: sessionId,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Translation failed");
      }

      const data = await res.json();
      setOutputText(data.translated);
      setSessionId(data.session_id);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [inputText, fromType, toType, direction, sessionId]);

  const copyOutput = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapTypes = () => {
    setFromType(toType);
    setToType(fromType);
  };

  const fromInfo = MBTI_TYPES.find(t => t.value === fromType);
  const toInfo = MBTI_TYPES.find(t => t.value === toType);

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="translator-page">
      <div>
        <h1 className="heading-2 text-zinc-100">Communication Translator</h1>
        <p className="body-text mt-2">
          Translate between cognitive communication styles. Paste a message, select the types, and receive an adapted version.
        </p>
      </div>

      {/* Direction Toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant={direction === "outgoing" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("outgoing")}
          className={cn(direction === "outgoing" && "bg-red-600 hover:bg-red-700")}
          data-testid="direction-outgoing"
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Sending (Outgoing)
        </Button>
        <Button
          variant={direction === "incoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("incoming")}
          className={cn(direction === "incoming" && "bg-blue-600 hover:bg-blue-700")}
          data-testid="direction-incoming"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Receiving (Incoming)
        </Button>
      </div>

      {/* Type Selectors */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-zinc-500 mb-2">
            {direction === "outgoing" ? "You Are" : "They Are"}
          </p>
          <Select value={fromType} onValueChange={setFromType}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800" data-testid="from-type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {MBTI_TYPES.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  <span className="font-mono text-red-400">{t.value}</span>
                  <span className="text-zinc-500 ml-2">{t.alias}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fromInfo && (
            <p className="text-xs text-zinc-500 mt-1">{fromInfo.description}</p>
          )}
        </div>

        <Button variant="ghost" size="icon" onClick={swapTypes} className="mt-4" data-testid="swap-types">
          <ArrowRightLeft className="w-5 h-5 text-zinc-500" />
        </Button>

        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-zinc-500 mb-2">
            {direction === "outgoing" ? "They Are" : "You Are"}
          </p>
          <Select value={toType} onValueChange={setToType}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800" data-testid="to-type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {MBTI_TYPES.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  <span className="font-mono text-red-400">{t.value}</span>
                  <span className="text-zinc-500 ml-2">{t.alias}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toInfo && (
            <p className="text-xs text-zinc-500 mt-1">{toInfo.description}</p>
          )}
        </div>
      </div>

      {/* Translation Area */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-zinc-400">
              {direction === "outgoing" ? "Your Message" : "Their Message"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={direction === "outgoing" ? "Type or paste what you want to say..." : "Paste what they sent you..."}
              className="min-h-[200px] bg-zinc-900 border-zinc-800 resize-none"
              data-testid="translator-input"
            />
            <Button 
              onClick={translate}
              disabled={loading || !inputText.trim()}
              className="mt-3 w-full bg-red-600 hover:bg-red-700"
              data-testid="translate-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Translate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-zinc-400">
                {direction === "outgoing" ? "Adapted for Them" : "What They Actually Mean"}
              </CardTitle>
              {outputText && (
                <Button variant="ghost" size="sm" onClick={copyOutput} data-testid="copy-output">
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-500" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
              {loading ? (
                <div className="flex items-center gap-2 text-zinc-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              ) : outputText ? (
                <p className="text-sm text-zinc-200 whitespace-pre-wrap" data-testid="translator-output">{outputText}</p>
              ) : (
                <p className="text-sm text-zinc-600">Translated message will appear here...</p>
              )}
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-2" data-testid="translator-error">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Reference */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-4">
          <p className="text-xs text-zinc-500 mb-2">Quick Reference</p>
          <div className="flex flex-wrap gap-2">
            {MBTI_TYPES.slice(0, 4).map(t => (
              <Badge key={t.value} variant="outline" className="text-xs">
                <span className="font-mono text-red-400 mr-1">{t.value}</span>
                <span className="text-zinc-500">{t.alias}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
