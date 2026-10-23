import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  UserCheck,
  CheckCircle2,
  GraduationCap,
  Award,
  Briefcase,
  Heart,
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';
import { User, Department } from '../../types';
import { Modal } from '../common/Modal';
import { useTranslation } from '../../context/LanguageContext';

interface StaffDirectoryProps {
  users: User[];
  currentUser?: User;
  onOpenMessageWithUser?: (user: User) => void;
  onOpenProfile?: () => void;
  initialUserId?: string | null;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({
  users,
  currentUser,
  onOpenMessageWithUser,
  onOpenProfile,
  initialUserId
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

  useEffect(() => {
    if (initialUserId) {
      const found = users.find(u => u.id === initialUserId);
      if (found) {
        setSelectedStaff(found);
      }
    }
  }, [initialUserId, users]);

  const departments: Department[] = [
    'Cricket Operations',
    'Administration',
    'Development',
    'Coaching',
    'Teaching',
    'Officiating & Match Officials',
    'Ground & Pitch Maintenance',
    'Stores & Logistics'
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.positionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || u.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const occupiedCount = users.filter(u => u.positionStatus !== 'Vacant').length;
  const vacantCount = users.filter(u => u.positionStatus === 'Vacant').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t('nav.directory', 'Staff & Team Directory')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational personnel, department rosters, education backgrounds, and evaluation tiers
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800">
            Occupied: <strong className="text-teal-400">{occupiedCount}</strong>
          </span>
          {vacantCount > 0 && (
            <span className="bg-amber-950/60 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-800/60">
              Vacancies: <strong className="text-amber-400">{vacantCount}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name, position, school, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          aria-label="Filter staff by department"
          className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-hidden focus:border-teal-500"
        >
          <option value="ALL">All Departments ({departments.length})</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isVacant = user.positionStatus === 'Vacant';
          return (
            <div
              key={user.id}
              onClick={() => setSelectedStaff(user)}
              className={`bg-slate-900 border rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between ${
                isVacant ? 'border-amber-800/60 hover:border-amber-700 bg-amber-950/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                        {isVacant ? '?' : user.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors truncate">
                        {user.name}
                      </h3>
                      {isVacant ? (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                          Open Vacancy
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-teal-400 font-medium truncate mt-0.5">
                      {user.positionName || user.jobTitle}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user.department}
                    </p>
                  </div>
                </div>

                {/* Professional Highlights Strip */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px]">
                  {user.evaluationLevel && (
                    <span className="text-teal-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[200px]">
                      {user.evaluationLevel}
                    </span>
                  )}
                  {user.experienceYears !== undefined && (
                    <span className="text-slate-400 font-mono tabular-nums">
                      {user.experienceYears} yrs exp ({user.experienceLevel})
                    </span>
                  )}
                </div>

                {user.bio && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="truncate max-w-[160px]">
                  {user.supervisorName ? `Reports to: ${user.supervisorName}` : 'Executive Level'}
                </span>
                <span className="text-teal-400 group-hover:underline">
                  Full Dossier →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <Modal
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
          title={selectedStaff.name}
          subtitle={`${selectedStaff.positionName || selectedStaff.jobTitle} · ${selectedStaff.department}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                {selectedStaff.avatarUrl ? (
                  <img
                    src={selectedStaff.avatarUrl}
                    alt={selectedStaff.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-lg">
                    {selectedStaff.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-100">{selectedStaff.name}</h4>
                <p className="text-teal-400 font-medium">{selectedStaff.positionName || selectedStaff.jobTitle}</p>
                <p className="text-[11px] text-slate-400">{selectedStaff.department}</p>
              </div>
            </div>

            {/* Comprehensive Operational & Personal Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 block">Position Status</span>
                <strong className={`font-semibold ${selectedStaff.positionStatus === 'Vacant' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedStaff.positionStatus || 'Occupied'}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 block">Marital Status</span>
                <strong className="text-slate-200">
                  {selectedStaff.maritalStatus || 'Single'}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 block">Date of Birth</span>
                <strong className="text-slate-200 font-mono tabular-nums">
                  {selectedStaff.dateOfBirth || '1990-01-01'}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 block">Joining Company Date</span>
                <strong className="text-slate-200 font-mono tabular-nums">
                  {selectedStaff.joiningCompanyDate || selectedStaff.joinedDate}
                </strong>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[11px] text-slate-500 block">Evaluation Level & Tier</span>
                <strong className="text-teal-300">
                  {selectedStaff.evaluationLevel || 'Tier 1 — Outstanding / ICC Certified'}
                </strong>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[11px] text-slate-500 block">Experience Level & Tenure</span>
                <strong className="text-slate-200 font-mono">
                  {selectedStaff.experienceYears || 5} Years Experience ({selectedStaff.experienceLevel || 'Senior'})
                </strong>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[11px] text-slate-500 block">School & Educational Background</span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {selectedStaff.schoolBackground || 'Bachelor of Sports Management'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 block">Official Work Email</span>
                <p className="text-slate-300 font-mono truncate">{selectedStaff.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 block">Direct Phone</span>
                <p className="text-slate-300 font-mono">{selectedStaff.phone}</p>
              </div>
            </div>

            {selectedStaff.bio && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Operational Responsibilities & Bio
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  {selectedStaff.bio}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <div>
                {onOpenProfile && (currentUser?.id === selectedStaff.id || currentUser?.role === 'SUPERVISOR' || currentUser?.role === 'SYSTEM_ADMIN') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaff(null);
                      onOpenProfile();
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Edit Profile & Photo</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onOpenMessageWithUser && selectedStaff.id !== currentUser?.id && selectedStaff.positionStatus !== 'Vacant' && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenMessageWithUser(selectedStaff);
                      setSelectedStaff(null);
                    }}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Direct Message</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedStaff(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
