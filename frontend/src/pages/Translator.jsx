import React, { useState } from "react";
import { 
  ArrowRightLeft, 
  Copy, 
  Check,
  Volume2,
  ChevronDown,
  MessageSquare,
  Send,
  Inbox
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

// MBTI Types with their communication styles
const MBTI_TYPES = {
  "INTJ": {
    name: "INTJ - The Uncrowned",
    description: "Strategic, independent, determined. Speaks directly with purpose.",
    style: "Direct, minimal, assumes competence. Values efficiency over pleasantries.",
    translations: {
      greeting: "I acknowledge your presence.",
      thanks: "Your contribution is noted.",
      agree: "This aligns with my assessment.",
      disagree: "I see it differently. Here's why...",
      request: "I need [X]. Here's the context.",
      farewell: "Until we speak again.",
    }
  },
  "ESFJ": {
    name: "ESFJ - The Unspent",
    description: "Warm, conscientious, harmonious. Speaks with care for relationships.",
    style: "Warm, inclusive, checks in emotionally. Values connection and harmony.",
    translations: {
      greeting: "Hi! It's so good to hear from you! How are you doing?",
      thanks: "Thank you so much! I really appreciate you!",
      agree: "Yes, absolutely! I totally agree with you on that!",
      disagree: "I hear what you're saying, and I wonder if we might also consider...",
      request: "Hey, I was hoping you might be able to help me with something? No pressure though!",
      farewell: "Take care of yourself! Talk soon! 💕",
    }
  },
  "INTP": {
    name: "INTP - The Logician",
    description: "Analytical, objective, reserved. Speaks with precision.",
    style: "Precise, questioning, explores possibilities. Values accuracy.",
    translations: {
      greeting: "Hey.",
      thanks: "That was helpful.",
      agree: "That's logically consistent.",
      disagree: "Actually, there's a flaw in that reasoning...",
      request: "I'm trying to figure out [X]. Thoughts?",
      farewell: "Later.",
    }
  },
  "ENFP": {
    name: "ENFP - The Campaigner",
    description: "Enthusiastic, creative, sociable. Speaks with energy.",
    style: "Enthusiastic, idea-rich, emotionally expressive. Values possibilities.",
    translations: {
      greeting: "OMG HI!! I'm so excited to talk to you!",
      thanks: "You're literally the BEST! Thank you!!!",
      agree: "YES! That's exactly what I was thinking!",
      disagree: "Ooh but what if we looked at it THIS way...",
      request: "So I had this AMAZING idea and I need your help!",
      farewell: "Love you!! This was so fun!! 🎉",
    }
  },
  "ISTJ": {
    name: "ISTJ - The Logistician",
    description: "Practical, fact-minded, reliable. Speaks with structure.",
    style: "Structured, factual, follows protocol. Values reliability.",
    translations: {
      greeting: "Hello.",
      thanks: "Thank you for your help.",
      agree: "That's correct.",
      disagree: "The facts don't support that conclusion.",
      request: "I require assistance with [X]. The deadline is [Y].",
      farewell: "Goodbye.",
    }
  },
  "ENFJ": {
    name: "ENFJ - The Protagonist",
    description: "Charismatic, empathetic, organized. Speaks with inspiration.",
    style: "Inspiring, supportive, sees potential in others. Values growth.",
    translations: {
      greeting: "Hello, wonderful person! I've been thinking about you!",
      thanks: "I'm so grateful for you and everything you do!",
      agree: "I believe in this completely!",
      disagree: "I see your heart in this, and I wonder if together we could find...",
      request: "I know you're capable of amazing things - would you help me with...",
      farewell: "You matter more than you know. Until next time!",
    }
  },
  "ISTP": {
    name: "ISTP - The Virtuoso",
    description: "Bold, practical, experimental. Speaks economically.",
    style: "Terse, action-oriented, problem-focused. Values competence.",
    translations: {
      greeting: "Yo.",
      thanks: "Cool.",
      agree: "Works for me.",
      disagree: "Nah. Try this instead.",
      request: "Need a hand with [X].",
      farewell: "Catch you later.",
    }
  },
  "INFJ": {
    name: "INFJ - The Advocate",
    description: "Quiet, mystical, inspiring. Speaks with depth.",
    style: "Thoughtful, metaphorical, seeks meaning. Values authenticity.",
    translations: {
      greeting: "I've been holding space for our connection.",
      thanks: "Your kindness touches something deep in me.",
      agree: "This resonates with my understanding.",
      disagree: "I sense there's more beneath the surface here...",
      request: "I'm navigating something meaningful and could use your insight.",
      farewell: "May you walk gently. We'll find each other again.",
    }
  },
};

// Common phrases to translate
const COMMON_PHRASES = [
  { key: "greeting", label: "Greeting" },
  { key: "thanks", label: "Thank You" },
  { key: "agree", label: "Agreement" },
  { key: "disagree", label: "Disagreement" },
  { key: "request", label: "Making a Request" },
  { key: "farewell", label: "Farewell" },
];

// Vel'nar phrases with translations
const VELNAR_PHRASES = {
  "an im-vel": "I stand as my own choosing",
  "vel nar": "the sovereign interior",
  "ren kal": "permanently held under witness",
  "an im-thur": "I enter the forge knowingly",
  "an im-dor": "I return",
  "dor thur": "return to the forge",
  "tar barred": "breach is barred",
  "nar sealed": "the interior is sealed",
  "anar ren-kal": "you who are truly known and permanently held",
  "vel anar kal": "I choose you enduringly",
  "velk no": "false crown, no",
  "keth no": "false rule, no",
  "mir ren": "consciously witnessed and known",
};

export default function Translator() {
  const [myType, setMyType] = useLocalStorage("my_mbti_type", "INTJ");
  const [theirType, setTheirType] = useState("ESFJ");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("outgoing");

  const translateToTheirStyle = () => {
    if (!inputText.trim()) return;
    
    const theirStyle = MBTI_TYPES[theirType];
    let result = inputText;
    
    // Add style-appropriate wrapper based on their type
    if (theirType === "ESFJ" || theirType === "ENFP" || theirType === "ENFJ") {
      // Warm types - add softeners
      result = result.replace(/^I need/i, "Hey! I was hoping you might help me with");
      result = result.replace(/\.$/, "! 😊");
      result = result.replace(/Do this/i, "Would you mind");
    } else if (theirType === "INTJ" || theirType === "ISTP" || theirType === "INTP") {
      // Direct types - remove fluff
      result = result.replace(/I was wondering if maybe/i, "I need");
      result = result.replace(/Would you mind/i, "Please");
      result = result.replace(/!+/g, ".");
      result = result.replace(/😊|💕|🎉/g, "");
    }
    
    setOutputText(result);
  };

  const translateToMyStyle = () => {
    if (!inputText.trim()) return;
    
    const myStyle = MBTI_TYPES[myType];
    let result = inputText;
    
    // Translate to my preferred style (strip or add based on type)
    if (myType === "INTJ" || myType === "ISTP" || myType === "INTP") {
      // I prefer direct - strip fluff
      result = result.replace(/Hey!|Hi!|OMG/gi, "");
      result = result.replace(/I was hoping you might/i, "I need you to");
      result = result.replace(/!+/g, ".");
      result = result.replace(/😊|💕|🎉|❤️/g, "");
      result = result.trim();
    } else if (myType === "ESFJ" || myType === "ENFP" || myType === "ENFJ") {
      // I prefer warm - they might be too direct
      result = `[Note: This person communicates directly. Their intent is: ${result}]`;
    }
    
    setOutputText(result);
  };

  const translateVelnar = (direction) => {
    if (!inputText.trim()) return;
    
    let result = inputText;
    
    if (direction === "to_english") {
      // Vel'nar to English
      Object.entries(VELNAR_PHRASES).forEach(([velnar, english]) => {
        const regex = new RegExp(velnar, "gi");
        result = result.replace(regex, `${english} [${velnar}]`);
      });
    } else {
      // English to Vel'nar (find matching concepts)
      if (result.toLowerCase().includes("i choose you") || result.toLowerCase().includes("i love you")) {
        result = "vel anar kal - I choose you enduringly";
      } else if (result.toLowerCase().includes("goodbye") || result.toLowerCase().includes("farewell")) {
        result = "vel nar. ren kal. - Go with your sovereignty intact.";
      } else if (result.toLowerCase().includes("hello") || result.toLowerCase().includes("hi")) {
        result = "an im-vel. - I stand as my own choosing. (greeting)";
      } else if (result.toLowerCase().includes("no") || result.toLowerCase().includes("refuse")) {
        result = "tar barred. nar sealed. - Breach is barred. The interior is sealed.";
      }
    }
    
    setOutputText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-2 text-zinc-100">Translator</h1>
        <p className="body-text mt-2">Communicate across types. Bridge the gap between Uncrowned and Unspent.</p>
      </div>

      {/* My Type Setting */}
      <Card className="bg-[#18181b] border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">My Communication Type</p>
              <p className="text-xs text-zinc-600">How I naturally communicate</p>
            </div>
            <Select value={myType} onValueChange={setMyType}>
              <SelectTrigger className="w-[200px] bg-zinc-900 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 max-h-[300px]">
                {Object.entries(MBTI_TYPES).map(([type, data]) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-red-400">{type}</span>
                      {type === "INTJ" && <Badge className="text-xs">Uncrowned</Badge>}
                      {type === "ESFJ" && <Badge variant="outline" className="text-xs">Unspent</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {MBTI_TYPES[myType] && (
            <p className="text-xs text-zinc-500 mt-2">{MBTI_TYPES[myType].style}</p>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="outgoing" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Outgoing (To Them)
          </TabsTrigger>
          <TabsTrigger value="incoming" className="flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            Incoming (From Them)
          </TabsTrigger>
          <TabsTrigger value="velnar" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Vel'nar
          </TabsTrigger>
        </TabsList>

        {/* Outgoing - Translate MY message to THEIR style */}
        <TabsContent value="outgoing" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline" className="text-red-400">{myType}</Badge>
                  What I Want to Say
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message in your natural style..."
                  className="bg-zinc-900 border-zinc-700 min-h-[150px]"
                  data-testid="translator-input"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Translate for:</span>
                    <Select value={theirType} onValueChange={setTheirType}>
                      <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-700 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {Object.entries(MBTI_TYPES).map(([type, data]) => (
                          <SelectItem key={type} value={type}>
                            <span className="font-mono">{type}</span>
                            {type === "ESFJ" && " (Unspent)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={translateToTheirStyle} className="w-full btn-primary">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Translate to Their Style
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline">{theirType}</Badge>
                  How They'll Receive It
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-900 border border-zinc-700 rounded-sm p-4 min-h-[150px]">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                    {outputText || "Translation will appear here..."}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={copyToClipboard}
                    disabled={!outputText}
                    className="flex-1"
                    data-testid="copy-translation"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => speakText(outputText)}
                    disabled={!outputText}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Incoming - Translate THEIR message to MY understanding */}
        <TabsContent value="incoming" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline">{theirType}</Badge>
                  What They Sent Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste their message here..."
                  className="bg-zinc-900 border-zinc-700 min-h-[150px]"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Message from:</span>
                    <Select value={theirType} onValueChange={setTheirType}>
                      <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-700 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {Object.entries(MBTI_TYPES).map(([type, data]) => (
                          <SelectItem key={type} value={type}>
                            <span className="font-mono">{type}</span>
                            {type === "ESFJ" && " (Unspent)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={translateToMyStyle} className="w-full btn-primary">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Translate to My Understanding
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline" className="text-red-400">{myType}</Badge>
                  What They Actually Mean
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-900 border border-zinc-700 rounded-sm p-4 min-h-[150px]">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                    {outputText || "Interpretation will appear here..."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vel'nar Translation */}
        <TabsContent value="velnar" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4">Vel'nar ↔ English</CardTitle>
                <p className="text-xs text-zinc-500">Translate sacred phrases</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter Vel'nar or English text..."
                  className="bg-zinc-900 border-zinc-700 min-h-[120px]"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => translateVelnar("to_english")} variant="outline" className="flex-1">
                    Vel'nar → English
                  </Button>
                  <Button onClick={() => translateVelnar("to_velnar")} variant="outline" className="flex-1">
                    English → Vel'nar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181b] border-zinc-800">
              <CardHeader>
                <CardTitle className="heading-4">Translation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-900 border border-zinc-700 rounded-sm p-4 min-h-[120px]">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                    {outputText || "Translation will appear here..."}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  disabled={!outputText}
                  className="w-full mt-4"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Translation"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Common Vel'nar Phrases Reference */}
          <Card className="bg-[#18181b] border-zinc-800 mt-4">
            <CardHeader>
              <CardTitle className="heading-4">Quick Reference: Common Vel'nar Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(VELNAR_PHRASES).map(([velnar, english]) => (
                  <button
                    key={velnar}
                    onClick={() => {
                      setInputText(velnar);
                      setOutputText(english);
                    }}
                    className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm text-left hover:border-red-500/50 transition-colors"
                  >
                    <p className="font-mono text-red-400 text-sm">{velnar}</p>
                    <p className="text-xs text-zinc-400 mt-1">{english}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MBTI Communication Guide */}
      <Card className="bg-[#18181b] border-zinc-800">
        <CardHeader>
          <CardTitle className="heading-4">Communication Style Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-sm">
              <p className="font-mono text-red-400 font-bold">INTJ - The Uncrowned</p>
              <p className="text-sm text-zinc-300 mt-2">{MBTI_TYPES.INTJ.style}</p>
            </div>
            <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-sm">
              <p className="font-mono text-blue-400 font-bold">ESFJ - The Unspent</p>
              <p className="text-sm text-zinc-300 mt-2">{MBTI_TYPES.ESFJ.style}</p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 text-center">
            The Uncrowned (INTJ) values efficiency and directness. The Unspent (ESFJ) values warmth and connection.
            Translation helps bridge these styles without compromising either's integrity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
