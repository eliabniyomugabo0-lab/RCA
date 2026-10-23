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
  X
} from 'lucide-react';
import { User } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

export type NavSection = 
  | 'workspace'
  | 'tasks'
  | 'calendar'
  | 'inventory'
  | 'facility'
  | 'directory'
  | 'communication'
  | 'audit'
  | 'roles';

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
  onOpenLandingPage
}) => {
  const { t } = useTranslation();

  const navItems: { id: NavSection; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'workspace', label: t('nav.workspace', 'Operations Workspace'), icon: LayoutDashboard },
    { id: 'tasks', label: t('nav.tasks', 'Task & Report Workflow'), icon: CheckSquare, badge: pendingTasksCount },
    { id: 'calendar', label: t('nav.calendar', 'Stadium & Fixture Calendar'), icon: Calendar, badge: upcomingEventsCount },
    { id: 'inventory', label: t('nav.inventory', 'Store & Equipment Inventory'), icon: Package, badge: lowStockCount },
    { id: 'facility', label: t('nav.facility', 'Stadium Oval & Facilities'), icon: Building },
    { id: 'directory', label: t('nav.directory', 'Staff & Team Directory'), icon: Users },
    { id: 'communication', label: t('nav.communication', 'Communications & Notices'), icon: Megaphone },
    { id: 'audit', label: t('nav.audit', 'Audit Trail & Compliance'), icon: ShieldCheck },
    { id: 'roles', label: t('nav.roles', 'Role & Permissions Matrix'), icon: KeyRound }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64">
      {/* Mobile Header with close button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
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
            <span>{t('nav.landing', 'Public Landing Page')}</span>
          </button>
        )}

        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {t('nav.core_operations', 'Core Operations')}
        </div>

        {navItems.map((item) => {
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
      </div>

      {/* Language Quick Switcher */}
      <div className="mx-3 mb-2">
        <LanguageSelector variant="drawer" />
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

          {onOpenProfile && (
            <button
              onClick={() => {
                onOpenProfile();
                onCloseMobile();
              }}
              className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-md transition-colors shrink-0"
              title="Edit Profile and Photo"
              aria-label="Edit Profile"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Language Switcher: English, Kinyarwanda, French, Kiswahili */}
      <div className="px-3 pt-1">
        <LanguageSelector variant="drawer" onLanguageChange={() => onCloseMobile()} />
      </div>

      {/* Demo Prototype Footer Banner */}
      <div className="p-3.5 m-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
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
          <div className="relative z-10 w-72 h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
