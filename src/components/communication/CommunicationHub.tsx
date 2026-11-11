import React, { useState, useRef } from 'react';
import { 
  Megaphone, 
  MessageSquare, 
  Plus, 
  Pin, 
  Send, 
  Users, 
  CheckCheck, 
  Clock, 
  AlertCircle,
  Search,
  ArrowLeft,
  Paperclip,
  Eye,
  Download,
  Image as ImageIcon,
  FileText,
  X
} from 'lucide-react';
import { Announcement, DirectMessage, User as UserType, Role, ProfileAttachment } from '../../types';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../i18n/LanguageContext';
import { OptionalAttachmentField, QuickTemplateOption } from '../common/OptionalAttachmentField';
import { FilePreviewModal } from '../common/FilePreviewModal';

const ANNOUNCEMENT_TEMPLATES: QuickTemplateOption[] = [
  {
    label: 'Stadium Operational Circular & Match Day Curfew',
    name: 'GCS_Official_Operations_Circular_2026.pdf',
    content: 'OFFICIAL STADIUM OPERATIONS CIRCULAR\n\nAll staff must adhere to designated venue access zones.\nEquipment storage bays locked 1 hour post-match.\nAuthorized security credentials must be worn at all times.',
    size: 165000,
    category: 'ACCREDITATION'
  },
  {
    label: 'Match Day Health & Emergency Safety Brief',
    name: 'GCS_Safety_Emergency_Brief.pdf',
    content: 'STADIUM EMERGENCY & FIRST RESPONSE GUIDELINES\n\nSt John Ambulance station located at Pavilion South Concourse.\nEvacuation muster point: Outer Practice Green Area C.',
    size: 145000,
    category: 'MEMO_REPORT'
  }
];

interface CommunicationHubProps {
  currentUser: UserType;
  announcements: Announcement[];
  messages: DirectMessage[];
  users: UserType[];
  onAddAnnouncement: (announcement: Announcement) => void;
  onSendMessage: (message: DirectMessage) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  currentUser,
  announcements,
  messages,
  users,
  onAddAnnouncement,
  onSendMessage,
  onShowToast
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Form states for announcement
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newPriority, setNewPriority] = useState<'ROUTINE' | 'IMPORTANT' | 'CRITICAL'>('IMPORTANT');
  const [newAudience, setNewAudience] = useState<'ALL_STAFF' | 'MANAGEMENT' | 'GROUND_STAFF' | 'STORE_TEAM'>('ALL_STAFF');
  const [isPinned, setIsPinned] = useState(false);
  const [announcementAttachments, setAnnouncementAttachments] = useState<ProfileAttachment[]>([]);

  // Messaging state
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const [selectedRecipientId, setSelectedRecipientId] = useState(otherUsers[0]?.id || '');
  const [chatInput, setChatInput] = useState('');
  const [chatAttachment, setChatAttachment] = useState<ProfileAttachment | null>(null);
  const [mobileChatView, setMobileChatView] = useState<'list' | 'chat'>('list');
  const [previewAttachment, setPreviewAttachment] = useState<ProfileAttachment | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const canPublishAnnouncement = currentUser.role === 'SUPERVISOR' || currentUser.role === 'SYSTEM_ADMIN' || currentUser.role === 'CRICKET_OPERATIONS_MANAGER';

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      onShowToast('error', 'Validation Error', 'Title and message body are required.');
      return;
    }

    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      authorName: currentUser.name,
      authorRole: currentUser.role,
      targetAudience: newAudience,
      priority: newPriority,
      isPinned,
      attachments: announcementAttachments.length > 0 ? announcementAttachments : undefined,
      publishedAt: new Date().toISOString(),
      readCount: 1,
      totalRecipients: users.length
    };

    onAddAnnouncement(newAnc);
    setIsDraftModalOpen(false);
    setNewTitle('');
    setNewBody('');
    setAnnouncementAttachments([]);
    onShowToast('success', 'Announcement Broadcast', 'Notice dispatched to targeted recipients.');
  };

  const handleChatFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isImage = file.type.startsWith('image/');
    reader.onload = () => {
      const resultStr = reader.result as string;
      const att: ProfileAttachment = {
        id: `att-chat-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        sourceType: 'LOCAL_UPLOAD',
        category: isImage ? 'OTHER' : 'MEMO_REPORT',
        dataUrl: resultStr,
        notes: `Attached in direct message thread`
      };
      setChatAttachment(att);
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !chatAttachment) return;

    const recipient = users.find(u => u.id === selectedRecipientId);
    if (!recipient) return;

    const conversationId = [currentUser.id, recipient.id].sort().join('-');

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      content: chatInput.trim() || (chatAttachment ? `[Attached: ${chatAttachment.name}]` : ''),
      attachments: chatAttachment ? [chatAttachment] : undefined,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    onSendMessage(newMsg);
    setChatInput('');
    setChatAttachment(null);
  };

  // Filter messages for current active thread
  const activeConversationMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.recipientId === selectedRecipientId) ||
    (m.senderId === selectedRecipientId && m.recipientId === currentUser.id)
  );

  const selectedRecipient = users.find(u => u.id === selectedRecipientId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t('nav_communication')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'rw' 
              ? "Amatangazo y'ibikorwa bya sitade yose, ubutumwa bw'ingenzi, n'ubutumwa bwawe bwite"
              : language === 'fr'
              ? "Avis opérationnels du stade, bulletins prioritaires et messages directs sécurisés"
              : language === 'sw'
              ? "Notisi za uendeshaji wa uwanja, matangazo ya kipaumbele na jumbe za kiutendaji"
              : "Stadium-wide operational notices, priority bulletins, and authenticated direct messages"}
          </p>
        </div>

        {canPublishAnnouncement && (
          <button
            onClick={() => setIsDraftModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
          >
            <Megaphone className="w-4 h-4" />
            <span>
              {language === 'rw' 
                ? 'Tangaza Itangazo' 
                : language === 'fr' 
                ? 'Publier une Annonce' 
                : language === 'sw' 
                ? 'Chapisha Tangazo' 
                : 'Publish Announcement'}
            </span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-slate-800 text-teal-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'rw' 
            ? `Amatangazo n'Amakuru (${announcements.length})` 
            : language === 'fr' 
            ? `Bulletins & Avis Officiels (${announcements.length})` 
            : language === 'sw' 
            ? `Matangazo Rasmi & Notisi (${announcements.length})` 
            : `Official Bulletins & Notices (${announcements.length})`}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-slate-800 text-teal-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'rw' 
            ? 'Ubutumwa bwa Buri Munsi' 
            : language === 'fr' 
            ? 'Messages Opérationnels Directs' 
            : language === 'sw' 
            ? 'Jumbe za Moja kwa Moja za Uendeshaji' 
            : 'Direct Operational Messages'}
        </button>
      </div>

      {/* TAB 1: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {announcements.map((anc) => (
              <div
                key={anc.id}
                className={`bg-slate-900 border rounded-xl p-5 space-y-3 transition-colors ${
                  anc.isPinned ? 'border-teal-700/80 bg-slate-900/90' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {anc.isPinned && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      anc.priority === 'CRITICAL' ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60' :
                      anc.priority === 'IMPORTANT' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {anc.priority}
                    </span>
                    <span className="text-xs text-slate-400">
                      Audience: <strong className="text-slate-300">{anc.targetAudience.replace('_', ' ')}</strong>
                    </span>
                  </div>

                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    {new Date(anc.publishedAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100">{anc.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                    {anc.body}
                  </p>
                </div>

                {/* Attached Files / Circulars */}
                {anc.attachments && anc.attachments.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-400 block mb-1.5">
                      Attached Documents ({anc.attachments.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {anc.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="max-w-[180px] truncate font-medium">{att.name}</span>
                          <button
                            type="button"
                            onClick={() => setPreviewAttachment(att)}
                            className="p-1 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Preview file"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          {att.dataUrl && (
                            <a
                              href={att.dataUrl}
                              download={att.name}
                              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                              title="Download file"
                            >
                              <Download className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Author: <strong className="text-slate-300">{anc.authorName}</strong> ({anc.authorRole})
                  </span>
                  <span className="font-mono tabular-nums text-[11px] text-slate-400">
                    Read by {anc.readCount} of {anc.totalRecipients} recipients
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[480px]">
          {/* User Thread List */}
          <div className={`border-r border-slate-800 p-3 space-y-2 bg-slate-950/40 ${mobileChatView === 'chat' ? 'hidden md:block' : 'block'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Staff Conversations
            </span>
            <div className="space-y-1">
              {otherUsers.map((user) => {
                const isSelected = user.id === selectedRecipientId;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedRecipientId(user.id);
                      setMobileChatView('chat');
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-slate-800 text-teal-300' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden shrink-0 border border-slate-600">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.jobTitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Window */}
          <div className={`md:col-span-2 flex flex-col justify-between p-4 bg-slate-900 ${mobileChatView === 'list' ? 'hidden md:flex' : 'flex'}`}>
            {selectedRecipient && (
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => setMobileChatView('list')}
                    className="md:hidden p-1 -ml-1 text-slate-400 hover:text-white rounded-lg flex items-center gap-1 text-xs cursor-pointer shrink-0"
                    aria-label="Back to contacts list"
                  >
                    <ArrowLeft className="w-4 h-4 text-teal-400" />
                    <span className="text-[11px] text-teal-400 font-medium">Contacts</span>
                  </button>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-100 truncate">{selectedRecipient.name}</h3>
                    <p className="text-[11px] text-slate-400 truncate">{selectedRecipient.jobTitle} · {selectedRecipient.department}</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                  Direct Line
                </span>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-80">
              {activeConversationMessages.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 italic">
                  No previous messages with {selectedRecipient?.name}. Send an operational memo below.
                </div>
              ) : (
                activeConversationMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-xl text-xs leading-relaxed ${
                          isMe 
                            ? 'bg-teal-700 text-white rounded-br-xs' 
                            : 'bg-slate-800 text-slate-200 rounded-bl-xs'
                        }`}
                      >
                        {msg.content}

                        {/* Direct Message Attachment */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20 space-y-1.5">
                            {msg.attachments.map((att) => (
                              <div
                                key={att.id}
                                className={`flex items-center justify-between gap-2 p-1.5 rounded-lg text-xs ${
                                  isMe ? 'bg-teal-800/80' : 'bg-slate-900/80'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {att.type.startsWith('image/') ? (
                                    <ImageIcon className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                                  )}
                                  <span className="truncate max-w-[140px] font-medium">{att.name}</span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewAttachment(att)}
                                    className="p-1 hover:bg-black/20 rounded cursor-pointer transition-colors"
                                    title="Preview file"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                  {att.dataUrl && (
                                    <a
                                      href={att.dataUrl}
                                      download={att.name}
                                      className="p-1 hover:bg-black/20 rounded cursor-pointer transition-colors"
                                      title="Download file"
                                    >
                                      <Download className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              {chatAttachment && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-teal-950/70 border border-teal-800/80 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="font-medium text-teal-200 truncate">{chatAttachment.name}</span>
                    <span className="text-[10px] font-mono text-teal-400">
                      ({(chatAttachment.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewAttachment(chatAttachment)}
                      className="p-1 text-teal-300 hover:text-white rounded cursor-pointer"
                      title="Preview attached file"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatAttachment(null)}
                      className="p-1 text-teal-400 hover:text-rose-400 rounded cursor-pointer"
                      title="Remove attachment"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input
                  type="file"
                  ref={chatFileInputRef}
                  onChange={handleChatFilePicked}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => chatFileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-teal-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Attach file (Optional)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={
                    language === 'rw'
                      ? `Ohereza ubutumwa kuri ${selectedRecipient?.name || 'umukozi'}...`
                      : language === 'fr'
                      ? `Message à ${selectedRecipient?.name || 'membre de l\'équipe'}...`
                      : language === 'sw'
                      ? `Mtumie ujumbe ${selectedRecipient?.name || 'mfanyakazi'}...`
                      : `Message ${selectedRecipient?.name || 'staff member'}... (attachment optional)`
                  }
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {language === 'rw' ? 'Kohereza' : language === 'fr' ? 'Envoyer' : language === 'sw' ? 'Tuma' : 'Send'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Publish Announcement */}
      <Modal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        title="Broadcast Operational Announcement"
        subtitle="Dispatches urgent updates to staff, grounds team, and logistics"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Announcement Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. ICC Technical Inspection Curfew & Equipment Quarantine"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Announcement Body *</label>
            <textarea
              required
              rows={4}
              placeholder="Provide exact operational guidelines, timelines, and restrictions..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority Level</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                <option value="CRITICAL">Critical (Immediate Notice)</option>
                <option value="IMPORTANT">Important (General Notice)</option>
                <option value="ROUTINE">Routine</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Audience</label>
              <select
                value={newAudience}
                onChange={(e) => setNewAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              >
                <option value="ALL_STAFF">All Staff & Contractors</option>
                <option value="MANAGEMENT">Management & Supervisors</option>
                <option value="GROUND_STAFF">Ground Maintenance Crew</option>
                <option value="STORE_TEAM">Equipment & Storehouse Custodians</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="pinCheck"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-teal-600 focus:ring-0"
            />
            <label htmlFor="pinCheck" className="text-slate-300">
              Pin to top of bulletin board
            </label>
          </div>

          {/* Optional Attachment Field */}
          <div className="pt-2 border-t border-slate-800">
            <OptionalAttachmentField
              attachments={announcementAttachments}
              onChange={setAnnouncementAttachments}
              title="Official Circulars & Briefing Files"
              encouragementText="Encouraged: Attach formal ICC circulars, health & safety briefs, or venue bulletins. Publishing without files is always supported."
              quickTemplates={ANNOUNCEMENT_TEMPLATES}
              onPreviewAttachment={setPreviewAttachment}
              compact
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsDraftModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </Modal>

      {/* Full Screen File Preview Modal */}
      <FilePreviewModal
        attachment={previewAttachment}
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </div>
  );
};
