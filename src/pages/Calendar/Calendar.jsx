// src/pages/Calendar/Calendar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

const CalendarPage = () => {
  const { tasks } = useTasks();
  const [now, setNow] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local', []);
  const today = now;
  const tomorrow = useMemo(() => {
    const next = new Date(today);
    next.setDate(today.getDate() + 1);
    return next;
  }, [today]);

  const parseTaskDue = (task) => {
    const raw = String(task?.deadline || '').trim();
    if (!raw) return null;

    const base = new Date(today);
    base.setSeconds(0, 0);

    const timeFromText = (text) => {
      const match = text.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return null;
      return `${match[1]}:${match[2]} ${match[3].toUpperCase()}`;
    };

    const assignTime = (target, timeLabel) => {
      if (!timeLabel) return target;
      const match = timeLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return target;
      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const meridiem = match[3].toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      const next = new Date(target);
      next.setHours(hours, minutes, 0, 0);
      return next;
    };

    if (/^today\b/i.test(raw)) {
      const timeLabel = timeFromText(raw);
      return { date: assignTime(base, timeLabel), timeLabel };
    }

    if (/tomorrow/i.test(raw)) {
      const next = new Date(base);
      next.setDate(base.getDate() + 1);
      const timeLabel = timeFromText(raw);
      return { date: assignTime(next, timeLabel), timeLabel };
    }

    const compact = raw.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    const match = compact.match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{1,2}:\d{2}\s*(?:AM|PM))$/i);
    if (match) {
      const day = Number(match[1]);
      const monthStr = match[2].toUpperCase();
      const timeLabel = match[3].toUpperCase();
      const monthIndex = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(
        monthStr
      );
      if (monthIndex >= 0) {
        const candidate = new Date(today.getFullYear(), monthIndex, day, 0, 0, 0, 0);
        const withTime = assignTime(candidate, timeLabel);
        return { date: withTime, timeLabel };
      }
    }

    return null;
  };

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const monthStart = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);
  const monthEnd = useMemo(() => new Date(viewYear, viewMonth + 1, 0), [viewYear, viewMonth]);
  const startDayIndex = monthStart.getDay();
  const daysInMonthCount = monthEnd.getDate();
  const daysGrid = useMemo(
    () => Array.from({ length: daysInMonthCount }, (_, i) => i + 1),
    [daysInMonthCount]
  );

  const events = useMemo(() => {
    return tasks
      .map((t) => {
        const parsed = parseTaskDue(t);
        if (!parsed) return null;
        const { date, timeLabel } = parsed;
        return {
          id: t.id,
          title: t.name,
          date,
          timeLabel: timeLabel || (t.scheduledTime ? String(t.scheduledTime) : ''),
          priority: t.priority || 'Medium',
          status: t.status || 'To Do',
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [tasks, today]);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    events.forEach((ev) => {
      if (ev.date.getFullYear() !== viewYear || ev.date.getMonth() !== viewMonth) return;
      const key = ev.date.getDate();
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    });
    return map;
  }, [events, viewYear, viewMonth]);

  const agenda = useMemo(() => {
    const selectedStart = new Date(selectedDate);
    selectedStart.setHours(0, 0, 0, 0);
    const selectedEnd = new Date(selectedStart);
    selectedEnd.setDate(selectedEnd.getDate() + 1);
    return events.filter((ev) => ev.date >= selectedStart && ev.date < selectedEnd);
  }, [events, selectedDate]);

  const monthLabel = useMemo(() => {
    return viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }, [viewDate]);

  const nowLabel = useMemo(() => {
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `${date} · ${time} (${tz})`;
  }, [now, tz]);

  return (
    <div className="space-y-6">
      
      {/* 📅 Top Control Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/10 pb-5">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Calendar</h2>
          <p className="text-xs text-gray-400 mt-1">Track your tasks and deadlines visually.</p>
        </div>

        <div className="flex items-center space-x-3 glass-card p-1.5 rounded-lg border-purple-500/20">
          <button
            onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-gray-200 px-2 uppercase tracking-wider">{monthLabel}</span>
          <button
            onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🚀 Main Core Calendar Matrix Splitting Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Days Grid Blocks */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <CalIcon className="w-4 h-4 text-indigo-400" />
              <span>{nowLabel}</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-bold">
              <span className="text-indigo-400">{today.getDate()} Today</span>
              <span className="text-gray-700">•</span>
              <span className="text-gray-400">{tomorrow.getDate()} Tomorrow</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center mb-4">
            {daysOfWeek.map(day => (
              <span key={day} className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDayIndex }, (_, idx) => (
              <div key={`pad-${idx}`} className="bg-transparent rounded-xl p-2 h-20"></div>
            ))}
            
            {daysGrid.map(day => {
              const currentDate = new Date(viewYear, viewMonth, day);
              const isToday =
                day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isTomorrow =
                day === tomorrow.getDate() && viewMonth === tomorrow.getMonth() && viewYear === tomorrow.getFullYear();
              const isSelected =
                currentDate.toDateString() === selectedDate.toDateString();
              const dayEvents = eventsByDay.get(day) || [];
              
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => setSelectedDate(currentDate)}
                  className={`border rounded-xl p-2 h-20 flex flex-col justify-between transition-all duration-150 text-left ${
                    isSelected
                      ? 'glass-card border-purple-500/40 shadow-lg shadow-purple-500/10'
                      : isToday
                        ? 'glass-card border-purple-500/30 shadow-md'
                        : isTomorrow
                          ? 'glass-card border-amber-500/20'
                          : 'glass-card border-gray-700/50 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-indigo-400' : isTomorrow ? 'text-amber-400' : 'text-gray-400'}`}>
                      {day}
                    </span>
                    {isToday ? (
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Today</span>
                    ) : isTomorrow ? (
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Tomorrow</span>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map(ev => (
                      <div key={ev.id} className="w-full h-1.5 rounded-full bg-indigo-500/60"></div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Micro Task Aligner Cards */}
        <div className="glass-card p-5 rounded-2xl h-fit border-purple-500/20">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Agenda Matrix (Next 7 Days)</h3>
          <div className="space-y-3">
            {agenda.length === 0 ? (
              <div className="text-xs text-gray-500 font-semibold py-6 text-center">No upcoming items found.</div>
            ) : (
              agenda.map((ev) => (
              <div
                key={ev.id}
                className={`p-3 rounded-xl glass-card border-l-4 border-t border-b border-r ${
                  ev.priority === 'High'
                    ? 'border-rose-500/30 text-rose-300'
                    : ev.priority === 'Low'
                      ? 'border-emerald-500/30 text-emerald-300'
                      : 'border-amber-500/30 text-amber-300'
                }`}
              >
                <h4 className="text-xs font-bold line-clamp-1">{ev.title}</h4>
                <div className="flex items-center space-x-2 text-[10px] opacity-70 mt-1.5 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>
                    {ev.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}{' '}
                    {ev.timeLabel ? `· ${ev.timeLabel}` : ''}
                  </span>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CalendarPage;
