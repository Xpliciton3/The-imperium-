import React, { useState, useEffect, useRef } from "react";
import { 
  Moon, 
  Play, 
  Pause, 
  RotateCcw,
  Wind,
  Eye,
  Flame,
  Heart,
  Volume2,
  VolumeX
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const meditationIcons = {
  "Breath": Wind,
  "Body": Heart,
  "Focus": Eye,
  "Stillness": Moon,
  "Movement": Play,
  "Affirmation": Flame,
  "Self": Eye
};

export default function Meditations() {
  const [meditations, setMeditations] = useState([]);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [timerDuration, setTimerDuration] = useState(5 * 60); // 5 minutes default
  const [timeRemaining, setTimeRemaining] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/practices/meditations`)
      .then(r => r.json())
      .then(data => setMeditations(data.meditations || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled) {
              playBell();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, soundEnabled]);

  const playBell = () => {
    // Simple bell sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 528; // Healing frequency
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const selectMeditation = (meditation) => {
    setSelectedMeditation(meditation);
    // Parse duration (e.g., "5-10 min" -> 5 minutes)
    const match = meditation.duration.match(/(\d+)/);
    if (match) {
      const mins = parseInt(match[1]) * 60;
      setTimerDuration(mins);
      setTimeRemaining(mins);
    }
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(timerDuration);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(timerDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustDuration = (value) => {
    const newDuration = value[0] * 60;
    setTimerDuration(newDuration);
    if (!isRunning) {
      setTimeRemaining(newDuration);
    }
  };

  const progress = ((timerDuration - timeRemaining) / timerDuration) * 100;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div 
        className="relative h-48 rounded-sm overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1769133755091-945858d2073b?w=1200)` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-center p-8">
          <p className="overline text-indigo-400 mb-2">Contemplative Architecture</p>
          <h1 className="heading-2 text-zinc-100">Meditations</h1>
          <p className="body-text mt-2 max-w-xl">
            Practices for the Ni-dominant mind. Stillness, focus, and presence.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="heading-4">
                  {selectedMeditation ? selectedMeditation.name : "Select a Meditation"}
                </CardTitle>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 text-zinc-400 hover:text-zinc-200"
                  data-testid="toggle-sound-btn"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
              {selectedMeditation && (
                <p className="text-sm text-zinc-400">{selectedMeditation.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Timer Display */}
              <div className="text-center py-12">
                <div 
                  className={cn(
                    "inline-flex items-center justify-center w-64 h-64 rounded-full border-4 transition-all duration-300",
                    isRunning 
                      ? "border-red-500 bg-red-500/5" 
                      : "border-zinc-700 bg-zinc-900/50"
                  )}
                  style={{
                    background: isRunning 
                      ? `conic-gradient(#dc2626 ${progress}%, transparent ${progress}%)`
                      : undefined
                  }}
                >
                  <div className="w-56 h-56 rounded-full bg-[#18181b] flex items-center justify-center">
                    <span className="text-6xl font-mono text-zinc-100">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Duration</span>
                  <span className="text-sm text-zinc-300">{timerDuration / 60} minutes</span>
                </div>
                <Slider
                  value={[timerDuration / 60]}
                  onValueChange={adjustDuration}
                  min={1}
                  max={60}
                  step={1}
                  disabled={isRunning}
                  className="w-full"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetTimer}
                  disabled={!selectedMeditation}
                  data-testid="reset-timer-btn"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={toggleTimer}
                  disabled={!selectedMeditation}
                  data-testid="start-practice"
                  className={cn(
                    "w-32",
                    isRunning ? "bg-amber-600 hover:bg-amber-500" : "btn-primary"
                  )}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </div>

              {/* Axiom during meditation */}
              {isRunning && (
                <div className="text-center pt-4 border-t border-zinc-800">
                  <p className="text-sm text-zinc-500 italic animate-pulse">
                    "Power from within cannot be revoked."
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Meditation List */}
        <div>
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4">Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {meditations.map((med, idx) => {
                    const Icon = meditationIcons[med.category] || Moon;
                    const isSelected = selectedMeditation?.name === med.name;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => selectMeditation(med)}
                        data-testid={`meditation-${med.name.toLowerCase().replace(/\s/g, '-')}`}
                        className={cn(
                          "w-full text-left p-4 rounded-sm border transition-all duration-200",
                          isSelected
                            ? "bg-red-600/10 border-red-600/50"
                            : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-sm",
                            isSelected ? "bg-red-600/20 text-red-500" : "bg-zinc-800 text-zinc-400"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-200">{med.name}</p>
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{med.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-zinc-600">{med.duration}</span>
                              <span className="text-xs text-zinc-700">•</span>
                              <span className="text-xs text-zinc-600">{med.category}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evening Contemplation Guide */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-6">
          <p className="overline text-indigo-400 mb-4">Evening Contemplation</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900/50 rounded-sm">
              <p className="text-sm font-medium text-zinc-200 mb-2">First Question</p>
              <p className="text-xs text-zinc-400 italic">"What did I build today?"</p>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-sm">
              <p className="text-sm font-medium text-zinc-200 mb-2">Second Question</p>
              <p className="text-xs text-zinc-400 italic">"What did I learn today?"</p>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-sm">
              <p className="text-sm font-medium text-zinc-200 mb-2">Third Question</p>
              <p className="text-xs text-zinc-400 italic">"What will I do differently tomorrow?"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
