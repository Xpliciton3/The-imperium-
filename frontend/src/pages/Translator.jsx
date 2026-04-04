import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRightLeft, Send, Copy, Check, Loader2, Settings, X, ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MBTI_TYPES = [
  { value: "INTJ", alias: "The Uncrowned", desc: "Direct, strategic, minimal" },
  { value: "ESFJ", alias: "The Unspent", desc: "Warm, harmonious, conscientious" },
  { value: "INTP", alias: "The Theorist", desc: "Analytical, precise, abstract" },
  { value: "ENFP", alias: "The Catalyst", desc: "Enthusiastic, expressive" },
  { value: "INFJ", alias: "The Counselor", desc: "Empathic, insightful" },
  { value: "ESTP", alias: "The Operative", desc: "Action-first, pragmatic" },
  { value: "ENFJ", alias: "The Mentor", desc: "Warm, persuasive" },
  { value: "ISTP", alias: "The Craftsman", desc: "Efficient, independent" },
];

export default function Translator() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [fromType, setFromType] = useState("INTJ");
  const [toType, setToType] = useState("ESFJ");
  const [direction, setDirection] = useState("outgoing");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    
    const userMsg = {
      id: Date.now(),
      type: "user",
      text,
      direction,
      from: direction === "outgoing" ? fromType : toType,
      to: direction === "outgoing" ? toType : fromType,
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/translator/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
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
      setSessionId(data.session_id);
      
      const aiMsg = {
        id: Date.now() + 1,
        type: "ai",
        text: data.translated,
        direction,
        from: direction === "outgoing" ? fromType : toType,
        to: direction === "outgoing" ? toType : fromType,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const errMsg = {
        id: Date.now() + 1,
        type: "error",
        text: e.message,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, fromType, toType, direction, sessionId, loading]);

  const copyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fromInfo = MBTI_TYPES.find(t => t.value === fromType);
  const toInfo = MBTI_TYPES.find(t => t.value === toType);

  return (
    <div className="p-6 lg:p-8 flex flex-col h-[calc(100vh-4rem)]" data-testid="translator-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="heading-2 text-zinc-100">Communication Translator</h1>
          <p className="text-xs text-zinc-500">Live chat. Paste their message or type yours. Get the MBTI-adapted version.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} data-testid="settings-btn">
            <Settings className="w-4 h-4 text-zinc-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={clearChat} data-testid="clear-chat">
            <Trash2 className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="bg-[#18181b] border-zinc-800 mb-4" data-testid="settings-panel">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant={direction === "outgoing" ? "default" : "outline"}
                size="sm"
                onClick={() => setDirection("outgoing")}
                className={cn(direction === "outgoing" && "bg-red-600 hover:bg-red-700")}
                data-testid="direction-outgoing"
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                I'm Sending
              </Button>
              <Button
                variant={direction === "incoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setDirection("incoming")}
                className={cn(direction === "incoming" && "bg-blue-600 hover:bg-blue-700")}
                data-testid="direction-incoming"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                I Received
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">{direction === "outgoing" ? "I Am" : "They Are"}</p>
                <Select value={fromType} onValueChange={setFromType}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-sm" data-testid="from-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {MBTI_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        <span className="font-mono text-red-400">{t.value}</span>
                        <span className="text-zinc-500 ml-1">{t.alias}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">{direction === "outgoing" ? "They Are" : "I Am"}</p>
                <Select value={toType} onValueChange={setToType}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-sm" data-testid="to-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {MBTI_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        <span className="font-mono text-red-400">{t.value}</span>
                        <span className="text-zinc-500 ml-1">{t.alias}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)} className="text-xs text-zinc-500">
              <X className="w-3 h-3 mr-1" /> Close Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Config Bar */}
      <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500 flex-wrap">
        <Badge variant="outline" className="font-mono text-red-400">{fromType}</Badge>
        <span>{direction === "outgoing" ? "sending to" : "received from"}</span>
        <Badge variant="outline" className="font-mono text-blue-400">{toType}</Badge>
        {fromInfo && <span className="text-zinc-600">({fromInfo.alias} {direction === "outgoing" ? "→" : "←"} {toInfo?.alias})</span>}
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <ArrowRightLeft className="w-8 h-8 text-zinc-700 mx-auto" />
              <p className="text-sm text-zinc-500">Start a conversation.</p>
              <p className="text-xs text-zinc-600">
                {direction === "outgoing" 
                  ? "Type what you want to say and get it translated for them."
                  : "Paste what they sent you and see what they actually mean."}
              </p>
            </div>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex", msg.type === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] rounded-sm p-3",
              msg.type === "user" && "bg-red-600/10 border border-red-600/20",
              msg.type === "ai" && "bg-zinc-800/50 border border-zinc-700/50",
              msg.type === "error" && "bg-red-900/20 border border-red-800/30"
            )}>
              {msg.type === "user" && (
                <p className="text-xs text-red-400 mb-1 font-mono">
                  {msg.direction === "outgoing" ? "Your message" : "Their message"}
                </p>
              )}
              {msg.type === "ai" && (
                <p className="text-xs text-emerald-400 mb-1 font-mono">
                  {msg.direction === "outgoing" ? `Adapted for ${msg.to}` : `What they meant (${msg.from})`}
                </p>
              )}
              {msg.type === "error" && (
                <p className="text-xs text-red-400 mb-1">Error</p>
              )}
              <p className="text-sm text-zinc-200 whitespace-pre-wrap" data-testid={`msg-${msg.id}`}>{msg.text}</p>
              {msg.type === "ai" && (
                <Button 
                  variant="ghost" size="sm" 
                  className="mt-2 h-6 text-xs text-zinc-500"
                  onClick={() => copyText(msg.id, msg.text)}
                  data-testid={`copy-${msg.id}`}
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copiedId === msg.id ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-sm p-3">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={direction === "outgoing" ? "Type what you want to say..." : "Paste what they sent you..."}
          className="bg-zinc-900 border-zinc-800 resize-none min-h-[56px] max-h-[120px]"
          data-testid="translator-input"
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-red-600 hover:bg-red-700 h-[56px] px-4"
          data-testid="send-btn"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
