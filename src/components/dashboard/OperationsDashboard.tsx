import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Package,
  Calendar,
  Layers,
  Clock,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Wrench,
  Dumbbell,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Task, InventoryItem, StockMovement, CalendarEvent, User } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { ExportReportModal } from './ExportReportModal';
import {
  exportOperationsCSV,
  exportOperationsPDF,
  ExportReportOptions
} from '../../utils/reportExporter';

export interface OperationsDashboardProps {
  tasks: Task[];
  inventory: InventoryItem[];
  movements?: StockMovement[];
  events?: CalendarEvent[];
  users?: User[];
  currentUser?: User;
  onNavigateSection?: (section: any) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  tasks,
  inventory,
  movements = [],
  events = [],
  users = [],
  currentUser,
  onNavigateSection,
  onShowToast
}) => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'4W' | '6W' | 'SEASON'>('6W');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [inventoryViewType, setInventoryViewType] = useState<'ALL' | 'CONSUMABLE' | 'REUSABLE_ASSET'>('ALL');

  // 1. Task Weekly Completion Data
  // Synthesize realistic weekly history aligned with current tasks at Gahanga Cricket Stadium
  const weeklyTaskData = useMemo(() => {
    return [
      {
        week: 'W37 (Sep 08)',
        groundPitch: 6,
        cricketOps: 4,
        storesAudit: 3,
        facilityVip: 2,
        totalCompleted: 15,
        target: 14,
        completionRate: 92,
      },
      {
        week: 'W38 (Sep 15)',
        groundPitch: 7,
        cricketOps: 5,
        storesAudit: 4,
        facilityVip: 3,
        totalCompleted: 19,
        target: 16,
        completionRate: 95,
      },
      {
        week: 'W39 (Sep 22)',
        groundPitch: 8,
        cricketOps: 6,
        storesAudit: 3,
        facilityVip: 4,
        totalCompleted: 21,
        target: 18,
        completionRate: 96,
      },
      {
        week: 'W40 (Sep 29)',
        groundPitch: 9,
        cricketOps: 5,
        storesAudit: 5,
        facilityVip: 3,
        totalCompleted: 22,
        target: 20,
        completionRate: 94,
      },
      {
        week: 'W41 (Oct 06)',
        groundPitch: 10,
        cricketOps: 7,
        storesAudit: 4,
        facilityVip: 4,
        totalCompleted: 25,
        target: 22,
        completionRate: 98,
      },
      {
        week: 'W42 (Current)',
        groundPitch: Math.max(8, tasks.filter(t => t.department === 'Ground & Pitch Maintenance' && (t.status === 'APPROVED' || t.status === 'SUBMITTED')).length),
        cricketOps: Math.max(6, tasks.filter(t => t.department === 'Cricket Operations' && (t.status === 'APPROVED' || t.status === 'SUBMITTED')).length),
        storesAudit: Math.max(4, tasks.filter(t => t.department === 'Stores & Logistics' && (t.status === 'APPROVED' || t.status === 'SUBMITTED')).length),
        facilityVip: Math.max(3, tasks.filter(t => t.department === 'Administration' && (t.status === 'APPROVED' || t.status === 'SUBMITTED')).length),
        totalCompleted: tasks.filter(t => t.status === 'APPROVED' || t.status === 'SUBMITTED').length || 24,
        target: 22,
        completionRate: 97,
      },
    ];
  }, [tasks]);

  // 2. Inventory Turnover Rate Calculations for GCS
  // Turnover = (Annualized Dispatched Units) / (Average Stock on Hand)
  const inventoryTurnoverData = useMemo(() => {
    // Seeded realistic movement frequency benchmarks for GCS lines
    const turnoverBenchmarks: Record<string, { dispatchedMonthly: number; targetTurnover: number }> = {
      'FERT-NPK-01': { dispatchedMonthly: 28, targetTurnover: 8.5 },
      'BALL-WHT-01': { dispatchedMonthly: 48, targetTurnover: 7.2 },
      'LIME-MRK-02': { dispatchedMonthly: 18, targetTurnover: 6.8 },
      'SEED-RYE-04': { dispatchedMonthly: 12, targetTurnover: 5.4 },
      'FLUID-HYD-03': { dispatchedMonthly: 8, targetTurnover: 4.6 },
      'BALL-RED-02': { dispatchedMonthly: 36, targetTurnover: 6.0 },
      'COVER-TARP-01': { dispatchedMonthly: 3, targetTurnover: 2.8 },
      'SIGHT-SCR-01': { dispatchedMonthly: 2, targetTurnover: 2.2 },
      'STUMP-SPR-01': { dispatchedMonthly: 4, targetTurnover: 3.5 },
    };

    return inventory
      .filter(item => inventoryViewType === 'ALL' || item.type === inventoryViewType)
      .map(item => {
        const benchmark = turnoverBenchmarks[item.sku] || {
          dispatchedMonthly: Math.max(4, Math.round(item.totalQuantity * 0.25)),
          targetTurnover: item.type === 'CONSUMABLE' ? 6.0 : 3.0
        };

        const avgStock = Math.max(1, (item.availableQuantity + item.reservedQuantity));
        // Annualized turnover ratio: (Monthly consumption * 12) / Average Holding
        const turnoverRate = Number(((benchmark.dispatchedMonthly * 12) / avgStock).toFixed(1));
        const daysSupplyRemaining = Math.round((item.availableQuantity / Math.max(0.2, benchmark.dispatchedMonthly / 30)));

        return {
          id: item.id,
          sku: item.sku,
          name: item.name,
          category: item.category,
          type: item.type,
          available: item.availableQuantity,
          total: item.totalQuantity,
          dispatchedMonthly: benchmark.dispatchedMonthly,
          turnoverRate,
          targetTurnover: benchmark.targetTurnover,
          daysSupplyRemaining,
          status: item.availableQuantity <= item.reorderThreshold 
            ? 'LOW_STOCK' 
            : turnoverRate > 6.0 
            ? 'HIGH_VELOCITY' 
            : 'OPTIMAL'
        };
      })
      .sort((a, b) => b.turnoverRate - a.turnoverRate);
  }, [inventory, inventoryViewType]);

  // 3. Warehouse Inflow vs Outflow Timeline
  const stockMovementVelocity = useMemo(() => {
    return [
      { period: 'Week 37', receipts: 45, issues: 38, balanceNet: 7 },
      { period: 'Week 38', receipts: 60, issues: 52, balanceNet: 8 },
      { period: 'Week 39', receipts: 35, issues: 48, balanceNet: -13 },
      { period: 'Week 40', receipts: 80, issues: 64, balanceNet: 16 },
      { period: 'Week 41', receipts: 50, issues: 58, balanceNet: -8 },
      { period: 'Week 42', receipts: 75, issues: 68, balanceNet: 7 },
    ];
  }, []);

  // 4. Pitch Turf Moisture vs Target Rolling Range
  const pitchMoistureData = [
    { pitch: 'Match Pitch #1', moisture: 14.8, targetMin: 14.0, targetMax: 16.0, status: 'Ready' },
    { pitch: 'Practice Pitch #2', moisture: 15.2, targetMin: 14.0, targetMax: 16.0, status: 'Ready' },
    { pitch: 'Tournament Pitch #3', moisture: 14.6, targetMin: 14.0, targetMax: 16.0, status: 'Ready' },
    { pitch: 'Turf Net #1', moisture: 16.5, targetMin: 14.0, targetMax: 16.0, status: 'Drying' },
    { pitch: 'Turf Net #2', moisture: 14.2, targetMin: 14.0, targetMax: 16.0, status: 'Ready' },
    { pitch: 'Main Oval Outfield', moisture: 15.8, targetMin: 14.0, targetMax: 16.0, status: 'Optimal' },
  ];

  // Summary KPI Calculations
  const currentWeek = weeklyTaskData[weeklyTaskData.length - 1];
  const avgTurnover = useMemo(() => {
    if (inventoryTurnoverData.length === 0) return 0;
    const sum = inventoryTurnoverData.reduce((acc, curr) => acc + curr.turnoverRate, 0);
    return Number((sum / inventoryTurnoverData.length).toFixed(1));
  }, [inventoryTurnoverData]);

  const highVelocityCount = inventoryTurnoverData.filter(i => i.turnoverRate >= 6.0).length;
  const lowStockCount = inventory.filter(i => i.availableQuantity <= i.reorderThreshold).length;

  // Export report states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Consolidated summary KPIs for export
  const summaryKPIs = useMemo(() => {
    const pitchAvg = Number(
      (pitchMoistureData.reduce((acc, curr) => acc + curr.moisture, 0) / pitchMoistureData.length).toFixed(1)
    );
    return {
      weeklyVelocity: currentWeek.totalCompleted,
      completionRate: currentWeek.completionRate,
      avgTurnover,
      pitchMoistureAvg: pitchAvg,
      totalSKUs: inventory.length,
      lowStockCount,
      highVelocityCount
    };
  }, [currentWeek, avgTurnover, lowStockCount, highVelocityCount, inventory.length]);

  const timeRangeLabel = useMemo(() => {
    return timeRange === '4W' ? '4 Weeks Rolling' : timeRange === '6W' ? '6 Weeks Rolling' : '2026 Full Season';
  }, [timeRange]);

  const handleExportPDF = () => {
    try {
      const filename = exportOperationsPDF({
        timeRange,
        timeRangeLabel,
        currentUser,
        weeklyTaskData,
        inventoryTurnoverData,
        pitchMoistureData,
        logisticsFlowData: stockMovementVelocity,
        summaryKPIs
      });
      if (onShowToast) {
        onShowToast('success', 'PDF Report Downloaded', `"${filename}" saved successfully.`);
      }
      setShowExportDropdown(false);
    } catch (err) {
      console.error('PDF export error:', err);
      if (onShowToast) {
        onShowToast('error', 'Export Failed', 'Could not generate PDF report file.');
      }
    }
  };

  const handleExportCSV = () => {
    try {
      const filename = exportOperationsCSV({
        timeRange,
        timeRangeLabel,
        currentUser,
        weeklyTaskData,
        inventoryTurnoverData,
        pitchMoistureData,
        logisticsFlowData: stockMovementVelocity,
        summaryKPIs
      });
      if (onShowToast) {
        onShowToast('success', 'CSV Spreadsheet Downloaded', `"${filename}" saved successfully.`);
      }
      setShowExportDropdown(false);
    } catch (err) {
      console.error('CSV export error:', err);
      if (onShowToast) {
        onShowToast('error', 'Export Failed', 'Could not generate CSV report file.');
      }
    }
  };

  const handleExportSummary = () => {
    setShowExportDropdown(!showExportDropdown);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Gahanga Cricket Stadium · Operations Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Operations Dashboard
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Comprehensive telemetry of groundskeeping task completion velocity, consumable and asset inventory turnover, pitch rolling readiness, and stadium logistical throughput.
            </p>
          </div>

          {/* Action Header Controls: Mobile-First Responsive Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            {/* Time Period Filter */}
            <div className="flex items-center justify-between sm:justify-start p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTimeRange('4W')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  timeRange === '4W' ? 'bg-teal-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                4 Weeks
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('6W')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  timeRange === '6W' ? 'bg-teal-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                6 Weeks
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('SEASON')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  timeRange === 'SEASON' ? 'bg-teal-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2026 Season
              </button>
            </div>

            {/* Export Report Dropdown & Quick Actions */}
            <div className="relative w-full sm:w-auto flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700/90 text-slate-100 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer shadow-xs min-h-[40px]"
                  title="Export Performance Analytics Report as PDF or CSV"
                  aria-expanded={showExportDropdown}
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Export Report</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showExportDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowExportDropdown(false)} 
                      aria-hidden="true" 
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-72 max-w-[calc(100vw-32px)] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-2.5 py-1.5 border-b border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Performance Analytics Export
                        </span>
                        <span className="text-[11px] text-slate-300 block truncate">
                          Horizon: {timeRangeLabel}
                        </span>
                      </div>

                      <div className="py-1 space-y-1">
                        {/* Option 1: PDF */}
                        <button
                          type="button"
                          onClick={handleExportPDF}
                          className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-slate-800 transition-colors cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-100 group-hover:text-teal-300">
                                Export as PDF Report
                              </span>
                              <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-950/80 px-1.5 rounded border border-rose-900">
                                PDF
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Formatted A4 executive report with tables &amp; scorecard
                            </span>
                          </div>
                        </button>

                        {/* Option 2: CSV */}
                        <button
                          type="button"
                          onClick={handleExportCSV}
                          className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-slate-800 transition-colors cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-100 group-hover:text-teal-300">
                                Export as CSV Dataset
                              </span>
                              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 rounded border border-emerald-900">
                                CSV
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                              Structured tabular data for Excel &amp; Google Sheets
                            </span>
                          </div>
                        </button>

                        {/* Option 3: Customize */}
                        <div className="pt-1 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              setShowExportDropdown(false);
                              setIsExportModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-slate-800 text-teal-300 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Customize Report Modules &amp; Scope...</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick direct download buttons visible on sm+ screens */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium min-h-[40px]"
                  title="Quick 1-click Download PDF Report"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px] font-mono font-semibold">PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium min-h-[40px]"
                  title="Quick 1-click Download CSV Data"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-mono font-semibold">CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Operational KPI Pulse Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          {/* KPI 1: Tasks Completed Per Week */}
          <div className="p-3 sm:p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Weekly Tasks</span>
              <span className="flex items-center text-emerald-400 text-[11px] font-semibold shrink-0">
                <ArrowUpRight className="w-3 h-3" />
                +26.6%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {currentWeek.totalCompleted} <span className="text-xs font-normal text-slate-400">tasks/wk</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              Target: {currentWeek.target} · {currentWeek.completionRate}% on-time
            </p>
          </div>

          {/* KPI 2: Inventory Turnover Rate */}
          <div className="p-3 sm:p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Avg Turnover</span>
              <span className="flex items-center text-teal-400 text-[11px] font-semibold shrink-0">
                <TrendingUp className="w-3 h-3" />
                Healthy
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-teal-300 tabular-nums">
              {avgTurnover}x <span className="text-xs font-normal text-slate-400">turns/yr</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              Benchmark: &gt;4.0x · {highVelocityCount} fast lines
            </p>
          </div>

          {/* KPI 3: Pitch Turf Readiness */}
          <div className="p-3 sm:p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Turf Moisture</span>
              <span className="flex items-center text-emerald-400 text-[11px] font-semibold shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Optimal
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              14.8% <span className="text-xs font-normal text-slate-400">strip #3</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              Target: 14.0% - 16.0% window
            </p>
          </div>

          {/* KPI 4: Stock Reserves & Restock */}
          <div className="p-3 sm:p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Stores Fulfill</span>
              <span className="flex items-center text-sky-400 text-[11px] font-semibold shrink-0">
                <Package className="w-3 h-3" />
                96.4%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-sky-300 tabular-nums">
              {inventory.length} <span className="text-xs font-normal text-slate-400">SKUs</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              {lowStockCount > 0 ? `${lowStockCount} below safety reserve` : 'Above safety threshold'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart 1 (Weekly Task Velocity) & Chart 2 (Inventory Turnover) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* =========================================================================
            CHART 1: TASKS COMPLETED PER WEEK (VELOCITY BY DEPARTMENT)
            ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                <h3 className="text-sm font-bold text-slate-100">
                  Weekly Task Completion Velocity
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Completed work packages per week grouped by department
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-teal-400 bg-teal-950/70 border border-teal-800/60 px-2 py-0.5 rounded">
                Avg 21.2 tasks/wk
              </span>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={weeklyTaskData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  domain={[0, 30]}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[200px]">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">
                            {label}
                          </p>
                          <div className="flex items-center justify-between text-emerald-400">
                            <span>Pitch & Turf:</span>
                            <span className="font-mono font-semibold">{data.groundPitch}</span>
                          </div>
                          <div className="flex items-center justify-between text-teal-400">
                            <span>Cricket Ops:</span>
                            <span className="font-mono font-semibold">{data.cricketOps}</span>
                          </div>
                          <div className="flex items-center justify-between text-sky-400">
                            <span>Stores / Inventory:</span>
                            <span className="font-mono font-semibold">{data.storesAudit}</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-400">
                            <span>Administration & VIP:</span>
                            <span className="font-mono font-semibold">{data.facilityVip}</span>
                          </div>
                          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between font-bold text-white">
                            <span>Total Completed:</span>
                            <span className="font-mono text-teal-300">{data.totalCompleted} tasks</span>
                          </div>
                          <div className="text-[10px] text-slate-500 text-right">
                            On-Time Compliance: {data.completionRate}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
                <Bar dataKey="groundPitch" name="Pitch & Turf" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="cricketOps" name="Cricket Ops" stackId="a" fill="#0D9488" radius={[0, 0, 0, 0]} />
                <Bar dataKey="storesAudit" name="Stores & Audits" stackId="a" fill="#0EA5E9" radius={[0, 0, 0, 0]} />
                <Bar dataKey="facilityVip" name="Facility / VIP" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Planned Velocity" 
                  stroke="#F43F5E" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#F43F5E' }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Avg Weekly Velocity</span>
              <span className="font-bold text-slate-200 font-mono">21.2 tasks</span>
            </div>
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Current Peak</span>
              <span className="font-bold text-emerald-400 font-mono">25 tasks (W41)</span>
            </div>
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Supervisor Sign-offs</span>
              <span className="font-bold text-teal-300 font-mono">98% Verified</span>
            </div>
            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Avg Cycle Time</span>
              <span className="font-bold text-sky-400 font-mono">1.8 Days</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CHART 2: INVENTORY TURNOVER RATES FOR GAHANGA CRICKET STADIUM
            ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <h3 className="text-sm font-bold text-slate-100">
                  GCS Inventory Turnover Rates
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Annualized turns per item line vs GCS benchmark threshold (4.0x)
              </p>
            </div>

            {/* Filter Toggle for Consumable vs Asset */}
            <div className="flex items-center gap-1.5 p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setInventoryViewType('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  inventoryViewType === 'ALL' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setInventoryViewType('CONSUMABLE')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  inventoryViewType === 'CONSUMABLE' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Consumables
              </button>
              <button
                onClick={() => setInventoryViewType('REUSABLE_ASSET')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  inventoryViewType === 'REUSABLE_ASSET' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Assets
              </button>
            </div>
          </div>

          {/* Recharts BarChart for Turnover Ratio */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryTurnoverData.slice(0, 8)}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="sku" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  domain={[0, 10]}
                  unit="x"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[220px]">
                          <div className="border-b border-slate-800 pb-1">
                            <span className="text-[10px] text-teal-400 font-mono block">{item.sku}</span>
                            <strong className="text-slate-200 text-xs block">{item.name}</strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Turnover Rate:</span>
                            <span className="font-mono font-bold text-emerald-400">{item.turnoverRate}x / year</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Monthly Dispatched:</span>
                            <span className="font-mono">{item.dispatchedMonthly} units</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Stock on Hand:</span>
                            <span className="font-mono text-slate-200">{item.available} units</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Est. Days of Supply:</span>
                            <span className="font-mono text-teal-300">{item.daysSupplyRemaining} days</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  y={4.0} 
                  stroke="#F59E0B" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: 'Min Benchmark 4.0x', 
                    fill: '#F59E0B', 
                    fontSize: 10, 
                    position: 'insideTopRight' 
                  }} 
                />
                <Bar dataKey="turnoverRate" radius={[4, 4, 0, 0]}>
                  {inventoryTurnoverData.slice(0, 8).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.turnoverRate >= 7.0 
                          ? '#10B981' 
                          : entry.turnoverRate >= 4.0 
                          ? '#0EA5E9' 
                          : '#64748B'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80 text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span>High Velocity (&gt;7.0x)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-500"></span>
                <span>Standard (4.0x - 7.0x)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-500"></span>
                <span>Long-Life Asset</span>
              </span>
            </div>
            <span className="font-mono text-slate-400 text-[11px] hidden sm:inline">
              Overall Average: <strong className="text-teal-400">{avgTurnover}x</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Logistics Flow & Pitch Preparation Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Logistics Inflow vs Outflow Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                <h3 className="text-sm font-bold text-slate-100">
                  Stores Movement Flow: Receipts vs Issues
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Incoming deliveries vs gear issued to pitch teams and coaching squads
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
              Positive Stock Rotation
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stockMovementVelocity}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="receiptsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="issuesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 90]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
                          <div className="flex justify-between text-emerald-400 gap-4">
                            <span>Receipts (Incoming):</span>
                            <span className="font-mono font-bold">+{data.receipts} units</span>
                          </div>
                          <div className="flex justify-between text-sky-400 gap-4">
                            <span>Dispatched (Issues):</span>
                            <span className="font-mono font-bold">-{data.issues} units</span>
                          </div>
                          <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800 font-bold">
                            <span>Net Movement:</span>
                            <span className="font-mono text-teal-300">{data.balanceNet > 0 ? `+${data.balanceNet}` : data.balanceNet}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="receipts" name="Incoming Stock Receipts" stroke="#10B981" fillOpacity={1} fill="url(#receiptsGradient)" />
                <Area type="monotone" dataKey="issues" name="Dispatched Stock to Pitch" stroke="#0EA5E9" fillOpacity={1} fill="url(#issuesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pitch Rolling Moisture & Readiness Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="text-sm font-bold text-slate-100">
                Pitch Moisture Rolling Index
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gahanga oval clay moisture vs ICC ODI standard (14-16%)
            </p>
          </div>

          <div className="space-y-3">
            {pitchMoistureData.map((strip, idx) => {
              const inRange = strip.moisture >= strip.targetMin && strip.moisture <= strip.targetMax;
              return (
                <div key={idx} className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{strip.pitch}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      inRange ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                    }`}>
                      {strip.moisture}% ({strip.status})
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        inRange ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, (strip.moisture / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-teal-950/30 border border-teal-800/40 rounded-xl text-[11px] text-teal-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Main pitch rolling cycles for upcoming matches are verified within tournament moisture tolerances.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Operational Inventory Turnover Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Gahanga Inventory Velocity & Turnover Matrix</span>
              <span className="text-[11px] font-mono text-teal-400 bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded">
                {inventoryTurnoverData.length} Tracked Lines
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Item-level stock velocity, monthly consumption rate, and replenishment reserve health
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors min-h-[38px] sm:min-h-[34px]"
              title="Download entire matrix & KPIs as CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors min-h-[38px] sm:min-h-[34px]"
              title="Download official stadium analytics report as PDF"
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>Export PDF</span>
            </button>
            {onNavigateSection && (
              <button
                type="button"
                onClick={() => onNavigateSection('inventory')}
                className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[38px] sm:min-h-[34px]"
              >
                <span>Manage Stores</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Card View (phones & small tablets) */}
        <div className="block md:hidden divide-y divide-slate-800/80">
          {inventoryTurnoverData.map((item) => (
            <div key={item.id} className="p-3.5 space-y-2.5 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-teal-400 block">{item.sku}</span>
                  <strong className="text-xs font-bold text-slate-100">{item.name}</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {item.type === 'CONSUMABLE' ? 'Consumable' : 'Reusable Asset'}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`font-mono text-xs font-bold ${
                    item.turnoverRate >= 7.0 
                      ? 'text-emerald-400' 
                      : item.turnoverRate >= 4.0 
                      ? 'text-sky-400' 
                      : 'text-slate-400'
                  }`}>
                    {item.turnoverRate}x / yr
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {item.daysSupplyRemaining}d reserve
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] bg-slate-950/60 p-2 rounded-lg">
                <span className="text-slate-400">
                  Stock: <strong className="text-slate-200 font-mono">{item.available} / {item.total}</strong>
                </span>
                <span className="text-slate-400 font-mono">
                  Outflow: <strong className="text-slate-300">{item.dispatchedMonthly}</strong>/mo
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-400">Replenishment Status:</span>
                {item.status === 'LOW_STOCK' ? (
                  <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold text-[10px]">
                    Reorder Required
                  </span>
                ) : item.status === 'HIGH_VELOCITY' ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold text-[10px]">
                    Fast Rotation
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[10px]">
                    Optimal Reserve
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">SKU & Item Name</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Available Stock</th>
                <th className="px-4 py-3">Monthly Outflow</th>
                <th className="px-4 py-3">Annualized Turnover</th>
                <th className="px-4 py-3">Days of Supply</th>
                <th className="px-4 py-3">Replenishment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {inventoryTurnoverData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-teal-400 block">{item.sku}</span>
                    <strong className="text-slate-100 block">{item.name}</strong>
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.type === 'CONSUMABLE' ? 'Consumable' : 'Reusable Asset'}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono font-semibold text-slate-200">
                    {item.available} / {item.total}
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-300">
                    {item.dispatchedMonthly} units/mo
                  </td>

                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold ${
                      item.turnoverRate >= 7.0 
                        ? 'text-emerald-400' 
                        : item.turnoverRate >= 4.0 
                        ? 'text-sky-400' 
                        : 'text-slate-400'
                    }`}>
                      {item.turnoverRate}x / yr
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-300">
                    {item.daysSupplyRemaining} days
                  </td>

                  <td className="px-4 py-3">
                    {item.status === 'LOW_STOCK' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold text-[10px]">
                        Reorder Required
                      </span>
                    ) : item.status === 'HIGH_VELOCITY' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold text-[10px]">
                        Fast Rotation
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[10px]">
                        Optimal Reserve
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Report Configuration & Preview Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        currentUser={currentUser}
        weeklyTaskData={weeklyTaskData}
        inventoryTurnoverData={inventoryTurnoverData}
        pitchMoistureData={pitchMoistureData}
        logisticsFlowData={stockMovementVelocity}
        summaryKPIs={summaryKPIs}
        onShowToast={onShowToast}
      />
    </div>
  );
};
