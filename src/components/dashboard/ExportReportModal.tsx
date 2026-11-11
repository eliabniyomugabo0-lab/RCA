import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Layers,
  BarChart3,
  Package,
  Wrench,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { User } from '../../types';
import {
  ExportReportOptions,
  exportOperationsCSV,
  exportOperationsPDF,
  WeeklyTaskMetric,
  InventoryTurnoverMetric,
  PitchMoistureMetric,
  LogisticsFlowMetric
} from '../../utils/reportExporter';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRange: '4W' | '6W' | 'SEASON';
  onTimeRangeChange?: (range: '4W' | '6W' | 'SEASON') => void;
  currentUser?: User;
  weeklyTaskData: WeeklyTaskMetric[];
  inventoryTurnoverData: InventoryTurnoverMetric[];
  pitchMoistureData: PitchMoistureMetric[];
  logisticsFlowData: LogisticsFlowMetric[];
  summaryKPIs: {
    weeklyVelocity: number;
    completionRate: number;
    avgTurnover: number;
    pitchMoistureAvg: number;
    totalSKUs: number;
    lowStockCount: number;
    highVelocityCount: number;
  };
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  timeRange: initialTimeRange,
  onTimeRangeChange,
  currentUser,
  weeklyTaskData,
  inventoryTurnoverData,
  pitchMoistureData,
  logisticsFlowData,
  summaryKPIs,
  onShowToast
}) => {
  const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [selectedRange, setSelectedRange] = useState<'4W' | '6W' | 'SEASON'>(initialTimeRange);
  const [isExporting, setIsExporting] = useState(false);

  // Sections toggle
  const [sections, setSections] = useState({
    kpis: true,
    taskVelocity: true,
    inventoryTurnover: true,
    pitchMoisture: true,
    logisticsFlow: true
  });

  const timeRangeLabels: Record<'4W' | '6W' | 'SEASON', string> = {
    '4W': '4 Weeks Rolling Horizon',
    '6W': '6 Weeks Rolling Horizon',
    'SEASON': '2026 Full Season'
  };

  const handleToggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTimeRangeSelect = (range: '4W' | '6W' | 'SEASON') => {
    setSelectedRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  const handleExecuteExport = async (targetFormat: 'PDF' | 'CSV') => {
    setIsExporting(true);
    try {
      const options: ExportReportOptions = {
        timeRange: selectedRange,
        timeRangeLabel: timeRangeLabels[selectedRange],
        currentUser,
        weeklyTaskData,
        inventoryTurnoverData,
        pitchMoistureData,
        logisticsFlowData,
        summaryKPIs,
        includeSections: sections
      };

      if (targetFormat === 'PDF') {
        const filename = exportOperationsPDF(options);
        if (onShowToast) {
          onShowToast(
            'success',
            'PDF Report Generated',
            `"${filename}" downloaded successfully to your device.`
          );
        }
      } else {
        const filename = exportOperationsCSV(options);
        if (onShowToast) {
          onShowToast(
            'success',
            'CSV Export Generated',
            `"${filename}" spreadsheet downloaded successfully.`
          );
        }
      }

      onClose();
    } catch (err) {
      console.error('Export error:', err);
      if (onShowToast) {
        onShowToast('error', 'Export Failed', 'An unexpected error occurred while compiling the report.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const projectedFilename = `GCS_Operations_Performance_Report_${todayStr}.${format.toLowerCase()}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Operations Performance Report"
      subtitle="Generate official executive analytics dossiers as formatted PDF documents or structured CSV datasets"
      maxWidth="xl"
    >
      <div className="space-y-5 text-slate-100">
        {/* Step 1: Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            1. Select Export Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option A: PDF Report */}
            <button
              type="button"
              onClick={() => setFormat('PDF')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                format === 'PDF'
                  ? 'bg-teal-950/60 border-teal-500 shadow-md ring-1 ring-teal-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">PDF Executive Report</span>
                  {format === 'PDF' && (
                    <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Official formatted multi-page report with stadium header, executive KPI scorecard, and structured tables.
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800/80">
                    A4 Portrait
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    Print &amp; Share Ready
                  </span>
                </div>
              </div>
            </button>

            {/* Option B: CSV Data File */}
            <button
              type="button"
              onClick={() => setFormat('CSV')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                format === 'CSV'
                  ? 'bg-teal-950/60 border-teal-500 shadow-md ring-1 ring-teal-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">CSV Data Spreadsheet</span>
                  {format === 'CSV' && (
                    <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Clean tabular dataset with UTF-8 BOM encoding, ready for Microsoft Excel, Google Sheets, or data analysis.
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
                    Raw Data
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    Excel &amp; BI Compatible
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Reporting Period Horizon */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            2. Reporting Horizon
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['4W', '6W', 'SEASON'] as const).map((r) => {
              const isSelected = selectedRange === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleTimeRangeSelect(r)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-medium ${
                    isSelected
                      ? 'bg-teal-600 border-teal-500 text-white font-semibold shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="block">{r === '4W' ? '4 Weeks' : r === '6W' ? '6 Weeks' : '2026 Season'}</span>
                  <span className="text-[9px] opacity-75 block truncate">
                    {r === '4W' ? 'Last Month' : r === '6W' ? 'Current Cycle' : 'All Fixtures'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Modules to Include in Dossier */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3. Analytics Modules to Include
            </label>
            <span className="text-[10px] text-teal-400 font-mono">
              {Object.values(sections).filter(Boolean).length} of 5 selected
            </span>
          </div>

          <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            {[
              {
                id: 'kpis',
                label: 'Executive Performance Scorecard',
                desc: 'Weekly velocity, on-time compliance rate, average turnover, and pitch readiness stats',
                icon: BarChart3
              },
              {
                id: 'taskVelocity',
                label: 'Weekly Task Velocity Matrix',
                desc: 'Department breakdown (Ground & Pitch, Cricket Ops, Stores, Facility/VIP)',
                icon: TrendingUp
              },
              {
                id: 'inventoryTurnover',
                label: 'Inventory Turnover & Consumption Velocity',
                desc: 'SKUs, available stock, monthly dispatched units, turnover rates, and reorder alerts',
                icon: Package
              },
              {
                id: 'pitchMoisture',
                label: 'Pitch Turf Moisture & Rolling Readiness',
                desc: 'Main match pitches, practice nets, and outfield moisture telemetry vs tournament tolerances',
                icon: Wrench
              },
              {
                id: 'logisticsFlow',
                label: 'Stores Logistics Movements (Receipts vs Issues)',
                desc: 'Stock inflow receipts, dispatched issue logs, and net stock replenishment balance',
                icon: Clock
              }
            ].map((moduleItem) => {
              const isChecked = sections[moduleItem.id as keyof typeof sections];
              const IconComp = moduleItem.icon;
              return (
                <label
                  key={moduleItem.id}
                  className={`flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer select-none ${
                    isChecked ? 'bg-slate-900/90 text-slate-100' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSection(moduleItem.id as keyof typeof sections)}
                    className="mt-1 rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-950 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">{moduleItem.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{moduleItem.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Live File Preview Card */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Target File Output:</span>
            </span>
            <span className="font-mono text-teal-400 truncate max-w-[220px]">
              {projectedFilename}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-900">
            <span>Prepared for: <strong className="text-slate-400">{currentUser?.name || 'Hagenimana Damascene'}</strong></span>
            <span>·</span>
            <span>Facility: <strong className="text-slate-400">Gahanga Cricket Stadium, Kigali</strong></span>
          </div>
        </div>

        {/* Action Buttons: Responsive & Touch-friendly */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExecuteExport(format)}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting ? 'Generating Report...' : `Download ${format} Report`}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
