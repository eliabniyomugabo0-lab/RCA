import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  FileText,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs, onShowToast }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;
    return matchesSearch && matchesEntity;
  });

  const handleExportAuditCSV = () => {
    const headers = ['Timestamp,Actor,Role,Action,Entity Type,Entity ID,Details,Severity'];
    const rows = logs.map(l => 
      `"${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.entityType}","${l.entityId}","${l.details.replace(/"/g, '""')}","${l.severity}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GCS_Operations_AuditTrail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('success', 'Audit Export Complete', 'Downloaded tamper-evident compliance audit trail.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t('nav.audit', 'Audit Trail & Compliance')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable tracking of task assignments, report approvals, stock movements, and permissions
          </p>
        </div>

        <button
          onClick={handleExportAuditCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('action.export_audit', 'Export Audit Log')}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('action.search', 'Search audit trail by actor, action, or description...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          aria-label="Filter audit logs by entity type"
          className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-hidden focus:border-teal-500"
        >
          <option value="ALL">All Entity Types</option>
          <option value="TASK">Tasks</option>
          <option value="REPORT">Reports & Sign-Offs</option>
          <option value="STOCK_MOVEMENT">Stock Movements</option>
          <option value="ANNOUNCEMENT">Announcements</option>
          <option value="USER_ACCESS">User Access & RBAC</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor & Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3">Audit Details</th>
                <th className="px-4 py-3 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-slate-200 block">{log.actorName}</span>
                    <span className="text-[10px] text-teal-400 font-mono">{log.actorRole}</span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-semibold text-slate-300">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {log.entityType} ({log.entityId})
                  </td>

                  <td className="px-4 py-3 text-slate-300 text-xs leading-relaxed max-w-md">
                    {log.details}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      log.severity === 'SECURITY' ? 'bg-rose-950/60 text-rose-400 border border-rose-800' :
                      log.severity === 'NOTICE' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
