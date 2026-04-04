import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  CheckCircle2, 
  Circle,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Settings,
  Utensils,
  Sword,
  BookOpen,
  Dumbbell,
  Target,
  ExternalLink,
  Filter,
  X,
  Droplets,
  Flame,
  Minus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LOG_TYPES = [
  { value: "practice", label: "Daily Practice", icon: Sun, color: "text-amber-500", link: "/planner" },
  { value: "workout", label: "Workout", icon: Dumbbell, color: "text-blue-500", link: "/warrior" },
  { value: "meal", label: "Meal", icon: Utensils, color: "text-emerald-500", link: "/meals" },
  { value: "velnar", label: "Vel'nar Study", icon: BookOpen, color: "text-red-500", link: "/velnar" },
  { value: "meditation", label: "Meditation", icon: Moon, color: "text-indigo-500", link: "/meditations" },
  { value: "warrior", label: "Warrior Practice", icon: Sword, color: "text-purple-500", link: "/warrior" },
  { value: "commitment", label: "Commitment", icon: Target, color: "text-pink-500", link: null },
];

const RETENTION_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "1 year" },
  { value: "never", label: "Never delete" },
];

export default function DailyPlanner() {
  const [practices, setPractices] = useState(null);
  const [dailyProgress, setDailyProgress] = useLocalStorage("daily_practices", {
    morning: [],
    evening: [],
    date: null
  });
  const [weeklyProgress, setWeeklyProgress] = useLocalStorage("weekly_practices", {
    completed: [],
    date: null
  });
  const [activityLog, setActivityLog] = useLocalStorage("activity_log", []);
  const [commitments, setCommitments] = useLocalStorage("commitments", []);
  const [dataRetention, setDataRetention] = useLocalStorage("data_retention", "30");
  const [showAddLog, setShowAddLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [logFilter, setLogFilter] = useState("all");
  const [newLog, setNewLog] = useState({
    type: "practice",
    title: "",
    notes: "",
    duration: "",
    linkedItem: ""
  });
  const [newCommitment, setNewCommitment] = useState("");
  const [hydration, setHydration] = useState({ glasses: 0, goal: 8 });
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, total_days: 0 });

  const todayDate = new Date().toDateString();
  const todayISO = new Date().toISOString().split('T')[0];
  const isToday = dailyProgress.date === todayDate;

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/practices/daily`)
      .then(res => res.json())
      .then(data => setPractices(data))
      .catch(console.error);
    
    // Fetch hydration for today
    fetch(`${BACKEND_URL}/api/tracking/hydration/${todayISO}`)
      .then(res => res.json())
      .then(data => setHydration({ glasses: data.glasses || 0, goal: data.goal || 8 }))
      .catch(console.error);
    
    // Fetch streak
    fetch(`${BACKEND_URL}/api/tracking/streak`)
      .then(res => res.json())
      .then(setStreak)
      .catch(console.error);
  }, [todayISO]);

  // Reset progress for new day - only run once on mount
  useEffect(() => {
    if (dailyProgress.date !== todayDate) {
      setDailyProgress({
        morning: [],
        evening: [],
        date: todayDate
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-delete old data based on retention setting - only when retention changes
  useEffect(() => {
    if (dataRetention === "never") return;
    
    const retentionDays = parseInt(dataRetention);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    // Clean old activity logs
    setActivityLog(prev => {
      const filtered = prev.filter(log => new Date(log.timestamp) > cutoffDate);
      if (filtered.length === prev.length) return prev; // No change, don't update
      return filtered;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRetention]);

  const togglePractice = (period, practiceName) => {
    setDailyProgress(prev => {
      const periodPractices = prev[period] || [];
      const isCompleted = periodPractices.includes(practiceName);
      
      // Log the completion
      if (!isCompleted) {
        addActivityLog({
          type: "practice",
          title: practiceName,
          notes: `Completed ${period} practice`,
          duration: "",
        });
      }
      
      return {
        ...prev,
        [period]: isCompleted
          ? periodPractices.filter(p => p !== practiceName)
          : [...periodPractices, practiceName],
        date: todayDate
      };
    });
  };

  const toggleWeeklyPractice = (practiceName) => {
    const weekStart = getWeekStart();
    setWeeklyProgress(prev => {
      const isCompleted = prev.completed?.includes(practiceName);
      
      if (!isCompleted) {
        addActivityLog({
          type: "practice",
          title: practiceName,
          notes: "Weekly sharpening completed",
          duration: "90 min",
        });
      }
      
      return {
        completed: isCompleted
          ? prev.completed.filter(p => p !== practiceName)
          : [...(prev.completed || []), practiceName],
        date: weekStart
      };
    });
  };

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff)).toDateString();
  };

  const isPracticeCompleted = (period, name) => {
    return isToday && (dailyProgress[period] || []).includes(name);
  };

  const isWeeklyCompleted = (name) => {
    return weeklyProgress.date === getWeekStart() && (weeklyProgress.completed || []).includes(name);
  };

  const addActivityLog = (logData) => {
    const newEntry = {
      id: Date.now().toString(),
      ...logData,
      timestamp: new Date().toISOString(),
    };
    setActivityLog(prev => [newEntry, ...prev]);
    logActivityToBackend(logData.type || "practice");
  };

  const handleAddLog = () => {
    if (!newLog.title.trim()) return;
    
    addActivityLog(newLog);
    setNewLog({
      type: "practice",
      title: "",
      notes: "",
      duration: "",
      linkedItem: ""
    });
    setShowAddLog(false);
  };

  const deleteLog = (logId) => {
    setActivityLog(prev => prev.filter(log => log.id !== logId));
  };

  const addCommitment = () => {
    if (!newCommitment.trim()) return;
    
    const commitment = {
      id: Date.now().toString(),
      text: newCommitment,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setCommitments(prev => [commitment, ...prev]);
    setNewCommitment("");
  };

  const toggleCommitment = (commitmentId) => {
    setCommitments(prev => prev.map(c => 
      c.id === commitmentId ? { ...c, completed: !c.completed } : c
    ));
  };

  const deleteCommitment = (commitmentId) => {
    setCommitments(prev => prev.filter(c => c.id !== commitmentId));
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all activity logs and commitments? This cannot be undone.")) {
      setActivityLog([]);
      setCommitments([]);
    }
  };

  const filteredLogs = logFilter === "all" 
    ? activityLog 
    : activityLog.filter(log => log.type === logFilter);

  const updateHydration = async (delta) => {
    const newGlasses = Math.max(0, hydration.glasses + delta);
    setHydration(prev => ({ ...prev, glasses: newGlasses }));
    try {
      await fetch(`${BACKEND_URL}/api/tracking/hydration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glasses: newGlasses, date: todayISO, goal: hydration.goal }),
      });
    } catch (e) { console.error(e); }
  };

  const logActivityToBackend = async (type) => {
    try {
      await fetch(`${BACKEND_URL}/api/tracking/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, date: todayISO }),
      });
      // Refresh streak
      const res = await fetch(`${BACKEND_URL}/api/tracking/streak`);
      setStreak(await res.json());
    } catch (e) { console.error(e); }
  };

  const morningProgress = isToday ? (dailyProgress.morning?.length || 0) : 0;
  const eveningProgress = isToday ? (dailyProgress.evening?.length || 0) : 0;

  const getLogIcon = (type) => {
    const logType = LOG_TYPES.find(t => t.value === type);
    return logType?.icon || Circle;
  };

  const getLogColor = (type) => {
    const logType = LOG_TYPES.find(t => t.value === type);
    return logType?.color || "text-zinc-400";
  };

  const getLogLink = (type) => {
    const logType = LOG_TYPES.find(t => t.value === type);
    return logType?.link;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-zinc-100">Daily Planner</h1>
          <p className="body-text mt-2">Track practices, log activities, manage commitments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" data-testid="settings-btn">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#18181b] border-zinc-800">
              <DialogHeader>
                <DialogTitle className="heading-4 text-zinc-100">Data Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Auto-delete logs after</label>
                  <Select value={dataRetention} onValueChange={setDataRetention}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {RETENTION_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-zinc-500 mt-2">
                    Activity logs older than this will be automatically deleted.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800">
                  <Button 
                    variant="destructive" 
                    onClick={clearAllData}
                    className="w-full"
                    data-testid="clear-data-btn"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-[#18181b] border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-amber-500/10">
                  <Sun className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Morning</p>
                  <p className="text-lg font-bold text-zinc-100">{morningProgress}/4</p>
                </div>
              </div>
              {morningProgress === 4 && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-indigo-500/10">
                  <Moon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Evening</p>
                  <p className="text-lg font-bold text-zinc-100">{eveningProgress}/4</p>
                </div>
              </div>
              {eveningProgress === 4 && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
          </CardContent>
        </Card>

        {/* Hydration Tracker */}
        <Card className="bg-[#18181b] border-zinc-800" data-testid="hydration-tracker">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-sm bg-blue-500/10">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Hydration</p>
                <p className="text-lg font-bold text-zinc-100">{hydration.glasses}/{hydration.goal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateHydration(-1)} data-testid="hydration-minus">
                <Minus className="w-3 h-3" />
              </Button>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (hydration.glasses / hydration.goal) * 100)}%` }}
                />
              </div>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateHydration(1)} data-testid="hydration-plus">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="bg-[#18181b] border-zinc-800" data-testid="streak-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-orange-500/10">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Streak</p>
                  <p className="text-lg font-bold text-zinc-100">{streak.current_streak} days</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-1">Best: {streak.longest_streak} | Total: {streak.total_days}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-emerald-500/10">
                  <Target className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Commitments</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {commitments.filter(c => c.completed).length}/{commitments.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-red-500/10">
                  <Calendar className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Today's Logs</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {activityLog.filter(log => 
                      new Date(log.timestamp).toDateString() === todayDate
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Practices */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="morning" className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="morning" className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Morning
              </TabsTrigger>
              <TabsTrigger value="evening" className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Evening
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="log" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Activity Log
              </TabsTrigger>
            </TabsList>

            {/* Morning Practices */}
            <TabsContent value="morning" className="mt-4">
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="heading-4 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-amber-500" />
                        {practices?.morning?.name}
                      </CardTitle>
                      <p className="small-text mt-1">{practices?.morning?.description}</p>
                    </div>
                    <Link to="/velnar">
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Vel'nar Study
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {practices?.morning?.practices?.map((practice, idx) => (
                    <div
                      key={idx}
                      data-testid={`morning-practice-${idx}`}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-sm transition-all duration-200",
                        isPracticeCompleted('morning', practice.name)
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                      )}
                    >
                      <Checkbox
                        id={`morning-${idx}`}
                        checked={isPracticeCompleted('morning', practice.name)}
                        onCheckedChange={() => togglePractice('morning', practice.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={`morning-${idx}`} className="text-sm font-medium text-zinc-200 cursor-pointer">
                          {practice.name}
                        </label>
                        <p className="text-xs text-zinc-500 mt-1">{practice.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          <span className="text-xs text-zinc-600">{practice.duration}</span>
                        </div>
                      </div>
                      {isPracticeCompleted('morning', practice.name) && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evening Practices */}
            <TabsContent value="evening" className="mt-4">
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="heading-4 flex items-center gap-2">
                        <Moon className="w-5 h-5 text-indigo-500" />
                        {practices?.evening?.name}
                      </CardTitle>
                      <p className="small-text mt-1">{practices?.evening?.description}</p>
                    </div>
                    <Link to="/meditations">
                      <Button variant="ghost" size="sm" className="text-indigo-400">
                        <Moon className="w-4 h-4 mr-2" />
                        Meditations
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {practices?.evening?.practices?.map((practice, idx) => (
                    <div
                      key={idx}
                      data-testid={`evening-practice-${idx}`}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-sm transition-all duration-200",
                        isPracticeCompleted('evening', practice.name)
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                      )}
                    >
                      <Checkbox
                        id={`evening-${idx}`}
                        checked={isPracticeCompleted('evening', practice.name)}
                        onCheckedChange={() => togglePractice('evening', practice.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={`evening-${idx}`} className="text-sm font-medium text-zinc-200 cursor-pointer">
                          {practice.name}
                        </label>
                        <p className="text-xs text-zinc-500 mt-1">{practice.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          <span className="text-xs text-zinc-600">{practice.duration}</span>
                        </div>
                      </div>
                      {isPracticeCompleted('evening', practice.name) && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weekly Practices */}
            <TabsContent value="weekly" className="mt-4">
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <CardTitle className="heading-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {practices?.weekly?.name}
                  </CardTitle>
                  <p className="small-text">{practices?.weekly?.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {practices?.weekly?.practices?.map((practice, idx) => (
                    <div
                      key={idx}
                      data-testid={`weekly-practice-${idx}`}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-sm transition-all duration-200",
                        isWeeklyCompleted(practice.name)
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                      )}
                    >
                      <Checkbox
                        id={`weekly-${idx}`}
                        checked={isWeeklyCompleted(practice.name)}
                        onCheckedChange={() => toggleWeeklyPractice(practice.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={`weekly-${idx}`} className="text-sm font-medium text-zinc-200 cursor-pointer">
                          {practice.name}
                        </label>
                        <p className="text-xs text-zinc-500 mt-1">{practice.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          <span className="text-xs text-zinc-600">{practice.duration}</span>
                        </div>
                      </div>
                      {isWeeklyCompleted(practice.name) && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Log */}
            <TabsContent value="log" className="mt-4">
              <Card className="bg-[#18181b] border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="heading-4">Activity Log</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={logFilter} onValueChange={setLogFilter}>
                        <SelectTrigger className="w-[140px] h-8 bg-zinc-900 border-zinc-700">
                          <Filter className="w-3 h-3 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="all">All Types</SelectItem>
                          {LOG_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={showAddLog} onOpenChange={setShowAddLog}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="btn-primary" data-testid="add-log-btn">
                            <Plus className="w-4 h-4 mr-1" />
                            Log
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#18181b] border-zinc-800">
                          <DialogHeader>
                            <DialogTitle className="heading-4 text-zinc-100">Log Activity</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <label className="text-sm text-zinc-400 mb-2 block">Type</label>
                              <Select value={newLog.type} onValueChange={(v) => setNewLog(prev => ({ ...prev, type: v }))}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700">
                                  {LOG_TYPES.map(type => {
                                    const Icon = type.icon;
                                    return (
                                      <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                          <Icon className={cn("w-4 h-4", type.color)} />
                                          {type.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm text-zinc-400 mb-2 block">Title</label>
                              <Input
                                value={newLog.title}
                                onChange={(e) => setNewLog(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="What did you do?"
                                className="bg-zinc-900 border-zinc-700"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-zinc-400 mb-2 block">Duration (optional)</label>
                              <Input
                                value={newLog.duration}
                                onChange={(e) => setNewLog(prev => ({ ...prev, duration: e.target.value }))}
                                placeholder="e.g., 30 min"
                                className="bg-zinc-900 border-zinc-700"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-zinc-400 mb-2 block">Notes (optional)</label>
                              <Textarea
                                value={newLog.notes}
                                onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Additional details..."
                                className="bg-zinc-900 border-zinc-700"
                                rows={2}
                              />
                            </div>
                            <Button onClick={handleAddLog} className="w-full btn-primary">
                              Add Log Entry
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px] pr-4">
                    {filteredLogs.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-zinc-500">No activity logs yet.</p>
                        <p className="text-xs text-zinc-600 mt-1">Complete practices or add manual logs.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredLogs.map(log => {
                          const Icon = getLogIcon(log.type);
                          const link = getLogLink(log.type);
                          return (
                            <div key={log.id} className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-sm group">
                              <Icon className={cn("w-4 h-4 mt-0.5", getLogColor(log.type))} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-zinc-200">{log.title}</p>
                                  {log.duration && (
                                    <Badge variant="outline" className="text-xs">{log.duration}</Badge>
                                  )}
                                </div>
                                {log.notes && <p className="text-xs text-zinc-500 mt-1">{log.notes}</p>}
                                <p className="text-xs text-zinc-600 mt-1">
                                  {new Date(log.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {link && (
                                  <Link to={link}>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  </Link>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                  onClick={() => deleteLog(log.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Commitments & Quick Links */}
        <div className="space-y-4">
          {/* Commitments */}
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-pink-500" />
                Commitments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newCommitment}
                  onChange={(e) => setNewCommitment(e.target.value)}
                  placeholder="Add a commitment..."
                  className="bg-zinc-900 border-zinc-700"
                  onKeyPress={(e) => e.key === "Enter" && addCommitment()}
                  data-testid="commitment-input"
                />
                <Button onClick={addCommitment} size="icon" className="btn-primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="h-[200px] pr-4">
                {commitments.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-4">No commitments yet.</p>
                ) : (
                  <div className="space-y-2">
                    {commitments.map(commitment => (
                      <div 
                        key={commitment.id} 
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-sm group",
                          commitment.completed 
                            ? "bg-emerald-500/10 border border-emerald-500/20" 
                            : "bg-zinc-900/50"
                        )}
                      >
                        <Checkbox
                          checked={commitment.completed}
                          onCheckedChange={() => toggleCommitment(commitment.id)}
                          className="mt-0.5"
                        />
                        <p className={cn(
                          "flex-1 text-sm",
                          commitment.completed ? "text-zinc-500 line-through" : "text-zinc-200"
                        )}>
                          {commitment.text}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                          onClick={() => deleteCommitment(commitment.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/meals" className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-sm hover:bg-zinc-800/50 transition-colors">
                <Utensils className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-zinc-300">Today's Meals</span>
                <ExternalLink className="w-3 h-3 ml-auto text-zinc-600" />
              </Link>
              <Link to="/warrior" className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-sm hover:bg-zinc-800/50 transition-colors">
                <Sword className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-zinc-300">Warrior Practices</span>
                <ExternalLink className="w-3 h-3 ml-auto text-zinc-600" />
              </Link>
              <Link to="/velnar" className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-sm hover:bg-zinc-800/50 transition-colors">
                <BookOpen className="w-4 h-4 text-red-500" />
                <span className="text-sm text-zinc-300">Vel'nar Study</span>
                <ExternalLink className="w-3 h-3 ml-auto text-zinc-600" />
              </Link>
              <Link to="/meditations" className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-sm hover:bg-zinc-800/50 transition-colors">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="text-sm text-zinc-300">Meditations</span>
                <ExternalLink className="w-3 h-3 ml-auto text-zinc-600" />
              </Link>
            </CardContent>
          </Card>

          {/* Axiom */}
          <Card className="bg-zinc-900/30 border-zinc-800">
            <CardContent className="p-4 text-center">
              <p className="overline text-red-400 mb-2">Daily Reminder</p>
              <p className="text-sm text-zinc-300 italic">
                "Power from within cannot be revoked."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
