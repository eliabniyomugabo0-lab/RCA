import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  UserCheck, 
  ShieldAlert, 
  ExternalLink,
  Check,
  Building2,
  Clock,
  Palette,
  Home,
  Globe
} from 'lucide-react';
import { User, Role, InAppNotification, ThemeMode, Task, InventoryItem, CalendarEvent } from '../../types';
import { NavSection } from './Sidebar';
import { GlobalSearchBar } from './GlobalSearchBar';
import { LanguageSelector } from '../common/LanguageSelector';
import { useTranslation } from '../../context/LanguageContext';

interface NavbarProps {
  currentUser: User;
  onSelectRole: (role: Role) => void;
  availableUsers: User[];
  onOpenProfile: () => void;
  notifications: InAppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onToggleMobileNav: () => void;
  activeSectionName: string;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onOpenLandingPage?: () => void;
  tasks?: Task[];
  inventory?: InventoryItem[];
  events?: CalendarEvent[];
  onNavigateSection?: (section: NavSection) => void;
  onSelectTask?: (task: Task) => void;
  onSelectInventoryItem?: (item: InventoryItem) => void;
  onSelectStaffUser?: (user: User) => void;
  onSelectCalendarEvent?: (event: CalendarEvent) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  availableUsers,
  onOpenProfile,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onToggleMobileNav,
  activeSectionName,
  currentTheme,
  onSelectTheme,
  onOpenLandingPage,
  tasks,
  inventory,
  events,
  onNavigateSection,
  onSelectTask,
  onSelectInventoryItem,
  onSelectStaffUser,
  onSelectCalendarEvent
}) => {
  const { t } = useTranslation();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleLabels: Record<Role, string> = {
    CRICKET_OPERATIONS_MANAGER: t('role.CRICKET_OPERATIONS_MANAGER', 'Cricket Operations Manager'),
    SUPERVISOR: t('role.SUPERVISOR', 'Director / Supervisor'),
    STOREKEEPER: t('role.STOREKEEPER', 'Head Storekeeper'),
    STAFF: t('role.STAFF', 'Ground Operations Staff'),
    SYSTEM_ADMIN: t('role.SYSTEM_ADMIN', 'System Administrator')
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 h-16">
        {/* Left Zone: Brand and Navigation Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={onOpenLandingPage}
            className={`flex items-center gap-2.5 ${onOpenLandingPage ? 'cursor-pointer group' : ''}`}
            title={onOpenLandingPage ? "Return to Welcome Landing Page" : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 group-hover:bg-teal-500 transition-colors flex items-center justify-center font-bold text-white text-sm tracking-wider shadow-xs">
              GCS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-100 group-hover:text-teal-300 transition-colors whitespace-nowrap">
                {t('app.name', 'GCS Operations Hub')}
              </span>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">
                {t('app.subtitle', 'Gahanga Cricket Stadium · Kigali')}
              </span>
            </div>
          </div>

          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-colors cursor-pointer ml-2"
              title="View public GCS Landing Page"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('nav.landing', 'Landing Page')}</span>
            </button>
          )}

          <div className="hidden md:flex items-center text-xs text-slate-500 ml-2 pl-3 border-l border-slate-800">
            <span className="text-slate-400 font-medium">{activeSectionName}</span>
          </div>
        </div>

        {/* Center Zone: Global Operations Search Bar */}
        <GlobalSearchBar
          tasks={tasks}
          inventory={inventory}
          staff={availableUsers}
          events={events}
          onSelectTask={onSelectTask}
          onSelectInventoryItem={onSelectInventoryItem}
          onSelectStaffUser={onSelectStaffUser}
          onSelectCalendarEvent={onSelectCalendarEvent}
          onNavigateSection={onNavigateSection}
        />

        {/* Center / Right Zone: Role Persona Switcher & Top Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Persona / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifDropdown(false);
                setShowThemeDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              title="Switch user perspective to test role permissions"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="hidden sm:inline text-slate-400">{t('role.switch_role', 'Role:')}</span>
              <span className="font-semibold text-white max-w-[140px] sm:max-w-none truncate">
                {roleLabels[currentUser.role]}
              </span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {t('role.test_persona', 'Switch Test Persona')}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t('role.persona_desc', 'Test role-based permissions & workflows')}
                  </p>
                </div>
                <div className="py-1">
                  {availableUsers.map((user) => {
                    const isSelected = user.role === currentUser.role;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectRole(user.role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                          isSelected ? 'bg-slate-800/80 text-teal-300' : 'text-slate-200'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-700 overflow-hidden shrink-0 mt-0.5 border border-slate-600">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-100 truncate">
                              {user.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                          </div>
                          <span className="text-[11px] text-teal-400 block truncate">
                            {user.jobTitle}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {user.department}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector: English, Kinyarwanda, French, Kiswahili & GTranslate Bridge */}
          <LanguageSelector variant="navbar" />

          {/* Background Color & Palette Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeDropdown(!showThemeDropdown);
                setShowRoleDropdown(false);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-1.5 p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Change workspace background theme"
              title="Change background color theme"
            >
              <Palette className="w-4 h-4 text-teal-400" />
            </button>

            {showThemeDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {t('theme.title', 'Background Color Palette')}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t('theme.desc', 'Select modern operational workspace theme')}
                  </p>
                </div>

                <div className="py-1">
                  {[
                    { id: 'navy', name: 'Midnight Slate', desc: 'Classic Tournament Navy', canvasColor: '#0B132B', accentColor: '#0D9488' },
                    { id: 'turf', name: 'Pitch Turf', desc: 'Gahanga Grass Green', canvasColor: '#041411', accentColor: '#10B981' },
                    { id: 'obsidian', name: 'Obsidian OLED', desc: 'Minimal Deep Charcoal', canvasColor: '#09090B', accentColor: '#38BDF8' },
                    { id: 'dusk', name: 'Indigo Dusk', desc: 'Floodlight Twilight Blue', canvasColor: '#0A0E1A', accentColor: '#6366F1' },
                    { id: 'light', name: 'Daylight Match', desc: 'Clean Executive Light', canvasColor: '#F8FAFC', accentColor: '#0D9488' },
                  ].map((theme) => {
                    const isSelected = currentTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onSelectTheme(theme.id as ThemeMode);
                          setShowThemeDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                          isSelected ? 'bg-slate-800/80 text-teal-300' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Color preview swatch dot */}
                          <div 
                            className="w-4 h-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: theme.canvasColor }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ backgroundColor: theme.accentColor }} 
                            />
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-semibold block text-slate-100">
                              {theme.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {theme.desc}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowRoleDropdown(false);
              }}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-slate-900" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{t('notif.title', 'Notifications')}</span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">
                      ({unreadCount} {t('notif.unread', 'unread')})
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] font-medium text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      {t('action.mark_read', 'Mark all as read')}
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {t('notif.empty', 'No notifications at this time')}
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-800/70 ${
                          notif.isRead ? 'opacity-70 bg-slate-900' : 'bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden border border-slate-600 shrink-0">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-300">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="hidden lg:flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {currentUser.jobTitle}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
