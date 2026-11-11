import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Building2, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import { User, Role } from '../../types';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../i18n/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  availableUsers: User[];
  onLogin: (user: User) => void;
  onLogout?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  availableUsers,
  onLogin,
  onLogout,
  onShowToast
}) => {
  const { t, language } = useLanguage();
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [pinInput, setPinInput] = useState('');
  const [usePinMode, setUsePinMode] = useState(false);

  const selectedUser = availableUsers.find((u) => u.id === selectedUserId) || currentUser;

  const roleLabels: Record<Role, string> = {
    CRICKET_OPERATIONS_MANAGER: t('role_manager'),
    SUPERVISOR: t('role_supervisor'),
    STOREKEEPER: t('role_storekeeper'),
    STAFF: t('role_staff'),
    SYSTEM_ADMIN: t('role_admin')
  };

  const getRolePermissionsSummary = (role: Role) => {
    switch (role) {
      case 'CRICKET_OPERATIONS_MANAGER':
        return {
          badge: 'Executive & Match Operations Level',
          color: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
          permissions: [
            'Access Executive Manager Workspace & KPI Analytics',
            'Create, Assign, and Sign-Off/Approve Operational Tasks',
            'Broadcast Official Bulletins & Emergency Curfew Announcements',
            'Full Inventory & Logistics Requisition Authority'
          ]
        };
      case 'SYSTEM_ADMIN':
        return {
          badge: 'System Governance & Security Level',
          color: 'text-rose-400 bg-rose-950/60 border-rose-800/80',
          permissions: [
            'Full Governance over System Audit Logs & Activity History',
            'Manage Staff Roles & Access Permission Matrix',
            'Full Administrative Control over Stadium Facilities & Assets',
            'Manage User Accounts & Credentials'
          ]
        };
      case 'SUPERVISOR':
        return {
          badge: 'Ground & Pitch Supervision Level',
          color: 'text-teal-400 bg-teal-950/60 border-teal-800/80',
          permissions: [
            'Create & Assign Matchday Operations & Pitch Tasks',
            'Review Submitted Ground & Turf Inspection Reports',
            'Manage Stadium Calendar Events & Pitch Schedules',
            'Issue Requisition Requests for Machinery & Equipment'
          ]
        };
      case 'STOREKEEPER':
        return {
          badge: 'Stores & Equipment Custodian Level',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80',
          permissions: [
            'Full Control over Store Inventory, Receiving & Issuing',
            'Process & Approve Equipment Requisitions & Returns',
            'Log Damaged & Lost Gear with Serial Quarantine',
            'Generate Stock Turnover & Inventory Audit Statements'
          ]
        };
      case 'STAFF':
      default:
        return {
          badge: 'Operational Execution Level',
          color: 'text-sky-400 bg-sky-950/60 border-sky-800/80',
          permissions: [
            'View & Execute Assigned Field & Ground Work Tasks',
            'Submit Completion Reports with Evidence & Photos',
            'Request Equipment for Operations from Storekeeper',
            'Direct Messaging with Staff & Viewing Announcements'
          ]
        };
    }
  };

  const handleExecuteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usePinMode && pinInput.length > 0 && pinInput !== '1234' && pinInput !== '2026') {
      if (onShowToast) {
        onShowToast('error', 'Invalid Passcode', 'The passcode entered is incorrect. (Use 1234 or 2026 for demo access)');
      }
      return;
    }

    onLogin(selectedUser);
    setPinInput('');
    if (onShowToast) {
      onShowToast(
        'success',
        'Authentication Successful',
        `Authenticated as ${selectedUser.name} (${roleLabels[selectedUser.role]}). Access scope applied.`
      );
    }
    onClose();
  };

  const permDetails = getRolePermissionsSummary(selectedUser.role);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GCS Operational Authentication Gateway"
      subtitle="Sign in or authenticate under authorized staff role to access venue systems"
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Active Authenticated Session Banner */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-teal-950 border border-teal-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Current Active Session
              </p>
              <p className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-teal-400 truncate">{roleLabels[currentUser.role]}</p>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={() => {
                onLogout();
                if (onShowToast) {
                  onShowToast('info', 'Session Locked', 'Logged out of active account session.');
                }
              }}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch / Sign Out</span>
            </button>
          )}
        </div>

        {/* User Selection Grid */}
        <form onSubmit={handleExecuteLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Select Authorized Staff Account to Authenticate:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {availableUsers.map((user) => {
                const isSelected = user.id === selectedUserId;
                const userPerms = getRolePermissionsSummary(user.role);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-teal-950/80 border-teal-500 shadow-md ring-1 ring-teal-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-xs">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 truncate text-xs">{user.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-teal-400 block truncate font-medium">
                        {roleLabels[user.role]}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {user.department}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Account Role Permissions Scope Card */}
          <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Authorized Role Capabilities ({roleLabels[selectedUser.role]})</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${permDetails.color}`}>
                {permDetails.badge}
              </span>
            </div>

            <ul className="space-y-1 pt-1">
              {permDetails.permissions.map((perm, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-300 text-[11px]">
                  <ChevronRight className="w-3 h-3 text-teal-400 shrink-0" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Passcode / Direct Login Controls */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                <span>Authentication Passcode</span>
              </label>
              <button
                type="button"
                onClick={() => setUsePinMode(!usePinMode)}
                className="text-[11px] text-teal-400 hover:underline font-mono cursor-pointer"
              >
                {usePinMode ? 'Switch to Quick 1-Click Authenticate' : 'Enable Security PIN Check'}
              </button>
            </div>

            {usePinMode ? (
              <div>
                <input
                  type="password"
                  placeholder="Enter 4-digit staff PIN (Demo PIN: 1234 or 2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500 font-mono text-center tracking-widest text-sm"
                />
                <p className="text-[10px] text-slate-400 mt-1 italic text-center">
                  Enter official GCS staff PIN to sign in securely.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Single-tap authorized login is enabled for seamless operational testing. Select an account above and click Authenticate.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Authenticate & Sign In</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
