export type Role = 
  | 'SYSTEM_ADMIN'
  | 'SUPERVISOR'
  | 'CRICKET_OPERATIONS_MANAGER'
  | 'STAFF'
  | 'STOREKEEPER';

export type ThemeMode = 'navy' | 'turf' | 'obsidian' | 'dusk' | 'light';

export type TaskStatus = 
  | 'DRAFT'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REVISION_REQUESTED'
  | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ItemType = 'CONSUMABLE' | 'REUSABLE_ASSET';

export type StockMovementType = 
  | 'RECEIPT'
  | 'ISSUE'
  | 'RETURN'
  | 'DAMAGE_LOSS'
  | 'ADJUSTMENT';

export type Department = 
  | 'Cricket Operations'
  | 'Administration'
  | 'Development'
  | 'Coaching'
  | 'Teaching'
  | 'Officiating & Match Officials'
  | 'Ground & Pitch Maintenance'
  | 'Stores & Logistics';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  positionName: string;
  department: Department;
  role: Role;
  supervisorId?: string;
  supervisorName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  positionStatus?: 'Occupied' | 'Vacant';
  avatarUrl: string;
  bio?: string;
  joinedDate: string;
  joiningCompanyDate: string;
  dateOfBirth: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  schoolBackground: string;
  evaluationLevel: string;
  experienceLevel: 'Junior' | 'Mid-Level' | 'Senior' | 'Executive';
  experienceYears: number;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  version: number;
  reportSummary: string;
  deliverablesNotes: string;
  attachmentName?: string;
  reviewComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUESTED';
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
  department: Department;
  assigneeId: string;
  assigneeName: string;
  assigneeRole: Role;
  createdById: string;
  createdByName: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  deadline: string;
  isOverdue?: boolean;
  completionRate?: number;
  submissions: TaskSubmission[];
  comments: TaskComment[];
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  type: ItemType;
  description: string;
  unit: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  reorderThreshold: number;
  location: string;
  brand?: string;
  condition?: 'NEW' | 'EXCELLENT' | 'GOOD' | 'NEEDS_MAINTENANCE' | 'DEFECTIVE';
  costPerUnit?: number;
  status: 'ACTIVE' | 'DISCONTINUED';
  lastCountedDate: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  type: StockMovementType;
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  recipientOrIssuer: string;
  performedById: string;
  performedByName: string;
  reason: string;
  referenceNumber: string;
  timestamp: string;
}

export interface StockRequest {
  id: string;
  requestNumber: string;
  requesterId: string;
  requesterName: string;
  department: Department;
  targetEventOrTeam: string;
  items: {
    itemId: string;
    itemName: string;
    requestedQty: number;
    unit: string;
  }[];
  purpose: string;
  neededByDate: string;
  status: 'PENDING' | 'APPROVED' | 'ISSUED' | 'REJECTED';
  reviewerComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorRole: Role;
  targetAudience: 'ALL_STAFF' | 'MANAGEMENT' | 'GROUND_STAFF' | 'STORE_TEAM';
  priority: 'ROUTINE' | 'IMPORTANT' | 'CRITICAL';
  isPinned: boolean;
  publishedAt: string;
  readCount: number;
  totalRecipients: number;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface InAppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'REPORT_SUBMITTED' | 'REPORT_REVIEWED' | 'STOCK_LOW' | 'ANNOUNCEMENT' | 'STOCK_REQUEST';
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType: 'TASK' | 'INVENTORY' | 'STOCK_MOVEMENT' | 'ANNOUNCEMENT' | 'REPORT' | 'USER_ACCESS' | 'SETTINGS';
  entityId: string;
  details: string;
  timestamp: string;
  severity: 'INFO' | 'NOTICE' | 'SECURITY';
}

export type CalendarEventType = 
  | 'MATCH' 
  | 'PITCH_MAINTENANCE' 
  | 'TRAINING' 
  | 'TASK_DEADLINE' 
  | 'FACILITY_EVENT' 
  | 'INVENTORY_AUDIT';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  location: string;
  description?: string;
  organizerOrAssignee?: string;
  assigneeId?: string;
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'ROUTINE';
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  linkedTaskId?: string;
  teamsOrParticipants?: string;
  tags?: string[];
}

