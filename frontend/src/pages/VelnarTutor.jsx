import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  BookOpen,
  MessageSquare,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CheckCircle2,
  Circle,
  GraduationCap,
  Lock,
  Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TUTOR_PERSONALITY = {
  greeting: "An im-vel. I am your guide to Vel'nar, the sacred language of The Uncrowned. I speak not as a teacher imposing knowledge, but as one who walks the path alongside you. What would you like to explore?",
  encouragement: [
    "Good. Your pronunciation shows intention.",
    "You're beginning to hear the weight in these words.",
    "Slowly. Let each syllable arrive.",
    "The forge recognizes your effort.",
    "You speak with more presence now.",
  ],
  corrections: [
    "Not quite. Remember - Vel'nar is spoken at 60-70% of normal speed. Try again, slower.",
    "The sound needs more weight. Vel'nar is not casual speech.",
    "Listen: the vowel should be open, not flattened. Like this...",
    "Feel the consonant land fully before moving to the next sound.",
  ]
};

export default function VelnarTutor() {
  const [vocabulary, setVocabulary] = useState(null);
  const [course, setCourse] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [courseProgress, setCourseProgress] = useLocalStorage("velnar_course_progress", {
    currentLevel: 1,
    currentLesson: "1-1",
    completedLessons: [],
    masteredPhrases: []
  });
  const [messages, setMessages] = useState([
    { role: "assistant", content: TUTOR_PERSONALITY.greeting }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [activeTab, setActiveTab] = useState("conversation");
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(null);

  // Load data
  useEffect(() => {
    setDataLoading(true);
    setDataError(null);
    Promise.all([
      fetch(`${BACKEND_URL}/api/velnar/vocabulary`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${BACKEND_URL}/api/velnar/course`).then(r => r.ok ? r.json() : null).catch(() => null)
    ])
      .then(([vocabData, courseData]) => {
        if (vocabData) setVocabulary(vocabData);
        if (courseData) {
          setCourse(courseData);
          const firstLevel = courseData.levels?.[0];
          const firstLesson = firstLevel?.lessons?.[0];
          if (firstLesson) {
            setSelectedLesson({ level: firstLevel, lesson: firstLesson });
          }
        }
        if (!vocabData && !courseData) {
          setDataError("Could not load course data. The Conversation tab is still available.");
        }
      })
      .catch(err => {
        console.warn("Failed to load tutor data:", err);
        setDataError("Could not load course data. The Conversation tab is still available.");
      })
      .finally(() => setDataLoading(false));
  }, []);

  // Initialize speech recognition - with safety checks for all browser APIs
  useEffect(() => {
    try {
      // Check speechSynthesis availability first
      if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
        synthRef.current = window.speechSynthesis;
      }

      // Check speech recognition availability
      const hasSpeechRecognition = typeof window !== 'undefined' && 
        (typeof window.SpeechRecognition !== 'undefined' || typeof window.webkitSpeechRecognition !== 'undefined');

      if (!hasSpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setUserInput(transcript);
        
        if (event.results[0].isFinal) {
          handleSendMessage(transcript);
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    } catch (err) {
      console.warn("Speech API initialization failed:", err);
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setUserInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text, slow = false) => {
    try {
      if (!synthRef.current) return;
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = slow ? 0.6 : 0.8;
      utterance.pitch = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn("TTS error:", err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  const generateConversationalResponse = useCallback(async (userText) => {
    // Use Gemini API for conversation
    try {
      const response = await fetch(`${BACKEND_URL}/api/velnar/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          session_id: sessionIdRef.current 
        })
      });
      
      if (!response.ok) {
        throw new Error('Chat API error');
      }
      
      const data = await response.json();
      sessionIdRef.current = data.session_id;
      return data.response;
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback to local response if API fails
      return generateLocalResponse(userText);
    }
  }, []);

  const generateLocalResponse = (userText) => {
    if (!vocabulary || !course) return "One moment... gathering my thoughts.";
    
    const lowerText = userText.toLowerCase();
    
    // Contextual understanding
    if (lowerText.includes("teach me") || lowerText.includes("what should i learn") || lowerText.includes("where do i start")) {
      const currentLevelData = course.levels?.find(l => l.level === courseProgress.currentLevel);
      return `You are currently at Level ${courseProgress.currentLevel}: "${currentLevelData?.title || 'Unknown'}". 

I suggest we work through your current lesson: "${selectedLesson?.lesson?.title || 'The First Sounds'}". 

${selectedLesson?.lesson?.content?.[0]?.text || 'Let us begin with the foundations.'}

Would you like me to guide you through this lesson step by step?`;
    }

    // Default - guide to options
    return `I hear you, but I'm not certain of your intention.

In our work together, you might:
• Say "teach me" to continue your current lesson
• Ask "how do I pronounce [word]?" for pronunciation guidance  
• Ask "what does [word] mean?" for understanding
• Say "practice" for speaking drills
• Ask about the "rite" or the "axiom" for ceremonial language
• Ask about your "progress" to see how far you've come

What draws your attention?`;
  };

  const handleSendMessage = useCallback(async (text) => {
    const messageText = text || userInput;
    if (!messageText.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: "user", content: messageText }]);
    setUserInput("");

    try {
      const response = await generateConversationalResponse(messageText);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      speakText(response);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, I had trouble processing that. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, generateConversationalResponse]);

  const selectLesson = (level, lesson) => {
    setSelectedLesson({ level, lesson });
    setCourseProgress(prev => ({
      ...prev,
      currentLevel: level.level,
      currentLesson: lesson.id
    }));
  };

  const completeLesson = (lessonId) => {
    setCourseProgress(prev => ({
      ...prev,
      completedLessons: [...new Set([...prev.completedLessons, lessonId])]
    }));
  };

  const isLessonCompleted = (lessonId) => courseProgress.completedLessons?.includes(lessonId);
  const isLessonAvailable = (level, lessonIndex) => {
    if (level === 1) return true;
    const prevLevelLessons = course?.levels?.find(l => l.level === level - 1)?.lessons || [];
    return prevLevelLessons.every(l => isLessonCompleted(l.id));
  };

  const levelProgress = (level) => {
    const levelLessons = course?.levels?.find(l => l.level === level)?.lessons || [];
    const completed = levelLessons.filter(l => isLessonCompleted(l.id)).length;
    return (completed / levelLessons.length) * 100;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-zinc-100">Vel'nar Language Tutor</h1>
          <p className="body-text mt-2">Learn the sacred language through guided conversation</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-amber-500 border-amber-500/50">
            Level {courseProgress.currentLevel}: {course?.levels?.find(l => l.level === courseProgress.currentLevel)?.name || "Initiate"}
          </Badge>
          {!speechSupported && (
            <div className="flex items-center gap-2 text-amber-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              Speech not supported
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Area - Chat or Lesson */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-zinc-900 border border-zinc-800 mb-4">
              <TabsTrigger value="course" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Course
              </TabsTrigger>
              <TabsTrigger value="conversation" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Conversation
              </TabsTrigger>
              <TabsTrigger value="reference" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Reference
              </TabsTrigger>
            </TabsList>

            {/* Course Tab */}
            <TabsContent value="course">
              {dataLoading ? (
                <Card className="bg-[#18181b] border-zinc-800">
                  <CardContent className="p-12 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    <p className="text-sm text-zinc-400">Loading course material...</p>
                  </CardContent>
                </Card>
              ) : dataError && !selectedLesson ? (
                <Card className="bg-[#18181b] border-zinc-800">
                  <CardContent className="p-12 flex flex-col items-center justify-center gap-3">
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                    <p className="text-sm text-zinc-400">{dataError}</p>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("conversation")} data-testid="switch-to-conversation">
                      Go to Conversation
                    </Button>
                  </CardContent>
                </Card>
              ) : selectedLesson ? (
                <Card className="bg-[#18181b] border-zinc-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="overline text-red-400">
                          Level {selectedLesson.level.level}: {selectedLesson.level.name}
                        </p>
                        <CardTitle className="heading-4 mt-1">{selectedLesson.lesson.title}</CardTitle>
                        <p className="text-sm text-zinc-400 mt-2">{selectedLesson.lesson.description}</p>
                      </div>
                      {isLessonCompleted(selectedLesson.lesson.id) && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        {selectedLesson.lesson.content?.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            {item.type === "teaching" && (
                              <div className="p-4 bg-zinc-900/50 rounded-sm border-l-2 border-red-600">
                                <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                              </div>
                            )}
                            {item.type === "vowel" && (
                              <div className="p-4 bg-zinc-900/30 rounded-sm flex items-center justify-between">
                                <div>
                                  <span className="text-2xl font-mono text-red-400">{item.letter}</span>
                                  <span className="mx-3 text-zinc-600">=</span>
                                  <span className="text-lg text-zinc-200">{item.sound}</span>
                                </div>
                                <p className="text-sm text-zinc-400">{item.example}</p>
                                <button
                                  onClick={() => speakText(item.sound, true)}
                                  className="p-2 text-zinc-500 hover:text-red-400"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {item.type === "consonant" && (
                              <div className="p-4 bg-zinc-900/30 rounded-sm flex items-center gap-4">
                                <span className="text-xl font-mono text-amber-400 w-12">{item.sound}</span>
                                <p className="text-sm text-zinc-300">{item.description}</p>
                              </div>
                            )}
                            {item.type === "root" && (
                              <div className="p-4 bg-zinc-900/50 rounded-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xl font-mono text-red-400 font-bold">{item.word}</span>
                                  <span className="text-sm text-zinc-500">{item.pronunciation}</span>
                                </div>
                                <p className="text-sm text-zinc-200 font-medium mb-2">{item.meaning}</p>
                                <p className="text-xs text-zinc-400">{item.usage}</p>
                                <button
                                  onClick={() => speakText(`${item.word}. ${item.pronunciation}`, true)}
                                  className="mt-3 flex items-center gap-2 text-xs text-red-400 hover:text-red-300"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  Hear pronunciation
                                </button>
                              </div>
                            )}
                            {item.type === "shadow_root" && (
                              <div className="p-4 bg-zinc-900/50 rounded-sm border-l-2 border-zinc-600">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xl font-mono text-zinc-400 font-bold">{item.word}</span>
                                  <span className="text-sm text-zinc-500">{item.pronunciation}</span>
                                </div>
                                <p className="text-sm text-zinc-200 font-medium mb-2">{item.meaning}</p>
                                <p className="text-xs text-zinc-400">{item.usage}</p>
                              </div>
                            )}
                            {item.type === "compound" && (
                              <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-sm">
                                <p className="font-mono text-red-400 text-lg mb-2">{item.phrase}</p>
                                <p className="text-sm text-zinc-200">{item.meaning}</p>
                                {item.context && <p className="text-xs text-zinc-500 mt-2">{item.context}</p>}
                              </div>
                            )}
                            {item.type === "rite_phrase" && (
                              <div className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-sm">
                                <p className="font-mono text-amber-400 text-lg mb-1">{item.phrase}</p>
                                <p className="text-xs text-zinc-500 mb-2">{item.pronunciation}</p>
                                <p className="text-sm text-zinc-200">{item.meaning}</p>
                                {item.context && <p className="text-xs text-zinc-500 mt-2">{item.context}</p>}
                                <button
                                  onClick={() => speakText(item.phrase, true)}
                                  className="mt-3 flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  Hear it spoken
                                </button>
                              </div>
                            )}
                            {item.type === "principle" && (
                              <div className="p-4 bg-zinc-800/50 rounded-sm">
                                <p className="text-sm font-medium text-zinc-200 mb-1">{item.name}</p>
                                <p className="text-sm text-zinc-400">{item.text}</p>
                              </div>
                            )}
                            {item.type === "rule" && (
                              <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-sm">
                                <p className="text-sm font-medium text-blue-400 mb-1">{item.name}</p>
                                <p className="text-sm text-zinc-300">{item.text}</p>
                              </div>
                            )}
                            {item.type === "example" && (
                              <div className="p-4 bg-zinc-900/30 rounded-sm">
                                <p className="font-mono text-emerald-400">{item.compound}</p>
                                <p className="text-xs text-zinc-500 mt-1">{item.breakdown}</p>
                                <p className="text-sm text-zinc-300 mt-2">{item.explanation}</p>
                              </div>
                            )}
                            {item.type === "marker" && (
                              <div className="p-3 bg-zinc-900/30 rounded-sm flex items-start gap-4">
                                <span className="font-mono text-indigo-400 font-bold w-16">{item.marker}</span>
                                <div>
                                  <p className="text-sm text-zinc-300">{item.meaning}</p>
                                  <p className="text-xs text-zinc-500 mt-1">e.g., {item.example}</p>
                                </div>
                              </div>
                            )}
                            {item.type === "breath" && (
                              <div className="p-4 bg-indigo-600/10 border border-indigo-600/30 rounded-sm">
                                <p className="text-sm font-medium text-indigo-400 mb-1">{item.form}</p>
                                <p className="text-xs text-zinc-500 mb-2">Pattern: {item.pattern}</p>
                                <p className="text-sm text-zinc-300">{item.description}</p>
                              </div>
                            )}
                            {item.type === "axiom" && (
                              <div className="p-6 bg-red-600/10 border border-red-600/50 rounded-sm text-center">
                                <p className="heading-4 text-zinc-100 italic mb-3">"{item.phrase}"</p>
                                <p className="font-mono text-red-400 text-sm mb-4">{item.vel_nar}</p>
                                <p className="text-sm text-zinc-400">{item.explanation}</p>
                              </div>
                            )}
                            {item.type === "four_word" && (
                              <div className="p-4 bg-zinc-800/50 rounded-sm text-center">
                                <p className="text-lg font-medium text-zinc-200">{item.phrase}</p>
                                <p className="text-sm text-zinc-400 mt-2">{item.explanation}</p>
                              </div>
                            )}
                            {item.type === "practice" && (
                              <div className="p-4 bg-emerald-600/10 border border-emerald-600/30 rounded-sm">
                                <p className="text-sm text-emerald-300 flex items-center gap-2">
                                  <Play className="w-4 h-4" />
                                  Practice: {item.text}
                                </p>
                              </div>
                            )}
                            {item.type === "warning" && (
                              <div className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-sm">
                                <p className="text-sm text-amber-300 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  {item.text}
                                </p>
                              </div>
                            )}
                            {item.type === "final" && (
                              <div className="p-6 bg-zinc-800 rounded-sm text-center">
                                <p className="text-sm text-zinc-300">{item.text}</p>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Phrases to learn */}
                        {selectedLesson.lesson.phrases_to_learn?.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-zinc-800">
                            <p className="overline text-zinc-500 mb-3">Phrases from this lesson</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedLesson.lesson.phrases_to_learn.map((phrase, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => speakText(phrase, true)}
                                  className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-sm text-sm font-mono text-zinc-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
                                >
                                  {phrase}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Complete Lesson Button */}
                    {!isLessonCompleted(selectedLesson.lesson.id) && (
                      <Button
                        onClick={() => completeLesson(selectedLesson.lesson.id)}
                        className="w-full mt-4 btn-primary"
                        data-testid="complete-lesson-btn"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Lesson Complete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-[#18181b] border-zinc-800 p-8 text-center">
                  <p className="text-zinc-400">Select a lesson from the sidebar to begin.</p>
                </Card>
              )}
            </TabsContent>

            {/* Conversation Tab */}
            <TabsContent value="conversation">
              <Card className="bg-[#0f0f11] border-zinc-800 h-[550px] flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "max-w-[85%] p-4 rounded-sm whitespace-pre-wrap",
                          msg.role === "user"
                            ? "ml-auto bg-red-600/20 border border-red-600/30"
                            : "bg-zinc-800/50 border border-zinc-700"
                        )}
                      >
                        <p className="text-sm text-zinc-200">{msg.content}</p>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            Speak
                          </button>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Considering...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-zinc-800 bg-[#18181b]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleListening}
                      disabled={!speechSupported}
                      data-testid="velnar-mic-button"
                      className={cn(
                        "w-14 h-14 rounded-sm flex items-center justify-center transition-all duration-300",
                        isListening
                          ? "bg-red-600 listening-glow"
                          : "bg-zinc-800 border border-zinc-700 hover:border-zinc-500",
                        !speechSupported && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isListening ? (
                        <Mic className="w-6 h-6 text-white animate-pulse" />
                      ) : (
                        <MicOff className="w-6 h-6 text-zinc-400" />
                      )}
                    </button>

                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask about Vel'nar or say 'teach me'..."
                      data-testid="velnar-input"
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
                    />

                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!userInput.trim() || isLoading}
                      data-testid="submit-speech"
                      className="btn-primary h-14 px-6"
                    >
                      Send
                    </Button>

                    {isSpeaking && (
                      <button
                        onClick={stopSpeaking}
                        className="p-3 bg-amber-600/20 border border-amber-600/30 rounded-sm"
                      >
                        <VolumeX className="w-5 h-5 text-amber-500" />
                      </button>
                    )}
                  </div>
                  
                  {isListening && (
                    <p className="text-xs text-red-400 mt-2 animate-pulse">
                      Listening... Speak now
                    </p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Reference Tab */}
            <TabsContent value="reference">
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <CardTitle className="heading-4">Quick Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <p className="overline text-red-400 mb-3">Core Roots</p>
                        <div className="grid grid-cols-2 gap-2">
                          {vocabulary?.core_roots?.slice(0, 12).map((root) => (
                            <button
                              key={root.root}
                              onClick={() => speakText(`${root.root}. ${root.pronunciation}`, true)}
                              className="p-3 bg-zinc-900/50 rounded-sm text-left hover:bg-zinc-800/50"
                            >
                              <span className="font-mono text-red-400">{root.root}</span>
                              <span className="text-xs text-zinc-500 ml-2">{root.pronunciation}</span>
                              <p className="text-xs text-zinc-400 mt-1 truncate">{root.meaning}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="overline text-amber-400 mb-3">Key Phrases</p>
                        <div className="space-y-2">
                          {vocabulary?.key_phrases?.slice(0, 8).map((phrase, idx) => (
                            <button
                              key={idx}
                              onClick={() => speakText(phrase.phrase, true)}
                              className="w-full p-3 bg-zinc-900/50 rounded-sm text-left hover:bg-zinc-800/50"
                            >
                              <span className="font-mono text-amber-400">{phrase.phrase}</span>
                              <p className="text-xs text-zinc-400 mt-1">{phrase.meaning}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Course Structure */}
        <div className="space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                Course Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {course?.levels?.map((level) => {
                    const isUnlocked = level.level === 1 || levelProgress(level.level - 1) === 100;
                    const progress = levelProgress(level.level);
                    
                    return (
                      <div key={level.level} className="space-y-2">
                        <div className={cn(
                          "p-3 rounded-sm border",
                          level.level === courseProgress.currentLevel
                            ? "bg-red-600/10 border-red-600/30"
                            : isUnlocked
                            ? "bg-zinc-900/50 border-zinc-800"
                            : "bg-zinc-900/20 border-zinc-800 opacity-50"
                        )}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {!isUnlocked ? (
                                <Lock className="w-4 h-4 text-zinc-500" />
                              ) : progress === 100 ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-500" />
                              )}
                              <span className="text-sm font-medium text-zinc-200">
                                Level {level.level}: {level.name}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 mb-2">{level.title}</p>
                          <Progress value={progress} className="h-1" />
                        </div>

                        {/* Lessons */}
                        {isUnlocked && (
                          <div className="pl-4 space-y-1">
                            {level.lessons?.map((lesson, idx) => {
                              const isCompleted = isLessonCompleted(lesson.id);
                              const isSelected = selectedLesson?.lesson?.id === lesson.id;
                              
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => selectLesson(level, lesson)}
                                  data-testid={`lesson-${lesson.id}`}
                                  className={cn(
                                    "w-full flex items-center gap-2 p-2 rounded-sm text-left text-sm transition-colors",
                                    isSelected
                                      ? "bg-red-600/20 text-red-400"
                                      : isCompleted
                                      ? "text-emerald-400 hover:bg-zinc-800/50"
                                      : "text-zinc-400 hover:bg-zinc-800/50"
                                  )}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                  ) : (
                                    <Circle className="w-3 h-3" />
                                  )}
                                  <span className="truncate">{lesson.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="bg-zinc-900/30 border-zinc-800">
            <CardContent className="p-4">
              <p className="overline text-zinc-500 mb-2">Your Journey</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Lessons Completed</span>
                <span className="text-sm font-medium text-zinc-200">
                  {courseProgress.completedLessons?.length || 0} / {course?.levels?.reduce((sum, l) => sum + (l.lessons?.length || 0), 0) || 0}
                </span>
              </div>
              <Progress 
                value={(courseProgress.completedLessons?.length || 0) / (course?.levels?.reduce((sum, l) => sum + (l.lessons?.length || 0), 0) || 1) * 100} 
                className="h-2" 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
