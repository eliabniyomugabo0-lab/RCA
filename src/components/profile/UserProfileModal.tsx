import React, { useState, useEffect, useRef } from 'react';
import { User, Department } from '../../types';
import { Modal } from '../common/Modal';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Calendar, 
  Save, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Heart,
  Clock,
  Camera,
  Upload,
  Link,
  Trash2,
  Check,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

import avatarManagerEric from '../../assets/images/avatar_manager_eric_1791894261473.jpg';
import avatarClaireUwase from '../../assets/images/avatar_claire_uwase_1791896213148.jpg';
import avatarJeanpaulMugisha from '../../assets/images/avatar_jeanpaul_mugisha_1791896213713.jpg';
import avatarAlineMukamana from '../../assets/images/avatar_aline_mukamana_1791896213479.jpg';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updated: User) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

const PRESET_AVATARS = [
  {
    id: 'damascene',
    label: 'Hagenimana Damascene (Manager Studio)',
    url: avatarManagerEric
  },
  {
    id: 'claire',
    label: 'Claire Uwase (Director Executive)',
    url: avatarClaireUwase
  },
  {
    id: 'jeanpaul',
    label: 'Jean-Paul Mugisha (Logistics & Custodian)',
    url: avatarJeanpaulMugisha
  },
  {
    id: 'aline',
    label: 'Aline Mukamana (Ground & Pitch Lead)',
    url: avatarAlineMukamana
  }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onShowToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile data states
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [positionName, setPositionName] = useState(currentUser.positionName || currentUser.jobTitle);
  const [department, setDepartment] = useState<Department>(currentUser.department);
  const [maritalStatus, setMaritalStatus] = useState(currentUser.maritalStatus || 'Married');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser.dateOfBirth || '1988-04-12');
  const [joiningCompanyDate, setJoiningCompanyDate] = useState(currentUser.joiningCompanyDate || currentUser.joinedDate || '2022-03-15');
  const [schoolBackground, setSchoolBackground] = useState(currentUser.schoolBackground || '');
  const [evaluationLevel, setEvaluationLevel] = useState(currentUser.evaluationLevel || 'Tier 1 — Outstanding / ICC Certified');
  const [experienceLevel, setExperienceLevel] = useState(currentUser.experienceLevel || 'Senior');
  const [experienceYears, setExperienceYears] = useState(currentUser.experienceYears || 10);
  const [positionStatus, setPositionStatus] = useState<'Occupied' | 'Vacant'>(currentUser.positionStatus || 'Occupied');

  // Photo & Avatar state
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Sync state whenever modal opens or currentUser updates
  useEffect(() => {
    setName(currentUser.name);
    setPhone(currentUser.phone);
    setBio(currentUser.bio || '');
    setPositionName(currentUser.positionName || currentUser.jobTitle);
    setDepartment(currentUser.department);
    setMaritalStatus(currentUser.maritalStatus || 'Married');
    setDateOfBirth(currentUser.dateOfBirth || '1988-04-12');
    setJoiningCompanyDate(currentUser.joiningCompanyDate || currentUser.joinedDate || '2022-03-15');
    setSchoolBackground(currentUser.schoolBackground || '');
    setEvaluationLevel(currentUser.evaluationLevel || 'Tier 1 — Outstanding / ICC Certified');
    setExperienceLevel(currentUser.experienceLevel || 'Senior');
    setExperienceYears(currentUser.experienceYears || 10);
    setPositionStatus(currentUser.positionStatus || 'Occupied');
    setAvatarUrl(currentUser.avatarUrl || '');
    setShowPhotoEditor(false);
    setCustomUrlInput('');
  }, [currentUser, isOpen]);

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

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('error', 'Invalid File Type', 'Please choose a PNG, JPG, or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onShowToast('error', 'File Too Large', 'Please upload a photo under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        onShowToast('success', 'Photo Loaded', 'Profile photo uploaded. Click "Save Profile" to apply changes.');
      }
    };
    reader.onerror = () => {
      onShowToast('error', 'Upload Error', 'Could not read the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setCustomUrlInput('');
    onShowToast('info', 'Photo URL Applied', 'Previewing new image URL.');
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onShowToast('info', 'Photo Removed', 'Reverted to standard monogram initials.');
  };

  const handleSelectPreset = (url: string) => {
    setAvatarUrl(url);
    onShowToast('info', 'Preset Selected', 'Applied official Rwandan personnel portrait.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('error', 'Validation Error', 'Full name is required.');
      return;
    }

    const updated: User = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      positionName: positionName.trim(),
      jobTitle: positionName.trim(),
      department,
      maritalStatus,
      dateOfBirth,
      joiningCompanyDate,
      joinedDate: joiningCompanyDate,
      schoolBackground: schoolBackground.trim(),
      evaluationLevel: evaluationLevel.trim(),
      experienceLevel,
      experienceYears: Number(experienceYears) || 0,
      positionStatus
    };

    onSaveProfile(updated);
    onClose();
    onShowToast('success', 'Profile & Photo Saved', 'Personnel dossier updated and synchronized across all operational workspaces.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Official Records"
      subtitle="Complete operational personnel profile and portrait manager for GCS Operations Hub"
      maxWidth="2xl"
    >
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Profile Card Header with Avatar Edit Trigger */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Avatar with Camera Overlay Trigger */}
              <div className="relative group shrink-0">
                <div className="w-18 h-18 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-md">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-teal-300 text-xl bg-slate-800">
                      {name.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPhotoEditor(!showPhotoEditor)}
                  className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-full flex flex-col items-center justify-center text-white transition-opacity cursor-pointer border border-teal-500/50"
                  title="Click to edit or upload profile photo"
                >
                  <Camera className="w-5 h-5 text-teal-300" />
                  <span className="text-[9px] font-semibold tracking-wider uppercase mt-0.5">Edit Photo</span>
                </button>

                {/* Badge Indicator */}
                <button
                  type="button"
                  onClick={() => setShowPhotoEditor(!showPhotoEditor)}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-md border-2 border-slate-900 transition-transform active:scale-95"
                  title="Change profile portrait"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{name}</h4>
                  <button
                    type="button"
                    onClick={() => setShowPhotoEditor(!showPhotoEditor)}
                    className="text-[10px] text-teal-400 hover:text-teal-300 underline font-medium"
                  >
                    {showPhotoEditor ? 'Hide Photo Options' : 'Change Photo'}
                  </button>
                </div>
                <p className="text-teal-400 font-medium truncate">{positionName}</p>
                <p className="text-[11px] text-slate-400 truncate">{department}</p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 text-[11px]">
              <span className="font-mono text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/80">
                {evaluationLevel}
              </span>
              <span className="text-slate-400">
                Tenure: <strong className="text-slate-200 font-mono">{experienceYears} Years Exp</strong> ({experienceLevel})
              </span>
            </div>
          </div>

          {/* Photo Editing Panel */}
          {showPhotoEditor && (
            <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                  Profile Photo & Portrait Controls
                </span>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {/* Upload & URL Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Method 1: Local File Upload */}
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Upload from Computer / Device
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="profile-photo-upload"
                  />
                  <label
                    htmlFor="profile-photo-upload"
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-medium"
                  >
                    <Upload className="w-3.5 h-3.5 text-teal-400" />
                    <span>Choose Image File...</span>
                  </label>
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    Supports PNG, JPG, WebP up to 5MB
                  </span>
                </div>

                {/* Method 2: Web Image URL */}
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Or Enter Image URL Link
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded border border-slate-700 text-xs font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    Direct public link to avatar image
                  </span>
                </div>
              </div>

              {/* Method 3: Official Stadium Roster Portrait Presets */}
              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 block mb-2">
                  Select from Official Stadium Personnel Portraits:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-xs'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-semibold block truncate">
                            {preset.label.split(' ')[0]} {preset.label.split(' ')[1]}
                          </span>
                          <span className="text-[9px] text-slate-500 block truncate">
                            {isSelected ? 'Active' : 'Preset'}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-teal-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Professional & Position Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
            <Briefcase className="w-3.5 h-3.5 text-teal-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Position & Organizational Placement
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Position / Vacant Title *</label>
              <input
                type="text"
                required
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                placeholder="e.g. Cricket Operations Manager"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Position Status</label>
              <select
                value={positionStatus}
                onChange={(e) => setPositionStatus(e.target.value as 'Occupied' | 'Vacant')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                <option value="Occupied">Occupied (Active Post)</option>
                <option value="Vacant">Vacant (Open Requisition)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Joining Company Date *</label>
              <input
                type="date"
                required
                value={joiningCompanyDate}
                onChange={(e) => setJoiningCompanyDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Evaluation & Accreditation Tier</label>
              <input
                type="text"
                value={evaluationLevel}
                onChange={(e) => setEvaluationLevel(e.target.value)}
                placeholder="e.g. Tier 1 — Outstanding / ICC Certified"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Years of Exp</label>
                <input
                  type="number"
                  min="0"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Personal, Marital & Education Background */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Personal Data & Education Background
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Marital Status *</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Direct Phone Contact</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">School & Educational Background *</label>
            <input
              type="text"
              required
              value={schoolBackground}
              onChange={(e) => setSchoolBackground(e.target.value)}
              placeholder="e.g. BSc Sports Management — University of Rwanda · ICC Level 3 Diploma"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Operational Bio / Career Summary</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summarize operational oversight, pitch credentials, or matchday responsibilities..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowPhotoEditor(!showPhotoEditor)}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{showPhotoEditor ? 'Collapse Photo Studio' : 'Edit Profile Photo'}</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile & Photo</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
