import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Lock, 
  LogIn, 
  CheckCircle2, 
  ArrowLeft, 
  UserCheck, 
  Building2, 
  Sparkles, 
  Layers, 
  Check, 
  AlertCircle,
  QrCode,
  CreditCard,
  ChevronRight,
  Info
} from 'lucide-react';
import { User, Role } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import stadiumExteriorImg from '../../assets/images/gcs_stadium_exterior_1791894260939.jpg';
import gcsPavilionImg from '../../assets/images/gcs_pavilion_vaults_1792306844132.jpg';

interface LoginPageProps {
  availableUsers: User[];
  onLogin: (user: User) => void;
  onBackToLanding: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

type AuthTab = 'personas' | 'credentials' | 'pin';

export const LoginPage: React.FC<LoginPageProps> = ({
  availableUsers,
  onLogin,
  onBackToLanding,
  onShowToast
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AuthTab>('personas');

  // Selected persona
  const [selectedUserId, setSelectedUserId] = useState<string>(availableUsers[0]?.id || '');

  // Credentials tab state
  const [emailInput, setEmailInput] = useState('damascene@gcs.rw');
  const [passwordInput, setPasswordInput] = useState('cricket2026');
  const [rememberMe, setRememberMe] = useState(true);

  // PIN tab state
  const [pinCode, setPinCode] = useState('');
  const [rfidBadge, setRfidBadge] = useState('RCA-GCS-PASS-088');

  const roleLabels: Record<Role, string> = {
    CRICKET_OPERATIONS_MANAGER: t('role_manager'),
    SUPERVISOR: t('role_supervisor'),
    STOREKEEPER: t('role_storekeeper'),
    STAFF: t('role_staff'),
    SYSTEM_ADMIN: t('role_admin')
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'CRICKET_OPERATIONS_MANAGER':
        return { label: 'Executive Operations', color: 'bg-amber-950/80 text-amber-300 border-amber-800' };
      case 'SYSTEM_ADMIN':
        return { label: 'System Admin', color: 'bg-rose-950/80 text-rose-300 border-rose-800' };
      case 'SUPERVISOR':
        return { label: 'Field Supervisor', color: 'bg-teal-950/80 text-teal-300 border-teal-800' };
      case 'STOREKEEPER':
        return { label: 'Stores Custodian', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' };
      case 'STAFF':
      default:
        return { label: 'Ground Staff Lead', color: 'bg-sky-950/80 text-sky-300 border-sky-800' };
    }
  };

  const getRoleCapabilities = (role: Role): string[] => {
    switch (role) {
      case 'CRICKET_OPERATIONS_MANAGER':
        return [
          'Executive KPI Workspace & Operations Overview',
          'Create, Assign, and Approve Match Preparation Tasks',
          'Broadcast Official Curfew & Operational Announcements',
          'Full Requisition & Material Flow Oversight'
        ];
      case 'SUPERVISOR':
        return [
          'Pitch & Turf Supervision and Inspection',
          'Sign-Off & Approve Submitted Task Evidence Reports',
          'Manage Stadium Calendar Events & Practice Slots',
          'Submit Machinery & Material Requisitions'
        ];
      case 'STOREKEEPER':
        return [
          'Full Storehouse Intake, Receiving & Inventory Control',
          'Issue Equipment to National Teams & Match Officials',
          'Log Damaged & Lost Gear with Serial Quarantine',
          'Generate Material Flow & Requisition Ledgers'
        ];
      case 'STAFF':
        return [
          'Execute Assigned Match Wicket & Field Tasks',
          'Submit Detailed Completion Reports with Photo Evidence',
          'Request Equipment from Stores Custodian',
          'Direct Messaging & Bulletin Board Access'
        ];
      case 'SYSTEM_ADMIN':
        return [
          'Full System Governance & Activity Audit Logs',
          'Role Permissions Matrix & User Credential Management',
          'Infrastructure & Floodlight Asset Configuration',
          'Global Data Maintenance & System Reset'
        ];
    }
  };

  // Submit via Persona Card
  const handlePersonaLogin = (user: User) => {
    onLogin(user);
    onShowToast('success', 'Authenticated Successfully', `Welcome back, ${user.name} (${roleLabels[user.role]}).`);
  };

  // Submit via Email & Password
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      onShowToast('error', 'Authentication Failed', 'Please provide a valid staff email address.');
      return;
    }

    // Match by email or fallback to first matching role/name
    const foundUser = availableUsers.find(
      (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    ) || availableUsers[0];

    onLogin(foundUser);
    onShowToast('success', 'Authenticated Successfully', `Signed in as ${foundUser.name} (${roleLabels[foundUser.role]}).`);
  };

  // Quick autofill credentials
  const autofillCredentials = (user: User) => {
    setEmailInput(user.email);
    setPasswordInput('cricket2026');
    setSelectedUserId(user.id);
  };

  // Submit via PIN
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode && pinCode !== '1234' && pinCode !== '2026') {
      onShowToast('error', 'Invalid PIN', 'Passcode incorrect. (Demo PIN: 1234 or 2026)');
      return;
    }

    const targetUser = availableUsers.find((u) => u.id === selectedUserId) || availableUsers[0];
    onLogin(targetUser);
    onShowToast('success', 'Security PIN Verified', `Authorized staff session created for ${targetUser.name}.`);
  };

  const selectedUser = availableUsers.find((u) => u.id === selectedUserId) || availableUsers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img 
          src={gcsPavilionImg} 
          alt="GCS Pavilion Background" 
          className="w-full h-full object-cover filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/80"></div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Venue Gateways Online</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-teal-500/25 shrink-0">
                GCS
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  GCS Operations Authentication
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gahanga Cricket Stadium · Role-Based Staff Management System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-950/90 text-teal-300 border border-teal-800/80 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>RBAC Security Enforced</span>
              </span>
            </div>
          </div>

          {/* Authentication Mode Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/60 p-1.5 sm:p-2 gap-1 text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('personas')}
              className={`py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[40px] text-center ${
                activeTab === 'personas'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">Personas</span>
                <span className="hidden sm:inline">1-Click Persona</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              className={`py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[40px] text-center ${
                activeTab === 'credentials'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">Password</span>
                <span className="hidden sm:inline">Email & Password</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pin')}
              className={`py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[40px] text-center ${
                activeTab === 'pin'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">PIN / RFID</span>
                <span className="hidden sm:inline">PIN / RFID Pass</span>
              </span>
            </button>
          </div>

          {/* Tab 1: 1-Click Staff Persona Cards */}
          {activeTab === 'personas' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Select Authorized Staff Account:
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a staff role to authenticate and immediately explore role-tailored features, workflows, and access boundaries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {availableUsers.map((user) => {
                  const badge = getRoleBadge(user.role);
                  const isSelected = user.id === selectedUserId;
                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-teal-950/70 border-teal-500 ring-1 ring-teal-500 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-sm text-white truncate">{user.name}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-teal-400 font-medium truncate mt-0.5">
                            {user.jobTitle}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {user.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-500 font-mono truncate">
                          {user.email}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePersonaLogin(user);
                          }}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Login As {user.name.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Role Scope Preview for Selected User */}
              {selectedUser && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>Authorized Permissions for {selectedUser.name} ({roleLabels[selectedUser.role]})</span>
                    </span>
                    <span className="text-[10px] font-mono text-teal-400">Enforced by RBAC Engine</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {getRoleCapabilities(selectedUser.role).map((cap, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="truncate">{cap}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handlePersonaLogin(selectedUser)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Authenticate as {selectedUser.name}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Standard Email & Password */}
          {activeTab === 'credentials' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Staff Account Credentials
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Log in with your official Gahanga Cricket Stadium staff credentials.
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Staff Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. damascene@gcs.rw"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Enter account password (demo: cricket2026)"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-500 focus:outline-hidden focus:border-teal-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-teal-600 focus:ring-0"
                    />
                    <span>Remember this session</span>
                  </label>
                  <span className="text-teal-400 text-[11px] font-mono">Demo: cricket2026</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Credentials</span>
                </button>
              </form>

              {/* Quick 1-Click Autofill Helpers */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Quick Autofill Authorized Accounts:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => autofillCredentials(user)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="font-semibold">{user.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-teal-400 font-mono">({roleLabels[user.role]})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Security PIN / RFID Passcode */}
          {activeTab === 'pin' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Staff Security PIN & RFID Gate Pass
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate using your 4-digit terminal passcode or RFID badge pass.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Staff Member
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-hidden focus:border-teal-500"
                  >
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {roleLabels[u.role]} ({u.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      4-Digit Security PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="1234 or 2026"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm text-center font-mono tracking-widest focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      RFID Pass ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RCA-GCS-PASS-088"
                      value={rfidBadge}
                      onChange={(e) => setRfidBadge(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Verify PIN & Access Workspace</span>
                </button>
              </form>

              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Demo Passcodes: Enter <strong>1234</strong> or <strong>2026</strong> to authenticate any staff profile. Leaving blank will also permit one-click authorization.
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 py-6 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <p>Gahanga Cricket Stadium Operations · Kigali, Rwanda · ICC Associate Member Facility</p>
      </footer>
    </div>
  );
};
