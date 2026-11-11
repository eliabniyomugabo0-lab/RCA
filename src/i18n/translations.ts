import { Language } from '../types';

export interface Translations {
  // Navigation & Sections
  nav_workspace: string;
  nav_dashboard: string;
  nav_tasks: string;
  nav_calendar: string;
  nav_inventory: string;
  nav_facility: string;
  nav_directory: string;
  nav_communication: string;
  nav_audit: string;
  nav_roles: string;
  nav_landing: string;

  // Header & Global
  switch_language: string;
  switch_role: string;
  current_role: string;
  change_theme: string;
  notifications: string;
  profile: string;
  search_placeholder: string;
  quick_jump: string;

  // Task Statuses
  status_assigned: string;
  status_in_progress: string;
  status_submitted: string;
  status_revision_requested: string;
  status_approved: string;
  status_cancelled: string;
  status_draft: string;
  all_statuses: string;

  // Task Priorities
  priority_urgent: string;
  priority_high: string;
  priority_medium: string;
  priority_low: string;
  all_priorities: string;

  // Task Management
  tasks_title: string;
  tasks_subtitle: string;
  create_task: string;
  task_details: string;
  department: string;
  assignee: string;
  deadline: string;
  priority: string;
  status: string;
  actions: string;
  inspect: string;
  view_mode_kanban: string;
  view_mode_table: string;
  drag_drop_hint: string;
  move_to: string;
  no_tasks_in_column: string;
  drop_here: string;
  completion: string;
  report_summary: string;
  deliverables: string;
  comments: string;
  submit_report: string;
  approve: string;
  request_revision: string;
  cancel: string;
  save: string;
  confirm: string;
  assigned_to: string;

  // Calendar
  calendar_title: string;
  calendar_subtitle: string;
  schedule_event: string;
  view_month: string;
  view_week: string;
  view_agenda: string;
  today: string;
  all_events: string;
  matches: string;
  pitch_turf: string;
  training: string;
  stadium_vip: string;
  stores_audit: string;
  sync_task_deadlines: string;
  search_fixtures: string;
  export_ics: string;
  google_calendar: string;
  chronological_agenda: string;
  earliest_first: string;
  latest_first: string;
  add_to_date: string;

  // Workspace
  welcome_back: string;
  operations_snapshot: string;
  active_tasks_desc: string;
  low_stock_desc: string;
  bulletins_desc: string;
  upcoming_itinerary: string;
  view_workflows: string;
  edit_profile_photo: string;
  priority_tasks_title: string;
  reports_for_review: string;
  pitch_status: string;
  reset_demo_records: string;

  // Roles
  role_manager: string;
  role_supervisor: string;
  role_storekeeper: string;
  role_staff: string;
  role_admin: string;

  // Landing Page
  landing_get_started: string;
  landing_hero_badge: string;
  landing_hero_title: string;
  landing_hero_sub: string;
  landing_get_started_now: string;
  landing_view_tasks: string;
  landing_enter_home: string;
  landing_live_tasks: string;
  landing_stores_tracked: string;
  landing_staff_officials: string;
  landing_gallery_title: string;
  landing_gallery_sub: string;
  landing_features_badge: string;
  landing_features_title: string;
  landing_features_sub: string;
  landing_team_badge: string;
  landing_team_title: string;
  landing_team_sub: string;
  landing_nav_gallery: string;
  landing_nav_modules: string;
  landing_nav_team: string;
  landing_nav_metrics: string;
  landing_nav_departments: string;
  landing_stat_activity: string;
  landing_stat_departments: string;
  landing_stat_capacity: string;
  landing_stat_storage: string;
  landing_card_analytics_title: string;
  landing_card_analytics_desc: string;
  landing_card_analytics_btn: string;
  landing_card_tasks_title: string;
  landing_card_tasks_desc: string;
  landing_card_tasks_btn: string;
  landing_card_inventory_title: string;
  landing_card_inventory_desc: string;
  landing_card_inventory_btn: string;
  landing_card_facility_title: string;
  landing_card_facility_desc: string;
  landing_card_facility_btn: string;
  landing_card_directory_title: string;
  landing_card_directory_desc: string;
  landing_card_directory_btn: string;
  landing_card_audit_title: string;
  landing_card_audit_desc: string;
  landing_card_audit_btn: string;
  landing_card_calendar_title: string;
  landing_card_calendar_desc: string;
  landing_card_calendar_btn: string;
  landing_departments_title: string;
  landing_departments_sub: string;
  landing_leader_quote: string;
  landing_leader_bio: string;
  landing_leader_btn_launch: string;
  landing_leader_btn_team: string;
  landing_footer_cta_title: string;
  landing_footer_cta_sub: string;
  landing_footer_cta_btn: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav_workspace: 'Operations Workspace',
    nav_dashboard: 'Operations Dashboard & KPIs',
    nav_tasks: 'Task & Report Workflow',
    nav_calendar: 'Stadium & Fixture Calendar',
    nav_inventory: 'Store & Equipment Inventory',
    nav_facility: 'Stadium Oval & Facilities',
    nav_directory: 'Staff & Team Directory',
    nav_communication: 'Communications & Bulletins',
    nav_audit: 'Audit Trail & Compliance',
    nav_roles: 'Role & Permissions Matrix',
    nav_landing: 'Landing Page',

    switch_language: 'Change Language',
    switch_role: 'Switch Role',
    current_role: 'Role',
    change_theme: 'Change Theme',
    notifications: 'Notifications',
    profile: 'Profile',
    search_placeholder: 'Search tasks, inventory, fixtures, staff (Cmd+K)...',
    quick_jump: 'Quick Navigation Jumps',

    status_assigned: 'Assigned',
    status_in_progress: 'In Progress',
    status_submitted: 'Submitted',
    status_revision_requested: 'Revision Requested',
    status_approved: 'Approved',
    status_cancelled: 'Cancelled',
    status_draft: 'Draft',
    all_statuses: 'All Statuses',

    priority_urgent: 'Urgent',
    priority_high: 'High',
    priority_medium: 'Medium',
    priority_low: 'Low',
    all_priorities: 'All Priorities',

    tasks_title: 'Task Management & Reports',
    tasks_subtitle: 'Drag and drop tasks between columns to update status, track groundskeeping deliverables, and review sign-offs',
    create_task: 'Create & Assign Task',
    task_details: 'Task Details',
    department: 'Department',
    assignee: 'Assignee',
    deadline: 'Deadline',
    priority: 'Priority',
    status: 'Status',
    actions: 'Action',
    inspect: 'Inspect',
    view_mode_kanban: 'Kanban Board',
    view_mode_table: 'Table View',
    drag_drop_hint: 'Drag cards across columns to advance workflow status',
    move_to: 'Move to...',
    no_tasks_in_column: 'No tasks in this status',
    drop_here: 'Drop task here to update status',
    completion: 'Completion',
    report_summary: 'Report Summary',
    deliverables: 'Deliverables & Notes',
    comments: 'Task Discussion',
    submit_report: 'Submit Report',
    approve: 'Approve Task',
    request_revision: 'Request Revisions',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    assigned_to: 'Assigned to',

    calendar_title: 'Stadium & Fixture Calendar',
    calendar_subtitle: 'Centralized itinerary for international match fixtures, pitch moisture rolling cycles, and clinics',
    schedule_event: 'Schedule Fixture / Event',
    view_month: 'Month',
    view_week: 'Week',
    view_agenda: 'Agenda',
    today: 'Today (Oct 15)',
    all_events: 'All Events',
    matches: 'Matches',
    pitch_turf: 'Pitch & Turf',
    training: 'Training',
    stadium_vip: 'Stadium / VIP',
    stores_audit: 'Stores / Audit',
    sync_task_deadlines: 'Sync Task Deadlines',
    search_fixtures: 'Search fixtures, pitches...',
    export_ics: 'Export (.ics)',
    google_calendar: 'Google Calendar',
    chronological_agenda: 'Chronological Stadium Agenda',
    earliest_first: 'Earliest First',
    latest_first: 'Latest First',
    add_to_date: 'Add to this Day',

    welcome_back: 'Welcome back',
    operations_snapshot: 'Operations Snapshot',
    active_tasks_desc: 'In-flight operational jobs',
    low_stock_desc: 'Below threshold reserves',
    bulletins_desc: 'Operations broadcast channel',
    upcoming_itinerary: 'Upcoming Stadium Itinerary',
    view_workflows: 'View Workflows',
    edit_profile_photo: 'Edit Profile & Photo',
    priority_tasks_title: 'Priority Tasks & Deliverables',
    reports_for_review: 'Reports For Review',
    pitch_status: 'Pitch Status',
    reset_demo_records: 'Reset Demo Records',

    role_manager: 'Cricket Operations Manager',
    role_supervisor: 'Director / Supervisor',
    role_storekeeper: 'Head Storekeeper',
    role_staff: 'Ground Operations Staff',
    role_admin: 'System Administrator',

    landing_get_started: 'Get Started',
    landing_hero_badge: 'ICC Associate Certified Operational Ground',
    landing_hero_title: 'World-Class Cricket Stadium Operations & Logistics Nerve Center',
    landing_hero_sub: 'The centralized operational suite for Gahanga Cricket Stadium. Manage pitch preparation, match day schedules, inventory control, and staff execution under Cricket Operations Manager Hagenimana Damascene and an elite Rwandan team.',
    landing_get_started_now: 'Get Started Now',
    landing_view_tasks: 'View Daily Operational Tasks',
    landing_enter_home: 'Enter Operational Home Page',
    landing_live_tasks: 'Live Tasks',
    landing_stores_tracked: 'Stores Tracked',
    landing_staff_officials: 'Staff & Officials',
    landing_gallery_title: 'Gahanga Cricket Stadium Visual Tour',
    landing_gallery_sub: 'Explore the award-winning parabolic vaults, international matchday fixtures, precision turf curation, floodlit night games, and practice net facilities. Fully cached for 100% offline access.',
    landing_features_badge: 'System Architecture & Modules',
    landing_features_title: 'Integrated Operations for Stadium & Cricket Success',
    landing_features_sub: 'From pitch curating to ICC match protocol compliance, GCS coordinates all ground activities in a single platform.',
    landing_team_badge: 'Operations Governance & Staff',
    landing_team_title: 'Cricket Operations Leadership',
    landing_team_sub: 'Dedicated Rwandan professionals ensuring ICC certification and world-class match standards.',
    landing_nav_gallery: 'Stadium Gallery',
    landing_nav_modules: 'Key Modules',
    landing_nav_team: 'Operations Team',
    landing_nav_metrics: 'Facility Metrics',
    landing_nav_departments: 'Departments',
    landing_stat_activity: 'Activity Logged & Timestamped',
    landing_stat_departments: 'Key Operational Departments',
    landing_stat_capacity: 'Stadium Spectator Capacity',
    landing_stat_storage: 'LocalStorage Data Integrity',
    landing_card_analytics_title: 'Visual Operational Analytics',
    landing_card_analytics_desc: 'Interactive Recharts bar visualizations monitoring completion rates across urgency levels and task workflow statuses.',
    landing_card_analytics_btn: 'Open Analytics Workspace',
    landing_card_tasks_title: 'Task Execution & Reports',
    landing_card_tasks_desc: 'Structured groundskeeper reports with pitch conditions, photo records, weather tracking, and instant submission confirmation feedback.',
    landing_card_tasks_btn: 'View Task Management',
    landing_card_inventory_title: 'Equipment & Stores Logistics',
    landing_card_inventory_desc: 'Real-time inventory of cricket gear, pitch rollers, fertilizers, match balls, boundary ropes with automated minimum thresholds.',
    landing_card_inventory_btn: 'Access Inventory Hub',
    landing_card_facility_title: 'Stadium Oval & Facilities',
    landing_card_facility_desc: 'Direct oversight over Main Ground Oval, Practice Net Enclosures, Media Center, VIP Pavilion, and Player Dressing Rooms.',
    landing_card_facility_btn: 'Explore Stadium Facilities',
    landing_card_directory_title: 'Staff Directory & Dossiers',
    landing_card_directory_desc: 'Comprehensive personnel profiles featuring marital status, education, evaluation tiers, experience years, photo editing, and avatar studio.',
    landing_card_directory_btn: 'View Staff Directory',
    landing_card_audit_title: 'System Activity & Audit Log',
    landing_card_audit_desc: 'Immutable audit records tracking every submission, approval, stock issue, and profile update with date/time stamps and actor identities.',
    landing_card_audit_btn: 'Inspect Audit Records',
    landing_card_calendar_title: 'Stadium & Fixture Calendar',
    landing_card_calendar_desc: 'Full operational calendar with Month, Week, and Agenda views for match fixtures, pitch moisture rolling, trainings, and Google Calendar / .ics export.',
    landing_card_calendar_btn: 'Open Stadium Calendar',
    landing_departments_title: '5 Coordinated Operational Departments',
    landing_departments_sub: 'Specialized departments ensuring seamless alignment between administrative planning, academy teaching, cricket coaching, and official ICC match umpiring.',
    landing_leader_quote: '"Excellence on the pitch begins with disciplined operational infrastructure."',
    landing_leader_bio: 'Leading a dedicated Rwandan operational cohort, Hagenimana oversees every phase of stadium preparation—from pitch moisture content and heavy roller passes to floodlight maintenance and inventory replenishment.',
    landing_leader_btn_launch: 'Launch Operations with Damascene',
    landing_leader_btn_team: 'Meet the Complete African Staff Roster',
    landing_footer_cta_title: 'Ready to Oversee Stadium Operations?',
    landing_footer_cta_sub: 'Access the live Home Workspace with real-time task workflows, store tracking, and analytics dashboards.',
    landing_footer_cta_btn: 'Get Started — Enter Home Workspace'
  },

  rw: {
    nav_workspace: "Ibiro by'Ibikorwa",
    nav_dashboard: "Imbonerahamwe y'Ibarurishamibare",
    nav_tasks: 'Imirimo na Raporo',
    nav_calendar: "Kalandari y'Imikino n'Ibikorwa",
    nav_inventory: "Ububiko bw'Ibikoresho",
    nav_facility: "Sitade n'Ibikorwaremezo",
    nav_directory: "Abakozi n'Ikipe",
    nav_communication: "Amatangazo n'Ubutumwa",
    nav_audit: "Ibyakozwe n'Ubugenzuzi",
    nav_roles: "Inshingano n'Uburenganzira",
    nav_landing: 'Ahabanza',

    switch_language: 'Guhindura Ururimi',
    switch_role: 'Guhindura Inshingano',
    current_role: 'Inshingano',
    change_theme: 'Guhindura Ibara',
    notifications: 'Ubutumwa Bugufi',
    profile: 'Umwirondoro',
    search_placeholder: 'Shakisha imirimo, ibikoresho, imikino, abakozi (Cmd+K)...',
    quick_jump: 'Kugera ku bice byihuse',

    status_assigned: 'Byatanzwe',
    status_in_progress: 'Biri Gukorwa',
    status_submitted: 'Byashyikirijwe',
    status_revision_requested: 'Gusubiramo birasabwa',
    status_approved: 'Byemejwe',
    status_cancelled: 'Byasheshwe',
    status_draft: 'Inyandiko mbanziriza',
    all_statuses: 'Imiterere Yose',

    priority_urgent: 'Byihutirwa Cyane',
    priority_high: 'Byihutirwa',
    priority_medium: 'Biringaniye',
    priority_low: 'Bisanzwe',
    all_priorities: 'Urwego Rwose rw\'Ibyihutirwa',

    tasks_title: 'Gucunga Imirimo na Raporo',
    tasks_subtitle: 'Kurura no kurekura imirimo mu nkingi zitandukanye kugira ngo uhindure intera, ugenzure ibyakozwe mu kibuga, no kwemeza raporo',
    create_task: 'Kurema & Gutanga Umurimo',
    task_details: "Ibirambuye ku Murimo",
    department: 'Ishami',
    assignee: 'Uwashinzwe',
    deadline: 'Itariki Ntarengwa',
    priority: 'Ibyihutirwa',
    status: 'Imiterere',
    actions: 'Igikorwa',
    inspect: 'Kugenzura',
    view_mode_kanban: 'Imbonerahamwe ya Kanban',
    view_mode_table: 'Imbonerahamwe y\'Imirongo',
    drag_drop_hint: 'Kurura agakarita mu nkingi ushaka kugira ngo uhindure intera y\'umurimo',
    move_to: 'Kumurika kuri...',
    no_tasks_in_column: 'Nta mirimo iri muri iyi ntera',
    drop_here: 'Rekurira hano umurimo uhindure intera',
    completion: 'Ijanisha ry\'Ibyarangiye',
    report_summary: 'Incamake ya Raporo',
    deliverables: "Ibikorwa n'Ibyagezweho",
    comments: "Ibitekerezo ku Murimo",
    submit_report: 'Ohereza Raporo',
    approve: 'Emeza Umurimo',
    request_revision: 'Saba Gusubiramo',
    cancel: 'Reka',
    save: 'Bika',
    confirm: 'Emeza',
    assigned_to: 'Yashinzwe',

    calendar_title: "Kalandari y'Imikino n'Ibikorwa",
    calendar_subtitle: "Gahunda y'imikino mpuzamahanga, kwita ku bwatsi bw'ikibuga, n'imyitozo ikomeye kuri Sitade ya Gahanga",
    schedule_event: 'Teganya Umukino / Igikorwa',
    view_month: 'Ukwezi',
    view_week: 'Icyumweru',
    view_agenda: 'Urutonde',
    today: 'Uyu munsi (15 Ukwakira)',
    all_events: 'Ibikorwa Byose',
    matches: 'Imikino',
    pitch_turf: "Ikibuga n'Ubwatsi",
    training: 'Imyitozo',
    stadium_vip: 'Sitade / Abanyacyubahiro',
    stores_audit: 'Ububiko / Igenzura',
    sync_task_deadlines: 'Huzaho Itariki z\'Imirimo',
    search_fixtures: 'Shakisha imikino, ibibuga...',
    export_ics: 'Kumanura (.ics)',
    google_calendar: 'Kalandari ya Google',
    chronological_agenda: "Gahunda y'Ibikorwa Byose bya Sitade",
    earliest_first: 'Ibihereye ku bya Mbere',
    latest_first: 'Ibihereye ku bya Nyuma',
    add_to_date: 'Ongeraho kuri uyu Munsi',

    welcome_back: 'Murakaza neza',
    operations_snapshot: "Incamake y'Ibikorwa",
    active_tasks_desc: 'Imirimo iri gukorwa mu kibuga',
    low_stock_desc: 'Ibikoresho bikeneye kongerwa',
    bulletins_desc: "Imiyoboro y'amatangazo ya Sitade",
    upcoming_itinerary: "Gahunda Yegereje ya Sitade",
    view_workflows: 'Reba Imirimo Yose',
    edit_profile_photo: "Hindura Umwirondoro n'Ifoto",
    priority_tasks_title: "Imirimo y'Imena & Ibyihutirwa",
    reports_for_review: 'Raporo zo Gusuzuma',
    pitch_status: "Imiterere y'Ikibuga",
    reset_demo_records: "Subiza ku Mizi Amakuru",

    role_manager: "Umuyobozi w'Ibikorwa bya Cricket",
    role_supervisor: 'Umugenzuzi / Umuyobozi Mukuru',
    role_storekeeper: "Umubitsi w'Ububiko",
    role_staff: "Umukozi w'Ibikorwa by'Ikibuga",
    role_admin: "Ushinzwe Sisitemu",

    landing_get_started: 'Tangira Ubu',
    landing_hero_badge: 'Ikibuga cyemewe ku rwego mpuzamahanga na ICC',
    landing_hero_title: 'Icyicaro Gikuru cy\'Ibikorwa n\'Ubwikorezi bya Sitade ya Gahanga',
    landing_hero_sub: 'Urubuga rw\'ubugenzuzi n\'ubuyobozi bwa Sitade ya Cricket ya Gahanga. Igenzura ry\'ikibuga, amatariki y\'imikino, ububiko bw\'ibikoresho, n\'abakozi bayobowe na Hagenimana Damascene hamwe n\'ikipe y\'abanyamwuga bo mu Rwanda.',
    landing_get_started_now: 'Tangira Gukoresha Ubu',
    landing_view_tasks: 'Reba Imirimo ya Buri Munsi',
    landing_enter_home: 'Injira muri Sisitemu y\'Ibikorwa',
    landing_live_tasks: 'Imirimo Iri Gukorwa',
    landing_stores_tracked: 'Ibikoresho Byanditswe',
    landing_staff_officials: 'Abakozi n\'Abasifuzi',
    landing_gallery_title: 'Amatembere n\'Amafoto ya Sitade ya Gahanga',
    landing_gallery_sub: 'Sura inyubako zidasanzwe zubatse mu buryo bwa kizungu, imikino mpuzamahanga, gutunganya ibyatsi by\'ikibuga, amatara yo mu ijoro, n\'inshundura z\'imyitozo. Byose biraboneka no mu gihe nta interineti ihari.',
    landing_features_badge: 'Imiterere ya Sisitemu n\'Amashami',
    landing_features_title: 'Ibikorwa Bifatanyije bigamije Intsinzi ya Sitade na Kriketi',
    landing_features_sub: 'Kuva ku kwita ku byatsi kugeza ku gukurikiza amategeko ya ICC, GCS ihuza imirimo yose y\'ikibuga ahantu hamwe.',
    landing_team_badge: 'Ubuyobozi bw\'Ibikorwa n\'Abakozi',
    landing_team_title: 'Ubuyobozi bw\'Ibikorwa bya Cricket',
    landing_team_sub: 'Abanyarwanda b\'abanyamwuga bakorera hamwe kugira ngo ikibuga gihorane icyemezo cya ICC n\'ubuziranenge bwo ku rwego rwo hejuru.',
    landing_nav_gallery: 'Amafoto ya Sitade',
    landing_nav_modules: 'Amashami y\'Imirimo',
    landing_nav_team: 'Ikipe y\'Ubuyobozi',
    landing_nav_metrics: 'Ibarurishamibare',
    landing_nav_departments: 'Amashami',
    landing_stat_activity: 'Ibikorwa Byanditswe n\'Igihe',
    landing_stat_departments: 'Amashami y\'Imirimo y\'Imena',
    landing_stat_capacity: 'Ubushobozi bwa Sitade bwo Kwakira Abantu',
    landing_stat_storage: 'Umutekano w\'Amakuru muri LocalStorage',
    landing_card_analytics_title: 'Imbonerahamwe n\'Ibarurishamibare',
    landing_card_analytics_desc: 'Ibipimo bya Recharts bigaragaza uko imirimo irangira hakurikijwe ubwihutirwe n\'imiterere yayo.',
    landing_card_analytics_btn: 'Fungura Ibiro by\'Ibarurishamibare',
    landing_card_tasks_title: 'Gukora Imirimo na Raporo',
    landing_card_tasks_desc: 'Raporo zitunganyije z\'abakozi b\'ikibuga zirimo imiterere y\'ikibuga, amafoto, ikirere, no kwemeza byihuse.',
    landing_card_tasks_btn: 'Reba Ubuyobozi bw\'Imirimo',
    landing_card_inventory_title: 'Ububiko bw\'Ibikoresho n\'Ubwikorezi',
    landing_card_inventory_desc: 'Ibarura ry\'ibikoresho bya Kriketi, imashini zikanda ubutaka, ifumbire, imipira y\'umukino hamwe n\'imipaka y\'imikino.',
    landing_card_inventory_btn: 'Injira mu Bubiko bw\'Ibikoresho',
    landing_card_facility_title: 'Ikibuga cya Sitade n\'Ibikorwaremezo',
    landing_card_facility_desc: 'Igenzura ry\'ikibuga cyo hagati, aho kwitoza, icyumba cy\'itangazamakuru, icyumba cy\'abanyacyubahiro n\'aho abakinnyi bihindurira.',
    landing_card_facility_btn: 'Sura Ibikorwaremezo bya Sitade',
    landing_card_directory_title: 'Urutonde rw\'Abakozi n\'Ikipe',
    landing_card_directory_desc: 'Imyirondoro yuzuye y\'abakozi irimo amashuri bize, imyaka y\'uburambe, urwego rw\'isuzuma, no guhindura ifoto.',
    landing_card_directory_btn: 'Reba Urutonde rw\'Abakozi',
    landing_card_audit_title: 'Ibyakozwe muri Sisitemu n\'Ubugenzuzi',
    landing_card_audit_desc: 'Amakuru adasibama yerekana buri gikorwa cyose cyakozwe, ibyemejwe, ibyasohotse mu bubiko, n\'igihe byakorewe.',
    landing_card_audit_btn: 'Sura Amakuru y\'Ubugenzuzi',
    landing_card_calendar_title: 'Kalandari y\'Imikino n\'Ibikorwa',
    landing_card_calendar_desc: 'Kalandari yuzuye yerekana ukwezi, icyumweru, n\'umunsi ku mikino, gutunganya ibyatsi, n\'imyitozo, bishobora no gusohorwa muri Google Calendar.',
    landing_card_calendar_btn: 'Fungura Kalandari ya Sitade',
    landing_departments_title: 'Amashami 5 Akorera Hamwe mu Bikorwa',
    landing_departments_sub: 'Amashami yihariye atuma ubuyobozi, kwigisha, gutoza kriketi, n\'ubusifuzi bwa ICC bikorana neza mu bwumvikane.',
    landing_leader_quote: '"Kwitwara neza mu kibuga bihera ku bikorwaremezo byubatswe neza kandi bikurikiranywe neza."',
    landing_leader_bio: 'Ayoboye ikipe y\'abanyarwanda b\'inzobere, Hagenimana akurikirana buri ntambwe yo gutegura sitade—uhereye ku buhehere bw\'ubutaka, amatara manini, kugeza ku gukurikirana ububiko bw\'ibikoresho.',
    landing_leader_btn_launch: 'Tangira Ibikorwa hamwe na Damascene',
    landing_leader_btn_team: 'Menya Ikipe Yose y\'Abakozi b\'Abanyarwanda',
    landing_footer_cta_title: 'Witeguye Kuyobora Ibikorwa bya Sitade?',
    landing_footer_cta_sub: 'Injira muri Sisitemu y\'Ibikorwa ifite imirimo yose, ububiko bw\'ibikoresho, n\'imbonerahamwe z\'ibarurishamibare.',
    landing_footer_cta_btn: 'Tangira Ubu — Injira muri Sisitemu'
  },

  fr: {
    nav_workspace: 'Espace des Opérations',
    nav_dashboard: 'Tableau de Bord & Analyses',
    nav_tasks: 'Flux des Tâches & Rapports',
    nav_calendar: 'Calendrier du Stade & Matchs',
    nav_inventory: 'Inventaire & Équipements',
    nav_facility: 'Terrain & Installations',
    nav_directory: 'Répertoire du Personnel',
    nav_communication: 'Communications & Bulletins',
    nav_audit: 'Registre d\'Audit & Conformité',
    nav_roles: 'Matrice des Rôles & Accès',
    nav_landing: 'Page d\'Accueil',

    switch_language: 'Changer de Langue',
    switch_role: 'Changer de Rôle',
    current_role: 'Rôle',
    change_theme: 'Changer le Thème',
    notifications: 'Notifications',
    profile: 'Profil',
    search_placeholder: 'Rechercher tâches, stock, matchs, personnel (Cmd+K)...',
    quick_jump: 'Accès Rapides',

    status_assigned: 'Assigné',
    status_in_progress: 'En cours',
    status_submitted: 'Soumis',
    status_revision_requested: 'Révision demandée',
    status_approved: 'Approuvé',
    status_cancelled: 'Annulé',
    status_draft: 'Brouillon',
    all_statuses: 'Tous les Statuts',

    priority_urgent: 'Urgent',
    priority_high: 'Élevé',
    priority_medium: 'Moyen',
    priority_low: 'Faible',
    all_priorities: 'Toutes les Priorités',

    tasks_title: 'Gestion des Tâches & Rapports',
    tasks_subtitle: 'Glissez-déposez les tâches entre les colonnes pour mettre à jour leur statut, suivre les livrables du terrain et valider les rapports',
    create_task: 'Créer & Assigner une Tâche',
    task_details: 'Détails de la Tâche',
    department: 'Département',
    assignee: 'Assigné à',
    deadline: 'Échéance',
    priority: 'Priorité',
    status: 'Statut',
    actions: 'Action',
    inspect: 'Inspecter',
    view_mode_kanban: 'Tableau Kanban',
    view_mode_table: 'Vue Liste / Table',
    drag_drop_hint: 'Glissez les cartes entre les colonnes pour faire avancer le flux opérationnel',
    move_to: 'Déplacer vers...',
    no_tasks_in_column: 'Aucune tâche dans cette colonne',
    drop_here: 'Déposez la tâche ici pour mettre à jour le statut',
    completion: 'Progression',
    report_summary: 'Résumé du Rapport',
    deliverables: 'Livrables & Remarques',
    comments: 'Commentaires & Historique',
    submit_report: 'Soumettre le Rapport',
    approve: 'Approuver la Tâche',
    request_revision: 'Demander des Révisions',
    cancel: 'Annuler',
    save: 'Enregistrer',
    confirm: 'Confirmer',
    assigned_to: 'Assigné à',

    calendar_title: 'Calendrier du Stade & Matchs',
    calendar_subtitle: 'Itinéraire centralisé pour les matchs internationaux, les cycles de roulement du terrain et les cliniques',
    schedule_event: 'Planifier un Match / Événement',
    view_month: 'Mois',
    view_week: 'Semaine',
    view_agenda: 'Ordre du jour',
    today: 'Aujourd\'hui (15 Oct)',
    all_events: 'Tous les Événements',
    matches: 'Matchs',
    pitch_turf: 'Terrain & Gazon',
    training: 'Entraînement',
    stadium_vip: 'Stade / VIP',
    stores_audit: 'Magasin / Audit',
    sync_task_deadlines: 'Synchroniser les Échéances',
    search_fixtures: 'Rechercher matchs, terrains...',
    export_ics: 'Exporter (.ics)',
    google_calendar: 'Google Agenda',
    chronological_agenda: 'Ordre du Jour Chronologique du Stade',
    earliest_first: 'Les Plus Proches d\'Abord',
    latest_first: 'Les Plus Éloignés d\'Abord',
    add_to_date: 'Ajouter à cette Date',

    welcome_back: 'Bon retour',
    operations_snapshot: 'Aperçu des Opérations',
    active_tasks_desc: 'Tâches opérationnelles en cours',
    low_stock_desc: 'Stocks sous le seuil d\'alerte',
    bulletins_desc: 'Canal de diffusion officiel',
    upcoming_itinerary: 'Prochain Itinéraire du Stade',
    view_workflows: 'Voir les Flux',
    edit_profile_photo: 'Modifier Profil & Photo',
    priority_tasks_title: 'Tâches Prioritaires & Livrables',
    reports_for_review: 'Rapports à Réviser',
    pitch_status: 'État du Pitch',
    reset_demo_records: 'Réinitialiser les Données',

    role_manager: 'Responsable des Opérations de Cricket',
    role_supervisor: 'Directeur / Superviseur',
    role_storekeeper: 'Gestionnaire du Magasin',
    role_staff: 'Personnel des Opérations de Terrain',
    role_admin: 'Administrateur Système',

    landing_get_started: 'Commencer',
    landing_hero_badge: 'Terrain Opérationnel Homologué par l\'ICC',
    landing_hero_title: 'Centre Névralgique des Opérations & de la Logistique du Stade de Cricket',
    landing_hero_sub: 'La suite opérationnelle centralisée pour le stade de cricket de Gahanga. Gérez la préparation du pitch, les calendriers de match, le contrôle des stocks et les équipes sous la direction de Hagenimana Damascene et d\'une équipe rwandaise d\'élite.',
    landing_get_started_now: 'Démarrer Maintenant',
    landing_view_tasks: 'Consulter les Tâches Quotidiennes',
    landing_enter_home: 'Accéder à l\'Espace Opérationnel',
    landing_live_tasks: 'Tâches en Cours',
    landing_stores_tracked: 'Articles en Magasin',
    landing_staff_officials: 'Personnel & Officiels',
    landing_gallery_title: 'Visite Virtuelle du Stade de Cricket de Gahanga',
    landing_gallery_sub: 'Découvrez les voûtes paraboliques primées, les matchs internationaux, la préparation du gazon, les projecteurs nocturnes et les filets d\'entraînement. Entièrement accessible hors ligne.',
    landing_features_badge: 'Architecture & Modules du Système',
    landing_features_title: 'Opérations Intégrées pour le Succès du Stade & du Cricket',
    landing_features_sub: 'De l\'entretien des terrains au respect des protocoles ICC, GCS coordonne toutes les activités du stade sur une seule plateforme.',
    landing_team_badge: 'Gouvernance & Personnel Opérationnel',
    landing_team_title: 'Direction des Opérations de Cricket',
    landing_team_sub: 'Des professionnels rwandais dévoués garantissant la certification ICC et des normes de compétition de classe mondiale.',
    landing_nav_gallery: 'Galerie du Stade',
    landing_nav_modules: 'Modules Clés',
    landing_nav_team: 'Équipe des Opérations',
    landing_nav_metrics: 'Métriques du Stade',
    landing_nav_departments: 'Départements',
    landing_stat_activity: 'Activités Enregistrées & Horodatées',
    landing_stat_departments: 'Départements Opérationnels Clés',
    landing_stat_capacity: 'Capacité de Spectateurs du Stade',
    landing_stat_storage: 'Intégrité des Données en LocalStorage',
    landing_card_analytics_title: 'Analyses Opérationnelles Visuelles',
    landing_card_analytics_desc: 'Visualisations graphiques interactives Recharts suivant les taux d\'achèvement par niveau d\'urgence et statut de tâche.',
    landing_card_analytics_btn: 'Ouvrir l\'Espace d\'Analyses',
    landing_card_tasks_title: 'Exécution des Tâches & Rapports',
    landing_card_tasks_desc: 'Rapports structurés des jardiniers avec état du pitch, photos, suivi météorologique et confirmation immédiate de soumission.',
    landing_card_tasks_btn: 'Gérer les Tâches',
    landing_card_inventory_title: 'Logistique des Équipements & Stocks',
    landing_card_inventory_desc: 'Inventaire en temps réel du matériel de cricket, rouleaux, engrais, balles de match et cordes de délimitation avec seuils d\'alerte.',
    landing_card_inventory_btn: 'Accéder au Magasin',
    landing_card_facility_title: 'Installations & Terrains du Stade',
    landing_card_facility_desc: 'Supervision directe du terrain central, des filets d\'entraînement, du centre des médias, du pavillon VIP et des vestiaires.',
    landing_card_facility_btn: 'Explorer les Installations',
    landing_card_directory_title: 'Répertoire du Personnel & Dossiers',
    landing_card_directory_desc: 'Profils détaillés du personnel incluant statut matrimonial, formation, niveaux d\'évaluation, années d\'expérience et studio d\'avatars.',
    landing_card_directory_btn: 'Voir le Répertoire',
    landing_card_audit_title: 'Registre d\'Activité & Audit Système',
    landing_card_audit_desc: 'Enregistrements d\'audit immuables traçant chaque soumission, approbation, mouvement de stock avec horodatage et identité des auteurs.',
    landing_card_audit_btn: 'Inspecter les Registres',
    landing_card_calendar_title: 'Calendrier du Stade & des Matchs',
    landing_card_calendar_desc: 'Calendrier complet avec vues Mois, Semaine et Agenda pour les rencontres, le compactage du terrain et l\'exportation Google Calendar / .ics.',
    landing_card_calendar_btn: 'Ouvrir le Calendrier',
    landing_departments_title: '5 Départements Opérationnels Coordonnés',
    landing_departments_sub: 'Départements spécialisés assurant un alignement parfait entre planification administrative, enseignement, entraînement et arbitrage officiel ICC.',
    landing_leader_quote: '"L\'excellence sur le terrain commence par une infrastructure opérationnelle rigoureuse."',
    landing_leader_bio: 'À la tête d\'une équipe opérationnelle rwandaise dévouée, Hagenimana supervise chaque phase de préparation du stade—du taux d\'humidité du sol aux passages du rouleau lourd, jusqu\'à l\'éclairage et au réapprovisionnement.',
    landing_leader_btn_launch: 'Lancer les Opérations avec Damascène',
    landing_leader_btn_team: 'Découvrir Toute l\'Équipe Africaine',
    landing_footer_cta_title: 'Prêt à Superviser les Opérations du Stade?',
    landing_footer_cta_sub: 'Accédez à l\'Espace d\'Accueil en direct avec flux de tâches en temps réel, suivi des stocks et tableaux de bord analytiques.',
    landing_footer_cta_btn: 'Commencer — Entrer dans l\'Espace Opérationnel'
  },

  sw: {
    nav_workspace: 'Eneo la Kazi la Uendeshaji',
    nav_dashboard: 'Dashibodi ya Takwimu & KPIs',
    nav_tasks: 'Usimamizi wa Kazi na Ripoti',
    nav_calendar: 'Kalenda ya Uwanja na Ratiba',
    nav_inventory: 'Ghala na Vifaa vya Uwanja',
    nav_facility: 'Uwanja wa Gahanga & Miundombinu',
    nav_directory: 'Orodha ya Wafanyakazi',
    nav_communication: 'Mawasiliano na Matangazo',
    nav_audit: 'Kumbukumbu za Ukaguzi',
    nav_roles: 'Majukumu na Idhini za Watumiaji',
    nav_landing: 'Ukurasa Mkuu',

    switch_language: 'Badilisha Lugha',
    switch_role: 'Badilisha Jukumu',
    current_role: 'Jukumu',
    change_theme: 'Badilisha Mandhari',
    notifications: 'Taarifa',
    profile: 'Wasifu',
    search_placeholder: 'Tafuta kazi, vifaa, mechi, wafanyakazi (Cmd+K)...',
    quick_jump: 'Njia za Mkato za Urambazaji',

    status_assigned: 'Imekabidhiwa',
    status_in_progress: 'Inaendelea',
    status_submitted: 'Imewasilishwa',
    status_revision_requested: 'Marekebisho Yanahitajika',
    status_approved: 'Imeidhinishwa',
    status_cancelled: 'Imeghairiwa',
    status_draft: 'Rasimu',
    all_statuses: 'Hali Zote',

    priority_urgent: 'Dharura Sana',
    priority_high: 'Kipaumbele cha Juu',
    priority_medium: 'Wastani',
    priority_low: 'Chini',
    all_priorities: 'Vipaumbele Vyote',

    tasks_title: 'Usimamizi wa Kazi na Ripoti',
    tasks_subtitle: 'Kokota na uangushe kadi za kazi kati ya safu ili kusasisha hali, kufuatilia shughuli za uwanja na kukagua ripoti',
    create_task: 'Tengeneza na Kabidhi Kazi',
    task_details: 'Maelezo ya Kazi',
    department: 'Idara',
    assignee: 'Mteule',
    deadline: 'Tarehe ya Mwisho',
    priority: 'Kipaumbele',
    status: 'Hali',
    actions: 'Kitendo',
    inspect: 'Kagua',
    view_mode_kanban: 'Bodi ya Kanban',
    view_mode_table: 'Mwonekano wa Jedwali',
    drag_drop_hint: 'Kokota kadi kwenye safu ili kusogeza mbele hatua ya kazi',
    move_to: 'Hamisha kwenda...',
    no_tasks_in_column: 'Hakuna kazi katika hali hii',
    drop_here: 'Weka kazi hapa ili kubadilisha hali',
    completion: 'Maendeleo',
    report_summary: 'Muhtasari wa Ripoti',
    deliverables: 'Maudhui na Vidokezo',
    comments: 'Mjadala na Maoni',
    submit_report: 'Wasilisha Ripoti',
    approve: 'Idhinisha Kazi',
    request_revision: 'Omba Marekebisho',
    cancel: 'Ghairi',
    save: 'Hifadhi',
    confirm: 'Thibitisha',
    assigned_to: 'Amekabidhiwa',

    calendar_title: 'Kalenda ya Uwanja na Ratiba ya Mechi',
    calendar_subtitle: 'Ratiba kuu ya mechi za kimataifa, mizunguko ya kunyunyizia na kusawazisha lami, na mafunzo',
    schedule_event: 'Panga Tukio / Mechi',
    view_month: 'Mwezi',
    view_week: 'Wiki',
    view_agenda: 'Ajenda',
    today: 'Leo (Oktoba 15)',
    all_events: 'Matukio Yote',
    matches: 'Mechi',
    pitch_turf: 'Uwanja na Nyasi',
    training: 'Mafunzo',
    stadium_vip: 'Uwanja / VIP',
    stores_audit: 'Ghala / Ukaguzi',
    sync_task_deadlines: 'Sawazisha Tarehe za Mwisho',
    search_fixtures: 'Tafuta mechi, nyanja...',
    export_ics: 'Hamisha (.ics)',
    google_calendar: 'Google Kalenda',
    chronological_agenda: 'Ajenda ya Uwanja kwa Mpangilio wa Wakati',
    earliest_first: 'Kuanzia za Awali',
    latest_first: 'Kuanzia za Mwisho',
    add_to_date: 'Ongeza kwenye Tarehe Hii',

    welcome_back: 'Karibu tena',
    operations_snapshot: 'Picha ya Uendeshaji',
    active_tasks_desc: 'Kazi zinazoendelea sasa',
    low_stock_desc: 'Vifaa vilivyopungua ghalani',
    bulletins_desc: 'Kituo rasmi cha matangazo',
    upcoming_itinerary: 'Ratiba Ijayo ya Uwanja',
    view_workflows: 'Tazama Michakato',
    edit_profile_photo: 'Hariri Wasifu & Picha',
    priority_tasks_title: 'Kazi Zenye Kipaumbele',
    reports_for_review: 'Ripoti Zinazosubiri Ukaguzi',
    pitch_status: 'Hali ya Uwanja wa Kriketi',
    reset_demo_records: 'Weka Upya Takwimu za Mfano',

    role_manager: 'Meneja wa Uendeshaji wa Kriketi',
    role_supervisor: 'Mkurugenzi / Msimamizi Mkuu',
    role_storekeeper: 'Mweka Ghala Mkuu',
    role_staff: 'Mfanyakazi wa Uendeshaji wa Uwanja',
    role_admin: 'Msimamizi wa Mfumo',

    landing_get_started: 'Anza Sasa',
    landing_hero_badge: 'Uwanja Wenye Cheti Rasmi cha Utambuzi wa ICC',
    landing_hero_title: 'Kituo Kikuu cha Uendeshaji na Vifaa vya Uwanja wa Kriketi wa Kimataifa',
    landing_hero_sub: 'Mfumo jumuishi wa uendeshaji wa Uwanja wa Kriketi wa Gahanga. Dhibiti maandalizi ya uwanja, ratiba za mechi, usimamizi wa ghala na utendaji wa wafanyakazi chini ya Meneja wa Uendeshaji wa Kriketi Hagenimana Damascene na timu ya wataalamu wa Rwanda.',
    landing_get_started_now: 'Anza Kutumia Sasa',
    landing_view_tasks: 'Tazama Kazi za Kila Siku',
    landing_enter_home: 'Ingia kwenye Ukurasa wa Kazi',
    landing_live_tasks: 'Kazi Zinazoendelea',
    landing_stores_tracked: 'Vifaa vya Ghala',
    landing_staff_officials: 'Wafanyakazi & Waamuzi',
    landing_gallery_title: 'Ziara ya Picha za Uwanja wa Kriketi wa Gahanga',
    landing_gallery_sub: 'Tazama majengo mashuhuri yenye matao ya kisasa, mechi za kimataifa, utunzaji wa nyasi, taa za usiku, na vyandarua vya mazoezi. Inapatikana kikamilifu hata bila intaneti.',
    landing_features_badge: 'Muundo wa Mfumo na Idara',
    landing_features_title: 'Uendeshaji Jumuishi kwa Mafanikio ya Uwanja na Mchezo wa Kriketi',
    landing_features_sub: 'Kuanzia kutunza udongo wa uwanja hadi kufuata taratibu za ICC, GCS inaratibu shughuli zote za uwanja katika jukwaa moja.',
    landing_team_badge: 'Uongozi wa Uendeshaji na Wafanyakazi',
    landing_team_title: 'Uongozi wa Uendeshaji wa Kriketi',
    landing_team_sub: 'Wataalamu wa Rwanda wanaojitolea kuhakikisha utambuzi wa ICC na viwango vya mechi vya kiwango cha juu ulimwenguni.',
    landing_nav_gallery: 'Picha za Uwanja',
    landing_nav_modules: 'Sehemu Kuu',
    landing_nav_team: 'Timu ya Uendeshaji',
    landing_nav_metrics: 'Takwimu za Uwanja',
    landing_nav_departments: 'Idara',
    landing_stat_activity: 'Shughuli Zilizorekodiwa & Kuwekewa Muhuri',
    landing_stat_departments: 'Idara Kuu za Uendeshaji',
    landing_stat_capacity: 'Uwezo wa Watazamaji wa Uwanja',
    landing_stat_storage: 'Usalama wa Data katika LocalStorage',
    landing_card_analytics_title: 'Takwimu za Kuona za Uendeshaji',
    landing_card_analytics_desc: 'Michoro maingiliano ya Recharts inayofuatilia viwango vya kukamilika kwa kazi kulingana na uharaka na hatua za utekelezaji.',
    landing_card_analytics_btn: 'Fungua Eneo la Takwimu',
    landing_card_tasks_title: 'Utekelezaji wa Kazi & Ripoti',
    landing_card_tasks_desc: 'Ripoti zilizopangwa za watunza uwanja zenye hali ya lami, picha, ufuatiliaji wa hali ya hewa na uthibitisho wa papo hapo wa kuwasilisha.',
    landing_card_tasks_btn: 'Tazama Usimamizi wa Kazi',
    landing_card_inventory_title: 'Vifaa & Usafirishaji wa Ghala',
    landing_card_inventory_desc: 'Orodha ya wakati halisi ya vifaa vya kriketi, mashine za kukandamiza, mbolea, mipira ya mechi na kamba za mipaka yenye viwango vya chini vya tahadhari.',
    landing_card_inventory_btn: 'Ingia kwenye Ghala la Vifaa',
    landing_card_facility_title: 'Uwanja wa Gahanga & Miundombinu',
    landing_card_facility_desc: 'Usimamizi wa moja kwa moja wa Uwanja Mkuu wa Mechi, Vyandarua vya Mazoezi, Kituo cha Habari, Banda la VIP na Vyumba vya Kubadilishia Nguo.',
    landing_card_facility_btn: 'Chunguza Miundombinu ya Uwanja',
    landing_card_directory_title: 'Orodha ya Wafanyakazi & Wasifu',
    landing_card_directory_desc: 'Wasifu kamili wa watumishi wenye hali ya ndoa, kiwango cha elimu, ngazi za tathmini, miaka ya uzoefu na studio ya picha za utambulisho.',
    landing_card_directory_btn: 'Tazama Orodha ya Wafanyakazi',
    landing_card_audit_title: 'Shughuli za Mfumo & Daftari ya Ukaguzi',
    landing_card_audit_desc: 'Kumbukumbu za kudumu za ukaguzi zinazofuatilia kila uwasilishaji, idhini, utoaji wa vifaa na marekebisho ya wasifu zikiwa na tarehe na mhusika.',
    landing_card_audit_btn: 'Kagua Daftari ya Ukaguzi',
    landing_card_calendar_title: 'Kalenda ya Uwanja na Ratiba',
    landing_card_calendar_desc: 'Kalenda kamili ya uendeshaji yenye maoni ya Mwezi, Wiki na Ajenda ya mechi, usawazishaji wa unyevu wa udongo na usafirishaji wa Google Calendar / .ics.',
    landing_card_calendar_btn: 'Fungua Kalenda ya Uwanja',
    landing_departments_title: 'Idara 5 za Uendeshaji Zilizoratibiwa',
    landing_departments_sub: 'Idara maalum zinazohakikisha uwiano mzuri kati ya upangaji wa kiutawala, ufundishaji wa chuo, ukufunzi wa kriketi na uamuzi rasmi wa ICC.',
    landing_leader_quote: '"Ubora uwanjani unaanza na miundombinu yenye nidhamu ya kiutendaji."',
    landing_leader_bio: 'Akiongoza timu ya wataalamu wa Rwanda, Hagenimana anasimamia kila awamu ya maandalizi ya uwanja—kutoka unyevu wa udongo, kukandamiza kwa mashine nzito, hadi matengenezo ya taa na ujazaji wa vifaa vya ghala.',
    landing_leader_btn_launch: 'Anza Uendeshaji na Damascene',
    landing_leader_btn_team: 'Kutana na Timu Nzima ya Kiafrika',
    landing_footer_cta_title: 'Uko Tayari Kusimamia Uendeshaji wa Uwanja?',
    landing_footer_cta_sub: 'Pata ufikiaji wa Eneo la Kazi la Moja kwa Moja lenye michakato ya kazi, ufuatiliaji wa ghala na dashibodi za takwimu.',
    landing_footer_cta_btn: 'Anza Sasa — Ingia kwenye Eneo la Kazi'
  }
};
