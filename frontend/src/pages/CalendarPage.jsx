import React, { useState, useEffect } from "react";
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  X,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useImperiumApp } from "@/lib/useImperiumApp";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

const EVENT_TYPES = [
  { value: "practice", label: "Daily Practice", color: "bg-amber-500" },
  { value: "warrior", label: "Warrior Training", color: "bg-blue-500" },
  { value: "rite", label: "Rite/Ceremony", color: "bg-red-500" },
  { value: "meal", label: "Meal Planning", color: "bg-emerald-500" },
  { value: "meditation", label: "Meditation", color: "bg-indigo-500" },
  { value: "other", label: "Other", color: "bg-zinc-500" },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useLocalStorage("calendar_events", []);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "practice",
    time: "",
    date: new Date().toISOString()
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Pad start of month
  const startDay = startOfMonth(currentMonth).getDay();
  const paddedDays = Array(startDay).fill(null).concat(days);

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const addEvent = () => {
    if (!newEvent.title.trim()) return;

    const event = {
      ...newEvent,
      id: Date.now().toString(),
      date: selectedDate.toISOString()
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: "",
      description: "",
      type: "practice",
      time: "",
      date: new Date().toISOString()
    });
    setShowAddEvent(false);
  };

  const removeEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const getEventTypeColor = (type) => {
    return EVENT_TYPES.find(t => t.value === type)?.color || "bg-zinc-500";
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-zinc-100">Calendar</h1>
          <p className="body-text mt-2">Track your practices, ceremonies, and milestones</p>
        </div>
        <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="add-event-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#18181b] border-zinc-800">
            <DialogHeader>
              <DialogTitle className="heading-4 text-zinc-100">Add Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Title</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                  className="bg-zinc-900 border-zinc-700"
                  data-testid="event-title-input"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Type</label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", type.color)} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Time (optional)</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="bg-zinc-900 border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Description (optional)</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Event details"
                  className="bg-zinc-900 border-zinc-700"
                  rows={3}
                />
              </div>
              <Button onClick={addEvent} className="w-full btn-primary" data-testid="save-event-btn">
                Add Event for {format(selectedDate, "MMM d, yyyy")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={previousMonth} data-testid="prev-month-btn">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="heading-4">
                  {format(currentMonth, "MMMM yyyy")}
                </CardTitle>
                <Button variant="ghost" onClick={nextMonth} data-testid="next-month-btn">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center text-xs text-zinc-500 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {paddedDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="h-24" />;
                  }

                  const dayEvents = getEventsForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                      className={cn(
                        "h-24 p-2 text-left border transition-all duration-200 rounded-sm",
                        isSelected
                          ? "bg-red-600/10 border-red-600/50"
                          : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700",
                        isToday && !isSelected && "border-amber-500/50"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        isToday ? "text-amber-500" : "text-zinc-300"
                      )}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs px-1 py-0.5 rounded truncate text-white",
                              getEventTypeColor(event.type)
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-zinc-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Day Events */}
        <div className="space-y-4">
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="heading-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-red-500" />
                {format(selectedDate, "EEEE, MMMM d")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-zinc-500">No events scheduled</p>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddEvent(true)}
                    className="mt-2 text-red-400"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 bg-zinc-900/50 rounded-sm border border-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2",
                            getEventTypeColor(event.type)
                          )} />
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{event.title}</p>
                            {event.time && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </div>
                            )}
                            {event.description && (
                              <p className="text-xs text-zinc-400 mt-2">{event.description}</p>
                            )}
                            <Badge variant="outline" className="mt-2 text-xs">
                              {EVENT_TYPES.find(t => t.value === event.type)?.label}
                            </Badge>
                          </div>
                        </div>
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="text-zinc-500 hover:text-zinc-300"
                          data-testid={`remove-event-${event.id}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Type Legend */}
          <Card className="bg-[#18181b] border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm text-zinc-400">Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {EVENT_TYPES.map(type => (
                  <div key={type.value} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", type.color)} />
                    <span className="text-sm text-zinc-300">{type.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-zinc-900/30 border-zinc-800">
            <CardContent className="p-4">
              <p className="overline text-zinc-500 mb-3">This Month</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-zinc-900/50 rounded-sm">
                  <p className="text-2xl font-bold text-zinc-200">
                    {events.filter(e => isSameMonth(new Date(e.date), currentMonth)).length}
                  </p>
                  <p className="text-xs text-zinc-500">Events</p>
                </div>
                <div className="text-center p-2 bg-zinc-900/50 rounded-sm">
                  <p className="text-2xl font-bold text-zinc-200">
                    {events.filter(e => 
                      isSameMonth(new Date(e.date), currentMonth) && 
                      e.type === "practice"
                    ).length}
                  </p>
                  <p className="text-xs text-zinc-500">Practices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Holy Days */}
      <HolyDays />
    </div>
  );
}

function HolyDays() {
  const { content } = useImperiumApp();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-4" data-testid="holy-days">
      <h2 className="heading-3 text-zinc-100 flex items-center gap-2">
        <Crown className="w-5 h-5 text-red-500" />
        Holy Days of the Imperium
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {content.holyDays.map((day) => (
          <Card key={day.id} className="bg-[#18181b] border-zinc-800" data-testid={`holy-day-${day.id}`}>
            <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === day.id ? null : day.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-100">{day.title}</p>
                  <p className="text-xs text-red-400 mt-0.5">{day.date} | {day.function}</p>
                </div>
                {expanded === day.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
              </div>
              <p className="text-xs text-zinc-500 mt-2">{day.mood}</p>
            </div>
            {expanded === day.id && (
              <CardContent className="pt-0 space-y-4 border-t border-zinc-800">
                <div className="p-3 bg-zinc-900/50 rounded-sm mt-3">
                  <p className="text-xs text-zinc-500 font-medium mb-1">Meaning</p>
                  <p className="text-sm text-zinc-300">{day.meaning}</p>
                </div>

                {day.preparation?.length > 0 && (
                  <div>
                    <p className="text-xs text-amber-400 font-medium mb-2">Preparation</p>
                    <div className="space-y-1">
                      {day.preparation.map((p, i) => (
                        <p key={i} className="text-xs text-zinc-300 pl-3 relative before:content-[''] before:w-1 before:h-1 before:bg-amber-500 before:rounded-full before:absolute before:left-0 before:top-1.5">{p}</p>
                      ))}
                    </div>
                  </div>
                )}

                {day.primaryRite?.length > 0 && (
                  <div>
                    <p className="text-xs text-red-400 font-medium mb-2">Primary Rite</p>
                    <ol className="space-y-1">
                      {day.primaryRite.map((step, i) => (
                        <li key={i} className="text-xs text-zinc-300 pl-5 relative">
                          <span className="absolute left-0 text-red-400 font-mono">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {day.lawfulWays?.length > 0 && (
                  <div>
                    <p className="text-xs text-emerald-400 font-medium mb-2">Four Lawful Ways to Observe</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {day.lawfulWays.map((way, i) => (
                        <div key={i} className="p-2 bg-zinc-900/50 rounded-sm border-l-2 border-red-600">
                          <p className="text-xs text-zinc-200">{way}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
