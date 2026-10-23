import React, { useState, useEffect } from 'react';
import { 
  CalendarEvent, 
  CalendarEventType, 
  User 
} from '../../types';
import { 
  X, 
  Plus, 
  Trophy, 
  Wrench, 
  Dumbbell, 
  Building2, 
  Package, 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Check 
} from 'lucide-react';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEvent: (eventData: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  initialEvent?: CalendarEvent | null;
  initialDate?: string;
  users: User[];
  currentUser: User;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSaveEvent,
  initialEvent,
  initialDate,
  users,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEventType>('MATCH');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:30');
  const [location, setLocation] = useState('Main Oval — Center Pitch #3');
  const [customLocation, setCustomLocation] = useState('');
  const [isCustomLoc, setIsCustomLoc] = useState(false);
  const [teamsOrParticipants, setTeamsOrParticipants] = useState('');
  const [priority, setPriority] = useState<CalendarEvent['priority']>('HIGH');
  const [assigneeId, setAssigneeId] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const venuePresets = [
    'Main Oval — Center Pitch #3',
    'Main Oval — Pitch #2',
    'Main Oval — Pitch #1 (North)',
    'Main Oval — Pitch #4 (South)',
    'Outdoor Practice Nets (Bays 1-4)',
    'Indoor Academy Pavilion Nets',
    'South Practice Green & Slip Cradles',
    'Main Pavilion & Presidential Suite',
    'International Press Gallery (Pavilion L2)',
    'Pavilion Conference Suite',
    'Pavilion Store Bay B',
    'Logistics Receiving Bay A'
  ];

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setType(initialEvent.type || 'MATCH');
      setDate(initialEvent.date || '');
      setStartTime(initialEvent.startTime || '09:00');
      setEndTime(initialEvent.endTime || '12:30');
      if (venuePresets.includes(initialEvent.location)) {
        setLocation(initialEvent.location);
        setIsCustomLoc(false);
        setCustomLocation('');
      } else {
        setIsCustomLoc(true);
        setCustomLocation(initialEvent.location);
      }
      setTeamsOrParticipants(initialEvent.teamsOrParticipants || '');
      setPriority(initialEvent.priority || 'HIGH');
      setAssigneeId(initialEvent.assigneeId || currentUser.id);
      setDescription(initialEvent.description || '');
      setTagsInput(initialEvent.tags ? initialEvent.tags.join(', ') : '');
    } else {
      setTitle('');
      setType('MATCH');
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('12:30');
      setLocation('Main Oval — Center Pitch #3');
      setIsCustomLoc(false);
      setCustomLocation('');
      setTeamsOrParticipants('');
      setPriority('HIGH');
      setAssigneeId(currentUser.id);
      setDescription('');
      setTagsInput('');
    }
    setErrorMsg('');
  }, [initialEvent, initialDate, isOpen, currentUser.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an event or fixture title.');
      return;
    }
    if (!date) {
      setErrorMsg('Please specify the date for this event.');
      return;
    }

    const resolvedLocation = isCustomLoc ? (customLocation.trim() || 'GCS Stadium Grounds') : location;
    const selectedUser = users.find(u => u.id === assigneeId) || currentUser;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSaveEvent({
      ...(initialEvent ? { id: initialEvent.id } : {}),
      title: title.trim(),
      type,
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: resolvedLocation,
      teamsOrParticipants: teamsOrParticipants.trim() || undefined,
      priority,
      assigneeId: selectedUser.id,
      organizerOrAssignee: selectedUser.name,
      description: description.trim() || undefined,
      status: initialEvent?.status || 'SCHEDULED',
      tags: parsedTags.length > 0 ? parsedTags : undefined
    });

    onClose();
  };

  const typeOptions: { value: CalendarEventType; label: string; icon: React.ElementType }[] = [
    { value: 'MATCH', label: 'Match Fixture', icon: Trophy },
    { value: 'PITCH_MAINTENANCE', label: 'Pitch & Turf Care', icon: Wrench },
    { value: 'TRAINING', label: 'Training & Clinic', icon: Dumbbell },
    { value: 'FACILITY_EVENT', label: 'Stadium & Corporate', icon: Building2 },
    { value: 'INVENTORY_AUDIT', label: 'Store & Audit', icon: Package }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {initialEvent ? 'Edit Stadium Schedule Event' : 'Schedule New Fixture or Operation'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure timing, pitch allocation, and personnel for Gahanga Cricket Stadium.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Event Type Grid Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Event Classification *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {typeOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500/60 text-teal-300 ring-1 ring-teal-500/40'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Title or Fixture Description *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rwanda T20 Premier League: Kigali CC vs Gahanga CC"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              required
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Venue Location */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pitch / Stadium Venue *
              </label>
              <button
                type="button"
                onClick={() => setIsCustomLoc(!isCustomLoc)}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
              >
                {isCustomLoc ? 'Select from Presets' : '+ Custom Venue'}
              </button>
            </div>

            {isCustomLoc ? (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="e.g. South Pavilion Commentary Box"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            ) : (
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              >
                {venuePresets.map(preset => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Teams / Participants & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Teams / Participants (Optional)
              </label>
              <input
                type="text"
                value={teamsOrParticipants}
                onChange={(e) => setTeamsOrParticipants(e.target.value)}
                placeholder="e.g. Rwanda Men XI vs Uganda"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Operational Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CalendarEvent['priority'])}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              >
                <option value="URGENT">Urgent / Match Day Critical</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium / Standard</option>
                <option value="ROUTINE">Routine Practice</option>
              </select>
            </div>
          </div>

          {/* Lead Officer / Assignee */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Lead Officer / Organizer
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.jobTitle} ({u.department})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Operational Details & Briefing
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline specific ground requirements, equipment needed, broadcast protocols, or pitch prep checklists..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. ICC Qualifier, Pitch Prep, T20, Broadcast"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{initialEvent ? 'Save Changes' : 'Schedule Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
