import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Package, 
  FileText, 
  Send, 
  Calendar, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  BarChart3,
  Camera,
  Radio,
  Bell,
  ArrowRight,
  Trophy,
  MapPin
} from 'lucide-react';
import { User, Task, InventoryItem, Announcement, StockRequest, CalendarEvent } from '../../types';
import { TaskOverviewChart } from '../tasks/TaskOverviewChart';
import { useTranslation } from '../../context/LanguageContext';

interface ManagerWorkspaceProps {
  currentUser: User;
  tasks: Task[];
  inventory: InventoryItem[];
  announcements: Announcement[];
  requests: StockRequest[];
  events?: CalendarEvent[];
  onNavigateSection: (section: any) => void;
  onOpenTaskModal: (task: Task) => void;
  onOpenNewTaskModal: () => void;
  onOpenNewRequestModal: () => void;
  onOpenProfile?: () => void;
}

export const ManagerWorkspace: React.FC<ManagerWorkspaceProps> = ({
  currentUser,
  tasks,
  inventory,
  announcements,
  requests,
  events = [],
  onNavigateSection,
  onOpenTaskModal,
  onOpenNewTaskModal,
  onOpenNewRequestModal,
  onOpenProfile
}) => {
  const { t, translateTasks, translateInventory, translateAnnouncements, translateEvents } = useTranslation();

  // Multi-lingual translations for dashboard widgets
  const displayedTasks = translateTasks(tasks);
  const displayedInventory = translateInventory(inventory);
  const displayedAnnouncements = translateAnnouncements(announcements);
  const displayedEvents = translateEvents(events);

  // Filter tasks based on role
  const isSupervisor = currentUser.role === 'SUPERVISOR';
  const isStorekeeper = currentUser.role === 'STOREKEEPER';

  const relevantTasks = displayedTasks.filter(t => {
    if (isSupervisor) return true;
    return t.assigneeId === currentUser.id || t.createdById === currentUser.id;
  });

  const activeTasks = relevantTasks.filter(t => t.status !== 'APPROVED');
  const urgentTasks = relevantTasks.filter(t => (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'APPROVED');
  const pendingReportsToReview = displayedTasks.filter(t => t.status === 'SUBMITTED');
  const inProgressTasks = relevantTasks.filter(t => t.status === 'IN_PROGRESS');
  const assignedTasks = relevantTasks.filter(t => t.status === 'ASSIGNED');

  const lowStockItems = displayedInventory.filter(i => i.availableQuantity <= i.reorderThreshold);
  const outOfStockItems = displayedInventory.filter(i => i.availableQuantity === 0);
  const pendingStockRequests = requests.filter(r => r.status === 'PENDING');
  const topDepletedItem = lowStockItems.find(i => i.availableQuantity === 0) || lowStockItems[0];

  const sortedAnnouncements = [...displayedAnnouncements].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const latestAnnouncement = sortedAnnouncements[0];
  const criticalAnnouncementsCount = displayedAnnouncements.filter(
    a => a.priority === 'CRITICAL' || a.priority === 'IMPORTANT'
  ).length;

  const overallAvgCompletion = relevantTasks.length > 0
    ? Math.round(relevantTasks.reduce((acc, t) => acc + (t.completionRate ?? (t.status === 'APPROVED' ? 100 : t.status === 'SUBMITTED' ? 85 : 0)), 0) / relevantTasks.length)
    : 0;

  const upcomingFixtures = [...displayedEvents]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Workspace Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <span>{t('app.stadium_name', 'Gahanga Cricket Stadium')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('workspace.hq', 'Operations Headquarters')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t('workspace.welcome', 'Welcome back')}, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {currentUser.role === 'CRICKET_OPERATIONS_MANAGER' && (
                'Review active match pitch preparations, tournament logistics, training kit allocations, and team assignments.'
              )}
              {currentUser.role === 'SUPERVISOR' && (
                'Director command overview: review operational submissions, monitor international fixture deadlines, and coordinate department heads.'
              )}
              {currentUser.role === 'STOREKEEPER' && (
                'Equipment custodian desk: verify incoming deliveries, reconcile stock levels, and fulfill approved kit requests.'
              )}
              {currentUser.role === 'STAFF' && (
                'Ground & matchday workflow: view daily physical maintenance assignments, pitch rolling schedules, and report completions.'
              )}
              {currentUser.role === 'SYSTEM_ADMIN' && (
                'Systems administrator overview: monitor RBAC compliance, audit records, and user management.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSupervisor ? (
              <button
                onClick={onOpenNewTaskModal}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                {t('action.assign_task', '+ Assign New Task')}
              </button>
            ) : (
              <button
                onClick={onOpenNewRequestModal}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                {t('action.requisition_equipment', '+ Requisition Equipment')}
              </button>
            )}
            <button
              onClick={() => onNavigateSection('calendar')}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              title="Open Stadium & Fixture Calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('nav.calendar', 'Stadium Calendar')}</span>
            </button>
            <button
              onClick={() => onNavigateSection('tasks')}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {t('action.view_workflows', 'View Workflows')}
            </button>
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                title="Edit your official personal records and profile photo"
              >
                <Camera className="w-3.5 h-3.5 text-teal-400" />
                <span>Edit Profile & Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Operational Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Assigned Tasks</span>
            <span className="text-xl font-bold font-mono tabular-nums text-white mt-1 block">
              {relevantTasks.length}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {urgentTasks.length} high priority
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Reports For Review</span>
            <span className="text-xl font-bold font-mono tabular-nums text-teal-400 mt-1 block">
              {pendingReportsToReview.length}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Awaiting supervisor sign-off
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Low Stock Alerts</span>
            <span className="text-xl font-bold font-mono tabular-nums text-amber-400 mt-1 block">
              {lowStockItems.length}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Below threshold reserves
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Pitch Status</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              Optimal
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Pitch #3 moisture 14.8%
            </span>
          </div>
        </div>
      </div>

      {/* Immediate Operational Snapshot */}
      <section aria-labelledby="operational-pulse-heading" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <h2 id="operational-pulse-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Operations Snapshot
            </h2>
            <span className="text-slate-500 text-xs hidden sm:inline">·</span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Real-time activity across tasks, stores, and team notices
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] text-slate-400">Updated just now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Active Task Count & Flow */}
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-teal-950/80 border border-teal-800/80 text-teal-400 rounded-lg">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">Active Task Workflows</h3>
                    <p className="text-[11px] text-slate-400">In-flight operational jobs</p>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                  urgentTasks.length > 0 
                    ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                    : 'bg-teal-950/60 text-teal-400 border-teal-800/60'
                }`}>
                  {urgentTasks.length > 0 ? `${urgentTasks.length} Urgent` : 'Nominal'}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {activeTasks.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    active / {relevantTasks.length} total assigned
                  </span>
                </div>
              </div>

              {/* Progress and status split */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Average Completion</span>
                  <span className="font-mono font-medium text-teal-400 tabular-nums">{overallAvgCompletion}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
                  <div 
                    className="bg-teal-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${overallAvgCompletion}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>{inProgressTasks.length} in progress</span>
                  <span>·</span>
                  <span>{pendingReportsToReview.length} awaiting review</span>
                  <span>·</span>
                  <span>{assignedTasks.length} queued</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateSection('tasks')}
              className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-teal-400 hover:text-teal-300 font-medium group-hover:translate-x-0.5 transition-all cursor-pointer"
            >
              <span>View & Manage Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Low Inventory Alerts */}
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-950/80 border border-amber-800/80 text-amber-400 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">Inventory Stock Alerts</h3>
                    <p className="text-[11px] text-slate-400">Stadium reserves & safety levels</p>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                  lowStockItems.length > 0 
                    ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                    : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                }`}>
                  {lowStockItems.length > 0 ? `${lowStockItems.length} Restock Alerts` : 'Optimal'}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tracking-tight text-amber-400 tabular-nums">
                    {lowStockItems.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    items at or below threshold
                  </span>
                </div>
              </div>

              {/* Critical Item Highlight or Safe Notice */}
              <div className="pt-1">
                {topDepletedItem ? (
                  <div className="p-2 bg-slate-950/70 border border-amber-900/40 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200 truncate max-w-[150px]">
                        {topDepletedItem.name}
                      </span>
                      <span className="font-mono text-amber-400 text-[11px]">
                        {topDepletedItem.availableQuantity} {topDepletedItem.unit} left
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Threshold: {topDepletedItem.reorderThreshold} {topDepletedItem.unit}</span>
                      <span className="text-amber-500 font-medium">Reorder Alert</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-slate-950/70 border border-emerald-900/30 rounded-lg text-xs text-slate-400">
                    All store items have sufficient buffer quantities for upcoming matches.
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{outOfStockItems.length} zero stock</span>
                  <span>·</span>
                  <span>{pendingStockRequests.length} pending requisitions</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateSection('inventory')}
              className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 font-medium group-hover:translate-x-0.5 transition-all cursor-pointer"
            >
              <span>Audit Inventory & Reorder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Recent Communication Bulletins */}
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-950/80 border border-sky-800/80 text-sky-400 rounded-lg">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">Communication Bulletins</h3>
                    <p className="text-[11px] text-slate-400">Operations broadcast channel</p>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                  criticalAnnouncementsCount > 0 
                    ? 'bg-sky-950/60 text-sky-400 border-sky-800/60'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {criticalAnnouncementsCount > 0 ? `${criticalAnnouncementsCount} Priority` : 'Routine'}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tracking-tight text-sky-400 tabular-nums">
                    {announcements.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    published bulletins & alerts
                  </span>
                </div>
              </div>

              {/* Latest Bulletin Preview */}
              <div className="pt-1">
                {latestAnnouncement ? (
                  <div className="p-2 bg-slate-950/70 border border-slate-800/90 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-sky-400 font-medium truncate max-w-[130px]">
                        {latestAnnouncement.authorName}
                      </span>
                      <span className="font-mono tabular-nums">
                        {new Date(latestAnnouncement.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-200 text-xs truncate">
                      {latestAnnouncement.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
                      {latestAnnouncement.body}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400">
                    No broadcasts published in this session.
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Target: {latestAnnouncement ? latestAnnouncement.targetAudience.replace('_', ' ') : 'All Staff'}</span>
                  <span>·</span>
                  <span>Broadcast Ready</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateSection('communication')}
              className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-sky-400 hover:text-sky-300 font-medium group-hover:translate-x-0.5 transition-all cursor-pointer"
            >
              <span>Open Communications Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Recharts Task Overview Chart Component */}
      <TaskOverviewChart
        tasks={relevantTasks}
        onNavigateSection={onNavigateSection}
      />

      {/* Two Column Layout: Active Tasks & Operational Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Primary Actionable Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Priority Tasks & Deliverables
              </h2>
              <p className="text-xs text-slate-400">
                Active assignments requiring attention, progress tracking, or report submission
              </p>
            </div>
            <button
              onClick={() => onNavigateSection('tasks')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>All Tasks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {relevantTasks.slice(0, 4).map((task) => {
              const hasSubmissions = task.submissions.length > 0;
              const latestSubmission = hasSubmissions ? task.submissions[task.submissions.length - 1] : null;

              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskModal(task)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-slate-300 font-medium">{task.department}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">Due {task.deadline}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-semibold ${
                          task.priority === 'URGENT' ? 'text-rose-400' :
                          task.priority === 'HIGH' ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${
                        task.status === 'APPROVED' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' :
                        task.status === 'SUBMITTED' ? 'bg-sky-950/60 text-sky-400 border border-sky-800/60' :
                        task.status === 'REVISION_REQUESTED' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60' :
                        task.status === 'IN_PROGRESS' ? 'bg-teal-950/60 text-teal-400 border border-teal-800/60' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Task Metadata & Action Prompt */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Assigned to: <strong className="text-slate-300 font-medium">{task.assigneeName}</strong></span>
                      {task.completionRate !== undefined && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{task.completionRate}% complete</span>
                        </>
                      )}
                    </div>
                    <span className="text-teal-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-medium">
                      Manage <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 span): Fixtures, Announcements & Equipment Alerts */}
        <div className="space-y-6">
          {/* Upcoming Stadium Fixtures & Pitch Itinerary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Upcoming Itinerary
                </h3>
              </div>
              <button
                onClick={() => onNavigateSection('calendar')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
              >
                Calendar &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {upcomingFixtures.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No upcoming fixtures or events scheduled.
                </p>
              ) : (
                upcomingFixtures.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => onNavigateSection('calendar')}
                    className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/90 rounded-lg transition-colors cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-teal-400 font-semibold">
                        {ev.date} {ev.startTime ? `· ${ev.startTime}` : ''}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        ev.type === 'MATCH' ? 'bg-amber-500/20 text-amber-300' :
                        ev.type === 'PITCH_MAINTENANCE' ? 'bg-emerald-500/20 text-emerald-300' :
                        ev.type === 'TRAINING' ? 'bg-sky-500/20 text-sky-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {ev.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition-colors truncate">
                      {ev.title}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Announcements */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Official Announcements
              </h3>
              <button
                onClick={() => onNavigateSection('communication')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {announcements.slice(0, 3).map((anc) => (
                <div
                  key={anc.id}
                  className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-teal-400 font-medium">{anc.authorName}</span>
                    <span className="font-mono tabular-nums">
                      {new Date(anc.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {anc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {anc.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Store Inventory Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Inventory Alerts
              </h3>
              <button
                onClick={() => onNavigateSection('inventory')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium"
              >
                Store Ledger
              </button>
            </div>

            <div className="space-y-2">
              {lowStockItems.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  All stadium stock reserves are within nominal thresholds.
                </p>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-950/60 border border-amber-900/40 rounded-lg flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        Available: <strong className="font-mono text-amber-400 tabular-nums">{item.availableQuantity} {item.unit}</strong> (Min: {item.reorderThreshold})
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigateSection('inventory')}
                      className="px-2 py-1 text-[11px] font-medium text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-800/60 rounded"
                    >
                      Reorder
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
