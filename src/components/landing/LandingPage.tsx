import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Package, 
  Building2, 
  Users, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Award, 
  Sparkles, 
  CheckSquare, 
  Megaphone,
  Palette,
  Layers,
  Activity,
  HardHat
} from 'lucide-react';
import { User, ThemeMode } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import stadiumHeroImg from '../../assets/images/gcs_stadium_exterior_1791894260939.jpg';
import managerAvatarImg from '../../assets/images/avatar_manager_eric_1791894261473.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreSection?: (section: string) => void;
  currentUser: User;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  totalTasksCount: number;
  inventoryItemCount: number;
  staffCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreSection,
  currentUser,
  currentTheme,
  onSelectTheme,
  totalTasksCount,
  inventoryItemCount,
  staffCount
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Stadium Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-teal-500/20">
              GCS
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                {t('app.stadium_name', 'Gahanga Cricket Stadium')}
              </span>
              <span className="text-[11px] text-teal-400 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                {t('app.subtitle', 'Kigali, Rwanda · Operations Hub')}
              </span>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">
              {t('landing.key_modules', 'Key Modules')}
            </a>
            <a href="#leadership" className="hover:text-teal-400 transition-colors">
              {t('landing.leadership', 'Operations Team')}
            </a>
            <a href="#stats" className="hover:text-teal-400 transition-colors">
              {t('workspace.stadium_readiness', 'Facility Metrics')}
            </a>
            <a href="#departments" className="hover:text-teal-400 transition-colors">
              {t('dept.administration', 'Departments')}
            </a>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <LanguageSelector variant="landing" />

            {/* Get Started Button (Primary CTA) */}
            <button
              onClick={onGetStarted}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
            >
              <span>{t('action.get_started', 'Get Started')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-slate-800">
        {/* Ambient Stadium Glow Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-teal-500/20 via-emerald-500/10 to-transparent blur-3xl rounded-full"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-600/10 blur-3xl rounded-full"></div>
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Mission & Headline */}
            <div className="lg:col-span-7 space-y-6">
              {/* Rwandan Flag & Official Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{t('landing.hero_badge', 'Official Ground Operations · Kigali, Rwanda')}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {t('landing.hero_title_1', 'World-Class')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300">
                  {t('landing.hero_title_accent', 'Cricket Stadium')}
                </span>{' '}
                {t('landing.hero_title_2', 'Operations & Logistics Nerve Center')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {t('landing.hero_desc', 'The centralized operational suite for Gahanga Cricket Stadium. Manage pitch preparation, match day schedules, inventory control, and staff execution under Cricket Operations Manager Hagenimana Damascene.')}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{t('action.get_started', 'Get Started Now')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onExploreSection ? onExploreSection('tasks') : onGetStarted()}
                  className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.tasks', 'View Daily Operational Tasks')}</span>
                </button>
              </div>

              {/* Trust & Spec Highlights */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-Time LocalStorage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Recharts Visual Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 Operational Divisions</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Visual Stadium Card */}
            <div className="lg:col-span-5">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500/40 via-emerald-500/30 to-amber-500/30 blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>

                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                  {/* Real Stadium Photography */}
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden">
                    <img 
                      src={stadiumHeroImg} 
                      alt="Gahanga Cricket Stadium Kigali Rwanda" 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Badge on photo */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-teal-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Host of ICC World Cup Qualifiers</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                      <span className="font-semibold text-white drop-shadow-md">Gahanga International Oval</span>
                      <span className="bg-emerald-500/80 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE HUB</span>
                    </div>
                  </div>

                  {/* Operational Snapshot Details */}
                  <div className="p-4 sm:p-5 space-y-3 bg-slate-900">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Cricket Operations Manager</span>
                        <span className="text-sm font-bold text-slate-100">Hagenimana Damascene</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-medium">
                        Administration
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Live Tasks</span>
                        <span className="text-teal-400 font-bold font-mono text-sm">{totalTasksCount}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Stores Tracked</span>
                        <span className="text-emerald-400 font-bold font-mono text-sm">{inventoryItemCount}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Staff & Officials</span>
                        <span className="text-amber-400 font-bold font-mono text-sm">{staffCount}</span>
                      </div>
                    </div>

                    {/* Fast Direct Enter Trigger */}
                    <button
                      onClick={onGetStarted}
                      className="w-full mt-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 text-teal-300 hover:text-white border border-teal-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Enter Operational Home Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Stats Banner */}
      <section id="stats" className="bg-slate-900/60 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-mono">
                100%
              </span>
              <p className="text-xs text-slate-400 font-medium">Activity Logged & Timestamped</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
                5
              </span>
              <p className="text-xs text-slate-400 font-medium">Key Operational Departments</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300 font-mono">
                2,500+
              </span>
              <p className="text-xs text-slate-400 font-medium">Stadium Spectator Capacity</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-teal-400 font-mono">
                24/7
              </span>
              <p className="text-xs text-slate-400 font-medium">LocalStorage Data Integrity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Operational Modules Grid */}
      <section id="features" className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              System Architecture & Modules
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Integrated Operations for Stadium & Cricket Success
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              From pitch curating to ICC match protocol compliance, GCS coordinates all ground activities in a single platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Manager Workspace & Recharts */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  Visual Operational Analytics
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive Recharts bar visualizations monitoring completion rates across urgency levels and task workflow statuses.
                </p>
              </div>
              <button
                onClick={() => onExploreSection ? onExploreSection('workspace') : onGetStarted()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 cursor-pointer"
              >
                <span>Open Analytics Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Task & Shift Reports */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Task Execution & Reports
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Structured groundskeeper reports with pitch conditions, photo records, weather tracking, and instant submission confirmation feedback.
                </p>
              </div>
              <button
                onClick={() => onExploreSection ? onExploreSection('tasks') : onGetStarted()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <span>View Task Management</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Storehouse & Inventory */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Equipment & Stores Logistics
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time inventory of cricket gear, pitch rollers, fertilizers, match balls, boundary ropes with automated minimum thresholds.
                </p>
              </div>
              <button
                onClick={() => onExploreSection ? onExploreSection('inventory') : onGetStarted()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <span>Access Inventory Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Stadium Facilities & Grounds */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Stadium Oval & Facilities
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct oversight over Main Ground Oval, Practice Net Enclosures, Media Center, VIP Pavilion, and Player Dressing Rooms.
                </p>
              </div>
              <button
                onClick={() => onExploreSection ? onExploreSection('facility') : onGetStarted()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                <span>Explore Stadium Facilities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 5: African Personnel & Staff Dossiers */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  Staff Directory & Dossiers
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Comprehensive personnel profiles featuring marital status, education, evaluation tiers, experience years, photo editing, and avatar studio.
                </p>
              </div>
              <button
                onClick={() => onExploreSection ? onExploreSection('directory') : onGetStarted()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 cursor-pointer"
              >
                <span>View Staff Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 6: Audit Compliance & Activity Trail */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                  System Activity & Audit Log
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Immutable audit records tracking every submission, approval, stock issue, and profile update with date/time stamps and actor identities.
                </p>
              </div>
              <button
                onClick={() => onExploreSection ? onExploreSection('audit') : onGetStarted()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                <span>Inspect Audit Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 7: Stadium & Fixture Calendar */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Stadium & Fixture Calendar
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full operational calendar with Month, Week, and Agenda views for match fixtures, pitch moisture rolling, trainings, and Google Calendar / .ics export.
                </p>
              </div>
              <button
                onClick={() => onExploreSection ? onExploreSection('calendar') : onGetStarted()}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <span>Open Stadium Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Required Departments Breakdown */}
      <section id="departments" className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
                Operational Divisions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                5 Coordinated Operational Departments
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Specialized departments ensuring seamless alignment between administrative planning, academy teaching, cricket coaching, and official ICC match umpiring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="font-bold text-sm text-slate-100">Administration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strategic scheduling, ICC compliance, government coordination, and facility budgeting.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="font-bold text-sm text-slate-100">Development</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grassroots cricket pathways, regional talent scouting, school clinics across Rwanda.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="font-bold text-sm text-slate-100">Coaching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance drills, national team squad conditioning, video match analysis.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h4 className="font-bold text-sm text-slate-100">Teaching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Curriculum instruction, youth cricket education, rules and sportsmanship mentoring.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                05
              </div>
              <h4 className="font-bold text-sm text-slate-100">Officiating / Match Officials</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Certified ICC umpires, scorers, match referees, and boundary line regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Spotlight: Hagenimana Damascene */}
      <section id="leadership" className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Leader Avatar */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-xl shadow-teal-500/10">
                    <img
                      src={managerAvatarImg}
                      alt="Hagenimana Damascene Cricket Operations Manager"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    Chief of Operations
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-white">Hagenimana Damascene</h3>
                <p className="text-xs text-teal-400 font-medium">Cricket Operations Manager</p>
                <p className="text-[11px] text-slate-400 mt-1">GCS Kigali · Rwanda Cricket Association</p>
              </div>

              {/* Bio & Leadership Focus */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>ICC Certified Operations Director & Pitch Curator</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  "Excellence on the pitch begins with disciplined operational infrastructure."
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Leading a dedicated Rwandan operational cohort, Hagenimana oversees every phase of stadium preparation—from pitch moisture content and heavy roller passes to floodlight maintenance and inventory replenishment. Under his stewardship, GCS maintains the highest international standard for players, visiting national teams, and cricket fans worldwide.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onGetStarted}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Launch Operations with Damascene</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onExploreSection ? onExploreSection('directory') : onGetStarted()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>Meet the Complete African Staff Roster</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA & Footer */}
      <footer className="mt-auto bg-slate-950 pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Large Call-out Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-emerald-950/60 border border-teal-500/30 text-center space-y-5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Oversee Stadium Operations?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Access the live Home Workspace with real-time task workflows, store tracking, and analytics dashboards.
            </p>
            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-base inline-flex items-center gap-2.5 shadow-xl shadow-teal-500/30 transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Get Started — Enter Home Workspace</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Credits & Ground Information */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Gahanga Cricket Stadium (GCS) · Kigali, Rwanda</span>
            </div>

            <div className="flex items-center gap-6">
              <span>Managed by: <strong>Hagenimana Damascene</strong></span>
              <span>·</span>
              <span>ICC Associate Grounds Certification</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
