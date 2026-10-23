import React from 'react';
import { ShieldCheck, Check, X, KeyRound, AlertTriangle } from 'lucide-react';
import { Role } from '../../types';

export const RolePermissionsMatrix: React.FC = () => {
  const roles: { role: Role; label: string; desc: string }[] = [
    {
      role: 'SUPERVISOR',
      label: 'Supervisor / Director',
      desc: 'Assigns operational tasks, reviews submitted reports, approves deliverables, and broadcasts official stadium policies.'
    },
    {
      role: 'CRICKET_OPERATIONS_MANAGER',
      label: 'Cricket Operations Manager',
      desc: 'Oversees match fixtures, training schedules, team logistics, pitches, and coordinates report submissions to the supervisor.'
    },
    {
      role: 'STOREKEEPER',
      label: 'Storekeeper & Equipment Custodian',
      desc: 'Controls physical intake, dispatch, returns, and inventory counts. Cannot approve own restricted transactions (separation of duties).'
    },
    {
      role: 'STAFF',
      label: 'Ground & Field Staff',
      desc: 'Executes physical pitch preparation, outfield mowing, crease marking, and reports completion.'
    },
    {
      role: 'SYSTEM_ADMIN',
      label: 'System Administrator',
      desc: 'Manages user accounts, permissions, audit visibility, and system configuration.'
    }
  ];

  const permissions = [
    { name: 'Assign Tasks & Set Deadlines', supervisor: true, manager: true, store: false, staff: false, admin: true },
    { name: 'Submit Task Completion Reports', supervisor: true, manager: true, store: true, staff: true, admin: false },
    { name: 'Approve Reports & Sign-Offs (Separation of Duties)', supervisor: true, manager: false, store: false, staff: false, admin: false },
    { name: 'Request Revisions on Submitted Reports', supervisor: true, manager: false, store: false, staff: false, admin: false },
    { name: 'Submit Equipment Requisitions', supervisor: true, manager: true, store: true, staff: true, admin: false },
    { name: 'Record Stock Receipts from Suppliers', supervisor: false, manager: true, store: true, staff: false, admin: true },
    { name: 'Issue Equipment to Teams & Fixtures', supervisor: false, manager: true, store: true, staff: false, admin: true },
    { name: 'Record Equipment Returns & Inspect Assets', supervisor: false, manager: true, store: true, staff: false, admin: true },
    { name: 'Flag Damaged Stock to Quarantine', supervisor: true, manager: true, store: true, staff: false, admin: true },
    { name: 'Broadcast Official Announcements', supervisor: true, manager: true, store: false, staff: false, admin: true },
    { name: 'Access Authenticated Staff Messaging', supervisor: true, manager: true, store: true, staff: true, admin: true },
    { name: 'View Full Operational Audit Trail', supervisor: true, manager: true, store: false, staff: false, admin: true },
    { name: 'Manage System Users & Roles', supervisor: false, manager: false, store: false, staff: false, admin: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Role-Based Access Control (RBAC) Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Server-enforced authorization rules, separation of duties, and operational capability boundaries
        </p>
      </div>

      {/* Separation of Duties Callout */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-semibold text-slate-200">
            Enforced Governance Rule: Separation of Duties
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Assignees cannot approve their own submitted reports. Storekeepers cannot approve their own stock requisitions or adjustments. Audit records are immutable and cannot be deleted by standard users.
          </p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 min-w-[240px]">Operational Capability</th>
                <th className="px-3 py-3 text-center">Supervisor</th>
                <th className="px-3 py-3 text-center">Cricket Ops Mgr</th>
                <th className="px-3 py-3 text-center">Storekeeper</th>
                <th className="px-3 py-3 text-center">Staff</th>
                <th className="px-3 py-3 text-center">System Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200">
                    {p.name}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {p.supervisor ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {p.manager ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {p.store ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {p.staff ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {p.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Descriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div key={r.role} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-100">{r.label}</h3>
              <span className="text-[10px] font-mono text-teal-400">{r.role}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
