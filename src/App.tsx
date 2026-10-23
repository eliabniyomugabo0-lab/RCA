import React, { useState, useEffect } from 'react';
import { 
  Role, 
  User, 
  Task, 
  InventoryItem, 
  StockMovement, 
  StockRequest, 
  Announcement, 
  DirectMessage, 
  InAppNotification, 
  AuditLogEntry,
  ThemeMode,
  CalendarEvent
} from './types';
import { 
  DEMO_USERS, 
  INITIAL_TASKS, 
  INITIAL_INVENTORY, 
  INITIAL_MOVEMENTS, 
  INITIAL_REQUESTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { INITIAL_CALENDAR_EVENTS } from './data/calendarData';
import { loadFromStorage, saveToStorage, clearGCSStorage } from './utils/storage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavSection } from './components/layout/Sidebar';
import { ManagerWorkspace } from './components/workspace/ManagerWorkspace';
import { TaskManager } from './components/tasks/TaskManager';
import { StadiumCalendar } from './components/calendar/StadiumCalendar';
import { InventoryHub } from './components/inventory/InventoryHub';
import { StadiumFacilityView } from './components/stadium/StadiumFacilityView';
import { StaffDirectory } from './components/directory/StaffDirectory';
import { CommunicationHub } from './components/communication/CommunicationHub';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { RolePermissionsMatrix } from './components/roles/RolePermissionsMatrix';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { LandingPage } from './components/landing/LandingPage';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { RotateCcw, Globe } from 'lucide-react';
import { useTranslation } from './context/LanguageContext';

export default function App() {
  const { t } = useTranslation();
  // Theme state with localStorage synchronization
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    return (loadFromStorage('gcs_theme', 'navy') as ThemeMode) || 'navy';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    saveToStorage('gcs_theme', currentTheme);
  }, [currentTheme]);

  // Master collections with localStorage synchronization
  const [users, setUsers] = useState<User[]>(() => 
    loadFromStorage('gcs_users', DEMO_USERS)
  );

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUserId = loadFromStorage<string | null>('gcs_current_user_id', null);
    const initialUsers = loadFromStorage('gcs_users', DEMO_USERS);
    if (savedUserId) {
      const found = initialUsers.find((u: User) => u.id === savedUserId);
      if (found) return found;
    }
    // Default to Hagenimana Damascene (Cricket Operations Manager)
    return initialUsers[0] || DEMO_USERS[0];
  });

  const [currentSection, setCurrentSection] = useState<NavSection>('workspace');

  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage('gcs_tasks', INITIAL_TASKS)
  );

  const [inventory, setInventory] = useState<InventoryItem[]>(() => 
    loadFromStorage('gcs_inventory', INITIAL_INVENTORY)
  );

  const [movements, setMovements] = useState<StockMovement[]>(() => 
    loadFromStorage('gcs_movements', INITIAL_MOVEMENTS)
  );

  const [requests, setRequests] = useState<StockRequest[]>(() => 
    loadFromStorage('gcs_requests', INITIAL_REQUESTS)
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    loadFromStorage('gcs_announcements', INITIAL_ANNOUNCEMENTS)
  );

  const [messages, setMessages] = useState<DirectMessage[]>(() => 
    loadFromStorage('gcs_messages', INITIAL_MESSAGES)
  );

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => 
    loadFromStorage('gcs_notifications', INITIAL_NOTIFICATIONS)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => 
    loadFromStorage('gcs_audit_logs', INITIAL_AUDIT_LOGS)
  );

  const [events, setEvents] = useState<CalendarEvent[]>(() => 
    loadFromStorage('gcs_calendar_events', INITIAL_CALENDAR_EVENTS)
  );

  // UI state
  const [isLandingPage, setIsLandingPage] = useState<boolean>(() => 
    loadFromStorage('gcs_show_landing', true)
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Targeted record states for deep navigation from Global Search
  const [targetTaskId, setTargetTaskId] = useState<string | null>(null);
  const [targetInventoryId, setTargetInventoryId] = useState<string | null>(null);
  const [targetStaffId, setTargetStaffId] = useState<string | null>(null);

  useEffect(() => {
    saveToStorage('gcs_show_landing', isLandingPage);
  }, [isLandingPage]);

  // Synchronize master collections to localStorage whenever modified
  useEffect(() => {
    saveToStorage('gcs_users', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('gcs_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage('gcs_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('gcs_inventory', inventory);
  }, [inventory]);

  useEffect(() => {
    saveToStorage('gcs_movements', movements);
  }, [movements]);

  useEffect(() => {
    saveToStorage('gcs_requests', requests);
  }, [requests]);

  useEffect(() => {
    saveToStorage('gcs_announcements', announcements);
  }, [announcements]);

  useEffect(() => {
    saveToStorage('gcs_messages', messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage('gcs_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage('gcs_audit_logs', auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    saveToStorage('gcs_calendar_events', events);
  }, [events]);

  // System-wide activity logger helper with ISO and local date/time formatting
  const logSystemActivity = (
    action: string,
    entityType: 'TASK' | 'REPORT' | 'INVENTORY' | 'STOCK_MOVEMENT' | 'ANNOUNCEMENT' | 'USER_ACCESS' | 'SETTINGS',
    entityId: string,
    details: string,
    severity: 'INFO' | 'NOTICE' | 'SECURITY' = 'INFO'
  ) => {
    const now = new Date();
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      timestamp: now.toISOString(),
      severity
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Toast helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectTheme = (theme: ThemeMode) => {
    setCurrentTheme(theme);
    const themeNames: Record<ThemeMode, string> = {
      navy: 'Midnight Slate (Default Navy)',
      turf: 'Pitch Turf (Gahanga Green)',
      obsidian: 'Obsidian OLED (Minimal Charcoal)',
      dusk: 'Indigo Dusk (Twilight Blue)',
      light: 'Daylight Match (Executive Light)'
    };

    logSystemActivity(
      'THEME_PALETTE_SWITCHED',
      'SETTINGS',
      theme,
      `Operational background color switched to ${themeNames[theme]}. Data state persisted.`
    );

    addToast('info', 'Workspace Palette Changed', `Switched to ${themeNames[theme]}`);
  };

  // Switch role persona
  const handleSelectRole = (role: Role) => {
    const matchedUser = users.find((u) => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);

      logSystemActivity(
        'ROLE_PERSONA_SWITCHED',
        'USER_ACCESS',
        matchedUser.id,
        `Active session perspective switched to ${matchedUser.name} (${role}). Permissions & view filter updated.`
      );

      addToast('info', `Switched Role to ${matchedUser.role}`, `Now testing as ${matchedUser.name} (${matchedUser.jobTitle})`);
    }
  };

  // Task handlers with complete status transition activity tracking & confirmation
  const handleUpdateTask = (updatedTask: Task) => {
    const originalTask = tasks.find(t => t.id === updatedTask.id);
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));

    // Track specific activity action and generate confirmation if submitted
    const isNewSubmission = updatedTask.status === 'SUBMITTED' && originalTask?.status !== 'SUBMITTED';
    const isApproval = updatedTask.status === 'APPROVED' && originalTask?.status !== 'APPROVED';
    const isRevision = updatedTask.status === 'REVISION_REQUESTED' && originalTask?.status !== 'REVISION_REQUESTED';

    let actionName = `TASK_STATUS_${updatedTask.status}`;
    let severity: 'INFO' | 'NOTICE' | 'SECURITY' = 'INFO';
    let activityDetails = `Task "${updatedTask.title}" updated by ${currentUser.name}. Status: ${updatedTask.status}.`;

    if (isNewSubmission) {
      actionName = 'TASK_REPORT_SUBMITTED';
      severity = 'NOTICE';
      const versionNum = updatedTask.submissions?.length || 1;
      activityDetails = `Task "${updatedTask.title}" completion report (v${versionNum}) submitted by ${currentUser.name}. Routed to ${updatedTask.createdByName || 'Supervisor'} with verification deliverables.`;
      
      // Enqueue notification for the supervisor/creator
      const notif: InAppNotification = {
        id: `notif-${Date.now()}`,
        recipientId: updatedTask.createdById,
        title: 'Task Completion Report Submitted',
        message: `${currentUser.name} submitted a completion report for "${updatedTask.title}". Awaiting your review.`,
        type: 'REPORT_SUBMITTED',
        referenceId: updatedTask.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast('success', 'Report Submission Confirmed', `Task "${updatedTask.title}" submitted and recorded in audit log.`);
    } else if (isApproval) {
      actionName = 'TASK_REPORT_APPROVED';
      severity = 'NOTICE';
      activityDetails = `Task "${updatedTask.title}" completion report approved and signed off by ${currentUser.name}.`;

      // Notify the assignee of sign-off
      const notif: InAppNotification = {
        id: `notif-${Date.now()}`,
        recipientId: updatedTask.assigneeId,
        title: 'Task Report Approved',
        message: `Your completion report for "${updatedTask.title}" was approved by ${currentUser.name}.`,
        type: 'REPORT_REVIEWED',
        referenceId: updatedTask.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);
    } else if (isRevision) {
      actionName = 'TASK_REVISION_REQUESTED';
      severity = 'NOTICE';
      activityDetails = `Revisions requested on task "${updatedTask.title}" by ${currentUser.name}. Returned for amendment.`;

      // Notify the assignee
      const notif: InAppNotification = {
        id: `notif-${Date.now()}`,
        recipientId: updatedTask.assigneeId,
        title: 'Task Revision Requested',
        message: `${currentUser.name} requested revisions on "${updatedTask.title}". Please review feedback.`,
        type: 'TASK_ASSIGNED',
        referenceId: updatedTask.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    logSystemActivity(
      actionName,
      isNewSubmission || isApproval || isRevision ? 'REPORT' : 'TASK',
      updatedTask.id,
      activityDetails,
      severity
    );
  };

  const handleCreateTask = (newTaskPartial: Partial<Task>) => {
    const fullTask: Task = {
      ...newTaskPartial,
      id: `tsk-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      submissions: [],
      comments: []
    } as Task;

    setTasks((prev) => [fullTask, ...prev]);

    logSystemActivity(
      'TASK_CREATED',
      'TASK',
      fullTask.id,
      `New operational task "${fullTask.title}" assigned to ${fullTask.assigneeName} by ${currentUser.name}. Priority: ${fullTask.priority}, Deadline: ${fullTask.deadline}.`
    );

    // Create notification for assignee
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: fullTask.assigneeId,
      title: 'New Operational Task Assigned',
      message: `${currentUser.name} assigned task: "${fullTask.title}". Deadline: ${fullTask.deadline}.`,
      type: 'TASK_ASSIGNED',
      referenceId: fullTask.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('success', 'Task Assigned', `Task "${fullTask.title}" assigned to ${fullTask.assigneeName}`);
  };

  // Inventory handlers with activity tracking
  const handleUpdateInventory = (newItems: InventoryItem[], newMovement?: StockMovement) => {
    setInventory(newItems);
    if (newMovement) {
      setMovements((prev) => [newMovement, ...prev]);

      logSystemActivity(
        `STOCK_${newMovement.type}`,
        'STOCK_MOVEMENT',
        newMovement.id,
        `${newMovement.type} of ${newMovement.quantity} units (${newMovement.itemName}) executed by ${currentUser.name}. Ref: ${newMovement.referenceNumber}. Reason: ${newMovement.reason || 'Standard operational dispatch'}.`,
        newMovement.type === 'DAMAGE_LOSS' ? 'NOTICE' : 'INFO'
      );
    }
  };

  const handleAddStockRequest = (newRequest: StockRequest) => {
    setRequests((prev) => [newRequest, ...prev]);

    logSystemActivity(
      'STOCK_REQUEST_SUBMITTED',
      'INVENTORY',
      newRequest.id,
      `Equipment requisition ${newRequest.requestNumber} for ${newRequest.targetEventOrTeam} filed by ${currentUser.name}. Total items: ${newRequest.items.length}.`
    );
  };

  // Announcement handler
  const handleAddAnnouncement = (newAnc: Announcement) => {
    setAnnouncements((prev) => [newAnc, ...prev]);

    logSystemActivity(
      'ANNOUNCEMENT_PUBLISHED',
      'ANNOUNCEMENT',
      newAnc.id,
      `Official stadium bulletin "${newAnc.title}" broadcast to ${newAnc.targetAudience} by ${currentUser.name}.`,
      newAnc.priority === 'CRITICAL' ? 'SECURITY' : 'INFO'
    );
  };

  // Messaging handler
  const handleSendMessage = (newMsg: DirectMessage) => {
    setMessages((prev) => [...prev, newMsg]);

    logSystemActivity(
      'DIRECT_MESSAGE_SENT',
      'USER_ACCESS',
      newMsg.id,
      `Direct operational message sent to recipient (${newMsg.recipientId}) by ${currentUser.name}.`
    );
  };

  // Notification handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('info', 'Notifications Cleared', 'All notices marked as read.');
  };

  // Profile save with tracking
  const handleSaveProfile = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);

    logSystemActivity(
      'USER_PROFILE_UPDATED',
      'USER_ACCESS',
      updatedUser.id,
      `Personnel profile for ${updatedUser.name} (${updatedUser.positionName}, ${updatedUser.department}) updated by ${currentUser.name}.`,
      'NOTICE'
    );
  };

  // Calendar event handlers
  const handleAddCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setEvents((prev) => [newEvent, ...prev]);

    logSystemActivity(
      'CALENDAR_EVENT_SCHEDULED',
      'TASK',
      newEvent.id,
      `Scheduled "${newEvent.title}" on ${newEvent.date} (${newEvent.location}) by ${currentUser.name}.`
    );
  };

  const handleUpdateCalendarEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));

    logSystemActivity(
      'CALENDAR_EVENT_UPDATED',
      'TASK',
      updatedEvent.id,
      `Updated event "${updatedEvent.title}" on stadium calendar by ${currentUser.name}.`
    );
  };

  const handleDeleteCalendarEvent = (eventId: string) => {
    const deleted = events.find(e => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

    if (deleted) {
      logSystemActivity(
        'CALENDAR_EVENT_DELETED',
        'TASK',
        eventId,
        `Removed "${deleted.title}" from stadium calendar by ${currentUser.name}.`,
        'NOTICE'
      );
    }
  };

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Reset to default demo data utility
  const handleResetDemoData = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    clearGCSStorage();
    setUsers(DEMO_USERS);
    setCurrentUser(DEMO_USERS[0]);
    setTasks(INITIAL_TASKS);
    setInventory(INITIAL_INVENTORY);
    setMovements(INITIAL_MOVEMENTS);
    setRequests(INITIAL_REQUESTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setEvents(INITIAL_CALENDAR_EVENTS);
    setCurrentTheme('navy');

    setIsResetConfirmOpen(false);
    addToast('success', 'Demo Records Reset', 'Restored pristine stadium operations baseline.');
  };

  const handleGetStarted = () => {
    setIsLandingPage(false);
    setCurrentSection('workspace');
    addToast('success', 'Welcome to GCS Operations Hub', 'Home Workspace active. Manager Hagenimana Damascene on duty.');
    logSystemActivity(
      'ENTER_WORKSPACE',
      'USER_ACCESS',
      currentUser.id,
      `${currentUser.name} entered Home Operations Workspace from Landing Page`
    );
  };

  const handleExploreSectionFromLanding = (section: string) => {
    setIsLandingPage(false);
    setCurrentSection(section as NavSection);
    logSystemActivity(
      'NAVIGATE_SECTION',
      'USER_ACCESS',
      currentUser.id,
      `Navigated to ${section} from Landing Page`
    );
  };

  const handleSelectTaskFromSearch = (task: Task) => {
    setTargetTaskId(task.id);
    setCurrentSection('tasks');
    setIsLandingPage(false);
    logSystemActivity(
      'GLOBAL_SEARCH_NAVIGATE',
      'TASK',
      task.id,
      `Navigated to task "${task.title}" via Global Search`
    );
  };

  const handleSelectInventoryFromSearch = (item: InventoryItem) => {
    setTargetInventoryId(item.id);
    setCurrentSection('inventory');
    setIsLandingPage(false);
    logSystemActivity(
      'GLOBAL_SEARCH_NAVIGATE',
      'INVENTORY',
      item.id,
      `Navigated to store item "${item.name}" via Global Search`
    );
  };

  const handleSelectStaffFromSearch = (user: User) => {
    setTargetStaffId(user.id);
    setCurrentSection('directory');
    setIsLandingPage(false);
    logSystemActivity(
      'GLOBAL_SEARCH_NAVIGATE',
      'USER_ACCESS',
      user.id,
      `Opened staff profile for ${user.name} via Global Search`
    );
  };

  const sectionNames: Record<NavSection, string> = {
    workspace: t('nav.workspace', 'Operations Workspace'),
    tasks: t('nav.tasks', 'Task & Report Workflow'),
    calendar: t('nav.calendar', 'Stadium & Fixture Calendar'),
    inventory: t('nav.inventory', 'Store & Equipment Inventory'),
    facility: t('nav.facility', 'Stadium Oval & Facilities'),
    directory: t('nav.directory', 'Staff & Team Directory'),
    communication: t('nav.communication', 'Communications & Bulletins'),
    audit: t('nav.audit', 'Audit Trail & Compliance'),
    roles: t('nav.roles', 'Role & Permissions Matrix')
  };

  const pendingTasksCount = tasks.filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;
  const lowStockCount = inventory.filter((i) => i.availableQuantity <= i.reorderThreshold).length;

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
        <LandingPage
          onGetStarted={handleGetStarted}
          onExploreSection={handleExploreSectionFromLanding}
          currentUser={currentUser}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
          totalTasksCount={tasks.length}
          inventoryItemCount={inventory.length}
          staffCount={users.length}
        />
        {/* Floating Toast Notification Stack */}
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Navigation Bar with Role and Theme Switcher */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        availableUsers={users}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        activeSectionName={sectionNames[currentSection]}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onOpenLandingPage={() => setIsLandingPage(true)}
        tasks={tasks}
        inventory={inventory}
        events={events}
        onNavigateSection={setCurrentSection}
        onSelectTask={handleSelectTaskFromSearch}
        onSelectInventoryItem={handleSelectInventoryFromSearch}
        onSelectStaffUser={handleSelectStaffFromSearch}
        onSelectCalendarEvent={() => setCurrentSection('calendar')}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          pendingTasksCount={pendingTasksCount}
          lowStockCount={lowStockCount}
          upcomingEventsCount={events.length}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenLandingPage={() => setIsLandingPage(true)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between">
          <div>
            {currentSection === 'workspace' && (
              <ManagerWorkspace
                currentUser={currentUser}
                tasks={tasks}
                inventory={inventory}
                announcements={announcements}
                requests={requests}
                events={events}
                onNavigateSection={setCurrentSection}
                onOpenTaskModal={(task) => {
                  setTargetTaskId(task.id);
                  setCurrentSection('tasks');
                }}
                onOpenNewTaskModal={() => setCurrentSection('tasks')}
                onOpenNewRequestModal={() => setCurrentSection('inventory')}
                onOpenProfile={() => setIsProfileModalOpen(true)}
              />
            )}

            {currentSection === 'tasks' && (
              <TaskManager
                currentUser={currentUser}
                tasks={tasks}
                users={users}
                onUpdateTask={handleUpdateTask}
                onCreateTask={handleCreateTask}
                onShowToast={addToast}
                initialTaskId={targetTaskId}
              />
            )}

            {currentSection === 'calendar' && (
              <StadiumCalendar
                events={events}
                tasks={tasks}
                users={users}
                currentUser={currentUser}
                onAddEvent={handleAddCalendarEvent}
                onUpdateEvent={handleUpdateCalendarEvent}
                onDeleteEvent={handleDeleteCalendarEvent}
                onNavigateToTask={(taskId) => {
                  setTargetTaskId(taskId);
                  setCurrentSection('tasks');
                }}
                onShowToast={addToast}
              />
            )}

            {currentSection === 'inventory' && (
              <InventoryHub
                currentUser={currentUser}
                inventory={inventory}
                movements={movements}
                requests={requests}
                onUpdateInventory={handleUpdateInventory}
                onAddStockRequest={handleAddStockRequest}
                onShowToast={addToast}
                initialItemId={targetInventoryId}
              />
            )}

            {currentSection === 'facility' && <StadiumFacilityView />}

            {currentSection === 'directory' && (
              <StaffDirectory
                users={users}
                currentUser={currentUser}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenMessageWithUser={() => setCurrentSection('communication')}
                initialUserId={targetStaffId}
              />
            )}

            {currentSection === 'communication' && (
              <CommunicationHub
                currentUser={currentUser}
                announcements={announcements}
                messages={messages}
                users={users}
                onAddAnnouncement={handleAddAnnouncement}
                onSendMessage={handleSendMessage}
                onShowToast={addToast}
              />
            )}

            {currentSection === 'audit' && (
              <AuditLogViewer logs={auditLogs} onShowToast={addToast} />
            )}

            {currentSection === 'roles' && <RolePermissionsMatrix />}
          </div>

          {/* Operational Footer with LocalStorage Status & Baseline Reset */}
          <footer className="mt-12 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{t('footer.storage_engine', 'GCS Storage Engine: localStorage Active')}</span>
              <span>·</span>
              <span>{t('footer.manager', 'Manager')}: <strong className="text-slate-300">Hagenimana Damascene</strong></span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLandingPage(true)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
                title="View public GCS Landing Page"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t('nav.landing', 'Landing Page')}</span>
              </button>
              <span>·</span>
              <button
                onClick={handleResetDemoData}
                className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                title="Reset local storage data to initial African-based staff and cricket operational demo state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('action.reset_demo', 'Reset Demo Records')}</span>
              </button>
              <span>·</span>
              <span>{t('footer.location', 'GCS Stadium Kigali · Rwanda')}</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        onShowToast={addToast}
      />

      {/* Reset Demo Data In-App Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t('modal.reset_title', 'Reset Stadium Demo Records')}</h3>
                <p className="text-xs text-slate-400">{t('modal.reset_desc', 'Restore default operations baseline')}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t('modal.reset_warning', 'This will restore all task workflows, inventory stock balances, match calendar fixtures, and demo logs to their initial clean state.')}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                {t('action.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                {t('action.confirm_reset', 'Restore Operations Baseline')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
