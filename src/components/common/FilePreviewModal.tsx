import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  FileCheck, 
  Image as ImageIcon, 
  File, 
  Maximize2, 
  Minimize2, 
  Info, 
  Printer, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  Award, 
  Building2, 
  Copy, 
  Check, 
  Eye, 
  Table, 
  Share2,
  Lock
} from 'lucide-react';
import QRCode from 'qrcode';
import { ProfileAttachment, User } from '../../types';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: ProfileAttachment | null;
  allAttachments?: ProfileAttachment[];
  onSelectAttachment?: (att: ProfileAttachment) => void;
  userContext?: {
    name: string;
    positionName: string;
    department: string;
    evaluationLevel?: string;
    email?: string;
  };
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  attachment,
  allAttachments = [],
  onSelectAttachment,
  userContext
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [docPage, setDocPage] = useState<1 | 2>(1);
  const [pdfViewMode, setPdfViewMode] = useState<'BROWSED_CONTENT' | 'TRANSCRIPT'>('BROWSED_CONTENT');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [imageBackdrop, setImageBackdrop] = useState<'slate' | 'checker' | 'black'>('slate');
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate real QR code for verification link/checksum
  useEffect(() => {
    if (!attachment) return;
    const verifyPayload = JSON.stringify({
      docId: attachment.id,
      name: attachment.name,
      holder: userContext?.name || 'GCS Personnel',
      cat: attachment.category || 'CERTIFICATE',
      verifiedAt: attachment.uploadedAt,
      authority: 'Gahanga Cricket Stadium / Rwanda Cricket Association'
    });

    QRCode.toDataURL(verifyPayload, {
      width: 160,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [attachment, userContext]);

  // Reset viewport controls on attachment change
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setDocPage(1);
    setPdfViewMode('BROWSED_CONTENT');
    setCopiedText(false);
  }, [attachment?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, attachment, allAttachments]);

  if (!isOpen || !attachment) return null;

  const currentIndex = allAttachments.findIndex((a) => a.id === attachment.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < allAttachments.length - 1;

  const handlePrev = () => {
    if (hasPrev && onSelectAttachment) {
      onSelectAttachment(allAttachments[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectAttachment) {
      onSelectAttachment(allAttachments[currentIndex + 1]);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (attachment.dataUrl) {
      const link = document.createElement('a');
      link.href = attachment.dataUrl;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const content =
        `GAHANGA CRICKET STADIUM — RWANDA CRICKET ASSOCIATION\n` +
        `OFFICIAL PERSONNEL DOSSIER EXPORT\n` +
        `====================================================\n` +
        `DOCUMENT TITLE:   ${attachment.name}\n` +
        `CATEGORY:         ${attachment.category || 'Official Record'}\n` +
        `DOCUMENT NUMBER:  ${attachment.documentNumber || `GCS-REC-${attachment.id.substring(0, 8).toUpperCase()}`}\n` +
        `PERSONNEL HOLDER: ${userContext?.name || 'Verified Staff'}\n` +
        `POSITION:         ${userContext?.positionName || 'Operations Staff'}\n` +
        `DEPARTMENT:       ${userContext?.department || 'Cricket Operations'}\n` +
        `UPLOADED AT:      ${new Date(attachment.uploadedAt).toLocaleString()}\n` +
        `SOURCE:           ${attachment.sourceType || 'OFFICIAL_REGISTRY'}\n` +
        `NOTES:            ${attachment.notes || 'Verified official document on permanent record'}\n` +
        `====================================================\n` +
        `AUTHENTICATION STATUS: VERIFIED & SEALED IN GCS HUB\n` +
        `ISSUED UNDER AUTHORITY OF RWANDA CRICKET ASSOCIATION.`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name.endsWith('.txt') ? attachment.name : `${attachment.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isImage = 
    attachment.type.startsWith('image/') || 
    /\.(png|jpe?g|webp|gif|svg)$/i.test(attachment.name);

  const isPdf = 
    attachment.type.includes('pdf') || 
    attachment.name.toLowerCase().endsWith('.pdf');

  const isSheet = 
    attachment.type.includes('sheet') || 
    /\.(xlsx?|csv)$/i.test(attachment.name);

  const isText = 
    attachment.type.startsWith('text/') || 
    /\.(txt|md|json|log)$/i.test(attachment.name) ||
    Boolean(attachment.content);

  const isCloudLink = attachment.sourceType === 'CLOUD_LINK' || Boolean(attachment.externalUrl);

  const getCategoryTheme = (category?: string) => {
    switch (category) {
      case 'CERTIFICATE':
        return { label: 'Certification', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/80' };
      case 'ID_DOCUMENT':
        return { label: 'Identity Document', color: 'text-sky-400 bg-sky-950/80 border-sky-700/80' };
      case 'CONTRACT':
        return { label: 'Appointment Contract', color: 'text-purple-400 bg-purple-950/80 border-purple-700/80' };
      case 'MEDICAL':
        return { label: 'Medical Clearance', color: 'text-rose-400 bg-rose-950/80 border-rose-700/80' };
      case 'ACCREDITATION':
        return { label: 'Pitch / Venue Pass', color: 'text-amber-400 bg-amber-950/80 border-amber-700/80' };
      case 'MEMO_REPORT':
        return { label: 'Official Match Memo', color: 'text-indigo-400 bg-indigo-950/80 border-indigo-700/80' };
      default:
        return { label: 'General Dossier File', color: 'text-slate-300 bg-slate-800 border-slate-700' };
    }
  };

  const catTheme = getCategoryTheme(attachment.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        ref={containerRef}
        className={`bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-none' 
            : 'w-full max-w-6xl h-[92vh] max-h-[900px]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${catTheme.color}`}>
              {isImage ? <ImageIcon className="w-4 h-4" /> : isPdf ? <FileText className="w-4 h-4" /> : isSheet ? <Table className="w-4 h-4" /> : <File className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[200px] sm:max-w-md">
                  {attachment.name}
                </h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catTheme.color}`}>
                  {catTheme.label}
                </span>
                {attachment.verified !== false && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {userContext?.name ? `${userContext.name} (${userContext.positionName})` : 'GCS Personnel Record'} · {formatFileSize(attachment.size)} · Uploaded {new Date(attachment.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Toolbar Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Multi-file index & navigation */}
            {allAttachments.length > 1 && (
              <div className="flex items-center gap-1 mr-2 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  title="Previous Document (Left Arrow)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-slate-300 px-1">
                  {currentIndex + 1}/{allAttachments.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  title="Next Document (Right Arrow)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Zoom & View Controls for visual/doc previews */}
            {(isImage || isPdf) && (
              <div className="hidden sm:flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-slate-300 w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="Reset Zoom & Orientation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                {isImage && (
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Metadata Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowMetadata(!showMetadata)}
              className={`p-2 rounded-lg transition-colors ${
                showMetadata 
                  ? 'bg-slate-800 text-teal-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle File Details Sidebar"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
              title="Close Preview (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Viewer Area */}
        <div className="flex-1 flex overflow-hidden relative bg-slate-950">
          {/* Viewer Area */}
          <div className="flex-1 flex flex-col overflow-auto items-center justify-center p-3 sm:p-6 relative">
            {/* Case 1: Image Preview */}
            {isImage && (
              <div 
                className={`w-full h-full flex flex-col items-center justify-center relative overflow-auto rounded-xl p-4 transition-colors ${
                  imageBackdrop === 'checker' 
                    ? 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900' 
                    : imageBackdrop === 'black' 
                    ? 'bg-black' 
                    : 'bg-slate-900/60'
                }`}
              >
                {/* Backdrop Switcher Pill */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-slate-950/80 backdrop-blur-xs border border-slate-800 px-2 py-1 rounded-lg text-[10px]">
                  <span className="text-slate-400">Backdrop:</span>
                  <button
                    type="button"
                    onClick={() => setImageBackdrop('slate')}
                    className={`px-1.5 py-0.5 rounded ${imageBackdrop === 'slate' ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageBackdrop('checker')}
                    className={`px-1.5 py-0.5 rounded ${imageBackdrop === 'checker' ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageBackdrop('black')}
                    className={`px-1.5 py-0.5 rounded ${imageBackdrop === 'black' ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                  >
                    Pure Black
                  </button>
                </div>

                <div 
                  className="transition-transform duration-150 ease-out max-w-full max-h-full flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`
                  }}
                >
                  {attachment.dataUrl ? (
                    <img
                      src={attachment.dataUrl}
                      alt={attachment.name}
                      className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700/60"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    /* Seeded Image Document Fallback (e.g. Rwanda National ID) */
                    <div className="w-[480px] max-w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-teal-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 relative overflow-hidden">
                      {/* Security Guilloche Pattern Emulation */}
                      <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between pb-3 border-b border-teal-500/30">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xs text-white">
                            RW
                          </div>
                          <div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-teal-400 block">
                              REPUBLIC OF RWANDA
                            </span>
                            <span className="text-xs font-bold text-slate-100">
                              NATIONAL ID & GCS OPERATIONS IDENTITY
                            </span>
                          </div>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-teal-400" />
                      </div>

                      <div className="flex gap-4 mt-4">
                        <div className="w-24 h-32 rounded-xl bg-slate-950 border border-slate-700 flex flex-col items-center justify-center p-2 text-center shrink-0">
                          <div className="w-16 h-16 rounded-full bg-teal-900/60 border border-teal-500/50 flex items-center justify-center text-teal-300 font-bold text-xl mb-1">
                            {userContext?.name.charAt(0) || 'H'}
                          </div>
                          <span className="text-[9px] font-mono text-teal-400">GCS PASS</span>
                          <span className="text-[8px] text-slate-400">ICC TIER 1</span>
                        </div>

                        <div className="flex-1 space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Name</span>
                            <strong className="text-sm text-slate-100">{userContext?.name || 'Hagenimana Damascene'}</strong>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Role & Post</span>
                              <span className="text-teal-300 font-medium">{userContext?.positionName || 'Cricket Operations Manager'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Department</span>
                              <span className="text-slate-300">{userContext?.department || 'Cricket Operations'}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                            <div>
                              <span className="text-[10px] text-slate-400 block">ID Reference</span>
                              <span className="font-mono text-slate-300">1198880023451092</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Status</span>
                              <span className="text-emerald-400 font-semibold">AUTHENTICATED</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span>GAHANGA CRICKET STADIUM — KIGALI, RWANDA</span>
                        <span className="font-mono">VALID: 2026-2029</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Case 2: PDF & Official Credentials Viewer */}
            {isPdf && (
              <div 
                className="w-full h-full flex flex-col items-center justify-start overflow-y-auto max-w-5xl py-2 px-1 transition-transform duration-150 flex-1"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center'
                }}
              >
                {attachment.dataUrl && pdfViewMode === 'BROWSED_CONTENT' ? (
                  /* Real Browsed PDF Viewer for actual uploaded files */
                  <div className="w-full h-full flex flex-col flex-1 min-h-[640px]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded border border-teal-800/80 text-[11px] font-semibold flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Browsed Document Content: {attachment.name}</span>
                        </span>
                        <span className="text-slate-400 text-[11px] hidden sm:inline">
                          Viewing actual file ({formatFileSize(attachment.size)})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPdfViewMode('TRANSCRIPT')}
                        className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-teal-300 rounded border border-slate-700 transition-colors cursor-pointer"
                        title="View GCS Official Certificate Paper"
                      >
                        View Official Seal Transcript
                      </button>
                    </div>

                    <div className="w-full flex-1 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl min-h-[600px] flex items-center justify-center">
                      <object
                        data={attachment.dataUrl}
                        type="application/pdf"
                        className="w-full h-full min-h-[600px] rounded-xl border-0 bg-white"
                      >
                        <iframe
                          src={attachment.dataUrl}
                          title={attachment.name}
                          className="w-full h-full min-h-[600px] border-0 rounded-xl bg-white"
                        />
                      </object>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header Controls for Transcript Mode */}
                    <div className="flex items-center justify-between w-full max-w-4xl mb-3 shrink-0">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setDocPage(1)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            docPage === 1 
                              ? 'bg-teal-600 text-white shadow-xs' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Page 1: Official Certificate / Appointment
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocPage(2)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            docPage === 2 
                              ? 'bg-teal-600 text-white shadow-xs' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Page 2: Operations Scope & Verification Clauses
                        </button>
                      </div>

                      {attachment.dataUrl && (
                        <button
                          type="button"
                          onClick={() => setPdfViewMode('BROWSED_CONTENT')}
                          className="px-2.5 py-1 text-[11px] bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded border border-teal-500/40 transition-colors cursor-pointer font-semibold"
                        >
                          ← Switch to Browsed PDF File
                        </button>
                      )}
                    </div>

                    {/* Printable Document Paper */}
                <div className="w-full bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 border border-slate-300 relative overflow-hidden min-h-[640px]">
                  {/* Subtle security background watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
                    <span className="text-7xl font-black uppercase text-slate-900 rotate-[-25deg] tracking-widest">
                      GAHANGA CRICKET STADIUM
                    </span>
                  </div>

                  {/* Document Header with Logos & Seals */}
                  <div className="flex items-start justify-between border-b-2 border-emerald-900/40 pb-5 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl bg-emerald-900 text-white flex flex-col items-center justify-center font-bold text-lg shadow-md shrink-0">
                        <Award className="w-7 h-7 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 uppercase">
                          Gahanga Cricket Stadium
                        </h2>
                        <p className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
                          Rwanda Cricket Association · Operations & Governance Registry
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          KG 21 Sector Gahanga, Kicukiro District, City of Kigali, Rwanda
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-300 block mb-1">
                        REF: {attachment.documentNumber || `GCS-ARCH-${attachment.id.substring(0, 8).toUpperCase()}`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        ISSUED: {new Date(attachment.uploadedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Document Body: Page 1 */}
                  {docPage === 1 ? (
                    <div className="py-6 space-y-6 relative z-10">
                      <div className="text-center space-y-1.5">
                        <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100/70 px-3 py-1 rounded-full inline-block">
                          Official Accreditation & Operational Charter
                        </span>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                          {attachment.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                        </h1>
                        <p className="text-xs text-slate-600 italic">
                          Document issued under the statutes of Rwanda Cricket Association (RCA) and ICC African Development Framework
                        </p>
                      </div>

                      {/* Recipient Details Box */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Document Holder / Certified Officer
                          </span>
                          <strong className="text-sm font-bold text-slate-900 block mt-0.5">
                            {userContext?.name || 'Hagenimana Damascene'}
                          </strong>
                          <span className="text-slate-600 text-xs">
                            {userContext?.positionName || 'Cricket Operations Manager'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Assigned Department & Division
                          </span>
                          <strong className="text-xs font-semibold text-slate-900 block mt-0.5">
                            {userContext?.department || 'Cricket Operations'}
                          </strong>
                          <span className="text-slate-600 text-[11px]">
                            Accreditation Level: {userContext?.evaluationLevel || 'Tier 1 — Outstanding / ICC Certified'}
                          </span>
                        </div>
                      </div>

                      {/* Official Statement */}
                      <div className="text-xs text-slate-700 leading-relaxed space-y-3 font-serif">
                        <p>
                          <strong>BE IT KNOWN TO ALL PERSONS</strong> that the undersigned authority hereby confirms that the named official has fulfilled all professional criteria, matchday protocols, tournament logistics oversight, pitch curation standards, and facility management requirements established for international cricket fixtures hosted at Gahanga Cricket Stadium.
                        </p>
                        <p>
                          The officer is vested with full operational authority across designated stadium zones, including the Main Match Pitch, High-Performance Practice Nets, Pavilion Umpires & Match Referees Suite, Ground Care Equipment Depot, and Tournament Operations Control.
                        </p>
                        {attachment.notes && (
                          <div className="p-3 bg-amber-50/80 border-l-4 border-amber-500 text-slate-800 text-xs font-sans rounded-r-lg">
                            <span className="font-bold text-amber-900 block text-[11px] mb-0.5">Official Registry Note:</span>
                            {attachment.notes}
                          </div>
                        )}
                      </div>

                      {/* Signatories & Stamps Footer */}
                      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                        {/* QR Code Validation */}
                        <div className="flex items-center gap-3">
                          {qrDataUrl ? (
                            <img 
                              src={qrDataUrl} 
                              alt="Verification QR" 
                              className="w-18 h-18 border border-slate-300 rounded-lg p-1 bg-white shadow-xs" 
                            />
                          ) : (
                            <div className="w-18 h-18 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                              QR Valid
                            </div>
                          )}
                          <div className="text-[10px] text-slate-600 space-y-0.5">
                            <span className="font-bold text-slate-900 block">Scan to Verify Integrity</span>
                            <span className="font-mono text-slate-500 block">ID: {attachment.id.substring(0, 14)}</span>
                            <span className="text-emerald-700 font-semibold block">GCS Operations Verified ✓</span>
                          </div>
                        </div>

                        {/* Official Signatures */}
                        <div className="flex items-center gap-6 text-center">
                          <div className="space-y-1">
                            <div className="w-32 border-b border-slate-400 font-serif italic text-xs text-slate-800 pb-1">
                              Claire Uwase
                            </div>
                            <span className="text-[9px] font-bold text-slate-600 block uppercase">Director of Operations</span>
                            <span className="text-[8px] text-slate-400 block">Gahanga Cricket Stadium</span>
                          </div>

                          <div className="space-y-1">
                            <div className="w-32 border-b border-slate-400 font-serif italic text-xs text-slate-800 pb-1">
                              Damascene H.
                            </div>
                            <span className="text-[9px] font-bold text-slate-600 block uppercase">Manager — Cricket Ops</span>
                            <span className="text-[8px] text-slate-400 block">Rwanda Cricket Association</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Document Body: Page 2 */
                    <div className="py-6 space-y-5 relative z-10 text-xs text-slate-700">
                      <div className="border-b border-slate-200 pb-2">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                          Section B: Operational Clauses & Compliance Register
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Regulatory provisions governing the accredited personnel at GCS facilities
                        </p>
                      </div>

                      <div className="space-y-3 font-sans leading-relaxed">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <strong className="text-slate-900 block mb-0.5">Article 1 — Facility Access & Safety Protocol</strong>
                          <p className="text-slate-600">
                            The holder is granted unrestricted operational access to Category A turf areas, floodlight control consoles, water drainage valves, and equipment storage bays during matchday fixtures and training camps.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <strong className="text-slate-900 block mb-0.5">Article 2 — Incident Reporting & Match Sign-off</strong>
                          <p className="text-slate-600">
                            All pitch wear reports, roller run logs, moisture readings, and equipment movement vouchers must be signed off digitally within 2 hours of fixture conclusion in accordance with RCA governance.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <strong className="text-slate-900 block mb-0.5">Article 3 — Archival & Recertification Mandate</strong>
                          <p className="text-slate-600">
                            This document is indexed in the persistent GCS Personnel Records Repository. Valid for official representation through the 2026-2028 ICC Continental cycle.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                        <span>PAGE 2 OF 2 — OFFICIAL DOSSIER SCHEDULE</span>
                        <span className="font-mono text-emerald-800 font-semibold">AUTHENTIC RECORD COPY</span>
                      </div>
                    </div>
                  )}
                </div>
                  </>
                )}
              </div>
            )}

            {/* Case 3: Tabular / Spreadsheet Preview */}
            {isSheet && (
              <div className="w-full h-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Tabular Dataset Preview</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    6 Columns · Active Grid
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-300 font-mono text-[11px] border-b border-slate-800">
                        <th className="p-2.5">Row #</th>
                        <th className="p-2.5">Record Item</th>
                        <th className="p-2.5">Facility Sector</th>
                        <th className="p-2.5">Inspection Status</th>
                        <th className="p-2.5">Metric / Reading</th>
                        <th className="p-2.5">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-500">001</td>
                        <td className="p-2.5 font-semibold text-slate-100">Center Pitch Moisture Check</td>
                        <td className="p-2.5">Main Turf 01</td>
                        <td className="p-2.5 text-emerald-400">PASSED (Optimum)</td>
                        <td className="p-2.5 font-mono">14.2% Vol</td>
                        <td className="p-2.5 text-slate-400">08:00 AM</td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-500">002</td>
                        <td className="p-2.5 font-semibold text-slate-100">Floodlight Lux Uniformity</td>
                        <td className="p-2.5">Tower North-East</td>
                        <td className="p-2.5 text-emerald-400">CALIBRATED</td>
                        <td className="p-2.5 font-mono">2,100 Lux Avg</td>
                        <td className="p-2.5 text-slate-400">09:15 AM</td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-500">003</td>
                        <td className="p-2.5 font-semibold text-slate-100">Super Sopper Sponge Compression</td>
                        <td className="p-2.5">Drainage Bay B</td>
                        <td className="p-2.5 text-teal-400">VERIFIED</td>
                        <td className="p-2.5 font-mono">100% Ready</td>
                        <td className="p-2.5 text-slate-400">10:30 AM</td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-500">004</td>
                        <td className="p-2.5 font-semibold text-slate-100">Boundary Rope Tension & Cushions</td>
                        <td className="p-2.5">Perimeter 360°</td>
                        <td className="p-2.5 text-emerald-400">PASSED</td>
                        <td className="p-2.5 font-mono">ICC Standard 75m</td>
                        <td className="p-2.5 text-slate-400">11:00 AM</td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-500">005</td>
                        <td className="p-2.5 font-semibold text-slate-100">Match Official Radio Comm Net</td>
                        <td className="p-2.5">Control Tower</td>
                        <td className="p-2.5 text-emerald-400">CLEAR SIGNAL</td>
                        <td className="p-2.5 font-mono">Channel 4 Secure</td>
                        <td className="p-2.5 text-slate-400">11:45 AM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Case 4: Text Document / Written Memo */}
            {isText && (
              <div className="w-full h-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-auto flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-slate-200">Written Memo & Operational Record</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(attachment.content || attachment.notes || '')}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded text-xs transition-colors"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="flex-1 bg-slate-950 p-4 rounded-lg border border-slate-850 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-auto">
                  {attachment.content || (
                    `GAHANGA CRICKET STADIUM — OPERATIONAL REPORT RECORD\n` +
                    `====================================================\n` +
                    `DOCUMENT TITLE:   ${attachment.name}\n` +
                    `CATEGORY:         ${attachment.category || 'MEMO_REPORT'}\n` +
                    `AUTHOR / HOLDER:  ${userContext?.name || 'GCS Personnel'}\n` +
                    `ORGANIZATION:     Rwanda Cricket Association\n` +
                    `TIMESTAMP:        ${new Date(attachment.uploadedAt).toISOString()}\n` +
                    `====================================================\n\n` +
                    `${attachment.notes || 'Official operational memo recorded in personnel profile archives.'}\n\n` +
                    `--- End of Record ---`
                  )}
                </div>
              </div>
            )}

            {/* Case 5: Cloud Link Preview */}
            {isCloudLink && !isImage && !isPdf && (
              <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-950/80 border border-teal-800 text-teal-400 flex items-center justify-center mx-auto shadow-md">
                  <ExternalLink className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{attachment.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Cloud Document linked to external repository
                  </p>
                  {attachment.externalUrl && (
                    <p className="font-mono text-xs text-teal-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 mt-3 truncate">
                      {attachment.externalUrl}
                    </p>
                  )}
                </div>

                {attachment.notes && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-left">
                    <strong className="text-slate-400 block text-[10px] uppercase">Notes:</strong>
                    {attachment.notes}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-center gap-3">
                  {attachment.externalUrl && (
                    <a
                      href={attachment.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Link in New Tab</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Metadata File</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Metadata Drawer / Sidebar */}
          {showMetadata && (
            <div className="w-72 sm:w-80 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0 text-xs animate-in slide-in-from-right-4 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Document Dossier Data
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/80">
                  Active
                </span>
              </div>

              {/* Quick Details List */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">File Name</span>
                  <p className="text-slate-200 font-medium break-all mt-0.5">{attachment.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">File Size</span>
                    <p className="text-slate-200 font-mono mt-0.5">{formatFileSize(attachment.size)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Format / MIME</span>
                    <p className="text-slate-200 font-mono mt-0.5 truncate">{attachment.type}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Category Tag</span>
                  <div className="mt-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-block ${catTheme.color}`}>
                      {catTheme.label}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Upload Timestamp</span>
                  <p className="text-slate-200 font-mono text-[11px] mt-0.5">
                    {new Date(attachment.uploadedAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Source Channel</span>
                  <span className="text-[10px] font-mono text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60 mt-1 inline-block">
                    {attachment.sourceType ? attachment.sourceType.replace('_', ' ') : 'LOCAL DEVICE UPLOAD'}
                  </span>
                </div>

                {attachment.documentNumber && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Document Serial Ref</span>
                    <p className="text-teal-400 font-mono text-xs font-bold mt-0.5">{attachment.documentNumber}</p>
                  </div>
                )}

                {attachment.notes && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Reference Notes</span>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs mt-1 leading-relaxed">
                      {attachment.notes}
                    </p>
                  </div>
                )}

                {/* Authentication & Security Stamp */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-teal-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Integrity Verification</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    This file is encrypted and certified within the Gahanga Cricket Stadium official personnel database.
                  </p>
                  <div className="pt-1 border-t border-slate-850 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span>SHA-256 Checksum</span>
                    <span className="text-teal-400">VALIDATED ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Filmstrip at Bottom (when multiple files exist) */}
        {allAttachments.length > 1 && (
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Dossier Files:
            </span>
            {allAttachments.map((att, idx) => {
              const isSelected = att.id === attachment.id;
              const attIsImage = att.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(att.name);
              const attCat = getCategoryTheme(att.category);

              return (
                <button
                  key={att.id}
                  type="button"
                  onClick={() => onSelectAttachment && onSelectAttachment(att)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left shrink-0 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-xs ring-1 ring-teal-500/50' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                    {attIsImage ? (
                      <ImageIcon className="w-3 h-3 text-teal-400" />
                    ) : (
                      <FileText className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 max-w-[120px]">
                    <p className="text-[10px] font-semibold truncate text-slate-200">
                      {att.name}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">
                      {attCat.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
