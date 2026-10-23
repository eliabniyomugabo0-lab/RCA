import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { Announcement, DirectMessage, User as UserType, Role } from '../../types';
import { Modal } from '../common/Modal';
import { useTranslation } from '../../context/LanguageContext';

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
  const { t, translateAnnouncements, translateMessages } = useTranslation();
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Multi-lingual translations for announcements & messages
  const displayedAnnouncements = translateAnnouncements(announcements);
  const displayedMessages = translateMessages(messages);

  // Form states for announcement
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newPriority, setNewPriority] = useState<'ROUTINE' | 'IMPORTANT' | 'CRITICAL'>('IMPORTANT');
  const [newAudience, setNewAudience] = useState<'ALL_STAFF' | 'MANAGEMENT' | 'GROUND_STAFF' | 'STORE_TEAM'>('ALL_STAFF');
  const [isPinned, setIsPinned] = useState(false);

  // Messaging state
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const [selectedRecipientId, setSelectedRecipientId] = useState(otherUsers[0]?.id || '');
  const [chatInput, setChatInput] = useState('');

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
      publishedAt: new Date().toISOString(),
      readCount: 1,
      totalRecipients: users.length
    };

    onAddAnnouncement(newAnc);
    setIsDraftModalOpen(false);
    setNewTitle('');
    setNewBody('');
    onShowToast('success', 'Announcement Broadcast', 'Notice dispatched to targeted recipients.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

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
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    onSendMessage(newMsg);
    setChatInput('');
  };

  // Filter messages for current active thread
  const activeConversationMessages = displayedMessages.filter(m => 
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
            {t('nav.communication', 'Communications & Bulletins')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Stadium-wide operational notices, priority bulletins, and authenticated direct messages
          </p>
        </div>

        {canPublishAnnouncement && (
          <button
            onClick={() => setIsDraftModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs"
          >
            <Megaphone className="w-4 h-4" />
            <span>{t('action.publish_notice', 'Publish Announcement')}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'announcements'
              ? 'bg-slate-800 text-teal-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Official Bulletins & Notices ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'messages'
              ? 'bg-slate-800 text-teal-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Direct Operational Messages
        </button>
      </div>

      {/* TAB 1: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {displayedAnnouncements.map((anc) => (
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
          <div className="border-r border-slate-800 p-3 space-y-2 bg-slate-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Staff Conversations
            </span>
            <div className="space-y-1">
              {otherUsers.map((user) => {
                const isSelected = user.id === selectedRecipientId;
                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedRecipientId(user.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
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
          <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-900">
            {selectedRecipient && (
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-100">{selectedRecipient.name}</h3>
                  <p className="text-[11px] text-slate-400">{selectedRecipient.jobTitle} · {selectedRecipient.department}</p>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
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
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={`Message ${selectedRecipient?.name || 'staff member'}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publish Announcement */}
      <Modal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        title="Broadcast Operational Announcement"
        subtitle="Dispatches urgent updates to staff, grounds team, and logistics"
        maxWidth="lg"
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

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsDraftModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
