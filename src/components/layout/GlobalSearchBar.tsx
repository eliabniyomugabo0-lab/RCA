import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  CheckSquare, 
  Package, 
  Users, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Tag, 
  Sparkles,
  User as UserIcon,
  Shield,
  Layers,
  Calendar as CalendarIcon,
  Trophy
} from 'lucide-react';
import { Task, InventoryItem, User, TaskPriority, TaskStatus, CalendarEvent } from '../../types';
import { NavSection } from './Sidebar';
import { useTranslation } from '../../context/LanguageContext';

export interface GlobalSearchBarProps {
  tasks?: Task[];
  inventory?: InventoryItem[];
  staff?: User[];
  events?: CalendarEvent[];
  onSelectTask?: (task: Task) => void;
  onSelectInventoryItem?: (item: InventoryItem) => void;
  onSelectStaffUser?: (user: User) => void;
  onSelectCalendarEvent?: (event: CalendarEvent) => void;
  onNavigateSection?: (section: NavSection) => void;
}

type SearchCategory = 'ALL' | 'TASKS' | 'CALENDAR' | 'INVENTORY' | 'STAFF';

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  tasks = [],
  inventory = [],
  staff = [],
  events = [],
  onSelectTask,
  onSelectInventoryItem,
  onSelectStaffUser,
  onSelectCalendarEvent,
  onNavigateSection
}) => {
  const { t, translateTasks, translateInventory, translateEvents } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('ALL');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Multi-lingual translations for search dataset
  const displayedTasks = translateTasks(tasks);
  const displayedInventory = translateInventory(inventory);
  const displayedEvents = translateEvents(events);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd/Ctrl + K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        if (window.innerWidth < 768) {
          setIsMobileOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 50);
        } else {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMobileOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter calculations
  const query = searchQuery.trim().toLowerCase();

  const matchingTasks = query
    ? displayedTasks.filter((t) => {
        return (
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query)) ||
          (t.instructions && t.instructions.toLowerCase().includes(query)) ||
          (t.assigneeName && t.assigneeName.toLowerCase().includes(query)) ||
          (t.department && t.department.toLowerCase().includes(query)) ||
          t.status.toLowerCase().includes(query) ||
          t.priority.toLowerCase().includes(query)
        );
      })
    : [];

  const matchingInventory = query
    ? displayedInventory.filter((i) => {
        return (
          i.name.toLowerCase().includes(query) ||
          i.sku.toLowerCase().includes(query) ||
          i.category.toLowerCase().includes(query) ||
          (i.location && i.location.toLowerCase().includes(query)) ||
          (i.description && i.description.toLowerCase().includes(query)) ||
          (i.brand && i.brand.toLowerCase().includes(query)) ||
          i.type.toLowerCase().includes(query)
        );
      })
    : [];

  const matchingStaff = query
    ? staff.filter((u) => {
        return (
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.department && u.department.toLowerCase().includes(query)) ||
          (u.positionName && u.positionName.toLowerCase().includes(query)) ||
          (u.phone && u.phone.toLowerCase().includes(query)) ||
          u.role.toLowerCase().includes(query)
        );
      })
    : [];

  const matchingEvents = query
    ? (displayedEvents || []).filter((e) => {
        return (
          e.title.toLowerCase().includes(query) ||
          e.location.toLowerCase().includes(query) ||
          (e.teamsOrParticipants && e.teamsOrParticipants.toLowerCase().includes(query)) ||
          (e.organizerOrAssignee && e.organizerOrAssignee.toLowerCase().includes(query)) ||
          (e.description && e.description.toLowerCase().includes(query)) ||
          e.type.toLowerCase().includes(query)
        );
      })
    : [];

  const totalResults = matchingTasks.length + matchingEvents.length + matchingInventory.length + matchingStaff.length;

  const handleTaskClick = (task: Task) => {
    setIsOpen(false);
    setIsMobileOpen(false);
    if (onSelectTask) {
      onSelectTask(task);
    } else if (onNavigateSection) {
      onNavigateSection('tasks');
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setIsOpen(false);
    setIsMobileOpen(false);
    if (onSelectCalendarEvent) {
      onSelectCalendarEvent(event);
    } else if (onNavigateSection) {
      onNavigateSection('calendar');
    }
  };

  const handleInventoryClick = (item: InventoryItem) => {
    setIsOpen(false);
    setIsMobileOpen(false);
    if (onSelectInventoryItem) {
      onSelectInventoryItem(item);
    } else if (onNavigateSection) {
      onNavigateSection('inventory');
    }
  };

  const handleStaffClick = (user: User) => {
    setIsOpen(false);
    setIsMobileOpen(false);
    if (onSelectStaffUser) {
      onSelectStaffUser(user);
    } else if (onNavigateSection) {
      onNavigateSection('directory');
    }
  };

  const commonSuggestions = [
    'ICC T20',
    'Pitch Preparation',
    'Match Balls',
    'Hagenimana',
    'Heavy Roller',
    'Boundary Ropes',
    'Academy Coaching'
  ];

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Urgent</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">Med</span>;
      case 'LOW':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-slate-300">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300">Approved</span>;
      case 'SUBMITTED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300">Submitted</span>;
      case 'IN_PROGRESS':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/20 text-cyan-300">In Progress</span>;
      case 'ASSIGNED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-300">Assigned</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-slate-300">{status}</span>;
    }
  };

  // Render search results dropdown content
  const renderDropdownContent = () => (
    <div className="flex flex-col max-h-[75vh]">
      {/* Category Filter Tabs */}
      {query && (
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800 bg-slate-950/60 overflow-x-auto text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'ALL'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>All Results</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/80 font-mono">
              {totalResults}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('TASKS')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'TASKS'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tasks</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/80 font-mono">
              {matchingTasks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('CALENDAR')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'CALENDAR'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/80 font-mono">
              {matchingEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('INVENTORY')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'INVENTORY'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/80 font-mono">
              {matchingInventory.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('STAFF')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'STAFF'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/80 font-mono">
              {matchingStaff.length}
            </span>
          </button>
        </div>
      )}

      {/* Main Results / Suggestions List */}
      <div className="overflow-y-auto p-2 space-y-4 flex-1">
        {/* State A: Empty query => show suggestions and shortcuts */}
        {!query && (
          <div className="p-3 space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Suggested Operational Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonSuggestions.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      inputRef.current?.focus();
                      mobileInputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 hover:text-teal-300 border border-slate-700/80 text-xs text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Navigation Jumps
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsMobileOpen(false);
                    onNavigateSection?.('tasks');
                  }}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-teal-400 mb-1">
                    <CheckSquare className="w-4 h-4" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300">Tasks</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Groundskeeper workflows</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsMobileOpen(false);
                    onNavigateSection?.('calendar');
                  }}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-indigo-400 mb-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">Calendar</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Fixtures & pitch schedule</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsMobileOpen(false);
                    onNavigateSection?.('inventory');
                  }}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">Inventory</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Stadium kit & stocks</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsMobileOpen(false);
                    onNavigateSection?.('directory');
                  }}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">Staff</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Operational staff dossiers</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State B: Non-empty query with 0 results */}
        {query && totalResults === 0 && (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">No matching operational records found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No tasks, inventory items, or staff members match <span className="text-teal-400 font-mono">"{searchQuery}"</span>.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* State C: Non-empty query with matches */}
        {query && totalResults > 0 && (
          <div className="space-y-4">
            {/* Tasks Section */}
            {(activeCategory === 'ALL' || activeCategory === 'TASKS') && matchingTasks.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-1.5">
                  <span className="flex items-center gap-1.5 text-teal-400">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Tasks ({matchingTasks.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsMobileOpen(false);
                      onNavigateSection?.('tasks');
                    }}
                    className="text-[10px] text-slate-400 hover:text-teal-300 lowercase cursor-pointer"
                  >
                    open in tasks &rarr;
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {matchingTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 hover:border-teal-500/40 transition-colors cursor-pointer group flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                            {task.title}
                          </span>
                          {getPriorityBadge(task.priority)}
                          {getStatusBadge(task.status)}
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          {task.assigneeName && (
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3 text-slate-400" />
                              <span>{task.assigneeName}</span>
                            </span>
                          )}
                          {task.department && (
                            <span>{task.department}</span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Events Section */}
            {(activeCategory === 'ALL' || activeCategory === 'CALENDAR') && matchingEvents.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-1.5">
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Fixtures & Calendar ({matchingEvents.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsMobileOpen(false);
                      onNavigateSection?.('calendar');
                    }}
                    className="text-[10px] text-slate-400 hover:text-indigo-300 lowercase cursor-pointer"
                  >
                    open calendar &rarr;
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {matchingEvents.slice(0, 5).map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => handleEventClick(evt)}
                      className="p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 transition-colors cursor-pointer group flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                            {evt.title}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            evt.type === 'MATCH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            evt.type === 'PITCH_MAINTENANCE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            evt.type === 'TRAINING' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {evt.type.replace('_', ' ')}
                          </span>
                        </div>

                        {evt.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {evt.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-slate-300">
                            <Clock className="w-2.5 h-2.5 text-indigo-400" />
                            <span>{evt.date} {evt.startTime ? `· ${evt.startTime}` : ''}</span>
                          </span>
                          {evt.location && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 text-slate-500" />
                              <span>{evt.location}</span>
                            </span>
                          )}
                          {evt.teamsOrParticipants && (
                            <span className="text-teal-400/90 truncate max-w-[150px]">
                              {evt.teamsOrParticipants}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Section */}
            {(activeCategory === 'ALL' || activeCategory === 'INVENTORY') && matchingInventory.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-1.5">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Package className="w-3.5 h-3.5" />
                    <span>Inventory Items ({matchingInventory.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsMobileOpen(false);
                      onNavigateSection?.('inventory');
                    }}
                    className="text-[10px] text-slate-400 hover:text-emerald-300 lowercase cursor-pointer"
                  >
                    open in inventory &rarr;
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {matchingInventory.slice(0, 5).map((item) => {
                    const isLowStock = item.availableQuantity <= item.reorderThreshold;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleInventoryClick(item)}
                        className="p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/40 transition-colors cursor-pointer group flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                              {item.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                              {item.sku}
                            </span>
                            {isLowStock && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Low Stock</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-slate-400">
                            <span className="text-slate-300">
                              Qty: <strong className={isLowStock ? 'text-amber-400' : 'text-emerald-400'}>{item.availableQuantity} {item.unit}</strong> (Min: {item.reorderThreshold})
                            </span>
                            <span>{item.category}</span>
                            {item.location && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                <span>{item.location}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Staff Section */}
            {(activeCategory === 'ALL' || activeCategory === 'STAFF') && matchingStaff.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-1.5">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>Staff & Officials ({matchingStaff.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsMobileOpen(false);
                      onNavigateSection?.('directory');
                    }}
                    className="text-[10px] text-slate-400 hover:text-amber-300 lowercase cursor-pointer"
                  >
                    open in directory &rarr;
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {matchingStaff.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleStaffClick(user)}
                      className="p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 transition-colors cursor-pointer group flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-teal-900/60 border border-teal-700/60 text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                              {user.name}
                            </span>
                            {user.department && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                                {user.department}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {user.positionName || user.role} · {user.email}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Hotkey & Status Legend */}
      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span>Search scope:</span>
          <span className="text-slate-300 font-medium">Tasks · Stores · Personnel</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            ESC
          </kbd>
          <span>to close</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Search Bar */}
      <div className="hidden md:block flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-2 lg:mx-4 relative" ref={containerRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={`${t('action.search', 'Search operations, tasks, inventory, staff...')} (⌘K)`}
            className="w-full pl-9 pr-14 py-1.5 bg-slate-950/70 hover:bg-slate-950/90 focus:bg-slate-950 text-xs sm:text-sm text-slate-200 placeholder:text-slate-400 rounded-lg border border-slate-700/80 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-slate-400 hover:text-white rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Floating Dropdown Results */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
            {renderDropdownContent()}
          </div>
        )}
      </div>

      {/* Mobile Search Button in Navbar */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => {
            setIsMobileOpen(true);
            setTimeout(() => mobileInputRef.current?.focus(), 50);
          }}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Open Global Search"
          aria-label="Global Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Full-Screen / Modal Search Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col md:hidden animate-in fade-in duration-150">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('action.search', 'Search operations, tasks, inventory, staff...')}
                className="w-full pl-9 pr-8 py-2 bg-slate-900 text-sm text-slate-100 placeholder:text-slate-400 rounded-lg border border-slate-700 focus:border-teal-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
            >
              {t('action.cancel', 'Cancel')}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {renderDropdownContent()}
          </div>
        </div>
      )}
    </>
  );
};
