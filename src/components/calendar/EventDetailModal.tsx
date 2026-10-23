import React, { useState } from 'react';
import { 
  CalendarEvent, 
  CalendarEventType,
  User, 
  Task 
} from '../../types';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  UserCheck, 
  ExternalLink, 
  Download, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  Wrench, 
  Dumbbell, 
  CheckSquare, 
  Building2, 
  Package,
  Share2,
  Tag
} from 'lucide-react';
import { downloadIcsFile, getGoogleCalendarUrl } from '../../utils/calendarExport';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  currentUser: User;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateStatus: (eventId: string, status: CalendarEvent['status']) => void;
  onNavigateToTask?: (taskId: string) => void;
  linkedTask?: Task | null;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  currentUser,
  onEditEvent,
  onDeleteEvent,
  onUpdateStatus,
  onNavigateToTask,
  linkedTask,
  onShowToast
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen || !event) return null;

  const typeConfig: Record<CalendarEventType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    MATCH: { label: 'Match Fixture', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    PITCH_MAINTENANCE: { label: 'Pitch & Turf Care', icon: Wrench, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    TRAINING: { label: 'Training & Clinic', icon: Dumbbell, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
    TASK_DEADLINE: { label: 'Task Deadline', icon: CheckSquare, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    FACILITY_EVENT: { label: 'Stadium & Corporate', icon: Building2, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
    INVENTORY_AUDIT: { label: 'Store & Equipment Audit', icon: Package, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' }
  };

  const typeInfo = typeConfig[event.type] || typeConfig.FACILITY_EVENT;
  const TypeIcon = typeInfo.icon;

  const priorityColors = {
    URGENT: 'bg-red-500/15 text-red-300 border-red-500/30',
    HIGH: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    MEDIUM: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    LOW: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
    ROUTINE: 'bg-slate-700/60 text-slate-300 border-slate-600/40'
  };

  const statusColors = {
    SCHEDULED: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    IN_PROGRESS: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    COMPLETED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    CANCELLED: 'bg-slate-700 text-slate-400 border-slate-600'
  };

  const formattedDate = new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleExportIcs = () => {
    downloadIcsFile(event);
    if (onShowToast) {
      onShowToast('success', 'iCalendar Downloaded', `Exported "${event.title}" as .ics file for Outlook, Apple, or Google Calendar`);
    }
  };

  const handleDelete = () => {
    onDeleteEvent(event.id);
    setShowConfirmDelete(false);
    onClose();
    if (onShowToast) {
      onShowToast('info', 'Event Removed', `Removed "${event.title}" from the stadium schedule`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeInfo.bg} ${typeInfo.color}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {typeInfo.label}
              </span>

              {event.priority && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[event.priority] || priorityColors.ROUTINE}`}>
                  {event.priority}
                </span>
              )}

              {event.status && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[event.status] || statusColors.SCHEDULED}`}>
                  {event.status.replace('_', ' ')}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Schedule Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Scheduled Date</p>
                <p className="text-sm font-semibold text-slate-200">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Time Window</p>
                <p className="text-sm font-semibold text-slate-200">
                  {event.startTime ? `${event.startTime} - ${event.endTime || 'End of Session'}` : 'Full Day Window'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Venue & Location</p>
                <p className="text-sm font-semibold text-slate-200">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Teams or Participants */}
          {event.teamsOrParticipants && (
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Teams / Participants</p>
                <p className="text-sm font-semibold text-indigo-200">{event.teamsOrParticipants}</p>
              </div>
            </div>
          )}

          {/* Description / Instructions */}
          {event.description && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Event Description & Operational Brief
              </h3>
              <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>
          )}

          {/* Assigned Officer / Organizer */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-800/30 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-teal-400 font-bold text-sm">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Lead Officer / Organizer</p>
                <p className="text-sm font-semibold text-slate-200">{event.organizerOrAssignee || 'GCS Operations Management'}</p>
              </div>
            </div>

            {/* Quick Status Setter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1">Status:</span>
              {(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(event.id, st)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    event.status === st
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
              {event.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md text-xs bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Linked Task Banner */}
          {(event.linkedTaskId || linkedTask) && (
            <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <p className="text-xs text-purple-300 font-semibold uppercase">Linked System Task</p>
                  <p className="text-sm font-medium text-slate-200">
                    {linkedTask ? linkedTask.title : `Task Reference #${event.linkedTaskId}`}
                  </p>
                </div>
              </div>
              {onNavigateToTask && (
                <button
                  onClick={() => {
                    const tId = event.linkedTaskId || linkedTask?.id;
                    if (tId) {
                      onNavigateToTask(tId);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Task</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Delete Confirmation Warning */}
          {showConfirmDelete && (
            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>Confirm Event Removal</span>
              </div>
              <p className="text-xs text-slate-300">
                Are you sure you want to remove <strong className="text-white">"{event.title}"</strong> from the stadium schedule? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Yes, Remove Event
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          {/* External Integrations */}
          <div className="flex items-center gap-2">
            <a
              href={getGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onShowToast) {
                  onShowToast('info', 'Google Calendar', 'Opened Google Calendar event creation tab');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Add this match or fixture to Google Calendar"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Calendar</span>
            </a>

            <button
              onClick={handleExportIcs}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Download RFC 5545 iCalendar file for Outlook, Apple Calendar, or Google Calendar"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export .ics</span>
            </button>
          </div>

          {/* Management Buttons */}
          <div className="flex items-center gap-2">
            {!showConfirmDelete && (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                title="Delete event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onEditEvent(event)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Event</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
