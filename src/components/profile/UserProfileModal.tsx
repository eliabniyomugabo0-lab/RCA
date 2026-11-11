import React, { useState, useEffect, useRef } from 'react';
import { User, Department, ProfileAttachment, ProfileAttachmentCategory, ProfileAttachmentSource } from '../../types';
import { Modal } from '../common/Modal';
import { FilePreviewModal } from '../common/FilePreviewModal';
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
  Link as LinkIcon,
  Trash2,
  Check,
  Sparkles,
  Image as ImageIcon,
  Paperclip,
  FileText,
  File,
  Download,
  FileCheck,
  Plus,
  AlertCircle,
  Eye,
  Search,
  Video,
  VideoOff,
  RefreshCw,
  Globe,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  FolderOpen,
  Info
} from 'lucide-react';

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
    url: '/src/assets/images/avatar_manager_eric_1791894261473.jpg'
  },
  {
    id: 'claire',
    label: 'Claire Uwase (Director Executive)',
    url: '/src/assets/images/avatar_claire_uwase_1791896213148.jpg'
  },
  {
    id: 'jeanpaul',
    label: 'Jean-Paul Mugisha (Logistics & Custodian)',
    url: '/src/assets/images/avatar_jeanpaul_mugisha_1791896213713.jpg'
  },
  {
    id: 'aline',
    label: 'Aline Mukamana (Ground & Pitch Lead)',
    url: '/src/assets/images/avatar_aline_mukamana_1791896213479.jpg'
  }
];

// Official Rwandan Cricket & GCS Credential Templates for 1-Click addition
const OFFICIAL_TEMPLATES: {
  title: string;
  category: ProfileAttachmentCategory;
  docNumber: string;
  issuer: string;
  size: number;
  type: string;
  notes: string;
}[] = [
  {
    title: 'ICC_Level_3_Cricket_Operations_Certification.pdf',
    category: 'CERTIFICATE',
    docNumber: 'ICC-OPS-2026-9041',
    issuer: 'International Cricket Council (ICC African Directorate)',
    size: 1420000,
    type: 'application/pdf',
    notes: 'Verified Level 3 High-Performance Cricket Venue Operations, Pitch Assessment & Match Referees Liaison.'
  },
  {
    title: 'RCA_Official_Pitch_and_Matchday_Field_Pass.pdf',
    category: 'ACCREDITATION',
    docNumber: 'RCA-GCS-PASS-088',
    issuer: 'Rwanda Cricket Association Secretariat',
    size: 980000,
    type: 'application/pdf',
    notes: 'All-zone stadium pass covering Main Pitch, Pavilion Umpires Room, High-Performance Nets, and Broadcast Control.'
  },
  {
    title: 'MINISPORTS_Facility_Operational_Clearance.pdf',
    category: 'ACCREDITATION',
    docNumber: 'MINISPORTS-FAC-2026-0312',
    issuer: 'Ministry of Sports — Republic of Rwanda',
    size: 1150000,
    type: 'application/pdf',
    notes: 'Official state compliance accreditation for hosting international tournament delegations and security protocol.'
  },
  {
    title: 'GCS_Turf_Agronomy_Pitch_Safety_Certificate.pdf',
    category: 'CERTIFICATE',
    docNumber: 'TURF-SAFE-2026-KGL',
    issuer: 'GCS Ground Care & Agronomy Directorate',
    size: 1280000,
    type: 'application/pdf',
    notes: 'Clay density, root compaction, and rapid drainage permeability validated for ICC T20 World Cup Qualifier standards.'
  },
  {
    title: 'GCS_Executive_Appointment_Charter_and_Authority_Deed.pdf',
    category: 'CONTRACT',
    docNumber: 'GCS-EXEC-CHARTER-2026',
    issuer: 'Gahanga Cricket Stadium Board of Trustees',
    size: 840000,
    type: 'application/pdf',
    notes: 'Permanent employment charter confirming supervisory oversight of operations staff, stores, and match equipment.'
  },
  {
    title: 'Sports_Medicine_and_Fitness_Assessment_Clearance.pdf',
    category: 'MEDICAL',
    docNumber: 'MED-FIT-2026-881',
    issuer: 'King Faisal Hospital Sports Medicine Unit, Kigali',
    size: 620000,
    type: 'application/pdf',
    notes: 'Annual comprehensive physical fitness, cardiovascular clearance, and anti-doping compliance sign-off.'
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
  const [activeMainTab, setActiveMainTab] = useState<'profile' | 'files'>('files');

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

  // Local File Attachments state
  const [attachments, setAttachments] = useState<ProfileAttachment[]>(currentUser.attachments || []);
  const [selectedCategory, setSelectedCategory] = useState<ProfileAttachmentCategory>('CERTIFICATE');
  const [attachmentNote, setAttachmentNote] = useState('');
  const [attachmentDocNumber, setAttachmentDocNumber] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);

  // Active Way to add file
  const [activeAddMethod, setActiveAddMethod] = useState<'LOCAL_UPLOAD' | 'CLOUD_LINK' | 'CAMERA_SCAN' | 'OFFICIAL_TEMPLATE' | 'DIGITAL_MEMO'>('LOCAL_UPLOAD');

  // Cloud Link State
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudDocTitle, setCloudDocTitle] = useState('');
  const [cloudDocFormat, setCloudDocFormat] = useState('pdf');

  // Camera / Document Scanner State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scannedPhotoUrl, setScannedPhotoUrl] = useState<string | null>(null);
  const [scannedDocTitle, setScannedDocTitle] = useState('');

  // Written Memo State
  const [memoTitle, setMemoTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');

  // File Search and Category Filter
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [fileCategoryFilter, setFileCategoryFilter] = useState<'ALL' | ProfileAttachmentCategory>('ALL');
  const [viewBrowsedOnly, setViewBrowsedOnly] = useState<boolean>(true);

  // Preview Modal State
  const [previewAttachment, setPreviewAttachment] = useState<ProfileAttachment | null>(null);

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
    setAttachments(currentUser.attachments || []);
    setAttachmentNote('');
    setAttachmentDocNumber('');
    setScannedPhotoUrl(null);
    setMemoTitle('');
    setMemoContent('');
    stopCamera();
  }, [currentUser, isOpen]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

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

  // Handle local avatar photo upload
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

  // WAY 1: Handle local files attachment from local PC
  const handleAttachFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB
    const fileList = Array.from(files);

    fileList.forEach((file) => {
      if (file.size > maxSizeBytes) {
        onShowToast('error', 'File Too Large', `"${file.name}" exceeds the 25MB limit.`);
        return;
      }

      const isTextFile = file.type.startsWith('text/') || /\.(txt|csv|json|md|log)$/i.test(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        const addAttachmentItem = (textContent?: string) => {
          const newAtt: ProfileAttachment = {
            id: `att-browsed-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            name: file.name,
            size: file.size,
            type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
            uploadedAt: new Date().toISOString(),
            dataUrl,
            content: textContent,
            sourceType: 'LOCAL_UPLOAD',
            category: selectedCategory,
            notes: attachmentNote.trim() || undefined,
            documentNumber: attachmentDocNumber.trim() || undefined,
            verified: true
          };
          setAttachments((prev) => [newAtt, ...prev]);
          setViewBrowsedOnly(true); // Automatically ensure browsed files are the ones viewed!
          onShowToast('success', 'File Attached', `"${file.name}" added to browsed files.`);
        };

        if (isTextFile) {
          const textReader = new FileReader();
          textReader.onload = (te) => {
            addAttachmentItem(te.target?.result as string);
          };
          textReader.readAsText(file);
        } else {
          addAttachmentItem();
        }
      };
      reader.onerror = () => {
        onShowToast('error', 'Upload Error', `Could not read "${file.name}" from local PC.`);
      };
      reader.readAsDataURL(file);
    });

    setAttachmentNote('');
    setAttachmentDocNumber('');
    if (attachmentFileInputRef.current) {
      attachmentFileInputRef.current.value = '';
    }
  };

  const handleClearDemoRecords = () => {
    setAttachments((prev) => prev.filter((a) => a.sourceType === 'LOCAL_UPLOAD' || Boolean(a.dataUrl)));
    setViewBrowsedOnly(true);
    onShowToast('info', 'Sample Records Cleared', 'Now only your browsed files are in the dossier.');
  };

  // WAY 2: Handle Cloud / Web Document Link
  const handleAddCloudLink = () => {
    if (!cloudUrl.trim()) {
      onShowToast('error', 'Missing URL', 'Please enter a valid document link or URL.');
      return;
    }

    const docName = cloudDocTitle.trim() || `Cloud_Document_${Date.now()}.${cloudDocFormat}`;
    const newAtt: ProfileAttachment = {
      id: `att-cloud-${Date.now()}`,
      name: docName.endsWith(`.${cloudDocFormat}`) ? docName : `${docName}.${cloudDocFormat}`,
      size: 240000,
      type: cloudDocFormat === 'pdf' ? 'application/pdf' : 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      externalUrl: cloudUrl.trim(),
      sourceType: 'CLOUD_LINK',
      category: selectedCategory,
      notes: attachmentNote.trim() || `Connected via cloud document repository (${cloudUrl.substring(0, 35)}...)`,
      documentNumber: attachmentDocNumber.trim() || undefined,
      verified: true
    };

    setAttachments((prev) => [newAtt, ...prev]);
    setCloudUrl('');
    setCloudDocTitle('');
    setAttachmentNote('');
    setAttachmentDocNumber('');
    onShowToast('success', 'Cloud Link Added', `"${newAtt.name}" linked to profile.`);
  };

  // WAY 3: Camera / Live Scanner
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      setScannedPhotoUrl(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      onShowToast('error', 'Camera Error', 'Could not access device camera. Please check camera permissions in your browser.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setScannedPhotoUrl(dataUrl);
      stopCamera();
    }
  };

  const handleSaveScannedDocument = () => {
    if (!scannedPhotoUrl) return;

    const docName = scannedDocTitle.trim() || `Scanner_Capture_${new Date().toISOString().slice(0, 10)}.jpg`;
    const newAtt: ProfileAttachment = {
      id: `att-scan-${Date.now()}`,
      name: docName.endsWith('.jpg') || docName.endsWith('.jpeg') ? docName : `${docName}.jpg`,
      size: 450000,
      type: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
      dataUrl: scannedPhotoUrl,
      sourceType: 'CAMERA_SCAN',
      category: selectedCategory,
      notes: attachmentNote.trim() || 'Scanned directly from physical document or ID badge via camera.',
      documentNumber: attachmentDocNumber.trim() || undefined,
      verified: true
    };

    setAttachments((prev) => [newAtt, ...prev]);
    setScannedPhotoUrl(null);
    setScannedDocTitle('');
    setAttachmentNote('');
    setAttachmentDocNumber('');
    onShowToast('success', 'Document Scanned', `"${newAtt.name}" captured and attached.`);
  };

  // WAY 4: 1-Click Official Stadium Credential Templates
  const handleAddOfficialTemplate = (tmpl: typeof OFFICIAL_TEMPLATES[0]) => {
    const existing = attachments.find((a) => a.documentNumber === tmpl.docNumber);
    if (existing) {
      onShowToast('info', 'Already Attached', `"${tmpl.title}" is already in your profile dossier.`);
      return;
    }

    const newAtt: ProfileAttachment = {
      id: `att-tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: tmpl.title,
      size: tmpl.size,
      type: tmpl.type,
      uploadedAt: new Date().toISOString(),
      sourceType: 'OFFICIAL_TEMPLATE',
      category: tmpl.category,
      documentNumber: tmpl.docNumber,
      issuer: tmpl.issuer,
      notes: tmpl.notes,
      verified: true
    };

    setAttachments((prev) => [newAtt, ...prev]);
    onShowToast('success', 'Official Credential Attached', `"${tmpl.title}" generated and verified.`);
  };

  // WAY 5: Digital Written Memo / Incident Handover
  const handleSaveWrittenMemo = () => {
    if (!memoTitle.trim() || !memoContent.trim()) {
      onShowToast('error', 'Incomplete Memo', 'Please provide both a memo title and document content.');
      return;
    }

    const fileName = `${memoTitle.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_Memo.txt`;
    const newAtt: ProfileAttachment = {
      id: `att-memo-${Date.now()}`,
      name: fileName,
      size: new Blob([memoContent]).size,
      type: 'text/plain',
      uploadedAt: new Date().toISOString(),
      sourceType: 'DIGITAL_MEMO',
      category: 'MEMO_REPORT',
      content: memoContent.trim(),
      notes: attachmentNote.trim() || 'Official operational memo recorded in personnel dossier.',
      documentNumber: attachmentDocNumber.trim() || `GCS-MEMO-${Date.now().toString().slice(-6)}`,
      verified: true
    };

    setAttachments((prev) => [newAtt, ...prev]);
    setMemoTitle('');
    setMemoContent('');
    setAttachmentNote('');
    setAttachmentDocNumber('');
    onShowToast('success', 'Memo Recorded', `"${newAtt.name}" saved in profile dossier.`);
  };

  const handleRemoveAttachment = (attId: string, attName: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
    onShowToast('info', 'Attachment Removed', `"${attName}" removed from profile.`);
  };

  const handleDownloadAttachment = (att: ProfileAttachment) => {
    if (att.dataUrl) {
      const link = document.createElement('a');
      link.href = att.dataUrl;
      link.download = att.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast('success', 'Download Started', `Downloading "${att.name}"`);
    } else {
      const content =
        `GAHANGA CRICKET STADIUM — OFFICIAL PERSONNEL DOSSIER ATTACHMENT\n` +
        `============================================================\n` +
        `Document Name:   ${att.name}\n` +
        `Category:        ${att.category || 'General Record'}\n` +
        `Document Number: ${att.documentNumber || `GCS-REC-${att.id.substring(0, 8)}`}\n` +
        `Personnel:       ${name} (${positionName})\n` +
        `Department:      ${department}\n` +
        `Uploaded:        ${new Date(att.uploadedAt).toLocaleString()}\n` +
        `Notes:           ${att.notes || 'Verified credential on record'}\n` +
        `============================================================\n` +
        `Status: Authenticated in GCS Operations Storage Engine.`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = att.name.endsWith('.pdf') ? att.name.replace('.pdf', '.txt') : `${att.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onShowToast('success', 'Document Record Exported', `Downloaded record for "${att.name}"`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'CERTIFICATE':
        return { label: 'Certificate', badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' };
      case 'ID_DOCUMENT':
        return { label: 'ID Document', badgeClass: 'bg-sky-950/80 text-sky-300 border-sky-800' };
      case 'CONTRACT':
        return { label: 'Contract', badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-800' };
      case 'MEDICAL':
        return { label: 'Medical Clearance', badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-800' };
      case 'ACCREDITATION':
        return { label: 'Venue Pass / Badge', badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800' };
      case 'MEMO_REPORT':
        return { label: 'Written Memo', badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-800' };
      default:
        return { label: 'General Record', badgeClass: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const getSourceBadge = (source?: ProfileAttachmentSource) => {
    switch (source) {
      case 'LOCAL_UPLOAD':
        return { label: 'Local PC', color: 'text-slate-400 bg-slate-900 border-slate-800' };
      case 'CLOUD_LINK':
        return { label: 'Cloud Link', color: 'text-sky-300 bg-sky-950/60 border-sky-800/80' };
      case 'CAMERA_SCAN':
        return { label: 'Camera Scan', color: 'text-amber-300 bg-amber-950/60 border-amber-800/80' };
      case 'OFFICIAL_TEMPLATE':
        return { label: 'GCS Verified', color: 'text-teal-300 bg-teal-950/60 border-teal-800/80' };
      case 'DIGITAL_MEMO':
        return { label: 'Written Memo', color: 'text-indigo-300 bg-indigo-950/60 border-indigo-800/80' };
      default:
        return { label: 'File', color: 'text-slate-400 bg-slate-900 border-slate-800' };
    }
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.pdf') || fileType.includes('pdf')) {
      return { icon: FileText, color: 'text-rose-400 bg-rose-950/60 border-rose-800/80' };
    }
    if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx') || fileType.includes('word')) {
      return { icon: FileText, color: 'text-sky-400 bg-sky-950/60 border-sky-800/80' };
    }
    if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx') || lowerName.endsWith('.csv') || fileType.includes('sheet')) {
      return { icon: FileSpreadsheet, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80' };
    }
    if (fileType.startsWith('image/') || lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
      return { icon: ImageIcon, color: 'text-teal-400 bg-teal-950/60 border-teal-800/80' };
    }
    return { icon: File, color: 'text-slate-400 bg-slate-800 border-slate-700' };
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      positionStatus,
      attachments
    };

    onSaveProfile(updated);
    onClose();
    onShowToast('success', 'Profile & Files Saved', 'Personnel dossier and files updated across all stadium workspaces.');
  };

  // Browsed files vs all files
  const browsedAttachments = attachments.filter((att) => att.sourceType === 'LOCAL_UPLOAD' || Boolean(att.dataUrl));
  const activeFileList = viewBrowsedOnly ? browsedAttachments : attachments;

  // Filtered attachments list
  const filteredAttachments = activeFileList.filter((att) => {
    const matchesCategory = fileCategoryFilter === 'ALL' || att.category === fileCategoryFilter;
    const matchesSearch = 
      att.name.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
      (att.notes && att.notes.toLowerCase().includes(fileSearchQuery.toLowerCase())) ||
      (att.documentNumber && att.documentNumber.toLowerCase().includes(fileSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          stopCamera();
          onClose();
        }}
        title="Personnel Profile & Official Dossier Files"
        subtitle="Operational credentials, certificates, ID cards, document scanner, and interactive file viewer"
        maxWidth="4xl"
      >
        <div className="space-y-4 text-xs">
          {/* Main Top Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMainTab('files')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                  activeMainTab === 'files'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Paperclip className="w-4 h-4" />
                <span>Files & Credentials Dossier</span>
                <span className="font-mono text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded-full border border-teal-400/40">
                  {attachments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMainTab('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                  activeMainTab === 'profile'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Personal & Position Details</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <span>{name}</span>
              <span>·</span>
              <span className="text-teal-400">{department}</span>
            </div>
          </div>

          {/* TAB 1: FILES & CREDENTIALS DOSSIER */}
          {activeMainTab === 'files' && (
            <div className="space-y-4">
              {/* How to Preview Help Callout Banner */}
              <div className="p-3.5 bg-linear-to-r from-teal-950/70 via-slate-900 to-slate-900 border border-teal-800/80 rounded-xl flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-600/30 border border-teal-500/60 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    Interactive File Preview & Document Inspection
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Click the <strong className="text-teal-300 inline-flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</strong> button on any file below to launch the interactive viewer. Supports pan/zoom, page navigation, verification stamps, QR validation, rotation, print, and metadata drawer.
                  </p>
                </div>
              </div>

              {/* 5 WAYS TO ADD FILES ACCORDION / PICKER */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-teal-400" />
                    Ways to Add Files & Credentials
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Select a method below to add files to your official profile
                  </span>
                </div>

                {/* Sub-tabs for the 5 ways */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setActiveAddMethod('LOCAL_UPLOAD');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all ${
                      activeAddMethod === 'LOCAL_UPLOAD'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>1. Local PC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setActiveAddMethod('CLOUD_LINK');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all ${
                      activeAddMethod === 'CLOUD_LINK'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>2. Cloud Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveAddMethod('CAMERA_SCAN');
                      startCamera();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all ${
                      activeAddMethod === 'CAMERA_SCAN'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>3. Scanner / Cam</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setActiveAddMethod('OFFICIAL_TEMPLATE');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all ${
                      activeAddMethod === 'OFFICIAL_TEMPLATE'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>4. Templates</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setActiveAddMethod('DIGITAL_MEMO');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all col-span-2 sm:col-span-1 ${
                      activeAddMethod === 'DIGITAL_MEMO'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>5. Write Memo</span>
                  </button>
                </div>

                {/* Common Category & Metadata Inputs for Upload/Link/Scan/Memo */}
                {activeAddMethod !== 'OFFICIAL_TEMPLATE' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-900">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-medium mb-1">
                        Category Tag *
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                      >
                        <option value="CERTIFICATE">Professional Certification (ICC / Turf)</option>
                        <option value="ID_DOCUMENT">Identification Document (Passport / National ID)</option>
                        <option value="CONTRACT">Employment Contract & Charter</option>
                        <option value="MEDICAL">Medical Clearance & Fitness</option>
                        <option value="ACCREDITATION">Pitch / Venue Pass & Clearance</option>
                        <option value="MEMO_REPORT">Official Match Memo / Handover</option>
                        <option value="OTHER">General Official Record</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-medium mb-1">
                        Document Reference / Serial #
                      </label>
                      <input
                        type="text"
                        value={attachmentDocNumber}
                        onChange={(e) => setAttachmentDocNumber(e.target.value)}
                        placeholder="e.g. ICC-2026-0941"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                      >
                      </input>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-medium mb-1">
                        Reference Note
                      </label>
                      <input
                        type="text"
                        value={attachmentNote}
                        onChange={(e) => setAttachmentNote(e.target.value)}
                        placeholder="e.g. Verified by RCA Operations"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}

                {/* METHOD 1 PANEL: Local Device Upload */}
                {activeAddMethod === 'LOCAL_UPLOAD' && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      handleAttachFiles(e.dataTransfer.files);
                    }}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all bg-slate-900/60 ${
                      isDraggingFile
                        ? 'border-teal-400 bg-teal-950/30 ring-2 ring-teal-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      ref={attachmentFileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.txt,.zip"
                      onChange={(e) => handleAttachFiles(e.target.files)}
                      className="hidden"
                      id="local-pc-file-upload-input"
                    />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-800/80 text-teal-400 flex items-center justify-center shrink-0">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">
                            Choose Files from Computer or Drag & Drop Here
                          </p>
                          <p className="text-[10px] text-slate-400">
                            PDF, Word, Excel, PNG, JPG, CSV up to 25MB each
                          </p>
                        </div>
                      </div>

                      <label
                        htmlFor="local-pc-file-upload-input"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Browse Files</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* METHOD 2 PANEL: Cloud / Web Link */}
                {activeAddMethod === 'CLOUD_LINK' && (
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-400 font-medium mb-1">
                          Cloud Document URL Link *
                        </label>
                        <input
                          type="url"
                          value={cloudUrl}
                          onChange={(e) => setCloudUrl(e.target.value)}
                          placeholder="https://drive.google.com/file/d/... or https://example.com/doc.pdf"
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-medium mb-1">
                          Document Format
                        </label>
                        <select
                          value={cloudDocFormat}
                          onChange={(e) => setCloudDocFormat(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                        >
                          <option value="pdf">PDF Document (.pdf)</option>
                          <option value="docx">Word Document (.docx)</option>
                          <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                          <option value="png">Image / Scan (.png)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={cloudDocTitle}
                        onChange={(e) => setCloudDocTitle(e.target.value)}
                        placeholder="Document Display Title (e.g. 2026 Pitch Inspection Report)"
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCloudLink}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Attach Cloud Link</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* METHOD 3 PANEL: Live Camera / Document Scanner */}
                {activeAddMethod === 'CAMERA_SCAN' && (
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                    <canvas ref={canvasRef} className="hidden" />

                    {!scannedPhotoUrl ? (
                      <div className="space-y-3">
                        <div className="relative w-full max-w-md mx-auto aspect-video bg-black rounded-xl overflow-hidden border-2 border-dashed border-teal-500/50 flex items-center justify-center">
                          {isCameraActive ? (
                            <>
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                              />
                              {/* Viewfinder crosshairs */}
                              <div className="absolute inset-4 border border-teal-400/40 pointer-events-none rounded-lg flex items-center justify-center">
                                <span className="text-[10px] text-teal-300 font-mono bg-slate-950/70 px-2 py-0.5 rounded">
                                  Position Physical Document / Badge in Frame
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                              <p className="text-xs text-slate-300 font-medium">Camera is currently inactive</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Click "Start Camera" below to scan a document</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          {isCameraActive ? (
                            <>
                              <button
                                type="button"
                                onClick={captureSnapshot}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Capture Document Snapshot</span>
                              </button>
                              <button
                                type="button"
                                onClick={stopCamera}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                              >
                                Stop Camera
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={startCamera}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <Video className="w-4 h-4" />
                              <span>Start Camera Scanner</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Scanned snapshot review */
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <img
                            src={scannedPhotoUrl}
                            alt="Scanned Document"
                            className="w-32 h-24 object-cover rounded-lg border border-teal-500 shadow-md"
                          />
                          <div className="flex-1 space-y-2">
                            <span className="text-[10px] text-teal-400 font-bold uppercase block">
                              Snapshot Captured Successfully
                            </span>
                            <input
                              type="text"
                              value={scannedDocTitle}
                              onChange={(e) => setScannedDocTitle(e.target.value)}
                              placeholder="Document Name (e.g. Rwanda_ID_Scan.jpg)"
                              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSaveScannedDocument}
                                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save & Attach Scanned Document</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setScannedPhotoUrl(null);
                                  startCamera();
                                }}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                              >
                                Retake Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* METHOD 4 PANEL: 1-Click Official Stadium Credential Templates */}
                {activeAddMethod === 'OFFICIAL_TEMPLATE' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Generate authenticated credentials with 1 click. Includes official serial numbers, RCA seals, and validation QR codes:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {OFFICIAL_TEMPLATES.map((tmpl) => {
                        const isAlreadyAttached = attachments.some((a) => a.documentNumber === tmpl.docNumber);
                        const catBadge = getCategoryBadge(tmpl.category);

                        return (
                          <div
                            key={tmpl.docNumber}
                            className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                              isAlreadyAttached
                                ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-200 truncate">
                                  {tmpl.title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${catBadge.badgeClass}`}>
                                  {catBadge.label}
                                </span>
                                <span className="font-mono text-[9px] text-slate-400">
                                  Ref: {tmpl.docNumber}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                                {tmpl.notes}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddOfficialTemplate(tmpl)}
                              disabled={isAlreadyAttached}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 ${
                                isAlreadyAttached
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-xs'
                              }`}
                            >
                              {isAlreadyAttached ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Attached</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* METHOD 5 PANEL: Digital Written Memo / Incident Handover */}
                {activeAddMethod === 'DIGITAL_MEMO' && (
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-medium mb-1">
                        Memo / Incident Document Title *
                      </label>
                      <input
                        type="text"
                        value={memoTitle}
                        onChange={(e) => setMemoTitle(e.target.value)}
                        placeholder="e.g. Center Pitch Compaction Log & Matchday Handover Sign-off"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-medium mb-1">
                        Document Body / Report Content *
                      </label>
                      <textarea
                        rows={3}
                        value={memoContent}
                        onChange={(e) => setMemoContent(e.target.value)}
                        placeholder="Type operational memo, pitch maintenance logs, or equipment conditions to store permanently in dossier..."
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500 font-mono"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveWrittenMemo}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Memo to Dossier</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ATTACHMENTS LIST & DOSSIER BROWSER */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-teal-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {viewBrowsedOnly ? 'Browsed Files Dossier' : 'Attached Files & Official Dossier'} ({viewBrowsedOnly ? browsedAttachments.length : attachments.length})
                    </h4>
                  </div>

                  {/* Mode Selector: Browsed Files Only vs All Records */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setViewBrowsedOnly(true)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          viewBrowsedOnly
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Show and view only files browsed and uploaded from your computer"
                      >
                        Browsed Files Only ({browsedAttachments.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewBrowsedOnly(false)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          !viewBrowsedOnly
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Show all records including templates"
                      >
                        All Records ({attachments.length})
                      </button>
                    </div>

                    {attachments.some(a => a.sourceType !== 'LOCAL_UPLOAD' && !a.dataUrl) && (
                      <button
                        type="button"
                        onClick={handleClearDemoRecords}
                        className="text-[10px] text-slate-400 hover:text-rose-400 underline transition-colors cursor-pointer"
                        title="Remove sample records and keep only browsed files in dossier"
                      >
                        Purge Sample Records
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setFileCategoryFilter('ALL')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors shrink-0 cursor-pointer ${
                        fileCategoryFilter === 'ALL'
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({activeFileList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFileCategoryFilter('CERTIFICATE')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors shrink-0 ${
                        fileCategoryFilter === 'CERTIFICATE'
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Certificates
                    </button>
                    <button
                      type="button"
                      onClick={() => setFileCategoryFilter('ID_DOCUMENT')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors shrink-0 ${
                        fileCategoryFilter === 'ID_DOCUMENT'
                          ? 'bg-sky-900 text-sky-200 border border-sky-700'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ID Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setFileCategoryFilter('CONTRACT')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors shrink-0 ${
                        fileCategoryFilter === 'CONTRACT'
                          ? 'bg-purple-900 text-purple-200 border border-purple-700'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Contracts
                    </button>
                    <button
                      type="button"
                      onClick={() => setFileCategoryFilter('ACCREDITATION')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors shrink-0 ${
                        fileCategoryFilter === 'ACCREDITATION'
                          ? 'bg-amber-900 text-amber-200 border border-amber-700'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Venue Passes
                    </button>
                  </div>

                  {/* Search box */}
                  <div className="relative w-full sm:w-56 shrink-0">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
                    <input
                      type="text"
                      value={fileSearchQuery}
                      onChange={(e) => setFileSearchQuery(e.target.value)}
                      placeholder="Search files or notes..."
                      className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* File Cards Grid */}
                <div className="space-y-2">
                  {filteredAttachments.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-400">
                      <FileText className="w-6 h-6 mx-auto mb-1.5 text-slate-600" />
                      <p className="text-xs font-semibold text-slate-300">No matching files found</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {attachments.length === 0
                          ? 'Use the "Ways to Add Files" buttons above to upload or generate official credentials.'
                          : 'Try adjusting your search query or category filter.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {filteredAttachments.map((att) => {
                        const fileIconInfo = getFileIcon(att.name, att.type);
                        const IconComponent = fileIconInfo.icon;
                        const catBadge = getCategoryBadge(att.category);
                        const srcBadge = getSourceBadge(att.sourceType);

                        return (
                          <div
                            key={att.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group"
                          >
                            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto flex-1">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${fileIconInfo.color}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-100 truncate group-hover:text-teal-300 transition-colors">
                                    {att.name}
                                  </span>
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${catBadge.badgeClass}`}>
                                    {catBadge.label}
                                  </span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${srcBadge.color}`}>
                                    {srcBadge.label}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-1">
                                  <span className="font-mono">{formatFileSize(att.size)}</span>
                                  <span>·</span>
                                  <span>{new Date(att.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                  {att.documentNumber && (
                                    <>
                                      <span>·</span>
                                      <span className="font-mono text-teal-400 font-semibold">{att.documentNumber}</span>
                                    </>
                                  )}
                                  {att.notes && (
                                    <>
                                      <span>·</span>
                                      <span className="text-slate-400 italic truncate max-w-[240px]">{att.notes}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons with Prominent Preview Trigger */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {/* Preview Button */}
                              <button
                                type="button"
                                onClick={() => setPreviewAttachment(att)}
                                className="px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-teal-500/40 hover:border-teal-500 transition-all cursor-pointer shadow-xs"
                                title="Open Interactive Document & Image Viewer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>

                              {/* Download Button */}
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(att)}
                                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                                title="Download Document Record"
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachment(att.id, att.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-900/50"
                                title="Remove File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL & POSITION DETAILS */}
          {activeMainTab === 'profile' && (
            <div className="space-y-5">
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
                          className="text-[10px] text-teal-400 hover:text-teal-300 underline font-medium cursor-pointer"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-2">
                        Official Stadium Personnel Portraits:
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
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {attachments.length} {attachments.length === 1 ? 'file attached' : 'files attached'} in dossier
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="flex-1 sm:flex-none px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave()}
                className="flex-1 sm:flex-none px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile & Files</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Full-Fidelity Interactive File Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
        allAttachments={filteredAttachments}
        onSelectAttachment={(att) => setPreviewAttachment(att)}
        userContext={{
          name,
          positionName,
          department,
          evaluationLevel
        }}
      />
    </>
  );
};
