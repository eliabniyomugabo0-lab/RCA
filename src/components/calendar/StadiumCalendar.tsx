import React, { useState, useMemo } from 'react';
import { 
  CalendarEvent, 
  CalendarEventType, 
  User, 
  Task 
} from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Trophy, 
  Wrench, 
  Dumbbell, 
  CheckSquare, 
  Building2, 
  Package, 
  Clock, 
  MapPin, 
  Users, 
  Download, 
  CalendarDays, 
  CalendarRange, 
  ListFilter,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Share2,
  ArrowUpDown
} from 'lucide-react';
import { EventDetailModal } from './EventDetailModal';
import { EventFormModal } from './EventFormModal';
import { downloadIcsFile, downloadAllEventsIcs } from '../../utils/calendarExport';

interface StadiumCalendarProps {
  events: CalendarEvent[];
  tasks: Task[];
  users: User[];
  currentUser: User;
  onAddEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onNavigateToTask?: (taskId: string) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

type CalendarViewMode = 'month' | 'week' | 'agenda';

export const StadiumCalendar: React.FC<StadiumCalendarProps> = ({
  events,
  tasks,
  users,
  currentUser,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onNavigateToTask,
  onShowToast
}) => {
  const { t, translateEvents, translateTasks } = useTranslation();
  // Calendar base date — default to October 2026 (the project's active timeframe) or current
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // If events have October 2026, default to 2026-10-15
    return new Date(2026, 9, 15);
  });

  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [selectedEventType, setSelectedEventType] = useState<CalendarEventType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [includeTasks, setIncludeTasks] = useState(true);

  // Multi-lingual translations for calendar fixtures and tasks
  const displayedEvents = useMemo(() => translateEvents(events), [events, translateEvents]);
  const displayedTasks = useMemo(() => translateTasks(tasks), [tasks, translateTasks]);

  // Selected event for detail drawer/modal
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  // Modal states for creating / editing
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [selectedDateForNewEvent, setSelectedDateForNewEvent] = useState<string>('2026-10-15');

  // Convert tasks to calendar events if includeTasks is enabled
  const mappedTaskEvents = useMemo<CalendarEvent[]>(() => {
    if (!includeTasks) return [];
    return displayedTasks.map(t => ({
      id: `task-evt-${t.id}`,
      title: `[Task] ${t.title}`,
      type: 'TASK_DEADLINE' as CalendarEventType,
      date: t.deadline || t.startDate || '2026-10-15',
      startTime: '09:00',
      endTime: '17:00',
      location: t.department || 'GCS Stadium Grounds',
      description: `Operational task assigned to ${t.assigneeName}.\nPriority: ${t.priority}\nStatus: ${t.status}\n\n${t.description}`,
      organizerOrAssignee: t.assigneeName,
      assigneeId: t.assigneeId,
      priority: t.priority,
      status: t.status === 'APPROVED' ? 'COMPLETED' : t.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'SCHEDULED',
      linkedTaskId: t.id,
      tags: ['Operational Task', t.department, t.priority]
    }));
  }, [displayedTasks, includeTasks]);

  // Combine calendar events + mapped tasks
  const combinedEvents = useMemo(() => {
    return [...displayedEvents, ...mappedTaskEvents];
  }, [displayedEvents, mappedTaskEvents]);

  // Filter events based on active category and search
  const filteredEvents = useMemo(() => {
    return combinedEvents.filter(ev => {
      if (selectedEventType !== 'ALL' && ev.type !== selectedEventType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesLoc = ev.location.toLowerCase().includes(q);
        const matchesTeams = ev.teamsOrParticipants?.toLowerCase().includes(q);
        const matchesAssignee = ev.organizerOrAssignee?.toLowerCase().includes(q);
        const matchesDesc = ev.description?.toLowerCase().includes(q);
        return matchesTitle || matchesLoc || matchesTeams || matchesAssignee || matchesDesc;
      }
      return true;
    });
  }, [combinedEvents, selectedEventType, searchQuery]);

  // Agenda view sort order (Earliest first vs Latest first)
  const [agendaSortAsc, setAgendaSortAsc] = useState(true);

  // Group filtered events by date for chronological agenda view
  const agendaGroupedEvents = useMemo(() => {
    const sorted = [...filteredEvents].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      if (cmp !== 0) return agendaSortAsc ? cmp : -cmp;
      return (a.startTime || '').localeCompare(b.startTime || '');
    });

    const groups: { dateStr: string; formattedDate: string; isToday: boolean; events: CalendarEvent[] }[] = [];
    const dateMap = new Map<string, CalendarEvent[]>();

    for (const ev of sorted) {
      if (!dateMap.has(ev.date)) {
        dateMap.set(ev.date, []);
      }
      dateMap.get(ev.date)!.push(ev);
    }

    dateMap.forEach((evList, dateStr) => {
      const d = new Date(`${dateStr}T00:00:00`);
      const formattedDate = d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      groups.push({
        dateStr,
        formattedDate,
        isToday: dateStr === '2026-10-15',
        events: evList
      });
    });

    return groups;
  }, [filteredEvents, agendaSortAsc]);

  // Date helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const handleToday = () => {
    // Jump to current active October 2026 week or real today
    setCurrentDate(new Date(2026, 9, 15));
  };

  // Month grid calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const lastDayCurrentMonth = new Date(year, month + 1, 0).getDate();
    const lastDayPrevMonth = new Date(year, month, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = lastDayPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-15'
      });
    }

    // Current month days
    for (let d = 1; d <= lastDayCurrentMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        isToday: dateStr === '2026-10-15'
      });
    }

    // Next month filler days to complete a 35 or 42 grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-15'
      });
    }

    return days;
  }, [year, month]);

  // Group events by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of filteredEvents) {
      if (!map[ev.date]) {
        map[ev.date] = [];
      }
      map[ev.date].push(ev);
    }
    // Sort each day's events by time
    for (const d in map) {
      map[d].sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    }
    return map;
  }, [filteredEvents]);

  // Week View calculation: 7 days surrounding currentDate
  const weekDays = useMemo(() => {
    const current = new Date(currentDate);
    const dayOfWeek = current.getDay();
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - dayOfWeek);

    const week: { dateStr: string; dayNum: number; dayName: string; monthName: string; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      week.push({
        dateStr,
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: dateStr === '2026-10-15'
      });
    }
    return week;
  }, [currentDate]);

  // KPI Metrics
  const stats = useMemo(() => {
    const matchCount = combinedEvents.filter(e => e.type === 'MATCH').length;
    const maintenanceCount = combinedEvents.filter(e => e.type === 'PITCH_MAINTENANCE').length;
    const trainingCount = combinedEvents.filter(e => e.type === 'TRAINING').length;
    const taskCount = combinedEvents.filter(e => e.type === 'TASK_DEADLINE').length;
    return {
      total: combinedEvents.length,
      matches: matchCount,
      maintenance: maintenanceCount,
      trainings: trainingCount,
      tasks: taskCount
    };
  }, [combinedEvents]);

  // Handle Event Saving
  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'> & { id?: string }) => {
    if (eventData.id) {
      onUpdateEvent(eventData as CalendarEvent);
      if (onShowToast) {
        onShowToast('success', 'Schedule Updated', `Updated "${eventData.title}" on the stadium calendar`);
      }
    } else {
      const newEv: Omit<CalendarEvent, 'id'> = {
        ...eventData,
        status: 'SCHEDULED'
      };
      onAddEvent(newEv);
      if (onShowToast) {
        onShowToast('success', 'Event Scheduled', `Added "${eventData.title}" to GCS operations calendar`);
      }
    }
    setEventToEdit(null);
  };

  // Type styling configuration
  const getTypeBadgeStyle = (type: CalendarEventType) => {
    switch (type) {
      case 'MATCH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'PITCH_MAINTENANCE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'TRAINING':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30';
      case 'TASK_DEADLINE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'FACILITY_EVENT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30';
      case 'INVENTORY_AUDIT':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600';
    }
  };

  const getTypeIcon = (type: CalendarEventType) => {
    switch (type) {
      case 'MATCH': return Trophy;
      case 'PITCH_MAINTENANCE': return Wrench;
      case 'TRAINING': return Dumbbell;
      case 'TASK_DEADLINE': return CheckSquare;
      case 'FACILITY_EVENT': return Building2;
      case 'INVENTORY_AUDIT': return Package;
      default: return CalendarIcon;
    }
  };

  // Find linked task if active event has one
  const activeLinkedTask = useMemo(() => {
    if (!activeEvent) return null;
    const tId = activeEvent.linkedTaskId || (activeEvent.id.startsWith('task-evt-') ? activeEvent.id.replace('task-evt-', '') : null);
    if (!tId) return null;
    return tasks.find(t => t.id === tId) || null;
  }, [activeEvent, tasks]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4" />
              <span>Gahanga Cricket Stadium Operations Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('nav.calendar', 'Stadium & Fixture Calendar')}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Centralized itinerary for international match fixtures, pitch moisture rolling cycles, high-performance training clinics, and operational task deadlines.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setEventToEdit(null);
                setSelectedDateForNewEvent(currentDate.toISOString().split('T')[0]);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{t('action.schedule_event', 'Schedule Fixture / Event')}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Pulse Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">Total Scheduled</p>
            <p className="text-xl font-bold text-slate-100 mt-0.5">{stats.total}</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Trophy className="w-3.5 h-3.5" />
              <span>Matches</span>
            </div>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{stats.matches}</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Wrench className="w-3.5 h-3.5" />
              <span>Pitch Care</span>
            </div>
            <p className="text-xl font-bold text-emerald-300 mt-0.5">{stats.maintenance}</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Trainings</span>
            </div>
            <p className="text-xl font-bold text-sky-300 mt-0.5">{stats.trainings}</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Task Milestones</span>
            </div>
            <p className="text-xl font-bold text-purple-300 mt-0.5">{stats.tasks}</p>
          </div>
        </div>
      </div>

      {/* Calendar Controls & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Navigation Bar & View Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Month / Period Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={handlePrev}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Previous Period"
                aria-label="Previous Period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Next Period"
                aria-label="Next Period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleToday}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Today (Oct 15)
            </button>

            <span className="text-lg sm:text-xl font-bold text-white tracking-tight ml-2">
              {monthNames[month]} {year}
            </span>
          </div>

          {/* View Mode Switcher (Month / Week / Agenda) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-teal-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Month</span>
              </button>

              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  viewMode === 'week'
                    ? 'bg-teal-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5" />
                <span>Week</span>
              </button>

              <button
                onClick={() => setViewMode('agenda')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  viewMode === 'agenda'
                    ? 'bg-teal-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Agenda</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-800/70">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedEventType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedEventType === 'ALL'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              All Events ({combinedEvents.length})
            </button>

            <button
              onClick={() => setSelectedEventType('MATCH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedEventType === 'MATCH'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Matches ({stats.matches})</span>
            </button>

            <button
              onClick={() => setSelectedEventType('PITCH_MAINTENANCE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedEventType === 'PITCH_MAINTENANCE'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pitch & Turf ({stats.maintenance})</span>
            </button>

            <button
              onClick={() => setSelectedEventType('TRAINING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedEventType === 'TRAINING'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-sky-400" />
              <span>Training ({stats.trainings})</span>
            </button>

            <button
              onClick={() => setSelectedEventType('FACILITY_EVENT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedEventType === 'FACILITY_EVENT'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Stadium / VIP</span>
            </button>

            <button
              onClick={() => setSelectedEventType('INVENTORY_AUDIT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedEventType === 'INVENTORY_AUDIT'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-teal-400" />
              <span>Stores / Audit</span>
            </button>
          </div>

          {/* Search Input & Task Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeTasks}
                onChange={(e) => setIncludeTasks(e.target.checked)}
                className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-950"
              />
              <span className="text-slate-400">Sync Task Deadlines</span>
            </label>

            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fixtures, pitches..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'month' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          {/* Day of week header */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/70 text-center text-xs font-semibold text-slate-400 py-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/80 bg-slate-900">
            {calendarDays.map((day, idx) => {
              const dayEvents = eventsByDate[day.dateStr] || [];

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDateForNewEvent(day.dateStr);
                  }}
                  className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 flex flex-col transition-colors group relative cursor-pointer ${
                    day.isCurrentMonth ? 'bg-slate-900/60 hover:bg-slate-850' : 'bg-slate-950/50 text-slate-600'
                  } ${day.isToday ? 'ring-1 ring-teal-500/50 bg-teal-950/10' : ''}`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                        day.isToday
                          ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                          : day.isCurrentMonth
                          ? 'text-slate-200'
                          : 'text-slate-600'
                      }`}
                    >
                      {day.dayNum}
                    </span>

                    {/* Quick Add Event on this date */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDateForNewEvent(day.dateStr);
                        setEventToEdit(null);
                        setIsFormModalOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 text-slate-500 hover:text-teal-400 rounded-md transition-opacity cursor-pointer"
                      title={`Schedule event for ${day.dateStr}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Events Stack */}
                  <div className="space-y-1 overflow-y-auto flex-1 max-h-[105px] pr-0.5">
                    {dayEvents.slice(0, 3).map(ev => {
                      const Icon = getTypeIcon(ev.type);
                      return (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEvent(ev);
                          }}
                          className={`px-1.5 py-1 rounded-md text-[11px] font-medium border truncate cursor-pointer transition-all flex items-center gap-1 ${getTypeBadgeStyle(
                            ev.type
                          )}`}
                          title={`${ev.title} (${ev.startTime || 'All day'})`}
                        >
                          <Icon className="w-3 h-3 shrink-0" />
                          <span className="truncate">{ev.title}</span>
                        </div>
                      );
                    })}

                    {dayEvents.length > 3 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDate(new Date(`${day.dateStr}T00:00:00`));
                          setViewMode('agenda');
                        }}
                        className="w-full text-center py-0.5 text-[10px] font-semibold text-slate-400 hover:text-teal-400 bg-slate-800/60 rounded cursor-pointer transition-colors"
                      >
                        +{dayEvents.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week Timeline View */}
      {viewMode === 'week' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {weekDays.map((day, idx) => {
              const dayEvents = eventsByDate[day.dateStr] || [];

              return (
                <div 
                  key={idx} 
                  className={`min-h-[380px] p-3 flex flex-col group relative ${
                    day.isToday ? 'bg-teal-950/15' : 'bg-slate-900'
                  }`}
                >
                  <div className="pb-3 border-b border-slate-800/80 mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        {day.dayName}
                      </p>
                      <p className={`text-base font-bold ${day.isToday ? 'text-teal-400' : 'text-slate-100'}`}>
                        {day.dayNum} {day.monthName}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDateForNewEvent(day.dateStr);
                        setEventToEdit(null);
                        setIsFormModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      title="Add event on this day"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {dayEvents.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic text-center py-8">
                        No events
                      </p>
                    ) : (
                      dayEvents.map(ev => {
                        const Icon = getTypeIcon(ev.type);
                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveEvent(ev);
                            }}
                            className={`p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all space-y-1 ${getTypeBadgeStyle(
                              ev.type
                            )}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="flex items-center gap-1 font-semibold text-[11px]">
                                <Icon className="w-3 h-3" />
                                {ev.startTime || 'Day'}
                              </span>
                              {ev.priority && (
                                <span className="text-[9px] uppercase px-1 rounded bg-black/30 font-bold">
                                  {ev.priority}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-white leading-tight line-clamp-2">
                              {ev.title}
                            </p>
                            <p className="text-[10px] text-slate-300 truncate">
                              📍 {ev.location}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda / Detailed Chronological View */}
      {viewMode === 'agenda' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-teal-400" />
                <span>Chronological Stadium Agenda</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {filteredEvents.length} scheduled fixtures and operations grouped by date
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAgendaSortAsc(!agendaSortAsc)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Toggle sort order"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-teal-400" />
                <span>{agendaSortAsc ? 'Earliest First' : 'Latest First'}</span>
              </button>

              <button
                onClick={() => {
                  downloadAllEventsIcs(filteredEvents, 'GCS_Stadium_Itinerary.ics');
                  if (onShowToast) {
                    onShowToast('success', 'Calendar Exported', `Downloaded ${filteredEvents.length} events as .ics`);
                  }
                }}
                disabled={filteredEvents.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                title="Download full schedule as standard iCalendar .ics file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.ics)</span>
              </button>
            </div>
          </div>

          {agendaGroupedEvents.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No scheduled events found</p>
              <p className="text-xs text-slate-500">
                Try clearing your search query or adjusting the category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {agendaGroupedEvents.map((group) => (
                <div key={group.dateStr} className="space-y-3">
                  {/* Date Group Banner */}
                  <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/90 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${group.isToday ? 'bg-teal-400 ring-2 ring-teal-400/30' : 'bg-slate-600'}`}></div>
                      <span className="text-sm font-bold text-white tracking-tight">
                        {group.formattedDate}
                      </span>
                      {group.isToday && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold uppercase">
                          Today
                        </span>
                      )}
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDateForNewEvent(group.dateStr);
                        setEventToEdit(null);
                        setIsFormModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
                      title={`Add event on ${group.formattedDate}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to this Day</span>
                    </button>
                  </div>

                  {/* Event cards under this date */}
                  <div className="space-y-2.5 pl-2 sm:pl-3 border-l-2 border-slate-800/80">
                    {group.events.map((ev) => {
                      const Icon = getTypeIcon(ev.type);

                      return (
                        <div
                          key={ev.id}
                          onClick={() => setActiveEvent(ev)}
                          className="p-4 bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-slate-700 shadow-xs"
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div className={`p-3 rounded-xl border shrink-0 ${getTypeBadgeStyle(ev.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-mono font-semibold text-teal-400">
                                  {ev.startTime ? `${ev.startTime} - ${ev.endTime || 'End'}` : 'All Day'}
                                </span>
                                <span className="text-slate-500 text-xs">·</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getTypeBadgeStyle(ev.type)}`}>
                                  {ev.type.replace('_', ' ')}
                                </span>
                                {ev.priority && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                                    ev.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                    ev.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                    'bg-slate-800 text-slate-300 border-slate-700'
                                  }`}>
                                    {ev.priority}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                                {ev.title}
                              </h3>

                              {ev.description && (
                                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed max-w-2xl">
                                  {ev.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span>{ev.location}</span>
                                </span>
                                {ev.teamsOrParticipants && (
                                  <span className="flex items-center gap-1 text-indigo-300 font-medium">
                                    <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span>{ev.teamsOrParticipants}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right side quick actions */}
                          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadIcsFile(ev);
                              }}
                              className="p-2 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Download .ics file"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveEvent(ev);
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event Details Drawer/Modal */}
      <EventDetailModal
        isOpen={Boolean(activeEvent)}
        onClose={() => setActiveEvent(null)}
        event={activeEvent}
        currentUser={currentUser}
        onEditEvent={(ev) => {
          setEventToEdit(ev);
          setActiveEvent(null);
          setIsFormModalOpen(true);
        }}
        onDeleteEvent={(id) => {
          onDeleteEvent(id);
          setActiveEvent(null);
        }}
        onUpdateStatus={(id, st) => {
          if (activeEvent && activeEvent.id === id) {
            const updated = { ...activeEvent, status: st };
            setActiveEvent(updated);
            onUpdateEvent(updated);
          }
        }}
        onNavigateToTask={onNavigateToTask}
        linkedTask={activeLinkedTask}
        onShowToast={onShowToast}
      />

      {/* Event Create / Edit Modal */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEventToEdit(null);
        }}
        onSaveEvent={handleSaveEvent}
        initialEvent={eventToEdit}
        initialDate={selectedDateForNewEvent}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
};
