import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar,
  Package, 
  Users, 
  Megaphone, 
  ShieldCheck, 
  FileText,
  Building,
  KeyRound,
  RotateCcw,
  Camera,
  Globe,
  BarChart3,
  X,
  LogIn
} from 'lucide-react';
import { User, Role, ThemeMode } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

export type NavSection = 
  | 'workspace'
  | 'dashboard'
  | 'tasks'
  | 'calendar'
  | 'inventory'
  | 'facility'
  | 'directory'
  | 'communication'
  | 'audit'
  | 'roles';

export const isSectionAuthorizedForRole = (section: NavSection, role?: Role): boolean => {
  if (!role) return true;
  switch (section) {
    case 'workspace':
      // Manager and Supervisor have Executive Workspaces
      return role === 'CRICKET_OPERATIONS_MANAGER' || role === 'SUPERVISOR';
    case 'dashboard':
      // Manager, Supervisor, Admin have Analytics Dashboard access
      return role === 'CRICKET_OPERATIONS_MANAGER' || role === 'SUPERVISOR' || role === 'SYSTEM_ADMIN';
    case 'tasks':
    case 'calendar':
    case 'inventory':
    case 'facility':
    case 'directory':
    case 'communication':
      return true;
    case 'audit':
      // Only Manager, Supervisor, System Admin can view Audit trail
      return role === 'CRICKET_OPERATIONS_MANAGER' || role === 'SUPERVISOR' || role === 'SYSTEM_ADMIN';
    case 'roles':
      // Only System Admin and Cricket Operations Manager can manage Roles & RBAC Matrix
      return role === 'SYSTEM_ADMIN' || role === 'CRICKET_OPERATIONS_MANAGER';
    default:
      return true;
  }
};

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingTasksCount: number;
  lowStockCount: number;
  upcomingEventsCount?: number;
  currentUser?: User;
  onOpenProfile?: () => void;
  onOpenLandingPage?: () => void;
  onSelectRole?: (role: Role) => void;
  availableUsers?: User[];
  currentTheme?: ThemeMode;
  onSelectTheme?: (theme: ThemeMode) => void;
  onOpenLoginModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  pendingTasksCount,
  lowStockCount,
  upcomingEventsCount,
  currentUser,
  onOpenProfile,
  onOpenLandingPage,
  onSelectRole,
  availableUsers,
  currentTheme,
  onSelectTheme,
  onOpenLoginModal
}) => {
  const { t } = useLanguage();

  const roleLabels: Record<Role, string> = {
    CRICKET_OPERATIONS_MANAGER: t('role_manager'),
    SUPERVISOR: t('role_supervisor'),
    STOREKEEPER: t('role_storekeeper'),
    STAFF: t('role_staff'),
    SYSTEM_ADMIN: t('role_admin')
  };

  const THEMES: { id: ThemeMode; name: string; canvasColor: string; accentColor: string }[] = [
    { id: 'navy', name: 'Midnight', canvasColor: '#0B132B', accentColor: '#0D9488' },
    { id: 'turf', name: 'Turf', canvasColor: '#041411', accentColor: '#10B981' },
    { id: 'obsidian', name: 'OLED', canvasColor: '#09090B', accentColor: '#38BDF8' },
    { id: 'dusk', name: 'Dusk', canvasColor: '#0A0E1A', accentColor: '#6366F1' },
    { id: 'light', name: 'Light', canvasColor: '#F8FAFC', accentColor: '#0D9488' },
  ];

  const navItems: { id: NavSection; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'workspace', label: t('nav_workspace'), icon: LayoutDashboard },
    { id: 'dashboard', label: t('nav_dashboard'), icon: BarChart3 },
    { id: 'tasks', label: t('nav_tasks'), icon: CheckSquare, badge: pendingTasksCount },
    { id: 'calendar', label: t('nav_calendar'), icon: Calendar, badge: upcomingEventsCount },
    { id: 'inventory', label: t('nav_inventory'), icon: Package, badge: lowStockCount },
    { id: 'facility', label: t('nav_facility'), icon: Building },
    { id: 'directory', label: t('nav_directory'), icon: Users },
    { id: 'communication', label: t('nav_communication'), icon: Megaphone },
    { id: 'audit', label: t('nav_audit'), icon: ShieldCheck },
    { id: 'roles', label: t('nav_roles'), icon: KeyRound }
  ];

  // RBAC Filter: Only show modules authorized for the active user role
  const visibleNavItems = navItems.filter((item) => isSectionAuthorizedForRole(item.id, currentUser?.role));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64">
      {/* Mobile Header with close button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 pt-safe-offset-3 pl-safe pr-safe">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation Menu
        </span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-slate-400 hover:text-white rounded-md"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {onOpenLandingPage && (
          <button
            onClick={() => {
              onOpenLandingPage();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-teal-300 hover:text-white bg-teal-950/40 hover:bg-teal-900/40 border border-teal-800/40 transition-colors mb-3 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{t('nav_landing')}</span>
          </button>
        )}

        <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Core Operations</span>
          {currentUser && (
            <span className="text-[10px] text-teal-400 font-mono normal-case">
              {roleLabels[currentUser.role]?.split(' ')[0] || 'Staff'} Access
            </span>
          )}
        </div>

        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectSection(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-teal-950/70 text-teal-300 border border-teal-800/60 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-slate-400 px-1.5 py-0.2 bg-slate-800 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}



        {/* Workspace Theme Switcher - Clean palette buttons */}
        {onSelectTheme && (
          <div className="pt-3 border-t border-slate-800/80 mt-3">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace Theme
            </div>
            <div className="grid grid-cols-5 gap-1.5 px-3">
              {THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-400 bg-slate-800'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                    }`}
                    title={theme.name}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center"
                      style={{ backgroundColor: theme.canvasColor }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                    </div>
                    <span className="text-[9px] text-slate-400 truncate max-w-full font-medium">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Active User Profile & Quick Edit Card */}
      {currentUser && (
        <div className="mx-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-teal-300 text-xs bg-slate-800">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-teal-400 block truncate">
                {currentUser.jobTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenLoginModal && (
              <button
                onClick={() => {
                  onOpenLoginModal();
                  onCloseMobile();
                }}
                className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-md transition-colors"
                title="System Login Gateway & Auth"
                aria-label="System Login Gateway"
              >
                <LogIn className="w-3.5 h-3.5" />
              </button>
            )}
            {onOpenProfile && (
              <button
                onClick={() => {
                  onOpenProfile();
                  onCloseMobile();
                }}
                className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-md transition-colors"
                title="Edit Profile and Photo"
                aria-label="Edit Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Demo Prototype Footer Banner */}
      <div className="p-3.5 m-3 mb-safe-offset-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          <span>Prototype Environment</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Gahanga Cricket Stadium demonstration hub. Data seeded for validation and workflow modeling.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" 
            onClick={onCloseMobile} 
          />
          <div className="relative z-10 w-72 h-full shadow-2xl pl-safe">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
