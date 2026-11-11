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
  Globe,
  LogIn,
  KeyRound
} from 'lucide-react';
import { User, Role, InAppNotification, ThemeMode, Task, InventoryItem, CalendarEvent } from '../../types';
import { NavSection } from './Sidebar';
import { GlobalSearchBar } from './GlobalSearchBar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';

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
  onOpenLoginModal?: () => void;
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
  onSelectCalendarEvent,
  onOpenLoginModal
}) => {
  const { t } = useLanguage();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleLabels: Record<Role, string> = {
    CRICKET_OPERATIONS_MANAGER: t('role_manager'),
    SUPERVISOR: t('role_supervisor'),
    STOREKEEPER: t('role_storekeeper'),
    STAFF: t('role_staff'),
    SYSTEM_ADMIN: t('role_admin')
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 pt-safe px-safe">
      <div className="flex items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-4 lg:px-6 h-16">
        {/* Left Zone: Brand and Navigation Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={onOpenLandingPage}
            className={`flex items-center gap-2 ${onOpenLandingPage ? 'cursor-pointer group' : ''} min-w-0`}
            title={onOpenLandingPage ? "Return to Welcome Landing Page" : undefined}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-600 group-hover:bg-teal-500 transition-colors flex items-center justify-center font-bold text-white text-xs sm:text-sm tracking-wider shadow-xs shrink-0">
              GCS
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-100 group-hover:text-teal-300 transition-colors truncate max-w-[105px] sm:max-w-none">
                GCS Operations
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 whitespace-nowrap hidden md:inline">
                Gahanga Cricket Stadium · Kigali
              </span>
            </div>
          </div>

          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-colors cursor-pointer ml-2"
              title="View public GCS Landing Page"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Landing Page</span>
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

        {/* Center / Right Zone: Role Persona Switcher, Language & Top Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher (EN / RW / FR / SW) */}
          <LanguageSwitcher />

          {/* Active Session Role Display */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 border border-slate-700/80 rounded-lg whitespace-nowrap min-h-[36px]" title={`Authenticated as ${currentUser.name} (${roleLabels[currentUser.role]})`}>
            <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="hidden md:inline text-slate-400">Role:</span>
            <span className="font-semibold text-white max-w-[80px] sm:max-w-[130px] md:max-w-none truncate">
              {roleLabels[currentUser.role]}
            </span>
          </div>

          {/* Background Color & Palette Theme Switcher (Available on sm+ in navbar, and always in mobile drawer) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setShowThemeDropdown(!showThemeDropdown);
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
                    Background Color Palette
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Select modern operational workspace theme
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
              <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">Notifications</span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">
                      ({unreadCount} unread)
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] font-medium text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications at this time
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

          {/* Quick Sign In / Switch Account Button */}
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
              title="Sign in with different staff account / Lock session"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xl:inline">Sign In / Switch</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
