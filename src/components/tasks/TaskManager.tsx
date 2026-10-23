import React, { useState, useEffect } from 'react';
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
  AlertTriangle 
} from 'lucide-react';
import { Task, User as UserType, TaskStatus, TaskPriority, TaskSubmission, Department } from '../../types';
import { Modal } from '../common/Modal';
import { useTranslation } from '../../context/LanguageContext';

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
  const { t, translateTasks, translateTask } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

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

  // Form states for report submission
  const [reportSummary, setReportSummary] = useState('');
  const [deliverablesNotes, setDeliverablesNotes] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // Form states for review
  const [reviewComment, setReviewComment] = useState('');

  // Form state for new comment
  const [newCommentText, setNewCommentText] = useState('');

  // Multi-lingual translations for tasks
  const translatedTasks = translateTasks(tasks);

  // Filtering based on translated titles and content
  const filteredTasks = translatedTasks.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeTask = selectedTask ? translateTask(selectedTask) : null;

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
      submissions: [],
      comments: []
    };

    onCreateTask(task);
    setIsCreateModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskInstructions('');
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
    const newSubmission: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId: selectedTask.id,
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      submittedAt: new Date().toISOString(),
      version: newVersionNumber,
      reportSummary,
      deliverablesNotes,
      attachmentName: attachmentName.trim() ? attachmentName.trim() : 'GCS_Operational_Verification_Log.pdf',
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

    // Generate comprehensive confirmation receipt
    setConfirmationData({
      confirmationRef: `GCS-REC-SUB-${Date.now().toString().slice(-6)}`,
      taskTitle: selectedTask.title,
      version: newVersionNumber,
      submittedAt: new Date().toISOString(),
      submittedByName: currentUser.name,
      reportSummary,
      deliverablesNotes,
      attachmentName: attachmentName.trim() ? attachmentName.trim() : 'GCS_Operational_Verification_Log.pdf',
      routedTo: selectedTask.createdByName || 'Claire Uwase'
    });
    setIsConfirmationModalOpen(true);

    setReportSummary('');
    setDeliverablesNotes('');
    setAttachmentName('');
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
    if (!selectedTask || !newCommentText.trim()) return;

    const newComment = {
      id: `tc-${Date.now()}`,
      taskId: selectedTask.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedTask: Task = {
      ...selectedTask,
      comments: [...(selectedTask.comments || []), newComment]
    };

    onUpdateTask(updatedTask);
    setSelectedTask(updatedTask);
    setNewCommentText('');
    onShowToast('info', 'Comment Posted', 'Comment recorded to task history');
  };

  const handleUpdateStatus = (newStatus: TaskStatus) => {
    if (!selectedTask) return;
    const updatedTask: Task = {
      ...selectedTask,
      status: newStatus,
      completionRate: newStatus === 'IN_PROGRESS' ? Math.max(selectedTask.completionRate || 0, 30) : selectedTask.completionRate
    };
    onUpdateTask(updatedTask);
    setSelectedTask(updatedTask);
    onShowToast('info', 'Status Updated', `Task status changed to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Task Management & Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervisor task assignments, deadline compliance, progress logs, and multi-version sign-offs
          </p>
        </div>

        {canCreateTask && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('action.assign_task', 'Create & Assign Task')}</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('action.search', 'Search tasks by title, instructions, or assignee...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter tasks by status"
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">{t('action.all', 'All Statuses')}</option>
            <option value="ASSIGNED">{t('status.ASSIGNED', 'Assigned')}</option>
            <option value="IN_PROGRESS">{t('status.IN_PROGRESS', 'In Progress')}</option>
            <option value="SUBMITTED">{t('status.SUBMITTED', 'Submitted')}</option>
            <option value="REVISION_REQUESTED">{t('status.REVISION_REQUESTED', 'Revision Requested')}</option>
            <option value="APPROVED">{t('status.APPROVED', 'Approved')}</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter tasks by priority"
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">{t('action.all', 'All Priorities')}</option>
            <option value="URGENT">{t('priority.URGENT', 'Urgent')}</option>
            <option value="HIGH">{t('priority.HIGH', 'High')}</option>
            <option value="MEDIUM">{t('priority.MEDIUM', 'Medium')}</option>
            <option value="LOW">{t('priority.LOW', 'Low')}</option>
          </select>
        </div>
      </div>

      {/* Task Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Task Details</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
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
                      <p className="font-semibold text-slate-100 hover:text-teal-300 transition-colors truncate">
                        {task.title}
                      </p>
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
                        className="text-xs font-medium text-teal-400 hover:text-teal-300"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details & Action Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={activeTask?.title || selectedTask.title}
          subtitle={`Department: ${activeTask?.department || selectedTask.department} · Created by ${selectedTask.createdByName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Status</span>
                <span className="font-semibold text-teal-400 mt-0.5 block">
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Priority</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {selectedTask.priority}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Assignee</span>
                <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                  {selectedTask.assigneeName}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Deadline</span>
                <span className="font-mono tabular-nums text-slate-300 mt-0.5 block">
                  {selectedTask.deadline}
                </span>
              </div>
            </div>

            {/* Description & Detailed Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operational Instructions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80 whitespace-pre-line">
                {activeTask?.instructions || activeTask?.description || selectedTask.instructions || selectedTask.description}
              </p>
            </div>

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

                {/* Supervisor Review Button (Supervisor can review when status is SUBMITTED) */}
                {selectedTask.status === 'SUBMITTED' && (
                  <button
                    onClick={() => setIsReviewReportOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  >
                    Review & Sign-Off Report
                  </button>
                )}
              </div>
            </div>

            {/* Submissions & Report History */}
            {activeTask?.submissions && activeTask.submissions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Report Version History ({activeTask.submissions.length} submission)
                </h4>
                <div className="space-y-2.5">
                  {activeTask.submissions.map((sub) => (
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
                      {sub.attachmentName && (
                        <div className="flex items-center gap-2 text-[11px] text-teal-400 bg-slate-900 px-2 py-1 rounded inline-flex">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{sub.attachmentName}</span>
                        </div>
                      )}

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
                Discussion & Activity Log
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeTask?.comments && activeTask.comments.length > 0 ? (
                  activeTask.comments.map((comment) => (
                    <div key={comment.id} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-medium text-slate-300">{comment.authorName} ({comment.authorRole})</span>
                        <span className="font-mono tabular-nums">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-300">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No comments posted yet.</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add operational comment or update..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors shrink-0"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create Task */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create & Assign Operational Task"
        subtitle="Assign critical facility or match preparation tasks to staff"
        maxWidth="lg"
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

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors"
            >
              Create & Assign
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Submit Report */}
      <Modal
        isOpen={isSubmitReportOpen}
        onClose={() => setIsSubmitReportOpen(false)}
        title="Submit Completion Report"
        subtitle={`Filing report for: ${selectedTask?.title}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Report Summary & Findings *</label>
            <textarea
              required
              rows={4}
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

          <div>
            <label className="block text-slate-300 font-medium mb-1">Attachment File Name (Simulated Document)</label>
            <input
              type="text"
              placeholder="e.g. GCS_Pitch3_Moisture_Readings_Oct2026.pdf"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsSubmitReportOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition-colors"
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

              {confirmationData.attachmentName && (
                <div className="flex items-center gap-2 text-[11px] text-teal-400">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attached: {confirmationData.attachmentName}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmationModalOpen(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
