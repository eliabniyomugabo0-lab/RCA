import React, { useState, useRef } from 'react';
import { 
  Paperclip, 
  Upload, 
  Link as LinkIcon, 
  FileText, 
  BookOpen, 
  Trash2, 
  Eye, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  File, 
  Check, 
  Info,
  Sparkles
} from 'lucide-react';
import { ProfileAttachment } from '../../types';

export interface QuickTemplateOption {
  label: string;
  name: string;
  content: string;
  size?: number;
  category?: ProfileAttachment['category'];
}

interface OptionalAttachmentFieldProps {
  attachments: ProfileAttachment[];
  onChange: (attachments: ProfileAttachment[]) => void;
  title?: string;
  encouragementText?: string;
  quickTemplates?: QuickTemplateOption[];
  compact?: boolean;
  onPreviewAttachment?: (attachment: ProfileAttachment) => void;
}

export const OptionalAttachmentField: React.FC<OptionalAttachmentFieldProps> = ({
  attachments,
  onChange,
  title = 'Optional Supporting Documents & Files',
  encouragementText = 'Encouraged: You are welcome to attach verifiable proof, photos, PDFs, or digital notes. Submissions without attachments are always accepted.',
  quickTemplates,
  compact = false,
  onPreviewAttachment
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'cloud' | 'template' | 'memo'>('upload');
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudName, setCloudName] = useState('');
  const [memoTitle, setMemoTitle] = useState('');
  const [memoBody, setMemoBody] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      const isText = file.type.includes('text') || file.type.includes('csv') || file.name.endsWith('.csv') || file.name.endsWith('.txt');

      reader.onload = () => {
        const resultStr = reader.result as string;
        const newAtt: ProfileAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          sourceType: 'LOCAL_UPLOAD',
          category: isImage ? 'OTHER' : 'MEMO_REPORT',
          dataUrl: isImage ? resultStr : (isText ? undefined : resultStr),
          content: isText ? resultStr : undefined,
          notes: `Uploaded via local file selector (${(file.size / 1024).toFixed(1)} KB)`
        };
        onChange([...attachments, newAtt]);
      };

      if (isText) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    if (e.target) e.target.value = '';
  };

  const handleAddCloudLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudUrl.trim()) return;

    let finalName = cloudName.trim();
    if (!finalName) {
      try {
        const parsed = new URL(cloudUrl);
        finalName = parsed.hostname + parsed.pathname;
      } catch {
        finalName = 'Cloud_Document_Link.url';
      }
    }

    const newAtt: ProfileAttachment = {
      id: `att-cld-${Date.now()}`,
      name: finalName,
      size: 45000,
      type: 'text/html',
      uploadedAt: new Date().toISOString(),
      sourceType: 'CLOUD_LINK',
      externalUrl: cloudUrl.trim(),
      category: 'MEMO_REPORT',
      notes: `Referenced external cloud asset: ${cloudUrl.trim()}`
    };

    onChange([...attachments, newAtt]);
    setCloudUrl('');
    setCloudName('');
  };

  const handleAddTemplate = (tmpl: QuickTemplateOption) => {
    const newAtt: ProfileAttachment = {
      id: `att-tmpl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: tmpl.name,
      size: tmpl.size || 128000,
      type: tmpl.name.endsWith('.csv') ? 'text/csv' : 'text/plain',
      uploadedAt: new Date().toISOString(),
      sourceType: 'OFFICIAL_TEMPLATE',
      category: tmpl.category || 'ACCREDITATION',
      content: tmpl.content,
      notes: `Standard GCS official specification: ${tmpl.label}`
    };

    onChange([...attachments, newAtt]);
  };

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoBody.trim()) return;

    const titleStr = memoTitle.trim() || 'Operational_Field_Note';
    const fileName = titleStr.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.txt';

    const newAtt: ProfileAttachment = {
      id: `att-memo-${Date.now()}`,
      name: fileName,
      size: new Blob([memoBody]).size,
      type: 'text/plain',
      uploadedAt: new Date().toISOString(),
      sourceType: 'DIGITAL_MEMO',
      category: 'MEMO_REPORT',
      content: `${titleStr.toUpperCase()}\nDate: ${new Date().toLocaleString()}\n\n${memoBody.trim()}`,
      notes: `Composed digital field memo: ${titleStr}`
    };

    onChange([...attachments, newAtt]);
    setMemoTitle('');
    setMemoBody('');
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  const getBadge = (att: ProfileAttachment) => {
    const name = att.name.toLowerCase();
    if (att.dataUrl && att.dataUrl.startsWith('data:image/')) return { label: 'PHOTO', color: 'text-purple-400 bg-purple-950/60 border-purple-800/60', icon: ImageIcon };
    if (name.endsWith('.pdf')) return { label: 'PDF', color: 'text-rose-400 bg-rose-950/60 border-rose-800/60', icon: FileText };
    if (name.endsWith('.csv') || name.endsWith('.xlsx')) return { label: 'SHEET', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60', icon: FileSpreadsheet };
    if (att.sourceType === 'CLOUD_LINK') return { label: 'LINK', color: 'text-sky-400 bg-sky-950/60 border-sky-800/60', icon: LinkIcon };
    return { label: 'DOC', color: 'text-teal-400 bg-teal-950/60 border-teal-800/60', icon: File };
  };

  return (
    <div className={`rounded-xl border border-slate-800/80 bg-slate-950/60 ${compact ? 'p-3' : 'p-4'} space-y-3`}>
      {/* Header with Encouraging Label */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200">{title}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/60">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Optional &bull; Encouraged</span>
          </span>
        </div>
        {attachments.length > 0 && (
          <span className="text-[11px] text-teal-400 font-mono">
            {attachments.length} {attachments.length === 1 ? 'file' : 'files'} attached
          </span>
        )}
      </div>

      {/* Encouragement Hint Box */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="flex-1">
          <strong className="text-teal-300 font-medium">Why attach? </strong>
          {encouragementText}
        </p>
      </div>

      {/* Attachment Methods Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800/80 pb-2 overflow-x-auto text-[11px]">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 font-medium ${
            activeTab === 'upload' ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Browse Device</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cloud')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 font-medium ${
            activeTab === 'cloud' ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Cloud Link</span>
        </button>
        {quickTemplates && quickTemplates.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('template')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 font-medium ${
              activeTab === 'template' ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Field Template ({quickTemplates.length})</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('memo')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 font-medium ${
            activeTab === 'memo' ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Digital Memo</span>
        </button>
      </div>

      {/* Tab 1: Upload from Device */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.txt,.docx"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 border-2 border-dashed border-slate-700/80 hover:border-teal-500/80 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-200 font-medium group-hover:text-teal-300">
              Click to select files from your computer or phone
            </span>
            <span className="text-[10px] text-slate-400">
              Supports PDF, photos, spreadsheets, documents, inspection scans (Optional)
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Cloud Link */}
      {activeTab === 'cloud' && (
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium block">
              Cloud URL (Google Drive, OneDrive, ICC Portal, Intranet)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={cloudUrl}
              onChange={(e) => setCloudUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Document Display Name (e.g. Official_Match_Permit.pdf)"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
            />
            <button
              type="button"
              onClick={handleAddCloudLink}
              disabled={!cloudUrl.trim()}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Attach Link
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Quick Field Templates */}
      {activeTab === 'template' && quickTemplates && quickTemplates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {quickTemplates.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddTemplate(tmpl)}
              className="p-2.5 bg-slate-900/80 hover:bg-teal-950/40 border border-slate-800 hover:border-teal-700/60 rounded-xl text-left transition-all flex items-start gap-2.5 cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-200 group-hover:text-teal-300 truncate">
                  {tmpl.label}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{tmpl.name}</p>
              </div>
              <span className="text-[10px] text-teal-400 font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
                + Attach
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Tab 4: Digital Memo */}
      {activeTab === 'memo' && (
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
          <input
            type="text"
            placeholder="Memo Title (e.g. Weather Impact & Drainage Inspection)"
            value={memoTitle}
            onChange={(e) => setMemoTitle(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
          />
          <textarea
            rows={3}
            placeholder="Write observations, serials, handover signatures, or special operational guidelines..."
            value={memoBody}
            onChange={(e) => setMemoBody(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddMemo}
              disabled={!memoBody.trim()}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Attach Digital Note
            </button>
          </div>
        </div>
      )}

      {/* Roster of Attached Files */}
      {attachments.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Attached Files Ready to Submit ({attachments.length}):
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {attachments.map((att) => {
              const badge = getBadge(att);
              const IconCmp = badge.icon;
              return (
                <div
                  key={att.id}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${badge.color}`}>
                      {badge.label}
                    </span>
                    <IconCmp className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-200 font-medium truncate">{att.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {(att.size / 1024).toFixed(1)} KB &bull; {att.sourceType?.replace('_', ' ') || 'ATTACHMENT'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onPreviewAttachment && (
                      <button
                        type="button"
                        onClick={() => onPreviewAttachment(att)}
                        title="Preview attached file"
                        className="p-1 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(att.id)}
                      title="Remove attachment"
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
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
  );
};
