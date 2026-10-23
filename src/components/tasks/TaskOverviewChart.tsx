import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Layers, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Department } from '../../types';

export type ChartViewMode = 'status-priority' | 'priority-status' | 'donuts' | 'completion';

export interface TaskOverviewChartProps {
  tasks: Task[];
  title?: string;
  subtitle?: string;
  className?: string;
  defaultView?: ChartViewMode;
  onNavigateSection?: (section: string) => void;
  onFilterSelect?: (filter: { status?: TaskStatus; priority?: TaskPriority; department?: Department }) => void;
}

const PRIORITY_COLORS: Record<TaskPriority, { fill: string; stroke: string; label: string; textClass: string }> = {
  URGENT: { fill: '#F43F5E', stroke: '#BE123C', label: 'Urgent', textClass: 'text-rose-400' },
  HIGH: { fill: '#F59E0B', stroke: '#B45309', label: 'High', textClass: 'text-amber-400' },
  MEDIUM: { fill: '#38BDF8', stroke: '#0284C7', label: 'Medium', textClass: 'text-sky-400' },
  LOW: { fill: '#94A3B8', stroke: '#475569', label: 'Low', textClass: 'text-slate-400' },
};

const STATUS_COLORS: Record<TaskStatus, { fill: string; label: string; textClass: string }> = {
  DRAFT: { fill: '#64748B', label: 'Draft', textClass: 'text-slate-400' },
  ASSIGNED: { fill: '#818CF8', label: 'Assigned', textClass: 'text-indigo-400' },
  IN_PROGRESS: { fill: '#0EA5E9', label: 'In Progress', textClass: 'text-sky-400' },
  SUBMITTED: { fill: '#F59E0B', label: 'Submitted', textClass: 'text-amber-400' },
  REVISION_REQUESTED: { fill: '#FB7185', label: 'Revision', textClass: 'text-rose-400' },
  APPROVED: { fill: '#10B981', label: 'Approved', textClass: 'text-emerald-400' },
  CANCELLED: { fill: '#475569', label: 'Cancelled', textClass: 'text-slate-500' },
};

const DISPLAY_STATUS_KEYS: TaskStatus[] = [
  'ASSIGNED',
  'IN_PROGRESS',
  'SUBMITTED',
  'REVISION_REQUESTED',
  'APPROVED'
];

const DISPLAY_PRIORITY_KEYS: TaskPriority[] = [
  'URGENT',
  'HIGH',
  'MEDIUM',
  'LOW'
];

export const TaskOverviewChart: React.FC<TaskOverviewChartProps> = ({
  tasks,
  title = "Operational Health & Task Distribution",
  subtitle = "Interactive breakdown of stadium tasks by lifecycle status, urgency, and operational velocity",
  className = "",
  defaultView = "status-priority",
  onNavigateSection,
  onFilterSelect
}) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>(defaultView);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');

  // Filter tasks by department if selected
  const filteredTasks = useMemo(() => {
    if (selectedDepartment === 'ALL') return tasks;
    return tasks.filter(t => t.department === selectedDepartment);
  }, [tasks, selectedDepartment]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.department) set.add(t.department);
    });
    return Array.from(set).sort();
  }, [tasks]);

  // KPI Calculations
  const urgentCount = useMemo(() => {
    return filteredTasks.filter(t => (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'APPROVED').length;
  }, [filteredTasks]);

  const underReviewCount = useMemo(() => {
    return filteredTasks.filter(t => t.status === 'SUBMITTED').length;
  }, [filteredTasks]);

  const approvedCount = useMemo(() => {
    return filteredTasks.filter(t => t.status === 'APPROVED').length;
  }, [filteredTasks]);

  const avgCompletionRate = useMemo(() => {
    if (filteredTasks.length === 0) return 0;
    const sum = filteredTasks.reduce((acc, t) => {
      if (t.completionRate !== undefined) return acc + t.completionRate;
      if (t.status === 'APPROVED') return acc + 100;
      if (t.status === 'SUBMITTED') return acc + 85;
      if (t.status === 'IN_PROGRESS') return acc + 50;
      return acc;
    }, 0);
    return Math.round(sum / filteredTasks.length);
  }, [filteredTasks]);

  // 1. Data for Mode: Status Breakdown with Stacked Priorities
  const statusWithPriorityData = useMemo(() => {
    return DISPLAY_STATUS_KEYS.map(statusKey => {
      const tasksInStatus = filteredTasks.filter(t => t.status === statusKey);
      const urgent = tasksInStatus.filter(t => t.priority === 'URGENT').length;
      const high = tasksInStatus.filter(t => t.priority === 'HIGH').length;
      const medium = tasksInStatus.filter(t => t.priority === 'MEDIUM').length;
      const low = tasksInStatus.filter(t => t.priority === 'LOW').length;
      const total = tasksInStatus.length;

      return {
        statusKey,
        name: STATUS_COLORS[statusKey].label,
        urgent,
        high,
        medium,
        low,
        total
      };
    });
  }, [filteredTasks]);

  // 2. Data for Mode: Priority Breakdown with Stacked Statuses
  const priorityWithStatusData = useMemo(() => {
    return DISPLAY_PRIORITY_KEYS.map(prioKey => {
      const tasksInPriority = filteredTasks.filter(t => t.priority === prioKey);
      const assigned = tasksInPriority.filter(t => t.status === 'ASSIGNED').length;
      const inProgress = tasksInPriority.filter(t => t.status === 'IN_PROGRESS').length;
      const submitted = tasksInPriority.filter(t => t.status === 'SUBMITTED').length;
      const revision = tasksInPriority.filter(t => t.status === 'REVISION_REQUESTED').length;
      const approved = tasksInPriority.filter(t => t.status === 'APPROVED').length;
      const total = tasksInPriority.length;

      return {
        priorityKey: prioKey,
        name: PRIORITY_COLORS[prioKey].label,
        assigned,
        inProgress,
        submitted,
        revision,
        approved,
        total
      };
    });
  }, [filteredTasks]);

  // 3. Data for Mode: Donut Charts (Status Share & Priority Share)
  const statusDonutData = useMemo(() => {
    return DISPLAY_STATUS_KEYS.map(key => ({
      name: STATUS_COLORS[key].label,
      value: filteredTasks.filter(t => t.status === key).length,
      color: STATUS_COLORS[key].fill,
      key
    })).filter(item => item.value > 0);
  }, [filteredTasks]);

  const priorityDonutData = useMemo(() => {
    return DISPLAY_PRIORITY_KEYS.map(key => ({
      name: PRIORITY_COLORS[key].label,
      value: filteredTasks.filter(t => t.priority === key).length,
      color: PRIORITY_COLORS[key].fill,
      key
    })).filter(item => item.value > 0);
  }, [filteredTasks]);

  // 4. Data for Mode: Completion Rates & Total Volume
  const completionData = useMemo(() => {
    return DISPLAY_STATUS_KEYS.map(key => {
      const matching = filteredTasks.filter(t => t.status === key);
      const count = matching.length;
      const avgRate = count > 0
        ? Math.round(matching.reduce((acc, t) => {
            if (t.completionRate !== undefined) return acc + t.completionRate;
            return acc + (key === 'APPROVED' ? 100 : key === 'SUBMITTED' ? 85 : key === 'IN_PROGRESS' ? 50 : 10);
          }, 0) / count)
        : 0;
      return {
        name: STATUS_COLORS[key].label,
        avgCompletion: avgRate,
        taskCount: count
      };
    });
  }, [filteredTasks]);

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xs ${className}`}>
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-teal-950/70 border border-teal-800/70 rounded-lg text-teal-400 mt-0.5">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {title}
              </h2>
              <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/80 font-semibold">
                Avg {avgCompletionRate}% Complete
              </span>
              {selectedDepartment !== 'ALL' && (
                <span className="text-[10px] font-medium text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                  {selectedDepartment}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Filter controls & View Modes */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Department Filter */}
          {departments.length > 1 && (
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500 cursor-pointer pr-7 appearance-none"
              >
                <option value="ALL">All Departments ({tasks.length})</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept} ({tasks.filter(t => t.department === dept).length})
                  </option>
                ))}
              </select>
              <Filter className="w-3 h-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          )}

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('status-priority')}
              title="Distribution by Status with Priority Stacking"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'status-priority'
                  ? 'bg-slate-800 text-teal-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Status x Priority
            </button>
            <button
              onClick={() => setViewMode('priority-status')}
              title="Distribution by Priority with Status Stacking"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'priority-status'
                  ? 'bg-slate-800 text-teal-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Priority x Status
            </button>
            <button
              onClick={() => setViewMode('donuts')}
              title="Dual Donut Distribution Share"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'donuts'
                  ? 'bg-slate-800 text-teal-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieIcon className="w-3 h-3" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setViewMode('completion')}
              title="Average Completion Velocity & Volume"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'completion'
                  ? 'bg-slate-800 text-teal-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="w-full h-72 pt-1">
        {filteredTasks.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg text-center p-6">
            <AlertTriangle className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">No tasks found for current filter</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the department filter or creating new tasks.</p>
          </div>
        ) : viewMode === 'status-priority' ? (
          /* View 1: Status Distribution with Priority Stacked */
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusWithPriorityData}
              margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
              />
              <YAxis 
                allowDecimals={false} 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
                tickFormatter={(val) => `${val}`} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const total = payload.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
                    return (
                      <div className="bg-slate-900 border border-slate-700/90 rounded-lg p-3 shadow-2xl text-xs space-y-1.5 min-w-[190px]">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-slate-100">{label} Stage</span>
                          <span className="font-mono text-teal-400 font-semibold">{total} total</span>
                        </div>
                        <div className="space-y-1 pt-0.5">
                          {payload.map((entry, idx) => (
                            <div key={`tip-${idx}`} className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: entry.color }} />
                                <span className="text-slate-300">{entry.name}:</span>
                              </div>
                              <span className="font-mono font-semibold tabular-nums text-slate-200">
                                {entry.value} ({total > 0 ? Math.round((Number(entry.value) / total) * 100) : 0}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} 
              />
              <Bar dataKey="urgent" name="Urgent" stackId="a" fill={PRIORITY_COLORS.URGENT.fill} radius={[0, 0, 0, 0]} />
              <Bar dataKey="high" name="High" stackId="a" fill={PRIORITY_COLORS.HIGH.fill} radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" name="Medium" stackId="a" fill={PRIORITY_COLORS.MEDIUM.fill} radius={[0, 0, 0, 0]} />
              <Bar dataKey="low" name="Low" stackId="a" fill={PRIORITY_COLORS.LOW.fill} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : viewMode === 'priority-status' ? (
          /* View 2: Priority Distribution with Status Stacked */
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priorityWithStatusData}
              margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
              />
              <YAxis 
                allowDecimals={false} 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
                tickFormatter={(val) => `${val}`} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const total = payload.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
                    return (
                      <div className="bg-slate-900 border border-slate-700/90 rounded-lg p-3 shadow-2xl text-xs space-y-1.5 min-w-[200px]">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-slate-100">{label} Priority</span>
                          <span className="font-mono text-teal-400 font-semibold">{total} tasks</span>
                        </div>
                        <div className="space-y-1 pt-0.5">
                          {payload.map((entry, idx) => (
                            <div key={`tip-prio-${idx}`} className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: entry.color }} />
                                <span className="text-slate-300">{entry.name}:</span>
                              </div>
                              <span className="font-mono font-semibold tabular-nums text-slate-200">
                                {entry.value} ({total > 0 ? Math.round((Number(entry.value) / total) * 100) : 0}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} 
              />
              <Bar dataKey="assigned" name="Assigned" stackId="b" fill={STATUS_COLORS.ASSIGNED.fill} />
              <Bar dataKey="inProgress" name="In Progress" stackId="b" fill={STATUS_COLORS.IN_PROGRESS.fill} />
              <Bar dataKey="submitted" name="Submitted" stackId="b" fill={STATUS_COLORS.SUBMITTED.fill} />
              <Bar dataKey="revision" name="Revision" stackId="b" fill={STATUS_COLORS.REVISION_REQUESTED.fill} />
              <Bar dataKey="approved" name="Approved" stackId="b" fill={STATUS_COLORS.APPROVED.fill} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : viewMode === 'donuts' ? (
          /* View 3: Dual Donut Breakdown (Status Share & Priority Share) */
          <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-4 items-center">
            {/* Donut 1: By Status */}
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Distribution by Workflow Status
              </span>
              <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDonutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {statusDonutData.map((entry, index) => (
                        <Cell key={`status-cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0];
                          return (
                            <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs shadow-xl min-w-[130px]">
                              <p className="font-semibold text-slate-100">{item.name}</p>
                              <p className="text-teal-400 font-mono font-bold mt-0.5">
                                {item.value} tasks ({Math.round(((Number(item.value) || 0) / filteredTasks.length) * 100)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-mono font-bold text-slate-200">{filteredTasks.length}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-tight">Tasks</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1">
                {statusDonutData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}: <strong className="text-slate-200 font-mono">{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut 2: By Priority */}
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Distribution by Urgency Priority
              </span>
              <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityDonutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {priorityDonutData.map((entry, index) => (
                        <Cell key={`prio-cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0];
                          return (
                            <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs shadow-xl min-w-[130px]">
                              <p className="font-semibold text-slate-100">{item.name} Priority</p>
                              <p className="text-amber-400 font-mono font-bold mt-0.5">
                                {item.value} tasks ({Math.round(((Number(item.value) || 0) / filteredTasks.length) * 100)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-mono font-bold text-rose-400">{urgentCount}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-tight">Urgent/High</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1">
                {priorityDonutData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}: <strong className="text-slate-200 font-mono">{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* View 4: Completion Health Rates vs Volume */
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={completionData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
              />
              <YAxis 
                yAxisId="rate" 
                domain={[0, 100]} 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
                tickFormatter={(val) => `${val}%`} 
              />
              <YAxis 
                yAxisId="count" 
                orientation="right" 
                allowDecimals={false} 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
                tickFormatter={(val) => `${val} tasks`} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const rate = payload[0]?.value;
                    const count = payload[1]?.value;
                    return (
                      <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-3 shadow-2xl text-xs space-y-1.5 min-w-[170px]">
                        <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">
                          {label} Workflow Stage
                        </p>
                        <div className="flex items-center justify-between text-teal-300">
                          <span>Avg Completion:</span>
                          <span className="font-mono tabular-nums font-semibold">{rate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sky-300">
                          <span>Task Volume:</span>
                          <span className="font-mono tabular-nums font-semibold">{count} tasks</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} 
              />
              <Bar 
                yAxisId="rate" 
                dataKey="avgCompletion" 
                name="Avg Completion Rate (%)" 
                fill="#0D9488" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={44} 
              />
              <Bar 
                yAxisId="count" 
                dataKey="taskCount" 
                name="Task Volume (Count)" 
                fill="#38BDF8" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={44} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Operational Highlights & Metrics Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
        <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
          <span className="text-[11px] text-slate-500 block font-medium">Total Workload</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-slate-100 text-sm font-bold tabular-nums">
              {filteredTasks.length}
            </span>
            <span className="text-[10px] text-slate-500">tasks tracked</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
          <span className="text-[11px] text-slate-500 block font-medium">Urgent Attention</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-rose-400 text-sm font-bold tabular-nums">
              {urgentCount}
            </span>
            <span className="text-[10px] text-rose-500/80">urgent/high</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
          <span className="text-[11px] text-slate-500 block font-medium">Awaiting Review</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-amber-400 text-sm font-bold tabular-nums">
              {underReviewCount}
            </span>
            <span className="text-[10px] text-amber-500/80">submitted reports</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Approved Submissions</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono text-emerald-400 text-sm font-bold tabular-nums">
                {approvedCount}
              </span>
              <span className="text-[10px] text-emerald-500/80">verified</span>
            </div>
          </div>
          {onNavigateSection && (
            <button
              onClick={() => onNavigateSection('tasks')}
              className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors"
              title="Open Task Manager"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
