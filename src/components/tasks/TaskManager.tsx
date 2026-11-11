import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Send, 
  Paperclip, 
  Check, 
  RotateCcw, 
  User, 
  MessageSquare, 
  AlertTriangle,
  LayoutGrid,
  List,
  GripVertical,
  ChevronDown,
  MoveRight,
  Sparkles,
  Upload,
  Link,
  Camera,
  FileSpreadsheet,
  FileCheck2,
  Trash2,
  Eye,
  Download,
  ExternalLink,
  File,
  X,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { Task, User as UserType, TaskStatus, TaskPriority, TaskSubmission, Department, ProfileAttachment } from '../../types';
import { Modal } from '../common/Modal';
import { FilePreviewModal } from '../common/FilePreviewModal';
import { useLanguage } from '../../i18n/LanguageContext';

const STADIUM_FIELD_TEMPLATES = [
  {
    id: 'pitch-moisture-log',
    name: 'GCS_Pitch_Moisture_Hardness_Log.pdf',
    category: 'CERTIFICATE' as const,
    label: 'Pitch Moisture & Compaction Log',
    description: 'Clegg Impact Value 92g, 14.8% rootzone moisture, 4.0mm cut height record',
    size: 320000,
    content: `GAHANGA CRICKET STADIUM — GROUND & PITCH DIVISION
MATCH WICKET LOG & HARDNESS VERIFICATION
============================================================
Venue: Gahanga International Cricket Stadium, Kigali
Match Wicket: Pitch 3 (Centre Strip - Hybrid Bermuda Grass)
Laser Level Verification: 0.02% slope (ICC Associate Spec Grade A)
Soil Moisture Rootzone (0-50mm): 14.8% (Target: 14.0% - 16.0%)
Clegg Impact Hammer Reading: 92 Gravities (Firm Test Grade)
Grass Cut Height: 4.0mm precision roller finish
Popping & Bowling Creases: Laser marked, 68m straight boundaries
Signed Off: Pitch Preparation Team`
  },
  {
    id: 'generator-phase-load',
    name: 'GCS_Floodlight_Generator_Phase_Load_Sheet.pdf',
    category: 'ACCREDITATION' as const,
    label: 'Generator Load & Phase Balance Sheet',
    description: '4x Floodlight masts, 2000kVA sync, 1480 Lux average arena test',
    size: 285000,
    content: `GAHANGA CRICKET STADIUM — ELECTRICAL & LIGHTING LOG
FLOODLIGHT TOWER GENERATOR & PHASE LOAD TESTING
============================================================
Generators: Dual 1000kVA Cummins Sync Units
Masts: Tower 1 (North), Tower 2 (East), Tower 3 (South), Tower 4 (West)
Total Arena Average Illuminance: 1,480 Lux (ICC Broadcast Grade)
Phase Balance: Phase A: 415V/620A | Phase B: 414V/618A | Phase C: 415V/622A
Frequency: 50.02 Hz Stable
Fuel Reserve: 96% Main Tank Capacity (4,800 Litres)
Emergency Cutover: 4.2 seconds automated transfer verified
Inspection Authority: Lead Stadium Engineer`
  },
  {
    id: 'pavilion-safety-inspection',
    name: 'GCS_Pavilion_Vault_Structural_Inspection.pdf',
    category: 'CONTRACT' as const,
    label: 'Pavilion Vault Structural Clearance',
    description: 'Parabolic vault mortar checks, VIP seating, drainage clearance',
    size: 410000,
    content: `GAHANGA CRICKET STADIUM — FACILITIES & STRUCTURAL INTEGRITY
PARABOLIC VAULTED ROOF & PAVILION PRE-MATCH CLEARANCE
============================================================
Structure: Compressed Earth Brick Parabolic Vaults (3 Spans)
Inspection Date: 2026 Season Operational Audit
Structural Joint Movement: Zero nominal deflection
Eaves & Rainwater Sump Channels: Cleared and flushed
RCA Executive Lounge & Broadcast Boxes: HVAC balanced at 21°C
Fire Safety & Emergency Exits: All 8 egress corridors unobstructed
Signed Off: Structural Compliance Officer`
  },
  {
    id: 'match-ball-kit-inventory',
    name: 'GCS_Match_Balls_Turnstiles_Kit_Log.csv',
    category: 'MEMO_REPORT' as const,
    label: 'Match Balls & Turnstiles Verification Log',
    description: 'Match balls (White/Red) verification, 12 turnstiles gate test',
    size: 154000,
    content: `Equipment,Serial/Batch,Quantity,Inspection Status,Inspector
Balls (White),BATCH-2026-RW-09,36,Inspected & Sealed,Stores Officer
Balls (Red),BATCH-2026-RW-04,24,Inspected & Sealed,Stores Officer
Turnstile Gate 1-4 North,GATE-N-SYS-A,4,Calibrated & RFID Online,Turnstile Supervisor
Turnstile Gate 5-8 East,GATE-E-SYS-B,4,Calibrated & RFID Online,Turnstile Supervisor
Turnstile Gate 9-12 South,GATE-S-SYS-C,4,Calibrated & RFID Online,Turnstile Supervisor
Boundary Foam Cushions,GCS-BD-68M,110,Positioned at 68m,Ground Staff`
  }
];

interface TaskManagerProps {
  currentUser: UserType;
  tasks: Task[];
  users: UserType[];
  onUpdateTask: (task: Task) => void;
  onCreateTask: (newTask: Partial<Task>) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
  initialTaskId?: string | null;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  currentUser,
  tasks,
  users,
  onUpdateTask,
  onCreateTask,
  onShowToast,
  initialTaskId
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [mobileActiveColumn, setMobileActiveColumn] = useState<TaskStatus | 'ALL'>('ALL');

  // Drag and drop states
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [openMoveMenuTaskId, setOpenMoveMenuTaskId] = useState<string | null>(null);

  // Selected task for modal view / action
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (initialTaskId) {
      const found = tasks.find(t => t.id === initialTaskId);
      if (found) {
        setSelectedTask(found);
      }
    }
  }, [initialTaskId, tasks]);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitReportOpen, setIsSubmitReportOpen] = useState(false);
  const [isReviewReportOpen, setIsReviewReportOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    confirmationRef: string;
    taskTitle: string;
    version: number;
    submittedAt: string;
    submittedByName: string;
    reportSummary: string;
    deliverablesNotes?: string;
    attachmentName?: string;
    attachments?: ProfileAttachment[];
    routedTo: string;
  } | null>(null);

  // Form states for new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskInstructions, setNewTaskInstructions] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState(users[0]?.id || '');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [newTaskDepartment, setNewTaskDepartment] = useState<Department>('Cricket Operations');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-10-18');
  const [newTaskAttachments, setNewTaskAttachments] = useState<ProfileAttachment[]>([]);
  const [newTaskAttachWay, setNewTaskAttachWay] = useState<'upload' | 'cloud' | 'template' | 'memo'>('upload');
  const [newTaskCloudUrl, setNewTaskCloudUrl] = useState('');
  const [newTaskCloudName, setNewTaskCloudName] = useState('');
  const [newTaskMemoTitle, setNewTaskMemoTitle] = useState('');
  const [newTaskMemoBody, setNewTaskMemoBody] = useState('');
  const newTaskFileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states for report submission
  const [reportSummary, setReportSummary] = useState('');
  const [deliverablesNotes, setDeliverablesNotes] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [reportAttachments, setReportAttachments] = useState<ProfileAttachment[]>([]);
  const [activeAttachWay, setActiveAttachWay] = useState<'upload' | 'cloud' | 'camera' | 'template' | 'memo' | 'label'>('upload');

  // Sub-states for attachment ways
  const [cloudDocUrl, setCloudDocUrl] = useState('');
  const [cloudDocName, setCloudDocName] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [capturedPhotoTitle, setCapturedPhotoTitle] = useState('');
  const [fieldMemoTitle, setFieldMemoTitle] = useState('');
  const [fieldMemoBody, setFieldMemoBody] = useState('');

  // References
  const taskVideoRef = useRef<HTMLVideoElement | null>(null);
  const taskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const taskFileInputRef = useRef<HTMLInputElement | null>(null);

  // Preview attachment state
  const [previewAttachment, setPreviewAttachment] = useState<ProfileAttachment | null>(null);

  // Camera cleanup
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isSubmitReportOpen) {
      stopCamera();
    }
  }, [isSubmitReportOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileBadgeInfo = (att: ProfileAttachment) => {
    const lower = att.name.toLowerCase();
    if (lower.endsWith('.pdf') || att.type.includes('pdf')) {
      return { icon: FileText, color: 'text-rose-400 bg-rose-950/60 border-rose-800/80', tag: 'PDF Document' };
    }
    if (att.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(lower)) {
      return { icon: ImageIcon, color: 'text-teal-400 bg-teal-950/60 border-teal-800/80', tag: 'Photo Evidence' };
    }
    if (/\.(xlsx?|csv)$/i.test(lower) || att.type.includes('sheet') || att.type.includes('csv')) {
      return { icon: FileSpreadsheet, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80', tag: 'Data Sheet' };
    }
    return { icon: File, color: 'text-sky-400 bg-sky-950/60 border-sky-800/80', tag: 'File Record' };
  };

  const getSourceBadgeText = (source?: string) => {
    switch (source) {
      case 'LOCAL_UPLOAD': return 'Local PC';
      case 'CLOUD_LINK': return 'Cloud Link';
      case 'CAMERA_SCAN': return 'Camera Scan';
      case 'OFFICIAL_TEMPLATE': return 'Stadium Template';
      case 'DIGITAL_MEMO': return 'Field Note';
      default: return 'Evidence';
    }
  };

  // WAY 1: Handle local file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 25 * 1024 * 1024) {
        onShowToast('error', 'File Too Large', `"${file.name}" exceeds 25MB limit.`);
        return;
      }

      const isTextFile = file.type.startsWith('text/') || /\.(txt|csv|json|md|log)$/i.test(file.name);
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        const addAttachmentItem = (textContent?: string) => {
          const newAtt: ProfileAttachment = {
            id: `task-att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            size: file.size,
            type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
            uploadedAt: new Date().toISOString(),
            dataUrl,
            content: textContent,
            sourceType: 'LOCAL_UPLOAD',
            verified: true
          };
          setReportAttachments((prev) => [...prev, newAtt]);
          onShowToast('success', 'File Attached', `"${file.name}" added to completion report.`);
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

      reader.readAsDataURL(file);
    });

    if (taskFileInputRef.current) taskFileInputRef.current.value = '';
  };

  // WAY 2: Handle Cloud link
  const handleAddCloudLink = () => {
    if (!cloudDocUrl.trim()) {
      onShowToast('error', 'Missing URL', 'Please enter a valid document or drive link.');
      return;
    }
    const name = cloudDocName.trim() || `Cloud_Evidence_${Date.now()}.pdf`;
    const newAtt: ProfileAttachment = {
      id: `task-att-${Date.now()}`,
      name,
      size: 190000,
      type: name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      externalUrl: cloudDocUrl.trim(),
      sourceType: 'CLOUD_LINK',
      verified: true
    };
    setReportAttachments((prev) => [...prev, newAtt]);
    setCloudDocUrl('');
    setCloudDocName('');
    onShowToast('success', 'Cloud Document Linked', `"${name}" linked to report.`);
  };

  // WAY 3: Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (taskVideoRef.current) {
        taskVideoRef.current.srcObject = stream;
      }
    } catch {
      onShowToast('error', 'Camera Error', 'Could not access device camera.');
    }
  };

  const capturePhoto = () => {
    if (!taskVideoRef.current || !taskCanvasRef.current) return;
    const video = taskVideoRef.current;
    const canvas = taskCanvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhotoUrl(dataUrl);
      stopCamera();
    }
  };

  const handleSaveCapturedPhoto = () => {
    if (!capturedPhotoUrl) return;
    const name = capturedPhotoTitle.trim() || `Field_Proof_${new Date().toISOString().slice(0, 10)}.jpg`;
    const newAtt: ProfileAttachment = {
      id: `task-att-${Date.now()}`,
      name: name.endsWith('.jpg') || name.endsWith('.jpeg') ? name : `${name}.jpg`,
      size: 380000,
      type: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
      dataUrl: capturedPhotoUrl,
      sourceType: 'CAMERA_SCAN',
      verified: true
    };
    setReportAttachments((prev) => [...prev, newAtt]);
    setCapturedPhotoUrl(null);
    setCapturedPhotoTitle('');
    onShowToast('success', 'Camera Photo Attached', `"${newAtt.name}" added to report.`);
  };

  // WAY 4: 1-Click Template
  const handleAddTemplate = (tmpl: typeof STADIUM_FIELD_TEMPLATES[0]) => {
    const newAtt: ProfileAttachment = {
      id: `task-att-${Date.now()}`,
      name: tmpl.name,
      size: tmpl.size,
      type: tmpl.name.endsWith('.pdf') ? 'application/pdf' : 'text/csv',
      uploadedAt: new Date().toISOString(),
      content: tmpl.content,
      category: tmpl.category,
      sourceType: 'OFFICIAL_TEMPLATE',
      notes: tmpl.description,
      verified: true
    };
    setReportAttachments((prev) => [...prev, newAtt]);
    onShowToast('success', 'Template Attached', `"${tmpl.label}" added to report.`);
  };

  // WAY 5: Field Memo
  const handleAddMemo = () => {
    if (!fieldMemoBody.trim()) {
      onShowToast('error', 'Missing Content', 'Please enter note or measurement readings.');
      return;
    }
    const title = fieldMemoTitle.trim() || `Field_Observations_${Date.now()}`;
    const fileName = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    const newAtt: ProfileAttachment = {
      id: `task-att-${Date.now()}`,
      name: fileName,
      size: new Blob([fieldMemoBody]).size,
      type: 'text/plain',
      uploadedAt: new Date().toISOString(),
      content: fieldMemoBody.trim(),
      sourceType: 'DIGITAL_MEMO',
      verified: true
    };
    setReportAttachments((prev) => [...prev, newAtt]);
    setFieldMemoTitle('');
    setFieldMemoBody('');
    onShowToast('success', 'Field Note Attached', `"${fileName}" added.`);
  };

  const handleRemoveAttachment = (id: string, name: string) => {
    setReportAttachments((prev) => prev.filter((a) => a.id !== id));
    onShowToast('info', 'Attachment Removed', `"${name}" removed from report.`);
  };

  const handleDownloadAttachment = (att: ProfileAttachment) => {
    if (att.dataUrl) {
      const link = document.createElement('a');
      link.href = att.dataUrl;
      link.download = att.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const content = att.content || `GAHANGA CRICKET STADIUM — TASK REPORT DELIVERABLE\n============================================================\nDocument: ${att.name}\nUploaded: ${att.uploadedAt}\nVerified in GCS System.`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = att.name.endsWith('.txt') || att.name.endsWith('.csv') ? att.name : `${att.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    onShowToast('success', 'Download Started', `Downloading "${att.name}"`);
  };

  // Handlers for task assignment attachments (Optional)
  const handleNewTaskFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 25 * 1024 * 1024) {
        onShowToast('error', 'File Too Large', `"${file.name}" exceeds 25MB limit.`);
        return;
      }

      const isTextFile = file.type.startsWith('text/') || /\.(txt|csv|json|md|log)$/i.test(file.name);
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        const addAtt = (textContent?: string) => {
          const newAtt: ProfileAttachment = {
            id: `task-ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            size: file.size,
            type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
            uploadedAt: new Date().toISOString(),
            dataUrl,
            content: textContent,
            sourceType: 'LOCAL_UPLOAD',
            notes: 'Reference document attached during task assignment',
            verified: true
          };
          setNewTaskAttachments((prev) => [...prev, newAtt]);
          onShowToast('success', 'Reference File Attached', `"${file.name}" added to task brief.`);
        };

        if (isTextFile) {
          const textReader = new FileReader();
          textReader.onload = (te) => addAtt(te.target?.result as string);
          textReader.readAsText(file);
        } else {
          addAtt();
        }
      };

      reader.readAsDataURL(file);
    });

    if (newTaskFileInputRef.current) newTaskFileInputRef.current.value = '';
  };

  const handleAddNewTaskCloudLink = () => {
    if (!newTaskCloudUrl.trim()) {
      onShowToast('error', 'Missing URL', 'Please enter a valid document link.');
      return;
    }
    const name = newTaskCloudName.trim() || `Reference_Doc_${Date.now()}.pdf`;
    const newAtt: ProfileAttachment = {
      id: `task-ref-${Date.now()}`,
      name,
      size: 190000,
      type: name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      externalUrl: newTaskCloudUrl.trim(),
      sourceType: 'CLOUD_LINK',
      notes: 'Cloud reference document linked during task assignment',
      verified: true
    };
    setNewTaskAttachments((prev) => [...prev, newAtt]);
    setNewTaskCloudUrl('');
    setNewTaskCloudName('');
    onShowToast('success', 'Reference Link Attached', `"${name}" linked to task brief.`);
  };

  const handleAddNewTaskTemplate = (tmpl: typeof STADIUM_FIELD_TEMPLATES[0]) => {
    const newAtt: ProfileAttachment = {
      id: `task-ref-${Date.now()}`,
      name: tmpl.name,
      size: tmpl.size,
      type: tmpl.name.endsWith('.pdf') ? 'application/pdf' : 'text/csv',
      uploadedAt: new Date().toISOString(),
      content: tmpl.content,
      category: tmpl.category,
      sourceType: 'OFFICIAL_TEMPLATE',
      notes: tmpl.description,
      verified: true
    };
    setNewTaskAttachments((prev) => [...prev, newAtt]);
    onShowToast('success', 'Template Attached', `"${tmpl.label}" attached to task specification.`);
  };

  const handleAddNewTaskMemo = () => {
    if (!newTaskMemoBody.trim()) {
      onShowToast('error', 'Missing Content', 'Please enter memo or instruction text.');
      return;
    }
    const title = newTaskMemoTitle.trim() || `Task_Instructions_${Date.now()}`;
    const fileName = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    const newAtt: ProfileAttachment = {
      id: `task-ref-${Date.now()}`,
      name: fileName,
      size: new Blob([newTaskMemoBody]).size,
      type: 'text/plain',
      uploadedAt: new Date().toISOString(),
      content: newTaskMemoBody.trim(),
      sourceType: 'DIGITAL_MEMO',
      notes: 'Technical specification note',
      verified: true
    };
    setNewTaskAttachments((prev) => [...prev, newAtt]);
    setNewTaskMemoTitle('');
    setNewTaskMemoBody('');
    onShowToast('success', 'Instruction Note Attached', `"${fileName}" attached.`);
  };

  const handleRemoveNewTaskAttachment = (id: string, name: string) => {
    setNewTaskAttachments((prev) => prev.filter((a) => a.id !== id));
    onShowToast('info', 'Attachment Removed', `"${name}" removed from task.`);
  };

  // Form states for review
  const [reviewComment, setReviewComment] = useState('');

  // Form state for new comment
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAttachment, setCommentAttachment] = useState<ProfileAttachment | null>(null);
  const commentFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCommentFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isImage = file.type.startsWith('image/');
    reader.onload = () => {
      const resultStr = reader.result as string;
      const att: ProfileAttachment = {
        id: `att-comment-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        sourceType: 'LOCAL_UPLOAD',
        category: isImage ? 'OTHER' : 'MEMO_REPORT',
        dataUrl: resultStr,
        notes: 'Attached to task comment'
      };
      setCommentAttachment(att);
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const canCreateTask = currentUser.role === 'SUPERVISOR' || currentUser.role === 'SYSTEM_ADMIN' || currentUser.role === 'CRICKET_OPERATIONS_MANAGER';

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      onShowToast('error', 'Validation Error', 'Task title is required');
      return;
    }

    const assignee = users.find(u => u.id === newTaskAssigneeId) || currentUser;

    const task: Partial<Task> = {
      title: newTaskTitle,
      description: newTaskDesc,
      instructions: newTaskInstructions,
      department: newTaskDepartment,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeRole: assignee.role,
      createdById: currentUser.id,
      createdByName: currentUser.name,
      priority: newTaskPriority,
      status: 'ASSIGNED',
      startDate: new Date().toISOString().split('T')[0],
      deadline: newTaskDeadline,
      completionRate: 0,
      attachments: newTaskAttachments.length > 0 ? newTaskAttachments : undefined,
      submissions: [],
      comments: []
    };

    onCreateTask(task);
    setIsCreateModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskInstructions('');
    setNewTaskAttachments([]);
    setNewTaskCloudUrl('');
    setNewTaskCloudName('');
    setNewTaskMemoTitle('');
    setNewTaskMemoBody('');
    onShowToast('success', 'Task Created', `Task successfully assigned to ${assignee.name}`);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!reportSummary.trim()) {
      onShowToast('error', 'Validation Error', 'Report summary is required');
      return;
    }

    const newVersionNumber = (selectedTask.submissions?.length || 0) + 1;
    // Attachments are 100% optional: if files attached, summarize names; if none, leave undefined
    const summaryAttachmentName = attachmentName.trim() || (reportAttachments.length > 0 ? reportAttachments.map(a => a.name).join(', ') : undefined);

    const newSubmission: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId: selectedTask.id,
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      submittedAt: new Date().toISOString(),
      version: newVersionNumber,
      reportSummary,
      deliverablesNotes,
      attachmentName: summaryAttachmentName,
      attachments: reportAttachments.length > 0 ? reportAttachments : undefined,
      status: 'SUBMITTED'
    };

    const updatedTask: Task = {
      ...selectedTask,
      status: 'SUBMITTED',
      completionRate: 100,
      submissions: [...(selectedTask.submissions || []), newSubmission]
    };

    onUpdateTask(updatedTask);
    setSelectedTask(updatedTask);
    setIsSubmitReportOpen(false);
    stopCamera();

    // Generate comprehensive confirmation receipt
    setConfirmationData({
      confirmationRef: `GCS-REC-SUB-${Date.now().toString().slice(-6)}`,
      taskTitle: selectedTask.title,
      version: newVersionNumber,
      submittedAt: new Date().toISOString(),
      submittedByName: currentUser.name,
      reportSummary,
      deliverablesNotes,
      attachmentName: summaryAttachmentName,
      attachments: reportAttachments,
      routedTo: selectedTask.createdByName || 'Claire Uwase'
    });
    setIsConfirmationModalOpen(true);

    setReportSummary('');
    setDeliverablesNotes('');
    setAttachmentName('');
    setReportAttachments([]);
    onShowToast('success', 'Report Submission Confirmed', 'Report logged in system audit ledger and routed to supervisor.');
  };

  const handleReviewAction = (action: 'APPROVE' | 'REQUEST_REVISION') => {
    if (!selectedTask) return;
    if (selectedTask.assigneeId === currentUser.id) {
      onShowToast('error', 'Separation of Duties', 'Assignees cannot approve or review their own submitted reports.');
      return;
    }

    const currentSubmissions = [...selectedTask.submissions];
    const latestSub = currentSubmissions[currentSubmissions.length - 1];

    if (action === 'APPROVE') {
      if (latestSub) {
        latestSub.status = 'APPROVED';
        latestSub.reviewedBy = currentUser.name;
        latestSub.reviewedAt = new Date().toISOString();
        latestSub.reviewComment = reviewComment.trim() || 'Approved. Standards verified.';
      }

      const updatedTask: Task = {
        ...selectedTask,
        status: 'APPROVED',
        completionRate: 100,
        submissions: currentSubmissions
      };

      onUpdateTask(updatedTask);
      setSelectedTask(updatedTask);
      setIsReviewReportOpen(false);
      setReviewComment('');
      onShowToast('success', 'Task Report Approved', 'Task marked as Approved in operations audit ledger.');
    } else {
      if (!reviewComment.trim()) {
        onShowToast('error', 'Feedback Required', 'Please provide revision feedback instructions before returning.');
        return;
      }

      if (latestSub) {
        latestSub.status = 'REVISION_REQUESTED';
        latestSub.reviewedBy = currentUser.name;
        latestSub.reviewedAt = new Date().toISOString();
        latestSub.reviewComment = reviewComment;
      }

      const updatedTask: Task = {
        ...selectedTask,
        status: 'REVISION_REQUESTED',
        submissions: currentSubmissions
      };

      onUpdateTask(updatedTask);
      setSelectedTask(updatedTask);
      setIsReviewReportOpen(false);
      setReviewComment('');
      onShowToast('info', 'Revisions Requested', 'Task sent back to assignee for revision with comments.');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || (!newCommentText.trim() && !commentAttachment)) return;

    const newComment = {
      id: `tc-${Date.now()}`,
      taskId: selectedTask.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: newCommentText.trim() || (commentAttachment ? `[Attached file: ${commentAttachment.name}]` : ''),
      attachments: commentAttachment ? [commentAttachment] : undefined,
      createdAt: new Date().toISOString()
    };

    const updatedTask: Task = {
      ...selectedTask,
      comments: [...(selectedTask.comments || []), newComment]
    };

    onUpdateTask(updatedTask);
    setSelectedTask(updatedTask);
    setNewCommentText('');
    setCommentAttachment(null);
    onShowToast('info', 'Comment Posted', 'Comment recorded to task history');
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeaveColumn = (e: React.DragEvent, status: TaskStatus) => {
    if (e.currentTarget === e.target) {
      setDragOverColumn(null);
    }
  };

  const handleTransitionTask = (taskToMove: Task, targetStatus: TaskStatus) => {
    if (taskToMove.status === targetStatus) return;

    // Separation of duties check:
    // If moving to APPROVED: only SUPERVISOR, CRICKET_OPERATIONS_MANAGER, SYSTEM_ADMIN can approve
    if (targetStatus === 'APPROVED') {
      if (currentUser.role === 'STAFF') {
        onShowToast(
          'error',
          'Separation of Duties',
          'Ground Operations Staff cannot approve tasks. A supervisor or manager must review and sign off.'
        );
        return;
      }
      if (taskToMove.assigneeId === currentUser.id && currentUser.role !== 'SYSTEM_ADMIN') {
        onShowToast(
          'error',
          'Separation of Duties',
          'Assignees cannot self-approve their own submitted tasks. Another supervisor or manager must review.'
        );
        return;
      }
    }

    let newCompletionRate = taskToMove.completionRate ?? 0;
    let updatedSubmissions = [...(taskToMove.submissions || [])];

    if (targetStatus === 'ASSIGNED') {
      newCompletionRate = Math.min(newCompletionRate, 20);
    } else if (targetStatus === 'IN_PROGRESS') {
      newCompletionRate = Math.max(newCompletionRate, 40);
    } else if (targetStatus === 'SUBMITTED') {
      newCompletionRate = 100;
      if (updatedSubmissions.length === 0) {
        updatedSubmissions.push({
          id: `sub-drag-${Date.now()}`,
          taskId: taskToMove.id,
          submittedBy: currentUser.id,
          submittedByName: currentUser.name,
          submittedAt: new Date().toISOString(),
          version: 1,
          reportSummary: 'Operational fieldwork completed and submitted for supervisor review via Kanban board.',
          deliverablesNotes: 'Transitioned directly into Submitted queue for verification.',
          attachmentName: 'GCS_Operational_Fieldwork_Log.pdf',
          status: 'SUBMITTED'
        });
      }
    } else if (targetStatus === 'APPROVED') {
      newCompletionRate = 100;
      if (updatedSubmissions.length > 0) {
        const last = updatedSubmissions[updatedSubmissions.length - 1];
        last.status = 'APPROVED';
        last.reviewedBy = currentUser.name;
        last.reviewedAt = new Date().toISOString();
        last.reviewComment = 'Verified and approved via interactive Kanban workflow board.';
      }
    } else if (targetStatus === 'REVISION_REQUESTED') {
      newCompletionRate = Math.min(newCompletionRate, 50);
      if (updatedSubmissions.length > 0) {
        const last = updatedSubmissions[updatedSubmissions.length - 1];
        last.status = 'REVISION_REQUESTED';
        last.reviewedBy = currentUser.name;
        last.reviewedAt = new Date().toISOString();
        last.reviewComment = 'Revision requested. Please review deliverables and resubmit.';
      }
    }

    const updatedTask: Task = {
      ...taskToMove,
      status: targetStatus,
      completionRate: newCompletionRate,
      submissions: updatedSubmissions
    };

    onUpdateTask(updatedTask);
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }

    const statusLabels: Record<TaskStatus, string> = {
      ASSIGNED: t('status_assigned'),
      IN_PROGRESS: t('status_in_progress'),
      SUBMITTED: t('status_submitted'),
      REVISION_REQUESTED: t('status_revision_requested'),
      APPROVED: t('status_approved'),
      CANCELLED: t('status_cancelled'),
      DRAFT: t('status_draft')
    };

    onShowToast(
      'success',
      'Status Transitioned',
      `"${taskToMove.title}" → ${statusLabels[targetStatus] || targetStatus}`
    );
  };

  const handleUpdateStatus = (newStatus: TaskStatus) => {
    if (selectedTask) {
      handleTransitionTask(selectedTask, newStatus);
    }
  };

  const handleDropOnColumn = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;
    const taskToMove = tasks.find((t) => t.id === taskId);
    if (!taskToMove) return;
    handleTransitionTask(taskToMove, targetStatus);
    setDraggedTaskId(null);
  };

  const KANBAN_COLUMNS: {
    status: TaskStatus;
    title: string;
    description: string;
    badgeStyle: string;
    headerBorder: string;
    glowBorder: string;
    accentDot: string;
  }[] = [
    {
      status: 'ASSIGNED',
      title: t('status_assigned'),
      description: 'Pending start',
      badgeStyle: 'bg-slate-800 text-slate-300 border-slate-700',
      headerBorder: 'border-slate-700',
      glowBorder: 'border-slate-400 bg-slate-800/40 ring-2 ring-slate-400/50',
      accentDot: 'bg-slate-400'
    },
    {
      status: 'IN_PROGRESS',
      title: t('status_in_progress'),
      description: 'Active on pitch',
      badgeStyle: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
      headerBorder: 'border-teal-700/80',
      glowBorder: 'border-teal-400 bg-teal-950/40 ring-2 ring-teal-400/50',
      accentDot: 'bg-teal-400'
    },
    {
      status: 'SUBMITTED',
      title: t('status_submitted'),
      description: 'Awaiting review',
      badgeStyle: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
      headerBorder: 'border-sky-700/80',
      glowBorder: 'border-sky-400 bg-sky-950/40 ring-2 ring-sky-400/50',
      accentDot: 'bg-sky-400'
    },
    {
      status: 'REVISION_REQUESTED',
      title: t('status_revision_requested'),
      description: 'Needs update',
      badgeStyle: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      headerBorder: 'border-amber-700/80',
      glowBorder: 'border-amber-400 bg-amber-950/40 ring-2 ring-amber-400/50',
      accentDot: 'bg-amber-400'
    },
    {
      status: 'APPROVED',
      title: t('status_approved'),
      description: 'Verified & closed',
      badgeStyle: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      headerBorder: 'border-emerald-700/80',
      glowBorder: 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-400/50',
      accentDot: 'bg-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header with View Toggle and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">
              {t('tasks_title')}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/60 rounded-full font-mono">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('tasks_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Switcher (Kanban vs Table) */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('view_mode_kanban')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t('view_mode_table')}</span>
            </button>
          </div>

          {canCreateTask && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('create_task')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Guidance Banner */}
      {viewMode === 'kanban' && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/70 border border-slate-800 rounded-xl text-xs text-slate-300">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
            <span className="text-slate-300 font-medium truncate">
              {t('drag_drop_hint')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-teal-400 shrink-0 hidden md:inline">
            Drag cards or click "Move to..."
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, instructions, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter tasks by status"
            className="flex-1 min-w-[120px] px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-hidden focus:border-teal-500 cursor-pointer"
          >
            <option value="ALL">{t('all_statuses')}</option>
            <option value="ASSIGNED">{t('status_assigned')}</option>
            <option value="IN_PROGRESS">{t('status_in_progress')}</option>
            <option value="SUBMITTED">{t('status_submitted')}</option>
            <option value="REVISION_REQUESTED">{t('status_revision_requested')}</option>
            <option value="APPROVED">{t('status_approved')}</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter tasks by priority"
            className="flex-1 min-w-[120px] px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-hidden focus:border-teal-500 cursor-pointer"
          >
            <option value="ALL">{t('all_priorities')}</option>
            <option value="URGENT">{t('priority_urgent')}</option>
            <option value="HIGH">{t('priority_high')}</option>
            <option value="MEDIUM">{t('priority_medium')}</option>
            <option value="LOW">{t('priority_low')}</option>
          </select>
        </div>
      </div>

      {/* Main View Area: Kanban vs Table */}
      {viewMode === 'kanban' ? (
        <div className="space-y-4">
          {/* Mobile-First Kanban Column Filter Bar (visible on mobile/tablet) */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setMobileActiveColumn('ALL')}
              className={`px-3 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                mobileActiveColumn === 'ALL'
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>All Columns</span>
              <span className="font-mono text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded">
                {filteredTasks.length}
              </span>
            </button>

            {KANBAN_COLUMNS.map((col) => {
              const count = filteredTasks.filter((t) => t.status === col.status).length;
              const isSelected = mobileActiveColumn === col.status;
              return (
                <button
                  key={col.status}
                  type="button"
                  onClick={() => setMobileActiveColumn(col.status)}
                  className={`px-3 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${col.accentDot}`} />
                  <span>{col.title}</span>
                  <span className="font-mono text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* KANBAN BOARD VIEW WITH DRAG & DROP */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
            {KANBAN_COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter((t) => t.status === column.status);
              const isDropTarget = dragOverColumn === column.status;
              const isVisibleOnMobile = mobileActiveColumn === 'ALL' || mobileActiveColumn === column.status;

              return (
                <div
                  key={column.status}
                  onDragOver={(e) => handleDragOverColumn(e, column.status)}
                  onDragLeave={(e) => handleDragLeaveColumn(e, column.status)}
                  onDrop={(e) => handleDropOnColumn(e, column.status)}
                  className={`${isVisibleOnMobile ? 'flex' : 'hidden md:flex'} flex-col bg-slate-900/90 rounded-2xl border transition-all duration-150 min-h-[460px] ${
                    isDropTarget
                      ? column.glowBorder
                      : `border-slate-800/90 hover:border-slate-700/80`
                  }`}
                >
                {/* Column Header */}
                <div className={`p-3.5 border-b ${column.headerBorder} flex items-center justify-between`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${column.accentDot} shrink-0`} />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-100 truncate">
                        {column.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate">
                        {column.description}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md border ${column.badgeStyle}`}>
                    {columnTasks.length}
                  </span>
                </div>

                {/* Drop Zone & Task List */}
                <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[70vh]">
                  {isDropTarget && (
                    <div className="p-3 border-2 border-dashed border-teal-400/80 bg-teal-950/30 rounded-xl text-center text-xs font-medium text-teal-300 animate-pulse flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>{t('drop_here')}</span>
                    </div>
                  )}

                  {columnTasks.length === 0 && !isDropTarget ? (
                    <div className="py-12 px-3 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs flex flex-col items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span>{t('no_tasks_in_column')}</span>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const isBeingDragged = draggedTaskId === task.id;
                      const isMoveMenuOpen = openMoveMenuTaskId === task.id;

                      const priorityBadgeColors: Record<TaskPriority, string> = {
                        URGENT: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
                        HIGH: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                        MEDIUM: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
                        LOW: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                      };

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedTask(task)}
                          className={`group relative p-3.5 bg-slate-950/90 hover:bg-slate-900 border rounded-xl shadow-xs transition-all duration-150 cursor-grab active:cursor-grabbing ${
                            isBeingDragged
                              ? 'opacity-40 border-teal-500 scale-95 ring-2 ring-teal-500/50'
                              : 'border-slate-800/90 hover:border-slate-700 hover:shadow-md'
                          }`}
                        >
                          {/* Card Top: Drag Handle, Priority & Department */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span 
                                title="Drag task card to move across columns" 
                                className="text-slate-500 group-hover:text-slate-300 transition-colors"
                              >
                                <GripVertical className="w-3.5 h-3.5 shrink-0" />
                              </span>
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${priorityBadgeColors[task.priority]}`}>
                                {task.priority}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                              {task.department}
                            </span>
                          </div>

                          {/* Task Title */}
                          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug mb-1.5">
                            {task.title}
                          </h4>

                          {/* Description snippet */}
                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                              {task.description}
                            </p>
                          )}

                          {/* Progress Bar */}
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">{t('completion')}</span>
                              <span className="font-mono tabular-nums font-semibold text-slate-300">
                                {task.completionRate || 0}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  task.status === 'APPROVED'
                                    ? 'bg-emerald-500'
                                    : task.completionRate && task.completionRate >= 80
                                    ? 'bg-teal-400'
                                    : 'bg-teal-600'
                                }`}
                                style={{ width: `${task.completionRate || 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Card Footer: Assignee, Deadline & Quick Action */}
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                            {/* Assignee Avatar & Name */}
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-teal-300 shrink-0">
                                {task.assigneeName.charAt(0)}
                              </div>
                              <span className="text-slate-300 font-medium truncate max-w-[90px]">
                                {task.assigneeName}
                              </span>
                            </div>

                            {/* Deadline Badge */}
                            <div className="flex items-center gap-1 text-[10px] font-mono tabular-nums text-slate-400 shrink-0">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{task.deadline}</span>
                            </div>
                          </div>

                          {/* Submissions & Discussion Counts */}
                          <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 text-[10px] text-slate-400">
                            <div className="flex items-center gap-2">
                              {task.submissions && task.submissions.length > 0 && (
                                <span className="flex items-center gap-1 text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/50">
                                  <FileText className="w-3 h-3" />
                                  <span>v{task.submissions.length}</span>
                                </span>
                              )}
                              {task.comments && task.comments.length > 0 && (
                                <span className="flex items-center gap-1 text-slate-400">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{task.comments.length}</span>
                                </span>
                              )}
                            </div>

                            {/* Quick "Move to..." Menu for accessibility & mobile */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setOpenMoveMenuTaskId(isMoveMenuOpen ? null : task.id)}
                                className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/80 transition-colors cursor-pointer"
                                title="Move task to another column"
                              >
                                <span>{t('move_to')}</span>
                                <ChevronDown className="w-3 h-3" />
                              </button>

                              {isMoveMenuOpen && (
                                <div className="absolute right-0 bottom-full mb-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                    {t('move_to')}
                                  </div>
                                  {KANBAN_COLUMNS.map((col) => {
                                    const isCurrent = task.status === col.status;
                                    return (
                                      <button
                                        key={col.status}
                                        type="button"
                                        disabled={isCurrent}
                                        onClick={() => {
                                          handleTransitionTask(task, col.status);
                                          setOpenMoveMenuTaskId(null);
                                        }}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                                          isCurrent
                                            ? 'text-teal-400 font-bold bg-slate-800/50 cursor-default'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                      >
                                        <span>{col.title}</span>
                                        {isCurrent && <Check className="w-3.5 h-3.5 text-teal-400" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      ) : (
        /* TABLE VIEW WITH RESPONSIVE MOBILE CARDS */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          {/* Mobile Card View (phones & small tablets) */}
          <div className="block md:hidden divide-y divide-slate-800/80">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No tasks found matching filter criteria.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="p-3.5 space-y-2.5 hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-100 hover:text-teal-300 transition-colors line-clamp-2">
                          {task.title}
                        </h4>
                        {task.attachments && task.attachments.length > 0 && (
                          <span
                            title={`${task.attachments.length} reference ${task.attachments.length === 1 ? 'file' : 'files'} attached`}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] bg-teal-950/80 text-teal-300 border border-teal-800/60 shrink-0 font-medium"
                          >
                            <Paperclip className="w-2.5 h-2.5" />
                            <span>{task.attachments.length}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      task.status === 'APPROVED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' :
                      task.status === 'SUBMITTED' ? 'bg-sky-950/80 text-sky-300 border border-sky-800/60' :
                      task.status === 'REVISION_REQUESTED' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' :
                      task.status === 'IN_PROGRESS' ? 'bg-teal-950/80 text-teal-300 border border-teal-800/60' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="font-semibold text-slate-200">{task.assigneeName}</span>
                      <span>·</span>
                      <span>{task.department}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        task.priority === 'URGENT' ? 'text-rose-400 font-bold' :
                        task.priority === 'HIGH' ? 'text-amber-400' :
                        task.priority === 'MEDIUM' ? 'text-sky-400' : 'text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono text-slate-400">{task.deadline}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">{t('task_details')}</th>
                  <th className="px-4 py-3">{t('department')}</th>
                  <th className="px-4 py-3">{t('assignee')}</th>
                  <th className="px-4 py-3">{t('deadline')}</th>
                  <th className="px-4 py-3">{t('priority')}</th>
                  <th className="px-4 py-3">{t('status')}</th>
                  <th className="px-4 py-3 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                      No tasks found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-100 hover:text-teal-300 transition-colors truncate">
                            {task.title}
                          </p>
                          {task.attachments && task.attachments.length > 0 && (
                            <span
                              title={`${task.attachments.length} reference ${task.attachments.length === 1 ? 'file' : 'files'} attached`}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-teal-950/80 text-teal-300 border border-teal-800/60 shrink-0 font-medium"
                            >
                              <Paperclip className="w-2.5 h-2.5" />
                              <span>{task.attachments.length}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {task.description}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">
                        {task.department}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-slate-200">{task.assigneeName}</span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap font-mono tabular-nums text-slate-300">
                        {task.deadline}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`font-semibold ${
                          task.priority === 'URGENT' ? 'text-rose-400' :
                          task.priority === 'HIGH' ? 'text-amber-400' :
                          task.priority === 'MEDIUM' ? 'text-sky-400' : 'text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          task.status === 'APPROVED' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' :
                          task.status === 'SUBMITTED' ? 'bg-sky-950/60 text-sky-400 border border-sky-800/50' :
                          task.status === 'REVISION_REQUESTED' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50' :
                          task.status === 'IN_PROGRESS' ? 'bg-teal-950/60 text-teal-400 border border-teal-800/50' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                          className="text-xs font-medium text-teal-400 hover:text-teal-300 cursor-pointer"
                        >
                          {t('inspect')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Task Details & Action Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={selectedTask.title}
          subtitle={`Department: ${selectedTask.department} · Created by ${selectedTask.createdByName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">{t('status')}</span>
                <span className="font-semibold text-teal-400 mt-0.5 block">
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">{t('priority')}</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {selectedTask.priority}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">{t('assignee')}</span>
                <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                  {selectedTask.assigneeName}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">{t('deadline')}</span>
                <span className="font-mono tabular-nums text-slate-300 mt-0.5 block">
                  {selectedTask.deadline}
                </span>
              </div>
            </div>

            {/* Description & Detailed Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'rw' 
                  ? 'Amabwiriza y\'Umurimo' 
                  : language === 'fr' 
                  ? 'Instructions Opérationnelles' 
                  : language === 'sw' 
                  ? 'Maagizo ya Kiutendaji' 
                  : 'Operational Instructions'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80 whitespace-pre-line">
                {selectedTask.instructions || selectedTask.description}
              </p>
            </div>

            {/* Reference Files Attached During Task Assignment */}
            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
              <div className="space-y-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-teal-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Task Brief & Assigned Reference Documents ({selectedTask.attachments.length})
                    </h4>
                  </div>
                  <span className="text-[10px] text-teal-400 font-mono">
                    Supervisor Attached Spec
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedTask.attachments.map((att) => {
                    const badgeInfo = getFileBadgeInfo(att);
                    const IconCmp = badgeInfo.icon;
                    return (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                      >
                        <div className={`p-1 rounded ${badgeInfo.color}`}>
                          <IconCmp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 max-w-[190px]">
                          <p className="font-semibold text-slate-200 truncate">{att.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                            <span>{formatFileSize(att.size)}</span>
                            <span>·</span>
                            <span className="text-teal-400">{getSourceBadgeText(att.sourceType)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-1 border-l border-slate-800 pl-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewAttachment(att)}
                            className="p-1 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Preview Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadAttachment(att)}
                            className="p-1 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Download Document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Bar for Workflow Transitions */}
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  Workflow Actions
                </span>
                <span className="text-[11px] text-slate-400">
                  Logged in as: <strong className="text-teal-400">{currentUser.name}</strong> ({currentUser.role})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Assignee start progress */}
                {selectedTask.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleUpdateStatus('IN_PROGRESS')}
                    className="px-3 py-1.5 text-xs font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
                  >
                    Start Work (Mark In Progress)
                  </button>
                )}

                {/* Submit Report Button (Assignee can submit or resubmit) */}
                {(selectedTask.status === 'IN_PROGRESS' || selectedTask.status === 'REVISION_REQUESTED' || selectedTask.status === 'ASSIGNED') && (
                  <button
                    onClick={() => setIsSubmitReportOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                  >
                    {selectedTask.status === 'REVISION_REQUESTED' ? 'Resubmit Revised Report' : 'Submit Completion Report'}
                  </button>
                )}

                {/* Supervisor Review Button (Authorized Supervisor/Manager with Separation of Duties) */}
                {selectedTask.status === 'SUBMITTED' && (
                  (() => {
                    const canReview = (currentUser.role === 'SUPERVISOR' || currentUser.role === 'CRICKET_OPERATIONS_MANAGER' || currentUser.role === 'SYSTEM_ADMIN') && selectedTask.assigneeId !== currentUser.id;
                    if (canReview) {
                      return (
                        <button
                          onClick={() => setIsReviewReportOpen(true)}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          Review & Sign-Off Report
                        </button>
                      );
                    }
                    if (selectedTask.assigneeId === currentUser.id) {
                      return (
                        <span className="text-[11px] text-amber-400 font-mono px-2 py-1 rounded bg-amber-950/60 border border-amber-800/60">
                          Awaiting Supervisor Sign-Off (Separation of Duties)
                        </span>
                      );
                    }
                    return (
                      <span className="text-[11px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800">
                        Under Supervisor Review
                      </span>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Submissions & Report History */}
            {selectedTask.submissions && selectedTask.submissions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Report Version History ({selectedTask.submissions.length} submission)
                </h4>
                <div className="space-y-2.5">
                  {selectedTask.submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">
                          Version {sub.version} · Submitted by {sub.submittedByName}
                        </span>
                        <span className="text-[11px] font-mono tabular-nums text-slate-500">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {sub.reportSummary}
                      </p>
                      {sub.deliverablesNotes && (
                        <p className="text-[11px] text-slate-400">
                          <strong>Deliverables:</strong> {sub.deliverablesNotes}
                        </p>
                      )}
                      {sub.attachments && sub.attachments.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                            Attached Supporting Proof ({sub.attachments.length}):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {sub.attachments.map((att) => {
                              const badgeInfo = getFileBadgeInfo(att);
                              const IconCmp = badgeInfo.icon;
                              return (
                                <div
                                  key={att.id}
                                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                                >
                                  <div className={`p-1 rounded ${badgeInfo.color}`}>
                                    <IconCmp className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0 max-w-[170px]">
                                    <p className="font-medium text-slate-200 truncate">{att.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{formatFileSize(att.size)}</p>
                                  </div>
                                  <div className="flex items-center gap-1 ml-1 border-l border-slate-800 pl-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewAttachment(att)}
                                      className="p-1 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                      title="Preview Document"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadAttachment(att)}
                                      className="p-1 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                      title="Download Document"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : sub.attachmentName ? (
                        <div className="flex items-center gap-2 text-[11px] text-teal-400 bg-slate-900 px-2 py-1 rounded inline-flex">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{sub.attachmentName}</span>
                        </div>
                      ) : null}

                      {sub.reviewedBy && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-[11px]">
                          <span className="text-slate-400">
                            Reviewed by <strong className="text-slate-200">{sub.reviewedBy}</strong>:
                          </span>
                          <p className={`mt-0.5 ${sub.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {sub.reviewComment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Task Comments & Team Communication */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'rw'
                  ? 'Ibiganiro n\'Amakuru y\'Umurimo'
                  : language === 'fr'
                  ? 'Discussion & Journal d\'Activité'
                  : language === 'sw'
                  ? 'Majadiliano & Kumbukumbu za Kazi'
                  : 'Discussion & Activity Log'}
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedTask.comments && selectedTask.comments.length > 0 ? (
                  selectedTask.comments.map((comment) => (
                    <div key={comment.id} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-medium text-slate-300">{comment.authorName} ({comment.authorRole})</span>
                        <span className="font-mono tabular-nums">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-300">{comment.text}</p>
                      
                      {/* Attached files on comment */}
                      {comment.attachments && comment.attachments.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {comment.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-teal-300"
                            >
                              <Paperclip className="w-3 h-3 text-teal-400 shrink-0" />
                              <span className="max-w-[150px] truncate">{att.name}</span>
                              <button
                                type="button"
                                onClick={() => setPreviewAttachment(att)}
                                className="p-0.5 text-slate-400 hover:text-teal-300 cursor-pointer"
                                title="Preview attached file"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    {language === 'rw' 
                      ? 'Nta bitekerezo birashyirwaho.' 
                      : language === 'fr' 
                      ? 'Aucun commentaire pour le moment.' 
                      : language === 'sw' 
                      ? 'Hakuna maoni yaliyowekwa bado.' 
                      : 'No comments posted yet.'}
                  </p>
                )}
              </div>

              {/* Comment Attachment Staged Chip */}
              {commentAttachment && (
                <div className="flex items-center justify-between px-2.5 py-1 rounded bg-teal-950/60 border border-teal-800/70 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Paperclip className="w-3 h-3 text-teal-400 shrink-0" />
                    <span className="text-teal-200 truncate font-medium text-[11px]">{commentAttachment.name}</span>
                    <span className="text-[10px] text-teal-400 font-mono">({(commentAttachment.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewAttachment(commentAttachment)}
                      className="p-1 text-teal-300 hover:text-white cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentAttachment(null)}
                      className="p-1 text-teal-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                <input
                  type="file"
                  ref={commentFileInputRef}
                  onChange={handleCommentFilePicked}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => commentFileInputRef.current?.click()}
                  className="p-1.5 text-slate-400 hover:text-teal-300 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Attach file to comment (Optional • Encouraged)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={
                    language === 'rw'
                      ? 'Ongeraho igitekerezo cy\'ibikorwa cyangwa amakuru... (kugerekaho dosiye ni ubushake)'
                      : language === 'fr'
                      ? 'Ajouter un commentaire ou mise à jour... (pièce jointe optionnelle)'
                      : language === 'sw'
                      ? 'Weka maoni ya kiutendaji au taarifa... (kuambatanisha faili ni hiari)'
                      : 'Add comment or update... (file attachment optional)'
                  }
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  {language === 'rw' ? 'Ohereza' : language === 'fr' ? 'Publier' : language === 'sw' ? 'Weka' : 'Post'}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create Task */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewTaskAttachments([]);
        }}
        title="Create & Assign Operational Task"
        subtitle="Assign critical facility or match preparation tasks to staff"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Center Pitch #2 Grass Mowing & Crease Chalking"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Short Description</label>
            <input
              type="text"
              placeholder="Brief summary of requirements..."
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Detailed Technical Instructions</label>
            <textarea
              rows={3}
              placeholder="Step-by-step checklist or compliance points..."
              value={newTaskInstructions}
              onChange={(e) => setNewTaskInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Assignee *</label>
              <select
                value={newTaskAssigneeId}
                onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.jobTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Department</label>
              <select
                value={newTaskDepartment}
                onChange={(e) => setNewTaskDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                <option value="Cricket Operations">Cricket Operations</option>
                <option value="Administration">Administration</option>
                <option value="Development">Development</option>
                <option value="Coaching">Coaching</option>
                <option value="Teaching">Teaching</option>
                <option value="Officiating & Match Officials">Officiating & Match Officials</option>
                <option value="Ground & Pitch Maintenance">Ground & Pitch Maintenance</option>
                <option value="Stores & Logistics">Stores & Logistics</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                <option value="URGENT">Urgent (Immediate)</option>
                <option value="HIGH">High (Within 24h)</option>
                <option value="MEDIUM">Medium (Normal)</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Deadline *</label>
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          {/* Reference Files & Specifications Section - Completely Optional */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-slate-200">
                  Task Specifications & Reference Files
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-950 text-teal-300 border border-teal-800/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" /> Optional • Encouraged
                </span>
              </div>
              {newTaskAttachments.length > 0 && (
                <span className="text-[11px] font-mono text-teal-400 font-semibold">
                  {newTaskAttachments.length} file{newTaskAttachments.length > 1 ? 's' : ''} attached
                </span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-teal-950/30 border border-teal-800/50 flex items-start gap-2 text-[11px] text-teal-200/90">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Encouraged:</strong> Attaching match pitch diagrams, calibration logs, SOP checklists, or specification notes helps assignees execute precisely to ICC standards. Creating without files is completely supported.
              </span>
            </div>

            {/* Ways to Attach Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <button
                type="button"
                onClick={() => setNewTaskAttachWay('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  newTaskAttachWay === 'upload'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse PC</span>
              </button>

              <button
                type="button"
                onClick={() => setNewTaskAttachWay('cloud')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  newTaskAttachWay === 'cloud'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Cloud Link</span>
              </button>

              <button
                type="button"
                onClick={() => setNewTaskAttachWay('template')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  newTaskAttachWay === 'template'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Field Templates</span>
              </button>

              <button
                type="button"
                onClick={() => setNewTaskAttachWay('memo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  newTaskAttachWay === 'memo'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Technical Note</span>
              </button>
            </div>

            {/* Way 1: Upload from local PC */}
            {newTaskAttachWay === 'upload' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <input
                  type="file"
                  multiple
                  ref={newTaskFileInputRef}
                  onChange={handleNewTaskFileUpload}
                  className="hidden"
                  id="new-task-file-upload-input"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.log,.md"
                />
                <label
                  htmlFor="new-task-file-upload-input"
                  className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-700 hover:border-teal-500 bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-all text-center group"
                >
                  <Upload className="w-7 h-7 text-teal-400 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="font-semibold text-slate-200 text-xs">
                    Click to browse files or drop specification documents
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Supports PDF diagrams, photo specifications, spreadsheets, manuals, and checklists (Max 25MB)
                  </span>
                </label>
              </div>
            )}

            {/* Way 2: Cloud Document Link */}
            {newTaskAttachWay === 'cloud' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Document Link / URL *</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/... or RCA Cloud"
                      value={newTaskCloudUrl}
                      onChange={(e) => setNewTaskCloudUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Display Title / Specification Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Pitch Rolling Schedule Protocol 2026.pdf"
                      value={newTaskCloudName}
                      onChange={(e) => setNewTaskCloudName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddNewTaskCloudLink}
                    disabled={!newTaskCloudUrl.trim()}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Attach Cloud Spec</span>
                  </button>
                </div>
              </div>
            )}

            {/* Way 3: 1-Click Official Stadium Field Templates */}
            {newTaskAttachWay === 'template' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block">
                  Attach an official GCS operational SOP or reference checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STADIUM_FIELD_TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-1.5"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 text-xs truncate">{tmpl.label}</span>
                          <span className="text-[10px] font-mono text-teal-400 shrink-0">
                            {formatFileSize(tmpl.size)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{tmpl.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                          {tmpl.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddNewTaskTemplate(tmpl)}
                          className="px-2 py-1 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Attach</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Way 4: Technical Specification Note */}
            {newTaskAttachWay === 'memo' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Specification Note Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Grass Height & Moisture Target Specifications"
                    value={newTaskMemoTitle}
                    onChange={(e) => setNewTaskMemoTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Specification Content *</label>
                  <textarea
                    rows={3}
                    placeholder="Enter compliance rules, machine operating tolerances, or reference values..."
                    value={newTaskMemoBody}
                    onChange={(e) => setNewTaskMemoBody(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddNewTaskMemo}
                    disabled={!newTaskMemoBody.trim()}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach Specification Note</span>
                  </button>
                </div>
              </div>
            )}

            {/* Attached Reference Files Roster */}
            {newTaskAttachments.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Files Attached to This Task Brief ({newTaskAttachments.length}):
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {newTaskAttachments.map((att) => {
                    const badgeInfo = getFileBadgeInfo(att);
                    const IconCmp = badgeInfo.icon;
                    return (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded ${badgeInfo.color} shrink-0`}>
                            <IconCmp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-200 truncate">{att.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>{formatFileSize(att.size)}</span>
                              <span>·</span>
                              <span className="text-teal-400">{getSourceBadgeText(att.sourceType)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewAttachment(att)}
                            className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Preview File"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewTaskAttachment(att.id, att.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Remove File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewTaskAttachments([]);
              }}
              className="px-3.5 py-2 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Create & Assign
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Submit Report */}
      <Modal
        isOpen={isSubmitReportOpen}
        onClose={() => {
          stopCamera();
          setIsSubmitReportOpen(false);
        }}
        title="Submit Completion Report"
        subtitle={`Filing report for: ${selectedTask?.title}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Report Summary & Findings *</label>
              <span className="text-[10px] text-amber-400 font-medium">Required field</span>
            </div>
            <textarea
              required
              rows={3}
              placeholder="State verified metrics, readings, or execution status (e.g. Soil moisture tested at 14.8%, pitch cut to 4mm, stumps checked)..."
              value={reportSummary}
              onChange={(e) => setReportSummary(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Deliverables & Evidence Notes</label>
            <input
              type="text"
              placeholder="e.g. Boundary markers verified at 68m, pitch photo signed by head groundskeeper"
              value={deliverablesNotes}
              onChange={(e) => setDeliverablesNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Attachments Section - Completely Optional */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-slate-200">Supporting Evidence & Files</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-950 text-teal-300 border border-teal-800/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" /> Optional • Encouraged
                </span>
              </div>
              {reportAttachments.length > 0 && (
                <span className="text-[11px] font-mono text-teal-400 font-semibold">
                  {reportAttachments.length} file{reportAttachments.length > 1 ? 's' : ''} attached
                </span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-teal-950/30 border border-teal-800/50 flex items-start gap-2 text-[11px] text-teal-200/90">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Encouraged:</strong> Attaching inspection photos, compaction logs, generator load readouts, or signed receipts provides auditable proof and expedites immediate supervisor approval. Filing without attachments is 100% allowed.
              </span>
            </div>

            {/* Ways to Attach Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveAttachWay('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  activeAttachWay === 'upload'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse PC</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttachWay('cloud')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  activeAttachWay === 'cloud'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Cloud Link</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttachWay('camera')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  activeAttachWay === 'camera'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Camera</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttachWay('template')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  activeAttachWay === 'template'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Field Templates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttachWay('memo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  activeAttachWay === 'memo'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Field Note</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAttachWay('label')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  activeAttachWay === 'label'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Simulated Filename</span>
              </button>
            </div>

            {/* Way 1: Upload from local PC */}
            {activeAttachWay === 'upload' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <input
                  type="file"
                  multiple
                  ref={taskFileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="task-file-upload-input"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.log,.md"
                />
                <label
                  htmlFor="task-file-upload-input"
                  className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-700 hover:border-teal-500 bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-all text-center group"
                >
                  <Upload className="w-7 h-7 text-teal-400 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="font-semibold text-slate-200 text-xs">
                    Click to browse files or drop files from your computer
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Supports PDF, Photos (JPG, PNG), Excel/CSV spreadsheets, Word docs, logs (Up to 25MB)
                  </span>
                </label>
              </div>
            )}

            {/* Way 2: Cloud Document Link */}
            {activeAttachWay === 'cloud' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Document Link / URL *</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/... or RCA Cloud"
                      value={cloudDocUrl}
                      onChange={(e) => setCloudDocUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Document Display Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Cummins Generator Fuel Test Log.pdf"
                      value={cloudDocName}
                      onChange={(e) => setCloudDocName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddCloudLink}
                    disabled={!cloudDocUrl.trim()}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Attach Cloud Link</span>
                  </button>
                </div>
              </div>
            )}

            {/* Way 3: Live Camera / Scanner */}
            {activeAttachWay === 'camera' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
                <canvas ref={taskCanvasRef} className="hidden" />

                {!isCameraActive && !capturedPhotoUrl && (
                  <div className="text-center py-4 bg-slate-900/60 rounded-lg border border-slate-800">
                    <Camera className="w-8 h-8 text-teal-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs text-slate-200 font-semibold mb-1">Live Camera & Document Scanner</p>
                    <p className="text-[11px] text-slate-400 mb-3 max-w-sm mx-auto">
                      Photograph physical fieldwork, generator dials, pitch strip moisture gauges, or paper forms.
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Start Camera Scanner</span>
                    </button>
                  </div>
                )}

                {isCameraActive && (
                  <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black aspect-video max-h-56 mx-auto flex items-center justify-center">
                      <video ref={taskVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        <span>LIVE CAMERA</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        Cancel Camera
                      </button>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Capture Photo</span>
                      </button>
                    </div>
                  </div>
                )}

                {capturedPhotoUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <img
                        src={capturedPhotoUrl}
                        alt="Captured proof"
                        className="w-20 h-16 object-cover rounded-md border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <label className="text-[10px] text-slate-400 block mb-0.5">Photo Title / Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Floodlight Generator Fuel Gauge Reading.jpg"
                          value={capturedPhotoTitle}
                          onChange={(e) => setCapturedPhotoTitle(e.target.value)}
                          className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-slate-100 text-xs focus:outline-hidden focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCapturedPhotoUrl(null);
                          startCamera();
                        }}
                        className="px-3 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        Retake
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveCapturedPhoto}
                        className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Attach Captured Photo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Way 4: 1-Click Official Stadium Field Templates */}
            {activeAttachWay === 'template' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block">
                  Select a standardized GCS operational log template to attach:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STADIUM_FIELD_TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-1.5"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 text-xs truncate">{tmpl.label}</span>
                          <span className="text-[10px] font-mono text-teal-400 shrink-0">
                            {formatFileSize(tmpl.size)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{tmpl.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                          {tmpl.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddTemplate(tmpl)}
                          className="px-2 py-1 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Attach</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Way 5: Field Memo / Observation Log */}
            {activeAttachWay === 'memo' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Field Observation Note Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Generator Fuel Flow & Voltage Fluctuation Log"
                    value={fieldMemoTitle}
                    onChange={(e) => setFieldMemoTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Readings & Field Details *</label>
                  <textarea
                    rows={3}
                    placeholder="Type technical observations, phase currents, fuel volume in litres, or handover notes..."
                    value={fieldMemoBody}
                    onChange={(e) => setFieldMemoBody(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddMemo}
                    disabled={!fieldMemoBody.trim()}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach Field Note</span>
                  </button>
                </div>
              </div>
            )}

            {/* Way 6: Simulated Filename Label */}
            {activeAttachWay === 'label' && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] text-slate-400 block">
                  Simulated / Reference Document Filename (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCS_Pitch3_Moisture_Readings_Oct2026.pdf"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-500 block">
                  Type a simulated reference name if you do not wish to upload an actual file.
                </span>
              </div>
            )}

            {/* Attached Files Roster */}
            {reportAttachments.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Files Attached to This Report ({reportAttachments.length}):
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {reportAttachments.map((att) => {
                    const badgeInfo = getFileBadgeInfo(att);
                    const IconCmp = badgeInfo.icon;
                    return (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded ${badgeInfo.color} shrink-0`}>
                            <IconCmp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-200 truncate">{att.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>{formatFileSize(att.size)}</span>
                              <span>·</span>
                              <span className="text-teal-400">{getSourceBadgeText(att.sourceType)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewAttachment(att)}
                            className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Preview File"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id, att.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Remove File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setIsSubmitReportOpen(false);
              }}
              className="px-3.5 py-2 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Submit Report to Supervisor
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Supervisor Review & Sign-Off */}
      <Modal
        isOpen={isReviewReportOpen}
        onClose={() => setIsReviewReportOpen(false)}
        title="Supervisor Review & Sign-Off"
        subtitle={`Reviewing submission for: ${selectedTask?.title}`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Latest Submitted Summary:</p>
            <p className="text-slate-200 mt-1 leading-relaxed">
              {selectedTask?.submissions?.[selectedTask.submissions.length - 1]?.reportSummary}
            </p>
          </div>

          {/* Attached Files in Latest Submission for Supervisor to Inspect */}
          {(() => {
            const latestSub = selectedTask?.submissions?.[selectedTask.submissions.length - 1];
            if (!latestSub?.attachments || latestSub.attachments.length === 0) return null;
            return (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">
                  Submitted Evidence Documents ({latestSub.attachments.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {latestSub.attachments.map((att) => {
                    const badgeInfo = getFileBadgeInfo(att);
                    const IconCmp = badgeInfo.icon;
                    return (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                      >
                        <div className={`p-1 rounded ${badgeInfo.color}`}>
                          <IconCmp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 max-w-[170px]">
                          <p className="font-medium text-slate-200 truncate">{att.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{formatFileSize(att.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment(att)}
                          className="p-1 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors cursor-pointer ml-1"
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Review Comments / Feedback (Required for revisions)
            </label>
            <textarea
              rows={3}
              placeholder="Enter approval congratulations or specific instructions for revision..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => handleReviewAction('REQUEST_REVISION')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Revision</span>
            </button>

            <button
              type="button"
              onClick={() => handleReviewAction('APPROVE')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve & Sign Off</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Task Submission Confirmation Receipt */}
      {confirmationData && (
        <Modal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          title="Task Report Submission Confirmed"
          subtitle={`Receipt Reference: ${confirmationData.confirmationRef}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  Submission Verified & Enqueued for Review
                </h4>
                <p className="text-xs text-emerald-300/80 mt-1 leading-relaxed">
                  Your completion report has been immutably recorded with exact operational timestamp and routed directly to the supervisor.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-[11px] text-slate-500 block">Task Title</span>
                  <strong className="text-slate-100">{confirmationData.taskTitle}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Report Version</span>
                  <span className="font-mono text-teal-400 font-semibold">Version {confirmationData.version}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Timestamp</span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {new Date(confirmationData.submittedAt).toLocaleDateString()} at {new Date(confirmationData.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Assigned Reviewer</span>
                  <strong className="text-slate-100">{confirmationData.routedTo}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Summary of Deliverables</span>
                <p className="text-slate-300 mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  {confirmationData.reportSummary}
                </p>
              </div>

              {confirmationData.attachments && confirmationData.attachments.length > 0 ? (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 block">
                    Attached Deliverables ({confirmationData.attachments.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {confirmationData.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="text-slate-200 truncate max-w-[180px]">{att.name}</span>
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment(att)}
                          className="p-1 text-slate-400 hover:text-teal-300 rounded cursor-pointer"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : confirmationData.attachmentName ? (
                <div className="flex items-center gap-2 text-[11px] text-teal-400">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attached: {confirmationData.attachmentName}</span>
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmationModalOpen(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* File Preview Modal for Deliverables & Field Proof */}
      <FilePreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
        allAttachments={
          previewAttachment
            ? [
                ...(selectedTask?.attachments || []),
                ...(selectedTask?.submissions?.flatMap((s) => s.attachments || []) || []),
                ...newTaskAttachments,
                ...reportAttachments,
                previewAttachment
              ].filter((att, index, arr) => arr.findIndex((x) => x.id === att.id) === index)
            : []
        }
        onSelectAttachment={(att) => setPreviewAttachment(att)}
        userContext={{
          name: currentUser.name,
          positionName: currentUser.positionName || currentUser.jobTitle,
          department: currentUser.department,
          evaluationLevel: currentUser.evaluationLevel,
          email: currentUser.email
        }}
      />
    </div>
  );
};
