import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X, 
  MapPin, 
  Package, 
  Layers, 
  ShieldCheck, 
  Calendar,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { InventoryItem } from '../../types';

interface InventoryQrModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const InventoryQrModal: React.FC<InventoryQrModalProps> = ({
  item,
  isOpen,
  onClose,
  onShowToast
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [printLayout, setPrintLayout] = useState<'label' | 'badge'>('label');
  const printContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item || !isOpen) return;

    // Structured JSON payload for high-speed scanning & audit-grade traceability
    const payload = JSON.stringify({
      facility: 'GAHANGA_CRICKET_STADIUM',
      system: 'GCS_OPERATIONS_SUITE',
      sku: item.sku,
      id: item.id,
      name: item.name,
      category: item.category,
      type: item.type,
      location: item.location,
      unit: item.unit,
      threshold: item.reorderThreshold,
      generatedAt: new Date().toISOString()
    });

    QRCode.toDataURL(payload, {
      width: 380,
      margin: 2,
      color: {
        dark: '#042f2e', // Deep Teal / Cricket turf tone
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleCopyPayload = async () => {
    const payloadText = JSON.stringify({
      sku: item.sku,
      name: item.name,
      location: item.location,
      available: item.availableQuantity,
      unit: item.unit,
      facility: 'Gahanga Cricket Stadium, Kigali'
    }, null, 2);

    try {
      await navigator.clipboard.writeText(payloadText);
      setCopied(true);
      if (onShowToast) {
        onShowToast('success', 'Payload Copied', `Copied QR metadata for ${item.sku}`);
      }
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (onShowToast) {
        onShowToast('error', 'Clipboard Error', 'Could not copy to clipboard.');
      }
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${item.sku}_GahangaStadium.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (onShowToast) {
      onShowToast('success', 'QR Code Downloaded', `Saved PNG for ${item.sku}`);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=650,height=600');
    if (!printWindow) {
      if (onShowToast) {
        onShowToast('error', 'Popup Blocked', 'Please allow popups to print equipment labels.');
      }
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GCS Equipment Tag - ${item.sku}</title>
          <style>
            @page {
              size: 4in 3in;
              margin: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 14px;
              background: #fff;
              color: #0f172a;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .tag {
              border: 2px solid #0f766e;
              border-radius: 8px;
              padding: 12px;
              width: 100%;
              max-width: 360px;
              background: #fff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #0f766e;
              padding-bottom: 6px;
              margin-bottom: 8px;
            }
            .title {
              font-size: 14px;
              font-weight: 800;
              color: #0f766e;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .subtitle {
              font-size: 9px;
              color: #475569;
              font-weight: 600;
            }
            .body {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .qr-img {
              width: 120px;
              height: 120px;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 4px;
            }
            .details {
              flex: 1;
              font-size: 11px;
            }
            .item-name {
              font-size: 13px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 4px;
              line-height: 1.2;
            }
            .sku-badge {
              display: inline-block;
              font-family: monospace;
              font-size: 12px;
              font-weight: 700;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 2px 6px;
              border-radius: 4px;
              margin-bottom: 6px;
            }
            .meta-row {
              margin: 2px 0;
              color: #334155;
            }
            .footer {
              margin-top: 8px;
              border-top: 1px dashed #cbd5e1;
              padding-top: 4px;
              font-size: 8px;
              color: #64748b;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="tag">
            <div class="header">
              <div>
                <div class="title">Gahanga Cricket Stadium</div>
                <div class="subtitle">Kigali, Rwanda · Inventory Asset Control</div>
              </div>
              <div style="font-size: 10px; font-weight: bold; background: #0f766e; color: #fff; padding: 2px 6px; border-radius: 3px;">
                ICC VENUE
              </div>
            </div>
            <div class="body">
              <img src="${qrDataUrl}" class="qr-img" alt="QR Code" />
              <div class="details">
                <div class="item-name">${item.name}</div>
                <div class="sku-badge">${item.sku}</div>
                <div class="meta-row"><strong>Category:</strong> ${item.category}</div>
                <div class="meta-row"><strong>Bay/Location:</strong> ${item.location}</div>
                <div class="meta-row"><strong>Type:</strong> ${item.type === 'CONSUMABLE' ? 'Consumable' : 'Reusable Asset'}</div>
                ${item.condition ? `<div class="meta-row"><strong>Condition:</strong> ${item.condition}</div>` : ''}
              </div>
            </div>
            <div class="footer">
              <span>Authorized Rwanda Cricket Operations</span>
              <span>Scanned via GCS Mobile Scanner</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const isLowStock = item.availableQuantity <= item.reorderThreshold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Inventory QR Code & Asset Tag</span>
                <span className="text-[10px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  OFFICIAL
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Print physical labels or scan on mobile to inspect stock instantaneously
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Printable Card Preview */}
          <div 
            ref={printContainerRef}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/30 border-2 border-teal-500/30 shadow-xl relative overflow-hidden"
          >
            {/* Watermark Logo */}
            <div className="absolute top-2 right-3 text-[10px] font-mono tracking-widest text-teal-500/40 uppercase font-black">
              GCS-ASSET-CONTROL
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* QR Image Container */}
              <div className="relative p-2.5 bg-white rounded-xl shadow-lg shrink-0 border border-slate-200">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt={`QR for ${item.sku}`} 
                    className="w-40 h-40 object-contain rounded-md"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-slate-400">
                    <span className="animate-pulse text-xs">Generating QR...</span>
                  </div>
                )}
                <div className="mt-1 text-center font-mono font-bold text-[10px] text-teal-950 tracking-wider">
                  {item.sku}
                </div>
              </div>

              {/* Item Metadata Details */}
              <div className="flex-1 space-y-3 text-left w-full">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-teal-300 border border-slate-700 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Available Quantity</span>
                    <span className={`font-mono font-bold text-sm ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {item.availableQuantity} {item.unit}
                    </span>
                    {isLowStock && (
                      <span className="text-[10px] text-amber-500 block flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> Reorder Alert
                      </span>
                    )}
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Item Class</span>
                    <span className="font-semibold text-slate-200 text-xs block">
                      {item.type === 'CONSUMABLE' ? 'Consumable' : 'Reusable Asset'}
                    </span>
                    {item.condition && (
                      <span className="text-[10px] text-teal-400 font-mono block mt-0.5">
                        Condition: {item.condition}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Badge */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                ICC Certified Stadium Inventory Facility
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                Last Count: {item.lastCountedDate || '2026-10-15'}
              </span>
            </div>
          </div>

          {/* Tag Printing Options */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-teal-400" />
                Physical Bin & Equipment Tag Printing
              </span>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPrintLayout('label')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                    printLayout === 'label'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3×4" Equipment Label
                </button>
                <button
                  type="button"
                  onClick={() => setPrintLayout('badge')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                    printLayout === 'badge'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Compact Bin Tag
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Print thermal adhesive stickers to mount directly on machinery rollers, pitch grass seed sacks, cricket ball boxes, and maintenance carts around Gahanga stadium.
            </p>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyPayload}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy SKU Payload</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={!qrDataUrl}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print Asset Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
